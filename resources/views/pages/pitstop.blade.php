<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota GR Pit Stop Challenge</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .pit-hero {
      background: linear-gradient(135deg, #18181b 0%, #7f1d1d 50%, #0f172a 100%);
      border-radius: 20px;
      padding: 20px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(239, 68, 68, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .pit-hero h2 {
      font-size: 20px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pit-hero p {
      font-size: 13px;
      color: #fecaca;
      margin: 0;
    }

    /* Stopwatch Timer Display */
    .timer-banner {
      background: #090d16;
      border-radius: 20px;
      padding: 16px 20px;
      border: 2px solid #334155;
      text-align: center;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }

    .timer-label {
      font-size: 11px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .timer-digits {
      font-family: 'Orbitron', monospace;
      font-size: 38px;
      font-weight: 900;
      color: #fef08a;
      text-shadow: 0 0 16px rgba(254, 240, 138, 0.4);
      margin: 4px 0;
    }

    /* Stage Steps Indicator */
    .steps-indicator {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 20px;
    }

    .step-badge {
      padding: 8px 16px;
      border-radius: 30px;
      background: #f1f5f9;
      color: #64748b;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
      border: 1px solid #e2e8f0;
      transition: all 0.2s ease;
    }

    .step-badge.active {
      background: #ef4444;
      color: #ffffff;
      border-color: #ef4444;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }

    .step-badge.done {
      background: #10b981;
      color: #ffffff;
      border-color: #10b981;
    }

    /* Interactive Stage Arena */
    .stage-arena {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
      min-height: 280px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 20px;
    }

    /* Stage 1: Wheel Lug Nut Target Grid */
    .wheel-hub {
      width: 230px;
      height: 230px;
      border-radius: 50%;
      background: radial-gradient(circle at 40% 40%, #334155, #1e293b 50%, #0f172a);
      border: 6px solid #475569;
      position: relative;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), inset 0 2px 8px rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .wheel-hub::before {
      content: '';
      position: absolute;
      width: 190px;
      height: 190px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.06);
    }

    .hub-center {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #dc2626, #991b1b);
      border: 3px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 900;
      font-size: 14px;
      font-family: 'Orbitron', monospace;
      box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
      z-index: 2;
    }

    .lug-nut {
      position: absolute;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border: 3px solid #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
      font-weight: 900;
      font-size: 14px;
      font-family: 'Orbitron', monospace;
      box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);
      transition: all 0.15s ease;
      z-index: 3;
    }

    .lug-nut:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 20px rgba(245, 158, 11, 0.6);
    }

    .lug-nut:active {
      transform: scale(0.8);
    }

    .lug-nut.unscrewed {
      background: linear-gradient(135deg, #10b981, #059669);
      opacity: 0.25;
      pointer-events: none;
      box-shadow: none;
    }

    .lug-1 {
      top: 10px;
      left: 95px;
    }

    .lug-2 {
      top: 65px;
      right: 14px;
    }

    .lug-3 {
      bottom: 28px;
      right: 32px;
    }

    .lug-4 {
      bottom: 28px;
      left: 32px;
    }

    .lug-5 {
      top: 65px;
      left: 14px;
    }

    /* Stage 2: Fuel Hose Bar */
    .fuel-stage-wrap {
      width: 100%;
      max-width: 380px;
      text-align: center;
    }

    .fuel-gauge-bar {
      width: 100%;
      height: 40px;
      background: linear-gradient(180deg, #0c1629, #0f172a);
      border-radius: 20px;
      position: relative;
      overflow: hidden;
      border: 2px solid #334155;
      margin: 16px 0;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.5);
    }

    .fuel-fill-level {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #3b82f6 0%, #06b6d4 40%, #10b981 80%, #f59e0b 100%);
      transition: width 0.03s linear;
      border-radius: 20px;
    }

    .fuel-target-window {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 78%;
      width: 17%;
      background: rgba(16, 185, 129, 0.25);
      border-left: 2px solid #10b981;
      border-right: 2px solid #10b981;
    }

    .fuel-target-window::after {
      content: 'TARGET';
      position: absolute;
      top: -18px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 9px;
      font-weight: 800;
      color: #10b981;
      letter-spacing: 1px;
    }

    /* Pit Stop Result Modal */
    .pit-result-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 100;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      align-items: center;
      justify-content: center;
    }

    .pit-result-modal.show {
      display: flex;
    }

    .pit-result-card {
      background: #ffffff;
      border-radius: 24px;
      padding: 32px 28px;
      text-align: center;
      max-width: 380px;
      width: 90%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      animation: pitResultIn 0.4s ease;
    }

    @keyframes pitResultIn {
      from {
        transform: scale(0.8);
        opacity: 0;
      }

      to {
        transform: scale(1);
        opacity: 1;
      }
    }

    .pit-result-card .rank-icon {
      font-size: 48px;
      margin-bottom: 8px;
    }

    .pit-result-card .rank-title {
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      margin-bottom: 4px;
    }

    .pit-result-card .rank-time {
      font-family: 'Orbitron', monospace;
      font-size: 36px;
      font-weight: 900;
      margin: 12px 0;
    }

    .pit-result-card .rank-time.gold {
      color: #f59e0b;
    }

    .pit-result-card .rank-time.silver {
      color: #0284c7;
    }

    .pit-result-card .rank-time.bronze {
      color: #d97706;
    }

    /* Start / Reset Buttons */
    .btn-pit-start {
      width: 100%;
      padding: 16px;
      border-radius: 16px;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(239, 68, 68, 0.3);
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="game.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota GR Pit Stop Challenge</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Header -->
      <div class="pit-hero">
        <h2><i class="fa-solid fa-wrench" style="color:#ef4444;"></i> GR Pit Crew Time Attack</h2>
        <p>Jadilah kru pit stop Toyota Gazoo Racing! Lepas baut roda dengan pneumatic wrench, isi bensin presisi, dan
          bersihkan kaca secepat kilat!</p>
      </div>

      <!-- Timer Banner -->
      <div class="timer-banner">
        <div class="timer-label">WAKTU PIT STOP</div>
        <div class="timer-digits" id="dispPitTime">0.000 s</div>
      </div>

      <!-- Stage Step Badges -->
      <div class="steps-indicator">
        <div class="step-badge active" id="badgeStep1"><i class="fa-solid fa-compact-disc"></i> 1. Ganti Ban</div>
        <div class="step-badge" id="badgeStep2"><i class="fa-solid fa-gas-pump"></i> 2. Isi Bensin</div>
        <div class="step-badge" id="badgeStep3"><i class="fa-solid fa-wind"></i> 3. Aero Wing</div>
      </div>

      <!-- Dynamic Stage Arena -->
      <div class="stage-arena" id="stageArena">

        <!-- Stage 1 View: Lug Nut Hub -->
        <div id="viewStep1" style="text-align:center;">
          <h4 style="margin:0 0 12px 0; color:#0f172a; font-weight:800;">Tap 5 Baut Roda Bergantian Secepat Mungkin!
          </h4>
          <div class="wheel-hub">
            <div class="hub-center">GR</div>
            <button class="lug-nut lug-1" onclick="unscrewLug(1)">1</button>
            <button class="lug-nut lug-2" onclick="unscrewLug(2)">2</button>
            <button class="lug-nut lug-3" onclick="unscrewLug(3)">3</button>
            <button class="lug-nut lug-4" onclick="unscrewLug(4)">4</button>
            <button class="lug-nut lug-5" onclick="unscrewLug(5)">5</button>
          </div>
        </div>

        <!-- Stage 2 View: Refueling (Hidden Initially) -->
        <div id="viewStep2" class="fuel-stage-wrap" style="display:none;">
          <h4 style="margin:0 0 6px 0; color:#0f172a; font-weight:800;">Tahan &amp; Lepas Tuas di Garis Hijau!</h4>
          <p style="font-size:12px; color:#64748b; margin:0;">Isi tangki tepat di zona 85% - 95%</p>
          <div class="fuel-gauge-bar">
            <div class="fuel-fill-level" id="fuelFill"></div>
            <div class="fuel-target-window"></div>
          </div>
          <button class="btn-primary" id="btnFuelLever" onpointerdown="startFueling()" onpointerup="stopFueling()"
            onmousedown="startFueling()" onmouseup="stopFueling()" ontouchstart="startFueling()"
            ontouchend="stopFueling()"
            style="padding:14px 28px; border-radius:14px; background:#10b981; border:none; color:white; font-weight:800; cursor:pointer;">
            <i class="fa-solid fa-gas-pump"></i> TAHAN TUAS BENSIN
          </button>
        </div>

        <!-- Stage 3 View: Aero Wing Adjust (Hidden Initially) -->
        <div id="viewStep3" style="display:none; text-align:center;">
          <h4 style="margin:0 0 12px 0; color:#0f172a; font-weight:800;">Setel Sudut Sayap Belakang (Aero Wing)!</h4>
          <p style="font-size:12px; color:#64748b; margin:0 0 16px 0;">Tap tombol `LOCK WING` saat sudut berada di 15°
            (Optimal Downforce)</p>
          <div
            style="font-family:'Orbitron', monospace; font-size:32px; font-weight:900; color:#0284c7; margin-bottom:16px;"
            id="dispWingAngle">12°</div>
          <button class="btn-primary" onclick="lockWingAngle()"
            style="padding:12px 28px; border-radius:14px; background:#0284c7; border:none; color:white; font-weight:800; cursor:pointer;">
            <i class="fa-solid fa-lock"></i> KUNCI SAYAP (LOCK)
          </button>
        </div>

      </div>

      <!-- Action Button -->
      <button class="btn-pit-start" id="btnStartPit" onclick="startPitChallenge()">
        <i class="fa-solid fa-play"></i> MULAI PIT STOP RUN
      </button>

    </div>

    <!-- Result Modal -->
    <div class="pit-result-modal" id="pitResultModal">
      <div class="pit-result-card">
        <div class="rank-icon" id="pitRankIcon">🏆</div>
        <div class="rank-title" id="pitRankTitle">WORLD CLASS PIT CREW!</div>
        <div class="rank-time gold" id="pitRankTime">3.245 s</div>
        <p style="font-size:13px; color:#64748b; margin:0 0 20px 0;" id="pitRankDesc">Waktu pit stop luar biasa cepat!
        </p>
        <button onclick="closePitResult()"
          style="padding:12px 28px; border-radius:14px; background:linear-gradient(135deg, #ef4444, #dc2626); color:white; font-weight:800; border:none; cursor:pointer; font-size:14px;">
          <i class="fa-solid fa-rotate-right"></i> COBA LAGI
        </button>
      </div>
    </div>

  </div>

  <script src="../js/pitstop.js"></script>
</body>

</html>