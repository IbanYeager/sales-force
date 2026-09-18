// js/kacab_olx.js - Logika Pusat Manajemen & Pengaturan Hasil OLX untuk Kepala Cabang (Cabang Kiaracondong)
document.addEventListener('DOMContentLoaded', () => {
  initKacabOlx();
});

let currentOlxData = [];
let allAvailableMonths = [];

async function initKacabOlx() {
  loadKacabProfile();
  renderPodium();
  renderMatrix();
  await loadAvailableMonths();
  await fetchOlxData();

  // Search input debounce
  const searchInput = document.getElementById('searchOlx');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchOlxData();
      }, 300);
    });
  }
}

function loadKacabProfile() {
  const nama = localStorage.getItem('namaSales') || 'Kepala Cabang';
  const role = localStorage.getItem('peranSales') || 'Branch Manager';
  const foto = localStorage.getItem('fotoSales') || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80';

  const elNama = document.getElementById('kacabNama');
  const elRole = document.getElementById('kacabRole');
  const elAvatar = document.getElementById('kacabAvatar');

  if (elNama) elNama.textContent = nama;
  if (elRole) elRole.textContent = role;
  if (elAvatar) elAvatar.src = foto;
}

async function loadAvailableMonths() {
  try {
    const res = await fetch('../api/api_olx_pencapaian.php');
    const json = await res.json();
    if (json.status === 'success' && json.available_months) {
      allAvailableMonths = json.available_months;

      const selectMonth = document.getElementById('selectMonth');
      if (selectMonth) {
        selectMonth.innerHTML = '<option value="all">Semua Periode Bulan</option>';
        allAvailableMonths.forEach(m => {
          const opt = document.createElement('option');
          opt.value = m;
          opt.textContent = m;
          selectMonth.appendChild(opt);
        });
      }

      populateModalMonthSelects();
    }
  } catch (err) {
    console.error('Gagal mengambil daftar bulan:', err);
  }
}

function populateModalMonthSelects() {
  const months = allAvailableMonths.length > 0 ? allAvailableMonths : [
    'Januari 2026', 'Februari 2026', 'Maret 2026', 'April 2026', 'Mei 2026', 'Juni 2026', 'Juli 2026', 'Agustus 2026', 'September 2026'
  ];

  const addMonthEl = document.getElementById('addMonth');
  if (addMonthEl) {
    addMonthEl.innerHTML = '';
    months.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      addMonthEl.appendChild(opt);
    });
  }
}

async function fetchOlxData() {
  const month = document.getElementById('selectMonth')?.value || 'all';
  const spv = document.getElementById('selectSpv')?.value || 'all';
  const status = document.getElementById('selectStatus')?.value || 'all';
  const search = document.getElementById('searchOlx')?.value || '';

  const tableBody = document.getElementById('olxTableBody');
  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data trade-in OLX...</td></tr>`;
  }

  try {
    const params = new URLSearchParams({
      month: month,
      spv: spv,
      status: status,
      search: search
    });

    const res = await fetch(`../api/api_olx_pencapaian.php?${params.toString()}`);
    const data = await res.json();

    if (data.status === 'success') {
      currentOlxData = data.items || [];
      renderPodium(data.spv_showcase);
      renderMatrix(data.spv_matrix);
      updateKpiCards(data.summary);
      renderLeaderboard(data.spv_data);
      renderTable(currentOlxData);
    } else {
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">Gagal memuat data: ${data.message || 'Error'}</td></tr>`;
    }
  } catch (err) {
    console.error('Error fetching OLX data:', err);
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">Gagal terhubung ke server.</td></tr>`;
  }
}

