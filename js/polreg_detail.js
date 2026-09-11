const urlParams = new URLSearchParams(window.location.search);
const namaKecamatan = decodeURIComponent(urlParams.get('kecamatan') || "Coblong");
const filterTahun = urlParams.get('tahun') || '2026';
const tahunPilihDefault = filterTahun;
let currentSortOrder = 'desc';
let currentKategori = 'Teratas';
let currentSearchKeyword = '';
let activeCarsData = [];

// Save active year to sessionStorage & update back button link
sessionStorage.setItem('polreg_active_year', filterTahun);
document.addEventListener('DOMContentLoaded', () => {
    const btnBack = document.getElementById('btnBackPolreg');
    if (btnBack) {
        btnBack.href = `polreg.html?tahun=${encodeURIComponent(filterTahun)}`;
    }
});

    window.toggleLocationDetails = async function(el, merk, type) {
        const wrapper = el.parentElement;
        const container = wrapper.querySelector('.location-details-container');
        const isVisible = container.style.display === 'block';
        
        if (isVisible) {
            container.style.display = 'none';
            return;
        } else {
            container.style.display = 'block';
        }

        const loadingEl = container.querySelector('.loc-loading');
        if (!loadingEl) return;

        try {
            let url = `../api/api_polreg_lokasi_type.php?kecamatan=${encodeURIComponent(namaKecamatan)}&tahun=${encodeURIComponent(filterTahun)}&merk=${encodeURIComponent(merk)}&type=${encodeURIComponent(type)}&sort=${currentSortOrder}`;
            const res = await fetch(url);
            const json = await res.json();
            
            if (json.ok && json.data.length > 0) {
                let html = '<ul style="margin:0; padding-left:15px; color:#475569;">';
                json.data.forEach(loc => {
                    html += `<li style="margin-bottom:4px;"><strong style="color:#334155;">Kel. ${loc.kelurahan}</strong> - <strong style="color:#e11d48;">${loc.unit} Unit</strong></li>`;
                });
                html += '</ul>';
                container.innerHTML = html;
            } else {
                container.innerHTML = '<span style="color:#777;">Data lokasi detail tidak ditemukan.</span>';
            }
        } catch(e) {
            container.innerHTML = '<span style="color:#ef4444;">Gagal memuat detail lokasi.</span>';
        }
    };

    function changeSortOrder(val) {
        currentSortOrder = val;
        const elSelect = document.getElementById('sortSelect');
        if (elSelect) elSelect.value = val;
        
        const sortIcon = document.getElementById('sortIcon');
        const sortText = document.getElementById('sortText');
        if (sortIcon && sortText) {
            if (val === 'asc') {
                sortIcon.className = 'fa-solid fa-arrow-up-1-9';
                sortText.textContent = 'Paling Sedikit';
            } else if (val === 'alpha') {
                sortIcon.className = 'fa-solid fa-arrow-down-a-z';
                sortText.textContent = 'Sesuai Abjad';
            } else {
                sortIcon.className = 'fa-solid fa-arrow-down-9-1';
                sortText.textContent = 'Terbanyak';
            }
        }
        renderCarList();

        if (mapData && mapData.length > 0) {
            processAndRenderMapMarkers();
        }
    }

    function toggleSortOrder() {
        if (currentSortOrder === 'desc') {
            changeSortOrder('asc');
        } else if (currentSortOrder === 'asc') {
            changeSortOrder('alpha');
        } else {
            changeSortOrder('desc');
        }
    }

    function setLoading(isLoading) {
      const loadingIndicator = document.getElementById('loadingIndicator');
      const carList = document.getElementById('carList');
      if (isLoading) {
        loadingIndicator.style.display = 'block';
        carList.innerHTML = '';
      } else {
        loadingIndicator.style.display = 'none';
      }
    }

    function renderTabs() {
      const merkSelect = document.getElementById('merkSelect');
      const merkLogoPreview = document.getElementById('merkLogoPreview');

      merkSelect.innerHTML = '';
      const totalAllUnits = activeCarsData.reduce((sum, car) => sum + car.unit, 0);

      // Option "Teratas" (Semua Merk)
      const terataseOption = document.createElement('option');
      terataseOption.value = 'Teratas';
      terataseOption.textContent = `⭐ Semua Merk - Teratas (${totalAllUnits} U)`;
      if (currentKategori === 'Teratas') terataseOption.selected = true;
      merkSelect.appendChild(terataseOption);

      // Hitung brand totals
      const brandCounts = {};
      activeCarsData.forEach(car => brandCounts[car.merk] = (brandCounts[car.merk] || 0) + car.unit);
      const merkList = Object.keys(brandCounts).sort();

      document.getElementById('countmerk').textContent = `${merkList.length} Merk Terdata`;

      // Tambah option untuk setiap brand
      merkList.forEach(merk => {
        const option = document.createElement('option');
        option.value = merk;
        option.textContent = `${merk} (${brandCounts[merk]} U)`;
        if (currentKategori === merk) option.selected = true;
        merkSelect.appendChild(option);
      });

      // Update logo preview
      updateMerkLogoPreview(currentKategori);
    }

    function updateMerkLogoPreview(merkName) {
      const merkLogoPreview = document.getElementById('merkLogoPreview');
      if (merkName === 'Teratas') {
        merkLogoPreview.style.display = 'none';
      } else {
        merkLogoPreview.src = `../image/merk_icons/${merkName.toLowerCase()}.jpg`;
        merkLogoPreview.style.display = 'block';
        merkLogoPreview.onerror = function () { this.style.display = 'none'; };
      }
    }

    function selectKategoriFromDropdown(merk) {
      selectKategori(merk);
      updateMerkLogoPreview(merk);
    }




    function renderCarList() {
      const listContainer = document.getElementById('carList');
      listContainer.innerHTML = '';
      document.getElementById('listTitle').textContent = currentKategori === 'Teratas' ? 'Semua Type Kendaraan' : `Type Kendaraan ${currentKategori}`;

      let filteredCars = activeCarsData;
      if (currentKategori !== 'Teratas') {
        filteredCars = activeCarsData.filter(car => car.merk.toLowerCase() === currentKategori.toLowerCase());
      }
      if (currentSearchKeyword !== '') {
        filteredCars = filteredCars.filter(car =>
          car.type.toLowerCase().includes(currentSearchKeyword) ||
          car.merk.toLowerCase().includes(currentSearchKeyword)
        );
      }

      if (filteredCars.length === 0) {
        listContainer.innerHTML = '<div style="text-align:center; padding: 25px; color:#777; font-size:12px;">Type mobil tidak ditemukan.</div>';
        return;
      }
      
      // Lakukan sorting
      if (currentSortOrder === 'asc') {
          filteredCars.sort((a, b) => a.unit - b.unit);
      } else if (currentSortOrder === 'alpha') {
          filteredCars.sort((a, b) => {
              let nameA = `${a.merk} ${a.type}`.toLowerCase();
              let nameB = `${b.merk} ${b.type}`.toLowerCase();
              return nameA.localeCompare(nameB);
          });
      } else {
          filteredCars.sort((a, b) => b.unit - a.unit);
      }

      filteredCars.forEach((car, index) => {
        const rankNum = index + 1;
        let rankClass = rankNum <= 3 ? `rank-${rankNum}` : "";
        let rankBadge = rankNum === 1 ? '<i class="fa-solid fa-medal" style="color: #5d4037;"></i>' : rankNum === 2 ? '<i class="fa-solid fa-medal" style="color: #37474f;"></i>' : rankNum === 3 ? '<i class="fa-solid fa-medal" style="color: #ffffff;"></i>' : rankNum;

        let badgeColor = "brand-badge-toyota"; // Default
        if (car.merk.toLowerCase() === 'honda') badgeColor = "brand-badge-honda";
        if (car.merk.toLowerCase() === 'daihatsu') badgeColor = "brand-badge-daihatsu";

        listContainer.innerHTML += `
          <div class="car-rank-wrapper" style="margin-bottom: 12px; border-radius: 12px; border: 1px solid #e2e8f0; background: white; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.02);">
              <div class="car-rank-item ${rankClass}" style="margin-bottom:0; border:none; border-radius:0; box-shadow:none; cursor:pointer;" onclick="toggleLocationDetails(this, '${car.merk}', '${car.type}')">
                <div class="rank-number">${rankBadge}</div>
                <div class="car-info">
                  <span class="car-brand-badge ${badgeColor}">${car.merk}</span>
                  <span class="car-type">${car.type}</span>
                </div>
                <div class="car-unit">${car.unit} <span>Unit</span></div>
              </div>
              <div class="location-details-container" style="display:none; padding: 12px; background:#f8fafc; border-top: 1px dashed #cbd5e1; font-size:11px;">
                 <div class="loc-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat lokasi...</div>
              </div>
          </div>
        `;
      });
    }

    function selectKategori(kategori) {
      currentKategori = kategori;
      renderTabs();
      renderCarList();
      if (document.getElementById('viewMap').style.display === 'block') {
         if (layerGroup) layerGroup.clearLayers();
         loadMapData();
      }
    }




    document.getElementById('searchType').addEventListener('input', e => {
      currentSearchKeyword = e.target.value.toLowerCase().trim();
      renderCarList();
      if (document.getElementById('viewMap').style.display === 'block') {
         if (layerGroup) layerGroup.clearLayers();
         loadMapData();
      }
    });

    async function initPage() {
      const elTitle = document.getElementById('pageTitle');
      if (elTitle) elTitle.textContent = `Detail Wilayah ${tahunPilihDefault}`;
      
      const elKec = document.getElementById('displayKecamatan');
      if (elKec) elKec.textContent = `Kecamatan ${namaKecamatan}`;
      
      const elThn = document.getElementById('displayTahun');
      if (elThn) elThn.textContent = filterTahun;

      try {
        const elSearch = document.getElementById('searchType');
        if (elSearch) {
          elSearch.addEventListener('input', e => {
            currentSearchKeyword = e.target.value.toLowerCase().trim();
            renderCarList();
          });
        }

        await fetchAndRender();
        setLoading(false);
      } catch (e) {
        console.error(e);
        const elLoading = document.getElementById('loadingIndicator');
        if (elLoading) elLoading.innerHTML = "Gagal memuat data.";
      }
    }

    async function fetchAndRender() {
      setLoading(true);
      const r = await fetch(`../api/api_polreg_detail.php?kecamatan=${encodeURIComponent(namaKecamatan)}&tahun=${encodeURIComponent(tahunPilihDefault)}`);
      const json = await r.json();
      if (json.ok) {
        activeCarsData = json.data;
        renderTabs();
        renderCarList();
        setLoading(false);
      } else {
        document.getElementById('loadingIndicator').innerHTML = `<span style="color:red;">Error: ${json.message}</span>`;
        setLoading(false);
      }
    }



    let map = null;
    let layerGroup = null;
    let mapData = [];

    function switchView(view) {
      const btnList = document.getElementById('btnViewList');
      const btnMap = document.getElementById('btnViewMap');
      const viewList = document.getElementById('viewList');
      const viewMap = document.getElementById('viewMap');
      const headerList = document.getElementById('headerList');

      if (view === 'list') {
        btnList.style.background = 'var(--primary-red)';
        btnList.style.color = 'white';
        btnMap.style.background = '#e2e8f0';
        btnMap.style.color = '#475569';
        viewList.style.display = 'block';
        if(headerList) headerList.style.display = 'flex';
        if(document.getElementById('listTitle')) document.getElementById('listTitle').textContent = currentKategori === 'Teratas' ? 'Semua Type Kendaraan' : `Type Kendaraan ${currentKategori}`;
        viewMap.style.display = 'none';
      } else {
        btnMap.style.background = 'var(--primary-red)';
        btnMap.style.color = 'white';
        btnList.style.background = '#e2e8f0';
        btnList.style.color = '#475569';
        viewList.style.display = 'none';
        if(headerList) headerList.style.display = 'flex';
        if(document.getElementById('listTitle')) document.getElementById('listTitle').textContent = 'Peta Registrasi Kendaraan';
        viewMap.style.display = 'block';
        
        if (!map) {
          initMap();
        } else {
          map.invalidateSize();
        }
      }
    }

    async function initMap() {
      map = L.map('mapPolreg').setView([-6.914744, 107.609810], 13);
      L.tileLayer('https://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          attribution: '© Google Maps'
      }).addTo(map);
      
      layerGroup = L.layerGroup().addTo(map);
      await loadMapData();
    }

    async function loadMapData() {
      document.getElementById('loadingMap').style.display = 'block';
      document.getElementById('loadingMapText').textContent = 'Memuat data lokasi...';
      
      let merkParam = currentKategori === 'Teratas' ? '' : currentKategori;
      let url = `../api/api_polreg_map.php?kecamatan=${encodeURIComponent(namaKecamatan)}&tahun=${encodeURIComponent(filterTahun)}&merk=${encodeURIComponent(merkParam)}&type=${encodeURIComponent(currentSearchKeyword)}`;
      
      try {
        const r = await fetch(url);
        const json = await r.json();
        if (json.ok) {
          mapData = json.data;
          await processAndRenderMapMarkers();
        }
      } catch (e) {
        console.error(e);
      }
      document.getElementById('loadingMap').style.display = 'none';
    }

    function clipPolygonHalfplane(poly, M, N) {
        if (!poly || poly.length === 0) return [];
        let clipped = [];
        let count = poly.length;
        let ring = [...poly];
        if (ring[0][0] === ring[count - 1][0] && ring[0][1] === ring[count - 1][1] && count > 1) {
            ring.pop();
            count--;
        }
        for (let i = 0; i < count; i++) {
            let curr = ring[i];
            let next = ring[(i + 1) % count];
            let currDot = (curr[0] - M[0]) * N[0] + (curr[1] - M[1]) * N[1];
            let nextDot = (next[0] - M[0]) * N[0] + (next[1] - M[1]) * N[1];
            let currIn = (currDot <= 1e-9);
            let nextIn = (nextDot <= 1e-9);
            if (currIn) clipped.push(curr);
            if (currIn !== nextIn) {
                let t = currDot / (currDot - nextDot);
                clipped.push([curr[0] + t * (next[0] - curr[0]), curr[1] + t * (next[1] - curr[1])]);
            }
        }
        if (clipped.length > 0) clipped.push(clipped[0]);
        return clipped;
    }

    function generateClientVoronoi(seeds, boundary) {
        let cells = {};
        let keys = Object.keys(seeds);
        if (keys.length === 1) {
            cells[keys[0]] = boundary;
            return cells;
        }
        keys.forEach(k1 => {
            let s1 = seeds[k1];
            let cell = boundary;
            keys.forEach(k2 => {
                if (k1 === k2) return;
                let s2 = seeds[k2];
                let M = [(s1[0] + s2[0]) / 2, (s1[1] + s2[1]) / 2];
                let N = [s2[0] - s1[0], s2[1] - s1[1]];
                let lenSq = N[0] * N[0] + N[1] * N[1];
                if (lenSq < 1e-12) return;
                cell = clipPolygonHalfplane(cell, M, N);
            });
            if (cell && cell.length >= 4) cells[k1] = cell;
        });
        return cells;
    }

    async function processAndRenderMapMarkers() {
      document.getElementById('loadingMap').style.display = 'block';
      document.getElementById('loadingMapText').textContent = 'Memuat batas wilayah kelurahan...';

      // 0. Sanitasi koordinat outlier agar tidak pernah ada titik yang terpental ke luar wilayah kecamatan
      if (mapData && mapData.length > 0) {
          let validLats = mapData.map(i => parseFloat(i.lat)).filter(v => !isNaN(v) && v !== 0);
          let validLngs = mapData.map(i => parseFloat(i.lng)).filter(v => !isNaN(v) && v !== 0);
          if (validLats.length > 0) {
              let medianLat = validLats.sort((a, b) => a - b)[Math.floor(validLats.length / 2)];
              let medianLng = validLngs.sort((a, b) => a - b)[Math.floor(validLngs.length / 2)];
              
              mapData.forEach(item => {
                  let lat = parseFloat(item.lat);
                  let lng = parseFloat(item.lng);
                  if (!isNaN(lat) && !isNaN(lng)) {
                      let dLat = lat - medianLat;
                      let dLng = (lng - medianLng) * Math.cos(medianLat * Math.PI / 180);
                      let distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111.32;
                      if (distKm > 6.0) {
                          let factor = 3.0 / distKm;
                          item.lat = (medianLat + dLat * factor).toFixed(8);
                          item.lng = (medianLng + (lng - medianLng) * factor).toFixed(8);
                      }
                  }
              });
          }
      }

      // 1. Gabungkan data mentah berdasarkan kelurahan untuk mendapatkan total unit
      let kelurahanMap = {};
      mapData.forEach(item => {
          if (!kelurahanMap[item.kelurahan]) {
              kelurahanMap[item.kelurahan] = {
                  kelurahan: item.kelurahan,
                  kecamatan: item.kecamatan,
                  lats: [],
                  lngs: [],
                  unit_count: 0,
                  carsList: []
              };
          }
          if (item.lat && item.lng) {
              kelurahanMap[item.kelurahan].lats.push(parseFloat(item.lat));
              kelurahanMap[item.kelurahan].lngs.push(parseFloat(item.lng));
          }
          kelurahanMap[item.kelurahan].unit_count += parseInt(item.unit_count);
          if (item.cars) kelurahanMap[item.kelurahan].carsList.push(item.cars);
      });

      // 2. Ambil cache batas wilayah Polygon dari database
      let cachedGeo = {};
      try {
          const res = await fetch(`../api/api_polreg_geo.php?kecamatan=${encodeURIComponent(namaKecamatan)}`);
          const json = await res.json();
          if (json.ok) {
              cachedGeo = json.data;
          }
      } catch(e) {}

      let groupedData = [];
      let newGeoCache = [];
      let kelurahanList = Object.keys(kelurahanMap);
      
      const KAB_KOTA_MAP = {
          // Kota Bandung
          "ANDIR": "Kota Bandung", "ANTAPANI": "Kota Bandung", "ARCAMANIK": "Kota Bandung", "ASTANA ANYAR": "Kota Bandung",
          "BABAKAN CIPARAY": "Kota Bandung", "BANDUNG KIDUL": "Kota Bandung", "BANDUNG KULON": "Kota Bandung",
          "BANDUNG WETAN": "Kota Bandung", "BATUNUNGGAL": "Kota Bandung", "BOJONGLOA KALER": "Kota Bandung",
          "BOJONGLOA KIDUL": "Kota Bandung", "BUAHBATU": "Kota Bandung", "CIBEUNYING KALER": "Kota Bandung",
          "CIBEUNYING KIDUL": "Kota Bandung", "CIBIRU": "Kota Bandung", "CICENDO": "Kota Bandung",
          "CIDADAP": "Kota Bandung", "CINAMBO": "Kota Bandung", "COBLONG": "Kota Bandung", "GEDEBAGE": "Kota Bandung",
          "KIARACONDONG": "Kota Bandung", "LENGKONG": "Kota Bandung", "MANDALAJATI": "Kota Bandung",
          "PANYILEUKAN": "Kota Bandung", "RANCASARI": "Kota Bandung", "REGOL": "Kota Bandung",
          "SUKAJADI": "Kota Bandung", "SUKASARI": "Kota Bandung", "SUMUR BANDUNG": "Kota Bandung",
          "UJUNGBERUNG": "Kota Bandung",
          // Kota Cimahi
          "CIMAHI SELATAN": "Kota Cimahi", "CIMAHI TENGAH": "Kota Cimahi", "CIMAHI UTARA": "Kota Cimahi",
          // Kab Bandung Barat
          "PADALARANG": "Kabupaten Bandung Barat", "NGAMPRAH": "Kabupaten Bandung Barat", "LEMBANG": "Kabupaten Bandung Barat",
          "PARONGPONG": "Kabupaten Bandung Barat", "BATUJAJAR": "Kabupaten Bandung Barat", "CIPATAT": "Kabupaten Bandung Barat",
          "CIHAMPELAS": "Kabupaten Bandung Barat", "CIKALONGWETAN": "Kabupaten Bandung Barat", "CILILIN": "Kabupaten Bandung Barat",
          "CISARUA": "Kabupaten Bandung Barat", "CIPEUNDEUY": "Kabupaten Bandung Barat", "SAGULING": "Kabupaten Bandung Barat",
          "SINDANGKERTA": "Kabupaten Bandung Barat", "GUNUNGHALU": "Kabupaten Bandung Barat", "RONGGA": "Kabupaten Bandung Barat",
          // Kab Bandung
          "SOREANG": "Kabupaten Bandung", "BALEENDAH": "Kabupaten Bandung", "DAYEUHKOLOT": "Kabupaten Bandung",
          "BOJONGSOANG": "Kabupaten Bandung", "MARGAASIH": "Kabupaten Bandung", "MARGAHAYU": "Kabupaten Bandung",
          "KATAPANG": "Kabupaten Bandung", "BANJARAN": "Kabupaten Bandung", "RANCAEKEK": "Kabupaten Bandung",
          "CILEUNYI": "Kabupaten Bandung", "CIMENYAN": "Kabupaten Bandung", "CILENGKRANG": "Kabupaten Bandung",
          "CANGKUANG": "Kabupaten Bandung", "CIPARAY": "Kabupaten Bandung", "MAJALAYA": "Kabupaten Bandung",
          "SOLOKANJERUK": "Kabupaten Bandung", "PASEH": "Kabupaten Bandung", "PANGALENGAN": "Kabupaten Bandung",
          "KUTAWARINGIN": "Kabupaten Bandung", "ARJASARI": "Kabupaten Bandung", "PAMEUNGPEUK": "Kabupaten Bandung",
          "CICALENGKA": "Kabupaten Bandung", "CIWIDEY": "Kabupaten Bandung", "PASIRJAMBU": "Kabupaten Bandung",
          "RANCABALI": "Kabupaten Bandung", "PACET": "Kabupaten Bandung", "IBUN": "Kabupaten Bandung",
          "NAGREG": "Kabupaten Bandung", "KERTASARI": "Kabupaten Bandung", "CIMAUNG": "Kabupaten Bandung",
          "CIKANCUNG": "Kabupaten Bandung"
      };
      const kabKotaName = KAB_KOTA_MAP[namaKecamatan.toUpperCase()] || 'Jawa Barat';
      
      // 3. Tarik polygon wilayah untuk tiap kelurahan
      for (let i = 0; i < kelurahanList.length; i++) {
          let kel = kelurahanList[i];
          let k = kelurahanMap[kel];
          k.geojson = null;

          // Prioritaskan polygon asli jika sudah ada di cache
          if (cachedGeo[kel] && (cachedGeo[kel].type === 'Polygon' || cachedGeo[kel].type === 'MultiPolygon')) {
              k.geojson = cachedGeo[kel];
          } else {
              // Jika di cache belum ada atau masih bertipe Point, set Point sebagai fallback sementara
              if (cachedGeo[kel]) {
                  k.geojson = cachedGeo[kel];
              } else if (k.lats.length > 0 && k.lngs.length > 0) {
                  let avgLat = k.lats.reduce((a, b) => a + b, 0) / k.lats.length;
                  let avgLng = k.lngs.reduce((a, b) => a + b, 0) / k.lngs.length;
                  k.geojson = { "type": "Point", "coordinates": [avgLng, avgLat] };
              }

              // Upayakan batas wilayah Polygon administratif asli dari Nominatim jika belum ada
              try {
                  let query1 = `${kel}, ${k.kecamatan}, ${kabKotaName}, Jawa Barat, Indonesia`;
                  let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&countrycodes=id&q=${encodeURIComponent(query1)}`);
                  let geoJsonData = await res.json();
                  let adminBoundary = geoJsonData.find(d => 
                      (d.class === 'boundary' || d.osm_type === 'relation' || d.type === 'administrative') &&
                      d.class !== 'building' && d.type !== 'building'
                  );
                  
                  if (adminBoundary && adminBoundary.geojson && (adminBoundary.geojson.type === 'Polygon' || adminBoundary.geojson.type === 'MultiPolygon')) {
                      k.geojson = adminBoundary.geojson;
                      newGeoCache.push({ kecamatan: k.kecamatan, kelurahan: kel, geojson: k.geojson });
                  }
              } catch(e) {}
          }
          
          groupedData.push({
              kelurahan: k.kelurahan,
              kecamatan: k.kecamatan,
              unit_count: k.unit_count,
              cars: k.carsList.join('||'),
              geojson: k.geojson
          });
      }

      // 4. Tarik polygon wilayah untuk Kecamatan (Batas Luar)
      let kecamatanGeojson = null;
      if (cachedGeo["KECAMATAN_BOUNDARY"]) {
          kecamatanGeojson = cachedGeo["KECAMATAN_BOUNDARY"];
      } else {
          document.getElementById('loadingMapText').textContent = `Mencari batas luar Kecamatan ${namaKecamatan}...`;
          try {
              let queryKec = `${namaKecamatan}, ${kabKotaName}, Jawa Barat, Indonesia`;
              let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&countrycodes=id&q=${encodeURIComponent(queryKec)}`);
              let geoJsonData = await res.json();
              
              let adminBoundary = geoJsonData.find(d => 
                  (d.class === 'boundary' || d.type === 'administrative') &&
                  d.class !== 'building' && d.type !== 'building' &&
                  (d.geojson && (d.geojson.type === 'Polygon' || d.geojson.type === 'MultiPolygon'))
              );
              if (adminBoundary && adminBoundary.geojson) {
                  kecamatanGeojson = adminBoundary.geojson;
                  newGeoCache.push({ kecamatan: namaKecamatan, kelurahan: "KECAMATAN_BOUNDARY", geojson: kecamatanGeojson });
              }
          } catch(e) {}
      }

      // 5. Dynamic Voronoi fallback jika ada kelurahan yang belum memiliki Polygon
      let missingPoly = groupedData.filter(g => !g.geojson || (g.geojson.type !== 'Polygon' && g.geojson.type !== 'MultiPolygon'));
      if (missingPoly.length > 0 && kecamatanGeojson && kecamatanGeojson.coordinates && kecamatanGeojson.coordinates[0]) {
          let baseBoundary = kecamatanGeojson.coordinates[0];
          let seeds = {};
          groupedData.forEach(g => {
              let lat = 0, lng = 0;
              if (g.geojson && g.geojson.type === 'Point') {
                  lng = g.geojson.coordinates[0];
                  lat = g.geojson.coordinates[1];
              } else {
                  let km = kelurahanMap[g.kelurahan];
                  if (km && km.lats.length > 0) {
                      lat = km.lats.reduce((a, b) => a + b, 0) / km.lats.length;
                      lng = km.lngs.reduce((a, b) => a + b, 0) / km.lngs.length;
                  }
              }
              if (lat && lng) seeds[g.kelurahan] = [lng, lat];
          });
          
          let generatedCells = generateClientVoronoi(seeds, baseBoundary);
          groupedData.forEach(g => {
              if ((!g.geojson || g.geojson.type === 'Point') && generatedCells[g.kelurahan]) {
                  g.geojson = { "type": "Polygon", "coordinates": [generatedCells[g.kelurahan]] };
              }
          });
      }

      if (newGeoCache.length > 0) {
          fetch('../api/api_polreg_geo.php', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newGeoCache) });
      }

      document.getElementById('loadingMap').style.display = 'none';
      renderMarkers(groupedData, kecamatanGeojson);
    }

    function renderMarkers(dataToRender, kecamatanGeojson) {
      if(!layerGroup) return;
      
      // BERSIHKAN layer lama agar lingkaran tidak menumpuk berkali-kali!
      layerGroup.clearLayers();

      // Ambil daftar kelurahan yang unik dari total mapData
      let uniqueKelurahan = [...new Set(mapData.map(item => item.kelurahan))].filter(Boolean);

      // Buat penampung khusus untuk titik data kelurahan agar zoom map hanya fokus ke data
      let dataBounds = [];
      let kecLayer = null;

      // 1. Gambar batas luar Kecamatan terlebih dahulu agar posisinya ada di bawah layer kelurahan
      if (kecamatanGeojson) {
          kecLayer = L.geoJSON(kecamatanGeojson, {
              style: function (feature) {
                  return {
                      fillColor: 'transparent',
                      color: '#0f172a', // Garis pinggir gelap/tegas
                      weight: 3.5, // Garis lebih tebal untuk membedakan dengan kelurahan
                      opacity: 0.9,
                      fillOpacity: 0
                  };
              }
          });
          
          let kecPopup = `
              <div style="font-size:14px; font-weight:bold; color:#0f172a; text-transform:uppercase;">
                  Kecamatan ${namaKecamatan}
              </div>
          `;
          kecLayer.bindPopup(kecPopup);
          kecLayer.addTo(layerGroup);
      }
      
      // Palette warna cerah yang bervariasi
      const palette = [
          '#e11d48', '#2563eb', '#ea580c', '#16a34a', '#8b5cf6',
          '#d97706', '#0d9488', '#be123c', '#c026d3', '#4f46e5',
          '#65a30d', '#0284c7', '#f43f5e', '#14b8a6', '#f59e0b',
          '#4338ca', '#9333ea', '#db2777', '#dc2626'
      ];
      
      let kelurahanColors = {};
      let legendHtml = '';
      
      uniqueKelurahan.forEach((kel, index) => {
          let color = palette[index % palette.length];
          kelurahanColors[kel] = color;
          legendHtml += `<div style="display: flex; align-items: center; gap: 5px;"><span style="display:inline-block; width:14px; height:14px; border-radius:50%; background:${color};"></span> ${kel}</div>`;
      });
      
      const legendDiv = document.getElementById('mapLegend');
      const containerDiv = document.getElementById('kelurahanLegendContainer');
      if (uniqueKelurahan.length > 0 && containerDiv) {
          containerDiv.innerHTML = legendHtml;
          legendDiv.style.display = 'block';
      } else if (legendDiv) {
          legendDiv.style.display = 'none';
      }
      
      dataToRender.forEach(item => {
          let carsArray = (item.cars || '').split('||');
          
          // Kelompokkan mobil berdasarkan Merk (kata pertama) untuk di popup saja
          let groupedCars = {};
          carsArray.forEach(carName => {
              if(!carName.trim()) return;
              let merk = carName.trim().split(' ')[0].toUpperCase();
              groupedCars[merk] = (groupedCars[merk] || 0) + 1;
          });

          // Urutkan merk sesuai pilihan sort (Terbanyak, Paling Sedikit, Sesuai Abjad)
          let sortedMerks = Object.keys(groupedCars);
          if (currentSortOrder === 'asc') {
              sortedMerks.sort((a, b) => groupedCars[a] - groupedCars[b] || a.localeCompare(b));
          } else if (currentSortOrder === 'alpha') {
              sortedMerks.sort((a, b) => a.localeCompare(b));
          } else {
              sortedMerks.sort((a, b) => groupedCars[b] - groupedCars[a] || a.localeCompare(b));
          }

          let carTextHtml = '<div style="margin-top: 6px; display: flex; flex-direction: column; gap: 4px;">';
          sortedMerks.forEach(merk => {
              carTextHtml += `<div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; padding: 5px 8px; border-radius: 6px; font-size: 11px;">
                                <strong style="color:#334155;">${merk}</strong>
                                <span style="color:#e11d48; font-weight:600;">${groupedCars[merk]} Unit</span>
                              </div>`;
          });
          carTextHtml += '</div>';
          
          let circleColor = kelurahanColors[item.kelurahan] || "#64748b";

          let popupContent = `
              <div style="font-size:12px;">
                  <strong style="font-size:15px; color:${circleColor}; text-transform:uppercase;">Kelurahan ${item.kelurahan}</strong><br>
                  Kec. ${item.kecamatan}<br>
                  <hr style="margin:5px 0;">
                  <b style="font-size: 13px;">Total: ${item.unit_count} Unit</b><br>
                  <div style="max-height:160px; overflow-y:auto; margin-top:4px; padding-right:8px;">
                      ${carTextHtml}
                  </div>
              </div>
          `;

          if (item.geojson) {
              let isPolygon = (item.geojson.type === 'Polygon' || item.geojson.type === 'MultiPolygon');
              
              // Menggambar bentuk wilayah (Polygon) atau Titik Elegan (Point)
              let layer = L.geoJSON(item.geojson, {
                  style: function (feature) {
                      return {
                          fillColor: circleColor,
                          color: isPolygon ? '#ffffff' : circleColor,
                          weight: isPolygon ? 2.5 : 2,
                          opacity: 1,
                          fillOpacity: isPolygon ? 0.45 : 0.85
                      };
                  },
                  pointToLayer: function (feature, latlng) {
                      // Radius proporsional dengan jumlah unit terdaftar (jika fallback ke Point)
                      let r = Math.min(22, Math.max(9, Math.round(8 + Math.log10(item.unit_count + 1) * 6)));
                      return L.circleMarker(latlng, {
                          radius: r,
                          fillColor: circleColor,
                          color: "#ffffff",
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 0.85
                      });
                  }
              });

              if (isPolygon) {
                  layer.on('mouseover', function (e) {
                      const l = e.target;
                      if (l.setStyle) {
                          l.setStyle({
                              weight: 3.5,
                              color: '#0f172a',
                              fillOpacity: 0.65
                          });
                      }
                  });
                  layer.on('mouseout', function (e) {
                      const l = e.target;
                      if (l.setStyle) {
                          l.setStyle({
                              weight: 2.5,
                              color: '#ffffff',
                              fillOpacity: 0.45
                          });
                      }
                  });
              }

              layer.bindTooltip(`<b>Kel. ${item.kelurahan}</b><br><span style="color:${circleColor}; font-weight:700;">${item.unit_count} Unit Terdaftar</span>`, {
                  permanent: false,
                  sticky: isPolygon,
                  direction: 'top',
                  opacity: 0.95
              });
              layer.bindPopup(popupContent);
              layer.addTo(layerGroup);
              dataBounds.push(layer);
          }
      });

      // Pastikan garis batas luar kecamatan tetap terlihat jelas di atas polygon kelurahan
      if (kecLayer && kecLayer.bringToFront) {
          kecLayer.bringToFront();
      }

      // Peta otomatis fokus (zoom) rapi ke batas kecamatan dan titik-titik kelurahan
      if (kecLayer) {
          let fullBounds = kecLayer.getBounds();
          if (dataBounds.length > 0) {
              dataBounds.forEach(l => {
                  if (l.getBounds) fullBounds.extend(l.getBounds());
                  else if (l.getLatLng) fullBounds.extend(l.getLatLng());
              });
          }
          map.fitBounds(fullBounds, {padding: [30, 30], maxZoom: 15});
      } else if (dataBounds.length > 0) {
          const group = new L.featureGroup(dataBounds);
          map.fitBounds(group.getBounds(), {padding: [30, 30], maxZoom: 15});
      }
    }

    document.addEventListener('DOMContentLoaded', initPage);
