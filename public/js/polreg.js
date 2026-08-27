/**
 * polreg.js
 * Polreg Wilayah & District Intelligence All-in-One Portal
 * Integrates Polreg list, multi-year selector, and dynamic kecamatan analysis.
 */

let currentKeyword = '';
let dbDataPolreg = [];
let activeYear = sessionStorage.getItem('polreg_active_year') || '2026';
let currentKecamatan = '';

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const yearFromUrl = urlParams.get('tahun') || sessionStorage.getItem('polreg_active_year') || '2026';
  const tabFromUrl = urlParams.get('tab') || 'analisis';

  activeYear = yearFromUrl;
  sessionStorage.setItem('polreg_active_year', activeYear);

  const yearSelect = document.getElementById('yearSelect');
  if (yearSelect) {
    yearSelect.value = activeYear;
  }

  // Handle Tab Switch from URL
  switchPolregTab(tabFromUrl);

  // Auto-close dropdown menu when clicking outside
  document.addEventListener('click', (e) => {
    const inputSearch = document.getElementById('inputKecamatanSearch');
    const menu = document.getElementById('dropdownKecamatanMenu');
    if (menu && inputSearch && !inputSearch.contains(e.target) && !menu.contains(e.target)) {
      menu.style.display = 'none';
    }
  });

  const searchInput = document.getElementById('searchKecamatan');
  if (searchInput) {
    searchInput.addEventListener('input', function (e) {
      currentKeyword = e.target.value.toLowerCase().trim();
      renderKecamatan();
    });
  }

  fetchDataDariDatabase();
});

function switchPolregTab(tabName) {
  const viewAnalisis = document.getElementById('viewAnalisis');
  const viewDaftar = document.getElementById('viewDaftar');
  const tabAnalisis = document.getElementById('tabAnalisis');
  const tabDaftar = document.getElementById('tabDaftar');

  if (tabName === 'daftar') {
    if (viewAnalisis) viewAnalisis.style.display = 'none';
    if (viewDaftar) viewDaftar.style.display = 'block';
    if (tabAnalisis) tabAnalisis.classList.remove('active');
    if (tabDaftar) tabDaftar.classList.add('active');
  } else {
    if (viewAnalisis) viewAnalisis.style.display = 'block';
    if (viewDaftar) viewDaftar.style.display = 'none';
    if (tabAnalisis) tabAnalisis.classList.add('active');
    if (tabDaftar) tabDaftar.classList.remove('active');
  }
}

function setYear(year) {
  activeYear = year;
  sessionStorage.setItem('polreg_active_year', year);
  fetchDataDariDatabase();
}

async function fetchDataDariDatabase() {
  const container = document.getElementById('polregList');
  if (container) {
    container.innerHTML = '<div style="text-align:center; padding: 40px; color:#777;"><i class="fa-solid fa-spinner fa-spin"></i> Sedang mengambil data...</div>';
  }

  try {
    const response = await fetch(`../api/api_polreg_summary.php?tahun=${activeYear}&t=${Date.now()}`);
    const result = await response.json();

    if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
      dbDataPolreg = result.data;

      // Update Daftar View
      renderKecamatan();

      // Update Autocomplete & Analisis View
      const exists = dbDataPolreg.find(i => i.kecamatan.toLowerCase() === currentKecamatan.toLowerCase());
      if (exists) {
        currentKecamatan = exists.kecamatan;
      } else {
        currentKecamatan = dbDataPolreg[0].kecamatan;
      }

      const currentObj = dbDataPolreg.find(i => i.kecamatan.toLowerCase() === currentKecamatan.toLowerCase()) || dbDataPolreg[0];
      const inputSearch = document.getElementById('inputKecamatanSearch');
      if (inputSearch) {
        inputSearch.value = `Kec. ${currentObj.kecamatan} (${currentObj.total_unit} Unit)`;
      }

      renderKecamatanDropdownMenu(dbDataPolreg);
      await renderKecamatanAnalysis(currentKecamatan, activeYear);
    } else {
      if (container) {
        container.innerHTML = `<div style="text-align:center; padding: 30px; color:red;">Data Polreg tidak ditemukan.</div>`;
      }
    }
  } catch (error) {
    console.error("Error:", error);
    if (container) {
      container.innerHTML = '<div style="text-align:center; padding: 30px; color:red;">Koneksi ke server terputus.</div>';
    }
  }
}

