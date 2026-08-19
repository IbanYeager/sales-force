<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Hybrid Energy Flow Master</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .hybrid-hero {
      background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 40%, #0f172a 100%);
      border-radius: 20px;
      padding: 20px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(56, 189, 248, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .hybrid-hero h2 {
      font-size: 20px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hybrid-hero p {
      font-size: 13px;
      color: #bae6fd;
      margin: 0;
    }

    /* Scenario Bar */
    .scenario-banner {
      background: #ffffff;
      border-radius: 16px;
      padding: 14px 18px;
      border: 1px solid #e2e8f0;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }

    .scenario-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .scenario-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: #e0f2fe;
      color: #0284c7;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .scenario-text h4 {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 2px 0;
    }

    .scenario-text p {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    /* Schematic Canvas */
    .schematic-wrap {
      position: relative;
      background: #090d16;
      border-radius: 20px;
      overflow: hidden;
      border: 2px solid #1e293b;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.3);
      margin-bottom: 16px;
    }

    canvas#hybridCanvas {
      display: block;
      width: 100%;
      height: 320px;
      background: #090d16;
    }

    /* Telemetry Grid */
    .telemetry-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .telemetry-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .telem-card {
      background: #ffffff;
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    .telem-card .lbl {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .telem-card .val {
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 4px;
    }

    /* Drive Mode Selector Buttons */
    .mode-btn-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    @media (max-width: 600px) {
      .mode-btn-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .mode-btn {
      padding: 14px 8px;
      border-radius: 14px;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 13px;
      border: 2px solid #e2e8f0;
      background: #ffffff;
      color: #0f172a;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.2s ease;
    }

    .mode-btn i {
      font-size: 16px;
    }

    .mode-btn.active.ev {
      background: #e0f2fe;
      border-color: #0284c7;
      color: #0369a1;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.25);
    }

    .mode-btn.active.eco {
      background: #dcfce7;
      border-color: #10b981;
      color: #15803d;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);
    }

    .mode-btn.active.power {
      background: #fee2e2;
      border-color: #ef4444;
      color: #b91c1c;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
    }

    .mode-btn.active.regen {
      background: #fef3c7;
      border-color: #f59e0b;
      color: #b45309;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.25);
    }

    /* Explanation Card */
    .edu-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 18px;
      border: 1px solid #e2e8f0;
      margin-bottom: 20px;
    }

    .edu-card h3 {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 6px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .edu-card p {
      font-size: 13px;
      color: #64748b;
      margin: 0;
      line-height: 1.5;
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="game.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Hybrid Energy Flow Manager</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Header -->
      <div class="hybrid-hero">
        <h2><i class="fa-solid fa-bolt" style="color:#38bdf8;"></i> Hybrid Synergy Drive Manager</h2>
        <p>Kelola aliran energi Mesin Bensin, Motor Listrik, dan Baterai Hybrid untuk meraih efisiensi BBM tertinggi
          (30+ km/L) melintasi berbagai kondisi jalan!</p>
      </div>

      <!-- Road Condition Scenario -->
      <div class="scenario-banner">
        <div class="scenario-info">
          <div class="scenario-icon" id="scenIcon"><i class="fa-solid fa-road"></i></div>
          <div class="scenario-text">
            <h4 id="scenTitle">Kondisi Jalan: Jalan Perkotaan (Macet Ringan)</h4>
            <p id="scenDesc">Kecepatan rendah 0–30 km/j. Rekomendasi: Gunakan EV Mode tenaga murni baterai.</p>
          </div>
        </div>
        <button class="btn-primary" onclick="nextScenario()"
          style="padding:8px 14px; border-radius:10px; background:#0284c7; color:white; font-weight:800; border:none; cursor:pointer; font-size:12px;">
          Ganti Rute <i class="fa-solid fa-forward"></i>
        </button>
      </div>

      <!-- Energy Flow Canvas -->
      <div class="schematic-wrap">
        <canvas id="hybridCanvas" width="800" height="320"></canvas>
      </div>

      <!-- Telemetry Data -->
      <div class="telemetry-grid">
        <div class="telem-card">
          <div class="lbl">Konsumsi BBM</div>
          <div class="val" id="dispKml" style="color:#10b981;">28.4 <span style="font-size:11px;">km/L</span></div>
        </div>
        <div class="telem-card">
          <div class="lbl">Baterai Hybrid</div>
          <div class="val" id="dispSoc" style="color:#0284c7;">78%</div>
        </div>
        <div class="telem-card">
          <div class="lbl">Daya Output</div>
          <div class="val" id="dispPower">186 <span style="font-size:11px;">PS</span></div>
        </div>
        <div class="telem-card">
          <div class="lbl">Reduksi Emisi CO2</div>
          <div class="val" id="dispCo2" style="color:#16a34a;">-52%</div>
        </div>
      </div>

      <!-- Drive Mode Selection -->
      <div class="mode-btn-grid">
        <button class="mode-btn active ev" id="btnEv" onclick="setDriveMode('EV')">
          <i class="fa-solid fa-bolt"></i>
          <span>EV MODE</span>
        </button>
        <button class="mode-btn eco" id="btnEco" onclick="setDriveMode('ECO')">
          <i class="fa-solid fa-leaf"></i>
          <span>ECO MODE</span>
        </button>
        <button class="mode-btn power" id="btnPower" onclick="setDriveMode('POWER')">
          <i class="fa-solid fa-fire"></i>
          <span>SPORT POWER</span>
        </button>
        <button class="mode-btn regen" id="btnRegen" onclick="setDriveMode('REGEN')">
          <i class="fa-solid fa-rotate-left"></i>
          <span>B-MODE REGEN</span>
        </button>
      </div>

      <!-- Educational Explanation -->
      <div class="edu-card">
        <h3 id="eduTitle"><i class="fa-solid fa-circle-info" style="color:#0284c7;"></i> Cara Kerja Hybrid Synergy Drive
          (HSD)</h3>
        <p id="eduDesc">Pada mode EV, motor listrik menggerakkan roda secara senyap tanpa setetes pun bensin. Saat
          membutuhkan akselerasi atau baterai mulai berkurang, mesin bensin Atkinson-Cycle akan menyala secara otomatis
          dan mulus.</p>
      </div>

    </div>

  </div>

  <script src="../js/hybrid_flow.js"></script>
</body>

</html>