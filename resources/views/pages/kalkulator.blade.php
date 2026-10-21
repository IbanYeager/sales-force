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
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
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
            <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <button type="button" class="btn-top-flyer" onclick="openFlyerStudioModal()" title="Buka Studio Pembuat Flyer Promo">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span>Studio Flyer Promo</span>
                    <span class="badge-hot" style="font-size:9px; padding:1px 6px;">Baru</span>
                </button>
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

        <!-- ── SEGMENTED TAB BAR (FEATURE 2: KALKULATOR VS MATCHMAKER) ── -->
        <div class="calc-mode-segmented-tabs">
            <button type="button" class="calc-mode-tab-btn active" id="tabModeKalkulator" onclick="switchCalcMainMode('kalkulator')">
                <i class="fa-solid fa-calculator"></i>
                <span>Kalkulator Simulasi Cicilan</span>
            </button>
            <button type="button" class="calc-mode-tab-btn" id="tabModeMatchmaker" onclick="switchCalcMainMode('matchmaker')">
                <i class="fa-solid fa-bullseye"></i>
                <span>🎯 Budget Matchmaker (Pencari Mobil)</span>
                <span class="calc-tab-badge">Baru</span>
            </button>
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

                <!-- ══════════════════════════════════════════════════════════════════
                     FEATURE 3: TUKAR TAMBAH / TRADE-IN MOBIL LAMA (AUTO-BRIDGE DP)
                ══════════════════════════════════════════════════════════════════ -->
                <div class="tradein-box-card">
                    <div class="tradein-head-row">
                        <h4 class="tradein-head-title">
                            <i class="fa-solid fa-arrows-rotate" style="color:#d97706;"></i>
                            <span>Tukar Tambah Mobil Lama (Trade-In)</span>
                        </h4>
                        <div style="display:flex; align-items:center; gap:8px;">
                            <span class="tradein-badge-pill"><i class="fa-solid fa-bolt"></i> Auto-Bridge DP</span>
                            <label style="position:relative; display:inline-block; width:44px; height:24px; margin:0;">
                                <input type="checkbox" id="checkTradeInEnable" onchange="toggleTradeInBox(this.checked)" style="opacity:0; width:0; height:0;">
                                <span style="position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#cbd5e1; transition:.3s; border-radius:24px;" id="tradeInToggleSlider"></span>
                            </label>
                        </div>
                    </div>
                    <p style="font-size:12px; color:#64748b; margin:0 0 14px;">Taksir nilai pasar mobil lama konsumen &amp; potongkan langsung ke DP mobil Toyota baru.</p>

                    <div id="tradeInFormContent" style="display:none;">
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
                            <div>
                                <label class="form-label" style="font-size:11px;">Merk Mobil Lama</label>
                                <select id="tiMerk" class="form-select-styled" onchange="updateTradeInModels(); calcTradeInAppraisal();">
                                    <option value="Toyota" selected>Toyota</option>
                                    <option value="Daihatsu">Daihatsu</option>
                                    <option value="Honda">Honda</option>
                                    <option value="Suzuki">Suzuki</option>
                                    <option value="Mitsubishi">Mitsubishi</option>
                                    <option value="Nissan">Nissan</option>
                                    <option value="Hyundai">Hyundai</option>
                                    <option value="Wuling">Wuling</option>
                                    <option value="Lainnya">Lainnya</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label" style="font-size:11px;">Model / Varian Lama</label>
                                <input type="text" id="tiModel" class="form-input-styled" placeholder="Misal: Avanza G, Brio E, Xpander..." value="Avanza 1.3 G M/T" oninput="calcTradeInAppraisal()" style="font-size:12.5px; padding:10px 12px;">
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:12px;">
                            <div>
                                <label class="form-label" style="font-size:11px;">Tahun</label>
                                <select id="tiTahun" class="form-select-styled" onchange="calcTradeInAppraisal()">
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                    <option value="2019">2019</option>
                                    <option value="2018" selected>2018</option>
                                    <option value="2017">2017</option>
                                    <option value="2016">2016</option>
                                    <option value="2015">2015</option>
                                    <option value="2014">2014</option>
                                    <option value="2013">2013</option>
                                    <option value="2012">2012</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label" style="font-size:11px;">Transmisi</label>
                                <select id="tiTrans" class="form-select-styled" onchange="calcTradeInAppraisal()">
                                    <option value="Manual" selected>Manual</option>
                                    <option value="Matic">Matic (AT/CVT)</option>
                                </select>
                            </div>
                            <div>
                                <label class="form-label" style="font-size:11px;">Kondisi Fisik</label>
                                <select id="tiKondisi" class="form-select-styled" onchange="calcTradeInAppraisal()">
                                    <option value="1.0" selected>Istimewa (Mulus)</option>
                                    <option value="0.94">Standar Pakai</option>
                                    <option value="0.87">Perlu Rekondisi</option>
                                </select>
                            </div>
                        </div>

                        <!-- Status Kredit Mobil Lama -->
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px; margin-bottom:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <label class="form-label" style="margin:0; font-size:11.5px; cursor:pointer;" for="tiIsOverKredit">
                                    <input type="checkbox" id="tiIsOverKredit" onchange="toggleOverKreditInputs(this.checked); calcTradeInAppraisal();" style="margin-right:6px;">
                                    Mobil Masih Dalam Masa Kredit (Over-Kredit)
                                </label>
                            </div>
                            <div id="overKreditRow" style="display:none; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px;">
                                <div>
                                    <label class="form-label" style="font-size:10.5px;">Sisa Cicilan (Bulan)</label>
                                    <input type="number" id="tiSisaBulan" class="form-input-styled" value="12" min="1" max="72" oninput="calcTradeInAppraisal()" style="font-size:12px; padding:6px 10px;">
                                </div>
                                <div>
                                    <label class="form-label" style="font-size:10.5px;">Angsuran / Bln (Rp)</label>
                                    <input type="text" id="tiAngsuranLama" class="form-input-styled" value="3.500.000" oninput="formatInput(this); calcTradeInAppraisal();" style="font-size:12px; padding:6px 10px;">
                                </div>
                            </div>
                        </div>

                        <!-- Valuation Result Box -->
                        <div class="tradein-result-highlight">
                            <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; color:#94a3b8;">
                                <span>Estimasi Taksiran Pasar Wajar:</span>
                                <span style="background:rgba(255,255,255,0.15); color:#fde047; padding:2px 8px; border-radius:6px; font-weight:800;">Appraisal Instan</span>
                            </div>
                            <div class="tradein-val-amount" id="tiNilaiPasarText">Rp 145.000.000</div>
                            <div style="font-size:11px; color:#38bdf8;" id="tiSubInfoText">Avanza 1.3 G M/T (2018) + Subsidi Tunas Rp 3.000.000</div>

                            <div style="background:rgba(255,255,255,0.08); border-radius:10px; padding:10px 12px; margin-top:10px; font-size:12px; line-height:1.5;">
                                <div style="display:flex; justify-content:space-between;">
                                    <span style="color:#cbd5e1;">Nilai Bersih Mobil Lama:</span>
                                    <strong style="color:#4ade80;" id="tiNilaiBersihText">Rp 148.000.000</strong>
                                </div>
                                <div style="display:flex; justify-content:space-between; margin-top:4px;">
                                    <span style="color:#cbd5e1;">DP Toyota Baru yang Dibutuhkan:</span>
                                    <strong style="color:#ffffff;" id="tiDpBaruDibutuhkanText">Rp 52.700.000</strong>
                                </div>
                                <div style="border-top:1px dashed rgba(255,255,255,0.2); margin:8px 0;"></div>
                                <div id="tiStatusSolusiText" style="color:#fde047; font-weight:800; font-size:12px;">
                                    🎉 Nilai mobil lama menutup 100% DP baru! Sisa uang tunai kembali ke konsumen: Rp 95.300.000
                                </div>
                            </div>

                            <button type="button" class="btn-bridge-dp" onclick="applyTradeInToKalkulator()">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                                <span>Terapkan Nilai Mobil Lama Jadi DP Unit Baru</span>
                            </button>
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

                        <!-- ACTION: BUAT FLYER PROMO (FITUR 1) -->
                        <button type="button" class="btn-action-flyer" onclick="openFlyerStudioModal()" title="Buat poster promosi visual beresolusi tinggi untuk WhatsApp Status & Instagram Story">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Buat Poster / Flyer Promo WA</span>
                            <span class="badge-hot"><i class="fa-solid fa-fire"></i> Viral</span>
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

        <!-- ══════════════════════════════════════════════════════════════════
             FEATURE 2: BUDGET MATCHMAKER VIEW (CARI MOBIL SESUAI ANGGARAN)
        ══════════════════════════════════════════════════════════════════ -->
        <div id="sectionMatchmaker" style="display:none;">
            <!-- Hero Card -->
            <div class="matchmaker-hero-card">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px;">
                    <div>
                        <span style="background:rgba(255,255,255,0.18); color:#fde047; font-size:11px; font-weight:800; padding:4px 12px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px; display:inline-flex; align-items:center; gap:6px;">
                            <i class="fa-solid fa-bullseye"></i> Smart Buyer Matchmaker
                        </span>
                        <h2 style="font-family:'Outfit', sans-serif; font-size:22px; font-weight:800; margin:8px 0 4px; color:#ffffff;">
                            Pencari Mobil Toyota Berdasarkan Anggaran Konsumen
                        </h2>
                        <p style="font-size:12.5px; color:rgba(255,255,255,0.85); margin:0; max-width:620px;">
                            Masukkan batas maksimal uang muka (DP) dan kemampuan cicilan bulanan calon konsumen. Sistem otomatis memfilter mobil Toyota yang paling pas dan merekomendasikan opsi terbaik!
                        </p>
                    </div>
                    <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:16px; padding:12px 20px; text-align:center; min-width:96px; backdrop-filter:blur(6px);">
                        <div style="font-size:26px; font-weight:900; color:#fde047; font-family:'Outfit', sans-serif; line-height:1;" id="mmHeroCountNumber">0</div>
                        <div style="font-size:10px; font-weight:800; color:#cbd5e1; text-transform:uppercase; letter-spacing:0.5px; margin-top:4px;">Pilihan Unit</div>
                    </div>
                </div>
            </div>

            <!-- Filters Form Card -->
            <div class="matchmaker-filter-card">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap:18px;">
                    <!-- Filter 1: Budget DP -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label class="form-label" style="margin:0;"><i class="fa-solid fa-wallet" style="color:#0284c7;"></i> Budget DP Maksimal</label>
                            <span style="font-size:12px; font-weight:800; color:#0284c7;" id="lblMmDpVal">Rp 35.000.000</span>
                        </div>
                        <input type="text" class="form-input-styled" id="mmInputDp" value="35.000.000" oninput="formatInput(this); runBudgetMatchmaker();" style="font-size:15px; font-weight:800; padding:10px 14px;">
                        <div class="matchmaker-quick-chips">
                            <span class="chip-quick" onclick="setMmDp(15000000)">15 Jt</span>
                            <span class="chip-quick" onclick="setMmDp(25000000)">25 Jt</span>
                            <span class="chip-quick active" onclick="setMmDp(35000000)">35 Jt</span>
                            <span class="chip-quick" onclick="setMmDp(50000000)">50 Jt</span>
                            <span class="chip-quick" onclick="setMmDp(75000000)">75 Jt</span>
                            <span class="chip-quick" onclick="setMmDp(100000000)">100 Jt+</span>
                        </div>
                    </div>

                    <!-- Filter 2: Budget Angsuran -->
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                            <label class="form-label" style="margin:0;"><i class="fa-solid fa-coins" style="color:#d97706;"></i> Cicilan Maksimal / Bulan</label>
                            <span style="font-size:12px; font-weight:800; color:#d97706;" id="lblMmCicilanVal">Rp 4.500.000</span>
                        </div>
                        <input type="text" class="form-input-styled" id="mmInputCicilan" value="4.500.000" oninput="formatInput(this); runBudgetMatchmaker();" style="font-size:15px; font-weight:800; padding:10px 14px;">
                        <div class="matchmaker-quick-chips">
                            <span class="chip-quick" onclick="setMmCicilan(3000000)">3 Jt</span>
                            <span class="chip-quick" onclick="setMmCicilan(4000000)">4 Jt</span>
                            <span class="chip-quick active" onclick="setMmCicilan(4500000)">4.5 Jt</span>
                            <span class="chip-quick" onclick="setMmCicilan(6000000)">6 Jt</span>
                            <span class="chip-quick" onclick="setMmCicilan(8000000)">8 Jt</span>
                            <span class="chip-quick" onclick="setMmCicilan(12000000)">12 Jt+</span>
                        </div>
                    </div>

                    <!-- Filter 3: Kategori & Tenor -->
                    <div>
                        <label class="form-label"><i class="fa-solid fa-car" style="color:#7c3aed;"></i> Preferensi Kategori</label>
                        <select id="mmSelectKategori" class="form-select-styled" onchange="runBudgetMatchmaker()">
                            <option value="ALL" selected>Semua Model Toyota</option>
                            <option value="MPV">MPV Keluarga (Calya, Avanza, Veloz, Zenix)</option>
                            <option value="SUV">SUV Tangguh (Raize, Rush, Yaris Cross, Fortuner)</option>
                            <option value="HATCHBACK">Hatchback / City Car (Agya, Yaris)</option>
                            <option value="COMMERCIAL">Komersial / Usaha (Rangga, Hilux, HiAce)</option>
                        </select>
                        <div style="display:flex; align-items:center; justify-content:space-between; margin-top:10px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:6px 12px;">
                            <span style="font-size:11.5px; font-weight:700; color:#64748b;"><i class="fa-regular fa-clock" style="color:#0284c7; margin-right:4px;"></i> Tenor:</span>
                            <select id="mmSelectTenor" class="form-select-styled" onchange="runBudgetMatchmaker()" style="width:auto; padding:4px 8px; font-size:11.5px; font-weight:700; border:none; background:transparent;">
                                <option value="5" selected>5 Tahun (60 Bln)</option>
                                <option value="4">4 Tahun (48 Bln)</option>
                                <option value="3">3 Tahun (36 Bln)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Matchmaker Results Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
                <div style="font-size:14px; font-weight:800; color:#0f172a;" id="mmResultCountText">
                    Ditemukan 0 Model yang Masuk Kualifikasi Anggaran
                </div>
                <button type="button" class="btn-refresh-pill" onclick="runBudgetMatchmaker()">
                    <i class="fa-solid fa-rotate-right"></i> Segarkan Pencocokan
                </button>
            </div>

            <!-- Results Grid -->
            <div class="matchmaker-results-grid" id="mmResultsGrid">
                <!-- Dynamically populated -->
            </div>
        </div>

        <!-- ══════════════════════════════════════════════════════════════════
             FEATURE 1: STUDIO FLYER PROMO TOYOTA (MODAL POPUP)
        ══════════════════════════════════════════════════════════════════ -->
        <div id="flyerStudioModal" class="flyer-modal-overlay" style="display:none;" onclick="closeFlyerStudioModal(event)">
            <div class="flyer-modal-shell" onclick="event.stopPropagation()">
                <!-- Modal Head -->
                <div class="flyer-modal-head">
                    <div style="display:flex; align-items:center; gap:12px;">
                        <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%); display:flex; align-items:center; justify-content:center; color:#fde047; font-size:16px;">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                        </div>
                        <div>
                            <h3 style="margin:0; font-size:16px; font-weight:800; font-family:'Outfit', sans-serif;">Studio Poster / Flyer Promo WhatsApp</h3>
                            <p style="margin:2px 0 0; font-size:11.5px; color:#94a3b8;">Render flyer estetik resolusi tinggi dalam 1 klik untuk Story &amp; Chat</p>
                        </div>
                    </div>
                    <button type="button" onclick="closeFlyerStudioModal()" style="background:rgba(255,255,255,0.12); border:none; width:34px; height:34px; border-radius:50%; color:white; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <!-- Modal Body -->
                <div class="flyer-modal-body">
                    <!-- Left: Live Preview Canvas -->
                    <div style="display:flex; flex-direction:column; gap:12px;">
                        <div class="flyer-canvas-container">
                            <canvas id="flyerCanvas" width="1080" height="1920" style="display:none;"></canvas>
                            <img id="flyerCanvasPreviewImg" class="flyer-canvas-preview" alt="Flyer Promo Preview">
                        </div>
                        <div style="display:flex; gap:8px;">
                            <button type="button" class="btn" style="flex:1; background:linear-gradient(135deg, #059669 0%, #10b981 100%); color:white; border:none; border-radius:12px; padding:12px 14px; font-weight:800; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:8px; box-shadow:0 4px 12px rgba(16,185,129,0.3);" onclick="downloadFlyerImage()">
                                <i class="fa-solid fa-download"></i> Unduh Gambar (PNG)
                            </button>
                            <button type="button" class="btn" style="background:#25D366; color:white; border:none; border-radius:12px; padding:12px 16px; font-weight:800; font-size:13px; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px; box-shadow:0 4px 12px rgba(37,211,102,0.3);" onclick="shareFlyerCaptionWA()">
                                <i class="fa-brands fa-whatsapp"></i> Bagikan WA
                            </button>
                        </div>
                    </div>

                    <!-- Right: Customizer Controls -->
                    <div style="display:flex; flex-direction:column; gap:14px;">
                        <!-- Format Ratio Switcher -->
                        <div>
                            <label class="form-label" style="font-size:11.5px;"><i class="fa-solid fa-crop"></i> Ukuran Format Poster</label>
                            <div style="display:flex; gap:8px;">
                                <button type="button" class="chip-quick active" id="btnRatioStory" onclick="setFlyerRatio('9:16', this)" style="flex:1; padding:8px 12px; border-radius:10px; font-size:12px;">
                                    <i class="fa-solid fa-mobile-screen"></i> WA / IG Story (9:16)
                                </button>
                                <button type="button" class="chip-quick" id="btnRatioSquare" onclick="setFlyerRatio('1:1', this)" style="flex:1; padding:8px 12px; border-radius:10px; font-size:12px;">
                                    <i class="fa-solid fa-square"></i> Feed / Chat (1:1)
                                </button>
                            </div>
                        </div>

                        <!-- Theme Picker -->
                        <div>
                            <label class="form-label" style="font-size:11.5px;"><i class="fa-solid fa-palette"></i> Tema Warna Poster</label>
                            <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px;">
                                <div onclick="setFlyerTheme('crimson', this)" class="theme-box-picker active" id="themeCrimson" style="cursor:pointer; border:2px solid #c8102e; border-radius:12px; padding:8px; text-align:center; background:#fff1f2;">
                                    <div style="height:20px; border-radius:6px; background:linear-gradient(135deg, #c8102e 0%, #7f1d1d 100%); margin-bottom:4px;"></div>
                                    <span style="font-size:10.5px; font-weight:800; color:#991b1b;">Toyota Red</span>
                                </div>
                                <div onclick="setFlyerTheme('navy', this)" class="theme-box-picker" id="themeNavy" style="cursor:pointer; border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center; background:#ffffff;">
                                    <div style="height:20px; border-radius:6px; background:linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%); margin-bottom:4px;"></div>
                                    <span style="font-size:10.5px; font-weight:800; color:#1e293b;">Executive Navy</span>
                                </div>
                                <div onclick="setFlyerTheme('gold', this)" class="theme-box-picker" id="themeGold" style="cursor:pointer; border:2px solid #e2e8f0; border-radius:12px; padding:8px; text-align:center; background:#ffffff;">
                                    <div style="height:20px; border-radius:6px; background:linear-gradient(135deg, #1e293b 0%, #d97706 100%); margin-bottom:4px;"></div>
                                    <span style="font-size:10.5px; font-weight:800; color:#1e293b;">Luxury Gold</span>
                                </div>
                            </div>
                        </div>

                        <!-- Headline & Tagline -->
                        <div>
                            <label class="form-label" style="font-size:11.5px;">Tag Promo Headline</label>
                            <input type="text" id="flyerHeadlineInput" class="form-input-styled" value="SPECIAL PROMO BULAN INI" oninput="renderFlyerCanvas()" style="font-size:12.5px; padding:8px 12px;">
                        </div>

                        <!-- Highlight Promosi TDP & Angsuran -->
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                            <div>
                                <label class="form-label" style="font-size:11px;">TDP Sorotan</label>
                                <input type="text" id="flyerTdpInput" class="form-input-styled" value="" oninput="renderFlyerCanvas()" style="font-size:12px; padding:8px 10px; font-weight:700;">
                            </div>
                            <div>
                                <label class="form-label" style="font-size:11px;">Angsuran Sorotan</label>
                                <input type="text" id="flyerCicilanInput" class="form-input-styled" value="" oninput="renderFlyerCanvas()" style="font-size:12px; padding:8px 10px; font-weight:700;">
                            </div>
                        </div>

                        <!-- Bonus Paket Tambahan -->
                        <div>
                            <label class="form-label" style="font-size:11.5px;">Bonus &amp; Benefit Pembelian</label>
                            <div style="display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:11.5px; color:#334155;">
                                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                    <input type="checkbox" id="chkBonusTcare" checked onchange="renderFlyerCanvas()"> Free Servis 3 Thn (T-Care)
                                </label>
                                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                    <input type="checkbox" id="chkBonusKaca" checked onchange="renderFlyerCanvas()"> Kaca Film Lumar
                                </label>
                                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                    <input type="checkbox" id="chkBonusKarpet" checked onchange="renderFlyerCanvas()"> Karpet &amp; Talang Air
                                </label>
                                <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
                                    <input type="checkbox" id="chkBonusApar" checked onchange="renderFlyerCanvas()"> APAR &amp; P3K Resmi
                                </label>
                            </div>
                        </div>

                        <!-- Sales Contact Details -->
                        <div style="background:#f1f5f9; border-radius:12px; padding:12px; border:1px solid #e2e8f0;">
                            <div style="font-size:11px; font-weight:800; color:#334155; margin-bottom:6px;">PROFIL SALES DI POSTER:</div>
                            <div style="display:grid; grid-template-columns:1.2fr 1fr; gap:8px;">
                                <input type="text" id="flyerSalesName" class="form-input-styled" placeholder="Nama Sales" value="Official Sales Consultant" oninput="renderFlyerCanvas()" style="font-size:12px; padding:6px 10px;">
                                <input type="text" id="flyerSalesPhone" class="form-input-styled" placeholder="No WhatsApp (08...)" value="081234567890" oninput="renderFlyerCanvas()" style="font-size:12px; padding:6px 10px;">
                            </div>
                        </div>

                        <!-- Copy Caption Button -->
                        <button type="button" class="btn" style="background:#f1f5f9; color:#1e293b; border:1.5px solid #cbd5e1; border-radius:10px; padding:10px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; justify-content:center; gap:6px;" onclick="copyFlyerPromoCaption()">
                            <i class="fa-solid fa-copy"></i> Salin Caption WhatsApp &amp; Medsos
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div id="hiddenFlyerQrCode" style="display:none;"></div>
    </div>

    <!-- Scripts -->
    <script src="../custom_alert.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script src="../js/kalkulator.js?v={{ time() }}"></script>
</body>

</html>
