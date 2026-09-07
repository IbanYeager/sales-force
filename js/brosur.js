// ─── State ───────────────────────────────────────────────
let allData = [];      // semua data dari API
let allKategori = [];      // daftar kategori dari API
let activeKat = 'ALL';
let searchQuery = '';
let debounceTimer;

// ─── Category icons & colours ────────────────────────────
const KAT_META = {
  'LMPV': { icon: 'fa-users', cls: 'icon-lmpv', badge: 'badge-lmpv' },
  'SUV': { icon: 'fa-mountain-sun', cls: 'icon-suv', badge: 'badge-suv' },
  'HATCHBACK': { icon: 'fa-car', cls: 'icon-hatchback', badge: 'badge-hatchback' },
  'SEDAN': { icon: 'fa-car-side', cls: 'icon-sedan', badge: 'badge-sedan' },
  'MPV MEWAH': { icon: 'fa-star', cls: 'icon-mpv-mewah', badge: 'badge-mpv-mewah' },
  'COMMERCIAL': { icon: 'fa-truck', cls: 'icon-commercial', badge: 'badge-commercial' },
  'ELECTRIFIED': { icon: 'fa-bolt', cls: 'icon-electrified', badge: 'badge-electrified' },
};

function getKatMeta(kat) {
  const k = kat ? kat.toUpperCase() : '';
  return KAT_META[k] || { icon: 'fa-file-pdf', cls: 'icon-lainnya', badge: 'badge-lainnya' };
}

function getKatSlug(kat) {
  return (kat || '').toLowerCase().replace(/\s+/g, '-');
}

// ─── Fetch data ──────────────────────────────────────────
function fetchBrosur() {
  const params = new URLSearchParams();
  if (searchQuery) params.set('search', searchQuery);
  if (activeKat && activeKat !== 'ALL') params.set('kategori', activeKat);

  fetch(`../api/api_brosur.php?${params.toString()}`)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        allData = res.data || [];
        allKategori = res.kategori || [];
        renderTabs();
        renderBrosur(allData);
      } else {
        showError();
      }
    })
    .catch(() => showError());
}

// ─── Render category tabs ────────────────────────────────
function renderTabs() {
  const tabsEl = document.getElementById('katTabs');
  // Hapus tab selain "All"
  tabsEl.querySelectorAll('.kat-tab:not([data-kat="ALL"])').forEach(t => t.remove());

  allKategori.forEach(kat => {
    const meta = getKatMeta(kat);
    const btn = document.createElement('button');
    btn.className = 'kat-tab' + (activeKat === kat ? ' active' : '');
    btn.dataset.kat = kat;
    btn.innerHTML = `<i class="fa-solid ${meta.icon}" style="margin-right:4px;font-size:9px;"></i> ${capitalize(kat)}`;
    btn.addEventListener('click', () => onTabClick(kat));
    tabsEl.appendChild(btn);
  });

  // Update "All" tab
  const allTab = tabsEl.querySelector('[data-kat="ALL"]');
  if (allTab) {
    allTab.className = 'kat-tab' + (activeKat === 'ALL' ? ' active' : '');
    allTab.onclick = () => onTabClick('ALL');
  }
}

function onTabClick(kat) {
  activeKat = kat;
  fetchBrosur();
}

