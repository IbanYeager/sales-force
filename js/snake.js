// ═══════════════════════════════════════════════
//  TOYOTA PARKING DRIFT & FUEL RUSH (SNAKE GAME)
//  Theme: Car (Head) + Tire Skid Marks (Tail) + Fuel Canister (Food)
//  Premium Visual Overhaul
// ═══════════════════════════════════════════════

const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('snakeScore');
const fuelCountEl = document.getElementById('snakeFuelCount');
const highScoreEl = document.getElementById('snakeHighScore');
const startOverlay = document.getElementById('startOverlay');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const finalScoreValEl = document.getElementById('finalScoreVal');
const gameOverReasonEl = document.getElementById('gameOverReason');

const GRID_SIZE = 20;
const CELL_SIZE = canvas.width / GRID_SIZE; // 30px

let isPlaying = false;
let score = 0;
let fuelCount = 0;
let highScore = parseInt(localStorage.getItem('toyotaSnakeHighScore')) || 0;
let gameSpeedMs = 130;

let carSnake = [];
let dir = { x: 1, y: 0 };
let nextDir = { x: 1, y: 0 };

let fuelItem = { x: 15, y: 10, type: 'normal' };
let particles = [];
let frameCounter = 0;

// Smooth interpolation state
let prevSnake = [];   // snapshot of snake positions BEFORE last logic tick
let lastTickTime = 0; // timestamp of last logic tick
let animFrameId = null;

if (highScoreEl) highScoreEl.innerText = highScore.toString().padStart(3, '0');

// Resize
function resizeSnakeCanvas() {
  const wrap = document.getElementById('canvasWrap');
  if (!wrap) return;
  const w = wrap.clientWidth;
  canvas.style.width = w + 'px';
  canvas.style.height = w + 'px';
}
resizeSnakeCanvas();
window.addEventListener('resize', resizeSnakeCanvas);

// ═══════════════════════════════════════
//  BACKGROUND — Realistic Parking Lot
// ═══════════════════════════════════════
function drawParkingBackground() {
  const C = CELL_SIZE;

  // 1. Asphalt base — dark grey with subtle noise texture
  ctx.fillStyle = '#2d3748';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Asphalt noise texture speckles
  ctx.fillStyle = 'rgba(255,255,255,0.018)';
  for (let i = 0; i < 200; i++) {
    const sx = Math.random() * canvas.width;
    const sy = Math.random() * canvas.height;
    ctx.fillRect(sx, sy, 2, 2);
  }

  // 2. Parking bay painted lines (white dashed)
  ctx.strokeStyle = 'rgba(255,255,255,0.18)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([8, 6]);

  // Vertical parking rows
  for (let col = 0; col <= GRID_SIZE; col++) {
    ctx.beginPath();
    ctx.moveTo(col * C, 0);
    ctx.lineTo(col * C, canvas.height);
    ctx.stroke();
  }
  // Horizontal parking rows
  for (let row = 0; row <= GRID_SIZE; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * C);
    ctx.lineTo(canvas.width, row * C);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // 3. Parking bay solid white markings at intervals (slotted stalls)
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (let col = 1; col < GRID_SIZE; col += 4) {
    // Top stall row
    ctx.beginPath();
    ctx.moveTo(col * C, 0);
    ctx.lineTo(col * C, 3 * C);
    ctx.stroke();
    // Bottom stall row
    ctx.beginPath();
    ctx.moveTo(col * C, canvas.height - 3 * C);
    ctx.lineTo(col * C, canvas.height);
    ctx.stroke();
  }

  // 4. Yellow curb lines (parking lot border hazard stripes)
  ctx.lineWidth = 5;
  const stripeW = 16;
  ctx.strokeStyle = '#eab308';
  ctx.setLineDash([stripeW, stripeW]);
  ctx.strokeRect(3, 3, canvas.width - 6, canvas.height - 6);
  ctx.setLineDash([]);

  // Inner red safety line
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
  ctx.lineWidth = 2;
  ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);

  // 5. "P" parking icon watermarks in background
  ctx.font = 'bold 50px Inter, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  ctx.fillText('P', 5 * C, 5 * C);
  ctx.fillText('P', 15 * C, 5 * C);
  ctx.fillText('P', 5 * C, 15 * C);
  ctx.fillText('P', 15 * C, 15 * C);

  // 6. Small directional arrows on the asphalt
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  drawArrowMark(10 * C, 3 * C, 0);      // pointing right
  drawArrowMark(10 * C, 17 * C, Math.PI); // pointing left
}

