// js/spv_olx.js - Logika Halaman Hasil Trade-In OLX untuk SPV
document.addEventListener('DOMContentLoaded', () => {
  initSpvOlx();
});

let currentOlxData = [];
let allAvailableMonths = [];

async function initSpvOlx() {
  loadSpvProfile();
  renderPodium();
  renderMatrix();
  await loadAvailableMonths();
  await fetchOlxData();

  // Search input with debounce
  const searchInput = document.getElementById('searchOlx');
  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchOlxData();
      }, 300);
    });
  }
}

function loadSpvProfile() {
  const nama = localStorage.getItem('namaSales') || 'Supervisor';
  const role = localStorage.getItem('peranSales') || 'SPV Sales';
  const foto = localStorage.getItem('fotoSales') || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80';

  const elNama = document.getElementById('spvNama');
  const elRole = document.getElementById('spvRole');
  const elAvatar = document.getElementById('spvAvatar');

  if (elNama) elNama.textContent = nama;
  if (elRole) elRole.textContent = role;
  if (elAvatar) elAvatar.src = foto;

  // Auto preselect SPV filter if user is a known SPV
  const spvSelect = document.getElementById('selectSpv');
  if (spvSelect) {
    const namaLower = nama.toLowerCase();
    if (namaLower.includes('alvin')) spvSelect.value = 'Alvin';
    else if (namaLower.includes('ryan')) spvSelect.value = 'Ryan';
    else if (namaLower.includes('riva')) spvSelect.value = 'Riva';
  }
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
    }
  } catch (err) {
    console.error('Gagal mengambil daftar bulan:', err);
  }
}

async function fetchOlxData() {
  const month = document.getElementById('selectMonth')?.value || 'all';
  const spv = document.getElementById('selectSpv')?.value || 'all';
  const status = document.getElementById('selectStatus')?.value || 'all';
  const search = document.getElementById('searchOlx')?.value || '';

  const tableBody = document.getElementById('olxTableBody');
  if (tableBody) {
    tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data trade-in OLX...</td></tr>`;
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
      renderPodium(data.top_sales_podium);
      renderMatrix(data.spv_matrix);
      updateKpiCards(data.summary);
      renderLeaderboard(data.spv_data);
      renderTable(currentOlxData);
    } else {
      if (tableBody) tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#ef4444;">Gagal memuat data: ${data.message || 'Error'}</td></tr>`;
    }
  } catch (err) {
    console.error('Error fetching OLX data:', err);
    if (tableBody) tableBody.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:20px; color:#ef4444;">Gagal terhubung ke server.</td></tr>`;
  }
}

