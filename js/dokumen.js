let customerList = [];
let selectedCustomer = null;
let checklistData = [];
let activeDocName = '';
const sales_account_id = localStorage.getItem('salesId') || localStorage.getItem('idSales') || 7;

async function initDokumenPage() {
    const elList = document.getElementById('docList');
    if (elList) {
        elList.innerHTML = `<p style="font-size:12px; text-align:center; color:var(--text-muted); padding:30px;"><i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i> Memuat data pelanggan...</p>`;
    }

    try {
        const res = await fetch(`../api/api_customer.php?sales_account_id=${sales_account_id}`);
        const json = await res.json();

        if (json.status === 'success' && Array.isArray(json.data) && json.data.length > 0) {
            customerList = json.data;
            const savedId = localStorage.getItem('selectedCustomerId');

            if (savedId) {
                selectedCustomer = customerList.find(c => c.id == savedId);
            }

            if (!selectedCustomer) {
                selectedCustomer = customerList[0];
            }

            localStorage.setItem('selectedCustomerId', selectedCustomer.id);
            localStorage.setItem('selectedCustomerNama', selectedCustomer.nama);

            renderCustomerDropdown();
            fetchDocuments(selectedCustomer.id);
        } else {
            // Belum ada data customer di database
            customerList = [];
            selectedCustomer = null;
            localStorage.removeItem('selectedCustomerId');
            localStorage.removeItem('selectedCustomerNama');

            renderEmptyCustomerState();
        }
    } catch (err) {
        console.error("Gagal memuat daftar customer:", err);
        renderEmptyCustomerState();
    }
}

