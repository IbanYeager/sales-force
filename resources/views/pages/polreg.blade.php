<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App — Peta Polreg Wilayah Bandung Raya</title>
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- ApexCharts Library -->
  <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>

  <!-- Leaflet Map CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin=""/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>

  <link rel="stylesheet" href="../css/style.css?v=5.0" />
  <link rel="stylesheet" href="../css/polreg.css?v={{ time() }}">
  <script>
    // Proteksi role: Peta Polreg khusus Sales, arahkan SPV dan Kacab ke dashboard masing-masing
    (function checkRoleRedirect() {
      try {
        const role = localStorage.getItem('peranSales');
        if (role === 'Kepala Cabang') {
          window.location.replace('../pages_kacab/index_kacab.html');
        } else if (role === 'Supervisor') {
          window.location.replace('../pages_spv/index_spv.html');
        }
      } catch(e) {}
    })();
  </script>
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">

  <style>
    /* Cara Pakai Modal Styling */
    .modal-overlay-polreg {
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(5px);
      z-index: 99999;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }
    .modal-overlay-polreg.show {
      display: flex;
    }
    .modal-card-polreg {
      background: #ffffff;
      border-radius: 20px;
      max-width: 540px;
      width: 100%;
      padding: 24px;
      box-shadow: 0 20px 45px rgba(0,0,0,0.25);
      position: relative;
    }
  </style>
</head>

