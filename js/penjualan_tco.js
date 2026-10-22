// js/penjualan_tco.js - Interactive Dashboard Controller for TCO Sales & Polygon Polreg Mapping

let tcoMap = null;
let tcoTileLayers = {};
let currentBaseLayer = 'roadmap';

// GeoJSON & Layer Containers for 79 Districts
let allDistrictsGeo = [];
let tcoPolygonLayers = {};
let tcoMarkerLayers = {};
let districtsDataDict = {};
let selectedDistrictId = 'kiaracondong'; // Default focus: Dealer HQ

// Filter states
let currentRegencyFilter = 'all';
let currentStatusFilter = 'all';
let currentPolregFilter = 'all';
let tcoOverviewData = null;

const OFFICE_LAT = -6.944425;
const OFFICE_LNG = 107.642250;

// Regency coordinate boundaries for fast zooming
const REGENCY_BOUNDS = {
  all: { center: [-6.9250, 107.6350], zoom: 11 },
  kota_bandung: { center: [-6.9147, 107.6098], zoom: 12 },
  kota_cimahi: { center: [-6.8722, 107.5420], zoom: 13 },
  kab_bandung: { center: [-7.0250, 107.6200], zoom: 10.5 },
  kab_bandung_barat: { center: [-6.8450, 107.4900], zoom: 11 }
};

document.addEventListener('DOMContentLoaded', async () => {
  initMap();
  setupEventListeners();
  await loadPolregGeoJson();
  await loadTcoOverview();
});

/**
 * 1. Initialize Leaflet Map with Google Maps Roadmap & Satellite
 */
function initMap() {
  const mapElement = document.getElementById('tcoPolregMap');
  if (!mapElement) return;

  // Initialize Map
  tcoMap = L.map('tcoPolregMap', {
    center: [-6.9250, 107.6350],
    zoom: 11,
    zoomControl: false,
    attributionControl: false,
    minZoom: 9,
    maxZoom: 18
  });

  // Zoom control top-right
  L.control.zoom({ position: 'topright' }).addTo(tcoMap);

  // 1. Google Maps Roadmap Layer
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

  // Default base layer
  tcoTileLayers.roadmap.addTo(tcoMap);

  // Add Permanent Dealer HQ Marker
  addOfficeMarker();

  // Resize handling
  setTimeout(() => { if (tcoMap) tcoMap.invalidateSize(); }, 200);
  setTimeout(() => { if (tcoMap) tcoMap.invalidateSize(); }, 600);
  window.addEventListener('resize', () => { if (tcoMap) tcoMap.invalidateSize(); });
}

/**
 * 1.1 Switch Basemap Layer (Roadmap / Satellite)
 */
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

