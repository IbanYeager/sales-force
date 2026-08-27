<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rekanan Rental Test Drive — Tunas Toyota</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    /* ══════════════════════════════════════════════════════════
       RENTAL TEST DRIVE — PREMIUM GLASSMORPHISM DESIGN v1.0
    ══════════════════════════════════════════════════════════ */
    .mobile-app { background-color: transparent !important; min-height: 100vh; padding-bottom: 60px; }

    /* ── Hero Banner ── */
    .rental-hero {
      background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 55%, #0f172a 100%);
      color: white;
      padding: 30px 26px;
      border-radius: 20px;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 12px 32px rgba(13, 27, 62, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }
    .rental-hero::after {
      content: '\f1b9'; font-family: 'Font Awesome 6 Free'; font-weight: 900;
      position: absolute; right: -20px; bottom: -20px; font-size: 130px;
      color: rgba(255, 255, 255, 0.04); transform: rotate(-15deg); pointer-events: none;
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255, 255, 255, 0.12); border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 5px 12px; border-radius: 8px; font-size: 11px; font-weight: 800;
      letter-spacing: 0.5px; margin-bottom: 12px; backdrop-filter: blur(6px);
    }
    .rental-hero h1 { margin: 0 0 8px 0; font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
    .rental-hero p { margin: 0; font-size: 13px; opacity: 0.85; line-height: 1.5; max-width: 90%; }

    /* ── Navigation Tabs ── */
    .rental-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      padding: 6px;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }
    .tab-btn {
      flex: 1;
      padding: 12px 16px;
      border-radius: 12px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.3s var(--ease);
    }
    .tab-btn.active {
      background: var(--primary-red);
      color: white;
      box-shadow: 0 4px 14px rgba(215, 18, 58, 0.28);
    }
    .tab-btn:hover:not(.active) {
      background: rgba(215, 18, 58, 0.06);
      color: var(--primary-red);
    }

    /* ── Partner Fleet Cards ── */
    .partner-card {
      background: white;
      border-radius: 18px;
      border: 1px solid #e2e8f0;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
      transition: all 0.3s ease;
    }
    .partner-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1.5px dashed #e2e8f0;
    }
    .partner-title {
      font-size: 15px; font-weight: 800; color: var(--primary-blue);
      display: flex; align-items: center; gap: 8px;
    }
    .partner-badge {
      font-size: 10px; font-weight: 800; background: #eff6ff; color: #1d4ed8;
      padding: 4px 10px; border-radius: 6px; border: 1px solid #bfdbfe;
    }

    .fleet-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
      transition: all 0.3s ease;
    }
    .fleet-item:hover {
      border-color: var(--primary-red);
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(0,0,0,0.05);
    }
    .fleet-model { font-size: 13.5px; font-weight: 800; color: #0f172a; }
    .fleet-meta { font-size: 11px; color: #64748b; font-weight: 600; display: flex; gap: 8px; flex-wrap: wrap; }
    .fleet-plat { font-family: monospace; background: #e2e8f0; padding: 2px 6px; border-radius: 4px; color: #334155; }

    /* ── Premium Form Card ── */
    .form-card {
      background: white;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      padding: 28px 24px;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
      margin-bottom: 24px;
    }
    .form-section-title {
      font-size: 15px; font-weight: 800; color: var(--text-dark);
      border-bottom: 2px solid var(--border-color); padding-bottom: 12px;
      margin-bottom: 20px; display: flex; align-items: center; gap: 8px;
    }
    .input-group { position: relative; margin-bottom: 18px; }
    .input-group i {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: var(--text-light); font-size: 14px; pointer-events: none;
    }
    .form-control {
      width: 100%; padding: 14px 14px 14px 44px;
      border: 1.5px solid var(--border-color); border-radius: 12px;
      font-size: 13.5px; font-weight: 600; color: var(--text-dark);
      background: #f8fafc; transition: all 0.3s ease;
      font-family: 'Inter', sans-serif;
    }
    .form-control:focus {
      background: white; border-color: var(--primary-red);
      box-shadow: 0 0 0 4px rgba(215, 18, 58, 0.08); outline: none;
    }
    .input-label { display: block; font-size: 11.5px; font-weight: 700; color: var(--text-secondary); margin-bottom: 6px; }

    /* ── History Cards ── */
    .history-card {
      background: white;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      padding: 18px;
      margin-bottom: 14px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }
    .status-badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 800;
    }
    .status-badge.disetujui { background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; }
    .status-badge.menunggu { background: #fef3c7; color: #b45309; border: 1px solid #fde68a; }
    .status-badge.penggunaan { background: #e0f2fe; color: #0369a1; border: 1px solid #bae6fd; }
  </style>
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Rekanan Rental Test Drive</h2>
      <div style="width: 24px;"></div>
    </header>

    <div class="container" style="margin-top: 0;">
      
      <!-- Hero Banner -->
      <div class="rental-hero">
        <span class="hero-badge"><i class="fa-solid fa-handshake"></i> TOYOTA FLEET PARTNERSHIP</span>
        <h1>Test Drive Rekanan Rental</h1>
        <p>Layanan pemesanan unit kendaraan pengujian (*Test Drive*) hasil kemitraan resmi Tunas Toyota dengan penyedia armada KINTO One, TRAC Astra Rent a Car, & Executive Fleet Partner.</p>
      </div>

      <!-- Navigation Tabs -->
      <div class="rental-tabs">
        <button type="button" class="tab-btn active" onclick="switchRentalTab('fleet')" id="tabFleet">
          <i class="fa-solid fa-car-side"></i> Armada Ready Rekanan
        </button>
        <button type="button" class="tab-btn" onclick="switchRentalTab('form')" id="tabForm">
          <i class="fa-solid fa-file-pen"></i> Form Pengajuan Unit
        </button>
        <button type="button" class="tab-btn" onclick="switchRentalTab('history')" id="tabHistory">
          <i class="fa-solid fa-clock-rotate-left"></i> Status Pengajuan (<span id="historyCount">0</span>)
        </button>
      </div>

      <!-- TAB 1: FLEET KATALOG REKANAN -->
      <div id="viewFleet" class="tab-content">
        <div id="partnerFleetContainer">
          <p style="text-align:center; padding:30px; color:#64748b; font-size:13px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat armada rekanan rental...</p>
        </div>
      </div>

      <!-- TAB 2: FORM PENGAJUAN TEST DRIVE -->
      <div id="viewForm" class="tab-content" style="display: none;">
        <div class="form-card">
          <h3 class="form-section-title">
            <i class="fa-solid fa-clipboard-check" style="color:var(--primary-red);"></i> Form Permintaan Unit Test Drive Rekanan
          </h3>

          <form id="rentalTestDriveForm" onsubmit="submitRentalBooking(event)">
            
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div>
                <label class="input-label">Nama Sales Consultant <span>*</span></label>
                <div class="input-group">
                  <input type="text" id="salesName" class="form-control" readonly required style="background:#e2e8f0;">
                  <i class="fa-solid fa-user-tie"></i>
                </div>
              </div>
              <div>
                <label class="input-label">Pilih Mitra Rental <span>*</span></label>
                <div class="input-group">
                  <select id="selectMitraRental" class="form-control" required onchange="updateModelOptionsByPartner()">
                    <option value="FR Group Braga (Toyota & Premium SUV Fleet)">FR Group Braga (Toyota & Premium SUV Fleet)</option>
                    <option value="FR Group Braga (Multi-Brand & Offroad Fleet)">FR Group Braga (Multi-Brand & Offroad Fleet)</option>
                    <option value="FR Group Luxury & Commercial (All-in Driver + BBM)">FR Group Luxury & Commercial (All-in Driver + BBM)</option>
                    <option value="TRAC Astra Rent a Car (Bandung Branch)">TRAC Astra Rent a Car (Bandung Branch)</option>
                    <option value="KINTO One Fleet Service (Toyota Astra Financial)">KINTO One Fleet Service (TAF)</option>
                  </select>
                  <i class="fa-solid fa-building"></i>
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div>
                <label class="input-label">Nama Konsumen <span>*</span></label>
                <div class="input-group">
                  <input type="text" id="customerName" class="form-control" placeholder="Contoh: Bpk. Hendra Wijaya" required>
                  <i class="fa-solid fa-user"></i>
                </div>
              </div>
              <div>
                <label class="input-label">No. WhatsApp Konsumen <span>*</span></label>
                <div class="input-group">
                  <input type="tel" id="customerPhone" class="form-control" placeholder="Contoh: 081298765432" required>
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div>
                <label class="input-label">Model Unit Kendaraan <span>*</span></label>
                <div class="input-group">
                  <select id="selectModelUnit" class="form-control" required>
                    <!-- FR Group Toyota & Hybrid -->
                    <option value="Zenix Q Hybrid">Zenix Q Hybrid — Rp 1.200.000 / 24 Jam</option>
                    <option value="Zenix G Hybrid">Zenix G Hybrid — Rp 900.000 / 24 Jam</option>
                    <option value="Zenix GR Sport">Zenix GR Sport — Rp 1.300.000 / 24 Jam</option>
                    <option value="Fortuner GR">Fortuner GR — Rp 1.200.000 / 24 Jam</option>
                    <option value="GR Sport (Fortuner)">GR Sport (Fortuner 4x4) — Rp 1.300.000 / 24 Jam</option>
                    <option value="New Camry">New Camry — Rp 2.000.000 / 24 Jam</option>
                    <option value="Innova Reborn">Innova Reborn — Rp 650.000 / 24 Jam</option>
                    <option value="Veloz Q">Veloz Q — Rp 500.000 / 24 Jam</option>
                    <option value="Avanza TSS">Avanza TSS — Rp 450.000 / 24 Jam</option>
                    <!-- FR Group Multi-Brand & Offroad -->
                    <option value="Brio">Brio — Rp 350.000 / 24 Jam</option>
                    <option value="Stargazer Essential">Stargazer Essential — Rp 500.000 / 24 Jam</option>
                    <option value="Stargazer Prime">Stargazer Prime — Rp 550.000 / 24 Jam</option>
                    <option value="Xpander">Xpander — Rp 550.000 / 24 Jam</option>
                    <option value="City Hatchback">City Hatchback — Rp 600.000 / 24 Jam</option>
                    <option value="HR-V Panoramic">HR-V Panoramic — Rp 800.000 / 24 Jam</option>
                    <option value="Jimny 3 Doors">Jimny 3 Doors — Rp 1.200.000 / 24 Jam</option>
                    <option value="Pajero Sport">Pajero Sport — Rp 1.300.000 / 24 Jam</option>
                    <option value="Ranger 4x4">Ranger 4x4 — Rp 600.000 / 24 Jam</option>
                    <option value="BMW M4320i">BMW M4320i — Rp 8.000.000 / 24 Jam</option>
                    <!-- FR Group Luxury All-In Driver + BBM -->
                    <option value="Alphard Hybrid">Alphard Hybrid — Rp 3.500.000 / 24 Jam (All-in)</option>
                    <option value="Alphard Transformer">Alphard Transformer — Rp 2.500.000 / 24 Jam (All-in)</option>
                    <option value="Land Cruiser">Land Cruiser — Rp 15.000.000 / 24 Jam (All-in)</option>
                    <option value="Hiace Premio">Hiace Premio — Rp 1.500.000 / 24 Jam (All-in)</option>
                    <option value="Hiace Commuter">Hiace Commuter — Rp 1.200.000 / 24 Jam (All-in)</option>
                  </select>
                  <i class="fa-solid fa-car"></i>
                </div>
              </div>
              <div>
                <label class="input-label">Durasi Pengujian (Trial) <span>*</span></label>
                <div class="input-group">
                  <select id="selectDurasi" class="form-control" required>
                    <option value="2 Jam (Quick Trial)">2 Jam (Quick Trial Showroom)</option>
                    <option value="1 Hari (Executive Trial)">1 Hari (Executive Trial / Out-of-City)</option>
                    <option value="2 Hari (B2B Corporate Evaluation)">2 Hari (B2B Corporate Fleet Evaluation)</option>
                  </select>
                  <i class="fa-solid fa-clock"></i>
                </div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px;">
              <div>
                <label class="input-label">Jadwal & Jam Test Drive <span>*</span></label>
                <div class="input-group">
                  <input type="datetime-local" id="tanggalTestdrive" class="form-control" required>
                  <i class="fa-solid fa-calendar-days"></i>
                </div>
              </div>
              <div>
                <label class="input-label">Alasan & Kebutuhan Pengajuan <span>*</span></label>
                <div class="input-group">
                  <select id="selectAlasan" class="form-control" required>
                    <option value="Unit Showroom Kosong / Stock Waiting List">Unit Showroom Kosong / Waiting List Stock</option>
                    <option value="Evaluasi B2B Corporate Fleet Buying">Evaluasi B2B Corporate Fleet Buying</option>
                    <option value="VIP Customer High-Net-Worth Trial">VIP Customer High-Net-Worth Trial</option>
                    <option value="Pengujian Medan Tanjakan / Luar Kota">Pengujian Medan Tanjakan / Luar Kota</option>
                  </select>
                  <i class="fa-solid fa-circle-info"></i>
                </div>
              </div>
            </div>

            <div class="input-group" style="margin-bottom:24px;">
              <label class="input-label">Lokasi Penjemputan / Serah Terima Unit <span>*</span></label>
              <input type="text" id="lokasiPenjemputan" class="form-control" placeholder="Contoh: Showroom Tunas Toyota Kiara Condong / Kantor Konsumen PT Nusantara Logistik" required style="padding-left:14px;">
            </div>

            <button type="submit" class="btn-main" style="width:100%; padding:14px; background:var(--primary-red); color:white; border:none; border-radius:12px; font-size:14px; font-weight:800; cursor:pointer; box-shadow:var(--shadow-red);">
              <i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i> Kirim Pengajuan &amp; Dapatkan Konfirmasi WA
            </button>
          </form>
        </div>
      </div>

      <!-- TAB 3: RIWAYAT PENGAJUAN -->
      <div id="viewHistory" class="tab-content" style="display: none;">
        <div id="historyBookingContainer">
          <p style="text-align:center; padding:30px; color:#64748b; font-size:13px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat riwayat pengajuan...</p>
        </div>
      </div>

    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/rental_testdrive.js"></script>
</body>

</html>
