/**
 * polreg.js
 * Peta Polreg Wilayah & District Intelligence All-in-One Portal
 * Integrates Leaflet Interactive Map (79 Wilayah Bandung Raya),
 * Choropleth Market Share Polygons, Real-time Inspector HUD,
 * Car Population & Comparison Intelligence (Banyakan Mobil Mana),
 * and Canvassing Route Direct Check-in Integration.
 * 
 * Tunas Toyota Kiara Condong — Sales Force Territory Intelligence 2026
 */

(function () {
  'use strict';

  // Global state
  let polregMap = null;
  let googleTileLayers = {};
  let currentTileLayer = null;
  let allDistricts = [];
  let allDistrictsCars = {};
  let polygonLayers = {};
  let markerLayers = {};
  let officeMarker = null;
  let selectedDistrictId = null;
  let currentFilter = 'all';
  let currentRegencyFilter = 'all';
  let currentLabelMode = 'smart'; // 'smart', 'dots', 'alltext'

  // Car population & comparison charts state
  let inspectorCarChart = null;
  let mainCarRankingChart = null;
  let mainBrandShareChart = null;
  let currentInspectorChartMode = 'models'; // 'models', 'toyota', 'brands'
  let currentMainChartMode = 'all'; // 'all', 'toyota'
  let currentCarTableBrandFilter = '';
  let currentCarTableSearch = '';

  // Office Coordinates: Tunas Toyota Kiara Condong (Verified GPS)
  const OFFICE_COORDS = [-6.9445094, 107.6424038];

  /**
   * Main Initialize Polreg View
   */
  async function initPolregView() {
    if (allDistricts.length === 0) {
      await loadPolregData();
    }

    const mapContainer = document.getElementById('polregLeafletMap');
    if (!mapContainer) return;

    if (!polregMap) {
      setupLeafletMap();
      renderAllDistrictsOnMap();
      setupEventListeners();
    } else {
      setTimeout(() => {
        polregMap.invalidateSize();
      }, 250);
    }

    renderDistrictCards();
    renderDistrictTable();
    updateSummaryKpis();

    // Check URL params for preselected district (e.g. ?kecamatan=Sumur+Bandung or ?id=sumur_bandung)
    const urlParams = new URLSearchParams(window.location.search);
    const paramKec = urlParams.get('kecamatan') || urlParams.get('kec') || '';
    const paramId = urlParams.get('id') || '';

    let targetDist = null;
    if (paramId) {
      targetDist = allDistricts.find(d => d.id === paramId.toLowerCase());
    } else if (paramKec) {
      const cleanKec = paramKec.toLowerCase().replace(/^kec(.|s+)/, '').trim();
      targetDist = allDistricts.find(d => d.name.toLowerCase() === cleanKec || d.id === cleanKec.replace(/\s+/g, '_'));
    }

    if (!targetDist) {
      targetDist = allDistricts.find(d => d.id === 'kiaracondong') || allDistricts[0];
    }

    if (targetDist) {
      updateInspectorCard(targetDist);
      renderDistrictCarAnalytics(targetDist.id);
      if (paramId || paramKec) {
        selectDistrict(targetDist.id, true);
      }
    }
  }

  /**
   * Robust Multi-Path JSON Loader with fallback
   */
  async function loadPolregData() {
    async function fetchWithFallback(filename) {
      const basePaths = [
        `../data/${filename}`,
        `data/${filename}`,
        `/data/${filename}`,
        `/public/data/${filename}`,
        `../../data/${filename}`
      ];
      for (const p of basePaths) {
        try {
          const res = await fetch(p + '?v=' + Date.now());
          if (res.ok) {
            return await res.json();
          }
        } catch (e) {}
      }
      throw new Error('Gagal memuat ' + filename);
    }

    try {
      const [distData, carsData] = await Promise.all([
        fetchWithFallback('polreg_districts.json'),
        fetchWithFallback('polreg_cars_by_district.json')
      ]);
      allDistricts = distData.districts || [];
      window.PolregData = allDistricts;

      allDistrictsCars = carsData || {};
      window.PolregCarsData = allDistrictsCars;
    } catch (err) {
      console.warn('Gagal memuat data polreg JSON...', err);
      allDistricts = [];
      allDistrictsCars = {};
    }
  }

  /**
   * Setup Leaflet Map Instance
   */
  function setupLeafletMap() {
    if (typeof L === 'undefined') {
      console.error('Leaflet library belum dimuat.');
      return;
    }

    // Bandung Raya coordinate bounds
    const BANDUNG_RAYA_BOUNDS = L.latLngBounds(
      L.latLng(-7.38, 107.15), // South-West
      L.latLng(-6.62, 108.00)  // North-East
    );

    // Centered around Kota Bandung
    polregMap = L.map('polregLeafletMap', {
      zoomControl: false,
      attributionControl: false,
      maxBounds: BANDUNG_RAYA_BOUNDS.pad(0.08),
      maxBoundsViscosity: 0.9,
      minZoom: 10
    }).setView([-6.9200, 107.6350], 11);

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(polregMap);

    const mapContainer = document.getElementById('polregLeafletMap');
    if (mapContainer) {
      mapContainer.classList.add('label-mode-smart');
    }
    polregMap.on('zoomend', updateMapZoomClasses);

    // Google Maps Tile Layers
    googleTileLayers.roadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    googleTileLayers.satellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    googleTileLayers.carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    });

    // Default layer: Google Roadmap
    currentTileLayer = googleTileLayers.roadmap;
    currentTileLayer.addTo(polregMap);

    // Add Office Marker (Tunas Toyota Kiara Condong)
    const officeIcon = L.divIcon({
      className: 'polreg-office-marker-wrap',
      html: '<div class="polreg-office-marker" title="Home Base: Tunas Toyota Kiara Condong"><i class="fa-solid fa-building"></i></div>',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    officeMarker = L.marker(OFFICE_COORDS, { icon: officeIcon }).addTo(polregMap);
    officeMarker.bindPopup(`
      <div class="polreg-popup-box">
        <div style="font-size:10px; font-weight:800; color:#cc1426; text-transform:uppercase; margin-bottom:2px; display:flex; align-items:center; gap:5px;">
          <i class="fa-solid fa-crown"></i> Home Base Cabang
        </div>
        <h4 class="polreg-popup-title" style="margin-bottom:6px;">Tunas Toyota Kiara Condong</h4>
        <p style="font-size:11px; color:#334155; margin:0 0 8px 0; line-height:1.45; font-weight:500;">
          <i class="fa-solid fa-location-dot" style="color:#cc1426; margin-right:4px;"></i>
          Jalan Jendral Jl. Ibrahim Adjie No.47, Kb. Kangkung, Kec. Kiaracondong, Kota Bandung
        </p>
        <div style="font-size:11px; background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:6px 8px; border-radius:6px; font-weight:700; margin-bottom:8px;">
          Pusat Operasional & Distribusi Unit Penjualan Sales Force
        </div>
        <button type="button" onclick="goToDistrictCanvassing('Kiaracondong')" style="width:100%; background:#cc1426; color:#fff; border:none; border-radius:6px; padding:6px 10px; font-size:11px; font-weight:800; cursor:pointer;">
          <i class="fa-solid fa-location-crosshairs"></i> Canvassing Wilayah Ini
        </button>
      </div>
    `);

    setTimeout(() => {
      polregMap.invalidateSize();
      updateMapZoomClasses();
    }, 300);

    // Auto-adjust leaflet canvas when map container or inspector card height changes
    if (window.ResizeObserver && mapContainer) {
      let resizeTimer = null;
      const ro = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (polregMap) {
            polregMap.invalidateSize({ pan: false });
          }
        }, 100);
      });
      ro.observe(mapContainer);
      const inspectorEl = document.getElementById('polregInspectorCard');
      if (inspectorEl) ro.observe(inspectorEl);
    }

    window.addEventListener('resize', () => {
      if (polregMap) {
        polregMap.invalidateSize({ pan: false });
      }
    });
  }

  /**
   * Update map zoom classes for smart decluttering
   */
  function updateMapZoomClasses() {
    if (!polregMap) return;
    const zoom = polregMap.getZoom();
    const container = document.getElementById('polregLeafletMap');
    if (!container) return;

    container.classList.remove('zoom-far', 'zoom-mid', 'zoom-near');
    if (zoom <= 11) {
      container.classList.add('zoom-far');
    } else if (zoom === 12) {
      container.classList.add('zoom-mid');
    } else {
      container.classList.add('zoom-near');
    }
  }

  /**
   * Switch Map Tile Layer
   */
  function switchMapLayer(layerName) {
    if (!polregMap || !googleTileLayers[layerName]) return;
    if (currentTileLayer) polregMap.removeLayer(currentTileLayer);

    currentTileLayer = googleTileLayers[layerName];
    currentTileLayer.addTo(polregMap);

    document.querySelectorAll('.polreg-layer-btn').forEach(btn => btn.classList.remove('active'));
    const btnActive = document.getElementById(`btnPolregLayer${capitalize(layerName)}`);
    if (btnActive) btnActive.classList.add('active');
  }

  /**
   * Helper: Get Color based on Market Share
   */
  function getShareColor(share) {
    if (share >= 35.0) return '#10b981'; // Green (Dominan)
    if (share >= 30.0) return '#3b82f6'; // Blue (Moderat / Solid)
    return '#ef4444'; // Red (Low share / Prioritas EVOLVE)
  }

  function getShareClass(share) {
    if (share >= 35.0) return 'high';
    if (share >= 30.0) return 'mid';
    return 'low';
  }

  /**
   * Render ALL 79 Districts on Map Simultaneously
   */
  function renderAllDistrictsOnMap() {
    if (!polregMap || allDistricts.length === 0) return;

    // Clear existing
    Object.values(polygonLayers).forEach(p => polregMap.removeLayer(p));
    Object.values(markerLayers).forEach(m => polregMap.removeLayer(m));
    polygonLayers = {};
    markerLayers = {};

    allDistricts.forEach(dist => {
      const color = getShareColor(dist.marketShare);
      const shareCls = getShareClass(dist.marketShare);
      const carInfo = allDistrictsCars[dist.id] || {};
      const topModelName = carInfo.topCar ? carInfo.topCar.cleanName : (dist.modelBadge || 'Toyota');
      const topModelUnits = carInfo.topCar ? carInfo.topCar.units : 0;
      const totalUnits = carInfo.totalUnits || dist.totalPolregMarket;

      // Create Polygon
      const polygon = L.polygon(dist.polygon, {
        color: color,
        weight: 2,
        fillColor: color,
        fillOpacity: 0.35,
        smoothFactor: 1
      }).addTo(polregMap);

      // Hover events
      polygon.on('mouseover', function () {
        if (selectedDistrictId !== dist.id) {
          this.setStyle({
            weight: 3.5,
            fillOpacity: 0.55
          });
        }
        const marker = markerLayers[dist.id];
        if (marker) {
          marker.setZIndexOffset(9000);
          const el = marker.getElement();
          if (el) el.querySelector('.polreg-map-marker-label')?.classList.add('hovered');
        }
      });

      polygon.on('mouseout', function () {
        if (selectedDistrictId !== dist.id) {
          this.setStyle({
            weight: 2,
            fillOpacity: 0.35
          });
        }
        const marker = markerLayers[dist.id];
        if (marker && selectedDistrictId !== dist.id) {
          marker.setZIndexOffset(0);
          const el = marker.getElement();
          if (el) el.querySelector('.polreg-map-marker-label')?.classList.remove('hovered');
        }
      });

      // Click event -> Select District & highlight polygon
      polygon.on('click', function () {
        selectDistrict(dist.id, true);
      });

      // Modern Glassmorphic Tooltip
      polygon.bindTooltip(`
        <div class="polreg-glass-tooltip">
          <div class="tooltip-header">
            <span class="tooltip-title">${escapeHtml(dist.name)}</span>
            <span class="tooltip-badge ${shareCls}">${dist.marketShare}%</span>
          </div>
          <div class="tooltip-regency">${escapeHtml(dist.regency || 'Bandung Raya')}${dist.zone ? ' • ' + escapeHtml(dist.zone) : ''}</div>
          <div class="tooltip-divider"></div>
          <div class="tooltip-row">
            <span>Total Pasar:</span>
            <b>${Number(totalUnits).toLocaleString('id-ID')} Unit</b>
          </div>
          <div class="tooltip-row">
            <span>#1 Terbanyak:</span>
            <b>${escapeHtml(topModelName)} (${topModelUnits} U)</b>
          </div>
          <div class="tooltip-hint"><i class="fa-solid fa-arrow-pointer"></i> Klik untuk analisis lengkap</div>
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
        className: 'polreg-custom-label-wrap',
        html: `
          <div class="polreg-map-marker-label ${shareCls}" data-id="${dist.id}">
            <span class="polreg-label-dot ${shareCls}"></span>
            <span class="polreg-label-text">${escapeHtml(dist.name)}</span>
            <span class="polreg-label-pct">${dist.marketShare}%</span>
          </div>
        `,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });

      const labelMarker = L.marker(dist.center, {
        icon: labelIcon,
        interactive: false
      }).addTo(polregMap);

      markerLayers[dist.id] = labelMarker;
    });

    const allLayers = Object.values(polygonLayers);
    if (allLayers.length > 0) {
      const group = L.featureGroup(allLayers);
      polregMap.fitBounds(group.getBounds(), {
        padding: [20, 20],
        maxZoom: 12
      });
    }
    updateMapZoomClasses();
  }

  /**
   * SELECT DISTRICT & HIGHLIGHT POLYGON
   */
  function selectDistrict(districtId, zoomTo = true) {
    const district = allDistricts.find(d => d.id === districtId);
    if (!district) return;

    selectedDistrictId = districtId;

    // Switch to Map & Analysis tab if on Daftar tab
    if (typeof switchPolregTab === 'function') {
      switchPolregTab('analisis');
    }

    // Reset styles of all polygons, keeping non-matching ones hidden
    allDistricts.forEach(d => {
      const poly = polygonLayers[d.id];
      const marker = markerLayers[d.id];
      const isMatch = isDistrictMatch(d);

      if (poly) {
        if (!isMatch) {
          poly.setStyle({
            color: '#cbd5e1',
            weight: 0,
            fillColor: '#ffffff',
            fillOpacity: 0,
            opacity: 0
          });
          if (poly._path) {
            poly._path.style.display = 'none';
            poly._path.style.pointerEvents = 'none';
          }
        } else {
          const c = getShareColor(d.marketShare);
          poly.setStyle({
            color: c,
            weight: 1.5,
            fillColor: c,
            fillOpacity: 0.22,
            opacity: 1
          });
          if (poly._path) {
            poly._path.style.display = '';
            poly._path.style.pointerEvents = 'auto';
          }
        }
      }

      if (marker) {
        const el = marker.getElement();
        if (el) {
          el.style.display = isMatch ? 'flex' : 'none';
          el.style.opacity = isMatch ? (d.id === districtId ? '1' : '0.6') : '0';
          el.style.pointerEvents = isMatch ? 'auto' : 'none';
        }
      }
    });

    // Highlight the selected polygon with thick glowing border
    const selectedPoly = polygonLayers[districtId];
    if (selectedPoly) {
      const color = getShareColor(district.marketShare);
      selectedPoly.setStyle({
        color: '#cc1426',
        weight: 4.5,
        fillColor: color,
        fillOpacity: 0.65
      });
      selectedPoly.bringToFront();

      // Highlight the selected label marker
      Object.keys(markerLayers).forEach(id => {
        const marker = markerLayers[id];
        if (marker) {
          if (id === districtId) {
            marker.setZIndexOffset(1000);
            const el = marker.getElement();
            if (el) el.querySelector('.polreg-map-marker-label')?.classList.add('selected');
          } else {
            marker.setZIndexOffset(0);
            const el = marker.getElement();
            if (el) el.querySelector('.polreg-map-marker-label')?.classList.remove('selected');
          }
        }
      });

      if (zoomTo && polregMap) {
        polregMap.fitBounds(selectedPoly.getBounds(), {
          padding: [60, 60],
          maxZoom: 14,
          animate: true,
          duration: 0.8
        });
      }
    }

    // Sync dropdown select
    const selectEl = document.getElementById('polregDistrictSelect');
    if (selectEl && selectEl.value !== districtId) {
      selectEl.value = districtId;
    }

    // Update Inspector Card (Right side)
    updateInspectorCard(district);

    // Highlight Card in Grid
    document.querySelectorAll('.dist-card').forEach(c => {
      if (c.getAttribute('data-id') === districtId) {
        c.classList.add('selected-active');
      } else {
        c.classList.remove('selected-active');
      }
    });

    // Highlight Table Row
    document.querySelectorAll('#polregTableBody tr').forEach(tr => {
      if (tr.getAttribute('data-id') === districtId) {
        tr.style.background = '#fef2f2';
      } else {
        tr.style.background = '';
      }
    });

    // Render Car Population & Comparison Charts (Banyakan Mobil Mana)
    renderDistrictCarAnalytics(districtId);

    // Smooth scroll to Inspector if on mobile screen
    if (window.innerWidth <= 991) {
      const inspectorEl = document.getElementById('polregInspectorCard');
      if (inspectorEl) {
        setTimeout(() => {
          inspectorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 400);
      }
    }
  }

  /**
   * Reset All Polygons to Standard View
   */
  function resetAllPolygonsView() {
    selectedDistrictId = null;

    allDistricts.forEach(d => {
      const poly = polygonLayers[d.id];
      if (poly) {
        const c = getShareColor(d.marketShare);
        poly.setStyle({
          color: c,
          weight: 2,
          fillColor: c,
          fillOpacity: 0.35
        });
      }
    });

    Object.keys(markerLayers).forEach(id => {
      const marker = markerLayers[id];
      if (marker) {
        marker.setZIndexOffset(0);
        const el = marker.getElement();
        if (el) el.querySelector('.polreg-map-marker-label')?.classList.remove('selected');
      }
    });

    if (polregMap) {
      const visibleLayers = [];
      allDistricts.forEach(d => {
        const poly = polygonLayers[d.id];
        if (poly && (currentRegencyFilter === 'all' || d.regencyId === currentRegencyFilter)) {
          visibleLayers.push(poly);
        }
      });
      if (visibleLayers.length > 0) {
        const group = L.featureGroup(visibleLayers);
        polregMap.fitBounds(group.getBounds(), {
          padding: [25, 25],
          maxZoom: 12,
          animate: true
        });
      } else {
        polregMap.setView([-6.935, 107.615], 11);
      }
      setTimeout(updateMapZoomClasses, 350);
    }

    const selectEl = document.getElementById('polregDistrictSelect');
    if (selectEl) selectEl.value = '';

    document.querySelectorAll('.dist-card').forEach(c => c.classList.remove('selected-active'));

    const defaultDist = allDistricts.find(d => d.id === 'kiaracondong') || allDistricts[0];
    if (defaultDist) updateInspectorCard(defaultDist);
  }

  /**
   * Update Floating Inspector HUD (Right Side)
   */
  function updateInspectorCard(dist) {
    const elTitle = document.getElementById('inspectorDistrictTitle');
    const elZone = document.getElementById('inspectorZoneTag');
    const elUrgency = document.getElementById('inspectorUrgencyBadge');
    const elShare = document.getElementById('inspectorShareVal');
    const elTarget = document.getElementById('inspectorTargetVal');
    const elTotalPolreg = document.getElementById('inspectorTotalPolreg');
    const elToyotaVol = document.getElementById('inspectorToyotaVol');
    const elModel = document.getElementById('inspectorModelBadge');
    const elCompetitor = document.getElementById('inspectorCompetitorText');
    const elUsp = document.getElementById('inspectorUspList');
    const elDemografi = document.getElementById('inspectorDemografiText');
    const elVenue = document.getElementById('inspectorVenueText');
    const elHousingCount = document.getElementById('inspectorHousingCount');
    const elHousingChips = document.getElementById('inspectorHousingChips');

    if (!elTitle) return;

    elTitle.textContent = dist.name;
    if (elZone) elZone.textContent = dist.regency ? `${dist.regency} • ${dist.zone}` : `Wilayah: ${dist.zone}`;

    if (elUrgency) {
      let badgeCls = 'maintain';
      let icon = '<i class="fa-solid fa-circle-check"></i>';
      if (dist.urgencyLevel === 'immediate' || dist.urgency === 'Prioritas EVOLVE' || dist.marketShare < 30) {
        badgeCls = 'immediate';
        icon = '<i class="fa-solid fa-triangle-exclamation"></i>';
      } else if (dist.urgencyLevel === 'priority' || dist.urgencyLevel === 'solid') {
        badgeCls = 'priority';
        icon = '<i class="fa-solid fa-bolt"></i>';
      }
      elUrgency.className = `pi-urgency-badge ${badgeCls}`;
      elUrgency.innerHTML = `${icon} ${dist.urgency || 'Market Share'}`;
    }

    if (elShare) elShare.textContent = `${dist.marketShare}%`;
    if (elTarget) elTarget.textContent = `${dist.targetShare}%`;
    if (elTotalPolreg) elTotalPolreg.textContent = `${dist.totalPolregMarket} Unit/bln`;
    if (elToyotaVol) elToyotaVol.textContent = `${dist.toyotaVolume} Unit`;

    if (elModel) elModel.textContent = dist.modelBadge || dist.recommendedModel;
    if (elCompetitor) {
      elCompetitor.innerHTML = `Lawan Terberat: <strong>${escapeHtml(dist.competitor || 'Kompetitor')}</strong> (${escapeHtml(dist.competitorSegment || 'LMPV & SUV')})`;
    }

    if (elUsp && Array.isArray(dist.usp)) {
      elUsp.innerHTML = dist.usp.map(point => `<li>${escapeHtml(point)}</li>`).join('');
    }

    if (elDemografi) elDemografi.textContent = dist.targetSegment || '-';
    if (elVenue) elVenue.textContent = dist.venueRecom || '-';

    if (elHousingCount) {
      elHousingCount.textContent = `${dist.totalKomplek || 12} Komplek (${(dist.totalUnitRumah || 1250).toLocaleString('id-ID')} Unit Rumah)`;
    }

    if (elHousingChips) {
      const complexes = Array.isArray(dist.komplekList) && dist.komplekList.length > 0 
        ? dist.komplekList 
        : [
            { nama: `Komplek Asri ${dist.name}` },
            { nama: `Griya Utama ${dist.name}` },
            { nama: `Cluster Indah ${dist.name}` }
          ];
      elHousingChips.innerHTML = complexes.slice(0, 5).map(k => `
        <span class="pi-housing-chip">${escapeHtml(k.nama || k)}</span>
      `).join('');
    }
  }

  /**
   * CAR POPULATION & COMPARISON ENGINE (BANYAKAN MOBIL MANA)
   */
  function renderDistrictCarAnalytics(districtId) {
    if (!districtId || !allDistrictsCars || !allDistrictsCars[districtId]) return;
    const distCars = allDistrictsCars[districtId];
    const distInfo = allDistricts.find(d => d.id === districtId);
    const distName = distInfo ? distInfo.name : capitalize(districtId);

    // 1. UPDATE INSPECTOR HUD
    const elTopName = document.getElementById('piTopCarName');
    const elTopSub = document.getElementById('piTopCarSub');
    if (distCars.topCar) {
      if (elTopName) elTopName.textContent = distCars.topCar.cleanName || `${distCars.topCar.merk} ${distCars.topCar.rawType}`;
      if (elTopSub) elTopSub.textContent = `${distCars.topCar.units} Unit (${distCars.topCar.share}% dari total ${(distCars.totalUnits || 0).toLocaleString('id-ID')} unit)`;
    }

    renderInspectorCarChart(distCars);
    renderInspectorMiniCarList(distCars);

    // 2. UPDATE DEDICATED PANEL BELOW MAP
    const elCpTitle = document.getElementById('cpDistrictTitle');
    const elCpTableTitle = document.getElementById('cpTableDistrictName');
    if (elCpTitle) elCpTitle.textContent = distName;
    if (elCpTableTitle) elCpTableTitle.textContent = distName;

    // Badges
    const elBadgeUnits = document.getElementById('cpBadgeTotalUnits');
    const elBadgeMerks = document.getElementById('cpBadgeTotalMerks');
    const elBadgeToyota = document.getElementById('cpBadgeToyotaUnits');
    if (elBadgeUnits) elBadgeUnits.innerHTML = `<i class="fa-solid fa-car"></i> ${(distCars.totalUnits || 0).toLocaleString('id-ID')} Unit Terdata`;
    if (elBadgeMerks) elBadgeMerks.innerHTML = `<i class="fa-solid fa-tags"></i> ${distCars.totalMerks || 20} Merk Terdaftar`;
    if (elBadgeToyota) {
      const toyotaTotal = distCars.brands ? (distCars.brands.find(b => b.merk === 'TOYOTA')?.units || 0) : (distInfo ? distInfo.toyotaVolume : 0);
      const toyotaShare = distCars.totalUnits > 0 ? ((toyotaTotal / distCars.totalUnits) * 100).toFixed(1) : (distInfo ? distInfo.marketShare : 0);
      elBadgeToyota.innerHTML = `<i class="fa-solid fa-crown"></i> Toyota: ${toyotaTotal} Unit (${toyotaShare}%)`;
    }

    // KPI Cards
    const elKpiTopCar = document.getElementById('cpKpiTopCar');
    const elKpiTopCarSub = document.getElementById('cpKpiTopCarSub');
    if (distCars.topCar) {
      if (elKpiTopCar) elKpiTopCar.textContent = distCars.topCar.cleanName;
      if (elKpiTopCarSub) elKpiTopCarSub.textContent = `${distCars.topCar.units} Unit (${distCars.topCar.share}% market share)`;
    }

    const elKpiTopToyota = document.getElementById('cpKpiTopToyota');
    const elKpiTopToyotaSub = document.getElementById('cpKpiTopToyotaSub');
    if (distCars.topToyota) {
      if (elKpiTopToyota) elKpiTopToyota.textContent = distCars.topToyota.name;
      if (elKpiTopToyotaSub) elKpiTopToyotaSub.textContent = `${distCars.topToyota.units} Unit (${distCars.topToyota.share}% pangsa Toyota)`;
    }

    // Render Charts and Table
    renderMainCarRankingChart(distCars);
    renderMainBrandShareChart(distCars);
    renderCarDetailTable(distCars);
  }

  /**
   * Inspector Mini ApexChart (Top Models / Toyota / Brands)
   */
  function renderInspectorCarChart(distCars) {
    const chartEl = document.querySelector("#piCarApexChart");
    if (!chartEl || typeof ApexCharts === 'undefined') return;

    if (inspectorCarChart) {
      inspectorCarChart.destroy();
      inspectorCarChart = null;
    }

    let categories = [];
    let seriesData = [];
    let barColors = [];

    if (currentInspectorChartMode === 'models') {
      const topList = distCars.models ? distCars.models.slice(0, 6) : [];
      categories = topList.map(item => item.cleanName || item.rawType);
      seriesData = topList.map(item => item.units);
      barColors = topList.map(item => item.isToyota ? '#cc1426' : '#3b82f6');
    } else if (currentInspectorChartMode === 'toyota') {
      const topT = distCars.models ? distCars.models.filter(m => m.isToyota).slice(0, 6) : [];
      categories = topT.map(item => item.cleanName || item.rawType);
      seriesData = topT.map(item => item.units);
      barColors = topT.map(() => '#cc1426');
    } else if (currentInspectorChartMode === 'brands') {
      const topB = distCars.brands ? distCars.brands.slice(0, 6) : [];
      categories = topB.map(b => b.merk);
      seriesData = topB.map(b => b.units);
      barColors = topB.map(b => b.isToyota ? '#cc1426' : '#64748b');
    }

    if (categories.length === 0) {
      chartEl.innerHTML = '<div style="text-align:center; padding:20px; color:#94a3b8; font-size:11px;">Tidak ada data kendaraan.</div>';
      return;
    }

    const options = {
      series: [{ name: 'Volume Unit', data: seriesData }],
      chart: {
        type: 'bar',
        height: 170,
        toolbar: { show: false },
        fontFamily: 'inherit',
        animations: { enabled: true, easing: 'easeinout', speed: 350 }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '62%',
          borderRadius: 4,
          distributed: true,
          dataLabels: { position: 'top' }
        }
      },
      colors: barColors,
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        offsetX: 5,
        formatter: (val) => val + ' U',
        style: { fontSize: '10px', fontWeight: 800, colors: ['#0f172a'] }
      },
      legend: { show: false },
      xaxis: {
        categories: categories,
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { fontSize: '10.5px', fontWeight: 700, colors: '#334155' },
          maxWidth: 140
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: false } },
        padding: { top: -10, bottom: -10, left: 5, right: 30 }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} Unit (${distCars.totalUnits > 0 ? ((val / distCars.totalUnits) * 100).toFixed(1) : 0}%)`
        }
      }
    };

    inspectorCarChart = new ApexCharts(chartEl, options);
    inspectorCarChart.render();
  }

  /**
   * Inspector Mini Car List
   */
  function renderInspectorMiniCarList(distCars) {
    const listEl = document.getElementById('piMiniCarList');
    if (!listEl) return;

    const top5 = distCars.models ? distCars.models.slice(0, 5) : [];
    if (top5.length === 0) {
      listEl.innerHTML = '<div style="color:#94a3b8; font-size:11px;">Tidak ada unit.</div>';
      return;
    }

    listEl.innerHTML = top5.map((c, i) => {
      const isToyota = c.isToyota;
      const rankBadge = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`;
      const brandClass = getBrandClass(c.merk);
      return `
        <div class="pi-mini-car-item ${isToyota ? 'is-toyota' : ''}">
          <div class="pi-car-left">
            <span class="pi-car-rank">${rankBadge}</span>
            <span class="brand-pill ${brandClass}">${escapeHtml(c.merk)}</span>
            <span class="pi-car-name" title="${escapeHtml(c.rawType)}">${escapeHtml(c.cleanName || c.rawType)}</span>
          </div>
          <div class="pi-car-right">
            <span class="pi-car-units">${c.units} U</span>
            <span class="pi-car-pct">${c.share}%</span>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Main Ranking Chart (Banyakan Mobil Mana)
   */
  function renderMainCarRankingChart(distCars) {
    const chartEl = document.querySelector("#mainCarRankingChart");
    if (!chartEl || typeof ApexCharts === 'undefined') return;

    if (mainCarRankingChart) {
      mainCarRankingChart.destroy();
      mainCarRankingChart = null;
    }

    let categories = [];
    let seriesData = [];
    let barColors = [];

    if (currentMainChartMode === 'all') {
      const list = distCars.models ? distCars.models.slice(0, 12) : [];
      categories = list.map(item => item.cleanName || item.rawType);
      seriesData = list.map(item => item.units);
      barColors = list.map(item => item.isToyota ? '#cc1426' : '#2563eb');
    } else {
      const list = distCars.models ? distCars.models.filter(m => m.isToyota).slice(0, 10) : [];
      categories = list.map(item => item.cleanName || item.rawType);
      seriesData = list.map(item => item.units);
      barColors = list.map(() => '#cc1426');
    }

    const options = {
      series: [{ name: 'Jumlah Unit', data: seriesData }],
      chart: {
        type: 'bar',
        height: 380,
        toolbar: { show: false },
        fontFamily: 'inherit',
        animations: { enabled: true, easing: 'easeinout', speed: 400 }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '68%',
          borderRadius: 6,
          distributed: true,
          dataLabels: { position: 'top' }
        }
      },
      colors: barColors,
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        offsetX: 6,
        formatter: (val) => val + ' Unit',
        style: { fontSize: '11px', fontWeight: 800, colors: ['#0f172a'] }
      },
      legend: { show: false },
      xaxis: {
        categories: categories,
        labels: {
          style: { fontSize: '11px', fontWeight: 600, colors: '#64748b' }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          style: { fontSize: '11.5px', fontWeight: 700, colors: '#1e293b' },
          maxWidth: 220
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
        padding: { right: 35 }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} Unit (${distCars.totalUnits > 0 ? ((val / distCars.totalUnits) * 100).toFixed(1) : 0}% pasar wilayah)`
        }
      }
    };

    mainCarRankingChart = new ApexCharts(chartEl, options);
    mainCarRankingChart.render();
  }

  /**
   * Main Brand Share Donut Chart
   */
  function renderMainBrandShareChart(distCars) {
    const chartEl = document.querySelector("#mainBrandShareChart");
    if (!chartEl || typeof ApexCharts === 'undefined') return;

    if (mainBrandShareChart) {
      mainBrandShareChart.destroy();
      mainBrandShareChart = null;
    }

    const topBrands = distCars.brands ? distCars.brands.slice(0, 6) : [];
    if (topBrands.length === 0) return;

    const brandLabels = topBrands.map(b => b.merk);
    const brandSeries = topBrands.map(b => b.units);

    const brandColors = topBrands.map(b => {
      const m = b.merk.toUpperCase();
      if (m === 'TOYOTA') return '#cc1426';
      if (m === 'HONDA') return '#dc2626';
      if (m === 'HYUNDAI') return '#0284c7';
      if (m === 'SUZUKI') return '#1d4ed8';
      if (m === 'MITSUBISHI') return '#b91c1c';
      if (m === 'DAIHATSU') return '#0d9488';
      if (m === 'WULING') return '#ea580c';
      return '#64748b';
    });

    const options = {
      series: brandSeries,
      labels: brandLabels,
      chart: {
        type: 'donut',
        height: 380,
        fontFamily: 'inherit',
        animations: { enabled: true, speed: 450 }
      },
      colors: brandColors,
      plotOptions: {
        pie: {
          donut: {
            size: '68%',
            labels: {
              show: true,
              name: { fontSize: '13px', fontWeight: 800, color: '#64748b' },
              value: {
                fontSize: '20px',
                fontWeight: 900,
                color: '#0f172a',
                formatter: (val) => `${val} Unit`
              },
              total: {
                show: true,
                label: 'Total Terdata',
                fontSize: '11px',
                fontWeight: 700,
                color: '#64748b',
                formatter: () => `${(distCars.totalUnits || 0).toLocaleString('id-ID')} U`
              }
            }
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => val.toFixed(1) + '%'
      },
      legend: {
        position: 'bottom',
        fontSize: '11.5px',
        fontWeight: 600,
        horizontalAlign: 'center',
        markers: { radius: 4 }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (val) => `${val} Unit (${distCars.totalUnits > 0 ? ((val / distCars.totalUnits) * 100).toFixed(1) : 0}%)`
        }
      }
    };

    mainBrandShareChart = new ApexCharts(chartEl, options);
    mainBrandShareChart.render();
  }

  /**
   * Detail Car Table
   */
  function renderCarDetailTable(distCars) {
    const tableBody = document.getElementById('cpCarTableBody');
    if (!tableBody) return;

    let cars = distCars.models || [];
    if (currentCarTableBrandFilter) {
      cars = cars.filter(c => c.merk.toUpperCase() === currentCarTableBrandFilter.toUpperCase());
    }
    if (currentCarTableSearch) {
      const q = currentCarTableSearch.toLowerCase();
      cars = cars.filter(c =>
        (c.cleanName || '').toLowerCase().includes(q) ||
        (c.rawType || '').toLowerCase().includes(q) ||
        (c.merk || '').toLowerCase().includes(q)
      );
    }

    if (cars.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:24px; color:#94a3b8; font-size:12px;">Tidak ditemukan model mobil yang sesuai filter.</td></tr>`;
      return;
    }

    const maxUnits = Math.max(...cars.map(c => c.units), 1);

    tableBody.innerHTML = cars.map((c, i) => {
      const isToyota = c.isToyota;
      const rankBadge = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`;
      const brandClass = getBrandClass(c.merk);
      const barWidth = Math.min(100, Math.round((c.units / maxUnits) * 100));

      return `
        <tr class="${isToyota ? 'highlight-row' : ''}" style="${isToyota ? 'background:#fff5f5;' : ''}">
          <td style="text-align:center; font-weight:800; color:#64748b;">${rankBadge}</td>
          <td><span class="brand-pill ${brandClass}">${escapeHtml(c.merk)}</span></td>
          <td>
            <div style="font-weight:700; color:#0f172a; font-size:12.5px;">${escapeHtml(c.cleanName || c.rawType)}</div>
            <div style="font-size:10.5px; color:#64748b; font-family:monospace;">${escapeHtml(c.rawType)}</div>
          </td>
          <td style="text-align:right; font-weight:800; color:#0f172a; font-size:13px;">${c.units.toLocaleString('id-ID')} <span style="font-size:10px; font-weight:600; color:#64748b;">Unit</span></td>
          <td style="text-align:right; font-weight:800; color:${isToyota ? '#cc1426' : '#2563eb'}; font-size:12px;">${c.share}%</td>
          <td>
            <div class="visual-progress-wrap" title="${c.units} Unit">
              <div class="visual-progress-bar ${isToyota ? 'is-toyota' : ''}" style="width: ${barWidth}%;"></div>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  function getBrandClass(merk) {
    const m = (merk || '').toUpperCase();
    if (m === 'TOYOTA') return 'toyota';
    if (m === 'HONDA') return 'honda';
    if (m === 'HYUNDAI') return 'hyundai';
    if (m === 'MITSUBISHI') return 'mitsubishi';
    if (m === 'SUZUKI') return 'suzuki';
    if (m === 'DAIHATSU') return 'daihatsu';
    if (m === 'WULING') return 'wuling';
    return 'other';
  }

  function setInspectorChartMode(mode) {
    currentInspectorChartMode = mode;
    document.querySelectorAll('.pi-chart-tab').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-mode') === mode);
    });
    if (selectedDistrictId && allDistrictsCars[selectedDistrictId]) {
      renderInspectorCarChart(allDistrictsCars[selectedDistrictId]);
    }
  }

  function setMainChartMode(mode) {
    currentMainChartMode = mode;
    const btnAll = document.getElementById('btnCpFilterAll');
    const btnToyota = document.getElementById('btnCpFilterToyota');
    if (btnAll) btnAll.classList.toggle('active', mode === 'all');
    if (btnToyota) btnToyota.classList.toggle('active', mode === 'toyota');
    if (selectedDistrictId && allDistrictsCars[selectedDistrictId]) {
      renderMainCarRankingChart(allDistrictsCars[selectedDistrictId]);
    }
  }

  /**
   * Render District Cards Grid (Tab 2 or overview)
   */
  function renderDistrictCards() {
    const container = document.getElementById('polregCardsGrid');
    if (!container) return;

    let filtered = allDistricts.filter(isDistrictMatch);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align:center; padding:36px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:14px; color:#64748b;">
          <i class="fa-solid fa-map-location-dot" style="font-size:32px; color:#94a3b8; margin-bottom:8px;"></i>
          <p style="margin:0; font-size:13px; font-weight:700;">Tidak ditemukan kecamatan dengan kata kunci tersebut.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = filtered.map(dist => {
      const shareCls = getShareClass(dist.marketShare);
      const isSelected = dist.id === selectedDistrictId;

      return `
        <div class="dist-card ${isSelected ? 'selected-active' : ''}" data-id="${dist.id}" onclick="window.PolregMap.selectDistrict('${dist.id}', true)">
          <div class="dist-card-head">
            <div>
              <div class="dist-card-name">${escapeHtml(dist.name)}</div>
              <div class="dist-card-zone">${escapeHtml(dist.zone)}</div>
            </div>
            <div class="dist-card-share-val ${shareCls}">
              ${dist.marketShare}%
            </div>
          </div>

          <div class="dist-bar-track">
            <div class="dist-bar-fill ${shareCls}" style="width: ${Math.min(100, (dist.marketShare / 45) * 100)}%;"></div>
          </div>

          <div class="dist-card-meta">
            <span>Pasar: <strong>${dist.totalPolregMarket} Unit</strong></span>
            <span>Target: <strong>${dist.targetShare}%</strong></span>
          </div>

          <div class="dist-card-model">
            <span><i class="fa-solid fa-car" style="color:#cc1426;"></i> ${escapeHtml(dist.modelBadge || dist.recommendedModel)}</span>
            <button type="button" class="dist-card-btn-focus" onclick="event.stopPropagation(); window.PolregMap.selectDistrict('${dist.id}', true);">
              <i class="fa-solid fa-location-crosshairs"></i> Fokus
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render Comprehensive District Table (Tab 2)
   */
  function renderDistrictTable() {
    const tbody = document.getElementById('polregTableBody');
    if (!tbody) return;

    let sorted = allDistricts.filter(isDistrictMatch).sort((a, b) => b.marketShare - a.marketShare);

    tbody.innerHTML = sorted.map((dist, idx) => {
      const shareCls = getShareClass(dist.marketShare);

      let urgencyPill = '<span class="badge" style="background:#ecfdf5; color:#059669; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:6px;">Solid</span>';
      if (dist.urgencyLevel === 'immediate' || dist.marketShare < 30) {
        urgencyPill = '<span class="badge" style="background:#fef2f2; color:#dc2626; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:6px;">Low Share 🔥</span>';
      } else if (dist.urgencyLevel === 'priority') {
        urgencyPill = '<span class="badge" style="background:#fffbeb; color:#d97706; font-size:10.5px; font-weight:800; padding:3px 8px; border-radius:6px;">Priority</span>';
      }

      let regencyBadge = '<span class="badge" style="background:#eff6ff; color:#1e40af; font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:6px;">Kota Bandung</span>';
      if (dist.regencyId === 'kota_cimahi') {
        regencyBadge = '<span class="badge" style="background:#f0fdf4; color:#166534; font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:6px;">Kota Cimahi</span>';
      } else if (dist.regencyId === 'kab_bandung') {
        regencyBadge = '<span class="badge" style="background:#fefce8; color:#854d0e; font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:6px;">Kab. Bandung</span>';
      } else if (dist.regencyId === 'kab_bandung_barat') {
        regencyBadge = '<span class="badge" style="background:#fdf4ff; color:#86198f; font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:6px;">KBB</span>';
      }

      return `
        <tr data-id="${dist.id}" style="cursor:pointer;" onclick="window.PolregMap.selectDistrict('${dist.id}', true)">
          <td style="text-align:center; font-weight:800; color:#64748b;">#${idx + 1}</td>
          <td style="font-weight:800; color:#0f172a;">${escapeHtml(dist.name)}</td>
          <td>${regencyBadge}</td>
          <td><span style="font-size:11.5px; color:#475569;">${escapeHtml(dist.zone)}</span></td>
          <td style="text-align:right;"><strong>${dist.totalPolregMarket.toLocaleString('id-ID')}</strong> U</td>
          <td style="text-align:right;"><strong>${dist.toyotaVolume.toLocaleString('id-ID')}</strong> U</td>
          <td style="text-align:right; font-weight:900;">
            <span class="dist-card-share-val ${shareCls}" style="font-size:14px;">${dist.marketShare}%</span>
          </td>
          <td style="text-align:right; color:#64748b;">${dist.targetShare}%</td>
          <td>${urgencyPill}</td>
          <td><span style="font-size:11px; font-weight:700; color:#334155;">${escapeHtml(dist.modelBadge || dist.recommendedModel)}</span></td>
          <td style="text-align:center;">
            <button type="button" class="btn-pi-primary" style="padding:4px 10px; font-size:11px; width:auto;" onclick="event.stopPropagation(); window.PolregMap.selectDistrict('${dist.id}', true);">
              <i class="fa-solid fa-eye"></i> Peta
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  /**
   * Update Summary KPIs on Top
   */
  function updateSummaryKpis() {
    if (allDistricts.length === 0) return;

    const totalMarket = allDistricts.reduce((sum, d) => sum + (d.totalPolregMarket || 0), 0);
    const totalToyota = allDistricts.reduce((sum, d) => sum + (d.toyotaVolume || 0), 0);
    const avgShare = (allDistricts.reduce((sum, d) => sum + (d.marketShare || 0), 0) / allDistricts.length).toFixed(1);
    const evolveCount = allDistricts.filter(d => d.urgencyLevel === 'immediate' || d.urgencyLevel === 'priority' || d.marketShare < 30).length;

    const elTotalMkt = document.getElementById('polregKpiTotalMarket');
    const elAvgShare = document.getElementById('polregKpiAvgShare');
    const elEvolveCount = document.getElementById('polregKpiEvolveCount');
    const elHomeBase = document.getElementById('polregKpiHomeBaseShare');

    if (elTotalMkt) elTotalMkt.textContent = `${totalMarket.toLocaleString('id-ID')} Unit`;
    if (elAvgShare) elAvgShare.textContent = `${avgShare}%`;
    if (elEvolveCount) elEvolveCount.textContent = `${evolveCount} Wilayah`;
    if (elHomeBase) elHomeBase.textContent = `35.6% (Kircon)`;

    // Populate Dropdown Select grouped by Regency
    const selectEl = document.getElementById('polregDistrictSelect');
    if (selectEl && selectEl.options.length <= 1) {
      const regGroups = [
        { id: 'kota_bandung', name: 'Kota Bandung' },
        { id: 'kota_cimahi', name: 'Kota Cimahi' },
        { id: 'kab_bandung', name: 'Kabupaten Bandung' },
        { id: 'kab_bandung_barat', name: 'Kabupaten Bandung Barat' }
      ];

      let selectHtml = '<option value="">-- Pilih / Zoom ke Kecamatan (79 Wilayah) --</option>';
      regGroups.forEach(rg => {
        const dInReg = allDistricts.filter(d => d.regencyId === rg.id);
        if (dInReg.length > 0) {
          selectHtml += `<optgroup label="${rg.name} (${dInReg.length} Kecamatan)">`;
          dInReg.forEach(d => {
            selectHtml += `<option value="${d.id}">[${d.marketShare}%] ${escapeHtml(d.name)} (${escapeHtml(d.zone)})</option>`;
          });
          selectHtml += `</optgroup>`;
        }
      });
      selectEl.innerHTML = selectHtml;
    }
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    // Dropdown change
    const selectEl = document.getElementById('polregDistrictSelect');
    if (selectEl) {
      selectEl.addEventListener('change', function () {
        if (this.value) {
          selectDistrict(this.value, true);
        } else {
          resetAllPolygonsView();
        }
      });
    }

    // Initialize Search Autocomplete, Enter Key, Clear button, and Map Zoom
    initSearchAutocomplete();

    // Filter pills
    document.querySelectorAll('.polreg-pill-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.polreg-pill-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.getAttribute('data-filter') || 'all';
        applyAllFilters();
      });
    });

    // Regency button filters
    document.querySelectorAll('.polreg-regency-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.polreg-regency-btn').forEach(b => {
          b.classList.remove('active');
          b.style.background = '#ffffff';
          b.style.color = '#334155';
        });
        this.classList.add('active');
        this.style.background = '#0f172a';
        this.style.color = '#ffffff';
        currentRegencyFilter = this.getAttribute('data-regency') || 'all';
        applyAllFilters();
      });
    });

    // Recenter to Office Button
    const btnOffice = document.getElementById('btnPolregRecenterOffice');
    if (btnOffice) {
      btnOffice.addEventListener('click', () => {
        if (polregMap) {
          polregMap.setView(OFFICE_COORDS, 15, { animate: true });
          if (officeMarker) officeMarker.openPopup();
        }
      });
    }

    // Show All Polygons Button
    const btnShowAll = document.getElementById('btnPolregShowAll');
    if (btnShowAll) {
      btnShowAll.addEventListener('click', resetAllPolygonsView);
    }

    // Smart Declutter Label Mode Switcher
    function switchLabelMode(mode) {
      currentLabelMode = mode;
      const container = document.getElementById('polregLeafletMap');
      if (container) {
        container.classList.remove('label-mode-smart', 'label-mode-dots', 'label-mode-alltext');
        if (mode === 'smart') container.classList.add('label-mode-smart');
        else if (mode === 'dots') container.classList.add('label-mode-dots');
        else if (mode === 'alltext') container.classList.add('label-mode-alltext');
      }
      document.querySelectorAll('.polreg-mode-btn').forEach(btn => btn.classList.remove('active'));
      const activeBtn = document.getElementById(
        mode === 'smart' ? 'btnPolregModeSmart' :
        mode === 'dots' ? 'btnPolregModeDots' : 'btnPolregModeAllText'
      );
      if (activeBtn) activeBtn.classList.add('active');
    }

    const btnSmart = document.getElementById('btnPolregModeSmart');
    const btnDots = document.getElementById('btnPolregModeDots');
    const btnAllText = document.getElementById('btnPolregModeAllText');

    if (btnSmart) btnSmart.addEventListener('click', () => switchLabelMode('smart'));
    if (btnDots) btnDots.addEventListener('click', () => switchLabelMode('dots'));
    if (btnAllText) btnAllText.addEventListener('click', () => switchLabelMode('alltext'));

    // Layer Switcher Buttons
    const btnRoadmap = document.getElementById('btnPolregLayerRoadmap');
    const btnSat = document.getElementById('btnPolregLayerSatellite');
    const btnCarto = document.getElementById('btnPolregLayerCarto');

    if (btnRoadmap) btnRoadmap.addEventListener('click', () => switchMapLayer('roadmap'));
    if (btnSat) btnSat.addEventListener('click', () => switchMapLayer('satellite'));
    if (btnCarto) btnCarto.addEventListener('click', () => switchMapLayer('carto'));

    // Export CSV
    const btnExport = document.getElementById('btnPolregExportCsv');
    if (btnExport) {
      btnExport.addEventListener('click', exportPolregCsv);
    }

    // Car Table search input
    const carSearch = document.getElementById('cpCarSearchInput');
    if (carSearch) {
      carSearch.addEventListener('input', (e) => {
        currentCarTableSearch = e.target.value.trim();
        if (selectedDistrictId && allDistrictsCars[selectedDistrictId]) {
          renderCarDetailTable(allDistrictsCars[selectedDistrictId]);
        }
      });
    }

    // Car Table brand filter select
    const brandFilter = document.getElementById('cpBrandFilterSelect');
    if (brandFilter) {
      brandFilter.addEventListener('change', (e) => {
        currentCarTableBrandFilter = e.target.value;
        if (selectedDistrictId && allDistrictsCars[selectedDistrictId]) {
          renderCarDetailTable(allDistrictsCars[selectedDistrictId]);
        }
      });
    }
  }

  /**
   * Search Autocomplete & Instant Zoom to Kecamatan
   */
  function initSearchAutocomplete() {
    const searchInput = document.getElementById('polregSearchInput');
    const clearBtn = document.getElementById('btnPolregClearSearch');
    const suggestionsEl = document.getElementById('polregSearchSuggestions');
    if (!searchInput || !suggestionsEl) return;

    let activeSuggestionIndex = -1;

    function highlightMatch(text, query) {
      if (!query) return escapeHtml(text);
      const idx = text.toLowerCase().indexOf(query.toLowerCase());
      if (idx === -1) return escapeHtml(text);
      const before = text.substring(0, idx);
      const match = text.substring(idx, idx + query.length);
      const after = text.substring(idx + query.length);
      return `${escapeHtml(before)}<mark>${escapeHtml(match)}</mark>${escapeHtml(after)}`;
    }

    function renderSuggestions(query) {
      const q = (query || '').toLowerCase().trim();
      if (!q) {
        suggestionsEl.innerHTML = '';
        suggestionsEl.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
        activeSuggestionIndex = -1;
        return;
      }

      if (clearBtn) clearBtn.style.display = 'flex';

      const matches = allDistricts.filter(d => {
        return (
          d.name.toLowerCase().includes(q) ||
          (d.regency || '').toLowerCase().includes(q) ||
          (d.recommendedModel || '').toLowerCase().includes(q) ||
          (d.modelBadge || '').toLowerCase().includes(q) ||
          (d.competitor || '').toLowerCase().includes(q) ||
          (d.zone || '').toLowerCase().includes(q) ||
          (d.housingKey || '').toLowerCase().includes(q)
        );
      });

      // Sort: Name exact prefix comes first, then contains name
      matches.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aStarts = aName.startsWith(q);
        const bStarts = bName.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      });

      if (matches.length === 0) {
        suggestionsEl.innerHTML = `
          <div class="polreg-search-empty">
            <i class="fa-solid fa-circle-exclamation" style="margin-right:4px; color:#ef4444;"></i>
            Kecamatan "<strong>${escapeHtml(query)}</strong>" tidak ditemukan di Bandung Raya
          </div>
        `;
        suggestionsEl.style.display = 'block';
        activeSuggestionIndex = -1;
        return;
      }

      const displayList = matches.slice(0, 8);
      let html = '';
      displayList.forEach((d, idx) => {
        const shareCls = getShareClass(d.marketShare);
        const recModel = d.modelBadge || d.recommendedModel || 'Toyota';
        html += `
          <div class="polreg-search-suggestion-item" data-id="${d.id}" data-index="${idx}">
            <div class="polreg-suggestion-main">
              <span class="polreg-suggestion-name">
                <i class="fa-solid fa-location-dot" style="color:#cc1426; margin-right:4px; font-size:11px;"></i>
                ${highlightMatch(d.name, q)}
              </span>
              <span class="polreg-suggestion-meta">
                ${escapeHtml(d.regency || 'Bandung Raya')}${d.zone ? ' • ' + escapeHtml(d.zone) : ''}
              </span>
            </div>
            <div class="polreg-suggestion-badges">
              <span class="polreg-suggestion-share ${shareCls}">${d.marketShare}%</span>
              <span class="polreg-suggestion-model"><i class="fa-solid fa-car-side" style="margin-right:2px;"></i>${escapeHtml(recModel)}</span>
            </div>
          </div>
        `;
      });

      suggestionsEl.innerHTML = html;
      suggestionsEl.style.display = 'block';
      activeSuggestionIndex = -1;

      // Item click listener
      suggestionsEl.querySelectorAll('.polreg-search-suggestion-item').forEach(item => {
        item.addEventListener('click', function () {
          const distId = this.getAttribute('data-id');
          if (distId) {
            const target = allDistricts.find(d => d.id === distId);
            if (target) {
              searchInput.value = target.name;
            }
            suggestionsEl.style.display = 'none';
            selectDistrict(distId, true);
          }
        });
      });
    }

    searchInput.addEventListener('input', function () {
      const q = this.value;
      renderSuggestions(q);
      applyAllFilters();
    });

    searchInput.addEventListener('focus', function () {
      if (this.value.trim().length > 0) {
        renderSuggestions(this.value);
      }
    });

    // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
    searchInput.addEventListener('keydown', function (e) {
      const items = suggestionsEl.querySelectorAll('.polreg-search-suggestion-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (items.length > 0) {
          activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === activeSuggestionIndex));
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (items.length > 0) {
          activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
          items.forEach((it, i) => it.classList.toggle('active', i === activeSuggestionIndex));
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
          items[activeSuggestionIndex].click();
        } else {
          // If no item highlighted, find the first matching district
          const q = this.value.trim().toLowerCase();
          if (q) {
            const firstMatch = allDistricts.find(d =>
              d.name.toLowerCase().includes(q) ||
              (d.regency || '').toLowerCase().includes(q)
            );
            if (firstMatch) {
              this.value = firstMatch.name;
              suggestionsEl.style.display = 'none';
              selectDistrict(firstMatch.id, true);
            }
          }
        }
      } else if (e.key === 'Escape') {
        suggestionsEl.style.display = 'none';
      }
    });

    // Clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        searchInput.value = '';
        suggestionsEl.style.display = 'none';
        this.style.display = 'none';
        resetAllPolygonsView();
        searchInput.focus();
      });
    }

    // Close suggestions when clicking outside
    document.addEventListener('click', function (e) {
      if (!e.target.closest('#polregSearchBox')) {
        suggestionsEl.style.display = 'none';
      }
    });
  }

  /**
   * Reset All Polygons & View (Show whole Bandung Raya)
   */
  function resetAllPolygonsView() {
    selectedDistrictId = null;
    currentFilter = 'all';
    currentRegencyFilter = 'all';
    const searchInput = document.getElementById('polregSearchInput');
    if (searchInput) searchInput.value = '';
    const clearBtn = document.getElementById('btnPolregClearSearch');
    if (clearBtn) clearBtn.style.display = 'none';
    const suggestionsEl = document.getElementById('polregSearchSuggestions');
    if (suggestionsEl) {
      suggestionsEl.innerHTML = '';
      suggestionsEl.style.display = 'none';
    }
    const selectEl = document.getElementById('polregDistrictSelect');
    if (selectEl) selectEl.value = '';

    document.querySelectorAll('.polreg-pill-btn').forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-filter') === 'all') b.classList.add('active');
    });

    document.querySelectorAll('.polreg-regency-btn').forEach(b => {
      b.classList.remove('active');
      if (b.getAttribute('data-regency') === 'all') {
        b.classList.add('active');
        b.style.background = '#0f172a';
        b.style.color = '#ffffff';
      } else {
        b.style.background = '#ffffff';
        b.style.color = '#334155';
      }
    });

    applyAllFilters();
  }

  /**
   * Helper: Match District with active Status, Regency, and Search filters
   */
  function isDistrictMatch(d) {
    const searchQuery = (document.getElementById('polregSearchInput')?.value || '').toLowerCase().trim();

    if (searchQuery) {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery) ||
        (d.regency || '').toLowerCase().includes(searchQuery) ||
        (d.recommendedModel || '').toLowerCase().includes(searchQuery) ||
        (d.modelBadge || '').toLowerCase().includes(searchQuery) ||
        (d.competitor || '').toLowerCase().includes(searchQuery) ||
        (d.zone || '').toLowerCase().includes(searchQuery) ||
        (d.housingKey || '').toLowerCase().includes(searchQuery);

      if (!matchesSearch) return false;
      return true;
    }

    if (currentRegencyFilter !== 'all' && d.regencyId !== currentRegencyFilter) {
      return false;
    }
    if (currentFilter === 'evolve') {
      if (!(d.urgencyLevel === 'immediate' || d.urgencyLevel === 'priority' || d.marketShare < 30.0)) {
        return false;
      }
    } else if (currentFilter === 'low') {
      if (d.marketShare >= 30.0) return false;
    } else if (currentFilter === 'mid') {
      if (d.marketShare < 30.0 || d.marketShare >= 35.0) return false;
    } else if (currentFilter === 'high') {
      if (d.marketShare < 35.0) return false;
    }

    return true;
  }

  /**
   * Dynamic Status Pill Counters
   */
  function updatePillCounters() {
    const scopeDistricts = currentRegencyFilter === 'all'
      ? allDistricts
      : allDistricts.filter(d => d.regencyId === currentRegencyFilter);

    const cAll = scopeDistricts.length;
    const cEvolve = scopeDistricts.filter(d => d.urgencyLevel === 'immediate' || d.urgencyLevel === 'priority' || d.marketShare < 30.0).length;
    const cLow = scopeDistricts.filter(d => d.marketShare < 30.0).length;
    const cMid = scopeDistricts.filter(d => d.marketShare >= 30.0 && d.marketShare < 35.0).length;
    const cHigh = scopeDistricts.filter(d => d.marketShare >= 35.0).length;

    const elAll = document.getElementById('cntPolregAll');
    const elEvolve = document.getElementById('cntPolregEvolve');
    const elLow = document.getElementById('cntPolregLow');
    const elMid = document.getElementById('cntPolregMid');
    const elHigh = document.getElementById('cntPolregHigh');

    if (elAll) elAll.textContent = cAll;
    if (elEvolve) elEvolve.textContent = cEvolve;
    if (elLow) elLow.textContent = cLow;
    if (elMid) elMid.textContent = cMid;
    if (elHigh) elHigh.textContent = cHigh;
  }

  /**
   * Dynamic District Dropdown
   */
  function updateDistrictDropdown() {
    const selectEl = document.getElementById('polregDistrictSelect');
    if (!selectEl) return;

    const regGroups = [
      { id: 'kota_bandung', name: 'Kota Bandung' },
      { id: 'kota_cimahi', name: 'Kota Cimahi' },
      { id: 'kab_bandung', name: 'Kabupaten Bandung' },
      { id: 'kab_bandung_barat', name: 'Kabupaten Bandung Barat' }
    ];

    const matchingDistricts = allDistricts.filter(isDistrictMatch);
    const filterLabel =
      currentFilter === 'low' ? 'Low Share (<30%)' :
      currentFilter === 'mid' ? 'Solid (30-34.9%)' :
      currentFilter === 'high' ? 'Dominan (≥35%)' :
      currentFilter === 'evolve' ? 'Prioritas EVOLVE' : '79 Wilayah';

    let selectHtml = `<option value="">-- Pilih Kecamatan (${matchingDistricts.length} Wilayah ${filterLabel}) --</option>`;

    regGroups.forEach(rg => {
      const dInReg = matchingDistricts.filter(d => d.regencyId === rg.id);
      if (dInReg.length > 0) {
        selectHtml += `<optgroup label="${rg.name} (${dInReg.length} Kecamatan)">`;
        dInReg.forEach(d => {
          selectHtml += `<option value="${d.id}">[${d.marketShare}%] ${escapeHtml(d.name)} (${escapeHtml(d.zone)})</option>`;
        });
        selectHtml += `</optgroup>`;
      }
    });

    selectEl.innerHTML = selectHtml;
    if (selectedDistrictId && matchingDistricts.some(d => d.id === selectedDistrictId)) {
      selectEl.value = selectedDistrictId;
    }
  }

  /**
   * Apply All Filters (Status + Regency + Search) across Map, Cards, Table & Dropdown
   */
  function applyAllFilters() {
    updatePillCounters();
    renderDistrictCards();
    renderDistrictTable();
    updateDistrictDropdown();

    if (!polregMap) return;

    selectedDistrictId = null;
    const targetLayers = [];

    allDistricts.forEach(d => {
      const poly = polygonLayers[d.id];
      const marker = markerLayers[d.id];
      const isMatch = isDistrictMatch(d);

      if (poly) {
        const c = getShareColor(d.marketShare);
        if (isMatch) {
          poly.setStyle({
            color: c,
            weight: 2,
            fillColor: c,
            fillOpacity: 0.45,
            opacity: 1
          });
          if (poly._path) {
            poly._path.style.display = '';
            poly._path.style.pointerEvents = 'auto';
          }
          targetLayers.push(poly);
        } else {
          poly.setStyle({
            color: '#cbd5e1',
            weight: 0,
            fillColor: '#ffffff',
            fillOpacity: 0,
            opacity: 0
          });
          if (poly._path) {
            poly._path.style.display = 'none';
            poly._path.style.pointerEvents = 'none';
          }
        }
      }

      if (marker) {
        const el = marker.getElement();
        if (el) {
          el.style.display = isMatch ? 'flex' : 'none';
          el.style.opacity = isMatch ? '1' : '0';
          el.style.pointerEvents = isMatch ? 'auto' : 'none';
        }
      }
    });

    if (targetLayers.length > 0) {
      const group = L.featureGroup(targetLayers);
      polregMap.fitBounds(group.getBounds(), {
        padding: [30, 30],
        maxZoom: 12,
        animate: true
      });
    } else {
      polregMap.setView([-6.935, 107.615], 11);
    }
    setTimeout(updateMapZoomClasses, 350);
  }

  /**
   * Export Polreg Data to CSV
   */
  function exportPolregCsv() {
    if (!allDistricts || allDistricts.length === 0) {
      alert('Data Polreg belum siap untuk diunduh.');
      return;
    }
    const headers = ['No', 'ID', 'Kecamatan', 'Kabupaten_Kota', 'Zona', 'Market_Share_Pct', 'Target_Pct', 'Total_Pasar_Unit', 'Volume_Toyota_Unit', 'Status_Urgensi', 'Model_Rekomendasi', 'Kompetitor_Terberat'];
    const rows = allDistricts.map((d, i) => [
      i + 1,
      d.id,
      `"${d.name}"`,
      `"${d.regency || ''}"`,
      `"${d.zone || ''}"`,
      d.marketShare,
      d.targetShare,
      d.totalPolregMarket,
      d.toyotaVolume,
      `"${d.urgency || ''}"`,
      `"${d.modelBadge || d.recommendedModel || ''}"`,
      `"${d.competitor || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Polreg_79_Kecamatan_Bandung_Raya_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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

  // Expose API globally
  window.PolregMap = {
    init: initPolregView,
    selectDistrict: selectDistrict,
    resetView: resetAllPolygonsView,
    switchLayer: switchMapLayer,
    exportCsv: exportPolregCsv,
    setInspectorChartMode: setInspectorChartMode,
    setMainChartMode: setMainChartMode,
    getPolygon: (id) => polygonLayers[id],
    getAllDistricts: () => allDistricts
  };

  // Direct Canvassing Checkin Helper for Sales Force
  window.goToDistrictCanvassing = function (customKec) {
    let kecName = customKec;
    if (!kecName) {
      const dist = (allDistricts && selectedDistrictId) ? allDistricts.find(d => d.id === selectedDistrictId) : (allDistricts ? allDistricts[0] : null);
      kecName = dist ? dist.name : 'Bandung';
    }
    window.location.href = `checkin.html?location=Kecamatan+${encodeURIComponent(kecName)}&activity=Canvassing+Wilayah`;
  };

  // Tab switching helper
  window.switchPolregTab = function (tabName) {
    const viewAnalisis = document.getElementById('viewAnalisis');
    const viewDaftar = document.getElementById('viewDaftar');
    const tabAnalisis = document.getElementById('tabAnalisis');
    const tabDaftar = document.getElementById('tabDaftar');

    sessionStorage.setItem('polreg_active_tab', tabName);
    try {
      const u = new URL(window.location.href);
      u.searchParams.set('tab', tabName);
      window.history.replaceState({}, '', u.toString());
    } catch (e) {}

    if (tabName === 'daftar') {
      if (viewAnalisis) viewAnalisis.style.display = 'none';
      if (viewDaftar) viewDaftar.style.display = 'block';
      if (tabAnalisis) tabAnalisis.classList.remove('active');
      if (tabDaftar) tabDaftar.classList.add('active');
      renderDistrictTable();
      renderDistrictCards();
    } else {
      if (viewAnalisis) viewAnalisis.style.display = 'block';
      if (viewDaftar) viewDaftar.style.display = 'none';
      if (tabAnalisis) tabAnalisis.classList.add('active');
      if (tabDaftar) tabDaftar.classList.remove('active');
      if (polregMap) {
        setTimeout(() => {
          polregMap.invalidateSize();
        }, 150);
      }
    }
  };

  // Auto initialize on DOM ready
  document.addEventListener('DOMContentLoaded', async () => {
    try {
      localStorage.setItem('sft_last_visited_page', window.location.href);
      sessionStorage.setItem('sft_last_visited_page', window.location.href);
    } catch (e) {}

    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab') || sessionStorage.getItem('polreg_active_tab') || 'analisis';

    await initPolregView();
    window.switchPolregTab(tabFromUrl);
  });

})();
