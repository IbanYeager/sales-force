/**
 * TUNAS TOYOTA — TSS (TOYOTA SAFETY SENSE 3.0) DYNAMIC SIMULATOR
 * Pseudo-3D Perspective Canvas Engine, HUD Telemetry & Web Audio Alerts
 * v3.0 — Cinematic Road Perspective
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════
  // 1. SOUND SYNTHESIZER (Web Audio API)
  // ═════════════════════════════════════════════════════════════
  let audioCtx = null;
  let isMuted = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSoundAlert(type) {
    if (isMuted) return;
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      if (type === 'beep_urgent') {
        for (let i = 0; i < 3; i++) {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1050, now + i * 0.12);
          gain.gain.setValueAtTime(0.25, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.08);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.09);
        }
      } else if (type === 'chime_soft') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(660, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'radar_lock') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 2. FEATURE DATA DEFINITIONS
  // ═════════════════════════════════════════════════════════════
  const TSS_FEATURES = {
    'pcs': {
      title: 'Pre-Collision System (PCS)',
      icon: 'fa-triangle-exclamation',
      color: '#ef4444',
      badge: 'Pencegah Tabrakan Depan',
      desc: 'Mendeteksi kendaraan, pejalan kaki, atau pesepeda di depan menggunakan Radar Gelombang Milimeter 77GHz & Monocular Camera. Memberikan Peringatan Bahaya (FCW) dan Mengerem Otomatis (AEB) saat pengemudi terlambat merespons.',
      scenarioText: 'Mobil depan mengerem mendadak pada kecepatan 60 km/jam.',
      initialSpeed: 60,
      initialDist: 70
    },
    'lta': {
      title: 'Lane Tracing Assist (LTA)',
      icon: 'fa-road',
      color: '#3b82f6',
      badge: 'Penjaga Lajur & Kemudi',
      desc: 'Membantu menjaga posisi kendaraan tetap di tengah lajur jalan. Menghasilkan torsi kemudi otomatis dan peringatan visual/suara jika kendaraan mulai melenceng keluar garis tanpa sein.',
      scenarioText: 'Kendaraan melenceng ke lajur kanan akibat pengemudi mengantuk.',
      initialSpeed: 70,
      initialDist: 0
    },
    'drcc': {
      title: 'Dynamic Radar Cruise Control (DRCC)',
      icon: 'fa-gauge-high',
      color: '#10b981',
      badge: 'Adaptif Jarak Aman',
      desc: 'Mengatur kecepatan jelajah dan menyesuaikan jarak aman secara melaju-berhenti (Full-Speed Range) mengikuti kecepatan kendaraan di depan secara mulus tanpa menekan pedal rem/gas.',
      scenarioText: 'Mobil depan melambat 80 ➔ 40 km/jam saat kemacetan jalan tol.',
      initialSpeed: 80,
      initialDist: 50
    },
    'ahb': {
      title: 'Automatic High Beam (AHB)',
      icon: 'fa-lightbulb',
      color: '#f59e0b',
      badge: 'Lampu Jauh Adaptif',
      desc: 'Mengidentifikasi lampu kendaraan dari arah berlawanan di malam hari secara otomatis. Menukar Lampu Jauh (High Beam) ke Lampu Dekat (Low Beam) agar pengemudi seberang tidak silau.',
      scenarioText: 'Kendaraan datang dari arah berlawanan di jalan raya malam hari.',
      initialSpeed: 65,
      initialDist: 140
    },
    'bsm': {
      title: 'Blind Spot Monitor (BSM)',
      icon: 'fa-eye',
      color: '#8b5cf6',
      badge: 'Detektor Titik Buta Spion',
      desc: 'Menggunakan sensor radar belakang untuk mendeteksi kendaraan di area blind spot (tidak terlihat di spion). Menyalakan indikator LED terang di kaca spion luar kanan/kiri.',
      scenarioText: 'Motor / mobil menyalip dari area samping belakang titik buta.',
      initialSpeed: 75,
      initialDist: 25
    }
  };

  // ═════════════════════════════════════════════════════════════
  // 3. ENGINE STATE & SIMULATION VARIABLES
  // ═════════════════════════════════════════════════════════════
  let currentFeature = 'pcs';
  let animFrameId = null;
  let isRunning = false;
  let simTime = 0;
  let simSpeedMultiplier = 1.0;
  let lastTimestamp = 0;

  let mainCar = { x: 90, y: 120, speed: 60, targetSpeed: 60, brakeLight: false, steeringOffset: 0, beamMode: 'high' };
  let targetCar = { x: 520, y: 120, speed: 60, targetSpeed: 60, active: true, type: 'car' };
  let roadOffset = 0;
  let simLog = [];
  let alertBanner = { show: false, text: '', color: '#ef4444' };
  let bsmLedActive = false;
  let soundPlayedSteps = {};
  let particles = [];

  // ═════════════════════════════════════════════════════════════
  // 4. SIMULATION RESET, LOG & PHYSICS
  // ═════════════════════════════════════════════════════════════
  function resetSimulationState(key) {
    simTime = 0;
    roadOffset = 0;
    simLog = [];
    alertBanner = { show: false, text: '', color: '#ef4444' };
    bsmLedActive = false;
    soundPlayedSteps = {};
    particles = [];

    const feat = TSS_FEATURES[key] || TSS_FEATURES['pcs'];
    mainCar = {
      x: 90, y: 120,
      speed: feat.initialSpeed,
      targetSpeed: feat.initialSpeed,
      brakeLight: false,
      steeringOffset: 0,
      beamMode: key === 'ahb' ? 'high' : 'off'
    };

    if (key === 'pcs') {
      targetCar = { x: 520, y: 120, speed: 60, targetSpeed: 10, active: true, type: 'car' };
      addLog('0.0s', 'PCS Active', 'Radar 77GHz memindai jalan depan. Kecepatan 60 km/jam.');
    } else if (key === 'lta') {
      targetCar = { x: 0, y: 0, speed: 0, targetSpeed: 0, active: false, type: 'none' };
      addLog('0.0s', 'LTA Active', 'Kamera membaca garis marka jalan. Kendaraan di tengah lajur.');
    } else if (key === 'drcc') {
      targetCar = { x: 450, y: 120, speed: 80, targetSpeed: 40, active: true, type: 'car' };
      addLog('0.0s', 'DRCC Cruise', 'Cruise Speed diset 80 km/jam. Radar mengunci target depan.');
    } else if (key === 'ahb') {
      targetCar = { x: 750, y: 70, speed: 70, targetSpeed: 70, active: true, type: 'oncoming' };
      addLog('0.0s', 'AHB Night Mode', 'Kondisi gelap. High Beam (Lampu Jauh) menyala otomatis.');
    } else if (key === 'bsm') {
      targetCar = { x: -60, y: 165, speed: 92, targetSpeed: 92, active: true, type: 'bike' };
      addLog('0.0s', 'BSM Monitoring', 'Sensor radar samping memantau zona titik buta spion.');
    }

    updateTelemetryUI(0);
    renderCanvas();
    updateTimelineUI();
  }

  function addLog(timeStr, label, desc) {
    if (!simLog.some(l => l.label === label)) {
      simLog.unshift({ time: timeStr, label: label, desc: desc });
      if (simLog.length > 6) simLog.pop();
    }
  }

  function updatePhysics(dt) {
    simTime += dt * simSpeedMultiplier;
    roadOffset = (roadOffset + (mainCar.speed * 4) * dt * simSpeedMultiplier) % 200;

    if (currentFeature === 'pcs') updatePCS(dt);
    else if (currentFeature === 'lta') updateLTA(dt);
    else if (currentFeature === 'drcc') updateDRCC(dt);
    else if (currentFeature === 'ahb') updateAHB(dt);
    else if (currentFeature === 'bsm') updateBSM(dt);

    // Update particles
    particles = particles.filter(p => {
      p.life -= dt * (p.type === 'spark' ? 3.5 : 1.5);
      if (p.type === 'spark') {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 3 * dt;
      } else if (p.type === 'pulse') {
        p.radius += 120 * dt;
      }
      return p.life > 0;
    });
  }

  function emitBrakeParticles(x, y) {
    for (let i = 0; i < 4; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 2 + 1,
        life: 1.0,
        type: 'spark',
        color: Math.random() > 0.5 ? '#ff6b35' : '#ffd700'
      });
    }
  }

  function emitRadarPulse(x, y) {
    particles.push({
      x: x, y: y,
      radius: 5,
      life: 1.0,
      type: 'pulse',
      color: '#38bdf8'
    });
  }

  // ── PCS PHYSICS ──
  function updatePCS(dt) {
    if (simTime >= 1.0 && simTime < 4.0) {
      targetCar.speed = Math.max(5, targetCar.speed - 18 * dt * simSpeedMultiplier);
      targetCar.brakeLight = true;
    }
    targetCar.x += (targetCar.speed - mainCar.speed) * dt * 3.5 * simSpeedMultiplier;
    let distanceMeters = Math.max(1.5, ((targetCar.x - mainCar.x - 70) / 6).toFixed(1));

    if (distanceMeters <= 32 && simTime < 2.5) {
      alertBanner = { show: true, text: '⚠️ FCW ALERT! PERINGATAN BAHAYA TABRAKAN', color: '#f59e0b' };
      if (!soundPlayedSteps['fcw']) {
        playSoundAlert('beep_urgent');
        soundPlayedSteps['fcw'] = true;
        addLog(simTime.toFixed(1) + 's', '⚠️ FCW Alert', 'Radar mendeteksi laju pengurangan jarak berbahaya!');
      }
    }
    if (distanceMeters <= 20) {
      alertBanner = { show: true, text: '🛑 AEB ACTIVE! PENGEREMAN OTOMATIS DARURAT', color: '#ef4444' };
      mainCar.brakeLight = true;
      mainCar.speed = Math.max(0, mainCar.speed - 32 * dt * simSpeedMultiplier);
      if (!soundPlayedSteps['aeb']) {
        playSoundAlert('beep_urgent');
        soundPlayedSteps['aeb'] = true;
        addLog(simTime.toFixed(1) + 's', '🛑 AEB Braking', 'Sistem TSS mengerem penuh secara otomatis.');
      }
    }
    if (mainCar.speed === 0 && distanceMeters > 0) {
      alertBanner = { show: true, text: '✅ TERHINDAR DARI TABRAKAN! STOP AMAN (' + distanceMeters + 'm)', color: '#10b981' };
      addLog(simTime.toFixed(1) + 's', '✅ Safe Stop', 'Kendaraan berhenti total pada jarak aman ' + distanceMeters + ' meter.');
    }
  }

  // ── LTA PHYSICS ──
  function updateLTA(dt) {
    if (simTime >= 0.8 && simTime < 2.4) {
      mainCar.steeringOffset += 18 * dt * simSpeedMultiplier;
    }
    if (mainCar.steeringOffset > 15 && simTime < 2.5) {
      alertBanner = { show: true, text: '⚠️ LANE DEPARTURE! MOBIL KELUAR MARKA JALAN', color: '#f59e0b' };
      if (!soundPlayedSteps['ldw']) {
        playSoundAlert('chime_soft');
        soundPlayedSteps['ldw'] = true;
        addLog(simTime.toFixed(1) + 's', '⚠️ Line Drift', 'Marka terbaca melenceng tanpa lampu sein.');
      }
    }
    if (simTime >= 2.4 && mainCar.steeringOffset > 0) {
      alertBanner = { show: true, text: '🔵 LTA STEERING ASSIST! KOREKSI KEMUDI OTOMATIS', color: '#3b82f6' };
      mainCar.steeringOffset = Math.max(0, mainCar.steeringOffset - 22 * dt * simSpeedMultiplier);
      if (!soundPlayedSteps['lta_steer']) {
        playSoundAlert('chime_soft');
        soundPlayedSteps['lta_steer'] = true;
        addLog(simTime.toFixed(1) + 's', '🔵 Steering Correct', 'Torsi kemudi otomatis mengembalikan posisi ke tengah lajur.');
      }
    }
    if (simTime > 3.8 && mainCar.steeringOffset === 0) {
      alertBanner = { show: true, text: '✅ LAJUR STABIL TERJAGA KEMBALI', color: '#10b981' };
    }
  }

  // ── DRCC PHYSICS ──
  function updateDRCC(dt) {
    if (simTime >= 1.0 && simTime < 4.0) {
      targetCar.speed = Math.max(40, targetCar.speed - 14 * dt * simSpeedMultiplier);
      targetCar.brakeLight = true;
    } else if (simTime >= 5.0) {
      targetCar.speed = Math.min(75, targetCar.speed + 12 * dt * simSpeedMultiplier);
      targetCar.brakeLight = false;
    }
    targetCar.x += (targetCar.speed - mainCar.speed) * dt * 3.5 * simSpeedMultiplier;
    let distanceMeters = Math.max(5, ((targetCar.x - mainCar.x - 70) / 6).toFixed(1));
    if (targetCar.speed < mainCar.speed) {
      mainCar.speed = Math.max(targetCar.speed, mainCar.speed - 12 * dt * simSpeedMultiplier);
      mainCar.brakeLight = true;
      alertBanner = { show: true, text: '🟢 DRCC ADAPTIF: MEMPERLAMBAT (' + mainCar.speed.toFixed(0) + ' km/h)', color: '#10b981' };
      if (!soundPlayedSteps['drcc_slow']) {
        playSoundAlert('radar_lock');
        soundPlayedSteps['drcc_slow'] = true;
        addLog(simTime.toFixed(1) + 's', '🟢 Speed Adjust', 'DRCC menurunkan kecepatan otomatis menjaga jarak 30m.');
      }
    } else if (simTime > 5.0 && mainCar.speed < targetCar.speed) {
      mainCar.speed = Math.min(targetCar.speed, mainCar.speed + 10 * dt * simSpeedMultiplier);
      mainCar.brakeLight = false;
      alertBanner = { show: true, text: '🟢 DRCC ACCELERATING: MENINGKATKAN KECEPATAN', color: '#10b981' };
    } else {
      mainCar.brakeLight = false;
    }
  }

  // ── AHB PHYSICS ──
  function updateAHB(dt) {
    targetCar.x -= (targetCar.speed + mainCar.speed) * dt * 2.2 * simSpeedMultiplier;
    let dist = targetCar.x - mainCar.x;
    if (dist < 420 && dist > 80) {
      mainCar.beamMode = 'low';
      alertBanner = { show: true, text: '🟡 AHB ➔ LOW BEAM (LAMPU DEKAT) OTOMATIS', color: '#f59e0b' };
      if (!soundPlayedSteps['ahb_low']) {
        playSoundAlert('chime_soft');
        soundPlayedSteps['ahb_low'] = true;
        addLog(simTime.toFixed(1) + 's', '🟡 Low Beam Switch', 'Kamera mendeteksi sorot lampu lawan arah -> Lampu Dekat.');
      }
    } else {
      mainCar.beamMode = 'high';
      if (dist <= 80 && dist > -150) {
        alertBanner = { show: true, text: '✅ KENDARAAN SEBERANG MELEWATI TANPA SILAU', color: '#10b981' };
      } else if (dist <= -150) {
        alertBanner = { show: true, text: '💡 HIGH BEAM KEMBALI AKTIF OTOMATIS', color: '#3b82f6' };
        if (!soundPlayedSteps['ahb_high']) {
          soundPlayedSteps['ahb_high'] = true;
          addLog(simTime.toFixed(1) + 's', '💡 High Beam Restored', 'Jalanan depan kosong -> High Beam aktif otomatis.');
        }
      }
    }
  }

  // ── BSM PHYSICS ──
  function updateBSM(dt) {
    if (simTime < 4.0) {
      targetCar.x += (targetCar.speed - mainCar.speed) * dt * 3.0 * simSpeedMultiplier;
    }
    let relativeX = targetCar.x - mainCar.x;
    if (relativeX >= -40 && relativeX <= 40) {
      bsmLedActive = true;
      alertBanner = { show: true, text: '🟣 BSM ALERT! KENDARAAN DI TITIK BUTA SPION', color: '#8b5cf6' };
      if (!soundPlayedSteps['bsm_on']) {
        playSoundAlert('chime_soft');
        soundPlayedSteps['bsm_on'] = true;
        addLog(simTime.toFixed(1) + 's', '🟣 Blind Spot Alert', 'Kendaraan berada di titik buta spion. Lampu LED menyala.');
      }
    } else {
      bsmLedActive = false;
      if (relativeX > 40) {
        alertBanner = { show: true, text: '✅ KENDARAAN KELUAR DARI ZONA BLIND SPOT', color: '#10b981' };
      }
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 5. PSEUDO-3D PERSPECTIVE RENDERING ENGINE
  // ═════════════════════════════════════════════════════════════
  const ROAD = {
    horizonRatio: 0.34,   // horizon at 34% from top
    roadWidthFactor: 0.32 // road half-width as fraction of canvas width
  };

  function helperRoundedRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // ── SKY ──
  function drawSky(ctx, W, H) {
    const horizonY = H * ROAD.horizonRatio;
    const isNight = (currentFeature === 'ahb');

    const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY + 10);
    if (isNight) {
      skyGrad.addColorStop(0, '#020617');
      skyGrad.addColorStop(0.4, '#0a0f1e');
      skyGrad.addColorStop(1, '#111b33');
    } else {
      skyGrad.addColorStop(0, '#070d1f');
      skyGrad.addColorStop(0.3, '#0e1a3a');
      skyGrad.addColorStop(0.65, '#1a365f');
      skyGrad.addColorStop(1, '#2d5a87');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, horizonY + 10);

    // Stars (night mode)
    if (isNight) {
      for (let i = 0; i < 45; i++) {
        const sx = (i * 131 + 47) % W;
        const sy = (i * 89 + 23) % (horizonY * 0.65);
        const twinkle = 0.3 + Math.abs(Math.sin(simTime * 2 + i)) * 0.7;
        const size = (i % 4 === 0) ? 2.5 : 1.5;
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.6})`;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Horizon atmospheric glow
    const glowGrad = ctx.createLinearGradient(0, horizonY - 30, 0, horizonY + 10);
    if (isNight) {
      glowGrad.addColorStop(0, 'rgba(20, 30, 60, 0)');
      glowGrad.addColorStop(1, 'rgba(20, 30, 60, 0.6)');
    } else {
      glowGrad.addColorStop(0, 'rgba(80, 140, 200, 0)');
      glowGrad.addColorStop(1, 'rgba(80, 140, 200, 0.15)');
    }
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, horizonY - 30, W, 40);
  }

  // ── MOUNTAINS ──
  function drawMountains(ctx, W, H) {
    const horizonY = H * ROAD.horizonRatio;
    const isNight = (currentFeature === 'ahb');

    // Far mountain range
    ctx.fillStyle = isNight ? '#0a1025' : '#0f1f3a';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    const peaks1 = [
      [0.05, 35], [0.12, 18], [0.22, 48], [0.32, 22],
      [0.42, 55], [0.52, 28], [0.62, 50], [0.72, 20],
      [0.82, 42], [0.92, 30], [1.0, 18]
    ];
    for (const [px, py] of peaks1) {
      ctx.lineTo(W * px, horizonY - py);
    }
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();

    // Near mountain range (darker, overlapping)
    ctx.fillStyle = isNight ? '#060b18' : '#0b1528';
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    const peaks2 = [
      [0.0, 12], [0.1, 28], [0.18, 14], [0.28, 36],
      [0.38, 16], [0.5, 32], [0.6, 12], [0.7, 26],
      [0.78, 10], [0.88, 22], [0.95, 8], [1.0, 16]
    ];
    for (const [px, py] of peaks2) {
      ctx.lineTo(W * px, horizonY - py);
    }
    ctx.lineTo(W, horizonY);
    ctx.closePath();
    ctx.fill();
  }

  // ── PERSPECTIVE ROAD ──
  function drawRoad(ctx, W, H) {
    const horizonY = H * ROAD.horizonRatio;
    const roadBottom = H;
    const segments = 100;
    const lateralShift = (currentFeature === 'lta') ? mainCar.steeringOffset * 2.8 : 0;
    const isNight = (currentFeature === 'ahb');

    for (let i = 0; i < segments; i++) {
      const t = i / segments;
      const nextT = (i + 1) / segments;

      const y = roadBottom - t * (roadBottom - horizonY);
      const nextY = roadBottom - nextT * (roadBottom - horizonY);
      if (nextY >= y) continue;

      // Exponential perspective
      const scale = Math.pow(1 - t, 2.0);
      const nextScale = Math.pow(1 - nextT, 2.0);

      const roadHalfW = W * ROAD.roadWidthFactor * scale;
      const nextRoadHalfW = W * ROAD.roadWidthFactor * nextScale;
      const cx = W / 2 - lateralShift * scale;
      const nextCx = W / 2 - lateralShift * nextScale;

      // Alternating stripes for depth perception
      const stripePhase = ((i + Math.floor(roadOffset * 0.12)) % 8) < 4;

      // ── Grass / Shoulder ──
      const grassColor1 = isNight ? (stripePhase ? '#05120a' : '#071408') : (stripePhase ? '#0c3d15' : '#0f4a1a');
      const grassColor2 = isNight ? (stripePhase ? '#061208' : '#081508') : (stripePhase ? '#0e4418' : '#11501d');

      // Left grass
      ctx.fillStyle = grassColor1;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(cx - roadHalfW, y);
      ctx.lineTo(nextCx - nextRoadHalfW, nextY);
      ctx.lineTo(0, nextY);
      ctx.closePath();
      ctx.fill();

      // Right grass
      ctx.fillStyle = grassColor2;
      ctx.beginPath();
      ctx.moveTo(cx + roadHalfW, y);
      ctx.lineTo(W, y);
      ctx.lineTo(W, nextY);
      ctx.lineTo(nextCx + nextRoadHalfW, nextY);
      ctx.closePath();
      ctx.fill();

      // ── Road shoulder (darker strip) ──
      const shoulderW = roadHalfW * 0.06;
      const nextShoulderW = nextRoadHalfW * 0.06;
      ctx.fillStyle = stripePhase ? '#1a1a22' : '#181820';

      // Left shoulder
      ctx.beginPath();
      ctx.moveTo(cx - roadHalfW, y);
      ctx.lineTo(cx - roadHalfW + shoulderW, y);
      ctx.lineTo(nextCx - nextRoadHalfW + nextShoulderW, nextY);
      ctx.lineTo(nextCx - nextRoadHalfW, nextY);
      ctx.closePath();
      ctx.fill();

      // Right shoulder
      ctx.beginPath();
      ctx.moveTo(cx + roadHalfW - shoulderW, y);
      ctx.lineTo(cx + roadHalfW, y);
      ctx.lineTo(nextCx + nextRoadHalfW, nextY);
      ctx.lineTo(nextCx + nextRoadHalfW - nextShoulderW, nextY);
      ctx.closePath();
      ctx.fill();

      // ── Road surface ──
      const roadLight = isNight ? (stripePhase ? '#1a1e28' : '#171b24') : (stripePhase ? '#2a2e38' : '#262a32');
      ctx.fillStyle = roadLight;
      ctx.beginPath();
      ctx.moveTo(cx - roadHalfW + shoulderW, y);
      ctx.lineTo(cx + roadHalfW - shoulderW, y);
      ctx.lineTo(nextCx + nextRoadHalfW - nextShoulderW, nextY);
      ctx.lineTo(nextCx - nextRoadHalfW + nextShoulderW, nextY);
      ctx.closePath();
      ctx.fill();

      // ── White edge lines ──
      if (scale > 0.03) {
        const edgeLineW = Math.max(1, 3 * scale);
        ctx.fillStyle = isNight ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.6)';

        // Left edge
        ctx.fillRect(cx - roadHalfW + shoulderW - edgeLineW / 2, nextY, edgeLineW, y - nextY + 1);
        // Right edge
        ctx.fillRect(cx + roadHalfW - shoulderW - edgeLineW / 2, nextY, edgeLineW, y - nextY + 1);
      }

      // ── Center dashed line ──
      if (stripePhase && scale > 0.04) {
        const dashW = Math.max(1, 4 * scale);
        const dashH = Math.abs(y - nextY) + 1;

        // LTA: lane marking turns red/warning when drifting
        if (currentFeature === 'lta' && mainCar.steeringOffset > 10) {
          ctx.fillStyle = `rgba(239, 68, 68, ${0.5 + Math.sin(simTime * 8) * 0.3})`;
        } else {
          ctx.fillStyle = isNight ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.55)';
        }
        ctx.fillRect(cx - dashW / 2, nextY, dashW, dashH);
      }

      // ── LTA rumble strip markers ──
      if (currentFeature === 'lta' && mainCar.steeringOffset > 10 && stripePhase && scale > 0.06) {
        const rumbleW = Math.max(2, 8 * scale);
        ctx.fillStyle = `rgba(59, 130, 246, ${0.4 + Math.sin(simTime * 6) * 0.3})`;
        // Right rumble strip (where car is drifting toward)
        ctx.fillRect(cx + roadHalfW * 0.48, nextY, rumbleW, Math.abs(y - nextY) + 1);
      }

      // ── Road side posts (barrier markers) ──
      if (i % 20 === 0 && scale > 0.08) {
        const postH = Math.max(4, 18 * scale);
        const postW = Math.max(1, 3 * scale);

        // Left post
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx - roadHalfW - postW * 2, y - postH, postW, postH);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - roadHalfW - postW * 2, y - postH, postW, postH * 0.3);

        // Right post
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(cx + roadHalfW + postW, y - postH, postW, postH);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx + roadHalfW + postW, y - postH, postW, postH * 0.3);
      }
    }
  }

  // ── 3D VEHICLE RENDERER ──
  function getTargetZ() {
    // Normalize target distance to 0 (very close) — 1 (far away/horizon)
    const dist = targetCar.x - mainCar.x;
    return Math.min(0.92, Math.max(0.05, dist / 660));
  }

  function draw3DCar(ctx, W, H, zDepth, lateralOffset, color, label, isBraking, isFlipped) {
    const horizonY = H * ROAD.horizonRatio;
    const roadBottom = H * 0.82;

    // Position & scale from depth
    const scale = Math.max(0.08, Math.pow(1 - zDepth, 1.8));
    const screenY = horizonY + (roadBottom - horizonY) * (1 - zDepth);
    const screenX = W / 2 + lateralOffset * scale * 1.5;

    const carW = 90 * scale;
    const carH = 50 * scale;
    const bodyH = carH * 0.55;
    const cabinH = carH * 0.45;

    const cx = screenX;
    const by = screenY; // bottom of car

    if (carW < 4) return; // too small to render

    ctx.save();

    // ── Shadow ──
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(cx, by + 3 * scale, carW * 0.55, carH * 0.12, 0, 0, Math.PI * 2);
    ctx.fill();

    // ── Car Body (lower) ──
    const bodyGrad = ctx.createLinearGradient(cx - carW / 2, by - bodyH, cx + carW / 2, by);
    bodyGrad.addColorStop(0, color);
    bodyGrad.addColorStop(0.5, color);
    bodyGrad.addColorStop(1, darkenColor(color, 0.6));
    ctx.fillStyle = bodyGrad;
    helperRoundedRect(ctx, cx - carW / 2, by - bodyH, carW, bodyH, 5 * scale);
    ctx.fill();

    // ── Car Cabin (upper glass area) ──
    const cabinW = carW * 0.72;
    const cabinGrad = ctx.createLinearGradient(0, by - bodyH - cabinH, 0, by - bodyH);
    cabinGrad.addColorStop(0, '#1a2540');
    cabinGrad.addColorStop(0.3, '#253350');
    cabinGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = cabinGrad;
    helperRoundedRect(ctx, cx - cabinW / 2, by - bodyH - cabinH + 2 * scale, cabinW, cabinH, 4 * scale);
    ctx.fill();

    // ── Windshield reflection ──
    if (scale > 0.15) {
      ctx.fillStyle = 'rgba(130, 180, 255, 0.12)';
      const refW = cabinW * 0.4;
      const refH = cabinH * 0.5;
      helperRoundedRect(ctx, cx - refW / 2 - cabinW * 0.1, by - bodyH - cabinH + 5 * scale, refW, refH, 3 * scale);
      ctx.fill();
    }

    // ── Wheels ──
    if (scale > 0.1) {
      const wheelW = carW * 0.16;
      const wheelH = bodyH * 0.32;
      const wheelY = by - wheelH * 0.3;
      ctx.fillStyle = '#0a0a0a';
      // Left wheels
      helperRoundedRect(ctx, cx - carW / 2 - wheelW * 0.15, wheelY, wheelW, wheelH, 2 * scale);
      ctx.fill();
      // Right wheels
      helperRoundedRect(ctx, cx + carW / 2 - wheelW * 0.85, wheelY, wheelW, wheelH, 2 * scale);
      ctx.fill();

      // Wheel rims
      ctx.fillStyle = '#334155';
      const rimR = wheelH * 0.3;
      ctx.beginPath();
      ctx.arc(cx - carW / 2 + wheelW * 0.35, wheelY + wheelH / 2, rimR, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(cx + carW / 2 - wheelW * 0.35, wheelY + wheelH / 2, rimR, 0, Math.PI * 2);
      ctx.fill();
    }

    // ── Tail lights / Head lights ──
    if (scale > 0.1) {
      const lightR = Math.max(2, 5 * scale);
      const lightY = by - bodyH * 0.5;

      if (isFlipped) {
        // Headlights (front view — oncoming car)
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 15 * scale;
        ctx.beginPath();
        ctx.arc(cx - carW * 0.38, lightY, lightR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + carW * 0.38, lightY, lightR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      } else {
        // Tail lights
        ctx.fillStyle = isBraking ? '#ff2020' : '#7f1d1d';
        if (isBraking) {
          ctx.shadowColor = '#ff2020';
          ctx.shadowBlur = 20 * scale;
        }
        ctx.beginPath();
        ctx.arc(cx - carW * 0.38, lightY, lightR, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + carW * 0.38, lightY, lightR, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // ── Body accent line ──
    if (scale > 0.12) {
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = Math.max(1, 1.5 * scale);
      ctx.beginPath();
      ctx.moveTo(cx - carW / 2 + 3 * scale, by - bodyH * 0.6);
      ctx.lineTo(cx + carW / 2 - 3 * scale, by - bodyH * 0.6);
      ctx.stroke();
    }

    // ── Label ──
    if (scale > 0.18) {
      ctx.fillStyle = '#e2e8f0';
      ctx.font = `600 ${Math.max(9, 12 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, by + 16 * scale);
      ctx.textAlign = 'left';
    }

    ctx.restore();
    return { x: cx, y: by, scale: scale, carW: carW, carH: carH };
  }

  function draw3DMotorcycle(ctx, W, H, zDepth, lateralOffset, color, label) {
    const horizonY = H * ROAD.horizonRatio;
    const roadBottom = H * 0.82;
    const scale = Math.max(0.08, Math.pow(1 - zDepth, 1.8));
    const screenY = horizonY + (roadBottom - horizonY) * (1 - zDepth);
    const screenX = W / 2 + lateralOffset * scale * 1.5;
    const bikeW = 35 * scale;
    const bikeH = 40 * scale;
    const cx = screenX;
    const by = screenY;

    if (bikeW < 3) return null;
    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(cx, by + 2 * scale, bikeW * 0.5, bikeH * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Bike body
    ctx.fillStyle = color;
    helperRoundedRect(ctx, cx - bikeW / 2, by - bikeH * 0.6, bikeW, bikeH * 0.6, 3 * scale);
    ctx.fill();

    // Rider helmet
    if (scale > 0.12) {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, by - bikeH * 0.6 - 6 * scale, 7 * scale, 0, Math.PI * 2);
      ctx.fill();
      // Visor
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(cx, by - bikeH * 0.6 - 5 * scale, 4 * scale, 0, Math.PI);
      ctx.fill();
    }

    // Wheels
    ctx.fillStyle = '#0a0a0a';
    ctx.beginPath();
    ctx.arc(cx, by, 4 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, by - bikeH * 0.65, 3 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Taillight
    ctx.fillStyle = '#ff4444';
    ctx.shadowColor = '#ff4444';
    ctx.shadowBlur = 6 * scale;
    ctx.fillRect(cx - 2 * scale, by - bikeH * 0.15, 4 * scale, 3 * scale);
    ctx.shadowBlur = 0;

    // Label
    if (scale > 0.18) {
      ctx.fillStyle = color;
      ctx.font = `600 ${Math.max(9, 11 * scale)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(label, cx, by + 15 * scale);
      ctx.textAlign = 'left';
    }

    ctx.restore();
    return { x: cx, y: by, scale: scale };
  }

  // ── RADAR BEAM 3D CONE ──
  function drawRadarCone(ctx, W, H) {
    if (currentFeature !== 'pcs' && currentFeature !== 'drcc') return;

    const horizonY = H * ROAD.horizonRatio;
    const roadBottom = H * 0.82;
    const z = getTargetZ();

    // Cone originates from main car position (bottom)
    const coneStartY = roadBottom - 10;
    const coneEndY = horizonY + (roadBottom - horizonY) * (1 - z);

    const startW = 30;
    const endW = 160 * Math.pow(1 - z, 1.5);
    const cx = W / 2;

    const isWarning = alertBanner.show && alertBanner.color === '#ef4444';
    const isYellow = alertBanner.show && alertBanner.color === '#f59e0b';

    // Animated radar pulse offset
    const pulseAlpha = 0.15 + Math.sin(simTime * 6) * 0.08;

    const coneGrad = ctx.createLinearGradient(0, coneStartY, 0, coneEndY);
    if (isWarning) {
      coneGrad.addColorStop(0, `rgba(239, 68, 68, ${pulseAlpha + 0.1})`);
      coneGrad.addColorStop(1, `rgba(239, 68, 68, 0.02)`);
    } else if (isYellow) {
      coneGrad.addColorStop(0, `rgba(245, 158, 11, ${pulseAlpha + 0.08})`);
      coneGrad.addColorStop(1, `rgba(245, 158, 11, 0.02)`);
    } else {
      coneGrad.addColorStop(0, `rgba(56, 189, 248, ${pulseAlpha})`);
      coneGrad.addColorStop(1, `rgba(56, 189, 248, 0.02)`);
    }

    ctx.fillStyle = coneGrad;
    ctx.beginPath();
    ctx.moveTo(cx - startW / 2, coneStartY);
    ctx.lineTo(cx - endW / 2, coneEndY);
    ctx.lineTo(cx + endW / 2, coneEndY);
    ctx.lineTo(cx + startW / 2, coneStartY);
    ctx.closePath();
    ctx.fill();

    // Radar scan line
    const scanOffset = (simTime * 2) % 1;
    const scanY = coneStartY + (coneEndY - coneStartY) * scanOffset;
    const scanW = startW + (endW - startW) * scanOffset;
    ctx.strokeStyle = isWarning
      ? `rgba(239, 68, 68, ${0.5 - scanOffset * 0.4})`
      : `rgba(56, 189, 248, ${0.4 - scanOffset * 0.35})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - scanW / 2, scanY);
    ctx.lineTo(cx + scanW / 2, scanY);
    ctx.stroke();
  }

  // ── AHB HEADLIGHT BEAMS ──
  function drawHeadlightBeams(ctx, W, H) {
    if (currentFeature !== 'ahb') return;

    const horizonY = H * ROAD.horizonRatio;
    const roadBottom = H * 0.82;
    const isHigh = (mainCar.beamMode === 'high');
    const beamReach = isHigh ? 0.85 : 0.4;

    const beamEndY = horizonY + (roadBottom - horizonY) * (1 - beamReach);
    const cx = W / 2;
    const startW = 50;
    const endW = isHigh ? W * 0.55 : W * 0.3;

    const beamGrad = ctx.createLinearGradient(0, roadBottom, 0, beamEndY);
    const intensity = isHigh ? 0.25 : 0.12;
    beamGrad.addColorStop(0, `rgba(254, 240, 138, ${intensity})`);
    beamGrad.addColorStop(0.6, `rgba(254, 240, 138, ${intensity * 0.4})`);
    beamGrad.addColorStop(1, `rgba(254, 240, 138, 0)`);

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(cx - startW / 2, roadBottom);
    ctx.lineTo(cx - endW / 2, beamEndY);
    ctx.lineTo(cx + endW / 2, beamEndY);
    ctx.lineTo(cx + startW / 2, roadBottom);
    ctx.closePath();
    ctx.fill();

    // Road surface illumination
    const roadGlow = ctx.createRadialGradient(cx, roadBottom * 0.85, 20, cx, roadBottom * 0.85, W * 0.4);
    roadGlow.addColorStop(0, `rgba(254, 240, 138, ${isHigh ? 0.1 : 0.04})`);
    roadGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
    ctx.fillStyle = roadGlow;
    ctx.fillRect(0, horizonY, W, H - horizonY);

    // Oncoming car headlight glare
    if (targetCar.active) {
      const dist = targetCar.x - mainCar.x;
      const z = Math.min(0.92, Math.max(0.05, dist / 660));
      const scale = Math.pow(1 - z, 1.8);
      const screenY = horizonY + (roadBottom - horizonY) * (1 - z);
      const glareR = Math.max(5, 60 * scale);

      if (dist > -100 && dist < 700) {
        const onGrad = ctx.createRadialGradient(W / 2, screenY, 0, W / 2, screenY, glareR);
        const glareAlpha = Math.min(0.5, scale * 0.8);
        onGrad.addColorStop(0, `rgba(254, 240, 138, ${glareAlpha})`);
        onGrad.addColorStop(0.4, `rgba(254, 240, 138, ${glareAlpha * 0.4})`);
        onGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
        ctx.fillStyle = onGrad;
        ctx.beginPath();
        ctx.arc(W / 2, screenY, glareR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ── BSM SIDE MIRROR INDICATORS ──
  function drawBSMIndicators(ctx, W, H) {
    if (currentFeature !== 'bsm') return;

    const roadBottom = H * 0.82;

    // Right side mirror housing
    const mirrorX = W * 0.78;
    const mirrorY = roadBottom - 20;
    const mirrorW = 40;
    const mirrorH = 28;

    // Mirror frame
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    helperRoundedRect(ctx, mirrorX, mirrorY, mirrorW, mirrorH, 6);
    ctx.fill();
    ctx.stroke();

    // Mirror glass (reflecting road behind)
    const glassGrad = ctx.createLinearGradient(mirrorX, mirrorY, mirrorX + mirrorW, mirrorY + mirrorH);
    glassGrad.addColorStop(0, '#1a2540');
    glassGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = glassGrad;
    helperRoundedRect(ctx, mirrorX + 3, mirrorY + 3, mirrorW - 6, mirrorH - 6, 4);
    ctx.fill();

    // BSM LED Indicator triangle on mirror
    if (bsmLedActive) {
      const pulse = 0.6 + Math.sin(simTime * 8) * 0.4;
      ctx.fillStyle = `rgba(249, 115, 22, ${pulse})`;
      ctx.shadowColor = '#f97316';
      ctx.shadowBlur = 18;

      // LED triangle
      ctx.beginPath();
      ctx.moveTo(mirrorX + mirrorW - 8, mirrorY + 5);
      ctx.lineTo(mirrorX + mirrorW - 3, mirrorY + mirrorH / 2);
      ctx.lineTo(mirrorX + mirrorW - 8, mirrorY + mirrorH - 5);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;

      // LED label
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⚠ BSM', mirrorX + mirrorW / 2, mirrorY + mirrorH + 14);
      ctx.textAlign = 'left';
    }

    // Left mirror (inactive)
    const lMirrorX = W * 0.15;
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    helperRoundedRect(ctx, lMirrorX, mirrorY, mirrorW, mirrorH, 6);
    ctx.fill();
    ctx.stroke();

    const lGlassGrad = ctx.createLinearGradient(lMirrorX, mirrorY, lMirrorX + mirrorW, mirrorY + mirrorH);
    lGlassGrad.addColorStop(0, '#1a2540');
    lGlassGrad.addColorStop(1, '#0f172a');
    ctx.fillStyle = lGlassGrad;
    helperRoundedRect(ctx, lMirrorX + 3, mirrorY + 3, mirrorW - 6, mirrorH - 6, 4);
    ctx.fill();
  }

  // ── PARTICLES ──
  function drawParticles(ctx) {
    for (const p of particles) {
      const alpha = Math.max(0, p.life);
      if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.fillRect(p.x, p.y, 3, 3);
      } else if (p.type === 'pulse') {
        ctx.strokeStyle = p.color;
        ctx.globalAlpha = alpha * 0.4;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }

  // ── HUD OVERLAY ON CANVAS ──
  function drawCanvasHUD(ctx, W, H) {
    // Speed arc gauge (bottom-left)
    const gaugeX = 58;
    const gaugeY = H - 42;
    const gaugeR = 32;

    // Gauge background arc
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI * 0.75, Math.PI * 2.25);
    ctx.stroke();

    // Gauge fill arc
    const speedPct = Math.min(1, mainCar.speed / 120);
    const endAngle = Math.PI * 0.75 + speedPct * Math.PI * 1.5;

    const gaugeColor = mainCar.brakeLight ? '#ef4444' : '#38bdf8';
    ctx.strokeStyle = gaugeColor;
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(gaugeX, gaugeY, gaugeR, Math.PI * 0.75, endAngle);
    ctx.stroke();
    ctx.lineCap = 'butt';

    // Speed number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Sora, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(mainCar.speed), gaugeX, gaugeY + 5);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 8px Inter, sans-serif';
    ctx.fillText('km/h', gaugeX, gaugeY + 16);

    // Distance indicator (bottom-right)
    if (targetCar.active) {
      const dist = Math.max(0, ((targetCar.x - mainCar.x - 70) / 6)).toFixed(1);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px Sora, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(dist + 'm', W - 20, H - 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 8px Inter, sans-serif';
      ctx.fillText('Jarak Target', W - 20, H - 18);
    }

    // Time display (bottom-center)
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('T+ ' + simTime.toFixed(1) + 's', W / 2, H - 12);

    ctx.textAlign = 'left';

    // Feature label badge (top-right)
    const feat = TSS_FEATURES[currentFeature];
    if (feat) {
      const badgeText = feat.title;
      ctx.font = 'bold 10px Inter, sans-serif';
      const textW = ctx.measureText(badgeText).width;
      const badgeX = W - textW - 28;
      const badgeY = 12;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
      helperRoundedRect(ctx, badgeX - 8, badgeY - 2, textW + 20, 20, 10);
      ctx.fill();

      ctx.strokeStyle = feat.color;
      ctx.lineWidth = 1;
      helperRoundedRect(ctx, badgeX - 8, badgeY - 2, textW + 20, 20, 10);
      ctx.stroke();

      ctx.fillStyle = feat.color;
      ctx.fillText(badgeText, badgeX + 2, badgeY + 12);
    }

    // Radar status dot (top-left)
    const dotPulse = 0.5 + Math.sin(simTime * 4) * 0.5;
    ctx.fillStyle = `rgba(16, 185, 129, ${dotPulse})`;
    ctx.beginPath();
    ctx.arc(18, 22, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.font = '600 9px Inter, sans-serif';
    ctx.fillText('RADAR LIVE', 28, 25);
  }

  // ── ALERT BANNER OVERLAY ──
  function drawAlertOverlay(ctx, W, H) {
    if (!alertBanner.show) return;

    const bannerH = 34;
    const bannerY = H * 0.04;

    // Banner background with glassmorphism
    ctx.fillStyle = alertBanner.color;
    ctx.globalAlpha = 0.85;
    helperRoundedRect(ctx, 14, bannerY, W - 28, bannerH, 8);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Banner border glow
    ctx.strokeStyle = alertBanner.color;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    helperRoundedRect(ctx, 14, bannerY, W - 28, bannerH, 8);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // Banner text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';

    // Truncate text if too wide
    let bannerText = alertBanner.text;
    const maxTextW = W - 60;
    while (ctx.measureText(bannerText).width > maxTextW && bannerText.length > 20) {
      bannerText = bannerText.slice(0, -4) + '...';
    }
    ctx.fillText(bannerText, W / 2, bannerY + bannerH / 2 + 4);
    ctx.textAlign = 'left';
  }

  // ── SPEED LINES EFFECT ──
  function drawSpeedLines(ctx, W, H) {
    if (mainCar.speed < 30) return;
    const intensity = Math.min(1, (mainCar.speed - 30) / 80);
    const count = Math.floor(intensity * 12);

    ctx.strokeStyle = `rgba(255, 255, 255, ${intensity * 0.08})`;
    ctx.lineWidth = 1;

    for (let i = 0; i < count; i++) {
      const x = (i * 97 + Math.floor(roadOffset * 3 + i * 41)) % W;
      const startY = H * 0.4 + (i * 37 % (H * 0.4));
      const len = 15 + intensity * 30;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x + (x > W / 2 ? 3 : -3), startY + len);
      ctx.stroke();
    }
  }

  // ── VIGNETTE CINEMATIC BORDER ──
  function drawVignette(ctx, W, H) {
    // Top vignette
    const topGrad = ctx.createLinearGradient(0, 0, 0, H * 0.15);
    topGrad.addColorStop(0, 'rgba(0,0,0,0.4)');
    topGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, W, H * 0.15);

    // Bottom vignette
    const botGrad = ctx.createLinearGradient(0, H * 0.88, 0, H);
    botGrad.addColorStop(0, 'rgba(0,0,0,0)');
    botGrad.addColorStop(1, 'rgba(0,0,0,0.5)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, H * 0.88, W, H * 0.12);

    // Side vignettes
    const leftGrad = ctx.createLinearGradient(0, 0, W * 0.08, 0);
    leftGrad.addColorStop(0, 'rgba(0,0,0,0.3)');
    leftGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(0, 0, W * 0.08, H);

    const rightGrad = ctx.createLinearGradient(W * 0.92, 0, W, 0);
    rightGrad.addColorStop(0, 'rgba(0,0,0,0)');
    rightGrad.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(W * 0.92, 0, W * 0.08, H);
  }

  // ── COLOR UTILITY ──
  function darkenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
  }

  // ═════════════════════════════════════════════════════════════
  // MAIN RENDER ORCHESTRATOR
  // ═════════════════════════════════════════════════════════════
  function renderCanvas() {
    const canvas = document.getElementById('tssCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // 1. Sky
    drawSky(ctx, W, H);

    // 2. Mountains
    drawMountains(ctx, W, H);

    // 3. Perspective Road
    drawRoad(ctx, W, H);

    // 4. AHB Headlight beams (under vehicles)
    drawHeadlightBeams(ctx, W, H);

    // 5. Radar cone (under target vehicle)
    drawRadarCone(ctx, W, H);

    // 6. Target vehicle
    if (targetCar.active) {
      if (currentFeature === 'ahb') {
        // Oncoming car: show on opposite lane
        const dist = targetCar.x - mainCar.x;
        const z = Math.min(0.92, Math.max(0.05, Math.abs(dist) / 660));
        if (dist > -100) {
          draw3DCar(ctx, W, H, z, -40, '#94a3b8', 'Arah Berlawanan', false, true);
        }
      } else if (currentFeature === 'bsm') {
        // Motorcycle from behind — positioned to the right
        const relX = targetCar.x - mainCar.x;
        let bikeZ, bikeLateral;
        if (relX < -40) {
          // Behind: small, far, to the right
          bikeZ = 0.3 + Math.max(0, (-relX - 40) / 200);
          bikeLateral = 130;
        } else if (relX >= -40 && relX <= 40) {
          // In blind spot: alongside, to the right
          bikeZ = 0.15;
          bikeLateral = 160;
        } else {
          // Passed: moving ahead
          bikeZ = Math.max(0.05, 0.15 + (relX - 40) / 300);
          bikeLateral = 100;
        }
        draw3DMotorcycle(ctx, W, H, bikeZ, bikeLateral, '#fbbf24', 'Titik Buta');
      } else {
        // PCS / DRCC: car ahead
        const z = getTargetZ();
        draw3DCar(ctx, W, H, z, 0, '#f87171', 'Mobil Depan', targetCar.brakeLight, false);
      }
    }

    // 7. Main vehicle (player's Toyota — at bottom)
    const mainZ = 0.02; // very close = very large
    const mainLateral = (currentFeature === 'lta') ? mainCar.steeringOffset * -0.5 : 0;
    draw3DCar(ctx, W, H, mainZ, mainLateral, '#38bdf8', 'Mobil Anda (TSS 3.0)', mainCar.brakeLight, false);

    // 8. BSM side mirror indicators
    drawBSMIndicators(ctx, W, H);

    // 9. Particles
    drawParticles(ctx);

    // 10. Speed lines
    drawSpeedLines(ctx, W, H);

    // 11. Cinematic vignette border
    drawVignette(ctx, W, H);

    // 12. HUD overlay
    drawCanvasHUD(ctx, W, H);

    // 13. Alert banner
    drawAlertOverlay(ctx, W, H);

    // Emit brake particles periodically when braking
    if (mainCar.brakeLight && isRunning && Math.random() < 0.15) {
      emitBrakeParticles(W / 2, H * 0.78);
    }

    // Emit radar pulses periodically
    if (isRunning && (currentFeature === 'pcs' || currentFeature === 'drcc') && Math.random() < 0.03) {
      emitRadarPulse(W / 2, H * 0.78);
    }
  }

  // ═════════════════════════════════════════════════════════════
  // 6. UI UPDATE HELPERS
  // ═════════════════════════════════════════════════════════════
  function updateTelemetryUI() {
    const speedEl = document.getElementById('tssSpeedVal');
    if (speedEl) speedEl.textContent = Math.round(mainCar.speed);

    const distEl = document.getElementById('tssDistVal');
    if (distEl) {
      if (targetCar.active) {
        let dist = Math.max(0, ((targetCar.x - mainCar.x - 70) / 6)).toFixed(1);
        distEl.textContent = dist + ' m';
      } else {
        distEl.textContent = '---';
      }
    }

    const timeEl = document.getElementById('tssTimeVal');
    if (timeEl) timeEl.textContent = simTime.toFixed(1) + 's';

    const statusBox = document.getElementById('tssStatusBox');
    if (statusBox) {
      if (alertBanner.show) {
        statusBox.textContent = alertBanner.text;
        statusBox.className = 'tss-status-box active-pulse';
      } else {
        const feat = TSS_FEATURES[currentFeature];
        statusBox.textContent = feat ? feat.scenarioText : 'Sistem TSS Aktif Scanning...';
        statusBox.className = 'tss-status-box normal';
      }
    }
  }

  function updateTimelineUI() {
    const listEl = document.getElementById('tssTimelineList');
    if (!listEl) return;

    if (simLog.length === 0) {
      listEl.innerHTML = '<div style="color:#64748b; font-size:0.8rem; text-align:center; padding:10px;">Simulasi siap dijalankan. Klik "Uji Simulasi Bahaya" untuk mulai.</div>';
      return;
    }

    listEl.innerHTML = simLog.map(item => `
      <div class="tss-log-item">
        <span class="tss-log-time">${item.time}</span>
        <div class="tss-log-content">
          <strong>${item.label}</strong>
          <span>${item.desc}</span>
        </div>
      </div>
    `).join('');
  }

  // ═════════════════════════════════════════════════════════════
  // 7. ANIMATION LOOP & PUBLIC CONTROLLER
  // ═════════════════════════════════════════════════════════════
  function tick(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const dt = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
    lastTimestamp = timestamp;

    if (isRunning) {
      updatePhysics(dt);
      updateTelemetryUI();
      updateTimelineUI();
    }

    renderCanvas();

    if (simTime >= 7.5 && isRunning) {
      ToyotaTSS.pauseSimulation();
    } else if (isRunning) {
      animFrameId = requestAnimationFrame(tick);
    } else {
      animFrameId = null;
    }
  }

  window.ToyotaTSS = {
    selectFeature: function (key) {
      if (key === 'lda') key = 'lta';
      currentFeature = key;
      const data = TSS_FEATURES[key] || TSS_FEATURES['pcs'];
      if (!data) return;

      this.pauseSimulation();

      document.querySelectorAll('.tss-tab-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.querySelector(`[data-feature="${key}"], [data-tss="${key}"]`) || (key === 'lta' ? document.querySelector('[data-feature="lda"]') : null);
      if (activeBtn) activeBtn.classList.add('active');

      const titleEl = document.getElementById('tssFeatureTitle') || document.getElementById('tssTitle');
      if (titleEl) titleEl.innerHTML = `<i class="fa-solid ${data.icon}"></i> ${data.title}`;

      const badgeEl = document.getElementById('tssBadge');
      if (badgeEl) {
        badgeEl.textContent = data.badge;
        badgeEl.style.borderColor = data.color;
        badgeEl.style.color = data.color;
      }

      const statusTextEl = document.getElementById('tssStatusText');
      if (statusTextEl) statusTextEl.textContent = data.badge;

      const descEl = document.getElementById('tssFeatureDesc') || document.getElementById('tssDesc');
      if (descEl) descEl.textContent = data.desc;

      const scenarioEl = document.getElementById('tssScenarioText');
      if (scenarioEl) scenarioEl.textContent = data.scenarioText;

      resetSimulationState(key);

      if (window.ToyotaRewards) {
        window.ToyotaRewards.addPoints(50, `Eksplorasi TSS: ${data.title}`);
      }
    },

    triggerScenario: function () {
      if (isRunning) {
        this.pauseSimulation();
      } else {
        initAudio();
        if (simTime >= 7.0) {
          resetSimulationState(currentFeature);
        }
        this.startSimulation();
      }
    },

    startSimulation: function () {
      if (simTime >= 7.0) {
        resetSimulationState(currentFeature);
      }
      isRunning = true;
      lastTimestamp = performance.now();
      const playBtn = document.getElementById('tssPlayBtn') || document.getElementById('btnStartSim');
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause Simulasi';
      if (!animFrameId) {
        animFrameId = requestAnimationFrame(tick);
      }
    },

    pauseSimulation: function () {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      const playBtn = document.getElementById('tssPlayBtn') || document.getElementById('btnStartSim');
      if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Mulai Uji Fitur';
    },

    resetSimulation: function () {
      this.pauseSimulation();
      resetSimulationState(currentFeature);
      renderCanvas();
    },

    setSpeed: function (multiplier) {
      simSpeedMultiplier = multiplier;
      document.querySelectorAll('.tss-speed-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseFloat(btn.dataset.speed) === multiplier) {
          btn.classList.add('active');
        }
      });
      if (simTime >= 7.0) {
        resetSimulationState(currentFeature);
      }
    },

    toggleSound: function () {
      isMuted = !isMuted;
      const soundBtn = document.getElementById('tssSoundBtn');
      if (soundBtn) {
        soundBtn.innerHTML = isMuted
          ? '<i class="fa-solid fa-volume-xmark"></i> Mute'
          : '<i class="fa-solid fa-volume-high"></i> Suara On';
        soundBtn.style.color = isMuted ? '#94a3b8' : '#38bdf8';
      }
    }
  };

  // ═════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═════════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('tssCanvas');
    if (canvas) {
      const container = canvas.parentElement;
      canvas.width = container ? container.clientWidth : 800;
      canvas.height = container ? (container.clientHeight || 320) : 320;

      window.addEventListener('resize', function () {
        if (container) {
          canvas.width = container.clientWidth || 800;
          canvas.height = container.clientHeight || 320;
          renderCanvas();
        }
      });
    }

    // Attach click listeners to feature tabs
    document.querySelectorAll('.tss-tab-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const feat = this.getAttribute('data-feature') || this.getAttribute('data-tss') || 'pcs';
        ToyotaTSS.selectFeature(feat);
      });
    });

    // Attach click listener to start button
    const startBtn = document.getElementById('btnStartSim') || document.getElementById('tssPlayBtn');
    if (startBtn) {
      startBtn.addEventListener('click', function () {
        ToyotaTSS.triggerScenario();
      });
    }

    // Attach click listener to reset button
    const resetBtn = document.getElementById('btnResetSim');
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        ToyotaTSS.resetSimulation();
      });
    }

    ToyotaTSS.selectFeature('pcs');
    renderCanvas();
  });
})();
