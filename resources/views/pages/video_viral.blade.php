<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Video Viral Tunas Toyota Kiara Condong</title>
  <meta name="description" content="Koleksi Video Viral TikTok, Instagram Reels & YouTube Shorts Resmi Tunas Toyota Kiara Condong untuk Bahan Promosi & Inspirasi Sales">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v=5.0">
  <script src="../js/sidebar_desktop.js?v=20260914_viral"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#0f172a">

  <style>
    :root {
      --primary-red: #c8102e;
      --tiktok-cyan: #00f2fe;
      --tiktok-red: #fe2c55;
      --ig-gradient: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      --yt-red: #ff0000;
      --wa-green: #25D366;
    }

    body {
      background: #f8fafc;
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }

    .viral-hero-banner {
      background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #31101e 100%);
      border-radius: 20px;
      padding: 24px;
      color: white;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(15, 23, 42, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .viral-hero-banner::before {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(254, 44, 85, 0.25) 0%, transparent 70%);
      border-radius: 50%;
    }

    .viral-hero-banner::after {
      content: '';
      position: absolute;
      bottom: -40px;
      left: 20%;
      width: 160px;
      height: 160px;
      background: radial-gradient(circle, rgba(0, 242, 254, 0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .viral-badge-header {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(254, 44, 85, 0.2);
      border: 1px solid rgba(254, 44, 85, 0.5);
      color: #ff6b8b;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    /* Stats bar */
    .viral-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 20px;
    }

    .stat-box {
      background: rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 12px 14px;
    }

    .stat-box .num {
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .stat-box .lbl {
      font-size: 11px;
      color: #94a3b8;
      margin-top: 2px;
    }

    /* Filter & Search Toolbar */
    .viral-toolbar {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 22px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
    }

    .search-input-wrapper i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 14px;
    }

    .search-input-wrapper input {
      width: 100%;
      box-sizing: border-box;
      padding: 13px 16px 13px 44px;
      border-radius: 14px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-size: 13.5px;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
    }

    .search-input-wrapper input:focus {
      border-color: #c8102e;
      box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
    }

    /* Category pills */
    .category-pills-wrap {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: thin;
    }

    .category-pills-wrap::-webkit-scrollbar {
      height: 4px;
    }

    .category-pill {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 8px 16px;
      border-radius: 30px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .category-pill:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }

    .category-pill.active {
      background: #c8102e;
      color: #ffffff;
      border-color: #c8102e;
      box-shadow: 0 4px 12px rgba(200, 16, 46, 0.25);
    }

    /* Video Grid */
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 20px;
    }

    /* Video Card */
    .video-card {
      background: #ffffff;
      border-radius: 18px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      transition: transform 0.25s, box-shadow 0.25s;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .video-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
      border-color: #cbd5e1;
    }

    /* Video Thumbnail Container (Reels Aspect Ratio 9:14) */
    .video-thumb-container {
      position: relative;
      width: 100%;
      padding-top: 130%; /* Portrait Reels Aspect */
      background: #0b0f19;
      overflow: hidden;
      cursor: pointer;
    }

    .video-thumb-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    .video-card:hover .video-thumb-img {
      transform: scale(1.04);
    }

    .video-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.85) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 14px;
    }

    /* Platform badge */
    .platform-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10.5px;
      font-weight: 800;
      color: white;
      backdrop-filter: blur(8px);
      width: fit-content;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .platform-badge.tiktok {
      background: rgba(0, 0, 0, 0.75);
      border: 1px solid rgba(254, 44, 85, 0.5);
    }
    .platform-badge.tiktok i {
      color: #fe2c55;
    }

    .platform-badge.instagram {
      background: var(--ig-gradient);
    }

    .platform-badge.youtube {
      background: #ff0000;
    }

    /* Play Button Hover Effect */
    .play-button-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(200, 16, 46, 0.85);
      backdrop-filter: blur(6px);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      padding-left: 3px;
      box-shadow: 0 0 25px rgba(200, 16, 46, 0.6);
      transition: all 0.25s;
    }

    .video-card:hover .play-button-center {
      transform: translate(-50%, -50%) scale(1.15);
      background: #c8102e;
      box-shadow: 0 0 35px rgba(200, 16, 46, 0.85);
    }

    /* Metric stats on overlay */
    .video-metrics-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-size: 11.5px;
      font-weight: 700;
      text-shadow: 0 1px 3px rgba(0,0,0,0.8);
    }

    .video-metrics-bar .views {
      display: flex;
      align-items: center;
      gap: 5px;
      background: rgba(0, 0, 0, 0.6);
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
    }

    .video-metrics-bar .views i {
      color: #f59e0b;
    }

    /* Card Details */
    .video-details {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
    }

    .video-category-tag {
      font-size: 11px;
      font-weight: 800;
      color: #c8102e;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .video-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .video-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 14px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Action Buttons */
    .video-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .btn-watch {
      flex: 1.2;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 9px 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-watch:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }

    .btn-wa-share {
      flex: 1.4;
      background: #25D366;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 9px 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-wa-share:hover {
      background: #1da851;
      transform: translateY(-1px);
    }

    .btn-copy {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      width: 36px;
      height: 36px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
    }

    .btn-copy:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    /* Modal Player Styles */
    .video-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 16px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .video-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .video-modal-box {
      background: #111827;
      border-radius: 20px;
      width: 100%;
      max-width: 440px;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .modal-close-btn {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.6);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      font-size: 14px;
    }

    .video-embed-wrapper {
      position: relative;
      width: 100%;
      height: 380px;
      background: #030712;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .video-embed-wrapper iframe, 
    .video-embed-wrapper video {
      width: 100%;
      height: 100%;
      border: none;
      object-fit: cover;
    }

    .video-modal-body {
      padding: 18px;
    }

    /* Modal Form for Add Video */
    .modal-form-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 14px;
      border-radius: 10px;
      border: 1px solid #374151;
      background: #1f2937;
      color: white;
      font-size: 13px;
      margin-bottom: 12px;
      outline: none;
    }
    .modal-form-input:focus {
      border-color: #ef4444;
    }
  </style>
</head>

<body>
  <div class="mobile-app">
    <!-- Header Page -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Koleksi Video Viral Kircon</h2>
      <button onclick="openAddVideoModal()" style="margin-left: auto; background: #c8102e; color: white; border: none; padding: 6px 12px; border-radius: 10px; font-weight: 700; font-size: 11.5px; cursor: pointer; display: flex; align-items: center; gap: 5px;">
        <i class="fa-solid fa-plus"></i> Tambah
      </button>
    </header>

    <div class="content-body" style="padding: 16px;">

      <!-- HERO BANNER -->
      <div class="viral-hero-banner">
        <div class="viral-badge-header">
          <i class="fa-solid fa-fire"></i> Trending Showroom Content
        </div>
        <h1 style="font-size: 22px; font-weight: 900; margin: 0 0 6px 0; line-height: 1.25;">
          Galeri Video Viral Tunas Toyota Kiara Condong
        </h1>
        <p style="font-size: 13px; color: #cbd5e1; margin: 0; line-height: 1.5;">
          Kumpulan momen serah terima haru, bedah fitur unik Zenix &amp; Alphard, tren TikTok sales, serta inspirasi promosi siap bagikan ke WhatsApp calon konsumen!
        </p>

        <!-- Stats Grid -->
        <div class="viral-stats-grid">
          <div class="stat-box">
            <div class="num" id="statTotalViews">5.2M+</div>
            <div class="lbl">Total Penayangan</div>
          </div>
          <div class="stat-box">
            <div class="num" id="statTotalVideos">12 Video</div>
            <div class="lbl">Konten Viral</div>
          </div>
          <div class="stat-box">
            <div class="num"><i class="fa-brands fa-tiktok" style="color: #fe2c55;"></i> TikTok &amp; IG</div>
            <div class="lbl">Platform Utama</div>
          </div>
          <div class="stat-box">
            <div class="num" style="color: #34d399;"><i class="fa-brands fa-whatsapp"></i> 1-Klik WA</div>
            <div class="lbl">Bahan Broadcast</div>
          </div>
        </div>
      </div>

      <!-- SEARCH & FILTER TOOLBAR -->
      <div class="viral-toolbar">
        <div style="display: flex; gap: 10px;">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="viralSearchInput" placeholder="Cari video (contoh: Zenix, Delivery, Alphard, Tips, Promo)..." oninput="filterVideos()">
          </div>
        </div>

        <!-- Category Pills -->
        <div class="category-pills-wrap" id="categoryPillsContainer">
          <button class="category-pill active" onclick="selectCategory('all')">
            <i class="fa-solid fa-fire"></i> Semua Video
          </button>
          <button class="category-pill" onclick="selectCategory('delivery')">
            <i class="fa-solid fa-champagne-glasses"></i> Serah Terima Haru
          </button>
          <button class="category-pill" onclick="selectCategory('feature')">
            <i class="fa-solid fa-car-side"></i> Review &amp; Rahasia Fitur
          </button>
          <button class="category-pill" onclick="selectCategory('tips')">
            <i class="fa-solid fa-lightbulb"></i> Tips &amp; Edukasi
          </button>
          <button class="category-pill" onclick="selectCategory('parodi')">
            <i class="fa-solid fa-face-smile"></i> Tren &amp; Parodi Sales
          </button>
          <button class="category-pill" onclick="selectCategory('promo')">
            <i class="fa-solid fa-percent"></i> Promo &amp; Event
          </button>
        </div>
      </div>

      <!-- VIDEO GRID CONTAINER -->
      <div class="video-grid" id="viralVideoGrid">
        <!-- Rendered by JavaScript -->
      </div>

      <!-- EMPTY STATE -->
      <div id="viralEmptyState" style="display: none; text-align: center; padding: 40px 20px; background: white; border-radius: 16px; border: 1px dashed #cbd5e1; margin-top: 10px;">
        <i class="fa-solid fa-film" style="font-size: 38px; color: #cbd5e1; margin-bottom: 12px;"></i>
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Video Tidak Ditemukan</h3>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Coba gunakan kata kunci pencarian lain atau pilih kategori Semua Video.</p>
      </div>

    </div>
  </div>

  <!-- MODAL 1: VIDEO PLAYER MODAL -->
  <div class="video-modal-overlay" id="videoPlayerModal">
    <div class="video-modal-box">
      <button class="modal-close-btn" onclick="closeVideoModal()">
        <i class="fa-solid fa-xmark"></i>
      </button>
      
      <div class="video-embed-wrapper" id="videoModalPlayerArea">
        <!-- Injected via JS -->
      </div>

      <div class="video-modal-body">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
          <span id="modalVideoCategory" style="font-size: 11px; font-weight: 800; color: #ef4444; text-transform: uppercase;"></span>
          <span id="modalVideoPlatform" class="platform-badge tiktok"></span>
        </div>
        
        <h3 id="modalVideoTitle" style="font-size: 15px; font-weight: 800; margin: 0 0 8px 0; line-height: 1.35;"></h3>
        <p id="modalVideoDesc" style="font-size: 12.5px; color: #9ca3af; line-height: 1.5; margin: 0 0 16px 0;"></p>
        
        <div style="display: flex; gap: 8px;">
          <a id="modalWaShareBtn" href="#" target="_blank" class="btn-wa-share" style="padding: 10px 14px; font-size: 13px; border-radius: 12px; text-decoration: none;">
            <i class="fa-brands fa-whatsapp"></i> Bagikan ke WhatsApp
          </a>
          <a id="modalExternalLinkBtn" href="#" target="_blank" class="btn-watch" style="padding: 10px 14px; font-size: 13px; border-radius: 12px; text-decoration: none;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Asli
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- MODAL 2: TAMBAH VIDEO VIRAL BARU -->
  <div class="video-modal-overlay" id="addVideoModal">
    <div class="video-modal-box" style="background: #ffffff; color: #0f172a; max-width: 480px; padding: 22px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: #0f172a;">
          <i class="fa-solid fa-video" style="color: #c8102e;"></i> Tambah Video Viral Baru
        </h3>
        <button onclick="closeAddVideoModal()" style="background: none; border: none; font-size: 18px; color: #64748b; cursor: pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Judul Video:</label>
          <input type="text" id="newVideoTitle" class="modal-form-input" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;" placeholder="Contoh: Momen Haru Serah Terima Zenix Pertama di Kiara Condong">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Platform:</label>
            <select id="newVideoPlatform" class="modal-form-input" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;">
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
              <option value="youtube">YouTube Shorts</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Kategori:</label>
            <select id="newVideoCategory" class="modal-form-input" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;">
              <option value="delivery">Serah Terima Haru</option>
              <option value="feature">Review &amp; Rahasia Fitur</option>
              <option value="tips">Tips &amp; Edukasi</option>
              <option value="parodi">Tren &amp; Parodi Sales</option>
              <option value="promo">Promo &amp; Event</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Link Video / URL (TikTok/IG/YouTube):</label>
          <input type="url" id="newVideoUrl" class="modal-form-input" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;" placeholder="https://www.tiktok.com/@tunastoyotakircon/video/...">
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Jumlah Views / Tayangan (Opsional):</label>
          <input type="text" id="newVideoViews" class="modal-form-input" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1;" placeholder="Contoh: 850K Views">
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Deskripsi / Caption Penjualan:</label>
          <textarea id="newVideoDesc" class="modal-form-input" rows="3" style="background: #f8fafc; color: #0f172a; border-color: #cbd5e1; resize: vertical;" placeholder="Deskripsi singkat konten dan pesan yang ingin disampaikan ke konsumen..."></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button onclick="saveNewVideo()" style="flex: 1; background: #c8102e; color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer;">
            <i class="fa-solid fa-save"></i> Simpan Video
          </button>
          <button onclick="resetVideosToDefault()" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer;">
            Reset Default
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCRIPT DATA & LOGIC -->
  <script>
    // Initial Curated Viral Videos Collection from Tunas Toyota Kiara Condong
    const DEFAULT_VIRAL_VIDEOS = [
      {
        id: 'v1',
        title: 'Momen Haru Pak Dedi Menghadiahkan Zenix Hybrid Baru untuk Ultah Istri di Showroom Kircon 🥹❤️',
        category: 'delivery',
        categoryName: 'Serah Terima Haru',
        platform: 'tiktok',
        views: '1.8M Views',
        likes: '142K',
        author: '@tunastoyotakircon',
        desc: 'Momen penuh air mata bahagia saat serah terima unit Toyota All New Kijang Innova Zenix Q Hybrid Modellista. Spesial surprise kado ulang tahun istri tercinta di Showroom Tunas Toyota Kiara Condong.',
        thumbUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      },
      {
        id: 'v2',
        title: 'Rahasia Tombol Tersembunyi di Innova Zenix yang Jarang Diketahui Pemilik Toyota! 🤫💡',
        category: 'feature',
        categoryName: 'Review & Rahasia Fitur',
        platform: 'instagram',
        views: '940K Views',
        likes: '78K',
        author: '@tunastoyotakircon',
        desc: 'Spill fitur rahasia Auto Fold Mirror, pengaturan EV Mode cerdas, dan shortcut panoramic roof otomatis yang bikin penumpang takjub! Wajib share ke calon konsumen Zenix.',
        thumbUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.instagram.com/tunastoyota_kiaracondong',
        embedType: 'preview'
      },
      {
        id: 'v3',
        title: 'Delivery Mewah Alphard 2.5 Hybrid Plat D Pertama di Kircon dengan Karpet Merah VIP ✨🥂',
        category: 'delivery',
        categoryName: 'Serah Terima Haru',
        platform: 'tiktok',
        views: '1.2M Views',
        likes: '95K',
        author: '@tunastoyotakircon',
        desc: 'Standar sultan serah terima unit Toyota New Alphard Hybrid warna Platinum White Pearl Mica. Dilengkapi hand bouquet, cake spesial, dan sertifikat VIP Delivery Ceremony.',
        thumbUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      },
      {
        id: 'v4',
        title: 'POV: Reaksi Customer Pertama Kali Coba Mode EV Zenix Hybrid, "Mas Kok Suaranya Ga Ada?!" 😂🚗',
        category: 'parodi',
        categoryName: 'Tren & Parodi Sales',
        platform: 'tiktok',
        views: '820K Views',
        likes: '64K',
        author: '@tunastoyotakircon',
        desc: 'Lucu banget ekspresi calon pembeli saat test drive rute Kiara Condong - Buah Batu. Begitu mobil jalan dalam mode Full EV elektrik, langsung bengong saking heningnya!',
        thumbUrl: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      },
      {
        id: 'v5',
        title: 'Koleksi Delivery Calya Pertama Hasil Nabung 3 Tahun, Tangis Haru Satu Keluarga Pedagang Bandung 🥹🙏',
        category: 'delivery',
        categoryName: 'Serah Terima Haru',
        platform: 'tiktok',
        views: '1.5M Views',
        likes: '128K',
        author: '@tunastoyotakircon',
        desc: 'Perjuangan tidak mengkhianati hasil. Bapak penjual martabak di Kiara Condong akhirnya bisa bawa pulang Toyota New Calya untuk anak-istri tercinta.',
        thumbUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      },
      {
        id: 'v6',
        title: 'Bedah Fitur Toyota Safety Sense (TSS 3.0) Veloz: Ngerem Otomatis & Nahan Jalur Sendiri! 🛡️⚡',
        category: 'feature',
        categoryName: 'Review & Rahasia Fitur',
        platform: 'youtube',
        views: '670K Views',
        likes: '45K',
        author: '@tunastoyotakircon',
        desc: 'Uji coba fitur Pre-Collision System (PCS) dan Lane Departure Alert (LDA) di jalur lingkar Bandung bersama tim Sales Consultant Tunas Kiara Condong.',
        thumbUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.youtube.com',
        embedType: 'preview'
      },
      {
        id: 'v7',
        title: 'Tren Joget Sales Counter Kircon Waktu Target SPK Tembus 120% di Akhir Bulan! 💃🕺',
        category: 'parodi',
        categoryName: 'Tren & Parodi Sales',
        platform: 'tiktok',
        views: '730K Views',
        likes: '59K',
        author: '@tunastoyotakircon',
        desc: 'Keseruan kekompakan tim sales & admin Tunas Toyota Kircon merayakan pencapaian target penjualan bulanan. Energi positif siap melayani konsumen!',
        thumbUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      },
      {
        id: 'v8',
        title: 'Tips Merawat Baterai Hybrid Toyota Biar Awet 10 Tahun Lebih Tanpa Khawatir! 🔋✅',
        category: 'tips',
        categoryName: 'Tips & Edukasi',
        platform: 'instagram',
        views: '510K Views',
        likes: '38K',
        author: '@tunastoyotakircon',
        desc: 'Penjelasan servis berkala T-Care dari Service Advisor Tunas Toyota Kircon. Ternyata saringan pendingin baterai hybrid di bawah jok sangat penting dibersihkan berkala!',
        thumbUrl: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.instagram.com/tunastoyota_kiaracondong',
        embedType: 'preview'
      },
      {
        id: 'v9',
        title: 'Spill Promo Flash Sale Weekend Sales Tunas Toyota Kircon: DP Mulai 10 Jutaan + Free Servis! 🏷️🎉',
        category: 'promo',
        categoryName: 'Promo & Event',
        platform: 'tiktok',
        views: '620K Views',
        likes: '41K',
        author: '@tunastoyotakircon',
        desc: 'Video rangkuman event showroom weekend sales. Ada lucky dip voucher belanja 1 juta, hadiah langsung e-money, serta bunga spesial 0% tenor 1 tahun.',
        thumbUrl: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=600&q=80',
        videoUrl: 'https://www.tiktok.com/@tunastoyotakircon',
        embedType: 'preview'
      }
    ];

    let currentCategory = 'all';
    let currentVideos = [];

    function initViralVideos() {
      const stored = localStorage.getItem('sft_viral_videos');
      if (stored) {
        try {
          currentVideos = JSON.parse(stored);
        } catch(e) {
          currentVideos = DEFAULT_VIRAL_VIDEOS;
        }
      } else {
        currentVideos = DEFAULT_VIRAL_VIDEOS;
        localStorage.setItem('sft_viral_videos', JSON.stringify(currentVideos));
      }
      renderVideos();
      updateStats();
    }

    function updateStats() {
      const totalCount = currentVideos.length;
      document.getElementById('statTotalVideos').textContent = `${totalCount} Video`;
    }

    function selectCategory(cat) {
      currentCategory = cat;
      document.querySelectorAll('.category-pill').forEach(btn => btn.classList.remove('active'));
      if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
      }
      renderVideos();
    }

    function filterVideos() {
      renderVideos();
    }

    function renderVideos() {
      const query = (document.getElementById('viralSearchInput').value || '').toLowerCase().trim();
      const grid = document.getElementById('viralVideoGrid');
      const emptyState = document.getElementById('viralEmptyState');

      const filtered = currentVideos.filter(v => {
        const matchCategory = (currentCategory === 'all') || (v.category === currentCategory);
        const matchQuery = !query || 
          v.title.toLowerCase().includes(query) || 
          v.desc.toLowerCase().includes(query) || 
          v.categoryName.toLowerCase().includes(query);
        return matchCategory && matchQuery;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
      }

      emptyState.style.display = 'none';

      grid.innerHTML = filtered.map(video => {
        const platformIcon = video.platform === 'tiktok' 
          ? '<i class="fa-brands fa-tiktok"></i> TikTok' 
          : (video.platform === 'instagram' 
            ? '<i class="fa-brands fa-instagram"></i> Reels' 
            : '<i class="fa-brands fa-youtube"></i> Shorts');

        const platformClass = video.platform === 'tiktok' ? 'tiktok' : (video.platform === 'instagram' ? 'instagram' : 'youtube');

        return `
          <div class="video-card">
            <!-- Thumbnail & Overlay -->
            <div class="video-thumb-container" onclick="openVideoPlayer('${video.id}')">
              <img src="${video.thumbUrl}" alt="${video.title}" class="video-thumb-img" loading="lazy">
              <div class="video-thumb-overlay">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <span class="platform-badge ${platformClass}">${platformIcon}</span>
                  <span style="font-size: 11px; background: rgba(0,0,0,0.6); color: white; padding: 2px 7px; border-radius: 6px; font-weight: 700;">
                    ${video.author}
                  </span>
                </div>

                <div class="play-button-center">
                  <i class="fa-solid fa-play"></i>
                </div>

                <div class="video-metrics-bar">
                  <span class="views"><i class="fa-solid fa-fire"></i> ${video.views}</span>
                  <span><i class="fa-solid fa-heart" style="color: #fe2c55;"></i> ${video.likes}</span>
                </div>
              </div>
            </div>

            <!-- Card Details -->
            <div class="video-details">
              <div>
                <div class="video-category-tag">
                  <i class="fa-solid fa-tag"></i> ${video.categoryName}
                </div>
                <h3 class="video-title" title="${video.title}">${video.title}</h3>
                <p class="video-desc">${video.desc}</p>
              </div>

              <!-- Actions for Sales -->
              <div class="video-actions">
                <button onclick="openVideoPlayer('${video.id}')" class="btn-watch">
                  <i class="fa-solid fa-play"></i> Tonton
                </button>
                <button onclick="shareVideoToWa('${video.id}')" class="btn-wa-share">
                  <i class="fa-brands fa-whatsapp"></i> Share WA
                </button>
                <button onclick="copyVideoInfo('${video.id}')" class="btn-copy" title="Salin Link & Caption">
                  <i class="fa-solid fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }

    // Share Video to Consumer WhatsApp
    function shareVideoToWa(id) {
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const salesName = localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
      const text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨\n\nIzin share video viral seru & inspirasi resmi dari showroom kami nih:\n\n🎬 *${v.title}*\n\n"${v.desc}"\n\nTonton selengkapnya di tautan ini ya:\n👉 ${v.videoUrl}\n\nJika ingin simulasi hitungan kredit promo DP ringan atau jadwal test drive unitnya, saya siap bantu kapan saja ya Pak/Bu. Terima kasih! 🙏`;

      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    // Copy Video Info to Clipboard
    function copyVideoInfo(id) {
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const text = `🎬 ${v.title}\n\n${v.desc}\n\nLink: ${v.videoUrl}\n\n#TunasToyotaKircon #ToyotaBandung #SalesToyotaKircon`;
      navigator.clipboard.writeText(text);
      alert('✅ Info video & link berhasil disalin ke clipboard! Siap dijadikan status WhatsApp atau dibagikan ke konsumen.');
    }

    // Open Modal Video Player
    function openVideoPlayer(id) {
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      document.getElementById('modalVideoTitle').textContent = v.title;
      document.getElementById('modalVideoDesc').textContent = v.desc;
      document.getElementById('modalVideoCategory').textContent = v.categoryName;
      
      const modalPlatform = document.getElementById('modalVideoPlatform');
      modalPlatform.className = `platform-badge ${v.platform === 'tiktok' ? 'tiktok' : (v.platform === 'instagram' ? 'instagram' : 'youtube')}`;
      modalPlatform.innerHTML = v.platform === 'tiktok' 
        ? '<i class="fa-brands fa-tiktok"></i> TikTok' 
        : (v.platform === 'instagram' ? '<i class="fa-brands fa-instagram"></i> Reels' : '<i class="fa-brands fa-youtube"></i> Shorts');

      const modalPlayerArea = document.getElementById('videoModalPlayerArea');
      modalPlayerArea.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: #000;">
          <img src="${v.thumbUrl}" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.6;">
          <div style="position: absolute; text-align: center; padding: 20px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: #c8102e; color: white; display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 12px; box-shadow: 0 0 30px rgba(200,16,46,0.8); cursor: pointer;" onclick="window.open('${v.videoUrl}', '_blank')">
              <i class="fa-solid fa-play" style="margin-left: 4px;"></i>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: white; margin-bottom: 4px;">Tonton Langsung di Aplikasi ${v.platform.toUpperCase()}</div>
            <div style="font-size: 11px; color: #94a3b8;">Klik untuk membuka video resmi di platform aslinya</div>
          </div>
        </div>
      `;

      // Wire buttons
      document.getElementById('modalExternalLinkBtn').href = v.videoUrl;
      
      const salesName = localStorage.getItem('namaSales') || 'Sales Tunas Toyota';
      const waText = `Halo, tonton video viral Tunas Toyota Kircon ini yuk:\n*${v.title}*\nLink: ${v.videoUrl}`;
      document.getElementById('modalWaShareBtn').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(waText)}`;

      document.getElementById('videoPlayerModal').classList.add('active');
    }

    function closeVideoModal() {
      document.getElementById('videoPlayerModal').classList.remove('active');
    }

    // Modal Add Video
    function openAddVideoModal() {
      document.getElementById('addVideoModal').classList.add('active');
    }

    function closeAddVideoModal() {
      document.getElementById('addVideoModal').classList.remove('active');
    }

    function saveNewVideo() {
      const title = document.getElementById('newVideoTitle').value.trim();
      const platform = document.getElementById('newVideoPlatform').value;
      const category = document.getElementById('newVideoCategory').value;
      const url = document.getElementById('newVideoUrl').value.trim() || 'https://www.tiktok.com/@tunastoyotakircon';
      const views = document.getElementById('newVideoViews').value.trim() || 'Baru';
      const desc = document.getElementById('newVideoDesc').value.trim() || 'Video viral terbaru dari Tunas Toyota Kiara Condong.';

      if (!title) {
        alert('Mohon isi judul video!');
        return;
      }

      const catNames = {
        delivery: 'Serah Terima Haru',
        feature: 'Review & Rahasia Fitur',
        tips: 'Tips & Edukasi',
        parodi: 'Tren & Parodi Sales',
        promo: 'Promo & Event'
      };

      const newVideo = {
        id: 'v_' + Date.now(),
        title: title,
        category: category,
        categoryName: catNames[category] || 'Video Viral',
        platform: platform,
        views: views,
        likes: '1.2K',
        author: '@tunastoyotakircon',
        desc: desc,
        thumbUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
        videoUrl: url,
        embedType: 'preview'
      };

      currentVideos.unshift(newVideo);
      localStorage.setItem('sft_viral_videos', JSON.stringify(currentVideos));
      
      closeAddVideoModal();
      renderVideos();
      updateStats();
      alert('🎉 Video viral baru berhasil ditambahkan!');

      // Reset form
      document.getElementById('newVideoTitle').value = '';
      document.getElementById('newVideoUrl').value = '';
      document.getElementById('newVideoViews').value = '';
      document.getElementById('newVideoDesc').value = '';
    }

    function resetVideosToDefault() {
      if (confirm('Kembalikan koleksi video ke daftar default Tunas Toyota Kiara Condong?')) {
        currentVideos = DEFAULT_VIRAL_VIDEOS;
        localStorage.setItem('sft_viral_videos', JSON.stringify(currentVideos));
        renderVideos();
        updateStats();
        closeAddVideoModal();
      }
    }

    // Close modal on escape or background click
    window.addEventListener('click', (e) => {
      const modalPlayer = document.getElementById('videoPlayerModal');
      const modalAdd = document.getElementById('addVideoModal');
      if (e.target === modalPlayer) closeVideoModal();
      if (e.target === modalAdd) closeAddVideoModal();
    });

    document.addEventListener('DOMContentLoaded', () => {
      initViralVideos();
    });
  </script>
</body>
</html>
