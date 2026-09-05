/**
 * ==========================================================================
 * TOYOTA KC SALES DASHBOARD - APPLICATION CONTROLLER
 * ==========================================================================
 */

const App = (() => {
  // State
  let rawDataset = [];
  let filteredData = [];
  let activeTab = 'overview';

  const filters = {
    month: 'ALL',
    spv: 'ALL',
    model: 'ALL',
    method: 'ALL',
    pma: 'ALL',
    leasing: 'ALL'
  };

  const tableState = {
    page: 1,
    pageSize: 20,
    searchQuery: '',
    sortCol: 'id',
    sortAsc: true
  };

  const salesmanTableState = {
    searchQuery: '',
    sortCol: 'totalQty',
    sortAsc: false
  };

  // Initialize
  function init() {
    // Load dataset from initial_data.js
    if (window.INITIAL_SALES_DATA && Array.isArray(window.INITIAL_SALES_DATA)) {
      rawDataset = [...window.INITIAL_SALES_DATA];
    } else {
      console.warn('Initial sales data not found, waiting or empty.');
      rawDataset = [];
    }

    setupTheme();
    setupDropdownOptions();
    bindEvents();
    applyFilters();

    // Render Lucide icons if loaded
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // Theme setup (Dark / Light)
  function setupTheme() {
    const savedTheme = localStorage.getItem('toyota_dashboard_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleBtn(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('toyota_dashboard_theme', next);
    updateThemeToggleBtn(next);
    ChartsEngine.refreshTheme();
  }

  function updateThemeToggleBtn(theme) {
    const btn = document.getElementById('btn-toggle-theme');
    if (!btn) return;
    if (theme === 'dark') {
      btn.innerHTML = `<i data-lucide="sun"></i><span>Light Mode</span>`;
    } else {
      btn.innerHTML = `<i data-lucide="moon"></i><span>Dark Mode</span>`;
    }
    if (window.lucide) window.lucide.createIcons();
  }

  // Populate dynamic dropdown filters based on raw data
  function setupDropdownOptions() {
    const spvSelect = document.getElementById('filter-spv');
    const modelSelect = document.getElementById('filter-model');
    const leasingSelect = document.getElementById('filter-leasing');

    const spvSet = new Set();
    const modelSet = new Set();
    const leasingSet = new Set();

    rawDataset.forEach(item => {
      if (item.spv) spvSet.add(item.spv);
      if (item.model) modelSet.add(item.model);
      if (item.leasing && item.leasing !== 'CASH' && item.leasing !== '-') leasingSet.add(item.leasing);
    });

    if (spvSelect) {
      spvSelect.innerHTML = '<option value="ALL">Semua Supervisor</option>';
      Array.from(spvSet).sort().forEach(spv => {
        spvSelect.innerHTML += `<option value="${spv}">${spv}</option>`;
      });
    }

    if (modelSelect) {
      modelSelect.innerHTML = '<option value="ALL">Semua Model</option>';
      Array.from(modelSet).sort().forEach(model => {
        modelSelect.innerHTML += `<option value="${model}">${model}</option>`;
      });
    }

    if (leasingSelect) {
      leasingSelect.innerHTML = '<option value="ALL">Semua Leasing</option>';
      Array.from(leasingSet).sort().forEach(leasing => {
        leasingSelect.innerHTML += `<option value="${leasing}">${leasing}</option>`;
      });
    }
  }

  // Event bindings
  function bindEvents() {
    // Theme toggle
    const themeBtn = document.getElementById('btn-toggle-theme');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Month pills
    const monthPills = document.querySelectorAll('.month-pills .pill-btn');
    monthPills.forEach(btn => {
      btn.addEventListener('click', (e) => {
        monthPills.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        filters.month = btn.getAttribute('data-month');
        applyFilters();
      });
    });

    // Dropdowns
    const spvSelect = document.getElementById('filter-spv');
    if (spvSelect) {
      spvSelect.addEventListener('change', (e) => {
        filters.spv = e.target.value;
        applyFilters();
      });
    }

    const modelSelect = document.getElementById('filter-model');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        filters.model = e.target.value;
        applyFilters();
      });
    }

    const methodSelect = document.getElementById('filter-method');
    if (methodSelect) {
      methodSelect.addEventListener('change', (e) => {
        filters.method = e.target.value;
        applyFilters();
      });
    }

    const pmaSelect = document.getElementById('filter-pma');
    if (pmaSelect) {
      pmaSelect.addEventListener('change', (e) => {
        filters.pma = e.target.value;
        applyFilters();
      });
    }

    const leasingSelect = document.getElementById('filter-leasing');
    if (leasingSelect) {
      leasingSelect.addEventListener('change', (e) => {
        filters.leasing = e.target.value;
        applyFilters();
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('btn-reset-filter');
    if (resetBtn) resetBtn.addEventListener('click', resetFilters);

    // Navigation Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabTarget = btn.getAttribute('data-tab');
        switchTab(tabTarget);
      });
    });

    // Data Table Search & Page Size
    const tableSearch = document.getElementById('input-table-search');
    if (tableSearch) {
      tableSearch.addEventListener('input', (e) => {
        tableState.searchQuery = e.target.value.toLowerCase().trim();
        tableState.page = 1;
        renderDataTable();
      });
    }

    const pageSizeSelect = document.getElementById('select-page-size');
    if (pageSizeSelect) {
      pageSizeSelect.addEventListener('change', (e) => {
        tableState.pageSize = parseInt(e.target.value, 10);
        tableState.page = 1;
        renderDataTable();
      });
    }

    // Salesman Search
    const salesmanSearch = document.getElementById('input-salesman-search');
    if (salesmanSearch) {
      salesmanSearch.addEventListener('input', (e) => {
        salesmanTableState.searchQuery = e.target.value.toLowerCase().trim();
        renderSalesmanLeaderboard();
      });
    }

    // Export Buttons
    const btnExportCSV = document.getElementById('btn-export-csv');
    if (btnExportCSV) btnExportCSV.addEventListener('click', () => exportData('csv'));

    const btnExportExcel = document.getElementById('btn-export-excel');
    if (btnExportExcel) btnExportExcel.addEventListener('click', () => exportData('xlsx'));

    // Upload Modal Events
    setupUploadModal();
  }

  // Reset all filters
  function resetFilters() {
    filters.month = 'ALL';
    filters.spv = 'ALL';
    filters.model = 'ALL';
    filters.method = 'ALL';
    filters.pma = 'ALL';
    filters.leasing = 'ALL';

    // Reset month pills UI
    document.querySelectorAll('.month-pills .pill-btn').forEach(b => {
      if (b.getAttribute('data-month') === 'ALL') b.classList.add('active');
      else b.classList.remove('active');
    });

    // Reset dropdowns
    const spvSelect = document.getElementById('filter-spv');
    if (spvSelect) spvSelect.value = 'ALL';
    const modelSelect = document.getElementById('filter-model');
    if (modelSelect) modelSelect.value = 'ALL';
    const methodSelect = document.getElementById('filter-method');
    if (methodSelect) methodSelect.value = 'ALL';
    const pmaSelect = document.getElementById('filter-pma');
    if (pmaSelect) pmaSelect.value = 'ALL';
    const leasingSelect = document.getElementById('filter-leasing');
    if (leasingSelect) leasingSelect.value = 'ALL';

    applyFilters();
    showToast('Semua filter telah direset.', 'info');
  }

  // Switch active tab
  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.tab-btn').forEach(b => {
      if (b.getAttribute('data-tab') === tabId) b.classList.add('active');
      else b.classList.remove('active');
    });

    document.querySelectorAll('.tab-pane').forEach(p => {
      if (p.id === `tab-${tabId}`) p.classList.add('active');
      else p.classList.remove('active');
    });

    // Render tab charts after DOM layout settles
    setTimeout(() => {
      renderCurrentTabCharts();
      if (window.lucide) window.lucide.createIcons();
    }, 50);
  }

  // Apply filters and re-render everything
  function applyFilters() {
    filteredData = AnalyticsEngine.filterData(rawDataset, filters);

    // Update active badges summary
    updateActiveFilterBadges();

    // Calculate Master KPIs
    const kpis = AnalyticsEngine.calculateKPIs(filteredData);
    renderMasterKPIs(kpis);

    // Update active tab charts & tables
    renderCurrentTabCharts();

    // Update Data Table
    tableState.page = 1;
    renderDataTable();
  }

  // Update active filter badge list
  function updateActiveFilterBadges() {
    const container = document.getElementById('active-filters-badges');
    const wrapper = document.getElementById('filter-active-summary-row');
    if (!container || !wrapper) return;

    const badges = [];
    if (filters.month !== 'ALL') badges.push({ key: 'month', label: `Bulan: ${filters.month}` });
    if (filters.spv !== 'ALL') badges.push({ key: 'spv', label: `SPV: ${filters.spv}` });
    if (filters.model !== 'ALL') badges.push({ key: 'model', label: `Model: ${filters.model}` });
    if (filters.method !== 'ALL') badges.push({ key: 'method', label: `Metode: ${filters.method}` });
    if (filters.pma !== 'ALL') badges.push({ key: 'pma', label: `Area: ${filters.pma}` });
    if (filters.leasing !== 'ALL') badges.push({ key: 'leasing', label: `Leasing: ${filters.leasing}` });

    if (badges.length === 0) {
      wrapper.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    wrapper.style.display = 'flex';
    container.innerHTML = badges.map(b => `
      <span class="active-badge">
        ${b.label}
        <button onclick="App.removeFilter('${b.key}')" title="Hapus filter">&times;</button>
      </span>
    `).join('');
  }

  function removeFilter(key) {
    if (key === 'month') {
      filters.month = 'ALL';
      document.querySelectorAll('.month-pills .pill-btn').forEach(b => {
        if (b.getAttribute('data-month') === 'ALL') b.classList.add('active');
        else b.classList.remove('active');
      });
    } else {
      filters[key] = 'ALL';
      const el = document.getElementById(`filter-${key}`);
      if (el) el.value = 'ALL';
    }
    applyFilters();
  }

  // Render Master 5 KPIs
  function renderMasterKPIs(kpis) {
    const elQty = document.getElementById('kpi-total-unit');
    const elOTR = document.getElementById('kpi-total-otr');
    const elAR = document.getElementById('kpi-total-ar');
    const elDisc = document.getElementById('kpi-total-discount');
    const elKredit = document.getElementById('kpi-kredit-ratio');

    if (elQty) elQty.textContent = AnalyticsEngine.formatNumber(kpis.totalQty) + ' Unit';
    if (elOTR) elOTR.textContent = AnalyticsEngine.formatCompactRupiah(kpis.totalOTR);
    if (elAR) elAR.textContent = AnalyticsEngine.formatCompactRupiah(kpis.totalAR);
    if (elDisc) elDisc.textContent = AnalyticsEngine.formatCompactRupiah(kpis.totalDiscount);
    if (elKredit) elKredit.textContent = AnalyticsEngine.formatPercent(kpis.kreditRate);

    // Subtitles / details
    const elQtySub = document.getElementById('kpi-unit-sub');
    if (elQtySub) elQtySub.textContent = `Dari ${kpis.recordCount} faktur transaksi`;

    const elOTRSub = document.getElementById('kpi-otr-sub');
    if (elOTRSub) elOTRSub.textContent = `Rata-rata: ${AnalyticsEngine.formatCompactRupiah(kpis.avgOTR)}/unit`;

    const elARSub = document.getElementById('kpi-ar-sub');
    if (elARSub) elARSub.textContent = `Realisasi AR: ${AnalyticsEngine.formatPercent(kpis.arRealizationRate)}`;

    const elDiscSub = document.getElementById('kpi-disc-sub');
    if (elDiscSub) elDiscSub.textContent = `Rata-rata: ${AnalyticsEngine.formatCompactRupiah(kpis.avgDiscount)}/unit (${AnalyticsEngine.formatPercent(kpis.discountRate)})`;

    const elKreditSub = document.getElementById('kpi-kredit-sub');
    if (elKreditSub) elKreditSub.textContent = `${kpis.kreditQty} Kredit vs ${kpis.cashQty} Cash`;
  }

  // Render charts appropriate for the active tab
  function renderCurrentTabCharts() {
    const kpis = AnalyticsEngine.calculateKPIs(filteredData);
    const monthly = AnalyticsEngine.getMonthlyTrend(filteredData);
    const models = AnalyticsEngine.getModelBreakdown(filteredData);
    const spvs = AnalyticsEngine.getSPVBreakdown(filteredData);

    if (activeTab === 'overview') {
      ChartsEngine.renderMonthlyTrend(monthly);
      ChartsEngine.renderTopModels(models);
      ChartsEngine.renderSPVPerformance(spvs);
      ChartsEngine.renderPaymentMethod(kpis);

      // Render Executive Narrative Insight
      const insight = AnalyticsEngine.generateExecutiveInsight(kpis, monthly, models, spvs);
      const elInsightTitle = document.getElementById('insight-title');
      const elInsightText = document.getElementById('insight-text');
      if (elInsightTitle) elInsightTitle.textContent = insight.title;
      if (elInsightText) elInsightText.innerHTML = insight.description;
    } else if (activeTab === 'models') {
      ChartsEngine.renderAllModelsChart(models);
      const segments = AnalyticsEngine.getSegmentBreakdown(filteredData);
      ChartsEngine.renderSegmentShare(segments);
      const colors = AnalyticsEngine.getColorBreakdown(filteredData);
      ChartsEngine.renderColorChart(colors);
    } else if (activeTab === 'sales') {
      renderSPVDetails(spvs);
      renderSalesmanLeaderboard();
    } else if (activeTab === 'financial') {
      const leasings = AnalyticsEngine.getLeasingBreakdown(filteredData);
      ChartsEngine.renderLeasingChart(leasings);
      ChartsEngine.renderAvgDiscountChart(models);
    } else if (activeTab === 'demographics') {
      ChartsEngine.renderPMAChart(kpis);
      const prospects = AnalyticsEngine.getProspectBreakdown(filteredData);
      ChartsEngine.renderProspectSourceChart(prospects);
      const profiles = AnalyticsEngine.getBuyerProfileBreakdown(filteredData);
      ChartsEngine.renderBuyerProfileChart(profiles);
      const areas = AnalyticsEngine.getAreaBreakdown(filteredData);
      ChartsEngine.renderTopCitiesChart(areas);
    }
  }

  // Render SPV Team Cards
  function renderSPVDetails(spvs) {
    const container = document.getElementById('spv-cards-container');
    if (!container) return;

    container.innerHTML = spvs.map(s => `
      <div class="spv-card">
        <div class="spv-avatar">${s.spv.charAt(0)}</div>
        <div class="spv-details">
          <h4>${s.spv}</h4>
          <div class="spv-metrics">
            <span>Unit: <strong>${s.qty}</strong></span>
            <span>Omset: <strong>${AnalyticsEngine.formatCompactRupiah(s.otr)}</strong></span>
            <span>Sales: <strong>${s.salesCount} org</strong></span>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Render Salesman Podium and Full Matrix Table
  function renderSalesmanLeaderboard() {
    let salesList = AnalyticsEngine.getSalesmanLeaderboard(filteredData);

    // Apply salesman search query if any
    if (salesmanTableState.searchQuery) {
      salesList = salesList.filter(s =>
        s.sales.toLowerCase().includes(salesmanTableState.searchQuery) ||
        s.spv.toLowerCase().includes(salesmanTableState.searchQuery)
      );
    }

    // Render Podium (Top 3) only if no search active
    const podiumEl = document.getElementById('sales-podium-container');
    if (podiumEl) {
      if (!salesmanTableState.searchQuery && salesList.length >= 3) {
        podiumEl.style.display = 'flex';
        const rank1 = salesList[0];
        const rank2 = salesList[1];
        const rank3 = salesList[2];

        podiumEl.innerHTML = `
          <!-- Silver (2nd) -->
          <div class="podium-step podium-silver">
            <div class="podium-medal">2</div>
            <div class="podium-name" title="${rank2.sales}">${rank2.sales}</div>
            <div class="podium-stats">${rank2.totalQty} Unit | ${AnalyticsEngine.formatCompactRupiah(rank2.totalOTR)}</div>
            <div class="podium-bar">${rank2.totalQty}</div>
          </div>
          <!-- Gold (1st) -->
          <div class="podium-step podium-gold">
            <div class="podium-medal">👑</div>
            <div class="podium-name" title="${rank1.sales}">${rank1.sales}</div>
            <div class="podium-stats">${rank1.totalQty} Unit | ${AnalyticsEngine.formatCompactRupiah(rank1.totalOTR)}</div>
            <div class="podium-bar">${rank1.totalQty}</div>
          </div>
          <!-- Bronze (3rd) -->
          <div class="podium-step podium-bronze">
            <div class="podium-medal">3</div>
            <div class="podium-name" title="${rank3.sales}">${rank3.sales}</div>
            <div class="podium-stats">${rank3.totalQty} Unit | ${AnalyticsEngine.formatCompactRupiah(rank3.totalOTR)}</div>
            <div class="podium-bar">${rank3.totalQty}</div>
          </div>
        `;
      } else {
        podiumEl.style.display = 'none';
      }
    }

    // Render Matrix Table
    const tbody = document.getElementById('tbody-salesman-matrix');
    if (!tbody) return;

    if (salesList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="13" style="text-align: center; padding: 2rem; color: var(--text-muted);">Tidak ada salesman yang cocok dengan pencarian.</td></tr>`;
      return;
    }

    tbody.innerHTML = salesList.map(s => {
      let rankClass = 'other';
      if (s.rank === 1) rankClass = 'top-1';
      else if (s.rank === 2) rankClass = 'top-2';
      else if (s.rank === 3) rankClass = 'top-3';

      return `
        <tr>
          <td style="text-align: center;"><span class="rank-badge ${rankClass}">${s.rank}</span></td>
          <td style="font-weight: 700;">${s.sales}</td>
          <td><span class="active-badge" style="background:var(--bg-subtle); color:var(--text-muted); border-color:var(--border-subtle); font-size: 0.725rem;">${s.spv}</span></td>
          <td class="num">${s.monthly.Jan || '-'}</td>
          <td class="num">${s.monthly.Feb || '-'}</td>
          <td class="num">${s.monthly.Mar || '-'}</td>
          <td class="num">${s.monthly.Apr || '-'}</td>
          <td class="num">${s.monthly.May || '-'}</td>
          <td class="num">${s.monthly.Jun || '-'}</td>
          <td class="num">${s.monthly.Jul || '-'}</td>
          <td class="num" style="font-weight: 800; color: var(--primary);">${s.totalQty}</td>
          <td class="num">${AnalyticsEngine.formatCompactRupiah(s.totalOTR)}</td>
          <td class="num">${AnalyticsEngine.formatCompactRupiah(s.avgDiscount)}</td>
        </tr>
      `;
    }).join('');
  }

  // Render Paginated Interactive Data Table
  function renderDataTable() {
    const tbody = document.getElementById('tbody-transactions');
    const pageInfo = document.getElementById('table-page-info');
    const paginationControls = document.getElementById('table-pagination-controls');
    if (!tbody) return;

    // Filter by search
    let list = filteredData;
    if (tableState.searchQuery) {
      const q = tableState.searchQuery;
      list = list.filter(item =>
        item.customer.toLowerCase().includes(q) ||
        item.invoiceNo.toLowerCase().includes(q) ||
        item.sales.toLowerCase().includes(q) ||
        item.model.toLowerCase().includes(q) ||
        item.spkNo.toLowerCase().includes(q) ||
        (item.city && item.city.toLowerCase().includes(q))
      );
    }

    const totalRecords = list.length;
    const totalPages = Math.ceil(totalRecords / tableState.pageSize) || 1;
    if (tableState.page > totalPages) tableState.page = totalPages;

    const startIdx = (tableState.page - 1) * tableState.pageSize;
    const endIdx = Math.min(startIdx + tableState.pageSize, totalRecords);
    const pageItems = list.slice(startIdx, endIdx);

    if (pageItems.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" style="text-align: center; padding: 2.5rem; color: var(--text-muted);">Tidak ada transaksi yang cocok.</td></tr>`;
      if (pageInfo) pageInfo.textContent = 'Menampilkan 0 data';
      if (paginationControls) paginationControls.innerHTML = '';
      return;
    }

    tbody.innerHTML = pageItems.map(item => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.775rem;">${item.invoiceNo}</td>
        <td>${item.invoiceDate || item.deliveryDate || '-'}</td>
        <td style="font-weight: 700;">${item.customer}</td>
        <td><strong>${item.model}</strong> <span style="font-size: 0.725rem; color: var(--text-muted);">(${item.typeDesc})</span></td>
        <td>${item.sales}</td>
        <td><span class="active-badge" style="background:var(--bg-subtle); color:var(--text-muted); border-color:var(--border-subtle);">${item.spv}</span></td>
        <td>
          <span class="kpi-pill" style="${item.method === 'CASH' ? 'background:var(--success-light); color:var(--success);' : 'background:var(--primary-light); color:var(--primary);'}">
            ${item.method}
          </span>
        </td>
        <td class="num">${AnalyticsEngine.formatRupiah(item.otr)}</td>
        <td class="num">${AnalyticsEngine.formatRupiah(item.disc)}</td>
        <td><span class="kpi-pill" style="${item.pma === 'PMA' ? 'background:var(--primary-light); color:var(--primary);' : 'background:var(--warning-light); color:var(--warning);'}">${item.pma}</span></td>
      </tr>
    `).join('');

    if (pageInfo) {
      pageInfo.textContent = `Menampilkan ${startIdx + 1} - ${endIdx} dari ${totalRecords} transaksi`;
    }

    // Build pagination controls
    if (paginationControls) {
      let buttonsHtml = `
        <button class="page-btn" onclick="App.goToPage(${tableState.page - 1})" ${tableState.page === 1 ? 'disabled' : ''}>&laquo; Prev</button>
      `;

      const maxBtns = 5;
      let startPage = Math.max(1, tableState.page - 2);
      let endPage = Math.min(totalPages, startPage + maxBtns - 1);
      if (endPage - startPage < maxBtns - 1) {
        startPage = Math.max(1, endPage - maxBtns + 1);
      }

      for (let p = startPage; p <= endPage; p++) {
        buttonsHtml += `
          <button class="page-btn ${p === tableState.page ? 'active' : ''}" onclick="App.goToPage(${p})">${p}</button>
        `;
      }

      buttonsHtml += `
        <button class="page-btn" onclick="App.goToPage(${tableState.page + 1})" ${tableState.page === totalPages ? 'disabled' : ''}>Next &raquo;</button>
      `;

      paginationControls.innerHTML = buttonsHtml;
    }
  }

  function goToPage(page) {
    tableState.page = page;
    renderDataTable();
  }

  // Export current filtered data
  function exportData(format) {
    if (!window.XLSX) {
      alert('Library SheetJS belum siap.');
      return;
    }

    const exportRows = filteredData.map(item => ({
      'No Faktur': item.invoiceNo,
      'Tanggal': item.invoiceDate || item.deliveryDate,
      'Bulan': item.month,
      'Model': item.model,
      'Tipe / Varian': item.typeDesc,
      'Warna': item.color,
      'Customer': item.customer,
      'Salesman': item.sales,
      'Supervisor': item.spv,
      'Metode Pembayaran': item.method,
      'Leasing': item.leasing,
      'Harga OTR (Rp)': item.otr,
      'Total AR (Rp)': item.ar,
      'Diskon (Rp)': item.disc,
      'BBN (Rp)': item.bbn,
      'PPN (Rp)': item.ppn,
      'Area': item.pma,
      'Kota': item.city,
      'Sumber Prospek': item.prospect,
      'Profil Pembeli': item.buyerProfile
    }));

    const ws = XLSX.utils.json_to_sheet(exportRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Data");

    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `Toyota_KC_Sales_Filtered_${dateStr}.${format === 'csv' ? 'csv' : 'xlsx'}`;

    if (format === 'csv') {
      XLSX.writeFile(wb, filename, { bookType: 'csv' });
    } else {
      XLSX.writeFile(wb, filename, { bookType: 'xlsx' });
    }

    showToast(`Data berhasil diekspor (${format.toUpperCase()}): ${filename}`, 'success');
  }

  // Setup Excel upload modal and drag-drop parser
  function setupUploadModal() {
    const modal = document.getElementById('modal-upload-excel');
    const openBtn = document.getElementById('btn-open-upload-modal');
    const closeBtn = document.getElementById('btn-close-upload-modal');
    const cancelBtn = document.getElementById('btn-cancel-upload');
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('input-file-excel');
    const resetDefaultBtn = document.getElementById('btn-reset-default-data');

    if (!modal) return;

    if (openBtn) openBtn.addEventListener('click', () => modal.classList.add('active'));
    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    if (cancelBtn) cancelBtn.addEventListener('click', () => modal.classList.remove('active'));

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', () => fileInput.click());

      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
      });

      dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));

      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processExcelFile(e.dataTransfer.files[0]);
        }
      });

      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          processExcelFile(e.target.files[0]);
        }
      });
    }

    if (resetDefaultBtn) {
      resetDefaultBtn.addEventListener('click', () => {
        if (window.INITIAL_SALES_DATA) {
          rawDataset = [...window.INITIAL_SALES_DATA];
          setupDropdownOptions();
          resetFilters();
          const tag = document.getElementById('dataset-badge-tag');
          if (tag) tag.innerHTML = `<i data-lucide="calendar"></i> <span>Januari – Juli 2026 (Default)</span>`;
          if (window.lucide) window.lucide.createIcons();
          modal.classList.remove('active');
          showToast('Data dikembalikan ke dataset awal 2026.', 'info');
        }
      });
    }
  }

  // Parse uploaded Excel file using SheetJS
  function processExcelFile(file) {
    if (!window.XLSX) {
      alert('SheetJS library belum dimuat.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Find best sheet: 'SOURCE DATA' or first sheet
        let sheetName = workbook.SheetNames.find(s => s.toUpperCase().includes('SOURCE') || s.toUpperCase().includes('DATA'));
        if (!sheetName) sheetName = workbook.SheetNames[0];

        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!json || json.length === 0) {
          alert('Sheet ' + sheetName + ' kosong atau tidak memiliki data.');
          return;
        }

        // Clean and transform uploaded records
        const newRecords = [];
        json.forEach((r, idx) => {
          const qty = parseFloat(r['Qty'] || 1) || 1;
          const otr = parseFloat(String(r['Harga OTR'] || 0).replace(/[^0-9.-]+/g, "")) || 0;
          const ar = parseFloat(String(r['Harga Total AR'] || 0).replace(/[^0-9.-]+/g, "")) || 0;
          const disc = parseFloat(String(r['Harga Discount'] || 0).replace(/[^0-9.-]+/g, "")) || 0;
          const bbn = parseFloat(String(r['BBN'] || 0).replace(/[^0-9.-]+/g, "")) || 0;
          const ppn = parseFloat(String(r['PPN'] || 0).replace(/[^0-9.-]+/g, "")) || 0;

          let month = String(r['Month'] || 'Jan').trim();
          if (month.length > 3) month = month.slice(0, 3);
          month = month.charAt(0).toUpperCase() + month.slice(1).toLowerCase();

          newRecords.push({
            id: idx + 1,
            invoiceNo: String(r['Invoice No.'] || `INV-${idx+1}`).trim(),
            invoiceDate: String(r['Invoice Date'] || r['Invoice Date  '] || '').trim(),
            deliveryDate: String(r['Delivery Date'] || '').trim(),
            month: month,
            monthName: AnalyticsEngine.MONTH_NAMES[month] || month,
            year: 2026,
            model: String(r['Model2'] || r['Model1'] || 'OTHER').trim().toUpperCase(),
            typeDesc: String(r['Model3'] || r['Tipe Kendaraan'] || '-').trim(),
            color: String(r['Colour Desc'] || 'STANDAR').trim().toUpperCase(),
            spv: String(r['Supervisor'] || 'UNKNOWN').trim().toUpperCase(),
            sales: String(r['Sales Person'] || 'UNKNOWN').trim().toUpperCase(),
            customer: String(r['Customer'] || 'N/A').trim(),
            method: String(r['Method Of Payment'] || 'KREDIT').trim().toUpperCase() === 'CASH' ? 'CASH' : 'KREDIT',
            leasing: String(r['Nama Leasing'] || 'OTHERS').trim().toUpperCase(),
            pma: String(r['PMA'] || 'PMA').toUpperCase().includes('NO') ? 'NON PMA' : 'PMA',
            city: String(r['CITY'] || r['Owner City'] || 'KOTA BANDUNG').trim().toUpperCase(),
            prospect: String(r['Sumber Prospek'] || 'LAINNYA').trim().toUpperCase(),
            buyerProfile: String(r['Profil Pembelian'] || 'FIRST BUYER').trim().toUpperCase(),
            qty,
            otr,
            ar,
            disc,
            bbn,
            ppn,
            spkNo: String(r['SPK No.'] || '-').trim()
          });
        });

        rawDataset = newRecords;
        setupDropdownOptions();
        resetFilters();

        const tag = document.getElementById('dataset-badge-tag');
        if (tag) tag.innerHTML = `<i data-lucide="file-spreadsheet"></i> <span>Data: ${file.name} (${newRecords.length} baris)</span>`;
        if (window.lucide) window.lucide.createIcons();

        const modal = document.getElementById('modal-upload-excel');
        if (modal) modal.classList.remove('active');

        showToast(`File "${file.name}" berhasil diunggah (${newRecords.length} transaksi).`, 'success');
      } catch (err) {
        console.error('Error parsing Excel file:', err);
        alert('Gagal memproses file Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // Toast Notification
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    const icon = type === 'success' ? 'check-circle' : 'info';
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${message}</span>`;
    container.appendChild(toast);

    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  return {
    init,
    removeFilter,
    goToPage,
    exportData
  };
})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
