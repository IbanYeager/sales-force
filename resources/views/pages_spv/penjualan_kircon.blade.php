<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Statistik Penjualan Kiara Condong</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/penjualan_kircon.css">
  <link rel="stylesheet" href="../css/penjualan_kircon_map.css?v={{ time() }}">

  <!-- Leaflet Map CSS & JS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1c2740">
</head>

<body>
  <div class="spv-shell">
    <!-- SIDEBAR SPV -->
    <aside class="spv-sidebar">
      <div class="spv-brand-container">
        <div class="spv-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="spv-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-user-tie"></i> SPV PANEL</span>
          <p class="panel-sub">Desktop Supervisor</p>
        </div>
      </div>

            <div class="spv-search-wrap">
        <div class="spv-search-box">
          <i class="fa-solid fa-magnifying-glass spv-search-icon"></i>
          <input type="text" class="spv-search-input" id="spvSearchInput" placeholder="Cari menu & fitur..." autocomplete="off" spellcheck="false">
          <button type="button" class="spv-search-clear" id="spvSearchClear" style="display:none;" title="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="spv-nav">
        <!-- Kategori 1: Overview & Target -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-chart-line"></i> Overview &amp; Target</span>
          <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard SPV</a>
          <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Pencapaian</a>
          <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
          <a href="penjualan_tco.html" id="navTco"><i class="fa-solid fa-gem"></i>Penjualan &amp; Polreg TCO</a>
          <a href="penjualan_merchandise.html" id="navMerchandise"><i class="fa-solid fa-shirt"></i>Penjualan Merchandise</a>
        </div>

        <!-- Kategori 2: Pipeline & Approval -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-funnel-dollar"></i> Pipeline &amp; Approval</span>
          <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
          <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Otorisasi &amp; Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
          <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        </div>

        <!-- Kategori 3: Supervisi Tim Sales -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-users-gear"></i> Supervisi Tim Sales</span>
          <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Tim Wiraniaga</a>
          <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Monitoring Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
          <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas"><i class="fa-solid fa-images"></i>Galeri Foto Aktivitas</a>
          <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
          <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
          <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        </div>

        <!-- Kategori 4: Stok & Operasional -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-warehouse"></i> Stok &amp; Operasional</span>
          <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
          <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
          <a href="mtoyota_service.html" id="navMtoyota"><i class="fa-solid fa-car-on"></i>m-Toyota &amp; Service</a>
          <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data Cabang</a>
        </div>

        <div class="spv-search-empty" id="spvSearchEmpty" style="display:none;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Menu tidak ditemukan</p>
          <span>Coba gunakan kata kunci lain</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle">Statistik Penjualan Kiara Condong</h2>
          <p class="page-sub">Monitoring performa penjualan unit, analisis leasing, serta sebaran pelanggan real-time</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Supervisor</span>
          </div>
        </div>
      </div>

      <!-- KIRTCON CONTENT CONTAINER -->
      <div style="margin-top: 10px;">
        <!-- Hero Card -->
        <div class="kircon-hero-card">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2 class="kircon-hero-title">
                <i class="fa-solid fa-chart-line" style="color: #2563eb;"></i>
                Statistik Penjualan Tunas Toyota Kiara Condong
              </h2>
              <p class="kircon-hero-sub">Monitoring performa penjualan unit, analisis leasing, serta sebaran pelanggan real-time.</p>
            </div>
            <span id="heroBadge" style="background: rgba(255,255,255,0.18); backdrop-filter: blur(10px); color: white; padding: 8px 16px; border-radius: 12px; font-size: 13px; font-weight: 700; border: 1px solid rgba(255,255,255,0.25);">
              <i class="fa-solid fa-building-circle-check" style="margin-right: 6px;"></i>Cabang Kiara Condong
            </span>
          </div>
        </div>

        <!-- KPI Cards Grid -->
        <div class="kircon-kpi-grid">
          <div class="kircon-kpi-card">
            <div>
              <div class="kircon-kpi-icon red">
                <i class="fa-solid fa-car"></i>
              </div>
              <div class="kircon-kpi-label">Total Unit Terjual</div>
              <div class="kircon-kpi-value" id="kpiTotalUnits">-</div>
            </div>
            <div class="kircon-kpi-detail" id="kpiTotalTransDetail">- Transaksi</div>
          </div>

          <div class="kircon-kpi-card">
            <div>
              <div class="kircon-kpi-icon blue">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <div class="kircon-kpi-label">Top Model</div>
              <div class="kircon-kpi-value" id="kpiTopModel" style="font-size: 17px;">-</div>
            </div>
            <div class="kircon-kpi-detail" id="kpiTopModelQty">- Unit</div>
          </div>

          <div class="kircon-kpi-card">
            <div>
              <div class="kircon-kpi-icon emerald">
                <i class="fa-solid fa-hand-holding-dollar"></i>
              </div>
              <div class="kircon-kpi-label">Top Leasing</div>
              <div class="kircon-kpi-value" id="kpiTopLeasing" style="font-size: 17px;">-</div>
            </div>
            <div class="kircon-kpi-detail" id="kpiTopLeasingCount">- Transaksi</div>
          </div>

          <div class="kircon-kpi-card">
            <div>
              <div class="kircon-kpi-icon amber">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="kircon-kpi-label">Wilayah Domisili</div>
              <div class="kircon-kpi-value" id="kpiTopKota" style="font-size: 17px;">-</div>
            </div>
            <div class="kircon-kpi-detail" id="kpiTopKotaQty">- Unit</div>
          </div>
        </div>

        <!-- Filter Controls -->
        <div class="kircon-filter-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
            <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: var(--text-dark, #0f172a); display: flex; align-items: center; gap: 8px;">
              <i class="fa-solid fa-sliders" style="color: #2563eb;"></i> Filter &amp; Pencarian
            </h3>
            <span id="filteredCountBadge" style="font-size: 12px; font-weight: 700; color: #64748b;">Memuat...</span>
          </div>
          <div class="kircon-filter-grid">
            <div class="kircon-filter-group">
              <label for="filterYear">Tahun</label>
              <select id="filterYear" onchange="onFilterChange()">
                <option value="all">Semua Tahun</option>
              </select>
            </div>

            <div class="kircon-filter-group">
              <label for="filterMonth">Bulan</label>
              <select id="filterMonth" onchange="onFilterChange()">
                <option value="all">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
            </div>

            <div class="kircon-filter-group">
              <label for="filterModel">Model Mobil</label>
              <select id="filterModel" onchange="onFilterChange()">
                <option value="all">Semua Model</option>
              </select>
            </div>

            <div class="kircon-filter-group">
              <label for="filterLeasing">Leasing / Finance</label>
              <select id="filterLeasing" onchange="onFilterChange()">
                <option value="all">Semua Leasing</option>
              </select>
            </div>

            <div class="kircon-filter-group">
              <label for="filterSearch">Kata Kunci</label>
              <input type="text" id="filterSearch" placeholder="Cari nama, VIN, sales..." oninput="onFilterChange()">
            </div>

            <div class="kircon-filter-group">
              <button class="kircon-btn-reset" onclick="resetFilters()">
                <i class="fa-solid fa-rotate-left"></i> Reset Filter
              </button>
            </div>
          </div>
        </div>

        <!-- Charts Section -->
        <div class="kircon-charts-grid">
          <div class="kircon-chart-card" style="grid-column: 1 / -1;">
            <div class="kircon-chart-header">
              <h4 class="kircon-chart-title">
                <i class="fa-solid fa-chart-column" style="color: #2563eb;"></i> Tren Penjualan Bulanan
              </h4>
              <span style="font-size: 11px; color: #64748b; font-weight: 600;">Jumlah Unit Terjual</span>
            </div>
            <div class="kircon-chart-container">
              <canvas id="chartMonthly"></canvas>
            </div>
          </div>

          <div class="kircon-chart-card">
            <div class="kircon-chart-header">
              <h4 class="kircon-chart-title">
                <i class="fa-solid fa-pie-chart" style="color: #f43f5e;"></i> Penjualan per Model
              </h4>
            </div>
            <div class="kircon-chart-container">
              <canvas id="chartModel"></canvas>
            </div>
          </div>

          <div class="kircon-chart-card">
            <div class="kircon-chart-header">
              <h4 class="kircon-chart-title">
                <i class="fa-solid fa-building-columns" style="color: #10b981;"></i> Distribusi Leasing &amp; Finance
              </h4>
            </div>
            <div class="kircon-chart-container">
              <canvas id="chartLeasing"></canvas>
            </div>
          </div>
        </div>

        <!-- PETA SEBARAN WILAYAH (DO & SPK PER KECAMATAN BANDUNG RAYA) -->
        <div class="kircon-mapping-card">
          <!-- Header Card -->
          <div class="kircon-map-header">
            <div class="kircon-map-title-wrap">
              <div class="kircon-map-icon-badge">
                <i class="fa-solid fa-map-location-dot"></i>
              </div>
              <div>
                <h3>Peta Sebaran Wilayah &amp; Pemetaan Kecamatan (DO &amp; SPK)</h3>
                <p>Choropleth 79 kecamatan Bandung Raya, sebaran real-time delivery unit (DO) &amp; pemesanan (SPK)</p>
              </div>
            </div>

            <!-- Header Mini Live KPIs -->
            <div class="kircon-map-kpis-mini">
              <div class="kircon-mini-kpi-item">
                <span class="lbl">Unit DO Terkirim</span>
                <span class="val highlight-do" id="kirconMiniDo">0 Unit</span>
              </div>
              <div class="kircon-mini-kpi-item">
                <span class="lbl">Total SPK</span>
                <span class="val highlight-spk" id="kirconMiniSpk">0 SPK</span>
              </div>
              <div class="kircon-mini-kpi-item">
                <span class="lbl">Realisasi DO</span>
                <span class="val" id="kirconMiniRatio">0%</span>
              </div>
              <div class="kircon-mini-kpi-item">
                <span class="lbl">Nilai Omset OTR</span>
                <span class="val" id="kirconMiniRev">Rp 0</span>
              </div>
            </div>

            <!-- Controls -->
            <div class="kircon-map-controls">
              <select class="kircon-select-map-filter" id="kirconMapFilterStatus" onchange="KirconDistrictMap.filterByStatus(this.value)">
                <option value="all">Semua Status Penetrasi</option>
                <option value="Tinggi">🟢 Penetrasi Tinggi (&ge;15 DO)</option>
                <option value="Sedang">🔵 Penetrasi Sedang (6-14 DO)</option>
                <option value="Rendah">🔴 Penetrasi Baru (1-5 DO)</option>
                <option value="Belum Ada">⚪ Belum Ada Transaksi (0 DO)</option>
              </select>

              <button type="button" class="kircon-map-btn active" id="kirconBtnRoadmap" onclick="KirconDistrictMap.setBaseLayer('roadmap')">
                <i class="fa-solid fa-map"></i> Roadmap
              </button>
              <button type="button" class="kircon-map-btn" id="kirconBtnSatellite" onclick="KirconDistrictMap.setBaseLayer('satellite')">
                <i class="fa-solid fa-satellite"></i> Satelit
              </button>
              <button type="button" class="kircon-map-btn" id="kirconBtnToggleLabels" onclick="KirconDistrictMap.toggleLabels()" title="Tampilkan / Sembunyikan label nama kecamatan">
                <i class="fa-solid fa-tag"></i> Label: Bersih
              </button>
              <button type="button" class="kircon-map-btn" onclick="KirconDistrictMap.recenterHQ()" title="Pusatkan ke Kantor Dealer Tunas Toyota Kiara Condong">
                <i class="fa-solid fa-building-flag" style="color: #d7123a;"></i> Kantor KC
              </button>
            </div>
          </div>

          <!-- Quick Regency Filter Bar -->
          <div class="kircon-quick-area-bar">
            <span style="font-size: 11px; font-weight: 800; color: var(--krc-map-muted); white-space: nowrap;">
              <i class="fa-solid fa-layer-group"></i> Filter Wilayah:
            </span>
            <button type="button" class="kircon-area-pill active" data-regency="all" onclick="KirconDistrictMap.filterByRegency('all')">
              Semua Wilayah (79)
            </button>
            <button type="button" class="kircon-area-pill" data-regency="kota_bandung" onclick="KirconDistrictMap.filterByRegency('kota_bandung')">
              Kota Bandung (30)
            </button>
            <button type="button" class="kircon-area-pill" data-regency="kota_cimahi" onclick="KirconDistrictMap.filterByRegency('kota_cimahi')">
              Kota Cimahi (3)
            </button>
            <button type="button" class="kircon-area-pill" data-regency="kab_bandung" onclick="KirconDistrictMap.filterByRegency('kab_bandung')">
              Kab. Bandung (31)
            </button>
            <button type="button" class="kircon-area-pill" data-regency="kab_bandung_barat" onclick="KirconDistrictMap.filterByRegency('kab_bandung_barat')">
              Kab. Bandung Barat (15)
            </button>
          </div>

          <!-- Body Grid: Map Canvas + Inspector HUD / Leaderboard -->
          <div class="kircon-map-body-grid">
            <div class="kircon-map-canvas-container">
              <div id="kirconDistrictsMap"></div>
            </div>

            <div class="kircon-polreg-panel">
              <!-- Inspector HUD -->
              <div class="kircon-inspector-hud" id="kirconInspectorHud">
                <span class="kircon-hud-tag" id="kirconHudTag">KOTA BANDUNG • BANDUNG TENGAH</span>
                <div class="kircon-hud-title-row">
                  <h3 id="kirconHudTitle">Kiaracondong</h3>
                  <span class="kircon-hud-status-badge high" id="kirconHudBadge">
                    <i class="fa-solid fa-circle-check"></i> Penetrasi Tinggi
                  </span>
                </div>

                <!-- 4-Stat Box Grid -->
                <div class="kircon-hud-stats-grid">
                  <div class="kircon-hud-stat-box">
                    <span class="lbl">Unit DO Terkirim</span>
                    <div class="val" style="color: #10b981;" id="kirconHudDoVal">0 Unit</div>
                    <span class="sub" id="kirconHudRatioVal">0% Realisasi</span>
                  </div>
                  <div class="kircon-hud-stat-box">
                    <span class="lbl">Total SPK Terbit</span>
                    <div class="val" style="color: #2563eb;" id="kirconHudSpkVal">0 Pesanan</div>
                    <span class="sub" id="kirconHudRevVal">Rp 0</span>
                  </div>
                </div>

                <!-- Highlights Box -->
                <div class="kircon-hud-highlights">
                  <div class="kircon-highlight-row">
                    <div class="kircon-highlight-icon car"><i class="fa-solid fa-car"></i></div>
                    <div class="kircon-highlight-info">
                      <span class="lbl">Model Terlaris #1:</span>
                      <strong class="val" id="kirconHudTopModel">Memuat...</strong>
                    </div>
                  </div>
                  <div class="kircon-highlight-row">
                    <div class="kircon-highlight-icon sales"><i class="fa-solid fa-user-tie"></i></div>
                    <div class="kircon-highlight-info">
                      <span class="lbl">Sales Kontributor Terbanyak:</span>
                      <strong class="val" id="kirconHudTopSales">Memuat...</strong>
                    </div>
                  </div>
                </div>

                <button type="button" class="kircon-hud-filter-btn" onclick="KirconDistrictMap.filterTransactionsByDistrict()">
                  <i class="fa-solid fa-filter"></i> Lihat Transaksi Wilayah Ini
                </button>
              </div>

              <!-- Leaderboard Ranking -->
              <div class="kircon-leaderboard-header">
                <h4><i class="fa-solid fa-trophy" style="color: #f59e0b;"></i> Top 10 Kecamatan</h4>
                <span style="font-size: 11px; font-weight: 700; color: var(--krc-map-muted);">DO &amp; SPK</span>
              </div>
              <div class="kircon-leaderboard-list" id="kirconLeaderboardList">
                <!-- Populated dynamically via JS -->
              </div>
            </div>
          </div>

          <!-- Legend Strip -->
          <div class="kircon-map-legend">
            <span style="font-size: 11px; font-weight: 800; color: var(--krc-map-muted); margin-right: 4px;">
              <i class="fa-solid fa-circle-info"></i> Legenda:
            </span>
            <div class="kircon-legend-item">
              <span class="kircon-legend-dot high"></span>
              <span>Penetrasi Tinggi (&ge;15 Unit DO)</span>
            </div>
            <div class="kircon-legend-item">
              <span class="kircon-legend-dot mid"></span>
              <span>Penetrasi Sedang (6 - 14 Unit DO)</span>
            </div>
            <div class="kircon-legend-item">
              <span class="kircon-legend-dot low"></span>
              <span>Penetrasi Baru (1 - 5 Unit DO)</span>
            </div>
            <div class="kircon-legend-item">
              <span class="kircon-legend-dot zero"></span>
              <span>Belum Ada Transaksi (0 Unit)</span>
            </div>
          </div>
        </div>

        <!-- Data Table Section -->
        <div class="kircon-table-card">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
            <div>
              <h3 style="margin: 0; font-size: 15px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                <i class="fa-solid fa-list-check" style="color: #2563eb;"></i> Daftar Transaksi Penjualan
              </h3>
              <p style="font-size: 12px; color: #64748b; margin: 2px 0 0 0;">Klik pada baris mana saja untuk melihat rincian lengkap transaksi.</p>
            </div>
            <div id="tableInfo" style="font-size: 12px; font-weight: 700; color: #64748b;">
              Menampilkan 0 data
            </div>
          </div>

          <div class="kircon-table-wrapper">
            <table class="kircon-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tgl Sales</th>
                  <th>SPK No</th>
                  <th>Nama Customer</th>
                  <th>Model &amp; Type</th>
                  <th>No VIN / Rangka</th>
                  <th>Metode / Leasing</th>
                  <th>Salesman</th>
                  <th>SPV</th>
                  <th>Kota</th>
                </tr>
              </thead>
              <tbody id="tableBody">
                <tr>
                  <td colspan="10" style="text-align: center; padding: 40px 0; color: #64748b;">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data penjualan...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Detail Transaction Modal -->
      <div class="kircon-modal-overlay" id="detailModal">
        <div class="kircon-modal-box">
          <div class="kircon-modal-header">
            <h3><i class="fa-solid fa-file-invoice" style="color: #2563eb; margin-right: 8px;"></i> Rincian Transaksi Penjualan</h3>
            <button class="kircon-modal-close" onclick="closeDetailModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="kircon-modal-body" id="modalDetailBody">
            <!-- Populated dynamically via JS -->
          </div>
        </div>
      </div>
    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kircon_district_map.js?v={{ time() }}"></script>
  <script src="../js/penjualan_kircon.js"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/pwa-app.js?v=20261021_v20"></script>
</body>

</html>
