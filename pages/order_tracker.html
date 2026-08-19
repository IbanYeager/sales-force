<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Vehicle Delivery Tracker - Tunas Toyota Kiara Condong</title>
    <meta name="description" content="Pelacak status pesanan mobil Toyota secara langsung dan transparan untuk konsumen dan wiraniaga.">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="stylesheet" href="../css/style.css?v=5.0">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script src="../js/script.js"></script>
    <script src="../js/sidebar_desktop.js"></script>

    <style>
        :root {
            --toyota-red: #c8102e;
            --toyota-red-dark: #990e24;
            --toyota-navy: #0d1b3e;
            --step-active: #2563eb;
            --step-done: #10b981;
            --step-pending: #cbd5e1;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #f8fafc;
            color: #0f172a;
        }

        .tracker-hero {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #c8102e 100%);
            border-radius: 24px;
            padding: 26px 28px;
            color: white;
            margin-bottom: 24px;
            box-shadow: 0 12px 30px rgba(13, 27, 62, 0.18);
            position: relative;
            overflow: hidden;
        }

        .tracker-hero::after {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 180px;
            height: 180px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
            border-radius: 50%;
        }

        .search-card {
            background: #ffffff;
            border-radius: 18px;
            padding: 16px 20px;
            border: 1px solid #e2e8f0;
            margin-bottom: 22px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
            display: flex;
            gap: 12px;
            align-items: center;
            flex-wrap: wrap;
        }

        .search-input-box {
            flex: 1;
            min-width: 220px;
            position: relative;
        }

        .search-input-box i {
            position: absolute;
            left: 14px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
        }

        .search-input-box input {
            width: 100%;
            padding: 11px 14px 11px 40px;
            border-radius: 12px;
            border: 1.5px solid #cbd5e1;
            font-size: 13px;
            font-weight: 600;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s;
        }

        .search-input-box input:focus {
            border-color: #c8102e;
            box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
        }

        /* Order Summary Card */
        .order-summary-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 20px;
            padding: 22px;
            margin-bottom: 24px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }

        .unit-badge-pill {
            background: #fef2f2;
            color: #c8102e;
            font-size: 11.5px;
            font-weight: 800;
            padding: 5px 12px;
            border-radius: 20px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #fecaca;
        }

        .specs-grid-2 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 12px;
            margin-top: 16px;
            background: #f8fafc;
            padding: 16px;
            border-radius: 14px;
            border: 1px solid #e2e8f0;
        }

        .spec-item .label {
            font-size: 11px;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .spec-item .val {
            font-size: 13.5px;
            font-weight: 800;
            color: #0f172a;
        }

        /* Progress Stepper Timeline */
        .timeline-stepper {
            display: flex;
            flex-direction: column;
            gap: 18px;
            position: relative;
            margin-top: 24px;
        }

        .timeline-stepper::before {
            content: '';
            position: absolute;
            left: 21px;
            top: 25px;
            bottom: 25px;
            width: 3px;
            background: #e2e8f0;
            z-index: 1;
        }

        .step-item {
            display: flex;
            gap: 18px;
            align-items: flex-start;
            position: relative;
            z-index: 2;
        }

        .step-circle {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: #ffffff;
            border: 3px solid var(--step-pending);
            color: #94a3b8;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 800;
            flex-shrink: 0;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            transition: all 0.3s;
        }

        .step-item.completed .step-circle {
            background: var(--step-done);
            border-color: var(--step-done);
            color: white;
        }

        .step-item.active .step-circle {
            background: var(--step-active);
            border-color: #93c5fd;
            color: white;
            box-shadow: 0 0 0 5px rgba(37, 99, 235, 0.2);
            animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }

        .step-content {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 16px;
            padding: 16px 18px;
            flex: 1;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
            transition: all 0.2s;
        }

        .step-item.active .step-content {
            border-color: #93c5fd;
            background: #f0f7ff;
            box-shadow: 0 4px 16px rgba(37, 99, 235, 0.08);
        }

        .step-title {
            font-family: 'Outfit', sans-serif;
            font-size: 15px;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .step-desc {
            font-size: 12.5px;
            color: #64748b;
            line-height: 1.5;
            margin: 0;
        }

        .step-time {
            font-size: 11px;
            font-weight: 700;
            color: #10b981;
            background: #ecfdf5;
            padding: 2px 8px;
            border-radius: 12px;
        }

        /* Action floating bar */
        .tracker-action-bar {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            flex-wrap: wrap;
        }

        .btn-action-tracker {
            padding: 11px 18px;
            border-radius: 12px;
            font-size: 12.5px;
            font-weight: 700;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
            text-decoration: none;
        }

        .btn-wa-tracker {
            background: #25D366;
            color: white;
            box-shadow: 0 4px 12px rgba(37, 211, 102, 0.25);
        }

        .btn-update-tracker {
            background: #0d1b3e;
            color: white;
        }

        /* Modal update status */
        .modal-tracker {
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

        .modal-tracker.show {
            display: flex;
            animation: modalFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes modalFadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }

        .modal-tracker-box {
            background: #ffffff;
            border-radius: 22px;
            max-width: 500px;
            width: 100%;
            padding: 26px;
            box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
            position: relative;
            box-sizing: border-box;
        }

        /* Form Controls */
        .styled-form-group {
            margin-bottom: 16px;
            text-align: left;
        }

        .styled-form-group label {
            display: block;
            font-size: 11.5px;
            font-weight: 700;
            color: #475569;
            margin-bottom: 6px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
        }

        .styled-input {
            width: 100%;
            padding: 11px 14px;
            border-radius: 12px;
            border: 1.5px solid #cbd5e1;
            font-size: 13px;
            font-weight: 600;
            color: #0f172a;
            background: #f8fafc;
            box-sizing: border-box;
            outline: none;
            transition: all 0.2s ease;
            font-family: inherit;
            display: block;
        }

        .styled-input:focus {
            border-color: #0284c7;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }

        .btn-submit-action {
            width: 100%;
            padding: 13px 18px;
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%);
            color: #ffffff;
            border: none;
            border-radius: 14px;
            font-size: 13.5px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 6px 18px rgba(13, 27, 62, 0.25);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            transition: all 0.2s ease;
            margin-top: 10px;
        }

        .btn-submit-action:hover {
            background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
        }
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 1100px;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Live Vehicle Delivery Tracker</h2>
        </header>

        <div class="container" style="margin-top: 18px;">
            
            <!-- HERO HEADER -->
            <div class="tracker-hero">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
                    <div>
                        <span style="background:rgba(255,255,255,0.2); color:#fca5a5; font-size:11px; font-weight:800; padding:4px 12px; border-radius:20px; text-transform:uppercase;">
                            <i class="fa-solid fa-truck-ramp-box"></i> Real-Time Customer Order Progress
                        </span>
                        <h2 style="font-family:'Outfit',sans-serif; font-size:24px; font-weight:900; margin:8px 0 4px; color:white;">Pelacak Status Pesanan Mobil</h2>
                        <p style="font-size:13px; color:#e2e8f0; margin:0;">Pantau tahapan proses dari tanda jadi SPK, alokasi nomor rangka, PDI aksesoris, hingga pengiriman unit ke garasi konsumen.</p>
                    </div>
                    <div>
                        <button onclick="openPublicTrackingTab()" class="btn-action-tracker" style="background:#ffffff; color:#0d1b3e; font-weight:800; padding:10px 16px; border-radius:12px; border:none; cursor:pointer;">
                            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Web Customer POV
                        </button>
                    </div>
                </div>
            </div>

            <!-- SEARCH / SELECT SPK -->
            <div class="search-card">
                <div class="search-input-box">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="inputCariSpk" placeholder="Cari No. SPK (contoh: SPK-2026-08-019) atau Nama Konsumen..." onkeyup="filterOrders(this.value)">
                </div>
                <select id="selectOrderQuick" class="styled-input" style="width: auto; padding: 10px 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 700; font-size: 13px;" onchange="loadOrderById(this.value)">
                    <option value="1">SPK-2026-08-019 (Budi Santoso - Zenix Hybrid)</option>
                    <option value="2">SPK-2026-08-024 (Ibu Rina - Yaris Cross)</option>
                    <option value="3">SPK-2026-08-008 (PT. Makmur - Hilux Rangga)</option>
                </select>
                <button class="btn-action-tracker btn-update-tracker" onclick="openUpdateModal()">
                    <i class="fa-solid fa-pen-to-square"></i> Update Milestone
                </button>
            </div>

            <!-- ORDER SUMMARY CARD -->
            <div class="order-summary-card" id="orderSummaryBox">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px; border-bottom:1px solid #f1f5f9; padding-bottom:14px;">
                    <div>
                        <span class="unit-badge-pill" id="trackSpkNo"><i class="fa-solid fa-receipt"></i> SPK-2026-08-019</span>
                        <h3 style="font-family:'Outfit',sans-serif; font-size:20px; font-weight:900; color:#0f172a; margin:8px 0 2px;" id="trackUnitName">All New Kijang Innova Zenix 2.0 V Hybrid Modellista</h3>
                        <p style="font-size:13px; color:#64748b; margin:0;" id="trackCustomerInfo">Pemesan: <strong>Budi Santoso, S.T.</strong> &bull; 08123456789</p>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Estimasi Serah Terima:</span>
                        <div style="font-family:'Outfit',sans-serif; font-size:17px; font-weight:900; color:#c8102e;" id="trackEstDelivery">17 Agustus 2026</div>
                    </div>
                </div>

                <div class="specs-grid-2">
                    <div class="spec-item">
                        <div class="label">Warna Unit</div>
                        <div class="val" id="trackWarna">Platinum White Pearl</div>
                    </div>
                    <div class="spec-item">
                        <div class="label">Metode Bayar / Leasing</div>
                        <div class="val" id="trackLeasing">TAF (Toyota Astra Financial)</div>
                    </div>
                    <div class="spec-item">
                        <div class="label">Nomor Rangka (VIN)</div>
                        <div class="val" id="trackRangka">MHFV1234567890</div>
                    </div>
                    <div class="spec-item">
                        <div class="label">Nomor Polisi Sementara</div>
                        <div class="val" id="trackPlat">D 1928 TNS</div>
                    </div>
                </div>

                <!-- TIMELINE STEPPER -->
                <div class="timeline-stepper" id="stepperContainer">
                    
                    <!-- Step 1 -->
                    <div class="step-item completed" id="stepNode1">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>1. SPK Diterima &amp; Verifikasi Berkas</span>
                                <span class="step-time">Selesai</span>
                            </div>
                            <p class="step-desc">Surat Pesanan Kendaraan (SPK) resmi terdaftar di sistem Tunas Toyota Kiara Condong. Berkas KTP/KK telah diverifikasi.</p>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="step-item completed" id="stepNode2">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>2. Approval &amp; Konfirmasi PO Leasing</span>
                                <span class="step-time">Selesai</span>
                            </div>
                            <p class="step-desc">Aplikasi kredit disetujui oleh leasing (TAF) dan Purchase Order (PO) telah diterbitkan.</p>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="step-item completed" id="stepNode3">
                        <div class="step-circle"><i class="fa-solid fa-check"></i></div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>3. Alokasi Nomor Rangka &amp; Mesin Unit</span>
                                <span class="step-time">Selesai</span>
                            </div>
                            <p class="step-desc">Unit fisik telah dialokasikan dari gudang logistik pusat Astra Toyota dengan Nomor Rangka terdaftar.</p>
                        </div>
                    </div>

                    <!-- Step 4 -->
                    <div class="step-item active" id="stepNode4">
                        <div class="step-circle">4</div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>4. Pre-Delivery Inspection (PDI) &amp; Aksesoris TCO</span>
                                <span class="step-time" style="background:#dbeafe; color:#1d4ed8;">Sedang Berjalan</span>
                            </div>
                            <p class="step-desc" id="step4Desc">Inspeksi menyeluruh 21 titik kualitas kendaraan di bengkel PDI dan pemasangan aksesoris resmi Kaca Film 3M + Karpet TCO.</p>
                        </div>
                    </div>

                    <!-- Step 5 -->
                    <div class="step-item" id="stepNode5">
                        <div class="step-circle">5</div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>5. Pengurusan Faktur &amp; STNK / Plat Nomor</span>
                                <span class="step-time" style="background:#f1f5f9; color:#94a3b8;">Menunggu</span>
                            </div>
                            <p class="step-desc">Penerbitan faktur dari ATPM dan pendaftaran STNK/Plat nomor ke Samsat Polda Jabar.</p>
                        </div>
                    </div>

                    <!-- Step 6 -->
                    <div class="step-item" id="stepNode6">
                        <div class="step-circle">6</div>
                        <div class="step-content">
                            <div class="step-title">
                                <span>6. Jadwal Delivery Order (DO) &amp; Serah Terima Unit</span>
                                <span class="step-time" style="background:#f1f5f9; color:#94a3b8;">Menunggu</span>
                            </div>
                            <p class="step-desc">Pengiriman mobil towing / serah terima megah di delivery room showroom Tunas Toyota Kiara Condong.</p>
                        </div>
                    </div>

                </div>

                <!-- ACTIONS FOOTER -->
                <div class="tracker-action-bar">
                    <button class="btn-action-tracker btn-wa-tracker" onclick="shareTrackerToWa()">
                        <i class="fa-brands fa-whatsapp"></i> Bagikan Status Progres ke WhatsApp Konsumen
                    </button>
                    <button class="btn-action-tracker" style="background:#f1f5f9; color:#0f172a; border:1px solid #cbd5e1;" onclick="copyTrackerLink()">
                        <i class="fa-solid fa-link"></i> Salin Tautan Tracking
                    </button>
                </div>
            </div>

        </div>
    </div>

    <!-- MODAL UPDATE STATUS MILESTONE -->
    <div class="modal-tracker" id="modalUpdate" onclick="closeUpdateModal()">
        <div class="modal-tracker-box" onclick="event.stopPropagation()">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
                <h3 style="font-family:'Outfit',sans-serif; font-size:18px; font-weight:800; margin:0; color:#0f172a;">Update Progres Pengiriman</h3>
                <button onclick="closeUpdateModal()" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; font-size:14px; color:#64748b; cursor:pointer; display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="styled-form-group">
                <label>Pilih Tahap Terkini</label>
                <select id="modalTahapSelect" class="styled-input">
                    <option value="1">1. SPK Diterima &amp; Berkas Masuk</option>
                    <option value="2">2. Approval Leasing Disetujui</option>
                    <option value="3">3. Alokasi Nomor Rangka/Mesin</option>
                    <option value="4">4. PDI &amp; Pasang Aksesoris</option>
                    <option value="5">5. Faktur &amp; STNK / Plat</option>
                    <option value="6">6. Siap Dikirim / DO Selesai</option>
                </select>
            </div>

            <div class="styled-form-group">
                <label>Nomor Rangka (VIN)</label>
                <input type="text" id="modalRangka" class="styled-input" placeholder="Contoh: MHFV1234567890">
            </div>

            <div class="styled-form-group">
                <label>Nomor Plat Sementara</label>
                <input type="text" id="modalPlat" class="styled-input" placeholder="Contoh: D 1928 TNS">
            </div>

            <div class="styled-form-group">
                <label>Estimasi Tanggal Kirim</label>
                <input type="date" id="modalEstDate" class="styled-input">
            </div>

            <div class="styled-form-group">
                <label>Catatan Progres Tambahan</label>
                <textarea id="modalCatatan" class="styled-input" rows="3" placeholder="Tuliskan catatan terkini untuk konsumen..."></textarea>
            </div>

            <button type="button" class="btn-submit-action" onclick="saveMilestoneUpdate()">
                <i class="fa-solid fa-check"></i> Simpan Pembaruan Progres
            </button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <script>
        let currentOrder = null;
        let ordersMap = {};

        function fetchOrdersFromDB() {
            fetch('../api/api_order_tracker.php')
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success' && res.data && res.data.length > 0) {
                        ordersMap = {};
                        const selectElem = document.getElementById('selectOrderQuick');
                        if (selectElem) selectElem.innerHTML = '';

                        res.data.forEach((ord) => {
                            ordersMap[ord.id] = ord;
                            if (selectElem) {
                                const opt = document.createElement('option');
                                opt.value = ord.id;
                                opt.textContent = `${ord.no_spk} - ${ord.nama_customer} (${ord.model_unit.substring(0, 25)})`;
                                selectElem.appendChild(opt);
                            }
                        });

                        // Check URL params for specific SPK or ID
                        const urlParams = new URLSearchParams(window.location.search);
                        const paramSpk = urlParams.get('spk');
                        const paramId = urlParams.get('id');

                        let matchedOrder = null;
                        if (paramSpk) {
                            matchedOrder = res.data.find(o => o.no_spk.toLowerCase() === paramSpk.toLowerCase());
                        } else if (paramId) {
                            matchedOrder = ordersMap[paramId];
                        }

                        // Set matched or first order as current
                        currentOrder = matchedOrder || res.data[0];
                        if (selectElem && currentOrder) {
                            selectElem.value = currentOrder.id;
                        }
                        renderTracker();
                    }
                })
                .catch(err => {
                    console.error('Error fetching orders from DB:', err);
                });
        }

        function renderTracker() {
            if (!currentOrder) return;
            document.getElementById('trackSpkNo').innerHTML = `<i class="fa-solid fa-receipt"></i> ${currentOrder.no_spk}`;
            document.getElementById('trackUnitName').innerText = currentOrder.model_unit;
            document.getElementById('trackCustomerInfo').innerHTML = `Pemesan: <strong>${currentOrder.nama_customer}</strong> &bull; ${currentOrder.no_hp}`;
            document.getElementById('trackEstDelivery').innerText = currentOrder.estimasi_delivery;
            document.getElementById('trackWarna').innerText = currentOrder.warna_unit || '-';
            document.getElementById('trackLeasing').innerText = currentOrder.leasing || '-';
            document.getElementById('trackRangka').innerText = currentOrder.no_rangka || 'Menunggu Alokasi';
            document.getElementById('trackPlat').innerText = currentOrder.no_polisi_sementara || 'Dalam Pengurusan';

            // Render 6 Stepper Nodes
            for (let i = 1; i <= 6; i++) {
                const node = document.getElementById(`stepNode${i}`);
                if (!node) continue;
                const circle = node.querySelector('.step-circle');
                const timeBadge = node.querySelector('.step-time');

                node.classList.remove('completed', 'active');

                if (i < currentOrder.tahap_progres) {
                    node.classList.add('completed');
                    circle.innerHTML = '<i class="fa-solid fa-check"></i>';
                    timeBadge.innerText = 'Selesai';
                    timeBadge.style.background = '#ecfdf5';
                    timeBadge.style.color = '#10b981';
                } else if (i === parseInt(currentOrder.tahap_progres)) {
                    node.classList.add('active');
                    circle.innerHTML = `${i}`;
                    timeBadge.innerText = 'Sedang Berjalan';
                    timeBadge.style.background = '#dbeafe';
                    timeBadge.style.color = '#1d4ed8';
                } else {
                    circle.innerHTML = `${i}`;
                    timeBadge.innerText = 'Menunggu';
                    timeBadge.style.background = '#f1f5f9';
                    timeBadge.style.color = '#94a3b8';
                }
            }
        }

        function loadOrderById(id) {
            if (ordersMap[id]) {
                currentOrder = ordersMap[id];
                renderTracker();
            }
        }

        function filterOrders(query) {
            query = query.toLowerCase();
            for (const [id, ord] of Object.entries(ordersMap)) {
                if (ord.no_spk.toLowerCase().includes(query) || ord.nama_customer.toLowerCase().includes(query) || (ord.model_unit && ord.model_unit.toLowerCase().includes(query))) {
                    loadOrderById(id);
                    document.getElementById('selectOrderQuick').value = id;
                    break;
                }
            }
        }

        function openUpdateModal() {
            if (!currentOrder) return;
            document.getElementById('modalTahapSelect').value = currentOrder.tahap_progres;
            document.getElementById('modalRangka').value = currentOrder.no_rangka || '';
            document.getElementById('modalPlat').value = currentOrder.no_polisi_sementara || '';
            document.getElementById('modalEstDate').value = currentOrder.estimasi_delivery || '';
            document.getElementById('modalCatatan').value = currentOrder.catatan_terakhir || '';
            document.getElementById('modalUpdate').classList.add('show');
        }

        function closeUpdateModal() {
            document.getElementById('modalUpdate').classList.remove('show');
        }

        function saveMilestoneUpdate() {
            if (!currentOrder) return;
            const updatedTahap = parseInt(document.getElementById('modalTahapSelect').value);
            const updatedRangka = document.getElementById('modalRangka').value.trim();
            const updatedPlat = document.getElementById('modalPlat').value.trim();
            const updatedEstDate = document.getElementById('modalEstDate').value;
            const updatedCatatan = document.getElementById('modalCatatan').value.trim();

            const payload = {
                action: 'update_milestone',
                id: currentOrder.id,
                no_spk: currentOrder.no_spk,
                tahap_progres: updatedTahap,
                no_rangka: updatedRangka,
                no_polisi_sementara: updatedPlat,
                estimasi_delivery: updatedEstDate,
                catatan_terakhir: updatedCatatan
            };

            fetch('../api/api_order_tracker.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            .then(r => r.json())
            .then(res => {
                currentOrder.tahap_progres = updatedTahap;
                currentOrder.no_rangka = updatedRangka;
                currentOrder.no_polisi_sementara = updatedPlat;
                currentOrder.estimasi_delivery = updatedEstDate;
                currentOrder.catatan_terakhir = updatedCatatan;

                ordersMap[currentOrder.id] = { ...currentOrder };

                renderTracker();
                closeUpdateModal();

                Swal.fire({
                    icon: 'success',
                    title: 'Progres Tersimpan ke Database!',
                    text: `Status ${currentOrder.no_spk} berhasil diperbarui di database MySQL.`,
                    timer: 1500,
                    showConfirmButton: false
                });
            })
            .catch(err => {
                console.error('Error updating milestone:', err);
            });
        }

        function getPublicTrackingUrl() {
            let baseUrl = `${window.location.origin}/customer_pov/track_public.html`;
            return `${baseUrl}?spk=${encodeURIComponent(currentOrder ? currentOrder.no_spk : '')}`;
        }

        function openPublicTrackingTab() {
            window.open(getPublicTrackingUrl(), '_blank');
        }

        function shareTrackerToWa() {
            if (!currentOrder) return;
            const tahapNames = [
                "",
                "1. SPK Diterima & Verifikasi Berkas",
                "2. Approval Leasing Disetujui",
                "3. Alokasi Nomor Rangka & Mesin",
                "4. PDI & Pemasangan Aksesoris TCO",
                "5. Pengurusan Faktur & STNK/Plat",
                "6. Siap Dikirim / DO Selesai"
            ];

            const trackLink = getPublicTrackingUrl();
            const text = `*UPDATE STATUS PESANAN MOBIL TOYOTA*\nDealer: Tunas Toyota Kiara Condong\n\nYth. Bapak/Ibu *${currentOrder.nama_customer}*,\nBerikut adalah progres pesanan mobil Anda:\n\n📄 No. SPK: *${currentOrder.no_spk}*\n🚗 Unit: *${currentOrder.model_unit}*\n🎨 Warna: ${currentOrder.warna_unit || '-'}\n📊 Status Terkini: *${tahapNames[currentOrder.tahap_progres]}*\n📅 Estimasi Kirim: *${currentOrder.estimasi_delivery}*\n📝 Catatan: _${currentOrder.catatan_terakhir || 'Proses berjalan lancar.'}_\n\n🔗 Lacak Langsung via Web Customer:\n${trackLink}\n\nWiraniaga: ${currentOrder.sales_name || 'Indra Gunawan'} (${currentOrder.sales_phone || '08122334455'})\nTerima kasih telah mempercayakan mobil idaman Anda pada Tunas Toyota.`;
            const cleanPhone = (currentOrder.no_hp || '').replace(/[^0-9]/g, '').replace(/^0/, '62');
            window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
        }

        function copyTrackerLink() {
            const trackLink = getPublicTrackingUrl();
            navigator.clipboard.writeText(trackLink).then(() => {
                Swal.fire({
                    icon: 'success',
                    title: 'Tautan Publik Disalin!',
                    text: 'Link pelacak pesanan untuk konsumen berhasil disalin ke clipboard.',
                    timer: 1500,
                    showConfirmButton: false
                });
            });
        }

        // Initialize from Database
        fetchOrdersFromDB();
    </script>
</body>

</html>
