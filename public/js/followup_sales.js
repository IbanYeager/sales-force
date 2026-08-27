let followupState = {
  activeTab: 'followup', // 'followup' or 'kanban'
  subTab: 'my_tasks',    // 'my_tasks' or 'orphan_pool'
  viewMode: 'cards',     // 'cards' or 'table'
  customers: [],
  orphanLeads: [],
  templates: [],
  activeCategory: 'all',
  activeStatus: 'all',
  searchQuery: '',
  selectedCustomer: null,
  salesInfo: null,
  renderLimit: 24,
  filteredList: [],
  saveTimeouts: {}
};

// Initialize module on page load
document.addEventListener('DOMContentLoaded', () => {
  initFollowupTabs();
  loadSalesProfile();
  loadTemplates();
  loadFollowupCustomers();
});

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function loadSalesProfile() {
  try {
    const userStr = localStorage.getItem('sales_user') || localStorage.getItem('user_data');
    if (userStr) {
      followupState.salesInfo = JSON.parse(userStr);
    }
  } catch (e) {
    console.error('Error loading sales profile', e);
  }

  // Ensure salesInfo is always populated with active sales consultant identity
  if (!followupState.salesInfo || !followupState.salesInfo.id) {
    const idSales = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 1;
    const namaSales = localStorage.getItem('namaSales') || 'Egy';
    const peranSales = localStorage.getItem('peranSales') || 'Sales Consultant';
    followupState.salesInfo = {
      id: parseInt(idSales, 10) || 1,
      name: namaSales,
      role: peranSales
    };
  }
}

