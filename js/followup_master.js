/**
 * followup_master.js - Master Follow-Up CRM Module for SPV & Kacab in SFT
 * Tunas Toyota Kiara Condong
 */

let masterState = {
  customers: [],
  salesList: [],
  templates: [],
  stats: {},
  selectedIds: [],
  filters: {
    search: '',
    sales_id: 'all',
    status: 'all',
    category: 'all'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initMasterDashboard();
});

async function initMasterDashboard() {
  await Promise.all([
    loadSalesList(),
    loadTemplates(),
    loadMasterStats(),
    loadMasterCustomers()
  ]);
}

function getLoggedInSpvName() {
  const peran = localStorage.getItem('peranSales') || 'Supervisor';
  if (peran === 'Supervisor' || peran === 'SPV') {
    return localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Pak Ryan';
  }
  return '';
}

async function loadSalesList() {
  try {
    const spv = getLoggedInSpvName();
    const res = await fetch(`../api/api_followup.php?action=sales&spv=${encodeURIComponent(spv)}`);
    const data = await res.json();
    if (data.success) {
      masterState.salesList = data.data || [];
      populateSalesDropdowns();
    }
  } catch (e) {
    console.error('Error loading sales list', e);
  }
}

async function loadTemplates() {
  try {
    const res = await fetch('../api/api_followup.php?action=templates');
    const data = await res.json();
    if (data.success) {
      masterState.templates = data.data || [];
    }
  } catch (e) {
    console.error('Error loading templates', e);
  }
}

async function loadMasterStats() {
  try {
    const res = await fetch('../api/api_followup.php?action=stats');
    const data = await res.json();
    if (data.success) {
      masterState.stats = data.stats || {};
      renderStatsTiles();
      renderQuotaRefillNotification(masterState.stats.readyForRefillSales || []);
      populateCategoryDropdown();
    }
  } catch (e) {
    console.error('Error loading stats', e);
  }
}

function renderStatsTiles() {
  const s = masterState.stats;
  const byStatus = s.byStatus || {};

  document.getElementById('kpiTotal').textContent = s.total || 0;
  document.getElementById('kpiPending').textContent = byStatus['Belum Dihubungi'] || 0;
  document.getElementById('kpiWaiting').textContent = byStatus['Menunggu Respon'] || 0;
  document.getElementById('kpiInterested').textContent = byStatus['Tertarik / Jadwal Servis'] || 0;
  document.getElementById('kpiDeal').textContent = byStatus['Deal / Selesai'] || 0;
}

function renderQuotaRefillNotification(readySales) {
  const bar = document.getElementById('quotaRefillNotificationBar');
  if (!bar) return;

  if (!readySales || readySales.length === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  let salesCardsHtml = '';
  readySales.forEach(s => {
    salesCardsHtml += `
      <div style="background:#ffffff; border:1.5px solid #bbf7d0; border-radius:12px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 2px 8px rgba(22,101,52,0.06);">
        <div>
          <div style="font-weight:800; color:#0f172a; font-size:13px; display:flex; align-items:center; gap:6px;">
            <span>${s.name}</span>
            <span style="font-size:10.5px; font-weight:700; color:#15803d; background:#dcfce7; padding:2px 8px; border-radius:9999px;">
              ${s.spv ? `${s.spv}` : 'Sales'}
            </span>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:2px;">
            Progres: <strong style="color:#15803d;">${s.processed_count}/${s.total_assigned} Follow-Up (${s.completion_rate}%)</strong> • Sisa Belum Dihubungi: <strong>${s.pending_count}</strong>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn-fu btn-fu-crimson" style="padding:6px 12px; font-size:11.5px; border-radius:8px;" onclick="refillSalesLeads(${s.id}, '${escapeJs(s.name)}', 50)">
            <i class="fa-solid fa-plus"></i> Tambah +50 Leads
          </button>
          <a href="https://wa.me/${s.phone}" target="_blank" class="btn-fu btn-fu-emerald" style="padding:6px 10px; font-size:11.5px; border-radius:8px; text-decoration:none;" title="Chat WA Sales">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    `;
  });

  bar.style.display = 'block';
  bar.innerHTML = `
    <div style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.5px solid #86efac; border-radius:16px; padding:16px 20px; box-shadow:0 4px 20px rgba(16,185,129,0.12);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:32px; height:32px; border-radius:50%; background:#22c55e; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 2px 8px rgba(34,197,94,0.4);">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div>
            <h4 style="font-size:14px; font-weight:800; color:#14532d; margin:0;">
              Pemberitahuan: ${readySales.length} Wiraniaga Telah Menyelesaikan Batch Follow-Up!
            </h4>
            <p style="font-size:11.5px; color:#166534; margin:2px 0 0 0;">
              Wiraniaga di bawah telah memproses leads mereka dan siap diberikan kuota leads baru dari database.
            </p>
          </div>
        </div>
        <span style="font-size:11px; font-weight:800; background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; padding:4px 10px; border-radius:9999px;">
          ⚡ Siap Refill Leads
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:10px;">
        ${salesCardsHtml}
      </div>
    </div>
  `;
}

async function refillSalesLeads(salesId, salesName, quota = 50) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Tambahkan batch +${quota} data customer baru dari database unassigned ke akun ${salesName}?`);
  } else {
    isConfirmed = confirm(`Tambahkan batch +${quota} data customer baru ke ${salesName}?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=add_more_leads_to_sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_id: salesId, quota: quota })
    });
    const data = await res.json();

    if (data.success) {
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Leads Ditambahkan!', `${data.message}\n\nAnda dapat langsung mengirimkan notifikasi rekap tugas via WhatsApp ke wiraniaga.`, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Informasi', data.message, 'warning');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Refill error', e);
  }
}

function populateSalesDropdowns() {
  const filterSelect = document.getElementById('filterSalesSelect');
  const bulkSelect = document.getElementById('bulkSalesSelect');
  const assignTaskSelect = document.getElementById('assignTaskSalesSelect');

  if (filterSelect) {
    filterSelect.innerHTML = '<option value="all">Semua Sales PIC</option><option value="unassigned">🔥 Pool Rebutan (Ex-Sales / Belum Ditugaskan)</option>';
    masterState.salesList.forEach(s => {
      filterSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.total_customers || 0} Task)</option>`;
    });
  }

  if (bulkSelect) {
    bulkSelect.innerHTML = '<option value="">-- Pilih Sales Target --</option>';
    masterState.salesList.forEach(s => {
      bulkSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  }

  if (assignTaskSelect) {
    assignTaskSelect.innerHTML = '<option value="">-- Kirim WA Notif ke Sales --</option>';
    masterState.salesList.forEach(s => {
      assignTaskSelect.innerHTML += `<option value="${s.id}">${s.name} (+${s.phone})</option>`;
    });
  }
}

function populateCategoryDropdown() {
  const catSelect = document.getElementById('filterCategorySelect');
  if (!catSelect) return;

  const cats = masterState.stats.byCategory || {};
  catSelect.innerHTML = '<option value="all">Semua Kategori</option>';
  Object.keys(cats).forEach(cat => {
    catSelect.innerHTML += `<option value="${cat}">${cat} (${cats[cat]})</option>`;
  });
}

async function loadMasterCustomers() {
  const tbody = document.getElementById('masterCustomerTbody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:30px; color:#64748b;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:20px; color:#d7123a; margin-bottom:8px;"></i><br>
          Memuat database customer...
        </td>
      </tr>
    `;
  }

  try {
    const { search, sales_id, status, category } = masterState.filters;
    const spv = getLoggedInSpvName();
    const url = `../api/api_followup.php?action=customers&search=${encodeURIComponent(search)}&sales_id=${sales_id}&status=${status}&category=${encodeURIComponent(category)}&spv=${encodeURIComponent(spv)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      masterState.customers = data.data || [];
      renderCustomerTable();
    }
  } catch (e) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding:30px; color:red;">
            Gagal memuat data customer dari server.
          </td>
        </tr>
      `;
    }
  }
}

