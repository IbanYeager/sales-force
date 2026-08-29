<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Database Follow-Up (CRM)</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style_kacab.css">
  <link rel="stylesheet" href="/css/followup.css?v=20260829_executive">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="manifest" href="/manifest.json">
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
        <a href="followup_database.html" id="navFollowup" class="active"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 46 Wiraniaga</a>
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

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2>Executive Master Follow-Up &amp; Repurchase CRM</h2>
          <p class="page-sub">Pengawasan analitik eksekutif sesuai Google Spreadsheet, monitoring 7 tahap funnel, serta pembagian database leads wiraniaga cabang</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kacabAvatar" src="/image/default-avatar.png" alt="Avatar" onerror="this.src='https://ui-avatars.com/api/?name=Kepala+Cabang&background=1E1014&color=fff'">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kacabNama">Kepala Cabang</span>
            <span class="role" id="kacabRole">Branch Manager Kiara Condong</span>
          </div>
        </div>
      </div>

      <!-- VIEW SWITCHER SEGMENTED CONTROL -->
      <div class="fu-view-nav-wrap">
        <div class="fu-view-segmented">
          <button class="fu-view-tab active" id="tabExecutiveView" onclick="switchFollowupView('executive')">
            <i class="fa-solid fa-chart-pie"></i> Executive Analytics Dashboard <span class="badge-count" id="badgeSyncStatus">Live Sync</span>
          </button>
          <button class="fu-view-tab" id="tabDatabaseView" onclick="switchFollowupView('database')">
            <i class="fa-solid fa-table-list"></i> Data Customer &amp; Penugasan <span class="badge-count" id="badgeTotalCust">0</span>
          </button>
        </div>

        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:12px; color:#64748b; font-weight:600;" id="lastSyncIndicatorText"><i class="fa-solid fa-clock-rotate-left"></i> Terakhir Sinkron: Memuat...</span>
          <button class="btn-fu btn-fu-emerald" onclick="triggerGoogleSheetSync(true)" title="Tarik pembaruan data terbaru dari Google Spreadsheet">
            <i class="fa-solid fa-arrows-rotate"></i> Sinkronkan Spreadsheet
          </button>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- SECTION 1: EXECUTIVE ANALYTICS DASHBOARD (SPREADSHEET SYNCED)   -->
      <!-- ============================================================== -->
      <div id="sectionExecutiveDashboard">
        <!-- LIVE SYNC BANNER & MODEL FILTER TOOLBAR -->
        <div class="fu-sync-banner">
          <div class="fu-sync-banner-left">
            <div class="fu-sync-icon-box">
              <i class="fa-solid fa-file-excel"></i>
            </div>
            <div class="fu-sync-info">
              <h4>
                <span class="fu-sync-pulse"></span>
                Tunas Toyota Kiara Condong — CRM Analytics Master
              </h4>
              <p id="sheetSourceInfo">Tersinkronisasi otomatis dengan Google Spreadsheet (Tab: New FU Kiara Condong &amp; MASTER)</p>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <div class="fu-model-filter-pills">
              <button class="fu-model-btn active" id="btnModelAll" onclick="setDashboardModelFilter('all')">
                <i class="fa-solid fa-layer-group"></i> Semua Model
              </button>
              <button class="fu-model-btn" id="btnModelVeloz" onclick="setDashboardModelFilter('veloz_hybrid')">
                <i class="fa-solid fa-car-side"></i> Veloz Hybrid
              </button>
              <button class="fu-model-btn" id="btnModelOthers" onclick="setDashboardModelFilter('others')">
                <i class="fa-solid fa-car"></i> Others Model
              </button>
            </div>
          </div>
        </div>

        <!-- 7 EXECUTIVE FUNNEL KPI TILES -->
        <div class="fu-funnel-grid-7">
          <!-- Step 1: Potency -->
          <div class="fu-funnel-card step-1">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 1</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-users"></i></div>
            </div>
            <div class="fu-fcard-name">Potency (Attacklist)</div>
            <div class="fu-fcard-val" id="fnPotency">0</div>
            <div class="fu-fcard-ratio">
              <span>100% Target Base</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" style="width: 100%;"></div>
            </div>
          </div>

          <!-- Step 2: Cust FU -->
          <div class="fu-funnel-card step-2">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 2</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-headset"></i></div>
            </div>
            <div class="fu-fcard-name">Customer FU</div>
            <div class="fu-fcard-val" id="fnCustFu">0</div>
            <div class="fu-fcard-ratio ratio-high">
              <i class="fa-solid fa-arrow-right-arrow-left"></i> <span id="fnRatioCustFu">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarCustFu" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Step 3: Connected -->
          <div class="fu-funnel-card step-3">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 3</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-phone-volume"></i></div>
            </div>
            <div class="fu-fcard-name">Connected (Terhubung)</div>
            <div class="fu-fcard-val" id="fnConnected">0</div>
            <div class="fu-fcard-ratio">
              <i class="fa-solid fa-percent"></i> <span id="fnRatioConnected">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarConnected" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Step 4: Contacted -->
          <div class="fu-funnel-card step-4">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 4</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-comments"></i></div>
            </div>
            <div class="fu-fcard-name">Contacted (2-Way)</div>
            <div class="fu-fcard-val" id="fnContacted">0</div>
            <div class="fu-fcard-ratio">
              <i class="fa-solid fa-percent"></i> <span id="fnRatioContacted">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarContacted" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Step 5: Hot Prospect -->
          <div class="fu-funnel-card step-5">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 5</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-fire"></i></div>
            </div>
            <div class="fu-fcard-name">Hot Prospek</div>
            <div class="fu-fcard-val" id="fnHotProspect">0</div>
            <div class="fu-fcard-ratio">
              <i class="fa-solid fa-percent"></i> <span id="fnRatioHotProspect">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarHotProspect" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Step 6: SPK -->
          <div class="fu-funnel-card step-6">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 6</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-file-signature"></i></div>
            </div>
            <div class="fu-fcard-name">SPK (Closing)</div>
            <div class="fu-fcard-val" id="fnSpk">0</div>
            <div class="fu-fcard-ratio">
              <i class="fa-solid fa-percent"></i> <span id="fnRatioSpk">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarSpk" style="width: 0%;"></div>
            </div>
          </div>

          <!-- Step 7: DO Unit -->
          <div class="fu-funnel-card step-7">
            <div class="fu-fcard-top">
              <span class="fu-fcard-step-tag">Tahap 7</span>
              <div class="fu-fcard-icon"><i class="fa-solid fa-truck-ramp-box"></i></div>
            </div>
            <div class="fu-fcard-name">DO (Delivery)</div>
            <div class="fu-fcard-val" id="fnDo">0</div>
            <div class="fu-fcard-ratio ratio-high">
              <i class="fa-solid fa-trophy"></i> <span id="fnRatioDo">0%</span>
            </div>
            <div class="fu-fcard-progress-bar">
              <div class="fu-fcard-progress-fill" id="fnBarDo" style="width: 0%;"></div>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW 1 (2 Columns: Funnel Conversion Chart & Fleet vs Retail Donut) -->
        <div class="fu-charts-row-2">
          <div class="fu-chart-card">
            <div class="fu-chart-card-head">
              <div>
                <h3><i class="fa-solid fa-filter" style="color:#3b82f6;"></i> Funnel Konversi Follow-Up (7 Tahap)</h3>
                <span class="card-sub">Perjalanan leads dari Potensi awal hingga Delivery Unit (DO)</span>
              </div>
            </div>
            <div class="fu-chart-canvas-wrap">
              <canvas id="chartFunnelConversion"></canvas>
            </div>
          </div>

          <div class="fu-chart-card">
            <div class="fu-chart-card-head">
              <div>
                <h3><i class="fa-solid fa-chart-pie" style="color:#0ea5e9;"></i> Segmentasi Pelanggan (Fleet vs Retail)</h3>
                <span class="card-sub">Distribusi basis data dan kontribusi SPK berdasarkan tipe customer</span>
              </div>
            </div>
            <div class="fu-chart-canvas-wrap">
              <canvas id="chartFleetRetail"></canvas>
            </div>
          </div>
        </div>

        <!-- CHARTS ROW 2 (3 Columns: Class HIGH/MED/LOW, Remarks Response, Top Models) -->
        <div class="fu-charts-row-3">
          <div class="fu-chart-card">
            <div class="fu-chart-card-head">
              <div>
                <h3><i class="fa-solid fa-temperature-half" style="color:#f59e0b;"></i> Prioritas / Suhu Leads</h3>
                <span class="card-sub">HIGH, MEDIUM, dan LOW</span>
              </div>
            </div>
            <div class="fu-chart-canvas-wrap">
              <canvas id="chartTemperatureClass"></canvas>
            </div>
          </div>

          <div class="fu-chart-card">
            <div class="fu-chart-card-head">
              <div>
                <h3><i class="fa-solid fa-comments-dollar" style="color:#10b981;"></i> Distribusi Respon Follow-Up</h3>
                <span class="card-sub">Status hasil kontak wiraniaga</span>
              </div>
            </div>
            <div class="fu-chart-canvas-wrap">
              <canvas id="chartResponseDistribution"></canvas>
            </div>
          </div>

          <div class="fu-chart-card">
            <div class="fu-chart-card-head">
              <div>
                <h3><i class="fa-solid fa-car-rear" style="color:#d7123a;"></i> Top Model Kendaraan</h3>
                <span class="card-sub">Basis model kendaraan repurchase</span>
              </div>
            </div>
            <div class="fu-chart-canvas-wrap">
              <canvas id="chartTopModels"></canvas>
            </div>
          </div>
        </div>

        <!-- CLUSTER PERFORMANCE TABLE -->
        <div class="fu-table-card">
          <div class="fu-table-head-bar">
            <h3><i class="fa-solid fa-sitemap" style="color:#d7123a;"></i> Analisis Performa Klaster Pelanggan (Cluster Matrix)</h3>
            <span style="font-size:12px; color:#64748b; font-weight:600;" id="clusterCountText">9 Klaster Segmentasi TAM</span>
          </div>
          <div style="overflow-x:auto;">
            <table class="fu-analytics-table">
              <thead>
                <tr>
                  <th>Klaster Pelanggan</th>
                  <th class="num">Potency</th>
                  <th class="num">Cust FU</th>
                  <th class="num">FU %</th>
                  <th class="num">Connected</th>
                  <th class="num">Contacted</th>
                  <th class="num">Hot Prospek</th>
                  <th class="num">SPK</th>
                  <th class="num">DO</th>
                  <th class="num">Closing Rate (%)</th>
                </tr>
              </thead>
              <tbody id="tbodyClusterBreakdown">
                <tr>
                  <td colspan="10" style="text-align:center; padding:24px; color:#64748b;">Memuat data analisis klaster...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- SALES PERFORMANCE LEADERBOARD TABLE -->
        <div class="fu-table-card">
          <div class="fu-table-head-bar">
            <h3><i class="fa-solid fa-trophy" style="color:#f59e0b;"></i> Leaderboard Performa Follow-Up Wiraniaga (Sales PIC)</h3>
            <span style="font-size:12px; color:#64748b; font-weight:600;" id="salesLeaderboardCount">46 Wiraniaga</span>
          </div>
          <div style="overflow-x:auto;">
            <table class="fu-analytics-table">
              <thead>
                <tr>
                  <th style="width:50px; text-align:center;">Peringkat</th>
                  <th>Nama Wiraniaga</th>
                  <th class="num">Leads Ditugaskan</th>
                  <th class="num">Cust FU</th>
                  <th class="num">Connected</th>
                  <th class="num">Contacted</th>
                  <th class="num">Hot Prospek</th>
                  <th class="num">SPK Closing</th>
                  <th class="num">DO Unit</th>
                  <th class="num">Closing Rate (%)</th>
                </tr>
              </thead>
              <tbody id="tbodySalesLeaderboard">
                <tr>
                  <td colspan="10" style="text-align:center; padding:24px; color:#64748b;">Memuat data performa wiraniaga...</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ============================================================== -->
      <!-- SECTION 2: MASTER DATABASE CUSTOMER & CRM ACTION MANAGEMENT   -->
      <!-- ============================================================== -->
      <div id="sectionCustomerDatabase" style="display:none;">
        <!-- 5 KPI TILES -->
        <div class="kpi-grid-5">
          <div class="kpi-card card-blue">
            <div class="fu-kpi-head">
              <span class="fu-kpi-lbl">Total Database</span>
              <div class="fu-kpi-icon-wrap fu-kpi-icon-blue">
                <i class="fa-solid fa-users"></i>
              </div>
            </div>
            <div class="fu-kpi-val" id="kpiTotal">0</div>
            <div class="fu-kpi-sub">
              <span class="fu-badge-pill pill-blue"><i class="fa-solid fa-building"></i> Seluruh Cabang</span>
            </div>
          </div>

          <div class="kpi-card card-amber">
            <div class="fu-kpi-head">
              <span class="fu-kpi-lbl">Belum Dihubungi</span>
              <div class="fu-kpi-icon-wrap fu-kpi-icon-amber">
                <i class="fa-solid fa-hourglass-half"></i>
              </div>
            </div>
            <div class="fu-kpi-val" id="kpiPending">0</div>
            <div class="fu-kpi-sub">
              <span class="fu-badge-pill pill-amber"><i class="fa-solid fa-bolt"></i> Prioritas Kontak</span>
            </div>
          </div>

          <div class="kpi-card card-cyan">
            <div class="fu-kpi-head">
              <span class="fu-kpi-lbl">Menunggu Respon</span>
              <div class="fu-kpi-icon-wrap fu-kpi-icon-cyan">
                <i class="fa-solid fa-comments"></i>
              </div>
            </div>
            <div class="fu-kpi-val" id="kpiWaiting">0</div>
            <div class="fu-kpi-sub">
              <span class="fu-badge-pill pill-cyan"><i class="fa-solid fa-clock-rotate-left"></i> Dalam Progres</span>
            </div>
          </div>

          <div class="kpi-card card-purple">
            <div class="fu-kpi-head">
              <span class="fu-kpi-lbl">Tertarik / Servis</span>
              <div class="fu-kpi-icon-wrap fu-kpi-icon-purple">
                <i class="fa-solid fa-thumbs-up"></i>
              </div>
            </div>
            <div class="fu-kpi-val" id="kpiInterested">0</div>
            <div class="fu-kpi-sub">
              <span class="fu-badge-pill pill-purple"><i class="fa-solid fa-fire"></i> Hot Prospect</span>
            </div>
          </div>

          <div class="kpi-card card-emerald">
            <div class="fu-kpi-head">
              <span class="fu-kpi-lbl">Deal / Selesai</span>
              <div class="fu-kpi-icon-wrap fu-kpi-icon-emerald">
                <i class="fa-solid fa-circle-check"></i>
              </div>
            </div>
            <div class="fu-kpi-val" id="kpiDeal">0</div>
            <div class="fu-kpi-sub">
              <span class="fu-badge-pill pill-emerald"><i class="fa-solid fa-trophy"></i> Closing Selesai</span>
            </div>
          </div>
        </div>

        <!-- NOTIFIKASI WIRANIAGA SELESAI FOLLOW-UP (SIAP TAMBAH LEADS) -->
        <div id="quotaRefillNotificationBar" style="display:none; margin-bottom:18px;"></div>

        <!-- MASTER ACTION TOOLBAR -->
        <div class="fu-master-toolbar">
          <div class="fu-toolbar-left">
            <!-- Hidden File Input for Excel Import -->
            <input type="file" id="excelFileInput" accept=".xlsx, .xls, .csv" style="display:none;" onchange="handleExcelUpload(this)">

            <button class="btn-fu btn-fu-emerald" onclick="document.getElementById('excelFileInput').click()">
              <i class="fa-solid fa-file-excel"></i> Impor Excel / CSV
            </button>

            <!-- SMART QUOTA DISTRIBUTION BUTTON -->
            <button class="btn-fu btn-fu-crimson" onclick="openSmartDistributionModal()">
              <i class="fa-solid fa-bolt-lightning"></i> Bagi Kuota (50 / 100)
            </button>

            <button class="btn-fu btn-fu-secondary" style="background:#fff7ed; color:#c2410c !important; border:1px solid #fed7aa;" onclick="openRecallBySalesModal()" title="Batalkan dan tarik semua database dari 1 sales tertentu">
              <i class="fa-solid fa-user-xmark" style="color:#ea580c;"></i> Tarik DB per Sales
            </button>

            <button class="btn-fu btn-fu-secondary" style="background:#eff6ff; color:#1d4ed8 !important; border:1px solid #bfdbfe;" onclick="openBatchEditModal()" title="Ubah status Connected, Contacted, Prospect, SPK, dan Status Follow-Up sekaligus untuk banyak data atau 1 perusahaan">
              <i class="fa-solid fa-pen-to-square" style="color:#2563eb;"></i> Ubah Data Massal
            </button>

            <button class="btn-fu btn-fu-secondary" onclick="openAddCustomerModal()">
              <i class="fa-solid fa-user-plus"></i> + Customer
            </button>
          </div>

          <div class="fu-toolbar-right">
            <button class="btn-fu btn-fu-secondary" onclick="openTemplateManagerModal()">
              <i class="fa-brands fa-whatsapp" style="color:#25D366; font-size:14px;"></i> Template WA
            </button>

            <button class="btn-fu btn-fu-secondary" onclick="openSyncSettingsModal()">
              <i class="fa-solid fa-arrows-rotate" style="color:#0f9d58; font-size:13px;"></i> Sync Sheet
            </button>

            <a href="/api/api_followup_sync.php?action=export_csv" class="btn-fu btn-fu-secondary">
              <i class="fa-solid fa-file-arrow-down" style="color:#0284c7; font-size:13px;"></i> Ekspor CSV
            </a>

            <button class="btn-fu btn-fu-danger-outline" onclick="confirmResetDatabase()" title="Kosongkan seluruh data customer">
              <i class="fa-solid fa-trash-can" style="color:#ef4444; font-size:13px;"></i> Reset DB
            </button>
          </div>
        </div>

        <!-- BULK ACTION FLOATING BAR -->
        <div id="bulkActionBar" style="display:none; background:linear-gradient(135deg, #1e1014 0%, #3f121d 100%); color:#ffffff; padding:14px 20px; border-radius:16px; margin-bottom:18px; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:12px; box-shadow:0 10px 30px rgba(215,18,58,0.25);">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:32px; height:32px; border-radius:50%; background:rgba(16,185,129,0.2); color:#10b981; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="fa-solid fa-check"></i>
            </div>
            <span style="font-weight:800; font-size:13.5px;" id="selectedCountSpan">0 customer dipilih</span>
          </div>

          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <select id="bulkSalesSelect" class="fu-select" style="width:auto; padding:8px 14px; font-size:12px; font-weight:700; background:#ffffff; color:#0f172a; border-radius:10px;">
            </select>

            <button class="btn-fu btn-fu-crimson" onclick="executeBulkAssign()">
              <i class="fa-solid fa-user-check"></i> Tugaskan ke Sales
            </button>

            <button class="btn-fu" style="background:#2563eb; color:#ffffff !important; border:none; box-shadow:0 4px 12px rgba(37,99,235,0.35);" onclick="openBatchEditModal('selected')" title="Ubah status respon, connected, prospect, spk untuk customer terpilih">
              <i class="fa-solid fa-pen-to-square"></i> Ubah Data Terpilih
            </button>

            <button class="btn-fu btn-fu-secondary" style="background:rgba(255,255,255,0.15); color:#ffffff !important; border-color:rgba(255,255,255,0.25);" onclick="executeAutoDistribute()">
              <i class="fa-solid fa-scale-balanced" style="color:#ffffff;"></i> Bagi Rata
            </button>

            <button class="btn-fu" style="background:linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color:#ffffff !important; border:none; box-shadow:0 4px 12px rgba(245,158,11,0.35);" onclick="executeBulkUnassign()" title="Batalkan pembagian customer terpilih dari sales (kembalikan ke pool)">
              <i class="fa-solid fa-user-xmark"></i> Batalkan Penugasan
            </button>

            <button class="btn-fu" style="background:linear-gradient(135deg, #ea580c 0%, #c2410c 100%); color:#ffffff !important; border:none; box-shadow:0 4px 12px rgba(234,88,12,0.35);" onclick="executeReleaseToPool()" title="Lepas data customer ini ke Pool Rebutan Prospek">
              <i class="fa-solid fa-fire"></i> Lepas ke Pool Rebutan
            </button>

            <button class="btn-fu" style="background:#ef4444; color:#ffffff !important; border:none; box-shadow:0 4px 12px rgba(239,68,68,0.3);" onclick="confirmBulkDelete()">
              <i class="fa-solid fa-trash-can"></i> Hapus Terpilih
            </button>
          </div>
        </div>

        <!-- FILTER CONTROLS & SEARCH CARD -->
        <div class="fu-filter-card">
          <div class="fu-input-with-icon">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" class="fu-input" placeholder="Cari nama, no WA, plat, atau unit..." oninput="masterState.filters.search = this.value; loadMasterCustomers();">
          </div>

          <div>
            <select id="filterSalesSelect" class="fu-select" onchange="masterState.filters.sales_id = this.value; loadMasterCustomers();">
              <option value="all">Semua Sales PIC (46 Wiraniaga)</option>
            </select>
          </div>

          <div>
            <select id="filterStatusSelect" class="fu-select" onchange="masterState.filters.status = this.value; loadMasterCustomers();">
              <option value="all">Semua Status Follow Up</option>
              <option value="belum_fu">Belum Di-Follow Up</option>
              <option value="sudah_fu">Sudah Di-Follow Up (Semua)</option>
              <option value="Menunggu Respon">Menunggu Respon</option>
              <option value="Tertarik / Jadwal Servis">Tertarik / Servis</option>
              <option value="Deal / Selesai">Deal / Selesai</option>
              <option value="Tidak Tertarik">Tidak Tertarik</option>
            </select>
          </div>

          <div>
            <select id="filterCategorySelect" class="fu-select" onchange="masterState.filters.category = this.value; loadMasterCustomers();">
              <option value="all">Semua Kategori</option>
            </select>
          </div>
        </div>

        <!-- MASTER TABLE -->
        <div class="followup-table-wrap">
          <div style="padding:12px 16px; border-bottom:1.5px solid #e2e8f0; display:flex; justify-content:space-between; align-items:center; background:#f8fafc;">
            <h3 style="font-size:13.5px; font-weight:800; color:#0f172a; margin:0;">Database Customer Cabang Tunas Toyota Kiara Condong</h3>
            <span style="font-size:11.5px; color:#64748b; font-weight:600;" id="tableCountText">Total: 0 Customer</span>
          </div>

          <div style="overflow-x:auto;">
            <table class="followup-table">
              <thead>
                <tr>
                  <th style="width:44px; text-align:center;">
                    <input type="checkbox" style="width:17px; height:17px; accent-color:#d7123a; cursor:pointer;" onchange="toggleSelectAll(this.checked)">
                  </th>
                  <th style="width:52px; text-align:center;">No.</th>
                  <th style="min-width:230px;">Customer &amp; Kontak</th>
                  <th style="min-width:210px;">Unit Mobil &amp; Usia</th>
                  <th style="min-width:180px;">Kategori &amp; Klaster</th>
                  <th style="min-width:185px;">Status Terkini</th>
                  <th style="min-width:190px;">Sales PIC</th>
                  <th style="max-width:150px;">Catatan</th>
                  <th style="text-align:right; min-width:120px;">Aksi</th>
                </tr>
              </thead>
              <tbody id="masterCustomerTbody">
                <tr>
                  <td colspan="9" style="text-align:center; padding:30px; color:#64748b;">
                    Memuat data...
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        <!-- PAGINATION BAR -->
        <div id="paginationContainer" class="fu-pagination-bar"></div>
      </div>
    </main>
  </div>

  <!-- SCRIPTS -->
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="/custom_alert.js?v=25"></script>
  <script src="/js/kacab_global.js?v=20260824_dendi"></script>
  <script src="/js/followup_master.js?v=20260829_executive_dashboard"></script>
  <script src="/js/pwa-app.js?v=3"></script>
</body>
</html>
