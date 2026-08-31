/**
 * ao_report.js
 * Interactive rendering and UI controller for AO Report
 */

(function(window, document) {
    'use strict';

    let currentRole = 'sales'; // 'sales' | 'spv' | 'kacab'

    async function initAOReport(role) {
        currentRole = role || 'sales';
        renderAllAOComponentsSync();
        bindEvents();
        try {
            await renderAllAOComponents(true);
        } catch (e) {
            console.warn('Live AO load error:', e);
        }
    }

    function renderAllAOComponentsSync() {
        const data = window.AOReportData.getAOData();
        renderWithData(data);
    }

    async function renderAllAOComponents(forceFresh = false) {
        const data = await window.AOReportData.fetchAODataLive(forceFresh);
        renderWithData(data);
    }

    function renderWithData(data) {
        if (!data) return;
        renderHeader(data);
        renderStockMatching(data);
        renderSPKPlan(data);
        renderMDPPlan(data);
        renderClosingEstimation(data);
        renderModelsBreakdown(data);
    }

    function renderHeader(data) {
        const branchEl = document.getElementById('aoBranchName');
        const dateEl = document.getElementById('aoReportDate');
        if (branchEl) branchEl.textContent = data.branch;
        if (dateEl) dateEl.textContent = data.reportDate;
    }

    function renderStockMatching(data) {
        const s = data.stock;
        
        // Full Stock
        const fullStockTot = document.getElementById('aoFullStockTotal');
        const fullStockFree = document.getElementById('aoFullStockFree');
        const fullStockMatch = document.getElementById('aoFullStockMatch');
        const fullStockBarFree = document.getElementById('aoFullStockBarFree');
        const fullStockBarMatch = document.getElementById('aoFullStockBarMatch');

        if (fullStockTot) fullStockTot.textContent = s.fullStock.total;
        if (fullStockFree) fullStockFree.textContent = s.fullStock.free;
        if (fullStockMatch) fullStockMatch.textContent = s.fullStock.match;

        if (fullStockBarFree && fullStockBarMatch) {
            const freePct = Math.round((s.fullStock.free / s.fullStock.total) * 100);
            const matchPct = 100 - freePct;
            fullStockBarFree.style.width = freePct + '%';
            fullStockBarFree.textContent = `Free ${s.fullStock.free}`;
            fullStockBarMatch.style.width = matchPct + '%';
            fullStockBarMatch.textContent = `Match ${s.fullStock.match}`;
        }

        // Invoiceable Stock
        const invStockTot = document.getElementById('aoInvStockTotal');
        const invStockFree = document.getElementById('aoInvStockFree');
        const invStockMatch = document.getElementById('aoInvStockMatch');
        const invStockBarFree = document.getElementById('aoInvStockBarFree');
        const invStockBarMatch = document.getElementById('aoInvStockBarMatch');

        if (invStockTot) invStockTot.textContent = s.invoiceableStock.total;
        if (invStockFree) invStockFree.textContent = s.invoiceableStock.free;
        if (invStockMatch) invStockMatch.textContent = s.invoiceableStock.match;

        if (invStockBarFree && invStockBarMatch) {
            const freePct = Math.round((s.invoiceableStock.free / s.invoiceableStock.total) * 100);
            const matchPct = 100 - freePct;
            invStockBarFree.style.width = freePct + '%';
            invStockBarFree.textContent = `Free ${s.invoiceableStock.free}`;
            invStockBarMatch.style.width = matchPct + '%';
            invStockBarMatch.textContent = `Match ${s.invoiceableStock.match}`;
        }

        // OS Order
        const osLt30Tot = document.getElementById('aoOsLt30Total');
        const osLt30Firm = document.getElementById('aoOsLt30Firmed');
        const osLt30Match = document.getElementById('aoOsLt30Match');
        if (osLt30Tot) osLt30Tot.textContent = s.osOrder.lt30Days.total;
        if (osLt30Firm) osLt30Firm.textContent = s.osOrder.lt30Days.firmed;
        if (osLt30Match) osLt30Match.textContent = s.osOrder.lt30Days.match;

        // Stock Matching Status
        const matchRatio = document.getElementById('aoMatchingRatio');
        const potDO = document.getElementById('aoPotentialDO');
        const tgtDO = document.getElementById('aoTargetDO');
        const gapDO = document.getElementById('aoGapTargetDO');
        const mtdDO = document.getElementById('aoMtdActualDO');

        if (matchRatio) matchRatio.textContent = s.kpi.matchingRatio + '%';
        if (potDO) potDO.textContent = s.kpi.potentialDoFromOS;
        if (tgtDO) tgtDO.textContent = s.kpi.targetDO;
        if (gapDO) gapDO.textContent = s.kpi.gapFromTarget;
        if (mtdDO) mtdDO.textContent = s.kpi.mtdActual;

        // Ladder steps for stock ritmo
        const ladderWrap = document.getElementById('aoStockLadderSteps');
        if (ladderWrap && s.ritme5Harian) {
            ladderWrap.innerHTML = s.ritme5Harian.map((step, idx) => `
                <div class="ao-step-bar active-ladder-${idx + 1}" title="Ritme ${step.period}: +${step.value} (Akum: ${step.accum})">
                    <span>${step.value}</span>
                    <span style="font-size:8px; opacity:0.85;">Akum ${step.accum}</span>
                </div>
            `).join('');
        }
    }

    function renderSPKPlan(data) {
        const p = data.spkPlan;
        const tbody = document.getElementById('aoSpkTableBody');
        if (!tbody) return;

        let html = '';
        
        // Row 1: Gross Plan
        html += `<tr>
            <td style="text-align:left; font-weight:800; background:#f1f5f9;">SPK Gross Plan</td>
            <td><strong>${p.spkGrossPlan[0]}</strong></td>
            ${p.spkGrossPlan.slice(1).map(v => `<td>${v}</td>`).join('')}
        </tr>`;

        // Row 2: Gross Actual
        html += `<tr>
            <td style="text-align:left; font-weight:800; background:#f1f5f9;">SPK Gross Actual</td>
            <td><strong style="color:var(--ao-primary-red);">${p.spkGrossActual[0]}</strong></td>
            ${p.spkGrossActual.slice(1).map(v => `<td>${v !== null ? `<strong>${v}</strong>` : '-'}</td>`).join('')}
        </tr>`;

        // Row 3: Gross GAP
        html += `<tr>
            <td style="text-align:left; font-weight:800; background:#f1f5f9;">GAP</td>
            <td>-</td>
            <td class="cell-gap-pos">+10</td>
            <td class="cell-gap-pos">+4</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>`;

        // Row 4: Cancellation Assum
        html += `<tr>
            <td style="text-align:left; font-weight:800; background:#f1f5f9;">Cancellation Assum.</td>
            <td>${p.cancellationAssum[0]}</td>
            ${p.cancellationAssum.slice(1).map(v => `<td>${v}</td>`).join('')}
        </tr>`;

        // Row 5: Cancellation Actual
        html += `<tr>
            <td style="text-align:left; font-weight:800; background:#f1f5f9;">Cancellation Actual</td>
            <td>${p.cancellationActual[0]}</td>
            ${p.cancellationActual.slice(1).map(v => `<td>${v !== null ? v : '-'}</td>`).join('')}
        </tr>`;

        // Row 6: SPK Nett Actual
        html += `<tr style="background:#eef2ff;">
            <td style="text-align:left; font-weight:800; color:#3730a3;">SPK Nett Actual</td>
            <td><strong style="color:#3730a3; font-size:13px;">${p.spkNettActual[0]}</strong></td>
            <td><strong>30</strong></td>
            <td><strong>24</strong></td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
            <td>-</td>
        </tr>`;

        tbody.innerHTML = html;

        // Visual Nett SPK ladder
        const nettLadderWrap = document.getElementById('aoNettSpkLadder');
        if (nettLadderWrap && p.nettSpkVisualize) {
            nettLadderWrap.innerHTML = p.nettSpkVisualize.map((step, idx) => `
                <div class="ao-step-bar active-ladder-${idx + 1}" title="Ritme ${step.period}: Step ${step.step} (Akum: ${step.accum})">
                    <span>${step.step}</span>
                    <span style="font-size:8.5px; opacity:0.85;">${step.accum}</span>
                </div>
            `).join('');
        }
    }

    function renderMDPPlan(data) {
        const m = data.mdpPlan;
        const truckFlow = document.getElementById('aoMdpTruckFlow');
        if (truckFlow && m.ffsSellingPlan) {
            truckFlow.innerHTML = m.ffsSellingPlan.map(item => `
                <div class="ao-truck-node">
                    <i class="fa-solid fa-${item.icon} ao-truck-icon"></i>
                    <div style="font-size:10px; font-weight:700; color:#64748b;">${item.period}</div>
                    <div class="ao-truck-val">${item.value}</div>
                    <div class="ao-truck-accum">Akum: ${item.accum}</div>
                </div>
            `).join('');
        }

        const mtdDoRs = document.getElementById('aoMdpAccumMtdDoRs');
        if (mtdDoRs) mtdDoRs.textContent = m.accumMtdDoRs;
    }

    function renderClosingEstimation(data) {
        const c = data.closingEstimation;
        const doTargetEl = document.getElementById('aoCloseDoTarget');
        const matchOSEl = document.getElementById('aoCloseMatchOS');
        const newOrderEl = document.getElementById('aoCloseNewOrder');
        const totalEstEl = document.getElementById('aoCloseTotalEst');
        const gapTargetEl = document.getElementById('aoCloseGapTarget');
        const effOSEl = document.getElementById('aoCloseEffOS');

        if (doTargetEl) doTargetEl.textContent = c.doRsTarget;
        if (matchOSEl) matchOSEl.textContent = '+' + c.matchingWithOS;
        if (newOrderEl) newOrderEl.textContent = '+' + c.newOrderSPK;
        if (totalEstEl) totalEstEl.textContent = c.totalEstClosingMonth;
        if (gapTargetEl) {
            gapTargetEl.textContent = (c.gapFromTarget >= 0 ? '+' : '') + c.gapFromTarget + ' Unit';
        }
        if (effOSEl) effOSEl.textContent = c.efficiencyOS + '%';
    }

    function renderModelsBreakdown(data) {
        const tbody = document.getElementById('aoModelsTableBody');
        if (!tbody) return;

        const models = data.modelsBreakdown || [];
        const grand = window.AOReportData.calculateTotals(models);

        let rows = models.map((m, idx) => `
            <tr>
                <td class="col-model">
                    <span style="display:inline-block; width:18px; font-size:10.5px; color:#94a3b8; font-weight:700;">${idx + 1}.</span>
                    <strong>${m.model}</strong>
                </td>
                <td style="color:#d97706; font-weight:800;">${m.gapOS}</td>
                <td style="background:#fefce8; color:#854d0e;">${m.w1}</td>
                <td style="background:#fefce8; color:#854d0e;">${m.w2}</td>
                <td style="background:#fefce8; color:#854d0e;">${m.w3}</td>
                <td style="background:#fefce8; color:#854d0e;">${m.w4}</td>
                <td style="background:#fef08a; font-weight:900; color:#713f12;">${m.totalMatch}</td>
                <td style="background:#dcfce7; color:#15803d; font-weight:800;">${m.firmedPlan}</td>
                <td style="${m.unmatch > 0 ? 'background:#fee2e2; color:#991b1b; font-weight:800;' : 'color:#cbd5e1;'}">${m.unmatch}</td>
                <td style="background:#e0f2fe; color:#0369a1; font-weight:800;">${m.mdpStock}</td>
                <td>${m.adaCO1}</td>
                <td>${m.adaCO2}</td>
                <td style="background:#f1f5f9; font-size:13px; font-weight:900; color:#0f172a;">${m.estClosing}</td>
            </tr>
        `).join('');

        // Grand Total Row
        rows += `
            <tr class="row-grand-total">
                <td class="col-model">🏆 ${grand.model}</td>
                <td>${grand.gapOS}</td>
                <td>${grand.w1}</td>
                <td>${grand.w2}</td>
                <td>${grand.w3}</td>
                <td>${grand.w4}</td>
                <td>${grand.totalMatch}</td>
                <td>${grand.firmedPlan}</td>
                <td>${grand.unmatch}</td>
                <td>${grand.mdpStock}</td>
                <td>${grand.adaCO1}</td>
                <td>${grand.adaCO2}</td>
                <td>${grand.estClosing}</td>
            </tr>
        `;

        tbody.innerHTML = rows;
    }

    function bindEvents() {
        // WhatsApp button
        const btnWA = document.getElementById('btnAoSendWA');
        if (btnWA) {
            btnWA.addEventListener('click', () => {
                const text = window.AOReportData.generateWAContent(null, currentRole);
                const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            });
        }

        // Export CSV
        const btnCSV = document.getElementById('btnAoExportCSV');
        if (btnCSV) {
            btnCSV.addEventListener('click', () => {
                window.AOReportData.exportToCSV();
            });
        }
    }

    window.initAOReport = initAOReport;
    window.renderAllAOComponents = renderAllAOComponents;

})(window, document);
