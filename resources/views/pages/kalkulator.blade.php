<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Kalkulator Cicilan</title>
    <meta name="description" content="Simulasi cicilan kendaraan Toyota untuk membantu proses sales">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/kalkulator.css">
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="mobile-app">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Kalkulator Cicilan</h2>
        </header>

        <div class="container" style="margin-top: 0;">

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

                <div style="display:flex; flex-direction:column; gap:10px; margin-top:20px;">
                    <div style="display:flex; gap:10px;">
                        <button class="btn-print" onclick="window.print()" style="flex:1;">
                            <i class="fa-solid fa-print"></i> Cetak (PDF)
                        </button>
                        <button class="btn-outline" onclick="addToCompare()" style="flex:1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; color: var(--primary-blue); border: 1px solid var(--primary-blue); background: transparent;">
                            <i class="fa-solid fa-code-compare"></i> Bandingkan
                        </button>
                    </div>
                    <button class="btn-wa" onclick="shareToWhatsApp()" style="width:100%; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; color: white; border: none; background: #25D366; cursor: pointer;">
                        <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Bagikan ke WhatsApp
                    </button>
                </div>
            </div>

            <!-- Comparison Container -->
            <div id="comparisonContainer" style="display:none; margin-bottom: 24px; padding: 16px; background: white; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                    <h3 style="font-size:14px; margin:0; font-weight:800; color:var(--text-dark);"><i class="fa-solid fa-code-compare" style="color:var(--primary-blue); margin-right:6px;"></i>Komparasi Paket</h3>
                    <button onclick="clearCompare()" style="background:none; border:none; color:var(--primary-red); font-size:11px; font-weight:700; cursor:pointer;"><i class="fa-solid fa-trash"></i> Hapus</button>
                </div>
                <div id="compareList" style="display:flex; gap:12px; overflow-x:auto; padding-bottom:8px; scrollbar-width:none;">
                    <!-- Comparison cards go here -->
                </div>
            </div>

            <!-- Form card -->
            <div class="card">
                <h3 class="section-title" style="margin-bottom:4px;">Simulasi Cicilan</h3>
                <p style="font-size:12px;color:var(--text-muted);margin-bottom:20px;line-height:1.5;">
                    Masukkan detail kendaraan untuk estimasi cicilan bulanan.
                </p>

                <!-- Tipe Mobil -->
                <div class="form-group">
                    <label>Tipe Mobil (Opsional)</label>
                    <input type="text" id="inputMobil" class="form-control" placeholder="Contoh: Avanza 1.5 G CVT" style="width:100%; padding: 12px 14px; border-radius: 12px; border: 1.5px solid var(--border-color); font-size: 14px; background: #fff; margin-top:4px;" />
                </div>

                <!-- Harga OTR -->
                <div class="form-group">
                    <label>Harga OTR Kendaraan</label>
                    <div class="value-input-wrapper">
                        <span class="value-prefix">Rp</span>
                        <input type="text" inputmode="numeric" class="value-display" id="inputHarga"
                            value="200.000.000" placeholder="0"
                            oninput="formatInput(this); syncHarga(this.value)">
                    </div>
                    <input type="range" id="rangeHarga" min="100000000" max="1500000000" step="5000000" value="200000000"
                        oninput="updateHarga(this.value)">
                    <div class="range-labels">
                        <span class="range-label">Rp 100 Jt</span>
                        <span class="range-label">Rp 1,5 M</span>
                    </div>
                </div>

                <!-- TDP -->
                <div class="form-group">
                    <label>Uang Muka (DP Murni)</label>
                    <div class="value-input-wrapper">
                        <span class="value-prefix">Rp</span>
                        <input type="text" inputmode="numeric" class="value-display" id="inputTdp"
                            value="30.000.000" placeholder="0"
                            oninput="formatInput(this); syncTdp(this.value)">
                    </div>
                    <small style="display:block; font-size:11px; color:var(--text-muted); margin-top:6px; margin-bottom:10px; line-height:1.4;">
                        *Masukkan nominal Uang Muka murni (pokok). Total bayar pertama (TDP Akhir) akan otomatis ditambahkan dengan biaya asuransi, admin, dan angsuran pertama (jika ADDM).
                    </small>
                    <input type="range" id="rangeTdp" min="0" max="500000000" step="5000000" value="30000000"
                        oninput="updateTdp(this.value)">
                    <div class="range-labels">
                        <span class="range-label">Rp 0</span>
                        <span class="range-label">Rp 500 Jt</span>
                    </div>
                </div>

                <!-- Tenor -->
                <div class="form-group">
                    <label style="margin-bottom:10px;display:block;">Tenor Pembiayaan</label>
                    <div class="tenor-tabs">
                        <div class="tenor-tab" onclick="setTenor(1, this)">1 Th</div>
                        <div class="tenor-tab" onclick="setTenor(2, this)">2 Th</div>
                        <div class="tenor-tab active" onclick="setTenor(3, this)">3 Th</div>
                        <div class="tenor-tab" onclick="setTenor(4, this)">4 Th</div>
                        <div class="tenor-tab" onclick="setTenor(5, this)">5 Th</div>
                        <div class="tenor-tab" onclick="setTenor(6, this)">6 Th</div>
                    </div>
                </div>

                <!-- Leasing, Admin, Asuransi -->
                <div class="form-group">
                    <label>Pilihan Leasing</label>
                    <div class="province-select-wrapper">
                        <select class="province-select" id="selectLeasing">
                            <option value="">Memuat data...</option>
                        </select>
                    </div>
                </div>
                
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
                    <div class="form-group">
                        <label>Biaya Admin</label>
                        <div class="value-input-wrapper">
                            <span class="value-prefix" style="font-size:12px;">Rp</span>
                            <input type="text" inputmode="numeric" class="value-display" id="inputAdmin"
                                value="2.500.000" style="font-size:14px; padding-left:36px;" oninput="formatInput(this)">
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Est. Asuransi</label>
                        <div class="value-input-wrapper">
                            <span class="value-prefix" style="font-size:12px;">Rp</span>
                            <input type="text" inputmode="numeric" class="value-display" id="inputAsuransi"
                                value="5.000.000" style="font-size:14px; padding-left:36px;" oninput="formatInput(this)">
                        </div>
                    </div>
                </div>

                <!-- Provinsi & Bunga -->
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
                        <div class="method-tab active" id="tabFlat" onclick="setMetode('flat', this)">
                            <i class="fa-solid fa-equals"></i> Flat Rate
                        </div>
                        <div class="method-tab" id="tabEffektif" onclick="setMetode('efektif', this)">
                            <i class="fa-solid fa-chart-line"></i> Efektif
                        </div>
                        <div class="method-tab" id="tabAnuitas" onclick="setMetode('anuitas', this)">
                            <i class="fa-solid fa-wave-square"></i> Anuitas
                        </div>
                    </div>
                </div>

                <button class="btn-main" id="btnCalc" onclick="hitung()">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Simulasikan Cicilan</span>
                </button>
            </div>

            <!-- Multi-Leasing Comparison Matrix -->
            <div class="card" id="multiLeasingCard" style="margin-top: 20px; display: none; background: #ffffff; border-radius: 16px; padding: 18px; border: 1px solid var(--border-color); box-shadow: 0 4px 14px rgba(0,0,0,0.04);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
                    <h3 style="font-size: 14px; margin: 0; font-weight: 800; color: var(--primary-blue);">
                        <i class="fa-solid fa-building-columns" style="color: var(--accent-blue);"></i> Matriks Komparasi Multi-Leasing
                    </h3>
                    <span style="font-size: 11px; font-weight: 700; background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 8px;">
                        Real-time Rate
                    </span>
                </div>
                <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.4;">
                    Perbandingan simulasi resmi 4 lembaga pembiayaan terkemuka untuk tenor dan OTR pilihan Anda:
                </p>

                <div id="multiLeasingList" style="display: flex; flex-direction: column; gap: 10px;">
                    <!-- Populated dynamically via hitungMultiLeasing() -->
                </div>
            </div>

            <!-- Note -->
            <div class="calc-note">
                <i class="fa-solid fa-circle-info"></i>
                <p>Perhitungan bersifat <strong>estimasi</strong>. Bunga per provinsi berdasarkan acuan rata-rata pasar. Angka aktual tergantung kebijakan leasing yang berlaku.</p>
            </div>

        </div>
    </div>


    <script src="../custom_alert.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script src="../js/kalkulator.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

