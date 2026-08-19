// checkin.js — Handler Check-in Kunjungan Lapangan Sales Consultant Tunas Toyota

let currentCoords = { lat: null, lng: null, accuracy: null };
let mapInstance = null;
let markerInstance = null;
let accuracyCircle = null;
let selectedPhotoFile = null;

// ==========================================
// 1. REAL-TIME CLOCK
// ==========================================
function startLiveClock() {
    const clockEl = document.getElementById('liveClock');
    function tick() {
        if (clockEl) {
            const now = new Date();
            clockEl.textContent = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
        }
    }
    tick();
    setInterval(tick, 1000);
}

// ==========================================
// 2. LEAFLET MINI-MAP SETUP
// ==========================================
function initLeafletMap(lat, lng) {
    const mapEl = document.getElementById('checkinMap');
    if (!mapEl || typeof L === 'undefined') return;

    const defaultLat = lat || -6.9387;
    const defaultLng = lng || 107.6433;

    if (!mapInstance) {
        mapInstance = L.map('checkinMap', {
            center: [defaultLat, defaultLng],
            zoom: 15,
            zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OpenStreetMap'
        }).addTo(mapInstance);

        L.control.zoom({ position: 'bottomright' }).addTo(mapInstance);

        // Custom red pin marker icon
        const redIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: `<div style="background:#d7123a;width:24px;height:24px;border-radius:50%;border:3px solid #ffffff;box-shadow:0 4px 12px rgba(215,18,58,0.5);display:flex;align-items:center;justify-content:center;color:white;font-size:11px;"><i class="fa-solid fa-location-dot"></i></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });

        markerInstance = L.marker([defaultLat, defaultLng], {
            icon: redIcon,
            draggable: true
        }).addTo(mapInstance);

        markerInstance.bindPopup('<b>Titik Kunjungan Anda</b><br>Geser pin jika ingin menyesuaikan titik.').openPopup();

        markerInstance.on('dragend', function (e) {
            const newPos = e.target.getLatLng();
            updateCoordinates(newPos.lat, newPos.lng, null, false);
            reverseGeocode(newPos.lat, newPos.lng);
        });

        mapInstance.on('click', function (e) {
            if (markerInstance) {
                markerInstance.setLatLng(e.latlng);
                updateCoordinates(e.latlng.lat, e.latlng.lng, null, false);
                reverseGeocode(e.latlng.lat, e.latlng.lng);
            }
        });
    } else {
        mapInstance.setView([defaultLat, defaultLng], 15);
        if (markerInstance) {
            markerInstance.setLatLng([defaultLat, defaultLng]);
        }
    }

    setTimeout(() => {
        if (mapInstance) mapInstance.invalidateSize();
    }, 200);
}

// ==========================================
// 3. GPS DETECTION & REVERSE GEOCODING
// ==========================================
function detectLocation() {
    const statusEl = document.getElementById('geoStatus');
    const coordsEl = document.getElementById('geoCoords');
    const btnSubmit = document.getElementById('btnSubmitCheckin');
    const btnGmaps = document.getElementById('btnGmapsLink');

    if (!navigator.geolocation) {
        if (statusEl) {
            statusEl.className = 'geo-badge geo-error';
            statusEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> GPS tidak didukung browser ini';
        }
        fallbackDefaultLocation();
        return;
    }

    if (statusEl) {
        statusEl.className = 'geo-badge geo-loading';
        statusEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengunci Satelit GPS...';
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const accuracy = Math.round(position.coords.accuracy);

            updateCoordinates(lat, lng, accuracy, true);

            if (statusEl) {
                statusEl.className = 'geo-badge geo-success';
                statusEl.innerHTML = `<i class="fa-solid fa-circle-check"></i> GPS Terkunci (±${accuracy}m)`;
            }

            if (btnGmaps) {
                btnGmaps.href = `https://www.google.com/maps?q=${lat},${lng}`;
                btnGmaps.style.display = 'inline-flex';
            }

            if (btnSubmit) btnSubmit.disabled = false;

            initLeafletMap(lat, lng);
            reverseGeocode(lat, lng);
        },
        (error) => {
            console.warn("GPS detection warning:", error);
            let msg = "Gagal mengambil lokasi GPS.";
            if (error.code === error.PERMISSION_DENIED) msg = "Izin lokasi GPS belum diizinkan.";
            else if (error.code === error.POSITION_UNAVAILABLE) msg = "Sinyal GPS tidak tersedia.";
            else if (error.code === error.TIMEOUT) msg = "Waktu deteksi GPS habis.";

            if (statusEl) {
                statusEl.className = 'geo-badge geo-warn';
                statusEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${msg}`;
            }

            fallbackDefaultLocation();
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
}

function fallbackDefaultLocation() {
    const lat = -6.9387;
    const lng = 107.6433;
    updateCoordinates(lat, lng, 50, false);

    const coordsEl = document.getElementById('geoCoords');
    if (coordsEl) {
        coordsEl.textContent = `Titik Default: ${lat.toFixed(5)}, ${lng.toFixed(5)} (Tunas Toyota Kiara Condong)`;
    }

    const btnSubmit = document.getElementById('btnSubmitCheckin');
    if (btnSubmit) btnSubmit.disabled = false;

    const btnGmaps = document.getElementById('btnGmapsLink');
    if (btnGmaps) {
        btnGmaps.href = `https://www.google.com/maps?q=${lat},${lng}`;
        btnGmaps.style.display = 'inline-flex';
    }

    initLeafletMap(lat, lng);
}

