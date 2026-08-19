/**
 * js/merchandise.js
 * Toyota Official Merchandise Catalog
 * Features: Multi-Category, Real-Time Search, Multi-Sort (A-Z, Z-A, Price, Stock, Popularity), Availability Filter, Lightbox & WhatsApp Order
 */

let rawData = [];
let groupedMerch = [];
let selectedKategori = 'Semua';
let searchQuery = '';
let sortMode = 'popularity';
let stockMode = 'all';

// Pembersih angka harga (karena di database terkadang ada format 'Rp. ')
function extractNumber(priceStr) {
  if (!priceStr && priceStr !== 0) return 0;
  return parseInt(String(priceStr).replace(/[^0-9]/g, ''), 10) || 0;
}

// Format Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}

// Icon Kategori Otomatis
function getIconByName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('kaos') || n.includes('shirt') || n.includes('polo') || n.includes('t-shirt') || n.includes('tshirt')) return 'fa-shirt';
  if (n.includes('topi') || n.includes('hat') || n.includes('cap')) return 'fa-helmet-safety';
  if (n.includes('jaket') || n.includes('jacket') || n.includes('sweater') || n.includes('hoodie') || n.includes('vest')) return 'fa-vest';
  if (n.includes('mug') || n.includes('botol') || n.includes('tumbler') || n.includes('gelas') || n.includes('thermos')) return 'fa-mug-hot';
  if (n.includes('umbrella') || n.includes('payung')) return 'fa-umbrella';
  if (n.includes('keychain') || n.includes('key fob') || n.includes('keystrap') || n.includes('key strap') || n.includes('key case') || n.includes('keycase') || n.includes('key')) return 'fa-key';
  if (n.includes('lanyard')) return 'fa-id-badge';
  if (n.includes('sticker') || n.includes('stiker')) return 'fa-note-sticky';
  if (n.includes('tote')) return 'fa-bag-shopping';
  return 'fa-box-open';
}

// Skor popularitas produk
function getPopularityScore(group) {
  const name = (group.name || '').toLowerCase();
  let score = 0;

  if (name.includes('keycase') || name.includes('key case') || name.includes('key fob') || name.includes('keystrap') || name.includes('key strap') || name.includes('keychain') || name.includes('key')) {
    score += 1000;
  } else if (name.includes('topi') || name.includes('cap') || name.includes('hat')) {
    score += 900;
  } else if (name.includes('polo') || name.includes('t-shirt') || name.includes('tshirt') || name.includes('shirt') || name.includes('kaos')) {
    score += 800;
  } else if (name.includes('lanyard') || name.includes('tote')) {
    score += 700;
  } else if (name.includes('tumbler') || name.includes('thermos') || name.includes('mug') || name.includes('botol') || name.includes('umbrella') || name.includes('payung')) {
    score += 600;
  } else if (name.includes('sticker') || name.includes('stiker')) {
    score += 500;
  } else if (name.includes('jacket') || name.includes('jaket') || name.includes('hoodie') || name.includes('sweater')) {
    score += 400;
  } else {
    score += 300;
  }

  // Prioritaskan stok tersedia
  const totalStock = (group.totalCabangStock || 0) + (group.totalTamStock || 0);
  if (totalStock > 0) {
    score += Math.min(totalStock, 100);
  }

  return score;
}

// Mengelompokkan barang berdasarkan nama produk
function groupDataByName(data) {
  const groups = {};
  data.forEach(item => {
    const name = (item.name || '').trim();
    if (!name) return;

    if (!groups[name]) {
      groups[name] = {
        name: name,
        image: item.image,
        icon: getIconByName(name),
        variants: []
      };
    }
    groups[name].variants.push(item);
  });

  const result = Object.values(groups);

  // Hitung ringkasan harga & stok per kelompok
  result.forEach(group => {
    let minP = Infinity;
    let maxP = -Infinity;
    let totCabang = 0;
    let totTam = 0;

    group.variants.forEach(v => {
      const p = extractNumber(v.retail_price);
      if (p < minP) minP = p;
      if (p > maxP) maxP = p;
      totCabang += parseInt(v.stock_cabang, 10) || 0;
      totTam += parseInt(v.stock_tam, 10) || 0;
    });

    group.minPrice = minP === Infinity ? 0 : minP;
    group.maxPrice = maxP === -Infinity ? 0 : maxP;
    group.totalCabangStock = totCabang;
    group.totalTamStock = totTam;
  });

  return result;
}

