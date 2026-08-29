/**
 * followup_master.js - Master Follow-Up CRM Module for SPV & Kacab in SFT
 * Tunas Toyota Kiara Condong
 */

let masterState = {
  customers: [],
  salesList: [],
  templates: [],
  stats: {},
  selectedIds: [],
  filters: {
    search: '',
    sales_id: 'all',
    status: 'all',
    category: 'all'
  },
  pagination: {
    currentPage: 1,
    perPage: 50
  }
};

let executiveState = {
  activeView: 'executive', // 'executive' or 'database'
  activeModel: 'all',      // 'all', 'veloz_hybrid', 'others'
  analytics: null,
  charts: {}
};

document.addEventListener('DOMContentLoaded', () => {
  initMasterDashboard();
});

async function initMasterDashboard() {
  await Promise.all([
    loadExecutiveAnalytics(),
    loadSalesList(),
    loadTemplates(),
    loadMasterStats(),
    loadMasterCustomers()
  ]);
}

// -------------------------------------------------------------
// VIEW SWITCHER: EXECUTIVE ANALYTICS vs CUSTOMER DATABASE
// -------------------------------------------------------------
function switchFollowupView(view) {
  executiveState.activeView = view;

  const tabExec = document.getElementById('tabExecutiveView');
  const tabDb = document.getElementById('tabDatabaseView');
  const secExec = document.getElementById('sectionExecutiveDashboard');
  const secDb = document.getElementById('sectionCustomerDatabase');

  if (view === 'executive') {
    if (tabExec) tabExec.classList.add('active');
    if (tabDb) tabDb.classList.remove('active');
    if (secExec) secExec.style.display = 'block';
    if (secDb) secDb.style.display = 'none';
    if (!executiveState.analytics) {
      loadExecutiveAnalytics();
    }
  } else {
    if (tabExec) tabExec.classList.remove('active');
    if (tabDb) tabDb.classList.add('active');
    if (secExec) secExec.style.display = 'none';
    if (secDb) secDb.style.display = 'block';
  }
}

// -------------------------------------------------------------
// MODEL FILTER BUTTONS (Semua Model, Veloz Hybrid, Others)
// -------------------------------------------------------------
function setDashboardModelFilter(model) {
  executiveState.activeModel = model;

  const btnAll = document.getElementById('btnModelAll');
  const btnVeloz = document.getElementById('btnModelVeloz');
  const btnOthers = document.getElementById('btnModelOthers');

  if (btnAll) btnAll.classList.toggle('active', model === 'all');
  if (btnVeloz) btnVeloz.classList.toggle('active', model === 'veloz_hybrid');
  if (btnOthers) btnOthers.classList.toggle('active', model === 'others');

  loadExecutiveAnalytics();
}

// -------------------------------------------------------------
// FETCH & RENDER EXECUTIVE ANALYTICS (GOOGLE SHEET MATCHED)
// -------------------------------------------------------------
async function loadExecutiveAnalytics() {
  try {
    const model = executiveState.activeModel || 'all';
    const res = await fetch(`/api/api_followup.php?action=dashboard_analytics&filter_model=${encodeURIComponent(model)}`);
    const data = await res.json();

    if (data.success) {
      executiveState.analytics = data;
      renderExecutiveDashboardUI(data);

      // Auto-trigger sync if database is completely empty on initial load
      if ((data.total_database === 0 || (data.funnel && data.funnel.potency === 0)) && !executiveState._autoSynced) {
        executiveState._autoSynced = true;
        triggerGoogleSheetSync(false);
      }
    }
  } catch (err) {
    console.error('Error loading executive analytics:', err);
  }
}

function renderExecutiveDashboardUI(data) {
  const f = data.funnel || {};

  // 1. Update 7 Funnel KPI Cards
  const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setWidth = (id, pct) => { const el = document.getElementById(id); if (el) el.style.width = Math.min(100, Math.max(0, pct)) + '%'; };

  setTxt('fnPotency', (f.potency || 0).toLocaleString('id-ID'));
  setTxt('fnCustFu', (f.cust_fu || 0).toLocaleString('id-ID'));
  setTxt('fnRatioCustFu', (f.ratio_fu || 0) + '%');
  setWidth('fnBarCustFu', f.ratio_fu || 0);

  setTxt('fnConnected', (f.connected || 0).toLocaleString('id-ID'));
  setTxt('fnRatioConnected', (f.ratio_connected || 0) + '%');
  setWidth('fnBarConnected', f.ratio_connected || 0);

  setTxt('fnContacted', (f.contacted || 0).toLocaleString('id-ID'));
  setTxt('fnRatioContacted', (f.ratio_contacted || 0) + '%');
  setWidth('fnBarContacted', f.ratio_contacted || 0);

  setTxt('fnHotProspect', (f.hot_prospect || 0).toLocaleString('id-ID'));
  setTxt('fnRatioHotProspect', (f.ratio_hot_prospect || 0) + '%');
  setWidth('fnBarHotProspect', f.ratio_hot_prospect || 0);

  setTxt('fnSpk', (f.spk || 0).toLocaleString('id-ID'));
  setTxt('fnRatioSpk', (f.ratio_spk || 0) + '%');
  setWidth('fnBarSpk', f.ratio_spk || 0);

  setTxt('fnDo', (f.do_unit || 0).toLocaleString('id-ID'));
  setTxt('fnRatioDo', (f.ratio_do || 0) + '%');
  setWidth('fnBarDo', f.ratio_do || 0);

  // Update Sync info
  const totalLeads = data.total_database || 0;
  const badgeTotal = document.getElementById('badgeTotalCust');
  if (badgeTotal) badgeTotal.textContent = totalLeads.toLocaleString('id-ID');

  const syncText = document.getElementById('lastSyncIndicatorText');
  if (syncText) {
    const rawTime = data.last_sync || '';
    syncText.innerHTML = `<i class="fa-solid fa-clock-rotate-left"></i> Terakhir Sinkron: <strong>${rawTime ? formatIndoTime(rawTime) : 'Baru saja'}</strong>`;
  }

  // 2. Render Charts
  renderChartFunnelConversion(f);
  renderChartFleetRetail(data.type_breakdown || {});
  renderChartTemperatureClass(data.class_breakdown || {});
  renderChartResponseDistribution(f.responses || {});
  renderChartTopModels(data.top_models || []);

  // 3. Render Cluster Table
  renderClusterBreakdownTable(data.cluster_breakdown || []);

  // 4. Render Sales Leaderboard Table
  renderSalesLeaderboardTable(data.sales_performance || []);
}

function formatIndoTime(dtStr) {
  if (!dtStr) return '-';
  try {
    const d = new Date(dtStr.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dtStr;
    return d.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }) + ' WIB';
  } catch (e) {
    return dtStr;
  }
}

// -------------------------------------------------------------
// CHART 1: FUNNEL CONVERSION (HORIZONTAL BAR WITH RATIOS)
// -------------------------------------------------------------
function renderChartFunnelConversion(f) {
  const canvas = document.getElementById('chartFunnelConversion');
  if (!canvas) return;

  if (executiveState.charts.funnel) {
    executiveState.charts.funnel.destroy();
  }

  const ctx = canvas.getContext('2d');
  const labels = ['1. Potensi', '2. Cust FU', '3. Connected', '4. Contacted', '5. Hot Prospek', '6. SPK', '7. DO Unit'];
  const datasetValues = [
    f.potency || 0,
    f.cust_fu || 0,
    f.connected || 0,
    f.contacted || 0,
    f.hot_prospect || 0,
    f.spk || 0,
    f.do_unit || 0
  ];

  const backgroundColors = [
    '#3b82f6', '#0ea5e9', '#06b6d4', '#8b5cf6', '#f59e0b', '#d7123a', '#10b981'
  ];

  executiveState.charts.funnel = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Jumlah Leads',
        data: datasetValues,
        backgroundColor: backgroundColors,
        borderRadius: 8,
        barThickness: 20
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(ctx) {
              const val = ctx.raw || 0;
              const pot = f.potency || 1;
              const pctOfPotency = ((val / pot) * 100).toFixed(1);
              return ` ${val.toLocaleString('id-ID')} Leads (${pctOfPotency}% dari Potensi)`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: { color: '#f1f5f9' },
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } }
        },
        y: {
          grid: { display: false },
          ticks: { font: { family: 'Plus Jakarta Sans', weight: '700' } }
        }
      }
    }
  });
}

// -------------------------------------------------------------
// CHART 2: FLEET VS RETAIL (DOUGHNUT)
// -------------------------------------------------------------
function renderChartFleetRetail(types) {
  const canvas = document.getElementById('chartFleetRetail');
  if (!canvas) return;

  if (executiveState.charts.fleetRetail) {
    executiveState.charts.fleetRetail.destroy();
  }

  const retail = types.RETAIL || { potency: 0, spk: 0 };
  const fleet = types.FLEET || { potency: 0, spk: 0 };

  const ctx = canvas.getContext('2d');
  executiveState.charts.fleetRetail = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: [
        `Retail (${retail.potency || 0} Leads - ${retail.spk || 0} SPK)`,
        `Fleet (${fleet.potency || 0} Leads - ${fleet.spk || 0} SPK)`
      ],
      datasets: [{
        data: [retail.potency || 0, fleet.potency || 0],
        backgroundColor: ['#d7123a', '#0d1b3e'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverOffset: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', weight: '700', size: 11 }, boxWidth: 12, padding: 12 }
        }
      },
      cutout: '68%'
    }
  });
}

// -------------------------------------------------------------
// CHART 3: TEMPERATURE / CLASS (HIGH, MEDIUM, LOW)
// -------------------------------------------------------------
function renderChartTemperatureClass(classes) {
  const canvas = document.getElementById('chartTemperatureClass');
  if (!canvas) return;

  if (executiveState.charts.temperature) {
    executiveState.charts.temperature.destroy();
  }

  const high = classes.HIGH || { potency: 0, cust_fu: 0, spk: 0 };
  const med = classes.MEDIUM || { potency: 0, cust_fu: 0, spk: 0 };
  const low = classes.LOW || { potency: 0, cust_fu: 0, spk: 0 };

  const ctx = canvas.getContext('2d');
  executiveState.charts.temperature = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['HIGH', 'MEDIUM', 'LOW'],
      datasets: [
        {
          label: 'Potensi Leads',
          data: [high.potency || 0, med.potency || 0, low.potency || 0],
          backgroundColor: '#3b82f6',
          borderRadius: 6
        },
        {
          label: 'Cust. FU',
          data: [high.cust_fu || 0, med.cust_fu || 0, low.cust_fu || 0],
          backgroundColor: '#f59e0b',
          borderRadius: 6
        },
        {
          label: 'SPK Closing',
          data: [high.spk || 0, med.spk || 0, low.spk || 0],
          backgroundColor: '#10b981',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 }, boxWidth: 10, padding: 10 }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', weight: '800' } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } } }
      }
    }
  });
}

// -------------------------------------------------------------
// CHART 4: RESPONSE DISTRIBUTION (DOUGHNUT)
// -------------------------------------------------------------
function renderChartResponseDistribution(responses) {
  const canvas = document.getElementById('chartResponseDistribution');
  if (!canvas) return;

  if (executiveState.charts.response) {
    executiveState.charts.response.destroy();
  }

  const labels = [
    'SPK berhasil',
    'Customer tertarik',
    'Customer janjian',
    'Customer pending',
    'Customer menolak',
    'Customer tidak aktif'
  ];

  const dataValues = labels.map(l => responses[l] || 0);

  const ctx = canvas.getContext('2d');
  executiveState.charts.response = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: dataValues,
        backgroundColor: [
          '#10b981', // SPK hijau
          '#3b82f6', // Tertarik biru
          '#8b5cf6', // Janjian ungu
          '#f59e0b', // Pending amber
          '#ef4444', // Menolak merah
          '#64748b'  // Tidak aktif abu
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', weight: '600', size: 9 }, boxWidth: 10, padding: 6 }
        }
      },
      cutout: '60%'
    }
  });
}

// -------------------------------------------------------------
// CHART 5: TOP VEHICLE MODELS (BAR)
// -------------------------------------------------------------
function renderChartTopModels(models) {
  const canvas = document.getElementById('chartTopModels');
  if (!canvas) return;

  if (executiveState.charts.models) {
    executiveState.charts.models.destroy();
  }

  const top6 = models.slice(0, 6);
  const labels = top6.map(m => m.model);
  const potValues = top6.map(m => m.potency);
  const spkValues = top6.map(m => m.spk);

  const ctx = canvas.getContext('2d');
  executiveState.charts.models = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Total Leads',
          data: potValues,
          backgroundColor: '#0d1b3e',
          borderRadius: 6
        },
        {
          label: 'SPK',
          data: spkValues,
          backgroundColor: '#d7123a',
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 }, boxWidth: 10, padding: 8 }
        }
      },
      scales: {
        x: { grid: { display: false }, ticks: { font: { family: 'Plus Jakarta Sans', weight: '700', size: 10 } } },
        y: { grid: { color: '#f1f5f9' }, ticks: { font: { family: 'Plus Jakarta Sans', weight: '600' } } }
      }
    }
  });
}

