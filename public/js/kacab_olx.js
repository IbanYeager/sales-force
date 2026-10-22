// js/kacab_olx.js - Papan Prestasi & Rekapitulasi Closing Deal Trade-In OLX Mobbi Cabang Kiaracondong (Kacab Panel)
// Termasuk Daily Board Monitoring Progress Bulan Oktober 2026

document.addEventListener('DOMContentLoaded', () => {
  initKacabOlx();
});

let allDailyBoardItems = [];

async function initKacabOlx() {
  loadKacabProfile();
  renderPodium();
  renderMatrix();
  renderDailyBoard(getDefaultDailyBoard());
  await fetchOlxData();
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

async function fetchOlxData() {
  try {
    const res = await fetch('../api/api_olx_pencapaian.php');
    const data = await res.json();

    if (data.status === 'success') {
      renderPodium(data.spv_showcase);
      renderMatrix(data.spv_matrix);
      if (data.daily_board_oktober && data.daily_board_oktober.items) {
        renderDailyBoard(data.daily_board_oktober.items);
      }
    }
  } catch (err) {
    console.error('Error fetching OLX data:', err);
  }
}

// ════════════════════════════════════════════════════════════════
// 1. RENDER HERO SHOWCASE / PODIUM (KIARACONDONG)
// SORTED DYNAMICALLY BY DEAL COUNT (RYAN: 17, ALVIN: 16, RIVA: 2)
// ════════════════════════════════════════════════════════════════
function renderPodium(spvShowcase) {
  const grid = document.getElementById('olxPodiumGrid');
  if (!grid) return;

  const defaultList = [
    {
      key: 'feryanto',
      display_name: 'FERYANTO (RYAN)',
      role: 'Supervisor 2',
      deal_count: 17,
      photo: '../images/olx_top/spv_ryan.jpg',
      ringColor: '#c084fc'
    },
    {
      key: 'alvin',
      display_name: 'ALVIN',
      role: 'Supervisor 1',
      deal_count: 16,
      photo: '../images/olx_top/spv_alvin.jpg',
      ringColor: '#38bdf8'
    },
    {
      key: 'caisariva',
      display_name: 'MUHAMMAD CAISARIVA (RIVA)',
      role: 'Supervisor 3',
      deal_count: 2,
      photo: '../images/olx_top/spv_riva.jpg',
      ringColor: '#34d399'
    }
  ];

  let list = defaultList;
  if (spvShowcase && spvShowcase.length >= 3) {
    list = spvShowcase.map((s) => {
      const def = defaultList.find(d => d.key === s.key || s.display_name.includes(d.display_name.split(' ')[0])) || {};
      return {
        key: s.key || def.key,
        display_name: s.display_name || def.display_name,
        role: s.role || def.role,
        deal_count: s.deal_count !== undefined ? s.deal_count : (def.deal_count || 0),
        photo: def.photo || '../images/olx_top/spv_ryan.jpg',
        ringColor: def.ringColor || '#38bdf8'
      };
    });
  }

  // Sort descending by deal count
  list.sort((a, b) => (parseInt(b.deal_count) || 0) - (parseInt(a.deal_count) || 0));

  const rankBadges = [
    { badge: '1', bg: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { badge: '2', bg: 'linear-gradient(135deg, #94a3b8, #64748b)' },
    { badge: '3', bg: 'linear-gradient(135deg, #d97706, #b45309)' }
  ];

  const totalDeals = list.reduce((acc, cur) => acc + (parseInt(cur.deal_count) || 0), 0) || 35;

  let html = list.map((spv, idx) => {
    const rb = rankBadges[idx] || rankBadges[2];
    return `
      <div class="olx-podium-card">
        <span class="olx-podium-rank-badge" style="background: ${rb.bg};">
          ${rb.badge}
        </span>
        <div class="olx-podium-avatar-wrap">
          <img src="${spv.photo}" alt="${spv.display_name}" class="olx-podium-avatar" style="border: 3px solid ${spv.ringColor};" onerror="this.src='../images/default-avatar.png'">
        </div>
        <span class="olx-card-label">PENCAPAIAN DEAL</span>
        <div class="olx-card-name">${spv.display_name}</div>
        <span class="olx-card-role">${spv.role}</span>
        <div>
          <span class="olx-deal-badge-pill">
            <i class="fa-solid fa-circle-check"></i> ${spv.deal_count} Deal
          </span>
        </div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 10px; font-weight: 600;">
          <i class="fa-regular fa-calendar-check" style="color: #38bdf8;"></i> Periode 2026
        </div>
      </div>
    `;
  }).join('');

  // 4th slot: GRAND TOTAL DEALER
  html += `
    <div class="olx-podium-card olx-podium-card-total">
      <span class="olx-podium-rank-badge" style="background: linear-gradient(135deg, #f59e0b, #b45309);">
        <i class="fa-solid fa-crown"></i>
      </span>
      <div class="olx-trophy-circle">
        <i class="fa-solid fa-trophy"></i>
      </div>
      <span class="olx-card-label" style="color: #fef08a;">TOTAL CABANG</span>
      <div class="olx-card-name" style="color: #ffffff; font-size: 17px;">GRAND TOTAL</div>
      <span class="olx-card-role" style="color: #fde68a;">Semua Tim Supervisor</span>
      <div>
        <span class="olx-deal-badge-total">
          <i class="fa-solid fa-award"></i> ${totalDeals} Deal
        </span>
      </div>
      <div style="font-size: 11px; color: #fef08a; margin-top: 10px; font-weight: 700;">
        <i class="fa-solid fa-certificate"></i> Terverifikasi Excel & Board 2026
      </div>
    </div>
  `;

  grid.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════
// 2. RENDER PAPAN MATRIX REKAP BULANAN (ALVIN | FERYANTO | CAISARIVA)
// UPDATE BULAN OKTOBER: RYAN +2 DEAL, ALVIN 0, RIVA 0, TOTAL DEALER 35
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
      { month: 'Oktober', alvin: 0, feryanto: 2, caisariva: 0, total: 2 },
      { month: 'November', alvin: 0, feryanto: 0, caisariva: 0, total: 0 },
      { month: 'Desember', alvin: 0, feryanto: 0, caisariva: 0, total: 0 }
    ],
    totals: { alvin: 16, feryanto: 17, caisariva: 2, dealer_total: 35 }
  };

  const mat = (matrix && matrix.rows && matrix.rows.length > 0) ? matrix : defaultMatrix;
  const rows = mat.rows;
  const totals = mat.totals || { alvin: 16, feryanto: 17, caisariva: 2, dealer_total: 35 };

  const monthConfig = {
    'Januari': { icon: 'fa-snowflake', color: '#0284c7', bg: '#e0f2fe' },
    'Februari': { icon: 'fa-heart', color: '#e11d48', bg: '#ffe4e6' },
    'Maret': { icon: 'fa-clover', color: '#16a34a', bg: '#dcfce7' },
    'April': { icon: 'fa-seedling', color: '#059669', bg: '#d1fae5' },
    'Mei': { icon: 'fa-sun', color: '#d97706', bg: '#fef3c7' },
    'Juni': { icon: 'fa-umbrella-beach', color: '#0284c7', bg: '#e0f2fe' },
    'Juli': { icon: 'fa-fire', color: '#ea580c', bg: '#ffedd5' },
    'Agustus': { icon: 'fa-flag', color: '#dc2626', bg: '#fee2e2' },
    'September': { icon: 'fa-leaf', color: '#15803d', bg: '#dcfce7' },
    'Oktober': { icon: 'fa-tree', color: '#b45309', bg: '#fef3c7' },
    'November': { icon: 'fa-cloud', color: '#475569', bg: '#f1f5f9' },
    'Desember': { icon: 'fa-gift', color: '#7c3aed', bg: '#f3e8ff' }
  };

  tbody.innerHTML = rows.map(r => {
    const cfg = monthConfig[r.month] || { icon: 'fa-calendar-day', color: '#0284c7', bg: '#e0f2fe' };
    const isPastOrCurrent = (r.total > 0 || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober'].includes(r.month));

    const valAlvin = r.alvin !== undefined ? r.alvin : 0;
    const valFeryanto = (r.feryanto !== undefined ? r.feryanto : r.ryan) ?? 0;
    const valCaisariva = (r.caisariva !== undefined ? r.caisariva : r.riva) ?? 0;
    const valTotal = (r.total !== undefined ? r.total : (valAlvin + valFeryanto + valCaisariva)) ?? 0;

    const renderVal = (val) => {
      if (!isPastOrCurrent && (val === 0 || val === '-' || val === undefined)) {
        return `<span style="color:#cbd5e1; font-weight:700; font-size:14px;">-</span>`;
      }
      if (val > 0) {
        return `
          <span style="
            background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
            color: #065f46;
            font-weight: 900;
            font-size: 14.5px;
            padding: 5px 16px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 44px;
            border: 1.5px solid #a7f3d0;
            box-shadow: 0 2px 6px rgba(16,185,129,0.18);
          ">
            ${val}
          </span>
        `;
      }
      return `
        <span style="
          display: inline-block;
          width: 28px;
          height: 28px;
          line-height: 28px;
          border-radius: 50%;
          background: #f1f5f9;
          color: #94a3b8;
          font-weight: 700;
          font-size: 12.5px;
        ">
          0
        </span>
      `;
    };

    const renderTotalVal = (val) => {
      if (!isPastOrCurrent && (val === 0 || val === '-' || val === undefined)) {
        return `<span style="color:#cbd5e1; font-weight:700; font-size:14px;">-</span>`;
      }
      return `
        <span style="
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 14.5px;
          padding: 6px 18px;
          border-radius: 10px;
          display: inline-block;
          min-width: 48px;
          box-shadow: 0 2px 8px rgba(15,23,42,0.25);
        ">
          ${val}
        </span>
      `;
    };

    return `
      <tr>
        <td style="font-weight:800; color:#1e293b; padding-left:22px; text-align:left;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="
              width: 32px;
              height: 32px;
              border-radius: 8px;
              background: ${cfg.bg};
              color: ${cfg.color};
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              flex-shrink: 0;
            ">
              <i class="fa-solid ${cfg.icon}"></i>
            </span>
            <span style="font-size: 14px; font-weight: 800; color: #1e293b;">${r.month}</span>
          </div>
        </td>
        <td style="text-align:center;">${renderVal(valAlvin)}</td>
        <td style="text-align:center;">${renderVal(valFeryanto)}</td>
        <td style="text-align:center;">${renderVal(valCaisariva)}</td>
        <td style="text-align:center; background:#f8fafc; font-weight:800;">${renderTotalVal(valTotal)}</td>
      </tr>
    `;
  }).join('');

  if (tfoot) {
    const totAlvin = totals.alvin ?? 16;
    const totFeryanto = totals.feryanto ?? totals.ryan ?? 17;
    const totCaisariva = totals.caisariva ?? totals.riva ?? 2;
    const dealerTotal = totals.dealer_total ?? (totAlvin + totFeryanto + totCaisariva) ?? 35;

    tfoot.innerHTML = `
      <tr style="background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #ffffff;">
        <td style="padding: 18px 22px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 0.6px; text-align:left;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="
              width: 34px;
              height: 34px;
              border-radius: 8px;
              background: rgba(251, 191, 36, 0.2);
              color: #fbbf24;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
            ">
              <i class="fa-solid fa-trophy"></i>
            </span>
            <span>TOTAL DEAL (2026)</span>
          </div>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; font-weight: 900; font-size: 15px; padding: 7px 20px; border-radius: 24px; display: inline-block; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.4); border: 1px solid rgba(255,255,255,0.25);">
            ${totAlvin} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: linear-gradient(135deg, #7c3aed, #6d28d9); color: #ffffff; font-weight: 900; font-size: 15px; padding: 7px 20px; border-radius: 24px; display: inline-block; box-shadow: 0 4px 14px rgba(124, 58, 237, 0.4); border: 1px solid rgba(255,255,255,0.25);">
            ${totFeryanto} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: linear-gradient(135deg, #059669, #047857); color: #ffffff; font-weight: 900; font-size: 15px; padding: 7px 20px; border-radius: 24px; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4); border: 1px solid rgba(255,255,255,0.25);">
            ${totCaisariva} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff; font-weight: 900; font-size: 16px; padding: 8px 22px; border-radius: 24px; display: inline-block; box-shadow: 0 4px 16px rgba(220, 38, 38, 0.5); border: 1.5px solid rgba(254, 202, 202, 0.4);">
            <i class="fa-solid fa-crown" style="color:#fef08a; margin-right:4px;"></i> ${dealerTotal} Deal
          </span>
        </td>
      </tr>
    `;
  }
}

// ════════════════════════════════════════════════════════════════
// 3. DAILY BOARD MONITORING PROGRESS - BULAN OKTOBER 2026
// TABEL RESMI BERDASARKAN WHITEBOARD MONITORING HARIAN KIARACONDONG
// ════════════════════════════════════════════════════════════════
function getDefaultDailyBoard() {
  return [
    { no: 1, sales: 'TAMA', spv: 'RYAN', customer: 'Yusuf', merk: 'Daihatsu', type: 'Sigra D', tahun: 2021, warna: 'Silver', harga: 115000000, km: '57.000', pajak: 'Mei 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 2, sales: 'Yeni', spv: 'Alvin', customer: 'Jaya', merk: 'Toyota', type: 'Innova E MT BSN', tahun: 2011, warna: 'Hitam', harga: 145000000, km: '484.000', pajak: 'Feb 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 3, sales: 'Reza', spv: 'RYAN', customer: 'Deni', merk: 'Daihatsu', type: 'Rocky Turbo', tahun: 2022, warna: 'Silver', harga: 155000000, km: '14.000', pajak: 'Mei 2027', ket: 'Jadwal liat Mobil', hasil: 'Proses' },
    { no: 4, sales: 'Yani', spv: 'RYAN', customer: 'Ujang', merk: 'Toyota', type: 'Calya E MT', tahun: 2018, warna: 'Putih', harga: 85000000, km: '70 rb', pajak: 'Jun 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 5, sales: 'Yoni', spv: 'ALVIN', customer: 'Ko Albert', merk: 'Mitsubishi', type: 'Pajero Dakar 4x2', tahun: 2022, warna: 'Putih', harga: 420000000, km: '16.000', pajak: 'Jan 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 6, sales: 'Putri', spv: 'RIVA', customer: 'Siska', merk: 'Honda', type: 'Brio E CVT', tahun: 2023, warna: 'Putih', harga: 140000000, km: '45 rb', pajak: 'Jul 2027', ket: 'Jadwal Cek', hasil: 'Proses' },
    { no: 7, sales: 'Denis', spv: 'RYAN', customer: 'Atang', merk: 'Toyota', type: 'Veloz Q Modellista', tahun: 2022, warna: 'Hitam', harga: 257000000, km: '4 rb', pajak: 'Agt 2027', ket: 'Deal', hasil: 'Deal' },
    { no: 8, sales: 'Topik', spv: 'ALVIN', customer: 'Gilang', merk: 'Honda', type: 'Brio RS', tahun: 2020, warna: 'Putih', harga: 150000000, km: '50 rb', pajak: 'Sept 2027', ket: 'Cek Inspeksi', hasil: 'Proses' },
    { no: 9, sales: 'Erik', spv: 'Ryan', customer: 'Bayu', merk: 'Toyota', type: 'Avanza E MT', tahun: 2016, warna: 'Hitam', harga: 110000000, km: '116 rb', pajak: 'Jul 2027', ket: 'Cek Inspeksi', hasil: 'Proses' },
    { no: 10, sales: 'Dean', spv: 'Ryan', customer: 'Deny', merk: 'Nissan', type: 'Livina XV MT', tahun: 2008, warna: 'Hitam', harga: 70000000, km: '200 rb', pajak: 'Feb 2027', ket: 'Deal', hasil: 'Deal' },
    { no: 11, sales: 'Rahma', spv: 'Ryan', customer: 'Firman', merk: 'Toyota', type: 'Veloz MT', tahun: 2022, warna: 'Hitam', harga: 182000000, km: '40 rb', pajak: 'Jan 2027', ket: 'Cek Inspeksi', hasil: 'Proses' },
    { no: 12, sales: 'Rahma', spv: 'Ryan', customer: 'Sunandar', merk: 'Toyota', type: 'Calya G MT', tahun: 2023, warna: 'Silver', harga: 120000000, km: '9 rb', pajak: 'Mar 2027', ket: 'Cek Inspeksi', hasil: 'Proses' },
    { no: 13, sales: 'Yeni', spv: 'Alvin', customer: 'Andi', merk: 'Toyota', type: 'Alphard G AT', tahun: 2022, warna: 'Putih', harga: 750000000, km: '5 rb', pajak: 'Agt 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 14, sales: 'Yani', spv: 'Ryan', customer: 'Esti', merk: 'Toyota', type: 'Innova 2.4 G AT', tahun: 2026, warna: 'Putih', harga: 360000000, km: '6 rb', pajak: 'Apr 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 15, sales: 'Topik', spv: 'Alvin', customer: 'R. Sekartini', merk: 'Honda', type: 'Brio E AT', tahun: 2022, warna: 'Silver', harga: 133000000, km: '70 rb', pajak: 'Agt 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 16, sales: 'Udil', spv: 'Alvin', customer: 'Dwi Ratna', merk: 'Honda', type: 'Brio RS CVT', tahun: 2026, warna: 'Putih', harga: 155000000, km: '2 rb', pajak: 'Okt 2027', ket: 'Cek Harga', hasil: 'Proses' },
    { no: 17, sales: 'Egy', spv: 'Ryan', customer: 'Zaka', merk: 'Honda', type: 'Brio E MT', tahun: 2014, warna: 'Hitam', harga: 123000000, km: '140 rb', pajak: '-', ket: 'Cek Harga', hasil: 'Proses' }
  ];
}

function renderDailyBoard(items) {
  allDailyBoardItems = items && items.length > 0 ? items : getDefaultDailyBoard();
  filterDailyBoard();
}

function filterDailyBoard() {
  const tbody = document.getElementById('dailyBoardTableBody');
  const tfoot = document.getElementById('dailyBoardTableFoot');
  if (!tbody) return;

  const searchInput = document.getElementById('dbSearchInput');
  const filterSpv = document.getElementById('dbFilterSpv');
  const filterStatus = document.getElementById('dbFilterStatus');

  const q = searchInput ? searchInput.value.toLowerCase().trim() : '';
  const spvVal = filterSpv ? filterSpv.value : 'all';
  const statusVal = filterStatus ? filterStatus.value : 'all';

  let filtered = allDailyBoardItems.filter(item => {
    // Search query
    if (q) {
      const matchSearch = (
        (item.sales && item.sales.toLowerCase().includes(q)) ||
        (item.customer && item.customer.toLowerCase().includes(q)) ||
        (item.spv && item.spv.toLowerCase().includes(q)) ||
        (item.merk && item.merk.toLowerCase().includes(q)) ||
        (item.type && item.type.toLowerCase().includes(q)) ||
        (item.ket && item.ket.toLowerCase().includes(q)) ||
        (item.warna && item.warna.toLowerCase().includes(q))
      );
      if (!matchSearch) return false;
    }

    // SPV filter
    if (spvVal !== 'all') {
      const spvStr = (item.spv || '').toUpperCase();
      if (!spvStr.includes(spvVal)) return false;
    }

    // Status filter
    if (statusVal !== 'all') {
      const ketStr = (item.ket || '').toLowerCase();
      const hasilStr = (item.hasil || '').toLowerCase();
      const sLower = statusVal.toLowerCase();

      if (sLower === 'deal') {
        if (!ketStr.includes('deal') && !hasilStr.includes('deal')) return false;
      } else if (sLower === 'jadwal') {
        if (!ketStr.includes('jadwal')) return false;
      } else {
        if (!ketStr.includes(sLower) && !hasilStr.includes(sLower)) return false;
      }
    }

    return true;
  });

  const elShowing = document.getElementById('dbShowingCount');
  if (elShowing) elShowing.textContent = filtered.length;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11" style="text-align: center; padding: 36px 20px; color: #94a3b8;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 28px; color: #cbd5e1; margin-bottom: 8px; display: block;"></i>
          <span style="font-size: 14px; font-weight: 700;">Tidak ada data unit yang sesuai kriteria pencarian</span>
        </td>
      </tr>
    `;
    if (tfoot) tfoot.innerHTML = '';
    return;
  }

  let totalFilteredNominal = 0;
  let totalFilteredDeal = 0;

  tbody.innerHTML = filtered.map((item, idx) => {
    const rowNo = item.no || (idx + 1);
    const hargaVal = parseInt(item.harga) || 0;
    totalFilteredNominal += hargaVal;

    const isDeal = (item.hasil && item.hasil.toLowerCase() === 'deal') || (item.ket && item.ket.toLowerCase() === 'deal');
    if (isDeal) totalFilteredDeal++;

    // Color Swatch
    const warnaLower = (item.warna || '').toLowerCase();
    let swatchBg = '#94a3b8';
    let swatchBorder = 'transparent';
    if (warnaLower.includes('hitam')) {
      swatchBg = '#0f172a';
    } else if (warnaLower.includes('putih')) {
      swatchBg = '#ffffff';
      swatchBorder = '#cbd5e1';
    } else if (warnaLower.includes('silver') || warnaLower.includes('abu')) {
      swatchBg = '#94a3b8';
    }

    // SPV Tag Styling
    const spvUpper = (item.spv || '').toUpperCase();
    let spvBadgeStyle = 'background: #eff6ff; color: #0284c7; border: 1px solid #bae6fd;';
    if (spvUpper.includes('RYAN') || spvUpper.includes('FERYANTO')) {
      spvBadgeStyle = 'background: #faf5ff; color: #7c3aed; border: 1px solid #e9d5ff;';
    } else if (spvUpper.includes('RIVA') || spvUpper.includes('CAISARIVA')) {
      spvBadgeStyle = 'background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0;';
    }

    // Status Badge
    let statusBadge = '';
    if (isDeal) {
      statusBadge = `
        <span style="
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          font-weight: 900;
          font-size: 11.5px;
          padding: 5px 14px;
          border-radius: 20px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
          letter-spacing: 0.5px;
        ">
          <i class="fa-solid fa-circle-check"></i> DEAL
        </span>
      `;
    } else if (item.ket && item.ket.toLowerCase().includes('cek harga')) {
      statusBadge = `
        <span style="
          background: #fef3c7;
          color: #b45309;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #fde68a;
        ">
          <i class="fa-solid fa-tag"></i> Cek Harga
        </span>
      `;
    } else if (item.ket && item.ket.toLowerCase().includes('inspeksi')) {
      statusBadge = `
        <span style="
          background: #e0f2fe;
          color: #0369a1;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #bae6fd;
        ">
          <i class="fa-solid fa-clipboard-check"></i> Cek Inspeksi
        </span>
      `;
    } else {
      statusBadge = `
        <span style="
          background: #f3e8ff;
          color: #7e22ce;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 10px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          border: 1px solid #e9d5ff;
        ">
          <i class="fa-regular fa-calendar-check"></i> ${item.ket || 'Proses'}
        </span>
      `;
    }

    const rowBg = isDeal ? 'background: rgba(16, 185, 129, 0.05);' : '';

    return `
      <tr style="${rowBg}">
        <td style="text-align: center; font-weight: 800; color: #64748b;">
          ${rowNo}
        </td>
        <td style="font-weight: 800; color: #0f172a;">
          <div style="display:flex; align-items:center; gap:8px;">
            <div style="
              width: 28px;
              height: 28px;
              border-radius: 50%;
              background: linear-gradient(135deg, #0284c7, #0369a1);
              color: #ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 11px;
              font-weight: 900;
              flex-shrink: 0;
            ">
              ${(item.sales || 'S').charAt(0).toUpperCase()}
            </div>
            <span>${item.sales || '-'}</span>
          </div>
        </td>
        <td>
          <span style="
            font-size: 11px;
            font-weight: 800;
            padding: 3px 9px;
            border-radius: 8px;
            display: inline-block;
            ${spvBadgeStyle}
          ">
            ${item.spv || '-'}
          </span>
        </td>
        <td style="font-weight: 800; color: #1e293b;">
          ${item.customer || '-'}
        </td>
        <td style="font-weight: 700; color: #0f172a;">
          <div style="font-size: 13px; font-weight: 800; color: #0f172a;">
            ${item.type || item.merk || '-'}
          </div>
          <div style="font-size: 11px; color: #64748b; font-weight: 600;">
            ${item.merk && item.merk !== '-' ? item.merk : ''}
          </div>
        </td>
        <td style="text-align: center; font-weight: 800; color: #475569;">
          ${item.tahun || '-'}
        </td>
        <td style="text-align: center;">
          <div style="display:inline-flex; align-items:center; gap:6px;">
            <span style="
              display: inline-block;
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: ${swatchBg};
              border: 1.5px solid ${swatchBorder};
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            "></span>
            <span style="font-size: 12px; font-weight: 700; color: #475569;">${item.warna || '-'}</span>
          </div>
        </td>
        <td style="text-align: right; font-weight: 900; color: #0f172a; font-family: monospace, sans-serif; font-size: 13px;">
          ${hargaVal > 0 ? 'Rp ' + hargaVal.toLocaleString('id-ID') : '-'}
        </td>
        <td style="text-align: center; font-weight: 700; color: #64748b; font-size: 12px;">
          ${item.km || '-'}
        </td>
        <td style="text-align: center; font-weight: 700; color: #64748b; font-size: 12px;">
          ${item.pajak || '-'}
        </td>
        <td style="text-align: center;">
          ${statusBadge}
        </td>
      </tr>
    `;
  }).join('');

  if (tfoot) {
    tfoot.innerHTML = `
      <tr style="background: #f8fafc; font-weight: 900; border-top: 2px solid #e2e8f0;">
        <td colspan="4" style="padding: 14px 16px; color: #0f172a; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px;">
          TOTAL TERFILTER: ${filtered.length} UNIT (${totalFilteredDeal} CLOSING DEAL)
        </td>
        <td colspan="3"></td>
        <td style="text-align: right; padding: 14px 16px; color: #0284c7; font-size: 13.5px; font-family: monospace, sans-serif;">
          Rp ${totalFilteredNominal.toLocaleString('id-ID')}
        </td>
        <td colspan="3"></td>
      </tr>
    `;
  }
}
