<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Dashboard Penjualan Toyota KC 2026</title>
  
  <!-- Font & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Kacab Theme & 2026 Sales Dashboard Styles -->
  <link rel="stylesheet" href="/css/style_kacab.css?v={{ time() }}">
  <link rel="stylesheet" href="/css/sales_dashboard.css?v={{ time() }}">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#0f172a">
</head>

<body>
  <div class="kcb-shell">
    <!-- SIDEBAR KACAB -->
    <aside class="kcb-sidebar">
      <div class="kcb-brand-container">
        <div class="kcb-brand-logo">
          <img
            src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
            alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="kcb-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-building-user"></i> KACAB PANEL</span>
          <p class="panel-sub"><span class="panel-sub-dot"></span> Cabang Kiara Condong</p>
        </div>
      </div>

      <div class="kcb-search-wrap">
        <div class="kcb-search-box">
          <i class="fa-solid fa-magnifying-glass kcb-search-icon"></i>
          <input type="text" class="kcb-search-input" id="kcbSearchInput" placeholder="Cari menu &amp; fitur..." autocomplete="off" spellcheck="false">
          <kbd class="kcb-search-kbd">Ctrl+K</kbd>
          <button type="button" class="kcb-search-clear" id="kcbSearchClear" style="display:none;" title="Bersihkan pencarian">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
      </div>

      <nav class="kcb-nav">
        <!-- Kategori 1: Eksekutif & Dashboard -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-chart-line"></i> Eksekutif &amp; Dashboard</span>
          <a href="index_kacab.html" id="navDash" class="active"><i class="fa-solid fa-gauge-high"></i> Dashboard Cabang</a>
          <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i> Laporan Eksekutif</a>
          <a href="performa_regional.html" id="navRegional"><i class="fa-solid fa-earth-asia"></i> Performa Regional Jabar</a>
        </div>

        <!-- Kategori 2: Pipeline & Sales CRM -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-funnel-dollar"></i> Pipeline &amp; Sales CRM</span>
          <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i> Penjualan Kircon</a>
          <a href="penjualan_tco.html" id="navTco"><i class="fa-solid fa-gem"></i> Penjualan &amp; Polreg TCO</a>
          <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i> Database Follow-Up (CRM)</a>
          <a href="ao_report_kacab.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i> AO Report Cabang</a>
          <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i> Otorisasi &amp; Approval</a>
        </div>

        <!-- Kategori 3: Monitoring Tim & Sales -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-users-gear"></i> Monitoring Tim &amp; Sales</span>
          <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i> Monitoring Tim SPV</a>
          <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i> Data 57 Wiraniaga <span class="kcb-nav-badge badge-gold">57 Sales</span></a>
          <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i> Target &amp; Produktivitas</a>
          <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i> Aktivitas &amp; Riwayat Sales</a>
          <a href="riwayat_foto_aktivitas.html" id="navFotoAktivitas"><i class="fa-solid fa-images"></i> Riwayat Foto Aktivitas</a>
          <a href="peta_kunjungan.html" id="navPeta"><i class="fa-solid fa-map-location-dot"></i> Peta GPS Kunjungan</a>
        </div>

        <!-- Kategori 4: Stok & Operasional -->
        <div class="kcb-nav-category">
          <span class="kcb-category-title"><i class="fa-solid fa-warehouse"></i> Stok &amp; Operasional</span>
          <a href="inventory.html" id="navStock"><i class="fa-solid fa-warehouse"></i> Live Stok <span class="kcb-nav-badge badge-gold">1.638 Unit</span></a>
          <a href="after_sales.html" id="navAfterSales"><i class="fa-solid fa-wrench"></i> After Sales</a>
          <a href="mtoyota_service.html" id="navMtoyota"><i class="fa-solid fa-car-on"></i> m-Toyota &amp; Service</a>
          <a href="olx.html" id="navOlx"><i class="fa-solid fa-repeat"></i> Trade-In &amp; OLX</a>
        </div>

        <div class="kcb-search-empty" id="kcbSearchEmpty" style="display:none;">
          <i class="fa-solid fa-magnifying-glass"></i>
          <p>Menu tidak ditemukan</p>
          <span>Coba gunakan kata kunci lain</span>
        </div>
      </nav>

      <div class="sidebar-footer">
        <div class="kcb-footer-profile">
          <div class="kcb-footer-avatar-wrap">
            <img src="https://ui-avatars.com/api/?name=Dendi+Holius&background=0f172a&color=ffffff&bold=true" alt="Dendi Holius" class="kcb-footer-avatar" id="kcbFooterAvatar">
            <span class="kcb-footer-dot" title="Sistem Aktif &amp; Terhubung"></span>
          </div>
          <div class="kcb-footer-meta">
            <span class="kcb-footer-name" id="kcbFooterName">Dendi Holius</span>
            <span class="kcb-footer-role"><i class="fa-solid fa-user-tie" style="font-size:10px; color:#94a3b8;"></i> Kepala Cabang</span>
          </div>
        </div>
        <button type="button" class="kcb-logout-btn" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> <span>Keluar</span>
        </button>
      </div>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="kcb-main">
      <!-- TOPBAR -->
      <div class="kcb-topbar">
        <div>
          <div class="kcb-breadcrumb">
            <span class="kcb-breadcrumb-item"><i class="fa-solid fa-chart-line"></i> Eksekutif &amp; Dashboard</span>
            <span class="kcb-breadcrumb-sep">/</span>
            <span class="kcb-breadcrumb-item active">Dashboard Cabang</span>
          </div>
          <h2 id="pageTitle">Dashboard Cabang Kiara Condong</h2>
          <p class="page-sub" id="dashPeriode"><i class="fa-regular fa-calendar-days" style="color:#64748b; margin-right:4px;"></i> Monitoring Kinerja Penjualan 2026 (Jan–Jul) &amp; Operasional Cabang</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Kepala Cabang</span>
            <span class="role" id="kcbRole">Tunas Toyota KC</span>
          </div>
        </div>
      </div>
      <!-- ===== OPERASIONAL, AO REPORT & AI SENTINEL CABANG ===== -->
      <div id="section-ops-dashboard">
        
        <!-- ===== KPI SUMMARY OPERASIONAL ===== -->
        <div class="grid-4" style="margin-bottom:20px;">
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
              <div class="pct-row"><span>Pencapaian cabang</span><span id="kpiSpkPct" class="kpi-pct-badge pct-blue">0%</span></div>
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
              <div class="pct-row"><span id="kpiDoLabel">Evaluasi 4 bulan</span><span id="kpiDoPct" class="kpi-pct-badge pct-red">0%</span></div>
            </div>
          </div>
        </div>

        <!-- ===== KAIZEN EVOLVE 2026 STRATEGIC COCKPIT ===== -->
        <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-left:3.5px solid #eb0a1e; border-radius:14px; padding:22px 24px; margin-bottom:20px; box-shadow:0 1px 3px rgba(15,23,42,0.04); position:relative;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:16px; border-bottom:1px solid #f1f5f9; padding-bottom:16px; margin-bottom:18px;">
            <div style="max-width:700px;">
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span style="background:rgba(235,10,30,0.08); border:1px solid rgba(235,10,30,0.2); color:#eb0a1e; font-size:10px; font-weight:800; padding:2.5px 8px; border-radius:5px; letter-spacing:0.04em; text-transform:uppercase;">
                  <i class="fa-solid fa-bullseye"></i> KAIZEN EVOLVE 2026
                </span>
                <span style="font-size:12px; color:#64748b; font-weight:600;">
                  Program Strategis Cabang Kiaracondong
                </span>
              </div>
              <h2 style="font-size:19px; font-weight:800; margin:0 0 4px 0; color:#0f172a; letter-spacing:-0.01em;">
                Implementasi 4 Pilar Kaizen EVOLVE
              </h2>
              <p style="font-size:12.5px; color:#64748b; margin:0; line-height:1.5;">
                Eksekusi terarah 4 pilar: Penetrasi 8 Kecamatan Low Share, ReDrive Trade-In ke OLXmobbi, Win-Back 719 Unit Servis (CARE-X), dan Funneling Pameran.
              </p>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <button type="button" onclick="location.href='peta_kunjungan.html'" class="kaizen-quick-btn" title="Lihat peta penetrasi 8 kecamatan">
                <i class="fa-solid fa-map-location-dot" style="color:#d97706;"></i> Polreg 8 Kecamatan
              </button>
              <button type="button" onclick="location.href='olx.html'" class="kaizen-quick-btn" title="Buka pipeline trade-in OLX">
                <i class="fa-solid fa-repeat" style="color:#2563eb;"></i> ReDrive Pipeline
              </button>
              <button type="button" onclick="location.href='after_sales.html'" class="kaizen-quick-btn" title="Buka program win-back servis">
                <i class="fa-solid fa-wrench" style="color:#10b981;"></i> Win-Back 719 Unit
              </button>
            </div>
          </div>

          <!-- 4 STRATEGIC SUMMARY CARDS -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:14px;">
            <!-- CARD 1: 8 KECAMATAN -->
            <div class="kaizen-sub-card" onclick="location.href='peta_kunjungan.html'" title="Buka Market Matrix 8 Kecamatan">
              <div class="sub-card-header">
                <span class="sub-card-tag tag-amber"><i class="fa-solid fa-location-crosshairs"></i> 1. PENETRASI WILAYAH</span>
              </div>
              <div class="sub-card-val">8 Kecamatan</div>
              <div class="sub-card-desc">Bojongloa, Antapani, Buahbatu, dll.</div>
              <div class="sub-card-badge badge-amber">
                Fokus: Veloz HEV &bull; Yaris Cross &bull; Rangga
              </div>
            </div>

            <!-- CARD 2: REDRIVE TRADE-IN -->
            <div class="kaizen-sub-card" onclick="location.href='olx.html'" title="Buka ReDrive Trade-In">
              <div class="sub-card-header">
                <span class="sub-card-tag tag-blue"><i class="fa-solid fa-repeat"></i> 2. REDRIVE TRADE-IN</span>
              </div>
              <div class="sub-card-val">5 SPK Deal</div>
              <div class="sub-card-desc">dari 14 Unit Servis &gt;2.5 Thn (35.7%)</div>
              <div class="sub-card-badge badge-blue">
                SA Brand Ambassador &bull; OLX Spot
              </div>
            </div>

            <!-- CARD 3: WIN-BACK 719 -->
            <div class="kaizen-sub-card" onclick="location.href='after_sales.html'" title="Buka Win-Back 719 Unit">
              <div class="sub-card-header">
                <span class="sub-card-tag tag-green"><i class="fa-solid fa-wrench"></i> 3. AFTER SALES WIN-BACK</span>
              </div>
              <div class="sub-card-val">719 Unit</div>
              <div class="sub-card-desc">P1: 110 Unit &bull; P2: 463 Unit</div>
              <div class="sub-card-badge badge-green">
                Voucher THS On-Call &bull; CARE-X
              </div>
            </div>

            <!-- CARD 4: FUNNELING ACCELERATOR -->
            <div class="kaizen-sub-card" onclick="location.href='peta_kunjungan.html'" title="Buka Funneling Target">
              <div class="sub-card-header">
                <span class="sub-card-tag tag-indigo"><i class="fa-solid fa-filter-circle-dollar"></i> 4. FUNNELING TARGET</span>
              </div>
              <div class="sub-card-val">83 DO Final</div>
              <div class="sub-card-desc">456 Prospek &rarr; 275 Hot &rarr; 110 SPK</div>
              <div class="sub-card-badge badge-indigo">
                Target Kontribusi 25% (Now 14%)
              </div>
            </div>
          </div>
        </section>

        <!-- ===== MONITORING AKTIVITAS LAPANGAN & DOKUMENTASI PAMERAN ===== -->
        <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:20px 22px; box-shadow:0 1px 3px rgba(15,23,42,0.04); margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px; margin-bottom:16px; border-bottom:1px solid #f1f5f9; padding-bottom:14px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:10px; background:#fef2f2; border:1px solid #fee2e2; color:#eb0a1e; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0;">
                <i class="fa-solid fa-person-walking-luggage"></i>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">
                    Monitoring Aktivitas Lapangan &amp; Dokumentasi Pameran
                  </h3>
                  <span id="badgeLiveOpsStatus" style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-weight:700; padding:2px 8px; border-radius:6px; font-size:10.5px; display:inline-flex; align-items:center; gap:5px;">
                    <i class="fa-solid fa-circle" style="font-size:6px; color:#10b981;"></i> Pantauan Real-Time
                  </span>
                </div>
                <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">
                  Pantau kepatuhan input aktivitas seluruh wiraniaga hari ini, rekap foto pameran, serta koordinasi SPV.
                </p>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <button type="button" onclick="location.href='aktivitas.html'" class="btn-ops-secondary">
                <i class="fa-solid fa-timeline" style="color:#64748b;"></i> Timeline Aktivitas
              </button>
              <button type="button" onclick="location.href='riwayat_foto_aktivitas.html'" class="btn-ops-primary">
                <i class="fa-solid fa-images"></i> Galeri Foto Pameran
              </button>
            </div>
          </div>

          <!-- MINI STATS CARDS GRID -->
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(210px, 1fr)); gap:12px;">
            <!-- CARD 1: AKTIVITAS HARI INI -->
            <div class="ops-mini-card" onclick="location.href='aktivitas.html'" title="Klik untuk lihat timeline aktivitas">
              <div class="ops-mini-icon icon-blue">
                <i class="fa-solid fa-list-check"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <div class="ops-mini-lbl">Aktivitas Hari Ini</div>
                <div class="ops-mini-val" id="kcbDashActCount">0</div>
                <div class="ops-mini-sub text-blue" id="kcbDashActSub">Memuat aktivitas...</div>
              </div>
            </div>

            <!-- CARD 2: SALES SUDAH LAPOR -->
            <div class="ops-mini-card" onclick="location.href='aktivitas.html'" title="Lihat sales yang aktif melapor">
              <div class="ops-mini-icon icon-green">
                <i class="fa-solid fa-user-check"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <div class="ops-mini-lbl">Sales Aktif Lapor</div>
                <div class="ops-mini-val text-green" id="kcbDashActSalesReported">0 <span style="font-size:13px; color:#64748b; font-weight:600;">Sales</span></div>
                <div class="ops-mini-sub text-green" id="kcbDashActSalesPct">0% dari total sales</div>
              </div>
            </div>

            <!-- CARD 3: SALES BELUM LAPOR -->
            <div class="ops-mini-card card-alert" onclick="location.href='aktivitas.html'" title="Klik untuk lihat daftar wiraniaga yang belum melapor">
              <div class="ops-mini-icon icon-red">
                <i class="fa-solid fa-user-xmark"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <div class="ops-mini-lbl text-red-dark">Belum Lapor Hari Ini</div>
                <div class="ops-mini-val text-red" id="kcbDashActSalesUnreported">0 <span style="font-size:13px; color:#be123c; font-weight:600;">Sales</span></div>
                <div class="ops-mini-sub text-red" id="kcbDashActSalesUnreportedSub">Perlu follow-up SPV</div>
              </div>
            </div>

            <!-- CARD 4: REKAP FOTO PAMERAN -->
            <div class="ops-mini-card" onclick="location.href='riwayat_foto_aktivitas.html'" title="Buka Galeri Foto Pameran & Event">
              <div class="ops-mini-icon icon-purple">
                <i class="fa-solid fa-camera-retro"></i>
              </div>
              <div style="flex:1; min-width:0;">
                <div class="ops-mini-lbl">Dokumentasi Pameran</div>
                <div class="ops-mini-val text-purple" id="kcbDashFotoCount">0 <span style="font-size:13px; color:#64748b; font-weight:600;">Foto</span></div>
                <div class="ops-mini-sub text-purple">Tersinkron Otomatis</div>
              </div>
            </div>
          </div>
        </section>

        <!-- ===== AREA OPERATION (AO) REPORT EXECUTIVE COCKPIT ===== -->
        <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:18px 20px; box-shadow:0 1px 3px rgba(15,23,42,0.05); margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="width:38px; height:38px; border-radius:8px; background:rgba(235,10,30,0.08); color:#eb0a1e; display:flex; align-items:center; justify-content:center; font-size:16px;">
                <i class="fa-solid fa-chalkboard-user"></i>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">
                    Papan Area Operation (AO) Report Cabang
                  </h3>
                  <span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; font-weight:700; padding:2px 8px; border-radius:6px; font-size:10.5px;">
                    <i class="fa-solid fa-circle-check"></i> Matching Ratio: 86%
                  </span>
                </div>
                <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">
                  Tunas Toyota Kiara Condong &middot; Sinkronisasi Stock Matching, Ritme SPK 5-Harian, dan Estimasi Closing 104 Unit.
                </p>
              </div>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <button type="button" onclick="openWhatIfSimulatorModal()" style="background:#ffffff; color:#0f172a; border:1px solid #cbd5e1; font-weight:600; font-size:12px; padding:7px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
                <i class="fa-solid fa-sliders" style="color:#d97706;"></i> What-If Simulator Closing
              </button>
              <button type="button" onclick="location.href='ao_report_kacab.html'" style="background:#0f172a; color:#ffffff; border:none; font-weight:600; font-size:12px; padding:7px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
                <i class="fa-solid fa-expand"></i> Papan AO Report
              </button>
            </div>
          </div>

          <div class="kpi-mini-grid">
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 10px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">Full Stock Cabang</div>
              <div style="font-size:20px; font-weight:800; color:#0f172a; margin:3px 0;">124</div>
              <div style="font-size:10.5px; font-weight:600; color:#0284c7;">Free: 82 | Match: 42</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 10px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">OS Order &lt;30d</div>
              <div style="font-size:20px; font-weight:800; color:#2563eb; margin:3px 0;">48</div>
              <div style="font-size:10.5px; font-weight:600; color:#1d4ed8;">Firmed: 18 | Match: 30</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 10px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">SPK Gross Actual</div>
              <div style="font-size:20px; font-weight:800; color:#d97706; margin:3px 0;">54</div>
              <div style="font-size:10.5px; font-weight:600; color:#b45309;">Ritme 1-10: +14 Gap</div>
            </div>
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px 10px;">
              <div style="font-size:11px; font-weight:700; color:#64748b;">DO Target Cabang</div>
              <div style="font-size:20px; font-weight:800; color:#059669; margin:3px 0;">92</div>
              <div style="font-size:10.5px; font-weight:600; color:#047857;">Potensi fr OS: 52 (Gap 40)</div>
            </div>
            <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:10px; padding:12px 10px;">
              <div style="font-size:11px; font-weight:700; color:#92400e;">Est. Closing Bulan</div>
              <div style="font-size:22px; font-weight:800; color:#78350f; margin:2px 0;">104</div>
              <div style="font-size:10.5px; font-weight:700; color:#b45309;">+12 Over Target (113%)</div>
            </div>
          </div>
        </section>

        <!-- ===== MONITORING & EVALUASI TARGET HARIAN KACAB ===== -->
        <section class="kcb-card" id="aiSentinelContainer" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:12px; padding:18px 20px; box-shadow:0 1px 3px rgba(15,23,42,0.05); margin-bottom:20px;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px;">
                <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">
                  <i class="fa-solid fa-chart-line" style="color:#eb0a1e; margin-right:6px;"></i>Monitoring Ritme Target SPK &amp; DO Harian (Otomasi Laporan WA)
                </h3>
                <span id="sentinelStatusBadge" style="background:#fef2f2; color:#dc2626; border:1px solid #fecaca; font-weight:700; padding:2px 8px; border-radius:6px; font-size:10.5px;">
                  <i class="fa-solid fa-spinner fa-spin"></i> Menganalisis Ritme...
                </span>
              </div>
              <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">
                Evaluasi target minimal <strong>SPK</strong> per interval 5 hari &amp; laporan DO harian. Jadwal update WhatsApp: 🌅 <strong id="scheduleTextPagi">07:00 Pagi</strong>, ☀️ <strong id="scheduleTextSiang">12:00 Siang</strong>, 🌆 <strong id="scheduleTextSore">17:00 Sore</strong>.
              </p>
            </div>

            <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
              <div style="display:flex; align-items:center; gap:6px; background:#f8fafc; border:1px solid #e2e8f0; padding:4px 10px; border-radius:8px; font-size:12px;">
                <span style="font-weight:600; color:#475569;"><i class="fa-solid fa-calendar-day" style="color:#64748b;"></i> Periode:</span>
                <select id="selectSimulasiHari" onchange="changeSentinelDay(this.value)" style="border:none; background:transparent; font-weight:700; color:#0f172a; outline:none; cursor:pointer;">
                  <option value="">Memuat tanggal hari ini...</option>
                </select>
              </div>

              <button type="button" onclick="syncGoogleSheetNow()" id="btnSyncGoogleSheet" style="background:#059669; color:white; font-weight:600; font-size:12px; border:none; padding:7px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
                <i class="fa-solid fa-file-excel"></i> Tarik Google Sheet
              </button>

              <button type="button" onclick="toggleSentinelSettings()" style="background:#f1f5f9; color:#0f172a; font-weight:600; font-size:12px; border:1px solid #cbd5e1; padding:7px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
                <i class="fa-solid fa-clock" style="color:#64748b;"></i> Atur Jadwal
              </button>

              <button type="button" onclick="sendKacabAiReportWA()" style="background:#16a34a; color:white; font-weight:600; font-size:12px; border:none; padding:7px 12px; border-radius:8px; display:inline-flex; align-items:center; gap:6px; cursor:pointer;">
                <i class="fa-brands fa-whatsapp" style="font-size:14px;"></i> Kirim WA Manual
              </button>
            </div>
          </div>

          <!-- Google Sheet Sync Bar -->
          <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:10px 14px; margin-bottom:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="font-size:12px; color:#166534; font-weight:700; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-cloud-arrow-down" style="color:#0f9d58;"></i>
              <span>Google Sheet Sinkronisasi:</span>
              <span id="googleSheetSyncStatus" style="font-weight:800; color:#14532d;">Memuat status sinkronisasi...</span>
            </div>
            <a href="https://docs.google.com/spreadsheets/d/1rAht0x-DgMRIM379r2qwoWjhfVAq6xIm846ZwvHujQs/edit?usp=sharing" target="_blank" style="font-size:11.5px; color:#0f9d58; text-decoration:none; font-weight:800; display:inline-flex; align-items:center; gap:4px;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Buka Google Spreadsheet
            </a>
          </div>

          <!-- SESSION TAB FILTER: PAGI, SIANG, SORE -->
          <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; background:#f8fafc; padding:6px; border-radius:12px; border:1px solid #e2e8f0; width:fit-content;">
            <span style="font-size:11.5px; font-weight:800; color:#475569; padding:0 8px;"><i class="fa-solid fa-business-time" style="color:#6366f1;"></i> Sesi Laporan:</span>
            <button type="button" class="sentinel-session-tab active" id="tabSessPagi" onclick="switchSentinelSessionTab('pagi')" style="padding:6px 14px; border-radius:8px; border:none; font-size:12px; font-weight:800; cursor:pointer; background:#6366f1; color:white; display:flex; align-items:center; gap:6px;">
              <span id="tabLabelPagi">🌅 Pagi (Briefing 07:00)</span>
            </button>
            <button type="button" class="sentinel-session-tab" id="tabSessSiang" onclick="switchSentinelSessionTab('siang')" style="padding:6px 14px; border-radius:8px; border:none; font-size:12px; font-weight:800; cursor:pointer; background:#e2e8f0; color:#475569; display:flex; align-items:center; gap:6px;">
              <span id="tabLabelSiang">☀️ Siang (Update 12:00)</span>
            </button>
            <button type="button" class="sentinel-session-tab" id="tabSessSore" onclick="switchSentinelSessionTab('sore')" style="padding:6px 14px; border-radius:8px; border:none; font-size:12px; font-weight:800; cursor:pointer; background:#e2e8f0; color:#475569; display:flex; align-items:center; gap:6px;">
              <span id="tabLabelSore">🌆 Sore (Closing 17:00)</span>
            </button>
          </div>

          <!-- Panel Pengaturan Otomasi Jadwal Jam Kirim (Collapsible) -->
          <div id="sentinelSettingsPanel" style="display:none; background:#f8fafc; border:1.5px solid #cbd5e1; border-radius:12px; padding:16px; margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
              <div style="font-size:13px; font-weight:800; color:#1e293b;">
                <i class="fa-solid fa-clock-rotate-left" style="color:#4f46e5;"></i> Pengaturan 3 Jadwal Jam Pengiriman Otomatis ke WhatsApp Kacab
              </div>
              <span id="schedulerActiveBadge" style="font-size:11px; background:#dcfce7; color:#166534; font-weight:800; padding:3px 8px; border-radius:6px; border:1px solid #bbf7d0;">
                <i class="fa-solid fa-circle-check"></i> Scheduler 3 Sesi Aktif (07:00 | 12:00 | 17:00)
              </span>
            </div>

            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:12px;">
              <div>
                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nomor WhatsApp Kacab:</label>
                <input type="text" id="kacabWaNumberInput" placeholder="081234567890" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px; font-weight:700; color:#0f172a; box-sizing:border-box;">
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">🌅 Jam Pagi (Briefing Sales):</label>
                <input type="time" id="kacabSchedulePagiInput" value="07:00" style="width:100%; padding:7px 10px; border-radius:8px; border:1.5px solid #6366f1; font-size:13px; font-weight:800; color:#1e1b4b; background:#eef2ff; box-sizing:border-box; cursor:pointer;">
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">☀️ Jam Siang (Update SPK/DO):</label>
                <input type="time" id="kacabScheduleSiangInput" value="12:00" style="width:100%; padding:7px 10px; border-radius:8px; border:1.5px solid #0284c7; font-size:13px; font-weight:800; color:#0c4a6e; background:#f0f9ff; box-sizing:border-box; cursor:pointer;">
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">🌆 Jam Sore (Closing Harian):</label>
                <input type="time" id="kacabScheduleSoreInput" value="17:00" style="width:100%; padding:7px 10px; border-radius:8px; border:1.5px solid #d97706; font-size:13px; font-weight:800; color:#78350f; background:#fffbeb; box-sizing:border-box; cursor:pointer;">
              </div>
              <div>
                <label style="font-size:11px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Token Gateway (Opsional Fonnte):</label>
                <input type="password" id="kacabGatewayTokenInput" placeholder="Masukkan token Fonnte API" style="width:100%; padding:8px 10px; border-radius:8px; border:1px solid #cbd5e1; font-size:12px; box-sizing:border-box;">
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
              <p style="font-size:11.5px; color:#64748b; margin:0;">
                <i class="fa-solid fa-circle-info"></i> Laporan otomatis dikirim 3x sehari ke WhatsApp Kacab sesuai jadwal waktu di atas.
              </p>
              <div style="display:flex; gap:8px;">
                <button class="btn btn-sm" onclick="saveSentinelSettings()" style="background:#4f46e5; color:white; font-weight:700; font-size:11.5px; border:none; padding:7px 14px; border-radius:8px; cursor:pointer;">
                  <i class="fa-solid fa-floppy-disk"></i> Simpan 3 Jadwal & No. WA
                </button>
                <button class="btn btn-sm" onclick="testCronExecutionNow()" style="background:#0284c7; color:white; font-weight:700; font-size:11.5px; border:none; padding:7px 14px; border-radius:8px; cursor:pointer;">
                  <i class="fa-solid fa-bolt"></i> Test Kirim Sesi Ini
                </button>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span style="font-size:12px; font-weight:800; color:#334155; text-transform:uppercase; letter-spacing:0.5px;">
              <i class="fa-solid fa-list-check" style="color:#6366f1; margin-right:4px;"></i> Status Ritme: <span id="sentinelPeriodLabel" style="color:#0f172a;"><i class="fa-solid fa-spinner fa-spin"></i> Menyesuaikan tanggal real-time...</span>
            </span>
            <span style="font-size:11px; color:#94a3b8;"><i class="fa-solid fa-bolt"></i> Evaluasi otomatis real-time</span>
          </div>

          <div id="sentinelListContainer">
            <p class="loading-state" style="padding:15px;"><i class="fa-solid fa-spinner fa-spin"></i> AI sedang menganalisis seluruh data wiraniaga cabang...</p>
          </div>
        </section>

        <!-- ===== EXECUTIVE REVENUE & STOCK AGING SECTION ===== -->
        <div class="grid-2" style="margin-bottom:18px;">
          <!-- Card 1: Estimasi Revenue & Insentif Cabang -->
          <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-chart-line" style="color:#059669; margin-right:8px;"></i>Estimasi Omset &amp; Revenue Cabang</h3>
              <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:12px;">Live Executive Metric</span>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
                <div style="font-size:11px; font-weight:700; color:#64748b;">ESTIMASI OMSET SPK</div>
                <div style="font-size:18px; font-weight:900; color:#0f172a; margin-top:4px;" id="kcbEstimasiOmset">Rp 7.000.000.000</div>
                <div style="font-size:11px; color:#059669; font-weight:600; margin-top:2px;"><i class="fa-solid fa-square-poll-vertical"></i> Projected Revenue</div>
              </div>
              <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
                <div style="font-size:11px; font-weight:700; color:#64748b;">INSENTIF FINANSIAL &amp; TCO</div>
                <div style="font-size:18px; font-weight:900; color:#2563eb; margin-top:4px;" id="kcbInsentifFinansial">Rp 140.000.000</div>
                <div style="font-size:11px; color:#2563eb; font-weight:600; margin-top:2px;"><i class="fa-solid fa-hand-holding-dollar"></i> Leasing &amp; Accessories Margin</div>
              </div>
            </div>
          </section>

          <!-- Card 2: Stock Aging & Inventory Health Alert -->
          <section class="kcb-card" style="background:#ffffff; border:1px solid #e2e8f0; border-radius:14px; padding:18px; box-shadow:0 4px 12px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-warehouse" style="color:#d97706; margin-right:8px;"></i>Stock Aging &amp; Slow Moving Alert</h3>
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
            <h3 class="card-label"><i class="fa-solid fa-bolt"></i> Aktivitas Terbaru &amp; Pameran
              <span class="spacer"></span>
              <a href="riwayat_foto_aktivitas.html" class="btn btn-ghost btn-sm" style="color:#2563eb; font-weight:700;"><i class="fa-solid fa-images"></i> Galeri Foto</a>
              <a href="aktivitas.html" class="btn btn-ghost btn-sm">Timeline <i class="fa-solid fa-arrow-right"></i></a>
            </h3>
            <div class="feed-list" id="feedList">
              <p class="loading-state"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>
            </div>
          </section>
        </div>

      </div>

      <!-- ====================================================================
           MODAL: UPLOAD EXCEL BARU (DYNAMIC DATA SYNC)
           ==================================================================== -->
      <div class="modal-backdrop" id="modal-upload-excel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="modal-content">
          <div class="modal-header">
            <h3 id="modal-title"><i data-lucide="upload-cloud"></i> Perbarui Data Penjualan (Excel)</h3>
            <button type="button" class="modal-close-btn" id="btn-close-upload-modal" aria-label="Tutup Modal">
              <i data-lucide="x"></i>
            </button>
          </div>

          <div class="upload-dropzone" id="upload-dropzone">
            <i data-lucide="file-spreadsheet"></i>
            <h4>Tarik &amp; Lepaskan File Excel ke Sini</h4>
            <p>Atau klik untuk memilih file dari komputer (.xlsx, .xls)</p>
            <input type="file" id="input-file-excel" accept=".xlsx, .xls" style="display: none;">
          </div>

          <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem;">
            <strong>Catatan:</strong> Format yang didukung adalah file Excel dengan lembar <code>SOURCE DATA</code>. Seluruh visualisasi akan otomatis diperbarui seketika.
          </p>

          <div class="modal-footer">
            <button type="button" class="btn btn-outline" id="btn-reset-default-data">Kembalikan Data Bawaan 2026</button>
            <button type="button" class="btn btn-primary" id="btn-cancel-upload">Tutup</button>
          </div>
        </div>
      </div>

      <!-- ====================================================================
           MODAL: WHAT-IF MONTH-END CLOSING SIMULATOR (KEPALA CABANG)
           ==================================================================== -->
      <div class="modal-backdrop" id="modal-whatif-simulator" role="dialog" aria-modal="true" style="display:none; position:fixed; inset:0; background:rgba(15,23,42,0.7); z-index:99999; align-items:center; justify-content:center; backdrop-filter:blur(4px);">
        <div style="background:white; border-radius:22px; max-width:820px; width:94%; padding:26px; box-shadow:0 25px 60px rgba(0,0,0,0.3); max-height:92vh; overflow-y:auto; border:1px solid #cbd5e1;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; border-bottom:1.5px solid #f1f5f9; padding-bottom:14px;">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:40px; height:40px; border-radius:8px; background:rgba(217,119,6,0.1); color:#d97706; display:flex; align-items:center; justify-content:center; font-size:18px;">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <div>
                <h3 style="font-size:17px; font-weight:800; color:#0f172a; margin:0;">
                  What-If Simulator: Skenario Closing Akhir Bulan
                </h3>
                <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;">
                  Eksplorasi dampak kebijakan subsidi diskon, percepatan leasing F&amp;I, dan trade-in terhadap target cabang (104 Unit).
                </p>
              </div>
            </div>
            <button onclick="closeWhatIfSimulatorModal()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#94a3b8;">&times;</button>
          </div>

          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap:22px;">
            <!-- Left: Simulation Controls -->
            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:18px;">
              <h4 style="font-size:13px; font-weight:800; color:#1e293b; margin:0 0 14px 0; text-transform:uppercase; letter-spacing:0.5px;">
                <i class="fa-solid fa-gears" style="color:#d97706; margin-right:6px;"></i> Variabel Kebijakan Cabang
              </h4>

              <!-- Variable 1: Extra Discount Subsidy -->
              <div style="margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <label style="font-size:12px; font-weight:700; color:#334155;">Subsidi Diskon Ekstra Unit Tertahan:</label>
                  <span id="labelSimDiscount" style="font-size:12px; font-weight:800; color:#b45309;">Rp 5.000.000 / Unit</span>
                </div>
                <input type="range" id="simDiscountRange" min="0" max="15000000" step="1000000" value="5000000" oninput="runWhatIfClosingCalc()" style="width:100%; accent-color:#d97706; cursor:pointer;">
                <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:2px;">
                  <span>Rp 0</span>
                  <span>Rp 7.5 Juta</span>
                  <span>Rp 15 Juta</span>
                </div>
              </div>

              <!-- Variable 2: Leasing Acceleration -->
              <div style="margin-bottom:16px; background:white; border:1px solid #e2e8f0; border-radius:8px; padding:10px 12px; display:flex; align-items:center; justify-content:space-between;">
                <div>
                  <div style="font-size:12px; font-weight:700; color:#0f172a;">Akselerasi Approval F&amp;I Leasing</div>
                  <div style="font-size:10.5px; color:#64748b;">Eskalasi prioritas SPK tertahan &gt; 5 hari ke AO Leasing</div>
                </div>
                <input type="checkbox" id="simLeasingBoost" checked onchange="runWhatIfClosingCalc()" style="width:18px; height:18px; accent-color:#d97706; cursor:pointer;">
              </div>

              <!-- Variable 3: Trade-in Push -->
              <div style="margin-bottom:16px;">
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <label style="font-size:12px; font-weight:700; color:#334155;">Subsidi Trade-In OLX Autos:</label>
                  <span id="labelSimTradein" style="font-size:12px; font-weight:800; color:#0369a1;">Rp 2.000.000 / Unit</span>
                </div>
                <input type="range" id="simTradeinRange" min="0" max="5000000" step="500000" value="2000000" oninput="runWhatIfClosingCalc()" style="width:100%; accent-color:#0284c7; cursor:pointer;">
                <div style="display:flex; justify-content:space-between; font-size:10px; color:#94a3b8; margin-top:2px;">
                  <span>Rp 0</span>
                  <span>Rp 2.5 Juta</span>
                  <span>Rp 5 Juta</span>
                </div>
              </div>

              <!-- Variable 4: Sales Fast Closer Incentive -->
              <div>
                <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
                  <label style="font-size:12px; font-weight:700; color:#334155;">Insentif Cash Closer Sales:</label>
                  <span id="labelSimCloserBonus" style="font-size:12px; font-weight:800; color:#15803d;">Rp 500.000 / SPK</span>
                </div>
                <input type="range" id="simCloserRange" min="0" max="1000000" step="100000" value="500000" oninput="runWhatIfClosingCalc()" style="width:100%; accent-color:#16a34a; cursor:pointer;">
              </div>
            </div>

            <!-- Right: Projected Result Outputs -->
            <div style="display:flex; flex-direction:column; justify-content:space-between;">
              <div style="display:flex; flex-direction:column; gap:12px;">
                <!-- Main KPI Card -->
                <div style="background:#fffbeb; border:1px solid #fde68a; border-radius:12px; padding:16px;">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                    <div>
                      <span style="font-size:11px; font-weight:700; color:#92400e; text-transform:uppercase; letter-spacing:0.5px;">Proyeksi Total Closing Bulan Ini</span>
                      <h3 style="font-size:30px; font-weight:900; color:#78350f; margin:4px 0;" id="simResultTotalUnits">118 <small style="font-size:15px; font-weight:700;">Unit</small></h3>
                    </div>
                    <span id="simAchievementPct" style="font-size:12px; font-weight:700; background:#d97706; color:white; padding:3px 9px; border-radius:6px;">
                      113.4% Target
                    </span>
                  </div>
                  <p style="font-size:11.5px; color:#92400e; margin:6px 0 0 0; font-weight:600;" id="simResultUnitsSub">
                    Target Cabang: 104 Unit &middot; Surplus +14 Unit dari baseline.
                  </p>
                </div>

                <!-- Secondary Metric Grid -->
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
                    <div style="font-size:11px; font-weight:700; color:#64748b;">Est. Tambahan Omset</div>
                    <div style="font-size:18px; font-weight:800; color:#0284c7; margin-top:2px;" id="simResultRevenueDelta">+Rp 4.90 M</div>
                    <div style="font-size:10px; color:#0369a1; margin-top:2px;">Gross Sales Inflow</div>
                  </div>

                  <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:12px;">
                    <div style="font-size:11px; font-weight:700; color:#64748b;">Margin Retention</div>
                    <div style="font-size:18px; font-weight:800; color:#15803d; margin-top:2px;" id="simResultMarginRetention">93.8%</div>
                    <div style="font-size:10px; color:#166534; margin-top:2px;">Status: Sangat Sehat</div>
                  </div>
                </div>

                <!-- Strategic Summary Box -->
                <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:12px 14px;">
                  <div style="font-size:12px; font-weight:700; color:#166534; margin-bottom:4px;">
                    <i class="fa-solid fa-lightbulb" style="color:#16a34a;"></i> Kesimpulan Analisis Strategis Cabang:
                  </div>
                  <p style="font-size:11.5px; color:#14532d; margin:0; line-height:1.4;" id="simStrategyRecommendation">
                    Dengan alokasi subsidi diskon terkontrol dan akselerasi F&amp;I leasing, cabang diproyeksikan mengamankan closing hingga 118 Unit, melampaui target 104 unit dengan margin cabang tetap aman.
                  </p>
                </div>
              </div>

              <!-- Bottom Actions -->
              <div style="display:flex; gap:10px; margin-top:16px; justify-content:flex-end;">
                <button type="button" class="btn" style="background:#f1f5f9; color:#475569; font-weight:600; border:1px solid #cbd5e1; padding:8px 14px; border-radius:8px; cursor:pointer;" onclick="closeWhatIfSimulatorModal()">Tutup</button>
                <button type="button" class="btn" style="background:#16a34a; color:white; font-weight:600; border:none; padding:8px 14px; border-radius:8px; cursor:pointer; display:inline-flex; align-items:center; gap:6px;" onclick="broadcastWhatIfStrategyToSPV()">
                  <i class="fa-brands fa-whatsapp"></i> Broadcast Arahan ke SPV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Toast Notification Placeholder -->
      <div id="toast-container" class="toast-container"></div>
    </main>
  </div>

  <!-- Kacab Scripts -->
  <script src="/custom_alert.js"></script>
  <script src="/js/kacab_global.js?v={{ time() }}"></script>
  <script src="/js/kacab_index.js?v={{ time() }}"></script>
  <script src="/js/pwa-app.js?v={{ time() }}"></script>
</body>

</html>
