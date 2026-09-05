/**
 * js/riwayat_foto_aktivitas.js
 * Modern Clean Continuous Photo Wall Gallery
 */

let allPhotos = [];
let currentFilteredPhotos = [];
let searchQuery = '';
let currentLightboxIndex = 0;
let currentViewDensity = 'compact'; // 'compact' or 'normal'

async function fetchGalleryData() {
  const loading = document.getElementById('galleryLoading');
  try {
    const res = await fetch('../api/api_riwayat_aktivitas_foto.php');
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

    // Strict exclusion for non-pameran/event
    if (tipe.includes('tiktok') || tipe.includes('database') || tipe.includes('digital marketing') || tipe.includes('meeting') || tipe.includes('kebersamaan') || tipe.includes('makan')) {
      return false;
    }

    const isAllowed = tipe.includes('pameran') || tipe.includes('event') || tipe.includes('booth') || tipe.includes('gathering') || ket.includes('pameran') || ket.includes('event') || (item.file_url && item.file_url.includes('aktivitas'));
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
    const encodedUrl = '../' + item.file_url;

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

  const encodedUrl = '../' + item.file_url;
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

function shareCurrentPhoto() {
  const item = currentFilteredPhotos[currentLightboxIndex];
  if (!item) return;
  const encodedUrl = window.location.origin + '/sft/' + item.file_url;
  const text = `Dokumentasi Foto Aktivitas Tunas Toyota:\n📸 Foto: ${encodedUrl}`;
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
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