function updateCoordinates(lat, lng, accuracy, updateText = true) {
    currentCoords.lat = lat;
    currentCoords.lng = lng;
    currentCoords.accuracy = accuracy;

    const coordsEl = document.getElementById('geoCoords');
    if (coordsEl && updateText) {
        coordsEl.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}${accuracy ? ` (Akurasi: ±${accuracy}m)` : ''}`;
    }

    const btnGmaps = document.getElementById('btnGmapsLink');
    if (btnGmaps) {
        btnGmaps.href = `https://www.google.com/maps?q=${lat},${lng}`;
        btnGmaps.style.display = 'inline-flex';
    }
}

async function reverseGeocode(lat, lng) {
    const inputAddress = document.getElementById('inputAddress');
    if (!inputAddress) return;

    // Jika user sudah mengetik manual sendiri, jangan ditimpa paksa
    if (inputAddress.dataset.manualEdited === 'true' && inputAddress.value.trim() !== '') {
        return;
    }

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
            headers: { 'Accept-Language': 'id' }
        });
        if (response.ok) {
            const data = await response.json();
            if (data && data.display_name) {
                const addr = data.address || {};
                const name = addr.building || addr.amenity || addr.shop || addr.mall || addr.commercial || addr.road || data.display_name.split(',')[0];
                const area = addr.suburb || addr.city_district || addr.city || '';
                const locationLabel = area ? `${name}, ${area}` : name;

                inputAddress.value = locationLabel;
                return;
            }
        }
    } catch (e) {
        console.warn("Reverse geocode failed:", e);
    }

    if (!inputAddress.value || inputAddress.value.trim() === '') {
        inputAddress.value = `Lokasi Lapangan (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
    }
}

function setQuickLocation(name, lat, lng) {
    const inputAddress = document.getElementById('inputAddress');
    if (inputAddress) {
        inputAddress.value = name;
        inputAddress.dataset.manualEdited = 'true';
    }

    updateCoordinates(lat, lng, 10, true);

    const statusEl = document.getElementById('geoStatus');
    if (statusEl) {
        statusEl.className = 'geo-badge geo-success';
        statusEl.innerHTML = `<i class="fa-solid fa-thumbtack"></i> Preset: ${name}`;
    }

    if (mapInstance && markerInstance) {
        mapInstance.flyTo([lat, lng], 16, { animate: true, duration: 1 });
        markerInstance.setLatLng([lat, lng]);
    }

    const btnSubmit = document.getElementById('btnSubmitCheckin');
    if (btnSubmit) btnSubmit.disabled = false;
}

function handleJenisChange() {
    const select = document.getElementById('selectJenis');
    const inputKeterangan = document.getElementById('inputKeterangan');
    if (!select || !inputKeterangan) return;

    if (!inputKeterangan.value || inputKeterangan.value.trim() === '') {
        if (select.value === 'Pameran Display') {
            inputKeterangan.placeholder = 'Menjaga booth pameran display unit & membagikan brosur';
        } else if (select.value === 'Kunjungan Prospek') {
            inputKeterangan.placeholder = 'Kunjungan follow up dan presentasi penawaran unit ke prospek';
        } else if (select.value === 'Test Drive Customer') {
            inputKeterangan.placeholder = 'Melayani sesi test drive di lokasi konsumen';
        } else if (select.value === 'Delivery Unit') {
            inputKeterangan.placeholder = 'Serah terima / handover unit baru Toyota ke customer';
        } else {
            inputKeterangan.placeholder = 'Tuliskan catatan singkat kegiatan';
        }
    }
}

// ==========================================
// 4. PHOTO SELECTION & CAMERA
// ==========================================
function openPhotoPicker() {
    const modal = document.getElementById('photoSourceModal');
    if (modal) modal.classList.add('show');
}

function closePhotoSourceModal() {
    const modal = document.getElementById('photoSourceModal');
    if (modal) modal.classList.remove('show');
}

function triggerCameraInput() {
    closePhotoSourceModal();
    const inputCamera = document.getElementById('inputFotoCamera');
    if (inputCamera) inputCamera.click();
}

function triggerGalleryInput() {
    closePhotoSourceModal();
    const inputFile = document.getElementById('inputFotoFile');
    if (inputFile) inputFile.click();
}

function handleFileSelected(e) {
    const file = e.target.files[0];
    if (!file) return;

    selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = function (evt) {
        const previewWrap = document.getElementById('photoPreviewWrap');
        const previewImg = document.getElementById('photoPreviewImg');
        const uploadBox = document.getElementById('uploadBoxTrigger');

        if (previewImg && previewWrap) {
            previewImg.src = evt.target.result;
            previewWrap.style.display = 'block';
        }
        if (uploadBox) {
            uploadBox.style.display = 'none';
        }
    };
    reader.readAsDataURL(file);
}

function removeSelectedPhoto() {
    selectedPhotoFile = null;

    const inputCamera = document.getElementById('inputFotoCamera');
    const inputFile = document.getElementById('inputFotoFile');
    if (inputCamera) inputCamera.value = '';
    if (inputFile) inputFile.value = '';

    const previewWrap = document.getElementById('photoPreviewWrap');
    const previewImg = document.getElementById('photoPreviewImg');
    const uploadBox = document.getElementById('uploadBoxTrigger');

    if (previewWrap) previewWrap.style.display = 'none';
    if (previewImg) previewImg.src = '';
    if (uploadBox) uploadBox.style.display = 'block';
}

// ==========================================
// 5. SUBMIT CHECK-IN
// ==========================================
async function submitCheckin() {
    const jenis = document.getElementById('selectJenis')?.value;
    const namaLokasi = document.getElementById('inputAddress')?.value?.trim();
    const keterangan = document.getElementById('inputKeterangan')?.value?.trim();
    const btn = document.getElementById('btnSubmitCheckin');
    const msgEl = document.getElementById('checkinMsg');

    const showMsg = (text, type = 'error') => {
        if (!msgEl) return;
        msgEl.style.display = 'block';
        msgEl.textContent = text;
        if (type === 'error') {
            msgEl.style.background = '#fef2f2';
            msgEl.style.color = '#991b1b';
            msgEl.style.border = '1px solid #fecaca';
        } else {
            msgEl.style.background = '#f0fdf4';
            msgEl.style.color = '#166534';
            msgEl.style.border = '1px solid #bbf7d0';
        }
    };

    if (!jenis || !namaLokasi) {
        showMsg('Pilih jenis kunjungan dan isi nama lokasi terlebih dahulu.', 'error');
        return;
    }

    if (currentCoords.lat === null || currentCoords.lng === null) {
        showMsg('Koordinat GPS belum terdeteksi. Silakan tekan tombol Refresh GPS.', 'error');
        return;
    }

    const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
    const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || '1';
    const namaSpv = localStorage.getItem('spvSales') || 'Supervisor';

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Menyimpan Titik Check-In...</span>';
        }
        showMsg('Mengirim data check-in ke server...', 'info');

        const formData = new FormData();
        formData.append('sales_id', salesId);
        formData.append('nama_sales', namaSales);
        formData.append('nama_spv', namaSpv);
        formData.append('jenis_kunjungan', jenis);
        formData.append('nama_lokasi', namaLokasi);
        formData.append('latitude', currentCoords.lat);
        formData.append('longitude', currentCoords.lng);
        formData.append('keterangan', keterangan || '');

        if (selectedPhotoFile) {
            formData.append('foto_bukti', selectedPhotoFile);
        }

        const res = await fetch('../api/api_checkin.php', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();

        if (!data.ok) {
            showMsg(data.message || 'Gagal menyimpan check-in.', 'error');
            return;
        }

        showMsg('Check-In Berhasil Direkam ke Sistem!', 'info');

        if (btn) {
            btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Check-In Berhasil!</span>';
        }

        if (typeof window.alert === 'function') {
            window.alert('Check-In Kunjungan Lapangan berhasil disimpan!');
        }

        // Reset foto & input
        removeSelectedPhoto();
        document.getElementById('inputKeterangan').value = '';

        // Reload feed riwayat
        loadCheckinHistory();

        setTimeout(() => {
            if (btn) {
                btn.disabled = false;
                btn.style.background = 'linear-gradient(135deg, #d7123a 0%, #a50b2b 100%)';
                btn.innerHTML = '<i class="fa-solid fa-location-dot"></i> <span>Simpan Check-In Lokasi</span>';
            }
            if (msgEl) msgEl.style.display = 'none';
        }, 3000);

    } catch (e) {
        showMsg('Gagal terhubung ke backend server.', 'error');
        console.error("Submit check-in error:", e);
    } finally {
        if (btn && msgEl && msgEl.style.color.includes('991b1b')) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-location-dot"></i> <span>Simpan Check-In Lokasi</span>';
        }
    }
}

// ==========================================
// 6. RIWAYAT CHECK-IN FEED
// ==========================================
async function loadCheckinHistory() {
    const container = document.getElementById('historyFeedContainer');
    if (!container) return;

    const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || '';
    const namaSales = localStorage.getItem('namaSales') || '';

    try {
        const queryParams = salesId ? `?sales_id=${encodeURIComponent(salesId)}&limit=10` : `?limit=10`;
        const res = await fetch(`../api/api_checkin.php${queryParams}`);
        const result = await res.json();

        if (!result.ok || !Array.isArray(result.data) || result.data.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 24px 10px; color: var(--text-muted);">
                    <i class="fa-solid fa-map-location" style="font-size: 32px; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
                    <p style="font-size: 12.5px; font-weight: 600; margin: 0;">Belum ada check-in hari ini</p>
                    <span style="font-size: 11px;">Titik check-in Anda akan otomatis tampil di sini</span>
                </div>
            `;
            return;
        }

        const iconClassMap = {
            'Pameran Display': { cls: 'exhibition', icon: 'fa-landmark' },
            'Canvassing Wilayah': { cls: 'canvassing', icon: 'fa-person-walking-luggage' },
            'Kunjungan Prospek': { cls: 'default', icon: 'fa-handshake' },
            'Test Drive Customer': { cls: 'testdrive', icon: 'fa-car-side' },
            'Delivery Unit': { cls: 'delivery', icon: 'fa-gift' }
        };

        let html = '';
        result.data.forEach(item => {
            const timeStr = item.created_at ? formatTimeAgo(item.created_at) : 'Baru saja';
            const iconInfo = iconClassMap[item.jenis_kunjungan] || { cls: 'default', icon: 'fa-location-dot' };
            const gmapsUrl = `https://www.google.com/maps?q=${item.latitude},${item.longitude}`;
            const photoUrl = item.foto_bukti ? (item.foto_bukti.startsWith('http') || item.foto_bukti.startsWith('../') ? item.foto_bukti : `../${item.foto_bukti}`) : '';

            html += `
                <div class="history-item">
                    <div class="history-icon ${iconInfo.cls}">
                        <i class="fa-solid ${iconInfo.icon}"></i>
                    </div>
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 6px; margin-bottom: 3px;">
                            <span style="font-size: 10.5px; font-weight: 700; color: var(--accent-blue); text-transform: uppercase;">
                                ${item.jenis_kunjungan}
                            </span>
                            <span style="font-size: 10.5px; color: var(--text-muted); font-weight: 600;">
                                <i class="fa-regular fa-clock"></i> ${timeStr}
                            </span>
                        </div>
                        <h4 style="font-size: 13.5px; font-weight: 800; color: var(--text-dark); margin: 0 0 4px; line-height: 1.3;">
                            ${item.nama_lokasi}
                        </h4>
                        ${item.keterangan ? `<p style="font-size: 11.5px; color: #475569; margin: 0 0 6px; line-height: 1.4;">${item.keterangan}</p>` : ''}
                        
                        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; margin-top: 6px;">
                            <a href="${gmapsUrl}" target="_blank" style="font-size: 11px; font-weight: 700; color: #2563eb; display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
                                <i class="fa-solid fa-arrow-up-right-from-square"></i> Lihat Titik Koordinat
                            </a>
                            ${photoUrl ? `
                                <a href="${photoUrl}" target="_blank" style="font-size: 11px; font-weight: 700; color: #059669; display: inline-flex; align-items: center; gap: 4px; text-decoration: none;">
                                    <i class="fa-solid fa-image"></i> Lihat Foto Bukti
                                </a>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (e) {
        console.error("Gagal load riwayat checkin:", e);
        container.innerHTML = `
            <p style="font-size: 12px; color: var(--primary-red); text-align: center; padding: 10px;">
                Gagal memuat riwayat check-in.
            </p>
        `;
    }
}

function formatTimeAgo(dateString) {
    try {
        const date = new Date(dateString.replace(' ', 'T'));
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} mnt lalu`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} jam lalu`;
        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return dateString;
    }
}

// ==========================================
// 7. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    startLiveClock();
    detectLocation();
    loadCheckinHistory();

    const inputAddress = document.getElementById('inputAddress');
    if (inputAddress) {
        inputAddress.addEventListener('input', () => {
            inputAddress.dataset.manualEdited = 'true';
        });
    }
});
