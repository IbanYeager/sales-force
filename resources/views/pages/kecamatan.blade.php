<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Analisis Wilayah Kecamatan</title>
    <meta name="description" content="Intelijen Wilayah Kecamatan, Rekomendasi Mobil & Log Aktivitas Sales">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
    <style>
        .district-hero {
            background: linear-gradient(135deg, #0d1b3e 0%, #16305f 60%, #1e40af 100%);
            border-radius: var(--radius-lg, 16px);
            padding: 20px;
            color: #ffffff;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(13, 27, 62, 0.2);
            position: relative;
            z-index: 100;
        }
        .district-hero::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(215, 18, 58, 0.35) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }
        .stat-grid-3 {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }
        .stat-card-sm {
            background: #ffffff;
            border-radius: 14px;
            padding: 12px;
            border: 1px solid var(--border-color, #e2e8f0);
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .stat-val {
            font-size: 16px;
            font-weight: 800;
            color: var(--primary-blue, #0d1b3e);
            margin-top: 2px;
        }
        .stat-lbl {
            font-size: 10.5px;
            font-weight: 700;
            color: var(--text-muted, #64748b);
            text-transform: uppercase;
        }
        .funnel-box {
            background: #f8fafc;
            border-radius: 12px;
            padding: 14px;
            margin-top: 12px;
            border: 1px solid #e2e8f0;
        }
        .funnel-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 8px;
            font-size: 12px;
        }
        .funnel-bar-bg {
            height: 8px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
            flex: 1;
            margin: 0 10px;
        }
        .funnel-bar-fill {
            height: 100%;
            background: var(--primary-red, #d7123a);
            border-radius: 6px;
        }
        .activity-card-item {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .badge-status {
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            border-radius: 12px;
            text-transform: uppercase;
        }
        .badge-prospek { background: #dbeafe; color: #1e40af; }
        .badge-hot { background: #fef3c7; color: #b45309; }
        .badge-spk { background: #f3effd; color: #6d28d9; }
        .badge-do { background: #dcfce7; color: #15803d; }
    </style>
</head>

<body>
    <div class="mobile-app">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Analisis Wilayah Kecamatan</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Hero Filter Selector -->
            <div class="district-hero">
                <div style="font-size: 11px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                    <i class="fa-solid fa-earth-asia"></i> District Intelligence Dashboard
                </div>
                <h3 style="margin: 0 0 12px 0; font-size: 18px; font-weight: 800;">Analisis Data Polreg Wilayah</h3>

                <!-- Dropdown Selectors: Tahun & Kecamatan (Searchable Autocomplete) -->
                <div style="display: grid; grid-template-columns: 1fr 2.2fr; gap: 10px;">
                    <div>
                        <select id="selectTahun" class="form-control" style="font-size: 13px; font-weight: 800; color: #0d1b3e; background: #ffffff; border-radius: 12px; padding: 10px; height: 44px;" onchange="changeTahun(this.value)">
                            <option value="2026">Tahun 2026</option>
                            <option value="2025">Tahun 2025</option>
                            <option value="2024">Tahun 2024</option>
                            <option value="2023">Tahun 2023</option>
                        </select>
                    </div>
                    <div style="position: relative;">
                        <div style="position: relative; display: flex; align-items: center;">
                            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; color: #64748b; font-size: 13px; pointer-events: none;"></i>
                            <input type="text" id="inputKecamatanSearch" class="form-control" placeholder="Ketik nama kecamatan..." 
                                style="font-size: 13px; font-weight: 700; color: #0d1b3e; background: #ffffff; border-radius: 12px; padding: 10px 14px 10px 36px; height: 44px; width: 100%; border: none; outline: none;"
                                onfocus="showKecamatanMenu()" oninput="filterKecamatanMenu(this.value)" autocomplete="off">
                            <i class="fa-solid fa-chevron-down" style="position: absolute; right: 14px; color: #64748b; font-size: 12px; pointer-events: none;"></i>
                        </div>

                        <!-- Dropdown Menu List -->
                        <div id="dropdownKecamatanMenu" style="display: none; position: absolute; top: 48px; left: 0; right: 0; max-height: 260px; overflow-y: auto; background: #ffffff; border-radius: 14px; box-shadow: 0 14px 40px rgba(0,0,0,0.3); border: 1.5px solid #cbd5e1; z-index: 9999; padding: 6px;">
                            <!-- Populated via kecamatan.js -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- KPI Metric Cards for Selected District -->
            <div class="stat-grid-3">
                <div class="stat-card-sm">
                    <div class="stat-lbl">Market Share Toyota</div>
                    <div class="stat-val" id="valMarketShare" style="color: var(--primary-red);">0%</div>
                </div>
                <div class="stat-card-sm">
                    <div class="stat-lbl">Total Unit Polreg</div>
                    <div class="stat-val" id="valContTunas" style="color: var(--accent-blue);">0 U</div>
                </div>
                <div class="stat-card-sm">
                    <div class="stat-lbl">Potensi Pasar</div>
                    <div class="stat-val" id="valPotensi" style="font-size: 13px; color: #059669;">Tinggi</div>
                </div>
            </div>

            <!-- Section 1: Rekomendasi Mobil & Profil Customer Wilayah -->
            <div class="card" style="padding: 16px; margin-bottom: 20px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--primary-blue);">
                        <i class="fa-solid fa-car-side" style="color: var(--primary-red);"></i> Rekomendasi Mobil Dominan
                    </h4>
                    <span style="font-size: 10.5px; font-weight: 800; background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 6px;" id="lblSegmentasi">
                        Family MPV 7-Seater
                    </span>
                </div>

                <div style="background: #f8fafc; border-radius: 12px; padding: 12px; border-left: 4px solid var(--primary-red); margin-bottom: 12px;">
                    <div style="font-size: 13.5px; font-weight: 800; color: var(--primary-blue);" id="txtMobilRekomendasi">
                        Memuat data...
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;" id="txtAlasanRekomendasi">
                        Memuat rekomendasi wilayah...
                    </div>
                </div>

                <!-- Source of Activity & Funneling -->
                <div class="funnel-box">
                    <div style="font-size: 12px; font-weight: 800; color: var(--primary-blue); margin-bottom: 10px;">
                        <i class="fa-solid fa-filter" style="color: var(--accent-blue);"></i> Estimasi Funneling & Conversion Ratio:
                    </div>

                    <div class="funnel-row">
                        <span style="font-weight: 600; width: 90px;">Prospect</span>
                        <div class="funnel-bar-bg"><div class="funnel-bar-fill" id="barProspect" style="width: 100%;"></div></div>
                        <strong id="valProspect">0 / 0 (0%)</strong>
                    </div>
                    <div class="funnel-row">
                        <span style="font-weight: 600; width: 90px;">Hot Prospect</span>
                        <div class="funnel-bar-bg"><div class="funnel-bar-fill" id="barHot" style="width: 30%; background: #f59e0b;"></div></div>
                        <strong id="valHot">0 / 0 (0%)</strong>
                    </div>
                    <div class="funnel-row">
                        <span style="font-weight: 600; width: 90px;">SPK Closing</span>
                        <div class="funnel-bar-bg"><div class="funnel-bar-fill" id="barSpk" style="width: 10%; background: #7048d6;"></div></div>
                        <strong id="valSpk">0 / 0 (0%)</strong>
                    </div>
                    <div class="funnel-row">
                        <span style="font-weight: 600; width: 90px;">DO Delivery</span>
                        <div class="funnel-bar-bg"><div class="funnel-bar-fill" id="barDo" style="width: 100%; background: #10b981;"></div></div>
                        <strong id="valDo">0 / 0 (0%)</strong>
                    </div>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../js/script.js"></script>
    <script src="../js/kecamatan.js"></script>
</body>

</html>
