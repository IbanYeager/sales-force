/**
 * performa_regional.js
 * Logika interaktif render dan filter tabel Performa Regional West Java
 * Tunas Toyota Kiara Condong - Executive Kacab Panel
 */

(function(window, document) {
  'use strict';

  // Fallback baseline data jika fetch API offline
  const EMBEDDED_REGIONAL_DATA = {
    "region": "WEST JAVA",
    "spk_date": "31 August 2026",
    "rs_date": "31 August 2026 (Latest)",
    "period": "Agustus 2026",
    "summary": {
      "total_dealer": 10,
      "total_branch": 32,
      "spk_target_eom": 1560,
      "spk_actual": 1682,
      "spk_ach_vs_target": 107.8,
      "spk_ach_vs_july": 106.4,
      "rs_target_eom": 1386,
      "rs_actual": 1447,
      "rs_ach_vs_target": 104.4,
      "rs_ach_vs_july": 103.7,
      "tunas_group": {
        "spk_target_eom": 223,
        "spk_actual": 259,
        "spk_ach_vs_target": 116.1,
        "spk_ach_vs_july": 111.2,
        "rs_target_eom": 200,
        "rs_actual": 208,
        "rs_ach_vs_target": 104.0,
        "rs_ach_vs_july": 104.0
      },
      "kiara_condong": {
        "spk_target_eom": 73,
        "spk_actual": 100,
        "spk_ach_vs_target": 137.0,
        "spk_ach_vs_july": 114.9,
        "rs_target_eom": 73,
        "rs_actual": 87,
        "rs_ach_vs_target": 119.2,
        "rs_ach_vs_july": 107.4
      }
    },
    "by_dealer": [
      { "dealer": "Astrido Toyota", "spk_target_eom": 51, "spk_actual": 77, "spk_ach_target": 151.0, "spk_ach_july": 124.2, "rs_target_eom": 49, "rs_actual": 53, "rs_ach_target": 108.2, "rs_ach_july": 84.1 },
      { "dealer": "Auto2000", "spk_target_eom": 672, "spk_actual": 715, "spk_ach_target": 106.4, "spk_ach_july": 109.8, "rs_target_eom": 614, "rs_actual": 655, "rs_ach_target": 106.7, "rs_ach_july": 105.8 },
      { "dealer": "Budi Jaya", "spk_target_eom": 67, "spk_actual": 58, "spk_ach_target": 86.6, "spk_ach_july": 86.6, "rs_target_eom": 51, "rs_actual": 52, "rs_ach_target": 102.0, "rs_ach_july": 100.0 },
      { "dealer": "Duta Cendana", "spk_target_eom": 77, "spk_actual": 85, "spk_ach_target": 110.4, "spk_ach_july": 87.6, "rs_target_eom": 58, "rs_actual": 63, "rs_ach_target": 108.6, "rs_ach_july": 110.5 },
      { "dealer": "Plaza Toyota", "spk_target_eom": 91, "spk_actual": 107, "spk_ach_target": 117.6, "spk_ach_july": 108.1, "rs_target_eom": 72, "rs_actual": 86, "rs_ach_target": 119.4, "rs_ach_july": 108.9 },
      { "dealer": "Rejeki Toyota", "spk_target_eom": 85, "spk_actual": 106, "spk_ach_target": 124.7, "spk_ach_july": 127.7, "rs_target_eom": 89, "rs_actual": 79, "rs_ach_target": 88.8, "rs_ach_july": 106.8 },
      { "dealer": "Selamat Toyota", "spk_target_eom": 60, "spk_actual": 62, "spk_ach_target": 103.3, "spk_ach_july": 88.6, "rs_target_eom": 44, "rs_actual": 53, "rs_ach_target": 120.5, "rs_ach_july": 106.0 },
      { "dealer": "Sinar Mas", "spk_target_eom": 65, "spk_actual": 73, "spk_ach_target": 112.3, "spk_ach_july": 105.8, "rs_target_eom": 51, "rs_actual": 51, "rs_ach_target": 100.0, "rs_ach_july": 89.5 },
      { "dealer": "Tunas Toyota", "spk_target_eom": 223, "spk_actual": 259, "spk_ach_target": 116.1, "spk_ach_july": 111.2, "rs_target_eom": 200, "rs_actual": 208, "rs_ach_target": 104.0, "rs_ach_july": 104.0 },
      { "dealer": "Wijaya Toyota", "spk_target_eom": 169, "spk_actual": 140, "spk_ach_target": 82.8, "spk_ach_july": 93.3, "rs_target_eom": 158, "rs_actual": 147, "rs_ach_target": 93.0, "rs_ach_july": 101.4 }
    ],
    "by_branch": [
      { "dealer_group": "Astrido Toyota", "branch": "Astrido Toyota Karawang Barat", "spk_target_eom": 51, "spk_actual": 77, "spk_ach_target": 151.0, "spk_ach_july": 124.2, "rs_target_eom": 49, "rs_actual": 53, "rs_ach_target": 108.2, "rs_ach_july": 84.1, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Asia Afrika", "spk_target_eom": 37, "spk_actual": 44, "spk_ach_target": 118.9, "spk_ach_july": 137.5, "rs_target_eom": 32, "rs_actual": 32, "rs_ach_target": 100.0, "rs_ach_july": 74.4, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Bandung Suci", "spk_target_eom": 33, "spk_actual": 31, "spk_ach_target": 93.9, "spk_ach_july": 155.0, "rs_target_eom": 29, "rs_actual": 27, "rs_ach_target": 93.1, "rs_ach_july": 135.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Cibiru", "spk_target_eom": 49, "spk_actual": 48, "spk_ach_target": 98.0, "spk_ach_july": 123.1, "rs_target_eom": 43, "rs_actual": 56, "rs_ach_target": 130.2, "rs_ach_july": 100.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Cikampek", "spk_target_eom": 35, "spk_actual": 36, "spk_ach_target": 102.9, "spk_ach_july": 102.9, "rs_target_eom": 31, "rs_actual": 30, "rs_ach_target": 96.8, "rs_ach_july": 115.4, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Cirebon", "spk_target_eom": 58, "spk_actual": 79, "spk_ach_target": 136.2, "spk_ach_july": 106.8, "rs_target_eom": 54, "rs_actual": 72, "rs_ach_target": 133.3, "rs_ach_july": 94.7, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Indramayu", "spk_target_eom": 44, "spk_actual": 83, "spk_ach_target": 188.6, "spk_ach_july": 143.1, "rs_target_eom": 41, "rs_actual": 70, "rs_ach_target": 170.7, "rs_ach_july": 140.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Jatiwangi Majalengka", "spk_target_eom": 26, "spk_actual": 29, "spk_ach_target": 111.5, "spk_ach_july": 107.4, "rs_target_eom": 25, "rs_actual": 25, "rs_ach_target": 100.0, "rs_ach_july": 92.6, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Karawang", "spk_target_eom": 83, "spk_actual": 84, "spk_ach_target": 101.2, "spk_ach_july": 105.0, "rs_target_eom": 78, "rs_actual": 77, "rs_ach_target": 98.7, "rs_ach_july": 110.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Kuningan", "spk_target_eom": 14, "spk_actual": 13, "spk_ach_target": 92.9, "spk_ach_july": 100.0, "rs_target_eom": 13, "rs_actual": 30, "rs_ach_target": 230.8, "rs_ach_july": 157.9, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Pasteur", "spk_target_eom": 53, "spk_actual": 48, "spk_ach_target": 90.6, "spk_ach_july": 92.3, "rs_target_eom": 48, "rs_actual": 56, "rs_ach_target": 116.7, "rs_ach_july": 140.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Purwakarta", "spk_target_eom": 40, "spk_actual": 26, "spk_ach_target": 65.0, "spk_ach_july": 55.3, "rs_target_eom": 37, "rs_actual": 29, "rs_ach_target": 78.4, "rs_ach_july": 72.5, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Rancaekek", "spk_target_eom": 36, "spk_actual": 36, "spk_ach_target": 100.0, "spk_ach_july": 156.5, "rs_target_eom": 33, "rs_actual": 35, "rs_ach_target": 106.1, "rs_ach_july": 116.7, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Setiabudi", "spk_target_eom": 41, "spk_actual": 39, "spk_ach_target": 95.1, "spk_ach_july": 100.0, "rs_target_eom": 38, "rs_actual": 25, "rs_ach_target": 65.8, "rs_ach_july": 83.3, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Soekarno Hatta", "spk_target_eom": 55, "spk_actual": 48, "spk_ach_target": 87.3, "spk_ach_july": 88.9, "rs_target_eom": 51, "rs_actual": 40, "rs_ach_target": 78.4, "rs_ach_july": 87.0, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Sukabumi", "spk_target_eom": 38, "spk_actual": 41, "spk_ach_target": 107.9, "spk_ach_july": 107.9, "rs_target_eom": 33, "rs_actual": 45, "rs_ach_target": 136.4, "rs_ach_july": 104.7, "is_current_branch": false },
      { "dealer_group": "Auto2000", "branch": "AUTO2000 Soreang", "spk_target_eom": 30, "spk_actual": 30, "spk_ach_target": 100.0, "spk_ach_july": 150.0, "rs_target_eom": 28, "rs_actual": 6, "rs_ach_target": 21.4, "rs_ach_july": 200.0, "is_current_branch": false },
      { "dealer_group": "Budi Jaya", "branch": "Budi Jaya Mobilindo", "spk_target_eom": 67, "spk_actual": 58, "spk_ach_target": 86.6, "spk_ach_july": 86.6, "rs_target_eom": 51, "rs_actual": 52, "rs_ach_target": 102.0, "rs_ach_july": 100.0, "is_current_branch": false },
      { "dealer_group": "Duta Cendana", "branch": "Duta Cendana Mobilindo", "spk_target_eom": 77, "spk_actual": 85, "spk_ach_target": 110.4, "spk_ach_july": 87.6, "rs_target_eom": 58, "rs_actual": 63, "rs_ach_target": 108.6, "rs_ach_july": 110.5, "is_current_branch": false },
      { "dealer_group": "Plaza Toyota", "branch": "Plaza Toyota Bandung", "spk_target_eom": 91, "spk_actual": 107, "spk_ach_target": 117.6, "spk_ach_july": 108.1, "rs_target_eom": 72, "rs_actual": 86, "rs_ach_target": 119.4, "rs_ach_july": 108.9, "is_current_branch": false },
      { "dealer_group": "Rejeki Toyota", "branch": "Rejeki Toyota Cirebon", "spk_target_eom": 42, "spk_actual": 64, "spk_ach_target": 152.4, "spk_ach_july": 112.3, "rs_target_eom": 48, "rs_actual": 50, "rs_ach_target": 104.2, "rs_ach_july": 87.7, "is_current_branch": false },
      { "dealer_group": "Rejeki Toyota", "branch": "Rejeki Toyota Indramayu", "spk_target_eom": 32, "spk_actual": 37, "spk_ach_target": 115.6, "spk_ach_july": 185.0, "rs_target_eom": 30, "rs_actual": 24, "rs_ach_target": 80.0, "rs_ach_july": 184.6, "is_current_branch": false },
      { "dealer_group": "Rejeki Toyota", "branch": "Rejeki Toyota Sumedang", "spk_target_eom": 11, "spk_actual": 5, "spk_ach_target": 45.5, "spk_ach_july": 83.3, "rs_target_eom": 11, "rs_actual": 5, "rs_ach_target": 45.5, "rs_ach_july": 125.0, "is_current_branch": false },
      { "dealer_group": "Selamat Toyota", "branch": "Selamat Toyota Sukabumi", "spk_target_eom": 60, "spk_actual": 62, "spk_ach_target": 103.3, "spk_ach_july": 88.6, "rs_target_eom": 44, "rs_actual": 53, "rs_ach_target": 120.5, "rs_ach_july": 106.0, "is_current_branch": false },
      { "dealer_group": "Sinar Mas", "branch": "Sinar Mas Tasikmalaya", "spk_target_eom": 65, "spk_actual": 73, "spk_ach_target": 112.3, "spk_ach_july": 105.8, "rs_target_eom": 51, "rs_actual": 51, "rs_ach_target": 100.0, "rs_ach_july": 89.5, "is_current_branch": false },
      { "dealer_group": "Tunas Toyota", "branch": "Tunas Toyota Cimindi", "spk_target_eom": 83, "spk_actual": 88, "spk_ach_target": 106.0, "spk_ach_july": 123.9, "rs_target_eom": 61, "rs_actual": 61, "rs_ach_target": 100.0, "rs_ach_july": 101.7, "is_current_branch": false },
      { "dealer_group": "Tunas Toyota", "branch": "Tunas Toyota Gatot Subroto", "spk_target_eom": 67, "spk_actual": 71, "spk_ach_target": 106.0, "spk_ach_july": 94.7, "rs_target_eom": 66, "rs_actual": 60, "rs_ach_target": 90.9, "rs_ach_july": 101.7, "is_current_branch": false },
      { "dealer_group": "Tunas Toyota", "branch": "Tunas Toyota Kiara Condong", "spk_target_eom": 73, "spk_actual": 100, "spk_ach_target": 137.0, "spk_ach_july": 114.9, "rs_target_eom": 73, "rs_actual": 87, "rs_ach_target": 119.2, "rs_ach_july": 107.4, "is_current_branch": true },
      { "dealer_group": "Wijaya Toyota", "branch": "Wijaya Toyota A. Yani", "spk_target_eom": 42, "spk_actual": 47, "spk_ach_target": 111.9, "spk_ach_july": 123.7, "rs_target_eom": 40, "rs_actual": 45, "rs_ach_target": 112.5, "rs_ach_july": 125.0, "is_current_branch": false },
      { "dealer_group": "Wijaya Toyota", "branch": "Wijaya Toyota Dago", "spk_target_eom": 52, "spk_actual": 51, "spk_ach_target": 98.1, "spk_ach_july": 92.7, "rs_target_eom": 48, "rs_actual": 48, "rs_ach_target": 100.0, "rs_ach_july": 77.4, "is_current_branch": false },
      { "dealer_group": "Wijaya Toyota", "branch": "Wijaya Toyota Padalarang", "spk_target_eom": 35, "spk_actual": 17, "spk_ach_target": 48.6, "spk_ach_july": 94.4, "rs_target_eom": 33, "rs_actual": 23, "rs_ach_target": 69.7, "rs_ach_july": 176.9, "is_current_branch": false },
      { "dealer_group": "Wijaya Toyota", "branch": "Wijaya Toyota Subang", "spk_target_eom": 40, "spk_actual": 25, "spk_ach_target": 62.5, "spk_ach_july": 64.1, "rs_target_eom": 37, "rs_actual": 31, "rs_ach_target": 83.8, "rs_ach_july": 91.2, "is_current_branch": false }
    ],
    "grand_total": {
      "label": "Grand Total",
      "spk_target_eom": 1560,
      "spk_actual": 1682,
      "spk_ach_target": 107.8,
      "spk_ach_july": 106.4,
      "rs_target_eom": 1386,
      "rs_actual": 1447,
      "rs_ach_target": 104.4,
      "rs_ach_july": 103.7
    }
  };

  let regionalData = EMBEDDED_REGIONAL_DATA;
  let currentActiveTab = 'all'; // 'all' | 'dealer' | 'branch'
  let currentDealerFilter = 'all';
  let searchQuery = '';

  document.addEventListener('DOMContentLoaded', () => {
    initRegionalModule();
  });

  async function initRegionalModule() {
    bindEvents();
    renderAll();

    // Coba ambil data live dari API
    try {
      const res = await fetch('../api/api_performa_regional.php');
      const json = await res.json();
      if (json && json.status === 'success' && json.data) {
        regionalData = json.data;
        renderAll();
      }
    } catch (e) {
      console.log('Menggunakan embedded master regional data:', e);
    }
  }

  function bindEvents() {
    // Search input
    const searchInput = document.getElementById('searchBranchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = (e.target.value || '').toLowerCase().trim();
        renderBranchTable();
      });
    }

    // Dealer dropdown filter
    const dealerSelect = document.getElementById('selectDealerFilter');
    if (dealerSelect) {
      dealerSelect.addEventListener('change', (e) => {
        currentDealerFilter = e.target.value;
        renderBranchTable();
      });
    }
  }

  function renderAll() {
    renderDates();
    renderKpis();
    renderDealerTable();
    renderBranchTable();
  }

  function renderDates() {
    const elSpkDate = document.getElementById('txtSpkDate');
    const elRsDate = document.getElementById('txtRsDate');
    if (elSpkDate) elSpkDate.textContent = regionalData.spk_date || '31 August 2026';
    if (elRsDate) elRsDate.textContent = regionalData.rs_date || '31 August 2026 (Latest)';
  }

  function renderKpis() {
    const s = regionalData.summary || {};
    const gt = regionalData.grand_total || {};
    const kc = s.kiara_condong || {};
    const tg = s.tunas_group || {};

    // Total Jabar SPK
    const kpiSpkTot = document.getElementById('kpiRegSpkTot');
    const kpiSpkTgt = document.getElementById('kpiRegSpkTgt');
    const kpiSpkAch = document.getElementById('kpiRegSpkAch');
    if (kpiSpkTot) kpiSpkTot.textContent = formatNum(gt.spk_actual || 1682);
    if (kpiSpkTgt) kpiSpkTgt.textContent = formatNum(gt.spk_target_eom || 1560);
    if (kpiSpkAch) {
      const pct = gt.spk_ach_target || 107.8;
      kpiSpkAch.textContent = `${pct.toFixed(1)}% vs Target`;
      kpiSpkAch.className = `reg-kpi-badge-ach ${pct >= 100 ? 'pos' : 'neg'}`;
    }

    // Total Jabar RS AFI
    const kpiRsTot = document.getElementById('kpiRegRsTot');
    const kpiRsTgt = document.getElementById('kpiRegRsTgt');
    const kpiRsAch = document.getElementById('kpiRegRsAch');
    if (kpiRsTot) kpiRsTot.textContent = formatNum(gt.rs_actual || 1447);
    if (kpiRsTgt) kpiRsTgt.textContent = formatNum(gt.rs_target_eom || 1386);
    if (kpiRsAch) {
      const pct = gt.rs_ach_target || 104.4;
      kpiRsAch.textContent = `${pct.toFixed(1)}% vs Target`;
      kpiRsAch.className = `reg-kpi-badge-ach ${pct >= 100 ? 'pos' : 'neg'}`;
    }

    // Tunas Group
    const kpiTunasSpk = document.getElementById('kpiRegTunasSpk');
    const kpiTunasRs = document.getElementById('kpiRegTunasRs');
    if (kpiTunasSpk) kpiTunasSpk.textContent = `${tg.spk_actual} (${tg.spk_ach_vs_target}% SPK)`;
    if (kpiTunasRs) kpiTunasRs.textContent = `${tg.rs_actual} (${tg.rs_ach_vs_target}% RS)`;

    // Kiara Condong
    const kpiKirconSpk = document.getElementById('kpiRegKirconSpk');
    const kpiKirconRs = document.getElementById('kpiRegKirconRs');
    if (kpiKirconSpk) kpiKirconSpk.textContent = `${kc.spk_actual} Unit (${kc.spk_ach_vs_target}%)`;
    if (kpiKirconRs) kpiKirconRs.textContent = `${kc.rs_actual} Unit (${kc.rs_ach_vs_target}%)`;
  }

  function renderDealerTable() {
    const tbody = document.getElementById('dealerTableBody');
    if (!tbody) return;

    const list = regionalData.by_dealer || [];
    const gt = regionalData.grand_total || {};

    let html = '';
    list.forEach(row => {
      const isTunas = row.dealer === 'Tunas Toyota';
      html += `
        <tr class="${isTunas ? 'reg-row-kircon' : ''}">
          <td class="reg-td-name">
            ${escapeHtml(row.dealer)}
            ${isTunas ? '<span class="reg-badge-kircon">Grup Anda</span>' : ''}
          </td>
          <td class="reg-td-num">${formatNum(row.spk_target_eom)}</td>
          <td class="reg-td-num">${formatNum(row.spk_actual)}</td>
          <td class="reg-td-ach ${getAchClass(row.spk_ach_target)}">${formatPct(row.spk_ach_target)}</td>
          <td class="reg-td-ach reg-col-divider ${getAchClass(row.spk_ach_july)}">${formatPct(row.spk_ach_july)}</td>
          <td class="reg-td-num">${formatNum(row.rs_target_eom)}</td>
          <td class="reg-td-num">${formatNum(row.rs_actual)}</td>
          <td class="reg-td-ach ${getAchClass(row.rs_ach_target)}">${formatPct(row.rs_ach_target)}</td>
          <td class="reg-td-ach ${getAchClass(row.rs_ach_july)}">${formatPct(row.rs_ach_july)}</td>
        </tr>
      `;
    });

    // Grand Total
    html += `
      <tr class="reg-row-total">
        <td class="reg-td-name">${escapeHtml(gt.label || 'Grand Total')}</td>
        <td class="reg-td-num">${formatNum(gt.spk_target_eom)}</td>
        <td class="reg-td-num">${formatNum(gt.spk_actual)}</td>
        <td class="reg-td-ach ${getAchClass(gt.spk_ach_target)}">${formatPct(gt.spk_ach_target)}</td>
        <td class="reg-td-ach reg-col-divider ${getAchClass(gt.spk_ach_july)}">${formatPct(gt.spk_ach_july)}</td>
        <td class="reg-td-num">${formatNum(gt.rs_target_eom)}</td>
        <td class="reg-td-num">${formatNum(gt.rs_actual)}</td>
        <td class="reg-td-ach ${getAchClass(gt.rs_ach_target)}">${formatPct(gt.rs_ach_target)}</td>
        <td class="reg-td-ach ${getAchClass(gt.rs_ach_july)}">${formatPct(gt.rs_ach_july)}</td>
      </tr>
    `;

    tbody.innerHTML = html;
  }

  function renderBranchTable() {
    const tbody = document.getElementById('branchTableBody');
    if (!tbody) return;

    let branches = regionalData.by_branch || [];
    const countBadge = document.getElementById('badgeBranchCount');

    // Filter
    if (currentDealerFilter && currentDealerFilter !== 'all') {
      branches = branches.filter(b => b.dealer_group === currentDealerFilter);
    }
    if (searchQuery) {
      branches = branches.filter(b => 
        b.branch.toLowerCase().includes(searchQuery) || 
        b.dealer_group.toLowerCase().includes(searchQuery)
      );
    }

    if (countBadge) {
      countBadge.textContent = `${branches.length} Cabang Ditampilkan`;
    }

    if (branches.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="reg-empty-state">
            <i class="fa-solid fa-building-circle-xmark" style="font-size:24px; margin-bottom:8px; display:block; color:#cbd5e1;"></i>
            Tidak ada data cabang yang sesuai dengan pencarian "${escapeHtml(searchQuery)}"
          </td>
        </tr>
      `;
      return;
    }

    let sumSpkTgt = 0, sumSpkAct = 0, sumRsTgt = 0, sumRsAct = 0;

    let html = '';
    branches.forEach(row => {
      sumSpkTgt += (row.spk_target_eom || 0);
      sumSpkAct += (row.spk_actual || 0);
      sumRsTgt += (row.rs_target_eom || 0);
      sumRsAct += (row.rs_actual || 0);

      const isKircon = row.is_current_branch || row.branch.toLowerCase().includes('kiara condong');

      html += `
        <tr class="${isKircon ? 'reg-row-kircon' : ''}">
          <td class="reg-td-name">
            ${escapeHtml(row.branch)}
            ${isKircon ? '<span class="reg-badge-kircon"><i class="fa-solid fa-star"></i> Cabang Anda</span>' : ''}
          </td>
          <td class="reg-td-num">${formatNum(row.spk_target_eom)}</td>
          <td class="reg-td-num">${formatNum(row.spk_actual)}</td>
          <td class="reg-td-ach ${getAchClass(row.spk_ach_target)}">${formatPct(row.spk_ach_target)}</td>
          <td class="reg-td-ach reg-col-divider ${getAchClass(row.spk_ach_july)}">${formatPct(row.spk_ach_july)}</td>
          <td class="reg-td-num">${formatNum(row.rs_target_eom)}</td>
          <td class="reg-td-num">${formatNum(row.rs_actual)}</td>
          <td class="reg-td-ach ${getAchClass(row.rs_ach_target)}">${formatPct(row.rs_ach_target)}</td>
          <td class="reg-td-ach ${getAchClass(row.rs_ach_july)}">${formatPct(row.rs_ach_july)}</td>
        </tr>
      `;
    });

    // Grand total atau Subtotal jika difilter
    const isFiltered = (currentDealerFilter !== 'all') || (searchQuery !== '');
    const totalLabel = isFiltered ? `Subtotal (${branches.length} Cabang)` : 'Grand Total';
    const totalSpkAchTarget = sumSpkTgt > 0 ? (sumSpkAct / sumSpkTgt) * 100 : 0;
    const totalRsAchTarget = sumRsTgt > 0 ? (sumRsAct / sumRsTgt) * 100 : 0;
    
    // Gunakan total asli gambar jika tidak difilter
    const gt = regionalData.grand_total || {};
    const displaySpkTgt = isFiltered ? sumSpkTgt : gt.spk_target_eom;
    const displaySpkAct = isFiltered ? sumSpkAct : gt.spk_actual;
    const displaySpkAch = isFiltered ? totalSpkAchTarget : gt.spk_ach_target;
    const displaySpkJul = isFiltered ? '-' : formatPct(gt.spk_ach_july);
    const displayRsTgt = isFiltered ? sumRsTgt : gt.rs_target_eom;
    const displayRsAct = isFiltered ? sumRsAct : gt.rs_actual;
    const displayRsAch = isFiltered ? totalRsAchTarget : gt.rs_ach_target;
    const displayRsJul = isFiltered ? '-' : formatPct(gt.rs_ach_july);

    html += `
      <tr class="reg-row-total">
        <td class="reg-td-name">${escapeHtml(totalLabel)}</td>
        <td class="reg-td-num">${formatNum(displaySpkTgt)}</td>
        <td class="reg-td-num">${formatNum(displaySpkAct)}</td>
        <td class="reg-td-ach ${getAchClass(displaySpkAch)}">${typeof displaySpkAch === 'number' ? formatPct(displaySpkAch) : displaySpkAch}</td>
        <td class="reg-td-ach reg-col-divider ${isFiltered ? '' : getAchClass(gt.spk_ach_july)}">${displaySpkJul}</td>
        <td class="reg-td-num">${formatNum(displayRsTgt)}</td>
        <td class="reg-td-num">${formatNum(displayRsAct)}</td>
        <td class="reg-td-ach ${getAchClass(displayRsAch)}">${typeof displayRsAch === 'number' ? formatPct(displayRsAch) : displayRsAch}</td>
        <td class="reg-td-ach ${isFiltered ? '' : getAchClass(gt.rs_ach_july)}">${displayRsJul}</td>
      </tr>
    `;

    tbody.innerHTML = html;
  }

  // Tab Switcher
  window.switchRegionalTab = function(tabName) {
    currentActiveTab = tabName;

    const btnAll = document.getElementById('tabBtnAll');
    const btnDealer = document.getElementById('tabBtnDealer');
    const btnBranch = document.getElementById('tabBtnBranch');

    const secDealer = document.getElementById('secDealerCard');
    const secBranch = document.getElementById('secBranchCard');

    [btnAll, btnDealer, btnBranch].forEach(b => b && b.classList.remove('active'));

    if (tabName === 'all') {
      btnAll && btnAll.classList.add('active');
      secDealer && (secDealer.style.display = 'block');
      secBranch && (secBranch.style.display = 'block');
    } else if (tabName === 'dealer') {
      btnDealer && btnDealer.classList.add('active');
      secDealer && (secDealer.style.display = 'block');
      secBranch && (secBranch.style.display = 'none');
    } else if (tabName === 'branch') {
      btnBranch && btnBranch.classList.add('active');
      secDealer && (secDealer.style.display = 'none');
      secBranch && (secBranch.style.display = 'block');
    }
  };

  // Helper Functions
  function getAchClass(val) {
    if (val === null || val === undefined || isNaN(val)) return '';
    return Number(val) >= 100.0 ? 'reg-ach-green' : 'reg-ach-red';
  }

  function formatPct(val) {
    if (val === null || val === undefined || isNaN(val)) return '-';
    return Number(val).toFixed(1) + '%';
  }

  function formatNum(val) {
    if (val === null || val === undefined || isNaN(val)) return '0';
    return Number(val).toLocaleString('id-ID');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Export CSV
  window.exportRegionalCSV = function() {
    let csv = 'Laporan Performa Penjualan Regional West Java\n';
    csv += `Periode Cutoff: SPK ${regionalData.spk_date} | RS AFI ${regionalData.rs_date}\n\n`;

    // a. by Dealer
    csv += 'a. by Dealer\n';
    csv += 'Dealer West Java,Target EOM SPK,Actual SPK,Ach vs Target EOM SPK (%),Ach vs SPK July (%),Target EOM RS,Actual RS,Ach vs Target EOM RS (%),Ach vs RS July (%)\n';
    (regionalData.by_dealer || []).forEach(d => {
      csv += `"${d.dealer}",${d.spk_target_eom},${d.spk_actual},${d.spk_ach_target}%,${d.spk_ach_july}%,${d.rs_target_eom},${d.rs_actual},${d.rs_ach_target}%,${d.rs_ach_july}%\n`;
    });
    const gt = regionalData.grand_total || {};
    csv += `"Grand Total",${gt.spk_target_eom},${gt.spk_actual},${gt.spk_ach_target}%,${gt.spk_ach_july}%,${gt.rs_target_eom},${gt.rs_actual},${gt.rs_ach_target}%,${gt.rs_ach_july}%\n\n`;

    // b. by Branch
    csv += 'b. by Branch\n';
    csv += 'Dealer West Java (Branch),Target EOM SPK,Actual SPK,Ach vs Target EOM SPK (%),Ach vs SPK July (%),Target EOM RS,Actual RS,Ach vs Target EOM RS (%),Ach vs RS July (%)\n';
    (regionalData.by_branch || []).forEach(b => {
      csv += `"${b.branch}",${b.spk_target_eom},${b.spk_actual},${b.spk_ach_target}%,${b.spk_ach_july}%,${b.rs_target_eom},${b.rs_actual},${b.rs_ach_target}%,${b.rs_ach_july}%\n`;
    });
    csv += `"Grand Total",${gt.spk_target_eom},${gt.spk_actual},${gt.spk_ach_target}%,${gt.spk_ach_july}%,${gt.rs_target_eom},${gt.rs_actual},${gt.rs_ach_target}%,${gt.rs_ach_july}%\n`;

    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Performa_Regional_West_Java_${regionalData.period.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Report
  window.printRegionalReport = function() {
    window.print();
  };

})(window, document);
