// ══════════════════════════════════════════════════════
//  TOYOTA PRECISION VALET PARKING ENGINE
//  Features: 2D Ackermann Physics, Ultrasonic Sensor Beeps,
//  PDC Radar Colors, Reverse Guidelines, 3 Multi-stage Levels
// ══════════════════════════════════════════════════════

const canvas = document.getElementById('parkCanvas');
const ctx = canvas.getContext('2d');

// HUD Elements
const dispLevel = document.getElementById('dispLevel');
const dispTimer = document.getElementById('dispTimer');
const dispAccuracy = document.getElementById('dispAccuracy');
const dispBumps = document.getElementById('dispBumps');
const sensorDot = document.getElementById('sensorDot');
const sensorText = document.getElementById('sensorText');
const valetModal = document.getElementById('valetModal');
const modalTitle = document.getElementById('modalTitle');
const modalStars = document.getElementById('modalStars');
const modalDesc = document.getElementById('modalDesc');
const btnNextLevel = document.getElementById('btnNextLevel');
const btnDrive = document.getElementById('btnDrive');
const btnRev = document.getElementById('btnRev');

// Audio Context for Beeping Parking Sensors
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playSensorBeep(freq = 1200, duration = 0.08) {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + duration);
  } catch (e) { }
}

// Car State & Physics
let car = {
  x: 120,
  y: 320,
  width: 58,
  length: 100,
  angle: -Math.PI / 2, // Facing UP
  speed: 0,
  maxSpeed: 2.2,
  accel: 0.08,
  friction: 0.94,
  steerAngle: 0,
  maxSteer: 0.045,
  gear: 'D' // 'D' or 'R'
};

// Controls input
let inputs = {
  gas: false,
  brake: false,
  steerLeft: false,
  steerRight: false
};

// Game Management
let currentLevel = 1;
let levelStartTime = performance.now();
let bumpsCount = 0;
let isCompleted = false;
let lastBeepTime = 0;

// Levels Setup (Parking Target and Obstacles)
const LEVELS = [
  {
    level: 1,
    name: 'Slot Diagonal Depan Showroom',
    target: { x: 550, y: 140, w: 70, h: 120, angle: 0 },
    obstacles: [
      { x: 440, y: 140, w: 60, h: 105, color: '#64748b', name: 'Innova Zenix' },
      { x: 660, y: 140, w: 60, h: 105, color: '#dc2626', name: 'Yaris GR' },
      { x: 300, y: 80, w: 20, h: 20, type: 'pillar' },
      { x: 300, y: 340, w: 20, h: 20, type: 'pillar' }
    ],
    start: { x: 140, y: 320, angle: -Math.PI / 2 }
  },
  {
    level: 2,
    name: 'Slot Seri Antara Mobil Mewah',
    target: { x: 400, y: 80, w: 65, h: 115, angle: 0 },
    obstacles: [
      { x: 300, y: 80, w: 60, h: 110, color: '#1e293b', name: 'Alphard' },
      { x: 500, y: 80, w: 60, h: 110, color: '#f59e0b', name: 'Corolla Cross' },
      { x: 200, y: 240, w: 30, h: 140, type: 'wall' },
      { x: 600, y: 240, w: 30, h: 140, type: 'wall' }
    ],
    start: { x: 120, y: 320, angle: 0 }
  },
  {
    level: 3,
    name: 'Parkir Paralel VIP Mall',
    target: { x: 450, y: 60, w: 140, h: 65, angle: Math.PI / 2 },
    obstacles: [
      { x: 250, y: 60, w: 110, h: 60, color: '#0f172a', name: 'Fortuner 4x4' },
      { x: 650, y: 60, w: 110, h: 60, color: '#3b82f6', name: 'RAV4 GR' },
      { x: 450, y: 350, w: 600, h: 20, type: 'sidewalk' }
    ],
    start: { x: 120, y: 200, angle: 0 }
  }
];

function initLevel(lvlIdx) {
  const lvl = LEVELS[lvlIdx - 1];
  currentLevel = lvlIdx;
  car.x = lvl.start.x;
  car.y = lvl.start.y;
  car.angle = lvl.start.angle;
  car.speed = 0;
  car.steerAngle = 0;
  car.gear = 'D';

  setGear('D');
  bumpsCount = 0;
  isCompleted = false;
  levelStartTime = performance.now();
  valetModal.classList.remove('show');

  dispLevel.innerText = `${currentLevel} / 3`;
  dispBumps.innerText = '0';
  dispAccuracy.innerText = '0%';
}

