/**
 * kecamatan.js
 * District Intelligence Dashboard dynamically driven by Polreg Summary & Detail APIs
 * Searchable Autocomplete Kecamatan Selector
 */

let activeYear = sessionStorage.getItem('polreg_active_year') || '2026';
let currentKecamatan = '';
let polregKecamatanList = [];

document.addEventListener('DOMContentLoaded', () => {
    // Set Year select element if exists
    const selectTahun = document.getElementById('selectTahun');
    if (selectTahun) {
        selectTahun.value = activeYear;
    }

    // Auto-close dropdown menu when clicking outside
    document.addEventListener('click', (e) => {
        const inputSearch = document.getElementById('inputKecamatanSearch');
        const menu = document.getElementById('dropdownKecamatanMenu');
        if (menu && inputSearch && !inputSearch.contains(e.target) && !menu.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    loadKecamatanListForYear(activeYear);
});

async function changeTahun(year) {
    activeYear = year;
    sessionStorage.setItem('polreg_active_year', year);
    await loadKecamatanListForYear(activeYear);
}

async function loadKecamatanListForYear(year) {
    const inputSearch = document.getElementById('inputKecamatanSearch');
    if (inputSearch) inputSearch.value = 'Memuat kecamatan Polreg...';

    try {
        const res = await fetch(`../api/api_polreg_summary.php?tahun=${encodeURIComponent(year)}&t=${Date.now()}`);
        const json = await res.json();
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
            polregKecamatanList = json.data;

            // Keep current selected kecamatan if available in new year, otherwise pick first
            const exists = polregKecamatanList.find(i => i.kecamatan.toLowerCase() === currentKecamatan.toLowerCase());
            if (exists) {
                currentKecamatan = exists.kecamatan;
            } else {
                currentKecamatan = polregKecamatanList[0].kecamatan;
            }

            const currentObj = polregKecamatanList.find(i => i.kecamatan.toLowerCase() === currentKecamatan.toLowerCase()) || polregKecamatanList[0];
            if (inputSearch) {
                inputSearch.value = `Kec. ${currentObj.kecamatan} (${currentObj.total_unit} Unit)`;
            }

            renderKecamatanDropdownMenu(polregKecamatanList);
            await renderKecamatanAnalysis(currentKecamatan, year);
        } else {
            if (inputSearch) inputSearch.value = 'Data Polreg tidak ditemukan';
        }
    } catch (err) {
        console.error(err);
        if (inputSearch) inputSearch.value = 'Gagal memuat data';
    }
}

function showKecamatanMenu() {
    const menu = document.getElementById('dropdownKecamatanMenu');
    const inputSearch = document.getElementById('inputKecamatanSearch');
    if (menu) {
        if (inputSearch) inputSearch.select();
        renderKecamatanDropdownMenu(polregKecamatanList);
        menu.style.display = 'block';
    }
}

function filterKecamatanMenu(query) {
    const q = query.toLowerCase().trim();
    const menu = document.getElementById('dropdownKecamatanMenu');
    if (!menu) return;
    menu.style.display = 'block';

    const filtered = polregKecamatanList.filter(item => 
        item.kecamatan.toLowerCase().includes(q)
    );

    renderKecamatanDropdownMenu(filtered);
}

function renderKecamatanDropdownMenu(list) {
    const menu = document.getElementById('dropdownKecamatanMenu');
    if (!menu) return;

    if (list.length === 0) {
        menu.innerHTML = '<div style="padding: 10px; font-size: 12px; color: #94a3b8; text-align: center;">Kecamatan tidak ditemukan</div>';
        return;
    }

    menu.innerHTML = list.map(item => {
        const isSelected = item.kecamatan.toLowerCase() === currentKecamatan.toLowerCase();
        return `
            <div onclick="selectKecamatanItem('${item.kecamatan}', ${item.total_unit})" 
                style="padding: 10px 12px; font-size: 12.5px; font-weight: 700; color: ${isSelected ? '#4f46e5' : '#1e293b'}; background: ${isSelected ? 'rgba(99,102,241,0.1)' : 'transparent'}; border-radius: 8px; cursor: pointer; display: flex; justify-content: space-between; align-items: center; transition: all 0.15s; margin-bottom: 2px;"
                onmouseover="this.style.background='rgba(99,102,241,0.08)'"
                onmouseout="this.style.background='${isSelected ? 'rgba(99,102,241,0.1)' : 'transparent'}'">
                <span><i class="fa-solid fa-map-location-dot" style="color: ${isSelected ? '#4f46e5' : '#94a3b8'}; margin-right: 8px;"></i> Kec. ${item.kecamatan}</span>
                <span style="font-size: 11px; font-weight: 800; background: #e2e8f0; color: #475569; padding: 2px 8px; border-radius: 50px;">${item.total_unit} Unit</span>
            </div>
        `;
    }).join('');
}

async function selectKecamatanItem(kecNama, totalUnit) {
    currentKecamatan = kecNama;
    const inputSearch = document.getElementById('inputKecamatanSearch');
    if (inputSearch) {
        inputSearch.value = `Kec. ${kecNama} (${totalUnit} Unit)`;
    }

    const menu = document.getElementById('dropdownKecamatanMenu');
    if (menu) menu.style.display = 'none';

    await renderKecamatanAnalysis(currentKecamatan, activeYear);
}

async function renderKecamatanAnalysis(kecNama, year) {
    if (!kecNama) return;

    // Reset UI to loading state
    document.getElementById('txtMobilRekomendasi').textContent = 'Memuat data...';
    document.getElementById('txtAlasanRekomendasi').textContent = `Menganalisis registrasi kendaraan Polreg ${kecNama} tahun ${year}...`;

    try {
        const res = await fetch(`../api/api_polreg_detail.php?kecamatan=${encodeURIComponent(kecNama)}&tahun=${encodeURIComponent(year)}&t=${Date.now()}`);
        const json = await res.json();

        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
            const cars = json.data;
            const totalUnitsInKec = cars.reduce((sum, c) => sum + c.unit, 0);

            // Filter Toyota units
            const toyotaCars = cars.filter(c => c.merk.toLowerCase() === 'toyota');
            const totalToyotaUnits = toyotaCars.reduce((sum, c) => sum + c.unit, 0);

            // Market Share %
            const marketSharePct = Math.round((totalToyotaUnits / totalUnitsInKec) * 100);

            document.getElementById('valMarketShare').textContent = `${marketSharePct}%`;
            document.getElementById('valContTunas').textContent = `${totalUnitsInKec} U`;

            // Potensi Pasar
            const valPotensi = document.getElementById('valPotensi');
            if (totalUnitsInKec >= 50) {
                valPotensi.textContent = 'Sangat Tinggi 🔥';
                valPotensi.style.color = '#ef4444';
            } else if (totalUnitsInKec >= 20) {
                valPotensi.textContent = 'Tinggi ⭐';
                valPotensi.style.color = '#3565e0';
            } else if (totalUnitsInKec >= 10) {
                valPotensi.textContent = 'Sedang 📈';
                valPotensi.style.color = '#d97706';
            } else {
                valPotensi.textContent = 'Normal 🚗';
                valPotensi.style.color = '#059669';
            }

            // Dominant Car Recommendation (Top 2 models)
            const topModel1 = cars[0] ? `${cars[0].merk} ${cars[0].type}` : 'Toyota Avanza';
            const topModel2 = cars[1] ? `${cars[1].merk} ${cars[1].type}` : 'Toyota Rush';

            document.getElementById('txtMobilRekomendasi').textContent = `${topModel1} & ${topModel2}`;

            // Segmentasi Label
            const lblSegmentasi = document.getElementById('lblSegmentasi');
            const top1Lower = topModel1.toLowerCase();
            if (top1Lower.includes('innova') || top1Lower.includes('fortuner') || top1Lower.includes('palisade') || top1Lower.includes('alphard')) {
                lblSegmentasi.textContent = 'Eksekutif & Premium MPV/SUV';
            } else if (top1Lower.includes('avanza') || top1Lower.includes('veloz') || top1Lower.includes('stargazer') || top1Lower.includes('xpander')) {
                lblSegmentasi.textContent = 'Family MPV 7-Seater';
            } else if (top1Lower.includes('agya') || top1Lower.includes('calya') || top1Lower.includes('brio') || top1Lower.includes('sigra')) {
                lblSegmentasi.textContent = 'Compact City Car / LCGC';
            } else {
                lblSegmentasi.textContent = 'Popular Family Vehicle';
            }

            document.getElementById('txtAlasanRekomendasi').textContent = 
                `Berdasarkan data Polreg ${year}, Kecamatan ${kecNama} memiliki total ${totalUnitsInKec} unit kendaraan terdaftar. ` +
                `Brand Toyota menguasai ${totalToyotaUnits} unit (${marketSharePct}% Market Share) dengan model terlaris ${topModel1} (${cars[0] ? cars[0].unit : 0} Unit).`;

            // Funneling Calculations
            const estProspect = Math.round(totalUnitsInKec * 2.5);
            const estHot = Math.round(totalUnitsInKec * 0.9);
            const estSpk = Math.round(totalUnitsInKec * 0.4);
            const estDo = totalToyotaUnits > 0 ? totalToyotaUnits : Math.round(totalUnitsInKec * 0.3);

            document.getElementById('barProspect').style.width = '100%';
            document.getElementById('valProspect').textContent = `${estProspect} / ${Math.round(estProspect * 0.7)} (70%)`;

            document.getElementById('barHot').style.width = '55%';
            document.getElementById('valHot').textContent = `${estHot} / ${Math.round(estHot * 0.5)} (50%)`;

            document.getElementById('barSpk').style.width = '30%';
            document.getElementById('valSpk').textContent = `${estSpk} / ${Math.round(estSpk * 0.4)} (40%)`;

            document.getElementById('barDo').style.width = '100%';
            document.getElementById('valDo').textContent = `${estDo} Unit (${totalToyotaUnits} Toyota)`;
        } else {
            document.getElementById('valMarketShare').textContent = '0%';
            document.getElementById('valContTunas').textContent = '0 U';
            document.getElementById('txtMobilRekomendasi').textContent = 'Belum Ada Data Polreg';
            document.getElementById('txtAlasanRekomendasi').textContent = `Tidak ada data registrasi kendaraan yang tercatat untuk Kecamatan ${kecNama} di tahun ${year}.`;
        }
    } catch (err) {
        console.error(err);
        document.getElementById('txtMobilRekomendasi').textContent = 'Gagal Memuat';
    }
}
