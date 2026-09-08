<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <script>
    // Dialihkan langsung ke halaman terpadu E-Catalog
    window.location.replace('elibrary.html');
  </script>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - E-Brosur Toyota</title>
  <meta name="description"
    content="Temukan lebih banyak tentang produk terbaik Toyota. E-Brosur digital lengkap semua model." />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/sidebar_desktop.js?v=20260907_layout_fix"></script>
  <link rel="stylesheet" href="../css/brosur.css">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>E-Brosur</h2>
    </header>

    <div class="container" style="margin-top:16px; padding-bottom:24px;">

      <!-- Hero Banner -->
      <div class="brosur-hero">
        <div class="brosur-hero-row">
          <div class="brosur-hero-icon">
            <i class="fa-solid fa-book-open"></i>
          </div>
          <div>
            <h2>Brosur Toyota</h2>
            <p>Temukan Lebih Banyak Tentang Produk Terbaik Toyota</p>
          </div>
        </div>
      </div>

      <!-- Search bar -->
      <div class="search-wrap">
        <i class="fa-solid fa-magnifying-glass search-icon-brosur"></i>
        <input type="text" class="brosur-search-input" id="searchInput" placeholder="Cari model brosur..."
          autocomplete="off" />
        <button class="search-clear" id="searchClear" title="Hapus pencarian">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Category tabs -->
      <div class="kat-tabs" id="katTabs">
        <button class="kat-tab active" data-kat="ALL">
          <i class="fa-solid fa-th-large" style="margin-right:4px;font-size:9px;"></i> All
        </button>
        <!-- Tabs diisi via JS -->
      </div>

      <!-- Result info -->
      <div class="result-count" id="resultCount" style="display:none;"></div>

      <!-- Brochure list container -->
      <div id="brosurContainer">
        <!-- Skeleton loading -->
        <div class="skeleton-grid" id="skeletonGrid">
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:70%;"></div>
              <div class="skeleton-line" style="height:10px;width:90%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:60%;"></div>
              <div class="skeleton-line" style="height:10px;width:85%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:75%;"></div>
              <div class="skeleton-line" style="height:10px;width:80%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:65%;"></div>
              <div class="skeleton-line" style="height:10px;width:90%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:55%;"></div>
              <div class="skeleton-line" style="height:10px;width:95%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
          <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line" style="height:14px;width:80%;"></div>
              <div class="skeleton-line" style="height:10px;width:70%;"></div>
              <div style="display:flex;gap:6px;margin-top:4px;">
                <div class="skeleton-line" style="height:30px;flex:1;border-radius:8px;"></div>
                <div class="skeleton-line" style="height:30px;width:32px;border-radius:8px;"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>

  <style>
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
        style="background:transparent; border:none; overflow-y:auto; overflow-x:auto; position:relative; display:flex; justify-content:center; align-items:center; padding:0; margin:0 auto; max-height:calc(92vh - 60px); -webkit-overflow-scrolling:touch;">
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

  <!-- Share toast -->
  <div class="share-toast" id="shareToast">
    <i class="fa-solid fa-check" style="margin-right:6px;color:#10b981;"></i>
    Link berhasil disalin!
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

  <!-- PDF.js Library -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
  <script src="../custom_alert.js"></script>
  <script src="../js/sales_signature.js"></script>
  <script src="../js/brosur.js?v={{ time() }}"></script>

  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>

