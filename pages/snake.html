<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Parking Fuel Rush</title>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .snake-hero {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(15, 23, 42, 0.05) 100%);
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      padding: 16px 20px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .snake-hero-txt h2 {
      font-family: 'Orbitron', 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 900;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .snake-hero-txt p {
      font-size: 12px;
      color: #64748b;
      margin: 0;
    }

    .snake-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      padding: 12px 18px;
      border-radius: 16px;
      margin-bottom: 14px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    }

    .hud-box {
      display: flex;
      flex-direction: column;
    }

    .hud-label {
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #64748b;
    }

    .hud-val {
      font-family: 'Orbitron', monospace;
      font-size: 20px;
      font-weight: 900;
      color: var(--primary-red, #CC0000);
    }

    .hud-val.green {
      color: #10b981;
    }

    .canvas-wrap {
      position: relative;
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      background: #0f172a;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      border: 2px solid #e2e8f0;
      touch-action: none;
    }

    canvas {
      display: block;
      width: 100%;
      height: auto;
      background: #1e293b;
    }

    /* Game Over & Start Overlay */
    .game-overlay {
      position: absolute;
      inset: 0;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(8px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      text-align: center;
      z-index: 10;
      transition: opacity 0.3s ease;
    }

    .game-overlay.hidden {
      display: none !important;
    }

    .overlay-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.15);
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28px;
      margin-bottom: 12px;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .overlay-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 6px;
    }

    .overlay-desc {
      font-size: 13px;
      color: #94a3b8;
      max-width: 320px;
      margin-bottom: 18px;
      line-height: 1.4;
    }

    .btn-start-game {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      color: #ffffff;
      padding: 12px 28px;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .btn-start-game:hover {
      transform: translateY(-2px) scale(1.03);
      box-shadow: 0 12px 28px rgba(239, 68, 68, 0.55);
    }

    /* On-Screen Mobile D-Pad */
    .dpad-container {
      display: grid;
      grid-template-columns: repeat(3, 56px);
      grid-template-rows: repeat(3, 56px);
      gap: 8px;
      justify-content: center;
      margin: 18px auto 10px auto;
    }

    .dpad-btn {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      color: #0f172a;
      font-size: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      user-select: none;
      -webkit-user-select: none;
      transition: background 0.15s ease, transform 0.15s ease;
    }

    .dpad-btn:active {
      background: var(--primary-red, #CC0000);
      color: #ffffff;
      transform: scale(0.92);
    }

    .dpad-btn.up { grid-column: 2; grid-row: 1; }
    .dpad-btn.left { grid-column: 1; grid-row: 2; }
    .dpad-btn.down { grid-column: 2; grid-row: 3; }
    .dpad-btn.right { grid-column: 3; grid-row: 2; }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;">

    <!-- Header SFT Upgraded by sidebar_desktop.js -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Parking Fuel Rush</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">

      <!-- Hero Header -->
      <div class="snake-hero">
        <div class="snake-hero-txt">
          <h2>🚗 Parkir Drift &amp; Fuel Rush</h2>
          <p>Kendalikan mobil Toyota di area parkir, kumpulkan jerigen bensin, dan buat kepulan asap drift terpanjang!</p>
        </div>
        <div
          style="font-size:28px; color:var(--primary-red, #CC0000); width:48px; height:48px; border-radius:14px; background:rgba(239,68,68,0.12); display:flex; align-items:center; justify-content:center; flex-shrink:0;">
          <i class="fa-solid fa-gas-pump"></i>
        </div>
      </div>

      <!-- HUD Stats -->
      <div class="snake-hud">
        <div class="hud-box">
          <span class="hud-label">Skor Bensin</span>
          <span class="hud-val" id="snakeScore">000</span>
        </div>
        <div class="hud-box" style="text-align:center;">
          <span class="hud-label">Jerigen Didapat</span>
          <span class="hud-val green" id="snakeFuelCount">0</span>
        </div>
        <div class="hud-box" style="text-align:right;">
          <span class="hud-label">Rekor Terbaik</span>
          <span class="hud-val" id="snakeHighScore">000</span>
        </div>
      </div>

      <!-- Canvas Wrap -->
      <div class="canvas-wrap" id="canvasWrap">

        <!-- Start Overlay -->
        <div class="game-overlay" id="startOverlay">
          <div class="overlay-icon"><i class="fa-solid fa-car-side"></i></div>
          <div class="overlay-title">FUEL RUSH &amp; DRIFT</div>
          <div class="overlay-desc">Kendalikan mobil Toyota mengambil jerigen bensin di parkiran. Hindari pembatas dan gumpalan asap drift mobil Anda sendiri!</div>
          <button class="btn-start-game" onclick="startSnakeGame()">
            <i class="fa-solid fa-play"></i> Mulai Parkir Drift
          </button>
        </div>

        <!-- Game Over Overlay -->
        <div class="game-overlay hidden" id="gameOverOverlay">
          <div class="overlay-icon" style="background:rgba(239,68,68,0.2); color:#ef4444;"><i
              class="fa-solid fa-explosion"></i></div>
          <div class="overlay-title">GAME OVER</div>
          <div style="font-size:14px; color:#e2e8f0; margin-bottom:12px;">Skor Akhir: <strong id="finalScoreVal"
              style="color:#ef4444; font-size:20px;">0</strong> Jerigen</div>
          <div class="overlay-desc" id="gameOverReason">Mobil menabrak pembatas parkir!</div>
          <button class="btn-start-game" onclick="startSnakeGame()">
            <i class="fa-solid fa-rotate-right"></i> Main Lagi
          </button>
        </div>

        <canvas id="snakeCanvas" width="600" height="600"></canvas>
      </div>

      <!-- Mobile & Desktop On-Screen D-Pad Controls -->
      <div class="dpad-container">
        <button class="dpad-btn up" onclick="handleDpadInput('UP')" onpointerdown="handleDpadInput('UP')"><i class="fa-solid fa-chevron-up"></i></button>
        <button class="dpad-btn left" onclick="handleDpadInput('LEFT')" onpointerdown="handleDpadInput('LEFT')"><i class="fa-solid fa-chevron-left"></i></button>
        <button class="dpad-btn down" onclick="handleDpadInput('DOWN')" onpointerdown="handleDpadInput('DOWN')"><i class="fa-solid fa-chevron-down"></i></button>
        <button class="dpad-btn right" onclick="handleDpadInput('RIGHT')" onpointerdown="handleDpadInput('RIGHT')"><i class="fa-solid fa-chevron-right"></i></button>
      </div>

    </div>

  </div>

  <script src="../js/snake.js"></script>
</body>
</html>
