document.addEventListener('DOMContentLoaded', () => {
            // 1. Cek apakah user sudah login
            const loggedIn = localStorage.getItem('loggedIn') === 'true';
            if (!loggedIn) {
                window.location.href = 'login.html';
                return;
            }

            const peran = localStorage.getItem('peranSales');
            if (peran === 'Supervisor') {
                window.location.href = '../pages_spv/index_spv.html';
                return;
            }
            if (peran === 'Kepala Cabang') {
                window.location.href = '../pages_kacab/index_kacab.html';
                return;
            }

            const idSales = localStorage.getItem('idSales') || 1;
            const timelineEl = document.getElementById('jadwalTimeline');
            const modalTimelineEl = document.getElementById('jadwalModalTimeline');

            // Isi tanggal di header panel & modal
            const now = new Date();
            const opsiTanggal = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
            const strTanggal = now.toLocaleDateString('id-ID', opsiTanggal);
            const elPanelTgl = document.getElementById('jadwalTanggalPanel');
            const elModalTgl = document.getElementById('jadwalTanggalModal');
            if (elPanelTgl) elPanelTgl.textContent = strTanggal;
            if (elModalTgl) elModalTgl.textContent = strTanggal;

            const getStatusBadge = (status) => {
                if (status === 'Selesai') return '<span class="badge-status status-selesai">Selesai</span>';
                if (status === 'Proses') return '<span class="badge-status status-proses">Proses</span>';
                return '<span class="badge-status status-terjadwal">Terjadwal</span>';
            };
            const getItemClass = (status) => {
                if (status === 'Selesai') return 'timeline-item done';
                if (status === 'Proses') return 'timeline-item ongoing';
                return 'timeline-item';
            };

            function loadJadwal() {
                fetch(`../api/api_jadwal.php?sales_account_id=${idSales}`)
                    .then(r => r.json())
                    .then(res => {
                        if (res.status === 'success' && res.data) {
                            const jadwalItems = res.data;
                            
                            // Hitung & isi stats bar modal
                            const total = jadwalItems.length;
                            const selesai = jadwalItems.filter(i => i.status === 'Selesai').length;
                            const proses = jadwalItems.filter(i => i.status === 'Proses').length;
                            const terjadwal = total - selesai - proses;
                            const s = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
                            s('jmStatTotal', total);
                            s('jmStatSelesai', selesai);
                            s('jmStatTerjadwal', terjadwal < 0 ? 0 : terjadwal);
                            s('jmStatProses', proses);

                            const renderTimeline = (el, isModal = false) => {
                                if (!el) return;
                                const emptyEl = document.getElementById('jmEmptyState');
                                if (jadwalItems.length === 0) {
                                    if (isModal && emptyEl) emptyEl.style.display = 'flex';
                                    el.innerHTML = `<p style="font-size:12px; text-align:center; color:var(--text-muted); padding:20px; font-weight: 600;">Belum ada jadwal hari ini.</p>`;
                                    return;
                                }
                                if (emptyEl) emptyEl.style.display = 'none';
                                el.innerHTML = jadwalItems.map(item => `
                                    <div class="${getItemClass(item.status)}">
                                        <div class="timeline-dot"></div>
                                        <div class="timeline-time">${item.waktu || ''}</div>
                                        <div class="timeline-content">
                                            <div class="timeline-title">
                                                <h4>${item.judul || ''}</h4>
                                                ${getStatusBadge(item.status)}
                                            </div>
                                            <p>${item.deskripsi || ''}</p>
                                        </div>
                                    </div>
                                `).join('');
                            };

                            renderTimeline(timelineEl);
                            renderTimeline(modalTimelineEl, true);
                        }
                    })
                    .catch(err => console.error("Error loading jadwal:", err));
            }
            loadJadwal();

            function loadNotifikasiBadge() {
                fetch(`../api/api_notifikasi.php?sales_account_id=${idSales}`)
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

            // 2. Load Profile Data dari localStorage
            const namaSales = localStorage.getItem('namaSales') || 'Sales';
            const peranSales = localStorage.getItem('peranSales') || 'Sales Consultant';
            const cabangSales = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';
            const spvSales = localStorage.getItem('spvSales') || '';
            const fotoSales = localStorage.getItem('fotoSales');

            // Update Text Content
            document.getElementById('dashNama').textContent = namaSales;
            document.getElementById('dashRole').textContent = peranSales;
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
            if (fotoSales && fotoSales.trim() !== '') {
                avatarEl.src = fotoSales;
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

            // Live Clock
            const dashClock = document.getElementById('dashClock');
            if (dashClock) {
                setInterval(() => {
                    const now = new Date();
                    dashClock.textContent = now.toLocaleTimeString('id-ID', { hour12: false });
                }, 1000);
            }

            // 3. Tarik Data Target DO dari Database
            // PERBAIKAN 1: Menyesuaikan path API agar sama strukturnya dengan file promo
            fetch(`../api/api_target.php?id_sales=${idSales}`)
                .then(response => {
                    // PERBAIKAN 2: Mencegah error crash jika koneksi ke file PHP gagal
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.status === 'success') {
                        document.getElementById('dashPeriode').textContent = data.periode || 'Bulan Ini';
                        document.getElementById('dashPersentase').textContent = (data.persentase || 0) + '%';
                        document.getElementById('dashRealisasi').textContent = data.realisasi_total || 0;
                        document.getElementById('dashTarget').textContent = data.target_total || 0;
                        document.getElementById('dashSisaPesan').textContent = `Sisa ${data.sisa || 0} Unit lagi untuk mencapai target`;

                        // PERBAIKAN 3: Memastikan warna sinkron dengan root variabel CSS yang dipakai
                        const circle = document.getElementById('dashCircle');
                        circle.style.background = `conic-gradient(var(--green-success) ${data.persentase || 0}%, #f1f5f9 0)`;
                    } else {
                        document.getElementById('dashSisaPesan').textContent = "Belum ada target yang di-set untuk bulan ini.";
                        document.getElementById('dashPeriode').textContent = "-";
                        document.getElementById('dashPersentase').textContent = "0%";
                    }
                })
                .catch(error => {
                    // PERBAIKAN 4: Menangani error gagal load agar UI tidak terus-terusan menampilkan tulisan "Memuat..."
                    console.error('Error fetching target:', error);
                    document.getElementById('dashSisaPesan').textContent = "Gagal memuat target. Silakan muat ulang.";
                    document.getElementById('dashPeriode').textContent = "Error";
                    document.getElementById('dashPersentase').textContent = "0%";
                });

            // 4. Tarik Data Aktivitas Terakhir dari Database
            window.openPhotoViewer = function (imgSrc) {
                const modal = document.getElementById('photoViewerModal');
                const img = document.getElementById('photoViewerImg');
                if (modal && img) {
                    img.src = imgSrc;
                    modal.classList.add('show');
                }
            };

            function loadAktivitas() {
                const latestContainer = document.getElementById('latestActivityContainer');
                const modalList = document.getElementById('modalActivityList');

                fetch('../api/api_aktivitas.php?limit=25&exclude_status=Rencana')
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
                            const latestFotoList = latest.foto ? latest.foto.split(',') : [];
                            const latestFirstFoto = latestFotoList.length > 0 ? `../uploads/lokasi/${latestFotoList[0]}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';

                            let latestImageHtml = `<img src="${latestFirstFoto}" alt="${latest.tipe_aktivitas}" class="activity-img" onclick="openPhotoViewer('${latestFirstFoto}')" style="cursor: pointer;">`;
                            if (latestFotoList.length > 1) {
                                latestImageHtml = `
                                <div style="position: relative; width: 60px; height: 60px; flex-shrink: 0; cursor: pointer;" onclick="openPhotoViewer('${latestFirstFoto}')">
                                    <img src="${latestFirstFoto}" alt="${latest.tipe_aktivitas}" class="activity-img" style="width: 100%; height: 100%;">
                                    <span style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.65); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 4px; border-radius: 4px;">+${latestFotoList.length - 1}</span>
                                </div>
                            `;
                            }

                            latestContainer.innerHTML = `
                            <div class="card activity-card">
                                ${latestImageHtml}
                                <div class="activity-details">
                                    <div class="activity-header">
                                        <div class="activity-type">
                                            <div class="dot-green"></div> ${latest.tipe_aktivitas}
                                        </div>
                                    </div>
                                    <p class="activity-desc">${latest.keterangan}</p>
                                    <div class="activity-footer">
                                        <span class="activity-time"><i class="fa-regular fa-clock"></i> ${formatTime(latest.created_at)}</span>
                                        <span class="activity-location" style="font-size: 10px; color: var(--text-muted); max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${latest.lokasi}">
                                            <i class="fa-solid fa-location-dot" style="color: var(--primary-blue); margin-right: 2px;"></i> ${latest.lokasi.split(',')[0] || latest.lokasi}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        `;

                            // Render semua (maks 10) di modal list
                            modalList.innerHTML = items.map(item => {
                                const fotoList = item.foto ? item.foto.split(',') : [];
                                const firstFoto = fotoList.length > 0 ? `../uploads/lokasi/${fotoList[0]}` : 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';

                                let imageHtml = `<img src="${firstFoto}" alt="${item.tipe_aktivitas}" class="activity-img" onclick="openPhotoViewer('${firstFoto}')" style="cursor: pointer;">`;
                                if (fotoList.length > 1) {
                                    imageHtml = `
                                    <div style="position: relative; width: 60px; height: 60px; flex-shrink: 0; cursor: pointer;" onclick="openPhotoViewer('${firstFoto}')">
                                        <img src="${firstFoto}" alt="${item.tipe_aktivitas}" class="activity-img" style="width: 100%; height: 100%;">
                                        <span style="position: absolute; bottom: 4px; right: 4px; background: rgba(0,0,0,0.65); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 4px; border-radius: 4px;">+${fotoList.length - 1}</span>
                                    </div>
                                `;
                                }

                                return `
                                <div class="card activity-card">
                                    ${imageHtml}
                                    <div class="activity-details">
                                        <div class="activity-header">
                                            <div class="activity-type">
                                                <div class="dot-green"></div> ${item.tipe_aktivitas}
                                            </div>
                                        </div>
                                        <p class="activity-desc">${item.keterangan}</p>
                                        <div class="activity-footer">
                                            <span class="activity-time"><i class="fa-regular fa-clock"></i> ${formatTime(item.created_at)}</span>
                                            <span class="activity-location" style="font-size: 10px; color: var(--text-muted); max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${item.lokasi}">
                                                <i class="fa-solid fa-location-dot" style="color: var(--primary-blue); margin-right: 2px;"></i> ${item.lokasi.split(',')[0] || item.lokasi}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            `;
                            }).join('');

                        } else {
                            // Empty State
                            const emptyHtml = `
                            <div class="card activity-card" style="justify-content: center; padding: 20px;">
                                <div style="text-align: center; color: var(--text-muted);">
                                    <i class="fa-regular fa-folder-open" style="font-size: 24px; opacity: 0.5; margin-bottom: 6px;"></i>
                                    <p style="font-size: 12px; font-weight: 600; margin: 0;">Belum ada aktivitas terekam hari ini</p>
                                </div>
                            </div>
                        `;
                            latestContainer.innerHTML = emptyHtml;
                            modalList.innerHTML = emptyHtml;
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching activities:', error);
                        const errorHtml = `
                        <div class="card activity-card" style="justify-content: center; padding: 20px;">
                            <div style="text-align: center; color: var(--primary-red);">
                                <i class="fa-solid fa-circle-exclamation" style="font-size: 24px; margin-bottom: 6px;"></i>
                                <p style="font-size: 12px; font-weight: 600; margin: 0;">Gagal memuat data aktivitas</p>
                            </div>
                        </div>
                    `;
                        latestContainer.innerHTML = errorHtml;
                        modalList.innerHTML = errorHtml;
                    });
            }

            loadAktivitas();
        });
