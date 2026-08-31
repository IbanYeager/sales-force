<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - E-Brosur Toyota</title>
  <meta name="description"
    content="Temukan lebih banyak tentang produk terbaik Toyota. E-Brosur digital lengkap semua model." />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/sidebar_desktop.js"></script>
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

  <!-- PDF Viewer Modal -->
  <div class="modal-overlay" id="pdfModal" style="align-items: center;">
    <div class="modal-content"
      style="max-width:1000px; width:95%; max-height:95vh; height:auto; padding:15px; display:flex; flex-direction:column;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="margin:0; font-size:16px; font-weight:800;" id="pdfModalTitle">Lihat Brosur</h3>

        <div style="display:flex; align-items:center; gap:8px;">
          <a id="btnDownloadPdf" href="#" target="_blank" download
             style="width:36px; height:36px; border-radius:6px; border:none; background:var(--primary-blue); color:#fff; display:flex; align-items:center; justify-content:center; text-decoration:none;">
            <i class="fa-solid fa-download"></i>
          </a>
          <button id="btnSharePdf" type="button"
             style="width:36px; height:36px; border-radius:6px; border:none; background:#25D366; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer;" onclick="shareBrosurModal()">
            <i class="fa-solid fa-share-nodes"></i>
          </button>

          <div id="pdfControls" style="display:none; align-items:center; gap:8px; margin-left: 10px; padding-left:10px; border-left:1px solid var(--border-color);">
            <button id="btnPrevPdf"
              style="width:30px; height:30px; border-radius:6px; border:1px solid var(--border-color); background:#fff; cursor:pointer;"><i
                class="fa-solid fa-chevron-left"></i></button>
            <span style="font-size:12px; font-weight:bold; color:var(--text-dark);">Hal <span
                id="pdfPageNum">1</span>/<span id="pdfPageCount">-</span></span>
            <button id="btnNextPdf"
              style="width:30px; height:30px; border-radius:6px; border:1px solid var(--border-color); background:#fff; cursor:pointer;"><i
                class="fa-solid fa-chevron-right"></i></button>
          </div>

          <button class="btn-close-modal" onclick="closePdfModal()" style="margin-left:8px;">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>
      <div id="pdfViewerContainer"
        style="flex:1; background:#cbd5e1; border-radius:12px; border:1px solid var(--border-color); overflow-y:auto; overflow-x:auto; position:relative; text-align:center; padding:4px;">
        <div id="pdfLoading"
          style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); display:none; flex-direction:column; align-items:center;">
          <i class="fa-solid fa-spinner fa-spin"
            style="font-size:24px; color:var(--primary-red); margin-bottom:10px;"></i>
          <span style="font-size:12px; font-weight:600; color:var(--text-dark);">Memuat PDF...</span>
        </div>
        <canvas id="pdfCanvas"
          style="box-shadow: 0 4px 12px rgba(0,0,0,0.15); border-radius:4px; margin: 0 auto; display: block; max-width: 100%;"></canvas>
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
  <script src="../js/brosur.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