// ─── Render brochure cards ────────────────────────────────
function renderBrosur(data) {
  const container = document.getElementById('brosurContainer');
  const skeleton = document.getElementById('skeletonGrid');
  if (skeleton) skeleton.remove();

  const countEl = document.getElementById('resultCount');

  if (data.length === 0) {
    countEl.style.display = 'none';
    container.innerHTML = `
          <div class="brosur-empty">
            <i class="fa-solid fa-file-circle-xmark"></i>
            <p>Brosur tidak ditemukan</p>
            <small>Coba kata kunci lain atau pilih kategori berbeda</small>
          </div>`;
    return;
  }

  // Show result count when searching or filtering
  if (searchQuery || activeKat !== 'ALL') {
    countEl.style.display = 'block';
    countEl.innerHTML = `<i class="fa-solid fa-filter" style="margin-right:4px;"></i> Menampilkan <strong>${data.length}</strong> brosur`;
  } else {
    countEl.style.display = 'none';
  }

  // Group by kategori
  const groups = {};
  data.forEach(b => {
    const k = (b.kategori || 'LAINNYA').toUpperCase();
    if (!groups[k]) groups[k] = [];
    groups[k].push(b);
  });

  const html = Object.keys(groups).map(kat => {
    const items = groups[kat];
    const meta = getKatMeta(kat);

    const cards = items.map((b, i) => {
      const slug = getKatSlug(b.kategori);
      const imgSrc = (b.gambar_url || '').startsWith('http') ? b.gambar_url : '../' + (b.gambar_url || '');
      const imgHtml = b.gambar_url
        ? `<img src="${imgSrc}" alt="${escHtml(b.nama)}" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fa-solid fa-car img-fallback\\'></i>'">`
        : `<i class="fa-solid fa-car img-fallback"></i>`;

      return `
            <div class="brosur-card" style="animation-delay:${i * 50}ms">
              <div class="brosur-card-img-wrap" style="cursor:pointer;" onclick="openImageLightbox('${imgSrc}')">
                ${imgHtml}
                <span class="kat-badge badge-${slug}">${escHtml(b.kategori)}</span>
              </div>
              <div class="brosur-card-body">
                <div class="brosur-card-name">${escHtml(b.nama)}</div>
                <div class="brosur-card-desc">${escHtml(b.deskripsi)}</div>
                <div class="brosur-card-actions" style="display:flex; gap:6px;">
                  <button type="button" class="btn-brosur-view" style="flex:1; border:none; border-radius:6px; cursor:pointer;" onclick="openPdfModal('${escHtml(b.nama)}', '${escHtml(b.pdf_url)}')">
                    <i class="fa-solid fa-book-open"></i> Lihat Brosur
                  </button>
                  <button type="button" class="btn-brosur-share" title="Bagikan" onclick="shareBrosur('${escHtml(b.nama)}', '${escHtml(b.pdf_url)}')">
                    <i class="fa-solid fa-share-nodes"></i>
                  </button>
                </div>
              </div>
            </div>`;
    }).join('');

    return `
          <div class="brosur-section">
            <div class="brosur-section-header">
              <div class="brosur-section-icon ${meta.cls}">
                <i class="fa-solid ${meta.icon}"></i>
              </div>
              <span class="brosur-section-title">${capitalize(kat)}</span>
              <span class="brosur-section-count">${items.length}</span>
            </div>
            <div class="brosur-grid">${cards}</div>
          </div>`;
  }).join('');

  container.innerHTML = html;
}

function showError() {
  const container = document.getElementById('brosurContainer');
  const skeleton = document.getElementById('skeletonGrid');
  if (skeleton) skeleton.remove();
  container.innerHTML = `
        <div class="brosur-empty">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p>Gagal memuat brosur</p>
          <small>Periksa koneksi dan coba lagi</small>
        </div>`;
}

// ─── PDF Viewer Modal (PDF.js) ──────────────────────────────
let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.2,
  canvas = document.getElementById('pdfCanvas'),
  ctx = canvas.getContext('2d');

// Pastikan worker pdf.js dimuat
if (window['pdfjs-dist/build/pdf']) {
  window.pdfjsLib = window['pdfjs-dist/build/pdf'];
}
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

function renderPage(num) {
  pageIsRendering = true;
  pdfDoc.getPage(num).then(page => {
    // Calculate dynamic scale to fit the container width
    const container = document.getElementById('pdfViewerContainer');
    const padding = 24; // 10px padding on each side + some safe margin
    const containerWidth = container.clientWidth - padding;

    const unscaledViewport = page.getViewport({ scale: 1.0 });
    const scaleToFit = containerWidth / unscaledViewport.width;

    // Render at a higher resolution (e.g., 2.5x of the fitted size) for sharpness when zoomed
    const renderScale = scaleToFit * 2.5;
    const viewport = page.getViewport({ scale: renderScale });

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    // Keep it responsive
    canvas.style.width = containerWidth + 'px';
    canvas.style.maxWidth = '100%';
    canvas.style.cursor = 'zoom-in';
    canvas.style.height = 'auto';

    const renderCtx = { canvasContext: ctx, viewport: viewport };
    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;
      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }

      // Update lightbox if it is open
      const lightbox = document.getElementById('pdfLightbox');
      if (lightbox && lightbox.classList.contains('show')) {
        const dataUrl = canvas.toDataURL('image/png');
        document.getElementById('pdfLightboxImg').src = dataUrl;
        document.getElementById('pdfLightboxBg').style.backgroundImage = `url(${dataUrl})`;
        document.getElementById('pdfLightboxPageNum').textContent = num;
      }
    });
    document.getElementById('pdfPageNum').textContent = num;
  });
}

function queueRenderPage(num) {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
}

