<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
  <title id="pageTitle">E-Catalog Resmi Toyota - Tunas Toyota Kiara Condong</title>
  
  <!-- Dynamic Meta Tags for Rich WhatsApp / Social Media Link Previews -->
  <meta name="description" id="metaDescription" content="Lihat spesifikasi lengkap, fitur canggih, dan simulasi promo kredit resmi Toyota di Tunas Toyota Kiara Condong." />
  <meta property="og:title" id="ogTitle" content="E-Catalog Resmi Toyota - Tunas Toyota" />
  <meta property="og:description" id="ogDescription" content="Download dan baca E-Catalog resmi, daftar harga, dan promo terbaru Toyota." />
  <meta property="og:type" content="website" />
  <meta property="og:image" id="ogImage" content="../image/logo.png" />
  <meta name="theme-color" content="#d7123a">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style.css" />
  
  <!-- PDF.js CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>

  <style>
    :root {
      --ecat-primary: #d7123a;
      --ecat-primary-dark: #b91c1c;
      --ecat-dark: #0f172a;
      --ecat-slate: #1e293b;
      --ecat-border: #e2e8f0;
      --ecat-bg: #f8fafc;
      --ecat-wa: #25D366;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Plus Jakarta Sans', sans-serif;
    }

    body {
      background: #0b0f19;
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    /* Top Navbar */
    .ecat-navbar {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ecat-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      text-decoration: none;
      color: white;
    }

    .ecat-logo-img {
      height: 28px;
      object-fit: contain;
    }

    .ecat-brand-text h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 15px;
      font-weight: 800;
      letter-spacing: -0.3px;
      margin: 0;
      line-height: 1.1;
    }

    .ecat-brand-text p {
      font-size: 10px;
      color: #94a3b8;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .ecat-nav-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-nav-action {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 7px 14px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .btn-nav-action:hover {
      background: rgba(255, 255, 255, 0.2);
      border-color: rgba(255, 255, 255, 0.3);
    }

    .btn-nav-wa {
      background: var(--ecat-wa);
      color: #fff;
      border: none;
      box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
    }

    .btn-nav-wa:hover {
      background: #1eb956;
    }

    /* Main Container */
    .ecat-main {
      flex: 1;
      max-width: 1100px;
      width: 100%;
      margin: 0 auto;
      padding: 20px 16px 80px;
    }

    /* Model Header Card */
    .ecat-hero-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 24px;
      margin-bottom: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
      position: relative;
      overflow: hidden;
    }

    .ecat-hero-card::after {
      content: '';
      position: absolute;
      top: -50px;
      right: -50px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(215, 18, 58, 0.25) 0%, rgba(215, 18, 58, 0) 70%);
      pointer-events: none;
    }

    .ecat-hero-details {
      flex: 1;
      min-width: 260px;
      z-index: 1;
    }

    .ecat-tag-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 10px;
      flex-wrap: wrap;
    }

    .ecat-badge-cat {
      background: rgba(215, 18, 58, 0.2);
      color: #ff4d6d;
      border: 1px solid rgba(215, 18, 58, 0.35);
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }

    .ecat-badge-official {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 9999px;
    }

    .ecat-model-title {
      font-family: 'Outfit', sans-serif;
      font-size: 30px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 6px;
      line-height: 1.15;
    }

    .ecat-model-desc {
      font-size: 13.5px;
      color: #94a3b8;
      line-height: 1.5;
      margin-bottom: 16px;
      max-width: 550px;
    }

    .ecat-hero-img-wrap {
      width: 260px;
      max-width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1;
    }

    .ecat-hero-img {
      width: 100%;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 15px 25px rgba(0,0,0,0.6));
    }

    /* Viewer Container */
    .ecat-viewer-wrapper {
      background: #111827;
      border: 1px solid #1f2937;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
      margin-bottom: 24px;
    }

    /* Viewer Toolbar */
    .ecat-viewer-toolbar {
      background: #1f2937;
      padding: 12px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      border-bottom: 1px solid #374151;
    }

    .ecat-page-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .btn-tool {
      background: #374151;
      border: none;
      color: #f3f4f6;
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s ease;
    }

    .btn-tool:hover:not(:disabled) {
      background: #4b5563;
      color: #fff;
    }

    .btn-tool:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .page-indicator {
      font-size: 12.5px;
      font-weight: 800;
      color: #e5e7eb;
      padding: 0 8px;
    }

    .ecat-toolbar-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* PDF Viewport */
    .ecat-pdf-viewport {
      padding: 20px;
      background: #0f172a;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 480px;
      position: relative;
      overflow-x: auto;
    }

    #pdfCanvas {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.6);
      background: #ffffff;
    }

    .pdf-loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      gap: 12px;
      padding: 60px 20px;
    }

    /* Sales Contact Section */
    .ecat-sales-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border: 1.5px solid #334155;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .sales-profile-info {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .sales-avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(135deg, #d7123a 0%, #991b1b 100%);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: 900;
      border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .sales-name {
      font-size: 16px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 2px;
    }

    .sales-role {
      font-size: 11.5px;
      color: #94a3b8;
    }

    .sales-cta-group {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .btn-sales-wa {
      background: linear-gradient(135deg, #25D366 0%, #16a34a 100%);
      color: #fff;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 800;
      border: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      box-shadow: 0 4px 16px rgba(37, 211, 102, 0.35);
      transition: all 0.2s;
    }

    .btn-sales-wa:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(37, 211, 102, 0.45);
    }

    .btn-sales-phone {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      padding: 12px 18px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 800;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.2s;
    }

    .btn-sales-phone:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    /* Other Models Section */
    .other-models-section {
      margin-top: 30px;
    }

    .section-heading {
      font-size: 16px;
      font-weight: 900;
      color: #fff;
      margin-bottom: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .models-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }

    .model-card-item {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 14px;
      padding: 12px;
      cursor: pointer;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
    }

    .model-card-item:hover {
      border-color: #d7123a;
      transform: translateY(-3px);
      background: #243247;
    }

    .model-card-img {
      width: 100%;
      height: 90px;
      object-fit: contain;
      margin-bottom: 8px;
    }

    .model-card-name {
      font-size: 13.5px;
      font-weight: 800;
      color: #fff;
    }

    .model-card-cat {
      font-size: 10px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 700;
    }

    /* Toast */
    .toast-pill {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      background: #10b981;
      color: #fff;
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 12.5px;
      font-weight: 800;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 9999;
    }

    .toast-pill.show {
      transform: translateX(-50%) translateY(0);
    }

    @media (max-width: 640px) {
      .ecat-model-title {
        font-size: 24px;
      }
      .ecat-hero-card {
        padding: 16px;
      }
      .sales-cta-group {
        width: 100%;
      }
      .btn-sales-wa, .btn-sales-phone {
        flex: 1;
        justify-content: center;
      }
    }
  </style>
</head>

<body>

  <!-- Top Navigation Header -->
  <header class="ecat-navbar">
    <a href="../pages/brosur" class="ecat-brand">
      <img src="../image/logo.png" alt="Toyota Logo" class="ecat-logo-img" onerror="this.style.display='none'">
      <div class="ecat-brand-text">
        <h1>Tunas Toyota</h1>
        <p>E-Catalog Resmi Digital</p>
      </div>
    </a>

    <div class="ecat-nav-actions">
      <button type="button" class="btn-nav-action" onclick="shareCatalogLink()" title="Bagikan E-Catalog">
        <i class="fa-solid fa-share-nodes"></i> <span>Bagikan</span>
      </button>
      <a id="navWaBtn" href="#" target="_blank" class="btn-nav-action btn-nav-wa">
        <i class="fa-brands fa-whatsapp"></i> <span>Konsultasi WA</span>
      </a>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="ecat-main">

    <!-- Model Hero Overview Card -->
    <div class="ecat-hero-card">
      <div class="ecat-hero-details">
        <div class="ecat-tag-row">
          <span class="ecat-badge-cat" id="modelCategory">Toyota</span>
          <span class="ecat-badge-official"><i class="fa-solid fa-circle-check"></i> E-Catalog Resmi 2026</span>
        </div>
        <h2 class="ecat-model-title" id="modelName">Memuat E-Catalog...</h2>
        <p class="ecat-model-desc" id="modelDesc">Spesifikasi lengkap, fitur keselamatan, interior, dan performa mesin unit Toyota.</p>
        
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <a id="btnDownloadDirect" href="#" download target="_blank" class="btn-nav-action" style="background:#2563eb; border:none;">
            <i class="fa-solid fa-file-arrow-down"></i> Unduh PDF Brosur
          </a>
          <button type="button" class="btn-nav-action" onclick="shareCatalogLink()">
            <i class="fa-solid fa-copy"></i> Salin Link E-Catalog
          </button>
        </div>
      </div>

      <div class="ecat-hero-img-wrap">
        <img id="modelImage" src="../image/logo.png" alt="Model Toyota" class="ecat-hero-img" style="display:none;" />
      </div>
    </div>

    <!-- Interactive PDF Viewer -->
    <div class="ecat-viewer-wrapper">
      <div class="ecat-viewer-toolbar">
        <div class="ecat-page-controls">
          <button type="button" class="btn-tool" id="btnPrev" title="Halaman Sebelumnya">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          <span class="page-indicator">
            Halaman <span id="pageNum">1</span> dari <span id="pageCount">-</span>
          </span>
          <button type="button" class="btn-tool" id="btnNext" title="Halaman Berikutnya">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        <div class="ecat-toolbar-right">
          <button type="button" class="btn-tool" id="btnZoomOut" title="Perkecil">
            <i class="fa-solid fa-magnifying-glass-minus"></i>
          </button>
          <button type="button" class="btn-tool" id="btnZoomIn" title="Perbesar">
            <i class="fa-solid fa-magnifying-glass-plus"></i>
          </button>
          <button type="button" class="btn-tool" id="btnFullscreen" title="Layar Penuh">
            <i class="fa-solid fa-expand"></i>
          </button>
        </div>
      </div>

      <div class="ecat-pdf-viewport" id="pdfViewport">
        <div class="pdf-loading-state" id="pdfLoading">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:32px; color:var(--ecat-primary);"></i>
          <p style="font-size:13px; font-weight:700;">Membuka E-Catalog Digital...</p>
        </div>
        <canvas id="pdfCanvas" style="display:none;"></canvas>
      </div>
    </div>

    <!-- Sales Consultant Profile & CTA -->
    <div class="ecat-sales-card">
      <div class="sales-profile-info">
        <div class="sales-avatar" id="salesAvatar">ST</div>
        <div>
          <div class="sales-name" id="salesName">Tunas Toyota Kiara Condong</div>
          <div class="sales-role" id="salesSub">Sales &amp; Customer Care Executive</div>
        </div>
      </div>

      <div class="sales-cta-group">
        <a id="salesWaBtn" href="#" target="_blank" class="btn-sales-wa">
          <i class="fa-brands fa-whatsapp" style="font-size:18px;"></i> Tanya Promo &amp; Hitungan Kredit
        </a>
        <a id="salesPhoneBtn" href="#" class="btn-sales-phone">
          <i class="fa-solid fa-phone"></i> Hubungi Sales
        </a>
      </div>
    </div>

    <!-- Other Popular Models Section -->
    <div class="other-models-section">
      <h3 class="section-heading">
        <i class="fa-solid fa-layer-group" style="color:var(--ecat-primary);"></i> E-Catalog Model Toyota Lainnya
      </h3>
      <div class="models-grid" id="otherModelsGrid">
        <!-- Populated dynamically via JS -->
      </div>
    </div>

  </main>

  <!-- Share Toast Notification -->
  <div class="toast-pill" id="shareToast">
    <i class="fa-solid fa-circle-check"></i> Link E-Catalog berhasil disalin!
  </div>

  <script>
    // ─── PDF.js Config ───
    if (window.pdfjsLib) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';
    }

    let pdfDoc = null;
    let pageNum = 1;
    let pageRendering = false;
    let pageNumPending = null;
    let currentZoom = 1.0;
    let activeBrochure = null;
    let allBrochures = [];

    // URL Parameters
    const urlParams = new URLSearchParams(window.location.search);
    const targetModel = urlParams.get('model') || urlParams.get('m') || '';
    const targetId = urlParams.get('id') || '';
    const salesNameParam = urlParams.get('sales') || urlParams.get('s') || '';
    const salesPhoneParam = urlParams.get('phone') || urlParams.get('p') || '';

    // Initialize Sales Identity
    function setupSalesIdentity() {
      const defaultName = 'Tunas Toyota Kiara Condong';
      const defaultPhone = '081214767565';
      const name = salesNameParam || localStorage.getItem('namaSales') || localStorage.getItem('salesName') || defaultName;
      const rawPhone = salesPhoneParam || localStorage.getItem('noHpSales') || localStorage.getItem('salesPhone') || localStorage.getItem('nomorWaSales') || defaultPhone;
      
      let cleanPhone = rawPhone.replace(/\D/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
      if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

      document.getElementById('salesName').textContent = name;
      document.getElementById('salesSub').textContent = `Sales Consultant • Tunas Toyota Kircon`;
      
      // Initials
      const parts = name.split(/\s+/);
      const initials = parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
      document.getElementById('salesAvatar').textContent = initials;

      // WhatsApp Links
      const modelTitle = activeBrochure ? activeBrochure.nama : 'Toyota';
      const waMsg = `Halo ${name}, saya sedang melihat E-Catalog resmi *Toyota ${modelTitle}*. Boleh info promo DP ringan, diskon & simulasi angsurannya?`;
      const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodeURIComponent(waMsg)}`;
      
      document.getElementById('salesWaBtn').href = waUrl;
      document.getElementById('navWaBtn').href = waUrl;
      document.getElementById('salesPhoneBtn').href = `tel:${rawPhone}`;
    }

    // Load Catalog Data
    async function initCatalogPage() {
      try {
        const res = await fetch('../api/api_brosur.php');
        const json = await res.json();
        
        if (json.status === 'success' && json.data && json.data.length > 0) {
          allBrochures = json.data;
          
          // Match targeted model
          if (targetId) {
            activeBrochure = allBrochures.find(b => String(b.id) === String(targetId));
          }
          if (!activeBrochure && targetModel) {
            const cleanTarget = targetModel.toLowerCase().replace(/[^a-z0-9]/g, '');
            activeBrochure = allBrochures.find(b => {
              const cleanName = (b.nama || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              const cleanPdf = (b.pdf_url || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              return cleanName.includes(cleanTarget) || cleanPdf.includes(cleanTarget);
            });
          }

          // Fallback to first brochure
          if (!activeBrochure) {
            activeBrochure = allBrochures[0];
          }

          renderBrochureMeta(activeBrochure);
          renderOtherModels(allBrochures, activeBrochure.id);
          loadPdfViewer(activeBrochure.pdf_url);
        } else {
          showErrorState('Data brosur tidak ditemukan.');
        }
      } catch (err) {
        console.error('Error fetching catalog data:', err);
        showErrorState('Gagal terhubung ke database E-Catalog.');
      }
    }

    function renderBrochureMeta(b) {
      document.getElementById('pageTitle').textContent = `E-Catalog Toyota ${b.nama} - Tunas Toyota Kiara Condong`;
      document.getElementById('modelName').textContent = `Toyota ${b.nama}`;
      document.getElementById('modelCategory').textContent = b.kategori || 'Toyota';
      document.getElementById('modelDesc').textContent = b.deskripsi || `Spesifikasi lengkap, fitur keselamatan modern, dan kenyamanan berkendara Toyota ${b.nama}.`;

      // Direct Download link
      const pdfUrl = b.pdf_url.startsWith('http') ? b.pdf_url : '../' + b.pdf_url;
      document.getElementById('btnDownloadDirect').href = pdfUrl;

      // Image
      if (b.gambar_url) {
        const imgSrc = b.gambar_url.startsWith('http') ? b.gambar_url : '../' + b.gambar_url;
        const imgEl = document.getElementById('modelImage');
        imgEl.src = imgSrc;
        imgEl.style.display = 'block';
      }

      setupSalesIdentity();
    }

    function renderOtherModels(list, currentId) {
      const grid = document.getElementById('otherModelsGrid');
      grid.innerHTML = '';

      list.forEach(b => {
        if (String(b.id) === String(currentId)) return;
        const slug = (b.nama || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const imgSrc = b.gambar_url ? (b.gambar_url.startsWith('http') ? b.gambar_url : '../' + b.gambar_url) : '../image/logo.png';
        
        let link = `catalog?model=${encodeURIComponent(slug)}`;
        if (salesNameParam) link += `&sales=${encodeURIComponent(salesNameParam)}`;
        if (salesPhoneParam) link += `&phone=${encodeURIComponent(salesPhoneParam)}`;

        const card = document.createElement('a');
        card.className = 'model-card-item';
        card.href = link;
        card.innerHTML = `
          <img src="${imgSrc}" alt="${b.nama}" class="model-card-img" onerror="this.style.opacity=0.3" loading="lazy">
          <div class="model-card-cat">${b.kategori || 'TOYOTA'}</div>
          <div class="model-card-name">${b.nama}</div>
        `;
        grid.appendChild(card);
      });
    }

    // PDF Viewer Logic
    function loadPdfViewer(url) {
      const loadingEl = document.getElementById('pdfLoading');
      const canvas = document.getElementById('pdfCanvas');
      loadingEl.style.display = 'flex';
      canvas.style.display = 'none';

      const proxyUrl = '../api/proxy_pdf.php?file=' + encodeURIComponent(url);

      pdfjsLib.getDocument(proxyUrl).promise.then(doc => {
        pdfDoc = doc;
        document.getElementById('pageCount').textContent = pdfDoc.numPages;
        pageNum = 1;
        renderPage(pageNum);
      }).catch(err => {
        console.error('PDF load error:', err);
        loadingEl.innerHTML = `
          <i class="fa-solid fa-triangle-exclamation" style="font-size:28px; color:var(--ecat-primary);"></i>
          <p style="font-size:12px; color:#f87171;">Gagal menampilkan preview PDF. Silakan gunakan tombol Unduh PDF di atas.</p>
        `;
      });
    }

    function renderPage(num) {
      pageRendering = true;
      pdfDoc.getPage(num).then(page => {
        const viewportContainer = document.getElementById('pdfViewport');
        const containerWidth = Math.min(viewportContainer.clientWidth - 40, 850);
        
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const baseScale = containerWidth / unscaledViewport.width;
        const viewport = page.getViewport({ scale: baseScale * currentZoom * 2.0 });

        const canvas = document.getElementById('pdfCanvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${containerWidth * currentZoom}px`;
        canvas.style.height = 'auto';

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        page.render(renderContext).promise.then(() => {
          pageRendering = false;
          document.getElementById('pdfLoading').style.display = 'none';
          canvas.style.display = 'block';

          if (pageNumPending !== null) {
            renderPage(pageNumPending);
            pageNumPending = null;
          }
        });

        document.getElementById('pageNum').textContent = num;
        document.getElementById('btnPrev').disabled = (num <= 1);
        document.getElementById('btnNext').disabled = (num >= pdfDoc.numPages);
      });
    }

    function queueRenderPage(num) {
      if (pageRendering) {
        pageNumPending = num;
      } else {
        renderPage(num);
      }
    }

    document.getElementById('btnPrev').addEventListener('click', () => {
      if (pageNum <= 1) return;
      pageNum--;
      queueRenderPage(pageNum);
    });

    document.getElementById('btnNext').addEventListener('click', () => {
      if (pageNum >= pdfDoc.numPages) return;
      pageNum++;
      queueRenderPage(pageNum);
    });

    document.getElementById('btnZoomIn').addEventListener('click', () => {
      if (currentZoom >= 2.0) return;
      currentZoom += 0.25;
      renderPage(pageNum);
    });

    document.getElementById('btnZoomOut').addEventListener('click', () => {
      if (currentZoom <= 0.75) return;
      currentZoom -= 0.25;
      renderPage(pageNum);
    });

    document.getElementById('btnFullscreen').addEventListener('click', () => {
      const viewer = document.getElementById('pdfViewport');
      if (!document.fullscreenElement) {
        viewer.requestFullscreen?.().catch(() => {});
      } else {
        document.exitFullscreen?.();
      }
    });

    // Share Link
    function shareCatalogLink() {
      const currentUrl = window.location.href;
      const modelTitle = activeBrochure ? activeBrochure.nama : 'Toyota';
      const shareTitle = `E-Catalog Resmi Toyota ${modelTitle}`;
      const shareText = `Lihat spesifikasi & fitur lengkap E-Catalog Resmi Toyota ${modelTitle}:\n${currentUrl}`;

      if (navigator.share) {
        navigator.share({
          title: shareTitle,
          text: shareText,
          url: currentUrl
        }).catch(() => copyToClipboard(currentUrl));
      } else {
        copyToClipboard(currentUrl);
      }
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text).then(() => {
        const toast = document.getElementById('shareToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2500);
      });
    }

    function showErrorState(msg) {
      document.getElementById('pdfLoading').innerHTML = `
        <i class="fa-solid fa-triangle-exclamation" style="font-size:32px; color:var(--ecat-primary);"></i>
        <p style="font-size:13px; color:#f87171;">${msg}</p>
      `;
    }

    document.addEventListener('DOMContentLoaded', initCatalogPage);
  </script>
</body>
</html>
