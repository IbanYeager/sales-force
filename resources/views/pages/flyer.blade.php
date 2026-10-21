<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Studio Poster &amp; Flyer Promo WA</title>
  
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
  <div class="mobile-app" style="max-width: 1280px; margin: 0 auto; min-height: 100vh; background: #f4f6fb; padding: 16px 18px 100px;">
    
    <!-- HEADER STUDIO BANNER -->
    <header class="flyer-header-banner">
      <div class="flyer-header-left">
        <a href="kalkulator.html" class="flyer-back-btn" title="Kembali ke Kalkulator">
          <i class="fa-solid fa-arrow-left"></i>
        </a>
        <div>
          <h1 class="flyer-header-title">
            <i class="fa-solid fa-wand-magic-sparkles" style="color:#a855f7;"></i>
            Studio Poster Promo WhatsApp
          </h1>
          <p class="flyer-header-subtitle">
            Hasilkan flyer visual promosi <strong>Ultra HD (1080p)</strong> otomatis dengan QR Code WhatsApp Anda dalam 1 klik.
          </p>
        </div>
      </div>

      <div class="flyer-header-actions">
        <button type="button" class="btn-flyer-download" onclick="downloadFlyerImage('png')" style="width: auto; padding: 10px 18px; font-size: 12.5px;">
          <i class="fa-solid fa-cloud-arrow-down"></i> Unduh Poster (PNG)
        </button>
        <button type="button" class="btn-flyer-wa" onclick="shareFlyerToWhatsApp()" style="width: auto; padding: 10px 18px; font-size: 12.5px;">
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
           KOLOM KANAN: STUDIO CONTROLS INSPECTOR
           ══════════════════════════════════════════════════════════ -->
      <section class="flyer-inspector-column">

        <!-- 1. PILIH MOBIL & HARGA OTR -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon red">
              <i class="fa-solid fa-car-side"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Model Kendaraan &amp; Harga OTR</h3>
              <div style="font-size:11.5px; color:#64748b;">Pilih unit Toyota dan sesuaikan harga acuan</div>
            </div>
          </div>

          <div style="margin-bottom: 14px;">
            <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
              Pilih Model Toyota
            </label>
            <select id="selectModelFlyer" onchange="onModelFlyerChange()" style="width: 100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; font-weight: 700; color: #0f172a; background: #ffffff; outline: none;">
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

          <div>
            <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
              Harga OTR (Rp)
            </label>
            <div style="position: relative;">
              <span style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); font-weight: 800; color: #94a3b8; font-size: 13px;">Rp</span>
              <input type="text" id="flyerHargaInput" value="263.500.000" oninput="formatInput(this); renderFlyerCanvas();" style="width: 100%; padding: 11px 14px 11px 40px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 14px; font-weight: 800; color: #0f172a; outline: none; box-sizing: border-box;">
            </div>
          </div>
        </div>

        <!-- 2. TEMA WARNA POSTER (LUXURY EXECUTIVE) -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon purple">
              <i class="fa-solid fa-palette"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Tema Visual &amp; Palet Warna</h3>
              <div style="font-size:11.5px; color:#64748b;">Pilih gaya visual estetik sesuai segmen pasar</div>
            </div>
          </div>

          <div class="flyer-theme-grid">
            <!-- Crimson Toyota Red -->
            <div class="theme-pill-box active" onclick="setFlyerTheme('crimson', this)">
              <div class="theme-preview-strip" style="background: linear-gradient(135deg, #7f1d1d, #c8102e, #ef4444);"></div>
              <span class="theme-pill-title">Toyota Red</span>
            </div>

            <!-- Executive Navy -->
            <div class="theme-pill-box" onclick="setFlyerTheme('navy', this)">
              <div class="theme-preview-strip" style="background: linear-gradient(135deg, #020617, #0f172a, #1e3a8a);"></div>
              <span class="theme-pill-title">Executive Navy</span>
            </div>

            <!-- Luxury Gold -->
            <div class="theme-pill-box" onclick="setFlyerTheme('gold', this)">
              <div class="theme-preview-strip" style="background: linear-gradient(135deg, #1c1917, #78350f, #d97706);"></div>
              <span class="theme-pill-title">Luxury Gold</span>
            </div>

            <!-- Eco Emerald -->
            <div class="theme-pill-box" onclick="setFlyerTheme('emerald', this)">
              <div class="theme-preview-strip" style="background: linear-gradient(135deg, #022c22, #065f46, #10b981);"></div>
              <span class="theme-pill-title">Eco Emerald</span>
            </div>
          </div>
        </div>

        <!-- 3. HEADLINE PROMO & FINANCIAL HIGHLIGHT -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon amber">
              <i class="fa-solid fa-bullhorn"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Headline Promosi &amp; Penawaran Finansial</h3>
              <div style="font-size:11.5px; color:#64748b;">Sorotan TDP dan angsuran yang paling memikat mata</div>
            </div>
          </div>

          <!-- Tag Headline -->
          <div style="margin-bottom: 14px;">
            <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
              Tagline Promo Headline
            </label>
            <input type="text" id="flyerHeadlineInput" value="SPECIAL PROMO BULAN INI" oninput="renderFlyerCanvas();" style="width: 100%; padding: 11px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13.5px; font-weight: 800; color: #0f172a; outline: none; box-sizing: border-box;">
            
            <!-- Quick Tag Buttons -->
            <div class="flyer-quick-tags">
              <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('SPECIAL PROMO BULAN INI')">Promo Bulan Ini</button>
              <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('FLASH SALE TOYOTA 2026')">Flash Sale 2026</button>
              <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('PROGRAM DP MINIM & BUNGA 0%')">DP Minim &amp; Bunga 0%</button>
              <button type="button" class="tag-btn-preset" onclick="applyHeadlinePreset('READY STOCK SIAP KIRIM')">Ready Stock Kirim Cepat</button>
            </div>
          </div>

          <!-- Dual Financial Highlight: TDP & Angsuran -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                TDP Sorotan
              </label>
              <input type="text" id="flyerTdpInput" value="DP Mulai Rp 52.700.000" oninput="renderFlyerCanvas();" style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13px; font-weight: 800; color: #c8102e; outline: none; box-sizing: border-box;">
            </div>

            <div>
              <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                Angsuran Sorotan
              </label>
              <input type="text" id="flyerCicilanInput" value="Rp 7.427.772 / Bln" oninput="renderFlyerCanvas();" style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13px; font-weight: 800; color: #0284c7; outline: none; box-sizing: border-box;">
            </div>
          </div>
        </div>

        <!-- 4. CHECKLIST BONUS & BENEFIT -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon green">
              <i class="fa-solid fa-gift"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Bonus &amp; Benefit Pembelian</h3>
              <div style="font-size:11.5px; color:#64748b;">Centang fasilitas resmi Toyota yang ditampilkan di poster</div>
            </div>
          </div>

          <div class="bonus-chips-grid">
            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusTcare" checked onchange="renderFlyerCanvas();">
              <span>Free Servis 3 Thn (T-Care)</span>
            </label>

            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusKaca" checked onchange="renderFlyerCanvas();">
              <span>Kaca Film Lumar Bergaransi</span>
            </label>

            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusKarpet" checked onchange="renderFlyerCanvas();">
              <span>Karpet Lembaran &amp; Talang Air</span>
            </label>

            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusApar" checked onchange="renderFlyerCanvas();">
              <span>APAR &amp; P3K Resmi Toyota</span>
            </label>

            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusDerek" checked onchange="renderFlyerCanvas();">
              <span>Layanan Darurat 24 Jam Astra World</span>
            </label>

            <label class="bonus-pill-check">
              <input type="checkbox" id="chkBonusGaransi" checked onchange="renderFlyerCanvas();">
              <span>Garansi Mesin &amp; Aki Resmi</span>
            </label>
          </div>
        </div>

        <!-- 5. PROFIL SALES & QR CODE OTOMATIS -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon blue">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Profil Sales &amp; QR WhatsApp Otomatis</h3>
              <div style="font-size:11.5px; color:#64748b;">QR Code akan otomatis dibuat dan langsung mengarahkan chat ke nomor Anda</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
            <div>
              <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                Nama / Gelar Sales
              </label>
              <input type="text" id="flyerSalesName" value="Official Sales Consultant" oninput="renderFlyerCanvas();" style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13px; font-weight: 700; color: #0f172a; outline: none; box-sizing: border-box;">
            </div>

            <div>
              <label style="font-size: 11.5px; font-weight: 800; color: #475569; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">
                No. WhatsApp Aktif
              </label>
              <input type="text" id="flyerSalesPhone" value="081234567890" oninput="renderFlyerCanvas();" style="width: 100%; padding: 11px 12px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-size: 13px; font-weight: 700; color: #0f172a; outline: none; box-sizing: border-box;">
            </div>
          </div>

          <!-- QR Live Preview Box -->
          <div class="qr-preview-box">
            <div class="qr-thumb-box" id="qrLiveThumbContainer">
              <!-- QR Image/Canvas injected here -->
            </div>
            <div style="font-size: 11.5px; color: #475569; line-height: 1.5;">
              <strong style="color:#0f172a; display:block; margin-bottom:2px;">Scan-to-Chat Terintegrasi</strong>
              Saat customer memindai QR code ini di medsos atau status, WhatsApp akan langsung terbuka dengan template pesan konsultasi otomatis.
            </div>
          </div>
        </div>

        <!-- 6. SALIN CAPTION PROMOSI MEDSOS -->
        <div class="flyer-section-card">
          <div class="flyer-card-header">
            <div class="flyer-card-icon red">
              <i class="fa-solid fa-copy"></i>
            </div>
            <div>
              <h3 class="flyer-card-title">Caption WhatsApp Status &amp; Medsos</h3>
              <div style="font-size:11.5px; color:#64748b;">Teks caption otomatis terisi sesuai data simulasi yang Anda buat</div>
            </div>
          </div>

          <pre class="caption-preview-box" id="liveCaptionPreviewText">Memuat caption...</pre>

          <button type="button" class="btn-flyer-wa" onclick="copyFlyerPromoCaption()" style="background: #0f172a; box-shadow: 0 4px 14px rgba(15, 23, 42, 0.25);">
            <i class="fa-solid fa-copy"></i> Salin Teks Caption ke Clipboard
          </button>
        </div>

      </section>
    </main>

  </div>

  <!-- QR Code Library & Studio Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script src="../js/flyer.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
