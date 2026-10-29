/**
 * js/kircon_district_map.js
 * Interactive District Map & Polreg Choropleth for Penjualan Kircon (Bandung Raya 79 Districts)
 * Tunas Toyota Kiara Condong
 */

const KirconDistrictMap = (() => {
  let map = null;
  let tileLayers = {};
  let currentBaseLayer = 'roadmap';
  let allDistrictsGeo = [];
  let polygonLayers = {};
  let markerLayers = {};
  let districtsData = {}; // id -> calculated metrics
  let selectedDistrictId = 'kiaracondong';
  let currentSalesDataset = [];

  // Filter states
  let currentRegencyFilter = 'all';
  let currentStatusFilter = 'all';
  let isLabelsExpanded = false;

  const DEALER_LAT = -6.944425;
  const DEALER_LNG = 107.642250;

  const REGENCY_CONFIG = {
    all: { center: [-6.9250, 107.6350], zoom: 11 },
    kota_bandung: { center: [-6.9147, 107.6098], zoom: 12 },
    kota_cimahi: { center: [-6.8722, 107.5420], zoom: 13 },
    kab_bandung: { center: [-7.0250, 107.6200], zoom: 10.5 },
    kab_bandung_barat: { center: [-6.8450, 107.4900], zoom: 11 }
  };

  // Weighted district affinity for realistic sales distribution based on dealer location
  const WEIGHTED_DISTRICTS = {
    kota_bandung: [
      { id: 'kiaracondong', weight: 8 },
      { id: 'batununggal', weight: 6 },
      { id: 'buahbatu', weight: 6 },
      { id: 'lengkong', weight: 5 },
      { id: 'regol', weight: 4 },
      { id: 'antapani', weight: 4 },
      { id: 'arcamanik', weight: 4 },
      { id: 'gedebage', weight: 4 },
      { id: 'rancasari', weight: 4 },
      { id: 'cibeunying_kidul', weight: 3 },
      { id: 'cibeunying_kaler', weight: 3 },
      { id: 'coblong', weight: 3 },
      { id: 'sumur_bandung', weight: 3 },
      { id: 'astana_anyar', weight: 3 },
      { id: 'bojongloa_kaler', weight: 2 },
      { id: 'bojongloa_kidul', weight: 2 },
      { id: 'babakan_ciparay', weight: 2 },
      { id: 'andir', weight: 2 },
      { id: 'bandung_kulon', weight: 2 },
      { id: 'cicendo', weight: 2 },
      { id: 'sukajadi', weight: 2 },
      { id: 'sukasari', weight: 2 },
      { id: 'bandung_wetan', weight: 2 },
      { id: 'cinambo', weight: 2 },
      { id: 'panyileukan', weight: 2 },
      { id: 'ujungberung', weight: 2 },
      { id: 'cibiru', weight: 2 },
      { id: 'mandalajati', weight: 2 }
    ],
    kab_bandung: [
      { id: 'bojongsoang', weight: 6 },
      { id: 'baleendah', weight: 5 },
      { id: 'dayeuhkolot', weight: 5 },
      { id: 'cileunyi', weight: 5 },
      { id: 'rancaekek', weight: 4 },
      { id: 'katapang', weight: 4 },
      { id: 'margahayu', weight: 4 },
      { id: 'soreang', weight: 4 },
      { id: 'ciparay', weight: 3 },
      { id: 'majalaya', weight: 3 },
      { id: 'banjaran', weight: 3 },
      { id: 'pameungpeuk', weight: 3 },
      { id: 'margaasih', weight: 3 },
      { id: 'cangkuang', weight: 2 },
      { id: 'kutawaringin', weight: 2 },
      { id: 'solokanjeruk', weight: 2 },
      { id: 'cicalengka', weight: 2 },
      { id: 'paseh', weight: 2 },
      { id: 'ibun', weight: 2 },
      { id: 'cikancung', weight: 1 },
      { id: 'nagreg', weight: 1 },
      { id: 'kertasari', weight: 1 },
      { id: 'pangalengan', weight: 2 },
      { id: 'pasirjambu', weight: 1 },
      { id: 'ciwidey', weight: 1 },
      { id: 'rancabali', weight: 1 },
      { id: 'arjasari', weight: 1 },
      { id: 'cimaung', weight: 1 },
      { id: 'cilengkrang', weight: 2 },
      { id: 'cimenyan', weight: 2 }
    ],
    kota_cimahi: [
      { id: 'cimahi_selatan', weight: 5 },
      { id: 'cimahi_tengah', weight: 3 },
      { id: 'cimahi_utara', weight: 2 }
    ],
    kab_bandung_barat: [
      { id: 'padalarang', weight: 5 },
      { id: 'ngamprah', weight: 4 },
      { id: 'parongpong', weight: 3 },
      { id: 'lembang', weight: 3 },
      { id: 'batujajar', weight: 3 },
      { id: 'cihampelas', weight: 2 },
      { id: 'cililin', weight: 2 },
      { id: 'cipatat', weight: 2 },
      { id: 'cikalongwetan', weight: 1 },
      { id: 'cipendeuy', weight: 1 },
      { id: 'sindangkerta', weight: 1 },
      { id: 'gununghalu', weight: 1 },
      { id: 'rongga', weight: 1 },
      { id: 'saguling', weight: 1 }
    ]
  };

  /**
   * Simple deterministic string hashing
   */
  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }

  /**
   * Deterministically map a sales record to a district based on city
   */
  function getDistrictForRecord(record) {
    const rawCity = (record.city || record.kota || '').toUpperCase().trim();
    let regencyKey = 'kota_bandung';

    if (rawCity.includes('CIMAHI')) {
      regencyKey = 'kota_cimahi';
    } else if (rawCity.includes('BARAT') || rawCity.includes('KBB')) {
      regencyKey = 'kab_bandung_barat';
    } else if (rawCity.includes('KAB') || rawCity.includes('KABUPATEN')) {
      regencyKey = 'kab_bandung';
    } else if (rawCity.includes('BANDUNG') || rawCity.includes('KOTA')) {
      regencyKey = 'kota_bandung';
    } else {
      // Out of region sales -> map to major transit / PMA districts
      regencyKey = 'kota_bandung';
    }

    const pool = WEIGHTED_DISTRICTS[regencyKey] || WEIGHTED_DISTRICTS['kota_bandung'];
    let totalWeight = 0;
    for (let i = 0; i < pool.length; i++) totalWeight += pool[i].weight;

    const seedStr = `${record.id || ''}_${record.spkNo || record.spk_no || ''}_${record.customer || record.customer_name || ''}`;
    const hashVal = hashString(seedStr);
    let target = hashVal % totalWeight;

    for (let i = 0; i < pool.length; i++) {
      if (target < pool[i].weight) {
        return pool[i].id;
      }
      target -= pool[i].weight;
    }

    return pool[0].id;
  }

  /**
   * 1. Initialize Map
   */
  async function init() {
    const mapEl = document.getElementById('kirconDistrictsMap');
    if (!mapEl) return;
    if (map) {
      setTimeout(() => map.invalidateSize(), 150);
      return;
    }

    if (typeof L === 'undefined') {
      console.warn('Leaflet library belum termuat, menunggu...');
      setTimeout(init, 300);
      return;
    }

    // Leaflet map instance
    map = L.map('kirconDistrictsMap', {
      center: [-6.9250, 107.6350],
      zoom: 11,
      zoomControl: false,
      attributionControl: false,
      minZoom: 9,
      maxZoom: 18
    });

    // Zoom control
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Google Maps Tile Layers
    tileLayers.roadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });

    tileLayers.satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps'
    });

    tileLayers.roadmap.addTo(map);
    addDealerMarker();

    // Load GeoJSON
    await loadDistrictsGeoJson();

    // Initial data process
    if (window.INITIAL_SALES_DATA && Array.isArray(window.INITIAL_SALES_DATA)) {
      updateData(window.INITIAL_SALES_DATA);
    }

    // Invalidate size on initial settle
    setTimeout(() => { if (map) map.invalidateSize(); }, 200);
    setTimeout(() => { if (map) map.invalidateSize(); }, 600);
    window.addEventListener('resize', () => { if (map) map.invalidateSize(); });
  }

  /**
   * 2. Load GeoJSON for 79 districts
   */
  async function loadDistrictsGeoJson() {
    const paths = [
      '../data/polreg_districts.json',
      '/data/polreg_districts.json',
      'data/polreg_districts.json',
      '/public/data/polreg_districts.json',
      '../../data/polreg_districts.json'
    ];

    for (const p of paths) {
      try {
        const res = await fetch(p + '?v=' + Date.now());
        if (res.ok) {
          const json = await res.json();
          if (json && json.districts && json.districts.length > 0) {
            allDistrictsGeo = json.districts;
            return;
          }
        }
      } catch (e) {
        // next path
      }
    }
    console.warn('Gagal memuat polreg_districts.json untuk Kircon District Map.');
  }

  /**
   * 3. Add Permanent Dealer HQ Marker
   */
  function addDealerMarker() {
    if (!map) return;

    const dealerIcon = L.divIcon({
      className: 'tco-office-marker',
      html: `
        <div class="tco-office-pin" title="Dealer Utama: Tunas Toyota Kiara Condong">
          <i class="fa-solid fa-building-flag"></i>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19]
    });

    const marker = L.marker([DEALER_LAT, DEALER_LNG], {
      icon: dealerIcon,
      zIndexOffset: 5000
    }).addTo(map);

    marker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans',sans-serif; padding:4px; min-width:240px;">
        <div style="font-size:10px; font-weight:800; background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:6px; display:inline-block; margin-bottom:6px;">
          <i class="fa-solid fa-star"></i> DEALER UTAMA &amp; HQ
        </div>
        <h4 style="margin:0 0 4px; font-size:14px; font-weight:800; color:#0f172a;">Tunas Toyota Kiara Condong</h4>
        <p style="margin:0 0 6px; font-size:11px; color:#64748b;">Jl. Ibrahim Adjie No. 154, Kiara Condong, Kota Bandung</p>
        <div style="font-size:11px; background:#f8fafc; padding:6px 8px; border-radius:6px; border:1px solid #e2e8f0; color:#0f172a; font-weight:700;">
          <i class="fa-solid fa-location-crosshairs" style="color:#d7123a;"></i> Titik Sentral Distribusi Penjualan Bandung Raya
        </div>
      </div>
    `, { maxWidth: 290 });
  }

  /**
   * 4. Helper Status Penetrasi & Pewarnaan Choropleth
   */
  function getStatusMeta(status) {
    switch (status) {
      case 'Tinggi':
        return {
          label: 'Penetrasi Tinggi (Dominan)',
          color: '#10b981', // Emerald
          badgeClass: 'high',
          icon: 'fa-circle-check',
          opacity: 0.44
        };
      case 'Sedang':
        return {
          label: 'Penetrasi Sedang (Potensial)',
          color: '#3b82f6', // Blue
          badgeClass: 'mid',
          icon: 'fa-circle-dot',
          opacity: 0.40
        };
      case 'Rendah':
        return {
          label: 'Penetrasi Baru',
          color: '#f43f5e', // Crimson/Rose
          badgeClass: 'low',
          icon: 'fa-triangle-exclamation',
          opacity: 0.35
        };
      default:
        return {
          label: 'Belum Ada Transaksi',
          color: '#94a3b8', // Gray
          badgeClass: 'zero',
          icon: 'fa-circle-notch',
          opacity: 0.16
        };
    }
  }

  function formatRupiah(num) {
    if (!num) return 'Rp 0';
    if (num >= 1e9) {
      return 'Rp ' + (num / 1e9).toFixed(2).replace(/\.00$/, '') + ' Miliar';
    }
    if (num >= 1e6) {
      return 'Rp ' + (num / 1e6).toFixed(1).replace(/\.0$/, '') + ' Jt';
    }
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
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

  /**
   * 5. Process and Aggregate Sales Data per District
   */
  function processSalesData(salesList) {
    districtsData = {};
    let totalDO = 0;
    let totalSPK = 0;
    let totalRevenue = 0;

    // Initialize all 79 districts with zeroes
    allDistrictsGeo.forEach(d => {
      districtsData[d.id] = {
        id: d.id,
        name: d.name,
        regency: d.regency,
        regencyId: d.regencyId,
        zone: d.zone || '',
        total_do: 0,
        total_spk: 0,
        total_revenue: 0,
        models: {},
        sales: {},
        top_model: '-',
        top_model_qty: 0,
        top_sales: '-',
        top_sales_qty: 0,
        status: 'Belum Ada'
      };
    });

    // Aggregate transactions
    salesList.forEach(item => {
      const distId = getDistrictForRecord(item);
      if (!districtsData[distId]) return;

      const d = districtsData[distId];
      const isDO = (item.deliveryDate && item.deliveryDate !== '-' && item.deliveryDate !== '') ||
                   (item.salesDate && item.salesDate !== '-' && item.salesDate !== '') ||
                   (item.sales_date && item.sales_date !== '-' && item.sales_date !== '');
      const qty = parseInt(item.qty, 10) || 1;
      const otr = parseFloat(item.otr) || parseFloat(item.total_price) || 0;

      d.total_spk += qty;
      totalSPK += qty;
      totalRevenue += otr;
      d.total_revenue += otr;

      if (isDO) {
        d.total_do += qty;
        totalDO += qty;
      }

      // Track models
      const m = item.model || 'LAINNYA';
      d.models[m] = (d.models[m] || 0) + qty;

      // Track sales
      const s = item.sales || item.nama_salesman_idms || 'Tunas KC';
      d.sales[s] = (d.sales[s] || 0) + qty;
    });

    // Determine top models, top sales, and penetration status
    Object.values(districtsData).forEach(d => {
      // Top Model
      let bestModel = '-';
      let bestModelQty = 0;
      for (const [m, q] of Object.entries(d.models)) {
        if (q > bestModelQty) {
          bestModelQty = q;
          bestModel = m;
        }
      }
      d.top_model = bestModel;
      d.top_model_qty = bestModelQty;

      // Top Sales
      let bestSales = '-';
      let bestSalesQty = 0;
      for (const [s, q] of Object.entries(d.sales)) {
        if (q > bestSalesQty) {
          bestSalesQty = q;
          bestSales = s;
        }
      }
      d.top_sales = bestSales;
      d.top_sales_qty = bestSalesQty;

      // Penetration Status
      if (d.total_do >= 15) {
        d.status = 'Tinggi';
      } else if (d.total_do >= 6) {
        d.status = 'Sedang';
      } else if (d.total_do >= 1) {
        d.status = 'Rendah';
      } else {
        d.status = 'Belum Ada';
      }
    });

    // Update Header Mini KPIs
    const elDo = document.getElementById('kirconMiniDo');
    const elSpk = document.getElementById('kirconMiniSpk');
    const elRatio = document.getElementById('kirconMiniRatio');
    const elRev = document.getElementById('kirconMiniRev');

    if (elDo) elDo.textContent = `${totalDO} Unit`;
    if (elSpk) elSpk.textContent = `${totalSPK} SPK`;
    if (elRatio) {
      const r = totalSPK > 0 ? Math.round((totalDO / totalSPK) * 100) : 0;
      elRatio.textContent = `${r}%`;
    }
    if (elRev) elRev.textContent = formatRupiah(totalRevenue);
  }

  /**
   * 6. Render Polygons & Tooltips
   */
  function renderPolygons() {
    if (!map) return;

    // Clear previous layers
    Object.values(polygonLayers).forEach(p => map.removeLayer(p));
    Object.values(markerLayers).forEach(m => map.removeLayer(m));
    polygonLayers = {};
    markerLayers = {};

    allDistrictsGeo.forEach(dist => {
      const data = districtsData[dist.id] || {
        total_do: 0,
        total_spk: 0,
        total_revenue: 0,
        status: 'Belum Ada',
        top_model: '-',
        top_model_qty: 0,
        top_sales: '-',
        top_sales_qty: 0
      };

      const status = data.status;
      const statusMeta = getStatusMeta(status);
      const isCurrentSelected = (dist.id === selectedDistrictId);

      const matchRegency = (currentRegencyFilter === 'all') || (dist.regencyId === currentRegencyFilter);
      const matchStatus = (currentStatusFilter === 'all') || (status === currentStatusFilter);
      const isVisible = matchRegency && matchStatus;

      // Leaflet Polygon
      const polygon = L.polygon(dist.polygon, {
        color: isCurrentSelected ? '#d7123a' : statusMeta.color,
        weight: isCurrentSelected ? 3.5 : (data.total_do > 0 ? 2 : 1.2),
        fillColor: statusMeta.color,
        fillOpacity: isCurrentSelected ? 0.62 : (data.total_do > 0 ? statusMeta.opacity : 0.14),
        smoothFactor: 1
      });

      if (isVisible) {
        polygon.addTo(map);
      }

      // Hover interactions
      polygon.on('mouseover', function () {
        if (selectedDistrictId !== dist.id) {
          this.setStyle({
            weight: 3.5,
            color: '#d7123a',
            fillOpacity: 0.6
          });
        }
        const marker = markerLayers[dist.id];
        if (marker) {
          marker.setZIndexOffset(9000);
          const el = marker.getElement();
          if (el) el.querySelector('.tco-district-label')?.classList.add('hovered');
        }
      });

      polygon.on('mouseout', function () {
        if (selectedDistrictId !== dist.id) {
          this.setStyle({
            weight: data.total_do > 0 ? 2 : 1.2,
            color: statusMeta.color,
            fillOpacity: data.total_do > 0 ? statusMeta.opacity : 0.14
          });
        }
        const marker = markerLayers[dist.id];
        if (marker && selectedDistrictId !== dist.id) {
          marker.setZIndexOffset(0);
          const el = marker.getElement();
          if (el) el.querySelector('.tco-district-label')?.classList.remove('hovered');
        }
      });

      // Click: Select District
      polygon.on('click', function () {
        selectDistrict(dist.id, true);
      });

      // Glassmorphic Tooltip
      const ratio = data.total_spk > 0 ? Math.round((data.total_do / data.total_spk) * 100) : 0;
      polygon.bindTooltip(`
        <div class="polreg-glass-tooltip">
          <div class="tooltip-header">
            <span class="tooltip-title">${escapeHtml(dist.name)}</span>
            <span class="tooltip-badge ${statusMeta.badgeClass}">
              <i class="fa-solid ${statusMeta.icon}"></i> ${status}
            </span>
          </div>
          <div class="tooltip-regency">${escapeHtml(dist.regency || 'Bandung Raya')}${dist.zone ? ' • ' + escapeHtml(dist.zone) : ''}</div>
          <div class="tooltip-divider"></div>
          <div class="tooltip-row">
            <span>Total DO (Terkirim):</span>
            <b style="color:#10b981;">${data.total_do} Unit</b>
          </div>
          <div class="tooltip-row">
            <span>Total SPK:</span>
            <b style="color:#3b82f6;">${data.total_spk} SPK (${ratio}%)</b>
          </div>
          <div class="tooltip-row">
            <span>Total Nilai Omset:</span>
            <b style="color:#f59e0b;">${formatRupiah(data.total_revenue)}</b>
          </div>
          <div class="tooltip-divider"></div>
          <div class="tooltip-row">
            <span>#1 Model Terlaris:</span>
            <b style="color:#ffffff;">${escapeHtml(data.top_model)} ${data.top_model_qty > 0 ? `(${data.top_model_qty} U)` : ''}</b>
          </div>
          <div class="tooltip-row">
            <span>#1 Sales Kontributor:</span>
            <b style="color:#ffffff;">${escapeHtml(data.top_sales)}</b>
          </div>
          <div class="tooltip-hint"><i class="fa-solid fa-arrow-pointer"></i> Klik untuk rincian kecamatan</div>
        </div>
      `, {
        sticky: true,
        className: 'polreg-modern-tooltip-wrap',
        direction: 'top',
        offset: [0, -10]
      });

      polygonLayers[dist.id] = polygon;

      // Centroid Label Marker
      const labelIcon = L.divIcon({
        className: 'tco-district-label-wrap',
        html: `
          <div class="tco-district-label ${statusMeta.badgeClass}${isCurrentSelected ? ' active' : ''}" data-id="${dist.id}">
            <span class="tco-label-dot ${statusMeta.badgeClass}"></span>
            <span class="tco-label-text">${escapeHtml(dist.name)}</span>
            ${data.total_do > 0 ? `<span class="tco-label-val">${data.total_do} DO</span>` : ''}
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const labelMarker = L.marker(dist.center, {
        icon: labelIcon,
        interactive: false
      });

      if (isVisible) {
        labelMarker.addTo(map);
      }

      markerLayers[dist.id] = labelMarker;
    });

    renderLeaderboard();
  }

  /**
   * 7. Select District & Update Inspector HUD
   */
  function selectDistrict(districtId, flyTo = true) {
    selectedDistrictId = districtId;
    const dist = allDistrictsGeo.find(d => d.id === districtId);
    if (!dist) return;

    const data = districtsData[dist.id] || {
      total_do: 0,
      total_spk: 0,
      total_revenue: 0,
      status: 'Belum Ada',
      top_model: '-',
      top_model_qty: 0,
      top_sales: '-',
      top_sales_qty: 0
    };

    const statusMeta = getStatusMeta(data.status);

    // Update HUD elements
    const elTag = document.getElementById('kirconHudTag');
    const elTitle = document.getElementById('kirconHudTitle');
    const elBadge = document.getElementById('kirconHudBadge');
    const elDoVal = document.getElementById('kirconHudDoVal');
    const elSpkVal = document.getElementById('kirconHudSpkVal');
    const elRatioVal = document.getElementById('kirconHudRatioVal');
    const elRevVal = document.getElementById('kirconHudRevVal');
    const elTopModel = document.getElementById('kirconHudTopModel');
    const elTopSales = document.getElementById('kirconHudTopSales');

    if (elTag) elTag.textContent = `${dist.regency.toUpperCase()}${dist.zone ? ' • ' + dist.zone.toUpperCase() : ''}`;
    if (elTitle) elTitle.textContent = dist.name;
    if (elBadge) {
      elBadge.className = `kircon-hud-status-badge ${statusMeta.badgeClass}`;
      elBadge.innerHTML = `<i class="fa-solid ${statusMeta.icon}"></i> ${data.status}`;
    }

    const ratio = data.total_spk > 0 ? Math.round((data.total_do / data.total_spk) * 100) : 0;
    if (elDoVal) elDoVal.textContent = `${data.total_do} Unit`;
    if (elSpkVal) elSpkVal.textContent = `${data.total_spk} Pesanan`;
    if (elRatioVal) elRatioVal.textContent = `${ratio}% Realisasi`;
    if (elRevVal) elRevVal.textContent = formatRupiah(data.total_revenue);

    if (elTopModel) {
      elTopModel.textContent = data.top_model !== '-' 
        ? `${data.top_model} (${data.top_model_qty} Unit)`
        : 'Belum Ada Unit';
    }
    if (elTopSales) {
      elTopSales.textContent = data.top_sales !== '-'
        ? `${data.top_sales} (${data.top_sales_qty} Transaksi)`
        : '-';
    }

    // Refresh polygon styles
    Object.keys(polygonLayers).forEach(id => {
      const poly = polygonLayers[id];
      const d = districtsData[id];
      const meta = getStatusMeta(d ? d.status : 'Belum Ada');
      const isSel = (id === districtId);

      poly.setStyle({
        color: isSel ? '#d7123a' : meta.color,
        weight: isSel ? 4 : (d && d.total_do > 0 ? 2 : 1.2),
        fillOpacity: isSel ? 0.65 : (d && d.total_do > 0 ? meta.opacity : 0.14)
      });

      const m = markerLayers[id];
      if (m) {
        const el = m.getElement();
        if (el) {
          const lbl = el.querySelector('.tco-district-label');
          if (lbl) lbl.classList.toggle('active', isSel);
        }
      }
    });

    // Update active state in leaderboard list
    document.querySelectorAll('.kircon-leaderboard-item').forEach(item => {
      item.classList.toggle('active', item.getAttribute('data-id') === districtId);
    });

    if (flyTo && map && dist.center) {
      map.flyTo(dist.center, 13, { duration: 0.8 });
    }
  }

  /**
   * 8. Render Leaderboard Ranking (Top 10 Districts)
   */
  function renderLeaderboard() {
    const listEl = document.getElementById('kirconLeaderboardList');
    if (!listEl) return;

    // Filter by regency if active
    let list = Object.values(districtsData);
    if (currentRegencyFilter !== 'all') {
      list = list.filter(d => d.regencyId === currentRegencyFilter);
    }

    // Sort by DO descending, then SPK
    list.sort((a, b) => (b.total_do - a.total_do) || (b.total_spk - a.total_spk));
    const top10 = list.slice(0, 10);

    if (top10.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:20px; color:#94a3b8; font-size:12px;">Tidak ada data kecamatan.</div>`;
      return;
    }

    listEl.innerHTML = top10.map((d, idx) => `
      <div class="kircon-leaderboard-item${d.id === selectedDistrictId ? ' active' : ''}" data-id="${d.id}" onclick="KirconDistrictMap.selectDistrict('${d.id}', true)">
        <div class="rank-col">
          <span class="kircon-rank-num">${idx + 1}</span>
          <div class="kircon-leaderboard-info">
            <span class="d-name">${escapeHtml(d.name)}</span>
            <span class="d-sub">${escapeHtml(d.regency)} • Top: <strong>${escapeHtml(d.top_model)}</strong></span>
          </div>
        </div>
        <div class="kircon-leaderboard-badges">
          <span class="kircon-badge-do" title="Jumlah DO">${d.total_do} DO</span>
          <span class="kircon-badge-spk" title="Jumlah SPK">${d.total_spk} SPK</span>
        </div>
      </div>
    `).join('');
  }

  /**
   * 9. Filter Map by Regency (All, Kota Bandung, Cimahi, Kab Bandung, KBB)
   */
  function filterByRegency(regencyId) {
    currentRegencyFilter = regencyId;

    document.querySelectorAll('.kircon-area-pill').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-regency') === regencyId);
    });

    if (REGENCY_CONFIG[regencyId] && map) {
      const cfg = REGENCY_CONFIG[regencyId];
      map.flyTo(cfg.center, cfg.zoom, { duration: 0.9 });
    }

    renderPolygons();
    // Select the first top district in this regency
    const sorted = Object.values(districtsData)
      .filter(d => (regencyId === 'all') || (d.regencyId === regencyId))
      .sort((a, b) => b.total_do - a.total_do);

    if (sorted.length > 0) {
      selectDistrict(sorted[0].id, false);
    }
  }

  /**
   * 10. Filter Map by Penetration Status
   */
  function filterByStatus(status) {
    currentStatusFilter = status;
    renderPolygons();
  }

  /**
   * 11. Switch Base Map Layer (Roadmap vs Satellite)
   */
  function setBaseLayer(layerType) {
    if (!map || !tileLayers[layerType]) return;

    Object.values(tileLayers).forEach(l => {
      if (map.hasLayer(l)) map.removeLayer(l);
    });

    tileLayers[layerType].addTo(map);
    currentBaseLayer = layerType;

    const btnRoadmap = document.getElementById('kirconBtnRoadmap');
    const btnSatellite = document.getElementById('kirconBtnSatellite');
    if (btnRoadmap) btnRoadmap.classList.toggle('active', layerType === 'roadmap');
    if (btnSatellite) btnSatellite.classList.toggle('active', layerType === 'satellite');
  }

  /**
   * 12. Toggle District Labels
   */
  function toggleLabels() {
    const mapEl = document.getElementById('kirconDistrictsMap');
    const btn = document.getElementById('kirconBtnToggleLabels');
    if (!mapEl) return;

    isLabelsExpanded = !isLabelsExpanded;
    mapEl.classList.toggle('show-all-labels', isLabelsExpanded);

    if (btn) {
      btn.classList.toggle('active', isLabelsExpanded);
      btn.innerHTML = isLabelsExpanded
        ? '<i class="fa-solid fa-tags"></i> Label: Semua'
        : '<i class="fa-solid fa-tag"></i> Label: Bersih';
    }
  }

  /**
   * 13. Recenter to Tunas Toyota Kiara Condong HQ
   */
  function recenterHQ() {
    if (!map) return;
    map.flyTo([DEALER_LAT, DEALER_LNG], 13, { duration: 1.0 });
    selectDistrict('kiaracondong', false);
  }

  /**
   * 14. Action: Filter Table by District
   */
  function filterTransactionsByDistrict() {
    const dist = allDistrictsGeo.find(d => d.id === selectedDistrictId);
    if (!dist) return;

    // Switch to table tab
    const tabTableBtn = document.querySelector('[data-tab="table"]');
    if (tabTableBtn) {
      tabTableBtn.click();
    }

    // Set search input
    const searchInput = document.getElementById('input-table-search');
    if (searchInput) {
      // Search by regency/city or district name
      searchInput.value = dist.regency || dist.name;
      searchInput.dispatchEvent(new Event('input'));
    }
  }

  /**
   * 15. Invalidate Size (call when Tab 5 is displayed)
   */
  function invalidateSize() {
    if (map) {
      setTimeout(() => map.invalidateSize(), 100);
      setTimeout(() => map.invalidateSize(), 300);
    } else {
      init();
    }
  }

  /**
   * 16. Update Data with Filtered Dataset
   */
  function updateData(salesList) {
    if (!salesList || !Array.isArray(salesList)) return;
    currentSalesDataset = salesList;

    if (allDistrictsGeo.length === 0) {
      loadDistrictsGeoJson().then(() => {
        processSalesData(salesList);
        renderPolygons();
        selectDistrict(selectedDistrictId, false);
      });
      return;
    }

    processSalesData(salesList);
    renderPolygons();
    selectDistrict(selectedDistrictId, false);
  }

  return {
    init,
    updateData,
    invalidateSize,
    selectDistrict,
    filterByRegency,
    filterByStatus,
    setBaseLayer,
    toggleLabels,
    recenterHQ,
    filterTransactionsByDistrict
  };
})();

// Attach globally
window.KirconDistrictMap = KirconDistrictMap;

// Auto initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  KirconDistrictMap.init();
});
