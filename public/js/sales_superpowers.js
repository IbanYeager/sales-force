/**
 * SALES SUPERPOWERS 7.0 - CLIENT LOGIC & ENGINE
 * Tunas Toyota Kiara Condong (SFT)
 * Features:
 * 1. Radar Prospek Terdekat (GPS Leads)
 * 2. Instant Quotation to PDF & WA
 * 3. Smart Follow-Up Reminder & Morning Briefing
 * 4. Scan KTP & STNK Otomatis (OCR)
 * 5. Voice Note Activity Log (Speech-to-Text)
 * 6. Battle Card & Objection Handling
 * 7. Live Stock Quick Checker
 */

const SalesSuperpowers = {
  recognition: null,
  isRecording: false,
  salesCoords: null,

  getApiPrefix() {
    const path = window.location.pathname;
    const isRoot = !path.includes('/pages/') && !path.includes('/pages_spv/') && !path.includes('/pages_kacab/');
    return isRoot ? 'api/' : '../api/';
  },

  getApiEndpoints(apiFile = 'api_ocr_scanner.php') {
    const prefix = this.getApiPrefix();
    const pathname = window.location.pathname || '';
    const parts = pathname.split('/').filter(Boolean);
    let subfolder = '';
    if (parts.length > 0) {
      const first = parts[0].toLowerCase();
      const standardRoutes = ['pages', 'pages_spv', 'pages_kacab', 'spv', 'kacab', 'spk', 'customer', 'input', 'dashboard', 'index', 'index.html', 'home', 'api'];
      if (!standardRoutes.includes(first)) {
        subfolder = '/' + parts[0];
      }
    }

    const list = [
      `${prefix}${apiFile}`,
      `${subfolder}/api/${apiFile}`,
      `${subfolder}/public/api/${apiFile}`,
      `api/${apiFile}`,
      `../api/${apiFile}`,
      `/api/${apiFile}`,
      `/public/api/${apiFile}`,
      `public/api/${apiFile}`
    ];
    return Array.from(new Set(list.filter(Boolean)));
  },

  // =========================================================================
  // 1. RADAR PROSPEK TERDEKAT (EXECUTIVE RADAR COCKPIT)
  // =========================================================================
  radarData: [],
  radarData: [],
  currentRadius: 50,
  currentDistrict: 'all',
  leafletMap: null,
  leafletMarkers: [],
  selectedPhotoFile: null,

  async renderRadarCockpit(containerId = 'followupDataContainer', district = 'all', radiusKm = 5) {
    this.currentRadius = parseFloat(radiusKm) || 5;
    this.currentDistrict = district;

    // Restore saved sales coords if available
    const savedLat = localStorage.getItem('savedSalesLat');
    const savedLng = localStorage.getItem('savedSalesLng');
    if (savedLat && savedLng) {
      this.salesCoords = { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    // Render Cockpit Shell with Interactive Leaflet Map, District & Ring Radius Selectors, and Location Search Bar
    container.innerHTML = `
      <div class="radar-cockpit-hero" style="background: linear-gradient(135deg, #0d1b3e 0%, #162a52 100%); padding: 18px; border-radius: 18px; color: #fff; margin-bottom: 18px;">
        <div class="radar-top-row" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div class="radar-title-wrap" style="display:flex; align-items:center; gap:12px;">
            <div class="radar-sonar-mini">
              <div class="center-blip"></div>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="font-size:16px; font-weight:900; margin:0; color:#ffffff;">Peta Radar GPS Prospek (Google Maps)</h3>
                <span class="radar-gps-badge" id="radarGpsStatus"><i class="fa-solid fa-satellite-dish"></i> Mendeteksi GPS...</span>
              </div>
              <p style="font-size:12px; color:rgba(255,255,255,0.75); margin:3px 0 0 0;" id="radarSubtitleText">
                Memetakan titik lokasi customer se-akurat mungkin di dalam ring radius pilihan agenda kunjungan sales.
              </p>
            </div>
          </div>

          <!-- Controls: Ring Radius & District Selector -->
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <!-- Ring Radius Dropdown Selector -->
            <div style="display:flex; align-items:center; gap:6px;">
              <label style="font-size:12px; font-weight:800; color:#94a3b8;"><i class="fa-solid fa-bullseye" style="color:#38bdf8;"></i> Ring Radius:</label>
              <select id="radarRadiusSelect" onchange="SalesSuperpowers.handleRadiusChange(this.value, '${containerId}')" style="padding:7px 12px; border-radius:10px; font-size:12px; font-weight:800; border:1px solid rgba(255,255,255,0.2); background:#1e293b; color:#ffffff; cursor:pointer;">
                <option value="1" ${this.currentRadius == 1 ? 'selected' : ''}>⭕ Ring 1 km</option>
                <option value="3" ${this.currentRadius == 3 ? 'selected' : ''}>⭕ Ring 3 km</option>
                <option value="5" ${this.currentRadius == 5 ? 'selected' : ''}>⭕ Ring 5 km</option>
                <option value="10" ${this.currentRadius == 10 ? 'selected' : ''}>⭕ Ring 10 km</option>
                <option value="25" ${this.currentRadius == 25 ? 'selected' : ''}>⭕ Ring 25 km</option>
                <option value="999" ${this.currentRadius >= 999 ? 'selected' : ''}>🌐 Semua (> 25 km)</option>
              </select>
            </div>

            <!-- District Filter Dropdown -->
            <div style="display:flex; align-items:center; gap:6px;">
              <label style="font-size:12px; font-weight:800; color:#94a3b8;"><i class="fa-solid fa-filter" style="color:#f43f5e;"></i> Wilayah:</label>
              <select id="radarDistrictSelect" onchange="SalesSuperpowers.handleDistrictChange(this.value, '${containerId}')" style="padding:7px 12px; border-radius:10px; font-size:12px; font-weight:800; border:1px solid rgba(255,255,255,0.2); background:#1e293b; color:#ffffff; cursor:pointer;">
                <option value="all" ${district === 'all' ? 'selected' : ''}>🌐 Semua Wilayah / Kecamatan</option>
                <option value="buahbatu" ${district === 'buahbatu' ? 'selected' : ''}>📍 Buahbatu / Buah Batu</option>
                <option value="kiara" ${district === 'kiara' ? 'selected' : ''}>📍 Kiara Condong</option>
                <option value="batununggal" ${district === 'batununggal' ? 'selected' : ''}>📍 Batununggal</option>
                <option value="lengkong" ${district === 'lengkong' ? 'selected' : ''}>📍 Lengkong</option>
                <option value="antapani" ${district === 'antapani' ? 'selected' : ''}>📍 Antapani</option>
                <option value="arcamanik" ${district === 'arcamanik' ? 'selected' : ''}>📍 Arcamanik</option>
                <option value="rancasari" ${district === 'rancasari' ? 'selected' : ''}>📍 Rancasari</option>
                <option value="gedebage" ${district === 'gedebage' ? 'selected' : ''}>📍 Gedebage</option>
                <option value="cibeunying" ${district === 'cibeunying' ? 'selected' : ''}>📍 Cibeunying</option>
                <option value="sukajadi" ${district === 'sukajadi' ? 'selected' : ''}>📍 Sukajadi</option>
                <option value="dago" ${district === 'dago' ? 'selected' : ''}>📍 Dago / Coblong</option>
                <option value="cimahi" ${district === 'cimahi' ? 'selected' : ''}>📍 Cimahi</option>
                <option value="sumedang" ${district === 'sumedang' ? 'selected' : ''}>📍 Sumedang / Jatinangor</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Sales GPS Address Search & Precision Controls Bar -->
        <div style="display:flex; align-items:center; gap:8px; margin-top:12px; background:rgba(255,255,255,0.08); padding:8px 12px; border-radius:12px; border:1px solid rgba(255,255,255,0.15); flex-wrap:wrap;">
          <i class="fa-solid fa-location-crosshairs" style="color:#38bdf8; font-size:14px;"></i>
          <input type="text" id="salesLocationSearchInput" placeholder="Ketik lokasi Anda (misal: PSM Pindad, Buahbatu, Terusan Buahbatu)..." style="flex:1; min-width:200px; background:transparent; border:none; color:#ffffff; font-size:12px; font-weight:700; outline:none;" onkeypress="if(event.key==='Enter') SalesSuperpowers.searchAndSetLocation(this.value)">
          <button onclick="SalesSuperpowers.searchAndSetLocation(document.getElementById('salesLocationSearchInput').value)" style="background:#38bdf8; color:#0f172a; border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-magnifying-glass"></i> Set Lokasi
          </button>
          <button onclick="SalesSuperpowers.requestHighAccuracyGPS()" style="background:#10b981; color:#ffffff; border:none; padding:6px 14px; border-radius:8px; font-weight:800; font-size:11.5px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="Lacak ulang GPS Akurat HP">
            <i class="fa-solid fa-location-arrow"></i> GPS Akurat
          </button>
          <span style="font-size:11px; color:#cbd5e1; font-weight:600;"><i class="fa-solid fa-hand-pointer" style="color:#f59e0b;"></i> Tip: Geser pin 📍 merah di peta ke posisi Anda</span>
        </div>

        <!-- Interactive Leaflet Map Container -->
        <div style="margin-top: 14px; border-radius: 14px; overflow: hidden; border: 2px solid rgba(255,255,255,0.15); position: relative; background: #0f172a; height: 380px;">
          <div id="radarLeafletMapContainer" style="width: 100%; height: 100%;"></div>
        </div>
      </div>

      <!-- Radar Lead Cards Container -->
      <div id="radarLeadsContainer">
        <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:18px; border:1px solid #e2e8f0;">
          <div style="width:50px; height:50px; border-radius:50%; border:3px solid #d7123a; border-top-color:transparent; animation:radar-spin 1s linear infinite; margin:0 auto 12px;"></div>
          <p style="font-size:13px; font-weight:700; color:#334155; margin:0;">Memuat titik koordinat peta &amp; database customer...</p>
        </div>
      </div>
    `;

    // Ensure Leaflet JS is loaded
    await this.ensureLeafletLoaded();

    // If salesCoords already set manually or from localStorage, fetch data directly
    if (this.salesCoords) {
      const badge = document.getElementById('radarGpsStatus');
      if (badge) badge.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#4ade80;"></i> Lokasi Set (${this.salesCoords.lat.toFixed(3)}, ${this.salesCoords.lng.toFixed(3)})`;
      this.fetchRadarData(this.salesCoords.lat, this.salesCoords.lng, this.currentRadius, district);
      return;
    }

    // Otherwise fetch via browser Geolocation
    if (!navigator.geolocation) {
      this.fetchRadarData(-6.9248, 107.6472, this.currentRadius, district);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.salesCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const badge = document.getElementById('radarGpsStatus');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#4ade80;"></i> GPS Terkunci (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`;
        this.fetchRadarData(pos.coords.latitude, pos.coords.longitude, this.currentRadius, district);
      },
      (err) => {
        console.warn('GPS error, using fallback', err);
        const badge = document.getElementById('radarGpsStatus');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-building"></i> Posisi: Kiara Condong`;
        this.fetchRadarData(-6.9248, 107.6472, this.currentRadius, district);
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  },

  setManualSalesCoords(lat, lng, label = null) {
    this.salesCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    localStorage.setItem('savedSalesLat', lat);
    localStorage.setItem('savedSalesLng', lng);
    if (label) localStorage.setItem('savedSalesLocLabel', label);

    const badge = document.getElementById('radarGpsStatus');
    if (badge) {
      badge.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#4ade80;"></i> Lokasi Set (${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)})`;
    }

    this.fetchRadarData(lat, lng, this.currentRadius, this.currentDistrict);

    if (typeof showCustomAlert === 'function') {
      showCustomAlert('Lokasi Diperbarui', `Posisi GPS Sales diset ke (${parseFloat(lat).toFixed(4)}, ${parseFloat(lng).toFixed(4)})`, 'success');
    }
  },

  requestHighAccuracyGPS() {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation.');
      return;
    }
    const badge = document.getElementById('radarGpsStatus');
    if (badge) badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Melacak GPS Presisi...`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.setManualSalesCoords(pos.coords.latitude, pos.coords.longitude, 'GPS HP Presisi');
      },
      (err) => {
        alert('Gagal mendapatkan GPS HP: ' + err.message + '. Silakan geser pin di peta atau ketik nama lokasi.');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Gunakan Pin Geser`;
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  },

  async searchAndSetLocation(query) {
    if (!query || query.trim() === '') return;
    const cleanQ = query.trim().toLowerCase();
    
    // Quick local dictionary check
    const localDict = {
      'pindad': [-6.9295, 107.6465],
      'psm': [-6.9295, 107.6465],
      'kpad pindad': [-6.9295, 107.6465],
      'buahbatu': [-6.9554, 107.6468],
      'buah batu': [-6.9554, 107.6468],
      'kiaracondong': [-6.9248, 107.6472],
      'kircon': [-6.9248, 107.6472],
      'batununggal': [-6.9531, 107.6256],
      'lengkong': [-6.9312, 107.6189],
      'antapani': [-6.9147, 107.6625],
      'arcamanik': [-6.9189, 107.6811],
      'rancasari': [-6.9625, 107.6722],
      'gedebage': [-6.9589, 107.6953],
      'soekarno hatta': [-6.9450, 107.6500],
      'margacinta': [-6.9580, 107.6520],
      'ciganitri': [-6.9733, 107.6455],
      'dayeuhkolot': [-6.9889, 107.6222],
      'bojongsoang': [-6.9833, 107.6333],
      'dago': [-6.8653, 107.6183],
      'cimahi': [-6.8722, 107.5417]
    };

    for (let key in localDict) {
      if (cleanQ.includes(key)) {
        this.setManualSalesCoords(localDict[key][0], localDict[key][1], query);
        return;
      }
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Bandung')}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        this.setManualSalesCoords(lat, lng, data[0].display_name);
      } else {
        alert('Lokasi "' + query + '" tidak ditemukan. Silakan klik atau geser pin langsung di peta.');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mencari lokasi. Silakan geser pin merah di peta.');
    }
  },

  handleRadiusChange(radiusVal, containerId) {
    this.currentRadius = parseFloat(radiusVal) || 5;
    this.fetchRadarData(
      this.salesCoords ? this.salesCoords.lat : -6.9248,
      this.salesCoords ? this.salesCoords.lng : 107.6472,
      this.currentRadius,
      this.currentDistrict
    );
  },

  handleDistrictChange(districtVal, containerId) {
    this.currentDistrict = districtVal;
    this.fetchRadarData(
      this.salesCoords ? this.salesCoords.lat : -6.9248,
      this.salesCoords ? this.salesCoords.lng : 107.6472,
      this.currentRadius,
      districtVal
    );
  },

  async ensureLeafletLoaded() {
    if (window.L) return;
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    await this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
  },

  async fetchRadarData(lat, lng, radiusKm, district = 'all') {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    try {
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
      const res = await fetch(`${this.getApiPrefix()}api_customer_radar.php?lat=${lat}&lng=${lng}&radius=${radiusKm}&district=${encodeURIComponent(district)}&db_source=radar&sales_id=${salesId}`);
      const result = await res.json();

      if (result.status !== 'success' || !result.data || result.data.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:18px; border:1.5px dashed #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
            <div style="width:60px; height:60px; border-radius:50%; background:#f1f5f9; color:#64748b; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:24px;">
              <i class="fa-solid fa-location-crosshairs"></i>
            </div>
            <h4 style="font-size:15px; font-weight:900; color:#0f172a; margin:0 0 6px;">Tidak Ada Customer di Ring Radius ${radiusKm < 999 ? radiusKm + ' km' : ''}</h4>
            <p style="font-size:12.5px; color:#64748b; margin:0;">Coba perbesar Ring Radius atau pilih wilayah lain di atas.</p>
          </div>
        `;
        this.radarData = [];
        this.renderRadarLeafletMap([], lat, lng);
        return;
      }

      this.radarData = result.data;
      this.renderRadarLeafletMap(this.radarData, lat, lng);
      this.renderRadarLeadCards(this.radarData);

    } catch (e) {
      console.error(e);
      listContainer.innerHTML = `<div class="alert-box-error">Gagal memuat data radar: ${e.message}</div>`;
    }
  },

  renderRadarLeafletMap(leads, centerLat, centerLng) {
    const mapEl = document.getElementById('radarLeafletMapContainer');
    if (!mapEl || !window.L) return;

    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }

    const salesLat = this.salesCoords ? this.salesCoords.lat : centerLat;
    const salesLng = this.salesCoords ? this.salesCoords.lng : centerLng;

    const map = L.map('radarLeafletMapContainer').setView([salesLat, salesLng], 14);
    this.leafletMap = map;

    // Google Maps Tile Layers
    const gmapsRoadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps & Tunas Toyota Kircon'
    });

    const gmapsHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps & Tunas Toyota Kircon'
    });

    // Add Google Maps Roadmap Layer as Default
    gmapsRoadmap.addTo(map);

    // Layer Switcher for Google Maps View
    L.control.layers({
      "🗺️ Google Maps (Jalan)": gmapsRoadmap,
      "🛰️ Google Maps (Satelit)": gmapsHybrid
    }).addTo(map);

    // Sales Location Pin (Center of Radar, Draggable!)
    const salesIcon = L.divIcon({
      className: 'sales-gps-pin',
      html: `<div style="background:#d7123a; width:24px; height:24px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 14px rgba(215,18,58,0.9); display:flex; align-items:center; justify-content:center; color:#fff; font-size:11px; cursor:grab;"><i class="fa-solid fa-location-dot"></i></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const salesMarker = L.marker([salesLat, salesLng], {
      icon: salesIcon,
      title: '📍 Lokasi Saya (Geser Pin Ini ke posisi Anda)',
      draggable: true
    }).addTo(map);

    salesMarker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; text-align:center; padding:4px;">
        <b style="color:#d7123a; font-size:13px;">📍 Lokasi Saya (Sales)</b><br>
        <span style="color:#64748b; font-size:11px;">Pusat Ring Radar GPS</span><br>
        <div style="margin-top:6px; background:#f0fdf4; border:1px solid #bbf7d0; padding:4px 8px; border-radius:6px; font-size:10.5px; font-weight:700; color:#15803d;">
          💡 Geser (drag) pin ini jika posisi Anda kurang pas!
        </div>
      </div>
    `);

    salesMarker.on('dragend', (e) => {
      const newPos = e.target.getLatLng();
      SalesSuperpowers.setManualSalesCoords(newPos.lat, newPos.lng, 'Pin Geser');
    });

    // DRAW VISUAL RADIUS CIRCLE (RING RADIUS)
    const radiusSelect = document.getElementById('radarRadiusSelect');
    const currentRadiusKm = radiusSelect ? parseFloat(radiusSelect.value) : (this.currentRadius || 1);
    this.currentRadius = currentRadiusKm;

    if (currentRadiusKm < 500) {
      const radiusMeters = currentRadiusKm * 1000;
      const radiusCircle = L.circle([salesLat, salesLng], {
        color: '#d7123a',
        fillColor: '#f43f5e',
        fillOpacity: 0.12,
        weight: 2.5,
        dashArray: '8, 8',
        radius: radiusMeters
      }).addTo(map);

      // Fit bounds to circle ring radius so user clearly sees the ring and all customer points inside
      map.fitBounds(radiusCircle.getBounds(), { padding: [30, 30], maxZoom: 16 });
    }

    // STRICT CUSTOMER FILTER INSIDE RING RADIUS ONLY
    const filteredLeads = (leads || []).filter(c => {
      if (c.distance_km === undefined || c.distance_km === null) return true;
      if (currentRadiusKm >= 999) return true;
      return c.distance_km <= currentRadiusKm;
    });

    // Customer Pins
    filteredLeads.forEach(c => {
      let pinColor = '#3b82f6';
      if (c.status === 'Belum Dihubungi') pinColor = '#d7123a';
      else if (c.status === 'Menunggu Respon') pinColor = '#f59e0b';
      else if (c.status === 'Tertarik / Jadwal Servis') pinColor = '#8b5cf6';
      else if (c.status === 'Deal / Selesai') pinColor = '#10b981';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `<div style="background:${pinColor}; width:16px; height:16px; border-radius:50%; border:3px solid #fff; box-shadow:0 3px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size:12px; line-height:1.4; padding:4px;">
          <b style="font-size:13.5px; color:#0f172a;">${escapeHtml(c.name)}</b>
          <div style="color:#64748b; font-size:11px; margin-top:2px;"><i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(c.district)} (${c.formatted_distance || (c.distance_km + ' km')})</div>
          <div style="margin-top:4px;">🚗 <b>${escapeHtml(c.car_model)}</b></div>
          <div style="margin-top:4px;">Status: <b style="color:${pinColor};">${escapeHtml(c.status)}</b></div>
          ${c.visit_photo ? `<div style="margin-top:6px;"><img src="${c.visit_photo}" style="width:100%; max-height:100px; object-fit:cover; border-radius:8px;"></div>` : ''}
          <div style="margin-top:8px; display:flex; gap:6px;">
            <button onclick="SalesSuperpowers.openRadarFollowupModal(${c.id})" style="background:#10b981; color:#fff; border:none; padding:5px 10px; border-radius:6px; font-weight:700; font-size:11px; cursor:pointer;"><i class="fa-solid fa-clipboard-check"></i> Follow Up</button>
            <a href="${navUrl}" target="_blank" style="background:#ea4335; color:#fff; text-decoration:none; padding:5px 10px; border-radius:6px; font-weight:700; font-size:11px; display:inline-flex; align-items:center; gap:4px;"><i class="fa-solid fa-map-location-dot"></i> G-Maps Navigasi</a>
          </div>
        </div>
      `;

      L.marker([c.lat, c.lng], { icon: customIcon }).addTo(map).bindPopup(popupHtml);
    });
  },

  renderRadarLeadCards(leads) {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    const currentRadiusKm = this.currentRadius || 5;
    const filteredLeads = (leads || []).filter(c => {
      if (c.distance_km === undefined || c.distance_km === null) return true;
      if (currentRadiusKm >= 999) return true;
      return c.distance_km <= currentRadiusKm;
    });

    if (!filteredLeads || filteredLeads.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:35px 20px; background:#fff; border-radius:18px; border:1.5px dashed #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
          <div style="width:54px; height:54px; border-radius:50%; background:#fef2f2; color:#ef4444; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; font-size:22px;">
            <i class="fa-solid fa-bullseye"></i>
          </div>
          <h4 style="font-size:15px; font-weight:900; color:#0f172a; margin:0 0 6px;">Tidak Ada Customer di Ring Radius ${currentRadiusKm < 999 ? currentRadiusKm + ' km' : ''}</h4>
          <p style="font-size:12.5px; color:#64748b; margin:0;">Coba perbesar Ring Radius (misal 3km, 5km, 10km) atau ubah pilihan wilayah di atas.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:13px; font-weight:800; color:#334155;">
          🎯 Ditemukan <b style="color:#d7123a;">${filteredLeads.length} Customer Radar</b> dalam Ring Radius ${currentRadiusKm < 999 ? currentRadiusKm + ' km' : ''}
        </span>
      </div>
      <div class="radar-leads-grid">
    `;

    filteredLeads.forEach((item) => {
      const initials = (item.name || 'C').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const etaMins = Math.max(2, Math.round(item.distance_km * 2.5));

      html += `
        <div class="radar-lead-card-deluxe" style="background:#fff; border-radius:16px; border:1px solid #e2e8f0; padding:16px; margin-bottom:14px; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
          <div>
            <div class="radar-card-header" style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
              <div class="radar-customer-profile" style="display:flex; align-items:center; gap:10px;">
                <div class="radar-avatar-circle" style="width:40px; height:40px; border-radius:50%; background:#0d1b3e; color:#fff; font-weight:800; display:flex; align-items:center; justify-content:center; font-size:14px;">${initials}</div>
                <div>
                  <h4 class="radar-customer-name" style="font-size:14.5px; font-weight:800; margin:0; color:#0f172a;">${escapeHtml(item.name)}</h4>
                  <div class="radar-district-tag" style="font-size:11.5px; color:#64748b; margin-top:2px;">
                    <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)}
                  </div>
                </div>
              </div>
              <div style="text-align:right;">
                <span class="radar-dist-chip" style="background:#eff6ff; color:#2563eb; font-weight:800; font-size:11px; padding:3px 8px; border-radius:6px;">
                  <i class="fa-solid fa-route"></i> ${item.formatted_distance}
                </span>
              </div>
            </div>

            <div class="radar-vehicle-box" style="background:#f8fafc; padding:10px 12px; border-radius:10px; font-size:12px; margin-bottom:12px;">
              <div class="radar-vehicle-row">
                <i class="fa-solid fa-car-side" style="color:#d7123a; margin-right:6px;"></i>
                <span><b>Unit:</b> <span style="font-weight:800; color:#0f172a;">${escapeHtml(item.car_model)}</span></span>
              </div>
              <div style="margin-top:4px; font-size:11.5px; color:#64748b; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
                <span>Prioritas: <b style="color:#d7123a;">${escapeHtml(item.priority || 'Prioritas Trade-in')}</b></span>
                <span>Status: <b style="color:#2563eb;">${escapeHtml(item.status || 'Belum Dihubungi')}</b></span>
              </div>
              ${item.visit_photo ? `
                <div style="margin-top:8px;">
                  <span style="font-size:11px; font-weight:800; color:#059669; display:block; margin-bottom:3px;"><i class="fa-solid fa-camera"></i> Bukti Kunjungan:</span>
                  <img src="${item.visit_photo}" style="width:100%; max-height:120px; object-fit:cover; border-radius:8px;">
                </div>
              ` : ''}
            </div>
          </div>

          <div class="radar-action-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
            <a href="${item.maps_url}" target="_blank" class="btn-radar-map" style="background:#2563eb; color:#fff; text-align:center; padding:8px; border-radius:8px; text-decoration:none; font-weight:700; font-size:11.5px; display:inline-flex; align-items:center; justify-content:center; gap:4px;">
              <i class="fa-solid fa-map-location-dot"></i> Rute Maps
            </a>
            <button type="button" class="btn-radar-wa" style="background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#fff; border:none; padding:8px; border-radius:8px; font-weight:700; font-size:11.5px; display:inline-flex; align-items:center; justify-content:center; gap:4px; cursor:pointer;" onclick="SalesSuperpowers.openRadarFollowupModal(${item.id})">
              <i class="fa-solid fa-clipboard-check"></i> Follow Up &amp; Foto
            </button>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    listContainer.innerHTML = html;
  },

  openRadarFollowupModal(customerId) {
    const item = (this.radarData || []).find(x => x.id == customerId) || { id: customerId, name: 'Customer', district: '' };
    this.selectedPhotoFile = null;

    let modal = document.getElementById('radarFollowupModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'radarFollowupModal';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="background:#ffffff; border-radius:20px; max-width:480px; width:100%; max-height:90vh; overflow-y:auto; padding:20px; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
          <div>
            <h3 style="font-size:16px; font-weight:900; color:#0f172a; margin:0;">Follow Up &amp; Progress Kunjungan</h3>
            <p style="font-size:11.5px; color:#64748b; margin:2px 0 0 0;">${escapeHtml(item.name)} • <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)}</p>
          </div>
          <button onclick="SalesSuperpowers.closeRadarFollowupModal()" style="background:none; border:none; font-size:20px; color:#64748b; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form id="formRadarFollowup" onsubmit="event.preventDefault(); SalesSuperpowers.submitRadarFollowup(${item.id});">
          <div style="margin-bottom:14px;">
            <label style="font-weight:800; font-size:12px; color:#334155; margin-bottom:4px; display:block;">Status Follow Up Baru <span style="color:red;">*</span></label>
            <select id="radarFuStatusSelect" class="form-control" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:700;">
              <option value="Belum Dihubungi" ${item.status === 'Belum Dihubungi' ? 'selected' : ''}>Belum Dihubungi</option>
              <option value="Menunggu Respon" ${item.status === 'Menunggu Respon' ? 'selected' : ''}>Menunggu Respon / Janjian</option>
              <option value="Tertarik / Jadwal Servis" ${item.status === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>Tertarik / Servis</option>
              <option value="Deal / Selesai" ${item.status === 'Deal / Selesai' ? 'selected' : ''}>Deal / SPK</option>
              <option value="Tidak Tertarik" ${item.status === 'Tidak Tertarik' ? 'selected' : ''}>Tidak Tertarik / Batal</option>
            </select>
          </div>

          <!-- TAM Checklist Checkboxes -->
          <div style="background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">
            <div style="font-size:11.5px; font-weight:800; color:#475569; margin-bottom:8px;"><i class="fa-solid fa-list-check" style="color:#2563eb;"></i> Verifikasi Respon Customer:</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; font-weight:700; color:#334155;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuConn" checked> 1. No. Aktif</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuCont" checked> 2. Ada Respon</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuProsp"> 3. Minat Beli</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuSpk"> 4. Closing SPK</label>
            </div>
          </div>

          <!-- Notes Textarea with Voice Dictation -->
          <div style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label style="font-weight:800; font-size:12px; color:#334155; margin:0;">Catatan / Alasan Progress</label>
              <button type="button" class="btn-voice-pill" id="btnRadarVoiceMic" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; padding:4px 8px; border-radius:8px; font-size:11px; font-weight:800; cursor:pointer;">
                <i class="fa-solid fa-microphone"></i> Dikte Suara
              </button>
            </div>
            <textarea id="radarFuNotesText" rows="3" class="form-control" placeholder="Tuliskan hasil pembicaraan/kunjungan dengan customer..." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">${escapeHtml(item.reason_followup || '')}</textarea>
            <div id="radarVoiceStatusPill" style="display:none; font-size:11px; color:#2563eb; margin-top:4px;"></div>
          </div>

          <!-- Photo Proof Input & Preview -->
          <div style="margin-bottom:18px;">
            <label style="font-weight:800; font-size:12px; color:#334155; margin-bottom:6px; display:block;">📷 Foto Bukti Kunjungan / Lokasi Customer</label>
            <input type="file" id="radarVisitPhotoInput" accept="image/*" capture="environment" style="display:none;" onchange="SalesSuperpowers.handleRadarPhotoSelect(this)">
            
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <button type="button" onclick="document.getElementById('radarVisitPhotoInput').click()" style="background:#f1f5f9; color:#334155; border:1.5px dashed #cbd5e1; padding:10px 16px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-camera" style="color:#d7123a; font-size:16px;"></i> Ambil / Upload Foto Lokasi
              </button>
            </div>

            <div id="radarPhotoPreviewWrap" style="margin-top:10px; ${item.visit_photo ? '' : 'display:none;'}">
              <div style="position:relative; display:inline-block; width:100%;">
                <img id="radarPhotoPreviewImg" src="${item.visit_photo || ''}" style="width:100%; max-height:160px; object-fit:cover; border-radius:12px; border:2px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <button type="button" onclick="SalesSuperpowers.removeRadarPhoto()" style="position:absolute; top:6px; right:6px; background:#ef4444; color:#fff; border:none; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f5f9; padding-top:14px;">
            <button type="button" onclick="SalesSuperpowers.closeRadarFollowupModal()" class="btn-fu btn-fu-secondary" style="padding:8px 16px; font-size:12px;">Batal</button>
            <button type="submit" id="btnSubmitRadarFu" class="btn-fu btn-fu-crimson" style="padding:8px 18px; font-size:12px; font-weight:800;"><i class="fa-solid fa-floppy-disk"></i> Simpan Progress &amp; Foto</button>
          </div>
        </form>
      </div>
    `;

    modal.style.display = 'flex';
    this.initVoiceRecorder('radarFuNotesText', 'btnRadarVoiceMic', 'radarVoiceStatusPill');
  },

  closeRadarFollowupModal() {
    const modal = document.getElementById('radarFollowupModal');
    if (modal) modal.style.display = 'none';
  },

  handleRadarPhotoSelect(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    this.selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const wrap = document.getElementById('radarPhotoPreviewWrap');
      const img = document.getElementById('radarPhotoPreviewImg');
      if (img) img.src = e.target.result;
      if (wrap) wrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  removeRadarPhoto() {
    this.selectedPhotoFile = null;
    const input = document.getElementById('radarVisitPhotoInput');
    if (input) input.value = '';
    const wrap = document.getElementById('radarPhotoPreviewWrap');
    if (wrap) wrap.style.display = 'none';
  },

  async submitRadarFollowup(customerId) {
    const btn = document.getElementById('btnSubmitRadarFu');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
      const statusVal = document.getElementById('radarFuStatusSelect').value;
      const connVal = document.getElementById('radarFuConn').checked ? 'TRUE' : 'FALSE';
      const contVal = document.getElementById('radarFuCont').checked ? 'TRUE' : 'FALSE';
      const prospVal = document.getElementById('radarFuProsp').checked ? 'TRUE' : 'FALSE';
      const spkVal = document.getElementById('radarFuSpk').checked ? 'TRUE' : 'FALSE';
      const notesVal = document.getElementById('radarFuNotesText').value.trim();
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;

      const formData = new FormData();
      formData.append('id', customerId);
      formData.append('sales_id', salesId);
      formData.append('status', statusVal);
      formData.append('connected', connVal);
      formData.append('contacted', contVal);
      formData.append('prospect', prospVal);
      formData.append('spk', spkVal);
      formData.append('reason_followup', notesVal);

      if (this.selectedPhotoFile) {
        formData.append('visit_photo', this.selectedPhotoFile);
      }

      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=update_status`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();

      if (json.success) {
        this.closeRadarFollowupModal();
        if (window.showCustomAlert) {
          window.showCustomAlert('Progress Berhasil Disimpan', 'Status follow-up dan foto bukti kunjungan berhasil disimpan.', 'success');
        } else {
          alert('Progress follow-up berhasil disimpan!');
        }
        this.fetchRadarData(
          this.salesCoords ? this.salesCoords.lat : -6.9248,
          this.salesCoords ? this.salesCoords.lng : 107.6472,
          this.currentRadius,
          this.currentDistrict
        );
      } else {
        alert(json.message || 'Gagal menyimpan progress');
      }

    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml;
      }
    }
  },

  filterRadarLeads(query) {
    if (!this.radarData || this.radarData.length === 0) return;
    const cleanQ = (query || '').toLowerCase().trim();
    if (!cleanQ) {
      this.renderRadarLeadCards(this.radarData);
      return;
    }

    const filtered = this.radarData.filter(item => {
      const name = (item.name || '').toLowerCase();
      const car = (item.car_model || '').toLowerCase();
      const district = (item.district || '').toLowerCase();
      return name.includes(cleanQ) || car.includes(cleanQ) || district.includes(cleanQ);
    });

    this.renderRadarLeadCards(filtered);
  },

  openRadarFollowupModal(customerId) {
    const item = this.radarData.find(x => String(x.id) === String(customerId));
    if (!item) {
      console.error('Radar lead not found for ID:', customerId);
      return;
    }

    document.getElementById('modalRadarFollowup')?.remove();

    const hasPhone = item.phone && item.phone.trim() !== '' && item.phone !== '-';

    const html = `
      <div class="modal-overlay" id="modalRadarFollowup" onclick="SalesSuperpowers.closeRadarFollowupModal()" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(15,23,42,0.65); backdrop-filter:blur(4px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;">
        <div class="modal-content" style="max-width:520px; width:100%; border-radius:18px; padding:20px; background:#ffffff; box-shadow:0 20px 25px -5px rgba(0,0,0,0.2);" onclick="event.stopPropagation()">
          <div class="modal-header" style="border-bottom:1.5px solid #e2e8f0; padding-bottom:12px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:6px; background:#eff6ff; color:#1d4ed8; font-size:10.5px; font-weight:800; padding:3px 10px; border-radius:9999px; text-transform:uppercase;">
                <i class="fa-solid fa-clipboard-check"></i> Input Progress Follow-Up &amp; Kunjungan
              </div>
              <h3 style="font-size:17px; font-weight:900; color:#0d1b3e; margin:6px 0 0 0;">${escapeHtml(item.name)}</h3>
              <div style="font-size:12px; color:#64748b; margin-top:3px;">
                <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)} &bull; <i class="fa-solid fa-car"></i> ${escapeHtml(item.car_model)} ${item.car_age ? `(${escapeHtml(item.car_age)})` : ''}
              </div>
            </div>
            <button class="btn-close-modal" style="background:#f1f5f9; border:none; width:32px; height:32px; border-radius:50%; cursor:pointer; color:#64748b;" onclick="SalesSuperpowers.closeRadarFollowupModal()"><i class="fa-solid fa-xmark"></i></button>
          </div>

          ${hasPhone ? `
            <div style="margin-bottom:14px;">
              <a href="${item.wa_url}" target="_blank" class="btn-radar-wa" style="display:flex; justify-content:center; align-items:center; gap:6px; width:100%; text-decoration:none; padding:10px; background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#fff; border-radius:10px; font-size:13px; font-weight:800;">
                <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Kirim Pesan / Chat WhatsApp (+${escapeHtml(item.phone)})
              </a>
            </div>
          ` : `
            <div style="background:#f8fafc; border:1.5px solid #e2e8f0; border-radius:10px; padding:10px 12px; margin-bottom:14px; font-size:11.5px; color:#64748b; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-phone-slash" style="color:#94a3b8; font-size:14px;"></i>
              <span>Tanpa Nomor WA. Lakukan kunjungan lapangan langsung ke lokasi (Gunakan rute Google Maps).</span>
            </div>
          `}

          <div class="form-group" style="margin-bottom:12px;">
            <label style="font-weight:800; font-size:12.5px; color:#0f172a; display:block; margin-bottom:4px;">Status Hasil Follow-Up / Kunjungan:</label>
            <select class="form-control" id="radarFuStatusSelect" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #cbd5e1; font-weight:700; font-size:13px; color:#0f172a;">
              <option value="Kunjungan Lapangan" ${item.status === 'Kunjungan Lapangan' ? 'selected' : ''}>🚗 Kunjungan Lapangan (Direct Visit)</option>
              <option value="Menunggu Respon" ${item.status === 'Menunggu Respon' ? 'selected' : ''}>📞 Menunggu Respon / Janji Hubungi Lagi</option>
              <option value="Tertarik / Jadwal Servis" ${(item.status && item.status.includes('Tertarik')) ? 'selected' : ''}>🔥 Customer Tertarik (Prospect / Trade-In)</option>
              <option value="Deal / Selesai" ${(item.status && item.status.includes('Deal')) ? 'selected' : ''}>🎉 Deal / Sudah SPK</option>
              <option value="Tidak Tertarik" ${item.status === 'Tidak Tertarik' ? 'selected' : ''}>❌ Tidak Berminat / Bukan Target</option>
            </select>
          </div>

          <div style="background:#f1f5f9; border-radius:12px; padding:10px 14px; margin-bottom:12px; display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; font-weight:700; color:#334155;">
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="chkRadarConnected" checked style="accent-color:#059669; width:15px; height:15px;"> Tersambung / Bertemu
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="chkRadarContacted" checked style="accent-color:#059669; width:15px; height:15px;"> Berkomunikasi Baik
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="chkRadarProspect" style="accent-color:#2563eb; width:15px; height:15px;"> Minat Upgrade Unit
            </label>
            <label style="display:flex; align-items:center; gap:6px; cursor:pointer;">
              <input type="checkbox" id="chkRadarSpk" style="accent-color:#d7123a; width:15px; height:15px;"> Sudah Closing / SPK
            </label>
          </div>

          <div class="form-group" style="margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
              <label style="font-weight:800; font-size:12.5px; color:#0f172a; margin:0;">Catatan Progress untuk SPV:</label>
              <button type="button" id="btnVoiceRadarFu" style="background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; font-size:11px; font-weight:700; padding:3px 8px; border-radius:6px; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                <i class="fa-solid fa-microphone"></i> Dikte Suara
              </button>
            </div>
            <textarea id="radarFuNoteInput" rows="3" class="form-control" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #cbd5e1; font-size:12.5px; line-height:1.4;" placeholder="Tuliskan hasil pembicaraan/kunjungan (misal: Customer berminat tukar tambah Avanza ke Innova Zenix, janji temu Sabtu di showroom)..."></textarea>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="button" class="btn-fu" style="flex:1; background:#f1f5f9; color:#475569; border:1px solid #cbd5e1; padding:12px; font-weight:700; border-radius:12px; justify-content:center;" onclick="SalesSuperpowers.closeRadarFollowupModal()">
              Batal
            </button>
            <button type="button" class="btn-fu btn-fu-crimson" style="flex:2; background:#d7123a; color:#fff; padding:12px; font-size:13.5px; font-weight:800; border-radius:12px; justify-content:center; border:none; cursor:pointer;" onclick="SalesSuperpowers.submitRadarFollowup(${item.id})">
              <i class="fa-solid fa-paper-plane"></i> Simpan &amp; Kirim ke SPV
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);

    setTimeout(() => {
      if (typeof this.initVoiceRecorder === 'function') {
        this.initVoiceRecorder('radarFuNoteInput', 'btnVoiceRadarFu');
      }
    }, 100);
  },

  closeRadarFollowupModal() {
    document.getElementById('modalRadarFollowup')?.remove();
  },

  async submitRadarFollowup(customerId) {
    const item = this.radarData.find(x => String(x.id) === String(customerId));
    if (!item) return;

    const statusEl = document.getElementById('radarFuStatusSelect');
    const noteEl = document.getElementById('radarFuNoteInput');
    const chkConn = document.getElementById('chkRadarConnected');
    const chkCont = document.getElementById('chkRadarContacted');
    const chkProsp = document.getElementById('chkRadarProspect');
    const chkSpk = document.getElementById('chkRadarSpk');

    const status = statusEl ? statusEl.value : 'Kunjungan Lapangan';
    const note = noteEl ? noteEl.value.trim() : '';

    if (!note) {
      if (typeof Swal !== 'undefined') {
        Swal.fire('Catatan Kosong', 'Harap isi catatan progress/hasil kunjungan untuk laporan SPV.', 'warning');
      } else {
        alert('Harap isi catatan progress untuk laporan SPV.');
      }
      return;
    }

    const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
    const salesName = localStorage.getItem('namaSales') || localStorage.getItem('salesName') || 'Sales';

    const payload = new URLSearchParams();
    payload.append('id', customerId);
    payload.append('customer_id', customerId);
    payload.append('status', status);
    payload.append('reason_followup', note);
    payload.append('remarks', note);
    payload.append('notes', note);
    payload.append('connected', (chkConn && chkConn.checked) ? 'TRUE' : 'FALSE');
    payload.append('contacted', (chkCont && chkCont.checked) ? 'TRUE' : 'FALSE');
    payload.append('prospect', (chkProsp && chkProsp.checked) ? 'TRUE' : 'FALSE');
    payload.append('spk', (chkSpk && chkSpk.checked) ? 'TRUE' : 'FALSE');
    payload.append('sales_id', salesId);

    try {
      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=update_status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: payload.toString()
      });
      const result = await res.json();

      if (result.success || result.status === 'success') {
        item.status = status;
        item.sales_name = salesName;
        this.closeRadarFollowupModal();
        this.renderRadarLeadCards(this.radarData);

        if (typeof Swal !== 'undefined') {
          Swal.fire({
            icon: 'success',
            title: 'Progress Berhasil Disimpan!',
            text: `Hasil follow-up untuk ${item.name} telah dicatat & dapat langsung dipantau oleh SPV.`,
            confirmColor: '#d7123a'
          });
        } else {
          alert(`Progress follow-up untuk ${item.name} berhasil disimpan!`);
        }
      } else {
        alert('Gagal menyimpan progress: ' + (result.message || 'Terjadi kesalahan server'));
      }
    } catch (e) {
      console.error('Error submitting radar followup:', e);
      alert('Terjadi kesalahan jaringan saat menyimpan progress.');
    }
  },

  scanNearbyLeads(radiusKm = 5, containerId = 'followupDataContainer') {
    this.renderRadarCockpit(containerId, radiusKm);
  },

  // =========================================================================
  // 2. INSTANT QUOTATION TO PDF & WA SHARE
  // =========================================================================
  generateInstantQuoteText(data) {
    const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
    const noHpSales = localStorage.getItem('noHpSales') || '0812-XXXX-XXXX';
    
    return `*PENAWARAN RESMI TUNAS TOYOTA KIARA CONDONG*
----------------------------------------
Kepada Yth. *Bpk/Ibu ${data.customerName || 'Calon Pelanggan'}*

Berikut adalah rincian penawaran harga & simulasi kredit terbaik untuk unit:
🚗 *Model:* ${data.carModel || 'Toyota All New'}
🏷️ *Tipe / Transmisi:* ${data.carType || 'OTR Jawa Barat'}
💰 *Harga OTR:* Rp ${Number(data.otr || 0).toLocaleString('id-ID')}
🎉 *Promo / Diskon Khusus:* Rp ${Number(data.discount || 0).toLocaleString('id-ID')}

*SIMULASI PAKET KREDIT:*
• *Total DP Dibayar:* Rp ${Number(data.totalDp || 0).toLocaleString('id-ID')}
• *Tenor:* ${data.tenor || 5} Tahun (${(data.tenor || 5) * 12}x Cicilan)
• *Angsuran Bulanan:* Rp ${Number(data.monthly || 0).toLocaleString('id-ID')} / bulan
• *Asuransi:* ${data.insurance || 'All Risk Full Tenor'}

*BONUS & BENEFIT PEMBELIAN:*
✅ Kaca Film Resmi Garansi 5 Th
✅ Karpet Set Original Toyota
✅ Kotak P3K, Segitiga Pengaman & APAR
✅ Gratis Jasa Servis & Oli Berkala (T-Care)
✅ Garansi Mesin 3 Th / 100.000 KM
✅ Layanan Derek Darurat 24 Jam

Untuk info test drive & pemesanan unit, silakan hubungi:
👤 *${namaSales}*
📞 *WA / Telp:* ${noHpSales}
🏢 *Tunas Toyota Kiara Condong Bandung*
_Alamat: Jl. Soekarno-Hatta No. 514, Bandung_`;
  },

  shareQuoteToWhatsApp(data) {
    const text = this.generateInstantQuoteText(data);
    const phone = data.customerPhone ? data.customerPhone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : (phone.startsWith('8') ? '62' + phone : phone);
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  },

  // =========================================================================
  // 3. SMART FOLLOW-UP MORNING BRIEFING & REMINDER
  // =========================================================================
  async checkDailyFollowupReminders() {
    try {
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=customers&sales_id=${salesId}`);
      const json = await res.json();
      
      if (json.status !== 'success' || !json.data) return;

      const todayStr = new Date().toISOString().split('T')[0];
      const dueList = json.data.filter(c => {
        if (!c.followup_date) return false;
        return c.followup_date.startsWith(todayStr) || (new Date(c.followup_date) < new Date() && c.followup_status !== 'Deal / SPK' && c.followup_status !== 'Selesai');
      });

      const container = document.getElementById('dailyFollowupBriefingContainer');
      if (container && dueList.length > 0) {
        container.innerHTML = `
          <div class="morning-briefing-banner">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:42px; height:42px; border-radius:12px; background:rgba(215,18,58,0.2); border:1.5px solid #d7123a; display:flex; align-items:center; justify-content:center; font-size:18px; color:#f43f5e;">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h4 style="font-size:14.5px; font-weight:800; margin:0; color:#ffffff;">Pengingat Agenda Hari Ini</h4>
                  <span class="briefing-badge">${dueList.length} Prospek Jatuh Tempo</span>
                </div>
                <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:2px 0 0 0;">
                  Segera hubungi customer prioritas Anda hari ini untuk menjaga rasio konversi deal.
                </p>
              </div>
            </div>
            <a href="pages/customer.html" class="btn-fu btn-fu-crimson" style="padding:8px 16px; font-size:12px;">
              <i class="fa-solid fa-list-check"></i> Buka Agenda Follow-up
            </a>
          </div>
        `;
      }
    } catch (e) {
      console.warn('Follow-up reminder error', e);
    }
  },

  // =========================================================================
  // 4. SCAN KTP & STNK OTOMATIS (OCR)
  // =========================================================================
  // 4. SMART AI OCR SCANNER (KAMERA LIVE & DOKUMEN KTP / KK)
  // =========================================================================
  ocrDocType: 'ktp', // 'ktp' atau 'kk'
  ocrSource: 'camera', // 'camera' atau 'upload'
  cameraStream: null,
  currentFacingMode: 'environment', // 'environment' (belakang) atau 'user' (depan)
  capturedImageBase64: null,
  extractedOcrData: null,
  ocrAutoScanEnabled: true,
  autoScanTimer: null,
  stabilityCount: 0,
  prevSampleData: null,
  isProcessingOcr: false,

  currentTargetFields: null,

  openOcrModal(docType = 'ktp') {
    this.ocrDocType = docType;
    const modal = document.getElementById('smartOcrModal');
    if (!modal) return;

    modal.style.display = 'flex';
    this.setOcrDocType(docType);
    this.setOcrSource('camera');
    this.updateEngineBadge();
  },

  closeOcrModal(e) {
    if (e && e.target && e.target.id !== 'smartOcrModal') return;
    this.stopAutoScanLoop();
    this.stopCameraStream();
    const modal = document.getElementById('smartOcrModal');
    if (modal) modal.style.display = 'none';
  },

  promptApiKey() {
    const current = localStorage.getItem('sft_gemini_api_key') || '';
    const key = prompt('Kunci Google Gemini AI Vision:\nBiarkan kosong untuk menggunakan Kunci Sistem Bawaan.', current);
    if (key !== null) {
      if (key.trim()) {
        localStorage.setItem('sft_gemini_api_key', key.trim());
        if (window.showCustomAlert) {
          window.showCustomAlert('Gemini AI Aktif', 'Kunci khusus Gemini AI berhasil disimpan.', 'success');
        } else {
          alert('Kunci khusus Gemini AI berhasil disimpan.');
        }
      } else {
        localStorage.removeItem('sft_gemini_api_key');
        if (window.showCustomAlert) {
          window.showCustomAlert('Kunci Bawaan Aktif', 'Menggunakan kunci Gemini AI bawaan sistem.', 'info');
        }
      }
      this.updateEngineBadge();
    }
  },

  updateEngineBadge() {
    const badgeText = document.getElementById('ocrHeaderEngineText');
    const badgeEl = document.getElementById('ocrHeaderEngineBadge');
    if (badgeText) {
      badgeText.textContent = 'Gemini AI Vision';
    }
    if (badgeEl) {
      badgeEl.style.borderColor = '#10b981';
      badgeEl.style.color = '#34d399';
      badgeEl.title = 'Gemini AI Vision 2.5 Aktif (Klik untuk atur kunci kustom)';
    }
  },

  toggleAutoScan() {
    this.ocrAutoScanEnabled = !this.ocrAutoScanEnabled;
    const btn = document.getElementById('btnOcrAutoScanToggle');
    const badge = document.getElementById('ocrAutoScanBadge');
    if (btn) {
      btn.classList.toggle('active', this.ocrAutoScanEnabled);
      btn.title = this.ocrAutoScanEnabled ? 'Auto-Scan: AKTIF' : 'Auto-Scan: MANUAL';
    }
    if (badge) {
      badge.style.display = this.ocrAutoScanEnabled ? 'inline-flex' : 'none';
    }
    if (!this.ocrAutoScanEnabled) {
      this.stopAutoScanLoop();
      this.resetHudFeedback();
    } else if (this.cameraStream) {
      this.startAutoScanLoop();
    }
  },

  setOcrDocType(type) {
    this.ocrDocType = type;
    const btnKtp = document.getElementById('btnOcrTypeKtp');
    const btnKk = document.getElementById('btnOcrTypeKk');
    const tip = document.getElementById('ocrHudTip');

    if (type === 'kk') {
      if (btnKtp) btnKtp.classList.remove('active');
      if (btnKk) btnKk.classList.add('active');
      if (tip) tip.textContent = 'Posisikan Kartu Keluarga di dalam kotak panduan';
    } else {
      if (btnKk) btnKk.classList.remove('active');
      if (btnKtp) btnKtp.classList.add('active');
      if (tip) tip.textContent = 'Posisikan e-KTP di dalam kotak panduan';
    }
  },

  setOcrSource(source) {
    this.ocrSource = source;
    const btnCam = document.getElementById('btnOcrSourceCam');
    const btnUpload = document.getElementById('btnOcrSourceUpload');
    const secCam = document.getElementById('ocrCameraSection');
    const secUpload = document.getElementById('ocrUploadSection');
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');

    if (secPreview) secPreview.style.display = 'none';
    if (secReview) secReview.style.display = 'none';

    if (source === 'upload') {
      if (btnCam) btnCam.classList.remove('active');
      if (btnUpload) btnUpload.classList.add('active');
      if (secCam) secCam.style.display = 'none';
      if (secUpload) secUpload.style.display = 'block';
      this.stopAutoScanLoop();
      this.stopCameraStream();
    } else {
      if (btnUpload) btnUpload.classList.remove('active');
      if (btnCam) btnCam.classList.add('active');
      if (secUpload) secUpload.style.display = 'none';
      if (secCam) secCam.style.display = 'block';
      this.startCameraStream();
    }
  },

  async startCameraStream() {
    this.stopCameraStream();
    this.stopAutoScanLoop();

    const videoEl = document.getElementById('ocrCameraVideo');
    if (!videoEl) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Browser ini tidak mendukung akses kamera langsung. Silakan gunakan opsi Upload File.');
      this.setOcrSource('upload');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: this.currentFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.srcObject = this.cameraStream;
      await videoEl.play();
      
      // Mulai Auto-Scan loop jika aktif
      if (this.ocrAutoScanEnabled) {
        this.startAutoScanLoop();
      }
    } catch (err) {
      console.warn('Gagal mengakses kamera:', err);
      try {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoEl.srcObject = this.cameraStream;
        await videoEl.play();
        if (this.ocrAutoScanEnabled) {
          this.startAutoScanLoop();
        }
      } catch (err2) {
        console.error('Kamera tidak diizinkan atau tidak tersedia:', err2);
        alert('Kamera tidak dapat diakses (izin ditolak atau kamera sedang digunakan). Silakan pilih foto dari galeri/file.');
        this.setOcrSource('upload');
      }
    }
  },

  stopCameraStream() {
    this.stopAutoScanLoop();
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      this.cameraStream = null;
    }
    const videoEl = document.getElementById('ocrCameraVideo');
    if (videoEl) {
      videoEl.srcObject = null;
    }
  },

  startAutoScanLoop() {
    this.stopAutoScanLoop();
    this.stabilityCount = 0;
    this.prevSampleData = null;
    this.autoScanTimer = setInterval(() => {
      this.checkCameraFrameForAutoScan();
    }, 900);
  },

  stopAutoScanLoop() {
    if (this.autoScanTimer) {
      clearInterval(this.autoScanTimer);
      this.autoScanTimer = null;
    }
    this.resetHudFeedback();
  },

  resetHudFeedback() {
    this.stabilityCount = 0;
    this.prevSampleData = null;
    const hudFrame = document.getElementById('ocrHudFrame');
    const tip = document.getElementById('ocrHudTip');
    const countdown = document.getElementById('ocrAutoScanCountdown');
    if (hudFrame) hudFrame.classList.remove('detecting', 'locked');
    if (countdown) countdown.style.display = 'none';
    if (tip) {
      tip.textContent = this.ocrDocType === 'kk'
        ? 'Posisikan Kartu Keluarga di dalam kotak panduan'
        : 'Posisikan e-KTP di dalam kotak panduan';
    }
  },

  checkCameraFrameForAutoScan() {
    if (!this.ocrAutoScanEnabled || !this.cameraStream || this.isProcessingOcr) return;
    const videoEl = document.getElementById('ocrCameraVideo');
    if (!videoEl || !videoEl.videoWidth || videoEl.paused || videoEl.ended) return;

    // Grab thumbnail sample to measure frame stability & presence
    const sampleW = 160;
    const sampleH = 100;
    if (!this._sampleCanvas) {
      this._sampleCanvas = document.createElement('canvas');
      this._sampleCanvas.width = sampleW;
      this._sampleCanvas.height = sampleH;
    }
    const sCtx = this._sampleCanvas.getContext('2d', { willReadFrequently: true });
    sCtx.drawImage(videoEl, 0, 0, sampleW, sampleH);

    const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;
    let totalLum = 0;
    let totalDiff = 0;
    const pixelCount = sampleW * sampleH;

    for (let i = 0; i < imgData.length; i += 4) {
      const lum = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
      totalLum += lum;
      if (this.prevSampleData) {
        totalDiff += Math.abs(lum - this.prevSampleData[i / 4]);
      }
    }

    const avgLum = totalLum / pixelCount;
    const avgDiff = this.prevSampleData ? (totalDiff / pixelCount) : 999;

    // Cache current sample
    if (!this.prevSampleData) {
      this.prevSampleData = new Float32Array(pixelCount);
    }
    for (let i = 0; i < imgData.length; i += 4) {
      this.prevSampleData[i / 4] = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
    }

    const hudFrame = document.getElementById('ocrHudFrame');
    const tip = document.getElementById('ocrHudTip');
    const countdown = document.getElementById('ocrAutoScanCountdown');
    const countdownText = document.getElementById('ocrCountdownText');

    // Kondisi steady: Perubahan antar frame rendah (< 8.5) dan pencahayaan memadai (35 - 235)
    const isSteady = avgDiff < 8.5 && avgLum > 35 && avgLum < 235;

    if (isSteady) {
      this.stabilityCount = (this.stabilityCount || 0) + 1;
      if (this.stabilityCount === 1) {
        if (hudFrame) hudFrame.classList.add('detecting');
        if (tip) tip.textContent = '⚡ Mendeteksi dokumen... Tahan posisi kamera...';
      } else if (this.stabilityCount >= 2) {
        if (hudFrame) {
          hudFrame.classList.remove('detecting');
          hudFrame.classList.add('locked');
        }
        if (countdown) countdown.style.display = 'flex';
        if (countdownText) countdownText.textContent = '🎯 Memindai Otomatis...';
        if (tip) tip.textContent = '✨ Dokumen Pas! Mengambil foto...';

        // Auto snapshot & scan
        setTimeout(() => {
          this.captureSnapshot(false);
        }, 350);
      }
    } else {
      if (this.stabilityCount > 0) {
        this.stabilityCount = 0;
        if (hudFrame) hudFrame.classList.remove('detecting', 'locked');
        if (countdown) countdown.style.display = 'none';
        if (tip) {
          tip.textContent = this.ocrDocType === 'kk'
            ? 'Posisikan Kartu Keluarga di dalam kotak panduan'
            : 'Posisikan e-KTP di dalam kotak panduan';
        }
      }
    }
  },

  switchCamera() {
    this.currentFacingMode = (this.currentFacingMode === 'environment') ? 'user' : 'environment';
    this.startCameraStream();
  },

  captureSnapshot(manual = true) {
    if (manual) {
      this.isProcessingOcr = false;
    } else if (this.isProcessingOcr) {
      return;
    }

    const videoEl = document.getElementById('ocrCameraVideo');
    const canvas = document.getElementById('ocrHiddenCanvas') || document.createElement('canvas');

    if (!videoEl || !videoEl.videoWidth) {
      if (manual) alert('Kamera belum siap atau belum aktif. Pastikan izin kamera telah diberikan.');
      return;
    }

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    this.capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.92);
    this.stopAutoScanLoop();
    this.stopCameraStream();

    // Tampilkan Viewport Preview dan LANGSUNG proses OCR otomatis!
    this.showCapturedPreview(this.capturedImageBase64);
    this.processOcr();
  },

  handleFileSelect(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.capturedImageBase64 = e.target.result;
      this.showCapturedPreview(this.capturedImageBase64);
      // LANGSUNG proses OCR otomatis!
      this.processOcr();
    };
    reader.readAsDataURL(file);
  },

  showCapturedPreview(dataUrl) {
    const secCam = document.getElementById('ocrCameraSection');
    const secUpload = document.getElementById('ocrUploadSection');
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');
    const imgEl = document.getElementById('ocrCapturedPreview');

    if (secCam) secCam.style.display = 'none';
    if (secUpload) secUpload.style.display = 'none';
    if (secReview) secReview.style.display = 'none';
    if (secPreview) secPreview.style.display = 'block';

    if (imgEl) imgEl.src = dataUrl;
  },

  retakePhoto() {
    this.isProcessingOcr = false;
    this.capturedImageBase64 = null;
    this.extractedOcrData = null;
    this.resetHudFeedback();
    this.setOcrSource(this.ocrSource || 'camera');
  },

  // Pre-process canvas to increase OCR accuracy
  preprocessImageForOcr(sourceDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > maxW) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // Grayscale + Adaptive Contrast Enhancement for sharp text
        for (let i = 0; i < d.length; i += 4) {
          let gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Contrast stretch
          gray = (gray - 128) * 1.45 + 128;
          if (gray < 0) gray = 0;
          if (gray > 255) gray = 255;
          // Slight thresholding for crisp characters
          const finalVal = gray < 138 ? Math.max(0, gray - 30) : Math.min(255, gray + 30);
          d[i] = finalVal;
          d[i + 1] = finalVal;
          d[i + 2] = finalVal;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  },

  hasExtractedFields(data) {
    if (!data || typeof data !== 'object') return false;
    const meaningful = ['nik', 'nama', 'no_kk', 'alamat', 'tempat_lahir', 'tanggal_lahir'];
    return meaningful.some(k => data[k] && String(data[k]).trim().length > 0 && String(data[k]).trim() !== '-');
  },

  normalizeExtractedData(d, docType = 'ktp') {
    if (!d || typeof d !== 'object') return {};

    // Check nested wrappers like 'data', 'ktp', 'kk', 'result', 'hasil', 'identitas'
    for (const wrap of ['data', 'ktp', 'kk', 'result', 'hasil', 'identitas']) {
      if (d[wrap] && typeof d[wrap] === 'object' && !Array.isArray(d[wrap])) {
        d = Object.assign({}, d, d[wrap]);
      }
    }

    // Support Kartu Keluarga nested member list (ambil kepala keluarga / anggota pertama)
    for (const arrKey of ['anggota', 'anggota_keluarga', 'keluarga', 'daftar_keluarga', 'members', 'daftar_anggota']) {
      if (Array.isArray(d[arrKey]) && d[arrKey].length > 0 && typeof d[arrKey][0] === 'object') {
        d = Object.assign({}, d[arrKey][0], d);
      }
    }

    const norm = {};
    for (const [k, v] of Object.entries(d)) {
      const cleanK = k.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      norm[cleanK] = (typeof v === 'string') ? v.trim() : v;
    }

    const getVal = (...keys) => {
      for (const k of keys) {
        if (norm[k] && typeof norm[k] === 'string' && norm[k].trim()) return norm[k].trim();
      }
      return '';
    };

    return {
      nik: getVal('nik', 'nomor_nik', 'nik_ktp', 'no_ktp', 'no_identitas').replace(/[^0-9]/g, ''),
      no_kk: getVal('no_kk', 'nomor_kk', 'nomor_kartu_keluarga', 'kartu_keluarga').replace(/[^0-9]/g, ''),
      nama: getVal('nama', 'nama_lengkap', 'nama_customer', 'nama_kepala_keluarga').replace(/[^a-zA-Z\s\.,\']/g, '').toUpperCase(),
      tempat_lahir: getVal('tempat_lahir', 'tempat').toUpperCase(),
      tanggal_lahir: getVal('tanggal_lahir', 'tgl_lahir'),
      jenis_kelamin: getVal('jenis_kelamin', 'kelamin', 'gender').toUpperCase(),
      alamat: getVal('alamat', 'alamat_lengkap', 'jalan'),
      rt_rw: getVal('rt_rw', 'rt_dan_rw', 'rtrw'),
      kelurahan: getVal('kelurahan', 'desa', 'kelurahan_desa', 'kel_desa').toUpperCase(),
      kecamatan: getVal('kecamatan', 'kec').toUpperCase(),
      kota: getVal('kota', 'kabupaten', 'kota_kabupaten', 'kab').toUpperCase(),
      provinsi: getVal('provinsi', 'prov').toUpperCase(),
      agama: getVal('agama').toUpperCase(),
      status_perkawinan: getVal('status_perkawinan', 'status').toUpperCase(),
      pekerjaan: getVal('pekerjaan', 'pekerjaan_profesi').toUpperCase()
    };
  },

  async directGeminiVision(base64Image, docType) {
    const key = localStorage.getItem('sft_gemini_api_key') || '';
    if (!key) throw new Error('No client Gemini key configured');
    let cleanBase64 = base64Image;
    let mimeType = 'image/jpeg';
    const m = base64Image.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    if (m) {
      mimeType = m[1];
      cleanBase64 = m[2];
    }

    const promptInstruction = (docType === 'kk')
      ? "Ekstrak data dari foto Kartu Keluarga (KK) Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari: no_kk (Nomor KK 16 digit angka), nama (Nama Kepala Keluarga atau Anggota), nik (NIK 16 digit angka), alamat, rt_rw, kelurahan, kecamatan, kota, provinsi. Kosongkan string (\"\") jika tidak terbaca. Output HANYA JSON valid."
      : "Ekstrak data dari foto e-KTP Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari: nik (16 digit angka tanpa spasi), nama (Nama lengkap sesuai KTP), tempat_lahir, tanggal_lahir (DD-MM-YYYY), jenis_kelamin (LAKI-LAKI atau PEREMPUAN), alamat, rt_rw, kelurahan, kecamatan, kota, provinsi, agama, status_perkawinan, pekerjaan. Kosongkan string (\"\") jika tidak terbaca. Output HANYA JSON valid.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptInstruction },
            { inlineData: { mimeType: mimeType, data: cleanBase64 } }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) throw new Error(`Gemini direct status ${response.status}`);
    const resJson = await response.json();
    let rawJsonText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    rawJsonText = rawJsonText.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(rawJsonText);
  },

  attachPhotoToHiddenAndThumb() {
    if (!this.capturedImageBase64) return;
    if (this.ocrDocType === 'kk') {
      const hidKk = document.getElementById('spkFotoKk');
      if (hidKk) hidKk.value = this.capturedImageBase64;
      const cardKk = document.getElementById('spkDocCardKk');
      const thumbKk = document.getElementById('spkThumbKk');
      const statusKk = document.getElementById('spkStatusKk');
      const btnTextKk = document.getElementById('spkBtnTextKk');
      if (cardKk) cardKk.classList.add('has-file');
      if (thumbKk) thumbKk.innerHTML = `<img src="${this.capturedImageBase64}" alt="KK" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
      if (statusKk) statusKk.textContent = '✅ Kartu Keluarga Terlampir';
      if (btnTextKk) btnTextKk.textContent = 'Ganti Foto';
    } else {
      const hidKtp = document.getElementById('spkFotoKtp');
      if (hidKtp) hidKtp.value = this.capturedImageBase64;
      const cardKtp = document.getElementById('spkDocCardKtp');
      const thumbKtp = document.getElementById('spkThumbKtp');
      const statusKtp = document.getElementById('spkStatusKtp');
      const btnTextKtp = document.getElementById('spkBtnTextKtp');
      if (cardKtp) cardKtp.classList.add('has-file');
      if (thumbKtp) thumbKtp.innerHTML = `<img src="${this.capturedImageBase64}" alt="KTP" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
      if (statusKtp) statusKtp.textContent = '✅ e-KTP Terlampir';
      if (btnTextKtp) btnTextKtp.textContent = 'Ganti Foto';
    }
  },

  highlightField(el) {
    if (!el) return;
    el.style.transition = 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    el.style.backgroundColor = '#ecfdf5';
    el.style.borderColor = '#10b981';
    el.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
    setTimeout(() => {
      el.style.backgroundColor = '';
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 4000);
  },

  async processOcr() {
    if (!this.capturedImageBase64) {
      if (window.showCustomAlert) {
        window.showCustomAlert('Peringatan', 'Silakan ambil atau pilih foto dokumen terlebih dahulu.', 'warning');
      } else {
        alert('Silakan ambil atau pilih foto dokumen terlebih dahulu.');
      }
      return;
    }

    this.isProcessingOcr = true;
    const overlay = document.getElementById('ocrScanningOverlay');
    const statusText = document.getElementById('ocrScanningStatusText');
    const preScanActions = document.getElementById('ocrPreScanActions');

    if (overlay) overlay.style.display = 'flex';
    if (preScanActions) preScanActions.style.display = 'none';
    if (statusText) statusText.textContent = 'Mempersiapkan gambar & menghubungkan AI Vision...';

    const apiKey = localStorage.getItem('sft_gemini_api_key') || '';
    let extracted = null;
    let engineUsed = 'Gemini AI Vision';

    try {
      // 1. Coba backend endpoints dengan timeout 16s per candidate
      const candidateEndpoints = this.getApiEndpoints();

      for (const endpoint of candidateEndpoints) {
        try {
          if (statusText) statusText.textContent = 'Menganalisis dokumen dengan AI Gemini Vision...';
          const controller = new AbortController();
          const tId = setTimeout(() => controller.abort(), 16000);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              image: this.capturedImageBase64,
              doc_type: this.ocrDocType,
              api_key: apiKey
            }),
            signal: controller.signal
          });
          clearTimeout(tId);

          if (res.ok) {
            const txt = await res.text();
            let parsed = null;
            try {
              parsed = JSON.parse(txt);
            } catch (je) {}

            if (parsed && parsed.status === 'success' && this.hasExtractedFields(parsed.data)) {
              extracted = parsed.data;
              engineUsed = parsed.engine || 'Gemini AI Vision';
              break;
            } else if (parsed && parsed.status === 'unreadable') {
              console.warn('Backend Gemini returned unreadable:', parsed.message);
              break;
            }
          }
        } catch (e) {
          // Lanjut ke endpoint berikutnya
        }
      }

      // 2. Jika backend belum menghasilkan data, coba Direct Gemini Vision dari browser
      if (!this.hasExtractedFields(extracted)) {
        try {
          if (statusText) statusText.textContent = 'Menghubungkan AI Gemini Vision langsung...';
          const directData = await this.directGeminiVision(this.capturedImageBase64, this.ocrDocType);
          const normalized = this.normalizeExtractedData(directData, this.ocrDocType);
          if (this.hasExtractedFields(normalized)) {
            extracted = normalized;
            engineUsed = 'Direct Gemini AI Vision';
          }
        } catch (directErr) {
          console.warn('Direct Gemini Vision fallback failed:', directErr);
        }
      }

      // 3. Jika AI Vision belum mendapatkan data, fallback ke Tesseract.js client OCR
      if (!this.hasExtractedFields(extracted)) {
        if (statusText) statusText.textContent = '🔍 Membaca teks dokumen via Smart OCR lokal...';
        try {
          if (typeof Tesseract === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
          }
          if (statusText) statusText.textContent = '⚡ Mengoptimalkan kontras karakter & NIK...';
          const preprocessedImg = await this.preprocessImageForOcr(this.capturedImageBase64);

          if (statusText) statusText.textContent = '🤖 Menganalisis karakter dokumen identitas...';
          const ret = await Tesseract.recognize(preprocessedImg, 'eng');
          const text = ret.data?.text || '';

          if (text) {
            const localParsed = this.parseKtpText(text);
            if (this.hasExtractedFields(localParsed)) {
              extracted = localParsed;
              engineUsed = 'Smart Local OCR Engine';
            }
          }
        } catch (tessErr) {
          console.warn('Tesseract fallback failed:', tessErr);
        }
      }

      // 4. Periksa hasil ekstraksi akhir
      if (this.hasExtractedFields(extracted)) {
        this.extractedOcrData = extracted;
        this.renderOcrReview(this.extractedOcrData, engineUsed);
        // LANGSUNG AUTO-FILL DATA KE FORMULIR OTOMATIS!
        this.applyExtractedDataToForm(true);
        return;
      } else {
        // Dokumen tidak terbaca jelas: JANGAN tutup modal diam-diam!
        this.attachPhotoToHiddenAndThumb();
        
        const docName = this.ocrDocType === 'kk' ? 'Kartu Keluarga' : 'e-KTP';
        const msg = `Teks pada foto ${docName} belum terdeteksi dengan jelas. Pastikan foto tegak, memiliki cahaya terang, fokus, dan tidak terpotong silau. Silakan coba ambil foto ulang atau isi data secara manual.`;
        
        if (window.showCustomAlert) {
          window.showCustomAlert('Dokumen Belum Terbaca Jelas', msg, 'warning');
        } else {
          alert(msg);
        }
      }

    } catch (err) {
      console.error('OCR Processing error:', err);
      this.attachPhotoToHiddenAndThumb();
      if (window.showCustomAlert) {
        window.showCustomAlert('Perhatian', 'Gagal memproses OCR. Silakan periksa koneksi internet atau foto ulang dokumen.', 'info');
      } else {
        alert('Gagal memproses OCR. Silakan coba lagi.');
      }
    } finally {
      this.isProcessingOcr = false;
      if (overlay) overlay.style.display = 'none';
      if (preScanActions) preScanActions.style.display = 'flex';
    }
  },

  renderOcrReview(data, engineName) {
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');
    const reviewList = document.getElementById('ocrReviewList');
    const engineBadge = document.getElementById('ocrEngineBadge');

    if (secPreview) secPreview.style.display = 'none';
    if (secReview) secReview.style.display = 'block';

    if (engineBadge) {
      engineBadge.textContent = engineName || 'Smart AI Engine';
    }

    const items = [
      { label: 'Nomor NIK', val: data.nik || '-' },
      { label: 'No. Kartu Keluarga', val: data.no_kk || '-' },
      { label: 'Nama Lengkap', val: data.nama || '-' },
      { label: 'Tempat / Tgl Lahir', val: (data.tempat_lahir ? data.tempat_lahir + ', ' : '') + (data.tanggal_lahir || '-') },
      { label: 'Jenis Kelamin', val: data.jenis_kelamin || '-' },
      { label: 'Alamat', val: data.alamat || '-' },
      { label: 'RT / RW', val: data.rt_rw || '-' },
      { label: 'Kelurahan / Desa', val: data.kelurahan || '-' },
      { label: 'Kecamatan', val: data.kecamatan || '-' },
      { label: 'Kota / Kabupaten', val: data.kota || '-' },
      { label: 'Status Perkawinan', val: data.status_perkawinan || '-' },
      { label: 'Pekerjaan', val: data.pekerjaan || '-' }
    ];

    if (reviewList) {
      reviewList.innerHTML = items.map(item => `
        <div class="ocr-result-item">
          <span class="ocr-result-lbl">${item.label}:</span>
          <span class="ocr-result-val">${escapeHtml(item.val)}</span>
        </div>
      `).join('');
    }
  },

  applyExtractedDataToForm(isAuto = false) {
    const d = this.extractedOcrData || {};

    let filledCount = 0;

    // 1. Auto-fill custom targetFields if specified (e.g. from customer.blade.php)
    if (this.currentTargetFields && typeof this.currentTargetFields === 'object') {
      for (const [key, targetId] of Object.entries(this.currentTargetFields)) {
        const val = d[key];
        const el = document.getElementById(targetId);
        if (el && val) {
          const cleanVal = String(val).trim();
          if (cleanVal && cleanVal !== '-') {
            el.value = cleanVal;
            try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
            try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
            this.highlightField(el);
            filledCount++;
          }
        }
      }
    }

    // 2. Auto-fill kolom identitas SPK
    const fieldMap = {
      spkNik: d.nik,
      spkNoKk: d.no_kk,
      namaCustomer: d.nama,
      spkTempatLahir: d.tempat_lahir,
      spkTanggalLahir: d.tanggal_lahir,
      spkJenisKelamin: d.jenis_kelamin,
      spkStatusPerkawinan: d.status_perkawinan,
      spkAlamat: d.alamat,
      spkRtRw: d.rt_rw,
      spkKelurahan: d.kelurahan,
      spkKecamatan: d.kecamatan,
      spkKota: d.kota,
      spkProvinsi: d.provinsi,
      spkAgama: d.agama,
      spkPekerjaan: d.pekerjaan
    };

    for (let [id, val] of Object.entries(fieldMap)) {
      const el = document.getElementById(id);
      if (el && val) {
        val = String(val).trim();
        if (!val || val === '-') continue;

        // Normalisasi untuk dropdown/select
        if (id === 'spkJenisKelamin') {
          const u = val.toUpperCase();
          if (u.includes('LAK') || u === 'L' || u.includes('PRIA')) {
            el.value = 'LAKI-LAKI';
          } else if (u.includes('PER') || u === 'P' || u.includes('WAN')) {
            el.value = 'PEREMPUAN';
          } else {
            el.value = val;
          }
        } else if (id === 'spkStatusPerkawinan') {
          const u = val.toUpperCase();
          if (u.includes('BELUM')) {
            el.value = 'BELUM KAWIN';
          } else if (u.includes('CERAI HIDUP')) {
            el.value = 'CERAI HIDUP';
          } else if (u.includes('CERAI MATI')) {
            el.value = 'CERAI MATI';
          } else if (u.includes('KAWIN') || u.includes('NIKAH')) {
            el.value = 'KAWIN';
          } else {
            el.value = val;
          }
        } else if (id === 'spkAgama') {
          const u = val.toUpperCase();
          for (let opt of el.options) {
            if (opt.value && u.includes(opt.value.toUpperCase())) {
              el.value = opt.value;
              break;
            }
          }
        } else {
          el.value = val;
        }

        // Trigger event input dan change agar listener bereaksi
        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}

        this.highlightField(el);
        filledCount++;
      }
    }

    // 3. Simpan lampiran foto ke hidden input & update card preview
    this.attachPhotoToHiddenAndThumb();

    // 4. Jika ada field yang terisi, tutup modal dan beri feedback
    if (filledCount > 0) {
      this.closeOcrModal();

      // Scroll ke bagian identitas agar user langsung melihat data yang terisi
      setTimeout(() => {
        const firstField = document.getElementById('namaCustomer') || document.getElementById('spkNik') || document.getElementById('newCustomerName');
        if (firstField) {
          firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstField.focus();
        }
      }, 300);

      const docLabel = (this.ocrDocType === 'kk' ? 'Kartu Keluarga' : 'e-KTP');
      if (window.showCustomAlert) {
        window.showCustomAlert(
          '✨ Auto-Fill Berhasil!',
          `Data identitas ${docLabel} berhasil diekstrak dan otomatis dimasukkan ke ${filledCount} kolom formulir.`,
          'success'
        );
      } else {
        alert(`Data identitas ${docLabel} berhasil diisi otomatis ke formulir (${filledCount} kolom)!`);
      }
    } else {
      if (!isAuto) {
        if (window.showCustomAlert) {
          window.showCustomAlert('Belum Ada Data', 'Tidak ada data identitas yang dapat diterapkan ke formulir. Silakan coba foto ulang dokumen.', 'warning');
        } else {
          alert('Tidak ada data identitas yang dapat diterapkan. Silakan foto ulang dokumen.');
        }
      }
    }
  },

  // Backward compatibility method
  async scanKtpFile(fileInput, targetFields = { nik: 'spkNik', nama: 'namaCustomer', alamat: 'spkAlamat' }) {
    if (!fileInput.files || !fileInput.files[0]) return;
    this.currentTargetFields = targetFields;
    const file = fileInput.files[0];
    const modal = document.getElementById('smartOcrModal');
    if (modal) {
      this.handleFileSelect(fileInput);
      this.openOcrModal('ktp');
      return;
    }

    // Modal tidak ada di halaman ini (misal customer.blade.php): lakukan Quick OCR langsung
    const reader = new FileReader();
    reader.onload = async (e) => {
      this.capturedImageBase64 = e.target.result;
      this.ocrDocType = 'ktp';
      if (window.showCustomAlert) {
        window.showCustomAlert('Memindai Dokumen...', 'Sedang membaca teks KTP dengan AI Vision...', 'info');
      }
      await this.processOcr();
    };
    reader.readAsDataURL(file);
  },

  parseKtpText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let nik = '', no_kk = '', nama = '', alamat = '', tempat_lahir = '', tanggal_lahir = '', jenis_kelamin = '', rt_rw = '', kelurahan = '', kecamatan = '', kota = '', provinsi = '', agama = '', status_perkawinan = '', pekerjaan = '';

    // Normalize OCR digit confusions
    const numClean = text.replace(/[oOD]/g, '0').replace(/[Il|]/g, '1').replace(/[Zz]/g, '2').replace(/[Ss]/g, '5').replace(/B/g, '8');
    const numCondensed = numClean.replace(/(\d)\s+(\d)/g, '$1$2').replace(/(\d)\s+(\d)/g, '$1$2');

    // Extract NIK (16 digits)
    const nikMatch = numCondensed.match(/\b([1-9][0-9]{15})\b/) || numClean.match(/N[I1l|][Kk]\D*([0-9\s]{16,24})/i);
    if (nikMatch) {
      const d = (nikMatch[1] || '').replace(/\D/g, '');
      if (d.length >= 16) nik = d.slice(0, 16);
    }
    if (!nik) {
      const any16 = numCondensed.match(/\b([0-9]{16})\b/);
      if (any16) nik = any16[1];
    }

    // Extract No KK
    if (this.ocrDocType === 'kk') {
      const kkMatch = numClean.match(/(?:NO|NOMOR)\D*K(?:ARTU)?\D*K(?:ELUARGA)?\D*([0-9\s]{16,24})/i) || numCondensed.match(/\b([1-9][0-9]{15})\b/);
      if (kkMatch) {
        const d = (kkMatch[1] || '').replace(/\D/g, '');
        if (d.length >= 16) no_kk = d.slice(0, 16);
      }
    }

    // Extract Nama
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/nama\b/i.test(line)) {
        nama = line.replace(/.*nama\s*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        if (!nama && lines[i + 1] && !/nik|tempat|tgl|lahir|alamat|jenis|kelamin|agama|status/i.test(lines[i + 1])) {
          nama = lines[i + 1].replace(/.*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        }
        break;
      }
    }

    // Fallback Nama jika baris berlabel Nama tidak terbaca
    if (!nama && nik) {
      let foundNik = false;
      for (let i = 0; i < lines.length; i++) {
        if (foundNik) {
          const clean = lines[i].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
          if (clean.length >= 3 && !/PROVINSI|REPUBLIK|INDONESIA|NIK|TEMPAT|LAHIR|BANDUNG|JAKARTA/i.test(clean)) {
            nama = clean;
            break;
          }
        }
        if (/nik\b/i.test(lines[i]) || lines[i].includes(nik)) {
          foundNik = true;
        }
      }
    }

    // Extract TTL
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/tempat|tgl|lahir/i.test(line)) {
        const val = line.replace(/.*(?:tempat|tgl|lahir)\s*[:=\-]?\s*/i, '').trim();
        const m = val.match(/([a-zA-Z\s]+)[,\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/);
        if (m) {
          tempat_lahir = m[1].trim().toUpperCase();
          tanggal_lahir = m[2].trim();
        } else {
          const dateOnly = val.match(/([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/);
          if (dateOnly) tanggal_lahir = dateOnly[1].trim();
          const placeOnly = val.replace(/[0-9\/\-\.,:]/g, '').trim().toUpperCase();
          if (placeOnly) tempat_lahir = placeOnly;
        }
        break;
      }
    }

    // Extract Jenis Kelamin
    if (/LAKI[\-\s]*LAKI|PRIA/i.test(text)) jenis_kelamin = 'LAKI-LAKI';
    else if (/PEREMPUAN|WANITA/i.test(text)) jenis_kelamin = 'PEREMPUAN';

    // Extract RT/RW
    const rtrwMatch = text.match(/RT[\/\.]?RW\D*([0-9]{1,3})\s*[\/\-]\s*([0-9]{1,3})/i);
    if (rtrwMatch) {
      rt_rw = `${rtrwMatch[1].padStart(3, '0')}/${rtrwMatch[2].padStart(3, '0')}`;
    }

    // Extract Alamat
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/alamat/i.test(line)) {
        alamat = line.replace(/.*alamat\s*[:=\-]?\s*/i, '').trim();
        if (lines[i + 1] && !/rt|rw|kel|kec|agama|status/i.test(lines[i + 1])) {
          alamat += ' ' + lines[i + 1].trim();
        }
        break;
      }
    }

    // Extract Kelurahan / Desa
    for (let i = 0; i < lines.length; i++) {
      if (/kelurahan|desa/i.test(lines[i])) {
        kelurahan = lines[i].replace(/.*(?:kelurahan|kel|desa)\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    // Extract Kecamatan
    for (let i = 0; i < lines.length; i++) {
      if (/kecamatan/i.test(lines[i])) {
        kecamatan = lines[i].replace(/.*kecamatan\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    // Extract Kota / Kabupaten
    const kotaMatch = text.match(/(?:KOTA|KABUPATEN|KAB\.?)\s+([A-Z\s]+)/i);
    if (kotaMatch) {
      const firstPart = kotaMatch[1].split('\n')[0].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
      if (firstPart) {
        const prefix = /KAB/i.test(kotaMatch[0]) ? 'KABUPATEN ' : 'KOTA ';
        kota = prefix + firstPart;
      }
    }

    // Extract Provinsi
    const provMatch = text.match(/PROVINSI\s+([A-Z\s]+)/i);
    if (provMatch) {
      provinsi = provMatch[1].split('\n')[0].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
    }

    // Extract Agama
    if (/ISLAM/i.test(text)) agama = 'ISLAM';
    else if (/KRISTEN|PROTESTAN/i.test(text)) agama = 'KRISTEN';
    else if (/KATOLIK/i.test(text)) agama = 'KATOLIK';
    else if (/HINDU/i.test(text)) agama = 'HINDU';
    else if (/BUDDHA|BUDHA/i.test(text)) agama = 'BUDDHA';
    else if (/KONGHUCU/i.test(text)) agama = 'KONGHUCU';

    // Extract Status Perkawinan
    if (/BELUM\s*KAWIN/i.test(text)) status_perkawinan = 'BELUM KAWIN';
    else if (/CERAI\s*HIDUP/i.test(text)) status_perkawinan = 'CERAI HIDUP';
    else if (/CERAI\s*MATI/i.test(text)) status_perkawinan = 'CERAI MATI';
    else if (/KAWIN/i.test(text)) status_perkawinan = 'KAWIN';

    // Extract Pekerjaan
    for (let i = 0; i < lines.length; i++) {
      if (/pekerjaan/i.test(lines[i])) {
        pekerjaan = lines[i].replace(/.*pekerjaan\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    return { nik, no_kk, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, agama, status_perkawinan, pekerjaan };
  },

  // =========================================================================
  // 5. VOICE NOTE ACTIVITY LOG (SPEECH-TO-TEXT)
  // =========================================================================
  initVoiceRecorder(targetInputId, triggerBtnId, statusPillId) {
    const targetInput = document.getElementById(targetInputId);
    const triggerBtn = document.getElementById(triggerBtnId);
    const statusPill = statusPillId ? document.getElementById(statusPillId) : null;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (triggerBtn) {
        triggerBtn.title = 'Browser tidak mendukung Speech Recognition (Gunakan Chrome/Edge)';
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      this.isRecording = true;
      if (triggerBtn) {
        triggerBtn.classList.add('recording');
        triggerBtn.innerHTML = `
          <div class="voice-wave-bars">
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
          </div>
          <span style="color:#dc2626; font-weight:800;">Merekam... (Klik Selesai)</span>
        `;
      }
      if (statusPill) {
        statusPill.style.display = 'flex';
        statusPill.innerHTML = `<i class="fa-solid fa-microphone-lines fa-fade" style="color:#ef4444;"></i> Bicaralah sekarang dalam bahasa Indonesia...`;
      }
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      if (targetInput && transcript) {
        const existing = targetInput.value.trim();
        targetInput.value = existing ? existing + ' ' + transcript : transcript;
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error', event.error);
      this.isRecording = false;
      if (triggerBtn) {
        triggerBtn.classList.remove('recording');
        triggerBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> <span>Dikte Suara (Mic)</span>`;
      }
      if (statusPill) {
        statusPill.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color:#f59e0b;"></i> Selesai mendikte.`;
        setTimeout(() => { statusPill.style.display = 'none'; }, 2000);
      }
    };

    recognition.onend = () => {
      this.isRecording = false;
      if (triggerBtn) {
        triggerBtn.classList.remove('recording');
        triggerBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> <span>Dikte Suara (Mic)</span>`;
      }
      if (statusPill) {
        statusPill.innerHTML = `<i class="fa-solid fa-check" style="color:#10b981;"></i> Catatan suara berhasil diubah ke teks!`;
        setTimeout(() => { statusPill.style.display = 'none'; }, 2500);
      }
    };

    if (triggerBtn) {
      triggerBtn.onclick = () => {
        if (this.isRecording) {
          recognition.stop();
        } else {
          recognition.start();
        }
      };
    }
  },

  // Helper to load dynamic scripts
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }
};

// Global shorthand
window.SalesSuperpowers = SalesSuperpowers;
window.openRadarFollowupModal = (id) => SalesSuperpowers.openRadarFollowupModal(id);
window.submitRadarFollowup = (id) => SalesSuperpowers.submitRadarFollowup(id);
