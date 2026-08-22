const xlsx = require('c:/laragon/www/followup-sales/server/node_modules/xlsx');
const fs = require('fs');

const filePath = process.argv[2];
if (!filePath) {
    console.log(JSON.stringify({ success: false, message: 'File path missing' }));
    process.exit(1);
}

try {
    const buf = fs.readFileSync(filePath);
    const wbMeta = xlsx.read(buf, { type: 'buffer', bookSheets: true });
    const sheetNames = wbMeta.SheetNames || [];

    let targetSheet = sheetNames.find(s => /attack\s*list|database|customer|data\s*repurchase|pelanggan/i.test(s));
    if (!targetSheet) {
        targetSheet = sheetNames.find(s => !/petunjuk|summary|competition|cluster$/i.test(s)) || sheetNames[0];
    }

    const wb = xlsx.read(buf, { type: 'buffer', sheets: [targetSheet], dense: true, cellDates: true });
    const ws = wb.Sheets[targetSheet];
    const rawRows = xlsx.utils.sheet_to_json(ws, { header: 1, defval: '' });

    if (!rawRows || rawRows.length === 0) {
        console.log(JSON.stringify({ success: true, sheet: targetSheet, data: [] }));
        process.exit(0);
    }

    // Locate header row in first 10 rows
    let headerRowIdx = 0;
    let maxMatch = 0;
    const keywords = ['nama', 'customer', 'telepon', 'phone', 'wa', 'mobil', 'model', 'vin', 'cluster_name', 'priority', 'salesman'];

    for (let r = 0; r < Math.min(10, rawRows.length); r++) {
        let matches = 0;
        if (Array.isArray(rawRows[r])) {
            for (const cell of rawRows[r]) {
                const s = String(cell || '').trim().toLowerCase();
                if (keywords.some(k => s === k || s.includes(k))) matches++;
            }
        }
        if (matches > maxMatch) {
            maxMatch = matches;
            headerRowIdx = r;
        }
    }

    const colMap = {};
    (rawRows[headerRowIdx] || []).forEach((c, idx) => {
        if (c !== undefined && c !== null) {
            const key = String(c).trim().toLowerCase();
            if (key && colMap[key] === undefined) colMap[key] = idx;
        }
    });

    const getVal = (row, keys) => {
        for (const k of keys) {
            const lk = k.toLowerCase();
            if (colMap[lk] !== undefined) {
                const v = row[colMap[lk]];
                if (v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== 'NO DATA') return String(v).trim();
            }
            for (const [colK, colIdx] of Object.entries(colMap)) {
                if (colK.includes(lk) || lk.includes(colK)) {
                    const v = row[colIdx];
                    if (v !== undefined && v !== null && String(v).trim() !== '' && String(v).trim() !== 'NO DATA') return String(v).trim();
                }
            }
        }
        return '';
    };

    const customers = [];
    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || !Array.isArray(row)) continue;

        const name = getVal(row, ['nama_customer', 'nama', 'customer', 'customer name', 'nama pelanggan']);
        const phoneRaw = getVal(row, ['no_telepon_customer', 'no_telepon', 'no wa', 'no whatsapp', 'no hp', 'telepon', 'phone', 'wa']);
        if (!name && !phoneRaw) continue;

        const currentCar = getVal(row, ['model_kendaraan_terakhir', 'model_kendaraan', 'tipe mobil', 'model mobil', 'mobil', 'unit']);
        const recCar = getVal(row, ['1. model', 'model rekomendasi', 'rekomendasi model']);
        const altCar2 = getVal(row, ['2. model', 'model alternatif 2']);
        const altCar3 = getVal(row, ['3. model', 'model alternatif 3']);
        const cluster = getVal(row, ['cluster_name', 'cluster', 'klaster']);
        const priority = getVal(row, ['priority', 'prioritas', 'md priority']);
        const district = getVal(row, ['alamat_kecamatan', 'kecamatan', 'wilayah', 'alamat']);
        const compliance = getVal(row, ['kepatuhan_service', 'service compliance']);
        const salesman = getVal(row, ['salesman', 'sales', 'nama sales', 'wiraniaga']);
        const plate = getVal(row, ['no polisi', 'plat nomor', 'nopol', 'license plate']);
        const vin = getVal(row, ['vin_kendaraan_terakhir', 'vin', 'no rangka']);
        const remarks = getVal(row, ['remarks', 'catatan', 'notes']);

        let carModel = (currentCar && currentCar !== 'NO DATA' && !currentCar.startsWith('JTF') && !currentCar.startsWith('MHF'))
            ? currentCar
            : (recCar ? `${recCar} (Target Repurchase)` : 'Toyota Unit');

        let cat = (cluster || recCar) ? `Trade-in / Repurchase ${recCar ? `(${recCar})` : ''}`.trim() : 'Servis Berkala';

        let carAge = getVal(row, ['usia_kendaraan_terakhir', 'umur kendaraan', 'usia kendaraan', 'tahun kendaraan']);
        if (carAge && !isNaN(Number(carAge))) {
            const num = Number(carAge);
            carAge = num > 1900 ? `${num}` : `${Math.round(num * 10) / 10} Tahun`;
        }

        customers.push({
            name: name || 'Customer Toyota',
            phone: phoneRaw,
            car_model: carModel,
            last_car_model: currentCar !== 'NO DATA' ? currentCar : '',
            car_age: carAge,
            recommended_model: recCar,
            alt_model_2: altCar2,
            alt_model_3: altCar3,
            cluster_name: cluster,
            priority: priority,
            district: district,
            service_compliance: compliance,
            assigned_sales_name: salesman,
            plate_number: plate,
            vin: vin,
            purchase_date: getVal(row, ['tgl beli', 'tanggal beli', 'purchase date']),
            service_due_date: getVal(row, ['tgl servis', 'estimasi servis', 'service due']),
            stnk_due_date: getVal(row, ['tgl stnk', 'pajak stnk', 'stnk due']),
            followup_category: cat,
            followup_status: 'Belum Dihubungi',
            notes: remarks
        });
    }

    console.log(JSON.stringify({ success: true, sheet: targetSheet, data: customers }));
} catch (e) {
    console.log(JSON.stringify({ success: false, message: e.message }));
}