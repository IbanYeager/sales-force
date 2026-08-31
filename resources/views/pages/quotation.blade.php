<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Digital Quotation - Tunas Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>
  <style>
    .quote-container {
      display: grid;
      grid-template-columns: 1.1fr 1fr;
      gap: 20px;
      align-items: start;
    }
    @media (max-width: 992px) {
      .quote-container { grid-template-columns: 1fr; }
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
      border-color: #c8102e;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.1);
    }
    .quote-paper {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
      position: relative;
    }
    .quote-paper-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px dashed #cbd5e1;
      padding-bottom: 14px;
      margin-bottom: 18px;
    }
    .quote-table-modern {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12.5px;
    }
    .quote-table-modern th {
      background: #f1f5f9;
      color: #334155;
      text-align: left;
      padding: 10px 12px;
      border-bottom: 1px solid #cbd5e1;
      font-weight: 700;
    }
    .quote-table-modern td {
      padding: 10px 12px;
      border-bottom: 1px solid #f1f5f9;
      color: #1e293b;
      font-weight: 600;
    }
    .bonus-chip {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      font-size: 11px;
      font-weight: 700;
      padding: 5px 10px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .action-btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 16px;
    }
  </style>
</head>
<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Smart Digital Quotation</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      <!-- HEADER BANNER -->
      <div style="background: linear-gradient(135deg, #101828 0%, #1e293b 100%); color: white; border-radius: 20px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(16,24,40,0.12);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="background: rgba(200, 16, 46, 0.25); color: #f87171; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Sales Superpower Tool
            </span>
            <h3 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px; color: white;">Smart Digital Quotation Generator</h3>
            <p style="font-size: 12.5px; color: #94a3b8; margin: 0;">Buat Surat Penawaran Harga resmi Tunas Toyota secara instan dan bagikan langsung ke WhatsApp konsumen.</p>
          </div>
          <span style="background: #25D366; color: white; font-weight: 800; font-size: 12px; padding: 6px 14px; border-radius: 12px; display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-brands fa-whatsapp" style="font-size: 16px;"></i> Ready for WA Share
          </span>
        </div>
      </div>

      <!-- MAIN GRID -->
      <div class="quote-container">
        <!-- Left: Form Input Penawaran -->
        <div style="background:#ffffff; border-radius:20px; padding:24px; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(15,23,42,0.04);">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <div style="width:36px; height:36px; border-radius:10px; background:#eff6ff; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:18px;">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Form Rincian Penawaran</h3>
              <p style="font-size:11.5px; color:#64748b; margin:0;">Isi data konsumen &amp; skema kredit di bawah ini</p>
            </div>
          </div>

          <form id="formQuotation" onsubmit="generateQuotation(event)">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Nama Konsumen</label>
                <input type="text" id="qNamaKonsumen" class="styled-input" required value="Bapak/Ibu Calon Konsumen" placeholder="Nama Konsumen">
              </div>
              <div>
                <label class="form-group-label">No. WhatsApp</label>
                <input type="text" id="qNoWa" class="styled-input" placeholder="Cth: 08123456789">
              </div>
            </div>

            <div style="margin-bottom:14px;">
              <label class="form-group-label">Pilih Varian Kendaraan Toyota</label>
              <select id="qModelSelect" class="styled-input" required onchange="updateQuotationCalc()">
                <option value="259800000|All New Avanza 1.5 G M/T">All New Avanza 1.5 G M/T (OTR Rp 259.800.000)</option>
                <option value="315300000|All New Veloz 1.5 Q CVT" selected>All New Veloz 1.5 Q CVT (OTR Rp 315.300.000)</option>
                <option value="430400000|Innova Zenix 2.0 G Gasoline">Innova Zenix 2.0 G Gasoline (OTR Rp 430.400.000)</option>
                <option value="473600000|Innova Zenix 2.0 V HV Hybrid">Innova Zenix 2.0 V HV Hybrid (OTR Rp 473.600.000)</option>
                <option value="617700000|Fortuner 2.8 VRZ 4x2 A/T">Fortuner 2.8 VRZ 4x2 A/T (OTR Rp 617.700.000)</option>
                <option value="440600000|Yaris Cross 1.5 S HV CVT">Yaris Cross 1.5 S HV CVT (OTR Rp 440.600.000)</option>
                <option value="173200000|New Calya 1.2 G M/T">New Calya 1.2 G M/T (OTR Rp 173.200.000)</option>
                <option value="191400000|All New Agya 1.2 G CVT">All New Agya 1.2 G CVT (OTR Rp 191.400.000)</option>
              </select>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Potongan Cashback (Rp)</label>
                <input type="number" id="qDiskon" class="styled-input" value="15000000" min="0" oninput="updateQuotationCalc()">
              </div>
              <div>
                <label class="form-group-label">Uang Muka (DP %)</label>
                <input type="number" id="qDpPersen" class="styled-input" value="20" min="10" max="80" oninput="updateQuotationCalc()">
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
              <div>
                <label class="form-group-label">Tenor Kredit</label>
                <select id="qTenor" class="styled-input" onchange="updateQuotationCalc()">
                  <option value="12">1 Tahun (12 Bulan) - Bunga 0%</option>
                  <option value="24">2 Tahun (24 Bulan)</option>
                  <option value="36">3 Tahun (36 Bulan)</option>
                  <option value="48">4 Tahun (48 Bulan)</option>
                  <option value="60" selected>5 Tahun (60 Bulan)</option>
                  <option value="72">6 Tahun (72 Bulan)</option>
                </select>
              </div>
              <div>
                <label class="form-group-label">Leasing Rekanan</label>
                <select id="qLeasing" class="styled-input" onchange="updateQuotationCalc()">
                  <option value="ACC (Astra Credit Companies)" selected>ACC (Astra Credit Companies)</option>
                  <option value="TAF (Toyota Astra Finance)">TAF (Toyota Astra Finance)</option>
                  <option value="MTF (Mandiri Tunas Finance)">MTF (Mandiri Tunas Finance)</option>
                  <option value="BCA Finance">BCA Finance</option>
                </select>
              </div>
            </div>

            <div style="margin-bottom:18px;">
              <label class="form-group-label">Bonus &amp; Aksesoris Inklusi</label>
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:12px; background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e2e8f0;">
                <label style="display:flex; align-items:center; gap:6px; font-weight:700; color:#334155;"><input type="checkbox" id="chkVkool" checked onchange="updateQuotationCalc()"> Kaca Film V-Kool / 3M</label>
                <label style="display:flex; align-items:center; gap:6px; font-weight:700; color:#334155;"><input type="checkbox" id="chkService" checked onchange="updateQuotationCalc()"> Free Service 4 Thn / 50k KM</label>
                <label style="display:flex; align-items:center; gap:6px; font-weight:700; color:#334155;"><input type="checkbox" id="chkKarpet" checked onchange="updateQuotationCalc()"> Karpet Dasar Original</label>
                <label style="display:flex; align-items:center; gap:6px; font-weight:700; color:#334155;"><input type="checkbox" id="chkVoucher" checked onchange="updateQuotationCalc()"> Voucher BBM Rp 1 Juta</label>
              </div>
            </div>

            <button type="button" class="btn" style="width:100%; background: linear-gradient(135deg, #c8102e 0%, #99001c 100%); color:white; font-weight:800; font-size:13.5px; padding:12px; border-radius:12px; border:none; cursor:pointer;" onclick="updateQuotationCalc()">
              <i class="fa-solid fa-arrows-rotate"></i> Hitung Ulang Surat Penawaran
            </button>
          </form>
        </div>

        <!-- Right: Live Preview Paper -->
        <div>
          <div class="quote-paper" id="quotePreviewArea">
            <div class="quote-paper-header">
              <div>
                <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" alt="Tunas Toyota" style="height:36px; object-fit:contain;" onerror="this.onerror=null; this.src='../image/logo_tunas_toyota.png'; this.style.filter='brightness(0)';">
                <div style="font-size:10px; font-weight:800; color:#c8102e; margin-top:4px; letter-spacing:0.5px;">TUNAS TOYOTA KIARA CONDONG - BANDUNG</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:14px; font-weight:900; color:#0f172a; text-transform:uppercase;">Surat Penawaran Harga</div>
                <div style="font-size:11px; color:#64748b; margin-top:2px;" id="lblQuoteNo">No: QUOTE/202608/008</div>
                <div style="font-size:11px; color:#64748b;" id="lblQuoteDate">Tanggal: 12 Agustus 2026</div>
              </div>
            </div>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 14px; margin-bottom:14px; font-size:12px;">
              <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px;">
                <span>Kepada Yth: <strong id="previewNamaKonsumen" style="color:#0f172a;">Bapak/Ibu Calon Konsumen</strong></span>
                <span id="previewNoWa" style="color:#0284c7; font-weight:700;">WA: -</span>
              </div>
              <div style="color:#64748b; margin-top:4px; font-size:11px;">Bersama surat ini kami sampaikan rincian penawaran harga spesial unit resmi Toyota:</div>
            </div>

            <table class="quote-table-modern">
              <thead>
                <tr>
                  <th>Deskripsi Kendaraan &amp; Skema</th>
                  <th style="text-align:right;">Rincian Nilai</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Model / Tipe Kendaraan</td>
                  <td style="text-align:right;" id="previewModel">All New Veloz 1.5 Q CVT</td>
                </tr>
                <tr>
                  <td>Harga OTR Resmi (Bandung)</td>
                  <td style="text-align:right;" id="previewOtr">Rp 315.300.000</td>
                </tr>
                <tr>
                  <td>Potongan Cashback / Diskon Dealer</td>
                  <td style="text-align:right; color:#c8102e; font-weight:700;" id="previewDiskon">- Rp 15.000.000</td>
                </tr>
                <tr>
                  <td>Harga Netto Setelah Diskon</td>
                  <td style="text-align:right; font-weight:800;" id="previewHargaNett">Rp 300.300.000</td>
                </tr>
                <tr>
                  <td>Uang Muka Bayar (DP Nett)</td>
                  <td style="text-align:right; color:#0284c7; font-weight:800;" id="previewDpNett">Rp 60.060.000</td>
                </tr>
                <tr>
                  <td>Angsuran per Bulan (<span id="previewTenor">60</span>x / <span id="previewLeasing">ACC</span>)</td>
                  <td style="text-align:right; color:#16a34a; font-weight:900; font-size:14.5px;" id="previewAngsuran">Rp 5.105.100 /bln</td>
                </tr>
              </tbody>
            </table>

            <div style="margin-top:12px;">
              <div style="font-size:11px; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:6px;">Bonus Included:</div>
              <div style="display:flex; flex-wrap:wrap; gap:6px;" id="previewBonusList">
                <span class="bonus-chip"><i class="fa-solid fa-check-circle" style="color:#2563eb;"></i> Kaca Film V-Kool</span>
                <span class="bonus-chip"><i class="fa-solid fa-check-circle" style="color:#2563eb;"></i> Free Service 4 Thn</span>
                <span class="bonus-chip"><i class="fa-solid fa-check-circle" style="color:#2563eb;"></i> Karpet Dasar</span>
                <span class="bonus-chip"><i class="fa-solid fa-check-circle" style="color:#2563eb;"></i> Voucher BBM Rp 1 Jt</span>
              </div>
            </div>

            <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:14px; padding:14px; margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
              <div>
                <div style="font-size:10.5px; font-weight:800; color:#9f1239; text-transform:uppercase;">ESTIMASI UANG MUKA NETT (TOTAL DP)</div>
                <div style="font-size:20px; font-weight:900; color:#c8102e; margin-top:2px;" id="previewTotalDpBottom">Rp 60.060.000</div>
              </div>
              <div style="text-align:right;">
                <div style="font-size:11px; color:#64748b;">Sales Consultant:</div>
                <div style="font-size:12.5px; font-weight:800; color:#0f172a;" id="previewSalesName">Egy (Sales Consultant)</div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-btn-group">
            <button class="btn" style="background:#25D366; color:white; font-weight:800; font-size:13px; padding:12px; border-radius:12px; border:none; cursor:pointer; box-shadow: 0 4px 14px rgba(37,211,102,0.3);" onclick="shareQuotationWA()">
              <i class="fa-brands fa-whatsapp" style="font-size:16px; margin-right:6px;"></i> Kirim ke WA
            </button>
            <button class="btn" style="background:#0284c7; color:white; font-weight:800; font-size:13px; padding:12px; border-radius:12px; border:none; cursor:pointer; box-shadow: 0 4px 14px rgba(2,132,199,0.3);" onclick="window.print()">
              <i class="fa-solid fa-print" style="margin-right:6px;"></i> Cetak PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="../js/sales_signature.js"></script>
  <script src="../js/quotation.js"></script>
</body>
</html>
