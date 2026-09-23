<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Booking Service m-Toyota & Progress Tracker</title>
    <meta name="description" content="Monitoring & Input Booking Service m-Toyota, Progres DO, DEC, FS 1.000 KM, dan Servis Berkala T-Care">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#d7123a">

    <style>
        :root {
            --mtoyota-red: #d7123a;
            --mtoyota-dark: #0d1b3e;
            --mtoyota-navy: #16305f;
            --mtoyota-blue: #2563eb;
            --mtoyota-teal: #0d9488;
            --mtoyota-emerald: #10b981;
            --mtoyota-amber: #f59e0b;
            --mtoyota-border: #e2e8f0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: #f4f6fa;
            color: #0f172a;
        }

        .mtoyota-hero {
            background: linear-gradient(135deg, #d7123a 0%, #880924 45%, #0d1b3e 100%);
            border-radius: 20px;
            padding: 24px;
            color: #ffffff;
            margin-bottom: 22px;
            box-shadow: 0 12px 30px rgba(215, 18, 58, 0.22);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .mtoyota-hero::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 170px;
            height: 170px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.22) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .badge-mtoyota {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            padding: 5px 14px;
            border-radius: 20px;
            font-size: 11.5px;
            font-weight: 800;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.35);
            margin-bottom: 10px;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        /* KPI Stats Grid */
        .kpi-mtoyota-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
            margin-bottom: 22px;
        }

        @media (max-width: 820px) {
            .kpi-mtoyota-grid {
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
        }

        .kpi-mtoyota-card {
            background: #ffffff;
            border-radius: 16px;
            padding: 16px 18px;
            border: 1px solid var(--mtoyota-border);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.04);
            display: flex;
            align-items: center;
            gap: 14px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .kpi-mtoyota-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 22px rgba(15, 23, 42, 0.08);
        }

        .kpi-icon-wrap {
            width: 44px;
            height: 44px;
            border-radius: 13px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }

        .kpi-icon-wrap.red { background: #ffe4e6; color: #d7123a; }
        .kpi-icon-wrap.blue { background: #dbeafe; color: #2563eb; }
        .kpi-icon-wrap.emerald { background: #d1fae5; color: #059669; }
        .kpi-icon-wrap.amber { background: #fef3c7; color: #d97706; }

        .kpi-val {
            font-family: 'Outfit', sans-serif;
            font-size: 24px;
            font-weight: 800;
            line-height: 1;
            color: #0f172a;
        }

        .kpi-lbl {
            font-size: 11.5px;
            color: #64748b;
            font-weight: 600;
            margin-top: 3px;
        }

        /* Filter & Controls */
        .controls-panel {
            background: #ffffff;
            border-radius: 16px;
            padding: 14px 18px;
            border: 1px solid var(--mtoyota-border);
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
            flex-wrap: wrap;
        }

        .tab-filter-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .tab-btn {
            background: #f1f5f9;
            border: 1px solid #e2e8f0;
            color: #475569;
            padding: 8px 14px;
            border-radius: 10px;
            font-size: 12.5px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .tab-btn:hover {
            background: #e2e8f0;
            color: #0f172a;
        }

        .tab-btn.active {
            background: #d7123a;
            border-color: #d7123a;
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(215, 18, 58, 0.25);
        }

        .search-input-wrap {
            position: relative;
            min-width: 240px;
            flex: 1;
            max-width: 340px;
        }

        .search-input-wrap i {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #94a3b8;
            font-size: 13px;
        }

        .search-input-wrap input {
            width: 100%;
            padding: 9px 12px 9px 34px;
            border-radius: 10px;
            border: 1.5px solid #cbd5e1;
            font-size: 13px;
            font-weight: 600;
            outline: none;
            transition: border-color 0.2s;
            background: #f8fafc;
        }

        .search-input-wrap input:focus {
            border-color: #d7123a;
            background: #ffffff;
        }

        .btn-create-booking {
            background: linear-gradient(135deg, #d7123a, #991b1b);
            color: #ffffff;
            border: none;
            padding: 10px 18px;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 800;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 14px rgba(215, 18, 58, 0.25);
            transition: all 0.2s;
        }

        .btn-create-booking:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 18px rgba(215, 18, 58, 0.35);
        }

        /* Customer Booking Cards */
        .booking-cards-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .booking-card {
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid var(--mtoyota-border);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.03);
            padding: 20px;
            transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .booking-card:hover {
            border-color: #cbd5e1;
            box-shadow: 0 8px 24px rgba(15, 23, 42, 0.07);
        }

        .booking-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 14px;
            border-bottom: 1px solid #f1f5f9;
            padding-bottom: 14px;
            margin-bottom: 16px;
            flex-wrap: wrap;
        }

        .customer-info h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .vehicle-badge {
            background: #f1f5f9;
            color: #1e293b;
            font-size: 11.5px;
            font-weight: 700;
            padding: 4px 10px;
            border-radius: 8px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            border: 1px solid #e2e8f0;
        }

        .meta-tags {
            display: flex;
            gap: 12px;
            font-size: 12px;
            color: #64748b;
            margin-top: 6px;
            flex-wrap: wrap;
        }

        .meta-tags span {
            display: inline-flex;
            align-items: center;
            gap: 5px;
        }

        .progress-meter {
            text-align: right;
            min-width: 140px;
        }

        .progress-bar-outer {
            width: 140px;
            height: 9px;
            background: #e2e8f0;
            border-radius: 6px;
            overflow: hidden;
            margin-top: 5px;
        }

        .progress-bar-inner {
            height: 100%;
            background: linear-gradient(90deg, #d7123a, #10b981);
            border-radius: 6px;
            transition: width 0.4s ease;
        }

        /* 5-Step Visual Funnel Tracker */
        .funnel-stepper {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin-bottom: 16px;
        }

        @media (max-width: 900px) {
            .funnel-stepper {
                grid-template-columns: 1fr;
                gap: 8px;
            }
        }

        .step-box {
            background: #f8fafc;
            border: 1.5px solid #e2e8f0;
            border-radius: 14px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            position: relative;
            transition: all 0.2s ease;
        }

        .step-box.completed {
            background: #f0fdf4;
            border-color: #86efac;
        }

        .step-box.booked {
            background: #eff6ff;
            border-color: #93c5fd;
        }

        .step-box.pending {
            background: #fafafa;
            border-color: #e2e8f0;
            opacity: 0.85;
        }

        .step-head {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
        }

        .step-title {
            font-size: 12px;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .step-badge {
            font-size: 10px;
            font-weight: 800;
            padding: 2px 7px;
            border-radius: 6px;
            text-transform: uppercase;
        }

        .step-badge.completed { background: #dcfce7; color: #15803d; }
        .step-badge.booked { background: #dbeafe; color: #1d4ed8; }
        .step-badge.pending { background: #f1f5f9; color: #64748b; }

        .step-desc {
            font-size: 11.5px;
            color: #475569;
            line-height: 1.4;
            margin-bottom: 8px;
        }

        .step-thumb {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 6px;
            padding-top: 6px;
            border-top: 1px dashed rgba(0, 0, 0, 0.08);
            font-size: 11px;
            color: #0284c7;
            font-weight: 700;
            cursor: pointer;
        }

        .step-thumb img {
            width: 26px;
            height: 26px;
            border-radius: 6px;
            object-fit: cover;
            border: 1px solid #cbd5e1;
        }

        /* Card Actions */
        .card-actions-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-top: 14px;
            border-top: 1px solid #f1f5f9;
            flex-wrap: wrap;
            gap: 10px;
        }

        .btn-action-group {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }

        .btn-act {
            padding: 8px 14px;
            border-radius: 9px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            border: none;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: all 0.2s;
        }

        .btn-act.btn-update {
            background: #0d1b3e;
            color: #ffffff;
        }

        .btn-act.btn-update:hover {
            background: #1e3a8a;
        }

        .btn-act.btn-wa {
            background: #25d366;
            color: #ffffff;
        }

        .btn-act.btn-wa:hover {
            background: #1eb857;
        }

        .btn-act.btn-del {
            background: #fee2e2;
            color: #b91c1c;
        }

        .btn-act.btn-del:hover {
            background: #fca5a5;
        }

        /* Modal Styles */
        .modal-overlay-custom {
            position: fixed;
            inset: 0;
            background: rgba(13, 27, 62, 0.6);
            backdrop-filter: blur(4px);
            z-index: 99999;
            display: none;
            align-items: center;
            justify-content: center;
            padding: 16px;
        }

        .modal-content-custom {
            background: #ffffff;
            border-radius: 20px;
            max-width: 580px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 24px;
            position: relative;
        }

        .modal-header-custom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-bottom: 14px;
            border-bottom: 1px solid #e2e8f0;
            margin-bottom: 18px;
        }

        .modal-header-custom h3 {
            margin: 0;
            font-size: 17px;
            font-weight: 800;
            color: #0f172a;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .btn-close-modal {
            background: #f1f5f9;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
            color: #64748b;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .form-row-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        @media (max-width: 600px) {
            .form-row-2 { grid-template-columns: 1fr; }
        }

        .custom-form-group {
            margin-bottom: 14px;
        }

        .custom-form-group label {
            display: block;
            font-size: 12px;
            font-weight: 700;
            color: #334155;
            margin-bottom: 6px;
        }

        .custom-form-control {
            width: 100%;
            padding: 10px 12px;
            border-radius: 10px;
            border: 1.5px solid #cbd5e1;
            font-size: 13px;
            font-weight: 600;
            background: #f8fafc;
            outline: none;
            transition: all 0.2s;
        }

        .custom-form-control:focus {
            border-color: #d7123a;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(215, 18, 58, 0.1);
        }

        .file-upload-box {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 16px;
            text-align: center;
            background: #f8fafc;
            cursor: pointer;
            transition: all 0.2s;
        }

        .file-upload-box:hover {
            border-color: #d7123a;
            background: #fff5f7;
        }

        .empty-state {
            background: #ffffff;
            border-radius: 18px;
            padding: 40px 20px;
            text-align: center;
            border: 1px dashed #cbd5e1;
            color: #64748b;
        }

        .empty-state i {
            font-size: 42px;
            color: #cbd5e1;
            margin-bottom: 12px;
        }
    </style>
</head>

<body>
    <div class="mobile-app">
        <!-- Header Halaman -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Booking Service m-Toyota</h2>
        </header>

        <div class="container" style="margin-top: 0; padding-bottom: 50px;">

            <!-- Hero Banner -->
            <div class="mtoyota-hero">
                <div class="badge-mtoyota">
                    <i class="fa-solid fa-mobile-screen-button"></i> Tunas Toyota Aftersales Hub
                </div>
                <h3 style="margin:0 0 6px 0; font-size: 20px; font-weight:900;">
                    Booking Service m-Toyota &amp; Funnel Onboarding
                </h3>
                <p style="margin:0; font-size:12.5px; opacity:0.94; line-height:1.5; max-width: 680px;">
                    Pantau dan input progres aktivasi m-Toyota konsumen, mulai dari serah terima DO, penjelasan DEC digital, hingga jadwal booking servis berkala T-Care 1.000 KM s/d 20.000 KM beserta unggah foto dokumentasinya.
                </p>
            </div>

            <!-- 4 Executive KPI Cards -->
            <div class="kpi-mtoyota-grid">
                <div class="kpi-mtoyota-card">
                    <div class="kpi-icon-wrap red">
                        <i class="fa-solid fa-car"></i>
                    </div>
                    <div>
                        <div class="kpi-val" id="kpiTotalUnit">0</div>
                        <div class="kpi-lbl">Total Unit Terdaftar</div>
                    </div>
                </div>

                <div class="kpi-mtoyota-card">
                    <div class="kpi-icon-wrap blue">
                        <i class="fa-solid fa-truck-ramp-box"></i>
                    </div>
                    <div>
                        <div class="kpi-val" id="kpiDoDone">0</div>
                        <div class="kpi-lbl">DO &amp; App Aktif</div>
                    </div>
                </div>

                <div class="kpi-mtoyota-card">
                    <div class="kpi-icon-wrap amber">
                        <i class="fa-solid fa-certificate"></i>
                    </div>
                    <div>
                        <div class="kpi-val" id="kpiDecDone">0</div>
                        <div class="kpi-lbl">DEC Selesai</div>
                    </div>
                </div>

                <div class="kpi-mtoyota-card">
                    <div class="kpi-icon-wrap emerald">
                        <i class="fa-solid fa-screwdriver-wrench"></i>
                    </div>
                    <div>
                        <div class="kpi-val" id="kpiFsDone">0</div>
                        <div class="kpi-lbl">Servis Tuntas</div>
                    </div>
                </div>
            </div>

            <!-- Control Bar (Filter & Search) -->
            <div class="controls-panel">
                <div class="tab-filter-group">
                    <button class="tab-btn active" onclick="setStageFilter('', this)">
                        <i class="fa-solid fa-layer-group"></i> Semua Unit
                    </button>
                    <button class="tab-btn" onclick="setStageFilter('pending_dec', this)">
                        <i class="fa-solid fa-clock"></i> Butuh DEC
                    </button>
                    <button class="tab-btn" onclick="setStageFilter('booked_fs1000', this)">
                        <i class="fa-solid fa-calendar-check"></i> Jadwal FS 1.000
                    </button>
                    <button class="tab-btn" onclick="setStageFilter('completed', this)">
                        <i class="fa-solid fa-circle-check"></i> Selesai 100%
                    </button>
                </div>

                <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                    <div class="search-input-wrap">
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <input type="text" id="inputSearch" placeholder="Cari nama / plat / mobil..." oninput="debounceSearch()">
                    </div>
                    <button class="btn-create-booking" onclick="openCreateModal()">
                        <i class="fa-solid fa-plus"></i> Input Baru
                    </button>
                </div>
            </div>

            <!-- Daftar Unit Booking Cards Container -->
            <div id="bookingListContainer" class="booking-cards-list">
                <div class="empty-state">
                    <i class="fa-solid fa-spinner fa-spin"></i>
                    <p style="font-weight:700; margin:0;">Memuat data booking service m-Toyota...</p>
                </div>
            </div>

        </div>
    </div>

    <!-- ================= MODAL 1: INPUT DATA BOOKING BARU ================= -->
    <div class="modal-overlay-custom" id="modalCreate">
        <div class="modal-content-custom">
            <div class="modal-header-custom">
                <h3><i class="fa-solid fa-car-side" style="color:#d7123a;"></i> Input Data Serah Terima &amp; m-Toyota</h3>
                <button class="btn-close-modal" onclick="closeModal('modalCreate')">&times;</button>
            </div>

            <form id="formCreateBooking" onsubmit="submitCreateBooking(event)">
                <!-- Autocomplete hint dari data SPK -->
                <div class="custom-form-group">
                    <label>Pilih Cepat dari Data SPK / Customer (Opsional):</label>
                    <select id="quickSelectCustomer" class="custom-form-control" onchange="fillFromCustomerSelect(this.value)">
                        <option value="">-- Ketik manual atau pilih customer SPK --</option>
                    </select>
                </div>

                <div class="form-row-2">
                    <div class="custom-form-group">
                        <label>Nama Customer <span style="color:#e11d48">*</span></label>
                        <input type="text" id="newCustomerName" class="custom-form-control" placeholder="Contoh: Bpk. Budi Santoso" required>
                    </div>
                    <div class="custom-form-group">
                        <label>No. WhatsApp / HP <span style="color:#e11d48">*</span></label>
                        <input type="tel" id="newCustomerPhone" class="custom-form-control" placeholder="Contoh: 08122334455" required>
                    </div>
                </div>

                <div class="custom-form-group">
                    <label>Model Unit Toyota <span style="color:#e11d48">*</span></label>
                    <input type="text" id="newModelKendaraan" class="custom-form-control" placeholder="Contoh: Kijang Innova Zenix 2.0 V Hybrid" required>
                </div>

                <div class="form-row-2">
                    <div class="custom-form-group">
                        <label>No. Polisi (Plat)</label>
                        <input type="text" id="newNoPolisi" class="custom-form-control" placeholder="Contoh: D 1234 ABC">
                    </div>
                    <div class="custom-form-group">
                        <label>No. Rangka (VIN)</label>
                        <input type="text" id="newNoRangka" class="custom-form-control" placeholder="MHK123...">
                    </div>
                </div>

                <div class="form-row-2">
                    <div class="custom-form-group">
                        <label>Tanggal DO (Serah Terima)</label>
                        <input type="date" id="newTanggalDo" class="custom-form-control">
                    </div>
                    <div class="custom-form-group">
                        <label>Email Customer</label>
                        <input type="email" id="newCustomerEmail" class="custom-form-control" placeholder="customer@gmail.com">
                    </div>
                </div>

                <div class="custom-form-group">
                    <label>Unggah Foto DO / Aktivasi m-Toyota:</label>
                    <div class="file-upload-box" onclick="document.getElementById('fileFotoDo').click()">
                        <i class="fa-solid fa-cloud-arrow-up" style="font-size:24px; color:#d7123a; margin-bottom:6px;"></i>
                        <div style="font-size:12px; font-weight:700;" id="fileFotoDoLabel">Klik untuk pilih foto bukti serah terima / m-Toyota</div>
                        <div style="font-size:11px; color:#94a3b8;">Format JPG, PNG, WEBP (Max 5MB)</div>
                    </div>
                    <input type="file" id="fileFotoDo" accept="image/*" style="display:none;" onchange="updateFileLabel(this, 'fileFotoDoLabel')">
                </div>

                <div class="custom-form-group">
                    <label>Catatan DO &amp; Penyerahan:</label>
                    <textarea id="newCatatanDo" class="custom-form-control" rows="2" placeholder="Catatan aktivasi m-Toyota, T-Intouch, serah terima kunci cadangan, dll."></textarea>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button type="button" class="tab-btn" onclick="closeModal('modalCreate')">Batal</button>
                    <button type="submit" class="btn-create-booking" id="btnSubmitCreate">
                        <i class="fa-solid fa-save"></i> Simpan Data Onboarding
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ================= MODAL 2: UPDATE PROGRES & UPLOAD FOTO ================= -->
    <div class="modal-overlay-custom" id="modalUpdate">
        <div class="modal-content-custom">
            <div class="modal-header-custom">
                <h3><i class="fa-solid fa-upload" style="color:#2563eb;"></i> Update Progres &amp; Upload Bukti</h3>
                <button class="btn-close-modal" onclick="closeModal('modalUpdate')">&times;</button>
            </div>

            <form id="formUpdateProgress" onsubmit="submitUpdateProgress(event)">
                <input type="hidden" id="updateRecordId" value="0">

                <div style="background:#f1f5f9; padding:12px 14px; border-radius:12px; margin-bottom:16px;">
                    <div style="font-size:11px; font-weight:800; color:#64748b; text-transform:uppercase;">Customer:</div>
                    <div style="font-size:15px; font-weight:800; color:#0f172a;" id="updateCustomerName">-</div>
                    <div style="font-size:12px; color:#475569;" id="updateVehicleModel">-</div>
                </div>

                <div class="custom-form-group">
                    <label>Pilih Tahapan yang Ingin Diperbarui: <span style="color:#e11d48">*</span></label>
                    <select id="updateMilestone" class="custom-form-control" onchange="toggleMilestoneFields(this.value)">
                        <option value="do">Tahap 1: DO &amp; Aktivasi m-Toyota</option>
                        <option value="dec">Tahap 2: DEC (Delivery Explanation Certificate)</option>
                        <option value="fs1000" selected>Tahap 3: FS 1.000 KM (Servis Gratis ke-1)</option>
                        <option value="sb10k">Tahap 4: Servis Berkala 10.000 KM (6 Bulan)</option>
                        <option value="sb20k">Tahap 5: Servis Berkala 20.000 KM (12 Bulan / 1 Tahun)</option>
                    </select>
                </div>

                <div class="form-row-2">
                    <div class="custom-form-group">
                        <label>Status Tahapan: <span style="color:#e11d48">*</span></label>
                        <select id="updateStatus" class="custom-form-control">
                            <option value="booked">📅 Terjadwal (Booked di m-Toyota)</option>
                            <option value="completed" selected>✅ Selesai Dikerjakan (Completed)</option>
                            <option value="pending">⏳ Menunggu / Pending</option>
                        </select>
                    </div>
                    <div class="custom-form-group" id="groupTanggalBooking">
                        <label>Tanggal Booking / Pengerjaan:</label>
                        <input type="date" id="updateTanggalBooking" class="custom-form-control">
                    </div>
                </div>

                <div class="custom-form-group">
                    <label>Unggah Foto Bukti Progres (m-Toyota / Kwitansi / DEC / PKB):</label>
                    <div class="file-upload-box" onclick="document.getElementById('fileUpdateFoto').click()">
                        <i class="fa-solid fa-camera" style="font-size:24px; color:#2563eb; margin-bottom:6px;"></i>
                        <div style="font-size:12px; font-weight:700;" id="fileUpdateFotoLabel">Klik untuk unggah screenshot m-Toyota / sertifikat</div>
                        <div style="font-size:11px; color:#94a3b8;">Format foto JPG, PNG, WEBP (Max 5MB)</div>
                    </div>
                    <input type="file" id="fileUpdateFoto" accept="image/*" style="display:none;" onchange="updateFileLabel(this, 'fileUpdateFotoLabel')">
                </div>

                <div class="custom-form-group">
                    <label>Catatan Tambahan:</label>
                    <textarea id="updateCatatan" class="custom-form-control" rows="2" placeholder="Contoh: Booking m-Toyota disetujui untuk servis tgl 25 Sep jam 10.00"></textarea>
                </div>

                <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:16px;">
                    <button type="button" class="tab-btn" onclick="closeModal('modalUpdate')">Batal</button>
                    <button type="submit" class="btn-act btn-update" id="btnSubmitUpdate">
                        <i class="fa-solid fa-check"></i> Simpan Progres
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- ================= MODAL 3: PREVIEW FOTO DOKUMENTASI ================= -->
    <div class="modal-overlay-custom" id="modalPhotoView" onclick="closeModal('modalPhotoView')">
        <div style="max-width:600px; width:90%; text-align:center; position:relative;" onclick="event.stopPropagation()">
            <img id="photoViewImg" src="" alt="Bukti Foto" style="max-width:100%; max-height:80vh; border-radius:16px; box-shadow:0 20px 40px rgba(0,0,0,0.5); border:3px solid #ffffff;">
            <div style="color:#ffffff; font-weight:700; margin-top:10px; font-size:14px;" id="photoViewCaption">Bukti Dokumentasi</div>
            <button onclick="closeModal('modalPhotoView')" style="margin-top:12px; background:rgba(255,255,255,0.25); color:#fff; border:1px solid #fff; padding:6px 18px; border-radius:20px; font-weight:700; cursor:pointer;">
                <i class="fa-solid fa-xmark"></i> Tutup
            </button>
        </div>
    </div>

    <!-- Script Aplikasi -->
    <script src="../custom_alert.js"></script>
    <script>
        let currentStageFilter = '';
        let listBookings = [];
        let searchTimeout = null;

        // Inisialisasi awal
        document.addEventListener('DOMContentLoaded', () => {
            loadStats();
            loadBookings();
            loadCustomerOptions();
        });

        function getSalesId() {
            const rawId = localStorage.getItem('idSales') || localStorage.getItem('userId');
            return rawId ? parseInt(rawId) : 0;
        }

        function getSalesSpv() {
            return localStorage.getItem('spvSales') || localStorage.getItem('namaSpv') || '';
        }

        function getSalesName() {
            return localStorage.getItem('namaSales') || 'Sales Consultant';
        }

        // 1. Load Statistik KPI
        async function loadStats() {
            try {
                const salesId = getSalesId();
                const res = await fetch(`../api/api_mtoyota_service.php?action=stats&sales_id=${salesId}`);
                const json = await res.json();
                if (json.status === 'success') {
                    const s = json.stats;
                    document.getElementById('kpiTotalUnit').textContent = s.total_unit || 0;
                    document.getElementById('kpiDoDone').textContent = s.total_do_selesai || 0;
                    document.getElementById('kpiDecDone').textContent = s.total_dec_selesai || 0;
                    document.getElementById('kpiFsDone').textContent = (s.total_fs1000_selesai + s.total_sb_selesai) || 0;
                }
            } catch (e) {
                console.error('Error load stats:', e);
            }
        }

        // 2. Load Daftar Booking
        async function loadBookings() {
            const container = document.getElementById('bookingListContainer');
            const q = (document.getElementById('inputSearch')?.value || '').trim();
            const salesId = getSalesId();

            try {
                let url = `../api/api_mtoyota_service.php?sales_id=${salesId}&stage=${encodeURIComponent(currentStageFilter)}&q=${encodeURIComponent(q)}`;
                const res = await fetch(url);
                const json = await res.json();

                if (json.status === 'success') {
                    listBookings = json.data || [];
                    renderBookings(listBookings);
                } else {
                    container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation" style="color:#e11d48;"></i><p>${json.message || 'Gagal memuat data.'}</p></div>`;
                }
            } catch (e) {
                console.error(e);
                container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-triangle-exclamation" style="color:#e11d48;"></i><p>Gagal terhubung ke API service.</p></div>`;
            }
        }

        function debounceSearch() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadBookings();
            }, 300);
        }

        function setStageFilter(stage, btn) {
            currentStageFilter = stage;
            document.querySelectorAll('.tab-filter-group .tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            loadBookings();
        }

        // 3. Render Card Booking Service
        function renderBookings(items) {
            const container = document.getElementById('bookingListContainer');
            if (!items || items.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fa-solid fa-car-tunnel"></i>
                        <h4 style="margin:0 0 6px 0; font-size:16px; font-weight:800; color:#1e293b;">Belum Ada Data Booking Service</h4>
                        <p style="margin:0; font-size:12.5px;">Klik tombol <strong>+ Input Baru</strong> di atas untuk mendaftarkan serah terima dan progres servis m-Toyota konsumen Anda.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = items.map(item => {
                const progress = item.overall_progress || 20;

                // Status helpers
                const doClass = item.status_do === 'completed' ? 'completed' : 'pending';
                const decClass = item.status_dec === 'completed' ? 'completed' : 'pending';
                const fsClass = item.status_fs1000 === 'completed' ? 'completed' : (item.status_fs1000 === 'booked' ? 'booked' : 'pending');
                const sb10kClass = item.status_sb10k === 'completed' ? 'completed' : (item.status_sb10k === 'booked' ? 'booked' : 'pending');
                const sb20kClass = item.status_sb20k === 'completed' ? 'completed' : (item.status_sb20k === 'booked' ? 'booked' : 'pending');

                return `
                <div class="booking-card" id="cardBooking_${item.id}">
                    <div class="booking-header">
                        <div class="customer-info">
                            <h4>
                                <i class="fa-solid fa-user-check" style="color:#d7123a; font-size:15px;"></i> ${escapeHtml(item.customer_name)}
                                <span class="vehicle-badge"><i class="fa-solid fa-car"></i> ${escapeHtml(item.model_kendaraan)}</span>
                            </h4>
                            <div class="meta-tags">
                                <span><i class="fa-brands fa-whatsapp" style="color:#10b981;"></i> ${escapeHtml(item.customer_phone)}</span>
                                ${item.no_polisi ? `<span><i class="fa-solid fa-id-card-clip"></i> ${escapeHtml(item.no_polisi)}</span>` : ''}
                                ${item.no_rangka ? `<span><i class="fa-solid fa-barcode"></i> ${escapeHtml(item.no_rangka)}</span>` : ''}
                                <span><i class="fa-solid fa-calendar-day"></i> DO: ${item.tanggal_do ? item.tanggal_do : '-'}</span>
                            </div>
                        </div>

                        <div class="progress-meter">
                            <div style="font-size:12px; font-weight:800; color:#0f172a;">Progress Onboarding: <span style="color:#d7123a;">${progress}%</span></div>
                            <div class="progress-bar-outer">
                                <div class="progress-bar-inner" style="width: ${progress}%;"></div>
                            </div>
                        </div>
                    </div>

                    <!-- 5-Step Visual Funnel Tracker -->
                    <div class="funnel-stepper">
                        <!-- Step 1: DO & m-Toyota -->
                        <div class="step-box ${doClass}">
                            <div>
                                <div class="step-head">
                                    <span class="step-title"><i class="fa-solid fa-truck"></i> 1. DO &amp; App</span>
                                    <span class="step-badge ${doClass}">${item.status_do === 'completed' ? 'Selesai' : 'Pending'}</span>
                                </div>
                                <div class="step-desc">${item.catatan_do || 'Aktivasi m-Toyota'}</div>
                            </div>
                            ${item.foto_do ? `
                                <div class="step-thumb" onclick="openPhotoPreview('${escapeHtml(item.foto_do)}', 'Bukti Serah Terima DO / m-Toyota')">
                                    <img src="${escapeHtml(item.foto_do)}" onerror="this.src='https://ui-avatars.com/api/?name=DO&background=ffe4e6&color=d7123a';">
                                    <span>Lihat Foto DO</span>
                                </div>
                            ` : '<div style="font-size:10.5px; color:#94a3b8; font-style:italic;">Belum ada foto</div>'}
                        </div>

                        <!-- Step 2: DEC -->
                        <div class="step-box ${decClass}">
                            <div>
                                <div class="step-head">
                                    <span class="step-title"><i class="fa-solid fa-award"></i> 2. DEC</span>
                                    <span class="step-badge ${decClass}">${item.status_dec === 'completed' ? 'Selesai' : 'Pending'}</span>
                                </div>
                                <div class="step-desc">${item.catatan_dec || 'Penjelasan garansi & servis'}</div>
                            </div>
                            ${item.foto_dec ? `
                                <div class="step-thumb" onclick="openPhotoPreview('${escapeHtml(item.foto_dec)}', 'Bukti Dokumen DEC')">
                                    <img src="${escapeHtml(item.foto_dec)}" onerror="this.src='https://ui-avatars.com/api/?name=DEC&background=dbeafe&color=2563eb';">
                                    <span>Lihat Foto DEC</span>
                                </div>
                            ` : '<div style="font-size:10.5px; color:#94a3b8; font-style:italic;">Belum ada foto</div>'}
                        </div>

                        <!-- Step 3: FS 1.000 KM -->
                        <div class="step-box ${fsClass}">
                            <div>
                                <div class="step-head">
                                    <span class="step-title"><i class="fa-solid fa-wrench"></i> 3. FS 1000 KM</span>
                                    <span class="step-badge ${fsClass}">
                                        ${item.status_fs1000 === 'completed' ? 'Selesai' : (item.status_fs1000 === 'booked' ? 'Terjadwal' : 'Pending')}
                                    </span>
                                </div>
                                <div class="step-desc">
                                    ${item.tanggal_booking_fs1000 ? '📅 Tgl: ' + item.tanggal_booking_fs1000 : (item.catatan_fs1000 || 'Servis 1 Bulan / 1.000 KM')}
                                </div>
                            </div>
                            ${item.foto_fs1000 ? `
                                <div class="step-thumb" onclick="openPhotoPreview('${escapeHtml(item.foto_fs1000)}', 'Bukti Booking/Servis FS 1.000 KM')">
                                    <img src="${escapeHtml(item.foto_fs1000)}" onerror="this.src='https://ui-avatars.com/api/?name=FS&background=d1fae5&color=059669';">
                                    <span>Bukti Servis</span>
                                </div>
                            ` : '<div style="font-size:10.5px; color:#94a3b8; font-style:italic;">Belum ada foto</div>'}
                        </div>

                        <!-- Step 4: Servis 10.000 KM -->
                        <div class="step-box ${sb10kClass}">
                            <div>
                                <div class="step-head">
                                    <span class="step-title"><i class="fa-solid fa-oil-can"></i> 4. SB 10K (6 Bln)</span>
                                    <span class="step-badge ${sb10kClass}">
                                        ${item.status_sb10k === 'completed' ? 'Selesai' : (item.status_sb10k === 'booked' ? 'Terjadwal' : 'Pending')}
                                    </span>
                                </div>
                                <div class="step-desc">
                                    ${item.tanggal_booking_sb10k ? '📅 Tgl: ' + item.tanggal_booking_sb10k : (item.catatan_sb10k || 'Servis berkala 6 bulan')}
                                </div>
                            </div>
                            ${item.foto_sb10k ? `
                                <div class="step-thumb" onclick="openPhotoPreview('${escapeHtml(item.foto_sb10k)}', 'Bukti Servis 10.000 KM')">
                                    <img src="${escapeHtml(item.foto_sb10k)}" onerror="this.src='https://ui-avatars.com/api/?name=10K&background=fef3c7&color=d97706';">
                                    <span>Bukti Servis</span>
                                </div>
                            ` : '<div style="font-size:10.5px; color:#94a3b8; font-style:italic;">Belum ada foto</div>'}
                        </div>

                        <!-- Step 5: Servis 20.000 KM -->
                        <div class="step-box ${sb20kClass}">
                            <div>
                                <div class="step-head">
                                    <span class="step-title"><i class="fa-solid fa-gauge-high"></i> 5. SB 20K (1 Thn)</span>
                                    <span class="step-badge ${sb20kClass}">
                                        ${item.status_sb20k === 'completed' ? 'Selesai' : (item.status_sb20k === 'booked' ? 'Terjadwal' : 'Pending')}
                                    </span>
                                </div>
                                <div class="step-desc">
                                    ${item.tanggal_booking_sb20k ? '📅 Tgl: ' + item.tanggal_booking_sb20k : (item.catatan_sb20k || 'Servis berkala 1 tahun')}
                                </div>
                            </div>
                            ${item.foto_sb20k ? `
                                <div class="step-thumb" onclick="openPhotoPreview('${escapeHtml(item.foto_sb20k)}', 'Bukti Servis 20.000 KM')">
                                    <img src="${escapeHtml(item.foto_sb20k)}" onerror="this.src='https://ui-avatars.com/api/?name=20K&background=e0e7ff&color=4338ca';">
                                    <span>Bukti Servis</span>
                                </div>
                            ` : '<div style="font-size:10.5px; color:#94a3b8; font-style:italic;">Belum ada foto</div>'}
                        </div>
                    </div>

                    <!-- Card Action Row -->
                    <div class="card-actions-row">
                        <div style="font-size:12px; color:#64748b;">
                            Sales: <strong>${escapeHtml(item.sales_name || 'Sales Consultant')}</strong> &middot; SPV: <strong>${escapeHtml(item.sales_spv || '-')}</strong>
                        </div>
                        <div class="btn-action-group">
                            <button class="btn-act btn-update" onclick="openUpdateModal(${item.id})">
                                <i class="fa-solid fa-pen-to-square"></i> Update Progres &amp; Foto
                            </button>
                            <button class="btn-act btn-wa" onclick="sendWhatsAppReminder(${item.id})">
                                <i class="fa-brands fa-whatsapp"></i> Ingatkan Servis WA
                            </button>
                            <button class="btn-act btn-del" onclick="deleteBookingRecord(${item.id})" title="Hapus Data">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');
        }

        // 4. Autocomplete Customer dari SPK
        async function loadCustomerOptions() {
            try {
                const salesId = getSalesId();
                const res = await fetch(`../api/api_mtoyota_service.php?action=customers&sales_id=${salesId}`);
                const json = await res.json();
                if (json.status === 'success' && Array.isArray(json.data)) {
                    const sel = document.getElementById('quickSelectCustomer');
                    if (sel) {
                        json.data.forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = JSON.stringify(c);
                            opt.textContent = `${c.name} - ${c.model} (${c.phone})`;
                            sel.appendChild(opt);
                        });
                    }
                }
            } catch(e) {}
        }

        function fillFromCustomerSelect(val) {
            if (!val) return;
            try {
                const c = JSON.parse(val);
                document.getElementById('newCustomerName').value = c.name || '';
                document.getElementById('newCustomerPhone').value = c.phone || '';
                document.getElementById('newModelKendaraan').value = c.model || '';
                if (c.chassis) document.getElementById('newNoRangka').value = c.chassis;
                if (c.plate) document.getElementById('newNoPolisi').value = c.plate;
            } catch(e) {}
        }

        // 5. Modal Handling
        function openCreateModal() {
            document.getElementById('formCreateBooking').reset();
            document.getElementById('newTanggalDo').value = new Date().toISOString().split('T')[0];
            document.getElementById('fileFotoDoLabel').textContent = 'Klik untuk pilih foto bukti serah terima / m-Toyota';
            document.getElementById('modalCreate').style.display = 'flex';
        }

        function openUpdateModal(id) {
            const item = listBookings.find(b => b.id == id);
            if (!item) return;

            document.getElementById('updateRecordId').value = item.id;
            document.getElementById('updateCustomerName').textContent = item.customer_name;
            document.getElementById('updateVehicleModel').textContent = item.model_kendaraan + (item.no_polisi ? ` (${item.no_polisi})` : '');
            document.getElementById('fileUpdateFotoLabel').textContent = 'Klik untuk unggah screenshot m-Toyota / sertifikat';
            document.getElementById('formUpdateProgress').reset();
            document.getElementById('updateRecordId').value = item.id;

            // Default ke milestone berikutnya yang belum selesai
            if (item.status_dec !== 'completed') {
                document.getElementById('updateMilestone').value = 'dec';
            } else if (item.status_fs1000 !== 'completed') {
                document.getElementById('updateMilestone').value = 'fs1000';
            } else if (item.status_sb10k !== 'completed') {
                document.getElementById('updateMilestone').value = 'sb10k';
            } else {
                document.getElementById('updateMilestone').value = 'sb20k';
            }
            toggleMilestoneFields(document.getElementById('updateMilestone').value);

            document.getElementById('modalUpdate').style.display = 'flex';
        }

        function toggleMilestoneFields(milestone) {
            const grp = document.getElementById('groupTanggalBooking');
            if (milestone === 'fs1000' || milestone === 'sb10k' || milestone === 'sb20k') {
                grp.style.display = 'block';
            } else {
                grp.style.display = 'none';
            }
        }

        function closeModal(modalId) {
            document.getElementById(modalId).style.display = 'none';
        }

        function updateFileLabel(input, labelId) {
            if (input.files && input.files[0]) {
                document.getElementById(labelId).textContent = 'File dipilih: ' + input.files[0].name;
            }
        }

        function openPhotoPreview(url, caption) {
            document.getElementById('photoViewImg').src = url;
            document.getElementById('photoViewCaption').textContent = caption || 'Bukti Dokumentasi';
            document.getElementById('modalPhotoView').style.display = 'flex';
        }

        // 6. Submit Create Booking
        async function submitCreateBooking(e) {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitCreate');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

            const formData = new FormData();
            formData.append('action', 'create');
            formData.append('sales_account_id', getSalesId());
            formData.append('sales_name', getSalesName());
            formData.append('sales_spv', getSalesSpv());
            formData.append('customer_name', document.getElementById('newCustomerName').value);
            formData.append('customer_phone', document.getElementById('newCustomerPhone').value);
            formData.append('customer_email', document.getElementById('newCustomerEmail').value);
            formData.append('model_kendaraan', document.getElementById('newModelKendaraan').value);
            formData.append('no_polisi', document.getElementById('newNoPolisi').value);
            formData.append('no_rangka', document.getElementById('newNoRangka').value);
            formData.append('tanggal_do', document.getElementById('newTanggalDo').value);
            formData.append('catatan_do', document.getElementById('newCatatanDo').value);

            const fileDo = document.getElementById('fileFotoDo').files[0];
            if (fileDo) formData.append('foto_do', fileDo);

            try {
                const res = await fetch('../api/api_mtoyota_service.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json();
                if (json.status === 'success') {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert('Berhasil!', json.message, 'success');
                    } else {
                        alert(json.message);
                    }
                    closeModal('modalCreate');
                    loadStats();
                    loadBookings();
                } else {
                    alert('Gagal: ' + (json.message || 'Terjadi kesalahan'));
                }
            } catch (err) {
                console.error(err);
                alert('Gagal terhubung ke server.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-save"></i> Simpan Data Onboarding';
            }
        }

        // 7. Submit Update Progress
        async function submitUpdateProgress(e) {
            e.preventDefault();
            const btn = document.getElementById('btnSubmitUpdate');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunggah...';

            const formData = new FormData();
            formData.append('action', 'update_progress');
            formData.append('id', document.getElementById('updateRecordId').value);
            formData.append('milestone', document.getElementById('updateMilestone').value);
            formData.append('status', document.getElementById('updateStatus').value);
            formData.append('tanggal_booking', document.getElementById('updateTanggalBooking').value);
            formData.append('catatan', document.getElementById('updateCatatan').value);

            const fileFoto = document.getElementById('fileUpdateFoto').files[0];
            if (fileFoto) formData.append('foto', fileFoto);

            try {
                const res = await fetch('../api/api_mtoyota_service.php', {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json();
                if (json.status === 'success') {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert('Sukses!', json.message, 'success');
                    } else {
                        alert(json.message);
                    }
                    closeModal('modalUpdate');
                    loadStats();
                    loadBookings();
                } else {
                    alert('Gagal: ' + (json.message || 'Terjadi kesalahan'));
                }
            } catch (err) {
                console.error(err);
                alert('Gagal menghubungi server.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Progres';
            }
        }

        // 8. Kirim Pengingat WhatsApp
        function sendWhatsAppReminder(id) {
            const item = listBookings.find(b => b.id == id);
            if (!item) return;

            let phone = (item.customer_phone || '').replace(/[^0-9]/g, '');
            if (phone.startsWith('0')) {
                phone = '62' + phone.substring(1);
            }

            let msg = '';
            const salesName = item.sales_name || getSalesName();

            if (item.status_dec !== 'completed') {
                msg = `Halo Bapak/Ibu *${item.customer_name}*, terima kasih telah memilih Toyota ${item.model_kendaraan}. Mohon konfirmasi jadwal aktivasi m-Toyota & penjelasan Delivery Certificate (DEC) agar garansi T-Care dan servis gratis berkala Anda aktif maksimal. Salam, ${salesName} - Tunas Toyota Kiara Condong.`;
            } else if (item.status_fs1000 !== 'completed') {
                msg = `Halo Bapak/Ibu *${item.customer_name}*, mengingatkan untuk First Service (FS 1.000 KM / 1 Bulan) gratis unit Toyota *${item.model_kendaraan}* Anda. Mohon booking jadwal servisnya melalui aplikasi *m-Toyota* atau infokan kepada kami jika ingin dibantu booking di bengkel resmi Tunas Toyota Kiara Condong. Salam hangat, ${salesName}.`;
            } else if (item.status_sb10k !== 'completed') {
                msg = `Halo Bapak/Ibu *${item.customer_name}*, sudah mendekati waktu Servis Berkala 10.000 KM (6 Bulan) untuk unit *${item.model_kendaraan}* (${item.no_polisi || ''}). Nikmati kemudahan booking servis bebas antre melalui aplikasi *m-Toyota*. Ada yang bisa kami bantu? Salam, ${salesName} - Tunas Toyota.`;
            } else {
                msg = `Halo Bapak/Ibu *${item.customer_name}*, semoga unit Toyota *${item.model_kendaraan}* selalu dalam kondisi prima. Mengingatkan untuk tetap rutin melakukan servis berkala via aplikasi *m-Toyota* di Tunas Toyota Kiara Condong agar performa & nilai jual kembali kendaraan tetap prima. Salam, ${salesName}.`;
            }

            const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
            window.open(waUrl, '_blank');
        }

        // 9. Hapus Data
        async function deleteBookingRecord(id) {
            if (!confirm('Apakah Anda yakin ingin menghapus data booking m-Toyota ini?')) return;

            try {
                const res = await fetch('../api/api_mtoyota_service.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete', id: id })
                });
                const json = await res.json();
                if (json.status === 'success') {
                    loadStats();
                    loadBookings();
                } else {
                    alert('Gagal: ' + json.message);
                }
            } catch(e) {
                alert('Gagal menghapus data.');
            }
        }

        function escapeHtml(str) {
            if (!str) return '';
            return String(str).replace(/[&<>"']/g, m => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            })[m]);
        }
    </script>
</body>

</html>
