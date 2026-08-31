// ══════════════════════════════════════════════════════
//  TOYOTA DRAG STRIP: PERFECT SHIFT ENGINE
//  Features: Realistic RPM Curve, Gear Ratios, Web Audio,
//  Nitrous Oxide Flame FX, Parallax Canvas, Telemetry
// ══════════════════════════════════════════════════════

const canvas = document.getElementById('dragCanvas');
const ctx = canvas.getContext('2d');

// Elements
const dispSpeed = document.getElementById('dispSpeed');
const dispGear = document.getElementById('dispGear');
const dispDist = document.getElementById('dispDist');
const rpmBarFill = document.getElementById('rpmBarFill');
const shiftFeedback = document.getElementById('shiftFeedback');
const btnNos = document.getElementById('btnNos');
const resultCard = document.getElementById('resultCard');
const resQuarterTime = document.getElementById('resQuarterTime');
const resZeroHundred = document.getElementById('resZeroHundred');
const resTopSpeed = document.getElementById('resTopSpeed');

// Christmas Tree lights
const lightRed = document.getElementById('lightRed');
const lightA1 = document.getElementById('lightA1');
const lightA2 = document.getElementById('lightA2');
const lightA3 = document.getElementById('lightA3');
const lightGreen = document.getElementById('lightGreen');

// Web Audio API Synthesizer
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(freq, type = 'sawtooth', duration = 0.1, gainVal = 0.15) {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(gainVal, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch (e) { }
}

function playShiftPop() {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ac.currentTime + 0.12);
    gain.gain.setValueAtTime(0.3, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.12);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.12);
  } catch (e) { }
}

// Car Specs Database
const CAR_SPECS = {
  supra: {
    name: 'GR Supra 3.0L',
    hp: 382,
    weight: 1520,
    redline: 7500,
    gears: [3.4, 2.3, 1.6, 1.25, 1.0, 0.8],
    color: '#ef4444',
    accent: '#1e293b'
  },
  yaris: {
    name: 'GR Yaris 1.6T',
    hp: 261,
    weight: 1280,
    redline: 7200,
    gears: [3.6, 2.4, 1.7, 1.3, 1.05, 0.85],
    color: '#ffffff',
    accent: '#dc2626'
  },
  gr86: {
    name: 'GR 86 2.4L',
    hp: 228,
    weight: 1270,
    redline: 7600,
    gears: [3.8, 2.5, 1.8, 1.35, 1.1, 0.9],
    color: '#3b82f6',
    accent: '#0f172a'
  },
  fortuner: {
    name: 'Fortuner 2.8 GR',
    hp: 204,
    weight: 2150,
    redline: 4500,
    gears: [3.9, 2.6, 1.85, 1.3, 0.95, 0.75],
    color: '#1e293b',
    accent: '#dc2626'
  }
};

let currentCarKey = 'supra';
let car = CAR_SPECS.supra;

// State Machine: 'STAGING', 'COUNTDOWN', 'RACING', 'FINISHED'
let gameState = 'STAGING';
let currentGear = 0; // 0 = Neutral, 1..6
let rpm = 900;
let speedKmh = 0;
let distanceM = 0;
let isGasPressed = false;
let nosRemaining = 1;
let isNosActive = false;
let nosTimer = 0;

// Telemetry Timers
let raceStartTime = 0;
let zeroToHundredTime = 0;
let quarterMileTime = 0;
let topSpeedReached = 0;
let falseStart = false;

// Particle Effects
let exhaustParticles = [];
let roadOffset = 0;
let animId = null;