// Template HTML Kartu Produk
function cardMerch(group, groupIndex) {
  const def = group.variants[0] || {};

  let imageSrc = 'https://placehold.co/600x400/f1f2f6/a0aab5?text=No+Image';
  if (group.image && group.image !== 'NULL') {
    if (group.image.startsWith('http') || group.image.startsWith('//')) {
      imageSrc = group.image;
    } else {
      imageSrc = '../' + group.image.replace(/^\.\.\//, '').replace(/^\//, '');
    }
  }

  const sizeOptions = group.variants.map((v, i) => {
    const sizeLabel = v.size ? v.size : 'All Size';
    return `<option value="${i}">Ukuran: ${sizeLabel}</option>`;
  }).join('');

  const initialPrice = extractNumber(def.retail_price) || group.minPrice;
  const initialCabang = def.stock_cabang || 0;
  const initialTam = def.stock_tam || 0;

  return `
    <div class="summary-card" id="card-${groupIndex}" style="padding:14px;flex-direction:column;align-items:flex-start;gap:10px;">
      
      <div style="display:flex;align-items:center;gap:10px;width:100%;">
        <div class="icon-box bg-blue" style="width:42px;height:42px;flex-shrink:0;">
          <i class="fa-solid ${group.icon}" aria-hidden="true"></i>
        </div>
        <div style="flex:1;min-width:0;">
          <div style="font-weight:800;color:var(--text-dark);font-size:13px;line-height:1.2;word-break:break-word;">${group.name}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:4px;">
            Part: <b class="part-number-display">${def.part_number || '-'}</b>
          </div>
        </div>
      </div>
      
      <div style="position:relative;width:100%;">
        <img src="${imageSrc}" alt="${group.name}" loading="lazy" style="width:100%;height:130px;object-fit:cover;border-radius:12px;background:#f1f2f6;display:block;cursor:pointer;" onclick="openLightbox('${imageSrc}')">
      </div>
      
      <div style="width: 100%;">
        <select class="form-control" style="padding: 6px 10px; font-size:11px; height:auto; margin-bottom: 4px; font-weight:700;" onchange="updateCardVariant(this, ${groupIndex})">
          ${sizeOptions}
        </select>
      </div>

      <div style="display:flex;justify-content:space-between;align-items:center;width:100%;">
        <div class="price-display" style="font-weight:900;color:var(--primary-red);font-size:15px;">
          ${formatRupiah(initialPrice)}
        </div>
      </div>

      <div style="display:flex; gap:6px; margin-top:2px; width: 100%;">
        <div style="font-size:10px;font-weight:800;color:#1e293b;background:#f8fafc;border:1px solid #e2e8f0;padding:6px 8px;border-radius:8px; flex:1; text-align:center;">
          Cabang: <b class="stock-cabang-display" style="color:${initialCabang > 0 ? '#16a34a' : '#94a3b8'};">${initialCabang}</b>
        </div>
        <div style="font-size:10px;font-weight:800;color:#1e293b;background:#f8fafc;border:1px solid #e2e8f0;padding:6px 8px;border-radius:8px; flex:1; text-align:center;">
          TAM: <b class="stock-tam-display" style="color:${initialTam > 0 ? '#2563eb' : '#94a3b8'};">${initialTam}</b>
        </div>
      </div>

      <button class="btn-outline-blue btn-request" style="margin-top: 6px; width: 100%;" onclick="requestMerch('${group.name.replace(/'/g, "\\'")}', '${def.part_number || ''}', '${(def.size || 'All Size').replace(/'/g, "\\'")}')">
        <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> Minta Barang
      </button>
    </div>
  `;
}

// Update isi kartu saat ukuran diganti dari dropdown
function updateCardVariant(selectElem, groupIndex) {
  const variantIndex = selectElem.value;
  const group = groupedMerch[groupIndex];
  if (!group || !group.variants[variantIndex]) return;

  const variant = group.variants[variantIndex];
  const card = document.getElementById(`card-${groupIndex}`);
  if (!card) return;

  card.querySelector('.part-number-display').textContent = variant.part_number || '-';
  card.querySelector('.price-display').textContent = formatRupiah(extractNumber(variant.retail_price));
  
  const cabangEl = card.querySelector('.stock-cabang-display');
  if (cabangEl) {
    const cVal = parseInt(variant.stock_cabang, 10) || 0;
    cabangEl.textContent = cVal;
    cabangEl.style.color = cVal > 0 ? '#16a34a' : '#94a3b8';
  }

  const tamEl = card.querySelector('.stock-tam-display');
  if (tamEl) {
    const tVal = parseInt(variant.stock_tam, 10) || 0;
    tamEl.textContent = tVal;
    tamEl.style.color = tVal > 0 ? '#2563eb' : '#94a3b8';
  }

  const btn = card.querySelector('.btn-request');
  if (btn) {
    const safeName = group.name.replace(/'/g, "\\'");
    const safeSize = (variant.size || 'All Size').replace(/'/g, "\\'");
    btn.setAttribute('onclick', `requestMerch('${safeName}', '${variant.part_number || ''}', '${safeSize}')`);
  }
}

// Filter and Sort Pipeline
function getFilteredAndSortedMerch() {
  let items = [...groupedMerch];

  // 1. Filter Kategori
  if (selectedKategori !== 'Semua') {
    items = items.filter(g => {
      const n = g.name.toLowerCase();
      if (selectedKategori === 'Kaos') return n.includes('kaos') || n.includes('polo') || n.includes('shirt');
      if (selectedKategori === 'Topi') return n.includes('topi') || n.includes('cap') || n.includes('hat');
      if (selectedKategori === 'Jaket') return n.includes('jaket') || n.includes('jacket') || n.includes('sweater') || n.includes('hoodie') || n.includes('vest');
      if (selectedKategori === 'Tumbler') return n.includes('tumbler') || n.includes('botol') || n.includes('mug') || n.includes('thermos') || n.includes('gelas');
      if (selectedKategori === 'Payung') return n.includes('umbrella') || n.includes('payung');
      if (selectedKategori === 'Keychain') return n.includes('keychain') || n.includes('key fob') || n.includes('keystrap') || n.includes('key strap') || n.includes('key case') || n.includes('keycase') || n.includes('key');
      if (selectedKategori === 'Lanyard') return n.includes('lanyard');
      if (selectedKategori === 'Stiker') return n.includes('sticker') || n.includes('stiker');
      if (selectedKategori === 'Tote Bag') return n.includes('tote') || n.includes('bag') || n.includes('tas');
      if (selectedKategori === 'T-shirt') return n.includes('t-shirt') || n.includes('tshirt') || n.includes('shirt') || n.includes('kaos');
      return false;
    });
  }

  // 2. Filter Search Query
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    items = items.filter(g => {
      if (g.name.toLowerCase().includes(q)) return true;
      return g.variants.some(v => 
        (v.part_number && v.part_number.toLowerCase().includes(q)) ||
        (v.size && v.size.toLowerCase().includes(q))
      );
    });
  }

  // 3. Filter Ketersediaan Stok
  if (stockMode === 'ready') {
    items = items.filter(g => (g.totalCabangStock + g.totalTamStock) > 0);
  } else if (stockMode === 'cabang') {
    items = items.filter(g => g.totalCabangStock > 0);
  }

  // 4. Sort Pipeline
  if (sortMode === 'az') {
    items.sort((a, b) => a.name.localeCompare(b.name, 'id', { sensitivity: 'base' }));
  } else if (sortMode === 'za') {
    items.sort((a, b) => b.name.localeCompare(a.name, 'id', { sensitivity: 'base' }));
  } else if (sortMode === 'price_asc') {
    items.sort((a, b) => a.minPrice - b.minPrice);
  } else if (sortMode === 'price_desc') {
    items.sort((a, b) => b.minPrice - a.minPrice);
  } else if (sortMode === 'stock_desc') {
    items.sort((a, b) => (b.totalCabangStock + b.totalTamStock) - (a.totalCabangStock + a.totalTamStock));
  } else {
    // Default popularity
    items.sort((a, b) => getPopularityScore(b) - getPopularityScore(a));
  }

  return items;
}

// Render Grid
function renderGrid() {
  const grid = document.getElementById('merchGrid');
  const titleEl = document.getElementById('kategoriTitle');
  const counterEl = document.getElementById('productCounterBadge');
  const resetBtn = document.getElementById('btnResetFilters');

  const filteredItems = getFilteredAndSortedMerch();

  // Title header text
  if (titleEl) {
    if (searchQuery.trim()) {
      titleEl.textContent = `Hasil Pencarian: "${searchQuery.trim()}"`;
    } else {
      titleEl.textContent = selectedKategori === 'Semua' ? 'Semua Merchandise' : `Kategori: ${selectedKategori}`;
    }
  }

  // Update counter badge
  if (counterEl) {
    counterEl.innerHTML = `<i class="fa-solid fa-boxes-stacked"></i> Menampilkan <b>${filteredItems.length}</b> dari <b>${groupedMerch.length}</b> Produk`;
  }

  // Show/hide reset button
  const hasActiveFilters = selectedKategori !== 'Semua' || searchQuery.trim() !== '' || sortMode !== 'popularity' || stockMode !== 'all';
  if (resetBtn) {
    resetBtn.style.display = hasActiveFilters ? 'inline-flex' : 'none';
  }

  if (!grid) return;
  grid.innerHTML = '';

  if (filteredItems.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align:center; padding: 48px 20px; background:#ffffff; border-radius:18px; border:1px dashed #cbd5e1;">
        <div style="width:56px; height:56px; border-radius:50%; background:#f1f5f9; color:#94a3b8; display:inline-flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:12px;">
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div style="font-size:15px; font-weight:800; color:#1e293b;">Merchandise Tidak Ditemukan</div>
        <div style="font-size:12px; color:#64748b; margin-top:4px; max-width:320px; margin-left:auto; margin-right:auto;">
          Tidak ada produk yang cocok dengan pencarian atau filter yang dipilih.
        </div>
        <button class="btn-outline-blue" style="margin-top:16px; padding:8px 18px;" onclick="resetAllFilters()">
          <i class="fa-solid fa-rotate-left"></i> Reset Filter
        </button>
      </div>
    `;
    return;
  }

  filteredItems.forEach(group => {
    const originalIndex = groupedMerch.indexOf(group);
    const wrapper = document.createElement('div');
    wrapper.innerHTML = cardMerch(group, originalIndex);
    grid.appendChild(wrapper.firstElementChild);
  });
}

// Handler Ganti Kategori
function selectCategory(e, kategori) {
  if (e && e.preventDefault) e.preventDefault();
  selectedKategori = kategori;

  // Highlight active category in horizontal scroll
  const categoryScroll = document.getElementById('categoryScroll');
  if (categoryScroll) {
    const items = categoryScroll.querySelectorAll('.category-item');
    items.forEach(item => {
      const text = item.querySelector('.category-text');
      if (text && text.textContent.trim() === kategori) {
        item.classList.add('active');
        item.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  renderGrid();
}

// Handler Search Input
function initSearchListeners() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');

  if (input) {
    input.addEventListener('input', function () {
      searchQuery = this.value;
      if (clearBtn) {
        clearBtn.style.display = searchQuery.trim() ? 'flex' : 'none';
      }
      renderGrid();
    });
  }
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClearBtn');
  if (input) {
    input.value = '';
    searchQuery = '';
    input.focus();
  }
  if (clearBtn) clearBtn.style.display = 'none';
  renderGrid();
}

// Handler Sort Change
function handleSortChange(value) {
  sortMode = value || 'popularity';
  renderGrid();
}

// Handler Stock Filter Change
function handleStockFilterChange(value) {
  stockMode = value || 'all';
  renderGrid();
}

// Reset All Filters
function resetAllFilters() {
  selectedKategori = 'Semua';
  searchQuery = '';
  sortMode = 'popularity';
  stockMode = 'all';

  const input = document.getElementById('searchInput');
  if (input) input.value = '';

  const clearBtn = document.getElementById('searchClearBtn');
  if (clearBtn) clearBtn.style.display = 'none';

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) sortSelect.value = 'popularity';

  const stockSelect = document.getElementById('stockFilterSelect');
  if (stockSelect) stockSelect.value = 'all';

  // Reset active category class
  const categoryScroll = document.getElementById('categoryScroll');
  if (categoryScroll) {
    const items = categoryScroll.querySelectorAll('.category-item');
    items.forEach((item, idx) => {
      if (idx === 0) item.classList.add('active');
      else item.classList.remove('active');
    });
  }

  renderGrid();
}

// Tombol Minta Barang (WhatsApp Direct Integration)
function requestMerch(namaBarang, partNumber, size) {
  const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
  const cabangSales = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

  const text = `Halo Admin Inventory / Logistic,\n\nSaya *${namaSales}* (${cabangSales}) ingin mengajukan permintaan merchandise Toyota:\n\n📦 *Item*: ${namaBarang}\n🏷️ *Part No*: ${partNumber || '-'}\n📏 *Ukuran*: ${size}\n\nMohon info ketersediaan fisik dan proses pengambilan barang. Terima kasih!`;
  
  if (window.showCustomAlert) {
    window.showCustomAlert(`Permintaan untuk "${namaBarang} (${size})" berhasil disiapkan. Teruskan ke WhatsApp Admin Inventory?`, 'info');
  } else {
    alert(`Permintaan merchandise:\n\nNama: ${namaBarang}\nUkuran: ${size}\nPart Number: ${partNumber}`);
  }
}

// Fetch API
async function fetchMerchandiseData() {
  const loading = document.getElementById('loadingIndicator');

  try {
    const response = await fetch('../api/api_merchandise.php');
    const json = await response.json();

    if (json.ok) {
      rawData = json.data || [];
      groupedMerch = groupDataByName(rawData);
      if (loading) loading.style.display = 'none';
      renderGrid();
    } else {
      if (loading) loading.innerHTML = `<span style="color:var(--primary-red);"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat data: ${json.message}</span>`;
    }
  } catch (error) {
    console.error("Kesalahan koneksi:", error);
    if (loading) loading.innerHTML = '<span style="color:var(--primary-red);"><i class="fa-solid fa-link-slash"></i> Gagal terhubung ke Server. Silakan coba lagi.</span>';
  }
}

// Image Lightbox Functions
function openLightbox(imgSrc) {
  const imgEl = document.getElementById('lightboxImage');
  const boxEl = document.getElementById('imageLightbox');
  if (imgEl && boxEl) {
    imgEl.src = imgSrc;
    boxEl.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox(e) {
  const boxEl = document.getElementById('imageLightbox');
  if (!boxEl) return;
  if (e.target.id === 'imageLightbox' || e.target.classList.contains('lightbox-close')) {
    boxEl.classList.remove('active');
    document.body.style.overflow = '';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initSearchListeners();
  fetchMerchandiseData();
});