// -------------------------------------------------------------
// TABLE 1: CLUSTER BREAKDOWN TABLE
// -------------------------------------------------------------
function renderClusterBreakdownTable(clusters) {
  const tbody = document.getElementById('tbodyClusterBreakdown');
  if (!tbody) return;

  const countBadge = document.getElementById('clusterCountText');
  if (countBadge) countBadge.textContent = `${clusters.length} Klaster Segmentasi TAM`;

  if (clusters.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color:#64748b;">Tidak ada data klaster untuk filter ini.</td></tr>`;
    return;
  }

  let html = '';
  clusters.forEach((c) => {
    const closingRate = c.potency > 0 ? ((c.spk / c.potency) * 100).toFixed(1) : '0.0';

    html += `
      <tr>
        <td>
          <span class="fu-cluster-badge">
            <i class="fa-solid fa-tag"></i> ${escapeHtml(c.cluster_name)}
          </span>
        </td>
        <td class="num font-bold">${(c.potency || 0).toLocaleString('id-ID')}</td>
        <td class="num">${(c.cust_fu || 0).toLocaleString('id-ID')}</td>
        <td class="num"><span style="color:#2563eb; font-weight:700;">${c.ratio_fu || 0}%</span></td>
        <td class="num">${(c.connected || 0).toLocaleString('id-ID')}</td>
        <td class="num">${(c.contacted || 0).toLocaleString('id-ID')}</td>
        <td class="num"><span style="color:#d97706; font-weight:700;">${(c.hot_prospect || 0).toLocaleString('id-ID')}</span></td>
        <td class="num"><span class="fu-spk-pill">${(c.spk || 0).toLocaleString('id-ID')} SPK</span></td>
        <td class="num"><span class="fu-do-pill">${(c.do_unit || 0).toLocaleString('id-ID')} DO</span></td>
        <td class="num">
          <span style="font-weight:800; color:${closingRate > 0 ? '#15803d' : '#64748b'};">${closingRate}%</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// -------------------------------------------------------------
// TABLE 2: SALES LEADERBOARD TABLE
// -------------------------------------------------------------
function renderSalesLeaderboardTable(salesList) {
  const tbody = document.getElementById('tbodySalesLeaderboard');
  if (!tbody) return;

  // Filter out any invalid / unassigned names
  const validSales = (salesList || []).filter(s => s && s.sales_name && s.sales_name !== 'Belum Ditugaskan' && s.sales_name !== '-' && s.sales_name !== 'Unassigned');

  const countBadge = document.getElementById('salesLeaderboardCount');
  if (countBadge) countBadge.textContent = `${validSales.length} Wiraniaga Aktif`;

  if (validSales.length === 0) {
    tbody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:24px; color:#64748b;">Tidak ada data performa wiraniaga untuk filter ini.</td></tr>`;
    return;
  }

  let html = '';
  validSales.forEach((s, idx) => {
    const rank = idx + 1;
    let rankBadge = `<span class="fu-row-num-badge">${rank}</span>`;
    if (rank === 1) rankBadge = `<span class="fu-row-num-badge" style="background:#fef08a; color:#854d0e; border-color:#fde047;"><i class="fa-solid fa-crown"></i> 1</span>`;
    else if (rank === 2) rankBadge = `<span class="fu-row-num-badge" style="background:#e2e8f0; color:#334155;"><i class="fa-solid fa-medal"></i> 2</span>`;
    else if (rank === 3) rankBadge = `<span class="fu-row-num-badge" style="background:#ffedd5; color:#9a3412;"><i class="fa-solid fa-medal"></i> 3</span>`;

    const closingRate = s.potency > 0 ? ((s.spk / s.potency) * 100).toFixed(1) : '0.0';
    const spvTeam = s.spv ? `<div style="font-size:11px; color:#64748b; font-weight:600;"><i class="fa-solid fa-user-tie" style="font-size:10px; margin-right:3px; color:#94a3b8;"></i>${escapeHtml(s.spv)}</div>` : '';

    html += `
      <tr>
        <td style="text-align:center;">${rankBadge}</td>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; min-width:32px; border-radius:50%; background:linear-gradient(135deg, #0d1b3e, #d7123a); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:13px; box-shadow:0 2px 5px rgba(13,27,62,0.15);">
              ${escapeHtml(s.sales_name.charAt(0).toUpperCase())}
            </div>
            <div>
              <div style="font-weight:700; color:#0f172a; font-size:13.5px;">${escapeHtml(s.sales_name)}</div>
              ${spvTeam}
            </div>
          </div>
        </td>
        <td class="num font-bold">${(s.potency || 0).toLocaleString('id-ID')}</td>
        <td class="num">${(s.cust_fu || 0).toLocaleString('id-ID')}</td>
        <td class="num">${(s.connected || 0).toLocaleString('id-ID')}</td>
        <td class="num">${(s.contacted || 0).toLocaleString('id-ID')}</td>
        <td class="num"><span style="color:#d97706; font-weight:700;">${(s.hot_prospect || 0).toLocaleString('id-ID')}</span></td>
        <td class="num"><span class="fu-spk-pill">${(s.spk || 0).toLocaleString('id-ID')} SPK</span></td>
        <td class="num"><span class="fu-do-pill">${(s.do_unit || 0).toLocaleString('id-ID')} DO</span></td>
        <td class="num">
          <span style="font-weight:800; color:${closingRate > 0 ? '#15803d' : '#64748b'};">${closingRate}%</span>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

// -------------------------------------------------------------
// SINKRONISASI LIVE GOOGLE SPREADSHEET
// -------------------------------------------------------------
async function triggerGoogleSheetSync(showNotification = true) {
  try {
    if (showNotification && window.Swal) {
      Swal.fire({
        title: 'Menyinkronkan Spreadsheet...',
        text: 'Mengambil data terbaru dari Google Spreadsheet Tunas Toyota Kiara Condong...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }

    const res = await fetch('/api/api_followup_sync.php?action=pull_sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });

    const data = await res.json();

    if (data.success) {
      // Reload both analytics and customer database
      await Promise.all([
        loadExecutiveAnalytics(),
        loadMasterStats(),
        loadMasterCustomers()
      ]);

      if (showNotification && window.Swal) {
        Swal.fire({
          icon: 'success',
          title: 'Sinkronisasi Berhasil!',
          text: data.message || `${data.inserted || 0} data leads customer berhasil disinkronkan.`,
          confirmButtonColor: '#d7123a',
          timer: 2500
        });
      }
    } else {
      if (showNotification && window.Swal) {
        Swal.fire({
          icon: 'error',
          title: 'Sinkronisasi Gagal',
          text: data.message || 'Terjadi kesalahan saat sinkronisasi Google Sheet.',
          confirmButtonColor: '#d7123a'
        });
      }
    }
  } catch (err) {
    console.error('Error syncing Google Sheet:', err);
    if (showNotification && window.Swal) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Terhubung',
        text: 'Tidak dapat menghubungi server sinkronisasi.',
        confirmButtonColor: '#d7123a'
      });
    }
  }
}

function getLoggedInSpvName() {
  const peran = localStorage.getItem('peranSales') || 'Supervisor';
  if (peran === 'Supervisor' || peran === 'SPV') {
    return localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Pak Ryan';
  }
  return '';
}

async function loadSalesList() {
  try {
    const spv = getLoggedInSpvName();
    const res = await fetch(`/api/api_followup.php?action=sales&spv=${encodeURIComponent(spv)}`);
    const data = await res.json();
    if (data.success) {
      masterState.salesList = data.data || [];
      populateSalesDropdowns();
    }
  } catch (e) {
    console.error('Error loading sales list', e);
  }
}

async function loadTemplates() {
  try {
    const res = await fetch('/api/api_followup.php?action=templates');
    const data = await res.json();
    if (data.success) {
      masterState.templates = data.data || [];
    }
  } catch (e) {
    console.error('Error loading templates', e);
  }
}

async function loadMasterStats() {
  try {
    const res = await fetch('/api/api_followup.php?action=stats');
    const data = await res.json();
    if (data.success) {
      masterState.stats = data.stats || {};
      renderStatsTiles();
      renderQuotaRefillNotification(masterState.stats.readyForRefillSales || []);
      populateCategoryDropdown();
    }
  } catch (e) {
    console.error('Error loading stats', e);
  }
}

function renderStatsTiles() {
  const s = masterState.stats;
  const byStatus = s.byStatus || {};

  document.getElementById('kpiTotal').textContent = s.total || 0;
  document.getElementById('kpiPending').textContent = byStatus['Belum Dihubungi'] || 0;
  document.getElementById('kpiWaiting').textContent = byStatus['Menunggu Respon'] || 0;
  document.getElementById('kpiInterested').textContent = byStatus['Tertarik / Jadwal Servis'] || 0;
  document.getElementById('kpiDeal').textContent = byStatus['Deal / Selesai'] || 0;
}

function renderQuotaRefillNotification(readySales) {
  const bar = document.getElementById('quotaRefillNotificationBar');
  if (!bar) return;

  if (!readySales || readySales.length === 0) {
    bar.style.display = 'none';
    bar.innerHTML = '';
    return;
  }

  let salesCardsHtml = '';
  readySales.forEach(s => {
    salesCardsHtml += `
      <div style="background:#ffffff; border:1.5px solid #bbf7d0; border-radius:12px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; gap:12px; box-shadow:0 2px 8px rgba(22,101,52,0.06);">
        <div>
          <div style="font-weight:800; color:#0f172a; font-size:13px; display:flex; align-items:center; gap:6px;">
            <span>${s.name}</span>
            <span style="font-size:10.5px; font-weight:700; color:#15803d; background:#dcfce7; padding:2px 8px; border-radius:9999px;">
              ${s.spv ? `${s.spv}` : 'Sales'}
            </span>
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:2px;">
            Progres: <strong style="color:#15803d;">${s.processed_count}/${s.total_assigned} Follow-Up (${s.completion_rate}%)</strong> • Sisa Belum Dihubungi: <strong>${s.pending_count}</strong>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button class="btn-fu btn-fu-crimson" style="padding:6px 12px; font-size:11.5px; border-radius:8px;" onclick="refillSalesLeads(${s.id}, '${escapeJs(s.name)}', 50)">
            <i class="fa-solid fa-plus"></i> Tambah +50 Leads
          </button>
          <a href="https://wa.me/${s.phone}" target="_blank" class="btn-fu btn-fu-emerald" style="padding:6px 10px; font-size:11.5px; border-radius:8px; text-decoration:none;" title="Chat WA Sales">
            <i class="fa-brands fa-whatsapp"></i>
          </a>
        </div>
      </div>
    `;
  });

  bar.style.display = 'block';
  bar.innerHTML = `
    <div style="background:linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border:1.5px solid #86efac; border-radius:16px; padding:16px 20px; box-shadow:0 4px 20px rgba(16,185,129,0.12);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <div style="width:32px; height:32px; border-radius:50%; background:#22c55e; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 2px 8px rgba(34,197,94,0.4);">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div>
            <h4 style="font-size:14px; font-weight:800; color:#14532d; margin:0;">
              Pemberitahuan: ${readySales.length} Wiraniaga Telah Menyelesaikan Batch Follow-Up!
            </h4>
            <p style="font-size:11.5px; color:#166534; margin:2px 0 0 0;">
              Wiraniaga di bawah telah memproses leads mereka dan siap diberikan kuota leads baru dari database.
            </p>
          </div>
        </div>
        <span style="font-size:11px; font-weight:800; background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; padding:4px 10px; border-radius:9999px;">
          ⚡ Siap Refill Leads
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(320px, 1fr)); gap:10px;">
        ${salesCardsHtml}
      </div>
    </div>
  `;
}

async function refillSalesLeads(salesId, salesName, quota = 50) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Tambahkan batch +${quota} data customer baru dari database unassigned ke akun ${salesName}?`);
  } else {
    isConfirmed = confirm(`Tambahkan batch +${quota} data customer baru ke ${salesName}?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=add_more_leads_to_sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_id: salesId, quota: quota })
    });
    const data = await res.json();

    if (data.success) {
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Leads Ditambahkan!', `${data.message}\n\nAnda dapat langsung mengirimkan notifikasi rekap tugas via WhatsApp ke wiraniaga.`, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Informasi', data.message, 'warning');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Refill error', e);
  }
}

function populateSalesDropdowns() {
  const filterSelect = document.getElementById('filterSalesSelect');
  const bulkSelect = document.getElementById('bulkSalesSelect');
  const assignTaskSelect = document.getElementById('assignTaskSalesSelect');

  if (filterSelect) {
    filterSelect.innerHTML = '<option value="all">Semua Sales PIC</option><option value="unassigned">🔥 Pool Rebutan (Ex-Sales / Belum Ditugaskan)</option>';
    masterState.salesList.forEach(s => {
      filterSelect.innerHTML += `<option value="${s.id}">${s.name} (${s.total_customers || 0} Task)</option>`;
    });
  }

  if (bulkSelect) {
    bulkSelect.innerHTML = '<option value="">-- Pilih Sales Target --</option>';
    masterState.salesList.forEach(s => {
      bulkSelect.innerHTML += `<option value="${s.id}">${s.name}</option>`;
    });
  }

  if (assignTaskSelect) {
    assignTaskSelect.innerHTML = '<option value="">-- Kirim WA Notif ke Sales --</option>';
    masterState.salesList.forEach(s => {
      assignTaskSelect.innerHTML += `<option value="${s.id}">${s.name} (+${s.phone})</option>`;
    });
  }
}

function populateCategoryDropdown() {
  const catSelect = document.getElementById('filterCategorySelect');
  if (!catSelect) return;

  const cats = masterState.stats.byCategory || {};
  catSelect.innerHTML = '<option value="all">Semua Kategori</option>';
  Object.keys(cats).forEach(cat => {
    catSelect.innerHTML += `<option value="${cat}">${cat} (${cats[cat]})</option>`;
  });
}

async function loadMasterCustomers(resetPage = true) {
  if (resetPage) {
    masterState.pagination.currentPage = 1;
  }

  const tbody = document.getElementById('masterCustomerTbody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:30px; color:#64748b;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:20px; color:#d7123a; margin-bottom:8px;"></i><br>
          Memuat database customer...
        </td>
      </tr>
    `;
  }

  try {
    const { search, sales_id, status, category } = masterState.filters;
    const spv = getLoggedInSpvName();
    const url = `/api/api_followup.php?action=customers&search=${encodeURIComponent(search)}&sales_id=${sales_id}&status=${status}&category=${encodeURIComponent(category)}&spv=${encodeURIComponent(spv)}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.success) {
      masterState.customers = data.data || [];
      renderCustomerTable();
    }
  } catch (e) {
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align:center; padding:30px; color:red;">
            Gagal memuat data customer dari server.
          </td>
        </tr>
      `;
    }
  }
}

