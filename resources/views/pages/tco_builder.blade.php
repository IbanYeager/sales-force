<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Toyota Customization Option (TCO) Explorer & Builder</title>
    <script>
        window.location.href = "tco.html";
    </script>
</head>
<body>
    <p>Mengalihkan ke halaman Aksesoris TCO & Builder...</p>
</body>
</html>
    <style>
        .tco-hero {
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 60%, #4338ca 100%);
            border-radius: var(--radius-lg, 16px);
            padding: 22px;
            color: #ffffff;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(49, 46, 129, 0.25);
            position: relative;
            overflow: hidden;
        }

        .tco-hero::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            border-radius: 50%;
        }

        .badge-tco {
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
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .item-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 14px;
            background: #ffffff;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 8px;
            transition: all 0.2s ease;
        }

        .item-row:hover {
            border-color: #6366f1;
            background: #f5f3ff;
        }

        .item-row input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #4f46e5;
            cursor: pointer;
        }

        .summary-box {
            background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
            border: 1.5px solid #c7d2fe;
            border-radius: 16px;
            padding: 18px;
            margin-top: 20px;
        }
    </style>
</head>

<body>
    <div class="mobile-app">
        <!-- Header Page -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Toyota Customization Builder</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Hero Banner -->
            <div class="tco-hero">
                <div class="badge-tco">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Toyota Customization Option (TCO)
                </div>
                <h3 style="margin:0 0 6px 0; font-size: 18px; font-weight:800;">Virtual Accessories Builder</h3>
                <p style="margin:0; font-size:12px; opacity:0.92; line-height:1.5;">
                    Pilih paket aksesoris original Toyota & Gazoo Racing (GR) Parts resmi untuk kendaraan impian Anda!
                </p>
            </div>

            <!-- Model Selection Card -->
            <div class="card" style="padding: 16px; margin-bottom: 16px; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
                <label style="font-size:12.5px; font-weight:700; color:var(--primary-blue); display:block; margin-bottom:8px;">
                    <i class="fa-solid fa-car"></i> Pilih Model Kendaraan Toyota
                </label>
                <select id="tcoModelSelect" class="form-control" style="font-weight:700;" onchange="loadTcoItems(this.value)">
                    <option value="">Memuat model kendaraan...</option>
                </select>
            </div>

            <!-- Accessories List Container -->
            <div class="card" style="padding: 16px; margin-bottom: 20px; background:#fff; border-radius:16px; border:1px solid #e2e8f0;">
                <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:800; color:var(--primary-blue);">
                    <i class="fa-solid fa-layer-group" style="color:#4f46e5;"></i> Daftar Aksesoris Original Terdaftar
                </h4>

                <div id="tcoItemsList" style="display:flex; flex-direction:column; max-height:360px; overflow-y:auto; padding-right:4px;">
                    <p style="text-align:center; font-size:12px; color:#64748b; padding:20px;">Memuat aksesoris dari database...</p>
                </div>

                <!-- Summary Box -->
                <div class="summary-box">
                    <div style="font-size:11px; font-weight:800; color:#3730a3; text-transform:uppercase;">Ringkasan Customization TCO</div>
                    <div style="font-size:24px; font-weight:900; color:#1e1b4b; margin:4px 0;" id="tcoTotalHarga">Rp 0</div>
                    <div style="font-size:11.5px; font-weight:700; color:#4338ca;" id="tcoCicilanImpact">Atau +Rp 0 / bulan pada angsuran kredit</div>

                    <div style="margin-top:14px;">
                        <button type="button" class="btn-main" onclick="shareTcoProposalWA()" style="width:100%; background:#25D366; border:none; padding:12px; font-weight:800; border-radius:12px;">
                            <i class="fa-brands fa-whatsapp"></i> Bagikan Penawaran Aksesoris ke WA
                        </button>
                    </div>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../custom_alert.js"></script>
    <script src="../js/tco_builder.js"></script>
</body>

</html>
