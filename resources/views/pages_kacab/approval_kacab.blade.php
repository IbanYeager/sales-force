<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Otorisasi & Approval</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css">
  <style>
    /* Styling khusus Halaman Approval Kacab */
    .filter-bar {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .filter-pill {
      padding: 9px 18px;
      border-radius: 20px;
      background: var(--surface);
      border: 1px solid var(--border);
      font-size: 13px;
      font-weight: 700;
      color: var(--text-2);
      cursor: pointer;
      transition: all 0.2s;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .filter-pill:hover {
      background: var(--surface-2);
    }

    .filter-pill.active {
      background: var(--sidebar-bg);
      color: var(--gold);
      border-color: var(--gold-border);
    }

    .badge-count {
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 11px;
      background: rgba(255, 255, 255, 0.2);
    }

    .approval-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 20px;
      margin-bottom: 16px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .approval-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    }

    .ac-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      gap: 12px;
    }

    .ac-type {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .ac-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, #1e1014, #3b141d);
      color: var(--gold);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }

    .ac-type h4 {
      font-size: 16px;
      font-weight: 800;
      color: var(--text);
      margin-bottom: 2px;
    }

    .ac-sub {
      font-size: 12px;
      color: var(--muted);
    }

    .status-badge {
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .badge-warn {
      background: var(--amber-soft);
      color: var(--amber);
      border: 1px solid var(--amber-border);
    }

    .badge-success {
      background: var(--green-soft);
      color: var(--green);
      border: 1px solid var(--green-border);
    }

    .badge-danger {
      background: var(--red-soft);
      color: var(--red);
      border: 1px solid var(--red-border);
    }

    .ac-detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 12px;
      background: var(--surface-2);
      padding: 14px 16px;
      border-radius: 12px;
      margin-bottom: 14px;
    }

    .ac-cell {
      display: flex;
      flex-direction: column;
    }

    .ac-cell .lbl {
      font-size: 11px;
      font-weight: 600;
      color: var(--muted);
      margin-bottom: 2px;
    }

    .ac-cell .val {
      font-size: 13px;
      font-weight: 700;
      color: var(--text);
    }

    .ac-cell.highlight .val-gold {
      font-size: 14px;
      font-weight: 900;
      color: var(--brand);
    }

    .ac-note {
      font-size: 12px;
      color: var(--text-2);
      background: #fffbeb;
      border: 1px solid #fef08a;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin-bottom: 12px;
    }

    .ac-note i {
      color: var(--gold-deep);
      margin-top: 2px;
    }

    .ac-kacab-note {
      font-size: 12px;
      color: #1e1014;
      background: #fdf0f1;
      border: 1px solid #f5c6cb;
      border-radius: 10px;
      padding: 10px 14px;
      display: flex;
      align-items: flex-start;
      gap: 8px;
    }

    .ac-actions {
      display: flex;
      gap: 10px;
      margin-top: 16px;
      justify-content: flex-end;
    }

    /* Modal decision */
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
      max-width: 480px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
      margin-bottom: 16px;
    }

    .modal-header h3 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text);
    }

    .modal-header p {
      font-size: 12px;
      color: var(--muted);
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
        <a href="approval_kacab.html" id="navApproval" class="active"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
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
          <h2 id="pageTitle">Otorisasi & Approval Kacab</h2>
          <p class="page-sub">Persetujuan pengajuan diskon khusus & appraisal wewenang eksekutif</p>
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

      <!-- CATEGORY SEGMENT TABS (KACAB) -->
      <div style="display:flex; gap:10px; margin-bottom:16px; border-bottom:1px solid var(--border); padding-bottom:12px;">
        <button class="filter-pill active" id="tabCatOtorisasi" onclick="switchKacabCategory('otorisasi')" style="padding:10px 20px; font-size:13px; font-weight:800;">
          <i class="fa-solid fa-file-signature"></i> Otorisasi Diskon & Appraisal
        </button>
        <button class="filter-pill" id="tabCatTestDrive" onclick="switchKacabCategory('testdrive')" style="padding:10px 20px; font-size:13px; font-weight:800;">
          <i class="fa-solid fa-car-side" style="color:var(--gold);"></i> Monitoring & Approval Test Drive (Semua Sales)
        </button>
      </div>

      <!-- FILTER TABS -->
      <div class="filter-bar" id="filterBarOtorisasi">
        <button class="filter-pill active" onclick="setFilter('Semua', this)">
          <i class="fa-solid fa-layer-group"></i> Semua Pengajuan
        </button>
        <button class="filter-pill" onclick="setFilter('Menunggu', this)">
          <i class="fa-solid fa-clock" style="color:var(--amber);"></i> Menunggu Otorisasi
          <span class="badge-count" id="cntPending">0</span>
        </button>
        <button class="filter-pill" onclick="setFilter('Disetujui', this)">
          <i class="fa-solid fa-circle-check" style="color:var(--green);"></i> Disetujui
          <span class="badge-count" id="cntApproved">0</span>
        </button>
        <button class="filter-pill" onclick="setFilter('Ditolak', this)">
          <i class="fa-solid fa-circle-xmark" style="color:var(--red);"></i> Ditolak
          <span class="badge-count" id="cntRejected">0</span>
        </button>
      </div>

      <!-- APPROVAL CONTAINER LIST -->
      <div id="approvalContainer">
        <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data otorisasi...</p>
      </div>
    </main>
  </div>

  <!-- DECISION MODAL -->
  <div class="modal-backdrop" id="decisionModal">
    <div class="modal-box">
      <div class="modal-header">
        <h3 id="modalTitle">Konfirmasi Otorisasi</h3>
        <p id="modalSub">Detail pengajuan Kacab</p>
      </div>
      <div style="margin-bottom: 16px;">
        <label style="font-size:12px;font-weight:700;color:var(--text-dark);display:block;margin-bottom:6px;">
          Catatan/Instruksi Kepala Cabang (Opsional)
        </label>
        <textarea id="inputCatatanKacab" class="input-modern" rows="3"
          placeholder="Tuliskan alasan atau instruksi khusus untuk SPV & Sales..." style="width:100%;font-size:13px;"></textarea>
      </div>
      <div style="display:flex;justify-content:flex-end;gap:10px;">
        <button class="btn btn-ghost btn-sm" onclick="closeDecisionModal()">Batal</button>
        <button id="btnSubmitDecision" class="btn btn-success btn-sm" onclick="submitDecision()">
          Konfirmasi
        </button>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_approval.js?v=20260819_master"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