// Input Binding Functions
function setGear(g) {
  car.gear = g;
  getAudioCtx();
  if (g === 'D') {
    btnDrive.className = 'gear-btn active drive';
    btnRev.className = 'gear-btn rev';
  } else {
    btnDrive.className = 'gear-btn drive';
    btnRev.className = 'gear-btn active rev';
  }
}

function pressGas(state) { inputs.gas = state; getAudioCtx(); }
function pressBrake(state) { inputs.brake = state; getAudioCtx(); }
function steerLeft(state) { inputs.steerLeft = state; getAudioCtx(); }
function steerRight(state) { inputs.steerRight = state; getAudioCtx(); }

// Keyboard Support
window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') pressGas(true);
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') pressBrake(true);
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') steerLeft(true);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') steerRight(true);
  if (e.key === 'r' || e.key === 'R') setGear(car.gear === 'D' ? 'R' : 'D');
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') pressGas(false);
  if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') pressBrake(false);
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') steerLeft(false);
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') steerRight(false);
});

// ══════════════════════════════════════════════════════
//  PHYSICS UPDATE
// ══════════════════════════════════════════════════════
function updateCar() {
  if (isCompleted) return;

  // Steering
  if (inputs.steerLeft) car.steerAngle = -car.maxSteer;
  else if (inputs.steerRight) car.steerAngle = car.maxSteer;
  else car.steerAngle = 0;

  // Acceleration / Braking
  if (inputs.gas) {
    if (car.gear === 'D') {
      car.speed = Math.min(car.maxSpeed, car.speed + car.accel);
    } else {
      car.speed = Math.max(-car.maxSpeed * 0.7, car.speed - car.accel);
    }
  } else if (inputs.brake) {
    car.speed *= 0.85;
  } else {
    car.speed *= car.friction;
  }

  // Turn vehicle with velocity
  if (Math.abs(car.speed) > 0.05) {
    car.angle += car.steerAngle * (car.speed > 0 ? 1 : -1);
  }

  // Move position
  car.x += Math.cos(car.angle) * car.speed;
  car.y += Math.sin(car.angle) * car.speed;

  // Screen Boundaries
  car.x = Math.max(30, Math.min(canvas.width - 30, car.x));
  car.y = Math.max(30, Math.min(canvas.height - 30, car.y));

  // Check Obstacle Collisions & Sensors
  checkSensorsAndCollisions();

  // Check Target Parking Slot Precision
  checkParkingSuccess();

  // Update HUD Timer
  const elapsedSec = Math.floor((performance.now() - levelStartTime) / 1000);
  const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
  const s = String(elapsedSec % 60).padStart(2, '0');
  dispTimer.innerText = `${m}:${s}`;
}

function checkSensorsAndCollisions() {
  const lvl = LEVELS[currentLevel - 1];
  let minDistance = 999;

  lvl.obstacles.forEach(obs => {
    const dist = Math.hypot(car.x - obs.x, car.y - obs.y);
    if (dist < minDistance) minDistance = dist;

    // Direct Bump Detection
    const collisionThreshold = (car.width + (obs.w || 30)) / 2;
    if (dist < collisionThreshold) {
      bumpsCount++;
      dispBumps.innerText = bumpsCount;
      // Rebound
      car.speed = -car.speed * 0.5;
      playSensorBeep(300, 0.2); // Low bump sound
    }
  });

  // Sensor UI & Beep Frequency
  if (minDistance < 60) {
    sensorDot.className = 'sensor-dot danger';
    sensorText.innerText = 'Sensor: BAHAYA (< 0.5m)';
    if (performance.now() - lastBeepTime > 120) {
      playSensorBeep(1600, 0.05);
      lastBeepTime = performance.now();
    }
  } else if (minDistance < 110) {
    sensorDot.className = 'sensor-dot warn';
    sensorText.innerText = 'Sensor: HATI-HATI (0.8m)';
    if (performance.now() - lastBeepTime > 350) {
      playSensorBeep(1200, 0.08);
      lastBeepTime = performance.now();
    }
  } else {
    sensorDot.className = 'sensor-dot';
    sensorText.innerText = 'Sensor: AMAN (> 2.0m)';
  }
}

