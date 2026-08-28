<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Canvassing &amp; Area Penetration Heatmap - Tunas Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <link rel="stylesheet" href="../css/style_spv.css">

  <style>
    .heatmap-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 20px;
      height: calc(100vh - 180px);
      min-height: 540px;
    }

    @media (max-width: 992px) {
      .heatmap-layout {
        grid-template-columns: 1fr;
        height: auto;
      }
      #canvassMap {
        height: 420px !important;
      }
    }

    .map-container-box {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      position: relative;
    }

    #canvassMap {
      width: 100%;
      height: 100%;
      z-index: 1;
    }

    .floating-layer-bar {
      position: absolute;
      top: 14px;
      left: 14px;
      z-index: 500;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(10px);
      border-radius: 12px;
      padding: 6px 12px;
      border: 1px solid rgba(226, 232, 240, 0.8);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .layer-badge {
      font-size: 11px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 8px;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }

    .layer-red { background: #fee2e2; color: #b91c1c; }
    .layer-gold { background: #fef3c7; color: #b45309; }
    .layer-blue { background: #dbeafe; color: #1d4ed8; }

    .zone-info-card {
      background: #ffffff;
      border-radius: 20px;
      padding: 20px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
      overflow-y: auto;
      max-height: calc(100vh - 180px);
    }
  </style>
</head>

<body>
  <div class="spv-shell">

    <!-- SIDEBAR SPV -->
    <aside class="spv-sidebar">
      <div class="spv-brand-container">
        <div class="spv-brand-logo">
          <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png" alt="Tunas Toyota Logo" class="tunas-logo">
        </div>
        <div class="spv-brand-title">
          <span class="panel-tag"><i class="fa-solid fa-user-tie"></i> SPV PANEL</span>
          <p class="panel-sub">Desktop Supervisor</p>
        </div>
      </div>

      <nav class="spv-nav">
        <a href="index_spv.html" id="navDash"><i class="fa-solid fa-gauge"></i>Dashboard</a>
        <a href="followup_database.html" id="navFollowup"><i class="fa-solid fa-bullhorn"></i>Database Follow-Up</a>
        <a href="ao_report_spv.html" id="navAO"><i class="fa-solid fa-chalkboard-user"></i>AO Report Cabang</a>
        <a href="target.html" id="navTarget"><i class="fa-solid fa-bullseye"></i>Target</a>
        <a href="wiraniaga.html" id="navWiraniaga"><i class="fa-solid fa-users"></i>Wiraniaga</a>
        <a href="approval.html" id="navApproval"><i class="fa-solid fa-check-to-slot"></i>Approval<span class="nav-badge" id="navApprovalBadge" style="display:none;">0</span></a>
        <a href="aktivitas.html" id="navAktivitas"><i class="fa-solid fa-list-check"></i>Aktivitas<span class="nav-badge nav-badge-blue" id="navAktivitasBadge" style="display:none;">0</span></a>
        <a href="briefing_generator.html" id="navBriefing"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
        <a href="peta_canvassing.html" id="navCanvassing" class="active"><i class="fa-solid fa-map-location-dot"></i>Canvassing Heatmap</a>
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

    <!-- MAIN CONTENT -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 style="font-family:'Outfit',sans-serif; font-size:22px; font-weight:800; margin:0;">Area Penetrasi &amp; Canvassing Heatmap</h2>
          <p class="page-sub">Rekomendasi titik prospek potensial &amp; strategi penyebaran tim sales di wilayah Bandung.</p>
        </div>
      </div>

      <div class="heatmap-layout">

        <!-- LEFT: LEAFLET MAP -->
        <div class="map-container-box">
          <div class="floating-layer-bar">
            <span style="font-size:11px; font-weight:800; color:#475569; margin-right:4px;">Filter Zona:</span>
            <button class="layer-badge layer-red" onclick="filterMapZone('red')">🔴 Potensial Tinggi</button>
            <button class="layer-badge layer-gold" onclick="filterMapZone('gold')">🟡 Basis Kuat</button>
            <button class="layer-badge layer-blue" onclick="filterMapZone('blue')">🔵 Komersial/Fleet</button>
            <button class="layer-badge layer-red" onclick="filterMapZone('red')"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Potensial Tinggi</button>
            <button class="layer-badge layer-gold" onclick="filterMapZone('gold')"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Basis Kuat</button>
            <button class="layer-badge layer-blue" onclick="filterMapZone('blue')"><i class="fa-solid fa-circle" style="font-size:8px;"></i> Komersial/Fleet</button>
            <button class="layer-badge" style="background:#f1f5f9; color:#475569;" onclick="filterMapZone('all')">Semua</button>
          </div>
          <div id="canvassMap"></div>
        </div>

        <!-- RIGHT: DETAIL & STRATEGY PANEL -->
        <div class="zone-info-card" id="zoneDetailPanel">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <div>
              <span id="zoneBadge" style="font-size:10.5px; font-weight:800; background:#fee2e2; color:#b91c1c; padding:3px 10px; border-radius:20px; text-transform:uppercase;">
                🔴 Zona Prioritas Canvassing
                Zona Prioritas Canvassing
              </span>
              <h3 style="font-family:'Outfit',sans-serif; font-size:18px; font-weight:800; color:#0f172a; margin:8px 0 2px;" id="zoneTitle">
                Gedebage &amp; Summarecon
              </h3>
              <p style="font-size:12px; color:#64748b; margin:0;" id="zoneSub">Kecamatan Gedebage, Bandung Timur</p>
            </div>
          </div>

          <div style="background:#f8fafc; border-radius:14px; padding:14px; margin-bottom:16px; border:1px solid #e2e8f0;">
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; font-size:12px;">
              <div>
                <span style="color:#64748b; font-size:11px; font-weight:700;">Market Share Toyota:</span>
                <div style="font-weight:800; font-size:15px; color:#c8102e;" id="zoneShare">24.5% (Peluang Rebut Pasar)</div>
              </div>
              <div>
                <span style="color:#64748b; font-size:11px; font-weight:700;">Daya Beli Wilayah:</span>
                <div style="font-weight:800; font-size:15px; color:#0f172a;" id="zoneIncome">Tinggi (A - B)</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <strong style="font-size:12.5px; color:#0f172a; display:block; margin-bottom:6px;">
              <i class="fa-solid fa-car" style="color:#c8102e;"></i> Model Toyota Paling Diminati:
            </strong>
            <div style="display:flex; flex-wrap:wrap; gap:6px;" id="zoneModels">
              <span style="font-size:11.5px; background:#eff6ff; color:#1e40af; font-weight:700; padding:4px 8px; border-radius:6px;">Innova Zenix Hybrid</span>
              <span style="font-size:11.5px; background:#eff6ff; color:#1e40af; font-weight:700; padding:4px 8px; border-radius:6px;">Yaris Cross Hybrid</span>
              <span style="font-size:11.5px; background:#eff6ff; color:#1e40af; font-weight:700; padding:4px 8px; border-radius:6px;">Veloz Q TSS</span>
            </div>
          </div>

          <div style="margin-bottom:16px;">
            <strong style="font-size:12.5px; color:#0f172a; display:block; margin-bottom:6px;">
              <i class="fa-solid fa-location-crosshairs" style="color:#2563eb;"></i> Rekomendasi Titik Canvassing &amp; Pameran:
            </strong>
            <ul style="font-size:12px; color:#475569; padding-left:16px; line-height:1.6; margin:0;" id="zoneRecommendations">
              <li>Pameran Mini Weekend di Summarecon Mall Bandung (Lobby Timur).</li>
              <li>Canvassing door-to-door di Cluster Flora &amp; Emily Summarecon.</li>
              <li>Flyering pagi hari di sekitar stasiun Kereta Cepat Whoosh Tegalluar.</li>
            </ul>
          </div>

          <button class="btn" style="width:100%; background:#25D366; color:white; font-weight:800; padding:12px; border-radius:12px; border:none; cursor:pointer;" onclick="shareCanvassStrategyWa()">
            <i class="fa-brands fa-whatsapp"></i> Bagikan Tugas Canvassing ke Tim Sales
          </button>
        </div>

      </div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script>
    let zonesData = [];
    let map = null;
    let markers = [];
    let currentSelectedZone = null;

    async function initCanvassMap() {
      if (map) return;
      map = L.map('canvassMap').setView([-6.9380, 107.6550], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      // Fetch live zones from database
      try {
        const res = await fetch('../api/api_canvassing_zones.php');
        const json = await res.json();
        if (json.status === 'success' && json.data && json.data.length > 0) {
          zonesData = json.data;
        }
      } catch (err) {
        console.warn('Canvassing zones fetch error:', err);
      }

      if (zonesData.length > 0) {
        currentSelectedZone = zonesData[0];
        renderMarkers('all');
        selectZone(zonesData[0]);
      }

      setTimeout(() => {
        if (map) map.invalidateSize();
      }, 200);
    }

    function renderMarkers(filter) {
      markers.forEach(m => map.removeLayer(m));
      markers = [];

      zonesData.forEach(z => {
        if (filter !== 'all' && z.type !== filter) return;

        let color = '#ef4444';
        if (z.type === 'gold') color = '#f59e0b';
        if (z.type === 'blue') color = '#2563eb';

        const circleMarker = L.circleMarker([z.lat, z.lng], {
          radius: 20,
          fillColor: color,
          color: '#ffffff',
          weight: 3,
          opacity: 1,
          fillOpacity: 0.75
        }).addTo(map);

        circleMarker.bindPopup(`<strong>${z.name}</strong><br>${z.sub}<br>Market Share: <strong>${z.share}</strong>`);
        circleMarker.on('click', () => selectZone(z));

        markers.push(circleMarker);
      });
    }

    function selectZone(z) {
      currentSelectedZone = z;
      document.getElementById('zoneTitle').innerText = z.name;
      document.getElementById('zoneSub').innerText = z.sub;
      document.getElementById('zoneShare').innerText = z.share;
      document.getElementById('zoneIncome').innerText = z.income;

      const badge = document.getElementById('zoneBadge');
      if (z.type === 'red') {
        badge.innerText = '🔴 Zona Prioritas Canvassing';
        badge.innerText = 'Zona Prioritas Canvassing';
        badge.style.background = '#fee2e2';
        badge.style.color = '#b91c1c';
      } else if (z.type === 'gold') {
        badge.innerText = '🟡 Zona Basis Kuat Toyota';
        badge.innerText = 'Zona Basis Kuat Toyota';
        badge.style.background = '#fef3c7';
        badge.style.color = '#b45309';
      } else {
        badge.innerText = '🔵 Zona Komersial & Fleet';
        badge.innerText = 'Zona Komersial & Fleet';
        badge.style.background = '#dbeafe';
        badge.style.color = '#1d4ed8';
      }

      document.getElementById('zoneModels').innerHTML = (z.models || []).map(m => `<span style="font-size:11.5px; background:#eff6ff; color:#1e40af; font-weight:700; padding:4px 8px; border-radius:6px;">${m}</span>`).join('');
      document.getElementById('zoneRecommendations').innerHTML = (z.spots || []).map(s => `<li>${s}</li>`).join('');

      map.panTo([z.lat, z.lng]);
    }

    function filterMapZone(type) {
      renderMarkers(type);
    }

    function shareCanvassStrategyWa() {
      const z = currentSelectedZone;
      if (!z) return;
      const text = `🗺️ *STRATEGI PENUGASAN CANVASSING TIM SALES* 🗺️\nDealer: Tunas Toyota Kiara Condong\n\n📍 *Wilayah Target:* ${z.name} (${z.sub})\n📊 *Market Share Toyota:* ${z.share}\n🚗 *Fokus Unit Jualan:* ${(z.models || []).join(', ')}\n\n📌 *Rekomendasi Titik Lapangan:* \n${(z.spots || []).map((s, idx) => `${idx+1}. ${s}`).join('\n')}\n\nSemua wiraniaga yang ditugaskan wajib check-in GPS dan upload foto di Sales App saat tiba di lokasi. Semangat closing! 🔥`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    // Initialize on load
    window.addEventListener('load', initCanvassMap);
  </script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
