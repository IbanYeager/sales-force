<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kacab Desktop - Area Operation (AO) Report</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_kacab.css?v=20260917_excel_v4">
  <link rel="stylesheet" href="/css/style_kacab.css?v=20260917_excel_v4">
  <link rel="stylesheet" href="../css/ao_report.css?v=20260917_excel_v4">
  <link rel="stylesheet" href="/css/ao_report.css?v=20260917_excel_v4">

  <style>
    @php
      $aoCssPath = public_path('css/ao_report.css');
      if (file_exists($aoCssPath)) {
          include $aoCssPath;
      }
    @endphp

    /* Critical Modal Styles to guarantee hidden state on load */
    .ao-modal-backdrop {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(4px);
      z-index: 999999;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
  </style>

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

      <!-- Main Interactive Excel Workbook Container -->
      <div class="ao-excel-workbook" id="aoExcelWorkbook">
        
        <!-- Excel Application Titlebar -->
        <div class="ao-excel-titlebar">
            <div class="ao-excel-title-left">
                <div class="excel-app-icon"><i class="fa-solid fa-file-excel"></i></div>
                <div class="excel-title-text">
                    <span class="workbook-name">AO TUNAS TOYOTA AUG 2026 - 01 AUG 2026.xlsx</span>
                    <span class="sheet-sub">AREA OPERATION REPORT &bull; TUNAS NATIONAL KIARACONDONG</span>
                </div>
                <span class="excel-status-badge"><i class="fa-solid fa-circle-check"></i> Live Data</span>
            </div>
            <div class="ao-excel-title-right">
                <div class="excel-asof-date" id="aoReportDate">As of 01 Agustus 2026</div>
            </div>
        </div>

        <!-- Excel Actions Toolbar -->
        <div class="ao-excel-toolbar">
            <div class="excel-toolbar-group">
                <button class="btn-excel btn-excel-import" onclick="openAoImportModal()" title="Impor File Excel Update AO Report (.xlsx)">
                    <i class="fa-solid fa-file-arrow-up" style="color:#2563eb;"></i> Impor File Excel AO
                </button>
                <button class="btn-excel" onclick="window.AOReportData.exportToCSV()" title="Unduh CSV Format Excel">
                    <i class="fa-solid fa-download" style="color:#16a34a;"></i> Ekspor CSV
                </button>
            </div>
            <div class="excel-toolbar-group">
                <button class="btn-excel" id="btnAoProjector" title="Layar Penuh untuk Proyektor Rapat">
                    <i class="fa-solid fa-expand"></i> Mode Proyektor TV
                </button>
                <button class="btn-excel btn-excel-wa" id="btnAoSendWA" title="Bagikan Ringkasan AO ke WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> Broadcast WA
                </button>
            </div>
        </div>

        <!-- Sheets Viewport (Tab Panes) -->
        <div class="ao-sheets-viewport">

            <!-- ========================================================= -->
            <!-- SHEET 1: AO Report(0) (Section A & B, Closing Estimation) -->
            <!-- ========================================================= -->
            <div class="ao-sheet-pane active" id="sheet_aoReport0">
                
                <!-- ROW 1: [A] Stock Matching with OS & Closing Estimation -->
                <div class="ao-secA-row">
                    <!-- Left: [A] Stock Matching with OS -->
                    <div class="excel-table-card">
                        <div class="excel-section-header">
                            <span><i class="fa-solid fa-layer-group" style="color:#2563eb;"></i> [A] Stock Matching with OS</span>
                            <span class="badge" style="background:#eff6ff; color:#1d4ed8; font-size:11px; padding:2px 8px; border-radius:4px; border:1px solid #bfdbfe;">Lingkaran 2</span>
                        </div>
                        <div class="excel-table-scroll">
                            <div class="ao-excel-pillars-grid">
                                <!-- Pillar 1: Full Stock -->
                                <div class="excel-pillar-box">
                                    <div class="excel-pillar-head">Full Stock</div>
                                    <div class="excel-pillar-total" id="wbFullStockTotal">123</div>
                                    <div class="excel-pillar-body">
                                        <div class="excel-sub-block bg-soft-blue">
                                            <span>Free for sales</span>
                                            <strong id="wbFullStockFree">81</strong>
                                        </div>
                                        <div class="excel-sub-block">
                                            <span>Match</span>
                                            <strong id="wbFullStockMatch">42</strong>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pillar 2: Invoiceable Stock -->
                                <div class="excel-pillar-box">
                                    <div class="excel-pillar-head">Invoicable Stk</div>
                                    <div class="excel-pillar-total" id="wbInvStockTotal">123</div>
                                    <div class="excel-pillar-body">
                                        <div class="excel-sub-block bg-soft-blue">
                                            <span>Free for sales</span>
                                            <strong id="wbInvStockFree">81</strong>
                                        </div>
                                        <div class="excel-sub-block">
                                            <span>Match</span>
                                            <strong id="wbInvStockMatch">42</strong>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pillar 3: OS Order -->
                                <div class="excel-pillar-box">
                                    <div class="excel-pillar-head">OS Order</div>
                                    <div class="excel-pillar-total" id="wbOsOrderTotal">53</div>
                                    <div class="excel-pillar-body">
                                        <div class="excel-sub-block" style="background:#fee2e2; color:#991b1b; font-size:10px;">
                                            <span>&gt;60 days</span>
                                            <span>Match <strong id="wbOsGt60Match">0</strong></span>
                                        </div>
                                        <div class="excel-sub-block" style="background:#fef3c7; color:#92400e; font-size:10px;">
                                            <span>30-60 days (<strong id="wbOs3060">4</strong>)</span>
                                            <span>Match <strong id="wbOs3060Match">2</strong></span>
                                        </div>
                                        <div class="excel-sub-block bg-yellow" style="font-size:10px; flex-direction:column; align-items:flex-start;">
                                            <span style="font-weight:700;">firmed OS &lt;30 days</span>
                                            <div style="display:flex; justify-content:space-between; width:100%; margin-top:2px;">
                                                <span>Firmed: <strong id="wbOsLt30Firmed">18</strong></span>
                                                <span>PL+CPI: <strong id="wbOsLt30PlCpi">30</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pillar 4: Stock Matching -->
                                <div class="excel-pillar-box">
                                    <div class="excel-pillar-head">Stock Matching</div>
                                    <div class="excel-pillar-total" style="font-size:14px; padding:10px 4px;">
                                        <span style="color:#16a34a;">Match <strong id="wbStockMatchTotal">42</strong></span>
                                    </div>
                                    <div class="excel-pillar-body">
                                        <div class="excel-sub-block" style="font-size:10px;">
                                            <span>Firmed &gt;30d:</span>
                                            <strong id="wbStockMatchFirmedGt30">1</strong>
                                        </div>
                                        <div class="excel-sub-block" style="font-size:10px;">
                                            <span>PL + CPI:</span>
                                            <strong id="wbStockMatchPlCpi">41</strong>
                                        </div>
                                        <div class="excel-sub-block" style="background:#f1f5f9; font-size:10px;">
                                            <span>Unmatch:</span>
                                            <strong id="wbStockUnmatchTotal" style="color:#dc2626;">5</strong>
                                        </div>
                                        <div class="excel-sub-block" style="font-size:9.5px;">
                                            <span>firmed &gt;30d: <strong id="wbStockUnmatchFirmedGt30">1</strong></span>
                                            <span>firmed &lt;30d: <strong id="wbStockUnmatchFirmedLt30">4</strong></span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Pillar 5: Matching Ratio & Potential -->
                                <div class="excel-pillar-box" style="background:#f8fafc;">
                                    <div class="excel-pillar-head" style="background:#e2e8f0;">MATCHING RATIO</div>
                                    <div style="padding:14px 6px; text-align:center;">
                                        <div style="font-size:24px; font-weight:900; color:#1e40af;" id="wbKpiMatchRatio">79%</div>
                                        <div style="font-size:10px; color:#64748b; margin-top:2px;">Rasio Kecocokan OS</div>
                                    </div>
                                    <div class="excel-pillar-body" style="padding:6px 8px; border-top:1px solid #e2e8f0; font-size:11px;">
                                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                            <span>Total Potential DO:</span>
                                            <strong id="wbKpiPotentialDO" style="color:#15803d;">53</strong>
                                        </div>
                                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                                            <span>Target DO:</span>
                                            <strong id="wbKpiTargetDO">92</strong>
                                        </div>
                                        <div style="display:flex; justify-content:space-between;">
                                            <span>MTD Actual:</span>
                                            <strong id="wbKpiMtdActual" class="badge" style="background:#dbeafe; color:#1e40af; padding:1px 6px;">10</strong>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Right: Closing Estimation Table -->
                    <div class="excel-table-card">
                        <div class="excel-section-header">
                            <span><i class="fa-solid fa-calculator" style="color:#16a34a;"></i> Closing Estimation</span>
                            <span class="badge" style="background:#f0fdf4; color:#166534; font-size:11px; padding:2px 8px; border-radius:4px; border:1px solid #bbf7d0;">Lingkaran 1</span>
                        </div>
                        <div class="excel-table-scroll">
                            <table class="excel-grid">
                                <thead>
                                    <tr>
                                        <th class="cell-left">Parameter Estimasi</th>
                                        <th style="width:70px;">Vol</th>
                                        <th style="width:70px;">% Tgt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr style="background:#f8fafc; font-weight:800;">
                                        <td class="cell-left">OAP Target</td>
                                        <td class="cell-right" id="wbCloseOapTarget">92</td>
                                        <td class="cell-center">100%</td>
                                    </tr>
                                    <tr>
                                        <td class="cell-left">[A] Matching with Outstanding</td>
                                        <td class="cell-right cell-bold" id="wbCloseMatchOS">53</td>
                                        <td class="cell-center" id="wbCloseMatchOSPct">58%</td>
                                    </tr>
                                    <tr>
                                        <td class="cell-left">[B] New Order (SPK)</td>
                                        <td class="cell-right cell-bold" id="wbCloseNewSPK">39</td>
                                        <td class="cell-center" id="wbCloseNewSPKPct">42%</td>
                                    </tr>
                                    <tr class="bg-amber-light" style="font-weight:900;">
                                        <td class="cell-left">Total Estimasi Closing [A+B]</td>
                                        <td class="cell-right" id="wbCloseTotalEst">92</td>
                                        <td class="cell-center" id="wbCloseTotalEstPct">100%</td>
                                    </tr>
                                    <tr>
                                        <td class="cell-left">Total Invoicable Stock</td>
                                        <td class="cell-right" id="wbCloseInvStock">133</td>
                                        <td class="cell-center">-</td>
                                    </tr>
                                    <tr class="bg-light-green" style="font-weight:800;">
                                        <td class="cell-left">Efficiency (STO)</td>
                                        <td class="cell-right" id="wbCloseEffSTO">69%</td>
                                        <td class="cell-center"><i class="fa-solid fa-check" style="color:#16a34a;"></i></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <!-- ROW 2: [B] Matching Stock from Order (SPK Plan) -->
                <div class="excel-table-card">
                    <div class="excel-section-header">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <span><i class="fa-solid fa-bullseye" style="color:#d97706;"></i> [B] Matching Stock from Order &mdash; SPK Plan</span>
                            <span class="badge" style="background:#fef3c7; color:#92400e; font-size:11px; padding:2px 8px; border-radius:4px; border:1px solid #fde68a;">Lingkaran 10</span>
                        </div>
                        <div style="font-size:11.5px; font-weight:700; color:#475569;">
                            Effective to N RS: <strong class="bg-amber" style="padding:2px 8px; border-radius:4px;" id="wbEffectiveNRS">76</strong>
                            &nbsp;&bull;&nbsp;
                            For N+1 RS: <strong style="padding:2px 8px; border-radius:4px; background:#e2e8f0;" id="wbForNPlus1RS">42</strong>
                        </div>
                    </div>
                    
                    <div style="display:grid; grid-template-columns: minmax(650px, 1.8fr) minmax(280px, 1fr); gap:12px; padding:10px;">
                        <!-- SPK Plan Grid Table -->
                        <div class="excel-table-scroll">
                            <table class="excel-grid">
                                <thead>
                                    <tr>
                                        <th class="cell-left" style="min-width:140px;">Metrik SPK</th>
                                        <th style="width:50px;">TTL</th>
                                        <th>1-5</th>
                                        <th>6-10</th>
                                        <th>11-15</th>
                                        <th>16-20</th>
                                        <th>21-25</th>
                                        <th>26-31</th>
                                    </tr>
                                </thead>
                                <tbody id="wbSpkPlanTableBody">
                                    <!-- Injected dynamically by ao_report.js -->
                                </tbody>
                            </table>
                        </div>

                        <!-- Stepped Visualizer (Nett SPK 5-daily stairs) -->
                        <div style="border:1px solid var(--excel-border); border-radius:6px; background:#ffffff; display:flex; flex-direction:column;">
                            <div style="background:#f8fafc; border-bottom:1px solid var(--excel-border); padding:6px 10px; font-size:11px; font-weight:800; color:#334155; display:flex; justify-content:space-between;">
                                <span>Nett SPK Visualize (5-Harian)</span>
                                <span style="color:#16a34a;"><i class="fa-solid fa-arrow-trend-up"></i> Target 114</span>
                            </div>
                            <div class="spk-step-container" id="wbSpkStepProgression">
                                <!-- Injected dynamically -->
                            </div>
                            <div style="padding:6px 10px; font-size:10.5px; color:#64748b; background:#f8fafc; border-top:1px solid var(--excel-border); display:flex; justify-content:space-between;">
                                <span>Cancel Ratio 3m: <strong>4%</strong></span>
                                <span>Loan Rejection: <strong>2%</strong></span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ROW 3: MDP Plan & FFS Selling Plan -->
                <div class="excel-table-card">
                    <div class="excel-section-header">
                        <span><i class="fa-solid fa-chart-line" style="color:#0284c7;"></i> MDP Plan &amp; FFS Selling Plan</span>
                        <div style="font-size:11.5px; color:#475569;">
                            OH Stock: <strong id="wbMdpOHStock">38</strong> &bull; Total Supply: <strong id="wbMdpTtlSupply">129</strong> &bull; From New Order: <strong id="wbFromNewOrderVal">76</strong>
                        </div>
                    </div>
                    <div class="excel-table-scroll" style="padding:10px;">
                        <table class="excel-grid">
                            <thead>
                                <tr>
                                    <th class="cell-left">Periode FFS</th>
                                    <th>1-5</th>
                                    <th>6-10</th>
                                    <th>11-15</th>
                                    <th>16-20</th>
                                    <th>21-25</th>
                                    <th>26-31</th>
                                    <th>Full Month</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="cell-left cell-bold">FFS Accumulative Plan</td>
                                    <td>38</td><td>44</td><td>53</td><td>67</td><td>82</td><td>94</td><td class="cell-bold bg-peach">111</td>
                                </tr>
                                <tr class="bg-light-green">
                                    <td class="cell-left cell-bold">Actual DO Accumulative</td>
                                    <td>0</td><td>0</td><td>8</td><td>17</td><td>27</td><td>39</td><td class="cell-bold">39</td>
                                </tr>
                                <tr>
                                    <td class="cell-left">[B] RS / FFS MTD Ratio</td>
                                    <td>0%</td><td>0%</td><td>12%</td><td>21%</td><td>29%</td><td>35%</td><td class="cell-bold bg-light-green">35%</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <!-- ========================================================= -->
            <!-- SHEET 2: Action Plan (Supply, Alokasi & FTS 24 Model)       -->
            <!-- ========================================================= -->
            <div class="ao-sheet-pane" id="sheet_actionPlan">
                <div class="excel-table-card">
                    <div class="excel-section-header">
                        <span><i class="fa-solid fa-truck-ramp-box" style="color:#2563eb;"></i> Action Plan &mdash; Supply, Alokasi &amp; FTS per Model Kendaraan</span>
                        <span class="badge" style="background:#e0f2fe; color:#0369a1; font-size:11px; padding:2px 8px; border-radius:4px; border:1px solid #bae6fd;">24 Model Resmi</span>
                    </div>
                    <div class="excel-table-scroll">
                        <table class="excel-grid">
                            <thead>
                                <tr>
                                    <th style="width:36px;">No</th>
                                    <th class="cell-left" style="min-width:180px;">Model Kendaraan</th>
                                    <th class="bg-yellow" style="width:65px;">Stock</th>
                                    <th class="bg-soft-blue-light" style="width:65px;">MDP<br><span style="font-size:9px; font-weight:normal;">in/out</span></th>
                                    <th style="width:65px;">2nd Allo</th>
                                    <th style="width:55px;">C/O</th>
                                    <th class="bg-peach" style="width:80px;">TTL Supply</th>
                                    <th style="width:65px;">DO<br><span style="font-size:9px; font-weight:normal;">act</span></th>
                                    <th style="width:70px;">Stock Match</th>
                                    <th class="bg-peach" style="width:70px;">FTS</th>
                                    <th style="width:60px;">SPK</th>
                                    <th style="width:60px;">DO</th>
                                    <th class="bg-netfts" style="width:75px;">Net FTS</th>
                                </tr>
                            </thead>
                            <tbody id="wbTable2Body">
                                <!-- Injected dynamically by ao_report.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ========================================================= -->
            <!-- SHEET 3: by MDL (Gap from OS & Matching)                  -->
            <!-- ========================================================= -->
            <div class="ao-sheet-pane" id="sheet_byMdl">
                <div class="excel-table-card">
                    <div class="excel-section-header">
                        <span><i class="fa-solid fa-list-check" style="color:#d97706;"></i> by MDL &mdash; Gap from OS &amp; Matching per Model Kendaraan</span>
                        <span class="badge" style="background:#fef3c7; color:#92400e; font-size:11px; padding:2px 8px; border-radius:4px; border:1px solid #fde68a;">Distribusi Mingguan</span>
                    </div>
                    <div class="excel-table-scroll">
                        <table class="excel-grid">
                            <thead>
                                <tr>
                                    <th style="width:36px;">No</th>
                                    <th class="cell-left" style="min-width:180px;">Model</th>
                                    <th style="width:80px;">Gap from OS</th>
                                    <th style="width:65px;">1 Minggu</th>
                                    <th style="width:65px;">2 Minggu</th>
                                    <th style="width:65px;">3 Minggu</th>
                                    <th style="width:65px;">4 Minggu</th>
                                    <th class="bg-yellow" style="width:80px;">Total Match</th>
                                    <th class="bg-netfts" style="width:70px;">Firmed</th>
                                    <th style="width:70px;">P. Loan</th>
                                    <th style="width:75px;">UNMATCH</th>
                                </tr>
                            </thead>
                            <tbody id="wbTable1Body">
                                <!-- Injected dynamically by ao_report.js -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ========================================================= -->
            <!-- SHEET 4: Ringkasan Eksekutif                              -->
            <!-- ========================================================= -->
            <div class="ao-sheet-pane" id="sheet_ringkasan">
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap:14px; margin-bottom:18px;">
                    <div style="background:#ffffff; border:1.5px solid #d0d7de; border-radius:8px; padding:14px; border-left:4px solid #2563eb;">
                        <div style="font-size:11.5px; font-weight:700; color:#64748b;">TOTAL FULL STOCK</div>
                        <div style="font-size:26px; font-weight:900; color:#0f172a; margin:4px 0;" id="sumFullStock">123</div>
                        <div style="font-size:11px; color:#2563eb;">Free: <strong id="sumFreeStock">81</strong> &bull; Match: <strong id="sumMatchStock">42</strong></div>
                    </div>
                    <div style="background:#ffffff; border:1.5px solid #d0d7de; border-radius:8px; padding:14px; border-left:4px solid #eab308;">
                        <div style="font-size:11.5px; font-weight:700; color:#64748b;">OUTSTANDING ORDER (OS)</div>
                        <div style="font-size:26px; font-weight:900; color:#0f172a; margin:4px 0;" id="sumOsOrder">53</div>
                        <div style="font-size:11px; color:#ca8a04;">Matching Ratio: <strong id="sumMatchRatio">79%</strong></div>
                    </div>
                    <div style="background:#ffffff; border:1.5px solid #d0d7de; border-radius:8px; padding:14px; border-left:4px solid #16a34a;">
                        <div style="font-size:11.5px; font-weight:700; color:#64748b;">OAP TARGET CABANG</div>
                        <div style="font-size:26px; font-weight:900; color:#0f172a; margin:4px 0;" id="sumOapTarget">92</div>
                        <div style="font-size:11px; color:#16a34a;">Total Closing Est: <strong id="sumEstClosing">92</strong> (100%)</div>
                    </div>
                    <div style="background:#ffffff; border:1.5px solid #d0d7de; border-radius:8px; padding:14px; border-left:4px solid #8b5cf6;">
                        <div style="font-size:11.5px; font-weight:700; color:#64748b;">STO EFFICIENCY</div>
                        <div style="font-size:26px; font-weight:900; color:#0f172a; margin:4px 0;" id="sumStoEff">69%</div>
                        <div style="font-size:11px; color:#7c3aed;">Optimal Stock Turnover</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- Excel Bottom Sheet Tabs Bar -->
        <div class="ao-excel-tabbar">
            <div class="excel-tab-scroll-nav">
                <button class="excel-tab-nav-btn" onclick="switchAoTabStep(-1)" title="Lembar Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
                <button class="excel-tab-nav-btn" onclick="switchAoTabStep(1)" title="Lembar Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
            </div>
            <div class="excel-tabs-list">
                <button class="excel-tab-item active" id="tabBtn_aoReport0" onclick="switchAoSheet('aoReport0')">
                    <i class="fa-solid fa-table-cells" style="color:#107c41;"></i> AO Report(0)
                </button>
                <button class="excel-tab-item" id="tabBtn_actionPlan" onclick="switchAoSheet('actionPlan')">
                    <i class="fa-solid fa-truck-ramp-box" style="color:#2563eb;"></i> Action Plan (Supply &amp; FTS)
                </button>
                <button class="excel-tab-item" id="tabBtn_byMdl" onclick="switchAoSheet('byMdl')">
                    <i class="fa-solid fa-list-check" style="color:#d97706;"></i> by MDL (Gap OS)
                </button>
                <button class="excel-tab-item" id="tabBtn_ringkasan" onclick="switchAoSheet('ringkasan')">
                    <i class="fa-solid fa-chart-pie" style="color:#8b5cf6;"></i> Ringkasan Eksekutif
                </button>
            </div>
        </div>

      </div>
    </main>
  </div>

  <script src="../js/kacab_global.js?v=20260917_excel_v4"></script>
  <script src="../js/ao_report_data.js?v=20260917_excel_v4"></script>
  <script src="../js/ao_report.js?v=20260917_excel_v4"></script>
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
  <div id="modalAoImport" class="ao-modal-backdrop" style="display:none;" onclick="if(event.target===this) closeAoImportModal()">
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
