<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Live Inventory</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/inventory.css?v=20260819_3">
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="mobile-app">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Live Inventory</h2>
        </header>

        <div class="container" style="margin-top:18px;">
            <!-- Inventory Top Banner & Stats -->
            <div class="inv-top-card">
                <div class="inv-header-row">
                    <div>
                        <h3 class="inv-title"><i class="fa-solid fa-boxes-stacked" style="color: var(--primary-red); margin-right: 6px;"></i> Live Inventory & Stock Toyota</h3>
                        <p class="inv-subtitle">Data stok real-time seluruh cabang & gudang pusat terintegrasi.</p>
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
                            <span class="stat-lbl">Model & Varian</span>
                        </div>
                    </div>
                </div>

                <!-- Search and Action Bar -->
                <div class="search-bar" style="margin-top: 14px; margin-bottom: 12px;">
                    <div class="search-input-wrapper">
                        <i class="fa-solid fa-magnifying-glass search-icon"></i>
                        <input type="text" id="searchInput" class="form-control search-input-styled" placeholder="Cari model, varian, no rangka, warna, kode RRN, cabang..." oninput="filterData()">
                        <button type="button" id="clearSearchBtn" class="clear-search-btn" style="display:none;" onclick="clearSearch()"><i class="fa-solid fa-xmark"></i></button>
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
                        <button class="view-btn active" id="viewBtnTable" onclick="switchViewMode('table')" title="Tampilan Tabel Ringkas (Padat & Rapi)">
                            <i class="fa-solid fa-table-list"></i> <span class="view-btn-text">Tabel</span>
                        </button>
                        <button class="view-btn" id="viewBtnAccordion" onclick="switchViewMode('accordion')" title="Tampilan Grup Model (Bisa Dilipat)">
                            <i class="fa-solid fa-folder-tree"></i> <span class="view-btn-text">Grup Model</span>
                        </button>
                        <button class="view-btn" id="viewBtnGrid" onclick="switchViewMode('grid')" title="Tampilan Grid Kartu Kompak">
                            <i class="fa-solid fa-grip"></i> <span class="view-btn-text">Kartu</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Main Inventory Content Area -->
            <div id="inventoryList" class="inventory-render-wrapper view-table">
                <div style="text-align: center; padding: 50px 0; color: var(--text-muted); font-size: 14px;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size:24px; color:var(--primary-red); margin-bottom:10px; display:block;"></i> Memuat data inventori real-time...
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
                    <button class="btn-main" style="background: #64748b; margin-right: 8px; border-radius: 12px; width: 50%;" onclick="resetFilter()">Reset</button>
                    <button class="btn-main" style="border-radius: 12px; width: 50%;" onclick="closeFilterModal()">Terapkan</button>
                </div>
            </div>
        </div>
        <!-- Image Viewer Modal -->
        <div class="filter-overlay" id="imageModal" onclick="closeImageModal()">
            <div class="filter-content" style="background: transparent; box-shadow: none; display: flex; justify-content: center; align-items: center; padding: 0; max-width: 90%;" onclick="event.stopPropagation()">
                <div style="position: relative; width: 100%;">
                    <button class="close-filter" style="position: absolute; top: -40px; right: 0; color: white; background: rgba(0,0,0,0.5);" onclick="closeImageModal()"><i class="fa-solid fa-times"></i></button>
                    <img id="modalImg" src="" alt="Car Image" style="width: 100%; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                </div>
            </div>
        </div>

        <!-- SPK / Ambil Unit Modal -->
        <div class="filter-overlay" id="spkModal" onclick="closeSpkModal()">
            <div class="spk-modal-content" onclick="event.stopPropagation()">
                <div class="spk-modal-header">
                    <h3>Buat SPK / Ambil Unit</h3>
                    <button type="button" class="spk-close-btn" onclick="closeSpkModal()"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <form id="spkForm" onsubmit="submitSpkForm(event)">
                    <div class="spk-modal-body">
                        <!-- Preview Card -->
                        <div class="spk-unit-preview">
                            <div class="spk-preview-top">
                                <div class="spk-preview-icon"><i class="fa-solid fa-car-side"></i></div>
                                <div class="spk-preview-title" id="spkPreviewTitle">-</div>
                            </div>
                            <div class="spk-preview-divider"></div>
                            <div class="spk-preview-chassis">
                                <div class="spk-chassis-icon"><i class="fa-solid fa-microchip"></i></div>
                                <div class="spk-chassis-info">
                                    <span class="spk-chassis-label">NO. RANGKA / CHASSIS</span>
                                    <span class="spk-chassis-val" id="spkPreviewChassis">-</span>
                                </div>
                            </div>
                        </div>

                        <!-- Form Fields -->
                        <div class="spk-field-group">
                            <label class="spk-field-label" for="spkCustomerName">Nama Customer <span>*</span></label>
                            <input type="text" id="spkCustomerName" class="spk-input" placeholder="Sesuai KTP" required>
                        </div>

                        <div class="spk-field-group">
                            <label class="spk-field-label" for="spkCustomerPhone">No. Whatsapp / HP <span>*</span></label>
                            <input type="tel" id="spkCustomerPhone" class="spk-input" placeholder="Contoh: 08123456789" required>
                        </div>

                        <div class="spk-field-group">
                            <label class="spk-field-label" for="spkTandaJadi">Nominal Tanda Jadi (Rp) <span>*</span></label>
                            <input type="text" id="spkTandaJadi" class="spk-input" placeholder="Min. Rp 5.000.000" onkeyup="formatRupiahInput(this)" required>
                        </div>

                        <div class="spk-field-group">
                            <label class="spk-field-label" for="spkTipePembelian">Tipe Pembelian <span>*</span></label>
                            <select id="spkTipePembelian" class="spk-input" required>
                                <option value="">-- Silakan Pilih --</option>
                                <option value="Cash">Cash</option>
                                <option value="Kredit">Kredit</option>
                            </select>
                        </div>

                        <div class="spk-modal-footer">
                            <button type="button" class="btn-spk-cancel" onclick="closeSpkModal()">Batal</button>
                            <button type="submit" class="btn-spk-submit"><i class="fa-solid fa-check"></i> Konfirmasi SPK</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script src="../custom_alert.js"></script>
    <script src="../js/elibrary_data.js"></script>
    <script src="../js/inventory.js?v=20260819_excel_all_data"></script>
</body>
</html>
