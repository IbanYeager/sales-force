<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Hasil Pencapaian Trade-In &amp; OLX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260918_v8_lux">
  <link rel="stylesheet" href="../css/spv_olx.css?v=20260918_v8_lux">

  <style>
    /* ================================================================
       ULTRA-PREMIUM OLX TRADE-IN DASHBOARD DESIGN SYSTEM (SPV PANEL)
       ================================================================ */
    .olx-board-hero {
      background: linear-gradient(135deg, #450a0a 0%, #881337 42%, #1e1b4b 100%) !important;
      border-radius: 22px !important;
      padding: 28px 32px !important;
      color: #ffffff !important;
      margin-bottom: 26px !important;
      box-shadow: 0 16px 40px -10px rgba(136, 19, 55, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.22) !important;
      position: relative !important;
      overflow: hidden !important;
      border: 1px solid rgba(255, 255, 255, 0.18) !important;
    }

    .olx-board-hero::before {
      content: '' !important;
      position: absolute !important;
      top: -90px !important;
      right: -90px !important;
      width: 320px !important;
      height: 320px !important;
      background: radial-gradient(circle, rgba(254, 205, 211, 0.18) 0%, transparent 70%) !important;
      border-radius: 50% !important;
      pointer-events: none !important;
    }

    .olx-board-hero::after {
      content: '' !important;
      position: absolute !important;
      bottom: -60px !important;
      left: 15% !important;
      width: 260px !important;
      height: 260px !important;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%) !important;
      border-radius: 50% !important;
      pointer-events: none !important;
    }

    .olx-board-header {
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 16px !important;
      margin-bottom: 24px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16) !important;
      padding-bottom: 18px !important;
      position: relative !important;
      z-index: 1 !important;
    }

    .olx-board-title-group h2 {
      color: #ffffff !important;
      margin: 0 !important;
      font-size: 23px !important;
      font-weight: 900 !important;
      letter-spacing: -0.3px !important;
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
    }

    .olx-brand-pill {
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      background: rgba(0, 0, 0, 0.3) !important;
      backdrop-filter: blur(10px) !important;
      padding: 6px 14px !important;
      border-radius: 50px !important;
      border: 1px solid rgba(255, 255, 255, 0.22) !important;
    }

    .olx-mobbi-badge {
      font-size: 11.5px !important;
      font-weight: 900 !important;
      color: #ffffff !important;
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%) !important;
      padding: 4px 10px !important;
      border-radius: 6px !important;
      letter-spacing: 0.5px !important;
      box-shadow: 0 2px 6px rgba(2, 132, 199, 0.35) !important;
    }

    .olx-mobbi-sub {
      font-size: 11px !important;
      color: #e2e8f0 !important;
      font-weight: 800 !important;
      letter-spacing: 0.5px !important;
      text-transform: uppercase !important;
    }

    /* 4-Column Showcase Grid */
    .olx-podium-grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr) !important;
      gap: 18px !important;
      position: relative !important;
      z-index: 1 !important;
    }

    @media (max-width: 1024px) {
      .olx-podium-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 640px) {
      .olx-podium-grid {
        grid-template-columns: 1fr !important;
      }
    }

    /* Podium Cards */
    .olx-podium-card {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
      backdrop-filter: blur(14px) !important;
      -webkit-backdrop-filter: blur(14px) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 20px !important;
      padding: 24px 16px !important;
      text-align: center !important;
      position: relative !important;
      transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1) !important;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.35) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      overflow: hidden !important;
    }

    .olx-podium-card:hover {
      transform: translateY(-6px) !important;
      box-shadow: 0 20px 40px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.4) !important;
    }

    .olx-podium-card-total {
      background: linear-gradient(135deg, rgba(217, 119, 6, 0.25) 0%, rgba(180, 83, 9, 0.4) 100%) !important;
      border: 1.5px solid rgba(251, 191, 36, 0.55) !important;
      box-shadow: 0 10px 30px -5px rgba(217, 119, 6, 0.4) !important;
    }

    .olx-podium-card-total:hover {
      border-color: rgba(253, 224, 71, 0.8) !important;
      box-shadow: 0 20px 45px -5px rgba(217, 119, 6, 0.6), 0 0 25px rgba(251, 191, 36, 0.3) !important;
    }

    .olx-podium-rank-badge {
      position: absolute !important;
      top: 12px !important;
      left: 12px !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 50% !important;
      color: #ffffff !important;
      font-weight: 900 !important;
      font-size: 13px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.35) !important;
      border: 1.5px solid rgba(255, 255, 255, 0.4) !important;
      z-index: 2 !important;
    }

    .olx-podium-avatar-wrap {
      position: relative !important;
      width: 80px !important;
      height: 80px !important;
      margin: 4px auto 14px !important;
    }

    .olx-podium-avatar {
      width: 100% !important;
      height: 100% !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      object-position: top center !important;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4) !important;
      display: block !important;
    }

    .olx-trophy-circle {
      width: 80px !important;
      height: 80px !important;
      border-radius: 50% !important;
      background: linear-gradient(135deg, #fef08a 0%, #f59e0b 100%) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 4px auto 14px !important;
      color: #78350f !important;
      font-size: 34px !important;
      box-shadow: 0 8px 22px rgba(245, 158, 11, 0.45) !important;
      border: 3px solid #ffffff !important;
    }

    .olx-card-label {
      font-size: 10.5px !important;
      font-weight: 800 !important;
      text-transform: uppercase !important;
      letter-spacing: 1px !important;
      color: #fecdd3 !important;
      margin-bottom: 4px !important;
      display: block !important;
    }

    .olx-card-name {
      font-size: 16px !important;
      font-weight: 900 !important;
      color: #ffffff !important;
      letter-spacing: 0.3px !important;
      margin: 0 0 3px !important;
      text-shadow: 0 2px 6px rgba(0, 0, 0, 0.5) !important;
      line-height: 1.25 !important;
      white-space: normal !important;
    }

    .olx-card-role {
      font-size: 11.5px !important;
      font-weight: 700 !important;
      color: #cbd5e1 !important;
      margin-bottom: 14px !important;
      display: block !important;
    }

    .olx-deal-badge-pill {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
      color: #ffffff !important;
      font-weight: 900 !important;
      font-size: 14.5px !important;
      padding: 7px 18px !important;
      border-radius: 30px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 7px !important;
      box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
    }

    .olx-deal-badge-total {
      background: linear-gradient(135deg, #f59e0b 0%, #b45309 100%) !important;
      color: #ffffff !important;
      font-weight: 900 !important;
      font-size: 15.5px !important;
      padding: 7px 20px !important;
      border-radius: 30px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 8px !important;
      box-shadow: 0 6px 18px rgba(245, 158, 11, 0.45) !important;
      border: 1.5px solid rgba(254, 240, 138, 0.6) !important;
    }

    /* Monthly Matrix Card */
    .olx-matrix-card {
      background: #ffffff !important;
      border-radius: 22px !important;
      border: 1px solid #e2e8f0 !important;
      overflow: hidden !important;
      box-shadow: 0 10px 35px -5px rgba(15, 23, 42, 0.08) !important;
      margin-bottom: 26px !important;
    }

    .olx-matrix-header {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%) !important;
      color: #ffffff !important;
      padding: 18px 26px !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      flex-wrap: wrap !important;
      gap: 14px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    }

    .olx-matrix-badge-tag {
      background: linear-gradient(135deg, #2563eb, #1d4ed8) !important;
      color: #ffffff !important;
      font-size: 12.5px !important;
      font-weight: 900 !important;
      padding: 6px 14px !important;
      border-radius: 8px !important;
      letter-spacing: 0.6px !important;
      display: inline-flex !important;
      align-items: center !important;
      gap: 7px !important;
      box-shadow: 0 3px 10px rgba(37, 99, 235, 0.35) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }

    .olx-matrix-table-wrap {
      overflow-x: auto !important;
    }

    .olx-matrix-table {
      width: 100% !important;
      border-collapse: collapse !important;
      text-align: center !important;
      font-size: 13.5px !important;
    }

    .olx-matrix-table thead th {
      background: #0f2444 !important;
      color: #ffffff !important;
      font-weight: 800 !important;
      padding: 16px 14px !important;
      border-right: 1px solid rgba(255, 255, 255, 0.08) !important;
      vertical-align: middle !important;
    }

    .olx-matrix-spv-avatar {
      width: 54px !important;
      height: 54px !important;
      border-radius: 50% !important;
      object-fit: cover !important;
      object-position: top center !important;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
      display: block !important;
      margin: 0 auto 6px !important;
    }

    .olx-matrix-table tbody tr {
      border-bottom: 1px solid #f1f5f9 !important;
      transition: background 0.18s ease !important;
    }

    .olx-matrix-table tbody tr:hover {
      background: #f8fafc !important;
    }

    .olx-matrix-table tbody tr:nth-child(even) {
      background: #fafafa !important;
    }

    .olx-matrix-table tbody tr:nth-child(even):hover {
      background: #f1f5f9 !important;
    }

    .olx-matrix-table tbody td {
      padding: 12px 14px !important;
      vertical-align: middle !important;
    }
  </style>

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
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#0284c7; color:#fff; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx" class="active"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
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

    <!-- MAIN CONTENT -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-repeat" style="color:#d7123a;"></i> Hasil Pencapaian Trade-In &amp; OLX
          </h2>
          <p class="page-sub">Monitoring performa transaksi trade-in cabang Kiaracondong terverifikasi per tim supervisor</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Supervisor</span>
          </div>
        </div>
      </div>

      <!-- 1. HERO SHOWCASE: RINGKASAN CLOSING DEAL OLX MOBBI KIARACONDONG -->
      <section class="olx-board-hero">
        <div class="olx-board-header">
          <div class="olx-board-title-group">
            <h2>
              <i class="fa-solid fa-crown" style="color:#fbbf24; filter: drop-shadow(0 2px 8px rgba(251, 191, 36, 0.5));"></i>
              TUNAS TOYOTA KIARACONDONG
            </h2>
            <div style="font-size:12.5px; color:#fecdd3; margin-top:4px; font-weight:600; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-circle-check" style="color:#34d399;"></i> Papan Prestasi &amp; Rekapitulasi Resmi Transaksi Trade-In OLX Mobbi Periode 2026
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="olx-brand-pill">
              <span class="olx-mobbi-badge">CLOSING olx mobbi</span>
              <span class="olx-mobbi-sub">member of ASTRA</span>
            </div>
          </div>
        </div>

        <!-- 4 SHOWCASE SLOTS (ALVIN, FERYANTO/RYAN, MUHAMMAD CAISARIVA/RIVA, GRAND TOTAL) -->
        <div class="olx-podium-grid" id="olxPodiumGrid">
          <!-- Populated dynamically via JS -->
        </div>
      </section>

      <!-- 2. PAPAN REKAP DEAL BULANAN PER SPV (ALVIN | FERYANTO | MUHAMMAD CAISARIVA) -->
      <section class="olx-matrix-card">
        <div class="olx-matrix-header">
          <div style="display:flex; align-items:center; gap:14px;">
            <span class="olx-matrix-badge-tag">
              <i class="fa-solid fa-calendar-check"></i> REKAP BULANAN
            </span>
            <div>
              <h3 style="font-size:16px; font-weight:900; margin:0; color:#ffffff;">Papan Rekap Closing Deal Bulanan Tim Supervisor</h3>
              <p style="font-size:12px; color:#94a3b8; margin:3px 0 0;">Distribusi realisasi trade-in OLX per tim supervisor periode Januari - Desember 2026</p>
            </div>
          </div>
          <div style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 20px; padding: 6px 14px; font-size: 12px; font-weight: 700; color: #cbd5e1; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Terverifikasi Data Excel Cabang Kiaracondong
          </div>
        </div>

        <div class="olx-matrix-table-wrap">
          <table class="olx-matrix-table">
            <thead>
              <tr>
                <th style="width: 190px; text-align: left; padding: 18px 22px;">
                  <span style="font-size: 12px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px;">PERIODE BULAN</span>
                </th>
                <th style="width: 210px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_alvin.jpg" alt="Alvin" class="olx-matrix-spv-avatar" style="border: 2.5px solid #38bdf8;" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name" style="color: #ffffff; font-size: 14.5px; font-weight: 900;">ALVIN</span>
                    <span style="background: rgba(56, 189, 248, 0.2); color: #7dd3fc; font-size: 10.5px; padding: 2px 10px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(56, 189, 248, 0.3);">Supervisor 1</span>
                  </div>
                </th>
                <th style="width: 210px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_ryan.jpg" alt="Feryanto / Ryan" class="olx-matrix-spv-avatar" style="border: 2.5px solid #c084fc;" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name" style="color: #ffffff; font-size: 14.5px; font-weight: 900;">FERYANTO / RYAN</span>
                    <span style="background: rgba(192, 132, 252, 0.2); color: #e9d5ff; font-size: 10.5px; padding: 2px 10px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(192, 132, 252, 0.3);">Supervisor 2</span>
                  </div>
                </th>
                <th style="width: 210px;">
                  <div class="olx-matrix-spv-header">
                    <img src="../images/olx_top/spv_riva.jpg" alt="Muhammad Caisariva / Riva" class="olx-matrix-spv-avatar" style="border: 2.5px solid #34d399;" onerror="this.src='../images/default-avatar.png'">
                    <span class="olx-matrix-spv-name" style="color: #ffffff; font-size: 14.5px; font-weight: 900;">MUHAMMAD CAISARIVA / RIVA</span>
                    <span style="background: rgba(52, 211, 153, 0.2); color: #a7f3d0; font-size: 10.5px; padding: 2px 10px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(52, 211, 153, 0.3);">Supervisor 3</span>
                  </div>
                </th>
                <th style="width: 170px;">
                  <div class="olx-matrix-spv-header">
                    <div style="width: 54px; height: 54px; border-radius: 50%; background: linear-gradient(135deg, #1e293b, #0f172a); border: 2.5px solid #f59e0b; display: flex; align-items: center; justify-content: center; color: #fbbf24; font-size: 22px; margin: 0 auto 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
                      <i class="fa-solid fa-chart-line"></i>
                    </div>
                    <span style="color: #ffffff; font-size: 14px; font-weight: 900;">TOTAL DEALER</span>
                    <span style="background: rgba(245, 158, 11, 0.2); color: #fef08a; font-size: 10.5px; padding: 2px 10px; border-radius: 12px; font-weight: 700; border: 1px solid rgba(245, 158, 11, 0.3);">Akumulasi Bulanan</span>
                  </div>
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
  <script src="../js/spv_global.js"></script>
  <script src="../js/spv_olx.js?v=20260918_v8_lux"></script>
  <script src="../js/pwa-app.js?v=20260918_v8_lux"></script>
</body>

</html>
