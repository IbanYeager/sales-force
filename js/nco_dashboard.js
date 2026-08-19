/**
 * NCO (Nett Cost of Ownership) & Car Comparison Dashboard
 * Data source: Google Spreadsheet (Dashboard & Comparison sheets)
 * Spreadsheet ID: 1-3SG3pAHCIptCXw4_ElzjIF8DBwFYJwbTsrKqWqWTRY
 */

const NCO_DATA = {
    // Data Usage Default
    defaults: {
        years: 4,
        dailyKm: 100
    },

    // Model Toyota (HEV & Gasoline)
    toyota: [
        {
            id: 'innova_zenix_v_hev',
            name: 'INNOVA ZENIX V HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.987 cc (2.0L)',
            otr: 552800000,
            maintPerYear: 500000,
            maint3Year: 12000000,
            taxPerYear: 10000000,
            fuelConsumption: 20, // km/L
            fuelCostPerLitre: 12300,
            resaleValues: [497520000, 480936000, 464352000, 447768000, 436712000],
            depreciationPercentages: [10, 13, 16, 19, 21],
            leasingRatesPerYear: 110560000,
            leasingRate4Year: 88448000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'corolla_cross_hev',
            name: 'COROLLA CROSS HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.798 cc (1.8L)',
            otr: 610100000,
            maintPerYear: 500000,
            maint3Year: 10000000,
            taxPerYear: 9000000,
            fuelConsumption: 24, // km/L
            fuelCostPerLitre: 12300,
            resaleValues: [524686000, 494181000, 463676000, 433171000, 402666000],
            depreciationPercentages: [14, 19, 24, 29, 34],
            leasingRatesPerYear: 122020000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'corolla_altis_hev',
            name: 'COROLLA ALTIS HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.798 cc (1.8L)',
            otr: 641400000,
            maintPerYear: 500000,
            maint3Year: 9500000,
            taxPerYear: 10000000,
            fuelConsumption: 24,
            fuelCostPerLitre: 12300,
            resaleValues: [551604000, 519534000, 487464000, 455394000, 423324000],
            depreciationPercentages: [14, 19, 24, 29, 34],
            leasingRatesPerYear: 128280000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'camry_hev',
            name: 'CAMRY HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '2.487 cc (2.5L)',
            otr: 983000000,
            maintPerYear: 500000,
            maint3Year: 10500000,
            taxPerYear: 10000000,
            fuelConsumption: 21,
            fuelCostPerLitre: 12300,
            resaleValues: [855210000, 806060000, 756910000, 707760000, 658610000],
            depreciationPercentages: [13, 18, 23, 28, 33],
            leasingRatesPerYear: 196600000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'alphard_hev',
            name: 'ALPHARD HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '2.487 cc (2.5L)',
            otr: 1737400000,
            maintPerYear: 500000,
            maint3Year: 14000000,
            taxPerYear: 27000000,
            fuelConsumption: 17,
            fuelCostPerLitre: 12300,
            resaleValues: [1528912000, 1442042000, 1355172000, 1268302000, 1181432000],
            depreciationPercentages: [12, 17, 22, 27, 32],
            leasingRatesPerYear: 347480000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'yaris_cross_hev',
            name: 'YARIS CROSS HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.496 cc (1.5L)',
            otr: 451700000,
            maintPerYear: 500000,
            maint3Year: 10000000,
            taxPerYear: 7000000,
            fuelConsumption: 24,
            fuelCostPerLitre: 12300,
            resaleValues: [406530000, 392979000, 379428000, 365877000, 356843000],
            depreciationPercentages: [10, 13, 16, 19, 21],
            leasingRatesPerYear: 90340000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'new_agya_gr',
            name: 'NEW AGYA GR',
            type: 'GASOLINE',
            powerSource: 'Engine',
            engineCap: '1.200 cc (1.2L)',
            otr: 201300000,
            maintPerYear: 500000,
            maint3Year: 9000000,
            taxPerYear: 3000000,
            fuelConsumption: 21,
            fuelCostPerLitre: 12300,
            resaleValues: [177144000, 171105000, 165066000, 159027000, 152988000],
            depreciationPercentages: [12, 15, 18, 21, 24],
            leasingRatesPerYear: 40260000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km'
        },
        {
            id: 'new_veloz_q_hev',
            name: 'NEW VELOZ Q HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.496 cc (1.5L)',
            otr: 325000000,
            maintPerYear: 500000,
            maint3Year: 10000000,
            taxPerYear: 5700000,
            fuelConsumption: 22,
            fuelCostPerLitre: 12300,
            resaleValues: [292500000, 282750000, 273000000, 263250000, 256750000],
            depreciationPercentages: [10, 13, 16, 19, 21],
            leasingRatesPerYear: 65000000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'alphard_xe_hv',
            name: 'ALPHARD XE HV',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '2.498 cc (2.5L)',
            otr: 1388000000,
            maintPerYear: 500000,
            maint3Year: 14000000,
            taxPerYear: 22617000,
            fuelConsumption: 29,
            fuelCostPerLitre: 12300,
            resaleValues: [1179800000, 1068760000, 985480000, 916080000, 874440000],
            depreciationPercentages: [15, 23, 29, 34, 37],
            leasingRatesPerYear: 277600000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'vios_hv',
            name: 'VIOS HV',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.496 cc (1.5L)',
            otr: 460000000,
            maintPerYear: 500000,
            maint3Year: 10000000,
            taxPerYear: 7000000,
            fuelConsumption: 17,
            fuelCostPerLitre: 12300,
            resaleValues: [404800000, 372600000, 345000000, 326600000, 308200000],
            depreciationPercentages: [12, 19, 25, 29, 33],
            leasingRatesPerYear: 92000000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'new_veloz_v_hev',
            name: 'NEW VELOZ V HYBRID',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            engineCap: '1.496 cc (1.5L)',
            otr: 389000000,
            maintPerYear: 500000,
            maint3Year: 10000000,
            taxPerYear: 4931000,
            fuelConsumption: 22,
            fuelCostPerLitre: 12300,
            resaleValues: [350100000, 338430000, 326760000, 315090000, 307310000],
            depreciationPercentages: [10, 13, 16, 19, 21],
            leasingRatesPerYear: 77800000,
            ownRisk: 3000000,
            warranty: '3 Years / 100.000 Km and 8 Years / 160.000 Km For Battery'
        }
    ],

    // Model Non-Toyota (BEV, HEV, Gasoline)
    nonToyota: [
        {
            id: 'chery_omoda_e5',
            name: 'CHERY OMODA E5',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 360,
            otr: 427400000,
            maintPerYear: 500000,
            maint3Year: 11500000,
            taxPerYear: 143000, // BEV Tax
            chargingCostPerFullCharge: 175000,
            chargingDistanceKm: 360,
            resaleValues: [363290000, 299180000, 235070000, 205152000, 192330000],
            depreciationPercentages: [15, 30, 45, 52, 55],
            leasingRatesPerYear: 85480000,
            leasingRate4Year: 68384000,
            ownRisk: 3000000,
            warranty: '6 Years / 160.000 Km dan 8 Years / 180.000 Km For Battery'
        },
        {
            id: 'byd_m6_dmi_cross',
            name: 'BYD M6 DM-I CROSS',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 480,
            otr: 399900000,
            maintPerYear: 500000,
            maint3Year: 16000000,
            taxPerYear: 143000,
            chargingCostPerFullCharge: 140000,
            chargingDistanceKm: 480,
            resaleValues: [319920000, 279930000, 239940000, 199950000, 159960000],
            depreciationPercentages: [20, 30, 40, 50, 60],
            leasingRatesPerYear: 79980000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'denza_d9_advance',
            name: 'DENZA D9 ADVANCE',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 500,
            otr: 983000000,
            maintPerYear: 500000,
            maint3Year: 19000000,
            taxPerYear: 22000000,
            chargingCostPerFullCharge: 254000,
            chargingDistanceKm: 500,
            resaleValues: [806060000, 688100000, 589800000, 491500000, 412860000],
            depreciationPercentages: [18, 30, 40, 50, 58],
            leasingRatesPerYear: 196600000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'byd_atto_3',
            name: 'BYD ATTO 3 ADVANCE+',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 480,
            otr: 439500000,
            maintPerYear: 500000,
            maint3Year: 10600000,
            taxPerYear: 273000,
            chargingCostPerFullCharge: 175000,
            chargingDistanceKm: 480,
            resaleValues: [373575000, 316440000, 263700000, 210960000, 175800000],
            depreciationPercentages: [15, 28, 40, 52, 60],
            leasingRatesPerYear: 87900000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'byd_dolphin',
            name: 'BYD DOLPHIN',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 490,
            otr: 445000000,
            maintPerYear: 500000,
            maint3Year: 11000000,
            taxPerYear: 143000,
            chargingCostPerFullCharge: 150000,
            chargingDistanceKm: 490,
            resaleValues: [378250000, 320400000, 267000000, 213600000, 178000000],
            depreciationPercentages: [15, 28, 40, 52, 60],
            leasingRatesPerYear: 89000000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'byd_seal',
            name: 'BYD SEAL',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 520,
            otr: 772000000,
            maintPerYear: 500000,
            maint3Year: 17500000,
            taxPerYear: 143000,
            chargingCostPerFullCharge: 230000,
            chargingDistanceKm: 520,
            resaleValues: [648480000, 555840000, 440040000, 324240000, 270200000],
            depreciationPercentages: [16, 28, 43, 58, 65],
            leasingRatesPerYear: 154400000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'byd_sealion_7',
            name: 'BYD SEALION 7',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 540,
            otr: 737000000,
            maintPerYear: 500000,
            maint3Year: 16000000,
            taxPerYear: 143000,
            chargingCostPerFullCharge: 250000,
            chargingDistanceKm: 540,
            resaleValues: [589600000, 515900000, 442200000, 368500000, 331650000],
            depreciationPercentages: [20, 30, 40, 50, 55],
            leasingRatesPerYear: 147400000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'hyundai_kona_prime_long',
            name: 'HYUNDAI KONA Prime Long',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 430,
            otr: 635000000,
            maintPerYear: 500000,
            maint3Year: 11000000,
            taxPerYear: 143000,
            chargingCostPerFullCharge: 173000,
            chargingDistanceKm: 430,
            resaleValues: [558800000, 476250000, 412750000, 349250000, 285750000],
            depreciationPercentages: [12, 25, 35, 45, 55],
            leasingRatesPerYear: 127000000,
            ownRisk: 3000000,
            warranty: '4 Years / 100.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'byd_atto_1',
            name: 'BYD ATTO 1',
            type: 'BEV',
            powerSource: 'Electric Motor',
            oneChargeMileage: 300,
            otr: 230500000,
            maintPerYear: 500000,
            maint3Year: 8000000,
            taxPerYear: 5000000,
            chargingCostPerFullCharge: 140000,
            chargingDistanceKm: 300,
            resaleValues: [195925000, 165960000, 138300000, 115250000, 92200000],
            depreciationPercentages: [15, 28, 40, 50, 60],
            leasingRatesPerYear: 46100000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'wuling_darion_phev',
            name: 'WULING DARION PHEV CE',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            otr: 452000000,
            maintPerYear: 500000,
            maint3Year: 8000000,
            taxPerYear: 3600000,
            fuelConsumption: 21,
            fuelCostPerLitre: 12300,
            resaleValues: [361600000, 316400000, 271200000, 226000000, 203400000],
            depreciationPercentages: [20, 30, 40, 50, 55],
            leasingRatesPerYear: 90400000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'chery_tiggo_8_comfort',
            name: 'CHERY TIGGO 8 COMFORT',
            type: 'GASOLINE',
            powerSource: 'Engine',
            otr: 367500000,
            maintPerYear: 500000,
            maint3Year: 12000000,
            taxPerYear: 4800000,
            fuelConsumption: 12,
            fuelCostPerLitre: 12300,
            resaleValues: [312375000, 264600000, 227850000, 191100000, 165375000],
            depreciationPercentages: [15, 28, 38, 48, 55],
            leasingRatesPerYear: 73500000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        },
        {
            id: 'chery_tiggo_8_csh',
            name: 'CHERY TIGGO 8 CSH COMFORT',
            type: 'HEV',
            powerSource: 'Intern. Comb Engine + Electric Motor',
            otr: 457400000,
            maintPerYear: 500000,
            maint3Year: 16000000,
            taxPerYear: 6500000,
            fuelConsumption: 28,
            fuelCostPerLitre: 12300,
            resaleValues: [375068000, 311032000, 265292000, 219552000, 182960000],
            depreciationPercentages: [18, 32, 42, 52, 60],
            leasingRatesPerYear: 91480000,
            ownRisk: 3000000,
            warranty: '6 Years / 150.000 Km dan 8 Years / 160.000 Km For Battery'
        }
    ]
};

