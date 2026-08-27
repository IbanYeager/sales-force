// kacab_approval.js — Handler Otorisasi & Approval Kepala Cabang (Data Real MySQL)

let approvalData = [];
let activeFilter = 'Semua';

async function fetchApprovals() {
  try {
    const res = await fetch('../api/api_kacab_approval.php');
    const json = await res.json();

    if (json.ok && Array.isArray(json.data)) {
      approvalData = json.data;
    } else {
      approvalData = [];
    }

    renderApprovalList();
  } catch (e) {
    console.error("Gagal mengambil data approval:", e);
    approvalData = [];
    renderApprovalList();
  }
}

function renderApprovalList() {
  const container = document.getElementById('approvalContainer');
  if (!container) return;

  const filtered = approvalData.filter(item => {
    if (activeFilter === 'Menunggu') return item.status === 'Menunggu';
    if (activeFilter === 'Disetujui') return item.status === 'Disetujui';
    if (activeFilter === 'Ditolak') return item.status === 'Ditolak';
    return true;
  });

  // Update counters
  const cntPending = approvalData.filter(i => i.status === 'Menunggu').length;
  const cntApproved = approvalData.filter(i => i.status === 'Disetujui').length;
  const cntRejected = approvalData.filter(i => i.status === 'Ditolak').length;

  document.getElementById('cntPending') && (document.getElementById('cntPending').textContent = cntPending);
  document.getElementById('cntApproved') && (document.getElementById('cntApproved').textContent = cntApproved);
  document.getElementById('cntRejected') && (document.getElementById('cntRejected').textContent = cntRejected);

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 0;">
        <div class="es-icon"><i class="fa-solid fa-folder-open"></i></div>
        <div class="es-title">Tidak ada pengajuan otorisasi</div>
        <div class="es-text">Belum ada pengajuan diskon atau appraisal pada filter ini di database.</div>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(item => {
    const isPending = item.status === 'Menunggu';
    const isApproved = item.status === 'Disetujui';

    const badgeClass = isPending ? 'badge-warn' : (isApproved ? 'badge-success' : 'badge-danger');
    const iconClass = isPending ? 'fa-clock' : (isApproved ? 'fa-circle-check' : 'fa-circle-xmark');

    return `
      <div class="approval-card">
        <div class="ac-head">
          <div class="ac-type">
            <span class="ac-icon"><i class="fa-solid ${item.jenis.includes('Diskon') ? 'fa-tags' : 'fa-car-side'}"></i></span>
            <div>
              <h4>${escapeHtml(item.jenis)}</h4>
              <p class="ac-sub">${escapeHtml(item.model)} &middot; SPV: <strong>${escapeHtml(item.nama_spv)}</strong></p>
            </div>
          </div>
          <span class="status-badge ${badgeClass}"><i class="fa-solid ${iconClass}"></i> ${item.status}</span>
        </div>

        <div class="ac-body">
          <div class="ac-detail-grid">
            <div class="ac-cell">
              <span class="lbl">Sales Consultant</span>
              <span class="val">${escapeHtml(item.pemohon_sales)}</span>
            </div>
            <div class="ac-cell">
              <span class="lbl">Nama Konsumen</span>
              <span class="val">${escapeHtml(item.nama_customer)}</span>
            </div>
            <div class="ac-cell">
              <span class="lbl">Standar Diskon / Pasar</span>
              <span class="val">Rp ${(item.diskon_standar || item.harga_pasar || 0).toLocaleString('id-ID')}</span>
            </div>
            <div class="ac-cell highlight">
              <span class="lbl">Pengajuan Otorisasi</span>
              <span class="val-gold">Rp ${(item.diskon_pengajuan || item.pengajuan_appraisal || 0).toLocaleString('id-ID')}</span>
            </div>
          </div>

          ${item.catatan_pemohon ? `
            <div class="ac-note">
              <i class="fa-solid fa-quote-left"></i>
              <span><strong>Catatan Pemohon:</strong> "${escapeHtml(item.catatan_pemohon)}"</span>
            </div>
          ` : ''}

          ${item.catatan_kacab ? `
            <div class="ac-kacab-note">
              <i class="fa-solid fa-user-shield"></i>
              <span><strong>Catatan Kacab:</strong> "${escapeHtml(item.catatan_kacab)}"</span>
            </div>
          ` : ''}
        </div>

        ${isPending ? `
          <div class="ac-actions">
            <button class="btn btn-success btn-sm" onclick="openDecisionModal(${item.id}, 'Disetujui')">
              <i class="fa-solid fa-check"></i> Setujui Otorisasi
            </button>
            <button class="btn btn-danger btn-sm" onclick="openDecisionModal(${item.id}, 'Ditolak')">
              <i class="fa-solid fa-xmark"></i> Tolak Pengajuan
            </button>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function setFilter(status, el) {
  activeFilter = status;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  if (el) el.classList.add('active');
  renderApprovalList();
}

let selectedItemId = null;
let selectedAction = null;

function openDecisionModal(id, action) {
  selectedItemId = id;
  selectedAction = action;
  const item = approvalData.find(i => i.id === id);
  if (!item) return;

  const modal = document.getElementById('decisionModal');
  const titleEl = document.getElementById('modalTitle');
  const subEl = document.getElementById('modalSub');
  const btnSubmit = document.getElementById('btnSubmitDecision');

  if (titleEl) titleEl.textContent = action === 'Disetujui' ? 'Setujui Otorisasi Diskon' : 'Tolak Pengajuan Otorisasi';
  if (subEl) subEl.textContent = `${item.jenis} - ${item.model} (${item.nama_customer})`;

  if (btnSubmit) {
    btnSubmit.className = action === 'Disetujui' ? 'btn btn-success' : 'btn btn-danger';
    btnSubmit.innerHTML = action === 'Disetujui'
      ? '<i class="fa-solid fa-check"></i> Konfirmasi Setujui'
      : '<i class="fa-solid fa-xmark"></i> Konfirmasi Tolak';
  }

  document.getElementById('inputCatatanKacab').value = '';
  modal && (modal.style.display = 'flex');
}

function closeDecisionModal() {
  const modal = document.getElementById('decisionModal');
  modal && (modal.style.display = 'none');
}

async function submitDecision() {
  const item = approvalData.find(i => i.id === selectedItemId);
  if (!item) return;

  const catatan = document.getElementById('inputCatatanKacab')?.value?.trim() || '';

  try {
    const res = await fetch('../api/api_kacab_approval.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'update_status',
        id: item.id,
        status: selectedAction,
        catatan_kacab: catatan || (selectedAction === 'Disetujui' ? 'Disetujui Kepala Cabang.' : 'Ditolak Kepala Cabang.')
      })
    });

    const data = await res.json();
    if (data.ok) {
      item.status = selectedAction;
      item.catatan_kacab = catatan || (selectedAction === 'Disetujui' ? 'Disetujui Kepala Cabang.' : 'Ditolak Kepala Cabang.');
      closeDecisionModal();
      renderApprovalList();

      if (typeof customAlert === 'function') {
        customAlert(
          selectedAction === 'Disetujui' ? 'Otorisasi Disetujui' : 'Pengajuan Ditolak',
          `Pengajuan ${item.jenis} untuk ${item.nama_customer} telah tersimpan di database.`,
          selectedAction === 'Disetujui' ? 'success' : 'info'
        );
      }
    } else {
      alert("Gagal memperbarui status: " + (data.message || 'Error'));
    }
  } catch (e) {
    console.error(e);
    alert("Terjadi kesalahan jaringan.");
  }
}

