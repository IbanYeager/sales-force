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

    let headerRowIdx = 0;
    let maxMatch = 0;
    const keywords = ['nama', 'customer', 'telepon', 'phone', 'wa', 'mobil', 'model', 'vin', 'cluster', 'priority'];

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

    const headers = (rawRows[headerRowIdx] || []).map((h, i) => {
        let clean = String(h || '').trim().toLowerCase().replace(/[\r\n\t]+/g, ' ');
        return clean || ('col_' + i);
    });

    const findColIdx = (patterns) => {
        for (const pat of patterns) {
            const idx = headers.findIndex(h => pat.test(h));
            if (idx !== -1) return idx;
        }
        return -1;
    };

    const nameIdx = findColIdx([/^nama customer/, /^nama_customer/, /^nama by single vin/, /^nama/, /customer/, /pelanggan/]);
    const phoneIdx = findColIdx([/contact person 1/, /contact person/, /no_telepon_customer/, /no wa/, /telepon/, /phone/, /no_hp/, /hp/]);
    const phone2Idx = findColIdx([/contact person 2/]);
    const lastCarIdx = findColIdx([/model_kendaraan_terakhir/, /latest_model/, /mobil.*saat ini/, /unit.*saat ini/, /tipe.*lama/]);
    const rec1Idx = findColIdx([/1\.\s*model/, /alternative_recommendation_model_1/, /target.*repurchase/]);
    const rec2Idx = findColIdx([/2\.\s*model/, /alternative_recommendation_model_2/]);
    const rec3Idx = findColIdx([/3\.\s*model/, /alternative_recommendation_model_3/]);
    const ageIdx = findColIdx([/usia_kendaraan_terakhir/, /vehicle age/, /usia.*kendaraan/, /usia/, /tahun/]);
    const clusterIdx = findColIdx([/cluster_name/, /cluster/, /klaster/]);
    const priorityIdx = findColIdx([/priority/, /prioritas/]);
    const distIdx = findColIdx([/alamat_kecamatan/, /kecamatan/, /wilayah/, /domisili/]);
    const vinIdx = findColIdx([/vin_kendaraan_terakhir/, /latest_vin/, /vin/, /rangka/]);
    const custTypeIdx = findColIdx([/fleet_or_retail/, /cust\.\s*type/, /tipe.*customer/]);
    const doOutletIdx = findColIdx([/nama_outlet_do/, /do_oleh_tunas/, /outlet.*do/]);
    const srvOutletIdx = findColIdx([/nama_outlet_service/, /service_di_tunas/]);
    const srvComplianceIdx = findColIdx([/kepatuhan_service/, /rasio_kepatuhan_service/]);
    const tempIdx = findColIdx([/1\.\s*temperatur/, /veloz_hybrid_temperature/, /temperatur/]);

    const results = [];
    for (let r = headerRowIdx + 1; r < rawRows.length; r++) {
        const row = rawRows[r];
        if (!row || row.length === 0) continue;

        let name = nameIdx !== -1 ? String(row[nameIdx] || '').trim() : '';
        let phone = phoneIdx !== -1 ? String(row[phoneIdx] || '').trim() : '';
        if (!phone && phone2Idx !== -1) phone = String(row[phone2Idx] || '').trim();

        // Clean phone
        phone = phone.replace(/[^0-9]/g, '');
        if (phone.startsWith('0')) phone = '62' + phone.substring(1);
        else if (phone.startsWith('8')) phone = '62' + phone;

        if (!name || name === '-' || !phone) continue;

        let lastCar = lastCarIdx !== -1 ? String(row[lastCarIdx] || '').trim() : '';
        if (lastCar === 'NO DATA' || lastCar === '-') lastCar = '';

        let rec1 = rec1Idx !== -1 ? String(row[rec1Idx] || '').trim() : '';
        if (rec1 === 'NO DATA' || rec1 === '-') rec1 = '';

        let rec2 = rec2Idx !== -1 ? String(row[rec2Idx] || '').trim() : '';
        if (rec2 === 'NO DATA' || rec2 === '-') rec2 = '';

        let rec3 = rec3Idx !== -1 ? String(row[rec3Idx] || '').trim() : '';
        if (rec3 === 'NO DATA' || rec3 === '-') rec3 = '';

        let age = ageIdx !== -1 ? String(row[ageIdx] || '').trim() : '';
        if (age === 'NO DATA' || age === '-') age = '';
        if (age && !isNaN(Number(age))) age = Number(age).toFixed(1) + ' Tahun';

        let cluster = clusterIdx !== -1 ? String(row[clusterIdx] || '').trim() : '';
        let priority = priorityIdx !== -1 ? String(row[priorityIdx] || '').trim() : '';
        let district = distIdx !== -1 ? String(row[distIdx] || '').trim() : '';
        if (district === 'NO DATA' || district === '-') district = '';

        let vin = vinIdx !== -1 ? String(row[vinIdx] || '').trim() : '';
        let custType = custTypeIdx !== -1 ? String(row[custTypeIdx] || '').trim() : 'RETAIL';
        let outletDo = doOutletIdx !== -1 ? String(row[doOutletIdx] || '').trim() : '';
        let outletSrv = srvOutletIdx !== -1 ? String(row[srvOutletIdx] || '').trim() : '';
        let srvComp = srvComplianceIdx !== -1 ? String(row[srvComplianceIdx] || '').trim() : '';
        let temp = tempIdx !== -1 ? String(row[tempIdx] || '').trim() : '';

        let targetCar = rec1 || lastCar || 'Toyota Unit';

        results.push({
            name,
            phone,
            car_model: targetCar,
            last_car_model: lastCar,
            car_age: age,
            recommended_model: targetCar,
            alt_model_2: rec2,
            alt_model_3: rec3,
            cluster_name: cluster,
            priority: priority,
            district: district,
            plate_number: '',
            vin: vin,
            customer_type: custType,
            outlet_do: outletDo,
            outlet_service: outletSrv,
            service_compliance: srvComp,
            temperature: temp,
            followup_category: 'Trade-in / Repurchase (' + targetCar + ')'
        });
    }

    console.log(JSON.stringify({ success: true, sheet: targetSheet, data: results }));
} catch (err) {
    console.log(JSON.stringify({ success: false, message: err.message }));
}