function renderCustomerTable() {
  const tbody = document.getElementById('masterCustomerTbody');
  if (!tbody) return;

  const allList = masterState.customers || [];
  const totalCount = allList.length;
  const perPage = masterState.pagination.perPage || 50;
  const totalPages = Math.max(1, Math.ceil(totalCount / perPage));

  if (masterState.pagination.currentPage > totalPages) {
    masterState.pagination.currentPage = totalPages;
  }
  if (masterState.pagination.currentPage < 1) {
    masterState.pagination.currentPage = 1;
  }

  const currentPage = masterState.pagination.currentPage;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, totalCount);
  const pageItems = allList.slice(startIndex, endIndex);

  const countTextEl = document.getElementById('tableCountText');
  if (countTextEl) {
    countTextEl.innerHTML = totalCount > 0
      ? `Menampilkan <strong>${startIndex + 1} - ${endIndex}</strong> dari <strong>${totalCount}</strong> Customer &middot; <span style="color:#d7123a; font-weight:800;">Halaman ${currentPage}/${totalPages}</span>`
      : 'Total: 0 Customer';
  }

  if (totalCount === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center; padding:60px 20px; color:#94a3b8;">
          <i class="fa-solid fa-folder-open" style="font-size:32px; margin-bottom:12px; color:#cbd5e1;"></i><br>
          <strong style="font-size:14px; color:#0f172a;">Tidak ada data customer yang sesuai</strong><br>
          <span style="font-size:12px;">Coba ubah kata kunci pencarian atau filter kategori di atas.</span>
        </td>
      </tr>
    `;
    renderPagination(0, 0, 0, 1, 1, perPage);
    return;
  }

  let html = '';
  pageItems.forEach((c, idx) => {
    const isSelected = masterState.selectedIds.includes(c.id);
    const rowNumber = startIndex + idx + 1;

    // Generate Initials
    const rawName = (c.name || 'Customer').trim();
    const parts = rawName.split(/\s+/);
    let initials = '';
    if (parts.length >= 2) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else {
      initials = rawName.substring(0, 2).toUpperCase();
    }

    html += `
      <tr id="masterRow_${c.id}" style="${isSelected ? 'background:#fff1f2;' : ''}">
        <!-- 1. Checkbox -->
        <td style="text-align:center; width:44px;">
          <input type="checkbox" style="width:17px; height:17px; accent-color:#d7123a; cursor:pointer;" ${isSelected ? 'checked' : ''} onchange="toggleSelectCustomer(${c.id})">
        </td>

        <!-- 2. No. Urut -->
        <td style="text-align:center; width:52px; vertical-align:middle; background:rgba(248,250,252,0.6);">
          <span class="fu-row-num-badge">${rowNumber}</span>
        </td>

        <!-- 3. Customer & Kontak -->
        <td style="min-width:240px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div class="cust-avatar-circle">${initials}</div>
            <div>
              <div style="font-weight:800; color:#0f172a; font-size:13.5px; line-height:1.25;">${escapeHtml(c.name || '')}</div>
              <div style="font-family:monospace; font-size:11.5px; color:#059669; font-weight:700; margin-top:3px;">
                <a href="https://wa.me/${c.phone}" target="_blank" style="color:inherit; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
                  <i class="fa-brands fa-whatsapp" style="font-size:13px;"></i> +${c.phone}
                </a>
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
                ${c.district ? `<span style="font-size:10.5px; color:#64748b;"><i class="fa-solid fa-location-dot" style="color:#94a3b8; font-size:9.5px;"></i> Kec. ${escapeHtml(c.district)}</span>` : ''}
                ${c.customer_type ? `<span style="font-size:9.5px; font-weight:800; padding:1px 6px; border-radius:4px; background:#f1f5f9; color:#475569;">${escapeHtml(c.customer_type)}</span>` : ''}
              </div>
            </div>
          </div>
        </td>

        <!-- 3. Unit Mobil & Usia -->
        <td style="min-width:230px;">
          <div style="font-weight:900; color:#d7123a; font-size:13.5px; letter-spacing:-0.2px; display:flex; align-items:center; gap:5px;">
            <i class="fa-solid fa-car-side" style="color:#d7123a;"></i> ${escapeHtml(c.recommended_model || c.car_model || '')}
          </div>
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:4px;">
            ${c.last_car_model ? `<span class="badge-last-car">Saat ini: <strong>${escapeHtml(c.last_car_model)}</strong></span>` : ''}
            ${c.car_age ? `<span class="badge-car-age"><i class="fa-solid fa-clock"></i> ${escapeHtml(c.car_age)}</span>` : ''}
          </div>
          ${(c.alt_model_2 || c.alt_model_3) ? `
            <div style="font-size:10.5px; color:#64748b; margin-top:3px;">
              🔄 Alt: <strong style="color:#334155;">${[c.alt_model_2, c.alt_model_3].filter(Boolean).map(escapeHtml).join(', ')}</strong>
            </div>
          ` : ''}
          ${c.vin ? `<div style="font-size:9.5px; font-family:monospace; color:#94a3b8; margin-top:2px;">VIN: ${escapeHtml(c.vin)}</div>` : ''}
        </td>

        <!-- 4. Kategori & Klaster -->
        <td style="min-width:190px;">
          ${c.cluster_name ? `<div><span class="badge-cluster-pill" style="background:#f8fafc; color:#334155; border-color:#e2e8f0; font-size:10.5px; margin-bottom:3px;"><i class="fa-solid fa-tag"></i> ${escapeHtml(c.cluster_name)}</span></div>` : ''}
          ${c.priority ? `<div><span class="badge-priority-pill" style="font-size:10px; margin-bottom:3px;"><i class="fa-solid fa-bolt"></i> ${escapeHtml(c.priority)}</span></div>` : ''}
          <div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:2px;">
            ${c.outlet_do ? `<span style="font-size:9.5px; color:#64748b; background:#f8fafc; border:1px solid #e2e8f0; padding:1px 5px; border-radius:4px;"><i class="fa-solid fa-building" style="font-size:9px;"></i> DO: ${escapeHtml(c.outlet_do)}</span>` : ''}
            ${c.service_compliance ? `<span style="font-size:9.5px; background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; padding:1px 5px; border-radius:4px;"><i class="fa-solid fa-wrench" style="font-size:9px;"></i> Servis: ${escapeHtml(c.service_compliance)}</span>` : ''}
          </div>
        </td>

        <!-- 5. Status Terkini -->
        <td style="min-width:185px;">
          <select class="fu-table-select" onchange="inlineUpdateStatus(${c.id}, this.value)">
            <option value="Belum Dihubungi" ${c.followup_status === 'Belum Dihubungi' ? 'selected' : ''}>⚪ Belum Dihubungi</option>
            <option value="Menunggu Respon" ${c.followup_status === 'Menunggu Respon' ? 'selected' : ''}>Menunggu Respon</option>
            <option value="Tertarik / Jadwal Servis" ${c.followup_status === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>Tertarik / Servis</option>
            <option value="Deal / Selesai" ${c.followup_status === 'Deal / Selesai' ? 'selected' : ''}>Deal / Selesai</option>
            <option value="Tidak Tertarik" ${c.followup_status === 'Tidak Tertarik' ? 'selected' : ''}>Tidak Tertarik</option>
          </select>
        </td>

        <!-- 6. Sales PIC -->
        <td style="min-width:190px;">
          <select class="fu-table-select" onchange="inlineUpdateSales(${c.id}, this.value)">
            <option value="">-- Belum Ditugaskan (Batal) --</option>
            ${masterState.salesList.map(s => `
              <option value="${s.id}" ${c.assigned_sales_id == s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>
            `).join('')}
          </select>
        </td>

        <!-- 7. Respon & Catatan FU -->
        <td style="min-width:210px; font-size:11.5px; color:#64748b;">
          ${c.remarks ? `
            <div style="margin-bottom:3px; display:flex; align-items:center; gap:4px; flex-wrap:wrap;">
              <span class="badge-cluster-pill" style="font-size:10.5px; font-weight:800; background:#f0fdf4; color:#15803d; border-color:#bbf7d0;">
                ${escapeHtml(c.remarks)}
              </span>
              <span style="font-size:9.5px; font-weight:800; padding:1px 5px; border-radius:4px; background:${c.sales_fu_status === 'Closed' ? '#fee2e2; color:#991b1b;' : '#e0f2fe; color:#0369a1;'}">
                ${escapeHtml(c.sales_fu_status || 'Open')}
              </span>
            </div>
            <div style="font-size:10px; color:#475569; display:flex; gap:4px; flex-wrap:wrap; margin-bottom:2px;">
              <span style="color:${(c.connected === 'TRUE' || c.connected === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Conn: ${(c.connected === 'TRUE' || c.connected === 'IYA') ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>'}</span>
              <span style="color:${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Cont: ${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '<i class="fa-solid fa-circle-check"></i>' : '<i class="fa-solid fa-circle-xmark"></i>'}</span>
              <span style="color:${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">Prosp: ${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '<i class="fa-solid fa-fire"></i>' : 'Belum'}</span>
              <span style="color:${(c.spk === 'TRUE' || c.spk === 'IYA') ? '#10b981' : '#94a3b8'}; font-weight:700;">SPK: ${(c.spk === 'TRUE' || c.spk === 'IYA') ? '<i class="fa-solid fa-award"></i>' : 'Belum'}</span>
            </div>
            ${c.reason_followup ? `<div style="font-size:10.5px; color:#334155; font-style:italic; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(c.reason_followup)}">"${escapeHtml(c.reason_followup)}"</div>` : ''}
            ${c.followup_date ? `<div style="font-size:9.5px; color:#94a3b8; font-family:monospace;">${escapeHtml(c.followup_date.substring(0, 16))}</div>` : ''}
          ` : `
            <div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(c.notes || '-')}">
              ${escapeHtml(c.notes || '-')}
            </div>
          `}
        </td>

        <!-- 8. Aksi -->
        <td style="text-align:right; min-width:210px;">
          <div style="display:flex; align-items:center; justify-content:flex-end; gap:5px;">
            <button class="btn-fu btn-fu-secondary" style="padding:6px 9px; font-size:11px; border-radius:8px; background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe;" onclick="openEditSingleCustomerModal(${c.id})" title="Ubah Data / Respon TAM (Bisa untuk 1 customer atau seluruh data perusahaan)">
              <i class="fa-solid fa-pen-to-square" style="color:#2563eb;"></i> Ubah
            </button>
            <button class="btn-fu btn-fu-secondary" style="padding:6px 9px; font-size:11px; border-radius:8px;" onclick="openCustomerDetailModal(${c.id})" title="Lihat Profil Lengkap Customer 360°">
              <i class="fa-solid fa-circle-info"></i> Detail
            </button>
            <button class="btn-fu btn-fu-emerald" style="padding:6px 9px; font-size:11px; border-radius:8px;" onclick="openWhatsAppDirect(${c.id})" title="Follow Up WhatsApp">
              <i class="fa-brands fa-whatsapp"></i> WA
            </button>
            ${(c.assigned_sales_id && parseInt(c.assigned_sales_id) > 0) ? `
              <button class="btn-fu" style="padding:6px 8px; font-size:11px; background:#fff7ed; color:#c2410c !important; border:1px solid #fed7aa; border-radius:8px;" onclick="unassignCustomerSingle(${c.id}, '${escapeJs(c.name)}', '${escapeJs((masterState.salesList.find(s => s.id == c.assigned_sales_id) || {}).name || 'Sales')}')" title="Batalkan Penugasan Sales">
                <i class="fa-solid fa-user-xmark"></i> Batal
              </button>
            ` : ''}
            <button class="btn-fu" style="padding:6px 8px; font-size:11px; background:#fef2f2; color:#ef4444 !important; border:1px solid #fecaca; border-radius:8px;" onclick="confirmDeleteCustomer(${c.id}, '${escapeJs(c.name)}')" title="Hapus Customer">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;

  // Sync Thead Checkbox State for current page items
  const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
  theadCheckboxes.forEach(cb => {
    cb.checked = pageItems.length > 0 && pageItems.every(c => masterState.selectedIds.includes(c.id));
  });

  // Render pagination bar
  renderPagination(startIndex, endIndex, totalCount, totalPages, currentPage, perPage);
}

function renderPagination(startIndex, endIndex, totalCount, totalPages, currentPage, perPage) {
  const container = document.getElementById('paginationContainer');
  if (!container) return;

  if (totalCount === 0) {
    container.innerHTML = '';
    return;
  }

  let buttonsHtml = '';

  // First & Prev buttons
  buttonsHtml += `
    <button class="fu-page-btn" ${currentPage <= 1 ? 'disabled' : ''} onclick="goToPage(1)" title="Halaman Pertama">
      <i class="fa-solid fa-angles-left"></i>
    </button>
    <button class="fu-page-btn" ${currentPage <= 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})" title="Halaman Sebelumnya">
      <i class="fa-solid fa-angle-left"></i>
    </button>
  `;

  // Page Numbers Sliding Window
  const maxVisiblePages = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  if (startPage > 1) {
    buttonsHtml += `<button class="fu-page-btn ${currentPage === 1 ? 'active' : ''}" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      buttonsHtml += `<span class="fu-page-ellipsis">&hellip;</span>`;
    }
  }

  for (let p = startPage; p <= endPage; p++) {
    buttonsHtml += `<button class="fu-page-btn ${p === currentPage ? 'active' : ''}" onclick="goToPage(${p})">${p}</button>`;
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      buttonsHtml += `<span class="fu-page-ellipsis">&hellip;</span>`;
    }
    buttonsHtml += `<button class="fu-page-btn ${currentPage === totalPages ? 'active' : ''}" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }

  // Next & Last buttons
  buttonsHtml += `
    <button class="fu-page-btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})" title="Halaman Berikutnya">
      <i class="fa-solid fa-angle-right"></i>
    </button>
    <button class="fu-page-btn" ${currentPage >= totalPages ? 'disabled' : ''} onclick="goToPage(${totalPages})" title="Halaman Terakhir">
      <i class="fa-solid fa-angles-right"></i>
    </button>
  `;

  container.innerHTML = `
    <div class="fu-pagination-info">
      <span>
        Menampilkan <b>${startIndex + 1} - ${endIndex}</b> dari <b>${totalCount}</b> data
      </span>
      <div class="fu-per-page-wrap">
        <label style="font-size:11px; color:#64748b; font-weight:700;">Baris per halaman:</label>
        <select class="fu-per-page-select" onchange="changePerPage(this.value)">
          <option value="25" ${perPage === 25 ? 'selected' : ''}>25</option>
          <option value="50" ${perPage === 50 ? 'selected' : ''}>50 (Default)</option>
          <option value="100" ${perPage === 100 ? 'selected' : ''}>100</option>
          <option value="200" ${perPage === 200 ? 'selected' : ''}>200</option>
        </select>
      </div>
    </div>
    <div class="fu-pagination-controls">
      ${buttonsHtml}
    </div>
  `;
}

function goToPage(page) {
  masterState.pagination.currentPage = page;
  renderCustomerTable();
  const tableWrap = document.querySelector('.followup-table-wrap');
  if (tableWrap) {
    tableWrap.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function changePerPage(perPage) {
  masterState.pagination.perPage = parseInt(perPage, 10) || 50;
  masterState.pagination.currentPage = 1;
  renderCustomerTable();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}

function escapeJs(str) {
  if (!str) return '';
  return String(str).replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// -------------------------------------------------------------
// CUSTOMER 360 DETAIL MODAL
// -------------------------------------------------------------
function openCustomerDetailModal(customerId) {
  const c = masterState.customers.find(x => String(x.id) === String(customerId));
  if (!c) {
    console.error('Customer not found for id', customerId);
    return;
  }

  if (!document.getElementById('modalCustomerDetail')) {
    const html = `
      <div class="modal-overlay" id="modalCustomerDetail" onclick="closeCustomerDetailModal()">
        <div class="modal-content" style="max-width:680px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-id-card"></i> Customer 360° Profile
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;" id="cdCustName">-</h3>
            </div>
            <button class="btn-close-modal" onclick="closeCustomerDetailModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div id="cdModalBody"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  document.getElementById('cdCustName').textContent = c.name;

  const body = document.getElementById('cdModalBody');
  body.innerHTML = `
    <!-- Top Highlights Banner -->
    <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#ffffff; border-radius:14px; padding:16px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
      <div>
        <div style="font-size:11px; color:#93c5fd; text-transform:uppercase; font-weight:800; letter-spacing:0.5px;">Target Rekomendasi TAM</div>
        <div style="font-size:18px; font-weight:900; color:#ffffff; margin-top:2px;"><i class="fa-solid fa-car"></i> ${c.recommended_model || c.car_model}</div>
        <div style="font-size:12px; color:#cbd5e1; margin-top:4px;">
          ${(c.alt_model_2 || c.alt_model_3) ? `Alternatif: <strong>${[c.alt_model_2, c.alt_model_3].filter(Boolean).join(' • ')}</strong>` : 'Rekomendasi Utama'}
        </div>
      </div>
      <div style="text-align:right;">
        <span style="display:inline-block; font-size:11px; font-weight:800; padding:4px 10px; border-radius:9999px; background:#d7123a; color:#ffffff;">
          ${c.priority || '4th Priority'}
        </span>
        <div style="font-size:11px; color:#6ee7b7; font-weight:700; margin-top:4px; font-family:monospace;">
          +${c.phone}
        </div>
      </div>
    </div>

    <!-- 2 Column Grid for Vehicle & Purchase History -->
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
      <!-- Card Left: Current Vehicle -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px;">
        <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-car" style="color:#d7123a;"></i> Kendaraan Saat Ini
        </div>
        <div style="font-size:12px; color:#475569; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Model Mobil:</span>
            <strong style="color:#0f172a;">${c.last_car_model || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Usia Kendaraan:</span>
            <strong style="color:#b45309;">${c.car_age || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>No. Rangka (VIN):</span>
            <span style="font-family:monospace; font-size:11px; color:#0f172a; font-weight:700;">${c.vin || '-'}</span>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Domisili:</span>
            <strong>${c.district ? `Kec. ${c.district}` : '-'}</strong>
          </div>
        </div>
      </div>

      <!-- Card Right: Dealer & Service History -->
      <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px;">
        <div style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-wrench" style="color:#2563eb;"></i> Riwayat Dealer & Servis
        </div>
        <div style="font-size:12px; color:#475569; display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between;">
            <span>Klaster TAM:</span>
            <strong style="color:#1d4ed8;">${c.cluster_name || '-'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Outlet DO Asal:</span>
            <strong style="color:#0f172a; font-size:11.5px;">${c.outlet_do || 'TUNAS TOYOTA KIARA CONDONG'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Kepatuhan Servis:</span>
            <strong style="color:#059669;">${c.service_compliance || '0%'}</strong>
          </div>
          <div style="display:flex; justify-content:space-between;">
            <span>Tipe Pelanggan:</span>
            <span style="font-weight:700; color:#0f172a;">${c.customer_type || 'RETAIL'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAM Sales Follow-Up Outcome Box -->
    <div style="background:#f0fdf4; border:1.5px solid #bbf7d0; border-radius:12px; padding:14px; margin-bottom:16px;">
      <div style="font-size:12px; font-weight:800; color:#166534; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
        <i class="fa-solid fa-clipboard-check"></i> Hasil Respon Follow-Up Standar TAM
      </div>
      <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:8px; margin-bottom:10px;">
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Connected</div>
          <strong style="font-size:12px; color:${(c.connected === 'TRUE' || c.connected === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.connected === 'TRUE' || c.connected === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Contacted</div>
          <strong style="font-size:12px; color:${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.contacted === 'TRUE' || c.contacted === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">Prospect</div>
          <strong style="font-size:12px; color:${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.prospect === 'TRUE' || c.prospect === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
        <div style="background:#ffffff; border:1px solid #dcfce7; border-radius:8px; padding:6px 8px; text-align:center;">
          <div style="font-size:10px; color:#64748b; font-weight:700;">SPK</div>
          <strong style="font-size:12px; color:${(c.spk === 'TRUE' || c.spk === 'IYA') ? '#16a34a' : '#dc2626'};">${(c.spk === 'TRUE' || c.spk === 'IYA') ? '✅ Iya' : '❌ Tidak'}</strong>
        </div>
      </div>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:11.5px; color:#334155;">
        <div>
          <span>Remarks:</span> <strong style="color:#0f172a;">${c.remarks || '-'}</strong>
        </div>
        <div>
          <span>Status FU:</span> <strong style="color:${c.sales_fu_status === 'Closed' ? '#dc2626' : '#2563eb'};">${c.sales_fu_status || 'Open'}</strong>
        </div>
        <div style="grid-column: span 2;">
          <span>Alasan / Catatan:</span> <strong style="color:#0f172a;">${c.reason_followup || c.notes || '-'}</strong>
        </div>
        <div style="grid-column: span 2; font-size:10.5px; color:#64748b; font-family:monospace;">
          📅 Waktu FU Otomatis: <strong>${c.followup_date || 'Belum di-FU'}</strong>
        </div>
      </div>
    </div>

    <!-- Status & Sales PIC Box -->
    <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:18px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
        <div>
          <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Status Follow-Up Saat Ini:</label>
          <span style="display:inline-block; font-size:12px; font-weight:800; padding:4px 10px; border-radius:8px; background:#eff6ff; color:#1d4ed8;">
            ${c.followup_status}
          </span>
        </div>
        <div>
          <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Sales PIC:</label>
          <strong style="font-size:12.5px; color:#0f172a;">
            ${(masterState.salesList.find(s => s.id == c.assigned_sales_id) || {}).name || 'Belum Ditugaskan'}
          </strong>
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display:flex; gap:8px; flex-wrap:wrap;">
      <button class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:12px;" onclick="closeCustomerDetailModal(); openWhatsAppDirect(${c.id});">
        <i class="fa-brands fa-whatsapp"></i> Follow Up WA
      </button>
      <button class="btn-fu btn-fu-secondary" style="background:#eff6ff; color:#1d4ed8 !important; border:1px solid #bfdbfe; padding:12px 14px;" onclick="closeCustomerDetailModal(); openEditSingleCustomerModal(${c.id});" title="Ubah data dan respon untuk customer ini atau seluruh data perusahaan">
        <i class="fa-solid fa-pen-to-square" style="color:#2563eb;"></i> Ubah Data
      </button>
      ${(c.assigned_sales_id && parseInt(c.assigned_sales_id) > 0) ? `
        <button class="btn-fu" style="background:#fff7ed; color:#c2410c; border:1px solid #fed7aa; padding:12px 14px;" onclick="closeCustomerDetailModal(); unassignCustomerSingle(${c.id}, '${escapeJs(c.name)}', '${escapeJs((masterState.salesList.find(s => s.id == c.assigned_sales_id) || {}).name || 'Sales')}');" title="Batalkan Penugasan Sales">
          <i class="fa-solid fa-user-xmark"></i> Batal Penugasan
        </button>
      ` : ''}
      <a href="tel:${c.phone}" class="btn-fu btn-fu-secondary" style="padding:12px 16px; text-decoration:none;">
        <i class="fa-solid fa-phone"></i> Telepon
      </a>
      <button class="btn-fu btn-fu-secondary" style="padding:12px 16px;" onclick="closeCustomerDetailModal()">
        Tutup
      </button>
    </div>
  `;

  const modal = document.getElementById('modalCustomerDetail');
  if (modal) {
    modal.classList.add('active');
    modal.classList.add('show');
    modal.style.display = 'flex';
  }
}

function closeCustomerDetailModal() {
  const modal = document.getElementById('modalCustomerDetail');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

function toggleSelectCustomer(id) {
  if (masterState.selectedIds.includes(id)) {
    masterState.selectedIds = masterState.selectedIds.filter(x => x !== id);
  } else {
    masterState.selectedIds.push(id);
  }
  renderCustomerTable();
  updateBulkActionBar();
}

function toggleSelectAll(checked) {
  const allList = masterState.customers || [];
  const perPage = masterState.pagination.perPage || 50;
  const currentPage = masterState.pagination.currentPage || 1;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage, allList.length);
  const pageItems = allList.slice(startIndex, endIndex);

  if (checked) {
    pageItems.forEach(c => {
      if (!masterState.selectedIds.includes(c.id)) {
        masterState.selectedIds.push(c.id);
      }
    });
  } else {
    const pageItemIds = pageItems.map(c => c.id);
    masterState.selectedIds = masterState.selectedIds.filter(id => !pageItemIds.includes(id));
  }
  renderCustomerTable();
  updateBulkActionBar();
}

function updateBulkActionBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCountSpan');
  if (!bar) return;

  if (masterState.selectedIds.length > 0) {
    bar.style.display = 'flex';
    countSpan.textContent = `${masterState.selectedIds.length} customer dipilih`;
  } else {
    bar.style.display = 'none';
  }
}

async function executeBulkAssign() {
  const salesId = document.getElementById('bulkSalesSelect').value;
  if (!salesId) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Sales', 'Silakan pilih wiraniaga target terlebih dahulu dari dropdown.', 'warning');
    } else {
      alert('Pilih sales target terlebih dahulu.');
    }
    return;
  }

  try {
    const res = await fetch('/api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds,
        sales_id: salesId
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil Ditugaskan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Bulk assign error', e);
  }
}

async function executeAutoDistribute() {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Bagi rata ${masterState.selectedIds.length} data customer yang dicentang ke seluruh wiraniaga aktif?`);
  } else {
    isConfirmed = confirm(`Bagi rata ${masterState.selectedIds.length} customer ke seluruh wiraniaga aktif?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds,
        auto_distribute: true
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Distribusi Selesai!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Auto distribute error', e);
  }
}

async function executeReleaseToPool() {
  if (masterState.selectedIds.length === 0) return;

  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Lepas ${masterState.selectedIds.length} data customer terpilih ke "Pool Rebutan Prospek" agar dapat diperebutkan oleh seluruh sales aktif?`);
  } else {
    isConfirmed = confirm(`Lepas ${masterState.selectedIds.length} data customer ke Pool Rebutan?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=release_to_pool', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil Dilepas!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Release to pool error', e);
  }
}

async function executeBulkUnassign() {
  if (masterState.selectedIds.length === 0) return;

  const count = masterState.selectedIds.length;
  let isConfirmed = false;

  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      title: 'Batalkan Penugasan Sales?',
      html: `Batalkan pembagian <strong>${count} customer</strong> dari sales?<br><br><span style="font-size:12px; color:#64748b;">Customer akan dikembalikan ke status "Belum Ditugaskan / Pool Rebutan" sehingga dapat ditugaskan ke sales lain.</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-user-xmark"></i> Ya, Batalkan Penugasan',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b'
    });
    isConfirmed = res.isConfirmed;
  } else if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Batalkan penugasan ${count} data customer terpilih dari sales?`);
  } else {
    isConfirmed = confirm(`Batalkan penugasan ${count} data customer terpilih dari sales?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=unassign_sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: masterState.selectedIds
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Penugasan Dibatalkan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data.message || 'Gagal membatalkan penugasan', 'error');
      } else {
        alert(data.message || 'Gagal membatalkan penugasan');
      }
    }
  } catch (e) {
    console.error('Bulk unassign error', e);
  }
}

async function unassignCustomerSingle(customerId, custName, salesName) {
  let isConfirmed = false;

  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      title: 'Batalkan Penugasan Sales?',
      html: `Batalkan pembagian customer <strong>${escapeHtml(custName)}</strong> dari sales <strong>${escapeHtml(salesName)}</strong>?<br><br><span style="font-size:12px; color:#64748b;">Customer ini akan dikembalikan ke status "Belum Ditugaskan / Pool Rebutan".</span>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-user-xmark"></i> Ya, Batalkan',
      cancelButtonText: 'Kembali',
      confirmButtonColor: '#d97706',
      cancelButtonColor: '#64748b'
    });
    isConfirmed = res.isConfirmed;
  } else if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Batalkan pembagian customer "${custName}" dari sales "${salesName}"?`);
  } else {
    isConfirmed = confirm(`Batalkan pembagian customer "${custName}" dari sales "${salesName}"?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=unassign_sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: [customerId]
      })
    });
    const data = await res.json();
    if (data.success) {
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Penugasan Dibatalkan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data.message || 'Gagal membatalkan penugasan', 'error');
      } else {
        alert(data.message || 'Gagal membatalkan penugasan');
      }
    }
  } catch (e) {
    console.error('Single unassign error', e);
  }
}

async function inlineUpdateStatus(customerId, status) {
  try {
    await fetch('/api/api_followup.php?action=update_status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: customerId, status: status })
    });
    loadMasterStats();
  } catch (e) {
    console.error('Inline update status error', e);
  }
}

async function inlineUpdateSales(customerId, salesId) {
  try {
    const res = await fetch('/api/api_followup.php?action=bulk_assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_ids: [customerId],
        sales_id: salesId
      })
    });
    const data = await res.json();
    if (data.success) {
      await loadMasterStats();
      await loadMasterCustomers(false);
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Update Sales PIC', data.message, 'success');
      }
    }
  } catch (e) {
    console.error('Inline update sales error', e);
  }
}

async function sendTaskNotificationToSales(salesId) {
  if (!salesId) return;
  try {
    const res = await fetch('/api/api_followup.php?action=notify_sales_task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sales_id: salesId })
    });
    const data = await res.json();
    if (data.success && data.wa_url) {
      window.open(data.wa_url, '_blank');
    }
  } catch (e) {
    console.error('Notify sales error', e);
  }
}

// -------------------------------------------------------------
// RECALL ALL DATABASES FROM A SPECIFIC SALES MODAL
// -------------------------------------------------------------
function openRecallBySalesModal(preselectedSalesId = null) {
  let modal = document.getElementById('modalRecallBySales');
  if (!modal) {
    const html = `
      <div class="modal-overlay" id="modalRecallBySales" onclick="closeRecallBySalesModal()">
        <div class="modal-content" style="max-width:520px; border-radius:18px; padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:18px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#fff7ed; color:#c2410c; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px; border:1px solid #fed7aa;">
                <i class="fa-solid fa-user-xmark"></i> Batal Bagi Database per Sales
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0f172a; margin:0;">Tarik Semua Database Sales</h3>
            </div>
            <button class="btn-close-modal" onclick="closeRecallBySalesModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div style="margin-bottom:16px;">
            <p style="font-size:12.5px; color:#64748b; line-height:1.5; margin-bottom:16px;">
              Pilih wiraniaga di bawah ini untuk <strong>menarik &amp; membatalkan seluruh database</strong> yang sedang dibagikan kepadanya. Seluruh database yang ditarik akan dikembalikan ke status <em>"Belum Ditugaskan / Pool Rebutan"</em>.
            </p>

            <div class="form-group-fu" style="margin-bottom:14px;">
              <label style="font-size:12px; font-weight:800; color:#334155; margin-bottom:6px; display:block;">Pilih Sales Wiraniaga:</label>
              <select id="recallSalesSelect" class="fu-select" style="width:100%; font-size:13px; font-weight:700; padding:10px 14px;" onchange="updateRecallSalesInfo()">
                <option value="">-- Pilih Sales Target --</option>
              </select>
            </div>

            <!-- Info Preview Box -->
            <div id="recallSalesInfoBox" style="display:none; background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:12px; padding:12px 14px; margin-bottom:14px;">
              <div style="font-size:11.5px; color:#64748b; margin-bottom:4px;">Total Database yang Sedang Dipegang:</div>
              <div style="font-size:16px; font-weight:900; color:#0f172a;" id="recallSalesCountText">0 Customer</div>
              <div style="font-size:11px; color:#b45309; margin-top:3px;" id="recallSalesPendingText">0 Belum di-FU</div>
            </div>

            <div class="form-group-fu" style="margin-bottom:18px;">
              <label style="font-size:12px; font-weight:800; color:#334155; margin-bottom:8px; display:block;">Cakupan Database yang Ditarik:</label>
              <div style="display:flex; flex-direction:column; gap:8px;">
                <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#1e293b; background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:10px; cursor:pointer;">
                  <input type="radio" name="recallScope" value="all" checked style="accent-color:#d7123a; width:16px; height:16px;">
                  <div>
                    <strong style="display:block;">Tarik Seluruh Database (Semua Status)</strong>
                    <span style="font-size:11px; color:#64748b;">Membatalkan seluruh database customer yang dipegang sales ini.</span>
                  </div>
                </label>
                <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#1e293b; background:#f8fafc; border:1px solid #e2e8f0; padding:10px 12px; border-radius:10px; cursor:pointer;">
                  <input type="radio" name="recallScope" value="pending" style="accent-color:#d7123a; width:16px; height:16px;">
                  <div>
                    <strong style="display:block;">Hanya yang Belum Di-Follow Up</strong>
                    <span style="font-size:11px; color:#64748b;">Hanya menarik customer yang statusnya masih Belum Dihubungi (tidak mengganggu yang sudah deal/proses).</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="button" class="btn-fu" style="flex:1; justify-content:center; padding:12px; background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:#fff !important; font-weight:800; font-size:13px; border:none; box-shadow:0 4px 14px rgba(234,88,12,0.35);" onclick="executeRecallBySales()">
              <i class="fa-solid fa-user-xmark"></i> Tarik &amp; Batalkan Semua
            </button>
            <button type="button" class="btn-fu btn-fu-secondary" style="padding:12px 18px;" onclick="closeRecallBySalesModal()">
              Batal
            </button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
    modal = document.getElementById('modalRecallBySales');
  }

  // Populate sales dropdown
  const select = document.getElementById('recallSalesSelect');
  select.innerHTML = '<option value="">-- Pilih Sales Target --</option>';
  masterState.salesList.forEach(s => {
    select.innerHTML += `<option value="${s.id}" ${preselectedSalesId && String(s.id) === String(preselectedSalesId) ? 'selected' : ''}>${s.name} (${s.total_customers || 0} Customer)</option>`;
  });

  updateRecallSalesInfo();

  modal.classList.add('active');
  modal.classList.add('show');
  modal.style.display = 'flex';
}

function closeRecallBySalesModal() {
  const modal = document.getElementById('modalRecallBySales');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('show');
    modal.style.display = 'none';
  }
}

function updateRecallSalesInfo() {
  const select = document.getElementById('recallSalesSelect');
  const infoBox = document.getElementById('recallSalesInfoBox');
  const countText = document.getElementById('recallSalesCountText');
  const pendingText = document.getElementById('recallSalesPendingText');

  if (!select || !infoBox) return;
  const salesId = select.value;
  if (!salesId) {
    infoBox.style.display = 'none';
    return;
  }

  const s = masterState.salesList.find(x => String(x.id) === String(salesId));
  if (s) {
    infoBox.style.display = 'block';
    countText.textContent = `${s.total_customers || 0} Data Customer`;
    pendingText.textContent = `${s.pending_customers || 0} Customer Belum Dihubungi`;
  }
}

async function executeRecallBySales() {
  const select = document.getElementById('recallSalesSelect');
  const salesId = select.value;
  if (!salesId) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Sales', 'Silakan pilih wiraniaga target yang ingin ditarik datanya.', 'warning');
    } else {
      alert('Pilih wiraniaga target terlebih dahulu.');
    }
    return;
  }

  const s = masterState.salesList.find(x => String(x.id) === String(salesId));
  const salesName = s ? s.name : 'Sales';
  const scopeEl = document.querySelector('input[name="recallScope"]:checked');
  const scope = scopeEl ? scopeEl.value : 'all';

  let isConfirmed = false;
  const scopeDesc = scope === 'pending' ? 'yang <b>Belum Di-Follow Up</b>' : '<b>SELURUHNYA</b>';
  const confirmHtml = `Tarik dan batalkan pembagian database ${scopeDesc} dari sales <strong>${escapeHtml(salesName)}</strong>?<br><br><span style="font-size:12px; color:#64748b;">Semua data yang ditarik akan langsung masuk ke Pool Rebutan / Belum Ditugaskan.</span>`;

  if (typeof Swal !== 'undefined') {
    const res = await Swal.fire({
      title: 'Konfirmasi Tarik Database?',
      html: confirmHtml,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '<i class="fa-solid fa-user-xmark"></i> Ya, Tarik Semua',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#ea580c',
      cancelButtonColor: '#64748b'
    });
    isConfirmed = res.isConfirmed;
  } else if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Tarik semua database dari ${salesName}?`);
  } else {
    isConfirmed = confirm(`Tarik semua database dari ${salesName}?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=unassign_sales', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sales_id: parseInt(salesId, 10),
        scope: scope
      })
    });
    const data = await res.json();
    if (data.success) {
      closeRecallBySalesModal();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Berhasil Ditarik!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data.message || 'Gagal menarik data', 'error');
      } else {
        alert(data.message || 'Gagal menarik data');
      }
    }
  } catch (e) {
    console.error('Execute recall error', e);
  }
}

