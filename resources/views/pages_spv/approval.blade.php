<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Approval</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/spv_approval.css">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="spv-shell">
    <!-- SIDEBAR -->
    <aside class="spv-sidebar">
      <div class="spv-brand-container">
        <div class="spv-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="spv-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-user-tie"></i> SPV PANEL</span>
          <p class="panel-sub">Desktop Supervisor</p>
        </div>
      </div>

      <nav class="spv-nav">
        <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval" class="active"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="../pages/polreg.html" id="navPolreg"><i class="fa-solid fa-chart-pie"></i>Peta Polreg Wilayah</a>
        <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
        <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN BODY -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle">Approval Pengajuan</h2>
          <p class="page-sub">Setujui atau tolak pengajuan dari tim Anda</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Memuat...</span>
          </div>
        </div>
      </div>

      <!-- DISKON & PLAFOND APPROVAL DESK WIDGET -->
      <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius:16px; padding:18px; color:white; margin-bottom:18px; box-shadow:0 8px 20px rgba(0,0,0,0.15); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <div>
          <span style="background:rgba(37,99,235,0.2); color:#60a5fa; font-size:11px; font-weight:800; padding:3px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
            <i class="fa-solid fa-calculator"></i> Plafond Desk SPV
          </span>
          <h3 style="font-size:16px; font-weight:800; color:white; margin:6px 0 2px;">Kalkulator Simulaasi Limit Diskon & Margin SPV</h3>
          <p style="font-size:12px; color:#94a3b8; margin:0;">Hitung toleransi batas diskon & profit retention sebelum menyetujui pengajuan SPK sales.</p>
        </div>
        <button class="btn" style="background:#2563eb; color:white; font-weight:700; border:none; padding:10px 18px; border-radius:10px; cursor:pointer;" onclick="openApprovalDiscountDesk()">
          <i class="fa-solid fa-calculator"></i> Buka Simulasi Diskon
        </button>
      </div>

      <!-- Segment Tabs -->
      <div class="tabs-nav" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="tab-item active" id="tabSpk" onclick="switchView('spk')">
            <i class="fa-solid fa-file-invoice"></i> Pengajuan SPK <span class="badge-count" id="countSpkBadge">0</span>
          </button>
          <button class="tab-item" id="tabOlx" onclick="switchView('olx')">
            <i class="fa-solid fa-exchange-alt"></i> Trade-In OLX <span class="badge-count" id="countOlxBadge">0</span>
          </button>
          <button class="tab-item" id="tabTestDrive" onclick="switchView('testdrive')">
            <i class="fa-solid fa-car-side"></i> Test Drive <span class="badge-count" id="countTestDriveBadge">0</span>
          </button>
        </div>
        <div>
          <select id="selectFilterSpvApproval" class="form-control" style="width: auto; padding: 7px 12px; font-weight: 700; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 12px; background: #f8fafc;" onchange="changeApprovalSpvFilter(this.value)">
            <option value="Semua">Semua Tim (Master - 42 Sales)</option>
            <option value="Ryan">Tim Pak Ryan</option>
            <option value="Riva">Tim Pak Riva</option>
            <option value="Dani">Tim Pak Dani</option>
            <option value="Hendra">Tim Pak Hendra</option>
          </select>
        </div>
      </div>

      <!-- Main Content Container -->
      <div class="spv-card" style="min-height: 400px;">
        <div id="approvalContent">
          <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
        </div>
      </div>
    </main>
  </div>

  <!-- MODAL APPROVAL DISKON DESK -->
  <div class="modal-overlay" id="approvalDiscountDeskModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:520px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-calculator" style="color:#2563eb;"></i> Diskon & Plafond Approval Desk</h3>
        <button onclick="closeApprovalDiscountDesk()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Tipe Kendaraan Toyota</label>
          <select id="apprModelSelect" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600;" onchange="calcApprDiscount()">
            <option value="avanza">Toyota Avanza G CVT (Max SPV: Rp 15 Juta)</option>
            <option value="veloz">Toyota Veloz Q CVT (Max SPV: Rp 18 Juta)</option>
            <option value="zenix">Innova Zenix V Hybrid (Max SPV: Rp 22 Juta)</option>
            <option value="fortuner">Fortuner 2.8 VRZ (Max SPV: Rp 30 Juta)</option>
            <option value="yaris_cross">Yaris Cross S GR (Max SPV: Rp 20 Juta)</option>
          </select>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nominal Diskon Diajukan Sales (Rp)</label>
          <input type="number" id="apprDiscountInput" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:700; font-size:16px;" value="15000000" oninput="calcApprDiscount()">
        </div>

        <div id="apprSimBox" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-top:4px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:12px; color:#166534; font-weight:700;">Status Kelayakan Margin:</span>
            <span id="apprStatusBadge" style="font-size:11px; font-weight:800; padding:2px 8px; border-radius:6px; background:#dcfce7; color:#15803d;">Lolos Toleransi SPV</span>
          </div>
          <div style="font-size:18px; font-weight:900; color:#15803d; margin-bottom:2px;" id="apprProfitText">Profit Retention: Aman</div>
          <p style="font-size:11px; color:#166534; margin:0;" id="apprDescText">Pengajuan diskon berada pada rentang yang diizinkan untuk Supervisor.</p>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px; justify-content:flex-end;">
        <button class="btn" style="background:#e2e8f0; color:#334155; font-weight:700; border:none; padding:10px 16px; border-radius:10px; cursor:pointer;" onclick="closeApprovalDiscountDesk()">Batal</button>
        <button class="btn" style="background:#059669; color:white; font-weight:700; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="applyApprDiscount()">
          <i class="fa-solid fa-check-circle"></i> Setujui Diskon
        </button>
      </div>
    </div>
  </div>
    </main>
  </div>

  <!-- Image Zoom Modal -->
  <div id="imageZoomModal" class="zoom-overlay">
    <button class="zoom-close" onclick="closeImageZoom()"><i class="fa-solid fa-xmark"></i></button>
    <img id="zoomedImg" src="" alt="Foto">
  </div>

  <!-- ══════════════════════════════════════════════════════════════════════
       OFFICIAL DIGITAL SPK DOCUMENT PREVIEW & PRINT MODAL (SPV VIEW)
       ══════════════════════════════════════════════════════════════════════ -->
  <div id="spkDocumentModal" class="spk-doc-overlay" style="display:none;" onclick="closeSpkDocumentModal(event)">
    <div class="spk-doc-sheet" onclick="event.stopPropagation()">
      <!-- Modal Toolbar -->
      <div class="spk-doc-header no-print">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="width:32px; height:32px; border-radius:8px; background:#c8102e; display:flex; align-items:center; justify-content:center; color:white; font-size:14px;">
            <i class="fa-solid fa-file-contract"></i>
          </div>
          <div>
            <h4 style="margin:0; font-size:14px; font-weight:800; color:#ffffff;">Dokumen Resmi SPK Konsumen</h4>
            <span style="font-size:11px; color:#94a3b8;">Verifikasi Data Identitas, Unit &amp; Tanda Tangan Digital</span>
          </div>
        </div>
        <button type="button" class="ocr-modal-close-btn" onclick="closeSpkDocumentModal()" style="background:none; border:none; color:white; font-size:24px; cursor:pointer;">&times;</button>
      </div>

      <!-- Printable Document Area -->
      <div class="spk-doc-body" id="spkDocPrintArea">
        <div class="spk-paper">
          <!-- Kop Surat Resmi Dealer -->
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0d1b3e; padding-bottom:12px; margin-bottom:16px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <img src="../image/logo_tunas_toyota.png" alt="Tunas Toyota" style="height:36px; object-fit:contain;" onerror="this.style.display='none';">
              <div>
                <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:900; color:#0d1b3e; margin:0; letter-spacing:0.5px;">TUNAS TOYOTA KIARA CONDONG</h3>
                <p style="margin:2px 0 0; font-size:10px; color:#475569;">PT. Tunas Ridean Tbk &bull; Jl. Ibrahim Adjie No. 440, Bandung &bull; Telp: (022) 731-2000</p>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="font-size:10px; font-weight:800; color:#64748b; text-transform:uppercase;">Surat Pesanan Kendaraan</div>
              <div style="font-size:12.5px; font-weight:900; color:#c8102e;" id="docSpkNumber">SPK/TKC/2026/09/0001</div>
              <div style="font-size:9.5px; color:#94a3b8;" id="docSpkDate">12 September 2026</div>
            </div>
          </div>

          <!-- Document Title & Status Pill -->
          <div style="text-align:center; margin-bottom:18px;">
            <h2 style="font-size:15px; font-weight:900; letter-spacing:1px; color:#0f172a; margin:0 0 4px; text-transform:uppercase;">SURAT PEMESANAN KENDARAAN (SPK)</h2>
            <div style="display:flex; justify-content:center; gap:8px; align-items:center;">
              <span style="font-size:10px; color:#64748b;">Status Pengajuan:</span>
              <span class="chip chip-yellow" id="docBadgeStatus" style="font-size:10px; font-weight:800; padding:2px 8px;">PENDING</span>
            </div>
          </div>

          <!-- Section 1: Identitas Pemesan -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; margin-bottom:14px;">
            <div style="font-size:11px; font-weight:800; color:#0d1b3e; margin-bottom:8px; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-id-card" style="color:#2563eb;"></i> I. Identitas Lengkap Pemesan (Sesuai KTP / KK)
            </div>
            <table style="width:100%; font-size:11.5px; border-collapse:collapse;">
              <tr>
                <td style="width:130px; padding:4px 0; color:#64748b; font-weight:600;">Nama Lengkap</td>
                <td style="width:10px; font-weight:700;">:</td>
                <td style="font-weight:800; color:#0f172a;" id="docNamaCust">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">NIK / No. KK</td>
                <td style="font-weight:700;">:</td>
                <td style="font-weight:700; color:#1e3a8a;" id="docNikKk">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">No. WhatsApp / HP</td>
                <td style="font-weight:700;">:</td>
                <td style="font-weight:700; color:#0f172a;" id="docHpCust">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">Alamat Lengkap</td>
                <td style="font-weight:700;">:</td>
                <td style="color:#334155;" id="docAlamatCust">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">Wilayah Domisili</td>
                <td style="font-weight:700;">:</td>
                <td style="color:#334155;" id="docWilayahCust">-</td>
              </tr>
            </table>
          </div>

          <!-- Section 2: Detail Pesanan Unit -->
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; margin-bottom:14px;">
            <div style="font-size:11px; font-weight:800; color:#0d1b3e; margin-bottom:8px; text-transform:uppercase; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-car" style="color:#c8102e;"></i> II. Detail Pesanan Kendaraan &amp; Transaksi
            </div>
            <table style="width:100%; font-size:11.5px; border-collapse:collapse;">
              <tr>
                <td style="width:130px; padding:4px 0; color:#64748b; font-weight:600;">Model Kendaraan</td>
                <td style="width:10px; font-weight:700;">:</td>
                <td style="font-weight:800; color:#c8102e;" id="docModelUnit">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">Harga OTR</td>
                <td style="font-weight:700;">:</td>
                <td style="font-weight:800; color:#0f172a;" id="docHargaOtr">-</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">Sistem Pembelian</td>
                <td style="font-weight:700;">:</td>
                <td style="font-weight:700; color:#0f172a;" id="docTipeBeli">Kredit</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#64748b; font-weight:600;">Wiraniaga / Sales</td>
                <td style="font-weight:700;">:</td>
                <td style="font-weight:700; color:#0f172a;" id="docNamaSales">Wiraniaga Tunas Toyota</td>
              </tr>
            </table>
          </div>

          <!-- Section 3: Tanda Tangan & Stempel Digital -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-top:20px; border-top:1.5px dashed #cbd5e1; padding-top:16px;">
            <div style="text-align:center;">
              <p style="font-size:11px; font-weight:700; color:#475569; margin:0 0 6px;">Pemesan / Konsumen,</p>
              <div style="height:80px; display:flex; align-items:center; justify-content:center;">
                <img id="docSignatureImg" src="" alt="Tanda Tangan" style="max-height:75px; max-width:180px; object-fit:contain; display:none;">
                <div id="docNoSignPlaceholder" style="font-size:11px; color:#94a3b8; font-style:italic;">(Ditandatangani Digital)</div>
              </div>
              <p style="font-size:11.5px; font-weight:800; color:#0f172a; margin:4px 0 0; text-decoration:underline;" id="docSignerName">Customer Toyota</p>
              <span style="font-size:10px; color:#64748b;">Konsumen Toyota</span>
            </div>

            <div style="text-align:center; position:relative;">
              <p style="font-size:11px; font-weight:700; color:#475569; margin:0 0 6px;">PT. Tunas Ridean Tbk - Kiara Condong,</p>
              <div style="height:80px; display:flex; align-items:center; justify-content:center; position:relative;">
                <div style="border:2px dashed #c8102e; border-radius:50%; width:75px; height:75px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#c8102e; transform:rotate(-12deg); opacity:0.85;">
                  <span style="font-size:7.5px; font-weight:900;">TUNAS TOYOTA</span>
                  <i class="fa-solid fa-circle-check" style="font-size:12px; margin:2px 0;"></i>
                  <span style="font-size:7px; font-weight:800;">VERIFIED</span>
                </div>
              </div>
              <p style="font-size:11.5px; font-weight:800; color:#0f172a; margin:4px 0 0; text-decoration:underline;">Branch Management</p>
              <span style="font-size:10px; color:#64748b;">Official Authorized Dealer</span>
            </div>
          </div>

          <!-- Footer Catatan Otomatis -->
          <div style="margin-top:20px; padding-top:10px; border-top:1px solid #e2e8f0; font-size:9.5px; color:#94a3b8; display:flex; justify-content:space-between; align-items:center;">
            <span><i class="fa-solid fa-qrcode"></i> Terverifikasi Otomatis oleh Sistem Sales Force Automation Tunas Toyota</span>
            <span>Ref: SFT-AUTO-GEN</span>
          </div>
        </div>
      </div>

      <!-- Action Footer (Hidden on Print) -->
      <div class="no-print" style="padding:14px 22px; background:#ffffff; border-top:1px solid #e2e8f0; display:flex; justify-content:flex-end; gap:10px; flex-wrap:wrap;">
        <button type="button" class="btn-outline" onclick="closeSpkDocumentModal()" style="padding:9px 16px; font-size:12.5px; border-radius:10px; cursor:pointer;">
          Tutup
        </button>
        <button type="button" class="btn-main" onclick="shareSpkDocumentWa()" style="background:#25D366; color:white; border:none; padding:9px 18px; font-size:12.5px; border-radius:10px; cursor:pointer; box-shadow:0 4px 12px rgba(37,211,102,0.3);">
          <i class="fa-brands fa-whatsapp"></i> Kirim Dokumen ke WA Customer
        </button>
        <button type="button" class="btn-main" onclick="printSpkDocument()" style="padding:9px 20px; font-size:12.5px; border-radius:10px; background:linear-gradient(135deg, #0d1b3e, #1e3a8a); color:white; cursor:pointer; border:none;">
          <i class="fa-solid fa-print"></i> Cetak / Unduh PDF
        </button>
      </div>
    </div>
  </div>

  <style>
    @media print {
      body * {
        visibility: hidden !important;
      }
      #spkDocPrintArea, #spkDocPrintArea * {
        visibility: visible !important;
      }
      #spkDocPrintArea {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 24px !important;
        background: #ffffff !important;
        border: none !important;
        box-shadow: none !important;
      }
      .no-print, .header-page, .sidebar-brand, .spv-header {
        display: none !important;
      }
    }
    .spk-doc-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      z-index: 99999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
    }
    .spk-doc-sheet {
      background: #ffffff;
      width: 100%;
      max-width: 820px;
      max-height: 92vh;
      border-radius: 20px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.35);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Inter', sans-serif;
    }
    .spk-doc-header {
      padding: 16px 22px;
      background: #0d1b3e;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .spk-doc-body {
      padding: 20px;
      overflow-y: auto;
      background: #f8fafc;
      flex: 1;
    }
    .spk-paper {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 28px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.03);
    }
  </style>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_approval.js?v=20260819_master"></script>

  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
