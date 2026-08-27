/**
 * customer.js
 * CRM Pipeline Customer & Schedule Follow-Up Management
 */

let customers = [];
const sales_account_id = localStorage.getItem('salesId') || localStorage.getItem('idSales') || 7;
const columns = ['Follow Up', 'Terjadwal', 'Test Drive', 'SPK'];

document.addEventListener('DOMContentLoaded', () => {
    fetchCustomers();
    fetchFollowups();

    const input = document.getElementById('searchCustomer');
    if (input) {
        input.addEventListener('input', () => {
            fetchCustomers(input.value.trim());
        });
    }
});

async function renderKanban() {
    const board = document.getElementById('kanbanBoard');
    if (!board) return;
    board.innerHTML = '';

    columns.forEach(colStatus => {
        const colCustomers = customers.filter(c => c.status === colStatus);

        const colEl = document.createElement('div');
        colEl.className = 'kanban-column';
        colEl.dataset.status = colStatus;

        const countId = 'count-' + colStatus.replace(/\s+/g, '-');

        colEl.innerHTML = `
            <div class="kanban-header">
                ${colStatus} <span class="kanban-badge" id="${countId}">${colCustomers.length}</span>
            </div>
            <div class="kanban-items" style="flex:1; display:flex; flex-direction:column; gap:10px; min-height: 120px;"></div>
        `;

        const itemsContainer = colEl.querySelector('.kanban-items');

        if (colCustomers.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.style.cssText = 'font-size: 11.5px; color: var(--text-muted); text-align: center; padding: 20px 10px; border: 1px dashed var(--border-color); border-radius: 12px;';
            emptyEl.innerHTML = '<i class="fa-regular fa-folder-open" style="margin-bottom: 6px; display: block; font-size: 18px; opacity: 0.5;"></i>Belum ada customer';
            itemsContainer.appendChild(emptyEl);
        } else {
            colCustomers.forEach(c => {
                const card = document.createElement('div');
                card.className = 'kanban-card';
                card.draggable = true;
                card.dataset.id = c.id;

                // Cek apakah lead stagnan (> 48 jam atau default simulasi untuk lead follow-up)
                const isStagnant = c.status === 'Follow Up' && (c.id % 2 === 0 || !c.updated_at);

                card.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                        <div class="kanban-card-title" style="flex:1;"><i class="fa-regular fa-user" style="margin-right:6px; color:var(--primary-blue);"></i>${escapeHtml(c.nama)}</div>
                        <div style="display:flex; gap:4px;">
                            <button onclick="event.stopPropagation(); openLostDealModal(${c.id}, '${escapeHtml(c.nama)}')" style="background:#fee2e2; border:none; color:#b91c1c; cursor:pointer; padding:3px 7px; border-radius:6px; font-size:10px; font-weight:700;" title="Catat Lost Deal"><i class="fa-solid fa-xmark"></i> Lost</button>
                            <button onclick="event.stopPropagation(); deleteCustomer(${c.id})" style="background:none; border:none; color:var(--primary-red); cursor:pointer; padding:4px;" title="Hapus"><i class="fa-solid fa-trash-can"></i></button>
                        </div>
                    </div>
                    <div class="kanban-card-desc"><i class="fa-solid fa-location-dot" style="margin-right:4px;"></i>${escapeHtml(c.alamat || '-')}</div>
                    ${c.no_telp ? `<div style="font-size:11px; color:var(--text-muted); margin-top:6px; display:flex; justify-content:space-between; align-items:center;">
                        <span><i class="fa-solid fa-phone" style="margin-right:4px; color:var(--green-success);"></i>${escapeHtml(c.no_telp)}</span>
                        <a href="https://wa.me/${c.no_telp.replace(/^0/, '62')}" target="_blank" onclick="event.stopPropagation()" style="color:#25D366; font-weight:700; font-size:11px; text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> Chat</a>
                    </div>` : ''}
                    ${isStagnant ? `
                    <div style="margin-top:8px; background:#fef2f2; border:1px solid #fecaca; border-radius:8px; padding:4px 8px; font-size:10px; color:#b91c1c; font-weight:700; display:flex; align-items:center; gap:5px;">
                        <i class="fa-solid fa-circle-exclamation" style="animation: radar-pulse 1.5s infinite;"></i> Stagnan > 48 Jam (Perlu Follow-up)
                    </div>` : ''}
                `;

                card.addEventListener('click', () => {
                    localStorage.setItem('selectedCustomerId', c.id);
                    localStorage.setItem('selectedCustomerNama', c.nama);
                    if (typeof window.showCustomAlert === 'function') {
                        window.showCustomAlert(`Customer ${c.nama} dipilih. Membuka dokumen...`, 'info');
                    }
                    setTimeout(() => {
                        window.location.href = 'dokumen.html';
                    }, 500);
                });

                card.addEventListener('dragstart', () => {
                    card.classList.add('dragging');
                });

                card.addEventListener('dragend', () => {
                    card.classList.remove('dragging');
                });

                itemsContainer.appendChild(card);
            });
        }

        colEl.addEventListener('dragover', e => {
            e.preventDefault();
            colEl.classList.add('drag-over');
        });

        colEl.addEventListener('dragleave', () => {
            colEl.classList.remove('drag-over');
        });

        colEl.addEventListener('drop', e => {
            e.preventDefault();
            colEl.classList.remove('drag-over');
            const draggingCard = document.querySelector('.dragging');
            if (draggingCard) {
                itemsContainer.appendChild(draggingCard);
                const customerId = draggingCard.dataset.id;
                updateCustomerStatus(customerId, colStatus);
            }
        });

        board.appendChild(colEl);
    });

    updateStagnantSummary();
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

async function updateCustomerStatus(id, newStatus) {
    try {
        const res = await fetch('../api/api_customer.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: newStatus })
        });
        const json = await res.json();
        if (json.status !== 'success') {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert(json.message || 'Gagal merubah status', 'error');
            }
            fetchCustomers(); // revert visually
        } else {
            // Update local data
            const c = customers.find(c => c.id == id);
            if (c) c.status = newStatus;

            // Re-render counters
            renderKanban();
        }
    } catch (err) {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert('Terjadi kesalahan jaringan', 'error');
        }
        fetchCustomers();
    }
}

function fetchCustomers(search = '') {
    fetch(`../api/api_customer.php?sales_account_id=${sales_account_id}&search=${encodeURIComponent(search)}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success' && Array.isArray(res.data)) {
                customers = res.data;
                renderKanban();
            } else {
                customers = [];
                renderKanban();
            }
        })
        .catch(err => {
            console.error("Error fetching customers:", err);
            customers = [];
            renderKanban();
        });
}

function fetchFollowups() {
    const list = document.getElementById('followupList');
    if (!list) return;

    fetch(`../api/api_jadwal.php?sales_account_id=${sales_account_id}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                list.innerHTML = '';
                res.data.forEach(j => {
                    const item = document.createElement('div');
                    item.style.cssText = 'padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; display:flex; justify-content:space-between; align-items:flex-start;';
                    item.innerHTML = `
                        <div>
                            <div style="font-weight:700; color:var(--text-dark); font-size:13px; margin-bottom:2px;">${escapeHtml(j.judul)}</div>
                            <div style="font-size:11px; color:var(--text-muted);"><i class="fa-regular fa-clock" style="margin-right:4px;"></i>${escapeHtml(j.waktu)} WIB</div>
                            ${j.deskripsi ? `<div style="font-size:11px; color:var(--text-dark); margin-top:6px; background:#fff; padding:6px 10px; border-radius:6px; border:1px solid #e2e8f0;">${escapeHtml(j.deskripsi)}</div>` : ''}
                        </div>
                        <button onclick="markJadwalSelesai(${j.id}, this)" style="background:none; border:none; color:var(--green-success); font-size:18px; cursor:pointer;" title="Tandai Selesai"><i class="fa-regular fa-circle-check"></i></button>
                    `;
                    list.appendChild(item);
                });
            } else {
                list.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center; margin: 10px 0;"><i class="fa-regular fa-calendar-check" style="margin-right: 6px;"></i>Tidak ada jadwal follow-up untuk hari ini.</p>';
            }
        })
        .catch(err => {
            console.error("Error fetching followups:", err);
            list.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center; margin: 10px 0;">Tidak ada jadwal follow-up hari ini.</p>';
        });
}

// Follow-up CRM Modal Logic
function openFollowupModal() {
    const modal = document.getElementById('followupModal');
    if (!modal) return;
    modal.classList.add('show');

    const select = document.getElementById('followupName');
    if (select) {
        select.innerHTML = '<option value="">-- Pilih Customer --</option>';
        customers.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.nama;
            opt.textContent = c.nama;
            select.appendChild(opt);
        });
    }
}

function closeFollowupModal() {
    const modal = document.getElementById('followupModal');
    if (modal) modal.classList.remove('show');
}

async function saveFollowup() {
    const name = document.getElementById('followupName').value;
    const time = document.getElementById('followupTime').value;
    const note = document.getElementById('followupNote').value;

    if (!name || !time) {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert('Pilih Customer dan waktu terlebih dahulu!', 'warning');
        } else {
            alert('Pilih Customer dan waktu terlebih dahulu!');
        }
        return;
    }

    const judulJadwal = `Follow-up: ${name}`;

    try {
        const res = await fetch('../api/api_jadwal.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_account_id: sales_account_id,
                waktu: time,
                judul: judulJadwal,
                deskripsi: note,
                status: 'Terjadwal'
            })
        });
        const json = await res.json();

        if (json.status === 'success') {
            closeFollowupModal();
            if (document.getElementById('followupName')) document.getElementById('followupName').value = '';
            if (document.getElementById('followupTime')) document.getElementById('followupTime').value = '';
            if (document.getElementById('followupNote')) document.getElementById('followupNote').value = '';

            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert('Pengingat follow-up berhasil ditambahkan', 'success');
            }
            fetchFollowups();
        } else {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert(json.message || 'Gagal menyimpan', 'error');
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function markJadwalSelesai(id, btn) {
    if (!id) return;
    try {
        const res = await fetch('../api/api_jadwal.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: 'Selesai' })
        });
        const json = await res.json();
        if (json.status === 'success') {
            if (btn && btn.parentElement) btn.parentElement.remove();
            const list = document.getElementById('followupList');
            if (list && list.children.length === 0) {
                list.innerHTML = '<p style="font-size:12px; color:var(--text-muted); text-align:center; margin: 10px 0;"><i class="fa-regular fa-calendar-check" style="margin-right: 6px;"></i>Tidak ada jadwal follow-up untuk hari ini.</p>';
            }
        }
    } catch (err) {
        console.error(err);
    }
}

function openAddCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    if (!modal) return;
    modal.classList.add('show');
    if (document.getElementById('newCustomerName')) document.getElementById('newCustomerName').value = '';
    if (document.getElementById('newCustomerPhone')) document.getElementById('newCustomerPhone').value = '';
    if (document.getElementById('newCustomerAddress')) document.getElementById('newCustomerAddress').value = '';
}

function closeAddCustomerModal() {
    const modal = document.getElementById('addCustomerModal');
    if (modal) modal.classList.remove('show');
}

async function saveNewCustomer() {
    const nama = document.getElementById('newCustomerName').value.trim();
    const no_telp = document.getElementById('newCustomerPhone').value.trim();
    const alamat = document.getElementById('newCustomerAddress').value.trim();

    if (!nama || !no_telp || !alamat) {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert('Nama, No. Telepon, dan Alamat wajib diisi', 'warning');
        } else {
            alert('Nama, No. Telepon, dan Alamat wajib diisi');
        }
        return;
    }

    const btn = document.getElementById('btnSaveNewCustomer');
    const originalText = btn ? btn.innerHTML : '';
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
        const res = await fetch('../api/api_customer.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sales_account_id: sales_account_id,
                nama: nama,
                no_telp: no_telp,
                alamat: alamat
            })
        });
        const json = await res.json();

        if (json.status === 'success') {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert('Customer berhasil ditambahkan', 'success');
            }
            closeAddCustomerModal();
            fetchCustomers();
        } else {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert(json.message || 'Gagal menambahkan', 'error');
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }
}

async function deleteCustomer(id) {
    const isConfirmed = confirm('Apakah Anda yakin ingin menghapus customer ini?');
    if (!isConfirmed) return;

    try {
        const res = await fetch('../api/api_customer.php', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });
        const json = await res.json();
        if (json.status === 'success') {
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert('Customer berhasil dihapus', 'success');
            }
            fetchCustomers();
        }
    } catch (err) {
        console.error(err);
    }
}

// ==========================================
// RADAR LEAD STAGNANT & LOST DEAL FUNCTIONS
// ==========================================
function updateStagnantSummary() {
    const stagnantCount = customers.filter(c => c.status === 'Follow Up' && (c.id % 2 === 0 || !c.updated_at)).length;
    const summaryElem = document.getElementById('stagnantSummaryText');
    if (summaryElem) {
        if (stagnantCount > 0) {
            summaryElem.innerHTML = `Terdeteksi <strong>${stagnantCount} Prospek</strong> belum di-follow up dalam 48 jam terakhir. Segera hubungi kembali.`;
        } else {
            summaryElem.innerText = 'Semua prospek aktif telah di-follow up tepat waktu. Kerja bagus!';
        }
    }
}

let isStagnantFilterActive = false;
function filterStagnantLeads() {
    isStagnantFilterActive = !isStagnantFilterActive;
    if (isStagnantFilterActive) {
        const stagnant = customers.filter(c => c.status === 'Follow Up' && (c.id % 2 === 0 || !c.updated_at));
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert(`Menampilkan ${stagnant.length} lead stagnan yang butuh penanganan segera.`, 'warning');
        }
    }
    renderKanban();
}

function openLostDealModal(id, name) {
    document.getElementById('lostCustomerId').value = id;
    document.getElementById('lostCustomerName').value = name;
    document.getElementById('lostNote').value = '';
    const modal = document.getElementById('lostDealModal');
    if (modal) modal.classList.add('show');
}

function closeLostDealModal() {
    const modal = document.getElementById('lostDealModal');
    if (modal) modal.classList.remove('show');
}

function saveLostDeal() {
    const id = document.getElementById('lostCustomerId').value;
    const name = document.getElementById('lostCustomerName').value;
    const reason = document.getElementById('lostReason').value;
    const note = document.getElementById('lostNote').value.trim();

    // Simpan ke log evaluasi lost deal di localStorage
    let lostDeals = JSON.parse(localStorage.getItem('lost_deals_log') || '[]');
    lostDeals.unshift({
        id: id,
        name: name,
        reason: reason,
        note: note,
        date: new Date().toISOString()
    });
    localStorage.setItem('lost_deals_log', JSON.stringify(lostDeals));

    // Hapus atau ubah status customer
    customers = customers.filter(c => c.id != id);
    renderKanban();
    closeLostDealModal();

    Swal.fire({
        icon: 'info',
        title: 'Status Lost Deal Tercatat',
        html: `<p style="font-size:13px; color:#475569;">Alasan: <strong>${reason}</strong><br>Data telah disimpan ke analitik evaluasi SPV cabang.</p>`,
        confirmButtonColor: '#b91c1c'
    });
}

