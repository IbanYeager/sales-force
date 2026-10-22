// js/penjualan_tco.js - Interactive Dashboard Controller for TCO Sales & Polreg Mapping
let tcoMap = null;
let tcoMarkersGroup = null;
let tcoCirclesGroup = null;
let tcoOverviewData = null;
let currentPolregFilter = 'all';
let tcoTileLayers = {};
let currentBaseLayer = 'roadmap';

const OFFICE_LAT = -6.944425;
const OFFICE_LNG = 107.642250;

// Preset Coordinates for Fast Zoom
const REGION_ZOOM_COORDS = {
  all: { center: [-6.9250, 107.6350], zoom: 11 },
  bandung_kota: { center: [-6.9200, 107.6250], zoom: 12.5 },
  kab_bandung: { center: [-7.0150, 107.6200], zoom: 11 },
  cimahi: { center: [-6.8850, 107.5450], zoom: 13 },
  bandung_barat: { center: [-6.8350, 107.5150], zoom: 11.5 },
  plat_z: { center: [-7.0500, 107.8800], zoom: 10 },
  plat_e: { center: [-6.7120, 108.5550], zoom: 11 },
  plat_f: { center: [-6.8800, 107.0500], zoom: 10 }
};

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  setupEventListeners();
  loadTcoOverview();
});

// 1. Initialize Leaflet Map with Google Maps Tiles (No API key needed)
function initMap() {
  const mapElement = document.getElementById('tcoPolregMap');
  if (!mapElement) return;

  // Initialize Map
  tcoMap = L.map('tcoPolregMap', {
    center: [-6.9250, 107.6350],
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  });

  // Zoom control top-right
  L.control.zoom({ position: 'topright' }).addTo(tcoMap);

  // 1. Google Maps Roadmap Layer (High precision, clear roads & POIs in West Java)
  tcoTileLayers.roadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  });

  // 2. Google Maps Satellite / Hybrid Layer
  tcoTileLayers.satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
  });

  // 3. OpenStreetMap Fallback Layer
  tcoTileLayers.osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap'
  });

  // Set default base layer to Google Roadmap
  tcoTileLayers.roadmap.addTo(tcoMap);

  tcoCirclesGroup = L.layerGroup().addTo(tcoMap);
  tcoMarkersGroup = L.layerGroup().addTo(tcoMap);

  // Add Dealer HQ permanent marker
  addOfficeMarker();

  // Invalidate map size after rendering to avoid tile cutoffs
  setTimeout(() => {
    if (tcoMap) tcoMap.invalidateSize();
  }, 200);
  setTimeout(() => {
    if (tcoMap) tcoMap.invalidateSize();
  }, 600);

  window.addEventListener('resize', () => {
    if (tcoMap) tcoMap.invalidateSize();
  });
}

// 1.1 Switch Basemap Layer (Roadmap / Satellite)
function setBaseLayer(layerName) {
  if (!tcoMap || !tcoTileLayers[layerName]) return;

  Object.values(tcoTileLayers).forEach(layer => {
    if (tcoMap.hasLayer(layer)) {
      tcoMap.removeLayer(layer);
    }
  });

  tcoTileLayers[layerName].addTo(tcoMap);
  currentBaseLayer = layerName;

  const btnRoadmap = document.getElementById('btnTileRoadmap');
  const btnSatellite = document.getElementById('btnTileSatellite');
  if (btnRoadmap) btnRoadmap.classList.toggle('active', layerName === 'roadmap');
  if (btnSatellite) btnSatellite.classList.toggle('active', layerName === 'satellite');
}
window.setBaseLayer = setBaseLayer;

