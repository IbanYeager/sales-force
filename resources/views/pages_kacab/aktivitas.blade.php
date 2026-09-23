<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Aktivitas Sales</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
  <style>
    .kpi-card.clickable {
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .kpi-card.clickable:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.08);
    }
    .tl-chip.gallery-link {
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tl-chip.gallery-link:hover {
      background: #2563eb;
      color: #ffffff;
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
        <a href="aktivitas.html" id="navAktivitas" class="active"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas"><i class="fa-solid fa-images"></i>Riwayat Foto Aktivitas</a>
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
          <h2 id="pageTitle">Aktivitas Sales</h2>
          <p class="page-sub">Monitoring &amp; timeline aktivitas harian seluruh wiraniaga cabang</p>
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

      <!-- KPI Executive Summary Cards -->
      <div class="grid-4" style="margin-bottom: 18px;">
        <div class="kpi-card" style="border-left: 4px solid #d8a437;">
          <div class="kpi-head">
            <span class="kpi-title">Total Aktivitas Terpantau</span>
            <div class="kpi-icon gold"><i class="fa-solid fa-list-check"></i></div>
          </div>
          <div class="kpi-value" id="kpiTotalAkt">0</div>
          <div class="kpi-sub" id="kpiAktBreakdown">
            <span style="color:#10b981; font-weight:700;" id="kpiAktSelesai">0 Selesai</span> &middot; 
            <span style="color:#f59e0b; font-weight:700;" id="kpiAktProses">0 Proses</span> &middot; 
            <span style="color:#0284c7; font-weight:700;" id="kpiAktRencana">0 Rencana</span>
          </div>
        </div>

        <div class="kpi-card" style="border-left: 4px solid #10b981;">
          <div class="kpi-head">
            <span class="kpi-title">Sales Aktif Lapor Hari Ini</span>
            <div class="kpi-icon green"><i class="fa-solid fa-user-check"></i></div>
          </div>
          <div class="kpi-value" id="kpiSalesAktifHariIni">0 <small style="font-size:13px; color:#64748b;" id="kpiSalesTotalLabel">/ 50 Sales</small></div>
          <div class="kpi-sub">
            <span style="color:#10b981; font-weight:700;" id="kpiSalesAktifPct">0%</span> wiraniaga telah input kegiatan
          </div>
        </div>

        <div class="kpi-card clickable" onclick="openBelumLaporModal()" style="border-left: 4px solid #ef4444;" title="Klik untuk lihat daftar sales yang belum input hari ini">
          <div class="kpi-head">
            <span class="kpi-title" style="color: #b91c1c;">Belum Lapor Hari Ini <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:10px; margin-left:4px;"></i></span>
            <div class="kpi-icon red"><i class="fa-solid fa-user-clock"></i></div>
          </div>
          <div class="kpi-value" style="color:#b91c1c;" id="kpiSalesBelumLapor">0 <small style="font-size:13px; color:#ef4444;">Sales</small></div>
          <div class="kpi-sub">
            <span style="color:#ef4444; font-weight:700;"><i class="fa-solid fa-circle-exclamation"></i> Klik di sini</span> untuk tegur / ingatkan
          </div>
        </div>

        <div class="kpi-card clickable" onclick="location.href='riwayat_foto_aktivitas.html'" style="border-left: 4px solid #2563eb;" title="Buka Galeri Foto Aktivitas & Pameran">
          <div class="kpi-head">
            <span class="kpi-title">Galeri Foto Pameran</span>
            <div class="kpi-icon blue"><i class="fa-solid fa-images"></i></div>
          </div>
          <div class="kpi-value" id="kpiFotoPameran">108+ <small style="font-size:13px; color:#2563eb;">Foto</small></div>
          <div class="kpi-sub">
            <span style="color:#2563eb; font-weight:700;"><i class="fa-solid fa-camera"></i> Buka Galeri Dokumentasi &rarr;</span>
          </div>
        </div>
      </div>

      <div class="kcb-card">
        <div class="toolbar" style="flex-wrap: wrap; gap: 10px;">
          <div class="search-box" style="min-width: 220px; flex: 1.5;">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchActivity" placeholder="Cari nama sales, keterangan, lokasi..."
              oninput="applyTimelineFilters()">
          </div>

          <div class="select-box">
            <i class="fa-solid fa-calendar-days"></i>
            <select id="filterDatePreset" onchange="handleDatePresetChange()">
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="yesterday">Kemarin</option>
              <option value="last7">7 Hari Terakhir</option>
              <option value="thisMonth">Bulan Ini</option>
              <option value="custom">Pilih Tanggal...</option>
            </select>
          </div>

          <div id="customDateRangeBox" style="display: none; align-items: center; gap: 6px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 4px 10px;">
            <input type="date" id="dateStart" onchange="applyTimelineFilters()" style="border:none; background:transparent; font-size:12px; font-weight:600; color:#1e293b; outline:none;">
            <span style="color:#94a3b8; font-size:12px;">s/d</span>
            <input type="date" id="dateEnd" onchange="applyTimelineFilters()" style="border:none; background:transparent; font-size:12px; font-weight:600; color:#1e293b; outline:none;">
          </div>

          <div class="select-box">
            <i class="fa-solid fa-user-tie"></i>
            <select id="filterSpv" onchange="onSpvFilterChange()">
              <option value="">Semua SPV</option>
            </select>
          </div>

          <div class="select-box" style="min-width: 170px;">
            <i class="fa-solid fa-users"></i>
            <select id="filterSales" onchange="applyTimelineFilters()">
              <option value="">Semua Wiraniaga</option>
            </select>
          </div>

          <div class="select-box">
            <i class="fa-solid fa-tag"></i>
            <select id="filterTipe" onchange="applyTimelineFilters()">
              <option value="">Semua Tipe</option>
            </select>
          </div>

          <div class="select-box">
            <i class="fa-solid fa-circle-half-stroke"></i>
            <select id="filterStatus" onchange="applyTimelineFilters()">
              <option value="">Semua Status</option>
              <option value="Rencana">Rencana</option>
              <option value="Sedang Dilakukan">Sedang Dilakukan</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>

          <div class="spacer"></div>
          <span class="result-count" id="activityCount"></span>
        </div>

        <div id="timelineContainer" class="timeline">
          <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat timeline aktivitas...</p>
        </div>
      </div>
    </main>
  </div>

  <!-- Image Zoom Modal -->
  <div id="imageZoomModal" class="zoom-overlay">
    <button class="zoom-close" onclick="closeImageZoom()" aria-label="Tutup foto"><i
        class="fa-solid fa-xmark"></i></button>
    <img id="zoomedImg" src="" alt="Foto aktivitas">
  </div>

  <!-- Activity Detail Modal -->
  <div id="activityDetailModal" class="detail-overlay">
    <div class="detail-modal">
      <div class="detail-header">
        <div class="detail-header-left">
          <div class="detail-header-icon"><i id="detIcon" class="fa-solid fa-list-check"></i></div>
          <div>
            <h3 id="detTitle">Detail Aktivitas</h3>
            <span class="detail-header-sub">Informasi detail perekaman sales</span>
          </div>
        </div>
        <button class="detail-close" onclick="closeActivityDetail()" aria-label="Tutup detail"><i
            class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="detail-body">
        <div class="detail-status-row">
          <span id="detStatusBadge" class="badge badge-approved">Selesai</span>
          <span id="detTime" class="detail-time"><i class="fa-regular fa-clock"></i> -</span>
        </div>

        <div id="detPhotoArea" class="detail-photo-area">
          <div class="detail-photo-main">
            <img id="detMainPhoto" src="" onclick="zoomMainPhoto()" alt="Foto aktivitas">
          </div>
          <div id="detThumbs" class="detail-thumbs"></div>
        </div>

        <div id="detNoPhotoBanner" class="detail-no-photo-banner" style="display:none; align-items:center; gap:12px; padding:12px 16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; margin-bottom:16px; color:#475569; font-size:13px;">
          <div style="width:38px; height:38px; border-radius:8px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:18px;">
            <i class="fa-solid fa-phone-volume"></i>
          </div>
          <div style="flex:1;">
            <div style="font-weight:600; color:#1e293b; font-size:13px; margin-bottom:2px;">Aktivitas Telepon / WhatsApp CRM</div>
            <div style="color:#64748b; font-size:12px; line-height:1.4;">Perekaman aktivitas sistem otomatis tanpa lampiran foto fisik.</div>
          </div>
        </div>

        <div class="detail-info-list">
          <div class="detail-info-row">
            <div class="detail-info-icon violet"><i class="fa-solid fa-user"></i></div>
            <div>
              <div class="detail-info-label">Nama Sales</div>
              <div class="detail-info-value" id="detNamaSalesVal">-</div>
            </div>
          </div>

          <div class="detail-info-row">
            <div class="detail-info-icon gold"><i class="fa-solid fa-user-tie"></i></div>
            <div>
              <div class="detail-info-label">SPV Pembina</div>
              <div class="detail-info-value" id="detSpvVal">-</div>
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
              <div class="detail-info-value" id="detKeteranganVal" style="white-space:pre-wrap; font-weight:500;">-
              </div>
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

  <!-- Modal Sales Belum Lapor Hari Ini -->
  <div id="belumLaporModal" style="display:none; align-items:center; justify-content:center; position:fixed; inset:0; background:rgba(0,0,0,0.65); z-index:99999; backdrop-filter:blur(3px);">
    <div style="background:#ffffff; border-radius:18px; max-width:620px; width:92%; max-height:85vh; display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 45px rgba(0,0,0,0.3); border:1px solid #cbd5e1;">
      <div style="padding:16px 20px; background:linear-gradient(135deg, #1e1014, #3d121c); color:#ffffff; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(216,164,55,0.3);">
        <div>
          <h3 style="margin:0; font-size:16px; font-weight:800; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-user-clock" style="color:#ef4444;"></i>
            Sales Belum Input Aktivitas Hari Ini
          </h3>
          <span style="font-size:11.5px; color:#cbd5e1;" id="belumLaporSubtitle">Wiraniaga yang belum mencatat kegiatan pada sistem</span>
        </div>
        <button type="button" onclick="closeBelumLaporModal()" style="background:rgba(255,255,255,0.15); border:none; color:#ffffff; font-size:16px; cursor:pointer; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div style="padding:12px 20px; background:#fef2f2; border-bottom:1px solid #fee2e2; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
        <span style="font-size:12px; font-weight:800; color:#991b1b;" id="belumLaporCountBadge">0 Sales Belum Lapor</span>
        <button type="button" onclick="broadcastTeguranSPV()" style="background:#25D366; color:#fff; border:none; font-size:11.5px; font-weight:800; border-radius:8px; padding:6px 12px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; box-shadow: 0 2px 6px rgba(37,211,102,0.3);">
          <i class="fa-brands fa-whatsapp"></i> Broadcast Teguran ke SPV
        </button>
      </div>
      <div id="belumLaporList" style="padding:16px 20px; overflow-y:auto; flex:1; display:flex; flex-direction:column; gap:8px;">
        <!-- Filled dynamically -->
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_aktivitas.js?v=20260923_pro_v1"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
