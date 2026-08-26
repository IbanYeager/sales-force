document.addEventListener('DOMContentLoaded', () => {
    // 1. Cek apakah user sudah login
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    if (!loggedIn) {
        window.location.href = 'pages/login.html';
        return;
    }

    // 2. Redirect jika bukan akun Sales Consultant
    const peran = localStorage.getItem('peranSales');
    if (peran === 'Supervisor') {
        window.location.href = 'pages_spv/index_spv.html';
        return;
    }
    if (peran === 'Kepala Cabang') {
        window.location.href = 'pages_kacab/index_kacab.html';
        return;
    }

    const idSales = localStorage.getItem('namaSales') || localStorage.getItem('idSales') || localStorage.getItem('salesId') || 'egy';

    // ── Populate Desktop Sidebar User Info ──────────────
    const namaSalesLocal = localStorage.getItem('namaSales') || 'Sales';
    const cabangSalesLocal = localStorage.getItem('cabangSales') || '';
    const roleSalesLocal = localStorage.getItem('peranSales') || 'Sales';
    const sidebarNamaEl = document.getElementById('sidebarNama');
    const sidebarRoleEl = document.getElementById('sidebarRole');
    const sidebarAvatarEl = document.getElementById('sidebarAvatar');
    if (sidebarNamaEl) sidebarNamaEl.textContent = namaSalesLocal;
    if (sidebarRoleEl) sidebarRoleEl.textContent = cabangSalesLocal ? `${roleSalesLocal} · ${cabangSalesLocal}` : roleSalesLocal;
    if (sidebarAvatarEl) {
        const initials = namaSalesLocal.split(' ').slice(0, 2).map(w => w[0]).join('');
        sidebarAvatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || namaSalesLocal)}&background=f4f7f6&color=c8102e&bold=true`;
    }

    // Helper format status & dot untuk Aktivitas
    const getStatusBadge = (status) => {
        if (status === 'Rencana') return '<span class="badge-status status-terjadwal">Rencana</span>';
        if (status === 'Sedang Dilakukan') return '<span class="badge-status status-proses">Proses</span>';
        return '<span class="badge-status status-selesai">Selesai</span>';
    };

    const getStatusDotHtml = (status) => {
        let color = 'var(--green-success)';
        let glow = 'rgba(16, 185, 129, 0.2)';
        if (status === 'Rencana') {
            color = '#1e40af';
            glow = 'rgba(30, 64, 175, 0.2)';
        } else if (status === 'Sedang Dilakukan') {
            color = '#92400e';
            glow = 'rgba(146, 64, 14, 0.2)';
        }
        return `<div style="width: 7px; height: 7px; background: ${color}; border-radius: 50%; flex-shrink: 0; box-shadow: 0 0 0 2px ${glow}; margin-right: 6px;"></div>`;
    };

    function loadNotifikasiBadge() {
        fetch(`api/api_notifikasi.php?sales_account_id=${idSales}`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && res.data) {
                    const unreadCount = res.data.filter(n => n.unread).length;
                    const badge = document.getElementById('bellBadge');
                    if (badge) {
                        if (unreadCount > 0) {
                            badge.textContent = unreadCount;
                            badge.style.display = 'flex';
                        } else {
                            badge.style.display = 'none';
                        }
                    }
                }
            })
            .catch(err => console.error("Error loading notifications badge:", err));
    }
    loadNotifikasiBadge();

    function loadRingkasan() {
        fetch(`api/api_ringkasan.php?sales_account_id=${idSales}`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && res.data) {
                    const data = res.data;
                    const elFollowUp = document.getElementById('summaryFollowUp');
                    const elTestDrive = document.getElementById('summaryTestDrive');
                    const elFoto = document.getElementById('summaryFoto');
                    if (elFollowUp) elFollowUp.textContent = data.follow_up;
                    if (elTestDrive) elTestDrive.textContent = data.test_drive;
                    if (elFoto) elFoto.textContent = data.foto_aktivitas;
                    
                    const elSPK = document.getElementById('summarySPK');
                    if (elSPK) elSPK.textContent = data.spk;
                }
            })
            .catch(err => console.error("Error loading summary:", err));
    }
    loadRingkasan();

    // 2. Load Profile Data dari localStorage
    const namaSales = localStorage.getItem('namaSales') || 'Sales';
    const peranSales = localStorage.getItem('peranSales') || 'Sales Consultant';
    const tingkatanSales = localStorage.getItem('tingkatanSales') || 'Magang';
    const cabangSales = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';
    const spvSales = localStorage.getItem('spvSales') || '';
    let savedFoto = localStorage.getItem('fotoSales');
    if (savedFoto && (savedFoto.startsWith('../uploads') || savedFoto.startsWith('uploads'))) {
        savedFoto = ''; 
        localStorage.removeItem('fotoSales');
    }

    // Update Text Content
    document.getElementById('dashNama').textContent = namaSales;
    document.getElementById('dashRole').textContent = peranSales === 'Sales Consultant' && tingkatanSales ? `${peranSales} - ${tingkatanSales}` : peranSales;
    document.getElementById('dashCabang').textContent = cabangSales;

    // Tampilkan nama SPV
    const spvEl = document.getElementById('dashSPV');
    if (spvEl) {
        if (spvSales && spvSales.trim() !== '') {
            spvEl.textContent = 'SPV: ' + spvSales;
            spvEl.style.display = 'block';
        } else {
            spvEl.style.display = 'none';
        }
    }

    // Setup Avatar
    const avatarEl = document.getElementById('dashAvatar');
    if (savedFoto && savedFoto.trim() !== '') {
        avatarEl.src = savedFoto;
    } else {
        avatarEl.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(namaSales)}&background=f4f7f6&color=c8102e`;
    }

    // Sapaan Berdasarkan Waktu (Real-time)
    const hour = new Date().getHours();
    let greeting = 'Selamat Pagi,';
    if (hour >= 11 && hour < 15) greeting = 'Selamat Siang,';
    else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore,';
    else if (hour >= 18 || hour < 4) greeting = 'Selamat Malam,';
    document.getElementById('dashGreeting').textContent = greeting;

    // Live Clock & Date Badge
    const dashClock = document.getElementById('dashClock');
    const todayDateBadge = document.getElementById('todayDateBadge');
    
    if (todayDateBadge) {
        const now = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
        todayDateBadge.textContent = now.toLocaleDateString('id-ID', options).replace('.', '');
    }

    if (dashClock) {
        setInterval(() => {
            const now = new Date();
            dashClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
        }, 1000);
    }

    // 3. Tarik Data Target SPK & DO dari Database
    fetch(`api/api_target.php?id_sales=${idSales}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('dashPeriode').textContent = data.evaluasi_do_label || data.periode || 'Bulan Ini';

                // Update SPK Bulanan
                if (document.getElementById('dashPeriodeSpk')) {
                    document.getElementById('dashPeriodeSpk').textContent = data.periode || 'Bulan Ini';
                    const pctSpk = data.persentase_spk || 0;
                    const pctSpkCapped = Math.min(pctSpk, 100);
                    document.getElementById('dashPersentaseSpk').textContent = pctSpk + '%';
                    document.getElementById('dashRealisasiSpk').textContent = data.realisasi_spk_total || 0;
                    document.getElementById('dashTargetSpk').textContent = data.target_spk_total || 0;

                    const circleSpk = document.getElementById('dashCircleSpk');
                    if (pctSpk === 0) {
                        circleSpk.style.background = '#f1f5f9';
                        circleSpk.style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                    } else {
                        circleSpk.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
                        let curPct = 0;
                        const inc = Math.max(1, pctSpkCapped / 40);
                        const inv = setInterval(() => {
                            curPct += inc;
                            if (curPct >= pctSpkCapped) { curPct = pctSpkCapped; clearInterval(inv); }
                            circleSpk.style.background = `conic-gradient(var(--primary-blue) ${curPct}%, #f1f5f9 0)`;
                        }, 25);
                    }
                    document.getElementById('dashSisaPesanSpk').textContent = `Sisa SPK: ${data.sisa_spk || 0} unit`;

                    if (document.getElementById('dashLinearSpk')) {
                        setTimeout(() => {
                            document.getElementById('dashLinearSpk').style.width = pctSpkCapped + '%';
                        }, 100);
                    }
                }

                // Update DO Bulan Ini
                const pctDoBulan = data.persentase_do_bulan_ini || 0;
                const pctDoBulanCapped = Math.min(pctDoBulan, 100);
                if (document.getElementById('dashPersentaseDoBulan')) {
                    document.getElementById('dashPersentaseDoBulan').textContent = pctDoBulan + '%';
                    document.getElementById('dashRealisasiDoBulan').textContent = data.realisasi_do_bulan_ini || 0;
                    document.getElementById('dashTargetDoBulan').textContent = data.target_do_bulan_ini || 0;

                    const circleDoBulan = document.getElementById('dashCircleDoBulan');
                    if (pctDoBulan === 0) {
                        circleDoBulan.style.background = '#f1f5f9';
                        circleDoBulan.style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                    } else {
                        circleDoBulan.style.boxShadow = '0 0 0 3px rgba(5, 150, 105, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
                        let curPct = 0;
                        const inc = Math.max(1, pctDoBulanCapped / 40);
                        const inv = setInterval(() => {
                            curPct += inc;
                            if (curPct >= pctDoBulanCapped) { curPct = pctDoBulanCapped; clearInterval(inv); }
                            circleDoBulan.style.background = `conic-gradient(#059669 ${curPct}%, #f1f5f9 0)`;
                        }, 25);
                    }
                    document.getElementById('dashSisaPesanDoBulan').textContent = `Sisa DO: ${data.sisa_do_bulan_ini || 0}`;

                    if (document.getElementById('dashLinearDoBulan')) {
                        setTimeout(() => {
                            document.getElementById('dashLinearDoBulan').style.width = pctDoBulanCapped + '%';
                        }, 100);
                    }
                }

                // Update DO Evaluasi (dan juga untuk pages/index.html DO)
                const pctDo = data.persentase_do || 0;
                const pctDoCapped = Math.min(pctDo, 100);
                if (document.getElementById('dashPersentaseDo')) {
                    document.getElementById('dashPersentaseDo').textContent = pctDo + '%';
                    document.getElementById('dashRealisasiDo').textContent = data.realisasi_do_total || 0;
                    document.getElementById('dashTargetDo').textContent = data.target_do_total || 0;

                    const circleDo = document.getElementById('dashCircleDo');
                    if (pctDo === 0) {
                        circleDo.style.background = '#f1f5f9';
                        circleDo.style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                    } else {
                        circleDo.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
                        let curPct = 0;
                        const inc = Math.max(1, pctDoCapped / 40);
                        const inv = setInterval(() => {
                            curPct += inc;
                            if (curPct >= pctDoCapped) { curPct = pctDoCapped; clearInterval(inv); }
                            circleDo.style.background = `conic-gradient(var(--green-success) ${curPct}%, #f1f5f9 0)`;
                        }, 25);
                    }
                    document.getElementById('dashSisaPesanDo').textContent = `Sisa DO: ${data.sisa_do || 0} unit`;

                    if (document.getElementById('dashLinearDo')) {
                        setTimeout(() => {
                            document.getElementById('dashLinearDo').style.width = pctDoCapped + '%';
                        }, 100);
                    }
                }

                // Untuk pages/index.html yang menggunakan ID lama
                if (document.getElementById('dashPersentase')) {
                    document.getElementById('dashPersentase').textContent = pctDo + '%';
                    document.getElementById('dashRealisasi').textContent = data.realisasi_do_total || 0;
                    document.getElementById('dashTarget').textContent = data.target_do_total || 0;
                    
                    const circleDash = document.getElementById('dashCircle');
                    if (pctDo === 0) {
                        circleDash.style.background = 'rgba(255, 255, 255, 0.1)';
                    } else {
                        let curPct = 0;
                        const inc = Math.max(1, pctDoCapped / 40);
                        const inv = setInterval(() => {
                            curPct += inc;
                            if (curPct >= pctDoCapped) { curPct = pctDoCapped; clearInterval(inv); }
                            circleDash.style.background = `conic-gradient(#ffffff ${curPct}%, rgba(255,255,255,0.2) 0)`;
                        }, 25);
                    }
                    document.getElementById('dashSisaPesan').textContent = `Sisa Target DO: ${data.sisa_do || 0} unit`;

                    if (document.getElementById('dashLinearProgress')) {
                        setTimeout(() => {
                            document.getElementById('dashLinearProgress').style.width = pctDoCapped + '%';
                        }, 100);
                    }
                }
            } else {
                document.getElementById('dashPeriode').textContent = "-";
                document.getElementById('dashPersentaseDo').textContent = "0%";
                document.getElementById('dashCircleDo').style.background = '#f1f5f9';
                document.getElementById('dashCircleDo').style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                document.getElementById('dashSisaPesanDo').textContent = "Belum di-set";

                if (document.getElementById('dashPeriodeSpk')) {
                    document.getElementById('dashSisaPesanSpk').textContent = "Belum di-set";
                    document.getElementById('dashPeriodeSpk').textContent = "-";
                    document.getElementById('dashPersentaseSpk').textContent = "0%";
                    document.getElementById('dashCircleSpk').style.background = '#f1f5f9';
                    document.getElementById('dashCircleSpk').style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                }

                if (document.getElementById('dashCircleDoBulan')) {
                    document.getElementById('dashPersentaseDoBulan').textContent = "0%";
                    document.getElementById('dashCircleDoBulan').style.background = '#f1f5f9';
                    document.getElementById('dashCircleDoBulan').style.boxShadow = '0 0 0 3px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
                    document.getElementById('dashSisaPesanDoBulan').textContent = "Belum di-set";
                }
            }
        })
        .catch(error => {
            console.error('Error fetching target:', error);
            document.getElementById('dashPeriode').textContent = "Error";
            document.getElementById('dashPersentaseDo').textContent = "0%";
            document.getElementById('dashSisaPesanDo').textContent = "Error memuat data";
            if (document.getElementById('dashSisaPesanSpk')) {
                document.getElementById('dashSisaPesanSpk').textContent = "Error";
            }
            if (document.getElementById('dashSisaPesanDoBulan')) {
                document.getElementById('dashSisaPesanDoBulan').textContent = "Error";
            }
        });

    // 4. Tarik Data Aktivitas Terakhir dari Database
    window.currentPhotoViewerList = [];
    window.currentPhotoViewerIndex = 0;

    window.openPhotoViewer = function (imgSrc, allSrcs = [], index = 0) {
        const modal = document.getElementById('photoViewerModal');
        const img = document.getElementById('photoViewerImg');
        const btnPrev = document.getElementById('btnPhotoPrev');
        const btnNext = document.getElementById('btnPhotoNext');
        
        if (modal && img) {
            img.src = imgSrc;
            
            if (allSrcs.length > 1) {
                window.currentPhotoViewerList = allSrcs;
                window.currentPhotoViewerIndex = index;
                if (btnPrev) btnPrev.style.display = 'flex';
                if (btnNext) btnNext.style.display = 'flex';
            } else {
                window.currentPhotoViewerList = [];
                window.currentPhotoViewerIndex = 0;
                if (btnPrev) btnPrev.style.display = 'none';
                if (btnNext) btnNext.style.display = 'none';
            }
            
            modal.classList.add('show');
        }
    };

    window.nextPhotoViewer = function() {
        if (window.currentPhotoViewerList.length > 1) {
            window.currentPhotoViewerIndex = (window.currentPhotoViewerIndex + 1) % window.currentPhotoViewerList.length;
            const img = document.getElementById('photoViewerImg');
            if (img) img.src = window.currentPhotoViewerList[window.currentPhotoViewerIndex];
        }
    };

    window.prevPhotoViewer = function() {
        if (window.currentPhotoViewerList.length > 1) {
            window.currentPhotoViewerIndex = (window.currentPhotoViewerIndex - 1 + window.currentPhotoViewerList.length) % window.currentPhotoViewerList.length;
            const img = document.getElementById('photoViewerImg');
            if (img) img.src = window.currentPhotoViewerList[window.currentPhotoViewerIndex];
        }
    };

    function loadAktivitas() {
        const latestContainer = document.getElementById('latestActivityContainer');
        const modalList = document.getElementById('modalActivityList');

        fetch('api/api_aktivitas.php?limit=25&exclude_status=Rencana')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(res => {
                if (res.status === 'success' && res.data && res.data.length > 0) {
                    const items = res.data.filter(item => item.status === 'Sedang Dilakukan' || item.status === 'Selesai');
                    if (items.length === 0) {
                        if (latestContainer) latestContainer.innerHTML = '<p class="empty-state">Belum ada aktivitas yang sedang atau telah dilakukan hari ini.</p>';
                        return;
                    }

                    // Helper format waktu
                    const formatTime = (ts) => {
                        if (!ts) return '';
                        const date = new Date(ts.replace(/-/g, '/'));
                        const today = new Date();
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        const timeStr = `${hours}.${minutes} WIB`;

                        if (date.toDateString() === today.toDateString()) {
                            return timeStr;
                        } else {
                            const opsi = { day: 'numeric', month: 'short' };
                            return `${date.toLocaleDateString('id-ID', opsi)}, ${timeStr}`;
                        }
                    };

                    // Render satu yang terbaru di dashboard
                    const latest = items[0];

                    // ── Helper: warna per tipe aktivitas
                    const getTipeStyle = (tipe) => {
                        const map = {
                            'Kunjungan': { bg: 'rgba(232,25,44,0.1)', color: '#e8192c', icon: 'fa-car' },
                            'Follow Up': { bg: 'rgba(59,130,246,0.1)', color: '#3b82f6', icon: 'fa-phone' },
                            'SPK': { bg: 'rgba(245,158,11,0.1)', color: '#f59e0b', icon: 'fa-file-signature' },
                            'Test Drive': { bg: 'rgba(16,185,129,0.1)', color: '#10b981', icon: 'fa-car-side' },
                            'Delivery': { bg: 'rgba(139,92,246,0.1)', color: '#8b5cf6', icon: 'fa-truck' },
                            'Event': { bg: 'rgba(236,72,153,0.1)', color: '#ec4899', icon: 'fa-calendar-star' },
                            'Meeting': { bg: 'rgba(20,184,166,0.1)', color: '#14b8a6', icon: 'fa-handshake' },
                        };
                        return map[tipe] || { bg: 'rgba(100,116,139,0.1)', color: '#64748b', icon: 'fa-clipboard-list' };
                    };

                    // ── Helper: render card HTML
                    const renderCard = (item, fromModal) => {
                        const ts = getTipeStyle(item.tipe_aktivitas);
                        const fotoList = item.foto ? item.foto.split(',') : [];
                        const imgSrc = fotoList.length > 0
                            ? `uploads/lokasi/${fotoList[0]}`
                            : null;

                        // Foto thumbnail
                        let thumbHtml = imgSrc ? `
                                    <div style="position:relative;width:70px;height:70px;flex-shrink:0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.14);">
                                        <img src="${imgSrc}" alt="${item.tipe_aktivitas}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null; this.parentElement.style.background='${ts.bg}'; this.parentElement.innerHTML='<div style=\\'width:70px;height:70px;display:flex;align-items:center;justify-content:center;\\'><i class=\\'fa-solid ${ts.icon}\\' style=\\'font-size:22px;color:${ts.color};\\'></i></div>';">
                                        ${fotoList.length > 1 ? `<span style="position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,0.6);color:#fff;font-size:9px;font-weight:700;padding:1px 5px;border-radius:4px;backdrop-filter:blur(4px);">+${fotoList.length - 1}</span>` : ''}
                                    </div>
                                ` : `
                                    <div style="width:70px;height:70px;flex-shrink:0;border-radius:12px;background:${ts.bg};display:flex;align-items:center;justify-content:center;">
                                        <i class="fa-solid ${ts.icon}" style="font-size:22px;color:${ts.color};"></i>
                                    </div>
                                `;

                        const lokasiShort = (item.lokasi || '').split(',')[0] || item.lokasi;

                        return `
                                <div class="card activity-card activity-card-clickable"
                                     onclick='openActivityDetail(${JSON.stringify(item)}${fromModal ? ', true' : ''})'
                                     style="cursor:pointer;">
                                    ${thumbHtml}
                                    <div class="activity-details">
                                        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px;gap:6px;">
                                            <div style="display:flex;align-items:center;gap:7px;min-width:0;">
                                                <span style="width:26px;height:26px;border-radius:8px;background:${ts.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                                    <i class="fa-solid ${ts.icon}" style="font-size:11px;color:${ts.color};"></i>
                                                </span>
                                                <span style="font-size:12px;font-weight:700;color:var(--text-dark);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.tipe_aktivitas}</span>
                                                <span style="font-size:10px;font-weight:700;color:var(--primary-blue);background:#eef3fb;padding:2px 6px;border-radius:6px;border:1px solid #dbe6ff;">${item.nama_sales || 'Sales'}</span>
                                            </div>
                                            ${getStatusBadge(item.status)}
                                        </div>
                                        <p class="activity-desc" style="margin:0 0 6px;">${item.keterangan}</p>
                                        <div style="display:flex;align-items:center;justify-content:space-between;">
                                            <span style="font-size:10px;color:var(--text-light);display:flex;align-items:center;gap:3px;font-weight:600;">
                                                <i class="fa-regular fa-clock" style="font-size:9px;"></i>
                                                ${formatTime(item.created_at)}
                                            </span>
                                            <span style="font-size:10px;color:var(--text-muted);display:flex;align-items:center;gap:3px;max-width:110px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
                                                <i class="fa-solid fa-location-dot" style="font-size:9px;color:#3b82f6;flex-shrink:0;"></i>
                                                ${lokasiShort}
                                            </span>
                                        </div>
                                    </div>
                                    <div style="flex-shrink:0;color:var(--text-light);padding-left:4px;align-self:center;">
                                        <i class="fa-solid fa-chevron-right" style="font-size:11px;"></i>
                                    </div>
                                </div>
                                `;
                    };

                    latestContainer.innerHTML = renderCard(items[0], false);

                    // Render semua (maks 10) di modal list
                    modalList.innerHTML = items.map(item => renderCard(item, true)).join('');

                    // Populate premium header stats
                    const totalEl = document.getElementById('amStatTotal');
                    const hariIniEl = document.getElementById('amStatHariIni');
                    const verifiedEl = document.getElementById('amStatVerified');
                    if (totalEl) totalEl.textContent = items.length;
                    if (hariIniEl) {
                        const today = new Date().toDateString();
                        const todayCount = items.filter(i => {
                            try { return new Date(i.created_at.replace(/-/g, '/')).toDateString() === today; } catch(e) { return false; }
                        }).length;
                        hariIniEl.textContent = todayCount;
                    }
                    if (verifiedEl) {
                        const verified = items.filter(i => i.status === 'Terverifikasi' || i.status === 'Verified').length;
                        verifiedEl.textContent = verified;
                    }

                } else {
                    // Premium Empty State
                    const emptyHtml = `
                            <div class="pm-empty-state">
                                <div class="pm-empty-icon pm-empty-icon-red">
                                    <i class="fa-regular fa-folder-open"></i>
                                </div>
                                <h4>Belum Ada Aktivitas</h4>
                                <p>Belum ada aktivitas yang terekam hari ini. Mulai input aktivitas pertama Anda!</p>
                            </div>
                        `;
                    latestContainer.innerHTML = emptyHtml;
                    modalList.innerHTML = emptyHtml;
                }
            })
            .catch(error => {
                console.error('Error fetching activities:', error);
                const errorHtml = `
                        <div class="pm-error-state">
                            <i class="fa-solid fa-circle-exclamation"></i>
                            <p>Gagal memuat data aktivitas</p>
                        </div>
                    `;
                latestContainer.innerHTML = errorHtml;
                modalList.innerHTML = errorHtml;
            });
    }

    loadAktivitas();

    // ========== ACTIVITY DETAIL MODAL LOGIC ==========
    let currentPhotoList = [];
    let currentPhotoIndex = 0;
    let openedFromModal = false; // track apakah dibuka dari aktivitasModal

    window.openActivityDetail = function (item, fromModal) {
        openedFromModal = !!fromModal;
        currentPhotoList = item.foto ? item.foto.split(',').map(f => `uploads/lokasi/${f.trim()}`) : [];
        currentPhotoIndex = 0;

        // Jika dibuka dari modal list → tutup aktivitasModal dulu
        if (openedFromModal) {
            const listModal = document.getElementById('aktivitasModal');
            if (listModal) listModal.classList.remove('show');
        }

        // Ikon dinamis berdasar tipe
        const tipeIkonMap = {
            'Kunjungan': 'fa-car',
            'Follow Up': 'fa-phone',
            'SPK': 'fa-file-signature',
            'Test Drive': 'fa-car-side',
            'Delivery': 'fa-truck',
            'Event': 'fa-calendar-star',
            'Meeting': 'fa-handshake'
        };
        const ikon = tipeIkonMap[item.tipe_aktivitas] || 'fa-clipboard-list';
        document.getElementById('adm-header-icon').className = `fa-solid ${ikon}`;
        document.getElementById('adm-title').textContent = item.tipe_aktivitas || 'Detail Aktivitas';
        document.getElementById('adm-subtitle').textContent = 'Informasi lengkap aktivitas';
        document.getElementById('adm-nama-sales').textContent = item.nama_sales || 'Sales Consultant';
        document.getElementById('adm-tipe').textContent = item.tipe_aktivitas || '-';
        document.getElementById('adm-keterangan').textContent = item.keterangan || '-';

        const lokasiVal = item.lokasi || '-';
        document.getElementById('adm-lokasi').textContent = lokasiVal;

        const mapBtn = document.getElementById('adm-map-btn');
        if (mapBtn) {
            if (lokasiVal && lokasiVal !== '-') {
                mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lokasiVal)}`;
                mapBtn.style.display = 'flex';
            } else {
                mapBtn.style.display = 'none';
            }
        }

        // Format tanggal lengkap
        let dateStr = '-';
        if (item.created_at) {
            const d = new Date(item.created_at.replace(/-/g, '/'));
            dateStr = d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                + ' • ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ' WIB';
        }
        document.getElementById('adm-created').textContent = dateStr;
        document.getElementById('adm-datetime').innerHTML =
            `<i class="fa-regular fa-clock"></i> ${dateStr}`;

        // Status badge
        document.getElementById('adm-status-badge').innerHTML = getStatusBadge(item.status);

        // Tombol back
        const btnBack = document.getElementById('adm-btn-back');
        if (btnBack) btnBack.style.display = openedFromModal ? 'flex' : 'none';

        // Galeri foto
        const gallery = document.getElementById('adm-gallery');
        const rowFoto = document.getElementById('adm-row-foto');
        const btnPrev = document.getElementById('adm-btn-prev');
        const btnNext = document.getElementById('adm-btn-next');
        if (currentPhotoList.length > 0) {
            gallery.style.display = 'block';
            rowFoto.style.display = 'flex';
            document.getElementById('adm-foto-count').textContent = `${currentPhotoList.length} foto`;
            if (btnPrev) btnPrev.style.display = currentPhotoList.length > 1 ? 'flex' : 'none';
            if (btnNext) btnNext.style.display = currentPhotoList.length > 1 ? 'flex' : 'none';
            renderGallery();
        } else {
            gallery.style.display = 'none';
            rowFoto.style.display = 'none';
        }

        // Tampilkan modal dengan animasi
        const modal = document.getElementById('activityDetailModal');
        const sheet = document.getElementById('adm-sheet');
        modal.classList.add('show');
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                sheet.style.transform = 'translateY(0)';
            });
        });
    };

    function renderGallery() {
        const mainImg = document.getElementById('adm-main-photo');
        const counter = document.getElementById('adm-photo-counter');
        const thumbsEl = document.getElementById('adm-thumbnails');

        mainImg.src = currentPhotoList[currentPhotoIndex];
        counter.textContent = `${currentPhotoIndex + 1} / ${currentPhotoList.length}`;

        thumbsEl.innerHTML = currentPhotoList.map((src, i) => `
                    <img src="${src}" alt="Foto ${i + 1}" onclick="setPhoto(${i})"
                        style="width:54px;height:54px;border-radius:10px;object-fit:cover;flex-shrink:0;
                               cursor:pointer;transition:all 0.2s;
                               border:2.5px solid ${i === currentPhotoIndex ? 'var(--primary-red)' : 'transparent'};
                               opacity:${i === currentPhotoIndex ? 1 : 0.6};
                               transform:${i === currentPhotoIndex ? 'scale(1.05)' : 'scale(1)'};"
                    >
                `).join('');
    }

    window.setPhoto = function (index) {
        currentPhotoIndex = index;
        renderGallery();
    };
    window.nextPhoto = function () {
        if (currentPhotoList.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoList.length;
        renderGallery();
    };
    window.prevPhoto = function () {
        if (currentPhotoList.length === 0) return;
        currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoList.length) % currentPhotoList.length;
        renderGallery();
    };
    window.openPhotoFromDetail = function () {
        if (currentPhotoList[currentPhotoIndex]) {
            openPhotoViewer(currentPhotoList[currentPhotoIndex]);
        }
    };

    // Tutup detail → kembalikan ke modal list jika perlu
    window.closeActivityDetail = function () {
        const modal = document.getElementById('activityDetailModal');
        const sheet = document.getElementById('adm-sheet');
        sheet.style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.classList.remove('show');
        }, 360);
    };

    window.closeDetailGoBack = function () {
        const modal = document.getElementById('activityDetailModal');
        const sheet = document.getElementById('adm-sheet');
        sheet.style.transform = 'translateY(100%)';
        setTimeout(() => {
            modal.classList.remove('show');
            const listModal = document.getElementById('aktivitasModal');
            if (listModal) listModal.classList.add('show');
        }, 360);
    };

    // Tutup modal jika klik backdrop
    document.getElementById('activityDetailModal').addEventListener('click', function (e) {
        if (e.target === this) closeActivityDetail();
    });
    function loadDashboardTradeIn() {
        const tradeInList = document.getElementById('dashboardTradeInList');
        const modalOlxList = document.getElementById('modalOlxList');
        if (!tradeInList) return;

        fetch(`api/api_olx.php?sales_account_id=${idSales}`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && res.data && res.data.length > 0) {
                    const approvedData = res.data.filter(item => item.status === 'Approved');

                    // Populate OLX modal stats
                    const olxTotalEl = document.getElementById('olxStatTotal');
                    const olxApprovedEl = document.getElementById('olxStatApproved');
                    if (olxTotalEl) olxTotalEl.textContent = res.data.length;
                    if (olxApprovedEl) olxApprovedEl.textContent = approvedData.length;

                    if (approvedData.length > 0) {
                        window.globalOlxDataDashboard = approvedData;
                        // Populate Dashboard List (Max 5)
                        tradeInList.innerHTML = approvedData.slice(0, 5).map(item => {
                            let foto = item.foto_paths && item.foto_paths.length > 0 ? item.foto_paths[0] : 'https://placehold.co/100x100?text=No+Photo';

                            return `
                                <div class="pm-olx-card" onclick="showOlxDetail(${item.id})">
                                    <img src="${foto}" class="pm-olx-img" onerror="this.src='https://placehold.co/100x100?text=No+Photo'">
                                    <div class="pm-olx-info">
                                        <h4>${item.nama_kendaraan}</h4>
                                        <p class="pm-olx-meta">${item.tahun} • ${item.warna}</p>
                                    </div>
                                    <div class="pm-olx-status">
                                        <span class="pm-olx-badge pm-olx-badge-approved"><i class="fa-solid fa-check" style="font-size:8px;"></i> ${item.status}</span>
                                    </div>
                                </div>
                            `;
                        }).join('');

                        // Populate Modal List (All) — premium cards
                        if (modalOlxList) {
                            modalOlxList.innerHTML = approvedData.map(item => {
                                let foto = item.foto_paths && item.foto_paths.length > 0 ? item.foto_paths[0] : 'https://placehold.co/100x100?text=No+Photo';
                                const price = (parseInt(item.harga_estimasi) < 1000000 ? parseInt(item.harga_estimasi) * 1000000 : parseInt(item.harga_estimasi)).toLocaleString('id-ID');

                                return `
                                    <div class="pm-olx-card" onclick="showOlxDetail(${item.id})">
                                        <img src="${foto}" class="pm-olx-img" onerror="this.src='https://placehold.co/100x100?text=No+Photo'">
                                        <div class="pm-olx-info">
                                            <h4>${item.nama_kendaraan}</h4>
                                            <p class="pm-olx-meta">${item.tahun} • ${item.warna}</p>
                                            <p class="pm-olx-price">Rp ${price}</p>
                                        </div>
                                        <div class="pm-olx-status">
                                            <span class="pm-olx-badge pm-olx-badge-approved"><i class="fa-solid fa-check" style="font-size:8px;"></i> ${item.status}</span>
                                            <i class="fa-solid fa-chevron-right pm-olx-chevron"></i>
                                        </div>
                                    </div>
                                `;
                            }).join('');
                        }
                    } else {
                        const emptyApproved = `
                            <div class="pm-empty-state">
                                <div class="pm-empty-icon pm-empty-icon-blue">
                                    <i class="fa-solid fa-car-side"></i>
                                </div>
                                <h4>Belum Ada yang Disetujui</h4>
                                <p>Belum ada pengajuan Trade-In yang disetujui saat ini</p>
                            </div>`;
                        tradeInList.innerHTML = emptyApproved;
                        if (modalOlxList) {
                            modalOlxList.innerHTML = emptyApproved;
                        }
                    }
                } else {
                    const emptyAll = `
                        <div class="pm-empty-state">
                            <div class="pm-empty-icon pm-empty-icon-blue">
                                <i class="fa-solid fa-car-side"></i>
                            </div>
                            <h4>Belum Ada Trade-In</h4>
                            <p>Belum ada pengajuan Trade-In. Ajukan Trade-In pertama Anda!</p>
                        </div>`;
                    tradeInList.innerHTML = emptyAll;
                    if (modalOlxList) {
                        modalOlxList.innerHTML = emptyAll;
                    }
                }
            })
            .catch(err => {
                console.error("Error loading OLX:", err);
                const errorHtml = `
                    <div class="pm-error-state">
                        <i class="fa-solid fa-circle-exclamation"></i>
                        <p>Gagal memuat data OLX</p>
                    </div>`;
                tradeInList.innerHTML = errorHtml;
                if (modalOlxList) {
                    modalOlxList.innerHTML = errorHtml;
                }
            });
    }
    loadDashboardTradeIn();

    window.showOlxDetail = function(id) {
        if (!window.globalOlxDataDashboard) return;
        const item = window.globalOlxDataDashboard.find(d => d.id == id);
        if (!item) return;

        let modal = document.getElementById('olxDetailModal');
        if (!modal) return;

        document.getElementById('detNamaKendaraan').textContent = item.nama_kendaraan;
        document.getElementById('detNamaSales').textContent = item.nama_sales || 'Sales';
        document.getElementById('detJenis').textContent = item.jenis_type;
        document.getElementById('detTahun').textContent = item.tahun;
        document.getElementById('detWarna').textContent = item.warna;
        document.getElementById('detLokasi').textContent = item.lokasi_kecamatan;
        document.getElementById('detDeskripsi').textContent = item.deskripsi_kondisi;
        
        const date = new Date(item.created_at.replace(/-/g, '/'));
        document.getElementById('detTanggal').textContent = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        
        let finalPrice = parseInt(item.harga_estimasi);
        if (finalPrice > 0 && finalPrice < 1000000) finalPrice *= 1000000;
        let priceText = 'Rp ' + finalPrice.toLocaleString('id-ID');
        document.getElementById('detHarga').textContent = priceText;

        const photoContainer = document.getElementById('detPhotoContainer');
        photoContainer.innerHTML = '';
        if (item.foto_paths && item.foto_paths.length > 0) {
            const allSrcs = JSON.stringify(item.foto_paths).replace(/"/g, '&quot;');
            item.foto_paths.forEach((path, index) => {
                photoContainer.innerHTML += `<img src="${path}" onclick="openPhotoViewer('${path}', JSON.parse('${allSrcs}'), ${index})" style="height: 140px; width: auto; border-radius: 8px; flex-shrink: 0; object-fit: cover; aspect-ratio: 4/3; scroll-snap-align: start; cursor: pointer;">`;
            });
        } else {
            photoContainer.innerHTML = `<img src="https://placehold.co/600x400?text=Tidak+Ada+Foto" style="height: 140px; width: auto; border-radius: 8px; flex-shrink: 0; object-fit: cover; aspect-ratio: 4/3; scroll-snap-align: start;">`;
        }
        
        let btnHubungi = document.getElementById('detBtnHubungiSales');
        if (btnHubungi) {
            if (item.hp_sales) {
                let hp = item.hp_sales.replace(/\D/g, '');
                if (hp.startsWith('0')) hp = '62' + hp.substring(1);
                btnHubungi.style.display = 'flex';
                btnHubungi.onclick = function() {
                    let text = `Halo ${item.nama_sales}, saya ingin menanyakan tentang trade-in OLX kendaraan ${item.nama_kendaraan}.`;
                    window.open(`https://wa.me/${hp}?text=${encodeURIComponent(text)}`, '_blank');
                };
            } else {
                btnHubungi.style.display = 'none';
            }
        }

        modal.classList.add('show');
    };

    window.closeOlxDetail = function() {
        let modal = document.getElementById('olxDetailModal');
        if (modal) {
            modal.classList.remove('show');
        }
    };

    // ════════════════════════════════════════════════════════════════
    // LOGIK PENCAPAIAN OLX PER SPV & PER BULAN
    // ════════════════════════════════════════════════════════════════
    function formatOlxRupiah(val) {
        if (!val || val === 0) return 'Rp 0';
        if (val >= 1000000000) {
            return 'Rp ' + (val / 1000000000).toFixed(2).replace('.', ',') + ' M';
        }
        return 'Rp ' + val.toLocaleString('id-ID');
    }

    window.loadOlxAchievementData = function() {
        const monthSelect = document.getElementById('olxAchievementMonthSelect');
        const monthVal = monthSelect ? monthSelect.value : 'all';
        const spvContainer = document.getElementById('olxSpvContainer');

        if (!spvContainer) return;

        spvContainer.innerHTML = '<p class="mini-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data pencapaian per SPV...</p>';

        fetch(`api/api_olx_pencapaian.php?month=${encodeURIComponent(monthVal)}`)
            .then(r => r.json())
            .then(res => {
                if (res.status === 'success' && res.summary && res.spv_data) {
                    const s = res.summary;
                    // Populate overview stats
                    const elTotalUnit = document.getElementById('olxOvTotalUnit');
                    const elTotalDeal = document.getElementById('olxOvTotalDeal');
                    const elWinRate = document.getElementById('olxOvWinRate');

                    if (elTotalUnit) elTotalUnit.textContent = `${s.total_unit} Unit`;
                    if (elTotalDeal) elTotalDeal.textContent = `${s.total_deal} Deal`;
                    if (elWinRate) elWinRate.textContent = `Win Rate: ${s.win_rate}%`;

                    if (res.spv_data.length === 0) {
                        spvContainer.innerHTML = `
                            <div class="pm-empty-state">
                                <i class="fa-regular fa-folder-open"></i>
                                <h4>Tidak Ada Data Trade-In</h4>
                                <p>Belum ada data trade-in untuk periode ini.</p>
                            </div>`;
                        return;
                    }

                    // Store global spv data for detail lookup
                    window.olxSpvAchievementData = res.spv_data;

                    const avatarGradients = [
                        'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                        'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        'linear-gradient(135deg, #059669 0%, #047857 100%)',
                        'linear-gradient(135deg, #d97706 0%, #b45309 100%)'
                    ];

                    spvContainer.innerHTML = res.spv_data.map((spv, idx) => {
                        const gradient = avatarGradients[idx % avatarGradients.length];
                        const avatarText = spv.spv_name.substr(0, 2).toUpperCase();

                        // Build unit rows (showing unit details, excluding sales name and revenue)
                        const unitRows = spv.items.map(item => {
                            let resultBadgeClass = 'olx-badge-nego';
                            if (item.hasil === 'Deal') {
                                resultBadgeClass = 'olx-badge-deal';
                            } else if (item.hasil === 'Cek Unit') {
                                resultBadgeClass = 'olx-badge-cek';
                            }

                            return `
                                <tr>
                                    <td>
                                        <div style="font-weight:700;">${item.merk} ${item.type}</div>
                                        <div style="font-size:10px;color:#64748b;">${item.month || ''}</div>
                                    </td>
                                    <td>${item.tahun} • ${item.warna}</td>
                                    <td>${item.km} • Pajak ${item.pajak}</td>
                                    <td>
                                        <span class="olx-badge ${resultBadgeClass}">${item.ket}</span>
                                    </td>
                                </tr>`;
                        }).join('');

                        return `
                            <div class="olx-spv-card">
                                <div class="olx-spv-header">
                                    <div class="olx-spv-user">
                                        <div class="olx-spv-avatar" style="background: ${gradient};">
                                            ${avatarText}
                                        </div>
                                        <div class="olx-spv-info">
                                            <h4>SPV ${spv.spv_name}</h4>
                                            <p>Supervisor Trade-In • ${spv.total_unit} Total Unit</p>
                                        </div>
                                    </div>
                                    <div class="olx-spv-badges">
                                        <span class="olx-badge olx-badge-deal"><i class="fa-solid fa-check"></i> ${spv.deal_count} Deal</span>
                                        <span class="olx-badge olx-badge-nego"><i class="fa-solid fa-clock"></i> ${spv.nego_count} Nego/Prospek</span>
                                        <span class="olx-badge olx-badge-cek"><i class="fa-solid fa-chart-line"></i> ${spv.win_rate}% Rate</span>
                                    </div>
                                </div>

                                <div class="olx-spv-metrics">
                                    <div class="olx-metric-item">
                                        <span class="olx-metric-label">Total Trade-In</span>
                                        <span class="olx-metric-val" style="color:#0284c7;">${spv.total_unit} Unit</span>
                                        <span class="olx-metric-sub">Pengajuan Unit</span>
                                    </div>
                                    <div class="olx-metric-item">
                                        <span class="olx-metric-label">Unit Closing</span>
                                        <span class="olx-metric-val" style="color:#059669;">${spv.deal_count} Deal</span>
                                        <span class="olx-metric-sub">${spv.nego_count} Prospek/Nego</span>
                                    </div>
                                    <div class="olx-metric-item">
                                        <span class="olx-metric-label">Win Rate</span>
                                        <span class="olx-metric-val" style="color:#2563eb;">${spv.win_rate}%</span>
                                        <span class="olx-metric-sub">${spv.deal_count} dari ${spv.total_unit} Unit</span>
                                    </div>
                                </div>

                                <div class="olx-spv-progress-wrap">
                                    <div class="olx-spv-progress-head">
                                        <span>Pencapaian Deal Trade-In</span>
                                        <span>${spv.win_rate}% (${spv.deal_count}/${spv.total_unit} Unit)</span>
                                    </div>
                                    <div class="olx-spv-bar-bg">
                                        <div class="olx-spv-bar-fill" style="width: ${spv.win_rate}%;"></div>
                                    </div>
                                </div>

                                <button type="button" class="olx-btn-detail" onclick="toggleOlxSpvDetail(${idx})">
                                    <i class="fa-solid fa-list-check"></i>
                                    <span id="olxBtnText_${idx}">Lihat Detail Unit (${spv.total_unit})</span>
                                    <i class="fa-solid fa-chevron-down" id="olxBtnIcon_${idx}" style="transition: transform 0.3s;"></i>
                                </button>

                                <div id="olxPanel_${idx}" class="olx-unit-detail-panel">
                                    <div class="olx-unit-table-wrapper">
                                        <table class="olx-unit-table">
                                            <thead>
                                                <tr>
                                                    <th>Merk &amp; Type</th>
                                                    <th>Tahun / Warna</th>
                                                    <th>KM / Pajak</th>
                                                    <th>Hasil / Keterangan</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${unitRows}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>`;
                    }).join('');
                }
            })
            .catch(err => {
                console.error("Error loading OLX achievements:", err);
                if (spvContainer) {
                    spvContainer.innerHTML = `
                        <div class="pm-error-state">
                            <i class="fa-solid fa-circle-exclamation"></i>
                            <p>Gagal memuat data pencapaian OLX per SPV</p>
                        </div>`;
                }
            });
    };

    window.toggleOlxSpvDetail = function(idx) {
        const panel = document.getElementById(`olxPanel_${idx}`);
        const icon = document.getElementById(`olxBtnIcon_${idx}`);
        const text = document.getElementById(`olxBtnText_${idx}`);

        if (!panel) return;

        if (panel.style.display === 'block') {
            panel.style.display = 'none';
            if (icon) icon.style.transform = 'rotate(0deg)';
            if (text && window.olxSpvAchievementData && window.olxSpvAchievementData[idx]) {
                text.textContent = `Lihat Detail Unit (${window.olxSpvAchievementData[idx].total_unit})`;
            }
        } else {
            panel.style.display = 'block';
            if (icon) icon.style.transform = 'rotate(180deg)';
            if (text && window.olxSpvAchievementData && window.olxSpvAchievementData[idx]) {
                text.textContent = `Sembunyikan Detail Unit (${window.olxSpvAchievementData[idx].total_unit})`;
            }
        }
    };

    // Load data OLX achievement saat halaman dimuat
    loadOlxAchievementData();
});
