/**
 * ==========================================================================
 * STATISTIK PENJUALAN KIARA CONDONG - JAVASCRIPT LOGIC
 * ==========================================================================
 */

let salesRawData = [];
let salesSummary = {};
let filtersInitialized = false;

let chartMonthlyInstance = null;
let chartModelInstance = null;
let chartLeasingInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadSalesData();
});

/**
 * Fetch Sales Data from Backend API
 */
async function loadSalesData() {
    const year = document.getElementById('filterYear')?.value || 'all';
    const month = document.getElementById('filterMonth')?.value || 'all';
    const model = document.getElementById('filterModel')?.value || 'all';
    const leasing = document.getElementById('filterLeasing')?.value || 'all';
    const search = document.getElementById('filterSearch')?.value || '';

    const params = new URLSearchParams({
        year: year,
        month: month,
        model: model,
        leasing: leasing,
        search: search
    });

    const tbody = document.getElementById('tableBody');
    if (tbody && salesRawData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                    <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data penjualan Kiara Condong...
                </td>
            </tr>
        `;
    }

    try {
        const response = await fetch(`../api/api_penjualan_kircon.php?${params.toString()}`);
        const result = await response.json();

        if (result.status === 'success') {
            salesRawData = result.data || [];
            salesSummary = result.summary || {};

            if (!filtersInitialized && result.filters) {
                populateFilterDropdowns(result.filters);
                filtersInitialized = true;
            }

            updateKpiCards(salesSummary);
            renderCharts(salesSummary);
            renderTable(salesRawData);

            const countBadge = document.getElementById('filteredCountBadge');
            if (countBadge) {
                countBadge.textContent = `${salesRawData.length} Data Ditampilkan`;
            }
        } else {
            showErrorState(result.message || 'Gagal memuat data penjualan.');
        }
    } catch (err) {
        console.error('API Error:', err);
        showErrorState('Terjadi kesalahan saat mengunduh data dari server.');
    }
}

/**
 * Populate dynamic filters (Year, Model, Leasing)
 */
function populateFilterDropdowns(filters) {
    const yearSelect = document.getElementById('filterYear');
    if (yearSelect && filters.years && filters.years.length > 0) {
        yearSelect.innerHTML = '<option value="all">Semua Tahun</option>';
        filters.years.forEach(y => {
            if (y > 0) {
                const opt = document.createElement('option');
                opt.value = y;
                opt.textContent = y;
                yearSelect.appendChild(opt);
            }
        });
    }

    const modelSelect = document.getElementById('filterModel');
    if (modelSelect && filters.models && filters.models.length > 0) {
        modelSelect.innerHTML = '<option value="all">Semua Model</option>';
        filters.models.forEach(m => {
            if (m) {
                const opt = document.createElement('option');
                opt.value = m;
                opt.textContent = m;
                modelSelect.appendChild(opt);
            }
        });
    }

    const leasingSelect = document.getElementById('filterLeasing');
    if (leasingSelect && filters.leasings && filters.leasings.length > 0) {
        leasingSelect.innerHTML = '<option value="all">Semua Leasing</option>';
        filters.leasings.forEach(l => {
            if (l && l !== '0') {
                const opt = document.createElement('option');
                opt.value = l;
                opt.textContent = l;
                leasingSelect.appendChild(opt);
            }
        });
    }
}

/**
 * Trigger re-fetch when user changes filters
 */
let searchDebounceTimer = null;
function onFilterChange() {
    clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
        loadSalesData();
    }, 250);
}

/**
 * Reset all filter inputs
 */
function resetFilters() {
    document.getElementById('filterYear').value = 'all';
    document.getElementById('filterMonth').value = 'all';
    document.getElementById('filterModel').value = 'all';
    document.getElementById('filterLeasing').value = 'all';
    document.getElementById('filterSearch').value = '';
    loadSalesData();
}

/**
 * Update KPI Summary Cards
 */
function updateKpiCards(summary) {
    document.getElementById('kpiTotalUnits').textContent = (summary.total_units || 0).toLocaleString('id-ID');
    document.getElementById('kpiTotalTransDetail').textContent = `${(summary.total_transactions || 0).toLocaleString('id-ID')} Transaksi`;

    document.getElementById('kpiTopModel').textContent = summary.top_model || '-';
    document.getElementById('kpiTopModelQty').textContent = `${(summary.top_model_qty || 0).toLocaleString('id-ID')} Unit`;

    document.getElementById('kpiTopLeasing').textContent = summary.top_leasing || '-';
    document.getElementById('kpiTopLeasingCount').textContent = `${(summary.top_leasing_count || 0).toLocaleString('id-ID')} Transaksi`;

    document.getElementById('kpiTopKota').textContent = summary.top_kota || '-';
    document.getElementById('kpiTopKotaQty').textContent = `${(summary.top_kota_qty || 0).toLocaleString('id-ID')} Unit`;
}

/**
 * Render Chart.js Visualizations
 */
function renderCharts(summary) {
    // 1. Monthly Trend Bar Chart
    const monthlyData = summary.monthly_breakdown || [];
    const monthlyLabels = monthlyData.map(m => m.month_name);
    const monthlyQty = monthlyData.map(m => m.total_qty);

    const ctxMonthly = document.getElementById('chartMonthly')?.getContext('2d');
    if (ctxMonthly) {
        if (chartMonthlyInstance) chartMonthlyInstance.destroy();
        chartMonthlyInstance = new Chart(ctxMonthly, {
            type: 'bar',
            data: {
                labels: monthlyLabels,
                datasets: [{
                    label: 'Unit Terjual',
                    data: monthlyQty,
                    backgroundColor: 'rgba(53, 101, 224, 0.85)',
                    hoverBackgroundColor: '#3565e0',
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (ctx) => ` Unit Terjual: ${ctx.raw} unit`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false } },
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(0,0,0,0.05)' },
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });
    }

    // 2. Model Breakdown Doughnut Chart
    const modelData = (summary.model_breakdown || []).slice(0, 7);
    const modelLabels = modelData.map(m => m.model);
    const modelValues = modelData.map(m => m.qty);

    const ctxModel = document.getElementById('chartModel')?.getContext('2d');
    if (ctxModel) {
        if (chartModelInstance) chartModelInstance.destroy();
        chartModelInstance = new Chart(ctxModel, {
            type: 'doughnut',
            data: {
                labels: modelLabels,
                datasets: [{
                    data: modelValues,
                    backgroundColor: [
                        '#d7123a', '#3565e0', '#10b981', '#d97706',
                        '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
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
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // 3. Leasing Breakdown Doughnut Chart
    const leasingData = (summary.leasing_breakdown || []).slice(0, 7);
    const leasingLabels = leasingData.map(l => l.leasing);
    const leasingValues = leasingData.map(l => l.count);

    const ctxLeasing = document.getElementById('chartLeasing')?.getContext('2d');
    if (ctxLeasing) {
        if (chartLeasingInstance) chartLeasingInstance.destroy();
        chartLeasingInstance = new Chart(ctxLeasing, {
            type: 'doughnut',
            data: {
                labels: leasingLabels,
                datasets: [{
                    data: leasingValues,
                    backgroundColor: [
                        '#10b981', '#3565e0', '#d97706', '#d7123a',
                        '#8b5cf6', '#06b6d4', '#f43f5e', '#475569'
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
                        labels: { boxWidth: 12, font: { size: 11 } }
                    }
                },
                cutout: '65%'
            }
        });
    }
}

/**
 * Render Transaction Table
 */
function renderTable(records) {
    const tbody = document.getElementById('tableBody');
    const tableInfo = document.getElementById('tableInfo');

    if (tableInfo) {
        tableInfo.textContent = `Menampilkan ${records.length.toLocaleString('id-ID')} transaksi`;
    }

    if (!tbody) return;

    if (records.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px 0; color: var(--text-muted);">
                    <i class="fa-solid fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Tidak ada data penjualan yang sesuai dengan filter.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = records.map((r, i) => {
        const pUpper = (r.payment || '').toUpperCase();
        let badgeClass = 'leasing';
        if (pUpper.includes('CASH')) badgeClass = 'cash';
        else if (pUpper.includes('KREDIT')) badgeClass = 'kredit';

        const leasingText = r.leasing && r.leasing !== '0' ? r.leasing : (r.payment || '-');

        return `
            <tr onclick="showDetailModal(${i})">
                <td style="font-weight: 700; color: var(--text-muted);">${i + 1}</td>
                <td>${r.sales_date || '-'}</td>
                <td style="font-family: monospace; font-weight: 700; color: var(--accent-blue);">${r.spk_no || '-'}</td>
                <td style="font-weight: 700;">${escapeHtml(r.customer || '-')}</td>
                <td>
                    <div style="font-weight: 700; color: var(--text-dark);">${escapeHtml(r.model || '-')}</div>
                    <div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(r.type || '-')}</div>
                </td>
                <td style="font-family: monospace; font-size: 11px;">${r.vin || '-'}</td>
                <td>
                    <span class="kircon-badge ${badgeClass}">${escapeHtml(leasingText)}</span>
                </td>
                <td>${escapeHtml(r.nama_salesman_idms || r.id_sales || '-')}</td>
                <td>${escapeHtml(r.nama_spv || '-')}</td>
                <td><span style="font-weight: 600;">${escapeHtml(r.kota || '-')}</span></td>
            </tr>
        `;
    }).join('');
}

/**
 * Show Transaction Detail Modal
 */
function showDetailModal(index) {
    const item = salesRawData[index];
    if (!item) return;

    const modalBody = document.getElementById('modalDetailBody');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <div class="kircon-detail-grid">
            <div class="kircon-detail-item full">
                <div class="kircon-detail-label">Nama Customer</div>
                <div class="kircon-detail-val" style="font-size: 16px; color: var(--primary-red);">${escapeHtml(item.customer || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Nomor SPK</div>
                <div class="kircon-detail-val" style="font-family: monospace;">${escapeHtml(item.spk_no || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Tanggal Sales</div>
                <div class="kircon-detail-val">${escapeHtml(item.sales_date || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Model Mobil</div>
                <div class="kircon-detail-val">${escapeHtml(item.model || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Tipe / Varian</div>
                <div class="kircon-detail-val">${escapeHtml(item.type || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Warna</div>
                <div class="kircon-detail-val">${escapeHtml(item.color_name || item.color_code || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Nomor Rangka (VIN)</div>
                <div class="kircon-detail-val" style="font-family: monospace;">${escapeHtml(item.vin || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Metode Pembayaran</div>
                <div class="kircon-detail-val">${escapeHtml(item.payment || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Perusahaan Leasing / Finance</div>
                <div class="kircon-detail-val">${escapeHtml(item.leasing || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Salesman</div>
                <div class="kircon-detail-val">${escapeHtml(item.nama_salesman_idms || item.id_sales || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Supervisor (SPV)</div>
                <div class="kircon-detail-val">${escapeHtml(item.nama_spv || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Domisili / Kota</div>
                <div class="kircon-detail-val">${escapeHtml(item.kota || item.city || '-')}</div>
            </div>

            <div class="kircon-detail-item">
                <div class="kircon-detail-label">Lead Source</div>
                <div class="kircon-detail-val">${escapeHtml(item.lead_source || '-')}</div>
            </div>

            <div class="kircon-detail-item full">
                <div class="kircon-detail-label">Outlet & Cabang</div>
                <div class="kircon-detail-val">${escapeHtml(item.outlet_name || 'Tunas Toyota Kiara Condong')} (${escapeHtml(item.dealer || 'Tunas Toyota')})</div>
            </div>
        </div>
    `;

    const overlay = document.getElementById('detailModal');
    if (overlay) overlay.classList.add('active');
}

/**
 * Close Detail Modal
 */
function closeDetailModal() {
    const overlay = document.getElementById('detailModal');
    if (overlay) overlay.classList.remove('active');
}

/**
 * Render Error State
 */
function showErrorState(msg) {
    const tbody = document.getElementById('tableBody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px 0; color: var(--primary-red);">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    ${escapeHtml(msg)}
                </td>
            </tr>
        `;
    }
}

/**
 * Utility: HTML Escaping
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
