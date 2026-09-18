<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Hasil Pencapaian Trade-In &amp; OLX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260918_v6_ryan_riva">
  <link rel="stylesheet" href="../css/spv_olx.css?v=20260918_v6_ryan_riva">

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
          <p class="page-sub">Monitoring performa transaksi tukar tambah unit per wiraniaga &amp; persentase closing deal</p>
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

      <!-- HERO SHOWCASE: RINGKASAN CLOSING DEAL OLX MOBBI KIARACONDONG -->
      <section class="olx-board-hero">
        <div class="olx-board-header">
          <div class="olx-board-title-group">
            <h2>
              <i class="fa-solid fa-award" style="color:#fde047;"></i>
              TUNAS TOYOTA KIARACONDONG
            </h2>
            <div style="font-size:12px; color:#fecdd3; margin-top:3px; font-weight:600;">
              Rekapitulasi Resmi Pencapaian Closing Deal OLX mobbi Cabang Kiaracondong Periode 2026
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
              <p style="font-size:11.5px; color:#94a3b8; margin:2px 0 0;">Sinkronisasi otomatis hasil closing trade-in per periode Januari - September 2026</p>
            </div>
          </div>
          <div style="font-size:12px; font-weight:700; color:#cbd5e1;">
            <i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Data Terverifikasi Excel 2026
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

      <!-- 5 EXECUTIVE KPI TILES (FOCUSED ON DEALS, NO MONEY/PRICES) -->
      <div class="olx-kpi-grid">
        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Total Closing Deal</span>
            <div class="olx-kpi-icon icon-emerald"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalDeal" style="color:#059669;">33 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-handshake" style="color:#059669;"></i> Total deal cabang Kiaracondong</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Tim SPV ALVIN</span>
            <div class="olx-kpi-icon icon-blue"><i class="fa-solid fa-user-tie"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiDealAlvin" style="color:#2563eb;">16 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-calendar-check" style="color:#2563eb;"></i> Periode Jan - Sep 2026</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Tim SPV FERYANTO</span>
            <div class="olx-kpi-icon icon-purple"><i class="fa-solid fa-user-tie"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiDealFeryanto" style="color:#7c3aed;">15 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-calendar-check" style="color:#7c3aed;"></i> Periode Apr - Sep 2026</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Tim SPV M. CAISARIVA</span>
            <div class="olx-kpi-icon icon-amber"><i class="fa-solid fa-user-tie"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiDealCaisariva" style="color:#d97706;">2 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-calendar-check" style="color:#d97706;"></i> Periode Apr &amp; Jul 2026</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Cabang Terverifikasi</span>
            <div class="olx-kpi-icon icon-gold"><i class="fa-solid fa-building"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiCabangKircon" style="font-size:16px; font-weight:800; color:#0f172a;">Kiaracondong</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-circle-check" style="color:#10b981;"></i> 100% Sesuai Laporan Excel</div>
        </div>
      </div>

      <!-- REKAP PERFORMA PER TIM SPV -->
      <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
            <i class="fa-solid fa-trophy" style="color:#eab308; margin-right:6px;"></i> Rekap Performa per Tim SPV
          </h3>
          <p style="font-size:12px; color:#64748b; margin:2px 0 0;">Distribusi closing trade-in OLX per tim supervisor cabang Kiaracondong</p>
        </div>
      </div>

      <div class="olx-leaderboard-grid" id="leaderboardContainer">
        <!-- Dynamic Leaderboard generated via JS -->
      </div>

      <!-- FILTER TOOLBAR & DATA TABLE -->
      <section class="spv-card" style="padding:0; overflow:hidden;">
        <div class="card-head" style="padding:18px 20px; border-bottom:1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h1 class="title" style="font-size:17px; font-weight:800; color:#0f172a; margin:0;">
              <i class="fa-solid fa-list-check" style="color:#d7123a; margin-right:8px;"></i> Daftar Data Closing Deal OLX
            </h1>
            <p class="subtitle" style="font-size:12.5px; color:#64748b; margin:2px 0 0;">
              Menampilkan rincian transaksi closing deal OLX mobbi Tunas Toyota Kiaracondong
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:8px 14px; border-radius:10px; cursor:pointer;" onclick="exportOlxCsv()">
              <i class="fa-solid fa-file-excel" style="color:#059669;"></i> Ekspor CSV
            </button>
            <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:8px 14px; border-radius:10px; cursor:pointer;" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Cetak
            </button>
          </div>
        </div>

        <!-- FILTER BAR -->
        <div style="background:#f8fafc; padding:12px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div class="olx-filter-group">
            <!-- Filter Bulan -->
            <select id="selectMonth" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Periode Bulan</option>
            </select>

            <!-- Filter SPV -->
            <select id="selectSpv" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Tim SPV</option>
              <option value="ALVIN">Tim SPV ALVIN</option>
              <option value="FERYANTO">Tim SPV FERYANTO (RYAN)</option>
              <option value="MUHAMMAD CAISARIVA">Tim SPV MUHAMMAD CAISARIVA (RIVA)</option>
            </select>

            <!-- Filter Status -->
            <select id="selectStatus" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Status</option>
              <option value="Deal">Deal (Closing)</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <div style="position:relative;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;"></i>
              <input type="text" id="searchOlx" class="olx-input" placeholder="Cari SPV / bulan..." style="padding-left:32px; width:220px;">
            </div>
            <span id="totalRowsCount" style="font-size:12px; font-weight:700; color:#64748b; white-space:nowrap;">0 Data</span>
          </div>
        </div>

        <!-- TABLE CONTAINER -->
        <div style="overflow-x:auto;">
          <table class="olx-table">
            <thead>
              <tr>
                <th style="width:50px;">#</th>
                <th>Periode Bulan</th>
                <th>Cabang</th>
                <th>Supervisor (SPV)</th>
                <th>Status Hasil</th>
                <th>Keterangan</th>
              </tr>
            </thead>
            <tbody id="olxTableBody">
              <tr>
                <td colspan="6" style="text-align:center; padding:30px; color:#64748b;">
                  <i class="fa-solid fa-spinner fa-spin"></i> Memuat data closing deal OLX...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <!-- MODAL DETAIL UNIT TRADE-IN -->
  <div class="olx-modal-overlay" id="modalDetailOlx" onclick="closeDetailModal()">
    <div class="olx-modal-box" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
          <i class="fa-solid fa-circle-info" style="color:#d7123a; margin-right:6px;"></i> Detail Informasi Trade-In OLX
        </h3>
        <button onclick="closeDetailModal()" style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div id="modalDetailBody">
        <!-- Dynamic content from JS -->
      </div>

      <div style="text-align:right;">
        <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:9px 18px; border-radius:10px; cursor:pointer;" onclick="closeDetailModal()">
          Tutup
        </button>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/spv_olx.js?v=20260918_v6_ryan_riva"></script>
  <script src="../js/pwa-app.js?v=20260918_v6_ryan_riva"></script>
</body>

</html>