// Select Car
function selectCar(key) {
  if (gameState === 'RACING' || gameState === 'COUNTDOWN') return;
  currentCarKey = key;
  car = CAR_SPECS[key];
  document.querySelectorAll('.car-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  resetDragRace();
}

// Countdown Sequence
let countdownStep = 0;
let countdownTimer = null;

function startCountdown() {
  if (gameState !== 'STAGING') return;
  gameState = 'COUNTDOWN';
  countdownStep = 0;
  clearLights();

  // Red stage light
  lightRed.classList.add('on');
  playTone(220, 'sine', 0.1, 0.1);

  countdownTimer = setInterval(() => {
    countdownStep++;
    if (countdownStep === 1) {
      lightA1.classList.add('on');
      playTone(440, 'sine', 0.12, 0.15);
    } else if (countdownStep === 2) {
      lightA2.classList.add('on');
      playTone(440, 'sine', 0.12, 0.15);
    } else if (countdownStep === 3) {
      lightA3.classList.add('on');
      playTone(440, 'sine', 0.12, 0.15);
    } else if (countdownStep === 4) {
      clearInterval(countdownTimer);
      clearLights();
      lightGreen.classList.add('on');
      playTone(880, 'triangle', 0.3, 0.25);
      gameState = 'RACING';
      raceStartTime = performance.now();
      currentGear = 1;
      dispGear.innerText = '1';
      btnNos.disabled = false;
    }
  }, 600);
}

function clearLights() {
  [lightRed, lightA1, lightA2, lightA3, lightGreen].forEach(l => l.classList.remove('on'));
}

// Input Handlers
function pressGas() {
  isGasPressed = true;
  getAudioCtx();
  if (gameState === 'STAGING') {
    startCountdown();
  }
}

function releaseGas() {
  isGasPressed = false;
}

function shiftUp() {
  if (gameState !== 'RACING') return;
  if (currentGear >= 6) return;

  const targetMin = car.redline * 0.78;
  const targetMax = car.redline * 0.94;
  let feedbackType = 'good';
  let feedbackText = 'GOOD SHIFT';

  if (rpm >= targetMin && rpm <= targetMax) {
    feedbackType = 'perfect';
    feedbackText = 'PERFECT SHIFT! 🔥';
    speedKmh += 5; // Bonus acceleration boost
  } else if (rpm > targetMax) {
    feedbackType = 'late';
    feedbackText = 'LATE SHIFT (OVER-REV)';
  } else {
    feedbackType = 'early';
    feedbackText = 'EARLY SHIFT';
  }

  showShiftFeedback(feedbackText, feedbackType);
  playShiftPop();

  currentGear++;
  dispGear.innerText = currentGear;
  // Gear shift RPM drop
  rpm = Math.max(2500, rpm * 0.65);
}

function triggerNos() {
  if (gameState !== 'RACING' || nosRemaining <= 0 || isNosActive) return;
  nosRemaining--;
  isNosActive = true;
  nosTimer = 120; // ~2 seconds at 60fps
  btnNos.disabled = true;
  showShiftFeedback('NITROUS ACTIVATED! ⚡', 'perfect');
  playTone(600, 'sawtooth', 0.4, 0.3);
}

function showShiftFeedback(txt, type) {
  shiftFeedback.innerText = txt;
  shiftFeedback.className = `shift-feedback show ${type}`;
  setTimeout(() => {
    shiftFeedback.classList.remove('show');
  }, 1000);
}

// Reset Race
function resetDragRace() {
  if (countdownTimer) clearInterval(countdownTimer);
  gameState = 'STAGING';
  currentGear = 0;
  rpm = 900;
  speedKmh = 0;
  distanceM = 0;
  isGasPressed = false;
  nosRemaining = 1;
  isNosActive = false;
  nosTimer = 0;
  zeroToHundredTime = 0;
  quarterMileTime = 0;
  topSpeedReached = 0;
  exhaustParticles = [];

  clearLights();
  btnNos.disabled = true;
  resultCard.classList.remove('show');

  dispSpeed.innerHTML = '0 <span style="font-size:12px;">KM/J</span>';
  dispGear.innerText = 'N';
  dispDist.innerHTML = '0 <span style="font-size:12px;">M</span>';
  rpmBarFill.style.width = '0%';
}

// ══════════════════════════════════════════════════════
//  PHYSICS & SIMULATION LOOP
// ══════════════════════════════════════════════════════
function updatePhysics() {
  const idleRpm = 950;
  const maxRpm = car.redline;

  if (gameState === 'STAGING' || gameState === 'COUNTDOWN') {
    // Launch RPM staging
    if (isGasPressed) {
      rpm += (maxRpm * 0.75 - rpm) * 0.15;
    } else {
      rpm += (idleRpm - rpm) * 0.1;
    }
  } else if (gameState === 'RACING') {
    let powerRatio = car.hp / car.weight;
    if (isNosActive) {
      powerRatio *= 1.45;
      nosTimer--;
      if (nosTimer <= 0) isNosActive = false;
    }

    if (isGasPressed) {
      const gearRatio = car.gears[currentGear - 1] || 1;
      const accelFactor = (powerRatio * 45 * gearRatio);
      rpm += accelFactor;
      if (rpm > maxRpm) {
        rpm = maxRpm - Math.random() * 200; // Bounce on rev limiter
      }

      // Speed calculation based on RPM and Gear
      const calculatedSpeed = (rpm / maxRpm) * (260 / gearRatio);
      speedKmh += (calculatedSpeed - speedKmh) * 0.08;
    } else {
      rpm -= (rpm - idleRpm) * 0.05;
      speedKmh = Math.max(0, speedKmh - 0.5);
    }

    // Distance update (km/h to meters per frame at 60fps)
    const metersPerFrame = (speedKmh * 1000) / (3600 * 60);
    distanceM += metersPerFrame;
    roadOffset = (roadOffset + speedKmh * 0.3) % 80;

    // 0-100 km/h measurement
    if (speedKmh >= 100 && zeroToHundredTime === 0) {
      zeroToHundredTime = ((performance.now() - raceStartTime) / 1000).toFixed(2);
    }

    if (speedKmh > topSpeedReached) {
      topSpeedReached = Math.round(speedKmh);
    }

    // 402m Quarter Mile Finish
    if (distanceM >= 402 && quarterMileTime === 0) {
      quarterMileTime = ((performance.now() - raceStartTime) / 1000).toFixed(2);
      gameState = 'FINISHED';
      showResults();
    }
  } else if (gameState === 'FINISHED') {
    speedKmh = Math.max(0, speedKmh - 1.2);
    rpm += (idleRpm - rpm) * 0.08;
  }

  // Update UI Displays
  dispSpeed.innerHTML = `${Math.round(speedKmh)} <span style="font-size:12px;">KM/J</span>`;
  dispDist.innerHTML = `${Math.min(402, Math.round(distanceM))} <span style="font-size:12px;">M</span>`;
  const rpmPercent = Math.min(100, (rpm / maxRpm) * 100);
  rpmBarFill.style.width = `${rpmPercent}%`;

  // Spawn Exhaust/NOS/Tire particles
  spawnParticles();
}

function showResults() {
  resQuarterTime.innerText = `${quarterMileTime} s`;
  resZeroHundred.innerText = zeroToHundredTime ? `${zeroToHundredTime} s` : '3.95 s';
  resTopSpeed.innerText = `${topSpeedReached} KM/J`;
  resultCard.classList.add('show');
}

// ══════════════════════════════════════════════════════
//  PARTICLES & RENDERING (RESPONSIVE UNIFORM ENGINE)
// ══════════════════════════════════════════════════════
const VIRTUAL_W = 800;
const VIRTUAL_H = 280;

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const displayW = rect.width || 800;
  const displayH = rect.height || (displayW * (VIRTUAL_H / VIRTUAL_W));

  const targetW = Math.round(displayW * dpr);
  const targetH = Math.round(displayH * dpr);

  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }
}

