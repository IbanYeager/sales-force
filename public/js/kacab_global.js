// kacab_global.js — Fungsi bersama seluruh halaman Kacab:
// guard login, render user, drawer mobile, dan pengambilan data hierarki cabang.

function logoutUser() {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.error('Logout error', e);
  }
  window.location.replace('/pages/login_kacab');
}
window.logoutUser = logoutUser;

function guardKacab() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const peran = localStorage.getItem('peranSales');
  if (!loggedIn) {
    window.location.replace('/pages/login_kacab');
    return;
  }
  if (peran === 'Supervisor' || peran === 'SPV') {
    window.location.replace('/pages_spv/index_spv');
    return;
  }
  if (peran !== 'Kepala Cabang' && peran !== 'Kacab') {
    window.location.replace('/index');
    return;
  }
}

// Jalankan guard secara instan saat script dimuat
guardKacab();

function renderKacabUser() {
  let nama = localStorage.getItem('namaSales') || 'Dendi Holius';
  const peran = localStorage.getItem('peranSales') || 'Kepala Cabang';
  let foto = localStorage.getItem('fotoSales');
  if (foto && foto.startsWith('http://') && !foto.includes('localhost')) {
    foto = 'https://' + foto.substring(7);
    localStorage.setItem('fotoSales', foto);
  }

  // Update all possible header/topbar name elements
  const namaEls = document.querySelectorAll('#kcbNama, #kacabNama, .kcb-user .name, .kcb-topbar .name, .meta .name');
  namaEls.forEach(el => {
    if (el) el.textContent = nama;
  });

  const roleEls = document.querySelectorAll('#kcbRole, #kacabRole, .kcb-user .role, .kcb-topbar .role, .meta .role');
  roleEls.forEach(el => {
    if (el) el.textContent = peran;
  });

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=1e1014&color=d8a437&bold=true`;

  const avatarEls = document.querySelectorAll('#kcbAvatar, #kacabAvatar, #mhAvatar, .kcb-user img, .kcb-topbar img, .avatar-status img');
  avatarEls.forEach(img => {
    if (img) {
      img.onerror = function() { this.onerror = null; this.src = defaultAvatar; };
      img.src = (foto && foto.trim() !== '') ? foto : defaultAvatar;
    }
  });

  const sidebarBrandRole = document.querySelector('.kcb-brand .role, .sidebar-brand .role');
  if (sidebarBrandRole) sidebarBrandRole.textContent = `Kepala Cabang - ${nama}`;
}

// Jalankan langsung dan saat DOM siap
renderKacabUser();
document.addEventListener('DOMContentLoaded', renderKacabUser);
window.addEventListener('pageshow', renderKacabUser);

// ── Data hierarki cabang: SPV → Sales (dengan target & realisasi) ──
// Sumber: api_spv_list.php (daftar SPV), api_wiraniaga.php (semua sales),
// api_target_all.php (target & realisasi per sales).
async function fetchBranchHierarchy(forceFresh = false) {
  const cacheKey = 'kacab_hierarchy_cache';
  const cacheTimeKey = 'kacab_hierarchy_cache_time';

  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(cacheKey);
      const cacheTime = parseInt(sessionStorage.getItem(cacheTimeKey) || '0');
      if (cached && (Date.now() - cacheTime < 25000)) { // 25s cache
        return JSON.parse(cached);
      }
    } catch(e) {}
  }

  const ts = forceFresh ? `?t=${Date.now()}` : '';
  const [spvRes, wirRes, tgtRes] = await Promise.all([
    fetch(`../api/api_spv_list.php${ts}`),
    fetch(`../api/api_wiraniaga.php${ts}`),
    fetch(`../api/api_target_all.php${ts}`)
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

  const result = { 
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

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(result));
    sessionStorage.setItem(cacheTimeKey, String(Date.now()));
  } catch(e) {}

  return result;
}

function pctClass(pct) {
  if (pct >= 80) return 'ach-high';
  if (pct >= 50) return 'ach-mid';
  return 'ach-low';
}

function salesAvatarUrl(s) {
  let f = (s && s.foto ? s.foto.trim() : '');
  if (f && f.startsWith('http://') && !f.includes('localhost')) {
    f = 'https://' + f.substring(7);
  }
  const nameStr = (s && s.nama ? s.nama : 'Sales');
  return (f !== '')
    ? f
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nameStr)}&background=f2f4f8&color=64748d`;
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
