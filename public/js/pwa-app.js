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

if ('serviceWorker' in navigator) {
    const swPath = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../sw.js' : 'sw.js';
    navigator.serviceWorker.register(swPath)
        .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
        });
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
