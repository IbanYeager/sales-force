// kacab_peta.js — Interactive Google Maps Field Visit Map for Kepala Cabang (Kacab Panel)

let map = null;
let currentTileLayer = null;
let googleTileLayers = {};
let markers = [];
let masterSpvList = [];
let masterSalesList = [];
let checkinList = [];
let lastLocationList = [];

async function initVisitMap() {
    const mapEl = document.getElementById('visitMap');
    if (!mapEl) return;

    // Inisialisasi peta Leaflet dengan layer Google Maps berpusat di Bandung
    map = L.map('visitMap', {
        zoomControl: false
    }).setView([-6.9175, 107.6191], 13);

    // Tambahkan zoom control posisi kanan atas
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer Google Maps
    googleTileLayers.roadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://maps.google.com" target="_blank">Google Maps</a>'
    });

    googleTileLayers.satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://maps.google.com" target="_blank">Google Maps Satellite</a>'
    });

    googleTileLayers.terrain = L.tileLayer('https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Map data &copy; <a href="https://maps.google.com" target="_blank">Google Maps Terrain</a>'
    });

    // Default layer: Google Maps Roadmap
    currentTileLayer = googleTileLayers.roadmap;
    currentTileLayer.addTo(map);

    await loadMasterAndCheckinData();
}

function switchMapLayer(layerType) {
    if (!map || !googleTileLayers[layerType]) return;

    if (currentTileLayer) {
        map.removeLayer(currentTileLayer);
    }
    currentTileLayer = googleTileLayers[layerType];
    currentTileLayer.addTo(map);

    document.querySelectorAll('.map-layer-btn').forEach(btn => btn.classList.remove('active'));
    const btnActive = document.getElementById(`btnLayer${layerType.charAt(0).toUpperCase() + layerType.slice(1)}`);
    if (btnActive) btnActive.classList.add('active');
}

async function loadMasterAndCheckinData() {
    try {
        // Ambil data Master SPV, Master Sales, dan Checkins dari API Database MySQL
        const [resSpv, resSales, resCheckins, resLastLocs] = await Promise.all([
            fetch('../api/api_spv_list.php'),
            fetch('../api/api_wiraniaga.php'),
            fetch('../api/api_checkin.php?limit=100'),
            fetch('../api/api_checkin.php?type=last_locations')
        ]);

        const jsonSpv = await resSpv.json();
        const jsonSales = await resSales.json();
        const jsonCheckins = await resCheckins.json();
        const jsonLastLocs = await resLastLocs.json();

        masterSpvList = (jsonSpv.ok && Array.isArray(jsonSpv.data)) ? jsonSpv.data : [];
        masterSalesList = (jsonSales.status === 'success' && Array.isArray(jsonSales.data)) ? jsonSales.data : [];
        checkinList = (jsonCheckins.ok && Array.isArray(jsonCheckins.data)) ? jsonCheckins.data : [];
        lastLocationList = (jsonLastLocs.ok && Array.isArray(jsonLastLocs.data)) ? jsonLastLocs.data : [];

        // Geocoding default untuk Sales yang belum pernah kirim lokasi agar tetap muncul di peta jika diinginkan
        populateSpvDropdown(masterSpvList, masterSalesList);
        applyMapFilter();

    } catch (e) {
        console.error("Gagal memuat data master & checkin:", e);
    }
}

function populateSpvDropdown(spvNames, salesList) {
    const selectSpv = document.getElementById('selectFilterSpv');
    if (!selectSpv) return;

    const spvSet = new Set();
    spvNames.forEach(s => spvSet.add(s));
    salesList.forEach(s => {
        if (s.nama_spv && s.nama_spv.trim() !== '') spvSet.add(s.nama_spv.trim());
    });

    const currentVal = selectSpv.value;
    selectSpv.innerHTML = '<option value="Semua">Semua SPV</option>' +
        Array.from(spvSet).map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    selectSpv.value = currentVal || 'Semua';
}

