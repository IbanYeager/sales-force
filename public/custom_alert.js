function injectCustomAlertCSS() {
    if (document.getElementById('premium-custom-alert-style')) return;
    
    const style = document.createElement('style');
    style.id = 'premium-custom-alert-style';
    style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .custom-alert-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(15, 23, 42, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            animation: alertFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
            padding: 20px;
            box-sizing: border-box;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }

        .custom-alert-box {
            background: #ffffff;
            width: 100%;
            max-width: 420px;
            border-radius: 28px;
            box-shadow: 0 30px 60px -12px rgba(15, 23, 42, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.9);
            overflow: hidden;
            transform: scale(0.85) translateY(20px);
            animation: alertModalSpring 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
            display: flex;
            flex-direction: column;
            text-align: center;
        }

        .custom-alert-header {
            padding: 32px 24px 24px 24px;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow: hidden;
        }

        .custom-alert-header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%);
            pointer-events: none;
        }

        .custom-alert-header.bg-info {
            background: linear-gradient(135deg, #0f172a 0%, #3b82f6 50%, #1e293b 100%);
            color: #ffffff;
        }

        .custom-alert-header.bg-success {
            background: linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%);
            color: #ffffff;
        }

        .custom-alert-header.bg-danger {
            background: linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #b91c1c 100%);
            color: #ffffff;
        }
        
        .custom-alert-header.bg-warning {
            background: linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #b45309 100%);
            color: #ffffff;
        }

        .custom-alert-icon {
            width: 72px;
            height: 72px;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(4px);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 20px;
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
            border: 2px solid rgba(255, 255, 255, 0.4);
            animation: iconPulse 2s infinite;
        }

        .custom-alert-icon svg {
            width: 40px;
            height: 40px;
        }

        .custom-alert-title {
            font-size: 24px;
            font-weight: 700;
            margin: 0;
            letter-spacing: -0.5px;
            line-height: 1.3;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .custom-alert-body {
            padding: 28px 32px;
            font-size: 16px;
            color: #334155;
            line-height: 1.6;
            max-height: 60vh;
            overflow-y: auto;
            text-align: center;
            background: #f8fafc;
            border-bottom: 1px solid #e2e8f0;
            font-weight: 500;
        }

        .custom-alert-footer {
            padding: 24px 32px;
            background: #ffffff;
            display: flex;
            justify-content: center;
        }

        .custom-alert-btn {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #ffffff;
            font-size: 16px;
            font-weight: 600;
            padding: 16px 42px;
            border-radius: 16px;
            border: none;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.5);
            width: 100%;
            max-width: 240px;
            letter-spacing: 0.3px;
        }

        .custom-alert-btn.btn-success {
            background: linear-gradient(135deg, #059669 0%, #047857 100%);
            box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.5);
        }

        .custom-alert-btn.btn-danger {
            background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
            box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.5);
        }
        
        .custom-alert-btn.btn-warning {
            background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
            box-shadow: 0 10px 25px -5px rgba(217, 119, 6, 0.5);
        }

        .custom-alert-btn:hover {
            transform: translateY(-3px) scale(1.02);
            filter: brightness(1.1);
            box-shadow: 0 15px 30px -5px rgba(0, 0, 0, 0.35);
        }

        .custom-alert-btn:active {
            transform: translateY(1px) scale(0.98);
        }

        @keyframes alertFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes alertModalSpring {
            0% { transform: scale(0.85) translateY(20px); opacity: 0; }
            100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes iconPulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 255, 255, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
    `;
    document.head.appendChild(style);
}

function showCustomAlert(title, text, type) {
    injectCustomAlertCSS();
    
    // Remove existing alert if any
    const existingAlert = document.getElementById('global-custom-alert-overlay');
    if (existingAlert) existingAlert.remove();
    
    let bgClass = 'bg-success';
    let btnClass = 'btn-success';
    let svgIcon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    
    if (type === 'error' || type === 'danger') {
        bgClass = 'bg-danger';
        btnClass = 'btn-danger';
        svgIcon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
    } else if (type === 'warning') {
        bgClass = 'bg-warning';
        btnClass = 'btn-warning';
        svgIcon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
    } else if (type === 'info') {
        bgClass = 'bg-info';
        btnClass = 'btn-info';
        svgIcon = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
    }

    const overlay = document.createElement('div');
    overlay.id = 'global-custom-alert-overlay';
    overlay.className = 'custom-alert-overlay';
    
    // Support newlines in text
    const textHtml = String(text).replace(/\\n/g, '<br>');
    
    overlay.innerHTML = `
        <div class="custom-alert-box" onclick="event.stopPropagation()">
            <div class="custom-alert-header ${bgClass}">
                <div class="custom-alert-icon">${svgIcon}</div>
                <h3 class="custom-alert-title">${title}</h3>
            </div>
            <div class="custom-alert-body">${textHtml}</div>
            <div class="custom-alert-footer">
                <button type="button" class="custom-alert-btn ${btnClass}" id="customAlertBtn">Mengerti</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Autofocus button
    const btn = overlay.querySelector('#customAlertBtn');
    if (btn) btn.focus();
    
    // Close function
    let isClosed = false;
    const closeAlert = () => {
        if (isClosed) return;
        isClosed = true;
        overlay.style.animation = 'none';
        overlay.style.opacity = '1';
        overlay.style.transition = 'opacity 0.15s ease';
        overlay.style.opacity = '0';
        setTimeout(() => overlay.remove(), 150);
    };
    
    overlay.onclick = closeAlert;
    if (btn) btn.onclick = closeAlert;
}

