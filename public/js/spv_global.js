// spv_global.js - Global background polling, notification sound, and mobile drawer for all SPV pages

// ── Global SPV Logout Function ──────────────────────────
function logoutUser() {
    try {
        localStorage.clear();
        sessionStorage.clear();
    } catch (e) {
        console.error('Logout error', e);
    }
    window.location.replace('/pages/login_spv');
}
window.logoutUser = logoutUser;

// ── Global SPV Access Guard ─────────────────────────────
(function enforceSpvGuard() {
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const peran = localStorage.getItem('peranSales');
    if (!loggedIn) {
        window.location.replace('/pages/login_spv');
        return;
    }
    if (peran === 'Kepala Cabang' || peran === 'Kacab') {
        window.location.replace('/pages_kacab/index_kacab');
        return;
    }
    if (peran !== 'Supervisor' && peran !== 'SPV') {
        window.location.replace('/index');
        return;
    }
})();

// ── Global SPV User Renderer (Consistent Topbar Profile) ──
function renderSpvUser() {
    let nama = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Pak Ryan';
    const peran = localStorage.getItem('peranSales') || 'Supervisor';
    const foto = localStorage.getItem('fotoSales');

    if (!nama || nama === 'Supervisor' || nama === 'Supervisor Tunas') {
        nama = 'Pak Ryan';
        localStorage.setItem('namaSales', 'Pak Ryan');
    }

    const namaEls = document.querySelectorAll('#spvNama, #kcbNama, .spv-user .name, .spv-topbar .name, .meta .name');
    namaEls.forEach(el => {
        if (el) el.textContent = nama;
    });

    const roleEls = document.querySelectorAll('#spvRole, #kcbRole, .spv-user .role, .spv-topbar .role, .meta .role');
    roleEls.forEach(el => {
        if (el) el.textContent = peran;
    });

    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=0D1B3E&color=ffffff&bold=true`;

    const avatarEls = document.querySelectorAll('#spvAvatar, #kcbAvatar, #mhAvatar, .spv-user img, .spv-topbar img, .avatar-status img');
    avatarEls.forEach(img => {
        if (img) {
            img.src = (foto && foto.trim() !== '') ? foto : defaultAvatar;
            img.onerror = function() { this.src = defaultAvatar; };
        }
    });

    const sidebarBrandRole = document.querySelector('.spv-brand .role, .sidebar-brand .role');
    if (sidebarBrandRole) sidebarBrandRole.textContent = `Supervisor - ${nama}`;
}

renderSpvUser();
document.addEventListener('DOMContentLoaded', renderSpvUser);
window.addEventListener('pageshow', renderSpvUser);

// ── Mobile Header + Drawer Navigation ──────────────────
// Diinjeksi lewat JS supaya semua halaman SPV langsung kebagian
// tanpa harus mengedit tiap file HTML.
if (typeof window.spvDrawerInit === 'undefined') {
    window.spvDrawerInit = true;

    document.addEventListener('DOMContentLoaded', () => {
        const sidebar = document.querySelector('.spv-sidebar');
        if (!sidebar) return;

        // Judul halaman diambil dari topbar
        const pageTitle = document.getElementById('pageTitle');
        const titleText = pageTitle ? pageTitle.textContent.trim() : 'SPV Panel';

        // Header mobile
        const header = document.createElement('header');
        header.className = 'mobile-header';
        header.innerHTML = `
            <button class="mh-burger" id="mhBurger" aria-label="Buka menu navigasi" aria-expanded="false">
                <i class="fa-solid fa-bars"></i>
                <span class="mh-dot" id="mhPendingDot"></span>
            </button>
            <span class="mh-title">${titleText}</span>
            <img class="mh-avatar" id="mhAvatar" src="" alt="Avatar">
        `;
        document.body.prepend(header);

        // Backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'drawer-backdrop';
        backdrop.id = 'drawerBackdrop';
        document.body.appendChild(backdrop);

        // Avatar di header mobile (sumber sama dengan topbar)
        const nama = localStorage.getItem('namaSales') || 'SPV';
        const foto = localStorage.getItem('fotoSales');
        const mhAvatar = document.getElementById('mhAvatar');
        mhAvatar.src = (foto && foto.trim() !== '')
            ? foto
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=1c2740&color=ffffff`;

        const burger = document.getElementById('mhBurger');

        function openDrawer() {
            document.body.classList.add('drawer-open');
            burger.setAttribute('aria-expanded', 'true');
            burger.querySelector('i').className = 'fa-solid fa-xmark';
            requestAnimationFrame(() => backdrop.classList.add('show'));
        }

        function closeDrawer() {
            document.body.classList.remove('drawer-open');
            burger.setAttribute('aria-expanded', 'false');
            burger.querySelector('i').className = 'fa-solid fa-bars';
            backdrop.classList.remove('show');
        }

        window.closeSpvDrawer = closeDrawer;

        burger.addEventListener('click', () => {
            if (document.body.classList.contains('drawer-open')) closeDrawer();
            else openDrawer();
        });

        backdrop.addEventListener('click', closeDrawer);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeDrawer();
        });

        // Tutup drawer saat link nav diklik (navigasi halaman)
        sidebar.querySelectorAll('.spv-nav a').forEach(a => {
            a.addEventListener('click', closeDrawer);
        });

        // Kembali ke desktop → pastikan drawer tertutup
        window.addEventListener('resize', () => {
            if (window.innerWidth > 900) closeDrawer();
        });

        // ── Auto Highlight Active Menu Link (Supports Clean URLs) ────────────────────
        const curPath = window.location.pathname;
        let curFile = curPath.split('/').pop().split('?')[0].split('#')[0] || 'index_spv';
        curFile = curFile.replace('.html', '');
        if (!curFile || curFile === 'index') curFile = 'index_spv';

        const navLinks = sidebar.querySelectorAll('.spv-nav a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href) {
                let targetFile = href.split('/').pop().split('?')[0].split('#')[0].replace('.html', '');
                if (curFile === targetFile || (curFile === 'index_spv' && (targetFile === 'index_spv' || targetFile === 'index'))) {
                    link.classList.add('active');
                }
            }
        });
    });
}

