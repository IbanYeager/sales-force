<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Analisis Pasar Kecamatan</title>
    <!-- Google Fonts: Plus Jakarta Sans -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <link rel="stylesheet" href="../css/market_analysis.css?v=5.0" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
</head>

<body>
    <div class="mobile-app">
        <!-- Header Page (Upgraded by sidebar_desktop.js) -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Analisis Pasar Kecamatan</h2>
        </header>

        <div class="container market-container">
            <!-- Executive Hero Banner Header -->
            <div class="district-hero-card">
                <div class="hero-glow-bg"></div>

                <!-- Hero Content Area -->
                <div class="hero-body">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
                        <div>
                            <div class="hero-badge-tag">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Data Analytics & Market Intelligence
                            </div>
                            <h1 class="hero-title">
                                Intelijen Pasar & Dominasi Wilayah
                            </h1>
                            <p class="hero-subtitle">
                                Analisis komposisi segmen otomotif dan statistik pangsa pasar Toyota di wilayah Kota Bandung.
                            </p>
                        </div>
                        <div class="hero-location-badge" id="activeDistrictBadge">
                            <span class="pulse-dot"></span>
                            <i class="fa-solid fa-location-dot"></i>
                            <span id="txtBadgeDistrict">KIARACONDONG</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- District Pills Selector Bar -->
            <div class="district-section-wrapper">
                <div class="district-section-header">
                    <span class="section-label-chip"><i class="fa-solid fa-map-pin"></i> Pilih Kecamatan Target</span>
                    <div class="district-select-wrapper">
                        <i class="fa-solid fa-filter"></i>
                        <select id="selectDistrictDropdown" class="district-dropdown-select" onchange="selectDistrict(this.value)">
                            <option value="">-- Pilih Kecamatan Bandung --</option>
                        </select>
                    </div>
                </div>
                <div class="district-pills-bar" id="districtPillsContainer">
                    <button class="district-pill-btn active" onclick="selectDistrict('KIARACONDONG')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Kiaracondong
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('BOJONGLOA KIDUL')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Bojongloa Kidul
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('UJUNGBERUNG')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Ujungberung
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('ANTAPANI')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Antapani
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('BUAHBATU')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Buahbatu
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('ANDIR')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Andir
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('ARCAMANIK')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Arcamanik
                    </button>
                    <button class="district-pill-btn" onclick="selectDistrict('CIDADAP')">
                        <i class="fa-solid fa-location-dot pill-icon"></i> Cidadap
                    </button>
                </div>
            </div>

            <!-- Mode Switcher Card -->
            <div class="mode-toggle-card">
                <div class="mode-toggle-info">
                    <div class="mode-toggle-title">
                        <i class="fa-solid fa-sliders"></i> Mode Analisis Data
                    </div>
                    <p class="mode-toggle-desc" id="txtModeDesc">
                        Pilih antara estimasi komposisi pasar per segmen atau market share (%) Toyota.
                    </p>
                </div>
                <div class="mode-switch-group">
                    <button class="mode-switch-btn active" id="btnModeComp" onclick="switchMode('composition')">
                        <i class="fa-solid fa-chart-pie"></i> Market Composition (%)
                    </button>
                    <button class="mode-switch-btn" id="btnModeShare" onclick="switchMode('market_share')">
                        <i class="fa-solid fa-bullseye"></i> Toyota Market Share (%)
                    </button>
                </div>
            </div>

            <!-- Metric KPI Summary Cards -->
            <div class="market-kpi-grid">
                <div class="market-kpi-card kpi-blue">
                    <div class="market-kpi-top">
                        <span class="market-kpi-label">Segmen Dominan</span>
                        <div class="market-kpi-icon blue"><i class="fa-solid fa-chart-pie"></i></div>
                    </div>
                    <div class="market-kpi-val" id="kpiTopSegment">-</div>
                    <div class="market-kpi-sub" id="kpiTopSegmentSub">
                        <i class="fa-solid fa-arrow-trend-up"></i> - Porsi Pasar
                    </div>
                </div>

                <div class="market-kpi-card kpi-red">
                    <div class="market-kpi-top">
                        <span class="market-kpi-label">Model Toyota Terunggul</span>
                        <div class="market-kpi-icon red"><i class="fa-solid fa-trophy"></i></div>
                    </div>
                    <div class="market-kpi-val text-red" id="kpiTopModel">-</div>
                    <div class="market-kpi-sub text-red-sub" id="kpiTopModelSub">
                        <i class="fa-solid fa-crown"></i> - Market Share YTM
                    </div>
                </div>

                <div class="market-kpi-card kpi-cyan">
                    <div class="market-kpi-top">
                        <span class="market-kpi-label">Porsi Passenger Car (PC)</span>
                        <div class="market-kpi-icon cyan"><i class="fa-solid fa-car-side"></i></div>
                    </div>
                    <div class="market-kpi-val text-cyan" id="kpiPcShare">-</div>
                    <div class="market-kpi-sub">
                        <i class="fa-solid fa-users"></i> Total Kendaraan Penumpang
                    </div>
                </div>

                <div class="market-kpi-card kpi-amber">
                    <div class="market-kpi-top">
                        <span class="market-kpi-label">Porsi Commercial (CV)</span>
                        <div class="market-kpi-icon amber"><i class="fa-solid fa-truck-front"></i></div>
                    </div>
                    <div class="market-kpi-val text-amber" id="kpiCvShare">-</div>
                    <div class="market-kpi-sub">
                        <i class="fa-solid fa-boxes-packing"></i> Kendaraan Komersial / Niaga
                    </div>
                </div>
            </div>

            <!-- Interactive Visual Charts Section -->
            <div class="market-charts-grid">
                <div class="market-chart-card">
                    <div class="market-chart-header">
                        <h4 class="market-chart-title" id="chartTitle1">
                            <span class="chart-title-badge blue"><i class="fa-solid fa-chart-pie"></i></span>
                            Komposisi Segmen Kendaraan
                        </h4>
                    </div>
                    <div class="market-chart-container">
                        <canvas id="chartSegComp"></canvas>
                    </div>
                </div>

                <div class="market-chart-card">
                    <div class="market-chart-header">
                        <h4 class="market-chart-title" id="chartTitle2">
                            <span class="chart-title-badge red"><i class="fa-solid fa-chart-column"></i></span>
                            Perbandingan Porsi Model Toyota
                        </h4>
                    </div>
                    <div class="market-chart-container">
                        <canvas id="chartModelShare"></canvas>
                    </div>
                </div>

                <div class="market-chart-card full-width-chart">
                    <div class="market-chart-header">
                        <h4 class="market-chart-title">
                            <span class="chart-title-badge green"><i class="fa-solid fa-chart-line"></i></span>
                            Tren Bulanan (Januari - Juni)
                        </h4>
                        <span class="chart-sub-label">Model Teratas di Wilayah Terpilih</span>
                    </div>
                    <div class="market-chart-container">
                        <canvas id="chartMonthlyTrend"></canvas>
                    </div>
                </div>
            </div>

            <!-- Detailed Table Section -->
            <div class="market-table-card">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title">
                            <i class="fa-solid fa-table-cells" style="color: var(--primary-red, #d7123a);"></i> Tabel Analisis Detail Per Segmen & Model
                        </h3>
                        <p class="table-card-desc" id="txtTableDesc">
                            Menampilkan persentase porsi segmen/model di kecamatan terpilih.
                        </p>
                    </div>
                    <div class="table-card-actions">
                        <span class="data-period-badge"><i class="fa-solid fa-calendar-days"></i> Data YTM Jan - Jun</span>
                    </div>
                </div>

                <div class="market-table-wrapper">
                    <table class="market-table">
                        <thead>
                            <tr>
                                <th>Segmen</th>
                                <th>Model Toyota</th>
                                <th>Reff City (%)</th>
                                <th>YTM (%)</th>
                                <th>Jan (%)</th>
                                <th>Feb (%)</th>
                                <th>Mar (%)</th>
                                <th>Apr (%)</th>
                                <th>Mei (%)</th>
                                <th>Jun (%)</th>
                            </tr>
                        </thead>
                        <tbody id="marketTableBody">
                            <tr>
                                <td colspan="10" class="table-loading-cell">
                                    <div class="loading-spinner">
                                        <i class="fa-solid fa-circle-notch fa-spin"></i>
                                    </div>
                                    <span>Memuat data analisis pasar...</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Housing Complex Prospecting Section -->
            <div class="market-table-card housing-card-section" id="housingSection">
                <div class="table-card-header">
                    <div>
                        <h3 class="table-card-title">
                            <i class="fa-solid fa-city" style="color: #3b82f6;"></i> Pemetaan Komplek Perumahan & Potensi Prospecting
                        </h3>
                        <p class="table-card-desc" id="txtHousingDesc">
                            Daftar komplek perumahan dan estimasi unit rumah di kecamatan terpilih untuk target kanvasing & door-to-door sales.
                        </p>
                    </div>
                    <div class="housing-search-box">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="housingSearchInput" onkeyup="filterHousingTable()" placeholder="Cari nama komplek perumahan...">
                    </div>
                </div>

                <div class="housing-summary-bar">
                    <div class="housing-stat-chip">
                        <i class="fa-solid fa-building-user"></i> Total Perumahan: <strong id="lblTotalHousingKomplek">0 Komplek</strong>
                    </div>
                    <div class="housing-stat-chip green">
                        <i class="fa-solid fa-house-circle-check"></i> Total Unit Rumah: <strong id="lblTotalHousingUnit">0 Unit</strong>
                    </div>
                </div>

                <div class="market-table-wrapper">
                    <table class="market-table housing-table">
                        <thead>
                            <tr>
                                <th style="width: 50px;">No</th>
                                <th>Nama Komplek Perumahan</th>
                                <th style="text-align: right;">Jumlah Unit Rumah</th>
                                <th>Kategori Potensi Prospecting</th>
                                <th style="text-align: center;">Aksi Target Kanvasing</th>
                            </tr>
                        </thead>
                        <tbody id="housingTableBody">
                            <tr>
                                <td colspan="5" class="table-loading-cell">
                                    <div class="loading-spinner">
                                        <i class="fa-solid fa-circle-notch fa-spin"></i>
                                    </div>
                                    <span>Memuat data perumahan...</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <script src="../custom_alert.js"></script>
    <script src="../js/market_analysis.js"></script>
</body>

</html>
