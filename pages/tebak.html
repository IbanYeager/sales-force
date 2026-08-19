<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Tebak Otomotif Toyota</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    .lobby-hero {
      background: linear-gradient(145deg, #0f172a, #1e293b);
      color: white;
      padding: 24px 20px;
      border-radius: 20px;
      margin-bottom: 20px;
      position: relative;
      overflow: hidden;
    }
    .lobby-hero::before {
      content: ''; position: absolute; top: -40px; right: -40px;
      width: 160px; height: 160px;
      background: radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%);
      border-radius: 50%;
    }
    .lobby-hero-top {
      display: flex; justify-content: space-between; align-items: flex-start;
      margin-bottom: 16px; position: relative; z-index: 1;
    }
    .lobby-hero h3 { margin: 0 0 4px 0; font-size: 18px; font-weight: 900; letter-spacing: -0.3px; color: #ffffff; }
    .lobby-hero p { margin: 0; font-size: 12px; color: #94a3b8; }
    .lobby-hero-icon {
      width: 48px; height: 48px; border-radius: 16px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      display: flex; align-items: center; justify-content: center;
      font-size: 22px; color: #78350f;
      box-shadow: 0 4px 16px rgba(251,191,36,0.35); flex-shrink: 0;
    }
    .progress-wrap {
      position: relative; z-index: 1;
      display: flex; align-items: center; gap: 10px;
    }
    .progress-bar-track {
      flex: 1; height: 6px; background: rgba(255,255,255,0.1);
      border-radius: 10px; overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%; background: linear-gradient(90deg, #fbbf24, #22c55e);
      border-radius: 10px; transition: width 0.5s ease;
    }
    .progress-text {
      font-size: 11px; font-weight: 700; color: #fbbf24; white-space: nowrap;
      font-family: monospace;
    }

    .level-grid {
      display: grid; grid-template-columns: repeat(4, 1fr);
      gap: 10px; margin-bottom: 24px;
    }
    .level-card {
      aspect-ratio: 1; border-radius: 16px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; position: relative; transition: all 0.25s ease;
      border: 2px solid transparent; overflow: hidden;
    }
    .level-card:active { transform: scale(0.93); }

    .level-card.completed {
      background: linear-gradient(145deg, #dcfce7, #bbf7d0);
      border-color: #86efac;
      box-shadow: 0 2px 8px rgba(34,197,94,0.1);
    }
    .level-card.completed .level-num { color: #15803d; }
    .level-card.completed .level-status-icon { color: #22c55e; }

    .level-card.unlocked {
      background: #ffffff; border-color: #e2e8f0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.04);
    }
    .level-card.unlocked:hover {
      border-color: var(--primary-red, #CC0000); transform: translateY(-2px);
    }
    .level-card.unlocked .level-num { color: #0f172a; }
    .level-card.unlocked .level-status-icon { color: var(--primary-red, #CC0000); }

    .level-card.locked {
      background: #f8fafc; border-color: #e2e8f0; cursor: not-allowed; opacity: 0.6;
    }
    .level-card.locked .level-num { color: #94a3b8; }
    .level-card.locked .level-status-icon { color: #94a3b8; }

    .level-num { font-size: 16px; font-weight: 800; margin-bottom: 2px; }
    .level-status-icon { font-size: 12px; }

    .game-board { display: none; }
    
    .game-header-bar {
      background: linear-gradient(135deg, #cc0000, #990000);
      color: white; padding: 14px 18px; border-radius: 16px;
      margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;
    }
    .game-header-bar h3 { margin: 0; font-size: 16px; font-weight: 800; color: white; }
    .level-badge {
      font-size: 10px; font-weight: 800; background: rgba(255,255,255,0.2);
      padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;
    }

    .question-box {
      background: #ffffff; border-radius: 20px; padding: 24px 20px;
      margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      border: 1px solid #e2e8f0; text-align: center;
    }
    .question-category {
      font-size: 11px; font-weight: 800; color: var(--primary-red, #CC0000);
      text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 10px;
    }
    .question-text {
      font-size: 15px; font-weight: 700; color: #0f172a; line-height: 1.5; margin: 0;
    }

    .options-grid { display: flex; flex-direction: column; gap: 10px; }
    .option-btn {
      background: #ffffff; border: 2px solid #e2e8f0;
      padding: 14px 16px; border-radius: 14px; font-size: 13px;
      font-weight: 600; color: #0f172a; text-align: left;
      cursor: pointer; transition: all 0.2s ease;
      display: flex; align-items: center; gap: 14px;
    }
    .option-btn:active { transform: scale(0.98); }
    .option-marker {
      width: 32px; height: 32px; border-radius: 10px;
      background: #f8fafc; border: 1.5px solid #e2e8f0;
      display: flex; align-items: center; justify-content: center;
      font-size: 13px; color: #64748b; font-weight: 800; flex-shrink: 0;
    }
    .option-label { flex: 1; line-height: 1.4; }

    .option-btn.correct {
      border-color: #22c55e; background: rgba(34, 197, 94, 0.12); color: #22c55e;
    }
    .option-btn.correct .option-marker { background: #22c55e; border-color: #22c55e; color: white; }

    .option-btn.incorrect {
      border-color: #ef4444; background: rgba(239, 68, 68, 0.12); color: #ef4444;
    }
    .option-btn.incorrect .option-marker { background: #ef4444; border-color: #ef4444; color: white; }

    .option-btn.disabled { pointer-events: none; opacity: 0.55; }
    .option-btn.correct.disabled, .option-btn.incorrect.disabled { opacity: 1; }

    .success-overlay {
      position: fixed; inset: 0; background: rgba(15,23,42,0.85); z-index: 100;
      display: none; align-items: center; justify-content: center;
      backdrop-filter: blur(6px);
    }
    .success-card {
      background: #ffffff; color: #0f172a; width: 88%; max-width: 340px;
      padding: 32px 24px; border-radius: 24px; text-align: center; border: 1px solid #e2e8f0;
    }
    .success-icon {
      width: 64px; height: 64px; background: #22c55e; color: white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; margin: 0 auto 18px auto;
    }
    .success-card h3 { margin: 0 0 6px 0; font-size: 20px; font-weight: 900; color: #0f172a; }
    .success-card p { margin: 0 0 24px 0; font-size: 13px; color: #64748b; line-height: 1.5; }
    .btn-next-level {
      width: 100%; background: linear-gradient(135deg, #1e3a8a, #2563eb);
      color: white; border: none; padding: 14px; border-radius: 14px;
      font-weight: 800; font-size: 14px; cursor: pointer;
    }

    .lobby-stats {
      display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 16px;
    }
    .lobby-stat-card {
      background: #ffffff; border-radius: 14px; padding: 14px 10px;
      text-align: center; border: 1px solid #e2e8f0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
    }
    .lobby-stat-val {
      font-family: monospace; font-size: 18px; font-weight: 900; color: #0f172a; display: block; margin-bottom: 2px;
    }
    .lobby-stat-label { font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase; }

    .reset-btn {
      width: 100%; padding: 12px; background: transparent;
      border: 1.5px dashed #cbd5e1; color: #64748b; border-radius: 12px; font-size: 12px; font-weight: 600; cursor: pointer;
    }
    .reset-btn:hover { border-color: var(--primary-red, #CC0000); color: var(--primary-red, #CC0000); background: #fff5f5; }
  </style>
</head>
<body>
  <div class="mobile-app" style="max-width: 1200px;">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Tebak Otomotif Toyota</h2>
      <div id="livesContainer" style="color:#fbbf24; font-size:16px; display:flex; gap:4px; margin-left:auto;">
        <i class="fa-solid fa-heart"></i>
        <i class="fa-solid fa-heart"></i>
        <i class="fa-solid fa-heart"></i>
      </div>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      
      <!-- LOBBY VIEW -->
      <div id="lobbyView">
        <div class="lobby-hero">
          <div class="lobby-hero-top">
            <div>
              <h3>Tebak Otomotif Toyota</h3>
              <p>Selesaikan 20 level kuis pengetahuan produk Toyota</p>
            </div>
            <div class="lobby-hero-icon"><i class="fa-solid fa-lightbulb"></i></div>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" id="progressFill" style="width:0%"></div>
            </div>
            <span class="progress-text" id="progressText">0/20</span>
          </div>
        </div>

        <div class="lobby-stats">
          <div class="lobby-stat-card">
            <span class="lobby-stat-val" id="statCompleted">0</span>
            <span class="lobby-stat-label">Selesai</span>
          </div>
          <div class="lobby-stat-card">
            <span class="lobby-stat-val" id="statRemaining">20</span>
            <span class="lobby-stat-label">Tersisa</span>
          </div>
          <div class="lobby-stat-card">
            <span class="lobby-stat-val" id="statPercent">0%</span>
            <span class="lobby-stat-label">Progres</span>
          </div>
        </div>

        <div class="level-grid" id="levelGrid"></div>

        <button class="reset-btn" onclick="confirmResetProgress()">
          <i class="fa-solid fa-arrow-rotate-left" style="margin-right:6px;"></i> Ulang Dari Level 1
        </button>
      </div>

      <!-- GAME BOARD VIEW -->
      <div id="gameBoard" class="game-board">
        <div class="game-header-bar">
          <div style="display:flex; align-items:center; gap:10px;">
            <button class="btn-back-custom" onclick="exitToLobby()" style="width:32px; height:32px; border-radius:8px; font-size:14px; background:rgba(255,255,255,0.2); border:none; color:white; cursor:pointer;">
              <i class="fa-solid fa-arrow-left"></i>
            </button>
            <h3 id="boardTitle" style="margin:0;">Level 1</h3>
          </div>
          <span class="level-badge" id="categoryBadge">PENJUALAN</span>
        </div>

        <div class="question-box">
          <span class="question-category" id="questionCategory">PETUNJUK</span>
          <p class="question-text" id="questionText">Memuat pertanyaan...</p>
        </div>

        <div class="options-grid" id="optionsGrid"></div>
      </div>

    </div>
  </div>

  <div id="successOverlay" class="success-overlay">
    <div class="success-card">
      <div class="success-icon" id="successIcon"><i class="fa-solid fa-check"></i></div>
      <h3 id="successTitle">Luar Biasa!</h3>
      <p id="successMessage">Jawaban Anda benar. Level berikutnya telah terbuka!</p>
      <button class="btn-next-level" id="nextLevelBtn" onclick="nextLevel()">Lanjut</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="../js/tebak.js"></script>
</body>
</html>
