<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Komparasi Mobil & Battle Matrix</title>
    <meta name="description" content="Perbandingan Head-to-Head Spesifikasi, NCO & Value Mobil vs Kompetitor">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <link rel="stylesheet" href="../css/nco_dashboard.css?v=1.0" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
    <style>
        .komp-header-tabs {
            display: flex;
            gap: 6px;
            background: #e2e8f0;
            padding: 4px;
            border-radius: 14px;
            margin-bottom: 18px;
            overflow-x: auto;
            scrollbar-width: none;
        }

        .komp-header-tabs::-webkit-scrollbar {
            display: none;
        }

        .nco-top-tab {
            flex: 1;
            min-width: max-content;
            padding: 10px 14px;
            border-radius: 10px;
            border: none;
            font-size: 0.78rem;
            font-weight: 700;
            color: #64748b;
            background: transparent;
            cursor: pointer;
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .nco-top-tab.active {
            background: #ffffff;
            color: #d7123a;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .komp-pane {
            display: none;
        }

        .komp-pane.active {
            display: block;
        }

        .battle-card {
            background: #ffffff;
            border-radius: var(--radius-lg, 16px);
            padding: 16px;
            border: 1px solid #e2e8f0;
            margin-bottom: 16px;
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
        }

        .vs-badge {
            width: 36px;
            height: 36px;
            background: var(--primary-red, #d7123a);
            color: #fff;
            font-weight: 900;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 13px;
            box-shadow: 0 4px 10px rgba(215, 18, 58, 0.3);
            margin: 0 auto;
        }

        .car-selector-box {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
            gap: 10px;
        }

        .radar-container {
            position: relative;
            width: 100%;
            max-width: 340px;
            height: 300px;
            margin: 0 auto;
        }

        .winner-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: #ecfdf5;
            color: #047857;
            border: 1px solid #a7f3d0;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 11.5px;
            font-weight: 700;
        }

        .spec-row {
            display: grid;
            grid-template-columns: 1fr 1.2fr 1fr;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 12.5px;
            text-align: center;
        }

        .spec-row:last-child {
            border-bottom: none;
        }

        .val-our {
            font-weight: 800;
            color: var(--primary-blue, #0d1b3e);
        }

        .val-comp {
            font-weight: 600;
            color: #64748b;
        }

        .val-label {
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            color: #94a3b8;
        }
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 1200px; margin: 0 auto; min-height: 100vh;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Komparasi Mobil &amp; NCO Dashboard</h2>
        </header>

        <div class="container" style="margin-top: 14px;">

            <!-- Header Segment Control Tabs -->
            <div class="komp-header-tabs">
                <button type="button" class="nco-top-tab active" onclick="switchKompTab('nco', this)">
                    <i class="fa-solid fa-calculator"></i> Kalkulator NCO (Spreadsheet)
                </button>
                <button type="button" class="nco-top-tab" onclick="switchKompTab('tables', this)">
                    <i class="fa-solid fa-table-list"></i> Tabel Specs &amp; Depresiasi
                </button>
                <button type="button" class="nco-top-tab" onclick="switchKompTab('battle', this)">
                    <i class="fa-solid fa-chart-radar"></i> Battle Radar (Head-to-Head)
                </button>
            </div>

            <!-- PANE 1: NCO Calculator (Spreadsheet Data) -->
            <div id="kompPane_nco" class="komp-pane active">
                <div class="nco-dashboard-card" style="margin-top: 0;">
                    <div class="nco-header-wrap">
                        <div class="nco-title-main">
                            <div class="nco-icon-wrapper">
                                <i class="fa-solid fa-scale-balanced"></i>
                            </div>
                            <div class="nco-title-text">
                                <h3>Kalkulator Nett Cost of Ownership (NCO)</h3>
                                <p>Komparasi Biaya Kepemilikan Nyata: Toyota (HEV) vs Non-Toyota (BEV/Gasoline)</p>
                            </div>
                        </div>
                        <span class="nco-live-badge"><span class="nco-live-dot"></span> Live Spreadsheet Data</span>
                    </div>

                    <!-- Controls: Model Selectors & Sliders -->
                    <div class="nco-controls-grid">
                        <div class="nco-control-box">
                            <label for="ncoToyotaSelect" class="nco-label">
                                <span><i class="fa-solid fa-car" style="color: #d7123a;"></i> Model Toyota (HEV / Gasoline)</span>
                            </label>
                            <select id="ncoToyotaSelect" class="nco-select"></select>
                        </div>

                        <div class="nco-control-box">
                            <label for="ncoNonToyotaSelect" class="nco-label">
                                <span><i class="fa-solid fa-car-side" style="color: #0284c7;"></i> Model Non-Toyota (BEV / HEV / Gas)</span>
                            </label>
                            <select id="ncoNonToyotaSelect" class="nco-select"></select>
                        </div>

                        <div class="nco-control-box">
                            <label for="ncoYearsSlider" class="nco-label">
                                <span><i class="fa-regular fa-calendar"></i> Durasi Pemakaian</span>
                                <span id="ncoYearsValue" style="color: #d7123a; font-weight: 800;">4 Tahun</span>
                            </label>
                            <input type="range" id="ncoYearsSlider" class="nco-slider" min="1" max="5" value="4" step="1">
                        </div>

                        <div class="nco-control-box">
                            <label for="ncoDailyKmSlider" class="nco-label">
                                <span><i class="fa-solid fa-gauge-high"></i> Estimasi Jarak Tempuh / Hari</span>
                                <span id="ncoDailyKmValue" style="color: #d7123a; font-weight: 800;">100 KM/Hari</span>
                            </label>
                            <input type="range" id="ncoDailyKmSlider" class="nco-slider" min="30" max="200" value="100" step="10">
                        </div>
                    </div>

                    <!-- Side by Side Comparison Grid -->
                    <div class="nco-compare-grid">
                        <!-- Toyota Column -->
                        <div class="nco-car-card is-toyota">
                            <div>
                                <div class="nco-card-head">
                                    <span class="nco-brand-badge toyota">TOYOTA</span>
                                    <span id="ncoToyType" class="badge-type badge-hev">HEV</span>
                                </div>
                                <h4 id="ncoToyName" class="nco-car-name">INNOVA ZENIX V HYBRID</h4>
                                <div id="ncoToyPower" class="nco-car-sub">Intern. Comb Engine + Electric Motor</div>
                            </div>

                            <div class="nco-kpi-block">
                                <div class="nco-kpi-label">Nett Cost of Ownership (NCO)</div>
                                <div id="ncoToyNcoTotal" class="nco-kpi-value">Rp 337.070.000</div>
                                <div class="nco-bar-wrap">
                                    <div id="ncoToyBarFill" class="nco-bar-fill" style="width: 80%;"></div>
                                </div>
                                <div class="nco-kpi-subgrid">
                                    <div class="nco-sub-item">
                                        <span>NCO / Tahun</span>
                                        <strong id="ncoToyNcoYear">Rp 84,267,500</strong>
                                    </div>
                                    <div class="nco-sub-item">
                                        <span>NCO / Bulan</span>
                                        <strong id="ncoToyNcoMonth">Rp 7,022,292</strong>
                                    </div>
                                    <div class="nco-sub-item">
                                        <span>NCO / Hari</span>
                                        <strong id="ncoToyNcoDay">Rp 226,526</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="nco-breakdown-list">
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-tag"></i> Harga OTR Bandung</span>
                                    <span id="ncoToyOtr" class="nco-row-val">Rp 552.800.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-wrench"></i> Perawatan (Maintenance)</span>
                                    <span id="ncoToyMaint" class="nco-row-val">Rp 12.000.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-file-invoice-dollar"></i> Pajak Kendaraan</span>
                                    <span id="ncoToyTax" class="nco-row-val">Rp 38.800.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-gas-pump"></i> BBM / Energy Cost</span>
                                    <span id="ncoToyFuel" class="nco-row-val">Rp 89.790.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-hand-holding-dollar"></i> Leasing / Bunga</span>
                                    <span id="ncoToyLeasing" class="nco-row-val">Rp 88.448.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-car-burst"></i> Own Risk Body Repair</span>
                                    <span id="ncoToyOwnRisk" class="nco-row-val">Rp 3.000.000</span>
                                </div>
                                <div class="nco-row" style="background: #fff; padding: 6px 8px; border-radius: 6px;">
                                    <span class="nco-row-label" style="font-weight: 800; color: #0f172a;">Total COE (Ownership Experience)</span>
                                    <span id="ncoToyCoe" class="nco-row-val" style="font-weight: 800; color: #0d1b3e;">Rp 784.838.000</span>
                                </div>
                                <div class="nco-row" style="background: #ecfdf5; padding: 6px 8px; border-radius: 6px;">
                                    <span class="nco-row-label" style="font-weight: 800; color: #047857;"><i class="fa-solid fa-handshake"></i> Resale Value (Harga Jual)</span>
                                    <span id="ncoToyResale" class="nco-row-val" style="font-weight: 800; color: #059669;">Rp 447.768.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label">Depresiasi Harga</span>
                                    <span id="ncoToyDeprPct" class="nco-row-val" style="color: #047857;">-19.00%</span>
                                </div>
                            </div>
                        </div>

                        <!-- Non-Toyota Column -->
                        <div class="nco-car-card is-non-toyota">
                            <div>
                                <div class="nco-card-head">
                                    <span class="nco-brand-badge non-toyota">NON TOYOTA</span>
                                    <span id="ncoNtType" class="badge-type badge-bev">BEV</span>
                                </div>
                                <h4 id="ncoNtName" class="nco-car-name">CHERY OMODA E5</h4>
                                <div id="ncoNtPower" class="nco-car-sub">Electric Motor</div>
                            </div>

                            <div class="nco-kpi-block">
                                <div class="nco-kpi-label">Nett Cost of Ownership (NCO)</div>
                                <div id="ncoNtNcoTotal" class="nco-kpi-value">Rp 376.676.222</div>
                                <div class="nco-bar-wrap">
                                    <div id="ncoNtBarFill" class="nco-bar-fill" style="width: 100%;"></div>
                                </div>
                                <div class="nco-kpi-subgrid">
                                    <div class="nco-sub-item">
                                        <span>NCO / Tahun</span>
                                        <strong id="ncoNtNcoYear">Rp 94,169,056</strong>
                                    </div>
                                    <div class="nco-sub-item">
                                        <span>NCO / Bulan</span>
                                        <strong id="ncoNtNcoMonth">Rp 7,847,421</strong>
                                    </div>
                                    <div class="nco-sub-item">
                                        <span>NCO / Hari</span>
                                        <strong id="ncoNtNcoDay">Rp 253,143</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="nco-breakdown-list">
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-tag"></i> Harga OTR Bandung</span>
                                    <span id="ncoNtOtr" class="nco-row-val">Rp 427.400.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-wrench"></i> Perawatan (Maintenance)</span>
                                    <span id="ncoNtMaint" class="nco-row-val">Rp 11.500.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-file-invoice-dollar"></i> Pajak Kendaraan</span>
                                    <span id="ncoNtTax" class="nco-row-val">Rp 572.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-bolt"></i> Charging / Energy Cost</span>
                                    <span id="ncoNtFuel" class="nco-row-val">Rp 70.972.222</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-hand-holding-dollar"></i> Leasing / Bunga</span>
                                    <span id="ncoNtLeasing" class="nco-row-val">Rp 68.384.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label"><i class="fa-solid fa-car-burst"></i> Own Risk Body Repair</span>
                                    <span id="ncoNtOwnRisk" class="nco-row-val">Rp 3.000.000</span>
                                </div>
                                <div class="nco-row" style="background: #fff; padding: 6px 8px; border-radius: 6px;">
                                    <span class="nco-row-label" style="font-weight: 800; color: #0f172a;">Total COE (Ownership Experience)</span>
                                    <span id="ncoNtCoe" class="nco-row-val" style="font-weight: 800; color: #0d1b3e;">Rp 581.828.222</span>
                                </div>
                                <div class="nco-row" style="background: #fff1f2; padding: 6px 8px; border-radius: 6px;">
                                    <span class="nco-row-label" style="font-weight: 800; color: #be123c;"><i class="fa-solid fa-handshake"></i> Resale Value (Harga Jual)</span>
                                    <span id="ncoNtResale" class="nco-row-val" style="font-weight: 800; color: #be123c;">Rp 205.152.000</span>
                                </div>
                                <div class="nco-row">
                                    <span class="nco-row-label">Depresiasi Harga</span>
                                    <span id="ncoNtDeprPct" class="nco-row-val" style="color: #be123c;">-52.00%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Dynamic Recommendation / Selling Points Box -->
                    <div id="ncoInsightBox" class="nco-insight-box is-toyota-win"></div>
                </div>
            </div>

            <!-- PANE 2: Complete NCO Tables (Spreadsheet Data) -->
            <div id="kompPane_tables" class="komp-pane">
                <div class="nco-table-section" style="margin-top: 0;">
                    <div class="nco-table-toolbar">
                        <div>
                            <h4 style="font-size: 1.05rem; font-weight: 800; color: #0d1b3e; margin: 0;"><i class="fa-solid fa-table-list" style="color: #d7123a;"></i> Tabel Spesifikasi NCO &amp; Depresiasi Lengkap</h4>
                            <p style="font-size: 0.78rem; color: #64748b; margin: 2px 0 0 0;">Data komparasi seluruh tipe Toyota vs Kompetitor Non-Toyota dari Spreadsheet Master</p>
                        </div>

                        <div class="nco-table-controls">
                            <input type="text" id="ncoTableSearch" class="nco-search-input" placeholder="Cari nama mobil..." onkeyup="searchNcoTable(this)">
                            <button type="button" class="nco-filter-btn active" data-type="all" onclick="filterNcoTableType('all', this)">Semua Tipe</button>
                            <button type="button" class="nco-filter-btn" data-type="HEV" onclick="filterNcoTableType('HEV', this)">HEV (Hybrid)</button>
                            <button type="button" class="nco-filter-btn" data-type="BEV" onclick="filterNcoTableType('BEV', this)">BEV (Listrik)</button>
                            <button type="button" class="nco-filter-btn" data-type="GASOLINE" onclick="filterNcoTableType('GASOLINE', this)">Gasoline</button>
                        </div>
                    </div>

                    <!-- Sub Tabs Header -->
                    <div class="nco-tabs-header">
                        <button type="button" class="nco-tab-btn active" onclick="switchNcoTableTab('toyota', this)"><i class="fa-solid fa-car"></i> Model Toyota</button>
                        <button type="button" class="nco-tab-btn" onclick="switchNcoTableTab('nonToyota', this)"><i class="fa-solid fa-car-side"></i> Model Non-Toyota</button>
                        <button type="button" class="nco-tab-btn" onclick="switchNcoTableTab('depreciation', this)"><i class="fa-solid fa-chart-line"></i> Matriks Depresiasi (Thn 1 - 5)</button>
                    </div>

                    <!-- Tab 1: Toyota Models Table -->
                    <div id="ncoTabPane_toyota" class="nco-tab-pane active" style="margin-top: 12px;">
                        <div class="nco-table-responsive">
                            <table class="nco-data-table">
                                <thead>
                                    <tr>
                                        <th>Model Toyota</th>
                                        <th>Tipe</th>
                                        <th>OTR Price (Bandung)</th>
                                        <th>Kapasitas Mesin</th>
                                        <th>Pajak / Thn</th>
                                        <th>Konsumsi BBM</th>
                                        <th>RV Thn 1</th>
                                        <th>RV Thn 3</th>
                                        <th>RV Thn 4</th>
                                        <th>RV Thn 5</th>
                                        <th>Garansi Kendaraan</th>
                                    </tr>
                                </thead>
                                <tbody id="ncoToyTableBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 2: Non-Toyota Models Table -->
                    <div id="ncoTabPane_nonToyota" class="nco-tab-pane" style="margin-top: 12px;">
                        <div class="nco-table-responsive">
                            <table class="nco-data-table">
                                <thead>
                                    <tr>
                                        <th>Model Non-Toyota</th>
                                        <th>Tipe</th>
                                        <th>OTR Price (Bandung)</th>
                                        <th>BBM / Range</th>
                                        <th>Pajak / Thn</th>
                                        <th>Cost Charging / Fuel</th>
                                        <th>RV Thn 1</th>
                                        <th>RV Thn 3</th>
                                        <th>RV Thn 4</th>
                                        <th>RV Thn 5</th>
                                        <th>Garansi Kendaraan</th>
                                    </tr>
                                </thead>
                                <tbody id="ncoNtTableBody"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Tab 3: Depreciation Matrix Table -->
                    <div id="ncoTabPane_depreciation" class="nco-tab-pane" style="margin-top: 12px;">
                        <div class="nco-table-responsive">
                            <table class="nco-data-table">
                                <thead>
                                    <tr>
                                        <th>Model Kendaraan</th>
                                        <th>Depresiasi Thn 1</th>
                                        <th>Depresiasi Thn 2</th>
                                        <th>Depresiasi Thn 3</th>
                                        <th>Depresiasi Thn 4</th>
                                        <th>Depresiasi Thn 5</th>
                                        <th>Status Stabilitas</th>
                                    </tr>
                                </thead>
                                <tbody id="ncoDeprTableBody"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PANE 3: Head-to-Head Battle Radar -->
            <div id="kompPane_battle" class="komp-pane">
                <!-- Header selector card -->
                <div class="battle-card">
                    <h4 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 800; color: var(--primary-blue); text-align: center;">
                        <i class="fa-solid fa-swords"></i> Head-to-Head Comparison (Battle Radar)
                    </h4>

                    <div class="car-selector-box">
                        <div>
                            <label style="font-size: 11px; font-weight: 800; color: var(--primary-blue); display: block; margin-bottom: 4px;">UNIT KITA</label>
                            <select id="selectOurCar" class="form-control" style="font-size: 12.5px; font-weight: 700;" onchange="updateBattleComparison()">
                                <option value="avanza">Toyota Veloz Q CVT / Avanza G</option>
                                <option value="zenix">Innova Zenix V Hybrid</option>
                                <option value="yaris_cross">Yaris Cross S GR Hybrid</option>
                            </select>
                        </div>

                        <div class="vs-badge">VS</div>

                        <div>
                            <label style="font-size: 11px; font-weight: 800; color: #64748b; display: block; margin-bottom: 4px;">KOMPETITOR</label>
                            <select id="selectCompCar" class="form-control" style="font-size: 12.5px; font-weight: 700;" onchange="updateBattleComparison()">
                                <option value="avanza_comp">Xpander Ultimate CVT</option>
                                <option value="xpander_comp">Stargazer Prime</option>
                                <option value="hrv_comp">HR-V SE 1.5 i-VTEC</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Radar Chart Card -->
                <div class="battle-card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                        <h4 style="margin: 0; font-size: 13.5px; font-weight: 800; color: var(--primary-blue);">
                            <i class="fa-solid fa-chart-radar"></i> Radar Skor Fitur &amp; Value
                        </h4>
                        <span class="winner-badge" id="winnerBadge">
                            <i class="fa-solid fa-trophy"></i> Unit Kita Unggul +18%
                        </span>
                    </div>

                    <div class="radar-container">
                        <canvas id="radarBattleChart"></canvas>
                    </div>
                </div>

                <!-- Detailed Spec Comparison Matrix -->
                <div class="battle-card">
                    <h4 style="margin: 0 0 12px 0; font-size: 13.5px; font-weight: 800; color: var(--primary-blue);">
                        <i class="fa-solid fa-list-check"></i> Matriks Perbandingan Spesifikasi
                    </h4>

                    <div style="background: #f8fafc; border-radius: 12px; padding: 6px 12px;">
                        <div class="spec-row">
                            <div class="val-our" id="specOurEngine">115 PS / 144 Nm</div>
                            <div class="val-label">Tenaga Mesin</div>
                            <div class="val-comp" id="specCompEngine">106 PS / 137 Nm</div>
                        </div>
                        <div class="spec-row">
                            <div class="val-our" id="specOurFuel">16.8 KM/L</div>
                            <div class="val-label">Konsumsi BBM</div>
                            <div class="val-comp" id="specCompFuel">15.2 KM/L</div>
                        </div>
                        <div class="spec-row">
                            <div class="val-our" id="specOurSafety">Smartsense 6 Airbags</div>
                            <div class="val-label">Keselamatan</div>
                            <div class="val-comp" id="specCompSafety">Safety Sense 2 Airbags</div>
                        </div>
                        <div class="spec-row">
                            <div class="val-our" id="specOurWarranty">4 Thn / 100k KM</div>
                            <div class="val-label">Garansi Resmi</div>
                            <div class="val-comp" id="specCompWarranty">3 Thn / 50k KM</div>
                        </div>
                        <div class="spec-row">
                            <div class="val-our" id="specOurResale">Tinggi (OLX Data)</div>
                            <div class="val-label">Resale Value</div>
                            <div class="val-comp" id="specCompResale">Sedang</div>
                        </div>
                    </div>

                    <div style="margin-top: 14px; background: #eff6ff; padding: 12px; border-radius: 10px; border-left: 4px solid var(--accent-blue);">
                        <div style="font-size: 11px; font-weight: 800; color: var(--accent-blue); text-transform: uppercase;">
                            💡 Poin Jualan Utama (Key Sales Hook)
                        </div>
                        <div id="salesHookText" style="font-size: 12.5px; color: #1e3a8a; margin-top: 4px; font-weight: 600;">
                            Tunjukkan kepada konsumen bahwa unit kita memiliki garansi lebih lama 1 tahun dan fitur keselamatan aktif yang tidak dimiliki kompetitor di kelas harga yang sama!
                        </div>
                    </div>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../js/script.js"></script>
    <script src="../js/nco_dashboard.js?v=1.0"></script>
    <script src="../js/komparasi.js"></script>

    <script>
        function switchKompTab(tabName, btn) {
            document.querySelectorAll('.nco-top-tab').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.komp-pane').forEach(p => p.classList.remove('active'));

            if (btn) btn.classList.add('active');
            const pane = document.getElementById(`kompPane_${tabName}`);
            if (pane) pane.classList.add('active');
        }
    </script>
</body>

</html>
