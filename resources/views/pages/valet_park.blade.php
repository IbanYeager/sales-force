<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Precision Valet Parking 2D</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .valet-hero {
      background: linear-gradient(135deg, #064e3b 0%, #0f172a 70%);
      border-radius: 20px;
      padding: 20px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(16, 185, 129, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .valet-hero h2 {
      font-size: 20px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .valet-hero p {
      font-size: 13px;
      color: #a7f3d0;
      margin: 0;
    }

    /* Top HUD stats */
    .park-hud {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    @media (max-width: 600px) {
      .park-hud {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .hud-card {
      background: #ffffff;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    .hud-card .label {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .hud-card .val {
      font-family: 'Orbitron', monospace;
      font-size: 16px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }

    /* Canvas Wrap */
    .park-canvas-wrap {
      position: relative;
      background: #1e293b;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #334155;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    canvas#parkCanvas {
      display: block;
      width: 100%;
      height: 380px;
      background: #334155;
    }

    /* Sensor radar badge overlay */
    .sensor-overlay {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 30px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      z-index: 5;
    }

    .sensor-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .sensor-dot.warn {
      background: #f59e0b;
      box-shadow: 0 0 8px #f59e0b;
    }

    .sensor-dot.danger {
      background: #ef4444;
      box-shadow: 0 0 10px #ef4444;
    }

    /* Control Panel */
    .controls-panel {
      background: #ffffff;
      border-radius: 20px;
      padding: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      margin-bottom: 20px;
    }

    .ctrl-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      align-items: center;
    }

    .gear-toggle {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .gear-btn {
      padding: 12px;
      border-radius: 12px;
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      font-weight: 900;
      border: 2px solid #e2e8f0;
      background: #f8fafc;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .gear-btn.active.drive {
      background: #dcfce7;
      border-color: #10b981;
      color: #15803d;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }

    .gear-btn.active.rev {
      background: #fee2e2;
      border-color: #ef4444;
      color: #b91c1c;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25);
    }

    .steer-btn-group {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .steer-btn {
      width: 56px;
      height: 56px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      font-size: 20px;
      color: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      user-select: none;
      -webkit-user-select: none;
    }

    .steer-btn:active {
      background: #3b82f6;
      color: white;
      transform: scale(0.92);
    }

    .pedal-group {
      display: flex;
      gap: 8px;
    }

    .pedal-btn {
      flex: 1;
      padding: 18px 8px;
      border-radius: 14px;
      border: none;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      user-select: none;
      -webkit-user-select: none;
      transition: all 0.15s ease;
    }

    .pedal-btn.gas {
      background: linear-gradient(135deg, #10b981, #059669);
      color: white;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
    }

    .pedal-btn.brake {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
    }

    .pedal-btn:active {
      transform: scale(0.94);
    }

    /* Modal Victory / Crash */
    .valet-modal {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(15, 23, 42, 0.95);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(12px);
      padding: 24px 30px;
      border-radius: 20px;
      text-align: center;
      color: white;
      z-index: 20;
      display: none;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }

    .valet-modal.show {
      display: block;
    }

    .valet-modal .stars {
      font-size: 26px;
      color: #fbbf24;
      margin: 10px 0;
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="game.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Precision Valet Parking</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Header -->
      <div class="valet-hero">
        <h2><i class="fa-solid fa-square-parking" style="color:#34d399;"></i> Valet Parking VIP Showroom</h2>
        <p>Manuver mobil Toyota masuk ke slot parkir VIP tanpa menyenggol pilar atau mobil lain. Gunakan bantuan radar
          sensor jarak!</p>
      </div>

      <!-- HUD Top -->
      <div class="park-hud">
        <div class="hud-card">
          <div class="label">Level Parkir</div>
          <div class="val" id="dispLevel">1 / 3</div>
        </div>
        <div class="hud-card">
          <div class="label">Waktu</div>
          <div class="val" id="dispTimer">00:00</div>
        </div>
        <div class="hud-card">
          <div class="label">Akurasi Posisi</div>
          <div class="val" id="dispAccuracy" style="color:#10b981;">0%</div>
        </div>
        <div class="hud-card">
          <div class="label">Benturan</div>
          <div class="val" id="dispBumps" style="color:#ef4444;">0</div>
        </div>
      </div>

      <!-- Canvas Area -->
      <div class="park-canvas-wrap">
        <!-- Sensor Radar Overlay -->
        <div class="sensor-overlay">
          <div class="sensor-dot" id="sensorDot"></div>
          <span id="sensorText">Sensor: AMAN (> 2.0m)</span>
        </div>

        <!-- Victory / Game Over Overlay Modal -->
        <div class="valet-modal" id="valetModal">
          <h3 id="modalTitle" style="font-size:22px; font-weight:900; margin:0;">🎉 PARKIR SEMPURNA!</h3>
          <div class="stars" id="modalStars">⭐⭐⭐</div>
          <p id="modalDesc" style="font-size:13px; color:#cbd5e1; margin:0 0 16px 0;">Mobil berhasil diparkir dengan
            sangat presisi di dalam garis!</p>
          <button class="btn-primary" id="btnNextLevel" onclick="nextLevel()"
            style="padding:10px 20px; border-radius:12px; background:#10b981; color:white; font-weight:800; border:none; cursor:pointer;">
            Level Berikutnya <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <canvas id="parkCanvas" width="800" height="420"></canvas>
      </div>

      <!-- Controls Panel -->
      <div class="controls-panel">
        <div class="ctrl-grid">

          <!-- Gear Transmission (D / R) -->
          <div class="gear-toggle">
            <button class="gear-btn active drive" id="btnDrive" onclick="setGear('D')">
              <i class="fa-solid fa-arrow-up"></i> [D] DRIVE
            </button>
            <button class="gear-btn rev" id="btnRev" onclick="setGear('R')">
              <i class="fa-solid fa-arrow-down"></i> [R] REVERSE
            </button>
          </div>

          <!-- Steer Buttons (Left / Right) -->
          <div class="steer-btn-group">
            <button class="steer-btn" id="btnSteerL" onpointerdown="steerLeft(true)" onpointerup="steerLeft(false)"
              onmousedown="steerLeft(true)" onmouseup="steerLeft(false)" ontouchstart="steerLeft(true)"
              ontouchend="steerLeft(false)">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <button class="steer-btn" id="btnSteerR" onpointerdown="steerRight(true)" onpointerup="steerRight(false)"
              onmousedown="steerRight(true)" onmouseup="steerRight(false)" ontouchstart="steerRight(true)"
              ontouchend="steerRight(false)">
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>

          <!-- Gas & Brake Pedals -->
          <div class="pedal-group">
            <button class="pedal-btn brake" onpointerdown="pressBrake(true)" onpointerup="pressBrake(false)"
              onmousedown="pressBrake(true)" onmouseup="pressBrake(false)" ontouchstart="pressBrake(true)"
              ontouchend="pressBrake(false)">
              <i class="fa-solid fa-hand"></i>
              <span>REM</span>
            </button>
            <button class="pedal-btn gas" onpointerdown="pressGas(true)" onpointerup="pressGas(false)"
              onmousedown="pressGas(true)" onmouseup="pressGas(false)" ontouchstart="pressGas(true)"
              ontouchend="pressGas(false)">
              <i class="fa-solid fa-angles-up"></i>
              <span>GAS</span>
            </button>
          </div>

        </div>
      </div>

    </div>

  </div>

  <script src="../js/valet_park.js"></script>
</body>

</html>