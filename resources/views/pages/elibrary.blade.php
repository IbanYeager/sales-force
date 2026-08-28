<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - E-Library</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/animations-premium.css">
  <script src="../js/sidebar_desktop.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px; margin: 0 auto; min-height: 100vh; background: #f8fafc;">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>E-Library (Product Knowledge)</h2>
    </header>

    <div class="container" style="margin-top:18px;">

      <!-- LIBRARY CONTENT -->
      <div id="contentLibrary">
        <div class="form-group" style="margin-bottom:12px;">
          <input class="form-control" type="text" id="searchInput" placeholder="Cari mobil (misal: Innova)..."
            oninput="renderLibrary()" />
        </div>

        <!-- CATEGORY FILTER CHIPS -->
        <div id="categoryFilters"
          style="display:flex; overflow-x:auto; gap:8px; padding-bottom:10px; margin-bottom:10px; scrollbar-width:none; -ms-overflow-style:none;">
          <style>
            #categoryFilters::-webkit-scrollbar {
              display: none;
            }

            .cat-btn {
              padding: 6px 14px;
              border-radius: 20px;
              background: #fff;
              border: 1px solid var(--border-color);
              font-size: 12px;
              font-weight: 600;
              color: var(--text-muted);
              cursor: pointer;
              white-space: nowrap;
              transition: all 0.2s;
              box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            }

            .cat-btn.active {
              background: var(--primary-red);
              color: #fff;
              border-color: var(--primary-red);
              box-shadow: 0 4px 10px rgba(212, 22, 60, 0.3);
            }
          </style>
          <button class="cat-btn active" onclick="filterCategory('All', this)">Semua</button>
          <button class="cat-btn" onclick="filterCategory('MPV', this)">MPV</button>
          <button class="cat-btn" onclick="filterCategory('SUV', this)">SUV</button>
          <button class="cat-btn" onclick="filterCategory('Hatchback', this)">Hatchback</button>
          <button class="cat-btn" onclick="filterCategory('Sedan', this)">Sedan</button>
          <button class="cat-btn" onclick="filterCategory('Commercial', this)">Commercial</button>
        </div>

        <div id="libGrid" style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
          <!-- Rendered via elibrary.js -->
        </div>
      </div>

    </div>
  </div>

  <style>
    /* Premium Glassmorphism UI for E-Library */
    .mobile-app {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    }

    .segment-control-container {
      display: flex;
      background: #e2e8f0;
      padding: 4px;
      border-radius: 14px;
      margin-bottom: 22px;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
    }

    .tab-btn {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: none;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      background: transparent;
      color: var(--text-muted);
    }

    .tab-btn.active {
      background: #ffffff;
      color: var(--primary-blue);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .glass-card {
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.5);
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
    }

    .spec-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 12px;
      margin-bottom: 8px;
      border: 1px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
      transition: transform 0.2s;
    }

    .spec-row:active {
      transform: scale(0.98);
    }

    .spec-icon {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-blue), #003d99);
      color: white;
      border-radius: 8px;
      font-size: 12px;
      margin-right: 12px;
      box-shadow: 0 4px 10px rgba(0, 82, 204, 0.2);
    }

    .feature-badge {
      display: inline-block;
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.05));
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.2);
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      margin: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }

    .car-img-wrapper {
      position: relative;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, rgba(0, 82, 204, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
      border-radius: 50%;
    }

    .car-img-wrapper img {
      max-height: 100%;
      max-width: 95%;
      object-fit: contain;
      filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.2));
      transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .car-img-wrapper img:hover {
      transform: scale(1.1) translateY(-5px);
    }

    .modal-box.glass-modal {
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.6);
      box-shadow: 0 24px 48px rgba(0, 0, 0, 0.15);
      max-height: 85vh;
      overflow-y: auto;
      border-radius: 24px;
    }

    /* Scrollbar styling for the modal */
    .modal-box.glass-modal::-webkit-scrollbar {
      width: 6px;
    }

    .modal-box.glass-modal::-webkit-scrollbar-track {
      background: transparent;
    }

    .modal-box.glass-modal::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 10px;
    }

    .modal-box.glass-modal::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25);
    }

    #modalSpek {
      align-items: center;
      /* override flex-end so it centers on desktop/mobile */
      padding: 16px;
    }
  </style>

  <!-- Modal Spek -->
  <div class="modal-overlay" id="modalSpek" onclick="if(event.target === this) this.classList.remove('show')">
    <div class="modal-box glass-modal" style="text-align:center; padding: 24px 20px; width: 90%; max-width: 360px;">
      <h3 class="modal-title" id="spekTitle"
        style="font-size:22px; font-weight:900; background:linear-gradient(90deg, var(--primary-blue), #003d99); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom:4px;">
        Spek Mobil</h3>

      <div class="car-img-wrapper" style="height: 140px; margin-top:10px; margin-bottom: 10px;">
        <img id="spekImg" src="" alt="Spek">
      </div>

      <!-- Color Selector (NEW) -->
      <div id="colorSelectorContainer" style="margin-bottom: 20px; display: none;">
        <label
          style="display:block; text-align:center; font-size:12px; font-weight:800; color:var(--text-muted); margin-bottom:6px;">PILIHAN
          WARNA: <span id="selectedColorName" style="color:var(--primary-red); font-weight:900;"></span></label>
        <div id="colorOptions"
          style="display:flex; justify-content:center; flex-wrap:wrap; gap:10px; padding:4px 4px 10px 4px;">
          <!-- Color dots injected by JS -->
        </div>
      </div>

      <!-- Variant Selector -->
      <div style="margin-bottom: 20px;">
        <label for="variantSelector"
          style="display:block; text-align:left; font-size:12px; font-weight:800; color:var(--text-muted); margin-bottom:6px; margin-left:4px;">PILIH
          TIPE KENDARAAN</label>
        <select id="variantSelector" class="form-control"
          style="font-weight:700; color:var(--primary-blue); font-size:13px; border-radius:12px; padding:12px; box-shadow:0 4px 10px rgba(0,0,0,0.03);"
          onchange="handleVariantChange(this.value)">
          <!-- Options injected by JS -->
        </select>
      </div>

      <!-- Prominent Price Display -->
      <div style="display:flex; flex-direction:column; gap:12px; margin-bottom: 20px;">
        <div
          style="text-align:left; background: linear-gradient(135deg, rgba(212,22,60,0.08), rgba(212,22,60,0.02)); border: 1px solid rgba(212,22,60,0.2); border-radius: 16px; padding: 14px; box-shadow: 0 4px 15px rgba(212,22,60,0.05);">
          <span
            style="display:block; font-size:10px; font-weight:800; color:var(--primary-red); letter-spacing:1px; margin-bottom:8px;">HARGA
            OTR</span>
          <div id="spekPrice"
            style="font-size:15px; font-weight:900; color:var(--primary-red); display:flex; flex-direction:column; gap:8px;">
            Rp 0</div>
        </div>
        <div
          style="text-align:left; background: linear-gradient(135deg, rgba(0,82,204,0.08), rgba(0,82,204,0.02)); border: 1px solid rgba(0,82,204,0.2); border-radius: 16px; padding: 14px; box-shadow: 0 4px 15px rgba(0,82,204,0.05);">
          <span
            style="display:block; font-size:10px; font-weight:800; color:var(--primary-blue); letter-spacing:1px; margin-bottom:8px;">KODE
            TIPE</span>
          <div id="spekKodeTipe"
            style="font-size:14px; font-weight:900; color:var(--primary-blue); display:flex; flex-direction:column; gap:8px;">
            -</div>
        </div>
      </div>

      <div style="display:flex; flex-direction:column; text-align:left; margin-bottom:20px;">
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-users"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Kapasitas Kursi</span>
          </div>
          <strong id="spekKursi" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gas-pump"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Bahan Bakar</span>
          </div>
          <strong id="spekFuel" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gauge-high"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Kapasitas Mesin</span>
          </div>
          <strong id="spekEngine" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-gear"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Transmisi</span>
          </div>
          <strong id="spekTransmisi" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>
        <div class="spec-row">
          <div style="display:flex; align-items:center;">
            <div class="spec-icon"><i class="fa-solid fa-car"></i></div>
            <span style="color:var(--text-muted); font-size:12px; font-weight:600;">Penggerak</span>
          </div>
          <strong id="spekPenggerak" style="font-size:13px; color:var(--text-dark);"></strong>
        </div>

        <div style="margin-top:16px; text-align:center;">
          <span
            style="color:var(--text-muted); font-size:10px; display:block; margin-bottom:8px; font-weight:800; letter-spacing:1px;">FITUR
            UNGGULAN</span>
          <div id="spekFitur" style="display:flex; flex-wrap:wrap; justify-content:center;"></div>
        </div>
      </div>

      <!-- Action Buttons: WhatsApp Share & Copy -->
      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:12px;">
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:13px 16px; border-radius:14px; background:linear-gradient(135deg, #25D366 0%, #15803d 100%); color:#ffffff; font-weight:800; font-size:13.5px; box-shadow: 0 6px 20px rgba(37,211,102,0.35); border:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:transform 0.2s;"
          onclick="shareCarToWhatsApp()">
          <i class="fa-brands fa-whatsapp" style="font-size:19px;"></i> Bagikan Info Lengkap ke WA
        </button>
        <button type="button" class="btn-main"
          style="width:100%; justify-content:center; padding:10px 14px; border-radius:12px; background:rgba(255,255,255,0.9); color:#0f172a; font-weight:700; font-size:12px; border:1.5px solid #cbd5e1; cursor:pointer; display:flex; align-items:center; gap:6px;"
          onclick="copyCarSpecsToClipboard()">
          <i class="fa-solid fa-copy" style="color:#2563eb;"></i> Salin Format Teks
        </button>
      </div>

      <button class="btn-main"
        style="width:100%; justify-content:center; padding:12px; border-radius:12px; background:#64748b; color:#ffffff; font-weight:700; font-size:12px; border:none; cursor:pointer;"
        onclick="document.getElementById('modalSpek').classList.remove('show')">
        Tutup Detail
      </button>
    </div>
  </div>
  <script src="../js/elibrary_data.js?v=4"></script>
  <script src="../js/elibrary.js?v=4"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