// Formatting utilities
function formatNcoRupiah(val) {
    if (isNaN(val) || val === null || val === undefined) return 'Rp 0';
    return 'Rp ' + Math.round(val).toLocaleString('id-ID');
}

function formatNcoNumber(val) {
    if (isNaN(val) || val === null || val === undefined) return '0';
    return Math.round(val).toLocaleString('id-ID');
}

// Calculation Engine for a car model over specified years and daily km
function calculateCarNCO(car, years, dailyKm) {
    const totalDays = years * 365;
    const totalKm = dailyKm * totalDays;

    const otr = car.otr;

    // Maintenance cost calculation: proportional to years using 3-year baseline or annual cost
    let maintenanceCost = 0;
    if (car.maint3Year) {
        maintenanceCost = (car.maint3Year / 3) * years;
    } else {
        maintenanceCost = (car.maintPerYear || 500000) * years;
    }

    // Tax calculation
    const taxCost = (car.taxPerYear || 0) * years;

    // Fuel or Charging cost calculation
    let fuelOrChargeCost = 0;
    if (car.type === 'BEV' && car.chargingCostPerFullCharge && car.chargingDistanceKm) {
        fuelOrChargeCost = (totalKm / car.chargingDistanceKm) * car.chargingCostPerFullCharge;
    } else if (car.fuelConsumption && car.fuelCostPerLitre) {
        fuelOrChargeCost = (totalKm / car.fuelConsumption) * car.fuelCostPerLitre;
    } else {
        // Default fallback if unspecified
        fuelOrChargeCost = (totalKm / 20) * 12300;
    }

    // Leasing rate (20% of OTR or car specified rate)
    let leasingCost = car.leasingRate4Year ? (car.leasingRate4Year / 4) * years : (car.leasingRatesPerYear ? car.leasingRatesPerYear * (years / 5) : otr * 0.20 * (years / 4));

    // Own risk (body repair cost)
    const ownRiskCost = car.ownRisk || 3000000;

    // Cost of Ownership Experience (COE)
    const coe = otr + maintenanceCost + taxCost + fuelOrChargeCost + leasingCost + ownRiskCost;

    // Resale Value & Depreciation Percentage at year N (1-indexed index = years - 1)
    const yearIdx = Math.min(Math.max(1, years), 5) - 1;
    const resaleValue = car.resaleValues[yearIdx] || car.resaleValues[car.resaleValues.length - 1];
    
    // Calculate actual depreciation %
    const depreciationPct = Math.round(((otr - resaleValue) / otr) * 100);

    // Nett Cost of Ownership (NCO)
    const ncoTotal = coe - resaleValue;
    const ncoYear = ncoTotal / years;
    const ncoMonth = ncoYear / 12;
    const ncoDay = ncoTotal / totalDays;

    return {
        car,
        years,
        dailyKm,
        totalKm,
        totalDays,
        otr,
        maintenanceCost,
        taxCost,
        fuelOrChargeCost,
        leasingCost,
        ownRiskCost,
        coe,
        resaleValue,
        depreciationPct,
        ncoTotal,
        ncoYear,
        ncoMonth,
        ncoDay
    };
}

