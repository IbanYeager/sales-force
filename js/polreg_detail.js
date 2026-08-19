const urlParams = new URLSearchParams(window.location.search);
const namaKecamatan = decodeURIComponent(urlParams.get('kecamatan') || "Coblong");
const tahunPilihDefault = urlParams.get('tahun') || sessionStorage.getItem('polreg_active_year') || "2026";

let currentKategori = 'Teratas';
let activeCarsData = [];
let currentSearchKeyword = '';
let filterTahun = tahunPilihDefault;
let currentSortOrder = 'desc';

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

    async function processAndRenderMapMarkers() {
      document.getElementById('loadingMap').style.display = 'block';
      document.getElementById('loadingMapText').textContent = 'Memuat batas wilayah kelurahan...';

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
      
      // 3. Tarik polygon wilayah untuk tiap kelurahan
      for (let i = 0; i < kelurahanList.length; i++) {
          let kel = kelurahanList[i];
          let k = kelurahanMap[kel];
          k.geojson = null;

          if (cachedGeo[kel]) {
              k.geojson = cachedGeo[kel];
          } else {
              document.getElementById('loadingMapText').textContent = `Mencari batas wilayah Kel. ${kel}...`;
              // Menghapus kata "Kelurahan" dan "Kecamatan" karena sistem OSM Nominatim seringkali lebih presisi jika hanya menggunakan nama aslinya
              let query1 = `${kel}, ${k.kecamatan}, Jawa Barat, Indonesia`;
              try {
                  let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(query1)}`);
                  let geoJsonData = await res.json();
                  
                  // Filter HANYA batas administratif asli (bukan gedung atau jalan yang kebetulan bernama sama)
                  let adminBoundary = geoJsonData.find(d => d.class === 'boundary' || d.osm_type === 'relation');
                  
                  if (adminBoundary && adminBoundary.geojson && (adminBoundary.geojson.type === 'Polygon' || adminBoundary.geojson.type === 'MultiPolygon')) {
                      k.geojson = adminBoundary.geojson;
                      newGeoCache.push({ kecamatan: k.kecamatan, kelurahan: kel, geojson: k.geojson });
                  } else if (k.lats.length > 0 && k.lngs.length > 0) {
                      // Jika batas wilayah tidak ada, hitung TITIK TENGAH (rata-rata) dari letak mobil-mobil yang sesungguhnya di jalanan!
                      let avgLat = k.lats.reduce((a, b) => a + b, 0) / k.lats.length;
                      let avgLng = k.lngs.reduce((a, b) => a + b, 0) / k.lngs.length;
                      k.geojson = { "type": "Point", "coordinates": [avgLng, avgLat] };
                      newGeoCache.push({ kecamatan: k.kecamatan, kelurahan: kel, geojson: k.geojson });
                  }
              } catch(e) {}
              await new Promise(r => setTimeout(r, 1000));
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
          // Mengembalikan kata "Kecamatan" agar Nominatim tidak bingung dan memunculkan batas level Kabupaten/Kota secara keliru
          let queryKec = `Kecamatan ${namaKecamatan}, Jawa Barat, Indonesia`;
          try {
              let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&polygon_geojson=1&q=${encodeURIComponent(queryKec)}`);
              let geoJsonData = await res.json();
              
              let adminBoundary = geoJsonData.find(d => d.class === 'boundary' || d.osm_type === 'relation');
              if (adminBoundary && adminBoundary.geojson && (adminBoundary.geojson.type === 'Polygon' || adminBoundary.geojson.type === 'MultiPolygon')) {
                  kecamatanGeojson = adminBoundary.geojson;
                  newGeoCache.push({ kecamatan: namaKecamatan, kelurahan: "KECAMATAN_BOUNDARY", geojson: kecamatanGeojson });
              }
          } catch(e) {}
          await new Promise(r => setTimeout(r, 1000));
      }

      if (newGeoCache.length > 0) {
          fetch('../api/api_polreg_geo.php', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newGeoCache) });
      }

      document.getElementById('loadingMap').style.display = 'none';
      renderMarkers(groupedData, kecamatanGeojson);
    }

    function renderMarkers(dataToRender, kecamatanGeojson) {
      if(!layerGroup) return;
      
      // BERSIIHKAN layer lama agar lingkaran tidak menumpuk berkali-kali!
      layerGroup.clearLayers();

      // Ambil daftar kelurahan yang unik dari total mapData
      let uniqueKelurahan = [...new Set(mapData.map(item => item.kelurahan))].filter(Boolean);

      // Buat penampung khusus untuk titik data kelurahan agar zoom map hanya fokus ke data, bukan ke bingkai raksasa
      let dataBounds = [];

      // 1. Gambar batas luar Kecamatan terlebih dahulu agar posisinya ada di bawah layer kelurahan
      if (kecamatanGeojson) {
          let kecLayer = L.geoJSON(kecamatanGeojson, {
              style: function (feature) {
                  return {
                      fillColor: 'transparent',
                      color: '#0f172a', // Garis pinggir gelap/tegas
                      weight: 4, // Garis lebih tebal untuk membedakan dengan kelurahan
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
              // Menggambar bentuk wilayah (Polygon) atau Titik Elegan (Point)
              let layer = L.geoJSON(item.geojson, {
                  style: function (feature) {
                      return {
                          fillColor: circleColor,
                          color: circleColor,
                          weight: 2,
                          opacity: 0.8,
                          fillOpacity: 0.4
                      };
                  },
                  pointToLayer: function (feature, latlng) {
                      // Ini secara otomatis akan dipanggil jika datanya adalah Point
                      return L.circleMarker(latlng, {
                          radius: 8,
                          fillColor: circleColor,
                          color: "#ffffff",
                          weight: 2,
                          opacity: 1,
                          fillOpacity: 1
                      });
                  }
              });
              layer.bindPopup(popupContent);
              layer.addTo(layerGroup);
              dataBounds.push(layer);
          }
      });

      // Auto-zoom kembali diaktifkan karena koordinat yang nyasar sudah di-reset.
      // Peta akan otomatis fokus (zoom) HANYA ke wilayah data KELURAHAN yang ada (titik-titiknya saja),
      // sehingga tidak ikut melebarkan zoom ke seluruh batas kecamatan raksasa.
      if (dataBounds.length > 0) {
          const group = new L.featureGroup(dataBounds);
          map.fitBounds(group.getBounds(), {padding: [30, 30], maxZoom: 15});
      }
    }

    document.addEventListener('DOMContentLoaded', initPage);
