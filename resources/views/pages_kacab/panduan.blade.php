<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Panduan & SOP Eksekutif Kepala Cabang</title>
  <meta name="description" content="SOP Resmi Kepala Cabang, Otorisasi Diskon, Supervisi Penjualan, dan Alur Kerja Sistem Tunas Toyota Kiara Condong." />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">

  <style>
    /* ── KACAB SOP STYLES ── */
    .kcb-sop-hero {
      background: linear-gradient(135deg, #1e1014 0%, #2d161d 50%, #431f28 100%);
      border: 1px solid rgba(216, 164, 55, 0.35);
      border-radius: 18px;
      padding: 26px 28px;
      color: #ffffff;
      margin-bottom: 22px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
      position: relative;
      overflow: hidden;
    }
    .kcb-sop-hero::after {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(216, 164, 55, 0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .kcb-sop-title {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #fde047;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .kcb-sop-sub {
      font-size: 13.5px;
      color: #e2e8f0;
      max-width: 820px;
      line-height: 1.6;
    }

    /* SEGMENTED TAB NAV */
    .kcb-tab-bar {
      display: flex;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(216, 164, 55, 0.25);
      border-radius: 14px;
      padding: 5px;
      margin-bottom: 24px;
      gap: 6px;
      flex-wrap: wrap;
    }
    .kcb-tab-btn {
      flex: 1;
      min-width: 180px;
      padding: 11px 18px;
      border-radius: 10px;
      border: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      color: #cbd5e1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .kcb-tab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .kcb-tab-btn.active {
      background: linear-gradient(135deg, #d8a437 0%, #b45309 100%);
      color: #1e1014;
      font-weight: 800;
      box-shadow: 0 4px 14px rgba(216, 164, 55, 0.35);
    }

    /* GRID SOP CARDS */
    .sop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .sop-card {
      background: linear-gradient(180deg, #1b1115 0%, #120a0c 100%);
      border: 1px solid rgba(216, 164, 55, 0.2);
      border-radius: 16px;
      padding: 20px 22px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .sop-card:hover {
      border-color: rgba(216, 164, 55, 0.5);
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
    }
    .sop-card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sop-icon-box {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(216, 164, 55, 0.15);
      border: 1px solid rgba(216, 164, 55, 0.35);
      color: #fde047;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .sop-card-title {
      font-size: 15px;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      line-height: 1.3;
    }
    .sop-card-badge {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 5px;
      background: rgba(216, 164, 55, 0.2);
      color: #fde047;
      display: inline-block;
      margin-top: 3px;
    }
    .sop-list {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 13px;
      color: #cbd5e1;
      display: flex;
      flex-direction: column;
      gap: 9px;
      flex: 1;
    }
    .sop-list li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      line-height: 1.5;
    }
    .sop-list li i {
      color: #d8a437;
      margin-top: 3px;
      font-size: 11px;
      flex-shrink: 0;
    }
    .sop-card-action {
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sop-link {
      color: #fde047;
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s;
    }
    .sop-link:hover {
      text-decoration: underline;
      color: #fff;
    }

    /* STEP TRAIN (WORKFLOW SALES) */
    .train-container {
      background: #190f13;
      border: 1px solid rgba(216, 164, 55, 0.25);
      border-radius: 16px;
      padding: 22px;
      margin-bottom: 24px;
    }
    .train-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 18px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .train-title {
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .train-steps-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
      gap: 12px;
    }
    .train-step-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 14px 12px;
      text-align: center;
      position: relative;
    }
    .train-step-card.active {
      border-color: #d8a437;
      background: rgba(216, 164, 55, 0.1);
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #d8a437;
      color: #1e1014;
      font-weight: 900;
      font-size: 12.5px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 8px;
    }
    .step-name {
      font-size: 12.5px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 4px;
    }
    .step-desc {
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* MATRIKS DISKON TABLE */
    .kcb-table-card {
      background: #190f13;
      border: 1px solid rgba(216, 164, 55, 0.25);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .kcb-table-card header {
      padding: 16px 20px;
      background: rgba(216, 164, 55, 0.08);
      border-bottom: 1px solid rgba(216, 164, 55, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .kcb-table-card header h4 {
      margin: 0;
      font-size: 15px;
      font-weight: 800;
      color: #fde047;
    }
    .kcb-matrix-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12.5px;
      color: #e2e8f0;
    }
    .kcb-matrix-table th {
      background: rgba(0, 0, 0, 0.3);
      padding: 12px 16px;
      font-weight: 800;
      text-align: left;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      color: #fde047;
    }
    .kcb-matrix-table td {
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      vertical-align: middle;
    }
    .kcb-matrix-table tr:hover td {
      background: rgba(255, 255, 255, 0.03);
    }
    .tier-badge {
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 800;
      display: inline-block;
    }
    .tier-sales { background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
    .tier-spv { background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }
    .tier-kacab { background: rgba(216, 164, 55, 0.2); color: #fde047; border: 1px solid rgba(216, 164, 55, 0.4); }
  </style>
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
        <a href="panduan.html" id="navPanduan" class="active"><i class="fa-solid fa-book-bookmark"></i>Panduan &amp; SOP Sistem <span class="sidebar-sop-badge"><span class="sop-dot"></span>SOP</span></a>
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:900;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi &amp; Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas &amp; Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="../pages/polreg.html" id="navPolreg"><i class="fa-solid fa-chart-pie"></i>Peta Polreg Wilayah</a>
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
          <h2 id="pageTitle">Panduan &amp; SOP Eksekutif Kepala Cabang</h2>
          <p class="page-sub">Standard Operating Procedure (SOP), Alur Otorisasi Diskon, Supervisi Penjualan, &amp; Panduan Tata Kelola Cabang</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="https://ui-avatars.com/api/?name=KC&background=1e1014&color=d8a437&bold=true" alt="Avatar">
            <span class="dot" style="background:#d8a437;"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Kepala Cabang</span>
            <span class="role" id="kcbRole" style="color:#d8a437;">Branch Manager · Kiara Condong</span>
          </div>
        </div>
      </div>

      <!-- HERO BANNER -->
      <div class="kcb-sop-hero">
        <div class="kcb-sop-title">
          <i class="fa-solid fa-shield-halved"></i>
          <span>Pedoman Eksekutif &bull; Tata Kelola Cabang Kiara Condong</span>
        </div>
        <p class="kcb-sop-sub">
          Dokumen panduan terintegrasi untuk Kepala Cabang dalam mengawasi efektivitas operasional, menetapkan batas wewenang otorisasi diskon, mengontrol 50 wiraniaga, serta memastikan seluruh tahapan penjualan dari prospek hingga pengiriman mobil berjalan patuh dan akuntabel.
        </p>
      </div>

      <!-- TABS SELECTOR -->
      <div class="kcb-tab-bar">
        <button type="button" class="kcb-tab-btn active" id="tabBtn1" onclick="switchSopTab('executive')">
          <i class="fa-solid fa-building-user"></i> 1. SOP Eksekutif &amp; Otorisasi
        </button>
        <button type="button" class="kcb-tab-btn" id="tabBtn2" onclick="switchSopTab('workflow')">
          <i class="fa-solid fa-route"></i> 2. SOP Alur Penjualan Sales (5 Langkah)
        </button>
        <button type="button" class="kcb-tab-btn" id="tabBtn3" onclick="switchSopTab('matrix')">
          <i class="fa-solid fa-table-list"></i> 3. Matriks Wewenang &amp; Otorisasi Diskon
        </button>
      </div>

      <!-- VIEW 1: SOP EKSEKUTIF KACAB -->
      <div id="viewExecutive" style="display: block;">
        <div class="sop-grid">
          
          <!-- Card 1 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-clipboard-check"></i></div>
              <div>
                <h3 class="sop-card-title">Otorisasi &amp; Approval Diskon</h3>
                <span class="sop-card-badge">Governance &amp; Margin</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Meninjau pengajuan diskon di atas batas wewenang SPV (Tier 3).</li>
              <li><i class="fa-solid fa-circle-check"></i> Memverifikasi kelayakan margin gross profit per unit sebelum SPK diterbitkan.</li>
              <li><i class="fa-solid fa-circle-check"></i> Otorisasi persetujuan dapat dilakukan secara digital 1-klik di menu Approval.</li>
            </ul>
            <div class="sop-card-action">
              <a href="approval_kacab.html" class="sop-link">Buka Menu Approval <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-bullhorn"></i></div>
              <div>
                <h3 class="sop-card-title">Database Follow-Up (CRM)</h3>
                <span class="sop-card-badge">7-Stage Funnel Audit</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memantau kesehatan funnel prospek dari database Google Spreadsheet cabang.</li>
              <li><i class="fa-solid fa-circle-check"></i> Menilai conversion rate dari Prospek Baru &rarr; Negosiasi &rarr; SPK &rarr; DO.</li>
              <li><i class="fa-solid fa-circle-check"></i> Mengarahkan SPV untuk mendistribusikan leads yang macet / belum difollow up &gt; 48 jam.</li>
            </ul>
            <div class="sop-card-action">
              <a href="followup_database.html" class="sop-link">Buka Database CRM <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-warehouse"></i></div>
              <div>
                <h3 class="sop-card-title">Pengawasan Stok &amp; Alokasi Unit</h3>
                <span class="sop-card-badge">1.638 Unit Real-Time</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memastikan unit fast-moving (Zenix, Avanza, Veloz) dialokasikan tepat sasaran.</li>
              <li><i class="fa-solid fa-circle-check"></i> Memantau unit aged &gt; 60 hari untuk diberikan stimulus program promo khusus.</li>
              <li><i class="fa-solid fa-circle-check"></i> Menghindari double booking nomor rangka (matching frame) antar wiraniaga.</li>
            </ul>
            <div class="sop-card-action">
              <a href="inventory.html" class="sop-link">Lihat Live Stok <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-file-invoice-dollar"></i></div>
              <div>
                <h3 class="sop-card-title">Studio SPH &amp; Penawaran Resmi</h3>
                <span class="sop-card-badge">Official Document</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Menerbitkan Surat Penawaran Harga resmi berkop PT Tunas Ridean Tbk untuk instansi/fleet.</li>
              <li><i class="fa-solid fa-circle-check"></i> Menjamin rekening transaksi hanya ke rekening resmi BCA PT Tunas Ridean Tbk.</li>
              <li><i class="fa-solid fa-circle-check"></i> Cetak dokumen A4 PDF siap tandatangan basah atau tanda tangan digital eksekutif.</li>
            </ul>
            <div class="sop-card-action">
              <a href="quotation.html" class="sop-link">Buka Studio SPH <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-chalkboard-user"></i></div>
              <div>
                <h3 class="sop-card-title">Audit AO Report &amp; Leasing</h3>
                <span class="sop-card-badge">Financing Control</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Mengontrol pergerakan berkas kredit di mitra leasing (TAF, ACC, MTF, BCA, BSI).</li>
              <li><i class="fa-solid fa-circle-check"></i> Mempercepat penyelesaian berkas pending PO dari pihak leasing finance.</li>
              <li><i class="fa-solid fa-circle-check"></i> Evaluasi rasio penolakan kredit (reject rate) per leasing rekanan cabang.</li>
            </ul>
            <div class="sop-card-action">
              <a href="ao_report_kacab.html" class="sop-link">Buka AO Report <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 6 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-map-location-dot"></i></div>
              <div>
                <h3 class="sop-card-title">Peta GPS &amp; Aktivitas Sales</h3>
                <span class="sop-card-badge">Field Canvassing Audit</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memantau titik check-in GPS geotag seluruh wiraniaga di lapangan secara real-time.</li>
              <li><i class="fa-solid fa-circle-check"></i> Mengarahkan kanvasing ke kantong wilayah polreg potensial di Kota Bandung.</li>
              <li><i class="fa-solid fa-circle-check"></i> Memastikan disiplin minimal 3 aktivitas canvassing/follow-up per hari per sales.</li>
            </ul>
            <div class="sop-card-action">
              <a href="peta_kunjungan.html" class="sop-link">Lihat Peta GPS <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

        </div>
      </div>

      <!-- VIEW 2: ALUR KERJA PENJUALAN SALES (5 LANGKAH) -->
      <div id="viewWorkflow" style="display: none;">
        <div class="train-container">
          <div class="train-header">
            <div class="train-title">
              <i class="fa-solid fa-route" style="color:#fde047;"></i>
              <span>Alur Standar Pesanan Penjualan Mobil (Rantai 5 Langkah)</span>
            </div>
            <span style="font-size:12px; color:#cbd5e1; background:rgba(216,164,55,0.15); padding:4px 10px; border-radius:6px; border:1px solid rgba(216,164,55,0.3);">
              SOP Terintegrasi Seluruh Wiraniaga Cabang
            </span>
          </div>

          <div class="train-steps-row">
            <div class="train-step-card active">
              <div class="step-number">1</div>
              <div class="step-name">Catat Calon Pembeli</div>
              <div class="step-desc">Input data nama, nomor WA, domisili, dan model mobil di menu Customer CRM.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">2</div>
              <div class="step-name">Hitung Cicilan / Trade-In</div>
              <div class="step-desc">Simulasi DP &amp; angsuran leasing atau appraisal unit tukar tambah.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">3</div>
              <div class="step-name">Isi Form SPK di HP</div>
              <div class="step-desc">Data konsumen otomatis ditarik ke Form SPK digital tanpa perlu mengetik ulang.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">4</div>
              <div class="step-name">Otorisasi &amp; Disetujui</div>
              <div class="step-desc">Validasi tanda jadi &amp; approval diskon oleh SPV serta Kepala Cabang.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">5</div>
              <div class="step-name">Kirim Mobil (DO)</div>
              <div class="step-desc">Penerbitan Surat Jalan DO, alokasi unit dari gudang, dan handover serah terima.</div>
            </div>
          </div>
        </div>

        <!-- DETAIL PENJELASAN TAHAPAN UNTUK KACAB -->
        <div class="sop-grid">
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">1</div>
              <div>
                <h3 class="sop-card-title">Tahap 1: Prospek Awal (CRM)</h3>
                <span class="sop-card-badge">Pengawasan Kacab</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Sales wajib memasukkan data prospek ke CRM dalam waktu maksimal 2 jam setelah pertemuan.</li>
              <li><i class="fa-solid fa-angle-right"></i> Data nomor telepon otomatis terproteksi dan terhindar dari tumpang tindih prospek.</li>
            </ul>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">2</div>
              <div>
                <h3 class="sop-card-title">Tahap 2: Simulasi &amp; SPH</h3>
                <span class="sop-card-badge">Pengawasan Kacab</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> SPH yang dikirim ke konsumen wajib menggunakan dokumen resmi dari SPH Studio.</li>
              <li><i class="fa-solid fa-angle-right"></i> Skema kredit leasing menggunakan rate resmi terkini dari leasing rekanan cabang.</li>
            </ul>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">3</div>
              <div>
                <h3 class="sop-card-title">Tahap 3 &amp; 4: SPK &amp; Approval</h3>
                <span class="sop-card-badge">Titik Kritis Otorisasi</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Pembayaran booking fee wajib langsung diverifikasi kasir cabang ke rekening BCA Tunas Ridean.</li>
              <li><i class="fa-solid fa-angle-right"></i> Permintaan diskon di luar batas SPV masuk ke antrean otorisasi Kacab.</li>
            </ul>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">5</div>
              <div>
                <h3 class="sop-card-title">Tahap 5: Delivery Order &amp; BASTK</h3>
                <span class="sop-card-badge">Closing Sempurna</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Surat Jalan (DO) diterbitkan setelah pelunasan total / PO leasing cair 100%.</li>
              <li><i class="fa-solid fa-angle-right"></i> Foto penyerahan unit diupload ke Digital Delivery Ceremony untuk dokumentasi.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- VIEW 3: MATRIKS WEWENANG DISKON -->
      <div id="viewMatrix" style="display: none;">
        <div class="kcb-table-card">
          <header>
            <h4><i class="fa-solid fa-shield-halved" style="color:#d8a437;"></i> Matriks Jenjang Otorisasi Diskon &amp; Wewenang Cabang</h4>
            <span style="font-size:12px; color:#cbd5e1;"><i class="fa-solid fa-lock"></i> Kebijakan Resmi PT Tunas Ridean Tbk</span>
          </header>
          <div style="overflow-x:auto;">
            <table class="kcb-matrix-table">
              <thead>
                <tr>
                  <th>TINGKATAN JABATAN</th>
                  <th>BATAS WEWENANG DISKON</th>
                  <th>TIPE PERSETUJUAN</th>
                  <th>PERSYARATAN DOKUMEN</th>
                  <th>WAKTU SLA APPROVAL</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><span class="tier-badge tier-sales">Wiraniaga (Sales)</span></td>
                  <td>Diskon Reguler Program Bulanan Pabrik (Rp 0 s/d Batas Standar)</td>
                  <td>Otomatis Tersedia di Sistem SPH</td>
                  <td>Data Customer CRM lengkap</td>
                  <td>Instant Real-Time</td>
                </tr>
                <tr>
                  <td><span class="tier-badge tier-spv">Supervisor (SPV)</span></td>
                  <td>Tambahan s/d +Rp 5.000.000 di atas plafon reguler</td>
                  <td>Approval Digital oleh SPV</td>
                  <td>Foto KTP, Bukti Booking Fee, &amp; Lembar Penawaran</td>
                  <td>Maksimal 30 Menit</td>
                </tr>
                <tr>
                  <td><span class="tier-badge tier-kacab">Kepala Cabang (Kacab)</span></td>
                  <td>Diskon Spesial Khusus &amp; Otorisasi Margin Penuh (Batas Kebijakan Cabang)</td>
                  <td>Otorisasi Penuh Kepala Cabang</td>
                  <td>Review Profil Konsumen, Pola Bayar, &amp; Analisis Margin Gross</td>
                  <td>Maksimal 1 Jam Kerja</td>
                </tr>
                <tr>
                  <td><span class="tier-badge" style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid rgba(239,68,68,0.3);">Regional / GM</span></td>
                  <td>Pengajuan Armada Fleet / Instansi Besar di luar batas cabang</td>
                  <td>Disposisi Direksi / Regional Operation Head</td>
                  <td>Surat Permohonan Resmi PT / Instansi + Surat Dukungan</td>
                  <td>1 x 24 Jam Kerja</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div style="background:#190f13; border:1px solid rgba(216,164,55,0.2); border-radius:14px; padding:16px 20px; font-size:12px; color:#cbd5e1; line-height:1.6;">
          <strong style="color:#fde047;"><i class="fa-solid fa-triangle-exclamation"></i> Catatan Penting untuk Kepala Cabang:</strong><br>
          Setiap pemberian diskon otorisasi Kacab tercatat di sistem audit cabang dan berpengaruh terhadap perhitungan pencapaian gross margin cabang. Pastikan seluruh berkas pendukung telah divalidasi oleh SPV sebelum tombol persetujuan ditekan.
        </div>
      </div>

    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script>
    function switchSopTab(tabName) {
      document.getElementById('viewExecutive').style.display = tabName === 'executive' ? 'block' : 'none';
      document.getElementById('viewWorkflow').style.display = tabName === 'workflow' ? 'block' : 'none';
      document.getElementById('viewMatrix').style.display = tabName === 'matrix' ? 'block' : 'none';

      document.getElementById('tabBtn1').classList.toggle('active', tabName === 'executive');
      document.getElementById('tabBtn2').classList.toggle('active', tabName === 'workflow');
      document.getElementById('tabBtn3').classList.toggle('active', tabName === 'matrix');
    }

    document.addEventListener('DOMContentLoaded', function() {
      const kacabNama = localStorage.getItem('namaSales') || localStorage.getItem('kacab_nama') || 'Kepala Cabang';
      const elKacabNama = document.getElementById('kcbNama');
      if (elKacabNama && kacabNama !== 'Sales') elKacabNama.textContent = kacabNama;

      const avatar = document.getElementById('kcbAvatar');
      if (avatar && kacabNama) {
        avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(kacabNama) + '&background=1e1014&color=d8a437&bold=true';
      }
    });

    function logoutUser() {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch(e) {}
      window.location.replace('../pages/login_kacab.html');
    }
  </script>
</body>

</html>