function renderCustomerDropdown() {
    const dropdown = document.getElementById('selectCustomerDropdown');
    const badge = document.getElementById('noCustomerBadge');

    if (badge) badge.style.display = 'none';

    if (dropdown) {
        dropdown.style.display = 'inline-block';
        dropdown.innerHTML = customerList.map(c => `
            <option value="${c.id}" ${selectedCustomer && c.id == selectedCustomer.id ? 'selected' : ''}>
                ${escapeHtml(c.nama)} (${escapeHtml(c.status)})
            </option>
        `).join('');
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

function onCustomerSelectChange(newId) {
    const found = customerList.find(c => c.id == newId);
    if (found) {
        selectedCustomer = found;
        localStorage.setItem('selectedCustomerId', found.id);
        localStorage.setItem('selectedCustomerNama', found.nama);
        fetchDocuments(found.id);
    }
}

function renderEmptyCustomerState() {
    const dropdown = document.getElementById('selectCustomerDropdown');
    const badge = document.getElementById('noCustomerBadge');

    if (dropdown) dropdown.style.display = 'none';
    if (badge) badge.style.display = 'inline-block';

    checklistData = [];
    
    // Update progress stats
    document.getElementById('countSaved').textContent = '0';
    document.getElementById('countOptional').textContent = '0';
    document.getElementById('countMissing').textContent = '0';
    document.getElementById('docProgressText').textContent = '0 / 0';
    const bar = document.getElementById('docProgressBar');
    if (bar) bar.style.width = '0%';

    const el = document.getElementById('docList');
    if (el) {
        el.innerHTML = `
            <div style="text-align:center; padding: 36px 20px; background: white; border-radius: 16px; border: 1px dashed #cbd5e1; margin-top: 10px; animation: fadeIn 0.3s ease;">
                <div style="width:60px; height:60px; background:#fee2e2; color:#ef4444; border-radius:50%; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:24px;">
                    <i class="fa-solid fa-user-slash"></i>
                </div>
                <h4 style="font-size:15px; font-weight:800; color:#1e293b; margin:0 0 6px;">Belum Ada Data Pelanggan</h4>
                <p style="font-size:12px; color:#64748b; margin:0 0 18px; line-height:1.5; max-width:320px; margin-left:auto; margin-right:auto;">
                    Data pelanggan di sistem belum tersedia. Silakan tambahkan data pelanggan baru terlebih dahulu di halaman Customer untuk mengunggah berkas dokumen.
                </p>
                <a href="customer.html" class="btn-main" style="display:inline-flex; align-items:center; gap:8px; padding: 10px 20px; text-decoration:none; font-size:12.5px; font-weight:700; border-radius:10px; background: linear-gradient(135deg, var(--primary-red) 0%, #b91c1c 100%); color:white;">
                    <i class="fa-solid fa-user-plus"></i> Buka Halaman Customer
                </a>
            </div>
        `;
    }
}

function fetchDocuments(cust_id) {
    if (!cust_id) {
        renderEmptyCustomerState();
        return;
    }

    const container = document.getElementById('docList');
    if (container) container.style.opacity = '0.6';

    fetch(`../api/api_dokumen.php?customer_id=${cust_id}`)
        .then(r => r.json())
        .then(res => {
            if (container) container.style.opacity = '1';

            if (res && res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
                checklistData = res.data;
                renderList();
                updateProgress();
            } else if (res && res.status === 'no_customer') {
                renderEmptyCustomerState();
            } else {
                checklistData = [];
                renderList();
                updateProgress();
            }
        })
        .catch(err => {
            if (container) container.style.opacity = '1';
            console.error("Error loading checklist:", err);
            checklistData = [];
            renderList();
            updateProgress();
        });
}

function renderList() {
    const el = document.getElementById('docList');
    if (!el) return;

    if (!selectedCustomer) {
        renderEmptyCustomerState();
        return;
    }

    const docConfigs = {
        'KTP Customer': { icon: 'fa-id-card', color: 'var(--accent-blue)', bg: '#dbeafe', fg: '#1e40af', desc: 'Foto / scan KTP asli' },
        'NPWP': { icon: 'fa-file-invoice', color: 'var(--primary-red)', bg: '#fee2e2', fg: '#991b1b', desc: 'Nomor Pokok Wajib Pajak (opsional)' },
        'Slip Gaji': { icon: 'fa-money-check', color: 'var(--green-success)', bg: '#dcfce7', fg: '#065f46', desc: '3 bulan terakhir' },
        'Rekening Koran': { icon: 'fa-landmark', color: 'var(--accent-gold)', bg: '#fef3c7', fg: '#92400e', desc: '3 bulan terakhir (opsional)' },
        'Surat Keterangan Kerja': { icon: 'fa-file-signature', color: 'var(--purple-accent)', bg: '#ede9fe', fg: '#5b21b6', desc: 'Dari perusahaan / instansi' }
    };

    if (checklistData.length === 0) {
        el.innerHTML = `
            <div style="text-align:center; padding:30px 15px; color:var(--text-muted); border: 1px dashed #cbd5e1; border-radius: 12px; background: white;">
                <i class="fa-regular fa-folder-open" style="font-size:24px; margin-bottom:8px; display:block; color:#94a3b8;"></i>
                Belum ada berkas dokumen untuk customer ini.
            </div>
        `;
        return;
    }

    el.innerHTML = checklistData.map((d, idx) => {
        const conf = docConfigs[d.nama_dokumen] || { icon: 'fa-file', color: 'var(--text-muted)', bg: '#f1f5f9', fg: '#475569', desc: '' };

        let badgeClass = 'chip-yellow';
        if (d.status === 'Tersimpan') badgeClass = 'chip-green';
        else if (d.status === 'Belum Ada') badgeClass = 'chip-red';

        let actionHtml = `<div class="doc-action"><i class="fa-solid fa-chevron-right"></i></div>`;
        if (d.status === 'Belum Ada') {
            actionHtml = `
                <div class="doc-action" style="background:#fee2e2;color:#991b1b;">
                    <i class="fa-solid fa-plus"></i>
                </div>
            `;
        }

        return `
            <div class="doc-item" style="--item-color: ${conf.color}; animation-delay: ${idx * 0.05}s;" onclick="triggerUpload('${escapeHtml(d.nama_dokumen)}')">
                <div class="doc-icon" style="background:linear-gradient(135deg, ${conf.bg}, #ffffff); color:${conf.fg};">
                    <i class="fa-solid ${conf.icon}"></i>
                </div>
                <div class="doc-body">
                    <div class="doc-name">${escapeHtml(d.nama_dokumen)}</div>
                    <div class="doc-sub">${escapeHtml(conf.desc)}</div>
                </div>
                <span class="doc-status-badge ${badgeClass}">${escapeHtml(d.status)}</span>
                ${actionHtml}
            </div>
        `;
    }).join('');
}

function updateProgress() {
    const mandatoryDocs = ['KTP Customer', 'Slip Gaji', 'NPWP'];

    const savedCount = checklistData.filter(d => d.status === 'Tersimpan').length;
    const optionalCount = checklistData.filter(d => d.status === 'Opsional').length;
    const missingCount = checklistData.filter(d => d.status === 'Belum Ada').length;

    document.getElementById('countSaved').textContent = savedCount;
    document.getElementById('countOptional').textContent = optionalCount;
    document.getElementById('countMissing').textContent = missingCount;

    const mandatoryList = checklistData.filter(d => mandatoryDocs.includes(d.nama_dokumen));
    const mandatoryTotal = mandatoryList.length || 1;
    const mandatorySaved = mandatoryList.filter(d => d.status === 'Tersimpan').length;

    document.getElementById('docProgressText').textContent = `${mandatorySaved} / ${mandatoryTotal}`;

    const percent = Math.round((mandatorySaved / mandatoryTotal) * 100);
    const bar = document.getElementById('docProgressBar');
    if (bar) bar.style.width = percent + '%';
}

// ==========================================
// PHOTO PICKER HELPER
// ==========================================
function showPhotoSourcePicker(onSelectGallery, onSelectCamera) {
    let picker = document.getElementById('globalPhotoSourcePicker');
    if (!picker) {
        picker = document.createElement('div');
        picker.id = 'globalPhotoSourcePicker';
        picker.className = 'modal-overlay';
        picker.style.zIndex = '20000';
        
        picker.innerHTML = `
            <div class="modal-content" onclick="event.stopPropagation()">
                <div class="modal-header">
                    <h3>Pilih Sumber Foto</h3>
                    <button type="button" class="btn-close-modal" id="pickerBtnClose"><i class="fa-solid fa-xmark"></i></button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <button type="button" class="btn-main" id="pickerBtnCamera" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                        <i class="fa-solid fa-camera"></i> Ambil dari Kamera
                    </button>
                    <button type="button" class="btn-main" id="pickerBtnGallery">
                        <i class="fa-solid fa-image"></i> Pilih Foto dari Galeri
                    </button>
                    <button type="button" class="btn-outline-blue" id="pickerBtnCancel">Batal</button>
                </div>
            </div>
        `;
        document.body.appendChild(picker);
        
        picker.addEventListener('click', (e) => {
            if (e.target === picker) {
                hidePicker();
            }
        });
    }

    function showPicker() {
        picker.classList.add('show');
    }

    function hidePicker() {
        picker.classList.remove('show');
    }

    const btnCamera = picker.querySelector('#pickerBtnCamera');
    const btnGallery = picker.querySelector('#pickerBtnGallery');
    const btnCancel = picker.querySelector('#pickerBtnCancel');
    const btnClose = picker.querySelector('#pickerBtnClose');

    const newBtnCamera = btnCamera.cloneNode(true);
    const newBtnGallery = btnGallery.cloneNode(true);
    const newBtnCancel = btnCancel.cloneNode(true);
    const newBtnClose = btnClose.cloneNode(true);

    btnCamera.replaceWith(newBtnCamera);
    btnGallery.replaceWith(newBtnGallery);
    btnCancel.replaceWith(newBtnCancel);
    btnClose.replaceWith(newBtnClose);

    newBtnCamera.addEventListener('click', () => { hidePicker(); setTimeout(onSelectCamera, 100); });
    newBtnGallery.addEventListener('click', () => { hidePicker(); setTimeout(onSelectGallery, 100); });
    newBtnCancel.addEventListener('click', () => { hidePicker(); });
    newBtnClose.addEventListener('click', () => { hidePicker(); });

    showPicker();
}

function triggerUpload(name) {
    if (!selectedCustomer || !selectedCustomer.id) {
        if (typeof window.showCustomAlert === 'function') {
            window.showCustomAlert('Belum ada customer terpilih. Silakan tambahkan data pelanggan terlebih dahulu di halaman Customer.', 'warning');
        } else {
            alert('Belum ada customer terpilih. Silakan tambahkan data pelanggan terlebih dahulu.');
        }
        return;
    }
    activeDocName = name;
    showPhotoSourcePicker(
        () => document.getElementById('hiddenFileInput').click(),
        () => document.getElementById('hiddenFileInput_camera').click()
    );
}

function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file || !selectedCustomer) return;

    const formData = new FormData();
    formData.append('customer_id', selectedCustomer.id);
    formData.append('nama_dokumen', activeDocName);
    formData.append('dokumen_file', file);

    const container = document.getElementById('docList');
    if (container) container.style.opacity = '0.5';

    fetch('../api/api_dokumen.php', {
        method: 'POST',
        body: formData
    })
        .then(r => r.json())
        .then(res => {
            if (container) container.style.opacity = '1';
            if (res.status === 'success') {
                if (typeof window.showCustomAlert === 'function') {
                    window.showCustomAlert(`Dokumen ${activeDocName} berhasil diupload!`, 'success');
                } else {
                    alert(`Dokumen ${activeDocName} berhasil diupload!`);
                }
                fetchDocuments(selectedCustomer.id);
            } else {
                if (typeof window.showCustomAlert === 'function') {
                    window.showCustomAlert('Gagal mengupload dokumen: ' + res.message, 'error');
                } else {
                    alert('Gagal mengupload dokumen: ' + res.message);
                }
            }
        })
        .catch(err => {
            if (container) container.style.opacity = '1';
            console.error(err);
            if (typeof window.showCustomAlert === 'function') {
                window.showCustomAlert('Gagal terhubung ke server.', 'error');
            } else {
                alert('Gagal terhubung ke server.');
            }
        });

    event.target.value = '';
}

window.addEventListener('DOMContentLoaded', () => {
    initDokumenPage();
});
