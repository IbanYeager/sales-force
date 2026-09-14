<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Area Operation (AO) Report</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="/css/style_spv.css?v=20260914_master">
  <link rel="stylesheet" href="../css/style_spv.css?v=20260914_master">
  <link rel="stylesheet" href="/css/ao_report.css?v=20260914_ao_v30">
  <link rel="stylesheet" href="../css/ao_report.css?v=20260914_ao_v30">

  <link rel="icon" type="image/x-icon" href="../favicon.ico">
  <link rel="shortcut icon" href="../favicon.ico">
  <link rel="apple-touch-icon" href="../image/icons/icon-192x192.png">
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="spv-shell">
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

      <nav class="spv-nav">
        <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO" class="active"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="../pages/polreg.html" id="navPolreg"><i class="fa-solid fa-chart-pie"></i>Peta Polreg Wilayah</a>
        <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
        <a href="inventory.html" id="navInventory"><i class="fa-solid fa-warehouse"></i>Live Stok Unit</a>
        <a href="penjualan_kircon.html" id="navPenjualan"><i class="fa-solid fa-table-list"></i>Penjualan Kircon</a>
        <a href="kelola_data.html" id="navKelola"><i class="fa-solid fa-database"></i>Kelola Data</a>
      </nav>

      <div class="sidebar-footer">
        <button class="btn btn-danger" style="width:100%;" onclick="logoutUser()">
          <i class="fa-solid fa-right-from-bracket"></i> Keluar
        </button>
      </div>
    </aside>

    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 id="pageTitle">Area Operation (AO) Report</h2>
          <p class="page-sub" id="dashPeriode">Papan Operasional Harian &amp; Ritme SPK/DO Tim Supervisor</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="https://ui-avatars.com/api/?name=SPV&background=1c2740&color=ffffff&bold=true" alt="Avatar">
            <img id="spvAvatar" src="https://ui-avatars.com/api/?name=Pak+Ryan&background=0D1B3E&color=ffffff&bold=true" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Supervisor</span>
            <span class="role" id="spvRole">Supervisor Toyota</span>
            <span class="name" id="spvNama">Pak Ryan</span>
            <span class="role" id="spvRole">Supervisor</span>
          </div>
        </div>
      </div>

      <!-- ===== MASTER TEAM FILTER BAR ===== -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 18px; margin-bottom: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #0f172a;">
          <span style="background: #e0f2fe; color: #0369a1; padding: 3px 8px; border-radius: 8px; border: 1px solid #bae6fd;">
            <i class="fa-solid fa-users-viewfinder"></i> SPV Scope
          </span>
          <span>Filter Tim Supervisor:</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <select id="selectSpvTeamFilter" class="form-control" style="width: auto; padding: 6px 12px; font-weight: 700; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 12.5px; background: #f8fafc;" onchange="applyTeamFilter(this.value)">
            <option value="Semua">Semua Tim (Total Cabang - 42 Sales)</option>
            <option value="Ryan">Tim Pak Ryan (11 Sales)</option>
            <option value="Riva">Tim Pak Riva (10 Sales)</option>
            <option value="Dani">Tim Pak Dani (11 Sales)</option>
            <option value="Hendra">Tim Pak Hendra (10 Sales)</option>
          </select>
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
                     style="height:28px; max-width:200px; object-fit:contain;" 
                     onerror="this.style.display='none'; document.getElementById('txtLogoSpv').style.display='inline-flex';" />
                <div class="ao-brand-badge-text" id="txtLogoSpv" style="display:none;">
                    tunas <span class="toyota">TOYOTA</span> KIARACONDONG
                </div>
                <span class="marker-circle" title="Section 1">1</span>
            </div>

            <div class="ao-actions-toolbar">
                <button class="btn-ao btn-ao-projector" id="btnAoProjector" title="Mode Layar Penuh untuk Proyektor TV Rapat">
                    <i class="fa-solid fa-expand"></i> Mode Proyektor TV
                </button>
                <button class="btn-ao btn-ao-wa" id="btnAoSendWA" title="Bagikan Ringkasan AO ke WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> Broadcast WA
                </button>
                <button class="btn-ao btn-ao-export" id="btnAoExportCSV" title="Unduh Data Format Excel / CSV">
                    <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> Ekspor CSV
                </button>
            </div>
        </div>

        <!-- Master 2-Column Landscape Grid -->
        <div class="ao-whiteboard-grid">

            <!-- ======================= LEFT COLUMN ======================= -->
            <div class="ao-left-col-wrap">

                <!-- SECTION 1: Stock Matching with OS (②) -->
                <div class="ao-section-panel">
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
                                <div class="ao-os-layer layer-gt60" style="font-size:8px;">
                                    <span>&gt;60 days</span>
                                    <span>firmed &amp; match 0</span>
                                </div>
                                <div class="ao-os-layer layer-3060" style="font-size:8px;">
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
                                    <span style="font-size:13px; font-weight:900;">19</span>
                                    <span style="font-size:8.5px;">(PL + CPI)</span>
                                </div>
                            </div>
                            <div class="ao-pillar-footer-title">OS Order</div>
                        </div>

                        <!-- Column 4: Stock Matching -->
                        <div class="ao-pillar-col">
                            <div class="ao-pillar-head-val" style="font-size:11px; padding:6px 0;">Stock Matching</div>
                            <div class="ao-sm-stack-body">
                                <div class="ao-sm-top-row">
                                    <div class="ao-sm-top-cell">2 <span style="font-size:7.5px; display:block;">unfirmed &gt;30d</span></div>
                                    <div class="ao-sm-top-cell">2 <span style="font-size:7.5px; display:block;">unfirmed &lt;30d</span></div>
                                </div>
                                <div class="ao-sm-unmatch-box">
                                    <div style="font-weight:900; font-size:9.5px; margin-bottom:2px;"><span id="wbSmUnmatchTotal">10</span> unmatch stock</div>
                                    <div class="ao-sm-subrow"><span>1</span><span>firmed &gt;30d</span></div>
                                    <div class="ao-sm-subrow"><span>5</span><span>firmed &lt;30d</span></div>
                                    <div class="ao-sm-subrow"><span>4</span><span>unfirmed &lt;30d</span></div>
                                    <div class="ao-sm-subrow"><span>0</span><span>unfirmed &gt;30d</span></div>
                                </div>
                                <div class="ao-sm-match-box">
                                    <div style="font-weight:900; font-size:9.5px; margin-bottom:2px;"><span id="wbSmMatchTotal">16</span> match stock</div>
                                    <div class="ao-sm-subrow"><span>1</span><span>firmed &gt;30d</span></div>
                                    <div class="ao-sm-subrow"><span style="font-size:12px; font-weight:900;">15</span><span>(PL + CPI)</span></div>
                                </div>
                            </div>
                            <div class="ao-pillar-footer-title">Stock Matching</div>
                        </div>

                        <!-- Right of Section 1: KPI & 6-step staircase -->
                        <div class="ao-stock-kpi-ladder-col">
                            <div>
                                <div class="ao-kpi-ratio-row">
                                    <span>MATCHING RATIO <strong style="font-size:18px;" id="wbMatchingRatioVal">34</strong> %</span>
                                    <span class="marker-circle">3</span>
                                </div>
                                <div class="ao-kpi-potential-row">
                                    <span>Total potential DO fr OS : <strong id="wbPotentialDoVal">16</strong></span>
                                    <span class="marker-circle">5</span>
                                </div>
                            </div>

                            <div class="ao-staircase-chart-row">
                                <!-- Mini Pillar 0 MDP / 16 on hand -->
                                <div class="ao-pillar-sub-od">
                                    <div class="ao-sub-od-top">0 MDP</div>
                                    <div class="ao-sub-od-bot">16<br><span style="font-size:8px;">on hand stock</span></div>
                                </div>

                                <!-- 6-step staircase -->
                                <div class="ao-stairs-wrap">
                                    <div class="ao-stair-step step-1" title="1-5: 2 (Akum 2)"></div>
                                    <div class="ao-stair-step step-2" title="6-10: 3 (Akum 5)"></div>
                                    <div class="ao-stair-step step-3" title="11-15: 3 (Akum 8)"></div>
                                    <div class="ao-stair-step step-4" title="16-20: 3 (Akum 11)"></div>
                                    <div class="ao-stair-step step-5" title="21-25: 3 (Akum 14)"></div>
                                    <div class="ao-stair-step step-6" title="26-31: 2 (Akum 16)">16</div>
                                </div>

                                <!-- Pillar GAP Target & MTD -->
                                <div class="ao-pillar-gap-target">
                                    <div class="gap-top">
                                        <span style="font-size:8.5px; display:block;">92</span>
                                        <span>GAP Target</span>
                                        <div style="font-size:15px; font-weight:900;" id="wbGapTargetVal">76</div>
                                        <span class="marker-circle" style="width:20px; height:20px; font-size:11px;">6</span>
                                    </div>
                                    <div class="mtd-bot">
                                        <div style="font-size:16px; font-weight:900;" id="wbMtdActualVal">16</div>
                                        <span style="font-size:9px;">MTD</span>
                                        <span class="marker-circle" style="width:20px; height:20px; font-size:11px;">4</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 2: Matching Stock from Order / SPK Plan (⑩) -->
                <div class="ao-section-panel">
                    <div class="ao-section-heading">
                        <div>
                            <span>Matching Stock from Order</span>
                            <div style="font-size:14px; font-weight:900;">SPK plan <span class="marker-circle">10</span></div>
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
                                        <th colspan="1" style="background:#fef08a; color:#854d0e;">For N+1 RS: 42</th>
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
                                <div style="display:flex; gap:12px; margin-top:2px;">
                                    <span>3m avg: <strong id="wbCancel3mAvg">4%</strong></span>
                                    <span>Loan rej: <strong id="wbLoanRej">2%</strong></span>
                                </div>
                            </div>

                            <div class="ao-nett-visual-row">
                                <div style="flex:1;">
                                    <div style="font-size:10px; font-weight:900; color:#2563eb; margin-bottom:4px;">
                                        <i class="fa-solid fa-arrow-right"></i> Nett SPK Visualize
                                    </div>
                                    <div class="ao-stairs-wrap" style="height:85px;">
                                        <div class="ao-stair-step step-1">19</div>
                                        <div class="ao-stair-step step-2">19</div>
                                        <div class="ao-stair-step step-3">19</div>
                                        <div class="ao-stair-step step-4">19</div>
                                        <div class="ao-stair-step step-5">19</div>
                                        <div class="ao-stair-step step-6">19</div>
                                    </div>
                                    <div style="display:flex; justify-content:space-between; font-size:8px; font-weight:800; color:#64748b; margin-top:2px;">
                                        <span>1-5</span><span>6-10</span><span>11-15</span><span>16-20</span><span>21-25</span><span>26-31</span>
                                    </div>
                                    <div style="font-size:10px; font-weight:900; text-align:center; margin-top:2px;">RS plan</div>
                                </div>

                                <div style="display:flex; flex-direction:column; align-items:center;">
                                    <div class="ao-arrow-avg-days">
                                        <i class="fa-solid fa-arrows-left-right"></i> Average 8 days<br>SPK-AFI
                                    </div>

                                    <div class="ao-pillar-become-os">
                                        <div class="top-os">
                                            <div style="font-size:8.5px;">114</div>
                                            <div>19</div>
                                            <div style="font-size:13px; font-weight:900;" id="wbPillarBecomeOs">38</div>
                                            <span style="font-size:8.5px;">Become OS</span>
                                        </div>
                                        <div class="bot-rs">
                                            <div style="font-size:16px; font-weight:900;" id="wbPillarEffMonthRS">76</div>
                                            <span style="font-size:8.5px;">Effective to<br>May RS</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- SECTION 3: MDP Plan & FFS Selling Plan -->
                <div class="ao-section-panel">
                    <div class="ao-section-heading">
                        <span>MDP plan</span>
                    </div>

                    <div class="ao-mdp-section-grid">
                        <!-- Pillar 32 (2 green + 30 blue) -->
                        <div class="ao-pillar-mdp-split">
                            <div style="padding:2px; font-size:12px; font-weight:900;" id="wbMdpPillarTotal">32</div>
                            <div class="ao-mdp-top-slice" id="wbMdpSliceGreen">2</div>
                            <div class="ao-mdp-bot-slice" id="wbMdpSliceBlue">30</div>
                        </div>

                        <!-- Pillar 46 FFS -->
                        <div class="ao-pillar-ffs-oh">
                            <div style="font-size:15px; font-weight:900;" id="wbFfsPillarVal">46</div>
                            <span style="font-size:9px;">FFS</span>
                        </div>

                        <!-- Staircase Trucks (FFS Selling Plan) -->
                        <div class="ao-ffs-truck-ladder-wrap">
                            <div style="font-size:10px; font-weight:900; color:#2563eb; margin-bottom:2px;">
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

                            <!-- RS Plan Underneath -->
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
                            <div style="display:flex; justify-content:space-between; font-size:8px; font-weight:800; color:#64748b; margin-top:2px;">
                                <span>1-5</span><span>6-10</span><span>11-15</span><span>16-20</span><span>21-25</span><span>26-31</span>
                                <span style="font-weight:900; color:#0f172a;">Accum. [RS] / FFS MTD</span>
                            </div>
                        </div>

                        <!-- Tall Pillar 76 From new order -->
                        <div class="ao-pillar-from-new-order">
                            <div style="font-size:18px; font-weight:900;" id="wbFromNewOrderVal">76</div>
                            <span style="font-size:9.5px; display:block; margin-top:4px;">From new order</span>
                            <span class="marker-circle" style="width:20px; height:20px; font-size:11px; margin-top:8px;">8</span>
                        </div>
                    </div>
                </div>

            </div>

            <!-- ======================= RIGHT COLUMN ======================= -->
            <div class="ao-right-col-wrap">

                <!-- SECTION 4: Closing Estimation (①) & Table 1 -->
                <div class="ao-section-panel" style="margin-bottom:0;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:15px; font-weight:900;">Closing Estimation <span class="marker-circle">1</span></span>
                    </div>

                    <!-- Compact Summary Table -->
                    <div class="ao-closing-estimation-card">
                        <table class="ao-closing-table-compact">
                            <tbody>
                                <tr>
                                    <th style="text-align:left;">OAP Target</th>
                                    <td class="th-gold" id="wbCloseOapTarget">92</td>
                                </tr>
                                <tr>
                                    <th style="text-align:left;">[A] Matching with Outstanding</th>
                                    <td id="wbCloseMatchOS">29</td>
                                </tr>
                                <tr>
                                    <th style="text-align:left;">[B] New Order (SPK)</th>
                                    <td id="wbCloseNewSPK">76</td>
                                </tr>
                                <tr>
                                    <th style="text-align:left;">Total Estimasi Closing [A+B]</th>
                                    <td style="font-weight:900;" id="wbCloseTotalEst">92</td>
                                </tr>
                                <tr>
                                    <th style="text-align:left;">Total Invoiceable Stock</th>
                                    <td class="td-blue" id="wbCloseInvStock">46</td>
                                </tr>
                                <tr>
                                    <th style="text-align:left;">Efficiency (STO)</th>
                                    <td style="font-weight:900;" id="wbCloseEffSTO">24%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Table 1: Gap from OS & Match Unfirmed -->
                    <div class="ao-model-table-wrap">
                        <table class="ao-model-table">
                            <thead>
                                <tr>
                                    <th rowspan="2" class="ao-th-yellow ao-col-model-name">Model</th>
                                    <th rowspan="2" class="ao-th-yellow">Gap from OS<br><span style="font-size:8px;">TOTAL</span></th>
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

                <!-- SECTION 5: Table 2 Supply, Alokasi & FTS -->
                <div class="ao-section-panel">
                    <div class="ao-table2-layout">
                        <!-- Left Mini Parameters -->
                        <div class="ao-side-param-box">
                            <div class="title">PARAM</div>
                            <div><strong>N+1 OP tgt:</strong> 114</div>
                            <div style="margin-top:4px;"><strong>Day 21-30 CKD SPK:</strong> 38</div>
                            <div style="margin-top:4px;"><strong>Comp.:</strong> 76</div>
                        </div>

                        <!-- Table 2 Body -->
                        <div class="ao-model-table-wrap" style="max-height:360px;">
                            <table class="ao-model-table">
                                <thead>
                                    <tr>
                                        <th class="ao-col-model-name">Model</th>
                                        <th class="ao-th-yellow">Stock</th>
                                        <th class="ao-th-blue">MDP<br><span style="font-size:7px;">in/out</span></th>
                                        <th>2nd Allo</th>
                                        <th>C/O</th>
                                        <th class="ao-th-peach">TTL Supply</th>
                                        <th>DO<br><span style="font-size:7px;">actual</span></th>
                                        <th>Stock Matching</th>
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
      </div>
    </main>
  </div>

  <script src="../js/ao_report_data.js?v=20260914_ao_v30"></script>
  <script src="../js/ao_report.js?v=20260914_ao_v30"></script>
  <script src="../js/spv_global.js?v=20260914_ao_v30"></script>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
        initAOReport('spv');
    });

    function applyTeamFilter(val) {
        // Optional SPV team simulation indicator
        const dateEl = document.getElementById('aoReportDate');
        if (dateEl) {
            dateEl.textContent = val === 'Semua' ? '10 Agustus 2026' : `10 Agu 2026 (Tim ${val})`;
        }
    }

    function logoutUser() {
        localStorage.clear();
        window.location.href = '../pages/login_spv.html';
    }
  </script>
</body>
</html>
