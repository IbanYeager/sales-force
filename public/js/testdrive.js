const salesName = localStorage.getItem('namaSales') || 'Sales';
        let units = [];
        let selectedId = null;

        document.addEventListener('DOMContentLoaded', () => {
            fetchUnits();
            loadHistory();
        });

        async function switchTab(tab) {
            document.getElementById('viewUnits').style.display = tab === 'units' ? 'block' : 'none';
            document.getElementById('viewHistory').style.display = tab === 'history' ? 'block' : 'none';
            
            document.getElementById('btnTabUnit').style.background = tab === 'units' ? 'var(--primary-blue)' : 'white';
            document.getElementById('btnTabUnit').style.color = tab === 'units' ? 'white' : 'var(--text-muted)';
            
            document.getElementById('btnTabHist').style.background = tab === 'history' ? 'var(--primary-blue)' : 'white';
            document.getElementById('btnTabHist').style.color = tab === 'history' ? 'white' : 'var(--text-muted)';
        }

        function fetchUnits() {
            fetch('../api/api_testdrive.php')
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success') {
                        units = res.data.filter(u => u.ketersediaan && u.ketersediaan.toLowerCase() === 'tersedia');
                        renderUnits();
                    }
                })
                .catch(err => console.error(err));
        }

        function renderUnits() {
            const el = document.getElementById('unitList');
            if (units.length === 0) {
                el.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px;">Tidak ada unit yang Tersedia saat ini.</p>';
                return;
            }
            el.innerHTML = '';
            units.forEach(u => {
                const isSelected = u.id == selectedId;
                const card = document.createElement('div');
                card.className = 'unit-card' + (isSelected ? ' selected' : '');
                
                card.innerHTML = `
                <div class="unit-card-header">
                    <div class="unit-img-wrap" style="cursor: pointer;" onclick="openImageLightbox('../assets/img/mobil/${getUnitImage(u.model)}')">
                        <img src="../assets/img/mobil/${getUnitImage(u.model)}" onerror="this.src='../assets/img/mobil/avanza.webp'" alt="${u.model}">
                    </div>
                    <div class="unit-info">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                            <div class="unit-model" style="margin-bottom:0;">${u.model}</div>
                            <span class="unit-badge badge-avail">Tersedia</span>
                        </div>
                        <div class="unit-meta">
                            <span class="meta-chip"><i class="fa-solid fa-gear"></i> ${u.type}</span>
                            <span class="meta-chip"><i class="fa-solid fa-palette"></i> ${u.warna}</span>
                            <span class="meta-chip"><i class="fa-regular fa-calendar"></i> ${u.tahun}</span>
                        </div>
                        <div style="display:flex; flex-direction:column; gap:4px; margin-top:8px; border-top:1px dashed #e2e8f0; padding-top:8px;">
                            ${(() => {
                                const s = getUnitSpecs(u.model);
                                return `
                                <div style="font-size:10px; color:var(--text-muted); display:flex; align-items:center;"><i class="fa-solid fa-users" style="color:#94a3b8; margin-right:6px; width:12px; text-align:center;"></i> ${s.seats}</div>
                                <div style="font-size:10px; color:var(--text-muted); display:flex; align-items:center;"><i class="fa-solid fa-gas-pump" style="color:#94a3b8; margin-right:6px; width:12px; text-align:center;"></i> ${s.fuel}</div>
                                <div style="font-size:10px; color:var(--text-muted); display:flex; align-items:center;"><i class="fa-solid fa-gauge-high" style="color:#94a3b8; margin-right:6px; width:12px; text-align:center;"></i> ${s.engine}</div>
                                `;
                            })()}
                        </div>
                    </div>
                </div>
                <div class="unit-divider"></div>
                <div class="unit-actions">
                    <button class="btn-select-unit ${isSelected ? 'selected-btn' : ''}" onclick="pickUnit('${u.id}')">
                        ${isSelected ? '<i class="fa-solid fa-check-circle"></i> Terpilih' : '<i class="fa-solid fa-circle-dot"></i> Pilih Unit'}
                    </button>
                </div>
                `;
                el.appendChild(card);
            });
            updateBanner();
        }

        function pickUnit(id) {
            selectedId = id;
            renderUnits();
        }

        function updateBanner() {
            const banner = document.getElementById('selectedBanner');
            const nameEl = document.getElementById('selectedUnitName');
            if (selectedId) {
                const u = units.find(x => x.id == selectedId);
                if (u) {
                    nameEl.textContent = `${u.model} ${u.type} (${u.warna})`;
                    banner.classList.add('show');
                }
            } else {
                banner.classList.remove('show');
            }
        }

        function openModal() {
            if (!selectedId) return;
            document.getElementById('inputIdUnit').value = selectedId;
            document.getElementById('inputModal').classList.add('show');
        }

        function closeModal() {
            document.getElementById('inputModal').classList.remove('show');
            document.getElementById('tdForm').reset();
        }

        async function submitTestDrive(e) {
            e.preventDefault();
            const btn = document.getElementById('submitBtn');
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mengirim...';

            const data = {
                sales_account_id: localStorage.getItem('idSales') || 1,
                nama_sales: salesName,
                nama_customer: document.getElementById('inputCustomer').value,
                id_unit: document.getElementById('inputIdUnit').value,
                jadwal: document.getElementById('inputJadwal').value,
                rute: document.getElementById('inputRute').value
            };

            try {
                const res = await fetch('../api/api_request_testdrive.php', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                });
                const json = await res.json();
                
                if (json.status === 'success') {
                    closeModal();
                    showCustomAlert('Berhasil', 'Pengajuan berhasil dikirim ke SPV', 'success');
                    selectedId = null;
                    renderUnits();
                    loadHistory();
                    switchTab('history');
                } else {
                    showCustomAlert('Gagal', json.message, 'error');
                }
            } catch (err) {
                showCustomAlert('Gagal', 'Terjadi kesalahan jaringan', 'error');
            }
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:8px;"></i>Kirim ke SPV';
        }

        let allTdData = [];

        function renderTdList(dataToRender) {
            const container = document.getElementById('tdContainer');
            if (dataToRender.length === 0) {
                container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:20px;">Belum ada riwayat pengajuan yang sesuai.</p>';
                return;
            }

            container.innerHTML = '';
            dataToRender.forEach(item => {
                let statusClass = 'status-pending';
                let statusLabel = 'Menunggu SPV';
                if (item.status === 'Disetujui') {
                    statusClass = 'status-approved';
                    statusLabel = 'Disetujui';
                } else if (item.status === 'Ditolak') {
                    statusClass = 'status-rejected';
                    statusLabel = 'Ditolak';
                }

                let printBtn = '';
                if (item.status === 'Disetujui') {
                    printBtn = `
                        <div style="margin-top:12px; border-top:1px dashed var(--border-color); padding-top:12px;">
                            <button class="btn-main" style="width:100%; margin:0; font-size:12px; padding:10px;" onclick="window.location.href='cetak_testdrive.html?id=${item.id}'">
                                <i class="fa-solid fa-print"></i> Cetak Dokumen PDF
                            </button>
                        </div>
                    `;
                } else if (item.status === 'Menunggu') {
                    printBtn = `
                        <div style="margin-top:12px; border-top:1px dashed var(--border-color); padding-top:12px;">
                            <button class="btn-main" style="width:100%; margin:0; font-size:12px; padding:10px; background-color:var(--primary-red);" onclick="cancelTestDrive(${item.id})">
                                <i class="fa-solid fa-xmark"></i> Batalkan Pengajuan
                            </button>
                        </div>
                    `;
                }

                container.innerHTML += `
                    <div class="td-card">
                        <div class="td-header">
                            <span style="font-weight:800; font-size:13px; color:var(--primary-blue);">${item.nama_customer}</span>
                            <span class="status-badge ${statusClass}">${statusLabel}</span>
                        </div>
                        <div class="td-row"><span>Unit Mobil</span><span>${item.model} ${item.type}</span></div>
                        <div class="td-row"><span>Jadwal</span><span>${item.jadwal.replace('T', ' ')}</span></div>
                        <div class="td-row"><span>Rute</span><span>${item.rute}</span></div>
                        ${printBtn}
                    </div>
                `;
            });
        }

        function filterTdList() {
            const keyword = document.getElementById('searchTd').value.toLowerCase();
            if (!keyword) {
                renderTdList(allTdData.slice(0, 20));
                return;
            }
            const filtered = allTdData.filter(t => 
                t.nama_customer.toLowerCase().includes(keyword) || 
                (t.model && t.model.toLowerCase().includes(keyword)) || 
                t.status.toLowerCase().includes(keyword)
            );
            renderTdList(filtered.slice(0, 50));
        }

        async function loadHistory() {
            try {
                const res = await fetch(`../api/api_request_testdrive.php?sales=${encodeURIComponent(salesName)}`);
                const json = await res.json();
                
                if (json.status === 'success' && json.data) {
                    allTdData = json.data;
                    filterTdList();
                } else {
                    allTdData = [];
                    filterTdList();
                }
            } catch (e) {
                console.error(e);
            }
        }

        async function cancelTestDrive(id) {
            const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin membatalkan pengajuan ini?') : confirm('Yakin ingin membatalkan pengajuan ini?'));
    if (!isConfirmed) return;
            try {
                const res = await fetch('../api/api_request_testdrive.php', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: id})
                });
                const json = await res.json();
                if (json.status === 'success') {
                    showCustomAlert('Berhasil', 'Pengajuan telah dibatalkan.', 'success');
                    loadHistory();
                } else {
                    showCustomAlert('Gagal', json.message, 'error');
                }
            } catch (err) {
                showCustomAlert('Error', 'Kesalahan jaringan', 'error');
            }
        }

        function getUnitImage(model) {
            if (!model) return 'fallback';
            const m = model.toLowerCase();
            if (m.includes('zenix')) return 'zenix.webp';
            if (m.includes('reborn')) return 'innova-reborn.webp';
            if (m.includes('yaris cross')) return 'yaris-cross.webp';
            if (m.includes('corolla cross')) return 'corolla-cross.webp';
            if (m.includes('corolla altis')) return 'corolla-altis.webp';
            if (m.includes('camry')) return 'camry.webp';
            if (m.includes('vios')) return 'vios.webp';
            if (m.includes('bz4x')) return 'bz4x.webp';
            if (m.includes('alphard')) return 'alphard.webp';
            if (m.includes('vellfire')) return 'vellfire.webp';
            if (m.includes('voxy')) return 'voxy.webp';
            if (m.includes('avanza')) return 'avanza.webp';
            if (m.includes('veloz')) return 'veloz.webp';
            if (m.includes('calya')) return 'calya.webp';
            if (m.includes('agya')) return 'agya.webp';
            if (m.includes('raize')) return 'raize.webp';
            if (m.includes('rush')) return 'rush.webp';
            if (m.includes('fortuner')) return 'fortuner.webp';
            if (m.includes('land cruiser')) return 'land-cruiser.webp';
            if (m.includes('hilux double')) return 'double-cabin.webp';
            if (m.includes('hilux single')) return 'single-cabin.webp';
            if (m.includes('hiace premio')) return 'hi-ace-premio.webp';
            if (m.includes('hiace')) return 'hi-ace-comm.webp';
            if (m.includes('dyna')) return 'dyna.webp';
            if (m.includes('rangga')) return 'rangga.webp';
            if (m.includes('gr 86')) return 'gr-86.webp';
            if (m.includes('gr yaris')) return 'gr-yaris.webp';
            if (m.includes('gr corolla')) return 'gr-corolla.webp';
            
            return m.replace(/\s+/g, '-') + '.webp';
        }

        function getUnitSpecs(model) {
            const m = (model || '').toLowerCase();
            let seats = '5 Kursi';
            let fuel = 'Bensin';
            let engine = '1.5L';

            // Seats
            if (m.match(/avanza|veloz|rush|sienta|innova|reborn|zenix|fortuner|calya|alphard|vellfire|voxy|land cruiser/)) {
                seats = '7 Kursi';
            } else if (m.match(/hiace premio/)) {
                seats = '10 Kursi';
            } else if (m.match(/hiace/)) {
                seats = '15 Kursi';
            } else if (m.match(/dyna|rangga|single cabin/)) {
                seats = '2 Kursi';
            } else if (m.match(/gr 86|gr yaris/)) {
                seats = '4 Kursi';
            }

            // Fuel
            if (m.match(/fortuner|innova reborn|hilux|hiace|dyna|land cruiser/)) {
                fuel = 'Diesel';
            }
            if (m.match(/hybrid|hev/)) fuel = 'Hybrid';
            if (m.includes('bz4x')) fuel = 'Listrik (EV)';

            // Engine
            if (m.match(/agya|calya|raize 1.2/)) engine = '1.2L';
            else if (m.match(/raize|raize 1.0/)) engine = '1.0L Turbo';
            else if (m.match(/gr yaris|gr corolla/)) engine = '1.6L Turbo';
            else if (m.match(/corolla cross|corolla altis|c-hr/)) engine = '1.8L';
            else if (m.match(/camry|alphard|vellfire/)) engine = '2.5L';
            else if (m.match(/gr 86/)) engine = '2.4L';
            else if (m.match(/innova reborn 2.4|fortuner 2.4|hilux 2.4/)) engine = '2.4L';
            else if (m.match(/fortuner 2.8|hilux 2.8/)) engine = '2.8L';
            else if (m.match(/land cruiser/)) engine = '3.3L Turbo';
            else if (m.match(/zenix|voxy|innova reborn 2.0/)) engine = '2.0L';
            else if (m.match(/rangga/)) engine = '2.0L / 2.4L';
            else if (m.match(/bz4x/)) engine = '71.4 kWh';

            return { seats, fuel, engine };
        }

        window.openImageLightbox = function(src) {
            if (!src) return;
            document.getElementById('lightboxImage').src = src;
            document.getElementById('imageLightbox').classList.add('show');
        };
