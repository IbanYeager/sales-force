<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Penjualan &amp; Mapping Polreg TCO (Toyota Customization Option)</title>
  
  <!-- Font & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Leaflet Map CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- Kacab Core & TCO Styles -->
  <link rel="stylesheet" href="/css/style_kacab.css?v={{ time() }}">
  <link rel="stylesheet" href="../css/penjualan_tco.css?v={{ time() }}">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#0f172a">
</head>

<body>
  <div class="kcb-shell">
    <!-- SIDEBAR KACAB -->
    <aside class="kcb-sidebar">
      <div class="kcb-brand-container">
        <div class="kcb-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="kcb-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-building-user"></i> KACAB PANEL</span>
          <p class="panel-sub"><span class="panel-sub-dot"></span> Cabang Kiara Condong</p>
        </div>
      </div>

      <div class="kcb-search-wrap">
        <div class="kcb-search-box">
          <i class="fa-solid fa-magnifying-glass kcb-search-icon"></i>
          <input type="text" class="kcb-search-input" id="kcbSearchInput" placeholder="Cari menu &amp; fitur..." autocomplete="off" spellcheck="false">
          <kbd class="kcb-search-kbd">Ctrl+K</kbd>
          <button type="button" class="kcb-search-clear" id="kcbSearchClear" style="display:none;" title="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="kcb-nav">
        <!-- Kategori 1: Eksekutif & Dashboard -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-chart-line"></i> Eksekutif &amp; Dashboard</span>
          <a href="index_kacab.html" id="navDash"><i class="fa-solid fa-gauge-high"></i> Dashboard Cabang</a>
          <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i> Laporan Eksekutif</a>
          <a href="performa_regional.html" id="navRegional"><i class="fa-solid fa-earth-asia"></i> Performa Regional Jabar</a>
        </div>

        <!-- Kategori 2: Pipeline & Sales CRM -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-funnel-dollar"></i> Pipeline &amp; Sales CRM</span>
          <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i> Penjualan Kircon</a>
          <a href="penjualan_tco.html" id="navTco" class="active"><i class="fa-solid fa-gem"></i> Penjualan &amp; Polreg TCO</a>
          <a href="penjualan_merchandise.html" id="navMerchandise"><i class="fa-solid fa-shirt"></i> Penjualan Merchandise</a>
          <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i> Database Follow-Up (CRM)</a>
          <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i> AO Report Cabang</a>
          <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i> Otorisasi &amp; Approval</a>
        </div>

        <!-- Kategori 3: Monitoring Tim & Sales -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-users-gear"></i> Monitoring Tim &amp; Sales</span>
          <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i> Monitoring Tim SPV</a>
          <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i> Data 57 Wiraniaga <span class="kcb-nav-badge badge-gold">57 Sales</span></a>
          <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i> Target &amp; Produktivitas</a>
          <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i> Aktivitas &amp; Riwayat Sales</a>
          <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas"><i class="fa-solid fa-images"></i> Riwayat Foto Aktivitas</a>
          <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i> Peta GPS Kunjungan</a>
        </div>

        <!-- Kategori 4: Stok & Operasional -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-warehouse"></i> Stok &amp; Operasional</span>
          <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i> Live Stok (1.638 Unit)</a>
          <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i> After Sales</a>
          <a href="mtoyota_service.html" id="navMtoyota"><i class="fa-solid fa-car-on"></i> m-Toyota &amp; Service</a>
          <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i> Trade-In &amp; OLX</a>
        </div>

        <div class="kcb-search-empty" id="kcbSearchEmpty" style="display:none;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Menu tidak ditemukan</p>
          <span>Coba gunakan kata kunci lain</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="kcb-footer-profile">
          <div class="kcb-footer-avatar-wrap">
            <img src="https://ui-avatars.com/api/?name=Dendi+Holius&background=0f172a&color=ffffff&bold=true" alt="Dendi Holius" class="kcb-footer-avatar" id="kcbFooterAvatar">
            <span class="kcb-footer-dot" title="Sistem Aktif &amp; Terhubung"></span>
          </div>
          <div class="kcb-footer-meta">
            <span class="kcb-footer-name" id="kcbFooterName">Dendi Holius</span>
            <span class="kcb-footer-role"><i class="fa-solid fa-user-tie" style="font-size:10px; color:#94a3b8;"></i> Kepala Cabang</span>
          </div>
        </div>
        <button type="button" class="kcb-logout-btn" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <!-- Topbar Header -->
      <div class="kcb-topbar">
        <div>
          <div class="kcb-breadcrumb">
            <span class="kcb-breadcrumb-item"><i class="fa-solid fa-gem"></i> Pipeline &amp; Sales CRM</span>
            <span class="kcb-breadcrumb-sep">/</span>
            <span class="kcb-breadcrumb-item active">Penjualan &amp; Polreg TCO</span>
          </div>
          <h2 id="pageTitle">Monitoring Eksekutif Penjualan &amp; Polreg TCO</h2>
          <p class="page-sub"><i class="fa-regular fa-calendar-days" style="color:#64748b; margin-right:4px;"></i> Analisis revenue aksesoris Toyota Customization Option dan pemetaan wilayah asal registrasi customer (Polreg).</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Memuat...</span>
            <span class="role" id="kcbRole">Kepala Cabang</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 14px;">
        <!-- Executive Control Bar with Filters -->
        <div class="tco-dashboard-banner">
          <div class="tco-banner-content">
            <div class="tco-banner-title">
              <span class="tco-banner-badge">
                <i class="fa-solid fa-layer-group"></i> Modul Aksesoris Resmi TAM
              </span>
              <h1>Penjualan &amp; Pemetaan Polreg TCO</h1>
              <p class="tco-banner-desc">
                Monitoring penetrasi aksesoris Toyota Customization Option dan pemetaan wilayah registrasi customer (Plat D, Plat Z, Plat E, Plat F) di Bandung Raya.
              </p>
            </div>

            <div class="tco-filter-bar">
              <select id="filterPeriode" class="tco-select-filter" title="Filter Periode">
                <option value="all">Semua Periode</option>
                <option value="this_month">Bulan Ini</option>
                <option value="last_month">Bulan Lalu</option>
                <option value="this_year">Tahun 2026</option>
              </select>

              <select id="filterModel" class="tco-select-filter" title="Filter Model Mobil">
                <option value="all">Semua Model Mobil</option>
                <option value="ZENIX">Innova Zenix</option>
                <option value="AVANZA">Avanza</option>
                <option value="VELOZ">Veloz</option>
                <option value="FORTUNER">Fortuner</option>
                <option value="CALYA">Calya</option>
                <option value="RUSH">Rush</option>
                <option value="RAIZE">Raize</option>
                <option value="AGYA">Agya</option>
                <option value="HILUX">Hilux</option>
                <option value="ALPHARD">Alphard / Voxy</option>
              </select>

              <select id="filterPolreg" class="tco-select-filter" title="Filter Wilayah Polreg">
                <option value="all">Semua Wilayah Polreg</option>
                <option value="Plat D - Kota Bandung">Plat D - Kota Bandung</option>
                <option value="Plat D - Kab. Bandung">Plat D - Kab. Bandung</option>
                <option value="Plat D - Kota Cimahi">Plat D - Kota Cimahi</option>
                <option value="Plat D - Kab. Bandung Barat">Plat D - Bandung Barat</option>
                <option value="Plat Z - Sumedang">Plat Z - Kab. Sumedang</option>
                <option value="Plat Z - Garut">Plat Z - Kab. Garut</option>
                <option value="Plat E - Cirebon">Plat E - Cirebon</option>
                <option value="Plat F - Cianjur">Plat F - Cianjur / Sukabumi</option>
              </select>

              <button type="button" class="tco-btn-input-new" onclick="openInputModal()">
                <i class="fa-solid fa-plus"></i> Input Penjualan
              </button>
            </div>
          </div>
        </div>

        <!-- 4 KPI Stat Cards -->
        <div class="tco-kpi-grid">
          <!-- Total Revenue TCO -->
          <div class="tco-kpi-card">
            <div class="tco-kpi-top">
              <span class="tco-kpi-label">Total Omset Penjualan TCO</span>
              <div class="tco-kpi-icon icon-crimson">
                <i class="fa-solid fa-sack-dollar"></i>
              </div>
            </div>
            <div>
              <div class="tco-kpi-val" id="kpiTotalRevenue">Rp 0</div>
              <div class="tco-kpi-sub">
                <span class="badge-trend-up"><i class="fa-solid fa-arrow-trend-up"></i> Performa Bulanan</span>
              </div>
            </div>
          </div>

          <!-- Total Unit Aksesoris Terpasang -->
          <div class="tco-kpi-card">
            <div class="tco-kpi-top">
              <span class="tco-kpi-label">Aksesoris Terpasang</span>
              <div class="tco-kpi-icon icon-blue">
                <i class="fa-solid fa-boxes-packing"></i>
              </div>
            </div>
            <div>
              <div class="tco-kpi-val" id="kpiTotalQty">0 Unit</div>
              <div class="tco-kpi-sub">
                <span style="color:#2563eb; font-weight:700;"><i class="fa-solid fa-check-double"></i> 100% Genuine</span>
                <span>TAM Accessories</span>
              </div>
            </div>
          </div>

          <!-- Penetrasi TCO ke Kendaraan Baru -->
          <div class="tco-kpi-card">
            <div class="tco-kpi-top">
              <span class="tco-kpi-label">Penetrasi TCO per SPK</span>
              <div class="tco-kpi-icon icon-emerald">
                <i class="fa-solid fa-bullseye"></i>
              </div>
            </div>
            <div>
              <div class="tco-kpi-val" id="kpiPenetrationRate">0%</div>
              <div class="tco-kpi-sub">
                <span class="badge-trend-up"><i class="fa-solid fa-arrow-trend-up"></i> Target: 65%</span>
                <span>Tercapai &amp; Optimal</span>
              </div>
            </div>
          </div>

          <!-- Rata-rata Nilai TCO per Transaksi & Top Item -->
          <div class="tco-kpi-card">
            <div class="tco-kpi-top">
              <span class="tco-kpi-label">Rata-rata Nilai / SPK</span>
              <div class="tco-kpi-icon icon-crimson">
                <i class="fa-solid fa-award"></i>
              </div>
            </div>
            <div>
              <div class="tco-kpi-val" id="kpiAvgPerSpk">Rp 0</div>
              <div class="tco-kpi-sub" style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                <span style="color:#b45309; font-weight:700;">Top:</span>
                <span id="kpiBestSellerItem" style="font-weight:700; color:#0f172a;">-</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Map & Polreg Ranking Grid -->
        <div class="tco-mapping-grid">
          <!-- Interactive Map Container -->
          <div class="tco-map-card">
            <div class="tco-map-header">
              <div class="tco-map-title">
                <i class="fa-solid fa-map-location-dot" style="color: #d7123a; font-size: 20px;"></i>
                <div>
                  <h3>Peta Poligon Wilayah &amp; Pemetaan Kecamatan TCO (Polreg)</h3>
                  <span>Choropleth 79 kecamatan Bandung Raya, status penetrasi &amp; ranking produk terbanyak</span>
                </div>
              </div>
              <div class="tco-map-controls">
                <select id="mapFilterStatus" class="tco-select-map-filter" onchange="filterMapByStatus(this.value)">
                  <option value="all">Semua Status Penetrasi</option>
                  <option value="Tinggi">🟢 Penetrasi Tinggi (Dominan)</option>
                  <option value="Sedang">🔵 Penetrasi Sedang (Potensial)</option>
                  <option value="Rendah">🔴 Penetrasi Baru</option>
                  <option value="Belum Ada">⚪ Belum Ada SPK TCO</option>
                </select>

                <button type="button" class="tco-map-btn active" id="btnTileRoadmap" onclick="setBaseLayer('roadmap')">
                  <i class="fa-solid fa-map"></i> Google Maps
                </button>
                <button type="button" class="tco-map-btn" id="btnTileSatellite" onclick="setBaseLayer('satellite')">
                  <i class="fa-solid fa-satellite"></i> Satelit
                </button>

                <button type="button" class="tco-map-btn" id="btnToggleLabels" onclick="toggleMapLabels()" title="Tampilkan / Sembunyikan nama kecamatan di atas peta">
                  <i class="fa-solid fa-tag"></i> Label: Bersih
                </button>

                <button type="button" class="tco-map-btn" onclick="recenterToDealerHQ()" title="Pusatkan ke Kantor Tunas Toyota Kiara Condong">
                  <i class="fa-solid fa-building-flag" style="color:#eb0a1e;"></i> Kantor KC
                </button>
              </div>
            </div>

            <!-- Quick Regency Filter Pills (Bandung Raya 79 Districts) -->
            <div class="tco-quick-area-bar">
              <span style="font-size:11px; font-weight:800; color:#64748b; white-space:nowrap;">
                <i class="fa-solid fa-layer-group"></i> Wilayah:
              </span>
              <button type="button" class="tco-area-pill active" data-regency="all" onclick="filterMapByRegency('all')">
                Semua Wilayah (79)
              </button>
              <button type="button" class="tco-area-pill" data-regency="kota_bandung" onclick="filterMapByRegency('kota_bandung')">
                Kota Bandung (30)
              </button>
              <button type="button" class="tco-area-pill" data-regency="kota_cimahi" onclick="filterMapByRegency('kota_cimahi')">
                Kota Cimahi (3)
              </button>
              <button type="button" class="tco-area-pill" data-regency="kab_bandung" onclick="filterMapByRegency('kab_bandung')">
                Kab. Bandung (31)
              </button>
              <button type="button" class="tco-area-pill" data-regency="kab_bandung_barat" onclick="filterMapByRegency('kab_bandung_barat')">
                Kab. Bandung Barat (15)
              </button>
            </div>

            <!-- Leaflet Map Container -->
            <div class="tco-map-container">
              <div id="tcoPolregMap"></div>
            </div>

            <!-- Map Legend Strip -->
            <div class="tco-map-legend">
              <div class="legend-item">
                <span class="legend-color-dot high"></span>
                <span>Penetrasi Tinggi (&ge;12 Unit / &ge;Rp 25Jt)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot mid"></span>
                <span>Moderat (5 - 11 Unit)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot low"></span>
                <span>Penetrasi Baru (1 - 4 Unit)</span>
              </div>
              <div class="legend-item">
                <span class="legend-color-dot zero"></span>
                <span>Belum Ada SPK (Peluang Pasar)</span>
              </div>
            </div>
          </div>

          <!-- Polreg Leaderboard & District Inspector Side Panel -->
          <div class="tco-polreg-panel">
            <!-- District Inspector HUD -->
            <div class="tco-inspector-hud" id="tcoInspectorHud">
              <div class="tco-hud-header">
                <span class="tco-hud-tag" id="hudZoneTag">KOTA BANDUNG • PLAT D</span>
                <div class="tco-hud-title-row">
                  <h3 id="hudDistrictTitle">Kiaracondong</h3>
                  <span class="tco-hud-status-badge high" id="hudStatusBadge">
                    <i class="fa-solid fa-circle-check"></i> Penetrasi Tinggi
                  </span>
                </div>
              </div>

              <!-- Quick Stats Grid -->
              <div class="tco-hud-stats-grid">
                <div class="tco-hud-stat-box">
                  <span class="lbl">Omset Penjualan TCO</span>
                  <div class="val text-crimson" id="hudOmsetVal">Rp 0</div>
                  <span class="sub" id="hudSpkCount">0 SPK Terpasang</span>
                </div>
                <div class="tco-hud-stat-box">
                  <span class="lbl">Total Aksesoris</span>
                  <div class="val text-blue" id="hudTotalQtyVal">0 Unit</div>
                  <span class="sub" id="hudAvgVal">Rp 0 / SPK</span>
                </div>
              </div>

              <!-- Highlights: Yang Terbanyak Apa -->
              <div class="tco-hud-champions-box">
                <!-- Top Accessory Callout -->
                <div class="tco-champion-row">
                  <div class="tco-champ-icon icon-gold"><i class="fa-solid fa-trophy"></i></div>
                  <div class="tco-champ-info">
                    <span class="lbl">Aksesoris #1 Terbanyak:</span>
                    <strong class="title" id="hudTopItemName">Memuat data...</strong>
                    <span class="meta" id="hudTopItemQty">0 Unit Terjual</span>
                  </div>
                </div>

                <!-- Top Vehicle Callout -->
                <div class="tco-champion-row" style="margin-top: 8px;">
                  <div class="tco-champ-icon icon-blue"><i class="fa-solid fa-car"></i></div>
                  <div class="tco-champ-info">
                    <span class="lbl">Model Mobil #1 Terbanyak:</span>
                    <strong class="title" id="hudTopModelName">Memuat data...</strong>
                    <span class="meta" id="hudTopModelQty">0 Kendaraan</span>
                  </div>
                </div>
              </div>

              <!-- Action Button to filter transaction table -->
              <div style="margin-top: 12px;">
                <button type="button" class="tco-hud-filter-btn" id="hudFilterBtn" onclick="filterTransactionsFromHud()">
                  <i class="fa-solid fa-filter"></i> Saring Transaksi Kecamatan Ini
                </button>
              </div>
            </div>

            <!-- Regional Leaderboard -->
            <div class="tco-panel-header">
              <h3>
                <i class="fa-solid fa-ranking-star" style="color: #f59e0b;"></i>
                Ranking Asal Wilayah Polreg
              </h3>
              <button type="button" onclick="resetFilters()" style="background:none; border:none; font-size:11px; font-weight:700; color:#2563eb; cursor:pointer;">
                <i class="fa-solid fa-rotate"></i> Reset
              </button>
            </div>
            <div class="tco-polreg-list" id="polregLeaderboardList">
              <div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data ranking polreg...
              </div>
            </div>
          </div>
        </div>

        <!-- Secondary Analytics Row (3 Columns) -->
        <div class="tco-analytics-grid">
          <!-- Top 6 Accessories -->
          <div class="tco-widget-card">
            <div class="tco-widget-title">
              <span><i class="fa-solid fa-box-open" style="color: #d7123a; margin-right:6px;"></i> Aksesoris Terlaris</span>
              <span style="font-size:11px; color:#64748b; font-weight:600;">Top 6 Produk</span>
            </div>
            <div class="tco-top-items-list" id="topAccessoriesList">
              <div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Memuat data produk...</div>
            </div>
          </div>

          <!-- Model Kendaraan Terbanyak TCO -->
          <div class="tco-widget-card">
            <div class="tco-widget-title">
              <span><i class="fa-solid fa-car-side" style="color: #2563eb; margin-right:6px;"></i> Model Kendaraan Paling Populer</span>
              <span style="font-size:11px; color:#64748b; font-weight:600;">Per Qty Pasang</span>
            </div>
            <div id="modelDistributionList">
              <div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Memuat data model...</div>
            </div>
          </div>

          <!-- Top Salesman TCO Champions -->
          <div class="tco-widget-card">
            <div class="tco-widget-title">
              <span><i class="fa-solid fa-trophy" style="color: #f59e0b; margin-right:6px;"></i> Wiraniaga TCO Champions</span>
              <span style="font-size:11px; color:#64748b; font-weight:600;">Top 6 Sales</span>
            </div>
            <div class="tco-top-items-list" id="topSalesList">
              <div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Memuat data wiraniaga...</div>
            </div>
          </div>
        </div>

        <!-- Transactions Detail Table Card -->
        <div class="tco-table-card">
          <div class="tco-table-header">
            <div class="tco-table-title">
              <h3><i class="fa-solid fa-receipt" style="color: #0d1b3e; margin-right:6px;"></i> Rincian Transaksi Penjualan TCO &amp; Pemetaan SPK</h3>
              <p>Daftar transaksi aksesoris resmi TCO lengkap dengan nomor SPK, customer, dan koordinat wilayah registrasi.</p>
            </div>
            <div class="tco-table-actions">
              <div class="tco-search-box">
                <i class="fa-solid fa-magnifying-glass"></i>
                <input type="text" class="tco-search-input" id="tableSearchInput" placeholder="Cari SPK, sales, wilayah...">
              </div>
              <button type="button" class="tco-btn-export" onclick="exportTcoCsv()">
                <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> Unduh CSV / Excel
              </button>
            </div>
          </div>

          <div class="tco-table-responsive">
            <table class="tco-custom-table">
              <thead>
                <tr>
                  <th>No SPK</th>
                  <th>Tanggal</th>
                  <th>Nama Customer</th>
                  <th>Model Kendaraan</th>
                  <th>Item Aksesoris TCO</th>
                  <th>Wilayah &amp; Polreg</th>
                  <th>Salesman / SPV</th>
                  <th style="text-align:right;">Total Nilai</th>
                </tr>
              </thead>
              <tbody id="tcoTransactionsTbody">
                <tr>
                  <td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat daftar transaksi penjualan TCO...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal Input Penjualan TCO Baru -->
      <div class="tco-modal-overlay" id="inputTcoModal">
        <div class="tco-modal-box">
          <div class="tco-modal-header" style="background:#0f172a;">
            <h3><i class="fa-solid fa-plus-circle" style="color:#eb0a1e;"></i> Input Transaksi Penjualan TCO</h3>
            <button type="button" class="tco-modal-close" onclick="closeInputModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <form onsubmit="submitNewTransactionForm(event)">
            <div class="tco-modal-body">
              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="tco-form-group">
                  <label>Nomor SPK Kendaraan</label>
                  <input type="text" id="inputSpkNo" class="tco-form-input" placeholder="Contoh: KC-26-009124" required>
                </div>
                <div class="tco-form-group">
                  <label>Nama Customer</label>
                  <input type="text" id="inputCustomerName" class="tco-form-input" placeholder="Nama Pelanggan" required>
                </div>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="tco-form-group">
                  <label>Nama Wiraniaga (Sales)</label>
                  <input type="text" id="inputSalesName" class="tco-form-input" placeholder="Nama Salesman" required>
                </div>
                <div class="tco-form-group">
                  <label>Nama SPV</label>
                  <input type="text" id="inputSpvName" class="tco-form-input" placeholder="Nama Supervisor" value="FERYANTO" required>
                </div>
              </div>

              <div class="tco-form-group">
                <label>Model Kendaraan</label>
                <select id="inputCarModel" class="tco-form-select" required>
                  <option value="INNOVA ZENIX">Innova Zenix</option>
                  <option value="AVANZA NEW">Avanza New</option>
                  <option value="VELOZ NEW">Veloz New</option>
                  <option value="FORTUNER">Fortuner</option>
                  <option value="CALYA">Calya</option>
                  <option value="RUSH">Rush</option>
                  <option value="RAIZE">Raize</option>
                  <option value="AGYA">Agya</option>
                  <option value="HILUX">Hilux</option>
                  <option value="ALPHARD">Alphard</option>
                </select>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="tco-form-group">
                  <label>Nama Aksesoris TCO</label>
                  <input type="text" id="inputItemName" class="tco-form-input" placeholder="Contoh: Cross Over Package (Pkg A)" required>
                </div>
                <div class="tco-form-group">
                  <label>Harga Aksesoris (Rp)</label>
                  <input type="number" id="inputPrice" class="tco-form-input" placeholder="Contoh: 3430000" required>
                </div>
              </div>

              <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                <div class="tco-form-group">
                  <label>Wilayah Registrasi (Polreg)</label>
                  <select id="inputPolreg" class="tco-form-select" required>
                    <option value="Plat D - Kota Bandung">Plat D - Kota Bandung</option>
                    <option value="Plat D - Kab. Bandung">Plat D - Kab. Bandung</option>
                    <option value="Plat D - Kota Cimahi">Plat D - Kota Cimahi</option>
                    <option value="Plat D - Kab. Bandung Barat">Plat D - Kab. Bandung Barat</option>
                    <option value="Plat Z - Sumedang">Plat Z - Kab. Sumedang</option>
                    <option value="Plat Z - Garut">Plat Z - Kab. Garut</option>
                    <option value="Plat E - Cirebon">Plat E - Cirebon</option>
                    <option value="Plat F - Cianjur">Plat F - Cianjur / Sukabumi</option>
                  </select>
                </div>
                <div class="tco-form-group">
                  <label>Kecamatan Domisili Customer</label>
                  <input type="text" id="inputKecamatan" class="tco-form-input" placeholder="Contoh: Lengkong, Buahbatu, Soreang" required>
                </div>
              </div>
            </div>
            <div class="tco-modal-footer">
              <button type="button" class="btn btn-outline" onclick="closeInputModal()">Batal</button>
              <button type="submit" class="btn btn-primary" style="background:#eb0a1e; border:none; color:#ffffff;">
                <i class="fa-solid fa-save"></i> Simpan Transaksi
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>

  <!-- Scripts -->
  <script src="../custom_alert.js"></script>
  <script src="../js/penjualan_tco.js?v={{ time() }}"></script>
  <script src="../js/kacab_global.js?v=20260904_sheet_sync_fix"></script>
  <script src="../js/pwa-app.js?v=20261021_v20"></script>
</body>

</html>