// 1.2 Permanent Office / Dealer Marker
function addOfficeMarker() {
  if (!tcoMap) return;

  const officeIcon = L.divIcon({
    className: 'tco-office-marker',
    html: `
      <div class="tco-office-pin" title="Dealer Utama: Tunas Toyota Kiara Condong">
        <i class="fa-solid fa-building-flag"></i>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });

  const marker = L.marker([OFFICE_LAT, OFFICE_LNG], {
    icon: officeIcon,
    zIndexOffset: 3000
  }).addTo(tcoMap);

  marker.bindPopup(`
    <div style="font-family:'Inter', sans-serif; padding:4px; min-width:230px;">
      <div style="font-size:10px; font-weight:800; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:6px; display:inline-block; margin-bottom:6px;">
        <i class="fa-solid fa-star"></i> KANTOR CABANG UTAMA
      </div>
      <h4 style="margin:0 0 4px; font-size:13.5px; font-weight:800; color:#0f172a;">Tunas Toyota Kiara Condong</h4>
      <p style="margin:0 0 6px; font-size:11px; color:#64748b;">Jl. Ibrahim Adjie No. 154, Kiara Condong, Bandung</p>
      <div style="font-size:11px; background:#f8fafc; padding:6px 8px; border-radius:6px; border:1px solid #e2e8f0; color:#0f172a; font-weight:600;">
        <i class="fa-solid fa-gem" style="color:#d7123a;"></i> Pusat Pemasangan &amp; Distribusi TCO
      </div>
    </div>
  `, { maxWidth: 280 });
}

// 1.3 Jump to Selected Regional Area
function jumpToArea(areaKey) {
  document.querySelectorAll('.tco-area-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.area === areaKey);
  });

  const target = REGION_ZOOM_COORDS[areaKey] || REGION_ZOOM_COORDS.all;
  if (tcoMap && target) {
    tcoMap.flyTo(target.center, target.zoom, {
      duration: 1.0,
      easeLinearity: 0.25
    });
  }
}
window.jumpToArea = jumpToArea;

// 2. Setup Event Listeners
function setupEventListeners() {
  const filterPeriode = document.getElementById('filterPeriode');
  if (filterPeriode) {
    filterPeriode.addEventListener('change', () => loadTcoOverview());
  }

  const filterModel = document.getElementById('filterModel');
  if (filterModel) {
    filterModel.addEventListener('change', () => loadTcoOverview());
  }

  const filterPolreg = document.getElementById('filterPolreg');
  if (filterPolreg) {
    filterPolreg.addEventListener('change', (e) => {
      currentPolregFilter = e.target.value;
      loadTcoOverview();
    });
  }

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        loadTcoOverview(e.target.value);
      }, 350);
    });
  }
}

// 3. Load TCO Overview from API
async function loadTcoOverview(searchQuery = '') {
  const filterPeriode = document.getElementById('filterPeriode')?.value || 'all';
  const filterModel = document.getElementById('filterModel')?.value || 'all';
  const polreg = currentPolregFilter || 'all';

  const params = new URLSearchParams({
    action: 'get_overview',
    periode: filterPeriode,
    model: filterModel,
    polreg: polreg,
    search: searchQuery
  });

  try {
    const res = await fetch(`../api/api_penjualan_tco.php?${params.toString()}`);
    const data = await res.json();

    if (data.status === 'success') {
      tcoOverviewData = data;
      renderKPI(data.kpi);
      renderMapHotspots(data.district_hotspots);
      renderPolregLeaderboard(data.polreg_ranking);
      renderTopAccessories(data.top_items);
      renderModelDistribution(data.model_distribution);
      renderTopSales(data.top_sales);
      renderTransactionsTable(data.recent_transactions);
    }
  } catch (err) {
    console.error('Error loading TCO overview:', err);
  }
}

// 4. Render KPI Cards
function renderKPI(kpi) {
  if (!kpi) return;

  const elRev = document.getElementById('kpiTotalRevenue');
  if (elRev) {
    elRev.innerText = 'Rp ' + Number(kpi.total_revenue).toLocaleString('id-ID');
  }

  const elQty = document.getElementById('kpiTotalQty');
  if (elQty) {
    elQty.innerText = Number(kpi.total_qty_item).toLocaleString('id-ID') + ' Unit';
  }

  const elPen = document.getElementById('kpiPenetrationRate');
  if (elPen) {
    elPen.innerText = kpi.penetration_rate + '%';
  }

  const elAvg = document.getElementById('kpiAvgPerSpk');
  if (elAvg) {
    elAvg.innerText = 'Rp ' + Math.round(Number(kpi.avg_transaksi)).toLocaleString('id-ID');
  }

  const elTopItem = document.getElementById('kpiBestSellerItem');
  if (elTopItem) {
    elTopItem.innerText = kpi.best_seller_item || '-';
  }
}

// 5. Render Map Pins & Hotspots
function renderMapHotspots(hotspots) {
  if (!tcoMap || !tcoMarkersGroup || !tcoCirclesGroup) return;

  tcoMarkersGroup.clearLayers();
  tcoCirclesGroup.clearLayers();

  if (!hotspots || hotspots.length === 0) return;

  // Find max qty for scaling
  let maxQty = 1;
  hotspots.forEach(h => {
    const q = parseInt(h.total_qty) || 1;
    if (q > maxQty) maxQty = q;
  });

  hotspots.forEach(h => {
    const lat = parseFloat(h.lat);
    const lng = parseFloat(h.lng);
    const qty = parseInt(h.total_qty) || 1;
    const rev = parseFloat(h.total_revenue) || 0;
    const polreg = h.wilayah_polreg;
    const district = h.kecamatan || h.kota;

    if (isNaN(lat) || isNaN(lng)) return;

    // Radius between 150m and 900m depending on sales intensity
    const radius = Math.min(1200, Math.max(300, (qty / maxQty) * 1100));

    // Semi-transparent heatmap circle
    const circle = L.circle([lat, lng], {
      radius: radius,
      color: '#d7123a',
      weight: 1.5,
      fillColor: '#f43f5e',
      fillOpacity: 0.28
    });
    tcoCirclesGroup.addLayer(circle);

    // Custom pulsing marker pin with unit badge
    const customIcon = L.divIcon({
      className: 'custom-tco-div-icon',
      html: `
        <div class="tco-pulsing-marker">
          <div class="tco-marker-pulse"></div>
          <div class="tco-marker-pin" title="${district}: ${qty} Unit">${qty}</div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const marker = L.marker([lat, lng], { icon: customIcon });

    // Sleek Popup
    const popupContent = `
      <div style="font-family:'Inter', sans-serif; padding:4px; min-width:210px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:10px; font-weight:800; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:6px; text-transform:uppercase;">
            ${h.polreg_code ? 'Plat ' + h.polreg_code : 'Polreg'}
          </span>
          <span style="font-size:11px; font-weight:700; color:#64748b;">${h.kota}</span>
        </div>
        <h4 style="margin:0 0 6px 0; font-size:14px; font-weight:800; color:#0f172a;">Kecamatan ${district}</h4>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:8px 10px; margin-bottom:8px;">
          <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px;">
            <span style="color:#64748b;">Aksesoris Terjual:</span>
            <strong style="color:#0f172a;">${qty} Unit</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11.5px; margin-bottom:4px;">
            <span style="color:#64748b;">Total SPK:</span>
            <strong style="color:#0f172a;">${h.total_spk} Kendaraan</strong>
          </div>
          <div style="display:flex; justify-content:space-between; font-size:11.5px;">
            <span style="color:#64748b;">Total Omset TCO:</span>
            <strong style="color:#d7123a;">Rp ${Math.round(rev).toLocaleString('id-ID')}</strong>
          </div>
        </div>
        <button type="button" onclick="filterByDistrict('${district}')" style="width:100%; background:#0d1b3e; color:#ffffff; border:none; padding:7px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">
          <i class="fa-solid fa-filter"></i> Saring Transaksi Daerah Ini
        </button>
      </div>
    `;

    marker.bindPopup(popupContent, { maxWidth: 280 });
    tcoMarkersGroup.addLayer(marker);
  });
}

