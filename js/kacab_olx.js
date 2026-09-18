// js/kacab_olx.js - Papan Prestasi & Rekapitulasi Closing Deal Trade-In OLX Mobbi Cabang Kiaracondong
document.addEventListener('DOMContentLoaded', () => {
  initKacabOlx();
});

async function initKacabOlx() {
  loadKacabProfile();
  renderPodium();
  renderMatrix();
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
    }
  } catch (err) {
    console.error('Error fetching OLX data:', err);
  }
}

// ════════════════════════════════════════════════════════════════
// 1. RENDER HERO SHOWCASE / PODIUM (KIARACONDONG)
// ALVIN, FERYANTO, MUHAMMAD CAISARIVA, TOTAL CABANG
// ════════════════════════════════════════════════════════════════
function renderPodium(spvShowcase) {
  const grid = document.getElementById('olxPodiumGrid');
  if (!grid) return;

  const defaultList = [
    {
      key: 'alvin',
      display_name: 'ALVIN',
      role: 'Supervisor 1',
      deal_count: 16,
      photo: '../images/olx_top/spv_alvin.jpg',
      ringColor: '#38bdf8',
      rankBadge: '1',
      rankBg: 'linear-gradient(135deg, #f59e0b, #d97706)'
    },
    {
      key: 'feryanto',
      display_name: 'FERYANTO (RYAN)',
      role: 'Supervisor 2',
      deal_count: 15,
      photo: '../images/olx_top/spv_ryan.jpg',
      ringColor: '#c084fc',
      rankBadge: '2',
      rankBg: 'linear-gradient(135deg, #94a3b8, #64748b)'
    },
    {
      key: 'caisariva',
      display_name: 'MUHAMMAD CAISARIVA (RIVA)',
      role: 'Supervisor 3',
      deal_count: 2,
      photo: '../images/olx_top/spv_riva.jpg',
      ringColor: '#34d399',
      rankBadge: '3',
      rankBg: 'linear-gradient(135deg, #d97706, #b45309)'
    }
  ];

  let list = defaultList;
  if (spvShowcase && spvShowcase.length >= 3) {
    list = defaultList.map((def, idx) => {
      const s = spvShowcase[idx] || {};
      return {
        ...def,
        deal_count: s.deal_count !== undefined ? s.deal_count : def.deal_count
      };
    });
  }

  const totalDeals = list.reduce((acc, cur) => acc + (parseInt(cur.deal_count) || 0), 0) || 33;

  let html = list.map((spv) => {
    return `
      <div class="olx-podium-card">
        <span class="olx-podium-rank-badge" style="background: ${spv.rankBg};">
          ${spv.rankBadge}
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
        <i class="fa-solid fa-certificate"></i> Terverifikasi Excel 2026
      </div>
    </div>
  `;

  grid.innerHTML = html;
}

// ════════════════════════════════════════════════════════════════
// 2. RENDER PAPAN MATRIX REKAP BULANAN (ALVIN | FERYANTO | CAISARIVA)
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
    const isPastOrCurrent = (r.total > 0 || ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September'].includes(r.month));

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
    const totFeryanto = totals.feryanto ?? totals.ryan ?? 15;
    const totCaisariva = totals.caisariva ?? totals.riva ?? 2;
    const dealerTotal = totals.dealer_total ?? (totAlvin + totFeryanto + totCaisariva) ?? 33;

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
