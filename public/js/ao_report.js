/**
 * ao_report.js
 * Controller and Renderer for Area Operation (AO) Whiteboard Replica
 * Tunas Toyota Kiaracondong (31 Agustus 2026)
 */

(function(window, document) {
    'use strict';

    let currentRole = 'sales';

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
        renderTable1(data);
        renderTable2(data);
    }

    function renderHeader(data) {
        const dateEl = document.getElementById('aoReportDate');
        if (dateEl) dateEl.textContent = data.reportDate || '31 Agustus 2026';
    }

    // SECTION 1: Stock Matching with OS (②)
    function renderStockMatching(data) {
        const s = data.stock;
        if (!s) return;

        // Pillar 1: Full Stock
        const fsTot = document.getElementById('wbFullStockTotal');
        const fsFree = document.getElementById('wbFullStockFree');
        const fsMatch = document.getElementById('wbFullStockMatch');
        if (fsTot) fsTot.textContent = s.fullStock.total;
        if (fsFree) fsFree.textContent = s.fullStock.free;
        if (fsMatch) fsMatch.textContent = s.fullStock.match;

        // Pillar 2: Invoiceable Stock
        const isTot = document.getElementById('wbInvStockTotal');
        const isFree = document.getElementById('wbInvStockFree');
        const isMatch = document.getElementById('wbInvStockMatch');
        if (isTot) isTot.textContent = s.invoiceableStock.total;
        if (isFree) isFree.textContent = s.invoiceableStock.free;
        if (isMatch) isMatch.textContent = s.invoiceableStock.match;

        // Pillar 3: OS Order
        const osTot = document.getElementById('wbOsOrderTotal');
        if (osTot) osTot.textContent = s.osOrder.total;

        // Pillar 4: Stock Matching
        const smUnmatch = document.getElementById('wbSmUnmatchTotal');
        const smMatch = document.getElementById('wbSmMatchTotal');
        if (smUnmatch) smUnmatch.textContent = s.stockMatching.unmatchStock;
        if (smMatch) smMatch.textContent = s.stockMatching.matchStock;

        // KPI & Staircase
        const ratioEl = document.getElementById('wbMatchingRatioVal');
        const potEl = document.getElementById('wbPotentialDoVal');
        const gapTargetEl = document.getElementById('wbGapTargetVal');
        const mtdEl = document.getElementById('wbMtdActualVal');

        if (ratioEl) ratioEl.textContent = s.kpi.matchingRatio;
        if (potEl) potEl.textContent = s.kpi.potentialDoFromOS;
        if (gapTargetEl) gapTargetEl.textContent = s.kpi.gapTarget;
        if (mtdEl) mtdEl.textContent = s.kpi.mtdActual;
    }

    // SECTION 2: Matching Stock from Order / SPK Plan (⑩)
    function renderSPKPlan(data) {
        const p = data.spkPlan;
        const tbody = document.getElementById('wbSpkTableBody');
        if (!tbody || !p) return;

        let html = '';

        // Row 1: SPK Gross Plan
        html += `<tr>
            <td style="text-align:left;">SPK Gross Plan</td>
            <td><strong>${p.spkGrossPlan[0]}</strong></td>
            ${p.spkGrossPlan.slice(1).map(v => `<td>${v}</td>`).join('')}
        </tr>`;

        // Row 2: SPK Gross actual
        html += `<tr class="ao-row-green-actual">
            <td style="text-align:left;">SPK Gross actual</td>
            <td><strong>${p.spkGrossActual[0] || 54}</strong></td>
            <td><strong>30</strong></td>
            <td><strong>24</strong></td>
            <td>-</td><td>-</td><td>-</td><td>-</td>
        </tr>`;

        // Row 3: GAP
        html += `<tr>
            <td style="text-align:left;">GAP</td>
            <td>-</td>
            <td>0</td><td>1</td><td>2</td><td>3</td><td>1</td><td>1</td>
        </tr>`;

        // Row 4: Cancellation assum.
        html += `<tr>
            <td style="text-align:left;">Cancellation assum.</td>
            <td>${p.cancellationAssum[0]}</td>
            ${p.cancellationAssum.slice(1).map(v => `<td>${v}</td>`).join('')}
        </tr>`;

        // Row 5: Cancellation actual
        html += `<tr>
            <td style="text-align:left;">Cancellation actual</td>
            <td>0</td><td>0</td><td>0</td><td>-</td><td>-</td><td>-</td><td>-</td>
        </tr>`;

        // Row 6: Cancellation ratio
        html += `<tr>
            <td style="text-align:left;">Cancellation ratio</td>
            <td>0%</td><td>0%</td><td>0%</td><td>-</td><td>-</td><td>-</td><td>-</td>
        </tr>`;

        // Row 7: SPK Nett Plan
        html += `<tr class="ao-row-nett-plan">
            <td style="text-align:left;">SPK Nett Plan</td>
            <td><strong>${p.spkNettPlan[0]}</strong></td>
            ${p.spkNettPlan.slice(1).map(v => `<td>${v}</td>`).join('')}
        </tr>`;

        // Row 8: SPK Nett actual
        html += `<tr class="ao-row-green-actual">
            <td style="text-align:left;">SPK Nett actual</td>
            <td><strong>${p.spkNettActual[0] || 54}</strong></td>
            <td><strong>30</strong></td>
            <td><strong>24</strong></td>
            <td>-</td><td>-</td><td>-</td><td>-</td>
        </tr>`;

        // Row 9: GAP
        html += `<tr>
            <td style="text-align:left;">GAP</td>
            <td>-</td>
            <td>+11</td><td>+5</td><td>-19</td><td>-19</td><td>-19</td><td>-19</td>
        </tr>`;

        tbody.innerHTML = html;

        // Cancel ratio box
        const cancel3m = document.getElementById('wbCancel3mAvg');
        const loanRej = document.getElementById('wbLoanRej');
        if (cancel3m) cancel3m.textContent = p.cancelRatioStats.threeMonthsAvg;
        if (loanRej) loanRej.textContent = p.cancelRatioStats.loanRejection;

        // Become OS & Month RS pillar
        const becomeOs = document.getElementById('wbPillarBecomeOs');
        const effMonth = document.getElementById('wbPillarEffMonthRS');
        if (becomeOs) becomeOs.textContent = p.rsPillar.becomeOS;
        if (effMonth) effMonth.textContent = p.rsPillar.effectiveMonthRS;
    }

    // SECTION 3: MDP Plan
    function renderMDPPlan(data) {
        const m = data.mdpPlan;
        if (!m) return;

        const mdpTot = document.getElementById('wbMdpPillarTotal');
        const mdpGrn = document.getElementById('wbMdpSliceGreen');
        const mdpBlu = document.getElementById('wbMdpSliceBlue');
        const ffsTot = document.getElementById('wbFfsPillarVal');
        const newOrder = document.getElementById('wbFromNewOrderVal');

        if (mdpTot) mdpTot.textContent = m.leftPillar.total;
        if (mdpGrn) mdpGrn.textContent = m.leftPillar.green;
        if (mdpBlu) mdpBlu.textContent = m.leftPillar.blue;
        if (ffsTot) ffsTot.textContent = m.ffsPillar;
        if (newOrder) newOrder.textContent = m.fromNewOrder;
    }

    // SECTION 4: Closing Estimation (①)
    function renderClosingEstimation(data) {
        const c = data.closingEstimation;
        if (!c) return;

        const oapTgt = document.getElementById('wbCloseOapTarget');
        const matchOs = document.getElementById('wbCloseMatchOS');
        const newSpk = document.getElementById('wbCloseNewSPK');
        const totalEst = document.getElementById('wbCloseTotalEst');
        const invStock = document.getElementById('wbCloseInvStock');
        const effSto = document.getElementById('wbCloseEffSTO');

        if (oapTgt) oapTgt.textContent = c.oapTarget;
        if (matchOs) matchOs.textContent = c.matchingOutstanding;
        if (newSpk) newSpk.textContent = c.newOrderSPK;
        if (totalEst) totalEst.textContent = c.totalEstClosing;
        if (invStock) invStock.textContent = c.totalInvoiceableStock;
        if (effSto) effSto.textContent = c.efficiencySTO;
    }

    // TABLE 1: Gap from OS & Match Unfirmed
    function renderTable1(data) {
        const tbody = document.getElementById('wbTable1Body');
        if (!tbody) return;

        const models = data.table1Models || [];
        const grand = window.AOReportData.calculateTable1Totals(models);

        let rows = models.map(m => `
            <tr>
                <td class="ao-col-model-name">${m.model}</td>
                <td style="font-weight:900;">${m.gapOS || 0}</td>
                <td>${m.w1 || ''}</td>
                <td>${m.w2 || ''}</td>
                <td>${m.w3 || ''}</td>
                <td>${m.w4 || ''}</td>
                <td style="font-weight:900; background:#fef08a;">${m.totalMatch || ''}</td>
                <td style="background:#bbf7d0;">${m.firmed || ''}</td>
                <td>${m.pLoan || ''}</td>
                <td style="${m.unmatch > 0 ? 'background:#fecaca; color:#dc2626;' : ''}">${m.unmatch || ''}</td>
            </tr>
        `).join('');

        rows += `
            <tr class="ao-row-grand-total">
                <td class="ao-col-model-name">Grand Total</td>
                <td>${grand.gapOS}</td>
                <td>${grand.w1}</td>
                <td>${grand.w2}</td>
                <td>${grand.w3}</td>
                <td>${grand.w4}</td>
                <td style="background:#fef08a;">${grand.totalMatch}</td>
                <td style="background:#bbf7d0;">${grand.firmed}</td>
                <td>${grand.pLoan}</td>
                <td>${grand.unmatch}</td>
            </tr>
        `;

        tbody.innerHTML = rows;
    }

    // TABLE 2: Supply, Alokasi & FTS
    function renderTable2(data) {
        const tbody = document.getElementById('wbTable2Body');
        if (!tbody) return;

        const models = data.table2Supply || [];
        const grand = window.AOReportData.calculateTable2Totals(models);

        let rows = models.map(m => `
            <tr>
                <td class="ao-col-model-name">${m.model}</td>
                <td style="background:#fef08a; font-weight:900;">${m.stock || 0}</td>
                <td style="background:#e0f2fe;">${m.mdp || ''}</td>
                <td>${m.secondAllo || ''}</td>
                <td>${m.co || ''}</td>
                <td style="background:#fed7aa; font-weight:800;">${m.ttlSupply || m.stock || 0}</td>
                <td>${m.doActual || ''}</td>
                <td>${m.stockMatching || ''}</td>
                <td style="background:#ffedd5; font-weight:900;">${m.fts !== undefined ? m.fts : (m.stock - m.stockMatching)}</td>
                <td>${m.spk || ''}</td>
                <td>${m.do || ''}</td>
                <td style="background:#bbf7d0; font-weight:900;">${m.netFts !== undefined ? m.netFts : (m.stock - m.stockMatching)}</td>
            </tr>
        `).join('');

        rows += `
            <tr class="ao-row-grand-total">
                <td class="ao-col-model-name">Grand Total</td>
                <td style="background:#fef08a;">${grand.stock}</td>
                <td style="background:#e0f2fe;">${grand.mdp}</td>
                <td>${grand.secondAllo}</td>
                <td>${grand.co}</td>
                <td style="background:#fed7aa;">${grand.ttlSupply}</td>
                <td>${grand.doActual}</td>
                <td>${grand.stockMatching}</td>
                <td style="background:#ffedd5;">${grand.fts}</td>
                <td>${grand.spk}</td>
                <td>${grand.do}</td>
                <td style="background:#bbf7d0;">${grand.netFts}</td>
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

        // Export CSV button
        const btnCSV = document.getElementById('btnAoExportCSV');
        if (btnCSV) {
            btnCSV.addEventListener('click', () => {
                window.AOReportData.exportToCSV();
            });
        }

        // Fullscreen / Projector Mode Toggle
        const btnProjector = document.getElementById('btnAoProjector');
        const boardContainer = document.getElementById('aoBoardMainContainer');
        if (btnProjector && boardContainer) {
            btnProjector.addEventListener('click', () => {
                boardContainer.classList.toggle('ao-fullscreen-active');
                if (boardContainer.classList.contains('ao-fullscreen-active')) {
                    btnProjector.innerHTML = '<i class="fa-solid fa-compress"></i> Tutup Layar Penuh';
                } else {
                    btnProjector.innerHTML = '<i class="fa-solid fa-expand"></i> Mode Proyektor TV';
                }
            });
        }

        // Horizontal Track Mousewheel support
        const track = document.getElementById('aoWhiteboardTrack');
        if (track) {
            track.addEventListener('wheel', (e) => {
                const targetInTable = e.target.closest('.ao-model-table-wrap');
                if (targetInTable && targetInTable.scrollHeight > targetInTable.clientHeight) {
                    return; // let table scroll vertically
                }
                if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
                    e.preventDefault();
                    track.scrollLeft += e.deltaY;
                }
            }, { passive: false });
        }
    }

    function aoScrollHorizontal(delta) {
        const track = document.getElementById('aoWhiteboardTrack');
        if (track) {
            track.scrollBy({ left: delta, behavior: 'smooth' });
        }
    }

    function aoScrollToSection(secId) {
        const target = document.getElementById(secId);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
        }
        document.querySelectorAll('.ao-jump-pill').forEach(btn => btn.classList.remove('active'));
        const activeBtn = document.querySelector(`.ao-jump-pill[onclick*="${secId}"]`);
        if (activeBtn) activeBtn.classList.add('active');
    }

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
                    if (window.renderAllAOComponents) {
                        await window.renderAllAOComponents(true);
                    }
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

    window.aoScrollHorizontal = aoScrollHorizontal;
    window.aoScrollToSection = aoScrollToSection;
    window.initAOReport = initAOReport;
    window.renderAllAOComponents = renderAllAOComponents;
    window.openAoImportModal = openAoImportModal;
    window.closeAoImportModal = closeAoImportModal;
    window.handleAoFileSelected = handleAoFileSelected;
    window.submitAoImport = submitAoImport;

})(window, document);

