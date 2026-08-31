<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digital Smart Card Studio - Tunas Toyota Kiara Condong</title>
    <meta name="description" content="Studio Pengelolaan Kartu Nama Digital Resmi Wiraniaga Tunas Toyota Kiara Condong.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
    <link rel="stylesheet" href="../css/style.css?v=5.0">
    <script src="../js/sidebar_desktop.js"></script>

    <style>
        :root {
            --toyota-red: #c8102e;
            --toyota-red-dark: #990e24;
            --toyota-navy: #0d1b3e;
            --wa-green: #25D366;
        }

        /* 2-Column Responsive Studio */
        .studio-grid {
            display: grid;
            grid-template-columns: 380px 1fr;
            gap: 22px;
            align-items: start;
            margin-top: 18px;
        }

        @media (max-width: 992px) {
            .studio-grid {
                grid-template-columns: 1fr;
            }
        }

        /* ── CARD MOCKUP PREVIEW (LEFT COLUMN) ── */
        .card-preview-box {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
            position: relative;
        }

        .card-header-gradient {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 50%, #c8102e 100%);
            padding: 24px 16px 55px;
            color: white;
            text-align: center;
            position: relative;
            border-bottom-left-radius: 24px;
            border-bottom-right-radius: 24px;
        }

        .brand-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(8px);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10.5px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
        }

        .profile-section {
            margin-top: -45px;
            text-align: center;
            position: relative;
            z-index: 10;
            padding: 0 16px 20px;
        }

        .avatar-circle {
            width: 90px;
            height: 90px;
            margin: 0 auto;
            border-radius: 50%;
            border: 4px solid #ffffff;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            background: #ffffff;
            position: relative;
        }

        .avatar-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .verified-icon {
            position: absolute;
            bottom: 2px;
            right: calc(50% - 42px);
            background: #0284c7;
            color: white;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
            border: 2px solid white;
        }

        .sales-fullname {
            font-family: 'Outfit', sans-serif;
            font-size: 18px;
            font-weight: 800;
            color: #0f172a;
            margin: 10px 0 2px;
        }

        .sales-tagline {
            font-size: 12px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 8px;
        }

        .sales-intro {
            font-size: 11.5px;
            color: #334155;
            line-height: 1.45;
            background: #f8fafc;
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            margin-bottom: 14px;
        }

        /* Action Buttons Grid */
        .action-btn-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 14px;
        }

        .action-card-btn {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 10px 4px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 4px;
            text-decoration: none;
            color: #0f172a;
            font-size: 10px;
            font-weight: 700;
            transition: all 0.2s;
            cursor: pointer;
        }

        .action-card-btn.btn-green {
            background: var(--wa-green);
            color: white;
            border-color: #1eb956;
        }

        .action-card-btn.btn-blue {
            background: #0284c7;
            color: white;
            border-color: #0369a1;
        }

        .action-card-btn i {
            font-size: 15px;
        }

        /* ── RIGHT PANEL (TOOLS & CATALOG) ── */
        .studio-right-card {
            background: #ffffff;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            padding: 20px;
            box-shadow: 0 8px 25px rgba(15, 23, 42, 0.04);
        }

        .studio-tabs {
            display: flex;
            background: #f1f5f9;
            padding: 4px;
            border-radius: 12px;
            gap: 4px;
            margin-bottom: 18px;
        }

        .tab-item-btn {
            flex: 1;
            padding: 9px 12px;
            border-radius: 10px;
            font-size: 12px;
            font-weight: 700;
            border: none;
            background: transparent;
            color: #64748b;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        }

        .tab-item-btn.active {
            background: #ffffff;
            color: var(--toyota-red);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .tab-pane {
            display: none;
        }

        .tab-pane.active {
            display: block;
            animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* Vehicle Grid */
        .car-grid-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 14px;
        }

        .car-item-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            transition: all 0.2s;
            display: flex;
            flex-direction: column;
        }

        .car-item-card:hover {
            transform: translateY(-2px);
            border-color: #cbd5e1;
            box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
        }

        .car-img-cover {
            height: 120px;
            width: 100%;
            background: #f1f5f9;
            position: relative;
            overflow: hidden;
        }

        .car-img-cover img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
        }

        .car-badge-tag {
            position: absolute;
            top: 8px;
            left: 8px;
            background: var(--toyota-red);
            color: white;
            font-size: 9.5px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .car-item-body {
            padding: 12px;
            display: flex;
            flex-direction: column;
            flex: 1;
        }

        .car-item-title {
            font-family: 'Outfit', sans-serif;
            font-size: 14px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 2px;
        }

        .car-item-price {
            font-size: 12.5px;
            font-weight: 800;
            color: var(--toyota-red);
            margin-bottom: 8px;
        }

        .car-item-specs {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            font-size: 10.5px;
            color: #64748b;
            margin-bottom: 10px;
        }

        .car-item-specs span {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
        }

        .car-btn-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6px;
            margin-top: auto;
        }

        .btn-car-sub {
            padding: 7px 8px;
            border-radius: 8px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
            text-decoration: none;
            border: 1px solid #cbd5e1;
            background: #ffffff;
            color: #0f172a;
            cursor: pointer;
        }

        .btn-car-sub.primary {
            background: var(--toyota-red);
            color: white;
            border-color: var(--toyota-red);
        }

        /* Form Styled */
        .form-row {
            margin-bottom: 12px;
            text-align: left;
        }

        .form-row label {
            display: block;
            font-size: 11px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 4px;
            text-transform: uppercase;
        }

        .input-control {
            width: 100%;
            padding: 9px 12px;
            border-radius: 10px;
            border: 1.5px solid #cbd5e1;
            font-size: 12.5px;
            font-weight: 600;
            color: #0f172a;
            background: #f8fafc;
            box-sizing: border-box;
            outline: none;
            transition: all 0.2s;
        }

        .input-control:focus {
            border-color: var(--toyota-red);
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
        }

        /* Modal QR */
        .qr-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.65);
            backdrop-filter: blur(6px);
            z-index: 9999;
            align-items: center;
            justify-content: center;
            padding: 20px;
            box-sizing: border-box;
        }

        .qr-modal.show {
            display: flex;
        }

        .qr-modal-card {
            background: #ffffff;
            border-radius: 20px;
            width: 100%;
            max-width: 360px;
            padding: 22px;
            text-align: center;
            position: relative;
        }
    </style>
