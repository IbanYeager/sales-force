<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Test Drive</title>
    <meta name="description" content="Pilih unit test drive dan buat pengajuan ke SPV">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/testdrive.css">
    <script src="../js/sidebar_desktop.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="mobile-app" style="padding-bottom: 110px;">
        <header class="header-page">
            <h2>Test Drive</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Selected unit banner -->
            <div class="selected-banner" id="selectedBanner">
                <div class="selected-banner-icon"><i class="fa-solid fa-car"></i></div>
                <div class="selected-banner-text">
                    <p>Unit Dipilih</p>
                    <h4 id="selectedUnitName">—</h4>
                </div>
                <button onclick="openModal()" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.2);color:white;padding:8px 14px;border-radius:10px;font-size:11px;font-weight:800;cursor:pointer;white-space:nowrap;">
                    Ajukan <i class="fa-solid fa-arrow-right"></i>
                </button>
            </div>

            <!-- Tab Toggles (Optional UI split) -->
            <div style="display:flex; gap:10px; margin-bottom:16px;">
                <button class="btn-main" style="flex:1; margin:0; padding:10px; font-size:12px; background:var(--primary-blue); color:white; border:none;" onclick="switchTab('units')" id="btnTabUnit">Unit Tersedia</button>
                <button class="btn-main" style="flex:1; margin:0; padding:10px; font-size:12px; background:white; color:var(--text-muted); border:1px solid var(--border-color);" onclick="switchTab('history')" id="btnTabHist">Riwayat Saya</button>
            </div>

            <div id="viewUnits">
                <!-- Unit cards rendered here -->
                <div id="unitList"><p style="text-align:center; color:var(--text-muted); font-size:12px;">Memuat unit test drive...</p></div>
            </div>

            <div id="viewHistory" style="display:none;">
                <div style="margin-bottom: 12px; position:relative;">
                    <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:12px; color:var(--text-muted); font-size:12px;"></i>
                    <input type="text" id="searchTd" class="form-control" style="padding-left:32px; font-size:12px;" placeholder="Cari nama customer / mobil..." onkeyup="filterTdList()">
                </div>
                <div id="tdContainer">
                    <p style="text-align:center; color:var(--text-muted); font-size:12px;">Memuat riwayat...</p>
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
    <a href="testdrive.html" class="nav-item active"><i class="fa-solid fa-car-side"></i><span class="nav-text">Tes Drive</span></a>
    <a href="profil.html" class="nav-item"><i class="fa-solid fa-user"></i><span class="nav-text">Profil</span></a>
</nav>
    </div>

    <!-- Modal Input -->
    <div class="modal-overlay" id="inputModal" onclick="if(event.target===this) closeModal()">
        <div class="modal-sheet">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
                <h3 style="margin:0; font-size:15px; font-weight:900; color:var(--text-dark); text-transform:uppercase;">Pengajuan Test Drive</h3>
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
                    <textarea class="form-control" id="inputRute" rows="2" placeholder="Contoh: Showroom - Jl. Sudirman - Showroom" required></textarea>
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

    <script src="../custom_alert.js"></script>
    <script src="../js/testdrive.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>
</html>