// =============================================================
// EDIT SINGLE CUSTOMER / PERUSAHAAN (DENGAN PILIHAN LINGKUP)
// =============================================================
function openEditSingleCustomerModal(customerId) {
  const c = masterState.customers.find(x => String(x.id) === String(customerId));
  if (!c) {
    console.error('Customer not found for id', customerId);
    return;
  }

  // Detect candidate company name (e.g. "PT Sudeco", "CV Makmur", etc.)
  const rawName = (c.name || '').trim();
  let companyKeyword = rawName;
  if (/^(PT|CV|UD|TOKO|YAYASAN|KOPERASI)\.?\s+/i.test(rawName)) {
    const parts = rawName.split(/\s+/);
    companyKeyword = parts.slice(0, 2).join(' ');
  }

  // Count how many matching records exist in current dataset
  const matchingCompanyCount = masterState.customers.filter(x => {
    return (x.name || '').toLowerCase().includes(companyKeyword.toLowerCase()) || 
           (x.notes || '').toLowerCase().includes(companyKeyword.toLowerCase());
  }).length;

  const currentSearch = (masterState.filters.search || '').trim();
  const matchingSearchCount = currentSearch ? masterState.customers.length : 0;

  if (document.getElementById('modalEditSingleCustomer')) {
    document.getElementById('modalEditSingleCustomer').remove();
  }

  const isConnected = (c.connected === 'TRUE' || c.connected === 'IYA' || c.connected === '1');
  const isContacted = (c.contacted === 'TRUE' || c.contacted === 'IYA' || c.contacted === '1');
  const isProspect = (c.prospect === 'TRUE' || c.prospect === 'IYA' || c.prospect === '1');
  const isSpk = (c.spk === 'TRUE' || c.spk === 'IYA' || c.spk === '1');

  const html = `
    <div class="modal-overlay active" id="modalEditSingleCustomer" style="display:flex; position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); align-items:center; justify-content:center;" onclick="closeEditSingleCustomerModal()">
      <div class="modal-content" style="max-width:680px; width:95%; border-radius:18px; padding:24px; max-height:92vh; overflow-y:auto;" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-pen-to-square"></i> Edit Data & Status TAM
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">${escapeHtml(c.name)}</h3>
            <span style="font-size:11.5px; color:#64748b;">${escapeHtml(c.recommended_model || c.car_model || '-')} &bull; +${c.phone}</span>
          </div>
          <button class="btn-close-modal" onclick="closeEditSingleCustomerModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form id="formEditSingleCustomer" onsubmit="executeSaveEditCustomer(event, ${c.id})">
          
          <!-- 4 Grid TAM Status Toggle -->
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px; margin-bottom:16px;">
            <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-sliders" style="color:#d7123a;"></i> Indikator Respon TAM (Standar Toyota)
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">1. Connected (No. Tersambung):</label>
                <select id="editSingleConnected" class="fu-select" style="font-size:12.5px;" onchange="handleSingleModalTamChange('connected')">
                  <option value="TRUE" ${isConnected ? 'selected' : ''}>✅ YA (Tersambung / Aktif)</option>
                  <option value="FALSE" ${!isConnected ? 'selected' : ''}>❌ TIDAK (Nomor Salah / Tidak Aktif)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">2. Contacted (Komunikasi Terkirim):</label>
                <select id="editSingleContacted" class="fu-select" style="font-size:12.5px;" onchange="handleSingleModalTamChange('contacted')">
                  <option value="TRUE" ${isContacted ? 'selected' : ''}>✅ YA (Ada Respon / Terkirim)</option>
                  <option value="FALSE" ${!isContacted ? 'selected' : ''}>❌ TIDAK (Tidak Diangkat / Centang 1)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">3. Prospect (Minat Beli / Upgrade):</label>
                <select id="editSingleProspect" class="fu-select" style="font-size:12.5px;" onchange="handleSingleModalTamChange('prospect')">
                  <option value="TRUE" ${isProspect ? 'selected' : ''}>🔥 YA (Tertarik / Janjian / Simulasi)</option>
                  <option value="FALSE" ${!isProspect ? 'selected' : ''}>⚪ TIDAK (Belum Tertarik / Menolak)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">4. SPK (Closing Transaksi):</label>
                <select id="editSingleSpk" class="fu-select" style="font-size:12.5px;" onchange="handleSingleModalTamChange('spk')">
                  <option value="TRUE" ${isSpk ? 'selected' : ''}>🏆 YA (Closing / SPK)</option>
                  <option value="FALSE" ${!isSpk ? 'selected' : ''}>⚪ Belum SPK</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Status CRM & Sales PIC -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
            <div>
              <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Status Follow-Up Utama:</label>
              <select id="editSingleStatus" class="fu-select" style="font-size:12.5px;">
                <option value="Belum Dihubungi" ${c.followup_status === 'Belum Dihubungi' ? 'selected' : ''}>⚪ Belum Dihubungi</option>
                <option value="Menunggu Respon" ${c.followup_status === 'Menunggu Respon' ? 'selected' : ''}>⏳ Menunggu Respon</option>
                <option value="Tertarik / Jadwal Servis" ${c.followup_status === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>🔥 Tertarik / Jadwal Servis</option>
                <option value="Deal / Selesai" ${c.followup_status === 'Deal / Selesai' ? 'selected' : ''}>🏆 Deal / Selesai</option>
                <option value="Tidak Tertarik" ${c.followup_status === 'Tidak Tertarik' ? 'selected' : ''}>❌ Tidak Tertarik</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Status FU (Open/Closed):</label>
              <select id="editSingleSalesFuStatus" class="fu-select" style="font-size:12.5px;">
                <option value="Open" ${(c.sales_fu_status || 'Open') === 'Open' ? 'selected' : ''}>🔵 Open (Masih Berjalan)</option>
                <option value="Closed" ${c.sales_fu_status === 'Closed' ? 'selected' : ''}>🔴 Closed (Selesai)</option>
              </select>
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:14px;">
            <div>
              <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Catatan Remarks:</label>
              <select id="editSingleRemarks" class="fu-select" style="font-size:12.5px;">
                <option value="">-- Pilih Remarks Standar --</option>
                <option value="Customer tertarik" ${c.remarks === 'Customer tertarik' ? 'selected' : ''}>Customer tertarik</option>
                <option value="Customer janjian" ${c.remarks === 'Customer janjian' ? 'selected' : ''}>Customer janjian</option>
                <option value="Minta simulasi kredit" ${c.remarks === 'Minta simulasi kredit' ? 'selected' : ''}>Minta simulasi kredit</option>
                <option value="Janjian test drive" ${c.remarks === 'Janjian test drive' ? 'selected' : ''}>Janjian test drive</option>
                <option value="SPK berhasil" ${c.remarks === 'SPK berhasil' ? 'selected' : ''}>SPK berhasil</option>
                <option value="Customer pending" ${c.remarks === 'Customer pending' ? 'selected' : ''}>Customer pending</option>
                <option value="Customer menolak" ${c.remarks === 'Customer menolak' ? 'selected' : ''}>Customer menolak</option>
                <option value="Beli di dealer/merk lain" ${c.remarks === 'Beli di dealer/merk lain' ? 'selected' : ''}>Beli di dealer/merk lain</option>
                <option value="Customer tidak aktif" ${c.remarks === 'Customer tidak aktif' ? 'selected' : ''}>Customer tidak aktif</option>
                <option value="Customer tidak diangkat" ${c.remarks === 'Customer tidak diangkat' ? 'selected' : ''}>Customer tidak diangkat</option>
              </select>
            </div>
            <div>
              <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Sales PIC Wiraniaga:</label>
              <select id="editSingleSalesPic" class="fu-select" style="font-size:12.5px;">
                <option value="0">-- Belum Ditugaskan / Batal Penugasan --</option>
                ${masterState.salesList.map(s => `
                  <option value="${s.id}" ${c.assigned_sales_id == s.id ? 'selected' : ''}>${escapeHtml(s.name)}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Alasan / Keterangan Tambahan:</label>
            <input type="text" id="editSingleNotes" class="fu-input" style="font-size:12.5px;" value="${escapeHtml(c.reason_followup || c.notes || '')}" placeholder="Masukkan catatan respon follow-up...">
          </div>

          <!-- LINGKUP PENERAPAN PERUBAHAN (Sesuai Permintaan User) -->
          <div style="background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border:1.5px solid #93c5fd; border-radius:14px; padding:14px 16px; margin-bottom:18px;">
            <div style="font-size:12.5px; font-weight:900; color:#1e40af; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
              <i class="fa-solid fa-arrows-split-up-and-left"></i> Pilih Lingkup Penerapan Perubahan:
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:8px 12px; border-radius:10px; border:1px solid #bfdbfe;">
                <input type="radio" name="editCustomerScope" value="single" checked style="accent-color:#d7123a; width:16px; height:16px;">
                <div>
                  <strong>Hanya ubah 1 data customer ini</strong>
                  <span style="font-size:11px; color:#64748b; display:block;">Perubahan hanya diterapkan pada customer "${escapeHtml(c.name)}".</span>
                </div>
              </label>

              ${(companyKeyword && matchingCompanyCount > 1) ? `
                <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:8px 12px; border-radius:10px; border:1px solid #bfdbfe;">
                  <input type="radio" name="editCustomerScope" value="company_name" style="accent-color:#d7123a; width:16px; height:16px;">
                  <div>
                    <strong>Ubah SEMUA data perusahaan "${escapeHtml(companyKeyword)}" (<span style="color:#d7123a; font-weight:800;">${matchingCompanyCount} customer</span>)</strong>
                    <span style="font-size:11px; color:#64748b; display:block;">Terapkan status ini sekaligus ke seluruh data yang bernama/mengandung "${escapeHtml(companyKeyword)}".</span>
                  </div>
                </label>
              ` : ''}

              ${(currentSearch && matchingSearchCount > 1) ? `
                <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:8px 12px; border-radius:10px; border:1px solid #bfdbfe;">
                  <input type="radio" name="editCustomerScope" value="search" style="accent-color:#d7123a; width:16px; height:16px;">
                  <div>
                    <strong>Ubah SEMUA data hasil pencarian "${escapeHtml(currentSearch)}" (<span style="color:#d7123a; font-weight:800;">${matchingSearchCount} customer</span>)</strong>
                    <span style="font-size:11px; color:#64748b; display:block;">Terapkan ke seluruh baris yang sedang tampil sesuai filter pencarian.</span>
                  </div>
                </label>
              ` : ''}
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" class="btn-fu btn-fu-crimson" style="flex:1; justify-content:center; padding:12px; font-size:13.5px;">
              <i class="fa-solid fa-floppy-disk"></i> Simpan Perubahan Data
            </button>
            <button type="button" class="btn-fu btn-fu-secondary" style="padding:12px 20px;" onclick="closeEditSingleCustomerModal()">
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeEditSingleCustomerModal() {
  const modal = document.getElementById('modalEditSingleCustomer');
  if (modal) {
    modal.remove();
  }
}

async function executeSaveEditCustomer(e, customerId) {
  e.preventDefault();

  const connected = document.getElementById('editSingleConnected').value;
  const contacted = document.getElementById('editSingleContacted').value;
  const prospect = document.getElementById('editSingleProspect').value;
  const spk = document.getElementById('editSingleSpk').value;
  const status = document.getElementById('editSingleStatus').value;
  const sales_fu_status = document.getElementById('editSingleSalesFuStatus').value;
  const remarks = document.getElementById('editSingleRemarks').value;
  const assigned_sales_id = document.getElementById('editSingleSalesPic').value;
  const notes = document.getElementById('editSingleNotes').value;

  const scopeEl = document.querySelector('input[name="editCustomerScope"]:checked');
  const scope = scopeEl ? scopeEl.value : 'single';

  const c = masterState.customers.find(x => String(x.id) === String(customerId));
  const rawName = (c?.name || '').trim();
  let companyKeyword = rawName;
  if (/^(PT|CV|UD|TOKO|YAYASAN|KOPERASI)\.?\s+/i.test(rawName)) {
    const parts = rawName.split(/\s+/);
    companyKeyword = parts.slice(0, 2).join(' ');
  }

  const payload = {
    scope: scope,
    id: customerId,
    company_name: companyKeyword,
    search: (masterState.filters.search || '').trim(),
    connected: connected,
    contacted: contacted,
    prospect: prospect,
    spk: spk,
    status: status,
    sales_fu_status: sales_fu_status,
    remarks: remarks,
    assigned_sales_id: assigned_sales_id,
    notes: notes
  };

  try {
    const res = await fetch('/api/api_followup.php?action=batch_update_customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeEditSingleCustomerModal();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Perubahan Berhasil Disimpan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal Menyimpan', data.message || 'Gagal memperbarui data', 'error');
      } else {
        alert(data.message || 'Gagal memperbarui data');
      }
    }
  } catch (err) {
    console.error('Error saving customer edits', err);
  }
}

