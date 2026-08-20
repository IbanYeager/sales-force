// kacab_target.js — Handler Kelola Target & Kuota Cabang per Bulan (Data Real MySQL)

let branchHierarchyData = [];
let periodLabel = "";
let editingSalesId = null;

async function fetchRealTargetData() {
  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonth = monthSelect ? monthSelect.value : (new Date().getMonth() + 1);

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

function renderTargetMatrix() {
  const container = document.getElementById('targetMatrixContainer');
  if (!container) return;

  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonthName = monthSelect ? monthSelect.options[monthSelect.selectedIndex].text : 'Bulan Ini';
  
  const lblPeriod = document.getElementById('lblSelectedPeriod');
  if (lblPeriod) lblPeriod.textContent = `Target & Pencapaian Periode ${selectedMonthName}`;

  // Total Agregat Target & Realisasi Cabang (Dihitung Dinamis dari Data Spreadsheet)
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

  document.getElementById('summarySpkTarget') && (document.getElementById('summarySpkTarget').textContent = `${totalSpkReal} / ${totalSpkTarget} Unit (${pctSpk}%)`);
  document.getElementById('summaryDoTarget') && (document.getElementById('summaryDoTarget').textContent = `${totalDoReal} / ${totalDoTarget} Unit (${pctDo}%)`);

  if (branchHierarchyData.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="padding:40px 0;">
        <div class="es-icon"><i class="fa-solid fa-bullseye"></i></div>
        <div class="es-title">Belum ada data sales/target</div>
        <div class="es-text">Data sales_accounts atau target_do_bulanan masih kosong di database.</div>
      </div>`;
    return;
  }

  container.innerHTML = branchHierarchyData.map(sales => {
    const tgtSpk = Number(sales.target_spk_bulan || sales.target_spk || 0);
    const relSpk = Number(sales.realisasi_spk_bulan || sales.realisasi_spk || 0);
    const tgtDo = Number(sales.target_do_bulan || sales.target_do || 0);
    const relDo = Number(sales.realisasi_do_bulan || sales.realisasi_do || 0);

    const pSpk = tgtSpk > 0 ? Math.round((relSpk / tgtSpk) * 100) : 0;
    const pDo = tgtDo > 0 ? Math.round((relDo / tgtDo) * 100) : 0;

    return `
      <div class="target-card">
        <div class="tc-head">
          <div class="tc-spv-info">
            <div class="tc-avatar"><i class="fa-solid fa-user-tie"></i></div>
            <div>
              <h3>${escapeHtml(sales.nama_sales)}</h3>
              <p class="tc-sub"><i class="fa-solid fa-graduation-cap"></i> Tingkatan: <strong>${escapeHtml(sales.tingkatan || 'Executive')}</strong> &middot; Periode: ${escapeHtml(selectedMonthName)}</p>
            </div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="openEditTargetModal(${sales.sales_account_id})">
            <i class="fa-solid fa-pen-to-square"></i> Edit Target
          </button>
        </div>

        <div class="tc-stats-row">
          <div class="tc-stat-box">
            <span class="lbl">Target SPK (${escapeHtml(selectedMonthName)})</span>
            <span class="val">${relSpk} / ${tgtSpk} Unit</span>
            <div class="tc-progress"><div class="fill" style="width:${Math.min(100, pSpk)}%;background:var(--blue, #2563eb);"></div></div>
            <span class="pct">${pSpk}% Tercapai</span>
          </div>

          <div class="tc-stat-box">
            <span class="lbl">Target DO (${escapeHtml(selectedMonthName)})</span>
            <span class="val">${relDo} / ${tgtDo} Unit</span>
            <div class="tc-progress"><div class="fill" style="width:${Math.min(100, pDo)}%;background:var(--brand, #059669);"></div></div>
            <span class="pct">${pDo}% Tercapai</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function openEditTargetModal(salesAccountId) {
  editingSalesId = salesAccountId;
  const sales = branchHierarchyData.find(s => Number(s.sales_account_id) === Number(salesAccountId));
  if (!sales) return;

  const monthSelect = document.getElementById('monthSelectKacab');
  const selectedMonthName = monthSelect ? monthSelect.options[monthSelect.selectedIndex].text : 'Bulan Ini';

  document.getElementById('modalSpvName').textContent = `${sales.nama_sales} (${selectedMonthName})`;
  document.getElementById('inputTargetSpk').value = Number(sales.target_spk_bulan || sales.target_spk || 0);
  document.getElementById('inputTargetDo').value = Number(sales.target_do_bulan || sales.target_do || 0);

  const modal = document.getElementById('editTargetModal');
  modal && (modal.style.display = 'flex');
}

function closeEditTargetModal() {
  const modal = document.getElementById('editTargetModal');
  modal && (modal.style.display = 'none');
}

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
        customAlert('Target Disimpan', `Target untuk ${sales.nama_sales} periode bulan ke-${selectedMonth} berhasil tersimpan di database.`, 'success');
      }
    } else {
      alert("Gagal menyimpan target: " + (data.message || 'Error'));
    }
  } catch (e) {
    console.error(e);
    alert("Terjadi kesalahan jaringan.");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  fetchRealTargetData();
});
