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

    // Pastikan peta merender ukuran kontainer dengan presisi
    setTimeout(() => {
        if (map) map.invalidateSize();
    }, 250);

    window.addEventListener('resize', () => {
        if (map) map.invalidateSize();
    });

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

// Helper: Deteksi apakah lokasi masih real-time (aktif dalam 45 menit terakhir hari ini)
function isLocationLive(dateStr) {
    if (!dateStr) return false;
    const locDate = new Date(String(dateStr).replace(/-/g, '/'));
    const now = new Date();
    const diffMs = now - locDate;
    const diffMins = Math.floor(diffMs / 60000);
    const isToday = locDate.toDateString() === now.toDateString();
    return isToday && diffMins <= 45;
}

// Helper: Hitung jarak dalam KM ke Kantor Cabang Kiara Condong (-6.9387, 107.6433)
function calcOfficeDistKm(lat, lng) {
    if (!lat || !lng) return 999;
    const dLat = (lat - (-6.9387)) * 111.32;
    const dLng = (lng - 107.6433) * 111.32 * Math.cos(lat * Math.PI / 180);
    return Math.sqrt(dLat * dLat + dLng * dLng);
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

        let lat = null, lng = null, acc = null, jenis = 'Belum Check-in', lokasi = 'Belum ada lokasi terdeteksi', time = s.created_at || '';
        let hasGps = false;

        if (lastCheck) {
            lat = lastCheck.latitude;
            lng = lastCheck.longitude;
            acc = lastCheck.accuracy ? parseFloat(lastCheck.accuracy) : null;
            jenis = lastCheck.jenis_kunjungan;
            lokasi = lastCheck.nama_lokasi;
            time = lastCheck.created_at;
            hasGps = true;
        } else if (lastLoc) {
            lat = lastLoc.latitude;
            lng = lastLoc.longitude;
            acc = lastLoc.accuracy ? parseFloat(lastLoc.accuracy) : null;
            jenis = lastLoc.status_aktif || 'On-Duty';
            lokasi = `Lokasi Lapangan (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
            time = lastLoc.updated_at;
            hasGps = true;
        } else {
            // Default titik koordinat cabang Tunas Toyota Kiara Condong jika sales belum pernah kirim GPS
            lat = -6.9360 + (Math.random() * 0.01 - 0.005);
            lng = 107.6430 + (Math.random() * 0.01 - 0.005);
            acc = null;
            lokasi = 'Tunas Toyota Kiara Condong (Belum ada GPS)';
            hasGps = false;
        }

        const isLive = hasGps && isLocationLive(time);
        const distToOffice = calcOfficeDistKm(lat, lng);
        const isAtOffice = distToOffice <= 0.45; // Radius 450 meter dari Kiara Condong

        if (isAtOffice && hasGps) {
            lokasi = 'Tunas Toyota Kiara Condong (Kantor Cabang)';
            if (jenis === 'On-Duty' || jenis.includes('Aplikasi') || jenis === 'Belum Check-in') {
                jenis = 'Di Kantor Cabang';
            }
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
            accuracy: acc,
            created_at: time,
            has_gps: hasGps,
            is_live: isLive,
            is_at_office: isAtOffice
        });
    });

    // Filter berdasarkan kriteria UI
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

let activeAccuracyCircle = null;

function showAccuracyRadius(lat, lng, accuracy) {
    if (activeAccuracyCircle && map) {
        map.removeLayer(activeAccuracyCircle);
        activeAccuracyCircle = null;
    }
    if (!map) return;
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
    }
}

function renderMapMarkers(dataList) {
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    clearAccuracyRadius();

    if (dataList.length === 0) return;

    const bounds = [];

    const createCustomIcon = (jenis, hasGps, isLive, isAtOffice) => {
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
            iconHtml = '<i class="fa-solid fa-mobile-screen-button"></i>';
        }

        if (!hasGps) {
            iconHtml = '<i class="fa-solid fa-building"></i>';
            pinClass = 'gmaps-pin pin-offline';
        } else if (!isLive && !isAtOffice) {
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
    };

    dataList.forEach(item => {
        if (!item.latitude || !item.longitude) return;

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
            statusBadgeHtml = `<div class="gpu-badge" style="background:#ecfdf5;color:#065f46;border:1px solid #a7f3d0;"><i class="fa-solid fa-circle" style="color:#10b981;font-size:7px;"></i> REAL-TIME (${diffMins} mnt lalu)</div>`;
        } else if (item.has_gps) {
            statusBadgeHtml = `<div class="gpu-badge" style="background:#f1f5f9;color:#64748d;border:1px solid #e2e8f0;"><i class="fa-solid fa-clock-rotate-left"></i> POSISI TERAKHIR (${isToday ? `${Math.floor(diffMins/60)} jam lalu` : `Kemarin, ${dayStr}`})</div>`;
        } else {
            statusBadgeHtml = `<div class="gpu-badge" style="background:#f1f5f9;color:#64748d;">BELUM CHECK-IN</div>`;
        }

        let staleWarningHtml = '';
        if (item.has_gps && !item.is_live && !item.is_at_office) {
            staleWarningHtml = `
                <div style="background:#fffbeb;border:1px solid #fef3c7;color:#92400e;border-radius:6px;padding:6px 8px;font-size:10.5px;font-weight:600;margin-bottom:8px;line-height:1.4;">
                    <i class="fa-solid fa-triangle-exclamation" style="color:#d97706;"></i> <strong>Data Riwayat (${isToday ? `${Math.floor(diffMins/60)} jam lalu` : `Kemarin, ${timeStr} WIB`})</strong><br>
                    Sales belum mengirim ping GPS terbaru hari ini. Jika sales sudah di kantor, lokasi akan berpindah saat sales membuka aplikasi.
                </div>
            `;
        }

        let accBadgeHtml = '';
        if (item.has_gps) {
            const accVal = item.accuracy ? Math.round(item.accuracy) : null;
            if (accVal !== null && accVal <= 15) {
                accBadgeHtml = `
                    <div style="background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                        <i class="fa-solid fa-satellite-dish" style="color:#059669;font-size:12px;"></i>
                        <span>Akurasi Satelit: Presisi (±${accVal}m)</span>
                    </div>
                `;
            } else if (accVal !== null && accVal <= 40) {
                accBadgeHtml = `
                    <div style="background:#eff6ff;border:1px solid #bfdbfe;color:#1e40af;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                        <i class="fa-solid fa-location-crosshairs" style="color:#2563eb;font-size:12px;"></i>
                        <span>Akurasi GPS: Baik (±${accVal}m)</span>
                    </div>
                `;
            } else if (accVal !== null) {
                accBadgeHtml = `
                    <div style="background:#fefce8;border:1px solid #fef08a;color:#854d0e;border-radius:6px;padding:4px 8px;font-size:11px;font-weight:700;display:flex;align-items:center;gap:6px;margin-bottom:8px;">
                        <i class="fa-solid fa-tower-cell" style="color:#ca8a04;font-size:12px;"></i>
                        <span>Akurasi: Sinyal Seluler / Standar (±${accVal}m)</span>
                    </div>
                `;
            }
        }

        const popupContent = `
            <div class="gmaps-popup-box">
                ${statusBadgeHtml}
                <h4 class="gpu-name">${escapeHtml(item.nama_sales)}</h4>
                <p class="gpu-spv">SPV: <strong>${escapeHtml(item.nama_spv)}</strong></p>
                <div class="gpu-loc">
                    <i class="fa-solid fa-location-dot" style="${item.is_at_office ? 'color:#2563eb;' : (item.is_live ? 'color:#cc1426;' : 'color:#64748d;')}"></i> ${escapeHtml(item.nama_lokasi)}
                </div>
                ${staleWarningHtml}
                ${accBadgeHtml}
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
            icon: createCustomIcon(item.jenis_kunjungan, item.has_gps, item.is_live, item.is_at_office)
        }).addTo(map).bindPopup(popupContent);

        marker._salesId = item.id;
        marker._accuracy = item.accuracy;

        marker.on('click', () => {
            if (item.has_gps) {
                showAccuracyRadius(item.latitude, item.longitude, item.accuracy);
            }
        });
        marker.on('popupclose', () => {
            clearAccuracyRadius();
        });

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

    // Update sales counter badge
    const counterBadge = document.getElementById('salesCounterBadge');
    if (counterBadge) {
        counterBadge.textContent = `${dataList.length} Sales`;
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

    listEl.innerHTML = dataList.map(item => {
        const date = item.created_at ? new Date(String(item.created_at).replace(/-/g, '/')) : new Date();
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dayStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();
        const diffMins = Math.floor((now - date) / 60000);

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
            liveIndicator = `<i class="fa-solid fa-circle" style="color:#cbd5e1;font-size:8px;"></i> <span style="color:#94a3b8;">Belum Check-in</span>`;
        }

        let avatarIcon = 'fa-building-user';
        if (item.is_at_office) {
            avatarIcon = 'fa-building';
        } else if (item.is_live) {
            avatarIcon = 'fa-user-tie';
        } else if (item.has_gps) {
            avatarIcon = 'fa-user-clock';
        }

        return `
            <div class="map-list-item" onclick="focusMarker(${item.latitude}, ${item.longitude}, ${item.id})">
                <div class="mli-avatar" style="${item.is_at_office ? 'background:#eff6ff;color:#2563eb;' : (item.is_live ? 'background:#ecfdf5;color:#059669;' : '')}">
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
                    <span class="mli-time">${item.created_at ? `${dayStr}<br>${timeStr}` : 'Baru'}</span>
                    <button class="btn-focus-map" title="Fokus Lokasi di Google Maps">
                        <i class="fa-solid fa-crosshairs"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function focusMarker(lat, lng, salesId) {
    if (!map) return;
    map.flyTo([lat, lng], 17, { animate: true, duration: 1.0 });
    if (salesId) {
        const targetMarker = markers.find(m => m._salesId === salesId);
        if (targetMarker) {
            setTimeout(() => {
                targetMarker.openPopup();
                if (targetMarker._accuracy) {
                    showAccuracyRadius(lat, lng, targetMarker._accuracy);
                }
            }, 350);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    guardKacab();
    renderKacabUser();
    initVisitMap();
});
