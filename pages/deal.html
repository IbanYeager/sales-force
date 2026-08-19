<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Buat Deal</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/deal.css">
    <!-- jsPDF UMD build -->
    <script src="../custom_alert.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>

    <div class="mobile-app">
        <!-- Header -->
        <header class="header-page" style="display: flex; align-items: center; justify-content: space-between; padding: 22px 24px 22px 24px;">
            <div style="display:flex; align-items:center; gap:12px;">
                <button onclick="window.history.back()" style="background: rgba(255,255,255,0.2); border:none; width:38px; height:38px; border-radius:50%; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <i class="fa-solid fa-chevron-left"></i>
                </button>
                <h2 style="font-size: 18px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">Buat Deal Konsumen</h2>
            </div>
        </header>

        <div class="container" style="margin-top: 15px; padding-bottom: 40px;">
            <!-- Target Promo Card -->
            <div class="card" style="padding: 16px; margin-bottom: 20px; border-left: 4px solid #10b981; background: #ffffff;">
                <div style="font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Unit Deal</div>
                <h4 id="dealUnitName" style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 2px;">Memuat info unit...</h4>
                <p id="dealPromoScheme" style="font-size: 12px; color: #64748b; margin: 0 0 2px 0;">-</p>
                <p id="dealFinancingDetails" style="font-size: 12px; font-weight: 700; color: #10b981; margin: 0; display: none;">-</p>
            </div>

            <!-- Form -->
            <form id="dealForm" onsubmit="generateDealPdf(event)">
                
                <h3 class="section-title" style="margin-bottom: 12px;">Dokumen Pendukung</h3>
                
                <!-- uploads -->
                <div class="upload-card-grid">
                    
                    <!-- KTP Pemohon -->
                    <div class="upload-box-wrapper">
                        <label>Foto KTP Pemohon <span style="color:red;">*</span></label>
                        <div class="deal-upload-box" onclick="openPhotoChooser(event, 'ktpInput', 'ktpInput_camera')">
                            <input type="file" id="ktpInput" accept="image/*" style="display: none;" onchange="handleFileSelect(this, 'ktpPreview', 'ktpBase64')">
                            <input type="file" id="ktpInput_camera" accept="image/*" capture="environment" style="display: none;" onchange="handleFileSelect(this, 'ktpPreview', 'ktpBase64')">
                            <img id="ktpPreview" class="preview-img" style="display: none;">
                            <div class="preview-overlay"><i class="fa-solid fa-camera"></i> Ganti Foto</div>
                            <div id="ktpUploadInfo" style="text-align: center;">
                                <i class="fa-solid fa-address-card"></i>
                                <div>Ambil / Unggah Foto KTP</div>
                                <span class="sub-text">Format JPG/PNG, Maks 5MB</span>
                            </div>
                            <input type="hidden" id="ktpBase64">
                        </div>
                    </div>

                    <!-- Kartu Keluarga -->
                    <div class="upload-box-wrapper">
                        <label>Foto Kartu Keluarga (KK) <span style="color:red;">*</span></label>
                        <div class="deal-upload-box" onclick="openPhotoChooser(event, 'kkInput', 'kkInput_camera')">
                            <input type="file" id="kkInput" accept="image/*" style="display: none;" onchange="handleFileSelect(this, 'kkPreview', 'kkBase64')">
                            <input type="file" id="kkInput_camera" accept="image/*" capture="environment" style="display: none;" onchange="handleFileSelect(this, 'kkPreview', 'kkBase64')">
                            <img id="kkPreview" class="preview-img" style="display: none;">
                            <div class="preview-overlay"><i class="fa-solid fa-camera"></i> Ganti Foto</div>
                            <div id="kkUploadInfo" style="text-align: center;">
                                <i class="fa-solid fa-users-rectangle"></i>
                                <div>Ambil / Unggah Foto KK</div>
                                <span class="sub-text">Format JPG/PNG, Maks 5MB</span>
                            </div>
                            <input type="hidden" id="kkBase64">
                        </div>
                    </div>

                </div>

                <h3 class="section-title" style="margin-bottom: 12px;">Data Administrasi</h3>

                <!-- Nama Pemohon -->
                <div class="form-group">
                    <label for="namaPemohon">Nama Pemohon <span style="color:red;">*</span></label>
                    <div class="input-group">
                        <i class="fa-solid fa-user" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-light); font-size: 14px; z-index: 10;"></i>
                        <input type="text" id="namaPemohon" class="form-control" style="padding-left: 48px;" placeholder="Nama lengkap sesuai KTP" required>
                    </div>
                </div>

                <!-- Nama STNK -->
                <div class="form-group">
                    <label for="namaStnk">Nama STNK <span style="color:red;">*</span></label>
                    <div class="input-group">
                        <i class="fa-solid fa-id-badge" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text-light); font-size: 14px; z-index: 10;"></i>
                        <input type="text" id="namaStnk" class="form-control" style="padding-left: 48px;" placeholder="Nama lengkap di STNK" required>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" id="submitBtn" class="btn-main" style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2); justify-content: center; margin-top: 20px;">
                    <i class="fa-solid fa-file-pdf"></i> Submit & Unduh PDF
                </button>

            </form>
        </div>
    </div>

    <!-- Success Screen Overlay -->
    <div id="successOverlay" class="success-overlay" onclick="closeSuccessOverlay()">
        <div class="success-card" onclick="event.stopPropagation()">
            <div class="success-icon-circle">
                <i class="fa-solid fa-check"></i>
            </div>
            <h3>Deal Berhasil Dibuat!</h3>
            <p>File PDF berhasil digenerate dan diunduh ke perangkat Anda dengan nama file sesuai nama Pemohon dan STNK.</p>
            <button onclick="goToPromoPage()" class="btn-main" style="background: var(--primary-blue); justify-content: center;">
                Kembali ke Promo
            </button>
        </div>
    </div>

    <script src="../js/deal.js"></script>


  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>


