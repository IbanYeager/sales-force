/**
 * js/penjualan_merchandise.js
 * Controller for Official Merchandise Sales Monitoring (Kacab & SPV Portal)
 */

let currentPage = 1;
let currentLimit = 12;
let totalPages = 1;
let currentTabFilter = 'all';
let merchandiseItemsCache = [];
let salesListCache = [];
let searchDebounceTimeout = null;
let currentTransactionsData = [];

// Helper Format Rupiah
function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number || 0);
}

function formatAngka(number) {
  return new Intl.NumberFormat('id-ID').format(number || 0);
}

// Helper category icons
function getCategoryIcon(cat) {
  const c = (cat || '').toLowerCase();
  if (c.includes('jaket') || c.includes('hoodie')) return 'fa-vest';
  if (c.includes('polo')) return 'fa-shirt';
  if (c.includes('t-shirt') || c.includes('kaos')) return 'fa-shirt';
  if (c.includes('topi')) return 'fa-hat-cowboy-side';
  if (c.includes('tumbler') || c.includes('drink')) return 'fa-mug-hot';
  if (c.includes('payung')) return 'fa-umbrella';
  if (c.includes('gantungan') || c.includes('lanyard')) return 'fa-key';
  if (c.includes('tas') || c.includes('tote')) return 'fa-bag-shopping';
  return 'fa-box-open';
}

document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadOverview();
  loadTransactions(1);
  loadDropdownData();
});

function setupEventListeners() {
  const filterPeriode = document.getElementById('filterPeriode');
  if (filterPeriode) filterPeriode.addEventListener('change', () => { loadOverview(); loadTransactions(1); });

  const filterSpv = document.getElementById('filterSpv');
  if (filterSpv) filterSpv.addEventListener('change', () => { loadOverview(); loadTransactions(1); });

  const filterKategori = document.getElementById('filterKategori');
  if (filterKategori) filterKategori.addEventListener('change', () => { loadOverview(); loadTransactions(1); });

  const filterMetode = document.getElementById('filterMetode');
  if (filterMetode) filterMetode.addEventListener('change', () => { loadOverview(); loadTransactions(1); });

  const searchInput = document.getElementById('merchSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounceTimeout);
      searchDebounceTimeout = setTimeout(() => {
        currentPage = 1;
        loadTransactions(1);
        loadOverview();
      }, 350);
    });
  }

  // Prev / Next Page Buttons
  const btnPrev = document.getElementById('btnPrevPage');
  if (btnPrev) btnPrev.addEventListener('click', () => { if (currentPage > 1) loadTransactions(currentPage - 1); });

  const btnNext = document.getElementById('btnNextPage');
  if (btnNext) btnNext.addEventListener('click', () => { if (currentPage < totalPages) loadTransactions(currentPage + 1); });
}