// -------------------------------------------------------------
// SMART DECISION HANDLER FOR SINGLE EDIT MODAL
// -------------------------------------------------------------
function handleSingleModalTamChange(field) {
  const elConnected = document.getElementById('editSingleConnected');
  const elContacted = document.getElementById('editSingleContacted');
  const elProspect = document.getElementById('editSingleProspect');
  const elSpk = document.getElementById('editSingleSpk');
  const elRemarks = document.getElementById('editSingleRemarks');
  const elStatus = document.getElementById('editSingleStatus');
  const elSalesFuStatus = document.getElementById('editSingleSalesFuStatus');

  if (!elConnected || !elContacted || !elProspect || !elSpk) return;

  const connectedVal = elConnected.value;
  const contactedVal = elContacted.value;
  const prospectVal = elProspect.value;
  const spkVal = elSpk.value;

  if (field === 'connected') {
    if (connectedVal === 'FALSE') {
      // 1. Connected TIDAK -> TIDAK SEMUA & Customer tidak aktif
      elContacted.value = 'FALSE';
      elProspect.value = 'FALSE';
      elSpk.value = 'FALSE';
      if (elRemarks) elRemarks.value = 'Customer tidak aktif';
      if (elStatus) elStatus.value = 'Tidak Tertarik';
      if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
    } else if (connectedVal === 'TRUE') {
      if (elRemarks && elRemarks.value === 'Customer tidak aktif') {
        elRemarks.value = 'Customer pending';
      }
    }
  } else if (field === 'contacted') {
    if (contactedVal === 'FALSE') {
      // 2. Connected IYA tapi Contacted TIDAK -> Customer tidak diangkat
      elConnected.value = 'TRUE';
      elProspect.value = 'FALSE';
      elSpk.value = 'FALSE';
      if (elRemarks) elRemarks.value = 'Customer tidak diangkat';
      if (elStatus) elStatus.value = 'Menunggu Respon';
    } else if (contactedVal === 'TRUE') {
      elConnected.value = 'TRUE';
      if (elRemarks && (elRemarks.value === 'Customer tidak aktif' || elRemarks.value === 'Customer tidak diangkat')) {
        elRemarks.value = 'Customer pending';
      }
    }
  } else if (field === 'prospect') {
    if (prospectVal === 'FALSE') {
      // 3. Prospek TIDAK -> Customer menolak & SPK TIDAK
      elConnected.value = 'TRUE';
      elContacted.value = 'TRUE';
      elSpk.value = 'FALSE';
      if (elRemarks) elRemarks.value = 'Customer menolak';
      if (elStatus) elStatus.value = 'Tidak Tertarik';
      if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
    } else if (prospectVal === 'TRUE') {
      // 4. Prospek IYA -> Customer tertarik & Connected/Contacted IYA
      elConnected.value = 'TRUE';
      elContacted.value = 'TRUE';
      if (elSpk.value !== 'TRUE') {
        if (elRemarks) elRemarks.value = 'Customer tertarik';
        if (elStatus) elStatus.value = 'Tertarik / Jadwal Servis';
        if (elSalesFuStatus) elSalesFuStatus.value = 'Open';
      }
    }
  } else if (field === 'spk') {
    if (spkVal === 'TRUE') {
      // 5. SPK IYA (Semuanya IYA) -> SPK berhasil
      elConnected.value = 'TRUE';
      elContacted.value = 'TRUE';
      elProspect.value = 'TRUE';
      if (elRemarks) elRemarks.value = 'SPK berhasil';
      if (elStatus) elStatus.value = 'Deal / Selesai';
      if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
    } else if (spkVal === 'FALSE') {
      if (elProspect.value === 'TRUE') {
        if (elRemarks) elRemarks.value = 'Customer tertarik';
        if (elStatus) elStatus.value = 'Tertarik / Jadwal Servis';
        if (elSalesFuStatus) elSalesFuStatus.value = 'Open';
      } else {
        if (elRemarks) elRemarks.value = 'Customer pending';
      }
    }
  }
}

// -------------------------------------------------------------
// SMART DECISION HANDLER FOR BATCH EDIT MODAL
// -------------------------------------------------------------
function handleBatchModalTamChange(field) {
  const elConnected = document.getElementById('batchConnected');
  const elContacted = document.getElementById('batchContacted');
  const elProspect = document.getElementById('batchProspect');
  const elSpk = document.getElementById('batchSpk');
  const elRemarks = document.getElementById('batchRemarks');
  const elStatus = document.getElementById('batchStatus');
  const elSalesFuStatus = document.getElementById('batchSalesFuStatus');

  if (!elConnected || !elContacted || !elProspect || !elSpk) return;

  const connectedVal = elConnected.value;
  const contactedVal = elContacted.value;
  const prospectVal = elProspect.value;
  const spkVal = elSpk.value;

  if (field === 'connected' && connectedVal === 'FALSE') {
    elContacted.value = 'FALSE';
    elProspect.value = 'FALSE';
    elSpk.value = 'FALSE';
    if (elRemarks) elRemarks.value = 'Customer tidak aktif';
    if (elStatus) elStatus.value = 'Tidak Tertarik';
    if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
  } else if (field === 'contacted' && contactedVal === 'FALSE') {
    if (elConnected.value !== 'ignore') elConnected.value = 'TRUE';
    elProspect.value = 'FALSE';
    elSpk.value = 'FALSE';
    if (elRemarks) elRemarks.value = 'Customer tidak diangkat';
    if (elStatus) elStatus.value = 'Menunggu Respon';
  } else if (field === 'prospect' && prospectVal === 'FALSE') {
    if (elConnected.value !== 'ignore') elConnected.value = 'TRUE';
    if (elContacted.value !== 'ignore') elContacted.value = 'TRUE';
    elSpk.value = 'FALSE';
    if (elRemarks) elRemarks.value = 'Customer menolak';
    if (elStatus) elStatus.value = 'Tidak Tertarik';
    if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
  } else if (field === 'prospect' && prospectVal === 'TRUE') {
    if (elConnected.value !== 'ignore') elConnected.value = 'TRUE';
    if (elContacted.value !== 'ignore') elContacted.value = 'TRUE';
    if (elSpk.value !== 'TRUE') {
      if (elRemarks) elRemarks.value = 'Customer tertarik';
      if (elStatus) elStatus.value = 'Tertarik / Jadwal Servis';
      if (elSalesFuStatus) elSalesFuStatus.value = 'Open';
    }
  } else if (field === 'spk' && spkVal === 'TRUE') {
    if (elConnected.value !== 'ignore') elConnected.value = 'TRUE';
    if (elContacted.value !== 'ignore') elContacted.value = 'TRUE';
    if (elProspect.value !== 'ignore') elProspect.value = 'TRUE';
    if (elRemarks) elRemarks.value = 'SPK berhasil';
    if (elStatus) elStatus.value = 'Deal / Selesai';
    if (elSalesFuStatus) elSalesFuStatus.value = 'Closed';
  }
}

// =============================================================
// MODAL UBAH STATUS / DATA MASSAL (BATCH UPDATE CRM)
// =============================================================
function openBatchEditModal(initialScope = null) {
  const selectedCount = masterState.selectedIds.length;
  const currentSearch = (masterState.filters.search || '').trim();
  const searchCount = masterState.customers.length;

  let defaultScope = 'search';
  if (initialScope === 'selected' || selectedCount > 0) {
    defaultScope = 'selected';
  } else if (currentSearch) {
    defaultScope = 'search';
  } else {
    defaultScope = 'company_name';
  }

  if (document.getElementById('modalBatchEditMaster')) {
    document.getElementById('modalBatchEditMaster').remove();
  }

  const html = `
    <div class="modal-overlay active" id="modalBatchEditMaster" style="display:flex; position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); align-items:center; justify-content:center;" onclick="closeBatchEditModal()">
      <div class="modal-content" style="max-width:720px; width:95%; border-radius:18px; padding:24px; max-height:92vh; overflow-y:auto;" onclick="event.stopPropagation()">
        
        <!-- Header -->
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-layer-group"></i> Batch Data Update Manager
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Ubah Data & Respon Massal</h3>
            <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">Perbarui status Connected, Contacted, Prospect, SPK, atau Sales PIC sekaligus untuk banyak data atau 1 perusahaan.</p>
          </div>
          <button class="btn-close-modal" onclick="closeBatchEditModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form id="formBatchEditMaster" onsubmit="executeBatchUpdateMaster(event)">
          
          <!-- 1. PILIH CAKUPAN / TARGET DATA -->
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:14px 16px; margin-bottom:16px;">
            <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">
              <i class="fa-solid fa-crosshairs" style="color:#d7123a;"></i> 1. Tentukan Data yang Ingin Diubah:
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:10px 12px; border-radius:10px; border:1.5px solid #e2e8f0;">
                <input type="radio" name="batchScopeChoice" value="selected" ${defaultScope === 'selected' ? 'checked' : ''} style="accent-color:#d7123a; width:16px; height:16px;">
                <div>
                  <strong>Data yang Sedang Dicentang (${selectedCount} Customer)</strong>
                  <span style="font-size:11px; color:#64748b; display:block;">Hanya ubah ${selectedCount} data yang Anda centang pada tabel.</span>
                </div>
              </label>

              <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:10px 12px; border-radius:10px; border:1.5px solid #e2e8f0;">
                <input type="radio" name="batchScopeChoice" value="search" ${defaultScope === 'search' ? 'checked' : ''} style="accent-color:#d7123a; width:16px; height:16px;">
                <div style="flex:1;">
                  <strong>Semua Data Hasil Pencarian Saat Ini (${searchCount} Customer)</strong>
                  <span style="font-size:11px; color:#64748b; display:block;">Kata kunci: "${escapeHtml(currentSearch || 'Semua Data')}"</span>
                </div>
              </label>

              <label style="display:flex; align-items:center; gap:10px; font-size:12.5px; color:#0f172a; cursor:pointer; background:#ffffff; padding:10px 12px; border-radius:10px; border:1.5px solid #e2e8f0;">
                <input type="radio" name="batchScopeChoice" value="company_name" ${defaultScope === 'company_name' ? 'checked' : ''} style="accent-color:#d7123a; width:16px; height:16px;">
                <div style="flex:1;">
                  <strong>Berdasarkan Nama PT / Perusahaan / Kata Kunci Tertentu</strong>
                  <input type="text" id="batchCustomCompanyName" class="fu-input" placeholder="Ketik nama (contoh: PT Sudeco)..." value="${escapeHtml(currentSearch || '')}" style="font-size:12px; padding:6px 10px; margin-top:6px;" onclick="document.querySelector('input[name=\\'batchScopeChoice\\'][value=\\'company_name\\']').checked = true;">
                </div>
              </label>
            </div>
          </div>

          <!-- 2. PILIH KOLOM YANG INGIN DIUBAH -->
          <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:18px;">
            <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">
              <i class="fa-solid fa-pen-ruler" style="color:#2563eb;"></i> 2. Atur Nilai Baru yang Ingin Diterapkan:
            </div>

            <!-- Indikator TAM -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Connected (No. Tersambung):</label>
                <select id="batchConnected" class="fu-select" style="font-size:12px;" onchange="handleBatchModalTamChange('connected')">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="TRUE">✅ YA (Tersambung / Aktif)</option>
                  <option value="FALSE">❌ TIDAK (Tidak Aktif / Salah Nomor)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Contacted (Ada Respon):</label>
                <select id="batchContacted" class="fu-select" style="font-size:12px;" onchange="handleBatchModalTamChange('contacted')">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="TRUE">✅ YA (Ada Respon / Terkirim)</option>
                  <option value="FALSE">❌ TIDAK (Tidak Diangkat / Centang 1)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Prospect (Minat Beli / Upgrade):</label>
                <select id="batchProspect" class="fu-select" style="font-size:12px;" onchange="handleBatchModalTamChange('prospect')">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="TRUE">🔥 YA (Tertarik / Janjian / Simulasi)</option>
                  <option value="FALSE">⚪ TIDAK (Belum Tertarik / Menolak)</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">SPK (Closing Transaksi):</label>
                <select id="batchSpk" class="fu-select" style="font-size:12px;" onchange="handleBatchModalTamChange('spk')">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="TRUE">🏆 YA (Closing / SPK)</option>
                  <option value="FALSE">⚪ Belum SPK</option>
                </select>
              </div>
            </div>

            <!-- Status Follow-Up Utama & FU Open/Closed -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status Follow-Up Utama:</label>
                <select id="batchStatus" class="fu-select" style="font-size:12px;">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="Belum Dihubungi">⚪ Belum Dihubungi</option>
                  <option value="Menunggu Respon">⏳ Menunggu Respon</option>
                  <option value="Tertarik / Jadwal Servis">🔥 Tertarik / Jadwal Servis</option>
                  <option value="Deal / Selesai">🏆 Deal / Selesai</option>
                  <option value="Tidak Tertarik">❌ Tidak Tertarik</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status FU (Open/Closed):</label>
                <select id="batchSalesFuStatus" class="fu-select" style="font-size:12px;">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="Open">🔵 Open (Masih Berjalan)</option>
                  <option value="Closed">🔴 Closed (Selesai)</option>
                </select>
              </div>
            </div>

            <!-- Remarks & Sales PIC -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Remarks Standar:</label>
                <select id="batchRemarks" class="fu-select" style="font-size:12px;">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="Customer tertarik">Customer tertarik</option>
                  <option value="Customer janjian">Customer janjian</option>
                  <option value="Minta simulasi kredit">Minta simulasi kredit</option>
                  <option value="Janjian test drive">Janjian test drive</option>
                  <option value="SPK berhasil">SPK berhasil</option>
                  <option value="Customer pending">Customer pending</option>
                  <option value="Customer menolak">Customer menolak</option>
                  <option value="Beli di dealer/merk lain">Beli di dealer/merk lain</option>
                  <option value="Customer tidak aktif">Customer tidak aktif</option>
                  <option value="Customer tidak diangkat">Customer tidak diangkat</option>
                </select>
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tugaskan ke Sales PIC:</label>
                <select id="batchSalesPic" class="fu-select" style="font-size:12px;">
                  <option value="ignore">-- Jangan Diubah (Tetap) --</option>
                  <option value="unassign">⚠️ Kosongkan (Batal Penugasan Sales)</option>
                  ${masterState.salesList.map(s => `
                    <option value="${s.id}">${escapeHtml(s.name)}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Catatan / Keterangan Tambahan (Opsional):</label>
              <input type="text" id="batchNotes" class="fu-input" style="font-size:12px;" placeholder="Biarkan kosong jika tidak ingin mengubah catatan...">
            </div>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" class="btn-fu btn-fu-crimson" style="flex:1; justify-content:center; padding:12px; font-size:13.5px;">
              <i class="fa-solid fa-bolt-lightning"></i> Terapkan Perubahan Massal
            </button>
            <button type="button" class="btn-fu btn-fu-secondary" style="padding:12px 20px;" onclick="closeBatchEditModal()">
              Batal
            </button>
          </div>

        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function closeBatchEditModal() {
  const modal = document.getElementById('modalBatchEditMaster');
  if (modal) {
    modal.remove();
  }
}

async function executeBatchUpdateMaster(e) {
  e.preventDefault();

  const scopeChoice = document.querySelector('input[name="batchScopeChoice"]:checked')?.value || 'selected';
  const customCompanyName = (document.getElementById('batchCustomCompanyName')?.value || '').trim();

  const connected = document.getElementById('batchConnected').value;
  const contacted = document.getElementById('batchContacted').value;
  const prospect = document.getElementById('batchProspect').value;
  const spk = document.getElementById('batchSpk').value;
  const status = document.getElementById('batchStatus').value;
  const sales_fu_status = document.getElementById('batchSalesFuStatus').value;
  const remarks = document.getElementById('batchRemarks').value;
  const assigned_sales_id = document.getElementById('batchSalesPic').value;
  const notes = (document.getElementById('batchNotes').value || '').trim();

  // Validate at least one field is selected for update
  if (connected === 'ignore' && contacted === 'ignore' && prospect === 'ignore' && spk === 'ignore' && status === 'ignore' && sales_fu_status === 'ignore' && remarks === 'ignore' && assigned_sales_id === 'ignore' && notes === '') {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Data', 'Pilih minimal 1 kolom (Connected, Contacted, Status, Sales, dll.) yang ingin Anda ubah.', 'warning');
    } else {
      alert('Pilih minimal 1 kolom yang ingin Anda ubah.');
    }
    return;
  }

  if (scopeChoice === 'selected' && masterState.selectedIds.length === 0) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Tidak Ada Data Dicentang', 'Silakan centang data customer pada tabel terlebih dahulu, atau pilih opsi "Semua Data Hasil Pencarian / Nama PT".', 'warning');
    } else {
      alert('Tidak ada data customer yang dicentang.');
    }
    return;
  }

  if (scopeChoice === 'company_name' && !customCompanyName) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Ketik Nama Perusahaan', 'Harap masukkan nama PT/Perusahaan (misal: PT Sudeco) pada kolom yang disediakan.', 'warning');
    } else {
      alert('Harap masukkan nama PT/Perusahaan.');
    }
    return;
  }

  let isConfirmed = false;
  let confirmDesc = '';
  if (scopeChoice === 'selected') {
    confirmDesc = `Ubah data ${masterState.selectedIds.length} customer terpilih?`;
  } else if (scopeChoice === 'company_name') {
    confirmDesc = `Ubah SEMUA data customer yang bernama/mengandung "${customCompanyName}"?`;
  } else {
    confirmDesc = `Ubah SEMUA data hasil pencarian "${masterState.filters.search || 'Semua Data'}"?`;
  }

  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(confirmDesc);
  } else {
    isConfirmed = confirm(confirmDesc);
  }

  if (!isConfirmed) return;

  const payload = {
    scope: scopeChoice,
    customer_ids: masterState.selectedIds,
    company_name: customCompanyName,
    search: (masterState.filters.search || '').trim(),
    connected: connected,
    contacted: contacted,
    prospect: prospect,
    spk: spk,
    status: status,
    sales_fu_status: sales_fu_status,
    remarks: remarks,
    assigned_sales_id: assigned_sales_id,
    notes: notes || 'ignore'
  };

  try {
    const res = await fetch('/api/api_followup.php?action=batch_update_customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeBatchEditModal();
      masterState.selectedIds = [];
      updateBulkActionBar();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Pembaruan Massal Berhasil!', data.message, 'success');
      } else {
        alert(data.message);
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data.message || 'Gagal memperbarui data', 'error');
      } else {
        alert(data.message || 'Gagal memperbarui data');
      }
    }
  } catch (err) {
    console.error('Batch update error', err);
  }
}

// -------------------------------------------------------------
// ANIMATED IMPORT EXCEL MODAL ENGINE
// -------------------------------------------------------------
function handleExcelUpload(input) {
  if (!input.files || !input.files[0]) return;
  const file = input.files[0];

  // Show Animated Progress Modal
  showImportProgressModal(file.name, file.size);

  const formData = new FormData();
  formData.append('file', file);

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/api_followup_import.php', true);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 40); // 0-40% upload
      updateImportProgress(percent, 'Mengunggah file ke server...', 1);
    }
  };

  xhr.onload = async () => {
    updateImportProgress(70, 'Memindai sheet & kolom 9-Clusters Repurchase...', 2);
    setTimeout(() => {
      updateImportProgress(90, 'Mengekstrak data kendaraan & klaster...', 3);
    }, 600);

    setTimeout(async () => {
      try {
        const res = JSON.parse(xhr.responseText);
        if (res.success) {
          updateImportProgress(100, 'Import Berhasil!', 4, res);
          await initMasterDashboard();
        } else {
          showImportError(res.message || 'Gagal memproses file Excel.');
        }
      } catch (err) {
        showImportError('Terjadi kesalahan saat memproses respon server.');
      }
    }, 1200);
  };

  xhr.onerror = () => {
    showImportError('Koneksi terputus saat mengunggah file.');
  };

  xhr.send(formData);
}

