<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Desktop - Dashboard</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style_spv.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

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
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-bullhorn"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
        <a href="spv_coaching.html" id="navCoaching"><i class="fa-solid fa-chalkboard-user"></i>Coaching Radar</a>
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
          <h2 id="pageTitle">Dashboard SPV</h2>
        </div>
        <div class="spv-user">
          <img id="spvAvatar" src="" alt="Avatar">
          <div class="meta">
            <span class="name" id="spvNama">Memuat...</span>
            <span class="role" id="spvRole">Memuat...</span>
          </div>
        </div>
      </div>

      <div class="grid-2" style="margin-bottom:16px;">
        <section class="spv-card">
          <h3 style="margin:0 0 16px; font-size:13px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px;">Target DO Bulan Ini</h3>
          <div style="display:flex; gap:16px; align-items:flex-start; margin-bottom:14px;">
            <div style="flex:1;">
              <div style="font-size:32px; font-weight:900; color:var(--accent-blue); letter-spacing:-1px;" id="dashTarget">0</div>
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-top:2px;">Target</div>
            </div>
            <div style="flex:1;">
              <div style="font-size:32px; font-weight:900; color:var(--primary-green); letter-spacing:-1px;" id="dashRealisasi">0</div>
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-top:2px;">Realisasi</div>
            </div>
            <div style="flex:1;">
              <div style="font-size:32px; font-weight:900; color:var(--primary-red); letter-spacing:-1px;" id="dashSisa">0</div>
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-top:2px;">Sisa</div>
            </div>
          </div>
          <div class="progress-wrap">
            <div class="progress-fill green" id="targetProgress" style="width:0%;"></div>
          </div>
          <div style="display:flex; justify-content:between; margin-top:10px; align-items:center;">
            <span style="font-size:12px; color:var(--muted); font-weight:600;" id="dashPeriode">Memuat...</span>
            <span class="badge badge-approved" id="dashPersen">0%</span>
          </div>
        </section>

        <section class="spv-card">
          <h3 style="margin:0 0 16px; font-size:13px; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:0.5px;">Ringkasan</h3>
          <div class="grid-3" style="gap:10px;">
            <div style="background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center;">
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:6px;">Pending</div>
              <div style="font-size:24px; font-weight:900; color:var(--primary-yellow);" id="dashPending">0</div>
            </div>
            <div style="background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center;">
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:6px;">Aktivitas</div>
              <div style="font-size:24px; font-weight:900; color:var(--accent-blue);" id="dashAktif">0</div>
            </div>
            <div style="background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:12px; text-align:center;">
              <div style="font-size:11px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:6px;">Sales</div>
              <div style="font-size:24px; font-weight:900; color:var(--primary-green);">1</div>
            </div>
          </div>
          <p style="margin-top:12px; color:var(--muted); font-size:12px; font-weight:500; line-height:1.5;" id="dashSisaPesan"></p>
        </section>
      </div>

      <!-- ANALYTICS SECTION -->
      <section class="spv-card" style="margin-bottom:16px;">
        <div class="section-head">
          <h3>Statistik Penjualan (SPK Disetujui)</h3>
        </div>
        <div style="height: 250px;">
          <canvas id="spvChart"></canvas>
        </div>
      </section>

      <section class="spv-card">
        <div class="section-head">
          <h3>Akses Cepat</h3>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="location.href='approval.html'">
            <i class="fa-solid fa-check-to-slot"></i> Approval
          </button>
          <button class="btn btn-red" onclick="location.href='target.html'">
            <i class="fa-solid fa-bullseye"></i> Target
          </button>
          <button class="btn" onclick="location.href='aktivitas.html'">
            <i class="fa-solid fa-list-check"></i> Aktivitas
          </button>
        </div>
      </section>
    </main>
  </div>

  <script src="../js/spv_dashboard.js"></script>
  <script src="../js/pwa-app.js?v=3"></script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