function initFollowupTabs() {
  const container = document.querySelector('.mobile-app .container');
  if (!container) return;

  // Insert Tab Switcher at the very top of container if not exists
  if (!document.getElementById('followupNavTabs')) {
    const tabsHtml = `
      <div class="followup-nav-tabs" id="followupNavTabs">
        <button class="followup-tab-btn active" id="tabBtnFollowup" onclick="switchCustomerTab('followup')">
          <i class="fa-solid fa-bullhorn"></i> Database Follow-Up (Attack List)
          <span id="followupBadgeCount" style="display:none; font-size:10px; font-weight:800; padding:2px 7px; border-radius:9999px; background:#d7123a; color:#fff; box-shadow:0 2px 6px rgba(215,18,58,0.4);">0</span>
        </button>
        <button class="followup-tab-btn" id="tabBtnKanban" onclick="switchCustomerTab('kanban')">
          <i class="fa-solid fa-table-columns"></i> Pipeline Prospek
        </button>
      </div>

      <!-- CONTAINER UNTUK TAB DATABASE FOLLOW-UP -->
      <div id="followupSectionView" style="display:block;">
        
        <!-- 1. HERO SUMMARY BANNER -->
        <div class="followup-hero-banner">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.12); padding:3px 10px; border-radius:9999px; font-size:10.5px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:6px;">
                <i class="fa-solid fa-fire" style="color:#f43f5e;"></i> Repurchase Attack List
              </div>
              <h3 style="font-size:18px; font-weight:900; margin:0; line-height:1.2; letter-spacing:-0.3px;">Database Follow-Up Pelanggan</h3>
              <p style="font-size:11.5px; color:rgba(255,255,255,0.8); margin:3px 0 0 0;">Tunas Toyota Kiara Condong • Target Upgrade &amp; Servis Berkala</p>
            </div>
            <button class="btn-fu btn-fu-crimson" style="padding:8px 14px; font-size:11.5px; border-radius:10px;" onclick="loadFollowupCustomers()">
              <i class="fa-solid fa-arrows-rotate"></i> Refresh Data
            </button>
          </div>

          <!-- Hero KPI Mini Chips (Interactive Click to Filter) -->
          <div class="hero-kpi-grid">
            <div class="hero-kpi-chip" style="cursor:pointer;" onclick="handleStatusFilter('all')" title="Klik untuk menampilkan semua database">
              <div class="num" id="heroTotalCount">0</div>
              <div class="lbl">📋 Semua Database</div>
            </div>
            <div class="hero-kpi-chip" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.3); cursor:pointer;" onclick="handleStatusFilter('belum_fu')" title="Klik untuk melihat database yang belum di-follow up">
              <div class="num" style="color:#fbbf24;" id="heroPendingCount">0</div>
              <div class="lbl">⚪ Belum Di-Follow Up</div>
            </div>
            <div class="hero-kpi-chip" style="background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3); cursor:pointer;" onclick="handleStatusFilter('sudah_fu')" title="Klik untuk melihat database yang sudah di-follow up">
              <div class="num" style="color:#6ee7b7;" id="heroFollowedCount">0</div>
              <div class="lbl">✅ Sudah Di-Follow Up</div>
            </div>
            <div class="hero-kpi-chip" style="background:rgba(59,130,246,0.15); border-color:rgba(59,130,246,0.3); cursor:pointer;" onclick="handleStatusFilter('Tertarik / Jadwal Servis')" title="Klik untuk melihat prospek tertarik">
              <div class="num" style="color:#93c5fd;" id="heroInterestedCount">0</div>
              <div class="lbl">🔵 Tertarik / Servis</div>
            </div>
          </div>
        </div>

        <!-- 1.5 SUB-NAVIGATION: DATABASE TUGAS SAYA vs POOL REBUTAN PROSPEK vs RADAR GPS -->
        <div class="sub-nav-fu-wrapper" id="fuSubNavWrapper">
          <button type="button" class="sub-nav-fu-btn active" id="subBtnMyTasks" onclick="switchFollowupSubTab('my_tasks')">
            <i class="fa-solid fa-bullseye" style="color:#2563eb;"></i>
            <span>🎯 Database Tugas Saya</span>
            <span id="badgeMyTasksCount" style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:9999px; background:#eff6ff; color:#1d4ed8;">0</span>
          </button>
          <button type="button" class="sub-nav-fu-btn pool-tab" id="subBtnOrphanPool" onclick="switchFollowupSubTab('orphan_pool')">
            <i class="fa-solid fa-fire" style="color:#ea580c;"></i>
            <span>🔥 Pool Rebutan Prospek</span>
            <span id="badgeOrphanPoolCount" class="badge-pulse-fire">⚡ Cek Rebutan</span>
          </button>
          <button type="button" class="sub-nav-fu-btn radar-tab" id="subBtnRadar" onclick="switchFollowupSubTab('radar')">
            <i class="fa-solid fa-location-crosshairs" style="color:#3b82f6;"></i>
            <span>📍 Radar GPS Terdekat</span>
            <span style="font-size:10px; font-weight:800; padding:2px 8px; border-radius:9999px; background:rgba(215,18,58,0.12); color:#dc2626; border:1px solid rgba(215,18,58,0.25);">Live GPS</span>
          </button>
        </div>

        <!-- 2. SEARCH, FILTER & VIEW TOGGLE BAR -->
        <div class="card" id="fuFilterCard" style="padding:16px; margin-bottom:16px; border-radius:var(--fu-radius-lg);">
          <!-- Top Row: Search & View Mode Switcher -->
          <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-bottom:12px;">
            <div class="fu-input-with-icon" style="flex:1; min-width:240px; margin-bottom:0;">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="fu-input" id="followupSearchInput" placeholder="Cari nama pelanggan, nomor WA, plat nomor, atau model mobil..." oninput="handleFollowupSearch(this.value)">
            </div>
            <div style="display:flex; gap:6px;">
              <button class="view-toggle-btn active" id="btnViewCards" onclick="switchViewMode('cards')">
                <i class="fa-solid fa-grip"></i> Kartu Prospek
              </button>
              <button class="view-toggle-btn" id="btnViewTable" onclick="switchViewMode('table')">
                <i class="fa-solid fa-table-list"></i> Tabel Database
              </button>
            </div>
          </div>

          <!-- Category Chips Horizontal Scroll -->
          <div style="margin-bottom:12px;">
            <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:#64748b; margin-bottom:6px; letter-spacing:0.5px;">
              <i class="fa-solid fa-filter" style="color:#d7123a;"></i> Kategori Repurchase &amp; Layanan:
            </div>
            <div class="category-chips-scroll" id="followupCategoryPills">
              <button class="category-pill-btn active" onclick="handleCategoryFilter('all', this)">
                <i class="fa-solid fa-grid-2"></i> Semua Kategori
              </button>
            </div>
          </div>

          <!-- Status Filter Tabs: Dedicated Sudah FU vs Belum FU with live count badges -->
          <div>
            <div style="font-size:11px; font-weight:800; text-transform:uppercase; color:#64748b; margin-bottom:6px; letter-spacing:0.5px;">
              <i class="fa-solid fa-list-check" style="color:#d7123a;"></i> Filter Progres Follow-Up:
            </div>
            <div style="display:flex; gap:8px; overflow-x:auto; padding-bottom:4px;" id="followupStatusTabs">
              <button type="button" class="status-fu-tab-btn active" id="btnStatusAll" onclick="handleStatusFilter('all', this)">
                <i class="fa-solid fa-layer-group"></i> Semua Database
                <span class="fu-filter-count-badge" id="countBadgeAll">0</span>
              </button>
              <button type="button" class="status-fu-tab-btn tab-belum" id="btnStatusBelum" onclick="handleStatusFilter('belum_fu', this)">
                <i class="fa-solid fa-hourglass-half"></i> ⚪ Belum Di-Follow Up
                <span class="fu-filter-count-badge badge-amber" id="countBadgeBelum">0</span>
              </button>
              <button type="button" class="status-fu-tab-btn tab-sudah" id="btnStatusSudah" onclick="handleStatusFilter('sudah_fu', this)">
                <i class="fa-solid fa-circle-check"></i> ✅ Sudah Di-Follow Up
                <span class="fu-filter-count-badge badge-green" id="countBadgeSudah">0</span>
              </button>
              <button type="button" class="status-fu-tab-btn" id="btnStatusWaiting" onclick="handleStatusFilter('Menunggu Respon', this)">
                🟡 Menunggu Respon
                <span class="fu-filter-count-badge badge-yellow" id="countBadgeWaiting">0</span>
              </button>
              <button type="button" class="status-fu-tab-btn" id="btnStatusInterested" onclick="handleStatusFilter('Tertarik / Jadwal Servis', this)">
                🔵 Tertarik / Servis
                <span class="fu-filter-count-badge badge-blue" id="countBadgeInterested">0</span>
              </button>
              <button type="button" class="status-fu-tab-btn" id="btnStatusDeal" onclick="handleStatusFilter('Deal / Selesai', this)">
                🟢 Deal / Selesai
                <span class="fu-filter-count-badge badge-emerald" id="countBadgeDeal">0</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 3. CUSTOMER DATA VIEW CONTAINER (CARDS OR TABLE) -->
        <div id="followupDataContainer">
          <!-- Cards Grid -->
          <div class="followup-cards-grid" id="followupCardsGrid">
            <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; color:#64748b; font-size:13px;">
              <i class="fa-solid fa-spinner fa-spin" style="font-size:28px; margin-bottom:12px; color:#d7123a;"></i><br>
              <strong>Memuat database customer...</strong>
            </div>
          </div>

          <!-- Table View (Spreadsheet Mode) -->
          <div class="sales-table-wrapper" id="followupTableWrapper" style="display:none;">
            <table class="sales-fu-table">
              <thead>
                <tr>
                  <th style="width:48px; text-align:center;">No.</th>
                  <th style="min-width:200px;">Customer &amp; Kontak</th>
                  <th style="min-width:190px;">Unit Mobil &amp; Usia</th>
                  <th style="min-width:170px;">Klaster &amp; Dealer</th>
                  <th style="min-width:260px;">Hasil Respon TAM (4 Pertanyaan)</th>
                  <th style="min-width:180px;">Remarks &amp; Status FU</th>
                  <th style="min-width:120px; text-align:right;">Aksi</th>
                </tr>
              </thead>
              <tbody id="followupTableTbody">
                <tr>
                  <td colspan="7" style="text-align:center; padding:30px; color:#64748b;">Memuat data...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    container.insertAdjacentHTML('afterbegin', tabsHtml);

    // Hide kanban elements initially since default active tab is followup database
    const kanbanElements = Array.from(document.querySelectorAll('.mobile-app .container > .card, #kanbanBoard'));
    kanbanElements.forEach(el => {
      if (el.id !== 'followupSectionView') el.style.display = 'none';
    });
  }
}

function switchViewMode(mode) {
  followupState.viewMode = mode;
  const btnCards = document.getElementById('btnViewCards');
  const btnTable = document.getElementById('btnViewTable');
  const grid = document.getElementById('followupCardsGrid');
  const table = document.getElementById('followupTableWrapper');

  if (mode === 'table') {
    btnTable?.classList.add('active');
    btnCards?.classList.remove('active');
    if (grid) grid.style.display = 'none';
    if (table) table.style.display = 'block';
  } else {
    btnCards?.classList.add('active');
    btnTable?.classList.remove('active');
    if (table) table.style.display = 'none';
    if (grid) grid.style.display = 'grid';
  }

  renderCustomerCards();
}

function switchCustomerTab(tab) {
  followupState.activeTab = tab;
  const tabKanban = document.getElementById('tabBtnKanban');
  const tabFollowup = document.getElementById('tabBtnFollowup');
  const followupView = document.getElementById('followupSectionView');
  
  const kanbanElements = Array.from(document.querySelectorAll('.mobile-app .container > .card, #kanbanBoard'));

  if (tab === 'followup') {
    tabKanban?.classList.remove('active');
    tabFollowup?.classList.add('active');
    followupView.style.display = 'block';

    kanbanElements.forEach(el => {
      if (el.id !== 'followupSectionView') el.style.display = 'none';
    });

    loadFollowupCustomers();
  } else {
    tabFollowup?.classList.remove('active');
    tabKanban?.classList.add('active');
    followupView.style.display = 'none';

    kanbanElements.forEach(el => {
      if (el.id !== 'followupSectionView') el.style.display = '';
    });
  }
}

async function switchFollowupSubTab(subTab) {
  followupState.subTab = subTab;
  const btnMy = document.getElementById('subBtnMyTasks');
  const btnPool = document.getElementById('subBtnOrphanPool');

  if (subTab === 'orphan_pool') {
    if (btnMy) btnMy.className = 'sub-nav-fu-btn';
    if (btnPool) btnPool.className = 'sub-nav-fu-btn pool-tab active';
    await loadOrphanLeads();
  } else {
    if (btnMy) btnMy.className = 'sub-nav-fu-btn active';
    if (btnPool) btnPool.className = 'sub-nav-fu-btn pool-tab';
    renderCustomerCards();
  }
}

async function loadTemplates() {
  try {
    const res = await fetch('../api/api_followup.php?action=templates');
    const data = await res.json();
    if (data.success) {
      followupState.templates = data.data || [];
    }
  } catch (e) {
    console.error('Error loading templates', e);
  }
}

async function loadFollowupCustomers() {
  const grid = document.getElementById('followupCardsGrid');
  if (grid) {
    // High-performance Skeleton Shimmer Cards during network loading
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; display:grid; grid-template-columns: repeat(auto-fill, minmax(460px, 1fr)); gap:18px;">
        ${[1, 2, 3, 4].map(() => `
          <div class="skeleton-card-fu">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div style="display:flex; gap:12px; align-items:center;">
                <div style="width:44px; height:44px; border-radius:50%; background:#e2e8f0;"></div>
                <div style="display:flex; flex-direction:column; gap:6px;">
                  <div class="skeleton-line" style="width:140px; height:16px;"></div>
                  <div class="skeleton-line" style="width:90px;"></div>
                </div>
              </div>
              <div class="skeleton-line" style="width:70px; height:20px; border-radius:8px;"></div>
            </div>
            <div class="skeleton-line" style="width:100%; height:45px; border-radius:12px;"></div>
            <div class="skeleton-line" style="width:100%; height:120px; border-radius:14px;"></div>
          </div>
        `).join('')}
      </div>
    `;
  }

  try {
    loadSalesProfile();
    let salesId = (followupState.salesInfo && followupState.salesInfo.id) ? followupState.salesInfo.id : 1;
    const res = await fetch(`../api/api_followup.php?action=customers&sales_id=${salesId}`);
    const data = await res.json();

    if (data.success) {
      followupState.customers = data.data || [];
      updateHeroStats();
      renderCategoryPills();
      
      if (followupState.subTab === 'orphan_pool') {
        loadOrphanLeads();
      } else {
        renderCustomerCards();
      }

      // Fetch live orphan count in background
      fetchOrphanCountBadge();

      // Update badge count
      const pendingCount = followupState.customers.filter(c => c.followup_status === 'Belum Dihubungi').length;
      const badge = document.getElementById('followupBadgeCount');
      if (badge) {
        if (pendingCount > 0) {
          badge.style.display = 'inline-block';
          badge.textContent = pendingCount;
        } else {
          badge.style.display = 'none';
        }
      }
    }
  } catch (e) {
    if (grid) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:40px; color:red; font-size:13px;">
          <i class="fa-solid fa-circle-exclamation" style="font-size:24px; margin-bottom:10px;"></i><br>
          Gagal memuat data customer. Silakan periksa koneksi server.
        </div>
      `;
    }
  }
}

async function fetchOrphanCountBadge() {
  try {
    const res = await fetch('../api/api_followup.php?action=orphan_leads');
    const data = await res.json();
    if (data && data.success) {
      updateOrphanBadgeCount(data.count || 0);
    }
  } catch (e) {
    // Non-blocking background fetch
  }
}

function updateOrphanBadgeCount(count) {
  const badge = document.getElementById('badgeOrphanPoolCount');
  if (badge) {
    badge.textContent = `⚡ ${count} Siap Rebut`;
  }
}

async function loadOrphanLeads() {
  const grid = document.getElementById('followupCardsGrid');
  if (grid) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; color:#ea580c;">
        <i class="fa-solid fa-fire fa-fade" style="font-size:32px; margin-bottom:12px;"></i><br>
        <strong>Mencari prospek yang tersedia di Pool Rebutan...</strong>
      </div>
    `;
  }

  try {
    const { searchQuery, activeCategory } = followupState;
    const url = `../api/api_followup.php?action=orphan_leads&search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(activeCategory)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      followupState.orphanLeads = data.data || [];
      updateOrphanBadgeCount(data.count || 0);
      renderOrphanPoolCards();
    }
  } catch (e) {
    console.error('Error loading orphan leads:', e);
  }
}

function renderOrphanPoolCards() {
  const grid = document.getElementById('followupCardsGrid');
  if (!grid) return;

  const list = followupState.orphanLeads || [];
  if (list.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding:60px 20px; background:#fff; border-radius:var(--fu-radius-lg); border:1.5px dashed #fed7aa; box-shadow:var(--fu-shadow-card);">
        <div style="width:64px; height:64px; border-radius:50%; background:#ffedd5; color:#ea580c; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:26px;">
          <i class="fa-solid fa-fire-extinguisher"></i>
        </div>
        <h3 style="font-size:17px; font-weight:900; color:#431407; margin-bottom:6px;">Semua Prospek Sudah Terbagi / Belum Ada Rebutan</h3>
        <p style="font-size:13px; color:#9a3412; max-width:480px; margin:0 auto 18px; line-height:1.5;">
          Saat ini tidak ada database ex-sales atau prospek yang terbengkalai. Jika ada sales yang resign atau database dilepas oleh SPV, prospek tersebut akan otomatis muncul di sini untuk diperebutkan.
        </p>
        <button type="button" class="btn-fu btn-fu-secondary" onclick="loadOrphanLeads()" style="padding:10px 20px; font-size:12px;">
          <i class="fa-solid fa-arrows-rotate"></i> Cek Ulang Pool Rebutan
        </button>
      </div>
    `;
    return;
  }

  let html = `
    <div style="grid-column: 1 / -1;" class="pool-rebutan-hero">
      <div>
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:22px;">🔥</span>
          <h3 style="font-size:17px; font-weight:900; margin:0; line-height:1.2;">Pool Rebutan Prospek (Ex-Sales &amp; Unassigned Leads)</h3>
        </div>
        <p style="font-size:12px; color:rgba(255,255,255,0.9); margin:4px 0 0 0;">
          <strong>Siapa Cepat Dia Dapat!</strong> Prospek ini pernah diisi oleh sales sebelumnya (atau dilepas SPV). Klik tombol <strong>Ambil Alih Prospek</strong> untuk memindahkan customer ke daftar tugas Anda.
        </p>
      </div>
      <div style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); padding:8px 16px; border-radius:12px; font-weight:800; font-size:14px; text-align:center;">
        ⚡ ${list.length} Prospek Siap Rebut
      </div>
    </div>
  `;

  list.forEach((c, idx) => {
    const rawName = (c.name || 'Customer').trim();
    const parts = rawName.split(/\s+/);
    let initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : rawName.substring(0, 2).toUpperCase();
    const isConn = (c.connected === 'TRUE' || c.connected === 'IYA');
    const isCont = (c.contacted === 'TRUE' || c.contacted === 'IYA');
    const isProsp = (c.prospect === 'TRUE' || c.prospect === 'IYA');
    const isSpk = (c.spk === 'TRUE' || c.spk === 'IYA');

    html += `
      <div class="followup-card" style="border: 2px solid #fdba74; box-shadow: 0 4px 16px rgba(234, 88, 12, 0.08);" id="orphan_card_${c.id}">
        <div>
          <!-- Top Rebutan Banner Inside Card -->
          <div class="orphan-card-banner">
            <div class="orphan-fire-tag">
              <i class="fa-solid fa-fire" style="color:#ea580c;"></i>
              <span>Siap Direbut (Ex-Sales)</span>
            </div>
            <div class="orphan-ready-pill">
              <i class="fa-solid fa-bolt"></i> Siap Diklaim
            </div>
          </div>

          <!-- Header Row: Customer Identity & Category -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="cust-avatar-circle" style="width:44px; height:44px; font-size:15px; flex-shrink:0; background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:#fff;">
                ${initials}
              </div>
              <div>
                <div style="font-size:16.5px; font-weight:900; color:#0d1b3e; line-height:1.2; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <span class="fu-card-num-badge orphan-badge">#${idx + 1}</span>
                  <span>${escapeHtml(c.name || 'Customer')}</span>
                </div>
                <div style="margin-top:3px; display:flex; align-items:center; gap:6px;">
                  <a href="https://wa.me/${c.phone}" target="_blank" class="cust-phone-link">
                    <i class="fa-brands fa-whatsapp" style="color:#10b981; font-size:14px;"></i> +${escapeHtml(c.phone || '-')}
                  </a>
                  <button type="button" onclick="navigator.clipboard.writeText('${c.phone}'); showToastCopy('${c.phone}');" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:2px 4px; font-size:11px;" title="Salin No. WA">
                    <i class="fa-regular fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>

            <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
              <span class="badge-cluster-pill" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-size:10px; font-weight:800;">
                ${escapeHtml(c.followup_category || 'Trade-in / Repurchase')}
              </span>
              <span style="font-size:9.5px; font-family:monospace; color:#94a3b8; font-weight:700;">
                ${escapeHtml(c.customer_code || `CUST-${c.id}`)}
              </span>
            </div>
          </div>

          <!-- Vehicle Upgrade Journey Flow -->
          <div class="vehicle-journey-box" style="margin:10px 0 12px 0; padding:12px 14px;">
            <div class="vehicle-journey-row">
              <!-- Left: Current Vehicle -->
              <div class="vehicle-unit-side">
                <div class="sub-lbl" style="font-size:10px;"><i class="fa-solid fa-car-side"></i> Mobil Saat Ini</div>
                <div class="model-name" style="font-size:13.5px; color:#0f172a;">${escapeHtml(c.last_car_model || c.car_model || '-')}</div>
                ${c.car_age ? `<div style="font-size:10.5px; color:#b45309; font-weight:700; margin-top:2px;"><i class="fa-solid fa-clock"></i> Usia: ${c.car_age}</div>` : ''}
              </div>

              <!-- Center: Arrow Icon -->
              <div class="journey-arrow" style="font-size:13px; color:#ea580c;">
                <i class="fa-solid fa-arrow-right"></i>
              </div>

              <!-- Right: Recommended Target Model -->
              <div class="vehicle-unit-side" style="text-align:right;">
                <div class="sub-lbl" style="color:#ea580c; font-size:10px;"><i class="fa-solid fa-bullseye"></i> Target Upgrade TAM</div>
                <div class="model-name" style="color:#c2410c; font-size:13.5px; font-weight:900;">${escapeHtml(c.recommended_model || c.car_model || '-')}</div>
                ${(c.alt_model_2 || c.alt_model_3) ? `<div style="font-size:10px; color:#64748b; margin-top:2px;">Alt: <strong style="color:#334155;">${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(', ')}</strong></div>` : ''}
              </div>
            </div>
          </div>

          <!-- Badges Line: Cluster, Priority, Location & DO -->
          <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px;">
            ${c.cluster_name ? `<span class="badge-cluster-pill" style="font-size:10.5px;">🏷️ ${escapeHtml(c.cluster_name)}</span>` : ''}
            ${c.priority ? `<span class="badge-priority-pill" style="font-size:10.5px;">⚡ ${escapeHtml(c.priority)}</span>` : ''}
            ${c.district ? `<span class="badge-loc-pill" style="font-size:10.5px;">📍 Kec. ${escapeHtml(c.district)}</span>` : ''}
            ${c.outlet_do ? `<span class="badge-cluster-pill" style="background:#f8fafc; font-size:10px;"><i class="fa-solid fa-building"></i> ${escapeHtml(c.outlet_do)}</span>` : ''}
          </div>

          <!-- Prior Progress Dossier Box -->
          <div class="ex-sales-dossier-card">
            <div class="dossier-header">
              <span style="display:flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-clock-rotate-left"></i> Histori Follow-Up dari Sales Sebelumnya
              </span>
              ${c.remarks ? `<span style="font-size:10px; font-weight:800; background:#ffedd5; color:#c2410c; padding:2px 7px; border-radius:6px;">${escapeHtml(c.remarks)}</span>` : ''}
            </div>

            <div class="dossier-chips-grid">
              <div class="dossier-chip">
                <div class="chip-lbl">Connected</div>
                <div class="chip-val" style="color:${isConn ? '#16a34a' : '#dc2626'};">${isConn ? '✅ Iya' : '❌ Tidak'}</div>
              </div>
              <div class="dossier-chip">
                <div class="chip-lbl">Contacted</div>
                <div class="chip-val" style="color:${isCont ? '#16a34a' : '#dc2626'};">${isCont ? '✅ Iya' : '❌ Tidak'}</div>
              </div>
              <div class="dossier-chip">
                <div class="chip-lbl">Prospect</div>
                <div class="chip-val" style="color:${isProsp ? '#2563eb' : '#64748b'};">${isProsp ? '🔥 Minat' : '⚪ Belum'}</div>
              </div>
              <div class="dossier-chip">
                <div class="chip-lbl">SPK Deal</div>
                <div class="chip-val" style="color:${isSpk ? '#16a34a' : '#64748b'};">${isSpk ? '🏆 SPK' : '⚪ Belum'}</div>
              </div>
            </div>

            ${c.reason_followup ? `
              <div class="dossier-quote-box">
                <i class="fa-solid fa-comment-dots" style="color:#ea580c; margin-top:2px;"></i>
                <div>
                  <strong style="color:#9a3412; font-size:10.5px;">Catatan Terakhir:</strong>
                  <div style="font-style:italic; margin-top:1px;">"${escapeHtml(c.reason_followup)}"</div>
                </div>
              </div>
            ` : `
              <div style="font-size:11px; color:#78716c; font-style:italic; padding-top:2px;">
                Belum ada catatan detail. Prospek segar siap Anda follow-up.
              </div>
            `}
          </div>

          <!-- Big Action Button: AMBIL ALIH PROSPEK INI -->
          <div style="margin-top:14px; display:flex; gap:8px;">
            <button type="button" class="btn-claim-lead-premium" onclick="claimOrphanLead(${c.id}, '${escapeJs(c.name)}')">
              <i class="fa-solid fa-bolt" style="font-size:16px;"></i>
              <span>AMBIL ALIH PROSPEK INI (MILIK SAYA)</span>
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn-sub" style="padding:12px 14px; font-size:12px; border-radius:12px; background:#eff6ff; color:#1d4ed8; font-weight:800; border:1.5px solid #bfdbfe; cursor:pointer;" onclick="openSalesCustomerDetailModal(${c.id})" title="Lihat Detail Customer">
              <i class="fa-solid fa-circle-info"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

async function claimOrphanLead(customerId, customerName) {
  loadSalesProfile();
  const salesId = (followupState.salesInfo && followupState.salesInfo.id) ? followupState.salesInfo.id : 1;

  try {
    const res = await fetch('../api/api_followup.php?action=claim_orphan_lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: customerId,
        sales_id: salesId
      })
    });
    const data = await res.json();

    if (data.success) {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('🏆 Berhasil Diambil Alih!', data.message || `Customer ${customerName} resmi menjadi milik Anda.`, 'success');
      } else if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: '🏆 Berhasil Diambil Alih!',
          text: data.message || `Customer ${customerName} resmi menjadi milik Anda.`,
          confirmButtonColor: '#0d1b3e'
        });
      }

      // If customer record returned, add to active customers list
      if (data.customer) {
        followupState.customers.unshift(data.customer);
      }

      // Remove from orphan pool
      followupState.orphanLeads = followupState.orphanLeads.filter(x => String(x.id) !== String(customerId));
      updateOrphanBadgeCount(followupState.orphanLeads.length);

      // Auto switch to My Tasks so sales can immediately work on it
      setTimeout(() => {
        switchFollowupSubTab('my_tasks');
        loadFollowupCustomers();
      }, 1000);
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal Mengambil Alih', data.message || 'Prospek telah diambil oleh sales lain.', 'warning');
      } else if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'warning',
          title: 'Tidak Dapat Diambil',
          text: data.message || 'Prospek telah diambil oleh sales lain.',
          confirmButtonColor: '#0d1b3e'
        });
      }
      loadOrphanLeads();
    }
  } catch (e) {
    console.error('Error claiming lead:', e);
  }
}

function updateHeroStats() {
  const list = followupState.customers;
  const total = list.length;
  const pending = list.filter(c => !c.followup_status || c.followup_status === 'Belum Dihubungi').length;
  const followedUp = total - pending;
  const waiting = list.filter(c => c.followup_status === 'Menunggu Respon').length;
  const interested = list.filter(c => c.followup_status === 'Tertarik / Jadwal Servis').length;
  const deal = list.filter(c => c.followup_status === 'Deal / Selesai').length;

  const elTotal = document.getElementById('heroTotalCount');
  const elPending = document.getElementById('heroPendingCount');
  const elFollowed = document.getElementById('heroFollowedCount');
  const elInterested = document.getElementById('heroInterestedCount');
  const badgeMyTasks = document.getElementById('badgeMyTasksCount');

  if (elTotal) elTotal.textContent = total;
  if (elPending) elPending.textContent = pending;
  if (elFollowed) elFollowed.textContent = followedUp;
  if (elInterested) elInterested.textContent = interested;
  if (badgeMyTasks) badgeMyTasks.textContent = total;

  // Filter Tab Badges
  const bAll = document.getElementById('countBadgeAll');
  const bBelum = document.getElementById('countBadgeBelum');
  const bSudah = document.getElementById('countBadgeSudah');
  const bWaiting = document.getElementById('countBadgeWaiting');
  const bInterested = document.getElementById('countBadgeInterested');
  const bDeal = document.getElementById('countBadgeDeal');

  if (bAll) bAll.textContent = total;
  if (bBelum) bBelum.textContent = pending;
  if (bSudah) bSudah.textContent = followedUp;
  if (bWaiting) bWaiting.textContent = waiting;
  if (bInterested) bInterested.textContent = interested;
  if (bDeal) bDeal.textContent = deal;
}

function renderCategoryPills() {
  const container = document.getElementById('followupCategoryPills');
  if (!container) return;

  const categories = Array.from(new Set(followupState.customers.map(c => c.followup_category).filter(Boolean)));
  
  let html = `
    <button class="category-pill-btn ${followupState.activeCategory === 'all' ? 'active' : ''}" onclick="handleCategoryFilter('all', this)">
      <i class="fa-solid fa-grid-2"></i> Semua Kategori (${followupState.customers.length})
    </button>
  `;

  categories.forEach(cat => {
    const count = followupState.customers.filter(c => c.followup_category === cat).length;
    const isActive = followupState.activeCategory === cat;
    html += `
      <button class="category-pill-btn ${isActive ? 'active' : ''}" onclick="handleCategoryFilter('${cat}', this)">
        ${cat} <span style="font-size:10px; opacity:0.8;">(${count})</span>
      </button>
    `;
  });

  container.innerHTML = html;
}

function handleFollowupSearch(query) {
  followupState.searchQuery = query.toLowerCase().trim();
  if (followupState.subTab === 'orphan_pool') {
    loadOrphanLeads();
  } else {
    renderCustomerCards();
  }
}

function handleCategoryFilter(cat, btn) {
  followupState.activeCategory = cat;
  document.querySelectorAll('#followupCategoryPills .category-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (followupState.subTab === 'orphan_pool') {
    loadOrphanLeads();
  } else {
    renderCustomerCards();
  }
}

function handleStatusFilter(status, btn) {
  followupState.activeStatus = status;
  document.querySelectorAll('#followupStatusTabs .status-fu-tab-btn, #followupStatusTabs button').forEach(b => b.classList.remove('active'));
  
  if (btn) {
    btn.classList.add('active');
  } else {
    if (status === 'all') document.getElementById('btnStatusAll')?.classList.add('active');
    else if (status === 'belum_fu' || status === 'Belum Dihubungi') document.getElementById('btnStatusBelum')?.classList.add('active');
    else if (status === 'sudah_fu') document.getElementById('btnStatusSudah')?.classList.add('active');
    else if (status === 'Menunggu Respon') document.getElementById('btnStatusWaiting')?.classList.add('active');
    else if (status === 'Tertarik / Jadwal Servis') document.getElementById('btnStatusInterested')?.classList.add('active');
    else if (status === 'Deal / Selesai') document.getElementById('btnStatusDeal')?.classList.add('active');
  }

  renderCustomerCards(false);
}

function renderCustomerCards(preserveRenderLimit = false) {
  let list = followupState.customers;

  // Filter Search
  if (followupState.searchQuery) {
    const q = followupState.searchQuery;
    list = list.filter(c => 
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      (c.car_model && c.car_model.toLowerCase().includes(q)) ||
      (c.last_car_model && c.last_car_model.toLowerCase().includes(q)) ||
      (c.recommended_model && c.recommended_model.toLowerCase().includes(q)) ||
      (c.plate_number && c.plate_number.toLowerCase().includes(q)) ||
      (c.district && c.district.toLowerCase().includes(q))
    );
  }

  // Filter Category
  if (followupState.activeCategory !== 'all') {
    list = list.filter(c => c.followup_category === followupState.activeCategory);
  }

  // Filter Status (All, Belum FU, Sudah FU, or specific status)
  if (followupState.activeStatus !== 'all') {
    if (followupState.activeStatus === 'belum_fu' || followupState.activeStatus === 'Belum Dihubungi') {
      list = list.filter(c => !c.followup_status || c.followup_status === 'Belum Dihubungi');
    } else if (followupState.activeStatus === 'sudah_fu') {
      list = list.filter(c => c.followup_status && c.followup_status !== 'Belum Dihubungi');
    } else {
      list = list.filter(c => c.followup_status === followupState.activeStatus);
    }
  }

  followupState.filteredList = list;

  const lastActiveId = sessionStorage.getItem('last_active_fu_customer_id');
  if (lastActiveId) {
    const targetIdx = list.findIndex(x => String(x.id) === String(lastActiveId));
    if (targetIdx !== -1 && targetIdx >= 24) {
      followupState.renderLimit = Math.min(list.length, Math.ceil((targetIdx + 1) / 24) * 24);
    } else if (!preserveRenderLimit) {
      followupState.renderLimit = 24;
    }
  } else if (!preserveRenderLimit) {
    followupState.renderLimit = 24;
  }

  if (followupState.viewMode === 'table') {
    renderCustomerTableView(list);
  } else {
    renderCustomerCardsView(list, false);
  }

  // Scroll to last active customer if available
  if (lastActiveId) {
    setTimeout(() => {
      const targetEl = document.getElementById(`customerCard_${lastActiveId}`) || document.getElementById(`customerRow_${lastActiveId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetEl.classList.add('card-just-followed-up');
        setTimeout(() => targetEl.classList.remove('card-just-followed-up'), 5000);
      }
    }, 200);
  }
}

