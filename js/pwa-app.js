// Auto-load location tracker untuk Sales aktif
(function() {
    if (!document.querySelector('script[src*="auto_location_tracker.js"]')) {
        const script = document.createElement('script');
        const scriptPath = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../js/auto_location_tracker.js?v=20260908_v7' : 'js/auto_location_tracker.js?v=20260908_v7';
        script.src = scriptPath;
        document.head.appendChild(script);
    }
})();

let deferredPrompt;
let pwaRefreshing = false;

// 1. SMART AUTO-UPDATING SERVICE WORKER REGISTRATION
if ('serviceWorker' in navigator) {
    const swPath = (window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/')) ? '../sw.js?v=20260908_v10' : 'sw.js?v=20260908_v10';

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
            window.location.reload();
        }
    });

    // Dengarkan pesan broadcast dari Service Worker
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PWA_NEW_VERSION_ACTIVATED') {
            console.log('[PWA] New version activated:', event.data.version);
            if (!pwaRefreshing) {
                pwaRefreshing = true;
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

// Bersihkan dan blokir session storage toast agar tidak pernah muncul
try {
    sessionStorage.removeItem('sft_pwa_updated_toast');
    if (typeof window !== 'undefined' && window.sessionStorage) {
        const _origSet = sessionStorage.setItem.bind(sessionStorage);
        sessionStorage.setItem = function(key, val) {
            if (key === 'sft_pwa_updated_toast') return;
            return _origSet(key, val);
        };
    }
} catch (e) {}

// =========================================================================
// 2. UNIVERSAL PWA INSTALLATION SYSTEM (Mobile & Desktop)
// =========================================================================

// Cek apakah web sudah berjalan dalam mode PWA / Standalone App
function isAppInstalled() {
    return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || 
           (window.navigator.standalone === true) || 
           (document.referrer && document.referrer.includes('android-app://'));
}

// Modal Panduan Instalasi Pintar (iOS Safari & Android/Chrome fallback)
function showPwaInstallGuideModal() {
    let modal = document.getElementById('modalPwaInstallGuide');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (!modal) {
        const modalHtml = `
            <div id="modalPwaInstallGuide" style="
                position: fixed;
                top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(15, 23, 42, 0.75);
                backdrop-filter: blur(8px);
                z-index: 999999;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
            ">
                <div style="
                    background: #ffffff;
                    border-radius: 22px;
                    max-width: 420px;
                    width: 100%;
                    padding: 24px 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35);
                    text-align: center;
                    position: relative;
                ">
                    <button type="button" onclick="document.getElementById('modalPwaInstallGuide').style.display='none'" style="
                        position: absolute; top: 16px; right: 16px;
                        background: #f1f5f9; border: none; width: 30px; height: 30px;
                        border-radius: 50%; color: #64748b; font-size: 14px;
                        display: flex; align-items: center; justify-content: center;
                        cursor: pointer;
                    ">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <div style="
                        width: 62px; height: 62px;
                        background: linear-gradient(135deg, #fef2f2, #fee2e2);
                        border: 2px solid #fecaca;
                        border-radius: 18px;
                        display: flex; align-items: center; justify-content: center;
                        margin: 0 auto 14px;
                        color: #cc1426; font-size: 26px;
                        box-shadow: 0 8px 20px rgba(204, 20, 38, 0.2);
                    ">
                        <i class="fa-solid fa-download"></i>
                    </div>

                    <h3 style="margin: 0 0 6px; font-size: 18px; font-weight: 800; color: #1e1014;">
                        Install Aplikasi SFT Mobile
                    </h3>
                    <p style="margin: 0 0 16px; font-size: 12.5px; color: #64748b; line-height: 1.45;">
                        Pasang aplikasi di layar utama HP Anda untuk akses cepat tanpa browser, responsif, dan hemat kuota.
                    </p>

                    ${isIOS ? `
                    <div style="
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 14px;
                        padding: 14px;
                        text-align: left;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        font-size: 12px;
                        color: #334155;
                        margin-bottom: 18px;
                    ">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #0284c7; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">1</span>
                            <span>Ketuk tombol <strong>Bagikan (Share)</strong> <i class="fa-solid fa-arrow-up-from-bracket" style="color: #0284c7;"></i> pada bilah bawah Safari.</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #059669; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">2</span>
                            <span>Gulir ke bawah dan pilih opsi <strong>"Tambah ke Layar Utama"</strong> (<i class="fa-regular fa-square-plus" style="color: #059669;"></i> / Add to Home Screen).</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #cc1426; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">3</span>
                            <span>Ketuk tombol <strong>"Tambah"</strong> di pojok kanan atas. Ikon SFT siap digunakan!</span>
                        </div>
                    </div>
                    ` : `
                    <div style="
                        background: #f8fafc;
                        border: 1px solid #e2e8f0;
                        border-radius: 14px;
                        padding: 14px;
                        text-align: left;
                        display: flex;
                        flex-direction: column;
                        gap: 12px;
                        font-size: 12px;
                        color: #334155;
                        margin-bottom: 18px;
                    ">
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #cc1426; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">1</span>
                            <span>Ketuk menu <strong>Titik Tiga (⋮)</strong> di pojok kanan atas browser HP Anda.</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #0284c7; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">2</span>
                            <span>Pilih menu <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong> (<i class="fa-solid fa-mobile-screen"></i>).</span>
                        </div>
                        <div style="display: flex; align-items: flex-start; gap: 10px;">
                            <span style="background: #059669; color: #fff; width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0;">3</span>
                            <span>Konfirmasi <strong>"Install"</strong>, lalu ikon SFT akan langsung muncul di menu utama HP.</span>
                        </div>
                    </div>
                    `}

                    <button type="button" onclick="document.getElementById('modalPwaInstallGuide').style.display='none'" style="
                        width: 100%;
                        padding: 12px 16px;
                        background: linear-gradient(135deg, #cc1426, #991b1b);
                        color: #ffffff;
                        border: none;
                        border-radius: 12px;
                        font-size: 13px;
                        font-weight: 800;
                        cursor: pointer;
                        box-shadow: 0 4px 12px rgba(204, 20, 38, 0.3);
                    ">
                        Mengerti &amp; Tutup
                    </button>
                </div>
            </div>
        `;
        const div = document.createElement('div');
        div.innerHTML = modalHtml;
        document.body.appendChild(div);
    } else {
        modal.style.display = 'flex';
    }
}

// Global Trigger untuk dipanggil dari tombol mana pun di seluruh aplikasi
window.triggerPwaInstall = async function() {
    if (isAppInstalled()) {
        alert('Aplikasi SFT sudah terpasang di perangkat Anda.');
        return;
    }

    if (deferredPrompt) {
        try {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                const banner = document.getElementById('custom-install-container');
                if (banner) banner.remove();
                document.body.classList.remove('has-pwa-install');
            }
            deferredPrompt = null;
            updateAllPwaInstallButtons();
            return;
        } catch (err) {
            console.warn('[PWA] Prompt error, displaying guide modal fallback:', err);
        }
    }

    // Jika deferredPrompt belum/tidak tersedia (iOS Safari atau Android browser yang belum siap):
    showPwaInstallGuideModal();
};