function showPrevPage() {
  if (pageNum <= 1) return;
  pageNum--;
  queueRenderPage(pageNum);
}

function showNextPage() {
  if (pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
}

document.getElementById('btnPrevPdf').addEventListener('click', showPrevPage);
document.getElementById('btnNextPdf').addEventListener('click', showNextPage);

// Open Lightbox Focus on click
canvas.addEventListener('click', () => {
  const dataUrl = canvas.toDataURL('image/png');
  document.getElementById('pdfLightboxImg').src = dataUrl;
  document.getElementById('pdfLightboxBg').style.backgroundImage = `url(${dataUrl})`;
  document.getElementById('pdfLightboxPageNum').textContent = pageNum;
  document.getElementById('pdfLightboxPageCount').textContent = pdfDoc.numPages;
  document.getElementById('pdfLightbox').classList.add('show');
});

window.closePdfLightbox = function () {
  document.getElementById('pdfLightbox').classList.remove('show');
};

document.getElementById('btnPrevLightbox').addEventListener('click', showPrevPage);
document.getElementById('btnNextLightbox').addEventListener('click', showNextPage);

window.openPdfModal = function (nama, url) {
  const finalUrl = url.startsWith('http') ? url : '../' + url;

  // Set Download & Share attributes
  const captionText = getSalesBrochureCaption(nama);
  const fileName = `${captionText}.pdf`;
  const btnDownload = document.getElementById('btnDownloadPdf');
  if (btnDownload) {
    btnDownload.href = finalUrl;
    btnDownload.setAttribute('download', fileName);
    btnDownload.title = `Unduh ${fileName}`;
  }
  const btnShare = document.getElementById('btnSharePdf');
  if (btnShare) {
    btnShare.onclick = () => window.shareBrosur(nama, url);
    btnShare.title = `Bagikan ${fileName}`;
  }

  document.getElementById('pdfModalTitle').textContent = nama;
  document.getElementById('pdfModal').classList.add('show');
  document.body.style.overflow = 'hidden';
  const loadingEl = document.getElementById('pdfLoading');
  const controlsEl = document.getElementById('pdfControls');

  loadingEl.style.display = 'flex';
  controlsEl.style.display = 'none';
  canvas.style.display = 'none';

  // Load PDF via PHP proxy to bypass IDM/Download Managers
  const proxyUrl = '../api/proxy_pdf.php?file=' + encodeURIComponent(url);

  if (window.pdfjsLib) {
    pdfjsLib.getDocument(proxyUrl).promise.then(pdfDoc_ => {
      pdfDoc = pdfDoc_;
      document.getElementById('pdfPageCount').textContent = pdfDoc.numPages;
      controlsEl.style.display = 'flex';
      loadingEl.style.display = 'none';
      canvas.style.display = 'block';

      pageNum = 1;
      renderPage(pageNum);
    }).catch(err => {
      console.error("PDF load error:", err);
      loadingEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--primary-red); margin-bottom:10px;"></i><span style="font-size:12px;">Gagal memuat PDF</span>';
    });
  } else {
    loadingEl.innerHTML = '<span style="font-size:12px;">PDF Viewer tidak didukung</span>';
  }
};

window.closePdfModal = function () {
  document.getElementById('pdfModal').classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('pdfControls').style.display = 'none';
    document.getElementById('pdfLoading').style.display = 'none';
    pdfDoc = null;
  }, 300);
};

// ─── Image Lightbox ──────────────────────────────────────
window.openImageLightbox = function (src) {
  if (!src) return;
  document.getElementById('lightboxImage').src = src;
  document.getElementById('imageLightbox').classList.add('show');
};

// ─── Format Caption & Nama Sales ─────────────────────────
function getSalesBrochureCaption(carName) {
  let salesName = localStorage.getItem('namaSales') || '';
  if (!salesName && typeof window.getCurrentSalesProfile === 'function') {
    const prof = window.getCurrentSalesProfile();
    if (prof && prof.nama && prof.nama !== 'Sales Consultant') {
      salesName = prof.nama;
    }
  }
  if (!salesName) {
    salesName = localStorage.getItem('user_nama') || localStorage.getItem('spvSales') || 'Sales';
  }

  // Bersihkan embel-embel peran jika ada (misal: "Reza (Sales Consultant)" -> "Reza")
  salesName = salesName.replace(/\(.*?\)/g, '').trim();
  // Bersihkan jika nama sudah ada kata "Tunas" atau "KC" agar tidak berulang
  salesName = salesName.replace(/tunas\s*(toyota|kc|kiara\s*condong)?/gi, '').trim();
  if (!salesName) salesName = 'Sales';

  let cleanCarName = (carName || 'Toyota').replace(/^toyota\s+/i, '').trim();

  // Format baku sesuai permintaan: "E catalog [Model] - [Sales] Tunas KC"
  return `E catalog ${cleanCarName} - ${salesName} Tunas KC`;
}