<body>
  <div class="mobile-app polreg-fullwidth-page">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Peta Polreg Wilayah Bandung Raya</h2>
    </header>

    <div class="container" style="margin-top: 0; padding-bottom: 40px;">

      <!-- Segment Control Tabs: Peta Interaktif vs Matriks / Daftar -->
      <div class="polreg-tab-bar">
        <button type="button" class="polreg-tab-btn active" id="tabAnalisis" onclick="switchPolregTab('analisis')">
          <i class="fa-solid fa-earth-asia"></i> Peta Interaktif &amp; Analisis Wilayah
        </button>
        <button type="button" class="polreg-tab-btn" id="tabDaftar" onclick="switchPolregTab('daftar')">
          <i class="fa-solid fa-table-list"></i> Matriks &amp; Rekap 79 Kecamatan
        </button>
      </div>

      <!-- VIEW 1: PETA INTERAKTIF & ANALISIS INTELIJEN WILAYAH -->
      <div id="viewAnalisis" style="display: block;">

        <!-- Top Summary KPI Strip -->
        <div class="polreg-kpi-grid">
          <div class="polreg-kpi-card accent-red">
            <div class="polreg-kpi-info">
              <span class="lbl">Total Pasar Polreg</span>
              <div class="val" id="polregKpiTotalMarket">17.119 Unit</div>
              <span class="sub">79 Kecamatan Bandung Raya</span>
            </div>
            <div class="polreg-kpi-icon red">
              <i class="fa-solid fa-car-side"></i>
            </div>
          </div>

          <div class="polreg-kpi-card accent-blue">
            <div class="polreg-kpi-info">
              <span class="lbl">Rata-rata Market Share</span>
              <div class="val" id="polregKpiAvgShare">32.8%</div>
              <span class="sub">Penguasaan Toyota Jabar</span>
            </div>
            <div class="polreg-kpi-icon blue">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
          </div>

          <div class="polreg-kpi-card accent-gold">
            <div class="polreg-kpi-info">
              <span class="lbl">Prioritas EVOLVE (Potensi 🔥)</span>
              <div class="val" id="polregKpiEvolveCount">35 Wilayah</div>
              <span class="sub">Pangsa Rendah &amp; Peluang Prospek</span>
            </div>
            <div class="polreg-kpi-icon gold">
              <i class="fa-solid fa-bolt"></i>
            </div>
          </div>

          <div class="polreg-kpi-card accent-green">
            <div class="polreg-kpi-info">
              <span class="lbl">Home Base Dealer KC</span>
              <div class="val" id="polregKpiHomeBaseShare">35.6%</div>
              <span class="sub">Kiaracondong &amp; Sekitarnya</span>
            </div>
            <div class="polreg-kpi-icon green">
              <i class="fa-solid fa-crown"></i>
            </div>
          </div>
        </div>

        <!-- Filter & Control Toolbar -->
        <div class="polreg-control-panel">
          <!-- Regency Selector Pills -->
          <div class="polreg-regency-filters" style="display:flex; gap:8px; margin-bottom:12px; flex-wrap:wrap;">
            <button type="button" class="polreg-regency-btn active" data-regency="all" style="padding:7px 15px; border-radius:10px; font-size:12px; font-weight:800; border:1px solid #cbd5e1; background:#0f172a; color:#ffffff; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <i class="fa-solid fa-earth-asia"></i> Semua Wilayah <span style="background:rgba(255,255,255,0.2); padding:2px 6px; border-radius:6px; font-size:10.5px;">79</span>
            </button>
            <button type="button" class="polreg-regency-btn" data-regency="kota_bandung" style="padding:7px 15px; border-radius:10px; font-size:12px; font-weight:700; border:1px solid #cbd5e1; background:#ffffff; color:#334155; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <i class="fa-solid fa-city" style="color:#2563eb;"></i> Kota Bandung <span style="background:#f1f5f9; padding:2px 6px; border-radius:6px; font-size:10.5px;">30</span>
            </button>
            <button type="button" class="polreg-regency-btn" data-regency="kota_cimahi" style="padding:7px 15px; border-radius:10px; font-size:12px; font-weight:700; border:1px solid #cbd5e1; background:#ffffff; color:#334155; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <i class="fa-solid fa-tree-city" style="color:#16a34a;"></i> Kota Cimahi <span style="background:#f1f5f9; padding:2px 6px; border-radius:6px; font-size:10.5px;">3</span>
            </button>
            <button type="button" class="polreg-regency-btn" data-regency="kab_bandung" style="padding:7px 15px; border-radius:10px; font-size:12px; font-weight:700; border:1px solid #cbd5e1; background:#ffffff; color:#334155; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <i class="fa-solid fa-mountain-city" style="color:#d97706;"></i> Kab. Bandung <span style="background:#f1f5f9; padding:2px 6px; border-radius:6px; font-size:10.5px;">31</span>
            </button>
            <button type="button" class="polreg-regency-btn" data-regency="kab_bandung_barat" style="padding:7px 15px; border-radius:10px; font-size:12px; font-weight:700; border:1px solid #cbd5e1; background:#ffffff; color:#334155; cursor:pointer; display:inline-flex; align-items:center; gap:6px; transition:all 0.2s;">
              <i class="fa-solid fa-compass" style="color:#7c3aed;"></i> Kab. Bandung Barat <span style="background:#f1f5f9; padding:2px 6px; border-radius:6px; font-size:10.5px;">15</span>
            </button>
          </div>

          <div class="polreg-control-row">
            <!-- Quick Filter Status Pills -->
            <div class="polreg-filter-pills">
              <button type="button" class="polreg-pill-btn active" data-filter="all">
                <i class="fa-solid fa-border-all"></i> Semua Status <span class="pill-counter" id="cntPolregAll">79</span>
              </button>
              <button type="button" class="polreg-pill-btn" data-filter="evolve" title="Area pangsa rendah dengan peluang pertumbuhan pasar tertinggi">
                <i class="fa-solid fa-bolt" style="color:#d97706;"></i> Prioritas EVOLVE (Potensi 🔥) <span class="pill-counter" id="cntPolregEvolve">35</span>
              </button>
              <button type="button" class="polreg-pill-btn" data-filter="low">
                <i class="fa-solid fa-triangle-exclamation" style="color:#dc2626;"></i> Low Share (&lt;30%) <span class="pill-counter" id="cntPolregLow">35</span>
              </button>
              <button type="button" class="polreg-pill-btn" data-filter="mid">
                <i class="fa-solid fa-circle-half-stroke" style="color:#2563eb;"></i> Solid (30-34.9%) <span class="pill-counter" id="cntPolregMid">27</span>
              </button>
              <button type="button" class="polreg-pill-btn" data-filter="high">
                <i class="fa-solid fa-circle-check" style="color:#059669;"></i> Dominan (&ge;35%) <span class="pill-counter" id="cntPolregHigh">17</span>
              </button>
            </div>

            <!-- Selector & Search Group -->
            <div class="polreg-select-group">
              <select id="polregDistrictSelect" class="polreg-select">
                <option value="">-- Pilih / Zoom ke Kecamatan (79 Wilayah) --</option>
              </select>

              <div class="polreg-search-box" id="polregSearchBox">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" id="polregSearchInput" class="polreg-search-input" placeholder="Cari kecamatan, kota, model..." autocomplete="off">
                <button type="button" id="btnPolregClearSearch" class="polreg-search-clear-btn" style="display:none;" title="Bersihkan pencarian">
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <div id="polregSearchSuggestions" class="polreg-search-suggestions" style="display:none;"></div>
              </div>

              <button type="button" class="polreg-btn-export" id="btnPolregExportCsv" style="background:#10b981; color:#ffffff; border:none; border-radius:10px; padding:8px 14px; font-size:12px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:6px; box-shadow:0 2px 6px rgba(16,185,129,0.25); white-space:nowrap;" title="Unduh rekap data Polreg 79 kecamatan dalam format CSV">
                <i class="fa-solid fa-file-excel"></i> Export CSV
              </button>
            </div>
          </div>
        </div>

        <!-- MAIN INTERACTIVE MAP WORKSPACE & INSPECTOR HUD -->
        <div class="polreg-map-workspace">
          <!-- Left Side: Interactive Map Container -->
          <div class="polreg-map-card">
            <!-- Google Maps Top Header Bar -->
            <div class="polreg-map-header">
              <div class="polreg-gmaps-title">
                <i class="fa-solid fa-map-location-dot" style="color:#4285F4; font-size:14px;"></i>
                <span>Peta Interaktif Polreg</span>
              </div>
              <button type="button" id="btnPolregLayerRoadmap" class="polreg-layer-btn active">Google Maps</button>
              <button type="button" id="btnPolregLayerSatellite" class="polreg-layer-btn">Satelit</button>
              <button type="button" id="btnPolregLayerCarto" class="polreg-layer-btn">Clean Light</button>

              <div class="polreg-header-separator"></div>

              <!-- Label Mode Switcher (Anti Bertumpuk / Declutter) -->
              <div class="polreg-label-mode-group" title="Atur tampilan label saat zoom out agar tidak bertumpuk">
                <button type="button" id="btnPolregModeSmart" class="polreg-mode-btn active" title="Mode Rapi (Auto): Saat zoom out label menjadi pin rapi tanpa tabrakan teks, zoom in tampil lengkap">
                  <i class="fa-solid fa-wand-magic-sparkles" style="color:#f59e0b;"></i> Mode Rapi
                </button>
                <button type="button" id="btnPolregModeDots" class="polreg-mode-btn" title="Hanya pin titik bersih, teks hanya muncul saat di-hover atau dipilih">
                  <i class="fa-solid fa-circle-dot"></i> Pin Bersih
                </button>
                <button type="button" id="btnPolregModeAllText" class="polreg-mode-btn" title="Paksa tampilkan semua teks label kecamatan sekaligus">
                  <i class="fa-solid fa-tags"></i> Semua Teks
                </button>
              </div>

              <div class="polreg-header-separator"></div>

              <button type="button" id="btnPolregShowAll" class="polreg-btn-all-poly" title="Tampilkan seluruh 79 polygon kecamatan sekaligus">
                <i class="fa-solid fa-draw-polygon"></i> Tampilkan Semua (79)
              </button>
              <button type="button" id="btnPolregRecenterOffice" class="polreg-btn-office" title="Pusatkan peta ke showroom &amp; bengkel Tunas Toyota Kiara Condong">
                <i class="fa-solid fa-building"></i> Kantor KC
              </button>
            </div>

            <!-- Leaflet Map Canvas -->
            <div id="polregLeafletMap" class="polreg-map-canvas"></div>

            <!-- Bottom Legend Strip -->
            <div class="polreg-map-legend">
              <div class="legend-item">
                <span class="legend-color-dot high"></span>
                <span>Dominan (&ge;35%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot mid"></span>
                <span>Moderat (30% - 34.9%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot low"></span>
                <span>Rendah (&lt;30% - Target EVOLVE 🔥)</span>
              </div>
            </div>
          </div>

          <!-- Right Side: Floating District Inspector HUD -->
          <div class="polreg-inspector-card" id="polregInspectorCard">
            <div class="pi-header">
              <span class="pi-zone-tag" id="inspectorZoneTag">KOTA BANDUNG • BANDUNG TENGAH</span>
              <div class="pi-district-title">
                <span id="inspectorDistrictTitle">Sumur Bandung</span>
                <span class="pi-urgency-badge maintain" id="inspectorUrgencyBadge">
                  <i class="fa-solid fa-circle-check"></i> Solid Market Share
                </span>
              </div>
            </div>

            <!-- Quick Stats Grid -->
            <div class="pi-stats-grid">
              <div class="pi-stat-box">
                <span class="pi-stat-lbl">Market Share Toyota</span>
                <div class="pi-stat-val" id="inspectorShareVal" style="color:#059669;">32.5%</div>
                <span class="pi-stat-sub">Target: <strong id="inspectorTargetVal">36.0%</strong></span>
              </div>
              <div class="pi-stat-box">
                <span class="pi-stat-lbl">Total Pasar Polreg</span>
                <div class="pi-stat-val" id="inspectorTotalPolreg">4.780 Unit/bln</div>
                <span class="pi-stat-sub">Toyota: <strong id="inspectorToyotaVol">1.553 Unit</strong></span>
              </div>
            </div>

            <!-- Competitor Battle-Card -->
            <div class="pi-battle-card">
              <div class="pi-bc-title">
                <i class="fa-solid fa-shield-halved" style="color:#cc1426;"></i>
                <span>Model Rekomendasi &amp; Kontra Kompetitor</span>
              </div>
              <div>
                <span class="pi-bc-model-chip" id="inspectorModelBadge">Toyota Avanza 1.3/1.5</span>
              </div>
              <div class="pi-bc-competitor" id="inspectorCompetitorText">
                Lawan Terberat: <strong>Jaecoo J5 Ev, Honda Brio Satya</strong> (LMPV, LCGC &amp; Compact SUV)
              </div>
              <ul class="pi-bc-usp-list" id="inspectorUspList">
                <li>Jaringan Dealer &amp; Servis Resmi Tunas Toyota Kiara Condong siap melayani servis berkala &amp; garansi.</li>
                <li>Layanan Mobile THS (Toyota Home Service) menjangkau wilayah langsung ke rumah konsumen.</li>
                <li>Program Trade-In OLXmobbi &amp; Promo Bunga Ringan Khusus Konsumen Kota Bandung.</li>
                <li>Unit ready stock tercepat dengan fasilitas booking prioritas cabang Kiara Condong.</li>
              </ul>
            </div>

            <!-- Komposisi & Rangking Mobil (Banyakan Mobil Mana) -->
            <div class="pi-car-section">
              <div class="pi-section-title" style="margin-bottom:8px;">
                <i class="fa-solid fa-chart-simple" style="color:#cc1426;"></i>
                <span>Komposisi &amp; Rangking Mobil (Banyakan Mana)</span>
              </div>

              <!-- Top Car Callout -->
              <div class="pi-top-car-strip" id="piTopCarStrip">
                <div class="pi-top-car-medal"><i class="fa-solid fa-trophy"></i></div>
                <div class="pi-top-car-info">
                  <span class="pi-tc-label">Mobil #1 Terbanyak di Wilayah:</span>
                  <strong class="pi-tc-name" id="piTopCarName">Toyota Avanza 1.3/1.5</strong>
                  <span class="pi-tc-sub" id="piTopCarSub">333 Unit (7% dari total 4.780 unit)</span>
                </div>
              </div>

              <!-- Tab Switchers -->
              <div class="pi-chart-tabs">
                <button type="button" class="pi-chart-tab active" data-mode="models" onclick="window.PolregMap.setInspectorChartMode('models')">
                  Top Model
                </button>
                <button type="button" class="pi-chart-tab" data-mode="toyota" onclick="window.PolregMap.setInspectorChartMode('toyota')">
                  Khusus Toyota
                </button>
                <button type="button" class="pi-chart-tab" data-mode="brands" onclick="window.PolregMap.setInspectorChartMode('brands')">
                  Pangsa Merk
                </button>
              </div>

              <!-- ApexCharts Canvas -->
              <div id="piCarApexChart" style="min-height:170px; height:170px; margin-bottom:6px;"></div>

              <!-- Mini Car Ranking List -->
              <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0 4px 0;">
                <span style="font-size:10.5px; font-weight:800; color:#64748b; text-transform:uppercase;">Top 5 Mobil Terdata:</span>
                <a href="#polregCarAnalyticsSection" style="font-size:10.5px; font-weight:700; color:#2563eb; text-decoration:none;">Buka Analisis &rarr;</a>
              </div>
              <div id="piMiniCarList" class="pi-mini-car-list">
                <!-- Populated via polreg.js -->
              </div>
            </div>

            <!-- Target Demografi & Hotspot Pameran -->
            <div class="pi-section-title">
              <i class="fa-solid fa-users" style="color:#2563eb;"></i>
              <span>Profil Demografi &amp; Target Pasar</span>
            </div>
            <div class="pi-text-block" id="inspectorDemografiText">
              Keluarga Mapan, Komuter Bandung Raya, Pengusaha &amp; Wirausaha Lokal
            </div>

            <div class="pi-section-title">
              <i class="fa-solid fa-location-dot" style="color:#d97706;"></i>
              <span>Rekomendasi Venue Pameran / Canvassing</span>
            </div>
            <div class="pi-text-block" id="inspectorVenueText">
              Sentra Niaga &amp; Ruko Utama, SPBU &amp; Rest Area Terdekat, Pusat Perbelanjaan Lokal
            </div>

            <!-- Housing Clusters Data -->
            <div class="pi-section-title">
              <i class="fa-solid fa-city" style="color:#7c3aed;"></i>
              <span>Basis Perumahan &amp; Komplek Terdata</span>
            </div>
            <div class="pi-text-block">
              <div id="inspectorHousingCount" style="font-weight:700; color:#0f172a; margin-bottom:4px;">14 Komplek (1.420 Unit Rumah)</div>
              <div class="pi-housing-chips" id="inspectorHousingChips">
                <span class="pi-housing-chip">Komplek Sentra Bandung</span>
                <span class="pi-housing-chip">Griya Utama</span>
              </div>
            </div>

            <!-- Action Buttons for Sales Force -->
            <div class="pi-action-btns" style="display:flex; flex-direction:column; gap:8px;">
              <button type="button" class="btn-pi-primary" onclick="goToDistrictCanvassing()" style="padding:11px 14px; font-size:12.5px; border-radius:12px;">
                <i class="fa-solid fa-location-crosshairs"></i> Rute &amp; Check-in Canvassing Wilayah Ini
              </button>
            </div>
          </div>
        </div>

        <!-- DEDICATED CAR POPULATION & COMPARISON INTELLIGENCE PANEL (BELOW MAP) -->
        <div class="polreg-car-panel" id="polregCarAnalyticsSection" style="margin-top:24px; margin-bottom:24px;">
          <div class="polreg-car-panel-header">
            <div class="polreg-car-panel-title-wrap">
              <div class="polreg-car-icon-badge">
                <i class="fa-solid fa-car-side"></i>
              </div>
              <div>
                <h3 class="polreg-car-panel-title">
                  Analisis Populasi &amp; Komparasi Mobil Terbanyak — Kecamatan <span id="cpDistrictTitle" style="color:#cc1426;">Sumur Bandung</span>
                </h3>
                <p class="polreg-car-panel-subtitle">
                  Menampilkan sebaran model kendaraan terdaftar, rangking volume populasi (banyakan mobil mana), dan perbandingan pangsa pasar Toyota vs kompetitor di wilayah ini.
                </p>
              </div>
            </div>
            <div class="polreg-car-panel-badges">
              <span class="polreg-badge-pill" style="background:#fee2e2; color:#991b1b; padding:6px 12px; border-radius:8px; font-weight:800;" id="cpBadgeTotalUnits"><i class="fa-solid fa-car"></i> Memuat...</span>
              <span class="polreg-badge-pill" style="background:#eff6ff; color:#1e40af; padding:6px 12px; border-radius:8px; font-weight:800;" id="cpBadgeTotalMerks"><i class="fa-solid fa-tags"></i> - Merk</span>
              <span class="polreg-badge-pill" style="background:#ecfdf5; color:#065f46; padding:6px 12px; border-radius:8px; font-weight:800;" id="cpBadgeToyotaUnits"><i class="fa-solid fa-crown"></i> Toyota: - Unit</span>
            </div>
          </div>

          <!-- KPI Row for Quick Glance -->
          <div class="polreg-car-kpi-row">
            <div class="polreg-car-kpi-card gold">
              <div class="kpi-icon"><i class="fa-solid fa-trophy"></i></div>
              <div class="kpi-body">
                <span class="kpi-lbl">Mobil #1 Terbanyak di Wilayah</span>
                <strong class="kpi-val" id="cpKpiTopCar">Memuat...</strong>
                <span class="kpi-sub" id="cpKpiTopCarSub">- Unit (-% market share)</span>
              </div>
            </div>
            <div class="polreg-car-kpi-card red">
              <div class="kpi-icon"><i class="fa-solid fa-crown"></i></div>
              <div class="kpi-body">
                <span class="kpi-lbl">Model Toyota Teratas</span>
                <strong class="kpi-val" id="cpKpiTopToyota">Memuat...</strong>
                <span class="kpi-sub" id="cpKpiTopToyotaSub">- Unit (-% pangsa Toyota)</span>
              </div>
            </div>
            <div class="polreg-car-kpi-card blue">
              <div class="kpi-icon"><i class="fa-solid fa-chart-pie"></i></div>
              <div class="kpi-body">
                <span class="kpi-lbl">Merk Paling Dominan</span>
                <strong class="kpi-val" id="cpKpiTopBrand">TOYOTA</strong>
                <span class="kpi-sub" id="cpKpiTopBrandSub">Peringkat 1 Penjualan Wilayah</span>
              </div>
            </div>
          </div>

          <!-- Main Charts Grid: Model Ranking & Brand Share -->
          <div class="polreg-car-charts-grid">
            <!-- Left Chart: Ranking Banyakan Mobil Mana -->
            <div class="polreg-car-chart-card">
              <div class="polreg-car-chart-header">
                <div>
                  <h4 class="chart-title">
                    <i class="fa-solid fa-ranking-star" style="color:#cc1426;"></i>
                    <span>Rangking Model Mobil Terbanyak (Banyakan Mobil Mana)</span>
                  </h4>
                  <span class="chart-desc">Perbandingan volume unit model terdaftar di kecamatan ini (Model Toyota berarsir merah)</span>
                </div>
                <div class="polreg-chart-filter-pills">
                  <button type="button" class="cp-filter-pill active" id="btnCpFilterAll" onclick="window.PolregMap.setMainChartMode('all')">
                    Semua Merk (Top 12)
                  </button>
                  <button type="button" class="cp-filter-pill" id="btnCpFilterToyota" onclick="window.PolregMap.setMainChartMode('toyota')">
                    Khusus Toyota (Top 10)
                  </button>
                </div>
              </div>
              <div id="mainCarRankingChart" style="min-height:360px;"></div>
            </div>

            <!-- Right Chart: Brand Composition Donut -->
            <div class="polreg-car-chart-card">
              <div class="polreg-car-chart-header">
                <div>
                  <h4 class="chart-title">
                    <i class="fa-solid fa-chart-pie" style="color:#2563eb;"></i>
                    <span>Komposisi Pangsa Merk (Market Share Brand)</span>
                  </h4>
                  <span class="chart-desc">Persentase penguasaan merek otomotif di wilayah kecamatan ini</span>
                </div>
                <span style="font-size:11px; font-weight:700; color:#059669; background:#ecfdf5; padding:3px 8px; border-radius:6px;">
                  <i class="fa-solid fa-shield-check"></i> Sumber: Polreg Resmi
                </span>
              </div>
              <div id="mainBrandShareChart" style="min-height:360px;"></div>
            </div>
          </div>

          <!-- Full Car List Table in this District -->
          <div class="polreg-car-table-section">
            <div class="polreg-car-table-header">
              <div>
                <h4 style="margin:0; font-size:14.5px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
                  <i class="fa-solid fa-list-ol" style="color:#cc1426;"></i>
                  <span>Katalog Lengkap Mobil Terdaftar di Kecamatan <span id="cpTableDistrictName" style="color:#cc1426;">Sumur Bandung</span></span>
                </h4>
                <p style="margin:2px 0 0; font-size:12px; color:#64748b;">Daftar model kendaraan terurut dari unit terbanyak ke paling sedikit</p>
              </div>
              <div class="polreg-table-controls">
                <div class="polreg-search-box">
                  <i class="fa-solid fa-magnifying-glass"></i>
                  <input type="text" id="cpCarSearchInput" class="polreg-search-input" placeholder="Cari tipe mobil atau merk...">
                </div>
                <select id="cpBrandFilterSelect" class="polreg-select" style="min-width:160px; padding:7px 12px; font-size:12px;">
                  <option value="">Semua Merk</option>
                  <option value="TOYOTA">Toyota</option>
                  <option value="HONDA">Honda</option>
                  <option value="DAIHATSU">Daihatsu</option>
                  <option value="MITSUBISHI">Mitsubishi</option>
                  <option value="SUZUKI">Suzuki</option>
                  <option value="HYUNDAI">Hyundai</option>
                  <option value="WULING">Wuling</option>
                </select>
              </div>
            </div>

            <div class="table-responsive" style="max-height:400px; overflow-y:auto; border:1px solid #e2e8f0; border-radius:12px;">
              <table class="polreg-table" id="cpCarDetailTable" style="width:100%; border-collapse:collapse;">
                <thead>
                  <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; font-size:11px; color:#64748b; text-transform:uppercase;">
                    <th style="width:60px; text-align:center; padding:10px 8px;">Rank</th>
                    <th style="width:130px; padding:10px 8px; text-align:left;">Merk</th>
                    <th style="padding:10px 8px; text-align:left;">Model &amp; Tipe Kendaraan</th>
                    <th style="width:120px; text-align:right; padding:10px 8px;">Volume Unit</th>
                    <th style="width:110px; text-align:right; padding:10px 8px;">Pangsa Wilayah</th>
                    <th style="width:180px; padding:10px 8px;">Visual Volume</th>
                  </tr>
                </thead>
                <tbody id="cpCarTableBody">
                  <!-- Populated via polreg.js -->
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      <!-- VIEW 2: MATRIKS & REKAP 79 KECAMATAN -->
      <div id="viewDaftar" style="display: none;">
        <div class="card-panel" style="background:#ffffff; border:1px solid #cbd5e1; border-radius:18px; padding:20px; box-shadow:0 4px 20px rgba(0,0,0,0.03); margin-bottom:24px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="margin:0; font-size:16px; font-weight:800; color:#0f172a; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-table" style="color:#2563eb;"></i>
                <span>Matriks Rangking Pangsa Pasar Polreg 79 Kecamatan se-Bandung Raya</span>
              </h3>
              <p style="margin:2px 0 0; font-size:12px; color:#64748b;">Diurutkan dari pangsa pasar Toyota tertinggi ke terendah (Kota Bandung, Kota Cimahi, Kab. Bandung &amp; KBB)</p>
            </div>
            <span style="font-size:12px; color:#10b981; font-weight:700;">
              <i class="fa-solid fa-circle-check"></i> Terverifikasi Data TAM &amp; Salesforce
            </span>
          </div>

          <!-- Cards Grid Mode -->
          <div class="polreg-districts-grid" id="polregCardsGrid">
            <!-- Populated via polreg.js -->
          </div>

          <!-- Full Table Mode -->
          <div class="table-responsive" style="border:1px solid #cbd5e1; border-radius:12px; overflow-x:auto;">
            <table class="polreg-table" id="polregTable" style="width:100%; border-collapse:collapse;">
              <thead>
                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0; font-size:11px; color:#64748b; text-transform:uppercase;">
                  <th style="width:50px; text-align:center; padding:10px 8px;">No</th>
                  <th style="padding:10px 8px; text-align:left;">Nama Kecamatan</th>
                  <th style="padding:10px 8px; text-align:left;">Kabupaten / Kota</th>
                  <th style="padding:10px 8px; text-align:left;">Zona Wilayah</th>
                  <th style="text-align:right; padding:10px 8px;">Total Pasar</th>
                  <th style="text-align:right; padding:10px 8px;">Volume Toyota</th>
                  <th style="text-align:right; padding:10px 8px;">Pangsa Pasar</th>
                  <th style="text-align:right; padding:10px 8px;">Target</th>
                  <th style="padding:10px 8px; text-align:center;">Status Urgensi</th>
                  <th style="padding:10px 8px; text-align:left;">Model Rekomendasi</th>
                  <th style="width:90px; text-align:center; padding:10px 8px;">Aksi</th>
                </tr>
              </thead>
              <tbody id="polregTableBody">
                <!-- Populated via polreg.js -->
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Modal Cara Pakai -->
  <div class="modal-overlay-polreg" id="modalCaraPakai" onclick="closeCaraPakaiModal(event)">
    <div class="modal-card-polreg" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="margin:0; font-size:16px; font-weight:800; color:#0d1b3e; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-lightbulb" style="color:#f59e0b;"></i> Cara Menggunakan Peta Polreg
        </h3>
        <button type="button" onclick="closeCaraPakaiModal()" style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px; font-size:13px; color:#334155; line-height:1.5;">
        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="background:#fee2e2; color:#cc1426; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:800;">1</div>
          <div>
            <strong>Peta Warna Wilayah:</strong><br>
            Polygon di peta langsung menunjukkan performa pasar:
            <div style="margin-top:4px; font-size:12px;">
              🟢 <b>Hijau (Dominan &ge;35%)</b>: Basis kuat Toyota.<br>
              🔵 <b>Biru (Solid 30-34.9%)</b>: Pertahankan &amp; rawat.<br>
              🔴 <b>Merah (Prioritas EVOLVE &lt;30%)</b>: Potensi pertumbuhan &amp; prospek paling tinggi!
            </div>
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="background:#eff6ff; color:#2563eb; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:800;">2</div>
          <div>
            <strong>Filter Cepat Area Potensial:</strong><br>
            Klik tombol <b>Prioritas EVOLVE (Potensi 🔥)</b> untuk menyaring langsung kecamatan yang pasarnya besar tapi penguasaan Toyota masih perlu ditingkatkan.
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="background:#ecfdf5; color:#059669; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:800;">3</div>
          <div>
            <strong>Klik Wilayah di Peta:</strong><br>
            Klik kecamatan mana pun langsung di peta untuk memunculkan analisis lengkap di panel samping (Model rekomendasi, lawan kompetitor, mobil terbanyak, demografi).
          </div>
        </div>

        <div style="display:flex; gap:10px; align-items:flex-start;">
          <div style="background:#fef3c7; color:#d97706; width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:800;">4</div>
          <div>
            <strong>Direct Canvassing Check-In:</strong><br>
            Tekan tombol merah <b>"Rute &amp; Check-in Canvassing Wilayah Ini"</b> untuk langsung memulai check-in canvassing di kecamatan tersebut!
          </div>
        </div>
      </div>

      <div style="margin-top:20px; text-align:right;">
        <button type="button" onclick="closeCaraPakaiModal()" style="background:#0d1b3e; color:#ffffff; border:none; padding:8px 18px; border-radius:10px; font-size:12.5px; font-weight:800; cursor:pointer;">
          Mengerti, Siap Prospek!
        </button>
      </div>
    </div>
  </div>

  <script>
    function openCaraPakaiModal() {
      const modal = document.getElementById('modalCaraPakai');
      if (modal) modal.classList.add('show');
    }
    function closeCaraPakaiModal(e) {
      const modal = document.getElementById('modalCaraPakai');
      if (modal) modal.classList.remove('show');
    }
    // Connect to executive header Cara Pakai button from sidebar_desktop.js
    window.sftOpenFeatureTutorial = openCaraPakaiModal;
  </script>

  <script src="../custom_alert.js"></script>
  <script src="../js/script.js"></script>
  <script src="../js/polreg.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