// -------------------------------------------------------------
// INDONESIAN WIB DATE FORMATTER HELPER
// -------------------------------------------------------------
function formatWibDate(dateStr) {
  if (!dateStr || dateStr.startsWith('0000')) {
    return { text: '⚪ Belum di-FU', isRecorded: false, formatted: '' };
  }

  try {
    const cleanStr = String(dateStr).replace('T', ' ');
    const parts = cleanStr.split(' ');
    const datePart = parts[0]; // YYYY-MM-DD
    const timePart = parts[1] ? parts[1].substring(0, 5) : ''; // HH:mm

    const dArr = datePart.split('-');
    if (dArr.length === 3) {
      const year = parseInt(dArr[0], 10);
      const month = parseInt(dArr[1], 10) - 1;
      const day = parseInt(dArr[2], 10);

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      
      const now = new Date();
      const todayYear = now.getFullYear();
      const todayMonth = now.getMonth();
      const todayDay = now.getDate();

      const isToday = (year === todayYear && month === todayMonth && day === todayDay);
      
      const yesterday = new Date();
      yesterday.setDate(todayDay - 1);
      const isYesterday = (year === yesterday.getFullYear() && month === yesterday.getMonth() && day === yesterday.getDate());

      let formattedDate = '';
      if (isToday) {
        formattedDate = `Hari ini${timePart ? `, ${timePart} WIB` : ''}`;
      } else if (isYesterday) {
        formattedDate = `Kemarin${timePart ? `, ${timePart} WIB` : ''}`;
      } else {
        formattedDate = `${day} ${months[month]} ${year}${timePart ? `, ${timePart} WIB` : ''}`;
      }

      return { text: `📅 ${formattedDate}`, isRecorded: true, formatted: formattedDate };
    }
  } catch (e) {
    console.error('Error formatting WIB date:', e);
  }

  return { text: `📅 ${dateStr.substring(0, 16)}`, isRecorded: true, formatted: dateStr };
}

