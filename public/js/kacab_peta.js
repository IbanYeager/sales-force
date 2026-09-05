// kacab_peta.js — Interactive Google Maps Field Visit Map & Live Auto-Tracking for Kepala Cabang (Kacab Panel)
// Tunas Toyota Kiara Condong - Akurasi Presisi Tinggi & Auto-Tracking Real-Time Sales Online

const OFFICE_LAT = -6.944425;
const OFFICE_LNG = 107.642250;
const OFFICE_NAME = 'Tunas Toyota Kiara Condong';
const OFFICE_GEOFENCE_KM = 0.45; // 450 meter radius kantor cabang

let map = null;
let currentTileLayer = null;
let googleTileLayers = {};
let officeMarker = null;

// Persistent marker map: { [sales_id]: L.Marker }
let markersMap = {};
let activeAccuracyCircle = null;
let activeAccuracySalesId = null;

let masterSpvList = [];
let masterSalesList = [];
let checkinList = [];
let lastLocationList = [];
let heartbeatSalesList = [];

let currentStatusFilter = 'online'; // Default: 'online' (Hanya tracking sales yang sedang online!)
let liveTrackingTimer = null;
let isSyncing = false;
let hasInitialBoundsFitted = false;

// Helper: Escape string untuk HTML
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Inisialisasi Peta Leaflet dengan Layer Google Maps
async function initVisitMap() {
    const mapEl = document.getElementById('visitMap');
    if (!mapEl) return;

    // Set view awal berpusat di Kantor Tunas Toyota Kiara Condong
    map = L.map('visitMap', {
        zoomControl: false
    }).setView([OFFICE_LAT, OFFICE_LNG], 14);

    // Zoom control di kanan atas
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Layer Google Maps Roadmap, Satellite, Terrain
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

    currentTileLayer = googleTileLayers.roadmap;
    currentTileLayer.addTo(map);

    // Tambahkan Marker Permanen Kantor Cabang Tunas Toyota Kiara Condong
    addOfficeMarker();

    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 250);

    window.addEventListener('resize', () => {
        if (map) map.invalidateSize();
    });

    // Muat data master awal
    await loadMasterAndCheckinData();

    // Mulai Auto-Tracking Live Polling (tiap 3.5 detik)
    if (liveTrackingTimer) clearInterval(liveTrackingTimer);
    liveTrackingTimer = setInterval(syncLiveTracking, 3500);
}

// Marker Permanen Kantor Cabang Tunas Toyota Kiara Condong
function addOfficeMarker() {
    if (!map) return;

    const officeIcon = L.divIcon({
        className: 'gmaps-custom-marker',
        html: `
            <div class="gmaps-pin pin-dealership-hq">
                <i class="fa-solid fa-building-flag"></i>
            </div>
            <div class="gmaps-pulse pulse-hq"></div>
        `,
        iconSize: [40, 52],
        iconAnchor: [20, 52],
        popupAnchor: [0, -48]
    });

    officeMarker = L.marker([OFFICE_LAT, OFFICE_LNG], {
        icon: officeIcon,
        zIndexOffset: 1000
    }).addTo(map);

    const officePopupContent = `
        <div class="gmaps-popup-box">
            <div class="gpu-badge" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;">
                <i class="fa-solid fa-star"></i> KANTOR CABANG UTAMA
            </div>
            <h4 class="gpu-name" style="color:#cc1426;">Tunas Toyota Kiara Condong</h4>
            <p class="gpu-spv">Jl. Ibrahim Adjie No. 154, Kiara Condong, Bandung</p>
            <div class="gpu-loc" style="margin-top:6px;">
                <i class="fa-solid fa-location-crosshairs" style="color:#059669;"></i> Titik Geofence Presensi (Radius 450m)
            </div>
            <div style="font-size:10.5px;color:#64748b;margin-top:6px;border-top:1px solid #f1f5f9;padding-top:6px;">
                <i class="fa-solid fa-circle-info"></i> Sales dalam radius 450m otomatis berstatus "Di Kantor Cabang".
            </div>
        </div>
    `;

    officeMarker.bindPopup(officePopupContent);
}

