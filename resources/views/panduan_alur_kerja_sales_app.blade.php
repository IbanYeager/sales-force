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

      <!-- SECTION 3: HIRARKI AKSES PORTAL -->
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

      <!-- SECTION 4: STEP BY STEP OPERASIONAL -->
      <section class="section-block">
        <h2 class="section-title"><i class="fa-solid fa-list-check"></i> Langkah-Langkah Proses Operasional</h2>
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

      <!-- SECTION 4.5: 7 SUPERPOWERS SALES LAPANGAN -->
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

      <!-- SECTION 5: NASKAH PRESENTASI -->
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
