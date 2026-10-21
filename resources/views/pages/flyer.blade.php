<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
  <title>Sales App - Studio Poster &amp; Flyer Promo WA Pro</title>
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- App Styles -->
  <link rel="stylesheet" href="../css/style.css?v=20260908_v24" />
  <link rel="stylesheet" href="../css/animations-premium.css?v=20260908_v24">
  <link rel="stylesheet" href="../css/flyer.css?v={{ time() }}">
  
  <!-- Desktop Sidebar -->
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#090e18">
</head>

<body style="background: #f4f6fb; color: #0f172a; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div class="mobile-app flyer-studio-container">
    
    <!-- HEADER STUDIO BANNER -->
    <header class="flyer-header-banner">
      <div class="flyer-header-left">
        <a href="kalkulator.html" class="flyer-back-btn" title="Kembali ke Kalkulator">
          <i class="fa-solid fa-arrow-left"></i>
        </a>
        <div>
          <h1 class="flyer-header-title">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:#a855f7;"></i>
            Studio Poster Promo WhatsApp Pro
          </h1>
          <p class="flyer-header-subtitle">
            Kustomisasi total: Background bebas (warna, gradasi, foto sendiri), multi-mobil, teks lengkap &amp; foto profil sales.
          </p>
        </div>
      </div>

      <div class="flyer-header-actions">
        <button type="button" class="btn-flyer-download btn-header-action" onclick="downloadFlyerImage('png')">
          <i class="fa-solid fa-cloud-arrow-down"></i> Unduh Poster
        </button>
        <button type="button" class="btn-flyer-wa btn-header-action" onclick="shareFlyerToWhatsApp()">
          <i class="fa-brands fa-whatsapp"></i> Bagikan WA
        </button>
      </div>
    </header>

    <!-- 2-COLUMN STUDIO WORKSPACE -->
    <main class="flyer-studio-layout">

      <!-- ══════════════════════════════════════════════════════════
           KOLOM KIRI: ARTBOARD STAGE & CANVAS PREVIEW (STICKY)
           ══════════════════════════════════════════════════════════ -->
      <section class="flyer-artboard-column">
        <div class="flyer-artboard-card">
          
          <!-- Format Switcher: Story vs Feed -->
          <div class="flyer-ratio-switch">
            <button type="button" id="btnRatioStory" class="ratio-btn active" onclick="setFlyerRatio('9:16', this)">
              <i class="fa-solid fa-mobile-screen"></i> Story (9:16)
            </button>
            <button type="button" id="btnRatioSquare" class="ratio-btn" onclick="setFlyerRatio('1:1', this)">
              <i class="fa-solid fa-square"></i> Feed / Chat (1:1)
            </button>
          </div>

          <!-- Canvas Preview Image Element -->
          <div class="flyer-canvas-wrapper">
            <img id="flyerCanvasPreviewImg" class="flyer-preview-img" src="" alt="Pratinjau Poster Promo Toyota">
          </div>

          <!-- Live Resolution Badge -->
          <div class="flyer-res-info-tag" id="flyerResInfoTag">
            <i class="fa-solid fa-expand"></i> Resolusi Ekspor: <strong>1080 x 1920 px</strong> (Ultra HD Story)
          </div>

          <!-- Offscreen Canvas for High-DPI Rendering -->
          <canvas id="flyerCanvas" width="1080" height="1920" style="display:none;"></canvas>
          <div id="hiddenFlyerQrCode" style="display:none;"></div>
        </div>

        <!-- Action Download & Share Block -->
        <div class="flyer-main-actions">
          <button type="button" class="btn-flyer-download" onclick="downloadFlyerImage('png')">
            <i class="fa-solid fa-download"></i> Unduh Poster Gambar HD (.PNG)
          </button>
          <button type="button" class="btn-flyer-wa" onclick="shareFlyerToWhatsApp()">
            <i class="fa-brands fa-whatsapp"></i> Bagikan ke WhatsApp Status &amp; Chat
          </button>
        </div>

        <div style="font-size: 11px; color: #64748b; text-align: center; line-height: 1.5; padding: 0 10px;">
          <i class="fa-solid fa-shield-check" style="color:#10b981;"></i>
          Hasil render berstandar 1080p tajam dan jernih tanpa blur saat diunggah ke WhatsApp Status, Instagram Story, atau dikirim langsung ke calon pelanggan.
        </div>
      </section>

      <!-- ══════════════════════════════════════════════════════════
           KOLOM KANAN: STUDIO CONTROLS INSPECTOR (TABBED SUITE)
           ══════════════════════════════════════════════════════════ -->
      <section class="flyer-inspector-column">

        <!-- STUDIO NAVIGATION TABS -->
        <nav class="flyer-tabs-nav">
          <button type="button" class="flyer-tab-btn active" onclick="switchFlyerTab('tabLatarWarna', this)">
            <i class="fa-solid fa-palette"></i> Latar &amp; Tema
          </button>
          <button type="button" class="flyer-tab-btn" onclick="switchFlyerTab('tabMobilPromo', this)">
            <i class="fa-solid fa-car"></i> Mobil Promo (Multi)
          </button>
          <button type="button" class="flyer-tab-btn" onclick="switchFlyerTab('tabTeksLengkap', this)">
            <i class="fa-solid fa-font"></i> Kustom Teks
          </button>
          <button type="button" class="flyer-tab-btn" onclick="switchFlyerTab('tabProfilSales', this)">
            <i class="fa-solid fa-user-tie"></i> Foto &amp; Sales
          </button>
          <button type="button" class="flyer-tab-btn" onclick="switchFlyerTab('tabCaptionShare', this)">
            <i class="fa-solid fa-share-nodes"></i> Caption &amp; Share
          </button>
        </nav>

        <!-- ════════════════════════════════════════════════════════
             TAB 1: LATAR BELAKANG & TEMA WARNA
             ════════════════════════════════════════════════════════ -->
        <div id="tabLatarWarna" class="flyer-tab-pane active">
          
          <!-- Mode Background -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon purple">
                <i class="fa-solid fa-image"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Gaya &amp; Warna Latar Belakang</h3>
                <div class="flyer-card-sub">Pilih gradasi preset, warna hitam/putih, warna kustom, atau upload foto sendiri</div>
              </div>
            </div>

            <!-- Mode Selector Pills -->
            <div class="flyer-pill-selector" id="bgPillSelector">
              <button type="button" class="pill-opt-btn active" id="pillModePreset" onclick="setBgMode('preset', this)">Gradasi Preset</button>
              <button type="button" class="pill-opt-btn" onclick="setBgMode('black', this)">Hitam Pekat</button>
              <button type="button" class="pill-opt-btn" onclick="setBgMode('white', this)">Putih Bersih</button>
              <button type="button" class="pill-opt-btn" onclick="setBgMode('gradient', this)">Gradasi Custom</button>
              <button type="button" class="pill-opt-btn" onclick="setBgMode('solid', this)">Warna Solid</button>
              <button type="button" class="pill-opt-btn" id="pillModeImage" onclick="setBgMode('image', this)">Foto Sendiri</button>
            </div>

            <!-- SUB-BOX 1: PRESET GRADIENTS -->
            <div id="bgPresetBox">
              <div class="flyer-theme-grid">
                <div class="theme-pill-box active" onclick="setBgPresetTheme('crimson', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #7f1d1d, #c8102e, #ef4444);"></div>
                  <span class="theme-pill-title">Toyota Red</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('navy', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #020617, #0f172a, #1e3a8a);"></div>
                  <span class="theme-pill-title">Executive Navy</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('gold', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #1c1917, #78350f, #d97706);"></div>
                  <span class="theme-pill-title">Luxury Gold</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('emerald', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #022c22, #065f46, #10b981);"></div>
                  <span class="theme-pill-title">Eco Emerald</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('purple', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #0f051d, #2e1065, #7c3aed);"></div>
                  <span class="theme-pill-title">Cyber Purple</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('sunset', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #1c0a00, #7c2d12, #ea580c);"></div>
                  <span class="theme-pill-title">Sunset Orange</span>
                </div>
                <div class="theme-pill-box" onclick="setBgPresetTheme('pearl', this)">
                  <div class="theme-preview-strip" style="background: linear-gradient(135deg, #f1f5f9, #cbd5e1, #94a3b8);"></div>
                  <span class="theme-pill-title">Silver Frost</span>
                </div>
              </div>
            </div>

            <!-- SUB-BOX 2: SOLID COLOR PICKER -->
            <div id="bgSolidBox" style="display:none;">
              <div class="flyer-color-picker-row">
                <input type="color" id="inputBgSolid" class="color-input-circle" value="#090e18" oninput="onCustomColorChange()">
                <div>
                  <strong style="font-size:12.5px; display:block;">Pilih Warna Solid Latar Belakang</strong>
                  <span style="font-size:11px; color:#64748b;">Klik lingkaran warna di kiri untuk memilih palet warna bebas</span>
                </div>
              </div>
            </div>

            <!-- SUB-BOX 3: CUSTOM 2-COLOR GRADIENT -->
            <div id="bgGradBox" style="display:none;">
              <div class="flyer-grid-2">
                <div class="flyer-color-picker-row">
                  <input type="color" id="inputBgGrad1" class="color-input-circle" value="#090e18" oninput="onCustomColorChange()">
                  <div>
                    <span style="font-size:11px; font-weight:800; color:#64748b;">WARNA ATAS</span>
                    <div style="font-size:12px; font-weight:700;">Gradasi 1</div>
                  </div>
                </div>
                <div class="flyer-color-picker-row">
                  <input type="color" id="inputBgGrad2" class="color-input-circle" value="#7f1d1d" oninput="onCustomColorChange()">
                  <div>
                    <span style="font-size:11px; font-weight:800; color:#64748b;">WARNA BAWAH</span>
                    <div style="font-size:12px; font-weight:700;">Gradasi 2</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- SUB-BOX 4: UPLOAD CUSTOM BACKGROUND IMAGE -->
            <div id="bgImageBox" style="display:none;">
              <div class="flyer-upload-box" onclick="document.getElementById('bgFileInput').click()">
                <i class="fa-solid fa-cloud-arrow-up flyer-upload-icon"></i>
                <span class="flyer-upload-label">Klik untuk Upload Foto Background Sendiri</span>
                <span class="flyer-upload-sub">Format PNG, JPG, WEBP (Misal: Foto Showroom, Pemandangan, Event)</span>
                <input type="file" id="bgFileInput" accept="image/*" style="display:none;" onchange="handleBgImageUpload(this.files[0])">
              </div>

              <!-- Thumb preview row -->
              <div id="bgImageThumbRow" class="flyer-upload-thumb-row" style="display:none;">
                <img id="bgImageThumbImg" class="flyer-thumb-img" src="" alt="Thumb Background">
                <span style="font-size:11.5px; font-weight:700; color:#1e293b;">Foto Background Aktif</span>
                <button type="button" class="btn-remove-thumb" onclick="removeBgImage()">
                  <i class="fa-solid fa-trash"></i> Hapus Foto
                </button>
              </div>

              <!-- Overlay & Blur sliders -->
              <div class="flyer-slider-wrap">
                <div class="flyer-slider-header">
                  <span>Kegelapan Lapisan Overlay (Agar Teks Terbaca Jelas)</span>
                  <span id="bgOverlayVal">45%</span>
                </div>
                <input type="range" class="flyer-slider-input" min="0" max="90" value="45" oninput="studioState.bgOverlayAlpha = this.value / 100; document.getElementById('bgOverlayVal').textContent = this.value + '%'; renderFlyerCanvas();">
              </div>

              <div class="flyer-slider-wrap">
                <div class="flyer-slider-header">
                  <span>Efek Blur Background</span>
                  <span id="bgBlurVal">0px</span>
                </div>
                <input type="range" class="flyer-slider-input" min="0" max="15" value="0" oninput="studioState.bgBlur = parseInt(this.value, 10); document.getElementById('bgBlurVal').textContent = this.value + 'px'; renderFlyerCanvas();">
              </div>
            </div>

          </div>

          <!-- Card: Warna Aksen & Tone Teks -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon amber">
                <i class="fa-solid fa-wand-magic"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Warna Aksen Tema &amp; Kontras Teks</h3>
                <div class="flyer-card-sub">Atur warna highlight border, sorotan TDP, badge &amp; sesuaikan warna teks</div>
              </div>
            </div>

            <div class="flyer-grid-2">
              <div>
                <label class="flyer-field-label">Warna Aksen / Highlight</label>
                <div class="flyer-color-picker-row">
                  <input type="color" id="inputThemeAccent" class="color-input-circle" value="#c8102e" oninput="onCustomColorChange()">
                  <div>
                    <span style="font-size:11px; font-weight:800; color:#64748b;">AKSEN UTAMA</span>
                    <div style="font-size:12px; font-weight:700;">Warna Sorotan</div>
                  </div>
                </div>
              </div>

              <div>
                <label class="flyer-field-label">Mode Kontras Warna Teks</label>
                <div class="flyer-pill-selector" id="tonePillSelector" style="margin-bottom:0;">
                  <button type="button" class="pill-opt-btn active" id="btnToneLight" onclick="setTextColorTone('light', this)">
                    <i class="fa-solid fa-moon"></i> Teks Terang
                  </button>
                  <button type="button" class="pill-opt-btn" id="btnToneDark" onclick="setTextColorTone('dark', this)">
                    <i class="fa-solid fa-sun"></i> Teks Gelap
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ════════════════════════════════════════════════════════
             TAB 2: MOBIL PROMO & MULTI-MOBIL
             ════════════════════════════════════════════════════════ -->
        <div id="tabMobilPromo" class="flyer-tab-pane">
          
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon red">
                <i class="fa-solid fa-car-side"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Pengaturan Mobil Promo &amp; Multi-Unit</h3>
                <div class="flyer-card-sub">Tampilkan 1 mobil utama, atau tambahkan mobil kedua dan ketiga dalam 1 poster</div>
              </div>
            </div>

            <!-- Car Count Layout Selector -->
            <div class="flyer-field-group">
              <label class="flyer-field-label">Jumlah Mobil di Poster</label>
              <div class="flyer-pill-selector" id="carLayoutPills">
                <button type="button" class="pill-opt-btn active" onclick="setCarLayoutMode('1', this)">
                  <i class="fa-solid fa-car"></i> 1 Mobil (Tunggal)
                </button>
                <button type="button" class="pill-opt-btn" onclick="setCarLayoutMode('2', this)">
                  <i class="fa-solid fa-cars"></i> 2 Mobil (Duo Promo)
                </button>
                <button type="button" class="pill-opt-btn" onclick="setCarLayoutMode('3', this)">
                  <i class="fa-solid fa-layer-group"></i> 3 Mobil (Trio Showcase)
                </button>
              </div>
            </div>

            <!-- SLOT 1: MOBIL UTAMA -->
            <div class="car-slot-card active">
              <div class="car-slot-header">
                <span class="car-slot-badge">Mobil 1 (Utama)</span>
                <span style="font-size:11px; font-weight:700; color:#0369a1;">Posisi Depan / Utama</span>
              </div>

              <div class="flyer-field-group">
                <label class="flyer-field-label">Pilih Unit dari Katalog Toyota</label>
                <select id="selectCarSlot0" class="flyer-input-text" onchange="onCarSlotModelChange(0)">
                  <option value="263500000|AVANZA 1.5 G CVT">ALL NEW AVANZA 1.5 G CVT (Rp 263.500.000)</option>
                  <option value="304400000|VELOZ 1.5 Q CVT">ALL NEW VELOZ 1.5 Q CVT (Rp 304.400.000)</option>
                  <option value="175000000|CALYA 1.2 G MT">NEW CALYA 1.2 G MT (Rp 175.000.000)</option>
                  <option value="190000000|AGYA 1.2 G CVT">ALL NEW AGYA 1.2 G CVT (Rp 190.000.000)</option>
                  <option value="430400000|INNOVA ZENIX G CVT">KIJANG INNOVA ZENIX 2.0 G CVT (Rp 430.400.000)</option>
                  <option value="477600000|ZENIX HYBRID G CVT">INNOVA ZENIX 2.0 HYBRID G (Rp 477.600.000)</option>
                  <option value="258300000|RAIZE 1.0T G CVT">RAIZE 1.0T G CVT (Rp 258.300.000)</option>
                  <option value="284400000|RUSH 1.5 S AT GR SPORT">RUSH 1.5 S AT GR SPORT (Rp 284.400.000)</option>
                  <option value="355000000|YARIS CROSS 1.5 G CVT">YARIS CROSS 1.5 G CVT (Rp 355.000.000)</option>
                  <option value="573700000|FORTUNER 2.8 VRZ 4X2">NEW FORTUNER 2.8 VRZ (Rp 573.700.000)</option>
                  <option value="1407000000|ALPHARD 2.5 G HYBRID">ALL NEW ALPHARD 2.5 G HEV (Rp 1.407.000.000)</option>
                </select>
              </div>

              <!-- Upload Custom Car 1 -->
              <div class="flyer-field-group">
                <label class="flyer-field-label">Atau Upload Foto Mobil Sendiri (Transparan / Galeri)</label>
                <div class="flyer-upload-box" style="padding:14px;" onclick="document.getElementById('carSlot0FileInput').click()">
                  <span style="font-size:11.5px; font-weight:800; color:#7c3aed;">
                    <i class="fa-solid fa-upload"></i> Upload Foto Mobil 1
                  </span>
                  <input type="file" id="carSlot0FileInput" accept="image/*" style="display:none;" onchange="handleCarSlotUpload(0, this.files[0])">
                </div>
                <div id="carSlot0ThumbRow" class="flyer-upload-thumb-row" style="display:none;">
                  <img id="carSlot0ThumbImg" class="flyer-thumb-img" src="" alt="Thumb Car 1">
                  <span style="font-size:11px; font-weight:700;">Foto Custom Mobil 1 Aktif</span>
                  <button type="button" class="btn-remove-thumb" onclick="removeCarSlotUpload(0)">
                    <i class="fa-solid fa-trash"></i> Reset
                  </button>
                </div>
              </div>

              <!-- Scale & Position Sliders 1 -->
              <div class="flyer-grid-sliders" style="margin-top:10px;">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Kiri/Kanan</span>
                    <span id="carSlot0OffsetXBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot0OffsetXInput" class="flyer-slider-input" min="-200" max="200" step="5" value="0" oninput="updateCarSlotOffsetX(0, this.value)">
                </div>
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Atas/Bawah</span>
                    <span id="carSlot0OffsetYBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot0OffsetYInput" class="flyer-slider-input" min="-150" max="150" step="5" value="0" oninput="updateCarSlotOffsetY(0, this.value)">
                </div>
              </div>
              <div class="flyer-scale-reset-wrap">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Ukuran Skala Mobil 1</span>
                    <span id="carSlot0ScaleBadge">100%</span>
                  </div>
                  <input type="range" id="carSlot0ScaleInput" class="flyer-slider-input" min="0.6" max="1.4" step="0.05" value="1.0" oninput="updateCarSlotScale(0, this.value)">
                </div>
                <button type="button" class="btn-reset-pos" onclick="resetCarSlotPosition(0)">
                  <i class="fa-solid fa-arrows-rotate"></i> Reset Posisi
                </button>
              </div>
            </div>

            <!-- SLOT 2: MOBIL KEDUA (DUO) -->
            <div id="carSlot2Box" class="car-slot-card" style="display:none;">
              <div class="car-slot-header">
                <span class="car-slot-badge" style="background:#fef3c7; color:#b45309;">Mobil 2 (Pendamping)</span>
                <span style="font-size:11px; font-weight:700; color:#b45309;">Posisi Kanan</span>
              </div>

              <div class="flyer-field-group">
                <label class="flyer-field-label">Pilih Unit Mobil 2</label>
                <select id="selectCarSlot1" class="flyer-input-text" onchange="onCarSlotModelChange(1)">
                  <option value="304400000|VELOZ 1.5 Q CVT" selected>ALL NEW VELOZ 1.5 Q CVT (Rp 304.400.000)</option>
                  <option value="263500000|AVANZA 1.5 G CVT">ALL NEW AVANZA 1.5 G CVT (Rp 263.500.000)</option>
                  <option value="430400000|INNOVA ZENIX G CVT">KIJANG INNOVA ZENIX 2.0 G CVT (Rp 430.400.000)</option>
                  <option value="573700000|FORTUNER 2.8 VRZ 4X2">NEW FORTUNER 2.8 VRZ (Rp 573.700.000)</option>
                  <option value="284400000|RUSH 1.5 S AT GR SPORT">RUSH 1.5 S AT GR SPORT (Rp 284.400.000)</option>
                  <option value="190000000|AGYA 1.2 G CVT">ALL NEW AGYA 1.2 G CVT (Rp 190.000.000)</option>
                </select>
              </div>

              <!-- Upload Custom Car 2 -->
              <div class="flyer-field-group">
                <label class="flyer-field-label">Atau Upload Foto Mobil 2 Sendiri</label>
                <div class="flyer-upload-box" style="padding:14px;" onclick="document.getElementById('carSlot1FileInput').click()">
                  <span style="font-size:11.5px; font-weight:800; color:#7c3aed;">
                    <i class="fa-solid fa-upload"></i> Upload Foto Mobil 2
                  </span>
                  <input type="file" id="carSlot1FileInput" accept="image/*" style="display:none;" onchange="handleCarSlotUpload(1, this.files[0])">
                </div>
                <div id="carSlot1ThumbRow" class="flyer-upload-thumb-row" style="display:none;">
                  <img id="carSlot1ThumbImg" class="flyer-thumb-img" src="" alt="Thumb Car 2">
                  <span style="font-size:11px; font-weight:700;">Foto Custom Mobil 2 Aktif</span>
                  <button type="button" class="btn-remove-thumb" onclick="removeCarSlotUpload(1)">
                    <i class="fa-solid fa-trash"></i> Reset
                  </button>
                </div>
              </div>

              <!-- Scale & Position Sliders 2 -->
              <div class="flyer-grid-sliders" style="margin-top:10px;">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Kiri/Kanan</span>
                    <span id="carSlot1OffsetXBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot1OffsetXInput" class="flyer-slider-input" min="-200" max="200" step="5" value="0" oninput="updateCarSlotOffsetX(1, this.value)">
                </div>
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Atas/Bawah</span>
                    <span id="carSlot1OffsetYBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot1OffsetYInput" class="flyer-slider-input" min="-150" max="150" step="5" value="0" oninput="updateCarSlotOffsetY(1, this.value)">
                </div>
              </div>
              <div class="flyer-scale-reset-wrap">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Ukuran Skala Mobil 2</span>
                    <span id="carSlot1ScaleBadge">90%</span>
                  </div>
                  <input type="range" id="carSlot1ScaleInput" class="flyer-slider-input" min="0.6" max="1.4" step="0.05" value="0.9" oninput="updateCarSlotScale(1, this.value)">
                </div>
                <button type="button" class="btn-reset-pos" onclick="resetCarSlotPosition(1)">
                  <i class="fa-solid fa-arrows-rotate"></i> Reset Posisi
                </button>
              </div>
            </div>

            <!-- SLOT 3: MOBIL KETIGA (TRIO) -->
            <div id="carSlot3Box" class="car-slot-card" style="display:none;">
              <div class="car-slot-header">
                <span class="car-slot-badge" style="background:#dcfce7; color:#15803d;">Mobil 3 (Pendamping)</span>
                <span style="font-size:11px; font-weight:700; color:#15803d;">Posisi Kiri</span>
              </div>

              <div class="flyer-field-group">
                <label class="flyer-field-label">Pilih Unit Mobil 3</label>
                <select id="selectCarSlot2" class="flyer-input-text" onchange="onCarSlotModelChange(2)">
                  <option value="430400000|INNOVA ZENIX G CVT" selected>KIJANG INNOVA ZENIX 2.0 G CVT (Rp 430.400.000)</option>
                  <option value="263500000|AVANZA 1.5 G CVT">ALL NEW AVANZA 1.5 G CVT (Rp 263.500.000)</option>
                  <option value="304400000|VELOZ 1.5 Q CVT">ALL NEW VELOZ 1.5 Q CVT (Rp 304.400.000)</option>
                  <option value="573700000|FORTUNER 2.8 VRZ 4X2">NEW FORTUNER 2.8 VRZ (Rp 573.700.000)</option>
                  <option value="355000000|YARIS CROSS 1.5 G CVT">YARIS CROSS 1.5 G CVT (Rp 355.000.000)</option>
                </select>
              </div>

              <!-- Upload Custom Car 3 -->
              <div class="flyer-field-group">
                <label class="flyer-field-label">Atau Upload Foto Mobil 3 Sendiri</label>
                <div class="flyer-upload-box" style="padding:14px;" onclick="document.getElementById('carSlot2FileInput').click()">
                  <span style="font-size:11.5px; font-weight:800; color:#7c3aed;">
                    <i class="fa-solid fa-upload"></i> Upload Foto Mobil 3
                  </span>
                  <input type="file" id="carSlot2FileInput" accept="image/*" style="display:none;" onchange="handleCarSlotUpload(2, this.files[0])">
                </div>
                <div id="carSlot2ThumbRow" class="flyer-upload-thumb-row" style="display:none;">
                  <img id="carSlot2ThumbImg" class="flyer-thumb-img" src="" alt="Thumb Car 3">
                  <span style="font-size:11px; font-weight:700;">Foto Custom Mobil 3 Aktif</span>
                  <button type="button" class="btn-remove-thumb" onclick="removeCarSlotUpload(2)">
                    <i class="fa-solid fa-trash"></i> Reset
                  </button>
                </div>
              </div>

              <!-- Scale & Position Sliders 3 -->
              <div class="flyer-grid-sliders" style="margin-top:10px;">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Kiri/Kanan</span>
                    <span id="carSlot2OffsetXBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot2OffsetXInput" class="flyer-slider-input" min="-200" max="200" step="5" value="0" oninput="updateCarSlotOffsetX(2, this.value)">
                </div>
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Geser Atas/Bawah</span>
                    <span id="carSlot2OffsetYBadge">0px</span>
                  </div>
                  <input type="range" id="carSlot2OffsetYInput" class="flyer-slider-input" min="-150" max="150" step="5" value="0" oninput="updateCarSlotOffsetY(2, this.value)">
                </div>
              </div>
              <div class="flyer-scale-reset-wrap">
                <div class="flyer-slider-wrap" style="margin-top:0;">
                  <div class="flyer-slider-header">
                    <span>Ukuran Skala Mobil 3</span>
                    <span id="carSlot2ScaleBadge">85%</span>
                  </div>
                  <input type="range" id="carSlot2ScaleInput" class="flyer-slider-input" min="0.6" max="1.4" step="0.05" value="0.85" oninput="updateCarSlotScale(2, this.value)">
                </div>
                <button type="button" class="btn-reset-pos" onclick="resetCarSlotPosition(2)">
                  <i class="fa-solid fa-arrows-rotate"></i> Reset Posisi
                </button>
              </div>
            </div>

          </div>

        </div>

        <!-- ════════════════════════════════════════════════════════
             TAB 3: KUSTOMISASI TEKS LENGKAP
             ════════════════════════════════════════════════════════ -->
        <div id="tabTeksLengkap" class="flyer-tab-pane">
          
          <!-- 1. Header & Branding -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon blue">
                <i class="fa-solid fa-building"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Teks Header Dealer &amp; Branding Atas</h3>
                <div class="flyer-card-sub">Nama dealer, wilayah cabang, dan badge pojok kanan atas</div>
              </div>
            </div>

            <div class="flyer-grid-2" style="margin-bottom:12px;">
              <div>
                <label class="flyer-field-label">Nama Dealer Utama</label>
                <input type="text" id="flyerDealerName" class="flyer-input-text" value="TUNAS TOYOTA" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Kota / Wilayah Cabang</label>
                <input type="text" id="flyerDealerCity" class="flyer-input-text" value="BANDUNG · JAWA BARAT" oninput="renderFlyerCanvas()">
              </div>
            </div>

            <div>
              <label class="flyer-field-label">Badge Pojok Kanan Atas</label>
              <input type="text" id="flyerBadgeTop" class="flyer-input-text" value="DEALER RESMI TOYOTA" oninput="renderFlyerCanvas()">
            </div>
          </div>

          <!-- 2. Headline Promo & Judul Mobil -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon amber">
                <i class="fa-solid fa-bullhorn"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Teks Headline Promosi &amp; Judul Mobil</h3>
                <div class="flyer-card-sub">Pita tagline promosi dan teks nama mobil yang tampil di poster</div>
              </div>
            </div>

            <div class="flyer-field-group">
              <label class="flyer-field-label">Pita Headline Promo</label>
              <input type="text" id="flyerHeadlineInput" class="flyer-input-text" value="SPECIAL PROMO BULAN INI" oninput="renderFlyerCanvas()">
              <div class="flyer-quick-tags">
                <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('SPECIAL PROMO BULAN INI')">Promo Bulan Ini</button>
                <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('FLASH SALE TOYOTA 2026')">Flash Sale 2026</button>
                <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('PROGRAM DP MINIM & BUNGA 0%')">DP Minim &amp; Bunga 0%</button>
                <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('READY STOCK SIAP KIRIM')">Ready Stock Siap Kirim</button>
              </div>
            </div>

            <div class="flyer-grid-2">
              <div>
                <label class="flyer-field-label">Judul Teks Mobil di Poster</label>
                <input type="text" id="flyerCarTitleInput" class="flyer-input-text" value="ALL NEW AVANZA 1.5 G CVT" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Sub-Judul / Harga Acuan OTR</label>
                <input type="text" id="flyerCarSubInput" class="flyer-input-text" value="HARGA OTR: Rp 263.500.000" oninput="renderFlyerCanvas()">
              </div>
            </div>
          </div>

          <!-- 3. Skema Finansial TDP & Angsuran -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon green">
                <i class="fa-solid fa-money-bill-wave"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Teks Sorotan Finansial (TDP &amp; Angsuran)</h3>
                <div class="flyer-card-sub">Sesuaikan label dan angka penawaran cicilan kredit</div>
              </div>
            </div>

            <div class="flyer-grid-2" style="margin-bottom:12px;">
              <div>
                <label class="flyer-field-label">Label Finansial Kiri</label>
                <input type="text" id="flyerFinLabelLeft" class="flyer-input-text" value="TOTAL UANG MUKA / TDP" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Isi Nilai TDP Sorotan</label>
                <input type="text" id="flyerTdpInput" class="flyer-input-text" value="DP Mulai Rp 52.700.000" oninput="renderFlyerCanvas()" style="color:#c8102e; font-weight:800;">
              </div>
            </div>

            <div class="flyer-grid-2" style="margin-bottom:12px;">
              <div>
                <label class="flyer-field-label">Label Finansial Kanan</label>
                <input type="text" id="flyerFinLabelRight" class="flyer-input-text" value="ANGSURAN BULANAN" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Isi Nilai Angsuran Sorotan</label>
                <input type="text" id="flyerCicilanInput" class="flyer-input-text" value="Rp 7.427.772 / Bln" oninput="renderFlyerCanvas()" style="color:#0284c7; font-weight:800;">
              </div>
            </div>

            <div>
              <label class="flyer-field-label">Sub-Keterangan Finansial (Bawah Kotak)</label>
              <input type="text" id="flyerFinSubtext" class="flyer-input-text" value="• BISA TUKAR TAMBAH SEMUA MERK  • PROSES CEPAT & DIBANTU APPROVE" oninput="renderFlyerCanvas()">
            </div>
          </div>

          <!-- 4. Benefit, Bonus & Catatan Kaki -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon red">
                <i class="fa-solid fa-gift"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Teks Bonus, Fasilitas &amp; Catatan Kaki</h3>
                <div class="flyer-card-sub">Tuliskan keuntungan pemesanan (1 baris per poin, maks 5 baris di Story)</div>
              </div>
            </div>

            <div class="flyer-field-group">
              <label class="flyer-field-label">Judul Bagian Bonus</label>
              <input type="text" id="flyerBonusHeading" class="flyer-input-text" value="BONUS & KEUNTUNGAN SPESIAL PEMBELIAN:" oninput="renderFlyerCanvas()">
            </div>

            <div class="flyer-field-group">
              <label class="flyer-field-label">Daftar Poin Bonus (Ketik 1 baris per poin)</label>
              <textarea id="flyerBonusTextarea" class="flyer-input-textarea" oninput="renderFlyerCanvas()">✓ Free Jasa Servis &amp; Oli s/d 3 Thn (T-Care)
✓ Kaca Film Lumar Bergaransi Resmi
✓ Karpet Lembaran &amp; Talang Air Original
✓ APAR &amp; Kotak P3K Resmi Toyota
✓ Layanan Darurat Derek 24 Jam (Astra World)</textarea>
            </div>

            <div>
              <label class="flyer-field-label">Catatan Kaki (Footnote)</label>
              <input type="text" id="flyerFootnote" class="flyer-input-text" value="*Syarat & Ketentuan Berlaku. Unit Terbatas." oninput="renderFlyerCanvas()">
            </div>
          </div>

        </div>

        <!-- ════════════════════════════════════════════════════════
             TAB 4: FOTO & PROFIL SALES
             ════════════════════════════════════════════════════════ -->
        <div id="tabProfilSales" class="flyer-tab-pane">
          
          <!-- Upload Foto Sales Sendiri -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon purple">
                <i class="fa-solid fa-camera"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Foto Profil Diri Sendiri (Avatar Sales)</h3>
                <div class="flyer-card-sub">Pasang foto wajah / formal Anda di poster promosi untuk meningkatkan trust pembeli</div>
              </div>
            </div>

            <div class="sales-avatar-upload-wrap">
              <img id="salesAvatarPreviewImg" class="sales-avatar-preview" src="" alt="Foto Sales" style="display:none;">
              <div id="salesAvatarFallback" class="sales-avatar-fallback">
                <i class="fa-solid fa-user"></i>
              </div>

              <div>
                <strong style="font-size:13px; color:#0f172a; display:block; margin-bottom:4px;">Foto Profil Resmi Sales</strong>
                <p style="font-size:11.5px; color:#64748b; margin:0 0 8px;">Foto akan dirender dalam lingkaran elegan di samping nama &amp; kontak WA Anda.</p>
                
                <div style="display:flex; gap:8px;">
                  <button type="button" class="btn" style="background:#7c3aed; color:#fff; border:none; border-radius:10px; padding:7px 14px; font-size:11.5px; font-weight:800; cursor:pointer;" onclick="document.getElementById('salesPhotoInput').click()">
                    <i class="fa-solid fa-upload"></i> Upload Foto Anda
                  </button>
                  <button type="button" id="btnRemoveSalesPhoto" class="btn-remove-thumb" style="display:none;" onclick="removeSalesPhoto()">
                    <i class="fa-solid fa-trash"></i> Hapus Foto
                  </button>
                </div>
                <input type="file" id="salesPhotoInput" accept="image/*" style="display:none;" onchange="handleSalesPhotoUpload(this.files[0])">
              </div>
            </div>
          </div>

          <!-- Detail Kontak Sales -->
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon blue">
                <i class="fa-solid fa-id-card"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Informasi &amp; Kontak WhatsApp Sales</h3>
                <div class="flyer-card-sub">Nama, jabatan, nomor WA, dan QR Code scan-to-chat otomatis</div>
              </div>
            </div>

            <div class="flyer-grid-2" style="margin-bottom:12px;">
              <div>
                <label class="flyer-field-label">Nama Lengkap Sales</label>
                <input type="text" id="flyerSalesName" class="flyer-input-text" value="Official Sales Consultant" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Gelar / Jabatan</label>
                <input type="text" id="flyerSalesRole" class="flyer-input-text" value="Executive Sales Consultant" oninput="renderFlyerCanvas()">
              </div>
            </div>

            <div class="flyer-grid-2" style="margin-bottom:12px;">
              <div>
                <label class="flyer-field-label">Dealer / Cabang</label>
                <input type="text" id="flyerSalesBranch" class="flyer-input-text" value="Tunas Toyota Kiara Condong" oninput="renderFlyerCanvas()">
              </div>
              <div>
                <label class="flyer-field-label">Nomor WhatsApp Aktif</label>
                <input type="text" id="flyerSalesPhone" class="flyer-input-text" value="081234567890" oninput="renderFlyerCanvas()">
              </div>
            </div>

            <!-- QR Preview Live Box -->
            <div class="qr-preview-box">
              <div class="qr-thumb-box" id="qrLiveThumbContainer">
                <!-- QR Canvas injected here -->
              </div>
              <div style="font-size:11.5px; color:#475569; line-height:1.5;">
                <strong style="color:#0f172a; display:block; margin-bottom:2px;">Scan-to-Chat Terintegrasi</strong>
                QR Code di pojok poster akan langsung mengarahkan pelanggan membuka chat WhatsApp ke nomor Anda dengan template konsultasi otomatis.
              </div>
            </div>
          </div>

        </div>

        <!-- ════════════════════════════════════════════════════════
             TAB 5: CAPTION & SHARE
             ════════════════════════════════════════════════════════ -->
        <div id="tabCaptionShare" class="flyer-tab-pane">
          
          <div class="flyer-section-card">
            <div class="flyer-card-header">
              <div class="flyer-card-icon green">
                <i class="fa-solid fa-comment-dots"></i>
              </div>
              <div>
                <h3 class="flyer-card-title">Caption Promosi Siap Share</h3>
                <div class="flyer-card-sub">Teks caption WhatsApp &amp; Medsos otomatis tersinkronisasi dengan perubahan flyer Anda</div>
              </div>
            </div>

            <pre class="caption-preview-box" id="liveCaptionPreviewText">Memuat caption...</pre>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <button type="button" class="btn-flyer-wa" onclick="copyFlyerPromoCaption()" style="background:#0f172a; box-shadow:0 4px 14px rgba(15,23,42,0.25);">
                <i class="fa-solid fa-copy"></i> Salin Teks Caption ke Clipboard
              </button>
              <button type="button" class="btn-flyer-download" onclick="downloadFlyerImage('png')">
                <i class="fa-solid fa-cloud-arrow-down"></i> Unduh Poster Ultra-HD (.PNG)
              </button>
              <button type="button" class="btn-flyer-wa" onclick="shareFlyerToWhatsApp()">
                <i class="fa-brands fa-whatsapp"></i> Bagikan Langsung ke WhatsApp
              </button>
            </div>
          </div>

        </div>

      </section>
    </main>

    <!-- FLOATING MOBILE BOTTOM ACTION BAR -->
    <div class="flyer-mobile-bottom-bar">
      <button type="button" class="btn-mobile-action wa" onclick="shareFlyerToWhatsApp()">
        <i class="fa-brands fa-whatsapp"></i> Bagikan WA
      </button>
      <button type="button" class="btn-mobile-action download" onclick="downloadFlyerImage('png')">
        <i class="fa-solid fa-cloud-arrow-down"></i> Unduh HD
      </button>
    </div>

  </div>

  <!-- QR Code Library & Studio Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="../js/flyer.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
