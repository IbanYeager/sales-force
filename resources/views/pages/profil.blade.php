<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Profil</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/sidebar_desktop.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
  <style>
      #editProfilModal.modal-overlay {
          align-items: center !important;
          justify-content: center !important;
          padding: 16px !important;
          display: flex !important;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.25s ease, visibility 0.25s ease;
      }
      #editProfilModal.modal-overlay.show {
          opacity: 1 !important;
          visibility: visible !important;
      }
      #editProfilModal .modal-content.edit-profil-modal-box {
          transform: scale(0.95) !important;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
          max-width: 480px !important;
          width: 100% !important;
          max-height: 88vh !important;
          background: #ffffff !important;
          border-radius: 20px !important;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4) !important;
          display: flex !important;
          flex-direction: column !important;
          overflow: hidden !important;
          margin: auto !important;
      }
      #editProfilModal.modal-overlay.show .modal-content.edit-profil-modal-box {
          transform: scale(1) !important;
      }
  </style>
</head>

<body>

    <div class="mobile-app" style="padding-bottom: 110px;">
        <header class="header-page">
            <h2>Profil</h2>
        </header>

        <div class="container" style="margin-top: 10px;">
            <div id="profilContentLoggedOut" style="display:none;">
                <div class="card" style="padding: 18px;">
                    <h3 class="section-title" style="margin-bottom: 10px;">Profil kosong</h3>
                    <p style="font-size: 12px; color: var(--text-muted); line-height: 1.6; margin-bottom: 14px;">Untuk
                        melihat data profil Sales, silakan login terlebih dahulu.</p>
                    <button class="btn-main" style="background: var(--primary-blue); justify-content: center;"
                        onclick="window.location.href='login.html'">
                        <i class="fa-solid fa-right-to-bracket" style="margin-right: 10px;"></i> Login dulu
                    </button>
                </div>
            </div>

            <div id="profilContentLoggedIn" style="display:none;">
                <div class="card" style="padding: 18px;">
                    <div style="display:flex; align-items:center; gap:16px;">
                        <div style="position:relative;">
                            <img src="" alt="Profile" class="avatar"
                                style="width:74px;height:74px;border-radius:50%;border:3px solid var(--primary-red);background:#fff;object-fit:cover;">
                            <div class="status-dot"
                                style="width:16px;height:16px;right:6px;bottom:6px;position:absolute;"></div>
                        </div>
                        <div>
                            <h3 id="namaSalesEl" style="color:var(--text-dark);font-size:18px;margin-bottom:4px;">
                                Memuat...</h3>
                            <p id="peranSalesEl"
                                style="font-size:12px;color:var(--text-muted);font-weight:600;margin-bottom:8px;">
                                Memuat...</p>
                            <div style="display:flex;gap:10px;flex-wrap:wrap;">
                                <span
                                    style="font-size:11px;font-weight:700;color:var(--primary-blue);background:#eef3fb;border:1px solid #dbe6ff;padding:6px 10px;border-radius:999px;">
                                    <i class="fa-solid fa-location-dot" style="margin-right:6px;"></i><span
                                        id="cabangSalesText">Kiara Condong</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <h3 class="section-title" style="margin-top:18px;">Informasi</h3>
                <div class="card" style="padding:0; overflow:hidden;">
                    <div
                        style="padding:14px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">Nama</span>
                        <span id="infoNama"
                            style="font-size:12px;color:var(--text-dark);font-weight:700;">Memuat...</span>
                    </div>
                    <div
                        style="padding:14px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">Jabatan</span>
                        <span id="infoJabatan"
                            style="font-size:12px;color:var(--text-dark);font-weight:700;">Memuat...</span>
                    </div>
                    <div
                        style="padding:14px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">SPV</span>
                        <span id="infoSpv"
                            style="font-size:12px;color:var(--text-dark);font-weight:700;">Memuat...</span>
                    </div>
                    <div style="padding:14px 18px;border-bottom:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">WhatsApp / No HP</span>
                        <span id="infoNoHp" style="font-size:12px;color:var(--text-dark);font-weight:700;">-</span>
                    </div>
                    <div style="padding:14px 18px;display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:12px;color:var(--text-muted);font-weight:700;">Cabang</span>
                        <span id="infoCabang" style="font-size:12px;color:var(--text-dark);font-weight:700;">Kiara Condong</span>
                    </div>
                </div>

                <h3 class="section-title" style="margin-top:18px; display:flex; align-items:center; justify-content:space-between;">
                    <span>Media Sosial & Link Promosi</span>
                    <span style="font-size:10px; font-weight:600; background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px;">Auto-Share WA</span>
                </h3>
                <div class="card" style="padding:14px 18px;">
                    <p style="font-size:11.5px; color:var(--text-muted); margin-bottom:12px; line-height:1.4;">Link akun sosmed di bawah ini akan otomatis disisipkan saat Anda membagikan promo, brosur, pricelist, dan simulasi kredit ke calon konsumen.</p>
                    <div id="socialLinksContainer" style="display:flex; flex-direction:column; gap:8px;">
                        <div id="badgeIg" style="display:none; align-items:center; gap:8px; padding:8px 12px; background:#fdf2f8; border:1px solid #fbcfe8; border-radius:10px; font-size:12px; color:#be185d;">
                            <i class="fa-brands fa-instagram" style="font-size:15px;"></i>
                            <span id="txtIg" style="font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">-</span>
                        </div>
                        <div id="badgeTt" style="display:none; align-items:center; gap:8px; padding:8px 12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; font-size:12px; color:#0f172a;">
                            <i class="fa-brands fa-tiktok" style="font-size:14px;"></i>
                            <span id="txtTt" style="font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">-</span>
                        </div>
                        <div id="badgeFb" style="display:none; align-items:center; gap:8px; padding:8px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:10px; font-size:12px; color:#1d4ed8;">
                            <i class="fa-brands fa-facebook" style="font-size:14px;"></i>
                            <span id="txtFb" style="font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">-</span>
                        </div>
                        <div id="badgeWeb" style="display:none; align-items:center; gap:8px; padding:8px 12px; background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; font-size:12px; color:#15803d;">
                            <i class="fa-solid fa-globe" style="font-size:14px;"></i>
                            <span id="txtWeb" style="font-weight:700; flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">-</span>
                        </div>
                        <div id="badgeEmptySosmed" style="text-align:center; padding:12px; font-size:11.5px; color:#94a3b8; border:1px dashed #cbd5e1; border-radius:10px;">
                            <i class="fa-solid fa-link" style="margin-right:4px;"></i> Belum ada link sosmed. Klik <strong>Edit Profil</strong> untuk menambahkan.
                        </div>
                    </div>
                </div>

                <h3 class="section-title" style="margin-top:18px;">Pengaturan</h3>
                <div class="card" style="padding:14px 18px;">
                    <button class="btn-main" style="width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; margin-bottom: 10px; background: var(--primary-blue);" onclick="openEditProfilModal()">
                        <i class="fa-solid fa-user-pen"></i> Edit Profil & Link Sosmed
                    </button>
                    <button class="btn-outline-blue"
                        style="border-color:var(--primary-red);color:var(--primary-red); width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px;"
                        onclick="logoutUser()">
                        <i class="fa-solid fa-right-from-bracket"></i> Keluar
                    </button>
                </div>
            </div>
        </div>

        <nav class="bottom-nav">
            <a href="../index.html" class="nav-item"><i class="fa-solid fa-house"></i><span class="nav-text">Home</span></a>
            <a href="pricelist.html" class="nav-item"><i class="fa-solid fa-clipboard-list"></i><span class="nav-text">Harga</span></a>
            <a href="input.html" class="nav-item center-btn">
                <div class="center-btn-inner">
                    <i class="fa-solid fa-camera"></i>
                </div>
            </a>
            <a href="testdrive.html" class="nav-item"><i class="fa-solid fa-car-side"></i><span class="nav-text">Tes Drive</span></a>
            <a href="profil.html" class="nav-item active"><i class="fa-solid fa-user"></i><span class="nav-text">Profil</span></a>
        </nav>
    </div>

    <!-- Edit Profil Modal -->
    <div class="modal-overlay" id="editProfilModal" style="z-index: 10000; align-items: center; justify-content: center; padding: 16px;" onclick="if(event.target===this) closeEditProfilModal()">
        <div class="modal-content edit-profil-modal-box" style="padding: 0; overflow: hidden; background: #ffffff; display: flex; flex-direction: column; max-height: 90vh; max-width: 500px; width: 100%; border-radius: 20px; box-shadow: 0 25px 60px rgba(0,0,0,0.35); transform: none; position: relative; margin: auto;">
            
            <!-- Compact Header Banner -->
            <div style="position: relative; background: linear-gradient(135deg, #c8102e 0%, #99001c 100%); padding: 18px 20px 14px; text-align: center; color: white; flex-shrink: 0;">
                <button type="button" onclick="closeEditProfilModal()" style="position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,0.2); border-radius: 50%; border: none; width: 32px; height: 32px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;" title="Tutup">
                    <i class="fa-solid fa-xmark"></i>
                </button>

                <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 8px;">
                    <div style="position: relative; width: 64px; height: 64px; flex-shrink: 0;">
                        <img id="editProfilPreview" src="" alt="Avatar" style="width: 64px; height: 64px; border-radius: 50%; border: 2.5px solid white; object-fit: cover; background: white; box-shadow: 0 4px 10px rgba(0,0,0,0.25);">
                        <button onclick="openPhotoChoiceModal()" type="button" style="position: absolute; bottom: -2px; right: -2px; width: 24px; height: 24px; border-radius: 50%; background: #ffffff; color: var(--primary-red); border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 11px;" title="Ganti Foto">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <div style="text-align: left;">
                        <h3 style="margin: 0; font-size: 17px; font-weight: 800; color: #ffffff; letter-spacing: -0.2px;">Edit Profil Sales</h3>
                        <p style="margin: 2px 0 0; font-size: 11.5px; opacity: 0.9; color: #fecdd3;">Perbarui data akun & link media sosial promosi</p>
                    </div>
                </div>

                <!-- Navigation Tabs (Pills) -->
                <div style="display: flex; gap: 6px; background: rgba(0,0,0,0.2); padding: 4px; border-radius: 12px; margin-top: 10px;">
                    <button type="button" id="tabBtnAkun" class="tab-modal-nav active" onclick="switchModalTab('akun')" style="flex: 1; padding: 7px 10px; border: none; border-radius: 9px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease; background: #ffffff; color: var(--primary-red); box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
                        <i class="fa-solid fa-id-card"></i> Data Pribadi & Akun
                    </button>
                    <button type="button" id="tabBtnSosmed" class="tab-modal-nav" onclick="switchModalTab('sosmed')" style="flex: 1; padding: 7px 10px; border: none; border-radius: 9px; font-size: 11.5px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s ease; background: transparent; color: #ffffff;">
                        <i class="fa-solid fa-share-nodes"></i> Media Sosial
                    </button>
                </div>
            </div>
            
            <!-- Scrollable Body with Clean Layout -->
            <div style="flex: 1; overflow-y: auto; padding: 20px; background: #ffffff; min-height: 0;">
                
                <!-- TAB 1: DATA AKUN -->
                <div id="modalPaneAkun" style="display: flex; flex-direction: column; gap: 14px;">
                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px; display: block;">
                            <i class="fa-solid fa-user" style="color: var(--primary-red); margin-right: 4px;"></i> Nama Lengkap
                        </label>
                        <input type="text" id="editNama" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #0f172a;" placeholder="Nama Lengkap Wiraniaga">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px; display: block;">
                                <i class="fa-solid fa-at" style="color: var(--primary-blue); margin-right: 4px;"></i> Username
                            </label>
                            <input type="text" id="editUsername" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a;" placeholder="Username login">
                        </div>
                        <div class="form-group">
                            <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px; display: block;">
                                <i class="fa-solid fa-lock" style="color: #64748b; margin-right: 4px;"></i> Password Baru
                            </label>
                            <input type="password" id="editPassword" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a;" placeholder="Kosongkan jika tdk ubah">
                        </div>
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px; display: block;">
                            <i class="fa-brands fa-whatsapp" style="color: #10b981; margin-right: 4px;"></i> Nomor WhatsApp / HP Konsultasi
                        </label>
                        <input type="text" id="editNoHp" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; font-weight: 600; color: #0f172a;" placeholder="Cth: 08123456789 atau 628123456789">
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 6px; display: block;">
                            <i class="fa-solid fa-envelope" style="color: #0284c7; margin-right: 4px;"></i> Email Official
                        </label>
                        <input type="email" id="editEmail" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a;" placeholder="Cth: nama@tunastoyota.co.id">
                    </div>
                </div>

                <!-- TAB 2: DATA SOSMED -->
                <div id="modalPaneSosmed" style="display: none; flex-direction: column; gap: 14px;">
                    <div style="background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 10px 14px; display: flex; align-items: flex-start; gap: 10px;">
                        <i class="fa-solid fa-circle-info" style="color: #0284c7; font-size: 15px; margin-top: 2px;"></i>
                        <p style="margin: 0; font-size: 11.5px; color: #0369a1; line-height: 1.45;">
                            Tautan sosmed yang Anda isi di bawah akan <strong>otomatis disisipkan</strong> saat Anda share Promo, Brosur PDF, Pricelist OTR, Quotation, Kalkulator Kredit, dan Trade-In!
                        </p>
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #be185d; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-brands fa-instagram" style="font-size: 14px;"></i> Instagram (Username / URL)
                        </label>
                        <input type="text" id="editInstagram" class="form-control" style="width: 100%; border: 1.5px solid #fbcfe8; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a; background: #fffdfd;" placeholder="Cth: @namasales atau https://instagram.com/namasales">
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-brands fa-tiktok" style="font-size: 13px;"></i> TikTok (Username / URL)
                        </label>
                        <input type="text" id="editTiktok" class="form-control" style="width: 100%; border: 1.5px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a; background: #fafafa;" placeholder="Cth: @namasales atau https://tiktok.com/@namasales">
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #1d4ed8; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-brands fa-facebook" style="font-size: 13px;"></i> Facebook (Username / URL)
                        </label>
                        <input type="text" id="editFacebook" class="form-control" style="width: 100%; border: 1.5px solid #bfdbfe; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a; background: #fcfdfe;" placeholder="Cth: https://facebook.com/namasales">
                    </div>

                    <div class="form-group">
                        <label style="font-size: 11px; font-weight: 800; color: #15803d; text-transform: uppercase; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
                            <i class="fa-solid fa-globe" style="font-size: 13px;"></i> Website / Linktree / Bio Link
                        </label>
                        <input type="text" id="editWebsite" class="form-control" style="width: 100%; border: 1.5px solid #bbf7d0; border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #0f172a; background: #fdfefe;" placeholder="Cth: https://linktr.ee/namasales">
                    </div>
                </div>

            </div>

            <!-- Sticky Fixed Footer -->
            <div style="padding: 14px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; flex-shrink: 0; border-radius: 0 0 20px 20px;">
                <button type="button" class="btn-outline-blue" style="flex: 1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 13px; border: 1.5px solid #cbd5e1; background: white; color: #475569; cursor: pointer;" onclick="closeEditProfilModal()">
                    Batal
                </button>
                <button type="button" class="btn-main" style="flex: 2; padding: 12px; border-radius: 12px; display: flex; justify-content: center; align-items: center; gap: 8px; font-weight: 800; font-size: 13px; background: linear-gradient(135deg, #c8102e 0%, #99001c 100%); color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(200,16,46,0.3);" onclick="saveProfil()" id="btnSaveProfil">
                    <i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan
                </button>
            </div>

        </div>
    </div>
    
    <!-- Photo Choice Modal -->
    <div class="modal-overlay" id="photoChoiceModal" style="z-index: 10001;" onclick="closePhotoChoiceModal()">
        <div class="modal-content" onclick="event.stopPropagation()">
            <div class="modal-header">
                <h3>Pilih Foto</h3>
                <button class="btn-close-modal" onclick="closePhotoChoiceModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <button class="btn-main" style="justify-content: center;" onclick="triggerCameraSelect()">
                    <i class="fa-solid fa-camera"></i> Ambil dari Kamera
                </button>
                <button class="btn-main" style="justify-content: center; background:var(--primary-blue);" onclick="triggerGallerySelect()">
                    <i class="fa-regular fa-image"></i> Pilih dari Galeri
                </button>
            </div>
        </div>
    </div>

    <input type="file" id="fileInputGallery" accept="image/*" style="display: none;" onchange="previewPhoto(event)">
    <input type="file" id="fileInputCamera" accept="image/*" capture="user" style="display: none;" onchange="previewPhoto(event)">

    <script src="../js/script.js"></script>
    <script src="../js/sales_signature.js"></script>
    <script>
        let selectedFile = null;

        function switchModalTab(tab) {
            const paneAkun = document.getElementById('modalPaneAkun');
            const paneSosmed = document.getElementById('modalPaneSosmed');
            const btnAkun = document.getElementById('tabBtnAkun');
            const btnSosmed = document.getElementById('tabBtnSosmed');

            if (tab === 'akun') {
                paneAkun.style.display = 'flex';
                paneSosmed.style.display = 'none';
                btnAkun.style.background = '#ffffff';
                btnAkun.style.color = 'var(--primary-red)';
                btnAkun.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                btnSosmed.style.background = 'transparent';
                btnSosmed.style.color = '#ffffff';
                btnSosmed.style.boxShadow = 'none';
            } else {
                paneAkun.style.display = 'none';
                paneSosmed.style.display = 'flex';
                btnSosmed.style.background = '#ffffff';
                btnSosmed.style.color = 'var(--primary-red)';
                btnSosmed.style.boxShadow = '0 2px 6px rgba(0,0,0,0.15)';
                btnAkun.style.background = 'transparent';
                btnAkun.style.color = '#ffffff';
                btnAkun.style.boxShadow = 'none';
            }
        }

        function updateSocialBadges(data) {
            const ig = data.instagram_url || localStorage.getItem('salesInstagram') || '';
            const tt = data.tiktok_url || localStorage.getItem('salesTiktok') || '';
            const fb = data.facebook_url || localStorage.getItem('salesFacebook') || '';
            const web = data.website_url || localStorage.getItem('salesWebsite') || '';

            const badgeIg = document.getElementById('badgeIg');
            const badgeTt = document.getElementById('badgeTt');
            const badgeFb = document.getElementById('badgeFb');
            const badgeWeb = document.getElementById('badgeWeb');
            const emptyEl = document.getElementById('badgeEmptySosmed');

            let hasAny = false;

            if (ig) {
                badgeIg.style.display = 'flex';
                document.getElementById('txtIg').textContent = ig;
                hasAny = true;
            } else {
                badgeIg.style.display = 'none';
            }

            if (tt) {
                badgeTt.style.display = 'flex';
                document.getElementById('txtTt').textContent = tt;
                hasAny = true;
            } else {
                badgeTt.style.display = 'none';
            }

            if (fb) {
                badgeFb.style.display = 'flex';
                document.getElementById('txtFb').textContent = fb;
                hasAny = true;
            } else {
                badgeFb.style.display = 'none';
            }

            if (web) {
                badgeWeb.style.display = 'flex';
                document.getElementById('txtWeb').textContent = web;
                hasAny = true;
            } else {
                badgeWeb.style.display = 'none';
            }

            if (emptyEl) {
                emptyEl.style.display = hasAny ? 'none' : 'block';
            }
        }

        function openEditProfilModal() { 
            const salesId = localStorage.getItem('salesId');
            if(!salesId) return;

            document.getElementById('editProfilModal').classList.add('show'); 
            switchModalTab('akun');
            
            // Fetch data
            fetch(`../api/api_edit_profil.php?sales_id=${salesId}`)
                .then(r => r.json())
                .then(res => {
                    if(res.status === 'success') {
                        const d = res.data;
                        document.getElementById('editNama').value = d.nama_lengkap || '';
                        document.getElementById('editUsername').value = d.username || '';
                        document.getElementById('editNoHp').value = d.no_hp || '';
                        document.getElementById('editEmail').value = d.email || '';
                        document.getElementById('editInstagram').value = d.instagram_url || '';
                        document.getElementById('editTiktok').value = d.tiktok_url || '';
                        document.getElementById('editFacebook').value = d.facebook_url || '';
                        document.getElementById('editWebsite').value = d.website_url || '';
                        document.getElementById('editPassword').value = '';
                        
                        let fotoPath = d.foto ? `../${d.foto}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(d.nama_lengkap || 'User')}&background=f4f7f6&color=c8102e`;
                        
                        if (d.foto && d.foto.startsWith('http')) {
                             fotoPath = d.foto;
                        } else if (d.foto && d.foto.startsWith('../')) {
                             fotoPath = d.foto;
                        }

                        document.getElementById('editProfilPreview').src = fotoPath;
                        selectedFile = null;

                        updateSocialBadges(d);
                    }
                })
                .catch(err => console.error(err));
        }

        function closeEditProfilModal() { 
            document.getElementById('editProfilModal').classList.remove('show'); 
        }

        function openPhotoChoiceModal() { document.getElementById('photoChoiceModal').classList.add('show'); }
        function closePhotoChoiceModal() { document.getElementById('photoChoiceModal').classList.remove('show'); }

        function triggerGallerySelect() { 
            document.getElementById('fileInputGallery').click(); 
            closePhotoChoiceModal();
        }

        function triggerCameraSelect() { 
            document.getElementById('fileInputCamera').click(); 
            closePhotoChoiceModal();
        }

        function previewPhoto(event) {
            const file = event.target.files[0];
            if (file) {
                selectedFile = file;
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('editProfilPreview').src = e.target.result;
                }
                reader.readAsDataURL(file);
            }
        }

        async function saveProfil() {
            const salesId = localStorage.getItem('salesId');
            if(!salesId) return;

            const nama = document.getElementById('editNama').value.trim();
            const username = document.getElementById('editUsername').value.trim();
            const nohp = document.getElementById('editNoHp').value.trim();
            const email = document.getElementById('editEmail').value.trim();
            const instagram = document.getElementById('editInstagram').value.trim();
            const tiktok = document.getElementById('editTiktok').value.trim();
            const facebook = document.getElementById('editFacebook').value.trim();
            const website = document.getElementById('editWebsite').value.trim();
            const password = document.getElementById('editPassword').value;

            if(!nama || !username) {
                alert('Nama dan Username harus diisi!');
                return;
            }

            const btn = document.getElementById('btnSaveProfil');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

            const formData = new FormData();
            formData.append('sales_id', salesId);
            formData.append('nama_lengkap', nama);
            formData.append('username', username);
            formData.append('no_hp', nohp);
            formData.append('email', email);
            formData.append('instagram_url', instagram);
            formData.append('tiktok_url', tiktok);
            formData.append('facebook_url', facebook);
            formData.append('website_url', website);
            if(password) formData.append('password', password);
            if(selectedFile) formData.append('foto', selectedFile);

            try {
                const res = await fetch('../api/api_edit_profil.php', {
                    method: 'POST',
                    body: formData
                });
                const data = await res.json();
                if(data.status === 'success') {
                    alert('Profil dan link media sosial berhasil diperbarui!');
                    // Update LocalStorage
                    localStorage.setItem('namaSales', data.data.nama_lengkap);
                    if (data.data.no_hp !== undefined) localStorage.setItem('salesNoHp', data.data.no_hp);
                    if (data.data.email !== undefined) localStorage.setItem('salesEmail', data.data.email);
                    if (data.data.instagram_url !== undefined) localStorage.setItem('salesInstagram', data.data.instagram_url);
                    if (data.data.tiktok_url !== undefined) localStorage.setItem('salesTiktok', data.data.tiktok_url);
                    if (data.data.facebook_url !== undefined) localStorage.setItem('salesFacebook', data.data.facebook_url);
                    if (data.data.website_url !== undefined) localStorage.setItem('salesWebsite', data.data.website_url);
                    if (data.data.foto) localStorage.setItem('fotoSales', data.data.foto);

                    closeEditProfilModal();
                    window.location.reload();
                } else {
                    alert('Gagal: ' + data.message);
                }
            } catch(e) {
                console.error(e);
                alert('Terjadi kesalahan koneksi.');
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan';
            }
        }

        (function () {
            const loggedIn = localStorage.getItem('loggedIn') === 'true';
            const inEl = document.getElementById('profilContentLoggedIn');
            const outEl = document.getElementById('profilContentLoggedOut');

            if (!inEl || !outEl) return;

            if (loggedIn) {
                inEl.style.display = 'block';
                outEl.style.display = 'none';

                const namaEl = document.getElementById('namaSalesEl');
                const peranEl = document.getElementById('peranSalesEl');
                const cabangEl = document.getElementById('cabangSalesText');
                const avatarImg = document.querySelector('.avatar');

                const infoNama = document.getElementById('infoNama');
                const infoJabatan = document.getElementById('infoJabatan');
                const infoSpv = document.getElementById('infoSpv');
                const infoNoHp = document.getElementById('infoNoHp');
                const infoCabang = document.getElementById('infoCabang');

                const namaFallback = localStorage.getItem('namaSales') || 'Nama Sales';
                const peranFallback = localStorage.getItem('peranSales') || 'Sales Consultant';
                const spvFallback = localStorage.getItem('spvSales') || '-';
                const noHpFallback = localStorage.getItem('salesNoHp') || '-';
                let fotoFallback = localStorage.getItem('fotoSales');
                
                // Fix broken relative paths stuck in local storage
                if (fotoFallback && (fotoFallback.startsWith('../uploads') || fotoFallback.startsWith('uploads'))) {
                    fotoFallback = ''; // Force fallback avatar
                    localStorage.removeItem('fotoSales');
                }
                
                const cabangLocked = 'Tunas Toyota Kiara Condong';

                if (namaEl) namaEl.textContent = namaFallback;
                if (peranEl) peranEl.textContent = peranFallback;
                if (cabangEl) cabangEl.textContent = cabangLocked;

                if (infoNama) infoNama.textContent = namaFallback;
                if (infoJabatan) infoJabatan.textContent = peranFallback;
                if (infoSpv) infoSpv.textContent = spvFallback;
                if (infoNoHp) infoNoHp.textContent = noHpFallback !== '-' ? noHpFallback : 'Belum diisi';
                if (infoCabang) infoCabang.textContent = cabangLocked;

                if (avatarImg) {
                    if (fotoFallback && fotoFallback.trim() !== '') {
                        avatarImg.src = fotoFallback;
                    } else {
                        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(namaFallback)}&background=f4f7f6&color=c8102e`;
                    }
                }

                // Initial render of social badges from localStorage
                updateSocialBadges({});

                // Auto-fetch profile from database to get fresh social media data
                const salesId = localStorage.getItem('salesId');
                if (salesId) {
                    fetch(`../api/api_edit_profil.php?sales_id=${salesId}`)
                        .then(r => r.json())
                        .then(res => {
                            if (res.status === 'success' && res.data) {
                                const d = res.data;
                                if (d.no_hp && infoNoHp) infoNoHp.textContent = d.no_hp;
                                if (d.instagram_url !== undefined) localStorage.setItem('salesInstagram', d.instagram_url || '');
                                if (d.tiktok_url !== undefined) localStorage.setItem('salesTiktok', d.tiktok_url || '');
                                if (d.facebook_url !== undefined) localStorage.setItem('salesFacebook', d.facebook_url || '');
                                if (d.website_url !== undefined) localStorage.setItem('salesWebsite', d.website_url || '');
                                updateSocialBadges(d);
                            }
                        })
                        .catch(err => console.warn('Could not auto-fetch profil:', err));
                }
            } else {
                inEl.style.display = 'none';
                outEl.style.display = 'block';
            }
        })();

        window.logoutUser = function () {
            localStorage.clear();
            window.location.href = 'login.html';
        };
    </script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