// ════════════════════════════════════════════════════════════════
// RENDER HERO SHOWCASE (SPV CLOSING DEALS KIARACONDONG)
// ALVIN, FERYANTO, MUHAMMAD CAISARIVA, TOTAL DEALER
// ════════════════════════════════════════════════════════════════
function renderPodium(spvShowcase) {
  const grid = document.getElementById('olxPodiumGrid');
  if (!grid) return;

  const defaultList = [
    { key: 'alvin', display_name: 'ALVIN', role: 'Supervisor 1', deal_count: 16, photo: '../images/olx_top/spv_alvin.jpg', gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' },
    { key: 'feryanto', display_name: 'FERYANTO', role: 'Supervisor 2', deal_count: 15, photo: '../images/olx_top/spv_ryan.jpg', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
    { key: 'caisariva', display_name: 'MUHAMMAD CAISARIVA', role: 'Supervisor 3', deal_count: 2, photo: '../images/olx_top/spv_riva.jpg', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
  ];

  let list = defaultList;
  if (spvShowcase && spvShowcase.length >= 3) {
    list = spvShowcase.map((s, idx) => {
      const def = defaultList[idx] || {};
      return {
        ...def,
        ...s,
        photo: def.photo || '../images/default-avatar.png',
        gradient: def.gradient || 'linear-gradient(135deg, #334155, #1e293b)'
      };
    });
  }

  const totalDeals = list.reduce((acc, cur) => acc + (cur.deal_count || 0), 0);

  let html = list.map((s, idx) => {
    return `
      <div class="olx-podium-card" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 16px; padding: 18px 14px; text-align: center;">
        <span class="olx-podium-rank-badge" style="background: #eab308; color: #713f12; font-weight: 900; border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-bottom: 8px;">${idx + 1}</span>
        <div class="olx-podium-photo-wrap" style="margin: 0 auto 10px;">
          <img src="${s.photo}" alt="${escapeHtml(s.display_name)}" class="olx-podium-photo" style="width: 64px; height: 64px; border-radius: 50%; border: 2.5px solid #ffffff; object-fit: cover; box-shadow: 0 4px 10px rgba(0,0,0,0.3);" onerror="this.src='../images/default-avatar.png'">
        </div>
        <div class="olx-podium-deal-box">
          <span class="olx-deal-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.85;">PENCAPAIAN DEAL</span>
          <div class="olx-deal-sales-name" style="font-size: 15px; font-weight: 900; margin: 4px 0 2px; color: #ffffff;">${escapeHtml(s.display_name)}</div>
          <span class="olx-deal-spv-tag" style="font-size: 11px; opacity: 0.85; display: block; margin-bottom: 10px;">${escapeHtml(s.role || 'Supervisor')}</span>
          <div>
            <span class="olx-deal-count-badge" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 13px; padding: 5px 14px; border-radius: 20px; display: inline-block; box-shadow: 0 3px 8px rgba(16,185,129,0.4);">
              <i class="fa-solid fa-check"></i> ${s.deal_count} Deal
            </span>
          </div>
          <div style="font-size: 10.5px; opacity: 0.75; margin-top: 8px;">Tunas Kiaracondong</div>
        </div>
      </div>
    `;
  }).join('');

  // 4th slot: GRAND TOTAL DEALER
  html += `
    <div class="olx-podium-card" style="background: linear-gradient(135deg, rgba(216, 164, 55, 0.25) 0%, rgba(180, 83, 9, 0.35) 100%); border: 1.5px solid rgba(253, 224, 71, 0.5); border-radius: 16px; padding: 18px 14px; text-align: center;">
      <span class="olx-podium-rank-badge" style="background: #ffffff; color: #b45309; font-weight: 900; border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-bottom: 8px;"><i class="fa-solid fa-crown"></i></span>
      <div style="margin: 6px auto 12px; width: 64px; height: 64px; border-radius: 50%; background: #ffffff; display: flex; align-items: center; justify-content: center; color: #d8a437; font-size: 26px; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
        <i class="fa-solid fa-trophy"></i>
      </div>
      <div class="olx-podium-deal-box">
        <span class="olx-deal-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #fef08a;">TOTAL CABANG</span>
        <div class="olx-deal-sales-name" style="font-size: 15px; font-weight: 900; margin: 4px 0 2px; color: #ffffff;">GRAND TOTAL</div>
        <span class="olx-deal-spv-tag" style="font-size: 11px; color: #fef08a; display: block; margin-bottom: 10px;">Semua Supervisor</span>
        <div>
          <span class="olx-deal-count-badge" style="background: #ffffff; color: #b45309; font-weight: 900; font-size: 14px; padding: 5px 16px; border-radius: 20px; display: inline-block; box-shadow: 0 3px 10px rgba(0,0,0,0.2);">
            <i class="fa-solid fa-award"></i> ${totalDeals} Deal
          </span>
        </div>
        <div style="font-size: 10.5px; color: #fef08a; margin-top: 8px;">Jan - Sep 2026</div>
      </div>
    </div>
  `;

  grid.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════
// RENDER PAPAN MATRIX REKAP BULANAN (ALVIN | FERYANTO | CAISARIVA)
// ════════════════════════════════════════════════════════════════
function renderMatrix(matrix) {
  const tbody = document.getElementById('olxMatrixBody');
  const tfoot = document.getElementById('olxMatrixFoot');
  if (!tbody) return;

  const defaultMatrix = {
    rows: [
      { month: 'Januari', alvin: 1, feryanto: 0, caisariva: 0, total: 1 },
      { month: 'Februari', alvin: 1, feryanto: 0, caisariva: 0, total: 1 },
      { month: 'Maret', alvin: 2, feryanto: 0, caisariva: 0, total: 2 },
      { month: 'April', alvin: 1, feryanto: 2, caisariva: 1, total: 4 },
      { month: 'Mei', alvin: 3, feryanto: 4, caisariva: 0, total: 7 },
      { month: 'Juni', alvin: 2, feryanto: 4, caisariva: 0, total: 6 },
      { month: 'Juli', alvin: 2, feryanto: 1, caisariva: 1, total: 4 },
      { month: 'Agustus', alvin: 2, feryanto: 2, caisariva: 0, total: 4 },
      { month: 'September', alvin: 2, feryanto: 2, caisariva: 0, total: 4 },
      { month: 'Oktober', alvin: 0, feryanto: 0, caisariva: 0, total: 0 },
      { month: 'November', alvin: 0, feryanto: 0, caisariva: 0, total: 0 },
      { month: 'Desember', alvin: 0, feryanto: 0, caisariva: 0, total: 0 }
    ],
    totals: { alvin: 16, feryanto: 15, caisariva: 2, dealer_total: 33 }
  };

  const mat = (matrix && matrix.rows && matrix.rows.length > 0) ? matrix : defaultMatrix;
  const rows = mat.rows;
  const totals = mat.totals || { alvin: 16, feryanto: 15, caisariva: 2, dealer_total: 33 };

  const monthIcons = {
    'Januari': 'fa-snowflake',
    'Februari': 'fa-heart',
    'Maret': 'fa-clover',
    'April': 'fa-seedling',
    'Mei': 'fa-sun',
    'Juni': 'fa-umbrella-beach',
    'Juli': 'fa-fire',
    'Agustus': 'fa-flag',
    'September': 'fa-leaf',
    'Oktober': 'fa-tree',
    'November': 'fa-cloud',
    'Desember': 'fa-gift'
  };

  tbody.innerHTML = rows.map(r => {
    const icon = monthIcons[r.month] || 'fa-calendar-day';
    const isPastOrCurrent = (r.total > 0 || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September'].includes(r.month));

    const renderVal = (val) => {
      if (!isPastOrCurrent && val === 0) {
        return `<span class="olx-matrix-num-empty">-</span>`;
      }
      if (val > 0) {
        return `<span class="olx-matrix-num-deal" style="background:#ecfdf5; color:#059669; font-weight:800; padding:3px 9px; border-radius:6px; display:inline-block; border:1px solid #a7f3d0;">${val}</span>`;
      }
      return `<span class="olx-matrix-num-zero" style="color:#94a3b8;">0</span>`;
    };

    const renderTotal = (val) => {
      if (!isPastOrCurrent && val === 0) {
        return `<span class="olx-matrix-num-empty">-</span>`;
      }
      return `<strong style="font-size:14px; color:${val > 0 ? '#0f172a' : '#94a3b8'};">${val}</strong>`;
    };

    return `
      <tr>
        <td class="olx-matrix-month-cell" style="padding-left:20px; font-weight:700;">
          <i class="fa-solid ${icon}" style="color:#0284c7; width:16px; font-size:12px;"></i>
          ${escapeHtml(r.month)}
        </td>
        <td style="text-align:center;">${renderVal(r.alvin)}</td>
        <td style="text-align:center;">${renderVal(r.feryanto)}</td>
        <td style="text-align:center;">${renderVal(r.caisariva)}</td>
        <td style="background:#f8fafc; text-align:center;">${renderTotal(r.total)}</td>
      </tr>
    `;
  }).join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <th style="text-align:left; padding-left:20px; font-size:14px;">
          <i class="fa-solid fa-trophy" style="color:#eab308; margin-right:6px;"></i> TOTAL DEAL
        </th>
        <th style="text-align:center;">
          <span class="olx-matrix-total-badge" style="background:#0284c7; color:#ffffff; font-size:14px; padding:4px 12px; border-radius:12px;">${totals.alvin}</span>
        </th>
        <th style="text-align:center;">
          <span class="olx-matrix-total-badge" style="background:#7c3aed; color:#ffffff; font-size:14px; padding:4px 12px; border-radius:12px;">${totals.feryanto}</span>
        </th>
        <th style="text-align:center;">
          <span class="olx-matrix-total-badge" style="background:#059669; color:#ffffff; font-size:14px; padding:4px 12px; border-radius:12px;">${totals.caisariva}</span>
        </th>
        <th style="background:#d7123a; color:#ffffff; text-align:center;">
          <div style="font-size:16px; font-weight:900;">${totals.dealer_total} Deal</div>
          <div style="font-size:10px; opacity:0.85;">Closing Sukses</div>
        </th>
      </tr>
    `;
  }
}

// ════════════════════════════════════════════════════════════════
// UPDATE KPI CARDS (NO MONEY / PRICES)
// ════════════════════════════════════════════════════════════════
function updateKpiCards(summary) {
  if (!summary) return;

  const elTotalDeal = document.getElementById('kpiTotalDeal');
  const elDealAlvin = document.getElementById('kpiDealAlvin');
  const elDealFeryanto = document.getElementById('kpiDealFeryanto');
  const elDealCaisariva = document.getElementById('kpiDealCaisariva');
  const elCabangKircon = document.getElementById('kpiCabangKircon');

  if (elTotalDeal) elTotalDeal.textContent = `${summary.total_deal || 33} Deal`;
  if (elDealAlvin) elDealAlvin.textContent = `${summary.deal_alvin || 16} Deal`;
  if (elDealFeryanto) elDealFeryanto.textContent = `${summary.deal_feryanto || 15} Deal`;
  if (elDealCaisariva) elDealCaisariva.textContent = `${summary.deal_caisariva || 2} Deal`;
  if (elCabangKircon) elCabangKircon.textContent = 'Kiaracondong';
}

// ════════════════════════════════════════════════════════════════
// RENDER REKAP PERFORMA ANTAR TIM SPV (NO SALES, NO PRICES)
// ════════════════════════════════════════════════════════════════
function renderLeaderboard(spvData) {
  const container = document.getElementById('leaderboardContainer');
  if (!container) return;

  const defaultSpvs = [
    { spv_name: 'ALVIN', deal_count: 16 },
    { spv_name: 'FERYANTO', deal_count: 15 },
    { spv_name: 'MUHAMMAD CAISARIVA', deal_count: 2 }
  ];

  const data = (spvData && spvData.length > 0) ? spvData : defaultSpvs;

  const avatarGradients = {
    'ALVIN': 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    'FERYANTO': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    'MUHAMMAD CAISARIVA': 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  };

  container.innerHTML = data.map(spv => {
    const sName = spv.spv_name.toUpperCase();
    const gradient = avatarGradients[sName] || 'linear-gradient(135deg, #475569, #334155)';

    return `
      <div class="olx-spv-box" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:18px 20px; box-shadow:0 3px 12px rgba(0,0,0,0.02);">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; border-radius:12px; background:${gradient}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;">
              ${sName.substring(0, 2)}
            </div>
            <div>
              <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Tim SPV ${escapeHtml(sName)}</h4>
              <p style="font-size:11.5px; color:#64748b; margin:2px 0 0;">Tunas Toyota Kiaracondong</p>
            </div>
          </div>
          <div style="text-align:right;">
            <span class="badge-status badge-deal" style="font-size:12px; padding:6px 12px;">
              <i class="fa-solid fa-check"></i> ${spv.deal_count} Deal
            </span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ════════════════════════════════════════════════════════════════
// RENDER TABLE (COLUMNS: #, BULAN, CABANG, SPV, STATUS, KETERANGAN, AKSI)
// STRICTLY NO SALES NAMES & NO PRICES
// ════════════════════════════════════════════════════════════════
function renderTable(items) {
  const tbody = document.getElementById('olxTableBody');
  const countEl = document.getElementById('totalRowsCount');
  if (countEl) countEl.textContent = `${items.length} Data Deal`;

  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:35px 20px; color:#64748b;">
          <i class="fa-solid fa-folder-open" style="font-size:32px; color:#cbd5e1; margin-bottom:10px; display:block;"></i>
          <strong style="font-size:14px; color:#0f172a;">Tidak Ada Data Closing Deal</strong>
          <p style="font-size:12px; margin:4px 0 0;">Klik tombol <strong>"+ Tambah Data Deal"</strong> di atas untuk menambahkan data.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item, idx) => {
    return `
      <tr>
        <td style="font-weight:700; color:#64748b; text-align:center;">${idx + 1}</td>
        <td style="white-space:nowrap;">
          <span style="font-size:12px; font-weight:700; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:6px;">
            ${escapeHtml(item.month || '-')}
          </span>
        </td>
        <td style="font-weight:700; color:#0f172a;">${escapeHtml(item.cabang || 'Tunas Toyota - Kiaracondong')}</td>
        <td>
          <span style="font-weight:800; color:#0284c7;">Tim SPV ${escapeHtml(item.spv || '-')}</span>
        </td>
        <td>
          <span class="badge-status badge-deal">
            <i class="fa-solid fa-check"></i> ${escapeHtml(item.hasil || 'Deal')}
          </span>
        </td>
        <td style="font-size:12px; color:#475569;">
          ${escapeHtml(item.ket || 'Closing Deal OLX mobbi')}
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button class="btn-action-sm btn-del-sm" title="Hapus Data Deal" onclick="deleteTradeIn(${item.id})">
            <i class="fa-solid fa-trash"></i> Hapus
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// ════════════════════════════════════════════════════════════════
// KACAB CONTROL: TAMBAH DATA DEAL BARU
// ════════════════════════════════════════════════════════════════
function openAddModal() {
  const modal = document.getElementById('modalAddOlx');
  if (!modal) return;

  document.getElementById('formAddOlx')?.reset();
  populateModalMonthSelects();

  modal.classList.add('active');
}

function closeAddModal() {
  const modal = document.getElementById('modalAddOlx');
  if (modal) modal.classList.remove('active');
}

async function saveAddTradeIn(e) {
  if (e) e.preventDefault();

  const month = document.getElementById('addMonth')?.value || 'Januari 2026';
  const spv = document.getElementById('addSpv')?.value || 'ALVIN';
  const ket = document.getElementById('addKet')?.value.trim() || 'Closing Deal OLX mobbi';

  try {
    const res = await fetch('../api/api_olx_pencapaian.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add',
        month: month,
        spv: spv,
        hasil: 'Deal',
        ket: ket
      })
    });
    const result = await res.json();

    if (result.status === 'success') {
      closeAddModal();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil!', 'Data closing deal OLX berhasil ditambahkan.', 'success');
      } else {
        alert('Data closing deal OLX berhasil ditambahkan.');
      }
      fetchOlxData();
    } else {
      alert(result.message || 'Gagal menambahkan data');
    }
  } catch (err) {
    console.error('Error saving deal:', err);
    alert('Terjadi kesalahan jaringan.');
  }
}

async function deleteTradeIn(id) {
  if (!confirm(`Yakin ingin menghapus data closing deal ini?`)) {
    return;
  }

  try {
    const res = await fetch('../api/api_olx_pencapaian.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', id: id })
    });
    const result = await res.json();

    if (result.status === 'success') {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Terhapus!', 'Data closing deal berhasil dihapus.', 'success');
      }
      fetchOlxData();
    } else {
      alert(result.message || 'Gagal menghapus data');
    }
  } catch (err) {
    console.error('Error deleting deal:', err);
    alert('Terjadi kesalahan saat menghapus data.');
  }
}

// ════════════════════════════════════════════════════════════════
// EKSPOR CSV RESMI (SESUAI EXCEL REPORT 2026)
// ════════════════════════════════════════════════════════════════
function exportOlxCsv() {
  if (currentOlxData.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  let csv = 'No,Periode Bulan,Cabang,Supervisor,Status Hasil,Keterangan\n';
  currentOlxData.forEach((item, idx) => {
    csv += `"${idx + 1}","${item.month}","${item.cabang || 'Tunas Toyota - Kiaracondong'}","${item.spv}","${item.hasil}","${(item.ket || '').replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Report_OLX_Kiaracondong_2026_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
