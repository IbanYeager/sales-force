<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Studio SPH & Otorisasi Penawaran Harga</title>
  <meta name="description" content="Penerbitan dan otorisasi Surat Penawaran Harga (SPH) resmi Toyota Tunas Kiara Condong Bandung oleh Kepala Cabang." />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/quotation_studio.css?v=20260915_kacab_v2">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">

  <style>
    .kcb-sph-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, rgba(30, 16, 20, 0.95) 0%, rgba(20, 10, 13, 0.98) 100%);
      border: 1px solid rgba(216, 164, 55, 0.3);
      padding: 12px 20px;
      border-radius: 14px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.35);
      flex-wrap: wrap;
      gap: 12px;
    }
    .kcb-sph-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(216, 164, 55, 0.15);
      border: 1px solid rgba(216, 164, 55, 0.35);
      color: #fde047;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
    }
    .kcb-sph-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .btn-sph-kcb {
      padding: 8px 16px;
      border-radius: 9px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 7px;
      transition: all 0.2s ease;
      border: none;
    }
    .btn-sph-copy {
      background: rgba(255, 255, 255, 0.08);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .btn-sph-copy:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }
    .btn-sph-wa {
      background: #25D366;
      color: #fff;
    }
    .btn-sph-wa:hover {
      background: #1eb954;
      box-shadow: 0 4px 12px rgba(37, 211, 102, 0.35);
    }
    .btn-sph-print {
      background: linear-gradient(135deg, #d8a437 0%, #b45309 100%);
      color: #1e1014;
      box-shadow: 0 4px 14px rgba(216, 164, 55, 0.35);
    }
    .btn-sph-print:hover {
      filter: brightness(1.1);
      transform: translateY(-1px);
    }
  </style>
</head>

<body>
  <div class="kcb-shell theme-kacab">
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
        <a href="quotation.html" id="navSph" class="active"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:900;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i>After Sales</a>
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

    <!-- MAIN BODY -->
    <main class="kcb-main">
      <!-- TOPBAR KACAB -->
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Studio SPH &amp; Otorisasi Penawaran Harga</h2>
          <p class="page-sub">Penerbitan, simulasi skema pembiayaan, dan otorisasi dokumen resmi Surat Penawaran Harga (SPH) Toyota</p>
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

      <!-- WORKSPACE ACTION TOOLBAR -->
      <div class="kcb-sph-toolbar">
        <div class="kcb-sph-badge">
          <i class="fa-solid fa-stamp"></i>
          <span>Portal Otorisasi Kepala Cabang &bull; Dokumen Sah PT Tunas Ridean Tbk</span>
        </div>
        <div class="kcb-sph-actions">
          <button type="button" class="btn-sph-kcb btn-sph-copy" onclick="copyQuotationText()" title="Salin Ringkasan Teks">
            <i class="fa-solid fa-copy"></i> Salin Teks
          </button>
          <button type="button" class="btn-sph-kcb btn-sph-wa" onclick="shareQuotationWA()" title="Kirim via WhatsApp">
            <i class="fa-brands fa-whatsapp"></i> Kirim WhatsApp
          </button>
          <button type="button" class="btn-sph-kcb btn-sph-print" onclick="printQuotation()" title="Cetak atau Unduh Dokumen PDF Resmi">
            <i class="fa-solid fa-print"></i> Cetak / Unduh PDF A4
          </button>
        </div>
      </div>

      <!-- MOBILE TOGGLE VIEW BUTTONS -->
      <div class="sph-mobile-toggle">
        <button type="button" class="sph-mobile-tab active" id="tabMobileBuilder" onclick="switchMobileTab('builder')">
          <i class="fa-solid fa-sliders"></i> Edit Penawaran
        </button>
        <button type="button" class="sph-mobile-tab" id="tabMobilePreview" onclick="switchMobileTab('preview')">
          <i class="fa-solid fa-file-invoice"></i> Lembar SPH A4
        </button>
      </div>

      <!-- SPH WORKSPACE -->
      <div class="sph-workspace view-builder" style="padding-top:0;">
        
        <!-- LEFT: FORM BUILDER CARD -->
        <section class="sph-builder-card">
          <div class="sph-card-header">
            <h2><i class="fa-solid fa-pen-ruler"></i> Konfigurasi Penawaran</h2>
            <span class="sph-pill-tag">OFFICIAL BM QUOTATION</span>
          </div>

          <div class="sph-card-body">
            <!-- 1. DATA KONSUMEN & DOKUMEN -->
            <div class="sph-section-title">
              <i class="fa-solid fa-user-tie"></i> 1. Informasi Dokumen &amp; Konsumen
            </div>

            <div class="sph-grid-2">
              <div class="sph-form-group">
                <label class="sph-label">Tipe Konsumen</label>
                <select id="sphCustomerType" class="sph-select" onchange="updateSphLive()">
                  <option value="Perorangan">Perorangan (Retail)</option>
                  <option value="Perusahaan">Perusahaan / CV / PT</option>
                  <option value="Instansi">Instansi / Dinas / BUMN</option>
                </select>
              </div>
              <div class="sph-form-group">
                <label class="sph-label">Kota / Domisili</label>
                <input type="text" id="sphCustomerCity" class="sph-input" value="Kota Bandung" oninput="updateSphLive()" placeholder="Bandung, Cimahi, dll">
              </div>
            </div>

            <div class="sph-form-group">
              <label class="sph-label">Nama Konsumen / PIC</label>
              <input type="text" id="sphCustomerName" class="sph-input" placeholder="Contoh: Bpk. Hendra Gunawan, S.E." oninput="updateSphLive()">
            </div>

            <div class="sph-grid-2">
              <div class="sph-form-group">
                <label class="sph-label">Nomor WhatsApp / HP</label>
                <input type="tel" id="sphCustomerPhone" class="sph-input" placeholder="08xxxxxxxxxx" oninput="updateSphLive()">
              </div>
              <div class="sph-form-group">
                <label class="sph-label">Perusahaan (Opsional)</label>
                <input type="text" id="sphCustomerCompany" class="sph-input" placeholder="PT. / CV. Maju Bersama" oninput="updateSphLive()">
              </div>
            </div>

            <div class="sph-grid-2">
              <div class="sph-form-group">
                <label class="sph-label">Tanggal Terbit SPH</label>
                <input type="date" id="sphDate" class="sph-input" onchange="updateSphLive()">
              </div>
              <div class="sph-form-group">
                <label class="sph-label">Masa Berlaku Promo</label>
                <select id="sphValidity" class="sph-select" onchange="updateSphLive()">
                  <option value="3">3 Hari Kerja</option>
                  <option value="7" selected>7 Hari Kalender</option>
                  <option value="14">14 Hari Kalender</option>
                  <option value="30">30 Hari (Akhir Bulan)</option>
                </select>
              </div>
            </div>

            <!-- 2. PILIHAN KENDARAAN & SPESIFIKASI -->
            <div class="sph-section-title">
              <i class="fa-solid fa-car-side"></i> 2. Pilihan Unit &amp; Spesifikasi
            </div>

            <div class="sph-form-group">
              <label class="sph-label">Model &amp; Tipe Toyota</label>
              <select id="sphModelSelect" class="sph-select" onchange="onModelChanged()">
                <!-- Generated dynamically via quotation.js -->
              </select>
            </div>

            <div class="sph-grid-3">
              <div class="sph-form-group" style="grid-column: span 2;">
                <label class="sph-label">Pilihan Warna</label>
                <input type="text" id="sphColorChoice" class="sph-input" value="Attitude Black Mica / Bebas Pilihan" oninput="updateSphLive()" placeholder="Warna kendaraan...">
              </div>
              <div class="sph-form-group">
                <label class="sph-label">Tahun</label>
                <input type="number" id="sphUnitYear" class="sph-input" value="2026" oninput="updateSphLive()">
              </div>
            </div>

            <div class="sph-grid-2">
              <div class="sph-form-group">
                <label class="sph-label">Harga OTR Bandung (Rp)</label>
                <input type="number" id="sphOtrInput" class="sph-input" value="476200000" oninput="updateSphLive()">
              </div>
              <div class="sph-form-group">
                <label class="sph-label">Diskon / Cashback Otorisasi (Rp)</label>
                <input type="number" id="sphDiskonInput" class="sph-input" value="18000000" oninput="updateSphLive()" placeholder="0">
              </div>
            </div>

            <!-- 3. SKEMA TRANSAKSI -->
            <div class="sph-section-title">
              <i class="fa-solid fa-coins"></i> 3. Skema Transaksi Finansial
            </div>

            <div class="sph-segmented">
              <button type="button" class="sph-segment-btn active" id="btnSchemeKredit" onclick="setScheme('kredit')">
                <i class="fa-solid fa-credit-card"></i> Skema Kredit (Leasing)
              </button>
              <button type="button" class="sph-segment-btn" id="btnSchemeCash" onclick="setScheme('cash')">
                <i class="fa-solid fa-money-bill-wave"></i> Pembelian Tunai (Cash)
              </button>
            </div>

            <!-- BUILDER: SKEMA KREDIT -->
            <div id="sectionBuilderKredit">
              <div class="sph-grid-2">
                <div class="sph-form-group">
                  <label class="sph-label">Uang Muka (DP %)</label>
                  <select id="sphDpPercent" class="sph-select" onchange="updateSphLive()">
                    <option value="15">15% (DP Rendah)</option>
                    <option value="20" selected>20% (Standard Rekomendasi)</option>
                    <option value="25">25% (Cicilan Ringan)</option>
                    <option value="30">30% (DP Optimal)</option>
                    <option value="40">40% (DP Besar)</option>
                    <option value="50">50% (DP 50%)</option>
                  </select>
                </div>
                <div class="sph-form-group">
                  <label class="sph-label">Jangka Waktu (Tenor)</label>
                  <select id="sphTenor" class="sph-select" onchange="updateSphLive()">
                    <option value="12">1 Tahun (12 Bulan)</option>
                    <option value="24">2 Tahun (24 Bulan)</option>
                    <option value="36">3 Tahun (36 Bulan)</option>
                    <option value="48">4 Tahun (48 Bulan)</option>
                    <option value="60" selected>5 Tahun (60 Bulan)</option>
                    <option value="72">6 Tahun (72 Bulan)</option>
                  </select>
                </div>
              </div>

              <div class="sph-grid-2">
                <div class="sph-form-group">
                  <label class="sph-label">Mitra Leasing Resmi</label>
                  <select id="sphLeasingSelect" class="sph-select" onchange="updateSphLive()">
                    <option value="TAF (Toyota Astra Financial)" selected>TAF (Toyota Astra Financial)</option>
                    <option value="ACC (Astra Credit Companies)">ACC (Astra Credit Companies)</option>
                    <option value="MTF (Mandiri Tunas Finance)">MTF (Mandiri Tunas Finance)</option>
                    <option value="BCA Finance">BCA Finance</option>
                    <option value="Maybank Finance">Maybank Finance</option>
                    <option value="BSI OTO (Syariah)">BSI OTO (Syariah)</option>
                  </select>
                </div>
                <div class="sph-form-group">
                  <label class="sph-label">Perlindungan Asuransi</label>
                  <select id="sphInsuranceType" class="sph-select" onchange="updateSphLive()">
                    <option value="Comprehensive (All Risk)" selected>Comprehensive (All Risk)</option>
                    <option value="Kombinasi (1 Thn All Risk + TLO)">Kombinasi (All Risk + TLO)</option>
                    <option value="Total Loss Only (TLO)">Total Loss Only (TLO)</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- BUILDER: SKEMA CASH -->
            <div id="sectionBuilderCash" style="display:none;">
              <p style="font-size:12px; color:#cbd5e1; line-height:1.5; margin-bottom:12px; background:rgba(255,255,255,0.04); padding:10px; border-radius:8px; border-left:3px solid #d8a437;">
                Pembelian tunai resmi mencakup harga unit On The Road (OTR) Bandung, pengurusan STNK, BPKB, dan plat nomor resmi Jawa Barat.
              </p>
            </div>

            <div class="sph-form-group">
              <label class="sph-label">Tanda Jadi / Booking Fee Unit (Rp)</label>
              <input type="number" id="sphBookingFeeInput" class="sph-input" value="5000000" oninput="updateSphLive()">
            </div>

            <!-- 4. BONUS & PAKET FASILITAS -->
            <div class="sph-section-title">
              <i class="fa-solid fa-gift"></i> 4. Paket Bonus &amp; Fasilitas Dealer
            </div>

            <div class="sph-checklist">
              <label class="sph-check-item">
                <input type="checkbox" class="sph-bonus-checkbox" data-label="Free Kaca Film V-Kool / 3M Bergaransi Resmi" checked onchange="updateSphLive()">
                <span>Free Kaca Film V-Kool / 3M Bergaransi</span>
              </label>
              <label class="sph-check-item">
                <input type="checkbox" class="sph-bonus-checkbox" data-label="Free Servis &amp; Oli s/d 50.000 KM / 4 Tahun (T-Care)" checked onchange="updateSphLive()">
                <span>Free Servis &amp; Oli s/d 50.000 KM (T-Care)</span>
              </label>
              <label class="sph-check-item">
                <input type="checkbox" class="sph-bonus-checkbox" data-label="Karpet Dasar Original Toyota &amp; APAR Tabung Pemadam" checked onchange="updateSphLive()">
                <span>Karpet Dasar Original &amp; APAR Tabung Pemadam</span>
              </label>
              <label class="sph-check-item">
                <input type="checkbox" class="sph-bonus-checkbox" data-label="Emergency Kit Segitiga, Kotak P3K, &amp; Tool Kit Resmi" checked onchange="updateSphLive()">
                <span>Emergency Kit, P3K, &amp; Tool Kit Resmi</span>
              </label>
              <label class="sph-check-item">
                <input type="checkbox" class="sph-bonus-checkbox" data-label="Dudukan Pelat Nomor &amp; Payung Eksklusif Tunas Toyota" checked onchange="updateSphLive()">
                <span>Dudukan Plat Nomor &amp; Payung Eksklusif Tunas Toyota</span>
              </label>
            </div>

            <!-- 5. KONSULTAN / PIC SALES PENGAJU -->
            <div class="sph-section-title">
              <i class="fa-solid fa-id-badge"></i> 5. Konsultan Wiraniaga Pengaju
            </div>

            <div class="sph-grid-2">
              <div class="sph-form-group">
                <label class="sph-label">Nama Wiraniaga</label>
                <input type="text" id="sphInputSalesName" class="sph-input" placeholder="Nama Wiraniaga..." oninput="syncCustomSalesName(this.value)">
              </div>
              <div class="sph-form-group">
                <label class="sph-label">No. Telepon / WA Sales</label>
                <input type="tel" id="sphInputSalesPhone" class="sph-input" placeholder="0812xxxxxxxx" oninput="syncCustomSalesPhone(this.value)">
              </div>
            </div>

          </div>
        </section>

        <!-- RIGHT: OFFICIAL A4 DOCUMENT PREVIEW -->
        <section class="sph-preview-container">
          <div class="sph-paper" id="sphPrintArea">

            <!-- KOP SURAT RESMI -->
            <header class="sph-letterhead">
              <div class="sph-logo-col">
                <img src="../image/logo_tunas_toyota.png" alt="Tunas Toyota" class="sph-doc-logo" onerror="this.src='https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png'">
              </div>
              <div class="sph-dealer-info">
                <h4>PT TUNAS RIDEAN, TBK</h4>
                <div class="sph-dealer-badge">AUTHORIZED TOYOTA MAIN DEALER - CABANG BANDUNG</div>
                <p>Jl. Ibrahim Adjie (Kiaracondong) No. 154, Bandung 40284</p>
                <p>Telp: (022) 731-1555 &bull; Website: salesforcetunassft.com</p>
              </div>
            </header>

            <div class="sph-divider-double"></div>

            <!-- JUDUL SURAT -->
            <div class="sph-doc-title-block">
              <h3>SURAT PENAWARAN HARGA (SPH)</h3>
              <p>OFFICIAL VEHICLE QUOTATION &amp; FINANCIAL SIMULATION SCHEME</p>
              <div style="margin-top:4px;"><span style="font-size:10px; font-weight:800; color:#b45309; background:#fef3c7; padding:2px 8px; border-radius:4px; border:1px solid #fde68a;"><i class="fa-solid fa-check-double"></i> TEROTORISASI OLEH KEPALA CABANG</span></div>
            </div>

            <!-- TABEL DUA KOLOM: INFORMASI SPH & TUJUAN -->
            <div class="sph-meta-grid">
              <div class="sph-meta-col">
                <table class="sph-table-meta">
                  <tr>
                    <td class="col-lbl">Nomor SPH</td>
                    <td class="col-sep">:</td>
                    <td class="col-val"><strong id="docSphNumber">SPH-2026/09/KC-001</strong></td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Tanggal Terbit</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docDate">15 September 2026</td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Masa Berlaku</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docValidity">22 September 2026 (7 Hari)</td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Konsultan Sales</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docSalesName">Egy Pratama</td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Kontak Sales</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docSalesContact">0812-2154-1540</td>
                  </tr>
                </table>
              </div>

              <div class="sph-meta-col">
                <table class="sph-table-meta">
                  <tr>
                    <td class="col-lbl">Kepada Yth.</td>
                    <td class="col-sep">:</td>
                    <td class="col-val"><strong id="docCustomerName">Bapak / Ibu Calon Konsumen</strong></td>
                  </tr>
                  <tr>
                    <td class="col-lbl">No. Telepon/WA</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docCustomerPhone">-</td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Kota Domisili</td>
                    <td class="col-sep">:</td>
                    <td class="col-val" id="docCustomerCity">Kota Bandung</td>
                  </tr>
                  <tr>
                    <td class="col-lbl">Perihal</td>
                    <td class="col-sep">:</td>
                    <td class="col-val"><strong>Penawaran Unit Baru Toyota 2026</strong></td>
                  </tr>
                </table>
              </div>
            </div>

            <!-- PEMBUKA SURAT -->
            <div class="sph-salutation">
              Dengan hormat,<br>
              Bersama surat ini, kami dari <strong>PT Tunas Ridean Tbk &ndash; Tunas Toyota Kiara Condong</strong> bermaksud menyampaikan penawaran harga spesial untuk unit kendaraan Toyota impian Bapak/Ibu dengan rincian sebagai berikut:
            </div>

            <!-- UNIT SHOWCASE BANNER -->
            <div class="sph-unit-banner">
              <div class="sph-unit-text">
                <h4 id="docUnitModel">Innova Zenix 2.0 V CVT Gasoline</h4>
                <div class="sph-unit-spec" id="docUnitColor">Warna: Attitude Black Mica / Bebas Pilihan | Tahun Perakitan: 2026 (100% Baru OTR Jawa Barat)</div>
              </div>
              <div class="sph-unit-photo">
                <img id="docUnitImg" src="../assets/img/mobil/zenix.webp" alt="Toyota Unit" onerror="this.style.display='none'">
              </div>
            </div>

            <!-- FINANCIAL BREAKDOWN TABLE -->
            <table class="sph-table-price">
              <thead>
                <tr>
                  <th style="width: 45px; text-align: center;">NO</th>
                  <th>KOMPONEN RINCIAN BIAYA &amp; FINANSIAL</th>
                  <th style="width: 220px; text-align: right;">NOMINAL (RUPIAH)</th>
                </tr>
              </thead>
              <tbody id="docFinancialTableBody">
                <!-- Populated via quotation.js -->
              </tbody>
            </table>

            <!-- FINANCIAL NOTES -->
            <p class="sph-notes" id="docFinancialNotes">
              * Perhitungan di atas merupakan simulasi resmi dan bersifat mengikat selama periode masa berlaku surat.
            </p>

            <!-- ACCESSORIES & BONUS BOX -->
            <div class="sph-bonus-box">
              <h5><i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Paket Aksesoris &amp; Fasilitas Pelayanan Dealer Termasuk:</h5>
              <div class="sph-bonus-grid" id="docBonusList">
                <!-- Populated via quotation.js -->
              </div>
            </div>

            <!-- SECURITY & BANK ACCOUNT TERMS -->
            <div class="sph-terms-box">
              <strong>PENTING - KETENTUAN KEAMANAN TRANSAKSI:</strong><br>
              Untuk menjamin kenyamanan dan keamanan transaksi konsumen, pembayaran sah tanda jadi (Booking Fee) atau pelunasan <strong>HANYA</strong> disetorkan ke rekening resmi perusahaan berikut:
              <div class="sph-bank-highlight">
                <span><i class="fa-solid fa-shield-halved" style="color:#d71920; margin-right:6px;"></i> BANK CENTRAL ASIA (BCA) - Cab. Sudirman Bandung</span>
                <span style="font-family:monospace; font-size:12.5px; letter-spacing:0.5px;">No. Rek: 008-303-9999 a.n. PT TUNAS RIDEAN TBK</span>
              </div>
              <span style="font-size: 9.5px; color: #78350f; display: block; margin-top: 4px;">
                * Dealer tidak bertanggung jawab atas transaksi pembayaran yang dialihkan ke rekening pribadi atas nama siapa pun.
              </span>
            </div>

            <!-- SIGNATURE AREA (KACAB EDITION) -->
            <div class="sph-sign-row">
              <div class="sph-sign-box">
                <div class="sph-sign-title">Diajukan Oleh:</div>
                <div class="sph-sign-name" id="docSignSalesName">Egy Pratama</div>
                <div class="sph-sign-role" id="docSignSalesRole">Senior Sales Consultant</div>
              </div>
              <div class="sph-sign-box">
                <div class="sph-sign-title">Mengetahui:</div>
                <div class="sph-sign-name">Supervisor Penjualan</div>
                <div class="sph-sign-role">Tunas Toyota Kiara Condong</div>
              </div>
              <div class="sph-sign-box" style="border:1.5px solid rgba(216,164,55,0.4); background:#fffdf5;">
                <div class="sph-sign-title" style="color:#b45309; font-weight:800;">Disetujui / Otorisasi:</div>
                <div class="sph-sign-name" id="docSignKacabName" style="color:#1e1014; font-weight:800;">Kepala Cabang</div>
                <div class="sph-sign-role" style="color:#b45309; font-weight:700;">Branch Manager Kiara Condong</div>
              </div>
              <div class="sph-sign-box">
                <div class="sph-sign-title">Disetujui Oleh Konsumen:</div>
                <div class="sph-sign-name" id="docSignCustomerName">Bpk/Ibu Calon Konsumen</div>
                <div class="sph-sign-role">Nama Terang &amp; Tanggal</div>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- JavaScript -->
  <script src="../custom_alert.js"></script>
  <script src="../js/quotation.js?v=20260915_kacab_v2"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Sync info Kacab
      const kacabNama = localStorage.getItem('namaSales') || localStorage.getItem('kacab_nama') || 'Kepala Cabang';
      const elKacabNama = document.getElementById('kcbNama');
      if (elKacabNama && kacabNama !== 'Sales') elKacabNama.textContent = kacabNama;

      const elSignKacab = document.getElementById('docSignKacabName');
      if (elSignKacab && kacabNama && kacabNama !== 'Sales') elSignKacab.textContent = kacabNama;

      const avatar = document.getElementById('kcbAvatar');
      if (avatar && kacabNama) {
        avatar.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(kacabNama) + '&background=1e1014&color=d8a437&bold=true';
      }

      // Populate custom input sales name if available
      const currentSales = localStorage.getItem('sph_custom_sales_name') || 'Dendi Holius';
      const currentPhone = localStorage.getItem('sph_custom_sales_phone') || '0812-2154-1540';
      const inputSales = document.getElementById('sphInputSalesName');
      const inputPhone = document.getElementById('sphInputSalesPhone');
      if (inputSales) inputSales.value = currentSales;
      if (inputPhone) inputPhone.value = currentPhone;

      if (typeof setElText === 'function') {
        setElText('docSalesName', currentSales);
        setElText('docSalesContact', 'HP/WA: ' + currentPhone + ' | Tunas Toyota Kiara Condong');
        setElText('docSignSalesName', currentSales);
      }
    });

    function syncCustomSalesName(val) {
      val = val.trim() || 'Dendi Holius';
      localStorage.setItem('sph_custom_sales_name', val);
      if (typeof setElText === 'function') {
        setElText('docSalesName', val);
        setElText('docSignSalesName', val);
      }
    }

    function syncCustomSalesPhone(val) {
      val = val.trim() || '0812-2154-1540';
      localStorage.setItem('sph_custom_sales_phone', val);
      if (typeof setElText === 'function') {
        setElText('docSalesContact', 'HP/WA: ' + val + ' | Tunas Toyota Kiara Condong');
      }
    }

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
