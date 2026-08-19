// kacab_monitoring.js — Tabel hierarki SPV → Sales dengan drill-down detail per sales.

let hierData = [];
let allExpanded = false;

async function loadHierarchy() {
  const container = document.getElementById('hierContainer');
  try {
    const { hierarchy, periode, evaluasi_do_label } = await fetchBranchHierarchy();
    hierData = hierarchy;

    const periodeEl = document.getElementById('monPeriode');
    if (periodeEl && periode) {
      periodeEl.textContent = `Periode ${periode}${evaluasi_do_label ? ' | DO: ' + evaluasi_do_label : ''} — klik baris SPV untuk membuka daftar sales`;
    }

    applyHierFilters();

    // Auto-buka group jika datang dari dashboard dengan ?spv=Nama
    const params = new URLSearchParams(location.search);
    const target = params.get('spv');
    if (target) {
      const el = document.querySelector(`.hier-group[data-spv="${CSS.escape(target)}"]`);
      if (el) {
        el.classList.add('open');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  } catch (e) {
    console.error('Gagal memuat hierarki:', e);
    container.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal memuat data hierarki cabang.</p>';
  }
}

function applyHierFilters() {
  const container = document.getElementById('hierContainer');
  const countEl = document.getElementById('hierCount');
  const q = (document.getElementById('searchHier')?.value || '').toLowerCase().trim();
  const statusFilter = document.getElementById('filterStatusSales')?.value || '';

  let totalSpv = 0;
  let totalSales = 0;

  const groupsHtml = hierData.map(g => {
    const spvMatch = g.spv.toLowerCase().includes(q);

    let team = g.team;
    if (statusFilter) {
      team = team.filter(s => statusFilter === 'Aktif' ? s.status !== 'Tidak Aktif' : s.status === 'Tidak Aktif');
    }
    // Jika query cocok dengan nama SPV, tampilkan seluruh timnya;
    // jika tidak, saring sales berdasar query.
    if (q && !spvMatch) {
      team = team.filter(s => s.nama.toLowerCase().includes(q));
      if (team.length === 0) return '';
    }
    if (statusFilter && team.length === 0 && !spvMatch) return '';

    totalSpv++;
    totalSales += team.length;

    // Group otomatis terbuka saat sedang mencari
    const openClass = (q || allExpanded) ? 'open' : '';

    const salesRows = team.map(s => {
      const pSpk = s.target_spk > 0 ? Math.round((s.real_spk / s.target_spk) * 100) : 0;
      const pDo = s.target_do > 0 ? Math.round((s.real_do / s.target_do) * 100) : 0;
      const isActive = s.status !== 'Tidak Aktif';
      return `
        <div class="hier-sale" onclick="openSalesDrill(${s.id})" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')openSalesDrill(${s.id})"
          aria-label="Lihat detail ${escapeHtml(s.nama)}">
          <div class="sale-ident">
            <img class="sale-avatar" src="${salesAvatarUrl(s)}" alt="" loading="lazy">
            <div class="info">
              <div class="nm"><span class="status-dot ${isActive ? 'on' : 'off'}"></span>${escapeHtml(s.nama)}</div>
              <div class="sd">${escapeHtml(s.tingkatan)}</div>
            </div>
          </div>
          <div class="mini-meter">
            <div class="mm-head"><span>SPK</span><b>${s.real_spk}/${s.target_spk}</b></div>
            <div class="track"><div class="fill blue" style="width:${Math.min(pSpk, 100)}%"></div></div>
          </div>
          <div class="mini-meter">
            <div class="mm-head"><span>DO</span><b>${s.real_do}/${s.target_do}</b></div>
            <div class="track"><div class="fill red" style="width:${Math.min(pDo, 100)}%"></div></div>
          </div>
          <span class="ach-chip ${pctClass(pDo)}">${pDo}%</span>
          <button class="sale-detail-btn" aria-hidden="true" tabindex="-1"><i
              class="fa-solid fa-magnifying-glass-plus"></i></button>
        </div>`;
    }).join('');

    return `
      <div class="hier-group ${openClass}" data-spv="${escapeHtml(g.spv)}">
        <div class="hier-spv" onclick="toggleGroup(this)" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')toggleGroup(this)" aria-label="Buka tim ${escapeHtml(g.spv)}">
          <div class="spv-ident">
            <div class="spv-avatar">${spvInitials(g.spv)}</div>
            <div class="info">
              <div class="nm">${escapeHtml(g.spv)}</div>
              <div class="sd">${g.total_sales} sales &middot; ${g.active} aktif${g.inactive ? ' &middot; ' + g.inactive + ' inaktif' : ''}</div>
            </div>
          </div>
          <div class="mini-meter">
            <div class="mm-head"><span>SPK Tim</span><b>${g.real_spk}/${g.target_spk}</b></div>
            <div class="track"><div class="fill blue" style="width:${Math.min(g.pct_spk, 100)}%"></div></div>
          </div>
          <div class="mini-meter">
            <div class="mm-head"><span>DO Tim</span><b>${g.real_do}/${g.target_do}</b></div>
            <div class="track"><div class="fill red" style="width:${Math.min(g.pct_do, 100)}%"></div></div>
          </div>
          <span class="ach-chip ${pctClass(g.pct_do)}"><i class="fa-solid fa-truck-fast"></i> ${g.pct_do}%</span>
          <div class="hier-chevron"><i class="fa-solid fa-chevron-down"></i></div>
        </div>
        <div class="hier-sales">
          ${salesRows || '<div class="drill-empty" style="margin:12px 18px;">Tidak ada sales yang cocok dengan filter.</div>'}
        </div>
      </div>`;
  }).filter(Boolean).join('');

  if (countEl) {
    countEl.textContent = hierData.length ? `${totalSpv} SPV · ${totalSales} sales ditampilkan` : '';
  }

  if (!groupsHtml) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div class="es-title">Tidak ada hasil yang cocok</div>
        <div class="es-text">Coba ubah kata kunci atau filter status.</div>
      </div>`;
    return;
  }

  container.innerHTML = groupsHtml;
}

function toggleGroup(headerEl) {
  headerEl.closest('.hier-group').classList.toggle('open');
}

function toggleAllGroups() {
  allExpanded = !allExpanded;
  document.querySelectorAll('.hier-group').forEach(g => g.classList.toggle('open', allExpanded));
  const btn = document.getElementById('btnToggleAll');
  btn.innerHTML = allExpanded
    ? '<i class="fa-solid fa-angles-up"></i> Tutup Semua'
    : '<i class="fa-solid fa-angles-down"></i> Buka Semua';
}

// ── Drill-down detail sales ────────────────────────────
function findSales(id) {
  for (const g of hierData) {
    const s = g.team.find(x => x.id === id);
    if (s) return s;
  }
  return null;
}

async function openSalesDrill(id) {
  const s = findSales(id);
  if (!s) return;

  document.getElementById('drillNama').textContent = s.nama;
  document.getElementById('drillSub').textContent = `${s.tingkatan} · @${s.username || '-'}`;
  document.getElementById('drillSpvLabel').innerHTML =
    `<i class="fa-solid fa-user-tie"></i> SPV: ${escapeHtml(s.nama_spv)}`;

  const badge = document.getElementById('drillStatusBadge');
  const isActive = s.status !== 'Tidak Aktif';
  badge.textContent = isActive ? 'Aktif' : 'Tidak Aktif';
  badge.className = `badge ${isActive ? 'badge-approved' : 'badge-rejected'}`;

  const pSpk = s.target_spk > 0 ? Math.round((s.real_spk / s.target_spk) * 100) : 0;
  const pDo = s.target_do > 0 ? Math.round((s.real_do / s.target_do) * 100) : 0;
  document.getElementById('drillSpkVal').innerHTML = `${s.real_spk} <small>/ ${s.target_spk} unit · ${pSpk}%</small>`;
  document.getElementById('drillDoVal').innerHTML = `${s.real_do} <small>/ ${s.target_do} unit · ${pDo}%</small>`;
  if (s.evaluasi_do_label) document.getElementById('drillDoLabel').textContent = `DO ${s.evaluasi_do_label}`;

  document.getElementById('drillSpkBar').style.width = '0';
  document.getElementById('drillDoBar').style.width = '0';
  setTimeout(() => {
    document.getElementById('drillSpkBar').style.width = Math.min(pSpk, 100) + '%';
    document.getElementById('drillDoBar').style.width = Math.min(pDo, 100) + '%';
  }, 120);

  document.getElementById('drillSpkList').innerHTML =
    '<p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat...</p>';
  document.getElementById('drillActList').innerHTML =
    '<p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat...</p>';
  document.getElementById('salesDrillModal').style.display = 'flex';

  loadDrillSpk(s);
  loadDrillActivities(s);
}

async function loadDrillSpk(s) {
  const list = document.getElementById('drillSpkList');
  try {
    const res = await fetch(`../api/api_spk.php?sales_account_id=${s.id}`);
    const json = await res.json();
    if (json.status !== 'success' || !Array.isArray(json.data) || json.data.length === 0) {
      list.innerHTML = '<div class="drill-empty">Belum ada SPK dari sales ini.</div>';
      return;
    }
    list.innerHTML = json.data.slice(0, 5).map(spk => {
      const badge = spk.status === 'DO' ? 'badge-approved'
        : spk.status === 'Rejected' ? 'badge-rejected'
          : spk.status === 'Menunggu' ? 'badge-pending' : 'badge-waiting';
      return `
        <div class="drill-mini-item">
          <div class="ic"><i class="fa-solid fa-car-side"></i></div>
          <div class="bd">
            <div class="t">${escapeHtml(spk.model)} — ${escapeHtml(spk.nama_customer)}</div>
            <div class="m">${escapeHtml(spk.tipe_pembelian || '-')} &middot; Rp ${Number(spk.nominal_jt || 0)} jt</div>
          </div>
          <span class="badge ${badge}">${escapeHtml(spk.status)}</span>
        </div>`;
    }).join('');
  } catch (e) {
    console.error(e);
    list.innerHTML = '<div class="drill-empty">Gagal memuat data SPK.</div>';
  }
}

async function loadDrillActivities(s) {
  const list = document.getElementById('drillActList');
  try {
    const res = await fetch('../api/api_aktivitas.php?limit=100');
    const json = await res.json();
    const acts = (json.status === 'success' && Array.isArray(json.data))
      ? json.data.filter(a => (a.nama_sales || '').trim() === s.nama.trim())
      : [];

    if (acts.length === 0) {
      list.innerHTML = '<div class="drill-empty">Belum ada aktivitas terekam (3 hari terakhir).</div>';
      return;
    }
    list.innerHTML = acts.slice(0, 5).map(a => {
      const date = new Date(String(a.created_at).replace(/-/g, '/'));
      const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `
        <div class="drill-mini-item">
          <div class="ic"><i class="fa-solid ${activityIcon(a.tipe_aktivitas)}"></i></div>
          <div class="bd">
            <div class="t">${escapeHtml(a.tipe_aktivitas)}</div>
            <div class="m">${escapeHtml(a.keterangan || '')} &middot; ${timeStr}</div>
          </div>
          <span class="badge ${a.status === 'Selesai' ? 'badge-approved' : a.status === 'Rencana' ? 'badge-pending' : 'badge-waiting'}">${escapeHtml(a.status)}</span>
        </div>`;
    }).join('');
  } catch (e) {
    console.error(e);
    list.innerHTML = '<div class="drill-empty">Gagal memuat aktivitas.</div>';
  }
}

function activityIcon(tipe) {
  if (tipe === 'Live Tiktok') return 'fa-video';
  if (tipe === 'Digital Marketing') return 'fa-share-nodes';
  if (tipe === 'Follow Up Database') return 'fa-phone';
  if (tipe === 'Pameran Display') return 'fa-store';
  return 'fa-list-check';
}

function closeSalesDrill() {
  document.getElementById('salesDrillModal').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeSalesDrill();
});

document.getElementById('salesDrillModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'salesDrillModal') closeSalesDrill();
});

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  loadHierarchy();
});
