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
    <link rel="stylesheet" href="../css/testdrive.css?v=20260908_v11">
    <script src="../js/sidebar_desktop.js?v=20260911_polreg_sync"></script>

    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
</head>

<body>
    <div class="mobile-app" style="max-width: 1200px;">
        <!-- ═══ HEADER NAV TOP BAR ═══ -->
        <header class="header-page">
            <a href="../index.html" title="Kembali ke Dashboard"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Test Drive Center</h2>
            <span class="header-pill-badge">
                <i class="fa-solid fa-car-side"></i> Official Fleet
            </span>
        </header>

        <div class="container" style="margin-top: 15px;">

            <!-- ═══ TOP TAB NAVIGATION ═══ -->
            <div class="td-tabs-nav">
                <button type="button" class="td-tab-btn active" id="tabBtnCabang" onclick="switchMainTdTab('cabang')">
                    <i class="fa-solid fa-building-flag"></i>
                    <span class="tab-label-full">Unit Cabang Dealer</span>
                    <span class="tab-label-short">Unit Dealer</span>
                </button>
                <button type="button" class="td-tab-btn" id="tabBtnRental" onclick="switchMainTdTab('rental')">
                    <i class="fa-solid fa-handshake"></i>
                    <span class="tab-label-full">Unit Rekanan Rental (TRAC)</span>
                    <span class="tab-label-short">Mitra Rental</span>
                </button>
                <button type="button" class="td-tab-btn" id="tabBtnRiwayat" onclick="switchMainTdTab('riwayat')">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <span class="tab-label-full">Riwayat Pengajuan</span>
                    <span class="tab-label-short">Riwayat</span>
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
                    <button type="button" class="btn-banner-ajukan" onclick="openModal()">
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
                    <span class="rental-hero-badge">
                        <i class="fa-solid fa-handshake"></i> TOYOTA FLEET PARTNERSHIP
                    </span>
                    <h3>Armada Ready Rekanan Rental</h3>
                    <p>Gunakan armada kemitraan resmi (TRAC Astra / Partner) jika unit test drive cabang sedang terpakai atau varian tertentu tidak tersedia di showroom.</p>
                </div>

                <!-- Partner Fleet Container -->
                <div id="partnerFleetContainer">
                    <p style="text-align:center; padding:30px; color:#64748b; font-size:13px;">
                        <i class="fa-solid fa-spinner fa-spin"></i> Memuat armada rekanan rental...
                    </p>
                </div>

                <!-- Form Permintaan Rental -->
                <div class="rental-form-card">
                    <h3 class="rental-form-title">
                        <i class="fa-solid fa-file-pen" style="color:var(--td-red);"></i> Form Permintaan Unit Test Drive Rekanan
                    </h3>

                    <form id="rentalTestDriveForm" onsubmit="submitRentalBooking(event)">
                        <div class="rental-form-row">
                            <div class="form-group-custom">
                                <label>Nama Sales Consultant</label>
                                <input type="text" id="salesName" class="form-control" readonly required>
                            </div>
                            <div class="form-group-custom">
                                <label>Pilih Mitra Rental</label>
                                <select id="selectMitraRental" class="form-control" required onchange="updateModelOptionsByPartner()">
                                    <option value="TRAC Astra Rent a Car (Bandung Branch)">TRAC Astra Rent a Car (Bandung Branch)</option>
                                    <option value="FR Group Braga (Toyota &amp; Premium SUV Fleet)">FR Group Braga (Toyota &amp; Premium SUV Fleet)</option>
                                    <option value="FR Group Luxury &amp; Commercial (All-in Driver + BBM)">FR Group Luxury &amp; Commercial</option>
                                </select>
                            </div>
                        </div>

                        <div class="rental-form-row">
                            <div class="form-group-custom">
                                <label>Model Mobil Diminta</label>
                                <select id="selectModelUnit" class="form-control" required>
                                    <option value="Innova Zenix Q Hybrid">Innova Zenix Q Hybrid</option>
                                    <option value="Yaris Cross S Hybrid">Yaris Cross S Hybrid</option>
                                    <option value="All New Veloz 1.5 Q">All New Veloz 1.5 Q</option>
                                    <option value="New Fortuner 2.8 GR Sport">New Fortuner 2.8 GR Sport</option>
                                    <option value="Toyota Alphard 2.5 HEV">Toyota Alphard 2.5 HEV</option>
                                </select>
                            </div>
                            <div class="form-group-custom">
                                <label>Jadwal Test Drive Rekanan</label>
                                <input type="datetime-local" id="tanggalTestdrive" class="form-control" required>
                            </div>
                        </div>

                        <div class="rental-form-row">
                            <div class="form-group-custom">
                                <label>Nama Calon Konsumen</label>
                                <input type="text" id="customerName" class="form-control" placeholder="Contoh: Bpk. Gunawan" required>
                            </div>
                            <div class="form-group-custom">
                                <label>No. WhatsApp Konsumen</label>
                                <input type="tel" id="customerPhone" class="form-control" placeholder="Contoh: 081234567890" required>
                            </div>
                        </div>

                        <div class="rental-form-row">
                            <div class="form-group-custom">
                                <label>Durasi Peminjaman</label>
                                <select id="selectDurasi" class="form-control" required>
                                    <option value="1 Hari (24 Jam)">1 Hari (24 Jam)</option>
                                    <option value="2 Hari">2 Hari</option>
                                    <option value="3 Hari">3 Hari</option>
                                </select>
                            </div>
                            <div class="form-group-custom">
                                <label>Lokasi Penjemputan / Test Drive</label>
                                <input type="text" id="lokasiPenjemputan" class="form-control" value="Showroom Tunas Toyota Kiara Condong" required>
                            </div>
                        </div>

                        <div class="form-group-custom">
                            <label>Alasan Penggunaan Unit Rekanan</label>
                            <textarea id="selectAlasan" class="form-control" rows="2" placeholder="Contoh: Unit Innova Zenix showroom sedang servis / konsumen request tipe Hybrid ke rumah"></textarea>
                        </div>

                        <button type="submit" class="btn-submit-rental">
                            <i class="fa-solid fa-paper-plane"></i> Kirim Pengajuan ke SPV &amp; Admin Rental
                        </button>
                    </form>
                </div>
            </div>

            <!-- ══════════════════════════════════════════════════════════════════════════════
                 TAB 3: RIWAYAT PENGAJUAN (INTERNAL & RENTAL TERPADU)
            ══════════════════════════════════════════════════════════════════════════════ -->
            <div id="sectionRiwayat" style="display:none;">
                <div class="search-wrapper">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" id="searchTd" class="form-control search-input-modern" placeholder="Cari nama customer / mobil..." onkeyup="filterTdList()">
                </div>

                <!-- Riwayat Internal Dealer -->
                <h4 class="riwayat-section-title">
                    <i class="fa-solid fa-building-flag" style="color:#0284c7;"></i> Riwayat Unit Dealer Cabang
                </h4>
                <div id="tdContainer">
                    <p style="text-align:center; color:var(--text-muted); font-size:12px; padding:20px;">Memuat riwayat...</p>
                </div>

                <!-- Riwayat Unit Rental -->
                <h4 class="riwayat-section-title" style="margin-top:24px;">
                    <i class="fa-solid fa-handshake" style="color:var(--td-red);"></i> Riwayat Unit Rekanan Rental
                </h4>
                <div id="historyBookingContainer">
                    <div id="rentalHistoryList">
                        <p style="text-align:center; color:var(--text-muted); font-size:12px; padding:20px;">Memuat riwayat rental...</p>
                    </div>
                </div>
            </div>

        </div>

        <!-- ═══════════════ FLOATING BOTTOM NAVIGATION (MOBILE) ═══════════════ -->
        <nav class="bottom-nav">
            <a href="../index.html" class="nav-item"><i class="fa-solid fa-house"></i><span class="nav-text">Home</span></a>
            <a href="pricelist.html" class="nav-item"><i class="fa-solid fa-clipboard-list"></i><span class="nav-text">Harga</span></a>
            <a href="input.html" class="nav-item center-btn">
                <div class="center-btn-inner">
                    <i class="fa-solid fa-camera"></i>
                </div>
            </a>
            <a href="testdrive.html" class="nav-item active"><i class="fa-solid fa-car-side"></i><span class="nav-text">Tes Drive</span></a>
            <a href="profil.html" class="nav-item"><i class="fa-solid fa-user"></i><span class="nav-text">Profil</span></a>
        </nav>
    </div>

    <!-- Modal Input Internal Test Drive -->
    <div class="modal-overlay" id="inputModal" onclick="if(event.target===this) closeModal()">
        <div class="modal-sheet">
            <div class="modal-sheet-handle"></div>
            <div class="modal-sheet-header">
                <h3>Pengajuan Test Drive Cabang</h3>
                <button type="button" class="modal-sheet-close" onclick="closeModal()">&times;</button>
            </div>

            <form id="tdForm" onsubmit="submitTestDrive(event)">
                <div class="form-group" style="display:none;">
                    <input type="hidden" id="inputIdUnit">
                </div>
                <div class="form-group-custom">
                    <label>Nama Customer</label>
                    <input type="text" class="form-control" id="inputCustomer" placeholder="Contoh: Bpk. Budi Santoso" required>
                </div>
                <div class="form-group-custom">
                    <label>Jadwal Test Drive</label>
                    <input type="datetime-local" class="form-control" id="inputJadwal" required>
                </div>
                <div class="form-group-custom">
                    <label>Rencana Rute</label>
                    <textarea class="form-control" id="inputRute" rows="2" placeholder="Contoh: Showroom - Jl. Kiara Condong - Rumah Konsumen" required></textarea>
                </div>

                <div style="display:flex; gap:12px; margin-top:20px;">
                    <button type="button" class="btn-main" style="background:#f1f5f9; color:#475569; margin:0; border:none; flex:1; border-radius:12px; padding:12px; font-weight:700; cursor:pointer;" onclick="closeModal()">Batal</button>
                    <button type="submit" class="btn-main" style="margin:0; flex:2; border-radius:12px; padding:12px; font-weight:800; background:linear-gradient(135deg, var(--td-navy), var(--td-navy-light)); color:white; border:none; cursor:pointer;" id="submitBtn"><i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Kirim ke SPV</button>
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
    <script src="../js/testdrive.js?v=20260908_v11"></script>
    <script src="../js/rental_testdrive.js?v=20260908_v11"></script>

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
                if (typeof loadHistory === 'function') loadHistory();
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
