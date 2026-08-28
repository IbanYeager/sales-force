<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Toyota Safety Sense (TSS) Simulator</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .tss-hero-section {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 35%, #1a1a2e 65%, #0f172a 100%);
      border-radius: 20px;
      padding: 24px 20px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .tss-tabs-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .tss-tab-btn {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 12px 14px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      transition: all 0.2s ease;
    }

    .tss-tab-btn i {
      font-size: 16px;
      color: var(--primary-red, #CC0000);
    }

    .tss-tab-btn.active {
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #ffffff;
      border-color: #ef4444;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.35);
    }

    .tss-tab-btn.active i {
      color: #ffffff;
    }

    .canvas-container {
      position: relative;
      background: #0f172a;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #e2e8f0;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    canvas {
      display: block;
      width: 100%;
      height: 280px;
      background: #1e293b;
    }

    .tss-hud-top {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      pointer-events: none;
      z-index: 5;
    }

    .tss-hud-badge {
      background: rgba(15, 23, 42, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(6px);
      padding: 6px 14px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .tss-hud-badge.warning {
      background: rgba(245, 158, 11, 0.85);
      border-color: #f59e0b;
      color: #ffffff;
    }

    .tss-hud-badge.danger {
      background: rgba(239, 68, 68, 0.9);
      border-color: #ef4444;
      color: #ffffff;
    }

    .tss-hud-badge.safe {
      background: rgba(16, 185, 129, 0.9);
      border-color: #10b981;
      color: #ffffff;
    }

    .speed-gauge {
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      font-weight: 900;
      color: #fef08a;
      background: rgba(15, 23, 42, 0.85);
      padding: 6px 12px;
      border-radius: 50px;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .sim-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
    }

    .btn-sim {
      flex: 1;
      padding: 12px;
      border-radius: 14px;
      font-weight: 800;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-sim.start {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
    }

    .btn-sim.reset {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #0f172a;
    }

    .feature-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 18px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .feature-card h3 {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 8px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .feature-card h3 i {
      color: var(--primary-red, #CC0000);
    }

    .feature-card p {
      font-size: 13px;
      color: #64748b;
      line-height: 1.5;
      margin: 0;
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">
    
    <!-- Header SFT Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Safety Sense (TSS) Simulator</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      
      <!-- Hero Banner -->
      <div class="tss-hero-section">
        <h2 style="font-size: 18px; font-weight: 900; margin: 0 0 6px 0;"><i class="fa-solid fa-shield-halved" style="color:#ef4444;"></i> Simulator TSS 3.0</h2>
        <p style="font-size: 12px; color: #cbd5e1; margin: 0; line-height: 1.4;">Simulasi interaktif teknologi keselamatan aktif Toyota Safety Sense (TSS) untuk demonstrasi keunggulan fitur kepada konsumen.</p>
      </div>

      <!-- Feature Tabs -->
      <div class="tss-tabs-row">
        <button class="tss-tab-btn active" data-feature="pcs"><i class="fa-solid fa-shield-halved"></i> Pre-Collision</button>
        <button class="tss-tab-btn" data-feature="drcc"><i class="fa-solid fa-gauge-high"></i> Radar Cruise</button>
        <button class="tss-tab-btn" data-feature="lda"><i class="fa-solid fa-road"></i> Lane Departure</button>
        <button class="tss-tab-btn" data-feature="ahb"><i class="fa-solid fa-lightbulb"></i> Auto High Beam</button>
      </div>

      <!-- Canvas Simulator -->
      <div class="canvas-container">
        <div class="tss-hud-top">
          <div class="tss-hud-badge normal" id="tssStatusBadge">
            <i class="fa-solid fa-satellite-dish"></i>
            <span id="tssStatusText">Radar Siap</span>
          </div>
          <div class="speed-gauge" id="tssSpeedVal">60 km/j</div>
        </div>

        <canvas id="tssCanvas" width="800" height="320"></canvas>
      </div>

      <!-- Simulation Controls -->
      <div class="sim-controls">
        <button class="btn-sim start" id="btnStartSim"><i class="fa-solid fa-play"></i> Mulai Uji Fitur</button>
        <button class="btn-sim reset" id="btnResetSim"><i class="fa-solid fa-rotate-right"></i> Reset</button>
      </div>

      <!-- Explanation Card -->
      <div class="feature-card">
        <h3 id="tssFeatureTitle"><i class="fa-solid fa-shield-halved"></i> Pre-Collision System (PCS)</h3>
        <p id="tssFeatureDesc">Mendeteksi potensi tabrakan depan dengan radar milimeter-wave dan kamera monokuler. Sistem memberi peringatan audio-visual dan pengereman otomatis jika pengemudi tidak merespons.</p>
      </div>

    </div>

  </div>

  <script src="../js/tss-simulator.js"></script>
</body>
</html>
