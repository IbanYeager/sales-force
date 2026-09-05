<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Statistik Penjualan Kiara Condong (KC 2026)</title>
  
  <!-- Font & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Kacab Theme & 2026 Sales Dashboard Styles -->
  <link rel="stylesheet" href="../css/style_kacab.css">
  <link rel="stylesheet" href="../css/sales_dashboard.css">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
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
          <p class="panel-sub">Kepala Cabang</p>
        </div>
      </div>

      <nav class="kcb-nav">
        <a href="index_kacab.html" id="navDash"><i class="fa-solid fa-gauge-high"></i>Dashboard Cabang</a>
        <a href="penjualan_kircon.html" id="navPenjualan" class="active"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 46 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="performa_regional.html" id="navRegional"><i class="fa-solid fa-earth-asia"></i>Performa Regional Jabar</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <!-- TOPBAR -->
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Statistik Penjualan Kiara Condong (KC 2026)</h2>
          <p class="page-sub">Monitoring performa penjualan unit, omset OTR, analisis leasing &amp; 46 wiraniaga</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Kepala Cabang</span>
            <span class="role" id="kcbRole">Tunas Toyota KC</span>
          </div>
        </div>
      </div>

      <!-- SALES EXECUTIVE DASHBOARD 2026 -->
      <div class="sales-dashboard-wrapper">
        
        <!-- Header Info & Actions -->
        <header class="app-header">
          <div class="header-brand">
            <div class="brand-badge-logo" title="Toyota KC">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="Logo Toyota" style="width: 24px; height: 24px;">
                <path d="M12 3.848C5.223 3.848 0 7.298 0 12c0 4.702 5.224 8.152 12 8.152S24 16.702 24 12c0-4.702-5.223-8.152-12-8.152zm7.334 3.839c0 1.08-1.725 1.913-4.488 2.246-.26-2.58-1.005-4.279-1.963-4.913 2.948.184 6.45 1.227 6.45 2.667zM12 16.401c-.96 0-1.746-1.5-1.808-4.389.577.047 1.18.072 1.808.072.628 0 1.23-.025 1.807-.072-.061 2.89-.847 4.389-1.807 4.389zm0-6.308c-.59 0-1.155-.019-1.69-.054.261-1.728.92-3.15 1.69-3.15.77 0 1.428 1.422 1.689 3.15-.535.034-1.099.054-1.689.054zm-.882-5.075c-.956.633-1.706 2.333-1.964 4.915C6.391 9.6 4.665 8.767 4.665 7.687c0-1.44 3.504-2.49 6.453-2.669zM2.037 11.68a5.265 5.265 0 011.048-3.164c.27 1.547 2.522 2.881 5.972 3.37V12c0 3.772.879 6.203 2.087 6.97-5.107-.321-9.107-3.48-9.107-7.29zm10.823 7.29c1.207-.767 2.087-3.198 2.087-6.97v-.115c3.447-.488 5.704-1.826 5.972-3.37a5.26 5.26 0 011.049 3.165c-.004 3.81-4.008 6.969-9.109 7.29z"/>
              </svg>
            </div>
            <div class="brand-info">
              <div class="brand-title-row">
                <h1 style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0;">TOYOTA KC &mdash; Sales Executive Dashboard</h1>
                <span class="header-tag" id="dataset-badge-tag">
                  <i data-lucide="calendar"></i>
                  <span>Jan &ndash; Jul 2026 (Dataset Excel Aktif)</span>
                </span>
              </div>
              <p style="font-size: 0.8rem; color: #64748b; margin: 2px 0 0 0;">Cabang Kiara Condong &bull; Monitoring Penjualan, Finansial &amp; Tim Sales</p>
            </div>
          </div>

          <div class="header-actions">
            <!-- Excel Upload Modal Trigger -->
            <button type="button" class="btn btn-outline" id="btn-open-upload-modal" title="Unggah file Excel update">
              <i data-lucide="upload-cloud"></i>
              <span>Upload Excel</span>
            </button>

            <!-- Export Dropdown -->
            <button type="button" class="btn btn-primary" id="btn-export-excel" title="Ekspor data hasil filter ke file Excel">
              <i data-lucide="download"></i>
              <span>Download Excel</span>
            </button>

            <!-- Theme Toggle (Dark/Light) -->
            <button type="button" class="btn btn-outline btn-icon-only" id="btn-toggle-theme" title="Ubah Tema Gelap / Terang">
              <i data-lucide="moon"></i>
            </button>
          </div>
        </header>

        <!-- GLOBAL FILTER BAR -->
        <section class="filter-bar" aria-label="Filter Data Penjualan">
          <!-- Top Row: Month Pills + Reset Button -->
          <div class="filter-row-top">
            <div class="month-pills-group">
              <span class="filter-section-label"><i data-lucide="calendar-range"></i> Bulan:</span>
              <div class="month-pills" id="month-pills-group">
                <button type="button" class="pill-btn active" data-month="ALL">Semua Bulan</button>
                <button type="button" class="pill-btn" data-month="Jan">Jan</button>
                <button type="button" class="pill-btn" data-month="Feb">Feb</button>
                <button type="button" class="pill-btn" data-month="Mar">Mar</button>
                <button type="button" class="pill-btn" data-month="Apr">Apr</button>
                <button type="button" class="pill-btn" data-month="May">Mei</button>
                <button type="button" class="pill-btn" data-month="Jun">Jun</button>
                <button type="button" class="pill-btn" data-month="Jul">Jul</button>
              </div>
            </div>

            <button type="button" class="btn btn-outline" id="btn-reset-filter" title="Reset semua filter ke kondisi awal">
              <i data-lucide="rotate-ccw"></i>
              <span>Reset Filter</span>
            </button>
          </div>

          <!-- Bottom Row: 5 Clean Filter Dropdowns -->
          <div class="filter-row-bottom">
            <!-- SPV Filter -->
            <div class="filter-field" title="Filter berdasarkan Supervisor">
              <span class="filter-field-icon"><i data-lucide="users"></i></span>
              <select id="filter-spv">
                <option value="ALL">Semua Supervisor</option>
              </select>
            </div>

            <!-- Model Filter -->
            <div class="filter-field" title="Filter berdasarkan Model Kendaraan">
              <span class="filter-field-icon"><i data-lucide="car"></i></span>
              <select id="filter-model">
                <option value="ALL">Semua Model</option>
              </select>
            </div>

            <!-- Payment Method Filter -->
            <div class="filter-field" title="Filter berdasarkan Metode Pembayaran">
              <span class="filter-field-icon"><i data-lucide="credit-card"></i></span>
              <select id="filter-method">
                <option value="ALL">Semua Metode Bayar</option>
                <option value="KREDIT">Kredit</option>
                <option value="CASH">Cash</option>
              </select>
            </div>

            <!-- PMA Filter -->
            <div class="filter-field" title="Filter berdasarkan Wilayah Pasar">
              <span class="filter-field-icon"><i data-lucide="map-pin"></i></span>
              <select id="filter-pma">
                <option value="ALL">Semua Wilayah</option>
                <option value="PMA">PMA (Pasar Utama)</option>
                <option value="NON PMA">Non PMA</option>
              </select>
            </div>

            <!-- Leasing Filter -->
            <div class="filter-field" title="Filter berdasarkan Mitra Leasing">
              <span class="filter-field-icon"><i data-lucide="landmark"></i></span>
              <select id="filter-leasing">
                <option value="ALL">Semua Leasing</option>
              </select>
            </div>
          </div>

          <!-- Active Filters Summary Tag -->
          <div class="filter-active-summary" id="filter-active-summary-row" style="display: none;">
            <span>Filter aktif:</span>
            <div class="active-badges" id="active-filters-badges"></div>
          </div>
        </section>

        <!-- MASTER EXECUTIVE KPI CARDS -->
        <section class="kpi-grid" aria-label="Key Performance Indicators">
          <!-- KPI 1: Total Unit -->
          <div class="kpi-card blue">
            <div class="kpi-header">
              <span class="kpi-title">Total Penjualan Unit</span>
              <div class="kpi-icon"><i data-lucide="car"></i></div>
            </div>
            <div class="kpi-value" id="kpi-total-unit">0 Unit</div>
            <div class="kpi-footer">
              <span class="kpi-pill"><i data-lucide="check"></i> Valid</span>
              <span id="kpi-unit-sub">504 unit</span>
            </div>
          </div>

          <!-- KPI 2: Total OTR -->
          <div class="kpi-card green">
            <div class="kpi-header">
              <span class="kpi-title">Total Omset (OTR)</span>
              <div class="kpi-icon"><i data-lucide="trending-up"></i></div>
            </div>
            <div class="kpi-value" id="kpi-total-otr">Rp 0</div>
            <div class="kpi-footer">
              <span class="kpi-pill"><i data-lucide="pie-chart"></i> Gross</span>
              <span id="kpi-otr-sub">Rata-rata OTR/unit</span>
            </div>
          </div>

          <!-- KPI 3: Total AR -->
          <div class="kpi-card purple">
            <div class="kpi-header">
              <span class="kpi-title">Nilai Piutang (Total AR)</span>
              <div class="kpi-icon"><i data-lucide="receipt"></i></div>
            </div>
            <div class="kpi-value" id="kpi-total-ar">Rp 0</div>
            <div class="kpi-footer">
              <span class="kpi-pill"><i data-lucide="shield-check"></i> AR</span>
              <span id="kpi-ar-sub">Realisasi AR</span>
            </div>
          </div>

          <!-- KPI 4: Total Discount -->
          <div class="kpi-card amber">
            <div class="kpi-header">
              <span class="kpi-title">Total Diskon Diberikan</span>
              <div class="kpi-icon"><i data-lucide="tag"></i></div>
            </div>
            <div class="kpi-value" id="kpi-total-discount">Rp 0</div>
            <div class="kpi-footer">
              <span class="kpi-pill"><i data-lucide="percent"></i> Margin</span>
              <span id="kpi-disc-sub">Rata-rata diskon</span>
            </div>
          </div>

          <!-- KPI 5: Penetrasi Kredit -->
          <div class="kpi-card cyan">
            <div class="kpi-header">
              <span class="kpi-title">Penetrasi Kredit</span>
              <div class="kpi-icon"><i data-lucide="credit-card"></i></div>
            </div>
            <div class="kpi-value" id="kpi-kredit-ratio">0%</div>
            <div class="kpi-footer">
              <span class="kpi-pill"><i data-lucide="landmark"></i> Rasio</span>
              <span id="kpi-kredit-sub">Kredit vs Cash</span>
            </div>
          </div>
        </section>

        <!-- NAVIGATION TABS -->
        <nav class="tabs-nav" aria-label="Kategori Dashboard">
          <button type="button" class="tab-btn active" data-tab="overview">
            <i data-lucide="layout-dashboard"></i>
            <span>Ringkasan Eksekutif</span>
          </button>
          <button type="button" class="tab-btn" data-tab="models">
            <i data-lucide="layers"></i>
            <span>Analisis Model &amp; Produk</span>
          </button>
          <button type="button" class="tab-btn" data-tab="sales">
            <i data-lucide="award"></i>
            <span>Kinerja Tim Sales &amp; SPV</span>
          </button>
          <button type="button" class="tab-btn" data-tab="financial">
            <i data-lucide="circle-dollar-sign"></i>
            <span>Finansial &amp; Leasing</span>
          </button>
          <button type="button" class="tab-btn" data-tab="demographics">
            <i data-lucide="map-pinned"></i>
            <span>Wilayah &amp; Konsumen</span>
          </button>
          <button type="button" class="tab-btn" data-tab="table">
            <i data-lucide="table-2"></i>
            <span>Eksplorasi Data Transaksi</span>
          </button>
        </nav>

        <!-- TAB 1: RINGKASAN EKSEKUTIF (OVERVIEW) -->
        <section class="tab-pane active" id="tab-overview" aria-label="Tab Ringkasan Eksekutif">
          <div class="dashboard-grid">
            <!-- Monthly Trend (Unit & Omset Dual Axis) -->
            <div class="col-8">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="bar-chart-2"></i> Tren Volume Penjualan &amp; Omset Bulanan</h3>
                    <p>Volume unit terjual dan nilai omset OTR (Januari s/d Juli 2026)</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-monthly-trend"></div>
              </div>
            </div>

            <!-- Payment Method Share (Kredit vs Cash) -->
            <div class="col-4">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="wallet"></i> Metode Pembayaran</h3>
                    <p>Proporsi transaksi Kredit vs Tunai (Cash)</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-payment-method"></div>
              </div>
            </div>

            <!-- Top 6 Models Bar -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="trophy"></i> Top 6 Model Terlaris</h3>
                    <p>Kendaraan dengan volume kontribusi penjualan terbesar</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-top-models"></div>
              </div>
            </div>

            <!-- SPV Team Performance Donut -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="users"></i> Distribusi Kinerja Supervisor (SPV)</h3>
                    <p>Pangsa kontribusi penjualan unit dari masing-masing tim SPV</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-spv-performance"></div>
              </div>
            </div>

            <!-- Executive Insight Card -->
            <div class="col-12">
              <div class="insight-box">
                <div class="insight-icon">
                  <i data-lucide="sparkles"></i>
                </div>
                <div class="insight-text">
                  <h4 id="insight-title">Analisis Eksekutif &amp; Ringkasan Kinerja</h4>
                  <p id="insight-text">Memuat analisis kinerja cabang...</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 2: ANALISIS MODEL & PRODUK -->
        <section class="tab-pane" id="tab-models" aria-label="Tab Analisis Model">
          <div class="dashboard-grid">
            <!-- All 15 Models Ranking Bar Chart -->
            <div class="col-7">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="car"></i> Seluruh Model Kendaraan Toyota (Terurut)</h3>
                    <p>Total unit terjual dan nilai omset per lini produk</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-all-models"></div>
              </div>
            </div>

            <!-- Segment Share (MPV, SUV, Hybrid, LCGC, Niaga) -->
            <div class="col-5">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="pie-chart"></i> Komposisi Segmen Kendaraan</h3>
                    <p>Pangsa pasar MPV, LCGC, SUV, Hybrid, dan Komersial</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-segment-share"></div>
              </div>
            </div>

            <!-- Top Exterior Colors -->
            <div class="col-12">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="palette"></i> Warna Eksterior Paling Diminati</h3>
                    <p>Pilihan warna unit yang paling sering dipesan oleh konsumen</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-colors"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 3: KINERJA TIM SALES & SPV -->
        <section class="tab-pane" id="tab-sales" aria-label="Tab Kinerja Tim Sales">
          <!-- SPV Team Summary Cards -->
          <div class="spv-summary-grid" id="spv-cards-container"></div>

          <!-- Salesman Podium (Top 3) -->
          <div class="content-card" style="margin-bottom: 0.85rem;">
            <div class="card-header">
              <div class="card-title-group">
                <h3><i data-lucide="medal"></i> Podium Top Salesman Toyota KC 2026</h3>
                <p>Juara pencapaian unit dan kontribusi omset tertinggi</p>
              </div>
            </div>
            <div class="podium-container" id="sales-podium-container"></div>
          </div>

          <!-- Full Salesman Matrix Table -->
          <div class="content-card">
            <div class="table-toolbar">
              <div class="card-title-group">
                <h3><i data-lucide="users"></i> Matriks Performa 46 Salesman (Januari &ndash; Juli)</h3>
                <p>Rincian unit bulanan, total omset OTR, dan rata-rata diskon per salesman</p>
              </div>
              <div class="table-search-box">
                <i data-lucide="search"></i>
                <input type="text" id="input-salesman-search" placeholder="Cari nama salesman atau SPV...">
              </div>
            </div>

            <div class="table-responsive">
              <table class="data-table" id="table-salesman-matrix">
                <thead>
                  <tr>
                    <th style="width: 44px; text-align: center;">Rank</th>
                    <th>Nama Sales Person</th>
                    <th>Supervisor</th>
                    <th class="num">Jan</th>
                    <th class="num">Feb</th>
                    <th class="num">Mar</th>
                    <th class="num">Apr</th>
                    <th class="num">Mei</th>
                    <th class="num">Jun</th>
                    <th class="num">Jul</th>
                    <th class="num" style="color: var(--primary);">Total Unit</th>
                    <th class="num">Total OTR</th>
                    <th class="num">Rata-rata Diskon</th>
                  </tr>
                </thead>
                <tbody id="tbody-salesman-matrix">
                  <!-- Dynamically injected -->
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <!-- TAB 4: FINANSIAL, DISKON & LEASING -->
        <section class="tab-pane" id="tab-financial" aria-label="Tab Finansial & Leasing">
          <div class="dashboard-grid">
            <!-- Leasing Provider Market Share -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="landmark"></i> Pangsa Pasar Lembaga Pembiayaan (Leasing)</h3>
                    <p>Distribusi mitra leasing pembiayaan kredit (TAFS, MTF, ACC, BCA, dll.)</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-leasing-share"></div>
              </div>
            </div>

            <!-- Average Discount per Model -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="badge-percent"></i> Rata-rata Diskon per Model Kendaraan</h3>
                    <p>Tingkat diskon (dalam Juta Rupiah) per unit mobil</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-avg-discount"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 5: WILAYAH, PROSPEK & KONSUMEN -->
        <section class="tab-pane" id="tab-demographics" aria-label="Tab Wilayah & Konsumen">
          <div class="dashboard-grid">
            <!-- PMA vs Non PMA Ratio -->
            <div class="col-5">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="target"></i> Status Wilayah: PMA vs Non-PMA</h3>
                    <p>Penjualan di wilayah pasar utama (PMA) vs luar PMA</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-pma-share"></div>
              </div>
            </div>

            <!-- Top Cities Distribution -->
            <div class="col-7">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="map-pin"></i> Sebaran Kota &amp; Kabupaten Domisili</h3>
                    <p>Domisili tempat tinggal pembeli kendaraan</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-top-cities"></div>
              </div>
            </div>

            <!-- Prospect Source -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="radio"></i> Sumber Prospek Penjualan</h3>
                    <p>Kanal akuisisi prospek (Referensi, Iklan/Digital, Repeat Order, Medsos)</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-prospect-source"></div>
              </div>
            </div>

            <!-- Buyer Profile -->
            <div class="col-6">
              <div class="content-card">
                <div class="card-header">
                  <div class="card-title-group">
                    <h3><i data-lucide="user-check"></i> Profil Pembeli Mobil</h3>
                    <p>First Buyer (58%) vs Mobil Tambahan (36%) vs Pengganti (6%)</p>
                  </div>
                </div>
                <div class="chart-wrapper" id="chart-buyer-profile"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- TAB 6: EKSPLORASI DATA TRANSAKSI -->
        <section class="tab-pane" id="tab-table" aria-label="Tab Eksplorasi Data">
          <div class="content-card">
            <div class="table-toolbar">
              <div class="table-search-box" style="width: 300px;">
                <i data-lucide="search"></i>
                <input type="text" id="input-table-search" placeholder="Cari nama customer, faktur, salesman, mobil...">
              </div>

              <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                <div class="filter-field" style="padding: 0.25rem 0.5rem;">
                  <label for="select-page-size" style="font-size: 0.725rem; color: var(--text-muted); margin-right: 0.35rem;">Baris:</label>
                  <select id="select-page-size">
                    <option value="10">10</option>
                    <option value="20" selected>20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>

                <button type="button" class="btn btn-outline" id="btn-export-csv" title="Ekspor data ke format CSV">
                  <i data-lucide="file-text"></i>
                  <span>Ekspor CSV</span>
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>No. Faktur</th>
                    <th>Tanggal</th>
                    <th>Nama Customer</th>
                    <th>Model Kendaraan</th>
                    <th>Sales Person</th>
                    <th>Supervisor</th>
                    <th>Metode</th>
                    <th class="num">Harga OTR</th>
                    <th class="num">Diskon</th>
                    <th>Wilayah</th>
                  </tr>
                </thead>
                <tbody id="tbody-transactions">
                  <!-- Dynamically injected -->
                </tbody>
              </table>
            </div>

            <div class="table-pagination">
              <span id="table-page-info">Menampilkan data...</span>
              <div class="pagination-controls" id="table-pagination-controls"></div>
            </div>
          </div>
        </section>

      </div>

      <!-- MODAL: UPLOAD EXCEL BARU (DYNAMIC DATA SYNC) -->
      <div class="modal-backdrop" id="modal-upload-excel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-title"><i data-lucide="upload-cloud"></i> Perbarui Data Penjualan (Excel)</h3>
            <button type="button" class="modal-close-btn" id="btn-close-upload-modal" aria-label="Tutup Modal">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="upload-dropzone" id="upload-dropzone">
            <i data-lucide="file-spreadsheet"></i>
            <h4>Tarik &amp; Lepaskan File Excel ke Sini</h4>
            <p>Atau klik untuk memilih file dari komputer (.xlsx, .xls)</p>
            <input type="file" id="input-file-excel" accept=".xlsx, .xls" style="display: none;">
          </div>

          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">
            <strong>Catatan:</strong> Format yang didukung adalah file Excel dengan lembar <code>SOURCE DATA</code>. Seluruh visualisasi akan otomatis diperbarui seketika.
          </p>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="btn-reset-default-data">Kembalikan Data Bawaan 2026</button>
            <button type="button" class="btn btn-primary" id="btn-cancel-upload">Tutup</button>
          </div>
        </div>
      </div>

      <!-- Toast Notification Placeholder -->
      <div id="toast-container" class="toast-container"></div>
    </main>
  </div>

  <!-- Legacy Kacab Scripts -->
  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js?v=20260904_sheet_sync_fix"></script>

  <!-- Vendor for 2026 Sales Dashboard -->
  <script src="../js/apexcharts.min.js"></script>
  <script src="../js/xlsx.full.min.js"></script>
  <script src="../js/lucide.min.js"></script>

  <!-- 2026 Sales Dashboard Core Modules -->
  <script src="../js/initial_sales_data.js"></script>
  <script src="../js/sales_analytics.js"></script>
  <script src="../js/sales_charts.js"></script>
  <script src="../js/sales_dashboard.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