/**
 * 1.2 Permanent Office Marker (Tunas Toyota Kiara Condong)
 */
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
        <i class="fa-solid fa-gem" style="color:#d7123a;"></i> Pusat Instalasi &amp; Distribusi TCO Bandung Raya
      </div>
    </div>
  `, { maxWidth: 280 });
}

/**
 * 1.3 Recenter Map to Dealer HQ
 */
function recenterToDealerHQ() {
  if (!tcoMap) return;
  tcoMap.flyTo([OFFICE_LAT, OFFICE_LNG], 13, { duration: 1.0 });
  selectDistrict('kiaracondong', false);
}
window.recenterToDealerHQ = recenterToDealerHQ;

/**
 * 2. Multi-Path GeoJSON Loader for 79 Bandung Raya Districts
 */
async function loadPolregGeoJson() {
  const possiblePaths = [
    '../data/polreg_districts.json',
    'data/polreg_districts.json',
    '/data/polreg_districts.json',
    '/public/data/polreg_districts.json',
    '../../data/polreg_districts.json'
  ];

  for (const path of possiblePaths) {
    try {
      const res = await fetch(path + '?v=' + Date.now());
      if (res.ok) {
        const json = await res.json();
        if (json && json.districts && json.districts.length > 0) {
          allDistrictsGeo = json.districts;
          return;
        }
      }
    } catch (e) {
      // Continue to next path
    }
  }
  console.warn('Gagal memuat polreg_districts.json dari semua path.');
  allDistrictsGeo = [];
}

/**
 * 3. Setup Filter & Search Event Listeners
 */
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

/**
 * 4. Helper: Normalisasi Key Nama Kecamatan
 */
function normalizeDistrictKey(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[\s\-\.]/g, '');
}

/**
 * 5. Helper Status Penetrasi & Pewarnaan Choropleth
 */
function getStatusMeta(status) {
  switch (status) {
    case 'Tinggi':
      return {
        label: 'Penetrasi Tinggi (Dominan)',
        color: '#10b981', // Emerald
        badgeClass: 'high',
        icon: 'fa-circle-check',
        opacity: 0.42
      };
    case 'Sedang':
      return {
        label: 'Penetrasi Sedang (Potensial)',
        color: '#3b82f6', // Blue
        badgeClass: 'mid',
        icon: 'fa-circle-dot',
        opacity: 0.38
      };
    case 'Rendah':
      return {
        label: 'Penetrasi Baru',
        color: '#ef4444', // Red/Rose
        badgeClass: 'low',
        icon: 'fa-triangle-exclamation',
        opacity: 0.35
      };
    default:
      return {
        label: 'Belum Ada SPK TCO',
        color: '#94a3b8', // Gray
        badgeClass: 'zero',
        icon: 'fa-circle-notch',
        opacity: 0.16
      };
  }
}

/**
 * 6. Load TCO Overview from Backend API
 */
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
      districtsDataDict = data.districts_dict || {};

      renderKPI(data.kpi);
      renderDistrictPolygons();
      renderPolregLeaderboard(data.polreg_ranking);
      renderTopAccessories(data.top_items);
      renderModelDistribution(data.model_distribution);
      renderTopSales(data.top_sales);
      renderTransactionsTable(data.recent_transactions);

      // Default select active district (Kiaracondong or first with data)
      if (selectedDistrictId) {
        selectDistrict(selectedDistrictId, false);
      }
    }
  } catch (err) {
    console.error('Error loading TCO overview:', err);
  }
}

/**
 * 7. Render 79 Official District Polygons on Leaflet Map
 */
function renderDistrictPolygons() {
  if (!tcoMap || allDistrictsGeo.length === 0) return;

  // Clear previous layers
  Object.values(tcoPolygonLayers).forEach(p => tcoMap.removeLayer(p));
  Object.values(tcoMarkerLayers).forEach(m => tcoMap.removeLayer(m));
  tcoPolygonLayers = {};
  tcoMarkerLayers = {};

  allDistrictsGeo.forEach(dist => {
    // Match data from DB using normalized key
    const rawKey = normalizeDistrictKey(dist.id);
    const altKey = normalizeDistrictKey(dist.name);
    const data = districtsDataDict[rawKey] || districtsDataDict[altKey] || null;

    const hasData = !!data;
    const status = hasData ? (data.status || 'Rendah') : 'Belum Ada';
    const statusMeta = getStatusMeta(status);

    const totalQty = hasData ? (parseInt(data.total_qty) || 0) : 0;
    const totalRev = hasData ? (parseFloat(data.total_revenue) || 0) : 0;
    const totalSpk = hasData ? (parseInt(data.total_spk) || 0) : 0;
    const topItemName = hasData ? (data.top_item_name || '-') : '-';
    const topItemQty = hasData ? (data.top_item_qty || 0) : 0;
    const topModelName = hasData ? (data.top_model_name || '-') : '-';
    const topModelQty = hasData ? (data.top_model_qty || 0) : 0;

    // Check filter match
    const matchRegency = (currentRegencyFilter === 'all') || (dist.regencyId === currentRegencyFilter);
    const matchStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);
    const isVisible = matchRegency && matchStatus;

    // Construct Leaflet Polygon
    const isCurrentSelected = (dist.id === selectedDistrictId);
    const polygon = L.polygon(dist.polygon, {
      color: isCurrentSelected ? '#d7123a' : statusMeta.color,
      weight: isCurrentSelected ? 3.5 : (hasData ? 2 : 1.2),
      fillColor: statusMeta.color,
      fillOpacity: isCurrentSelected ? 0.6 : (hasData ? statusMeta.opacity : 0.14),
      smoothFactor: 1
    });

    if (isVisible) {
      polygon.addTo(tcoMap);
    }

    // Hover interactions
    polygon.on('mouseover', function () {
      if (selectedDistrictId !== dist.id) {
        this.setStyle({
          weight: 3.5,
          color: '#d7123a',
          fillOpacity: 0.58
        });
      }
      const marker = tcoMarkerLayers[dist.id];
      if (marker) {
        marker.setZIndexOffset(9000);
        const el = marker.getElement();
        if (el) el.querySelector('.tco-district-label')?.classList.add('hovered');
      }
    });

    polygon.on('mouseout', function () {
      if (selectedDistrictId !== dist.id) {
        this.setStyle({
          weight: hasData ? 2 : 1.2,
          color: statusMeta.color,
          fillOpacity: hasData ? statusMeta.opacity : 0.14
        });
      }
      const marker = tcoMarkerLayers[dist.id];
      if (marker && selectedDistrictId !== dist.id) {
        marker.setZIndexOffset(0);
        const el = marker.getElement();
        if (el) el.querySelector('.tco-district-label')?.classList.remove('hovered');
      }
    });

    // Click event -> Select District & Update Inspector HUD
    polygon.on('click', function () {
      selectDistrict(dist.id, true);
    });

    // Modern Glassmorphic Tooltip
    polygon.bindTooltip(`
      <div class="polreg-glass-tooltip">
        <div class="tooltip-header">
          <span class="tooltip-title">${escapeHtml(dist.name)}</span>
          <span class="tooltip-badge ${statusMeta.badgeClass}">
            <i class="fa-solid ${statusMeta.icon}"></i> ${status}
          </span>
        </div>
        <div class="tooltip-regency">${escapeHtml(dist.regency || 'Bandung Raya')}${dist.zone ? ' • ' + escapeHtml(dist.zone) : ''}</div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-row">
          <span>Omset TCO:</span>
          <b style="color:#d7123a;">Rp ${Math.round(totalRev).toLocaleString('id-ID')}</b>
        </div>
        <div class="tooltip-row">
          <span>Total Terjual:</span>
          <b>${totalQty} Unit (${totalSpk} SPK)</b>
        </div>
        <div class="tooltip-divider"></div>
        <div class="tooltip-row">
          <span>#1 Aksesoris:</span>
          <b style="color:#0f172a;">${escapeHtml(topItemName)} ${topItemQty > 0 ? `(${topItemQty} U)` : ''}</b>
        </div>
        <div class="tooltip-row">
          <span>#1 Model Mobil:</span>
          <b style="color:#2563eb;">${escapeHtml(topModelName)} ${topModelQty > 0 ? `(${topModelQty} SPK)` : ''}</b>
        </div>
        <div class="tooltip-hint"><i class="fa-solid fa-arrow-pointer"></i> Klik untuk analisis kecamatan</div>
      </div>
    `, {
      sticky: true,
      className: 'polreg-modern-tooltip-wrap',
      direction: 'top',
      offset: [0, -10]
    });

    tcoPolygonLayers[dist.id] = polygon;

    // Centroid Label Marker
    const labelIcon = L.divIcon({
      className: 'tco-district-label-wrap',
      html: `
        <div class="tco-district-label ${statusMeta.badgeClass}${isCurrentSelected ? ' active' : ''}" data-id="${dist.id}">
          <span class="tco-label-dot ${statusMeta.badgeClass}"></span>
          <span class="tco-label-text">${escapeHtml(dist.name)}</span>
          ${totalQty > 0 ? `<span class="tco-label-val">${totalQty}U</span>` : ''}
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });

    const labelMarker = L.marker(dist.center, {
      icon: labelIcon,
      interactive: false
    });

    if (isVisible) {
      labelMarker.addTo(tcoMap);
    }

    tcoMarkerLayers[dist.id] = labelMarker;
  });
}

