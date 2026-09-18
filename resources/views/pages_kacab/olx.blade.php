<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Manajemen &amp; Pengaturan Hasil OLX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260918_v1">
  <link rel="stylesheet" href="../css/spv_olx.css?v=20260918_v1">

  <style>
    /* Critical styling fallback untuk mencegah tampilan unstyled jika CSS external ter-cache */
    .olx-board-hero {
      background: linear-gradient(135deg, #700018 0%, #a30826 35%, #1e1b4b 100%) !important;
      border-radius: 20px !important;
      padding: 24px 28px !important;
      color: #ffffff !important;
      margin-bottom: 26px !important;
      box-shadow: 0 10px 30px -5px rgba(163, 8, 38, 0.35) !important;
      position: relative !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
    }
    .olx-board-title-group h2 {
      color: #ffffff !important;
      margin: 0;
      font-size: 22px;
      font-weight: 900;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .olx-matrix-card {
      background: #ffffff !important;
      border-radius: 18px !important;
      border: 1px solid #e2e8f0 !important;
      overflow: hidden !important;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03) !important;
      margin-bottom: 26px !important;
    }
    .olx-matrix-header {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%) !important;
      color: #ffffff !important;
      padding: 16px 22px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 12px !important;
    }
    .olx-matrix-table thead th {
      background: #1e3a8a !important;
      color: #ffffff !important;
      font-weight: 800 !important;
      padding: 12px 14px !important;
      vertical-align: middle !important;
    }
    .olx-matrix-spv-avatar {
      width: 52px !important;
      height: 52px !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      object-position: top center !important;
      border: 2px solid #ffffff !important;
      box-shadow: 0 3px 8px rgba(0,0,0,0.25) !important;
      display: block !important;
      margin: 0 auto 4px !important;
    }
  </style>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
</head>

<body class="kacab-theme">
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
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx" class="active"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i>After Sales</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi &amp; Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas &amp; Riwayat Sales</a>
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
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-repeat" style="color:#d8a437;"></i> Pusat Manajemen &amp; Hasil Trade-In OLX
          </h2>
          <p class="page-sub">Otoritas Kepala Cabang: Atur status deal, tetapkan harga appraisal, &amp; monitoring rekap pencapaian cabang</p>
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

      <!-- HERO SHOWCASE: TOP SALES CLOSING OLX MOBBI -->
      <!-- HERO SHOWCASE: RINGKASAN CLOSING DEAL OLX MOBBI KIARACONDONG -->
      <section class="olx-board-hero">
        <div class="olx-board-header">
          <div class="olx-board-title-group">
            <h2>
              <i class="fa-solid fa-crown" style="color:#fde047;"></i>
              TUNAS TOYOTA KIARACONDONG
            </h2>
            <div style="font-size:12px; color:#fecdd3; margin-top:3px; font-weight:600;">
              Papan Prestasi &amp; Rekapitulasi Resmi Transaksi Trade-In Cabang Kiaracondong Periode 2026
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="olx-brand-pill">
              <span class="olx-mobbi-badge">CLOSING olx mobbi</span>
              <span class="olx-mobbi-sub">member of ASTRA</span>
            </div>
          </div>
        </div>

        <!-- 4 SHOWCASE SLOTS (ALVIN, FERYANTO, MUHAMMAD CAISARIVA, TOTAL) -->
        <div class="olx-podium-grid" id="olxPodiumGrid">
          <!-- Populated dynamically via JS -->
        </div>
      </section>

      <!-- PAPAN REKAP DEAL BULANAN PER SPV (ALVIN | FERYANTO | MUHAMMAD CAISARIVA) -->
      <section class="olx-matrix-card">
        <div class="olx-matrix-header">
          <div style="display:flex; align-items:center; gap:12px;">
            <span class="olx-matrix-badge-deal">
              <i class="fa-solid fa-handshake"></i> DEAL
            </span>
            <div>
              <h3 style="font-size:15px; font-weight:800; margin:0; color:#ffffff;">Papan Rekap Closing Deal Bulanan Tim Supervisor</h3>
              <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 0;">Evaluasi hasil closing trade-in per supervisor periode Januari - September 2026</p>
            </div>
          </div>
          <div style="font-size:12px; font-weight:700; color:#cbd5e1;">
            <i class="fa-solid fa-building-circle-check" style="color:#38bdf8;"></i> Portal Otoritas Kepala Cabang
          </div>
        </div>

        <div class="olx-matrix-table-wrap">
          <table class="olx-matrix-table">
            <thead>
              <tr>
                <th style="width:180px; text-align:left; padding-left:20px;">Periode</th>
                <th style="width:200px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_alvin.jpg" alt="Alvin" class="olx-matrix-spv-avatar" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name">ALVIN</span>
                    <span style="font-size:10px; opacity:0.8; font-weight:600;">Supervisor 1</span>
                  </div>
                </th>
                <th style="width:200px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_ryan.jpg" alt="Feryanto / Ryan" class="olx-matrix-spv-avatar" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name">FERYANTO / RYAN</span>
                    <span style="font-size:10px; opacity:0.8; font-weight:600;">Supervisor 2</span>
                  </div>
                </th>
                <th style="width:200px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_riva.jpg" alt="Muhammad Caisariva / Riva" class="olx-matrix-spv-avatar" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name">MUHAMMAD CAISARIVA / RIVA</span>
                    <span style="font-size:10px; opacity:0.8; font-weight:600;">Supervisor 3</span>
                  </div>
                </th>
                <th style="width:140px;">
                  <div style="font-size:13px; font-weight:900;">TOTAL DEALER</div>
                  <div style="font-size:10px; opacity:0.8;">Akumulasi Bulanan</div>
                </th>
              </tr>
            </thead>
            <tbody id="olxMatrixBody">
              <!-- Rendered via JS -->
            </tbody>
            <tfoot id="olxMatrixFoot">
              <!-- Rendered via JS -->
            </tfoot>
          </table>
        </div>
      </section>

    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_olx.js?v=20260918_v7_clean"></script>
  <script src="../js/pwa-app.js?v=20260918_v7_clean"></script>
</body>

</html>
