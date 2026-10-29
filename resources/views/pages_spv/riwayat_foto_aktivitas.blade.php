<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Galeri Foto Aktivitas</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/riwayat_foto_aktivitas.css?v={{ time() }}">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
  <style>
    .spv-gallery-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
    }
    .gallery-top-hero {
      background: #0f172a !important;
      border: 1px solid #1e293b;
    }
    .view-mode-btn:hover, .view-mode-btn.active {
      background: #eb0a1e !important;
      color: #ffffff !important;
      border-color: #eb0a1e !important;
    }
    @media print {
      .spv-sidebar, .spv-topbar, .gallery-filter-toolbar, .view-mode-btn, .hero-right-actions, #galleryLightbox, .gallery-toast-notification {
        display: none !important;
      }
      .spv-shell {
        display: block !important;
      }
      .spv-main {
        margin: 0 !important;
        padding: 0 !important;
      }
      .spv-gallery-card {
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      .gallery-top-hero {
        background: #0f172a !important;
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
  <div class="spv-shell">
    <!-- SIDEBAR -->
    <aside class="spv-sidebar">
      <div class="spv-brand-container">
        <div class="spv-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="spv-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-user-tie"></i> SPV PANEL</span>
          <p class="panel-sub">Desktop Supervisor</p>
        </div>
      </div>

      <div class="spv-search-wrap">
        <div class="spv-search-box">
          <i class="fa-solid fa-magnifying-glass spv-search-icon"></i>
          <input type="text" class="spv-search-input" id="spvSearchInput" placeholder="Cari menu & fitur..." autocomplete="off" spellcheck="false">
          <button type="button" class="spv-search-clear" id="spvSearchClear" style="display:none;" title="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="spv-nav">
        <!-- Kategori 1: Overview & Target -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-chart-line"></i> Overview &amp; Target</span>
          <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard SPV</a>
          <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Pencapaian</a>
          <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
          <a href="penjualan_tco.html" id="navTco"><i class="fa-solid fa-gem"></i>Penjualan &amp; Polreg TCO</a>
          <a href="penjualan_merchandise.html" id="navMerchandise"><i class="fa-solid fa-shirt"></i>Penjualan Merchandise</a>
        </div>

        <!-- Kategori 2: Pipeline & Approval -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-funnel-dollar"></i> Pipeline &amp; Approval</span>
          <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
          <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Otorisasi &amp; Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
          <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        </div>

        <!-- Kategori 3: Supervisi Tim Sales -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-users-gear"></i> Supervisi Tim Sales</span>
          <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Tim Wiraniaga</a>
          <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Monitoring Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
          <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas" class="active"><i class="fa-solid fa-images"></i>Galeri Foto Aktivitas</a>
          <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
          <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
          <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        </div>

        <!-- Kategori 4: Stok & Operasional -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-warehouse"></i> Stok &amp; Operasional</span>
          <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
          <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
          <a href="mtoyota_service.html" id="navMtoyota"><i class="fa-solid fa-car-on"></i>m-Toyota &amp; Service</a>
          <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data Cabang</a>
        </div>

        <div class="spv-search-empty" id="spvSearchEmpty" style="display:none;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Menu tidak ditemukan</p>
          <span>Coba gunakan kata kunci lain</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN BODY -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; font-size: 11.5px; color: #64748b; font-weight: 600; margin-bottom: 4px;">
            <span><i class="fa-solid fa-users-gear"></i> Supervisi Tim Sales</span>
            <span>/</span>
            <span style="color: #eb0a1e; font-weight: 700;">Galeri Foto Aktivitas</span>
          </div>
          <h2 id="pageTitle" style="margin: 0; font-size: 20px; font-weight: 800; color: #1e293b;">Galeri Foto Aktivitas</h2>
          <p class="page-sub" style="margin: 3px 0 0; font-size: 12.5px; color: #64748b;">Dokumentasi foto kegiatan pameran, event, dan aktivitas lapangan seluruh tim sales</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Memuat...</span>
          </div>
        </div>
      </div>

      <div class="spv-gallery-card">
        <!-- Top Hero Header Bar -->
        <div class="gallery-top-hero">
          <div class="hero-left">
            <h1>
              <i class="fa-solid fa-images" style="color: #eb0a1e;"></i>
              Galeri Dokumentasi Foto Aktivitas
            </h1>
            <p>Khusus dokumentasi foto kegiatan pameran, event &amp; operasional lapangan cabang</p>
          </div>

          <div class="hero-right-actions">
            <button type="button" class="btn-bulk-upload-trigger" onclick="openBulkUploadModal()" title="Upload Banyak Foto Aktivitas Sekaligus" style="background: linear-gradient(135deg, #eb0a1e, #b30816); color: #ffffff; border: 1px solid rgba(255,255,255,0.25); border-radius: 20px; font-size: 11.5px; font-weight: 800; padding: 6px 16px; display: inline-flex; align-items: center; gap: 7px; cursor: pointer; box-shadow: 0 4px 12px rgba(235,10,30,0.35); transition: all 0.2s;">
              <i class="fa-solid fa-cloud-arrow-up"></i> Upload Banyak Foto
            </button>
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

        <!-- Toolbar Filter Galeri Foto SPV -->
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

          <div style="display: flex; gap: 8px; align-items: center; margin-left: auto;">
            <button type="button" onclick="openBulkUploadModal()" style="background: linear-gradient(135deg, #eb0a1e, #b30816); color: #ffffff; border: none; font-weight: 700; font-size: 12px; border-radius: 8px; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; box-shadow: 0 2px 8px rgba(235,10,30,0.3);">
              <i class="fa-solid fa-cloud-arrow-up"></i> Upload Foto
            </button>
            <button type="button" onclick="printGalleryReport()" style="background: #0f172a; color: #ffffff; border: 1px solid #334155; font-weight: 600; font-size: 12px; border-radius: 8px; padding: 7px 14px; display: inline-flex; align-items: center; gap: 6px; cursor: pointer;">
              <i class="fa-solid fa-print"></i> Cetak Rekap PDF
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div id="galleryLoading" style="text-align:center; padding: 50px 20px; font-size: 13px; color: var(--text-muted);">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 30px; margin-bottom: 12px; color: #eb0a1e;"></i><br>
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
        <button type="button" id="lightboxDeleteBtn" style="background: rgba(220, 38, 38, 0.9); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 2px 8px rgba(220,38,38,0.4);" onclick="deleteCurrentLightboxPhoto(event)" title="Hapus Foto">
          <i class="fa-solid fa-trash-can"></i>
        </button>
        <button type="button" style="background: rgba(100, 116, 139, 0.85); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;" onclick="closeGalleryLightbox()" title="Tutup">
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

  <!-- Modal Bulk Upload Foto Aktivitas -->
  @include('pages_kacab.modal_upload_banyak_foto')

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/riwayat_foto_aktivitas.js?v=20261029_spv_sync"></script>
  <script src="../js/kacab_bulk_upload.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20261021_v20"></script>
</body>

</html>

