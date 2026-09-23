<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Galeri Foto Aktivitas</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/riwayat_foto_aktivitas.css?v=20260923_kacab_sync">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
  <style>
    .kcb-gallery-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
    }
    .gallery-top-hero {
      background: linear-gradient(135deg, #1e1014 0%, #3d121c 50%, #1e293b 100%) !important;
      border: 1px solid rgba(216, 164, 55, 0.25);
    }
    .view-mode-btn:hover, .view-mode-btn.active {
      background: #d8a437 !important;
      color: #1e1014 !important;
      border-color: #d8a437 !important;
    }
    @media print {
      .kcb-sidebar, .kcb-topbar, .gallery-filter-toolbar, .view-mode-btn, .hero-right-actions, #galleryLightbox, .gallery-toast-notification {
        display: none !important;
      }
      .kcb-shell {
        display: block !important;
      }
      .kcb-main {
        margin: 0 !important;
        padding: 0 !important;
      }
      .kcb-gallery-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .gallery-top-hero {
        background: #1e1014 !important;
        color: #ffffff !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin-bottom: 20px !important;
      }
      .compact-photo-grid {
        grid-template-columns: repeat(4, 1fr) !important;
        gap: 10px !important;
      }
      .gallery-photo-card {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
        height: 180px !important;
      }
    }
  </style>
</head>

