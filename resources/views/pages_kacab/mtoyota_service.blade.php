<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Monitoring m-Toyota &amp; After-Sales Delivery</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
  <style>
    .kcb-mtoyota-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
      margin-bottom: 16px;
    }
    .kpi-grid-kacab {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .kpi-card-kacab {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
      display: flex;
      align-items: center;
      gap: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.02);
      transition: all 0.2s ease;
    }
    .kpi-card-kacab:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.06);
    }
    .kpi-icon-wrap {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      flex-shrink: 0;
    }
    .kpi-icon-gold { background: #fefce8; color: #ca8a04; }
    .kpi-icon-emerald { background: #ecfdf5; color: #059669; }
    .kpi-icon-blue { background: #eff6ff; color: #2563eb; }
    .kpi-icon-purple { background: #faf5ff; color: #7c3aed; }
    .kpi-icon-maroon { background: #fff1f2; color: #e11d48; }

    .kpi-num {
      font-size: 24px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.1;
    }
    .kpi-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 3px;
    }

    .kcb-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .kcb-table th {
      background: #f8fafc;
      color: #334155;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.4px;
      padding: 12px 14px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }
    .kcb-table td {
      padding: 12px 14px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      vertical-align: middle;
    }
    .kcb-table tr:hover {
      background: #fdfbf7;
    }

    .badge-stage {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      white-space: nowrap;
    }
    .badge-stage-done {
      background: #ecfdf5;
      color: #059669;
      border: 1px solid #a7f3d0;
    }
    .badge-stage-booked {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    .badge-stage-pending {
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #e2e8f0;
    }

    .progress-bar-wrap {
      width: 100%;
      height: 7px;
      background: #e2e8f0;
      border-radius: 10px;
      overflow: hidden;
      margin-top: 5px;
    }
    .progress-bar-fill {
      height: 100%;
      border-radius: 10px;
      transition: width 0.4s ease;
    }

    /* Modal Lightbox Foto */
    .lightbox-modal {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(30, 16, 20, 0.85);
      backdrop-filter: blur(5px);
      z-index: 999999;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .lightbox-content {
      background: #ffffff;
      border-radius: 16px;
      max-width: 760px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
      display: flex;
      flex-direction: column;
    }
    .lightbox-header {
      padding: 16px 22px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e1014;
      color: #ffffff;
      border-radius: 16px 16px 0 0;
    }
    .lightbox-body {
      padding: 20px;
    }
    .photo-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 14px;
      margin-top: 14px;
    }
    .photo-preview-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px;
      background: #f8fafc;
      text-align: center;
    }
    .photo-preview-item img {
      width: 100%;
      height: 155px;
      object-fit: cover;
      border-radius: 8px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .photo-preview-item img:hover {
      transform: scale(1.02);
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
        <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i>After Sales</a>
        <a href="mtoyota_service.html" id="navMtoyota" class="active"><i class="fa-solid fa-car-on"></i>m-Toyota &amp; Service <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 6px; border-radius:4px; font-weight:800;">LIVE</span></a>
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
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-car-on" style="color:#d8a437;"></i> Monitoring Input Serah Terima &amp; m-Toyota Cabang
          </h2>
          <p class="page-sub">Pantau realisasi serah terima unit (DO), edukasi aktivasi DEC m-Toyota, dan booking servis berkala 1.000 KM s/d 20.000 KM seluruh wiraniaga</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kacabAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" alt="Avatar">
            <span class="dot" style="background:#d8a437;"></span>
          </div>
          <div class="meta">
            <span class="name" id="kacabNama">Kepala Cabang</span>
            <span class="role" id="kacabRole">Branch Manager</span>
          </div>
        </div>
      </div>

      <!-- KPI Executive Summary Cards -->
      <div class="kpi-grid-kacab">
        <div class="kpi-card-kacab">
          <div class="kpi-icon-wrap kpi-icon-gold"><i class="fa-solid fa-car-rear"></i></div>
          <div>
            <div class="kpi-num" id="kpiTotalUnit">0</div>
            <div class="kpi-label">Total Unit DO Cabang</div>
          </div>
        </div>
        <div class="kpi-card-kacab">
          <div class="kpi-icon-wrap kpi-icon-emerald"><i class="fa-solid fa-mobile-screen-button"></i></div>
          <div>
            <div class="kpi-num" id="kpiDecDone">0</div>
            <div class="kpi-label">Realisasi DEC m-Toyota</div>
          </div>
        </div>
        <div class="kpi-card-kacab">
          <div class="kpi-icon-wrap kpi-icon-blue"><i class="fa-solid fa-calendar-check"></i></div>
          <div>
            <div class="kpi-num" id="kpiFsDone">0</div>
            <div class="kpi-label">Booking FS 1.000 KM</div>
          </div>
        </div>
        <div class="kpi-card-kacab">
          <div class="kpi-icon-wrap kpi-icon-purple"><i class="fa-solid fa-wrench"></i></div>
          <div>
            <div class="kpi-num" id="kpiSbDone">0</div>
            <div class="kpi-label">Servis Berkala T-Care</div>
          </div>
        </div>
        <div class="kpi-card-kacab">
          <div class="kpi-icon-wrap kpi-icon-maroon"><i class="fa-solid fa-chart-pie"></i></div>
          <div>
            <div class="kpi-num" id="kpiAvgProgress">0%</div>
            <div class="kpi-label">Rata-Rata After-Sales</div>
          </div>
        </div>
      </div>

      <!-- Filter Toolbar -->
      <div class="kcb-mtoyota-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
            <!-- Filter SPV -->
            <div style="min-width:170px;">
              <select class="form-control" id="filterSpv" onchange="onSpvFilterChange()" style="padding:8px 12px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; background:#fff;">
                <option value="Semua">-- Semua Tim SPV --</option>
              </select>
            </div>

            <!-- Filter Sales -->
            <div style="min-width:180px;">
              <select class="form-control" id="filterSales" onchange="applyFilters()" style="padding:8px 12px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; background:#fff;">
                <option value="0">-- Semua Wiraniaga --</option>
              </select>
            </div>

            <!-- Filter Stage -->
            <div style="min-width:170px;">
              <select class="form-control" id="filterStage" onchange="applyFilters()" style="padding:8px 12px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; background:#fff;">
                <option value="">-- Semua Tahapan --</option>
                <option value="pending_dec">Butuh Edukasi DEC</option>
                <option value="pending_fs1000">Butuh Booking FS 1000 KM</option>
                <option value="booked_fs1000">Terjadwal FS 1000 KM</option>
                <option value="completed">Selesai 100%</option>
              </select>
            </div>

            <!-- Search input -->
            <div style="flex:1; min-width:220px; position:relative;">
              <input type="text" id="searchKeyword" onkeyup="handleSearchKey(event)" placeholder="Cari nama customer, no polisi, no rangka, sales..." style="width:100%; padding:8px 12px 8px 34px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; background:#fff;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:11px; color:#94a3b8; font-size:12px;"></i>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn btn-outline" onclick="exportDataCsv()" style="padding:8px 14px; font-size:12px; border-radius:8px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-file-excel" style="color:#059669;"></i> Export CSV
            </button>
            <button type="button" class="btn btn-outline" onclick="loadMtoyotaData()" style="padding:8px 14px; font-size:12px; border-radius:8px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-rotate-right"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Main Data Table Card -->
      <div class="kcb-mtoyota-card" style="padding:0; overflow:hidden;">
        <div style="padding:14px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#fafafa;">
          <h4 style="margin:0; font-size:13.5px; font-weight:800; color:#0f172a;">
            <i class="fa-solid fa-clipboard-list" style="color:#d8a437; margin-right:6px;"></i> Rekap Input m-Toyota &amp; Service Seluruh Cabang
          </h4>
          <span style="font-size:11.5px; color:#64748b; font-weight:700;" id="totalRecordLabel">Menampilkan 0 data</span>
        </div>

        <div style="overflow-x:auto;">
          <table class="kcb-table">
            <thead>
              <tr>
                <th style="width:40px;">No</th>
                <th>Data Customer &amp; Unit</th>
                <th>Wiraniaga &amp; SPV</th>
                <th>Tgl DO</th>
                <th>Tahapan Progress</th>
                <th style="width:130px;">Overall Progress</th>
                <th style="text-align:center; width:120px;">Bukti Foto</th>
              </tr>
            </thead>
            <tbody id="mtoyotaTableBody">
              <tr>
                <td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">
                  <i class="fa-solid fa-circle-notch fa-spin" style="font-size:20px; margin-bottom:8px; display:block;"></i>
                  Memuat data inputan serah terima sales...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <!-- Modal Lightbox Bukti Foto & Detail -->
  <div class="lightbox-modal" id="photoLightbox">
    <div class="lightbox-content">
      <div class="lightbox-header">
        <div>
          <h4 style="margin:0; font-size:14px; font-weight:800;" id="modalCustTitle">Detail &amp; Bukti Foto Customer</h4>
          <p style="margin:2px 0 0; font-size:11px; opacity:0.8;" id="modalUnitSub">-</p>
        </div>
        <button type="button" onclick="closePhotoModal()" style="background:none; border:none; color:#fff; font-size:18px; cursor:pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="lightbox-body">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px; font-size:12px; background:#f8fafc; padding:12px 14px; border-radius:10px; border:1px solid #e2e8f0;">
          <div>
            <div style="color:#64748b; font-size:10.5px; font-weight:700;">WIRANIAGA &amp; SPV</div>
            <div style="font-weight:800; color:#0f172a;" id="modalSalesName">-</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:10.5px; font-weight:700;">NO POLISI &amp; RANGKA</div>
            <div style="font-weight:800; color:#0f172a;" id="modalPlateVin">-</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:10.5px; font-weight:700;">WHATSAPP / HP</div>
            <div style="font-weight:800; color:#0f172a;" id="modalPhone">-</div>
          </div>
          <div>
            <div style="color:#64748b; font-size:10.5px; font-weight:700;">PROGRESS KESELURUHAN</div>
            <div style="font-weight:800; color:#059669;" id="modalProgressVal">-</div>
          </div>
        </div>

        <h5 style="margin:0 0 8px 0; font-size:12.5px; font-weight:800; color:#0f172a;">
          <i class="fa-solid fa-images" style="color:#d8a437; margin-right:5px;"></i> Lampiran Bukti Foto Fisik &amp; m-Toyota:
        </h5>
        
        <div class="photo-preview-grid" id="modalPhotosContainer">
          <!-- Diisi via JS -->
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_mtoyota.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
