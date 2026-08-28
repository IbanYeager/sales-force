// Auto-load location tracker untuk Sales aktif
(function() {
    if (!document.querySelector('script[src*="auto_location_tracker.js"]')) {
        const script = document.createElement('script');
        const scriptPath = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../js/auto_location_tracker.js' : 'js/auto_location_tracker.js';
        script.src = scriptPath;
        document.head.appendChild(script);
    }
})();

let deferredPrompt;
let pwaRefreshing = false;

// 1. SMART AUTO-UPDATING SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator) {
    const swPath = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../sw.js?v=20260828_01' : 'sw.js?v=20260828_01';

    navigator.serviceWorker.register(swPath)
        .then(registration => {
            console.log('[PWA] ServiceWorker registered with scope:', registration.scope);

            // Periksa update setiap kali halaman dibuka / aktif
            registration.update().catch(() => {});

            // Jika ada worker baru yang ditemukan
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('[PWA] Versi baru ditemukan & diunduh. Mengaktifkan update...');
                            newWorker.postMessage({ action: 'SKIP_WAITING' });
                        }
                    });
                }
            });
        })
        .catch(err => {
            console.warn('[PWA] ServiceWorker registration warning:', err);
        });

    // Ketika controller berganti (Service Worker baru aktif), auto-refresh halaman agar APK langsung memuat update web terbaru
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!pwaRefreshing) {
            pwaRefreshing = true;
            console.log('[PWA] Controller changed -> Memuat ulang aplikasi dengan kode terbaru...');
            sessionStorage.setItem('sft_pwa_updated_toast', 'true');
            window.location.reload();
        }
    });

    // Dengarkan pesan broadcast dari Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PWA_NEW_VERSION_ACTIVATED') {
            console.log('[PWA] New version activated:', event.data.version);
            if (!pwaRefreshing) {
                pwaRefreshing = true;
                sessionStorage.setItem('sft_pwa_updated_toast', 'true');
                window.location.reload();
            }
        }
    });

    // Auto-check update setiap kali user kembali membuka aplikasi (Resume / Foreground)
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            navigator.serviceWorker.getRegistration().then(reg => {
                if (reg) {
                    console.log('[PWA] Memeriksa pembaruan web terbaru...');
                    reg.update().catch(() => {});
                }
            });
        }
    });

    // Periodic background check setiap 5 menit
    setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => {
            if (reg) reg.update().catch(() => {});
        });
    }, 5 * 60 * 1000);
}


// Menangkap event install dari browser
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // Jangan tampilkan di halaman formulir, cetak, atau publik
    const pathLower = window.location.pathname.toLowerCase();
    if (pathLower.includes('cetak') || pathLower.includes('print') || pathLower.includes('dokumen') || pathLower.includes('formulir') || pathLower.includes('track_public') || pathLower.includes('public_card')) {
        return;
    }

    // Jangan tampilkan jika user sudah pernah menutup banner di sesi ini
    if (sessionStorage.getItem('pwaPromptDismissed') === 'true') {
        return;
    }

    let installContainer = document.getElementById('custom-install-container');
    if (!installContainer) {
        if (!document.getElementById('pwaInstallStyles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'pwaInstallStyles';
            styleElement.textContent = `
                @keyframes slideUpPwa {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                #custom-install-container {
                    position: fixed;
                    bottom: 82px;
                    right: 24px;
                    z-index: 99998;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: #0f172a;
                    color: #ffffff;
                    padding: 12px 16px;
                    border-radius: 14px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.35);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    font-family: 'Inter', sans-serif;
                    max-width: 360px;
                    animation: slideUpPwa 0.4s ease-out;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                @media (max-width: 768px) {
                    #custom-install-container {
                        bottom: 145px !important;
                        right: 14px !important;
                        left: 14px !important;
                        max-width: calc(100vw - 28px) !important;
                        margin-left: auto !important;
                        padding: 10px 14px !important;
                    }
                }
            `;
            document.head.appendChild(styleElement);
        }

        installContainer = document.createElement('div');
        installContainer.id = 'custom-install-container';

        installContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1;" id="pwaClickArea">
                <div style="width: 36px; height: 36px; border-radius: 10px; background: rgba(215, 18, 58, 0.2); border: 1px solid rgba(215, 18, 58, 0.4); display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 16px; flex-shrink: 0;">
                    <i class="fa-solid fa-download"></i>
                </div>
                <div>
                    <div style="font-size: 13px; font-weight: 800; line-height: 1.2;">Install Aplikasi SFT</div>
                    <div style="font-size: 10.5px; opacity: 0.8; margin-top: 2px;">Akses lebih cepat & offline</div>
                </div>
            </div>
            <button type="button" id="pwaCloseBtn" style="background: rgba(255,255,255,0.1); border: none; color: #94a3b8; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: all 0.2s;" title="Tutup">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `;

        document.body.appendChild(installContainer);

        // Click action untuk install
        const clickArea = document.getElementById('pwaClickArea');
        if (clickArea) {
            clickArea.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    if (outcome === 'accepted') {
                        installContainer.style.display = 'none';
                    }
                    deferredPrompt = null;
                }
            });
        }

        // Click action untuk menutup / dismiss
        const closeBtn = document.getElementById('pwaCloseBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (evt) => {
                evt.stopPropagation();
                sessionStorage.setItem('pwaPromptDismissed', 'true');
                installContainer.remove();
            });
        }
    }
});

// Sembunyikan jika app sudah diinstall
window.addEventListener('appinstalled', () => {
    const installContainer = document.getElementById('custom-install-container');
    if (installContainer) installContainer.style.display = 'none';
    sessionStorage.setItem('pwaPromptDismissed', 'true');
});
