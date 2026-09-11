<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Finansial & Smart Quotation Hub</title>
    <meta name="description" content="Kalkulator cicilan, generator surat penawaran resmi (Quotation PDF), dan matriks perbandingan leasing Toyota Tunas Kiara Condong.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/kalkulator.css">
    <script src="../js/sidebar_desktop.js?v=20260911_polreg_sync"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">

    <style>
        :root {
            --toyota-red: #c8102e;
            --toyota-red-dark: #990e24;
            --toyota-navy: #0d1b3e;
            --surface: #ffffff;
            --border: #e2e8f0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
        }

        /* ── SEGMENTED TOP TAB BAR ── */
        .finance-tab-wrapper {
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
        }

        .finance-tab-btn {
            flex: 1;
            padding: 10px 12px;
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

        .finance-tab-btn i {
            font-size: 14px;
        }

        .finance-tab-btn.active {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(13, 27, 62, 0.25);
        }

        /* ── QUOTATION STYLES ── */
        .quote-container {
            display: grid;
            grid-template-columns: 1.1fr 1fr;
            gap: 20px;
            align-items: start;
        }
        @media (max-width: 992px) {
            .quote-container { grid-template-columns: 1fr; }
            .finance-tab-wrapper { overflow-x: auto; }
            .finance-tab-btn { font-size: 11.5px; padding: 8px 10px; }
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
            margin-bottom: 12px;
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

        /* ── LEASING MATRIX STYLES ── */
        .matrix-grid {
            display: grid;
            grid-template-columns: 1.15fr 1fr;
            gap: 20px;
            align-items: start;
        }
        @media (max-width: 950px) {
            .matrix-grid { grid-template-columns: 1fr; }
        }

        .styled-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 22px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
            margin-bottom: 20px;
        }

        .leasing-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12.5px;
            margin-top: 14px;
        }
        .leasing-table th {
            background: #f1f5f9;
            color: #475569;
            font-weight: 800;
            text-transform: uppercase;
            font-size: 11px;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            text-align: left;
        }
        .leasing-table td {
            padding: 12px;
            border: 1px solid #e2e8f0;
            color: #1e293b;
        }
        .leasing-table tr:hover { background: #f8fafc; }

        .badge-partner {
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            display: inline-block;
        }
        .badge-taf { background: #fee2e2; color: #b91c1c; }
        .badge-acc { background: #dbeafe; color: #1e40af; }
        .badge-bca { background: #dcfce7; color: #15803d; }
        .badge-mtf { background: #fef3c7; color: #b45309; }
        .badge-maybank { background: #fae8ff; color: #86198f; }

        .odds-meter-box {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: white;
            border-radius: 20px;
            padding: 22px;
            text-align: center;
            margin-top: 18px;
            box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
        }
        .odds-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            border: 6px solid #10b981;
            margin: 12px auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(16, 185, 129, 0.1);
            box-shadow: 0 0 25px rgba(16, 185, 129, 0.25);
        }
        .odds-number {
            font-family: 'Outfit', sans-serif;
            font-size: 32px;
            font-weight: 900;
            color: #34d399;
            line-height: 1;
        }
        .odds-label {
            font-size: 11px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
        }
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 1200px;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Finansial &amp; Quotation Hub</h2>
        </header>

        <div class="container" style="margin-top: 15px;">

            <!-- ═══ SEGMENTED NAVIGATION TABS ═══ -->
            <div class="finance-tab-wrapper">
                <button type="button" class="finance-tab-btn active" id="btnTabKalkulator" onclick="switchFinanceTab('kalkulator')">
                    <i class="fa-solid fa-calculator"></i> Kalkulator Cicilan
                </button>
                <button type="button" class="finance-tab-btn" id="btnTabQuotation" onclick="switchFinanceTab('quotation')">
                    <i class="fa-solid fa-file-invoice-dollar"></i> Smart Quotation (PDF)
                </button>
                <button type="button" class="finance-tab-btn" id="btnTabLeasing" onclick="switchFinanceTab('leasing')">
                    <i class="fa-solid fa-scale-balanced"></i> Matriks Leasing &amp; Odds
                </button>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 1: KALKULATOR CICILAN CEPAT
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionKalkulator">
                <!-- Result card -->
                <div class="result-card" id="resultCard">
                    <div class="result-label">Estimasi Cicilan / Bulan</div>
                    <div class="result-amount" id="resultAmount">Rp 0</div>
                    <div class="result-period" id="resultPeriod">— bulan</div>
                    <div class="result-rate-badge" id="resultRateBadge">
                        <i class="fa-solid fa-percent"></i>
                        <span id="resultRateText">—</span>
                    </div>
                    <div class="result-divider"></div>
                    <div class="result-breakdown">
                        <div class="breakdown-item">
                            <div class="breakdown-label">Harga OTR</div>
                            <div class="breakdown-value" id="brkHarga">Rp 0</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">TDP</div>
                            <div class="breakdown-value" id="brkTdp">Rp 0</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">Pokok Pinjaman</div>
                            <div class="breakdown-value" id="brkPokok">Rp 0</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">Total Bunga</div>
                            <div class="breakdown-value" id="brkBunga">Rp 0</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">Total Bayar</div>
                            <div class="breakdown-value" id="brkTotal">Rp 0</div>
                        </div>
                        <div class="breakdown-item">
                            <div class="breakdown-label">Metode</div>
                            <div class="breakdown-value" id="brkMetode">Flat</div>
                        </div>
                    </div>

                    <div id="printExtraDetails" style="display:none; margin-top:20px;">
                        <div style="font-size:12px; font-weight:700; margin-bottom:8px;">Detail Pembiayaan:</div>
                        <div class="result-breakdown">
                            <div class="breakdown-item">
                                <div class="breakdown-label">Leasing</div>
                                <div class="breakdown-value" id="brkLeasing">-</div>
                            </div>
                            <div class="breakdown-item">
                                <div class="breakdown-label">Biaya Admin</div>
                                <div class="breakdown-value" id="brkAdmin">-</div>
                            </div>
                            <div class="breakdown-item">
                                <div class="breakdown-label">Asuransi</div>
                                <div class="breakdown-value" id="brkAsuransi">-</div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                        <!-- ACTION TERPADU: TRANSFER KE QUOTATION PDF -->
                        <button type="button" onclick="transferToQuotation()" style="width:100%; background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%); color:white; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 13.5px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow: 0 4px 15px rgba(13,27,62,0.25);">
                            <i class="fa-solid fa-file-invoice-dollar" style="color:#fbbf24; font-size:16px;"></i>
                            <span>Terbitkan Surat Penawaran Resmi (Quotation PDF)</span>
                            <i class="fa-solid fa-arrow-right" style="font-size:12px; opacity:0.8;"></i>
                        </button>

                        <div style="display:flex; gap:10px;">
                            <button class="btn-print" onclick="window.print()" style="flex:1;">
                                <i class="fa-solid fa-print"></i> Cetak Lembar Cicilan
                            </button>
                            <button class="btn-outline" onclick="addToCompare()" style="flex:1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; color: var(--primary-blue); border: 1px solid var(--primary-blue); background: transparent;">
                                <i class="fa-solid fa-code-compare"></i> Bandingkan Paket
                            </button>
                        </div>
                        <button class="btn-wa" onclick="shareToWhatsApp()" style="width:100%; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; color: white; border: none; background: #25D366; cursor: pointer;">
                            <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Bagikan Ringkasan ke WA
                        </button>
                    </div>
                </div>

                <!-- Comparison Container -->
                <div id="comparisonContainer" style="display:none; margin-bottom: 24px; padding: 16px; background: white; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="font-size:14px; margin:0; font-weight:800; color:var(--text-dark);"><i class="fa-solid fa-code-compare" style="color:var(--primary-blue); margin-right:6px;"></i>Komparasi Paket</h3>
                        <button onclick="clearCompare()" style="background:none; border:none; color:var(--primary-red); font-size:11px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-trash"></i> Hapus</button>
                    </div>
                    <div id="comparisonList" style="display:flex; gap:12px; overflow-x:auto; padding-bottom:8px;"></div>
                </div>

                <!-- Form card -->
                <div class="card form-card">
                    <h3 class="section-title">Parameter Pembiayaan</h3>

                    <!-- Model Kendaraan -->
                    <div class="form-group">
                        <label>Pilih Model Kendaraan</label>
                        <div class="select-wrapper">
                            <select class="form-control" id="selectModel" onchange="pilihModel()">
                                <option value="">-- Pilih Model --</option>
                            </select>
                        </div>
                    </div>

                    <!-- Harga OTR -->
                    <div class="form-group">
                        <label>Harga OTR (Rp)</label>
                        <input class="form-control font-bold" type="text" id="inputHarga" inputmode="numeric" placeholder="0" oninput="formatInput(this)" onblur="syncHarga(this.value)" />
                        <div class="range-wrapper">
                            <input class="range-slider" type="range" id="rangeHarga" min="100000000" max="1500000000" step="5000000" value="200000000" oninput="updateHarga(this.value)" />
                        </div>
                    </div>

                    <!-- Uang Muka (TDP) -->
                    <div class="form-group">
                        <label>Uang Muka / TDP (Rp)</label>
                        <input class="form-control font-bold" type="text" id="inputTdp" inputmode="numeric" placeholder="0" oninput="formatInput(this)" onblur="syncTdp(this.value)" />
                        <div class="range-wrapper">
                            <input class="range-slider" type="range" id="rangeTdp" min="10000000" max="500000000" step="2000000" value="40000000" oninput="updateTdp(this.value)" />
                        </div>
                        <div class="dp-chips">
                            <button type="button" class="dp-chip" onclick="setDpPersen(20)">20%</button>
                            <button type="button" class="dp-chip active" onclick="setDpPersen(25)">25%</button>
                            <button type="button" class="dp-chip" onclick="setDpPersen(30)">30%</button>
                            <button type="button" class="dp-chip" onclick="setDpPersen(40)">40%</button>
                            <button type="button" class="dp-chip" onclick="setDpPersen(50)">50%</button>
                        </div>
                    </div>

                    <!-- Tenor -->
                    <div class="form-group">
                        <div class="section-label">Tenor Pembiayaan</div>
                        <div class="tenor-tabs">
                            <div class="tenor-tab" onclick="setTenor(1, this)"><span class="tenor-num">1</span><span class="tenor-unit">Tahun</span></div>
                            <div class="tenor-tab" onclick="setTenor(2, this)"><span class="tenor-num">2</span><span class="tenor-unit">Tahun</span></div>
                            <div class="tenor-tab active" onclick="setTenor(3, this)"><span class="tenor-num">3</span><span class="tenor-unit">Tahun</span></div>
                            <div class="tenor-tab" onclick="setTenor(4, this)"><span class="tenor-num">4</span><span class="tenor-unit">Tahun</span></div>
                            <div class="tenor-tab" onclick="setTenor(5, this)"><span class="tenor-num">5</span><span class="tenor-unit">Tahun</span></div>
                            <div class="tenor-tab" onclick="setTenor(6, this)"><span class="tenor-num">6</span><span class="tenor-unit">Tahun</span></div>
                        </div>
                    </div>

                    <!-- Provinsi / Bunga acuan -->
                    <div class="form-group">
                        <label>Provinsi / Wilayah</label>
                        <div class="province-select-wrapper">
                            <select class="province-select" id="selectProvinsi" onchange="updateBunga()">
                                <option value="">Memuat data...</option>
                            </select>
                        </div>
                        <div class="bunga-badge" id="bungaBadge">
                            <i class="fa-solid fa-percent"></i>
                            <span id="bungaText">Bunga 8,95% p.a. (flat)</span>
                        </div>
                    </div>

                    <!-- Metode Bunga -->
                    <div class="form-group">
                        <div class="section-label">Metode Perhitungan Bunga</div>
                        <div class="method-tabs">
                            <div class="method-tab active" id="tabFlat" onclick="setMetode('flat', this)"><i class="fa-solid fa-equals"></i> Flat Rate</div>
                            <div class="method-tab" id="tabEffektif" onclick="setMetode('efektif', this)"><i class="fa-solid fa-chart-line"></i> Efektif</div>
                            <div class="method-tab" id="tabAnuitas" onclick="setMetode('anuitas', this)"><i class="fa-solid fa-wave-square"></i> Anuitas</div>
                        </div>
                    </div>

                    <button class="btn-main" id="btnCalc" onclick="hitung()">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Simulasikan Cicilan</span>
                    </button>
                </div>

                <!-- Multi-Leasing Comparison Matrix Card -->
                <div class="card" id="multiLeasingCard" style="margin-top: 20px; display: none; background: #ffffff; border-radius: 16px; padding: 18px; border: 1px solid var(--border-color); box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                        <h3 style="font-size: 14px; margin: 0; font-weight: 800; color: var(--primary-blue);">
                            <i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> Matriks Komparasi Multi-Leasing
                        </h3>
                        <span style="font-size: 11px; font-weight: 700; background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 8px;">
                            Real-time Rate
                        </span>
                    </div>
                    <div id="multiLeasingList" style="display: flex; flex-direction: column; gap: 10px;"></div>
                </div>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 2: SMART DIGITAL QUOTATION (PDF & WA GENERATOR)
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionQuotation" style="display:none;">
                <div class="quote-container">
                    <!-- LEFT COLUMN: FORM INPUT -->
                    <div class="card" style="padding: 22px; border-radius: 20px;">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
                            <div style="width:36px; height:36px; border-radius:10px; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; font-size:16px;">
                                <i class="fa-solid fa-sliders"></i>
                            </div>
                            <div>
                                <h3 style="font-size:15px; font-weight:800; margin:0; color:#0f172a;">Sesuaikan Parameter Penawaran</h3>
                                <p style="font-size:11.5px; color:#64748b; margin:0;">Data otomatis tersinkron dari hasil kalkulator kredit</p>
                            </div>
                        </div>

                        <!-- Data Konsumen -->
                        <div style="margin-bottom: 14px;">
                            <label class="form-group-label">Nama Calon Konsumen</label>
                            <input type="text" id="qNamaKonsumen" class="styled-input" placeholder="Contoh: Bpk. Hendra Gunawan" oninput="updateQuotationCalc()">
                        </div>

                        <div style="margin-bottom: 14px;">
                            <label class="form-group-label">No. WhatsApp Konsumen</label>
                            <input type="tel" id="qNoWa" class="styled-input" placeholder="08xxxxxxxxxx" oninput="updateQuotationCalc()">
                        </div>

                        <!-- Unit Toyota -->
                        <div style="margin-bottom: 14px;">
                            <label class="form-group-label">Pilih Unit &amp; OTR Resmi</label>
                            <select id="qModelSelect" class="styled-input" onchange="updateQuotationCalc()">
                                <option value="263500000|All New Avanza 1.5 G CVT">All New Avanza 1.5 G CVT - Rp 263.500.000</option>
                                <option value="304400000|All New Veloz 1.5 Q CVT TSS">All New Veloz 1.5 Q CVT TSS - Rp 304.400.000</option>
                                <option value="425000000|Innova Zenix 2.0 G CVT">Innova Zenix 2.0 G CVT - Rp 425.000.000</option>
                                <option value="473600000|Innova Zenix 2.0 G Hybrid CVT">Innova Zenix 2.0 G Hybrid CVT - Rp 473.600.000</option>
                                <option value="564200000|New Fortuner 2.8 VRZ 4x2 AT">New Fortuner 2.8 VRZ 4x2 AT - Rp 564.200.000</option>
                                <option value="175000000|New Calya 1.2 G MT">New Calya 1.2 G MT - Rp 175.000.000</option>
                                <option value="190000000|All New Agya 1.2 G CVT">All New Agya 1.2 G CVT - Rp 190.000.000</option>
                                <option value="360000000|Yaris Cross 1.5 G CVT">Yaris Cross 1.5 G CVT - Rp 360.000.000</option>
                                <option value="440600000|Yaris Cross 1.5 S Hybrid CVT">Yaris Cross 1.5 S Hybrid CVT - Rp 440.600.000</option>
                                <option value="252000000|All New Raize 1.0T G CVT">All New Raize 1.0T G CVT - Rp 252.000.000</option>
                            </select>
                        </div>

                        <!-- Diskon / Cashback -->
                        <div style="margin-bottom: 14px;">
                            <label class="form-group-label">Potongan Diskon / Cashback (Rp)</label>
                            <input type="number" id="qDiskon" class="styled-input" placeholder="0" value="15000000" oninput="updateQuotationCalc()">
                        </div>

                        <!-- Skema Pembiayaan -->
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px;">
                            <div>
                                <label class="form-group-label">Uang Muka (DP %)</label>
                                <select id="qDpPersen" class="styled-input" onchange="updateQuotationCalc()">
                                    <option value="15">15% (DP Ringan)</option>
                                    <option value="20" selected>20% (Standar)</option>
                                    <option value="25">25% (Rekomendasi)</option>
                                    <option value="30">30% (Cicilan Ringan)</option>
                                    <option value="40">40% (DP Besar)</option>
                                    <option value="50">50% (DP Super)</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-group-label">Jangka Waktu (Tenor)</label>
                                <select id="qTenor" class="styled-input" onchange="updateQuotationCalc()">
                                    <option value="12">1 Tahun (12 Bln)</option>
                                    <option value="24">2 Tahun (24 Bln)</option>
                                    <option value="36">3 Tahun (36 Bln)</option>
                                    <option value="48">4 Tahun (48 Bln)</option>
                                    <option value="60" selected>5 Tahun (60 Bln)</option>
                                    <option value="72">6 Tahun (72 Bln)</option>
                                </select>
                            </div>
                        </div>

                        <!-- Leasing Rekanan -->
                        <div style="margin-bottom: 14px;">
                            <label class="form-group-label">Pilihan Lembaga Pembiayaan (Leasing)</label>
                            <select id="qLeasing" class="styled-input" onchange="updateQuotationCalc()">
                                <option value="TAF (Toyota Astra Financial)" selected>TAF (Toyota Astra Financial) - Resmi Toyota</option>
                                <option value="ACC (Astra Credit Companies)">ACC (Astra Credit Companies) - Resmi Astra</option>
                                <option value="BCA Finance">BCA Finance - Bunga Super Rendah</option>
                                <option value="Mandiri Tunas Finance">Mandiri Tunas Finance (MTF)</option>
                                <option value="Maybank Finance">Maybank Finance</option>
                                <option value="Adira Finance">Adira Finance</option>
                            </select>
                        </div>

                        <!-- Bonus & Hadiah Langsung -->
                        <div>
                            <label class="form-group-label">Hadiah &amp; Fasilitas Tambahan</label>
                            <div style="display:flex; flex-direction:column; gap:8px; font-size:12px; color:#334155;">
                                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                    <input type="checkbox" id="chkVkool" checked onchange="updateQuotationCalc()"> Free Kaca Film V-Kool / 3M Bergaransi
                                </label>
                                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                    <input type="checkbox" id="chkService" checked onchange="updateQuotationCalc()"> Free Servis &amp; Oli 4 Tahun / 50.000 KM (T-Care)
                                </label>
                                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                    <input type="checkbox" id="chkKarpet" checked onchange="updateQuotationCalc()"> Karpet Dasar Original &amp; Apar Tabung
                                </label>
                                <label style="display:flex; align-items:center; gap:8px; cursor:pointer;">
                                    <input type="checkbox" id="chkVoucher" onchange="updateQuotationCalc()"> Voucher Belanja / Bensin Pertamax Rp 1.000.000
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- RIGHT COLUMN: LIVE QUOTATION PREVIEW & PDF -->
                    <div>
                        <div class="quote-paper" id="quotationPrintArea">
                            <div class="quote-paper-header">
                                <div>
                                    <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" alt="Tunas Toyota" style="height: 24px; object-fit: contain;">
                                    <div style="font-size: 10px; font-weight: 800; color: #64748b; margin-top: 4px;">CABANG KIARA CONDONG - BANDUNG</div>
                                </div>
                                <div style="text-align: right;">
                                    <span class="bonus-chip" style="background:#fee2e2; border-color:#fca5a5; color:#b91c1c;">RESMI &amp; TERVERIFIKASI</span>
                                    <div style="font-size: 10px; color: #64748b; margin-top: 4px;" id="previewTanggal">-</div>
                                </div>
                            </div>

                            <div style="margin-bottom: 14px;">
                                <div style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Ditujukan Kepada:</div>
                                <div style="font-size: 16px; font-weight: 900; color: #0f172a;" id="previewNamaKonsumen">Bapak/Ibu Calon Konsumen</div>
                                <div style="font-size: 11.5px; color: #64748b;" id="previewNoWa">WA: -</div>
                            </div>

                            <div style="background: #f8fafc; border-radius: 12px; padding: 12px 14px; border: 1px solid #e2e8f0; margin-bottom: 14px;">
                                <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase;">Unit Impian:</div>
                                <div style="font-size: 15px; font-weight: 800; color: #c8102e;" id="previewModel">Toyota Unit</div>
                            </div>

                            <table class="quote-table-modern">
                                <tr>
                                    <td>Harga OTR Resmi</td>
                                    <td style="text-align: right;" id="previewOtr">Rp 0</td>
                                </tr>
                                <tr>
                                    <td style="color: #15803d;">Potongan Diskon / Promo Spesial</td>
                                    <td style="text-align: right; color: #15803d;" id="previewDiskon">- Rp 0</td>
                                </tr>
                                <tr style="background: #f1f5f9; font-weight: 800;">
                                    <td>Harga Bersih (Netto)</td>
                                    <td style="text-align: right;" id="previewHargaNett">Rp 0</td>
                                </tr>
                                <tr>
                                    <td>Total Uang Muka (TDP Netto)</td>
                                    <td style="text-align: right; font-weight: 700; color: #c8102e;" id="previewDpNett">Rp 0</td>
                                </tr>
                                <tr>
                                    <td>Jangka Waktu Kredit (Tenor)</td>
                                    <td style="text-align: right;"><span id="previewTenor">60</span> Bulan</td>
                                </tr>
                                <tr>
                                    <td>Lembaga Pembiayaan</td>
                                    <td style="text-align: right;" id="previewLeasing">ACC / TAF</td>
                                </tr>
                                <tr style="background: #eff6ff; font-size: 14px;">
                                    <td style="font-weight: 800; color: #1e40af;">Estimasi Cicilan per Bulan</td>
                                    <td style="text-align: right; font-weight: 900; color: #1e40af;" id="previewAngsuran">Rp 0 /bln</td>
                                </tr>
                            </table>

                            <div style="margin-top: 12px; font-size: 11px; color: #475569;">
                                <div style="font-weight: 700; margin-bottom: 4px;">Paket Hadiah &amp; Kelengkapan:</div>
                                <div id="previewBonusList" style="line-height: 1.5; color: #059669; font-weight: 600;">
                                    &bull; Free Kaca Film V-Kool / 3M<br>
                                    &bull; Free Service 4 Tahun / 50.000 KM
                                </div>
                            </div>

                            <div style="margin-top: 18px; border-top: 1px dashed #cbd5e1; padding-top: 12px; display: flex; justify-content: space-between; align-items: flex-end;">
                                <div style="font-size: 9.5px; color: #94a3b8; max-width: 60%;">
                                    *Syarat &amp; ketentuan kredit berlaku. Bunga dan cicilan mengacu pada approval komite pembiayaan saat PO terbit.
                                </div>
                                <div style="text-align: right;">
                                    <div style="font-size: 10px; color: #64748b;">Konsultan Resmi Anda:</div>
                                    <div style="font-size: 12px; font-weight: 800; color: #0f172a;" id="previewSalesName">Sales Consultant</div>
                                    <div style="font-size: 10px; color: #c8102e; font-weight: 700;">Tunas Toyota Kiara Condong</div>
                                </div>
                            </div>
                        </div>

                        <div class="action-btn-group">
                            <button type="button" onclick="window.print()" style="padding:12px; border-radius:12px; font-weight:700; font-size:12.5px; color:#0f172a; border:1.5px solid #cbd5e1; background:white; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <i class="fa-solid fa-print"></i> Cetak / Simpan PDF
                            </button>
                            <button type="button" onclick="shareQuotationWA()" style="padding:12px; border-radius:12px; font-weight:700; font-size:12.5px; color:white; border:none; background:#25D366; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Kirim via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 3: MATRIKS LEASING & PREDIKTOR APPROVAL ODDS
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionLeasing" style="display:none;">
                <div class="matrix-grid">
                    <!-- LEFT: SCORING PREDICTOR FORM -->
                    <div class="styled-card">
                        <div style="display:flex; align-items:center; gap:10px; margin-bottom:16px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
                            <div style="width:36px; height:36px; border-radius:10px; background:#e0f2fe; color:#0284c7; display:flex; align-items:center; justify-content:center; font-size:18px;">
                                <i class="fa-solid fa-calculator"></i>
                            </div>
                            <div>
                                <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; margin:0; color:#0f172a;">Kalkulator Profil &amp; Peluang Approval Nasabah</h3>
                                <p style="font-size:11.5px; color:#64748b; margin:0;">Uji kelayakan kredit nasabah sebelum pengajuan PO ke komite.</p>
                            </div>
                        </div>

                        <label class="form-group-label">1. Pekerjaan / Sumber Penghasilan</label>
                        <select id="profesi" class="styled-input" onchange="calculateOdds()">
                            <option value="pns">PNS / BUMN / Dokter / Profesi Medis Tetap (Skor Tertinggi)</option>
                            <option value="swasta_tetap" selected>Karyawan Swasta Tetap (Masa Kerja > 2 Tahun)</option>
                            <option value="wiraswasta_lama">Pengusaha / Wiraswasta (Usaha > 2 Tahun + Mutasi Bank Aktif)</option>
                            <option value="wiraswasta_baru">Pengusaha Baru / Usaha Mandiri (&lt; 1 Tahun)</option>
                            <option value="swasta_kontrak">Karyawan Kontrak / Freelance</option>
                            <option value="luar_kota">Domisili KTP Luar Bandung / Rumah Kontrak</option>
                        </select>

                        <label class="form-group-label">2. Riwayat BI Checking / SLIK OJK</label>
                        <select id="slik" class="styled-input" onchange="calculateOdds()">
                            <option value="bersih" selected>Kolektibilitas 1 (Lancar Bersih Tanpa Catatan)</option>
                            <option value="pernah_telat">Pernah Terlambat &lt; 30 Hari (Sudah Lunas)</option>
                            <option value="fresh">Fresh (Belum Pernah Ambil Kredit Sama Sekali)</option>
                            <option value="macet">Ada Tunggakan Paylater / Kartu Kredit Aktif</option>
                        </select>

                        <label class="form-group-label">3. Rasio Angsuran vs Penghasilan Bulanan (DSR)</label>
                        <select id="dsr" class="styled-input" onchange="calculateOdds()">
                            <option value="dsr_rendah" selected>Angsuran Ringan (&lt; 30% dari Total Gaji Bersih)</option>
                            <option value="dsr_sedang">Angsuran Sedang (30% - 45% dari Gaji Bersih)</option>
                            <option value="dsr_tinggi">Angsuran Cukup Berat (&gt; 50% dari Gaji Bersih)</option>
                        </select>

                        <label class="form-group-label">4. Besaran Uang Muka (DP %)</label>
                        <select id="dp" class="styled-input" onchange="calculateOdds()">
                            <option value="dp_30" selected>DP Aman 25% - 30%+ (Peluang Sangat Tinggi)</option>
                            <option value="dp_20">DP Standar 20%</option>
                            <option value="dp_15">DP Minim 15%</option>
                            <option value="dp_10">DP Super Ringan 10%</option>
                        </select>

                        <label class="form-group-label">5. Status Kepemilikan Rumah Tinggal</label>
                        <select id="rumah" class="styled-input" onchange="calculateOdds()">
                            <option value="sendiri" selected>Rumah Milik Sendiri / Orang Tua (Atas Nama Pribadi/Keluarga)</option>
                            <option value="kpr">KPR Berjalan (Pembayaran Lancar)</option>
                            <option value="sewa">Rumah Kontrak / Sewa Tahunan</option>
                        </select>
                    </div>

                    <!-- RIGHT: ODDS METER & COMPARISON TABLE -->
                    <div>
                        <div class="odds-meter-box">
                            <span style="background:rgba(255,255,255,0.1); color:#38bdf8; font-size:11px; font-weight:800; padding:4px 10px; border-radius:20px;">
                                ESTIMATED APPROVAL PROBABILITY
                            </span>
                            <div class="odds-circle" id="oddsCircleElem">
                                <span class="odds-number" id="oddsValue">85%</span>
                                <span class="odds-label">Score Odds</span>
                            </div>
                            <h4 id="oddsStatusText" style="font-size:16px; font-weight:800; color:#34d399; margin:4px 0 6px;">Peluang Sangat Tinggi (Fast Approval)</h4>
                            <p id="oddsSummaryDesc" style="font-size:12px; color:#cbd5e1; margin:0 0 14px; line-height:1.4;">Profil nasabah prima. Disarankan menggunakan TAF atau BCA Finance dengan paket promo suku bunga terendah.</p>
                            
                            <div style="background:rgba(255,255,255,0.06); padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:left; font-size:12px;">
                                <div style="color:#94a3b8; font-weight:700; margin-bottom:4px;"><i class="fa-solid fa-trophy" style="color:#fbbf24;"></i> Urutan Rekomendasi Leasing:</div>
                                <div id="leasingRankList" style="color:white; line-height:1.5;">1. TAF (Toyota Astra Financial)<br>2. BCA Finance</div>
                            </div>

                            <button type="button" onclick="shareRecommendationWa()" style="width:100%; margin-top:14px; padding:12px; border-radius:12px; background:#0284c7; color:white; font-size:12.5px; font-weight:800; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                                <i class="fa-brands fa-whatsapp" style="font-size:15px;"></i> Bagikan Rekomendasi Leasing ke WA
                            </button>
                        </div>

                        <!-- MATRIKS TABEL BUNGA LEASING RESMI -->
                        <div class="styled-card" style="margin-top:20px; overflow-x:auto;">
                            <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:0 0 4px;">
                                <i class="fa-solid fa-table-list" style="color:#0284c7;"></i> Matriks Suku Bunga Resmi Rekanan
                            </h4>
                            <p style="font-size:11.5px; color:#64748b; margin:0 0 12px;">Update per September 2026 Tunas Toyota Kiara Condong</p>
                            
                            <table class="leasing-table">
                                <thead>
                                    <tr>
                                        <th>Leasing</th>
                                        <th>Bunga/Thn</th>
                                        <th>Min DP</th>
                                        <th>Keunggulan Utama</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><span class="badge-partner badge-taf">TAF</span></td>
                                        <td><strong>2.77% - 5.5%</strong></td>
                                        <td>20%</td>
                                        <td>Paket Spektakuler, Asuransi All Risk Komplit</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-acc">ACC</span></td>
                                        <td><strong>2.88% - 5.6%</strong></td>
                                        <td>20%</td>
                                        <td>Persetujuan 24 Jam, Berkas Wiraswasta Fleksibel</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-bca">BCA Fin</span></td>
                                        <td><strong>2.67% - 4.9%</strong></td>
                                        <td>25%</td>
                                        <td>Suku Bunga Terendah, Khusus Nasabah Payroll/Prioritas</td>
                                    </tr>
                                    <tr>
                                        <td><span class="badge-partner badge-mtf">MTF</span></td>
                                        <td><strong>3.15% - 5.8%</strong></td>
                                        <td>20%</td>
                                        <td>Tenor Panjang hingga 7 Tahun, Bebas Provisi</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Scripts -->
    <script src="../custom_alert.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script src="../js/kalkulator.js"></script>
    <script src="../js/quotation.js"></script>

    <script>
        // ── TAB SWITCHER LOGIC ──
        function switchFinanceTab(tabId) {
            document.querySelectorAll('.finance-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('sectionKalkulator').style.display = 'none';
            document.getElementById('sectionQuotation').style.display = 'none';
            document.getElementById('sectionLeasing').style.display = 'none';

            if (tabId === 'quotation') {
                document.getElementById('btnTabQuotation').classList.add('active');
                document.getElementById('sectionQuotation').style.display = 'block';
                if (typeof updateQuotationCalc === 'function') updateQuotationCalc();
            } else if (tabId === 'leasing') {
                document.getElementById('btnTabLeasing').classList.add('active');
                document.getElementById('sectionLeasing').style.display = 'block';
                if (typeof calculateOdds === 'function') calculateOdds();
            } else {
                document.getElementById('btnTabKalkulator').classList.add('active');
                document.getElementById('sectionKalkulator').style.display = 'block';
            }
        }

        // ── TRANSFER DATA DARI KALKULATOR KE SMART QUOTATION OTOMATIS ──
        function transferToQuotation() {
            const modelSelect = document.getElementById('selectModel');
            const hargaInput = document.getElementById('inputHarga');
            const tdpInput = document.getElementById('inputTdp');

            const hargaVal = typeof parseNum === 'function' ? parseNum(hargaInput.value) : parseInt(hargaInput.value.replace(/[^0-9]/g, '')) || 0;
            const tdpVal = typeof parseNum === 'function' ? parseNum(tdpInput.value) : parseInt(tdpInput.value.replace(/[^0-9]/g, '')) || 0;
            const selectedText = modelSelect.options[modelSelect.selectedIndex]?.text || 'Toyota Unit';

            // Hitung persentase DP aktual
            let dpPct = 20;
            if (hargaVal > 0 && tdpVal > 0) {
                dpPct = Math.round((tdpVal / hargaVal) * 100);
            }

            // Sync ke select model quotation jika cocok atau tambahkan opsi custom
            const qSelect = document.getElementById('qModelSelect');
            if (qSelect && hargaVal > 0) {
                let matched = false;
                for (let i = 0; i < qSelect.options.length; i++) {
                    if (qSelect.options[i].text.toLowerCase().includes(selectedText.toLowerCase())) {
                        qSelect.selectedIndex = i;
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    const opt = new Option(`${selectedText} - Rp ${hargaVal.toLocaleString('id-ID')}`, `${hargaVal}|${selectedText}`);
                    qSelect.add(opt, 0);
                    qSelect.selectedIndex = 0;
                }
            }

            // Sync DP% dan Tenor
            const qDpSelect = document.getElementById('qDpPersen');
            if (qDpSelect) {
                if (dpPct <= 18) qDpSelect.value = "15";
                else if (dpPct <= 22) qDpSelect.value = "20";
                else if (dpPct <= 27) qDpSelect.value = "25";
                else if (dpPct <= 35) qDpSelect.value = "30";
                else if (dpPct <= 45) qDpSelect.value = "40";
                else qDpSelect.value = "50";
            }

            const qTenorSelect = document.getElementById('qTenor');
            if (qTenorSelect && typeof currentTenor !== 'undefined') {
                qTenorSelect.value = String(currentTenor * 12);
            }

            // Pindah tab ke Smart Quotation
            switchFinanceTab('quotation');

            // Scroll mulus ke preview penawaran
            document.getElementById('quotationPrintArea')?.scrollIntoView({ behavior: 'smooth' });
        }

        // ── PERIKSA URL PARAMETER (?tab=quotation atau ?tab=leasing) ──
        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const requestedTab = urlParams.get('tab');
            if (requestedTab) {
                switchFinanceTab(requestedTab);
            }

            const tglEl = document.getElementById('previewTanggal');
            if (tglEl) {
                const now = new Date();
                tglEl.textContent = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        });

        // ── SCORING ODDS CALCULATION ──
        function calculateOdds() {
            const profesiEl = document.getElementById('profesi');
            if (!profesiEl) return;
            const profesi = profesiEl.value;
            const slik = document.getElementById('slik').value;
            const dsr = document.getElementById('dsr').value;
            const dp = document.getElementById('dp').value;
            const rumah = document.getElementById('rumah').value;

            let score = 50;

            if (profesi === 'pns') score += 25;
            else if (profesi === 'swasta_tetap') score += 20;
            else if (profesi === 'wiraswasta_lama') score += 18;
            else if (profesi === 'wiraswasta_baru') score += 8;
            else if (profesi === 'swasta_kontrak') score += 5;
            else if (profesi === 'luar_kota') score += 3;

            if (slik === 'bersih') score += 20;
            else if (slik === 'pernah_telat') score += 5;
            else if (slik === 'fresh') score += 10;
            else if (slik === 'macet') score -= 30;

            if (dsr === 'dsr_rendah') score += 15;
            else if (dsr === 'dsr_sedang') score += 8;
            else if (dsr === 'dsr_tinggi') score -= 15;

            if (dp === 'dp_30') score += 15;
            else if (dp === 'dp_20') score += 10;
            else if (dp === 'dp_15') score += 4;
            else if (dp === 'dp_10') score -= 5;

            if (rumah === 'sendiri') score += 10;
            else if (rumah === 'kpr') score += 6;
            else if (rumah === 'sewa') score -= 5;

            score = Math.max(10, Math.min(98, score));

            const oddsVal = document.getElementById('oddsValue');
            if (oddsVal) oddsVal.innerText = `${score}%`;

            const circle = document.getElementById('oddsCircleElem');
            const statusText = document.getElementById('oddsStatusText');
            const summaryDesc = document.getElementById('oddsSummaryDesc');
            const rankList = document.getElementById('leasingRankList');

            if (!circle || !statusText) return;

            if (score >= 80) {
                circle.style.borderColor = '#10b981';
                statusText.style.color = '#34d399';
                statusText.innerText = 'Peluang Sangat Tinggi (Fast Approval)';
                summaryDesc.innerText = 'Profil nasabah prima. Disarankan menggunakan TAF atau BCA Finance dengan paket promo suku bunga terendah.';
                rankList.innerHTML = '1. <strong>TAF (Toyota Astra Financial)</strong> - Diskon provisi &amp; promo bunga rendah.<br>2. <strong>BCA Finance</strong> - Proses instan payroll &amp; tenor fleksibel.';
            } else if (score >= 60) {
                circle.style.borderColor = '#f59e0b';
                statusText.style.color = '#fbbf24';
                statusText.innerText = 'Peluang Sedang (Membutuhkan Data Tambahan)';
                summaryDesc.innerText = 'Peluang disetujui cukup baik. Pastikan melampirkan rekening koran 3 bulan & bukti kepemilikan usaha/slip gaji.';
                rankList.innerHTML = '1. <strong>ACC (Astra Credit Companies)</strong> - Fleksibel dalam verifikasi wiraswasta.<br>2. <strong>Mandiri Tunas Finance (MTF)</strong> - Cocok dengan tambahan data penjamin.';
            } else {
                circle.style.borderColor = '#ef4444';
                statusText.style.color = '#f87171';
                statusText.innerText = 'Peluang Berisiko (Disarankan Tambah DP)';
                summaryDesc.innerText = 'Aplikasi berpotensi membutuhkan jaminan tambahan atau penambahan DP minimal 30% agar disetujui komite leasing.';
                rankList.innerHTML = '1. <strong>ACC (Astra Credit Companies)</strong> - Dengan DP minimal 25-30%.<br>2. Opsi alternatif: Pembelian Cash Bertahap atau ganti atas nama keluarga inti.';
            }
        }

        function shareRecommendationWa() {
            const score = document.getElementById('oddsValue')?.innerText || '85%';
            const status = document.getElementById('oddsStatusText')?.innerText || 'Peluang Tinggi';
            const summary = document.getElementById('oddsSummaryDesc')?.innerText || '';
            const text = `*KONSULTASI FINANSIAL & LEASING TOYOTA*\nDealer: Tunas Toyota Kiara Condong Bandung\n\nHasil Analisis Skoring Kelayakan Kredit:\n📊 *Peluang Approval: ${score} (${status})*\n\nRekomendasi:\n${summary}\n\nIngin kami bantu hitungkan simulasi cicilan resminya? Silakan hubungi kami untuk konsultasi gratis.`;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
        }
    </script>
</body>

</html>
