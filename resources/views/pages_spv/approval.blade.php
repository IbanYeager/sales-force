<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Approval</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/spv_approval.css">

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
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval" class="active"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
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

    <!-- MAIN BODY -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle">Approval Pengajuan</h2>
          <p class="page-sub">Setujui atau tolak pengajuan dari tim Anda</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Memuat...</span>
          </div>
        </div>
      </div>

      <!-- DISKON & PLAFOND APPROVAL DESK WIDGET -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius:16px; padding:18px; color:white; margin-bottom:18px; box-shadow:0 8px 20px rgba(0,0,0,0.15); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <span style="background:rgba(37,99,235,0.2); color:#60a5fa; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
            <i class="fa-solid fa-calculator"></i> Plafond Desk SPV
          </span>
          <h3 style="font-size:16px; font-weight:800; color:white; margin:6px 0 2px;">Kalkulator Simulaasi Limit Diskon & Margin SPV</h3>
          <p style="font-size:12px; color:#94a3b8; margin:0;">Hitung toleransi batas diskon & profit retention sebelum menyetujui pengajuan SPK sales.</p>
        </div>
        <button class="btn" style="background:#2563eb; color:white; font-weight:700; border:none; padding:10px 18px; border-radius:10px; cursor:pointer;" onclick="openApprovalDiscountDesk()">
          <i class="fa-solid fa-calculator"></i> Buka Simulasi Diskon
        </button>
      </div>

      <!-- Segment Tabs -->
      <div class="tabs-nav" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="tab-item active" id="tabSpk" onclick="switchView('spk')">
            <i class="fa-solid fa-file-invoice"></i> Pengajuan SPK <span class="badge-count" id="countSpkBadge">0</span>
          </button>
          <button class="tab-item" id="tabOlx" onclick="switchView('olx')">
            <i class="fa-solid fa-exchange-alt"></i> Trade-In OLX <span class="badge-count" id="countOlxBadge">0</span>
          </button>
          <button class="tab-item" id="tabTestDrive" onclick="switchView('testdrive')">
            <i class="fa-solid fa-car-side"></i> Test Drive <span class="badge-count" id="countTestDriveBadge">0</span>
          </button>
        </div>
        <div>
          <select id="selectFilterSpvApproval" class="form-control" style="width: auto; padding: 7px 12px; font-weight: 700; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 12px; background: #f8fafc;" onchange="changeApprovalSpvFilter(this.value)">
            <option value="Semua">Semua Tim (Master - 42 Sales)</option>
            <option value="Ryan">Tim Pak Ryan</option>
            <option value="Riva">Tim Pak Riva</option>
            <option value="Dani">Tim Pak Dani</option>
            <option value="Hendra">Tim Pak Hendra</option>
          </select>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="spv-card" style="min-height: 400px;">
        <div id="approvalContent">
          <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
        </div>
      </div>
    </main>
  </div>

  <!-- MODAL APPROVAL DISKON DESK -->
  <div class="modal-overlay" id="approvalDiscountDeskModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:520px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-calculator" style="color:#2563eb;"></i> Diskon & Plafond Approval Desk</h3>
        <button onclick="closeApprovalDiscountDesk()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Tipe Kendaraan Toyota</label>
          <select id="apprModelSelect" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600;" onchange="calcApprDiscount()">
            <option value="avanza">Toyota Avanza G CVT (Max SPV: Rp 15 Juta)</option>
            <option value="veloz">Toyota Veloz Q CVT (Max SPV: Rp 18 Juta)</option>
            <option value="zenix">Innova Zenix V Hybrid (Max SPV: Rp 22 Juta)</option>
            <option value="fortuner">Fortuner 2.8 VRZ (Max SPV: Rp 30 Juta)</option>
            <option value="yaris_cross">Yaris Cross S GR (Max SPV: Rp 20 Juta)</option>
          </select>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nominal Diskon Diajukan Sales (Rp)</label>
          <input type="number" id="apprDiscountInput" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:700; font-size:16px;" value="15000000" oninput="calcApprDiscount()">
        </div>

        <div id="apprSimBox" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-top:4px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:12px; color:#166534; font-weight:700;">Status Kelayakan Margin:</span>
            <span id="apprStatusBadge" style="font-size:11px; font-weight:800; padding:2px 8px; border-radius:6px; background:#dcfce7; color:#15803d;">Lolos Toleransi SPV</span>
          </div>
          <div style="font-size:18px; font-weight:900; color:#15803d; margin-bottom:2px;" id="apprProfitText">Profit Retention: Aman</div>
          <p style="font-size:11px; color:#166534; margin:0;" id="apprDescText">Pengajuan diskon berada pada rentang yang diizinkan untuk Supervisor.</p>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px; justify-content:flex-end;">
        <button class="btn" style="background:#e2e8f0; color:#334155; font-weight:700; border:none; padding:10px 16px; border-radius:10px; cursor:pointer;" onclick="closeApprovalDiscountDesk()">Batal</button>
        <button class="btn" style="background:#059669; color:white; font-weight:700; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="applyApprDiscount()">
          <i class="fa-solid fa-check-circle"></i> Setujui Diskon
        </button>
      </div>
    </div>
  </div>
    </main>
  </div>

  <!-- Image Zoom Modal -->
  <div id="imageZoomModal" class="zoom-overlay">
    <button class="zoom-close" onclick="closeImageZoom()"><i class="fa-solid fa-xmark"></i></button>
    <img id="zoomedImg" src="" alt="Foto">
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_approval.js?v=20260819_master"></script>

  <script src="../js/pwa-app.js?v=3"></script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
