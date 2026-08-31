<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Area Operation (AO) Report</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <link rel="stylesheet" href="../css/ao_report.css?v=20260831_center_darklogo">

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
      <div class="ao-board-container" id="aoBoardMainContainer">

        <!-- Board Top Header -->
        <div class="ao-board-header">
            <div class="ao-header-center-wrap">
                <div class="ao-logo-top-center">
                    <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" 
                         alt="Tunas Toyota" 
                         class="ao-logo-dark"
                         onerror="this.onerror=null; this.src='../image/logo_tunas_toyota.png'; this.style.filter='brightness(0)';" />
                </div>
                <h1 class="ao-title-main">Area Operation Report</h1>
                <span class="ao-branch-tag"><i class="fa-solid fa-location-dot"></i> <span id="aoBranchName">TUNAS TOYOTA KIARACONDONG</span></span>
            </div>

            <div class="ao-actions-toolbar">
                <div class="ao-date-pill">
                    <i class="fa-regular fa-calendar-days" style="color:var(--ao-primary-red);"></i>
                    <span id="aoReportDate">10 Agustus 2026</span>
                </div>
                <button class="btn-ao btn-ao-wa" id="btnAoSendWA" title="Bagikan Ringkasan AO ke Tim Sales via WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i> Broadcast ke Tim
                </button>
                <button class="btn-ao btn-ao-export" id="btnAoExportCSV" title="Unduh Data Format Excel / CSV">
                    <i class="fa-solid fa-file-excel" style="color:#16a34a;"></i> Ekspor Excel/CSV
                </button>
            </div>
        </div>

        <!-- Executive Closing Estimation Hero Card -->
        <div class="ao-closing-hero">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; flex-wrap:wrap; gap:8px;">
                <span style="font-size:12px; font-weight:800; text-transform:uppercase; letter-spacing:0.8px; color:#fbbf24;">
                    <i class="fa-solid fa-flag-checkered"></i> Ringkasan Estimasi Closing Bulan Ini
                </span>
                <span style="background:rgba(16,185,129,0.2); color:#6ee7b7; border:1px solid #10b981; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:800;">
                    <i class="fa-solid fa-arrow-trend-up"></i> Estimasi Melampaui Target (+12 Unit)
                </span>
            </div>

            <div class="ao-closing-grid">
                <div class="ao-closing-stat">
                    <div class="ao-closing-label">DO / RS Target</div>
                    <div class="ao-closing-val" id="aoCloseDoTarget">92</div>
                    <div class="ao-closing-sub">Unit</div>
                </div>
                <div class="ao-closing-stat">
                    <div class="ao-closing-label">(+) Matching OS</div>
                    <div class="ao-closing-val" style="color:#60a5fa;" id="aoCloseMatchOS">+52</div>
                    <div class="ao-closing-sub">Unit dari OS</div>
                </div>
                <div class="ao-closing-stat">
                    <div class="ao-closing-label">(+) New Order SPK</div>
                    <div class="ao-closing-val" style="color:#a78bfa;" id="aoCloseNewOrder">+52</div>
                    <div class="ao-closing-sub">Proyeksi SPK Baru</div>
                </div>
                <div class="ao-closing-stat highlight-gold">
                    <div class="ao-closing-label" style="color:#fde68a;">Total Est. Closing</div>
                    <div class="ao-closing-val" style="color:#fbbf24;" id="aoCloseTotalEst">104</div>
                    <div class="ao-closing-sub" style="color:#fef08a;" id="aoCloseGapTarget">+12 Over Target</div>
                </div>
                <div class="ao-closing-stat">
                    <div class="ao-closing-label">Efficiency OS</div>
                    <div class="ao-closing-val" style="color:#34d399;" id="aoCloseEffOS">83%</div>
                    <div class="ao-closing-sub">Rasio Efisiensi</div>
                </div>
            </div>
        </div>

        <!-- 4 Quadrants Grid -->
        <div class="ao-quadrant-grid">

            <!-- Quadrant 1: Stock Matching with OS -->
            <div class="ao-quad-card">
                <div class="ao-quad-header">
                    <h3 class="ao-quad-title">
                        <i class="fa-solid fa-boxes-stacked" style="color:var(--ao-primary-red);"></i>
                        1. Stock Matching with OS
                    </h3>
                    <span style="font-size:11px; font-weight:800; color:#15803d; background:#dcfce7; padding:2px 8px; border-radius:6px;">
                        Matching Ratio: <strong id="aoMatchingRatio">86%</strong>
                    </span>
                </div>

                <div class="ao-stock-bars-row">
                    <div class="ao-bar-box">
                        <div class="ao-bar-box-title">Full Stock</div>
                        <div class="ao-bar-box-val" id="aoFullStockTotal">124</div>
                        <div class="ao-bar-progress">
                            <div class="ao-bar-free" id="aoFullStockBarFree" style="width:66%;">Free 82</div>
                            <div class="ao-bar-match" id="aoFullStockBarMatch" style="width:34%;">Match 42</div>
                        </div>
                        <div class="ao-bar-sub">
                            <span>Free: <strong id="aoFullStockFree">82</strong></span>
                            <span>Match: <strong id="aoFullStockMatch">42</strong></span>
                        </div>
                    </div>

                    <div class="ao-bar-box">
                        <div class="ao-bar-box-title">Invoiceable Stk</div>
                        <div class="ao-bar-box-val" id="aoInvStockTotal">124</div>
                        <div class="ao-bar-progress">
                            <div class="ao-bar-free" id="aoInvStockBarFree" style="width:66%;">Free 82</div>
                            <div class="ao-bar-match" id="aoInvStockBarMatch" style="width:34%;">Match 42</div>
                        </div>
                        <div class="ao-bar-sub">
                            <span>Free: <strong id="aoInvStockFree">82</strong></span>
                            <span>Match: <strong id="aoInvStockMatch">42</strong></span>
                        </div>
                    </div>
                </div>

                <div class="ao-matching-subgrid">
                    <div class="ao-sub-panel">
                        <div class="ao-sub-title"><i class="fa-solid fa-clock-rotate-left"></i> OS Order Status</div>
                        <div class="ao-pill-list">
                            <div class="ao-pill-item">
                                <span>&gt; 60 Hari</span>
                                <span class="ao-pill-badge" style="background:#fee2e2; color:#991b1b;">1 Unit</span>
                            </div>
                            <div class="ao-pill-item">
                                <span>30 - 60 Hari</span>
                                <span class="ao-pill-badge" style="background:#f1f5f9; color:#475569;">0 Unit</span>
                            </div>
                            <div class="ao-pill-item" style="border:1.5px solid #93c5fd;">
                                <span>&lt; 30 Hari</span>
                                <span class="ao-pill-badge" style="background:#dbeafe; color:#1e40af;"><strong id="aoOsLt30Total">48</strong> Unit</span>
                            </div>
                        </div>
                    </div>

                    <div class="ao-sub-panel">
                        <div class="ao-sub-title"><i class="fa-solid fa-link"></i> Matching Detail (PL + CPI)</div>
                        <div class="ao-pill-list">
                            <div class="ao-pill-item">
                                <span>Match 1 Minggu</span>
                                <span class="ao-pill-badge badge-match-w1">10 Unit</span>
                            </div>
                            <div class="ao-pill-item">
                                <span>Match 2-3 Minggu</span>
                                <span class="ao-pill-badge badge-match-w2">10 Unit</span>
                            </div>
                            <div class="ao-pill-item">
                                <span>Firmed Match</span>
                                <span class="ao-pill-badge badge-firmed">18 Unit</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="ao-ladder-container">
                    <div class="ao-ladder-title">
                        <span><i class="fa-solid fa-stairs"></i> Ritme Target 5-Harian MTD (Total Potensi: <strong id="aoPotentialDO">52</strong> Unit)</span>
                        <span style="color:#16a34a;">Realisasi MTD: <strong id="aoMtdActualDO">18</strong></span>
                    </div>
                    <div class="ao-ladder-steps" id="aoStockLadderSteps"></div>
                    <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:9.5px; font-weight:700; color:#64748b;">
                        <span>1-5</span><span>6-10</span><span>11-15</span><span>16-20</span><span>21-25</span><span>26-31</span>
                    </div>
                </div>
            </div>

            <!-- Quadrant 2: Matching Stock from Order / SPK Plan -->
            <div class="ao-quad-card">
                <div class="ao-quad-header">
                    <h3 class="ao-quad-title">
                        <i class="fa-solid fa-file-signature" style="color:var(--ao-primary-red);"></i>
                        2. Matching Stock from Order / SPK Plan
                    </h3>
                    <span style="font-size:11px; font-weight:800; color:#4338ca; background:#e0e7ff; padding:2px 8px; border-radius:6px;">
                        Effective to N+1 RS: <strong>48</strong>
                    </span>
                </div>

                <div class="ao-table-wrapper" style="margin-bottom:14px;">
                    <table class="ao-spk-table">
                        <thead>
                            <tr>
                                <th style="text-align:left;">Metrik SPK</th>
                                <th>TTL</th>
                                <th>1-5</th>
                                <th>6-10</th>
                                <th>11-15</th>
                                <th>16-20</th>
                                <th>21-25</th>
                                <th>26-31</th>
                            </tr>
                        </thead>
                        <tbody id="aoSpkTableBody"></tbody>
                    </table>
                </div>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px; font-size:11px;">
                        <div style="font-weight:800; color:#334155; margin-bottom:4px;"><i class="fa-solid fa-ban" style="color:#ef4444;"></i> Cancellation Stats:</div>
                        <div style="display:flex; justify-content:space-between; font-weight:700; color:#64748b;">
                            <span>3M Avg: <strong style="color:#0f172a;">4%</strong></span>
                            <span>Loan Rejection: <strong style="color:#0f172a;">2%</strong></span>
                        </div>
                    </div>

                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:10px; font-size:11px;">
                        <div style="font-weight:800; color:#334155; margin-bottom:4px;"><i class="fa-solid fa-car-tunnel" style="color:#3b82f6;"></i> RS Plan Metrics:</div>
                        <div style="display:flex; justify-content:space-between; font-weight:700; color:#64748b;">
                            <span>Become OS: <strong style="color:#0f172a;">38</strong></span>
                            <span>Eff Month DO: <strong style="color:#0f172a;">76</strong></span>
                        </div>
                    </div>
                </div>

                <div class="ao-ladder-container">
                    <div class="ao-ladder-title">
                        <span><i class="fa-solid fa-chart-line"></i> Nett SPK Visualize (Target Akumulasi 130 Unit)</span>
                        <span style="color:#2563eb;">Aktual: <strong>54 Unit</strong></span>
                    </div>
                    <div class="ao-ladder-steps" id="aoNettSpkLadder"></div>
                    <div style="display:flex; justify-content:space-between; margin-top:4px; font-size:9.5px; font-weight:700; color:#64748b;">
                        <span>1-5 (30)</span><span>6-10 (54)</span><span>11-15 (73)</span><span>16-20 (92)</span><span>21-25 (111)</span><span>26-31 (130)</span>
                    </div>
                </div>

            </div>
        </div>

        <!-- Quadrant 3: MDP Plan -->
        <div class="ao-quad-card" style="margin-bottom:24px;">
            <div class="ao-quad-header">
                <h3 class="ao-quad-title">
                    <i class="fa-solid fa-truck-fast" style="color:var(--ao-primary-red);"></i>
                    3. MDP Plan &amp; FFS Selling Plan
                </h3>
                <span style="font-size:11px; font-weight:800; color:#065f46; background:#d1fae5; padding:2px 8px; border-radius:6px;">
                    Akumulasi MTD DO/RS: <strong id="aoMdpAccumMtdDoRs">57</strong> Unit
                </span>
            </div>

            <div class="ao-truck-flow" id="aoMdpTruckFlow"></div>
        </div>

        <!-- Quadrant 4: Vehicle Models Breakdown -->
        <div class="ao-matrix-container">
            <div class="ao-matrix-header-bar">
                <div>
                    <h3 style="font-size:16px; font-weight:900; color:#0f172a; margin:0;">
                        <i class="fa-solid fa-table-cells" style="color:var(--ao-primary-red); margin-right:6px;"></i>
                        Matriks Alokasi &amp; Estimasi Closing per Model Kendaraan
                    </h3>
                    <p style="font-size:12px; color:#64748b; margin:2px 0 0 0;">
                        Data 24 Varian Toyota Tunas Kiara Condong dengan rincian Matching Mingguan (W1-W4), Firmed Plan, Unmatch, dan MDP Stock.
                    </p>
                </div>
            </div>

            <div class="ao-mobile-swipe-hint">
                <i class="fa-solid fa-arrows-left-right"></i> Geser tabel ke samping untuk melihat rincian mingguan (W1-W4) &amp; stok firmed
            </div>

            <div class="ao-matrix-table-wrap">
                <table class="ao-matrix-table">
                    <thead>
                        <tr>
                            <th style="min-width:170px; text-align:left;">Model Kendaraan</th>
                            <th>Gap OS</th>
                            <th>1 Mgg</th>
                            <th>2 Mgg</th>
                            <th>3 Mgg</th>
                            <th>4 Mgg</th>
                            <th style="background:#eab308; color:#000;">TTL Match</th>
                            <th style="background:#16a34a;">Firmed</th>
                            <th style="background:#dc2626;">Unmatch</th>
                            <th style="background:#0284c7;">MDP Stk</th>
                            <th>1st Ada</th>
                            <th>2nd Ada</th>
                            <th style="background:#0f172a; color:#fbbf24;">Est Closing</th>
                        </tr>
                    </thead>
                    <tbody id="aoModelsTableBody"></tbody>
                </table>
            </div>
        </div>

      </div>
    </main>
  </div>

  <script src="../js/ao_report_data.js"></script>
  <script src="../js/ao_report.js"></script>
  <script src="../js/spv_global.js?v=20260828"></script>
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
