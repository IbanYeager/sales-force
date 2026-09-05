// auto_location_tracker.js — Ultra-Accurate Live Real-Time Location Tracker untuk Sales App
// Menangani izin lokasi interaktif dan live streaming posisi pergerakan sales ke server

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

    // Mengirim pembaruan posisi ke server MySQL (sales_last_locations)
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
            console.warn('[GPS Tracker] Gagal mengirim ping lokasi:', e);
        }
    }

    // Callback saat posisi berubah dari watchPosition
    function onPositionSuccess(pos) {
        lastKnownPos = pos;
        const now = Date.now();
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let shouldSend = false;

        if (!lastSentLat || !lastSentLng) {
            shouldSend = true;
        } else {
            // Hitung perpindahan dalam meter
            const movedDistMeters = calcDistanceKm(lat, lng, lastSentLat, lastSentLng) * 1000;
            const timeSinceLast = now - lastSentTime;

            // Kirim jika berpindah >= 5 meter atau sudah lebih dari 10 detik sejak kirim terakhir
            if (movedDistMeters >= 5 || timeSinceLast >= 10000) {
                shouldSend = true;
            }
        }

        if (shouldSend) {
            sendPing(pos);
        }
    }

    function onPositionError(err) {
        console.warn('[GPS Tracker] Posisi GPS gagal diperoleh:', err.message);
        if (err.code === err.PERMISSION_DENIED) {
            showPermissionBanner(true);
        }
    }

    // Memulai pemantauan GPS live berkelanjutan
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

        // Ambil sekali langsung untuk respon instan
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                onPositionSuccess(pos);
                hidePermissionModal();
                hidePermissionBanner();
            },
            onPositionError,
            geoOptions
        );

        // Pasang watchPosition untuk live stream pergerakan
        watchId = navigator.geolocation.watchPosition(
            onPositionSuccess,
            onPositionError,
            geoOptions
        );

        // Heartbeat timer tiap 12 detik agar status tetap Live di dashboard Kacab
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
            if (lastKnownPos && Date.now() - lastSentTime >= 10000) {
                sendPing(lastKnownPos);
            }
        }, 12000);
    }

    // Periksa status izin geolokasi browser
    async function checkAndPromptPermission() {
        if (!isSalesRole() || !navigator.geolocation) return;

        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                if (status.state === 'granted') {
                    startLiveWatch();
                } else if (status.state === 'prompt') {
                    showPermissionModal();
                } else if (status.state === 'denied') {
                    showPermissionBanner(true);
                }

                status.onchange = () => {
                    if (status.state === 'granted') {
                        hidePermissionModal();
                        hidePermissionBanner();
                        startLiveWatch();
                    } else if (status.state === 'denied') {
                        showPermissionBanner(true);
                    }
                };
                return;
            } catch (e) {
                // Fallback jika query geolocation tidak didukung browser
            }
        }

        // Jika permissions API tidak ada, tampilkan modal jika belum pernah disetujui
        const hasPrompted = sessionStorage.getItem('gps_prompted_this_session');
        if (!hasPrompted) {
            showPermissionModal();
        } else {
            startLiveWatch();
        }
    }

    // Modal UI modern untuk meminta izin GPS
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
                animation: fadeInModal 0.3s ease-out;
            ">
                <div style="
                    background: #ffffff;
                    border-radius: 20px;
                    max-width: 420px;
                    width: 100%;
                    padding: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    text-align: center;
                    position: relative;
                ">
                    <div style="
                        width: 64px;
                        height: 64px;
                        background: linear-gradient(135deg, #fef2f2, #fee2e2);
                        border: 2px solid #fecaca;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin: 0 auto 16px;
                        color: #cc1426;
                        font-size: 26px;
                        box-shadow: 0 8px 16px rgba(204, 20, 38, 0.15);
                    ">
                        <i class="fa-solid fa-location-dot"></i>
                    </div>

                    <h3 style="margin: 0 0 8px; font-size: 18px; font-weight: 800; color: #1e1014;">
                        Aktifkan Izin Lokasi (GPS)
                    </h3>
                    
                    <p style="margin: 0 0 16px; font-size: 12.5px; color: #64748b; line-height: 1.5;">
                        Sistem Sales Force memerlukan akses GPS agar rute kunjungan lapangan, canvassing, dan presensi kerja Anda tercatat <strong>secara otomatis & real-time</strong> di Kantor Cabang.
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
                            <i class="fa-solid fa-satellite-dish" style="color: #059669;"></i>
                            <span>Auto-Tracking Real-time ke Kepala Cabang</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-building-circle-check" style="color: #2563eb;"></i>
                            <span>Presensi Otomatis saat berada di Kantor Kircon</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-shield-halved" style="color: #d97706;"></i>
                            <span>Akurasi Posisi Presisi Tinggi</span>
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
            sessionStorage.setItem('gps_prompted_this_session', 'true');
            const btn = document.getElementById('btnAktifkanGps');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menghubungkan Satelit GPS...';
                btn.disabled = true;
            }
            startLiveWatch();
        });

        document.getElementById('btnNantiGps')?.addEventListener('click', () => {
            sessionStorage.setItem('gps_prompted_this_session', 'true');
            hidePermissionModal();
            showPermissionBanner(false);
        });
    }

    function hidePermissionModal() {
        const modal = document.getElementById('modalGpsPermission');
        if (modal) modal.remove();
    }

    // Banner strip jika izin ditolak atau ditunda
    function showPermissionBanner(isDenied) {
        if (document.getElementById('bannerGpsReminder')) return;

        const banner = document.createElement('div');
        banner.id = 'bannerGpsReminder';
        banner.style.cssText = `
            position: fixed;
            bottom: 65px;
            left: 16px;
            right: 16px;
            max-width: 480px;
            margin: 0 auto;
            background: ${isDenied ? '#fef2f2' : '#eff6ff'};
            border: 1px solid ${isDenied ? '#fecaca' : '#bfdbfe'};
            border-radius: 12px;
            padding: 10px 14px;
            z-index: 9998;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            font-size: 11.5px;
            color: ${isDenied ? '#991b1b' : '#1e40af'};
        `;

        banner.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
                <i class="fa-solid ${isDenied ? 'fa-triangle-exclamation' : 'fa-location-dot'}"></i>
                <span>${isDenied ? 'Akses GPS diblokir. Aktifkan di izin browser agar rute terlacak.' : 'Aktifkan GPS agar presensi & lokasi terupdate otomatis.'}</span>
            </div>
            <button id="btnBannerGps" style="
                padding: 6px 12px;
                background: ${isDenied ? '#cc1426' : '#2563eb'};
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                white-space: nowrap;
            ">
                ${isDenied ? 'Panduan' : 'Aktifkan'}
            </button>
        `;

        document.body.appendChild(banner);

        document.getElementById('btnBannerGps')?.addEventListener('click', () => {
            if (isDenied) {
                alert("Cara Mengaktifkan GPS:\n1. Klik ikon gembok / setelan di bilah alamat browser (URL).\n2. Cari 'Izin' atau 'Permissions'.\n3. Ubah 'Lokasi' menjadi 'Izinkan' (Allow).\n4. Muat ulang (refresh) halaman ini.");
            } else {
                startLiveWatch();
            }
        });
    }

    function hidePermissionBanner() {
        const banner = document.getElementById('bannerGpsReminder');
        if (banner) banner.remove();
    }

    // Pastikan tidak ada pill live GPS yang muncul di tampilan sales
    function removeExistingPill() {
        const pill = document.getElementById('gpsLiveTrackingPill');
        if (pill) pill.remove();
    }

    // Inisialisasi saat halaman selesai dimuat
    document.addEventListener('DOMContentLoaded', () => {
        removeExistingPill();
        if (isSalesRole()) {
            setTimeout(checkAndPromptPermission, 800);
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden && isSalesRole()) {
            if (lastKnownPos) {
                sendPing(lastKnownPos);
            }
        }
    });

    // Expose fungsi untuk trigger manual jika diperlukan
    window.SalesLocationTracker = {
        start: startLiveWatch,
        prompt: checkAndPromptPermission,
        sendCurrent: () => {
            if (lastKnownPos) sendPing(lastKnownPos);
        }
    };
})();