function renderKecamatan() {
  const container = document.getElementById('polregList');
  if (!container) return;

  const filteredData = dbDataPolreg.filter(item => item.kecamatan.toLowerCase().includes(currentKeyword));

  const listTitle = document.getElementById('listTitle');
  const countKec = document.getElementById('countKecamatan');
  if (listTitle) listTitle.textContent = `Daftar Kecamatan ${activeYear}`;
  if (countKec) countKec.textContent = `${filteredData.length} Wilayah`;

  container.innerHTML = '';

  if (filteredData.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding: 30px; color:var(--text-muted); font-size: 13px;">Kecamatan tidak ditemukan.</div>';
    return;
  }

  filteredData.forEach((item, index) => {
    let badgeTop = '';
    if (index === 0) badgeTop = '<i class="fa-solid fa-medal" style="color:#ffdf00; margin-right:4px;"></i>';
    if (index === 1) badgeTop = '<i class="fa-solid fa-medal" style="color:#c0c0c0; margin-right:4px;"></i>';
    if (index === 2) badgeTop = '<i class="fa-solid fa-medal" style="color:#cd7f32; margin-right:4px;"></i>';

    const urlDetail = `polreg_detail.html?kecamatan=${encodeURIComponent(item.kecamatan)}&tahun=${activeYear}`;
    const totalUnitFormatted = new Intl.NumberFormat('id-ID').format(item.total_unit);

    const cardHTML = `
      <div class="polreg-card">
        <div class="polreg-header">
          <div class="kecamatan-icon"><i class="fa-solid fa-map-location-dot"></i></div>
          <div style="flex: 1;">
            <div class="kecamatan-name">${badgeTop}${item.kecamatan}</div>
            <div style="font-size: 11px; color: var(--text-muted); margin-top: 2px;">Total: <b style="color:var(--primary-red);">${totalUnitFormatted}</b> Unit Terdaftar</div>
          </div>
          <a href="${urlDetail}" class="btn-detail">Detail <i class="fa-solid fa-chevron-right"></i></a>
        </div>
      </div>
    `;
    container.innerHTML += cardHTML;
  });
}

/* ═══════════════════════════════════════════════════════════════
   SEARCHABLE AUTOCOMPLETE LOGIC FOR KECAMATAN ANALISIS
   ═══════════════════════════════════════════════════════════════ */

function showKecamatanMenu() {
  const menu = document.getElementById('dropdownKecamatanMenu');
  const inputSearch = document.getElementById('inputKecamatanSearch');
  if (menu) {
    if (inputSearch) inputSearch.select();
    renderKecamatanDropdownMenu(dbDataPolreg);
    menu.style.display = 'block';
  }
}

