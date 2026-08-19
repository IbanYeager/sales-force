let tcoData = [];
let currentModelIndex = 0;
let currentCategory = 'Semua';

async function fetchTCOData() {
  const container = document.getElementById('itemGrid');
  if (container) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1; display:flex; flex-direction:column; align-items:center; padding: 60px 20px; color:var(--text-muted); text-align:center;">
            <div style="width:48px; height:48px; border:3px solid var(--border-color); border-top-color:var(--primary-red); border-radius:50%; animation: spin 0.8s linear infinite; margin-bottom:18px;"></div>
            <p style="font-weight:700; font-size:14px; margin:0; color:var(--text-secondary);">Memuat Katalog Aksesoris...</p>
            <p style="font-weight:500; font-size:12px; margin:6px 0 0; color:var(--text-muted);">Menyiapkan data terbaru</p>
        </div>`;
  }

  try {
    const response = await fetch('../api/api_tco.php');
    const data = await response.json();

    if (Array.isArray(data)) {
      tcoData = data;
      renderModelPills();
      renderCategoryFilter();
      renderItems();
    } else {
      console.error("Format data API salah:", data);
    }
  } catch (error) {
    console.error("Gagal mengambil data TCO:", error);
    if (container) {
      container.innerHTML = `<div style="grid-column: 1 / -1;" class="empty-state"><i class="fa-solid fa-triangle-exclamation"></i><p>Gagal memuat katalog TCO dari database.</p></div>`;
    }
  }
}

function renderModelPills() {
  const container = document.getElementById('modelPills');
  container.innerHTML = '';

  // Map of model keywords to icons
  const modelIcons = {
    'innova': 'fa-solid fa-car-side',
    'fortuner': 'fa-solid fa-truck-monster',
    'voxy': 'fa-solid fa-van-shuttle',
    'hilux': 'fa-solid fa-truck-pickup',
    'agya': 'fa-solid fa-car',
    'rush': 'fa-solid fa-car-rear',
    'yaris': 'fa-solid fa-car',
    'calya': 'fa-solid fa-car-side',
    'avanza': 'fa-solid fa-car-side',
    'raize': 'fa-solid fa-car',
    'land': 'fa-solid fa-truck-monster',
    'gr86': 'fa-solid fa-flag-checkered',
    'gr': 'fa-solid fa-flag-checkered',
    'corolla': 'fa-solid fa-car-side',
    'toyota scents': 'fa-solid fa-spray-can-sparkles',
    'veloz': 'fa-solid fa-car-side',
    'kijang': 'fa-solid fa-truck',
    'alphard': 'fa-solid fa-van-shuttle',
    'camry': 'fa-solid fa-car-side',
    'supra': 'fa-solid fa-flag-checkered'
  };

  function getModelIcon(name) {
    const lower = name.toLowerCase();
    for (const [key, icon] of Object.entries(modelIcons)) {
      if (lower.includes(key)) return icon;
    }
    return 'fa-solid fa-car';
  }

  tcoData.forEach((data, index) => {
    const btn = document.createElement('button');
    btn.className = `pill-btn ${index === currentModelIndex ? 'active' : ''}`;
    
    const itemCount = data.items ? data.items.length : 0;
    const icon = getModelIcon(data.model);
    
    btn.innerHTML = `
      <div class="pill-icon"><i class="${icon}"></i></div>
      <span class="pill-name">${data.model}</span>
      <span class="pill-count">${itemCount} item</span>
    `;
    
    btn.onclick = () => {
      currentModelIndex = index;
      currentCategory = 'Semua'; // Reset category when model changes

      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      renderCategoryFilter();
      renderItems();

      const titleEl = document.getElementById('pdfModelTitle');
      if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-book-open"></i> ${data.model}`;

      renderImage(data.model);
    };
    container.appendChild(btn);
  });

  // Initial render
  if (tcoData.length > 0) {
    renderImage(tcoData[0].model);
  }
}

function getSlug(modelName) {
  let slug = modelName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  if (slug === 'avanza-veloz' || slug === 'avanza-and-veloz') return 'avanza';
  if (slug.includes('hilux') && (slug.includes('cabin') || slug.includes('double'))) return 'hilux';
  if (slug.includes('toyota-scents')) return 'toyota-scents';
  return slug;
}