// -------------------------------------------------------------
// MODULAR SINGLE CUSTOMER CARD HTML GENERATOR
// -------------------------------------------------------------
function renderSingleCustomerCardHtml(c, num) {
  const isPending = c.followup_status === 'Belum Dihubungi';
  const isDeal = c.followup_status === 'Deal / Selesai';
  const isInterested = c.followup_status === 'Tertarik / Jadwal Servis';

  const statusClass = isPending ? 'pending' : (isDeal ? 'deal' : (isInterested ? 'interested' : ''));

  // Generate Initials
  const rawName = (c.name || 'Customer').trim();
  const parts = rawName.split(/\s+/);
  let initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : rawName.substring(0, 2).toUpperCase();

  const dateInfo = formatWibDate(c.followup_date);

  let statusBadgeHtml = '';
  if (c.followup_status === 'Deal / Selesai') {
    statusBadgeHtml = `<span class="badge-status-pill deal" style="background:#dcfce7; color:#15803d; border:1px solid #86efac; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-trophy"></i> Deal</span>`;
  } else if (c.followup_status === 'Tertarik / Jadwal Servis') {
    statusBadgeHtml = `<span class="badge-status-pill interested" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-thumbs-up"></i> Tertarik</span>`;
  } else if (c.followup_status === 'Menunggu Respon') {
    statusBadgeHtml = `<span class="badge-status-pill waiting" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-clock"></i> Respon</span>`;
  }

  const isFollowedUp = (c.followup_status && c.followup_status !== 'Belum Dihubungi') || Boolean(c.followup_date);

  const isConnYes = isFollowedUp && (c.connected === 'TRUE' || c.connected === 'IYA');
  const isConnNo = isFollowedUp && (c.connected === 'FALSE' || c.connected === 'TIDAK');

  const isContYes = isFollowedUp && (c.contacted === 'TRUE' || c.contacted === 'IYA');
  const isContNo = isFollowedUp && (c.contacted === 'FALSE' || c.contacted === 'TIDAK');

  const isProspYes = isFollowedUp && (c.prospect === 'TRUE' || c.prospect === 'IYA');
  const isProspNo = isFollowedUp && (c.prospect === 'FALSE' || c.prospect === 'TIDAK');

  const isSpkYes = isFollowedUp && (c.spk === 'TRUE' || c.spk === 'IYA');
  const isSpkNo = isFollowedUp && (c.spk === 'FALSE' || c.spk === 'TIDAK');

  return `
    <div class="followup-card ${statusClass}" id="customerCard_${c.id}">
      <div>
        <!-- Header Row -->
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:12px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="cust-avatar-circle" style="width:44px; height:44px; font-size:15px; flex-shrink:0;">${initials}</div>
            <div>
              <div style="font-size:16.5px; font-weight:900; color:#0d1b3e; line-height:1.2; display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                ${num ? `<span class="fu-card-num-badge">#${num}</span>` : ''}
                <span>${c.name}</span>
              </div>
              <div style="margin-top:3px; display:flex; align-items:center; gap:6px;">
                <a href="https://wa.me/${c.phone}" target="_blank" class="cust-phone-link" onclick="sessionStorage.setItem('last_active_fu_customer_id', ${c.id})">
                  <i class="fa-brands fa-whatsapp" style="color:#10b981; font-size:14px;"></i> +${c.phone}
                </a>
                <button type="button" onclick="navigator.clipboard.writeText('${c.phone}'); showToastCopy('${c.phone}');" style="background:transparent; border:none; color:#94a3b8; cursor:pointer; padding:2px 4px; font-size:11px;" title="Salin No. WA">
                  <i class="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>

          <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
            <span class="badge-cluster-pill" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-size:10px; font-weight:800;">
              ${c.followup_category || 'Trade-in / Repurchase'}
            </span>
            <div id="custCardStatusPill_${c.id}">${statusBadgeHtml}</div>
            <span style="font-size:9.5px; font-family:monospace; color:#94a3b8; font-weight:700;">
              ${c.customer_code || `CUST-${c.id}`}
            </span>
          </div>
        </div>

        <!-- Interactive Vehicle Upgrade Journey Flow -->
        <div class="vehicle-journey-box" style="margin:10px 0 12px 0; padding:12px 14px;">
          <div class="vehicle-journey-row">
            <!-- Left: Current Vehicle -->
            <div class="vehicle-unit-side">
              <div class="sub-lbl" style="font-size:10px;"><i class="fa-solid fa-car-side"></i> Mobil Saat Ini</div>
              <div class="model-name" style="font-size:13.5px; color:#0f172a;">${c.last_car_model || '-'}</div>
              ${c.car_age ? `<div style="font-size:10.5px; color:#b45309; font-weight:700; margin-top:2px;"><i class="fa-solid fa-clock"></i> Usia: ${c.car_age}</div>` : ''}
            </div>

            <!-- Center: Arrow Icon -->
            <div class="journey-arrow" style="font-size:13px; color:#d7123a;">
              <i class="fa-solid fa-arrow-right"></i>
            </div>

            <!-- Right: Recommended Target Model -->
            <div class="vehicle-unit-side" style="text-align:right;">
              <div class="sub-lbl" style="color:#d7123a; font-size:10px;"><i class="fa-solid fa-bullseye"></i> Target Upgrade TAM</div>
              <div class="model-name" style="color:#d7123a; font-size:13.5px; font-weight:900;">${c.recommended_model || c.car_model}</div>
              ${(c.alt_model_2 || c.alt_model_3) ? `<div style="font-size:10px; color:#64748b; margin-top:2px;">Alt: <strong style="color:#334155;">${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(', ')}</strong></div>` : ''}
            </div>
          </div>
        </div>

        <!-- Badges Line: Cluster, Priority, Location & DO -->
        <div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:12px;">
          ${c.cluster_name ? `<span class="badge-cluster-pill" style="font-size:10.5px;">🏷️ ${c.cluster_name}</span>` : ''}
          ${c.priority ? `<span class="badge-priority-pill" style="font-size:10.5px;">⚡ ${c.priority}</span>` : ''}
          ${c.district ? `<span class="badge-loc-pill" style="font-size:10.5px;">📍 Kec. ${c.district}</span>` : ''}
          ${c.outlet_do ? `<span class="badge-cluster-pill" style="background:#f8fafc; font-size:10px;"><i class="fa-solid fa-building"></i> ${c.outlet_do}</span>` : ''}
          ${c.service_compliance ? `<span class="badge-cluster-pill" style="background:#ecfdf5; color:#059669; font-size:10px;"><i class="fa-solid fa-wrench"></i> Servis: ${c.service_compliance}</span>` : ''}
          ${c.vin ? `<span class="badge-cluster-pill" style="background:#f8fafc; font-size:9.5px; font-family:monospace;">🔑 VIN: ${c.vin}</span>` : ''}
        </div>
      </div>

      <!-- Interactive TAM Follow-Up Response Form (Step Funnel) -->
      <div class="tam-fu-box">
        <div class="tam-fu-header">
          <div class="tam-fu-title">
            <i class="fa-solid fa-clipboard-check"></i> Hasil Follow-Up Sales (TAM 4-Pilar)
          </div>
          <span id="fuDateBadge_${c.id}" class="fu-date-badge ${dateInfo.isRecorded ? 'recorded' : 'empty'}">
            ${dateInfo.text}
          </span>
        </div>

        <!-- Stepped Funnel: 1. Connected -> 2. Contacted -> 3. Prospect -> 4. SPK -->
        <div class="fu-funnel-grid">
          <!-- Step 1: Connected -->
          <div class="fu-step-card">
            <div class="fu-step-top">
              <div class="fu-step-num">1</div>
              <div class="fu-step-text">
                <div class="fu-step-name">Connected</div>
                <div class="fu-step-desc">No. Aktif / Tersambung</div>
              </div>
            </div>
            <div class="fu-segmented-btn-group" id="group_connected_${c.id}">
              <button type="button" class="fu-tog-btn ${isConnYes ? 'active-yes' : ''}" onclick="setFuToggle(${c.id}, 'connected', 'TRUE')"><i class="fa-solid fa-check"></i> Iya</button>
              <button type="button" class="fu-tog-btn ${isConnNo ? 'active-no' : ''}" onclick="setFuToggle(${c.id}, 'connected', 'FALSE')"><i class="fa-solid fa-xmark"></i> Tidak</button>
            </div>
          </div>

          <!-- Step 2: Contacted -->
          <div class="fu-step-card">
            <div class="fu-step-top">
              <div class="fu-step-num">2</div>
              <div class="fu-step-text">
                <div class="fu-step-name">Contacted</div>
                <div class="fu-step-desc">Respon / Komunikasi</div>
              </div>
            </div>
            <div class="fu-segmented-btn-group" id="group_contacted_${c.id}">
              <button type="button" class="fu-tog-btn ${isContYes ? 'active-yes' : ''}" onclick="setFuToggle(${c.id}, 'contacted', 'TRUE')"><i class="fa-solid fa-check"></i> Iya</button>
              <button type="button" class="fu-tog-btn ${isContNo ? 'active-no' : ''}" onclick="setFuToggle(${c.id}, 'contacted', 'FALSE')"><i class="fa-solid fa-xmark"></i> Tidak</button>
            </div>
          </div>

          <!-- Step 3: Prospect -->
          <div class="fu-step-card">
            <div class="fu-step-top">
              <div class="fu-step-num">3</div>
              <div class="fu-step-text">
                <div class="fu-step-name">Prospect</div>
                <div class="fu-step-desc">Minat Beli / Upgrade</div>
              </div>
            </div>
            <div class="fu-segmented-btn-group" id="group_prospect_${c.id}">
              <button type="button" class="fu-tog-btn ${isProspYes ? 'active-yes' : ''}" onclick="setFuToggle(${c.id}, 'prospect', 'TRUE')"><i class="fa-solid fa-check"></i> Iya</button>
              <button type="button" class="fu-tog-btn ${isProspNo ? 'active-no' : ''}" onclick="setFuToggle(${c.id}, 'prospect', 'FALSE')"><i class="fa-solid fa-xmark"></i> Tidak</button>
            </div>
          </div>

          <!-- Step 4: SPK -->
          <div class="fu-step-card">
            <div class="fu-step-top">
              <div class="fu-step-num" style="background:#d7123a;">4</div>
              <div class="fu-step-text">
                <div class="fu-step-name" style="color:#d7123a;">SPK Deal</div>
                <div class="fu-step-desc">Closing Transaksi</div>
              </div>
            </div>
            <div class="fu-segmented-btn-group" id="group_spk_${c.id}">
              <button type="button" class="fu-tog-btn ${isSpkYes ? 'active-yes' : ''}" onclick="setFuToggle(${c.id}, 'spk', 'TRUE')"><i class="fa-solid fa-check"></i> Iya</button>
              <button type="button" class="fu-tog-btn ${isSpkNo ? 'active-no' : ''}" onclick="setFuToggle(${c.id}, 'spk', 'FALSE')"><i class="fa-solid fa-xmark"></i> Tidak</button>
            </div>
          </div>
        </div>

        <!-- Controls: Remarks & Status Follow-Up -->
        <div class="fu-controls-row">
          <div>
            <select id="remarks_${c.id}" class="fu-select-remarks" onchange="handleRemarksChange(${c.id}, this.value)">
              <option value="">-- Pilih Remarks Respon Customer --</option>
              <optgroup label="🟢 RESPON POSITIF & PROSPEK">
                <option value="Customer tertarik" ${c.remarks === 'Customer tertarik' ? 'selected' : ''}>🔵 Customer tertarik (Beri Info Unit)</option>
                <option value="Customer janjian" ${c.remarks === 'Customer janjian' ? 'selected' : ''}>🟡 Customer janjian (Ketemu/Showroom)</option>
                <option value="Minta simulasi kredit" ${c.remarks === 'Minta simulasi kredit' ? 'selected' : ''}>📝 Minta simulasi DP &amp; Angsuran</option>
                <option value="Janjian test drive" ${c.remarks === 'Janjian test drive' ? 'selected' : ''}>🚗 Janjian Jadwal Test Drive</option>
                <option value="SPK berhasil" ${c.remarks === 'SPK berhasil' ? 'selected' : ''}>🏆 SPK Berhasil / Closing Deal</option>
              </optgroup>
              <optgroup label="🟡 FOLLOW-UP LANJUTAN">
                <option value="Customer pending" ${c.remarks === 'Customer pending' ? 'selected' : ''}>🟢 Customer pending (Follow-Up Lanjut)</option>
                <option value="Tunggu gajian/dana" ${c.remarks === 'Tunggu gajian/dana' ? 'selected' : ''}>⏳ Menunggu Gajian / Dana Siap</option>
                <option value="Cek harga mobil lama" ${c.remarks === 'Cek harga mobil lama' ? 'selected' : ''}>🔄 Proses Cek Harga Trade-In</option>
              </optgroup>
              <optgroup label="🔴 KEBERATAN / TIDAK MERESPON">
                <option value="Customer menolak" ${c.remarks === 'Customer menolak' ? 'selected' : ''}>🔴 Customer menolak / Belum Mau Ganti</option>
                <option value="Beli di dealer/merk lain" ${c.remarks === 'Beli di dealer/merk lain' ? 'selected' : ''}>❌ Sudah ambil di dealer/merk lain</option>
                <option value="Customer tidak aktif" ${c.remarks === 'Customer tidak aktif' ? 'selected' : ''}>⚪ No. WA / HP Tidak Aktif</option>
                <option value="Customer tidak diangkat" ${c.remarks === 'Customer tidak diangkat' ? 'selected' : ''}>⚫ Telepon Tidak Diangkat / Centang 1</option>
              </optgroup>
            </select>
          </div>

          <div>
            <select id="salesFuStatus_${c.id}" class="fu-select-status" onchange="handleStatusChange(${c.id}, this.value)" title="Status Tahapan Follow-Up">
              <option value="Open" ${(c.sales_fu_status === 'Open' || !c.sales_fu_status) ? 'selected' : ''}>🔓 Open (Proses)</option>
              <option value="Closed" ${c.sales_fu_status === 'Closed' ? 'selected' : ''}>🔒 Closed (Selesai)</option>
            </select>
          </div>
        </div>

        <!-- Quick Notes Preset Chips (1-Click Suggestions) -->
        <div class="fu-quick-chips-wrapper">
          <div class="fu-quick-chips-title">
            <i class="fa-solid fa-bolt" style="color:#d7123a;"></i> Catatan Cepat (1-Klik):
          </div>
          <div class="fu-quick-chips-scroll">
            <button type="button" class="fu-chip-btn fu-chip-clear" onclick="clearQuickNote(${c.id})" title="Hapus / Kosongkan seluruh catatan"><i class="fa-solid fa-trash-can"></i> Hapus Catatan</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Minta simulasi TDP & Angsuran')">💬 Minta Simulasi DP</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Janjian ketemu weekend ini')">📅 Janjian Weekend</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Mau coba test drive unit')">🚗 Mau Test Drive</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Tunggu gajian tanggal 25')">⏳ Tunggu Gajian</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Taksiran harga mobil lama cocok')">🔄 Cek Trade-in</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'Kirim brosur & pricelist via WA')">📄 Kirim Brosur WA</button>
            <button type="button" class="fu-chip-btn" onclick="applyQuickNote(${c.id}, 'No. HP tidak aktif / centang 1')">❌ WA Tidak Aktif</button>
          </div>
        </div>

        <!-- Note Input & Save Button Row -->
        <div class="fu-note-row">
          <div style="position:relative; flex:1; display:flex; align-items:center;">
            <input type="text" id="reasonFu_${c.id}" class="fu-note-input" style="width:100%; padding-right:32px;" placeholder="Tulis alasan follow up / catatan respon spesifik..." value="${escapeHtml(c.reason_followup || c.notes || '')}" oninput="handleReasonInput(${c.id}, this.value)" onkeydown="if(event.key==='Enter') saveSalesFuManual(${c.id})">
            <button type="button" id="btnClearNote_${c.id}" class="fu-btn-clear-inline" style="display:${(c.reason_followup || c.notes || '').trim() ? 'flex' : 'none'};" onclick="clearQuickNote(${c.id})" title="Hapus / Kosongkan Catatan">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <button type="button" id="btnSaveFu_${c.id}" class="fu-btn-save" onclick="saveSalesFuManual(${c.id})" title="Simpan Data Follow-Up">
            <i class="fa-solid fa-floppy-disk"></i> Simpan
          </button>
        </div>
      </div>

      <!-- Bottom Action Bar (WhatsApp & Detail) -->
      <div style="margin-top:4px; display:flex; gap:8px; align-items:center;">
        <!-- Big WhatsApp Button -->
        <button class="btn-wa-action" style="flex:1; padding:12px 14px;" onclick="openWhatsAppModal(${c.id})">
          <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i> Follow Up via WhatsApp
        </button>

        <button class="btn-sub" style="padding:12px 14px; font-size:12px; border-radius:12px; background:#eff6ff; color:#1d4ed8; font-weight:800; border:1.5px solid #bfdbfe; cursor:pointer;" onclick="openSalesCustomerDetailModal(${c.id})" title="Lihat Informasi Lengkap Customer">
          <i class="fa-solid fa-circle-info"></i> Detail
        </button>
        <a href="tel:${c.phone}" class="btn-sub" style="padding:12px 14px; font-size:13px; border-radius:12px; background:#f1f5f9; color:#0f172a; text-decoration:none; border:1.5px solid #e2e8f0; display:flex; align-items:center; justify-content:center;" title="Telepon Langsung">
          <i class="fa-solid fa-phone" style="color:#10b981;"></i>
        </a>
      </div>
    </div>
  `;
}

// -------------------------------------------------------------
// PROGRESSIVE CHUNKED CARDS VIEW (INSTANT RENDER + INFINITE SCROLL)
// -------------------------------------------------------------
function renderCustomerCardsView(list, append = false) {
  const grid = document.getElementById('followupCardsGrid');
  if (!grid) return;

  if (list.length === 0) {
    if (followupState.customers.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:60px 20px; background:#fff; border-radius:var(--fu-radius-lg); border:1.5px dashed #cbd5e1; box-shadow:var(--fu-shadow-card);">
          <div style="width:64px; height:64px; border-radius:50%; background:#eff6ff; color:#2563eb; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; font-size:26px; box-shadow:0 4px 12px rgba(37,99,235,0.15);">
            <i class="fa-solid fa-user-clock"></i>
          </div>
          <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin-bottom:6px;">Belum Ada Database Prospek yang Ditugaskan</h3>
          <p style="font-size:13px; color:#64748b; max-width:480px; margin:0 auto 18px; line-height:1.5;">
            Supervisor (SPV) belum membagikan tugas follow-up database ke akun Anda. Database prospek akan otomatis muncul di sini setelah ditugaskan oleh SPV melalui menu <strong>Database Follow-Up (CRM) SPV</strong>.
          </p>
          <button type="button" class="btn-fu btn-fu-secondary" onclick="loadFollowupCustomers()" style="padding:10px 20px; font-size:12px;">
            <i class="fa-solid fa-rotate"></i> Cek Ulang Penugasan Database
          </button>
        </div>
      `;
    } else {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:50px 20px; background:#fff; border-radius:var(--fu-radius-lg); border:1.5px solid #e2e8f0; box-shadow:var(--fu-shadow-card);">
          <div style="width:54px; height:54px; border-radius:50%; background:#f1f5f9; color:#94a3b8; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:22px;">
            <i class="fa-solid fa-check-double"></i>
          </div>
          <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin-bottom:4px;">Tidak Ada Customer Pada Filter Ini</h4>
          <p style="font-size:12px; color:#64748b; margin:0;">Semua customer telah diproses atau belum ada data yang sesuai.</p>
        </div>
      `;
    }
    return;
  }

  // Remove existing load more container if appending
  const oldLoadMore = document.getElementById('loadMoreCardsContainer');
  if (oldLoadMore) oldLoadMore.remove();

  const startIdx = append ? Math.max(0, followupState.renderLimit - 24) : 0;
  const currentSlice = list.slice(startIdx, followupState.renderLimit);

  let htmlChunk = currentSlice.map((c, i) => renderSingleCustomerCardHtml(c, startIdx + i + 1)).join('');

  if (append) {
    grid.insertAdjacentHTML('beforeend', htmlChunk);
  } else {
    grid.innerHTML = htmlChunk;
  }

  // Add Load More trigger if there are remaining cards
  if (list.length > followupState.renderLimit) {
    const remaining = list.length - followupState.renderLimit;
    const loadMoreHtml = `
      <div class="load-more-container" id="loadMoreCardsContainer">
        <button type="button" class="btn-load-more-fu" onclick="loadMoreCards()">
          <i class="fa-solid fa-angles-down"></i> Tampilkan 24 Customer Berikutnya (Tersisa ${remaining})
        </button>
      </div>
    `;
    grid.insertAdjacentHTML('beforeend', loadMoreHtml);

    // Setup auto-load on scroll via IntersectionObserver
    initAutoScrollObserver();
  }
}

let autoScrollObserver = null;
function initAutoScrollObserver() {
  const sentinel = document.getElementById('loadMoreCardsContainer');
  if (!sentinel) return;

  if (autoScrollObserver) {
    autoScrollObserver.disconnect();
  }

  autoScrollObserver = new IntersectionObserver((entries) => {
    if (entries[0] && entries[0].isIntersecting) {
      loadMoreCards();
    }
  }, { rootMargin: '250px' });

  autoScrollObserver.observe(sentinel);
}

function loadMoreCards() {
  if (followupState.filteredList.length <= followupState.renderLimit) return;
  followupState.renderLimit += 24;
  renderCustomerCardsView(followupState.filteredList, true);
}

function showToastCopy(text) {
  if (typeof showCustomAlert === 'function') {
    showCustomAlert('Tersalin!', `Nomor ${text} telah disalin ke clipboard.`, 'info');
  }
}

function applyQuickNote(customerId, text) {
  const input = document.getElementById(`reasonFu_${customerId}`);
  if (!input) return;

  const currentVal = input.value.trim();
  if (!currentVal) {
    input.value = text;
  } else if (!currentVal.toLowerCase().includes(text.toLowerCase())) {
    input.value = `${currentVal}, ${text}`;
  }

  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (c) {
    c.reason_followup = input.value;
  }

  const btnClear = document.getElementById(`btnClearNote_${customerId}`);
  if (btnClear) {
    btnClear.style.display = input.value.trim() ? 'flex' : 'none';
  }
}

function clearQuickNote(customerId) {
  const input = document.getElementById(`reasonFu_${customerId}`);
  if (input) {
    input.value = '';
  }

  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (c) {
    c.reason_followup = '';
    c.notes = '';
  }

  const btnClear = document.getElementById(`btnClearNote_${customerId}`);
  if (btnClear) {
    btnClear.style.display = 'none';
  }
}

function renderCustomerTableView(list) {
  const tbody = document.getElementById('followupTableTbody');
  if (!tbody) return;

  if (list.length === 0) {
    if (followupState.customers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:60px 20px; color:#64748b;">
            <i class="fa-solid fa-user-clock" style="font-size:36px; margin-bottom:12px; color:#93c5fd;"></i><br>
            <strong style="color:#0f172a; font-size:15px;">Belum Ada Database Prospek yang Ditugaskan</strong>
            <p style="font-size:12px; color:#64748b; margin-top:4px;">Supervisor (SPV) belum membagikan tugas follow-up database ke akun Anda.</p>
          </td>
        </tr>
      `;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" style="text-align:center; padding:50px 20px; color:#94a3b8;">
            <i class="fa-solid fa-folder-open" style="font-size:32px; margin-bottom:8px; color:#cbd5e1;"></i><br>
            <strong style="color:#0f172a;">Tidak ada data customer yang sesuai filter</strong>
          </td>
        </tr>
      `;
    }
    return;
  }

  let html = '';
  list.forEach((c, idx) => {
    const rawName = (c.name || 'Customer').trim();
    const parts = rawName.split(/\s+/);
    let initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : rawName.substring(0, 2).toUpperCase();
    const dateInfo = formatWibDate(c.followup_date);

    const isFollowedUp = (c.followup_status && c.followup_status !== 'Belum Dihubungi') || Boolean(c.followup_date);

    const isConnYes = isFollowedUp && (c.connected === 'TRUE' || c.connected === 'IYA');
    const isConnNo = isFollowedUp && (c.connected === 'FALSE' || c.connected === 'TIDAK');

    const isContYes = isFollowedUp && (c.contacted === 'TRUE' || c.contacted === 'IYA');
    const isContNo = isFollowedUp && (c.contacted === 'FALSE' || c.contacted === 'TIDAK');

    const isProspYes = isFollowedUp && (c.prospect === 'TRUE' || c.prospect === 'IYA');
    const isProspNo = isFollowedUp && (c.prospect === 'FALSE' || c.prospect === 'TIDAK');

    const isSpkYes = isFollowedUp && (c.spk === 'TRUE' || c.spk === 'IYA');
    const isSpkNo = isFollowedUp && (c.spk === 'FALSE' || c.spk === 'TIDAK');

    html += `
      <tr id="customerRow_${c.id}">
        <!-- 0. No. Urut -->
        <td style="text-align:center; vertical-align:middle; width:48px; background:#f8fafc;">
          <span class="fu-row-num-badge">${idx + 1}</span>
        </td>

        <!-- 1. Customer & Kontak -->
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div class="cust-avatar-circle" style="width:36px; height:36px; font-size:12.5px; flex-shrink:0;">${initials}</div>
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:13.5px; line-height:1.2;">${c.name}</div>
              <div style="font-family:monospace; font-size:11.5px; color:#059669; font-weight:700; margin-top:2px;">
                <a href="https://wa.me/${c.phone}" target="_blank" onclick="sessionStorage.setItem('last_active_fu_customer_id', ${c.id})" style="color:inherit; text-decoration:none;">
                  <i class="fa-brands fa-whatsapp"></i> +${c.phone}
                </a>
              </div>
              ${c.district ? `<div style="font-size:10.5px; color:#64748b; margin-top:2px;"><i class="fa-solid fa-location-dot" style="font-size:9.5px;"></i> Kec. ${c.district}</div>` : ''}
            </div>
          </div>
        </td>

        <!-- 2. Unit Mobil & Usia -->
        <td>
          <div style="font-weight:900; color:#d7123a; font-size:13px;">
            🎯 ${c.recommended_model || c.car_model}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:3px;">
            ${c.last_car_model ? `<span class="badge-last-car" style="font-size:9.5px;">Saat ini: <strong>${c.last_car_model}</strong></span>` : ''}
            ${c.car_age ? `<span class="badge-car-age" style="font-size:9.5px;"><i class="fa-solid fa-clock"></i> ${c.car_age}</span>` : ''}
          </div>
          ${(c.alt_model_2 || c.alt_model_3) ? `
            <div style="font-size:10px; color:#64748b; margin-top:2px;">
              Alt: ${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(', ')}
            </div>
          ` : ''}
        </td>

        <!-- 3. Klaster & Dealer -->
        <td>
          ${c.cluster_name ? `<div><span class="badge-cluster-pill" style="font-size:10px; margin-bottom:2px;">🏷️ ${c.cluster_name}</span></div>` : ''}
          ${c.priority ? `<div><span class="badge-priority-pill" style="font-size:9.5px; margin-bottom:2px;">⚡ ${c.priority}</span></div>` : ''}
          ${c.outlet_do ? `<div style="font-size:9.5px; color:#64748b;"><i class="fa-solid fa-building"></i> ${c.outlet_do}</div>` : ''}
        </td>

        <!-- 4. 4 Pertanyaan TAM Stepped -->
        <td>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:4px;">
            <!-- Conn -->
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:2px 6px;">
              <span style="font-size:10px; font-weight:700;">1.Conn:</span>
              <div class="fu-segmented-btn-group" id="tbl_group_connected_${c.id}" style="padding:1.5px;">
                <button type="button" class="fu-tog-btn ${isConnYes ? 'active-yes' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'connected', 'TRUE')">Ya</button>
                <button type="button" class="fu-tog-btn ${isConnNo ? 'active-no' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'connected', 'FALSE')">Tidak</button>
              </div>
            </div>
            <!-- Cont -->
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:2px 6px;">
              <span style="font-size:10px; font-weight:700;">2.Cont:</span>
              <div class="fu-segmented-btn-group" id="tbl_group_contacted_${c.id}" style="padding:1.5px;">
                <button type="button" class="fu-tog-btn ${isContYes ? 'active-yes' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'contacted', 'TRUE')">Ya</button>
                <button type="button" class="fu-tog-btn ${isContNo ? 'active-no' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'contacted', 'FALSE')">Tidak</button>
              </div>
            </div>
            <!-- Prosp -->
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:2px 6px;">
              <span style="font-size:10px; font-weight:700;">3.Prosp:</span>
              <div class="fu-segmented-btn-group" id="tbl_group_prospect_${c.id}" style="padding:1.5px;">
                <button type="button" class="fu-tog-btn ${isProspYes ? 'active-yes' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'prospect', 'TRUE')">Ya</button>
                <button type="button" class="fu-tog-btn ${isProspNo ? 'active-no' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'prospect', 'FALSE')">Tidak</button>
              </div>
            </div>
            <!-- SPK -->
            <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:2px 6px;">
              <span style="font-size:10px; font-weight:800; color:#d7123a;">4.SPK:</span>
              <div class="fu-segmented-btn-group" id="tbl_group_spk_${c.id}" style="padding:1.5px;">
                <button type="button" class="fu-tog-btn ${isSpkYes ? 'active-yes' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'spk', 'TRUE')">Ya</button>
                <button type="button" class="fu-tog-btn ${isSpkNo ? 'active-no' : ''}" style="padding:2px 6px; font-size:9px;" onclick="setFuToggle(${c.id}, 'spk', 'FALSE')">Tidak</button>
              </div>
            </div>
          </div>
        </td>

        <!-- 5. Remarks & Status FU -->
        <td>
          <select id="tbl_remarks_${c.id}" class="form-control" style="font-size:11px; font-weight:700; padding:4px 6px; border-radius:6px; margin-bottom:4px;" onchange="handleRemarksChange(${c.id}, this.value)">
            <option value="">-- Remarks --</option>
            <option value="Customer janjian" ${c.remarks === 'Customer janjian' ? 'selected' : ''}>🟡 Customer janjian</option>
            <option value="Customer menolak" ${c.remarks === 'Customer menolak' ? 'selected' : ''}>🔴 Customer menolak</option>
            <option value="Customer pending" ${c.remarks === 'Customer pending' ? 'selected' : ''}>🟢 Customer pending</option>
            <option value="Customer tertarik" ${c.remarks === 'Customer tertarik' ? 'selected' : ''}>🔵 Customer tertarik</option>
            <option value="Customer tidak aktif" ${c.remarks === 'Customer tidak aktif' ? 'selected' : ''}>⚪ Customer tidak aktif</option>
            <option value="Customer tidak diangkat" ${c.remarks === 'Customer tidak diangkat' ? 'selected' : ''}>⚫ Customer tidak diangkat</option>
            <option value="SPK berhasil" ${c.remarks === 'SPK berhasil' ? 'selected' : ''}>🏆 SPK berhasil</option>
          </select>
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:10px; color:#64748b;">
            <span>FU: <strong id="tbl_status_txt_${c.id}" style="color:${c.sales_fu_status === 'Closed' ? '#ef4444' : '#2563eb'};">${c.sales_fu_status || 'Open'}</strong></span>
            <span>${dateInfo.isRecorded ? dateInfo.formatted : '-'}</span>
          </div>
        </td>

        <!-- 6. Aksi -->
        <td style="text-align:right;">
          <div style="display:flex; justify-content:flex-end; gap:4px;">
            <button id="btnSaveFu_${c.id}" class="btn-fu btn-fu-emerald" style="padding:6px 9px; font-size:11px; border-radius:8px; background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#fff; border:none;" onclick="saveSalesFuManual(${c.id})" title="Simpan Data Follow-Up">
              <i class="fa-solid fa-floppy-disk"></i> Simpan
            </button>
            <button class="btn-fu btn-fu-emerald" style="padding:6px 10px; font-size:11px; border-radius:8px;" onclick="openWhatsAppModal(${c.id})" title="Chat WA">
              <i class="fa-brands fa-whatsapp"></i> WA
            </button>
            <button class="btn-fu btn-fu-secondary" style="padding:6px 8px; font-size:11px; border-radius:8px;" onclick="openSalesCustomerDetailModal(${c.id})" title="Detail Prospek">
              <i class="fa-solid fa-circle-info"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function setTableRemarks(customerId, remarks) {
  handleRemarksChange(customerId, remarks);
}

// -------------------------------------------------------------
// INTERACTIVE TAM FOLLOW-UP ACTIONS & AUTO-SAVE WITH SMART CASCADING
// -------------------------------------------------------------
function updateToggleButtonsUI(customerId, field, value) {
  // Update card group
  const group = document.getElementById(`group_${field}_${customerId}`);
  if (group) {
    const btns = group.querySelectorAll('.fu-tog-btn');
    if (btns.length >= 2) {
      btns[0].classList.remove('active-yes');
      btns[1].classList.remove('active-no');
      if (value === 'TRUE' || value === 'IYA') {
        btns[0].classList.add('active-yes');
      } else if (value === 'FALSE' || value === 'TIDAK') {
        btns[1].classList.add('active-no');
      }
    }
  }

  // Update table group
  const tblGroup = document.getElementById(`tbl_group_${field}_${customerId}`);
  if (tblGroup) {
    const btns = tblGroup.querySelectorAll('.fu-tog-btn');
    if (btns.length >= 2) {
      btns[0].classList.remove('active-yes');
      btns[1].classList.remove('active-no');
      if (value === 'TRUE' || value === 'IYA') {
        btns[0].classList.add('active-yes');
      } else if (value === 'FALSE' || value === 'TIDAK') {
        btns[1].classList.add('active-no');
      }
    }
  }
}

function handleReasonInput(customerId, value) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (c) {
    c.reason_followup = value;
  }
  const btnClear = document.getElementById(`btnClearNote_${customerId}`);
  if (btnClear) {
    btnClear.style.display = value.trim() ? 'flex' : 'none';
  }
}

