let allPromoData = [];
    let selectedUnit = "";
    window.promoStoreData = {};

    document.addEventListener("DOMContentLoaded", () => {
      fetchPromoData();

      document.getElementById('filter-paket').addEventListener('change', applyFilter);

      // Close dropdown when clicking outside
      document.addEventListener('click', function (e) {
        const container = document.getElementById('unitSelectContainer');
        if (container && !container.contains(e.target)) {
          closeUnitDropdown();
        }
      });
    });

    async function fetchPromoData() {
      try {
        const response = await fetch('../api/api_promo.php');
        const data = await response.json();
        if (data.error) { throw new Error(data.error); }

        allPromoData = data;
        populateUnitDropdown(data);
        populateFilter(data);
        renderPromo(data);
      } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('promo-container').innerHTML = `
          <div class="promo-empty"><p>Gagal memuat data dari database.</p></div>`;
      }
    }

    function populateFilter(data) {
      const selectPaket = document.getElementById('filter-paket');
      const packages = [...new Set(data.map(item => item.nama_paket))];
      packages.sort().forEach(paket => {
        const option = document.createElement('option');
        option.value = paket; option.textContent = paket;
        selectPaket.appendChild(option);
      });
    }

    function formatRupiah(angka) {
      if (!angka || isNaN(angka)) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    }

    function renderPromo(data) {
      const container = document.getElementById('promo-container');
      window.promoStoreData = {};

      if (data.length === 0) {
        container.innerHTML = `<div class="promo-empty"><i class="fa-solid fa-box-open"></i> Data tidak ditemukan.</div>`;
        document.getElementById('total-data').innerText = `0 mobil ditemukan`;
        return;
      }

      const groupedByTipeMobil = {};
      data.forEach(item => {
        if (!groupedByTipeMobil[item.tipe_mobil]) groupedByTipeMobil[item.tipe_mobil] = {};
        const paketKey = item.nama_paket + "_" + item.skema_bayar;
        if (!groupedByTipeMobil[item.tipe_mobil][paketKey]) {
          groupedByTipeMobil[item.tipe_mobil][paketKey] = {
            paket: item.nama_paket,
            skema: item.skema_bayar,
            otr: item.otr,
            foto: item.foto || '../image/logo_tunas_toyota.png',
            cicilan_list: []
          };
        }
        groupedByTipeMobil[item.tipe_mobil][paketKey].cicilan_list.push(item);
      });

      let html = '';
      let totalCarsFound = 0;
      let storeCounter = 0;
      const sortedTipeMobil = Object.keys(groupedByTipeMobil).sort();

      sortedTipeMobil.forEach(tipeMobil => {
        const paketList = groupedByTipeMobil[tipeMobil];
        totalCarsFound++;

        html += `
          <div class="car-section">
            <div class="car-title-header">
              <i class="fa-solid fa-car-side" style="color:var(--primary-red, #d32f2f); margin-right:8px;"></i> ${tipeMobil}
            </div>
            <div class="promo-paket-grid">
        `;

        for (const paketKey in paketList) {
          const carData = paketList[paketKey];
          carData.cicilan_list.sort((a, b) => a.tenor - b.tenor);

          const previewItem = carData.cicilan_list[carData.cicilan_list.length - 1];
          const previewAngsuran = previewItem.angsuran || previewItem.angsuran_per_bulan || 0;
          const previewTdp = previewItem.tdp || previewItem.tbp || previewItem.otf || 0;

          const dataKey = 'promo_' + storeCounter++;
          window.promoStoreData[dataKey] = {
            mobil: tipeMobil,
            detail: carData
          };

          // HEADER KARTU MERAH DIRAPIKAN AGAR MENDUKUNG TEKS SANGAT PANJANG
          html += `
          <div class="promo-card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; background: var(--primary-red, #d32f2f); color: #fff; padding: 10px 12px; font-size:12px; font-weight:600; gap:8px;">
              <div style="flex:1; line-height:1.4;"><i class="fa-solid fa-tag" style="margin-right:4px;"></i> ${carData.paket}</div>
              <span style="font-size:10px; background:rgba(255,255,255,0.2); padding:3px 6px; border-radius:3px; white-space:nowrap; margin-top:2px;">${carData.skema}</span>
            </div>

            <div class="main-tenor-preview">
              <div class="main-tenor-title">Mulai Dari</div>
              <div class="main-tenor-price">${formatRupiah(previewAngsuran)} <span style="font-size:11px; font-weight:normal; color:#6c757d;">/bln</span></div>
            </div>

            <button type="button" class="btn-detail-promo" onclick="bukaModal('${dataKey}')">
              Lihat Detail Promo <i class="fa-solid fa-chevron-right" style="font-size:10px; margin-left:6px;"></i>
            </button>
          </div>
          `;
        }
        html += `</div></div>`;
      });

      document.getElementById('total-data').innerText = `${totalCarsFound} tipe mobil ditemukan`;
      container.innerHTML = html;
    }

    let selectedTenorObj = null;

    window.selectTenor = function(index, tenor, angsuran, tdp) {
      const cards = document.querySelectorAll('.modal-tenor-card');
      cards.forEach(card => card.classList.remove('selected'));
      
      const clickedCard = document.getElementById(`tenor-card-${index}`);
      if (clickedCard) {
        clickedCard.classList.add('selected');
      }

      selectedTenorObj = {
        tenor: tenor,
        angsuran: angsuran,
        tdp: tdp
      };

      const dealBtn = document.getElementById('modalDealBtn');
      if (dealBtn) {
        dealBtn.disabled = false;
        dealBtn.style.opacity = '1';
        dealBtn.style.cursor = 'pointer';
        dealBtn.innerHTML = `<i class="fa-solid fa-handshake" style="font-size: 18px;"></i> Deal Konsumen (${tenor} Bulan)`;
      }
    };

    function bukaModal(dataKey) {
      try {
        const pData = window.promoStoreData[dataKey];
        if (!pData) return;

        const tipeMobil = pData.mobil;
        const carData = pData.detail;

        document.getElementById('modalCarTitle').innerText = `${tipeMobil} - ${carData.paket}`;
        document.getElementById('modalSkemaBadge').innerText = carData.skema;


        const srcFoto = carData.foto && carData.foto !== '../images/promo-default.jpg' ? carData.foto : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=500&auto=format&fit=crop';
        document.getElementById('modalPromoImg').src = srcFoto;

        // Reset selected tenor and disable button initially
        selectedTenorObj = null;
        const dealBtn = document.getElementById('modalDealBtn');
        if (dealBtn) {
          dealBtn.disabled = true;
          dealBtn.style.opacity = '0.5';
          dealBtn.style.cursor = 'not-allowed';
          dealBtn.innerHTML = `<i class="fa-solid fa-handshake" style="font-size: 18px;"></i> Pilih Tenor Terlebih Dahulu`;
        }

        let tenorHtml = '';
        carData.cicilan_list.forEach((item, index) => {
          const angsuran = item.angsuran || item.angsuran_per_bulan || 0;
          const tdp = item.tdp || item.tbp || item.otf || 0;

          tenorHtml += `
            <div class="modal-tenor-card" id="tenor-card-${index}" onclick="selectTenor(${index}, ${item.tenor}, ${angsuran}, ${tdp})">
              <div class="modal-tenor-row">
                <span class="t-bulan"><i class="fa-regular fa-calendar-days"></i> ${item.tenor} Bulan</span>
                <span class="t-cicilan">${formatRupiah(angsuran)} <span style="font-size:10px; font-weight:normal; color:#6c757d;">/bln</span></span>
              </div>
              <div class="modal-grid-info">
                <div>
                  <span>TDP (Uang Muka)</span>
                  <strong>${formatRupiah(tdp)}</strong>
                </div>
          `;

          if (item.jhj) {
            tenorHtml += `
                <div>
                  <span>Jaminan Jual</span>
                  <strong>${formatRupiah(item.jhj)}</strong>
                </div>`;
          }
          if (item.angsuran_terakhir) {
            tenorHtml += `
                <div style="grid-column: span 2; margin-top:2px;">
                  <span>Angsuran Terakhir</span>
                  <strong>${formatRupiah(item.angsuran_terakhir)}</strong>
                </div>`;
          }
          tenorHtml += `</div></div>`;
        });
        document.getElementById('modalTenorContainer').innerHTML = tenorHtml;

        document.getElementById('modalDealBtn').onclick = function (e) {
          e.stopPropagation();
          if (!selectedTenorObj) {
            alert('Silakan pilih tenor terlebih dahulu!');
            return;
          }
          const targetUrl = `deal.html?mobil=${encodeURIComponent(tipeMobil)}&paket=${encodeURIComponent(carData.paket)}&skema=${encodeURIComponent(carData.skema)}&tenor=${encodeURIComponent(selectedTenorObj.tenor)}&angsuran=${encodeURIComponent(selectedTenorObj.angsuran)}&tdp=${encodeURIComponent(selectedTenorObj.tdp)}`;
          window.location.href = targetUrl;
        };

        document.getElementById('customPromoModal').classList.add('show-modal');
      } catch (err) {
        console.error("Terjadi masalah saat memuat modal:", err);
      }
    }

    function tutupModal() {
      document.getElementById('customPromoModal').classList.remove('show-modal');
    }

    // Interaksi modern: close modal dengan ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('customPromoModal');
        if (modal && modal.classList.contains('show-modal')) {
          tutupModal();
        }
      }
    });

    function applyFilter() {
      const filterPaket = document.getElementById('filter-paket').value;

      const filtered = allPromoData.filter(item => {
        const matchUnit = selectedUnit === "" || item.tipe_mobil.toLowerCase().includes(selectedUnit.toLowerCase());
        const matchPaket = filterPaket === "" || item.nama_paket === filterPaket;
        return matchUnit && matchPaket;
      });

      renderPromo(filtered);
    }

    // ===== SEARCHABLE SELECT ACTIONS =====
    function toggleUnitDropdown(e) {
      e.stopPropagation();
      document.getElementById('unitSelectContainer').classList.toggle('open');
      if (document.getElementById('unitSelectContainer').classList.contains('open')) {
        document.getElementById('dropdown-search-input').value = "";
        filterDropdownOptions("");
        document.getElementById('dropdown-search-input').focus();
      }
    }

    function closeUnitDropdown() {
      document.getElementById('unitSelectContainer').classList.remove('open');
    }

    function populateUnitDropdown(data) {
      const listEl = document.getElementById('unit-options-list');

      // Get unique full names
      const fullNames = [...new Set(data.map(item => item.tipe_mobil))].sort();

      // Get unique base names (first word of the name, e.g. "Avanza", "Veloz")
      const baseNames = [...new Set(data.map(item => item.tipe_mobil.split(' ')[0]))].sort();

      let html = `
        <div class="dropdown-option active" data-val="" onclick="selectUnit(this, '')">
          <i class="fa-solid fa-car"></i> Semua Unit
        </div>
      `;

      // Add base models
      baseNames.forEach(base => {
        html += `
          <div class="dropdown-option" style="background:#f8fafc; font-weight:700; color:var(--primary-blue);" data-val="${base}" onclick="selectUnit(this, '${base}')">
            <i class="fa-solid fa-layer-group"></i> ${base} (Semua)
          </div>
        `;
      });

      // Add divider
      if (baseNames.length > 0) {
        html += `<div style="height: 1px; background: #eef2f6; margin: 4px 0;"></div>`;
      }

      // Add specific trims
      fullNames.forEach(fullName => {
        html += `
          <div class="dropdown-option" data-val="${fullName}" onclick="selectUnit(this, '${fullName}')">
            <i class="fa-solid fa-car-side"></i> ${fullName}
          </div>
        `;
      });

      listEl.innerHTML = html;
    }

    function updatePaketFilterOptions() {
      const selectPaket = document.getElementById('filter-paket');
      const currentSelectedPaket = selectPaket.value;
      
      // Filter raw data to find packages matching the selected unit
      const matchingItems = allPromoData.filter(item => {
        return selectedUnit === "" || item.tipe_mobil.toLowerCase().includes(selectedUnit.toLowerCase());
      });
      
      // Get unique package names from these matching items
      const availablePackages = [...new Set(matchingItems.map(item => item.nama_paket))].sort();
      
      // Rebuild select options
      selectPaket.innerHTML = '<option value="">Semua Paket</option>';
      availablePackages.forEach(paket => {
        const option = document.createElement('option');
        option.value = paket;
        option.textContent = paket;
        if (paket === currentSelectedPaket) {
          option.selected = true;
        }
        selectPaket.appendChild(option);
      });
      
      // Reset selected package value if it's no longer in the list
      if (currentSelectedPaket && !availablePackages.includes(currentSelectedPaket)) {
        selectPaket.value = "";
      }
    }

    function selectUnit(el, val) {
      selectedUnit = val;

      // Update label
      const label = val ? el.textContent.trim() : "Pilih Unit (Semua)";
      document.getElementById('selected-unit-label').textContent = label;

      // Set active highlight
      document.querySelectorAll('.dropdown-option').forEach(opt => opt.classList.remove('active'));
      el.classList.add('active');

      closeUnitDropdown();
      updatePaketFilterOptions();
      applyFilter();
    }

    function filterDropdownOptions(query) {
      const q = query.toLowerCase().trim();
      const options = document.querySelectorAll('.dropdown-option');
      options.forEach(opt => {
        const text = opt.textContent.toLowerCase();
        if (text.includes(q)) {
          opt.style.display = 'flex';
        } else {
          opt.style.display = 'none';
        }
      });
    }
