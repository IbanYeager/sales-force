<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Arcade Center (11 Mini Games)</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .game-hero {
      background: #ffffff;
      color: #0f172a;
      padding: 24px;
      border-radius: 20px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .game-hero::before {
      content: '';
      position: absolute;
      top: -30px;
      right: -30px;
      width: 160px;
      height: 160px;
      background: radial-gradient(circle, rgba(239, 68, 68, 0.12) 0%, transparent 70%);
      border-radius: 50%;
    }

    .game-hero h2 {
      font-size: 22px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #0f172a;
    }

    .game-hero p {
      margin: 0;
      font-size: 13px;
      color: #64748b;
      line-height: 1.4;
    }

    .game-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 992px) {
      .game-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .game-grid {
        grid-template-columns: 1fr;
      }
    }

    .game-card {
      background: #ffffff;
      border-radius: 18px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: all 0.2s ease;
      text-decoration: none;
      color: inherit;
      position: relative;
      overflow: hidden;
    }

    .game-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
      border-color: var(--primary-red, #CC0000);
    }

    .game-card:active {
      transform: scale(0.98);
    }

    .game-badge {
      position: absolute;
      top: 14px;
      right: 14px;
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .game-badge.multi {
      background: #dbeafe;
      color: #1e3a8a;
    }

    .game-badge.arcade {
      background: #fef3c7;
      color: #b45309;
    }

    .game-badge.quiz {
      background: #dcfce7;
      color: #15803d;
    }

    .game-badge.puzzle {
      background: #f3e8ff;
      color: #6b21a8;
    }

    .game-badge.sim {
      background: #fee2e2;
      color: #991b1b;
    }

    .game-badge.new {
      background: #ffedd5;
      color: #c2410c;
    }

    .game-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      margin-bottom: 14px;
    }

    .game-icon.drag {
      background: linear-gradient(135deg, #1e1b4b, #4338ca);
      color: #ffffff;
    }

    .game-icon.valet {
      background: linear-gradient(135deg, #065f46, #059669);
      color: #ffffff;
    }

    .game-icon.hybrid {
      background: linear-gradient(135deg, #0284c7, #0369a1);
      color: #ffffff;
    }

    .game-icon.pit {
      background: linear-gradient(135deg, #b91c1c, #991b1b);
      color: #ffffff;
    }

    .game-icon.memory {
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      color: #ffffff;
    }

    .game-icon.catur {
      background: linear-gradient(135deg, #1e293b, #334155);
      color: #f8fafc;
    }

    .game-icon.balap {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      color: #ffffff;
    }

    .game-icon.tebak {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #ffffff;
    }

    .game-icon.tts {
      background: linear-gradient(135deg, #8b5cf6, #6d28d9);
      color: #ffffff;
    }

    .game-icon.snake {
      background: linear-gradient(135deg, #10b981, #059669);
      color: #ffffff;
    }

    .game-icon.tss {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: #ffffff;
    }

    .game-title {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .game-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
      margin: 0 0 16px 0;
    }

    .game-btn {
      margin-top: auto;
      padding: 10px 14px;
      border-radius: 10px;
      background: #f8fafc;
      color: var(--primary-red, #CC0000);
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #e2e8f0;
      transition: all 0.2s;
    }

    .game-card:hover .game-btn {
      background: var(--primary-red, #CC0000);
      color: white;
      border-color: var(--primary-red, #CC0000);
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Arcade Center</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Banner -->
      <div class="game-hero">
        <h2>🎮 Koleksi 11 Mini Game Otomotif Toyota</h2>
        <p>Koleksi game balap, simulasi teknologi, strategi, dan teka-teki interaktif untuk refreshment sales &amp;
          interaksi dengan customer di showroom.</p>
      </div>

      <!-- Game Cards Grid -->
      <div class="game-grid">

        <!-- 1. Toyota Drag Strip -->
        <a href="drag_race.html" class="game-card">
          <span class="game-badge new">GR Race</span>
          <div class="game-icon drag">
            <i class="fa-solid fa-gauge-high"></i>
          </div>
          <h3 class="game-title">Toyota Drag Strip</h3>
          <p class="game-desc">Balap drag 402m! Kuasai launch control, perfect gear shift, dan nitrous boost!</p>
          <div class="game-btn">
            <span>Main Drag Race</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 2. Precision Valet Parking -->
        <a href="valet_park.html" class="game-card">
          <span class="game-badge new">Sensors 2D</span>
          <div class="game-icon valet">
            <i class="fa-solid fa-square-parking"></i>
          </div>
          <h3 class="game-title">Valet Parking VIP</h3>
          <p class="game-desc">Tantangan parkir showroom presisi dengan sensor jarak audio radar &amp; kamera mundur!
          </p>
          <div class="game-btn">
            <span>Mulai Parkir</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 3. Hybrid Energy Flow -->
        <a href="hybrid_flow.html" class="game-card">
          <span class="game-badge new">Simulasi HEV</span>
          <div class="game-icon hybrid">
            <i class="fa-solid fa-bolt"></i>
          </div>
          <h3 class="game-title">Hybrid Energy Flow</h3>
          <p class="game-desc">Kelola aliran energi bensin, baterai, dan regenerasi listrik untuk efisiensi BBM 30+
            km/L!</p>
          <div class="game-btn">
            <span>Simulasi Hybrid</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 4. GR Pit Stop Challenge -->
        <a href="pitstop.html" class="game-card">
          <span class="game-badge new">Time Attack</span>
          <div class="game-icon pit">
            <i class="fa-solid fa-wrench"></i>
          </div>
          <h3 class="game-title">GR Pit Stop Challenge</h3>
          <p class="game-desc">Lepas baut ban pneumatic, isi bensin presisi, dan setel aero wing secepat kilat!</p>
          <div class="game-btn">
            <span>Mulai Pit Stop</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 5. Toyota Memory Match -->
        <a href="memory_match.html" class="game-card">
          <span class="game-badge new">3D Card Flip</span>
          <div class="game-icon memory">
            <i class="fa-solid fa-clone"></i>
          </div>
          <h3 class="game-title">Toyota Memory Match</h3>
          <p class="game-desc">Buka kartu 3D dan pasangkan model mobil Toyota dengan fitur teknologi andalannya!</p>
          <div class="game-btn">
            <span>Main Kartu</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 6. Catur Master -->
        <a href="catur.html" class="game-card">
          <span class="game-badge multi">Online &amp; AI</span>
          <div class="game-icon catur">
            <i class="fa-solid fa-chess"></i>
          </div>
          <h3 class="game-title">Catur Master</h3>
          <p class="game-desc">Main catur lawan AI pintar atau tantang sesama rekan sales secara online!</p>
          <div class="game-btn">
            <span>Main Catur</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 7. Balap Mobil -->
        <a href="balap.html" class="game-card">
          <span class="game-badge arcade">Arcade 2D</span>
          <div class="game-icon balap">
            <i class="fa-solid fa-flag-checkered"></i>
          </div>
          <h3 class="game-title">Toyota GR Racing</h3>
          <p class="game-desc">Pacu mobil GR di lintasan 2D endless runner, hindari rintangan, dan cetak rekor skor!</p>
          <div class="game-btn">
            <span>Mulai Balap</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 8. Parkir Drift (Snake) -->
        <a href="snake.html" class="game-card">
          <span class="game-badge arcade" style="background:#dcfce7; color:#15803d;">Drift Smoke</span>
          <div class="game-icon snake">
            <i class="fa-solid fa-gas-pump"></i>
          </div>
          <h3 class="game-title">Parkir Drift &amp; Fuel Rush</h3>
          <p class="game-desc">Kendalikan mobil mengambil jerigen bensin dengan efek kepulan asap drift tebal!</p>
          <div class="game-btn">
            <span>Main Drift Snake</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 9. Tebak Otomotif -->
        <a href="tebak.html" class="game-card">
          <span class="game-badge quiz">20 Level</span>
          <div class="game-icon tebak">
            <i class="fa-solid fa-brain"></i>
          </div>
          <h3 class="game-title">Tebak Otomotif</h3>
          <p class="game-desc">Uji pengetahuan seputar model mobil Toyota, mesin, dan teknologi Hybrid!</p>
          <div class="game-btn">
            <span>Mulai Kuis</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 10. TTS Toyota -->
        <a href="tts.html" class="game-card">
          <span class="game-badge puzzle">Teka-Teki</span>
          <div class="game-icon tts">
            <i class="fa-solid fa-puzzle-piece"></i>
          </div>
          <h3 class="game-title">TTS Otomotif</h3>
          <p class="game-desc">Teka-Teki Silang interaktif kategori model mobil Toyota &amp; wawasan otomotif!</p>
          <div class="game-btn">
            <span>Isi TTS</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

        <!-- 11. Simulator TSS -->
        <a href="tss-simulator.html" class="game-card">
          <span class="game-badge sim">Simulasi 2D</span>
          <div class="game-icon tss">
            <i class="fa-solid fa-shield-halved"></i>
          </div>
          <h3 class="game-title">Simulator TSS 3.0</h3>
          <p class="game-desc">Simulasi radar Pre-Collision System, Radar Cruise Control, dan Lane Departure!</p>
          <div class="game-btn">
            <span>Uji TSS</span>
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        </a>

      </div>

    </div>

  </div>
</body>

</html>