function filterKecamatanMenu(query) {
  const q = query.toLowerCase().trim();
  const menu = document.getElementById('dropdownKecamatanMenu');
  if (!menu) return;
  menu.style.display = 'block';

  const filtered = dbDataPolreg.filter(item => 
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

  const mobilRekom = document.getElementById('txtMobilRekomendasi');
  const alasanRekom = document.getElementById('txtAlasanRekomendasi');
  if (mobilRekom) mobilRekom.textContent = 'Memuat data...';
  if (alasanRekom) alasanRekom.textContent = `Menganalisis registrasi kendaraan Polreg ${kecNama} tahun ${year}...`;

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

      const elMS = document.getElementById('valMarketShare');
      const elCont = document.getElementById('valContTunas');
      if (elMS) elMS.textContent = `${marketSharePct}%`;
      if (elCont) elCont.textContent = `${totalUnitsInKec} U`;

      // Potensi Pasar
      const valPotensi = document.getElementById('valPotensi');
      if (valPotensi) {
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
      }

      // Dominant Car Recommendation (Top 2 models)
      const topModel1 = cars[0] ? `${cars[0].merk} ${cars[0].type}` : 'Toyota Avanza';
      const topModel2 = cars[1] ? `${cars[1].merk} ${cars[1].type}` : 'Toyota Rush';

      if (mobilRekom) mobilRekom.textContent = `${topModel1} & ${topModel2}`;

      // Segmentasi Label
      const lblSegmentasi = document.getElementById('lblSegmentasi');
      if (lblSegmentasi) {
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
      }

      if (alasanRekom) {
        alasanRekom.textContent = 
          `Berdasarkan data Polreg ${year}, Kecamatan ${kecNama} memiliki total ${totalUnitsInKec} unit kendaraan terdaftar. ` +
          `Brand Toyota menguasai ${totalToyotaUnits} unit (${marketSharePct}% Market Share) dengan model terlaris ${topModel1} (${cars[0] ? cars[0].unit : 0} Unit).`;
      }

      // Render Top 5 Mobil Widget
      const top5Cars = cars.slice(0, 5);
      const maxUnit = top5Cars[0] ? top5Cars[0].unit : 1;

      const lblTop5Total = document.getElementById('lblTop5Total');
      if (lblTop5Total) {
        lblTop5Total.textContent = `${cars.length} Model Terdaftar`;
      }

      const linkDetailPolreg = document.getElementById('linkDetailPolreg');
      if (linkDetailPolreg) {
        linkDetailPolreg.href = `polreg_detail.html?kecamatan=${encodeURIComponent(kecNama)}&tahun=${encodeURIComponent(year)}`;
      }

      const listTop5Container = document.getElementById('listTop5Mobil');
      if (listTop5Container) {
        listTop5Container.innerHTML = top5Cars.map((car, idx) => {
          const rank = idx + 1;
          let rankBadge = `<span style="display:inline-flex; align-items:center; justify-content:center; width:22px; height:22px; border-radius:50%; background:#e2e8f0; font-size:11px; font-weight:800; color:#475569;">${rank}</span>`;
          if (rank === 1) rankBadge = `<span style="font-size:16px;">🥇</span>`;
          if (rank === 2) rankBadge = `<span style="font-size:16px;">🥈</span>`;
          if (rank === 3) rankBadge = `<span style="font-size:16px;">🥉</span>`;

          const merkLower = car.merk.toLowerCase();
          let brandBg = '#475569';
          let brandText = '#ffffff';

          if (merkLower.includes('toyota')) {
            brandBg = '#dc2626';
          } else if (merkLower.includes('honda')) {
            brandBg = '#2563eb';
          } else if (merkLower.includes('suzuki')) {
            brandBg = '#ea580c';
          } else if (merkLower.includes('mitsubishi')) {
            brandBg = '#b91c1c';
          } else if (merkLower.includes('daihatsu')) {
            brandBg = '#0284c7';
          } else if (merkLower.includes('hyundai')) {
            brandBg = '#0f766e';
          }

          const pct = Math.max(12, Math.round((car.unit / maxUnit) * 100));

          return `
            <div style="display: flex; align-items: center; gap: 10px; background: #ffffff; padding: 10px 12px; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
              <div style="flex-shrink: 0; width: 24px; text-align: center;">${rankBadge}</div>
              <div style="flex: 1; min-width: 0;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                  <span style="font-size: 9.5px; font-weight: 800; background: ${brandBg}; color: ${brandText}; padding: 1px 6px; border-radius: 4px; text-transform: uppercase;">${car.merk}</span>
                  <span style="font-size: 12px; font-weight: 800; color: #0d1b3e; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${car.type}</span>
                </div>
                <div style="height: 6px; background: #f1f5f9; border-radius: 10px; overflow: hidden;">
                  <div style="height: 100%; width: ${pct}%; background: ${brandBg}; border-radius: 10px;"></div>
                </div>
              </div>
              <div style="flex-shrink: 0; text-align: right;">
                <span style="font-size: 13px; font-weight: 800; color: #0d1b3e;">${car.unit}</span>
                <span style="font-size: 10px; font-weight: 700; color: #64748b;"> Unit</span>
              </div>
            </div>
          `;
        }).join('');
      }
    } else {
      if (mobilRekom) mobilRekom.textContent = 'Belum Ada Data Polreg';
      if (alasanRekom) alasanRekom.textContent = `Tidak ada data registrasi kendaraan yang tercatat untuk Kecamatan ${kecNama} di tahun ${year}.`;

      const listTop5Container = document.getElementById('listTop5Mobil');
      if (listTop5Container) {
        listTop5Container.innerHTML = '<div style="text-align: center; color: #94a3b8; font-size: 12px; padding: 12px;">Belum ada data kendaraan terdaftar di kecamatan ini.</div>';
      }
      const lblTop5Total = document.getElementById('lblTop5Total');
      if (lblTop5Total) lblTop5Total.textContent = '0 Model';
    }
  } catch (err) {
    console.error(err);
    if (mobilRekom) mobilRekom.textContent = 'Gagal Memuat';
    const listTop5Container = document.getElementById('listTop5Mobil');
    if (listTop5Container) {
      listTop5Container.innerHTML = '<div style="text-align: center; color: #ef4444; font-size: 12px; padding: 12px;">Gagal mengambil data kendaraan.</div>';
    }
  }
}
