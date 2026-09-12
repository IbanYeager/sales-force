<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Panduan & Alur Kerja - Sales App Tunas Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@500;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    :root {
      --primary-red: #c8102e;
      --primary-red-dark: #990e24;
      --primary-blue: #0d2d5e;
      --primary-kacab: #3b141d;
      --text-dark: #0f172a;
      --text-muted: #64748b;
      --bg-slate: #f8fafc;
      --card-border: #e2e8f0;
      --shadow-lg: 0 20px 40px rgba(15, 23, 42, 0.08);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0b1120;
      color: var(--text-dark);
      line-height: 1.6;
      padding: 30px 15px;
    }

    .container {
      max-width: 1100px;
      margin: 0 auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.5);
    }

    /* Header Presentation Banner */
    .hero-banner {
      background: linear-gradient(135deg, #8b0519 0%, #c8102e 50%, #590711 100%);
      color: white;
      padding: 45px 40px;
      position: relative;
      overflow: hidden;
    }
    .hero-banner::before {
      content: '';
      position: absolute;
      top: -60px; right: -60px;
      width: 280px; height: 280px;
      background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
      pointer-events: none;
    }
    .brand-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 15px;
    }
    .brand-logo-pill {
      background: rgba(255,255,255,0.95);
      padding: 10px 22px;
      border-radius: 14px;
      display: inline-flex;
      align-items: center;
    }
    .brand-logo-pill img {
      height: 38px;
      object-fit: contain;
    }
    .btn-action-group {
      display: flex;
      gap: 10px;
    }
    .btn-print {
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.4);
      color: white;
      padding: 10px 18px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
      backdrop-filter: blur(8px);
    }
    .btn-print:hover {
      background: rgba(255,255,255,0.35);
      transform: translateY(-2px);
    }

    .hero-title {
      font-family: 'Outfit', sans-serif;
      font-size: 32px;
      font-weight: 900;
      line-height: 1.2;
      margin-bottom: 8px;
      letter-spacing: -0.5px;
    }
    .hero-sub {
      font-size: 15px;
      color: rgba(255,255,255,0.88);
      max-width: 750px;
    }

    /* Main Content Wrapper */
    .content-body {
      padding: 40px;
    }

    .section-block {
      margin-bottom: 45px;
    }
    .section-title {
      font-family: 'Outfit', sans-serif;
      font-size: 22px;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .section-title i {
      color: var(--primary-red);
      font-size: 20px;
    }

    /* Cards Grid */
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .feature-card {
      background: var(--bg-slate);
      border: 1px solid var(--card-border);
      border-radius: 16px;
      padding: 24px;
      transition: all 0.25s ease;
    }
    .feature-card:hover {
      border-color: #cbd5e1;
      transform: translateY(-3px);
      box-shadow: 0 10px 25px rgba(0,0,0,0.05);
    }
    .card-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--primary-red), var(--primary-red-dark));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      margin-bottom: 16px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 800;
      margin-bottom: 6px;
      color: var(--text-dark);
    }
    .card-desc {
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.5;
    }

    /* Role Cards */
    .role-card {
      border-radius: 18px;
      padding: 24px;
      border: 1px solid var(--card-border);
      position: relative;
      overflow: hidden;
    }
    .role-sales { background: #fef2f2; border-color: #fecaca; }
    .role-spv { background: #eff6ff; border-color: #bfdbfe; }
    .role-kacab { background: #faf5ff; border-color: #e9d5ff; }

    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      margin-bottom: 12px;
    }
    .role-sales .role-badge { background: #dc2626; color: white; }
    .role-spv .role-badge { background: #0d2d5e; color: white; }
    .role-kacab .role-badge { background: #3b141d; color: #fbbf24; }

    /* Flowchart Canvas Box */
    .mermaid-box {
      background: #f8fafc;
      border: 1px solid #cbd5e1;
      border-radius: 20px;
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow-x: auto;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
    }

    /* Timeline Workflow Steps */
    .timeline-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .timeline-item {
      display: flex;
      gap: 16px;
      background: #ffffff;
      border: 1px solid var(--card-border);
      border-radius: 14px;
      padding: 18px 20px;
      align-items: flex-start;
    }
    .timeline-step-num {
      width: 32px; height: 32px;
      border-radius: 50%;
      background: var(--primary-red);
      color: white;
      font-weight: 900;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .timeline-content h4 {
      font-size: 15px;
      font-weight: 800;
      color: var(--text-dark);
      margin-bottom: 4px;
    }
    .timeline-content p {
      font-size: 13px;
      color: var(--text-muted);
      margin: 0;
    }

    /* Script Callout Box */
    .script-box {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      color: white;
      border-radius: 20px;
      padding: 32px;
      position: relative;
    }
    .script-box h3 {
      font-family: 'Outfit', sans-serif;
      color: #f8fafc;
      font-size: 20px;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .script-box blockquote {
      font-size: 14px;
      line-height: 1.8;
      color: #cbd5e1;
      border-left: 4px solid var(--primary-red);
      padding-left: 18px;
      font-style: italic;
    }

    /* Order Flow SOP Styles */
    .order-flow-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .order-step-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid var(--primary-red);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }
    .order-step-card:hover {
      box-shadow: 0 8px 24px rgba(0,0,0,0.07);
      transform: translateY(-2px);
    }
    .order-step-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      flex-wrap: wrap;
      gap: 10px;
    }
    .order-step-title-group {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .order-step-badge {
      background: linear-gradient(135deg, var(--primary-red), var(--primary-red-dark));
      color: white;
      font-size: 12px;
      font-weight: 800;
      padding: 5px 12px;
      border-radius: 20px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .order-step-title {
      font-size: 17px;
      font-weight: 800;
      color: var(--text-dark);
      margin: 0;
    }
    .menu-route-pill {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #334155;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 10px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .menu-route-pill i {
      color: var(--primary-red);
    }
    .order-step-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-top: 14px;
    }
    @media (max-width: 768px) {
      .order-step-details { grid-template-columns: 1fr; }
    }
    .step-sub-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 16px;
    }
    .step-sub-box h5 {
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .step-sub-box ul {
      margin: 0;
      padding-left: 18px;
      font-size: 12.5px;
      color: #475569;
      line-height: 1.6;
    }
    .step-sub-box.auto-box {
      background: #f0fdf4;
      border-color: #bbf7d0;
    }
    .step-sub-box.auto-box h5 {
      color: #166534;
    }
    .step-sub-box.auto-box ul {
      color: #15803d;
    }

    /* Print Stylesheet */
    @media print {
      body { background: white; padding: 0; color: black; }
      .container { box-shadow: none; max-width: 100%; border-radius: 0; }
      .btn-action-group { display: none; }
      .hero-banner { background: #8b0519 !important; color: white !important; -webkit-print-color-adjust: exact; }
      .feature-card, .role-card, .timeline-item { break-inside: avoid; }
    }
  </style>
</head>
<body>

  <div class="container">
    
    <!-- HEADER PRESENTATION BANNER -->
    <header class="hero-banner">
      <div class="brand-row">
        <div class="brand-logo-pill">
          <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" alt="Tunas Toyota">
        </div>
        <div class="btn-action-group">
          <button class="btn-print" onclick="window.print()">
            <i class="fa-solid fa-print"></i> Cetak / Simpan PDF
          </button>
        </div>
      </div>
      <h1 class="hero-title">Alur Kerja & Panduan Sistem Sales App</h1>
      <p class="hero-sub">Dokumen resmi penjelasan cara kerja aplikasi manajemen penjualan terpadu Tunas Toyota Kiara Condong untuk Sales, Supervisor (SPV), dan Kepala Cabang (KaCab).</p>
    </header>

    <!-- CONTENT BODY -->
    <main class="content-body">

      <!-- SECTION 1: PILAR UTAMA -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-cube"></i> 3 Pilar Utama Aplikasi</h2>
        <div class="grid-3">
          <div class="feature-card">
            <div class="card-icon"><i class="fa-solid fa-location-dot"></i></div>
            <h3 class="card-title">1. Field Tracking & GPS</h3>
            <p class="card-desc">Absensi presisi dan pelaporan aktivitas harian Sales di lapangan berbasis lokasi GPS terverifikasi dan foto kegiatan.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon"><i class="fa-solid fa-chart-line"></i></div>
            <h3 class="card-title">2. Target Real-Time</h3>
            <p class="card-desc">Pantauan langsung pencapaian SPK dan DO secara detik demi detik tanpa perlu rekap manual bulanan.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <h3 class="card-title">3. Sales Superpowers</h3>
            <p class="card-desc">Dilengkapi AI Sales Copilot, Kalkulator Multi-Leasing, Toyota Eco Calc Hybrid, Peta Polreg, dan Katalog Merchandise.</p>
          </div>
        </div>
      </section>

      <!-- SECTION 2: FLOWCHART VISUAL -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-diagram-project"></i> Diagram Visual Alur Kerja (Flowchart)</h2>
        <p style="font-size:13px; color:var(--text-muted); margin-bottom:15px;">Berikut adalah diagram terstruktur alur transaksi dari input aktivitas sales di lapangan hingga otorisasi supervisor & pimpinan cabang:</p>
        
        <div class="mermaid-box">
          <pre class="mermaid">
flowchart TD
    subgraph S1["1. AKTIVITAS HARIAN SALES"]
        A[Login Sales Portal] --> B[Check-in GPS & Lokasi]
        B --> C[Input Aktivitas + Foto Bukti]
        C --> D[Kelola Prospek & Test Drive]
    end

    subgraph S2["2. TRANSAKSI & CUSTOMER"]
        D --> E{Customer Deal?}
        E -- Ya --> F[Buat Pengajuan SPK]
        E -- Ada Trade-In --> G[Input Mobil Bekas Trade-In]
        G --> H[Evaluasi Appraisal Unit]
        F --> I[Proses Simulasi Leasing]
        I --> J[Input Delivery Order / DO]
    end

    subgraph S3["3. APPROVAL SUPERVISOR"]
        F -.-> K[Notifikasi Approval SPV]
        G -.-> K
        K --> L{SPV Approve?}
        L -- Setuju --> M[Status Disetujui & Target Update]
        L -- Tolak --> N[Revisi Data Sales]
    end

    subgraph S4["4. MONITORING EKSEKUTIF"]
        M --> O[Dashboard Real-Time SPV & KaCab]
        O --> P[Peta Polreg & Market Share Wilayah]
        O --> Q[Laporan Omset & Target Cabang]
    end
          </pre>
        </div>
      </section>

      <!-- SECTION KHUSUS: ALUR KERJA KETIKA CUSTOMER MAU PESAN MOBIL -->
      <section class="section-block" id="alur-pesan-mobil">
        <h2 class="section-title"><i class="fa-solid fa-car-side" style="color:var(--primary-red);"></i> SOP Alur Kerja Sales: Ketika Customer Mau Pesan Mobil</h2>
        <p style="font-size:13.5px; color:var(--text-muted); margin-bottom:20px;">
          Panduan komprehensif bagi <strong>Sales Consultant</strong> ketika mendampingi calon pembeli dari tahap awal prospek hingga serah terima unit mobil dan retensi purna jual. Sistem telah terintegrasi secara otomatis, meminimalkan ketik ulang data.
        </p>

        <!-- Diagram Flowchart Khusus Pesan Mobil -->
        <div class="mermaid-box" style="margin-bottom: 28px;">
          <pre class="mermaid">
flowchart TD
    %% 1. TAHAP PROSPEK
    A["1. PROSPECTING & CRM<br/>(Input Prospek / customer.html)"] --> B{"Kebutuhan Konsumen?"}
    
    %% 2. TAHAP EKSPLORASI & SIMULASI
    B -- Ingin Coba Mobil --> C["2A. TEST DRIVE<br/>(testdrive.html)<br/><i>Klik [Lanjut Buat SPK]</i>"]
    B -- Tukar Mobil Bekas --> D["2B. TRADE-IN APPRAISAL<br/>(tradein.html)<br/><i>Klik [Terapkan Nilai ke DP]</i>"]
    B -- Simulasi Angsuran --> E["2C. KALKULATOR LEASING<br/>(kalkulator.html)<br/><i>Klik [Ajukan SPK dg Simulasi]</i>"]
    
    C --> F["3. FORM SPK DIGITAL<br/>(spk.html)"]
    D --> F
    E --> F
    B -- Langsung Pesan --> F

    %% 3. TAHAP SPK & TANDA JADI
    F --> G["Input Bukti Transfer Booking Fee<br/>+ Scan KTP + TTD Digital"]
    G --> H["Submit SPK<br/><i>Auto-sync status CRM ke 'SPK'</i>"]

    %% 4. TAHAP OTORISASI
    H --> I["4. APPROVAL SUPERVISOR & KACAB<br/>(pages_spv/approval.html)"]
    I --> J{"Plafond & Stok Approved?"}
    J -- Ditolak --> F
    J -- Disetujui --> K["Hold Unit Inventory<br/>+ Terbit Nomor SPK Resmi"]

    %% 5. TAHAP DO & PELUNASAN
    K --> L["PO Leasing Cair / Pelunasan Cash Masuk"]
    L --> M["5. SUBMIT DELIVERY ORDER / DO<br/>(do.html)<br/><i>Auto-prompt: Buka Delivery Ceremony</i>"]

    %% 6. TAHAP HANDOVER & RETENSI
    M --> N["6. DIGITAL DELIVERY CEREMONY<br/>(delivery_ceremony.html)<br/>Checklist PDI + Foto BASTK"]
    N --> O["7. RETENTION HUB & T-CARE<br/>(retention.html)<br/><i>Auto-reminder Servis 1.000 KM & 1 Bulan</i>"]
          </pre>
        </div>

        <!-- Detail Tahapan Operasional Kartu demi Kartu -->
        <div class="order-flow-container">
          
          <!-- TAHAP 1 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 1</span>
                <h3 class="order-step-title">Pendataan Prospek & Kualifikasi Kebutuhan</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-address-book"></i> Menu: <strong>CRM Pipeline (customer.html)</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Saat pertama kali bertemu konsumen di showroom, pameran, atau via digital leads, sales memasukkan identitas calon pembeli ke sistem.
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li>Buka menu <strong>Input Prospek</strong> (<code>input.html</code>) atau klik <strong>[+ Tambah Prospek]</strong> di CRM.</li>
                  <li>Masukkan Nama, Nomor WhatsApp, Domisili, dan Model mobil yang diminati (contoh: <em>Innova Zenix Hybrid, Veloz, Calya</em>).</li>
                  <li>Pantau prospek di papan Kanban CRM pada kolom <strong>Cold / Warm</strong>.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>Data langsung tersimpan di database CRM (<code>tabel_customer</code>).</li>
                  <li>Setiap kartu prospek memiliki tombol aksi cepat: <strong>[🚗 Test Drive]</strong>, <strong>[🧮 Simulasi]</strong>, dan <strong>[📝 Buat SPK]</strong> yang otomatis membawa data prospek ke tahapan berikutnya.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAHAP 2 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 2</span>
                <h3 class="order-step-title">Edukasi Unit, Simulasi Kredit, & Trade-In</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-calculator"></i> Menu: <strong>Pricelist / Kalkulator / Trade-In / Test Drive</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Sales memberikan opsi penawaran terbaik sesuai kebutuhan anggaran dan metode pembayaran yang diinginkan calon pembeli:
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li><strong>Opsi Cek Harga:</strong> Buka <strong>PriceList OTR</strong> (<code>pricelist.html</code>), pilih tipe varian, lalu klik <strong>[🧮 Simulasi Kredit]</strong>.</li>
                  <li><strong>Opsi Simulasi Pembiayaan:</strong> Di <strong>Kalkulator Multi-Leasing</strong> (<code>kalkulator.html</code>), atur DP, tenor (1–5 tahun), dan leasing (TAF, ACC, MTF, dll.). Setelah deal, klik <strong>[📄 Ajukan SPK dengan Simulasi Ini]</strong>.</li>
                  <li><strong>Opsi Tukar Tambah:</strong> Jika customer punya mobil lama, buka <strong>Trade-In</strong> (<code>tradein.html</code>), isi data taksiran, lalu klik <strong>[🚗 Gunakan untuk SPK (Terapkan Nilai ke DP)]</strong>.</li>
                  <li><strong>Opsi Test Drive:</strong> Jika customer ingin uji jalan, buka <strong>Test Drive</strong> (<code>testdrive.html</code>). Setelah selesai, klik <strong>[📝 Lanjut Buat SPK Unit Ini]</strong> pada riwayat.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>Semua data dari Kalkulator (DP, cicilan, tenor, leasing) atau dari Trade-In (taksiran mobil lama) langsung diteruskan ke Form SPK via parameter aman.</li>
                  <li>Sales tidak perlu lagi menghitung ulang atau mencatat manual nilai DP dan angsuran.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAHAP 3 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 3</span>
                <h3 class="order-step-title">Penerbitan Surat Pesanan Kendaraan (SPK Digital)</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-file-contract"></i> Menu: <strong>Form SPK Digital (spk.html)</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Formulir pemesanan resmi yang mengikat komitmen pembelian antara konsumen dan Tunas Toyota Kiaracondong.
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li>Data customer, leasing, dan potongan DP trade-in telah terisi otomatis (dengan banner visual konfirmasi).</li>
                  <li>Gunakan fitur <strong>Scan KTP (OCR)</strong> untuk mengisi NIK & Alamat tanpa ketik manual.</li>
                  <li>Pilih warna unit dan aksesoris resmi (TCO - Toyota Customization Option).</li>
                  <li>Unggah bukti transfer tanda jadi / booking fee (misal: Rp 5.000.000).</li>
                  <li>Minta tanda tangan digital konsumen langsung di layar HP/tablet.</li>
                  <li>Klik tombol <strong>[Submit SPK]</strong>.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>Nomor SPK resmi diterbitkan secara otomatis oleh sistem.</li>
                  <li>Status customer di papan Kanban CRM (<code>tabel_customer</code>) otomatis naik kelas menjadi <strong>'SPK'</strong>.</li>
                  <li>Notifikasi real-time terkirim ke Supervisor untuk proses otorisasi (<em>approval</em>).</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAHAP 4 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 4</span>
                <h3 class="order-step-title">Verifikasi & Approval Supervisor / KaCab</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-user-check"></i> Menu: <strong>Portal SPV (pages_spv/approval.html)</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Pemeriksaan dokumen, keabsahan tanda jadi, kelayakan diskon, dan alokasi unit stok cabang oleh pimpinan.
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li>Sales dapat memantau status persetujuan di riwayat SPK aplikasi sales.</li>
                  <li>Jika ada catatan atau sanggahan diskon/plafon dari SPV, sales segera melengkapi berkas yang diminta.</li>
                  <li>SPV / KaCab melakukan validasi dan mengklik tombol <strong>[Approve]</strong>.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>SPK berstatus <strong>'Approved'</strong> dan unit di modul Inventory terkunci (<em>hold</em>) agar tidak diambil sales lain.</li>
                  <li>Target pencapaian SPK Sales, SPV, dan Cabang langsung bertambah di dashboard real-time.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAHAP 5 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 5</span>
                <h3 class="order-step-title">Pelunasan & Penerbitan Delivery Order (DO)</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-truck-ramp-box"></i> Menu: <strong>Delivery Order (do.html)</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Tahap di mana berkas PO leasing telah terbit (kredit) atau pembayaran unit telah lunas 100% (cash), dan mobil siap dijadwalkan untuk dikirim.
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li>Buka menu <strong>Delivery Order (DO)</strong> (<code>do.html</code>).</li>
                  <li>Pilih SPK customer yang telah berstatus <em>Approved</em>.</li>
                  <li>Masukkan Nomor Rangka, Nomor Mesin, Alamat Pengiriman, dan Tanggal Janji Kirim.</li>
                  <li>Klik tombol <strong>[Submit DO]</strong>.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>Status customer di CRM berubah menjadi <strong>'DO'</strong>.</li>
                  <li>Muncul dialog selebrasi sukses yang langsung menawarkan tombol: <strong>[📸 Buka Digital Delivery Ceremony Sekarang]</strong>.</li>
                  <li>Angka penjualan DO sales & cabang langsung terhitung real-time.</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- TAHAP 6 -->
          <div class="order-step-card">
            <div class="order-step-header">
              <div class="order-step-title-group">
                <span class="order-step-badge">Tahap 6</span>
                <h3 class="order-step-title">Serah Terima Kendaraan & Retensi Purna Jual (T-Care)</h3>
              </div>
              <span class="menu-route-pill"><i class="fa-solid fa-gift"></i> Menu: <strong>Delivery Ceremony & Retensi Konsumen</strong></span>
            </div>
            <p style="font-size:13.5px; color:#334155; margin-bottom:12px;">
              Momen puncak penyerahan unit mobil baru kepada konsumen, pengecekan fisik kendaraan, dan pendampingan perawatan berkala jangka panjang.
            </p>
            <div class="order-step-details">
              <div class="step-sub-box">
                <h5><i class="fa-solid fa-hand-pointer" style="color:var(--primary-red);"></i> Aksi yang Dilakukan Sales:</h5>
                <ul>
                  <li>Buka <strong>Digital Delivery Ceremony</strong> (<code>delivery_ceremony.html</code>) — data nama, unit, dan nomor rangka terisi otomatis dari data DO.</li>
                  <li>Lakukan checklist PDI bersama customer (kondisi bodi, kelengkapan toolkit, buku servis/garansi, STCK/STNK, kaca film).</li>
                  <li>Ambil foto penyerahan bersama konsumen di depan unit baru.</li>
                  <li>Minta tanda tangan digital serah terima BASTK dan terbitkan <strong>Sertifikat Serah Terima Resmi</strong>.</li>
                </ul>
              </div>
              <div class="step-sub-box auto-box">
                <h5><i class="fa-solid fa-bolt"></i> Otomasi Sistem di Belakang Layar:</h5>
                <ul>
                  <li>Status customer di CRM diperbarui menjadi <strong>'DO (Delivered)'</strong>.</li>
                  <li>Sistem otomatis mendaftarkan customer ke modul <strong>Retensi Konsumen (<code>retention.html</code>)</strong> dengan reminder servis berkala perdana (<strong>1.000 KM / 1 Bulan pasca DO</strong>).</li>
                  <li>Sales dapat mengirim reminder WhatsApp otomatis saat waktu servis berkala tiba untuk menjaga kepuasan konsumen dan membangun peluang <em>repeat order</em> atau <em>referral</em>.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- SECTION 4: HIRARKI AKSES PORTAL -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-users-gear"></i> Hirarki Portal Akses User</h2>
        <div class="grid-3">
          <div class="role-card role-sales">
            <span class="role-badge"><i class="fa-solid fa-user-tag"></i> Sales Consultant</span>
            <h3 class="card-title">Portal Sales</h3>
            <p class="card-desc">Digunakan oleh Sales di lapangan untuk melaporkan kegiatan harian, mengajukan SPK, input DO, simulasikan angsuran kredit, dan kelola prospek.</p>
          </div>
          <div class="role-card role-spv">
            <span class="role-badge"><i class="fa-solid fa-user-tie"></i> Supervisor (SPV)</span>
            <h3 class="card-title">Portal Executive SPV</h3>
            <p class="card-desc">Digunakan oleh Supervisor untuk mengontrol aktivitas tim sales, melakukan approval SPK & Trade-in, pembagian lead, serta coaching sales.</p>
          </div>
          <div class="role-card role-kacab">
            <span class="role-badge"><i class="fa-solid fa-crown"></i> Kepala Cabang</span>
            <h3 class="card-title">Portal Kacab Panel</h3>
            <p class="card-desc">Dashboard eksekutif tertinggi cabang untuk memantau total omset SPK/DO cabang, analisis penguasaan pasar wilayah (Polreg), dan kinerja SPV.</p>
          </div>
        </div>
      </section>

      <!-- SECTION 5: STEP BY STEP OPERASIONAL HARIAN -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-list-check"></i> Langkah-Langkah Operasional Harian</h2>
        <div class="timeline-list">
          <div class="timeline-item">
            <div class="timeline-step-num">1</div>
            <div class="timeline-content">
              <h4>Absensi & Tracking Aktivitas Harian</h4>
              <p>Sales melakukan check-in di lokasi via GPS, memilih jenis aktivitas (Digital Marketing, Walk-in, Pameran, FOA, dll.), dan mengunggah foto bukti kegiatan.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-step-num">2</div>
            <div class="timeline-content">
              <h4>Pengajuan SPK & Trade-In Kendaraan</h4>
              <p>Saat terjadi kesepakatan dengan customer, Sales mengisi Form SPK digital dan mendaftarkan data kendaraan bekas jika customer memilih opsi Trade-In.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-step-num">3</div>
            <div class="timeline-content">
              <h4>Verifikasi & Approval Supervisor (SPV)</h4>
              <p>Data SPK dan Trade-In masuk ke notifikasi SPV secara otomatis untuk diperiksa dokumen, kelayakan, serta disetujui secara digital.</p>
            </div>
          </div>
          <div class="timeline-item">
            <div class="timeline-step-num">4</div>
            <div class="timeline-content">
              <h4>Input DO & Update Target Cabang (Real-Time)</h4>
              <p>Sales menginput DO langsung begitu mobil siap dikirim. Angka pencapaian DO langsung bertambah otomatis pada Dashboard SPV dan Kepala Cabang.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECTION 6: 7 SUPERPOWERS SALES LAPANGAN -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-bolt" style="color:#f59e0b;"></i> 7 Fitur Superpowers Sales Lapangan</h2>
        <div class="grid-3">
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #0d1b3e, #1e3a8a);"><i class="fa-solid fa-location-crosshairs"></i></div>
            <h3 class="card-title">1. Radar Prospek Terdekat (GPS)</h3>
            <p class="card-desc">Mendeteksi database & prospek dalam radius 1–5 km dari posisi sales saat ini untuk kunjungan rute efektif dan efisien.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #10b981, #059669);"><i class="fa-solid fa-file-pdf"></i></div>
            <h3 class="card-title">2. Instant Quotation to PDF & WA</h3>
            <p class="card-desc">Brosur rincian DP & cicilan resmi ber-kop Tunas Toyota yang langsung dikirim ke WhatsApp konsumen dalam 1 klik.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #3b82f6, #1d4ed8);"><i class="fa-solid fa-bell"></i></div>
            <h3 class="card-title">3. Smart Morning Briefing</h3>
            <p class="card-desc">Pengingat otomatis di dashboard pagi hari untuk prospek yang jatuh tempo follow-up lengkap dengan tombol chat instan.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #8b5cf6, #6d28d9);"><i class="fa-solid fa-id-card"></i></div>
            <h3 class="card-title">4. Scan KTP & STNK (OCR)</h3>
            <p class="card-desc">Cukup foto KTP/STNK customer, data (Nama, NIK, Alamat) otomatis terisi ke form SPK/CRM tanpa ngetik manual (anti-typo).</p>
          </div>
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #ef4444, #b91c1c);"><i class="fa-solid fa-microphone"></i></div>
            <h3 class="card-title">5. Voice Note Activity Logger</h3>
            <p class="card-desc">Sales cukup rekam suara 10 detik setelah meeting di lapangan, sistem otomatis mentranskripsi ke teks catatan follow-up.</p>
          </div>
          <div class="feature-card">
            <div class="card-icon" style="background:linear-gradient(135deg, #f59e0b, #d97706);"><i class="fa-solid fa-shield-halved"></i></div>
            <h3 class="card-title">6. Battle Card & Objections</h3>
            <p class="card-desc">Contekan head-to-head vs kompetitor (Honda, Mitsubishi, Hyundai) & panduan jurus menjawab keberatan diskon & inden.</p>
          </div>
        </div>
      </section>

      <!-- SECTION 7: NASKAH PRESENTASI -->
      <section class="section-block">
        <div class="script-box">
          <h3><i class="fa-solid fa-bullhorn"></i> Naskah Penjelasan Singkat (Script Presentasi 3 Menit)</h3>
          <blockquote>
            "Sales App Tunas Toyota adalah platform terpadu yang menghubungkan Sales Consultant, Supervisor, dan Kepala Cabang dalam satu ekosistem digital real-time.<br><br>
            Aplikasi ini memudahkan Sales menginput aktivitas lapangan berbasis GPS, membuat pengajuan SPK digital, hingga menghitung simulasi kredit instan. Setiap pengajuan SPK dan Trade-In akan langsung terhubung ke Supervisor untuk verifikasi cepat. Kepala Cabang juga dapat memantau pergerakan omset dan pencapaian target cabang secara detik demi detik.<br><br>
            Dengan sistem ini, seluruh proses dari prospeksi hingga mobil sampai ke tangan customer menjadi jauh lebih cepat, transparan, dan terukur."
          </blockquote>
        </div>
      </section>

    </main>
  </div>

  <script>
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' }
    });
  </script>

</body>
</html>
