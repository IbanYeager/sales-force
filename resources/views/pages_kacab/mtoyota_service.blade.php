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

    /* ── SOP Alur Kerja After-Sales & Onboarding Banner ── */
    .sop-banner-card {
      background: linear-gradient(135deg, #1b0e12 0%, #29141b 50%, #150a0d 100%);
      border: 1px solid rgba(216, 164, 55, 0.4);
      border-radius: 16px;
      padding: 22px 24px;
      color: #ffffff;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(30, 16, 20, 0.25);
      position: relative;
      overflow: hidden;
    }
    .sop-banner-card::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -60px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(216, 164, 55, 0.18) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }
    .sop-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 18px;
    }
    .sop-badge-pill {
      background: rgba(216, 164, 55, 0.18);
      border: 1px solid rgba(216, 164, 55, 0.4);
      color: #d8a437;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .sop-toggle-btn {
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 8px;
      font-size: 11.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .sop-toggle-btn:hover {
      background: rgba(216, 164, 55, 0.25);
      border-color: #d8a437;
      color: #ffd67a;
    }
    .sop-steps-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      position: relative;
    }
    @media (max-width: 1250px) {
      .sop-steps-grid {
        display: flex;
        overflow-x: auto;
        padding-bottom: 8px;
        scroll-snap-type: x mandatory;
      }
      .sop-step-node {
        min-width: 155px;
        scroll-snap-align: start;
        flex-shrink: 0;
      }
    }
    .sop-step-node {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 12px 8px;
      text-align: center;
      transition: all 0.25s ease;
      cursor: pointer;
      position: relative;
      user-select: none;
    }
    .sop-step-node:hover, .sop-step-node.active-step {
      background: rgba(216, 164, 55, 0.18);
      border-color: rgba(216, 164, 55, 0.7);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
    }
    .sop-step-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-size: 10.5px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 6px auto;
      transition: all 0.2s ease;
    }
    .sop-step-node.active-step .sop-step-num,
    .sop-step-node:hover .sop-step-num {
      background: #d8a437;
      color: #1e1014;
    }
    .sop-step-icon {
      font-size: 17px;
      margin-bottom: 5px;
      display: block;
    }
    .sop-step-title {
      font-size: 11.5px;
      font-weight: 800;
      color: #ffffff;
      display: block;
      margin-bottom: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sop-step-sub {
      font-size: 9.5px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.25;
      display: block;
    }
    .sop-flow-arrow {
      position: absolute;
      right: -8px;
      top: 50%;
      transform: translateY(-50%);
      color: rgba(216, 164, 55, 0.6);
      font-size: 10px;
      z-index: 2;
      pointer-events: none;
    }
    .sop-detail-panel {
      background: rgba(0, 0, 0, 0.35);
      border: 1px solid rgba(216, 164, 55, 0.3);
      border-radius: 12px;
      padding: 16px 20px;
      margin-top: 16px;
      display: block;
      animation: fadeInSop 0.25s ease;
    }
    @keyframes fadeInSop {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .sop-detail-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);
      padding-bottom: 10px;
      margin-bottom: 12px;
    }
    .sop-detail-title {
      font-size: 14px;
      font-weight: 800;
      color: #ffd67a;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .sop-meta-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 9px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .sop-grid-columns {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 16px;
    }
    @media (max-width: 850px) {
      .sop-grid-columns {
        grid-template-columns: 1fr;
      }
    }
    .sop-checklist-item {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      margin-bottom: 8px;
      font-size: 12px;
      color: rgba(255, 255, 255, 0.88);
      line-height: 1.45;
    }
    .sop-checklist-item i {
      color: #10b981;
      font-size: 13px;
      margin-top: 2px;
      flex-shrink: 0;
    }
    .sop-info-box {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 12px 14px;
      font-size: 11.5px;
    }
    .sop-info-label {
      color: #d8a437;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 10px;
      margin-bottom: 4px;
      display: block;
      letter-spacing: 0.4px;
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

      <!-- SOP Alur Kerja 7 Langkah: SPK -> DO -> DEC -> Booking Service -> Approve CRC -> Bengkel -> CAI -->
      <div class="sop-banner-card">
        <div class="sop-header-row">
          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <span class="sop-badge-pill">
              <i class="fa-solid fa-award"></i> STANDAR OPERASIONAL PROSEDUR (SOP)
            </span>
            <h3 style="margin:0; font-size:15px; font-weight:800; color:#fff; display:flex; align-items:center; gap:8px;">
              Alur Terintegrasi Penjualan ke After-Sales Tunas Toyota Kiara Condong
            </h3>
          </div>
          <div style="display:flex; align-items:center; gap:10px; margin-left:auto;">
            <span style="font-size:11px; color:rgba(255,255,255,0.7); display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-hand-pointer" style="color:#d8a437;"></i> Klik tiap tahapan untuk melihat checklist detail
            </span>
            <button type="button" class="sop-toggle-btn" id="btnToggleSop" onclick="toggleSopDetail()">
              <i class="fa-solid fa-chevron-up" id="sopToggleIcon"></i> <span id="sopToggleText">Tutup Detail</span>
            </button>
          </div>
        </div>

        <!-- 7 Step Stepper Grid -->
        <div class="sop-steps-grid">
          <!-- Step 1: SPK -->
          <div class="sop-step-node active-step" id="sopNode1" onclick="selectSopStep(1)">
            <span class="sop-step-num">1</span>
            <i class="fa-solid fa-file-signature sop-step-icon" style="color:#38bdf8;"></i>
            <span class="sop-step-title">1. SPK</span>
            <span class="sop-step-sub">Pemesanan &amp; DP</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 2: DO -->
          <div class="sop-step-node" id="sopNode2" onclick="selectSopStep(2)">
            <span class="sop-step-num">2</span>
            <i class="fa-solid fa-truck-ramp-box sop-step-icon" style="color:#fbbf24;"></i>
            <span class="sop-step-title">2. DO</span>
            <span class="sop-step-sub">Delivery Order</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 3: DEC -->
          <div class="sop-step-node" id="sopNode3" onclick="selectSopStep(3)">
            <span class="sop-step-num">3</span>
            <i class="fa-solid fa-mobile-screen-button sop-step-icon" style="color:#34d399;"></i>
            <span class="sop-step-title">3. DEC</span>
            <span class="sop-step-sub">Edukasi m-Toyota</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 4: Booking Service -->
          <div class="sop-step-node" id="sopNode4" onclick="selectSopStep(4)">
            <span class="sop-step-num">4</span>
            <i class="fa-solid fa-calendar-check sop-step-icon" style="color:#60a5fa;"></i>
            <span class="sop-step-title">4. Booking Servis</span>
            <span class="sop-step-sub">Reservasi App</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 5: Approve CRC -->
          <div class="sop-step-node" id="sopNode5" onclick="selectSopStep(5)">
            <span class="sop-step-num">5</span>
            <i class="fa-solid fa-clipboard-check sop-step-icon" style="color:#c084fc;"></i>
            <span class="sop-step-title">5. Approve CRC</span>
            <span class="sop-step-sub">Validasi Bengkel</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 6: Bengkel -->
          <div class="sop-step-node" id="sopNode6" onclick="selectSopStep(6)">
            <span class="sop-step-num">6</span>
            <i class="fa-solid fa-wrench sop-step-icon" style="color:#f472b6;"></i>
            <span class="sop-step-title">6. Bengkel</span>
            <span class="sop-step-sub">Pengerjaan GR/FS</span>
            <i class="fa-solid fa-chevron-right sop-flow-arrow"></i>
          </div>

          <!-- Step 7: CAI -->
          <div class="sop-step-node" id="sopNode7" onclick="selectSopStep(7)">
            <span class="sop-step-num">7</span>
            <i class="fa-solid fa-star sop-step-icon" style="color:#fb7185;"></i>
            <span class="sop-step-title">7. CAI</span>
            <span class="sop-step-sub">Survei Kepuasan</span>
          </div>
        </div>

        <!-- Detail Information Panel for Selected Step -->
        <div class="sop-detail-panel" id="sopDetailContainer">
          <div class="sop-detail-header">
            <div class="sop-detail-title" id="sopDetailTitle">
              <i class="fa-solid fa-file-signature" style="color:#d8a437;"></i>
              <span>TAHAP 1: SPK (SURAT PESANAN KENDARAAN)</span>
            </div>
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <span class="sop-meta-badge" id="sopPicBadge"><i class="fa-solid fa-user-tie"></i> PIC: Sales Consultant &amp; SPV</span>
              <span class="sop-meta-badge" id="sopSlaBadge" style="background:rgba(216,164,55,0.25); color:#ffd67a;"><i class="fa-solid fa-stopwatch"></i> SLA: 1x24 Jam</span>
            </div>
          </div>

          <div class="sop-grid-columns">
            <div>
              <div style="font-size:11.5px; font-weight:800; color:#ffd67a; margin-bottom:10px; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-list-check" style="margin-right:6px;"></i> Checklist &amp; Ketentuan Standar Operasional:
              </div>
              <div id="sopChecklistContainer">
                <!-- Checklist items injected via JS -->
              </div>
            </div>

            <div style="display:flex; flex-direction:column; gap:10px;">
              <div class="sop-info-box">
                <span class="sop-info-label"><i class="fa-solid fa-bullseye"></i> Sasaran Utama (Output)</span>
                <div style="color:rgba(255,255,255,0.9); line-height:1.4;" id="sopOutputText">
                  Unit dialokasikan resmi di sistem T-Stock, berkas leasing/cash terverifikasi kasir, konsumen menerima nomor resmi SPK.
                </div>
              </div>
              <div class="sop-info-box">
                <span class="sop-info-label"><i class="fa-solid fa-triangle-exclamation"></i> Titik Kritis Pengawasan Kacab</span>
                <div style="color:#fca5a5; line-height:1.4;" id="sopCriticalText">
                  Cek validitas bukti transfer ke rekening resmi PT Tunas Ridean (bukan rekening pribadi) dan kelengkapan KTP/KK pemohon.
                </div>
              </div>
            </div>
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

  <!-- Script Pengatur Interaksi SOP 7 Langkah -->
  <script>
    const sopData = {
      1: {
        title: "TAHAP 1: SPK (SURAT PESANAN KENDARAAN)",
        icon: "fa-solid fa-file-signature",
        pic: "Sales Consultant & SPV",
        sla: "1x24 Jam Pemesanan",
        checklists: [
          "Validasi identitas calon konsumen (KTP, KK, NPWP) sesuai data faktur yang dituju.",
          "Verifikasi bukti booking fee / tanda jadi wajib masuk rekening resmi PT Tunas Ridean (anti-rekening pribadi).",
          "Approval diskon & skema pembiayaan (Leasing / Tunai) melalui otorisasi SPV dan Kepala Cabang.",
          "Pencatatan alokasi nomor rangka (VIN) dan warna unit kendaraan pada sistem T-Stock dan CRM."
        ],
        output: "Unit dialokasikan resmi di sistem T-Stock, berkas leasing/cash terverifikasi kasir, konsumen menerima nomor resmi SPK.",
        critical: "Cek validitas bukti transfer ke rekening resmi PT Tunas Ridean (bukan rekening pribadi) dan kelengkapan KTP/KK pemohon."
      },
      2: {
        title: "TAHAP 2: DO (DELIVERY ORDER / SERAH TERIMA)",
        icon: "fa-solid fa-truck-ramp-box",
        pic: "Sales Consultant, PDI & Tim Logistik",
        sla: "Hari-H Serah Terima Unit",
        checklists: [
          "Pelunasan Total Down Payment (TDP) atau sisa pembayaran tunai telah dikonfirmasi Kasir / Finance.",
          "Pemeriksaan Pre-Delivery Inspection (PDI) 100% lulus (kebersihan, fungsi kelistrikan, oli/cairan & ban serep).",
          "Penerbitan Surat Jalan resmi (NVDO) dan berita acara serah terima kendaraan oleh admin logistik.",
          "Pengecekan fisik bersama konsumen: kelengkapan toolkit, dongkrak, APAR, buku manual, & surat izin jalan sementara/STNK.",
          "Sesi Handover Ceremony di Delivery Bay dan pengambilan foto dokumentasi bersama konsumen & kendaraan."
        ],
        output: "Kendaraan diserahkan dalam kondisi sempurna dan berita acara serah terima ditandatangani konsumen.",
        critical: "Kondisi fisik unit harus 100% mulus (zero-defect) dan penjelasan buku servis/garansi wajib dilakukan."
      },
      3: {
        title: "TAHAP 3: DEC (DIGITAL EXPLANATION CERTIFICATE)",
        icon: "fa-solid fa-mobile-screen-button",
        pic: "Sales Consultant (Didampingi SPV)",
        sla: "Maks. 30 Menit Saat Handover DO",
        checklists: [
          "Membimbing konsumen mendownload aplikasi m-Toyota resmi di smartphone (Google Play / App Store).",
          "Registrasi akun m-Toyota hingga terbit One Account ID & nomor rangka (VIN) mobil konsumen terhubung.",
          "Edukasi fitur utama m-Toyota: tracking servis, histori perawatan, T-Care gratis oli/jasa s/d servis ke-7, dan call center 24 jam.",
          "Pengisian tanda tangan digital DEC oleh konsumen melalui aplikasi / tablet sales.",
          "Upload foto serah terima & bukti DEC ke sistem Sales Force Tracking (SFT)."
        ],
        output: "Akun m-Toyota aktif berstatus One Account ID valid dan sertifikat DEC tersimpan di sistem Toyota.",
        critical: "Target realisasi aktivasi DEC cabang adalah 100% untuk menjaga kepatuhan KPI TAM dan sertifikasi wiraniaga."
      },
      4: {
        title: "TAHAP 4: BOOKING SERVICE (m-TOYOTA)",
        icon: "fa-solid fa-calendar-check",
        pic: "Konsumen (Didampingi Sales) & Admin CRM",
        sla: "H+14 Hari s/d Maks. 1 Bulan Pasca DO",
        checklists: [
          "Sales melakukan follow-up H+7 untuk memastikan unit berjalan baik dan mendampingi reservasi servis pertama.",
          "Konsumen memilih menu 'Book a Service' pada aplikasi m-Toyota ke bengkel resmi Tunas Toyota Kiara Condong.",
          "Pemilihan jenis pekerjaan Servis Berkala 1.000 KM (Free Service 1 - Inspeksi 60 item gratis).",
          "Menentukan tanggal kedatangan, jam kedatangan (estimasi stall), dan memilih opsi Service Advisor (SA) favorit.",
          "Konfirmasi keluhan atau permintaan khusus konsumen tercatat di aplikasi sebelum disubmit."
        ],
        output: "Nomor Booking ID m-Toyota terbit dan otomatis tersinkronisasi ke sistem CRC / DMS bengkel.",
        critical: "Pastikan wiraniaga memandu booking sebelum 1 bulan/1.000 KM agar garansi mesin & servis gratis T-Care tidak gugur."
      },
      5: {
        title: "TAHAP 5: APPROVE CRC (CUSTOMER RELATIONS COORDINATOR)",
        icon: "fa-solid fa-clipboard-check",
        pic: "CRC Officer & Frontliner Service Bengkel",
        sla: "Maks. 2 Jam Setelah Booking Masuk",
        checklists: [
          "CRC mengecek notifikasi booking baru di Dashboard Bengkel / SFT Cabang secara real-time.",
          "Verifikasi ketersediaan Service Stall (Express Maintenance atau General Repair) dan Service Advisor (SA).",
          "Pengecekan kesiapan suku cadang TMO (oli, filter, part fast moving) sesuai tipe kendaraan.",
          "Mengklik tombol 'Approve / Konfirmasi Booking' dan mengirim pesan WhatsApp konfirmasi otomatis kepada konsumen.",
          "Reminder H-1 via WA/Telepon kepada konsumen untuk memastikan jam kedatangan kendaraan."
        ],
        output: "Slot stall bengkel terkunci, estimasi durasi servis ditentukan, dan konsumen menerima konfirmasi resmi.",
        critical: "Waktu respon approval CRC maksimal 2 jam dan tingkat kehadiran (Show-Up Rate) konsumen wajib > 90%."
      },
      6: {
        title: "TAHAP 6: BENGKEL (SERVICE EXECUTION & WORKSHOP)",
        icon: "fa-solid fa-wrench",
        pic: "Service Advisor (SA), Foreman & Teknisi GR",
        sla: "Express Maintenance: 60 Menit | Reguler: Sesuai PKB",
        checklists: [
          "Penerimaan konsumen melalui antrean prioritas Booking m-Toyota (tanpa antre jalur reguler).",
          "Walk-around check bersama konsumen untuk memeriksa kondisi fisik dan kilometernya.",
          "Penerbitan PKB (Perintah Kerja Bengkel) dan pemasangan cover pelindung (seat, steering wheel, floor mat).",
          "Pelaksanaan servis berkala (inspeksi 60 titik untuk 1.000 KM atau penggantian oli & suku cadang paket T-Care).",
          "Final Inspection / Quality Control oleh Foreman bengkel untuk memastikan zero defect.",
          "Cuci mobil gratis dan pembersihan ruang kemudi sebelum kendaraan diserahkan kembali.",
          "Penjelasan hasil pekerjaan & pengisian buku servis/update riwayat servis di m-Toyota oleh SA."
        ],
        output: "Pengerjaan servis selesai tepat waktu, riwayat m-Toyota ter-update 'Completed', unit bersih dan siap pakai.",
        critical: "Ketepatan waktu pengerjaan (On-Time Delivery > 95%) dan kualitas pengerjaan bengkel (No Repeat Repair)."
      },
      7: {
        title: "TAHAP 7: CAI (CUSTOMER ACTION INDEX / CSI & NPS SURVEY)",
        icon: "fa-solid fa-star",
        pic: "Tim CRC, Branch Manager & TAM Auditor",
        sla: "H+1 s/d H+3 Setelah Kendaraan Keluar Bengkel",
        checklists: [
          "CRC menghubungi konsumen via telepon/WA survei resmi untuk evaluasi kepuasan servis (CAI/CSI).",
          "Penilaian 5 parameter utama: Keramahan SA, Kecepatan Layanan, Kualitas Perbaikan, Fasilitas Ruang Tunggu, & Biaya/Transparansi.",
          "Pemberian rating bintang 5 dan ulasan langsung di aplikasi m-Toyota oleh konsumen.",
          "Tindakan segera First Contact Resolution (FCR) jika terdapat komplain atau keluhan konsumen dalam tempo < 24 jam.",
          "Kacab merekapitulasi indeks kepuasan pelanggan cabang untuk evaluasi bulanan bersama tim Sales & Service."
        ],
        output: "Skor indeks kepuasan CAI/CSI cabang mencapai target minimal 95% dan zero unresolved complaints.",
        critical: "Penanganan segera jika ada suara konsumen tidak puas (detractor) untuk mencegah eskalasi ke TAM."
      }
    };

    let activeSopStep = 1;
    let isSopDetailOpen = true;

    function selectSopStep(stepNum) {
      activeSopStep = stepNum;
      for (let i = 1; i <= 7; i++) {
        const el = document.getElementById('sopNode' + i);
        if (el) {
          if (i === stepNum) {
            el.classList.add('active-step');
          } else {
            el.classList.remove('active-step');
          }
        }
      }

      const data = sopData[stepNum];
      if (!data) return;

      const titleEl = document.getElementById('sopDetailTitle');
      if (titleEl) {
        titleEl.innerHTML = `<i class="${data.icon}" style="color:#d8a437;"></i> <span>${data.title}</span>`;
      }

      const picEl = document.getElementById('sopPicBadge');
      if (picEl) {
        picEl.innerHTML = `<i class="fa-solid fa-user-tie"></i> PIC: ${data.pic}`;
      }

      const slaEl = document.getElementById('sopSlaBadge');
      if (slaEl) {
        slaEl.innerHTML = `<i class="fa-solid fa-stopwatch"></i> SLA: ${data.sla}`;
      }

      const checkEl = document.getElementById('sopChecklistContainer');
      if (checkEl) {
        checkEl.innerHTML = data.checklists.map(item => `
          <div class="sop-checklist-item">
            <i class="fa-solid fa-circle-check"></i>
            <span>${item}</span>
          </div>
        `).join('');
      }

      const outEl = document.getElementById('sopOutputText');
      if (outEl) outEl.textContent = data.output;

      const critEl = document.getElementById('sopCriticalText');
      if (critEl) critEl.textContent = data.critical;

      // Pastikan panel terbuka saat user klik tahapan
      if (!isSopDetailOpen) {
        toggleSopDetail();
      }
    }

    function toggleSopDetail() {
      const panel = document.getElementById('sopDetailContainer');
      const icon = document.getElementById('sopToggleIcon');
      const text = document.getElementById('sopToggleText');
      if (!panel) return;

      if (isSopDetailOpen) {
        panel.style.display = 'none';
        isSopDetailOpen = false;
        if (icon) icon.className = 'fa-solid fa-chevron-down';
        if (text) text.textContent = 'Buka Detail';
      } else {
        panel.style.display = 'block';
        isSopDetailOpen = true;
        if (icon) icon.className = 'fa-solid fa-chevron-up';
        if (text) text.textContent = 'Tutup Detail';
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      selectSopStep(1);
    });
  </script>
</body>

</html>
