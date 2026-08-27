// script.js

// ==========================================
// 0. CUSTOM ALERT MODAL OVERRIDE (PREMIUM UI)
// ==========================================
(function() {
    if (window.hasCustomAlert) return;
    window.hasCustomAlert = true;

    const style = document.createElement('style');
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

        /* Subtle glowing background accent in header */
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

        .custom-alert-body::-webkit-scrollbar { width: 6px; }
        .custom-alert-body::-webkit-scrollbar-track { background: #f1f5f9; }
        .custom-alert-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
    `;
    document.head.appendChild(style);

    const icons = {
        success: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        danger: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
        info: `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    window._originalAlert = window.alert;
    window.alert = function(message, onClose) {
        const msgStr = String(message);
        const msgHtml = msgStr.replace(/\n/g, '<br>');

        let type = 'info';
        let title = 'Informasi';
        let btnClass = 'btn-info';

        const lowerMsg = msgStr.toLowerCase();
        if (lowerMsg.includes('berhasil') || lowerMsg.includes('sukses') || lowerMsg.includes('terpilih') || lowerMsg.includes('siap disalin') || lowerMsg.includes('ditambahkan') || lowerMsg.includes('disimpan')) {
            type = 'success';
            title = 'Berhasil!';
            btnClass = 'btn-success';
        } else if (lowerMsg.includes('gagal') || lowerMsg.includes('wajib') || lowerMsg.includes('error') || lowerMsg.includes('maksimal') || lowerMsg.includes('kesalahan') || lowerMsg.includes('pilih dulu') || lowerMsg.includes('harap masukkan') || lowerMsg.includes('tidak boleh')) {
            type = 'danger';
            title = 'Perhatian!';
            btnClass = 'btn-danger';
        }

        const overlay = document.createElement('div');
        overlay.className = 'custom-alert-overlay';

        overlay.innerHTML = `
            <div class="custom-alert-box" onclick="event.stopPropagation()">
                <div class="custom-alert-header bg-${type}">
                    <div class="custom-alert-icon">${icons[type]}</div>
                    <h3 class="custom-alert-title">${title}</h3>
                </div>
                <div class="custom-alert-body">${msgHtml}</div>
                <div class="custom-alert-footer">
                    <button type="button" class="custom-alert-btn ${btnClass}" id="customAlertBtn">Mengerti</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const btn = overlay.querySelector('#customAlertBtn');
        if (btn) btn.focus();

        let isClosed = false;
        const closeAlert = () => {
            if (isClosed) return;
            isClosed = true;
            if (overlay.parentNode) {
                overlay.style.animation = 'none';
                overlay.style.opacity = '1';
                overlay.style.transition = 'opacity 0.15s ease';
                overlay.style.opacity = '0';
                setTimeout(() => {
                    if (overlay.parentNode) document.body.removeChild(overlay);
                    if (typeof onClose === 'function') onClose();
                }, 150);
            }
            document.removeEventListener('keydown', handleKey);
        };

        const handleKey = (e) => {
            if (e.key === 'Enter' || e.key === 'Escape') {
                e.preventDefault();
                closeAlert();
            }
        };

        document.addEventListener('keydown', handleKey);
        overlay.onclick = closeAlert;
        if (btn) btn.onclick = closeAlert;
    };

    window.customConfirm = function(message) {
        return new Promise((resolve) => {
            const msgStr = String(message).replace(/\n/g, '<br>');
            const overlay = document.createElement('div');
            overlay.className = 'custom-alert-overlay';

            overlay.innerHTML = `
                <div class="custom-alert-box" onclick="event.stopPropagation()">
                    <div class="custom-alert-header bg-warning">
                        <div class="custom-alert-icon">${icons['danger']}</div>
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

    // Global Swal fallback/adapter
    if (typeof window.Swal === 'undefined') {
        window.Swal = {
            fire: function(opts) {
                let msg = '';
                let title = '';
                if (typeof opts === 'string') {
                    msg = opts;
                } else if (opts && typeof opts === 'object') {
                    title = opts.title || '';
                    msg = opts.text || opts.html || opts.title || '';
                    if (title && msg && title !== msg) {
                        msg = `<strong>${title}</strong><br>${msg}`;
                    }
                }
                if (window.showCustomAlert) {
                    window.showCustomAlert(msg, (opts && opts.icon) || 'info');
                } else {
                    alert(typeof opts === 'object' ? (opts.text || opts.title || 'Informasi') : opts);
                }
                return Promise.resolve({ isConfirmed: true, value: true });
            }
        };
    }
})();
// ==========================================
// 1. STATE GLOBAL & FITUR UMUM (KAMERA / AKTIVITAS)
// ==========================================
let arrayFoto = [];

function handleFileSelect(event) {
    const files = event.target.files;
    const previewContainer = document.getElementById('photoPreview');
    if (!previewContainer) return;

    if (arrayFoto.length + files.length > 5) {
        alert("Maksimal 5 foto saja.");
        return;
    }

    let loadedCount = 0;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const base64Image = e.target.result;
            arrayFoto.push(base64Image);

            if (arrayFoto.length === 1) {
                previewContainer.innerHTML = '';
            }

            const img = document.createElement('img');
            img.src = base64Image;
            img.style.width = '70px';
            img.style.height = '70px';
            img.style.objectFit = 'cover';
            img.style.borderRadius = '8px';
            previewContainer.appendChild(img);

            loadedCount++;
            if (loadedCount === files.length) {
                alert("Foto berhasil ditambahkan! (Total: " + arrayFoto.length + "/5 foto)");
            }
        };
        reader.readAsDataURL(file);
    }
}

