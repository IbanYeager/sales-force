/**
 * ao_report.js
 * Controller and Renderer for Area Operation (AO) Report Excel Spreadsheet System
 * Tunas Toyota Kiaracondong
 */

(function(window, document) {
    'use strict';

    let currentRole = 'sales';
    const SHEET_IDS = ['aoReport0', 'actionPlan', 'byMdl', 'ringkasan'];
    let currentSheetIndex = 0;

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
        renderClosingEstimation(data);
        renderSPKPlan(data);
        renderMDPPlan(data);
        renderTable1(data);
        renderTable2(data);
        renderExecutiveSummary(data);
    }

    function renderHeader(data) {
        const dateEl = document.getElementById('aoReportDate');
        if (dateEl) {
            dateEl.textContent = 'As of ' + (data.reportDate || '01 Agustus 2026');
        }
    }

    // SECTION 1: Stock Matching with OS
    function renderStockMatching(data) {
        const s = data.stock;
        if (!s) return;

        // Pillar 1: Full Stock
        setTxt('wbFullStockTotal', s.fullStock.total);
        setTxt('wbFullStockFree', s.fullStock.free);
        setTxt('wbFullStockMatch', s.fullStock.match);

        // Pillar 2: Invoiceable Stock
        setTxt('wbInvStockTotal', s.invoiceableStock.total);
        setTxt('wbInvStockFree', s.invoiceableStock.free);
        setTxt('wbInvStockMatch', s.invoiceableStock.match);

        // Pillar 3: OS Order
        const os = s.osOrder;
        setTxt('wbOsOrderTotal', os.total);
        setTxt('wbOsGt60Match', os.gt60Days.match);
        setTxt('wbOs3060', os.d30To60Days.total);
        setTxt('wbOs3060Match', os.d30To60Days.match);
        setTxt('wbOsLt30Firmed', os.firmedOSLt30.firmed);
        setTxt('wbOsLt30PlCpi', os.firmedOSLt30.plCpi);

        // Pillar 4: Stock Matching breakdown
        const sm = s.stockMatching;
        setTxt('wbStockMatchTotal', sm.matchStock);
        setTxt('wbStockUnmatchTotal', sm.unmatchStock);
        setTxt('wbStockMatchFirmedGt30', sm.matchBreakdown.firmedGt30);
        setTxt('wbStockMatchPlCpi', sm.matchBreakdown.plCpi);
        setTxt('wbStockUnmatchFirmedGt30', sm.unmatchBreakdown.firmedGt30);
        setTxt('wbStockUnmatchFirmedLt30', sm.unmatchBreakdown.firmedLt30);
        setTxt('wbStockUnmatchUnfirmedLt30', sm.unmatchBreakdown.unfirmedLt30);

        // Pillar 5: KPI
        const k = s.kpi;
        setTxt('wbKpiMatchRatio', k.matchingRatio + '%');
        setTxt('wbKpiTargetDO', k.targetDO);
        setTxt('wbKpiPotentialDO', k.potentialDoFromOS);
        setTxt('wbKpiGapTarget', k.gapTarget);
        setTxt('wbKpiMtdActual', k.mtdActual);
    }

    // SECTION 2: Closing Estimation
    function renderClosingEstimation(data) {
        const c = data.closingEstimation;
        if (!c) return;

        setTxt('wbCloseOapTarget', c.oapTarget);
        setTxt('wbCloseMatchOS', c.matchingOutstanding);
        const matchPct = Math.round((c.matchingOutstanding / c.oapTarget) * 100);
        setTxt('wbCloseMatchOSPct', matchPct + '%');

        setTxt('wbCloseNewSPK', c.newOrderSPK);
        const spkPct = Math.round((c.newOrderSPK / c.oapTarget) * 100);
        setTxt('wbCloseNewSPKPct', spkPct + '%');

        setTxt('wbCloseTotalEst', c.totalEstClosing);
        const totalPct = Math.round((c.totalEstClosing / c.oapTarget) * 100);
        setTxt('wbCloseTotalEstPct', totalPct + '%');

        setTxt('wbCloseInvStock', c.totalInvoiceableStock);
        const eff = typeof c.efficiencySTO === 'string' ? c.efficiencySTO : (c.efficiencySTO + '%');
        setTxt('wbCloseEffSTO', eff);
    }

    // SECTION 3: SPK Plan
    function renderSPKPlan(data) {
        const p = data.spkPlan;
        if (!p) return;

        setTxt('wbEffectiveNRS', p.effectiveNRS);
        setTxt('wbForNPlus1RS', p.forNPlus1RS);

        const tbody = document.getElementById('wbSpkPlanTableBody');
        if (tbody) {
            let html = `
                <tr>
                    <td class="cell-left cell-bold">SPK Gross Plan</td>
                    <td class="cell-bold">${p.spkGrossPlan[0]}</td>
                    ${p.spkGrossPlan.slice(1).map(v => `<td>${v}</td>`).join('')}
                </tr>
                <tr class="bg-light-green">
                    <td class="cell-left cell-bold">SPK Gross actual</td>
                    <td class="cell-bold">${p.spkGrossActual[0]}</td>
                    <td>${p.spkGrossActual[1] || '-'}</td>
                    <td>${p.spkGrossActual[2] || '-'}</td>
                    <td>-</td><td>-</td><td>-</td><td>-</td>
                </tr>
                <tr>
                    <td class="cell-left cell-bold">GAP</td>
                    <td>-</td>
                    <td style="color:#16a34a; font-weight:800;">+10</td>
                    <td style="color:#16a34a; font-weight:800;">+4</td>
                    <td style="color:#dc2626; font-weight:800;">-20</td>
                    <td style="color:#dc2626; font-weight:800;">-20</td>
                    <td style="color:#dc2626; font-weight:800;">-20</td>
                    <td style="color:#dc2626; font-weight:800;">-22</td>
                </tr>
                <tr>
                    <td class="cell-left">Cancellation assum.</td>
                    <td>${p.cancellationAssum[0]}</td>
                    ${p.cancellationAssum.slice(1).map(v => `<td>${v}</td>`).join('')}
                </tr>
                <tr class="bg-light-green">
                    <td class="cell-left">Cancellation actual</td>
                    <td>${p.cancellationActual[0] || 0}</td>
                    ${p.cancellationActual.slice(1).map(v => `<td>${v !== null ? v : '-'}</td>`).join('')}
                </tr>
                <tr>
                    <td class="cell-left cell-bold">SPK Nett Plan</td>
                    <td class="cell-bold">${p.spkNettPlan[0]}</td>
                    ${p.spkNettPlan.slice(1).map(v => `<td>${v}</td>`).join('')}
                </tr>
                <tr class="bg-light-green">
                    <td class="cell-left cell-bold">SPK Nett actual</td>
                    <td class="cell-bold">${p.spkNettActual[0]}</td>
                    <td>${p.spkNettActual[1] || '-'}</td>
                    <td>${p.spkNettActual[2] || '-'}</td>
                    <td>-</td><td>-</td><td>-</td><td>-</td>
                </tr>
                <tr>
                    <td class="cell-left cell-bold">GAP</td>
                    <td>-</td>
                    <td style="color:#16a34a; font-weight:800;">+11</td>
                    <td style="color:#16a34a; font-weight:800;">+5</td>
                    <td style="color:#dc2626; font-weight:800;">-19</td>
                    <td style="color:#dc2626; font-weight:800;">-19</td>
                    <td style="color:#dc2626; font-weight:800;">-19</td>
                    <td style="color:#dc2626; font-weight:800;">-19</td>
                </tr>
            `;
            tbody.innerHTML = html;
        }

        // Stepped Visualizer (Nett SPK 5-daily staircase run-rate)
        const stepWrap = document.getElementById('wbSpkStepProgression');
        if (stepWrap) {
            const periods = ['1-5', '6-10', '11-15', '16-20', '21-25', '26-31'];
            const targetAccum = [19, 38, 57, 76, 95, 114];
            const actualValues = p.spkNettActual || p.spkGrossActual || [];
            
            let runningActual = 0;
            const steps = periods.map((period, idx) => {
                const tgt = targetAccum[idx];
                const actPeriod = actualValues[idx + 1];
                let isRecorded = actPeriod !== null && actPeriod !== undefined && !isNaN(actPeriod);
                let barClass = 'upcoming';

                if (isRecorded) {
                    runningActual += Number(actPeriod);
                    barClass = runningActual >= tgt ? 'achieved' : 'surplus';
                }

                const heightPct = Math.min(100, Math.max(22, Math.round((tgt / 114) * 100)));

                return {
                    period,
                    tgt,
                    actPeriod,
                    runningActual,
                    barClass,
                    heightPct,
                    isRecorded
                };
            });

            stepWrap.innerHTML = steps.map(s => {
                const tooltipText = s.isRecorded 
                    ? `Periode ${s.period}: Aktual +${s.actPeriod} (Kumulatif ${s.runningActual} vs Tgt ${s.tgt})` 
                    : `Periode ${s.period}: Target Kumulatif ${s.tgt} SPK`;
                return `
                    <div class="spk-step-column" title="${tooltipText}">
                        <span class="spk-step-val-badge">${s.isRecorded ? s.runningActual : s.tgt}</span>
                        <div class="spk-step-bar-wrap">
                            <div class="spk-step-bar ${s.barClass}" style="height: ${s.heightPct}%;">
                                ${s.isRecorded ? '<i class="fa-solid fa-check" style="font-size:8px;"></i>' : ''}
                            </div>
                        </div>
                        <span class="spk-step-label">${s.period}</span>
                    </div>
                `;
            }).join('');
        }
    }

    // SECTION 4: MDP Plan
    function renderMDPPlan(data) {
        const m = data.mdpPlan;
        if (!m) return;
        setTxt('wbMdpOHStock', 38);
        setTxt('wbMdpTtlSupply', 129);
        setTxt('wbFromNewOrderVal', m.fromNewOrder || 76);
    }

    // TABLE 1: by MDL (Gap from OS & Matching)
    function renderTable1(data) {
        const tbody = document.getElementById('wbTable1Body');
        if (!tbody) return;

        const models = data.table1Models || [];
        const grand = window.AOReportData.calculateTable1Totals(models);

        let rows = models.map((m, idx) => `
            <tr>
                <td class="cell-center" style="color:#64748b;">${idx + 1}</td>
                <td class="cell-left cell-bold">${m.model}</td>
                <td class="cell-right cell-bold">${m.gapOS || 0}</td>
                <td class="cell-center">${m.w1 || ''}</td>
                <td class="cell-center">${m.w2 || ''}</td>
                <td class="cell-center">${m.w3 || ''}</td>
                <td class="cell-center">${m.w4 || ''}</td>
                <td class="cell-right cell-bold bg-yellow">${m.totalMatch || ''}</td>
                <td class="cell-right bg-netfts">${m.firmed || ''}</td>
                <td class="cell-right">${m.pLoan || ''}</td>
                <td class="cell-right" style="${m.unmatch > 0 ? 'background:#fee2e2; color:#dc2626; font-weight:800;' : ''}">${m.unmatch || ''}</td>
            </tr>
        `).join('');

        rows += `
            <tr class="bg-grand-total">
                <td class="cell-center">-</td>
                <td class="cell-left">GRAND TOTAL</td>
                <td class="cell-right">${grand.gapOS}</td>
                <td class="cell-center">${grand.w1}</td>
                <td class="cell-center">${grand.w2}</td>
                <td class="cell-center">${grand.w3}</td>
                <td class="cell-center">${grand.w4}</td>
                <td class="cell-right bg-yellow">${grand.totalMatch}</td>
                <td class="cell-right bg-netfts">${grand.firmed}</td>
                <td class="cell-right">${grand.pLoan}</td>
                <td class="cell-right">${grand.unmatch}</td>
            </tr>
        `;

        tbody.innerHTML = rows;
    }

    // TABLE 2: Action Plan (Supply, Alokasi & FTS)
    function renderTable2(data) {
        const tbody = document.getElementById('wbTable2Body');
        if (!tbody) return;

        const models = data.table2Supply || [];
        const grand = window.AOReportData.calculateTable2Totals(models);

        let rows = models.map((m, idx) => `
            <tr>
                <td class="cell-center" style="color:#64748b;">${idx + 1}</td>
                <td class="cell-left cell-bold">${m.model}</td>
                <td class="cell-right cell-bold bg-yellow">${m.stock || 0}</td>
                <td class="cell-right bg-soft-blue-light">${m.mdp || ''}</td>
                <td class="cell-right">${m.secondAllo || ''}</td>
                <td class="cell-right">${m.co || ''}</td>
                <td class="cell-right cell-bold bg-peach">${m.ttlSupply || m.stock || 0}</td>
                <td class="cell-right">${m.doActual || ''}</td>
                <td class="cell-right cell-bold">${m.stockMatching || ''}</td>
                <td class="cell-right cell-bold bg-peach">${m.fts !== undefined ? m.fts : (m.stock - m.stockMatching)}</td>
                <td class="cell-right">${m.spk || ''}</td>
                <td class="cell-right">${m.do || ''}</td>
                <td class="cell-right cell-bold bg-netfts">${m.netFts !== undefined ? m.netFts : (m.stock - m.stockMatching)}</td>
            </tr>
        `).join('');

        rows += `
            <tr class="bg-grand-total">
                <td class="cell-center">-</td>
                <td class="cell-left">GRAND TOTAL</td>
                <td class="cell-right bg-yellow">${grand.stock}</td>
                <td class="cell-right bg-soft-blue-light">${grand.mdp}</td>
                <td class="cell-right">${grand.secondAllo}</td>
                <td class="cell-right">${grand.co}</td>
                <td class="cell-right bg-peach">${grand.ttlSupply}</td>
                <td class="cell-right">${grand.doActual}</td>
                <td class="cell-right">${grand.stockMatching}</td>
                <td class="cell-right bg-peach">${grand.fts}</td>
                <td class="cell-right">${grand.spk}</td>
                <td class="cell-right">${grand.do}</td>
                <td class="cell-right bg-netfts">${grand.netFts}</td>
            </tr>
        `;

        tbody.innerHTML = rows;
    }

    // SECTION 5: Executive Summary
    function renderExecutiveSummary(data) {
        setTxt('sumFullStock', data.stock?.fullStock?.total || 123);
        setTxt('sumFreeStock', data.stock?.fullStock?.free || 81);
        setTxt('sumMatchStock', data.stock?.fullStock?.match || 42);
        setTxt('sumOsOrder', data.stock?.osOrder?.total || 53);
        setTxt('sumMatchRatio', (data.stock?.kpi?.matchingRatio || 79) + '%');
        setTxt('sumOapTarget', data.closingEstimation?.oapTarget || 92);
        setTxt('sumEstClosing', data.closingEstimation?.totalEstClosing || 92);
        setTxt('sumStoEff', data.closingEstimation?.efficiencySTO || '69%');
    }

    function setTxt(id, val) {
        const el = document.getElementById(id);
        if (el && val !== undefined && val !== null) {
            el.textContent = val;
        }
    }

    // Sheet switching mechanism
    function switchAoSheet(sheetId) {
        const targetIndex = SHEET_IDS.indexOf(sheetId);
        if (targetIndex !== -1) currentSheetIndex = targetIndex;

        document.querySelectorAll('.ao-sheet-pane').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.excel-tab-item').forEach(t => t.classList.remove('active'));

        const targetSheet = document.getElementById('sheet_' + sheetId);
        if (targetSheet) targetSheet.classList.add('active');

        const targetTab = document.getElementById('tabBtn_' + sheetId);
        if (targetTab) targetTab.classList.add('active');
    }

    function switchAoTabStep(step) {
        let nextIndex = currentSheetIndex + step;
        if (nextIndex < 0) nextIndex = SHEET_IDS.length - 1;
        if (nextIndex >= SHEET_IDS.length) nextIndex = 0;
        switchAoSheet(SHEET_IDS[nextIndex]);
    }

    function bindEvents() {
        const btnWA = document.getElementById('btnAoSendWA');
        if (btnWA) {
            btnWA.addEventListener('click', () => {
                const text = window.AOReportData.generateWAContent();
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
            });
        }

        const btnProjector = document.getElementById('btnAoProjector');
        if (btnProjector) {
            btnProjector.addEventListener('click', toggleProjectorMode);
        }
    }

    function toggleProjectorMode() {
        const wb = document.getElementById('aoExcelWorkbook');
        const btn = document.getElementById('btnAoProjector');
        if (!wb) return;

        const isCurrentlyFull = wb.classList.contains('ao-fullscreen-active');
        const willBeFull = !isCurrentlyFull;

        wb.classList.toggle('ao-fullscreen-active', willBeFull);
        document.body.classList.toggle('ao-projector-active', willBeFull);
        document.documentElement.classList.toggle('ao-projector-active', willBeFull);

        if (willBeFull) {
            try {
                if (wb.requestFullscreen) {
                    wb.requestFullscreen().catch(() => {});
                } else if (wb.webkitRequestFullscreen) {
                    wb.webkitRequestFullscreen();
                }
            } catch (e) {}
        } else {
            try {
                if (document.fullscreenElement || document.webkitFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }
            } catch (e) {}
        }

        if (btn) {
            btn.innerHTML = willBeFull 
                ? '<i class="fa-solid fa-compress"></i> Keluar Layar Penuh (ESC)'
                : '<i class="fa-solid fa-expand"></i> Mode Proyektor TV';
            btn.classList.toggle('active', willBeFull);
        }
    }

    // Handle escape or external exit from native fullscreen
    document.addEventListener('fullscreenchange', function() {
        const wb = document.getElementById('aoExcelWorkbook');
        const btn = document.getElementById('btnAoProjector');
        if (!wb) return;
        if (!document.fullscreenElement && wb.classList.contains('ao-fullscreen-active')) {
            wb.classList.remove('ao-fullscreen-active');
            document.body.classList.remove('ao-projector-active');
            document.documentElement.classList.remove('ao-projector-active');
            if (btn) {
                btn.innerHTML = '<i class="fa-solid fa-expand"></i> Mode Proyektor TV';
                btn.classList.remove('active');
            }
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const wb = document.getElementById('aoExcelWorkbook');
            if (wb && wb.classList.contains('ao-fullscreen-active')) {
                toggleProjectorMode();
            }
        }
    });

    // EXCEL IMPORT MODAL LOGIC
    let selectedAoFile = null;

    function openAoImportModal() {
        const modal = document.getElementById('modalAoImport');
        if (modal) {
            modal.style.display = 'flex';
            resetAoImportForm();
        }
    }

    function closeAoImportModal() {
        const modal = document.getElementById('modalAoImport');
        if (modal) modal.style.display = 'none';
        resetAoImportForm();
    }

    function resetAoImportForm() {
        selectedAoFile = null;
        const fileInput = document.getElementById('inputAoFile');
        if (fileInput) fileInput.value = '';
        const info = document.getElementById('aoSelectedFileInfo');
        if (info) info.style.display = 'none';
        const progress = document.getElementById('aoUploadProgress');
        if (progress) progress.style.display = 'none';
        const btn = document.getElementById('btnSubmitAoImport');
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-upload"></i> Proses &amp; Terapkan';
        }
    }

    function handleAoFileSelected(files) {
        if (!files || !files.length) return;
        const file = files[0];
        if (!file.name.toLowerCase().endsWith('.xlsx')) {
            alert('Harap pilih file Excel berformat .xlsx');
            return;
        }
        selectedAoFile = file;
        const nameEl = document.getElementById('aoSelectedFileName');
        if (nameEl) nameEl.textContent = file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
        const info = document.getElementById('aoSelectedFileInfo');
        if (info) info.style.display = 'flex';
    }

    async function submitAoImport(role = 'spv') {
        if (!selectedAoFile) {
            alert('Silakan pilih file Excel (.xlsx) terlebih dahulu!');
            return;
        }

        const btn = document.getElementById('btnSubmitAoImport');
        const progress = document.getElementById('aoUploadProgress');
        const bar = document.getElementById('aoProgressBar');
        const percent = document.getElementById('aoProgressPercent');
        const text = document.getElementById('aoProgressText');

        if (btn) btn.disabled = true;
        if (progress) progress.style.display = 'block';
        if (bar) bar.style.width = '30%';
        if (percent) percent.textContent = '30%';
        if (text) text.textContent = 'Mengunggah file ke server...';

        const formData = new FormData();
        formData.append('file', selectedAoFile);
        formData.append('role', role);

        try {
            if (bar) bar.style.width = '60%';
            if (percent) percent.textContent = '60%';
            if (text) text.textContent = 'Memproses & mengurai sheet AO Report...';

            const res = await fetch('../api/api_ao_report_import.php', {
                method: 'POST',
                body: formData
            });

            const result = await res.json();

            if (res.ok && result.status === 'success') {
                if (bar) bar.style.width = '100%';
                if (percent) percent.textContent = '100%';
                if (text) text.textContent = 'Selesai!';

                setTimeout(async () => {
                    closeAoImportModal();
                    if (window.showCustomAlert) {
                        window.showCustomAlert('Berhasil Impor AO Report', result.message, 'success');
                    } else {
                        alert(result.message);
                    }
                    await renderAllAOComponents(true);
                }, 400);
            } else {
                throw new Error(result.message || 'Gagal mengimpor file.');
            }
        } catch (err) {
            console.error('AO Import error:', err);
            alert('Gagal mengimpor file AO Report: ' + err.message);
            if (btn) btn.disabled = false;
            if (progress) progress.style.display = 'none';
        }
    }

    window.initAOReport = initAOReport;
    window.renderAllAOComponents = renderAllAOComponents;
    window.switchAoSheet = switchAoSheet;
    window.switchAoTabStep = switchAoTabStep;
    window.openAoImportModal = openAoImportModal;
    window.closeAoImportModal = closeAoImportModal;
    window.handleAoFileSelected = handleAoFileSelected;
    window.submitAoImport = submitAoImport;
    window.toggleProjectorMode = toggleProjectorMode;

})(window, document);
