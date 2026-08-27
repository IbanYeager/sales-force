/**
 * AO (Area Operation) Report Data & Business Logic Engine
 * Tunas Toyota Kiara Condong - Standard Area Operation Whiteboard System
 */

(function(window) {
    'use strict';

    // Master Initial Data mirroring the physical whiteboard photo (10 Agustus 2026)
    const DEFAULT_AO_DATA = {
        branch: 'TUNAS TOYOTA KIARACONDONG',
        reportDate: '10 Agustus 2026',
        periodMonth: 'Agustus 2026',
        
        // 1. Stock Matching with OS
        stock: {
            fullStock: { total: 124, free: 82, match: 42 },
            invoiceableStock: { total: 124, free: 82, match: 42 },
            osOrder: {
                gt60Days: { total: 1, match: 0, firmedMatch: 0 },
                d30To60Days: { total: 0, match: 0, firmedMatch: 0 },
                lt30Days: { total: 48, firmed: 18, match: 30, firmedMatch: 30 }
            },
            matchingStatus: {
                unmatchStock: 7,
                unmatchBreakdown: { unfirmedGt30: 0, unfirmedLt30: 0, firmedGt30: 0, firmedLt30: 7, firmed: 1 },
                matchStock: 42,
                weeklyUnfirmedMatch: {
                    w1: 10,
                    w2: 5,
                    w3: 5,
                    w4: 1
                },
                firmedMatch: 18
            },
            kpi: {
                matchingRatio: 86, // in %
                targetDO: 92,
                potentialDoFromOS: 52,
                gapFromTarget: 40,
                mtdActual: 18
            },
            ritme5Harian: [
                { period: '1-5', value: 3, accum: 3 },
                { period: '6-10', value: 7, accum: 10 },
                { period: '11-15', value: 9, accum: 19 },
                { period: '16-20', value: 10, accum: 29 },
                { period: '21-25', value: 11, accum: 40 },
                { period: '26-31', value: 12, accum: 52 }
            ]
        },

        // 2. Matching Stock from Order / SPK Plan
        spkPlan: {
            periods: ['TTL', '1-5', '6-10', '11-15', '16-20', '21-25', '26-31'],
            spkGrossPlan: [122, 20, 20, 20, 20, 20, 22],
            spkGrossActual: [54, 30, 24, null, null, null, null],
            gapGross: [null, '+10', '+4', null, null, null, null],
            
            cancellationAssum: [8, 1, 1, 1, 2, 1, 1],
            cancellationActual: [0, 0, 0, null, null, null, null],
            cancellationRatio: ['0%', '0%', '0%', '0%', '0%', '0%', '0%'],
            cancelRatioStats: {
                threeMonthsAvg: '4%',
                loanRejection: '2%'
            },

            spkNettPlan: [114, 19, 19, 19, 19, 19, 19],
            spkNettActual: [54, 30, 24, null, null, null, null],
            gapNett: [null, '+11', '+5', '-19', '-19', '-19', '-19'],

            effectiveToN1RS: 48,
            nettSpkVisualize: [
                { period: '1-5', step: 30, accum: 30 },
                { period: '6-10', step: 24, accum: 54 },
                { period: '11-15', step: 19, accum: 73 },
                { period: '16-20', step: 19, accum: 92 },
                { period: '21-25', step: 19, accum: 111 },
                { period: '26-31', step: 19, accum: 130 }
            ],
            rsMetrics: {
                avg5DaysSpk: 19,
                becomeOS: 38,
                effectiveToMonthDO: 76
            }
        },

        // 3. MDP Plan (Monthly Delivery Plan & FFS Selling Plan)
        mdpPlan: {
            ffsSellingPlan: [
                { period: '1-5', value: 38, accum: 38, icon: 'truck' },
                { period: '6-10', value: 6, accum: 44, icon: 'truck' },
                { period: '11-15', value: 20, accum: 64, icon: 'truck-fast' },
                { period: '16-20', value: 23, accum: 87, icon: 'truck-ramp-box' },
                { period: '21-25', value: 22, accum: 109, icon: 'truck-plane' },
                { period: '26-31', value: 8, accum: 117, icon: 'truck-front' },
                { period: 'Reserve', value: 17, accum: 134, icon: 'boxes-packing' }
            ],
            stepProgression: [
                { period: '1-5', value: 0, accum: 0 },
                { period: '6-10', value: 0, accum: 0 },
                { period: '11-15', value: 8, accum: 8 },
                { period: '16-20', value: 9, accum: 17 },
                { period: '21-25', value: 10, accum: 27 },
                { period: '26-31', value: 13, accum: 40 }
            ],
            accumMtdDoRs: 57,
            totalSellingPlanAccum: 134
        },

        // 4. Closing Estimation (Executive Metrics)
        closingEstimation: {
            doRsTarget: 92,
            matchingWithOS: 52,
            newOrderSPK: 52,
            totalEstClosingMonth: 104,
            gapFromTarget: 12, // +12 Overachieve
            efficiencyOS: 83, // %
            nPlus1OpSPK: 85,
            oldSPKMay21To31: 38,
            constRatio: 45 // %
        },

        // 5. Vehicle Model Breakdown Matrix (24 Toyota Models + Grand Total)
        modelsBreakdown: [
            { model: 'Avanza New', gapOS: 5, w1: 15, w2: 2, w3: 2, w4: 1, totalMatch: 20, firmedPlan: 2, unmatch: 0, mdpStock: 7, adaCO1: 1, adaCO2: 0, estClosing: 22 },
            { model: 'Veloz New', gapOS: 2, w1: 6, w2: 1, w3: 1, w4: 0, totalMatch: 8, firmedPlan: 1, unmatch: 0, mdpStock: 3, adaCO1: 1, adaCO2: 0, estClosing: 9 },
            { model: 'Raize', gapOS: 3, w1: 4, w2: 1, w3: 1, w4: 0, totalMatch: 6, firmedPlan: 1, unmatch: 1, mdpStock: 2, adaCO1: 0, adaCO2: 0, estClosing: 7 },
            { model: 'Agya', gapOS: 4, w1: 5, w2: 1, w3: 1, w4: 0, totalMatch: 7, firmedPlan: 2, unmatch: 0, mdpStock: 3, adaCO1: 1, adaCO2: 0, estClosing: 8 },
            { model: 'Agya GR-S', gapOS: 1, w1: 2, w2: 0, w3: 0, w4: 0, totalMatch: 2, firmedPlan: 1, unmatch: 0, mdpStock: 1, adaCO1: 0, adaCO2: 0, estClosing: 3 },
            { model: 'Calya', gapOS: 4, w1: 8, w2: 2, w3: 1, w4: 0, totalMatch: 11, firmedPlan: 3, unmatch: 0, mdpStock: 4, adaCO1: 1, adaCO2: 0, estClosing: 13 },
            { model: 'Yaris', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 },
            { model: 'Yaris Cross Gasoline', gapOS: 2, w1: 2, w2: 1, w3: 0, w4: 0, totalMatch: 3, firmedPlan: 1, unmatch: 0, mdpStock: 1, adaCO1: 0, adaCO2: 0, estClosing: 3 },
            { model: 'Yaris Cross Hybrid', gapOS: 3, w1: 3, w2: 1, w3: 0, w4: 0, totalMatch: 4, firmedPlan: 1, unmatch: 1, mdpStock: 2, adaCO1: 0, adaCO2: 0, estClosing: 5 },
            { model: 'Innova', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmedPlan: 1, unmatch: 0, mdpStock: 1, adaCO1: 0, adaCO2: 0, estClosing: 2 },
            { model: 'Innova Zenix Gasoline', gapOS: 4, w1: 4, w2: 1, w3: 1, w4: 0, totalMatch: 6, firmedPlan: 2, unmatch: 1, mdpStock: 3, adaCO1: 1, adaCO2: 0, estClosing: 8 },
            { model: 'Innova Zenix Hybrid', gapOS: 7, w1: 9, w2: 3, w3: 2, w4: 0, totalMatch: 14, firmedPlan: 4, unmatch: 2, mdpStock: 5, adaCO1: 1, adaCO2: 0, estClosing: 16 },
            { model: 'Fortuner 4x2', gapOS: 2, w1: 3, w2: 1, w3: 0, w4: 0, totalMatch: 4, firmedPlan: 1, unmatch: 0, mdpStock: 2, adaCO1: 0, adaCO2: 0, estClosing: 4 },
            { model: 'Rush', gapOS: 3, w1: 5, w2: 1, w3: 1, w4: 0, totalMatch: 7, firmedPlan: 2, unmatch: 1, mdpStock: 2, adaCO1: 0, adaCO2: 0, estClosing: 7 },
            { model: 'Alphard', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 1 },
            { model: 'Alphard Hybrid', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 1 },
            { model: 'Voxy', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 },
            { model: 'Hilux D-Cab', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 1 },
            { model: 'Hilux S-Cab', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 },
            { model: 'Hilux S-Cab 4x4', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 },
            { model: 'Hilux Rangga', gapOS: 2, w1: 2, w2: 1, w3: 0, w4: 0, totalMatch: 3, firmedPlan: 1, unmatch: 1, mdpStock: 1, adaCO1: 0, adaCO2: 0, estClosing: 3 },
            { model: 'Hiace', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 },
            { model: 'Hiace Premio', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 1 },
            { model: 'Others', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmedPlan: 0, unmatch: 0, mdpStock: 0, adaCO1: 0, adaCO2: 0, estClosing: 0 }
        ]
    };

    // Store in localStorage if not already saved
    const STORAGE_KEY = 'ao_report_live_data_v1';

    function getAOData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Error reading localStorage AO data:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_AO_DATA));
    }

    function saveAOData(data) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving AO data:', e);
        }
    }

    function resetAOData() {
        const fresh = JSON.parse(JSON.stringify(DEFAULT_AO_DATA));
        saveAOData(fresh);
        return fresh;
    }

    // Calculation Helpers
    function calculateTotals(models) {
        const grand = {
            model: 'GRAND TOTAL',
            gapOS: 0,
            w1: 0,
            w2: 0,
            w3: 0,
            w4: 0,
            totalMatch: 0,
            firmedPlan: 0,
            unmatch: 0,
            mdpStock: 0,
            adaCO1: 0,
            adaCO2: 0,
            estClosing: 0
        };

        models.forEach(m => {
            grand.gapOS += Number(m.gapOS || 0);
            grand.w1 += Number(m.w1 || 0);
            grand.w2 += Number(m.w2 || 0);
            grand.w3 += Number(m.w3 || 0);
            grand.w4 += Number(m.w4 || 0);
            grand.totalMatch += Number(m.totalMatch || (Number(m.w1||0) + Number(m.w2||0) + Number(m.w3||0) + Number(m.w4||0)) || 0);
            grand.firmedPlan += Number(m.firmedPlan || 0);
            grand.unmatch += Number(m.unmatch || 0);
            grand.mdpStock += Number(m.mdpStock || 0);
            grand.adaCO1 += Number(m.adaCO1 || 0);
            grand.adaCO2 += Number(m.adaCO2 || 0);
            grand.estClosing += Number(m.estClosing || 0);
        });

        return grand;
    }

    // Format WhatsApp Briefing Text
    function generateWAContent(data, role) {
        const d = data || getAOData();
        const models = d.modelsBreakdown || [];
        const grand = calculateTotals(models);

        let txt = `📊 *AREA OPERATION (AO) REPORT*\n`;
        txt += `🏢 *${d.branch}*\n`;
        txt += `📅 *Tanggal:* ${d.reportDate} | *Periode:* ${d.periodMonth}\n`;
        txt += `─────────────────────────\n\n`;

        txt += `🎯 *1. STOCK MATCHING WITH OS*\n`;
        txt += `• Full Stock: *${d.stock.fullStock.total} unit* (Free: ${d.stock.fullStock.free} | Match: ${d.stock.fullStock.match})\n`;
        txt += `• OS Order <30d: *${d.stock.osOrder.lt30Days.total} unit* (Firmed: ${d.stock.osOrder.lt30Days.firmed} | Match: ${d.stock.osOrder.lt30Days.match})\n`;
        txt += `• Matching Ratio: *${d.stock.kpi.matchingRatio}%* 🟢\n`;
        txt += `• Target DO Cabang: *${d.stock.kpi.targetDO} unit*\n`;
        txt += `• Potensi DO dari OS: *${d.stock.kpi.potentialDoFromOS} unit* (Gap: ${d.stock.kpi.gapFromTarget} unit)\n`;
        txt += `• Realisasi DO MTD: *${d.stock.kpi.mtdActual} unit*\n\n`;

        txt += `📈 *2. SPK PACE & RITME 5-HARIAN*\n`;
        txt += `• SPK Gross Plan: *${d.spkPlan.spkGrossPlan[0]} unit* | Aktual: *${d.spkPlan.spkGrossActual[0]} unit*\n`;
        txt += `• Ritme 1-5: Plan ${d.spkPlan.spkGrossPlan[1]} ➔ Aktual *${d.spkPlan.spkGrossActual[1]} unit* (+10)\n`;
        txt += `• Ritme 6-10: Plan ${d.spkPlan.spkGrossPlan[2]} ➔ Aktual *${d.spkPlan.spkGrossActual[2]} unit* (+4)\n`;
        txt += `• Cancellation Ratio: *0%* (Aman)\n`;
        txt += `• SPK Nett Aktual: *${d.spkPlan.spkNettActual[0]} unit*\n\n`;

        txt += `🏆 *3. ESTIMASI CLOSING BULAN INI*\n`;
        txt += `• DO/RS Target: *${d.closingEstimation.doRsTarget} unit*\n`;
        txt += `• (+) Matching OS: *+${d.closingEstimation.matchingWithOS} unit*\n`;
        txt += `• (+) New SPK Order: *+${d.closingEstimation.newOrderSPK} unit*\n`;
        txt += `• 🏁 *TOTAL ESTIMASI CLOSING:* *${d.closingEstimation.totalEstClosingMonth} UNIT*\n`;
        txt += `• Status vs Target: *+${d.closingEstimation.gapFromTarget} UNIT (OVERACHIEVE! 🎉)*\n`;
        txt += `• Efisiensi OS: *${d.closingEstimation.efficiencyOS}%*\n\n`;

        txt += `🚗 *4. TOP 5 KONTRIBUTOR MODEL*\n`;
        const topModels = [...models].sort((a, b) => b.estClosing - a.estClosing).slice(0, 5);
        topModels.forEach((m, idx) => {
            txt += `${idx + 1}. *${m.model}*: Est. Closing ${m.estClosing} unit (Match: ${m.totalMatch} | MDP: ${m.mdpStock})\n`;
        });

        txt += `\n─────────────────────────\n`;
        txt += `💪 *SEMANGAT JUARA & CLOSING TOYOTA!*`;

        return txt;
    }

    // Export to CSV
    function exportToCSV(data) {
        const d = data || getAOData();
        const models = d.modelsBreakdown || [];
        const grand = calculateTotals(models);

        let csv = 'Model,Gap from OS,1 Minggu,2 Minggu,3 Minggu,4 Minggu,Total Match,Firmed Plan,Unmatch,MDP Stock,1st Ada C/O,2nd Ada C/O,Est Closing\n';

        models.forEach(m => {
            csv += `"${m.model}",${m.gapOS},${m.w1},${m.w2},${m.w3},${m.w4},${m.totalMatch},${m.firmedPlan},${m.unmatch},${m.mdpStock},${m.adaCO1},${m.adaCO2},${m.estClosing}\n`;
        });

        csv += `"GRAND TOTAL",${grand.gapOS},${grand.w1},${grand.w2},${grand.w3},${grand.w4},${grand.totalMatch},${grand.firmedPlan},${grand.unmatch},${grand.mdpStock},${grand.adaCO1},${grand.adaCO2},${grand.estClosing}\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AO_Report_Tunas_Toyota_${d.reportDate.replace(/\s+/g, '_')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Global Export
    window.AOReportData = {
        DEFAULT_AO_DATA,
        getAOData,
        saveAOData,
        resetAOData,
        calculateTotals,
        generateWAContent,
        exportToCSV
    };

})(window);
