/**
 * Live Inventory Management & Multi-View Rendering
 * Modes: 'table' (Compact Table), 'accordion' (Grouped Model), 'grid' (Compact Cards)
 */

let inventoryData = [];
let currentViewMode = localStorage.getItem('sft_inventory_view') || 'table';
let activeCategoryChip = '';
let expandedGroups = new Set();

// ── 1. Fetch Data from API ─────────────────────────────────
async function loadInventory() {
    const container = document.getElementById('inventoryList');
    if (container) {
        container.innerHTML = `
            <div style="text-align: center; padding: 50px 0; color: var(--text-muted); font-size: 14px;">
                <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; color: var(--primary-red); margin-bottom: 12px; display: block;"></i>
                Memuat data inventori stok real-time...
            </div>
        `;
    }

    try {
        const res = await fetch('../api/api_inventory.php');
        const json = await res.json();
        if (json.status === 'success') {
            inventoryData = json.data || [];
            populateFilters(inventoryData);
            updateViewModeButtons();
            filterData();
        } else {
            showCustomAlert('Error', 'Gagal mengambil data stok dari server', 'error');
            if (container) {
                container.innerHTML = '<div style="text-align: center; padding: 40px 0; color: #ef4444; font-size: 14px;"><i class="fa-solid fa-triangle-exclamation" style="font-size:24px; margin-bottom:8px; display:block;"></i>Gagal memuat data inventori.</div>';
            }
        }
    } catch (err) {
        console.error(err);
        showCustomAlert('Error', 'Kesalahan jaringan saat memuat inventori', 'error');
        if (container) {
            container.innerHTML = '<div style="text-align: center; padding: 40px 0; color: #ef4444; font-size: 14px;"><i class="fa-solid fa-wifi" style="font-size:24px; margin-bottom:8px; display:block;"></i>Kesalahan jaringan saat memuat data.</div>';
        }
    }
}

// ── 2. Category & Image Mapping ────────────────────────────
function getCategory(description) {
    if (!description) return 'LAINNYA';
    const desc = description.toLowerCase();
    if (desc.match(/alphard|voxy|vellfire|innova|avanza|veloz|calya|hiace|sienta|kijang/)) return 'MPV';
    if (desc.match(/fortuner|rush|raize|land cruiser|corolla cross|yaris cross|urban cruiser/)) return 'SUV';
    if (desc.match(/camry|altis|vios|corolla/)) return 'SEDAN';
    if (desc.match(/yaris|agya/)) return 'HATCHBACK';
    if (desc.match(/hilux|dyna|hi ace|rangga|pick up|cabin/)) return 'COMMERCIAL';
    return 'LAINNYA';
}

function getCarImage(description, colorDescription) {
    if (!description) return '../assets/img/mobil/avanza.webp';
    const desc = description.toLowerCase();
    
    // Attempt to map to elibrary_data.js color images if available
    if (window.carColorData && colorDescription) {
        let modelKey = null;
        const colorLower = colorDescription.toLowerCase();
        
        if (desc.includes('agya') && (desc.includes('gr-s') || desc.includes('stylix'))) modelKey = 'Agya GR-S';
        else if (desc.includes('agya')) modelKey = 'Agya';
        else if (desc.includes('yaris') && desc.includes('cross')) modelKey = 'Yaris Cross';
        else if (desc.includes('yaris') && desc.includes('gr')) modelKey = 'GR Yaris';
        else if (desc.includes('yaris')) modelKey = 'Yaris';
        else if (desc.includes('corolla') && desc.includes('gr')) modelKey = 'GR Corolla';
        else if (desc.includes('corolla cross')) modelKey = 'Corolla Cross';
        else if (desc.includes('calya')) modelKey = 'Calya';
        else if (desc.includes('avanza')) modelKey = 'Avanza';
        else if (desc.includes('veloz')) modelKey = 'Veloz';
        else if (desc.includes('innova zenix') || desc.includes('zenix')) modelKey = 'Zenix';
        else if (desc.includes('innova') || desc.includes('reborn') || desc.includes('kijang')) modelKey = 'Innova Reborn';
        else if (desc.includes('voxy')) modelKey = 'Voxy';
        else if (desc.includes('alphard')) modelKey = 'Alphard';
        else if (desc.includes('vellfire')) modelKey = 'Vellfire';
        else if (desc.includes('raize')) modelKey = 'Raize';
        else if (desc.includes('fortuner') && desc.includes('gr')) modelKey = 'Fortuner GR'; 
        else if (desc.includes('fortuner')) modelKey = 'Fortuner';
        else if (desc.includes('rush')) modelKey = 'Rush';
        else if (desc.includes('rangga')) modelKey = 'Rangga';
        else if (desc.includes('double cabin') || desc.includes('hilux')) modelKey = 'Double Cabin';
        else if (desc.includes('single cabin') || desc.includes('pick up')) modelKey = 'Single Cabin';
        else if (desc.includes('hiace') && desc.includes('premio')) modelKey = 'Hi Ace Premio';
        else if (desc.includes('hiace') || desc.includes('hi ace')) modelKey = 'Hi Ace Commuter';
        else if (desc.includes('land cruiser')) modelKey = 'Land Cruiser';
        else if (desc.includes('camry')) modelKey = 'Camry';
        else if (desc.includes('altis')) modelKey = 'Altis';
        else if (desc.includes('vios')) modelKey = 'Vios';
        
        if (modelKey && window.carColorData[modelKey]) {
            const colorOptions = window.carColorData[modelKey];
            const match = colorOptions.find(c => {
                const cName = c.name.toLowerCase();
                return colorLower.includes(cName) || cName.includes(colorLower) ||
                       colorLower.replace(/\s+/g, '').includes(cName.replace(/\s+/g, ''));
            });
            if (match && match.img) {
                return match.img;
            }
        }
    }
    
    // Fallback logic for local webp files
    let fallback = 'agya.webp';
    if (desc.includes('supra')) fallback = 'supra.webp';
    else if (desc.includes('gr 86') || desc.includes('gr86') || desc.includes(' 86')) fallback = 'gr-86.webp';
    else if (desc.includes('gr corolla')) fallback = 'gr-corolla.webp';
    else if (desc.includes('gr yaris')) fallback = 'gr-yaris.webp';
    else if (desc.includes('bz4x')) fallback = 'bz4x.webp';
    else if (desc.includes('prius')) fallback = 'prius.webp';
    else if (desc.includes('dyna')) fallback = 'dyna.webp';
    else if (desc.includes('rangga')) fallback = 'rangga.webp';
    else if (desc.includes('double cabin') || desc.includes('hilux')) fallback = 'double-cabin.webp';
    else if (desc.includes('single cabin') || desc.includes('pick up')) fallback = 'single-cabin.webp';
    else if (desc.includes('hiace') && desc.includes('premio')) fallback = 'hi-ace-premio.webp';
    else if (desc.includes('hiace') || desc.includes('hi ace')) fallback = 'hi-ace-comm.webp';
    else if (desc.includes('land cruiser')) fallback = 'land-cruiser.webp';
    else if (desc.includes('fortuner')) fallback = 'fortuner.webp';
    else if (desc.includes('rush')) fallback = 'rush.webp';
    else if (desc.includes('raize')) fallback = 'raize.webp';
    else if (desc.includes('yaris cross')) fallback = 'yaris-cross.webp';
    else if (desc.includes('corolla cross') || desc.includes('urban cruiser')) fallback = 'corolla-cross.webp';
    else if (desc.includes('alphard')) fallback = 'alphard.webp';
    else if (desc.includes('vellfire')) fallback = 'vellfire.webp';
    else if (desc.includes('voxy')) fallback = 'voxy.webp';
    else if (desc.includes('innova zenix') || desc.includes('zenix')) fallback = 'zenix.webp';
    else if (desc.includes('innova') || desc.includes('reborn') || desc.includes('kijang')) fallback = 'innova-reborn.webp';
    else if (desc.includes('avanza')) fallback = 'avanza.webp';
    else if (desc.includes('veloz')) fallback = 'veloz.webp';
    else if (desc.includes('calya')) fallback = 'calya.webp';
    else if (desc.includes('camry')) fallback = 'camry.webp';
    else if (desc.includes('altis')) fallback = 'altis.webp';
    else if (desc.includes('vios')) fallback = 'vios.webp';
    else if (desc.includes('yaris')) fallback = 'yaris.webp';
    else if (desc.includes('agya')) fallback = 'agya.webp';
    
    return '../assets/img/mobil/' + fallback;
}

