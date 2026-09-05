// auto_location_tracker.js — Location Tracker untuk Sales App
// Meminta izin sekali saat masuk web, jika sudah diizinkan tidak ditampilkan lagi.
// Jika klik Nanti Saja, akan terus muncul di sesi/kunjungan berikutnya sampai diizinkan.
// Seluruh tampilan teks "GPS Live" dan banner dihilangkan agar sales tidak mengetahui pelacakan.

(function () {
    const DEALERSHIP_LAT = -6.9444;
    const DEALERSHIP_LNG = 107.6422;
    const GEOFENCE_OFFICE_KM = 0.45; // 450 meter radius kantor cabang Kiara Condong

    let watchId = null;
    let lastSentLat = null;
    let lastSentLng = null;
    let lastSentTime = 0;
    let lastKnownPos = null;
    let heartbeatTimer = null;

    // Helper hitung jarak dalam KM
    function calcDistanceKm(lat1, lon1, lat2, lon2) {
        const dLat = (lat2 - lat1) * 111.32;
        const dLng = (lon2 - lon1) * 111.32 * Math.cos(lat1 * Math.PI / 180);
        return Math.sqrt(dLat * dLat + dLng * dLng);
    }

    function getApiPrefix() {
        return (window.location.pathname.includes('/pages/') || 
                window.location.pathname.includes('/pages_spv/') || 
                window.location.pathname.includes('/pages_kacab/')) ? '../' : '';
    }

    function isSalesRole() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        const peran = (localStorage.getItem('peranSales') || '').trim();
        if (!loggedIn) return false;
        if (peran === 'Supervisor' || peran === 'Kepala Cabang') return false;
        return true;
    }

    // Mengirim pembaruan posisi secara senyap ke server MySQL (sales_last_locations)
    async function sendPing(pos) {
        if (!isSalesRole() || !pos) return;

        const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || '1';
        const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
        const spvSales = localStorage.getItem('spvSales') || 'Supervisor';

        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const acc = pos.coords.accuracy ? Math.round(pos.coords.accuracy * 10) / 10 : 10;

        const distToOffice = calcDistanceKm(lat, lng, DEALERSHIP_LAT, DEALERSHIP_LNG);
        const statusAktif = (distToOffice <= GEOFENCE_OFFICE_KM) ? 'Di Kantor Cabang' : 'On-Duty';

        const payload = {
            action: 'auto_ping',
            sales_id: String(salesId),
            nama_sales: namaSales,
            nama_spv: spvSales,
            latitude: lat,
            longitude: lng,
            accuracy: acc,
            status_aktif: statusAktif
        };

        try {
            const res = await fetch(getApiPrefix() + 'api/api_checkin.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                lastSentLat = lat;
                lastSentLng = lng;
                lastSentTime = Date.now();
            }
        } catch (e) {
            // Silent fail
        }
    }

    // Callback saat posisi diperoleh
    function onPositionSuccess(pos) {
        lastKnownPos = pos;
        localStorage.setItem('sales_gps_permitted', 'true');
        hidePermissionModal();

        const now = Date.now();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let shouldSend = false;

        if (!lastSentLat || !lastSentLng) {
            shouldSend = true;
        } else {
            const movedDistMeters = calcDistanceKm(lat, lng, lastSentLat, lastSentLng) * 1000;
            const timeSinceLast = now - lastSentTime;

            if (movedDistMeters >= 5 || timeSinceLast >= 10000) {
                shouldSend = true;
            }
        }

        if (shouldSend) {
            sendPing(pos);
        }
    }

    function onPositionError(err) {
        // Silent fail tanpa alert
    }

    // Memulai pemantauan GPS live berkelanjutan di latar belakang secara senyap
    function startLiveWatch() {
        if (!navigator.geolocation || !isSalesRole()) return;

        if (watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
        }

        const geoOptions = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
            onPositionSuccess,
            onPositionError,
            geoOptions
        );

        watchId = navigator.geolocation.watchPosition(
            onPositionSuccess,
            onPositionError,
            geoOptions
        );

        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
            if (lastKnownPos && Date.now() - lastSentTime >= 10000) {
                sendPing(lastKnownPos);
            }
        }, 12000);
    }

    // Modal UI untuk meminta izin lokasi sekali saja
    function showPermissionModal() {
        if (document.getElementById('modalGpsPermission')) return;

        const modalHtml = `
            <div id="modalGpsPermission" style="
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(8px);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
                animation: fadeInGpsModal 0.3s ease-out;
            ">
                <div style="
                    background: #ffffff;
                    border-radius: 20px;
                    max-width: 400px;
                    width: 100%;
                    padding: 24px 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    text-align: center;
                    position: relative;
                ">
                    <div style="
                        width: 60px;
                        height: 60px;
                        background: linear-gradient(135deg, #fef2f2, #fee2e2);
                        border: 2px solid #fecaca;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 14px;
                        color: #cc1426;
                        font-size: 24px;
                        box-shadow: 0 8px 16px rgba(204, 20, 38, 0.15);
                    ">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>

                    <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 800; color: #1e1014;">
                        Aktifkan Izin Lokasi (GPS)
                    </h3>
                    
                    <p style="margin: 0 0 16px; font-size: 12.5px; color: #64748b; line-height: 1.5;">
                        Sistem Sales Force memerlukan akses lokasi agar presensi kerja harian dan verifikasi kunjungan Anda tercatat <strong>secara otomatis</strong> di Kantor Cabang.
                    </p>

                    <div style="
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 12px;
                        padding: 12px;
                        margin-bottom: 20px;
                        text-align: left;
                        display: flex;
                        flex-direction: column;
                        gap: 8px;
                        font-size: 11.5px;
                        color: #334155;
                    ">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-building-circle-check" style="color: #2563eb;"></i>
                            <span>Presensi Otomatis saat berada di Kantor Cabang</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-clock-rotate-left" style="color: #059669;"></i>
                            <span>Verifikasi Kehadiran & Jam Kerja Real-time</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-shield-halved" style="color: #d97706;"></i>
                            <span>Akurasi Posisi Presisi Tinggi Standar Toyota</span>
                        </div>
                    </div>

                    <button id="btnAktifkanGps" style="
                        width: 100%;
                        padding: 13px 16px;
                        background: linear-gradient(135deg, #cc1426, #991b1b);
                        color: #ffffff;
                        border: none;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 800;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        box-shadow: 0 6px 16px rgba(204, 20, 38, 0.3);
                        transition: all 0.2s;
                        margin-bottom: 8px;
                    ">
                        <i class="fa-solid fa-location-crosshairs"></i>
                        <span>Izinkan Akses GPS Sekarang</span>
                    </button>

                    <button id="btnNantiGps" style="
                        width: 100%;
                        padding: 9px 16px;
                        background: transparent;
                        color: #94a3b8;
                        border: none;
                        font-size: 11.5px;
                        font-weight: 600;
                        cursor: pointer;
                    ">
                        Nanti Saja
                    </button>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div);

        document.getElementById('btnAktifkanGps')?.addEventListener('click', () => {
            const btn = document.getElementById('btnAktifkanGps');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan Satelit...';
                btn.disabled = true;
            }

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    localStorage.setItem('sales_gps_permitted', 'true');
                    hidePermissionModal();
                    onPositionSuccess(pos);
                    startLiveWatch();
                },
                (err) => {
                    if (btn) {
                        btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Coba Izinkan Lagi';
                        btn.disabled = false;
                    }
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
            );
        });

        document.getElementById('btnNantiGps')?.addEventListener('click', () => {
            // Jika menekan "Nanti Saja", JANGAN simpan sales_gps_permitted ke localStorage!
            // Sehingga modal akan terus muncul di sesi/kunjungan berikutnya sampai diizinkan.
            hidePermissionModal();
        });
    }

    function hidePermissionModal() {
        const modal = document.getElementById('modalGpsPermission');
        if (modal) modal.remove();
    }

    // Bersihkan seluruh elemen teks/pill/banner live GPS agar sales tidak tahu
    function cleanAllGpsUi() {
        const oldPill = document.getElementById('gpsLiveTrackingPill');
        if (oldPill) oldPill.remove();
        const oldBanner = document.getElementById('bannerGpsReminder');
        if (oldBanner) oldBanner.remove();
    }

    // Cek izin dan inisialisasi
    async function checkPermissionAndInit() {
        if (!isSalesRole() || !navigator.geolocation) return;

        cleanAllGpsUi();

        // 1. Cek apakah di browser / localStorage SUDAH PERNAH DIIZINKAN
        const isPermittedInStorage = localStorage.getItem('sales_gps_permitted') === 'true';

        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                if (status.state === 'granted') {
                    // SUDAH DIIZINKAN: Jangan tampilkan modal lagi! Langsung jalankan senyap.
                    localStorage.setItem('sales_gps_permitted', 'true');
                    hidePermissionModal();
                    startLiveWatch();
                    return;
                } else if (status.state === 'prompt') {
                    // Belum diizinkan: tampilkan modal permintaan izin
                    showPermissionModal();
                    status.onchange = () => {
                        if (status.state === 'granted') {
                            localStorage.setItem('sales_gps_permitted', 'true');
                            hidePermissionModal();
                            startLiveWatch();
                        }
                    };
                    return;
                }
            } catch (e) {}
        }

        // Fallback jika Permissions API tidak didukung:
        if (isPermittedInStorage) {
            // Sudah pernah diizinkan, langsung start senyap
            hidePermissionModal();
            startLiveWatch();
        } else {
            // Belum diizinkan (atau pernah klik Nanti Saja), munculkan modal
            showPermissionModal();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        cleanAllGpsUi();
        if (isSalesRole()) {
            setTimeout(checkPermissionAndInit, 700);
        }
    });

    document.addEventListener('visibilitychange', () => {
        cleanAllGpsUi();
        if (!document.hidden && isSalesRole()) {
            if (lastKnownPos) {
                sendPing(lastKnownPos);
            }
        }
    });

    // Expose fungsi
    window.SalesLocationTracker = {
        start: startLiveWatch
    };
})();