function renderImage(modelName) {
  const pdfContainer = document.getElementById('pdfContainer');
  if (!pdfContainer) return;

  if (!modelName) {
    pdfContainer.innerHTML = `<div class="empty-state" style="padding: 60px 20px;"><i class="fa-solid fa-image"></i><p>Katalog tidak tersedia untuk model ini.</p></div>`;
    return;
  }

  let slug = getSlug(modelName);

  // Setup images array (handle Toyota Scents special case)
  let images = [`../assets/tco/${slug}.png`];
  if (slug === 'toyota-scents') {
    images = [
      `../assets/tco/toyota-scents.png`,
      `../assets/tco/toyota-scents2.png`
    ];
  }

  // Update the download link
  const downloadBtn = document.getElementById('btnDownloadTco');
  if (downloadBtn) {
    // Remove previous event listener if any (by replacing node or just re-assigning)
    // Since we are adding an inline onclick, we can just set it.
    if (images.length === 1) {
      downloadBtn.href = images[0];
      downloadBtn.download = `TCO_${modelName.replace(/\s+/g, '_')}.png`;
      downloadBtn.onclick = null;
    } else {
      downloadBtn.href = 'javascript:void(0)';
      downloadBtn.removeAttribute('download');
      downloadBtn.onclick = (e) => {
        e.preventDefault();
        images.forEach((imgSrc, idx) => {
          const link = document.createElement('a');
          link.href = imgSrc;
          link.download = `TCO_${modelName.replace(/\s+/g, '_')}_Bagian${idx + 1}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
      };
    }
  }

  let imagesHtml = images.map((imgSrc, index) => {
    return `<img src="${imgSrc}" alt="Katalog ${modelName} ${index + 1}" style="width: 100%; height: auto; display: block; cursor: zoom-in; transition: transform 0.2s;" 
             onclick="openZoom(this.src)"
             onmouseover="this.style.transform='scale(1.02)'"
             onmouseout="this.style.transform='scale(1)'"
             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'empty-state\\' style=\\'padding: 60px 20px;\\'><i class=\\'fa-solid fa-image-slash\\' style=\\'font-size:32px; color:#cbd5e1; margin-bottom:12px;\\'></i><p>Gambar katalog belum tersedia.</p></div>';">`;
  }).join('');

  pdfContainer.innerHTML = `
      <div style="width: 100%; text-align: center; background: #fff; padding: 0;">
        ${imagesHtml}
      </div>
    `;
}

function renderCategoryFilter() {
  const container = document.getElementById('categoryFilter');
  if (!container) return;

  const items = tcoData[currentModelIndex].items;

  // Dapatkan unik kategori
  const categories = ['Semua'];
  items.forEach(item => {
    if (!categories.includes(item.type)) {
      categories.push(item.type);
    }
  });

  // Jika cuma ada 1 jenis (selain 'Semua'), sembunyikan filter
  if (categories.length <= 2) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'flex';
  container.innerHTML = '';

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `cat-pill ${cat === currentCategory ? 'active' : ''}`;
    btn.innerText = cat;
    btn.onclick = () => {
      currentCategory = cat;
      document.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderItems();
    };
    container.appendChild(btn);
  });
}

// Helper: get accent class from type
function getAccentClass(type) {
  const map = {
    'Utility': 'accent-utility',
    'Safety': 'accent-safety',
    'Protection': 'accent-protection',
    'Comfort': 'accent-comfort',
    'Styling': 'accent-styling',
    'Exterior': 'accent-styling',
    'Fragrance': 'accent-fragrance'
  };
  return map[type] || 'accent-default';
}

function getTypeLabelClass(type) {
  const map = {
    'Utility': 'type-label-utility',
    'Safety': 'type-label-safety',
    'Protection': 'type-label-protection',
    'Comfort': 'type-label-comfort',
    'Styling': 'type-label-styling',
    'Exterior': 'type-label-exterior',
    'Fragrance': 'type-label-fragrance'
  };
  return map[type] || 'type-label-default';
}

// Format price for display — extract number and show with prefix
function formatPriceDisplay(priceStr) {
  // If already has "Rp" or is "Hubungi Dealer" etc.
  if (!priceStr) return '<span class="price-prefix">-</span>';
  
  const cleaned = priceStr.replace(/[^\d.,]/g, '').trim();
  if (!cleaned) return `<span style="font-size:11px; font-weight:700; color:var(--text-muted);">${priceStr}</span>`;
  
  // Check if starts with "Mulai" or similar
  const hasPrefix = priceStr.toLowerCase().includes('mulai');
  const prefix = hasPrefix ? 'Mulai ' : '';
  
  return `${prefix}<span class="price-prefix">Rp</span>${cleaned}`;
}

function getPackageParts(item) {
  if (!item || !item.name) return [];
  const name = item.name.toLowerCase();
  const pn = (item.part_number || item.partNumber || '').toUpperCase();

  // Innova Zenix
  if (name.includes('cross over package') || (pn.includes('AC') && pn.includes('AD') && name.includes('pkg a'))) {
    return ['Upper Grill Ornament Modelista', 'Black Outer Mirror Cover', 'Multifunction Box', 'Cargo Net', 'Spare tire cover', 'Premium Horn'];
  }
  if (name.includes('compact package') || (pn.includes('BC') && pn.includes('BD'))) {
    return ['Multifunction Box', 'Storage Organizer', 'Black Outer Mirror Cover', 'Spare tire cover', 'Premium Horn'];
  }
  if (name.includes('package e') && (pn.includes('EA') || name.includes('zenix'))) {
    return ['Seat Cover Private Spec', 'Premium Horn'];
  }
  if (name.includes('lite package') && (name.includes('pkg f') || pn.includes('FC'))) {
    return ['Multifunction Box'];
  }
  if (name.includes('smart car fragrance package 1 scent') || (pn.includes('GA') && pn.includes('GB'))) {
    return ['Multifunction Box', 'Air Fragrance Device Set Zenix', 'Scents NTCO Amber Haven'];
  }

  // Innova Reborn
  if (name.includes('luxury package') || (name.includes('pkg d') && pn.includes('DB'))) {
    return ['Rear Bumper Ornament', 'Rear Bumper Step Guard', 'Premium Horn'];
  }
  if (name.includes('full package') && (name.includes('pkg f') || pn.includes('FA'))) {
    return ['Spare Tire Cover', 'Rear Bumper Ornament', 'Rear Bumper Step Guard', 'Premium Horn'];
  }
  if (name.includes('lite package') && (name.includes('pkg h') || pn.includes('HA'))) {
    return ['Spare Tire Cover'];
  }

  // Calya
  if (name.includes('lux package') && (name.includes('pkg a') || pn === 'AA')) {
    return ['Side Visor', 'Console Box', 'Cargo Net', 'Mud Guard'];
  }
  if (name.includes('stylish package') || (name.includes('pkg c') && pn === 'CA')) {
    return ['Side Visor', 'Foglamp Ornament', 'Door Handle Protector'];
  }
  if (name.includes('primo package') || (name.includes('pkg d') && pn === 'DA')) {
    return ['Cargo Net', 'Mud Guard'];
  }
  if (name.includes('seat cover package') && (name.includes('pkg e') || pn === 'EB')) {
    return ['Seat Cover Value Spec'];
  }
  if (name.includes('lite package') && (name.includes('pkg f') && (pn.includes('FA') || pn.includes('FB')))) {
    return ['Cargo Net'];
  }
  if (name.includes('functional package') || name.includes('pkg g')) {
    return ['Side Visor', 'Console Box', 'Back Camera', 'Mud Guard'];
  }

  // Fortuner
  if (name.includes('style package') && (name.includes('pkg a') || pn.includes('AF'))) {
    return ['Cargo Net', 'Spare Tire Cover', 'Black Door Housing Protector', 'Sporty Outer Mirror Cover', 'Premium Horn'];
  }
  if (name.includes('sporty package') && (name.includes('pkg b') || pn.includes('BF'))) {
    return ['Spare Tire Cover', 'Sporty Door Handle Protector', 'Sporty Door Housing Protector', 'Sporty Outer Mirror Cover', 'Premium Horn'];
  }
  if (name.includes('full spec package') && (name.includes('pkg c') || pn.includes('CD'))) {
    return ['Air Purifier', 'Black Door Housing Protector', 'Black Door Handle Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn', 'DVR'];
  }
  if (name.includes('full spec 4x4 gr-s black') || (name.includes('pkg e') && pn.includes('EA'))) {
    return ['Air Purifier', 'Black Door Housing Protector', 'Black Door Handle Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn'];
  }
  if (name.includes('full spec 4x4 gr-s') || (name.includes('pkg d') && pn.includes('DA'))) {
    return ['Air Purifier', 'Sporty Door Handle Protector', 'Sporty Door Housing Protector', 'Sporty Outer Mirror Cover', 'Spare Tire Cover', 'Cargo Net', 'Premium Horn'];
  }
  if (name.includes('smart car fragrance package 1') && (name.includes('fortuner') || pn.includes('HA'))) {
    return ['Premium Horn', 'Air Fragrance Device Set Fortuner', 'Scents NTCO Amber Haven'];
  }
  if (name.includes('smart car fragrance package 2') && (name.includes('fortuner') || pn.includes('IA'))) {
    return ['Premium Horn', 'Air Fragrance Device Set Fortuner', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper'];
  }

  // Avanza & Veloz
  if (name.includes('utility package') && name.includes('pkg c')) {
    return ['Seat Cover Regular Spec'];
  }
  if (name.includes('lux package') && name.includes('pkg d')) {
    return ['Cargo Net', 'Front grille ornament', 'Side body moulding Gunmetal'];
  }
  if (name.includes('seat cover package') && name.includes('pkg e')) {
    return ['Seat Cover Value Spec'];
  }
  if (name.includes('lite package') && name.includes('pkg g')) {
    return ['Cargo Net'];
  }
  if (name.includes('value package') || name.includes('sfx b')) {
    return ['Smart Car Fragrance', 'Side Visor'];
  }
  if (name.includes('basic package') || name.includes('sfx e')) {
    return ['Cargo Net'];
  }

  // Rush
  if (name.includes('adventure package')) {
    return ['Spare Tire Cover', 'Cargo Net', 'Sporty Outer Mirror Cover'];
  }
  if (name.includes('convenience package')) {
    return ['Spare Tire Cover', 'Cargo Net'];
  }

  // Raize
  if (name.includes('sporty essence package')) {
    return ['Sporty Roof Spoiler', 'GR Sporty Shift Knob', 'Side Visor'];
  }
  if (name.includes('aero scent package')) {
    return ['Sporty Roof Spoiler', 'Air Fragrance Device Single Channel', 'Amber Haven Scent Stick'];
  }
  if (name.includes('smart car fragrance package') && name.includes('raize')) {
    return ['Air Fragrance Device Single Channel', 'Amber Haven Scent Stick'];
  }

  // New Agya
  if (name.includes('stylix max package') || (name.includes('pkg b') && name.includes('gya'))) {
    return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Sporty Roof Spoiler (New)', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  }
  if (name.includes('aerokit & function package') || (name.includes('pkg d') && name.includes('gya'))) {
    return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Back Camera', 'Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  }
  if (name.includes('aerokit package') || (name.includes('pkg e') && name.includes('gya'))) {
    return ['GR Front Aeromudguard', 'GR Side Skirt', 'GR Rear Aeromudguard', 'Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  }
  if (name.includes('advance package') || (name.includes('pkg c') && name.includes('gya'))) {
    return ['Premium Horn', 'DVR'];
  }
  if (name.includes('stylix plus package') || (name.includes('pkg f') && name.includes('gya'))) {
    return ['Sporty Roof Spoiler (New)', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  }
  if (name.includes('basic package') || (name.includes('pkg g') && name.includes('gya'))) {
    return ['Premium Horn', 'T-Emblem, RAD Grille', 'Base, Grille Emblem'];
  }

  // Yaris Cross
  if (name.includes('sporty package') && (name.includes('yaris') || name.includes('pkg a'))) {
    return ['Front Grill ornament', 'Back Door Sporty Ornament', 'Ducktail'];
  }
  if (name.includes('full spec package without dvr') || (name.includes('pkg c') && name.includes('yaris'))) {
    return ['Air Purifier', 'Front Grill ornament', 'Back Door Sporty Ornament', 'Ducktail', 'Cargo Net'];
  }
  if (name.includes('lite package') && (name.includes('yaris') || name.includes('pkg e'))) {
    return ['Cargo Net'];
  }

  // Hilux D-Cab
  if (name.includes('convenience package') && name.includes('hilux')) return ['DVR'];
  if (name.includes('sporty package') && name.includes('hilux')) return ['Sporty Outer Mirror Cover', 'Premium Horn', 'DVR'];
  if (name.includes('advance package') && name.includes('hilux')) return ['Premium Horn', 'Engine Hood Lift Assist'];
  if (name.includes('lift assist package') && name.includes('hilux')) return ['Premium Horn', 'Engine Hood Lift Assist', 'Tail Gate Lift Assist'];

  // Hilux Rangga
  if (name.includes('fleet support package')) return ['Telematics (Gfleet)'];
  if (name.includes('function package') && name.includes('rangga')) return ['Fr Corner Sensor'];
  if (name.includes('operational package')) return ['Bed Liner (3 Way)', 'Fr Corner Sensor'];
  if (name.includes('sme support package')) return ['Telematics (T-Intouch)'];
  if (name.includes('commercial package std')) return ['Cover Glove Box w/o key', 'Side Visor'];
  if (name.includes('commercial package high')) return ['Cover Glove Box w/o key'];

  // Land Cruiser 300
  if (name.includes('full spec custom package') || name.includes('lc300')) {
    return ['Rubber Floor mat', 'E-Mirror', 'Bonnet Protector', 'Air Fragrance Device Set LC300', 'Scents NTCO Oceanic Joy', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper', 'Scents NTCO Sunlit Zest'];
  }
  if (name.includes('function package') && name.includes('lc300')) {
    return ['E-Mirror', 'Rubber Floor mat'];
  }

  // Alphard
  if (name.includes('modellista package') && name.includes('air fragrance')) {
    return ['Front Spoiler Modellista', 'Side Skirt Modellista', 'Rear Skirt Modellista', 'Air Fragrance Device Set Alphard', 'Scents NTCO Oceanic Joy', 'Scents NTCO Amber Haven', 'Scents NTCO Blossom Whisper', 'Scents NTCO Sunlit Zest'];
  }
  if (name.includes('modellista package')) {
    return ['Front Spoiler Modellista', 'Side Skirt Modellista', 'Rear Skirt Modellista'];
  }
  if (name.includes('welcab')) {
    return ['Conversion Welcab Seat'];
  }

  // Voxy
  if (name.includes('modellista aeropart package')) {
    return ['Front Spoiler Modellista', 'Rear Bumper Spoiler Modellista', 'Premium Horn'];
  }
  if (name.includes('modellista full package')) {
    return ['Front Spoiler Modellista', 'Rear Bumper Spoiler Modellista', 'Signature Illumination Grille', 'Premium Horn'];
  }

  // BZ4X
  if (name.includes('wall charger')) {
    return ['Wall Charger (include installation service)'];
  }

  // Generic fallback if part_number has comma separated codes
  if (pn && pn.includes(',')) {
    return pn.split(',').map((c, i) => `Part Item #${i + 1} (Suffix ${c.trim()})`);
  }

  return [];
}

function isPackageItem(item) {
  if (!item) return false;
  const type = (item.type || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  const pn = (item.part_number || item.partNumber || '').trim();

  if (type === 'package' || name.includes('package') || name.includes('paket')) return true;
  if (pn && /^[A-Z]{2}(\s*,\s*[A-Z]{2})*$/i.test(pn)) return true;
  return false;
}

function renderItems() {
  const container = document.getElementById('itemGrid');
  if (!container) return;

  const allItems = tcoData[currentModelIndex].items;

  // Filter items
  const items = currentCategory === 'Semua'
    ? allItems
    : allItems.filter(item => item.type === currentCategory);

  container.innerHTML = '';

  // Update item count badge
  const countBadge = document.getElementById('itemCountBadge');
  if (countBadge) {
    countBadge.textContent = `${items.length} item`;
  }

  // Add animation class re-trigger
  container.classList.remove('fade-in');
  void container.offsetWidth; // trigger reflow
  container.classList.add('fade-in');

  if (items.length === 0) {
    container.innerHTML = `
        <div style="grid-column: 1 / -1;" class="empty-state">
            <i class="fa-solid fa-box-open"></i>
            <p>Tidak ada aksesoris di kategori ini.</p>
        </div>`;
    return;
  }

  items.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'item-card';
    // Staggered animation delay
    card.style.animationDelay = `${index * 0.06}s`;

    // Select color based on type
    let colorClass = 'type-default';
    if (item.type === 'Utility') colorClass = 'type-utility';
    else if (item.type === 'Safety') colorClass = 'type-safety';
    else if (item.type === 'Protection') colorClass = 'type-protection';
    else if (item.type === 'Comfort') colorClass = 'type-comfort';
    else if (item.type === 'Exterior' || item.type === 'Styling') colorClass = 'type-styling';
    else if (item.type === 'Fragrance') colorClass = 'type-fragrance';

    const accentClass = getAccentClass(item.type);
    const typeLabelClass = getTypeLabelClass(item.type);

    const stockBadgeHtml = item.stock && item.stock > 0
      ? `<div class="stock-badge stock-ready"><i class="fa-solid fa-circle-check"></i> ${item.stock} Unit</div>`
      : `<div class="stock-badge stock-empty"><i class="fa-solid fa-clock"></i> Pre-order</div>`;

    const orderBtnHtml = item.stock && item.stock > 0
      ? `<button class="btn-order-tco" onclick="window.location.href='tco_order.html?model=${encodeURIComponent(tcoData[currentModelIndex].model)}&item=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&pn=${encodeURIComponent(item.part_number||'')}&tpos=${encodeURIComponent(item.price_tpos||'')}&tls=${encodeURIComponent(item.price_tls||'')}&grade=${encodeURIComponent(item.applicable_grade||'')}'"><i class="fa-solid fa-cart-plus"></i> Pesan</button>`
      : `<button class="btn-order-disabled"><i class="fa-solid fa-ban"></i> Habis</button>`;

    const isPkg = isPackageItem(item);
    const pnHtml = (item.part_number && !isPkg)
      ? `<div class="item-pn-badge"><i class="fa-solid fa-barcode"></i> P/N: ${item.part_number}</div>`
      : '';

    const packageParts = getPackageParts(item);
    const packagePartsHtml = (isPkg && packageParts.length > 0)
      ? `<div style="margin: 8px 0 10px; padding: 10px 12px; background: rgba(241, 245, 249, 0.8); border-radius: 8px; border: 1px dashed #cbd5e1;">
          <div style="font-size: 11px; font-weight: 700; color: #1e293b; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-boxes-packing" style="color: var(--primary-red, #ef4444);"></i> Part Name Isi Paket (${packageParts.length} Item):
          </div>
          <ul style="margin: 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 4px;">
            ${packageParts.map(p => `
              <li style="font-size: 11px; color: #475569; display: flex; align-items: flex-start; gap: 6px; line-height: 1.3;">
                <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 10px; margin-top: 2px;"></i>
                <span>${p}</span>
              </li>
            `).join('')}
          </ul>
         </div>`
      : '';

    const dealerPricesHtml = (item.price_tpos || item.price_tls)
      ? `<div class="dealer-price-table">
          <div style="font-weight:700; color:#475569; font-size:9.5px; border-bottom:1px solid #e2e8f0; padding-bottom:3px; margin-bottom:2px;"><i class="fa-solid fa-store" style="color:var(--accent-blue);"></i> Harga Beli Dealer (WPBT)</div>
          ${item.price_tpos ? `<div class="dealer-price-row"><span class="dealer-price-label">Via TPOS (Tipe 3):</span><span class="dealer-price-val">${item.price_tpos}</span></div>` : ''}
          ${item.price_tls ? `<div class="dealer-price-row"><span class="dealer-price-label">Via TLS (RTCO):</span><span class="dealer-price-val">${item.price_tls}</span></div>` : ''}
         </div>`
      : '';

    const gradeHtml = item.applicable_grade
      ? `<div class="item-grade-info"><i class="fa-solid fa-circle-info"></i> <div><strong>Berlaku:</strong> ${item.applicable_grade}</div></div>`
      : '';

    // Extract numeric price
    const cleanedPriceStr = (item.price || '').replace(/[^\d]/g, '');
    const numericPrice = parseInt(cleanedPriceStr) || 0;

    card.innerHTML = `
      <div class="card-accent ${accentClass}"></div>
      <div class="card-body">
        <div class="card-top-row" style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div style="display:flex; gap:12px; align-items:flex-start;">
            <div class="item-icon ${colorClass}">
              <i class="${item.icon}"></i>
            </div>
            <div class="card-top-info">
              <span class="item-type ${typeLabelClass}">${item.type}</span>
              <h4 class="item-name">${item.name}</h4>
              ${pnHtml}
            </div>
          </div>
          <div style="padding-top:4px;">
            <input type="checkbox" class="tco-select-chk" value="${numericPrice}" data-name="${escapeQuotes(item.name)}" data-stock="${item.stock || 0}" onchange="updateTcoCartSummary()" style="width:22px; height:22px; accent-color:var(--primary-red, #d7123a); cursor:pointer;" title="Pilih Aksesoris Ini">
          </div>
        </div>
        
        ${packagePartsHtml}
        ${gradeHtml}

        <div class="item-price-section">
          <div style="font-size:10px; font-weight:700; color:var(--text-muted); margin-bottom:2px;">Harga Customer (RTCO After Tax)</div>
          <div class="price-amount">${formatPriceDisplay(item.price)}</div>
          ${dealerPricesHtml}
        </div>
      </div>
      <div class="item-card-footer">
        ${stockBadgeHtml}
        ${orderBtnHtml}
      </div>
    `;
    container.appendChild(card);
  });

  updateTcoCartSummary();
}

function escapeQuotes(str) {
  return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function updateTcoCartSummary() {
  const checkboxes = document.querySelectorAll('.tco-select-chk:checked');
  const cartBar = document.getElementById('tcoFloatingCartBar');
  const countEl = document.getElementById('tcoCartCount');
  const totalEl = document.getElementById('tcoCartTotal');
  const cicilanEl = document.getElementById('tcoCartCicilan');

  if (!cartBar) return;

  if (checkboxes.length === 0) {
    cartBar.style.display = 'none';
    return;
  }

  let total = 0;
  checkboxes.forEach(chk => {
    total += parseFloat(chk.value) || 0;
  });

  const monthlyImpact = Math.round(total / 48);

  cartBar.style.display = 'block';
  if (countEl) countEl.textContent = `${checkboxes.length} Aksesoris Dipilih`;
  if (totalEl) totalEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
  if (cicilanEl) cicilanEl.textContent = `+Rp ${monthlyImpact.toLocaleString('id-ID')} / bln`;
}

function shareTcoCartWA() {
  const currentModel = tcoData[currentModelIndex] ? tcoData[currentModelIndex].model : 'Toyota';
  const checkboxes = document.querySelectorAll('.tco-select-chk:checked');

  if (checkboxes.length === 0) {
    if (window.showCustomAlert) window.showCustomAlert('Perhatian', 'Pilih minimal 1 aksesoris!', 'warning');
    else alert('Pilih minimal 1 aksesoris!');
    return;
  }

  const selectedItems = [];
  let total = 0;
  checkboxes.forEach(chk => {
    selectedItems.push(chk.dataset.name);
    total += parseFloat(chk.value) || 0;
  });

  const monthlyImpact = Math.round(total / 48);
  const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant';
  const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

  const text = `🎨 *PAKET AKSESORIS TOYOTA CUSTOMIZATION OPTION (TCO)* 🚗
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bapak/Ibu, berikut adalah estimasi penawaran paket aksesoris original pilihan untuk unit *${currentModel}*:

📦 *ITEM AKSESORIS PILIHAN (${selectedItems.length} Item):*
${selectedItems.map((it, idx) => `${idx + 1}. ${it}`).join('\n')}

💰 *ESTIMASI BIAYA AKSESORIS:*
- Total Biaya Paket: *Rp ${total.toLocaleString('id-ID')}*
- (Atau *+Rp ${monthlyImpact.toLocaleString('id-ID')} / bulan* jika ditambahkan ke angsuran kredit)

✨ *KEUNGGULAN TCO ORIGINAL TOYOTA:*
1. Garansi resmi Toyota Astra Motor.
2. Pemasangan rapi oleh teknisi tersertifikasi tanpa membatalkan garansi kendaraan.
3. Langsung digabungkan ke pemesanan SPK unit baru Anda!

Ingin paket aksesoris ini dimasukkan ke dalam pesanan unit Anda?

Salam hangat,
👔 *${salesNama}*
🏬 ${cabang}`;

  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

let pendingReadyTcoItems = [];
let pendingReadyTcoTotal = 0;

async function orderTcoCartNow() {
  const currentModel = tcoData[currentModelIndex] ? tcoData[currentModelIndex].model : 'Toyota';
  const checkboxes = document.querySelectorAll('.tco-select-chk:checked');

  if (checkboxes.length === 0) {
    if (window.showCustomAlert) window.showCustomAlert('Perhatian!', 'Pilih minimal 1 aksesoris untuk dipesan!', 'warning');
    else alert('Pilih minimal 1 aksesoris untuk dipesan!');
    return;
  }

  const readyItems = [];
  const outOfStockItems = [];
  let readyTotal = 0;

  checkboxes.forEach(chk => {
    const stockVal = parseInt(chk.dataset.stock || '0');
    const itemPrice = parseFloat(chk.value) || 0;
    const itemName = chk.dataset.name;

    if (stockVal > 0) {
      readyItems.push(itemName);
      readyTotal += itemPrice;
    } else {
      outOfStockItems.push(itemName);
    }
  });

  // Scenario 1: All selected items are OUT OF STOCK
  if (readyItems.length === 0) {
    if (window.showCustomAlert) {
      window.showCustomAlert('Stok Kosong!', 'Seluruh aksesoris pilihan Anda saat ini berstatus Pre-order / Stok Kosong. Silakan pilih aksesoris lain yang Ready Stock!', 'warning');
    } else {
      alert('Seluruh aksesoris pilihan Anda berstatus Pre-order / Stok Kosong. Silakan pilih aksesoris lain!');
    }
    return;
  }

  // Scenario 2: Some items are OUT OF STOCK, but some are READY
  if (outOfStockItems.length > 0) {
    pendingReadyTcoItems = readyItems;
    pendingReadyTcoTotal = readyTotal;

    if (window.customConfirm) {
      const outListStr = outOfStockItems.map(it => `• <strong>${it}</strong> (Pre-order)`).join('<br>');
      const msgHtml = `Beberapa aksesoris pilihan Anda berstatus <strong>Stok Kosong / Pre-order</strong>:<br><br><div style="background:#fff7ed; border:1px solid #fed7aa; padding:10px 14px; border-radius:12px; font-size:12.5px; color:#9a3412; text-align:left; margin-bottom:10px;">${outListStr}</div>Apakah Anda ingin melanjutkan pemesanan untuk aksesoris yang <strong>Ready Stock</strong> (${readyItems.join(', ')}) saja?`;
      
      const isConfirmed = await window.customConfirm(msgHtml);
      if (isConfirmed) {
        proceedReadyTcoOrder();
      }
    } else {
      const listContainer = document.getElementById('tcoOutOfStockList');
      if (listContainer) {
        listContainer.innerHTML = outOfStockItems.map(name => `• <strong>${name}</strong> (Stok Kosong / Pre-order)`).join('<br>');
      }
      const modal = document.getElementById('tcoStockModal');
      if (modal) modal.style.display = 'flex';
    }
    return;
  }

  // Scenario 3: All selected items are READY STOCK
  pendingReadyTcoItems = readyItems;
  pendingReadyTcoTotal = readyTotal;
  proceedReadyTcoOrder();
}

function closeTcoStockModal() {
  const modal = document.getElementById('tcoStockModal');
  if (modal) modal.style.display = 'none';
}

function proceedReadyTcoOrder() {
  closeTcoStockModal();
  const currentModel = tcoData[currentModelIndex] ? tcoData[currentModelIndex].model : 'Toyota';

  if (pendingReadyTcoItems.length === 0) return;

  const itemNamesStr = pendingReadyTcoItems.join(' + ');
  const totalPriceStr = 'Rp ' + pendingReadyTcoTotal.toLocaleString('id-ID');

  window.location.href = `tco_order.html?model=${encodeURIComponent(currentModel)}&item=${encodeURIComponent(itemNamesStr)}&price=${encodeURIComponent(totalPriceStr)}`;
}

/* =========================================
   ZOOM MODAL FUNCTIONS
========================================= */
let pzInstance = null;

function openZoom(src) {
  const modal = document.getElementById('imageZoomModal');
  const img = document.getElementById('zoomImage');
  if (modal && img) {
    img.src = src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // prevent background scrolling

    // Initialize Panzoom
    if (typeof panzoom !== 'undefined') {
      if (pzInstance) {
        pzInstance.dispose();
      }
      // Add a small timeout to allow modal animation to finish before measuring
      setTimeout(() => {
        pzInstance = panzoom(img, {
          maxZoom: 5,
          minZoom: 1,
          bounds: true,
          boundsPadding: 0.1,
          zoomDoubleClickSpeed: 1 // enable double tap to zoom
        });
      }, 50);
    }
  }
}

function closeZoom(event) {
  // Only close if clicked on the overlay background or the close button
  if (event.target.id === 'imageZoomModal' || event.target.closest('.zoom-modal-close')) {
    const modal = document.getElementById('imageZoomModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = ''; // restore scrolling

      // Cleanup Panzoom
      if (pzInstance) {
        pzInstance.dispose();
        pzInstance = null;
      }

      // Reset image transform
      const img = document.getElementById('zoomImage');
      if (img) img.style.transform = '';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  fetchTCOData(); // Ambil dari API MySQL!
});

