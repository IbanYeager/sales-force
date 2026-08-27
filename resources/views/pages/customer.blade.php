<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Customer</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/sidebar_desktop.js?v=20260827_scroll_top"></script>
  <link rel="stylesheet" href="../css/customer.css">
  <link rel="stylesheet" href="../css/followup.css?v=20260826_numbering">
  <link rel="stylesheet" href="../css/sales_tools.css?v=1.0">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;"> <!-- Expanded for kanban -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Customer CRM &amp; Radar</h2>
    </header>

    <div class="container" style="margin-top:18px;">
      <div class="card" style="padding:18px; margin-bottom:16px;">
        <h3 class="section-title" style="margin-bottom:6px;">Manajemen Pipeline</h3>
        <p style="font-size:12px;color:var(--text-muted);line-height:1.6;">Pindahkan (drag & drop) kartu customer antar kolom untuk memperbarui status. Klik kartu untuk mengelola dokumen.</p>

        <div class="form-group" style="margin-top:14px; display:flex; gap:8px;">
          <input class="form-control" type="text" id="searchCustomer" placeholder="Cari nama customer..." style="flex:1;" />
          <button class="btn-main" style="width:auto; padding:10px 16px; font-size:12px; background:var(--primary-blue); border-radius:8px;" onclick="openAddCustomerModal()"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>

      <!-- ================= JADWAL FOLLOW-UP ================= -->
      <div class="card" style="padding:18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 class="section-title" style="margin-bottom:0;"><i class="fa-solid fa-calendar-check" style="color:var(--primary-blue); margin-right:6px;"></i>Follow-up Hari Ini</h3>
          <button class="btn-main" style="width:auto; padding:6px 12px; font-size:11px; background:var(--primary-blue);" onclick="openFollowupModal()">+ Tambah</button>
        </div>
        <div id="followupList" style="display:flex; flex-direction:column; gap:10px;">
          <!-- Follow-up items will be generated here -->
          <p style="font-size:12px; color:var(--text-muted); text-align:center;">Memuat data...</p>
        </div>
      </div>

      <!-- ================= LEAD STAGNANT & LOST DEAL RADAR ================= -->
      <div class="card" style="padding:16px; margin-bottom:16px; background:linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%); border:1px solid #fecaca;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:#ef4444; color:white; display:flex; align-items:center; justify-content:center; font-size:16px; animation: radar-pulse 2s infinite;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h4 style="font-size:14px; font-weight:800; color:#991b1b; margin:0;">Lead Stagnant Radar (Early Warning)</h4>
              <p style="font-size:11.5px; color:#b91c1c; margin:0;" id="stagnantSummaryText">Memeriksa prospek yang tidak di-follow up > 48 jam...</p>
            </div>
          </div>
          <button class="btn-main" style="width:auto; padding:6px 14px; font-size:11px; background:#b91c1c; border-radius:8px;" onclick="filterStagnantLeads()">
            <i class="fa-solid fa-filter"></i> Tampilkan Lead Stagnan
          </button>
        </div>
      </div>

      <!-- ================= KANBAN BOARD ================= -->
      <div class="kanban-board" id="kanbanBoard">
        <!-- Columns will be rendered here -->
      </div>
    </div>
  </div>

  <!-- Modal Lost Deal Logger -->
  <div class="modal-overlay" id="lostDealModal" onclick="closeLostDealModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="display:flex; align-items:center; gap:6px; color:#c8102e;"><i class="fa-solid fa-file-circle-xmark"></i> Catat Lost Deal / Batal</h3>
        <button class="btn-close-modal" onclick="closeLostDealModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="hidden" id="lostCustomerId">
      <div class="form-group" style="margin-top:14px;">
        <label>Nama Customer</label>
        <input type="text" class="form-control" id="lostCustomerName" readonly style="background:#f1f5f9; font-weight:700;">
      </div>
      <div class="form-group">
        <label>Alasan Utama Lost Deal <span style="color:red;">*</span></label>
        <select class="form-control" id="lostReason">
          <option value="Kalah Diskon / Ambil di Dealer Toyota Lain">Kalah Diskon / Ambil di Dealer Toyota Lain</option>
          <option value="Beli Mobil Brand Lain (Honda/Mitsubishi/Hyundai)">Beli Mobil Brand Lain (Honda/Mitsubishi/Hyundai/Wuling)</option>
          <option value="Aplikasi Leasing Ditolak / Masalah SLIK BI Checking">Aplikasi Leasing Ditolak / Masalah SLIK BI Checking</option>
          <option value="Menunda Pembelian / Belum Ada Dana">Menunda Pembelian / Belum Ada Dana</option>
          <option value="Tidak Ada Respon / No. HP Tidak Aktif">Tidak Ada Respon / No. HP Tidak Aktif</option>
        </select>
      </div>
      <div class="form-group">
        <label>Catatan Tambahan</label>
        <textarea class="form-control" id="lostNote" rows="2" placeholder="Tuliskan catatan detail untuk evaluasi SPV..."></textarea>
      </div>
      <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px; background:#b91c1c;" onclick="saveLostDeal()">Simpan Status Lost Deal</button>
    </div>
  </div>

  <style>
    @keyframes radar-pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
      70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
  </style>

  <!-- Modal Follow-up -->
  <div class="modal-overlay" id="followupModal" onclick="closeFollowupModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>Tambah Pengingat Follow-up</h3>
        <button class="btn-close-modal" onclick="closeFollowupModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="form-group" style="margin-top:14px;">
        <label>Nama Customer</label>
        <select class="form-control" id="followupName">
          <option value="">-- Pilih Customer --</option>
        </select>
      </div>
      <div class="form-group">
        <label>Waktu Follow-up</label>
        <input type="datetime-local" class="form-control" id="followupTime">
      </div>
      <div class="form-group">
        <div class="voice-input-header">
          <label style="margin-bottom:0; font-weight:700;">Catatan / Ringkasan</label>
          <button type="button" class="btn-voice-pill" id="btnVoiceFollowup" title="Rekam Suara (Speech-to-Text)">
            <i class="fa-solid fa-microphone"></i>
            <span>Dikte Suara</span>
          </button>
        </div>
        <textarea class="form-control" id="followupNote" rows="3" placeholder="Contoh: Tanya jadi ambil warna merah/putih (Bisa diketik atau gunakan tombol Dikte Suara)"></textarea>
        <div id="voiceStatusPillFollowup" class="voice-live-status-box" style="display:none;"></div>
      </div>
      <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px;" onclick="saveFollowup()">Simpan Pengingat</button>
    </div>
  </div>

  <!-- Modal Tambah Customer -->
  <div class="modal-overlay" id="addCustomerModal" onclick="closeAddCustomerModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>Tambah Customer Baru</h3>
        <button class="btn-close-modal" onclick="closeAddCustomerModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Quick OCR KTP Trigger -->
      <div style="margin-top:14px; margin-bottom:14px;">
        <input type="file" id="ocrKtpInputCustomer" accept="image/*" style="display:none;" onchange="SalesSuperpowers.scanKtpFile(this, {nama:'newCustomerName', alamat:'newCustomerAddress'})">
        <div class="ocr-scanner-banner" style="padding:14px 16px; margin-bottom:0;" onclick="document.getElementById('ocrKtpInputCustomer').click()">
          <div class="ocr-banner-left">
            <div class="ocr-icon-glow" style="width:40px; height:40px; font-size:16px;">
              <i class="fa-solid fa-camera"></i>
            </div>
            <div>
              <div class="ocr-badge-chip"><i class="fa-solid fa-bolt"></i> AI OCR</div>
              <h4 class="ocr-banner-title" style="font-size:13.5px;">Scan KTP Otomatis</h4>
            </div>
          </div>
          <button type="button" class="btn-ocr-action" style="padding:8px 14px; font-size:11.5px;">
            <i class="fa-solid fa-camera"></i> Foto KTP
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Nama Customer <span style="color:red;">*</span></label>
        <input type="text" class="form-control" id="newCustomerName" placeholder="Contoh: Budi Santoso">
      </div>
      <div class="form-group">
        <label>No. Telepon <span style="color:red;">*</span></label>
        <input type="text" class="form-control" id="newCustomerPhone" placeholder="Contoh: 08123456789">
      </div>
      <div class="form-group">
        <label>Alamat <span style="color:red;">*</span></label>
        <textarea class="form-control" id="newCustomerAddress" rows="2" placeholder="Contoh: Jl. Merdeka No. 10"></textarea>
      </div>
      <button class="btn-main" id="btnSaveNewCustomer" style="width:100%; justify-content:center; margin-top:14px;" onclick="saveNewCustomer()">Simpan Customer</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="../custom_alert.js?v=25"></script>
  <script src="../js/customer.js?v=25"></script>
  <script src="../js/sales_superpowers.js?v=1.0"></script>
  <script src="../js/followup_sales.js?v=20260826_auto_remarks"></script>
  <script src="../js/pwa-app.js?v=25"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Voice Note for Follow-up modal
      SalesSuperpowers.initVoiceRecorder('followupNote', 'btnVoiceFollowup', 'voiceStatusPillFollowup');
    });
  </script>
</body>
</html>