function showImportProgressModal(fileName, fileSize) {
  let modal = document.getElementById('importProgressModal');
  const sizeMb = fileSize ? (fileSize / (1024 * 1024)).toFixed(2) + ' MB' : '';

  if (!modal) {
    const html = `
      <div class="modal-overlay active" id="importProgressModal">
        <div class="import-progress-box" onclick="event.stopPropagation()">

          <!-- Animated Top Icon -->
          <div style="position:relative; width:64px; height:64px; margin:0 auto 16px;">
            <div style="width:64px; height:64px; border-radius:20px; background:linear-gradient(135deg, #fee2e2 0%, #fecaca 100%); color:#d7123a; display:flex; align-items:center; justify-content:center; font-size:28px; box-shadow:0 8px 20px rgba(215,18,58,0.15);">
              <i class="fa-solid fa-file-excel" id="importIconState"></i>
            </div>
            <div id="importSpinner" style="position:absolute; inset:-4px; border:2.5px solid transparent; border-top-color:#d7123a; border-right-color:#d7123a; border-radius:24px; animation:fuSpin 1.2s linear infinite;"></div>
          </div>

          <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0 0 4px 0;" id="importTitle">Memproses File Data...</h3>
          <p style="font-size:12px; color:#64748b; margin:0 0 16px 0;" id="importSub">${fileName} ${sizeMb ? `(${sizeMb})` : ''}</p>

          <div class="progress-track">
            <div class="progress-bar-fill" id="importProgressBar" style="width:15%;"></div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; margin-bottom:16px;">
            <span style="font-size:11.5px; font-weight:800; color:#d7123a;" id="importPercentText">15% - Mengunggah File</span>
            <span style="font-size:10.5px; color:#94a3b8; font-family:monospace;" id="importTimeStatus">Memproses...</span>
          </div>

          <div style="text-align:left; margin-bottom:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px;" id="importChecklist">
            <div class="import-step-item active" id="step1"><i class="fa-solid fa-cloud-arrow-up"></i> 1. Mengunggah File ke Server</div>
            <div class="import-step-item" id="step2"><i class="fa-solid fa-table-list"></i> 2. Pindai Kolom & Klaster Repurchase</div>
            <div class="import-step-item" id="step3"><i class="fa-solid fa-car"></i> 3. Ekstraksi Kontak & Model Kendaraan</div>
            <div class="import-step-item" id="step4"><i class="fa-solid fa-database"></i> 4. Simpan ke Database CRM SFT</div>
          </div>

          <div id="importResultBox" style="display:none; background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:14px; font-size:12.5px; color:#15803d; margin-bottom:16px; text-align:left;">
          </div>

          <button class="btn-fu btn-fu-navy" id="btnFinishImport" style="display:none; width:100%; justify-content:center; padding:12px;" onclick="closeImportModal()">
            <i class="fa-solid fa-check"></i> Selesai &amp; Lihat Database
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  } else {
    modal.classList.add('active');
    document.getElementById('importTitle').textContent = 'Memproses File Data...';
    document.getElementById('importSub').textContent = `${fileName} ${sizeMb ? `(${sizeMb})` : ''}`;
    document.getElementById('importProgressBar').style.width = '15%';
    document.getElementById('importProgressBar').style.background = 'linear-gradient(90deg, #d7123a 0%, #f43f5e 50%, #10b981 100%)';
    document.getElementById('importPercentText').textContent = '15% - Mengunggah File';
    document.getElementById('importResultBox').style.display = 'none';
    document.getElementById('btnFinishImport').style.display = 'none';
    document.getElementById('importSpinner').style.display = 'block';
  }
}

function updateImportProgress(percent, statusText, stepNumber, resultData = null) {
  const bar = document.getElementById('importProgressBar');
  const txt = document.getElementById('importPercentText');
  if (bar) bar.style.width = `${percent}%`;
  if (txt) txt.textContent = `${percent}% - ${statusText}`;

  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`step${i}`);
    if (el) {
      if (i < stepNumber) {
        el.className = 'import-step-item done';
        el.innerHTML = el.innerHTML.replace(/fa-[a-z-]+/, 'fa-circle-check');
      } else if (i === stepNumber) {
        el.className = 'import-step-item active';
      } else {
        el.className = 'import-step-item';
      }
    }
  }

  if (resultData && percent === 100) {
    const spinner = document.getElementById('importSpinner');
    if (spinner) spinner.style.display = 'none';

    const icon = document.getElementById('importIconState');
    if (icon) {
      icon.className = 'fa-solid fa-circle-check';
      icon.parentElement.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
      icon.parentElement.style.color = '#15803d';
    }

    const resBox = document.getElementById('importResultBox');
    if (resBox) {
      resBox.style.display = 'block';
      resBox.innerHTML = `
        <div style="font-weight:800; font-size:13.5px; color:#14532d; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-circle-check" style="font-size:16px;"></i> ${resultData.message}
        </div>
        <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:8px; font-size:11.5px; color:#334155;">
          <span style="background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; padding:3px 8px;">Sheet: <strong>${resultData.sheet_used || 'Utama'}</strong></span>
          <span style="background:#ffffff; border:1px solid #86efac; color:#15803d; border-radius:6px; padding:3px 8px;">Baru: <strong>+${resultData.inserted || 0}</strong></span>
          <span style="background:#ffffff; border:1px solid #bfdbfe; color:#1d4ed8; border-radius:6px; padding:3px 8px;">Total: <strong>${resultData.total || resultData.inserted || 0} Data</strong></span>
        </div>
      `;
    }
    const btn = document.getElementById('btnFinishImport');
    if (btn) btn.style.display = 'flex';
  }
}

function showImportError(msg) {
  const spinner = document.getElementById('importSpinner');
  if (spinner) spinner.style.display = 'none';

  const icon = document.getElementById('importIconState');
  if (icon) {
    icon.className = 'fa-solid fa-triangle-exclamation';
    icon.parentElement.style.background = 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)';
    icon.parentElement.style.color = '#ef4444';
  }

  document.getElementById('importTitle').textContent = 'Gagal Memproses File';
  document.getElementById('importProgressBar').style.background = '#ef4444';
  document.getElementById('importPercentText').textContent = msg;

  const resBox = document.getElementById('importResultBox');
  if (resBox) {
    resBox.style.display = 'block';
    resBox.style.background = '#fef2f2';
    resBox.style.borderColor = '#fecaca';
    resBox.style.color = '#b91c1c';
    resBox.innerHTML = `<strong>Error:</strong> ${msg}`;
  }

  const btn = document.getElementById('btnFinishImport');
  if (btn) {
    btn.style.display = 'flex';
    btn.textContent = 'Tutup';
  }
}

function closeImportModal() {
  document.getElementById('importProgressModal')?.classList.remove('active');
}

// -------------------------------------------------------------
// DIRECT WHATSAPP MODAL IN MASTER PANEL
// -------------------------------------------------------------
let masterActiveCustWA = null;

async function openWhatsAppDirect(customerId) {
  const cust = masterState.customers.find(c => c.id === customerId);
  if (!cust) return;
  masterActiveCustWA = cust;

  if (!document.getElementById('masterWhatsAppModal')) {
    const html = `
      <div class="modal-overlay" id="masterWhatsAppModal" onclick="closeMasterWAModal()">
        <div class="modal-content" style="max-width:580px; border-radius:var(--fu-radius-lg); padding:22px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
            <h3 style="display:flex; align-items:center; gap:8px; color:#059669; font-size:16px; font-weight:800; margin:0;">
              <i class="fa-brands fa-whatsapp" style="font-size:22px;"></i> Direct WhatsApp Follow-Up
            </h3>
            <button class="btn-close-modal" onclick="closeMasterWAModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#fff; border-radius:14px; padding:14px 16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <strong style="font-size:15px;" id="mWaCustName">-</strong>
              <span style="font-family:monospace; color:#6ee7b7; font-weight:800; font-size:13px;" id="mWaCustPhone">-</span>
            </div>
            <div style="font-size:12px; color:rgba(255,255,255,0.9); margin-top:4px;" id="mWaCustCar">-</div>
          </div>

          <div class="form-group" style="margin-bottom:12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label style="font-size:12px; font-weight:800; color:#0f172a; margin:0;">Pilih Template WhatsApp:</label>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:2px 8px; font-size:11px; border-radius:6px;" onclick="openTemplateManagerModal()">
                <i class="fa-solid fa-sliders"></i> Kelola Template
              </button>
            </div>
            <select class="form-control" id="mWaTemplateSelect" style="font-size:12.5px; font-weight:600; border-radius:10px;" onchange="handleMasterTemplateSelectChange(this.value)">
            </select>
          </div>

          <div class="wa-chat-preview">
            <div class="wa-bubble-sent" id="mWaLiveBubble">-</div>
          </div>

          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Isi Pesan WhatsApp:</label>
            <textarea class="form-control" id="mWaMessageText" rows="5" style="font-size:12.5px; line-height:1.5; font-family:inherit; border-radius:10px;" oninput="updateMasterLiveBubble(this.value)"></textarea>
          </div>

          <button class="btn-wa-action" style="padding:14px;" onclick="executeMasterSendWA()">
            <i class="fa-brands fa-whatsapp" style="font-size:20px;"></i> Buka WhatsApp &amp; Kirim
          </button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  document.getElementById('mWaCustName').textContent = cust.name;
  document.getElementById('mWaCustPhone').textContent = `+${cust.phone}`;

  const lastCarClean = (cust.last_car_model && cust.last_car_model !== '-' && cust.last_car_model !== 'NO DATA') ? cust.last_car_model : '';
  const targetCarClean = cust.recommended_model || cust.car_model || '-';

  document.getElementById('mWaCustCar').innerHTML = `
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

  const lastUsedTmplId = localStorage.getItem('sft_last_template_id');
  const activeTmplId = renderMasterTemplateDropdownOptions(lastUsedTmplId);

  applyMasterWATemplate(activeTmplId);
  document.getElementById('masterWhatsAppModal').classList.add('active');
}

function renderMasterTemplateDropdownOptions(preferredId = null) {
  const tmplSelect = document.getElementById('mWaTemplateSelect');
  if (!tmplSelect) return null;

  tmplSelect.innerHTML = '';
  const allTemplates = masterState.templates || [];
  const defaultTemplates = allTemplates.filter(t => (t.is_default == 1 || !t.sales_id));
  const customTemplates = allTemplates.filter(t => (t.is_default != 1 && (t.sales_id || t.created_by || t.category === 'kustom')));

  let selectedId = preferredId;
  const exists = allTemplates.some(t => String(t.id) === String(selectedId));
  if (!exists) {
    const def = allTemplates.find(t => t.is_default == 1) || allTemplates[0];
    selectedId = def ? def.id : null;
  }

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

  if (customTemplates.length > 0) {
    const groupCust = document.createElement('optgroup');
    groupCust.label = '⭐ Template Kustom';
    customTemplates.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `⭐ ${t.title} ${t.created_by ? `(${t.created_by})` : ''}`;
      if (String(t.id) === String(selectedId)) opt.selected = true;
      groupCust.appendChild(opt);
    });
    tmplSelect.appendChild(groupCust);
  }

  return selectedId;
}

function handleMasterTemplateSelectChange(val) {
  localStorage.setItem('sft_last_template_id', val);
  applyMasterWATemplate(val);
}

function closeMasterWAModal() {
  const modal = document.getElementById('masterWhatsAppModal');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function updateMasterLiveBubble(text) {
  const bubble = document.getElementById('mWaLiveBubble');
  if (!bubble) return;
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  bubble.innerHTML = `${text}\n<div class="wa-bubble-footer"><span>${time}</span> <i class="fa-solid fa-check-double"></i></div>`;
}

async function applyMasterWATemplate(templateId) {
  if (!masterActiveCustWA) return;
  const tmpl = masterState.templates.find(t => String(t.id) === String(templateId));
  if (!tmpl) return;

  localStorage.setItem('sft_last_template_id', templateId);

  try {
    const res = await fetch('/api/api_followup.php?action=format_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer_id: masterActiveCustWA.id,
        template_id: tmpl.id
      })
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('mWaMessageText').value = data.formatted_text;
      updateMasterLiveBubble(data.formatted_text);
    }
  } catch (e) {
    const c = masterActiveCustWA;
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
      .replace(/{nama_sales}/gi, 'Sales Tunas Toyota')
      .replace(/{dealer}/gi, 'Tunas Toyota Kiara Condong')
      .replace(/\*{2,}/g, '*');

    document.getElementById('mWaMessageText').value = formatted;
    updateMasterLiveBubble(formatted);
  }
}

function executeMasterSendWA() {
  if (!masterActiveCustWA) return;
  const customerId = masterActiveCustWA.id;
  const msg = document.getElementById('mWaMessageText').value;
  const cleanPhone = masterActiveCustWA.phone.replace(/[^0-9]/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank');
  closeMasterWAModal();

  const row = document.getElementById(`masterRow_${customerId}`);
  if (row) {
    row.classList.remove('card-just-followed-up');
    void row.offsetWidth;
    row.classList.add('card-just-followed-up');
    row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => row.classList.remove('card-just-followed-up'), 5000);
  }
}

// -------------------------------------------------------------
// ADD CUSTOMER MODAL
// -------------------------------------------------------------
function openAddCustomerModal() {
  if (!document.getElementById('modalAddCust')) {
    const html = `
      <div class="modal-overlay" id="modalAddCust" onclick="closeAddCustModal()">
        <div class="modal-content" style="max-width:620px; border-radius:var(--fu-radius-lg); padding:24px;" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:18px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-user-plus"></i> Customer Entry
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Tambah Customer Baru</h3>
            </div>
            <button class="btn-close-modal" onclick="closeAddCustModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <form onsubmit="handleSaveNewCust(event)">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Nama Customer *</label>
                <input type="text" id="addCustName" required class="fu-input" placeholder="Contoh: Bpk. Hendra Gunawan">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">No WhatsApp / Telepon *</label>
                <input type="text" id="addCustPhone" required class="fu-input" placeholder="081223344556">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Model Mobil Target Repurchase *</label>
                <input type="text" id="addCustCar" required class="fu-input" placeholder="Innova Zenix 2.0 V HV">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Mobil Saat Ini (Latar Belakang)</label>
                <input type="text" id="addCustLastCar" class="fu-input" placeholder="Hiace / Avanza 1.3 G">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Usia Kendaraan</label>
                <input type="text" id="addCustAge" class="fu-input" placeholder="Contoh: 4.2 Tahun">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Kecamatan / Domisili</label>
                <input type="text" id="addCustDistrict" class="fu-input" placeholder="Kiara Condong / Buahbatu">
              </div>
            </div>

            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:18px;">
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Kategori Follow-Up</label>
                <input type="text" id="addCustCategory" class="fu-input" placeholder="Trade-in / Repurchase">
              </div>
              <div>
                <label style="font-size:11.5px; font-weight:800; color:#334155; display:block; margin-bottom:4px;">Tugaskan ke Sales PIC</label>
                <select id="addCustSales" class="fu-select">
                  <option value="">-- Belum Ditugaskan --</option>
                  ${masterState.salesList.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                </select>
              </div>
            </div>

            <div style="display:flex; gap:10px;">
              <button type="submit" class="btn-fu btn-fu-crimson" style="flex:1; justify-content:center; padding:12px;">
                <i class="fa-solid fa-check"></i> Simpan Customer
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:12px 20px;" onclick="closeAddCustModal()">
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }
  document.getElementById('modalAddCust').classList.add('active');
}

function closeAddCustModal() {
  const modal = document.getElementById('modalAddCust');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

async function handleSaveNewCust(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('addCustName').value,
    phone: document.getElementById('addCustPhone').value,
    car_model: document.getElementById('addCustCar').value,
    last_car_model: document.getElementById('addCustLastCar').value,
    car_age: document.getElementById('addCustAge').value,
    district: document.getElementById('addCustDistrict').value,
    followup_category: document.getElementById('addCustCategory').value || 'Trade-in / Repurchase',
    assigned_sales_id: document.getElementById('addCustSales').value || null
  };

  try {
    const res = await fetch('/api/api_followup.php?action=create_customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.success) {
      closeAddCustModal();
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Customer Disimpan!', data.message, 'success');
      } else {
        alert(data.message);
      }
    }
  } catch (err) {
    console.error('Save cust error', err);
  }
}