// 6. Render Polreg Leaderboard
function renderPolregLeaderboard(ranking) {
  const container = document.getElementById('polregLeaderboardList');
  if (!container) return;

  if (!ranking || ranking.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#94a3b8; font-size:12px;">Belum ada data wilayah.</div>';
    return;
  }

  // Find max qty for progress bars
  const maxQty = Math.max(...ranking.map(r => parseInt(r.total_qty) || 1), 1);

  container.innerHTML = ranking.map((r, i) => {
    const qty = parseInt(r.total_qty) || 0;
    const rev = parseFloat(r.total_revenue) || 0;
    const pct = Math.round((qty / maxQty) * 100);
    const code = (r.polreg_code || 'D').toUpperCase();

    let badgeClass = 'badge-plat-d';
    if (code === 'Z') badgeClass = 'badge-plat-z';
    else if (code === 'E') badgeClass = 'badge-plat-e';
    else if (code === 'F') badgeClass = 'badge-plat-f';
    else if (code === 'B') badgeClass = 'badge-plat-b';
    else if (code === 'T') badgeClass = 'badge-plat-t';

    const isActive = (currentPolregFilter === r.wilayah_polreg) ? ' active' : '';

    return `
      <div class="tco-polreg-item${isActive}" onclick="selectPolregFilter('${r.wilayah_polreg}')" title="Klik untuk fokus wilayah ini">
        <div class="tco-polreg-head">
          <div class="tco-polreg-name">
            <span style="color:#64748b; font-size:11px;">#${i + 1}</span>
            <span>${r.wilayah_polreg}</span>
          </div>
          <span class="tco-polreg-badge ${badgeClass}">Plat ${code}</span>
        </div>
        <div class="tco-polreg-meta">
          <span>${qty} Unit Aksesoris (${r.total_spk} SPK)</span>
          <strong style="color:#0f172a;">Rp ${Math.round(rev).toLocaleString('id-ID')}</strong>
        </div>
        <div class="tco-progress-bg">
          <div class="tco-progress-bar" style="width: ${pct}%"></div>
        </div>
      </div>
    `;
  }).join('');
}

