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

    /* Kacab Input Aktivitas Button & Modal Styling */
    .btn-input-kacab-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #cc1426, #990f1d);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 10px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(204, 20, 38, 0.28);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
    }
    .btn-input-kacab-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(204, 20, 38, 0.4);
      background: linear-gradient(135deg, #e01d31, #b31222);
    }
    .btn-input-kacab-toolbar {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: #cc1426;
      color: #ffffff;
      border: none;
      padding: 8px 14px;
      border-radius: 9px;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(204, 20, 38, 0.25);
      white-space: nowrap;
    }
    .btn-input-kacab-toolbar:hover {
      background: #a30f1e;
      transform: translateY(-1px);
    }

    /* Modal Overlay & Card */
    .input-modal-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 99998;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .input-modal-card {
      background: #ffffff;
      border-radius: 20px;
      width: 100%;
      max-width: 720px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.35);
      border: 1px solid #cbd5e1;
      animation: modalScaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes modalScaleUp {
      from { opacity: 0; transform: scale(0.95) translateY(12px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .input-modal-header {
      background: linear-gradient(135deg, #1e1014, #3d121c);
      color: #ffffff;
      padding: 18px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid rgba(216, 164, 55, 0.4);
    }
    .input-modal-header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .input-modal-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: linear-gradient(135deg, #cc1426, #8a0e1a);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      box-shadow: 0 4px 12px rgba(204, 20, 38, 0.35);
      border: 1px solid rgba(255, 255, 255, 0.15);
      flex-shrink: 0;
    }
    .input-modal-header h3 {
      margin: 0;
      font-size: 17px;
      font-weight: 800;
      letter-spacing: -0.3px;
      color: #ffffff;
    }
    .input-modal-sub {
      font-size: 12px;
      color: #cbd5e1;
      display: block;
      margin-top: 2px;
    }
    .input-modal-close {
      background: rgba(255, 255, 255, 0.12);
      border: none;
      color: #ffffff;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    .input-modal-close:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: rotate(90deg);
    }
    .input-modal-body {
      padding: 20px 24px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .kacab-action-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: #fdf2f2;
      border: 1px solid #fee2e2;
      border-left: 4px solid #cc1426;
      border-radius: 10px;
      padding: 11px 14px;
      font-size: 12px;
      color: #7f1d1d;
      line-height: 1.5;
    }
    .form-section-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #475569;
      margin-top: 6px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 5px;
    }
    .form-section-title i {
      color: #cc1426;
    }
    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }
    @media (max-width: 600px) {
      .form-grid-2 {
        grid-template-columns: 1fr;
      }
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .form-label {
      font-size: 12.5px;
      font-weight: 700;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .form-label .req {
      color: #ef4444;
    }
    .form-sublabel {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
    }
    .custom-input-wrapper,
    .custom-select-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .input-icon,
    .select-icon {
      position: absolute;
      left: 12px;
      color: #94a3b8;
      font-size: 14px;
      pointer-events: none;
    }
    .form-control {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      font-size: 13px;
      color: #1e293b;
      background: #ffffff;
      font-family: inherit;
      transition: all 0.2s;
      box-sizing: border-box;
    }
    .form-control.with-icon {
      padding-left: 36px;
    }
    .form-control:focus {
      outline: none;
      border-color: #cc1426;
      box-shadow: 0 0 0 3px rgba(204, 20, 38, 0.12);
    }
    .sesi-radio-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    @media (max-width: 520px) {
      .sesi-radio-grid {
        grid-template-columns: 1fr;
      }
    }
    .sesi-radio-card {
      position: relative;
      cursor: pointer;
      border: 1.5px solid #e2e8f0;
      background: #f8fafc;
      border-radius: 12px;
      padding: 9px 12px;
      transition: all 0.2s;
      display: flex;
      align-items: center;
    }
    .sesi-radio-card input {
      position: absolute;
      opacity: 0;
      pointer-events: none;
    }
    .sesi-content {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
    }
    .sesi-icon {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
    }
    .sesi-icon.morning {
      background: #fef3c7;
      color: #d97706;
    }
    .sesi-icon.noon {
      background: #ffedd5;
      color: #ea580c;
    }
    .sesi-icon.evening {
      background: #ede9fe;
      color: #7c3aed;
    }
    .sesi-text {
      display: flex;
      flex-direction: column;
    }
    .sesi-title {
      font-weight: 700;
      font-size: 12.5px;
      color: #1e293b;
    }
    .sesi-time {
      font-size: 10.5px;
      color: #64748b;
    }
    .sesi-radio-card.active,
    .sesi-radio-card:has(input:checked) {
      background: #ffffff;
      border-color: #cc1426;
      box-shadow: 0 4px 12px rgba(204, 20, 38, 0.12);
    }
    .sesi-radio-card:has(input:checked) .sesi-title {
      color: #cc1426;
    }
    .upload-dropzone {
      border: 2px dashed #cbd5e1;
      border-radius: 14px;
      background: #f8fafc;
      padding: 16px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }
    .upload-dropzone:hover {
      border-color: #cc1426;
      background: #fdf2f2;
    }
    .dropzone-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .dropzone-icon {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
    }
    .btn-browse-file {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      color: #334155;
      padding: 5px 13px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .foto-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(88px, 1fr));
      gap: 10px;
    }
    .foto-thumb-item {
      position: relative;
      border-radius: 10px;
      overflow: hidden;
      height: 88px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }
    .foto-thumb-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .foto-remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: rgba(220, 38, 38, 0.85);
      color: #ffffff;
      border: none;
      border-radius: 50%;
      width: 22px;
      height: 22px;
      cursor: pointer;
      font-size: 11px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
    }
    .foto-remove-btn:hover {
      background: #dc2626;
      transform: scale(1.1);
    }
    .btn-clear-photos {
      background: transparent;
      border: none;
      color: #ef4444;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .quick-date-btns {
      display: flex;
      gap: 6px;
    }
    .btn-quick-date {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1d4ed8;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-quick-date:hover {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-quick-prospek {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      padding: 9px 12px;
      border-radius: 9px;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-quick-prospek:hover {
      background: #cc1426;
      border-color: #cc1426;
      color: #ffffff;
    }
    .sales-info-chip {
      display: flex;
      align-items: center;
      gap: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px 12px;
      margin-top: 6px;
    }
    .sales-avatar-badge {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #fee2e2;
      color: #cc1426;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 13px;
      flex-shrink: 0;
    }
    .sales-name-chip {
      font-weight: 700;
      font-size: 13px;
      color: #0f172a;
    }
    .sales-spv-chip {
      font-size: 11px;
      color: #64748b;
    }
    .badge-tingkatan {
      background: #e2e8f0;
      color: #334155;
      padding: 1px 6px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }
    .input-modal-footer {
      padding: 14px 24px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .btn-modal-cancel {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      color: #475569;
      padding: 9px 18px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-modal-cancel:hover {
      background: #f1f5f9;
      color: #1e293b;
    }
    .btn-modal-save {
      background: linear-gradient(135deg, #cc1426, #990f1d);
      border: none;
      color: #ffffff;
      padding: 9px 22px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(204, 20, 38, 0.3);
      transition: all 0.2s;
    }
    .btn-modal-save:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(204, 20, 38, 0.4);
      background: linear-gradient(135deg, #e01d31, #b31222);
    }
    .btn-modal-save:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
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
        <div style="display: flex; align-items: center; gap: 14px;">
          <button type="button" class="btn-input-kacab-primary" onclick="openInputAktivitasModal()">
            <i class="fa-solid fa-circle-plus"></i>
            <span>Input Aktivitas Sales</span>
          </button>
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
          <button type="button" class="btn-input-kacab-toolbar" onclick="openInputAktivitasModal()">
            <i class="fa-solid fa-plus"></i> Input Aktivitas
          </button>
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

  <!-- Modal Input Aktivitas oleh Kacab -->
  <div id="inputAktivitasModal" class="input-modal-overlay">
    <div class="input-modal-card">
      <div class="input-modal-header">
        <div class="input-modal-header-left">
          <div class="input-modal-icon">
            <i class="fa-solid fa-clipboard-user"></i>
          </div>
          <div>
            <h3>Input Aktivitas Wiraniaga</h3>
            <span class="input-modal-sub">Catat kegiatan &amp; hasil aktivitas sales langsung oleh Kepala Cabang</span>
          </div>
        </div>
        <button type="button" class="input-modal-close" onclick="closeInputAktivitasModal()" aria-label="Tutup modal">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="formInputAktivitas" onsubmit="submitInputAktivitas(event)" enctype="multipart/form-data">
        <div class="input-modal-body">
          
          <!-- Banner info otorisasi kacab -->
          <div class="kacab-action-banner">
            <i class="fa-solid fa-shield-halved" style="font-size:16px; margin-top:2px;"></i>
            <div>
              <strong>Mode Otorisasi Kepala Cabang:</strong> Anda dapat mencatat aktivitas dan hasil kegiatan atas nama wiraniaga terkait. Data akan otomatis masuk ke timeline, laporan KPI cabang, dan galeri pameran.
            </div>
          </div>

          <!-- Section 1: Sales / Wiraniaga -->
          <div class="form-section-title">
            <i class="fa-solid fa-user-check"></i> 1. Pilih Wiraniaga &amp; Tim
          </div>
          <div class="form-group" style="margin-bottom: 8px;">
            <label class="form-label">Wiraniaga / Sales Pelaksana <span class="req">*</span></label>
            <div class="custom-select-wrapper">
              <i class="fa-solid fa-user select-icon"></i>
              <select id="modalInputSales" name="sales_account_id" class="form-control with-icon" required onchange="onInputSalesSelected()">
                <option value="">-- Pilih Sales yang Menjalankan Aktivitas --</option>
              </select>
            </div>
            <input type="hidden" id="modalInputNamaSales" name="nama_sales">

            <!-- Card Info Sales Terpilih -->
            <div id="salesSelectedInfoCard" class="sales-info-chip" style="display:none;">
              <div class="sales-avatar-badge" id="salesCardAvatar">S</div>
              <div class="sales-meta-chip">
                <div class="sales-name-chip" id="salesCardNama">Nama Sales</div>
                <div class="sales-spv-chip">
                  <span>SPV: <strong id="salesCardSpv" style="color:#0f172a;">-</strong></span> &bull; 
                  <span id="salesCardTingkatan" class="badge-tingkatan">Executive</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Section 2: Waktu Pelaksanaan -->
          <div class="form-section-title">
            <i class="fa-solid fa-calendar-day"></i> 2. Tanggal &amp; Sesi Waktu Pelaksanaan
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label class="form-label" style="margin-bottom:0;">Tanggal Kegiatan <span class="req">*</span></label>
                <div class="quick-date-btns">
                  <button type="button" class="btn-quick-date" onclick="setInputDatePreset('today')">Hari Ini</button>
                  <button type="button" class="btn-quick-date" onclick="setInputDatePreset('yesterday')">Kemarin</button>
                </div>
              </div>
              <div class="custom-input-wrapper">
                <i class="fa-solid fa-calendar-days input-icon"></i>
                <input type="date" id="modalInputTanggal" name="tanggal" class="form-control with-icon" required>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Jam Pelaksanaan <span class="form-sublabel">(Waktu mulai)</span></label>
              <div class="custom-input-wrapper">
                <i class="fa-regular fa-clock input-icon"></i>
                <input type="time" id="modalInputJam" name="jam" class="form-control with-icon">
              </div>
            </div>
          </div>

          <!-- Sesi Waktu -->
          <div class="form-group" style="margin-bottom: 6px;">
            <label class="form-label">Sesi Waktu <span class="req">*</span></label>
            <div class="sesi-radio-grid">
              <label class="sesi-radio-card" id="cardSesiPagi">
                <input type="radio" name="sesi_waktu" value="Pagi" onchange="onSesiRadioChange('Pagi')" checked>
                <div class="sesi-content">
                  <div class="sesi-icon morning"><i class="fa-solid fa-cloud-sun"></i></div>
                  <div class="sesi-text">
                    <span class="sesi-title">Sesi Pagi</span>
                    <span class="sesi-time">08:00 - 12:00</span>
                  </div>
                </div>
              </label>

              <label class="sesi-radio-card" id="cardSesiSiang">
                <input type="radio" name="sesi_waktu" value="Siang" onchange="onSesiRadioChange('Siang')">
                <div class="sesi-content">
                  <div class="sesi-icon noon"><i class="fa-solid fa-sun"></i></div>
                  <div class="sesi-text">
                    <span class="sesi-title">Sesi Siang</span>
                    <span class="sesi-time">12:00 - 15:30</span>
                  </div>
                </div>
              </label>

              <label class="sesi-radio-card" id="cardSesiSore">
                <input type="radio" name="sesi_waktu" value="Sore" onchange="onSesiRadioChange('Sore')">
                <div class="sesi-content">
                  <div class="sesi-icon evening"><i class="fa-solid fa-moon"></i></div>
                  <div class="sesi-text">
                    <span class="sesi-title">Sesi Sore</span>
                    <span class="sesi-time">15:30 - Selesai</span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Section 3: Detail Kegiatan -->
          <div class="form-section-title">
            <i class="fa-solid fa-list-check"></i> 3. Detail Aktivitas &amp; Lokasi
          </div>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Tipe Aktivitas <span class="req">*</span></label>
              <div class="custom-select-wrapper">
                <i class="fa-solid fa-tag select-icon"></i>
                <select id="modalInputTipe" name="tipe_aktivitas" class="form-control with-icon" required onchange="onTipeAktivitasChange()">
                  <option value="Pameran (Exhibition / Booth)">🎪 Pameran (Exhibition / Booth Mall)</option>
                  <option value="Canvassing Lapangan / Door to Door">🚶 Canvassing Lapangan / Door to Door</option>
                  <option value="Follow Up Database CRM (Telepon/WA)">📞 Follow Up Database CRM (Telepon/WA)</option>
                  <option value="Customer Gathering & Event Cabang">🎉 Customer Gathering &amp; Event Cabang</option>
                  <option value="Test Drive Bersama Customer">🚗 Test Drive Bersama Customer</option>
                  <option value="Digital Marketing / Live TikTok / Medsos">📱 Digital Marketing / Live TikTok / Medsos</option>
                  <option value="Delivery Ceremony / Handover Unit">🔑 Delivery Ceremony / Handover Unit</option>
                  <option value="Pertemuan Prospek / Kantor Customer">🏢 Pertemuan Prospek / Kantor Customer</option>
                  <option value="Aktivitas Lainnya">📝 Aktivitas Lainnya</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Status Aktivitas <span class="req">*</span></label>
              <div class="custom-select-wrapper">
                <i class="fa-solid fa-circle-check select-icon"></i>
                <select id="modalInputStatus" name="status" class="form-control with-icon" required>
                  <option value="Selesai" selected>✅ Selesai (Hasil Kegiatan Tuntas)</option>
                  <option value="Sedang Dilakukan">⏳ Sedang Dilakukan</option>
                  <option value="Rencana">📋 Rencana (Jadwal Kegiatan)</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Lokasi Kegiatan</label>
            <div class="custom-input-wrapper">
              <i class="fa-solid fa-location-dot input-icon"></i>
              <input type="text" id="modalInputLokasi" name="lokasi" class="form-control with-icon" placeholder="Contoh: Festival Citylink Bandung / Borma Cijerah / Showroom Kiara Condong">
            </div>
          </div>

          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Durasi Kegiatan</label>
              <div class="custom-select-wrapper">
                <i class="fa-solid fa-hourglass-half select-icon"></i>
                <select id="modalInputDurasi" name="durasi" class="form-control with-icon">
                  <option value="30 Menit">30 Menit</option>
                  <option value="1 Jam" selected>1 Jam</option>
                  <option value="2 Jam">2 Jam</option>
                  <option value="3 Jam">3 Jam</option>
                  <option value="Full Day (4+ Jam)">Full Day (4+ Jam)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Jumlah Prospek Didapat</label>
              <div style="display:flex; gap:8px; align-items:center;">
                <div class="custom-input-wrapper" style="flex:1;">
                  <i class="fa-solid fa-users-viewfinder input-icon"></i>
                  <input type="number" id="modalInputProspek" name="jumlah_prospek" class="form-control with-icon" min="0" value="0">
                </div>
                <button type="button" class="btn-quick-prospek" onclick="addProspekCount(1)" title="Tambah 1 Prospek">+1</button>
                <button type="button" class="btn-quick-prospek" onclick="addProspekCount(2)" title="Tambah 2 Prospek">+2</button>
                <button type="button" class="btn-quick-prospek" onclick="addProspekCount(5)" title="Tambah 5 Prospek">+5</button>
              </div>
            </div>
          </div>

          <!-- Section 4: Foto Bukti Aktivitas -->
          <div class="form-section-title">
            <i class="fa-solid fa-camera"></i> 4. Dokumentasi Foto Kegiatan
          </div>
          
          <div class="upload-dropzone" id="uploadDropZone" onclick="document.getElementById('modalInputFoto').click()">
            <input type="file" id="modalInputFoto" name="foto[]" accept="image/*" multiple style="display:none;" onchange="handleFotoUploadChange(this)">
            <div class="dropzone-inner">
              <div class="dropzone-icon">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <div class="dropzone-text">
                <strong style="color:#0f172a; font-size:13.5px;">Klik atau Ambil Foto Dokumentasi Aktivitas</strong>
                <p style="margin:4px 0 0 0; color:#64748b; font-size:11.5px;">Mendukung multi-foto (JPG, PNG, WEBP). Foto pameran/event otomatis terekap ke Galeri Cabang.</p>
              </div>
              <button type="button" class="btn-browse-file">
                <i class="fa-solid fa-folder-open"></i> Pilih File Foto
              </button>
            </div>
          </div>

          <!-- Preview List Foto -->
          <div id="fotoPreviewContainer" style="display:none; margin-top:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span style="font-size:12px; font-weight:700; color:#1e293b;" id="fotoCountLabel">0 Foto Terpilih</span>
              <button type="button" class="btn-clear-photos" onclick="clearSelectedPhotos()">
                <i class="fa-solid fa-trash-can"></i> Hapus Semua Foto
              </button>
            </div>
            <div id="fotoPreviewGrid" class="foto-preview-grid"></div>
          </div>

          <!-- Section 5: Keterangan / Laporan Hasil -->
          <div class="form-section-title" style="margin-top:10px;">
            <i class="fa-solid fa-clipboard-list"></i> 5. Catatan Keterangan &amp; Hasil Kegiatan
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label">Keterangan / Hasil Aktivitas <span class="req">*</span></label>
            <textarea id="modalInputKeterangan" name="keterangan" rows="3" class="form-control" required placeholder="Tuliskan keterangan lengkap kegiatan, respon customer, unit yang diminati (Avanza/Veloz/Zenix), catatan prospek, dll..."></textarea>
          </div>

        </div>

        <div class="input-modal-footer">
          <button type="button" class="btn-modal-cancel" onclick="closeInputAktivitasModal()">Batal</button>
          <button type="submit" id="btnSubmitInputAktivitas" class="btn-modal-save">
            <i class="fa-solid fa-check"></i>
            <span>Simpan Aktivitas Sales</span>
          </button>
        </div>
      </form>
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
  <script src="../js/kacab_aktivitas.js?v=20261007_kacab_input_v1"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