<body>
  <div class="kcb-shell">
    <!-- SIDEBAR -->
    <aside class="kcb-sidebar">
      <div class="kcb-brand-container">
        <div class="kcb-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="kcb-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-building-user"></i> KACAB PANEL</span>
          <p class="panel-sub">Kepala Cabang</p>
        </div>
      </div>

      <nav class="kcb-nav">
        <a href="index_kacab.html" id="navDash"><i class="fa-solid fa-gauge-high"></i>Dashboard Cabang</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i>After Sales</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas" class="active"><i class="fa-solid fa-images"></i>Riwayat Foto Aktivitas</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="performa_regional.html" id="navRegional"><i class="fa-solid fa-earth-asia"></i>Performa Regional Jabar</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Galeri Foto Aktivitas</h2>
          <p class="page-sub">Dokumentasi foto kegiatan pameran, event, dan aktivitas lapangan seluruh sales cabang</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Memuat...</span>
            <span class="role" id="kcbRole">Memuat...</span>
          </div>
        </div>
      </div>

      <div class="kcb-gallery-card">
        <!-- Top Hero Header Bar -->
        <div class="gallery-top-hero">
          <div class="hero-left">
            <h1>
              <i class="fa-solid fa-images" style="color: #d8a437;"></i>
              Galeri Dokumentasi Foto Cabang
            </h1>
            <p>Khusus dokumentasi foto kegiatan pameran &amp; event cabang Kiaracondong</p>
          </div>

          <div class="hero-right-actions">
            <div style="background: rgba(255,255,255,0.15); padding: 6px 14px; border-radius: 20px; font-size: 11.5px; font-weight: 800; color: #ffffff; border: 1px solid rgba(216,164,55,0.3);">
              <i class="fa-solid fa-camera"></i> <span id="photoTotalCount">...</span> Foto
            </div>
            <button type="button" class="view-mode-btn active" id="btnGridCompact" onclick="setViewDensity('compact')" title="Grid Rapat (Banyak Foto Sekaligus)">
              <i class="fa-solid fa-grip"></i>
            </button>
            <button type="button" class="view-mode-btn" id="btnGridNormal" onclick="setViewDensity('normal')" title="Grid Sedang">
              <i class="fa-solid fa-table-cells-large"></i>
            </button>
          </div>
        </div>

        <!-- Toolbar Filter Galeri Foto Kacab -->
        <div class="gallery-filter-toolbar" style="margin-top: 14px; margin-bottom: 14px; display: flex; flex-wrap: wrap; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px 14px; align-items: center;">
          <div class="search-box" style="min-width: 220px; flex: 1.5; display: flex; align-items: center; gap: 8px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 12px;">
            <i class="fa-solid fa-magnifying-glass" style="color: #94a3b8;"></i>
            <input type="text" id="gallerySearchInput" placeholder="Cari foto sales, keterangan, lokasi..." oninput="handleGallerySearch(this.value)" style="border:none; outline:none; font-size:12.5px; width:100%; color:#1e293b;">
          </div>

          <div class="select-box" style="display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 10px;">
            <i class="fa-solid fa-location-dot" style="color: #c8102e; font-size: 12px;"></i>
            <select id="galleryFilterLocation" onchange="applyGalleryDropdownFilters()" style="border:none; outline:none; font-size:12px; font-weight:600; color:#1e293b; background:transparent; cursor:pointer;">
              <option value="">Semua Lokasi Pameran</option>
              <option value="tsm">MALL TSM</option>
              <option value="paskal">MALL PASKAL 23</option>
              <option value="citylink">FESTIVAL CITYLINK</option>
              <option value="miko">MIKO MALL</option>
              <option value="borma">BORMA MARGACINTA / KIRCON</option>
              <option value="kings">THE KINGS</option>
              <option value="cimall">CIMAHI MALL</option>
            </select>
          </div>

          <div class="select-box" style="display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 10px;">
            <i class="fa-solid fa-user-tie" style="color: #d97706; font-size: 12px;"></i>
            <select id="galleryFilterSpv" onchange="onGallerySpvChange()" style="border:none; outline:none; font-size:12px; font-weight:600; color:#1e293b; background:transparent; cursor:pointer;">
              <option value="">Semua SPV</option>
            </select>
          </div>

          <div class="select-box" style="display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 10px; min-width: 160px;">
            <i class="fa-solid fa-users" style="color: #2563eb; font-size: 12px;"></i>
            <select id="galleryFilterSales" onchange="applyGalleryDropdownFilters()" style="border:none; outline:none; font-size:12px; font-weight:600; color:#1e293b; background:transparent; cursor:pointer; width:100%;">
              <option value="">Semua Wiraniaga</option>
            </select>
          </div>

          <div class="select-box" style="display: flex; align-items: center; gap: 6px; background: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 4px 10px;">
            <i class="fa-solid fa-clock" style="color: #059669; font-size: 12px;"></i>
            <select id="galleryFilterSession" onchange="applyGalleryDropdownFilters()" style="border:none; outline:none; font-size:12px; font-weight:600; color:#1e293b; background:transparent; cursor:pointer;">
              <option value="">Semua Sesi</option>
              <option value="Pagi">Pagi</option>
              <option value="Siang">Siang</option>
              <option value="Sore">Sore</option>
              <option value="Malam">Malam</option>
            </select>
          </div>

          <button type="button" onclick="printGalleryReport()" style="background: linear-gradient(135deg, #1e1014, #3d121c); color: #d8a437; border: 1px solid rgba(216,164,55,0.4); font-weight: 800; font-size: 12px; border-radius: 8px; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin-left: auto;">
            <i class="fa-solid fa-print"></i> Cetak Rekap PDF
          </button>
        </div>

        <!-- Loading State -->
        <div id="galleryLoading" style="text-align:center; padding: 50px 20px; font-size: 13px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 30px; margin-bottom: 12px; color: #d8a437;"></i><br>
          Memuat seluruh foto aktivitas cabang...
        </div>

        <!-- Timeline & Photo Wall Container -->
        <div id="galleryContainer"></div>
      </div>
    </main>
  </div>

  <!-- Fullscreen Lightbox Modal -->
  <div id="galleryLightbox" class="gallery-lightbox-modal">
    <div class="lightbox-top-bar">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 13px; font-weight: 800;" id="lightboxDateLabel">Foto Aktivitas</span>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button type="button" id="lightboxShareWABtn" style="background: #25D366; border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 8px rgba(37,211,102,0.4);" onclick="shareCurrentPhoto()" title="Kirim Foto ke WhatsApp">
          <i class="fa-brands fa-whatsapp"></i>
        </button>
        <a id="lightboxDownloadBtn" href="#" download style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none;" title="Unduh Foto">
          <i class="fa-solid fa-download"></i>
        </a>
        <button type="button" style="background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;" onclick="closeGalleryLightbox()" title="Tutup">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <div class="lightbox-img-stage">
      <button type="button" class="lightbox-nav-btn prev" onclick="prevLightboxPhoto(event)">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      
      <img id="lightboxMainImage" src="" alt="Foto Aktivitas Sales">

      <button type="button" class="lightbox-nav-btn next" onclick="nextLightboxPhoto(event)">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="lightbox-bottom-info">
      <div>
        <div style="font-size: 12px; opacity: 0.9;" id="lightboxFilenameLabel">Foto Kegiatan</div>
      </div>
      <div style="font-size: 12px; font-weight: 700; opacity: 0.9;" id="lightboxIndexCounter">
        Foto 1 dari 121
      </div>
    </div>
  </div>

  <!-- Floating Gallery Toast Notification -->
  <div id="galleryToast" class="gallery-toast-notification"></div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/riwayat_foto_aktivitas.js?v=20260923_kacab_sync"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