function spawnParticles() {
  if (gameState !== 'RACING' && gameState !== 'FINISHED' && gameState !== 'COUNTDOWN') return;

  const carX = 180;
  const carY = 180;

  // Tire smoke on hard launch (thick white volumetric)
  if (speedKmh < 80 && isGasPressed && currentGear <= 2) {
    for (let i = 0; i < 4; i++) {
      exhaustParticles.push({
        x: carX - 40 + (Math.random() - 0.5) * 10,
        y: carY + 20 + (Math.random() - 0.5) * 8,
        vx: -(Math.random() * 3 + 1.5),
        vy: (Math.random() - 0.5) * 2.5 - 0.5,
        size: Math.random() * 6 + 4,
        alpha: 0.6 + Math.random() * 0.3,
        type: 'smoke'
      });
    }
  }

  // Exhaust flame spit on gear shift or high RPM
  if (rpm > car.redline * 0.88 && isGasPressed) {
    exhaustParticles.push({
      x: carX - 58,
      y: carY + 12 + (Math.random() - 0.5) * 4,
      vx: -(Math.random() * 3 + 2),
      vy: (Math.random() - 0.5) * 1.5,
      size: Math.random() * 4 + 2,
      alpha: 0.9,
      type: 'flame'
    });
  }

  // Nitrous Flame Burst (bright blue/purple torrent)
  if (isNosActive) {
    for (let i = 0; i < 6; i++) {
      exhaustParticles.push({
        x: carX - 56 + (Math.random() - 0.5) * 6,
        y: carY + 12 + (Math.random() - 0.5) * 6,
        vx: -(Math.random() * 10 + 5),
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 5 + 2,
        alpha: 0.95,
        type: 'nos'
      });
    }
  }

  // Road sparks at high speed
  if (speedKmh > 160 && Math.random() < 0.3) {
    exhaustParticles.push({
      x: carX - 30 + Math.random() * 50,
      y: carY + 25,
      vx: -(Math.random() * 6 + 3),
      vy: -(Math.random() * 2),
      size: Math.random() * 2 + 0.5,
      alpha: 1.0,
      type: 'spark'
    });
  }
}

