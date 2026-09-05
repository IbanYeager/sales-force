// auto_location_tracker.js — Automatic Last Known Location Tracker untuk Sales App

(function () {
    let lastPingTime = 0;
    const PING_INTERVAL_MS = 3 * 60 * 1000; // Auto ping setiap 3 menit saat aplikasi digunakan

    function sendLocationPing() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        const peran = localStorage.getItem('peranSales') || '';
        if (!loggedIn || peran === 'Supervisor' || peran === 'Kepala Cabang') return;

        const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || '1';
        const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
        const spvSales = localStorage.getItem('spvSales') || 'Supervisor';

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const now = Date.now();
                if (now - lastPingTime < PING_INTERVAL_MS - 5000) return;
                lastPingTime = now;

                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const acc = position.coords.accuracy ? Math.round(position.coords.accuracy * 10) / 10 : 10;

                // Hitung jarak ke Kantor Tunas Toyota Kiara Condong (-6.9387, 107.6433)
                const dLat = (lat - (-6.9387)) * 111.32;
                const dLng = (lng - 107.6433) * 111.32 * Math.cos(lat * Math.PI / 180);
                const distKm = Math.sqrt(dLat * dLat + dLng * dLng);

                let statusAktif = 'On-Duty';
                if (distKm <= 0.45) {
                    statusAktif = 'Di Kantor Cabang';
                }

                const payload = {
                    action: 'auto_ping',
                    sales_id: salesId,
                    nama_sales: namaSales,
                    nama_spv: spvSales,
                    latitude: lat,
                    longitude: lng,
                    accuracy: acc,
                    status_aktif: statusAktif
                };

                const prefix = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../' : '';

                try {
                    await fetch(prefix + 'api/api_checkin.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                } catch (e) {
                    // Silent fail
                }
            },
            (err) => {
                // Silent fail jika izin belum diberikan
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }

    document.addEventListener('DOMContentLoaded', () => {
        sendLocationPing();
        setInterval(sendLocationPing, PING_INTERVAL_MS);
    });

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            sendLocationPing();
        }
    });
})();
