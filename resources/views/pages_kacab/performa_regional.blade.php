<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Performa Regional Jawa Barat</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css">
  <link rel="stylesheet" href="../css/performa_regional.css?v=20260901_1">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
</head>

<body>
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
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 46 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="performa_regional.html" id="navRegional" class="active"><i class="fa-solid fa-earth-asia"></i>Performa Regional Jabar</a>
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
          <h2 id="pageTitle">Performa Regional Jawa Barat</h2>
          <p class="page-sub">Komparasi pencapaian target SPK &amp; Retail Sales (RS AFI) seluruh Dealer dan Cabang se-Jawa Barat</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="https://ui-avatars.com/api/?name=KC&background=1e1014&color=d8a437&bold=true" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Kepala Cabang</span>
            <span class="role" id="kcbRole">Tunas Toyota Kiara Condong</span>
          </div>
        </div>
      </div>

      <!-- ═══ YELLOW HEADER BANNER PERSIS DOKUMEN ═══ -->
      <div class="reg-yellow-banner">
        <h1 class="reg-yellow-title">
          <i class="fa-solid fa-map-location-dot"></i> WEST JAVA
        </h1>
        <div class="reg-yellow-dates">
          <div class="reg-date-item">
            <span class="reg-date-badge">SPK</span>
            <span id="txtSpkDate">31 August 2026</span>
          </div>
          <div class="reg-date-item">
            <span class="reg-date-badge">RS AFI</span>
            <span id="txtRsDate">31 August 2026 (Latest)</span>
          </div>
        </div>
      </div>

      <!-- ═══ EXECUTIVE KPI SUMMARY CARDS ═══ -->
      <div class="reg-kpi-grid">
        <!-- KPI 1: SPK Regional -->
        <div class="reg-kpi-card">
          <div class="reg-kpi-head">
            <span class="reg-kpi-label">Total SPK Jawa Barat</span>
            <div class="reg-kpi-icon blue"><i class="fa-solid fa-file-signature"></i></div>
          </div>
          <div class="reg-kpi-val" id="kpiRegSpkTot">1.682</div>
          <div class="reg-kpi-sub">
            <span>Target: <b id="kpiRegSpkTgt">1.560</b></span>
            <span class="reg-kpi-badge-ach pos" id="kpiRegSpkAch">107.8% vs Target</span>
          </div>
        </div>

        <!-- KPI 2: Retail Sales Regional -->
        <div class="reg-kpi-card">
          <div class="reg-kpi-head">
            <span class="reg-kpi-label">Retail Sales (RS AFI) Jabar</span>
            <div class="reg-kpi-icon green"><i class="fa-solid fa-car-side"></i></div>
          </div>
          <div class="reg-kpi-val" id="kpiRegRsTot">1.447</div>
          <div class="reg-kpi-sub">
            <span>Target: <b id="kpiRegRsTgt">1.386</b></span>
            <span class="reg-kpi-badge-ach pos" id="kpiRegRsAch">104.4% vs Target</span>
          </div>
        </div>

        <!-- KPI 3: Tunas Toyota Group -->
        <div class="reg-kpi-card">
          <div class="reg-kpi-head">
            <span class="reg-kpi-label">Grup Tunas Toyota Jabar</span>
            <div class="reg-kpi-icon purple"><i class="fa-solid fa-building"></i></div>
          </div>
          <div class="reg-kpi-val" id="kpiRegTunasSpk">259 (116.1% SPK)</div>
          <div class="reg-kpi-sub">
            <span id="kpiRegTunasRs">208 Unit (104.0% RS)</span>
          </div>
        </div>

        <!-- KPI 4: Kiara Condong Highlight -->
        <div class="reg-kpi-card highlight-kircon">
          <div class="reg-kpi-head">
            <span class="reg-kpi-label" style="color:#92400e;"><i class="fa-solid fa-star"></i> Cabang Kiara Condong</span>
            <div class="reg-kpi-icon gold"><i class="fa-solid fa-award"></i></div>
          </div>
          <div class="reg-kpi-val" style="color:#78350f;" id="kpiRegKirconSpk">100 Unit (137.0%)</div>
          <div class="reg-kpi-sub" style="color:#92400e;">
            <span>Retail Sales: <b id="kpiRegKirconRs">87 Unit (119.2%)</b></span>
          </div>
        </div>
      </div>

      <!-- ═══ TOOLBAR & FILTER CONTROLS ═══ -->
      <div class="reg-toolbar">
        <div class="reg-tabs">
          <button class="reg-tab-btn active" id="tabBtnAll" onclick="switchRegionalTab('all')">
            <i class="fa-solid fa-table-cells"></i> Semua (Stacked)
          </button>
          <button class="reg-tab-btn" id="tabBtnDealer" onclick="switchRegionalTab('dealer')">
            <i class="fa-solid fa-building"></i> a. by Dealer
          </button>
          <button class="reg-tab-btn" id="tabBtnBranch" onclick="switchRegionalTab('branch')">
            <i class="fa-solid fa-code-branch"></i> b. by Branch
          </button>
        </div>

        <div class="reg-filter-group">
          <div class="reg-search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchBranchInput" class="reg-search-input" placeholder="Cari nama dealer / cabang...">
          </div>

          <select id="selectDealerFilter" class="reg-select">
            <option value="all">Semua Grup Dealer</option>
            <option value="Tunas Toyota">Tunas Toyota</option>
            <option value="Auto2000">Auto2000</option>
            <option value="Astrido Toyota">Astrido Toyota</option>
            <option value="Plaza Toyota">Plaza Toyota</option>
            <option value="Wijaya Toyota">Wijaya Toyota</option>
            <option value="Rejeki Toyota">Rejeki Toyota</option>
            <option value="Selamat Toyota">Selamat Toyota</option>
            <option value="Sinar Mas">Sinar Mas</option>
            <option value="Budi Jaya">Budi Jaya</option>
            <option value="Duta Cendana">Duta Cendana</option>
          </select>

          <button class="reg-btn-action reg-btn-excel" onclick="exportRegionalCSV()" title="Unduh data dalam format CSV/Excel">
            <i class="fa-solid fa-file-excel"></i> Ekspor CSV
          </button>
          <button class="reg-btn-action reg-btn-print" onclick="printRegionalReport()" title="Cetak atau simpan sebagai PDF">
            <i class="fa-solid fa-print"></i> Cetak / PDF
          </button>
        </div>
      </div>

      <!-- ═══════════════ SECTION a. by Dealer ═══════════════ -->
      <section class="reg-section-card" id="secDealerCard">
        <div class="reg-section-header">
          <h3 class="reg-section-title">
            <i class="fa-solid fa-building" style="color:#0d2b63;"></i>
            a. by Dealer
          </h3>
          <span style="font-size:12px; color:#64748b; font-weight:700;">
            10 Grup Dealer Resmi Toyota Jawa Barat
          </span>
        </div>

        <div class="reg-table-wrapper">
          <table class="reg-table" id="tableDealer">
            <thead>
              <tr>
                <th rowspan="2" class="reg-th-navy" style="width: 220px;">Dealer West Java</th>
                <th colspan="4" class="reg-th-navy-group reg-col-divider">SPK as of 31 August 2026</th>
                <th colspan="4" class="reg-th-navy-group">Retail Sales as of 31 August 2026 (Latest)</th>
              </tr>
              <tr>
                <!-- SPK Sub-headers -->
                <th class="reg-th-cyan" style="width: 85px;">Target EOM</th>
                <th class="reg-th-sub-navy" style="width: 85px;">SPK</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs Target EOM</th>
                <th class="reg-th-cyan-sub reg-col-divider" style="width: 100px;">vs SPK July</th>
                <!-- Retail Sales Sub-headers -->
                <th class="reg-th-cyan" style="width: 85px;">Target EOM</th>
                <th class="reg-th-sub-navy" style="width: 85px;">Retail Sales</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs Target EOM</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs RS July</th>
              </tr>
            </thead>
            <tbody id="dealerTableBody">
              <!-- Rendered by JavaScript -->
            </tbody>
          </table>
        </div>
      </section>

      <!-- ═══════════════ SECTION b. by Branch ═══════════════ -->
      <section class="reg-section-card" id="secBranchCard">
        <div class="reg-section-header">
          <h3 class="reg-section-title">
            <i class="fa-solid fa-code-branch" style="color:#0d2b63;"></i>
            b. by Branch
          </h3>
          <span class="reg-date-badge" id="badgeBranchCount" style="background:#0d2b63; color:white; font-size:11.5px; padding:4px 10px;">
            32 Cabang Ditampilkan
          </span>
        </div>

        <div class="reg-table-wrapper">
          <table class="reg-table" id="tableBranch">
            <thead>
              <tr>
                <th rowspan="2" class="reg-th-navy" style="width: 250px;">Dealer West Java</th>
                <th colspan="4" class="reg-th-navy-group reg-col-divider">SPK as of 31 August 2026</th>
                <th colspan="4" class="reg-th-navy-group">Retail Sales as of 31 August 2026 (Latest)</th>
              </tr>
              <tr>
                <!-- SPK Sub-headers -->
                <th class="reg-th-cyan" style="width: 85px;">Target EOM</th>
                <th class="reg-th-sub-navy" style="width: 85px;">SPK</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs Target EOM</th>
                <th class="reg-th-cyan-sub reg-col-divider" style="width: 100px;">vs SPK July</th>
                <!-- Retail Sales Sub-headers -->
                <th class="reg-th-cyan" style="width: 85px;">Target EOM</th>
                <th class="reg-th-sub-navy" style="width: 85px;">Retail Sales</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs Target EOM</th>
                <th class="reg-th-cyan-sub" style="width: 100px;">vs RS July</th>
              </tr>
            </thead>
            <tbody id="branchTableBody">
              <!-- Rendered by JavaScript -->
            </tbody>
          </table>
        </div>
      </section>

    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/performa_regional.js?v=20260901_1"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
