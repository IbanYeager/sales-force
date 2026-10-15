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
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/kalkulator.css?v={{ time() }}">
    <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#090e18">
</head>

<body>
    <div class="mobile-app">
        <!-- ── HEADER BANNER ── -->
        <header class="calc-header-banner">
            <div class="calc-header-left">
                <a href="../index.html" class="calc-back-btn" title="Kembali ke Dashboard">
                    <i class="fa-solid fa-arrow-left"></i>
                </a>
                <div>
                    <h1 class="calc-header-title">
                        <i class="fa-solid fa-calculator" style="color:var(--toyota-red); font-size:20px;"></i>
                        Kalkulator Simulasi Cicilan
                    </h1>
                    <p class="calc-header-subtitle">Simulasi kredit akurat, komparasi multi-leasing rekanan &amp; pengajuan SPK instan.</p>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span class="calc-badge-live">
                    <i class="fa-solid fa-circle"></i> Live Rate Simulator
                </span>
            </div>
        </header>

        <!-- ── CUSTOMER PROSPECT BANNER (IF FROM CRM) ── -->
        <div id="simCustBanner" style="display:none; background:#eff6ff; border:1px solid #bfdbfe; border-radius:14px; padding:12px 16px; margin-bottom:20px; font-size:12.5px; color:#1e40af; align-items:center; gap:10px; font-weight:700;">
            <i class="fa-solid fa-user-check" style="font-size:16px; color:#2563eb;"></i>
            <span>Simulasi untuk Konsumen Prospek: <u id="simCustName">-</u> (Hasil simulasi otomatis terisi saat transfer ke Form SPK)</span>
        </div>

        <!-- ── 2-COLUMN RESPONSIVE LAYOUT ── -->
        <div class="kalkulator-layout" id="sectionKalkulator">

            <!-- ══════════════════════════════════════════════════════════════════
                 LEFT COLUMN: PARAMETER SIMULASI (CARDS FORM)
            ══════════════════════════════════════════════════════════════════ -->
            <div class="calc-form-column">

                <!-- CARD 1: MODEL & HARGA OTR -->
                <div class="calc-card">
                    <div class="calc-card-header">
                        <div class="calc-card-icon">
                            <i class="fa-solid fa-car-side"></i>
                        </div>
                        <div>
                            <h3 class="calc-card-title">1. Unit Kendaraan &amp; Harga OTR</h3>
                            <p class="calc-card-subtitle">Pilih model Toyota atau masukkan harga OTR secara fleksibel</p>
                        </div>
                    </div>

                    <!-- Pilih Model -->
                    <div class="form-group">
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
                            <label class="form-label" style="margin-bottom:0;">Pilih Model Mobil Toyota</label>
                            <span style="font-size:11px; font-weight:700; color:var(--primary-blue);" id="modelCountBadge"><i class="fa-solid fa-list-check"></i> Memuat katalog...</span>
                        </div>

                        <!-- Quick Search Box for Models -->
                        <div style="position:relative; margin-bottom:8px;">
                            <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:50%; transform:translateY(-50%); font-size:12px; color:#94a3b8; pointer-events:none;"></i>
                            <input type="text" id="searchModelInput" placeholder="Ketik nama mobil (misal: Zenix, Veloz, Calya, Avanza, Fortuner)..." 
                                   oninput="filterModelDropdown(this.value)"
                                   style="width:100%; box-sizing:border-box; padding:9px 12px 9px 36px; border-radius:10px; border:1.5px solid #cbd5e1; font-size:12.5px; font-weight:600; outline:none; background:#f8fafc; transition:all 0.2s;" />
                        </div>

                        <select class="form-select-styled" id="selectModel" onchange="pilihModel()">
                            <option value="">-- Pilih Model Kendaraan --</option>
                            <optgroup label="TOYOTA AVANZA">
                                <option value="263500000|AVANZA 1.5 G CVT" selected>AVANZA 1.5 G CVT (Rp 263.500.000)</option>
                                <option value="239700000|AVANZA 1.3 E M/T">AVANZA 1.3 E M/T (Rp 239.700.000)</option>
                                <option value="254300000|AVANZA 1.3 E CVT">AVANZA 1.3 E CVT (Rp 254.300.000)</option>
                                <option value="259800000|AVANZA 1.5 G M/T">AVANZA 1.5 G M/T (Rp 259.800.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA VELOZ">
                                <option value="292900000|VELOZ 1.5 M/T">VELOZ 1.5 M/T (Rp 292.900.000)</option>
                                <option value="308700000|VELOZ 1.5 Q CVT">VELOZ 1.5 Q CVT (Rp 308.700.000)</option>
                                <option value="335300000|VELOZ 1.5 Q CVT TSS">VELOZ 1.5 Q CVT TSS (Rp 335.300.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA INNOVA ZENIX">
                                <option value="439900000|ZENIX 2.0 G CVT">ZENIX 2.0 G CVT (Rp 439.900.000)</option>
                                <option value="477500000|ZENIX 2.0 G HV CVT">ZENIX 2.0 G Hybrid CVT (Rp 477.500.000)</option>
                                <option value="485200000|ZENIX 2.0 V CVT">ZENIX 2.0 V CVT (Rp 485.200.000)</option>
                                <option value="552800000|ZENIX 2.0 V HV CVT">ZENIX 2.0 V Hybrid CVT (Rp 552.800.000)</option>
                                <option value="628200000|ZENIX 2.0 Q HV TSS CVT">ZENIX 2.0 Q Hybrid TSS CVT (Rp 628.200.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA CALYA">
                                <option value="173900000|CALYA 1.2 E STD M/T">CALYA 1.2 E STD M/T (Rp 173.900.000)</option>
                                <option value="177200000|CALYA 1.2 E M/T">CALYA 1.2 E M/T (Rp 177.200.000)</option>
                                <option value="182700000|CALYA 1.2 G M/T">CALYA 1.2 G M/T (Rp 182.700.000)</option>
                                <option value="195600000|CALYA 1.2 G A/T">CALYA 1.2 G A/T (Rp 195.600.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA AGYA">
                                <option value="185100000|AGYA 1.2 G M/T">AGYA 1.2 G M/T (Rp 185.100.000)</option>
                                <option value="201300000|AGYA 1.2 G A/T">AGYA 1.2 G A/T (Rp 201.300.000)</option>
                                <option value="206000000|AGYA 1.2 STYLIX A/T">AGYA 1.2 STYLIX A/T (Rp 206.000.000)</option>
                                <option value="241400000|AGYA 1.2 GR SPORT M/T">AGYA 1.2 GR SPORT M/T (Rp 241.400.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA YARIS CROSS">
                                <option value="360000000|YARIS CROSS 1.5 G M/T">YARIS CROSS 1.5 G M/T (Rp 360.000.000)</option>
                                <option value="375000000|YARIS CROSS 1.5 G CVT">YARIS CROSS 1.5 G CVT (Rp 375.000.000)</option>
                                <option value="416000000|YARIS CROSS 1.5 S CVT">YARIS CROSS 1.5 S CVT (Rp 416.000.000)</option>
                                <option value="440600000|YARIS CROSS 1.5 S HV CVT">YARIS CROSS 1.5 S Hybrid CVT (Rp 440.600.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA FORTUNER">
                                <option value="564200000|FORTUNER 2.8 VRZ 4X2 A/T">FORTUNER 2.8 VRZ 4x2 A/T (Rp 564.200.000)</option>
                                <option value="618000000|FORTUNER 2.8 GR SPORT 4X2 A/T">FORTUNER 2.8 GR Sport 4x2 A/T (Rp 618.000.000)</option>
                                <option value="726000000|FORTUNER 2.8 GR SPORT 4X4 A/T">FORTUNER 2.8 GR Sport 4x4 A/T (Rp 726.000.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA RAIZE">
                                <option value="241000000|RAIZE 1.2 G M/T">RAIZE 1.2 G M/T (Rp 241.000.000)</option>
                                <option value="256000000|RAIZE 1.2 G CVT">RAIZE 1.2 G CVT (Rp 256.000.000)</option>
                                <option value="265000000|RAIZE 1.0T G CVT">RAIZE 1.0T G CVT (Rp 265.000.000)</option>
                                <option value="290000000|RAIZE 1.0T GR SPORT CVT">RAIZE 1.0T GR Sport CVT (Rp 290.000.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA RUSH">
                                <option value="284400000|RUSH 1.5 G M/T">RUSH 1.5 G M/T (Rp 284.400.000)</option>
                                <option value="295200000|RUSH 1.5 G A/T">RUSH 1.5 G A/T (Rp 295.200.000)</option>
                                <option value="299000000|RUSH 1.5 S GR SPORT M/T">RUSH 1.5 S GR SPORT M/T (Rp 299.000.000)</option>
                                <option value="310400000|RUSH 1.5 S GR SPORT A/T">RUSH 1.5 S GR SPORT A/T (Rp 310.400.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA HILUX &amp; RANGGA">
                                <option value="210000000|HILUX RANGGA CAB CHASSIS">HILUX RANGGA Cab Chassis (Rp 210.000.000)</option>
                                <option value="245000000|HILUX RANGGA PICK UP DSL">HILUX RANGGA Pick Up Diesel (Rp 245.000.000)</option>
                                <option value="283700000|HILUX SINGLE CABIN 2.0 GAS">HILUX Single Cabin 2.0 Bensin (Rp 283.700.000)</option>
                                <option value="305800000|HILUX SINGLE CABIN 2.4 DSL">HILUX Single Cabin 2.4 Diesel (Rp 305.800.000)</option>
                                <option value="442200000|HILUX DOUBLE CABIN 2.4 E 4X4">HILUX Double Cabin 2.4 E 4x4 (Rp 442.200.000)</option>
                                <option value="526500000|HILUX DOUBLE CABIN 2.4 V 4X4">HILUX Double Cabin 2.4 V 4x4 (Rp 526.500.000)</option>
                            </optgroup>
                            <optgroup label="TOYOTA ALPHARD &amp; VOXY">
                                <option value="621800000|VOXY 2.0 CVT">VOXY 2.0 CVT (Rp 621.800.000)</option>
                                <option value="1288000000|ALPHARD 2.5 X CVT">ALPHARD 2.5 X CVT (Rp 1.288.000.000)</option>
                                <option value="1652100000|ALPHARD 2.5 G CVT">ALPHARD 2.5 G CVT (Rp 1.652.100.000)</option>
                                <option value="1737400000|ALPHARD 2.5 G HYBRID">ALPHARD 2.5 G Hybrid CVT (Rp 1.737.400.000)</option>
                            </optgroup>
                        </select>
                    </div>

                    <!-- Input Harga OTR -->
                    <div class="form-group">
                        <label class="form-label">Harga OTR Kendaraan (Rp)</label>
                        <div class="input-with-prefix">
                            <span class="input-prefix">Rp</span>
                            <input class="form-input-styled" type="text" id="inputHarga" inputmode="numeric" placeholder="263.500.000" value="263.500.000" oninput="formatInput(this)" onblur="syncHarga(this.value)" />
                        </div>
                        <div class="range-slider-wrapper">
                            <input class="calc-range-slider" type="range" id="rangeHarga" min="100000000" max="1500000000" step="5000000" value="263500000" oninput="updateHarga(this.value)" />
                            <div class="range-scale-labels">
                                <span>Rp 100 Jt</span>
                                <span>Rp 750 Jt</span>
                                <span>Rp 1,5 M+</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CARD 2: UANG MUKA (TDP) & TENOR -->
                <div class="calc-card">
                    <div class="calc-card-header">
                        <div class="calc-card-icon blue">
                            <i class="fa-solid fa-coins"></i>
                        </div>
                        <div>
                            <h3 class="calc-card-title">2. Skema Uang Muka (TDP) &amp; Tenor</h3>
                            <p class="calc-card-subtitle">Tentukan besaran DP awal dan lama masa angsuran kredit</p>
                        </div>
                    </div>

                    <!-- Uang Muka (TDP) -->
                    <div class="form-group">
                        <label class="form-label">Uang Muka / TDP Murni (Rp)</label>
                        <div class="input-with-prefix">
                            <span class="input-prefix">Rp</span>
                            <input class="form-input-styled" type="text" id="inputTdp" inputmode="numeric" placeholder="52.700.000" value="52.700.000" oninput="formatInput(this)" onblur="syncTdp(this.value)" />
                        </div>
                        <div class="range-slider-wrapper">
                            <input class="calc-range-slider" type="range" id="rangeTdp" min="10000000" max="500000000" step="2000000" value="52700000" oninput="updateTdp(this.value)" />
                        </div>

                        <!-- Quick Percentage Chips -->
                        <div class="dp-chips-group">
                            <button type="button" class="dp-chip-btn" data-pct="15" onclick="setDpPersen(15, this)">15% (Min)</button>
                            <button type="button" class="dp-chip-btn active" data-pct="20" onclick="setDpPersen(20, this)">20% (Standar)</button>
                            <button type="button" class="dp-chip-btn" data-pct="25" onclick="setDpPersen(25, this)">25% (Ideal)</button>
                            <button type="button" class="dp-chip-btn" data-pct="30" onclick="setDpPersen(30, this)">30% (Hemat)</button>
                            <button type="button" class="dp-chip-btn" data-pct="40" onclick="setDpPersen(40, this)">40%</button>
                            <button type="button" class="dp-chip-btn" data-pct="50" onclick="setDpPersen(50, this)">50%</button>
                        </div>
                    </div>

                    <!-- Tenor Pembiayaan -->
                    <div class="form-group">
                        <label class="form-label">Jangka Waktu Kredit (Tenor)</label>
                        <div class="tenor-grid-styled">
                            <div class="tenor-card-btn" onclick="setTenor(1, this)">
                                <span class="t-num">1</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">12 bln</span>
                            </div>
                            <div class="tenor-card-btn" onclick="setTenor(2, this)">
                                <span class="t-num">2</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">24 bln</span>
                            </div>
                            <div class="tenor-card-btn active" onclick="setTenor(3, this)">
                                <span class="t-num">3</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">36 bln</span>
                            </div>
                            <div class="tenor-card-btn" onclick="setTenor(4, this)">
                                <span class="t-num">4</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">48 bln</span>
                            </div>
                            <div class="tenor-card-btn" onclick="setTenor(5, this)">
                                <span class="t-num">5</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">60 bln</span>
                            </div>
                            <div class="tenor-card-btn" onclick="setTenor(6, this)">
                                <span class="t-num">6</span>
                                <span class="t-unit">Tahun</span>
                                <span class="t-sub">72 bln</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- CARD 3: LEMBAGA LEASING & METODE BUNGA -->
                <div class="calc-card">
                    <div class="calc-card-header">
                        <div class="calc-card-icon green">
                            <i class="fa-solid fa-scale-balanced"></i>
                        </div>
                        <div>
                            <h3 class="calc-card-title">3. Lembaga Pembiayaan &amp; Metode Bunga</h3>
                            <p class="calc-card-subtitle">Pilih leasing rekanan dan formula suku bunga acuan</p>
                        </div>
                    </div>

                    <!-- Lembaga Leasing -->
                    <div class="form-group">
                        <label class="form-label">Pilihan Lembaga Pembiayaan (Leasing)</label>
                        <select class="form-select-styled" id="selectLeasing" onchange="hitung()">
                            <option value="TAF (Toyota Astra Financial)" selected>TAF (Toyota Astra Financial) - Resmi Toyota</option>
                            <option value="ACC (Astra Credit Companies)">ACC (Astra Credit Companies) - Resmi Astra</option>
                            <option value="BCA Finance">BCA Finance - Suku Bunga Terendah</option>
                            <option value="Mandiri Tunas Finance (MTF)">Mandiri Tunas Finance (MTF)</option>
                            <option value="Adira Finance">Adira Finance - DP Paling Fleksibel</option>
                            <option value="Maybank Finance">Maybank Finance</option>
                        </select>
                    </div>

                    <!-- Wilayah / Suku Bunga Acuan -->
                    <div class="form-group">
                        <label class="form-label">Wilayah &amp; Bunga Acuan</label>
                        <select class="form-select-styled" id="selectProvinsi" onchange="updateBunga()">
                            <option value="0.0895" selected>Jawa Barat - Bandung (8,95% p.a.)</option>
                            <option value="0.0875">DKI Jakarta &amp; Banten (8,75% p.a.)</option>
                            <option value="0.0910">Jawa Tengah &amp; DIY (9,10% p.a.)</option>
                            <option value="0.0920">Jawa Timur (9,20% p.a.)</option>
                            <option value="0.0950">Luar Pulau Jawa (9,50% p.a.)</option>
                        </select>
                        <div style="margin-top:6px;">
                            <span class="calc-badge-live" style="background:#eff6ff; border-color:#bfdbfe; color:#1d4ed8;" id="bungaText">
                                <i class="fa-solid fa-percent"></i> Bunga Acuan 8,95% p.a.
                            </span>
                        </div>
                    </div>

                    <!-- Metode Perhitungan Bunga -->
                    <div class="form-group">
                        <label class="form-label">Metode Perhitungan Bunga</label>
                        <div class="method-tabs-styled">
                            <button type="button" class="method-btn active" id="tabFlat" onclick="setMetode('flat', this)">
                                <i class="fa-solid fa-equals"></i> Flat Rate
                            </button>
                            <button type="button" class="method-btn" id="tabEffektif" onclick="setMetode('efektif', this)">
                                <i class="fa-solid fa-chart-line"></i> Efektif
                            </button>
                            <button type="button" class="method-btn" id="tabAnuitas" onclick="setMetode('anuitas', this)">
                                <i class="fa-solid fa-wave-square"></i> Anuitas
                            </button>
                        </div>
                    </div>

                    <!-- Accordion Biaya Tambahan (Admin & Asuransi) -->
                    <div class="fees-accordion-toggle" onclick="document.getElementById('extraFeesBox').style.display = document.getElementById('extraFeesBox').style.display === 'none' ? 'block' : 'none'">
                        <span><i class="fa-solid fa-sliders" style="margin-right:6px; color:#64748b;"></i> Sesuaikan Biaya Admin &amp; Asuransi (Opsional)</span>
                        <i class="fa-solid fa-chevron-down" style="font-size:11px;"></i>
                    </div>

                    <div id="extraFeesBox" style="display:none; padding:12px; background:#f8fafc; border-radius:12px; margin-bottom:14px; border:1px solid #e2e8f0;">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                            <div>
                                <label class="form-label" style="font-size:11px;">Biaya Administrasi (Rp)</label>
                                <input type="text" class="form-input-styled" id="inputAdmin" value="2.500.000" oninput="formatInput(this)" onblur="hitung()" style="font-size:14px; padding:8px 12px;" />
                            </div>
                            <div>
                                <label class="form-label" style="font-size:11px;">Biaya Asuransi (Rp)</label>
                                <input type="text" class="form-input-styled" id="inputAsuransi" value="0" oninput="formatInput(this)" onblur="hitung()" placeholder="0 (Include)" style="font-size:14px; padding:8px 12px;" />
                            </div>
                        </div>
                        <p style="margin:6px 0 0; font-size:10.5px; color:#64748b;">*Kosongkan asuransi jika premi sudah menyatu dalam skema angsuran kredit.</p>
                    </div>

                    <!-- Tombol Hitung Ulang -->
                    <button type="button" class="btn-calc-main" id="btnCalc" onclick="hitung()">
                        <i class="fa-solid fa-wand-magic-sparkles"></i>
                        <span>Hitung Ulang Simulasi</span>
                    </button>
                </div>

            </div>

            <!-- ══════════════════════════════════════════════════════════════════
                 RIGHT COLUMN: EXECUTIVE RESULT CARD (STICKY ON DESKTOP)
            ══════════════════════════════════════════════════════════════════ -->
            <div class="calc-result-column">

                <!-- RESULT CARD -->
                <div class="result-card-executive" id="resultCard">
                    <div class="res-header">
                        <span class="res-label-top">Estimasi Angsuran Bulanan</span>
                        <span class="res-tag-verified"><i class="fa-solid fa-circle-check"></i> Resmi &amp; Valid</span>
                    </div>

                    <!-- Hero Amount Display -->
                    <div class="res-hero-box">
                        <div class="res-hero-amount" id="resultAmount">Rp 0</div>
                        <div class="res-hero-sub" id="resultPeriod">36 bulan (3 tahun)</div>
                    </div>

                    <!-- Rate Pill -->
                    <div class="res-rate-pill" id="resultRateBadge">
                        <i class="fa-solid fa-percent"></i>
                        <span id="resultRateText">8,95% p.a. · Jawa Barat · Flat Rate</span>
                    </div>

                    <!-- Rincian Finansial -->
                    <div class="res-breakdown-grid">
                        <div class="b-item">
                            <div class="b-label">Harga OTR Resmi</div>
                            <div class="b-val" id="brkHarga">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Uang Muka (DP Murni)</div>
                            <div class="b-val accent-green" id="brkTdpMurni">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Est. TDP Total Awal</div>
                            <div class="b-val accent-red" id="brkTdp">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Pokok Hutang Pinjaman</div>
                            <div class="b-val" id="brkPokok">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Total Bunga Tenor</div>
                            <div class="b-val" id="brkBunga">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Total Pembayaran</div>
                            <div class="b-val" id="brkTotal">Rp 0</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Lembaga Pembiayaan</div>
                            <div class="b-val" id="brkLeasing">TAF</div>
                        </div>
                        <div class="b-item">
                            <div class="b-label">Metode Bunga</div>
                            <div class="b-val" id="brkMetode">Flat Rate</div>
                        </div>
                    </div>

                    <!-- Extra detail for Print -->
                    <div id="printExtraDetails" style="display:none;">
                        <div style="font-size:11px; font-weight:700; margin-bottom:4px;">Rincian Komponen Pembayaran Awal:</div>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:6px; font-size:12px;">
                            <div>Biaya Admin: <strong id="brkAdmin">-</strong></div>
                            <div>Premi Asuransi: <strong id="brkAsuransi">-</strong></div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="res-actions-stack">
                        <!-- ACTION 1: AJUKAN KE FORM SPK -->
                        <button type="button" class="btn-action-spk" onclick="proceedSimulationToSpk()" title="Pindahkan data simulasi ini ke Form Pemesanan Kendaraan (SPK)">
                            <i class="fa-solid fa-file-signature"></i>
                            <span>Ajukan Form SPK dengan Simulasi Ini</span>
                            <i class="fa-solid fa-arrow-right" style="font-size:11px; opacity:0.8; margin-left:auto;"></i>
                        </button>

                        <!-- ACTION 2: BAGIKAN KE WHATSAPP -->
                        <button type="button" class="btn-action-wa" onclick="shareToWhatsApp()" title="Kirim ringkasan penawaran resmi ke nomor WhatsApp calon konsumen">
                            <i class="fa-brands fa-whatsapp" style="font-size:17px;"></i>
                            <span>Bagikan Ringkasan Penawaran ke WA</span>
                        </button>

                        <!-- ACTION 3: PRINT & COMPARE -->
                        <div class="res-secondary-actions">
                            <button type="button" class="btn-action-print" onclick="window.print()" title="Cetak atau Unduh Dokumen PDF">
                                <i class="fa-solid fa-print"></i> Cetak / PDF
                            </button>
                            <button type="button" class="btn-action-compare" onclick="addToCompare()" title="Simpan skema ini ke komparasi opsi">
                                <i class="fa-solid fa-code-compare"></i> Bandingkan
                            </button>
                        </div>
                    </div>
                </div>

                <!-- KOMPARASI PAKET DRAWER (JIKA ADA PILIHAN) -->
                <div class="compare-drawer" id="comparisonContainer" style="display:none;">
                    <div class="compare-drawer-header">
                        <h4 class="compare-drawer-title">
                            <i class="fa-solid fa-code-compare" style="color:var(--primary-blue);"></i> Komparasi Opsi Paket
                        </h4>
                        <button type="button" class="compare-clear-btn" onclick="clearCompare()">
                            <i class="fa-solid fa-trash-can"></i> Hapus
                        </button>
                    </div>
                    <div class="compare-scroll-list" id="compareList"></div>
                </div>

                <!-- REAL-TIME MULTI-LEASING RATE MATRIX -->
                <div class="multi-leasing-container" id="multiLeasingCard">
                    <div class="multi-leasing-title-row">
                        <h4 class="multi-leasing-h">
                            <i class="fa-solid fa-building-columns" style="color:var(--primary-blue);"></i>
                            Komparasi Leasing Rekanan
                        </h4>
                        <span class="multi-leasing-tag">Rate Real-Time</span>
                    </div>
                    <div id="multiLeasingList"></div>
                </div>

            </div>

        </div>
    </div>

    <!-- Scripts -->
    <script src="../custom_alert.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script src="../js/kalkulator.js?v={{ time() }}"></script>
</body>

</html>
