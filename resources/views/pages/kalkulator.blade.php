<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Kalkulator Simulasi Cicilan</title>
    <meta name="description" content="Kalkulator simulasi cicilan kredit mobil Toyota Tunas Kiara Condong Bandung.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/kalkulator.css">
    <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
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
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 900px; margin: 0 auto;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Kalkulator Simulasi Cicilan</h2>
        </header>

        <div class="container" style="margin-top: 15px;">

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
                        <!-- ACTION TERPADU 1: TRANSFER KE FORM SPK -->
                        <button type="button" onclick="proceedSimulationToSpk()" style="width:100%; background: linear-gradient(135deg, #059669 0%, #10b981 100%); color:white; padding: 14px; border-radius: 12px; font-weight: 800; font-size: 13.5px; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:10px; box-shadow: 0 4px 15px rgba(16,185,129,0.25);">
                            <i class="fa-solid fa-file-signature" style="font-size:16px;"></i>
                            <span>Ajukan SPK dengan Simulasi Ini (Ke Form SPK)</span>
                            <i class="fa-solid fa-arrow-right" style="font-size:12px; opacity:0.8;"></i>
                        </button>

                        <div style="display:flex; gap:10px;">
                            <button class="btn-print" onclick="window.print()" style="flex:1;">
                                <i class="fa-solid fa-print"></i> Cetak Lembar Cicilan
                            </button>
                            <button class="btn-outline" onclick="addToCompare()" style="flex:1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; color: var(--primary-blue); border: 1px solid var(--primary-blue); background: transparent; cursor: pointer;">
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
                    <div id="compareList" style="display:flex; gap:12px; overflow-x:auto; padding-bottom:8px;"></div>
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

        </div>
    </div>

    <!-- Scripts -->
    <script src="../custom_alert.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script src="../js/kalkulator.js"></script>
</body>

</html>