// ── 3. Populate Filter Dropdowns ───────────────────────────
function populateFilters(data) {
    // 1. Kategori
    const kategoriSelect = document.getElementById('kategoriFilter');
    if (kategoriSelect) {
        const kategoris = [...new Set(data.map(item => getCategory(item.product_description)))].sort();
        kategoriSelect.innerHTML = '<option value="">Semua Kategori</option>' + kategoris.map(k => `<option value="${k}">${k}</option>`).join('');
    }
    
    // 2. Models
    const modelSelect = document.getElementById('modelFilter');
    if (modelSelect) {
        const modelMap = new Map();
        data.forEach(item => {
            const desc = (item.product_description || '').trim();
            if (desc) {
                let key = desc.split(' ')[0].toUpperCase();
                let label = key;
                if (desc.toUpperCase().startsWith('KIJANG INNOVA')) { key = 'INNOVA'; label = 'Kijang Innova Reborn'; }
                else if (desc.toUpperCase().startsWith('INNOVA ZENIX')) { key = 'ZENIX'; label = 'Innova Zenix'; }
                else if (desc.toUpperCase().startsWith('VELOZ')) { key = 'VELOZ'; label = 'Veloz'; }
                else if (desc.toUpperCase().startsWith('AVANZA')) { key = 'AVANZA'; label = 'Avanza'; }
                else if (desc.toUpperCase().startsWith('CALYA')) { key = 'CALYA'; label = 'Calya'; }
                else if (desc.toUpperCase().startsWith('FORTUNER')) { key = 'FORTUNER'; label = 'Fortuner'; }
                else if (desc.toUpperCase().startsWith('RUSH')) { key = 'RUSH'; label = 'Rush'; }
                else if (desc.toUpperCase().startsWith('RAIZE')) { key = 'RAIZE'; label = 'Raize'; }
                else if (desc.toUpperCase().startsWith('AGYA')) { key = 'AGYA'; label = 'Agya'; }
                else if (desc.toUpperCase().startsWith('YARIS CROSS')) { key = 'YARIS CROSS'; label = 'Yaris Cross'; }
                else if (desc.toUpperCase().startsWith('YARIS')) { key = 'YARIS'; label = 'Yaris'; }
                else if (desc.toUpperCase().startsWith('ALPHARD')) { key = 'ALPHARD'; label = 'Alphard'; }
                else if (desc.toUpperCase().startsWith('VELLFIRE')) { key = 'VELLFIRE'; label = 'Vellfire'; }
                else if (desc.toUpperCase().startsWith('VOXY')) { key = 'VOXY'; label = 'Voxy'; }
                else if (desc.toUpperCase().startsWith('HIACE')) { key = 'HIACE'; label = 'Hiace'; }
                else if (desc.toUpperCase().startsWith('HILUX') || desc.toUpperCase().startsWith('RANGGA')) { key = 'HILUX'; label = 'Hilux / Rangga'; }
                else if (desc.toUpperCase().startsWith('LAND CRUISER')) { key = 'LAND CRUISER'; label = 'Land Cruiser'; }
                else if (desc.toUpperCase().startsWith('CAMRY')) { key = 'CAMRY'; label = 'Camry'; }
                else if (desc.toUpperCase().startsWith('VIOS')) { key = 'VIOS'; label = 'Vios'; }
                else if (desc.toUpperCase().startsWith('COROLLA')) { key = 'COROLLA'; label = 'Corolla'; }
                modelMap.set(key, label);
            }
        });
        const sortedModels = [...modelMap.entries()].sort((a, b) => a[1].localeCompare(b[1]));
        modelSelect.innerHTML = '<option value="">Semua Model</option>' + sortedModels.map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
    }
    
    // 3. Colors
    const warnaSelect = document.getElementById('warnaFilter');
    if (warnaSelect) {
        const warnas = [...new Set(data.map(item => item.color_description))].filter(Boolean).sort();
        warnaSelect.innerHTML = '<option value="">Semua Warna</option>' + warnas.map(w => `<option value="${w}">${w}</option>`).join('');
    }
    
    // 4. Site (Cabang)
    const siteSelect = document.getElementById('siteFilter');
    if (siteSelect) {
        const sites = [...new Set(data.map(item => item.site))].filter(Boolean).sort();
        siteSelect.innerHTML = '<option value="">Semua Site</option>' + sites.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    
    // 5. Warehouse
    const warehouseSelect = document.getElementById('warehouseFilter');
    if (warehouseSelect) {
        const warehouses = [...new Set(data.map(item => item.warehouse))].filter(Boolean).sort();
        warehouseSelect.innerHTML = '<option value="">Semua Warehouse</option>' + warehouses.map(w => `<option value="${w}">${w}</option>`).join('');
    }
    
    // 6. Status
    const statusSelect = document.getElementById('statusFilter');
    if (statusSelect) {
        const statuses = [...new Set(data.map(item => item.availability_status))].filter(Boolean).sort();
        statusSelect.innerHTML = '<option value="">Semua Status</option>' + statuses.map(s => `<option value="${s}">${s}</option>`).join('');
    }
}

// ── 4. Filtering & Search Logic ────────────────────────────
function filterData() {
    const searchInput = document.getElementById('searchInput');
    const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
    
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) {
        clearBtn.style.display = q ? 'flex' : 'none';
    }

    const katEl = document.getElementById('kategoriFilter');
    const k = katEl ? katEl.value : '';
    
    const modEl = document.getElementById('modelFilter');
    const m = modEl ? modEl.value.toUpperCase() : '';
    
    const warEl = document.getElementById('warnaFilter');
    const w = warEl ? warEl.value : '';
    
    const sitEl = document.getElementById('siteFilter');
    const si = sitEl ? sitEl.value : '';
    
    const whEl = document.getElementById('warehouseFilter');
    const wa = whEl ? whEl.value : '';
    
    const statEl = document.getElementById('statusFilter');
    const s = statEl ? statEl.value : '';
    
    // Update active filter badge counter
    let activeFilterCount = 0;
    if (k) activeFilterCount++;
    if (m) activeFilterCount++;
    if (w) activeFilterCount++;
    if (si) activeFilterCount++;
    if (wa) activeFilterCount++;
    if (s) activeFilterCount++;

    const badgeEl = document.getElementById('activeFilterBadge');
    if (badgeEl) {
        badgeEl.textContent = activeFilterCount;
        badgeEl.style.display = activeFilterCount > 0 ? 'flex' : 'none';
    }

    const filtered = inventoryData.filter(item => {
        const desc = (item.product_description || '').toLowerCase();
        const code = (item.product_code || '').toLowerCase();
        const rrn = (item.rrn || '').toLowerCase();
        const brand = (item.brand || '').toLowerCase();
        const chassis = (item.chassis_no || '').toLowerCase();
        const engine = (item.engine_no || '').toLowerCase();
        const vin = (item.vin_code || '').toLowerCase();
        const color = (item.color_description || '').toLowerCase();
        const site = (item.site || '').toLowerCase();
        const bu = (item.short_name_bu || '').toLowerCase();
        const warehouse = (item.warehouse || '').toLowerCase();
        const location = (item.location || '').toLowerCase();
        const stockNum = (item.stock_number || '').toLowerCase();
        const status = (item.availability_status || '').toLowerCase();
        const itemKat = getCategory(item.product_description);

        const descMatch = !q || desc.includes(q) || code.includes(q) || rrn.includes(q) || brand.includes(q) || chassis.includes(q) || engine.includes(q) || vin.includes(q) || color.includes(q) || site.includes(q) || bu.includes(q) || warehouse.includes(q) || location.includes(q) || stockNum.includes(q);
        
        // Chip category / quick filter
        let matchChip = true;
        if (activeCategoryChip === 'READY_ONLY') {
            const stokVal = parseInt(item.stok !== undefined ? item.stok : (item.stock !== undefined ? item.stock : 1), 10);
            matchChip = (status.includes('available') || status === 'tersedia') && stokVal > 0;
        } else if (activeCategoryChip) {
            matchChip = itemKat.toUpperCase() === activeCategoryChip.toUpperCase();
        }

        const matchKat = !k || itemKat === k;
        
        let matchModel = true;
        if (m) {
            const descUpper = desc.toUpperCase();
            if (m === 'INNOVA') matchModel = descUpper.includes('INNOVA') && !descUpper.includes('ZENIX');
            else if (m === 'ZENIX') matchModel = descUpper.includes('ZENIX');
            else if (m === 'HILUX') matchModel = descUpper.includes('HILUX') || descUpper.includes('RANGGA');
            else if (m === 'YARIS') matchModel = descUpper.includes('YARIS') && !descUpper.includes('CROSS');
            else if (m === 'YARIS CROSS') matchModel = descUpper.includes('YARIS CROSS');
            else if (m === 'COROLLA') matchModel = descUpper.includes('COROLLA') || descUpper.includes('ALTIS');
            else matchModel = descUpper.includes(m);
        }
        
        const matchWarna = !w || item.color_description === w;
        const matchSite = !si || item.site === si;
        const matchWarehouse = !wa || item.warehouse === wa;
        const matchStatus = !s || item.availability_status === s;
        
        return descMatch && matchChip && matchKat && matchModel && matchWarna && matchSite && matchWarehouse && matchStatus;
    });
    
    renderData(filtered);
}