// -------------------------------------------------------------
// OTOMATISASI REMARKS & STATUS CASCADING
// -------------------------------------------------------------
function handleRemarksChange(customerId, value) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (!c) return;
  c.remarks = value;

  // Sync DOM Selects (Card View & Table View)
  const selCard = document.getElementById(`remarks_${customerId}`);
  if (selCard && selCard.value !== value) selCard.value = value;
  const selTbl = document.getElementById(`tbl_remarks_${customerId}`);
  if (selTbl && selTbl.value !== value) selTbl.value = value;

  // OTOMATISASI LOGIKA PILIHAN REMARKS KE STATUS & TAM 4-PILAR:
  if (value === 'Customer tidak aktif') {
    c.connected = 'FALSE';
    c.contacted = 'FALSE';
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
  } else if (value === 'Customer tidak diangkat') {
    c.connected = 'TRUE';
    c.contacted = 'FALSE';
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
  } else if (value === 'Customer pending' || value === 'Tunggu gajian/dana' || value === 'Cek harga mobil lama') {
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
    c.sales_fu_status = 'Open';
  } else if (value === 'Customer tertarik' || value === 'Customer janjian' || value === 'Minta simulasi kredit' || value === 'Janjian test drive') {
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.prospect = 'TRUE';
    c.spk = 'FALSE';
    c.sales_fu_status = 'Open';
  } else if (value === 'SPK berhasil') {
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.prospect = 'TRUE';
    c.spk = 'TRUE';
    c.sales_fu_status = 'Closed';
  } else if (value === 'Customer menolak' || value === 'Beli di dealer/merk lain') {
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
    c.sales_fu_status = 'Closed';
  }

  // Update Status Select & Text UI
  const selStatus = document.getElementById(`salesFuStatus_${customerId}`);
  if (selStatus && c.sales_fu_status) selStatus.value = c.sales_fu_status;
  const tblStatusTxt = document.getElementById(`tbl_status_txt_${customerId}`);
  if (tblStatusTxt && c.sales_fu_status) {
    tblStatusTxt.textContent = c.sales_fu_status;
    tblStatusTxt.style.color = c.sales_fu_status === 'Closed' ? '#ef4444' : '#2563eb';
  }

  // Update semua 4 tombol TAM (Iya / Tidak) di Card & Table
  ['connected', 'contacted', 'prospect', 'spk'].forEach(f => {
    updateToggleButtonsUI(customerId, f, c[f]);
  });
}

function handleStatusChange(customerId, value) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (c) {
    c.sales_fu_status = value;
    const tblStatusTxt = document.getElementById(`tbl_status_txt_${customerId}`);
    if (tblStatusTxt) {
      tblStatusTxt.textContent = value;
      tblStatusTxt.style.color = value === 'Closed' ? '#ef4444' : '#2563eb';
    }
  }
}

// -------------------------------------------------------------
// OTOMATISASI REMARKS SAAT TOMBOL TAM 4-PILAR DIKLIK
// -------------------------------------------------------------
function setFuToggle(customerId, field, value) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (!c) return;

  c[field] = value;

  // SMART AUTOMATIC CASCADING LOGIC:
  if (field === 'connected' && value === 'FALSE') {
    // 1. Kalo connected TIDAK -> otomatis remarks 'Customer tidak aktif'
    c.contacted = 'FALSE';
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
    c.remarks = 'Customer tidak aktif';
  } else if (field === 'connected' && value === 'TRUE') {
    // Kalo connected IYA -> jika sebelumnya tidak aktif, ubah ke pending
    if (!c.remarks || c.remarks === 'Customer tidak aktif') {
      c.remarks = 'Customer pending';
    }
  } else if (field === 'contacted' && value === 'FALSE') {
    // 2. Kalo contacted TIDAK -> otomatis remarks 'Customer tidak diangkat'
    c.prospect = 'FALSE';
    c.spk = 'FALSE';
    c.remarks = 'Customer tidak diangkat';
  } else if (field === 'contacted' && value === 'TRUE') {
    // Kalo contacted IYA -> otomatis connected IYA & remarks 'Customer pending'
    c.connected = 'TRUE';
    if (!c.remarks || c.remarks === 'Customer tidak aktif' || c.remarks === 'Customer tidak diangkat') {
      c.remarks = 'Customer pending';
    }
  } else if (field === 'prospect' && value === 'TRUE') {
    // 3. Kalo prospect IYA -> otomatis connected, contacted & remarks 'Customer tertarik'
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.remarks = 'Customer tertarik';
    c.sales_fu_status = 'Open';
  } else if (field === 'prospect' && value === 'FALSE') {
    // Kalo prospect TIDAK -> spk FALSE & jika sebelumnya tertarik, ubah ke menolak
    c.spk = 'FALSE';
    if (c.remarks === 'Customer tertarik' || c.remarks === 'SPK berhasil') {
      c.remarks = 'Customer menolak';
    }
  } else if (field === 'spk' && value === 'TRUE') {
    // 4. Kalo SPK IYA -> otomatis closing deal, remarks 'SPK berhasil', status Closed
    c.connected = 'TRUE';
    c.contacted = 'TRUE';
    c.prospect = 'TRUE';
    c.remarks = 'SPK berhasil';
    c.sales_fu_status = 'Closed';
  } else if (field === 'spk' && value === 'FALSE') {
    // Kalo SPK TIDAK -> jika sebelumnya SPK berhasil, kembalikan ke tertarik / pending & status Open
    if (c.remarks === 'SPK berhasil') {
      c.remarks = (c.prospect === 'TRUE') ? 'Customer tertarik' : 'Customer pending';
      c.sales_fu_status = 'Open';
    }
  }

  // Update DOM Selects (Card View & Table View)
  const selRemarks = document.getElementById(`remarks_${customerId}`);
  if (selRemarks && c.remarks) selRemarks.value = c.remarks;
  const selTblRemarks = document.getElementById(`tbl_remarks_${customerId}`);
  if (selTblRemarks && c.remarks) selTblRemarks.value = c.remarks;

  const selStatus = document.getElementById(`salesFuStatus_${customerId}`);
  if (selStatus && c.sales_fu_status) selStatus.value = c.sales_fu_status;
  const tblStatusTxt = document.getElementById(`tbl_status_txt_${customerId}`);
  if (tblStatusTxt && c.sales_fu_status) {
    tblStatusTxt.textContent = c.sales_fu_status;
    tblStatusTxt.style.color = c.sales_fu_status === 'Closed' ? '#ef4444' : '#2563eb';
  }

  // Update seluruh 4 segmented button UI secara realtime
  ['connected', 'contacted', 'prospect', 'spk'].forEach(f => {
    updateToggleButtonsUI(customerId, f, c[f]);
  });
}