function checkParkingSuccess() {
  const lvl = LEVELS[currentLevel - 1];
  const target = lvl.target;
  const distToTarget = Math.hypot(car.x - target.x, car.y - target.y);

  const accuracy = Math.max(0, Math.min(100, Math.round(100 - distToTarget * 1.5)));
  dispAccuracy.innerText = `${accuracy}%`;

  // If stopped inside the parking slot with speed ~0
  if (distToTarget < 24 && Math.abs(car.speed) < 0.1 && inputs.brake) {
    completeLevel();
  }
}

function completeLevel() {
  isCompleted = true;
  let stars = '⭐⭐⭐';
  if (bumpsCount > 2) stars = '⭐';
  else if (bumpsCount > 0) stars = '⭐⭐';

  modalStars.innerText = stars;
  modalTitle.innerText = `LEVEL ${currentLevel} SELESAI!`;
  modalDesc.innerText = `Waktu: ${dispTimer.innerText} • Benturan: ${bumpsCount} kali`;

  if (currentLevel >= 3) {
    btnNextLevel.innerText = 'Main Dari Awal';
  } else {
    btnNextLevel.innerHTML = 'Level Berikutnya <i class="fa-solid fa-arrow-right"></i>';
  }

  valetModal.classList.add('show');
}

function nextLevel() {
  if (currentLevel >= 3) {
    initLevel(1);
  } else {
    initLevel(currentLevel + 1);
  }
}

// ══════════════════════════════════════════════════════
//  CANVAS RENDERING
// ══════════════════════════════════════════════════════
let parkFrame = 0;

