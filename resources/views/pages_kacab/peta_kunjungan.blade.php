<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Google Maps Peta Kunjungan Lapangan</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <link rel="stylesheet" href="../css/style_kacab.css">
  <style>
    /* =============================================
       STYLESHEET ULTRA-PREMIUM GOOGLE MAPS KACAB PANEL
       ============================================= */
    /* Global Viewport Lock for Desktop Map */
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
    }

    .kpi-summary-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 12px;
    }

    .kss-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
    }

    .kss-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .kss-icon.red { background: #fef2f2; color: #cc1426; }
    .kss-icon.gold { background: #fffbeb; color: #b45309; }
    .kss-icon.blue { background: #eff6ff; color: #1d4ed8; }
    .kss-icon.green { background: #f0fdf4; color: #15803d; }

    .kss-info .title { font-size: 10.5px; font-weight: 700; color: var(--muted); display: block; }
    .kss-info .val { font-size: 17px; font-weight: 900; color: var(--text); }

    .map-layout {
      display: grid;
      grid-template-columns: 1fr 390px;
      grid-template-rows: minmax(0, 1fr);
      gap: 16px;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      flex: 1 1 0;
      overflow: hidden;
    }

    .map-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      min-height: 0;
    }

    /* Google Maps Bar Control Header */
    .gmaps-header-bar {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 500;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(226, 232, 240, 0.9);
      border-radius: 14px;
      padding: 6px 10px;
      display: flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .gmaps-title {
      font-size: 12px;
      font-weight: 800;
      color: #1e1014;
      display: flex;
      align-items: center;
      gap: 6px;
      padding-right: 10px;
      border-right: 1px solid #e2e8f0;
    }

    .map-layer-btn {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      color: #475569;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }

    .map-layer-btn:hover {
      background: #f1f5f9;
      color: #0f172a;
    }

    .map-layer-btn.active {
      background: #1e1014;
      color: #f3c96a;
      box-shadow: 0 2px 8px rgba(30, 16, 20, 0.2);
    }

    #visitMap {
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    /* Custom Google Marker Pin */
    .gmaps-custom-marker {
      position: relative;
    }

    .gmaps-pin {
      width: 34px;
      height: 34px;
      border-radius: 50% 50% 50% 0;
      background: linear-gradient(135deg, #cc1426, #8a0f1b);
      position: absolute;
      transform: rotate(-45deg);
      left: 50%;
      top: 50%;
      margin: -17px 0 0 -17px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 14px rgba(204, 20, 38, 0.4);
      border: 2px solid white;
    }

    .gmaps-pin.pin-offline {
      background: linear-gradient(135deg, #64748d, #334155);
      box-shadow: 0 4px 10px rgba(51, 65, 85, 0.3);
    }

    .gmaps-pin i {
      transform: rotate(45deg);
      color: white;
      font-size: 14px;
    }

    .gmaps-pulse {
      background: rgba(204, 20, 38, 0.25);
      border-radius: 50%;
      height: 14px;
      width: 14px;
      position: absolute;
      left: 50%;
      top: 50%;
      margin: 10px 0 0 -7px;
      transform: rotateX(55deg);
      z-index: -1;
      animation: pulse-ring 1.8s ease-out infinite;
    }

    @keyframes pulse-ring {
      0% { transform: rotateX(55deg) scale(0.5); opacity: 1; }
      100% { transform: rotateX(55deg) scale(2.8); opacity: 0; }
    }

    /* Popup Box */
    .gmaps-popup-box {
      font-family: 'Plus Jakarta Sans', sans-serif;
      padding: 4px;
      max-width: 240px;
    }

    .gpu-badge {
      display: inline-block;
      padding: 3px 8px;
      background: #fdf0f1;
      color: #cc1426;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .gpu-name {
      font-size: 14px;
      font-weight: 800;
      color: #1e1014;
      margin: 0 0 2px 0;
    }

    .gpu-spv {
      font-size: 11px;
      color: #64748d;
      margin: 0 0 6px 0;
    }

    .gpu-loc {
      font-size: 12px;
      font-weight: 700;
      color: #1e1014;
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .gpu-img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 8px;
    }

    .gpu-meta {
      font-size: 10px;
      color: #94a3b8;
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .btn-gmaps-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background: #4285F4;
      color: white;
      text-decoration: none;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      transition: background 0.2s;
    }

    .btn-gmaps-link:hover {
      background: #2b6cb0;
    }

    /* Filter & Search Panel */
    .map-sidebar-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 18px 20px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      height: 100%;
      max-height: 100%;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .filter-section-title {
      font-size: 14px;
      font-weight: 800;
      color: #1e1014;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      letter-spacing: -0.3px;
      flex-shrink: 0;
    }

    .filter-section-title .title-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .filter-section-title .title-icon-badge {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #fdf6e9;
      color: #d8a437;
      border: 1px solid #fef08a;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .sales-counter-pill {
      font-size: 11px;
      font-weight: 700;
      background: #f1f5f9;
      color: #64748d;
      padding: 3px 8px;
      border-radius: 999px;
      letter-spacing: normal;
    }

    .map-search-wrap {
      position: relative;
      margin-bottom: 10px;
      flex-shrink: 0;
    }

    .map-search-wrap i.search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #d8a437;
      font-size: 14px;
      pointer-events: none;
      z-index: 2;
    }

    .input-search-styled {
      width: 100%;
      padding: 11px 14px 11px 40px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: #1e293b;
      outline: none;
      transition: all 0.25s ease;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
      box-sizing: border-box;
    }

    .input-search-styled::placeholder {
      color: #94a3b8;
      font-weight: 500;
    }

    .input-search-styled:hover {
      background: #ffffff;
      border-color: #cbd5e1;
    }

    .input-search-styled:focus {
      background: #ffffff;
      border-color: #d8a437;
      box-shadow: 0 0 0 3.5px rgba(216, 164, 55, 0.18), 0 4px 12px rgba(0, 0, 0, 0.03);
    }

    .filter-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 12px;
      flex-shrink: 0;
    }

    .select-dropdown-styled {
      width: 100%;
      padding: 10px 30px 10px 12px;
      background: #f8fafc url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23d8a437'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2.5' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E") no-repeat right 10px center / 13px 13px;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      font-size: 11.5px;
      font-weight: 700;
      color: #1e1014;
      outline: none;
      cursor: pointer;
      appearance: none;
      -webkit-appearance: none;
      -moz-appearance: none;
      transition: all 0.25s ease;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.02);
      box-sizing: border-box;
    }

    .select-dropdown-styled:hover {
      background-color: #ffffff;
      border-color: #cbd5e1;
    }

    .select-dropdown-styled:focus {
      background-color: #ffffff;
      border-color: #d8a437;
      box-shadow: 0 0 0 3.5px rgba(216, 164, 55, 0.18);
    }

    .map-list-scroll {
      flex: 1 1 0;
      min-height: 0;
      height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-right: 6px;
      overscroll-behavior: contain;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    /* Modern Custom Scrollbar for Sales List */
    .map-list-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .map-list-scroll::-webkit-scrollbar-track {
      background: #f8fafc;
      border-radius: 6px;
    }

    .map-list-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 6px;
      transition: background 0.2s;
    }

    .map-list-scroll::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    .map-list-scroll {
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f8fafc;
    }

    .map-list-item {
      background: var(--surface-2);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 10px 12px;
      margin-bottom: 0;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      flex-shrink: 0;
    }

    .map-list-item:hover {
      background: #fdf6e9;
      border-color: #fde68a;
      transform: translateX(2px);
    }

    .mli-avatar {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: linear-gradient(135deg, #1e1014, #3b141d);
      color: var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }

    .mli-body {
      flex: 1;
      min-width: 0;
    }

    .mli-sales {
      font-size: 13px;
      font-weight: 800;
      color: var(--text);
      line-height: 1.2;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mli-spv {
      font-size: 11px;
      color: var(--muted);
      margin-bottom: 3px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .mli-type {
      font-size: 11px;
      font-weight: 700;
      color: var(--brand);
      margin-bottom: 2px;
    }

    .mli-loc {
      font-size: 11px;
      color: var(--text-2);
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .mli-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 6px;
      flex-shrink: 0;
    }

    .mli-time {
      font-size: 10px;
      color: var(--muted);
      text-align: right;
      line-height: 1.2;
    }

    .btn-focus-map {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: white;
      border: 1px solid var(--border);
      color: var(--brand);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      transition: all 0.2s;
    }

    .btn-focus-map:hover {
      background: var(--brand);
      color: white;
      border-color: var(--brand);
    }

    /* Desktop Viewport Specifics */
    @media (min-width: 993px) {
      body {
        overflow: hidden;
        height: 100vh;
        height: 100dvh;
      }

      .kcb-shell {
        height: 100vh;
        height: 100dvh;
        max-height: 100vh;
        overflow: hidden;
      }

      .kcb-main {
        height: 100vh;
        height: 100dvh;
        max-height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 16px 24px;
        overflow: hidden;
        box-sizing: border-box;
      }

      .kcb-topbar {
        flex-shrink: 0;
        margin-bottom: 12px;
      }

      .kpi-summary-strip {
        flex-shrink: 0;
        margin-bottom: 12px;
      }
    }

    /* Mobile & Tablet Responsive */
    @media (max-width: 992px) {
      body {
        overflow-y: auto;
      }

      .kcb-shell {
        min-height: 100vh;
        height: auto;
      }

      .kcb-main {
        height: auto;
        padding: 16px;
      }

      .kpi-summary-strip {
        grid-template-columns: repeat(2, 1fr);
      }

      .map-layout {
        display: flex;
        flex-direction: column;
        gap: 16px;
        height: auto;
      }

      .map-card {
        height: 400px;
        min-height: 400px;
        border-radius: 18px;
      }

      #visitMap {
        height: 400px;
        min-height: 400px;
      }

      .map-sidebar-card {
        height: auto;
        max-height: 520px;
        padding: 16px;
        border-radius: 18px;
      }

      .map-list-scroll {
        max-height: 350px;
        overflow-y: auto;
      }
    }
  </style>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
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
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 46 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta" class="active"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
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
          <h2 id="pageTitle">Google Maps Peta Kunjungan Lapangan</h2>
          <p class="page-sub">Monitoring geotagging lokasi real-time seluruh Sales Consultant cabang pada Google Maps</p>
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

      <!-- KPI STRIP -->
      <div class="kpi-summary-strip">
        <div class="kss-card">
          <div class="kss-icon red"><i class="fa-solid fa-location-dot"></i></div>
          <div class="kss-info">
            <span class="title">Total Check-in Lokasi</span>
            <div class="val" id="kpiTotalCheckin">0</div>
          </div>
        </div>
        <div class="kss-card">
          <div class="kss-icon gold"><i class="fa-solid fa-store"></i></div>
          <div class="kss-info">
            <span class="title">Pameran & Booth</span>
            <div class="val" id="kpiPameran">0</div>
          </div>
        </div>
        <div class="kss-card">
          <div class="kss-icon blue"><i class="fa-solid fa-user-check"></i></div>
          <div class="kss-info">
            <span class="title">Kunjungan Prospek</span>
            <div class="val" id="kpiProspek">0</div>
          </div>
        </div>
        <div class="kss-card">
          <div class="kss-icon green"><i class="fa-solid fa-map-location-dot"></i></div>
          <div class="kss-info">
            <span class="title">Canvassing Wilayah</span>
            <div class="val" id="kpiCanvassing">0</div>
          </div>
        </div>
      </div>

      <!-- MAP LAYOUT GRID -->
      <div class="map-layout">
        <!-- MAP AREA -->
        <div class="map-card">
          <!-- Google Maps Layer Control Header -->
          <div class="gmaps-header-bar">
            <div class="gmaps-title">
              <i class="fa-solid fa-map" style="color:#4285F4;"></i> Google Maps
            </div>
            <button id="btnLayerRoadmap" class="map-layer-btn active" onclick="switchMapLayer('roadmap')">Peta Google</button>
            <button id="btnLayerSatellite" class="map-layer-btn" onclick="switchMapLayer('satellite')">Satelit</button>
            <button id="btnLayerTerrain" class="map-layer-btn" onclick="switchMapLayer('terrain')">Medan</button>
          </div>

          <div id="visitMap"></div>
        </div>

        <!-- SIDEBAR PANEL LIST & FILTER (NEW ULTRA-STYLED) -->
        <div class="map-sidebar-card">
          <h3 class="filter-section-title">
            <div class="title-left">
              <span class="title-icon-badge"><i class="fa-solid fa-sliders"></i></span>
              <span>Filter & Pencarian</span>
            </div>
            <span class="sales-counter-pill" id="salesCounterBadge">Memuat...</span>
          </h3>

          <div class="map-search-wrap">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input type="text" id="inputSearchMap" class="input-search-styled" placeholder="Cari nama sales atau lokasi..." onkeyup="applyMapFilter()" />
          </div>

          <div class="filter-grid">
            <select id="selectFilterSpv" class="select-dropdown-styled" onchange="applyMapFilter()">
              <option value="Semua">Semua SPV</option>
            </select>

            <select id="selectFilterJenis" class="select-dropdown-styled" onchange="applyMapFilter()">
              <option value="Semua">Semua Jenis</option>
              <option value="Pameran Display">Pameran</option>
              <option value="Kunjungan Prospek">Prospek</option>
              <option value="Canvassing Wilayah">Canvassing</option>
              <option value="Test Drive Customer">Test Drive</option>
            </select>
          </div>

          <div class="map-list-scroll" id="checkinListContainer">
            <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat titik Google Maps...</p>
          </div>
        </div>
      </div>
    </main>
  </div>

  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_peta.js?v=20260904_scrollfix"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
