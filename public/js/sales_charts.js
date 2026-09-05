/**
 * ==========================================================================
 * TOYOTA KC SALES DASHBOARD - CHARTS ENGINE (APEXCHARTS)
 * ==========================================================================
 */

const ChartsEngine = (() => {
  const instances = {};

  function isDarkMode() {
    return document.documentElement.getAttribute('data-theme') === 'dark';
  }

  function getChartThemeColors() {
    const dark = isDarkMode();
    return {
      mode: dark ? 'dark' : 'light',
      background: 'transparent',
      textColor: dark ? '#94a3b8' : '#475569',
      titleColor: dark ? '#f8fafc' : '#1e293b',
      gridColor: dark ? '#1e293b' : '#f1f5f9',
      borderColor: dark ? '#334155' : '#cbd5e1',
      tooltipTheme: dark ? 'dark' : 'light'
    };
  }

  const PALETTES = {
    primary: ['#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    multi: ['#1d4ed8', '#059669', '#d97706', '#7c3aed', '#0284c7', '#db2777', '#ea580c', '#4f46e5'],
    leasing: ['#1d4ed8', '#d97706', '#059669', '#7c3aed', '#0284c7', '#db2777', '#64748b'],
    spv: ['#1d4ed8', '#059669', '#d97706'],
    payment: ['#1d4ed8', '#059669'],
    pma: ['#1d4ed8', '#ea580c']
  };

  function renderChart(elementId, options) {
    const el = document.getElementById(elementId);
    if (!el) return null;

    if (instances[elementId]) {
      instances[elementId].destroy();
      instances[elementId] = null;
    }

    try {
      const chart = new ApexCharts(el, options);
      chart.render();
      instances[elementId] = chart;
      return chart;
    } catch (err) {
      console.error(`Error rendering chart ${elementId}:`, err);
      return null;
    }
  }

  // ========================================================================
  // 1. OVERVIEW CHARTS
  // ========================================================================

  function renderMonthlyTrend(monthlyData) {
    const theme = getChartThemeColors();
    const categories = monthlyData.map(m => m.monthName);
    const qtySeries = monthlyData.map(m => m.qty);
    const otrSeries = monthlyData.map(m => Math.round(m.otr / 1_000_000_000 * 10) / 10);

    const options = {
      series: [
        { name: 'Volume Unit', type: 'column', data: qtySeries },
        { name: 'Omset OTR (Miliar Rp)', type: 'line', data: otrSeries }
      ],
      chart: {
        height: 270,
        type: 'line',
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#1d4ed8', '#059669'],
      stroke: { width: [0, 2.5], curve: 'smooth' },
      plotOptions: {
        bar: { columnWidth: '38%', borderRadius: 4, dataLabels: { position: 'top' } }
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [0],
        formatter: (val) => val > 0 ? val : '',
        offsetY: -14,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.textColor] }
      },
      xaxis: {
        categories: categories,
        labels: { style: { colors: theme.textColor, fontSize: '11px' } },
        axisBorder: { color: theme.borderColor }
      },
      yaxis: [
        {
          title: { text: 'Unit', style: { color: '#1d4ed8', fontWeight: 700, fontSize: '10px' } },
          labels: { style: { colors: theme.textColor, fontSize: '10px' }, formatter: (val) => Math.round(val) }
        },
        {
          opposite: true,
          title: { text: 'Rp Miliar', style: { color: '#059669', fontWeight: 700, fontSize: '10px' } },
          labels: { style: { colors: theme.textColor, fontSize: '10px' }, formatter: (val) => 'Rp ' + val + ' M' }
        }
      ],
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: {
        theme: theme.tooltipTheme,
        shared: true,
        intersect: false,
        y: {
          formatter: function (y, { seriesIndex }) {
            if (typeof y !== "undefined") {
              if (seriesIndex === 0) return y + ' Unit';
              return 'Rp ' + y.toLocaleString('id-ID') + ' Miliar';
            }
            return y;
          }
        }
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '11px',
        labels: { colors: theme.titleColor }
      }
    };

    renderChart('chart-monthly-trend', options);
  }

  function renderTopModels(modelsData) {
    const theme = getChartThemeColors();
    const top6 = modelsData.slice(0, 6);
    const categories = top6.map(m => m.model);
    const seriesData = top6.map(m => m.qty);

    const options = {
      series: [{ name: 'Unit Terjual', data: seriesData }],
      chart: {
        type: 'bar',
        height: 270,
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#1d4ed8'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          barHeight: '50%',
          dataLabels: { position: 'right' }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + ' Unit',
        offsetX: 6,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.titleColor] }
      },
      xaxis: {
        categories: categories,
        labels: { style: { colors: theme.textColor, fontSize: '10px' } },
        axisBorder: { color: theme.borderColor }
      },
      yaxis: {
        labels: { style: { colors: theme.titleColor, fontWeight: 700, fontSize: '11px' } }
      },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => val + ' Unit' }
      }
    };

    renderChart('chart-top-models', options);
  }

  function renderSPVPerformance(spvData) {
    const theme = getChartThemeColors();
    const series = spvData.map(s => s.qty);
    const labels = spvData.map(s => `${s.spv} (${s.qty} Unit)`);

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 270,
        background: theme.background
      },
      colors: PALETTES.spv,
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Penjualan',
                fontSize: '11px',
                color: theme.textColor,
                formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' Unit'
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        fontSize: '11px',
        labels: { colors: theme.titleColor }
      },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => val + ' Unit' }
      }
    };

    renderChart('chart-spv-performance', options);
  }

  function renderPaymentMethod(kpis) {
    const theme = getChartThemeColors();
    const series = [kpis.kreditQty, kpis.cashQty];
    const labels = [`Kredit (${kpis.kreditQty} Unit)`, `Cash (${kpis.cashQty} Unit)`];

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 270,
        background: theme.background
      },
      colors: ['#1d4ed8', '#059669'],
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Rasio Kredit',
                fontSize: '11px',
                color: theme.textColor,
                formatter: () => AnalyticsEngine.formatPercent(kpis.kreditRate)
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        fontSize: '11px',
        labels: { colors: theme.titleColor }
      },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => val + ' Unit' }
      }
    };

    renderChart('chart-payment-method', options);
  }

  // ========================================================================
  // 2. PRODUCT & VEHICLE CHARTS
  // ========================================================================

  function renderAllModelsChart(modelsData) {
    const theme = getChartThemeColors();
    const categories = modelsData.map(m => m.model);
    const seriesData = modelsData.map(m => m.qty);

    const options = {
      series: [{ name: 'Unit Terjual', data: seriesData }],
      chart: {
        type: 'bar',
        height: 380,
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#1d4ed8'],
      plotOptions: {
        bar: {
          borderRadius: 4,
          horizontal: true,
          barHeight: '60%',
          dataLabels: { position: 'right' }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + ' Unit',
        offsetX: 8,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.titleColor] }
      },
      xaxis: {
        categories: categories,
        labels: { style: { colors: theme.textColor, fontSize: '10px' } }
      },
      yaxis: {
        labels: { style: { colors: theme.titleColor, fontWeight: 700, fontSize: '11px' } }
      },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: {
        theme: theme.tooltipTheme,
        y: {
          formatter: (val, { dataPointIndex }) => {
            const m = modelsData[dataPointIndex];
            const otrText = AnalyticsEngine.formatCompactRupiah(m.otr);
            return `${val} Unit (Omset: ${otrText})`;
          }
        }
      }
    };

    renderChart('chart-all-models', options);
  }

  function renderSegmentShare(segmentsData) {
    const theme = getChartThemeColors();
    const series = segmentsData.map(s => s.qty);
    const labels = segmentsData.map(s => s.segment);

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 340,
        background: theme.background
      },
      colors: PALETTES.multi,
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Unit',
                fontSize: '11px',
                color: theme.textColor,
                formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' Unit'
              }
            }
          }
        }
      },
      legend: {
        position: 'bottom',
        fontSize: '11px',
        labels: { colors: theme.titleColor }
      },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => val + ' Unit' }
      }
    };

    renderChart('chart-segment-share', options);
  }

  function renderColorChart(colorsData) {
    const theme = getChartThemeColors();
    const categories = colorsData.map(c => c.color);
    const seriesData = colorsData.map(c => c.qty);

    const options = {
      series: [{ name: 'Jumlah Unit', data: seriesData }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#64748b'],
      plotOptions: {
        bar: { borderRadius: 4, horizontal: true, barHeight: '45%' }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + ' Unit',
        style: { fontSize: '10px', colors: [theme.titleColor] }
      },
      xaxis: { categories: categories, labels: { style: { colors: theme.textColor, fontSize: '10px' } } },
      yaxis: { labels: { style: { colors: theme.textColor, fontSize: '10px' } } },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: { theme: theme.tooltipTheme }
    };

    renderChart('chart-colors', options);
  }

  // ========================================================================
  // 3. FINANCIAL & LEASING CHARTS
  // ========================================================================

  function renderLeasingChart(leasingData) {
    const theme = getChartThemeColors();
    const series = leasingData.map(l => l.qty);
    const labels = leasingData.map(l => `${l.leasing} (${l.qty} Unit)`);

    const options = {
      series: series,
      labels: labels,
      chart: {
        type: 'donut',
        height: 310,
        background: theme.background
      },
      colors: PALETTES.leasing,
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total Kredit',
                fontSize: '11px',
                color: theme.textColor,
                formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' Unit'
              }
            }
          }
        }
      },
      legend: { position: 'bottom', fontSize: '11px', labels: { colors: theme.titleColor } },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => val + ' Unit' }
      }
    };

    renderChart('chart-leasing-share', options);
  }

  function renderAvgDiscountChart(modelsData) {
    const theme = getChartThemeColors();
    const relevantModels = modelsData.filter(m => m.qty >= 5).map(m => ({
      model: m.model,
      avgDisc: Math.round(m.discount / m.qty / 1_000_000 * 10) / 10
    }));
    relevantModels.sort((a, b) => b.avgDisc - a.avgDisc);

    const categories = relevantModels.map(m => m.model);
    const seriesData = relevantModels.map(m => m.avgDisc);

    const options = {
      series: [{ name: 'Rata-rata Diskon (Juta Rp)', data: seriesData }],
      chart: {
        type: 'bar',
        height: 310,
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#d97706'],
      plotOptions: {
        bar: { borderRadius: 4, horizontal: true, barHeight: '50%' }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => 'Rp ' + val + ' Jt',
        offsetX: 8,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.titleColor] }
      },
      xaxis: {
        categories: categories,
        labels: { style: { colors: theme.textColor, fontSize: '10px' } }
      },
      yaxis: { labels: { style: { colors: theme.titleColor, fontWeight: 700, fontSize: '11px' } } },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: {
        theme: theme.tooltipTheme,
        y: { formatter: (val) => 'Rp ' + val + ' Juta / Unit' }
      }
    };

    renderChart('chart-avg-discount', options);
  }

  // ========================================================================
  // 4. DEMOGRAPHIC & PROSPECT CHARTS
  // ========================================================================

  function renderPMAChart(kpis) {
    const theme = getChartThemeColors();
    const series = [kpis.pmaQty, kpis.nonPmaQty];
    const labels = [`PMA (${kpis.pmaQty} Unit)`, `Non PMA (${kpis.nonPmaQty} Unit)`];

    const options = {
      series: series,
      labels: labels,
      chart: { type: 'donut', height: 280, background: theme.background },
      colors: PALETTES.pma,
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'PMA Share',
                fontSize: '11px',
                formatter: () => AnalyticsEngine.formatPercent(kpis.pmaRate)
              }
            }
          }
        }
      },
      legend: { position: 'bottom', fontSize: '11px', labels: { colors: theme.titleColor } },
      tooltip: { theme: theme.tooltipTheme, y: { formatter: (val) => val + ' Unit' } }
    };

    renderChart('chart-pma-share', options);
  }

  function renderProspectSourceChart(prospectData) {
    const theme = getChartThemeColors();
    const categories = prospectData.map(p => p.source);
    const seriesData = prospectData.map(p => p.qty);

    const options = {
      series: [{ name: 'Unit Terjual', data: seriesData }],
      chart: {
        type: 'bar',
        height: 280,
        toolbar: { show: false },
        background: theme.background
      },
      colors: ['#0284c7'],
      plotOptions: {
        bar: { borderRadius: 4, horizontal: true, barHeight: '50%' }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + ' Unit',
        offsetX: 6,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.titleColor] }
      },
      xaxis: { categories: categories, labels: { style: { colors: theme.textColor, fontSize: '10px' } } },
      yaxis: { labels: { style: { colors: theme.titleColor, fontWeight: 700, fontSize: '11px' } } },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: { theme: theme.tooltipTheme, y: { formatter: (val) => val + ' Unit' } }
    };

    renderChart('chart-prospect-source', options);
  }

  function renderBuyerProfileChart(buyerProfileData) {
    const theme = getChartThemeColors();
    const series = buyerProfileData.map(b => b.qty);
    const labels = buyerProfileData.map(b => `${b.profile} (${b.qty} Unit)`);

    const options = {
      series: series,
      labels: labels,
      chart: { type: 'donut', height: 280, background: theme.background },
      colors: ['#1d4ed8', '#059669', '#d97706'],
      stroke: { colors: [isDarkMode() ? '#0f172a' : '#ffffff'], width: 2 },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Profil Pembeli',
                fontSize: '11px',
                color: theme.textColor,
                formatter: (w) => w.globals.seriesTotals.reduce((a, b) => a + b, 0) + ' Unit'
              }
            }
          }
        }
      },
      dataLabels: { enabled: false },
      legend: { position: 'bottom', fontSize: '11px', labels: { colors: theme.titleColor } },
      tooltip: { theme: theme.tooltipTheme, y: { formatter: (val) => val + ' Unit' } }
    };

    renderChart('chart-buyer-profile', options);
  }

  function renderTopCitiesChart(areaData) {
    const theme = getChartThemeColors();
    const top6 = areaData.slice(0, 6);
    const categories = top6.map(a => a.city);
    const seriesData = top6.map(a => a.qty);

    const options = {
      series: [{ name: 'Unit Terjual', data: seriesData }],
      chart: { type: 'bar', height: 280, toolbar: { show: false }, background: theme.background },
      colors: ['#7c3aed'],
      plotOptions: {
        bar: { borderRadius: 4, horizontal: true, barHeight: '50%' }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val + ' Unit',
        offsetX: 6,
        style: { fontSize: '10px', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, colors: [theme.titleColor] }
      },
      xaxis: { categories: categories, labels: { style: { colors: theme.textColor, fontSize: '10px' } } },
      yaxis: { labels: { style: { colors: theme.titleColor, fontWeight: 700, fontSize: '11px' } } },
      grid: { borderColor: theme.gridColor, strokeDashArray: 3 },
      tooltip: { theme: theme.tooltipTheme }
    };

    renderChart('chart-top-cities', options);
  }

  function refreshTheme() {
    Object.values(instances).forEach(chart => {
      if (chart) {
        chart.updateOptions({
          theme: { mode: isDarkMode() ? 'dark' : 'light' }
        });
      }
    });
  }

  return {
    renderMonthlyTrend,
    renderTopModels,
    renderSPVPerformance,
    renderPaymentMethod,
    renderAllModelsChart,
    renderSegmentShare,
    renderColorChart,
    renderLeasingChart,
    renderAvgDiscountChart,
    renderPMAChart,
    renderProspectSourceChart,
    renderBuyerProfileChart,
    renderTopCitiesChart,
    refreshTheme
  };
})();

window.ChartsEngine = ChartsEngine;
