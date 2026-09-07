<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pusat Layanan Trade-In &amp; Mobil Bekas - Tunas Toyota Kiara Condong</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css">
  <link rel="stylesheet" href="../css/olx.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    /* ── TOP SEGMENTED TAB BAR ── */
    .trade-main-tabs {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      padding: 6px;
      border-radius: 16px;
      border: 1.5px solid #e2e8f0;
      display: flex;
      gap: 6px;
      margin-bottom: 20px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.04);
      position: sticky;
      top: 65px;
      z-index: 99;
      overflow-x: auto;
    }
    .trade-main-btn {
      flex: 1;
      padding: 10px 14px;
      border: none;
      background: transparent;
      color: #64748b;
      font-size: 12.5px;
      font-weight: 700;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      white-space: nowrap;
    }
    .trade-main-btn.active {
      background: linear-gradient(135deg, #78350f 0%, #d97706 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.25);
    }

    /* ── STYLED CONTAINERS ── */
    .trade-container {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 20px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .trade-container { grid-template-columns: 1fr; }
    }
    .form-group-label {
      font-size: 11.5px;
      font-weight: 700;
      color: #475569;
      display: block;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .styled-input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s ease;
    }
    .styled-input:focus {
      border-color: #d97706;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.15);
    }
    .val-card {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(15,23,42,0.15);
    }
    .trade-sub-tab-bar {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 14px;
      gap: 4px;
      margin-bottom: 20px;
    }
    .trade-sub-tab-btn {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .trade-sub-tab-btn.active {
      background: #ffffff;
      color: #d97706;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    /* ── INSPECTION & SCHEDULE CARDS ── */
    .sched-card-item {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
      transition: all 0.2s ease;
    }
    .sched-card-item:hover {
      border-color: #d97706;
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(217,119,6,0.1);
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px; padding-bottom: 70px;">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Pusat Layanan Trade-In &amp; Mobil Bekas</h2>
    </header>

    <div class="container" style="margin-top: 15px; max-width: 100%;">
      
      <!-- ═══ TOP TAB NAVIGATION ═══ -->
      <div class="trade-main-tabs">
        <button type="button" class="trade-main-btn active" id="btnMainTaksiran" onclick="switchTradeMainTab('taksiran')">
          <i class="fa-solid fa-calculator"></i> Taksiran &amp; Over-Kredit
        </button>
        <button type="button" class="trade-main-btn" id="btnMainJadwal" onclick="switchTradeMainTab('jadwal')">
          <i class="fa-solid fa-calendar-check"></i> Jadwal Janji Temu
        </button>
        <button type="button" class="trade-main-btn" id="btnMainInspeksi" onclick="switchTradeMainTab('inspeksi')">
          <i class="fa-solid fa-clipboard-check"></i> Checklist Inspeksi Fisik
        </button>
        <button type="button" class="trade-main-btn" id="btnMainOlx" onclick="switchTradeMainTab('olx')">
          <i class="fa-solid fa-tags"></i> Riset Pasar &amp; OLX
        </button>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════════
           TAB 1: KALKULATOR TAKSIRAN & OVER KREDIT
      ══════════════════════════════════════════════════════════════════════════════ -->
      <div id="sectionTaksiran">
        <!-- HEADER BANNER -->
        <div style="background: linear-gradient(135deg, #78350f 0%, #d97706 100%); color: white; border-radius: 20px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(217,119,6,0.15);">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
            <div>
              <span style="background: rgba(255, 255, 255, 0.2); color: #fef08a; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
                <i class="fa-solid fa-hand-holding-dollar"></i> Smart Trade-In Estimator
              </span>
              <h3 style="font-family:'Outfit',sans-serif; font-size: 20px; font-weight: 900; margin: 8px 0 2px; color:white;">Kalkulator Tukar Tambah &amp; Pelunasan Dipercepat</h3>
              <p style="font-size: 12.5px; color: #fef3c7; margin: 0;">Hitung nilai pasar mobil lama konsumen, estimasi sisa hutang leasing, dan kebutuhan DP unit Toyota baru.</p>
            </div>
          </div>
        </div>

        <!-- Sub Tabs (Tukar Tambah vs Pelunasan Dipercepat) -->
        <div class="trade-sub-tab-bar">
          <button type="button" class="trade-sub-tab-btn active" id="tabTradeIn" onclick="switchSubTradeTab('tradein')">
            <i class="fa-solid fa-arrows-rotate"></i> Tukar Tambah Normal
          </button>
          <button type="button" class="trade-sub-tab-btn" id="tabEarlySettlement" onclick="switchSubTradeTab('early')">
            <i class="fa-solid fa-receipt"></i> Masih Ada Sisa Cicilan (Over Kredit)
          </button>
        </div>

        <!-- Grid Container Form & Result -->
        <div class="trade-container">
          <!-- Left: Input Mobil Lama & Baru -->
          <div class="card" style="padding: 22px; border-radius: 20px;">
            <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px;">
              <div style="width:32px; height:32px; border-radius:8px; background:#fef3c7; color:#d97706; display:flex; align-items:center; justify-content:center; font-size:15px;">
                <i class="fa-solid fa-car-side"></i>
              </div>
              <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Data Mobil Lama Konsumen</h4>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Merek Mobil Lama</label>
                <select id="trMerk" class="styled-input" onchange="calcTradeInValuation()">
                  <option value="toyota" selected>Toyota</option>
                  <option value="daihatsu">Daihatsu</option>
                  <option value="honda">Honda</option>
                  <option value="mitsubishi">Mitsubishi</option>
                  <option value="suzuki">Suzuki</option>
                  <option value="lainnya">Merek Lain</option>
                </select>
              </div>
              <div>
                <label class="form-group-label">Model &amp; Varian</label>
                <input type="text" id="trModel" class="styled-input" value="Avanza 1.3 G M/T" placeholder="Cth: Jazz / Brio / Xenia" oninput="calcTradeInValuation()">
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Tahun Pembuatan</label>
                <input type="number" id="trTahun" class="styled-input" value="2018" min="2005" max="2026" oninput="calcTradeInValuation()">
              </div>
              <div>
                <label class="form-group-label">Kondisi Mesin &amp; Body</label>
                <select id="trKondisi" class="styled-input" onchange="calcTradeInValuation()">
                  <option value="1.0">Istimewa (Mulus, Servis Rutin)</option>
                  <option value="0.95" selected>Bagus / Pemakaian Wajar</option>
                  <option value="0.88">Perlu Perbaikan Cat/Mesin</option>
                </select>
              </div>
            </div>

            <!-- EARLY SETTLEMENT SPECIFIC FIELDS -->
            <div id="boxEarlySettlement" style="display:none; background:#fffbeb; border:1px solid #fef3c7; border-radius:14px; padding:16px; margin-bottom:14px;">
              <h4 style="font-size:13px; font-weight:800; color:#b45309; margin:0 0 10px; display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-receipt"></i> Data Sisa Kredit Mobil Lama
              </h4>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:10px;">
                <div>
                  <label class="form-group-label">Sisa Angsuran (Bulan)</label>
                  <input type="number" id="trSisaBulan" class="styled-input" value="18" min="1" max="72" oninput="calcTradeInValuation()">
                </div>
                <div>
                  <label class="form-group-label">Angsuran / Bulan (Rp)</label>
                  <input type="number" id="trAngsuranLama" class="styled-input" value="3850000" min="0" oninput="calcTradeInValuation()">
                </div>
              </div>
              <div>
                <label class="form-group-label">Penalti / Administrasi Pelunasan (%)</label>
                <select id="trPenaltiPct" class="styled-input" onchange="calcTradeInValuation()">
                  <option value="0.02" selected>2% (Standar Penalti Leasing)</option>
                  <option value="0.03">3%</option>
                  <option value="0.01">1%</option>
                  <option value="0.00">0% (Tanpa Penalti)</option>
                </select>
              </div>
            </div>

            <hr style="border:none; border-top:1px dashed #cbd5e1; margin:18px 0;">

            <div style="display:flex; align-items:center; gap:10px; margin-bottom:14px;">
              <div style="width:30px; height:30px; border-radius:8px; background:#eff6ff; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:14px;">
                <i class="fa-solid fa-cart-shopping"></i>
              </div>
              <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:0;">Unit Toyota Baru Target</h4>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-group-label">Pilih Unit Toyota Baru</label>
              <select id="trTargetModel" class="styled-input" onchange="calcTradeInValuation()">
                <option value="315300000|All New Veloz 1.5 Q CVT" selected>All New Veloz 1.5 Q CVT (OTR Rp 315.300.000)</option>
                <option value="473600000|Innova Zenix 2.0 V HV Hybrid">Innova Zenix 2.0 V HV Hybrid (OTR Rp 473.600.000)</option>
                <option value="259800000|All New Avanza 1.5 G M/T">All New Avanza 1.5 G M/T (OTR Rp 259.800.000)</option>
                <option value="617700000|Fortuner 2.8 VRZ 4x2 A/T">Fortuner 2.8 VRZ 4x2 A/T (OTR Rp 617.700.000)</option>
                <option value="440600000|Yaris Cross 1.5 S HV CVT">Yaris Cross 1.5 S HV CVT (OTR Rp 440.600.000)</option>
                <option value="198000000|Hilux Rangga Cab Flat">Hilux Rangga Cab Flat (OTR Rp 198.000.000)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
              <div>
                <label class="form-group-label">Target DP Unit Baru (%)</label>
                <input type="number" id="trDpTargetPct" class="styled-input" value="20" min="10" max="80" oninput="calcTradeInValuation()">
              </div>
              <div>
                <label class="form-group-label">Subsidi Trade-In Tunas (Rp)</label>
                <input type="number" id="trSubsidiTradeIn" class="styled-input" value="3000000" min="0" oninput="calcTradeInValuation()">
              </div>
            </div>
          </div>

          <!-- Right: Valuation Result Card -->
          <div>
            <div class="val-card">
              <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.15); padding-bottom:14px; margin-bottom:16px;">
                <span style="font-size:10.5px; font-weight:800; background:rgba(255,255,255,0.15); color:#fde047; padding:4px 10px; border-radius:20px; text-transform:uppercase;">Estimasi Appraisal Instant</span>
                <span style="font-size:11px; color:#cbd5e1;">Tunas Toyota Trade-In Center</span>
              </div>

              <div style="font-size:12px; color:#94a3b8;">Estimasi Harga Pasar Mobil Lama:</div>
              <div style="font-size:26px; font-weight:900; color:#facc15; margin-top:2px;" id="lblMobilLamaHarga">Rp 145.000.000</div>
              <div style="font-size:11.5px; color:#38bdf8; margin-top:2px;" id="lblMobilLamaDesc">Avanza 1.3 G M/T (Tahun 2018)</div>

              <div style="margin-top:20px; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); border-radius:14px; padding:16px;">
                <div id="rowPelunasanLama" style="display:none; justify-content:space-between; font-size:12.5px; margin-bottom:6px; color:#fca5a5;">
                  <span>Estimasi Pelunasan Hutang Lama:</span>
                  <strong id="lblHutangPelunasan">- Rp 0</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
                  <span style="color:#cbd5e1;">Total Kebutuhan DP Unit Baru:</span>
                  <strong style="color:white;" id="lblDpBaruDibutuhkan">Rp 63.060.000</strong>
                </div>
                <div style="display:flex; justify-content:space-between; font-size:12.5px; margin-bottom:6px;">
                  <span style="color:#cbd5e1;">Nilai Bersih Mobil Lama + Subsidi:</span>
                  <strong style="color:#4ade80;" id="lblTotalValuationWithSubsidi">Rp 148.000.000</strong>
                </div>
                <hr style="border:none; border-top:1px solid rgba(255,255,255,0.15); margin:10px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                  <span style="font-size:11.5px; font-weight:800; color:#f87171;" id="lblSummaryTitle">SISA DANA DITERIMA KONSUMEN:</span>
                  <span style="font-size:20px; font-weight:900; color:#4ade80;" id="lblSisaDanaVal">Rp 84.940.000</span>
                </div>
              </div>

              <p style="font-size:11px; color:#94a3b8; margin-top:16px; line-height:1.4;" id="lblTradeInFootnote">
                💡 *Catatan: Nilai mobil lama otomatis menutup 100% DP unit Toyota baru. Sisa dana tunai langsung ditransfer ke rekening konsumen atau dipotongkan ke angsuran.
              </p>
            </div>

            <div style="margin-top:16px;">
              <button class="btn" style="width:100%; background:#25D366; color:white; font-weight:800; font-size:13.5px; padding:14px; border-radius:12px; border:none; cursor:pointer; box-shadow:0 4px 14px rgba(37,211,102,0.3);" onclick="shareTradeInWA()">
                <i class="fa-brands fa-whatsapp" style="font-size:17px; margin-right:6px;"></i> Kirim Simulasi Trade-In ke WA Konsumen
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════════
           TAB 2: JADWAL JANJI TEMU INSPEKSI SHOWROOM
      ══════════════════════════════════════════════════════════════════════════════ -->
      <div id="sectionJadwal" style="display:none;">
        <div class="card" style="padding: 22px; border-radius: 20px; margin-bottom: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
            <div>
              <h3 style="font-size:16px; font-weight:800; margin:0; color:#0f172a;">Jadwal Janji Temu Inspeksi Mobil</h3>
              <p style="font-size:12px; color:#64748b; margin:2px 0 0;">Daftar janji temu inspeksi langsung di Showroom Tunas Kiara Condong / Kunjungan ke Rumah Konsumen</p>
            </div>
          </div>

          <div id="jadwalListContainer">
            <div class="sched-card-item">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <span style="background:#fef3c7; color:#b45309; padding:4px 10px; border-radius:8px; font-size:11px; font-weight:800;">
                  <i class="fa-solid fa-clock"></i> Pukul 10:00 WIB
                </span>
                <span style="font-size:11.5px; color:#64748b; font-weight:700;">Hari Ini</span>
              </div>
              <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin:0 0 4px;">Bpk. Ridwan Fauzi &mdash; Honda HR-V E CVT 2020</h4>
              <p style="font-size:12px; color:#64748b; margin:0 0 10px;">Rencana Tukar Tambah ke: <strong>Innova Zenix V Hybrid</strong></p>
              <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <a href="https://wa.me/628123456789" target="_blank" style="text-decoration:none; background:#25D366; color:white; font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px;">
                  <i class="fa-brands fa-whatsapp"></i> Hubungi Konsumen
                </a>
                <button type="button" onclick="switchTradeMainTab('inspeksi')" style="background:#0d1b3e; color:white; font-size:12px; font-weight:700; padding:6px 12px; border-radius:8px; border:none; cursor:pointer;">
                  <i class="fa-solid fa-clipboard-check"></i> Buka Lembar Inspeksi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════════
           TAB 3: CHECKLIST INSPEKSI FISIK MOBIL (150-POINT INSPECTION)
      ══════════════════════════════════════════════════════════════════════════════ -->
      <div id="sectionInspeksi" style="display:none;">
        <div class="card" style="padding: 22px; border-radius: 20px;">
          <h3 style="font-size:16px; font-weight:800; margin:0 0 16px; color:#0f172a; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
            <i class="fa-solid fa-clipboard-check" style="color:#d97706; margin-right:8px;"></i> Formulir Checklist Inspeksi Fisik Mobil Bekas
          </h3>

          <form id="formInspeksiFisik" onsubmit="event.preventDefault(); alert('Hasil checklist inspeksi berhasil disimpan ke database appraisal!');">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Nomor Polisi (Plat Mobil)</label>
                <input type="text" class="styled-input" placeholder="Contoh: D 1234 ABC" required>
              </div>
              <div>
                <label class="form-group-label">Kilometer (Odometer)</label>
                <input type="number" class="styled-input" placeholder="Contoh: 45000" required>
              </div>
            </div>

            <!-- Bagian 1: Kondisi Eksterior & Rangka -->
            <div style="margin-bottom:16px; background:#f8fafc; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
              <div style="font-size:12.5px; font-weight:800; color:#0f172a; margin-bottom:8px;">1. Struktur Rangka &amp; Cat Eksterior</div>
              <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; color:#475569;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Bebas dari bekas tabrakan frontal / pilar rangka utuh
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Tidak ada indikasi karat parah atau bekas terendam banjir
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox"> Cat full orisinil pabrik (tanpa dempul tebal)
                </label>
              </div>
            </div>

            <!-- Bagian 2: Mesin & Kaki-kaki -->
            <div style="margin-bottom:16px; background:#f8fafc; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
              <div style="font-size:12.5px; font-weight:800; color:#0f172a; margin-bottom:8px;">2. Ruang Mesin &amp; Transmisi</div>
              <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; color:#475569;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Mesin kering tanpa rembesan oli kepala silinder
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Suara mesin halus &amp; perpindahan transmisi responsif
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> AC dingin normal &amp; kelistrikan elektrik berfungsi baik
                </label>
              </div>
            </div>

            <!-- Bagian 3: Dokumen -->
            <div style="margin-bottom:20px; background:#f8fafc; padding:14px; border-radius:12px; border:1px solid #e2e8f0;">
              <div style="font-size:12.5px; font-weight:800; color:#0f172a; margin-bottom:8px;">3. Kelengkapan Surat &amp; Dokumen</div>
              <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; color:#475569;">
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> BPKB asli, Faktur, &amp; NIK lengkap tersedia
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Pajak STNK aktif (bukan plat mati)
                </label>
                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                  <input type="checkbox" checked> Buku servis &amp; kunci cadangan lengkap
                </label>
              </div>
            </div>

            <button type="submit" class="btn" style="width:100%; background:linear-gradient(135deg, #78350f, #d97706); color:white; font-weight:800; font-size:13.5px; padding:14px; border-radius:12px; border:none; cursor:pointer;">
              <i class="fa-solid fa-save" style="margin-right:8px;"></i> Simpan Lembar Hasil Inspeksi Unit
            </button>
          </form>
        </div>
      </div>

      <!-- ══════════════════════════════════════════════════════════════════════════════
           TAB 4: RISET PASAR & LISTING OLX
      ══════════════════════════════════════════════════════════════════════════════ -->
      <div id="sectionOlx" style="display:none;">
        <div class="card" style="padding: 22px; border-radius: 20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:16px;">
            <div>
              <h3 style="font-size:16px; font-weight:800; margin:0; color:#0f172a;">Riset Harga Pasar &amp; Listing OLX</h3>
              <p style="font-size:12px; color:#64748b; margin:2px 0 0;">Cek kisaran harga pasar aktual mobil bekas di wilayah Bandung untuk memastikan taksiran trade-in kompetitif.</p>
            </div>
            <a href="https://www.olx.co.id/bandung-kota_g4000018/mobil-bekas_c198" target="_blank" style="text-decoration:none; background:#002f34; color:#23e5db; font-size:12px; font-weight:800; padding:8px 14px; border-radius:10px; display:inline-flex; align-items:center; gap:6px;">
              <span>Buka Portal OLX</span> <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap:14px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px;">
              <div style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Toyota Avanza 2018 - 2021</div>
              <div style="font-size:18px; font-weight:900; color:#0f172a; margin:4px 0;">Rp 140 Jt - Rp 175 Jt</div>
              <div style="font-size:11.5px; color:#16a34a; font-weight:700;">Permintaan Pasar Sangat Cepat (Fast Moving)</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px;">
              <div style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Innova Reborn Diesel 2017 - 2021</div>
              <div style="font-size:18px; font-weight:900; color:#0f172a; margin:4px 0;">Rp 275 Jt - Rp 340 Jt</div>
              <div style="font-size:11.5px; color:#16a34a; font-weight:700;">Harga Bertahan Sangat Stabil</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px;">
              <div style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase;">Honda Brio Satya 2019 - 2022</div>
              <div style="font-size:18px; font-weight:900; color:#0f172a; margin:4px 0;">Rp 125 Jt - Rp 155 Jt</div>
              <div style="font-size:11.5px; color:#0284c7; font-weight:700;">Target Trade-In ke New Calya / Agya</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script src="../js/sales_signature.js"></script>
  <script src="../js/tradein.js"></script>

  <script>
    function switchTradeMainTab(tabId) {
      document.querySelectorAll('.trade-main-btn').forEach(btn => btn.classList.remove('active'));
      document.getElementById('sectionTaksiran').style.display = 'none';
      document.getElementById('sectionJadwal').style.display = 'none';
      document.getElementById('sectionInspeksi').style.display = 'none';
      document.getElementById('sectionOlx').style.display = 'none';

      if (tabId === 'jadwal') {
        document.getElementById('btnMainJadwal').classList.add('active');
        document.getElementById('sectionJadwal').style.display = 'block';
      } else if (tabId === 'inspeksi') {
        document.getElementById('btnMainInspeksi').classList.add('active');
        document.getElementById('sectionInspeksi').style.display = 'block';
      } else if (tabId === 'olx') {
        document.getElementById('btnMainOlx').classList.add('active');
        document.getElementById('sectionOlx').style.display = 'block';
      } else {
        document.getElementById('btnMainTaksiran').classList.add('active');
        document.getElementById('sectionTaksiran').style.display = 'block';
        if (typeof calcTradeInValuation === 'function') calcTradeInValuation();
      }
    }

    function switchSubTradeTab(mode) {
      document.querySelectorAll('.trade-sub-tab-btn').forEach(b => b.classList.remove('active'));
      const boxEarly = document.getElementById('boxEarlySettlement');
      const rowPelunasan = document.getElementById('rowPelunasanLama');

      if (mode === 'early') {
        document.getElementById('tabEarlySettlement').classList.add('active');
        if (boxEarly) boxEarly.style.display = 'block';
        if (rowPelunasan) rowPelunasan.style.display = 'flex';
      } else {
        document.getElementById('tabTradeIn').classList.add('active');
        if (boxEarly) boxEarly.style.display = 'none';
        if (rowPelunasan) rowPelunasan.style.display = 'none';
      }
      if (typeof calcTradeInValuation === 'function') calcTradeInValuation();
    }

    window.addEventListener('DOMContentLoaded', () => {
      const urlParams = new URLSearchParams(window.location.search);
      const reqTab = urlParams.get('tab');
      if (reqTab) {
        switchTradeMainTab(reqTab);
      }
    });
  </script>
</body>
</html>
