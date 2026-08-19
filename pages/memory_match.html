<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Memory Match: Model & Fitur</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap"
    rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .match-hero {
      background: linear-gradient(135deg, #312e81 0%, #4338ca 50%, #0f172a 100%);
      border-radius: 20px;
      padding: 20px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
      border: 1px solid rgba(129, 140, 248, 0.3);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
    }

    .match-hero h2 {
      font-size: 20px;
      font-weight: 900;
      margin: 0 0 6px 0;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .match-hero p {
      font-size: 13px;
      color: #c7d2fe;
      margin: 0;
    }

    /* Top HUD Stats */
    .match-hud {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }

    @media (max-width: 600px) {
      .match-hud {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .mhud-card {
      background: #ffffff;
      padding: 10px 12px;
      border-radius: 14px;
      border: 1px solid #e2e8f0;
      text-align: center;
    }

    .mhud-card .lbl {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .mhud-card .val {
      font-family: 'Orbitron', monospace;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      margin-top: 2px;
    }

    /* Cards Grid (4 Columns) */
    .cards-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      perspective: 1000px;
      margin-bottom: 20px;
    }

    @media (max-width: 600px) {
      .cards-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
      }
    }

    /* 3D Flip Card */
    .card-item {
      aspect-ratio: 3 / 4;
      position: relative;
      transform-style: preserve-3d;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
      user-select: none;
    }

    .card-item.flipped {
      transform: rotateY(180deg);
    }

    .card-item.matched {
      transform: rotateY(180deg) scale(0.95);
      cursor: default;
    }

    .card-front,
    .card-back {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
    }

    /* Card Back (Hidden Cover) */
    .card-back {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 2px solid #334155;
      color: #ef4444;
      font-size: 24px;
    }

    .card-back::after {
      content: 'GR';
      font-family: 'Orbitron', monospace;
      font-size: 20px;
      font-weight: 900;
      color: #ef4444;
      letter-spacing: 1px;
    }

    /* Card Front (Revealed Content) */
    .card-front {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      transform: rotateY(180deg);
      text-align: center;
    }

    .card-item.matched .card-front {
      border-color: #10b981;
      background: #f0fdf4;
    }

    .card-front .icon {
      font-size: 24px;
      margin-bottom: 6px;
    }

    .card-front .title {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
    }

    .card-front .badge-type {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 20px;
      margin-top: 4px;
    }

    .badge-type.model {
      background: #dbeafe;
      color: #1e40af;
    }

    .badge-type.feature {
      background: #fef3c7;
      color: #b45309;
    }

    /* Match Success Modal */
    .match-modal {
      background: #ffffff;
      border-radius: 20px;
      padding: 24px;
      border: 1px solid #e2e8f0;
      text-align: center;
      display: none;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
    }

    .match-modal.show {
      display: block;
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Executive Top Navbar Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="game.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Memory Match: Model &amp; Fitur</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Header -->
      <div class="match-hero">
        <h2><i class="fa-solid fa-clone" style="color:#818cf8;"></i> Toyota Memory Match</h2>
        <p>Buka kartu dan pasangkan model mobil Toyota dengan fitur teknologi unggulannya dalam waktu dan langkah paling
          efisien!</p>
      </div>

      <!-- HUD Stats -->
      <div class="match-hud">
        <div class="mhud-card">
          <div class="lbl">Pasangan Ditemukan</div>
          <div class="val" id="dispPairs" style="color:#10b981;">0 / 8</div>
        </div>
        <div class="mhud-card">
          <div class="lbl">Langkah (Moves)</div>
          <div class="val" id="dispMoves">0</div>
        </div>
        <div class="mhud-card">
          <div class="lbl">Waktu</div>
          <div class="val" id="dispTimer">00:00</div>
        </div>
        <div class="mhud-card">
          <div class="lbl">Combo Streak</div>
          <div class="val" id="dispStreak" style="color:#ef4444;">0x</div>
        </div>
      </div>

      <!-- 3D Cards Grid -->
      <div class="cards-grid" id="cardsGrid">
        <!-- Rendered by JS -->
      </div>

      <!-- Result Modal -->
      <div class="match-modal" id="matchModal">
        <h3 style="font-size:22px; font-weight:900; color:#0f172a; margin:0 0 8px 0;">🎉 LUAR BIASA!</h3>
        <p style="font-size:13px; color:#64748b; margin:0 0 16px 0;" id="modalSummary">Seluruh pasangan fitur Toyota
          berhasil dicocokkan dengan sempurna!</p>
        <button class="btn-primary" onclick="initMemoryGame()"
          style="padding:12px 24px; border-radius:12px; background:linear-gradient(135deg, #4338ca, #3730a3); color:white; border:none; font-weight:800; cursor:pointer;">
          <i class="fa-solid fa-rotate-right"></i> Main Lagi
        </button>
      </div>

    </div>

  </div>

  <script src="../js/memory_match.js"></script>
</body>

</html>