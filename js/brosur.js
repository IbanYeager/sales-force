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
  const container = document.getElementById('brosurContainer');
  if (!container) return;

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
  if (!tabsEl) return;
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

let canvas = null,
  ctx = null;

let pdfCurrentZoom = 1.0;
let pdfBaseFitWidth = 0;

function getPdfCanvas() {
  if (!canvas) {
    canvas = document.getElementById('pdfCanvas');
    if (canvas) {
      ctx = canvas.getContext('2d');
      // Tap/click canvas to zoom in or zoom out
      canvas.addEventListener('click', () => {
        if (!canvas || !pdfDoc) return;
        if (pdfCurrentZoom <= 1.05) {
          window.zoomPdf(0.4);
        } else {
          window.fitPdfWidth();
        }
      });
    }
  }
  return canvas;
}

// Pastikan worker pdf.js dimuat
if (window['pdfjs-dist/build/pdf']) {
  window.pdfjsLib = window['pdfjs-dist/build/pdf'];
}
if (window.pdfjsLib) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
}

window.zoomPdf = function (delta) {
  if (!pdfDoc) return;
  let newZoom = Math.round((pdfCurrentZoom + delta) * 10) / 10;
  if (newZoom < 0.6) newZoom = 0.6;
  if (newZoom > 3.0) newZoom = 3.0;
  if (newZoom === pdfCurrentZoom) return;
  pdfCurrentZoom = newZoom;
  updatePdfZoomDisplay();
  applyPdfCanvasSize();
};

window.fitPdfWidth = function () {
  if (!pdfDoc) return;
  pdfCurrentZoom = 1.0;
  updatePdfZoomDisplay();
  applyPdfCanvasSize();
};

function updatePdfZoomDisplay() {
  const lbl = document.getElementById('pdfZoomLabel');
  if (lbl) lbl.textContent = Math.round(pdfCurrentZoom * 100) + '%';
  if (canvas) {
    canvas.style.cursor = pdfCurrentZoom <= 1.05 ? 'zoom-in' : 'zoom-out';
  }
}

let pdfBaseDisplayWidth = 0;
let pdfBaseDisplayHeight = 0;

function applyPdfCanvasSize() {
  if (!canvas || !pdfBaseDisplayWidth) return;
  const targetWidth = Math.round(pdfBaseDisplayWidth * pdfCurrentZoom);
  const targetHeight = Math.round(pdfBaseDisplayHeight * pdfCurrentZoom);
  canvas.style.width = targetWidth + 'px';
  canvas.style.height = targetHeight + 'px';
  canvas.style.maxWidth = 'none';
  updatePdfZoomDisplay();
}

let currentRenderTask = null;

function renderPage(num) {
  if (currentRenderTask) {
    try {
      currentRenderTask.cancel();
    } catch (e) {}
    currentRenderTask = null;
  }
  pageIsRendering = true;
  getPdfCanvas();
  if (!canvas || !ctx || !pdfDoc) {
    pageIsRendering = false;
    return;
  }

  const loadingEl = document.getElementById('pdfLoading');
  if (loadingEl) loadingEl.style.display = 'flex';

  pdfDoc.getPage(num).then(page => {
    const unscaledViewport = page.getViewport({ scale: 1.0 });

    // Calculate maximum available space in viewport
    const maxAvailW = Math.min(window.innerWidth * 0.90, 1050);
    const maxAvailH = Math.min(window.innerHeight * 0.80, 800);

    // Compute base scale that fits BOTH width and height snugly without empty letterboxes
    const scaleW = maxAvailW / unscaledViewport.width;
    const scaleH = maxAvailH / unscaledViewport.height;
    const baseFitScale = Math.min(scaleW, scaleH);

    // Exact display dimensions fitting the brochure proportions
    pdfBaseDisplayWidth = Math.round(unscaledViewport.width * baseFitScale);
    pdfBaseDisplayHeight = Math.round(unscaledViewport.height * baseFitScale);

    // Render at crisp high-DPI (2.0x base scale)
    const renderScale = baseFitScale * 2.0;
    const viewport = page.getViewport({ scale: renderScale });

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    applyPdfCanvasSize();

    const renderCtx = { canvasContext: ctx, viewport: viewport };
    currentRenderTask = page.render(renderCtx);
    currentRenderTask.promise.then(() => {
      pageIsRendering = false;
      currentRenderTask = null;
      if (loadingEl) loadingEl.style.display = 'none';
      if (canvas) canvas.style.display = 'block';

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }

      // Update lightbox if active
      const lightbox = document.getElementById('pdfLightbox');
      if (lightbox && lightbox.classList.contains('show')) {
        const dataUrl = canvas.toDataURL('image/png');
        const lbImg = document.getElementById('pdfLightboxImg');
        const lbBg = document.getElementById('pdfLightboxBg');
        if (lbImg) lbImg.src = dataUrl;
        if (lbBg) lbBg.style.backgroundImage = `url(${dataUrl})`;
        const pNum = document.getElementById('pdfLightboxPageNum');
        if (pNum) pNum.textContent = num;
      }
    }).catch(err => {
      if (err && err.name === 'RenderingCancelledException') {
        return;
      }
      console.error("page.render error:", err);
      pageIsRendering = false;
      currentRenderTask = null;
      if (loadingEl) loadingEl.style.display = 'none';
    });

    const pNumEl = document.getElementById('pdfPageNum');
    if (pNumEl) pNumEl.textContent = num;
  }).catch(err => {
    console.error("pdfDoc.getPage error:", err);
    pageIsRendering = false;
    if (loadingEl) loadingEl.style.display = 'none';
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
  if (!pdfDoc || pageNum >= pdfDoc.numPages) return;
  pageNum++;
  queueRenderPage(pageNum);
}

document.addEventListener('DOMContentLoaded', () => {
  const btnPrev = document.getElementById('btnPrevPdf');
  if (btnPrev) btnPrev.addEventListener('click', showPrevPage);
  const btnNext = document.getElementById('btnNextPdf');
  if (btnNext) btnNext.addEventListener('click', showNextPage);
  const btnPrevLb = document.getElementById('btnPrevLightbox');
  if (btnPrevLb) btnPrevLb.addEventListener('click', showPrevPage);
  const btnNextLb = document.getElementById('btnNextLightbox');
  if (btnNextLb) btnNextLb.addEventListener('click', showNextPage);
});

// Keyboard Navigation & Shortcuts
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('pdfModal');
  if (!modal || !modal.classList.contains('show')) return;

  if (e.key === 'Escape') {
    closePdfModal();
  } else if (e.key === 'ArrowLeft') {
    showPrevPage();
  } else if (e.key === 'ArrowRight') {
    showNextPage();
  } else if (e.key === '+' || e.key === '=') {
    zoomPdf(0.2);
  } else if (e.key === '-' || e.key === '_') {
    zoomPdf(-0.2);
  }
});