function renderPodium(topSales) {
  const grid = document.getElementById('olxPodiumGrid');
  if (!grid) return;

  // Expected 4 sales strictly ordered from left: Fadil, Egy, Jajang, Intan
  const defaultList = [
    { key: 'fadil', display_name: 'Fadil', full_name: 'Muhammad Fadil Fahmi', spv: 'Alvin', photo: '../images/olx_top/fadil.jpg', deal_count: 6, total_omset: 1580000000 },
    { key: 'egy', display_name: 'Egy', full_name: 'Egy', spv: 'Ryan', photo: '../images/olx_top/egy.jpg', deal_count: 5, total_omset: 1140000000 },
    { key: 'jajang', display_name: 'Jajang', full_name: 'Jajang', spv: 'Ryan', photo: '../images/olx_top/jajang.jpg', deal_count: 4, total_omset: 1475000000 },
    { key: 'intan', display_name: 'Intan', full_name: 'Intan', spv: 'Alvin', photo: '../images/olx_top/intan.jpg', deal_count: 4, total_omset: 885000000 }
  ];

  const sales = (topSales && topSales.length >= 4) ? topSales : defaultList;

  let html = sales.slice(0, 4).map((s, idx) => {
    return `
      <div class="olx-podium-card">
        <span class="olx-podium-rank-badge">${idx + 1}</span>
        <div class="olx-podium-photo-wrap">
          <img src="${s.photo}" alt="${escapeHtml(s.display_name)}" class="olx-podium-photo" onerror="this.src='../images/default-avatar.png'">
        </div>
        <div class="olx-podium-deal-box">
          <span class="olx-deal-label">JUMLAH DEAL</span>
          <div class="olx-deal-sales-name" title="${escapeHtml(s.full_name || s.display_name)}">${escapeHtml(s.display_name)}</div>
          <span class="olx-deal-spv-tag"><i class="fa-solid fa-user-tie"></i> Tim SPV ${escapeHtml(s.spv)}</span>
          <div>
            <span class="olx-deal-count-badge">
              <i class="fa-solid fa-check"></i> ${s.deal_count} Deal
            </span>
          </div>
          <div class="olx-deal-omset">${formatRupiahShort(s.total_omset || 0)}</div>
        </div>
      </div>
    `;
  }).join('');

  // 5th empty slot matching physical board
  html += `
    <div class="olx-podium-empty">
      <i class="fa-solid fa-user-plus"></i>
      <span class="olx-deal-label" style="color:rgba(255,255,255,0.7);">JUMLAH DEAL</span>
      <div style="font-size:13px; font-weight:800; margin-top:2px;">Slot Wiraniaga</div>
      <div style="font-size:10px; color:rgba(255,255,255,0.6); margin-top:4px;">Target Closing Berikutnya</div>
    </div>
  `;

  grid.innerHTML = html;
}