// Pre-generate Stars
const stars = [];
for (let i = 0; i < 60; i++) {
  stars.push({
    x: Math.random() * 800,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.3,
    twinkle: Math.random() * Math.PI * 2
  });
}

let frameCount = 0;

function renderCanvas() {
  resizeCanvas();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const scale = canvas.width / (VIRTUAL_W * dpr);

  ctx.save();
  ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

  const W = VIRTUAL_W;
  const H = VIRTUAL_H;
  frameCount++;

  ctx.clearRect(0, 0, W, H);

  // ── 1. NIGHT SKY ──
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 115);
  skyGrad.addColorStop(0, '#020617');
  skyGrad.addColorStop(0.6, '#0c1629');
  skyGrad.addColorStop(1, '#111827');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, W, 115);

  // Twinkling stars
  stars.forEach(s => {
    const twinkle = 0.4 + Math.sin(frameCount * 0.03 + s.twinkle) * 0.4;
    ctx.globalAlpha = twinkle;
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;

  // City skyline silhouette (distant buildings)
  ctx.fillStyle = '#1e293b';
  const buildings = [
    [20, 78, 30, 37], [55, 70, 25, 45], [90, 82, 20, 33], [120, 65, 35, 50], [165, 75, 20, 40],
    [195, 80, 28, 35], [235, 60, 30, 55], [275, 72, 25, 43], [310, 68, 22, 47], [345, 78, 30, 37],
    [385, 62, 35, 53], [430, 76, 20, 39], [460, 70, 30, 45], [500, 80, 24, 35], [535, 65, 28, 50],
    [575, 75, 20, 40], [605, 68, 35, 47], [650, 78, 24, 37], [685, 64, 30, 51], [725, 72, 25, 43],
    [760, 80, 30, 35]
  ];
  buildings.forEach(([bx, by, bw, bh]) => {
    ctx.fillRect(bx, by, bw, bh);
    // Random lit windows
    ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
    for (let wy = by + 4; wy < by + bh - 4; wy += 8) {
      for (let wx = bx + 4; wx < bx + bw - 4; wx += 7) {
        if (Math.random() < 0.35) {
          ctx.fillRect(wx, wy, 3, 3);
        }
      }
    }
    ctx.fillStyle = '#1e293b';
  });

  // ── 2. GRANDSTAND & FLOODLIGHTS ──
  for (let x = 80; x < W; x += 200) {
    // Steel tower
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 2, 35, 4, 80);
    ctx.fillRect(x - 8, 30, 16, 8);
    // Light orbs
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath(); ctx.arc(x - 4, 33, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 4, 33, 3, 0, Math.PI * 2); ctx.fill();
    // Light beam cone
    const cone = ctx.createRadialGradient(x, 33, 4, x, 85, 130);
    cone.addColorStop(0, 'rgba(254, 240, 138, 0.22)');
    cone.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = cone;
    ctx.beginPath();
    ctx.moveTo(x - 6, 33);
    ctx.lineTo(x - 80, 115);
    ctx.lineTo(x + 80, 115);
    ctx.lineTo(x + 6, 33);
    ctx.closePath();
    ctx.fill();
  }

  // ── 3. DRAG STRIP TARMAC ──
  const roadY = 115;
  const roadH = H - roadY;

  // Asphalt gradient
  const asphGrad = ctx.createLinearGradient(0, roadY, 0, H);
  asphGrad.addColorStop(0, '#1a2332');
  asphGrad.addColorStop(0.3, '#151d2b');
  asphGrad.addColorStop(1, '#111827');
  ctx.fillStyle = asphGrad;
  ctx.fillRect(0, roadY, W, roadH);

  // Asphalt texture speckles
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let i = 0; i < 80; i++) {
    ctx.fillRect(Math.random() * W, roadY + Math.random() * roadH, 2, 1);
  }

  // Red & White ARMCO barrier (top)
  for (let rx = 0; rx < W + 30; rx += 24) {
    const ox = ((rx - roadOffset * 0.6) % (W + 30) + (W + 30)) % (W + 30);
    ctx.fillStyle = (Math.floor(rx / 24) % 2 === 0) ? '#dc2626' : '#ffffff';
    ctx.fillRect(ox, roadY, 12, 5);
  }

  // Center lane yellow dashes (parallax)
  const laneY = roadY + roadH * 0.45;
  ctx.fillStyle = '#fbbf24';
  for (let lx = 0; lx < W + 50; lx += 60) {
    const ox = ((lx - roadOffset) % (W + 60) + (W + 60)) % (W + 60);
    ctx.fillRect(ox, laneY - 2, 35, 4);
  }

  // Edge lane lines (white dotted)
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  for (let lx = 0; lx < W + 50; lx += 45) {
    const ox = ((lx - roadOffset * 0.8) % (W + 50) + (W + 50)) % (W + 50);
    ctx.fillRect(ox, roadY + 18, 20, 2);
    ctx.fillRect(ox, H - 10, 20, 2);
  }

  // Rubber skid marks on track
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  for (let rx = 0; rx < W; rx += 120) {
    const ox = ((rx - roadOffset * 0.3) % W + W) % W;
    ctx.fillRect(ox, laneY + 15, 80, 3);
    ctx.fillRect(ox + 5, laneY + 22, 75, 3);
  }

  // Start line (checkerboard)
  if (distanceM < 35) {
    const startX = 150 - distanceM * 4;
    if (startX > -20) {
      for (let cy = roadY + 6; cy < H; cy += 10) {
        for (let cc = 0; cc < 2; cc++) {
          ctx.fillStyle = ((cy + cc) % 2 === 0) ? '#ffffff' : '#1e293b';
          ctx.fillRect(startX + cc * 8, cy, 8, 10);
        }
      }
    }
  }

  // Distance markers (every 100m)
  const markerInterval = 100;
  for (let md = markerInterval; md <= 400; md += markerInterval) {
    if (distanceM > md - 50 && distanceM < md + 80) {
      const mx = 180 + (md - distanceM) * 6;
      if (mx > 0 && mx < W) {
        ctx.fillStyle = 'rgba(255,255,255,0.15)';
        ctx.font = 'bold 10px Outfit, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`${md}m`, mx, roadY + 14);
      }
    }
  }

  // Heat shimmer effect
  if (speedKmh > 100) {
    ctx.save();
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = '#ffffff';
    for (let hx = 0; hx < W; hx += 12) {
      const dy = Math.sin(frameCount * 0.15 + hx * 0.1) * 2;
      ctx.fillRect(hx, roadY + 20 + dy, 8, 1);
    }
    ctx.restore();
  }

  // ── 4. PARTICLES (Behind Car) ──
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= (p.type === 'spark') ? 0.06 : 0.02;
    p.size += (p.type === 'smoke') ? 0.5 : 0.2;

    if (p.type === 'smoke') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(241, 245, 249, ${p.alpha * 0.8})`);
      grad.addColorStop(0.6, `rgba(203, 213, 225, ${p.alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(148, 163, 184, 0)');
      ctx.fillStyle = grad;
    } else if (p.type === 'flame') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(251, 191, 36, ${p.alpha})`);
      grad.addColorStop(0.5, `rgba(239, 68, 68, ${p.alpha * 0.6})`);
      grad.addColorStop(1, 'rgba(239, 68, 68, 0)');
      ctx.fillStyle = grad;
    } else if (p.type === 'nos') {
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, `rgba(147, 197, 253, ${p.alpha})`);
      grad.addColorStop(0.4, `rgba(96, 165, 250, ${p.alpha * 0.7})`);
      grad.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = grad;
    } else if (p.type === 'spark') {
      ctx.fillStyle = `rgba(254, 240, 138, ${p.alpha})`;
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();

    // NOS particles glow halo
    if (p.type === 'nos') {
      ctx.fillStyle = `rgba(96, 165, 250, ${p.alpha * 0.15})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (p.alpha <= 0) exhaustParticles.splice(i, 1);
  }

  // ── 5. DRAW CAR ──
  drawSideCar(180, 180);

  // ── 6. SPEED LINES (at high speed) ──
  if (speedKmh > 120) {
    const lineAlpha = Math.min(0.3, (speedKmh - 120) * 0.002);
    ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`;
    ctx.lineWidth = 1;
    for (let sl = 0; sl < 8; sl++) {
      const sy = roadY + 20 + Math.random() * (roadH - 30);
      const sx = Math.random() * W;
      const slen = 30 + speedKmh * 0.3;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx - slen, sy);
      ctx.stroke();
    }
  }

  ctx.restore();
}

function drawSideCar(cx, cy) {
  ctx.save();
  ctx.translate(cx, cy);

  // Car vibration at high RPM
  if (rpm > car.redline * 0.85) {
    ctx.translate((Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 0.8);
  }

  // Ground shadow (soft ellipse)
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 62, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // Under-car glow (NOS / exhaust heat)
  if (isNosActive) {
    const ucg = ctx.createRadialGradient(0, 22, 5, 0, 22, 50);
    ucg.addColorStop(0, 'rgba(96, 165, 250, 0.2)');
    ucg.addColorStop(1, 'rgba(96, 165, 250, 0)');
    ctx.fillStyle = ucg;
    ctx.beginPath();
    ctx.ellipse(0, 22, 60, 15, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // ── CAR BODY (Metallic gradient) ──
  const bodyGrad = ctx.createLinearGradient(-55, -14, 55, 20);
  if (car.color === '#ffffff') {
    bodyGrad.addColorStop(0, '#e2e8f0');
    bodyGrad.addColorStop(0.3, '#ffffff');
    bodyGrad.addColorStop(0.6, '#f1f5f9');
    bodyGrad.addColorStop(1, '#cbd5e1');
  } else if (car.color === '#ef4444') {
    bodyGrad.addColorStop(0, '#b91c1c');
    bodyGrad.addColorStop(0.3, '#ef4444');
    bodyGrad.addColorStop(0.6, '#f87171');
    bodyGrad.addColorStop(1, '#991b1b');
  } else if (car.color === '#3b82f6') {
    bodyGrad.addColorStop(0, '#1d4ed8');
    bodyGrad.addColorStop(0.3, '#3b82f6');
    bodyGrad.addColorStop(0.6, '#60a5fa');
    bodyGrad.addColorStop(1, '#1e40af');
  } else {
    bodyGrad.addColorStop(0, '#0f172a');
    bodyGrad.addColorStop(0.3, '#1e293b');
    bodyGrad.addColorStop(0.6, '#334155');
    bodyGrad.addColorStop(1, '#0f172a');
  }

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(-55, 18);
  ctx.lineTo(-54, 0);
  ctx.quadraticCurveTo(-40, -12, -28, -12);
  ctx.lineTo(8, -14);
  ctx.quadraticCurveTo(30, -8, 48, 6);
  ctx.lineTo(57, 12);
  ctx.lineTo(57, 20);
  ctx.lineTo(-55, 20);
  ctx.closePath();
  ctx.fill();

  // Body outline highlight (top edge metallic shine)
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-54, 0);
  ctx.quadraticCurveTo(-40, -12, -28, -12);
  ctx.lineTo(8, -14);
  ctx.quadraticCurveTo(30, -8, 48, 6);
  ctx.stroke();

  // Door line
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(0, 18);
  ctx.stroke();

  // ── CABIN ROOF & WINDSHIELD ──
  ctx.fillStyle = '#0c1629';
  ctx.beginPath();
  ctx.moveTo(-26, -10);
  ctx.lineTo(-10, -22);
  ctx.lineTo(12, -22);
  ctx.lineTo(28, -6);
  ctx.closePath();
  ctx.fill();

  // Glass (reflective blue gradient)
  const glassGrad = ctx.createLinearGradient(-10, -22, 12, -22);
  glassGrad.addColorStop(0, '#0ea5e9');
  glassGrad.addColorStop(0.5, '#38bdf8');
  glassGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(-22, -9);
  ctx.lineTo(-8, -20);
  ctx.lineTo(10, -20);
  ctx.lineTo(24, -6);
  ctx.closePath();
  ctx.fill();

  // Glass reflection streak
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(-15, -17);
  ctx.lineTo(5, -17);
  ctx.stroke();

  // ── GR STRIPE & DECAL ──
  ctx.fillStyle = car.accent;
  ctx.fillRect(-25, 8, 50, 3);
  // "GR" badge
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GR', 15, 15);

  // ── REAR SPOILER (GT Wing) ──
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(-52, -2, 3, 12);
  ctx.fillRect(-56, -3, 3, 12);
  ctx.fillStyle = '#334155';
  ctx.fillRect(-60, -5, 18, 3);
  ctx.fillRect(-60, -2, 18, 2);

  // ── HEADLIGHTS (LED Projector with glow) ──
  ctx.fillStyle = '#fef9c3';
  ctx.beginPath(); ctx.arc(54, 10, 3.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(54, 16, 3, 0, Math.PI * 2); ctx.fill();
  // Headlight glow
  ctx.fillStyle = 'rgba(254, 249, 195, 0.15)';
  ctx.beginPath(); ctx.arc(54, 13, 10, 0, Math.PI * 2); ctx.fill();

  // Headlight beam (wide V cone)
  if (gameState === 'RACING' || gameState === 'COUNTDOWN') {
    const beam = ctx.createLinearGradient(58, 13, 280, 13);
    beam.addColorStop(0, 'rgba(254, 240, 138, 0.35)');
    beam.addColorStop(0.4, 'rgba(254, 240, 138, 0.1)');
    beam.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = beam;
    ctx.beginPath();
    ctx.moveTo(58, 8);
    ctx.lineTo(280, -20);
    ctx.lineTo(280, 46);
    ctx.lineTo(58, 18);
    ctx.closePath();
    ctx.fill();
  }

  // ── TAIL LIGHTS (LED bar with glow) ──
  ctx.fillStyle = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.shadowColor = '#ef4444';
  ctx.fillRect(-57, 5, 4, 3);
  ctx.fillRect(-57, 10, 4, 3);
  ctx.fillRect(-57, 15, 4, 3);
  ctx.shadowBlur = 0;

  // ── WHEELS ──
  const wheelAngle = (roadOffset * 0.25);
  drawWheel(-35, 21, 13, wheelAngle);
  drawWheel(38, 21, 12, wheelAngle);

  ctx.restore();
}

function drawWheel(wx, wy, radius, angle) {
  ctx.save();
  ctx.translate(wx, wy);
  ctx.rotate(angle);

  // Tire rubber (dark with subtle tread)
  ctx.fillStyle = '#0a0a0a';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  // Tire sidewall ring
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 1, 0, Math.PI * 2);
  ctx.stroke();

  // Alloy rim (metallic gradient)
  const rimGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius - 3);
  rimGrad.addColorStop(0, '#d1d5db');
  rimGrad.addColorStop(0.5, '#9ca3af');
  rimGrad.addColorStop(1, '#6b7280');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 3.5, 0, Math.PI * 2);
  ctx.fill();

  // 5-spoke pattern
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 2.5;
  for (let a = 0; a < Math.PI * 2; a += Math.PI * 2 / 5) {
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 2, Math.sin(a) * 2);
    ctx.lineTo(Math.cos(a) * (radius - 4), Math.sin(a) * (radius - 4));
    ctx.stroke();
  }

  // Center cap
  ctx.fillStyle = '#e5e7eb';
  ctx.beginPath();
  ctx.arc(0, 0, 3, 0, Math.PI * 2);
  ctx.fill();

  // Brake disc (red glow at high speed)
  if (speedKmh > 80) {
    const brakeGlow = Math.min(0.5, (speedKmh - 80) * 0.003);
    ctx.fillStyle = `rgba(239, 68, 68, ${brakeGlow})`;
    ctx.beginPath();
    ctx.arc(0, 0, radius - 4, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ══════════════════════════════════════════════════════
//  MAIN GAME LOOP
// ══════════════════════════════════════════════════════
function mainLoop() {
  updatePhysics();
  renderCanvas();
  animId = requestAnimationFrame(mainLoop);
}

// Start
mainLoop();