function drawArrowMark(x, y, rot) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(20, 0);
  ctx.lineTo(-10, -12);
  ctx.lineTo(-4, 0);
  ctx.lineTo(-10, 12);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// ═══════════════════════════════════════
//  FUEL CANISTER — Detailed Jerigen Bensin
// ═══════════════════════════════════════
function drawFuel() {
  const C = CELL_SIZE;
  const px = fuelItem.x * C;
  const py = fuelItem.y * C;

  ctx.save();
  ctx.translate(px + C / 2, py + C / 2);

  // Pulse scale animation
  const pulse = 1 + Math.sin(frameCounter * 0.14) * 0.06;
  ctx.scale(pulse, pulse);

  const isGold = fuelItem.type === 'golden';

  // Glow ring aura
  const glowRadius = C * 0.55;
  const glow = ctx.createRadialGradient(0, 0, 2, 0, 0, glowRadius);
  glow.addColorStop(0, isGold ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.3)');
  glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
  ctx.fill();

  // Canister body dimensions
  const bw = 16, bh = 20;

  // Shadow underneath
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(1, bh / 2 + 2, bw / 2, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Main body gradient
  const bodyGrad = ctx.createLinearGradient(-bw / 2, -bh / 2, bw / 2, bh / 2);
  if (isGold) {
    bodyGrad.addColorStop(0, '#fbbf24');
    bodyGrad.addColorStop(0.5, '#f59e0b');
    bodyGrad.addColorStop(1, '#d97706');
  } else {
    bodyGrad.addColorStop(0, '#ef4444');
    bodyGrad.addColorStop(0.5, '#dc2626');
    bodyGrad.addColorStop(1, '#991b1b');
  }
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, -bw / 2, -bh / 2 + 2, bw, bh, 3);
  ctx.fill();

  // Metal bands
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.fillRect(-bw / 2, -bh / 2 + 6, bw, 2);
  ctx.fillRect(-bw / 2, bh / 2 - 4, bw, 2);

  // Highlight reflection
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(-bw / 2 + 2, -bh / 2 + 3, 3, bh - 4);

  // Handle/spout on top
  ctx.fillStyle = isGold ? '#b45309' : '#7f1d1d';
  ctx.fillRect(-3, -bh / 2 - 2, 6, 5);
  // Spout nozzle
  ctx.fillRect(2, -bh / 2 - 5, 5, 4);
  ctx.fillStyle = isGold ? '#fbbf24' : '#ef4444';
  ctx.fillRect(4, -bh / 2 - 6, 3, 2);

  // Fuel drop icon in centre
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(0, -1);
  ctx.bezierCurveTo(-4, 4, -4, 7, 0, 8);
  ctx.bezierCurveTo(4, 7, 4, 4, 0, -1);
  ctx.fill();

  // Stars sparkle for golden
  if (isGold) {
    const twinkle = Math.sin(frameCounter * 0.25);
    ctx.fillStyle = `rgba(255,255,255,${0.5 + twinkle * 0.4})`;
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('✦', -bw / 2 - 3, -bh / 2 + 2);
    ctx.fillText('✦', bw / 2 + 3, bh / 2 - 2);
  }

  ctx.restore();
}