// -------------------------------------------------------------
// TEMPLATE MANAGER MODAL
// -------------------------------------------------------------
function openTemplateManagerModal() {
  document.getElementById('modalTemplateManager')?.remove();

  const html = `
    <div class="modal-overlay" id="modalTemplateManager" onclick="closeTemplateModal()">
      <div class="modal-content" style="max-width:700px; border-radius:var(--fu-radius-lg); padding:24px; max-height:88vh; overflow-y:auto;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-comment-dots"></i> Message Library
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Template Pesan WhatsApp</h3>
          </div>
          <button class="btn-close-modal" onclick="closeTemplateModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
          <p style="font-size:12px; color:#64748b; margin:0;">
            Daftar template pesan WhatsApp standar Toyota &amp; template kustom yang otomatis disesuaikan variabelnya.
          </p>
          <button class="btn-fu btn-fu-emerald" style="padding:6px 14px; font-size:12px; border-radius:8px;" onclick="closeTemplateModal(); openCustomTemplateModalMaster();">
            <i class="fa-solid fa-plus"></i> + Tambah Template Baru
          </button>
        </div>

        <div style="display:flex; flex-direction:column; gap:10px; max-height:420px; overflow-y:auto; padding-right:4px;" id="templateListContainer">
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  const container = document.getElementById('templateListContainer');
  let htmlContent = '';
  masterState.templates.forEach(t => {
    const isCustom = (t.is_default != 1 && (t.sales_id || t.created_by || t.category === 'kustom'));
    htmlContent += `
      <div style="background:#f8fafc; border:1.5px solid ${isCustom ? '#86efac' : '#e2e8f0'}; border-radius:14px; padding:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <strong style="font-size:13.5px; color:#0f172a; font-weight:800;">${escapeHtml(t.title)}</strong>
            <span style="font-size:10px; font-weight:800; padding:3px 9px; border-radius:9999px; ${isCustom ? 'background:#dcfce7; color:#15803d;' : 'background:#eff6ff; color:#1d4ed8;'}">
              ${isCustom ? `Kustom (${t.created_by || 'Sales'})` : '🔒 Template Default'}
            </span>
          </div>
          ${isCustom ? `
            <div style="display:flex; gap:6px;">
              <button class="btn-fu btn-fu-secondary" style="padding:3px 8px; font-size:11px; border-radius:6px;" onclick="closeTemplateModal(); openCustomTemplateModalMaster(\`${escapeJs(t.content)}\`, ${t.id}, \`${escapeJs(t.title)}\`, \`${escapeJs(t.category)}\`)">
                <i class="fa-solid fa-pen-to-square"></i> Edit
              </button>
              <button class="btn-fu btn-fu-secondary" style="padding:3px 8px; font-size:11px; border-radius:6px; color:#ef4444 !important; border-color:#fecaca;" onclick="handleMasterDeleteCustomTemplate(${t.id}, \`${escapeJs(t.title)}\`)">
                <i class="fa-solid fa-trash-can"></i> Hapus
              </button>
            </div>
          ` : `
            <span style="font-size:11px; color:#64748b;"><i class="fa-solid fa-lock"></i> Standar Sistem</span>
          `}
        </div>
        <div style="font-size:12px; color:#334155; white-space:pre-wrap; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:12px; line-height:1.6; font-family:inherit;">${escapeHtml(t.content)}</div>
      </div>
    `;
  });
  container.innerHTML = htmlContent;

  document.getElementById('modalTemplateManager').classList.add('active');
}

function openCustomTemplateModalMaster(initialContent = '', editId = 0, editTitle = '', editCategory = 'promo') {
  document.getElementById('modalMasterCustomTmpl')?.remove();

  const defaultContent = initialContent || `Halo Bpk/Ibu *{nama_customer}*,\n\nSalam hormat dari saya *{nama_sales}* - *{dealer}* 🚗✨\n\n[Tuliskan penawaran promo / follow up spesial Bpk/Ibu di sini]\n\nBoleh saya kirimkan detail lengkapnya Bpk/Ibu? Terima kasih! 🙏`;

  const html = `
    <div class="modal-overlay active" id="modalMasterCustomTmpl" style="display:flex; z-index:99999;" onclick="closeCustomTemplateModalMaster()">
      <div class="modal-content" style="max-width:580px; border-radius:var(--fu-radius-lg, 16px); padding:20px 22px;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:5px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px; border:1px solid #bfdbfe;">
              <i class="fa-solid fa-star"></i> Template Kustom
            </div>
            <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin:0;">
              ${editId ? 'Edit Template WhatsApp' : 'Buat Template WhatsApp Kustom'}
            </h3>
          </div>
          <button class="btn-close-modal" onclick="closeCustomTemplateModalMaster()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form onsubmit="handleMasterSaveCustomTemplate(event, ${editId})">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div>
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Judul Template *</label>
              <input type="text" id="mCustTmplTitle" required class="fu-input" style="font-size:12px; padding:7px 10px;" placeholder="Cth: Promo Flash Sale" value="${escapeHtml(editTitle)}">
            </div>
            <div>
              <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Kategori</label>
              <select id="mCustTmplCategory" class="fu-select" style="font-size:12px; padding:7px 10px;">
                <option value="promo" ${editCategory === 'promo' ? 'selected' : ''}>Promo &amp; Diskon</option>
                <option value="tradein" ${editCategory === 'tradein' ? 'selected' : ''}>Trade-In / Upgrade</option>
                <option value="csat" ${editCategory === 'csat' ? 'selected' : ''}>CSAT &amp; Tanya Kabar</option>
                <option value="servis" ${editCategory === 'servis' ? 'selected' : ''}>Servis &amp; Bengkel</option>
                <option value="stnk" ${editCategory === 'stnk' ? 'selected' : ''}>STNK &amp; Pajak</option>
                <option value="kustom" ${editCategory === 'kustom' ? 'selected' : ''}>Follow Up Kustom</option>
              </select>
            </div>
          </div>

          <!-- Variable Chips Quick Insert Bar -->
          <div style="margin-bottom:8px;">
            <div style="font-size:10.5px; font-weight:700; color:#64748b; margin-bottom:3px;">Klik tag untuk menyisipkan variabel otomatis:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <button type="button" class="variable-chip-btn" style="background:#eff6ff; color:#1d4ed8; border-color:#bfdbfe; font-weight:800;" onclick="insertTagToMasterCustomTmpl('{nama_sales}')">{nama_sales}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToMasterCustomTmpl('{nama_customer}')">{nama_customer}</button>
              <button type="button" class="variable-chip-btn" style="background:#ecfdf5; color:#047857; border-color:#a7f3d0; font-weight:800;" onclick="insertTagToMasterCustomTmpl('{mobil_saat_ini}')">{mobil_saat_ini}</button>
              <button type="button" class="variable-chip-btn" style="background:#fff1f2; color:#be123c; border-color:#fecdd3; font-weight:800;" onclick="insertTagToMasterCustomTmpl('{model_rekomendasi}')">{model_rekomendasi}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToMasterCustomTmpl('{usia_kendaraan}')">{usia_kendaraan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToMasterCustomTmpl('{kecamatan}')">{kecamatan}</button>
              <button type="button" class="variable-chip-btn" onclick="insertTagToMasterCustomTmpl('{dealer}')">{dealer}</button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <label style="font-size:11.5px; font-weight:800; color:#0f172a; margin-bottom:4px; display:block;">Isi Pesan Template *</label>
            <textarea id="mCustTmplContent" required class="form-control" rows="6" style="font-size:12px; line-height:1.5; font-family:inherit; border-radius:10px;" placeholder="Ketik format pesan WhatsApp...">${escapeHtml(defaultContent)}</textarea>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:11px 18px; font-size:13px;">
              <i class="fa-solid fa-floppy-disk"></i> Simpan Template
            </button>
            <button type="button" class="btn-fu btn-fu-secondary" style="padding:11px 18px; font-size:13px;" onclick="closeCustomTemplateModalMaster()">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeCustomTemplateModalMaster() {
  const modal = document.getElementById('modalMasterCustomTmpl');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function insertTagToMasterCustomTmpl(tag) {
  const textarea = document.getElementById('mCustTmplContent');
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const text = textarea.value;
  textarea.value = text.substring(0, start) + tag + text.substring(end);
  textarea.focus();
  textarea.selectionStart = textarea.selectionEnd = start + tag.length;
}

async function handleMasterSaveCustomTemplate(e, editId = 0) {
  e.preventDefault();
  const title = (document.getElementById('mCustTmplTitle')?.value || '').trim();
  const category = document.getElementById('mCustTmplCategory')?.value || 'promo';
  const content = (document.getElementById('mCustTmplContent')?.value || '').trim();

  if (!title || !content) {
    alert('Judul dan isi template wajib diisi');
    return;
  }

  try {
    const res = await fetch('/api/api_followup.php?action=save_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editId,
        title: title,
        category: category,
        content: content,
        created_by: 'SPV/Master'
      })
    });
    const data = await res.json();
    if (data.success) {
      masterState.templates = data.data || [];
      const savedId = data.saved_id;

      closeCustomTemplateModalMaster();

      if (document.getElementById('mWaTemplateSelect')) {
        renderMasterTemplateDropdownOptions(savedId);
        localStorage.setItem('sft_last_template_id', savedId);
        if (masterActiveCustWA) {
          applyMasterWATemplate(savedId);
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

async function handleMasterDeleteCustomTemplate(id, title) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Apakah Anda yakin ingin menghapus template "${title}"?`);
  } else {
    isConfirmed = confirm(`Hapus template "${title}"?`);
  }
  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=delete_template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: id })
    });
    const data = await res.json();
    if (data.success) {
      masterState.templates = data.data || [];

      if (localStorage.getItem('sft_last_template_id') == id) {
        localStorage.removeItem('sft_last_template_id');
      }

      if (document.getElementById('mWaTemplateSelect')) {
        renderMasterTemplateDropdownOptions();
      }

      openTemplateManagerModal();

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

function closeTemplateModal() {
  const modal = document.getElementById('modalTemplateManager');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

// -------------------------------------------------------------
// -------------------------------------------------------------
// -------------------------------------------------------------
// GOOGLE SHEET SYNC MODAL (2-WAY SYNC)
// -------------------------------------------------------------
async function openSyncSettingsModal() {
  let defaultSheetUrl = localStorage.getItem('sft_google_sheet_url') || 'https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?usp=sharing';
  let defaultScriptUrl = localStorage.getItem('sft_apps_script_url') || 'https://script.google.com/macros/s/AKfycbwg7iocmbSQeqHekaheVs3Co4DZ5-azv37f-CmSbOETyQLgFyEGph5_j1CySWbn3IHJ/exec';

  try {
    const res = await fetch('/api/api_followup_sync.php?action=get_settings');
    const data = await res.json();
    if (data.success && data.settings) {
      if (data.settings.google_sheet_url) {
        defaultSheetUrl = data.settings.google_sheet_url;
        localStorage.setItem('sft_google_sheet_url', defaultSheetUrl);
      }
      if (data.settings.google_apps_script_url) {
        defaultScriptUrl = data.settings.google_apps_script_url;
        localStorage.setItem('sft_apps_script_url', defaultScriptUrl);
      }
    }
  } catch (e) {
    console.error('Error fetching sync settings', e);
  }

  if (document.getElementById('modalSyncSettings')) {
    document.getElementById('modalSyncSettings').remove();
  }

  const html = `
    <div class="modal-overlay" id="modalSyncSettings" onclick="closeSyncModal()">
      <div class="modal-content" style="max-width:620px; border-radius:var(--fu-radius-lg); padding:26px;" onclick="event.stopPropagation()">
        <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
              <i class="fa-solid fa-arrows-rotate"></i> 2-Way Cloud Sync Engine
            </div>
            <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Sinkronisasi 2 Arah Google Spreadsheet</h3>
          </div>
          <button class="btn-close-modal" onclick="closeSyncModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div style="background:#f0fdf4; border:1.5px solid #86efac; border-radius:12px; padding:12px 14px; font-size:12px; color:#15803d; margin-bottom:16px; display:flex; align-items:flex-start; gap:8px;">
          <i class="fa-solid fa-circle-info" style="margin-top:2px;"></i>
          <span>Hubungkan database CRM SFT dengan Google Spreadsheet agar data customer ditarik otomatis dan hasil respon follow-up sales langsung terkirim balik ke spreadsheet secara realtime.</span>
        </div>

        <!-- 1. URL SPREADSHEET (PULL DATA) -->
        <div style="margin-bottom:14px;">
          <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px; display:block;">
            1. URL Google Spreadsheet (Tarik Database Customer):
          </label>
          <div class="fu-input-with-icon">
            <i class="fa-solid fa-table"></i>
            <input type="url" id="inputGoogleSheetUrl" class="fu-input" placeholder="https://docs.google.com/spreadsheets/d/.../edit" style="font-size:12px;" value="${defaultSheetUrl}">
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:3px;">
            Pastikan akses spreadsheet disetel ke: <em>"Anyone with the link can view"</em>.
          </div>
        </div>

        <!-- 2. URL APPS SCRIPT WEBHOOK (PUSH DATA) -->
        <div style="margin-bottom:20px;">
          <label style="font-size:12px; font-weight:800; color:#0f172a; margin-bottom:6px; display:block;">
            2. URL Webhook Google Apps Script (Kirim Update Sales ke Sheet):
          </label>
          <div class="fu-input-with-icon">
            <i class="fa-solid fa-code"></i>
            <input type="url" id="inputGoogleAppsScriptUrl" class="fu-input" placeholder="https://script.google.com/macros/s/.../exec" style="font-size:12px;" value="${defaultScriptUrl}">
          </div>
          <div style="font-size:11px; color:#64748b; margin-top:3px;">
            URL Web App yang didapat setelah melakukan Deploy Google Apps Script (*berakhiran /exec*).
          </div>
        </div>

        <div style="display:flex; gap:10px;">
          <button class="btn-fu btn-fu-emerald" style="flex:1; justify-content:center; padding:12px 20px; font-size:13px;" onclick="executePullGoogleSheet()">
            <i class="fa-solid fa-cloud-arrow-down"></i> Simpan &amp; Tarik Data Sekarang
          </button>
          <button class="btn-fu btn-fu-secondary" style="padding:12px 20px; font-size:13px;" onclick="closeSyncModal()">
            Tutup
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  document.getElementById('modalSyncSettings').classList.add('active');
}

function closeSyncModal() {
  const modal = document.getElementById('modalSyncSettings');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

// =============================================================
// ULTRA-PREMIUM MODERN LOADER ENGINE
// =============================================================
function showModernOperationLoader({
  tag = 'SMART ENGINE',
  tagColor = 'red',
  icon = 'fa-solid fa-bolt-lightning',
  theme = 'red-theme',
  title = 'Memproses Data...',
  subtitle = 'Mohon tunggu beberapa saat...',
  statusText = 'Sedang memproses...',
  percent = 65,
  barColor = 'red'
}) {
  closeModernOperationLoader();

  const html = `
    <div class="fu-loader-overlay" id="modernOperationLoader" onclick="event.stopPropagation()">
      <div class="fu-loader-card">

        <!-- Center Animated Pulse Icon -->
        <div class="fu-loader-icon-wrap">
          <div class="fu-loader-ring-outer"></div>
          <div class="fu-loader-ring-pulse"></div>
          <div class="fu-loader-icon-center ${theme}">
            <i class="${icon}"></i>
          </div>
        </div>

        <div class="fu-loader-tag ${tagColor}">
          <i class="fa-solid fa-circle-notch fa-spin"></i> ${tag}
        </div>

        <h3 class="fu-loader-title">${title}</h3>
        <p class="fu-loader-subtitle">${subtitle}</p>

        <!-- Progress Track & Shimmer -->
        <div class="fu-loader-track">
          <div class="fu-loader-bar ${barColor}" id="modernLoaderBar" style="width:${percent}%;"></div>
        </div>

        <div class="fu-loader-status-row">
          <span style="display:inline-flex; align-items:center; gap:5px; color:#0f172a;" id="modernLoaderStatus">
            ${statusText} <span class="fu-loader-dots"></span>
          </span>
          <span style="color:#d7123a; font-weight:800; font-family:monospace;" id="modernLoaderPercent">${percent}%</span>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);
}

function updateModernOperationLoader(percent, statusText) {
  const bar = document.getElementById('modernLoaderBar');
  const txt = document.getElementById('modernLoaderStatus');
  const pct = document.getElementById('modernLoaderPercent');
  if (bar) bar.style.width = `${percent}%`;
  if (txt) txt.innerHTML = `${statusText} <span class="fu-loader-dots"></span>`;
  if (pct) pct.textContent = `${percent}%`;
}

function closeModernOperationLoader() {
  const el = document.getElementById('modernOperationLoader');
  if (el) {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.95)';
    el.style.transition = 'all 0.2s ease';
    setTimeout(() => el.remove(), 200);
  }
}

async function executePullGoogleSheet() {
  const sheetUrl = document.getElementById('inputGoogleSheetUrl')?.value?.trim() || '';
  const scriptUrl = document.getElementById('inputGoogleAppsScriptUrl')?.value?.trim() || '';

  if (!sheetUrl) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Perhatian', 'Harap masukkan URL Google Spreadsheet terlebih dahulu.', 'warning');
    } else {
      alert('Harap masukkan URL Google Spreadsheet terlebih dahulu.');
    }
    return;
  }

  // 1. Save to client cache so it always remembers
  localStorage.setItem('sft_google_sheet_url', sheetUrl);
  localStorage.setItem('sft_apps_script_url', scriptUrl);

  // 2. Immediately close and destroy the settings modal
  closeSyncModal();

  // 3. Show Ultra-Modern Cloud Sync Loader
  showModernOperationLoader({
    tag: '2-Way Cloud Sync Engine',
    tagColor: 'emerald',
    icon: 'fa-solid fa-arrows-rotate fa-spin',
    theme: 'emerald-theme',
    title: 'Menghubungkan Google Sheet...',
    subtitle: 'Sedang mengunduh dan menyelaraskan database prospek customer ke CRM SFT.',
    statusText: 'Menghubungkan ke Google Sheets API',
    percent: 45,
    barColor: 'emerald'
  });

  // 4. Save settings first to database
  try {
    await fetch('/api/api_followup_sync.php?action=save_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        google_sheet_url: sheetUrl,
        google_apps_script_url: scriptUrl
      })
    });
  } catch (e) {
    console.error('Save sync settings error', e);
  }

  try {
    updateModernOperationLoader(75, 'Mengekstrak data prospek & memperbarui database');

    const res = await fetch('/api/api_followup_sync.php?action=pull_sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ google_sheet_url: sheetUrl })
    });
    const data = await res.json();

    updateModernOperationLoader(100, 'Sinkronisasi Selesai');
    setTimeout(() => {
      closeModernOperationLoader();
    }, 400);

    if (data && data.success) {
      await initMasterDashboard();
      if (typeof showCustomAlert === 'function') {
        const insertMsg = data.inserted ? `\n\n+${data.inserted} Data Customer Baru Ditambahkan & Disimpan ke Database.` : '';
        showCustomAlert('Sinkronisasi Berhasil!', `${data.message || 'Sinkronisasi Google Spreadsheet berhasil diproses.'}${insertMsg}`, 'success');
      } else {
        alert(data.message || 'Sinkronisasi Google Spreadsheet berhasil!');
      }
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal Sinkronisasi', data?.message || 'Gagal mengambil data dari Google Spreadsheet.', 'danger');
      } else {
        alert(data?.message || 'Gagal mengambil data dari Google Spreadsheet.');
      }
    }
  } catch (e) {
    closeModernOperationLoader();
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Koneksi Terputus', 'Terjadi kesalahan koneksi saat menghubungi server.', 'danger');
    } else {
      alert('Terjadi kesalahan koneksi saat menghubungi server.');
    }
  }
}

// -------------------------------------------------------------
// DELETION LOGIC (SINGLE, BULK, RESET) WITH CUSTOM ALERT
// -------------------------------------------------------------
async function confirmDeleteCustomer(id, name) {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`Apakah Anda yakin ingin menghapus data customer "${name}" secara permanen dari database?`);
  } else {
    isConfirmed = confirm(`Yakin ingin menghapus customer "${name}"?`);
  }

  if (isConfirmed) {
    await executeDeleteCustomer(id);
  }
}

async function executeDeleteCustomer(id) {
  try {
    const res = await fetch('/api/api_followup.php?action=delete_customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = masterState.selectedIds.filter(x => x !== id);
      updateBulkActionBar();

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Customer Dihapus!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal Menghapus', data.message || 'Gagal menghapus customer.', 'danger');
      } else {
        alert(data.message);
      }
    }
  } catch (e) {
    console.error('Delete customer error', e);
  }
}

async function confirmBulkDelete() {
  if (masterState.selectedIds.length === 0) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Data', 'Silakan centang minimal 1 customer untuk dihapus.', 'warning');
    } else {
      alert('Pilih minimal 1 customer untuk dihapus.');
    }
    return;
  }

  const count = masterState.selectedIds.length;
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm(`PERINGATAN: Anda akan menghapus ${count} data customer terpilih secara massal. Tindakan ini tidak dapat dibatalkan. Lanjutkan?`);
  } else {
    isConfirmed = confirm(`Hapus ${count} customer terpilih?`);
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=bulk_delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer_ids: masterState.selectedIds })
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();

      const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
      theadCheckboxes.forEach(cb => cb.checked = false);

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Data Berhasil Dihapus!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    }
  } catch (e) {
    console.error('Bulk delete error', e);
  }
}

async function confirmResetDatabase() {
  let isConfirmed = false;
  if (typeof customConfirm === 'function') {
    isConfirmed = await customConfirm('PERINGATAN KRUSIAL:\nSeluruh data customer follow-up di database cabang akan dikosongkan secara total.\n\nGunakan opsi ini hanya jika Anda ingin mengimpor database baru dari nol. Apakah Anda yakin?');
  } else {
    isConfirmed = confirm('Yakin ingin mengosongkan seluruh database customer?');
  }

  if (!isConfirmed) return;

  try {
    const res = await fetch('/api/api_followup.php?action=reset_database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await res.json();
    if (data.success) {
      masterState.selectedIds = [];
      updateBulkActionBar();

      const theadCheckboxes = document.querySelectorAll('.followup-table thead input[type="checkbox"]');
      theadCheckboxes.forEach(cb => cb.checked = false);

      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Database Dikosongkan!', data.message, 'success');
      } else {
        alert(data.message);
      }
      await initMasterDashboard();
    }
  } catch (e) {
    console.error('Reset error', e);
  }
}

// -------------------------------------------------------------
// SMART QUOTA LEADS DISTRIBUTION MATRIX (50 / 100 per Sales)
// -------------------------------------------------------------
let smartDistState = {
  quota: 50,
  category: 'all',
  selectedSales: [],
  searchFilter: '',
  onlyUnassigned: true,
  excludeKeywords: ''
};

function openSmartDistributionModal() {
  smartDistState.selectedSales = masterState.salesList.map(s => s.id); // Default select all
  smartDistState.quota = 50;
  smartDistState.onlyUnassigned = true;

  // Always recreate with fresh salesList data
  document.getElementById('modalSmartDist')?.remove();
  if (true) {
    const html = `
      <div class="modal-overlay" id="modalSmartDist" onclick="closeSmartDistModal()">
        <div class="modal-content" style="max-width:820px; border-radius:var(--fu-radius-lg); padding:24px; max-height:90vh; overflow-y:auto;" onclick="event.stopPropagation()">

          <!-- Header -->
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:9999px; text-transform:uppercase; margin-bottom:4px;">
                <i class="fa-solid fa-bolt-lightning"></i> Smart Distribution Matrix
              </div>
              <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Bagi Kuota Leads ke Wiraniaga</h3>
              <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">Atur jumlah pembagian data (misal 50 atau 100 leads), prioritaskan data unassigned, dan kecualikan nama/perusahaan tertentu.</p>
            </div>
            <button class="btn-close-modal" onclick="closeSmartDistModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <!-- Proteksi Anti-Double Banner -->
          <div style="background:#ecfdf5; border:1.5px solid #a7f3d0; border-radius:14px; padding:12px 16px; margin-bottom:16px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:34px; height:34px; border-radius:50%; background:#059669; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:15px; flex-shrink:0;">
                <i class="fa-solid fa-shield-halved"></i>
              </div>
              <div>
                <div style="font-size:12.5px; font-weight:800; color:#065f46;">
                  Proteksi Anti-Double: Utamakan Data Belum Ditugaskan
                </div>
                <div style="font-size:11px; color:#047857;">
                  Sistem memprioritaskan database yang belum memiliki sales PIC agar tidak ada customer yang terbagi ganda / double.
                </div>
              </div>
            </div>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer; font-size:12px; font-weight:800; color:#065f46; white-space:nowrap; background:#ffffff; border:1px solid #86efac; padding:5px 10px; border-radius:8px;">
              <input type="checkbox" id="checkOnlyUnassigned" checked style="width:16px; height:16px; accent-color:#059669;" onchange="smartDistState.onlyUnassigned = this.checked; updateSmartDistPreview();">
              Hanya Data Belum Ditugaskan
            </label>
          </div>

          <!-- 1. PENGATURAN KUOTA -->
          <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:16px;">
            <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; margin-bottom:8px; letter-spacing:0.5px;">
              <i class="fa-solid fa-sliders" style="color:#d7123a;"></i> 1. Tentukan Kuota Leads per Wiraniaga:
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:12px;">
              <button type="button" class="category-pill-btn active" id="pillQuota50" onclick="setQuotaPill(50, this)">
                ⚡ 50 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuota100" onclick="setQuotaPill(100, this)">
                🔥 100 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuota25" onclick="setQuotaPill(25, this)">
                ☕ 25 Data / Sales
              </button>
              <button type="button" class="category-pill-btn" id="pillQuotaAll" onclick="setQuotaPill(0, this)">
                ⚖️ Bagi Rata Semua Data
              </button>

              <div style="display:flex; align-items:center; gap:6px; margin-left:auto;">
                <span style="font-size:12px; font-weight:700; color:#475569;">Kustom:</span>
                <input type="number" id="inputCustomQuota" value="50" min="1" max="1000" class="fu-input" style="width:90px; padding:6px 10px; font-size:12px; text-align:center;" oninput="handleCustomQuotaInput(this.value)">
              </div>
            </div>

            <!-- Filter Kategori Leads -->
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
              <div>
                <label style="font-size:11.5px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Filter Kategori Repurchase:</label>
                <select id="distCategorySelect" class="fu-select" style="font-size:12px;" onchange="smartDistState.category = this.value; updateSmartDistPreview();">
                  <option value="all">Semua Kategori (${masterState.stats.unassigned || masterState.stats.total || 0} Leads Unassigned)</option>
                  ${Object.keys(masterState.stats.byCategory || {}).map(cat => `<option value="${cat}">${cat} (${masterState.stats.byCategory[cat]})</option>`).join('')}
                </select>
              </div>
              <div style="display:flex; align-items:flex-end;">
                <div style="font-size:11.5px; color:#64748b; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:8px 12px; width:100%;">
                  Total Leads Siap Dibagikan: <strong style="color:#d7123a; font-size:13px;" id="distPoolCount">0</strong> Data
                </div>
              </div>
            </div>
          </div>

          <!-- 2. PENGECUALIAN DATA / EXCLUDE KEYWORDS -->
          <div style="background:#fff1f2; border:1.5px solid #fecdd3; border-radius:14px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <div style="font-size:12px; font-weight:800; color:#9f1239; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-ban" style="color:#e11d48;"></i> 2. Pengecualian Data (Tidak Dibagikan ke Sales):
              </div>
              <span style="font-size:10.5px; font-weight:800; color:#be123c; background:#ffe4e6; border:1px solid #fecdd3; padding:2px 8px; border-radius:6px;">
                Fitur Filter Khusus
              </span>
            </div>
            <p style="font-size:11.5px; color:#be123c; margin:0 0 8px 0;">
              Ketik nama customer, PT/Perusahaan (misal: <strong>PT Sudeco</strong>), atau kata kunci yang <strong>TIDAK BOLEH</strong> dibagikan ke sales (pisahkan dengan koma jika lebih dari 1):
            </p>
            <div class="fu-input-with-icon">
              <i class="fa-solid fa-filter-circle-xmark" style="color:#e11d48;"></i>
              <input type="text" id="inputDistExcludeKeywords" class="fu-input" placeholder="Contoh: PT Sudeco, PT Rental, Bpk. Hendra..." value="${escapeHtml(smartDistState.excludeKeywords || '')}" style="font-size:12px; border-color:#fda4af; background:#ffffff;" oninput="handleDistExcludeInput(this.value)">
            </div>
            <div id="distExcludePreviewBadge" style="font-size:11.5px; color:#9f1239; font-weight:700; margin-top:8px; display:none; background:#ffe4e6; padding:6px 12px; border-radius:8px; border:1px solid #fecdd3;">
            </div>
          </div>

          <!-- 3. PILIH WIRANIAGA PENERIMA -->
          <div style="background:#ffffff; border:1.5px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:10px;">
              <div style="font-size:12px; font-weight:800; color:#0f172a; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-users-gear" style="color:#10b981;"></i> 3. Pilih Wiraniaga Penerima Leads:
              </div>
              <div style="font-size:12px; font-weight:800; color:#1e40af;">
                <span id="distSelectedSalesCount">0</span> dari ${masterState.salesList.length} Wiraniaga Terpilih
              </div>
            </div>

            <!-- Team Quick Select Buttons -->
            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('all')">
                <i class="fa-solid fa-check-double"></i> Pilih Semua (46)
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Ryan')">
                Tim Pak Ryan
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Alvin')">
                Tim Pak Alvin
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px;" onclick="filterDistSalesByTeam('Pak Riva')">
                Tim Pak Riva
              </button>
              <button type="button" class="btn-fu btn-fu-secondary" style="padding:5px 10px; font-size:11px; color:#ef4444 !important;" onclick="filterDistSalesByTeam('none')">
                <i class="fa-solid fa-xmark"></i> Batal Pilih
              </button>
            </div>

            <!-- Sales Grid with Checkboxes -->
            <div class="fu-input-with-icon" style="margin-bottom:10px;">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="fu-input" placeholder="Cari nama sales..." style="padding-top:6px; padding-bottom:6px; font-size:12px;" oninput="handleDistSalesSearch(this.value)">
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(220px, 1fr)); gap:8px; max-height:220px; overflow-y:auto; padding:4px; border:1px solid #e2e8f0; border-radius:10px; background:#f8fafc;" id="distSalesGridContainer">
            </div>
          </div>

          <!-- 4. LIVE CALCULATION PREVIEW BOX -->
          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #16305f 100%); color:#ffffff; border-radius:14px; padding:16px; margin-bottom:18px; box-shadow:0 6px 20px rgba(13,27,62,0.2);">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <div>
                <div style="font-size:11px; text-transform:uppercase; color:#93c5fd; font-weight:800; letter-spacing:0.5px;">Simulasi Pembagian Leads:</div>
                <div style="font-size:15px; font-weight:900; margin-top:2px;" id="distMathFormula">-</div>
              </div>
              <button class="btn-fu btn-fu-crimson" style="padding:12px 24px; font-size:13.5px;" onclick="executeSmartDistribution()">
                <i class="fa-solid fa-paper-plane"></i> Bagikan Leads Sekarang
              </button>
            </div>
          </div>

        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
  }

  renderDistSalesGrid();
  updateSmartDistPreview();
  document.getElementById('modalSmartDist').classList.add('active');
}

function closeSmartDistModal() {
  const modal = document.getElementById('modalSmartDist');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function setQuotaPill(val, btn) {
  smartDistState.quota = val;
  document.querySelectorAll('#modalSmartDist .category-pill-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('inputCustomQuota').value = val === 0 ? 'Semua' : val;
  updateSmartDistPreview();
}

function handleCustomQuotaInput(val) {
  const num = parseInt(val) || 1;
  smartDistState.quota = num;
  document.querySelectorAll('#modalSmartDist .category-pill-btn').forEach(b => b.classList.remove('active'));
  updateSmartDistPreview();
}

function filterDistSalesByTeam(team) {
  if (team === 'all') {
    smartDistState.selectedSales = masterState.salesList.map(s => s.id);
  } else if (team === 'none') {
    smartDistState.selectedSales = [];
  } else {
    smartDistState.selectedSales = masterState.salesList.filter(s => s.spv === team).map(s => s.id);
  }
  renderDistSalesGrid();
  updateSmartDistPreview();
}

function handleDistSalesSearch(query) {
  smartDistState.searchFilter = query.toLowerCase().trim();
  renderDistSalesGrid();
}

function toggleDistSalesCheckbox(id, checked) {
  if (checked) {
    if (!smartDistState.selectedSales.includes(id)) smartDistState.selectedSales.push(id);
  } else {
    smartDistState.selectedSales = smartDistState.selectedSales.filter(x => x !== id);
  }
  updateSmartDistPreview();
}

function renderDistSalesGrid() {
  const container = document.getElementById('distSalesGridContainer');
  if (!container) return;

  let list = masterState.salesList;
  if (smartDistState.searchFilter) {
    list = list.filter(s => s.name.toLowerCase().includes(smartDistState.searchFilter) || (s.spv && s.spv.toLowerCase().includes(smartDistState.searchFilter)));
  }

  let html = '';
  list.forEach(s => {
    const isChecked = smartDistState.selectedSales.includes(s.id);
    html += `
      <label style="display:flex; align-items:center; gap:8px; background:#ffffff; border:1.5px solid ${isChecked ? '#d7123a' : '#e2e8f0'}; border-radius:10px; padding:8px 10px; cursor:pointer; transition:all 0.15s ease;">
        <input type="checkbox" style="width:16px; height:16px; accent-color:#d7123a;" ${isChecked ? 'checked' : ''} onchange="toggleDistSalesCheckbox(${s.id}, this.checked)">
        <div style="flex:1; overflow:hidden;">
          <div style="font-size:12px; font-weight:800; color:#0f172a; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.name}</div>
          <div style="font-size:10px; color:#64748b;">${s.spv ? `${s.spv}` : 'Sales'} • <strong>${s.total_customers || 0} Task</strong></div>
        </div>
      </label>
    `;
  });

  container.innerHTML = html;
}

function handleDistExcludeInput(val) {
  smartDistState.excludeKeywords = val;
  updateSmartDistPreview();
}

function updateSmartDistPreview() {
  const selectedCount = smartDistState.selectedSales.length;
  document.getElementById('distSelectedSalesCount').textContent = selectedCount;

  // Unassigned pool count
  const unassignedTotal = masterState.stats.unassigned !== undefined ? masterState.stats.unassigned : (masterState.stats.total || 0);
  document.getElementById('distPoolCount').textContent = unassignedTotal;

  // Live preview for excluded keywords
  const exInput = (smartDistState.excludeKeywords || '').trim();
  const badgeEl = document.getElementById('distExcludePreviewBadge');
  if (exInput && badgeEl) {
    const kws = exInput.split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
    const matchedCount = (masterState.customers || []).filter(c => {
      const name = (c.name || '').toLowerCase();
      const car = (c.car_model || '').toLowerCase();
      const notes = (c.notes || '').toLowerCase();
      return kws.some(kw => name.includes(kw) || car.includes(kw) || notes.includes(kw));
    }).length;

    badgeEl.style.display = 'block';
    badgeEl.innerHTML = `<i class="fa-solid fa-ban"></i> <strong>${matchedCount} data</strong> customer (${kws.map(k => `<em>"${escapeHtml(k)}"</em>`).join(', ')}) akan otomatis <strong>DIKECUALIKAN</strong> dan tidak akan dibagikan ke sales.`;
  } else if (badgeEl) {
    badgeEl.style.display = 'none';
  }

  const quota = smartDistState.quota;
  let formulaText = '';

  if (selectedCount === 0) {
    formulaText = '⚠️ Silakan centang minimal 1 wiraniaga penerima leads di atas.';
  } else if (quota === 0) {
    const perSales = Math.floor(unassignedTotal / selectedCount);
    formulaText = `⚖️ <strong>${unassignedTotal} Leads</strong> dibagi rata ke <strong>${selectedCount} Sales</strong> ($\approx$ ${perSales} leads per orang). Sisa 0.`;
  } else {
    const totalWillAssign = Math.min(unassignedTotal, selectedCount * quota);
    const remainder = Math.max(0, unassignedTotal - totalWillAssign);
    formulaText = `🎯 <strong>${selectedCount} Sales</strong> &times; <strong>${quota} Leads</strong> = <strong>${totalWillAssign} Leads</strong> akan dibagikan sekarang.<br><span style="font-size:11.5px; color:#bfdbfe; font-weight:600; margin-top:3px; display:inline-block;">📦 Sisa <strong>${remainder} Leads</strong> tetap tersimpan di database unassigned dan siap ditambahkan saat sales selesai follow-up.</span>`;
  }

  document.getElementById('distMathFormula').innerHTML = formulaText;
}

async function executeSmartDistribution() {
  if (smartDistState.selectedSales.length === 0) {
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Pilih Wiraniaga', 'Harap pilih minimal 1 wiraniaga penerima leads.', 'warning');
    } else {
      alert('Harap pilih minimal 1 wiraniaga penerima.');
    }
    return;
  }

  const quotaVal = smartDistState.quota;
  const salesCount = smartDistState.selectedSales.length;

  // 1. Immediately close and remove the distribution selection modal
  closeSmartDistModal();

  // 2. Show Ultra-Modern Smart Distribution Loader
  showModernOperationLoader({
    tag: 'Smart Distribution Matrix',
    tagColor: 'red',
    icon: 'fa-solid fa-bolt-lightning',
    theme: 'red-theme',
    title: 'Mendistribusikan Leads...',
    subtitle: `Sistem sedang membagi kuota <strong>${quotaVal === 0 ? 'Semua' : quotaVal} leads</strong> ke <strong>${salesCount} wiraniaga</strong> terpilih secara merata.`,
    statusText: 'Menganalisis kuota & mendistribusikan data',
    percent: 60,
    barColor: 'red'
  });

  try {
    updateModernOperationLoader(85, 'Menyimpan alokasi PIC ke database CRM');

    const res = await fetch('/api/api_followup.php?action=distribute_quota', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sales_ids: smartDistState.selectedSales,
        quota_per_sales: smartDistState.quota,
        category: smartDistState.category,
        only_unassigned: smartDistState.onlyUnassigned !== false,
        exclude_keywords: (smartDistState.excludeKeywords || '').trim()
      })
    });
    const data = await res.json();

    updateModernOperationLoader(100, 'Distribusi Selesai');
    setTimeout(() => {
      closeModernOperationLoader();
    }, 400);

    if (data && data.success) {
      await initMasterDashboard();
      showDistSuccessModal(data);
    } else {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Gagal', data?.message || 'Gagal membagikan kuota leads.', 'danger');
      } else {
        alert(data?.message || 'Gagal membagikan kuota leads.');
      }
    }
  } catch (e) {
    closeModernOperationLoader();
    console.error('Smart dist error', e);
    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Koneksi Terputus', 'Gagal menghubungi server saat membagikan leads.', 'danger');
    }
  }
}