function renderCustomerTable() {
  const tbody = document.getElementById('masterCustomerTbody');
  if (!tbody) return;

  const list = masterState.customers;
  document.getElementById('tableCountText').textContent = `Total: ${list.length} Customer`;

  if (list.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:60px 20px; color:#94a3b8;">
          <i class="fa-solid fa-folder-open" style="font-size:32px; margin-bottom:12px; color:#cbd5e1;"></i><br>
          <strong style="font-size:14px; color:#0f172a;">Tidak ada data customer yang sesuai</strong><br>
          <span style="font-size:12px;">Coba ubah kata kunci pencarian atau filter kategori di atas.</span>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  list.forEach(c => {
    const isSelected = masterState.selectedIds.includes(c.id);

    // Generate Initials
    const rawName = (c.name || 'Customer').trim();
    const parts = rawName.split(/\s+/);
    let initials = '';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      initials = rawName.substring(0, 2).toUpperCase();
    }

    html += `
      <tr style="${isSelected ? 'background:#fff1f2;' : ''}">
        <!-- 1. Checkbox -->
        <td style="text-align:center; width:44px;">
          <input type="checkbox" style="width:17px; height:17px; accent-color:#d7123a; cursor:pointer;" ${isSelected ? 'checked' : ''} onchange="toggleSelectCustomer(${c.id})">
        </td>

        <!-- 2. Customer & Kontak -->
        <td style="min-width:240px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="cust-avatar-circle">${initials}</div>
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:13.5px; line-height:1.25;">${c.name}</div>
              <div style="font-family:monospace; font-size:11.5px; color:#059669; font-weight:700; margin-top:3px;">
                <a href="https://wa.me/${c.phone}" target="_blank" style="color:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                  <i class="fa-brands fa-whatsapp" style="font-size:13px;"></i> +${c.phone}
                </a>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                ${c.district ? `<span style="font-size:10.5px; color:#64748b;"><i class="fa-solid fa-location-dot" style="color:#94a3b8; font-size:9.5px;"></i> Kec. ${c.district}</span>` : ''}
                ${c.customer_type ? `<span style="font-size:9.5px; font-weight:800; padding:1px 6px; border-radius:4px; background:#f1f5f9; color:#475569;">${c.customer_type}</span>` : ''}
              </div>
            </div>
          </div>
        </td>

        <!-- 3. Unit Mobil & Usia -->
        <td style="min-width:230px;">
          <div style="font-weight:900; color:#d7123a; font-size:13.5px; letter-spacing:-0.2px; display:flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-car-side" style="color:#d7123a;"></i> ${c.recommended_model || c.car_model}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            ${c.last_car_model ? `<span class="badge-last-car">Saat ini: <strong>${c.last_car_model}</strong></span>` : ''}
            ${c.car_age ? `<span class="badge-car-age"><i class="fa-solid fa-clock"></i> ${c.car_age}</span>` : ''}
          </div>
          ${(c.alt_model_2 || c.alt_model_3) ? `
            <div style="font-size:10.5px; color:#64748b; margin-top:3px;">
              🔄 Alt: <strong style="color:#334155;">${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(', ')}</strong>
            </div>
          ` : ''}
          ${c.vin ? `<div style="font-size:9.5px; font-family:monospace; color:#94a3b8; margin-top:2px;">VIN: ${c.vin}</div>` : ''}
        </td>

        <!-- 4. Kategori & Klaster -->
        <td style="min-width:190px;">
          ${c.cluster_name ? `<div><span class="badge-cluster-pill" style="background:#f8fafc; color:#334155; border-color:#e2e8f0; font-size:10.5px; margin-bottom:3px;">🏷️ ${c.cluster_name}</span></div>` : ''}
          ${c.priority ? `<div><span class="badge-priority-pill" style="font-size:10px; margin-bottom:3px;">⚡ ${c.priority}</span></div>` : ''}
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
            ${c.outlet_do ? `<span style="font-size:9.5px; color:#64748b; background:#f8fafc; border:1px solid #e2e8f0; padding:1px 5px; border-radius:4px;"><i class="fa-solid fa-building" style="font-size:9px;"></i> DO: ${c.outlet_do}</span>` : ''}
            ${c.service_compliance ? `<span style="font-size:9.5px; background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:1px 5px; border-radius:4px;"><i class="fa-solid fa-wrench" style="font-size:9px;"></i> Servis: ${c.service_compliance}</span>` : ''}
          </div>
        </td>

        <!-- 5. Status Terkini (No Clipping) -->
        <td style="min-width:185px;">
          <select class="fu-table-select" onchange="inlineUpdateStatus(${c.id}, this.value)">
            <option value="Belum Dihubungi" ${c.followup_status === 'Belum Dihubungi' ? 'selected' : ''}>⚪ Belum Dihubungi</option>
            <option value="Menunggu Respon" ${c.followup_status === 'Menunggu Respon' ? 'selected' : ''}>🟡 Menunggu Respon</option>
            <option value="Tertarik / Jadwal Servis" ${c.followup_status === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>🔵 Tertarik / Servis</option>
            <option value="Deal / Selesai" ${c.followup_status === 'Deal / Selesai' ? 'selected' : ''}>🟢 Deal / Selesai</option>
            <option value="Tidak Tertarik" ${c.followup_status === 'Tidak Tertarik' ? 'selected' : ''}>🔴 Tidak Tertarik</option>
          </select>
        </td>

        <!-- 6. Sales PIC (No Clipping) -->
        <td style="min-width:190px;">
          <select class="fu-table-select" onchange="inlineUpdateSales(${c.id}, this.value)">
            <option value="">-- Belum Ditugaskan --</option>
            ${masterState.salesList.map(s => `
              <option value="${s.id}" ${c.assigned_sales_id == s.id ? 'selected' : ''}>${s.name}</option>
            `).join('')}
          </select>
        </td>

        <!-- 7. Respon & Catatan FU -->
        <td style="min-width:210px; font-size:11.5px; color:#64748b;">
          ${c.remarks ? `
            <div style="margin-bottom:3px; display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
              <span class="badge-cluster-pill" style="font-size:10.5px; font-weight:800; background:#f0fdf4; color:#15803d; border-color:#bbf7d0;">
                ${c.remarks}
              </span>
              <span style="font-size:9.5px; font-weight:800; padding:1px 5px; border-radius:4px; background:${c.sales_fu_status === 'Closed' ? '#fee2e2; color:#991b1b;' : '#e0f2fe; color:#0369a1;'}">
                ${c.sales_fu_status || 'Open'}
              </span>
            </div>
            <div style="font-size:10px; color:#475569; display:flex; gap:4px; flex-wrap:wrap; margin-bottom:2px;">
              <span style="color:${(c.connected === 'TRUE' || c.connected === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Conn: ${(c.connected === 'TRUE' || c.connected === 'IYA') ? '✅' : '❌'}</span>
              <span style="color:${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Cont: ${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '✅' : '❌'}</span>
              <span style="color:${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Prosp: ${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '✅' : '❌'}</span>
              <span style="color:${(c.spk === 'TRUE' || c.spk === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">SPK: ${(c.spk === 'TRUE' || c.spk === 'IYA') ? '✅' : '❌'}</span>
            </div>
            ${c.reason_followup ? `<div style="font-size:10.5px; color:#334155; font-style:italic; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${c.reason_followup}">"${c.reason_followup}"</div>` : ''}
            ${c.followup_date ? `<div style="font-size:9.5px; color:#94a3b8; font-family:monospace;">📅 ${c.followup_date.substring(0, 16)}</div>` : ''}
          ` : `
            <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${c.notes || '-'}">
              ${c.notes || '-'}
            </div>
          `}
        </td>

        <!-- 8. Aksi -->
        <td style="text-align:right; min-width:150px;">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:5px;">
            <button class="btn-fu btn-fu-secondary" style="padding:6px 10px; font-size:11px; border-radius:8px;" onclick="openCustomerDetailModal(${c.id})" title="Lihat Profil Lengkap Customer 360°">
              <i class="fa-solid fa-circle-info"></i> Detail
            </button>
            <button class="btn-fu btn-fu-emerald" style="padding:6px 10px; font-size:11px; border-radius:8px;" onclick="openWhatsAppDirect(${c.id})" title="Follow Up WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> WA
            </button>
            <button class="btn-fu" style="padding:6px 8px; font-size:11px; background:#fef2f2; color:#ef4444 !important; border:1px solid #fecaca; border-radius:8px;" onclick="confirmDeleteCustomer(${c.id}, '${escapeJs(c.name)}')" title="Hapus Customer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Sync Thead Checkbox State
  const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
  theadCheckboxes.forEach(cb => {
    cb.checked = list.length > 0 && list.every(c => masterState.selectedIds.includes(c.id));
  });
}

// -------------------------------------------------------------
// CUSTOMER 360 DETAIL MODAL
// -------------------------------------------------------------
function openCustomerDetailModal(customerId) {
  const c = masterState.customers.find(x => String(x.id) === String(customerId));
  if (!c) {
    console.error('Customer not found for id', customerId);
    return;
  }

  if (!document.getElementById('modalCustomerDetail')) {
    const html = `
      <div class="modal-overlay" id="modalCustomerDetail" onclick="closeCustomerDetailModal()">
        <div class="modal-content" style="max-width:680px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-id-card"></i> Customer 360° Profile
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;" id="cdCustName">-</h3>
            </div>
            <button class="btn-close-modal" onclick="closeCustomerDetailModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div id="cdModalBody"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  document.getElementById('cdCustName').textContent = c.name;

  const body = document.getElementById('cdModalBody');
  body.innerHTML = `
    <!-- Top Highlights Banner -->
    <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#ffffff; border-radius:14px; padding:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <div style="font-size:11px; color:#93c5fd; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">Target Rekomendasi TAM</div>
        <div style="font-size:18px; font-weight:900; color:#ffffff; margin-top:2px;">🚗 ${c.recommended_model || c.car_model}</div>
        <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">
          ${(c.alt_model_2 || c.alt_model_3) ? `Alternatif: <strong>${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(' • ')}</strong>` : 'Rekomendasi Utama'}
        </div>
      </div>
      <div style="text-align:right;">
        <span style="display:inline-block; font-size:11px; font-weight:800; padding:4px 10px; border-radius:9999px; background:#d7123a; color:#ffffff;">
          ${c.priority || '4th Priority'}
        </span>
        <div style="font-size:11px; color:#6ee7b7; font-weight:700; margin-top:4px; font-family:monospace;">
          +${c.phone}
        </div>
      </div>
    </div>

    <!-- 2 Column Grid for Vehicle & Purchase History -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <!-- Card Left: Current Vehicle -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px;">
        <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-car" style="color:#d7123a;"></i> Kendaraan Saat Ini
        </div>
        <div style="font-size:12px; color:#475569; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Model Mobil:</span>
            <strong style="color:#0f172a;">${c.last_car_model || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Usia Kendaraan:</span>
            <strong style="color:#b45309;">${c.car_age || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>No. Rangka (VIN):</span>
            <span style="font-family:monospace; font-size:11px; color:#0f172a; font-weight:700;">${c.vin || '-'}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Domisili:</span>
            <strong>${c.district ? `Kec. ${c.district}` : '-'}</strong>
          </div>
        </div>
      </div>

      <!-- Card Right: Dealer & Service History -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px;">
        <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-wrench" style="color:#2563eb;"></i> Riwayat Dealer & Servis
        </div>
        <div style="font-size:12px; color:#475569; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Klaster TAM:</span>
            <strong style="color:#1d4ed8;">${c.cluster_name || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Outlet DO Asal:</span>
            <strong style="color:#0f172a; font-size:11.5px;">${c.outlet_do || 'TUNAS TOYOTA KIARA CONDONG'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Kepatuhan Servis:</span>
            <strong style="color:#059669;">${c.service_compliance || '0%'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Tipe Pelanggan:</span>
            <span style="font-weight:700; color:#0f172a;">${c.customer_type || 'RETAIL'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAM Sales Follow-Up Outcome Box -->
    <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:12px; padding:14px; margin-bottom:16px;">
      <div style="font-size:12px; font-weight:800; color:#166534; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
        <i class="fa-solid fa-clipboard-check"></i> Hasil Respon Follow-Up Standar TAM
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:10px;">
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Connected</div>
          <strong style="font-size:12px; color:${(c.connected === 'TRUE' || c.connected === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.connected === 'TRUE' || c.connected === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Contacted</div>
          <strong style="font-size:12px; color:${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Prospect</div>
          <strong style="font-size:12px; color:${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">SPK</div>
          <strong style="font-size:12px; color:${(c.spk === 'TRUE' || c.spk === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.spk === 'TRUE' || c.spk === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11.5px; color:#334155;">
        <div>
          <span>Remarks:</span> <strong style="color:#0f172a;">${c.remarks || '-'}</strong>
        </div>
        <div>
          <span>Status FU:</span> <strong style="color:${c.sales_fu_status === 'Closed' ? '#dc2626' : '#2563eb'};">${c.sales_fu_status || 'Open'}</strong>
        </div>
        <div style="grid-column: span 2;">
          <span>Alasan / Catatan:</span> <strong style="color:#0f172a;">${c.reason_followup || c.notes || '-'}</strong>
        </div>
        <div style="grid-column: span 2; font-size:10.5px; color:#64748b; font-family:monospace;">
          📅 Waktu FU Otomatis: <strong>${c.followup_date || 'Belum di-FU'}</strong>
        </div>
      </div>
    </div>

    <!-- Status & Sales PIC Box -->
    <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:18px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Status Follow-Up Saat Ini:</label>
          <span style="display:inline-block; font-size:12px; font-weight:800; padding:4px 10px; border-radius:8px; background:#eff6ff; color:#1d4ed8;">
            ${c.followup_status}
          </span>
        </div>
        <div>
          <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Sales PIC:</label>
          <strong style="font-size:12.5px; color:#0f172a;">
            ${(masterState.salesList.find(s => s.id == c.assigned_sales_id) || {}).name || 'Belum Ditugaskan'}
          </strong>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display:flex; gap:10px;">
      <button class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:12px;" onclick="closeCustomerDetailModal(); openWhatsAppDirect(${c.id});">
        <i class="fa-brands fa-whatsapp"></i> Follow Up via WhatsApp
      </button>
      <a href="tel:${c.phone}" class="btn-fu btn-fu-secondary" style="padding:12px 18px; text-decoration:none;">
        <i class="fa-solid fa-phone"></i> Telepon
      </a>
      <button class="btn-fu btn-fu-secondary" style="padding:12px 18px;" onclick="closeCustomerDetailModal()">
        Tutup
      </button>
    </div>
  `;

  const modal = document.getElementById('modalCustomerDetail');
  if (modal) {
    modal.classList.add('active');
    modal.classList.add('show');
    modal.style.display = 'flex';
  }
}

function closeCustomerDetailModal() {
  const modal = document.getElementById('modalCustomerDetail');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

function toggleSelectCustomer(id) {
  if (masterState.selectedIds.includes(id)) {
    masterState.selectedIds = masterState.selectedIds.filter(x => x !== id);
  } else {
    masterState.selectedIds.push(id);
  }
  renderCustomerTable();
  updateBulkActionBar();
}

function toggleSelectAll(checked) {
  if (checked) {
    masterState.selectedIds = masterState.customers.map(c => c.id);
  } else {
    masterState.selectedIds = [];
  }
  renderCustomerTable();
  updateBulkActionBar();
}

function updateBulkActionBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCountSpan');
  if (!bar) return;

  if (masterState.selectedIds.length > 0) {
    bar.style.display = 'flex';
    countSpan.textContent = `${masterState.selectedIds.length} customer dipilih`;
  } else {
    bar.style.display = 'none';
  }
}

async function executeBulkAssign() {
  const salesId = document.getElementById('bulkSalesSelect').value;
  if (!salesId) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Sales', 'Silakan pilih wiraniaga target terlebih dahulu dari dropdown.', 'warning');
    } else {
      alert('Pilih sales target terlebih dahulu.');
    }
    return;
  }

  try {
    const res = await fetch('../api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds,
        sales_id: salesId
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil Ditugaskan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Bulk assign error', e);
  }
}

async function executeAutoDistribute() {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Bagi rata ${masterState.selectedIds.length} data customer yang dicentang ke seluruh wiraniaga aktif?`);
  } else {
    isConfirmed = confirm(`Bagi rata ${masterState.selectedIds.length} customer ke seluruh wiraniaga aktif?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds,
        auto_distribute: true
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Distribusi Selesai!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Auto distribute error', e);
  }
}