// ═══════════════════════════════════════
//  SMOKE TRAIL — Premium Volumetric Drift Smoke v2.0
//  Multi-layer puffy clouds with animated wisps, glow & heat haze
// ═══════════════════════════════════════
function drawSmokeTrail() {
  const C = CELL_SIZE;
  const len = carSnake.length;
  if (len <= 1) return;

  ctx.save();

  // ── Pass 1: Ground-level heat haze / shadow under the smoke ──
  for (let i = len - 1; i > 0; i--) {
    const seg = carSnake[i];
    const sx = seg.x * C + C / 2;
    const sy = seg.y * C + C / 2;
    const prog = i / len;
    const haze = Math.max(0.08, 0.22 - prog * 0.14);
    const hazeR = C * 0.7 + prog * C * 0.4;

    const hazeGrad = ctx.createRadialGradient(sx, sy + 2, 0, sx, sy + 2, hazeR);
    hazeGrad.addColorStop(0, `rgba(15, 23, 42, ${haze})`);
    hazeGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');
    ctx.fillStyle = hazeGrad;
    ctx.beginPath();
    ctx.arc(sx, sy + 2, hazeR, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Pass 2: Thick volumetric cloud puffs (back to front for layering) ──
  for (let i = len - 1; i > 0; i--) {
    const curr = carSnake[i];
    const prev = carSnake[i - 1];

    const cx = curr.x * C + C / 2;
    const cy = curr.y * C + C / 2;
    const px = prev.x * C + C / 2;
    const py = prev.y * C + C / 2;

    const prog = i / len;
    const fade = Math.max(0.25, 1 - prog * 0.75);

    // Size increases toward tail (smoke expands as it cools)
    const baseR = C * 0.48;
    const maxR  = C * 0.95;
    const radius = baseR + (maxR - baseR) * prog;

    // Organic turbulence — each puff wobbles independently
    const t = frameCounter * 0.06;
    const w1 = Math.sin(t + i * 2.1) * (2.5 + prog * 3);
    const w2 = Math.cos(t * 0.8 + i * 1.7) * (2.5 + prog * 3);

    // ── Layer A: Wide atmospheric bloom (outermost) ──
    const bloomR = radius * 1.6;
    const bloom = ctx.createRadialGradient(cx + w1, cy + w2, radius * 0.3, cx + w1, cy + w2, bloomR);
    bloom.addColorStop(0, `rgba(226, 232, 240, ${fade * 0.28})`);
    bloom.addColorStop(0.6, `rgba(203, 213, 225, ${fade * 0.12})`);
    bloom.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = bloom;
    ctx.beginPath();
    ctx.arc(cx + w1, cy + w2, bloomR, 0, Math.PI * 2);
    ctx.fill();

    // ── Layer B: Main cloud body ──
    const bodyR = radius * 1.05;
    const body = ctx.createRadialGradient(cx + w1 * 0.7, cy + w2 * 0.7, 0, cx + w1 * 0.7, cy + w2 * 0.7, bodyR);
    body.addColorStop(0, `rgba(255, 255, 255, ${fade * 0.72})`);
    body.addColorStop(0.35, `rgba(241, 245, 249, ${fade * 0.55})`);
    body.addColorStop(0.7, `rgba(226, 232, 240, ${fade * 0.3})`);
    body.addColorStop(1, 'rgba(203, 213, 225, 0)');
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.arc(cx + w1 * 0.7, cy + w2 * 0.7, bodyR, 0, Math.PI * 2);
    ctx.fill();

    // ── Layer C: Bright highlight core (puffy cloud center) ──
    const coreR = radius * 0.5;
    const coreOff1 = Math.sin(t * 1.3 + i) * 1.5;
    const coreOff2 = Math.cos(t * 1.1 + i * 0.9) * 1.5;
    const core = ctx.createRadialGradient(cx + coreOff1, cy + coreOff2, 0, cx + coreOff1, cy + coreOff2, coreR);
    core.addColorStop(0, `rgba(255, 255, 255, ${fade * 0.9})`);
    core.addColorStop(0.5, `rgba(248, 250, 252, ${fade * 0.5})`);
    core.addColorStop(1, 'rgba(241, 245, 249, 0)');
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(cx + coreOff1, cy + coreOff2, coreR, 0, Math.PI * 2);
    ctx.fill();

    // ── Layer D: Bridge puffs between segments (fills gaps) ──
    const midX = (cx + px) / 2 + w1 * 0.4;
    const midY = (cy + py) / 2 + w2 * 0.4;
    const bridgeR = radius * 0.8;
    const bridge = ctx.createRadialGradient(midX, midY, 0, midX, midY, bridgeR);
    bridge.addColorStop(0, `rgba(248, 250, 252, ${fade * 0.6})`);
    bridge.addColorStop(0.6, `rgba(226, 232, 240, ${fade * 0.25})`);
    bridge.addColorStop(1, 'rgba(203, 213, 225, 0)');
    ctx.fillStyle = bridge;
    ctx.beginPath();
    ctx.arc(midX, midY, bridgeR, 0, Math.PI * 2);
    ctx.fill();

    // ── Extra wisp puffs at turns (direction changes) ──
    if (i < len - 1) {
      const next = carSnake[i + 1];
      const dx1 = curr.x - prev.x;
      const dy1 = curr.y - prev.y;
      const dx2 = next.x - curr.x;
      const dy2 = next.y - curr.y;
      if (dx1 !== dx2 || dy1 !== dy2) {
        const wispR = radius * 0.65;
        const wo1 = Math.sin(t * 2 + i * 3) * 4;
        const wo2 = Math.cos(t * 2 + i * 3) * 4;
        const wisp = ctx.createRadialGradient(cx + wo1, cy + wo2, 0, cx + wo1, cy + wo2, wispR);
        wisp.addColorStop(0, `rgba(255, 255, 255, ${fade * 0.65})`);
        wisp.addColorStop(1, 'rgba(226, 232, 240, 0)');
        ctx.fillStyle = wisp;
        ctx.beginPath();
        ctx.arc(cx + wo1, cy + wo2, wispR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── Pass 3: Hot exhaust glow near car head (warm orange tint, first 3 segs) ──
  const glowSegs = Math.min(3, len - 1);
  for (let i = 1; i <= glowSegs; i++) {
    const seg = carSnake[i];
    const gx = seg.x * C + C / 2;
    const gy = seg.y * C + C / 2;
    const gFade = 0.18 - (i - 1) * 0.05;
    const gR = C * 0.6;
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, gR);
    glow.addColorStop(0, `rgba(251, 191, 36, ${gFade})`);
    glow.addColorStop(0.5, `rgba(239, 68, 68, ${gFade * 0.5})`);
    glow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(gx, gy, gR, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ═══════════════════════════════════════
//  PARTICLES — Premium Drift Smoke Puffs
// ═══════════════════════════════════════
function spawnDriftSmoke(x, y) {
  const count = 5 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.3 + Math.random() * 1.2;
    particles.push({
      x: x * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 14,
      y: y * CELL_SIZE + CELL_SIZE / 2 + (Math.random() - 0.5) * 14,
      dx: Math.cos(angle) * speed,
      dy: Math.sin(angle) * speed,
      size: 2 + Math.random() * 5,
      life: 20 + Math.random() * 18,
      maxLife: 38,
      type: Math.random() < 0.3 ? 'hot' : 'cool',
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.life--;
    p.x += p.dx;
    p.y += p.dy;
    p.dx *= 0.97;
    p.dy *= 0.97;
    p.size += 0.35;

    const lifeRatio = p.life / p.maxLife;
    const alpha = lifeRatio * 0.5;

    // Warm exhaust glow for fresh hot particles
    if (p.type === 'hot' && lifeRatio > 0.6) {
      const warmAlpha = (lifeRatio - 0.6) * 1.2;
      const hotGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      hotGrad.addColorStop(0, `rgba(251, 191, 36, ${warmAlpha * 0.4})`);
      hotGrad.addColorStop(0.5, `rgba(239, 68, 68, ${warmAlpha * 0.15})`);
      hotGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = hotGrad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Main smoke puff with gradient
    const smokeGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    smokeGrad.addColorStop(0, `rgba(241, 245, 249, ${alpha * 1.2})`);
    smokeGrad.addColorStop(0.5, `rgba(203, 213, 225, ${alpha * 0.7})`);
    smokeGrad.addColorStop(1, 'rgba(148, 163, 184, 0)');
    ctx.fillStyle = smokeGrad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    if (p.life <= 0) particles.splice(i, 1);
  }
}

// ═══════════════════════════════════════
//  CAR HEAD — Detailed Toyota GR Top-Down View
// ═══════════════════════════════════════
function drawCarHead(ix, iy) {
  const C = CELL_SIZE;

  ctx.save();
  ctx.translate(ix, iy);

  // Rotation based on direction
  let angle = 0;
  if (dir.x === 1) angle = 0;
  else if (dir.x === -1) angle = Math.PI;
  else if (dir.y === 1) angle = Math.PI / 2;
  else if (dir.y === -1) angle = -Math.PI / 2;
  ctx.rotate(angle);

  const carW = C * 1.3;
  const carH = C * 0.75;

  // === Headlight Beam Cone ===
  const beamGrad = ctx.createLinearGradient(carW / 2, 0, carW / 2 + C * 1.5, 0);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.3)');
  beamGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(carW / 2, -carH / 2 + 3);
  ctx.lineTo(carW / 2 + C * 1.5, -carH);
  ctx.lineTo(carW / 2 + C * 1.5, carH);
  ctx.lineTo(carW / 2, carH / 2 - 3);
  ctx.closePath();
  ctx.fill();

  // === Drop Shadow ===
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.beginPath();
  ctx.ellipse(2, 2, carW / 2 + 2, carH / 2 + 2, 0, 0, Math.PI * 2);
  ctx.fill();

  // === Car Body ===
  const bodyGrad = ctx.createLinearGradient(-carW / 2, -carH / 2, carW / 2, carH / 2);
  bodyGrad.addColorStop(0, '#dc2626');
  bodyGrad.addColorStop(0.4, '#ef4444');
  bodyGrad.addColorStop(1, '#b91c1c');
  ctx.fillStyle = bodyGrad;
  roundRect(ctx, -carW / 2, -carH / 2, carW, carH, 6);
  ctx.fill();

  // Top metallic shine line
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  roundRect(ctx, -carW / 2 + 3, -carH / 2 + 1, carW - 6, 3, 2);
  ctx.fill();

  // === Windshield (front) ===
  ctx.fillStyle = '#0c4a6e';
  roundRect(ctx, carW / 2 - 10, -carH / 2 + 3, 7, carH - 6, 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.globalAlpha = 0.6;
  roundRect(ctx, carW / 2 - 9, -carH / 2 + 4, 5, carH - 8, 2);
  ctx.fill();
  ctx.globalAlpha = 1;

  // === Rear Windshield ===
  ctx.fillStyle = '#0c4a6e';
  roundRect(ctx, -carW / 2 + 3, -carH / 2 + 4, 5, carH - 8, 2);
  ctx.fill();

  // === Roof (center cabin) ===
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  roundRect(ctx, -3, -carH / 2 + 3, 8, carH - 6, 2);
  ctx.fill();

  // === 4 Wheels ===
  const wheelW = 6, wheelH = 4;
  ctx.fillStyle = '#0f172a';
  roundRect(ctx, carW / 2 - 8, -carH / 2 - 2, wheelW, wheelH, 1);
  ctx.fill();
  roundRect(ctx, carW / 2 - 8, carH / 2 - 2, wheelW, wheelH, 1);
  ctx.fill();
  roundRect(ctx, -carW / 2 + 2, -carH / 2 - 2, wheelW, wheelH, 1);
  ctx.fill();
  roundRect(ctx, -carW / 2 + 2, carH / 2 - 2, wheelW, wheelH, 1);
  ctx.fill();

  // Hub caps
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath(); ctx.arc(carW / 2 - 5, -carH / 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(carW / 2 - 5, carH / 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-carW / 2 + 5, -carH / 2, 1.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-carW / 2 + 5, carH / 2, 1.5, 0, Math.PI * 2); ctx.fill();

  // === Headlights ===
  ctx.fillStyle = '#fef08a';
  ctx.beginPath(); ctx.arc(carW / 2 - 1, -carH / 2 + 5, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(carW / 2 - 1, carH / 2 - 5, 2.5, 0, Math.PI * 2); ctx.fill();

  // === Tail lights ===
  ctx.fillStyle = '#dc2626';
  ctx.shadowBlur = 4;
  ctx.shadowColor = '#ef4444';
  ctx.beginPath(); ctx.arc(-carW / 2 + 2, -carH / 2 + 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-carW / 2 + 2, carH / 2 - 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();
}

// Spawn Fuel Canister
function spawnFuel() {
  let valid = false;
  let newX, newY;
  while (!valid) {
    newX = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
    newY = Math.floor(Math.random() * (GRID_SIZE - 2)) + 1;
    valid = !carSnake.some(seg => seg.x === newX && seg.y === newY);
  }
  fuelItem = {
    x: newX,
    y: newY,
    type: Math.random() < 0.2 ? 'golden' : 'normal'
  };
}

// ═══════════════════════════════════════
//  GAME LOGIC — Separate tick + 60fps render with interpolation
// ═══════════════════════════════════════

// Logic tick: moves the snake on the grid
function gameStep() {
  if (!isPlaying) return;

  // Save previous positions for interpolation
  prevSnake = carSnake.map(s => ({ x: s.x, y: s.y }));
  lastTickTime = performance.now();

  dir = { ...nextDir };
  const head = { x: carSnake[0].x + dir.x, y: carSnake[0].y + dir.y };

  // Wall collision
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    return gameOver('Mobil menabrak pembatas parkiran!');
  }

  // Self collision
  for (let i = 0; i < carSnake.length; i++) {
    if (carSnake[i].x === head.x && carSnake[i].y === head.y) {
      return gameOver('Mobil melintir menabrak gumpalan asap tebal sendiri!');
    }
  }

  carSnake.unshift(head);
  spawnDriftSmoke(head.x, head.y);

  // Fuel pickup
  if (head.x === fuelItem.x && head.y === fuelItem.y) {
    const pts = fuelItem.type === 'golden' ? 25 : 10;
    score += pts;
    fuelCount++;

    if (scoreEl) scoreEl.innerText = score.toString().padStart(3, '0');
    if (fuelCountEl) fuelCountEl.innerText = fuelCount;

    if (fuelCount % 5 === 0 && window.ToyotaRewards) {
      ToyotaRewards.addPoints(10, 'Game Parkir Drift & Fuel Rush');
    }

    gameSpeedMs = Math.max(65, 130 - Math.floor(score / 25));
    // Pad prevSnake to match new length (tail stays)
    prevSnake.unshift({ x: prevSnake[0].x, y: prevSnake[0].y });
    spawnFuel();
  } else {
    carSnake.pop();
  }

  setTimeout(gameStep, gameSpeedMs);
}

// Lerp helper
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// 60fps render loop with smooth interpolation
function renderLoop() {
  if (!isPlaying) return;

  const C = CELL_SIZE;
  const now = performance.now();
  // t = how far between last tick and next tick (0..1)
  let t = Math.min((now - lastTickTime) / gameSpeedMs, 1);
  // Ease-out for smoother feel
  t = t * (2 - t);

  drawParkingBackground();
  updateParticles();
  drawFuel();
  drawSmokeTrail();

  // Interpolate car head position
  if (prevSnake.length > 0 && carSnake.length > 0) {
    const prevHead = prevSnake[0];
    const currHead = carSnake[0];
    const ix = lerp(prevHead.x, currHead.x, t) * C + C / 2;
    const iy = lerp(prevHead.y, currHead.y, t) * C + C / 2;
    drawCarHead(ix, iy);
  } else {
    const head = carSnake[0];
    drawCarHead(head.x * C + C / 2, head.y * C + C / 2);
  }

  frameCounter++;
  animFrameId = requestAnimationFrame(renderLoop);
}

function startSnakeGame() {
  if (startOverlay) startOverlay.classList.add('hidden');
  if (gameOverOverlay) gameOverOverlay.classList.add('hidden');

  carSnake = [
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 }
  ];
  prevSnake = carSnake.map(s => ({ x: s.x, y: s.y }));
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };

  score = 0;
  fuelCount = 0;
  gameSpeedMs = 130;
  frameCounter = 0;
  particles = [];
  isPlaying = true;
  lastTickTime = performance.now();

  if (scoreEl) scoreEl.innerText = '000';
  if (fuelCountEl) fuelCountEl.innerText = '0';

  spawnFuel();
  // Start both: logic tick loop + 60fps render loop
  setTimeout(gameStep, gameSpeedMs);
  animFrameId = requestAnimationFrame(renderLoop);
}

function gameOver(reason) {
  isPlaying = false;
  if (animFrameId) cancelAnimationFrame(animFrameId);
  if (gameOverReasonEl) gameOverReasonEl.innerText = reason || 'Game Over!';
  if (finalScoreValEl) finalScoreValEl.innerText = score;

  if (score > highScore) {
    highScore = score;
    localStorage.setItem('toyotaSnakeHighScore', highScore);
    if (highScoreEl) highScoreEl.innerText = highScore.toString().padStart(3, '0');
  }

  if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
}

// ═══════════════════════════════════════
//  INPUT CONTROLS
// ═══════════════════════════════════════
function handleInput(newDir) {
  if (!isPlaying) return;
  if (newDir.x === -dir.x && newDir.y === 0) return;
  if (newDir.y === -dir.y && newDir.x === 0) return;
  nextDir = newDir;
}

function handleDpadInput(direction) {
  if (direction === 'UP') handleInput({ x: 0, y: -1 });
  if (direction === 'DOWN') handleInput({ x: 0, y: 1 });
  if (direction === 'LEFT') handleInput({ x: -1, y: 0 });
  if (direction === 'RIGHT') handleInput({ x: 1, y: 0 });
}

function changeDirection(direction) {
  handleDpadInput(direction);
}

window.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'KeyW'].includes(e.code)) {
    e.preventDefault(); handleInput({ x: 0, y: -1 });
  } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
    e.preventDefault(); handleInput({ x: 0, y: 1 });
  } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
    e.preventDefault(); handleInput({ x: -1, y: 0 });
  } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
    e.preventDefault(); handleInput({ x: 1, y: 0 });
  }
});

// Swipe support
let touchStartX = 0;
let touchStartY = 0;
if (canvas) {
  canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  canvas.addEventListener('touchend', (e) => {
    const diffX = e.changedTouches[0].clientX - touchStartX;
    const diffY = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 20) handleInput({ x: 1, y: 0 });
      else if (diffX < -20) handleInput({ x: -1, y: 0 });
    } else {
      if (diffY > 20) handleInput({ x: 0, y: 1 });
      else if (diffY < -20) handleInput({ x: 0, y: -1 });
    }
  }, { passive: true });
}

// Utility
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
