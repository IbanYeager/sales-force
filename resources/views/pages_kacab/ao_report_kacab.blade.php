<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Area Operation (AO) Report</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260915_layout_perfect">
  <link rel="stylesheet" href="/css/ao_report.css?v=20260914_ao_v30">
  <link rel="stylesheet" href="../css/ao_report.css?v=20260914_ao_v30">

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
        <a href="quotation.html" id="navSph"><i class="fa-solid fa-file-invoice-dollar"></i>Studio SPH &amp; Quotation <span class="sidebar-notif-badge" style="background:#d8a437; color:#1e1014; display:inline-block; margin-left:auto; font-size:9px; padding:1px 5px; border-radius:4px; font-weight:800;">A4 PDF</span></a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up (CRM)</a>
        <a href="ao_report_kacab.html" id="navAO" class="active"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="monitoring_spv.html" id="navMonitoring"><i class="fa-solid fa-sitemap"></i>Monitoring Tim SPV</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Data 50 Wiraniaga</a>
        <a href="approval_kacab.html" id="navApproval"><i class="fa-solid fa-clipboard-check"></i>Otorisasi & Approval</a>
        <a href="target_kacab.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target & Produktivitas</a>
        <a href="laporan_kacab.html" id="navLaporan"><i class="fa-solid fa-chart-pie"></i>Laporan Eksekutif</a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas & Riwayat Sales</a>
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

    <!-- MAIN -->
    <main class="kcb-main">
      <div class="kcb-topbar">
        <div>
          <h2 id="pageTitle">Papan AO Report (Area Operation)</h2>
          <p class="page-sub" id="dashPeriode">Pusat Kendali Operasional Cabang, Matching Stok &amp; Proyeksi Closing Bulanan</p>
        </div>
        <div class="kcb-user">
          <div class="avatar-status">
            <img id="kcbAvatar" src="https://ui-avatars.com/api/?name=KC&background=1e1014&color=d8a437&bold=true" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="kcbNama">Kepala Cabang</span>
            <span class="role" id="kcbRole">Tunas Toyota Kiara Condong</span>
          </div>
        </div>
      </div>

      <!-- Main Interactive Whiteboard Container -->
      <!-- Main Interactive Whiteboard Container (Replika Papan Tulis Kantor) -->
      <div class="ao-board-container" id="aoBoardMainContainer">
        
        <!-- Top Whiteboard Header & Toolbar -->
        <div class="ao-board-top-strip">
            <div class="ao-board-main-title-box">
                <h1 class="ao-title-main">OPERATION REPORT</h1>
                <div class="ao-board-date-hand" id="aoReportDate">31 Agustus 2026</div>
            </div>

            <div class="ao-board-logo-area">
                <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" 
                     alt="Tunas Toyota" 
                     style="height:26px; max-width:180px; object-fit:contain;" 
                     onerror="this.style.display='none'; document.getElementById('txtLogoKacab').style.display='inline-flex';" />
                <div class="ao-brand-badge-text" id="txtLogoKacab" style="display:none;">
                    tunas <span class="toyota">TOYOTA</span> KIARACONDONG
                </div>
            </div>

            <!-- Quick Navigation Jump Bar -->
            <div class="ao-nav-jump-bar">
                <button class="ao-jump-pill active" onclick="aoScrollToSection('aoSec1')"><span class="marker-circle-mini">2</span> Stock Matching</button>
                <button class="ao-jump-pill" onclick="aoScrollToSection('aoSec2')"><span class="marker-circle-mini">10</span> SPK Plan</button>
                <button class="ao-jump-pill" onclick="aoScrollToSection('aoSec3')">MDP &amp; FFS</button>
                <button class="ao-jump-pill" onclick="aoScrollToSection('aoSec4')"><span class="marker-circle-mini">1</span> Closing &amp; Gap</button>
                <button class="ao-jump-pill" onclick="aoScrollToSection('aoSec5')">Supply &amp; FTS</button>
            </div>

            <div class="ao-actions-toolbar">
                <button class="btn-ao btn-ao-nav" onclick="aoScrollHorizontal(-350)" title="Geser ke Kiri"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="btn-ao btn-ao-nav" onclick="aoScrollHorizontal(350)" title="Geser ke Kanan"><i class="fa-solid fa-chevron-right"></i></button>
                <button class="btn-ao btn-ao-projector" id="btnAoProjector" title="Mode Layar Penuh untuk Proyektor TV Rapat">
                    <i class="fa-solid fa-expand"></i> Mode Proyektor TV
                </button>
                <button class="btn-ao btn-ao-wa" id="btnAoSendWA" title="Bagikan Laporan AO ke Manajemen / SPV via WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> Share WA
                </button>
                <button class="btn-ao btn-ao-export" id="btnAoExportCSV" title="Unduh Data Format Excel / CSV">
                    <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> Ekspor
                </button>
                <button class="btn-ao btn-ao-import" onclick="openAoImportModal()" title="Impor File Excel Update AO Report (.xlsx)">
                    <i class="fa-solid fa-file-arrow-up" style="color:#2563eb;"></i> Impor Excel AO
                </button>
            </div>
        </div>

        <!-- Horizontal Panoramic Whiteboard Track -->
        <div class="ao-whiteboard-horizontal-track" id="aoWhiteboardTrack">

            <!-- PANEL 1: SECTION 1: Stock Matching with OS (②) -->
            <div class="ao-panel-card ao-panel-stock" id="aoSec1">
                <div class="ao-section-heading">
                    <span>Stock Matching with OS <span class="marker-circle">2</span></span>
                </div>
                <div class="ao-stock-flow-layout">
                    <!-- Column 1: Full Stock -->
                    <div class="ao-pillar-col">
                        <div class="ao-pillar-head-val" id="wbFullStockTotal">46</div>
                        <div class="ao-pillar-stack-body">
                            <div class="ao-block-free">
                                <span class="label">Free for sales</span>
                                <span class="val" id="wbFullStockFree">30</span>
                            </div>
                            <div class="ao-block-match">
                                <span class="label">match</span>
                                <span class="val" id="wbFullStockMatch">16</span>
                            </div>
                        </div>
                        <div class="ao-pillar-footer-title">Full Stock</div>
                    </div>

                    <!-- Column 2: Invoiceable Stock -->
                    <div class="ao-pillar-col">
                        <div class="ao-pillar-head-val" id="wbInvStockTotal">46</div>
                        <div class="ao-pillar-stack-body">
                            <div class="ao-block-free">
                                <span class="label">Free for sales</span>
                                <span class="val" id="wbInvStockFree">30</span>
                            </div>
                            <div class="ao-block-match">
                                <span class="label">match</span>
                                <span class="val" id="wbInvStockMatch">16</span>
                            </div>
                        </div>
                        <div class="ao-pillar-footer-title">Invoiceable Stk</div>
                    </div>

                    <!-- Column 3: OS Order -->
                    <div class="ao-pillar-col">
                        <div class="ao-pillar-head-val" id="wbOsOrderTotal">29</div>
                        <div class="ao-os-stack-body">
                            <div class="ao-os-layer layer-gt60">
                                <span>&gt;60 days</span>
                                <span>match 0</span>
                            </div>
                            <div class="ao-os-layer layer-3060">
                                <span>4 (30-60d)</span>
                                <span>match 2</span>
                            </div>
                            <div class="ao-os-layer layer-gt60" style="font-size:7.5px;">
                                <span>&gt;60 days</span>
                                <span>firmed &amp; match 0</span>
                            </div>
                            <div class="ao-os-layer layer-3060" style="font-size:7.5px;">
                                <span>30-60 days</span>
                                <span>firmed &amp; match 0</span>
                            </div>
                            <div class="ao-os-layer layer-lt30-green">
                                <div>firmed OS &lt;30 days</div>
                                <div style="display:flex; justify-content:space-between; width:100%; font-size:11px; font-weight:900;">
                                    <span>25</span>
                                    <span>6 firmed</span>
                                </div>
                            </div>
                            <div class="ao-os-layer layer-lt30-yellow">
                                <span style="font-size:12px; font-weight:900;">19</span>
                                <span style="font-size:8px;">(PL + CPI)</span>
                            </div>
                        </div>
                        <div class="ao-pillar-footer-title">OS Order</div>
                    </div>

                    <!-- Column 4: Stock Matching -->
                    <div class="ao-pillar-col">
                        <div class="ao-pillar-head-val" style="font-size:10px; padding:5px 0;">Stock Match</div>
                        <div class="ao-sm-stack-body">
                            <div class="ao-sm-top-row">
                                <div class="ao-sm-top-cell">2 <span style="font-size:7px; display:block;">unfirmed &gt;30d</span></div>
                                <div class="ao-sm-top-cell">2 <span style="font-size:7px; display:block;">unfirmed &lt;30d</span></div>
                            </div>
                            <div class="ao-sm-unmatch-box">
                                <div style="font-weight:900; font-size:9px; margin-bottom:2px;"><span id="wbSmUnmatchTotal">10</span> unmatch</div>
                                <div class="ao-sm-subrow"><span>1</span><span>firmed &gt;30d</span></div>
                                <div class="ao-sm-subrow"><span>5</span><span>firmed &lt;30d</span></div>
                                <div class="ao-sm-subrow"><span>4</span><span>unfirmed &lt;30d</span></div>
                                <div class="ao-sm-subrow"><span>0</span><span>unfirmed &gt;30d</span></div>
                            </div>
                            <div class="ao-sm-match-box">
                                <div style="font-weight:900; font-size:9px; margin-bottom:2px;"><span id="wbSmMatchTotal">16</span> match</div>
                                <div class="ao-sm-subrow"><span>1</span><span>firmed &gt;30d</span></div>
                                <div class="ao-sm-subrow"><span style="font-size:11px; font-weight:900;">15</span><span>(PL + CPI)</span></div>
                            </div>
                        </div>
                        <div class="ao-pillar-footer-title">Matching</div>
                    </div>

                    <!-- Right of Section 1: KPI & 6-step staircase -->
                    <div class="ao-stock-kpi-ladder-col">
                        <div>
                            <div class="ao-kpi-ratio-row">
                                <span>MATCHING RATIO <strong style="font-size:16px;" id="wbMatchingRatioVal">34</strong> %</span>
                                <span class="marker-circle">3</span>
                            </div>
                            <div class="ao-kpi-potential-row">
                                <span>Total potential DO: <strong id="wbPotentialDoVal">16</strong></span>
                                <span class="marker-circle">5</span>
                            </div>
                        </div>

                        <div class="ao-staircase-chart-row">
                            <div class="ao-pillar-sub-od">
                                <div class="ao-sub-od-top">0 MDP</div>
                                <div class="ao-sub-od-bot">16<br><span style="font-size:7.5px;">on hand</span></div>
                            </div>

                            <div class="ao-stairs-wrap">
                                <div class="ao-stair-step step-1" title="1-5: 2"></div>
                                <div class="ao-stair-step step-2" title="6-10: 3"></div>
                                <div class="ao-stair-step step-3" title="11-15: 3"></div>
                                <div class="ao-stair-step step-4" title="16-20: 3"></div>
                                <div class="ao-stair-step step-5" title="21-25: 3"></div>
                                <div class="ao-stair-step step-6" title="26-31: 2">16</div>
                            </div>

                            <div class="ao-pillar-gap-target">
                                <div class="gap-top">
                                    <span style="font-size:8px; display:block;">92 Tgt</span>
                                    <span>GAP</span>
                                    <div style="font-size:14px; font-weight:900;" id="wbGapTargetVal">76</div>
                                    <span class="marker-circle" style="width:18px; height:18px; font-size:10px;">6</span>
                                </div>
                                <div class="mtd-bot">
                                    <div style="font-size:14px; font-weight:900;" id="wbMtdActualVal">16</div>
                                    <span style="font-size:8px;">MTD</span>
                                    <span class="marker-circle" style="width:18px; height:18px; font-size:10px;">4</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PANEL 2: SECTION 2: Matching Stock from Order / SPK Plan (⑩) -->
            <div class="ao-panel-card ao-panel-spk" id="aoSec2">
                <div class="ao-section-heading">
                    <div>
                        <span>Matching Stock from Order &mdash; SPK plan</span>
                        <span class="marker-circle">10</span>
                    </div>
                </div>
                <div class="ao-spk-section-grid">
                    <div>
                        <table class="ao-table-wb">
                            <thead>
                                <tr>
                                    <th rowspan="2" style="text-align:left;">Metrik SPK</th>
                                    <th rowspan="2">TTL</th>
                                    <th colspan="5" style="background:#e0f2fe; color:#0369a1;">Effective to N RS: 76</th>
                                    <th colspan="1" style="background:#fef08a; color:#854d0e;">N+1: 42</th>
                                </tr>
                                <tr>
                                    <th>1-5</th>
                                    <th>6-10</th>
                                    <th>11-15</th>
                                    <th>16-20</th>
                                    <th>21-25</th>
                                    <th>26-31</th>
                                </tr>
                            </thead>
                            <tbody id="wbSpkTableBody">
                                <!-- Injected by js -->
                            </tbody>
                        </table>
                    </div>

                    <div class="ao-spk-right-pane">
                        <div class="ao-cancel-ratio-box">
                            <span style="font-weight:900;">Cancel ratio:</span>
                            <div style="display:flex; gap:8px; margin-top:2px;">
                                <span>3m: <strong id="wbCancel3mAvg">4%</strong></span>
                                <span>Loan rej: <strong id="wbLoanRej">2%</strong></span>
                            </div>
                        </div>

                        <div class="ao-nett-visual-row">
                            <div style="flex:1;">
                                <div style="font-size:9.5px; font-weight:900; color:#2563eb; margin-bottom:2px;">
                                    <i class="fa-solid fa-arrow-right"></i> Nett SPK Visualize
                                </div>
                                <div class="ao-stairs-wrap" style="height:75px;">
                                    <div class="ao-stair-step step-1">19</div>
                                    <div class="ao-stair-step step-2">19</div>
                                    <div class="ao-stair-step step-3">19</div>
                                    <div class="ao-stair-step step-4">19</div>
                                    <div class="ao-stair-step step-5">19</div>
                                    <div class="ao-stair-step step-6">19</div>
                                </div>
                                <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:800; color:#64748b; margin-top:2px;">
                                    <span>1-5</span><span>6-10</span><span>11-15</span><span>16-20</span><span>21-25</span><span>26-31</span>
                                </div>
                                <div style="font-size:9px; font-weight:900; text-align:center; margin-top:1px;">RS plan</div>
                            </div>

                            <div style="display:flex; flex-direction:column; align-items:center;">
                                <div class="ao-arrow-avg-days">
                                    <i class="fa-solid fa-arrows-left-right"></i> Avg 8d<br>SPK-AFI
                                </div>

                                <div class="ao-pillar-become-os">
                                    <div class="top-os">
                                        <div style="font-size:8px;">114</div>
                                        <div>19</div>
                                        <div style="font-size:12px; font-weight:900;" id="wbPillarBecomeOs">38</div>
                                        <span style="font-size:7.5px;">Become OS</span>
                                    </div>
                                    <div class="bot-rs">
                                        <div style="font-size:14px; font-weight:900;" id="wbPillarEffMonthRS">76</div>
                                        <span style="font-size:7.5px;">Effective RS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- PANEL 3: SECTION 3: MDP Plan & FFS Selling Plan -->
            <div class="ao-panel-card ao-panel-mdp" id="aoSec3">
                <div class="ao-section-heading">
                    <span>MDP &amp; FFS selling plan</span>
                </div>
                <div class="ao-mdp-section-grid">
                    <div class="ao-pillar-mdp-split">
                        <div style="padding:2px; font-size:11px; font-weight:900;" id="wbMdpPillarTotal">32</div>
                        <div class="ao-mdp-top-slice" id="wbMdpSliceGreen">2</div>
                        <div class="ao-mdp-bot-slice" id="wbMdpSliceBlue">30</div>
                    </div>

                    <div class="ao-pillar-ffs-oh">
                        <div style="font-size:13px; font-weight:900;" id="wbFfsPillarVal">46</div>
                        <span style="font-size:8.5px;">FFS</span>
                    </div>

                    <div class="ao-ffs-truck-ladder-wrap">
                        <div style="font-size:9.5px; font-weight:900; color:#2563eb; margin-bottom:2px;">
                            <i class="fa-solid fa-arrow-right"></i> FFS selling plan
                        </div>
                        <div class="ao-truck-stairs">
                            <div class="ao-truck-step" style="height:25%;"><i class="fa-solid fa-truck"></i></div>
                            <div class="ao-truck-step" style="height:40%;"><i class="fa-solid fa-truck"></i></div>
                            <div class="ao-truck-step" style="height:55%;"><i class="fa-solid fa-truck"></i></div>
                            <div class="ao-truck-step" style="height:70%;"><i class="fa-solid fa-truck"></i></div>
                            <div class="ao-truck-step" style="height:85%;"><i class="fa-solid fa-truck"></i></div>
                            <div class="ao-truck-step" style="height:100%;"><i class="fa-solid fa-truck"></i></div>
                        </div>
                        <div class="ao-truck-accum-boxes">
                            <div class="ao-truck-accum-box">46</div>
                            <div class="ao-truck-accum-box">52</div>
                            <div class="ao-truck-accum-box">72</div>
                            <div class="ao-truck-accum-box">95</div>
                            <div class="ao-truck-accum-box">117</div>
                            <div class="ao-truck-accum-box">125</div>
                        </div>

                        <div class="ao-rs-steps-under">
                            <div class="ao-rs-step-bar">19</div>
                            <div class="ao-rs-step-bar">19</div>
                            <div class="ao-rs-step-bar">19</div>
                            <div class="ao-rs-step-bar">19</div>
                            <div class="ao-rs-step-bar">19</div>
                            <div class="ao-rs-step-bar">19</div>
                        </div>
                        <div class="ao-accum-rs-vals">
                            <span>0</span><span>0</span><span>8</span><span>17</span><span>27</span><span>40</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; font-size:7.5px; font-weight:800; color:#64748b; margin-top:2px;">
                            <span>1-5</span><span>6-10</span><span>11-15</span><span>16-20</span><span>21-25</span><span>26-31</span>
                            <span style="font-weight:900; color:#0f172a;">Accum. RS / FFS MTD</span>
                        </div>
                    </div>

                    <div class="ao-pillar-from-new-order">
                        <div style="font-size:15px; font-weight:900;" id="wbFromNewOrderVal">76</div>
                        <span style="font-size:8.5px; display:block; margin-top:2px;">From new order</span>
                        <span class="marker-circle" style="width:18px; height:18px; font-size:10px; margin-top:6px;">8</span>
                    </div>
                </div>
            </div>

            <!-- PANEL 4: SECTION 4: Closing Estimation (①) & Table 1 Model Gap -->
            <div class="ao-panel-card ao-panel-closing" id="aoSec4">
                <div class="ao-section-heading">
                    <span>Closing Estimation <span class="marker-circle">1</span> &amp; Model Gap OS</span>
                </div>

                <div class="ao-closing-estimation-card">
                    <table class="ao-closing-table-compact">
                        <tbody>
                            <tr>
                                <th style="text-align:left;">OAP Target</th>
                                <td class="th-gold" id="wbCloseOapTarget">92</td>
                                <th style="text-align:left;">[A] Match w/ OS</th>
                                <td id="wbCloseMatchOS">29</td>
                            </tr>
                            <tr>
                                <th style="text-align:left;">[B] New Order (SPK)</th>
                                <td id="wbCloseNewSPK">76</td>
                                <th style="text-align:left;">Total Estimasi [A+B]</th>
                                <td style="font-weight:900;" id="wbCloseTotalEst">92</td>
                            </tr>
                            <tr>
                                <th style="text-align:left;">Total Inv. Stock</th>
                                <td class="td-blue" id="wbCloseInvStock">46</td>
                                <th style="text-align:left;">Efficiency (STO)</th>
                                <td style="font-weight:900;" id="wbCloseEffSTO">24%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="ao-model-table-wrap">
                    <table class="ao-model-table">
                        <thead>
                            <tr>
                                <th rowspan="2" class="ao-th-yellow ao-col-model-name">Model</th>
                                <th rowspan="2" class="ao-th-yellow">Gap OS<br><span style="font-size:7.5px;">TOTAL</span></th>
                                <th colspan="5" class="ao-th-green">Match &amp; Unfirmed (PL + CPI)</th>
                                <th rowspan="2" class="ao-th-red">Firmed</th>
                                <th rowspan="2" class="ao-th-red">P.Loan</th>
                                <th rowspan="2" class="ao-th-red">UNMATCH</th>
                            </tr>
                            <tr>
                                <th class="ao-th-green">1 Mgg</th>
                                <th class="ao-th-green">2 Mgg</th>
                                <th class="ao-th-green">3 Mgg</th>
                                <th class="ao-th-green">4 Mgg</th>
                                <th class="ao-th-yellow">TOTAL</th>
                            </tr>
                        </thead>
                        <tbody id="wbTable1Body">
                            <!-- Injected by js -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- PANEL 5: SECTION 5: Table 2 Supply, Alokasi & FTS -->
            <div class="ao-panel-card ao-panel-supply" id="aoSec5">
                <div class="ao-section-heading">
                    <span>Supply, Alokasi &amp; FTS Bulanan</span>
                </div>
                <div class="ao-table2-layout">
                    <div class="ao-side-param-box">
                        <div class="title">PARAM</div>
                        <div><strong>N+1 OP:</strong> 114</div>
                        <div style="margin-top:3px;"><strong>CKD SPK:</strong> 38</div>
                        <div style="margin-top:3px;"><strong>Comp:</strong> 76</div>
                    </div>

                    <div class="ao-model-table-wrap" style="max-height:100%;">
                        <table class="ao-model-table">
                            <thead>
                                <tr>
                                    <th class="ao-col-model-name">Model</th>
                                    <th class="ao-th-yellow">Stock</th>
                                    <th class="ao-th-blue">MDP<br><span style="font-size:6.5px;">in/out</span></th>
                                    <th>2nd Allo</th>
                                    <th>C/O</th>
                                    <th class="ao-th-peach">TTL Supply</th>
                                    <th>DO<br><span style="font-size:6.5px;">act</span></th>
                                    <th>Match</th>
                                    <th class="ao-th-peach">FTS</th>
                                    <th>SPK</th>
                                    <th>DO</th>
                                    <th class="ao-th-green">Net FTS</th>
                                </tr>
                            </thead>
                            <tbody id="wbTable2Body">
                                <!-- Injected by js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </main>
  </div>

  <script src="../js/kacab_global.js?v=20260914_ao_v30"></script>
  <script src="../js/ao_report_data.js?v=20260914_ao_v30"></script>
  <script src="../js/ao_report.js?v=20260914_ao_v30"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
        initAOReport('kacab');
    });

    function logoutUser() {
        localStorage.clear();
        window.location.href = '../pages/login_kacab.html';
    }
  </script>

  <!-- Modal Dialog: Impor Excel AO Report (Kacab) -->
  <div id="modalAoImport" class="ao-modal-backdrop" onclick="if(event.target===this) closeAoImportModal()">
    <div class="ao-modal-card">
      <div class="ao-modal-header">
        <h3 class="ao-modal-title">
          <i class="fa-solid fa-file-arrow-up" style="color:#2563eb;"></i> Impor Data Excel AO Report
        </h3>
        <button class="ao-modal-close" onclick="closeAoImportModal()" title="Tutup">&times;</button>
      </div>
      <div class="ao-modal-body">
        <div class="ao-dropzone" onclick="document.getElementById('inputAoFile').click()" ondragover="event.preventDefault(); this.classList.add('dragover')" ondragleave="this.classList.remove('dragover')" ondrop="event.preventDefault(); this.classList.remove('dragover'); handleAoFileSelected(event.dataTransfer.files)">
          <i class="fa-solid fa-cloud-arrow-up ao-dropzone-icon"></i>
          <div class="ao-dropzone-text">Pilih atau Tarik File Excel ke Sini</div>
          <div class="ao-dropzone-hint">Mendukung format spreadsheet <strong>.xlsx</strong> resmi Tunas Toyota (AO Report, Action Plan, by MDL)</div>
          <input type="file" id="inputAoFile" accept=".xlsx" style="display:none;" onchange="handleAoFileSelected(this.files)">
        </div>

        <div id="aoSelectedFileInfo" style="display:none; margin-top:14px; padding:10px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; align-items:center; gap:10px;">
          <i class="fa-solid fa-file-excel" style="color:#16a34a; font-size:20px;"></i>
          <div style="flex:1; overflow:hidden;">
            <div id="aoSelectedFileName" style="font-size:12.5px; font-weight:700; color:#1e293b; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">-</div>
            <div style="font-size:11px; color:#64748b;">Siap diproses dan diintegrasikan ke papan operasional</div>
          </div>
          <button type="button" onclick="resetAoImportForm()" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-size:14px;" title="Batalkan file"><i class="fa-solid fa-trash-can"></i></button>
        </div>

        <div id="aoUploadProgress" style="display:none; margin-top:14px;">
          <div style="display:flex; justify-content:space-between; font-size:11px; font-weight:700; color:#475569; margin-bottom:5px;">
            <span id="aoProgressText">Memproses file...</span>
            <span id="aoProgressPercent">0%</span>
          </div>
          <div style="width:100%; height:8px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div id="aoProgressBar" style="width:0%; height:100%; background:linear-gradient(90deg, #2563eb, #3b82f6); transition:width 0.3s ease;"></div>
          </div>
        </div>

        <div style="margin-top:14px; padding:10px 12px; background:#f8fafc; border:1px dashed #cbd5e1; border-radius:8px; font-size:11px; color:#475569; line-height:1.4;">
          <i class="fa-solid fa-circle-info" style="color:#0284c7;"></i>
          <strong>Catatan:</strong> Data akan otomatis menguraikan sheet <em>AO Report(0)</em>, <em>Action Plan</em>, dan <em>by MDL</em> serta langsung memperbarui papan live tanpa perlu reload halaman.
        </div>
      </div>
      <div class="ao-modal-footer">
        <button type="button" class="btn-ao" onclick="closeAoImportModal()" style="border:1px solid #cbd5e1; background:#f8fafc;">Batal</button>
        <button type="button" class="btn-ao btn-ao-import" id="btnSubmitAoImport" onclick="submitAoImport('kacab')" style="background:#2563eb; color:#ffffff; border-color:#1d4ed8; padding:7px 16px;">
          <i class="fa-solid fa-upload"></i> Proses &amp; Terapkan
        </button>
      </div>
    </div>
  </div>

</body>
</html>
