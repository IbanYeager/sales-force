<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Kelola Target Cabang</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_executive_v34">
  <style>
    /* Styling khusus Halaman Target Kacab */
    .target-summary-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }

    .ts-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px 18px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
    }

    .ts-icon {
      width: 42px;
      height: 42px;
      border-radius: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .ts-icon.gold {
      background: var(--gold-soft);
      color: var(--gold-deep);
    }

    .ts-icon.blue {
      background: var(--blue-soft);
      color: var(--blue);
    }

    .ts-title {
      font-size: 11px;
      font-weight: 700;
      color: var(--muted);
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ts-val {
      font-size: 16px;
      font-weight: 900;
      color: var(--text);
    }

    /* Executive Target Card & Toolbar */
    .target-box-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 18px 20px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
    }

    .target-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid var(--border);
    }

    .target-search-group {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
      flex: 1;
    }

    .target-search-input {
      position: relative;
      min-width: 220px;
      flex: 1;
      max-width: 320px;
    }

    .target-search-input i {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--muted);
      font-size: 13px;
    }

    .target-search-input input {
      width: 100%;
      padding: 7px 12px 7px 34px;
      border-radius: 9px;
      border: 1.5px solid var(--border);
      font-size: 12.5px;
      font-weight: 600;
      background: var(--surface-2);
      color: var(--text);
      outline: none;
      box-sizing: border-box;
      transition: var(--transition);
    }

    .target-search-input input:focus {
      border-color: var(--gold);
      background: #fff;
    }

    .target-filter-select {
      padding: 7px 12px;
      border-radius: 9px;
      border: 1.5px solid var(--border);
      font-size: 12px;
      font-weight: 700;
      color: var(--text-2);
      background: var(--surface-2);
      outline: none;
      cursor: pointer;
    }

    .view-toggle-btns {
      display: flex;
      align-items: center;
      gap: 4px;
      background: var(--surface-2);
      padding: 3px;
      border-radius: 9px;
      border: 1px solid var(--border);
    }

    .view-btn {
      padding: 5px 11px;
      font-size: 11.5px;
      font-weight: 700;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: var(--muted);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: var(--transition);
    }

    .view-btn.active {
      background: #fff;
      color: var(--text);
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    /* Executive Target Table */
    .table-target-wrap {
      width: 100%;
      overflow-x: auto;
      border-radius: 12px;
      border: 1px solid var(--border);
    }

    .table-target {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      text-align: left;
    }

    .table-target th {
      background: #f8fafc;
      padding: 10px 14px;
      font-size: 11px;
      font-weight: 800;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1.5px solid var(--border);
      white-space: nowrap;
    }

    .table-target td {
      padding: 11px 14px;
      border-bottom: 1px solid var(--border);
      vertical-align: middle;
    }

    .table-target tbody tr:last-child td {
      border-bottom: none;
    }

    .table-target tbody tr:hover {
      background: #fbfcfe;
    }

    /* Target Compact Card Grid */
    .target-grid-compact {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
      gap: 14px;
    }

    .target-card-compact {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 15px 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .target-card-compact:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
    }

    /* Edit Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 16px;
    }

    .modal-box {
      background: white;
      border-radius: 20px;
      max-width: 440px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
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
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i>After Sales</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget" class="active"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
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
          <h2 id="pageTitle">Kelola Target Cabang</h2>
          <p class="page-sub">Pengaturan & alokasi kuota target bulanan (SPK & DO) per tim SPV</p>
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

      <!-- PERIODE MONTH FILTER & SINKRON SPREADSHEET -->
      <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:14px 18px; border-radius:16px; border:1px solid #e2e8f0; margin-bottom:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03); flex-wrap:wrap; gap:12px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <i class="fa-solid fa-calendar-days" style="font-size:18px; color:var(--primary-blue, #2563eb);"></i>
          <div>
            <span style="font-size:13px; font-weight:800; color:#1e293b; display:block;">Pilih Periode Target</span>
            <span style="font-size:11px; color:#64748b;" id="lblSelectedPeriod">Target &amp; Pencapaian per Bulan</span>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button type="button" id="btnSyncSheetsKacab" class="btn" style="background:#10b981; color:white; font-weight:700; border:none; padding:8px 14px; border-radius:10px; cursor:pointer; font-size:12.5px; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(16,185,129,0.25);" onclick="syncSheetsNowKacab()">
            <i class="fa-solid fa-arrows-rotate"></i> Sinkron Spreadsheet
          </button>
          <select id="monthSelectKacab" class="input-modern" style="width:180px; font-size:13px; font-weight:700; padding:8px 12px; border-radius:10px; border:1px solid #cbd5e1; background:#f8fafc;" onchange="fetchRealTargetData()">
            <option value="1">Januari 2026</option>
            <option value="2">Februari 2026</option>
            <option value="3">Maret 2026</option>
            <option value="4">April 2026</option>
            <option value="5">Mei 2026</option>
            <option value="6">Juni 2026</option>
            <option value="7">Juli 2026</option>
            <option value="8" selected>Agustus 2026</option>
            <option value="9">September 2026</option>
            <option value="10">Oktober 2026</option>
            <option value="11">November 2026</option>
            <option value="12">Desember 2026</option>
          </select>
        </div>
      </div>

      <!-- TARGET SUMMARY CARDS -->
      <div class="target-summary-row">
        <div class="ts-card">
          <div class="ts-icon blue"><i class="fa-solid fa-bullseye"></i></div>
          <div>
            <span class="ts-title">Total Target SPK Cabang</span>
            <div class="ts-val" id="summarySpkTarget">Memuat...</div>
          </div>
        </div>
        <div class="ts-card">
          <div class="ts-icon gold"><i class="fa-solid fa-truck-fast"></i></div>
          <div>
            <span class="ts-title" id="lblSummaryDoTitle">Total Target DO Cabang</span>
            <div class="ts-val" id="summaryDoTarget">Memuat...</div>
          </div>
        </div>
      </div>

      <!-- EXECUTIVE TARGET MATRIX & KUOTA CABANG -->
      <div class="target-box-card">
        <div class="target-toolbar">
          <div class="target-search-group">
            <div class="target-search-input">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="searchTargetInput" placeholder="Cari nama wiraniaga..." oninput="filterTargetMatrix()">
            </div>
            <select id="filterSpvTeamTarget" class="target-filter-select" onchange="filterTargetMatrix()">
              <option value="Semua">Semua Tim SPV</option>
              <option value="Ryan">Tim Pak Ryan</option>
              <option value="Alvin">Tim Pak Alvin</option>
              <option value="Riva">Tim Pak Riva</option>
              <option value="Rahma">Tim Bu Rahma</option>
            </select>
            <select id="filterTingkatanTarget" class="target-filter-select" onchange="filterTargetMatrix()">
              <option value="Semua">Semua Tingkatan</option>
              <option value="Trainee">Trainee</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>
            <span id="targetCountBadge" style="font-size:11.5px; font-weight:800; color:var(--muted); background:var(--surface-2); padding:5px 10px; border-radius:8px; border:1px solid var(--border);">
              Memuat...
            </span>
          </div>

          <div class="view-toggle-btns">
            <button type="button" class="view-btn active" id="btnViewTable" onclick="setTargetViewMode('table')">
              <i class="fa-solid fa-table-list"></i> Tabel Eksekutif
            </button>
            <button type="button" class="view-btn" id="btnViewGrid" onclick="setTargetViewMode('grid')">
              <i class="fa-solid fa-grip"></i> Grid Kompak
            </button>
          </div>
        </div>

        <div id="targetMatrixContainer">
          <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat matriks target cabang...</p>
        </div>
      </div>
    </main>
  </div>

  <!-- EDIT TARGET MODAL -->
  <div class="modal-backdrop" id="editTargetModal">
    <div class="modal-box">
      <div style="margin-bottom: 16px;">
        <h3 style="font-size:18px;font-weight:800;color:var(--text);">Edit Kuota Target SPV</h3>
        <p style="font-size:12px;color:var(--muted);" id="modalSpvName">Nama SPV</p>
      </div>

      <div style="margin-bottom: 14px;">
        <label style="font-size:12px;font-weight:700;color:var(--text-dark);display:block;margin-bottom:6px;">
          Target SPK Bulanan (Unit)
        </label>
        <input type="number" id="inputTargetSpk" class="input-modern" style="width:100%;font-size:14px;" min="0">
      </div>

      <div style="margin-bottom: 20px;">
        <label style="font-size:12px;font-weight:700;color:var(--text-dark);display:block;margin-bottom:6px;">
          Target DO Evaluasi (Unit)
        </label>
        <input type="number" id="inputTargetDo" class="input-modern" style="width:100%;font-size:14px;" min="0">
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn btn-ghost btn-sm" onclick="closeEditTargetModal()">Batal</button>
        <button class="btn btn-primary btn-sm" onclick="saveTargetChanges()">
          <i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan
        </button>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js?v=20260915_layout_executive_v34"></script>
  <script src="../js/kacab_target.js?v=20260915_layout_executive_v34"></script>

  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