/**
 * 8. Select District & Update Inspector HUD
 */
function selectDistrict(districtId, flyTo = true) {
  selectedDistrictId = districtId;
  const dist = allDistrictsGeo.find(d => d.id === districtId);
  if (!dist) return;

  const rawKey = normalizeDistrictKey(dist.id);
  const altKey = normalizeDistrictKey(dist.name);
  const data = districtsDataDict[rawKey] || districtsDataDict[altKey] || null;

  const hasData = !!data;
  const status = hasData ? (data.status || 'Rendah') : 'Belum Ada';
  const statusMeta = getStatusMeta(status);

  const totalQty = hasData ? (parseInt(data.total_qty) || 0) : 0;
  const totalRev = hasData ? (parseFloat(data.total_revenue) || 0) : 0;
  const totalSpk = hasData ? (parseInt(data.total_spk) || 0) : 0;
  const topItemName = hasData ? (data.top_item_name || 'Belum ada data') : 'Belum ada data TCO';
  const topItemQty = hasData ? (data.top_item_qty || 0) : 0;
  const topModelName = hasData ? (data.top_model_name || 'Belum ada data') : 'Belum ada data unit';
  const topModelQty = hasData ? (data.top_model_qty || 0) : 0;
  const avgPerSpk = totalSpk > 0 ? Math.round(totalRev / totalSpk) : 0;

  // 1. Update Inspector HUD Elements
  const elTag = document.getElementById('hudZoneTag');
  if (elTag) {
    const regencyName = (dist.regency || 'KOTA BANDUNG').toUpperCase();
    const platCode = (data && data.polreg_code) ? `PLAT ${data.polreg_code}` : 'PLAT D';
    elTag.innerText = `${regencyName} • ${platCode}`;
  }

  const elTitle = document.getElementById('hudDistrictTitle');
  if (elTitle) elTitle.innerText = dist.name;

  const elBadge = document.getElementById('hudStatusBadge');
  if (elBadge) {
    elBadge.className = `tco-hud-status-badge ${statusMeta.badgeClass}`;
    elBadge.innerHTML = `<i class="fa-solid ${statusMeta.icon}"></i> ${statusMeta.label}`;
  }

  const elOmset = document.getElementById('hudOmsetVal');
  if (elOmset) elOmset.innerText = 'Rp ' + Math.round(totalRev).toLocaleString('id-ID');

  const elSpk = document.getElementById('hudSpkCount');
  if (elSpk) elSpk.innerText = `${totalSpk} SPK Terpasang`;

  const elQty = document.getElementById('hudTotalQtyVal');
  if (elQty) elQty.innerText = `${totalQty} Unit`;

  const elAvg = document.getElementById('hudAvgVal');
  if (elAvg) elAvg.innerText = `Rp ${avgPerSpk.toLocaleString('id-ID')} / SPK`;

  const elTopItem = document.getElementById('hudTopItemName');
  if (elTopItem) elTopItem.innerText = topItemName;

  const elTopItemQty = document.getElementById('hudTopItemQty');
  if (elTopItemQty) elTopItemQty.innerText = `${topItemQty} Unit Terjual di Wilayah Ini`;

  const elTopModel = document.getElementById('hudTopModelName');
  if (elTopModel) elTopModel.innerText = topModelName;

  const elTopModelQty = document.getElementById('hudTopModelQty');
  if (elTopModelQty) elTopModelQty.innerText = `${topModelQty} Kendaraan Terpasang TCO`;

  // 2. Highlight Polygon & Label
  Object.keys(tcoPolygonLayers).forEach(id => {
    const poly = tcoPolygonLayers[id];
    const dGeo = allDistrictsGeo.find(d => d.id === id);
    const dData = dGeo ? (districtsDataDict[normalizeDistrictKey(dGeo.id)] || districtsDataDict[normalizeDistrictKey(dGeo.name)]) : null;
    const dStatus = dData ? (dData.status || 'Rendah') : 'Belum Ada';
    const dMeta = getStatusMeta(dStatus);

    if (id === districtId) {
      poly.setStyle({
        weight: 4,
        color: '#d7123a',
        fillOpacity: 0.65
      });
      poly.bringToFront();
    } else {
      poly.setStyle({
        weight: dData ? 2 : 1.2,
        color: dMeta.color,
        fillOpacity: dData ? dMeta.opacity : 0.14
      });
    }
  });

  // Update label markers active class
  document.querySelectorAll('.tco-district-label').forEach(label => {
    label.classList.toggle('active', label.dataset.id === districtId);
  });

  // 3. Optional Smooth Fly-to
  if (flyTo && tcoMap && dist.center) {
    tcoMap.flyTo(dist.center, Math.max(tcoMap.getZoom(), 12.5), {
      duration: 0.8,
      easeLinearity: 0.3
    });
  }
}
window.selectDistrict = selectDistrict;

