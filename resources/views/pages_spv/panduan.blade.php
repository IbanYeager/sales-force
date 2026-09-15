<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Panduan & SOP Supervisi Tim Penjualan</title>
  <meta name="description" content="SOP Resmi Supervisor Penjualan, Coaching Wiraniaga, Approval Diskon, dan Alur Kerja Sistem Tunas Toyota Kiara Condong." />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1c2740">

  <style>
    /* ── SPV SOP STYLES ── */
    .spv-sop-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0369a1 100%);
      border: 1px solid rgba(56, 189, 248, 0.35);
      border-radius: 18px;
      padding: 26px 28px;
      color: #ffffff;
      margin-bottom: 22px;
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
      position: relative;
      overflow: hidden;
    }
    .spv-sop-hero::after {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 220px;
      height: 220px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
      pointer-events: none;
    }
    .spv-sop-title {
      font-family: 'Outfit', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .spv-sop-sub {
      font-size: 13.5px;
      color: #e2e8f0;
      max-width: 820px;
      line-height: 1.6;
    }

    /* SEGMENTED TAB NAV */
    .spv-tab-bar {
      display: flex;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(56, 189, 248, 0.25);
      border-radius: 14px;
      padding: 5px;
      margin-bottom: 24px;
      gap: 6px;
      flex-wrap: wrap;
    }
    .spv-tab-btn {
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
    .spv-tab-btn:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .spv-tab-btn.active {
      background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
      color: #ffffff;
      font-weight: 800;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.35);
    }

    /* GRID SOP CARDS */
    .sop-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 18px;
      margin-bottom: 24px;
    }
    .sop-card {
      background: linear-gradient(180deg, #111c30 0%, #0b1120 100%);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 16px;
      padding: 20px 22px;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      transition: all 0.25s ease;
      display: flex;
      flex-direction: column;
    }
    .sop-card:hover {
      border-color: rgba(56, 189, 248, 0.5);
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
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.35);
      color: #38bdf8;
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
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
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
      color: #38bdf8;
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
      color: #38bdf8;
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
      background: #111c30;
      border: 1px solid rgba(56, 189, 248, 0.25);
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
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
    }
    .step-number {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
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
  </style>
</head>

<body>
  <div class="spv-shell">
    <!-- SIDEBAR SPV -->
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
        <a href="panduan.html" id="navPanduan" class="active"><i class="fa-solid fa-book-bookmark"></i>Panduan &amp; SOP Sistem <span class="sidebar-sop-badge"><span class="sop-dot"></span>SOP</span></a>
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#0284c7; color:#fff; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="../pages/polreg.html" id="navPolreg"><i class="fa-solid fa-chart-pie"></i>Peta Polreg Wilayah</a>
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
          <h2 id="pageTitle">Panduan &amp; SOP Supervisi Tim Penjualan</h2>
          <p class="page-sub">Pedoman Praktis Coaching Wiraniaga, Briefing Harian, Approval Diskon, &amp; Manajemen Pencapaian Target</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="https://ui-avatars.com/api/?name=SPV&background=1c2740&color=ffffff&bold=true" alt="Avatar">
            <span class="dot" style="background:#38bdf8;"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Supervisor</span>
            <span class="role" id="spvRole" style="color:#38bdf8;">Supervisor Penjualan</span>
          </div>
        </div>
      </div>

      <!-- HERO BANNER -->
      <div class="spv-sop-hero">
        <div class="spv-sop-title">
          <i class="fa-solid fa-chalkboard-user"></i>
          <span>Pedoman Supervisi Tim &bull; Tunas Toyota Kiara Condong</span>
        </div>
        <p class="spv-sop-sub">
          Panduan operasional harian untuk Supervisor dalam memimpin briefing pagi wiraniaga, mendampingi proses negosiasi, memverifikasi kelengkapan berkas pembiayaan kredit, serta memastikan produktivitas tim mencapai target SPK &amp; DO bulanan.
        </p>
      </div>

      <!-- TABS SELECTOR -->
      <div class="spv-tab-bar">
        <button type="button" class="spv-tab-btn active" id="tabBtn1" onclick="switchSpvTab('supervisi')">
          <i class="fa-solid fa-user-shield"></i> 1. SOP Supervisi &amp; Coaching SPV
        </button>
        <button type="button" class="spv-tab-btn" id="tabBtn2" onclick="switchSpvTab('workflow')">
          <i class="fa-solid fa-route"></i> 2. SOP Alur Penjualan Sales (5 Langkah)
        </button>
        <button type="button" class="spv-tab-btn" id="tabBtn3" onclick="switchSpvTab('briefing')">
          <i class="fa-solid fa-bullseye"></i> 3. Panduan Target &amp; Briefing Harian
        </button>
      </div>

      <!-- VIEW 1: SOP SUPERVISI SPV -->
      <div id="viewSupervisi" style="display: block;">
        <div class="sop-grid">
          
          <!-- Card 1 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
              <div>
                <h3 class="sop-card-title">Morning Briefing Harian</h3>
                <span class="sop-card-badge">Setiap Pagi 08:30 WIB</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Menggunakan fitur Briefing Auto-Gen untuk menyiapkan poin motivasi &amp; unit fokus.</li>
              <li><i class="fa-solid fa-circle-check"></i> Memeriksa agenda jadwal kanvasing &amp; janji temu konsumen hari ini.</li>
              <li><i class="fa-solid fa-circle-check"></i> Evaluasi perolehan SPK harian dan update stok mobil ready dealer.</li>
            </ul>
            <div class="sop-card-action">
              <a href="briefing_generator.html" class="sop-link">Buka Briefing Generator <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-check-to-slot"></i></div>
              <div>
                <h3 class="sop-card-title">Verifikasi &amp; Approval Diskon</h3>
                <span class="sop-card-badge">Persetujuan SPV Tier 2</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memeriksa keabsahan data prospek di CRM sebelum menyetujui pengajuan diskon.</li>
              <li><i class="fa-solid fa-circle-check"></i> Menyetujui diskon tambahan s/d batas wewenang SPV (+Rp 5 Juta).</li>
              <li><i class="fa-solid fa-circle-check"></i> Mengeskalasi permintaan diskon khusus margin tipis ke Kepala Cabang.</li>
            </ul>
            <div class="sop-card-action">
              <a href="approval.html" class="sop-link">Buka Panel Approval <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-chalkboard-user"></i></div>
              <div>
                <h3 class="sop-card-title">Coaching Radar &amp; Pendampingan</h3>
                <span class="sop-card-badge">One-on-One Mentoring</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Identifikasi wiraniaga yang belum mencetak SPK pada minggu berjalan.</li>
              <li><i class="fa-solid fa-circle-check"></i> Berikan pembinaan teknik objection handling menggunakan Battle Card.</li>
              <li><i class="fa-solid fa-circle-check"></i> Dampingi pertemuan tatap muka konsumen (joint visit) untuk deal besar.</li>
            </ul>
            <div class="sop-card-action">
              <a href="spv_coaching.html" class="sop-link">Buka Coaching Radar <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-file-invoice-dollar"></i></div>
              <div>
                <h3 class="sop-card-title">Studio SPH &amp; Penawaran Harga</h3>
                <span class="sop-card-badge">Review Dokumen Konsumen</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memastikan format Surat Penawaran Harga (SPH) akurat sesuai leasing rekanan.</li>
              <li><i class="fa-solid fa-circle-check"></i> Menandatangani kolom 'Mengetahui SPV' pada lembar cetak SPH resmi A4.</li>
              <li><i class="fa-solid fa-circle-check"></i> Memastikan tidak ada janji bonus di luar fasilitas sah perusahaan.</li>
            </ul>
            <div class="sop-card-action">
              <a href="quotation.html" class="sop-link">Buka Studio SPH <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-map-location-dot"></i></div>
              <div>
                <h3 class="sop-card-title">Canvassing &amp; Peta Lapangan</h3>
                <span class="sop-card-badge">Monitoring Wilayah</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memeriksa sebaran aktivitas check-in geotag tim sales di peta canvassing.</li>
              <li><i class="fa-solid fa-circle-check"></i> Memastikan tidak terjadi tumpang tindih area kanvasing antar wiraniaga satu grup.</li>
              <li><i class="fa-solid fa-circle-check"></i> Arahkan sales ke klaster perumahan/kantor di kecamatan potensi polreg tinggi.</li>
            </ul>
            <div class="sop-card-action">
              <a href="peta_canvassing.html" class="sop-link">Buka Heatmap Canvassing <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <!-- Card 6 -->
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-bullhorn"></i></div>
              <div>
                <h3 class="sop-card-title">Audit Database Leads (CRM)</h3>
                <span class="sop-card-badge">Lead Nurturing</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> Memeriksa update riwayat follow-up telepon, WA, dan janji test drive konsumen.</li>
              <li><i class="fa-solid fa-circle-check"></i> Re-alokasikan prospek yang dingin / tidak difollow-up sales ke sales lain yang aktif.</li>
              <li><i class="fa-solid fa-circle-check"></i> Jaga integritas data kontak customer agar tidak bocor ke pihak luar.</li>
            </ul>
            <div class="sop-card-action">
              <a href="followup_database.html" class="sop-link">Buka Database CRM <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

        </div>
      </div>

      <!-- VIEW 2: ALUR KERJA PENJUALAN SALES (5 LANGKAH) -->
      <div id="viewWorkflow" style="display: none;">
        <div class="train-container">
          <div class="train-header">
            <div class="train-title">
              <i class="fa-solid fa-route" style="color:#38bdf8;"></i>
              <span>Panduan Alur Kerja Wiraniaga (Bahan Supervisi &amp; Training SPV)</span>
            </div>
            <span style="font-size:12px; color:#cbd5e1; background:rgba(56,189,248,0.15); padding:4px 10px; border-radius:6px; border:1px solid rgba(56,189,248,0.3);">
              5 Langkah Mudah Bebas Ribet
            </span>
          </div>

          <div class="train-steps-row">
            <div class="train-step-card active">
              <div class="step-number">1</div>
              <div class="step-name">Catat Calon Pembeli</div>
              <div class="step-desc">Input nama &amp; kontak di Customer CRM. Cukup sekali catat, data tersimpan aman.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">2</div>
              <div class="step-name">Hitung Cicilan / Trade-In</div>
              <div class="step-desc">Gunakan Kalkulator Finansial &amp; SPH Studio untuk simulasi DP &amp; angsuran.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">3</div>
              <div class="step-name">Isi Form SPK di HP</div>
              <div class="step-desc">Tekan tombol 'Buat SPK', seluruh data customer &amp; cicilan otomatis masuk ke form.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">4</div>
              <div class="step-name">Disetujui SPV &amp; Kacab</div>
              <div class="step-desc">SPV memvalidasi berkas, otorisasi diskon, dan cek setoran booking fee ke rekening BCA resmi.</div>
            </div>
            <div class="train-step-card active">
              <div class="step-number">5</div>
              <div class="step-name">Kirim Mobil (DO)</div>
              <div class="step-desc">Unit dialokasikan dari gudang, terbit surat jalan DO, dan penyerahan unit ke konsumen.</div>
            </div>
          </div>
        </div>

        <!-- INSTRUKSI SUPERVISI DETAIL -->
        <div class="sop-grid">
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">1</div>
              <div>
                <h3 class="sop-card-title">Peran SPV di Langkah 1 &amp; 2</h3>
                <span class="sop-card-badge">Prospek &amp; Simulasi</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Pastikan sales tidak menghitung simulasi angsuran secara manual yang rawan salah.</li>
              <li><i class="fa-solid fa-angle-right"></i> Wajibkan pengiriman penawaran resmi menggunakan format PDF A4 dari SPH Studio.</li>
            </ul>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">2</div>
              <div>
                <h3 class="sop-card-title">Peran SPV di Langkah 3 &amp; 4</h3>
                <span class="sop-card-badge">Validasi SPK &amp; Diskon</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Verifikasi KTP konsumen, alamat domisili, dan nomor HP aktif pemohon kredit.</li>
              <li><i class="fa-solid fa-angle-right"></i> Pastikan booking fee minimal Rp 5 Juta telah masuk ke rekening BCA PT Tunas Ridean Tbk.</li>
            </ul>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box">3</div>
              <div>
                <h3 class="sop-card-title">Peran SPV di Langkah 5</h3>
                <span class="sop-card-badge">Penyelesaian Berkas DO</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-angle-right"></i> Pastikan PO leasing telah terbit asli dan diverifikasi admin penjualan.</li>
              <li><i class="fa-solid fa-angle-right"></i> Dampingi wiraniaga saat serah terima unit (Delivery Handover) bila diperlukan.</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- VIEW 3: PANDUAN TARGET & BRIEFING -->
      <div id="viewBriefing" style="display: none;">
        <div class="sop-grid">
          
          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-bullseye"></i></div>
              <div>
                <h3 class="sop-card-title">Formula Pembagian Target Tim</h3>
                <span class="sop-card-badge">Produktivitas Seimbang</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> <strong>Senior Sales:</strong> Target minimal 4 unit SPK &amp; 3 DO per bulan.</li>
              <li><i class="fa-solid fa-circle-check"></i> <strong>Junior Sales:</strong> Target minimal 2 unit SPK &amp; 2 DO per bulan.</li>
              <li><i class="fa-solid fa-circle-check"></i> <strong>Rasio Prospek:</strong> Minimal 15 prospek baru &rarr; 5 hot prospek &rarr; 2 SPK.</li>
            </ul>
            <div class="sop-card-action">
              <a href="target.html" class="sop-link">Buka Pengaturan Target <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

          <div class="sop-card">
            <div class="sop-card-header">
              <div class="sop-icon-box"><i class="fa-solid fa-comments"></i></div>
              <div>
                <h3 class="sop-card-title">Struktur Briefing Pagi 15 Menit</h3>
                <span class="sop-card-badge">Efektif &amp; Berenergi</span>
              </div>
            </div>
            <ul class="sop-list">
              <li><i class="fa-solid fa-circle-check"></i> <strong>Menit 0-3:</strong> Yel-yel semangat &amp; pembacaan doa pagi bersama tim.</li>
              <li><i class="fa-solid fa-circle-check"></i> <strong>Menit 4-8:</strong> Pengumuman unit ready stok yang harus dilepas cepat.</li>
              <li><i class="fa-solid fa-circle-check"></i> <strong>Menit 9-13:</strong> Roleplay singkat penanganan keberatan konsumen (objection handling).</li>
              <li><i class="fa-solid fa-circle-check"></i> <strong>Menit 14-15:</strong> Komitmen target penutupan SPK hari ini.</li>
            </ul>
            <div class="sop-card-action">
              <a href="briefing_generator.html" class="sop-link">Generate Materi Briefing <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>

        </div>
      </div>

    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script>
    function switchSpvTab(tabName) {
      document.getElementById('viewSupervisi').style.display = tabName === 'supervisi' ? 'block' : 'none';
      document.getElementById('viewWorkflow').style.display = tabName === 'workflow' ? 'block' : 'none';
      document.getElementById('viewBriefing').style.display = tabName === 'briefing' ? 'block' : 'none';

      document.getElementById('tabBtn1').classList.toggle('active', tabName === 'supervisi');
      document.getElementById('tabBtn2').classList.toggle('active', tabName === 'workflow');
      document.getElementById('tabBtn3').classList.toggle('active', tabName === 'briefing');
    }

    document.addEventListener('DOMContentLoaded', function() {
      const spvNama = localStorage.getItem('namaSales') || localStorage.getItem('spv_nama') || 'Supervisor';
      const elSpvNama = document.getElementById('spvNama');
      if (elSpvNama && spvNama !== 'Sales') elSpvNama.textContent = spvNama;

      const avatar = document.getElementById('spvAvatar');
      if (avatar && spvNama) {
        avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(spvNama) + '&background=1c2740&color=ffffff&bold=true';
      }
    });

    function logoutUser() {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch(e) {}
      window.location.replace('../pages/login_spv.html');
    }
  </script>
</body>

</html>