let pdfResizeTimer = null;
window.addEventListener('resize', () => {
  const modal = document.getElementById('pdfModal');
  if (modal && modal.classList.contains('show') && pdfDoc) {
    clearTimeout(pdfResizeTimer);
    pdfResizeTimer = setTimeout(() => {
      renderPage(pageNum);
    }, 200);
  }
});

window.closePdfLightbox = function () {
  const lb = document.getElementById('pdfLightbox');
  if (lb) lb.classList.remove('show');
};

window.openPdfModal = function (nama, url) {
  const cleanFilename = (url || '').split('/').pop().split('?')[0];
  const finalUrl = url.startsWith('http') ? url : `../uploads/brosur/${cleanFilename}`;
  const proxyUrl = `../api/proxy_pdf.php?file=${encodeURIComponent(cleanFilename)}`;

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

  if (loadingEl) {
    loadingEl.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin" style="font-size:28px; color:#38bdf8;"></i>
      <span style="font-size:13px; font-weight:600; color:#f8fafc; letter-spacing:0.3px;">Memuat Brosur...</span>
    `;
    loadingEl.style.display = 'flex';
  }
  if (controlsEl) controlsEl.style.display = 'none';
  getPdfCanvas();
  if (canvas) canvas.style.display = 'none';

  // Reset zoom
  pdfCurrentZoom = 1.0;
  updatePdfZoomDisplay();

  if (window.pdfjsLib) {
    // Try direct native static URL first (native HTTP 206 Partial Content in Apache)
    pdfjsLib.getDocument(finalUrl).promise.then(pdfDoc_ => {
      pdfDoc = pdfDoc_;
      const pCount = document.getElementById('pdfPageCount');
      if (pCount) pCount.textContent = pdfDoc.numPages;
      if (controlsEl) controlsEl.style.display = 'flex';

      pageNum = 1;
      renderPage(pageNum);
    }).catch(err => {
      console.warn("Direct PDF load failed, falling back to proxy:", err);
      pdfjsLib.getDocument(proxyUrl).promise.then(pdfDoc_ => {
        pdfDoc = pdfDoc_;
        const pCount = document.getElementById('pdfPageCount');
        if (pCount) pCount.textContent = pdfDoc.numPages;
        if (controlsEl) controlsEl.style.display = 'flex';

        pageNum = 1;
        renderPage(pageNum);
      }).catch(err2 => {
        console.error("PDF load error via proxy:", err2);
        if (loadingEl) {
          loadingEl.innerHTML = `
            <i class="fa-solid fa-triangle-exclamation" style="font-size:24px; color:var(--primary-red); margin-bottom:8px;"></i>
            <span style="font-size:12px; color:#f8fafc; text-align:center;">Gagal memuat PDF.<br>Silakan klik tombol unduh di atas.</span>
          `;
        }
      });
    });
  } else {
    if (loadingEl) {
      loadingEl.innerHTML = '<span style="font-size:12px; color:#f8fafc;">PDF Viewer tidak didukung di browser ini.</span>';
    }
  }
};

window.closePdfModal = function () {
  const modal = document.getElementById('pdfModal');
  if (modal) modal.classList.remove('show');
  document.body.style.overflow = '';
  setTimeout(() => {
    if (ctx && canvas) ctx.clearRect(0, 0, canvas.width, canvas.height);
    const controls = document.getElementById('pdfControls');
    if (controls) controls.style.display = 'none';
    const loading = document.getElementById('pdfLoading');
    if (loading) loading.style.display = 'none';
    pdfDoc = null;
    pdfCurrentZoom = 1.0;
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
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchBrosurInput');
  const searchClear = document.getElementById('searchBrosurClear');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      searchQuery = searchInput.value.trim();
      if (searchClear) searchClear.classList.toggle('visible', searchQuery.length > 0);
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchBrosur(), 350);
    });
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClear.classList.remove('visible');
      fetchBrosur();
      searchInput.focus();
    });
  }
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