async function saveSalesFuManual(customerId) {
  const saveBtn = document.getElementById(`btnSaveFu_${customerId}`);
  const origHtml = saveBtn ? saveBtn.innerHTML : '<i class="fa-solid fa-floppy-disk"></i> Simpan';

  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Menyimpan...';
  }

  try {
    await sendSaveSalesFu(customerId, true);
    if (saveBtn) {
      saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> Tersimpan!';
      saveBtn.style.background = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
      setTimeout(() => {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.innerHTML = origHtml;
          saveBtn.style.background = '';
        }
      }, 1500);
    }
  } catch (e) {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.innerHTML = origHtml;
    }
  }
}

async function sendSaveSalesFu(customerId, showAlert = true) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (!c) return;

  const remarks = document.getElementById(`remarks_${customerId}`)?.value ?? (c.remarks || '');
  const salesFuStatus = document.getElementById(`salesFuStatus_${customerId}`)?.value ?? (c.sales_fu_status || 'Open');
  const reasonFu = document.getElementById(`reasonFu_${customerId}`)?.value ?? (c.reason_followup || '');

  c.remarks = remarks;
  c.sales_fu_status = salesFuStatus;
  c.reason_followup = reasonFu;

  const payload = {
    id: customerId,
    sales_id: followupState.salesInfo ? followupState.salesInfo.id : null,
    connected: c.connected || '',
    contacted: c.contacted || '',
    prospect: c.prospect || '',
    spk: c.spk || '',
    remarks: remarks,
    sales_fu_status: salesFuStatus,
    reason_followup: reasonFu
  };

  try {
    const res = await fetch('../api/api_followup.php?action=save_sales_followup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data && data.success) {
      c.followup_date = data.followup_date;
      c.followup_status = data.status || c.followup_status;
      c.sales_fu_status = data.sales_fu_status || c.sales_fu_status;

      // Update date badge with Indonesian WIB format
      const badge = document.getElementById(`fuDateBadge_${customerId}`);
      if (badge) {
        const dateInfo = formatWibDate(data.followup_date);
        badge.textContent = dateInfo.text;
        badge.className = 'fu-date-badge recorded';
      }

      // Update card status pill
      const statusPill = document.getElementById(`custCardStatusPill_${customerId}`);
      if (statusPill) {
        let badgeHtml = '';
        if (c.followup_status === 'Deal / Selesai') {
          badgeHtml = `<span class="badge-status-pill deal" style="background:#dcfce7; color:#15803d; border:1px solid #86efac; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-trophy"></i> Deal</span>`;
        } else if (c.followup_status === 'Tertarik / Jadwal Servis') {
          badgeHtml = `<span class="badge-status-pill interested" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-thumbs-up"></i> Tertarik</span>`;
        } else if (c.followup_status === 'Menunggu Respon') {
          badgeHtml = `<span class="badge-status-pill waiting" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-clock"></i> Respon</span>`;
        } else if (c.followup_status === 'Tidak Tertarik') {
          badgeHtml = `<span class="badge-status-pill" style="background:#fee2e2; color:#dc2626; border:1px solid #fca5a5; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-ban"></i> Menolak</span>`;
        }
        statusPill.innerHTML = badgeHtml;
      }

      // Update Hero KPI stats and live filter badges
      updateHeroStats();

      // Save active customer ID into sessionStorage
      sessionStorage.setItem('last_active_fu_customer_id', customerId);

      // Pulse card highlight
      const card = document.getElementById(`customerCard_${customerId}`);
      if (card) {
        card.classList.remove('card-just-followed-up');
        void card.offsetWidth;
        card.classList.add('card-just-followed-up');
        setTimeout(() => card.classList.remove('card-just-followed-up'), 5000);
      }

      // If user is currently filtering by "Belum Di-Follow Up", smooth fade out card so it moves over to "Sudah Di-Follow Up"
      if (followupState.activeStatus === 'belum_fu' || followupState.activeStatus === 'Belum Dihubungi') {
        if (card) {
          card.style.transition = 'all 0.35s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            renderCustomerCards(true);
          }, 380);
        } else {
          renderCustomerCards(true);
        }
      }

      // Quick toast notification on manual save
      if (showAlert && typeof showCustomAlert === 'function') {
        showCustomAlert('Data Berhasil Disimpan!', `Hasil follow-up untuk ${c.name} telah disimpan ke database (Status: ${c.followup_status}). Waktu: ${formatWibDate(data.followup_date).formatted}`, 'success');
      }
    }
  } catch (e) {
    console.error('Error saving sales FU:', e);
    if (showAlert && typeof showCustomAlert === 'function') {
      showCustomAlert('Gagal Menyimpan', 'Terjadi kesalahan koneksi saat menyimpan follow up.', 'error');
    }
  }
}

// -------------------------------------------------------------
// SALES CUSTOMER DETAIL MODAL
// -------------------------------------------------------------
function openSalesCustomerDetailModal(customerId) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (!c) {
    console.error('Sales customer not found for id', customerId);
    return;
  }

  document.getElementById('modalSalesCustDetail')?.remove();

  const html = `
    <div class="modal-overlay" id="modalSalesCustDetail" onclick="closeSalesCustDetailModal()">
      <div class="modal-content" style="max-width:540px; border-radius:var(--fu-radius-lg, 16px); padding:16px 18px;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:3px;">
              <i class="fa-solid fa-id-badge"></i> Data Lengkap Pelanggan
            </div>
            <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin:0;" id="scdName">-</h3>
          </div>
          <button class="btn-close-modal" onclick="closeSalesCustDetailModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div id="scdModalBody"></div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  document.getElementById('scdName').textContent = c.name;
  const body = document.getElementById('scdModalBody');
  body.innerHTML = `
    <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#fff; border-radius:12px; padding:14px; margin-bottom:14px;">
      <div style="font-size:11px; color:#93c5fd; font-weight:700; text-transform:uppercase;">Target Rekomendasi Upgrade TAM:</div>
      <div style="font-size:17px; font-weight:900; color:#fff; margin-top:2px;">🚗 ${c.recommended_model || c.car_model}</div>
      ${(c.alt_model_2 || c.alt_model_3) ? `
        <div style="font-size:11.5px; color:#cbd5e1; margin-top:4px;">
          Alternatif: <strong>${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(' • ')}</strong>
        </div>
      ` : ''}
    </div>

    <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:12px; font-size:12px; color:#334155; margin-bottom:14px; display:flex; flex-direction:column; gap:6px;">
      <div style="display:flex; justify-content:space-between;">
        <span>Kendaraan Saat Ini:</span>
        <strong style="color:#0f172a;">${c.last_car_model || '-'} ${c.car_age ? `(${c.car_age})` : ''}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Nomor Rangka (VIN):</span>
        <strong style="font-family:monospace; color:#0f172a;">${c.vin || '-'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Outlet DO Pembelian:</span>
        <strong>${c.outlet_do || 'TUNAS TOYOTA KIARA CONDONG'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Kepatuhan Servis:</span>
        <strong style="color:#059669;">${c.service_compliance || '0%'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Klaster Profil:</span>
        <strong style="color:#1d4ed8;">${c.cluster_name || '-'}</strong>
      </div>
      <div style="display:flex; justify-content:space-between;">
        <span>Kecamatan:</span>
        <strong>${c.district ? `Kec. ${c.district}` : '-'}</strong>
      </div>
    </div>

    <div style="display:flex; gap:8px;">
      <button class="btn-wa-action" style="flex:1; padding:11px;" onclick="closeSalesCustDetailModal(); openWhatsAppModal(${c.id});">
        <i class="fa-brands fa-whatsapp"></i> Chat WhatsApp
      </button>
      <a href="tel:${c.phone}" class="btn-sub" style="padding:11px 16px; border-radius:10px; background:#f1f5f9; color:#0f172a; text-decoration:none; display:flex; align-items:center; justify-content:center;">
        <i class="fa-solid fa-phone" style="color:#10b981;"></i>
      </a>
      <button class="btn-sub" style="padding:11px 16px; border-radius:10px; background:#f1f5f9; font-weight:700;" onclick="closeSalesCustDetailModal()">
        Tutup
      </button>
    </div>
  `;

  const modal = document.getElementById('modalSalesCustDetail');
  if (modal) {
    modal.classList.add('active', 'show');
    modal.style.display = 'flex';
  }
}

function closeSalesCustDetailModal() {
  const modal = document.getElementById('modalSalesCustDetail');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function closeWhatsAppModal() {
  const modal = document.getElementById('modalWhatsAppFollowup');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

// -------------------------------------------------------------
// WHATSAPP SEND MODAL WITH LIVE CHAT PREVIEW & VARIABLE CHIPS
// -------------------------------------------------------------
let activeCustomerForWA = null;

async function openWhatsAppModal(customerId) {
  const cust = followupState.customers.find(c => c.id === customerId);
  if (!cust) return;
  activeCustomerForWA = cust;

  // Always recreate with fresh template chips & sales identity
  document.getElementById('modalWhatsAppFollowup')?.remove();
  if (true) {
    const modalHtml = `
      <div class="modal-overlay" id="modalWhatsAppFollowup" onclick="closeWhatsAppModal()">
        <div class="modal-content" style="max-width:540px; border-radius:var(--fu-radius-lg, 16px); padding:16px 18px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:10px; margin-bottom:10px;">
            <h3 style="display:flex; align-items:center; gap:8px; color:#059669; font-size:15px; font-weight:800; margin:0;">
              <i class="fa-brands fa-whatsapp" style="font-size:20px;"></i> Follow Up WhatsApp Customer
            </h3>
            <button class="btn-close-modal" onclick="closeWhatsAppModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <!-- Customer Banner Header -->
          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#fff; border-radius:12px; padding:10px 14px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
              <strong style="font-size:14px;" id="waCustName">-</strong>
              <span style="font-family:monospace; color:#6ee7b7; font-weight:800; font-size:12.5px;" id="waCustPhone">-</span>
            </div>
            <div style="font-size:11.5px; color:rgba(255,255,255,0.9); margin-top:4px;" id="waCustCar">-</div>
          </div>

          <!-- Template Selector Header with Custom Template Buttons -->
          <div class="form-group" style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px; flex-wrap:wrap; gap:4px;">
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin:0;">Pilih Template WhatsApp:</label>
              <div style="display:flex; align-items:center; gap:5px;">
                <button type="button" class="btn-fu btn-fu-secondary" style="padding:2px 8px; font-size:10.5px; border-radius:6px; background:#f0fdf4; color:#15803d; border:1px solid #86efac;" onclick="openCustomTemplateModal()" title="Buat template baru dan simpan ke database">
                  <i class="fa-solid fa-plus"></i> + Template Kustom
                </button>
                <button type="button" class="btn-fu btn-fu-secondary" style="padding:2px 8px; font-size:10.5px; border-radius:6px;" onclick="openTemplateManagerModalSales()" title="Lihat & kelola daftar template kustom">
                  <i class="fa-solid fa-sliders"></i> Kelola
                </button>
              </div>
            </div>
            <select class="form-control" id="waTemplateSelect" style="font-size:12px; font-weight:600; border-radius:8px; padding:6px 10px;" onchange="handleTemplateSelectChange(this.value)">
            </select>
          </div>

          <!-- Variable Chips Quick Insert Bar -->
          <div style="margin-bottom:8px;">
            <div style="font-size:10.5px; font-weight:700; color:#64748b; margin-bottom:3px;">Klik tag untuk menyisipkan variabel otomatis:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <button type="button" class="variable-chip-btn" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-weight:800;" onclick="insertVariableToWA('{nama_sales}')">👤 {nama_sales}</button>
              <button type="button" class="variable-chip-btn" onclick="insertVariableToWA('{nama_customer}')">{nama_customer}</button>
              <button type="button" class="variable-chip-btn" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0; font-weight:800;" onclick="insertVariableToWA('{mobil_saat_ini}')" title="Mobil yang dimiliki customer saat ini (cth: Avanza)">🚗 {mobil_saat_ini}</button>
              <button type="button" class="variable-chip-btn" style="background:#fff1f2; color:#be123c; border-color:#fecdd3; font-weight:800;" onclick="insertVariableToWA('{model_rekomendasi}')" title="Target upgrade TAM (cth: Hilux / Rush)">🎯 {model_rekomendasi}</button>
              <button type="button" class="variable-chip-btn" onclick="insertVariableToWA('{usia_kendaraan}')">{usia_kendaraan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertVariableToWA('{kecamatan}')">{kecamatan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertVariableToWA('{dealer}')">{dealer}</button>
            </div>
          </div>

          <!-- Live WhatsApp Bubble Preview -->
          <div class="wa-chat-preview" style="max-height:110px; overflow-y:auto; padding:8px 12px; margin:6px 0;">
            <div class="wa-bubble-sent" id="waLiveBubble" style="font-size:11.5px; line-height:1.45; padding:6px 10px;">-</div>
          </div>

          <!-- Message Textarea with Save As Template Action -->
          <div class="form-group" style="margin-bottom:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin:0;">Edit Isi Pesan WhatsApp:</label>
              <button type="button" style="background:transparent; border:none; color:#2563eb; font-size:10.5px; font-weight:800; cursor:pointer; padding:0; display:inline-flex; align-items:center; gap:4px;" onclick="saveCurrentMessageAsTemplate()" title="Simpan teks yang sedang diedit ini sebagai template kustom baru">
                <i class="fa-solid fa-floppy-disk"></i> Simpan Jadi Template Baru
              </button>
            </div>
            <textarea class="form-control" id="waMessageText" rows="3" style="font-size:12px; line-height:1.4; font-family:inherit; border-radius:8px; min-height:60px; max-height:130px; padding:6px 10px;" oninput="updateLiveBubble(this.value)"></textarea>
          </div>

          <!-- Next Follow-up Status -->
          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:3px; display:block;">Perbarui Status Setelah Kirim:</label>
            <select class="form-control" id="waNextStatus" style="font-size:12px; font-weight:700; border-radius:8px; padding:6px 10px;">
              <option value="Menunggu Respon" selected>🟡 Menunggu Respon</option>
              <option value="Tertarik / Jadwal Servis">🔵 Tertarik / Jadwal Servis</option>
              <option value="Deal / Selesai">🟢 Deal / Selesai</option>
            </select>
          </div>

          <button class="btn-wa-action" style="padding:11px 16px; font-size:13px; border-radius:10px;" onclick="executeSendWhatsApp()">
            <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i> Buka WhatsApp &amp; Kirim Sekarang
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  // Populate Customer Data into Modal with clear Distinction between Mobil Saat Ini & Target Upgrade
  document.getElementById('waCustName').textContent = cust.name;
  document.getElementById('waCustPhone').textContent = `+${cust.phone}`;
  
  const lastCarClean = (cust.last_car_model && cust.last_car_model !== '-' && cust.last_car_model !== 'NO DATA') ? cust.last_car_model : '';
  const targetCarClean = cust.recommended_model || cust.car_model || '-';

  document.getElementById('waCustCar').innerHTML = `
    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:2px;">
      <span style="background:rgba(255,255,255,0.15); padding:2px 7px; border-radius:6px;">
        <i class="fa-solid fa-car"></i> Mobil Saat Ini: <strong>${lastCarClean || 'Tidak Ada Data'}</strong> ${cust.car_age ? `(${cust.car_age})` : ''}
      </span>
      <i class="fa-solid fa-arrow-right" style="font-size:10px; opacity:0.8;"></i>
      <span style="background:rgba(215,18,58,0.3); border:1px solid rgba(215,18,58,0.5); padding:2px 7px; border-radius:6px; font-weight:800;">
        <i class="fa-solid fa-bullseye"></i> Target Upgrade: <strong>${targetCarClean}</strong>
      </span>
      ${cust.district ? `<span style="opacity:0.85;">• Kec. ${cust.district}</span>` : ''}
    </div>
  `;

  // Render dropdown with persistent last used template selection
  const lastTmplId = localStorage.getItem('sft_last_template_id');
  const activeTmplId = renderTemplateDropdownOptions(lastTmplId);

  applyWhatsAppTemplate(activeTmplId);
  const modalWA = document.getElementById('modalWhatsAppFollowup');
  if (modalWA) {
    modalWA.classList.add('active');
    modalWA.classList.add('show');
    modalWA.style.display = 'flex';
  }
}

/**
 * Render template dropdown options grouped by Standard vs Custom
 * Returns the effective selected template ID
 */
function renderTemplateDropdownOptions(preferredId = null) {
  const tmplSelect = document.getElementById('waTemplateSelect');
  if (!tmplSelect) return null;

  tmplSelect.innerHTML = '';

  const allTemplates = followupState.templates || [];
  const defaultTemplates = allTemplates.filter(t => (t.is_default == 1 || !t.sales_id));
  const customTemplates = allTemplates.filter(t => (t.is_default != 1 && (t.sales_id || t.created_by || t.category === 'kustom')));

  // Determine which template to select
  let selectedId = preferredId;
  const exists = allTemplates.some(t => String(t.id) === String(selectedId));
  if (!exists) {
    const def = allTemplates.find(t => t.is_default == 1) || allTemplates[0];
    selectedId = def ? def.id : null;
  }

  // 1. Group: Template Standar Toyota
  if (defaultTemplates.length > 0) {
    const groupStd = document.createElement('optgroup');
    groupStd.label = '📋 Template Standar Toyota';
    defaultTemplates.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = t.title;
      if (String(t.id) === String(selectedId)) opt.selected = true;
      groupStd.appendChild(opt);
    });
    tmplSelect.appendChild(groupStd);
  }

  // 2. Group: Template Kustom Sales
  if (customTemplates.length > 0) {
    const groupCust = document.createElement('optgroup');
    groupCust.label = '⭐ Template Kustom Anda';
    customTemplates.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `⭐ ${t.title} ${t.created_by ? `(${t.created_by})` : ''}`;
      if (String(t.id) === String(selectedId)) opt.selected = true;
      groupCust.appendChild(opt);
    });
    tmplSelect.appendChild(groupCust);
  }

  // 3. Option to create new custom template
  const optNew = document.createElement('option');
  optNew.value = 'NEW_CUSTOM';
  optNew.textContent = '➕ + Buat Template Kustom Baru...';
  optNew.style.fontWeight = '800';
  optNew.style.color = '#10b981';
  tmplSelect.appendChild(optNew);

  return selectedId;
}

