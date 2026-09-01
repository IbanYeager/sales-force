<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - PriceList OTR</title>
  <meta name="description" content="Daftar harga OTR Toyota Jawa Barat terlengkap per model dan tipe">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/pricelist.css?v=20260901_final">
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app" style="padding-bottom: 110px;">

    <header class="header-page">
      <h2>PriceList OTR</h2>
    </header>

    <div class="container" style="margin-top: 0;">

      <!-- Banner -->
      <div class="otr-banner">
        <div class="otr-banner-row">
          <div>
            <h3>OTR Jawa Barat</h3>
            <p>Harga update terbaru — semua varian & paket</p>
          </div>
          <div class="otr-banner-icon">
            <i class="fa-solid fa-map-location-dot"></i>
          </div>
        </div>
      </div>

      <!-- Search and Filter Wrap -->
      <div class="sticky-header-glass" style="display:flex; gap:10px; padding:12px 16px; margin-bottom:16px; margin-left:-16px; margin-right:-16px;">
        <div class="search-wrap" style="flex:1; margin-bottom:0; padding:0;">
          <i class="fa-solid fa-magnifying-glass search-icon" style="top:50%; transform:translateY(-50%);"></i>
          <input type="text" id="searchInput" class="search-input" placeholder="Cari mobil..." style="width:100%; border-radius:12px; height: 42px;">
        </div>
        <button class="btn-filter" id="btnToggleMultiSelect" onclick="toggleMultiSelectMode()" style="border:1px solid rgba(0,0,0,0.1); background:#fff; color:var(--text-dark); border-radius:12px; padding:0 14px; font-weight:700; display:flex; align-items:center; gap:6px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.02); font-size:13px; transition:all 0.2s ease; height: 42px;" title="Pilih Banyak Tipe / Model">
          <i class="fa-solid fa-list-check" id="iconMultiSelect"></i> <span id="lblMultiSelect">Pilih Banyak</span>
        </button>
        <button class="btn-filter" onclick="openFilterModal()" style="border:1px solid rgba(0,0,0,0.1); background:#fff; color:var(--text-dark); border-radius:12px; padding:0 16px; font-weight:700; display:flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.02); font-size:13px; transition:all 0.2s ease; height: 42px;">
          <i class="fa-solid fa-sliders"></i> Filter
        </button>
        <button class="btn-filter" id="btnExportPricelist" onclick="exportPricelist()" style="border:none; background:var(--primary-blue); color:#fff; border-radius:12px; padding:0 16px; font-weight:700; display:flex; align-items:center; gap:8px; cursor:pointer; box-shadow:0 2px 5px rgba(0,0,0,0.1); font-size:13px; transition:all 0.2s ease; height: 42px;" title="Download Tabel Pricelist">
          <i class="fa-solid fa-download"></i>
        </button>
      </div>

      <!-- Info bar -->
      <div class="section-header-row" style="margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <h3 class="section-title" style="margin:0;">Daftar Unit</h3>
          <i class="fa-solid fa-circle-question" style="color:var(--primary-red); cursor:pointer; font-size:15px; margin-top:2px;" onclick="openInfoModal()" title="Keterangan Tipe"></i>
        </div>
        <span class="result-badge" id="resultBadge">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat...
        </span>
      </div>

      <!-- List container -->
      <div id="pricelistContainer"></div>

    </div>

    <!-- Floating Multi-Share Bar (Aktif saat memilih lebih dari 1 tipe) -->
    <div id="multiShareBar" class="multi-share-bar" style="display:none;">
      <div class="msb-content">
        <div class="msb-info">
          <div class="msb-badge"><i class="fa-solid fa-square-check"></i> <span id="msbCount">0</span> Tipe Dipilih</div>
          <span class="msb-sub">Harga Manual & Auto siap di-share</span>
        </div>
        <div class="msb-actions">
          <button class="btn-msb-clear" onclick="clearMultiSelection()" title="Batal memilih">
            <i class="fa-solid fa-xmark"></i> Batal
          </button>
          <button class="btn-msb-share" onclick="executeMultiShare()" title="Bagikan tipe yang dipilih ke WhatsApp">
            <i class="fa-brands fa-whatsapp"></i> Bagikan WA (<span id="msbBtnCount">0</span>)
          </button>
        </div>
      </div>
    </div>

    <nav class="bottom-nav">
    <a href="../index.html" class="nav-item"><i class="fa-solid fa-house"></i><span class="nav-text">Home</span></a>
    <a href="pricelist.html" class="nav-item active"><i class="fa-solid fa-clipboard-list"></i><span class="nav-text">Harga</span></a>
    <a href="input.html" class="nav-item center-btn">
        <div class="center-btn-inner">
            <i class="fa-solid fa-camera"></i>
        </div>
    </a>
    <a href="testdrive.html" class="nav-item"><i class="fa-solid fa-car-side"></i><span class="nav-text">Tes Drive</span></a>
    <a href="profil.html" class="nav-item"><i class="fa-solid fa-user"></i><span class="nav-text">Profil</span></a>
