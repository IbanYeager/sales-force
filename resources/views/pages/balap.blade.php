<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota GR Racing Minigame</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Orbitron:wght@600;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .game-wrapper {
      border-radius: 20px;
      overflow: hidden;
      background: linear-gradient(145deg, #0f172a, #1e293b);
      box-shadow: 0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.05);
      position: relative;
      margin-bottom: 20px;
    }

    .game-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 18px;
      background: linear-gradient(90deg, rgba(204,0,0,0.15), rgba(30,58,138,0.15));
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    
    .score-display {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Orbitron', monospace;
      font-size: 16px;
      font-weight: 700;
      color: #f8fafc;
    }
    
    .score-display.score-label {
      font-family: 'Inter', sans-serif;
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .hi-score-display {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    
    .current-score-display {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 2px;
    }

    .hi-score-val {
      color: #fbbf24;
      text-shadow: 0 0 8px rgba(251,191,36,0.3);
    }

    .speed-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #64748b;
    }
    
    .speed-bar-track {
      width: 60px;
      height: 4px;
      background: rgba(255,255,255,0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    
    .speed-bar-fill {
      height: 100%;
      width: 30%;
      background: linear-gradient(90deg, #22c55e, #f97316, #ef4444);
      border-radius: 2px;
      transition: width 0.3s;
    }

    .game-canvas-wrap {
      position: relative;
      width: 100%;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
    }

    #gameCanvas {
      width: 100%;
      display: block;
    }

    .game-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 10;
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      background: rgba(15, 23, 42, 0.75);
      transition: opacity 0.3s;
    }

    .game-overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }
    
    .overlay-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-bottom: 14px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .overlay-icon.start {
      background: linear-gradient(135deg, #cc0000, #990000);
      color: white;
    }
    
    .overlay-icon.gameover {
      background: linear-gradient(135deg, #ef4444, #b91c1c);
      color: white;
    }

    .overlay-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 20px;
      font-weight: 800;
      color: white;
      margin: 0 0 6px 0;
    }

    .overlay-sub {
      font-size: 12px;
      color: #94a3b8;
      margin: 0 0 20px 0;
      line-height: 1.5;
    }

    .overlay-final-score {
      font-family: 'Orbitron', monospace;
      font-size: 36px;
      font-weight: 900;
      color: #fbbf24;
      margin-bottom: 4px;
    }

    .overlay-new-record {
      display: none;
      font-size: 11px;
      font-weight: 800;
      color: #22c55e;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 14px;
    }

    .btn-play {
      background: linear-gradient(135deg, #cc0000 0%, #990000 100%);
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 50px;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 16px rgba(204,0,0,0.4);
      transition: all 0.2s;
    }

    .btn-play:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(204,0,0,0.55);
    }

    .btn-play:active {
      transform: scale(0.96);
    }

    .game-stats-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      padding: 12px 16px;
      background: rgba(15, 23, 42, 0.4);
      border-top: 1px solid rgba(255,255,255,0.04);
    }

    .stat-item {
      text-align: center;
    }

    .stat-val {
      font-family: 'Orbitron', monospace;
      font-size: 14px;
      font-weight: 700;
      color: #f8fafc;
      display: block;
    }

    .stat-label {
      font-size: 10px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .howto-card {
      background: white;
      padding: 18px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    .howto-card h4 {
      margin: 0 0 12px 0;
      color: #1e293b;
      font-size: 14px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .howto-card h4 i {
      color: #1e3a8a;
    }

    .howto-steps {
      display: flex;
      gap: 12px;
    }

    .howto-step {
      flex: 1;
      text-align: center;
      padding: 12px 8px;
      background: #f1f5f9;
      border-radius: 12px;
    }

    .howto-step-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #cc0000, #991b1b);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px auto;
      font-size: 14px;
    }

    .howto-step-text {
      font-size: 11px;
      color: #64748b;
      line-height: 1.4;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="mobile-app" style="max-width: 1200px;">
    
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota GR Racing</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      
      <div class="game-wrapper">
        <div class="game-top-bar">
          <div class="hi-score-display">
            <span class="score-display score-label"><i class="fa-solid fa-crown" style="color:#fbbf24; margin-right:4px;"></i>Rekor</span>
            <span class="score-display hi-score-val" id="highScoreEl">00000</span>
          </div>
          <div class="speed-indicator">
            <i class="fa-solid fa-gauge-high"></i>
            <div class="speed-bar-track"><div class="speed-bar-fill" id="speedBar"></div></div>
          </div>
          <div class="current-score-display">
            <span class="score-display score-label">Skor</span>
            <span class="score-display" id="scoreEl">00000</span>
          </div>
        </div>

        <div class="game-canvas-wrap" id="canvasWrap">
          <canvas id="gameCanvas" width="800" height="260"></canvas>
          
          <div class="game-overlay" id="startOverlay">
            <div class="overlay-icon start"><i class="fa-solid fa-car-side"></i></div>
            <h3 class="overlay-title">Toyota GR Racing</h3>
            <p class="overlay-sub">Ketuk layar atau spasi untuk melompat!<br>Hindari rintangan di lintasan.</p>
            <button class="btn-play" onclick="startGame()"><i class="fa-solid fa-play"></i>Mulai Balap</button>
          </div>

          <div class="game-overlay hidden" id="gameOverOverlay">
            <div class="overlay-icon gameover"><i class="fa-solid fa-flag-checkered"></i></div>
            <h3 class="overlay-title">Game Over</h3>
            <div class="overlay-final-score" id="finalScore">0</div>
            <div class="overlay-new-record" id="newRecordBadge">🏆 Rekor Baru!</div>
            <p class="overlay-sub" style="margin-bottom:16px;">Anda melewati <span id="obstaclesPassed" style="color:#f8fafc; font-weight:700;">0</span> rintangan</p>
            <button class="btn-play" onclick="startGame()"><i class="fa-solid fa-rotate-right"></i>Main Lagi</button>
          </div>
        </div>

        <div class="game-stats-bar">
          <div class="stat-item">
            <span class="stat-val" id="statDistance">0 m</span>
            <span class="stat-label">Jarak</span>
          </div>
          <div class="stat-item">
            <span class="stat-val" id="statObstacles">0</span>
            <span class="stat-label">Rintangan</span>
          </div>
          <div class="stat-item">
            <span class="stat-val" id="statJumps">0</span>
            <span class="stat-label">Lompatan</span>
          </div>
        </div>
      </div>

      <div class="howto-card">
        <h4><i class="fa-solid fa-gamepad"></i> Cara Bermain</h4>
        <div class="howto-steps">
          <div class="howto-step">
            <div class="howto-step-icon"><i class="fa-solid fa-hand-pointer"></i></div>
            <div class="howto-step-text">Ketuk layar untuk melompat</div>
          </div>
          <div class="howto-step">
            <div class="howto-step-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
            <div class="howto-step-text">Hindari kerucut &amp; batu</div>
          </div>
          <div class="howto-step">
            <div class="howto-step-icon"><i class="fa-solid fa-bolt"></i></div>
            <div class="howto-step-text">Semakin jauh semakin cepat!</div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script src="../js/carrun.js"></script>
</body>
</html>