async function executeReleaseToPool() {
  if (masterState.selectedIds.length === 0) return;

  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Lepas ${masterState.selectedIds.length} data customer terpilih ke "Pool Rebutan Prospek" agar dapat diperebutkan oleh seluruh sales aktif?`);
  } else {
    isConfirmed = confirm(`Lepas ${masterState.selectedIds.length} data customer ke Pool Rebutan?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=release_to_pool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil Dilepas!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Release to pool error', e);
  }
}

async function inlineUpdateStatus(customerId, status) {
  try {
    await fetch('../api/api_followup.php?action=update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, status: status })
    });
    loadMasterStats();
  } catch (e) {
    console.error('Inline update status error', e);
  }
}

async function inlineUpdateSales(customerId, salesId) {
  try {
    await fetch('../api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: [customerId],
        sales_id: salesId
      })
    });
    loadMasterStats();
  } catch (e) {
    console.error('Inline update sales error', e);
  }
}

async function sendTaskNotificationToSales(salesId) {
  if (!salesId) return;
  try {
    const res = await fetch('../api/api_followup.php?action=notify_sales_task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_id: salesId })
    });
    const data = await res.json();
    if (data.success && data.wa_url) {
      window.open(data.wa_url, '_blank');
    }
  } catch (e) {
    console.error('Notify sales error', e);
  }
}

