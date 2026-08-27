function calculateEcoSavings() {
    const hybridModel = document.getElementById('hybridModelSelect').value;
    const oldKmPerLiter = parseFloat(document.getElementById('oldCarKmPerLiter').value) || 9;
    const dailyKm = parseFloat(document.getElementById('dailyDistanceKm').value) || 40;
    const fuelPrice = parseFloat(document.getElementById('fuelPricePerLiter').value) || 13900;

    // Mileage map for Hybrid models (km/L)
    const hybridMileageMap = {
        'zenix': 21.0,
        'yariscross': 30.0,
        'corollacross': 23.0
    };
    const hybridKmPerLiter = hybridMileageMap[hybridModel] || 21.0;

    // Yearly calculations (365 days)
    const yearlyKm = dailyKm * 365;

    // Fuel consumption in Liters
    const oldCarLitersYearly = yearlyKm / oldKmPerLiter;
    const hybridLitersYearly = yearlyKm / hybridKmPerLiter;
    const litersSavedYearly = oldCarLitersYearly - hybridLitersYearly;

    // Money Savings
    const yearlyMoneySaved = litersSavedYearly * fuelPrice;
    const monthlyMoneySaved = yearlyMoneySaved / 12;

    // CO2 Reduction Calculation: ~2.31 kg CO2 per Liter of Gasoline
    const co2SavedKg = litersSavedYearly * 2.31;

    // Trees Saved Equivalent: ~1 tree absorbs ~22 kg CO2 per year
    const treesEquivalent = Math.round(co2SavedKg / 22);

    // Update UI
    document.getElementById('resYearlyMoneySavings').textContent = 'Rp ' + Math.round(yearlyMoneySaved).toLocaleString('id-ID');
    document.getElementById('resMonthlyMoneySavings').textContent = 'Atau Rp ' + Math.round(monthlyMoneySaved).toLocaleString('id-ID') + ' / bulan';
    document.getElementById('resCo2SavingsKg').textContent = Math.round(co2SavedKg).toLocaleString('id-ID') + ' kg';
    document.getElementById('resTreesEquivalent').textContent = treesEquivalent + ' Pohon';
}

function shareEcoInfographicWA() {
    const hybridSelect = document.getElementById('hybridModelSelect');
    const hybridName = hybridSelect.options[hybridSelect.selectedIndex].text.split('-')[0].trim();
    const dailyKm = document.getElementById('dailyDistanceKm').value;
    
    const yearlyMoney = document.getElementById('resYearlyMoneySavings').textContent;
    const monthlyMoney = document.getElementById('resMonthlyMoneySavings').textContent;
    const co2Kg = document.getElementById('resCo2SavingsKg').textContent;
    const trees = document.getElementById('resTreesEquivalent').textContent;

    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant';
    const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

    const text = `🌿 *ANALISIS EFISIENSI & DAMPAK LINGKUNGAN TOYOTA HYBRID (HEV)* 🌿
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bapak/Ibu, berikut adalah estimasi efisiensi biaya & dampak positif lingkungan jika beralih ke unit *${hybridName}*:

📊 *PARAMETER PENGGUNAAN:*
- Estimasi Jarak Tempuh: ${dailyKm} km / hari (~${dailyKm * 365} km / tahun)

💰 *ESTIMASI PENGHEMATAN BIAYA BBM:*
- Hemat BBM per Tahun: *${yearlyMoney}*
- (${monthlyMoney})

🌱 *KONTRIBUSI TERHADAP LINGKUNGAN:*
- Reduksi Emisi CO₂: *${co2Kg}* per tahun
- Dosis Kontribusi: Setara menanam *${trees}* per tahun! 🌳✨

*Teknologi Toyota Hybrid (HEV)* memberikan performa responsif tanpa perlu *charging* baterai manual, garansi baterai 8 Tahun/160.000 km, dan nilai jual kembali yang tinggi!

Ingin mencoba sesi *Test Drive* atau simulasi kredit *${hybridName}* hari ini? 

Salam hangat,
👔 *${salesNama}*
🏬 ${cabang}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

// Initial calculation on load
document.addEventListener('DOMContentLoaded', () => {
    calculateEcoSavings();
});
