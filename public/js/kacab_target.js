// kacab_target.js — Handler Kelola Target & Kuota Cabang per Bulan (Data Real MySQL)
// Upgraded: Executive High-Density Table & Compact Grid with Real-time Search & Filter

let branchHierarchyData = [];
let periodLabel = "";
let editingSalesId = null;
let targetViewMode = 'table'; // 'table' | 'grid'

function setTargetViewMode(mode) {
  targetViewMode = mode;
  const btnTable = document.getElementById('btnViewTable');
  const btnGrid = document.getElementById('btnViewGrid');
  if (btnTable && btnGrid) {
    btnTable.classList.toggle('active', mode === 'table');
    btnGrid.classList.toggle('active', mode === 'grid');
  }
  renderTargetMatrix();
}
window.setTargetViewMode = setTargetViewMode;

async function fetchRealTargetData() {
  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonth = monthSelect ? monthSelect.value : (new Date().getMonth() + 1);

  const container = document.getElementById('targetMatrixContainer');
  if (container) {
    container.innerHTML = `<p class="loading-state" style="padding:28px 0; text-align:center; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data target cabang...</p>`;
  }

  try {
    const res = await fetch(`../api/api_target_all.php?bulan=${selectedMonth}`);
    const json = await res.json();

    if (json.status === 'success' && Array.isArray(json.data)) {
      branchHierarchyData = json.data;
      periodLabel = json.periode || 'Bulan Ini';
    } else {
      branchHierarchyData = [];
    }

    renderTargetMatrix();
  } catch (e) {
    console.error("Gagal mengambil data target real:", e);
    branchHierarchyData = [];
    renderTargetMatrix();
  }
}

function filterTargetMatrix() {
  renderTargetMatrix();
}
window.filterTargetMatrix = filterTargetMatrix;

function getFilteredTargetData() {
  const searchInput = document.getElementById('searchTargetInput');
  const q = (searchInput ? searchInput.value : '').toLowerCase().trim();

  const spvSelect = document.getElementById('filterSpvTeamTarget');
  const spvVal = (spvSelect ? spvSelect.value : 'Semua');

  const tingSelect = document.getElementById('filterTingkatanTarget');
  const tingVal = (tingSelect ? tingSelect.value : 'Semua');

  return branchHierarchyData.filter(item => {
    const nama = (item.nama_sales || '').toLowerCase();
    const uname = (item.username || '').toLowerCase();
    const spv = (item.nama_spv || '').toLowerCase();
    const tingkatan = (item.tingkatan || 'Executive').toLowerCase();

    // 1. Text search
    if (q && !nama.includes(q) && !uname.includes(q) && !spv.includes(q)) {
      return false;
    }

    // 2. SPV filter
    if (spvVal !== 'Semua') {
      if (!spv.includes(spvVal.toLowerCase())) return false;
    }

    // 3. Tingkatan filter
    if (tingVal !== 'Semua') {
      if (tingkatan !== tingVal.toLowerCase()) return false;
    }

    return true;
  });
}

