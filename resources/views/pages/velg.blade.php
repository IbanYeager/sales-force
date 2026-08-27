<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Katalog Velg & Ban</title>
    <meta name="description" content="Katalog Velg & Ban Mobil premium untuk sales consultant">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/velg.css" />
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
</head>

<body>
    <div class="mobile-app">

        <!-- ═══ HERO SECTION ═══ -->
        <div class="velg-hero">
            <div class="velg-hero-nav">
                <a href="../index.html" class="velg-hero-back"><i class="fa-solid fa-arrow-left"></i></a>
                <div class="velg-hero-count" id="velgProductCount">
                    <i class="fa-solid fa-box-open"></i>
                    <span id="velgCountText">6 Produk</span>
                </div>
            </div>
            <div class="velg-hero-content">
                <div class="velg-hero-icon">
                    <i class="fa-solid fa-compact-disc"></i>
                </div>
                <h1 class="velg-hero-title">Katalog Velg & Ban</h1>
                <p class="velg-hero-subtitle">Eksplorasi koleksi velg racing & ban premium untuk pelanggan Anda.</p>

                <!-- Category Tabs -->
                <div class="velg-filter-tabs" id="velgTabs">
                    <div class="velg-tab active" data-category="semua">
                        <i class="fa-solid fa-grip"></i> Semua
                    </div>
                    <div class="velg-tab" data-category="racing">
                        <i class="fa-solid fa-flag-checkered"></i> Racing
                    </div>
                    <div class="velg-tab" data-category="standar">
                        <i class="fa-solid fa-car"></i> Standar OEM
                    </div>
                    <div class="velg-tab" data-category="ban">
                        <i class="fa-solid fa-circle-dot"></i> Ban Saja
                    </div>
                </div>
            </div>
        </div>

        <!-- ═══ PRODUCT GRID ═══ -->
        <div class="velg-product-grid" id="productGrid">
            <!-- Populated by JS -->
        </div>
    </div>

    <!-- ═══ MODAL DETAIL ═══ -->
    <div class="velg-modal" id="velgModal">
        <div class="velg-modal-content" onclick="event.stopPropagation()">
            <div class="modal-drag-handle"></div>

            <div class="modal-title-row">
                <div>
                    <div class="product-brand" id="modalBrand">BRAND</div>
                    <h2 class="product-title" id="modalTitle">Nama Velg</h2>
                </div>
                <div class="modal-price-tag" id="modalPrice">Rp 0</div>
            </div>

            <div class="modal-img-showcase">
                <img id="modalImg" src="" alt="Velg">
            </div>

            <div class="spec-grid">
                <div class="spec-item">
                    <label>Ukuran Ring</label>
                    <span id="modalRing">17"</span>
                </div>
                <div class="spec-item">
                    <label>PCD</label>
                    <span id="modalPcd">4x100</span>
                </div>
                <div class="spec-item">
                    <label>Lebar</label>
                    <span id="modalLebar">7.5 J</span>
                </div>
                <div class="spec-item">
                    <label>Kondisi</label>
                    <span id="modalKondisi" style="color: var(--green-success);">Baru</span>
                </div>
            </div>

            <button class="btn-order-full" id="btnPesanDetail">
                <i class="fa-solid fa-cart-shopping"></i> Ajukan Pesanan
            </button>
        </div>
    </div>

    <script src="../custom_alert.js"></script>
    <script src="../js/velg.js"></script>
    <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