// -------------------------------------------------------------
// ANIMATED IMPORT EXCEL MODAL ENGINE
// -------------------------------------------------------------
function handleExcelUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  // Show Animated Progress Modal
  showImportProgressModal(file.name, file.size);

  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '../api/api_followup_import.php', true);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 40); // 0-40% upload
      updateImportProgress(percent, 'Mengunggah file ke server...', 1);
    }
  };

  xhr.onload = async () => {
    updateImportProgress(70, 'Memindai sheet & kolom 9-Clusters Repurchase...', 2);
    setTimeout(() => {
      updateImportProgress(90, 'Mengekstrak data kendaraan & klaster...', 3);
    }, 600);

    setTimeout(async () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          updateImportProgress(100, 'Import Berhasil!', 4, res);
          await initMasterDashboard();
        } else {
          showImportError(res.message || 'Gagal memproses file Excel.');
        }
      } catch (err) {
        showImportError('Terjadi kesalahan saat memproses respon server.');
      }
    }, 1200);
  };

  xhr.onerror = () => {
    showImportError('Koneksi terputus saat mengunggah file.');
  };

  xhr.send(formData);
}

function showImportProgressModal(fileName, fileSize) {
  let modal = document.getElementById('importProgressModal');
  const sizeMb = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) + ' MB' : '';

  if (!modal) {
    const html = `
      <div class="modal-overlay active" id="importProgressModal">
        <div class="import-progress-box" onclick="event.stopPropagation()">
          
          <!-- Animated Top Icon -->
          <div style="position:relative; width:64px; height:64px; margin:0 auto 16px;">
            <div style="width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color:#d7123a; display:flex; align-items:center; justify-content:center; font-size:28px; box-shadow:0 8px 20px rgba(215,18,58,0.15);">
              <i class="fa-solid fa-file-excel" id="importIconState"></i>
            </div>
            <div id="importSpinner" style="position:absolute; inset:-4px; border:2.5px solid transparent; border-top-color:#d7123a; border-right-color:#d7123a; border-radius:24px; animation:fuSpin 1.2s linear infinite;"></div>
          </div>

          <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0 0 4px 0;" id="importTitle">Memproses File Data...</h3>
          <p style="font-size:12px; color:#64748b; margin:0 0 16px 0;" id="importSub">${fileName} ${sizeMb ? `(${sizeMb})` : ''}</p>

          <div class="progress-track">
            <div class="progress-bar-fill" id="importProgressBar" style="width:15%;"></div>
          </div>
          
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; margin-bottom:16px;">
            <span style="font-size:11.5px; font-weight:800; color:#d7123a;" id="importPercentText">15% - Mengunggah File</span>
            <span style="font-size:10.5px; color:#94a3b8; font-family:monospace;" id="importTimeStatus">Memproses...</span>
          </div>

          <div style="text-align:left; margin-bottom:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px;" id="importChecklist">
            <div class="import-step-item active" id="step1"><i class="fa-solid fa-cloud-arrow-up"></i> 1. Mengunggah File ke Server</div>
            <div class="import-step-item" id="step2"><i class="fa-solid fa-table-list"></i> 2. Pindai Kolom & Klaster Repurchase</div>
            <div class="import-step-item" id="step3"><i class="fa-solid fa-car"></i> 3. Ekstraksi Kontak & Model Kendaraan</div>
            <div class="import-step-item" id="step4"><i class="fa-solid fa-database"></i> 4. Simpan ke Database CRM SFT</div>
          </div>

          <div id="importResultBox" style="display:none; background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:14px; font-size:12.5px; color:#15803d; margin-bottom:16px; text-align:left;">
          </div>

          <button class="btn-fu btn-fu-navy" id="btnFinishImport" style="display:none; width:100%; justify-content:center; padding:12px;" onclick="closeImportModal()">
            <i class="fa-solid fa-check"></i> Selesai &amp; Lihat Database
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  } else {
    modal.classList.add('active');
    document.getElementById('importTitle').textContent = 'Memproses File Data...';
    document.getElementById('importSub').textContent = `${fileName} ${sizeMb ? `(${sizeMb})` : ''}`;
    document.getElementById('importProgressBar').style.width = '15%';
    document.getElementById('importProgressBar').style.background = 'linear-gradient(90deg, #d7123a 0%, #f43f5e 50%, #10b981 100%)';
    document.getElementById('importPercentText').textContent = '15% - Mengunggah File';
    document.getElementById('importResultBox').style.display = 'none';
    document.getElementById('btnFinishImport').style.display = 'none';
    document.getElementById('importSpinner').style.display = 'block';
  }
}

function updateImportProgress(percent, statusText, stepNumber, resultData = null) {
  const bar = document.getElementById('importProgressBar');
  const txt = document.getElementById('importPercentText');
  if (bar) bar.style.width = `${percent}%`;
  if (txt) txt.textContent = `${percent}% - ${statusText}`;

  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`step${i}`);
    if (el) {
      if (i < stepNumber) {
        el.className = 'import-step-item done';
        el.innerHTML = el.innerHTML.replace(/fa-[a-z-]+/, 'fa-circle-check');
      } else if (i === stepNumber) {
        el.className = 'import-step-item active';
      } else {
        el.className = 'import-step-item';
      }
    }
  }

  if (resultData && percent === 100) {
    const spinner = document.getElementById('importSpinner');
    if (spinner) spinner.style.display = 'none';

    const icon = document.getElementById('importIconState');
    if (icon) {
      icon.className = 'fa-solid fa-circle-check';
      icon.parentElement.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
      icon.parentElement.style.color = '#15803d';
    }

    const resBox = document.getElementById('importResultBox');
    if (resBox) {
      resBox.style.display = 'block';
      resBox.innerHTML = `
        <div style="font-weight:800; font-size:13.5px; color:#14532d; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-circle-check" style="font-size:16px;"></i> ${resultData.message}
        </div>
        <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:8px; font-size:11.5px; color:#334155;">
          <span style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px;">Sheet: <strong>${resultData.sheet_used || 'Utama'}</strong></span>
          <span style="background:#ffffff; border:1px solid #86efac; color:#15803d; border-radius:6px; padding:3px 8px;">Baru: <strong>+${resultData.inserted || 0}</strong></span>
          <span style="background:#ffffff; border:1px solid #bfdbfe; color:#1d4ed8; border-radius:6px; padding:3px 8px;">Total: <strong>${resultData.total || resultData.inserted || 0} Data</strong></span>
        </div>
      `;
    }
    const btn = document.getElementById('btnFinishImport');
    if (btn) btn.style.display = 'flex';
  }
}

function showImportError(msg) {
  const spinner = document.getElementById('importSpinner');
  if (spinner) spinner.style.display = 'none';

  const icon = document.getElementById('importIconState');
  if (icon) {
    icon.className = 'fa-solid fa-triangle-exclamation';
    icon.parentElement.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    icon.parentElement.style.color = '#ef4444';
  }

  document.getElementById('importTitle').textContent = 'Gagal Memproses File';
  document.getElementById('importProgressBar').style.background = '#ef4444';
  document.getElementById('importPercentText').textContent = msg;

  const resBox = document.getElementById('importResultBox');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.style.background = '#fef2f2';
    resBox.style.borderColor = '#fecaca';
    resBox.style.color = '#b91c1c';
    resBox.innerHTML = `<strong>Error:</strong> ${msg}`;
  }

  const btn = document.getElementById('btnFinishImport');
  if (btn) {
    btn.style.display = 'flex';
    btn.textContent = 'Tutup';
  }
}

function closeImportModal() {
  document.getElementById('importProgressModal')?.classList.remove('active');
}

// -------------------------------------------------------------
// DIRECT WHATSAPP MODAL IN MASTER PANEL
// -------------------------------------------------------------
let masterActiveCustWA = null;

async function openWhatsAppDirect(customerId) {
  const cust = masterState.customers.find(c => c.id === customerId);
  if (!cust) return;
  masterActiveCustWA = cust;

  if (!document.getElementById('masterWhatsAppModal')) {
    const html = `
      <div class="modal-overlay" id="masterWhatsAppModal" onclick="closeMasterWAModal()">
        <div class="modal-content" style="max-width:580px; border-radius:var(--fu-radius-lg); padding:22px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
            <h3 style="display:flex; align-items:center; gap:8px; color:#059669; font-size:16px; font-weight:800;">
              <i class="fa-brands fa-whatsapp" style="font-size:22px;"></i> Direct WhatsApp Follow-Up
            </h3>
            <button class="btn-close-modal" onclick="closeMasterWAModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#fff; border-radius:14px; padding:14px 16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:15px;" id="mWaCustName">-</strong>
              <span style="font-family:monospace; color:#6ee7b7; font-weight:800; font-size:13px;" id="mWaCustPhone">-</span>
            </div>
            <div style="font-size:12px; color:rgba(255,255,255,0.85); margin-top:4px;" id="mWaCustCar">-</div>
          </div>

          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Pilih Template WhatsApp:</label>
            <select class="form-control" id="mWaTemplateSelect" style="font-size:12.5px; font-weight:600; border-radius:10px;" onchange="applyMasterWATemplate(this.value)">
            </select>
          </div>

          <div class="wa-chat-preview">
            <div class="wa-bubble-sent" id="mWaLiveBubble">-</div>
          </div>

          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Isi Pesan WhatsApp:</label>
            <textarea class="form-control" id="mWaMessageText" rows="5" style="font-size:12.5px; line-height:1.5; font-family:inherit; border-radius:10px;" oninput="updateMasterLiveBubble(this.value)"></textarea>
          </div>

          <button class="btn-wa-action" style="padding:14px;" onclick="executeMasterSendWA()">
            <i class="fa-brands fa-whatsapp" style="font-size:20px;"></i> Buka WhatsApp &amp; Kirim
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  document.getElementById('mWaCustName').textContent = cust.name;
  document.getElementById('mWaCustPhone').textContent = `+${cust.phone}`;
  document.getElementById('mWaCustCar').innerHTML = `🚗 Unit: <strong>${cust.car_model}</strong> ${cust.last_car_model ? `(Saat ini: ${cust.last_car_model})` : ''} ${cust.district ? `• Kec. ${cust.district}` : ''}`;

  const tmplSelect = document.getElementById('mWaTemplateSelect');
  tmplSelect.innerHTML = '';
  masterState.templates.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.title;
    if (t.is_default) opt.selected = true;
    tmplSelect.appendChild(opt);
  });

  applyMasterWATemplate(tmplSelect.value);
  document.getElementById('masterWhatsAppModal').classList.add('active');
}

