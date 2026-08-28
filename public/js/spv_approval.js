let spkData = [];
let olxData = [];
let testDriveData = [];
let currentView = 'spk';

async function logoutUser() {
  localStorage.clear();
  window.location.href = '../pages/login_spv.html';
}

function guardSPV() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const peran = localStorage.getItem('peranSales');
  if (!loggedIn) {
    window.location.href = '../pages/login_spv.html';
    return;
  }
  if (peran === 'Kepala Cabang') {
    window.location.href = '../pages_kacab/approval_kacab.html';
    return;
  }
  if (peran !== 'Supervisor') {
    window.location.href = '../index.html';
    return;
  }
}

function renderUser() {
  const nama = localStorage.getItem('namaSales') || 'SPV';
  const peran = localStorage.getItem('peranSales') || 'Supervisor';
  document.getElementById('spvNama').textContent = nama;
  document.getElementById('spvRole').textContent = peran;

  const avatar = localStorage.getItem('fotoSales');
  const avatarEl = document.getElementById('spvAvatar');
  avatarEl.src = (avatar && avatar.trim() !== '')
    ? avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=f4f7f6&color=c8102e`;
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.tab-item').forEach(btn => btn.classList.remove('active'));
  if (view === 'spk') {
    document.getElementById('tabSpk').classList.add('active');
    renderSpkList();
  } else if (view === 'olx') {
    document.getElementById('tabOlx').classList.add('active');
    renderOlxList();
  } else if (view === 'testdrive') {
    document.getElementById('tabTestDrive').classList.add('active');
    renderTestDriveList();
  }
}

// ==========================================
// 🏷️ APPROVAL DISKON DESK FUNCTIONS
// ==========================================
window.openApprovalDiscountDesk = function() {
  document.getElementById('approvalDiscountDeskModal').style.display = 'flex';
  calcApprDiscount();
};

window.closeApprovalDiscountDesk = function() {
  document.getElementById('approvalDiscountDeskModal').style.display = 'none';
};

window.calcApprDiscount = function() {
  const model = document.getElementById('apprModelSelect').value;
  const discount = parseInt(document.getElementById('apprDiscountInput').value) || 0;

  const limits = {
    avanza: 15000000,
    veloz: 18000000,
    zenix: 22000000,
    fortuner: 30000000,
    yaris_cross: 20000000
  };

  const maxSpv = limits[model] || 15000000;
  const badge = document.getElementById('apprStatusBadge');
  const profitText = document.getElementById('apprProfitText');
  const descText = document.getElementById('apprDescText');
  const box = document.getElementById('apprSimBox');

  if (discount <= maxSpv) {
    box.style.background = '#f0fdf4';
    box.style.borderColor = '#bbf7d0';
    badge.style.background = '#dcfce7';
    badge.style.color = '#15803d';
    badge.textContent = '🟢 Lolos Toleransi SPV';
    profitText.style.color = '#15803d';
    profitText.textContent = `Profit Retention: Aman (Margin Terjaga)`;
    descText.textContent = `Diskon Rp ${discount.toLocaleString('id-ID')} berada di dalam batas wewenang SPV (Plafond Max: Rp ${maxSpv.toLocaleString('id-ID')}).`;
  } else {
    box.style.background = '#fff1f2';
    box.style.borderColor = '#fecdd3';
    badge.style.background = '#ffe4e6';
    badge.style.color = '#be123c';
    badge.textContent = 'Butuh Approval Kacab';
    profitText.style.color = '#be123c';
    profitText.textContent = `Over Plafond (+Rp ${(discount - maxSpv).toLocaleString('id-ID')})`;
    descText.textContent = `Diskon melebihi limit SPV (Plafond Max: Rp ${maxSpv.toLocaleString('id-ID')}). Memerlukan persetujuan Kepala Cabang.`;
  }
};

window.applyApprDiscount = function() {
  closeApprovalDiscountDesk();
  if (typeof showCustomAlert === 'function') {
    showCustomAlert('Diskon Disetujui!', 'Limit diskon berhasil dikonfirmasi & diapprove oleh Supervisor.', 'success');
  } else {
    alert('Diskon berhasil diapprove!');
  }
};

window.currentApprovalSpvFilter = localStorage.getItem('spv_approval_filter') || 'Semua';

function changeApprovalSpvFilter(val) {
  window.currentApprovalSpvFilter = val;
  localStorage.setItem('spv_approval_filter', val);
  fetchData();
}

async function fetchData() {
  const spvParam = window.currentApprovalSpvFilter || 'Semua';
  try {
    // Load SPKs
    const spkUrl = (spvParam === 'Semua' || !spvParam) ? `../api/api_spk.php?all=true` : `../api/api_spk.php?spv=${encodeURIComponent(spvParam)}`;
    const spkRes = await fetch(spkUrl);
    const spkJson = await spkRes.json();
    if (spkJson.status === 'success') {
      spkData = spkJson.data || [];
    }

    // Load OLX Trade Ins
    const olxUrl = (spvParam === 'Semua' || !spvParam) ? `../api/api_olx.php?all=true` : `../api/api_olx.php?spv=${encodeURIComponent(spvParam)}`;
    const olxRes = await fetch(olxUrl);
    const olxJson = await olxRes.json();
    if (olxJson.status === 'success') {
      olxData = olxJson.data || [];
    }

    // Load Test Drive
    const tdRes = await fetch(`../api/api_spv_approval_testdrive.php`);
    const tdJson = await tdRes.json();
    if (tdJson.status === 'success') {
      testDriveData = tdJson.data || [];
    }

    updateBadges();

    if (currentView === 'spk') {
      renderSpkList();
    } else if (currentView === 'olx') {
      renderOlxList();
    } else {
      renderTestDriveList();
    }
  } catch (e) {
    console.error(e);
    document.getElementById('approvalContent').innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal menghubungkan ke server.</p>';
  }
}

function updateBadges() {
  const pendingSpk = spkData.filter(s => s.status === 'Menunggu').length;
  const pendingOlx = olxData.filter(o => o.status === 'Pending').length;
  const pendingTd = testDriveData.filter(t => t.status === 'Menunggu' || t.status === 'Pending').length;

  document.getElementById('countSpkBadge').textContent = pendingSpk;
  document.getElementById('countOlxBadge').textContent = pendingOlx;
  document.getElementById('countTestDriveBadge').textContent = pendingTd;

  const totalPending = pendingSpk + pendingOlx + pendingTd;
  const navBadge = document.getElementById('navApprovalBadge');
  if (navBadge) {
    if (totalPending > 0) {
      navBadge.textContent = totalPending;
      navBadge.style.display = 'inline-flex';
    } else {
      navBadge.style.display = 'none';
    }
  }
}

function emptyStateHtml(icon, title, text) {
  return `
    <div class="empty-state">
      <div class="es-icon"><i class="fa-solid ${icon}"></i></div>
      <div class="es-title">${title}</div>
      <div class="es-text">${text}</div>
    </div>`;
}

function renderSpkList() {
  const content = document.getElementById('approvalContent');
  if (spkData.length === 0) {
    content.innerHTML = emptyStateHtml('fa-file-invoice', 'Tidak ada pengajuan SPK', 'Pengajuan SPK dari tim Anda akan muncul di sini.');
    return;
  }

  content.innerHTML = `
        <div class="approval-grid">
          ${spkData.map(s => {
    let statusClass = 'status-pending';
    let statusLabel = 'Menunggu';
    if (s.status === 'Disetujui') {
      statusClass = 'status-approved';
      statusLabel = 'Disetujui';
    } else if (s.status === 'Ditolak') {
      statusClass = 'status-rejected';
      statusLabel = 'Ditolak';
    }

    let footerHtml = '';
    if (s.status === 'Menunggu') {
      footerHtml = `
                <div class="card-footer" style="justify-content: flex-end;">
                  <button class="btn-action btn-reject" onclick="updateSpkStatus(${s.id}, 'Ditolak', this)">
                    <i class="fa-solid fa-xmark"></i> Tolak
                  </button>
                  <button class="btn-action btn-approve" onclick="updateSpkStatus(${s.id}, 'Disetujui', this)">
                    <i class="fa-solid fa-check"></i> Setujui
                  </button>
                </div>
              `;
    } else {
      footerHtml = `
                <div class="card-footer" style="justify-content: space-between; align-items: center;">
                  <span style="font-size:11px; font-weight:700; color:var(--muted);"><i class="fa-solid fa-clock-rotate-left"></i> Histori</span>
                  <button class="btn-action" style="background:#fee2e2; color:#ef4444;" onclick="deleteSpk(${s.id}, this)">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </div>
              `;
    }

    const date = new Date(s.created_at.replace(/-/g, '/'));
    const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return `
              <div class="approval-card">
                <div class="card-header">
                  <div>
                    <div class="card-title">SPK — ${s.nama_customer}</div>
                    <div class="card-meta">
                      <span><i class="fa-solid fa-user"></i> ${s.nama_sales || 'Sales'}</span>
                      <span><i class="fa-regular fa-calendar"></i> ${timeStr}</span>
                    </div>
                  </div>
                  <span class="badge-status ${statusClass}">${statusLabel}</span>
                </div>
                <div class="card-body">
                  <div class="kv-grid">
                    <div class="kv-item">
                      <div class="kv-label">Model Kendaraan</div>
                      <div class="kv-value">${s.model}</div>
                    </div>
                    <div class="kv-item">
                      <div class="kv-label">Tipe Pembelian</div>
                      <div class="kv-value">${s.tipe_pembelian}</div>
                    </div>
                  </div>
                  <div class="data-row">
                    <span>No. HP Customer</span>
                    <strong>${s.no_hp}</strong>
                  </div>
                  <div class="data-row">
                    <span>Nominal Pengajuan</span>
                    <strong style="color:var(--blue); font-size:15px;">Rp ${s.nominal_jt} Jt</strong>
                  </div>
                </div>
                ${footerHtml}
              </div>
            `;
  }).join('')}
        </div>
      `;
}


function renderOlxList() {
  const content = document.getElementById('approvalContent');
  if (olxData.length === 0) {
    content.innerHTML = emptyStateHtml('fa-exchange-alt', 'Tidak ada pengajuan Trade-In', 'Pengajuan Trade-In OLX dari tim Anda akan muncul di sini.');
    return;
  }

  content.innerHTML = `
        <div class="approval-grid">
          ${olxData.map(o => {
    let statusClass = 'status-pending';
    let statusLabel = 'Menunggu';
    if (o.status === 'Approved') {
      statusClass = 'status-approved';
      statusLabel = 'Approved';
    } else if (o.status === 'Rejected') {
      statusClass = 'status-rejected';
      statusLabel = 'Ditolak';
    }

    let photoHtml = '';
    if (o.foto_paths && o.foto_paths.length > 0) {
      photoHtml = `
                <div class="photo-thumb-grid">
                  ${o.foto_paths.map(p => `
                    <div class="photo-thumb" onclick="zoomImage('../${p}')">
                      <img src="../${p}">
                    </div>
                  `).join('')}
                </div>
              `;
    }

    let footerHtml = '';
    if (o.status === 'Pending') {
      footerHtml = `
                <div class="card-footer" style="flex-direction: column; gap:12px; align-items:stretch;">
                  <div style="display:flex; gap:10px; width:100%;">
                    <div class="price-input-group">
                      <span>Rp</span>
                      <input type="text" inputmode="numeric" placeholder="Input harga jual SPV..." id="olx_price_${o.id}" oninput="this.value = this.value.replace(/\\D/g, '').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.')">
                    </div>
                  </div>
                  <div style="display:flex; justify-content: flex-end; gap:8px;">
                    <button class="btn-action btn-reject" onclick="updateOlxStatus(${o.id}, 'Rejected', this)">
                      <i class="fa-solid fa-xmark"></i> Tolak
                    </button>
                    <button class="btn-action btn-approve" onclick="updateOlxStatus(${o.id}, 'Approved', this)">
                      <i class="fa-solid fa-check"></i> Setujui & Kirim Harga
                    </button>
                  </div>
                </div>
              `;
    } else {
      footerHtml = `
                <div class="card-footer" style="justify-content: space-between;">
                  <span style="font-size:11px; font-weight:700; color:var(--muted); text-transform:uppercase;">Harga Jual Final</span>
                  <span style="font-weight:800; color:${o.status === 'Approved' ? 'var(--green)' : 'var(--red)'}; font-size:15px; font-variant-numeric:tabular-nums;">
                    ${o.status === 'Approved' ? 'Rp ' + (parseInt(o.harga_estimasi) < 1000000 ? parseInt(o.harga_estimasi) * 1000000 : parseInt(o.harga_estimasi)).toLocaleString('id-ID') : 'Ditolak'}
                  </span>
                </div>
              `;
    }

    const date = new Date(o.created_at.replace(/-/g, '/'));
    const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

    return `
              <div class="approval-card">
                <div class="card-header">
                  <div>
                    <div class="card-title">${o.nama_kendaraan}</div>
                    <div class="card-meta">
                      <span><i class="fa-solid fa-user"></i> ${o.nama_sales || 'Sales'}</span>
                      <span><i class="fa-regular fa-calendar"></i> ${timeStr}</span>
                    </div>
                  </div>
                  <span class="badge-status ${statusClass}">${statusLabel}</span>
                </div>
                <div class="card-body">
                  <div class="kv-grid" style="grid-template-columns:1fr 1fr 1fr; padding-bottom:10px; border-bottom:1px solid var(--border);">
                    <div class="kv-item">
                      <div class="kv-label">Jenis</div>
                      <div class="kv-value">${o.jenis_type}</div>
                    </div>
                    <div class="kv-item">
                      <div class="kv-label">Tahun</div>
                      <div class="kv-value">${o.tahun}</div>
                    </div>
                    <div class="kv-item">
                      <div class="kv-label">Warna</div>
                      <div class="kv-value">${o.warna}</div>
                    </div>
                  </div>
                  <div style="margin:10px 0;">
                    <div class="kv-label" style="font-size:10.5px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.4px; margin-bottom:2px;">Lokasi Kecamatan</div>
                    <div style="font-weight:700; color:var(--text); font-size:12.5px;"><i class="fa-solid fa-location-dot" style="color:var(--brand); margin-right:5px;"></i>${o.lokasi_kecamatan}</div>
                  </div>
                  <div>
                    <div class="kv-label" style="font-size:10.5px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.4px; margin-bottom:2px;">Deskripsi / Kondisi</div>
                    <p style="font-size:12.5px; color:var(--muted); margin:0; line-height:1.5;">${o.deskripsi_kondisi}</p>
                  </div>
                  ${photoHtml}
                </div>
                ${footerHtml}
              </div>
            `;
  }).join('')}
        </div>
      `;
}

async function updateSpkStatus(id, newStatus, btn) {
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const res = await fetch('../api/api_spk.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'spv_approve',
        spk_id: id,
        status: newStatus
      })
    });
    const json = await res.json();
    if (json.status === 'success') {
      const item = spkData.find(s => s.id == id);
      if (item) item.status = newStatus;
      updateBadges();
      renderSpkList();
    } else {
      alert('Gagal update: ' + json.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi.');
    btn.disabled = false;
  }
}

async function deleteSpk(id, btn) {
  const isConfirmed = await (window.customConfirm ? window.customConfirm('Apakah Anda yakin ingin menghapus histori SPK ini? Data yang dihapus tidak dapat dikembalikan.') : confirm('Apakah Anda yakin ingin menghapus histori SPK ini? Data yang dihapus tidak dapat dikembalikan.'));
    if (!isConfirmed) return;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const res = await fetch('../api/api_spk.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'delete_spk',
        spk_id: id
      })
    });
    const json = await res.json();
    if (json.status === 'success') {
      spkData = spkData.filter(s => s.id != id);
      updateBadges();
      renderSpkList();
    } else {
      alert('Gagal menghapus: ' + json.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus';
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi saat menghapus.');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus';
  }
}

async function updateOlxStatus(id, newStatus, btn) {
  let price = 0;
  if (newStatus === 'Approved') {
    const priceInput = document.getElementById(`olx_price_${id}`);
    price = parseInt(priceInput.value.replace(/\D/g, ''));
    if (!price || price <= 0) {
      alert('Harap masukkan harga estimasi trade-in terlebih dahulu.');
      priceInput.focus();
      return;
    }
    if (price < 1000000) {
      price = price * 1000000;
    }
  }

  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const res = await fetch('../api/api_olx.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'approve',
        id: id,
        status: newStatus,
        harga_estimasi: price
      })
    });
    const json = await res.json();
    if (json.status === 'success') {
      const item = olxData.find(o => o.id == id);
      if (item) {
        item.status = newStatus;
        item.harga_estimasi = price;
      }
      updateBadges();
      renderOlxList();
    } else {
      alert('Gagal update: ' + json.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-check"></i>';
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi.');
    btn.disabled = false;
  }
}

function zoomImage(src) {
  document.getElementById('zoomedImg').src = src;
  document.getElementById('imageZoomModal').style.display = 'flex';
}

function closeImageZoom() {
  document.getElementById('imageZoomModal').style.display = 'none';
}

// ================== TEST DRIVE ==================
function renderTestDriveList() {
  const content = document.getElementById('approvalContent');
  if (testDriveData.length === 0) {
    content.innerHTML = emptyStateHtml('fa-car-side', 'Tidak ada pengajuan Test Drive', 'Pengajuan Test Drive dari tim Anda akan muncul di sini.');
    return;
  }

  content.innerHTML = `
        <div class="approval-grid">
          ${testDriveData.map(s => {
    let statusClass = 'status-pending';
    let statusLabel = 'Menunggu';
    if (s.status === 'Disetujui' || s.status === 'Approved') {
      statusClass = 'status-approved';
      statusLabel = 'Disetujui';
    } else if (s.status === 'Ditolak' || s.status === 'Rejected') {
      statusClass = 'status-rejected';
      statusLabel = 'Ditolak';
    }

    let footerHtml = '';
    if (s.status === 'Menunggu' || s.status === 'Pending') {
      footerHtml = `
                <div class="card-footer" style="justify-content: flex-end;">
                  <button class="btn-action btn-reject" onclick="updateTestDriveStatus(${s.id}, 'Rejected', this)">
                    <i class="fa-solid fa-xmark"></i> Tolak
                  </button>
                  <button class="btn-action btn-approve" onclick="updateTestDriveStatus(${s.id}, 'Approved', this)">
                    <i class="fa-solid fa-check"></i> Setujui
                  </button>
                </div>
              `;
    } else {
      footerHtml = `
                <div class="card-footer" style="justify-content: space-between; align-items: center;">
                  <span style="font-size:11px; font-weight:700; color:var(--muted);"><i class="fa-solid fa-clock-rotate-left"></i> Histori</span>
                  <button class="btn-action" style="background:#fee2e2; color:#ef4444;" onclick="deleteTestDrive(${s.id}, this)">
                    <i class="fa-solid fa-trash"></i> Hapus
                  </button>
                </div>
              `;
    }

    return `
              <div class="approval-card">
                <div class="card-header">
                  <div style="display:flex; flex-direction:column;">
                    <span style="font-weight:700; font-size:14px; color:var(--text);"><i class="fa-solid fa-user-tie" style="margin-right:6px; color:var(--blue);"></i> ${s.nama_sales}</span>
                    <span style="font-size:11.5px; color:var(--muted); margin-top:2px;">${s.created_at}</span>
                  </div>
                  <span class="badge-status ${statusClass}">${statusLabel}</span>
                </div>
                <div class="card-body">
                  <div class="data-row">
                    <span>Customer</span>
                    <strong>${s.nama_customer}</strong>
                  </div>
                  <div class="data-row">
                    <span>Unit</span>
                    <strong>${s.model} ${s.type} (${s.warna})</strong>
                  </div>
                  <div class="data-row">
                    <span>Jadwal</span>
                    <strong>${s.jadwal.replace('T', ' ')}</strong>
                  </div>
                  <div class="data-row">
                    <span>Rute</span>
                    <strong>${s.rute}</strong>
                  </div>
                </div>
                ${footerHtml}
              </div>
            `;
  }).join('')}
        </div>
      `;
}

async function updateTestDriveStatus(id, newStatus, btnElement) {
  const isConfirmed = await (window.customConfirm ? window.customConfirm(`Yakin ingin ${newStatus === 'Approved' ? 'menyetujui' : 'menolak'} pengajuan Test Drive ini?`) : confirm(`Yakin ingin ${newStatus === 'Approved' ? 'menyetujui' : 'menolak'} pengajuan Test Drive ini?`));
    if (!isConfirmed) return;

  btnElement.disabled = true;
  btnElement.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const spvName = localStorage.getItem('namaSales') || 'SPV System';
    const res = await fetch('../api/api_spv_approval_testdrive.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id, status: newStatus, spv_nama: spvName })
    });
    const json = await res.json();
    if (json.status === 'success') {
      const item = testDriveData.find(t => t.id == id);
      if (item) {
        item.status = newStatus;
        item.spv_approval = spvName;
      }
      updateBadges();
      renderTestDriveList();
    } else {
      alert('Gagal update: ' + json.message);
      btnElement.disabled = false;
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi.');
    btnElement.disabled = false;
  }
}

async function deleteTestDrive(id, btn) {
  const isConfirmed = await (window.customConfirm ? window.customConfirm('Apakah Anda yakin ingin menghapus histori Test Drive ini? Data yang dihapus tidak dapat dikembalikan.') : confirm('Apakah Anda yakin ingin menghapus histori Test Drive ini? Data yang dihapus tidak dapat dikembalikan.'));
    if (!isConfirmed) return;
  
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';

  try {
    const res = await fetch('../api/api_spv_approval_testdrive.php', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const json = await res.json();
    if (json.status === 'success') {
      testDriveData = testDriveData.filter(t => t.id != id);
      updateBadges();
      renderTestDriveList();
    } else {
      alert('Gagal menghapus: ' + json.message);
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus';
    }
  } catch (err) {
    console.error(err);
    alert('Terjadi kesalahan koneksi saat menghapus.');
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-trash"></i> Hapus';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  guardSPV();
  renderUser();
  fetchData();
});