// Controller & DOM Binding
document.addEventListener('DOMContentLoaded', () => {
    initNcoDashboard();
});

function initNcoDashboard() {
    const toyotaSelect = document.getElementById('ncoToyotaSelect');
    const nonToyotaSelect = document.getElementById('ncoNonToyotaSelect');
    const yearsSlider = document.getElementById('ncoYearsSlider');
    const yearsValue = document.getElementById('ncoYearsValue');
    const dailyKmSlider = document.getElementById('ncoDailyKmSlider');
    const dailyKmValue = document.getElementById('ncoDailyKmValue');

    if (!toyotaSelect || !nonToyotaSelect) return;

    // Populate dropdowns
    toyotaSelect.innerHTML = NCO_DATA.toyota.map(c => 
        `<option value="${c.id}">${c.name} (${c.type}) - ${formatNcoRupiah(c.otr)}</option>`
    ).join('');

    nonToyotaSelect.innerHTML = NCO_DATA.nonToyota.map(c => 
        `<option value="${c.id}">${c.name} (${c.type}) - ${formatNcoRupiah(c.otr)}</option>`
    ).join('');

    // Default selections matching spreadsheet dashboard (Innova Zenix V Hybrid vs Chery Omoda E5)
    toyotaSelect.value = 'innova_zenix_v_hev';
    nonToyotaSelect.value = 'chery_omoda_e5';

    // Event listeners for inputs
    toyotaSelect.addEventListener('change', updateNcoCalculation);
    nonToyotaSelect.addEventListener('change', updateNcoCalculation);

    if (yearsSlider) {
        yearsSlider.addEventListener('input', (e) => {
            if (yearsValue) yearsValue.textContent = e.target.value + ' Tahun';
            updateNcoCalculation();
        });
    }

    if (dailyKmSlider) {
        dailyKmSlider.addEventListener('input', (e) => {
            if (dailyKmValue) dailyKmValue.textContent = e.target.value + ' KM/Hari';
            updateNcoCalculation();
        });
    }

    // Initial update
    updateNcoCalculation();

    // Render comparison tables
    renderNcoComparisonTables();
}