function closeMasterWAModal() {
  document.getElementById('masterWhatsAppModal')?.classList.remove('active');
}

function updateMasterLiveBubble(text) {
  const bubble = document.getElementById('mWaLiveBubble');
  if (!bubble) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  bubble.innerHTML = `${text}\n<div class="wa-bubble-footer"><span>${time}</span> <i class="fa-solid fa-check-double"></i></div>`;
}

async function applyMasterWATemplate(templateId) {
  if (!masterActiveCustWA) return;
  const tmpl = masterState.templates.find(t => String(t.id) === String(templateId));
  if (!tmpl) return;

  try {
    const res = await fetch('../api/api_followup.php?action=format_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: masterActiveCustWA.id,
        template_id: tmpl.id
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('mWaMessageText').value = data.formatted_text;
      updateMasterLiveBubble(data.formatted_text);
    }
  } catch (e) {
    document.getElementById('mWaMessageText').value = tmpl.content;
    updateMasterLiveBubble(tmpl.content);
  }
}

function executeMasterSendWA() {
  if (!masterActiveCustWA) return;
  const msg = document.getElementById('mWaMessageText').value;
  const cleanPhone = masterActiveCustWA.phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeMasterWAModal();
}

// -------------------------------------------------------------
// ADD CUSTOMER MODAL
// -------------------------------------------------------------
function openAddCustomerModal() {
  if (!document.getElementById('modalAddCust')) {
    const html = `
      <div class="modal-overlay" id="modalAddCust" onclick="closeAddCustModal()">
        <div class="modal-content" style="max-width:620px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:18px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-user-plus"></i> Customer Entry
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Tambah Customer Baru</h3>
            </div>
            <button class="btn-close-modal" onclick="closeAddCustModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form onsubmit="handleSaveNewCust(event)">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Nama Customer *</label>
                <input type="text" id="addCustName" required class="fu-input" placeholder="Contoh: Bpk. Hendra Gunawan">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">No WhatsApp / Telepon *</label>
                <input type="text" id="addCustPhone" required class="fu-input" placeholder="081223344556">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Model Mobil Target Repurchase *</label>
                <input type="text" id="addCustCar" required class="fu-input" placeholder="Innova Zenix 2.0 V HV">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Mobil Saat Ini (Latar Belakang)</label>
                <input type="text" id="addCustLastCar" class="fu-input" placeholder="Hiace / Avanza 1.3 G">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Usia Kendaraan</label>
                <input type="text" id="addCustAge" class="fu-input" placeholder="Contoh: 4.2 Tahun">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Kecamatan / Domisili</label>
                <input type="text" id="addCustDistrict" class="fu-input" placeholder="Kiara Condong / Buahbatu">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Kategori Follow-Up</label>
                <input type="text" id="addCustCategory" class="fu-input" placeholder="Trade-in / Repurchase">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Tugaskan ke Sales PIC</label>
                <select id="addCustSales" class="fu-select">
                  <option value="">-- Belum Ditugaskan --</option>
                  ${masterState.salesList.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display:flex; gap:10px;">
              <button type="submit" class="btn-fu btn-fu-crimson" style="flex:1; justify-content:center; padding:12px;">
                <i class="fa-solid fa-check"></i> Simpan Customer
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:12px 20px;" onclick="closeAddCustModal()">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }
  document.getElementById('modalAddCust').classList.add('active');
}

function closeAddCustModal() {
  document.getElementById('modalAddCust')?.classList.remove('active');
}

async function handleSaveNewCust(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('addCustName').value,
    phone: document.getElementById('addCustPhone').value,
    car_model: document.getElementById('addCustCar').value,
    last_car_model: document.getElementById('addCustLastCar').value,
    car_age: document.getElementById('addCustAge').value,
    district: document.getElementById('addCustDistrict').value,
    followup_category: document.getElementById('addCustCategory').value || 'Trade-in / Repurchase',
    assigned_sales_id: document.getElementById('addCustSales').value || null
  };

  try {
    const res = await fetch('../api/api_followup.php?action=create_customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeAddCustModal();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Customer Disimpan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (err) {
    console.error('Save cust error', err);
  }
}

// -------------------------------------------------------------
// TEMPLATE MANAGER MODAL
// -------------------------------------------------------------
function openTemplateManagerModal() {
  if (!document.getElementById('modalTemplateManager')) {
    const html = `
      <div class="modal-overlay" id="modalTemplateManager" onclick="closeTemplateModal()">
        <div class="modal-content" style="max-width:700px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-comment-dots"></i> Message Library
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Template Pesan WhatsApp</h3>
            </div>
            <button class="btn-close-modal" onclick="closeTemplateModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <p style="font-size:12px; color:#64748b; margin:0 0 14px 0;">
            Daftar template pesan WhatsApp standar Toyota yang otomatis disesuaikan dengan nama pelanggan, unit mobil, dan sales PIC saat wiraniaga menekan tombol WhatsApp.
          </p>

          <div style="display:flex; flex-direction:column; gap:10px; max-height:420px; overflow-y:auto; padding-right:4px;" id="templateListContainer">
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  const container = document.getElementById('templateListContainer');
  let html = '';
  masterState.templates.forEach(t => {
    html += `
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <strong style="font-size:13.5px; color:#0f172a; font-weight:800;">${t.title}</strong>
          <span style="font-size:10px; font-weight:800; padding:3px 9px; border-radius:9999px; background:${t.is_default ? '#dcfce7; color:#15803d;' : '#f1f5f9; color:#475569;'}">
            ${t.is_default ? '🟢 Template Default' : t.category}
          </span>
        </div>
        <div style="font-size:12px; color:#334155; white-space:pre-wrap; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px; line-height:1.6; font-family:inherit;">${t.content}</div>
      </div>
    `;
  });
  container.innerHTML = html;

  document.getElementById('modalTemplateManager').classList.add('active');
}

function closeTemplateModal() {
  document.getElementById('modalTemplateManager')?.classList.remove('active');
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// GOOGLE SHEET SYNC MODAL (2-WAY SYNC)
// -------------------------------------------------------------
async function openSyncSettingsModal() {
  let defaultSheetUrl = 'https://docs.google.com/spreadsheets/d/1P7_QcL88DFg7v3arU8m_keOtUNLoiE_4i74t65f6HFQ/edit?gid=1800685961#gid=1800685961';
  let defaultScriptUrl = '';

  try {
    const res = await fetch('../api/api_followup_sync.php?action=get_settings');
    const data = await res.json();
    if (data.success && data.settings) {
      if (data.settings.google_sheet_url) defaultSheetUrl = data.settings.google_sheet_url;
      if (data.settings.google_apps_script_url) defaultScriptUrl = data.settings.google_apps_script_url;
    }
  } catch (e) {
    console.error('Error fetching sync settings', e);
  }

  if (document.getElementById('modalSyncSettings')) {
    document.getElementById('modalSyncSettings').remove();
  }

  const html = `
    <div class="modal-overlay" id="modalSyncSettings" onclick="closeSyncModal()">
      <div class="modal-content" style="max-width:620px; border-radius:var(--fu-radius-lg); padding:26px;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-arrows-rotate"></i> 2-Way Cloud Sync Engine
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Sinkronisasi 2 Arah Google Spreadsheet</h3>
          </div>
          <button class="btn-close-modal" onclick="closeSyncModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:12px 14px; font-size:12px; color:#15803d; margin-bottom:16px; display:flex; align-items:flex-start; gap:8px;">
          <i class="fa-solid fa-circle-info" style="margin-top:2px;"></i>
          <span>Hubungkan database CRM SFT dengan Google Spreadsheet agar data customer ditarik otomatis dan hasil respon follow-up sales langsung terkirim balik ke spreadsheet secara realtime.</span>
        </div>

        <!-- 1. URL SPREADSHEET (PULL DATA) -->
        <div style="margin-bottom:14px;">
          <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px; display:block;">
            1. URL Google Spreadsheet (Tarik Database Customer):
          </label>
          <div class="fu-input-with-icon">
            <i class="fa-solid fa-table"></i>
            <input type="url" id="inputGoogleSheetUrl" class="fu-input" placeholder="https://docs.google.com/spreadsheets/d/.../edit" style="font-size:12px;" value="${defaultSheetUrl}">
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:3px;">
            Pastikan akses spreadsheet disetel ke: <em>"Anyone with the link can view"</em>.
          </div>
        </div>

        <!-- 2. URL APPS SCRIPT WEBHOOK (PUSH DATA) -->
        <div style="margin-bottom:20px;">
          <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px; display:block;">
            2. URL Webhook Google Apps Script (Kirim Update Sales ke Sheet):
          </label>
          <div class="fu-input-with-icon">
            <i class="fa-solid fa-code"></i>
            <input type="url" id="inputGoogleAppsScriptUrl" class="fu-input" placeholder="https://script.google.com/macros/s/.../exec" style="font-size:12px;" value="${defaultScriptUrl}">
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:3px;">
            URL Web App yang didapat setelah melakukan Deploy Google Apps Script (*berakhiran /exec*).
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:12px 20px; font-size:13px;" onclick="executePullGoogleSheet()">
            <i class="fa-solid fa-cloud-arrow-down"></i> Simpan &amp; Tarik Data Sekarang
          </button>
          <button class="btn-fu btn-fu-secondary" style="padding:12px 20px; font-size:13px;" onclick="closeSyncModal()">
            Tutup
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modalSyncSettings').classList.add('active');
}

function closeSyncModal() {
  document.getElementById('modalSyncSettings')?.classList.remove('active');
}

async function executePullGoogleSheet() {
  const sheetUrl = document.getElementById('inputGoogleSheetUrl')?.value?.trim() || '';
  const scriptUrl = document.getElementById('inputGoogleAppsScriptUrl')?.value?.trim() || '';

  if (!sheetUrl) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Perhatian', 'Harap masukkan URL Google Spreadsheet terlebih dahulu.', 'warning');
    } else {
      alert('Harap masukkan URL Google Spreadsheet terlebih dahulu.');
    }
    return;
  }

  // Save settings first
  try {
    await fetch('../api/api_followup_sync.php?action=save_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        google_sheet_url: sheetUrl,
        google_apps_script_url: scriptUrl
      })
    });
  } catch (e) {
    console.error('Save sync settings error', e);
  }

  // Show loading indicator
  showImportProgressModal('Google Spreadsheet Cloud Sync', 0);
  updateImportProgress(40, 'Menghubungkan ke Google Spreadsheet...', 1);

  try {
    const res = await fetch('../api/api_followup_sync.php?action=pull_sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ google_sheet_url: sheetUrl })
    });
    const data = await res.json();
    closeSyncModal();

    if (data.success) {
      updateImportProgress(100, 'Sinkronisasi Selesai!', 4, {
        message: data.message,
        sheet_used: 'Google Sheet Cloud Sync',
        inserted: data.inserted,
        updated: data.updated || 0,
        total: data.inserted
      });
      await initMasterDashboard();
    } else {
      showImportError(data.message || 'Gagal sinkronisasi data Google Sheet.');
    }
  } catch (e) {
    showImportError('Terjadi kesalahan koneksi saat sinkronisasi Google Sheet.');
  }
}

function escapeJs(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// -------------------------------------------------------------
// DELETION LOGIC (SINGLE, BULK, RESET) WITH CUSTOM ALERT
// -------------------------------------------------------------
async function confirmDeleteCustomer(id, name) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Apakah Anda yakin ingin menghapus data customer "${name}" secara permanen dari database?`);
  } else {
    isConfirmed = confirm(`Yakin ingin menghapus customer "${name}"?`);
  }

  if (isConfirmed) {
    await executeDeleteCustomer(id);
  }
}