function drawParkingScene() {
  const W = canvas.width;
  const H = canvas.height;
  const lvl = LEVELS[currentLevel - 1];
  parkFrame++;

  ctx.clearRect(0, 0, W, H);

  // 1. Asphalt Ground (Dark gradient with subtle texture)
  const asphGrad = ctx.createLinearGradient(0, 0, 0, H);
  asphGrad.addColorStop(0, '#1a2332');
  asphGrad.addColorStop(0.5, '#162030');
  asphGrad.addColorStop(1, '#111827');
  ctx.fillStyle = asphGrad;
  ctx.fillRect(0, 0, W, H);

  // Asphalt noise speckle
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let i = 0; i < 120; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 1);
  }

  // Parking Stall Grid Lines (Clean white markings)
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 50) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 50) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Overhead parking lot light pools
  const lights = [[200, 100], [500, 200], [700, 100], [350, 350]];
  lights.forEach(([lx, ly]) => {
    const lg = ctx.createRadialGradient(lx, ly, 10, lx, ly, 120);
    lg.addColorStop(0, 'rgba(254, 240, 138, 0.06)');
    lg.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = lg;
    ctx.beginPath();
    ctx.arc(lx, ly, 120, 0, Math.PI * 2);
    ctx.fill();
  });

  // 2. Draw Target Parking Slot (Pulsing green brackets)
  const target = lvl.target;
  ctx.save();
  ctx.translate(target.x, target.y);
  ctx.rotate(target.angle);

  // Slot glow pulse
  const pulse = 0.12 + Math.sin(parkFrame * 0.06) * 0.06;
  ctx.fillStyle = `rgba(16, 185, 129, ${pulse})`;
  ctx.fillRect(-target.w / 2, -target.h / 2, target.w, target.h);

  // Corner bracket markers (L-shaped)
  ctx.strokeStyle = '#34d399';
  ctx.lineWidth = 3;
  const bLen = 14;
  const hw = target.w / 2, hh = target.h / 2;
  // Top-left
  ctx.beginPath(); ctx.moveTo(-hw, -hh + bLen); ctx.lineTo(-hw, -hh); ctx.lineTo(-hw + bLen, -hh); ctx.stroke();
  // Top-right
  ctx.beginPath(); ctx.moveTo(hw, -hh + bLen); ctx.lineTo(hw, -hh); ctx.lineTo(hw - bLen, -hh); ctx.stroke();
  // Bottom-left
  ctx.beginPath(); ctx.moveTo(-hw, hh - bLen); ctx.lineTo(-hw, hh); ctx.lineTo(-hw + bLen, hh); ctx.stroke();
  // Bottom-right
  ctx.beginPath(); ctx.moveTo(hw, hh - bLen); ctx.lineTo(hw, hh); ctx.lineTo(hw - bLen, hh); ctx.stroke();

  // Dashed slot outline
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.5)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 5]);
  ctx.strokeRect(-hw, -hh, target.w, target.h);
  ctx.setLineDash([]);

  // P logo
  ctx.fillStyle = 'rgba(52, 211, 153, 0.7)';
  ctx.font = 'bold 18px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', 0, 0);

  ctx.restore();

  // 3. Draw Obstacles (Detailed parked cars & structures)
  lvl.obstacles.forEach(obs => {
    ctx.save();
    ctx.translate(obs.x, obs.y);

    if (obs.type === 'pillar') {
      // Concrete pillar with hazard stripes
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 3;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
      // Top highlight
      ctx.fillStyle = 'rgba(255,255,255,0.1)';
      ctx.beginPath();
      ctx.arc(0, -3, 8, 0, Math.PI * 2);
      ctx.fill();
    } else if (obs.type === 'wall' || obs.type === 'sidewalk') {
      // Concrete wall with edge highlights
      const wallGrad = ctx.createLinearGradient(-obs.w / 2, 0, obs.w / 2, 0);
      wallGrad.addColorStop(0, '#374151');
      wallGrad.addColorStop(0.5, '#4b5563');
      wallGrad.addColorStop(1, '#374151');
      ctx.fillStyle = wallGrad;
      ctx.fillRect(-obs.w / 2, -obs.h / 2, obs.w, obs.h);
      // Edge highlight
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-obs.w / 2, -obs.h / 2, obs.w, obs.h);
    } else {
      // DETAILED Parked Car
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.roundRect(-obs.w / 2 + 3, -obs.h / 2 + 3, obs.w, obs.h, 8);
      ctx.fill();

      // Body (metallic gradient)
      const carGrad = ctx.createLinearGradient(-obs.w / 2, -obs.h / 2, obs.w / 2, obs.h / 2);
      const baseColor = obs.color || '#334155';
      carGrad.addColorStop(0, baseColor);
      carGrad.addColorStop(0.5, adjustBrightness(baseColor, 30));
      carGrad.addColorStop(1, baseColor);
      ctx.fillStyle = carGrad;
      ctx.beginPath();
      ctx.roundRect(-obs.w / 2, -obs.h / 2, obs.w, obs.h, 8);
      ctx.fill();

      // Cabin Glass
      ctx.fillStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.beginPath();
      ctx.roundRect(-obs.w / 2 + 7, -obs.h / 2 + 18, obs.w - 14, obs.h - 36, 4);
      ctx.fill();

      // Glass reflection
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(-obs.w / 2 + 8, -obs.h / 2 + 20, obs.w - 16, 6);

      // Headlights
      ctx.fillStyle = '#fef9c3';
      ctx.beginPath(); ctx.arc(-obs.w / 2 + 8, obs.h / 2 - 4, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(obs.w / 2 - 8, obs.h / 2 - 4, 3, 0, Math.PI * 2); ctx.fill();

      // Taillights
      ctx.fillStyle = '#ef4444';
      ctx.beginPath(); ctx.arc(-obs.w / 2 + 8, -obs.h / 2 + 4, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(obs.w / 2 - 8, -obs.h / 2 + 4, 3, 0, Math.PI * 2); ctx.fill();

      // Name Label
      ctx.fillStyle = 'rgba(255,255,255,0.65)';
      ctx.font = 'bold 9px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(obs.name || '', 0, 0);
    }
    ctx.restore();
  });

  // 4. Draw Player Car
  drawPlayerCar();

  // 5. Reverse Dynamic Guidelines
  if (car.gear === 'R') {
    drawReverseGuideline();
  }
}

// Helper to lighten/darken hex color
function adjustBrightness(hex, amount) {
  let r = parseInt(hex.slice(1, 3), 16);
  let g = parseInt(hex.slice(3, 5), 16);
  let b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, Math.max(0, r + amount));
  g = Math.min(255, Math.max(0, g + amount));
  b = Math.min(255, Math.max(0, b + amount));
  return `rgb(${r},${g},${b})`;
}