function applyMapFilter() {
    const selectedSpv = document.getElementById('selectFilterSpv')?.value || 'Semua';
    const selectedJenis = document.getElementById('selectFilterJenis')?.value || 'Semua';
    const searchQuery = document.getElementById('inputSearchMap')?.value?.toLowerCase()?.trim() || '';

    // Index last location per sales_id & per nama_sales
    const locBySalesId = {};
    const locByName = {};
    lastLocationList.forEach(loc => {
        locBySalesId[String(loc.sales_id)] = loc;
        locByName[loc.nama_sales.toLowerCase().trim()] = loc;
    });

    // Indeks checkins per sales_id
    const checkinBySalesId = {};
    const checkinByName = {};
    checkinList.forEach(c => {
        checkinBySalesId[String(c.sales_id)] = c;
        checkinByName[c.nama_sales.toLowerCase().trim()] = c;
    });

    // Susun daftar gabungan seluruh Sales Master + Checkins
    const displayList = [];

    // 1. Tambahkan seluruh sales murni dari sales_accounts
    masterSalesList.forEach(s => {
        const sName = s.nama_lengkap.trim();
        const sSpv = (s.nama_spv || '').trim() || 'Tanpa SPV';
        const lastLoc = locBySalesId[String(s.id)] || locByName[sName.toLowerCase()];
        const lastCheck = checkinBySalesId[String(s.id)] || checkinByName[sName.toLowerCase()];

        let lat = null, lng = null, jenis = 'Belum Check-in', lokasi = 'Belum ada lokasi terdeteksi', time = s.created_at || '';

        if (lastCheck) {
            lat = lastCheck.latitude;
            lng = lastCheck.longitude;
            jenis = lastCheck.jenis_kunjungan;
            lokasi = lastCheck.nama_lokasi;
            time = lastCheck.created_at;
        } else if (lastLoc) {
            lat = lastLoc.latitude;
            lng = lastLoc.longitude;
            jenis = lastLoc.status_aktif || 'Aplikasi Aktif (On-Duty)';
            lokasi = `Lokasi Terkini (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            time = lastLoc.updated_at;
        } else {
            // Default titik koordinat cabang Tunas Toyota Kiara Condong jika sales belum pernah kirim GPS
            lat = -6.9360 + (Math.random() * 0.01 - 0.005);
            lng = 107.6430 + (Math.random() * 0.01 - 0.005);
            lokasi = 'Tunas Toyota Kiara Condong (Belum ada GPS)';
        }

        displayList.push({
            id: s.id,
            sales_id: s.id,
            nama_sales: sName,
            nama_spv: sSpv,
            jenis_kunjungan: jenis,
            nama_lokasi: lokasi,
            latitude: lat,
            longitude: lng,
            created_at: time,
            has_gps: !!(lastCheck || lastLoc)
        });
    });

    // Filter berdasarkan kriteria UI
    const filtered = displayList.filter(item => {
        const matchSpv = (selectedSpv === 'Semua' || item.nama_spv === selectedSpv);
        const matchJenis = (selectedJenis === 'Semua' || item.jenis_kunjungan.includes(selectedJenis));
        const matchSearch = searchQuery === '' ||
            item.nama_sales.toLowerCase().includes(searchQuery) ||
            item.nama_spv.toLowerCase().includes(searchQuery) ||
            item.nama_lokasi.toLowerCase().includes(searchQuery);

        return matchSpv && matchJenis && matchSearch;
    });

    updateKpiCounters(filtered);
    renderMapMarkers(filtered);
    renderCheckinList(filtered);
}

function updateKpiCounters(dataList) {
    const cntTotal = dataList.length;
    const cntPameran = dataList.filter(i => (i.jenis_kunjungan || '').includes('Pameran')).length;
    const cntProspek = dataList.filter(i => (i.jenis_kunjungan || '').includes('Prospek')).length;
    const cntCanvassing = dataList.filter(i => (i.jenis_kunjungan || '').includes('Canvassing') || (i.jenis_kunjungan || '').includes('On-Duty') || (i.jenis_kunjungan || '').includes('Aplikasi')).length;

    document.getElementById('kpiTotalCheckin') && (document.getElementById('kpiTotalCheckin').textContent = cntTotal);
    document.getElementById('kpiPameran') && (document.getElementById('kpiPameran').textContent = cntPameran);
    document.getElementById('kpiProspek') && (document.getElementById('kpiProspek').textContent = cntProspek);
    document.getElementById('kpiCanvassing') && (document.getElementById('kpiCanvassing').textContent = cntCanvassing);
}

function renderMapMarkers(dataList) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    if (dataList.length === 0) return;

    const bounds = [];

    const createCustomIcon = (jenis, hasGps) => {
        let iconHtml = '<i class="fa-solid fa-car"></i>';
        if (jenis.includes('Pameran')) iconHtml = '<i class="fa-solid fa-store"></i>';
        if (jenis.includes('Prospek')) iconHtml = '<i class="fa-solid fa-user-check"></i>';
        if (jenis.includes('Canvassing') || jenis.includes('On-Duty') || jenis.includes('Aplikasi')) iconHtml = '<i class="fa-solid fa-mobile-screen-button"></i>';
        if (!hasGps) iconHtml = '<i class="fa-solid fa-building"></i>';

        const pinClass = hasGps ? 'gmaps-pin' : 'gmaps-pin pin-offline';

        return L.divIcon({
            className: 'gmaps-custom-marker',
            html: `<div class="${pinClass}">${iconHtml}</div>${hasGps ? '<div class="gmaps-pulse"></div>' : ''}`,
            iconSize: [36, 46],
            iconAnchor: [18, 46],
            popupAnchor: [0, -42]
        });
    };

    dataList.forEach(item => {
        if (!item.latitude || !item.longitude) return;

        const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : new Date();
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dayStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

        const googleMapsUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;

        const popupContent = `
            <div class="gmaps-popup-box">
                <div class="gpu-badge" style="${item.has_gps ? '' : 'background:#f1f5f9;color:#64748d;'}">${escapeHtml(item.jenis_kunjungan)}</div>
                <h4 class="gpu-name">${escapeHtml(item.nama_sales)}</h4>
                <p class="gpu-spv">SPV: <strong>${escapeHtml(item.nama_spv)}</strong></p>
                <div class="gpu-loc">
                    <i class="fa-solid fa-location-dot" style="${item.has_gps ? 'color:#cc1426;' : 'color:#64748d;'}"></i> ${escapeHtml(item.nama_lokasi)}
                </div>
                ${item.foto_bukti ? `<img src="${escapeHtml(item.foto_bukti)}" class="gpu-img" />` : ''}
                <div class="gpu-meta">
                    <span><i class="fa-regular fa-clock"></i> ${dayStr} - ${timeStr}</span>
                    <span>Lat: ${item.latitude.toFixed(4)}</span>
                </div>
                <a href="${googleMapsUrl}" target="_blank" class="btn-gmaps-link">
                    <span>Buka di Google Maps App</span>
                    <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </a>
            </div>
        `;

        const marker = L.marker([item.latitude, item.longitude], {
            icon: createCustomIcon(item.jenis_kunjungan, item.has_gps)
        }).addTo(map).bindPopup(popupContent);

        markers.push(marker);
        bounds.push([item.latitude, item.longitude]);
    });

    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [60, 60] });
    }
}

function renderCheckinList(dataList) {
    const listEl = document.getElementById('checkinListContainer');
    if (!listEl) return;

    if (dataList.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state" style="padding:30px 0;">
                <div class="es-icon"><i class="fa-solid fa-users-slash"></i></div>
                <div class="es-title">Tidak ada Sales ditemukan</div>
                <div class="es-text">Tidak ada data Sales Consultant pada filter ini.</div>
            </div>
        `;
        return;
    }

    listEl.innerHTML = dataList.map(item => {
        const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : new Date();
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dayStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

        return `
            <div class="map-list-item" onclick="focusMarker(${item.latitude}, ${item.longitude})">
                <div class="mli-avatar">
                    <i class="fa-solid ${item.has_gps ? 'fa-user-tie' : 'fa-building-user'}"></i>
                </div>
                <div class="mli-body">
                    <div class="mli-sales">${escapeHtml(item.nama_sales)}</div>
                    <div class="mli-spv">SPV: <strong>${escapeHtml(item.nama_spv)}</strong></div>
                    <div class="mli-type" style="${item.has_gps ? '' : 'color:var(--muted);'}">
                        <i class="fa-solid fa-circle" style="color:${item.has_gps ? '#10b981' : '#94a3b8'};font-size:8px;"></i> ${escapeHtml(item.jenis_kunjungan)}
                    </div>
                    <div class="mli-loc"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.nama_lokasi)}</div>
                </div>
                <div class="mli-right">
                    <span class="mli-time">${item.created_at ? `${dayStr}<br>${timeStr}` : 'Baru'}</span>
                    <button class="btn-focus-map" title="Fokus Lokasi di Google Maps">
                        <i class="fa-solid fa-crosshairs"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function focusMarker(lat, lng) {
    if (!map) return;
    map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
}

document.addEventListener('DOMContentLoaded', () => {
    guardKacab();
    renderKacabUser();
    initVisitMap();
});