function updateNcoCalculation() {
    const toyotaSelect = document.getElementById('ncoToyotaSelect');
    const nonToyotaSelect = document.getElementById('ncoNonToyotaSelect');
    const yearsSlider = document.getElementById('ncoYearsSlider');
    const dailyKmSlider = document.getElementById('ncoDailyKmSlider');

    if (!toyotaSelect || !nonToyotaSelect) return;

    const toyotaId = toyotaSelect.value;
    const nonToyotaId = nonToyotaSelect.value;
    const years = parseInt(yearsSlider ? yearsSlider.value : 4);
    const dailyKm = parseInt(dailyKmSlider ? dailyKmSlider.value : 100);

    const toyotaCar = NCO_DATA.toyota.find(c => c.id === toyotaId) || NCO_DATA.toyota[0];
    const nonToyotaCar = NCO_DATA.nonToyota.find(c => c.id === nonToyotaId) || NCO_DATA.nonToyota[0];

    const tRes = calculateCarNCO(toyotaCar, years, dailyKm);
    const ntRes = calculateCarNCO(nonToyotaCar, years, dailyKm);

    // Update Toyota Column UI
    setText('ncoToyName', tRes.car.name);
    setText('ncoToyType', tRes.car.type);
    setText('ncoToyPower', tRes.car.powerSource);
    setText('ncoToyOtr', formatNcoRupiah(tRes.otr));
    setText('ncoToyMaint', formatNcoRupiah(tRes.maintenanceCost));
    setText('ncoToyTax', formatNcoRupiah(tRes.taxCost));
    setText('ncoToyFuel', formatNcoRupiah(tRes.fuelOrChargeCost));
    setText('ncoToyLeasing', formatNcoRupiah(tRes.leasingCost));
    setText('ncoToyOwnRisk', formatNcoRupiah(tRes.ownRiskCost));
    setText('ncoToyCoe', formatNcoRupiah(tRes.coe));
    setText('ncoToyResale', formatNcoRupiah(tRes.resaleValue));
    setText('ncoToyDeprPct', `-${tRes.depreciationPct}% (Sisa Value: ${100 - tRes.depreciationPct}%)`);
    setText('ncoToyNcoTotal', formatNcoRupiah(tRes.ncoTotal));
    setText('ncoToyNcoYear', formatNcoRupiah(tRes.ncoYear));
    setText('ncoToyNcoMonth', formatNcoRupiah(tRes.ncoMonth));
    setText('ncoToyNcoDay', formatNcoRupiah(tRes.ncoDay));

    // Update Non-Toyota Column UI
    setText('ncoNtName', ntRes.car.name);
    setText('ncoNtType', ntRes.car.type);
    setText('ncoNtPower', ntRes.car.powerSource);
    setText('ncoNtOtr', formatNcoRupiah(ntRes.otr));
    setText('ncoNtMaint', formatNcoRupiah(ntRes.maintenanceCost));
    setText('ncoNtTax', formatNcoRupiah(ntRes.taxCost));
    setText('ncoNtFuel', formatNcoRupiah(ntRes.fuelOrChargeCost));
    setText('ncoNtLeasing', formatNcoRupiah(ntRes.leasingCost));
    setText('ncoNtOwnRisk', formatNcoRupiah(ntRes.ownRiskCost));
    setText('ncoNtCoe', formatNcoRupiah(ntRes.coe));
    setText('ncoNtResale', formatNcoRupiah(ntRes.resaleValue));
    setText('ncoNtDeprPct', `-${ntRes.depreciationPct}% (Sisa Value: ${100 - ntRes.depreciationPct}%)`);
    setText('ncoNtNcoTotal', formatNcoRupiah(ntRes.ncoTotal));
    setText('ncoNtNcoYear', formatNcoRupiah(ntRes.ncoYear));
    setText('ncoNtNcoMonth', formatNcoRupiah(ntRes.ncoMonth));
    setText('ncoNtNcoDay', formatNcoRupiah(ntRes.ncoDay));

    // Calculate Savings / Winner Analysis
    const diffTotal = ntRes.ncoTotal - tRes.ncoTotal;
    const diffMonth = ntRes.ncoMonth - tRes.ncoMonth;
    const diffDay = ntRes.ncoDay - tRes.ncoDay;

    const insightBox = document.getElementById('ncoInsightBox');
    if (insightBox) {
        if (diffTotal > 0) {
            // Toyota is cheaper overall!
            insightBox.className = 'nco-insight-box is-toyota-win';
            insightBox.innerHTML = `
                <div class="nco-insight-badge"><i class="fa-solid fa-trophy"></i> TOYOTA HEMAT BIAYA!</div>
                <h4>Mobil Toyota Lebih Hemat <span class="highlight-green">${formatNcoRupiah(diffTotal)}</span> Selama ${years} Tahun!</h4>
                <p>
                    Meskipun harga awal OTR ${tRes.car.name} (${formatNcoRupiah(tRes.otr)}) ${tRes.otr > ntRes.otr ? 'lebih tinggi' : 'sebanding'} dibanding ${ntRes.car.name} (${formatNcoRupiah(ntRes.otr)}), 
                    <strong>Nett Cost of Ownership Toyota jauh lebih murah</strong> karena nilai jual kembali (Resale Value) Toyota bertahan di <strong class="highlight-green">${100 - tRes.depreciationPct}%</strong> 
                    (${formatNcoRupiah(tRes.resaleValue)}) dibandingkan ${ntRes.car.name} yang turun hingga <strong class="highlight-red">-${ntRes.depreciationPct}%</strong> (${formatNcoRupiah(ntRes.resaleValue)}).
                </p>
                <div class="nco-insight-pills">
                    <span class="pill-green"><i class="fa-solid fa-piggy-bank"></i> Hemat Rp ${formatNcoNumber(diffMonth)} / Bulan</span>
                    <span class="pill-green"><i class="fa-solid fa-calendar-day"></i> Hemat Rp ${formatNcoNumber(diffDay)} / Hari</span>
                </div>
            `;
        } else {
            // Competitor is cheaper
            const saving = Math.abs(diffTotal);
            const savingMonth = Math.abs(diffMonth);
            insightBox.className = 'nco-insight-box is-comp-win';
            insightBox.innerHTML = `
                <div class="nco-insight-badge"><i class="fa-solid fa-chart-pie"></i> HASIL BIAYA OPERASIONAL</div>
                <h4>Selisih NCO: ${formatNcoRupiah(saving)} Selama ${years} Tahun</h4>
                <p>
                    ${ntRes.car.name} memiliki total Nett Cost of Ownership lebih rendah sebesar ${formatNcoRupiah(saving)}. 
                    Namun, ${tRes.car.name} menawarkan retensi harga jual kembali hingga <strong>${100 - tRes.depreciationPct}%</strong>, jaringan purna jual Tunas Toyota yang luas, dan garansi baterai 8 Tahun / 160.000 Km.
                </p>
                <div class="nco-insight-pills">
                    <span class="pill-blue"><i class="fa-solid fa-shield-halved"></i> Garansi Baterai 8 Thn</span>
                    <span class="pill-blue"><i class="fa-solid fa-wrench"></i> Servis & Sparepart Terjamin</span>
                </div>
            `;
        }
    }

    // Update Comparison Visual Bar Widths
    const maxNco = Math.max(tRes.ncoTotal, ntRes.ncoTotal);
    const tWidth = Math.round((tRes.ncoTotal / maxNco) * 100);
    const ntWidth = Math.round((ntRes.ncoTotal / maxNco) * 100);

    const tBar = document.getElementById('ncoToyBarFill');
    const ntBar = document.getElementById('ncoNtBarFill');
    if (tBar) tBar.style.width = `${tWidth}%`;
    if (ntBar) ntBar.style.width = `${ntWidth}%`;
}

