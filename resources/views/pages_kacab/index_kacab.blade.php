<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css">

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
        <a href="index_kacab.html" id="navDash" class="active"><i class="fa-solid fa-gauge-high"></i>Dashboard Cabang</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
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

    <!-- MAIN -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Dashboard Cabang</h2>
          <p class="page-sub" id="dashPeriode">Memuat periode...</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Memuat...</span>
            <span class="role" id="kcbRole">Memuat...</span>
          </div>
        </div>
      </div>

      <!-- ===== KPI SUMMARY ===== -->
      <div class="grid-4" style="margin-bottom:18px;">
        <div class="kpi-card clickable" onclick="location.href='monitoring_spv.html'" style="animation-delay:0.02s;">
          <div class="kpi-head">
            <span class="kpi-title">Total SPV</span>
            <div class="kpi-icon gold"><i class="fa-solid fa-user-tie"></i></div>
          </div>
          <div class="kpi-value" id="kpiSpv">0</div>
          <div class="kpi-sub" id="kpiSpvSub"><span style="color:#10b981; font-weight:800;"><i class="fa-solid fa-circle" style="font-size:7px;"></i> 0 Online</span> &middot; <span style="color:#94a3b8;">0 Offline</span></div>
        </div>

        <div class="kpi-card clickable" onclick="location.href='monitoring_spv.html'" style="animation-delay:0.06s;">
          <div class="kpi-head">
            <span class="kpi-title">Total Sales</span>
            <div class="kpi-icon violet"><i class="fa-solid fa-users"></i></div>
          </div>
          <div class="kpi-value" id="kpiSales">0</div>
          <div class="kpi-sub"><span class="pos" id="kpiSalesActive">0 Online</span> &middot; <span class="neg"
              id="kpiSalesInactive">0 Offline</span></div>
        </div>

        <div class="kpi-card" style="animation-delay:0.1s;">
          <div class="kpi-head">
            <span class="kpi-title">SPK Bulan Ini</span>
            <div class="kpi-icon blue"><i class="fa-solid fa-file-signature"></i></div>
          </div>
          <div class="kpi-value" id="kpiSpk">0 <small id="kpiSpkTarget">/ 0</small></div>
          <div class="kpi-progress">
            <div class="track">
              <div class="fill blue" id="kpiSpkBar"></div>
            </div>
            <div class="pct-row"><span>Pencapaian cabang</span><span id="kpiSpkPct">0%</span></div>
          </div>
        </div>

        <div class="kpi-card" style="animation-delay:0.14s;">
          <div class="kpi-head">
            <span class="kpi-title">DO per Evaluasi</span>
            <div class="kpi-icon red"><i class="fa-solid fa-truck-fast"></i></div>
          </div>
          <div class="kpi-value" id="kpiDo">0 <small id="kpiDoTarget">/ 0</small></div>
          <div class="kpi-progress">
            <div class="track">
              <div class="fill red" id="kpiDoBar"></div>
            </div>
            <div class="pct-row"><span id="kpiDoLabel">Evaluasi 4 bulan</span><span id="kpiDoPct">0%</span></div>
          </div>
        </div>
      </div>

      <!-- ===== AREA OPERATION (AO) REPORT EXECUTIVE COCKPIT ===== -->
      <section class="kcb-card" style="background:#ffffff; border:1.5px solid #cbd5e1; border-radius:16px; padding:20px; box-shadow:0 4px 18px rgba(0,0,0,0.04); margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:42px; height:42px; border-radius:12px; background:linear-gradient(135deg, #1e1014, #3b1d28); color:#d8a437; display:flex; align-items:center; justify-content:center; font-size:20px; box-shadow:0 4px 12px rgba(30,16,20,0.2);">
              <i class="fa-solid fa-chalkboard-user"></i>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
                  Papan Area Operation (AO) Report Cabang
                </h3>
                <span style="background:#dcfce7; color:#15803d; border:1px solid #bbf7d0; font-weight:800; padding:3px 10px; border-radius:20px; font-size:11px;">
                  <i class="fa-solid fa-circle-check"></i> Matching Ratio: 86%
                </span>
              </div>
              <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">
                Tunas Toyota Kiara Condong &middot; Sinkronisasi Stock Matching, Ritme SPK 5-Harian, dan Estimasi Closing 104 Unit.
              </p>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-sm" onclick="location.href='ao_report_kacab.html'" style="background:linear-gradient(135deg, #1e1014, #4a1525); color:#d8a437; border:1px solid rgba(216,164,55,0.4); font-weight:800; font-size:12px; padding:9px 16px; border-radius:10px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; box-shadow:0 4px 14px rgba(30,16,20,0.25);">
              <i class="fa-solid fa-expand"></i> Buka Papan AO Report Eksekutif
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(135px, 1fr)); gap:12px; text-align:center;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">Full Stock Cabang</div>
            <div style="font-size:22px; font-weight:900; color:#0f172a; margin:3px 0;">124</div>
            <div style="font-size:10.5px; font-weight:700; color:#0284c7;">Free: 82 | Match: 42</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">OS Order &lt;30d</div>
            <div style="font-size:22px; font-weight:900; color:#2563eb; margin:3px 0;">48</div>
            <div style="font-size:10.5px; font-weight:700; color:#1d4ed8;">Firmed: 18 | Match: 30</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">SPK Gross Actual</div>
            <div style="font-size:22px; font-weight:900; color:#d97706; margin:3px 0;">54</div>
            <div style="font-size:10.5px; font-weight:700; color:#b45309;">Ritme 1-10: +14 Gap</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:12px 10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">DO Target Cabang</div>
            <div style="font-size:22px; font-weight:900; color:#059669; margin:3px 0;">92</div>
            <div style="font-size:10.5px; font-weight:700; color:#047857;">Potensi fr OS: 52 (Gap 40)</div>
          </div>
          <div style="background:linear-gradient(135deg, #fef3c7, #fde68a); border:1.5px solid #f59e0b; border-radius:12px; padding:12px 10px;">
            <div style="font-size:11px; font-weight:800; color:#92400e;">Est. Closing Bulan</div>
            <div style="font-size:24px; font-weight:900; color:#78350f; margin:2px 0;">104</div>
            <div style="font-size:10.5px; font-weight:800; color:#b45309;">+12 Over Target (113%) 🎉</div>
          </div>
        </div>
      </section>

      <!-- ===== AI SENTINEL EARLY WARNING (STANDAR 5-HARIAN SPK/DO) ===== -->
      <section class="kcb-card" id="aiSentinelContainer" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:16px; padding:20px; box-shadow:0 4px 18px rgba(0,0,0,0.04); margin-bottom:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
          <div>
            <div style="display:flex; align-items:center; gap:8px;">
              <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0;">
                <i class="fa-solid fa-robot" style="color:#6366f1; margin-right:6px;"></i>AI Sentinel: Pengawas Target Harian Kacab
              </h3>
              <span id="sentinelStatusBadge" style="background:#fef2f2; color:#dc2626; border:1px solid #fecaca; font-weight:800; padding:4px 10px; border-radius:20px; font-size:11px;">
                <i class="fa-solid fa-spinner fa-spin"></i> Menganalisis Ritme...
              </span>
            </div>
            <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">
              Sistem AI mengevaluasi pencapaian SPK/DO per interval 5 hari (Hari 1-5: Min 1 | Hari 6-10: Min 2 | Hari 11-15: Min 3 | dst).
            </p>
          </div>

          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="display:flex; align-items:center; gap:6px; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:10px; font-size:12px;">
              <span style="font-weight:700; color:#475569;">Simulasi Hari:</span>
              <select id="selectSimulasiHari" onchange="changeSentinelDay(this.value)" style="border:none; background:transparent; font-weight:800; color:#0f172a; outline:none; cursor:pointer;">
                <option value="5">Hari Ke-5 (Min. 1 SPK/DO)</option>
                <option value="10">Hari Ke-10 (Min. 2 SPK/DO)</option>
                <option value="15">Hari Ke-15 (Min. 3 SPK/DO)</option>
                <option value="19" selected>Hari Ke-19 (Min. 4 SPK/DO - Hari Ini)</option>
                <option value="25">Hari Ke-25 (Min. 5 SPK/DO)</option>
                <option value="30">Hari Ke-30 (Min. 6 SPK/DO)</option>
              </select>
            </div>

            <button class="btn btn-sm" onclick="syncGoogleSheetNow()" id="btnSyncGoogleSheet" style="background:#0f9d58; color:white; font-weight:800; font-size:12px; border:none; padding:8px 12px; border-radius:10px; display:inline-flex; align-items:center; gap:6px; cursor:pointer; box-shadow:0 3px 10px rgba(15,157,88,0.25);">
              <i class="fa-solid fa-file-excel"></i> Tarik Google Sheet
            </button>

            <button class="btn btn-sm" onclick="toggleSentinelSettings()" style="background:#e0e7ff; color:#4338ca; font-weight:800; font-size:12px; border:1px solid #c7d2fe; padding:8px 12px; border-radius:10px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
              <i class="fa-solid fa-clock"></i> Atur Jadwal Otomasi
            </button>

            <button class="btn btn-sm" onclick="sendKacabAiReportWA()" style="background:linear-gradient(135deg, #25D366, #128C7E); color:white; font-weight:800; font-size:12px; border:none; padding:8px 14px; border-radius:10px; display:inline-flex; align-items:center; gap:6px; box-shadow:0 4px 12px rgba(37,211,102,0.25); cursor:pointer;">
              <i class="fa-brands fa-whatsapp" style="font-size:15px;"></i> Kirim WA Manual
            </button>
          </div>
        </div>

        <!-- Google Sheet Sync Bar -->
        <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div style="font-size:12px; color:#166534; font-weight:700; display:flex; align-items:center; gap:6px;">
            <i class="fa-solid fa-cloud-arrow-down" style="color:#0f9d58;"></i>
            <span>Google Sheet Sinkronisasi:</span>
            <span id="googleSheetSyncStatus" style="font-weight:800; color:#14532d;">Tersinkron (57 SPK | 25 DO)</span>
          </div>
          <a href="https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?usp=sharing" target="_blank" style="font-size:11.5px; color:#0f9d58; text-decoration:none; font-weight:800; display:inline-flex; align-items:center; gap:4px;">
            <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Google Spreadsheet
          </a>
        </div>

        <!-- Panel Pengaturan Otomasi Jadwal Jam Kirim (Collapsible) -->
        <div id="sentinelSettingsPanel" style="display:none; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
            <div style="font-size:13px; font-weight:800; color:#1e293b;">
              <i class="fa-solid fa-clock-rotate-left" style="color:#4f46e5;"></i> Pengaturan Jadwal Jam Pengiriman Otomatis ke WhatsApp Kacab
            </div>
            <span id="schedulerActiveBadge" style="font-size:11px; background:#dcfce7; color:#166534; font-weight:800; padding:3px 8px; border-radius:6px; border:1px solid #bbf7d0;">
              <i class="fa-solid fa-circle-check"></i> Scheduler Aktif: 06:00 WIB
            </span>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:12px; margin-bottom:12px;">
            <div>
              <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nomor WhatsApp Kacab:</label>
              <input type="text" id="kacabWaNumberInput" placeholder="081234567890" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px; font-weight:700; color:#0f172a; box-sizing:border-box;">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;"><i class="fa-regular fa-clock"></i> Jam Pengiriman Otomatis (Bisa Diubah):</label>
              <input type="time" id="kacabScheduleTimeInput" value="06:00" style="width:100%; padding:7px 10px; border-radius:8px; border:1.5px solid #6366f1; font-size:13px; font-weight:800; color:#1e1b4b; background:#eef2ff; box-sizing:border-box; cursor:pointer;">
            </div>
            <div>
              <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Token Gateway (Opsional Fonnte):</label>
              <input type="password" id="kacabGatewayTokenInput" placeholder="Masukkan token jika pakai Fonnte API" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px; box-sizing:border-box;">
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <p style="font-size:11.5px; color:#64748b; margin:0;">
              <i class="fa-solid fa-circle-info"></i> Laporan otomatis dikirim setiap hari pada jam yang Anda tentukan di atas jika ada sales yang perlu di-review.
            </p>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm" onclick="saveSentinelSettings()" style="background:#4f46e5; color:white; font-weight:700; font-size:11.5px; border:none; padding:7px 14px; border-radius:8px; cursor:pointer;">
                <i class="fa-solid fa-floppy-disk"></i> Simpan Jadwal & No. WA
              </button>
              <button class="btn btn-sm" onclick="testCronExecutionNow()" style="background:#0284c7; color:white; font-weight:700; font-size:11.5px; border:none; padding:7px 14px; border-radius:8px; cursor:pointer;">
                <i class="fa-solid fa-bolt"></i> Test Kirim Sekarang
              </button>
            </div>
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <span style="font-size:12px; font-weight:800; color:#334155; text-transform:uppercase; letter-spacing:0.5px;">
            <i class="fa-solid fa-list-check" style="color:#6366f1; margin-right:4px;"></i> Status Ritme: <span id="sentinelPeriodLabel" style="color:#0f172a;">Hari 16 - 20 (Target Min. 4 SPK/DO)</span>
          </span>
          <span style="font-size:11px; color:#94a3b8;"><i class="fa-solid fa-bolt"></i> Evaluasi otomatis real-time</span>
        </div>

        <div id="sentinelListContainer">
          <p class="loading-state" style="padding:15px;"><i class="fa-solid fa-spinner fa-spin"></i> AI sedang menganalisis seluruh data 46 wiraniaga cabang...</p>
        </div>
      </section>

      <!-- ===== EXECUTIVE REVENUE & STOCK AGING SECTION ===== -->
      <div class="grid-2" style="margin-bottom:18px;">
        <!-- Card 1: Estimasi Revenue & Insentif Cabang -->
        <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-chart-line" style="color:#059669; margin-right:8px;"></i>Estimasi Omset & Revenue Cabang</h3>
            <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:12px;">Live Executive Metric</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">ESTIMASI OMSET SPK</div>
              <div style="font-size:18px; font-weight:900; color:#0f172a; margin-top:4px;" id="kcbEstimasiOmset">Rp 7.000.000.000</div>
              <div style="font-size:11px; color:#059669; font-weight:600; margin-top:2px;"><i class="fa-solid fa-square-poll-vertical"></i> Projected Revenue</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">INSENTIF FINANSIAL & TCO</div>
              <div style="font-size:18px; font-weight:900; color:#2563eb; margin-top:4px;" id="kcbInsentifFinansial">Rp 140.000.000</div>
              <div style="font-size:11px; color:#2563eb; font-weight:600; margin-top:2px;"><i class="fa-solid fa-hand-holding-dollar"></i> Leasing & Accessories Margin</div>
            </div>
          </div>
        </section>

        <!-- Card 2: Stock Aging & Inventory Health Alert -->
        <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
            <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-warehouse" style="color:#d97706; margin-right:8px;"></i>Stock Aging & Slow Moving Alert</h3>
            <span style="font-size:11px; font-weight:700; background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:12px;" id="badgeAgingCount">2 Unit Slow Moving</span>
          </div>
          <div id="agingStockContainer">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; color:#9f1239; font-size:13px;">Innova Zenix 2.0 V HV CVT (Black)</div>
                  <div style="font-size:11px; color:#be123c;">Stok: 2 Unit &middot; Berada di gudang 45 hari (Slow Moving)</div>
                </div>
                <button class="btn btn-sm" style="background:#e11d48; color:white; font-size:11px; border:none; font-weight:700; padding:6px 12px; border-radius:6px; cursor:pointer;" onclick="instructSpvPushPromo('Innova Zenix 2.0 V HV CVT')"><i class="fa-brands fa-whatsapp"></i> Push Promo SPV</button>
              </div>

              <div style="background:#fff1f2; border:1px solid #fecdd3; border-radius:10px; padding:10px 14px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                  <div style="font-weight:700; color:#9f1239; font-size:13px;">Fortuner 2.8 VRZ 4x2 A/T (White)</div>
                  <div style="font-size:11px; color:#be123c;">Stok: 1 Unit &middot; Berada di gudang 38 hari (Slow Moving)</div>
                </div>
                <button class="btn btn-sm" style="background:#e11d48; color:white; font-size:11px; border:none; font-weight:700; padding:6px 12px; border-radius:6px; cursor:pointer;" onclick="instructSpvPushPromo('Fortuner 2.8 VRZ 4x2 A/T')"><i class="fa-brands fa-whatsapp"></i> Push Promo SPV</button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <!-- ===== PERINGKAT SPV + AKTIVITAS TERBARU ===== -->
      <div class="grid-2">
        <section class="kcb-card" style="animation-delay:0.18s;">
          <h3 class="card-label"><i class="fa-solid fa-ranking-star"></i> Peringkat Kinerja SPV
            <span class="spacer"></span>
            <a href="monitoring_spv.html" class="btn btn-ghost btn-sm">Lihat Semua <i
                class="fa-solid fa-arrow-right"></i></a>
          </h3>
          <div class="spv-board" id="spvBoard">
            <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
          </div>
        </section>

        <section class="kcb-card" style="animation-delay:0.22s;">
          <h3 class="card-label"><i class="fa-solid fa-bolt"></i> Aktivitas Terbaru
            <span class="spacer"></span>
            <a href="aktivitas.html" class="btn btn-ghost btn-sm">Timeline <i class="fa-solid fa-arrow-right"></i></a>
          </h3>
          <div class="feed-list" id="feedList">
            <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
          </div>
        </section>
      </div>
    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/kacab_global.js?v=20260826_sheets_live"></script>
  <script src="../js/kacab_index.js?v=20260826_sheets_live"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
