<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Digital Quotation &amp; SPH Studio - Tunas Toyota Kiara Condong</title>
  <meta name="description" content="Generator Surat Penawaran Harga (SPH) resmi, skema kredit leasing, dan penawaran tunai Toyota Tunas Kiara Condong Bandung." />

  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="../css/style.css?v=20260915">
  <link rel="stylesheet" href="../css/quotation_studio.css?v=20260915_sph_v33">
  <script src="../js/sidebar_desktop.js?v=20260915"></script>

  <script>
    // Deteksi otomatis jika user yang membuka adalah Kacab atau SPV
    (function checkRoleRedirect() {
      try {
        const role = localStorage.getItem('peranSales');
        const urlParams = new URLSearchParams(window.location.search);
        const forcedRole = urlParams.get('role');
        if (role === 'Kepala Cabang' || forcedRole === 'kacab') {
          window.location.replace('../pages_kacab/quotation.html');
        } else if (role === 'Supervisor' || forcedRole === 'spv') {
          window.location.replace('../pages_spv/quotation.html');
        }
      } catch(e) {}
    })();
  </script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#d71920">
</head>

<body class="sph-body">

  <!-- TOP APP BAR -->
  <header class="sph-topbar">
    <div class="sph-topbar-left">
      <a href="javascript:void(0)" onclick="if(window.history.length > 1) { window.history.back(); } else { window.location.href='../index.html'; }" class="sph-back-btn" title="Kembali">
        <i class="fa-solid fa-arrow-left"></i>
      </a>
      <div class="sph-topbar-title">
        <h1>Surat Penawaran Harga (SPH) Studio</h1>
        <p>PT Tunas Ridean Tbk &bull; Cabang Kiara Condong No. 154 Bandung</p>
      </div>
    </div>

    <div class="sph-actions">
      <button type="button" class="sph-btn sph-btn-outline" onclick="copyQuotationText()" title="Salin Ringkasan Teks">
        <i class="fa-solid fa-copy"></i> Salin
      </button>
      <button type="button" class="sph-btn sph-btn-whatsapp" onclick="shareQuotationWA()" title="Kirim via WhatsApp">
        <i class="fa-brands fa-whatsapp"></i> Kirim WA
      </button>
      <button type="button" class="sph-btn sph-btn-primary" onclick="printQuotation()" title="Cetak atau Unduh PDF A4">
        <i class="fa-solid fa-print"></i> Cetak / Unduh PDF
      </button>
    </div>
  </header>

  <!-- MOBILE VIEW TOGGLE TABS -->
  <div class="sph-mobile-toggle">
    <button type="button" class="sph-mobile-tab active" id="tabMobileBuilder" onclick="switchMobileTab('builder')">
      <i class="fa-solid fa-sliders"></i> Edit Penawaran
    </button>
    <button type="button" class="sph-mobile-tab" id="tabMobilePreview" onclick="switchMobileTab('preview')">
      <i class="fa-solid fa-file-invoice"></i> Lembar SPH A4
    </button>
  </div>

  <!-- WORKSPACE MAIN -->
  <main class="sph-workspace view-builder">

    <!-- LEFT: FORM BUILDER CARD -->
    <section class="sph-builder-card">
      <div class="sph-card-header">
        <h2><i class="fa-solid fa-pen-ruler"></i> Konfigurasi Penawaran</h2>
        <span class="sph-pill-tag">OFFICIAL QUOTATION</span>
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
            <label class="sph-label">Diskon / Cashback (Rp)</label>
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
          <p style="font-size:12px; color:#64748b; line-height:1.5; margin-bottom:12px;">
            Pembelian tunai mencakup harga unit On The Road (OTR) Bandung, pengurusan STNK, BPKB, dan plat nomor resmi.
          </p>
        </div>

        <div class="sph-form-group">
          <label class="sph-label">Tanda Jadi / Booking Fee Unit (Rp)</label>
          <input type="number" id="sphBookingFeeInput" class="sph-input" value="5000000" oninput="updateSphLive()">
        </div>

        <!-- 4. BONUS & PAKET FASILITAS -->
        <div class="sph-section-title">
          <i class="fa-solid fa-gift"></i> 4. Paket Bonus &amp; Fasilitas Resmi
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
            <input type="checkbox" class="sph-bonus-checkbox" data-label="Layanan Derek Darurat Toyota Emergency Assistance 24 Jam" checked onchange="updateSphLive()">
            <span>Layanan Derek Emergency 24 Jam</span>
          </label>
          <label class="sph-check-item">
            <input type="checkbox" class="sph-bonus-checkbox" data-label="Dashcam DVR Portable &amp; Talang Air Slim Original" onchange="updateSphLive()">
            <span>Dashcam DVR &amp; Talang Air Original</span>
          </label>
          <label class="sph-check-item">
            <input type="checkbox" class="sph-bonus-checkbox" data-label="Voucher Bensin Pertamax Rp 1.000.000" onchange="updateSphLive()">
            <span>Voucher Bensin Pertamax Rp 1.000.000</span>
          </label>
        </div>

      </div>
    </section>

    <!-- RIGHT: LIVE SPH A4 DOCUMENT PREVIEW -->
    <section class="sph-preview-container">
      <div class="sph-paper" id="sphPaperArea">
        <div class="sph-watermark">TUNAS TOYOTA</div>

        <!-- KOP SURAT RESMI DEALER -->
        <header class="sph-letterhead">
          <div class="sph-logo-box">
            <img src="../image/logo_tunas_toyota.png" alt="Tunas Toyota Official Logo">
          </div>
          <div class="sph-dealer-info">
            <h3>PT TUNAS RIDEAN, TBK</h3>
            <div class="sph-dealer-branch">AUTHORIZED TOYOTA MAIN DEALER - CABANG BANDUNG</div>
            <div>Jl. Ibrahim Adjie (Kiaracondong) No. 154, Bandung 40284</div>
            <div>Telp: (022) 731-1555 &bull; Website: salesforcetunassft.com</div>
          </div>
        </header>

        <!-- TITLE BAR -->
        <div class="sph-doc-title-bar">
          <h2>SURAT PENAWARAN HARGA (SPH)</h2>
          <p>Official Vehicle Quotation &amp; Financial Simulation Scheme</p>
        </div>

        <!-- METADATA & RECIPIENT GRID -->
        <div class="sph-meta-grid">
          <div class="sph-meta-box">
            <table class="sph-meta-table">
              <tr>
                <td>Nomor SPH</td>
                <td>:</td>
                <td id="docSphNumber">042/SPH-SLS/TT-KC/IX/2026</td>
              </tr>
              <tr>
                <td>Tanggal Terbit</td>
                <td>:</td>
                <td id="docSphDate">15 September 2026</td>
              </tr>
              <tr>
                <td>Masa Berlaku</td>
                <td>:</td>
                <td id="docSphValidity">22 September 2026 (7 Hari)</td>
              </tr>
              <tr>
                <td>Konsultan Sales</td>
                <td>:</td>
                <td id="docSalesName">Egy Pratama</td>
              </tr>
              <tr>
                <td>Kontak Sales</td>
                <td>:</td>
                <td id="docSalesContact">0812-2154-1540</td>
              </tr>
            </table>
          </div>

          <div class="sph-meta-box">
            <table class="sph-meta-table">
              <tr>
                <td>Kepada Yth.</td>
                <td>:</td>
                <td id="docRecipientName">Bapak/Ibu Calon Konsumen</td>
              </tr>
              <tr>
                <td>No. Telepon/WA</td>
                <td>:</td>
                <td id="docRecipientPhone">-</td>
              </tr>
              <tr>
                <td>Kota Domisili</td>
                <td>:</td>
                <td id="docRecipientCity">Bandung</td>
              </tr>
              <tr>
                <td>Perihal</td>
                <td>:</td>
                <td>Penawaran Unit Baru Toyota 2026</td>
              </tr>
            </table>
          </div>
        </div>

        <p style="margin: 0 0 10px 0; font-size: 11px; color:#334155; line-height: 1.5;">
          Dengan hormat,<br>
          Bersama surat ini, kami dari <strong>PT Tunas Ridean Tbk - Tunas Toyota Kiara Condong</strong> bermaksud menyampaikan penawaran harga spesial untuk unit kendaraan Toyota impian Bapak/Ibu dengan rincian sebagai berikut:
        </p>

        <!-- VEHICLE SHOWCASE BANNER -->
        <div class="sph-vehicle-banner">
          <div class="sph-vehicle-text">
            <h4 id="docUnitModel">Innova Zenix 2.0 V CVT Gasoline</h4>
            <p id="docUnitColor">Warna: Attitude Black Mica &bull; Tahun Perakitan: 2026 (100% Baru OTR Jawa Barat)</p>
          </div>
          <img src="../assets/img/mobil/zenix.webp" alt="Toyota Unit Preview" class="sph-vehicle-img" id="docUnitImg">
        </div>

        <!-- FINANCIAL SPECIFICATION TABLE -->
        <table class="sph-table">
          <thead>
            <tr>
              <th style="width: 32px;" class="text-center">No</th>
              <th>Komponen Rincian Biaya &amp; Finansial</th>
              <th style="width: 190px;" class="text-right">Nominal (Rupiah)</th>
            </tr>
          </thead>
          <tbody id="docFinancialTableBody">
            <!-- Dynamically populated via quotation.js -->
          </tbody>
        </table>

        <p style="font-size: 10px; color: #64748b; margin: -4px 0 12px 0; font-style: italic;" id="docFinancialNotes">
          * Perhitungan kredit bersifat estimasi resmi dan mengikat saat pengajuan disetujui oleh pihak leasing/pembiayaan.
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

        <!-- SIGNATURE AREA -->
        <div class="sph-sign-row">
          <div class="sph-sign-box">
            <div class="sph-sign-title">Diajukan Oleh:</div>
            <div class="sph-sign-name" id="docSignSalesName">Egy Pratama</div>
            <div class="sph-sign-role" id="docSignSalesRole">Senior Sales Consultant</div>
          </div>
          <div class="sph-sign-box">
            <div class="sph-sign-title">Mengetahui:</div>
            <div class="sph-sign-name">Branch Manager / SPV</div>
            <div class="sph-sign-role">Tunas Toyota Kiara Condong</div>
          </div>
          <div class="sph-sign-box">
            <div class="sph-sign-title">Disetujui Oleh Konsumen:</div>
            <div class="sph-sign-name" id="docSignCustomerName">Bpk/Ibu Calon Konsumen</div>
            <div class="sph-sign-role">Nama Terang &amp; Tanggal</div>
          </div>
        </div>

      </div>
    </section>

  </main>

  <!-- JavaScript -->
  <script src="../js/quotation.js?v=20260915_sph_v32"></script>
</body>

</html>