function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

// Render NCO Comparison Data Tables (from Comparison sheet)
function renderNcoComparisonTables(filterType = 'all', searchQuery = '') {
    const toyTableBody = document.getElementById('ncoToyTableBody');
    const ntTableBody = document.getElementById('ncoNtTableBody');
    const deprTableBody = document.getElementById('ncoDeprTableBody');

    if (toyTableBody) {
        let toyList = NCO_DATA.toyota;
        if (filterType !== 'all') {
            toyList = toyList.filter(c => c.type === filterType);
        }
        if (searchQuery) {
            toyList = toyList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        toyTableBody.innerHTML = toyList.map((c, i) => `
            <tr>
                <td class="td-bold">${c.name}</td>
                <td><span class="badge-type badge-${c.type.toLowerCase()}">${c.type}</span></td>
                <td class="td-price">${formatNcoRupiah(c.otr)}</td>
                <td>${c.engineCap || '-'}</td>
                <td>${formatNcoRupiah(c.taxPerYear)}/thn</td>
                <td>${c.fuelConsumption} km/L</td>
                <td>${formatNcoRupiah(c.resaleValues[0])}</td>
                <td>${formatNcoRupiah(c.resaleValues[2])}</td>
                <td class="td-highlight">${formatNcoRupiah(c.resaleValues[3])}</td>
                <td>${formatNcoRupiah(c.resaleValues[4])}</td>
                <td class="td-small">${c.warranty}</td>
            </tr>
        `).join('');
    }

    if (ntTableBody) {
        let ntList = NCO_DATA.nonToyota;
        if (filterType !== 'all') {
            ntList = ntList.filter(c => c.type === filterType);
        }
        if (searchQuery) {
            ntList = ntList.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        ntTableBody.innerHTML = ntList.map((c, i) => `
            <tr>
                <td class="td-bold">${c.name}</td>
                <td><span class="badge-type badge-${c.type.toLowerCase()}">${c.type}</span></td>
                <td class="td-price">${formatNcoRupiah(c.otr)}</td>
                <td>${c.oneChargeMileage ? c.oneChargeMileage + ' km (BEV)' : (c.fuelConsumption ? c.fuelConsumption + ' km/L' : '-')}</td>
                <td>${formatNcoRupiah(c.taxPerYear)}/thn</td>
                <td>${c.chargingCostPerFullCharge ? formatNcoRupiah(c.chargingCostPerFullCharge) + ' / ' + c.chargingDistanceKm + 'km' : (c.fuelCostPerLitre ? formatNcoRupiah(c.fuelCostPerLitre) + '/L' : '-')}</td>
                <td>${formatNcoRupiah(c.resaleValues[0])}</td>
                <td>${formatNcoRupiah(c.resaleValues[2])}</td>
                <td class="td-warn">${formatNcoRupiah(c.resaleValues[3])}</td>
                <td>${formatNcoRupiah(c.resaleValues[4])}</td>
                <td class="td-small">${c.warranty}</td>
            </tr>
        `).join('');
    }

    if (deprTableBody) {
        let rowsHtml = '';
        rowsHtml += `<tr class="tr-section-head"><td colspan="7"><i class="fa-solid fa-car"></i> TOYOTA DEPRECIATION RATES (%)</td></tr>`;
        NCO_DATA.toyota.forEach(c => {
            rowsHtml += `
                <tr>
                    <td class="td-bold">${c.name}</td>
                    <td>-${c.depreciationPercentages[0]}%</td>
                    <td>-${c.depreciationPercentages[1]}%</td>
                    <td>-${c.depreciationPercentages[2]}%</td>
                    <td class="td-highlight">-${c.depreciationPercentages[3]}%</td>
                    <td>-${c.depreciationPercentages[4]}%</td>
                    <td><span class="badge-good">Sangat Stabil</span></td>
                </tr>
            `;
        });

        rowsHtml += `<tr class="tr-section-head"><td colspan="7"><i class="fa-solid fa-car-side"></i> NON-TOYOTA DEPRECIATION RATES (%)</td></tr>`;
        NCO_DATA.nonToyota.forEach(c => {
            rowsHtml += `
                <tr>
                    <td class="td-bold">${c.name}</td>
                    <td>-${c.depreciationPercentages[0]}%</td>
                    <td>-${c.depreciationPercentages[1]}%</td>
                    <td>-${c.depreciationPercentages[2]}%</td>
                    <td class="td-warn">-${c.depreciationPercentages[3]}%</td>
                    <td class="td-warn">-${c.depreciationPercentages[4]}%</td>
                    <td><span class="badge-bad">Depresiasi Tinggi</span></td>
                </tr>
            `;
        });

        deprTableBody.innerHTML = rowsHtml;
    }
}

// Global functions for tabs & filters on the table
function filterNcoTableType(type, btn) {
    const buttons = document.querySelectorAll('.nco-filter-btn');
    buttons.forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const searchVal = document.getElementById('ncoTableSearch') ? document.getElementById('ncoTableSearch').value : '';
    renderNcoComparisonTables(type, searchVal);
}

function searchNcoTable(input) {
    const activeBtn = document.querySelector('.nco-filter-btn.active');
    const filterType = activeBtn ? activeBtn.getAttribute('data-type') || 'all' : 'all';
    renderNcoComparisonTables(filterType, input.value);
}

function switchNcoTableTab(tabName, btn) {
    const tabs = document.querySelectorAll('.nco-tab-btn');
    tabs.forEach(t => t.classList.remove('active'));
    if (btn) btn.classList.add('active');

    const panes = document.querySelectorAll('.nco-tab-pane');
    panes.forEach(p => p.classList.remove('active'));

    const targetPane = document.getElementById(`ncoTabPane_${tabName}`);
    if (targetPane) targetPane.classList.add('active');
}
