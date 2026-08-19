<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Toyota Eco-Savings Calculator</title>
    <meta name="description" content="Kalkulator Efisiensi BBM & Reduksi Emisi CO2 Toyota Hybrid (HEV)">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
    <style>
        .eco-hero-banner {
            background: linear-gradient(135deg, #064e3b 0%, #047857 50%, #059669 100%);
            border-radius: var(--radius-lg, 16px);
            padding: 22px;
            color: #ffffff;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(5, 150, 105, 0.25);
            position: relative;
            overflow: hidden;
        }

        .eco-hero-banner::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            border-radius: 50%;
        }

        .badge-eco {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(8px);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11.5px;
            font-weight: 800;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .eco-card {
            background: #ffffff;
            border-radius: var(--radius-lg, 16px);
            padding: 20px;
            border: 1px solid var(--border-color, #e2e8f0);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
            margin-bottom: 20px;
        }

        .eco-label {
            font-size: 12.5px;
            font-weight: 700;
            color: var(--text-dark, #1e293b);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .eco-select, .eco-input {
            width: 100%;
            padding: 12px 14px;
            border: 1.5px solid #cbd5e1;
            border-radius: 12px;
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: #f8fafc;
            outline: none;
            transition: all 0.2s ease;
        }

        .eco-select:focus, .eco-input:focus {
            background: #ffffff;
            border-color: #059669;
            box-shadow: 0 0 0 3.5px rgba(5, 150, 105, 0.15);
        }

        .stat-grid-eco {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            margin-top: 16px;
        }

        .stat-box-eco {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 14px;
            padding: 16px;
            text-align: center;
        }

        .stat-box-eco.highlight {
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            border-color: #6ee7b7;
            grid-column: span 2;
        }

        .stat-val-eco {
            font-size: 24px;
            font-weight: 900;
            color: #047857;
            margin: 4px 0;
        }

        .stat-lbl-eco {
            font-size: 11px;
            font-weight: 800;
            color: #065f46;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .btn-share-wa {
            background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
            color: #ffffff;
            border: none;
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            font-weight: 800;
            font-size: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);
            transition: transform 0.15s ease;
        }

        .btn-share-wa:active {
            transform: scale(0.98);
        }
    </style>
</head>

<body>
    <div class="mobile-app">
        <!-- Header Standard -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Toyota Eco-Savings Calculator</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Hero Banner -->
            <div class="eco-hero-banner">
                <div class="badge-eco">
                    <i class="fa-solid fa-leaf"></i> Beyond Zero & Multi-Pathway
                </div>
                <h3 style="margin: 0 0 6px 0; font-size: 18px; font-weight: 800;">Toyota Hybrid HEV Calculator</h3>
                <p style="margin: 0; font-size: 12px; opacity: 0.92; line-height: 1.5;">
                    Hitung efisiensi biaya BBM & kontribusi reduksi emisi karbon (CO₂) saat beralih ke kendaraan Toyota Hybrid!
                </p>
            </div>

            <!-- Parameter Form Card -->
            <div class="eco-card">
                <h4 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 800; color: var(--primary-blue, #0d1b3e); display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-sliders" style="color: #059669;"></i> Parameter Kendaraan Konsumen
                </h4>

                <div style="margin-bottom: 14px;">
                    <label class="eco-label"><i class="fa-solid fa-car-side" style="color:#059669;"></i> Pilihan Unit Toyota Hybrid (HEV)</label>
                    <select class="eco-select" id="hybridModelSelect" onchange="calculateEcoSavings()">
                        <option value="zenix">Kijang Innova Zenix Hybrid (2.0 HEV) - 21 km/L</option>
                        <option value="yariscross">Yaris Cross Hybrid (1.5 HEV) - 30 km/L</option>
                        <option value="corollacross">Corolla Cross Hybrid (1.8 HEV) - 23 km/L</option>
                    </select>
                </div>

                <div style="margin-bottom: 14px;">
                    <label class="eco-label"><i class="fa-solid fa-gas-pump" style="color:#e11d48;"></i> Konsumsi BBM Mobil Lama Konsumen (km/L)</label>
                    <select class="eco-select" id="oldCarKmPerLiter" onchange="calculateEcoSavings()">
                        <option value="9">Bensin Konvensional MPV/SUV Lama (9 km/L)</option>
                        <option value="11">Bensin Konvensional Sedan/Hatchback Lama (11 km/L)</option>
                        <option value="7">Bensin SUV Besar 2.5L+ Lama (7 km/L)</option>
                    </select>
                </div>

                <div style="margin-bottom: 14px;">
                    <label class="eco-label"><i class="fa-solid fa-route" style="color:#0284c7;"></i> Estimasi Jarak Tempuh Harian (km/hari)</label>
                    <input type="number" class="eco-input" id="dailyDistanceKm" value="40" min="5" max="300" oninput="calculateEcoSavings()">
                </div>

                <div style="margin-bottom: 4px;">
                    <label class="eco-label"><i class="fa-solid fa-money-bill-wave" style="color:#d97706;"></i> Harga BBM per Liter (Rp)</label>
                    <input type="number" class="eco-input" id="fuelPricePerLiter" value="13900" step="100" oninput="calculateEcoSavings()">
                </div>
            </div>

            <!-- Result Card -->
            <div class="eco-card" style="border-top: 4px solid #059669;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: var(--primary-blue, #0d1b3e); display: flex; align-items: center; gap: 8px;">
                    <i class="fa-solid fa-chart-pie" style="color: #059669;"></i> Hasil Analisis Efisiensi & Dampak Lingkungan
                </h4>
                <p style="font-size: 11px; color: var(--text-muted, #64748b); margin-bottom: 14px;">Perbandingan estimasi per 1 tahun penggunaan:</p>

                <div class="stat-grid-eco">
                    <div class="stat-box-eco highlight">
                        <div class="stat-lbl-eco"><i class="fa-solid fa-wallet"></i> Hemat Biaya BBM per Tahun</div>
                        <div class="stat-val-eco" id="resYearlyMoneySavings">Rp 0</div>
                        <span style="font-size: 10.5px; color: #047857; font-weight: 800;" id="resMonthlyMoneySavings">Atau Rp 0 / bulan</span>
                    </div>

                    <div class="stat-box-eco">
                        <div class="stat-lbl-eco"><i class="fa-solid fa-smog"></i> Reduksi Emisi CO₂</div>
                        <div class="stat-val-eco" style="font-size: 19px; color: #0284c7;" id="resCo2SavingsKg">0 kg</div>
                        <span style="font-size: 10px; color: #0369a1; font-weight: 700;">Gas buang dicegah</span>
                    </div>

                    <div class="stat-box-eco">
                        <div class="stat-lbl-eco"><i class="fa-solid fa-tree"></i> Setara Pohon Diselamatkan</div>
                        <div class="stat-val-eco" style="font-size: 19px; color: #15803d;" id="resTreesEquivalent">0 Pohon</div>
                        <span style="font-size: 10px; color: #166534; font-weight: 700;">Dampak ekologis</span>
                    </div>
                </div>

                <div style="margin-top: 20px;">
                    <button class="btn-share-wa" onclick="shareEcoInfographicWA()">
                        <i class="fa-brands fa-whatsapp" style="font-size: 18px;"></i>
                        <span>Bagikan Infografis ke Konsumen (WA)</span>
                    </button>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../js/eco_calculator.js"></script>
</body>

</html>
