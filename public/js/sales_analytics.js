/**
 * ==========================================================================
 * TOYOTA KC SALES DASHBOARD - ANALYTICS & CALCULATION ENGINE
 * ==========================================================================
 */

const AnalyticsEngine = (() => {
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  const MONTH_NAMES = {
    'Jan': 'Januari',
    'Feb': 'Februari',
    'Mar': 'Maret',
    'Apr': 'April',
    'May': 'Mei',
    'Jun': 'Juni',
    'Jul': 'Juli'
  };

  // Format currency to Indonesian Rupiah
  function formatRupiah(amount, compact = false) {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
    const abs = Math.abs(amount);

    if (compact) {
      if (abs >= 1_000_000_000) {
        return (amount < 0 ? '-Rp ' : 'Rp ') + (abs / 1_000_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 2 }) + ' M';
      }
      if (abs >= 1_000_000) {
        return (amount < 0 ? '-Rp ' : 'Rp ') + (abs / 1_000_000).toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Jt';
      }
    }

    return (amount < 0 ? '-Rp ' : 'Rp ') + Math.round(abs).toLocaleString('id-ID');
  }

  // Format standard integer with dot separators
  function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    return Number(num).toLocaleString('id-ID');
  }

  // Format percentage
  function formatPercent(val, decimals = 1) {
    if (val === undefined || val === null || isNaN(val)) return '0%';
    return val.toFixed(decimals) + '%';
  }

  // Segment classification for Toyota models
  function getModelSegment(model) {
    const m = (model || '').toUpperCase();
    if (m.includes('HYBRID') || m.includes('HEV') || m.includes('ZENIX HYBRID') || m.includes('ALPHARD HYBRID')) return 'Elektrifikasi / Hybrid';
    if (m.includes('CALYA') || m.includes('AGYA')) return 'LCGC & City Car';
    if (m.includes('AVANZA') || m.includes('VELOZ') || m.includes('REBORN') || m.includes('ZENIX GAS')) return 'MPV Keluarga';
    if (m.includes('RUSH') || m.includes('RAIZE') || m.includes('FORTUNER') || m.includes('LANDCRUISER') || m.includes('YARIS CROSS')) return 'SUV & Crossover';
    if (m.includes('HIACE') || m.includes('HILUX')) return 'Komersial & Niaga';
    return 'Lainnya';
  }

  // Filter dataset based on active filter criteria
  function filterData(data, filters = {}) {
    if (!Array.isArray(data)) return [];

    return data.filter(item => {
      // 1. Month filter
      if (filters.month && filters.month !== 'ALL' && item.month !== filters.month) {
        return false;
      }
      // 2. SPV filter
      if (filters.spv && filters.spv !== 'ALL' && item.spv !== filters.spv) {
        return false;
      }
      // 3. Model filter
      if (filters.model && filters.model !== 'ALL' && item.model !== filters.model) {
        return false;
      }
      // 4. Payment Method filter
      if (filters.method && filters.method !== 'ALL' && item.method !== filters.method) {
        return false;
      }
      // 5. PMA filter
      if (filters.pma && filters.pma !== 'ALL' && item.pma !== filters.pma) {
        return false;
      }
      // 6. Leasing filter
      if (filters.leasing && filters.leasing !== 'ALL' && item.leasing !== filters.leasing) {
        return false;
      }
      return true;
    });
  }

  // Calculate master KPIs
  function calculateKPIs(data) {
    let totalQty = 0;
    let totalOTR = 0;
    let totalAR = 0;
    let totalDiscount = 0;
    let kreditQty = 0;
    let cashQty = 0;
    let pmaQty = 0;
    let nonPmaQty = 0;

    data.forEach(item => {
      const q = item.qty || 0;
      totalQty += q;
      totalOTR += item.otr || 0;
      totalAR += item.ar || 0;
      totalDiscount += item.disc || 0;

      if (item.method === 'CASH') {
        cashQty += q;
      } else {
        kreditQty += q;
      }

      if (item.pma === 'PMA') {
        pmaQty += q;
      } else {
        nonPmaQty += q;
      }
    });

    const avgOTR = totalQty > 0 ? totalOTR / totalQty : 0;
    const avgDiscount = totalQty > 0 ? totalDiscount / totalQty : 0;
    const discountRate = totalOTR > 0 ? (totalDiscount / totalOTR) * 100 : 0;
    const kreditRate = totalQty > 0 ? (kreditQty / totalQty) * 100 : 0;
    const cashRate = totalQty > 0 ? (cashQty / totalQty) * 100 : 0;
    const pmaRate = totalQty > 0 ? (pmaQty / totalQty) * 100 : 0;
    const arRealizationRate = totalOTR > 0 ? (totalAR / totalOTR) * 100 : 0;

    return {
      totalQty,
      totalOTR,
      totalAR,
      totalDiscount,
      avgOTR,
      avgDiscount,
      discountRate,
      kreditQty,
      cashQty,
      kreditRate,
      cashRate,
      pmaQty,
      nonPmaQty,
      pmaRate,
      arRealizationRate,
      recordCount: data.length
    };
  }

  // Monthly breakdown for trend charts
  function getMonthlyTrend(data) {
    const monthly = {};
    MONTHS.forEach(m => {
      monthly[m] = {
        month: m,
        monthName: MONTH_NAMES[m],
        qty: 0,
        otr: 0,
        ar: 0,
        discount: 0,
        kreditQty: 0,
        cashQty: 0
      };
    });

    data.forEach(item => {
      const m = item.month;
      if (monthly[m]) {
        const q = item.qty || 0;
        monthly[m].qty += q;
        monthly[m].otr += item.otr || 0;
        monthly[m].ar += item.ar || 0;
        monthly[m].discount += item.disc || 0;
        if (item.method === 'CASH') {
          monthly[m].cashQty += q;
        } else {
          monthly[m].kreditQty += q;
        }
      }
    });

    return MONTHS.map(m => monthly[m]);
  }

  // Aggregate by Model
  function getModelBreakdown(data) {
    const map = {};

    data.forEach(item => {
      const m = item.model || 'LAINNYA';
      if (!map[m]) {
        map[m] = {
          model: m,
          qty: 0,
          otr: 0,
          discount: 0,
          segment: getModelSegment(m)
        };
      }
      map[m].qty += item.qty || 0;
      map[m].otr += item.otr || 0;
      map[m].discount += item.disc || 0;
    });

    const list = Object.values(map);
    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by Segment
  function getSegmentBreakdown(data) {
    const map = {};
    data.forEach(item => {
      const seg = getModelSegment(item.model);
      if (!map[seg]) {
        map[seg] = { segment: seg, qty: 0, otr: 0 };
      }
      map[seg].qty += item.qty || 0;
      map[seg].otr += item.otr || 0;
    });
    const list = Object.values(map);
    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by Supervisor
  function getSPVBreakdown(data) {
    const map = {};
    const salesSets = {};

    data.forEach(item => {
      const spv = item.spv || 'UNKNOWN';
      if (!map[spv]) {
        map[spv] = {
          spv: spv,
          qty: 0,
          otr: 0,
          discount: 0,
          salesCount: 0
        };
        salesSets[spv] = new Set();
      }
      map[spv].qty += item.qty || 0;
      map[spv].otr += item.otr || 0;
      map[spv].discount += item.disc || 0;
      if (item.sales) salesSets[spv].add(item.sales);
    });

    const list = Object.values(map).map(item => {
      item.salesCount = salesSets[item.spv] ? salesSets[item.spv].size : 0;
      item.avgPerSales = item.salesCount > 0 ? (item.qty / item.salesCount).toFixed(1) : 0;
      return item;
    });

    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by Salesperson with monthly matrix
  function getSalesmanLeaderboard(data) {
    const map = {};

    data.forEach(item => {
      const sales = item.sales || 'UNKNOWN';
      if (!map[sales]) {
        map[sales] = {
          sales: sales,
          spv: item.spv || '-',
          totalQty: 0,
          totalOTR: 0,
          totalDiscount: 0,
          monthly: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0 }
        };
      }
      const q = item.qty || 0;
      map[sales].totalQty += q;
      map[sales].totalOTR += item.otr || 0;
      map[sales].totalDiscount += item.disc || 0;
      if (map[sales].monthly[item.month] !== undefined) {
        map[sales].monthly[item.month] += q;
      }
    });

    const list = Object.values(map);
    list.sort((a, b) => {
      if (b.totalQty !== a.totalQty) return b.totalQty - a.totalQty;
      return b.totalOTR - a.totalOTR;
    });

    // Assign rank
    list.forEach((item, index) => {
      item.rank = index + 1;
      item.avgDiscount = item.totalQty > 0 ? item.totalDiscount / item.totalQty : 0;
    });

    return list;
  }

  // Aggregate by Leasing
  function getLeasingBreakdown(data) {
    const map = {};
    let totalKredit = 0;

    data.forEach(item => {
      if (item.method === 'KREDIT') {
        const l = item.leasing || 'OTHERS';
        const q = item.qty || 0;
        map[l] = (map[l] || 0) + q;
        totalKredit += q;
      }
    });

    const list = Object.entries(map).map(([leasing, qty]) => ({
      leasing,
      qty,
      percent: totalKredit > 0 ? (qty / totalKredit) * 100 : 0
    }));

    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by Prospect Source
  function getProspectBreakdown(data) {
    const map = {};
    let total = 0;
    data.forEach(item => {
      const p = item.prospect || 'LAINNYA';
      const q = item.qty || 0;
      map[p] = (map[p] || 0) + q;
      total += q;
    });

    const list = Object.entries(map).map(([source, qty]) => ({
      source,
      qty,
      percent: total > 0 ? (qty / total) * 100 : 0
    }));
    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by Buyer Profile
  function getBuyerProfileBreakdown(data) {
    const map = {};
    let total = 0;
    data.forEach(item => {
      const bp = item.buyerProfile || 'LAINNYA';
      const q = item.qty || 0;
      map[bp] = (map[bp] || 0) + q;
      total += q;
    });

    const list = Object.entries(map).map(([profile, qty]) => ({
      profile,
      qty,
      percent: total > 0 ? (qty / total) * 100 : 0
    }));
    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Aggregate by City / Area
  function getAreaBreakdown(data) {
    const map = {};
    let total = 0;
    data.forEach(item => {
      const city = item.city || 'LAINNYA';
      const q = item.qty || 0;
      if (!map[city]) {
        map[city] = { city, qty: 0, pma: item.pma };
      }
      map[city].qty += q;
      total += q;
    });

    const list = Object.values(map).map(item => ({
      ...item,
      percent: total > 0 ? (item.qty / total) * 100 : 0
    }));
    list.sort((a, b) => b.qty - a.qty);
    return list;
  }

  // Top vehicle colors
  function getColorBreakdown(data) {
    const map = {};
    data.forEach(item => {
      const c = item.color || 'STANDAR';
      map[c] = (map[c] || 0) + (item.qty || 0);
    });
    const list = Object.entries(map).map(([color, qty]) => ({ color, qty }));
    list.sort((a, b) => b.qty - a.qty);
    return list.slice(0, 7);
  }

  // Generate automated executive narrative insight
  function generateExecutiveInsight(kpis, monthly, models, spvs) {
    if (kpis.totalQty === 0) {
      return {
        title: 'Tidak Ada Data Ditemukan',
        description: 'Tidak ada data transaksi yang memenuhi kriteria filter yang dipilih saat ini.'
      };
    }

    // Find best month
    let bestMonth = monthly[0];
    monthly.forEach(m => {
      if (m.qty > (bestMonth ? bestMonth.qty : 0)) bestMonth = m;
    });

    const topModel = models[0];
    const topSPV = spvs[0];
    const modelShare = topModel ? ((topModel.qty / kpis.totalQty) * 100).toFixed(1) : 0;

    return {
      title: 'Sorotan Kinerja Utama Toyota KC 2026',
      description: `Total pencapaian volume penjualan mencapai <strong>${formatNumber(kpis.totalQty)} unit</strong> dengan total nilai omset <strong>${formatRupiah(kpis.totalOTR, true)}</strong>. Bulan dengan penjualan tertinggi adalah <strong>${bestMonth.monthName} (${bestMonth.qty} unit)</strong>. Model <strong>${topModel ? topModel.model : '-'}</strong> memimpin pangsa pasar cabang dengan kontribusi <strong>${topModel ? topModel.qty : 0} unit (${modelShare}%)</strong>. Tim supervisor <strong>${topSPV ? topSPV.spv : '-'}</strong> mencatat kontribusi volume terbesar (<strong>${topSPV ? topSPV.qty : 0} unit</strong>). Penetrasi kredit mencapai <strong>${formatPercent(kpis.kreditRate)}</strong> dengan pasar PMA mencakup <strong>${formatPercent(kpis.pmaRate)}</strong>.`
    };
  }

  return {
    MONTHS,
    MONTH_NAMES,
    formatRupiah,
    formatCompactRupiah: (amt) => formatRupiah(amt, true),
    formatNumber,
    formatPercent,
    getModelSegment,
    filterData,
    calculateKPIs,
    getMonthlyTrend,
    getModelBreakdown,
    getSegmentBreakdown,
    getSPVBreakdown,
    getSalesmanLeaderboard,
    getLeasingBreakdown,
    getProspectBreakdown,
    getBuyerProfileBreakdown,
    getAreaBreakdown,
    getColorBreakdown,
    generateExecutiveInsight
  };
})();

window.AnalyticsEngine = AnalyticsEngine;
