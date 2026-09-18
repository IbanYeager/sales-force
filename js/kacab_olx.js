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
    { key: 'alvin', display_name: 'ALVIN', role: 'Supervisor 1', deal_count: 16, photo: '../images/olx_top/spv_alvin.jpg', gradient: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)' },
    { key: 'feryanto', display_name: 'FERYANTO', role: 'Supervisor 2', deal_count: 15, photo: '../images/olx_top/spv_ryan.jpg', gradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)' },
    { key: 'caisariva', display_name: 'MUHAMMAD CAISARIVA', role: 'Supervisor 3', deal_count: 2, photo: '../images/olx_top/spv_riva.jpg', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }
  ];

  let list = defaultList;
  if (spvShowcase && spvShowcase.length >= 3) {
    list = spvShowcase.map((s, idx) => {
      const def = defaultList[idx] || {};
      return {
        key: s.key || def.key,
        display_name: s.display_name || def.display_name,
        role: s.role || def.role,
        deal_count: s.deal_count !== undefined ? s.deal_count : def.deal_count,
        photo: s.photo || def.photo,
        gradient: s.gradient || def.gradient
      };
    });
  }

  const rankBadges = ['1', '2', '3'];
  const totalDeals = list.reduce((acc, cur) => acc + (parseInt(cur.deal_count) || 0), 0) || 33;

  let html = list.map((spv, index) => {
    return `
      <div class="olx-podium-card" style="background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 16px; padding: 18px 14px; text-align: center; backdrop-filter: blur(8px); position: relative; transition: transform 0.2s, box-shadow 0.2s;">
        <span class="olx-podium-rank-badge" style="background: #eab308; color: #713f12; font-weight: 900; border-radius: 50%; width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; margin-bottom: 8px;">
          ${rankBadges[index]}
        </span>
        <div class="olx-podium-avatar-wrap" style="position: relative; width: 68px; height: 68px; margin: 0 auto 10px;">
          <img src="${spv.photo}" alt="${spv.display_name}" class="olx-podium-avatar" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover; object-position: top center; border: 2.5px solid #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.3);" onerror="this.src='../images/default-avatar.png'">
        </div>
        <div class="olx-podium-deal-box">
          <span class="olx-deal-label" style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #fecdd3;">PENCAPAIAN DEAL</span>
          <div class="olx-deal-sales-name" style="font-size: 14.5px; font-weight: 900; margin: 4px 0 2px; color: #ffffff;">${spv.display_name}</div>
          <span class="olx-deal-spv-tag" style="font-size: 11px; color: #e2e8f0; display: block; margin-bottom: 10px;">${spv.role}</span>
          <div>
            <span class="olx-deal-count-badge" style="background: #10b981; color: #ffffff; font-weight: 800; font-size: 13.5px; padding: 5px 14px; border-radius: 20px; display: inline-block; box-shadow: 0 3px 10px rgba(16, 185, 129, 0.35);">
              <i class="fa-solid fa-circle-check"></i> ${spv.deal_count} Deal
            </span>
          </div>
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

    const valAlvin = r.alvin !== undefined ? r.alvin : 0;
    const valFeryanto = (r.feryanto !== undefined ? r.feryanto : r.ryan) ?? 0;
    const valCaisariva = (r.caisariva !== undefined ? r.caisariva : r.riva) ?? 0;
    const valTotal = (r.total !== undefined ? r.total : (valAlvin + valFeryanto + valCaisariva)) ?? 0;

    const renderVal = (val) => {
      if (!isPastOrCurrent && (val === 0 || val === '-' || val === undefined)) {
        return `<span class="olx-matrix-num-empty" style="color:#94a3b8; font-weight:700;">-</span>`;
      }
      if (val > 0) {
        return `<span class="olx-matrix-num-deal" style="background:#ecfdf5; color:#059669; font-weight:800; padding:4px 12px; border-radius:8px; display:inline-block; border:1px solid #a7f3d0; box-shadow:0 1px 3px rgba(5,150,105,0.15);">${val}</span>`;
      }
      return `<span class="olx-matrix-num-zero" style="color:#94a3b8; font-weight:600;">0</span>`;
    };

    const renderTotalVal = (val) => {
      if (!isPastOrCurrent && (val === 0 || val === '-' || val === undefined)) {
        return `<span class="olx-matrix-num-empty" style="color:#94a3b8; font-weight:700;">-</span>`;
      }
      return `<span style="font-weight:900; font-size:15px; color:#0f172a;">${val}</span>`;
    };

    return `
      <tr>
        <td style="font-weight:700; color:#1e293b; padding-left:20px;">
          <i class="fa-solid ${icon}" style="color:#0284c7; width:20px; margin-right:6px;"></i> ${r.month}
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
      <tr style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); color: #ffffff;">
        <td style="padding: 16px 20px; font-weight: 900; font-size: 13.5px; text-transform: uppercase; letter-spacing: 0.5px;">
          <i class="fa-solid fa-trophy" style="color: #facc15; margin-right: 6px;"></i> TOTAL DEAL (2026)
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: #2563eb; color: #ffffff; font-weight: 900; font-size: 15px; padding: 6px 18px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
            ${totAlvin} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: #7c3aed; color: #ffffff; font-weight: 900; font-size: 15px; padding: 6px 18px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 12px rgba(124, 58, 237, 0.35);">
            ${totFeryanto} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: #059669; color: #ffffff; font-weight: 900; font-size: 15px; padding: 6px 18px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);">
            ${totCaisariva} Deal
          </span>
        </td>
        <td style="text-align: center; padding: 16px 14px;">
          <span style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: #ffffff; font-weight: 900; font-size: 16px; padding: 6px 18px; border-radius: 20px; display: inline-block; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);">
            ${dealerTotal} Deal
          </span>
        </td>
      </tr>
    `;
  }
}
