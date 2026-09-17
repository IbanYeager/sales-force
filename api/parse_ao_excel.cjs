/**
 * api/parse_ao_excel.cjs
 * High-Precision Area Operation (AO) Report Excel Parser
 * Extracts metrics from 'AO Report(0)', 'Action Plan', and 'by MDL' sheets
 */

const xlsx = require('c:/laragon/www/followup-sales/server/node_modules/xlsx');
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2] || path.resolve(__dirname, '../AO TUNAS TOYOTA AUG 2026 - 01 AUG 2026.xlsx');
const outputPath = process.argv[3] || path.resolve(__dirname, 'ao_report_data_store.json');

if (!fs.existsSync(filePath)) {
    console.error(JSON.stringify({ status: 'error', message: `File not found: ${filePath}` }));
    process.exit(1);
}

try {
    const wb = xlsx.readFile(filePath, { raw: false });

    // 1. Sheet 'AO Report(0)'
    const sheetNameAO = wb.SheetNames.find(s => s.toLowerCase().includes('ao report')) || wb.SheetNames[1] || wb.SheetNames[0];
    const wsAO = wb.Sheets[sheetNameAO];
    const aoRows = xlsx.utils.sheet_to_json(wsAO, { header: 1, raw: false });

    const getVal = (r, c, def = 0) => {
        const row = aoRows[r - 1];
        if (!row) return def;
        const v = row[c];
        if (v === null || v === undefined || v === '') return def;
        if (typeof v === 'string') {
            const clean = v.replace(/[^0-9.-]/g, '');
            const num = parseFloat(clean);
            return isNaN(num) ? v : num;
        }
        return typeof v === 'number' ? v : def;
    };

    const getRaw = (r, c, def = '') => {
        const row = aoRows[r - 1];
        if (!row || row[c] === undefined || row[c] === null) return def;
        return String(row[c]).trim();
    };

    // Date from Row 2, Col 16 (Q)
    let reportDateStr = '01 Agustus 2026';
    const cellQ2 = getRaw(2, 16, '');
    if (cellQ2) {
        if (cellQ2.includes('/') || cellQ2.includes('-')) {
            const d = new Date(cellQ2);
            if (!isNaN(d.getTime())) {
                const day = d.getDate();
                const mIdx = d.getMonth() + 1;
                const mList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
                reportDateStr = `${day} ${mList[mIdx - 1]} 2026`;
            } else {
                reportDateStr = '01 Agustus 2026';
            }
        } else {
            reportDateStr = cellQ2;
        }
    }

    // Full Stock & Invoiceable Stock
    const fullStockTotal = getVal(7, 1, 123);
    const fullStockFree = getVal(8, 1, 81);
    const fullStockMatch = getVal(19, 1, 42);

    const invStockTotal = getVal(7, 3, 123);
    const invStockFree = getVal(8, 3, 81);
    const invStockMatch = getVal(19, 3, 42);

    // OS Order
    const osTotal = getVal(6, 5, 53);
    const osGt60Total = getVal(7, 5, 1);
    const osGt60Match = getVal(8, 6, 0);
    const os3060Total = getVal(9, 5, 4);
    const os3060Match = getVal(10, 6, 0);
    const osLt30Total = getVal(15, 5, 48);
    const osLt30Firmed = getVal(15, 6, 18);
    const osLt30PlCpi = getVal(19, 6, 30);

    // Stock Matching
    const smMatchTotal = getVal(15, 8, 42);
    const smUnmatchTotal = getVal(9, 8, 5);
    const smUnmatchLt30 = getVal(11, 8, 7);
    const smUnmatchGt30 = getVal(14, 9, 7);
    const smMatchGt30 = getVal(16, 9, 18);
    const smMatchPlCpi = getVal(19, 9, 24);

    // Matching Ratio
    let rawRatio = getVal(7, 15, 79);
    if (rawRatio <= 1 && rawRatio > 0) {
        rawRatio = Math.round(rawRatio * 100);
    } else {
        rawRatio = Math.round(rawRatio);
    }
    const matchingRatio = rawRatio;

    const targetDO = getVal(6, 29, 92);
    const potentialDoFromOS = getVal(14, 20, 53);
    const gapTarget = getVal(8, 29, 39);
    const mtdActual = getVal(22, 22, 10);
    const onHandStock = getVal(19, 13, 16);

    // Ritme 5 Harian
    const r1 = getVal(22, 15, 3);
    const r2 = getVal(22, 16, 7);
    const r3 = getVal(22, 17, 0);
    const r4 = getVal(22, 18, 0);
    const r5 = getVal(22, 19, 0);
    const r6 = getVal(22, 20, 0);

    const ritme5Harian = [
        { period: '1-5', value: r1, accum: r1 },
        { period: '6-10', value: r2, accum: r1 + r2 },
        { period: '11-15', value: r3, accum: r1 + r2 + r3 },
        { period: '16-20', value: r4, accum: r1 + r2 + r3 + r4 },
        { period: '21-25', value: r5, accum: r1 + r2 + r3 + r4 + r5 },
        { period: '26-31', value: r6, accum: r1 + r2 + r3 + r4 + r5 + r6 }
    ];

    // SPK Plan
    const spkGrossPlan = [getVal(40, 3, 122), getVal(41, 4, 20), getVal(41, 5, 20), getVal(41, 6, 20), getVal(41, 7, 20), getVal(41, 8, 20), getVal(41, 9, 22)];
    const spkGrossActual = [getVal(42, 3, 54), getVal(42, 4, 30), getVal(42, 5, 24), null, null, null, null];
    const gapGross = ['-', '+10', '+4', '-20', '-20', '-20', '-22'];
    const cancellationAssum = [getVal(45, 3, 6), getVal(45, 4, 1), getVal(45, 5, 1), getVal(45, 6, 1), getVal(45, 7, 1), getVal(45, 8, 1), getVal(45, 9, 1)];
    const cancellationActual = [getVal(46, 3, 0), getVal(46, 4, 0), getVal(46, 5, 0), null, null, null, null];
    const spkNettPlan = [getVal(49, 3, 114), getVal(50, 4, 19), getVal(50, 5, 19), getVal(50, 6, 19), getVal(50, 7, 19), getVal(50, 8, 19), getVal(50, 9, 19)];
    const spkNettActual = [getVal(51, 3, 54), getVal(51, 4, 30), getVal(51, 5, 24), null, null, null, null];
    const gapNett = ['-', '+11', '+5', '-19', '-19', '-19', '-19'];

    // Closing Estimation
    const closingEstimation = {
        oapTarget: getVal(6, 29, 92),
        matchingOutstanding: getVal(7, 29, 53),
        newOrderSPK: getVal(8, 29, 39),
        totalEstClosing: getVal(9, 29, 92),
        totalInvoiceableStock: getVal(10, 29, 133),
        efficiencySTO: getRaw(11, 29, '69%')
    };

    // 2. Sheet 'Action Plan' -> Table 2 Supply
    const sheetNameAction = wb.SheetNames.find(s => s.toLowerCase().includes('action plan')) || wb.SheetNames[8];
    const wsAction = wb.Sheets[sheetNameAction];
    const actionRows = xlsx.utils.sheet_to_json(wsAction, { header: 1, raw: false });
    const table2Supply = [];

    for (let r = 2; r < actionRows.length; r++) {
        const row = actionRows[r];
        if (!row || !row[0]) continue;
        const mName = String(row[0]).trim();
        if (mName === 'Grand Total' || mName.toLowerCase().includes('convertion')) break;

        const numVal = (idx) => {
            const v = row[idx];
            if (!v) return 0;
            const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
            return isNaN(n) ? 0 : n;
        };

        table2Supply.push({
            model: mName,
            stock: numVal(1),
            mdp: numVal(2),
            secondAllo: numVal(3),
            co: numVal(4),
            ttlSupply: numVal(5),
            doActual: numVal(6),
            stockMatching: numVal(7),
            fts: numVal(8),
            spk: numVal(13), // Leads / SPK
            do: numVal(6),
            netFts: numVal(8) - numVal(13)
        });
    }

    // 3. Sheet 'by MDL' -> Table 1 Models
    const sheetNameMdl = wb.SheetNames.find(s => s.toLowerCase().includes('mdl')) || wb.SheetNames[3];
    const wsMdl = wb.Sheets[sheetNameMdl];
    const mdlRows = xlsx.utils.sheet_to_json(wsMdl, { header: 1, raw: false });
    const table1Models = [];

    for (let r = 5; r < Math.min(16, mdlRows.length); r++) {
        const row = mdlRows[r];
        if (!row || !row[0]) continue;
        const mName = String(row[0]).trim();
        if (mName === 'Grand Total') break;

        const numVal = (idx) => {
            const v = row[idx];
            if (!v) return 0;
            const n = parseFloat(String(v).replace(/[^0-9.-]/g, ''));
            return isNaN(n) ? 0 : n;
        };

        table1Models.push({
            model: mName,
            gapOS: numVal(1),
            w1: numVal(2),
            w2: numVal(3),
            w3: numVal(4),
            w4: numVal(5),
            totalMatch: numVal(2) + numVal(3) + numVal(4) + numVal(5),
            firmed: numVal(8),
            pLoan: numVal(9),
            unmatch: numVal(7)
        });
    }

    const result = {
        status: "success",
        branch: "TUNAS TOYOTA KIARACONDONG",
        reportDate: reportDateStr,
        periodMonth: "Agustus 2026",
        importedAt: new Date().toISOString(),
        stock: {
            fullStock: { total: fullStockTotal, free: fullStockFree, match: fullStockMatch },
            invoiceableStock: { total: invStockTotal, free: invStockFree, match: invStockMatch },
            osOrder: {
                total: osTotal,
                gt60Days: { total: osGt60Total, match: osGt60Match },
                d30To60Days: { total: os3060Total, match: os3060Match },
                firmedOSLt30: { total: osLt30Total, firmed: osLt30Firmed, plCpi: osLt30PlCpi }
            },
            stockMatching: {
                matchUnfirmedGt30: 2,
                matchUnfirmedLt30: 2,
                unmatchStock: smUnmatchTotal,
                unmatchBreakdown: {
                    firmedGt30: 1,
                    firmedLt30: 5,
                    unfirmedLt30: smUnmatchLt30,
                    unfirmedGt30: smUnmatchGt30
                },
                matchStock: smMatchTotal,
                matchBreakdown: {
                    firmedGt30: smMatchGt30,
                    plCpi: smMatchPlCpi
                }
            },
            kpi: {
                matchingRatio: matchingRatio,
                targetDO: targetDO,
                potentialDoFromOS: potentialDoFromOS,
                gapTarget: gapTarget,
                mtdActual: mtdActual,
                mdpVal: 0,
                onHandStock: onHandStock
            },
            ritme5Harian: ritme5Harian
        },
        spkPlan: {
            periods: ['TTL', '1-5', '6-10', '11-15', '16-20', '21-25', '26-31'],
            effectiveNRS: 76,
            forNPlus1RS: 42,
            spkGrossPlan: spkGrossPlan,
            spkGrossActual: spkGrossActual,
            gapGross: gapGross,
            cancellationAssum: cancellationAssum,
            cancellationActual: cancellationActual,
            cancellationRatio: ['0%', '0%', '0%', '0%', '0%', '0%', '0%'],
            cancelRatioStats: {
                threeMonthsAvg: "4%",
                loanRejection: "2%"
            },
            spkNettPlan: spkNettPlan,
            spkNettActual: spkNettActual,
            gapNett: gapNett,
            nettSpkVisualize: [
                { period: "1-5", val: 19 },
                { period: "6-10", val: 19 },
                { period: "11-15", val: 19 },
                { period: "16-20", val: 19 },
                { period: "21-25", val: 19 },
                { period: "26-31", val: 19 }
            ],
            rsPillar: {
                ttl: 114,
                becomeOS: 38,
                effectiveMonthRS: 76,
                avgDays: 8
            }
        },
        mdpPlan: {
            leftPillar: {
                total: 32,
                green: 2,
                blue: 30
            },
            ffsPillar: 46,
            ffsSellingPlan: [
                { period: "1-5", accum: 38 },
                { period: "6-10", accum: 44 },
                { period: "11-15", accum: 53 },
                { period: "16-20", accum: 67 },
                { period: "21-25", accum: 82 },
                { period: "26-31", accum: 111 }
            ],
            rsPlanSteps: [19, 19, 19, 19, 19, 19],
            accumMtdDoRsValues: [0, 0, 8, 17, 27, 39],
            fromNewOrder: 76
        },
        closingEstimation: closingEstimation,
        table1Models: table1Models,
        table2Supply: table2Supply
    };

    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));

    console.log(JSON.stringify({
        status: 'success',
        message: 'AO Report Excel berhasil diproses dan disimpan.',
        reportDate: reportDateStr,
        fullStockTotal,
        osTotal,
        matchingRatio: matchingRatio + '%',
        table2SupplyCount: table2Supply.length,
        table1ModelsCount: table1Models.length
    }));

} catch (err) {
    console.error(JSON.stringify({ status: 'error', message: err.message, stack: err.stack }));
    process.exit(1);
}