function getLocation() {
    alert("Mengambil titik kordinat GPS Anda saat ini...");
}

function simpanData() {
    const form = document.getElementById('formAktivitas');
    const jenisEl = document.getElementById('jenisAktivitas');
    const keteranganEl = document.getElementById('keteranganAktivitas');
    const lokasiEl = document.querySelector('#lokasiValue p');

    const jenis = jenisEl ? jenisEl.value : '';
    const keterangan = keteranganEl ? keteranganEl.value : '';
    const lokasi = lokasiEl ? lokasiEl.innerText : '';

    if (form && form.checkValidity() && arrayFoto.length > 0) {
        const existingActivities = JSON.parse(localStorage.getItem('userActivities') || '[]');

        const newActivity = {
            id: Date.now(),
            jenis: jenis,
            keterangan: keterangan,
            lokasi: lokasi,
            foto: arrayFoto[0],
            waktu: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Selesai'
        };

        existingActivities.unshift(newActivity);
        localStorage.setItem('userActivities', JSON.stringify(existingActivities));

        alert("Aktivitas berhasil disimpan dan dikirim ke Supervisor!", function() {
            window.location.href = "../";
        });
    } else {
        alert("Mohon lengkapi semua field (*) dan tambahkan minimal 1 foto.");
    }
}

// ==========================================
// 2. KONTROL TAMPILAN MODAL / INTERAKSI UTAMA
// ==========================================
function toggleMenuUtama(e) {
    if (e && e.preventDefault) e.preventDefault();
    const full = document.getElementById('menuUtamaFull');
    if (!full) return;
    full.classList.toggle('hidden');
}

function openFeatureModal(event) {
    if (event) event.preventDefault();
    const modal = document.getElementById('featureModal');
    if (modal) modal.classList.add('show');
}

function closeFeatureModal() {
    const modal = document.getElementById('featureModal');
    if (modal) modal.classList.remove('show');
}

function openModal(modalId, event) {
    if (event) event.preventDefault();
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('show');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('show');
}

// Menutup modal saat klik di luar area card (area overlay yang gelap)
window.onclick = function (event) {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    });
}