// 7. Render Top Accessories Leaderboard
function renderTopAccessories(items) {
  const container = document.getElementById('topAccessoriesList');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Tidak ada data item.</div>';
    return;
  }

  container.innerHTML = items.map((it, i) => {
    const rankClass = i === 0 ? 'rank-1' : (i === 1 ? 'rank-2' : (i === 2 ? 'rank-3' : ''));
    return `
      <div class="tco-top-item-row">
        <div class="tco-item-rank ${rankClass}">${i + 1}</div>
        <div class="tco-item-info">
          <div class="tco-item-name" title="${it.item_tco_name}">${it.item_tco_name}</div>
          <div class="tco-item-cat">${it.kategori_tco} • P/N: ${it.part_number || 'TAM'}</div>
        </div>
        <div class="tco-item-stat">
          <div class="tco-item-qty">${it.qty_terjual} Unit</div>
          <div class="tco-item-rev">Rp ${Math.round(it.revenue).toLocaleString('id-ID')}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 8. Render Model Distribution
function renderModelDistribution(models) {
  const container = document.getElementById('modelDistributionList');
  if (!container) return;

  if (!models || models.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Tidak ada data model.</div>';
    return;
  }

  const maxQty = Math.max(...models.map(m => parseInt(m.qty_terjual) || 1), 1);

  container.innerHTML = models.map((m, i) => {
    const qty = parseInt(m.qty_terjual) || 0;
    const rev = parseFloat(m.revenue) || 0;
    const pct = Math.round((qty / maxQty) * 100);

    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:4px;">
          <strong style="color:#0f172a;"><i class="fa-solid fa-car" style="color:#94a3b8; margin-right:5px;"></i> ${m.model_kendaraan}</strong>
          <span style="font-weight:700; color:#d7123a;">${qty} Unit</span>
        </div>
        <div class="tco-progress-bg">
          <div class="tco-progress-bar" style="width: ${pct}%; background:linear-gradient(90deg, #0d1b3e, #2563eb);"></div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:10.5px; color:#64748b; margin-top:2px;">
          <span>Kontribusi Aksesoris</span>
          <span>Rp ${Math.round(rev).toLocaleString('id-ID')}</span>
        </div>
      </div>
    `;
  }).join('');
}

