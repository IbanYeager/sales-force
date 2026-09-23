/**
 * js/riwayat_foto_aktivitas.js
 * Modern Clean Continuous Photo Wall Gallery
 */

let allPhotos = [];
let currentFilteredPhotos = [];
let searchQuery = '';
let currentLightboxIndex = 0;
let currentViewDensity = 'compact'; // 'compact' or 'normal'

function getApiEndpoint(endpoint) {
  const isNested = window.location.pathname.includes('/pages/') || 
                   window.location.pathname.includes('/pages_kacab/') || 
                   window.location.pathname.includes('/pages_spv/') || 
                   window.location.pathname.includes('/kacab/') || 
                   window.location.pathname.includes('/spv/');
  return (isNested ? '../api/' : 'api/') + endpoint;
}

function getGalleryImageUrl(relPath) {
  if (!relPath) return '';
  if (relPath.startsWith('http://') || relPath.startsWith('https://') || relPath.startsWith('data:')) {
    return relPath;
  }
  const clean = relPath.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
  const isNested = window.location.pathname.includes('/pages/') || 
                   window.location.pathname.includes('/pages_kacab/') || 
                   window.location.pathname.includes('/pages_spv/') || 
                   window.location.pathname.includes('/kacab/') || 
                   window.location.pathname.includes('/spv/');
  return (isNested ? '../' : '') + clean;
}

async function fetchGalleryData() {
  const loading = document.getElementById('galleryLoading');
  try {
    const res = await fetch(getApiEndpoint('api_riwayat_aktivitas_foto.php'));
    const json = await res.json();

    if (json.status === 'success') {
      allPhotos = json.photos || [];

      // Update total counter
      const countEl = document.getElementById('photoTotalCount');
      if (countEl) countEl.textContent = allPhotos.length;

      applyFiltersAndRender();

      if (loading) loading.style.display = 'none';
    } else {
      if (loading) loading.innerHTML = '<div style="color: var(--primary-red);"><i class="fa-solid fa-triangle-exclamation"></i> Gagal memuat data foto.</div>';
    }
  } catch (err) {
    console.error("Error fetching gallery:", err);
    if (loading) loading.innerHTML = '<div style="color: var(--primary-red);"><i class="fa-solid fa-link-slash"></i> Gagal menghubungi server.</div>';
  }
}

function setViewDensity(mode) {
  currentViewDensity = mode;
  const btnCompact = document.getElementById('btnGridCompact');
  const btnNormal = document.getElementById('btnGridNormal');
  if (btnCompact && btnNormal) {
    if (mode === 'compact') {
      btnCompact.classList.add('active');
      btnNormal.classList.remove('active');
    } else {
      btnNormal.classList.add('active');
      btnCompact.classList.remove('active');
    }
  }
  applyFiltersAndRender();
}

function applyFiltersAndRender() {
  currentFilteredPhotos = allPhotos.filter(item => {
    const tipe = (item.tipe_aktivitas || '').toLowerCase();
    const ket = (item.keterangan || '').toLowerCase();
    const fUrl = (item.file_url || '').toLowerCase();

    // Strict exclusion for non-pameran/event
    if (tipe.includes('tiktok') || tipe.includes('database') || tipe.includes('digital marketing') || tipe.includes('meeting') || tipe.includes('kebersamaan') || tipe.includes('makan')) {
      return false;
    }

    const isAllowed = tipe.includes('pameran') || 
                      tipe.includes('event') || 
                      tipe.includes('booth') || 
                      tipe.includes('gathering') || 
                      tipe.includes('exhibition') || 
                      ket.includes('pameran') || 
                      ket.includes('event') || 
                      ket.includes('borma') || 
                      ket.includes('mall') || 
                      fUrl.includes('aktivitas');
    return isAllowed;
  });

  const countEl = document.getElementById('photoTotalCount');
  if (countEl) countEl.textContent = currentFilteredPhotos.length;

  renderGalleryTimeline(currentFilteredPhotos);
}