function handleTemplateSelectChange(val) {
  if (val === 'NEW_CUSTOM') {
    // Open template creation modal
    openCustomTemplateModal();
    // Revert select back to previously stored
    const lastId = localStorage.getItem('sft_last_template_id');
    if (lastId) {
      document.getElementById('waTemplateSelect').value = lastId;
    }
  } else {
    localStorage.setItem('sft_last_template_id', val);
    applyWhatsAppTemplate(val);
  }
}

function closeWhatsAppModal() {
  const modalWA = document.getElementById('modalWhatsAppFollowup');
  if (modalWA) {
    modalWA.classList.remove('active');
    modalWA.classList.remove('show');
    modalWA.style.display = 'none';
  }
}

function updateLiveBubble(text) {
  const bubble = document.getElementById('waLiveBubble');
  if (!bubble) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  bubble.innerHTML = `${text}\n<div class="wa-bubble-footer"><span>${time}</span> <i class="fa-solid fa-check-double"></i></div>`;
}

function insertVariableToWA(tag) {
  const textarea = document.getElementById('waMessageText');
  if (!textarea) return;

  loadSalesProfile();
  const salesName = (followupState.salesInfo && followupState.salesInfo.name) 
    ? followupState.salesInfo.name 
    : (localStorage.getItem('namaSales') || 'Sales Tunas Toyota');

  const lastCarClean = (activeCustomerForWA && activeCustomerForWA.last_car_model && activeCustomerForWA.last_car_model !== '-' && activeCustomerForWA.last_car_model !== 'NO DATA') 
    ? activeCustomerForWA.last_car_model 
    : '';

  let insertVal = tag;
  if (tag === '{nama_sales}') insertVal = `*${salesName}*`;
  else if (tag === '{nama_customer}' && activeCustomerForWA) insertVal = `*${activeCustomerForWA.name}*`;
  else if ((tag === '{kendaraan_terakhir}' || tag === '{mobil_saat_ini}' || tag === '{tipe_mobil}') && activeCustomerForWA) {
    insertVal = lastCarClean ? `*${lastCarClean}*` : 'mobil Toyota Bpk/Ibu';
  }
  else if (tag === '{usia_kendaraan}' && activeCustomerForWA) insertVal = activeCustomerForWA.car_age || '3 Tahun';
  else if ((tag === '{model_rekomendasi}' || tag === '{target_upgrade}') && activeCustomerForWA) {
    insertVal = `*${activeCustomerForWA.recommended_model || activeCustomerForWA.car_model || 'Toyota Terbaru'}*`;
  }
  else if (tag === '{cluster}' && activeCustomerForWA) insertVal = activeCustomerForWA.cluster_name || '';
  else if (tag === '{kecamatan}' && activeCustomerForWA) insertVal = activeCustomerForWA.district || '';
  else if (tag === '{dealer}') insertVal = '*Tunas Toyota Kiara Condong*';

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.substring(0, start) + insertVal + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + insertVal.length;
  updateLiveBubble(textarea.value);
}

async function applyWhatsAppTemplate(templateId) {
  if (!activeCustomerForWA) return;
  const tmpl = followupState.templates.find(t => String(t.id) === String(templateId));
  if (!tmpl) return;

  // Persist last used template id in localStorage
  localStorage.setItem('sft_last_template_id', templateId);

  loadSalesProfile();
  const salesName = (followupState.salesInfo && followupState.salesInfo.name) 
    ? followupState.salesInfo.name 
    : (localStorage.getItem('namaSales') || 'Sales Tunas Toyota');
  const salesId = (followupState.salesInfo && followupState.salesInfo.id) 
    ? followupState.salesInfo.id 
    : (parseInt(localStorage.getItem('idSales') || localStorage.getItem('salesId') || 1, 10));

  try {
    const res = await fetch('../api/api_followup.php?action=format_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: activeCustomerForWA.id,
        template_id: tmpl.id,
        sales_id: salesId,
        sales_name: salesName
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('waMessageText').value = data.formatted_text;
      updateLiveBubble(data.formatted_text);
    }
  } catch (e) {
    // Intelligent client-side fallback formatting
    const c = activeCustomerForWA;
    const lastCar = (c.last_car_model && c.last_car_model !== '-' && c.last_car_model !== 'NO DATA') ? c.last_car_model : '';
    const recModel = c.recommended_model || c.car_model || 'Toyota Terbaru';
    const carAge = (c.car_age && c.car_age !== '-' && c.car_age !== 'NO DATA') ? c.car_age : '';
    const district = (c.district && c.district !== '-' && c.district !== 'NO DATA') ? c.district : '';
    const plate = (c.plate_number && c.plate_number !== '-' && c.plate_number !== 'NO DATA') ? c.plate_number : '';

    let mobilSaatIniTeks = lastCar ? `*${lastCar}*` : 'mobil Toyota Bpk/Ibu';
    let teksKendaraanLama = lastCar ? ` *${lastCar}*${carAge ? ` (${carAge})` : ''}` : '';
    let tanyaPengalaman = lastCar 
      ? `Bagaimana pengalaman berkendara dengan mobil *${lastCar}* Bpk/Ibu selama ini? Apakah semuanya berjalan nyaman dan memuaskan?`
      : `Bagaimana pengalaman berkendara dengan mobil Toyota Bpk/Ibu selama ini? Apakah semuanya berjalan nyaman dan memuaskan?`;
    let teksStnkUnit = lastCar ? ` *${lastCar}*${plate ? ` (*${plate}*)` : ''}` : (plate ? ` (*${plate}*)` : '');
    let teksKecamatan = district ? ` di Kec. ${district}` : '';

    let formatted = tmpl.content
      .replace(/\*?{mobil_saat_ini}\*?/gi, mobilSaatIniTeks)
      .replace(/\*?{kendaraan_terakhir}\*?/gi, mobilSaatIniTeks)
      .replace(/\*?{tipe_mobil}\*?/gi, mobilSaatIniTeks)
      .replace(/\*?{model_rekomendasi}\*?/gi, `*${recModel}*`)
      .replace(/\*?{target_upgrade}\*?/gi, `*${recModel}*`)
      .replace(/{tanya_pengalaman_berkendara}/gi, tanyaPengalaman)
      .replace(/{teks_kendaraan_lama}/gi, teksKendaraanLama)
      .replace(/{teks_mobil_saat_ini}/gi, lastCar ? ` *${lastCar}*` : '')
      .replace(/{teks_stnk_unit}/gi, teksStnkUnit)
      .replace(/{teks_kecamatan}/gi, teksKecamatan)
      .replace(/{nama_customer}/gi, c.name || '')
      .replace(/{usia_kendaraan}/gi, carAge || '3 Tahun')
      .replace(/{cluster}/gi, c.cluster_name || '')
      .replace(/{kecamatan}/gi, district)
      .replace(/{nopol}/gi, plate || '-')
      .replace(/{nama_sales}/gi, salesName)
      .replace(/{dealer}/gi, 'Tunas Toyota Kiara Condong')
      .replace(/\*{2,}/g, '*');

    document.getElementById('waMessageText').value = formatted;
    updateLiveBubble(formatted);
  }
}

// -------------------------------------------------------------
// CUSTOM TEMPLATE CREATION & PERSISTENCE ENGINE
// -------------------------------------------------------------

function saveCurrentMessageAsTemplate() {
  const currentMsg = (document.getElementById('waMessageText')?.value || '').trim();
  if (!currentMsg) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pesan Kosong', 'Ketik isi pesan terlebih dahulu sebelum menyimpannya sebagai template.', 'warning');
    } else {
      alert('Ketik pesan terlebih dahulu');
    }
    return;
  }

  // Generalized prefilled content with placeholder variables
  let prefill = currentMsg;
  if (activeCustomerForWA) {
    if (activeCustomerForWA.name) {
      prefill = prefill.replaceAll(`*${activeCustomerForWA.name}*`, '{nama_customer}').replaceAll(activeCustomerForWA.name, '{nama_customer}');
    }
    if (activeCustomerForWA.last_car_model) {
      prefill = prefill.replaceAll(`*${activeCustomerForWA.last_car_model}*`, '{mobil_saat_ini}').replaceAll(activeCustomerForWA.last_car_model, '{mobil_saat_ini}');
    }
    if (activeCustomerForWA.recommended_model) {
      prefill = prefill.replaceAll(`*${activeCustomerForWA.recommended_model}*`, '{model_rekomendasi}').replaceAll(activeCustomerForWA.recommended_model, '{model_rekomendasi}');
    }
  }

  openCustomTemplateModal(prefill, 0, 'Template Kustom ' + new Date().toLocaleDateString('id-ID'));
}

