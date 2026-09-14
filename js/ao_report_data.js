/**
 * AO (Area Operation) Report Data Engine - Tunas Toyota Kiaracondong
 * Synchronized with the physical whiteboard (31 Agustus 2026)
 */

(function(window) {
    'use strict';

    const DEFAULT_AO_DATA = {
        branch: 'TUNAS TOYOTA KIARACONDONG',
        reportDate: '31 Agustus 2026',
        periodMonth: 'Agustus 2026',

        // 1. Stock Matching with OS (Lingkaran 2)
        stock: {
            fullStock: { total: 46, free: 30, match: 16 },
            invoiceableStock: { total: 46, free: 30, match: 16 },
            osOrder: {
                total: 29,
                gt60Days: { total: 0, match: 0 },
                d30To60Days: { total: 4, match: 2, firmedMatch: 0 },
                firmedOSLt30: { total: 25, firmed: 6, plCpi: 19 }
            },
            stockMatching: {
                matchUnfirmedGt30: 2,
                matchUnfirmedLt30: 2,
                unmatchStock: 10,
                unmatchBreakdown: {
                    firmedGt30: 1,
                    firmedLt30: 5,
                    unfirmedLt30: 4,
                    unfirmedGt30: 0
                },
                matchStock: 16,
                matchBreakdown: {
                    firmedGt30: 1,
                    plCpi: 15
                }
            },
            kpi: {
                matchingRatio: 34, // %
                targetDO: 92,
                potentialDoFromOS: 16,
                gapTarget: 76,
                mtdActual: 16,
                mdpVal: 0,
                onHandStock: 16
            },
            ritme5Harian: [
                { period: '1-5', value: 2, accum: 2 },
                { period: '6-10', value: 3, accum: 5 },
                { period: '11-15', value: 3, accum: 8 },
                { period: '16-20', value: 3, accum: 11 },
                { period: '21-25', value: 3, accum: 14 },
                { period: '26-31', value: 2, accum: 16 }
            ]
        },

        // 2. Matching Stock from Order / SPK Plan (Lingkaran 10)
        spkPlan: {
            periods: ['TTL', '1-5', '6-10', '11-15', '16-20', '21-25', '26-31'],
            effectiveNRS: 76,
            forNPlus1RS: 42,

            spkGrossPlan: [122, 20, 20, 20, 20, 20, 22],
            spkGrossActual: [54, 30, 24, null, null, null, null],
            gapGross: ['-', 0, 1, 2, 3, 1, 1],

            cancellationAssum: [8, 1, 1, 2, 2, 1, 1],
            cancellationActual: [0, 0, 0, null, null, null, null],
            cancellationRatio: ['0%', '0%', '0%', '0%', '0%', '0%', '0%'],

            cancelRatioStats: {
                threeMonthsAvg: '4%',
                loanRejection: '2%'
            },

            spkNettPlan: [114, 19, 19, 19, 19, 19, 19],
            spkNettActual: [54, 30, 24, null, null, null, null],
            gapNett: ['-', '+11', '+5', '-19', '-19', '-19', '-19'],

            nettSpkVisualize: [
                { period: '1-5', val: 19 },
                { period: '6-10', val: 19 },
                { period: '11-15', val: 19 },
                { period: '16-20', val: 19 },
                { period: '21-25', val: 19 },
                { period: '26-31', val: 19 }
            ],

            rsPillar: {
                ttl: 114,
                becomeOS: 38,
                effectiveMonthRS: 76,
                avgDays: 8
            }
        },

        // 3. MDP Plan & FFS Selling Plan
        mdpPlan: {
            leftPillar: {
                total: 32,
                green: 2,
                blue: 30
            },
            ffsPillar: 46,
            ffsSellingPlan: [
                { period: '1-5', accum: 46 },
                { period: '6-10', accum: 52 },
                { period: '11-15', accum: 72 },
                { period: '16-20', accum: 95 },
                { period: '21-25', accum: 117 },
                { period: '26-31', accum: 125 }
            ],
            rsPlanSteps: [19, 19, 19, 19, 19, 19],
            accumMtdDoRsValues: [0, 0, 8, 17, 27, 40],
            fromNewOrder: 76
        },

        // 4. Closing Estimation (Lingkaran 1)
        closingEstimation: {
            oapTarget: 92,
            matchingOutstanding: 29,
            newOrderSPK: 76,
            totalEstClosing: 92,
            totalInvoiceableStock: 46,
            efficiencySTO: '24%'
        },

        // 5. Table 1: Model Breakdown for Gap OS & Matching (PL + CPI)
        table1Models: [
            { model: 'Avanza New', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmed: 1, pLoan: 0, unmatch: 0 },
            { model: 'Veloz New', gapOS: 1, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Raize', gapOS: 1, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Agya', gapOS: 3, w1: 1, w2: 1, w3: 0, w4: 0, totalMatch: 2, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Agya GR-S', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Calya', gapOS: 5, w1: 0, w2: 0, w3: 4, w4: 0, totalMatch: 4, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Yaris', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Yaris Cross Gasoline', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Yaris Cross Hybrid', gapOS: 3, w1: 1, w2: 0, w3: 2, w4: 0, totalMatch: 3, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Innova', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Innova Zenix Hybrid', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Innova Zenix', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Fortuner 4x2', gapOS: 1, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Rush', gapOS: 1, w1: 1, w2: 0, w3: 0, w4: 0, totalMatch: 1, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Alphard', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Alphard Hybrid', gapOS: 0, w1: 0, w2: 0, w3: 2, w4: 1, totalMatch: 3, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Voxy', gapOS: 0, w1: 0, w2: 0, w3: 2, w4: 2, totalMatch: 4, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hilux D-Cab', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hilux S-Cab', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hilux S-Cab 4x4', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hilux Rangga', gapOS: 0, w1: 0, w2: 0, w3: 2, w4: 2, totalMatch: 4, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hiace', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Hiace Premio', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 },
            { model: 'Others', gapOS: 0, w1: 0, w2: 0, w3: 0, w4: 0, totalMatch: 0, firmed: 0, pLoan: 0, unmatch: 0 }
        ],

        // 6. Table 2: Model Breakdown for Supply, Alokasi & FTS
        table2BoxParams: {
            nPlus1OpTgt: 114,
            day21To30CkdSpk: 38,
            comp: 76
        },
        table2Supply: [
            { model: 'Avanza New', stock: 7, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 7, doActual: 0, stockMatching: 1, fts: 6, spk: 0, do: 0, netFts: 6 },
            { model: 'Veloz New', stock: 5, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 5, doActual: 0, stockMatching: 0, fts: 5, spk: 0, do: 0, netFts: 5 },
            { model: 'Raize', stock: 7, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 7, doActual: 0, stockMatching: 0, fts: 7, spk: 0, do: 0, netFts: 7 },
            { model: 'Rush', stock: 4, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 4, doActual: 0, stockMatching: 1, fts: 3, spk: 0, do: 0, netFts: 3 },
            { model: 'Agya', stock: 3, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 3, doActual: 0, stockMatching: 2, fts: 1, spk: 0, do: 0, netFts: 1 },
            { model: 'Agya GR-S', stock: 2, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 2, doActual: 0, stockMatching: 0, fts: 2, spk: 0, do: 0, netFts: 2 },
            { model: 'Calya', stock: 4, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 4, doActual: 0, stockMatching: 4, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Yaris', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Yaris Cross Gasoline', stock: 1, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 1, doActual: 0, stockMatching: 0, fts: 1, spk: 0, do: 0, netFts: 1 },
            { model: 'Yaris Cross Hybrid', stock: 3, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 3, doActual: 0, stockMatching: 3, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Innova', stock: 2, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 2, doActual: 0, stockMatching: 0, fts: 2, spk: 0, do: 0, netFts: 2 },
            { model: 'Innova Zenix Hybrid', stock: 3, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 3, doActual: 0, stockMatching: 0, fts: 3, spk: 0, do: 0, netFts: 3 },
            { model: 'Innova Zenix', stock: 5, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 5, doActual: 0, stockMatching: 0, fts: 5, spk: 0, do: 0, netFts: 5 },
            { model: 'Fortuner 4x2', stock: 2, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 2, doActual: 0, stockMatching: 0, fts: 2, spk: 0, do: 0, netFts: 2 },
            { model: 'Alphard', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Alphard Hybrid', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Voxy', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hilux D-Cab', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hilux S-Cab', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hilux S-Cab 4x4', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hilux Rangga', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hiace', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Hiace Premio', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 },
            { model: 'Others', stock: 0, mdp: 0, secondAllo: 0, co: 0, ttlSupply: 0, doActual: 0, stockMatching: 0, fts: 0, spk: 0, do: 0, netFts: 0 }
        ]
    };

    const STORAGE_KEY = 'ao_report_live_whiteboard_v3';
    let cachedLiveAOData = null;

    async function fetchAODataLive(forceFresh = false) {
        if (!forceFresh && cachedLiveAOData) {
            return cachedLiveAOData;
        }

        try {
            const res = await fetch('../api/api_ao_report.php');
            const json = await res.json();
            if (json && json.status === 'success' && json.stock) {
                cachedLiveAOData = json;
                saveAOData(json);
                return json;
            }
        } catch (err) {
            console.warn('Fallback ke preset whiteboard data:', err);
        }

        const fallback = getAOData();
        cachedLiveAOData = fallback;
        return fallback;
    }

    function getAOData() {
        if (cachedLiveAOData) return cachedLiveAOData;
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.table1Models && parsed.table2Supply) {
                    return parsed;
                }
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
        cachedLiveAOData = null;
        saveAOData(fresh);
        return fresh;
    }

    function calculateTable1Totals(models) {
        const grand = {
            model: 'Grand Total',
            gapOS: 0,
            w1: 0,
            w2: 0,
            w3: 0,
            w4: 0,
            totalMatch: 0,
            firmed: 0,
            pLoan: 0,
            unmatch: 0
        };

        (models || []).forEach(m => {
            grand.gapOS += Number(m.gapOS || 0);
            grand.w1 += Number(m.w1 || 0);
            grand.w2 += Number(m.w2 || 0);
            grand.w3 += Number(m.w3 || 0);
            grand.w4 += Number(m.w4 || 0);
            grand.totalMatch += Number(m.totalMatch || (Number(m.w1||0) + Number(m.w2||0) + Number(m.w3||0) + Number(m.w4||0)) || 0);
            grand.firmed += Number(m.firmed || 0);
            grand.pLoan += Number(m.pLoan || 0);
            grand.unmatch += Number(m.unmatch || 0);
        });

        return grand;
    }

    function calculateTable2Totals(models) {
        const grand = {
            model: 'Grand Total',
            stock: 0,
            mdp: 0,
            secondAllo: 0,
            co: 0,
            ttlSupply: 0,
            doActual: 0,
            stockMatching: 0,
            fts: 0,
            spk: 0,
            do: 0,
            netFts: 0
        };

        (models || []).forEach(m => {
            grand.stock += Number(m.stock || 0);
            grand.mdp += Number(m.mdp || 0);
            grand.secondAllo += Number(m.secondAllo || 0);
            grand.co += Number(m.co || 0);
            grand.ttlSupply += Number(m.ttlSupply || (Number(m.stock||0) + Number(m.mdp||0) + Number(m.secondAllo||0) + Number(m.co||0)) || 0);
            grand.doActual += Number(m.doActual || 0);
            grand.stockMatching += Number(m.stockMatching || 0);
            grand.fts += Number(m.fts || (Number(m.ttlSupply||0) - Number(m.stockMatching||0)) || 0);
            grand.spk += Number(m.spk || 0);
            grand.do += Number(m.do || 0);
            grand.netFts += Number(m.netFts || (Number(m.fts||0) - Number(m.spk||0)) || 0);
        });

        return grand;
    }

    function generateWAContent(data, role) {
        const d = data || getAOData();
        const t1 = d.table1Models || [];
        const grand1 = calculateTable1Totals(t1);
        const t2 = d.table2Supply || [];
        const grand2 = calculateTable2Totals(t2);

        let txt = `📋 *AREA OPERATION (AO) REPORT - PAPAN OPERASIONAL*\n`;
        txt += `🏢 *${d.branch}*\n`;
        txt += `📅 *Tanggal:* ${d.reportDate} | *Periode:* ${d.periodMonth}\n`;
        txt += `═════════════════════════\n\n`;

        txt += `🎯 *1. STOCK MATCHING WITH OS (②)*\n`;
        txt += `• Full Stock: *${d.stock.fullStock.total}* (Free: ${d.stock.fullStock.free} | Match: ${d.stock.fullStock.match})\n`;
        txt += `• Invoiceable Stk: *${d.stock.invoiceableStock.total}* (Free: ${d.stock.invoiceableStock.free} | Match: ${d.stock.invoiceableStock.match})\n`;
        txt += `• OS Order: *${d.stock.osOrder.total}* (<30d: ${d.stock.osOrder.firmedOSLt30.total} | Firmed Match: ${d.stock.osOrder.firmedOSLt30.plCpi})\n`;
        txt += `• Stock Matching: Match ${d.stock.stockMatching.matchStock} (PL+CPI 15) | Unmatch ${d.stock.stockMatching.unmatchStock}\n`;
        txt += `• Matching Ratio: *${d.stock.kpi.matchingRatio}%* (③)\n`;
        txt += `• Total Potensi DO fr OS: *${d.stock.kpi.potentialDoFromOS}* (⑤)\n`;
        txt += `• Realisasi DO MTD: *${d.stock.kpi.mtdActual}* (④) | GAP Target: *${d.stock.kpi.gapTarget}* (⑥)\n\n`;

        txt += `📈 *2. MATCHING STOCK FROM ORDER / SPK PLAN (⑩)*\n`;
        txt += `• SPK Gross Plan: *${d.spkPlan.spkGrossPlan[0]}* | Aktual: *${d.spkPlan.spkGrossActual[0]}*\n`;
        txt += `• SPK Nett Plan: *${d.spkPlan.spkNettPlan[0]}* (Ritme 19/periode)\n`;
        txt += `• Eff to Month RS: *${d.spkPlan.rsPillar.effectiveMonthRS}* | Become OS: *${d.spkPlan.rsPillar.becomeOS}*\n`;
        txt += `• Cancel Ratio 3M Avg: *${d.spkPlan.cancelRatioStats.threeMonthsAvg}* | Loan Rej: *${d.spkPlan.cancelRatioStats.loanRejection}*\n\n`;

        txt += `🚚 *3. MDP PLAN & FFS SELLING PLAN*\n`;
        txt += `• Pilar MDP: *${d.mdpPlan.leftPillar.total}* (Hijau: ${d.mdpPlan.leftPillar.green}, Biru: ${d.mdpPlan.leftPillar.blue})\n`;
        txt += `• FFS Selling Plan: *${d.mdpPlan.ffsPillar}*\n`;
        txt += `• From New Order: *${d.mdpPlan.fromNewOrder}*\n\n`;

        txt += `🏁 *4. CLOSING ESTIMATION (①)*\n`;
        txt += `• OAP Target: *${d.closingEstimation.oapTarget} unit*\n`;
        txt += `• [A] Matching with OS: *${d.closingEstimation.matchingOutstanding}*\n`;
        txt += `• [B] New Order (SPK): *${d.closingEstimation.newOrderSPK}*\n`;
        txt += `• Total Estimasi Closing: *${d.closingEstimation.totalEstClosing} unit*\n`;
        txt += `• Efficiency (STO): *${d.closingEstimation.efficiencySTO}*\n\n`;

        txt += `🚗 *5. RINGKASAN STOK MODEL KUNCI (FTS)*\n`;
        const topFts = [...t2].filter(m => m.stock > 0).slice(0, 6);
        topFts.forEach(m => {
            txt += `• *${m.model}*: Stock ${m.stock} | Match ${m.stockMatching} | Net FTS *${m.netFts}*\n`;
        });
        txt += `• *Total Stock Cabang: ${grand2.stock} unit*\n\n`;

        txt += `═════════════════════════\n`;
        txt += `💪 *TUNAS TOYOTA KIARACONDONG - SEMANGAT CLOSING!*`;

        return txt;
    }

    function exportToCSV(data) {
        const d = data || getAOData();
        const t1 = d.table1Models || [];
        const grand1 = calculateTable1Totals(t1);
        const t2 = d.table2Supply || [];
        const grand2 = calculateTable2Totals(t2);

        let csv = '=== AREA OPERATION REPORT - TUNAS TOYOTA KIARACONDONG ===\n';
        csv += `Tanggal,${d.reportDate}\n`;
        csv += `OAP Target,${d.closingEstimation.oapTarget}\n`;
        csv += `Matching with OS,${d.closingEstimation.matchingOutstanding}\n`;
        csv += `New Order SPK,${d.closingEstimation.newOrderSPK}\n`;
        csv += `Total Est Closing,${d.closingEstimation.totalEstClosing}\n\n`;

        csv += '--- TABEL 1: GAP FROM OS & MATCHING ---\n';
        csv += 'Model,Gap from OS,1 Minggu,2 Minggu,3 Minggu,4 Minggu,Total Match,Firmed,P.Loan,UNMATCH\n';
        t1.forEach(m => {
            csv += `"${m.model}",${m.gapOS},${m.w1},${m.w2},${m.w3},${m.w4},${m.totalMatch},${m.firmed},${m.pLoan},${m.unmatch}\n`;
        });
        csv += `"Grand Total",${grand1.gapOS},${grand1.w1},${grand1.w2},${grand1.w3},${grand1.w4},${grand1.totalMatch},${grand1.firmed},${grand1.pLoan},${grand1.unmatch}\n\n`;

        csv += '--- TABEL 2: SUPPLY, ALOKASI & FTS ---\n';
        csv += 'Model,Stock,MDP,2nd Allo,C/O,TTL Supply,DO Actual,Stock Matching,FTS,SPK,DO,Net FTS\n';
        t2.forEach(m => {
            csv += `"${m.model}",${m.stock},${m.mdp},${m.secondAllo},${m.co},${m.ttlSupply},${m.doActual},${m.stockMatching},${m.fts},${m.spk},${m.do},${m.netFts}\n`;
        });
        csv += `"Grand Total",${grand2.stock},${grand2.mdp},${grand2.secondAllo},${grand2.co},${grand2.ttlSupply},${grand2.doActual},${grand2.stockMatching},${grand2.fts},${grand2.spk},${grand2.do},${grand2.netFts}\n`;

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `AO_Whiteboard_Report_${d.reportDate.replace(/\s+/g, '_')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    window.AOReportData = {
        DEFAULT_AO_DATA,
        getAOData,
        fetchAODataLive,
        saveAOData,
        resetAOData,
        calculateTable1Totals,
        calculateTable2Totals,
        generateWAContent,
        exportToCSV
    };

})(window);
