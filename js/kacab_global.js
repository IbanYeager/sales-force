// kacab_global.js — Fungsi bersama seluruh halaman Kacab:
// guard login, render user, drawer mobile, dan pengambilan data hierarki cabang.

function logoutUser() {
  localStorage.clear();
  window.location.href = '../pages/login_kacab.html';
}

function guardKacab() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const peran = localStorage.getItem('peranSales');
  if (!loggedIn) {
    window.location.href = '../pages/login_kacab.html';
    return;
  }
  if (peran === 'Supervisor') {
    window.location.href = '../pages_spv/index_spv.html';
    return;
  }
  if (peran !== 'Kepala Cabang') {
    window.location.href = '../index.html';
    return;
  }
}

// Jalankan guard secara instan saat script dimuat
guardKacab();

function renderKacabUser() {
  const nama = localStorage.getItem('namaSales') || 'Kepala Cabang';
  const peran = localStorage.getItem('peranSales') || 'Kepala Cabang';
  const namaEl = document.getElementById('kcbNama');
  const roleEl = document.getElementById('kcbRole');
  if (namaEl) namaEl.textContent = nama;
  if (roleEl) roleEl.textContent = peran;

  const avatar = localStorage.getItem('fotoSales');
  const avatarEl = document.getElementById('kcbAvatar');
  if (avatarEl) {
    avatarEl.src = (avatar && avatar.trim() !== '')
      ? avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=1e1014&color=d8a437`;
  }
}

document.addEventListener('DOMContentLoaded', renderKacabUser);

// ── Data hierarki cabang: SPV → Sales (dengan target & realisasi) ──
// Sumber: api_spv_list.php (daftar SPV), api_wiraniaga.php (semua sales),
// api_target_all.php (target & realisasi per sales).
async function fetchBranchHierarchy() {
  const [spvRes, wirRes, tgtRes] = await Promise.all([
    fetch('../api/api_spv_list.php'),
    fetch('../api/api_wiraniaga.php'),
    fetch('../api/api_target_all.php')
  ]);
  const spvJson = await spvRes.json();
  const wirJson = await wirRes.json();
  const tgtJson = await tgtRes.json();

  const spvNames = (spvJson.ok && Array.isArray(spvJson.data)) ? spvJson.data : [];
  const spvDetails = (spvJson.ok && Array.isArray(spvJson.details)) ? spvJson.details : [];
  const salesList = (wirJson.status === 'success' && Array.isArray(wirJson.data)) ? wirJson.data : [];
  const targetList = (tgtJson.status === 'success' && Array.isArray(tgtJson.data)) ? tgtJson.data : [];

  // Map SPV details (is_online, last_active, etc.)
  const spvDetailMap = {};
  spvDetails.forEach(d => {
    spvDetailMap[d.nama_lengkap] = d;
  });

  // Index target per sales_account_id
  const targetById = {};
  targetList.forEach(t => { targetById[String(t.sales_account_id)] = t; });

  // Kelompokkan sales di bawah SPV masing-masing
  const groups = {};
  spvNames.forEach(nm => { groups[nm] = []; });

  let totalSalesOnline = 0;
  let totalSalesOffline = 0;

  salesList.forEach(s => {
    const spv = (s.nama_spv || '').trim() || 'Tanpa SPV';
    if (!groups[spv]) groups[spv] = [];
    const t = targetById[String(s.id)] || {};
    const isOn = s.is_online === true || s.is_online === 1;
    if (isOn) totalSalesOnline++;
    else totalSalesOffline++;

    groups[spv].push({
      id: Number(s.id),
      nama: s.nama_lengkap,
      username: s.username,
      tingkatan: s.tingkatan || 'Magang',
      foto: s.foto || '',
      status: s.status || 'Aktif',
      is_online: isOn,
      status_online: isOn ? 'Online' : 'Offline',
      last_active_formatted: s.last_active_formatted || 'Belum pernah aktif',
      nama_spv: spv,
      target_spk: (t.target_spk_bulan !== undefined) ? Number(t.target_spk_bulan) : Number(t.target_spk || 0),
      real_spk: (t.realisasi_spk_bulan !== undefined) ? Number(t.realisasi_spk_bulan) : Number(t.realisasi_spk || 0),
      target_do: (t.target_do_bulan !== undefined) ? Number(t.target_do_bulan) : Number(t.target_do || t.target_do_eval || 0),
      real_do: (t.realisasi_do_bulan !== undefined) ? Number(t.realisasi_do_bulan) : Number(t.realisasi_do || t.realisasi_do_eval || 0),
      evaluasi_do_label: t.evaluasi_do_label || ''
    });
  });

  let totalSpvOnline = 0;
  let totalSpvOffline = 0;

  // Susun array group + agregat per SPV
  const hierarchy = Object.keys(groups).map(nm => {
    const team = groups[nm];
    const spvInfo = spvDetailMap[nm] || {};
    const isSpvOn = spvInfo.is_online === true || spvInfo.is_online === 1;
    if (isSpvOn) totalSpvOnline++;
    else totalSpvOffline++;

    const agg = team.reduce((a, s) => {
      a.target_spk += s.target_spk;
      a.real_spk += s.real_spk;
      a.target_do += s.target_do;
      a.real_do += s.real_do;
      if (s.is_online) a.online_sales++;
      if (s.status === 'Tidak Aktif') a.inactive++; else a.active++;
      return a;
    }, { target_spk: 0, real_spk: 0, target_do: 0, real_do: 0, active: 0, inactive: 0, online_sales: 0 });

    return {
      spv: nm,
      is_online: isSpvOn,
      status_online: isSpvOn ? 'Online' : 'Offline',
      last_active_formatted: spvInfo.last_active_formatted || 'Belum pernah aktif',
      team,
      total_sales: team.length,
      ...agg,
      pct_spk: agg.target_spk > 0 ? Math.round((agg.real_spk / agg.target_spk) * 100) : 0,
      pct_do: agg.target_do > 0 ? Math.round((agg.real_do / agg.target_do) * 100) : 0
    };
  });

  // Urutkan: pencapaian DO tertinggi dulu, lalu jumlah tim
  hierarchy.sort((a, b) => (b.pct_do - a.pct_do) || (b.total_sales - a.total_sales));

  return { 
    hierarchy, 
    periode: tgtJson.periode || '', 
    evaluasi_do_label: tgtJson.evaluasi_do_label || '',
    spv_total: spvNames.length,
    spv_online: totalSpvOnline,
    spv_offline: totalSpvOffline,
    sales_total: salesList.length,
    sales_online: totalSalesOnline,
    sales_offline: totalSalesOffline
  };
}

function pctClass(pct) {
  if (pct >= 80) return 'ach-high';
  if (pct >= 50) return 'ach-mid';
  return 'ach-low';
}

function salesAvatarUrl(s) {
  return (s.foto && s.foto.trim() !== '')
    ? s.foto
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(s.nama)}&background=f2f4f8&color=64748d`;
}

function spvInitials(nm) {
  return nm.replace(/^(pak|bu|ibu|bapak)\s+/i, '')
    .split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('');
}

function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, c => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// ── Mobile Header + Drawer Navigation ──────────────────
if (typeof window.kcbDrawerInit === 'undefined') {
  window.kcbDrawerInit = true;

  document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.kcb-sidebar');
    if (!sidebar) return;

    const pageTitle = document.getElementById('pageTitle');
    const titleText = pageTitle ? pageTitle.textContent.trim() : 'Kacab Panel';

    const header = document.createElement('header');
    header.className = 'mobile-header';
    header.innerHTML = `
      <button class="mh-burger" id="mhBurger" aria-label="Buka menu navigasi" aria-expanded="false">
        <i class="fa-solid fa-bars"></i>
        <span class="mh-dot" id="mhPendingDot"></span>
      </button>
      <span class="mh-title">${titleText}</span>
      <img class="mh-avatar" id="mhAvatar" src="" alt="Avatar">
    `;
    document.body.prepend(header);

    const backdrop = document.createElement('div');
    backdrop.className = 'drawer-backdrop';
    backdrop.id = 'drawerBackdrop';
    document.body.appendChild(backdrop);

    const nama = localStorage.getItem('namaSales') || 'Kacab';
    const foto = localStorage.getItem('fotoSales');
    const mhAvatar = document.getElementById('mhAvatar');
    mhAvatar.src = (foto && foto.trim() !== '')
      ? foto
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=1e1014&color=d8a437`;

    const burger = document.getElementById('mhBurger');

    function openDrawer() {
      document.body.classList.add('drawer-open');
      burger.setAttribute('aria-expanded', 'true');
      burger.querySelector('i').className = 'fa-solid fa-xmark';
      requestAnimationFrame(() => backdrop.classList.add('show'));
    }

    function closeDrawer() {
      document.body.classList.remove('drawer-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.querySelector('i').className = 'fa-solid fa-bars';
      backdrop.classList.remove('show');
    }

    window.closeKcbDrawer = closeDrawer;

    burger.addEventListener('click', () => {
      if (document.body.classList.contains('drawer-open')) closeDrawer();
      else openDrawer();
    });

    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    sidebar.querySelectorAll('.kcb-nav a').forEach(a => {
      a.addEventListener('click', closeDrawer);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeDrawer();
    });

    // ── Auto Highlight Active Menu Link (Supports Clean URLs) ────────────────────
    const curPath = window.location.pathname;
    let curFile = curPath.split('/').pop().split('?')[0].split('#')[0] || 'index_kacab';
    curFile = curFile.replace('.html', '');
    if (!curFile) curFile = 'index_kacab';

    const navLinks = sidebar.querySelectorAll('.kcb-nav a');
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href) {
        let targetFile = href.split('/').pop().split('?')[0].split('#')[0].replace('.html', '');
        if (curFile === targetFile) {
          link.classList.add('active');
        }
      }
    });
  });
}