function openCustomTemplateModal(initialContent = '', editId = 0, editTitle = '', editCategory = 'promo') {
  document.getElementById('modalCreateCustomTemplate')?.remove();

  loadSalesProfile();
  const salesName = (followupState.salesInfo && followupState.salesInfo.name) 
    ? followupState.salesInfo.name 
    : (localStorage.getItem('namaSales') || 'Sales');

  const defaultContent = initialContent || `Halo Bpk/Ibu *{nama_customer}*,\n\nSalam hormat dari saya *{nama_sales}* - *{dealer}* 🚗✨\n\n[Tuliskan penawaran promo / follow up spesial Bpk/Ibu di sini]\n\nBoleh saya kirimkan detail lengkapnya Bpk/Ibu? Terima kasih! 🙏`;

  const html = `
    <div class="modal-overlay active" id="modalCreateCustomTemplate" style="display:flex; z-index:99999;" onclick="closeCustomTemplateModal()">
      <div class="modal-content" style="max-width:580px; border-radius:var(--fu-radius-lg, 16px); padding:20px 22px;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:5px; background:#f0fdf4; color:#15803d; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px; border:1px solid #86efac;">
              <i class="fa-solid fa-star"></i> Template Kustom Pribadi
            </div>
            <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin:0;">
              ${editId ? '✏️ Edit Template WhatsApp' : '➕ Buat Template WhatsApp Kustom'}
            </h3>
          </div>
          <button class="btn-close-modal" onclick="closeCustomTemplateModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form onsubmit="handleSaveCustomTemplate(event, ${editId})">
          <!-- Judul Template -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div>
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Judul Template *</label>
              <input type="text" id="custTmplTitle" required class="fu-input" style="font-size:12px; padding:7px 10px;" placeholder="Cth: Promo DP 10 Jt Veloz" value="${escapeHtml(editTitle)}">
            </div>
            <div>
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Kategori Template</label>
              <select id="custTmplCategory" class="fu-select" style="font-size:12px; padding:7px 10px;">
                <option value="promo" ${editCategory === 'promo' ? 'selected' : ''}>🔥 Promo &amp; Diskon</option>
                <option value="tradein" ${editCategory === 'tradein' ? 'selected' : ''}>🔄 Trade-In / Upgrade</option>
                <option value="csat" ${editCategory === 'csat' ? 'selected' : ''}>🥰 CSAT &amp; Tanya Kabar</option>
                <option value="servis" ${editCategory === 'servis' ? 'selected' : ''}>🔧 Servis &amp; Bengkel</option>
                <option value="stnk" ${editCategory === 'stnk' ? 'selected' : ''}>📄 STNK &amp; Pajak</option>
                <option value="kustom" ${editCategory === 'kustom' ? 'selected' : ''}>✨ Follow Up Kustom</option>
              </select>
            </div>
          </div>

          <!-- Variable Chips Quick Insert Bar -->
          <div style="margin-bottom:8px;">
            <div style="font-size:10.5px; font-weight:700; color:#64748b; margin-bottom:3px;">Klik tag untuk menyisipkan variabel otomatis ke template:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <button type="button" class="variable-chip-btn" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-weight:800;" onclick="insertTagToCustomTmpl('{nama_sales}')">👤 {nama_sales}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToCustomTmpl('{nama_customer}')">{nama_customer}</button>
              <button type="button" class="variable-chip-btn" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0; font-weight:800;" onclick="insertTagToCustomTmpl('{mobil_saat_ini}')">🚗 {mobil_saat_ini}</button>
              <button type="button" class="variable-chip-btn" style="background:#fff1f2; color:#be123c; border-color:#fecdd3; font-weight:800;" onclick="insertTagToCustomTmpl('{model_rekomendasi}')">🎯 {model_rekomendasi}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToCustomTmpl('{usia_kendaraan}')">{usia_kendaraan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToCustomTmpl('{kecamatan}')">{kecamatan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToCustomTmpl('{dealer}')">{dealer}</button>
            </div>
          </div>

          <!-- Message Textarea -->
          <div class="form-group" style="margin-bottom:16px;">
            <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Isi Pesan Template *</label>
            <textarea id="custTmplContent" required class="form-control" rows="6" style="font-size:12px; line-height:1.5; font-family:inherit; border-radius:10px;" placeholder="Ketik format pesan WhatsApp...">${escapeHtml(defaultContent)}</textarea>
            <div style="font-size:11px; color:#64748b; margin-top:4px;">
              💡 <em>Variabel di dalam kurung kurawal seperti {nama_customer} akan otomatis digantikan sesuai data prospek saat dikirim.</em>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:11px 18px; font-size:13px;">
              <i class="fa-solid fa-floppy-disk"></i> Simpan Template ke Database
            </button>
            <button type="button" class="btn-fu btn-fu-secondary" style="padding:11px 18px; font-size:13px;" onclick="closeCustomTemplateModal()">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeCustomTemplateModal() {
  const modal = document.getElementById('modalCreateCustomTemplate');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function insertTagToCustomTmpl(tag) {
  const textarea = document.getElementById('custTmplContent');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.substring(0, start) + tag + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + tag.length;
}

async function handleSaveCustomTemplate(e, editId = 0) {
  e.preventDefault();
  const title = (document.getElementById('custTmplTitle')?.value || '').trim();
  const category = document.getElementById('custTmplCategory')?.value || 'promo';
  const content = (document.getElementById('custTmplContent')?.value || '').trim();

  if (!title || !content) {
    alert('Judul dan isi template wajib diisi');
    return;
  }

  loadSalesProfile();
  const salesId = (followupState.salesInfo && followupState.salesInfo.id) ? followupState.salesInfo.id : 1;
  const salesName = (followupState.salesInfo && followupState.salesInfo.name) ? followupState.salesInfo.name : 'Sales';

  try {
    const res = await fetch('../api/api_followup.php?action=save_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editId,
        title: title,
        category: category,
        content: content,
        sales_id: salesId,
        created_by: salesName
      })
    });
    const data = await res.json();
    if (data.success) {
      followupState.templates = data.data || [];
      const savedId = data.saved_id;

      // Close modal
      closeCustomTemplateModal();

      // Update dropdown in WhatsApp modal & select the newly saved template
      if (document.getElementById('waTemplateSelect')) {
        renderTemplateDropdownOptions(savedId);
        localStorage.setItem('sft_last_template_id', savedId);
        if (activeCustomerForWA) {
          applyWhatsAppTemplate(savedId);
        }
      }

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Template Disimpan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      alert(data.message || 'Gagal menyimpan template.');
    }
  } catch (err) {
    console.error('Save template error', err);
    alert('Terjadi kesalahan saat menyimpan template.');
  }
}

// -------------------------------------------------------------
// TEMPLATE MANAGER MODAL (SALES VIEW)
// -------------------------------------------------------------
function openTemplateManagerModalSales() {
  document.getElementById('modalTemplateManagerSales')?.remove();

  const allTemplates = followupState.templates || [];

  let cardsHtml = '';
  allTemplates.forEach(t => {
    const isCustom = (t.is_default != 1 && (t.sales_id || t.created_by || t.category === 'kustom'));
    cardsHtml += `
      <div style="background:#f8fafc; border:1.5px solid ${isCustom ? '#86efac' : '#e2e8f0'}; border-radius:12px; padding:12px 14px; margin-bottom:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:6px;">
            <strong style="font-size:13px; color:#0f172a;">${escapeHtml(t.title)}</strong>
            <span style="font-size:10px; font-weight:800; padding:2px 7px; border-radius:9999px; ${isCustom ? 'background:#dcfce7; color:#15803d;' : 'background:#eff6ff; color:#1d4ed8;'}">
              ${isCustom ? `⭐ Kustom (${t.created_by || 'Sales'})` : '🔒 Standar Toyota'}
            </span>
          </div>
          ${isCustom ? `
            <div style="display:flex; gap:5px;">
              <button class="btn-fu btn-fu-secondary" style="padding:3px 8px; font-size:10.5px; border-radius:6px;" onclick="closeTemplateManagerModalSales(); openCustomTemplateModal(\`${escapeJs(t.content)}\`, ${t.id}, \`${escapeJs(t.title)}\`, \`${escapeJs(t.category)}\`)">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              <button class="btn-fu btn-fu-secondary" style="padding:3px 8px; font-size:10.5px; border-radius:6px; color:#ef4444 !important; border-color:#fecaca;" onclick="handleDeleteCustomTemplate(${t.id}, \`${escapeJs(t.title)}\`)">
                <i class="fa-solid fa-trash-can"></i> Hapus
              </button>
            </div>
          ` : `
            <span style="font-size:10.5px; color:#64748b;"><i class="fa-solid fa-lock"></i> Default Sistem</span>
          `}
        </div>
        <div style="font-size:11.5px; color:#334155; white-space:pre-wrap; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:8px 10px; line-height:1.5; max-height:90px; overflow-y:auto; font-family:inherit;">${escapeHtml(t.content)}</div>
      </div>
    `;
  });

  const html = `
    <div class="modal-overlay active" id="modalTemplateManagerSales" style="display:flex; z-index:99999;" onclick="closeTemplateManagerModalSales()">
      <div class="modal-content" style="max-width:620px; border-radius:var(--fu-radius-lg, 16px); padding:20px 22px; max-height:88vh; overflow-y:auto;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:5px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-book-bookmark"></i> Message Library
            </div>
            <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin:0;">Daftar Template Pesan WhatsApp</h3>
          </div>
          <button class="btn-close-modal" onclick="closeTemplateManagerModalSales()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:12px; color:#64748b;">Total: <strong>${allTemplates.length} Template</strong></span>
          <button class="btn-fu btn-fu-emerald" style="padding:6px 12px; font-size:11.5px; border-radius:8px;" onclick="closeTemplateManagerModalSales(); openCustomTemplateModal();">
            <i class="fa-solid fa-plus"></i> + Tambah Template Baru
          </button>
        </div>

        <div style="max-height:420px; overflow-y:auto; padding-right:4px;">
          ${cardsHtml}
        </div>

        <div style="margin-top:14px; text-align:right;">
          <button class="btn-fu btn-fu-secondary" style="padding:8px 18px; font-size:12px;" onclick="closeTemplateManagerModalSales()">
            Tutup
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeTemplateManagerModalSales() {
  const modal = document.getElementById('modalTemplateManagerSales');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

async function handleDeleteCustomTemplate(id, title) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Apakah Anda yakin ingin menghapus template "${title}"?`);
  } else {
    isConfirmed = confirm(`Hapus template "${title}"?`);
  }
  if (!isConfirmed) return;

  try {
    const res = await fetch('../api/api_followup.php?action=delete_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const data = await res.json();
    if (data.success) {
      followupState.templates = data.data || [];
      
      // If deleted template was stored as last used, clear it
      if (localStorage.getItem('sft_last_template_id') == id) {
        localStorage.removeItem('sft_last_template_id');
      }

      // Re-render dropdown if open
      if (document.getElementById('waTemplateSelect')) {
        renderTemplateDropdownOptions();
      }

      // Re-render template manager list
      openTemplateManagerModalSales();

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Template Dihapus', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      alert(data.message || 'Gagal menghapus template.');
    }
  } catch (err) {
    console.error('Delete template error', err);
    alert('Terjadi kesalahan saat menghapus template.');
  }
}

function updateSingleCardAfterWhatsApp(customerId, nextStatus, tamData = {}) {
  const c = followupState.customers.find(x => String(x.id) === String(customerId));
  if (!c) return;

  const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');
  c.followup_date = nowIso;
  c.followup_status = nextStatus;
  
  // Set TAM 4-Pilar logically: Connected & Contacted are always TRUE when WA is sent
  c.connected = tamData.connected || 'TRUE';
  c.contacted = tamData.contacted || 'TRUE';
  c.prospect = tamData.prospect || ((nextStatus === 'Deal / Selesai' || nextStatus === 'Tertarik / Jadwal Servis') ? 'TRUE' : (c.prospect || 'FALSE'));
  c.spk = tamData.spk || (nextStatus === 'Deal / Selesai' ? 'TRUE' : (c.spk || 'FALSE'));
  if (tamData.remarks) c.remarks = tamData.remarks;
  if (tamData.sales_fu_status) c.sales_fu_status = tamData.sales_fu_status;

  // 1. Update Card View in DOM
  const card = document.getElementById(`customerCard_${customerId}`);
  if (card) {
    // Update border color status class
    card.classList.remove('pending', 'deal', 'interested');
    if (nextStatus === 'Deal / Selesai') card.classList.add('deal');
    else if (nextStatus === 'Tertarik / Jadwal Servis') card.classList.add('interested');
    else if (nextStatus === 'Belum Dihubungi') card.classList.add('pending');

    // Update WIB date badge
    const dateBadge = document.getElementById(`fuDateBadge_${customerId}`);
    if (dateBadge) {
      const dateInfo = formatWibDate(nowIso);
      dateBadge.textContent = dateInfo.text;
      dateBadge.className = 'fu-date-badge recorded';
    }

    // Update status badge pill
    const statusPill = document.getElementById(`custCardStatusPill_${customerId}`);
    if (statusPill) {
      let badgeHtml = '';
      if (nextStatus === 'Deal / Selesai') {
        badgeHtml = `<span class="badge-status-pill deal" style="background:#dcfce7; color:#15803d; border:1px solid #86efac; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-trophy"></i> Deal</span>`;
      } else if (nextStatus === 'Tertarik / Jadwal Servis') {
        badgeHtml = `<span class="badge-status-pill interested" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-thumbs-up"></i> Tertarik</span>`;
      } else if (nextStatus === 'Menunggu Respon') {
        badgeHtml = `<span class="badge-status-pill waiting" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; font-size:9.5px; font-weight:800; padding:2px 7px; border-radius:9999px;"><i class="fa-solid fa-clock"></i> Respon</span>`;
      }
      statusPill.innerHTML = badgeHtml;
    }

    // Update remarks and status dropdown in card
    const selRemarks = document.getElementById(`remarks_${customerId}`);
    if (selRemarks && c.remarks) selRemarks.value = c.remarks;
    const selStatus = document.getElementById(`salesFuStatus_${customerId}`);
    if (selStatus && c.sales_fu_status) selStatus.value = c.sales_fu_status;

    // Update TAM 4-pilar toggle buttons in card
    ['connected', 'contacted', 'prospect', 'spk'].forEach(f => {
      updateToggleButtonsUI(customerId, f, c[f]);
    });

    // Add Highlight Pulse & smooth scroll
    card.classList.remove('card-just-followed-up');
    void card.offsetWidth; // trigger reflow
    card.classList.add('card-just-followed-up');

    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    setTimeout(() => {
      card.classList.remove('card-just-followed-up');
    }, 6000);
  }

  // 2. Update Table View (if active)
  const row = document.getElementById(`customerRow_${customerId}`);
  if (row) {
    const selTblRemarks = document.getElementById(`tbl_remarks_${customerId}`);
    if (selTblRemarks && c.remarks) selTblRemarks.value = c.remarks;
    const tblStatusTxt = document.getElementById(`tbl_status_txt_${customerId}`);
    if (tblStatusTxt && c.sales_fu_status) {
      tblStatusTxt.textContent = c.sales_fu_status;
      tblStatusTxt.style.color = c.sales_fu_status === 'Closed' ? '#ef4444' : '#2563eb';
    }
    ['connected', 'contacted', 'prospect', 'spk'].forEach(f => {
      updateToggleButtonsUI(customerId, f, c[f]);
    });
    row.classList.remove('card-just-followed-up');
    void row.offsetWidth;
    row.classList.add('card-just-followed-up');
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
      row.classList.remove('card-just-followed-up');
    }, 6000);
  }

  // Update Hero KPI stats & top tab pending badges
  updateHeroStats();
  const pendingCount = followupState.customers.filter(x => x.followup_status === 'Belum Dihubungi').length;
  const badge = document.getElementById('followupBadgeCount');
  if (badge) {
    if (pendingCount > 0) {
      badge.style.display = 'inline-block';
      badge.textContent = pendingCount;
    } else {
      badge.style.display = 'none';
    }
  }
}

async function executeSendWhatsApp() {
  if (!activeCustomerForWA) return;
  const message = document.getElementById('waMessageText').value;
  const nextStatus = document.getElementById('waNextStatus').value;
  const customerId = activeCustomerForWA.id;
  const customerName = activeCustomerForWA.name;

  const cleanPhone = activeCustomerForWA.phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  // Save active customer ID into sessionStorage so position is always remembered
  sessionStorage.setItem('last_active_fu_customer_id', customerId);

  // Open WhatsApp in new tab / app
  window.open(waUrl, '_blank');

  // Close modal immediately
  closeWhatsAppModal();

  // Determine TAM 4-Pilar & Remarks values automatically based on WhatsApp status
  const isDeal = (nextStatus === 'Deal / Selesai');
  const isInterested = (nextStatus === 'Tertarik / Jadwal Servis');
  const isRejected = (nextStatus === 'Tidak Tertarik');

  const connectedVal = 'TRUE';
  const contactedVal = 'TRUE';
  const prospectVal = (isDeal || isInterested) ? 'TRUE' : 'FALSE';
  const spkVal = isDeal ? 'TRUE' : 'FALSE';
  const remarksVal = isDeal ? 'SPK berhasil' : (isInterested ? 'Customer tertarik' : (isRejected ? 'Customer menolak' : 'Customer pending'));
  const salesFuStatusVal = (isDeal || isRejected) ? 'Closed' : 'Open';

  // Optimistic UI updates in-place without page reset / DOM rebuild
  updateSingleCardAfterWhatsApp(customerId, nextStatus, {
    connected: connectedVal,
    contacted: contactedVal,
    prospect: prospectVal,
    spk: spkVal,
    remarks: remarksVal,
    sales_fu_status: salesFuStatusVal
  });

  // Update Status in backend asynchronously
  try {
    const res = await fetch('../api/api_followup.php?action=update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: customerId,
        status: nextStatus,
        connected: connectedVal,
        contacted: contactedVal,
        prospect: prospectVal,
        spk: spkVal,
        remarks: remarksVal,
        sales_fu_status: salesFuStatusVal,
        notes: `Follow up via WhatsApp (${nextStatus})`,
        reason_followup: activeCustomerForWA.reason_followup || `Follow up via WhatsApp (${nextStatus})`,
        sales_id: followupState.salesInfo ? followupState.salesInfo.id : activeCustomerForWA.assigned_sales_id
      })
    });
    const data = await res.json();
    if (data && data.success && data.followup_date) {
      const c = followupState.customers.find(x => String(x.id) === String(customerId));
      if (c) {
        c.followup_date = data.followup_date;
        const dateBadge = document.getElementById(`fuDateBadge_${customerId}`);
        if (dateBadge) {
          const dateInfo = formatWibDate(data.followup_date);
          dateBadge.textContent = dateInfo.text;
          dateBadge.className = 'fu-date-badge recorded';
        }
      }
    }

    if (typeof showCustomAlert === 'function') {
      showCustomAlert('WhatsApp Terkirim!', `Pesan untuk ${customerName} telah dibuka di WA. Respon TAM otomatis tercatat (Connected & Contacted = Iya).`, 'success');
    }
  } catch (e) {
    console.error('Error updating status after WhatsApp send:', e);
  }
}

async function quickUpdateCustomerStatus(customerId, newStatus) {
  sessionStorage.setItem('last_active_fu_customer_id', customerId);
  updateSingleCardAfterWhatsApp(customerId, newStatus);

  try {
    await fetch('../api/api_followup.php?action=update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: customerId,
        status: newStatus,
        sales_id: followupState.salesInfo ? followupState.salesInfo.id : null
      })
    });
  } catch (e) {
    console.error('Error updating status', e);
  }
}

function switchFollowupSubTab(tab) {
  followupState.subTab = tab;
  
  const btnMyTasks = document.getElementById('subBtnMyTasks');
  const btnOrphan = document.getElementById('subBtnOrphanPool');
  const btnRadar = document.getElementById('subBtnRadar');
  const filterCard = document.getElementById('fuFilterCard');

  if (btnMyTasks) btnMyTasks.classList.toggle('active', tab === 'my_tasks');
  if (btnOrphan) btnOrphan.classList.toggle('active', tab === 'orphan_pool');
  if (btnRadar) btnRadar.classList.toggle('active', tab === 'radar');

  if (tab === 'radar') {
    if (filterCard) filterCard.style.display = 'none';
    if (window.SalesSuperpowers) {
      SalesSuperpowers.renderRadarCockpit('followupDataContainer', 5);
    }
  } else {
    if (filterCard) filterCard.style.display = 'block';
    if (tab === 'orphan_pool') {
      loadOrphanLeads();
    } else {
      renderCustomerCards();
    }
  }
}

function switchCustomerTab(tab) {
  followupState.activeTab = tab;
  const tabFu = document.getElementById('tabBtnFollowup');
  const tabKb = document.getElementById('tabBtnKanban');
  const viewFu = document.getElementById('followupSectionView');
  const kanban = document.getElementById('kanbanBoard');

  if (tabFu) tabFu.classList.toggle('active', tab === 'followup');
  if (tabKb) tabKb.classList.toggle('active', tab === 'kanban');

  if (viewFu) viewFu.style.display = tab === 'followup' ? 'block' : 'none';
  if (kanban) kanban.style.display = tab === 'kanban' ? 'flex' : 'none';
}