function renderMatrix(matrix) {
  const tbody = document.getElementById('olxMatrixBody');
  const tfoot = document.getElementById('olxMatrixFoot');
  if (!tbody) return;

  const defaultMatrix = {
    rows: [
      { month: 'Januari', alvin: 1, ryan: 0, riva: 0, total: 1 },
      { month: 'Februari', alvin: 1, ryan: 0, riva: 0, total: 1 },
      { month: 'Maret', alvin: 2, ryan: 0, riva: 0, total: 2 },
      { month: 'April', alvin: 1, ryan: 2, riva: 1, total: 4 },
      { month: 'Mei', alvin: 3, ryan: 4, riva: 0, total: 7 },
      { month: 'Juni', alvin: 2, ryan: 4, riva: 0, total: 6 },
      { month: 'Juli', alvin: 2, ryan: 1, riva: 1, total: 4 },
      { month: 'Agustus', alvin: 2, ryan: 3, riva: 0, total: 5 },
      { month: 'September', alvin: 0, ryan: 0, riva: 0, total: 0 },
      { month: 'Oktober', alvin: 0, ryan: 0, riva: 0, total: 0 },
      { month: 'November', alvin: 0, ryan: 0, riva: 0, total: 0 },
      { month: 'Desember', alvin: 0, ryan: 0, riva: 0, total: 0 }
    ],
    totals: { alvin: 14, ryan: 14, riva: 2, dealer_total: 30 }
  };

  const mat = (matrix && matrix.rows && matrix.rows.length > 0) ? matrix : defaultMatrix;
  const rows = mat.rows;
  const totals = mat.totals || { alvin: 0, ryan: 0, riva: 0, dealer_total: 0 };

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
    const isPastOrCurrent = (r.total > 0 || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus'].includes(r.month));

    const renderVal = (val) => {
      if (!isPastOrCurrent && val === 0) {
        return `<span class="olx-matrix-num-empty">-</span>`;
      }
      if (val > 0) {
        return `<span class="olx-matrix-num-deal">${val}</span>`;
      }
      return `<span class="olx-matrix-num-zero">0</span>`;
    };

    const renderTotal = (val) => {
      if (!isPastOrCurrent && val === 0) {
        return `<span class="olx-matrix-num-empty">-</span>`;
      }
      return `<strong style="font-size:14px; color:${val > 0 ? '#0f172a' : '#94a3b8'};">${val}</strong>`;
    };

    return `
      <tr>
        <td class="olx-matrix-month-cell">
          <i class="fa-solid ${icon}" style="color:#0284c7; width:16px; font-size:12px;"></i>
          ${escapeHtml(r.month)}
        </td>
        <td>${renderVal(r.alvin)}</td>
        <td>${renderVal(r.ryan)}</td>
        <td>${renderVal(r.riva)}</td>
        <td style="background:#f8fafc;">${renderTotal(r.total)}</td>
      </tr>
    `;
  }).join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr>
        <th style="text-align:left; padding-left:20px; font-size:14px;">
          <i class="fa-solid fa-trophy" style="color:#eab308; margin-right:6px;"></i> TOTAL DEAL
        </th>
        <th>
          <span class="olx-matrix-total-badge">${totals.alvin}</span>
        </th>
        <th>
          <span class="olx-matrix-total-badge">${totals.ryan}</span>
        </th>
        <th>
          <span class="olx-matrix-total-badge">${totals.riva}</span>
        </th>
        <th style="background:#d7123a; color:#ffffff;">
          <div style="font-size:16px; font-weight:900;">${totals.dealer_total} Deal</div>
          <div style="font-size:10px; opacity:0.85;">Closing Sukses</div>
        </th>
      </tr>
    `;
  }
}

function updateKpiCards(summary) {
  if (!summary) return;

  const elTotalUnit = document.getElementById('kpiTotalUnit');
  const elTotalDeal = document.getElementById('kpiTotalDeal');
  const elTotalNego = document.getElementById('kpiTotalNego');
  const elTotalNominal = document.getElementById('kpiTotalNominal');
  const elWinRate = document.getElementById('kpiWinRate');

  if (elTotalUnit) elTotalUnit.textContent = `${summary.total_unit || 0} Unit`;
  if (elTotalDeal) elTotalDeal.textContent = `${summary.total_deal || 0} Deal`;
  if (elTotalNego) elTotalNego.textContent = `${summary.total_nego || 0} Prospek`;
  if (elTotalNominal) elTotalNominal.textContent = formatRupiahShort(summary.total_nominal_deal || 0);
  if (elWinRate) elWinRate.textContent = `${summary.win_rate || 0}%`;
}

function renderLeaderboard(spvData) {
  const container = document.getElementById('leaderboardContainer');
  if (!container) return;

  if (!spvData || spvData.length === 0) {
    container.innerHTML = '<p style="font-size:12px; color:#64748b;">Belum ada data pencapaian SPV.</p>';
    return;
  }

  const avatarGradients = {
    'Alvin': 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
    'Ryan': 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    'Riva': 'linear-gradient(135deg, #059669 0%, #047857 100%)'
  };

  container.innerHTML = spvData.map(spv => {
    const gradient = avatarGradients[spv.spv_name] || 'linear-gradient(135deg, #475569, #334155)';
    const salesList = spv.sales_summary || [];

    // Sort sales by deal_count DESC
    salesList.sort((a, b) => b.deal_count - a.deal_count || b.total_unit - a.total_unit);

    return `
      <div class="olx-spv-box">
        <div class="olx-spv-head">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:${gradient}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px;">
              ${(spv.spv_name || 'SPV').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h4 style="font-size:14px; font-weight:800; color:#0f172a; margin:0;">Tim SPV ${escapeHtml(spv.spv_name)}</h4>
              <p style="font-size:11px; color:#64748b; margin:2px 0 0;">${spv.total_unit} Unit Masuk • ${formatRupiahShort(spv.total_nominal_deal)}</p>
            </div>
          </div>
          <div style="text-align:right;">
            <span class="badge-status badge-deal"><i class="fa-solid fa-check"></i> ${spv.deal_count} Deal</span>
            <div style="font-size:10px; font-weight:700; color:#0284c7; margin-top:3px;">Win Rate: ${spv.win_rate}%</div>
          </div>
        </div>

        <div style="margin-top:8px;">
          <div style="font-size:11px; font-weight:700; color:#94a3b8; text-transform:uppercase; margin-bottom:6px;">Top Wiraniaga:</div>
          ${salesList.slice(0, 4).map((s, idx) => `
            <div class="olx-sales-item">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="width:16px; height:16px; border-radius:50%; background:#f1f5f9; font-size:10px; font-weight:800; display:inline-flex; align-items:center; justify-content:center; color:#475569;">${idx+1}</span>
                <span style="font-weight:700; color:#1e293b;">${escapeHtml(s.nama_sales)}</span>
              </div>
              <div>
                <strong style="color:#059669;">${s.deal_count} Deal</strong>
                <span style="color:#64748b; font-size:11px;">(${s.total_unit} Unit)</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderTable(items) {
  const tbody = document.getElementById('olxTableBody');
  const countEl = document.getElementById('totalRowsCount');
  if (countEl) countEl.textContent = `${items.length} Data`;

  if (!tbody) return;

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:35px 20px; color:#64748b;">
          <i class="fa-solid fa-car-tunnel" style="font-size:32px; color:#cbd5e1; margin-bottom:10px; display:block;"></i>
          <strong style="font-size:14px; color:#0f172a;">Tidak Ada Data Trade-In OLX</strong>
          <p style="font-size:12px; margin:4px 0 0;">Coba sesuaikan filter bulan, SPV, atau kata kunci pencarian.</p>
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map((item, idx) => {
    const badgeClass = getStatusBadgeClass(item.hasil);
    const hargaFormatted = item.harga > 0 ? formatRupiah(item.harga) : '<span style="color:#94a3b8;">Menunggu Cek</span>';

    return `
      <tr>
        <td style="font-weight:700; color:#64748b;">${idx + 1}</td>
        <td style="white-space:nowrap;">
          <span style="font-size:11.5px; font-weight:700; background:#f8fafc; border:1px solid #e2e8f0; padding:3px 8px; border-radius:6px;">
            ${escapeHtml(item.month || '-')}
          </span>
        </td>
        <td>
          <div style="font-weight:800; color:#0f172a;">${escapeHtml(item.sales || '-')}</div>
          <div style="font-size:11px; color:#64748b;">SPV ${escapeHtml(item.spv || '-')}</div>
        </td>
        <td>
          <div style="font-weight:800; color:#0f172a;">${escapeHtml(item.merk)} ${escapeHtml(item.type)}</div>
          <div style="font-size:11.5px; color:#64748b;">Th. ${item.tahun || '-'} • Warna: ${escapeHtml(item.warna || '-')}</div>
        </td>
        <td style="white-space:nowrap;">
          <div><i class="fa-solid fa-gauge-high" style="color:#94a3b8; font-size:11px;"></i> ${escapeHtml(item.km || '-')}</div>
          <div style="font-size:11px; color:#64748b;">Pajak: ${escapeHtml(item.pajak || '-')}</div>
        </td>
        <td style="font-weight:800; color:#0f172a; white-space:nowrap;">
          ${hargaFormatted}
        </td>
        <td>
          <span class="badge-status ${badgeClass}">
            ${item.hasil === 'Deal' ? '<i class="fa-solid fa-check"></i> ' : ''}${escapeHtml(item.hasil)}
          </span>
        </td>
        <td style="font-size:12px; color:#475569; max-width:200px;">
          ${escapeHtml(item.ket || '-')}
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button class="btn-action-sm btn-edit-sm" onclick="showDetailModal(${item.id})">
            <i class="fa-solid fa-eye"></i> Detail
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function getStatusBadgeClass(hasil) {
  const h = (hasil || '').toLowerCase();
  if (h === 'deal') return 'badge-deal';
  if (h === 'nego') return 'badge-nego';
  if (h.includes('cek')) return 'badge-cek';
  if (h === 'batal') return 'badge-batal';
  return 'badge-pending';
}

function showDetailModal(id) {
  const item = currentOlxData.find(x => x.id === id);
  if (!item) return;

  const modal = document.getElementById('modalDetailOlx');
  const body = document.getElementById('modalDetailBody');
  if (!modal || !body) return;

  const hargaFormatted = item.harga > 0 ? formatRupiah(item.harga) : 'Belum Ditentukan';
  const badgeClass = getStatusBadgeClass(item.hasil);

  body.innerHTML = `
    <div style="text-align:center; margin-bottom:20px; padding-bottom:16px; border-bottom:1px solid #e2e8f0;">
      <span class="badge-status ${badgeClass}" style="font-size:12px; padding:5px 14px; margin-bottom:8px;">
        STATUS: ${escapeHtml(item.hasil)}
      </span>
      <h3 style="font-size:18px; font-weight:900; color:#0f172a; margin:6px 0 2px;">${escapeHtml(item.merk)} ${escapeHtml(item.type)}</h3>
      <p style="font-size:13px; color:#64748b; margin:0;">Tahun Pembuatan: ${item.tahun} • Warna: ${escapeHtml(item.warna || '-')}</p>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="font-size:11px; font-weight:700; color:#64748b;">WIRANIAGA PENANGGUNG JAWAB:</div>
        <div style="font-size:13.5px; font-weight:800; color:#0f172a;">${escapeHtml(item.sales)}</div>
        <div style="font-size:11px; color:#2563eb; font-weight:600;">Tim SPV ${escapeHtml(item.spv)}</div>
      </div>
      <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="font-size:11px; font-weight:700; color:#64748b;">NILAI TRANSAKSI / DEAL:</div>
        <div style="font-size:15px; font-weight:900; color:#059669;">${hargaFormatted}</div>
        <div style="font-size:11px; color:#64748b;">Bulan: ${escapeHtml(item.month)}</div>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="font-size:11px; font-weight:700; color:#64748b;">ODOMETER / KM:</div>
        <div style="font-size:13px; font-weight:800; color:#0f172a;">${escapeHtml(item.km || '-')}</div>
      </div>
      <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0;">
        <div style="font-size:11px; font-weight:700; color:#64748b;">MASA BERLAKU PAJAK:</div>
        <div style="font-size:13px; font-weight:800; color:#0f172a;">${escapeHtml(item.pajak || '-')}</div>
      </div>
    </div>

    <div style="background:#f8fafc; padding:12px; border-radius:10px; border:1px solid #e2e8f0; margin-bottom:20px;">
      <div style="font-size:11px; font-weight:700; color:#64748b; margin-bottom:4px;">CATATAN KONDISI / HASIL DEAL:</div>
      <div style="font-size:13px; color:#1e293b; line-height:1.5;">${escapeHtml(item.ket || 'Tidak ada catatan tambahan.')}</div>
    </div>
  `;

  modal.classList.add('active');
}

function closeDetailModal() {
  const modal = document.getElementById('modalDetailOlx');
  if (modal) modal.classList.remove('active');
}

function exportOlxCsv() {
  if (currentOlxData.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  let csv = 'ID,Periode Bulan,Wiraniaga,SPV,Merk,Tipe,Tahun,Warna,Harga Deal / Estimasi,KM,Pajak,Status Hasil,Keterangan\n';
  currentOlxData.forEach(item => {
    csv += `"${item.id}","${item.month}","${item.sales}","${item.spv}","${item.merk}","${item.type}","${item.tahun}","${item.warna}","${item.harga}","${item.km}","${item.pajak}","${item.hasil}","${(item.ket || '').replace(/"/g, '""')}"\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_TradeIn_OLX_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatRupiah(num) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
}

function formatRupiahShort(num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + ' Milyar';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(0) + ' Juta';
  }
  return formatRupiah(num);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
