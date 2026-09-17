<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Manajemen &amp; Pengaturan Hasil OLX</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/spv_olx.css?v=20260917_olx_master">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
</head>

<body class="kacab-theme">
  <div class="kcb-shell">
    <!-- SIDEBAR -->
    <aside class="kcb-sidebar">
      <div class="kcb-brand-container">
        <div class="kcb-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="kcb-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-building-user"></i> KACAB PANEL</span>
          <p class="panel-sub">Kepala Cabang</p>
        </div>
      </div>

      <nav class="kcb-nav">
        <a href="index_kacab.html" id="navDash"><i class="fa-solid fa-gauge-high"></i>Dashboard Cabang</a>
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="olx.html" id="navOlx" class="active"><i class="fa-solid fa-repeat"></i>Trade-In &amp; OLX</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi &amp; Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target &amp; Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas &amp; Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="performa_regional.html" id="navRegional"><i class="fa-solid fa-earth-asia"></i>Performa Regional Jabar</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle" style="display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-repeat" style="color:#d8a437;"></i> Pusat Manajemen &amp; Hasil Trade-In OLX
          </h2>
          <p class="page-sub">Otoritas Kepala Cabang: Atur status deal, tetapkan harga appraisal, &amp; monitoring rekap pencapaian cabang</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kacabAvatar" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" alt="Avatar">
            <span class="dot" style="background:#d8a437;"></span>
          </div>
          <div class="meta">
            <span class="name" id="kacabNama">Memuat...</span>
            <span class="role" id="kacabRole">Kepala Cabang</span>
          </div>
        </div>
      </div>

      <!-- 5 EXECUTIVE KPI TILES -->
      <div class="olx-kpi-grid">
        <div class="olx-kpi-card" style="border-top: 3px solid #2563eb;">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Total Unit Masuk</span>
            <div class="olx-kpi-icon icon-blue"><i class="fa-solid fa-car-tunnel"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalUnit">0 Unit</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-file-waveform" style="color:#2563eb;"></i> Seluruh unit trade-in diajukan</div>
        </div>

        <div class="olx-kpi-card" style="border-top: 3px solid #059669;">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Closing Deal</span>
            <div class="olx-kpi-icon icon-emerald"><i class="fa-solid fa-circle-check"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalDeal" style="color:#059669;">0 Deal</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-handshake" style="color:#059669;"></i> Transaksi SPK Trade-In Sukses</div>
        </div>

        <div class="olx-kpi-card" style="border-top: 3px solid #d97706;">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Nego / Prospek</span>
            <div class="olx-kpi-icon icon-amber"><i class="fa-solid fa-hourglass-half"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalNego" style="color:#d97706;">0 Prospek</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-comments" style="color:#d97706;"></i> Tahap appraisal / nego harga</div>
        </div>

        <div class="olx-kpi-card" style="border-top: 3px solid #b45309;">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Total Omset Deal</span>
            <div class="olx-kpi-icon icon-gold"><i class="fa-solid fa-money-bill-wave"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiTotalNominal" style="color:#b45309;">Rp 0</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-coins" style="color:#b45309;"></i> Akumulasi nilai transaksi deal</div>
        </div>

        <div class="olx-kpi-card" style="border-top: 3px solid #7c3aed;">
          <div class="olx-kpi-head">
            <span class="olx-kpi-label">Win Rate Closing</span>
            <div class="olx-kpi-icon icon-purple"><i class="fa-solid fa-chart-line"></i></div>
          </div>
          <div class="olx-kpi-val" id="kpiWinRate" style="color:#7c3aed;">0%</div>
          <div class="olx-kpi-sub"><i class="fa-solid fa-percent" style="color:#7c3aed;"></i> Rasio konversi Deal per Unit</div>
        </div>
      </div>

      <!-- LEADERBOARD PENCAPAIAN PER SPV -->
      <div style="margin-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
            <i class="fa-solid fa-trophy" style="color:#d8a437; margin-right:6px;"></i> Rekap Performa Trade-In Antar Tim SPV
          </h3>
          <p style="font-size:12px; color:#64748b; margin:2px 0 0;">Evaluasi pencapaian unit dan ranking wiraniaga berprestasi tiap supervisor</p>
        </div>
      </div>

      <div class="olx-leaderboard-grid" id="leaderboardContainer">
        <!-- Dynamic Leaderboard generated via JS -->
      </div>

      <!-- KACAB CONTROL TABLE -->
      <section class="kcb-card" style="padding:0; overflow:hidden; border-radius:18px; border:1px solid #e2e8f0; background:#fff; box-shadow:0 4px 20px rgba(0,0,0,0.03);">
        <div class="card-head" style="padding:18px 20px; border-bottom:1.5px solid #f1f5f9; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <h1 class="title" style="font-size:17px; font-weight:800; color:#0f172a; margin:0;">
              <i class="fa-solid fa-sliders" style="color:#d8a437; margin-right:8px;"></i> Manajemen &amp; Pengaturan Hasil Trade-In OLX
            </h1>
            <p class="subtitle" style="font-size:12.5px; color:#64748b; margin:2px 0 0;">
              Gunakan tombol <strong>"Atur"</strong> atau <strong>"Deal"</strong> untuk mengubah status penutupan transaksi &amp; nominal harga
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn-gold-action" onclick="openAddModal()">
              <i class="fa-solid fa-plus"></i> Tambah Data Trade-In
            </button>
            <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:9px 14px; border-radius:10px; cursor:pointer;" onclick="exportOlxCsv()">
              <i class="fa-solid fa-file-excel" style="color:#059669;"></i> Ekspor CSV
            </button>
            <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:9px 14px; border-radius:10px; cursor:pointer;" onclick="window.print()">
              <i class="fa-solid fa-print"></i> Cetak
            </button>
          </div>
        </div>

        <!-- FILTER BAR -->
        <div style="background:#f8fafc; padding:12px 20px; border-bottom:1px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div class="olx-filter-group">
            <!-- Filter Bulan -->
            <select id="selectMonth" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Periode Bulan</option>
            </select>

            <!-- Filter SPV -->
            <select id="selectSpv" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Tim SPV</option>
              <option value="Alvin">Tim SPV Alvin</option>
              <option value="Ryan">Tim SPV Ryan</option>
              <option value="Riva">Tim SPV Riva</option>
            </select>

            <!-- Filter Status -->
            <select id="selectStatus" class="olx-select" onchange="fetchOlxData()">
              <option value="all">Semua Status Hasil</option>
              <option value="Deal">Deal (Closing)</option>
              <option value="Nego">Nego (Proses)</option>
              <option value="Cek Unit">Cek Unit / Appraisal</option>
              <option value="Pending">Pending</option>
              <option value="Batal">Batal</option>
            </select>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <div style="position:relative;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#94a3b8; font-size:12px;"></i>
              <input type="text" id="searchOlx" class="olx-input" placeholder="Cari mobil / sales / merk..." style="padding-left:32px; width:220px;">
            </div>
            <span id="totalRowsCount" style="font-size:12px; font-weight:700; color:#64748b; white-space:nowrap;">0 Data</span>
          </div>
        </div>

        <!-- TABLE CONTAINER -->
        <div style="overflow-x:auto;">
          <table class="olx-table">
            <thead>
              <tr>
                <th style="width:40px;">#</th>
                <th>Bulan</th>
                <th>Wiraniaga &amp; SPV</th>
                <th>Unit Kendaraan</th>
                <th>KM &amp; Pajak</th>
                <th>Nilai / Deal (Rp)</th>
                <th>Status Hasil</th>
                <th>Keterangan</th>
                <th style="text-align:center;">Pengaturan Kacab</th>
              </tr>
            </thead>
            <tbody id="olxTableBody">
              <tr>
                <td colspan="10" style="text-align:center; padding:30px; color:#64748b;">
                  <i class="fa-solid fa-spinner fa-spin"></i> Memuat data trade-in OLX...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <!-- MODAL TAMBAH DATA TRADE-IN BARU -->
  <div class="olx-modal-overlay" id="modalAddOlx" onclick="closeAddModal()">
    <div class="olx-modal-box" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
        <h3 style="font-size:16.5px; font-weight:900; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-circle-plus" style="color:#d8a437;"></i> Tambah Data Trade-In OLX Baru
        </h3>
        <button onclick="closeAddModal()" style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="formAddOlx" onsubmit="saveAddTradeIn(event)">
        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Periode Bulan:</label>
            <select id="addMonth" class="olx-select" style="width:100%;" required>
              <!-- Populated via JS -->
            </select>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tim Supervisor (SPV):</label>
            <select id="addSpv" class="olx-select" style="width:100%;" required>
              <option value="Alvin">Tim SPV Alvin</option>
              <option value="Ryan">Tim SPV Ryan</option>
              <option value="Riva">Tim SPV Riva</option>
            </select>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Nama Wiraniaga (Sales):</label>
            <input type="text" id="addSales" class="olx-input" style="width:100%;" placeholder="Contoh: Topik, Yeni, Egy..." required>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Merk Kendaraan:</label>
            <input type="text" id="addMerk" class="olx-input" style="width:100%;" placeholder="Toyota, Honda, Daihatsu, dll." value="Toyota" required>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tipe Kendaraan:</label>
            <input type="text" id="addType" class="olx-input" style="width:100%;" placeholder="Contoh: Avanza G CVT, Raize 1.0..." required>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tahun Pembuatan:</label>
            <input type="number" id="addTahun" class="olx-input" style="width:100%;" value="2022" required>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Warna Kendaraan:</label>
            <input type="text" id="addWarna" class="olx-input" style="width:100%;" placeholder="Hitam, Putih, Silver...">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Harga Deal / Estimasi (Rp):</label>
            <input type="number" id="addHarga" class="olx-input" style="width:100%; font-weight:800;" placeholder="Contoh: 210000000" step="1000000">
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Odometer (KM):</label>
            <input type="text" id="addKm" class="olx-input" style="width:100%;" placeholder="Contoh: 35 RB, 42.000 KM...">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status Pajak STNK:</label>
            <input type="text" id="addPajak" class="olx-input" style="width:100%;" placeholder="Contoh: Panjang, ON, Mei 2026..." value="Panjang">
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:18px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status Hasil Transaksi:</label>
            <select id="addHasil" class="olx-select" style="width:100%; font-weight:800;">
              <option value="Deal" style="color:#059669;">Deal (Closing SPK)</option>
              <option value="Nego" selected style="color:#d97706;">Nego (Dalam Negosiasi)</option>
              <option value="Cek Unit" style="color:#0284c7;">Cek Unit / Appraisal</option>
              <option value="Pending" style="color:#64748b;">Pending</option>
              <option value="Batal" style="color:#e11d48;">Batal</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Keterangan / Catatan:</label>
            <input type="text" id="addKet" class="olx-input" style="width:100%;" placeholder="Contoh: Done Inspeksi, Deal unit baru Avanza...">
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1.5px solid #f1f5f9; padding-top:16px;">
          <button type="button" class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:9px 18px; border-radius:10px; cursor:pointer;" onclick="closeAddModal()">
            Batal
          </button>
          <button type="submit" class="btn-gold-action">
            <i class="fa-solid fa-floppy-disk"></i> Simpan Unit Baru
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- MODAL EDIT & ATUR DATA TRADE-IN -->
  <div class="olx-modal-overlay" id="modalEditOlx" onclick="closeEditModal()">
    <div class="olx-modal-box" onclick="event.stopPropagation()">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
        <h3 style="font-size:16.5px; font-weight:900; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-pen-to-square" style="color:#d8a437;"></i> Atur &amp; Edit Data Trade-In
        </h3>
        <button onclick="closeEditModal()" style="background:none; border:none; font-size:18px; color:#94a3b8; cursor:pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="formEditOlx" onsubmit="saveEditTradeIn(event)">
        <input type="hidden" id="editId">

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Periode Bulan:</label>
            <select id="editMonth" class="olx-select" style="width:100%;" required>
              <!-- Populated via JS -->
            </select>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tim Supervisor (SPV):</label>
            <select id="editSpv" class="olx-select" style="width:100%;" required>
              <option value="Alvin">Tim SPV Alvin</option>
              <option value="Ryan">Tim SPV Ryan</option>
              <option value="Riva">Tim SPV Riva</option>
            </select>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Nama Wiraniaga (Sales):</label>
            <input type="text" id="editSales" class="olx-input" style="width:100%;" required>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Merk Kendaraan:</label>
            <input type="text" id="editMerk" class="olx-input" style="width:100%;" required>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tipe Kendaraan:</label>
            <input type="text" id="editType" class="olx-input" style="width:100%;" required>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Tahun Pembuatan:</label>
            <input type="number" id="editTahun" class="olx-input" style="width:100%;" required>
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Warna Kendaraan:</label>
            <input type="text" id="editWarna" class="olx-input" style="width:100%;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Harga Deal / Estimasi (Rp):</label>
            <input type="number" id="editHarga" class="olx-input" style="width:100%; font-weight:800;" step="1000000">
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:14px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Odometer (KM):</label>
            <input type="text" id="editKm" class="olx-input" style="width:100%;">
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status Pajak STNK:</label>
            <input type="text" id="editPajak" class="olx-input" style="width:100%;">
          </div>
        </div>

        <div class="olx-form-grid" style="margin-bottom:18px;">
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Status Hasil Transaksi (Kacab Authority):</label>
            <select id="editHasil" class="olx-select" style="width:100%; font-weight:800;">
              <option value="Deal" style="color:#059669;">Deal (Closing SPK)</option>
              <option value="Nego" style="color:#d97706;">Nego (Dalam Negosiasi)</option>
              <option value="Cek Unit" style="color:#0284c7;">Cek Unit / Appraisal</option>
              <option value="Pending" style="color:#64748b;">Pending</option>
              <option value="Batal" style="color:#e11d48;">Batal</option>
            </select>
          </div>
          <div>
            <label style="font-size:12px; font-weight:700; color:#334155; display:block; margin-bottom:4px;">Keterangan / Catatan Evaluasi:</label>
            <input type="text" id="editKet" class="olx-input" style="width:100%;">
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1.5px solid #f1f5f9; padding-top:16px;">
          <button type="button" class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; border:1px solid #cbd5e1; padding:9px 18px; border-radius:10px; cursor:pointer;" onclick="closeEditModal()">
            Batal
          </button>
          <button type="submit" class="btn-gold-action">
            <i class="fa-solid fa-check"></i> Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js"></script>
  <script src="../js/kacab_olx.js?v=20260917_master"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