</nav>
  </div>

  <!-- Modal Penjelasan Paket Pricelist -->
  <div class="modal-overlay" id="infoModalOverlay" onclick="closeInfoModalOutside(event)">
    <div class="modal-sheet">
      <div class="modal-handle"></div>
      <div class="modal-title">
        <i class="fa-solid fa-circle-question"></i>
        <span>Keterangan Kategori & Paket Mobil</span>
      </div>

      <div class="info-list">
        <div class="info-item">
          <div class="info-icon icon-reguler"><i class="fa-solid fa-car"></i></div>
          <div class="info-content">
            <div class="info-name">Paket Reguler</div>
            <div class="info-desc">Tipe mobil Toyota standar resmi dengan pilihan warna normal bawaan pabrik serta kelengkapan orisinil pabrikan.</div>
          </div>
        </div>



        <div class="info-item">
          <div class="info-icon icon-prime"><i class="fa-solid fa-crown"></i></div>
          <div class="info-content">
            <div class="info-name">Paket Prime</div>
            <div class="info-desc">Varian mobil dengan status premium, pilihan warna khusus (Premium/Special Color) yang membutuhkan biaya tambahan, atau layanan garansi eksklusif.</div>
          </div>
        </div>

        <div class="info-item">
          <div class="info-icon icon-ntco"><i class="fa-solid fa-bolt"></i></div>
          <div class="info-content">
            <div class="info-name">National TCO (NTCO)</div>
            <div class="info-desc">Paket aksesoris Toyota Customization Option skala nasional resmi dari pabrikan Toyota Astra Motor (TAM).</div>
          </div>
        </div>
      </div>

      <button class="btn-close-info-modal" onclick="closeInfoModal()">Tutup Keterangan</button>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
  <script src="../js/sales_signature.js?v=20260901_final"></script>
  <script src="../js/pricelist.js?v=20260901_final"></script>

  <!-- Image Lightbox Modal -->
  <div id="imageLightbox" class="lightbox-overlay" onclick="closeLightbox(event)">
    <div class="lightbox-content-wrapper">
      <span class="lightbox-close" onclick="closeLightbox(event)">&times;</span>
      <img id="lightboxImage" src="" alt="Full size image">
    </div>
  </div>
  <!-- Modal Filter -->
  <div class="modal-overlay" id="filterModalOverlay" onclick="closeFilterModalOutside(event)">
    <div class="modal-sheet" style="padding:24px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
        <h3 style="margin:0; font-size:18px; font-weight:800; color:var(--text-dark);">Filter Pencarian</h3>
        <i class="fa-solid fa-xmark" style="font-size:20px; color:#94a3b8; cursor:pointer;" onclick="closeFilterModal()"></i>
      </div>
      
      <div style="margin-bottom:20px;">
        <div style="font-size:13px; font-weight:800; color:#64748b; margin-bottom:10px; text-transform:uppercase;">Kategori Order</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;" id="filterOrderGroup">
          <div class="filter-pill active" data-val="reguler" onclick="selectFilterOrder(this)">Reguler</div>
          <div class="filter-pill" data-val="prime" onclick="selectFilterOrder(this)">Prime</div>
          <div class="filter-pill" data-val="ntco" onclick="selectFilterOrder(this)">NTCO</div>
        </div>
      </div>

      <div style="margin-bottom:24px;">
        <div style="font-size:13px; font-weight:800; color:#64748b; margin-bottom:10px; text-transform:uppercase;">Tipe Bodi</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;" id="filterBodyGroup">
          <div class="filter-pill active" data-val="semua" onclick="selectFilterBody(this)">Semua</div>
          <div class="filter-pill" data-val="mpv" onclick="selectFilterBody(this)">MPV</div>
          <div class="filter-pill" data-val="suv" onclick="selectFilterBody(this)">SUV</div>
          <div class="filter-pill" data-val="hatchback" onclick="selectFilterBody(this)">Hatchback</div>
          <div class="filter-pill" data-val="sedan" onclick="selectFilterBody(this)">Sedan</div>
          <div class="filter-pill" data-val="commercial" onclick="selectFilterBody(this)">Commercial</div>
        </div>
      </div>
      
      <div style="display:flex; gap:8px;">
        <button onclick="resetFilterPricelist()" style="width:50%; padding:14px; background:#64748b; color:#fff; border:none; border-radius:12px; font-weight:800; font-size:15px; cursor:pointer;">Reset</button>
        <button onclick="applyFilter()" style="width:50%; padding:14px; background:var(--primary-red); color:#fff; border:none; border-radius:12px; font-weight:800; font-size:15px; cursor:pointer; box-shadow:0 4px 12px rgba(212,22,60,0.3);">Terapkan</button>
      </div>
    </div>
  </div>


  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