function drawPlayerCar() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  const w = car.width;
  const l = car.length;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.roundRect(-l / 2 + 4, -w / 2 + 4, l, w, 10);
  ctx.fill();

  // Car Body (Metallic Pearl White gradient)
  const bodyGrad = ctx.createLinearGradient(-l / 2, -w / 2, l / 2, w / 2);
  bodyGrad.addColorStop(0, '#e2e8f0');
  bodyGrad.addColorStop(0.3, '#ffffff');
  bodyGrad.addColorStop(0.7, '#f1f5f9');
  bodyGrad.addColorStop(1, '#cbd5e1');
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.roundRect(-l / 2, -w / 2, l, w, 8);
  ctx.fill();

  // Body outline
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Front Hood & Grille
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.roundRect(l / 2 - 10, -w / 2 + 6, 10, w - 12, [0, 4, 4, 0]);
  ctx.fill();

  // Cabin Glass (Panoramic)
  const glassGrad = ctx.createLinearGradient(-l / 2 + 20, 0, l / 2 - 20, 0);
  glassGrad.addColorStop(0, '#0284c7');
  glassGrad.addColorStop(0.5, '#38bdf8');
  glassGrad.addColorStop(1, '#0284c7');
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.roundRect(-l / 2 + 20, -w / 2 + 6, l - 40, w - 12, 4);
  ctx.fill();

  // Glass reflection streak
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillRect(-l / 2 + 24, -w / 2 + 8, l - 48, 3);

  // Headlights (LED Projector with glow)
  ctx.fillStyle = '#fef9c3';
  ctx.shadowBlur = car.gear === 'D' ? 8 : 3;
  ctx.shadowColor = '#fef08a';
  ctx.fillRect(l / 2 - 4, -w / 2 + 4, 4, 8);
  ctx.fillRect(l / 2 - 4, w / 2 - 12, 4, 8);
  ctx.shadowBlur = 0;

  // Taillights (with glow in Reverse)
  ctx.fillStyle = '#ef4444';
  ctx.shadowBlur = car.gear === 'R' ? 10 : 4;
  ctx.shadowColor = '#ef4444';
  ctx.fillRect(-l / 2, -w / 2 + 4, 4, 8);
  ctx.fillRect(-l / 2, w / 2 - 12, 4, 8);
  ctx.shadowBlur = 0;

  // Side Mirrors
  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(l / 2 - 28, -w / 2 - 5, 8, 5);
  ctx.fillRect(l / 2 - 28, w / 2, 8, 5);

  // Wheels (four corners)
  const wheelColor = '#1e293b';
  ctx.fillStyle = wheelColor;
  ctx.fillRect(-l / 2 + 10, -w / 2 - 2, 14, 4);
  ctx.fillRect(-l / 2 + 10, w / 2 - 2, 14, 4);
  ctx.fillRect(l / 2 - 24, -w / 2 - 2, 14, 4);
  ctx.fillRect(l / 2 - 24, w / 2 - 2, 14, 4);

  ctx.restore();
}

function drawReverseGuideline() {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.rotate(car.angle);

  const steerOffset = car.steerAngle * 400;

  // Calculate proximity for color shift
  const lvl = LEVELS[currentLevel - 1];
  const target = lvl.target;
  const dist = Math.hypot(car.x - target.x, car.y - target.y);

  let guideColor = '#ef4444';
  if (dist < 80) guideColor = '#10b981';
  else if (dist < 150) guideColor = '#f59e0b';

  ctx.strokeStyle = guideColor;
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
  ctx.globalAlpha = 0.7;

  // Left guide
  ctx.beginPath();
  ctx.moveTo(-car.length / 2, -car.width / 2);
  ctx.quadraticCurveTo(-car.length / 2 - 45, -car.width / 2 + steerOffset, -car.length / 2 - 100, -car.width / 2 + steerOffset * 1.5);
  ctx.stroke();

  // Right guide
  ctx.beginPath();
  ctx.moveTo(-car.length / 2, car.width / 2);
  ctx.quadraticCurveTo(-car.length / 2 - 45, car.width / 2 + steerOffset, -car.length / 2 - 100, car.width / 2 + steerOffset * 1.5);
  ctx.stroke();

  // Distance markers (cross-bars)
  ctx.globalAlpha = 0.35;
  for (let d = 30; d <= 90; d += 30) {
    const yOff = steerOffset * (d / 100);
    ctx.beginPath();
    ctx.moveTo(-car.length / 2 - d, -car.width / 2 + yOff);
    ctx.lineTo(-car.length / 2 - d, car.width / 2 + yOff);
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  ctx.setLineDash([]);
  ctx.restore();
}


// ══════════════════════════════════════════════════════
//  LOOP
// ══════════════════════════════════════════════════════
function loop() {
  updateCar();
  drawParkingScene();
  requestAnimationFrame(loop);
}

// Start Level 1
initLevel(1);
loop();
