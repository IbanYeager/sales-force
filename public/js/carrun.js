// ═══════════════════════════════════════════════
//  TOYOTA GR — Car Runner Minigame
//  A polished Dino-Run style game with parallax
//  scenery, particle effects, and speed boost.
// ═══════════════════════════════════════════════

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('scoreEl');
const highScoreEl = document.getElementById('highScoreEl');
const finalScoreEl = document.getElementById('finalScore');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const speedBar = document.getElementById('speedBar');
const newRecordBadge = document.getElementById('newRecordBadge');
const obstaclesPassedEl = document.getElementById('obstaclesPassed');
const statDistanceEl = document.getElementById('statDistance');
const statObstaclesEl = document.getElementById('statObstacles');
const statJumpsEl = document.getElementById('statJumps');

function resizeCanvas() {
  const wrap = document.getElementById('canvasWrap');
  if (!wrap) return;
  const w = wrap.clientWidth;
  const ratio = 800 / 260;
  canvas.style.width = w + 'px';
  canvas.style.height = (w / ratio) + 'px';
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const GRAVITY = 0.58;
const MIN_JUMP_IMPULSE = -7.5;
const HOLD_JUMP_BOOST = -0.42;
const MAX_HOLD_FRAMES = 12;
const GROUND_Y = 210;
const INITIAL_SPEED = 4.5;
const MAX_SPEED = 16.5;
const W = 800;
const H = 260;

let gameLoop;
let isPlaying = false;
let score = 0;
let highScore = parseInt(localStorage.getItem('carRunHighScore')) || 0;
let gameSpeed = INITIAL_SPEED;
let frameCount = 0;
let jumpCount = 0;
let obstaclesPassed = 0;
let screenShake = 0;

if (highScoreEl) highScoreEl.innerText = highScore.toString().padStart(5, '0');

const clouds = [];
for (let i = 0; i < 6; i++) {
  clouds.push({
    x: Math.random() * W,
    y: 20 + Math.random() * 50,
    w: 40 + Math.random() * 60,
    h: 14 + Math.random() * 10,
    speed: 0.15 + Math.random() * 0.25,
    opacity: 0.25 + Math.random() * 0.35
  });
}

const mountains = [];
for (let i = 0; i < 8; i++) {
  mountains.push({
    x: i * 120 + Math.random() * 40,
    h: 40 + Math.random() * 40,
    w: 80 + Math.random() * 60
  });
}

const buildings = [];
for (let i = 0; i < 12; i++) {
  buildings.push({
    x: i * 80 + Math.random() * 30,
    h: 25 + Math.random() * 55,
    w: 30 + Math.random() * 30
  });
}

let particles = [];

function spawnDust(x, y) {
  for (let i = 0; i < 4; i++) {
    particles.push({
      x: x,
      y: y,
      dx: -(Math.random() * 2 + 1),
      dy: -(Math.random() * 1.5),
      life: 18 + Math.random() * 10,
      maxLife: 28,
      size: 2 + Math.random() * 3,
      type: 'dust'
    });
  }
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 16; i++) {
    const angle = (Math.PI * 2 / 16) * i;
    const speed = 1.5 + Math.random() * 3;
    particles.push({
      x: x, y: y,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      life: 25 + Math.random() * 15,
      maxLife: 40,
      size: 2 + Math.random() * 4,
      type: 'explosion'
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.dx;
    p.y += p.dy;
    p.life--;
    if (p.type === 'dust') p.dy -= 0.02;
    if (p.type === 'explosion') { p.dy += 0.08; p.dx *= 0.97; }
    
    const alpha = Math.max(0, p.life / p.maxLife);
    if (p.type === 'dust') {
      ctx.fillStyle = `rgba(180, 160, 140, ${alpha * 0.6})`;
    } else {
      const r = 200 + Math.floor(Math.random() * 55);
      ctx.fillStyle = `rgba(${r}, ${80 + Math.floor(Math.random()*60)}, 0, ${alpha})`;
    }
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    
    if (p.life <= 0) particles.splice(i, 1);
  }
}

const car = {
  x: 80,
  y: GROUND_Y - 32,
  width: 64,
  height: 32,
  dy: 0,
  isGrounded: true,
  tilt: 0,
  wheelAngle: 0,
  isHoldingJump: false,
  jumpHoldFrames: 0,

  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate(this.tilt);

    const cx = -this.width / 2;
    const cy = -this.height / 2;

    ctx.fillStyle = 'rgba(0,0,0,0.10)';
    ctx.beginPath();
    ctx.ellipse(0, this.height / 2 + 6, this.width / 2 + 4, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const bodyGrad = ctx.createLinearGradient(cx, cy + 8, cx, cy + this.height);
    bodyGrad.addColorStop(0, '#e00000');
    bodyGrad.addColorStop(1, '#990000');
    ctx.fillStyle = bodyGrad;
    roundRect(ctx, cx, cy + 8, this.width, this.height - 8, 4);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    roundRect(ctx, cx + 2, cy + 9, this.width - 4, 6, 2);
    ctx.fill();

    const cabinGrad = ctx.createLinearGradient(cx + 16, cy, cx + 16, cy + 14);
    cabinGrad.addColorStop(0, '#cc0000');
    cabinGrad.addColorStop(1, '#aa0000');
    ctx.fillStyle = cabinGrad;
    ctx.beginPath();
    ctx.moveTo(cx + 14, cy + 12);
    ctx.lineTo(cx + 20, cy);
    ctx.lineTo(cx + 46, cy);
    ctx.lineTo(cx + 50, cy + 12);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#4fc3f7';
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.moveTo(cx + 17, cy + 11);
    ctx.lineTo(cx + 21, cy + 2);
    ctx.lineTo(cx + 30, cy + 2);
    ctx.lineTo(cx + 30, cy + 11);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(cx + 33, cy + 11);
    ctx.lineTo(cx + 33, cy + 2);
    ctx.lineTo(cx + 44, cy + 2);
    ctx.lineTo(cx + 48, cy + 11);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(cx + 34, cy + 3, 2, 7);

    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx + this.width - 4, cy + 14, 4, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(cx, cy + 14, 3, 6);

    ctx.fillStyle = '#334155';
    roundRect(ctx, cx + this.width - 2, cy + 12, 4, 14, 1);
    ctx.fill();

    this.wheelAngle += gameSpeed * 0.15;
    drawWheel(ctx, cx + 14, cy + this.height, 9, this.wheelAngle);
    drawWheel(ctx, cx + this.width - 14, cy + this.height, 9, this.wheelAngle);

    ctx.restore();

    if (this.isGrounded && isPlaying && frameCount % 3 === 0) {
      spawnDust(this.x + 5, GROUND_Y + 6);
    }
  },

  update() {
    if (!this.isGrounded) {
      if (this.isHoldingJump && this.jumpHoldFrames < MAX_HOLD_FRAMES && this.dy < 0) {
        this.dy += HOLD_JUMP_BOOST;
        this.jumpHoldFrames++;
      }

      this.dy += GRAVITY;
      this.y += this.dy;
      this.tilt = Math.max(-0.15, Math.min(0.08, this.dy * 0.012));
    } else {
      this.tilt *= 0.85;
      this.isHoldingJump = false;
      this.jumpHoldFrames = 0;
    }

    if (this.y >= GROUND_Y - this.height) {
      this.y = GROUND_Y - this.height;
      if (!this.isGrounded) {
        spawnDust(this.x + 10, GROUND_Y + 4);
        spawnDust(this.x + this.width - 10, GROUND_Y + 4);
      }
      this.dy = 0;
      this.isGrounded = true;
      this.isHoldingJump = false;
      this.jumpHoldFrames = 0;
    }
  },

  jumpStart() {
    if (this.isGrounded) {
      this.dy = MIN_JUMP_IMPULSE;
      this.isGrounded = false;
      this.isHoldingJump = true;
      this.jumpHoldFrames = 0;
      jumpCount++;
      if (statJumpsEl) statJumpsEl.innerText = jumpCount;
    }
  },

  jumpEnd() {
    this.isHoldingJump = false;
    if (this.dy < -3.2) {
      this.dy *= 0.42;
    }
  },

  jump() {
    this.jumpStart();
  }
};

function drawWheel(ctx, x, y, r, angle) {
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    const a = angle + (Math.PI / 2) * i;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r * 0.45, y + Math.sin(a) * r * 0.45);
    ctx.stroke();
  }
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

let obstacles = [];

function spawnObstacle() {
  if (obstacles.length > 0) {
    const lastObs = obstacles[obstacles.length - 1];
    const minSafeDist = Math.max(180, 240 + gameSpeed * 5 - Math.min(80, score / 4));
    if ((W + 20) - (lastObs.x + lastObs.width) < minSafeDist) {
      return;
    }
  }

  const rand = Math.random();
  let type, width, height, y;
  
  const allowBird = (gameSpeed >= 6.2 || score >= 50);
  const birdProb = allowBird ? Math.min(0.40, 0.20 + (score / 600)) : 0;

  if (allowBird && rand < birdProb) {
    type = 'bird';
    width = 34;
    height = 22;
    y = GROUND_Y - (Math.random() > 0.45 ? 58 : 78);
  } else if (rand < birdProb + 0.25) {
    type = 'cone';
    width = 22;
    height = 32;
    y = GROUND_Y - height;
  } else if (rand < birdProb + 0.45) {
    type = 'rock';
    width = 34;
    height = 26;
    y = GROUND_Y - height;
  } else if (rand < birdProb + 0.65) {
    type = 'barrel';
    width = 24;
    height = 30;
    y = GROUND_Y - height;
  } else {
    type = 'doublecone';
    width = 44;
    height = 32;
    y = GROUND_Y - height;
  }

  obstacles.push({
    x: W + 20,
    y: y,
    width, height, type,
    passed: false
  });
}

function drawObstacles() {
  for (let i = 0; i < obstacles.length; i++) {
    const obs = obstacles[i];
    obs.x -= gameSpeed;

    if (obs.type === 'cone' || obs.type === 'doublecone') {
      drawCone(obs.x, obs.y, obs.type === 'doublecone');
      if (obs.type === 'doublecone') drawCone(obs.x + 22, obs.y, false);
    } else if (obs.type === 'rock') {
      drawRock(obs.x, obs.y, obs.width, obs.height);
    } else if (obs.type === 'barrel') {
      drawBarrel(obs.x, obs.y);
    } else if (obs.type === 'bird') {
      drawBird(obs.x, obs.y);
    }

    const m = 6;
    if (
      car.x + car.width - m > obs.x + m &&
      car.x + m < obs.x + obs.width - m &&
      car.y + car.height - m > obs.y + m &&
      car.y + m < obs.y + obs.height - m
    ) {
      spawnExplosion(car.x + car.width / 2, car.y + car.height / 2);
      screenShake = 10;
      gameOver();
      return;
    }

    if (!obs.passed && obs.x + obs.width < car.x) {
      obs.passed = true;
      obstaclesPassed++;
      if (statObstaclesEl) statObstaclesEl.innerText = obstaclesPassed;
    }
  }

  while (obstacles.length > 0 && obstacles[0].x < -60) obstacles.shift();
}

function drawBird(x, y) {
  ctx.save();
  const flap = Math.sin(frameCount * 0.28) * 9;

  // Body
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.ellipse(x + 16, y + 11, 11, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.arc(x + 6, y + 9, 5, 0, Math.PI * 2);
  ctx.fill();

  // Beak
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.moveTo(x + 2, y + 9);
  ctx.lineTo(x - 5, y + 11);
  ctx.lineTo(x + 2, y + 12);
  ctx.fill();

  // Eye
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + 5, y + 8, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Wing Top
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 9);
  ctx.lineTo(x + 22, y + 9 - flap);
  ctx.lineTo(x + 26, y + 11);
  ctx.closePath();
  ctx.fill();

  // Wing Bottom
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(x + 14, y + 13);
  ctx.lineTo(x + 20, y + 13 + flap * 0.5);
  ctx.lineTo(x + 24, y + 13);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawCone(x, y) {
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(x + 11, y);
  ctx.lineTo(x + 22, y + 32);
  ctx.lineTo(x, y + 32);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fillRect(x + 4, y + 10, 14, 5);
  ctx.fillRect(x + 2, y + 20, 18, 5);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(x + 11, y + 33, 12, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawRock(x, y, w, h) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#78716c');
  g.addColorStop(1, '#57534e');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(x + 4, y + h);
  ctx.lineTo(x, y + h * 0.5);
  ctx.quadraticCurveTo(x + w * 0.2, y - 2, x + w * 0.5, y);
  ctx.quadraticCurveTo(x + w * 0.8, y - 2, x + w, y + h * 0.4);
  ctx.lineTo(x + w - 2, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  ctx.beginPath();
  ctx.arc(x + w * 0.35, y + h * 0.35, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h + 2, w / 2 + 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBarrel(x, y) {
  const g = ctx.createLinearGradient(x, y, x + 24, y);
  g.addColorStop(0, '#dc2626');
  g.addColorStop(0.5, '#ef4444');
  g.addColorStop(1, '#b91c1c');
  ctx.fillStyle = g;
  roundRect(ctx, x, y, 24, 30, 3);
  ctx.fill();
  ctx.fillStyle = '#334155';
  ctx.fillRect(x, y + 5, 24, 3);
  ctx.fillRect(x, y + 22, 24, 3);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(x + 3, y + 1, 3, 28);
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  ctx.beginPath();
  ctx.ellipse(x + 12, y + 31, 13, 3, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawBackground() {
  const t = Math.min(1, score / 600);
  const skyTop = lerpColor([135, 206, 250], [30, 41, 82], t * 0.4);
  const skyBot = lerpColor([224, 242, 254], [60, 80, 140], t * 0.4);
  const grad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
  grad.addColorStop(0, `rgb(${skyTop[0]},${skyTop[1]},${skyTop[2]})`);
  grad.addColorStop(1, `rgb(${skyBot[0]},${skyBot[1]},${skyBot[2]})`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, GROUND_Y);

  mountains.forEach(m => {
    const mx = ((m.x - frameCount * 0.3) % (W + 200) + W + 200) % (W + 200) - 100;
    ctx.fillStyle = `rgba(100, 120, 160, ${0.15 + t * 0.1})`;
    ctx.beginPath();
    ctx.moveTo(mx, GROUND_Y);
    ctx.lineTo(mx + m.w / 2, GROUND_Y - m.h);
    ctx.lineTo(mx + m.w, GROUND_Y);
    ctx.closePath();
    ctx.fill();
  });

  buildings.forEach(b => {
    const bx = ((b.x - frameCount * 0.7) % (W + 200) + W + 200) % (W + 200) - 100;
    ctx.fillStyle = `rgba(71, 85, 105, ${0.12 + t * 0.08})`;
    ctx.fillRect(bx, GROUND_Y - b.h, b.w, b.h);
    ctx.fillStyle = `rgba(251, 191, 36, ${0.15 + t * 0.3})`;
    for (let wy = GROUND_Y - b.h + 6; wy < GROUND_Y - 6; wy += 10) {
      for (let wx = bx + 5; wx < bx + b.w - 5; wx += 9) {
        ctx.fillRect(wx, wy, 4, 5);
      }
    }
  });

  clouds.forEach(c => {
    c.x -= c.speed;
    if (c.x + c.w < 0) c.x = W + Math.random() * 100;
    ctx.fillStyle = `rgba(255,255,255,${c.opacity})`;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w / 2, c.h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x - c.w * 0.25, c.y + 3, c.w * 0.3, c.h * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(c.x + c.w * 0.25, c.y + 2, c.w * 0.35, c.h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  const roadGrad = ctx.createLinearGradient(0, GROUND_Y, 0, H);
  roadGrad.addColorStop(0, '#64748b');
  roadGrad.addColorStop(0.15, '#475569');
  roadGrad.addColorStop(1, '#334155');
  ctx.fillStyle = roadGrad;
  ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, GROUND_Y, W, 2);

  ctx.fillStyle = '#cbd5e1';
  const dashW = 30;
  const gapW = 25;
  const offset = (frameCount * gameSpeed) % (dashW + gapW);
  for (let dx = -offset; dx < W; dx += dashW + gapW) {
    ctx.fillRect(dx, GROUND_Y + 22, dashW, 4);
  }

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, H - 2, W, 2);
}

function lerpColor(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t)
  ];
}

function updateScore() {
  score += 0.12;
  const s = Math.floor(score);
  if (scoreEl) scoreEl.innerText = s.toString().padStart(5, '0');
  if (statDistanceEl) statDistanceEl.innerText = (s * 10) + ' m';

  if (gameSpeed < MAX_SPEED) {
    gameSpeed = INITIAL_SPEED + (score / 110);
  }

  if (speedBar) {
    const pct = Math.min(100, ((gameSpeed - INITIAL_SPEED) / (MAX_SPEED - INITIAL_SPEED)) * 100);
    speedBar.style.width = pct + '%';
  }

  if (s > 0 && s % 100 === 0 && frameCount % 60 < 2) {
    screenShake = 3;
  }
}

function update() {
  if (!isPlaying) return;

  let shakeX = 0, shakeY = 0;
  if (screenShake > 0) {
    shakeX = (Math.random() - 0.5) * screenShake * 2;
    shakeY = (Math.random() - 0.5) * screenShake * 2;
    screenShake -= 0.5;
  }

  ctx.save();
  ctx.translate(shakeX, shakeY);
  ctx.clearRect(-10, -10, W + 20, H + 20);

  drawBackground();
  car.update();
  car.draw();
  drawObstacles();
  updateParticles();
  updateScore();

  ctx.restore();
  frameCount++;

  // Dynamic progressive spawn interval: shrinks from 85 frames down to 28 frames as score rises!
  const baseInterval = Math.max(28, 85 - (score / 6.5));
  const randomVariation = Math.max(12, 30 - (score / 15));
  if (frameCount % Math.floor(baseInterval + Math.random() * randomVariation) === 0) {
    spawnObstacle();
  }

  gameLoop = requestAnimationFrame(update);
}

function startGame() {
  if (startOverlay) startOverlay.classList.add('hidden');
  if (gameOverOverlay) gameOverOverlay.classList.add('hidden');
  if (newRecordBadge) newRecordBadge.style.display = 'none';

  car.y = GROUND_Y - car.height;
  car.dy = 0;
  car.isGrounded = true;
  car.tilt = 0;
  car.wheelAngle = 0;
  car.isHoldingJump = false;
  car.jumpHoldFrames = 0;

  obstacles = [];
  particles = [];
  score = 0;
  gameSpeed = INITIAL_SPEED;
  frameCount = 0;
  jumpCount = 0;
  obstaclesPassed = 0;
  screenShake = 0;
  isPlaying = true;

  if (scoreEl) scoreEl.innerText = '00000';
  if (statDistanceEl) statDistanceEl.innerText = '0 m';
  if (statObstaclesEl) statObstaclesEl.innerText = '0';
  if (statJumpsEl) statJumpsEl.innerText = '0';
  if (speedBar) speedBar.style.width = '0%';

  if (gameLoop) cancelAnimationFrame(gameLoop);
  update();
}

function gameOver() {
  isPlaying = false;
  cancelAnimationFrame(gameLoop);

  const finalVal = Math.floor(score);
  if (finalScoreEl) finalScoreEl.innerText = finalVal;
  if (obstaclesPassedEl) obstaclesPassedEl.innerText = obstaclesPassed;

  if (finalVal > highScore) {
    highScore = finalVal;
    localStorage.setItem('carRunHighScore', highScore);
    if (highScoreEl) highScoreEl.innerText = highScore.toString().padStart(5, '0');
    if (newRecordBadge) newRecordBadge.style.display = 'block';
  } else {
    if (newRecordBadge) newRecordBadge.style.display = 'none';
  }

  if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
}

window.addEventListener('keydown', (e) => {
  if ((e.code === 'Space' || e.code === 'ArrowUp') && !e.repeat) {
    e.preventDefault();
    if (isPlaying) {
      car.jumpStart();
    }
  }
});

window.addEventListener('keyup', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    e.preventDefault();
    if (isPlaying) {
      car.jumpEnd();
    }
  }
});

const canvasWrap = document.getElementById('canvasWrap');
if (canvasWrap) {
  canvasWrap.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (isPlaying) car.jumpStart();
  }, { passive: false });

  canvasWrap.addEventListener('touchend', (e) => {
    e.preventDefault();
    if (isPlaying) car.jumpEnd();
  }, { passive: false });

  canvasWrap.addEventListener('mousedown', (e) => {
    if (isPlaying) car.jumpStart();
  });

  window.addEventListener('mouseup', (e) => {
    if (isPlaying) car.jumpEnd();
  });
}