</head>

<body>

    <div class="mobile-app" style="max-width: 1200px;">
        
        <!-- PAGE HEADER -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Kartu Nama Digital (vCard Studio)</h2>
        </header>

        <div class="container" style="margin-top: 18px; max-width: 100%;">
            
            <!-- HEADER HERO BANNER -->
            <div style="background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 50%, #c8102e 100%); color: white; border-radius: 20px; padding: 22px 24px; box-shadow: 0 10px 25px rgba(13,27,62,0.15);">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
                    <div>
                        <span style="background: rgba(255, 255, 255, 0.2); color: #fca5a5; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-address-card"></i> Digital Smart Card Studio
                        </span>
                        <h2 style="font-family: 'Outfit', sans-serif; font-size: 22px; font-weight: 900; margin: 8px 0 4px; color: white;">Kartu Nama Digital &amp; Virtual Showroom</h2>
                        <p style="font-size: 12.5px; color: #e2e8f0; margin: 0;">Bagikan kartu nama digital resmi Anda via QR Code atau link WhatsApp ke ponsel konsumen.</p>
                    </div>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button class="btn-car-sub" style="background:#ffffff; color:#0d1b3e; font-weight:800; padding:9px 14px; border-radius:10px;" onclick="openQrModal()">
                            <i class="fa-solid fa-qrcode"></i> Scan QR Code
                        </button>
                        <button class="btn-car-sub" style="background:var(--wa-green); color:white; font-weight:800; padding:9px 14px; border-radius:10px; border-color:#1eb956;" onclick="copyPublicCardUrl()">
                            <i class="fa-solid fa-link"></i> Salin Link Publik
                        </button>
                        <button class="btn-car-sub" style="background:rgba(255,255,255,0.2); color:white; font-weight:800; padding:9px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.4);" onclick="openPublicTab()">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Tampilan Publik
                        </button>
                    </div>
                </div>
            </div>

            <!-- 2-COLUMN WORKSPACE -->
            <div class="studio-grid">
                
                <!-- LEFT COLUMN: MOCKUP PREVIEW -->
                <div class="card-preview-box">
                    <div class="card-header-gradient">
                        <div class="brand-pill">
                            <i class="fa-solid fa-car"></i> Official Sales Consultant
                        </div>
                        <h3 style="font-family: 'Outfit', sans-serif; font-size: 18px; font-weight: 900; margin: 0; color:white;">TUNAS TOYOTA</h3>
                        <span style="font-size:11.5px; font-weight:700; color:#fca5a5; display:block;">Cabang Kiara Condong &bull; Bandung</span>
                    </div>

                    <div class="profile-section">
                        <div class="avatar-circle">
                            <img id="viewAvatar" src="https://ui-avatars.com/api/?name=Indra+Gunawan&background=c8102e&color=fff&bold=true&size=200" alt="Sales Profile">
                            <div class="verified-icon"><i class="fa-solid fa-check"></i></div>
                        </div>

                        <h3 class="sales-fullname" id="viewName">Indra Gunawan</h3>
                        <div class="sales-tagline" id="viewRole">Sales Consultant &bull; NPK: 88421</div>

                        <div class="sales-intro">
                            "Melayani pemesanan Toyota All New & Hybrid dengan proses cepat, data dibantu hingga approval, diskon terbaik, dan free test drive ke rumah Anda."
                        </div>

                        <div class="action-btn-grid">
                            <a id="btnPhone" href="tel:08122334455" class="action-card-btn btn-blue">
                                <i class="fa-solid fa-phone"></i>
                                <span>Telepon</span>
                            </a>
                            <a id="btnWa" href="https://wa.me/628122334455" target="_blank" class="action-card-btn btn-green">
                                <i class="fa-brands fa-whatsapp"></i>
                                <span>WhatsApp</span>
                            </a>
                            <div class="action-card-btn" onclick="downloadVcf()">
                                <i class="fa-solid fa-address-card" style="color: #6366f1;"></i>
                                <span>Simpan</span>
                            </div>
                            <div class="action-card-btn" onclick="openQrModal()">
                                <i class="fa-solid fa-qrcode" style="color: #c8102e;"></i>
                                <span>QR Code</span>
                            </div>
                        </div>

                        <a href="https://maps.google.com/?q=Tunas+Toyota+Kiara+Condong+Bandung" target="_blank" style="display: flex; align-items: center; justify-content: center; gap: 8px; font-size: 11px; font-weight: 700; color: #0d1b3e; text-decoration: none; background: #eef4ff; border: 1px solid #bfdbfe; padding: 9px 12px; border-radius: 10px;">
                            <i class="fa-solid fa-map-location-dot" style="color: #c8102e;"></i>
                            Petunjuk Arah Showroom Tunas Toyota
                        </a>

                        <!-- PENGATURAN NOMOR WA SALES -->
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 12px; margin-top:12px; text-align:left;">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                                <label style="font-size:10.5px; font-weight:800; color:#334155; text-transform:uppercase; margin:0; display:flex; align-items:center; gap:4px;">
                                    <i class="fa-brands fa-whatsapp" style="color:#25D366; font-size:13px;"></i> Nomor WhatsApp Anda
                                </label>
                                <span style="font-size:9.5px; color:#059669; font-weight:700; background:#dcfce7; padding:1px 6px; border-radius:4px;">Aktif</span>
                            </div>
                            <input type="text" id="inputCustomWa" class="input-control" style="padding:6px 10px; font-size:12px; font-weight:700; background:#ffffff;" placeholder="Contoh: 08123456789 atau 628123456789" oninput="updateSalesWaNumber(this.value)">
                            <span style="font-size:10px; color:#64748b; margin-top:3px; display:block;">Pesan promo &amp; konsultasi simulasi kredit konsumen akan langsung masuk ke nomor WhatsApp ini.</span>
                        </div>
                    </div>
                </div>

                <!-- RIGHT COLUMN: STUDIO TOOLS -->
                <div class="studio-right-card">
                    
                    <div class="studio-tabs">
                        <button class="tab-item-btn active" onclick="switchStudioTab('tabKatalog', this)">
                            <i class="fa-solid fa-car-side"></i> Katalog Mobil
                        </button>
                        <button class="tab-item-btn" onclick="switchStudioTab('tabSimulasi', this)">
                            <i class="fa-solid fa-calculator"></i> Kalkulator Kredit
                        </button>
                    </div>

                    <!-- TAB 1: KATALOG MOBIL -->
                    <div id="tabKatalog" class="tab-pane active">
                        <div class="car-grid-cards">
                            
                            <!-- Zenix -->
                            <div class="car-item-card">
                                <div class="car-img-cover">
                                    <span class="car-badge-tag">Hybrid</span>
                                    <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&q=80" alt="Innova Zenix">
                                </div>
                                <div class="car-item-body">
                                    <h4 class="car-item-title">All New Kijang Innova Zenix</h4>
                                    <div class="car-item-price">Mulai Rp 436.000.000</div>
                                    <div class="car-item-specs">
                                        <span><i class="fa-solid fa-bolt"></i> EV Hybrid</span>
                                        <span><i class="fa-solid fa-users"></i> 7 Seater</span>
                                    </div>
                                    <div class="car-btn-actions">
                                        <button class="btn-car-sub" onclick="prefillKredit(436000000)">Hitung DP</button>
                                        <a href="https://wa.me/628122334455?text=Halo,%20saya%20tertarik%20promo%20Innova%20Zenix" target="_blank" class="btn-car-sub primary">Pesan Promo</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Yaris Cross -->
                            <div class="car-item-card">
                                <div class="car-img-cover">
                                    <span class="car-badge-tag">SUV</span>
                                    <img src="https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&q=80" alt="Yaris Cross">
                                </div>
                                <div class="car-item-body">
                                    <h4 class="car-item-title">All New Yaris Cross Hybrid</h4>
                                    <div class="car-item-price">Mulai Rp 359.000.000</div>
                                    <div class="car-item-specs">
                                        <span><i class="fa-solid fa-shield-halved"></i> TSS Active</span>
                                        <span><i class="fa-solid fa-sun"></i> Sunroof</span>
                                    </div>
                                    <div class="car-btn-actions">
                                        <button class="btn-car-sub" onclick="prefillKredit(359000000)">Hitung DP</button>
                                        <a href="https://wa.me/628122334455?text=Halo,%20saya%20tertarik%20promo%20Yaris%20Cross" target="_blank" class="btn-car-sub primary">Pesan Promo</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Avanza & Veloz -->
                            <div class="car-item-card">
                                <div class="car-img-cover">
                                    <span class="car-badge-tag">Favorit</span>
                                    <img src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&q=80" alt="Avanza Veloz">
                                </div>
                                <div class="car-item-body">
                                    <h4 class="car-item-title">All New Avanza &amp; Veloz</h4>
                                    <div class="car-item-price">Mulai Rp 245.000.000</div>
                                    <div class="car-item-specs">
                                        <span><i class="fa-solid fa-couch"></i> Sofa Mode</span>
                                        <span><i class="fa-solid fa-gas-pump"></i> Irit FWD</span>
                                    </div>
                                    <div class="car-btn-actions">
                                        <button class="btn-car-sub" onclick="prefillKredit(245000000)">Hitung DP</button>
                                        <a href="https://wa.me/628122334455?text=Halo,%20saya%20tertarik%20promo%20Avanza%20Veloz" target="_blank" class="btn-car-sub primary">Pesan Promo</a>
                                    </div>
                                </div>
                            </div>

                            <!-- Hilux Rangga -->
                            <div class="car-item-card">
                                <div class="car-img-cover">
                                    <span class="car-badge-tag" style="background:#0d1b3e;">Niaga</span>
                                    <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80" alt="Hilux Rangga">
                                </div>
                                <div class="car-item-body">
                                    <h4 class="car-item-title">Hilux Rangga Pick-Up &amp; Cab</h4>
                                    <div class="car-item-price">Mulai Rp 198.000.000</div>
                                    <div class="car-item-specs">
                                        <span><i class="fa-solid fa-truck-ramp-box"></i> 1.2 Ton</span>
                                        <span><i class="fa-solid fa-wrench"></i> Mesin GD</span>
                                    </div>
                                    <div class="car-btn-actions">
                                        <button class="btn-car-sub" onclick="prefillKredit(198000000)">Hitung DP</button>
                                        <a href="https://wa.me/628122334455?text=Halo,%20saya%20tertarik%20Hilux%20Rangga" target="_blank" class="btn-car-sub primary">Pesan Promo</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <!-- TAB 2: KALKULATOR KREDIT -->
                    <div id="tabSimulasi" class="tab-pane">
                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:18px;">
                            <h4 style="font-family:'Outfit',sans-serif; font-size:15px; font-weight:800; margin:0 0 12px;">Kalkulator Angsuran Cepat</h4>

                            <div class="form-row">
                                <label>Pilihan Model Mobil</label>
                                <select id="calcModel" class="input-control" onchange="runSimulasi()">
                                    <option value="436000000">Kijang Innova Zenix - Rp 436.000.000</option>
                                    <option value="359000000">Yaris Cross Hybrid - Rp 359.000.000</option>
                                    <option value="245000000">All New Avanza 1.5 - Rp 245.000.000</option>
                                    <option value="305000000">All New Veloz Q TSS - Rp 305.000.000</option>
                                    <option value="198000000">Hilux Rangga Bensin - Rp 198.000.000</option>
                                </select>
                            </div>

                            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                                <div class="form-row">
                                    <label>Uang Muka (DP %)</label>
                                    <select id="calcDp" class="input-control" onchange="runSimulasi()">
                                        <option value="0.15">DP 15%</option>
                                        <option value="0.20" selected>DP 20%</option>
                                        <option value="0.25">DP 25%</option>
                                        <option value="0.30">DP 30%</option>
                                    </select>
                                </div>

                                <div class="form-row">
                                    <label>Tenor</label>
                                    <select id="calcTenor" class="input-control" onchange="runSimulasi()">
                                        <option value="12">1 Tahun</option>
                                        <option value="24">2 Tahun</option>
                                        <option value="36">3 Tahun</option>
                                        <option value="48">4 Tahun</option>
                                        <option value="60" selected>5 Tahun</option>
                                    </select>
                                </div>
                            </div>

                            <div style="background:var(--toyota-navy); color:white; border-radius:12px; padding:16px; margin-top:10px; text-align:center;">
                                <div style="font-size:10.5px; color:#93c5fd; font-weight:700; text-transform:uppercase;">Estimasi Cicilan / Bulan</div>
                                <div id="calcAngsuran" style="font-family:'Outfit',sans-serif; font-size:22px; font-weight:900; color:#38bdf8; margin:2px 0;">Rp 7.850.000</div>
                                <div id="calcDpTotal" style="font-size:11.5px; color:#cbd5e1;">Total DP: <strong>Rp 87.200.000</strong></div>
                            </div>

                            <button class="btn-car-sub primary" style="width:100%; margin-top:14px; padding:11px; font-size:12.5px; background:var(--wa-green); border-color:#1eb956;" onclick="sendKreditWa()">
                                <i class="fa-brands fa-whatsapp"></i> Konsultasikan Hitungan Ini ke WhatsApp
                            </button>
                        </div>
                    </div>

                </div>

            </div>

        </div>

    </div>

    <!-- MODAL QR CODE -->
    <div class="qr-modal" id="qrModal" onclick="closeQrModal()">
        <div class="qr-modal-card" onclick="event.stopPropagation()">
            <button style="position:absolute; top:12px; right:12px; background:#f1f5f9; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer;" onclick="closeQrModal()"><i class="fa-solid fa-xmark"></i></button>
            <h4 style="font-family:'Outfit',sans-serif; font-size:17px; font-weight:800; margin:0 0 4px;">Scan Kartu Digital Konsumen</h4>
            <p style="font-size:11.5px; color:#64748b; margin:0 0 12px;">Arahkan kamera smartphone konsumen untuk membuka halaman profil publik Anda.</p>
            
            <div id="qrCodeTarget" style="display:flex; justify-content:center; padding:10px; background:white; border-radius:12px; width:fit-content; margin:0 auto 14px; box-shadow:0 2px 10px rgba(0,0,0,0.06);"></div>

            <div style="display:flex; gap:8px;">
                <button class="btn-car-sub" style="flex:1;" onclick="copyPublicCardUrl()"><i class="fa-solid fa-copy"></i> Salin Link</button>
                <button class="btn-car-sub primary" style="flex:1;" onclick="openPublicTab()"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Web</button>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        let salesState = {
            nama: localStorage.getItem('namaSales') || 'Indra Gunawan',
            role: localStorage.getItem('peranSales') || 'Sales Consultant',
            npk: localStorage.getItem('idSales') || '88421',
            noWa: localStorage.getItem('noHpSales') || localStorage.getItem('no_hp') || '08122334455',
            noTelp: localStorage.getItem('noHpSales') || localStorage.getItem('no_hp') || '08122334455'
        };

        // Format clean international WA number (e.g. 62812xxx)
        function formatCleanWa(raw) {
            let clean = (raw || '').replace(/[^0-9]/g, '');
            if (clean.startsWith('0')) clean = '62' + clean.substring(1);
            if (!clean) clean = '628122334455';
            return clean;
        }

        function refreshProfileDisplay() {
            document.getElementById('viewName').innerText = salesState.nama;
            document.getElementById('viewRole').innerText = `${salesState.role} • NPK: ${salesState.npk}`;
            document.getElementById('viewAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(salesState.nama)}&background=c8102e&color=fff&bold=true&size=200`;
            
            const cleanWa = formatCleanWa(salesState.noWa);
            document.getElementById('btnPhone').href = `tel:${salesState.noTelp || salesState.noWa}`;
            document.getElementById('btnWa').href = `https://wa.me/${cleanWa}?text=${encodeURIComponent('Halo ' + salesState.nama + ', saya tertarik konsultasi mobil Toyota.')}`;
            
            const waInput = document.getElementById('inputCustomWa');
            if (waInput && !waInput.value) {
                waInput.value = salesState.noWa;
            }
        }

        // Auto-fetch profile from database if salesId is available
        const currentSalesId = localStorage.getItem('salesId') || localStorage.getItem('idSales');
        if (currentSalesId) {
            fetch(`../api/api_edit_profil.php?sales_id=${currentSalesId}`)
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success' && res.data) {
                        if (res.data.nama_lengkap) salesState.nama = res.data.nama_lengkap;
                        if (res.data.no_hp) {
                            salesState.noWa = res.data.no_hp;
                            salesState.noTelp = res.data.no_hp;
                            localStorage.setItem('noHpSales', res.data.no_hp);
                            localStorage.setItem('no_hp', res.data.no_hp);
                            const waInput = document.getElementById('inputCustomWa');
                            if (waInput) waInput.value = res.data.no_hp;
                        }
                        if (res.data.instagram_url) salesState.instagram = res.data.instagram_url;
                        if (res.data.tiktok_url) salesState.tiktok = res.data.tiktok_url;
                        if (res.data.facebook_url) salesState.facebook = res.data.facebook_url;
                        if (res.data.website_url) salesState.website = res.data.website_url;
                        refreshProfileDisplay();
                    }
                })
                .catch(err => console.warn('Could not auto-fetch profile:', err));
        }

        function updateSalesWaNumber(val) {
            val = val.trim();
            if (val) {
                salesState.noWa = val;
                salesState.noTelp = val;
                localStorage.setItem('noHpSales', val);
                localStorage.setItem('no_hp', val);
                qrDone = false; // Reset QR so next scan uses new number
                refreshProfileDisplay();
            }
        }

        function getPublicLink() {
            let base = window.location.href.split('pages/')[0] + 'pages/public_card.html';
            const cleanWa = formatCleanWa(salesState.noWa);
            const params = {
                sales: salesState.nama,
                role: salesState.role,
                npk: salesState.npk,
                wa: cleanWa,
                telp: salesState.noTelp || salesState.noWa
            };
            const ig = salesState.instagram || localStorage.getItem('salesInstagram');
            const tt = salesState.tiktok || localStorage.getItem('salesTiktok');
            const fb = salesState.facebook || localStorage.getItem('salesFacebook');
            const web = salesState.website || localStorage.getItem('salesWebsite');

            if (ig) params.ig = ig;
            if (tt) params.tt = tt;
            if (fb) params.fb = fb;
            if (web) params.web = web;

            const q = new URLSearchParams(params);
            return `${base}?${q.toString()}`;
        }

        function switchStudioTab(tabId, btn) {
            document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.tab-item-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            btn.classList.add('active');
        }

        function runSimulasi() {
            const otr = parseFloat(document.getElementById('calcModel').value);
            const dpPct = parseFloat(document.getElementById('calcDp').value);
            const tenor = parseInt(document.getElementById('calcTenor').value);

            const dpMurni = otr * dpPct;
            const pokok = otr - dpMurni;
            const bungaRate = 0.048;
            const totalBunga = pokok * bungaRate * (tenor / 12);
            const angsuran = (pokok + totalBunga) / tenor;

            document.getElementById('calcAngsuran').innerText = `Rp ${Math.round(angsuran).toLocaleString('id-ID')}`;
            document.getElementById('calcDpTotal').innerHTML = `Total DP (${Math.round(dpPct * 100)}%): <strong>Rp ${Math.round(dpMurni).toLocaleString('id-ID')}</strong>`;
        }

        function prefillKredit(otr) {
            switchStudioTab('tabSimulasi', document.querySelectorAll('.tab-item-btn')[1]);
            document.getElementById('calcModel').value = otr;
            runSimulasi();
        }

        function sendKreditWa() {
            const modelText = document.getElementById('calcModel').options[document.getElementById('calcModel').selectedIndex].text;
            const cicilan = document.getElementById('calcAngsuran').innerText;
            const dp = document.getElementById('calcDpTotal').innerText;
            const tenor = document.getElementById('calcTenor').value;
            const cleanWa = formatCleanWa(salesState.noWa);

            const text = `Halo ${salesState.nama},\nSaya ingin konsultasi simulasi kredit:\n\n🚗 Unit: *${modelText}*\n💰 ${dp}\n📅 Cicilan: *${cicilan}/bulan* (${tenor} Bulan)\n\nMohon info diskon dan ketersediaan unitnya. Terima kasih.`;
            window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`, '_blank');
        }

        function downloadVcf() {
            const vcard = `BEGIN:VCARD
VERSION:3.0
N:${salesState.nama};;;;
FN:${salesState.nama} (Tunas Toyota Kiara Condong)
ORG:Tunas Toyota Kiara Condong Bandung
TITLE:${salesState.role}
TEL;TYPE=CELL,VOICE:${salesState.noTelp || salesState.noWa}
URL:${getPublicLink()}
END:VCARD`;

            const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = `${salesState.nama.replace(/\s+/g, '_')}_Toyota.vcf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        let qrDone = false;
        function openQrModal() {
            document.getElementById('qrModal').classList.add('show');
            const targetUrl = getPublicLink();
            const qrContainer = document.getElementById('qrCodeTarget');
            qrContainer.innerHTML = '';
            new QRCode(qrContainer, {
                text: targetUrl,
                width: 170,
                height: 170,
                colorDark: "#0d1b3e",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        }

        function closeQrModal() {
            document.getElementById('qrModal').classList.remove('show');
        }

        function copyPublicCardUrl() {
            navigator.clipboard.writeText(getPublicLink()).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Link Publik Disalin!',
                    text: 'Tautan kartu nama digital publik telah disalin ke clipboard.',
                    timer: 1500,
                    showConfirmButton: false
                });
            });
        }

        function openPublicTab() {
            window.open(getPublicLink(), '_blank');
        }

        // Initialize Display & Calculations
        refreshProfileDisplay();
        runSimulasi();
    </script>
</body>

</html>