// ── Visual Notification Toast ──────────────────────────
if (typeof window.showToastNotification === 'undefined') {
    window.showToastNotification = function(msg) {
        let toastContainer = document.getElementById('toast-container-global');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container-global';
            toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
            document.body.appendChild(toastContainer);
        }
        const toast = document.createElement('div');
        toast.style.cssText = 'background:#1e293b;color:#fff;padding:16px 24px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);font-family:Inter,sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;gap:12px;opacity:0;transform:translateY(-20px);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);pointer-events:auto;border-left:4px solid #ef4444;';
        toast.innerHTML = `<i class="fa-solid fa-bell" style="color:#ef4444;font-size:18px;"></i> <span>${msg}</span>`;
        toastContainer.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-20px)';
            setTimeout(() => toast.remove(), 400);
        }, 5000);
    };
}

// ── Audio Notification Function (Ding-Dong) ────────────
if (typeof window.sharedAudioCtx === 'undefined') {
    window.sharedAudioCtx = null;
    function initAudio() {
        if (!window.sharedAudioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) window.sharedAudioCtx = new AudioContext();
        }
    }
    
    document.addEventListener('click', () => {
        initAudio();
        if (window.sharedAudioCtx && window.sharedAudioCtx.state === 'suspended') {
            window.sharedAudioCtx.resume();
        }
    }, { once: true });
}

if (typeof window.playNotificationSound === 'undefined') {
    window.playNotificationSound = function() {
        try {
            if (typeof initAudio === 'function') initAudio();
            const ctx = window.sharedAudioCtx;
            if (!ctx) return;
            if (ctx.state === 'suspended') ctx.resume();
            
            function playTone(freq, type, startTime, duration, vol) {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, startTime);
                
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
                
                osc.connect(gain);
                gain.connect(ctx.destination);
                
                osc.start(startTime);
                osc.stop(startTime + duration);
            }
            
            const t = ctx.currentTime;
            playTone(1318.51, 'sine', t, 0.4, 0.8);
            playTone(1318.51, 'triangle', t, 0.4, 0.3);
            playTone(1046.50, 'sine', t + 0.3, 0.6, 0.8);
            playTone(1046.50, 'triangle', t + 0.3, 0.6, 0.3);
        } catch(e) {
            console.error("Audio error", e);
        }
    };
}

