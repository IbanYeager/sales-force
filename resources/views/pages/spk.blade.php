<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Form SPK</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/spk_game.css" />
  <link rel="stylesheet" href="../css/sales_tools.css?v=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
  <script src="../js/sidebar_desktop.js"></script>
  <style>
    /* Custom Styling for Select2 to match .form-control */
    .select2-container--default .select2-selection--single {
      height: 48px;
      border-radius: 12px;
      border: 1px solid var(--border-color, #e2e8f0);
      background-color: #f8fafc;
      display: flex;
      align-items: center;
      padding: 0 16px;
      font-size: 14px;
      color: var(--text-dark, #1e293b);
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02) inset;
    }
    
    .select2-container--default .select2-selection--single:focus,
    .select2-container--default.select2-container--open .select2-selection--single {
      border-color: var(--primary-blue, #3b82f6);
      background-color: #ffffff;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
      outline: none;
    }

    .select2-container--default .select2-selection--single .select2-selection__rendered {
      padding-left: 0;
      color: var(--text-dark, #1e293b);
      font-weight: 500;
      line-height: normal;
    }

    .select2-container--default .select2-selection--single .select2-selection__arrow {
      height: 46px;
      right: 12px;
    }

    .select2-container--default .select2-selection--single .select2-selection__placeholder {
      color: var(--text-muted, #94a3b8);
    }
    
    .select2-dropdown {
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      overflow: hidden;
      margin-top: 4px;
    }
    
    .select2-search--dropdown .select2-search__field {
      border-radius: 8px;
      border: 1px solid var(--border-color, #e2e8f0);
      padding: 8px 12px;
      background-color: #f8fafc;
    }
    
    .select2-search--dropdown .select2-search__field:focus {
      border-color: var(--primary-blue, #3b82f6);
      outline: none;
      background-color: #ffffff;
    }

    .select2-results__option {
      padding: 10px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
    }
    
    .select2-container--default .select2-results__option--highlighted[aria-selected] {
      background-color: var(--primary-blue, #3b82f6);
      color: white;
    }
  </style>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Form SPK</h2>

    </header>

    <div class="container" style="margin-top:18px;">

      <!-- ── MODE SWITCHER ──────────────────────────────────────── -->
      <div class="input-mode-switcher-card">
        <div class="input-mode-toggle">
          <button id="btnModeBiasa" class="mode-toggle-btn active" onclick="switchSpkMode('biasa')">
            <i class="fa-solid fa-file-signature"></i>
            <span>Form Biasa</span>
          </button>
          <button id="btnModeGame" class="mode-toggle-btn" onclick="switchSpkMode('game')">
            <i class="fa-solid fa-gamepad"></i>
            <span>Input Lewat Game</span>
            <span class="mode-badge-new">HOT 🎮</span>
          </button>
        </div>
      </div>

      <!-- ── FORM INPUT BIASA ──────────────────────────────────── -->
      <div id="inputBiasaContainer" class="card" style="padding:22px;">
        <h3 class="section-title" style="margin-bottom:4px;">Buat Pengajuan SPK</h3>
        <p style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">SPK yang diajukan akan berstatus Menunggu dan memerlukan persetujuan Supervisor.</p>

        <!-- LUXURY SMART AI KTP SCANNER BANNER -->
        <input type="file" id="ocrKtpInputSpk" accept="image/*" style="display:none;" onchange="SalesSuperpowers.scanKtpFile(this, {nama:'namaCustomer'})">
        <div class="ocr-scanner-banner" onclick="document.getElementById('ocrKtpInputSpk').click()">
          <div class="ocr-banner-left">
            <div class="ocr-icon-glow">
              <i class="fa-solid fa-camera"></i>
            </div>
            <div>
              <div class="ocr-badge-chip"><i class="fa-solid fa-bolt"></i> SMART AI OCR SCANNER</div>
              <h4 class="ocr-banner-title">Scan KTP &amp; Auto-Fill Data SPK</h4>
              <p class="ocr-banner-sub">Foto KTP customer untuk mengisi Nama &amp; Identitas otomatis tanpa perlu ketik manual.</p>
            </div>
          </div>
          <button type="button" class="btn-ocr-action">
            <i class="fa-solid fa-camera"></i> Foto / Upload KTP
          </button>
        </div>

        <div class="form-group">
          <label>Nama Customer <span style="color:var(--primary-red);">*</span></label>
          <input class="form-control" type="text" id="namaCustomer" placeholder="Nama customer" />
        </div>

        <div class="form-group">
          <label>No. HP</label>
          <input class="form-control" type="tel" id="noHp" placeholder="08xxxxxxxxxx" />
        </div>

        <div class="form-group">
          <label>Tipe Mobil</label>
          <select class="form-control" id="modelSelect" onchange="updateNominal()">
            <option value="">-- Pilih Tipe Mobil --</option>
          </select>
          <input type="hidden" id="model" />
        </div>

        <div class="form-group">
          <label>Harga Mobil (Rp)</label>
          <input class="form-control" type="text" id="nominal" placeholder="Pilih tipe mobil terlebih dahulu" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <div class="form-group">
          <label>Tipe Pembelian</label>
          <select class="form-control" id="tipePembelian">
            <option value="Kredit">Kredit</option>
            <option value="Cash">Cash</option>
          </select>
        </div>

        <div class="form-group">
          <label>Tanda Tangan Customer</label>
          <div style="border: 2px dashed var(--border-color); border-radius: 12px; padding: 4px; background: #fafafa; margin-bottom: 8px;">
            <canvas id="signatureCanvas" style="width: 100%; height: 200px; display: block; border-radius: 8px; touch-action: none;"></canvas>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Silakan tanda tangan di atas</p>
            <button class="btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="clearSignature(event)"><i class="fa-solid fa-eraser"></i> Hapus</button>
          </div>
        </div>

        <button class="btn-main" style="margin-top:8px;" onclick="submitSpk()">
          <i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i>
          Submit SPK
        </button>
      </div>

      <!-- ── FORM INPUT LEWAT GAME (SPK RUSH ARCADE) ──────────── -->
      <div id="inputGameContainer" class="spk-arcade-wrapper" style="display:none;">
        
        <!-- Live HUD Bar -->
        <div class="arcade-hud-bar">
          <div class="arcade-speed-gauge">
            <i class="fa-solid fa-gauge-high"></i>
            <span id="hudSpeed">0 KM/H</span>
          </div>
          <div class="arcade-score-display">
            <i class="fa-solid fa-trophy" style="color:#fbbf24; margin-right:4px;"></i>
            <span id="hudScore">0 PTS</span>
          </div>
        </div>

        <!-- SPK Status Target Badges -->
        <div class="arcade-hud-chips-bar">
          <div id="hudCustBadge" class="arcade-hud-chip" onclick="triggerPitStopModal()" title="Klik untuk edit data customer">👤 Pitstop Customer</div>
          <div id="hudCarBadge" class="arcade-hud-chip" onclick="openCarSelectionModal()" title="Klik untuk ganti/pilih ulang unit mobil">🚗 Catch Mobil 🔄</div>
          <div id="hudPayBadge" class="arcade-hud-chip">💳 Kredit</div>
        </div>

        <!-- Nitro Track -->
        <div class="arcade-nitro-track">
          <div id="hudNitroBar" class="arcade-nitro-fill"></div>
        </div>

        <!-- 60 FPS HTML5 Canvas Viewport -->
        <div class="arcade-canvas-box">
          <canvas id="spkArcadeCanvas"></canvas>
        </div>

        <!-- OVERLAY MODAL 1: PITSTOP CUSTOMER INTAKE -->
        <div id="arcadePitstopModal" class="arcade-modal-overlay">
          <div class="arcade-modal-box">
            <h4 class="arcade-modal-title">🛑 PITSTOP: VIP Prospect Intake</h4>
            <p class="arcade-modal-sub">Masukkan identitas pembeli untuk lanjut balapan!</p>

            <input type="text" id="arcadeInputNama" class="arcade-input" placeholder="Nama Lengkap Customer..." />
            <input type="tel" id="arcadeInputHp" class="arcade-input" placeholder="Nomor WhatsApp / HP..." />

            <button class="btn-arcade-submit" onclick="savePitStopData()">
              <i class="fa-solid fa-gas-pump"></i> GAS POLL KEMBALI KE BALAPAN
            </button>
          </div>
        </div>

        <!-- OVERLAY MODAL 2: FINISH LINE BONNET SIGNATURE -->
        <div id="arcadeFinishOverlay" class="arcade-modal-overlay">
          <div class="arcade-modal-box" style="text-align:center;">
            <h4 class="arcade-modal-title" style="justify-content:center;">🏁 FINISH LINE: Deal Bonnet Sign</h4>
            <p class="arcade-modal-sub" style="margin-bottom:8px;">Tanda tangan customer di kap mobil juara!</p>

            <div style="background:rgba(255,255,255,0.05); padding:10px 12px; border-radius:10px; font-size:11px; color:#cbd5e1; margin-bottom:10px; text-align:left;">
              <div style="margin-bottom:4px;"><strong>Customer:</strong> <span id="finishSumCust">-</span></div>
              <div style="margin-bottom:6px;">
                <strong style="color:#fbbf24;">Unit Mobil SPK:</strong>
                <select id="finishCarSelect" onchange="changeFinishCarModel()" class="arcade-input" style="height:38px; font-size:12px; margin:4px 0 0 0; background:#1e293b; color:#fbbf24; font-weight:700; border-color:rgba(251,191,36,0.4);">
                  <!-- Populated dynamically -->
                </select>
              </div>
              <div><strong>Harga & Pembelian:</strong> <span id="finishSumPrice">Rp 0</span> (<span id="finishSumPay">-</span>)</div>
            </div>

            <div class="arcade-hood-box">
              <canvas id="hoodSignatureCanvas"></canvas>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
              <span style="font-size:10px; color:#94a3b8;">Silakan tanda tangan di atas</span>
              <button class="btn-outline" style="padding:2px 8px; font-size:10px; border-color:rgba(255,255,255,0.2); color:#cbd5e1;" onclick="clearHoodSignature(event)">
                <i class="fa-solid fa-eraser"></i> Hapus
              </button>
            </div>

            <button id="btnSubmitArcadeFinal" class="btn-arcade-submit" onclick="submitArcadeSpkFinal()">
              🏆 SUBMIT SPK & KLAIM CLOSING
            </button>
          </div>
        </div>

        <!-- D-Pad Controls for Touch/Mobile & Keyboard -->
        <div class="arcade-controls-bar">
          <button class="btn-arcade-ctrl btn-arcade-steer" onclick="movePlayerLeft()">◀ KIRI</button>
          <button class="btn-arcade-ctrl btn-arcade-nitro" onmousedown="triggerNitro(true)" onmouseup="triggerNitro(false)" ontouchstart="triggerNitro(true)" ontouchend="triggerNitro(false)">🚀 NITRO</button>
          <button class="btn-arcade-ctrl btn-arcade-steer" onclick="movePlayerRight()">KANAN ▶</button>
        </div>

        <button class="btn-arcade-submit" style="margin-top:14px; background:linear-gradient(135deg, #fbbf24, #f59e0b); color:#0f172a;" onclick="startArcadeGame()">
          <i class="fa-solid fa-flag-checkered"></i> START RACING & CATCH SPK
        </button>

      </div>

      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div class="section-title" style="margin:0; font-size:14px;">Daftar Pengajuan SPK</div>
        </div>
        <div style="margin-bottom: 12px; position:relative;">
          <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:12px; color:var(--text-muted); font-size:12px;"></i>
          <input type="text" id="searchSpk" class="form-control" style="padding-left:32px; font-size:12px;" placeholder="Cari nama customer / mobil..." onkeyup="filterSpkList()">
        </div>
        <div id="spkList" style="display:flex; flex-direction:column; gap:10px; max-height:400px; overflow-y:auto; padding-right:4px;">
          <p style="font-size:12px;color:var(--text-muted);line-height:1.6;" id="statusSpk">Belum ada pengajuan.</p>
        </div>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="../custom_alert.js"></script>
  <script src="../js/sales_superpowers.js?v=1.0"></script>
  <script src="../js/spk.js?v=2"></script>
  <script src="../js/spk_arcade_game.js?v=1"></script>

  <script src="../js/pwa-app.js?v=4"></script>
</body>

</html>

