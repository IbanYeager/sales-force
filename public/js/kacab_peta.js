// kacab_peta.js — Interactive Google Maps Field Visit Map & Live Auto-Tracking for Kepala Cabang (Kacab Panel)
// Tunas Toyota Kiara Condong - Akurasi Presisi Tinggi & Auto-Tracking Real-time

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

// Muat data master awal (SPV, Sales Master, Checkins, Last Locations)
async function loadMasterAndCheckinData() {
    try {
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
        const res = await fetch('../api/api_checkin.php?type=last_locations&t=' + Date.now());
        if (res.ok) {
            const json = await res.json();
            if (json.ok && Array.isArray(json.data)) {
                lastLocationList = json.data;
                applyMapFilter(false); // false = jangan ubah zoom map saat user sedang melihat
                updateLiveStatusBadge(true);
            }
        }
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

    if (isOnline) {
        badge.innerHTML = `<span class="lt-pulse"></span> <span class="lt-text">Auto-Tracking Live</span>`;
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

// Deteksi apakah lokasi masih real-time (aktif dalam 45 menit terakhir)
function isLocationLive(dateStr) {
    if (!dateStr) return false;
    const locDate = new Date(String(dateStr).replace(/-/g, '/'));
    const now = new Date();
    const diffMs = now - locDate;
    const diffMins = Math.floor(diffMs / 60000);
    const isToday = locDate.toDateString() === now.toDateString();
    return isToday && diffMins <= 45;
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

    // Indeks lokasi terakhir per sales_id & per nama_sales
    const locBySalesId = {};
    const locByName = {};
    lastLocationList.forEach(loc => {
        locBySalesId[String(loc.sales_id)] = loc;
        locByName[loc.nama_sales.toLowerCase().trim()] = loc;
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

        let lat = null, lng = null, acc = null, jenis = 'Belum Check-in', lokasi = 'Menunggu Sinyal GPS', time = '';
        let hasGps = false;

        // Prioritaskan check-in formal hari ini jika ada, atau lokasi ping GPS real-time
        if (lastLoc && lastCheck) {
            // Bandingkan mana yang lebih baru
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
            // Sales yang belum punya GPS: JANGAN buat koordinat acak!
            lat = null;
            lng = null;
            acc = null;
            jenis = 'Belum Ada GPS';
            lokasi = 'Belum Mengaktifkan GPS';
            time = '';
            hasGps = false;
        }

        let isLive = false;
        let isAtOffice = false;
        let distToOffice = 999;

        if (hasGps && lat && lng) {
            isLive = isLocationLive(time);
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
            is_live: isLive,
            is_at_office: isAtOffice,
            dist_to_office_km: distToOffice
        });
    });

    // Filter berdasarkan SPV, Jenis Kunjungan, dan Search Query
    const filtered = displayList.filter(item => {
        const matchSpv = (selectedSpv === 'Semua' || item.nama_spv === selectedSpv);
        const matchJenis = (selectedJenis === 'Semua' || item.jenis_kunjungan.includes(selectedJenis) || (selectedJenis === 'Kantor' && item.is_at_office));
        const matchSearch = searchQuery === '' ||
            item.nama_sales.toLowerCase().includes(searchQuery) ||
            item.nama_spv.toLowerCase().includes(searchQuery) ||
            item.nama_lokasi.toLowerCase().includes(searchQuery);

        return matchSpv && matchJenis && matchSearch;
    });

    updateKpiCounters(filtered);
    renderMapMarkers(filtered, shouldFitBounds);
    renderCheckinList(filtered);
}

function updateKpiCounters(dataList) {
    const withGpsList = dataList.filter(i => i.has_gps);
    const cntTotal = withGpsList.length;
    const cntPameran = withGpsList.filter(i => (i.jenis_kunjungan || '').includes('Pameran')).length;
    const cntProspek = withGpsList.filter(i => (i.jenis_kunjungan || '').includes('Prospek')).length;
    const cntCanvassing = withGpsList.filter(i => (i.jenis_kunjungan || '').includes('Canvassing') || (i.jenis_kunjungan || '').includes('On-Duty') || (i.jenis_kunjungan || '').includes('Aplikasi')).length;

    document.getElementById('kpiTotalCheckin') && (document.getElementById('kpiTotalCheckin').textContent = cntTotal);
    document.getElementById('kpiPameran') && (document.getElementById('kpiPameran').textContent = cntPameran);
    document.getElementById('kpiProspek') && (document.getElementById('kpiProspek').textContent = cntProspek);
    document.getElementById('kpiCanvassing') && (document.getElementById('kpiCanvassing').textContent = cntCanvassing);
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

    const hasPulse = isLive && !isAtOffice;

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
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const diffMins = Math.floor((now - date) / 60000);

    const googleMapsUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;

    let statusBadgeHtml = '';
    if (item.is_at_office) {
        statusBadgeHtml = `<div class="gpu-badge" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;"><i class="fa-solid fa-building"></i> DI KANTOR CABANG</div>`;
    } else if (item.is_live) {
        statusBadgeHtml = `<div class="gpu-badge" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;"><i class="fa-solid fa-circle" style="color:#10b981;font-size:7px;"></i> LIVE REAL-TIME (${diffMins} mnt lalu)</div>`;
    } else {
        statusBadgeHtml = `<div class="gpu-badge" style="background:#f1f5f9;color:#64748d;border:1px solid #e2e8f0;"><i class="fa-solid fa-clock-rotate-left"></i> POSISI TERAKHIR (${isToday ? `${Math.floor(diffMins/60)} jam lalu` : `Kemarin, ${dayStr}`})</div>`;
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
                <i class="fa-solid fa-location-dot" style="${item.is_at_office ? 'color:#2563eb;' : (item.is_live ? 'color:#cc1426;' : 'color:#64748d;')}"></i> ${escapeHtml(item.nama_lokasi)}
            </div>
            ${accBadgeHtml}
            <div class="gpu-meta">
                <span><i class="fa-regular fa-clock"></i> ${dayStr} - ${timeStr} WIB</span>
                <span>Lat: ${item.latitude.toFixed(4)}, ${item.longitude.toFixed(4)}</span>
            </div>
            <a href="${googleMapsUrl}" target="_blank" class="btn-gmaps-link">
                <span>Buka di Google Maps App</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
        </div>
    `;
}

// Render marker Leaflet secara dinamis (Hanya untuk Sales yang memiliki GPS valid!)
function renderMapMarkers(dataList, shouldFitBounds = false) {
    if (!map) return;

    // Filter HANYA data yang memiliki GPS nyata (tidak ada marker acak/palsu!)
    const validGpsList = dataList.filter(item => item.has_gps && item.latitude && item.longitude);
    const activeSalesIds = new Set(validGpsList.map(i => i.sales_id));
    const bounds = [[OFFICE_LAT, OFFICE_LNG]]; // Selalu masukkan kantor cabang

    // Hapus marker yang sudah tidak ada di data GPS valid atau kena filter
    Object.keys(markersMap).forEach(salesId => {
        if (!activeSalesIds.has(salesId)) {
            map.removeLayer(markersMap[salesId]);
            delete markersMap[salesId];
        }
    });

    // Update atau buat marker baru
    validGpsList.forEach(item => {
        const newLatLng = [item.latitude, item.longitude];
        bounds.push(newLatLng);

        const newIcon = createCustomIcon(item.jenis_kunjungan, item.has_gps, item.is_live, item.is_at_office);
        const popupContent = buildPopupHtml(item);

        if (markersMap[item.sales_id]) {
            const existingMarker = markersMap[item.sales_id];
            const oldPos = existingMarker.getLatLng();

            // Smooth update posisi jika koordinat bergeser
            if (Math.abs(oldPos.lat - item.latitude) > 0.000005 || Math.abs(oldPos.lng - item.longitude) > 0.000005) {
                existingMarker.setLatLng(newLatLng);

                // Update juga lingkaran akurasi jika sedang fokus pada sales ini
                if (activeAccuracySalesId === item.sales_id && activeAccuracyCircle) {
                    activeAccuracyCircle.setLatLng(newLatLng);
                }
            }

            // Update icon jika status live / office berubah
            existingMarker.setIcon(newIcon);

            // Update popup content tanpa menutup popup jika sedang terbuka
            const popup = existingMarker.getPopup();
            if (popup) {
                popup.setContent(popupContent);
            }
        } else {
            // Marker baru ditemukan
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

    // Fit bounds hanya saat load pertama atau jika eksplisit diminta
    if (shouldFitBounds && bounds.length > 1 && !hasInitialBoundsFitted) {
        hasInitialBoundsFitted = true;
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
}

// Render daftar seluruh Sales di sidebar kanan
function renderCheckinList(dataList) {
    const listEl = document.getElementById('checkinListContainer');
    if (!listEl) return;

    // Pisahkan: Sales yang aktif GPS vs Sales yang belum kirim GPS
    const withGps = dataList.filter(i => i.has_gps);
    const withoutGps = dataList.filter(i => !i.has_gps);
    const sortedList = [...withGps, ...withoutGps];

    const counterBadge = document.getElementById('salesCounterBadge');
    if (counterBadge) {
        counterBadge.textContent = `${withGps.length} Terdeteksi / ${dataList.length} Total`;
    }

    if (dataList.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state" style="padding:36px 12px; text-align:center;">
                <div class="es-icon" style="font-size:32px; color:#cbd5e1; margin-bottom:8px;"><i class="fa-solid fa-users-slash"></i></div>
                <div class="es-title" style="font-size:13px; font-weight:800; color:#1e1014; margin-bottom:4px;">Tidak ada Sales ditemukan</div>
                <div class="es-text" style="font-size:11px; color:#94a3b8;">Coba sesuaikan kata kunci pencarian atau filter SPV.</div>
            </div>
        `;
        return;
    }

    listEl.innerHTML = sortedList.map(item => {
        const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : null;
        const timeStr = date ? date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '';
        const dayStr = date ? date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '';
        const now = new Date();
        const isToday = date ? date.toDateString() === now.toDateString() : false;
        const diffMins = date ? Math.floor((now - date) / 60000) : 999;

        let accPill = '';
        if (item.has_gps && item.accuracy) {
            const accVal = Math.round(item.accuracy);
            const isUltra = accVal <= 15;
            accPill = `<span style="font-size:9.5px;font-weight:700;color:${isUltra ? '#059669' : '#2563eb'};background:${isUltra ? '#ecfdf5' : '#eff6ff'};border:1px solid ${isUltra ? '#a7f3d0' : '#bfdbfe'};padding:1px 5px;border-radius:4px;margin-left:5px;display:inline-flex;align-items:center;gap:3px;" title="Radius Akurasi GPS Satelit"><i class="fa-solid fa-satellite-dish"></i> ±${accVal}m</span>`;
        }

        let liveIndicator = '';
        if (item.is_at_office) {
            liveIndicator = `<i class="fa-solid fa-building" style="color:#2563eb;font-size:10px;"></i> <span style="color:#1d4ed8;font-weight:700;">Di Kantor Cabang</span>`;
        } else if (item.is_live) {
            liveIndicator = `<i class="fa-solid fa-circle" style="color:#10b981;font-size:8px;"></i> <span style="color:#059669;font-weight:700;">Live Real-Time (${diffMins}m lalu)</span>`;
        } else if (item.has_gps) {
            liveIndicator = `<i class="fa-solid fa-clock-rotate-left" style="color:#94a3b8;font-size:9px;"></i> <span style="color:#64748d;">Offline (${isToday ? `${Math.floor(diffMins/60)}j lalu` : `Kemarin ${timeStr}`}</span>`;
        } else {
            liveIndicator = `<i class="fa-solid fa-satellite-dish" style="color:#cbd5e1;font-size:9px;"></i> <span style="color:#94a3b8;">Menunggu Sinyal GPS</span>`;
        }

        let avatarIcon = 'fa-user-tie';
        if (item.is_at_office) {
            avatarIcon = 'fa-building';
        } else if (item.is_live) {
            avatarIcon = 'fa-person-walking';
        } else if (!item.has_gps) {
            avatarIcon = 'fa-user-clock';
        }

        const clickHandler = item.has_gps ? 
            `focusMarker(${item.latitude}, ${item.longitude}, '${item.sales_id}')` : 
            `notifyNoGps('${escapeHtml(item.nama_sales)}')`;

        return `
            <div class="map-list-item" onclick="${clickHandler}" style="${!item.has_gps ? 'opacity: 0.72;' : ''}">
                <div class="mli-avatar" style="${item.is_at_office ? 'background:#eff6ff;color:#2563eb;' : (item.is_live ? 'background:#ecfdf5;color:#059669;' : (!item.has_gps ? 'background:#f1f5f9;color:#94a3b8;' : ''))}">
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
                    <span class="mli-time">${item.created_at ? `${dayStr}<br>${timeStr}` : 'Belum Ada<br>Data GPS'}</span>
                    <button class="btn-focus-map" title="${item.has_gps ? 'Fokus ke Titik GPS' : 'GPS Belum Aktif'}" style="${!item.has_gps ? 'opacity:0.4;cursor:default;' : ''}">
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
            text: `Sales "${salesName}" belum mengaktifkan izin GPS atau belum masuk ke aplikasi hari ini. Lokasi akan otomatis muncul saat sales membuka akunnya.`,
            confirmButtonColor: '#1e1014'
        });
    } else {
        alert(`Sales "${salesName}" belum mengaktifkan izin GPS pada perangkatnya.`);
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