function renderGalleryTimeline(photos) {
  const container = document.getElementById('galleryContainer');
  if (!container) return;

  if (photos.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 45px 20px; background:#ffffff; border-radius:18px; border:1px dashed #cbd5e1; margin-top:10px;">
        <div style="width:50px; height:50px; border-radius:50%; background:#f1f5f9; color:#94a3b8; display:inline-flex; align-items:center; justify-content:center; font-size:20px; margin-bottom:10px;">
          <i class="fa-solid fa-camera-slash"></i>
        </div>
        <div style="font-size:14px; font-weight:800; color:#1e293b;">Belum Ada Foto Pameran & Event</div>
        <div style="font-size:11.5px; color:#64748b; margin-top:4px;">Foto aktivitas pameran dan event lapangan akan otomatis muncul di sini.</div>
      </div>
    `;
    return;
  }

  const gridStyle = currentViewDensity === 'normal' ? 'grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));' : '';

  let html = `<div class="compact-photo-grid" style="${gridStyle}; margin-top: 10px;">`;

  photos.forEach((item, globalIndex) => {
    const encodedUrl = getGalleryImageUrl(item.file_url);

    html += `
      <div class="gallery-photo-card" onclick="openLightbox(${globalIndex})" title="Klik untuk perbesar">
        <img src="${encodedUrl}" alt="${item.tipe_aktivitas || 'Foto Aktivitas'}" loading="lazy">
        <div class="photo-clean-hover">
          <div class="hover-expand-circle">
            <i class="fa-solid fa-expand"></i>
          </div>
        </div>
      </div>
    `;
  });

  html += `</div>`;

  container.innerHTML = html;
}

// Lightbox Logic
function openLightbox(index) {
  if (index < 0 || index >= currentFilteredPhotos.length) return;
  currentLightboxIndex = index;
  updateLightboxContent();

  const modal = document.getElementById('galleryLightbox');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function updateLightboxContent() {
  const item = currentFilteredPhotos[currentLightboxIndex];
  if (!item) return;

  const encodedUrl = getGalleryImageUrl(item.file_url);
  const imgEl = document.getElementById('lightboxMainImage');
  if (imgEl) imgEl.src = encodedUrl;

  const dateLabel = document.getElementById('lightboxDateLabel');
  if (dateLabel) {
    const tipeTag = item.tipe_aktivitas ? ` • ${item.tipe_aktivitas}` : '';
    dateLabel.textContent = `${item.date_formatted || 'Foto Kegiatan'}${tipeTag}`;
  }
  
  const tagEl = document.getElementById('lightboxSessionTag');
  if (tagEl) tagEl.style.display = 'none';

  const timeLabel = document.getElementById('lightboxTimeLabel');
  if (timeLabel) timeLabel.style.display = 'none';

  const fnLabel = document.getElementById('lightboxFilenameLabel');
  if (fnLabel) {
    const salesText = item.nama_sales ? `<strong>${item.nama_sales}</strong> — ` : '';
    fnLabel.innerHTML = `${salesText}${item.keterangan || item.tipe_aktivitas || item.file_name || 'Foto Kegiatan'}`;
  }

  const counterEl = document.getElementById('lightboxIndexCounter');
  if (counterEl) counterEl.textContent = `Foto ${currentLightboxIndex + 1} dari ${currentFilteredPhotos.length}`;

  const downloadBtn = document.getElementById('lightboxDownloadBtn');
  if (downloadBtn) {
    downloadBtn.href = encodedUrl;
    downloadBtn.download = item.file_name || 'aktivitas.jpg';
  }
}

function prevLightboxPhoto(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (currentLightboxIndex > 0) {
    currentLightboxIndex--;
  } else {
    currentLightboxIndex = currentFilteredPhotos.length - 1;
  }
  updateLightboxContent();
}

function nextLightboxPhoto(e) {
  if (e && e.stopPropagation) e.stopPropagation();
  if (currentLightboxIndex < currentFilteredPhotos.length - 1) {
    currentLightboxIndex++;
  } else {
    currentLightboxIndex = 0;
  }
  updateLightboxContent();
}

function closeGalleryLightbox() {
  const modal = document.getElementById('galleryLightbox');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

let toastTimer = null;
function showGalleryToast(htmlContent, type = 'info', duration = 3500) {
  const toast = document.getElementById('galleryToast');
  if (!toast) return;
  if (toastTimer) clearTimeout(toastTimer);
  toast.innerHTML = htmlContent;
  toast.classList.add('show');
  if (duration > 0) {
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }
}

function hideGalleryToast() {
  const toast = document.getElementById('galleryToast');
  if (toast) toast.classList.remove('show');
}

function convertBlobToPng(blob) {
  return new Promise((resolve) => {
    if (blob.type === 'image/png') {
      return resolve(blob);
    }
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((pngBlob) => {
        resolve(pngBlob || blob);
      }, 'image/png');
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    img.src = url;
  });
}

async function shareCurrentPhoto() {
  const item = currentFilteredPhotos[currentLightboxIndex];
  if (!item) return;

  const btn = document.getElementById('lightboxShareWABtn');
  if (btn) btn.disabled = true;

  showGalleryToast('<i class="fa-solid fa-spinner fa-spin" style="margin-right:6px;"></i> Menyiapkan foto untuk WhatsApp...', 'info', 0);

  try {
    const encodedUrl = getGalleryImageUrl(item.file_url);
    const res = await fetch(encodedUrl);
    if (!res.ok) throw new Error('Gagal mengunduh file foto.');
    
    const blob = await res.blob();
    const mimeType = blob.type || 'image/jpeg';
    const filename = item.file_name || 'foto_aktivitas.jpeg';
    const photoFile = new File([blob], filename, { type: mimeType });

    // 1. Kirim BERKAS FOTO LANGSUNG via Web Share API (Didukung penuh di HP Android & iOS)
    let canShareFile = false;
    try {
      canShareFile = navigator.canShare && navigator.canShare({ files: [photoFile] });
    } catch (e) {
      canShareFile = false;
    }

    if (canShareFile) {
      hideGalleryToast();
      await navigator.share({
        files: [photoFile],
        title: 'Foto Aktivitas Tunas Toyota'
      });
      if (btn) btn.disabled = false;
      return;
    }

    // 2. Fallback untuk Desktop / Komputer / Browser Tanpa Web Share File:
    // Salin foto langsung ke Clipboard agar bisa langsung di-Paste (Ctrl+V) di chat WhatsApp
    let copiedToClipboard = false;
    try {
      const pngBlob = await convertBlobToPng(blob);
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': pngBlob })
        ]);
        copiedToClipboard = true;
      }
    } catch (clipErr) {
      console.warn('Clipboard write image failed:', clipErr);
    }

    // Unduh otomatis file foto agar siap di-drag/lampirkan
    const dlLink = document.createElement('a');
    dlLink.href = URL.createObjectURL(blob);
    dlLink.download = filename;
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    // Buka WhatsApp Web
    window.open('https://web.whatsapp.com/', '_blank');

    if (copiedToClipboard) {
      showGalleryToast('<i class="fa-solid fa-circle-check" style="color:#10b981; margin-right:6px;"></i> Foto telah disalin! Tekan <b>Ctrl + V</b> (Paste) langsung di chat WhatsApp.', 'success', 5000);
    } else {
      showGalleryToast('<i class="fa-solid fa-circle-check" style="color:#10b981; margin-right:6px;"></i> Foto telah diunduh! Silakan lampirkan langsung ke chat WhatsApp.', 'success', 5000);
    }

  } catch (err) {
    console.error('Error sharing photo:', err);
    if (err.name === 'AbortError') {
      // User membatalkan dialog share
      hideGalleryToast();
    } else {
      showGalleryToast('<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444; margin-right:6px;"></i> Gagal membagikan foto.', 'error', 3000);
    }
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Keyboard shortcuts for lightbox navigation
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('galleryLightbox');
  if (modal && modal.classList.contains('active')) {
    if (e.key === 'ArrowLeft') prevLightboxPhoto();
    if (e.key === 'ArrowRight') nextLightboxPhoto();
    if (e.key === 'Escape') closeGalleryLightbox();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  fetchGalleryData();
});
