<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Hasil Pencapaian Trade-In &amp; OLX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/spv_olx.css?v=20260917_olx_master">

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

      <!-- 5 EXECUTIVE KPI TILES -->
      <div class="olx-kpi-grid">
        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Total Unit Masuk</span>
            <div class="olx-kpi-icon icon-blue"><i class="fa-solid fa-car-tunnel"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalUnit">0 Unit</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-file-waveform" style="color:#2563eb;"></i> Seluruh unit trade-in diajukan</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Closing Deal</span>
            <div class="olx-kpi-icon icon-emerald"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalDeal" style="color:#059669;">0 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-handshake" style="color:#059669;"></i> Transaksi SPK Trade-In Sukses</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Nego / Prospek</span>
            <div class="olx-kpi-icon icon-amber"><i class="fa-solid fa-hourglass-half"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalNego" style="color:#d97706;">0 Prospek</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-comments" style="color:#d97706;"></i> Tahap appraisal / nego harga</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Total Omset Deal</span>
            <div class="olx-kpi-icon icon-gold"><i class="fa-solid fa-money-bill-wave"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalNominal" style="color:#b45309;">Rp 0</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-coins" style="color:#b45309;"></i> Akumulasi nilai transaksi deal</div>
        </div>

        <div class="olx-kpi-card">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Win Rate Closing</span>
            <div class="olx-kpi-icon icon-purple"><i class="fa-solid fa-chart-line"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiWinRate" style="color:#7c3aed;">0%</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-percent" style="color:#7c3aed;"></i> Rasio konversi Deal per Unit</div>
        </div>
      </div>

      <!-- LEADERBOARD PENCAPAIAN PER SPV -->
      <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
            <i class="fa-solid fa-trophy" style="color:#eab308; margin-right:6px;"></i> Rekap Performa per Tim SPV
          </h3>
          <p style="font-size:12px; color:#64748b; margin:2px 0 0;">Perbandingan hasil closing deal antar tim supervisor dan wiraniaga top</p>
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
              <i class="fa-solid fa-list-check" style="color:#d7123a; margin-right:8px;"></i> Daftar Transaksi Trade-In OLX
            </h1>
            <p class="subtitle" style="font-size:12.5px; color:#64748b; margin:2px 0 0;">
              Menampilkan rincian kendaraan, estimasi harga, wiraniaga pengampu, dan status penutupan
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
              <option value="Alvin">Tim SPV Alvin</option>
              <option value="Ryan">Tim SPV Ryan</option>
              <option value="Riva">Tim SPV Riva</option>
            </select>

            <!-- Filter Status -->
            <select id="selectStatus" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Status Hasil</option>
              <option value="Deal">Deal (Closing)</option>
              <option value="Nego">Nego (Proses)</option>
              <option value="Cek Unit">Cek Unit / Appraisal</option>
              <option value="Pending">Pending</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <div style="position:relative;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;"></i>
              <input type="text" id="searchOlx" class="olx-input" placeholder="Cari mobil / sales / merk..." style="padding-left:32px; width:220px;">
            </div>
            <span id="totalRowsCount" style="font-size:12px; font-weight:700; color:#64748b; white-space:nowrap;">0 Data</span>
          </div>
        </div>

        <!-- TABLE CONTAINER -->
        <div style="overflow-x:auto;">
          <table class="olx-table">
            <thead>
              <tr>
                <th style="width:40px;">#</th>
                <th>Bulan</th>
                <th>Wiraniaga</th>
                <th>Unit Kendaraan</th>
                <th>KM &amp; Pajak</th>
                <th>Nilai / Deal (Rp)</th>
                <th>Status Hasil</th>
                <th>Keterangan</th>
                <th style="text-align:center;">Aksi</th>
              </tr>
            </thead>
            <tbody id="olxTableBody">
              <tr>
                <td colspan="9" style="text-align:center; padding:30px; color:#64748b;">
                  <i class="fa-solid fa-spinner fa-spin"></i> Memuat data trade-in OLX...
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
  <script src="../js/spv_olx.js?v=20260917_master"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