async function executeDeleteCustomer(id) {
  try {
    const res = await fetch('../api/api_followup.php?action=delete_customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = masterState.selectedIds.filter(x => x !== id);
      updateBulkActionBar();

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Customer Dihapus!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal Menghapus', data.message || 'Gagal menghapus customer.', 'danger');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Delete customer error', e);
  }
}

async function confirmBulkDelete() {
  if (masterState.selectedIds.length === 0) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Data', 'Silakan centang minimal 1 customer untuk dihapus.', 'warning');
    } else {
      alert('Pilih minimal 1 customer untuk dihapus.');
    }
    return;
  }

  const count = masterState.selectedIds.length;
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`PERINGATAN: Anda akan menghapus ${count} data customer terpilih secara massal. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`);
  } else {
    isConfirmed = confirm(`Hapus ${count} customer terpilih?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=bulk_delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_ids: masterState.selectedIds })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      
      const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
      theadCheckboxes.forEach(cb => cb.checked = false);

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Data Berhasil Dihapus!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    }
  } catch (e) {
    console.error('Bulk delete error', e);
  }
}

async function confirmResetDatabase() {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm('PERINGATAN KRUSIAL:\nSeluruh data customer follow-up di database cabang akan dikosongkan secara total.\n\nGunakan opsi ini hanya jika Anda ingin mengimpor database baru dari nol. Apakah Anda yakin?');
  } else {
    isConfirmed = confirm('Yakin ingin mengosongkan seluruh database customer?');
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=reset_database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      
      const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
      theadCheckboxes.forEach(cb => cb.checked = false);

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Database Dikosongkan!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    }
  } catch (e) {
    console.error('Reset error', e);
  }
}

// -------------------------------------------------------------
// SMART QUOTA LEADS DISTRIBUTION MATRIX (50 / 100 per Sales)
// -------------------------------------------------------------
let smartDistState = {
  quota: 50,
  category: 'all',
  selectedSales: [],
  searchFilter: ''
};

function openSmartDistributionModal() {
  smartDistState.selectedSales = masterState.salesList.map(s => s.id); // Default select all
  smartDistState.quota = 50;

  if (!document.getElementById('modalSmartDist')) {
    const html = `
      <div class="modal-overlay" id="modalSmartDist" onclick="closeSmartDistModal()">
        <div class="modal-content" style="max-width:820px; border-radius:var(--fu-radius-lg); padding:24px; max-height:90vh; overflow-y:auto;" onclick="event.stopPropagation()">
          
          <!-- Header -->
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-bolt-lightning"></i> Smart Distribution Matrix
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Bagi Kuota Leads ke Wiraniaga</h3>
              <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">Atur jumlah pembagian data (misal 50 atau 100 leads) dan pilih sales tertentu yang ditugaskan.</p>
            </div>
            <button class="btn-close-modal" onclick="closeSmartDistModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <!-- 1. PENGATURAN KUOTA -->
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:16px;">
            <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">
              <i class="fa-solid fa-sliders" style="color:#d7123a;"></i> 1. Tentukan Kuota Leads per Wiraniaga:
            </div>
            
            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:12px;">
              <button type="button" class="category-pill-btn active" id="pillQuota50" onclick="setQuotaPill(50, this)">
                ⚡ 50 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuota100" onclick="setQuotaPill(100, this)">
                🔥 100 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuota25" onclick="setQuotaPill(25, this)">
                ☕ 25 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuotaAll" onclick="setQuotaPill(0, this)">
                ⚖️ Bagi Rata Semua Data
              </button>
              
              <div style="display:flex; align-items:center; gap:6px; margin-left:auto;">
                <span style="font-size:12px; font-weight:700; color:#475569;">Kustom:</span>
                <input type="number" id="inputCustomQuota" value="50" min="1" max="1000" class="fu-input" style="width:90px; padding:6px 10px; font-size:12px; text-align:center;" oninput="handleCustomQuotaInput(this.value)">
              </div>
            </div>

            <!-- Filter Kategori Leads -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Filter Kategori Repurchase:</label>
                <select id="distCategorySelect" class="fu-select" style="font-size:12px;" onchange="smartDistState.category = this.value; updateSmartDistPreview();">
                  <option value="all">Semua Kategori (${masterState.stats.unassigned || masterState.stats.total || 0} Leads Unassigned)</option>
                  ${Object.keys(masterState.stats.byCategory || {}).map(cat => `<option value="${cat}">${cat} (${masterState.stats.byCategory[cat]})</option>`).join('')}
                </select>
              </div>
              <div style="display:flex; align-items:flex-end;">
                <div style="font-size:11.5px; color:#64748b; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; width:100%;">
                  Total Leads Siap Dibagikan: <strong style="color:#d7123a; font-size:13px;" id="distPoolCount">0</strong> Data
                </div>
              </div>
            </div>
          </div>

          <!-- 2. PILIH WIRANIAGA PENERIMA -->
          <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
              <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-users-gear" style="color:#10b981;"></i> 2. Pilih Wiraniaga Penerima Leads:
              </div>
              <div style="font-size:12px; font-weight:800; color:#1e40af;">
                <span id="distSelectedSalesCount">0</span> dari ${masterState.salesList.length} Wiraniaga Terpilih
              </div>
            </div>

            <!-- Team Quick Select Buttons -->
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('all')">
                <i class="fa-solid fa-check-double"></i> Pilih Semua (46)
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Riva')">
                Tim Pak Riva
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Ryan')">
                Tim Pak Ryan
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Bu Rahma')">
                Tim Bu Rahma
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Alvin')">
                Tim Pak Alvin
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px; color:#ef4444 !important;" onclick="filterDistSalesByTeam('none')">
                <i class="fa-solid fa-xmark"></i> Batal Pilih
              </button>
            </div>

            <!-- Sales Grid with Checkboxes -->
            <div class="fu-input-with-icon" style="margin-bottom:10px;">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="fu-input" placeholder="Cari nama sales..." style="padding-top:6px; padding-bottom:6px; font-size:12px;" oninput="handleDistSalesSearch(this.value)">
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:8px; max-height:220px; overflow-y:auto; padding:4px; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc;" id="distSalesGridContainer">
            </div>
          </div>

          <!-- 3. LIVE CALCULATION PREVIEW BOX -->
          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#ffffff; border-radius:14px; padding:16px; margin-bottom:18px; box-shadow:0 6px 20px rgba(13,27,62,0.2);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <div style="font-size:11px; text-transform:uppercase; color:#93c5fd; font-weight:800; letter-spacing:0.5px;">Simulasi Pembagian Leads:</div>
                <div style="font-size:15px; font-weight:900; margin-top:2px;" id="distMathFormula">-</div>
              </div>
              <button class="btn-fu btn-fu-crimson" style="padding:12px 24px; font-size:13.5px;" onclick="executeSmartDistribution()">
                <i class="fa-solid fa-paper-plane"></i> Bagikan Leads Sekarang
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  renderDistSalesGrid();
  updateSmartDistPreview();
  document.getElementById('modalSmartDist').classList.add('active');
}

function closeSmartDistModal() {
  document.getElementById('modalSmartDist')?.classList.remove('active');
}

function setQuotaPill(val, btn) {
  smartDistState.quota = val;
  document.querySelectorAll('#modalSmartDist .category-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('inputCustomQuota').value = val === 0 ? 'Semua' : val;
  updateSmartDistPreview();
}

function handleCustomQuotaInput(val) {
  const num = parseInt(val) || 1;
  smartDistState.quota = num;
  document.querySelectorAll('#modalSmartDist .category-pill-btn').forEach(b => b.classList.remove('active'));
  updateSmartDistPreview();
}

function filterDistSalesByTeam(team) {
  if (team === 'all') {
    smartDistState.selectedSales = masterState.salesList.map(s => s.id);
  } else if (team === 'none') {
    smartDistState.selectedSales = [];
  } else {
    smartDistState.selectedSales = masterState.salesList.filter(s => s.spv === team).map(s => s.id);
  }
  renderDistSalesGrid();
  updateSmartDistPreview();
}

function handleDistSalesSearch(query) {
  smartDistState.searchFilter = query.toLowerCase().trim();
  renderDistSalesGrid();
}

function toggleDistSalesCheckbox(id, checked) {
  if (checked) {
    if (!smartDistState.selectedSales.includes(id)) smartDistState.selectedSales.push(id);
  } else {
    smartDistState.selectedSales = smartDistState.selectedSales.filter(x => x !== id);
  }
  updateSmartDistPreview();
}

function renderDistSalesGrid() {
  const container = document.getElementById('distSalesGridContainer');
  if (!container) return;

  let list = masterState.salesList;
  if (smartDistState.searchFilter) {
    list = list.filter(s => s.name.toLowerCase().includes(smartDistState.searchFilter) || (s.spv && s.spv.toLowerCase().includes(smartDistState.searchFilter)));
  }

  let html = '';
  list.forEach(s => {
    const isChecked = smartDistState.selectedSales.includes(s.id);
    html += `
      <label style="display:flex; align-items:center; gap:8px; background:#ffffff; border:1.5px solid ${isChecked ? '#d7123a' : '#e2e8f0'}; border-radius:10px; padding:8px 10px; cursor:pointer; transition:all 0.15s ease;">
        <input type="checkbox" style="width:16px; height:16px; accent-color:#d7123a;" ${isChecked ? 'checked' : ''} onchange="toggleDistSalesCheckbox(${s.id}, this.checked)">
        <div style="flex:1; overflow:hidden;">
          <div style="font-size:12px; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.name}</div>
          <div style="font-size:10px; color:#64748b;">${s.spv ? `${s.spv}` : 'Sales'} • <strong>${s.total_customers || 0} Task</strong></div>
        </div>
      </label>
    `;
  });

  container.innerHTML = html;
}

function updateSmartDistPreview() {
  const selectedCount = smartDistState.selectedSales.length;
  document.getElementById('distSelectedSalesCount').textContent = selectedCount;

  // Unassigned pool count
  const unassignedTotal = masterState.stats.unassigned !== undefined ? masterState.stats.unassigned : (masterState.stats.total || 0);
  document.getElementById('distPoolCount').textContent = unassignedTotal;

  const quota = smartDistState.quota;
  let formulaText = '';

  if (selectedCount === 0) {
    formulaText = '⚠️ Silakan centang minimal 1 wiraniaga penerima leads di atas.';
  } else if (quota === 0) {
    const perSales = Math.floor(unassignedTotal / selectedCount);
    formulaText = `⚖️ <strong>${unassignedTotal} Leads</strong> dibagi rata ke <strong>${selectedCount} Sales</strong> ($\approx$ ${perSales} leads per orang). Sisa 0.`;
  } else {
    const totalWillAssign = Math.min(unassignedTotal, selectedCount * quota);
    const remainder = Math.max(0, unassignedTotal - totalWillAssign);
    formulaText = `🎯 <strong>${selectedCount} Sales</strong> &times; <strong>${quota} Leads</strong> = <strong>${totalWillAssign} Leads</strong> akan dibagikan sekarang.<br><span style="font-size:11.5px; color:#bfdbfe; font-weight:600; margin-top:3px; display:inline-block;">📦 Sisa <strong>${remainder} Leads</strong> tetap tersimpan di database unassigned dan siap ditambahkan saat sales selesai follow-up.</span>`;
  }

  document.getElementById('distMathFormula').innerHTML = formulaText;
}

async function executeSmartDistribution() {
  if (smartDistState.selectedSales.length === 0) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Wiraniaga', 'Harap pilih minimal 1 wiraniaga penerima leads.', 'warning');
    } else {
      alert('Harap pilih minimal 1 wiraniaga penerima.');
    }
    return;
  }

  showImportProgressModal('Smart Leads Distribution Matrix', 0);
  updateImportProgress(50, 'Mendistribusikan kuota leads ke wiraniaga terpilih...', 2);

  try {
    const res = await fetch('../api/api_followup.php?action=distribute_quota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sales_ids: smartDistState.selectedSales,
        quota_per_sales: smartDistState.quota,
        category: smartDistState.category,
        only_unassigned: true
      })
    });
    const data = await res.json();
    closeSmartDistModal();
    closeImportModal();

    if (data.success) {
      await initMasterDashboard();
      showDistSuccessModal(data);
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data.message || 'Gagal membagikan kuota leads.', 'danger');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    closeImportModal();
    console.error('Smart dist error', e);
  }
}

