<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - E-Catalog</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v=20260908_v24" />
  <link rel="stylesheet" href="../css/animations-premium.css?v=20260908_v24">
  <link rel="stylesheet" href="../css/brosur.css?v=20260908_v24">
  <script src="../js/sidebar_desktop.js?v=20260908_ecatalog"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px; margin: 0 auto; min-height: 100vh; background: #f8fafc; padding-bottom: 110px;">
    <header class="header-page">
      <a href="../index.html" title="Kembali ke Dashboard"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>E-Catalog</h2>
      <span class="header-pill-badge" style="font-size:11px; font-weight:700; background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.2); padding:4px 10px; border-radius:20px; color:#fff; display:flex; align-items:center; gap:5px;">
        <i class="fa-solid fa-book-open" style="color:#ff4d6d;"></i> Brosur &amp; Spek
      </span>
    </header>

    <div class="container" style="margin-top:18px;">

      <!-- KATALOG & BROSUR MOBIL TOYOTA TERPADU (1 HALAMAN) -->
      <div id="contentLibrary">
        <div class="form-group" style="margin-bottom:12px;">
          <input class="form-control" type="text" id="searchInput" placeholder="Cari mobil (misal: Innova, Fortuner, Agya)..."
            oninput="renderLibrary()" />
        </div>

        <!-- CATEGORY FILTER CHIPS -->
        <div id="categoryFilters"
          style="display:flex; overflow-x:auto; gap:8px; padding-bottom:10px; margin-bottom:10px; scrollbar-width:none; -ms-overflow-style:none;">
          <style>
            #categoryFilters::-webkit-scrollbar {
              display: none;
            }

            .cat-btn {
              padding: 6px 14px;
              border-radius: 20px;
              background: #fff;
              border: 1px solid var(--border-color);
              font-size: 12px;
              font-weight: 600;
              color: var(--text-muted);
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .cat-btn.active {
              background: var(--primary-red);
              color: #fff;
              border-color: var(--primary-red);
              box-shadow: 0 4px 10px rgba(212, 22, 60, 0.3);
            }

            .elib-unified-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 16px;
            }
            @media (max-width: 768px) {
              .elib-unified-grid {
                grid-template-columns: 1fr 1fr;
                gap: 10px;
              }
            }
            @media (max-width: 360px) {
              .elib-unified-grid {
                grid-template-columns: 1fr;
                gap: 10px;
              }
            }
          </style>
          <button class="cat-btn active" onclick="filterCategory('All', this)">Semua</button>
          <button class="cat-btn" onclick="filterCategory('MPV', this)">MPV</button>
          <button class="cat-btn" onclick="filterCategory('SUV', this)">SUV</button>
          <button class="cat-btn" onclick="filterCategory('Hatchback', this)">Hatchback</button>
          <button class="cat-btn" onclick="filterCategory('Sedan', this)">Sedan</button>
          <button class="cat-btn" onclick="filterCategory('Commercial', this)">Commercial</button>
        </div>

        <div id="libGrid" class="elib-unified-grid">
          <!-- Rendered via elibrary.js -->
        </div>
      </div>

    </div>

    <!-- ═══ FLOATING BOTTOM NAVIGATION (MOBILE) ═══ -->
    <nav class="bottom-nav">
      <a href="../index.html" class="nav-item"><i class="fa-solid fa-house"></i><span class="nav-text">Home</span></a>
      <a href="pricelist.html" class="nav-item"><i class="fa-solid fa-clipboard-list"></i><span class="nav-text">Harga</span></a>
      <a href="input.html" class="nav-item center-btn">
        <div class="center-btn-inner">
          <i class="fa-solid fa-camera"></i>
        </div>
      </a>
      <a href="elibrary.html" class="nav-item active"><i class="fa-solid fa-book-open"></i><span class="nav-text">Katalog</span></a>
      <a href="profil.html" class="nav-item"><i class="fa-solid fa-user"></i><span class="nav-text">Profil</span></a>
    </nav>
  </div>

  <style>
    /* Premium Glassmorphism UI for E-Catalog */
    .mobile-app {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    }

    .elib-card-actions {
      display: grid;
      grid-template-columns: 1fr 1fr 38px;
      gap: 6px;
      align-items: center;
      margin-top: 8px;
    }

    .btn-card-action {
      height: 36px;
      border: none;
      border-radius: 10px;
      font-size: 11.5px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-card-action:active {
      transform: scale(0.96);
    }

    .btn-card-detail {
      background: linear-gradient(135deg, var(--primary-blue), #003d99);
      color: #ffffff;
      box-shadow: 0 3px 8px rgba(0, 82, 204, 0.25);
    }

    .btn-card-brosur {
      background: linear-gradient(135deg, #c8102e 0%, #99001c 100%);
      color: #ffffff;
      box-shadow: 0 3px 8px rgba(200, 16, 46, 0.25);
    }

    .btn-card-wa {
      width: 38px;
      height: 36px;
      padding: 0;
      background: linear-gradient(135deg, #25D366 0%, #15803d 100%);
      color: #ffffff;
      font-size: 17px;
      box-shadow: 0 3px 8px rgba(37, 211, 102, 0.25);
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .elib-card-actions {
        grid-template-columns: 1fr 1fr 34px !important;
        gap: 4px !important;
      }
      .btn-card-action {
        height: 34px !important;
        font-size: 11px !important;
        padding: 0 2px !important;
        gap: 3px !important;
      }
      .btn-card-action span {
        font-size: 10px !important;
      }
      .btn-card-wa {
        width: 34px !important;
        height: 34px !important;
        font-size: 16px !important;
      }
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 8px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
      transition: transform 0.2s;
    }

    .spec-row:active {
      transform: scale(0.98);
    }

    .spec-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-blue), #003d99);
      color: white;
      border-radius: 8px;
      font-size: 12px;
      margin-right: 12px;
      box-shadow: 0 4px 10px rgba(0, 82, 204, 0.2);
    }

    .feature-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .car-img-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, rgba(0, 82, 204, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
    }

    .car-img-wrapper img {
      max-height: 100%;
      max-width: 95%;
      object-fit: contain;
      filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.2));
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .car-img-wrapper img:hover {
      transform: scale(1.1) translateY(-5px);
    }

    .modal-box.glass-modal {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
      max-height: 85vh;
      overflow-y: auto;
      border-radius: 24px;
    }

    /* Scrollbar styling for the modal */
    .modal-box.glass-modal::-webkit-scrollbar {
      width: 6px;
    }

    .modal-box.glass-modal::-webkit-scrollbar-track {
      background: transparent;
    }

    .modal-box.glass-modal::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 10px;
    }

    .modal-box.glass-modal::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25);
    }

    #modalSpek {
      align-items: center;
      padding: 16px;
    }

    /* PDF Modal Specific Styles */
    .pdf-modal-container {
      width: fit-content !important;
      max-width: 95vw !important;
      height: auto !important;
      max-height: 94vh !important;
      padding: 12px 14px !important;
      display: flex !important;
      flex-direction: column !important;
      border-radius: 16px !important;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important;
      background: #ffffff !important;
      box-sizing: border-box !important;
    }
    .pdf-modal-header {
      display: flex !important;
      flex-direction: column !important;
      gap: 8px !important;
      width: 100% !important;
      margin-bottom: 8px !important;
      padding-bottom: 8px !important;
      border-bottom: 1px solid #e2e8f0 !important;
      box-sizing: border-box !important;
    }
    .pdf-header-top {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      gap: 8px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .pdf-title-wrap {
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      min-width: 0 !important;
      flex: 1 !important;
    }
    .pdf-icon-badge {
      width: 32px !important;
      height: 32px !important;
      border-radius: 8px !important;
      background: rgba(227, 24, 55, 0.1) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #E31837 !important;
      font-size: 15px !important;
      flex-shrink: 0 !important;
    }
    .pdf-title-info {
      min-width: 0 !important;
    }
    .pdf-title-info h3 {
      margin: 0 !important;
      font-size: 15px !important;
      font-weight: 800 !important;
      color: #0f172a !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      line-height: 1.2 !important;
    }
    .pdf-title-info span {
      font-size: 10.5px !important;
      color: #64748b !important;
      font-weight: 500 !important;
      display: block !important;
      line-height: 1.2 !important;
    }
    .pdf-main-actions {
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      flex-shrink: 0 !important;
    }
    .pdf-btn-action {
      width: 30px !important;
      height: 30px !important;
      border-radius: 8px !important;
      border: none !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      cursor: pointer !important;
      text-decoration: none !important;
      font-size: 12px !important;
      box-sizing: border-box !important;
    }
    .pdf-btn-download {
      background: #0284c7 !important;
      color: #ffffff !important;
      box-shadow: 0 2px 5px rgba(2,132,199,0.25) !important;
    }
    .pdf-btn-share {
      background: #25D366 !important;
      color: #ffffff !important;
      box-shadow: 0 2px 5px rgba(37,211,102,0.25) !important;
    }
    .pdf-btn-close {
      background: #f8fafc !important;
      color: #64748b !important;
      border: 1px solid #e2e8f0 !important;
      font-size: 14px !important;
    }
    .pdf-header-controls {
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      gap: 6px !important;
      width: 100% !important;
      box-sizing: border-box !important;
    }
    .pdf-page-controls,
    .pdf-zoom-bar {
      display: inline-flex !important;
      align-items: center !important;
      background: #f1f5f9 !important;
      border-radius: 8px !important;
      padding: 2px 4px !important;
      gap: 2px !important;
      border: 1px solid #e2e8f0 !important;
      box-sizing: border-box !important;
    }
    .pdf-ctrl-btn {
      width: 28px !important;
      height: 28px !important;
      border-radius: 6px !important;
      border: none !important;
      background: #ffffff !important;
      color: #334155 !important;
      font-size: 11px !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important;
      box-sizing: border-box !important;
    }
    .pdf-btn-fit {
      width: auto !important;
      padding: 0 6px !important;
      font-size: 10.5px !important;
      font-weight: 700 !important;
      gap: 3px !important;
    }
    .pdf-zoom-label {
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #334155 !important;
      min-width: 38px !important;
      text-align: center !important;
    }
    .pdf-page-indicator {
      font-size: 11px !important;
      font-weight: 700 !important;
      color: #334155 !important;
      padding: 0 4px !important;
      white-space: nowrap !important;
    }
    .pdf-page-indicator span:first-child {
      color: #E31837 !important;
    }
    @media (min-width: 769px) {
      .pdf-modal-header {
        flex-direction: row !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 12px !important;
      }
      .pdf-header-top {
        width: auto !important;
        flex: 1 !important;
      }
      .pdf-header-controls {
        width: auto !important;
        justify-content: flex-end !important;
      }
    }
    @media (max-width: 768px) {
      #pdfModal {
        padding: 6px !important;
      }
      #pdfModal .modal-content {
        width: 95vw !important;
        max-width: 95vw !important;
        padding: 10px 10px !important;
        border-radius: 14px !important;
      }
    }
  </style>

  <!-- Modal Spek (Car Details & Specifications) -->
  <div class="modal-overlay" id="modalSpek" onclick="if(event.target === this) this.classList.remove('show')">
    <div class="modal-box glass-modal" style="text-align:center; padding: 24px 20px; width: 90%; max-width: 380px;">
      <h3 class="modal-title" id="spekTitle"
        style="font-size:22px; font-weight:900; background:linear-gradient(90deg, var(--primary-blue), #003d99); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom:4px;">
        Spek Mobil</h3>

      <div class="car-img-wrapper" style="height: 140px; margin-top:10px; margin-bottom: 10px;">
        <img id="spekImg" src="" alt="Spek">
      </div>

      <!-- Color Selector -->
      <div id="colorSelectorContainer" style="margin-bottom: 20px; display: none;">
        <label
          style="display:block; text-align:center; font-size:12px; font-weight:800; color:var(--text-muted); margin-bottom:6px;">PILIHAN
          WARNA: <span id="selectedColorName" style="color:var(--primary-red); font-weight:900;"></span></label>
        <div id="colorOptions"
          style="display:flex; justify-content:center; flex-wrap:wrap; gap:10px; padding:4px 4px 10px 4px;">
          <!-- Color dots injected by JS -->
        </div>
      </div>

      <!-- Variant Selector -->
      <div style="margin-bottom: 20px;">
        <label for="variantSelector"
          style="display:block; text-align:left; font-size:12px; font-weight:800; color:var(--text-muted); margin-bottom:6px; margin-left:4px;">PILIH
          TIPE KENDARAAN</label>
        <select id="variantSelector" class="form-control"
          style="font-weight:700; color:var(--primary-blue); font-size:13px; border-radius:12px; padding:12px; box-shadow:0 4px 10px rgba(0,0,0,0.03);"
          onchange="handleVariantChange(this.value)">
          <!-- Options injected by JS -->
        </select>
      </div>

      <!-- Prominent Price Display -->
      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 20px;">
        <div
          style="text-align:left; background: linear-gradient(135deg, rgba(212,22,60,0.08), rgba(212,22,60,0.02)); border: 1px solid rgba(212,22,60,0.2); border-radius: 16px; padding: 14px; box-shadow: 0 4px 15px rgba(212,22,60,0.05);">
          <span
            style="display:block; font-size:10px; font-weight:800; color:var(--primary-red); letter-spacing:1px; margin-bottom:8px;">HARGA
            OTR</span>
          <div id="spekPrice"
            style="font-size:15px; font-weight:900; color:var(--primary-red); display:flex; flex-direction:column; gap:8px;">
            Rp 0</div>
        </div>
        <div
          style="text-align:left; background: linear-gradient(135deg, rgba(0,82,204,0.08), rgba(0,82,204,0.02)); border: 1px solid rgba(0,82,204,0.2); border-radius: 16px; padding: 14px; box-shadow: 0 4px 15px rgba(0,82,204,0.05);">
          <span
            style="display:block; font-size:10px; font-weight:800; color:var(--primary-blue); letter-spacing:1px; margin-bottom:8px;">KODE
            TIPE</span>
          <div id="spekKodeTipe"
            style="font-size:14px; font-weight:900; color:var(--primary-blue); display:flex; flex-direction:column; gap:8px;">
            -</div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; text-align:left; margin-bottom:20px;">
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-users"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Kapasitas Kursi</span>
          </div>
          <strong id="spekKursi" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gas-pump"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Bahan Bakar</span>
          </div>
          <strong id="spekFuel" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gauge-high"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Kapasitas Mesin</span>
          </div>
          <strong id="spekEngine" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gear"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Transmisi</span>
          </div>
          <strong id="spekTransmisi" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-car"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Penggerak</span>
          </div>
          <strong id="spekPenggerak" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>

        <div style="margin-top:16px; text-align:center;">
          <span
            style="color:var(--text-muted); font-size:10px; display:block; margin-bottom:8px; font-weight:800; letter-spacing:1px;">FITUR
            UNGGULAN</span>
          <div id="spekFitur" style="display:flex; flex-wrap:wrap; justify-content:center;"></div>
        </div>
      </div>

      <!-- Action Buttons: Brochure View, WhatsApp Share & Copy -->
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:13px 16px; border-radius:14px; background:linear-gradient(135deg, var(--primary-blue), #003d99); color:#ffffff; font-weight:800; font-size:13.5px; box-shadow: 0 6px 20px rgba(0,82,204,0.3); border:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:transform 0.2s;"
          onclick="viewCarBrochure()">
          <i class="fa-solid fa-book-open" style="font-size:17px;"></i> Buka Brosur Resmi PDF
        </button>
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:12px 16px; border-radius:14px; background:linear-gradient(135deg, #c8102e 0%, #99001c 100%); color:#ffffff; font-weight:800; font-size:13px; box-shadow: 0 6px 20px rgba(200,16,46,0.25); border:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:transform 0.2s;"
          onclick="shareCarBrochurePdf()">
          <i class="fa-solid fa-file-pdf" style="font-size:17px;"></i> Kirim File E-Catalog PDF
        </button>
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:12px 16px; border-radius:14px; background:linear-gradient(135deg, #25D366 0%, #15803d 100%); color:#ffffff; font-weight:800; font-size:13px; box-shadow: 0 4px 15px rgba(37,211,102,0.25); border:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:transform 0.2s;"
          onclick="shareCarToWhatsApp()">
          <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i> Bagikan Info Lengkap ke WA
        </button>
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:10px 14px; border-radius:12px; background:rgba(255,255,255,0.9); color:#0f172a; font-weight:700; font-size:12px; border:1.5px solid #cbd5e1; cursor:pointer; display:flex; align-items:center; gap:6px;"
          onclick="copyCarSpecsToClipboard()">
          <i class="fa-solid fa-copy" style="color:#2563eb;"></i> Salin Format Teks
        </button>
      </div>

      <button class="btn-main"
        style="width:100%; justify-content:center; padding:12px; border-radius:12px; background:#64748b; color:#ffffff; font-weight:700; font-size:12px; border:none; cursor:pointer;"
        onclick="document.getElementById('modalSpek').classList.remove('show')">
        Tutup Detail
      </button>
    </div>
  </div>

  <!-- PDF Viewer Modal -->
  <div class="modal-overlay" id="pdfModal" style="align-items: center; justify-content: center; padding: 10px;">
    <div class="modal-content pdf-modal-container"
      style="width: fit-content !important; max-width: 95vw !important; height: auto !important; max-height: 94vh !important; padding: 12px 14px !important; display: flex !important; flex-direction: column !important; border-radius: 16px !important; box-shadow: 0 20px 50px rgba(0,0,0,0.3) !important; background: #ffffff !important; box-sizing: border-box !important;">
      
      <!-- Modal Header -->
      <div class="pdf-modal-header" style="display: flex !important; flex-direction: column !important; gap: 8px !important; width: 100% !important; margin-bottom: 8px !important; padding-bottom: 8px !important; border-bottom: 1px solid #e2e8f0 !important; box-sizing: border-box !important;">
        <!-- Top Row: Title & Main Actions (Download, Share, Close) -->
        <div class="pdf-header-top" style="display: flex !important; justify-content: space-between !important; align-items: center !important; gap: 8px !important; width: 100% !important; box-sizing: border-box !important;">
          <div class="pdf-title-wrap" style="display: flex !important; align-items: center !important; gap: 8px !important; min-width: 0 !important; flex: 1 !important;">
            <div class="pdf-icon-badge" style="width: 32px !important; height: 32px !important; border-radius: 8px !important; background: rgba(227, 24, 55, 0.1) !important; display: flex !important; align-items: center !important; justify-content: center !important; color: #E31837 !important; font-size: 15px !important; flex-shrink: 0 !important;">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div class="pdf-title-info" style="min-width: 0 !important;">
              <h3 id="pdfModalTitle" style="margin: 0 !important; font-size: 15px !important; font-weight: 800 !important; color: #0f172a !important; white-space: nowrap !important; overflow: hidden !important; text-overflow: ellipsis !important; line-height: 1.2 !important;">Lihat Brosur</h3>
              <span style="font-size: 10.5px !important; color: #64748b !important; font-weight: 500 !important; display: block !important; line-height: 1.2 !important;">Brosur Resmi Toyota</span>
            </div>
          </div>

          <div class="pdf-main-actions" style="display: flex !important; align-items: center !important; gap: 5px !important; flex-shrink: 0 !important;">
            <a id="btnDownloadPdf" href="#" target="_blank" download title="Unduh File PDF" class="pdf-btn-action pdf-btn-download"
               style="width: 30px !important; height: 30px !important; border-radius: 8px !important; border: none !important; background: #0284c7 !important; color: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important; text-decoration: none !important; font-size: 12px !important; box-shadow: 0 2px 5px rgba(2,132,199,0.25) !important; cursor: pointer !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-download"></i>
            </a>
            <button id="btnSharePdf" type="button" title="Bagikan ke WhatsApp" class="pdf-btn-action pdf-btn-share"
               style="width: 30px !important; height: 30px !important; border-radius: 8px !important; border: none !important; background: #25D366 !important; color: #ffffff !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 12px !important; box-shadow: 0 2px 5px rgba(37,211,102,0.25) !important; cursor: pointer !important; border: none !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
            <button class="btn-close-modal pdf-btn-action pdf-btn-close" onclick="closePdfModal()" type="button" title="Tutup"
               style="width: 30px !important; height: 30px !important; border-radius: 8px !important; border: 1px solid #e2e8f0 !important; background: #f8fafc !important; color: #64748b !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; cursor: pointer !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Secondary Controls: Page Navigation & Zoom Bar -->
        <div class="pdf-header-controls" style="display: flex !important; align-items: center !important; justify-content: space-between !important; gap: 6px !important; width: 100% !important; box-sizing: border-box !important;">
          <!-- Page Navigation -->
          <div id="pdfControls" class="pdf-page-controls" style="display: none; align-items: center !important; background: #f1f5f9 !important; border-radius: 8px !important; padding: 2px 4px !important; gap: 2px !important; border: 1px solid #e2e8f0 !important; box-sizing: border-box !important;">
            <button id="btnPrevPdf" type="button" title="Halaman Sebelumnya" class="pdf-ctrl-btn"
              style="width: 28px !important; height: 28px !important; border-radius: 6px !important; border: none !important; background: #ffffff !important; color: #334155 !important; font-size: 11px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span class="pdf-page-indicator" style="font-size: 11px !important; font-weight: 700 !important; color: #334155 !important; padding: 0 4px !important; white-space: nowrap !important;">
              Hal <span id="pdfPageNum" style="color: #E31837 !important;">1</span>/<span id="pdfPageCount">-</span>
            </span>
            <button id="btnNextPdf" type="button" title="Halaman Selanjutnya" class="pdf-ctrl-btn"
              style="width: 28px !important; height: 28px !important; border-radius: 6px !important; border: none !important; background: #ffffff !important; color: #334155 !important; font-size: 11px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Zoom Bar -->
          <div class="pdf-zoom-bar" style="display: inline-flex !important; align-items: center !important; background: #f1f5f9 !important; border-radius: 8px !important; padding: 2px 4px !important; gap: 2px !important; border: 1px solid #e2e8f0 !important; margin-left: auto !important; box-sizing: border-box !important;">
            <button type="button" onclick="zoomPdf(-0.2)" title="Perkecil (-)" class="pdf-ctrl-btn"
              style="width: 28px !important; height: 28px !important; border-radius: 6px !important; border: none !important; background: #ffffff !important; color: #334155 !important; font-size: 11px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <span id="pdfZoomLabel" class="pdf-zoom-label" style="font-size: 11px !important; font-weight: 700 !important; color: #334155 !important; min-width: 38px !important; text-align: center !important;">100%</span>
            <button type="button" onclick="zoomPdf(0.2)" title="Perbesar (+)" class="pdf-ctrl-btn"
              style="width: 28px !important; height: 28px !important; border-radius: 6px !important; border: none !important; background: #ffffff !important; color: #334155 !important; font-size: 11px !important; cursor: pointer !important; display: flex !important; align-items: center !important; justify-content: center !important; box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button type="button" onclick="fitPdfWidth()" title="Pas Layar" class="pdf-ctrl-btn pdf-btn-fit"
              style="width: auto !important; padding: 0 6px !important; height: 28px !important; border-radius: 6px !important; border: none !important; background: #ffffff !important; color: #334155 !important; font-size: 10.5px !important; font-weight: 700 !important; cursor: pointer !important; display: flex !important; align-items: center !important; gap: 3px !important; box-shadow: 0 1px 2px rgba(0,0,0,0.06) !important; box-sizing: border-box !important;">
              <i class="fa-solid fa-arrows-left-right"></i> Fit
            </button>
          </div>
        </div>
      </div>

      <!-- Viewer Container -->
      <div id="pdfViewerContainer"
        style="background:transparent; border:none; overflow-y:auto; overflow-x:auto; position:relative; display:flex; justify-content:center; align-items:center; padding:0; margin:0 auto; -webkit-overflow-scrolling:touch;">
        <div id="pdfLoading"
          style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:none; flex-direction:column; align-items:center; gap:8px; background:rgba(15,23,42,0.85); padding:14px 20px; border-radius:12px; z-index:10; backdrop-filter:blur(6px);">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; color:#38bdf8;"></i>
          <span style="font-size:12px; font-weight:600; color:#f8fafc; letter-spacing:0.3px;">Memuat Brosur...</span>
        </div>
        <canvas id="pdfCanvas"
          style="box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-radius:8px; margin: 0 auto; display: block; background:#ffffff;"></canvas>
      </div>

    </div>
  </div>

  <!-- PDF Focus Lightbox -->
  <div class="modal-overlay" id="pdfLightbox" style="align-items: center; background: rgba(0,0,0,0.85);">
    <div style="position:relative; width:95%; max-width:900px; height:85vh; border-radius:12px; overflow:hidden; display:flex; justify-content:center; align-items:center; box-shadow:0 10px 30px rgba(0,0,0,0.5); background:#1e1e1e;">
      <!-- Blurred background -->
      <div id="pdfLightboxBg" style="position:absolute; top:0; left:0; width:100%; height:100%; background-size:cover; background-position:center; filter:blur(25px); opacity:0.5; z-index:1; transform: scale(1.1);"></div>

      <!-- Controls -->
      <button class="btn-close-modal" style="position:absolute; top:15px; right:15px; z-index:10; background:rgba(255,255,255,0.2); color:#fff; border:none; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:16px;" onclick="closePdfLightbox()">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <button id="btnPrevLightbox" style="position:absolute; left:15px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px;">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <button id="btnNextLightbox" style="position:absolute; right:15px; top:50%; transform:translateY(-50%); z-index:10; background:rgba(0,0,0,0.5); color:#fff; border:none; border-radius:50%; width:40px; height:40px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px;">
        <i class="fa-solid fa-chevron-right"></i>
      </button>

      <div style="position:absolute; bottom:15px; left:50%; transform:translateX(-50%); z-index:10; background:rgba(0,0,0,0.6); color:#fff; padding:6px 16px; border-radius:20px; font-size:13px; font-weight:bold; letter-spacing:0.5px;">
        Hal <span id="pdfLightboxPageNum">1</span>/<span id="pdfLightboxPageCount">-</span>
      </div>

      <!-- Clear image -->
      <img id="pdfLightboxImg" src="" style="position:relative; z-index:5; width:100%; height:100%; object-fit:contain;">
    </div>
  </div>

  <!-- Image Lightbox Modal -->
  <div class="modal-overlay" id="imageLightbox"
    onclick="if(event.target===this) document.getElementById('imageLightbox').classList.remove('show')">
    <div
      style="position:relative; width:95%; max-width:800px; display:flex; justify-content:center; align-items:center;">
      <button class="btn-close-modal"
        style="position:absolute; top:-40px; right:0; background:rgba(255,255,255,0.2); color:#fff; border:none; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px;"
        onclick="document.getElementById('imageLightbox').classList.remove('show')">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <img id="lightboxImage" src=""
        style="width:100%; height:auto; max-height:85vh; object-fit:contain; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
    </div>
  </div>

  <!-- Share toast -->
  <div class="share-toast" id="shareToast" style="position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%) translateY(20px); background: #0f172a; color: white; font-size: 12px; font-weight: 600; padding: 10px 18px; border-radius: 999px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); opacity: 0; pointer-events: none; transition: all 0.3s ease; z-index: 9999; white-space: nowrap;">
    <i class="fa-solid fa-check" style="margin-right:6px;color:#10b981;"></i>
    Berhasil
  </div>
  <style>
    .share-toast.show {
      opacity: 1 !important;
      transform: translateX(-50%) translateY(0) !important;
    }
  </style>

  <!-- PDF.js Library & Core Scripts -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <script src="../custom_alert.js"></script>
  <script src="../js/sales_signature.js"></script>
  <script src="../js/brosur.js?v={{ time() }}"></script>
  <script src="../js/elibrary_data.js?v=4"></script>
  <script src="../js/elibrary.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
