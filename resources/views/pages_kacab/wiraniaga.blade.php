<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Data 46 Wiraniaga</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css">
  <link rel="stylesheet" href="../css/spv_wiraniaga.css">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#1e1014">
</head>

<body>
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
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga" class="active"><i class="fa-solid fa-users"></i>Data 46 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
        <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i>Peta GPS Kunjungan</a>
        <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i>Live Stok (1.638 Unit)</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Data 46 Wiraniaga Cabang</h2>
          <p class="page-sub" id="subTitleCount">Memuat data seluruh wiraniaga cabang...</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Memuat...</span>
            <span class="role" id="kcbRole">Kepala Cabang</span>
          </div>
        </div>
      </div>

      <!-- 4 EXECUTIVE KPI SUMMARY CARDS -->
      <div class="wira-kpi-grid">
        <div class="wira-kpi-card card-blue">
          <div class="wira-kpi-head">
            <span class="wira-kpi-label">Total Wiraniaga</span>
            <div class="wira-kpi-icon icon-blue"><i class="fa-solid fa-users"></i></div>
          </div>
          <div class="wira-kpi-val" id="kpiTotalSales">46 Sales</div>
          <div class="wira-kpi-sub"><i class="fa-solid fa-sitemap" style="color:#2563eb;"></i> 3 Tim SPV (Ryan, Alvin, Riva)</div>
        </div>

        <div class="wira-kpi-card card-emerald">
          <div class="wira-kpi-head">
            <span class="wira-kpi-label">Status Presensi</span>
            <div class="wira-kpi-icon icon-emerald"><i class="fa-solid fa-signal"></i></div>
          </div>
          <div class="wira-kpi-val" id="kpiOnlineCount">0 Online</div>
          <div class="wira-kpi-sub" id="kpiOfflineCount"><i class="fa-solid fa-moon" style="color:#94a3b8;"></i> 46 Wiraniaga Offline</div>
        </div>

        <div class="wira-kpi-card card-amber">
          <div class="wira-kpi-head">
            <span class="wira-kpi-label">High Conversion</span>
            <div class="wira-kpi-icon icon-amber"><i class="fa-solid fa-bolt"></i></div>
          </div>
          <div class="wira-kpi-val" id="kpiHighCount">0 Sales</div>
          <div class="wira-kpi-sub"><i class="fa-solid fa-award" style="color:#f59e0b;"></i> Konversi Target &ge; 50%</div>
        </div>

        <div class="wira-kpi-card card-rose">
          <div class="wira-kpi-head">
            <span class="wira-kpi-label">Need Coaching</span>
            <div class="wira-kpi-icon icon-rose"><i class="fa-solid fa-lightbulb"></i></div>
          </div>
          <div class="wira-kpi-val" id="kpiCoachingCount">0 Sales</div>
          <div class="wira-kpi-sub"><i class="fa-solid fa-circle-exclamation" style="color:#e11d48;"></i> Perlu Pendampingan SPV</div>
        </div>
      </div>

      <!-- ================= CARD DAFTAR WIRANIAGA ================= -->
      <section class="spv-card">
        <div class="card-head">
          <div>
            <h1 class="title" style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-users" style="color:#d7123a; margin-right:8px;"></i> Seluruh Wiraniaga Cabang (46 Sales)</h1>
            <p class="subtitle" style="font-size:13px; color:#64748b; margin:4px 0 0;">Monitoring akun, konversi, presensi real-time, dan evaluasi AI coaching seluruh wiraniaga cabang</p>
          </div>
          <div class="actions" style="display: flex; gap: 10px; flex-wrap: wrap;">
            <select id="selectFilterSpvWiraniaga" class="form-control" style="width: auto; padding: 10px 14px; font-weight: 700; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 13px; background: #f8fafc;" onchange="changeWiraniagaSpvFilter(this.value)">
              <option value="Semua">Semua Tim (Master - 46 Sales)</option>
              <option value="Pak Ryan">Tim Pak Ryan</option>
              <option value="Pak Alvin">Tim Pak Alvin</option>
              <option value="Pak Riva">Tim Pak Riva</option>
            </select>
            <div class="search-box">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="searchWiraniaga" placeholder="Cari nama / username..."
                oninput="filterWiraniaga()">
            </div>
            <button class="btn btn-primary" style="background: linear-gradient(135deg, #1e1014, #3d1c24); color: #d8a437; border: 1px solid #d8a437; font-weight:700; padding:10px 16px; border-radius:10px;" onclick="openModalCreate()">
              <i class="fa-solid fa-user-plus"></i> Tambah Wiraniaga
            </button>
          </div>
        </div>

        <div class="mobile-swipe-hint"><i class="fa-solid fa-arrows-left-right"></i> Geser tabel ke samping untuk melihat semua kolom</div>
        <div class="table-responsive">
          <table class="table table-board">
            <thead>
              <tr>
                <th class="num" style="width:50px;">No</th>
                <th style="min-width:240px;">Wiraniaga &amp; Tim SPV</th>
                <th style="min-width:130px;">Username</th>
                <th style="min-width:160px;">Conversion Rate</th>
                <th class="num" style="min-width:140px;">Kehadiran</th>
                <th class="num" style="min-width:120px;">Tingkatan</th>
                <th style="min-width:160px;">AI Coaching Badge</th>
                <th style="text-align:right; min-width:180px;">Aksi</th>
              </tr>
            </thead>
            <tbody id="wiraniagaBody">
              <tr>
                <td colspan="8" class="loading-state">Memuat data wiraniaga...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>

  <!-- ================= MODAL AI COACHING ADVICE ================= -->
  <div class="modal-overlay" id="modalCoaching" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:500px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2);">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;" id="coachingModalTitle"><i class="fa-solid fa-lightbulb" style="color:#f59e0b;"></i> AI Coaching Advice</h3>
        <button onclick="closeCoachingModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:16px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-size:12px; font-weight:700; color:#64748b;">PERFORMA RATE</span>
          <span style="font-size:14px; font-weight:800; color:#2563eb;" id="coachingRateText">Conversion Rate: 80%</span>
        </div>
        <div style="font-size:13px; color:#334155; line-height:1.6; background:white; padding:12px; border-radius:10px; border:1px solid #cbd5e1;" id="coachingAdviceBody">
          Loading advice...
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end;">
        <button class="btn" style="background:#2563eb; color:white; font-weight:700; border:none; padding:10px 18px; border-radius:10px; cursor:pointer;" onclick="closeCoachingModal()">Mengerti</button>
      </div>
    </div>
  </div>

  <!-- ================= FORM MODAL (CREATE / EDIT) ================= -->
  <div class="modal-overlay" id="modalWiraniaga">
    <div class="modal-content">
      <div class="modal-header">
        <h3 id="modalTitle">Tambah Akun Wiraniaga</h3>
        <button class="modal-close" onclick="closeModal()">&times;</button>
      </div>
      <div class="modal-body">
        <form id="wiraniagaForm" onsubmit="saveWiraniaga(event)">
          <input type="hidden" id="formAction" value="create">
          <input type="hidden" id="formAccountId" value="0">

          <div class="form-group">
            <label><i class="fa-solid fa-user"></i> Nama Lengkap</label>
            <input type="text" id="inputNamaLengkap" class="form-control" placeholder="Masukkan nama lengkap wiraniaga" required>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-id-card"></i> Username</label>
            <input type="text" id="inputUsername" class="form-control" placeholder="Masukkan username untuk login" required>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-lock"></i> Password <span id="passwordHelp" class="label-hint"></span></label>
            <input type="text" id="inputPassword" class="form-control" placeholder="Masukkan password">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label><i class="fa-solid fa-ranking-star"></i> Tingkatan</label>
              <select id="selectTingkatan" class="form-control">
                <option value="Magang">Magang</option>
                <option value="Junior" selected>Junior</option>
                <option value="Executive">Executive</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div class="form-group">
              <label><i class="fa-solid fa-user-tie"></i> Supervisor</label>
              <select id="selectSpv" class="form-control">
                <option value="Pak Ryan">Pak Ryan</option>
                <option value="Pak Alvin">Pak Alvin</option>
                <option value="Pak Riva">Pak Riva</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label><i class="fa-solid fa-calendar-alt"></i> Tanggal Bergabung</label>
            <input type="date" id="inputTanggalBergabung" class="form-control" required>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-secondary" onclick="closeModal()">Batal</button>
            <button type="submit" class="btn btn-primary" id="saveBtn">
              <i class="fa-solid fa-save"></i> Simpan Akun
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js?v=20260824_dendi"></script>
  <script src="../js/spv_wiraniaga.js?v=20260824_v2"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
