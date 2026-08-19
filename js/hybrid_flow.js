// ══════════════════════════════════════════════════════
//  TOYOTA HYBRID ENERGY FLOW SIMULATION ENGINE
//  Features: Dynamic Energy Particles, Component Nodes,
//  Realistic Battery SOC & Fuel Economy Math, Scenarios
// ══════════════════════════════════════════════════════

const canvas = document.getElementById('hybridCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const scenTitle = document.getElementById('scenTitle');
const scenDesc = document.getElementById('scenDesc');
const scenIcon = document.getElementById('scenIcon');
const dispKml = document.getElementById('dispKml');
const dispSoc = document.getElementById('dispSoc');
const dispPower = document.getElementById('dispPower');
const dispCo2 = document.getElementById('dispCo2');
const eduTitle = document.getElementById('eduTitle');
const eduDesc = document.getElementById('eduDesc');

// Mode Buttons
const btnEv = document.getElementById('btnEv');
const btnEco = document.getElementById('btnEco');
const btnPower = document.getElementById('btnPower');
const btnRegen = document.getElementById('btnRegen');

// System State
let driveMode = 'EV'; // 'EV', 'ECO', 'POWER', 'REGEN'
let scenarioIndex = 0;
let batterySoc = 78; // %
let fuelEconomyKml = 28.4;
let totalPowerPs = 186;
let co2Reduction = 52; // %

// Scenarios Database
const SCENARIOS = [
  {
    title: 'Jalan Perkotaan (Macet Ringan)',
    desc: 'Kecepatan rendah 0–30 km/j. Sangat efisien jika menggunakan EV Mode tenaga listrik murni.',
    icon: '<i class="fa-solid fa-road"></i>',
    idealMode: 'EV',
    engineActive: false,
    motorActive: true,
    chargingActive: false,
    regenActive: false
  },
  {
    title: 'Jalan Tol Cipularang (Kecepatan Konstan 90 km/j)',
    desc: 'Mesin bensin bekerja pada efisiensi puncak sambil mengisi daya baterai melalui generator MG1.',
    icon: '<i class="fa-solid fa-gauge-high"></i>',
    idealMode: 'ECO',
    engineActive: true,
    motorActive: true,
    chargingActive: true,
    regenActive: false
  },
  {
    title: 'Tanjakan Curam Nagreg / Puncak Pass',
    desc: 'Dibutuhkan torsi instan maksimum dari kombinasi Mesin Bensin 2.0L + Motor Listrik (Dual Power).',
    icon: '<i class="fa-solid fa-mountain"></i>',
    idealMode: 'POWER',
    engineActive: true,
    motorActive: true,
    chargingActive: false,
    regenActive: false
  },
  {
    title: 'Turunan Panjang Tol Jagorawi / Pegunungan',
    desc: 'Regenerative Braking mengubah energi kinetik roda menjadi listrik untuk mengisi ulang baterai.',
    icon: '<i class="fa-solid fa-arrow-trend-down"></i>',
    idealMode: 'REGEN',
    engineActive: false,
    motorActive: false,
    chargingActive: false,
    regenActive: true
  }
];

// Energy Flow Particles
let energyParticles = [];

// Schematic Nodes Coordinates (Scaled to Canvas 800x320)
const NODES = {
  engine: { x: 220, y: 85, label: 'Mesin Bensin', sub: '2.0L Atkinson', color: '#f59e0b', icon: '🔥' },
  generator: { x: 380, y: 85, label: 'Generator MG1', sub: 'Starter/Pengisi', color: '#38bdf8', icon: '⚡' },
  inverter: { x: 380, y: 175, label: 'Inverter/PCU', sub: 'Pengatur Aliran', color: '#818cf8', icon: '🎛️' },
  motor: { x: 540, y: 175, label: 'Motor Listrik MG2', sub: '113 PS / 206 Nm', color: '#0ea5e9', icon: '⚡' },
  battery: { x: 220, y: 245, label: 'Baterai Hybrid', sub: 'Lithium-ion HV', color: '#10b981', icon: '🔋' },
  wheels: { x: 680, y: 175, label: 'Roda Penggerak', sub: 'FWD TNGA', color: '#94a3b8', icon: '🚗' }
};

// Mode Change Handler
function setDriveMode(mode) {
  driveMode = mode;
  [btnEv, btnEco, btnPower, btnRegen].forEach(b => b.className = 'mode-btn');

  if (mode === 'EV') {
    btnEv.className = 'mode-btn active ev';
    eduTitle.innerHTML = '<i class="fa-solid fa-bolt" style="color:#0284c7;"></i> EV Mode (Pure Electric)';
    eduDesc.innerText = 'Mobil digerakkan 100% oleh motor listrik tanpa mengonsumsi bahan bakar dan tanpa emisi gas buang.';
  } else if (mode === 'ECO') {
    btnEco.className = 'mode-btn active eco';
    eduTitle.innerHTML = '<i class="fa-solid fa-leaf" style="color:#10b981;"></i> ECO Mode (Maximum Efficiency)';
    eduDesc.innerText = 'Komputer cerdas mengatur perpaduan mesin bensin dan motor listrik untuk konsumsi BBM paling hemat.';
  } else if (mode === 'POWER') {
    btnPower.className = 'mode-btn active power';
    eduTitle.innerHTML = '<i class="fa-solid fa-fire" style="color:#ef4444;"></i> SPORT / Power Boost Mode';
    eduDesc.innerText = 'Mesin bensin dan motor listrik bekerja bersamaan menyalurkan tenaga maksimal (186 PS) untuk akselerasi responsif.';
  } else if (mode === 'REGEN') {
    btnRegen.className = 'mode-btn active regen';
    eduTitle.innerHTML = '<i class="fa-solid fa-rotate-left" style="color:#f59e0b;"></i> B-Mode / Regenerative Braking';
    eduDesc.innerText = 'Saat deselerasi atau pengereman, motor listrik bertindak sebagai generator untuk mengisi baterai hybrid secara otomatis.';
  }
}

// Next Scenario
function nextScenario() {
  scenarioIndex = (scenarioIndex + 1) % SCENARIOS.length;
  const s = SCENARIOS[scenarioIndex];
  scenTitle.innerText = `Kondisi Jalan: ${s.title}`;
  scenDesc.innerText = s.desc;
  scenIcon.innerHTML = s.icon;
}

// ══════════════════════════════════════════════════════
//  SIMULATION LOOP & PARTICLES
// ══════════════════════════════════════════════════════
function spawnEnergyParticle(fromNode, toNode, colorType) {
  energyParticles.push({
    from: fromNode,
    to: toNode,
    progress: 0,
    speed: 0.02 + Math.random() * 0.01,
    color: colorType
  });
}

function updateSimulation() {
  const s = SCENARIOS[scenarioIndex];

  // Particle spawn rules based on mode & scenario
  if (driveMode === 'EV') {
    if (Math.random() < 0.3) spawnEnergyParticle(NODES.battery, NODES.inverter, '#0284c7');
    if (Math.random() < 0.3) spawnEnergyParticle(NODES.inverter, NODES.motor, '#0284c7');
    if (Math.random() < 0.3) spawnEnergyParticle(NODES.motor, NODES.wheels, '#0284c7');
    batterySoc = Math.max(20, batterySoc - 0.02);
    fuelEconomyKml = 34.2;
    co2Reduction = 85;
    totalPowerPs = 113;
  } else if (driveMode === 'ECO') {
    if (Math.random() < 0.25) spawnEnergyParticle(NODES.engine, NODES.generator, '#f59e0b');
    if (Math.random() < 0.25) spawnEnergyParticle(NODES.generator, NODES.inverter, '#f59e0b');
    if (Math.random() < 0.25) spawnEnergyParticle(NODES.inverter, NODES.battery, '#10b981'); // charge
    if (Math.random() < 0.25) spawnEnergyParticle(NODES.motor, NODES.wheels, '#0284c7');
    batterySoc = Math.min(95, batterySoc + 0.015);
    fuelEconomyKml = 28.6;
    co2Reduction = 55;
    totalPowerPs = 152;
  } else if (driveMode === 'POWER') {
    if (Math.random() < 0.4) spawnEnergyParticle(NODES.engine, NODES.wheels, '#ef4444');
    if (Math.random() < 0.4) spawnEnergyParticle(NODES.battery, NODES.motor, '#ef4444');
    if (Math.random() < 0.4) spawnEnergyParticle(NODES.motor, NODES.wheels, '#ef4444');
    batterySoc = Math.max(15, batterySoc - 0.04);
    fuelEconomyKml = 19.8;
    co2Reduction = 32;
    totalPowerPs = 186;
  } else if (driveMode === 'REGEN') {
    if (Math.random() < 0.35) spawnEnergyParticle(NODES.wheels, NODES.motor, '#10b981');
    if (Math.random() < 0.35) spawnEnergyParticle(NODES.motor, NODES.inverter, '#10b981');
    if (Math.random() < 0.35) spawnEnergyParticle(NODES.inverter, NODES.battery, '#10b981');
    batterySoc = Math.min(98, batterySoc + 0.05);
    fuelEconomyKml = 42.0;
    co2Reduction = 95;
    totalPowerPs = 0;
  }

  // Update Displays
  dispKml.innerHTML = `${fuelEconomyKml.toFixed(1)} <span style="font-size:11px;">km/L</span>`;
  dispSoc.innerText = `${Math.round(batterySoc)}%`;
  dispPower.innerHTML = `${totalPowerPs} <span style="font-size:11px;">PS</span>`;
  dispCo2.innerText = `-${co2Reduction}%`;
}

let hybridFrame = 0;

function drawSchematic() {
  const W = canvas.width;
  const H = canvas.height;
  hybridFrame++;

  ctx.clearRect(0, 0, W, H);

  // Background (Dark circuit board)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, '#050a15');
  bgGrad.addColorStop(0.5, '#0a1628');
  bgGrad.addColorStop(1, '#0c1a30');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // Animated circuit trace pattern
  ctx.strokeStyle = 'rgba(255,255,255,0.02)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  // Animated scan line
  const scanY = (hybridFrame * 0.5) % H;
  ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
  ctx.fillRect(0, scanY - 2, W, 4);

  // Draw Interconnecting High-Voltage Bus Lines (glowing)
  drawBusLine(NODES.engine, NODES.generator);
  drawBusLine(NODES.generator, NODES.inverter);
  drawBusLine(NODES.inverter, NODES.battery);
  drawBusLine(NODES.inverter, NODES.motor);
  drawBusLine(NODES.motor, NODES.wheels);

  // Render Energy Particles with comet tails
  for (let i = energyParticles.length - 1; i >= 0; i--) {
    const p = energyParticles[i];
    p.progress += p.speed;

    const px = p.from.x + (p.to.x - p.from.x) * p.progress;
    const py = p.from.y + (p.to.y - p.from.y) * p.progress;

    // Comet trail
    const trailLen = 0.06;
    const tx = p.from.x + (p.to.x - p.from.x) * Math.max(0, p.progress - trailLen);
    const ty = p.from.y + (p.to.y - p.from.y) * Math.max(0, p.progress - trailLen);

    const trailGrad = ctx.createLinearGradient(tx, ty, px, py);
    trailGrad.addColorStop(0, 'rgba(0,0,0,0)');
    trailGrad.addColorStop(1, p.color);
    ctx.strokeStyle = trailGrad;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Main particle orb
    const orbGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
    orbGrad.addColorStop(0, '#ffffff');
    orbGrad.addColorStop(0.4, p.color);
    orbGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = orbGrad;
    ctx.beginPath();
    ctx.arc(px, py, 6, 0, Math.PI * 2);
    ctx.fill();

    // Outer glow halo
    ctx.fillStyle = p.color;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.arc(px, py, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1.0;

    if (p.progress >= 1) {
      energyParticles.splice(i, 1);
    }
  }

  // Draw Component Nodes
  Object.values(NODES).forEach(node => {
    drawComponentNode(node);
  });
}

function drawBusLine(from, to) {
  // Outer glow line
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  // Main bus line
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  // Pulsing energy dot on line
  const pulsePos = (Math.sin(hybridFrame * 0.04) + 1) / 2;
  const dpx = from.x + (to.x - from.x) * pulsePos;
  const dpy = from.y + (to.y - from.y) * pulsePos;
  ctx.fillStyle = 'rgba(148, 163, 184, 0.15)';
  ctx.beginPath();
  ctx.arc(dpx, dpy, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawComponentNode(node) {
  const boxW = 120;
  const boxH = 56;

  ctx.save();
  ctx.translate(node.x, node.y);

  // Determine if node is active in current mode
  let isActive = false;
  if (driveMode === 'EV' && (node === NODES.battery || node === NODES.inverter || node === NODES.motor || node === NODES.wheels)) isActive = true;
  if (driveMode === 'ECO') isActive = true;
  if (driveMode === 'POWER') isActive = true;
  if (driveMode === 'REGEN' && (node === NODES.wheels || node === NODES.motor || node === NODES.inverter || node === NODES.battery)) isActive = true;

  // Active node outer glow
  if (isActive) {
    const glowPulse = 0.15 + Math.sin(hybridFrame * 0.05) * 0.08;
    const rgbStr = hexToRgb(node.color);
    const glow = ctx.createRadialGradient(0, 0, 10, 0, 0, 50);
    glow.addColorStop(0, `rgba(${rgbStr}, ${glowPulse})`);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Node Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.beginPath();
  ctx.roundRect(-boxW / 2 + 3, -boxH / 2 + 3, boxW, boxH, 14);
  ctx.fill();

  // Node Box (glass-morphism dark)
  const boxGrad = ctx.createLinearGradient(-boxW / 2, -boxH / 2, boxW / 2, boxH / 2);
  boxGrad.addColorStop(0, 'rgba(30, 41, 59, 0.95)');
  boxGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
  ctx.fillStyle = boxGrad;
  ctx.beginPath();
  ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 12);
  ctx.fill();

  // Node Border (Colored, brighter when active)
  ctx.strokeStyle = isActive ? node.color : 'rgba(100, 116, 139, 0.4)';
  ctx.lineWidth = isActive ? 2.5 : 1.5;
  ctx.stroke();

  // Status indicator dot (top right)
  if (isActive) {
    const dotPulse = 0.7 + Math.sin(hybridFrame * 0.08) * 0.3;
    ctx.fillStyle = node.color;
    ctx.globalAlpha = dotPulse;
    ctx.beginPath();
    ctx.arc(boxW / 2 - 10, -boxH / 2 + 10, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Node Icon & Title
  ctx.fillStyle = isActive ? '#ffffff' : '#94a3b8';
  ctx.font = 'bold 12px Outfit, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(`${node.icon} ${node.label}`, 0, -4);

  // Subtitle
  ctx.fillStyle = isActive ? '#cbd5e1' : '#64748b';
  ctx.font = '10px Inter, sans-serif';
  ctx.fillText(node.sub, 0, 14);

  ctx.restore();
}

// Helper: hex to rgb string
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
}

// ══════════════════════════════════════════════════════
//  MAIN LOOP
// ══════════════════════════════════════════════════════
function loop() {
  updateSimulation();
  drawSchematic();
  requestAnimationFrame(loop);
}

// Initialize
setDriveMode('EV');
loop();
