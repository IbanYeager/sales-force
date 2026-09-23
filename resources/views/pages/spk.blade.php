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
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
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

        <!-- LUXURY SMART AI KTP & KK SCANNER BANNER -->
        <div class="ocr-scanner-banner" onclick="SalesSuperpowers.openOcrModal('ktp')">
          <div class="ocr-banner-left">
            <div class="ocr-icon-glow">
              <i class="fa-solid fa-camera"></i>
            </div>
            <div>
              <div class="ocr-badge-chip"><i class="fa-solid fa-bolt"></i> SMART AI OCR SCANNER</div>
              <h4 class="ocr-banner-title">Scan KTP / KK &amp; Auto-Fill Data SPK</h4>
              <p class="ocr-banner-sub">Buka kamera atau upload foto e-KTP / Kartu Keluarga untuk mengisi data identitas otomatis.</p>
            </div>
          </div>
          <div style="display:flex; gap:8px; flex-wrap:wrap; z-index:2;">
            <button type="button" class="btn-ocr-action" onclick="event.stopPropagation(); SalesSuperpowers.openOcrModal('ktp')">
              <i class="fa-solid fa-id-card"></i> Scan KTP
            </button>
            <button type="button" class="btn-ocr-action" style="background:rgba(255,255,255,0.18);" onclick="event.stopPropagation(); SalesSuperpowers.openOcrModal('kk')">
              <i class="fa-solid fa-users-rectangle"></i> Scan KK
            </button>
          </div>
        </div>

        <!-- ── BAGIAN 1: INFORMASI IDENTITAS KTP & KK ─────────────── -->
        <div class="spk-form-section">
          <div class="spk-section-header">
            <div class="spk-section-title-wrap">
              <div class="spk-section-icon"><i class="fa-solid fa-id-card"></i></div>
              <div>
                <h4 class="spk-section-title">Informasi Identitas (KTP &amp; KK)</h4>
                <p style="margin:0; font-size:11px; color:var(--text-muted);">Data kependudukan pembeli untuk pengajuan STNK, BPKB &amp; Leasing</p>
              </div>
            </div>
            <span class="spk-section-badge">IDENTITAS NASABAH</span>
          </div>

          <!-- NIK & No KK -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Nomor Induk Kependudukan (NIK KTP)</label>
              <input class="form-control" type="text" id="spkNik" placeholder="16 digit NIK (misal: 3273xxxxxxxxxxxx)" maxlength="20" />
            </div>
            <div class="form-group">
              <label>Nomor Kartu Keluarga (No. KK)</label>
              <input class="form-control" type="text" id="spkNoKk" placeholder="16 digit Nomor KK" maxlength="20" />
            </div>
          </div>

          <!-- Nama Lengkap & No HP -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Nama Customer (Sesuai KTP) <span style="color:var(--primary-red);">*</span></label>
              <input class="form-control" type="text" id="namaCustomer" placeholder="Nama lengkap sesuai KTP" />
            </div>
            <div class="form-group">
              <label>Nomor WhatsApp / HP <span style="color:var(--primary-red);">*</span></label>
              <input class="form-control" type="tel" id="noHp" placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <!-- Tempat & Tgl Lahir -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Tempat Lahir</label>
              <input class="form-control" type="text" id="spkTempatLahir" placeholder="Kota tempat lahir (misal: Bandung)" />
            </div>
            <div class="form-group">
              <label>Tanggal Lahir</label>
              <input class="form-control" type="text" id="spkTanggalLahir" placeholder="DD-MM-YYYY (misal: 17-08-1990)" />
            </div>
          </div>

          <!-- Jenis Kelamin & Status Perkawinan -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Jenis Kelamin</label>
              <select class="form-control" id="spkJenisKelamin">
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="LAKI-LAKI">LAKI-LAKI</option>
                <option value="PEREMPUAN">PEREMPUAN</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status Perkawinan</label>
              <select class="form-control" id="spkStatusPerkawinan">
                <option value="">-- Pilih Status --</option>
                <option value="BELUM KAWIN">Belum Kawin</option>
                <option value="KAWIN">Kawin</option>
                <option value="CERAI HIDUP">Cerai Hidup</option>
                <option value="CERAI MATI">Cerai Mati</option>
              </select>
            </div>
          </div>

          <!-- Alamat KTP -->
          <div class="form-group">
            <label>Alamat Lengkap (Sesuai KTP)</label>
            <textarea class="form-control" id="spkAlamat" rows="2" placeholder="Nama jalan, nomor rumah, gang, atau dusun..."></textarea>
          </div>

          <!-- RT/RW & Kelurahan -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>RT / RW</label>
              <input class="form-control" type="text" id="spkRtRw" placeholder="Contoh: 003/008" />
            </div>
            <div class="form-group">
              <label>Kelurahan / Desa</label>
              <input class="form-control" type="text" id="spkKelurahan" placeholder="Nama Kelurahan / Desa" />
            </div>
          </div>

          <!-- Kecamatan & Kota -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Kecamatan</label>
              <input class="form-control" type="text" id="spkKecamatan" placeholder="Nama Kecamatan" />
            </div>
            <div class="form-group">
              <label>Kota / Kabupaten</label>
              <input class="form-control" type="text" id="spkKota" placeholder="Contoh: Kota Bandung" />
            </div>
          </div>

          <!-- Provinsi & Pekerjaan -->
          <div class="form-grid-2col">
            <div class="form-group">
              <label>Provinsi</label>
              <input class="form-control" type="text" id="spkProvinsi" placeholder="Contoh: Jawa Barat" />
            </div>
            <div class="form-group">
              <label>Pekerjaan / Profesi</label>
              <input class="form-control" type="text" id="spkPekerjaan" placeholder="Karyawan Swasta / Wiraswasta / PNS" />
            </div>
          </div>

          <!-- Agama -->
          <div class="form-group">
            <label>Agama</label>
            <select class="form-control" id="spkAgama">
              <option value="">-- Pilih Agama --</option>
              <option value="ISLAM">Islam</option>
              <option value="KRISTEN">Kristen</option>
              <option value="KATOLIK">Katolik</option>
              <option value="HINDU">Hindu</option>
              <option value="BUDDHA">Buddha</option>
              <option value="KONGHUCU">Konghucu</option>
            </select>
          </div>

          <!-- Dokumen Lampiran Foto KTP & KK -->
          <div style="margin-top:14px;">
            <label style="font-size:12.5px; font-weight:800; color:#334155; display:block; margin-bottom:6px;">
              <i class="fa-solid fa-paperclip" style="color:var(--primary-red);"></i> Lampiran Berkas KTP &amp; KK
            </label>
            
            <div class="spk-docs-grid">
              <!-- Card KTP -->
              <div class="spk-doc-card" id="spkDocCardKtp">
                <div class="spk-doc-thumb" id="spkThumbKtp">
                  <i class="fa-solid fa-id-card"></i>
                </div>
                <div class="spk-doc-info">
                  <div class="spk-doc-name">Foto e-KTP</div>
                  <div class="spk-doc-status" id="spkStatusKtp">Belum ada foto</div>
                </div>
                <button type="button" class="spk-doc-btn" onclick="SalesSuperpowers.openOcrModal('ktp')">
                  <i class="fa-solid fa-camera"></i> <span id="spkBtnTextKtp">Foto / Scan</span>
                </button>
              </div>

              <!-- Card KK -->
              <div class="spk-doc-card" id="spkDocCardKk">
                <div class="spk-doc-thumb" id="spkThumbKk">
                  <i class="fa-solid fa-users-rectangle"></i>
                </div>
                <div class="spk-doc-info">
                  <div class="spk-doc-name">Foto Kartu Keluarga</div>
                  <div class="spk-doc-status" id="spkStatusKk">Belum ada foto</div>
                </div>
                <button type="button" class="spk-doc-btn" onclick="SalesSuperpowers.openOcrModal('kk')">
                  <i class="fa-solid fa-camera"></i> <span id="spkBtnTextKk">Foto / Scan</span>
                </button>
              </div>
            </div>

            <!-- Hidden Inputs for Base64 Photos -->
            <input type="hidden" id="spkFotoKtp" value="" />
            <input type="hidden" id="spkFotoKk" value="" />
          </div>
        </div>

        <!-- ── BAGIAN 2: DATA PEMESANAN KENDARAAN (SPK) ─────────── -->
        <div class="spk-form-section">
          <div class="spk-section-header">
            <div class="spk-section-title-wrap">
              <div class="spk-section-icon icon-red"><i class="fa-solid fa-car"></i></div>
              <div>
                <h4 class="spk-section-title">Detail Kendaraan &amp; Transaksi</h4>
                <p style="margin:0; font-size:11px; color:var(--text-muted);">Pilih tipe mobil Toyota, warna, dan sistem pembayaran</p>
              </div>
            </div>
            <span class="spk-section-badge">UNIT TOYOTA</span>
          </div>

          <div class="form-group">
            <label>Tipe Mobil <span style="color:var(--primary-red);">*</span></label>
            <select class="form-control" id="modelSelect" onchange="updateNominal()">
              <option value="">-- Pilih Tipe Mobil --</option>
            </select>
            <input type="hidden" id="model" />
          </div>

          <div class="form-group">
            <label>Harga Mobil OTR (Rp)</label>
            <input class="form-control" type="text" id="nominal" placeholder="Pilih tipe mobil terlebih dahulu" readonly style="background-color: #f1f5f9; cursor: not-allowed; font-weight:700;" />
          </div>

          <div class="form-group">
            <label>Tipe Pembelian</label>
            <select class="form-control" id="tipePembelian">
              <option value="Kredit">Kredit (Pembiayaan TAF / ACC / Bank)</option>
              <option value="Cash">Cash (Tunai)</option>
            </select>
          </div>
        </div>

        <!-- ── BAGIAN 3: TANDA TANGAN DIGITAL CUSTOMER ─────────── -->
        <div class="spk-form-section">
          <div class="spk-section-header">
            <div class="spk-section-title-wrap">
              <div class="spk-section-icon icon-green"><i class="fa-solid fa-signature"></i></div>
              <div>
                <h4 class="spk-section-title">Tanda Tangan Digital Customer</h4>
                <p style="margin:0; font-size:11px; color:var(--text-muted);">Beri tanda tangan langsung pada layar sentuh atau mouse</p>
              </div>
            </div>
            <span class="spk-section-badge">PERSETUJUAN</span>
          </div>

          <div class="form-group">
            <div style="border: 2px dashed var(--border-color); border-radius: 14px; padding: 4px; background: #fafafa; margin-bottom: 8px;">
              <canvas id="signatureCanvas" style="width: 100%; height: 180px; display: block; border-radius: 10px; touch-action: none; background:#ffffff;"></canvas>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <p style="font-size: 11px; color: var(--text-muted); margin: 0;">Silakan bubuhkan tanda tangan customer di atas</p>
              <button class="btn-outline" style="padding: 4px 10px; font-size: 11px;" onclick="clearSignature(event)"><i class="fa-solid fa-eraser"></i> Bersihkan Tanda Tangan</button>
            </div>
          </div>
        </div>

        <button class="btn-main" style="margin-top:8px; padding:15px;" onclick="submitSpk()">
          <i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i>
          SUBMIT PENGAJUAN SPK LENGKAP
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
          <div id="hudCustBadge" class="arcade-hud-chip" onclick="triggerPitStopModal()" title="Klik untuk edit data customer"><i class="fa-solid fa-user"></i> Pitstop Customer</div>
          <div id="hudCarBadge" class="arcade-hud-chip" onclick="openCarSelectionModal()" title="Klik untuk ganti/pilih ulang unit mobil"><i class="fa-solid fa-car"></i> Catch Mobil</div>
          <div id="hudPayBadge" class="arcade-hud-chip"><i class="fa-solid fa-credit-card"></i> Kredit</div>
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
            <h4 class="arcade-modal-title"><i class="fa-solid fa-flag-checkered"></i> PITSTOP: VIP Prospect Intake</h4>
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
            <h4 class="arcade-modal-title" style="justify-content:center;"><i class="fa-solid fa-trophy"></i> FINISH LINE: Deal Bonnet Sign</h4>
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

  <!-- ══════════════════════════════════════════════════════════════════════
       SMART AI OCR SCANNER CAMERA & UPLOAD MODAL
       ══════════════════════════════════════════════════════════════════════ -->
  <div id="smartOcrModal" class="ocr-modal-overlay" style="display:none;" onclick="SalesSuperpowers.closeOcrModal(event)">
    <div class="ocr-modal-container" onclick="event.stopPropagation()">
      <!-- Modal Header -->
      <div class="ocr-modal-header">
        <div class="ocr-modal-title" style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
          <div style="width:28px; height:28px; border-radius:8px; background:#d7123a; display:flex; align-items:center; justify-content:center; font-size:13px; color:#fff;">
            <i class="fa-solid fa-camera"></i>
          </div>
          <span>Smart AI OCR Scanner</span>
          <span id="ocrHeaderEngineBadge" class="ocr-engine-pill" onclick="SalesSuperpowers.promptApiKey()" title="Klik untuk cek / setel Gemini AI Key">
            <i class="fa-solid fa-bolt"></i> <span id="ocrHeaderEngineText">Smart OCR</span> <i class="fa-solid fa-key" style="font-size:9px; opacity:0.7;"></i>
          </span>
        </div>
        <button type="button" class="ocr-modal-close-btn" onclick="SalesSuperpowers.closeOcrModal()">&times;</button>
      </div>

      <!-- Mode Switcher: KTP vs KK -->
      <div class="ocr-type-switcher">
        <button type="button" id="btnOcrTypeKtp" class="ocr-type-btn active" onclick="SalesSuperpowers.setOcrDocType('ktp')">
          <i class="fa-solid fa-id-card"></i> e-KTP Customer
        </button>
        <button type="button" id="btnOcrTypeKk" class="ocr-type-btn" onclick="SalesSuperpowers.setOcrDocType('kk')">
          <i class="fa-solid fa-users-rectangle"></i> Kartu Keluarga (KK)
        </button>
      </div>

      <!-- Source Tabs: Kamera Langsung vs Upload File -->
      <div class="ocr-source-pills">
        <button type="button" id="btnOcrSourceCam" class="ocr-source-pill active" onclick="SalesSuperpowers.setOcrSource('camera')">
          <i class="fa-solid fa-video"></i> Kamera Langsung
        </button>
        <button type="button" id="btnOcrSourceUpload" class="ocr-source-pill" onclick="SalesSuperpowers.setOcrSource('upload')">
          <i class="fa-solid fa-cloud-arrow-up"></i> Upload dari File / Galeri
        </button>
      </div>

      <!-- VIEWPORT 1: KAMERA LANGSUNG -->
      <div id="ocrCameraSection" style="display:block;">
        <div class="ocr-viewfinder-box">
          <video id="ocrCameraVideo" autoplay playsinline muted></video>
          
          <!-- Card Target HUD Guides -->
          <div class="ocr-hud-frame" id="ocrHudFrame">
            <div id="ocrAutoScanBadge" class="ocr-autoscan-badge"><i class="fa-solid fa-bolt fa-fade"></i> Auto-Scan Aktif</div>
            <span class="ocr-hud-corner ocr-corner-tl"></span>
            <span class="ocr-hud-corner ocr-corner-tr"></span>
            <span class="ocr-hud-corner ocr-corner-bl"></span>
            <span class="ocr-hud-corner ocr-corner-br"></span>
            <div class="ocr-laser-beam"></div>
            <div class="ocr-hud-tip" id="ocrHudTip">Posisikan e-KTP di dalam kotak panduan</div>
            <div id="ocrAutoScanCountdown" class="ocr-autoscan-countdown" style="display:none;">
              <div class="ocr-pulse-ring"></div>
              <span id="ocrCountdownText">⚡ Mendeteksi Dokumen...</span>
            </div>
          </div>
        </div>

        <!-- Camera Controls -->
        <div class="ocr-controls-bar">
          <button type="button" class="btn-ocr-round" onclick="SalesSuperpowers.switchCamera()" title="Ganti Kamera Depan / Belakang">
            <i class="fa-solid fa-camera-rotate"></i>
          </button>
          
          <button type="button" class="btn-ocr-shutter" onclick="SalesSuperpowers.captureSnapshot(true)" title="Ambil Foto Manual">
            <div class="btn-ocr-shutter-inner">
              <i class="fa-solid fa-camera"></i>
            </div>
          </button>

          <button type="button" id="btnOcrAutoScanToggle" class="btn-ocr-round active" onclick="SalesSuperpowers.toggleAutoScan()" title="Nyalakan / Matikan Auto-Scan">
            <i class="fa-solid fa-bolt"></i>
          </button>

          <button type="button" class="btn-ocr-round" onclick="document.getElementById('ocrGalleryFileInput').click()" title="Pilih dari Galeri">
            <i class="fa-solid fa-images"></i>
          </button>
        </div>
      </div>

      <!-- VIEWPORT 2: UPLOAD DARI FILE / GALERI -->
      <div id="ocrUploadSection" style="display:none;">
        <input type="file" id="ocrGalleryFileInput" accept="image/*" style="display:none;" onchange="SalesSuperpowers.handleFileSelect(this)" />
        <div class="ocr-dropzone-box" onclick="document.getElementById('ocrGalleryFileInput').click()">
          <div style="font-size:38px; color:#ef4444; margin-bottom:12px;">
            <i class="fa-solid fa-cloud-arrow-up"></i>
          </div>
          <h4 style="font-size:14px; font-weight:800; margin:0 0 6px 0; color:#ffffff;">Pilih Foto Dokumen</h4>
          <p style="font-size:12px; color:#94a3b8; margin:0 0 14px 0;">Klik di sini untuk memilih foto KTP atau Kartu Keluarga dari perangkat Anda.</p>
          <span style="font-size:11px; font-weight:700; background:rgba(255,255,255,0.1); padding:5px 12px; border-radius:8px; color:#cbd5e1;">
            JPG, PNG, WEBP (Max 10MB)
          </span>
        </div>
      </div>

      <!-- VIEWPORT 3: PREVIEW FOTO HASIL TANGKAPAN -->
      <div id="ocrPreviewSection" style="display:none;">
        <div class="ocr-viewfinder-box" style="height:260px;">
          <img id="ocrCapturedPreview" src="" alt="Preview Dokumen" />
          <div id="ocrScanningOverlay" style="display:none; position:absolute; inset:0; background:rgba(15,23,42,0.85); flex-direction:column; align-items:center; justify-content:center;">
            <div style="width:48px; height:48px; border-radius:50%; border:3px solid #ef4444; border-top-color:transparent; animation:radar-spin 1s linear infinite; margin-bottom:12px;"></div>
            <span style="font-size:13px; font-weight:800; color:#fff;" id="ocrScanningStatusText">Mengekstrak Data AI OCR...</span>
            <span style="font-size:11px; color:#94a3b8; margin-top:4px;">Mohon tunggu beberapa detik</span>
          </div>
        </div>

        <!-- Action buttons after capture -->
        <div id="ocrPreScanActions" class="ocr-controls-bar" style="justify-content:center; gap:14px;">
          <button type="button" class="btn-ocr-retake" onclick="SalesSuperpowers.retakePhoto()">
            <i class="fa-solid fa-rotate-left"></i> Foto Ulang
          </button>
          <button type="button" class="btn-ocr-apply" onclick="SalesSuperpowers.processOcr()">
            <i class="fa-solid fa-bolt"></i> PROSES SCAN AI SEKARANG
          </button>
        </div>
      </div>

      <!-- VIEWPORT 4: HASIL REVIEW EKSTRAKSI AI -->
      <div id="ocrReviewSection" style="display:none;">
        <div class="ocr-review-panel">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:12px; font-weight:800; color:#10b981;">
              <i class="fa-solid fa-circle-check"></i> Data Berhasil Diekstrak AI
            </span>
            <span style="font-size:10px; color:#94a3b8;" id="ocrEngineBadge">AI Smart Engine</span>
          </div>

          <div id="ocrReviewList">
            <!-- Populated dynamically -->
          </div>
        </div>

        <div class="ocr-bottom-actions">
          <button type="button" class="btn-ocr-retake" onclick="SalesSuperpowers.retakePhoto()">
            <i class="fa-solid fa-rotate-left"></i> Scan Lain
          </button>
          <button type="button" class="btn-ocr-apply" onclick="SalesSuperpowers.applyExtractedDataToForm()">
            <i class="fa-solid fa-check-double"></i> TERAPKAN KE FORM SPK
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       DOKUMEN RESMI DIGITAL SPK TUNAS TOYOTA (PRINTABLE & WA SHARING)
       ══════════════════════════════════════════════════════════════════════ -->
  <div id="spkDocumentModal" class="spk-doc-overlay" style="display:none;" onclick="closeSpkDocumentModal(event)">
    <div class="spk-doc-sheet" onclick="event.stopPropagation()">
      <!-- Header Dialog -->
      <div class="spk-doc-header no-print">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:8px; background:#c8102e; display:flex; align-items:center; justify-content:center; color:white; font-size:14px;">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div>
            <h4 style="margin:0; font-size:15px; font-weight:800; color:white;">Lembar Resmi Digital SPK Tunas Toyota</h4>
            <p style="margin:0; font-size:11px; color:#94a3b8;">Surat Pemesanan Kendaraan resmi &amp; persetujuan digital</p>
          </div>
        </div>
        <button type="button" class="ocr-modal-close-btn" onclick="closeSpkDocumentModal()">&times;</button>
      </div>

      <!-- Body / Printable Paper -->
      <div class="spk-doc-body">
        <div class="spk-paper" id="spkDocPrintArea">
          <!-- TOP HEADER: LOGO, TITLE, DEALER PT DETAILS -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; border-bottom:2px solid #000; padding-bottom:8px;">
            <!-- Brand Logo Left -->
            <div style="width:28%; display:flex; align-items:center; gap:8px;">
              <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" alt="Tunas Toyota" style="height:36px; max-width:160px; object-fit:contain;">
            </div>

            <!-- Title Center -->
            <div style="width:44%; text-align:center;">
              <h2 style="font-size:16px; font-weight:900; letter-spacing:1px; margin:4px 0 0; color:#000000; text-transform:uppercase; font-family:'Inter', Arial, sans-serif;">SURAT PESANAN KENDARAAN</h2>
            </div>

            <!-- Dealer PT Right -->
            <div style="width:28%; text-align:right; font-size:9px; line-height:1.3; color:#000000;">
              <div style="font-weight:900; font-size:10px;">PT. TUNAS RIDEAN TBK</div>
              <div style="font-weight:700;">Cabang Kiara Condong</div>
              <div style="color:#333;">Jl. Terusan Kiara Condong No. 154 Bandung 40284</div>
              <div style="color:#333;">Telp: (022) 731-2000</div>
            </div>
          </div>

          <!-- Date & SPK Number Bar -->
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; font-weight:700; color:#000000; margin-bottom:6px; padding:0 2px;">
            <div>Tanggal : <span id="docSpkDate" style="font-weight:800;">-</span></div>
            <div>No. SPK : <span id="docSpkNumber" style="font-weight:900; font-size:11px; letter-spacing:0.5px;">-</span></div>
          </div>

          <!-- SECTION 1: DATA PEMBELI VS FAKTUR STNK A/N (2 BORDERED BOXES) -->
          <div style="border:1.5px solid #000; display:grid; grid-template-columns:1fr 1fr; margin-bottom:0; font-size:9.5px; color:#000;">
            <!-- Left: Data Pembeli -->
            <div style="padding:6px 8px; border-right:1.5px solid #000;">
              <table style="width:100%; border-collapse:collapse; font-size:9.5px;">
                <tr>
                  <td style="width:85px; vertical-align:top; font-weight:700; padding:2px 0;">Nama Pembeli</td>
                  <td style="width:8px; vertical-align:top;">:</td>
                  <td style="font-weight:800; padding:2px 0; text-transform:uppercase;" id="docNamaCust">-</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Alamat</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0; line-height:1.25;" id="docAlamatCust">-</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Telp / HP</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0;" id="docHpCust">-</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Email</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0;" id="docEmailCust">-</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">NPWP / NIK</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0; font-weight:700;" id="docNikCust">-</td>
                </tr>
              </table>
            </div>

            <!-- Right: Faktur STNK a/n -->
            <div style="padding:6px 8px;">
              <table style="width:100%; border-collapse:collapse; font-size:9.5px;">
                <tr>
                  <td style="width:90px; vertical-align:top; font-weight:700; padding:2px 0;">Faktur STNK a/n</td>
                  <td style="width:8px; vertical-align:top;">:</td>
                  <td style="padding:2px 0;">
                    <!-- Character letter boxes grid -->
                    <div id="docStnkBoxes" style="display:flex; flex-wrap:wrap; gap:1.5px; margin-bottom:2px;">
                      <!-- Populated dynamically via JS -->
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Alamat</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0;" id="docStnkAlamat">S D A (Sama Dengan Alamat Pembeli)</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Telp</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0;" id="docStnkTelp">-</td>
                </tr>
                <tr>
                  <td style="vertical-align:top; font-weight:700; padding:2px 0;">Email</td>
                  <td style="vertical-align:top;">:</td>
                  <td style="padding:2px 0;" id="docStnkEmail">-</td>
                </tr>
                <tr>
                  <td colspan="3" style="padding-top:2px; font-size:8px; color:#555; font-style:italic;">
                    * Lampirkan Fotocopy Kartu NPWP / KTP
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <!-- SECTION 2: 3-COLUMN TABLE (SYARAT PEMBAYARAN | KETERANGAN | HARGA) -->
          <div style="border:1.5px solid #000; border-top:none; display:grid; grid-template-columns:35% 45% 20%; font-size:9.5px; color:#000;">
            <!-- Column 1: Syarat Pembayaran -->
            <div style="border-right:1.5px solid #000; display:flex; flex-direction:column;">
              <div style="background:#f1f5f9; padding:4px 6px; font-weight:900; text-align:center; border-bottom:1.5px solid #000; font-size:9.5px; text-transform:uppercase;">
                SYARAT PEMBAYARAN
              </div>
              <div style="padding:6px 8px; flex:1; display:flex; flex-direction:column; justify-content:space-between; font-size:9px;">
                <div>
                  <div style="font-weight:700; margin-bottom:2px;">
                    <span id="docChkCash" style="font-weight:900; font-family:monospace; margin-right:4px;">[ ]</span> TUNAI / TRADE IN via : .............
                  </div>
                  <div style="padding-left:14px; line-height:1.35; color:#333;">
                    <div>Uang Muka : Rp. <span id="docCashUangMuka">........................</span></div>
                    <div>Harga Mobil Bekas : Rp. ........................</div>
                    <div>Sisa : Rp. <span id="docCashSisa">........................</span></div>
                  </div>

                  <div style="font-weight:700; margin-top:6px; margin-bottom:2px;">
                    <span id="docChkKredit" style="font-weight:900; font-family:monospace; margin-right:4px;">[✔]</span> KREDIT
                  </div>
                  <div style="padding-left:14px; line-height:1.35; color:#333;">
                    <div>Via : <span id="docLeasingVia" style="font-weight:700; color:#000;">TAF / ACC / MTF</span></div>
                    <div>Jangka Waktu : <span id="docTenorThn">1 s/d 5</span> Tahun</div>
                    <div>Bunga : Sesuai Ketentuan Leasing</div>
                    <div>DP : Rp. <span id="docDpKredit">-</span></div>
                    <div>Angsuran / Bulan : Rp. <span id="docAngsuranKredit">-</span></div>
                    <div>Biaya Adm. : Include Paket</div>
                    <div>Biaya Asuransi : Comprehensive All Risk</div>
                  </div>
                </div>

                <div style="border-top:1px dashed #000; margin-top:6px; padding-top:4px;">
                  <div style="font-weight:800; font-size:9.5px;">Pembayaran I (Tanda Jadi) :</div>
                  <div style="font-weight:900; font-size:11.5px; color:#000; margin-top:1px;" id="docTandaJadiNominal">Rp 5.000.000,-</div>
                </div>
              </div>
            </div>

            <!-- Column 2: Keterangan -->
            <div style="border-right:1.5px solid #000; display:flex; flex-direction:column;">
              <div style="background:#f1f5f9; padding:4px 6px; font-weight:900; text-align:center; border-bottom:1.5px solid #000; font-size:9.5px; text-transform:uppercase;">
                KETERANGAN
              </div>
              <div style="padding:6px 8px; flex:1; display:flex; flex-direction:column; justify-content:space-between; font-size:9px;">
                <div>
                  <div style="font-weight:900; font-size:10px; margin-bottom:3px;">1 &nbsp; UNIT</div>
                  <div style="margin-bottom:2px;">
                    <span style="font-weight:800;">TYPE :</span>
                    <span id="docModelUnitVal" style="font-weight:900; text-transform:uppercase; color:#000;">TOYOTA ALL NEW AVANZA 1.5 G CVT</span>
                  </div>
                  <div style="margin-bottom:5px;">
                    <span style="font-weight:800;">WARNA :</span>
                    <span id="docWarnaUnitVal" style="font-weight:700;">Sesuai Permintaan Konsumen</span>
                  </div>

                  <div style="font-weight:800; text-decoration:underline; margin-bottom:2px;">PERLENGKAPAN TAMBAHAN :</div>
                  <ul style="margin:0 0 4px 0; padding-left:14px; font-size:8.5px; line-height:1.3; color:#333;">
                    <li>Kaca Film Solar Gard / Llumar Full Resmi</li>
                    <li>Karpet Bludru Toyota Original &amp; Tatakan Pelat Nomor</li>
                    <li>Alat Pemadam Api Ringan (APAR) &amp; Kotak P3K</li>
                    <li>Toolkit Lengkap, Dongkrak &amp; Segitiga Pengaman</li>
                    <li>Free Jasa Servis &amp; Suku Cadang s/d 50.000 KM (T-Care)</li>
                    <li>Layanan Telematika T-Intouch Terintegrasi</li>
                  </ul>
                  <div id="docTambahanBonusWrap" style="font-size:8.5px; font-weight:700; color:#000; display:none;">
                    Program / Bonus: <span id="docTambahanBonus">-</span>
                  </div>
                </div>

                <div style="margin:6px auto 2px auto; text-align:center;">
                  <div style="border:1.5px solid #c8102e; color:#c8102e; display:inline-block; padding:2px 8px; font-weight:900; font-size:9px; letter-spacing:0.8px;">
                    HARGA TIDAK MENGIKAT
                  </div>
                </div>
              </div>
            </div>

            <!-- Column 3: Harga -->
            <div style="display:flex; flex-direction:column;">
              <div style="background:#f1f5f9; padding:4px 6px; font-weight:900; text-align:center; border-bottom:1.5px solid #000; font-size:9.5px; text-transform:uppercase;">
                HARGA
              </div>
              <div style="padding:6px 8px; flex:1; display:flex; flex-direction:column; justify-content:space-between; font-size:9px; text-align:right;">
                <div>
                  <div style="color:#666; font-size:8px; margin-bottom:2px;">Harga OTR</div>
                  <div style="font-weight:800; font-size:10px; color:#000;">
                    Rp. <span id="docHargaOtrVal">-</span>
                  </div>
                </div>

                <div style="border-top:1.5px solid #000; padding-top:4px; margin-top:20px;">
                  <div style="font-size:8.5px; font-weight:800; color:#555; text-align:left;">TOTAL :</div>
                  <div style="font-size:11px; font-weight:900; color:#000; margin-top:1px;">
                    Rp. <span id="docTotalOtrVal">-</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SECTION 3: 4-GRID SPEC & DELIVERY INFO -->
          <div style="border:1.5px solid #000; border-top:none; display:grid; grid-template-columns:1fr 1fr; font-size:9px; color:#000;">
            <div style="padding:3px 8px; border-right:1.5px solid #000; border-bottom:1px solid #000;">
              <b>No. Rangka :</b> <span id="docNoRangka" style="color:#444;">TBA (Menunggu Alokasi ATPM)</span>
            </div>
            <div style="padding:3px 8px; border-bottom:1px solid #000;">
              <b>No. Mesin :</b> <span id="docNoMesin" style="color:#444;">TBA (Menunggu Alokasi ATPM)</span>
            </div>
            <div style="padding:3px 8px; border-right:1.5px solid #000;">
              <b>Sumber Prospek :</b> <span id="docSumberProspek" style="color:#444;">Showroom / Pameran / Digital SFT</span>
            </div>
            <div style="padding:3px 8px;">
              <b>Rencana Penyerahan :</b> <span id="docRencanaKirim" style="color:#444;">Bulan Berjalan (TBA)</span>
            </div>
          </div>

          <!-- SECTION 4: KETENTUAN (LEFT) & SIGNATURES (RIGHT) -->
          <div style="border:1.5px solid #000; border-top:none; display:grid; grid-template-columns:52% 48%; font-size:8px; color:#000;">
            <!-- Left: Ketentuan 1 s/d 7 -->
            <div style="padding:5px 8px; border-right:1.5px solid #000; line-height:1.2;">
              <div style="font-weight:900; font-size:8.5px; margin-bottom:2px; text-decoration:underline;">KETENTUAN :</div>
              <ol style="margin:0; padding-left:13px; font-size:7.5px; line-height:1.2; color:#222;">
                <li>Harga yang tercantum dalam Surat Pesanan ini tidak mengikat (sewaktu-waktu dapat berubah mengikuti perubahan BBN/Pajak atau regulasi ATPM sebelum Faktur terbit).</li>
                <li>Tanda jadi berlaku 3 (tiga) bulan sejak tanggal pesanan. Apabila pembelian tidak terealisasi dalam periode tersebut (kecuali indent), maka Uang Tanda Jadi dianggap hangus.</li>
                <li>Surat Pesanan ini dianggap SAH, apabila:
                  <div style="padding-left:6px;">
                    a. Telah ditandatangani oleh Pembeli<br>
                    b. Telah disetujui oleh Pejabat Cabang<br>
                    c. Uang Tanda Jadi / DP telah dilunasi oleh Pembeli
                  </div>
                </li>
                <li>Pembayaran dengan Cek / Bilyet Giro / Transfer hanya ditujukan ke Rekening Resmi PT TUNAS RIDEAN TBK dan dianggap SAH apabila telah efektif masuk ke rekening.</li>
                <li>Pembayaran Tunai dianggap SAH apabila telah diterbitkan Kwitansi Resmi oleh Kasir PT. Tunas Ridean Tbk.</li>
                <li>Bila pesanan batal secara sepihak oleh Pembeli, pengembalian uang tanda jadi dipotong biaya administrasi sesuai kebijakan dealer.</li>
                <li>Pembeli berkewajiban membayar tambahan biaya/pajak kendaraan dalam hal terdapat penambahan karena Pajak Progresif kepemilikan kendaraan bermotor.</li>
              </ol>
            </div>

            <!-- Right: 3 Signatures (Pembeli, Wiraniaga, Kacab/SPV) -->
            <div style="padding:5px 8px; display:flex; flex-direction:column; justify-content:space-between;">
              <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:4px; text-align:center;">
                <!-- Pembeli -->
                <div>
                  <div style="font-weight:900; font-size:8px; margin-bottom:2px;">PEMBELI</div>
                  <div style="height:48px; display:flex; align-items:center; justify-content:center;">
                    <img id="docSignatureImg" src="" alt="TTD Pembeli" style="max-height:44px; max-width:100%; object-fit:contain; display:none;">
                    <div id="docNoSignPlaceholder" style="font-size:7.5px; color:#999; font-style:italic;">(Tanda Tangan)</div>
                  </div>
                  <div style="border-top:1px solid #000; margin-top:2px; padding-top:2px;">
                    <b style="font-size:7.5px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="docSignerName">Bpk/Ibu Konsumen</b>
                    <span style="font-size:7px; color:#555;">Nama Jelas</span>
                  </div>
                </div>

                <!-- Wiraniaga -->
                <div>
                  <div style="font-weight:900; font-size:8px; margin-bottom:2px;">WIRANIAGA</div>
                  <div style="height:48px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                    <span style="font-size:7.5px; font-weight:800; color:#0d1b3e;">SALES FORCE</span>
                    <span style="font-size:6.5px; color:#666;" id="docSalesCode">Kode: TKC-SLS</span>
                  </div>
                  <div style="border-top:1px solid #000; margin-top:2px; padding-top:2px;">
                    <b style="font-size:7.5px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="docNamaSales">Wiraniaga Toyota</b>
                    <span style="font-size:7px; color:#555;">Nama Jelas</span>
                  </div>
                </div>

                <!-- Kacab / SPV -->
                <div style="position:relative;">
                  <div style="font-weight:900; font-size:8px; margin-bottom:2px;">KACAB / SPV</div>
                  <!-- Stempel Resmi Tunas Toyota -->
                  <div style="height:48px; display:flex; align-items:center; justify-content:center; position:relative;">
                    <div style="border:1.5px dashed #c8102e; border-radius:50%; width:44px; height:44px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#c8102e; transform:rotate(-10deg); opacity:0.9;">
                      <span style="font-size:5px; font-weight:900; line-height:1;">TUNAS TOYOTA</span>
                      <i class="fa-solid fa-stamp" style="font-size:7px; margin:1px 0;"></i>
                      <span style="font-size:5px; font-weight:800;">VERIFIED</span>
                    </div>
                  </div>
                  <div style="border-top:1px solid #000; margin-top:2px; padding-top:2px;">
                    <b style="font-size:7.5px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="docNamaKacab">Branch Management</b>
                    <span style="font-size:7px; color:#555;">Nama Jelas</span>
                  </div>
                </div>
              </div>

              <div style="margin-top:4px; border-top:1px dotted #ccc; padding-top:2px; display:flex; justify-content:space-between; font-size:6.5px; color:#666;">
                <span>(1) Wiraniaga &rarr; Adm. Cabang &rarr; Accounting</span>
                <span>(2) Wiraniaga &rarr; Adm. Cabang</span>
                <span>(3) Lembar Konsumen</span>
              </div>
            </div>
          </div>

          <!-- PERFORATION TEAR LINE (Guntingan Kuitansi) -->
          <div style="margin:6px 0 4px 0; display:flex; align-items:center; justify-content:space-between; font-size:7.5px; color:#475569;">
            <span style="font-size:9px; letter-spacing:1px;">✂ - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -</span>
          </div>

          <!-- SECTION 5: TANDA TERIMA UANG MUKA (SEMENTARA) / SLIP KUITANSI -->
          <div style="border:1.5px solid #000; padding:5px 8px; font-size:8.5px; color:#000;">
            <!-- Slip Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #000; padding-bottom:3px; margin-bottom:3px;">
              <div>
                <div style="font-size:8.5px; font-weight:800;">No. SPK : <span id="docSlipSpkNum">-</span></div>
                <div style="font-size:8px; color:#333;">Tanggal : <span id="docSlipDate">-</span></div>
              </div>
              <div style="text-align:center;">
                <div style="font-weight:900; font-size:10px; letter-spacing:0.5px; text-decoration:underline;">TANDA TERIMA UANG MUKA (SEMENTARA)</div>
                <div style="font-size:7.5px; color:#333;">Rek. BCA KCP No. 001 088 0700 a/n PT TUNAS RIDEAN TBK</div>
              </div>
              <div style="text-align:right;">
                <div style="font-weight:900; font-size:9px; color:#0d1b3e;">TUNAS TOYOTA</div>
                <div style="font-size:7.5px; color:#555;">Kiara Condong Bandung</div>
              </div>
            </div>

            <!-- Slip Body -->
            <table style="width:100%; border-collapse:collapse; font-size:8.5px; margin-bottom:3px;">
              <tr>
                <td style="width:110px; font-weight:700; padding:1.5px 0;">Sudah Terima Dari</td>
                <td style="width:8px;">:</td>
                <td style="font-weight:800; text-transform:uppercase;" id="docSlipNama">-</td>
              </tr>
              <tr>
                <td style="font-weight:700; padding:1.5px 0;">Uang Sejumlah</td>
                <td>:</td>
                <td style="font-weight:800;">
                  <span id="docSlipNominal">Rp 5.000.000,-</span>
                  <span style="font-weight:600; font-style:italic; color:#444; margin-left:6px;" id="docSlipTerbilang">( Lima Juta Rupiah )</span>
                </td>
              </tr>
              <tr>
                <td style="font-weight:700; padding:1.5px 0;">Untuk Pembayaran</td>
                <td>:</td>
                <td>
                  Uang Tanda Jadi / Booking Fee Pemesanan 1 (Satu) Unit Toyota <b id="docSlipModel">-</b>
                </td>
              </tr>
            </table>

            <!-- Slip Signatures -->
            <div style="display:flex; justify-content:space-between; align-items:flex-end; font-size:8px; margin-top:2px;">
              <div style="font-size:7px; color:#666; max-width:55%;">
                * Pembayaran SAH apabila telah efektif masuk di Rekening Resmi PT Tunas Ridean Tbk atau diterbitkan kwitansi resmi kasir dealer.
              </div>
              <div style="display:flex; gap:16px; text-align:center;">
                <div>
                  <div style="height:22px;"></div>
                  <div style="border-top:1px solid #000; padding-top:1px; width:90px;">
                    <span style="font-size:7.5px; font-weight:700;">Pembeli</span>
                  </div>
                </div>
                <div>
                  <div style="height:22px;"></div>
                  <div style="border-top:1px solid #000; padding-top:1px; width:110px;">
                    <span style="font-size:7.5px; font-weight:700;">Kasir PT Tunas Ridean</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer (Hidden on Print) -->
      <div class="no-print" style="padding:14px 22px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px; flex-wrap:wrap;">
        <button type="button" class="btn-outline" onclick="closeSpkDocumentModal()" style="padding:9px 16px; font-size:12.5px; border-radius:10px;">
          Tutup
        </button>
        <button type="button" class="btn-main" onclick="shareSpkDocumentWa()" style="background:#25D366; border:none; padding:9px 18px; font-size:12.5px; border-radius:10px; box-shadow:0 4px 12px rgba(37,211,102,0.3);">
          <i class="fa-brands fa-whatsapp"></i> Kirim Dokumen ke WA Customer
        </button>
        <button type="button" class="btn-main" onclick="printSpkDocument()" style="padding:9px 20px; font-size:12.5px; border-radius:10px; background:linear-gradient(135deg, #0d1b3e, #1e3a8a);">
          <i class="fa-solid fa-print"></i> Cetak / Unduh PDF
        </button>
      </div>
    </div>
  </div>

  <style>
    @media print {
      @page {
        size: A4 portrait;
        margin: 5mm 8mm;
      }
      body * {
        visibility: hidden !important;
      }
      #spkDocPrintArea, #spkDocPrintArea * {
        visibility: visible !important;
      }
      #spkDocPrintArea {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
        color: #000000 !important;
        font-family: Arial, Helvetica, 'Inter', sans-serif !important;
      }
      .no-print, .header-page, .input-mode-switcher-card, #inputBiasaContainer, #inputGameContainer, .spk-doc-header, .spk-doc-overlay {
        display: none !important;
      }
    }
    .spk-doc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
    }
    .spk-doc-sheet {
      background: #ffffff;
      width: 100%;
      max-width: 860px;
      max-height: 94vh;
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', Arial, sans-serif;
    }
    .spk-doc-header {
      padding: 14px 22px;
      background: #0d1b3e;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .spk-doc-body {
      padding: 16px;
      overflow-y: auto;
      background: #f8fafc;
      flex: 1;
    }
    .spk-paper {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
      font-family: Arial, Helvetica, 'Inter', sans-serif;
      color: #000000;
    }
    .stnk-char-box {
      width: 12px;
      height: 15px;
      border: 1px solid #000;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 8.5px;
      font-weight: 800;
      line-height: 1;
      text-transform: uppercase;
      background: #fff;
    }
  </style>

  <canvas id="ocrHiddenCanvas" style="display:none;"></canvas>

  <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"></script>
  <script src="../custom_alert.js"></script>
  <script src="../js/sales_superpowers.js?v={{ time() }}"></script>
  <script src="../js/spk.js?v=20260912_doc_print_wa"></script>
  <script src="../js/spk_arcade_game.js?v=1"></script>

  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>

