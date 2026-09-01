// ======================================================
    // DATA & STATE
    // ======================================================
    let allData = [];          // raw dari API
    let activeTab = 'semua';   // filter paket
    let activeOrderType = 'reguler'; // filter kategori order
    let searchVal = '';        // kata pencarian
    
    const modelToCategory = {
        'agya': 'Hatchback', 'yaris': 'Hatchback', 'gr yaris': 'Hatchback', 'gr corolla': 'Hatchback',
        'calya': 'MPV', 'avanza': 'MPV', 'veloz': 'MPV', 'sienta': 'MPV', 'innova': 'MPV', 'zenix': 'MPV', 'reborn': 'MPV', 'voxy': 'MPV', 'alphard': 'MPV', 'vellfire': 'MPV', 'majesty': 'MPV',
        'raize': 'SUV', 'rush': 'SUV', 'yaris cross': 'SUV', 'corolla cross': 'SUV', 'cross': 'SUV', 'fortuner': 'SUV', 'bz4x': 'SUV', 'land cruiser': 'SUV', 'c-hr': 'SUV', 'rav4': 'SUV', 'urban cruiser': 'SUV',
        'vios': 'Sedan', 'corolla altis': 'Sedan', 'altis': 'Sedan', 'camry': 'Sedan', 'gr 86': 'Sedan', 'supra': 'Sedan', 'prius': 'Sedan',
        'hilux': 'Commercial', 'single cabin': 'Commercial', 'double cabin': 'Commercial', 'hiace': 'Commercial', 'hi ace': 'Commercial', 'dyna': 'Commercial', 'rangga': 'Commercial'
    };

    function getBodyType(modelName) {
        const m = modelName.toLowerCase();
        for (const [key, cat] of Object.entries(modelToCategory)) {
            if (m.includes(key)) return cat;
        }
        return 'Lainnya';
    }

    const formatRp = (n) => {
      if (!n || n === 0) return '—';
      return 'Rp ' + Number(n).toLocaleString('id-ID');
    };

    const formatRpShort = (n) => {
      if (!n || n === 0) return '—';
      if (n >= 1_000_000_000) {
        const miliar = n / 1_000_000_000;
        return 'Rp ' + miliar.toFixed(2).replace(/\.?0+$/, '') + ' M';
      }
      const juta = n / 1_000_000;
      return 'Rp ' + juta.toFixed(1).replace('.0', '') + ' Jt';
    };

    // State untuk Multi-Select & Master Varian
    let isMultiSelectMode = false;
    let selectedMultiVariants = new Map(); // vKey -> variant object
    let masterVariantsMap = {};            // vKey -> variant object

    function getVariantKey(v) {
      const m = (v.model || '').trim();
      const p = (v.tipe_paket || v.nama || '').trim();
      const k = (v.kategori_order || 'Reguler').trim();
      return `${m}__${p}__${k}`.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    }

    function formatTransmisiLabel(trans) {
      if (!trans) return '';
      const t = String(trans).toUpperCase().trim();
      if (t === 'MT' || t === 'M/T') return 'Manual';
      if (t === 'AT' || t === 'A/T' || t === 'CVT') return 'Auto';
      return trans;
    }

    // Helper format blok harga per tipe mobil (menampilkan Manual & Auto sekaligus jika tersedia, tanpa kategori)
    function formatSingleVariantPriceBlock(v) {
      const modelName = (v.model || '').trim();
      const tipeName = (v.tipe_paket || v.nama || '').trim();
      const fullName = tipeName.toLowerCase().includes(modelName.toLowerCase()) ? tipeName : `${modelName} ${tipeName}`;

      const hasMT = v.harga_mt && Number(v.harga_mt) > 0;
      const hasAT = v.harga_at && Number(v.harga_at) > 0;

      let lines = [];
      lines.push(`🚗 *${fullName}*`);

      if (hasMT && hasAT) {
        lines.push(`💰 *Harga OTR*:`);
        lines.push(`   • Manual : *${formatRp(v.harga_mt)}*`);
        lines.push(`   • Auto   : *${formatRp(v.harga_at)}*`);
      } else if (hasMT) {
        lines.push(`💰 *Harga OTR*: *${formatRp(v.harga_mt)}* (Manual)`);
      } else if (hasAT) {
        lines.push(`💰 *Harga OTR*: *${formatRp(v.harga_at)}* (Auto)`);
      } else if (v.harga && Number(v.harga) > 0) {
        lines.push(`💰 *Harga OTR*: *${formatRp(v.harga)}*`);
      } else {
        lines.push(`💰 *Harga OTR*: Hubungi Sales Consultant`);
      }

      return lines.join('\n');
    }

    function isModelAllSelected(modelName) {
      let modelVariants = allData.filter(i => {
        const isSameModel = (i.model || '').toLowerCase() === (modelName || '').toLowerCase();
        const k = (i.kategori_order || '').toLowerCase();
        return isSameModel && (k.includes('reguler') || k.includes('regular'));
      });
      if (modelVariants.length === 0) {
        modelVariants = allData.filter(i => (i.model || '').toLowerCase() === (modelName || '').toLowerCase());
      }
      if (modelVariants.length === 0) return false;
      return modelVariants.every(i => selectedMultiVariants.has(getVariantKey(i)));
    }

    // ======================================================
    // RENDER ENGINE
    // ======================================================
    function render() {
      const container = document.getElementById('pricelistContainer');
      const badge = document.getElementById('resultBadge');

      // Filter by paket tab
      let filtered = allData.filter(item => {
        // Filter by Order Type (Reguler, Prime, NTCO)
        const orderKat = (item.kategori_order || '').toLowerCase();
        
        if (activeOrderType === 'reguler' && !orderKat.includes('reguler') && !orderKat.includes('regular')) return false;
        if (activeOrderType === 'prime' && !orderKat.includes('prime')) return false;
        if (activeOrderType === 'ntco' && !orderKat.includes('ntco')) return false;

        // Filter by Body Type (MPV, SUV, etc)
        const bodyType = getBodyType(item.model).toLowerCase();
        if (activeTab !== 'semua' && activeTab !== bodyType) return false;
        
        return true;
      });

      // Filter by search
      if (searchVal) {
        filtered = filtered.filter(item =>
          item.model.toLowerCase().includes(searchVal) ||
          item.nama.toLowerCase().includes(searchVal) ||
          (item.tipe_paket || '').toLowerCase().includes(searchVal)
        );
      }

      // Update badge
      const modelSet = new Set(filtered.map(i => i.model));
      badge.innerHTML = `<i class="fa-solid fa-circle-check" style="color:var(--green-success);"></i> ${modelSet.size} Model, ${filtered.length} Varian`;

      if (filtered.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-car-burst"></i>
            <p>Tidak ada model yang cocok.<br><small style="font-weight:500;font-size:11px;">Coba kata kunci lain atau ubah filter.</small></p>
          </div>`;
        return;
      }

      // Group by Body Type → then by model
      const byKategori = {};
      filtered.forEach(item => {
        const kat = getBodyType(item.model);
        if (!byKategori[kat]) byKategori[kat] = {};
        if (!byKategori[kat][item.model]) byKategori[kat][item.model] = [];
        byKategori[kat][item.model].push(item);
      });

      // Kategori icon map
      const katIcon = {
        hatchback: 'fa-car-side',
        mpv: 'fa-van-shuttle',
        suv: 'fa-car',
        sedan: 'fa-car',
        commercial: 'fa-truck-fast',
        lainnya: 'fa-tag'
      };

      let html = '';
      let delay = 0;

      for (const kat in byKategori) {
        const modelMap = byKategori[kat];
        const modelCount = Object.keys(modelMap).length;
        const varianCount = filtered.filter(i => getBodyType(i.model) === kat).length;
        const katKey = kat.toLowerCase();
        const icon = katIcon[katKey] || 'fa-tag';

        html += `
          <div class="kat-section">
            <div class="kat-header">
              <div class="kat-header-icon"><i class="fa-solid ${icon}"></i></div>
              <span class="kat-header-title">${kat.charAt(0).toUpperCase() + kat.slice(1)}</span>
              <span class="kat-header-count">${modelCount} Model</span>
            </div>`;

        let modelDelay = 0;
        for (const modelName in modelMap) {
          const varians = modelMap[modelName];
          // Sort varians by harga asc
          varians.sort((a, b) => (a.harga || 0) - (b.harga || 0));

          const minHarga = varians.find(v => v.harga > 0)?.harga || 0;
          const imgSrc = varians[0]?.img || '';
          const cardId = `card-${kat}-${modelName}`.replace(/\s+/g, '-');
          const cleanModelName = modelName.replace(/'/g, "\\'");

          html += `
            <div class="model-card" id="${cardId}" style="animation-delay:${modelDelay * 0.05}s;" onclick="toggleCard('${cardId}')">
              <div class="model-header">
                <img class="model-thumb" src="${imgSrc}" alt="${modelName}" style="cursor:pointer;"
                  onclick="event.stopPropagation(); openLightbox('${imgSrc}')"
                  onerror="this.src='https://placehold.co/160x100/f8fafc/c8102e?text=${encodeURIComponent(modelName)}'">
                <div class="model-info">
                  <div class="model-name">${modelName}</div>
                  <div class="model-meta">
                    <span class="model-price-start">
                      ${minHarga > 0 ? 'Mulai ' + formatRpShort(minHarga) : 'Lihat paket'}
                    </span>
                    <span class="model-varian-count">${varians.length} Paket</span>
                  </div>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button type="button" class="btn-card-select-all ${isModelAllSelected(modelName) ? 'active' : ''}" 
                          id="btn-select-all-${cardId}" data-model="${modelName}"
                          onclick="event.stopPropagation(); toggleSelectAllModel('${cardId}', '${cleanModelName}')" 
                          title="Pilih seluruh tipe ${modelName}">
                    <i class="${isModelAllSelected(modelName) ? 'fa-solid fa-circle-check' : 'fa-regular fa-square-check'}"></i> 
                    <span class="hide-mobile-sm">${isModelAllSelected(modelName) ? 'Terpilih' : 'Pilih Semua'}</span>
                  </button>
                  <i class="fa-solid fa-chevron-down model-chevron"></i>
                </div>
              </div>

              <div class="varian-list" onclick="event.stopPropagation()">`;

          varians.forEach((v, index) => {
            const paket = v.tipe_paket || v.nama || '—';
            const hasMT = v.harga_mt && v.harga_mt > 0;
            const hasAT = v.harga_at && v.harga_at > 0;
            const kat = v.kategori_order || 'Reguler';

            const vKey = getVariantKey(v);
            masterVariantsMap[vKey] = v;
            const isChecked = selectedMultiVariants.has(vKey);

            // Determine default transmisi
            let defaultTrans = '';
            let defaultHarga = 0;
            let defaultKode = '';
            let defaultAdd = '';
            let defaultAcc = '';
            
            if (hasMT && hasAT) { defaultTrans = 'MT'; defaultHarga = v.harga_mt; defaultKode = v.kode_tipe_mt; defaultAdd = v.additional_mt; defaultAcc = v.accessories_mt; }
            else if (hasMT) { defaultTrans = 'MT'; defaultHarga = v.harga_mt; defaultKode = v.kode_tipe_mt; defaultAdd = v.additional_mt; defaultAcc = v.accessories_mt; }
            else if (hasAT) { defaultTrans = 'AT'; defaultHarga = v.harga_at; defaultKode = v.kode_tipe_at; defaultAdd = v.additional_at; defaultAcc = v.accessories_at; }
            
            const hasPrice = defaultHarga > 0;
            const cleanPaketName = paket.replace(/'/g, "\\'");
            const rowId = ('row-' + cardId + '-' + index).replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();

            let toggleHtml = '';
            if (hasMT && hasAT) {
                toggleHtml = `
                    <div class="trans-toggle" onclick="event.stopPropagation(); toggleTrans(this, '${cardId}', '${rowId}', '${cleanModelName}', '${cleanPaketName}', '${kat}', ${v.harga_mt}, ${v.harga_at}, '${v.kode_tipe_mt || ''}', '${v.kode_tipe_at || ''}', '${(v.additional_mt || '').replace(/'/g, "\\'")}', '${(v.additional_at || '').replace(/'/g, "\\'")}', '${(v.accessories_mt || '').replace(/'/g, "\\'")}', '${(v.accessories_at || '').replace(/'/g, "\\'")}', '${vKey}')">
                        <div class="trans-btn active" data-trans="MT">MT</div>
                        <div class="trans-btn" data-trans="AT">AT</div>
                    </div>
                `;
            } else if (hasMT) {
                toggleHtml = `<span class="varian-badge badge-mt"><i class="fa-solid fa-gear" style="font-size:9px;margin-right:3px;"></i>MT (Manual)</span>`;
            } else if (hasAT) {
                toggleHtml = `<span class="varian-badge badge-at"><i class="fa-solid fa-rotate" style="font-size:9px;margin-right:3px;"></i>AT (Auto)</span>`;
            }

            const clickHandler = hasPrice
              ? `onclick="selectPricelistVarianRow(event, this, '${cardId}', '${rowId}', '${cleanModelName}', '${cleanPaketName}', '${kat}')"`
              : '';
            const isClickable = hasPrice ? 'clickable-varian' : '';

            html += `
                <div class="varian-item ${isClickable} ${isChecked ? 'is-checked-varian' : ''}" id="${rowId}" data-vkey="${vKey}" ${clickHandler} data-trans="${defaultTrans}" data-harga="${defaultHarga}">
                  <div class="varian-check-col" onclick="toggleVarianCheckbox(event, '${vKey}')" title="Pilih tipe ini">
                    <div class="varian-custom-check" id="chk-${vKey}">
                      <i class="fa-solid fa-check"></i>
                    </div>
                  </div>
                  <div class="varian-left">
                    <div class="varian-paket-name">${paket}</div>
                    ${defaultKode ? `<div id="kode-${rowId}" style="font-size:10px; color:var(--primary-blue); font-weight:800; letter-spacing:0.5px; margin-top:-2px; margin-bottom:4px;">KODE: ${defaultKode}</div>` : ''}
                    <div class="varian-badges" style="display:flex; align-items:center; gap:6px;">
                      <span class="varian-badge badge-tipe">${kat}</span>
                      ${toggleHtml}
                    </div>
                    <div class="varian-add-acc" style="display:flex; gap:8px; margin-top:8px; font-size:10px;">
                      <div id="add-wrapper-${rowId}" style="display:${defaultAdd ? 'block' : 'none'}; background:#f1f5f9; padding:4px 6px; border-radius:4px; flex:1;">
                        <div style="color:#64748b; font-weight:600; text-transform:lowercase; margin-bottom:2px;">additional</div>
                        <div id="add-${rowId}" style="color:var(--primary-blue); font-weight:700;">${defaultAdd}</div>
                      </div>
                      <div id="acc-wrapper-${rowId}" style="display:${defaultAcc ? 'block' : 'none'}; background:#f1f5f9; padding:4px 6px; border-radius:4px; flex:1;">
                        <div style="color:#64748b; font-weight:600; text-transform:lowercase; margin-bottom:2px;">accessories</div>
                        <div id="acc-${rowId}" style="color:var(--primary-blue); font-weight:700;">${defaultAcc}</div>
                      </div>
                    </div>
                  </div>
                  <div class="varian-price-wrap">
                    <span class="varian-price-label">Harga OTR</span>
                    <span class="varian-price-val" id="price-${rowId}">${hasPrice ? formatRpShort(defaultHarga) : 'Hubungi dealer'}</span>
                  </div>
                </div>`;
          });

          html += `
              </div>
              <div class="deal-btn-wrapper" onclick="event.stopPropagation()" style="padding: 12px 14px; border-top: 1px dashed #e2e8f0; background: #fafcff; display: flex; flex-direction: column; gap: 10px;">
                  <div style="display:flex; gap:10px;">
                    <button id="btn-share-${cardId}" class="btn-share-pricelist" style="
                        flex: 1;
                        padding: 12px;
                        background: #e2e8f0;
                        color: #94a3b8;
                        border: none;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 13px;
                        cursor: not-allowed;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        outline: none;
                    " disabled onclick="executePricelistShare(event, '${cardId}')">
                        <i class="fa-brands fa-whatsapp"></i> Share
                    </button>
                    <button id="btn-deal-${cardId}" class="btn-deal-pricelist" style="
                        flex: 1;
                        padding: 12px;
                        background: #e2e8f0;
                        color: #94a3b8;
                        border: none;
                        border-radius: 10px;
                        font-weight: 700;
                        font-size: 13px;
                        cursor: not-allowed;
                        transition: all 0.2s ease;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 8px;
                        outline: none;
                    " disabled onclick="executePricelistDeal(event, '${cardId}')">
                        <i class="fa-solid fa-handshake"></i> Pilih Varian Terlebih Dahulu
                    </button>
                  </div>
                  <button type="button" class="btn-share-all-model" onclick="shareEntireModel('${cleanModelName}', '${cardId}')" title="Share seluruh tipe ${modelName} sekaligus ke WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> Bagikan Semua Tipe ${modelName} (Manual & Auto)
                  </button>
              </div>
            </div>`;

          modelDelay++;
        }

        html += `</div>`;
        delay++;
      }

      container.innerHTML = html;
      updateMultiShareBar();
    }

    // ======================================================
    // TOGGLE ACCORDION
    // ======================================================
    function toggleCard(id) {
      const card = document.getElementById(id);
      if (!card) return;
      const isExpanded = card.classList.contains('expanded');

      // Close all others in same section (optional: comment out to allow multiple open)
      // card.closest('.kat-section').querySelectorAll('.model-card.expanded').forEach(c => {
      //   if (c !== card) c.classList.remove('expanded');
      // });

      card.classList.toggle('expanded', !isExpanded);
    }

    // ======================================================
    // TAB & FILTER MODAL
    // ======================================================
    let tempOrderType = 'reguler';
    let tempBodyType = 'semua';

    window.openFilterModal = function() {
        tempOrderType = activeOrderType;
        tempBodyType = activeTab;
        
        document.querySelectorAll('#filterOrderGroup .filter-pill').forEach(el => {
            el.classList.toggle('active', el.dataset.val === tempOrderType);
        });
        document.querySelectorAll('#filterBodyGroup .filter-pill').forEach(el => {
            el.classList.toggle('active', el.dataset.val === tempBodyType);
        });
        
        document.getElementById('filterModalOverlay').classList.add('active');
    };

    window.closeFilterModal = function() {
        document.getElementById('filterModalOverlay').classList.remove('active');
    };

    window.closeFilterModalOutside = function(e) {
        if (e.target === document.getElementById('filterModalOverlay')) {
            closeFilterModal();
        }
    };

    window.selectFilterOrder = function(el) {
        document.querySelectorAll('#filterOrderGroup .filter-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        tempOrderType = el.dataset.val;
    };

    window.selectFilterBody = function(el) {
        document.querySelectorAll('#filterBodyGroup .filter-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
        tempBodyType = el.dataset.val;
    };

    window.applyFilter = function() {
        activeOrderType = tempOrderType;
        activeTab = tempBodyType;
        closeFilterModal();
        render();
    };

    window.resetFilterPricelist = function() {
        const defaultOrder = document.querySelector('#filterOrderGroup .filter-pill[data-val="reguler"]');
        if (defaultOrder) selectFilterOrder(defaultOrder);
        
        const defaultBody = document.querySelector('#filterBodyGroup .filter-pill[data-val="semua"]');
        if (defaultBody) selectFilterBody(defaultBody);
        
        applyFilter();
    };

    // ======================================================
    // LOAD FROM API
    // ======================================================
    async function loadPricelist() {
      const badge = document.getElementById('resultBadge');
      const container = document.getElementById('pricelistContainer');

      // Skeleton loading
      container.innerHTML = `
        <div style="display:flex;flex-direction:column;gap:12px;">
          ${[1, 2, 3, 4].map(() => `
            <div class="model-card" style="padding:14px;display:flex;gap:14px;align-items:center;">
              <div class="skeleton" style="width:72px;height:54px;border-radius:10px;flex-shrink:0;"></div>
              <div style="flex:1;">
                <div class="skeleton" style="height:16px;width:50%;margin-bottom:8px;"></div>
                <div class="skeleton" style="height:12px;width:70%;"></div>
              </div>
            </div>`).join('')}
        </div>`;

      try {
        const res = await fetch('../api/api_pricelist.php');
        const json = await res.json();

        if (json.ok && Array.isArray(json.data)) {
          allData = json.data;
          render();
        } else {
          badge.innerHTML = `<i class="fa-solid fa-circle-xmark" style="color:var(--primary-red);"></i> Gagal`;
          container.innerHTML = `
            <div class="empty-state">
              <i class="fa-solid fa-triangle-exclamation"></i>
              <p>${json.message || 'Gagal memuat data pricelist.'}</p>
            </div>`;
        }
      } catch (e) {
        badge.innerHTML = `<i class="fa-solid fa-wifi" style="color:var(--primary-red);"></i> Offline`;
        container.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-server"></i>
            <p>Tidak bisa terhubung ke server.<br><small style="font-size:11px;font-weight:500;">Pastikan XAMPP & MySQL berjalan.</small></p>
          </div>`;
        console.error('Fetch error:', e);
      }
    }

    // ======================================================
    // INIT
    // ======================================================
    document.addEventListener('DOMContentLoaded', () => {
      loadPricelist();

      document.getElementById('searchInput').addEventListener('input', (e) => {
        searchVal = e.target.value.toLowerCase().trim();
        render();
      });
    });
    // ======================================================
    // INFO MODAL ACTIONS
    // ======================================================
    function openInfoModal() {
      document.getElementById('infoModalOverlay').classList.add('active');
    }

    function closeInfoModal() {
      document.getElementById('infoModalOverlay').classList.remove('active');
    }

    // Menutup modal jika area overlay luar di-klik
    function closeInfoModalOutside(e) {
      if (e.target === document.getElementById('infoModalOverlay')) {
        closeInfoModal();
      }
    }

    // ======================================================
    // DEAL PRICELIST ACTIONS
    // ======================================================
    let selectedPricelistMap = {};

    // Helper kirim pesan WhatsApp (Mendukung Web Share API & Link WA Langsung)
    async function sendWhatsAppPayload(text, imgSrc = '', title = 'Pricelist Toyota') {
      let sharedViaApi = false;
      if (imgSrc && navigator.canShare) {
        try {
          const response = await fetch(imgSrc);
          const blob = await response.blob();
          const extension = blob.type.split('/')[1] || 'jpg';
          const file = new File([blob], `toyota-pricelist.${extension}`, { type: blob.type });

          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: title,
              text: text,
              files: [file]
            });
            sharedViaApi = true;
          }
        } catch (err) {
          console.warn("Web Share API tidak didukung atau dibatalkan:", err);
        }
      }

      if (!sharedViaApi) {
        if (imgSrc) {
          text += `\n\nFoto Unit: ` + imgSrc;
        }
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
      }
    }

    // Toggle Mode Pilih Banyak dari Header
    window.toggleMultiSelectMode = function() {
      isMultiSelectMode = !isMultiSelectMode;
      const btn = document.getElementById('btnToggleMultiSelect');
      const lbl = document.getElementById('lblMultiSelect');
      const icon = document.getElementById('iconMultiSelect');

      if (btn) {
        btn.classList.toggle('active', isMultiSelectMode);
      }
      if (lbl) {
        lbl.innerText = isMultiSelectMode ? 'Selesai' : 'Pilih Banyak';
      }
      if (icon) {
        icon.className = isMultiSelectMode ? 'fa-solid fa-check' : 'fa-solid fa-list-check';
      }

      updateMultiShareBar();
    };

    // Update Tampilan Floating Bar Multi-Share
    window.updateMultiShareBar = function() {
      const bar = document.getElementById('multiShareBar');
      const countEl = document.getElementById('msbCount');
      const btnCountEl = document.getElementById('msbBtnCount');
      const total = selectedMultiVariants.size;

      if (!bar) return;

      if (total > 0) {
        bar.style.display = 'block';
        if (countEl) countEl.innerText = `${total}`;
        if (btnCountEl) btnCountEl.innerText = `${total}`;
      } else {
        bar.style.display = 'none';
      }

      // Update status tombol Pilih Semua per model card (khusus varian reguler)
      document.querySelectorAll('.btn-card-select-all').forEach(btn => {
        const model = btn.getAttribute('data-model');
        if (!model) return;
        let modelVariants = allData.filter(i => {
          const isSameModel = (i.model || '').toLowerCase() === model.toLowerCase();
          const k = (i.kategori_order || '').toLowerCase();
          return isSameModel && (k.includes('reguler') || k.includes('regular'));
        });
        if (modelVariants.length === 0) {
          modelVariants = allData.filter(i => (i.model || '').toLowerCase() === model.toLowerCase());
        }
        const allChecked = modelVariants.length > 0 && modelVariants.every(i => selectedMultiVariants.has(getVariantKey(i)));
        btn.classList.toggle('active', allChecked);
        const iconEl = btn.querySelector('i');
        const textEl = btn.querySelector('span');
        if (iconEl) iconEl.className = allChecked ? 'fa-solid fa-circle-check' : 'fa-regular fa-square-check';
        if (textEl) textEl.innerText = allChecked ? 'Terpilih' : 'Pilih Semua';
      });
    };

    // Bersihkan / Reset Semua Pilihan Multi-Select
    window.clearMultiSelection = function() {
      selectedMultiVariants.clear();
      document.querySelectorAll('.varian-item').forEach(el => {
        el.classList.remove('is-checked-varian');
      });
      document.querySelectorAll('.btn-card-select-all').forEach(btn => {
        btn.classList.remove('active');
        const iconEl = btn.querySelector('i');
        const textEl = btn.querySelector('span');
        if (iconEl) iconEl.className = 'fa-regular fa-square-check';
        if (textEl) textEl.innerText = 'Pilih Semua';
      });
      updateMultiShareBar();
    };

    // Toggle Checkbox pada Varian
    window.toggleVarianCheckbox = function(event, vKey) {
      if (event && event.stopPropagation) event.stopPropagation();
      const v = masterVariantsMap[vKey];
      if (!v) return;

      const row = document.querySelector(`.varian-item[data-vkey="${vKey}"]`);

      if (selectedMultiVariants.has(vKey)) {
        selectedMultiVariants.delete(vKey);
        if (row) row.classList.remove('is-checked-varian');
      } else {
        selectedMultiVariants.set(vKey, v);
        if (row) row.classList.add('is-checked-varian');
      }

      updateMultiShareBar();
    };

    // Toggle Pilih Semua Varian pada Satu Model Card (Hanya Varian Reguler)
    window.toggleSelectAllModel = function(cardId, modelName) {
      let modelVariants = allData.filter(i => {
        const isSameModel = (i.model || '').toLowerCase() === modelName.toLowerCase();
        const k = (i.kategori_order || '').toLowerCase();
        return isSameModel && (k.includes('reguler') || k.includes('regular'));
      });

      if (modelVariants.length === 0) {
        modelVariants = allData.filter(i => (i.model || '').toLowerCase() === modelName.toLowerCase());
      }

      if (modelVariants.length === 0) return;

      const allChecked = modelVariants.every(i => selectedMultiVariants.has(getVariantKey(i)));

      modelVariants.forEach(v => {
        const k = getVariantKey(v);
        const row = document.querySelector(`.varian-item[data-vkey="${k}"]`);
        if (allChecked) {
          selectedMultiVariants.delete(k);
          if (row) row.classList.remove('is-checked-varian');
        } else {
          selectedMultiVariants.set(k, v);
          if (row) row.classList.add('is-checked-varian');
        }
      });

      updateMultiShareBar();
    };

    // Bagikan Seluruh Tipe dalam Satu Model ke WhatsApp (Pakai Harga Reguler Saja & Tanpa Kategori)
    window.shareEntireModel = async function(modelName, cardId) {
      let modelVariants = allData.filter(i => {
        const isSameModel = (i.model || '').toLowerCase() === modelName.toLowerCase();
        const k = (i.kategori_order || '').toLowerCase();
        return isSameModel && (k.includes('reguler') || k.includes('regular'));
      });

      // Fallback jika tidak ada tag bertuliskan reguler
      if (modelVariants.length === 0) {
        modelVariants = allData.filter(i => (i.model || '').toLowerCase() === modelName.toLowerCase());
      }

      if (modelVariants.length === 0) return;

      // Deduplikasi tipe paket jika ada nama kembar
      const uniqueMap = new Map();
      modelVariants.forEach(v => {
        const nameKey = (v.tipe_paket || v.nama || '').trim().toLowerCase();
        if (!uniqueMap.has(nameKey)) {
          uniqueMap.set(nameKey, v);
        }
      });
      const uniqueVariants = Array.from(uniqueMap.values());

      // Urutkan varian dari harga terendah
      uniqueVariants.sort((a, b) => (a.harga || 0) - (b.harga || 0));

      let text = `📄 *INFORMASI HARGA OTR TOYOTA ${modelName.toUpperCase()} RESMI* 📄\n` +
                 `📍 Wilayah: Bandung & Jawa Barat\n\n`;

      text += uniqueVariants.map(v => formatSingleVariantPriceBlock(v)).join('\n\n') + '\n\n';
      text += `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `_Dapatkan diskon promo spesial, paket kredit bunga ringan, dan bonus aksesoris khusus pemesanan minggu ini!_\n`;

      if (typeof window.injectSocialSignature === 'function') {
        text = window.injectSocialSignature(text);
      }

      const card = document.getElementById(cardId);
      const imgSrc = card ? card.querySelector('.model-thumb')?.src : (uniqueVariants[0]?.img || '');

      await sendWhatsAppPayload(text, imgSrc, `Pricelist Toyota ${modelName}`);
    };

    // Eksekusi Share Banyak Tipe Terpilih ke WhatsApp
    window.executeMultiShare = async function() {
      if (selectedMultiVariants.size === 0) return;

      const items = Array.from(selectedMultiVariants.values());
      let text = `📄 *INFORMASI HARGA OTR TOYOTA RESMI* 📄\n` +
                 `📍 Wilayah: Bandung & Jawa Barat\n\n`;

      text += items.map(v => formatSingleVariantPriceBlock(v)).join('\n\n') + '\n\n';
      text += `━━━━━━━━━━━━━━━━━━━━━━\n` +
              `_Dapatkan diskon promo spesial, paket kredit bunga ringan, dan bonus aksesoris khusus pemesanan minggu ini!_\n`;

      if (typeof window.injectSocialSignature === 'function') {
        text = window.injectSocialSignature(text);
      }

      const firstItem = items[0];
      const imgSrc = firstItem?.img || '';

      await sendWhatsAppPayload(text, imgSrc, `Pricelist ${items.length} Tipe Toyota`);
    };

    // Klik Baris Varian
    window.selectPricelistVarianRow = function(event, el, cardId, rowId, modelName, variantName, kategori) {
      const vKey = el.getAttribute('data-vkey');
      if (isMultiSelectMode && vKey) {
        toggleVarianCheckbox(event, vKey);
        return;
      }
      const trans = el.getAttribute('data-trans');
      const harga = el.getAttribute('data-harga');
      selectPricelistVarian(event, cardId, rowId, modelName, variantName, trans, harga, kategori, vKey);
    };

    // Toggle Transmisi MT / AT pada Baris Varian
    window.toggleTrans = function(toggleEl, cardId, rowId, modelName, variantName, kategori, hargaMt, hargaAt, kodeMt, kodeAt, addMt, addAt, accMt, accAt, vKey) {
      const row = document.getElementById(rowId);
      if (!row) return;
      
      const btns = toggleEl.querySelectorAll('.trans-btn');
      let newTrans = '';
      let newHarga = 0;
      let newKode = '';
      let newAdd = '';
      let newAcc = '';

      btns.forEach(b => {
          if (!b.classList.contains('active')) {
              newTrans = b.getAttribute('data-trans');
              b.classList.add('active');
          } else {
              b.classList.remove('active');
          }
      });

      if (newTrans === 'MT') {
          newHarga = hargaMt;
          newKode = kodeMt;
          newAdd = addMt;
          newAcc = accMt;
      } else {
          newHarga = hargaAt;
          newKode = kodeAt;
          newAdd = addAt;
          newAcc = accAt;
      }

      row.setAttribute('data-trans', newTrans);
      row.setAttribute('data-harga', newHarga);
      
      const priceVal = row.querySelector('.varian-price-val');
      if (priceVal) {
          priceVal.innerText = formatRpShort(newHarga);
      }
      
      const kodeEl = document.getElementById(`kode-${rowId}`);
      if (kodeEl && newKode) {
          kodeEl.innerText = `KODE: ${newKode}`;
      }

      const addWrapper = document.getElementById(`add-wrapper-${rowId}`);
      const addVal = document.getElementById(`add-${rowId}`);
      if (addWrapper && addVal) {
          if (newAdd) { addVal.innerText = newAdd; addWrapper.style.display = 'block'; }
          else { addWrapper.style.display = 'none'; }
      }

      const accWrapper = document.getElementById(`acc-wrapper-${rowId}`);
      const accVal = document.getElementById(`acc-${rowId}`);
      if (accWrapper && accVal) {
          if (newAcc) { accVal.innerText = newAcc; accWrapper.style.display = 'block'; }
          else { accWrapper.style.display = 'none'; }
      }

      if (row.classList.contains('selected-varian')) {
          selectPricelistVarian({stopPropagation: () => {}}, cardId, rowId, modelName, variantName, newTrans, newHarga, kategori, vKey);
      }
    };

    // Pilih Varian Tunggal untuk Deal & Share
    window.selectPricelistVarian = function(event, cardId, rowId, modelName, variantName, transmisi, harga, kategori, vKey) {
      if (event && event.stopPropagation) event.stopPropagation();
      
      const card = document.getElementById(cardId);
      if (!card) return;
      
      card.querySelectorAll('.varian-item').forEach(el => {
        el.classList.remove('selected-varian');
      });

      const clickedRow = document.getElementById(rowId);
      if (clickedRow) {
        clickedRow.classList.add('selected-varian');
      }

      const rawV = vKey ? masterVariantsMap[vKey] : null;

      selectedPricelistMap[cardId] = {
        model: modelName,
        varian: variantName,
        transmisi: transmisi,
        harga: harga,
        kategori: kategori,
        rawVarian: rawV
      };

      const transLabel = formatTransmisiLabel(transmisi);

      // Enable Deal & Share button
      const dealBtn = document.getElementById(`btn-deal-${cardId}`);
      if (dealBtn) {
        dealBtn.disabled = false;
        dealBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        dealBtn.style.color = '#ffffff';
        dealBtn.style.cursor = 'pointer';
        dealBtn.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.15)';
        dealBtn.innerHTML = `<i class="fa-solid fa-handshake"></i> Deal ${variantName} (${transLabel})`;
      }

      const shareBtn = document.getElementById(`btn-share-${cardId}`);
      if (shareBtn) {
        shareBtn.disabled = false;
        shareBtn.style.background = 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)';
        shareBtn.style.color = '#ffffff';
        shareBtn.style.cursor = 'pointer';
        shareBtn.style.boxShadow = '0 4px 12px rgba(37, 211, 102, 0.15)';
        shareBtn.innerHTML = `<i class="fa-brands fa-whatsapp"></i> Share ${variantName}`;
      }
    };

    // Deal ke deal.html
    window.executePricelistDeal = function(event, cardId) {
      if (event && event.stopPropagation) event.stopPropagation();
      const selection = selectedPricelistMap[cardId];
      if (!selection) return;

      const transLabel = formatTransmisiLabel(selection.transmisi);
      const fullUnitName = `${selection.model} ${selection.varian} (${transLabel})`;
      
      const targetUrl = `deal.html?mobil=${encodeURIComponent(fullUnitName)}&paket=${encodeURIComponent(selection.kategori)}&skema=OTR (Pricelist Cash/Credit)&tdp=0&angsuran=0`;
      window.location.href = targetUrl;
    };

    // Share Varian Tunggal ke WhatsApp (Menyertakan Harga Manual & Auto jika tersedia)
    window.executePricelistShare = async function(event, cardId) {
      if (event && event.stopPropagation) event.stopPropagation();
      const selection = selectedPricelistMap[cardId];
      if (!selection) return;

      const v = selection.rawVarian || {
        model: selection.model,
        tipe_paket: selection.varian,
        kategori_order: selection.kategori,
        harga_mt: selection.transmisi === 'MT' ? selection.harga : 0,
        harga_at: selection.transmisi === 'AT' ? selection.harga : 0,
        harga: selection.harga
      };

      let text = `📄 *INFORMASI HARGA OTR TOYOTA RESMI* 📄\n` +
                 `📍 Wilayah: Bandung & Jawa Barat\n\n` +
                 formatSingleVariantPriceBlock(v) + `\n\n` +
                 `_Dapatkan diskon promo spesial, paket kredit bunga ringan, dan bonus aksesoris khusus pemesanan minggu ini!_\n`;
      
      if (typeof window.injectSocialSignature === 'function') {
        text = window.injectSocialSignature(text);
      }

      const card = document.getElementById(cardId);
      const imgSrc = card ? card.querySelector('.model-thumb')?.src : '';

      await sendWhatsAppPayload(text, imgSrc, `Pricelist ${v.model} ${v.tipe_paket || ''}`);
    };

    // Image Lightbox Functions
    function openLightbox(imgSrc) {
      document.getElementById('lightboxImage').src = imgSrc;
      document.getElementById('imageLightbox').classList.add('active');
      document.body.style.overflow = 'hidden'; 
    }

    function closeLightbox(e) {
      if (e.target.id === 'imageLightbox' || e.target.classList.contains('lightbox-close')) {
        document.getElementById('imageLightbox').classList.remove('active');
        document.body.style.overflow = ''; 
      }
    }

    // Export Pricelist to Image
    function exportPricelist() {
        const btn = document.getElementById('btnExportPricelist');
        const originalIcon = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        
        const container = document.getElementById('pricelistContainer');
        
        // Hide elements not needed in screenshot
        const actionRows = container.querySelectorAll('.action-row');
        actionRows.forEach(row => row.style.display = 'none');
        
        html2canvas(container, {
            scale: 2, // High resolution
            useCORS: true,
            backgroundColor: '#f2f5f9'
        }).then(canvas => {
            // Restore elements
            actionRows.forEach(row => row.style.display = 'flex');
            btn.innerHTML = originalIcon;
            
            // Download logic
            const link = document.createElement('a');
            link.download = `Pricelist_OTR_${new Date().getTime()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error(err);
            actionRows.forEach(row => row.style.display = 'flex');
            btn.innerHTML = originalIcon;
            alert("Gagal mengekspor gambar.");
        });
    }