// Sinkronisasi status tombol install di seluruh halaman
function updateAllPwaInstallButtons() {
    const installed = isAppInstalled();

    // 1. Tombol di Halaman Profil
    const btnProfil = document.getElementById('btnPwaInstallProfil');
    if (btnProfil) {
        if (installed) {
            btnProfil.innerHTML = '<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> Aplikasi SFT Terpasang';
            btnProfil.style.background = '#059669';
            btnProfil.style.opacity = '0.9';
            btnProfil.disabled = true;
        } else {
            btnProfil.innerHTML = '<i class="fa-solid fa-download" style="color: #ef4444;"></i> Install Aplikasi SFT (PWA)';
            btnProfil.disabled = false;
        }
    }

    // 2. Tombol di Sidebar Desktop
    const sidebarBtn = document.getElementById('sidebarPwaInstallBtn');
    if (sidebarBtn) {
        sidebarBtn.style.display = installed ? 'none' : 'flex';
    }
}

// Render floating install banner dinonaktifkan permanen per instruksi user agar tampilan iPhone & mobile bersih
function renderPwaBanner() {
    const installContainer = document.getElementById('custom-install-container');
    if (installContainer) installContainer.remove();
    document.body.classList.remove('has-pwa-install');
}

// Menangkap event sebelum prompt install dari browser (Chromium/Android)
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    updateAllPwaInstallButtons();
});

// Listener saat aplikasi berhasil diinstall
window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    const installContainer = document.getElementById('custom-install-container');
    if (installContainer) installContainer.remove();
    document.body.classList.remove('has-pwa-install');
    sessionStorage.setItem('pwaPromptDismissed', 'true');
    updateAllPwaInstallButtons();
});

// Inisialisasi awal saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
    // Pastikan tidak ada banner melayang atau tombol install di header / fitur modal
    const installContainer = document.getElementById('custom-install-container');
    if (installContainer) installContainer.remove();
    document.body.classList.remove('has-pwa-install');

    const headerPill = document.getElementById('pwaHeaderInstallPill');
    if (headerPill) headerPill.remove();

    const featureTile = document.getElementById('featureModalPwaItem');
    if (featureTile) featureTile.remove();

    updateAllPwaInstallButtons();
});