// Interaksi modern: close modal/bottom-sheet dengan tombol ESC
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const activeModal = document.querySelector('.modal-overlay.show');
    if (activeModal) activeModal.classList.remove('show');

    const promoModal = document.getElementById('customPromoModal');
    if (promoModal && promoModal.classList.contains('show-modal')) {
        promoModal.classList.remove('show-modal');
    }
});

function renderAktivitasTerakhir() {
    const container = document.getElementById('latestActivities');
    if (!container) return;

    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');

    if (activities.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Belum ada aktivitas.</p>';
        return;
    }

    container.innerHTML = activities.map(act => `
        <div class="activity-card">
            <img src="${act.foto}" alt="Aktivitas" class="activity-img">
            <div class="activity-details">
                <div class="activity-header">
                    <span class="activity-type">
                        <span class="dot-green"></span> ${act.jenis.charAt(0).toUpperCase() + act.jenis.slice(1)}
                    </span>
                    <span class="badge-status status-selesai">${act.status}</span>
                </div>
                <p class="activity-desc">${act.keterangan}</p>
                <div class="activity-footer">
                    <span class="activity-time"><i class="far fa-clock"></i> ${act.waktu}</span>
                    <span class="activity-time"><i class="fas fa-map-marker-alt"></i> ${act.lokasi}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================
// 3. FITUR PROMO & PENCARIAN
// ==========================================
let seluruhDataPaket = [];

const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka || 0);
};

function sharePromo(carName, packageName, tdp) {
    const message = `Halo Bapak/Ibu! Kami sedang ada promo menarik:\n\n` +
        `🚗 Model: ${carName}\n` +
        `🎁 Promo: ${packageName}\n` +
        `💰 Total Bayar Pertama (TDP): ${tdp}\n\n` +
        `Silakan balas pesan ini jika Bapak/Ibu tertarik untuk informasi lebih lanjut!`;

    alert("Teks ini sudah siap disalin/dikirim ke WhatsApp Customer:\n\n" + message);
}

async function ambilDataPromo() {
    const container = document.getElementById('promo-container');
    if (!container) return;

    try {
        const response = await fetch('../api/api_promo.php');
        const result = await response.json();

        if (result.ok === false) {
            container.innerHTML = `
                <div class="promo-empty promo-error">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <p>${result.message}</p>
                </div>`;
            return;
        }

        seluruhDataPaket = result;
        tampilkanPaket(seluruhDataPaket);
        populateFilterDropdown(seluruhDataPaket);
    } catch (error) {
        console.error('Error fetching data:', error);
        container.innerHTML = `
            <div class="promo-empty promo-error">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>Gagal terhubung ke server/database. Coba muat ulang halaman.</p>
            </div>`;
    }
}

function populateFilterDropdown(daftarPaket) {
    const filterSelect = document.getElementById('filter-paket');
    if (!filterSelect) return;

    const uniquePaketNames = [...new Set(daftarPaket.map(p => p.nama_paket).filter(n => n))];

    const firstOption = filterSelect.options[0];
    filterSelect.innerHTML = '';
    filterSelect.appendChild(firstOption);

    uniquePaketNames.sort().forEach(nama => {
        const option = document.createElement('option');
        option.value = nama.toLowerCase().trim();
        option.textContent = nama;
        filterSelect.appendChild(option);
    });
}

function tampilkanPaket(daftarPaket) {
    const container = document.getElementById('promo-container');
    const totalData = document.getElementById('total-data');
    if (!container) return;

    totalData.innerText = `${daftarPaket.length} paket ditemukan`;
    container.innerHTML = '';

    if (daftarPaket.length === 0) {
        container.innerHTML = `
            <div class="promo-empty">
                <i class="fa-solid fa-box-open"></i>
                <p>Tidak ada paket yang cocok. Coba ubah kata kunci atau filter.</p>
            </div>`;
        return;
    }

    const grupPaket = {};
    daftarPaket.forEach(paket => {
        const namaPaket = paket.nama_paket || 'Paket Lainnya';
        if (!grupPaket[namaPaket]) {
            grupPaket[namaPaket] = [];
        }
        grupPaket[namaPaket].push(paket);
    });

    const namaPaketUrut = Object.keys(grupPaket).sort();

    namaPaketUrut.forEach((namaPaket, index) => {
        const paketList = grupPaket[namaPaket];
        const groupId = `promo-group-${index}`;
        const isOpen = index === 0;

        const cardsHTML = paketList.map(paket => {
            const skemaBadge = paket.skema
                ? `<span class="promo-badge">${paket.skema}</span>`
                : '';

            return `
                <div class="promo-card">
                    <div class="promo-card-top">
                        <span class="promo-car-name"><i class="fa-solid fa-car-side"></i> ${paket.tipe_mobil}</span>
                        ${skemaBadge}
                    </div>
                    <span class="promo-price-label">Angsuran / bulan</span>
                    <div class="promo-price-main">${formatRupiah(paket.angsuran)}</div>
                    <div class="promo-price-sub">TDP <b>${formatRupiah(paket.tdp)}</b> &middot; Tenor <b>${paket.tenor} bln</b></div>
                    <button type="button" class="btn-outline-blue promo-share-btn" onclick="sharePromo('${paket.tipe_mobil}', '${paket.nama_paket}', '${formatRupiah(paket.tdp)}')">
                        <i class="fa-brands fa-whatsapp"></i> Bagikan Info
                    </button>
                </div>`;
        }).join('');

        const groupHTML = `
            <div class="promo-group">
                <button type="button" class="promo-group-header" onclick="toggleGroup('${groupId}')">
                    <span class="promo-group-title">
                        <i class="fa-solid fa-tags"></i> ${namaPaket}
                        <span class="promo-group-count">${paketList.length}</span>
                    </span>
                    <i class="fa-solid fa-chevron-down promo-group-chevron${isOpen ? ' rotated' : ''}" id="chevron-${groupId}"></i>
                </button>
                <div class="promo-group-body${isOpen ? ' open' : ''}" id="${groupId}">
                    ${cardsHTML}
                </div>
            </div>`;

        container.insertAdjacentHTML('beforeend', groupHTML);
    });
}

function toggleGroup(groupId) {
    const body = document.getElementById(groupId);
    const chevron = document.getElementById(`chevron-${groupId}`);
    if (!body) return;
    body.classList.toggle('open');
    if (chevron) chevron.classList.toggle('rotated');
}

function saringDataPromo() {
    const searchInput = document.getElementById('search-mobil');
    const filterInput = document.getElementById('filter-paket');
    const resetBtn = document.getElementById('reset-filter-btn');
    if (!searchInput || !filterInput) return;

    const kataKunci = searchInput.value.toLowerCase().trim();
    const tipeFilter = filterInput.value.toLowerCase().trim();

    const dataTersaring = seluruhDataPaket.filter(paket => {
        const mobil = paket.tipe_mobil ? paket.tipe_mobil.toLowerCase() : '';
        const nama = paket.nama_paket ? paket.nama_paket.toLowerCase().trim() : '';

        const cocokMobil = kataKunci === "" || mobil.includes(kataKunci);
        const cocokPaket = tipeFilter === "" || nama === tipeFilter;

        return cocokMobil && cocokPaket;
    });

    if (resetBtn) {
        resetBtn.style.display = (kataKunci || tipeFilter) ? 'flex' : 'none';
    }

    tampilkanPaket(dataTersaring);
}

function resetFilterPromo() {
    const searchInput = document.getElementById('search-mobil');
    const filterInput = document.getElementById('filter-paket');
    if (searchInput) searchInput.value = '';
    if (filterInput) filterInput.value = '';
    saringDataPromo();
}

// ==========================================
// 4. INISIALISASI AKTIVITAS HALAMAN (ONLOAD)
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function () {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });

    if (document.getElementById('latestActivities')) {
        renderAktivitasTerakhir();
    }

    if (document.getElementById('promo-container')) {
        ambilDataPromo();
        document.getElementById('search-mobil').addEventListener('input', saringDataPromo);
        document.getElementById('filter-paket').addEventListener('change', saringDataPromo);
    }

    // Leaderboard render logic
    if (document.getElementById('leaderboardList')) {
        renderLeaderboard();
    }
});

function renderLeaderboard() {
    const leaderboardList = document.getElementById('leaderboardList');
    if (!leaderboardList) return;
    const modeSelect = document.getElementById('leaderboardMode');
    const mode = modeSelect ? modeSelect.value : 'all';
    const idSales = localStorage.getItem('namaSales') || localStorage.getItem('idSales') || localStorage.getItem('salesId') || 'egy';

    fetch(`api/api_leaderboard.php?mode=${mode}&sales_account_id=${encodeURIComponent(idSales)}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success' && res.data && res.data.length > 0) {
                let html = '';
                const rankStyles = [
                    { bg: 'linear-gradient(135deg, #fef3c7, #fde68a)', color: '#92400e', icon: '🥇' },
                    { bg: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)', color: '#475569', icon: '🥈' },
                    { bg: 'linear-gradient(135deg, #fef3e2, #fed7aa)', color: '#9a3412', icon: '🥉' }
                ];
                
                res.data.slice(0, 3).forEach((sales, index) => {
                    const rs = rankStyles[index] || { bg: '#f8fafc', color: 'var(--text-muted)', icon: `${index+1}` };
                    const spvText = sales.nama_spv ? ` • ${sales.nama_spv}` : '';
                    html += `
                        <div style="display:flex; justify-content:space-between; align-items:center; padding:11px 12px; background:#fafbfd; border-radius:14px; border:1px solid var(--border-color); transition:all 0.2s ease;">
                            <div style="display:flex; align-items:center; gap:10px;">
                                <div style="width:28px; height:28px; border-radius:9px; background:${rs.bg}; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">${rs.icon}</div>
                                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(sales.avatar || sales.nama)}&background=eef2f7&color=0c2340&bold=true&size=80" style="width:34px; height:34px; border-radius:10px; object-fit:cover; flex-shrink:0;">
                                <div style="min-width:0;">
                                    <div style="font-size:13px; font-weight:700; color:var(--text-dark); letter-spacing:-0.2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sales.nama}</div>
                                    <div style="font-size:10px; color:var(--text-muted); font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${sales.tingkatan || 'Executive'}${spvText}</div>
                                </div>
                            </div>
                            <div style="text-align:right; flex-shrink:0; padding-left:8px;">
                                <div style="font-size:18px; font-weight:900; color:var(--primary-blue); letter-spacing:-0.5px; line-height:1;">${sales.do_count}</div>
                                <div style="font-size:9px; font-weight:700; color:var(--text-light); text-transform:uppercase; letter-spacing:0.5px;">DO</div>
                            </div>
                        </div>
                    `;
                });
                leaderboardList.innerHTML = html;
            } else {
                leaderboardList.innerHTML = '<div style="text-align:center; padding:20px 10px;"><i class="fa-regular fa-chart-bar" style="font-size:20px; color:var(--text-light); margin-bottom:6px; display:block;"></i><p style="font-size:12px; color:var(--text-muted); margin:0; font-weight:600;">Belum ada DO bulan ini</p></div>';
            }
        })
        .catch(err => {
            console.error("Error loading leaderboard:", err);
            leaderboardList.innerHTML = '<p style="font-size:12px; color:var(--primary-red); text-align:center;">Gagal memuat data peringkat</p>';
        });
}

// ==========================================
// SERVICE WORKER UNREGISTRATION (Menghapus PWA)
// ==========================================
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}