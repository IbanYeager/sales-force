<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - After Sales Intelligence Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
  <style>
    @media (min-width: 901px) {
      html, body.kacab-theme {
        height: 100vh;
        overflow: hidden;
      }
      .kcb-shell {
        height: 100vh;
        overflow: hidden;
      }
      .kcb-main {
        height: 100vh;
        display: flex;
        flex-direction: column;
        padding: 12px 18px 14px !important;
        overflow: hidden;
      }
    }

    .kcb-topbar {
      margin-bottom: 8px !important;
      padding-bottom: 0 !important;
      flex-shrink: 0;
    }

    .afs-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-height: 0;
      margin-top: 0;
    }

    .afs-action-bar {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 7px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
      flex-shrink: 0;
    }

    .afs-badge-live {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      padding: 4px 11px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 800;
      letter-spacing: 0.3px;
    }

    .afs-pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.3);
      animation: pulseLive 2s infinite;
    }

    @keyframes pulseLive {
      0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
      70% { transform: scale(1); box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
      100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }

    .afs-btn-group {
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    }

    .afs-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.18s ease;
      border: 1px solid transparent;
    }

    .afs-btn-outline {
      background: #f8fafc;
      color: #334155;
      border-color: #cbd5e1;
    }

    .afs-btn-outline:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .afs-btn-gold {
      background: linear-gradient(135deg, #d8a437 0%, #b45309 100%);
      color: #ffffff;
      box-shadow: 0 3px 10px rgba(180, 83, 9, 0.2);
    }

    .afs-btn-gold:hover {
      transform: translateY(-1px);
      box-shadow: 0 5px 14px rgba(180, 83, 9, 0.3);
      color: #ffffff;
    }

    .afs-frame-container {
      position: relative;
      width: 100%;
      flex: 1;
      min-height: 0;
      height: 100%;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
    }

    .afs-frame-container.is-fullscreen {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 99999;
      border-radius: 0;
      border: none;
    }

    .afs-iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    .afs-loader-overlay {
      position: absolute;
      inset: 0;
      background: rgba(248, 250, 252, 0.95);
      backdrop-filter: blur(4px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      z-index: 10;
      transition: opacity 0.3s ease, visibility 0.3s ease;
    }

    .afs-loader-overlay.hidden {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }

    .afs-spinner {
      width: 36px;
      height: 36px;
      border: 3.5px solid #e2e8f0;
      border-top-color: #d8a437;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>

<body class="kacab-theme">
  <div class="kcb-shell">
    <!-- SIDEBAR KACAB -->
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
        <a href="after_sales.html" id="navAfterSales" class="active"><i class="fa-solid fa-wrench"></i>After Sales</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi &amp; Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas &amp; Riwayat Sales</a>
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

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <!-- TOPBAR -->
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-wrench" style="color:#d8a437;"></i> After Sales Intelligence &amp; Performance
          </h2>
          <p class="page-sub">Monitoring terpadu operasional bengkel: realisasi CPUS, Unit Entry, Revenue Jasa &amp; Part, T-Care, serta produktivitas Service Advisor</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kacabAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" alt="Avatar">
            <span class="dot" style="background:#d8a437;"></span>
          </div>
          <div class="meta">
            <span class="name" id="kacabNama">Memuat...</span>
            <span class="role" id="kacabRole">Kepala Cabang</span>
          </div>
        </div>
      </div>

      <div class="afs-wrapper">
        <!-- ACTION CONTROLS BAR -->
        <div class="afs-action-bar">
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <div class="afs-badge-live" title="Live terhubung dengan server Vercel & database Google Spreadsheet">
              <span class="afs-pulse-dot"></span>
              <span>BENGKEL KIARACONDONG #146 • LIVE</span>
            </div>
            <div style="font-size:12px; color:#64748b;">
              <i class="fa-solid fa-user-gear" style="color:#0284c7; margin-right:4px;"></i> SA: <strong>DIDIN, FICKY, ACEP</strong>
            </div>
          </div>

          <div class="afs-btn-group">
            <button type="button" class="afs-btn afs-btn-outline" onclick="reloadAfterSalesFrame()" title="Muat ulang data dashboard">
              <i class="fa-solid fa-rotate-right"></i> Refresh
            </button>
            <button type="button" class="afs-btn afs-btn-outline" onclick="toggleFullscreenFrame()" id="btnFullscreen" title="Tampilkan layar penuh">
              <i class="fa-solid fa-expand"></i> Layar Penuh
            </button>
            <a href="https://dashboard-bengkel-kiaracondong.vercel.app/" target="_blank" rel="noopener noreferrer" class="afs-btn afs-btn-gold" title="Buka dashboard langsung di tab baru">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Tab Baru
            </a>
          </div>
        </div>

        <!-- EMBEDDED DASHBOARD FRAME CONTAINER -->
        <div class="afs-frame-container" id="frameContainer">
          <!-- Loading Spinner -->
          <div class="afs-loader-overlay" id="frameLoader">
            <div class="afs-spinner"></div>
            <div style="font-size:13px; font-weight:700; color:#1e293b;">
              Memuat After Sales Intelligence Dashboard...
            </div>
            <div style="font-size:11px; color:#64748b;">
              Sinkronisasi data realisasi CPUS &amp; Revenue Bengkel Kiaracondong
            </div>
          </div>

          <!-- Embedded Iframe -->
          <iframe
            id="aftersalesFrame"
            src="https://dashboard-bengkel-kiaracondong.vercel.app/?embed=true"
            class="afs-iframe"
            title="Aftersales Intelligence Dashboard Kiaracondong"
            onload="onFrameLoaded()"
            allow="fullscreen">
          </iframe>
        </div>
      </div>
    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
  <script>
    function onFrameLoaded() {
      const loader = document.getElementById('frameLoader');
      if (loader) {
        loader.classList.add('hidden');
      }
    }

    function reloadAfterSalesFrame() {
      const loader = document.getElementById('frameLoader');
      const frame = document.getElementById('aftersalesFrame');
      const btn = event ? (event.currentTarget || event.target.closest('button')) : null;
      if (btn) {
        const icon = btn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        setTimeout(() => { if (icon) icon.classList.remove('fa-spin'); }, 1200);
      }
      if (loader) loader.classList.remove('hidden');
      if (frame) {
        frame.src = 'https://dashboard-bengkel-kiaracondong.vercel.app/?embed=true&t=' + Date.now();
      }
    }

    function toggleFullscreenFrame() {
      const container = document.getElementById('frameContainer');
      const btn = document.getElementById('btnFullscreen');
      if (!container) return;

      if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          container.msRequestFullscreen();
        }
        container.classList.add('is-fullscreen');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-compress"></i> Perkecil';
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
        container.classList.remove('is-fullscreen');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i> Layar Penuh';
      }
    }

    document.addEventListener('fullscreenchange', () => {
      const container = document.getElementById('frameContainer');
      const btn = document.getElementById('btnFullscreen');
      if (!document.fullscreenElement && container) {
        container.classList.remove('is-fullscreen');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-expand"></i> Layar Penuh';
      }
    });
  </script>
</body>

</html>
