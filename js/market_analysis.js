/**
 * ==========================================================================
 * ANALISIS PASAR KECAMATAN - JAVASCRIPT LOGIC
 * ==========================================================================
 */

let activeDistrict = 'KIARACONDONG';
let activeMode = 'composition'; // 'composition' | 'market_share'
let fullMarketData = null;

let chartSegCompInstance = null;
let chartModelShareInstance = null;
let chartMonthlyTrendInstance = null;

document.addEventListener('DOMContentLoaded', () => {
    loadMarketData();
});

/**
 * Switch Active District
 */
function selectDistrict(districtName) {
    activeDistrict = districtName;
    
    // Update pills active status
    const pillBtns = document.querySelectorAll('.district-pill-btn');
    pillBtns.forEach(btn => {
        if (btn.textContent.trim().toUpperCase().includes(districtName.toUpperCase())) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const badge = document.getElementById('txtBadgeDistrict');
    if (badge) badge.textContent = districtName;

    loadMarketData();
}

/**
 * Switch Analysis Mode (Composition vs Market Share)
 */
function switchMode(mode) {
    activeMode = mode;

    const btnComp = document.getElementById('btnModeComp');
    const btnShare = document.getElementById('btnModeShare');
    const modeDesc = document.getElementById('txtModeDesc');

    if (mode === 'composition') {
        btnComp.classList.add('active');
        btnShare.classList.remove('active');
        if (modeDesc) modeDesc.textContent = 'Menampilkan estimasi porsi/proporsi segmen & model kendaraan di kecamatan ini.';
    } else {
        btnShare.classList.add('active');
        btnComp.classList.remove('active');
        if (modeDesc) modeDesc.textContent = 'Menampilkan pangsa pasar (%) Toyota dibandingkan kompetitor di kecamatan ini.';
    }

    if (fullMarketData) {
        renderPage();
    }
}

/**
 * Fetch Market Data from API
 */
async function loadMarketData() {
    try {
        const res = await fetch(`../api/api_market_analysis.php?district=${encodeURIComponent(activeDistrict)}`);
        const json = await res.json();

        if (json.status === 'success') {
            fullMarketData = json;
            if (json.districts) populateDistrictDropdown(json.districts);
            renderPage();
        } else {
            showErrorState(json.message || 'Gagal mengunduh data analisis pasar.');
        }
    } catch (err) {
        console.error('API Error:', err);
        showErrorState('Terjadi kesalahan koneksi saat memuat data.');
    }
}

/**
 * Render KPI Cards, Charts & Table
 */
function renderPage() {
    if (!fullMarketData) return;

    const summary = fullMarketData.summary || {};
    const districtData = fullMarketData.data || {};
    const rows = districtData[activeMode] || [];
    const housing = fullMarketData.housing || null;

    // Sync dropdown selection if present
    const dropdown = document.getElementById('selectDistrictDropdown');
    if (dropdown) dropdown.value = activeDistrict;

    // 1. Update KPI Cards
    const kpiTopSegment = document.getElementById('kpiTopSegment');
    if (kpiTopSegment) kpiTopSegment.textContent = summary.top_segment || '-';
    
    const kpiTopSegmentSub = document.getElementById('kpiTopSegmentSub');
    if (kpiTopSegmentSub) kpiTopSegmentSub.innerHTML = `<i class="fa-solid fa-arrow-trend-up"></i> ${summary.top_segment_pct || 0}% Porsi Pasar YTM`;

    const kpiTopModel = document.getElementById('kpiTopModel');
    if (kpiTopModel) {
        if (activeMode === 'market_share' && summary.top_toyota_share_model !== '-') {
            kpiTopModel.textContent = summary.top_toyota_share_model;
        } else {
            kpiTopModel.textContent = summary.top_model || '-';
        }
    }

    const kpiTopModelSub = document.getElementById('kpiTopModelSub');
    if (kpiTopModelSub) {
        if (activeMode === 'market_share' && summary.top_toyota_share_model !== '-') {
            kpiTopModelSub.innerHTML = `<i class="fa-solid fa-crown"></i> ${summary.top_toyota_share_val || 0}% Market Share YTM`;
        } else {
            kpiTopModelSub.innerHTML = `<i class="fa-solid fa-crown"></i> ${summary.top_model_pct || 0}% Porsi Pasar YTM`;
        }
    }

    const kpiPcShare = document.getElementById('kpiPcShare');
    if (kpiPcShare) kpiPcShare.textContent = `${summary.pc_share_ytm || 0}%`;

    const kpiCvShare = document.getElementById('kpiCvShare');
    if (kpiCvShare) kpiCvShare.textContent = `${summary.cv_share_ytm || 0}%`;

    // 2. Render Table, Charts & Housing Mapping
    renderTable(rows);
    renderCharts(rows);
    renderHousingData(housing);
}

/**
 * Format value to Percentage string
 */
function fmtPct(val) {
    if (val === '-' || val === null || val === undefined || val === '') return '-';
    const num = parseFloat(val);
    if (isNaN(num)) return val;
    // If decimal like 0.132 convert to 13.2%
    if (num <= 1 && num >= 0 && num !== 0) {
        return (num * 100).toFixed(1) + '%';
    }
    return num.toFixed(1) + '%';
}

/**
 * Get raw percentage number (0-100) for progress bar
 */
function getRawPct(val) {
    if (val === '-' || val === null || val === undefined || val === '') return 0;
    const num = parseFloat(val);
    if (isNaN(num)) return 0;
    if (num <= 1 && num >= 0) return num * 100;
    return num;
}

/**
 * Render Data Table
 */
function renderTable(rows) {
    const tbody = document.getElementById('marketTableBody');
    const tableDesc = document.getElementById('txtTableDesc');

    if (tableDesc) {
        tableDesc.textContent = activeMode === 'composition'
            ? `Porsi segmen & model kendaraan di Kec. ${activeDistrict} (Reff. City & YTM Jan-Jun).`
            : `Market Share (%) Toyota per segmen & model di Kec. ${activeDistrict} (Reff. City & YTM Jan-Jun).`;
    }

    if (!tbody) return;

    if (!rows || rows.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" style="text-align: center; padding: 40px 0; color: var(--market-text-muted);">
                    <i class="fa-solid fa-folder-open" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Tidak ada data analisis untuk kecamatan ini.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = rows.map(r => {
        const isHeader = !r.model && (r.segment === 'PC' || r.segment === 'CV' || r.segment === 'Total Model');
        const trClass = isHeader ? 'segment-header' : '';

        const barClass = activeMode === 'market_share' ? 'share' : '';
        const rawYtm = getRawPct(r.ytm);

        return `
            <tr class="${trClass}">
                <td style="font-weight: 700; ${isHeader ? 'color: #1e3a8a; font-size: 13px;' : ''}">
                    ${escapeHtml(r.segment || '-')}
                </td>
                <td style="font-weight: 700; color: var(--market-primary);">
                    ${escapeHtml(r.model || '-')}
                </td>
                <td>${fmtPct(r.reff_city)}</td>
                <td>
                    <span style="font-weight: 800;">${fmtPct(r.ytm)}</span>
                    ${rawYtm > 0 ? `<div class="pct-bar-bg"><div class="pct-bar-fill ${barClass}" style="width: ${Math.min(rawYtm, 100)}%;"></div></div>` : ''}
                </td>
                <td>${fmtPct(r.january)}</td>
                <td>${fmtPct(r.february)}</td>
                <td>${fmtPct(r.march)}</td>
                <td>${fmtPct(r.april)}</td>
                <td>${fmtPct(r.may)}</td>
                <td>${fmtPct(r.june)}</td>
            </tr>
        `;
    }).join('');
}

/**
 * Render Chart.js Visualizations
 */
function renderCharts(rows) {
    if (typeof Chart !== 'undefined') {
        Chart.defaults.font.family = "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif";
        Chart.defaults.color = '#64748b';
    }

    // Filter model specific rows (where model is present)
    const modelRows = rows.filter(r => r.model && r.model.trim() !== '');

    // Top models sorted by YTM
    const sortedByYtm = [...modelRows].sort((a, b) => getRawPct(b.ytm) - getRawPct(a.ytm)).slice(0, 8);

    const labels = sortedByYtm.map(r => r.model);
    const ytmVals = sortedByYtm.map(r => getRawPct(r.ytm));

    const commonTooltipOptions = {
        backgroundColor: '#0f172a',
        titleFont: { family: "'Plus Jakarta Sans', sans-serif", weight: '800', size: 12 },
        bodyFont: { family: "'Plus Jakarta Sans', sans-serif", size: 12 },
        padding: 12,
        cornerRadius: 10,
        displayColors: true,
        boxPadding: 4
    };

    // 1. Chart 1: Doughnut Chart (Model Proportions / Share)
    const ctx1 = document.getElementById('chartSegComp')?.getContext('2d');
    const chartTitle1 = document.getElementById('chartTitle1');
    if (chartTitle1) {
        chartTitle1.innerHTML = activeMode === 'composition'
            ? `<span class="chart-title-badge blue"><i class="fa-solid fa-chart-pie"></i></span> Porsi Model Terbesar (YTM)`
            : `<span class="chart-title-badge red"><i class="fa-solid fa-chart-pie"></i></span> Top Market Share Toyota (YTM)`;
    }

    if (ctx1) {
        if (chartSegCompInstance) chartSegCompInstance.destroy();
        chartSegCompInstance = new Chart(ctx1, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: ytmVals,
                    backgroundColor: [
                        '#d7123a', '#3b82f6', '#10b981', '#f59e0b',
                        '#8b5cf6', '#ec4899', '#06b6d4', '#64748b'
                    ],
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
                        labels: { boxWidth: 12, padding: 14, font: { size: 11, weight: '600' }, color: '#64748b' }
                    },
                    tooltip: {
                        ...commonTooltipOptions,
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: ${ctx.raw.toFixed(1)}%`
                        }
                    }
                },
                cutout: '65%'
            }
        });
    }

    // 2. Chart 2: Horizontal Bar Chart (Model Comparison)
    const ctx2 = document.getElementById('chartModelShare')?.getContext('2d');
    const chartTitle2 = document.getElementById('chartTitle2');
    if (chartTitle2) {
        chartTitle2.innerHTML = activeMode === 'composition'
            ? `<span class="chart-title-badge blue"><i class="fa-solid fa-chart-column"></i></span> Komparasi Model (YTM vs Reff. City)`
            : `<span class="chart-title-badge red"><i class="fa-solid fa-chart-column"></i></span> Market Share Model vs Reff. City`;
    }

    if (ctx2) {
        if (chartModelShareInstance) chartModelShareInstance.destroy();

        const reffCityVals = sortedByYtm.map(r => getRawPct(r.reff_city));

        chartModelShareInstance = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'YTM (%)',
                        data: ytmVals,
                        backgroundColor: activeMode === 'composition' ? '#3b82f6' : '#d7123a',
                        borderRadius: 8
                    },
                    {
                        label: 'Reff City (%)',
                        data: reffCityVals,
                        backgroundColor: '#cbd5e1',
                        borderRadius: 8
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 12, font: { size: 11, weight: '700' }, color: '#64748b' }
                    },
                    tooltip: {
                        ...commonTooltipOptions,
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    x: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748b' } },
                    y: { grid: { display: false }, ticks: { font: { weight: '600' }, color: '#64748b' } }
                }
            }
        });
    }

    // 3. Chart 3: Monthly Trend Line Chart (Top 4 models Jan - Jun)
    const ctx3 = document.getElementById('chartMonthlyTrend')?.getContext('2d');
    if (ctx3) {
        if (chartMonthlyTrendInstance) chartMonthlyTrendInstance.destroy();

        const top4 = sortedByYtm.slice(0, 4);
        const monthsList = ['january', 'february', 'march', 'april', 'may', 'june'];
        const colors = ['#d7123a', '#3b82f6', '#10b981', '#f59e0b'];

        const datasets = top4.map((modRow, i) => {
            return {
                label: modRow.model,
                data: monthsList.map(m => getRawPct(modRow[m])),
                borderColor: colors[i % colors.length],
                backgroundColor: colors[i % colors.length],
                tension: 0.35,
                fill: false,
                pointRadius: 5,
                pointHoverRadius: 7,
                borderWidth: 3
            };
        });

        chartMonthlyTrendInstance = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 14, padding: 16, font: { size: 11.5, weight: '700' }, color: '#64748b' }
                    },
                    tooltip: {
                        ...commonTooltipOptions,
                        callbacks: {
                            label: (ctx) => ` ${ctx.dataset.label}: ${ctx.raw.toFixed(1)}%`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { font: { weight: '600' }, color: '#64748b' } },
                    y: { beginAtZero: true, grid: { color: 'rgba(226, 232, 240, 0.8)' }, ticks: { color: '#64748b' } }
                }
            }
        });
    }
}

/**
 * Render Error State
 */
function showErrorState(msg) {
    const tbody = document.getElementById('marketTableBody');
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

/**
 * Populate District Dropdown Selector
 */
function populateDistrictDropdown(districts) {
    const dropdown = document.getElementById('selectDistrictDropdown');
    if (!dropdown || !districts || districts.length === 0) return;

    if (dropdown.options.length <= 1) {
        dropdown.innerHTML = '<option value="">-- Pilih Kecamatan Bandung --</option>' +
            districts.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join('');
    }
    dropdown.value = activeDistrict;
}

/**
 * Render Housing Complexes Table & Summary
 */
function renderHousingData(housing) {
    const lblKomplek = document.getElementById('lblTotalHousingKomplek');
    const lblUnit = document.getElementById('lblTotalHousingUnit');
    const txtDesc = document.getElementById('txtHousingDesc');
    const tbody = document.getElementById('housingTableBody');

    if (housing) {
        if (lblKomplek) lblKomplek.textContent = `${(housing.total_komplek || 0).toLocaleString()} Komplek`;
        if (lblUnit) lblUnit.textContent = `${(housing.total_unit || 0).toLocaleString()} Unit Rumah`;
    }

    if (txtDesc) {
        txtDesc.textContent = `Daftar komplek perumahan dan estimasi unit rumah di Kec. ${activeDistrict} untuk target kanvasing & door-to-door sales.`;
    }

    if (!tbody) return;

    const list = housing?.komplek_list || [];
    if (list.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 40px 0; color: var(--market-text-muted);">
                    <i class="fa-solid fa-house-chimney-window" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                    Tidak ada data perumahan terdaftar untuk kecamatan ${escapeHtml(activeDistrict)}.
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = list.map((item, idx) => {
        const u = item.unit || 0;
        let badge = '<span class="potensi-badge normal"><i class="fa-solid fa-house"></i> Sedang (&lt;50 Unit)</span>';
        if (u >= 200) {
            badge = '<span class="potensi-badge high"><i class="fa-solid fa-fire"></i> Sangat Tinggi (&gt;200 Unit)</span>';
        } else if (u >= 50) {
            badge = '<span class="potensi-badge medium"><i class="fa-solid fa-star"></i> Tinggi (50-200 Unit)</span>';
        }

        return `
            <tr>
                <td style="font-weight: 700; color: var(--market-text-muted);">${idx + 1}</td>
                <td style="font-weight: 800; color: var(--market-text-main);">
                    <i class="fa-solid fa-building-user" style="color: #64748b; margin-right: 6px;"></i> ${escapeHtml(item.nama)}
                </td>
                <td style="text-align: right; font-weight: 800; color: var(--market-blue-accent);">
                    ${u.toLocaleString()} <span style="font-size: 11px; font-weight: 600; color: var(--market-text-muted);">Unit</span>
                </td>
                <td>${badge}</td>
                <td style="text-align: center;">
                    <button class="btn-canvasing-target" onclick="planCanvasing('${escapeHtml(item.nama).replace(/'/g, "\\'")}', ${u})">
                        <i class="fa-solid fa-bullseye"></i> Target Kanvasing
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

/**
 * Filter Housing Table via Search Bar
 */
function filterHousingTable() {
    const input = document.getElementById('housingSearchInput');
    if (!input) return;
    const filter = input.value.toUpperCase();
    const tbody = document.getElementById('housingTableBody');
    if (!tbody) return;
    const trs = tbody.getElementsByTagName('tr');

    for (let i = 0; i < trs.length; i++) {
        const tdName = trs[i].getElementsByTagName('td')[1];
        if (tdName) {
            const txt = tdName.textContent || tdName.innerText;
            if (txt.toUpperCase().indexOf(filter) > -1) {
                trs[i].style.display = '';
            } else {
                trs[i].style.display = 'none';
            }
        }
    }
}

/**
 * Plan Canvasing Action Trigger
 */
function planCanvasing(komplekName, unitCount) {
    if (typeof showCustomAlert === 'function') {
        showCustomAlert(`Target kanvasing ditambahkan untuk <strong>${komplekName}</strong> (Kec. ${activeDistrict}) dengan potensi ${unitCount} unit rumah!`);
    } else {
        alert(`Target kanvasing ditambahkan: ${komplekName} (${unitCount} unit)`);
    }
}