// ─── Share Berkas Dokumen PDF Langsung ke WhatsApp ────────
let isSharingPdf = false;

window.shareBrosur = async function (nama, url) {
  if (isSharingPdf) return;
  isSharingPdf = true;

  const captionText = getSalesBrochureCaption(nama);
  const fileName = `${captionText}.pdf`;

  // Resolving URL absolut file PDF
  let finalUrl = url;
  try {
    finalUrl = new URL(url, window.location.href).href;
  } catch (e) {
    if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      let cleanPath = finalUrl.replace(/^\.\.\//, '').replace(/^\//, '');
      finalUrl = window.location.origin + '/' + cleanPath;
    }
  }

  // Tampilkan notifikasi loading sementara file PDF disiapkan
  const toast = document.getElementById('shareToast');
  if (toast) {
    toast.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right:8px;color:#38bdf8;"></i> Menyiapkan file PDF ${escHtml(nama)}...`;
    toast.classList.add('show');
  }

  try {
    // 1. Fetch file PDF sebagai Blob
    let response = null;
    try {
      response = await fetch(finalUrl);
    } catch (e) {
      console.warn("Direct fetch error:", e);
    }

    if (!response || !response.ok) {
      const proxyUrl = `../api/proxy_pdf.php?file=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
    }

    if (!response || !response.ok) {
      throw new Error(`Gagal memuat file PDF`);
    }

    const blob = await response.blob();
    const pdfFile = new File([blob], fileName, { type: 'application/pdf' });

    // 2. Jika browser mendukung Web Share API Level 2 (berkas file di HP Android / iOS / PWA)
    let canShare = false;
    try {
      canShare = !!(navigator.canShare && navigator.canShare({ files: [pdfFile] }));
    } catch (e) {
      canShare = false;
    }

    if (canShare) {
      if (toast) toast.classList.remove('show');
      isSharingPdf = false;
      // Kirim HANYA berkas PDF dokumen tanpa caption teks tambahan (sesuai format bersih)
      await navigator.share({
        files: [pdfFile]
      });
      return;
    }
  } catch (err) {
    console.warn("Native file sharing dibatalkan atau tidak didukung:", err);
    if (err.name === 'AbortError') {
      // User membatalkan jendela dialog share
      if (toast) toast.classList.remove('show');
      isSharingPdf = false;
      return;
    }
  }

  if (toast) toast.classList.remove('show');
  isSharingPdf = false;

  // 3. Fallback jika dibuka di PC / browser yang belum mendukung share file langsung:
  fallbackShareDesktop(finalUrl, fileName, captionText);
};

function fallbackShareDesktop(fileUrl, fileName, captionText) {
  // Unduh otomatis file PDF dengan nama custom
  const a = document.createElement('a');
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Buka WhatsApp Web bersih tanpa teks tambahan
  window.open('https://web.whatsapp.com', '_blank');

  // Beri notifikasi panduan ke pengguna
  const toast = document.getElementById('shareToast');
  if (toast) {
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="margin-right:6px;color:#10b981;"></i> File PDF diunduh! Silakan lampirkan ke chat WhatsApp.`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
  }
}

window.shareBrosurModal = function () {
  const title = document.getElementById('pdfModalTitle');
  const btnDownload = document.getElementById('btnDownloadPdf');
  if (title && btnDownload) {
    window.shareBrosur(title.textContent, btnDownload.href);
  }
};

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => showToast())
    .catch(() => {
      // Fallback
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      showToast();
    });
}

function showToast() {
  const toast = document.getElementById('shareToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ─── Search handlers ─────────────────────────────────────
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

searchInput.addEventListener('input', () => {
  searchQuery = searchInput.value.trim();
  searchClear.classList.toggle('visible', searchQuery.length > 0);
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fetchBrosur(), 350);
});

searchClear.addEventListener('click', () => {
  searchInput.value = '';
  searchQuery = '';
  searchClear.classList.remove('visible');
  fetchBrosur();
  searchInput.focus();
});

// ─── Helpers ─────────────────────────────────────────────
function capitalize(str) {
  return str.toLowerCase().split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function escHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', fetchBrosur);
