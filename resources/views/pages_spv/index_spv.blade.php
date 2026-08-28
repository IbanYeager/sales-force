<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">

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
        <a href="index_spv.html" id="navDash" class="active"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
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
          <h2 id="pageTitle">Dashboard</h2>
          <p class="page-sub" id="dashPeriode">Memuat periode...</p>
        </div>
        <div class="spv-user">
          <div class="avatar-status">
            <img id="spvAvatar" src="" alt="Avatar">
            <span class="dot"></span>
          </div>
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Memuat...</span>
          </div>
        </div>
      </div>

      <!-- ===== MASTER TEAM FILTER BAR ===== -->
      <div style="display: flex; justify-content: space-between; align-items: center; background: white; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 18px; margin-bottom: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03); flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 800; color: #0f172a;">
          <span style="background: #fef3c7; color: #b45309; padding: 3px 8px; border-radius: 8px; border: 1px solid #fde68a;">
            <i class="fa-solid fa-crown"></i> Master Mode
          </span>
          <span>Cakupan Pengawasan Supervisor &amp; Cabang:</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <label style="font-size: 12px; font-weight: 700; color: #475569;">Pilih Tim SPV:</label>
          <select id="selectSpvTeamFilter" class="form-control" style="width: auto; padding: 6px 12px; font-weight: 700; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 12.5px; background: #f8fafc;" onchange="changeSpvTeamFilter(this.value)">
            <option value="Semua">👑 Semua Tim (Master View - Seluruh 42 Sales)</option>
            <option value="Ryan">Tim Pak Ryan</option>
            <option value="Riva">Tim Pak Riva</option>
            <option value="Dani">Tim Pak Dani</option>
            <option value="Hendra">Tim Pak Hendra</option>
          </select>
        </div>
      </div>

      <!-- ===== BARIS STATISTIK UTAMA ===== -->
      <div class="grid-3" style="margin-bottom:18px;">
        <div class="stat-tile clickable" onclick="location.href='approval.html'" style="animation-delay:0.02s;">
          <div class="icon red"><i class="fa-solid fa-check-to-slot"></i></div>
          <div class="body">
            <div class="label">Pending Approval</div>
            <div class="value" id="dashPending">0</div>
            <div class="sub">Menunggu persetujuan Anda</div>
          </div>
        </div>

        <div class="stat-tile clickable" onclick="location.href='aktivitas.html'" style="animation-delay:0.06s;">
          <div class="icon blue"><i class="fa-solid fa-list-check"></i></div>
          <div class="body">
            <div class="label">Aktivitas Tim</div>
            <div class="value" id="dashAktif">0</div>
            <div class="sub">Aktivitas terekam</div>
          </div>
        </div>

        <div class="stat-tile clickable" onclick="location.href='wiraniaga.html'" style="animation-delay:0.1s;">
          <div class="icon green"><i class="fa-solid fa-users"></i></div>
          <div class="body">
            <div class="label">Total Wiraniaga</div>
            <div class="value" id="dashSalesCount">0</div>
            <div class="sub"><span class="pos" id="dashSalesActive">0 Aktif</span> &middot; <span class="neg"
                id="dashSalesInactive">0 Inaktif</span></div>
          </div>
        </div>
      </div>

      <!-- ===== TARGET & BRIEFING BANNER ===== -->
      <div class="spv-card" style="margin-bottom:18px; background: linear-gradient(135deg, #101828 0%, #1e293b 100%); color: white; border: none; box-shadow: 0 10px 25px rgba(16, 24, 40, 0.25);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div>
            <span style="background: rgba(255,255,255,0.15); color:#cbd5e1; font-size:11px; font-weight:800; padding:4px 10px; border-radius:20px; text-transform:uppercase; letter-spacing:0.5px;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color:#f59e0b;"></i> Smart SPV Assistant
            </span>
            <h3 style="font-size:20px; font-weight:800; color:white; margin:8px 0 4px;">Briefing Pagi & Broadcaster Tim Sales</h3>
            <p style="font-size:13px; color:#94a3b8; margin:0;">Generate rangkuman evaluasi tim otomatis dan bagikan ke WhatsApp tim sales dalam 1-klik.</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn" style="background:#25D366; color:white; font-weight:700; border:none; padding:10px 18px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="location.href='briefing_generator.html'">
              <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Briefing Auto-Gen
            </button>
            <button class="btn" style="background:rgba(255,255,255,0.12); color:white; font-weight:700; border:1px solid rgba(255,255,255,0.2); padding:10px 18px; border-radius:12px; display:inline-flex; align-items:center; gap:8px; cursor:pointer;" onclick="openDiscountCalcModal()">
              <i class="fa-solid fa-calculator"></i> Approval Diskon Desk
            </button>
          </div>
        </div>
      </div>

      <!-- ===== AREA OPERATION (AO) REPORT LIVE WIDGET ===== -->
      <div class="spv-card" style="margin-bottom:18px; background:#ffffff; border:1.5px solid #cbd5e1; border-radius:16px; padding:18px; box-shadow:0 4px 16px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:14px; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:40px; height:40px; border-radius:12px; background:#e0f2fe; color:#0369a1; display:flex; align-items:center; justify-content:center; font-size:18px;">
              <i class="fa-solid fa-chalkboard-user"></i>
            </div>
            <div>
              <h3 style="font-size:16px; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
                Papan Area Operation (AO) Report
                <span style="font-size:10.5px; background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:12px; font-weight:800; border:1px solid #bbf7d0;">
                  <i class="fa-solid fa-circle-check"></i> Matching 86%
                </span>
              </h3>
              <p style="font-size:12px; color:#64748b; margin:2px 0 0 0;">
                Pantauan ritme 5-harian SPK/DO, Matching Stock OS (42 Unit), dan Proyeksi Closing 104 Unit.
              </p>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <button class="btn btn-sm" onclick="location.href='ao_report_spv.html'" style="background:linear-gradient(135deg, #1e293b, #0f172a); color:white; font-weight:800; font-size:12px; padding:8px 14px; border-radius:10px; border:none; display:inline-flex; align-items:center; gap:6px; cursor:pointer; box-shadow:0 3px 10px rgba(15,23,42,0.2);">
              <i class="fa-solid fa-expand"></i> Buka Papan AO Report SPV
            </button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap:12px; text-align:center;">
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">Full Stock Cabang</div>
            <div style="font-size:20px; font-weight:900; color:#0f172a; margin:2px 0;">124</div>
            <div style="font-size:10px; font-weight:700; color:#0369a1;">Free: 82 | Match: 42</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">OS Order &lt;30d</div>
            <div style="font-size:20px; font-weight:900; color:#2563eb; margin:2px 0;">48</div>
            <div style="font-size:10px; font-weight:700; color:#1d4ed8;">Firmed: 18 | Match: 30</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">SPK Gross Actual</div>
            <div style="font-size:20px; font-weight:900; color:#d97706; margin:2px 0;">54</div>
            <div style="font-size:10px; font-weight:700; color:#b45309;">Ritme: +14 Gap Positif</div>
          </div>
          <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px;">
            <div style="font-size:11px; font-weight:700; color:#64748b;">DO Target Cabang</div>
            <div style="font-size:20px; font-weight:900; color:#059669; margin:2px 0;">92</div>
            <div style="font-size:10px; font-weight:700; color:#047857;">Potensi fr OS: 52</div>
          </div>
          <div style="background:linear-gradient(135deg, #fef3c7, #fde68a); border:1.5px solid #f59e0b; border-radius:12px; padding:10px;">
            <div style="font-size:11px; font-weight:800; color:#92400e;">Est. Closing Bulan</div>
            <div style="font-size:22px; font-weight:900; color:#78350f; margin:2px 0;">104</div>
            <div style="font-size:10px; font-weight:800; color:#b45309;">+12 Over Target 🎉</div>
          </div>
        </div>
      </div>

      <!-- ===== TARGET & AKSES CEPAT ===== -->
      <div class="grid-2" style="margin-bottom:18px;">
        <section class="spv-card" style="animation-delay:0.14s;">
          <h3 class="card-label">Target &amp; Pencapaian Tim</h3>

          <div class="meter">
            <div class="meter-head">
              <span class="meter-title"><i class="fa-solid fa-file-signature"></i> SPK Bulan Ini</span>
              <span class="meter-value" id="dashSpkStatus">0 / 0 unit</span>
            </div>
            <div class="track blue">
              <div class="fill" id="spkProgress"></div>
            </div>
          </div>

          <div class="meter">
            <div class="meter-head">
              <span class="meter-title"><i class="fa-solid fa-truck-fast"></i> DO per Evaluasi (4 Bulan)</span>
              <span class="meter-value" id="dashDoStatus">0 / 0 unit</span>
            </div>
            <div class="track red">
              <div class="fill" id="doProgress"></div>
            </div>
          </div>

          <div
            style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap; margin-top:18px; padding-top:14px; border-top:1px solid var(--border);">
            <span style="font-size:12px; color:var(--muted); font-weight:600;" id="dashSisaPesan"></span>
            <span class="badge badge-approved" id="dashPersenSummary">SPK: 0% | DO: 0%</span>
          </div>
        </section>

        <section class="spv-card" style="animation-delay:0.18s;">
          <h3 class="card-label">Akses Cepat & Tools SPV</h3>
          <div class="quick-access-grid" style="grid-template-columns:1fr 1fr;">
            <button class="quick-access-btn btn-qa-wira" onclick="location.href='wiraniaga.html'">
              <i class="fa-solid fa-users"></i> Tim Wiraniaga
            </button>
            <button class="quick-access-btn btn-qa-appr" onclick="location.href='approval.html'">
              <i class="fa-solid fa-check-to-slot"></i> Approval SPK
              <span class="qa-badge" id="quickApprovalBadge">0</span>
            </button>
            <button class="quick-access-btn btn-qa-targ" onclick="location.href='target.html'">
              <i class="fa-solid fa-trophy"></i> Sales Race Tim
            </button>
            <button class="quick-access-btn btn-qa-acti" onclick="location.href='aktivitas.html'">
              <i class="fa-solid fa-list-check"></i> Aktivitas Sales
            </button>
          </div>
        </section>
      </div>

      <!-- ===== 1. EARLY WARNING CHECKLIST SPV (0% TERLEWAT) ===== -->
      <div class="spv-card" style="margin-bottom:18px; border-left: 5px solid #e11d48; background:#fff1f2; animation-delay:0.1s;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:12px;">
          <div>
            <h3 style="font-size:16px; font-weight:800; color:#9f1239; margin:0 0 2px; display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-bell" style="color:#e11d48; animation: swing 2s infinite;"></i> 
              Early Warning Checklist &amp; Tugas SPV Hari Ini
            </h3>
            <p style="font-size:12px; color:#be123c; margin:0;">Pastikan tidak ada janji temu, penyerahan unit, atau follow-up sales yang terlewat hari ini.</p>
          </div>
          <button class="btn" style="background:#e11d48; color:white; font-size:11px; font-weight:800; border:none; padding:6px 14px; border-radius:8px; cursor:pointer;" onclick="loadEarlyWarningChecklist()">
            <i class="fa-solid fa-rotate-right"></i> Refresh Warning
          </button>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px;" id="earlyWarningContainer">
          <!-- Rendered dynamically by JS -->
        </div>
      </div>

      <!-- ===== 2. VISUAL PIPELINE FUNNEL (LEADS ➔ DO) ===== -->
      <div class="spv-card" style="margin-bottom:18px; animation-delay:0.12s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 class="card-label" style="margin:0;"><i class="fa-solid fa-filter-circle-dollar" style="color:#2563eb;"></i> Monitoring Pipeline Funnel Tim Sales</h3>
          <span style="font-size:11px; font-weight:700; color:var(--muted);">Progres Tahapan Prospek</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:10px; text-align:center;" id="pipelineFunnelContainer">
          <div style="background:#eff6ff; border:1px solid #bfdbfe; padding:12px; border-radius:12px;">
            <div style="font-size:11px; font-weight:800; color:#1e40af; text-transform:uppercase;">1. Prospecting</div>
            <div style="font-size:22px; font-weight:900; color:#1d4ed8; margin:4px 0;" id="funnelProspect">0</div>
            <div style="font-size:10px; color:#3b82f6;">Calon Konsumen</div>
          </div>
          <div style="background:#fef3c7; border:1px solid #fde68a; padding:12px; border-radius:12px;">
            <div style="font-size:11px; font-weight:800; color:#92400e; text-transform:uppercase;">2. Negosiasi</div>
            <div style="font-size:22px; font-weight:900; color:#b45309; margin:4px 0;" id="funnelNego">0</div>
            <div style="font-size:10px; color:#d97706;">Penawaran / Hitungan</div>
          </div>
          <div style="background:#dcfce7; border:1px solid #bbf7d0; padding:12px; border-radius:12px;">
            <div style="font-size:11px; font-weight:800; color:#166534; text-transform:uppercase;">3. SPK Deal</div>
            <div style="font-size:22px; font-weight:900; color:#15803d; margin:4px 0;" id="funnelSpk">0</div>
            <div style="font-size:10px; color:#16a34a;">Tanda Jadi & Credit</div>
          </div>
          <div style="background:#f3e8ff; border:1px solid #e9d5ff; padding:12px; border-radius:12px;">
            <div style="font-size:11px; font-weight:800; color:#6b21a8; text-transform:uppercase;">4. Delivery (DO)</div>
            <div style="font-size:22px; font-weight:900; color:#7e22ce; margin:4px 0;" id="funnelDo">0</div>
            <div style="font-size:10px; color:#9333ea;">Serah Terima Unit</div>
          </div>
        </div>
      </div>

      <!-- ===== 3. DAILY ACTIVITY TRACKER WIRANIAGA ===== -->
      <div class="spv-card" style="margin-bottom:18px; animation-delay:0.14s;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <h3 class="card-label" style="margin:0;"><i class="fa-solid fa-list-check" style="color:#059669;"></i> Daily Activity Tracker &amp; Input Warning Sales</h3>
            <p style="font-size:11px; color:#64748b; margin:2px 0 0;">Monitoring aktivitas harian (Call, Visit, Test Drive, Canvas). Beri teguran instant jika sales belum menginput aktivitas.</p>
          </div>
          <button class="btn" style="background:#eff6ff; color:#2563eb; font-size:11px; font-weight:700; border:1px solid #bfdbfe; padding:6px 12px; border-radius:8px; cursor:pointer;" onclick="openNudgeModal()">
            <i class="fa-solid fa-paper-plane"></i> Kirim Catatan WA Sales
          </button>
        </div>

        <div id="activityTrackerContainer">
          <!-- Rendered dynamically by JS -->
        </div>
      </div>

      <!-- ===== BARIS BARU: SALES RACE LEADERBOARD & RADAR PROSPEK MACET ===== -->
      <div class="grid-2" style="margin-bottom:18px;">

        <!-- 🏆 LEADERBOARD TIM SALES RACE -->
        <section class="spv-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-label" style="margin:0;"><i class="fa-solid fa-trophy" style="color:#d97706;"></i> Leaderboard & Sales Race</h3>
            <span style="font-size:11px; font-weight:700; color:var(--muted);">Bulan Ini</span>
          </div>

          <div id="spvLeaderboardContainer">
            <!-- Rendered dynamically by JS -->
          </div>
        </section>

        <!-- ⚠️ RADAR PROSPEK MACET (CO-CLOSING ALERT) -->
        <section class="spv-card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
            <h3 class="card-label" style="margin:0;"><i class="fa-solid fa-triangle-exclamation" style="color:#dc2626;"></i> Radar Prospek Macet (>7 Hari)</h3>
            <span class="badge" style="background:#fee2e2; color:#b91c1c; font-weight:800;" id="stagnantCountBadge">0 Perlu Dampingan</span>
          </div>

          <div id="stagnantLeadsContainer">
            <!-- Rendered dynamically by JS -->
          </div>
        </section>

      </div>
    </main>
  </div>

  <!-- ===== MODAL 1: AUTO-BRIEFING GENERATOR ===== -->
  <div class="modal-overlay" id="briefingModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:550px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-brands fa-whatsapp" style="color:#25D366;"></i> Auto-Briefing Generator SPV</h3>
        <button onclick="closeBriefingModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>
      
      <p style="font-size:12px; color:#64748b; margin-bottom:12px;">Pesan briefing otomatis yang sudah dirangkum berdasarkan aktivitas dan pencapaian tim SPV Anda saat ini:</p>
      
      <textarea id="briefingTextarea" rows="12" style="width:100%; border:1.5px solid #cbd5e1; border-radius:12px; padding:14px; font-family:monospace; font-size:12px; color:#334155; line-height:1.5; background:#f8fafc; resize:vertical;"></textarea>

      <div style="display:flex; gap:10px; margin-top:16px; justify-content:flex-end; flex-wrap:wrap;">
        <button class="btn" style="background:#e2e8f0; color:#334155; font-weight:700; border:none; padding:10px 16px; border-radius:10px; cursor:pointer;" onclick="copyBriefingText()">
          <i class="fa-solid fa-copy"></i> Salin Teks
        </button>
        <button class="btn" style="background:#25D366; color:white; font-weight:700; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="sendBriefingWA()">
          <i class="fa-brands fa-whatsapp"></i> Broadcast ke WA Tim
        </button>
      </div>
    </div>
  </div>

  <!-- ===== MODAL 2: DISKON & PLAFOND APPROVAL DESK ===== -->
  <div class="modal-overlay" id="discountCalcModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:520px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-solid fa-calculator" style="color:#2563eb;"></i> Diskon & Plafond Approval Desk</h3>
        <button onclick="closeDiscountCalcModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Model Kendaraan</label>
          <select id="calcModelSelect" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600;" onchange="updateDiscountSim()">
            <option value="avanza">Toyota Avanza (Plafond Max SPV: Rp 15.000.000)</option>
            <option value="veloz">Toyota Veloz (Plafond Max SPV: Rp 18.000.000)</option>
            <option value="zenix">Innova Zenix (Plafond Max SPV: Rp 22.000.000)</option>
            <option value="fortuner">Fortuner VRZ (Plafond Max SPV: Rp 30.000.000)</option>
            <option value="yaris_cross">Yaris Cross (Plafond Max SPV: Rp 20.000.000)</option>
          </select>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Nominal Diskon Diajukan Sales (Rp)</label>
          <input type="number" id="calcDiscountInput" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:700; font-size:16px;" placeholder="Contoh: 12000000" value="12000000" oninput="updateDiscountSim()">
        </div>

        <div id="simResultCard" style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:12px; padding:14px; margin-top:6px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="font-size:12px; color:#166534; font-weight:700;">Status Margin:</span>
            <span id="simStatusBadge" style="font-size:11px; font-weight:800; padding:2px 8px; border-radius:6px; background:#dcfce7; color:#15803d;">Disetujui SPV</span>
          </div>
          <div style="font-size:20px; font-weight:900; color:#15803d; margin-bottom:4px;" id="simProfitText">Profit Margin Retention: OK</div>
          <p style="font-size:11px; color:#166534; margin:0;" id="simDescText">Diskon diajukan masih berada di bawah limit toleransi SPV.</p>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px; justify-content:flex-end;">
        <button class="btn" style="background:#e2e8f0; color:#334155; font-weight:700; border:none; padding:10px 16px; border-radius:10px; cursor:pointer;" onclick="closeDiscountCalcModal()">Tutup</button>
        <button class="btn" style="background:#059669; color:white; font-weight:700; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="approveSimDiscount()">
          <i class="fa-solid fa-check-circle"></i> Approve Diskon Ini
        </button>
      </div>
    </div>
  </div>

  <!-- ===== MODAL 3: DIRECT WA NUDGE & ASSIGNMENT DESK ===== -->
  <div class="modal-overlay" id="nudgeModal" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:99999; align-items:center; justify-content:center;">
    <div style="background:white; border-radius:20px; max-width:520px; width:90%; padding:24px; box-shadow:0 20px 40px rgba(0,0,0,0.2); max-height:90vh; overflow-y:auto;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; border-bottom:1px solid #e2e8f0; padding-bottom:12px;">
        <h3 style="font-size:18px; font-weight:800; color:#0f172a; margin:0;"><i class="fa-brands fa-whatsapp" style="color:#25D366;"></i> Direct WA Nudge &amp; Assignment Desk</h3>
        <button onclick="closeNudgeModal()" style="background:none; border:none; font-size:20px; cursor:pointer; color:#64748b;">&times;</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:12px;">
        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Wiraniaga Target</label>
          <select id="nudgeSalesSelect" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600;">
            <!-- Populated dynamically by JS -->
          </select>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Pilih Template Instruksi SPV</label>
          <select id="nudgeTemplateSelect" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600;" onchange="applyNudgeTemplate()">
            <option value="activity_warning">Teguran Input Aktivitas Harian</option>
            <option value="followup_prospect">Instruksi Follow-Up Prospek Tertunda</option>
            <option value="spk_target">Pendorong Target SPK Pekan Ini</option>
            <option value="custom">Tulis Pesan Instruksi Kustom</option>
          </select>
        </div>

        <div>
          <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:4px;">Isi Pesan Instruksi WA</label>
          <textarea id="nudgeTextarea" rows="6" style="width:100%; border:1.5px solid #cbd5e1; border-radius:12px; padding:12px; font-size:12.5px; color:#334155; line-height:1.5; background:#f8fafc; resize:vertical;"></textarea>
        </div>
      </div>

      <div style="display:flex; gap:10px; margin-top:20px; justify-content:flex-end;">
        <button class="btn" style="background:#e2e8f0; color:#334155; font-weight:700; border:none; padding:10px 16px; border-radius:10px; cursor:pointer;" onclick="closeNudgeModal()">Tutup</button>
        <button class="btn" style="background:#25D366; color:white; font-weight:700; border:none; padding:10px 20px; border-radius:10px; cursor:pointer;" onclick="sendNudgeWA()">
          <i class="fa-brands fa-whatsapp"></i> Kirim Ke WhatsApp Sales
        </button>
      </div>
    </div>
  </div>
    </main>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/spv_index.js?v=20260819_master"></script>

  <script src="../js/pwa-app.js?v=3"></script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
