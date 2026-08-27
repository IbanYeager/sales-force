// ══════════════════════════════════════════════════════
//  TOYOTA GR PIT STOP CHALLENGE ENGINE
//  Features: 3-Stage QTE, Web Audio Pneumatic Gun SFX,
//  Refueling Gauge Physics, Millisecond Precision Timer
// ══════════════════════════════════════════════════════

// UI Elements
const dispPitTime = document.getElementById('dispPitTime');
const badgeStep1 = document.getElementById('badgeStep1');
const badgeStep2 = document.getElementById('badgeStep2');
const badgeStep3 = document.getElementById('badgeStep3');
const viewStep1 = document.getElementById('viewStep1');
const viewStep2 = document.getElementById('viewStep2');
const viewStep3 = document.getElementById('viewStep3');
const fuelFill = document.getElementById('fuelFill');
const dispWingAngle = document.getElementById('dispWingAngle');
const btnStartPit = document.getElementById('btnStartPit');

// Audio Context
let audioCtx = null;
function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

function playImpactGunSound() {
  try {
    const ac = getAudioCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(320, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ac.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ac.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start();
    osc.stop(ac.currentTime + 0.08);
  } catch (e) { }
}

// Game State
let isRunning = false;
let currentStage = 1;
let pitStartTime = 0;
let finalPitTime = 0;
let timerInterval = null;

// Stage 1 State
let unscrewedCount = 0;

// Stage 2 State
let isFueling = false;
let fuelLevel = 0;
let fuelInterval = null;

// Stage 3 State
let wingAngle = 0;
let wingInterval = null;

// Start Pit Stop Run
function startPitChallenge() {
  getAudioCtx();
  isRunning = true;
  currentStage = 1;
  unscrewedCount = 0;
  fuelLevel = 0;
  pitStartTime = performance.now();

  // Reset Badges
  badgeStep1.className = 'step-badge active';
  badgeStep2.className = 'step-badge';
  badgeStep3.className = 'step-badge';

  // Show Step 1
  viewStep1.style.display = 'block';
  viewStep2.style.display = 'none';
  viewStep3.style.display = 'none';

  // Reset Lugs
  document.querySelectorAll('.lug-nut').forEach(lug => lug.classList.remove('unscrewed'));

  btnStartPit.style.display = 'none';

  // Start Timer Loop
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (!isRunning) return;
    const elapsed = (performance.now() - pitStartTime) / 1000;
    dispPitTime.innerText = `${elapsed.toFixed(3)} s`;
  }, 30);
}

// Stage 1: Unscrew Lug Nut
function unscrewLug(num) {
  if (!isRunning || currentStage !== 1) return;
  const lug = document.querySelector(`.lug-${num}`);
  if (lug && !lug.classList.contains('unscrewed')) {
    lug.classList.add('unscrewed');
    unscrewedCount++;
    playImpactGunSound();

    if (unscrewedCount >= 5) {
      // Completed Stage 1
      badgeStep1.className = 'step-badge done';
      badgeStep2.className = 'step-badge active';
      currentStage = 2;
      viewStep1.style.display = 'none';
      viewStep2.style.display = 'block';
    }
  }
}

// Stage 2: Refueling
function startFueling() {
  if (!isRunning || currentStage !== 2) return;
  isFueling = true;
  fuelInterval = setInterval(() => {
    if (!isFueling) return;
    fuelLevel = Math.min(100, fuelLevel + 1.8);
    fuelFill.style.width = `${fuelLevel}%`;
  }, 30);
}

function stopFueling() {
  if (!isRunning || currentStage !== 2) return;
  isFueling = false;
  if (fuelInterval) clearInterval(fuelInterval);

  // Check if within green target window (80% - 95%)
  if (fuelLevel >= 78 && fuelLevel <= 98) {
    // Stage 2 Complete
    badgeStep2.className = 'step-badge done';
    badgeStep3.className = 'step-badge active';
    currentStage = 3;
    viewStep2.style.display = 'none';
    viewStep3.style.display = 'block';

    // Start Wing Oscillation
    startWingOscillation();
  } else {
    // Penalty time
    fuelLevel = 0;
    fuelFill.style.width = '0%';
  }
}

// Stage 3: Aero Wing Adjustment
function startWingOscillation() {
  let dir = 1;
  wingAngle = 5;
  wingInterval = setInterval(() => {
    if (!isRunning || currentStage !== 3) return;
    wingAngle += dir * 0.8;
    if (wingAngle >= 25) dir = -1;
    if (wingAngle <= 5) dir = 1;
    dispWingAngle.innerText = `${Math.round(wingAngle)}°`;
  }, 40);
}

function lockWingAngle() {
  if (!isRunning || currentStage !== 3) return;
  if (wingInterval) clearInterval(wingInterval);

  // Finish Pit Stop!
  isRunning = false;
  clearInterval(timerInterval);
  finalPitTime = ((performance.now() - pitStartTime) / 1000).toFixed(3);
  dispPitTime.innerText = `${finalPitTime} s`;

  badgeStep3.className = 'step-badge done';
  btnStartPit.style.display = 'block';
  btnStartPit.innerHTML = '<i class="fa-solid fa-rotate-right"></i> COBA LAGI (RETRY)';

  // Calculate Rank & show modal
  const pitModal = document.getElementById('pitResultModal');
  const pitRankIcon = document.getElementById('pitRankIcon');
  const pitRankTitle = document.getElementById('pitRankTitle');
  const pitRankTime = document.getElementById('pitRankTime');
  const pitRankDesc = document.getElementById('pitRankDesc');

  let rankIcon = '🏆';
  let rankTitle = 'WORLD CLASS GR PIT CREW!';
  let rankDesc = 'Waktu pit stop yang luar biasa cepat! Kamu layak menjadi kru Toyota Gazoo Racing!';
  let timeClass = 'gold';

  if (parseFloat(finalPitTime) > 6.0) {
    rankIcon = '🥉';
    rankTitle = 'ROOKIE PIT CREW';
    rankDesc = 'Masih pemula! Latih kecepatanmu untuk mencapai waktu di bawah 4.5 detik!';
    timeClass = 'bronze';
  } else if (parseFloat(finalPitTime) > 4.5) {
    rankIcon = '🥈';
    rankTitle = 'PRO RACING PIT CREW';
    rankDesc = 'Sangat bagus! Tinggal sedikit lagi untuk menjadi World Class Crew!';
    timeClass = 'silver';
  }

  pitRankIcon.innerText = rankIcon;
  pitRankTitle.innerText = rankTitle;
  pitRankTime.innerText = `${finalPitTime} s`;
  pitRankTime.className = `rank-time ${timeClass}`;
  pitRankDesc.innerText = rankDesc;

  setTimeout(() => {
    pitModal.classList.add('show');
  }, 300);
}

function closePitResult() {
  const pitModal = document.getElementById('pitResultModal');
  pitModal.classList.remove('show');
}