// Tab Filter switching
function setTabFilter(tabName, element) {
  currentTabFilter = tabName;
  document.querySelectorAll('.merch-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (element) element.classList.add('active');

  currentPage = 1;
  loadTransactions(1);
}

/**
 * 1. Load Overview (KPIs, Top Items, SPV Breakdown, Category Breakdown, Sales Leaderboard)
 */
async function loadOverview() {
  const periode = document.getElementById('filterPeriode')?.value || 'all';
  const spv = document.getElementById('filterSpv')?.value || 'all';
  const kategori = document.getElementById('filterKategori')?.value || 'all';
  const metode = (currentTabFilter !== 'all') ? currentTabFilter : (document.getElementById('filterMetode')?.value || 'all');
  const search = document.getElementById('merchSearchInput')?.value || '';

  const params = new URLSearchParams({
    action: 'get_overview',
    periode: periode,
    spv: spv,
    kategori: kategori,
    metode: metode,
    search: search
  });

  try {
    const res = await fetch(`../api/api_penjualan_merchandise.php?${params.toString()}`);
    const json = await res.json();

    if (json.status === 'success') {
      renderKpiCards(json.kpi, json.top_items);
      renderTopItems(json.top_items);
      renderSpvBreakdown(json.spv_breakdown);
      renderCategoryBreakdown(json.category_breakdown);
      renderSalesLeaderboard(json.sales_leaderboard);
      populateDynamicFilters(json.filters);
    }
  } catch (err) {
    console.error('Gagal memuat overview merchandise:', err);
  }
}

/**
 * Render 4 KPI Cards
 */
function renderKpiCards(kpi, topItems) {
  if (!kpi) return;

  const totalRevEl = document.getElementById('kpiTotalRevenue');
  if (totalRevEl) totalRevEl.textContent = formatRupiah(kpi.total_revenue);

  const totalQtyEl = document.getElementById('kpiTotalQty');
  if (totalQtyEl) totalQtyEl.textContent = `${formatAngka(kpi.total_qty)} Pcs`;

  const avgRevEl = document.getElementById('kpiAvgRevenue');
  if (avgRevEl) avgRevEl.textContent = formatRupiah(kpi.avg_transaksi);

  const topItemEl = document.getElementById('kpiTopItemName');
  const topItemQtyEl = document.getElementById('kpiTopItemQty');
  if (topItems && topItems.length > 0) {
    if (topItemEl) topItemEl.textContent = topItems[0].nama_barang;
    if (topItemQtyEl) topItemQtyEl.textContent = `${topItems[0].qty_terjual} Pcs Terjual`;
  } else {
    if (topItemEl) topItemEl.textContent = '-';
    if (topItemQtyEl) topItemQtyEl.textContent = '0 Pcs Terjual';
  }

  const subRevEl = document.getElementById('kpiSubRetail');
  if (subRevEl) {
    subRevEl.textContent = `Retail: ${formatRupiah(kpi.revenue_retail)} | Bundling: ${kpi.qty_bonus_spk} Pcs`;
  }
}

/**
 * Render Top Selling Items Grid (6 items)
 */
function renderTopItems(items) {
  const container = document.getElementById('topItemsContainer');
  if (!container) return;

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: span 3; text-align: center; padding: 30px; color: #94a3b8; font-size: 13px;">
        <i class="fa-solid fa-box-open" style="font-size: 28px; margin-bottom: 8px;"></i>
        <p>Belum ada data penjualan merchandise pada filter ini.</p>
      </div>
    `;
    return;
  }

  let html = '';
  items.forEach((item, index) => {
    const thumb = item.thumbnail ? `../${item.thumbnail}` : 'https://placehold.co/120x100/f8fafc/94a3b8?text=GR+Merch';
    html += `
      <div class="top-item-card">
        <div class="top-item-thumb-wrap">
          <span class="top-item-badge-rank">#${index + 1}</span>
          <img src="${thumb}" alt="${item.nama_barang}" class="top-item-thumb" onerror="this.src='https://placehold.co/120x100/f8fafc/94a3b8?text=Merch'">
        </div>
        <div class="top-item-info">
          <h4>${item.nama_barang}</h4>
          <div class="top-item-meta">
            <span><i class="fa-solid fa-barcode"></i> ${item.part_number || '-'}</span>
            <span>${item.size || 'All'}</span>
          </div>
          <div class="top-item-stats">
            <span class="top-item-qty"><i class="fa-solid fa-cubes"></i> ${item.qty_terjual} Pcs</span>
            <span class="top-item-rev">${formatRupiah(item.revenue)}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Render SPV Breakdown Bars
 */
function renderSpvBreakdown(spvs) {
  const container = document.getElementById('spvBreakdownContainer');
  if (!container) return;

  if (!spvs || spvs.length === 0) {
    container.innerHTML = '<div style="color:#94a3b8; font-size:12px; text-align:center; padding:20px;">Tidak ada data tim SPV</div>';
    return;
  }

  const maxRevenue = Math.max(...spvs.map(s => Number(s.total_revenue) || 1));

  let html = '';
  spvs.forEach(spv => {
    const rev = Number(spv.total_revenue) || 0;
    const pct = Math.max(8, Math.round((rev / maxRevenue) * 100));

    html += `
      <div class="spv-breakdown-row">
        <div class="spv-row-top">
          <span class="spv-row-name"><i class="fa-solid fa-user-tie" style="color:#64748b; font-size:11px;"></i> ${spv.nama_spv}</span>
          <span class="spv-row-figures"><strong>${formatRupiah(rev)}</strong> (${spv.total_qty} pcs / ${spv.total_transaksi} nota)</span>
        </div>
        <div class="spv-bar-track">
          <div class="spv-bar-fill" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Render Category Breakdown
 */
function renderCategoryBreakdown(categories) {
  const container = document.getElementById('categoryBreakdownContainer');
  if (!container) return;

  if (!categories || categories.length === 0) {
    container.innerHTML = '<div style="color:#94a3b8; font-size:12px; text-align:center; padding:20px;">Tidak ada data kategori</div>';
    return;
  }

  let html = '';
  categories.forEach(cat => {
    const icon = getCategoryIcon(cat.kategori);
    html += `
      <div class="cat-breakdown-item">
        <div class="cat-item-left">
          <div class="cat-icon-box">
            <i class="fa-solid ${icon}"></i>
          </div>
          <div>
            <div class="cat-item-name">${cat.kategori}</div>
            <div class="cat-item-sub">${cat.total_qty} pcs terjual &bull; ${cat.total_transaksi} transaksi</div>
          </div>
        </div>
        <div class="cat-item-right">
          <div class="cat-item-rev">${formatRupiah(cat.total_revenue)}</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Render Sales Consultant Leaderboard (Top 8)
 */
function renderSalesLeaderboard(sales) {
  const container = document.getElementById('salesLeaderboardContainer');
  if (!container) return;

  if (!sales || sales.length === 0) {
    container.innerHTML = '<div style="color:#94a3b8; font-size:12px; text-align:center; padding:20px;">Tidak ada data wiraniaga</div>';
    return;
  }

  let html = '';
  sales.forEach((s, idx) => {
    const rank = idx + 1;
    let rankClass = '';
    if (rank === 1) rankClass = 'sales-rank-1';
    else if (rank === 2) rankClass = 'sales-rank-2';
    else if (rank === 3) rankClass = 'sales-rank-3';

    html += `
      <div class="sales-row-item">
        <div class="sales-left-meta">
          <div class="sales-rank-badge ${rankClass}">#${rank}</div>
          <div class="sales-name-info">
            <span class="sales-name-txt">${s.nama_sales}</span>
            <span class="sales-spv-txt">SPV: ${s.nama_spv || '-'}</span>
          </div>
        </div>
        <div class="sales-right-figures">
          <div class="sales-rev-txt">${formatRupiah(s.total_revenue)}</div>
          <div class="sales-qty-txt">${s.total_qty} pcs (${s.total_transaksi} nota)</div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Populate dynamic filters (SPV and Category) if empty
 */
function populateDynamicFilters(filters) {
  if (!filters) return;

  const spvSelect = document.getElementById('filterSpv');
  if (spvSelect && spvSelect.options.length <= 1 && filters.spvs) {
    filters.spvs.forEach(spv => {
      const opt = document.createElement('option');
      opt.value = spv;
      opt.textContent = `Tim ${spv}`;
      spvSelect.appendChild(opt);
    });
  }

  const catSelect = document.getElementById('filterKategori');
  if (catSelect && catSelect.options.length <= 1 && filters.categories) {
    filters.categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  }
}

/**
 * 2. Load Paginated Transactions Data Table
 */
async function loadTransactions(page = 1) {
  currentPage = page;
  const tbody = document.getElementById('merchTableBody');
  if (tbody) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 30px; color:#94a3b8;">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size:20px; color:var(--merch-red); margin-bottom:8px;"></i>
          <p>Memuat data transaksi penjualan merchandise...</p>
        </td>
      </tr>
    `;
  }

  const periode = document.getElementById('filterPeriode')?.value || 'all';
  const spv = document.getElementById('filterSpv')?.value || 'all';
  const kategori = document.getElementById('filterKategori')?.value || 'all';
  const metode = (currentTabFilter !== 'all') ? currentTabFilter : (document.getElementById('filterMetode')?.value || 'all');
  const search = document.getElementById('merchSearchInput')?.value || '';

  const params = new URLSearchParams({
    action: 'get_transactions',
    page: page,
    limit: currentLimit,
    periode: periode,
    spv: spv,
    kategori: kategori,
    metode: metode,
    search: search
  });

  try {
    const res = await fetch(`../api/api_penjualan_merchandise.php?${params.toString()}`);
    const json = await res.json();

    if (json.status === 'success') {
      currentTransactionsData = json.data || [];
      renderTransactionsTable(currentTransactionsData);
      renderPagination(json.pagination);
    }
  } catch (err) {
    console.error('Gagal memuat tabel transaksi merchandise:', err);
    if (tbody) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align:center; padding: 25px; color:#ef4444;">
            <i class="fa-solid fa-triangle-exclamation" style="font-size:20px; margin-bottom:6px;"></i>
            <p>Gagal mengambil data dari server. Silakan muat ulang.</p>
          </td>
        </tr>
      `;
    }
  }
}

/**
 * Render Transactions Data Table
 */
function renderTransactionsTable(rows) {
  const tbody = document.getElementById('merchTableBody');
  if (!tbody) return;

  if (!rows || rows.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding: 35px; color:#94a3b8;">
          <i class="fa-solid fa-receipt" style="font-size:26px; margin-bottom:8px;"></i>
          <p>Tidak ada transaksi penjualan merchandise yang sesuai filter.</p>
        </td>
      </tr>
    `;
    return;
  }

  let html = '';
  rows.forEach((row, index) => {
    const no = (currentPage - 1) * currentLimit + (index + 1);
    const thumb = row.thumbnail ? `../${row.thumbnail}` : 'https://placehold.co/60x60/f8fafc/94a3b8?text=GR';

    // Payment badge class
    let payClass = 'pay-cash';
    let payIcon = 'fa-money-bill-wave';
    if (row.metode_pembayaran.includes('Transfer')) {
      payClass = 'pay-transfer';
      payIcon = 'fa-building-columns';
    } else if (row.metode_pembayaran.includes('Bonus') || row.metode_pembayaran.includes('Delivery') || row.metode_pembayaran.includes('Voucher')) {
      payClass = 'pay-bonus';
      payIcon = 'fa-gift';
    }

    // Status badge class
    let statusClass = 'badge-status-done';
    let statusIcon = 'fa-check';
    if (row.status !== 'Selesai') {
      statusClass = 'badge-status-process';
      statusIcon = 'fa-clock';
    }

    const tglFormatted = formatDateIndo(row.tanggal_transaksi);

    html += `
      <tr>
        <td>
          <span style="font-weight:700; color:#64748b; font-size:12px;">#${no}</span><br>
          <span class="badge-trans-code">${row.nomor_transaksi}</span>
        </td>
        <td>
          <div style="font-weight:600; font-size:12.5px;">${tglFormatted}</div>
        </td>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${thumb}" alt="${row.nama_barang}" class="item-thumb-sm" onerror="this.src='https://placehold.co/60x60/f8fafc/94a3b8?text=GR'">
            <div>
              <div style="font-weight:700; font-size:13px; color:var(--merch-text-main);">${row.nama_barang}</div>
              <div style="font-size:11px; color:#64748b;">
                <span style="background:#f1f5f9; padding:1px 5px; border-radius:3px;">${row.kategori}</span>
                <span>&bull; Size: <strong>${row.size || '-'}</strong></span>
                <span>&bull; PN: ${row.part_number || '-'}</span>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div style="font-weight:800; font-size:13.5px; color:var(--merch-red);">${formatRupiah(row.total_harga)}</div>
          <div style="font-size:11px; color:#64748b;">${row.qty} Pcs &times; ${formatRupiah(row.harga_satuan)}</div>
        </td>
        <td>
          <div style="font-weight:700; font-size:12.5px;">${row.nama_customer}</div>
          <div style="font-size:11px; color:#64748b;">
            ${row.spk_no ? `<span style="color:#0284c7; font-weight:700;"><i class="fa-solid fa-file-invoice"></i> SPK: ${row.spk_no}</span>` : '<span><i class="fa-solid fa-store"></i> Direct Retail</span>'}
          </div>
        </td>
        <td>
          <div style="font-weight:700; font-size:12.5px;">${row.nama_sales}</div>
          <div style="font-size:11px; color:#64748b;">Tim SPV: <strong>${row.nama_spv}</strong></div>
        </td>
        <td>
          <div style="margin-bottom:4px;">
            <span class="badge-pay ${payClass}"><i class="fa-solid ${payIcon}"></i> ${row.metode_pembayaran}</span>
          </div>
          <div>
            <span class="${statusClass}"><i class="fa-solid ${statusIcon}"></i> ${row.status}</span>
          </div>
        </td>
        <td>
          <div style="display:flex; gap:6px;">
            <button type="button" class="merch-btn-action" style="padding:6px 10px; font-size:11.5px;" onclick="viewTransactionDetail(${row.id})" title="Lihat Detail Transaksi">
              <i class="fa-solid fa-eye"></i> Detail
            </button>
            <button type="button" class="merch-btn-action" style="padding:6px 8px; font-size:11.5px; color:#ef4444;" onclick="deleteTransaction(${row.id}, '${row.nomor_transaksi}')" title="Hapus">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

/**
 * Render Pagination
 */
function renderPagination(pagination) {
  if (!pagination) return;
  totalPages = pagination.total_pages || 1;
  currentPage = pagination.page || 1;

  const infoEl = document.getElementById('paginationInfo');
  if (infoEl) {
    const start = (currentPage - 1) * pagination.limit + 1;
    const end = Math.min(currentPage * pagination.limit, pagination.total);
    infoEl.textContent = `Menampilkan ${pagination.total > 0 ? start : 0} - ${end} dari total ${pagination.total} transaksi`;
  }

  const prevBtn = document.getElementById('btnPrevPage');
  if (prevBtn) prevBtn.disabled = (currentPage <= 1);

  const nextBtn = document.getElementById('btnNextPage');
  if (nextBtn) nextBtn.disabled = (currentPage >= totalPages);

  const curPageEl = document.getElementById('currentPageNumber');
  if (curPageEl) curPageEl.textContent = `Halaman ${currentPage} / ${totalPages}`;
}

/**
 * 3. Load Dropdown Cache for Input Modal
 */
async function loadDropdownData() {
  try {
    const res = await fetch('../api/api_penjualan_merchandise.php?action=get_dropdowns');
    const json = await res.json();
    if (json.status === 'success') {
      merchandiseItemsCache = json.merchandise || [];
      salesListCache = json.sales || [];
      populateInputModalDropdowns();
    }
  } catch (e) {
    console.error('Gagal memuat dropdowns merchandise:', e);
  }
}

function populateInputModalDropdowns() {
  const merchSelect = document.getElementById('modalMerchItem');
  if (merchSelect && merchandiseItemsCache.length > 0) {
    merchSelect.innerHTML = '<option value="">-- Pilih Produk Merchandise Official --</option>';
    merchandiseItemsCache.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.name} (${m.size || 'All Size'}) - ${formatRupiah(m.retail_price_num)}`;
      opt.dataset.price = m.retail_price_num;
      opt.dataset.pn = m.part_number || '';
      opt.dataset.size = m.size || 'All Size';
      opt.dataset.name = m.name;
      opt.dataset.image = m.image || '';
      merchSelect.appendChild(opt);
    });
  }

  const salesSelect = document.getElementById('modalSales');
  if (salesSelect && salesListCache.length > 0) {
    salesSelect.innerHTML = '<option value="">-- Pilih Wiraniaga Sales Consultant --</option>';
    salesListCache.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.nama_sales;
      opt.textContent = `${s.nama_sales} (SPV: ${s.nama_spv})`;
      opt.dataset.spv = s.nama_spv;
      salesSelect.appendChild(opt);
    });
  }
}

/**
 * Handle Merchandise selection change in modal
 */
function handleModalMerchChange() {
  const select = document.getElementById('modalMerchItem');
  const selectedOpt = select?.options[select.selectedIndex];
  if (!selectedOpt || !selectedOpt.value) return;

  const price = Number(selectedOpt.dataset.price) || 0;
  const pn = selectedOpt.dataset.pn || '';
  const size = selectedOpt.dataset.size || 'All Size';
  const imgPath = selectedOpt.dataset.image || '';

  const priceInput = document.getElementById('modalHargaSatuan');
  if (priceInput) priceInput.value = price;

  const pnInput = document.getElementById('modalPartNumber');
  if (pnInput) pnInput.value = pn;

  const sizeInput = document.getElementById('modalSize');
  if (sizeInput) sizeInput.value = size;

  const thumbImg = document.getElementById('modalItemThumb');
  if (thumbImg) {
    thumbImg.src = imgPath ? `../${imgPath}` : 'https://placehold.co/100x100/f8fafc/94a3b8?text=Merch';
    thumbImg.style.display = 'block';
  }

  calculateModalTotal();
}

/**
 * Handle Sales selection change in modal
 */
function handleModalSalesChange() {
  const select = document.getElementById('modalSales');
  const selectedOpt = select?.options[select.selectedIndex];
  if (!selectedOpt || !selectedOpt.value) return;

  const spv = selectedOpt.dataset.spv || '';
  const spvInput = document.getElementById('modalSpv');
  if (spvInput) spvInput.value = spv;
}

/**
 * Calculate total price in modal
 */
function calculateModalTotal() {
  const price = Number(document.getElementById('modalHargaSatuan')?.value) || 0;
  const qty = Number(document.getElementById('modalQty')?.value) || 1;
  const total = price * qty;

  const totalInput = document.getElementById('modalTotalHarga');
  if (totalInput) totalInput.value = total;

  const totalDisplay = document.getElementById('modalTotalDisplay');
  if (totalDisplay) totalDisplay.textContent = formatRupiah(total);
}

/**
 * 4. Modal Open / Close
 */
function openInputModal() {
  const modal = document.getElementById('inputMerchModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    const tglInput = document.getElementById('modalTanggal');
    if (tglInput && !tglInput.value) {
      tglInput.value = new Date().toISOString().split('T')[0];
    }
  }
}

function closeInputModal() {
  const modal = document.getElementById('inputMerchModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * Submit New Transaction
 */
async function submitMerchandiseSale(e) {
  if (e) e.preventDefault();

  const merchSelect = document.getElementById('modalMerchItem');
  const selectedMerchOpt = merchSelect?.options[merchSelect.selectedIndex];
  if (!selectedMerchOpt || !selectedMerchOpt.value) {
    alert('Silakan pilih produk merchandise yang dijual!');
    return;
  }

  const salesSelect = document.getElementById('modalSales');
  const selectedSalesOpt = salesSelect?.options[salesSelect.selectedIndex];
  if (!selectedSalesOpt || !selectedSalesOpt.value) {
    alert('Silakan pilih wiraniaga sales consultant!');
    return;
  }

  const payload = {
    action: 'add_transaction',
    tanggal_transaksi: document.getElementById('modalTanggal')?.value || new Date().toISOString().split('T')[0],
    merchandise_id: Number(selectedMerchOpt.value),
    nama_barang: selectedMerchOpt.dataset.name,
    part_number: document.getElementById('modalPartNumber')?.value || selectedMerchOpt.dataset.pn,
    size: document.getElementById('modalSize')?.value || selectedMerchOpt.dataset.size,
    harga_satuan: Number(document.getElementById('modalHargaSatuan')?.value) || 0,
    qty: Number(document.getElementById('modalQty')?.value) || 1,
    total_harga: Number(document.getElementById('modalTotalHarga')?.value) || 0,
    nama_sales: selectedSalesOpt.value,
    nama_spv: document.getElementById('modalSpv')?.value || selectedSalesOpt.dataset.spv,
    nama_customer: document.getElementById('modalCustomerName')?.value || 'Pelanggan Showroom',
    customer_phone: document.getElementById('modalCustomerPhone')?.value || '',
    spk_no: document.getElementById('modalSpkNo')?.value || '',
    metode_pembayaran: document.getElementById('modalMetode')?.value || 'Cash / Tunai',
    status: document.getElementById('modalStatus')?.value || 'Selesai',
    keterangan: document.getElementById('modalKeterangan')?.value || ''
  };

  const btnSubmit = document.getElementById('btnSubmitMerch');
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
  }

  try {
    const res = await fetch('../api/api_penjualan_merchandise.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();

    if (json.status === 'success') {
      closeInputModal();
      alert(`Transaksi berhasil dicatat dengan Nomor: ${json.nomor_transaksi}`);
      loadOverview();
      loadTransactions(1);
      // Reset form
      document.getElementById('formInputMerch')?.reset();
    } else {
      alert(`Gagal mencatat transaksi: ${json.message}`);
    }
  } catch (err) {
    console.error('Error saat menyimpan transaksi:', err);
    alert('Terjadi kesalahan jaringan saat menyimpan data transaksi.');
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Simpan Transaksi';
    }
  }
}

/**
 * 5. Detail Modal
 */
function viewTransactionDetail(id) {
  const row = currentTransactionsData.find(r => Number(r.id) === Number(id));
  if (!row) return;

  const modal = document.getElementById('detailMerchModal');
  const content = document.getElementById('detailModalContent');
  if (!modal || !content) return;

  const thumb = row.thumbnail ? `../${row.thumbnail}` : 'https://placehold.co/120x120/f8fafc/94a3b8?text=GR';

  content.innerHTML = `
    <div style="display:flex; gap:18px; align-items:flex-start; margin-bottom:20px; padding-bottom:18px; border-bottom:1px solid #e2e8f0;">
      <img src="${thumb}" alt="${row.nama_barang}" style="width:90px; height:90px; object-fit:contain; border-radius:10px; background:#f8fafc; border:1px solid #e2e8f0; padding:4px;">
      <div>
        <span class="badge-trans-code" style="font-size:12px; margin-bottom:6px;">${row.nomor_transaksi}</span>
        <h3 style="margin:4px 0 6px; font-size:17px; font-weight:800; color:#0f172a;">${row.nama_barang}</h3>
        <p style="margin:0; font-size:12.5px; color:#64748b;">
          Kategori: <strong>${row.kategori}</strong> &bull; Ukuran: <strong>${row.size || '-'}</strong> &bull; Part Number: <strong>${row.part_number || '-'}</strong>
        </p>
      </div>
    </div>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:14px; margin-bottom:18px; font-size:13px;">
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Data Pembeli / SPK</span>
        <div style="font-weight:700; font-size:14px; margin-top:4px; color:#0f172a;">${row.nama_customer}</div>
        <div style="color:#64748b; font-size:12px;"><i class="fa-solid fa-phone" style="font-size:11px;"></i> ${row.customer_phone || '-'}</div>
        <div style="margin-top:6px; color:#0284c7; font-weight:700;">
          ${row.spk_no ? `<i class="fa-solid fa-file-invoice"></i> No SPK: ${row.spk_no}` : '<i class="fa-solid fa-store"></i> Pembelian Retail Showroom'}
        </div>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
        <span style="font-size:11px; font-weight:700; color:#64748b; text-transform:uppercase;">Wiraniaga & Tim SPV</span>
        <div style="font-weight:700; font-size:14px; margin-top:4px; color:#0f172a;">${row.nama_sales}</div>
        <div style="color:#64748b; font-size:12px;">Supervisor: <strong>${row.nama_spv}</strong></div>
        <div style="margin-top:6px; color:#64748b; font-size:11.5px;">Tanggal: ${formatDateIndo(row.tanggal_transaksi)}</div>
      </div>
    </div>

    <div style="background:#fdf2f4; border:1px solid #fecdd3; border-radius:8px; padding:14px; display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
      <div>
        <div style="font-size:12px; color:#991b1b; font-weight:700;">Rincian Harga & Jumlah</div>
        <div style="font-size:13px; color:#475569;">${row.qty} Pcs &times; ${formatRupiah(row.harga_satuan)} (${row.metode_pembayaran})</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:11px; color:#991b1b; font-weight:700;">TOTAL TAGIHAN</div>
        <div style="font-size:20px; font-weight:900; color:var(--merch-red);">${formatRupiah(row.total_harga)}</div>
      </div>
    </div>

    ${row.keterangan ? `
      <div style="font-size:12.5px; color:#475569; background:#f1f5f9; padding:10px 14px; border-radius:8px;">
        <strong>Catatan / Keterangan:</strong> ${row.keterangan}
      </div>
    ` : ''}
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeDetailModal() {
  const modal = document.getElementById('detailMerchModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/**
 * 6. Delete Transaction
 */
async function deleteTransaction(id, nota) {
  if (!confirm(`Apakah Anda yakin ingin menghapus transaksi "${nota}"? Data yang dihapus tidak dapat dipulihkan.`)) {
    return;
  }

  try {
    const res = await fetch('../api/api_penjualan_merchandise.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_transaction', id: id })
    });
    const json = await res.json();
    if (json.status === 'success') {
      alert('Transaksi penjualan merchandise berhasil dihapus.');
      loadOverview();
      loadTransactions(currentPage);
    } else {
      alert(`Gagal menghapus transaksi: ${json.message}`);
    }
  } catch (e) {
    console.error('Error saat menghapus data:', e);
    alert('Terjadi kesalahan koneksi saat menghapus transaksi.');
  }
}

/**
 * 7. Export Current Filtered Table to CSV
 */
function exportToCsv() {
  if (!currentTransactionsData || currentTransactionsData.length === 0) {
    alert('Tidak ada data transaksi untuk diexport!');
    return;
  }

  const headers = ['No Transaksi', 'Tanggal', 'Nama Barang', 'Kategori', 'Part Number', 'Size', 'Harga Satuan', 'Qty', 'Total Harga', 'Nama Customer', 'No SPK', 'Wiraniaga', 'SPV', 'Metode Bayar', 'Status'];
  const rows = currentTransactionsData.map(r => [
    `"${r.nomor_transaksi}"`,
    `"${r.tanggal_transaksi}"`,
    `"${(r.nama_barang || '').replace(/"/g, '""')}"`,
    `"${r.kategori || ''}"`,
    `"${r.part_number || ''}"`,
    `"${r.size || ''}"`,
    r.harga_satuan,
    r.qty,
    r.total_harga,
    `"${(r.nama_customer || '').replace(/"/g, '""')}"`,
    `"${r.spk_no || ''}"`,
    `"${r.nama_sales || ''}"`,
    `"${r.nama_spv || ''}"`,
    `"${r.metode_pembayaran || ''}"`,
    `"${r.status || ''}"`
  ]);

  let csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + headers.join(',') + '\n';
  rows.forEach(row => { csvContent += row.join(',') + '\n'; });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `penjualan_merchandise_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function formatDateIndo(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${parts[2]} ${bulan[parseInt(parts[1], 10) - 1]} ${parts[0]}`;
}
