<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Statistik Penjualan Kiara Condong</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/penjualan_kircon.css">
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

      <nav class="spv-nav">
        <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
        <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
        <a href="penjualan_kircon.html" id="navPenjualan" class="active"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data</a>
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
  <script src="../js/penjualan_kircon.js"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
