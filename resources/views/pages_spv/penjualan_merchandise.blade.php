<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Monitoring Penjualan Merchandise Official Toyota &amp; GR</title>
  
  <!-- Font & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

  <!-- SPV Core & Merchandise Styles -->
  <link rel="stylesheet" href="../css/style_spv.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/penjualan_merchandise.css?v={{ time() }}">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1c2740">
</head>

<body>
  <div class="spv-shell">
    <!-- SIDEBAR SPV -->
    <aside class="spv-sidebar">
      <div class="spv-brand-container">
        <div class="spv-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="spv-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-user-tie"></i> SPV PANEL</span>
          <p class="panel-sub">Desktop Supervisor</p>
        </div>
      </div>

      <div class="spv-search-wrap">
        <div class="spv-search-box">
          <i class="fa-solid fa-magnifying-glass spv-search-icon"></i>
          <input type="text" class="spv-search-input" id="spvSearchInput" placeholder="Cari menu &amp; fitur..." autocomplete="off" spellcheck="false">
          <button type="button" class="spv-search-clear" id="spvSearchClear" style="display:none;" title="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="spv-nav">
        <!-- Kategori 1: Overview & Target -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-chart-line"></i> Overview &amp; Target</span>
          <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard SPV</a>
          <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Pencapaian</a>
          <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
          <a href="penjualan_tco.html" id="navTco"><i class="fa-solid fa-gem"></i>Penjualan &amp; Polreg TCO</a>
          <a href="penjualan_merchandise.html" id="navMerchandise" class="active"><i class="fa-solid fa-shirt"></i>Penjualan Merchandise</a>
        </div>

        <!-- Kategori 2: Pipeline & Approval -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-funnel-dollar"></i> Pipeline &amp; Approval</span>
          <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
          <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Otorisasi &amp; Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
          <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        </div>

        <!-- Kategori 3: Supervisi Tim Sales -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-users-gear"></i> Supervisi Tim Sales</span>
          <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Tim Wiraniaga</a>
          <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Monitoring Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
          <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas"><i class="fa-solid fa-images"></i>Galeri Foto Aktivitas</a>
          <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
          <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
          <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        </div>

        <!-- Kategori 4: Stok & Operasional -->
        <div class="spv-nav-category">
          <span class="spv-category-title"><i class="fa-solid fa-warehouse"></i> Stok &amp; Operasional</span>
          <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
          <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
          <a href="mtoyota_service.html" id="navMtoyota"><i class="fa-solid fa-car-on"></i>m-Toyota &amp; Service</a>
          <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data Cabang</a>
        </div>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="spv-main">
      <!-- Topbar Header -->
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle">Monitoring Penjualan Merchandise</h2>
          <p class="page-sub"><i class="fa-regular fa-calendar-days" style="color:#64748b; margin-right:4px;"></i> Supervisi realisasi omset aksesoris resmi GR &amp; Toyota tim wiraniaga, stok, dan log penjualan.</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="https://ui-avatars.com/api/?name=Supervisor+Sales&background=1c2740&color=ffffff&bold=true" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Supervisor Panel</span>
            <span class="role" id="spvRole">Supervisi Cabang</span>
          </div>
        </div>
      </div>

      <div style="margin-top: 14px;">
        <!-- Executive Control Banner with Filters -->
        <div class="merch-banner">
          <div class="merch-banner-content">
            <div class="merch-banner-title">
              <span class="merch-banner-badge">
                <i class="fa-solid fa-shirt"></i> Toyota Official Merchandise &amp; GR Lifestyle
              </span>
              <h1>Supervisi Penjualan Merchandise Tim Wiraniaga</h1>
              <p class="merch-banner-desc">
                Monitoring capaian penjualan apparel, topi, jaket, tumbler, dan bundling pengiriman unit kendaraan oleh tim sales Anda.
              </p>
            </div>

            <div class="merch-filter-bar">
              <select id="filterPeriode" class="merch-select-filter" title="Filter Periode">
                <option value="all">Semua Periode</option>
                <option value="this_month">Bulan Ini</option>
                <option value="last_month">Bulan Lalu</option>
                <option value="this_year">Tahun 2026</option>
              </select>

              <select id="filterSpv" class="merch-select-filter" title="Filter Tim SPV">
                <option value="all">Semua Tim SPV</option>
              </select>

              <select id="filterKategori" class="merch-select-filter" title="Filter Kategori">
                <option value="all">Semua Kategori</option>
              </select>

              <select id="filterMetode" class="merch-select-filter" title="Metode Pembayaran">
                <option value="all">Semua Pembayaran</option>
                <option value="Cash">Cash / Tunai</option>
                <option value="Transfer">Transfer Bank</option>
                <option value="Bonus">Bonus SPK Unit</option>
                <option value="Voucher">Voucher Promo</option>
              </select>

              <button type="button" class="merch-btn-action merch-btn-primary" onclick="openInputModal()">
                <i class="fa-solid fa-plus"></i> Catat Penjualan
              </button>

              <button type="button" class="merch-btn-action" onclick="exportToCsv()" title="Unduh spreadsheet CSV">
                <i class="fa-solid fa-file-excel" style="color:#059669;"></i> Export
              </button>
            </div>
          </div>
        </div>

        <!-- 4 KPI Stat Cards -->
        <div class="merch-kpi-grid">
          <!-- Total Revenue Merchandise -->
          <div class="merch-kpi-card">
            <div class="merch-kpi-top">
              <span class="merch-kpi-label">Total Omset Merchandise</span>
              <div class="merch-kpi-icon icon-crimson">
                <i class="fa-solid fa-sack-dollar"></i>
              </div>
            </div>
            <div>
              <div class="merch-kpi-val" id="kpiTotalRevenue">Rp 0</div>
              <div class="merch-kpi-sub" id="kpiSubRetail">
                Retail &amp; Bundling delivery
              </div>
            </div>
          </div>

          <!-- Total Item Terjual -->
          <div class="merch-kpi-card">
            <div class="merch-kpi-top">
              <span class="merch-kpi-label">Total Item Terjual</span>
              <div class="merch-kpi-icon icon-blue">
                <i class="fa-solid fa-shirt"></i>
              </div>
            </div>
            <div>
              <div class="merch-kpi-val" id="kpiTotalQty">0 Pcs</div>
              <div class="merch-kpi-sub">
                <span style="color:#2563eb; font-weight:700;"><i class="fa-solid fa-circle-check"></i> 100% Original</span> Gazoo Racing &amp; Toyota
              </div>
            </div>
          </div>

          <!-- Rata-rata Basket Size -->
          <div class="merch-kpi-card">
            <div class="merch-kpi-top">
              <span class="merch-kpi-label">Rata-rata Transaksi</span>
              <div class="merch-kpi-icon icon-emerald">
                <i class="fa-solid fa-chart-line"></i>
              </div>
            </div>
            <div>
              <div class="merch-kpi-val" id="kpiAvgRevenue">Rp 0</div>
              <div class="merch-kpi-sub">
                <span style="color:#059669; font-weight:700;"><i class="fa-solid fa-receipt"></i> Basket Size</span> rata-rata nota
              </div>
            </div>
          </div>

          <!-- Top Merchandise Terlaris -->
          <div class="merch-kpi-card">
            <div class="merch-kpi-top">
              <span class="merch-kpi-label">Koleksi Terfavorit</span>
              <div class="merch-kpi-icon icon-purple">
                <i class="fa-solid fa-trophy"></i>
              </div>
            </div>
            <div>
              <div class="merch-kpi-val" style="font-size:16px; min-height:30px; display:flex; align-items:center;" id="kpiTopItemName">Memuat...</div>
              <div class="merch-kpi-sub">
                <span style="color:#7c3aed; font-weight:700;" id="kpiTopItemQty">0 Pcs Terjual</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Grid 1: Top Items Grid & SPV Team Performance -->
        <div class="merch-analytics-grid">
          <!-- Top Selling Items -->
          <div class="merch-panel">
            <div class="merch-panel-header">
              <h3><i class="fa-solid fa-fire" style="color:var(--merch-red);"></i> 6 Koleksi Paling Laris di Cabang</h3>
              <span class="merch-panel-tag">Paling Banyak Terjual</span>
            </div>
            <div class="top-items-grid" id="topItemsContainer">
              <div style="grid-column: span 3; text-align: center; padding: 30px; color: #94a3b8;">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat koleksi terlaris...
              </div>
            </div>
          </div>

          <!-- Performa Penjualan per Tim SPV -->
          <div class="merch-panel">
            <div class="merch-panel-header">
              <h3><i class="fa-solid fa-users" style="color:#2563eb;"></i> Komparasi Tim SPV</h3>
              <span class="merch-panel-tag">Peringkat Omset</span>
            </div>
            <div class="spv-breakdown-list" id="spvBreakdownContainer">
              <div style="text-align: center; padding: 30px; color: #94a3b8;">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat performa tim SPV...
              </div>
            </div>
          </div>
        </div>

        <!-- Analytics Grid 2: Kategori & Top Wiraniaga -->
        <div class="merch-analytics-grid-secondary">
          <!-- Kategori Merchandise -->
          <div class="merch-panel">
            <div class="merch-panel-header">
              <h3><i class="fa-solid fa-layer-group" style="color:#d97706;"></i> Distribusi Kategori Produk</h3>
              <span class="merch-panel-tag">Pangsa Produk</span>
            </div>
            <div class="cat-breakdown-list" id="categoryBreakdownContainer">
              <div style="text-align: center; padding: 25px; color: #94a3b8;">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat kategori...
              </div>
            </div>
          </div>

          <!-- Top Wiraniaga Merchandise -->
          <div class="merch-panel">
            <div class="merch-panel-header">
              <h3><i class="fa-solid fa-medal" style="color:#059669;"></i> Top 8 Wiraniaga Penjual Merchandise</h3>
              <span class="merch-panel-tag">Sales Champion</span>
            </div>
            <div class="sales-leaderboard-list" id="salesLeaderboardContainer">
              <div style="text-align: center; padding: 25px; color: #94a3b8;">
                <i class="fa-solid fa-circle-notch fa-spin"></i> Memuat data wiraniaga...
              </div>
            </div>
          </div>
        </div>

        <!-- Comprehensive Transactions Table Panel -->
        <div class="merch-table-panel">
          <div class="merch-table-toolbar">
            <div class="merch-tabs-group">
              <button type="button" class="merch-tab-btn active" onclick="setTabFilter('all', this)">
                <i class="fa-solid fa-list-check"></i> Semua Transaksi
              </button>
              <button type="button" class="merch-tab-btn" onclick="setTabFilter('Cash', this)">
                <i class="fa-solid fa-money-bill-wave"></i> Retail Cash
              </button>
              <button type="button" class="merch-tab-btn" onclick="setTabFilter('Transfer', this)">
                <i class="fa-solid fa-building-columns"></i> Transfer Bank
              </button>
              <button type="button" class="merch-tab-btn" onclick="setTabFilter('Bonus', this)">
                <i class="fa-solid fa-gift"></i> Bundling SPK &amp; Delivery
              </button>
              <button type="button" class="merch-tab-btn" onclick="setTabFilter('Voucher', this)">
                <i class="fa-solid fa-ticket"></i> Voucher Promo
              </button>
            </div>

            <div class="merch-search-wrap">
              <i class="fa-solid fa-magnifying-glass merch-search-icon"></i>
              <input type="text" id="merchSearchInput" class="merch-search-input" placeholder="Cari No Nota, SPK, Customer, Sales, atau Barang...">
            </div>
          </div>

          <div class="merch-table-wrap">
            <table class="merch-table">
              <thead>
                <tr>
                  <th style="width: 140px;">No / Nota</th>
                  <th style="width: 110px;">Tanggal</th>
                  <th>Produk Merchandise Official</th>
                  <th style="width: 150px;">Harga &amp; Qty</th>
                  <th>Customer &amp; SPK</th>
                  <th>Wiraniaga &amp; SPV</th>
                  <th style="width: 150px;">Metode &amp; Status</th>
                  <th style="width: 120px; text-align: center;">Aksi</th>
                </tr>
              </thead>
              <tbody id="merchTableBody">
                <tr>
                  <td colspan="8" style="text-align: center; padding: 40px; color: #94a3b8;">
                    <i class="fa-solid fa-circle-notch fa-spin" style="font-size:24px; color:var(--merch-red); margin-bottom:10px;"></i>
                    <p>Memuat daftar transaksi penjualan...</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="merch-pagination-bar">
            <div id="paginationInfo">Menampilkan data transaksi...</div>
            <div class="merch-pagination-btns">
              <button type="button" id="btnPrevPage" class="merch-page-btn" disabled>
                <i class="fa-solid fa-chevron-left"></i> Sebelumnya
              </button>
              <span id="currentPageNumber" style="display:inline-flex; align-items:center; padding:0 8px; font-weight:700;">Halaman 1</span>
              <button type="button" id="btnNextPage" class="merch-page-btn" disabled>
                Berikutnya <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- Modal Input Penjualan Merchandise -->
  <div class="merch-modal-overlay" id="inputMerchModal" onclick="if(event.target===this) closeInputModal()">
    <div class="merch-modal-card">
      <div class="merch-modal-header">
        <h3><i class="fa-solid fa-bag-shopping" style="color:var(--merch-red);"></i> Catat Penjualan Merchandise Baru</h3>
        <button type="button" class="merch-modal-close" onclick="closeInputModal()">&times;</button>
      </div>
      <form id="formInputMerch" onsubmit="submitMerchandiseSale(event)">
        <div class="merch-modal-body">
          <div class="merch-form-grid">
            <!-- Tanggal Transaksi -->
            <div>
              <label class="merch-label">Tanggal Transaksi</label>
              <input type="date" id="modalTanggal" class="merch-input" required>
            </div>

            <!-- Metode Pembayaran -->
            <div>
              <label class="merch-label">Metode Pembayaran</label>
              <select id="modalMetode" class="merch-select" required>
                <option value="Cash / Tunai">Cash / Tunai Showroom</option>
                <option value="Transfer Bank BCA">Transfer Bank BCA</option>
                <option value="Transfer Bank Mandiri">Transfer Bank Mandiri</option>
                <option value="Bonus SPK Kendaraan">Bonus SPK Kendaraan</option>
                <option value="Hadiah Delivery Unit">Hadiah Delivery Unit</option>
                <option value="Voucher Promo Pameran">Voucher Promo Pameran</option>
              </select>
            </div>

            <!-- Pilih Merchandise Item -->
            <div class="form-group-full">
              <label class="merch-label">Pilih Item Merchandise Official</label>
              <select id="modalMerchItem" class="merch-select" onchange="handleModalMerchChange()" required>
                <option value="">Memuat katalog merchandise...</option>
              </select>
            </div>

            <!-- Thumbnail Preview & Details -->
            <div class="form-group-full" style="display:flex; gap:14px; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:10px;">
              <img id="modalItemThumb" src="" alt="Thumbnail" style="width:60px; height:60px; object-fit:contain; border-radius:6px; background:#ffffff; border:1px solid #e2e8f0; display:none;">
              <div style="flex:1;">
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
                  <div>
                    <label class="merch-label" style="font-size:11px; margin-bottom:2px;">Part Number</label>
                    <input type="text" id="modalPartNumber" class="merch-input" style="padding:6px 10px; font-size:12px;" readonly>
                  </div>
                  <div>
                    <label class="merch-label" style="font-size:11px; margin-bottom:2px;">Ukuran / Varian</label>
                    <input type="text" id="modalSize" class="merch-input" style="padding:6px 10px; font-size:12px;" readonly>
                  </div>
                </div>
              </div>
            </div>

            <!-- Harga Satuan & Qty -->
            <div>
              <label class="merch-label">Harga Satuan (Rp)</label>
              <input type="number" id="modalHargaSatuan" class="merch-input" oninput="calculateModalTotal()" required>
            </div>

            <div>
              <label class="merch-label">Jumlah / Qty (Pcs)</label>
              <input type="number" id="modalQty" class="merch-input" value="1" min="1" max="50" oninput="calculateModalTotal()" required>
            </div>

            <!-- Total Harga (Readonly Preview) -->
            <div class="form-group-full" style="background:#fef2f2; border:1px solid #fee2e2; border-radius:8px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700; color:#991b1b; font-size:13px;">Total Tagihan Merchandise:</span>
              <span id="modalTotalDisplay" style="font-size:18px; font-weight:800; color:var(--merch-red);">Rp 0</span>
              <input type="hidden" id="modalTotalHarga" value="0">
            </div>

            <!-- Sales Consultant -->
            <div>
              <label class="merch-label">Wiraniaga (Sales Consultant)</label>
              <select id="modalSales" class="merch-select" onchange="handleModalSalesChange()" required>
                <option value="">Memuat wiraniaga...</option>
              </select>
            </div>

            <!-- Supervisor -->
            <div>
              <label class="merch-label">Tim Supervisor (SPV)</label>
              <input type="text" id="modalSpv" class="merch-input" readonly placeholder="Otomatis dari Sales">
            </div>

            <!-- Nama Customer -->
            <div>
              <label class="merch-label">Nama Pelanggan (Customer)</label>
              <input type="text" id="modalCustomerName" class="merch-input" placeholder="Nama lengkap customer" required>
            </div>

            <!-- No Telp Customer -->
            <div>
              <label class="merch-label">No. Telepon / WhatsApp</label>
              <input type="text" id="modalCustomerPhone" class="merch-input" placeholder="08xxxxxxxxxx">
            </div>

            <!-- No SPK Unit (Opsional) -->
            <div>
              <label class="merch-label">Nomor SPK Kendaraan (Opsional)</label>
              <input type="text" id="modalSpkNo" class="merch-input" placeholder="Contoh: TG-26-001234">
            </div>

            <!-- Status Pesanan -->
            <div>
              <label class="merch-label">Status Transaksi</label>
              <select id="modalStatus" class="merch-select">
                <option value="Selesai">Selesai (Barang Diterima)</option>
                <option value="Diproses">Diproses / Packing</option>
                <option value="Pending">Pending Pembayaran</option>
              </select>
            </div>

            <!-- Keterangan -->
            <div class="form-group-full">
              <label class="merch-label">Catatan Tambahan (Opsional)</label>
              <textarea id="modalKeterangan" class="merch-textarea" rows="2" placeholder="Catatan transaksi atau bundling delivery..."></textarea>
            </div>
          </div>
        </div>

        <div class="merch-modal-footer">
          <button type="button" class="merch-btn-action" onclick="closeInputModal()">Batal</button>
          <button type="submit" id="btnSubmitMerch" class="merch-btn-action merch-btn-primary">
            <i class="fa-solid fa-check"></i> Simpan Transaksi
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal Detail Transaksi -->
  <div class="merch-modal-overlay" id="detailMerchModal" onclick="if(event.target===this) closeDetailModal()">
    <div class="merch-modal-card">
      <div class="merch-modal-header">
        <h3><i class="fa-solid fa-receipt" style="color:var(--merch-red);"></i> Rincian Transaksi Merchandise</h3>
        <button type="button" class="merch-modal-close" onclick="closeDetailModal()">&times;</button>
      </div>
      <div class="merch-modal-body" id="detailModalContent">
        <!-- Injected via JavaScript -->
      </div>
      <div class="merch-modal-footer">
        <button type="button" class="merch-btn-action merch-btn-primary" onclick="closeDetailModal()">Tutup</button>
      </div>
    </div>
  </div>

  <!-- Global scripts -->
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
  <script src="../js/penjualan_merchandise.js?v={{ time() }}"></script>
  <script>
    function logoutUser() {
      if (confirm('Keluar dari Portal SPV?')) {
        window.location.href = '/pages/login.html';
      }
    }
  </script>
</body>
</html>