function renderTargetMatrix() {
  const container = document.getElementById('targetMatrixContainer');
  if (!container) return;

  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonthName = monthSelect ? monthSelect.options[monthSelect.selectedIndex].text : 'Bulan Ini';
  
  const lblPeriod = document.getElementById('lblSelectedPeriod');
  if (lblPeriod) lblPeriod.textContent = `Target & Pencapaian Periode ${selectedMonthName}`;

  // Total Agregat Target & Realisasi Seluruh Cabang
  let totalSpkTarget = 0, totalDoTarget = 0;
  let totalSpkReal = 0, totalDoReal = 0;

  branchHierarchyData.forEach(item => {
    totalSpkTarget += Number(item.target_spk_bulan || item.target_spk || 0);
    totalDoTarget += Number(item.target_do_bulan || item.target_do || 0);
    totalSpkReal += Number(item.realisasi_spk_bulan || item.realisasi_spk || 0);
    totalDoReal += Number(item.realisasi_do_bulan || item.realisasi_do || 0);
  });

  const pctSpk = totalSpkTarget > 0 ? Math.round((totalSpkReal / totalSpkTarget) * 100) : 0;
  const pctDo = totalDoTarget > 0 ? Math.round((totalDoReal / totalDoTarget) * 100) : 0;

  const sumSpkEl = document.getElementById('summarySpkTarget');
  if (sumSpkEl) sumSpkEl.textContent = `${totalSpkReal} / ${totalSpkTarget} Unit (${pctSpk}%)`;

  const sumDoEl = document.getElementById('summaryDoTarget');
  if (sumDoEl) sumDoEl.textContent = `${totalDoReal} / ${totalDoTarget} Unit (${pctDo}%)`;

  const filtered = getFilteredTargetData();

  const countBadge = document.getElementById('targetCountBadge');
  if (countBadge) {
    countBadge.textContent = `${filtered.length} dari ${branchHierarchyData.length} Wiraniaga`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding:36px 16px; text-align:center; color:#64748b;">
        <div style="font-size:32px; color:#cbd5e1; margin-bottom:10px;"><i class="fa-solid fa-users-slash"></i></div>
        <div style="font-size:14px; font-weight:800; color:#1e293b;">Tidak ada data wiraniaga yang sesuai</div>
        <div style="font-size:12px; margin-top:4px;">Coba ubah kata kunci pencarian atau filter tim SPV di atas.</div>
      </div>`;
    return;
  }

  if (targetViewMode === 'table') {
    container.innerHTML = `
      <div class="table-target-wrap">
        <table class="table-target">
          <thead>
            <tr>
              <th style="width:40px; text-align:center;">No</th>
              <th style="min-width:200px;">Wiraniaga</th>
              <th style="min-width:130px;">Tim SPV</th>
              <th style="min-width:180px;">Target &amp; Real SPK</th>
              <th style="min-width:180px;">Target &amp; Real DO</th>
              <th style="width:110px; text-align:center;">Pencapaian</th>
              <th style="width:90px; text-align:center;">Aksi</th>
            </tr>
          </thead>
          <tbody>
            ${filtered.map((sales, idx) => {
              const tgtSpk = Number(sales.target_spk_bulan || sales.target_spk || 0);
              const relSpk = Number(sales.realisasi_spk_bulan || sales.realisasi_spk || 0);
              const tgtDo = Number(sales.target_do_bulan || sales.target_do || 0);
              const relDo = Number(sales.realisasi_do_bulan || sales.realisasi_do || 0);

              const pSpk = tgtSpk > 0 ? Math.round((relSpk / tgtSpk) * 100) : 0;
              const pDo = tgtDo > 0 ? Math.round((relDo / tgtDo) * 100) : 0;

              let achBadge = `<span style="background:#fef2f2; color:#b91c1c; border:1px solid #fecaca; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:6px;">Perlu Dikejar</span>`;
              if (pSpk >= 100 && pDo >= 100) {
                achBadge = `<span style="background:#f0fdf4; color:#15803d; border:1px solid #bbf7d0; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:6px;">Target Tercapai</span>`;
              } else if (pSpk >= 70 || pDo >= 70) {
                achBadge = `<span style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:6px;">On Track</span>`;
              }

              const tingkatanName = sales.tingkatan || 'Executive';
              let tingBadgeBg = '#f1f5f9', tingColor = '#475569';
              if (tingkatanName.toLowerCase().includes('senior')) { tingBadgeBg = '#fef3c7'; tingColor = '#92400e'; }
              else if (tingkatanName.toLowerCase().includes('executive')) { tingBadgeBg = '#e0e7ff'; tingColor = '#4338ca'; }
              else if (tingkatanName.toLowerCase().includes('trainee') || tingkatanName.toLowerCase().includes('magang')) { tingBadgeBg = '#f3f4f6'; tingColor = '#6b7280'; }

              return `
                <tr>
                  <td style="text-align:center; font-weight:700; color:#94a3b8; font-size:12px;">${idx + 1}</td>
                  <td>
                    <div style="display:flex; align-items:center; gap:10px;">
                      <div style="width:34px; height:34px; border-radius:10px; background:linear-gradient(135deg, #1e1014, #3b141d); color:#d8a437; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0;">
                        <i class="fa-solid fa-user-tie"></i>
                      </div>
                      <div>
                        <div style="font-weight:800; color:#0f172a; font-size:13px; display:flex; align-items:center; gap:6px;">
                          ${escapeHtml(sales.nama_sales)}
                          ${sales.is_active == 0 ? '<span style="font-size:9.5px; background:#fee2e2; color:#dc2626; border:1px solid #fecaca; padding:1px 5px; border-radius:4px;">Alumni</span>' : ''}
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; margin-top:2px;">
                          <span style="font-size:10.5px; background:${tingBadgeBg}; color:${tingColor}; font-weight:700; padding:1px 6px; border-radius:4px;">
                            ${escapeHtml(tingkatanName)}
                          </span>
                          <span style="font-size:11px; color:#94a3b8;">${escapeHtml(sales.username || '')}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style="display:inline-flex; align-items:center; gap:5px; font-size:11.5px; font-weight:700; color:#334155; background:#f8fafc; border:1px solid #e2e8f0; padding:3px 8px; border-radius:6px;">
                      <i class="fa-solid fa-sitemap" style="color:var(--gold); font-size:11px;"></i>
                      <span>${escapeHtml(sales.nama_spv || 'Cabang')}</span>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:4px;">
                        <span style="font-weight:800; color:#0f172a;">${relSpk} / ${tgtSpk} Unit</span>
                        <span style="font-weight:700; color:#2563eb; font-size:11px;">${pSpk}%</span>
                      </div>
                      <div style="height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                        <div style="width:${Math.min(100, pSpk)}%; background:#2563eb; height:100%; border-radius:3px;"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:4px;">
                        <span style="font-weight:800; color:#0f172a;">${relDo} / ${tgtDo} Unit</span>
                        <span style="font-weight:700; color:#059669; font-size:11px;">${pDo}%</span>
                      </div>
                      <div style="height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden;">
                        <div style="width:${Math.min(100, pDo)}%; background:#059669; height:100%; border-radius:3px;"></div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align:center;">
                    ${achBadge}
                  </td>
                  <td style="text-align:center;">
                    <button class="btn btn-ghost btn-sm" onclick="openEditTargetModal(${sales.sales_account_id})" style="padding:5px 9px; font-size:11.5px; font-weight:700; border-radius:7px;">
                      <i class="fa-solid fa-pen-to-square"></i> Edit
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Grid Kompak (Modern 3-Column Responsive Layout)
    container.innerHTML = `
      <div class="target-grid-compact">
        ${filtered.map(sales => {
          const tgtSpk = Number(sales.target_spk_bulan || sales.target_spk || 0);
          const relSpk = Number(sales.realisasi_spk_bulan || sales.realisasi_spk || 0);
          const tgtDo = Number(sales.target_do_bulan || sales.target_do || 0);
          const relDo = Number(sales.realisasi_do_bulan || sales.realisasi_do || 0);

          const pSpk = tgtSpk > 0 ? Math.round((relSpk / tgtSpk) * 100) : 0;
          const pDo = tgtDo > 0 ? Math.round((relDo / tgtDo) * 100) : 0;

          return `
            <div class="target-card-compact">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div style="display:flex; align-items:center; gap:10px;">
                    <div style="width:36px; height:36px; border-radius:10px; background:linear-gradient(135deg, #1e1014, #3b141d); color:#d8a437; display:flex; align-items:center; justify-content:center; font-size:14px; flex-shrink:0;">
                      <i class="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                      <h4 style="margin:0; font-size:13.5px; font-weight:800; color:#0f172a;">${escapeHtml(sales.nama_sales)}</h4>
                      <span style="font-size:11px; color:#64748b;">${escapeHtml(sales.tingkatan || 'Executive')} &middot; ${escapeHtml(sales.nama_spv || 'Cabang')}</span>
                    </div>
                  </div>
                  <button class="btn btn-ghost btn-sm" onclick="openEditTargetModal(${sales.sales_account_id})" style="padding:4px 8px; font-size:11px;">
                    <i class="fa-solid fa-pen"></i>
                  </button>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; margin-bottom:10px;">
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:3px;">
                      <span style="color:#64748b;">Target SPK:</span>
                      <span style="color:#1e293b; font-weight:800;">${relSpk} / ${tgtSpk} Unit (${pSpk}%)</span>
                    </div>
                    <div style="height:5px; background:#cbd5e1; border-radius:3px; overflow:hidden;">
                      <div style="width:${Math.min(100, pSpk)}%; background:#2563eb; height:100%; border-radius:3px;"></div>
                    </div>
                  </div>
                  <div>
                    <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; margin-bottom:3px;">
                      <span style="color:#64748b;">Target DO:</span>
                      <span style="color:#1e293b; font-weight:800;">${relDo} / ${tgtDo} Unit (${pDo}%)</span>
                    </div>
                    <div style="height:5px; background:#cbd5e1; border-radius:3px; overflow:hidden;">
                      <div style="width:${Math.min(100, pDo)}%; background:#059669; height:100%; border-radius:3px;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
}

function openEditTargetModal(salesAccountId) {
  editingSalesId = salesAccountId;
  const sales = branchHierarchyData.find(s => Number(s.sales_account_id) === Number(salesAccountId));
  if (!sales) return;

  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonthName = monthSelect ? monthSelect.options[monthSelect.selectedIndex].text : 'Bulan Ini';

  const titleEl = document.getElementById('modalSpvName');
  if (titleEl) titleEl.textContent = `${sales.nama_sales} (${selectedMonthName})`;

  const spkIn = document.getElementById('inputTargetSpk');
  if (spkIn) spkIn.value = Number(sales.target_spk_bulan || sales.target_spk || 0);

  const doIn = document.getElementById('inputTargetDo');
  if (doIn) doIn.value = Number(sales.target_do_bulan || sales.target_do || 0);

  const modal = document.getElementById('editTargetModal');
  modal && (modal.style.display = 'flex');
}
window.openEditTargetModal = openEditTargetModal;

function closeEditTargetModal() {
  const modal = document.getElementById('editTargetModal');
  modal && (modal.style.display = 'none');
}
window.closeEditTargetModal = closeEditTargetModal;

async function saveTargetChanges() {
  const sales = branchHierarchyData.find(s => Number(s.sales_account_id) === Number(editingSalesId));
  if (!sales) return;

  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonth = monthSelect ? Number(monthSelect.value) : (new Date().getMonth() + 1);

  const newSpk = parseInt(document.getElementById('inputTargetSpk').value) || 0;
  const newDo = parseInt(document.getElementById('inputTargetDo').value) || 0;

  try {
    const res = await fetch('../api/api_target_all.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'save_target_single',
        sales_account_id: sales.sales_account_id,
        periode_bulan: selectedMonth,
        target_spk: newSpk,
        target_do: newDo,
        realisasi_spk: Number(sales.realisasi_spk_bulan || 0),
        realisasi_do: Number(sales.realisasi_do_bulan || 0)
      })
    });

    const data = await res.json();
    if (data.status === 'success') {
      sales.target_spk_bulan = newSpk;
      sales.target_spk = newSpk;
      sales.target_do_bulan = newDo;
      sales.target_do = newDo;

      closeEditTargetModal();
      renderTargetMatrix();

      if (typeof customAlert === 'function') {
        customAlert('Target Disimpan', `Target untuk ${sales.nama_sales} berhasil tersimpan.`, 'success');
      }
    } else {
      alert("Gagal menyimpan target: " + (data.message || 'Error'));
    }
  } catch (e) {
    console.error(e);
    alert("Terjadi kesalahan jaringan.");
  }
}
window.saveTargetChanges = saveTargetChanges;

async function syncSheetsNowKacab() {
  const btn = document.getElementById('btnSyncSheetsKacab');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sinkronisasi...';
  }
  try {
    const monthSelect = document.getElementById('monthSelectKacab');
    const m = monthSelect ? monthSelect.value : (new Date().getMonth() + 1);
    const res = await fetch(`../api/api_sheets_sync.php?action=pull&bulan=${m}`);
    const result = await res.json();
    if (result.status === 'success') {
      if (typeof customAlert === 'function') {
        customAlert('Sinkronisasi Berhasil', result.message || 'Data target berhasil disinkronkan dengan Google Spreadsheet.', 'success');
      } else {
        alert(result.message || 'Data target berhasil disinkronkan!');
      }
      fetchRealTargetData();
    } else {
      alert('Gagal sinkron: ' + (result.message || 'Terjadi kesalahan'));
    }
  } catch (err) {
    console.error(err);
    alert('Gagal menghubungi server sinkronisasi.');
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Sinkron Spreadsheet';
    }
  }
}
window.syncSheetsNowKacab = syncSheetsNowKacab;

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  fetchRealTargetData();
});
