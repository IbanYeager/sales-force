<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Aktivitas Tim</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/spv_aktivitas.css">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
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

      <nav class="spv-nav">
        <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas" class="active"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
        <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data</a>
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
          <h2 id="pageTitle">Aktivitas Tim</h2>
          <p class="page-sub">Monitoring aktivitas terbaru dari wiraniaga Anda</p>
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

      <!-- Main Content Container -->
      <div class="spv-card">
        <div class="toolbar">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchActivity" placeholder="Cari nama sales atau keterangan..."
              oninput="applyActivityFilters()">
          </div>
          <div class="select-box">
            <i class="fa-solid fa-tag"></i>
            <select id="filterTipe" onchange="applyActivityFilters()">
              <option value="">Semua Tipe</option>
            </select>
          </div>
          <div class="select-box">
            <i class="fa-solid fa-circle-half-stroke"></i>
            <select id="filterStatus" onchange="applyActivityFilters()">
              <option value="">Semua Status</option>
              <option value="Rencana">Rencana</option>
              <option value="Sedang Dilakukan">Sedang Dilakukan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
          <div class="select-box">
            <i class="fa-solid fa-clock"></i>
            <select id="filterSesi" onchange="applyActivityFilters()">
              <option value="">Semua Sesi Waktu</option>
              <option value="Pagi">Sesi Pagi</option>
              <option value="Siang">Sesi Siang</option>
              <option value="Sore">Sesi Sore</option>
            </select>
          </div>
          <div class="spacer"></div>
          <span class="result-count" id="activityCount"></span>
        </div>

        <div id="activityContainer" class="activity-list">
          <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
        </div>
      </div>
    </main>
  </div>

  <!-- Image Zoom Modal -->
  <div id="imageZoomModal" class="zoom-overlay">
    <button class="zoom-close" onclick="closeImageZoom()"><i class="fa-solid fa-xmark"></i></button>
    <img id="zoomedImg" src="" alt="Foto aktivitas">
  </div>

  <!-- Activity Detail Modal -->
  <div id="activityDetailModal" class="detail-overlay">
    <div class="detail-modal">
      <!-- Modal Header -->
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-header-icon"><i id="detIcon" class="fa-solid fa-list-check"></i></div>
          <div>
            <h3 id="detTitle">Detail Aktivitas</h3>
            <span class="detail-header-sub">Informasi detail perekaman sales</span>
          </div>
        </div>
        <button class="detail-close" onclick="closeActivityDetail()"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Modal Body -->
      <div class="detail-body">
        <!-- Status & Time -->
        <div class="detail-status-row">
          <span id="detStatusBadge" class="badge badge-approved">Selesai</span>
          <span id="detTime" class="detail-time"><i class="fa-regular fa-clock"></i> -</span>
        </div>

        <!-- Photo Section -->
        <div id="detPhotoArea" class="detail-photo-area">
          <div class="detail-photo-main">
            <img id="detMainPhoto" src="" onclick="zoomMainPhoto()" alt="Foto aktivitas">
          </div>
          <div id="detThumbs" class="detail-thumbs"></div>
        </div>

        <!-- Info rows -->
        <div class="detail-info-list">
          <div class="detail-info-row">
            <div class="detail-info-icon violet"><i class="fa-solid fa-user-tie"></i></div>
            <div>
              <div class="detail-info-label">Nama Sales</div>
              <div class="detail-info-value" id="detNamaSalesVal">-</div>
            </div>
          </div>

          <div class="detail-info-row">
            <div class="detail-info-icon blue"><i class="fa-solid fa-tag"></i></div>
            <div>
              <div class="detail-info-label">Tipe Aktivitas</div>
              <div class="detail-info-value" id="detTipeVal">-</div>
            </div>
          </div>

          <div class="detail-info-row">
            <div class="detail-info-icon blue"><i class="fa-solid fa-align-left"></i></div>
            <div style="flex:1;">
              <div class="detail-info-label">Keterangan</div>
              <div class="detail-info-value" id="detKeteranganVal" style="white-space:pre-wrap; font-weight:500;">-</div>
            </div>
          </div>

          <div class="detail-info-row" style="flex-direction:column; align-items:stretch; gap:10px;">
            <div style="display:flex; gap:12px; align-items:flex-start;">
              <div class="detail-info-icon green"><i class="fa-solid fa-location-dot"></i></div>
              <div>
                <div class="detail-info-label">Lokasi</div>
                <div class="detail-info-value" id="detLokasiVal">-</div>
              </div>
            </div>
            <a id="detMapBtn" href="#" target="_blank" class="detail-map-btn">
              <i class="fa-solid fa-map-location-dot"></i> Buka Lokasi di Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_aktivitas.js?v=20260819_master"></script>

  <script src="../js/pwa-app.js?v=3"></script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
