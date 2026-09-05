<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Galeri Foto Aktivitas</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/riwayat_foto_aktivitas.css?v=20260819_2">
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#0d1b3e">
</head>

<body>
  <div class="mobile-app" style="padding-bottom: 60px;">
    
    <!-- Top Header -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Galeri Foto Aktivitas</h2>
      <div style="display: flex; gap: 10px; align-items: center;">
        <a href="foto_group_aktivitas.html" style="font-size: 11.5px; font-weight: 800; color: #128c7e; text-decoration: none;">
          <i class="fa-brands fa-whatsapp"></i> Kelola WA
        </a>
      </div>
    </header>

    <div class="container" style="margin-top: 15px;">
      
      <!-- Top Hero Header Bar -->
      <div class="gallery-top-hero">
        <div class="hero-left">
          <h1>
            <i class="fa-solid fa-images" style="color: #ef4444;"></i>
            Galeri Dokumentasi Foto
          </h1>
          <p>Khusus dokumentasi foto kegiatan pameran &amp; event cabang</p>
        </div>

        <div class="hero-right-actions">
          <div style="background: rgba(255,255,255,0.15); padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; color: #ffffff;">
            <i class="fa-solid fa-camera"></i> <span id="photoTotalCount">...</span> Foto
          </div>
          <button type="button" class="view-mode-btn active" id="btnGridCompact" onclick="setViewDensity('compact')" title="Grid Rapat (Banyak Foto Sekaligus)">
            <i class="fa-solid fa-grip"></i>
          </button>
          <button type="button" class="view-mode-btn" id="btnGridNormal" onclick="setViewDensity('normal')" title="Grid Sedang">
            <i class="fa-solid fa-table-cells-large"></i>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div id="galleryLoading" style="text-align:center; padding: 50px 20px; font-size: 13px; color: var(--text-muted);">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 30px; margin-bottom: 12px; color: var(--primary-red);"></i><br>
        Memuat seluruh foto aktivitas...
      </div>

      <!-- Timeline & Photo Wall Container -->
      <div id="galleryContainer"></div>

    </div>
  </div>

  <!-- Fullscreen Lightbox Modal -->
  <div id="galleryLightbox" class="gallery-lightbox-modal">
    <div class="lightbox-top-bar">
      <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
        <span style="font-size: 13px; font-weight: 800;" id="lightboxDateLabel">Foto Aktivitas</span>
      </div>
      <div style="display: flex; gap: 10px; align-items: center;">
        <button type="button" style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 15px;" onclick="shareCurrentPhoto()" title="Share WhatsApp">
          <i class="fa-brands fa-whatsapp"></i>
        </button>
        <a id="lightboxDownloadBtn" href="#" download style="background: rgba(255,255,255,0.15); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none;" title="Unduh Foto">
          <i class="fa-solid fa-download"></i>
        </a>
        <button type="button" style="background: rgba(239, 68, 68, 0.85); border: none; color: #fff; width: 34px; height: 34px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px;" onclick="closeGalleryLightbox()" title="Tutup">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>

    <div class="lightbox-img-stage">
      <button type="button" class="lightbox-nav-btn prev" onclick="prevLightboxPhoto(event)">
        <i class="fa-solid fa-chevron-left"></i>
      </button>
      
      <img id="lightboxMainImage" src="" alt="Foto Aktivitas Sales">

      <button type="button" class="lightbox-nav-btn next" onclick="nextLightboxPhoto(event)">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>

    <div class="lightbox-bottom-info">
      <div>
        <div style="font-size: 12px; opacity: 0.9;" id="lightboxFilenameLabel">Foto Kegiatan</div>
      </div>
      <div style="font-size: 12px; font-weight: 700; opacity: 0.9;" id="lightboxIndexCounter">
        Foto 1 dari 121
      </div>
    </div>
  </div>

  <script src="../js/riwayat_foto_aktivitas.js?v=20260905_pameran_event"></script>
</body>

</html>