window.customConfirm = function(message) {
    return new Promise((resolve) => {
        injectCustomAlertCSS();
        
        const msgStr = String(message).replace(/\n/g, '<br>');
        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';
        
        const svgDanger = '<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';

        overlay.innerHTML = `
            <div class="custom-alert-box" onclick="event.stopPropagation()">
                <div class="custom-alert-header bg-warning">
                    <div class="custom-alert-icon">${svgDanger}</div>
                    <h3 class="custom-alert-title">Konfirmasi</h3>
                </div>
                <div class="custom-alert-body">${msgStr}</div>
                <div class="custom-alert-footer" style="display: flex; gap: 12px; justify-content: center;">
                    <button type="button" class="custom-alert-btn" style="background: #e2e8f0; color: #475569; box-shadow: none; border: 1px solid #cbd5e1;" id="customConfirmCancel">Batal</button>
                    <button type="button" class="custom-alert-btn btn-danger" id="customConfirmOk">Ya, Lanjutkan</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.classList.add('show');
            });
        });
        
        const btnOk = overlay.querySelector('#customConfirmOk');
        const btnCancel = overlay.querySelector('#customConfirmCancel');
        if (btnOk) btnOk.focus();

        let isClosed = false;
        const closeConfirm = (result) => {
            if (isClosed) return;
            isClosed = true;
            if (overlay.parentNode) {
                overlay.style.animation = 'none';
                overlay.style.opacity = '1';
                overlay.style.transition = 'opacity 0.15s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    resolve(result);
                }, 150);
            }
            document.removeEventListener('keydown', handleKey);
        };

        const handleKey = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                closeConfirm(true);
            } else if (e.key === 'Escape') {
                e.preventDefault();
                closeConfirm(false);
            }
        };

        document.addEventListener('keydown', handleKey);
        overlay.onclick = () => closeConfirm(false);
        if (btnCancel) btnCancel.onclick = () => closeConfirm(false);
        if (btnOk) btnOk.onclick = () => closeConfirm(true);
    });
};

window.hasCustomAlert = true;
window._originalAlert = window.alert;
window.alert = function(message, onClose) {
    const msgStr = String(message);
    let type = 'info';
    let title = 'Informasi';

    const lowerMsg = msgStr.toLowerCase();

    // Check if message is a raw PHP / database / XAMPP error stack trace
    if (lowerMsg.includes('sqlstate') || lowerMsg.includes('pdoexception') || lowerMsg.includes('fatal error') || lowerMsg.includes('stack trace') || lowerMsg.includes('warning:') || lowerMsg.includes('uncaught exception') || lowerMsg.includes('connection refused') || lowerMsg.includes('xampp')) {
        showCustomAlert('Koneksi Terganggu', 'Sistem belum dapat terhubung ke server data. Silakan muat ulang halaman atau hubungi administrator.', 'danger');
        if (typeof onClose === 'function') setTimeout(onClose, 200);
        return;
    }

    if (lowerMsg.includes('berhasil') || lowerMsg.includes('sukses') || lowerMsg.includes('terpilih') || lowerMsg.includes('siap disalin') || lowerMsg.includes('ditambahkan') || lowerMsg.includes('disimpan')) {
        type = 'success';
        title = 'Berhasil!';
    } else if (lowerMsg.includes('gagal') || lowerMsg.includes('wajib') || lowerMsg.includes('error') || lowerMsg.includes('maksimal') || lowerMsg.includes('kesalahan') || lowerMsg.includes('pilih dulu') || lowerMsg.includes('harap masukkan') || lowerMsg.includes('tidak boleh')) {
        type = 'danger';
        title = 'Perhatian!';
    } else if (lowerMsg.includes('yakin') || lowerMsg.includes('hapus') || lowerMsg.includes('peringatan')) {
        type = 'warning';
        title = 'Perhatian';
    }

    // Reuse the showCustomAlert function which already handles the UI beautifully
    showCustomAlert(title, msgStr, type);
    
    // onClose callback support (since some older code might pass it)
    if (typeof onClose === 'function') {
        const overlay = document.getElementById('global-custom-alert-overlay');
        if (overlay) {
            const btn = overlay.querySelector('#customAlertBtn');
            const oldClick = btn.onclick;
            const newClick = () => {
                if (oldClick) oldClick();
                setTimeout(onClose, 200);
            };
            btn.onclick = newClick;
            overlay.onclick = newClick;
        } else {
            setTimeout(onClose, 200);
        }
    }
};

/**
 * Global Executive Error State renderer for container data failures
 */
window.showErrorState = function(target, options = {}) {
    const el = typeof target === 'string' ? document.querySelector(target) : target;
    if (!el) return;

    const title = options.title || 'Informasi Belum Dapat Dimuat';
    const message = options.message || 'Sistem belum dapat memuat informasi saat ini. Pastikan koneksi server atau jaringan Anda aktif, lalu coba muat ulang.';
    const icon = options.icon || 'fa-solid fa-cloud-bolt';
    const buttonText = options.buttonText || 'Coba Muat Ulang';

    el.innerHTML = `
        <div class="custom-error-state-card" style="
            background: #ffffff;
            border-radius: 20px;
            padding: 36px 24px;
            text-align: center;
            border: 1px solid #e2e8f0;
            box-shadow: 0 10px 30px rgba(13, 27, 62, 0.05);
            max-width: 500px;
            margin: 30px auto;
            box-sizing: border-box;
        ">
            <div style="
                width: 60px;
                height: 60px;
                background: rgba(225, 29, 72, 0.08);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px auto;
                color: #e11d48;
                font-size: 24px;
            ">
                <i class="${icon}"></i>
            </div>
            <h3 style="
                color: #0f172a;
                font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
                font-size: 18px;
                font-weight: 700;
                margin: 0 0 8px 0;
            ">${title}</h3>
            <p style="
                color: #64748b;
                font-family: 'Plus Jakarta Sans', 'Poppins', sans-serif;
                font-size: 13px;
                line-height: 1.6;
                margin: 0 0 22px 0;
            ">${message}</p>
            <div style="display:flex; justify-content:center; gap:12px;">
                <button onclick="window.location.reload()" style="
                    background: linear-gradient(135deg, #0d1b3e 0%, #16305f 100%);
                    color: #ffffff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 14px rgba(13, 27, 62, 0.15);
                ">
                    <i class="fa-solid fa-rotate-right"></i> ${buttonText}
                </button>
            </div>
        </div>
    `;
};

// ── Clean Address Bar .html Extension Remover ──────────────────────────
(function initCleanHtmlRemover() {
    try {
        const path = window.location.pathname;
        if (path.endsWith('.html')) {
            const cleanPath = path.replace(/\.html$/, '');
            window.history.replaceState(null, document.title, cleanPath + window.location.search + window.location.hash);
        }
    } catch (e) {}
})();