/**
 * 9. Filter Map by Regency (Kota Bandung, Cimahi, Kab. Bandung, KBB)
 */
function filterMapByRegency(regencyKey) {
  currentRegencyFilter = regencyKey;

  // Update active pill button
  document.querySelectorAll('.tco-area-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.regency === regencyKey);
  });

  // Re-apply visibility to polygons
  allDistrictsGeo.forEach(dist => {
    const rawKey = normalizeDistrictKey(dist.id);
    const altKey = normalizeDistrictKey(dist.name);
    const data = districtsDataDict[rawKey] || districtsDataDict[altKey] || null;
    const status = data ? (data.status || 'Rendah') : 'Belum Ada';

    const matchRegency = (regencyKey === 'all') || (dist.regencyId === regencyKey);
    const matchStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);
    const isVisible = matchRegency && matchStatus;

    const poly = tcoPolygonLayers[dist.id];
    const marker = tcoMarkerLayers[dist.id];

    if (poly) {
      if (isVisible && !tcoMap.hasLayer(poly)) tcoMap.addLayer(poly);
      else if (!isVisible && tcoMap.hasLayer(poly)) tcoMap.removeLayer(poly);
    }
    if (marker) {
      if (isVisible && !tcoMap.hasLayer(marker)) tcoMap.addLayer(marker);
      else if (!isVisible && tcoMap.hasLayer(marker)) tcoMap.removeLayer(marker);
    }
  });

  // Fly to regency bounds
  const boundsInfo = REGENCY_BOUNDS[regencyKey] || REGENCY_BOUNDS.all;
  if (tcoMap && boundsInfo) {
    tcoMap.flyTo(boundsInfo.center, boundsInfo.zoom, { duration: 1.0 });
  }
}
window.filterMapByRegency = filterMapByRegency;

