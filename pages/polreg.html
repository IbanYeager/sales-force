<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App — Polreg & Analisis Wilayah Kota Bandung</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/polreg.css">
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">

  <style>
    .polreg-tab-bar {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 14px;
      margin-bottom: 18px;
      border: 1px solid var(--border-color, #e2e8f0);
    }
    .polreg-tab-btn {
      flex: 1;
      padding: 10px 12px;
      border-radius: 10px;
      border: none;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      color: #64748b;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    .polreg-tab-btn.active {
      background: #ffffff;
      color: #0d1b3e;
      box-shadow: 0 3px 10px rgba(0,0,0,0.08);
    }

    .district-hero {
      background: linear-gradient(135deg, #0d1b3e 0%, #16305f 60%, #1e40af 100%);
      border-radius: 16px;
      padding: 18px;
      color: #ffffff;
      margin-bottom: 16px;
      box-shadow: 0 10px 25px rgba(13, 27, 62, 0.2);
      position: relative;
      z-index: 100;
    }

    .stat-grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .stat-card-sm {
      background: #ffffff;
      border-radius: 14px;
      padding: 12px;
      border: 1px solid #e2e8f0;
      text-align: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
    }
    .stat-val {
      font-size: 16px;
      font-weight: 800;
      color: #0d1b3e;
      margin-top: 2px;
    }
    .stat-lbl {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
    }

    .funnel-box {
      background: #f8fafc;
      border-radius: 12px;
      padding: 14px;
      margin-top: 12px;
      border: 1px solid #e2e8f0;
    }
    .funnel-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 12px;
    }
    .funnel-bar-bg {
      height: 8px;
      background: #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
      flex: 1;
      margin: 0 10px;
    }
    .funnel-bar-fill {
      height: 100%;
      background: #d7123a;
      border-radius: 6px;
    }
  </style>
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Polreg Wilayah Kota Bandung</h2>
    </header>

    <div class="container" style="margin-top: 0; padding-bottom: 30px;">

      <!-- Dropdown Pilih Tahun -->
      <div class="year-dropdown-container">
        <div class="year-dropdown-wrapper">
          <i class="fa-solid fa-calendar-days dropdown-icon"></i>
          <select id="yearSelect" class="year-dropdown" onchange="setYear(this.value)">
            <option value="2026" selected>Data Tahun 2026</option>
            <option value="2025">Data Tahun 2025</option>
            <option value="2024">Data Tahun 2024</option>
            <option value="2023">Data Tahun 2023</option>
          </select>
          <i class="fa-solid fa-chevron-down chevron-icon"></i>
        </div>
      </div>

      <!-- Segment Control Tabs: Analisis Intelijen vs Daftar Kecamatan -->
      <div class="polreg-tab-bar">
        <button type="button" class="polreg-tab-btn active" id="tabAnalisis" onclick="switchPolregTab('analisis')">
          <i class="fa-solid fa-chart-pie"></i> Analisis Wilayah
        </button>
        <button type="button" class="polreg-tab-btn" id="tabDaftar" onclick="switchPolregTab('daftar')">
          <i class="fa-solid fa-list-ul"></i> Daftar Kecamatan
        </button>
      </div>

      <!-- VIEW 1: ANALISIS INTELIJEN WILAYAH KECAMATAN -->
      <div id="viewAnalisis" style="display: block;">
        <div class="district-hero">
          <div style="font-size: 11px; font-weight: 800; color: #ffd700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
            <i class="fa-solid fa-earth-asia"></i> District Intelligence Dashboard
          </div>
          <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 800;">Analisis Rangkuman Kecamatan</h3>

          <!-- Searchable Autocomplete Input -->
          <div style="position: relative;">
            <div style="position: relative; display: flex; align-items: center;">
              <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; color: #64748b; font-size: 13px; pointer-events: none;"></i>
              <input type="text" id="inputKecamatanSearch" class="form-control" placeholder="Ketik/pilih nama kecamatan..." 
                style="font-size: 13px; font-weight: 700; color: #0d1b3e; background: #ffffff; border-radius: 12px; padding: 10px 14px 10px 36px; height: 44px; width: 100%; border: none; outline: none;"
                onfocus="showKecamatanMenu()" oninput="filterKecamatanMenu(this.value)" autocomplete="off">
              <i class="fa-solid fa-chevron-down" style="position: absolute; right: 14px; color: #64748b; font-size: 12px; pointer-events: none;"></i>
            </div>

            <!-- Dropdown Menu Floating List -->
            <div id="dropdownKecamatanMenu" style="display: none; position: absolute; top: 48px; left: 0; right: 0; max-height: 260px; overflow-y: auto; background: #ffffff; border-radius: 14px; box-shadow: 0 14px 40px rgba(0,0,0,0.3); border: 1.5px solid #cbd5e1; z-index: 9999; padding: 6px;">
            </div>
          </div>
        </div>

        <!-- KPI Metric Cards for Selected District -->
        <div class="stat-grid-3">
          <div class="stat-card-sm">
            <div class="stat-lbl">Market Share Toyota</div>
            <div class="stat-val" id="valMarketShare" style="color: var(--primary-red);">0%</div>
          </div>
          <div class="stat-card-sm">
            <div class="stat-lbl">Total Unit Polreg</div>
            <div class="stat-val" id="valContTunas" style="color: var(--accent-blue);">0 U</div>
          </div>
          <div class="stat-card-sm">
            <div class="stat-lbl">Potensi Pasar</div>
            <div class="stat-val" id="valPotensi" style="font-size: 13px; color: #059669;">Tinggi</div>
          </div>
        </div>

        <!-- Rekomendasi Mobil & Profil Customer Wilayah -->
        <div class="card" style="padding: 16px; margin-bottom: 20px; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--primary-blue);">
              <i class="fa-solid fa-car-side" style="color: var(--primary-red);"></i> Rekomendasi Mobil Dominan
            </h4>
            <span style="font-size: 10.5px; font-weight: 800; background: #eff6ff; color: #1d4ed8; padding: 3px 8px; border-radius: 6px;" id="lblSegmentasi">
              Family MPV 7-Seater
            </span>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 12px; border-left: 4px solid var(--primary-red); margin-bottom: 12px;">
            <div style="font-size: 13.5px; font-weight: 800; color: var(--primary-blue);" id="txtMobilRekomendasi">
              Memuat data...
            </div>
            <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px; line-height: 1.4;" id="txtAlasanRekomendasi">
              Memuat rekomendasi wilayah...
            </div>
          </div>

          <!-- Top 5 Mobil Terbanyak di Kecamatan -->
          <div class="top5-box" style="background: #f8fafc; border-radius: 14px; padding: 14px; margin-top: 12px; border: 1px solid #e2e8f0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="font-size: 13px; font-weight: 800; color: #0d1b3e; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> Top 5 Mobil Terbanyak
              </div>
              <span style="font-size: 10.5px; font-weight: 700; background: #e0e7ff; color: #3730a3; padding: 2px 8px; border-radius: 50px;" id="lblTop5Total">
                Memuat data...
              </span>
            </div>

            <div id="listTop5Mobil" style="display: flex; flex-direction: column; gap: 8px;">
              <div style="text-align: center; color: #94a3b8; font-size: 12px; padding: 10px;">
                <i class="fa-solid fa-spinner fa-spin"></i> Memuat daftar kendaraan...
              </div>
            </div>

            <!-- Footer link to Detail Polreg -->
            <div style="margin-top: 14px; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 10px;">
              <a href="#" id="linkDetailPolreg" style="font-size: 12px; font-weight: 800; color: #4f46e5; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; background: #ffffff; padding: 8px 16px; border-radius: 10px; border: 1px solid #c7d2fe; box-shadow: 0 2px 6px rgba(79, 70, 229, 0.08); transition: all 0.2s ease;">
                <span>Lihat Detail Lengkap &amp; Peta Lokasi</span>
                <i class="fa-solid fa-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- VIEW 2: DAFTAR KECAMATAN -->
      <div id="viewDaftar" style="display: none;">
        <div class="search-container">
          <div class="search-box">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="searchKecamatan" class="search-input" placeholder="Cari nama kecamatan...">
          </div>
        </div>

        <div class="section-header-row" style="margin-bottom: 12px;">
          <h3 class="section-title" style="margin-bottom:0;" id="listTitle">Daftar Kecamatan</h3>
          <span style="font-size: 11px; color: var(--text-muted);" id="countKecamatan">Mengambil data...</span>
        </div>

        <div id="polregList"></div>
      </div>

    </div>
  </div>

  <script src="../js/script.js"></script>
  <script src="../js/polreg.js"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
