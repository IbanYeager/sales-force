// auto_location_tracker.js — Silent Background Real-Time Location Tracker untuk Sales App
// Menangani izin lokasi standar browser sekali saja tanpa notifikasi/teks pelacakan di sisi sales

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
            // Silent fail tanpa alert
        }
    }

    // Callback saat posisi berubah dari watchPosition
    function onPositionSuccess(pos) {
        lastKnownPos = pos;
        localStorage.setItem('sales_gps_permitted', 'true');
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
        // Silent fail tanpa memunculkan banner/notifikasi agar sales tidak terganggu
    }

    // Memulai pemantauan GPS live berkelanjutan secara senyap di latar belakang
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

        // Panggil getCurrentPosition (memicu prompt izin bawaan browser jika belum diizinkan)
        navigator.geolocation.getCurrentPosition(
            onPositionSuccess,
            onPositionError,
            geoOptions
        );

        // Pasang watchPosition untuk live stream pergerakan di background
        watchId = navigator.geolocation.watchPosition(
            onPositionSuccess,
            onPositionError,
            geoOptions
        );

        // Heartbeat timer tiap 12 detik di latar belakang
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
            if (lastKnownPos && Date.now() - lastSentTime >= 10000) {
                sendPing(lastKnownPos);
            }
        }, 12000);
    }

    // Periksa status izin lokasi secara senyap
    async function initGpsSilently() {
        if (!isSalesRole() || !navigator.geolocation) return;

        // Bersihkan elemen DOM lama jika pernah ada
        const oldPill = document.getElementById('gpsLiveTrackingPill');
        if (oldPill) oldPill.remove();
        const oldModal = document.getElementById('modalGpsPermission');
        if (oldModal) oldModal.remove();
        const oldBanner = document.getElementById('bannerGpsReminder');
        if (oldBanner) oldBanner.remove();

        // Cek status izin via Permissions API browser
        if (navigator.permissions && navigator.permissions.query) {
            try {
                const status = await navigator.permissions.query({ name: 'geolocation' });
                if (status.state === 'granted') {
                    // Sudah diizinkan: langsung jalan senyap tanpa popup
                    startLiveWatch();
                    return;
                } else if (status.state === 'denied') {
                    // Izin ditolak pengguna: jangan ganggu sales
                    return;
                }

                // Jika state === 'prompt' (pertama kali masuk), dengarkan jika diizinkan
                status.onchange = () => {
                    if (status.state === 'granted') {
                        startLiveWatch();
                    }
                };
            } catch (e) {}
        }

        // Memicu dialog standar bawaan browser sekali saja
        startLiveWatch();
    }

    // Inisialisasi senyap saat halaman dimuat
    document.addEventListener('DOMContentLoaded', () => {
        if (isSalesRole()) {
            setTimeout(initGpsSilently, 600);
        }
    });

    document.addEventListener('visibilitychange', () => {
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
