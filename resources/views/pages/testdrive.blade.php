<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Integrated Test Drive Center</title>
    <meta name="description" content="Pusat pemesanan unit test drive resmi cabang dan armada rekanan rental Tunas Toyota Kiara Condong">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/testdrive.css">
    <script src="../js/sidebar_desktop.js"></script>

    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">

    <style>
        /* ── SEGMENTED TOP TAB BAR ── */
        .td-tabs-nav {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(12px);
            padding: 6px;
            border-radius: 16px;
            border: 1.5px solid #e2e8f0;
            display: flex;
            gap: 6px;
            margin-bottom: 20px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.04);
            position: sticky;
            top: 65px;
            z-index: 99;
        }

        .td-tab-btn {
            flex: 1;
            padding: 10px 12px;
            border: none;
            background: transparent;
            color: #64748b;
            font-size: 12.5px;
            font-weight: 700;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.25s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            white-space: nowrap;
        }

        .td-tab-btn.active {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%);
            color: #ffffff;
            box-shadow: 0 4px 14px rgba(13, 27, 62, 0.25);
        }

        /* ── RENTAL TEST DRIVE STYLES ── */
        .rental-hero-sub {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 55%, #0f172a 100%);
            color: white;
            padding: 24px 22px;
            border-radius: 20px;
            margin-bottom: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(13, 27, 62, 0.15);
        }

        .partner-card {
            background: white;
            border-radius: 18px;
            border: 1px solid #e2e8f0;
            padding: 18px;
            margin-bottom: 18px;
            box-shadow: 0 4px 16px rgba(15, 23, 42, 0.03);
        }

        .partner-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 14px;
            padding-bottom: 10px;
            border-bottom: 1.5px dashed #e2e8f0;
        }

        .fleet-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 12px;
        }

        .fleet-item {
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 14px;
            padding: 14px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            gap: 10px;
            transition: all 0.2s;
        }

        .fleet-item:hover {
            border-color: #c8102e;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.06);
        }

        .history-card {
            background: white;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            padding: 18px;
            margin-bottom: 14px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.03);
        }

        .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 800;
        }
        .status-badge.disetujui { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
        .status-badge.menunggu { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
        .status-badge.penggunaan { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
    </style>
</head>

<body>
    <div class="mobile-app" style="max-width: 1200px; padding-bottom: 80px;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Integrated Test Drive Center</h2>
        </header>

        <div class="container" style="margin-top: 15px;">

            <!-- ═══ TOP TAB NAVIGATION ═══ -->
            <div class="td-tabs-nav">
                <button type="button" class="td-tab-btn active" id="tabBtnCabang" onclick="switchMainTdTab('cabang')">
                    <i class="fa-solid fa-building-flag"></i> Unit Cabang Dealer
                </button>
                <button type="button" class="td-tab-btn" id="tabBtnRental" onclick="switchMainTdTab('rental')">
                    <i class="fa-solid fa-handshake"></i> Unit Rekanan Rental (TRAC)
                </button>
                <button type="button" class="td-tab-btn" id="tabBtnRiwayat" onclick="switchMainTdTab('riwayat')">
                    <i class="fa-solid fa-clock-rotate-left"></i> Riwayat Pengajuan
                </button>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 1: UNIT INTERNAL DEALER CABANG KIARA CONDONG
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionCabang">
                <!-- Selected unit banner -->
                <div class="selected-banner" id="selectedBanner">
                    <div class="selected-banner-icon"><i class="fa-solid fa-car"></i></div>
                    <div class="selected-banner-text">
                        <p>Unit Dipilih</p>
                        <h4 id="selectedUnitName">—</h4>
                    </div>
                    <button type="button" onclick="openModal()" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.2);color:white;padding:8px 14px;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap;">
                        Ajukan Jadwal <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>

                <!-- Unit cards rendered here -->
                <div id="viewUnits">
                    <div id="unitList">
                        <p style="text-align:center; color:var(--text-muted); font-size:12px; padding:30px;">
                            <i class="fa-solid fa-spinner fa-spin"></i> Memuat unit test drive dealer...
                        </p>
                    </div>
                </div>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 2: UNIT REKANAN RENTAL (TRAC & PARTNER FLEET)
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionRental" style="display:none;">
                <div class="rental-hero-sub">
                    <span style="background:rgba(255,255,255,0.2); color:#93c5fd; font-size:11px; font-weight:800; padding:4px 10px; border-radius:14px; text-transform:uppercase;">
                        <i class="fa-solid fa-handshake"></i> TOYOTA FLEET PARTNERSHIP
                    </span>
                    <h3 style="font-size:20px; font-weight:900; margin:8px 0 4px; color:white;">Armada Ready Rekanan Rental</h3>
                    <p style="font-size:12.5px; color:#cbd5e1; margin:0;">Gunakan armada kemitraan resmi (TRAC Astra / Partner) jika unit test drive cabang sedang terpakai atau varian tertentu tidak tersedia di showroom.</p>
                </div>

                <!-- Partner Fleet Container -->
                <div id="partnerFleetContainer">
                    <p style="text-align:center; padding:30px; color:#64748b; font-size:13px;">
                        <i class="fa-solid fa-spinner fa-spin"></i> Memuat armada rekanan rental...
                    </p>
                </div>

                <!-- Form Permintaan Rental -->
                <div class="card" style="margin-top:20px; padding:22px; border-radius:18px;">
                    <h3 style="font-size:15px; font-weight:800; margin:0 0 16px; color:#0f172a; border-bottom:1.5px solid #f1f5f9; padding-bottom:10px;">
                        <i class="fa-solid fa-file-pen" style="color:#c8102e; margin-right:6px;"></i> Form Permintaan Unit Test Drive Rekanan
                    </h3>

                    <form id="rentalTestDriveForm" onsubmit="submitRentalBooking(event)">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:14px;">
                            <div>
                                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nama Sales Consultant</label>
                                <input type="text" id="salesName" class="form-control" readonly required style="background:#e2e8f0; width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                            </div>
                            <div>
                                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Mitra Rental</label>
                                <select id="selectMitraRental" class="form-control" required onchange="updateModelOptionsByPartner()" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                                    <option value="TRAC Astra Rent a Car (Bandung Branch)">TRAC Astra Rent a Car (Bandung Branch)</option>
                                    <option value="FR Group Braga (Toyota &amp; Premium SUV Fleet)">FR Group Braga (Toyota &amp; Premium SUV Fleet)</option>
                                    <option value="FR Group Luxury &amp; Commercial (All-in Driver + BBM)">FR Group Luxury &amp; Commercial</option>
                                </select>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; margin-bottom:14px;">
                            <div>
                                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Model Mobil Diminta</label>
                                <select id="modelMobilDiminta" class="form-control" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                                    <option value="Innova Zenix Q Hybrid">Innova Zenix Q Hybrid</option>
                                    <option value="Yaris Cross S Hybrid">Yaris Cross S Hybrid</option>
                                    <option value="All New Veloz 1.5 Q">All New Veloz 1.5 Q</option>
                                    <option value="New Fortuner 2.8 GR Sport">New Fortuner 2.8 GR Sport</option>
                                    <option value="Toyota Alphard 2.5 HEV">Toyota Alphard 2.5 HEV</option>
                                </select>
                            </div>
                            <div>
                                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Jadwal Test Drive Rekanan</label>
                                <input type="datetime-local" id="tanggalTestdrive" class="form-control" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                            </div>
                        </div>

                        <div style="margin-bottom:14px;">
                            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nama Calon Konsumen &amp; No. WhatsApp</label>
                            <input type="text" id="customerRentalInfo" class="form-control" placeholder="Contoh: Bpk. Gunawan - 08123456789" required style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                        </div>

                        <div style="margin-bottom:16px;">
                            <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Alasan Penggunaan Unit Rekanan</label>
                            <textarea id="catatanRental" class="form-control" rows="2" placeholder="Contoh: Unit Innova Zenix showroom sedang servis / konsumen request tipe Hybrid ke rumah" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;"></textarea>
                        </div>

                        <button type="submit" class="btn-main" style="width:100%; background:linear-gradient(135deg, #c8102e, #990e24); color:white; padding:12px; border-radius:12px; font-weight:800; border:none; cursor:pointer;">
                            <i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i> Kirim Pengajuan ke SPV &amp; Admin Rental
                        </button>
                    </form>
                </div>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 3: RIWAYAT PENGAJUAN (INTERNAL & RENTAL TERPADU)
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionRiwayat" style="display:none;">
                <div style="margin-bottom: 14px; position:relative;">
                    <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:14px; top:12px; color:var(--text-muted); font-size:13px;"></i>
                    <input type="text" id="searchTd" class="form-control" style="padding-left:36px; font-size:12.5px; border-radius:12px;" placeholder="Cari nama customer / mobil..." onkeyup="filterTdList()">
                </div>

                <!-- Riwayat Internal Dealer -->
                <h4 style="font-size:13px; font-weight:800; color:#475569; text-transform:uppercase; margin:16px 0 8px;">
                    <i class="fa-solid fa-building-flag" style="color:#0284c7;"></i> Riwayat Unit Dealer Cabang
                </h4>
                <div id="tdContainer">
                    <p style="text-align:center; color:var(--text-muted); font-size:12px; padding:20px;">Memuat riwayat...</p>
                </div>

                <!-- Riwayat Unit Rental -->
                <h4 style="font-size:13px; font-weight:800; color:#475569; text-transform:uppercase; margin:24px 0 8px;">
                    <i class="fa-solid fa-handshake" style="color:#c8102e;"></i> Riwayat Unit Rekanan Rental
                </h4>
                <div id="rentalHistoryList">
                    <p style="text-align:center; color:var(--text-muted); font-size:12px; padding:20px;">Memuat riwayat rental...</p>
                </div>
            </div>

        </div>
    </div>

    <!-- Modal Input Internal Test Drive -->
    <div class="modal-overlay" id="inputModal" onclick="if(event.target===this) closeModal()">
        <div class="modal-sheet">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--text-dark); text-transform:uppercase;">Pengajuan Test Drive Cabang</h3>
                <button style="background:none; border:none; font-size:22px; color:var(--text-muted); cursor:pointer;" onclick="closeModal()">&times;</button>
            </div>

            <form id="tdForm" onsubmit="submitTestDrive(event)">
                <div class="form-group" style="display:none;">
                    <input type="hidden" id="inputIdUnit">
                </div>
                <div class="form-group">
                    <label>Nama Customer</label>
                    <input type="text" class="form-control" id="inputCustomer" placeholder="Contoh: Bpk. Budi Santoso" required>
                </div>
                <div class="form-group">
                    <label>Jadwal Test Drive</label>
                    <input type="datetime-local" class="form-control" id="inputJadwal" required>
                </div>
                <div class="form-group">
                    <label>Rencana Rute</label>
                    <textarea class="form-control" id="inputRute" rows="2" placeholder="Contoh: Showroom - Jl. Kiara Condong - Rumah Konsumen" required></textarea>
                </div>

                <div style="display:flex; gap:12px; margin-top:24px;">
                    <button type="button" class="btn-main" style="background:#f1f5f9; color:#475569; margin:0; border:none; flex:1;" onclick="closeModal()">Batal</button>
                    <button type="submit" class="btn-main" style="margin:0; flex:2;" id="submitBtn"><i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Kirim ke SPV</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Image Lightbox Modal -->
    <div class="modal-overlay" id="imageLightbox" onclick="if(event.target===this) document.getElementById('imageLightbox').classList.remove('show')">
        <div style="position:relative; width:95%; max-width:800px; display:flex; justify-content:center; align-items:center;">
            <button class="btn-close-modal" style="position:absolute; top:-40px; right:0; background:rgba(255,255,255,0.2); color:#fff; border:none; border-radius:50%; width:36px; height:36px; display:flex; align-items:center; justify-content:center; cursor:pointer; font-size:18px;" onclick="document.getElementById('imageLightbox').classList.remove('show')">
                <i class="fa-solid fa-xmark"></i>
            </button>
            <img id="lightboxImage" src="" style="width:100%; height:auto; max-height:85vh; object-fit:contain; border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.5);">
        </div>
    </div>

    <!-- Scripts -->
    <script src="../custom_alert.js"></script>
    <script src="../js/testdrive.js"></script>
    <script src="../js/rental_testdrive.js"></script>

    <script>
        function switchMainTdTab(tabId) {
            document.querySelectorAll('.td-tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('sectionCabang').style.display = 'none';
            document.getElementById('sectionRental').style.display = 'none';
            document.getElementById('sectionRiwayat').style.display = 'none';

            if (tabId === 'rental') {
                document.getElementById('tabBtnRental').classList.add('active');
                document.getElementById('sectionRental').style.display = 'block';
                if (typeof fetchRentalData === 'function') fetchRentalData();
            } else if (tabId === 'riwayat') {
                document.getElementById('tabBtnRiwayat').classList.add('active');
                document.getElementById('sectionRiwayat').style.display = 'block';
                if (typeof loadRiwayat === 'function') loadRiwayat();
                if (typeof fetchRentalData === 'function') fetchRentalData();
            } else {
                document.getElementById('tabBtnCabang').classList.add('active');
                document.getElementById('sectionCabang').style.display = 'block';
            }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const reqTab = urlParams.get('tab');
            if (reqTab) {
                switchMainTdTab(reqTab);
            }
        });
    </script>
</body>

</html>