/**
 * 10. Filter Map by Penetrasi Status
 */
function filterMapByStatus(statusVal) {
  currentStatusFilter = statusVal;

  allDistrictsGeo.forEach(dist => {
    const rawKey = normalizeDistrictKey(dist.id);
    const altKey = normalizeDistrictKey(dist.name);
    const data = districtsDataDict[rawKey] || districtsDataDict[altKey] || null;
    const status = data ? (data.status || 'Rendah') : 'Belum Ada';

    const matchRegency = (currentRegencyFilter === 'all') || (dist.regencyId === currentRegencyFilter);
    const matchStatus = (statusVal === 'all') || (status === statusVal);
    const isVisible = matchRegency && matchStatus;

    const poly = tcoPolygonLayers[dist.id];
    const marker = tcoMarkerLayers[dist.id];

    if (poly) {
      if (isVisible && !tcoMap.hasLayer(poly)) tcoMap.addLayer(poly);
      else if (!isVisible && tcoMap.hasLayer(poly)) tcoMap.removeLayer(poly);
    }
    if (marker) {
      if (isVisible && !tcoMap.hasLayer(marker)) tcoMap.addLayer(marker);
      else if (!isVisible && tcoMap.hasLayer(marker)) tcoMap.removeLayer(marker);
    }
  });
}
window.filterMapByStatus = filterMapByStatus;

