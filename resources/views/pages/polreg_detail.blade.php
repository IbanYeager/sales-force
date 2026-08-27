<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Detail Polreg</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/polreg_detail.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="polreg.html" id="btnBackPolreg"><i class="fa-solid fa-arrow-left"></i></a>
      <h2 id="pageTitle">Detail Wilayah</h2>
    </header>

    <div class="container" style="margin-top: 0; padding-bottom: 30px;">

      <div class="card"
        style="padding: 16px; margin-bottom: 16px; background: linear-gradient(135deg, #0056b3, #003a79); color: white;">
        <h3 id="displayKecamatan" style="margin: 0 0 4px 0; font-size: 17px;">Kecamatan...</h3>
        <p style="margin: 0; font-size: 11px; opacity: 0.9;">Analisis data registrasi mobil tahun <b
            id="displayTahun">...</b></p>
      </div>

      <div class="section-header-row" style="margin-bottom: 10px;">
        <h3 class="section-title" style="margin-bottom:0;">Filter Merk</h3>
        <span style="font-size: 11px; color: var(--text-muted);" id="countmerk">0 merk</span>
      </div>

      <div class="merk-dropdown-wrapper">
        <img id="merkLogoPreview" class="merk-logo-preview" src="../image/merk_icons/trophy.png" alt=""
          onerror="this.style.display='none'">
        <select id="merkSelect" class="merk-dropdown" onchange="selectKategoriFromDropdown(this.value)">
          <option value="Teratas">⭐ Semua Merk - Teratas</option>
        </select>
        <i class="fa-solid fa-chevron-down chevron-icon"></i>
      </div>

      <div class="search-container">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="searchType" class="search-input" placeholder="Cari type mobil (misal: Avanza)...">
        </div>
      </div>

      <!-- Tab View -->
      <div style="display: flex; gap: 10px; margin-bottom: 16px;">
        <button id="btnViewList" onclick="switchView('list')" style="flex: 1; padding: 10px; border: none; border-radius: 8px; background: var(--primary-red); color: white; font-weight: bold; cursor: pointer;">
          <i class="fa-solid fa-list"></i> Data List
        </button>
        <button id="btnViewMap" onclick="switchView('map')" style="flex: 1; padding: 10px; border: none; border-radius: 8px; background: #e2e8f0; color: #475569; font-weight: bold; cursor: pointer;">
          <i class="fa-solid fa-map-location-dot"></i> Peta Lokasi
        </button>
      </div>

      <div class="section-header-row" style="margin-bottom: 10px;" id="headerList">
        <h3 class="section-title" style="margin-bottom:0;" id="listTitle">Semua Type Kendaraan</h3>
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 11px; color: var(--text-muted);">Urutkan:</span>
          <select id="sortSelect" onchange="changeSortOrder(this.value)" style="font-size: 11px; color: #334155; font-weight: 600; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; padding: 4px 8px; cursor: pointer; outline: none;">
            <option value="desc">⬇️ Terbanyak</option>
            <option value="asc">⬆️ Paling Sedikit</option>
            <option value="alpha">🔤 Sesuai Abjad (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="detail-container" id="viewList">
        <div id="loadingIndicator" style="text-align:center; padding: 20px; color:#777;">
          <i class="fa-solid fa-spinner fa-spin"></i> Memuat data...
        </div>
        <div class="car-rank-list" id="carList"></div>
      </div>

      <div class="detail-container" id="viewMap" style="display: none;">
        <div id="loadingMap" style="text-align:center; padding: 12px; color:#777; font-size:12px; font-weight:bold; display:none;">
          <i class="fa-solid fa-spinner fa-spin"></i> <span id="loadingMapText">Memuat peta dan mencari koordinat...</span>
        </div>
        <div id="mapPolreg" style="height: 450px; width: 100%; border-radius: 12px; z-index: 1;"></div>
        
        <!-- Legenda Peta -->
        <div id="mapLegend" style="margin-top: 12px; padding: 12px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; display: none;">
           <h4 style="margin: 0 0 10px 0; font-size: 12px; color: #475569;"><i class="fa-solid fa-map-location-dot"></i> Keterangan Warna Kelurahan:</h4>
           <div id="kelurahanLegendContainer" style="display: flex; flex-wrap: wrap; gap: 12px; font-size: 11px; font-weight: bold; color:#334155;">
           </div>
        </div>
      </div>
    </div>
  </div>

  <script src="../js/script.js"></script>
  <script src="../js/polreg_detail.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>


