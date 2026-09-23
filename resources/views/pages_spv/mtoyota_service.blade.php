<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Monitoring m-Toyota &amp; Booking Service</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915_layout_perfect">
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
  <style>
    .spv-mtoyota-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 18px 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
      margin-bottom: 16px;
    }
    .kpi-grid-mtoyota {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin-bottom: 16px;
    }
    .kpi-card-mtoyota {
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
    .kpi-card-mtoyota:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.06);
    }
    .kpi-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .kpi-icon-blue { background: #eff6ff; color: #2563eb; }
    .kpi-icon-green { background: #ecfdf5; color: #059669; }
    .kpi-icon-orange { background: #fff7ed; color: #ea580c; }
    .kpi-icon-purple { background: #faf5ff; color: #7c3aed; }
    .kpi-icon-rose { background: #fff1f2; color: #e11d48; }

    .kpi-num {
      font-size: 22px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1.1;
    }
    .kpi-label {
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-top: 2px;
    }

    .mtoyota-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
    }
    .mtoyota-table th {
      background: #f8fafc;
      color: #475569;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.4px;
      padding: 12px 14px;
      border-bottom: 2px solid #e2e8f0;
      text-align: left;
    }
    .mtoyota-table td {
      padding: 13px 14px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      vertical-align: middle;
    }
    .mtoyota-table tr:hover {
      background: #f8fafc;
    }

    .badge-stage {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 10.5px;
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
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(5px);
      z-index: 999999;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .lightbox-content {
      background: #ffffff;
      border-radius: 16px;
      max-width: 720px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4);
      display: flex;
      flex-direction: column;
    }
    .lightbox-header {
      padding: 16px 20px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #0d1b3e;
      color: #ffffff;
      border-radius: 16px 16px 0 0;
    }
    .lightbox-body {
      padding: 20px;
    }
    .photo-preview-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 14px;
      margin-top: 12px;
    }
    .photo-preview-item {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 8px;
      background: #f8fafc;
      text-align: center;
    }
    .photo-preview-item img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      border-radius: 6px;
      cursor: pointer;
      transition: transform 0.2s;
    }
    .photo-preview-item img:hover {
      transform: scale(1.02);
    }
  </style>
</head>

<body>
  <div class="spv-shell">
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
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="mtoyota_service.html" id="navMtoyota" class="active"><i class="fa-solid fa-car-on"></i>m-Toyota &amp; Service <span class="sidebar-notif-badge" style="background:#e11d48; color:#fff; display:inline-block; margin-left:auto; font-size:9px; padding:1px 6px; border-radius:4px; font-weight:800;">LIVE</span></a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas</a>
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

    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-car-on" style="color:#e11d48;"></i> Monitoring m-Toyota &amp; Booking Service
          </h2>
          <p class="page-sub">Pantau bukti input serah terima DO, aktivasi DEC m-Toyota, dan booking servis 1.000 KM s/d 20.000 KM tim wiraniaga</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Supervisor</span>
            <span class="role" id="spvRole">Supervisor Sales</span>
          </div>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="kpi-grid-mtoyota">
        <div class="kpi-card-mtoyota">
          <div class="kpi-icon-wrap kpi-icon-blue"><i class="fa-solid fa-car-side"></i></div>
          <div>
            <div class="kpi-num" id="kpiTotalUnit">0</div>
            <div class="kpi-label">Total Unit DO Tim</div>
          </div>
        </div>
        <div class="kpi-card-mtoyota">
          <div class="kpi-icon-wrap kpi-icon-green"><i class="fa-solid fa-mobile-screen-button"></i></div>
          <div>
            <div class="kpi-num" id="kpiDecDone">0</div>
            <div class="kpi-label">Edukasi DEC m-Toyota</div>
          </div>
        </div>
        <div class="kpi-card-mtoyota">
          <div class="kpi-icon-wrap kpi-icon-orange"><i class="fa-solid fa-calendar-check"></i></div>
          <div>
            <div class="kpi-num" id="kpiFsDone">0</div>
            <div class="kpi-label">Servis FS 1.000 KM</div>
          </div>
        </div>
        <div class="kpi-card-mtoyota">
          <div class="kpi-icon-wrap kpi-icon-purple"><i class="fa-solid fa-wrench"></i></div>
          <div>
            <div class="kpi-num" id="kpiSbDone">0</div>
            <div class="kpi-label">Servis Berkala (T-Care)</div>
          </div>
        </div>
        <div class="kpi-card-mtoyota">
          <div class="kpi-icon-wrap kpi-icon-rose"><i class="fa-solid fa-chart-line"></i></div>
          <div>
            <div class="kpi-num" id="kpiAvgProgress">0%</div>
            <div class="kpi-label">Rata-rata Progress</div>
          </div>
        </div>
      </div>

      <!-- Filter & Search Toolbar -->
      <div class="spv-mtoyota-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
            <!-- Filter Sales -->
            <div style="min-width:180px;">
              <select class="form-control" id="filterSales" onchange="applyFilters()" style="padding:8px 12px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; font-weight:700; background:#fff;">
                <option value="0">-- Semua Wiraniaga Tim --</option>
              </select>
            </div>

            <!-- Filter Stage -->
            <div style="min-width:180px;">
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
              <input type="text" id="searchKeyword" onkeyup="handleSearchKey(event)" placeholder="Cari nama customer, no polisi, no rangka..." style="width:100%; padding:8px 12px 8px 34px; font-size:12px; border-radius:8px; border:1px solid #cbd5e1; background:#fff;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:11px; color:#94a3b8; font-size:12px;"></i>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button type="button" class="btn btn-outline" onclick="loadMtoyotaData()" style="padding:8px 14px; font-size:12px; border-radius:8px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-rotate-right"></i> Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Main Data Table Card -->
      <div class="spv-mtoyota-card" style="padding:0; overflow:hidden;">
        <div style="padding:14px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#fafafa;">
          <h4 style="margin:0; font-size:13.5px; font-weight:800; color:#0f172a;">
            <i class="fa-solid fa-list-check" style="color:#0284c7; margin-right:6px;"></i> Daftar Input Serah Terima &amp; Booking Service
          </h4>
          <span style="font-size:11.5px; color:#64748b; font-weight:700;" id="totalRecordLabel">Menampilkan 0 data</span>
        </div>

        <div style="overflow-x:auto;">
          <table class="mtoyota-table">
            <thead>
              <tr>
                <th style="width:40px;">No</th>
                <th>Data Customer &amp; Unit</th>
                <th>Wiraniaga</th>
                <th>Tgl DO</th>
                <th>Tahapan Progress</th>
                <th style="width:140px;">Overall Progress</th>
                <th style="text-align:center; width:130px;">Aksi</th>
              </tr>
            </thead>
            <tbody id="mtoyotaTableBody">
              <tr>
                <td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">
                  <i class="fa-solid fa-circle-notch fa-spin" style="font-size:20px; margin-bottom:8px; display:block;"></i>
                  Memuat data inputan sales...
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
            <div style="color:#64748b; font-size:10.5px; font-weight:700;">WIRANIAGA</div>
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
          <i class="fa-solid fa-images" style="color:#c8102e; margin-right:5px;"></i> Bukti Foto Yang Diunggah Sales:
        </h5>
        
        <div class="photo-preview-grid" id="modalPhotosContainer">
          <!-- Diisi via JS -->
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/spv_mtoyota.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
