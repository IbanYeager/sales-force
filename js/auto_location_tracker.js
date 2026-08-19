// auto_location_tracker.js — Automatic Last Known Location Tracker untuk Sales App

(function () {
    let lastPingTime = 0;
    const PING_INTERVAL_MS = 3 * 60 * 1000; // Auto ping setiap 3 menit saat aplikasi digunakan

    function sendLocationPing() {
        const loggedIn = localStorage.getItem('loggedIn') === 'true';
        if (!loggedIn) return;

        const salesId = localStorage.getItem('salesId') || '1';
        const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
        const spvSales = localStorage.getItem('spvSales') || 'Supervisor';

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const now = Date.now();
                if (now - lastPingTime < PING_INTERVAL_MS - 5000) return;
                lastPingTime = now;

                const payload = {
                    action: 'auto_ping',
                    sales_id: salesId,
                    nama_sales: namaSales,
                    nama_spv: spvSales,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    status_aktif: 'On-Duty'
                };

                try {
                    await fetch('../api/api_checkin.php', {
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
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
        );
    }

    document.addEventListener('DOMContentLoaded', () => {
        sendLocationPing();
        setInterval(sendLocationPing, PING_INTERVAL_MS);
    });
})();