// ── Background Polling for SPV ─────────────────────────
if (typeof window.isFirstLoadSpvGlobal === 'undefined') {
    window.isFirstLoadSpvGlobal = true;
    function restoreSavedBadges() {
        const savedApproval = localStorage.getItem('spvApprovalBadgeCount');
        const savedAktivitas = localStorage.getItem('spvAktivitasBadgeCount');

        const navBadge = document.getElementById('navApprovalBadge');
        const quickBadge = document.getElementById('quickApprovalBadge');
        const mhDot = document.getElementById('mhPendingDot');
        const navAktBadge = document.getElementById('navAktivitasBadge');

        if (savedApproval !== null && parseInt(savedApproval, 10) > 0) {
            const count = parseInt(savedApproval, 10);
            if (navBadge) { navBadge.textContent = count; navBadge.style.display = 'inline-flex'; }
            if (quickBadge) { quickBadge.textContent = count; quickBadge.style.display = 'inline-flex'; }
            if (mhDot) mhDot.style.display = 'block';
        }

        if (savedAktivitas !== null && parseInt(savedAktivitas, 10) > 0) {
            const count = parseInt(savedAktivitas, 10);
            if (navAktBadge) { navAktBadge.textContent = count > 99 ? '99+' : count; navAktBadge.style.display = 'inline-flex'; }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            restoreSavedBadges();
            const dashPendingEl = document.getElementById('dashPending');
            if (dashPendingEl) {
                const currentText = dashPendingEl.textContent;
                if (currentText !== '0' && currentText !== 'Memuat...') {
                    window.lastSpvGlobalPendingCount = parseInt(currentText, 10) || 0;
                }
            }
        });
    } else {
        restoreSavedBadges();
    }

    async function checkPendingApprovalsGlobal() {
        const spv = localStorage.getItem('namaSales') || '';
        let currentPending = 0;
        let fetchSuccess = false;
        
        try {
            const spkRes = await fetch(`../api/api_spk.php?spv=${encodeURIComponent(spv)}`);
            const spkJson = await spkRes.json();
            if (spkJson.status === 'success' && Array.isArray(spkJson.data)) {
                currentPending += spkJson.data.filter(s => s.status === 'Menunggu').length;
                fetchSuccess = true;
            }

            const olxRes = await fetch(`../api/api_olx.php?spv=${encodeURIComponent(spv)}`);
            const olxJson = await olxRes.json();
            if (olxJson.status === 'success' && Array.isArray(olxJson.data)) {
                currentPending += olxJson.data.filter(o => o.status === 'Pending').length;
            }

            const tdRes = await fetch(`../api/api_spv_approval_testdrive.php`);
            const tdJson = await tdRes.json();
            if (tdJson.status === 'success' && Array.isArray(tdJson.data)) {
                currentPending += tdJson.data.filter(t => t.status === 'Menunggu' || t.status === 'Pending').length;
            }
            
            if (fetchSuccess) {
                localStorage.setItem('spvApprovalBadgeCount', currentPending);
                
                if (!window.isFirstLoadSpvGlobal) {
                    if (currentPending !== window.lastSpvGlobalPendingCount) {
                        if (currentPending > window.lastSpvGlobalPendingCount) {
                            if (window.playNotificationSound) window.playNotificationSound();
                            if (window.showToastNotification) window.showToastNotification("Terdapat pengajuan persetujuan baru dari tim Anda.");
                        }
                        
                        // Data changed behind the scenes, trigger auto-refresh for any open SPV page!
                        if (typeof window.fetchData === 'function') window.fetchData(); 
                        if (typeof window.loadPendingApprovals === 'function') window.loadPendingApprovals(); 
                        if (typeof window.loadMonitoringBoard === 'function') window.loadMonitoringBoard(); 
                        if (typeof window.loadWiraniaga === 'function') window.loadWiraniaga(); 
                        if (typeof window.loadActivities === 'function') window.loadActivities(); 
                    }
                }
                
                window.lastSpvGlobalPendingCount = currentPending;
                window.isFirstLoadSpvGlobal = false;
                
                const dashPendingEl = document.getElementById('dashPending');
                if (dashPendingEl) dashPendingEl.textContent = currentPending;
                
                const navBadge = document.getElementById('navApprovalBadge');
                const quickBadge = document.getElementById('quickApprovalBadge');
                const mhDot = document.getElementById('mhPendingDot');
                if (currentPending > 0) {
                    if (navBadge) { navBadge.textContent = currentPending; navBadge.style.display = 'inline-flex'; }
                    if (quickBadge) { quickBadge.textContent = currentPending; quickBadge.style.display = 'inline-flex'; }
                    if (mhDot) mhDot.style.display = 'block';
                } else {
                    if (navBadge) navBadge.style.display = 'none';
                    if (quickBadge) quickBadge.style.display = 'none';
                    if (mhDot) mhDot.style.display = 'none';
                }
            }

            // Polling Aktivitas Tim untuk navAktivitasBadge
            try {
                const aktRes = await fetch(`../api/api_aktivitas.php?limit=20`);
                const aktJson = await aktRes.json();
                if (aktJson.status === 'success' && Array.isArray(aktJson.data)) {
                    const countAkt = aktJson.data.length;
                    localStorage.setItem('spvAktivitasBadgeCount', countAkt);
                    const navAktBadge = document.getElementById('navAktivitasBadge');
                    if (navAktBadge) {
                        if (countAkt > 0) {
                            navAktBadge.textContent = countAkt > 99 ? '99+' : countAkt;
                            navAktBadge.style.display = 'inline-flex';
                        } else {
                            navAktBadge.style.display = 'none';
                        }
                    }
                }
            } catch(aktErr) { }

        } catch (e) {
            console.error("Global polling error", e);
        }
    }

    // Jalankan pemulihan instan & polling background
    restoreSavedBadges();
    checkPendingApprovalsGlobal();
    setInterval(checkPendingApprovalsGlobal, 10000);
}
