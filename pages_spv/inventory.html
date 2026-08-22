<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Live Inventory &amp; Stok Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/inventory.css?v=20260819_spv">

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
        <a href="inventory.html" id="navInventory" class="active"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
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
          <h2 id="pageTitle">Live Inventory &amp; Stok Toyota</h2>
          <p class="page-sub">Monitoring ketersediaan unit real-time seluruh cabang &amp; gudang pusat terintegrasi</p>
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

      <!-- INVENTORY CONTAINER -->
      <div style="margin-top: 10px;">
        <!-- Top Stats & Search Card -->
        <div class="inv-top-card">
          <div class="inv-header-row">
            <div>
              <h3 class="inv-title">
                <i class="fa-solid fa-boxes-stacked" style="color: var(--primary-blue, #2563eb); margin-right: 8px;"></i>
                Live Inventory &amp; Stock Toyota
              </h3>
              <p class="inv-subtitle">Data stok real-time seluruh cabang &amp; pool gudang pusat terintegrasi otomatis.</p>
            </div>
            <button class="btn-refresh-pill" onclick="loadInventory()" title="Segarkan Data Stok">
              <i class="fa-solid fa-rotate-right"></i> Refresh
            </button>
          </div>

          <!-- Stats Summary Row -->
          <div class="inv-stats-grid">
            <div class="inv-stat-item stat-ready">
              <div class="stat-icon"><i class="fa-solid fa-circle-check"></i></div>
              <div class="stat-meta">
                <span class="stat-val" id="totalReadyText">0</span>
                <span class="stat-lbl">Ready Stock</span>
              </div>
            </div>
            <div class="inv-stat-item stat-total">
              <div class="stat-icon"><i class="fa-solid fa-car"></i></div>
              <div class="stat-meta">
                <span class="stat-val" id="totalUnitText">0</span>
                <span class="stat-lbl">Total Unit</span>
              </div>
            </div>
            <div class="inv-stat-item stat-matched">
              <div class="stat-icon"><i class="fa-solid fa-lock"></i></div>
              <div class="stat-meta">
                <span class="stat-val" id="totalMatchedText">0</span>
                <span class="stat-lbl">Matched / Hold</span>
              </div>
            </div>
            <div class="inv-stat-item stat-models">
              <div class="stat-icon"><i class="fa-solid fa-layer-group"></i></div>
              <div class="stat-meta">
                <span class="stat-val" id="totalModelsText">0</span>
                <span class="stat-lbl">Model &amp; Varian</span>
              </div>
            </div>
          </div>

          <!-- Search and Action Bar -->
          <div class="search-bar" style="margin-top: 14px; margin-bottom: 12px;">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass search-icon"></i>
              <input type="text" id="searchInput" class="form-control search-input-styled"
                placeholder="Cari model, varian, no rangka, warna, kode RRN, cabang..." oninput="filterData()">
              <button type="button" id="clearSearchBtn" class="clear-search-btn" style="display:none;"
                onclick="clearSearch()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <button class="btn-filter-square" onclick="openFilterModal()" title="Filter Lanjutan">
              <i class="fa-solid fa-sliders"></i>
              <span id="activeFilterBadge" class="filter-count-badge" style="display: none;">0</span>
            </button>
          </div>

          <!-- Category & Quick Filter Chips -->
          <div class="quick-chips-wrapper">
            <button class="chip-item active" data-chip="" onclick="selectCategoryChip('')">
              <i class="fa-solid fa-layer-group"></i> Semua Unit
            </button>
            <button class="chip-item chip-ready" data-chip="READY_ONLY" onclick="selectCategoryChip('READY_ONLY')">
              <i class="fa-solid fa-bolt"></i> Ready Stock Saja
            </button>
            <button class="chip-item" data-chip="MPV" onclick="selectCategoryChip('MPV')">MPV</button>
            <button class="chip-item" data-chip="SUV" onclick="selectCategoryChip('SUV')">SUV</button>
            <button class="chip-item" data-chip="COMMERCIAL" onclick="selectCategoryChip('COMMERCIAL')">Commercial</button>
            <button class="chip-item" data-chip="SEDAN" onclick="selectCategoryChip('SEDAN')">Sedan</button>
            <button class="chip-item" data-chip="HATCHBACK" onclick="selectCategoryChip('HATCHBACK')">Hatchback</button>
          </div>
        </div>

        <!-- View Switcher & Toolbar Bar -->
        <div class="inv-toolbar-card">
          <div class="inv-toolbar-left">
            <span class="inv-result-text" id="resultCountInfo">Memuat data...</span>
            <div id="accordionToggleButtons" class="accordion-toggle-group" style="display: none;">
              <button class="btn-small-link" onclick="expandAllGroups(true)"><i class="fa-solid fa-angles-down"></i> Buka Semua</button>
              <span style="color:#cbd5e1;">|</span>
              <button class="btn-small-link" onclick="expandAllGroups(false)"><i class="fa-solid fa-angles-up"></i> Tutup Semua</button>
            </div>
          </div>
          <div class="inv-toolbar-right">
            <span class="view-mode-label"><i class="fa-solid fa-eye"></i> Tampilan:</span>
            <div class="view-mode-switcher">
              <button class="view-btn active" id="viewBtnTable" onclick="switchViewMode('table')"
                title="Tampilan Tabel Ringkas">
                <i class="fa-solid fa-table-list"></i> <span class="view-btn-text">Tabel</span>
              </button>
              <button class="view-btn" id="viewBtnAccordion" onclick="switchViewMode('accordion')"
                title="Tampilan Grup Model">
                <i class="fa-solid fa-folder-tree"></i> <span class="view-btn-text">Grup Model</span>
              </button>
              <button class="view-btn" id="viewBtnGrid" onclick="switchViewMode('grid')"
                title="Tampilan Grid Kartu">
                <i class="fa-solid fa-grip"></i> <span class="view-btn-text">Kartu</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Main Inventory Content Area -->
        <div id="inventoryList" class="inventory-render-wrapper view-table">
          <div style="text-align: center; padding: 50px 0; color: var(--text-muted, #64748b); font-size: 14px;">
            <i class="fa-solid fa-circle-notch fa-spin"
              style="font-size:24px; color:var(--primary-blue, #2563eb); margin-bottom:10px; display:block;"></i>
            Memuat data inventori real-time...
          </div>
        </div>
      </div>

      <!-- Filter Modal -->
      <div class="filter-overlay" id="filterModal">
        <div class="filter-content">
          <div class="filter-header">
            <h3>Filter Inventori</h3>
            <button class="close-filter" onclick="closeFilterModal()"><i class="fa-solid fa-times"></i></button>
          </div>
          <div class="filter-body">
            <div class="form-group">
              <label>Kategori</label>
              <select id="kategoriFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Kategori</option>
              </select>
            </div>
            <div class="form-group">
              <label>Model</label>
              <select id="modelFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Model</option>
              </select>
            </div>
            <div class="form-group">
              <label>Warna</label>
              <select id="warnaFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Warna</option>
              </select>
            </div>
            <div class="form-group">
              <label>Site</label>
              <select id="siteFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Site</option>
              </select>
            </div>
            <div class="form-group">
              <label>Warehouse</label>
              <select id="warehouseFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Warehouse</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status Ketersediaan</label>
              <select id="statusFilter" class="form-control" onchange="filterData()">
                <option value="">Semua Status</option>
              </select>
            </div>
          </div>
          <div class="filter-footer">
            <button class="btn-main" style="background: #64748b; margin-right: 8px; border-radius: 12px; width: 50%;"
              onclick="resetFilter()">Reset</button>
            <button class="btn-main" style="border-radius: 12px; width: 50%; background: #2563eb;" onclick="closeFilterModal()">Terapkan</button>
          </div>
        </div>
      </div>

      <!-- Image Viewer Modal -->
      <div class="filter-overlay" id="imageModal" onclick="closeImageModal()">
        <div class="filter-content"
          style="background: transparent; box-shadow: none; display: flex; justify-content: center; align-items: center; padding: 0; max-width: 90%;"
          onclick="event.stopPropagation()">
          <div style="position: relative; width: 100%;">
            <button class="close-filter"
              style="position: absolute; top: -40px; right: 0; color: white; background: rgba(0,0,0,0.5);"
              onclick="closeImageModal()"><i class="fa-solid fa-times"></i></button>
            <img id="modalImg" src="" alt="Car Image"
              style="width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          </div>
        </div>
      </div>
    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/elibrary_data.js"></script>
  <script src="../js/inventory.js?v=20260819_spv"></script>
  <script src="../js/spv_global.js"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
