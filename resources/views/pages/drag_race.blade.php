<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Drag Strip: Perfect Shift</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .drag-hero {
      background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0f172a 100%);
      border-radius: 20px;
      padding: 20px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(239, 68, 68, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .drag-hero h2 {
      font-size: 20px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .drag-hero p {
      font-size: 13px;
      color: #cbd5e1;
      margin: 0;
    }

    .car-select-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .car-select-row {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .car-btn {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 10px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .car-btn.active {
      border-color: #ef4444;
      background: #fef2f2;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
    }

    .car-btn .name {
      font-size: 13px;
      font-weight: 800;
      color: #0f172a;
    }

    .car-btn .hp {
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
    }

    .car-btn.active .name {
      color: #dc2626;
    }

    .drag-stage-wrap {
      position: relative;
      background: #090d16;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #334155;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
      margin-bottom: 16px;
      width: 100%;
      aspect-ratio: 16 / 9;
      max-height: 380px;
    }

    canvas#dragCanvas {
      display: block;
      width: 100%;
      height: 100%;
      background: #090d16;
    }

    /* Christmas tree lights overlay */
    .tree-lights {
      position: absolute;
      top: 14px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      background: rgba(15, 23, 42, 0.9);
      padding: 6px 14px;
      border-radius: 30px;
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      z-index: 10;
    }

    .light-bulb {
      width: 14px;
      height: 14px;
      border-radius: 50%;
      background: #334155;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
      transition: all 0.15s ease;
    }

    .light-bulb.amber.on {
      background: #f59e0b;
      box-shadow: 0 0 12px #f59e0b, 0 0 20px #f59e0b;
    }

    .light-bulb.green.on {
      background: #10b981;
      box-shadow: 0 0 14px #10b981, 0 0 24px #10b981;
    }

    .light-bulb.red.on {
      background: #ef4444;
      box-shadow: 0 0 14px #ef4444, 0 0 24px #ef4444;
    }

    /* Feedback message banner */
    .shift-feedback {
      position: absolute;
      top: 55px;
      left: 50%;
      transform: translateX(-50%);
      font-family: 'Orbitron', monospace;
      font-size: 16px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 2px 8px rgba(0, 0, 0, 0.8);
      pointer-events: none;
      z-index: 10;
      opacity: 0;
      transition: opacity 0.2s, transform 0.2s;
    }

    .shift-feedback.show {
      opacity: 1;
      transform: translateX(-50%) scale(1.1);
    }

    .shift-feedback.perfect {
      color: #34d399;
    }

    .shift-feedback.good {
      color: #60a5fa;
    }

    .shift-feedback.late {
      color: #f87171;
    }

    .shift-feedback.early {
      color: #fbbf24;
    }

    /* Dashboard Instrument Cluster */
    .cluster-box {
      background: #ffffff;
      border-radius: 20px;
      padding: 18px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      margin-bottom: 20px;
    }

    .cluster-top {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
      text-align: center;
    }

    .metric-card {
      background: #f8fafc;
      padding: 10px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
    }

    .metric-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .metric-value {
      font-family: 'Orbitron', monospace;
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }

    .metric-value.red {
      color: #dc2626;
    }

    .metric-value.green {
      color: #16a34a;
    }

    /* RPM Bar & Shift Light */
    .rpm-container {
      margin-bottom: 16px;
    }

    .rpm-bar-wrap {
      width: 100%;
      height: 22px;
      background: #0f172a;
      border-radius: 11px;
      overflow: hidden;
      position: relative;
      border: 2px solid #334155;
    }

    .rpm-bar-fill {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #3b82f6 0%, #10b981 60%, #f59e0b 80%, #ef4444 100%);
      transition: width 0.05s linear;
    }

    .rpm-target-zone {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 78%;
      width: 12%;
      background: rgba(16, 185, 129, 0.4);
      border-left: 2px dashed #10b981;
      border-right: 2px dashed #10b981;
      pointer-events: none;
    }

    .rpm-labels {
      display: flex;
      justify-content: space-between;
      font-family: 'Orbitron', monospace;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      margin-top: 4px;
    }

    /* Drag Controls Grid */
    .drag-controls-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
    }

    .ctrl-btn {
      padding: 16px 12px;
      border-radius: 16px;
      font-weight: 900;
      font-size: 15px;
      font-family: 'Orbitron', monospace;
      border: none;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.15s ease;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      -webkit-touch-callout: none;
    }

    .ctrl-btn:active {
      transform: scale(0.95);
    }

    .btn-shift {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35);
    }

    .btn-nos {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.35);
    }

    .btn-nos:disabled {
      background: #94a3b8;
      box-shadow: none;
      cursor: not-allowed;
      opacity: 0.6;
    }

    .btn-gas {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35);
    }

    /* Result Modal / Overlay */
    .result-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      margin-top: 20px;
      text-align: center;
      display: none;
    }

    .result-card.show {
      display: block;
    }

    .result-title {
      font-size: 20px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 12px;
    }

    .result-stats-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    .result-stat-item {
      background: #f8fafc;
      padding: 10px;
      border-radius: 12px;
    }

    .result-stat-item .lbl {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
    }

    .result-stat-item .val {
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 4px;
    }

    /* Mobile Responsive Optimizations */
    @media (max-width: 768px) {
      .drag-hero {
        padding: 16px;
        border-radius: 16px;
        margin-bottom: 14px;
      }

      .drag-hero h2 {
        font-size: 17px;
      }

      .drag-hero p {
        font-size: 11.5px;
        line-height: 1.4;
      }

      .car-select-row {
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }

      .car-btn {
        padding: 8px 6px;
        border-radius: 12px;
      }

      .car-btn .name {
        font-size: 11.5px;
      }

      .car-btn .hp {
        font-size: 10px;
      }

      .drag-stage-wrap {
        border-radius: 16px;
        aspect-ratio: 16 / 9.5;
        margin-bottom: 12px;
        max-height: 240px;
      }

      .tree-lights {
        top: 8px;
        gap: 5px;
        padding: 4px 10px;
      }

      .light-bulb {
        width: 10px;
        height: 10px;
      }

      .shift-feedback {
        top: 36px;
        font-size: 13px;
      }

      .cluster-box {
        padding: 12px 10px;
        border-radius: 16px;
        margin-bottom: 14px;
      }

      .cluster-top {
        gap: 6px;
        margin-bottom: 12px;
      }

      .metric-card {
        padding: 6px 4px;
        border-radius: 10px;
      }

      .metric-label {
        font-size: 9.5px;
      }

      .metric-value {
        font-size: 16px;
      }

      .rpm-container {
        margin-bottom: 12px;
      }

      .rpm-bar-wrap {
        height: 16px;
        border-radius: 8px;
      }

      .rpm-labels {
        font-size: 9px;
        margin-top: 3px;
      }

      .drag-controls-grid {
        gap: 8px;
      }

      .ctrl-btn {
        padding: 12px 6px;
        font-size: 12px;
        border-radius: 12px;
      }

      .result-title {
        font-size: 17px;
      }

      .result-stat-item .val {
        font-size: 15px;
      }
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="game.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Drag Strip: Perfect Shift</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Section -->
      <div class="drag-hero">
        <h2><i class="fa-solid fa-gauge-high" style="color:#ef4444;"></i> Toyota GR Drag Strip</h2>
        <p>Kendalikan RPM saat start, tekan Shift Up tepat di zona hijau (Perfect Shift), dan aktifkan Nitrous Boost
          untuk mencetak waktu tempuh 402m tercepat!</p>
      </div>

      <!-- Car Selection -->
      <div class="car-select-row">
        <button class="car-btn active" onclick="selectCar('supra')">
          <span class="name">GR Supra 3.0L</span>
          <span class="hp">382 HP • RWD</span>
        </button>
        <button class="car-btn" onclick="selectCar('yaris')">
          <span class="name">GR Yaris 1.6T</span>
          <span class="hp">261 HP • GR-FOUR</span>
        </button>
        <button class="car-btn" onclick="selectCar('gr86')">
          <span class="name">GR 86 2.4L</span>
          <span class="hp">228 HP • RWD</span>
        </button>
        <button class="car-btn" onclick="selectCar('fortuner')">
          <span class="name">Fortuner 2.8 GR</span>
          <span class="hp">204 HP • 4x4</span>
        </button>
      </div>

      <!-- Drag Stage Canvas Container -->
      <div class="drag-stage-wrap">
        <!-- Christmas Tree Start Lights -->
        <div class="tree-lights">
          <div class="light-bulb red" id="lightRed"></div>
          <div class="light-bulb amber" id="lightA1"></div>
          <div class="light-bulb amber" id="lightA2"></div>
          <div class="light-bulb amber" id="lightA3"></div>
          <div class="light-bulb green" id="lightGreen"></div>
        </div>

        <!-- Shift Feedback Text -->
        <div class="shift-feedback" id="shiftFeedback">PERFECT SHIFT!</div>

        <!-- Canvas -->
        <canvas id="dragCanvas"></canvas>
      </div>

      <!-- Dashboard Cluster & Telemetry -->
      <div class="cluster-box">
        <div class="cluster-top">
          <div class="metric-card">
            <div class="metric-label">Kecepatan</div>
            <div class="metric-value" id="dispSpeed">0 <span style="font-size:12px;">KM/J</span></div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Gigi Transmisi</div>
            <div class="metric-value red" id="dispGear">N</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Jarak Tempuh</div>
            <div class="metric-value green" id="dispDist">0 <span style="font-size:12px;">M</span></div>
          </div>
        </div>

        <!-- RPM Tachometer Bar -->
        <div class="rpm-container">
          <div class="rpm-bar-wrap">
            <div class="rpm-bar-fill" id="rpmBarFill"></div>
            <div class="rpm-target-zone" title="Zona Perfect Shift (6.200 - 7.200 RPM)"></div>
          </div>
          <div class="rpm-labels">
            <span>0</span>
            <span>2000</span>
            <span>4000</span>
            <span style="color:#10b981;">6500 (SHIFT)</span>
            <span style="color:#ef4444;">8000 RPM</span>
          </div>
        </div>

        <!-- Game Controls -->
        <div class="drag-controls-grid">
          <button class="ctrl-btn btn-nos" id="btnNos" onclick="triggerNos()" onpointerdown="triggerNos()" disabled>
            <i class="fa-solid fa-bolt"></i>
            <span>NOS (BOOST)</span>
          </button>
          <button class="ctrl-btn btn-shift" id="btnShift" onclick="shiftUp()" onpointerdown="shiftUp()">
            <i class="fa-solid fa-angles-up"></i>
            <span>SHIFT UP</span>
          </button>
          <button class="ctrl-btn btn-gas" id="btnGas" onpointerdown="pressGas()" onpointerup="releaseGas()"
            onmousedown="pressGas()" onmouseup="releaseGas()" ontouchstart="pressGas()" ontouchend="releaseGas()">
            <i class="fa-solid fa-fire-flame-curved"></i>
            <span id="gasLabel">GAS PEDAL</span>
          </button>
        </div>

      </div>

      <!-- Result Card -->
      <div class="result-card" id="resultCard">
        <div class="result-title" id="resultTitle">🏁 Run Selesai!</div>
        <div class="result-stats-grid">
          <div class="result-stat-item">
            <div class="lbl">Waktu 402m</div>
            <div class="val" id="resQuarterTime">11.42 s</div>
          </div>
          <div class="result-stat-item">
            <div class="lbl">0 - 100 KM/J</div>
            <div class="val" id="resZeroHundred">4.18 s</div>
          </div>
          <div class="result-stat-item">
            <div class="lbl">Top Speed</div>
            <div class="val" id="resTopSpeed">234 KM/J</div>
          </div>
        </div>
        <button class="btn-primary" onclick="resetDragRace()"
          style="padding: 12px 24px; border-radius: 12px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; font-weight: 800; cursor: pointer;">
          <i class="fa-solid fa-rotate-right"></i> Balap Lagi
        </button>
      </div>

    </div>

  </div>

  <script src="../js/drag_race.js"></script>
</body>

</html>