function recenterToOffice() {
    if (!map) return;
    map.flyTo([OFFICE_LAT, OFFICE_LNG], 16, { animate: true, duration: 1.0 });
    if (officeMarker) {
        setTimeout(() => officeMarker.openPopup(), 400);
    }
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

// Toggle filter status: 'online' (hanya yang online) vs 'all' (semua sales)
function setStatusFilter(status) {
    currentStatusFilter = status;

    const btnOnline = document.getElementById('btnFilterOnlineOnly');
    const btnAll = document.getElementById('btnFilterAllStatus');

    if (status === 'online') {
        btnOnline?.classList.add('active');
        btnAll?.classList.remove('active');
    } else {
        btnAll?.classList.add('active');
        btnOnline?.classList.remove('active');
    }

    applyMapFilter(false);
}

// Muat data master awal (SPV, Sales Master, Checkins, Last Locations, Heartbeat Online)
async function loadMasterAndCheckinData() {
    try {
        const [resSpv, resSales, resCheckins, resLastLocs, resHeartbeat] = await Promise.all([
            fetch('../api/api_spv_list.php'),
            fetch('../api/api_wiraniaga.php'),
            fetch('../api/api_checkin.php?limit=100'),
            fetch('../api/api_checkin.php?type=last_locations&t=' + Date.now()),
            fetch('../api/api_heartbeat.php?t=' + Date.now())
        ]);

        const jsonSpv = await resSpv.json();
        const jsonSales = await resSales.json();
        const jsonCheckins = await resCheckins.json();
        const jsonLastLocs = await resLastLocs.json();
        const jsonHeartbeat = await resHeartbeat.json();

        masterSpvList = (jsonSpv.ok && Array.isArray(jsonSpv.data)) ? jsonSpv.data : [];
        masterSalesList = (jsonSales.status === 'success' && Array.isArray(jsonSales.data)) ? jsonSales.data : [];
        checkinList = (jsonCheckins.ok && Array.isArray(jsonCheckins.data)) ? jsonCheckins.data : [];
        lastLocationList = (jsonLastLocs.ok && Array.isArray(jsonLastLocs.data)) ? jsonLastLocs.data : [];
        heartbeatSalesList = (jsonHeartbeat && jsonHeartbeat.sales && Array.isArray(jsonHeartbeat.sales.data)) ? jsonHeartbeat.sales.data : [];

        populateSpvDropdown(masterSpvList, masterSalesList);
        applyMapFilter(true); // true = fit bounds pertama kali

    } catch (e) {
        console.error("Gagal memuat data master & checkin:", e);
    }
}

// Polling sinkronisasi live tracking setiap 3.5 detik
async function syncLiveTracking() {
    if (isSyncing) return;
    isSyncing = true;

    try {
        const [resLastLocs, resHeartbeat] = await Promise.all([
            fetch('../api/api_checkin.php?type=last_locations&t=' + Date.now()),
            fetch('../api/api_heartbeat.php?t=' + Date.now())
        ]);

        if (resLastLocs.ok) {
            const jsonLast = await resLastLocs.json();
            if (jsonLast.ok && Array.isArray(jsonLast.data)) {
                lastLocationList = jsonLast.data;
            }
        }

        if (resHeartbeat.ok) {
            const jsonHeart = await resHeartbeat.json();
            if (jsonHeart && jsonHeart.sales && Array.isArray(jsonHeart.sales.data)) {
                heartbeatSalesList = jsonHeart.sales.data;
            }
        }

        applyMapFilter(false); // false = jangan ubah zoom map saat user sedang melihat
        updateLiveStatusBadge(true);

    } catch (e) {
        console.warn("[Live Auto-Tracking] Gagal polling:", e);
        updateLiveStatusBadge(false);
    } finally {
        isSyncing = false;
    }
}

function updateLiveStatusBadge(isOnline) {
    const badge = document.getElementById('liveTrackerIndicator');
    if (!badge) return;

    const countOnline = heartbeatSalesList.filter(s => s.is_online).length;

    if (isOnline) {
        badge.innerHTML = `<span class="lt-pulse"></span> <span class="lt-text">${countOnline} Sales Online (Live)</span>`;
        badge.style.color = '#15803d';
        badge.style.background = '#f0fdf4';
        badge.style.borderColor = '#bbf7d0';
    } else {
        badge.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#f59e0b;display:inline-block;"></span> <span class="lt-text">Menyambung...</span>`;
        badge.style.color = '#b45309';
        badge.style.background = '#fffbeb';
        badge.style.borderColor = '#fef3c7';
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

// Deteksi apakah lokasi masih real-time (aktif dalam 3 menit terakhir)
function isLocationLive(dateStr) {
    if (!dateStr) return false;
    const locDate = new Date(String(dateStr).replace(/-/g, '/'));
    const now = new Date();
    const diffMs = now - locDate;
    const diffMins = Math.floor(diffMs / 60000);
    const isToday = locDate.toDateString() === now.toDateString();
    return isToday && diffMins <= 3;
}

// Hitung jarak dalam KM ke Kantor Cabang Kiara Condong
function calcOfficeDistKm(lat, lng) {
    if (!lat || !lng) return 999;
    const dLat = (lat - OFFICE_LAT) * 111.32;
    const dLng = (lng - OFFICE_LNG) * 111.32 * Math.cos(lat * Math.PI / 180);
    return Math.sqrt(dLat * dLat + dLng * dLng);
}

// Filter dan susun data gabungan
function applyMapFilter(shouldFitBounds = false) {
    const selectedSpv = document.getElementById('selectFilterSpv')?.value || 'Semua';
    const selectedJenis = document.getElementById('selectFilterJenis')?.value || 'Semua';
    const searchQuery = document.getElementById('inputSearchMap')?.value?.toLowerCase()?.trim() || '';

    // Indeks status online dari tabel heartbeat (presence)
    const onlineSalesIds = new Set();
    const onlineSalesNames = new Set();
    heartbeatSalesList.forEach(s => {
        if (s.is_online) {
            onlineSalesIds.add(String(s.id));
            onlineSalesNames.add(s.nama_lengkap.toLowerCase().trim());
        }
    });

    // Indeks lokasi terakhir per sales_id & per nama_sales
    const locBySalesId = {};
    const locByName = {};
    lastLocationList.forEach(loc => {
        locBySalesId[String(loc.sales_id)] = loc;
        locByName[loc.nama_sales.toLowerCase().trim()] = loc;

        // Jika ada update lokasi dalam 3 menit terakhir, tandai online
        if (loc.is_online || isLocationLive(loc.updated_at)) {
            onlineSalesIds.add(String(loc.sales_id));
            onlineSalesNames.add(loc.nama_sales.toLowerCase().trim());
        }
    });

    // Indeks checkin per sales_id & per nama_sales
    const checkinBySalesId = {};
    const checkinByName = {};
    checkinList.forEach(c => {
        checkinBySalesId[String(c.sales_id)] = c;
        checkinByName[c.nama_sales.toLowerCase().trim()] = c;
    });

    const displayList = [];

    masterSalesList.forEach(s => {
        const sName = s.nama_lengkap.trim();
        const sSpv = (s.nama_spv || '').trim() || 'Tanpa SPV';
        const lastLoc = locBySalesId[String(s.id)] || locByName[sName.toLowerCase()];
        const lastCheck = checkinBySalesId[String(s.id)] || checkinByName[sName.toLowerCase()];

        // Periksa apakah sales ini sedang ONLINE di website
        const isOnline = onlineSalesIds.has(String(s.id)) || onlineSalesNames.has(sName.toLowerCase());

        let lat = null, lng = null, acc = null, jenis = 'Belum Check-in', lokasi = 'Menunggu Sinyal GPS', time = '';
        let hasGps = false;

        // Ambil lokasi terbaru
        if (lastLoc && lastCheck) {
            const timeLoc = new Date(String(lastLoc.updated_at).replace(/-/g, '/')).getTime();
            const timeCheck = new Date(String(lastCheck.created_at).replace(/-/g, '/')).getTime();

            if (timeLoc >= timeCheck) {
                lat = parseFloat(lastLoc.latitude);
                lng = parseFloat(lastLoc.longitude);
                acc = lastLoc.accuracy ? parseFloat(lastLoc.accuracy) : 10;
                jenis = lastLoc.status_aktif || 'On-Duty';
                lokasi = `Lokasi Lapangan (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                time = lastLoc.updated_at;
                hasGps = true;
            } else {
                lat = parseFloat(lastCheck.latitude);
                lng = parseFloat(lastCheck.longitude);
                acc = lastCheck.accuracy ? parseFloat(lastCheck.accuracy) : 10;
                jenis = lastCheck.jenis_kunjungan;
                lokasi = lastCheck.nama_lokasi;
                time = lastCheck.created_at;
                hasGps = true;
            }
        } else if (lastLoc) {
            lat = parseFloat(lastLoc.latitude);
            lng = parseFloat(lastLoc.longitude);
            acc = lastLoc.accuracy ? parseFloat(lastLoc.accuracy) : 10;
            jenis = lastLoc.status_aktif || 'On-Duty';
            lokasi = (jenis === 'Di Kantor Cabang') ? 'Tunas Toyota Kiara Condong (Kantor Cabang)' : `Lokasi Lapangan (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            time = lastLoc.updated_at;
            hasGps = true;
        } else if (lastCheck) {
            lat = parseFloat(lastCheck.latitude);
            lng = parseFloat(lastCheck.longitude);
            acc = lastCheck.accuracy ? parseFloat(lastCheck.accuracy) : 10;
            jenis = lastCheck.jenis_kunjungan;
            lokasi = lastCheck.nama_lokasi;
            time = lastCheck.created_at;
            hasGps = true;
        } else {
            lat = null;
            lng = null;
            acc = null;
            jenis = 'Belum Ada GPS';
            lokasi = 'Belum Mengaktifkan GPS';
            time = '';
            hasGps = false;
        }

        let isLive = isOnline;
        let isAtOffice = false;
        let distToOffice = 999;

        if (hasGps && lat && lng) {
            distToOffice = calcOfficeDistKm(lat, lng);
            isAtOffice = distToOffice <= OFFICE_GEOFENCE_KM;

            if (isAtOffice) {
                lokasi = 'Tunas Toyota Kiara Condong (Kantor Cabang)';
                if (jenis === 'On-Duty' || jenis === 'Belum Check-in' || jenis.includes('Aplikasi')) {
                    jenis = 'Di Kantor Cabang';
                }
            }
        }

        displayList.push({
            id: s.id,
            sales_id: String(s.id),
            nama_sales: sName,
            nama_spv: sSpv,
            jenis_kunjungan: jenis,
            nama_lokasi: lokasi,
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            created_at: time,
            has_gps: hasGps,
            is_online: isOnline,
            is_live: isLive,
            is_at_office: isAtOffice,
            dist_to_office_km: distToOffice
        });
    });

    // FILTER UTAMA: Jika mode 'online' (DEFAULT), HANYA sales yang sedang ONLINE yang lolos!
    const filtered = displayList.filter(item => {
        if (currentStatusFilter === 'online' && !item.is_online) {
            return false; // Yang offline langsung disaring keluar!
        }

        const matchSpv = (selectedSpv === 'Semua' || item.nama_spv === selectedSpv);
        const matchJenis = (selectedJenis === 'Semua' || item.jenis_kunjungan.includes(selectedJenis) || (selectedJenis === 'Kantor' && item.is_at_office));
        const matchSearch = searchQuery === '' ||
            item.nama_sales.toLowerCase().includes(searchQuery) ||
            item.nama_spv.toLowerCase().includes(searchQuery) ||
            item.nama_lokasi.toLowerCase().includes(searchQuery);

        return matchSpv && matchJenis && matchSearch;
    });

    updateKpiCounters(filtered, displayList);
    renderMapMarkers(filtered, shouldFitBounds);
    renderCheckinList(filtered);
}

function updateKpiCounters(filteredList, fullList) {
    const onlineSales = fullList.filter(i => i.is_online);
    const cntOnline = onlineSales.length;

    // Hitung berdasarkan sales yang sedang ditampilkan
    const targetList = (currentStatusFilter === 'online') ? onlineSales : filteredList;
    const cntKantor = targetList.filter(i => i.is_at_office).length;
    const cntCanvassing = targetList.filter(i => !i.is_at_office && (i.jenis_kunjungan.includes('Canvassing') || i.jenis_kunjungan.includes('On-Duty') || i.jenis_kunjungan.includes('Aplikasi'))).length;
    const cntProspek = targetList.filter(i => i.jenis_kunjungan.includes('Prospek') || i.jenis_kunjungan.includes('Pameran')).length;

    document.getElementById('kpiTotalCheckin') && (document.getElementById('kpiTotalCheckin').textContent = cntOnline);
    document.getElementById('kpiKantor') && (document.getElementById('kpiKantor').textContent = cntKantor);
    document.getElementById('kpiCanvassing') && (document.getElementById('kpiCanvassing').textContent = cntCanvassing);
    document.getElementById('kpiProspek') && (document.getElementById('kpiProspek').textContent = cntProspek);
}

function showAccuracyRadius(lat, lng, accuracy, salesId) {
    if (activeAccuracyCircle && map) {
        map.removeLayer(activeAccuracyCircle);
        activeAccuracyCircle = null;
    }
    if (!map || !lat || !lng) return;

    activeAccuracySalesId = salesId;
    const radiusMeters = (accuracy && accuracy > 0) ? Math.max(accuracy, 10) : 15;
    activeAccuracyCircle = L.circle([lat, lng], {
        radius: radiusMeters,
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.18,
        weight: 1.5,
        dashArray: '4, 4'
    }).addTo(map);
}

function clearAccuracyRadius() {
    if (activeAccuracyCircle && map) {
        map.removeLayer(activeAccuracyCircle);
        activeAccuracyCircle = null;
        activeAccuracySalesId = null;
    }
}

// Helper: Custom Marker Pin Leaflet
function createCustomIcon(jenis, hasGps, isLive, isAtOffice) {
    let iconHtml = '<i class="fa-solid fa-car"></i>';
    let pinClass = 'gmaps-pin';

    if (isAtOffice) {
        iconHtml = '<i class="fa-solid fa-building"></i>';
        pinClass = 'gmaps-pin pin-office';
    } else if (jenis.includes('Pameran')) {
        iconHtml = '<i class="fa-solid fa-store"></i>';
    } else if (jenis.includes('Prospek')) {
        iconHtml = '<i class="fa-solid fa-user-check"></i>';
    } else if (jenis.includes('Canvassing') || jenis.includes('On-Duty') || jenis.includes('Aplikasi')) {
        iconHtml = '<i class="fa-solid fa-person-walking"></i>';
    }

    if (!isLive && !isAtOffice) {
        pinClass = 'gmaps-pin pin-stale';
    }

    const hasPulse = isLive; // Pulse berdenyut untuk semua sales online

    return L.divIcon({
        className: 'gmaps-custom-marker',
        html: `<div class="${pinClass}">${iconHtml}</div>${hasPulse ? '<div class="gmaps-pulse"></div>' : ''}`,
        iconSize: [36, 46],
        iconAnchor: [18, 46],
        popupAnchor: [0, -42]
    });
}

// Helper: Popup Box HTML Content
function buildPopupHtml(item) {
    const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : new Date();
    const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const dayStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });

    const googleMapsUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;

    let statusBadgeHtml = '';
    if (item.is_at_office) {
        statusBadgeHtml = `<div class="gpu-badge" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;"><i class="fa-solid fa-building"></i> DI KANTOR CABANG</div>`;
    } else {
        statusBadgeHtml = `<div class="gpu-badge" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;"><i class="fa-solid fa-circle" style="color:#10b981;font-size:7px;"></i> ONLINE SEKARANG (LIVE)</div>`;
    }

    let accBadgeHtml = '';
    const accVal = item.accuracy ? Math.round(item.accuracy) : null;
    if (accVal !== null && accVal <= 15) {
        accBadgeHtml = `
            <div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                <i class="fa-solid fa-satellite-dish" style="color:#059669;font-size:12px;"></i>
                <span>Akurasi GPS Satelit: Presisi (±${accVal}m)</span>
            </div>
        `;
    } else if (accVal !== null) {
        accBadgeHtml = `
            <div style="background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                <i class="fa-solid fa-location-crosshairs" style="color:#2563eb;font-size:12px;"></i>
                <span>Akurasi GPS: Baik (±${accVal}m)</span>
            </div>
        `;
    }

    return `
        <div class="gmaps-popup-box">
            ${statusBadgeHtml}
            <h4 class="gpu-name">${escapeHtml(item.nama_sales)}</h4>
            <p class="gpu-spv">SPV: <strong>${escapeHtml(item.nama_spv)}</strong></p>
            <div class="gpu-loc">
                <i class="fa-solid fa-location-dot" style="${item.is_at_office ? 'color:#2563eb;' : 'color:#059669;'}"></i> ${escapeHtml(item.nama_lokasi)}
            </div>
            ${accBadgeHtml}
            <div class="gpu-meta">
                <span><i class="fa-regular fa-clock"></i> Aktif: ${timeStr} WIB</span>
                <span>Lat: ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</span>
            </div>
            <a href="${googleMapsUrl}" target="_blank" class="btn-gmaps-link">
                <span>Buka di Google Maps App</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    `;
}

// Render marker Leaflet secara dinamis (Hanya untuk Sales yang LOLOS FILTER & MEMILIKI GPS!)
function renderMapMarkers(dataList, shouldFitBounds = false) {
    if (!map) return;

    // HANYA data yang memiliki GPS valid
    const validGpsList = dataList.filter(item => item.has_gps && item.latitude && item.longitude);
    const activeSalesIds = new Set(validGpsList.map(i => i.sales_id));
    const bounds = [[OFFICE_LAT, OFFICE_LNG]]; // Selalu masukkan kantor cabang

    // Hapus marker yang sales-nya sudah OFFLINE atau kena filter
    Object.keys(markersMap).forEach(salesId => {
        if (!activeSalesIds.has(salesId)) {
            map.removeLayer(markersMap[salesId]);
            delete markersMap[salesId];
        }
    });

    // Update atau buat marker baru untuk sales yang online
    validGpsList.forEach(item => {
        const newLatLng = [item.latitude, item.longitude];
        bounds.push(newLatLng);

        const newIcon = createCustomIcon(item.jenis_kunjungan, item.has_gps, item.is_live, item.is_at_office);
        const popupContent = buildPopupHtml(item);

        if (markersMap[item.sales_id]) {
            const existingMarker = markersMap[item.sales_id];
            const oldPos = existingMarker.getLatLng();

            // Smooth gliding pergerakan posisi
            if (Math.abs(oldPos.lat - item.latitude) > 0.000005 || Math.abs(oldPos.lng - item.longitude) > 0.000005) {
                existingMarker.setLatLng(newLatLng);

                if (activeAccuracySalesId === item.sales_id && activeAccuracyCircle) {
                    activeAccuracyCircle.setLatLng(newLatLng);
                }
            }

            existingMarker.setIcon(newIcon);

            const popup = existingMarker.getPopup();
            if (popup) {
                popup.setContent(popupContent);
            }
        } else {
            // Marker baru online
            const marker = L.marker(newLatLng, {
                icon: newIcon
            }).addTo(map);

            marker.bindPopup(popupContent);
            marker._salesId = item.sales_id;
            marker._accuracy = item.accuracy;

            marker.on('click', () => {
                showAccuracyRadius(item.latitude, item.longitude, item.accuracy, item.sales_id);
            });
            marker.on('popupclose', () => {
                if (activeAccuracySalesId === item.sales_id) {
                    clearAccuracyRadius();
                }
            });

            markersMap[item.sales_id] = marker;
        }
    });

    // Fit bounds hanya saat load pertama atau jika ada perubahan titik signifikan
    if (shouldFitBounds && bounds.length > 1 && !hasInitialBoundsFitted) {
        hasInitialBoundsFitted = true;
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
}

// Render daftar Sales di sidebar kanan
function renderCheckinList(dataList) {
    const listEl = document.getElementById('checkinListContainer');
    if (!listEl) return;

    const counterBadge = document.getElementById('salesCounterBadge');
    if (counterBadge) {
        if (currentStatusFilter === 'online') {
            counterBadge.textContent = `${dataList.length} Sales Online`;
        } else {
            counterBadge.textContent = `${dataList.length} Total Sales`;
        }
    }

    // Jika tidak ada sales yang sedang online
    if (dataList.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state" style="padding: 40px 16px; text-align: center;">
                <div class="es-icon" style="font-size: 38px; color: #10b981; margin-bottom: 12px;">
                    <i class="fa-solid fa-satellite-dish fa-fade"></i>
                </div>
                <div class="es-title" style="font-size: 14px; font-weight: 800; color: #1e1014; margin-bottom: 6px;">
                    Tidak Ada Sales yang Sedang Online
                </div>
                <div class="es-text" style="font-size: 11.5px; color: #64748b; line-height: 1.5;">
                    Saat ini belum ada Sales Consultant yang aktif membuka website atau aplikasi.<br><br>
                    Begitu sales login ke akunnya, lokasi GPS mereka akan <strong>otomatis terlacak secara live</strong> di sini.
                </div>
            </div>
        `;
        return;
    }

    listEl.innerHTML = dataList.map(item => {
        const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : null;
        const timeStr = date ? date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';

        let accPill = '';
        if (item.has_gps && item.accuracy) {
            const accVal = Math.round(item.accuracy);
            const isUltra = accVal <= 15;
            accPill = `<span style="font-size:9.5px;font-weight:700;color:${isUltra ? '#059669' : '#2563eb'};background:${isUltra ? '#ecfdf5' : '#eff6ff'};border:1px solid ${isUltra ? '#a7f3d0' : '#bfdbfe'};padding:1px 5px;border-radius:4px;margin-left:5px;display:inline-flex;align-items:center;gap:3px;" title="Radius Akurasi GPS Satelit"><i class="fa-solid fa-satellite-dish"></i> ±${accVal}m</span>`;
        }

        let liveIndicator = '';
        if (item.is_at_office) {
            liveIndicator = `<i class="fa-solid fa-building" style="color:#2563eb;font-size:10px;"></i> <span style="color:#1d4ed8;font-weight:800;">Di Kantor Cabang</span> • <span style="color:#059669;font-weight:700;"><i class="fa-solid fa-circle" style="color:#10b981;font-size:7px;"></i> Online</span>`;
        } else if (item.is_online) {
            liveIndicator = `<i class="fa-solid fa-circle" style="color:#10b981;font-size:8px;"></i> <span style="color:#059669;font-weight:800;">Online Sekarang (Live)</span>`;
        } else {
            liveIndicator = `<i class="fa-solid fa-clock-rotate-left" style="color:#94a3b8;font-size:9px;"></i> <span style="color:#64748d;">Offline</span>`;
        }

        let avatarIcon = 'fa-user-tie';
        if (item.is_at_office) {
            avatarIcon = 'fa-building';
        } else if (item.is_online) {
            avatarIcon = 'fa-person-walking';
        }

        const clickHandler = item.has_gps ? 
            `focusMarker(${item.latitude}, ${item.longitude}, '${item.sales_id}')` : 
            `notifyNoGps('${escapeHtml(item.nama_sales)}')`;

        return `
            <div class="map-list-item" onclick="${clickHandler}">
                <div class="mli-avatar" style="${item.is_at_office ? 'background:#eff6ff;color:#2563eb;' : 'background:#ecfdf5;color:#059669;'}">
                    <i class="fa-solid ${avatarIcon}"></i>
                </div>
                <div class="mli-body">
                    <div class="mli-sales" title="${escapeHtml(item.nama_sales)}">
                        <span>${escapeHtml(item.nama_sales)}</span>
                        ${accPill}
                    </div>
                    <div class="mli-spv" title="SPV: ${escapeHtml(item.nama_spv)}">SPV: <strong>${escapeHtml(item.nama_spv)}</strong></div>
                    <div class="mli-type">
                        ${liveIndicator}
                    </div>
                    <div class="mli-loc" title="${escapeHtml(item.nama_lokasi)}"><i class="fa-solid fa-location-dot"></i> ${escapeHtml(item.nama_lokasi)}</div>
                </div>
                <div class="mli-right">
                    <span class="mli-time">${timeStr ? `${timeStr} WIB` : 'Live'}</span>
                    <button class="btn-focus-map" title="${item.has_gps ? 'Fokus ke Titik GPS' : 'GPS Belum Aktif'}">
                        <i class="fa-solid ${item.has_gps ? 'fa-crosshairs' : 'fa-location-slash'}"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function notifyNoGps(salesName) {
    if (window.Swal) {
        Swal.fire({
            icon: 'info',
            title: 'Sinyal GPS Belum Tersedia',
            text: `Sales "${salesName}" sedang online tetapi belum mengaktifkan izin GPS pada perangkatnya.`,
            confirmButtonColor: '#1e1014'
        });
    } else {
        alert(`Sales "${salesName}" sedang online tetapi belum mengaktifkan izin GPS pada perangkatnya.`);
    }
}

function focusMarker(lat, lng, salesId) {
    if (!map || !lat || !lng) return;
    map.flyTo([lat, lng], 17, { animate: true, duration: 1.0 });
    if (salesId && markersMap[salesId]) {
        setTimeout(() => {
            markersMap[salesId].openPopup();
            if (markersMap[salesId]._accuracy) {
                showAccuracyRadius(lat, lng, markersMap[salesId]._accuracy, salesId);
            }
        }, 400);
    }
}

// Inisialisasi awal
document.addEventListener('DOMContentLoaded', () => {
    guardKacab();
    renderKacabUser();
    initVisitMap();
});