let currentKacabCat = 'otorisasi';
let kacabTestDriveData = [];

function switchKacabCategory(cat) {
  currentKacabCat = cat;
  document.getElementById('tabCatOtorisasi')?.classList.toggle('active', cat === 'otorisasi');
  document.getElementById('tabCatTestDrive')?.classList.toggle('active', cat === 'testdrive');

  const filterBar = document.getElementById('filterBarOtorisasi');
  if (filterBar) filterBar.style.display = (cat === 'otorisasi') ? 'flex' : 'none';

  if (cat === 'otorisasi') {
    renderApprovalList();
  } else {
    fetchKacabTestDrive();
  }
}

async function fetchKacabTestDrive() {
  const container = document.getElementById('approvalContainer');
  if (container) {
    container.innerHTML = '<p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data Test Drive cabang...</p>';
  }

  try {
    const res = await fetch('../api/api_spv_approval_testdrive.php');
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      kacabTestDriveData = json.data;
    } else {
      kacabTestDriveData = [];
    }
    renderTestDriveKacab();
  } catch (e) {
    console.error("Error loading Kacab Test Drive:", e);
    kacabTestDriveData = [];
    renderTestDriveKacab();
  }
}

function renderTestDriveKacab() {
  const container = document.getElementById('approvalContainer');
  if (!container) return;

  if (kacabTestDriveData.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 0;">
        <div class="es-icon"><i class="fa-solid fa-car-side"></i></div>
        <div class="es-title">Tidak ada jadwal Test Drive</div>
        <div class="es-text">Belum ada pengajuan Test Drive dari sales consultant di database cabang.</div>
      </div>`;
    return;
  }

  container.innerHTML = `
    <div style="background:#1e1014; border:1px solid #38101a; border-radius:16px; padding:16px 20px; color:white; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h4 style="font-size:15px; font-weight:800; color:var(--gold); margin:0 0 4px;"><i class="fa-solid fa-car-tunnel"></i> Executive Fleet Monitoring Test Drive Cabang</h4>
        <p style="font-size:12px; color:#d1d5db; margin:0;">Kapasitas Unit Test Drive Dealer: Innova Zenix, Yaris Cross, Fortuner VRZ (Total ${kacabTestDriveData.length} Pengajuan)</p>
      </div>
      <span style="background:rgba(217,119,6,0.2); color:#f59e0b; padding:4px 12px; border-radius:20px; font-size:11px; font-weight:800; border:1px solid rgba(217,119,6,0.3);">
        Full Branch Access
      </span>
    </div>

    ${kacabTestDriveData.map(item => {
      const isPending = item.status === 'Menunggu';
      const isApproved = item.status === 'Disetujui';
      const badgeClass = isPending ? 'badge-warn' : (isApproved ? 'badge-success' : 'badge-danger');
      const iconClass = isPending ? 'fa-clock' : (isApproved ? 'fa-circle-check' : 'fa-circle-xmark');

      return `
        <div class="approval-card" style="border-left:4px solid ${isApproved ? '#10b981' : (isPending ? '#f59e0b' : '#ef4444')};">
          <div class="ac-head">
            <div class="ac-type">
              <span class="ac-icon" style="background:linear-gradient(135deg, #2563eb, #1d4ed8); color:white;">
                <i class="fa-solid fa-car-side"></i>
              </span>
              <div>
                <h4>Test Drive Unit — ${escapeHtml(item.model || 'Toyota')} ${escapeHtml(item.type || '')}</h4>
                <p class="ac-sub">Sales: <strong>${escapeHtml(item.nama_sales)}</strong> (${escapeHtml(item.nama_spv || 'SPV')}) &middot; Warna: ${escapeHtml(item.warna || '-')}</p>
              </div>
            </div>
            <span class="status-badge ${badgeClass}"><i class="fa-solid ${iconClass}"></i> ${item.status}</span>
          </div>

          <div class="ac-body">
            <div class="ac-detail-grid">
              <div class="ac-cell">
                <span class="lbl">Nama Customer</span>
                <span class="val">${escapeHtml(item.nama_customer)}</span>
              </div>
              <div class="ac-cell">
                <span class="lbl">No Telepon</span>
                <span class="val">${escapeHtml(item.no_hp || '-')}</span>
              </div>
              <div class="ac-cell">
                <span class="lbl">Jadwal Jam & Tanggal</span>
                <span class="val" style="color:var(--brand); font-weight:800;">${escapeHtml((item.jadwal || '').replace('T', ' '))}</span>
              </div>
              <div class="ac-cell highlight">
                <span class="lbl">Rute / Lokasi Test Drive</span>
                <span class="val-gold">${escapeHtml(item.rute || 'Area Dealer / Customer')}</span>
              </div>
            </div>
          </div>

          ${isPending ? `
            <div class="ac-actions">
              <button class="btn btn-success btn-sm" onclick="updateTestDriveStatusKacab(${item.id}, 'Approved', this)">
                <i class="fa-solid fa-check"></i> Setujui Test Drive
              </button>
              <button class="btn btn-danger btn-sm" onclick="updateTestDriveStatusKacab(${item.id}, 'Rejected', this)">
                <i class="fa-solid fa-xmark"></i> Tolak Test Drive
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('')}
  `;
}

async function updateTestDriveStatusKacab(id, newStatus, btn) {
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const kcbName = localStorage.getItem('namaSales') || 'Kepala Cabang';
    const res = await fetch('../api/api_spv_approval_testdrive.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, status: newStatus, spv_nama: kcbName })
    });
    const json = await res.json();
    if (json.status === 'success') {
      const item = kacabTestDriveData.find(t => t.id == id);
      if (item) item.status = (newStatus === 'Approved') ? 'Disetujui' : 'Ditolak';
      renderTestDriveKacab();

      if (typeof customAlert === 'function') {
        customAlert(
          newStatus === 'Approved' ? 'Test Drive Disetujui' : 'Test Drive Ditolak',
          `Jadwal test drive unit ${item ? item.model : ''} telah diperbarui di cabang.`,
          newStatus === 'Approved' ? 'success' : 'info'
        );
      }
    } else {
      alert("Gagal update status: " + (json.message || 'Error'));
      btn.disabled = false;
    }
  } catch (e) {
    console.error(e);
    alert("Terjadi kesalahan jaringan.");
    btn.disabled = false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  fetchApprovals();
});
