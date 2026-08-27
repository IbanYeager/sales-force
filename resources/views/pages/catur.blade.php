<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Toyota Catur Master</title>
  
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.css" />
  <script src="../js/sidebar_desktop.js"></script>
  
  <style>
    .chess-header {
      background: linear-gradient(135deg, #1e293b, #0f172a);
      color: white;
      padding: 20px;
      border-radius: 16px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }

    .chess-header::before {
      content: '';
      position: absolute;
      top: -30px;
      right: -30px;
      width: 120px;
      height: 120px;
      background: radial-gradient(circle, rgba(204,0,0,0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .chess-header h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      color: white;
    }

    .chess-header p {
      margin: 4px 0 0 0;
      font-size: 12px;
      color: #94a3b8;
    }

    .chess-header-icon {
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: rgba(255,255,255,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      color: #ffffff;
      border: 1px solid rgba(255,255,255,0.1);
      flex-shrink: 0;
    }

    .mode-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .mode-card {
      background: white;
      border-radius: 14px;
      padding: 18px 14px;
      text-align: center;
      cursor: pointer;
      border: 2px solid #e2e8f0;
      transition: all 0.25s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }

    .mode-card:hover {
      border-color: var(--primary-red, #cc0000);
      box-shadow: 0 4px 16px rgba(204,0,0,0.08);
    }

    .mode-card-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 10px auto;
      font-size: 18px;
    }

    .mode-card-icon.multiplayer { background: #dbeafe; color: #1e3a8a; }
    .mode-card-icon.computer { background: #fef3c7; color: #b45309; }

    .mode-card-title { font-size: 13px; font-weight: 800; color: #1e293b; margin-bottom: 3px; }
    .mode-card-desc { font-size: 11px; color: #94a3b8; }

    .ai-level-wrap {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      padding: 10px 14px;
      background: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      align-items: center;
    }

    .ai-level-wrap label { font-size: 12px; font-weight: 700; color: #475569; white-space: nowrap; }
    .ai-level-pills { display: flex; gap: 6px; flex: 1; }

    .ai-pill {
      flex: 1;
      padding: 7px 0;
      border-radius: 8px;
      border: 1.5px solid #e2e8f0;
      background: white;
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
    }

    .ai-pill.active {
      background: #1e3a8a;
      color: white;
      border-color: #1e3a8a;
      box-shadow: 0 2px 8px rgba(30,58,138,0.3);
    }

    .lobby-section-title {
      font-size: 13px;
      font-weight: 700;
      color: #475569;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .lobby-card {
      background: white;
      border-radius: 14px;
      padding: 14px 16px;
      margin-bottom: 10px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #f1f5f9;
    }

    .game-header-bar {
      background: linear-gradient(135deg, #cc0000, #990000);
      color: white;
      padding: 14px 18px;
      border-radius: 14px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .status-text {
      text-align: center;
      font-weight: 800;
      color: var(--primary-red, #cc0000);
      font-size: 14px;
      margin-bottom: 14px;
      padding: 10px 16px;
      background: #fef2f2;
      border-radius: 10px;
      border: 1px solid #fecdd3;
    }

    .player-box {
      background: white;
      padding: 12px 16px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-weight: 700;
      font-size: 14px;
      border: 2px solid #f1f5f9;
    }

    .player-box.turn-active {
      border-color: #22c55e !important;
      background: #f0fdf4 !important;
      box-shadow: 0 0 0 3px rgba(34,197,94,0.15);
    }

    #boardContainer {
      width: 100%;
      max-width: 400px;
      margin: 0 auto 16px auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 24px rgba(0,0,0,0.12);
    }

    .move-hint {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 30%; height: 30%;
      background: rgba(34, 197, 94, 0.45);
      border-radius: 50%; pointer-events: none; z-index: 10;
    }

    .move-hint-capture {
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      box-sizing: border-box; border: 4px solid rgba(239, 68, 68, 0.5);
      border-radius: 50%; pointer-events: none; z-index: 10;
    }

    .square-55d63 { position: relative !important; }

    .color-modal-backdrop {
      display: none; position: fixed; top: 0; left: 0;
      width: 100%; height: 100%; background: rgba(0,0,0,0.6);
      z-index: 9999; align-items: center; justify-content: center;
      backdrop-filter: blur(4px);
    }

    .color-modal-card {
      background: white; padding: 24px; border-radius: 20px;
      width: 90%; max-width: 320px; text-align: center;
    }

    .color-choices { display: flex; gap: 12px; margin-bottom: 14px; }
    .color-choice {
      flex: 1; padding: 16px 12px; border-radius: 14px; cursor: pointer;
      border: 2px solid #e2e8f0; display: flex; flex-direction: column; align-items: center; gap: 6px;
    }
    .color-choice.white-choice { background: #fafafa; }
    .color-choice.black-choice { background: #1e293b; color: white; }

    .btn-cancel-modal {
      width: 100%; padding: 10px; border-radius: 10px; background: #f1f5f9;
      border: none; font-size: 13px; font-weight: 700; color: #64748b; cursor: pointer;
    }

    .countdown-overlay {
      display: none; position: fixed; top: 0; left: 0;
      width: 100%; height: 100%; background: rgba(15,23,42,0.85);
      z-index: 10000; align-items: center; justify-content: center; flex-direction: column;
    }
    .countdown-number {
      font-size: 80px; font-weight: 900; color: white;
    }
  </style>
</head>
<body>
  <div class="mobile-app" style="max-width: 1200px;">
    
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Toyota Catur Master</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      
      <!-- LOBBY VIEW -->
      <div id="lobbyView">
        <div class="chess-header">
          <div>
            <h3>Lobi Ruang Catur</h3>
            <p>Bermain lawan AI atau tantang pemain lain secara online</p>
          </div>
          <div class="chess-header-icon"><i class="fa-solid fa-chess-knight"></i></div>
        </div>

        <div class="mode-grid">
          <div class="mode-card" onclick="prepareGame('multiplayer')">
            <div class="mode-card-icon multiplayer"><i class="fa-solid fa-users"></i></div>
            <div class="mode-card-title">Multiplayer</div>
            <div class="mode-card-desc">Tantang Pemain Online</div>
          </div>
          <div class="mode-card" onclick="prepareGame('computer')">
            <div class="mode-card-icon computer"><div class="piece-icon">🤖</div></div>
            <div class="mode-card-title">vs Komputer</div>
            <div class="mode-card-desc">Lawan Komputer AI</div>
          </div>
        </div>

        <div class="ai-level-wrap">
          <label><i class="fa-solid fa-sliders" style="margin-right:6px;"></i>Tingkat Kesulitan AI:</label>
          <div class="ai-level-pills">
            <div class="ai-pill active" data-level="1" onclick="selectAiLevel(this, 1)">Mudah</div>
            <div class="ai-pill" data-level="2" onclick="selectAiLevel(this, 2)">Sedang</div>
            <div class="ai-pill" data-level="3" onclick="selectAiLevel(this, 3)">Sulit</div>
          </div>
        </div>

        <div class="lobby-section-title">
          <i class="fa-solid fa-circle-dot" style="color:#22c55e;"></i> Ruangan Multiplayer Aktif
        </div>
        <div id="lobbyList">
          <p style="text-align:center; color:#64748b; font-size:12px; padding: 20px 0;">Memuat ruang lobi...</p>
        </div>
      </div>

      <!-- GAME VIEW -->
      <div id="gameView" style="display:none;">
        <div class="game-header-bar">
          <a href="#" onclick="leaveGame(); return false;" style="color:white; font-size:18px; text-decoration:none; display:flex; align-items:center;">
            <i class="fa-solid fa-arrow-left"></i>
          </a>
          <h3 id="gameTitle" style="margin:0;">Papan Pertandingan</h3>
        </div>

        <div class="status-text" id="gameStatus">Menunggu lawan...</div>

        <div class="player-box" id="opponentBox">
          <img src="https://ui-avatars.com/api/?name=L&background=f1f5f9" style="width:32px; height:32px; border-radius:50%;" id="opponentAvatar">
          <span id="opponentName">Menunggu...</span>
        </div>

        <div id="boardContainer">
          <div id="board1" style="width: 100%"></div>
        </div>

        <div class="player-box" id="myBox">
          <img src="https://ui-avatars.com/api/?name=Anda&background=f1f5f9" style="width:32px; height:32px; border-radius:50%;" id="myAvatar">
          <span id="myName">Anda</span>
        </div>
      </div>

    </div>
  </div>

  <div id="colorModal" class="color-modal-backdrop">
    <div class="color-modal-card">
      <h4 style="margin:0 0 6px 0; font-size:16px; font-weight:800;">Pilih Warna Bidak</h4>
      <p style="margin:0 0 16px 0; font-size:12px; color:#64748b;">Tentukan sisi Anda di papan catur</p>
      <div class="color-choices">
        <div class="color-choice white-choice" onclick="confirmColor('w')">
          <span style="font-size:28px;">♔</span>
          <span style="font-size:12px; font-weight:800;">Putih</span>
        </div>
        <div class="color-choice black-choice" onclick="confirmColor('b')">
          <span style="font-size:28px;">♚</span>
          <span style="font-size:12px; font-weight:800;">Hitam</span>
        </div>
      </div>
      <button class="btn-cancel-modal" onclick="closeColorModal()">Batal</button>
    </div>
  </div>

  <div id="countdownOverlay" class="countdown-overlay">
    <div id="countdownNumber" class="countdown-number">3</div>
  </div>

  <select id="aiLevel" style="display:none;">
    <option value="1" selected>Mudah</option>
    <option value="2">Sedang</option>
    <option value="3">Sulit</option>
  </select>

  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/chessboard-js/1.0.0/chessboard-1.0.0.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/chess.js/0.10.3/chess.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

  <script>
    function selectAiLevel(el, level) {
      document.querySelectorAll('.ai-pill').forEach(p => p.classList.remove('active'));
      el.classList.add('active');
      document.getElementById('aiLevel').value = level;
    }
  </script>
  <script src="../js/catur.js"></script>
</body>
</html>
