<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Promo & Paket</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/promo.css">
  <script src="../js/sidebar_desktop.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app promo-page">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Promo & Paket</h2>
    </header>

    <div class="container" style="margin-top: 0;">
      <div class="promo-toolbar">
        <div style="display: flex; gap: 8px; margin-bottom: 12px; width: 100%;">
          <!-- Searchable Dropdown for Unit -->
          <div class="custom-select-container" id="unitSelectContainer">
            <div class="custom-select-trigger" onclick="toggleUnitDropdown(event)">
              <span id="selected-unit-label">Pilih Unit (Semua)</span>
              <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="custom-select-dropdown" id="unitDropdown">
              <div class="dropdown-search-wrap" onclick="event.stopPropagation()">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="dropdown-search-input" class="dropdown-search-input" placeholder="Cari unit..."
                  oninput="filterDropdownOptions(this.value)">
              </div>
              <div class="dropdown-options-list" id="unit-options-list">
                <!-- Options populated dynamically -->
              </div>
            </div>
          </div>

          <!-- Dropdown for Paket -->
          <select id="filter-paket" class="promo-filter-select"
            style="max-width: 140px; font-size: 10px; font-weight: 700; border-radius: 12px; border: 1.5px solid var(--border-color, #dee2e6);">
            <option value="">Semua Paket</option>
          </select>
        </div>
      </div>

      <div class="promo-section-header">
        <h3 class="section-title">Daftar Harga & Cicilan</h3>
        <span id="total-data" class="promo-total">- mobil ditemukan</span>
      </div>

      <div class="promo-scroll" id="promo-container">
        <div class="promo-loading">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat data promo...
        </div>
      </div>
    </div>
  </div>

  <div id="customPromoModal" class="promo-modal-overlay" onclick="tutupModal()">
    <div class="modal-center-box" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h4 class="modal-title" id="modalCarTitle">Detail Penawaran</h4>
        <button type="button" class="modal-close" onclick="tutupModal()" aria-label="Tutup">&times;</button>
      </div>

      <div class="modal-body">
        <img id="modalPromoImg" src="" alt="Foto Promo Mobil" class="modal-promo-img" />

        <div class="promo-modal-skema">
          <span>Skema Pembiayaan:</span>
          <strong id="modalSkemaBadge"></strong>
        </div>

        <div class="promo-modal-simulasi-title">Simulasi Kredit Lengkap:</div>
        <div id="modalTenorContainer"></div>
      </div>

      <div class="modal-footer" style="display: flex; gap: 8px;">
        <button type="button" class="btn-modal-wa" onclick="sharePromoWA(event)"
          style="background: linear-gradient(135deg, #25D366 0%, #128C7E 100%); flex: 1;">
          <i class="fa-brands fa-whatsapp" style="font-size: 17px;"></i> Bagi ke WA
        </button>
        <button type="button" id="modalDealBtn" class="btn-modal-wa"
          style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); flex: 1.5;">
          <i class="fa-solid fa-handshake" style="font-size: 17px;"></i> Deal Konsumen
        </button>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/sales_signature.js"></script>
  <script src="../js/promo.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

