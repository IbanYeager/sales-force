let spkData = [];
        let currentFilter = 'all';

        function fetchApprovalList() {
            fetch('../api/api_spk.php?all=true')
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success' && res.data) {
                        spkData = res.data;
                        updateStats();
                        renderList();
                    }
                })
                .catch(err => console.error("Error loading approval list:", err));
        }

        function updateStats() {
            const pending = spkData.filter(s => s.status === 'Menunggu').length;
            const approved = spkData.filter(s => s.status === 'Disetujui').length;
            const rejected = spkData.filter(s => s.status === 'Ditolak').length;

            document.getElementById('countPending').textContent = pending;
            document.getElementById('countDisetujui').textContent = approved;
            document.getElementById('countDitolak').textContent = rejected;
        }

        function renderList() {
            const listEl = document.getElementById('approvalList');
            if (!listEl) return;

            const filtered = spkData.filter(s => currentFilter === 'all' || s.status === currentFilter);

            if (filtered.length === 0) {
                listEl.innerHTML = '<p style="font-size:12px; text-align:center; color:var(--text-muted); padding:20px;">Tidak ada pengajuan untuk kategori ini.</p>';
                return;
            }

            listEl.innerHTML = filtered.map((s, idx) => {
                let badgeClass = 'status-waiting';
                let statusText = 'Menunggu';
                if (s.status === 'Disetujui') {
                    badgeClass = 'status-approved';
                    statusText = 'Disetujui';
                } else if (s.status === 'Ditolak') {
                    badgeClass = 'status-rejected';
                    statusText = 'Ditolak';
                }

                let actionsHtml = '';
                if (s.status === 'Menunggu') {
                    actionsHtml = `
                        <div class="approval-divider"></div>
                        <div class="approval-actions">
                            <button class="btn-approve" onclick="updateSpkStatus(${s.id}, 'Disetujui', this)">
                                <i class="fa-solid fa-check"></i> Setujui
                            </button>
                            <button class="btn-reject" onclick="updateSpkStatus(${s.id}, 'Ditolak', this)">
                                <i class="fa-solid fa-xmark"></i> Tolak
                            </button>
                        </div>
                    `;
                }

                // Format date/time
                const date = new Date(s.created_at.replace(/-/g, '/'));
                const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                return `
                    <div class="approval-card" data-status="${s.status}" style="animation-delay: ${idx * 0.05}s">
                        <div class="approval-card-header">
                            <div class="approval-info">
                                <div class="approval-name">SPK — ${s.nama_customer}</div>
                                <div class="approval-meta">
                                    <span><i class="fa-solid fa-car"></i> ${s.model}</span>
                                    <span><i class="fa-regular fa-calendar"></i> ${timeStr}</span>
                                    <span><i class="fa-solid fa-user"></i> ${s.nama_sales || 'Sales'}</span>
                                </div>
                            </div>
                            <span class="status-badge ${badgeClass}">${statusText}</span>
                        </div>
                        <div class="approval-divider"></div>
                        <div class="approval-detail">
                            <div class="detail-item">
                                <span class="detail-label">Nominal</span>
                                <span class="detail-value">Rp ${s.nominal_jt} Jt</span>
                            </div>
                            <div class="detail-item">
                                <span class="detail-label">Tipe Pembelian</span>
                                <span class="detail-value">${s.tipe_pembelian}</span>
                            </div>
                        </div>
                        ${actionsHtml}
                    </div>
                `;
            }).join('');
        }

        function filterList(el, status) {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            el.classList.add('active');
            currentFilter = status;
            renderList();
        }

        function updateSpkStatus(id, newStatus, btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

            fetch('../api/api_spk.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'update_status',
                    spk_id: id,
                    status: newStatus
                })
            })
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success') {
                        const item = spkData.find(s => s.id === id);
                        if (item) {
                            item.status = newStatus;
                        }
                        updateStats();
                        renderList();
                    } else {
                        alert('Gagal memperbarui status: ' + res.message);
                        btn.disabled = false;
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Gagal terhubung ke server.');
                    btn.disabled = false;
                });
        }

        document.addEventListener('DOMContentLoaded', fetchApprovalList);