// 9. Render Top Sales Champions
function renderTopSales(salesList) {
  const container = document.getElementById('topSalesList');
  if (!container) return;

  if (!salesList || salesList.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Tidak ada data wiraniaga.</div>';
    return;
  }

  container.innerHTML = salesList.map((s, i) => {
    const medalIcon = i === 0 ? '🥇' : (i === 1 ? '🥈' : (i === 2 ? '🥉' : `#${i + 1}`));
    return `
      <div class="tco-top-item-row">
        <div style="font-size:16px; width:28px; text-align:center; font-weight:800;">${medalIcon}</div>
        <div class="tco-item-info">
          <div class="tco-item-name" style="font-weight:800;">${s.nama_sales || 'Wiraniaga'}</div>
          <div class="tco-item-cat">SPV: ${s.nama_spv || '-'}</div>
        </div>
        <div class="tco-item-stat">
          <div class="tco-item-qty" style="color:#16a34a;">${s.total_qty} Unit</div>
          <div class="tco-item-rev">Rp ${Math.round(s.total_revenue).toLocaleString('id-ID')}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 10. Render Transactions Table
function renderTransactionsTable(transactions) {
  const tbody = document.getElementById('tcoTransactionsTbody');
  if (!tbody) return;

  if (!transactions || transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">Belum ada riwayat transaksi penjualan TCO sesuai filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = transactions.map((t, idx) => {
    const dateFormatted = t.tanggal_transaksi ? new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const totalRp = 'Rp ' + Number(t.total_harga).toLocaleString('id-ID');

    return `
      <tr>
        <td style="font-weight:800; font-family:monospace; color:#0f172a;">${t.spk_no || '-'}</td>
        <td style="white-space:nowrap; font-size:11.5px; color:#64748b;">${dateFormatted}</td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${t.customer_name}</div>
          <div style="font-size:11px; color:#64748b;">${t.customer_phone || '-'}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#0d1b3e;">${t.model_kendaraan}</div>
          <div style="font-size:11px; color:#64748b;">${t.tipe_kendaraan || '-'}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#d7123a;">${t.item_tco_name}</div>
          <div style="font-size:11px; color:#64748b;">${t.kategori_tco} • ${t.skema_harga}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${t.kecamatan || t.kota}</div>
          <div style="font-size:10.5px; color:#64748b;">${t.wilayah_polreg}</div>
        </td>
        <td style="white-space:nowrap;">
          <div style="font-weight:700; color:#0f172a;">${t.nama_sales}</div>
          <div style="font-size:10.5px; color:#64748b;">SPV: ${t.nama_spv || '-'}</div>
        </td>
        <td style="text-align:right; font-weight:800; color:#0f172a; white-space:nowrap;">${totalRp}</td>
      </tr>
    `;
  }).join('');
}

// 11. Quick Region Jump
function jumpToArea(areaKey) {
  // Update active pill button
  document.querySelectorAll('.tco-area-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.area === areaKey);
  });

  const target = REGION_ZOOM_COORDS[areaKey] || REGION_ZOOM_COORDS.all;
  if (tcoMap) {
    tcoMap.flyTo(target.center, target.zoom, { duration: 1.2 });
  }
}

// 12. Switch Map Modes (Hotspot / Pin)
function setMapMode(mode) {
  document.querySelectorAll('.tco-map-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (!tcoMap || !tcoCirclesGroup || !tcoMarkersGroup) return;

  if (mode === 'heatmap') {
    tcoMap.addLayer(tcoCirclesGroup);
    tcoMap.removeLayer(tcoMarkersGroup);
  } else if (mode === 'pins') {
    tcoMap.addLayer(tcoMarkersGroup);
    tcoMap.removeLayer(tcoCirclesGroup);
  } else {
    // Both
    tcoMap.addLayer(tcoCirclesGroup);
    tcoMap.addLayer(tcoMarkersGroup);
  }
}

// 13. Select Polreg Filter
function selectPolregFilter(polregName) {
  if (currentPolregFilter === polregName) {
    currentPolregFilter = 'all'; // Toggle off
  } else {
    currentPolregFilter = polregName;
  }

  const polregSelect = document.getElementById('filterPolreg');
  if (polregSelect) {
    polregSelect.value = currentPolregFilter;
  }

  loadTcoOverview();
}

function filterByDistrict(districtName) {
  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    searchInput.value = districtName;
    loadTcoOverview(districtName);
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 14. Reset All Filters
function resetFilters() {
  currentPolregFilter = 'all';
  const filterPeriode = document.getElementById('filterPeriode');
  const filterModel = document.getElementById('filterModel');
  const filterPolreg = document.getElementById('filterPolreg');
  const searchInput = document.getElementById('tableSearchInput');

  if (filterPeriode) filterPeriode.value = 'all';
  if (filterModel) filterModel.value = 'all';
  if (filterPolreg) filterPolreg.value = 'all';
  if (searchInput) searchInput.value = '';

  jumpToArea('all');
  loadTcoOverview();
}

// 15. Export CSV
function exportTcoCsv() {
  if (!tcoOverviewData || !tcoOverviewData.recent_transactions) {
    alert('Data transaksi belum siap untuk diekspor.');
    return;
  }

  const headers = ['No SPK', 'Tanggal', 'Customer', 'Telepon', 'Model', 'Tipe', 'Aksesoris TCO', 'Kategori', 'Part Number', 'Skema', 'Qty', 'Total Harga', 'Polreg', 'Kota', 'Kecamatan', 'Salesman', 'SPV'];
  const rows = tcoOverviewData.recent_transactions.map(t => [
    `"${t.spk_no || ''}"`,
    `"${t.tanggal_transaksi || ''}"`,
    `"${t.customer_name || ''}"`,
    `"${t.customer_phone || ''}"`,
    `"${t.model_kendaraan || ''}"`,
    `"${t.tipe_kendaraan || ''}"`,
    `"${t.item_tco_name || ''}"`,
    `"${t.kategori_tco || ''}"`,
    `"${t.part_number || ''}"`,
    `"${t.skema_harga || ''}"`,
    t.qty || 1,
    t.total_harga || 0,
    `"${t.wilayah_polreg || ''}"`,
    `"${t.kota || ''}"`,
    `"${t.kecamatan || ''}"`,
    `"${t.nama_sales || ''}"`,
    `"${t.nama_spv || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Laporan_Penjualan_TCO_Polreg_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 16. Modal Dialog Handlers
function openInputModal() {
  const modal = document.getElementById('inputTcoModal');
  if (modal) modal.classList.add('show');
}

function closeInputModal() {
  const modal = document.getElementById('inputTcoModal');
  if (modal) modal.classList.remove('show');
}

async function submitNewTransactionForm(event) {
  event.preventDefault();

  const customer_name = document.getElementById('inputCustomerName').value.trim();
  const spk_no = document.getElementById('inputSpkNo').value.trim();
  const nama_sales = document.getElementById('inputSalesName').value.trim();
  const nama_spv = document.getElementById('inputSpvName').value.trim();
  const model_kendaraan = document.getElementById('inputCarModel').value;
  const item_tco_name = document.getElementById('inputItemName').value.trim();
  const harga_satuan = parseInt(document.getElementById('inputPrice').value) || 0;
  const wilayah_polreg = document.getElementById('inputPolreg').value;
  const kecamatan = document.getElementById('inputKecamatan').value.trim();

  let polreg_code = 'D';
  if (wilayah_polreg.includes('Plat Z')) polreg_code = 'Z';
  else if (wilayah_polreg.includes('Plat E')) polreg_code = 'E';
  else if (wilayah_polreg.includes('Plat F')) polreg_code = 'F';

  let kota = 'KOTA BANDUNG';
  if (wilayah_polreg.includes('Kab. Bandung')) kota = 'KAB. BANDUNG';
  else if (wilayah_polreg.includes('Cimahi')) kota = 'KOTA CIMAHI';
  else if (wilayah_polreg.includes('Bandung Barat')) kota = 'KAB. BANDUNG BARAT';
  else if (wilayah_polreg.includes('Sumedang')) kota = 'KAB. SUMEDANG';
  else if (wilayah_polreg.includes('Garut')) kota = 'KAB. GARUT';

  const payload = {
    action: 'add_transaction',
    spk_no,
    nama_sales,
    nama_spv,
    customer_name,
    model_kendaraan,
    item_tco_name,
    harga_satuan,
    qty: 1,
    total_harga: harga_satuan,
    polreg_code,
    wilayah_polreg,
    kota,
    kecamatan: kecamatan || 'Lengkong',
    tanggal_transaksi: new Date().toISOString().slice(0, 10)
  };

  try {
    const res = await fetch('../api/api_penjualan_tco.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.status === 'success') {
      alert('Transaksi penjualan TCO berhasil disimpan!');
      closeInputModal();
      loadTcoOverview();
    } else {
      alert('Gagal menyimpan: ' + (result.message || 'Terjadi kesalahan'));
    }
  } catch (err) {
    alert('Terjadi error jaringan: ' + err.message);
  }
}

// Global window exports for HTML event bindings
window.jumpToArea = jumpToArea;
window.setMapMode = setMapMode;
window.setBaseLayer = setBaseLayer;
window.selectPolregFilter = selectPolregFilter;
window.filterByDistrict = filterByDistrict;
window.resetFilters = resetFilters;
window.exportTcoCsv = exportTcoCsv;
window.openInputModal = openInputModal;
window.closeInputModal = closeInputModal;
window.submitNewTransactionForm = submitNewTransactionForm;
window.loadTcoOverview = loadTcoOverview;
