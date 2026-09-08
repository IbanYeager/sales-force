<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - E-Catalog</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/animations-premium.css">
  <link rel="stylesheet" href="../css/brosur.css">
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
  <!-- PDF Viewer Modal -->
  <div class="modal-overlay" id="pdfModal" style="align-items: center; justify-content: center; padding: 12px;">
    <div class="modal-content pdf-modal-container">
      
      <!-- Modal Header -->
      <div class="pdf-modal-header">
        <!-- Top Row: Title & Main Actions (Download, Share, Close) -->
        <div class="pdf-header-top">
          <div class="pdf-title-wrap">
            <div class="pdf-icon-badge">
              <i class="fa-solid fa-file-pdf"></i>
            </div>
            <div class="pdf-title-info">
              <h3 id="pdfModalTitle">Lihat Brosur</h3>
              <span>Brosur Resmi Toyota</span>
            </div>
          </div>

          <div class="pdf-main-actions">
            <a id="btnDownloadPdf" href="#" target="_blank" download title="Unduh File PDF" class="pdf-btn-action pdf-btn-download">
              <i class="fa-solid fa-download"></i>
            </a>
            <button id="btnSharePdf" type="button" title="Bagikan ke WhatsApp" class="pdf-btn-action pdf-btn-share">
              <i class="fa-solid fa-share-nodes"></i>
            </button>
            <button class="btn-close-modal pdf-btn-action pdf-btn-close" onclick="closePdfModal()" type="button" title="Tutup">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Secondary Controls: Page Navigation & Zoom Bar -->
        <div class="pdf-header-controls">
          <!-- Page Navigation -->
          <div id="pdfControls" class="pdf-page-controls" style="display:none;">
            <button id="btnPrevPdf" type="button" title="Halaman Sebelumnya" class="pdf-ctrl-btn">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <span class="pdf-page-indicator">
              Hal <span id="pdfPageNum">1</span>/<span id="pdfPageCount">-</span>
            </span>
            <button id="btnNextPdf" type="button" title="Halaman Selanjutnya" class="pdf-ctrl-btn">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <!-- Zoom Bar -->
          <div class="pdf-zoom-bar">
            <button type="button" onclick="zoomPdf(-0.2)" title="Perkecil (-)" class="pdf-ctrl-btn">
              <i class="fa-solid fa-magnifying-glass-minus"></i>
            </button>
            <span id="pdfZoomLabel" class="pdf-zoom-label">100%</span>
            <button type="button" onclick="zoomPdf(0.2)" title="Perbesar (+)" class="pdf-ctrl-btn">
              <i class="fa-solid fa-magnifying-glass-plus"></i>
            </button>
            <button type="button" onclick="fitPdfWidth()" title="Pas Layar" class="pdf-ctrl-btn pdf-btn-fit">
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
