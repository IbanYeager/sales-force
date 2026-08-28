/**
 * spk_arcade_game.js
 * HTML5 Canvas 2D Arcade Racing Game Engine for SPK Input
 * "SPK Rush / Toyota Sales Racer"
 */

(function () {
  let canvas, ctx;
  let animId = null;
  let gameAudioCtx = null;

  // Game Data & State
  const gameState = {
    running: false,
    state: 'START', // 'START', 'RUNNING', 'PITSTOP', 'VICTORY', 'FINISHED'
    score: 0,
    speed: 0,
    maxSpeed: 120,
    distance: 0,
    targetDistance: 1000,
    nitro: 100,
    nitroActive: false,

    // Collected SPK Data
    spkData: {
      nama_customer: '',
      no_hp: '',
      model: '',
      nominal: 0,
      tipe_pembelian: 'Kredit',
      signature: ''
    },

    // Inventory car models pool
    carsPool: [],

    // Player car position
    player: {
      lane: 1, // 0 = Left, 1 = Center, 2 = Right
      x: 0,
      targetX: 0,
      y: 0,
      width: 44,
      height: 75,
      color: '#dc2626' // Toyota Red
    },

    // Entities on road
    entities: [],
    particles: [],

    // Road scroll
    roadOffset: 0
  };

  // Web Audio Synthesizer
  function getAudioCtx() {
    if (!gameAudioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) gameAudioCtx = new AudioCtxClass();
    }
    if (gameAudioCtx && gameAudioCtx.state === 'suspended') {
      gameAudioCtx.resume();
    }
    return gameAudioCtx;
  }

  function playSfx(type) {
    try {
      const actx = getAudioCtx();
      if (!actx) return;

      if (type === 'pickup') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, actx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, actx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.2, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.12);
      } else if (type === 'car_catch') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1046.50, actx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.25);
      } else if (type === 'hit') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, actx.currentTime);
        osc.frequency.linearRampToValueAtTime(60, actx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.3, actx.currentTime);
        gain.gain.linearRampToValueAtTime(0.01, actx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.18);
      } else if (type === 'lane') {
        const osc = actx.createOscillator();
        const gain = actx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, actx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(500, actx.currentTime + 0.06);
        gain.gain.setValueAtTime(0.1, actx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(actx.destination);
        osc.start();
        osc.stop(actx.currentTime + 0.06);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((f, i) => {
          const osc = actx.createOscillator();
          const gain = actx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, actx.currentTime + i * 0.12);
          gain.gain.setValueAtTime(0.25, actx.currentTime + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, actx.currentTime + i * 0.12 + 0.3);
          osc.connect(gain);
          gain.connect(actx.destination);
          osc.start(actx.currentTime + i * 0.12);
          osc.stop(actx.currentTime + i * 0.12 + 0.3);
        });
      }
    } catch (e) {}
  }

  // Initialize Canvas Engine
  window.initArcadeSpkGame = function () {
    canvas = document.getElementById('spkArcadeCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');

    // Resize canvas properly
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = 420;

    gameState.player.y = canvas.height - 90;
    updatePlayerLanePosition(true);

    // Collect available car models from global inventory selector
    populateCarsPool();

    // Event listeners for keyboard
    window.removeEventListener('keydown', handleKeyDown);
    window.addEventListener('keydown', handleKeyDown);

    // Initial render call
    drawStartScreen();
  };

  function populateCarsPool() {
    gameState.carsPool = [];
    const select = document.getElementById('modelSelect') || document.getElementById('gameModelSelect');
    if (select) {
      Array.from(select.options).forEach(opt => {
        if (opt.value && opt.value !== "") {
          gameState.carsPool.push({
            name: opt.value,
            price: opt.dataset.harga || 0,
            label: opt.textContent.split('] ')[1] || opt.value
          });
        }
      });
    }
    if (gameState.carsPool.length === 0) {
      // Fallback inventory defaults if API hasn't loaded yet
      gameState.carsPool = [
        { name: 'Toyota All New Avanza 1.5 G', price: 259800000, label: 'All New Avanza 1.5 G' },
        { name: 'Toyota Kijang Innova Zenix 2.0 V HV', price: 542500000, label: 'Innova Zenix Hybrid' },
        { name: 'Toyota Fortuner 2.8 VRZ 4x2', price: 617700000, label: 'Fortuner 2.8 VRZ' },
        { name: 'Toyota All New Yaris Cross Hybrid', price: 440600000, label: 'Yaris Cross Hybrid' },
        { name: 'Toyota Raize 1.0T GR Sport', price: 283400000, label: 'Raize 1.0T GR' }
      ];
    }
  }

  function getLaneX(laneIndex) {
    const laneWidth = canvas.width / 3;
    return laneIndex * laneWidth + laneWidth / 2;
  }

  function updatePlayerLanePosition(instant = false) {
    gameState.player.targetX = getLaneX(gameState.player.lane) - gameState.player.width / 2;
    if (instant) {
      gameState.player.x = gameState.player.targetX;
    }
  }

  function handleKeyDown(e) {
    if (!gameState.running || gameState.state !== 'RUNNING') return;

    if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
      movePlayerLeft();
    } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
      movePlayerRight();
    } else if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
      triggerNitro(true);
    }
  }

  window.movePlayerLeft = function () {
    if (gameState.player.lane > 0) {
      gameState.player.lane--;
      updatePlayerLanePosition();
      playSfx('lane');
    }
  };

  window.movePlayerRight = function () {
    if (gameState.player.lane < 2) {
      gameState.player.lane++;
      updatePlayerLanePosition();
      playSfx('lane');
    }
  };

  window.triggerNitro = function (active) {
    gameState.nitroActive = active && gameState.nitro > 10;
  };

  // Start / Reset Game
  window.startArcadeGame = function () {
    getAudioCtx();
    populateCarsPool();

    gameState.running = true;
    gameState.state = 'RUNNING';
    gameState.score = 0;
    gameState.speed = 60;
    gameState.distance = 0;
    gameState.nitro = 100;
    gameState.entities = [];
    gameState.particles = [];
    gameState.player.lane = 1;
    updatePlayerLanePosition(true);

    gameState.spkData = {
      nama_customer: '',
      no_hp: '',
      model: '',
      nominal: 0,
      tipe_pembelian: 'Kredit',
      signature: ''
    };

    updateArcadeHud();
    hideOverlays();

    if (animId) cancelAnimationFrame(animId);
    gameLoop();
  };

  function gameLoop() {
    if (!gameState.running) return;

    update();
    render();

    animId = requestAnimationFrame(gameLoop);
  }

  // Update Game Logic
  function update() {
    if (gameState.state !== 'RUNNING') return;

    // Smooth movement for lane switching
    gameState.player.x += (gameState.player.targetX - gameState.player.x) * 0.25;

    // Nitro & Speed mechanics
    if (gameState.nitroActive && gameState.nitro > 0) {
      gameState.speed = Math.min(160, gameState.speed + 2);
      gameState.nitro = Math.max(0, gameState.nitro - 1.2);
      createNitroParticles();
    } else {
      gameState.speed = Math.max(70, gameState.speed - 0.8);
      gameState.nitro = Math.min(100, gameState.nitro + 0.3);
    }

    // Distance progression
    const distDelta = gameState.speed * 0.05;
    gameState.distance += distDelta;
    gameState.score += Math.floor(distDelta * 2);
    gameState.roadOffset = (gameState.roadOffset + gameState.speed * 0.15) % 40;

    // Spawn Entities (Items, Cars, Fuel Cans, Obstacles)
    spawnEntitiesLogic();

    // Update Entities & Collision Check
    const laneWidth = canvas.width / 3;
    for (let i = gameState.entities.length - 1; i >= 0; i--) {
      const ent = gameState.entities[i];
      ent.y += gameState.speed * 0.08 * (ent.speedFactor || 1);

      // Collision box check with Player
      if (checkCollision(gameState.player, ent)) {
        handleEntityCollision(ent, i);
        continue;
      }

      // Remove if off screen
      if (ent.y > canvas.height + 60) {
        gameState.entities.splice(i, 1);
      }
    }

    // Update Particles
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
      const p = gameState.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.04;
      if (p.alpha <= 0) gameState.particles.splice(i, 1);
    }

    // Check Trigger Pitstop HUD (Customer Intake)
    if (!gameState.spkData.nama_customer && gameState.distance > 200 && gameState.state === 'RUNNING') {
      triggerPitStopModal();
    }

    // Check Finish Line (All items caught or distance reached)
    if (gameState.spkData.nama_customer && gameState.spkData.model && gameState.distance >= gameState.targetDistance) {
      triggerFinishLineModal();
    }

    updateArcadeHud();
  }

  function spawnEntitiesLogic() {
    if (Math.random() < 0.035 && gameState.entities.length < 5) {
      const lane = Math.floor(Math.random() * 3);
      const laneX = getLaneX(lane);

      const types = ['CAR_TARGET', 'VIP_CUSTOMER', 'FUEL_KREDIT', 'FUEL_CASH', 'OBSTACLE'];
      let chosenType = types[Math.floor(Math.random() * types.length)];

      // Prioritize car target if not picked yet
      if (!gameState.spkData.model && Math.random() < 0.5) {
        chosenType = 'CAR_TARGET';
      }

      if (chosenType === 'CAR_TARGET' && gameState.carsPool.length > 0) {
        const carInfo = gameState.carsPool[Math.floor(Math.random() * gameState.carsPool.length)];
        gameState.entities.push({
          type: 'CAR_TARGET',
          lane: lane,
          x: laneX - 20,
          y: -80,
          width: 40,
          height: 70,
          carInfo: carInfo,
          speedFactor: 0.65
        });
      } else if (chosenType === 'VIP_CUSTOMER' && !gameState.spkData.nama_customer) {
        gameState.entities.push({
          type: 'VIP_CUSTOMER',
          lane: lane,
          x: laneX - 16,
          y: -40,
          width: 32,
          height: 32,
          speedFactor: 0.8
        });
      } else if (chosenType === 'FUEL_KREDIT' || chosenType === 'FUEL_CASH') {
        gameState.entities.push({
          type: chosenType,
          lane: lane,
          x: laneX - 16,
          y: -40,
          width: 32,
          height: 32,
          speedFactor: 0.8
        });
      } else if (chosenType === 'OBSTACLE') {
        gameState.entities.push({
          type: 'OBSTACLE',
          lane: lane,
          x: laneX - 22,
          y: -50,
          width: 44,
          height: 44,
          label: Math.random() < 0.5 ? 'RAGU' : 'KOMPETITOR',
          speedFactor: 0.75
        });
      }
    }
  }

  function checkCollision(p, e) {
    return (
      p.x < e.x + e.width &&
      p.x + p.width > e.x &&
      p.y < e.y + e.height &&
      p.y + p.height > e.y
    );
  }

  function handleEntityCollision(ent, index) {
    gameState.entities.splice(index, 1);

    if (ent.type === 'CAR_TARGET') {
      playSfx('car_catch');
      gameState.spkData.model = ent.carInfo.name;
      gameState.spkData.nominal = ent.carInfo.price;
      gameState.score += 1500;
      const cleanName = getCleanCarLabel(ent.carInfo.label || ent.carInfo.name);
      createFloatingText(`🚗 ${cleanName} TERPILIH!`, ent.x, ent.y, '#38bdf8');
    } else if (ent.type === 'VIP_CUSTOMER') {
      playSfx('pickup');
      gameState.score += 500;
      createFloatingText('👤 VIP CUSTOMER CATCH!', ent.x, ent.y, '#fbbf24');
      triggerPitStopModal();
    } else if (ent.type === 'FUEL_KREDIT') {
      playSfx('pickup');
      gameState.spkData.tipe_pembelian = 'Kredit';
      gameState.nitro = Math.min(100, gameState.nitro + 40);
      gameState.score += 300;
      createFloatingText('💳 KREDIT SELECTED!', ent.x, ent.y, '#34d399');
    } else if (ent.type === 'FUEL_CASH') {
      playSfx('pickup');
      gameState.spkData.tipe_pembelian = 'Cash';
      gameState.nitro = Math.min(100, gameState.nitro + 40);
      gameState.score += 300;
      createFloatingText('💵 CASH SELECTED!', ent.x, ent.y, '#f59e0b');
    } else if (ent.type === 'OBSTACLE') {
      playSfx('hit');
      gameState.speed = Math.max(30, gameState.speed - 35);
      gameState.score = Math.max(0, gameState.score - 200);
      createFloatingText(`⚠️ ${ent.label}!`, ent.x, ent.y, '#ef4444');
    }
  }

  function createNitroParticles() {
    for (let i = 0; i < 2; i++) {
      gameState.particles.push({
        x: gameState.player.x + gameState.player.width / 2 + (Math.random() * 12 - 6),
        y: gameState.player.y + gameState.player.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 3 + 2,
        alpha: 1,
        color: Math.random() < 0.5 ? '#fbbf24' : '#ef4444'
      });
    }
  }

  function createFloatingText(text, x, y, color) {
    const pop = document.createElement('div');
    pop.className = 'arcade-pop-text';
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    pop.style.color = color;
    pop.textContent = text;
    canvas.parentElement.appendChild(pop);
    setTimeout(() => pop.remove(), 1000);
  }

  // Render Canvas Visuals
  function render() {
    // Clear Canvas Background (Cyberpunk Dark Asphalt)
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Road & Lanes
    drawRoad();

    // Draw Entities
    gameState.entities.forEach(ent => drawEntity(ent));

    // Draw Particles
    gameState.particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Draw Player Car
    drawPlayerCar();

    // Draw Finish Line if close to target
    if (gameState.distance >= gameState.targetDistance - 150) {
      drawFinishBanner();
    }
  }

  function drawRoad() {
    const laneWidth = canvas.width / 3;

    // Grass/Side Curbs
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(0, 0, 10, canvas.height);
    ctx.fillRect(canvas.width - 10, 0, 10, canvas.height);

    // Curb strips
    for (let y = -40 + gameState.roadOffset; y < canvas.height; y += 40) {
      ctx.fillStyle = (Math.floor(y / 40) % 2 === 0) ? '#dc2626' : '#ffffff';
      ctx.fillRect(0, y, 10, 20);
      ctx.fillRect(canvas.width - 10, y, 10, 20);
    }

    // Lane Dividers (Dashed Neon White)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.lineDashOffset = -gameState.roadOffset;

    ctx.beginPath();
    ctx.moveTo(laneWidth, 0);
    ctx.lineTo(laneWidth, canvas.height);
    ctx.moveTo(laneWidth * 2, 0);
    ctx.lineTo(laneWidth * 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]); // Reset
  }

  function drawPlayerCar() {
    const p = gameState.player;

    ctx.save();
    // Car Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(p.x + 4, p.y + 6, p.width, p.height);

    // Car Body Gradient (Toyota Red)
    const grad = ctx.createLinearGradient(p.x, p.y, p.x + p.width, p.y + p.height);
    grad.addColorStop(0, '#f87171');
    grad.addColorStop(0.5, '#dc2626');
    grad.addColorStop(1, '#991b1b');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.width, p.height, 8);
    ctx.fill();

    // Windshield & Roof
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(p.x + 6, p.y + 16, p.width - 12, 18);

    // Headlights (Glowing Yellow)
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#fde047';
    ctx.shadowBlur = 10;
    ctx.fillRect(p.x + 4, p.y + 2, 8, 4);
    ctx.fillRect(p.x + p.width - 12, p.y + 2, 8, 4);

    ctx.restore();
  }

  function getCleanCarLabel(fullStr) {
    if (!fullStr) return 'TOYOTA';
    const s = fullStr.toUpperCase();
    if (s.includes('INNOVA') || s.includes('ZENIX')) return 'INNOVA ZENIX';
    if (s.includes('FORTUNER')) return 'FORTUNER';
    if (s.includes('AVANZA')) return 'ALL NEW AVANZA';
    if (s.includes('YARIS')) return 'YARIS CROSS';
    if (s.includes('RAIZE')) return 'RAIZE GR';
    if (s.includes('VELOZ')) return 'VELOZ';
    if (s.includes('HILUX')) return 'HILUX 4X4';
    if (s.includes('COROLLA') || s.includes('CROSS')) return 'COROLLA CROSS';
    if (s.includes('AGYA')) return 'AGYA GR';
    if (s.includes('CALYA')) return 'CALYA';
    if (s.includes('ALPHARD')) return 'ALPHARD';
    
    // Clean string by removing "TOYOTA" prefix if any
    let cleaned = fullStr.replace(/toyota/i, '').replace(/all new/i, '').trim();
    if (cleaned.length > 15) cleaned = cleaned.substring(0, 15);
    return cleaned.toUpperCase();
  }

  function getCarColor(label) {
    const l = label.toUpperCase();
    if (l.includes('INNOVA')) return { body: '#1d4ed8', roof: '#1e3a8a', badge: '#38bdf8' };
    if (l.includes('FORTUNER')) return { body: '#0f172a', roof: '#334155', badge: '#fbbf24' };
    if (l.includes('AVANZA')) return { body: '#0284c7', roof: '#0369a1', badge: '#7dd3fc' };
    if (l.includes('YARIS')) return { body: '#059669', roof: '#065f46', badge: '#34d399' };
    if (l.includes('RAIZE') || l.includes('VELOZ')) return { body: '#ea580c', roof: '#c2410c', badge: '#f97316' };
    return { body: '#2563eb', roof: '#1e40af', badge: '#fbbf24' };
  }

  function drawEntity(e) {
    ctx.save();

    if (e.type === 'CAR_TARGET') {
      const cleanLabel = getCleanCarLabel(e.carInfo.label || e.carInfo.name);
      const colors = getCarColor(cleanLabel);

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fillRect(e.x + 3, e.y + 4, e.width, e.height);

      // Enemy/Target Toyota Vehicle Body
      ctx.fillStyle = colors.body;
      ctx.beginPath();
      ctx.roundRect(e.x, e.y, e.width, e.height, 8);
      ctx.fill();

      // Roof & Windshield
      ctx.fillStyle = colors.roof;
      ctx.fillRect(e.x + 5, e.y + 20, e.width - 10, 30);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(e.x + 6, e.y + 35, e.width - 12, 12);

      // Taillights (Glowing Red at top since it moves forward)
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(e.x + 4, e.y + e.height - 4, 8, 3);
      ctx.fillRect(e.x + e.width - 12, e.y + e.height - 4, 8, 3);

      // ── HIGH-VISIBILITY FLOATING BADGE BANNER ──
      ctx.font = '900 12px Inter, Orbitron, sans-serif';
      const textWidth = ctx.measureText(cleanLabel).width;
      const badgeW = Math.max(e.width + 24, textWidth + 16);
      const badgeH = 22;
      const badgeX = e.x + e.width / 2 - badgeW / 2;
      const badgeY = e.y - 30;

      // Glowing Badge Background
      ctx.fillStyle = colors.badge;
      ctx.shadowColor = colors.badge;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 11);
      ctx.fill();
      ctx.shadowBlur = 0; // reset glow

      // Badge Border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Badge Text (Dark, Ultra Clear)
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(cleanLabel, e.x + e.width / 2, badgeY + badgeH / 2 + 1);

      // Extra On-Roof Text Label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.fillText(cleanLabel.split(' ')[0], e.x + e.width / 2, e.y + 14);

    } else if (e.type === 'VIP_CUSTOMER') {
      // VIP Badge Orb
      ctx.fillStyle = '#f59e0b';
      ctx.shadowColor = '#fbbf24';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(e.x + 16, e.y + 16, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 16px FontAwesome, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('👤', e.x + 16, e.y + 16);
    } else if (e.type === 'FUEL_KREDIT' || e.type === 'FUEL_CASH') {
      // Fuel Can Nitro
      const isKredit = e.type === 'FUEL_KREDIT';
      ctx.fillStyle = isKredit ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(e.x, e.y, e.width, e.height, 6);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isKredit ? 'KREDIT' : 'CASH', e.x + 16, e.y + 16);
    } else if (e.type === 'OBSTACLE') {
      // Barrier / Warning
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(e.x, e.y, e.width, e.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(e.label, e.x + e.width / 2, e.y + e.height / 2);
    }

    ctx.restore();
  }

  function drawFinishBanner() {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.fillStyle = (Math.floor(x / 20) % 2 === 0) ? '#ffffff' : '#000000';
      ctx.fillRect(x, 40, 20, 20);
    }
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 16px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏁 FINISH LINE 🏁', canvas.width / 2, 30);
    ctx.restore();
  }

  function drawStartScreen() {
    if (!ctx) return;
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 22px Orbitron, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SPK RUSH: TOYOTA SALES RACER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px Inter, sans-serif';
    ctx.fillText('Tangkap VIP Customer & Mobil Pilihan di Jalan Raya!', canvas.width / 2, canvas.height / 2 + 6);

    ctx.fillStyle = '#34d399';
    ctx.font = 'bold 14px Inter, sans-serif';
    ctx.fillText('Gunakan Keyboard [◄] [►] atau Tombol Layar untuk Menyetir', canvas.width / 2, canvas.height / 2 + 40);
  }

  function updateArcadeHud() {
    const elSpeed = document.getElementById('hudSpeed');
    const elScore = document.getElementById('hudScore');
    const elNitro = document.getElementById('hudNitroBar');
    const elCustBadge = document.getElementById('hudCustBadge');
    const elCarBadge = document.getElementById('hudCarBadge');
    const elPayBadge = document.getElementById('hudPayBadge');

    if (elSpeed) elSpeed.textContent = `${Math.floor(gameState.speed)} KM/H`;
    if (elScore) elScore.textContent = `${gameState.score} PTS`;
    if (elNitro) elNitro.style.width = `${gameState.nitro}%`;

    if (elCustBadge) {
      if (gameState.spkData.nama_customer) {
        elCustBadge.className = 'arcade-hud-chip chip-active';
        elCustBadge.textContent = `👤 ${gameState.spkData.nama_customer}`;
      } else {
        elCustBadge.className = 'arcade-hud-chip';
        elCustBadge.textContent = '👤 Pitstop Customer';
      }
    }

    if (elCarBadge) {
      if (gameState.spkData.model) {
        elCarBadge.className = 'arcade-hud-chip chip-active';
        elCarBadge.textContent = `🚗 ${gameState.spkData.model.split(' ')[0] || 'Toyota'}`;
      } else {
        elCarBadge.className = 'arcade-hud-chip';
        elCarBadge.textContent = '🚗 Catch Mobil';
      }
    }

    if (elPayBadge) {
      elPayBadge.textContent = `💳 ${gameState.spkData.tipe_pembelian}`;
    }
  }

  function triggerPitStopModal() {
    gameState.state = 'PITSTOP';
    playSfx('pickup');

    const modal = document.getElementById('arcadePitstopModal');
    if (modal) modal.style.display = 'flex';
  }

  window.savePitStopData = function () {
    const nama = document.getElementById('arcadeInputNama').value.trim();
    const hp = document.getElementById('arcadeInputHp').value.trim();

    if (!nama || !hp) {
      alert('Isi nama & no HP customer untuk melanjut!');
      return;
    }

    gameState.spkData.nama_customer = nama;
    gameState.spkData.no_hp = hp;
    gameState.score += 1000;

    const modal = document.getElementById('arcadePitstopModal');
    if (modal) modal.style.display = 'none';

    gameState.state = 'RUNNING';
  };

  function triggerFinishLineModal() {
    gameState.state = 'VICTORY';
    playSfx('fanfare');

    const overlay = document.getElementById('arcadeFinishOverlay');
    if (overlay) {
      overlay.style.display = 'flex';
      setTimeout(initHoodCanvasSignature, 50);

      // Render summary info
      const sumCust = document.getElementById('finishSumCust');
      const sumPrice = document.getElementById('finishSumPrice');
      const sumPay = document.getElementById('finishSumPay');
      const finishSelect = document.getElementById('finishCarSelect');

      if (sumCust) sumCust.textContent = gameState.spkData.nama_customer || '-';
      if (sumPay) sumPay.textContent = gameState.spkData.tipe_pembelian;

      // Populate Finish Car Select dropdown
      if (finishSelect && gameState.carsPool.length > 0) {
        finishSelect.innerHTML = '';
        gameState.carsPool.forEach(car => {
          const opt = document.createElement('option');
          opt.value = car.name;
          opt.dataset.price = car.price;
          const cleanName = getCleanCarLabel(car.label || car.name);
          opt.textContent = `[${cleanName}] - ${car.label}`;
          if (car.name === gameState.spkData.model) {
            opt.selected = true;
          }
          finishSelect.appendChild(opt);
        });

        // Fallback if current model wasn't set yet
        if (!gameState.spkData.model && gameState.carsPool.length > 0) {
          gameState.spkData.model = gameState.carsPool[0].name;
          gameState.spkData.nominal = gameState.carsPool[0].price;
        }

        updateFinishSummaryPrice();
      }
    }
  }

  window.changeFinishCarModel = function () {
    const finishSelect = document.getElementById('finishCarSelect');
    if (!finishSelect) return;
    const selectedOpt = finishSelect.options[finishSelect.selectedIndex];
    if (selectedOpt) {
      gameState.spkData.model = selectedOpt.value;
      gameState.spkData.nominal = selectedOpt.dataset.price || 0;
      updateFinishSummaryPrice();
      playSfx('pickup');
    }
  };

  function updateFinishSummaryPrice() {
    const sumPrice = document.getElementById('finishSumPrice');
    if (sumPrice) {
      const priceVal = gameState.spkData.nominal ? gameState.spkData.nominal.toString() : '0';
      sumPrice.textContent = `Rp ${formatRupiahInput(priceVal)}`;
    }
    updateArcadeHud();
  }

  function hideOverlays() {
    const pModal = document.getElementById('arcadePitstopModal');
    const fOverlay = document.getElementById('arcadeFinishOverlay');
    if (pModal) pModal.style.display = 'none';
    if (fOverlay) fOverlay.style.display = 'none';
  }

  // Hood Canvas Signature
  let hoodCanvasCtx = null;
  let isHoodDrawing = false;

  function initHoodCanvasSignature() {
    const canvasH = document.getElementById('hoodSignatureCanvas');
    if (!canvasH) return;

    const rect = canvasH.parentElement.getBoundingClientRect();
    canvasH.width = rect.width || 320;
    canvasH.height = 180;
    hoodCanvasCtx = canvasH.getContext('2d');
    hoodCanvasCtx.lineWidth = 3;
    hoodCanvasCtx.lineCap = 'round';
    hoodCanvasCtx.strokeStyle = '#fbbf24';

    function startDraw(e) {
      isHoodDrawing = true;
      draw(e);
    }
    function stopDraw() {
      isHoodDrawing = false;
      if (hoodCanvasCtx) hoodCanvasCtx.beginPath();
    }
    function draw(e) {
      if (!isHoodDrawing || !hoodCanvasCtx) return;
      e.preventDefault();
      let clientX, clientY;
      if (e.type.includes('touch')) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      const r = canvasH.getBoundingClientRect();
      const x = clientX - r.left;
      const y = clientY - r.top;

      hoodCanvasCtx.lineTo(x, y);
      hoodCanvasCtx.stroke();
      hoodCanvasCtx.beginPath();
      hoodCanvasCtx.moveTo(x, y);
    }

    canvasH.addEventListener('mousedown', startDraw);
    canvasH.addEventListener('mousemove', draw);
    canvasH.addEventListener('mouseup', stopDraw);
    canvasH.addEventListener('mouseout', stopDraw);

    canvasH.addEventListener('touchstart', startDraw, { passive: false });
    canvasH.addEventListener('touchmove', draw, { passive: false });
    canvasH.addEventListener('touchend', stopDraw);
  }

  window.clearHoodSignature = function (e) {
    if (e) e.preventDefault();
    const canvasH = document.getElementById('hoodSignatureCanvas');
    if (canvasH && hoodCanvasCtx) {
      hoodCanvasCtx.clearRect(0, 0, canvasH.width, canvasH.height);
    }
  };

  window.submitArcadeSpkFinal = function () {
    const sales_account_id = localStorage.getItem('idSales') || 1;
    const canvasH = document.getElementById('hoodSignatureCanvas');
    let sigData = '';
    if (canvasH) {
      const dataUrl = canvasH.toDataURL();
      if (dataUrl.length > 2000) sigData = dataUrl;
    }

    const btn = document.getElementById('btnSubmitArcadeFinal');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> MEMPROSES SUBMIT...';
    }

    fetch('../api/api_spk.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit',
        sales_account_id,
        nama_customer: gameState.spkData.nama_customer,
        no_hp: gameState.spkData.no_hp,
        model: gameState.spkData.model,
        nominal: gameState.spkData.nominal,
        tipe_pembelian: gameState.spkData.tipe_pembelian,
        signature: sigData
      })
    })
      .then(r => r.json())
      .then(res => {
        if (btn) btn.disabled = false;
        if (res.status === 'success') {
          hideOverlays();
          gameState.running = false;

          if (typeof confetti === 'function') {
            confetti({ particleCount: 180, spread: 90, origin: { y: 0.5 } });
          }

          if (window.showCustomAlert) {
            window.showCustomAlert('🏁 SPK RACER CLOSING BERHASIL!', `Selamat! High Score ${gameState.score} PTS & SPK tercatat di sistem!`, 'success');
          } else {
            alert(`Selamat! SPK berhasil disubmit dengan High Score ${gameState.score} PTS!`);
          }

          if (typeof fetchSpk === 'function') fetchSpk();
        } else {
          alert('Gagal: ' + res.message);
        }
      })
      .catch(err => {
        if (btn) btn.disabled = false;
        console.error(err);
        alert('Gagal terhubung ke server.');
      });
  };

  window.openCarSelectionModal = function () {
    if (gameState.carsPool.length === 0) populateCarsPool();

    let carOptionsText = "PILIH / GANTI MOBIL SPK:\n";
    gameState.carsPool.forEach((c, idx) => {
      const clean = getCleanCarLabel(c.label || c.name);
      carOptionsText += `${idx + 1}. [${clean}] ${c.label}\n`;
    });

    const choice = prompt(carOptionsText + "\nMasukkan nomor pilihan (1 - " + gameState.carsPool.length + "):", "1");
    if (choice) {
      const idx = parseInt(choice, 10) - 1;
      if (idx >= 0 && idx < gameState.carsPool.length) {
        const picked = gameState.carsPool[idx];
        gameState.spkData.model = picked.name;
        gameState.spkData.nominal = picked.price;
        const cleanName = getCleanCarLabel(picked.label || picked.name);
        createFloatingText(`🔄 ${cleanName} TERPILIH!`, canvas.width / 2 - 40, canvas.height / 2, '#38bdf8');
        updateArcadeHud();
        playSfx('pickup');
      }
    }
  };

  function formatRupiahInput(value) {
    let number_string = value.replace(/[^,\d]/g, '').toString(),
      split = number_string.split(','),
      sisa = split[0].length % 3,
      rupiah = split[0].substr(0, sisa),
      ribuan = split[0].substr(sisa).match(/\d{3}/gi);

    if (ribuan) {
      let separator = sisa ? '.' : '';
      rupiah += separator + ribuan.join('.');
    }
    return split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  }
})();