function clearSearch() {
    const sInp = document.getElementById('searchInput');
    if (sInp) {
        sInp.value = '';
        sInp.focus();
    }
    filterData();
}

function selectCategoryChip(chipVal) {
    activeCategoryChip = chipVal;
    
    // Update chip active classes
    const chips = document.querySelectorAll('.chip-item');
    chips.forEach(chip => {
        const dataChip = chip.getAttribute('data-chip');
        if (dataChip === chipVal) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    filterData();
}

// ── 5. View Mode Switcher ──────────────────────────────────
function switchViewMode(mode) {
    currentViewMode = mode;
    localStorage.setItem('sft_inventory_view', mode);
    updateViewModeButtons();
    filterData();
}

function updateViewModeButtons() {
    const btnTable = document.getElementById('viewBtnTable');
    const btnAccordion = document.getElementById('viewBtnAccordion');
    const btnGrid = document.getElementById('viewBtnGrid');
    const toggleBtns = document.getElementById('accordionToggleButtons');

    if (btnTable) btnTable.classList.toggle('active', currentViewMode === 'table');
    if (btnAccordion) btnAccordion.classList.toggle('active', currentViewMode === 'accordion');
    if (btnGrid) btnGrid.classList.toggle('active', currentViewMode === 'grid');

    if (toggleBtns) {
        toggleBtns.style.display = currentViewMode === 'accordion' ? 'inline-flex' : 'none';
    }

    const container = document.getElementById('inventoryList');
    if (container) {
        container.className = `inventory-render-wrapper view-${currentViewMode}`;
    }
}

function toggleAccordion(groupKey) {
    const el = document.getElementById(`acc-card-${groupKey}`);
    if (el) {
        const isExpanded = el.classList.contains('expanded');
        if (isExpanded) {
            el.classList.remove('expanded');
            expandedGroups.delete(groupKey);
        } else {
            el.classList.add('expanded');
            expandedGroups.add(groupKey);
        }
    }
}

function expandAllGroups(expandBool) {
    const cards = document.querySelectorAll('.accordion-model-card');
    cards.forEach(card => {
        const groupKey = card.getAttribute('data-group-key');
        if (expandBool) {
            card.classList.add('expanded');
            if (groupKey) expandedGroups.add(groupKey);
        } else {
            card.classList.remove('expanded');
            if (groupKey) expandedGroups.delete(groupKey);
        }
    });
}

// ── 6. Master Render Data ──────────────────────────────────
function renderData(data) {
    const container = document.getElementById('inventoryList');
    if (!container) return;
    
    // 1. Calculate overall metrics
    const totalCount = inventoryData.length;
    const readyCount = inventoryData.filter(u => {
        const s = (u.availability_status || '').toLowerCase();
        const stk = parseInt(u.stok !== undefined ? u.stok : 1, 10);
        return (s.includes('available') || s === 'tersedia') && stk > 0;
    }).length;

    const matchedCount = inventoryData.filter(u => {
        const s = (u.availability_status || '').toLowerCase();
        return s === 'matched' || s === 'reserved' || s.includes('hold');
    }).length;

    const distinctModels = new Set(inventoryData.map(u => u.product_description)).size;

    // Update Top Summary Stats
    const readyBadgeEl = document.getElementById('totalReadyText');
    if (readyBadgeEl) readyBadgeEl.textContent = readyCount.toLocaleString('id-ID');

    const totalBadgeEl = document.getElementById('totalUnitText');
    if (totalBadgeEl) totalBadgeEl.textContent = totalCount.toLocaleString('id-ID');

    const matchedBadgeEl = document.getElementById('totalMatchedText');
    if (matchedBadgeEl) matchedBadgeEl.textContent = matchedCount.toLocaleString('id-ID');

    const modelsBadgeEl = document.getElementById('totalModelsText');
    if (modelsBadgeEl) modelsBadgeEl.textContent = distinctModels.toLocaleString('id-ID');

    // Update result info text
    const resultCountEl = document.getElementById('resultCountInfo');
    if (resultCountEl) {
        if (data.length === totalCount) {
            resultCountEl.innerHTML = `Menampilkan <strong>${data.length}</strong> unit terdata`;
        } else {
            resultCountEl.innerHTML = `Menampilkan <strong>${data.length}</strong> dari <strong>${totalCount}</strong> unit`;
        }
    }

    if (data.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 16px; border: 1px solid #e2e8f0; color: var(--text-muted);">
                <i class="fa-solid fa-folder-open" style="font-size: 36px; margin-bottom: 12px; display: block; color: #94a3b8;"></i>
                <h4 style="font-size: 15px; font-weight: 800; color: #0d1b3e; margin: 0 0 6px;">Unit Tidak Ditemukan</h4>
                <p style="font-size: 12.5px; color: #64748b; margin: 0 0 16px;">Tidak ada stok mobil yang sesuai dengan kata kunci pencarian / filter aktif.</p>
                <button class="btn-refresh-pill" onclick="resetFilter()" style="display:inline-flex; margin: 0 auto;">
                    <i class="fa-solid fa-rotate-left"></i> Reset Filter
                </button>
            </div>
        `;
        return;
    }

    // Dispatch to specific view mode renderer
    if (currentViewMode === 'table') {
        renderTableView(data, container);
    } else if (currentViewMode === 'accordion') {
        renderAccordionView(data, container);
    } else {
        renderGridView(data, container);
    }
}

// ── Helper: Check if user is Kepala Cabang ──────────────────
function isKacabUser() {
    return localStorage.getItem('peranSales') === 'Kepala Cabang' || window.location.pathname.includes('/pages_kacab/');
}

// ── 7. View Mode: Compact Table View (Default) ─────────────
function renderTableView(data, container) {
    const isKacab = isKacabUser();
    let rowsHtml = '';

    data.forEach((item, idx) => {
        const stokVal = parseInt(item.stok !== undefined ? item.stok : (item.stock !== undefined ? item.stock : 1), 10);
        const statusLower = (item.availability_status || '').toLowerCase().trim();
        const isAvailable = (statusLower.includes('available') || statusLower === 'tersedia') && stokVal > 0;
        
        let statusBadgeClass = 'status-ready';
        let statusText = 'Ready Stock';
        let actionBtnHtml = '';

        if (isAvailable) {
            statusBadgeClass = 'status-ready';
            statusText = '<i class="fa-solid fa-circle-check"></i> Ready';
            actionBtnHtml = `
                <button class="btn-table-ambil" onclick="openSpkModal('${(item.chassis_no || '').replace(/'/g, "\\'")}')" title="Ambil Unit (SPK)">
                    <i class="fa-solid fa-check"></i> Ambil SPK
                </button>
            `;
        } else if (statusLower === 'matched') {
            statusBadgeClass = 'status-matched';
            statusText = '<i class="fa-solid fa-lock"></i> Matched';
            actionBtnHtml = `
                <button class="btn-table-disabled" onclick="showCustomAlert('Info Unit', 'Unit ini telah dialokasikan untuk SPK customer lain.', 'info')">
                    <i class="fa-solid fa-lock"></i> Matched
                </button>
            `;
        } else if (statusLower === 'reserved') {
            statusBadgeClass = 'status-reserved';
            statusText = '<i class="fa-solid fa-bookmark"></i> Reserved';
            actionBtnHtml = `
                <button class="btn-table-disabled" onclick="showCustomAlert('Info Unit', 'Unit ini sedang di-hold / reserved oleh dealer.', 'info')">
                    <i class="fa-solid fa-bookmark"></i> Hold
                </button>
            `;
        } else {
            statusBadgeClass = 'status-inden';
            statusText = '<i class="fa-solid fa-clock"></i> Inden';
            actionBtnHtml = `
                <button class="btn-table-disabled" onclick="showCustomAlert('Perhatian', 'Unit ini berstatus kosong / inden.', 'warning')">
                    <i class="fa-solid fa-clock"></i> Inden
                </button>
            `;
        }

        const imgPath = getCarImage(item.product_description, item.color_description);
        const cat = getCategory(item.product_description);

        rowsHtml += `
            <tr>
                <td>
                    <div class="table-car-cell">
                        <div class="table-car-img" onclick="viewImage('${imgPath}')" title="Klik untuk perbesar">
                            <img src="${imgPath}" alt="car" onerror="this.src='../assets/img/mobil/agya.webp'">
                        </div>
                        <div class="table-car-meta">
                            <span class="table-car-cat">${cat}</span>
                            <span class="table-car-name">${item.product_description || 'Toyota Unit'}</span>
                            ${item.brand && item.brand !== item.product_description ? `<span style="font-size: 10.5px; color: #94a3b8; font-weight: 600;">${item.brand}</span>` : ''}
                        </div>
                    </div>
                </td>
                <td>
                    <div class="table-mono-box">
                        <span class="mono-rrn" title="Kode RRN">RRN: ${item.rrn || item.product_code || '-'}</span>
                        <span class="mono-chassis" title="No Rangka"><i class="fa-solid fa-microchip" style="font-size:10px; margin-right:3px; color:#94a3b8;"></i>${item.chassis_no || '-'}</span>
                        ${item.engine_no ? `<span class="mono-engine">Eng: ${item.engine_no}</span>` : ''}
                        ${item.vin_code ? `<span style="font-size: 10px; color: #64748b; font-weight: 700;">VIN: ${item.vin_code}</span>` : ''}
                    </div>
                </td>
                <td>
                    <div class="table-color-pill">
                        <i class="fa-solid fa-palette" style="color: #d7123a; font-size: 11px;"></i>
                        <span>${item.color_description || 'Standard Color'}</span>
                    </div>
                </td>
                <td>
                    <div class="table-location-meta">
                        <span class="loc-site" title="Cabang Site"><i class="fa-solid fa-building"></i> ${item.site || item.short_name_bu || 'Tunas Toyota'}</span>
                        <span class="loc-wh" title="Warehouse Lokasi"><i class="fa-solid fa-warehouse"></i> ${item.warehouse || 'Main Stock'}</span>
                        ${item.location ? `<span style="font-size: 10.5px; color: #64748b; display: flex; align-items: center; gap: 4px;" title="Detail Lokasi"><i class="fa-solid fa-location-dot" style="font-size: 9px; color: #c8102e;"></i> ${item.location}</span>` : ''}
                        ${item.stock_number ? `<span style="font-size: 10px; color: #475569; font-weight: 600; font-family: monospace;"># ${item.stock_number}</span>` : ''}
                    </div>
                </td>
                <td>
                    <span class="badge-status-pill ${statusBadgeClass}">${statusText}</span>
                    ${item.order_state ? `<div style="font-size: 9.5px; color: #94a3b8; margin-top: 2px;">${item.order_state}</div>` : ''}
                </td>
                ${!isKacab ? `<td style="text-align: center;">${actionBtnHtml}</td>` : ''}
            </tr>
        `;
    });

    container.innerHTML = `
        <div class="inventory-table-container">
            <div class="inv-table-responsive">
                <table class="inv-table">
                    <thead>
                        <tr>
                            <th style="min-width: 240px;">Unit & Varian Mobil</th>
                            <th style="min-width: 170px;">RRN / No. Rangka</th>
                            <th style="min-width: 150px;">Warna</th>
                            <th style="min-width: 170px;">Lokasi & Cabang</th>
                            <th style="min-width: 120px;">Status</th>
                            ${!isKacab ? '<th style="min-width: 130px; text-align: center;">Aksi</th>' : ''}
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// ── 8. View Mode: Grouped Accordion View ───────────────────
function renderAccordionView(data, container) {
    const isKacab = isKacabUser();
    const groups = {};
    
    data.forEach(item => {
        const kat = getCategory(item.product_description);
        if (!groups[kat]) groups[kat] = {};
        
        const modelVarian = item.product_description || 'Unknown Model';
        if (!groups[kat][modelVarian]) groups[kat][modelVarian] = [];
        
        groups[kat][modelVarian].push(item);
    });

    let finalHtml = '';
    let groupIndex = 0;

    Object.keys(groups).sort().forEach(kat => {
        finalHtml += `
            <div class="category-section-block">
                <div class="category-badge-heading">
                    <i class="fa-solid fa-layer-group"></i> ${kat}
                </div>
        `;

        Object.keys(groups[kat]).sort().forEach(modelVarian => {
            groupIndex++;
            const groupUnits = groups[kat][modelVarian];
            const groupKey = `grp-${groupIndex}`;
            const isExpanded = expandedGroups.has(groupKey);

            const totalInGroup = groupUnits.length;
            const readyInGroup = groupUnits.filter(u => {
                const s = (u.availability_status || '').toLowerCase();
                const stk = parseInt(u.stok !== undefined ? u.stok : 1, 10);
                return (s.includes('available') || s === 'tersedia') && stk > 0;
            }).length;

            const sampleImg = getCarImage(modelVarian, groupUnits[0].color_description);

            let tableRowsHtml = '';
            groupUnits.forEach(item => {
                const stokVal = parseInt(item.stok !== undefined ? item.stok : (item.stock !== undefined ? item.stock : 1), 10);
                const statusLower = (item.availability_status || '').toLowerCase().trim();
                const isAvailable = (statusLower.includes('available') || statusLower === 'tersedia') && stokVal > 0;
                
                let statusBadgeClass = 'status-ready';
                let statusText = 'Ready Stock';
                let actionBtnHtml = '';

                if (isAvailable) {
                    statusBadgeClass = 'status-ready';
                    statusText = '<i class="fa-solid fa-circle-check"></i> Ready';
                    actionBtnHtml = `
                        <button class="btn-table-ambil" onclick="openSpkModal('${(item.chassis_no || '').replace(/'/g, "\\'")}')" title="Ambil Unit (SPK)">
                            <i class="fa-solid fa-check"></i> Ambil SPK
                        </button>
                    `;
                } else if (statusLower === 'matched') {
                    statusBadgeClass = 'status-matched';
                    statusText = '<i class="fa-solid fa-lock"></i> Matched';
                    actionBtnHtml = `
                        <button class="btn-table-disabled" onclick="showCustomAlert('Info Unit', 'Unit telah dialokasikan.', 'info')">
                            <i class="fa-solid fa-lock"></i> Matched
                        </button>
                    `;
                } else if (statusLower === 'reserved') {
                    statusBadgeClass = 'status-reserved';
                    statusText = '<i class="fa-solid fa-bookmark"></i> Reserved';
                    actionBtnHtml = `
                        <button class="btn-table-disabled" onclick="showCustomAlert('Info Unit', 'Unit sedang di-hold.', 'info')">
                            <i class="fa-solid fa-bookmark"></i> Hold
                        </button>
                    `;
                } else {
                    statusBadgeClass = 'status-inden';
                    statusText = '<i class="fa-solid fa-clock"></i> Inden';
                    actionBtnHtml = `
                        <button class="btn-table-disabled" onclick="showCustomAlert('Perhatian', 'Unit inden.', 'warning')">
                            <i class="fa-solid fa-clock"></i> Inden
                        </button>
                    `;
                }

                tableRowsHtml += `
                    <tr>
                        <td>
                            <div class="table-mono-box">
                                <span class="mono-rrn">RRN: ${item.rrn || item.product_code || '-'}</span>
                                <span class="mono-chassis">${item.chassis_no || '-'}</span>
                                ${item.vin_code ? `<span style="font-size: 9.5px; color: #64748b;">VIN: ${item.vin_code}</span>` : ''}
                            </div>
                        </td>
                        <td>
                            <div class="table-color-pill">
                                <i class="fa-solid fa-palette" style="color: #d7123a; font-size: 11px;"></i>
                                <span>${item.color_description || 'Standard'}</span>
                            </div>
                        </td>
                        <td>
                            <div class="table-location-meta">
                                <span class="loc-site"><i class="fa-solid fa-building"></i> ${item.site || item.short_name_bu || 'Tunas'}</span>
                                <span class="loc-wh"><i class="fa-solid fa-warehouse"></i> ${item.warehouse || 'Main Stock'}</span>
                                ${item.location ? `<span style="font-size: 10px; color: #64748b;"><i class="fa-solid fa-location-dot" style="font-size: 8px; color: #c8102e;"></i> ${item.location}</span>` : ''}
                            </div>
                        </td>
                        <td>
                            <span class="badge-status-pill ${statusBadgeClass}">${statusText}</span>
                        </td>
                        ${!isKacab ? `<td style="text-align:center;">${actionBtnHtml}</td>` : ''}
                    </tr>
                `;
            });

            finalHtml += `
                <div class="accordion-model-card ${isExpanded ? 'expanded' : ''}" id="acc-card-${groupKey}" data-group-key="${groupKey}">
                    <button class="accordion-header-btn" onclick="toggleAccordion('${groupKey}')" type="button">
                        <div class="accordion-model-info">
                            <div class="accordion-thumb" onclick="event.stopPropagation(); viewImage('${sampleImg}')" title="Klik untuk perbesar">
                                <img src="${sampleImg}" alt="car" onerror="this.src='../assets/img/mobil/agya.webp'">
                            </div>
                            <div class="accordion-title-col">
                                <div class="accordion-model-name">${modelVarian}</div>
                                <div class="accordion-model-badge-row">
                                    <span class="pill-count-ready"><i class="fa-solid fa-circle-check"></i> ${readyInGroup} Ready</span>
                                    <span class="pill-count-total">${totalInGroup} Unit</span>
                                </div>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-down accordion-chevron"></i>
                    </button>
                    <div class="accordion-body-content">
                        <div class="inv-table-responsive">
                            <table class="inv-table">
                                <thead>
                                    <tr>
                                        <th>RRN / No Rangka</th>
                                        <th>Warna</th>
                                        <th>Lokasi & Cabang</th>
                                        <th>Status</th>
                                        ${!isKacab ? '<th style="text-align:center;">Aksi</th>' : ''}
                                    </tr>
                                </thead>
                                <tbody>
                                    ${tableRowsHtml}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            `;
        });

        finalHtml += `</div>`;
    });

    container.innerHTML = finalHtml;
}

// ── 9. View Mode: Modern Card Grid ─────────────────────────
function renderGridView(data, container) {
    const isKacab = isKacabUser();
    let cardsHtml = '<div class="inv-cards-grid">';

    data.forEach(item => {
        const stokVal = parseInt(item.stok !== undefined ? item.stok : (item.stock !== undefined ? item.stock : 1), 10);
        const statusLower = (item.availability_status || '').toLowerCase().trim();
        const isAvailable = (statusLower.includes('available') || statusLower === 'tersedia') && stokVal > 0;
        
        let statusBadgeClass = 'status-ready';
        let statusText = 'Ready Stock';
        let actionBtnHtml = '';

        if (isAvailable) {
            statusBadgeClass = 'status-ready';
            statusText = '<i class="fa-solid fa-circle-check"></i> Ready Stock';
            actionBtnHtml = `
                <button class="card-action-btn" onclick="openSpkModal('${(item.chassis_no || '').replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-check"></i> Ambil Unit (SPK)
                </button>
            `;
        } else if (statusLower === 'matched') {
            statusBadgeClass = 'status-matched';
            statusText = '<i class="fa-solid fa-lock"></i> Unit Matched';
            actionBtnHtml = `
                <button class="card-action-btn disabled" onclick="showCustomAlert('Info Unit', 'Unit telah dialokasikan untuk customer lain.', 'info')">
                    <i class="fa-solid fa-lock"></i> Unit Terpesan
                </button>
            `;
        } else if (statusLower === 'reserved') {
            statusBadgeClass = 'status-reserved';
            statusText = '<i class="fa-solid fa-bookmark"></i> Unit Reserved';
            actionBtnHtml = `
                <button class="card-action-btn disabled" onclick="showCustomAlert('Info Unit', 'Unit sedang di-hold oleh dealer.', 'info')">
                    <i class="fa-solid fa-bookmark"></i> Unit Hold
                </button>
            `;
        } else {
            statusBadgeClass = 'status-inden';
            statusText = '<i class="fa-solid fa-clock"></i> Stok Inden';
            actionBtnHtml = `
                <button class="card-action-btn disabled" onclick="showCustomAlert('Perhatian', 'Unit ini saat ini tidak tersedia (Inden).', 'warning')">
                    <i class="fa-solid fa-clock"></i> Stok Kosong / Inden
                </button>
            `;
        }

        const imgPath = getCarImage(item.product_description, item.color_description);
        const cat = getCategory(item.product_description);

        cardsHtml += `
            <div class="inv-compact-card">
                <div class="card-top-row">
                    <div class="card-car-thumb" onclick="viewImage('${imgPath}')" title="Klik untuk perbesar">
                        <img src="${imgPath}" alt="car" onerror="this.src='../assets/img/mobil/agya.webp'">
                    </div>
                    <div class="card-main-meta">
                        <div class="table-car-cat">${cat}</div>
                        <div class="card-model-title" title="${item.product_description || 'Toyota Unit'}">${item.product_description || 'Toyota Unit'}</div>
                        <div class="card-rrn-badge">RRN: ${item.rrn || item.product_code || '-'}</div>
                        <div class="card-chassis-row">Chassis: <span>${item.chassis_no || '-'}</span></div>
                        <div class="card-pills-row">
                            <span class="table-color-pill"><i class="fa-solid fa-palette" style="color:#d7123a; font-size:10px;"></i> ${item.color_description || 'Standard'}</span>
                            <span class="badge-status-pill ${statusBadgeClass}">${statusText}</span>
                        </div>
                    </div>
                </div>

                <div class="card-divider-line"></div>

                <div class="card-tags-row">
                    ${item.site ? `<span class="card-tag-badge" title="Cabang"><i class="fa-solid fa-building"></i> ${item.site}</span>` : ''}
                    ${item.warehouse ? `<span class="card-tag-badge" title="Warehouse"><i class="fa-solid fa-warehouse"></i> ${item.warehouse}</span>` : ''}
                    ${item.location ? `<span class="card-tag-badge" title="Lokasi"><i class="fa-solid fa-location-dot" style="color:#c8102e;"></i> ${item.location}</span>` : ''}
                    ${item.stock_number ? `<span class="card-tag-badge" title="No Stok"># ${item.stock_number}</span>` : ''}
                </div>

                ${!isKacab ? actionBtnHtml : ''}
            </div>
        `;
    });

    cardsHtml += '</div>';
    container.innerHTML = cardsHtml;
}

// ── 10. Image Viewer Modal ─────────────────────────────────
function viewImage(src) {
    const modalImg = document.getElementById('modalImg');
    const imageModal = document.getElementById('imageModal');
    if (modalImg && imageModal) {
        modalImg.src = src;
        imageModal.classList.add('active');
    }
}

function closeImageModal() {
    const imageModal = document.getElementById('imageModal');
    if (imageModal) {
        imageModal.classList.remove('active');
    }
}

// ── 11. SPK / Ambil Unit Modal Logic ───────────────────────
let selectedSpkUnit = null;

function openSpkModal(chassisNo) {
    const item = inventoryData.find(u => u.chassis_no === chassisNo);
    if (!item) {
        showCustomAlert('Error', 'Data unit tidak ditemukan', 'error');
        return;
    }

    selectedSpkUnit = item;
    
    const titleEl = document.getElementById('spkPreviewTitle');
    const chassisEl = document.getElementById('spkPreviewChassis');
    
    if (titleEl) titleEl.textContent = item.product_description || 'UNIT TOYOTA';
    if (chassisEl) chassisEl.textContent = item.chassis_no || '-';

    const nameInp = document.getElementById('spkCustomerName');
    const phoneInp = document.getElementById('spkCustomerPhone');
    const tandaJadiInp = document.getElementById('spkTandaJadi');
    const tipeInp = document.getElementById('spkTipePembelian');
    
    if (nameInp) nameInp.value = '';
    if (phoneInp) phoneInp.value = '';
    if (tandaJadiInp) tandaJadiInp.value = '';
    if (tipeInp) tipeInp.value = '';

    const modal = document.getElementById('spkModal');
    if (modal) modal.classList.add('active');
}

function closeSpkModal() {
    const modal = document.getElementById('spkModal');
    if (modal) modal.classList.remove('active');
}

function formatRupiahInput(el) {
    let val = el.value.replace(/[^\d]/g, '');
    if (!val) {
        el.value = '';
        return;
    }
    let formatted = parseInt(val, 10).toLocaleString('id-ID');
    el.value = 'Rp ' + formatted;
}

function submitSpkForm(e) {
    e.preventDefault();
    if (!selectedSpkUnit) return;

    const name = document.getElementById('spkCustomerName').value.trim();
    const phone = document.getElementById('spkCustomerPhone').value.trim();
    const tandaJadi = document.getElementById('spkTandaJadi').value.trim();
    const tipe = document.getElementById('spkTipePembelian').value;

    if (!name || !phone || !tandaJadi || !tipe) {
        showCustomAlert('Peringatan', 'Harap isi semua kolom wajib (*)', 'warning');
        return;
    }

    closeSpkModal();

    setTimeout(() => {
        showCustomAlert(
            'Pengajuan SPK Berhasil!',
            `Unit ${selectedSpkUnit.product_description} (${selectedSpkUnit.chassis_no}) telah berhasil diajukan atas nama ${name}. Silakan lanjutkan ke Form SPK untuk cetak dokumen.`,
            'success'
        );
    }, 200);
}

// ── 12. Filter Modal Open / Close / Reset ──────────────────
function openFilterModal() {
    const el = document.getElementById('filterModal');
    if (el) el.classList.add('active');
}

function closeFilterModal() {
    const el = document.getElementById('filterModal');
    if (el) el.classList.remove('active');
}

function resetFilter() {
    const kEl = document.getElementById('kategoriFilter'); if (kEl) kEl.value = '';
    const mEl = document.getElementById('modelFilter'); if (mEl) mEl.value = '';
    const wEl = document.getElementById('warnaFilter'); if (wEl) wEl.value = '';
    const siEl = document.getElementById('siteFilter'); if (siEl) siEl.value = '';
    const waEl = document.getElementById('warehouseFilter'); if (waEl) waEl.value = '';
    const sEl = document.getElementById('statusFilter'); if (sEl) sEl.value = '';
    const sInp = document.getElementById('searchInput'); if (sInp) sInp.value = '';
    
    activeCategoryChip = '';
    const chips = document.querySelectorAll('.chip-item');
    chips.forEach(chip => {
        if (chip.getAttribute('data-chip') === '') chip.classList.add('active');
        else chip.classList.remove('active');
    });

    filterData();
}

// ── 13. Initialization ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
});