function closeDistSuccessModal() {
  const modal = document.getElementById('modalDistSuccess');
  if (modal) {
    modal.classList.remove('active', 'show');
    modal.style.display = 'none';
    modal.remove();
  }
}

function showDistSuccessModal(result) {
  closeDistSuccessModal();

  const breakdown = result.breakdown || [];

  let listHtml = '';
  breakdown.forEach(b => {
    listHtml += `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; margin-bottom:6px;">
        <div>
          <strong style="font-size:13px; color:#0f172a;">${b.sales_name}</strong>
          <span style="font-size:11.5px; color:#10b981; font-weight:700; margin-left:6px;">+${b.assigned_count} Leads</span>
        </div>
        <a href="${b.wa_url}" target="_blank" class="btn-fu btn-fu-emerald" style="padding:5px 12px; font-size:11px; text-decoration:none;">
          <i class="fa-brands fa-whatsapp"></i> Kirim WA Rekap
        </a>
      </div>
    `;
  });

  const modalHtml = `
    <div class="modal-overlay active" id="modalDistSuccess" style="display:flex; position:fixed; inset:0; z-index:99999; background:rgba(15,23,42,0.7); backdrop-filter:blur(4px); align-items:center; justify-content:center;" onclick="closeDistSuccessModal()">
      <div class="modal-content" style="max-width:650px; border-radius:var(--fu-radius-lg); padding:24px; max-height:90vh; overflow-y:auto;" onclick="event.stopPropagation()">
        <div style="display:flex; justify-content:flex-end; margin-bottom:-10px;">
          <button class="btn-close-modal" onclick="closeDistSuccessModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div style="text-align:center; margin-bottom:16px;">
          <div style="width:56px; height:56px; border-radius:50%; background:#dcfce7; color:#16a34a; display:flex; align-items:center; justify-content:center; font-size:26px; margin:0 auto 10px;">
            <i class="fa-solid fa-circle-check"></i>
          </div>
          <h3 style="font-size:18px; font-weight:900; color:#0d1b3e; margin:0;">Pembagian Leads Berhasil!</h3>
          <p style="font-size:12.5px; color:#64748b; margin:4px 0 0 0;">${result.message}</p>
        </div>

        <div style="font-size:11.5px; font-weight:800; text-transform:uppercase; color:#475569; margin-bottom:8px;">
          Kirim Notifikasi Daftar Tugas ke WhatsApp Sales:
        </div>

        <div style="max-height:300px; overflow-y:auto; margin-bottom:16px;">
          ${listHtml}
        </div>

        <button class="btn-fu btn-fu-navy" style="width:100%; justify-content:center; padding:12px;" onclick="closeDistSuccessModal()">
          <i class="fa-solid fa-check"></i> Selesai &amp; Lihat Tabel
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}