function showDistSuccessModal(result) {
  const breakdown = result.breakdown || [];
  
  let listHtml = '';
  breakdown.forEach(b => {
    listHtml += `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; margin-bottom:6px;">
        <div>
          <strong style="font-size:13px; color:#0f172a;">${b.sales_name}</strong>
          <span style="font-size:11.5px; color:#10b981; font-weight:700; margin-left:6px;">+${b.assigned_count} Leads</span>
        </div>
        <a href="${b.wa_url}" target="_blank" class="btn-fu btn-fu-emerald" style="padding:5px 12px; font-size:11px; text-decoration:none;">
          <i class="fa-brands fa-whatsapp"></i> Kirim WA Rekap
        </a>
      </div>
    `;
  });

  const modalHtml = `
    <div class="modal-overlay active" id="modalDistSuccess" onclick="document.getElementById('modalDistSuccess').remove()">
      <div class="modal-content" style="max-width:650px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
        <div style="text-align:center; margin-bottom:16px;">
          <div style="width:56px; height:56px; border-radius:50%; background:#dcfce7; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 10px;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Pembagian Leads Berhasil!</h3>
          <p style="font-size:12.5px; color:#64748b; margin:4px 0 0 0;">${result.message}</p>
        </div>

        <div style="font-size:11.5px; font-weight:800; text-transform:uppercase; color:#475569; margin-bottom:8px;">
          Kirim Notifikasi Daftar Tugas ke WhatsApp Sales:
        </div>

        <div style="max-height:300px; overflow-y:auto; margin-bottom:16px;">
          ${listHtml}
        </div>

        <button class="btn-fu btn-fu-navy" style="width:100%; justify-content:center; padding:12px;" onclick="document.getElementById('modalDistSuccess').remove()">
          Selesai &amp; Lihat Tabel
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}