/**
 * 11. Filter Transaction Table from HUD Button
 */
function filterTransactionsFromHud() {
  const dist = allDistrictsGeo.find(d => d.id === selectedDistrictId);
  if (!dist) return;

  const searchInput = document.getElementById('tableSearchInput');
  if (searchInput) {
    searchInput.value = dist.name;
    loadTcoOverview(dist.name);
    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
window.filterTransactionsFromHud = filterTransactionsFromHud;

/**
 * 12. Render KPI Summary Cards
 */
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

/**
 * 13. Render Polreg Leaderboard Side Panel
 */
function renderPolregLeaderboard(ranking) {
  const container = document.getElementById('polregLeaderboardList');
  if (!container) return;

  if (!ranking || ranking.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:30px; color:#94a3b8; font-size:12px;">Belum ada data wilayah.</div>';
    return;
  }

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
      <div class="tco-polreg-item${isActive}" onclick="selectPolregFilter('${escapeHtml(r.wilayah_polreg)}')" title="Klik untuk fokus wilayah ini">
        <div class="tco-polreg-head">
          <div class="tco-polreg-name">
            <span style="color:#64748b; font-size:11px;">#${i + 1}</span>
            <span>${escapeHtml(r.wilayah_polreg)}</span>
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

/**
 * 14. Render Top Accessories Leaderboard
 */
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
          <div class="tco-item-name" title="${escapeHtml(it.item_tco_name)}">${escapeHtml(it.item_tco_name)}</div>
          <div class="tco-item-cat">${escapeHtml(it.kategori_tco)} • P/N: ${escapeHtml(it.part_number || 'TAM')}</div>
        </div>
        <div class="tco-item-stat">
          <div class="tco-item-qty">${it.qty_terjual} Unit</div>
          <div class="tco-item-rev">Rp ${Math.round(it.revenue).toLocaleString('id-ID')}</div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 15. Render Vehicle Model Distribution
 */
function renderModelDistribution(models) {
  const container = document.getElementById('modelDistributionList');
  if (!container) return;

  if (!models || models.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Tidak ada data model.</div>';
    return;
  }

  const maxQty = Math.max(...models.map(m => parseInt(m.qty_terjual) || 1), 1);

  container.innerHTML = models.map((m) => {
    const qty = parseInt(m.qty_terjual) || 0;
    const rev = parseFloat(m.revenue) || 0;
    const pct = Math.round((qty / maxQty) * 100);

    return `
      <div style="margin-bottom:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:4px;">
          <strong style="color:#0f172a;"><i class="fa-solid fa-car" style="color:#94a3b8; margin-right:5px;"></i> ${escapeHtml(m.model_kendaraan)}</strong>
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

/**
 * 16. Render Top Sales Champions
 */
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
          <div class="tco-item-name" style="font-weight:800;">${escapeHtml(s.nama_sales || 'Wiraniaga')}</div>
          <div class="tco-item-cat">SPV: ${escapeHtml(s.nama_spv || '-')}</div>
        </div>
        <div class="tco-item-stat">
          <div class="tco-item-qty" style="color:#16a34a;">${s.total_qty} Unit</div>
          <div class="tco-item-rev">Rp ${Math.round(s.total_revenue).toLocaleString('id-ID')}</div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * 17. Render Transactions Table
 */
function renderTransactionsTable(transactions) {
  const tbody = document.getElementById('tcoTransactionsTbody');
  if (!tbody) return;

  if (!transactions || transactions.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:40px; color:#94a3b8;">Belum ada riwayat transaksi penjualan TCO sesuai filter.</td></tr>`;
    return;
  }

  tbody.innerHTML = transactions.map((t) => {
    const dateFormatted = t.tanggal_transaksi ? new Date(t.tanggal_transaksi).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';
    const totalRp = 'Rp ' + Number(t.total_harga).toLocaleString('id-ID');

    return `
      <tr>
        <td style="font-weight:800; font-family:monospace; color:#0f172a;">${escapeHtml(t.spk_no || '-')}</td>
        <td style="white-space:nowrap; font-size:11.5px; color:#64748b;">${dateFormatted}</td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${escapeHtml(t.customer_name)}</div>
          <div style="font-size:11px; color:#64748b;">${escapeHtml(t.customer_phone || '-')}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#0d1b3e;">${escapeHtml(t.model_kendaraan)}</div>
          <div style="font-size:11px; color:#64748b;">${escapeHtml(t.tipe_kendaraan || '-')}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#d7123a;">${escapeHtml(t.item_tco_name)}</div>
          <div style="font-size:11px; color:#64748b;">${escapeHtml(t.kategori_tco)} • ${escapeHtml(t.skema_harga)}</div>
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${escapeHtml(t.kecamatan || t.kota)}</div>
          <div style="font-size:10.5px; color:#64748b;">${escapeHtml(t.wilayah_polreg)}</div>
        </td>
        <td style="white-space:nowrap;">
          <div style="font-weight:700; color:#0f172a;">${escapeHtml(t.nama_sales)}</div>
          <div style="font-size:10.5px; color:#64748b;">SPV: ${escapeHtml(t.nama_spv || '-')}</div>
        </td>
        <td style="text-align:right; font-weight:800; color:#0f172a; white-space:nowrap;">${totalRp}</td>
      </tr>
    `;
  }).join('');
}

/**
 * 18. Polreg Sidebar Item Selection
 */
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
window.selectPolregFilter = selectPolregFilter;

/**
 * 19. Reset All Filters
 */
function resetFilters() {
  currentPolregFilter = 'all';
  currentRegencyFilter = 'all';
  currentStatusFilter = 'all';

  const filterPeriode = document.getElementById('filterPeriode');
  const filterModel = document.getElementById('filterModel');
  const filterPolreg = document.getElementById('filterPolreg');
  const searchInput = document.getElementById('tableSearchInput');
  const mapFilterStatus = document.getElementById('mapFilterStatus');

  if (filterPeriode) filterPeriode.value = 'all';
  if (filterModel) filterModel.value = 'all';
  if (filterPolreg) filterPolreg.value = 'all';
  if (searchInput) searchInput.value = '';
  if (mapFilterStatus) mapFilterStatus.value = 'all';

  document.querySelectorAll('.tco-area-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.regency === 'all');
  });

  if (tcoMap) {
    tcoMap.flyTo(REGENCY_BOUNDS.all.center, REGENCY_BOUNDS.all.zoom, { duration: 1.0 });
  }

  loadTcoOverview();
}
window.resetFilters = resetFilters;

/**
 * 20. Export CSV Report
 */
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
window.exportTcoCsv = exportTcoCsv;

/**
 * 21. Modal Dialog & New Transaction Submission
 */
function openInputModal() {
  const modal = document.getElementById('inputTcoModal');
  if (modal) modal.classList.add('show');
}
window.openInputModal = openInputModal;

function closeInputModal() {
  const modal = document.getElementById('inputTcoModal');
  if (modal) modal.classList.remove('show');
}
window.closeInputModal = closeInputModal;

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
    kecamatan: kecamatan || 'Kiaracondong',
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
window.submitNewTransactionForm = submitNewTransactionForm;

/**
 * 22. Helper: Escape HTML string
 */
function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
