<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SPV Briefing &amp; Evening Recap Generator - Tunas Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/style_spv.css">

  <style>
    .brief-layout {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 20px;
      align-items: start;
    }

    @media (max-width: 950px) {
      .brief-layout {
        grid-template-columns: 1fr;
      }
    }

    .spv-card-modern {
      background: #ffffff;
      border-radius: 20px;
      padding: 22px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }

    .mode-tab-bar {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 14px;
      gap: 4px;
      margin-bottom: 20px;
    }

    .mode-tab-btn {
      flex: 1;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      background: transparent;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .mode-tab-btn.active {
      background: #0d1b3e;
      color: white;
      box-shadow: 0 4px 12px rgba(13, 27, 62, 0.15);
    }

    .styled-input {
      width: 100%;
      padding: 10px 14px;
      border: 1.5px solid #cbd5e1;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      color: #0f172a;
      background: #f8fafc;
      outline: none;
      box-sizing: border-box;
      transition: all 0.2s;
      margin-bottom: 12px;
    }

    .styled-input:focus {
      border-color: #0d1b3e;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(13, 27, 62, 0.12);
    }

    .form-label {
      font-size: 11.5px;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      margin-bottom: 4px;
      display: block;
    }

    .wa-preview-box {
      background: #efeae2;
      border-radius: 18px;
      padding: 18px;
      border: 1px solid #cbd5e1;
      box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.06);
    }

    .wa-bubble-spv {
      background: #d9fdd3;
      border-radius: 14px 14px 0 14px;
      padding: 16px 18px;
      font-size: 13px;
      color: #111b21;
      line-height: 1.6;
      font-family: inherit;
      white-space: pre-wrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
        <a href="briefing_generator.html" id="navBriefing" class="active"><i class="fa-solid fa-wand-magic-sparkles"></i>Briefing Auto-Gen</a>
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

    <!-- MAIN CONTENT -->
    <main class="spv-main">
      <div class="spv-topbar">
        <div>
          <h2 style="font-family:'Outfit',sans-serif; font-size:22px; font-weight:800; margin:0;">1-Click Briefing &amp; Evening Recap Generator</h2>
          <p class="page-sub">Otomatisasi pembuatan teks briefing pagi &amp; rekap evaluasi sore tim sales untuk WhatsApp.</p>
        </div>
      </div>

      <!-- MODE SELECTION -->
      <div class="mode-tab-bar">
        <button class="mode-tab-btn active" id="btnModeMorning" onclick="switchBriefingMode('morning')">
          <i class="fa-solid fa-sun"></i> Morning Huddle &amp; Target Kickoff (Pagi)
        </button>
        <button class="mode-tab-btn" id="btnModeEvening" onclick="switchBriefingMode('evening')">
          <i class="fa-solid fa-moon"></i> Evening Closing &amp; Wrap-Up (Sore)
        </button>
      </div>

      <div class="brief-layout">
        
        <!-- LEFT: INPUT BUILDER -->
        <div class="spv-card-modern">
          <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; color:#0f172a; margin:0 0 14px;" id="panelTitle">
            Parameter Briefing Pagi
          </h3>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label class="form-label">Target SPK Tim</label>
              <input type="number" id="inTargetSpk" class="styled-input" value="45" oninput="generateBriefingText()">
            </div>
            <div>
              <label class="form-label">Pencapaian SPK (Saat Ini)</label>
              <input type="number" id="inRealisasiSpk" class="styled-input" value="28" oninput="generateBriefingText()">
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div>
              <label class="form-label">Target DO Kirim</label>
              <input type="number" id="inTargetDo" class="styled-input" value="38" oninput="generateBriefingText()">
            </div>
            <div>
              <label class="form-label">Realisasi DO (Saat Ini)</label>
              <input type="number" id="inRealisasiDo" class="styled-input" value="22" oninput="generateBriefingText()">
            </div>
          </div>

          <label class="form-label">Fokus Aktivitas Utama Hari Ini</label>
          <input type="text" id="inFokusAktivitas" class="styled-input" value="Pameran TSM Bandung &amp; Canvassing Residensial Buahbatu" oninput="generateBriefingText()">

          <label class="form-label">Target Minimum Harian per Wiraniaga</label>
          <input type="text" id="inTargetHarian" class="styled-input" value="Min. 3 Input Aktivitas GPS + 5 Follow up Hot Lead" oninput="generateBriefingText()">

          <div id="eveningExtraBox" style="display:none;">
            <label class="form-label">SPK Masuk Hari Ini (Unit &amp; Wiraniaga)</label>
            <input type="text" id="inSpkToday" class="styled-input" value="2 SPK (Indra: Zenix V Hybrid, Rina: Calya G)" oninput="generateBriefingText()">

            <label class="form-label">Sales of The Day / Top Performer</label>
            <input type="text" id="inTopSales" class="styled-input" value="Indra Gunawan (1 SPK Zenix + 4 Kunjungan FOA)" oninput="generateBriefingText()">
          </div>

          <label class="form-label">Pesan Motivasi &amp; Spirit</label>
          <select id="inMotivasi" class="styled-input" onchange="generateBriefingText()">
            <option value="1">"Kaizen: Tiada hari tanpa peningkatan. Jemput bola dan raih closing hari ini!"</option>
            <option value="2">"Konsumen tidak membeli mobil, konsumen membeli solusi dan pelayanan terbaik dari Anda."</option>
            <option value="3">"Fokus pada proses follow-up yang disiplin, hasil SPK dan DO akan mengikuti dengan sendirinya."</option>
          </select>
        </div>

        <!-- RIGHT: LIVE WHATSAPP PREVIEW -->
        <div>
          <div class="spv-card-modern">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
              <h3 style="font-family:'Outfit',sans-serif; font-size:16px; font-weight:800; color:#0f172a; margin:0;">
                <i class="fa-brands fa-whatsapp" style="color:#25D366;"></i> WhatsApp Ready Message Preview
              </h3>
              <span style="font-size:11px; font-weight:700; background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:20px;">1-Click Ready</span>
            </div>

            <div class="wa-preview-box">
              <div class="wa-bubble-spv" id="waMessagePreview">
                Memuat pesan briefing...
              </div>
            </div>

            <div style="display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;">
              <button class="btn" style="flex:1; background:#0d1b3e; color:white; font-weight:700; padding:12px; border-radius:12px; border:none; cursor:pointer;" onclick="copyBriefingToClipboard()">
                <i class="fa-solid fa-copy"></i> Salin Teks
              </button>
              <button class="btn" style="flex:1.5; background:#25D366; color:white; font-weight:800; padding:12px; border-radius:12px; border:none; cursor:pointer; box-shadow:0 4px 12px rgba(37,211,102,0.3);" onclick="sendToWaGroup()">
                <i class="fa-brands fa-whatsapp"></i> Kirim ke Grup Sales
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script>
    let currentMode = 'morning';

    function switchBriefingMode(mode) {
      currentMode = mode;
      document.getElementById('btnModeMorning').classList.toggle('active', mode === 'morning');
      document.getElementById('btnModeEvening').classList.toggle('active', mode === 'evening');
      
      const extraBox = document.getElementById('eveningExtraBox');
      const panelTitle = document.getElementById('panelTitle');

      if (mode === 'evening') {
        extraBox.style.display = 'block';
        panelTitle.innerText = 'Parameter Rekap Sore & Closing';
      } else {
        extraBox.style.display = 'none';
        panelTitle.innerText = 'Parameter Briefing Pagi';
      }

      generateBriefingText();
    }

    function generateBriefingText() {
      const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const targetSpk = document.getElementById('inTargetSpk').value;
      const realSpk = document.getElementById('inRealisasiSpk').value;
      const targetDo = document.getElementById('inTargetDo').value;
      const realDo = document.getElementById('inRealisasiDo').value;
      const fokus = document.getElementById('inFokusAktivitas').value;
      const targetHarian = document.getElementById('inTargetHarian').value;
      const motivasi = document.getElementById('inMotivasi').options[document.getElementById('inMotivasi').selectedIndex].text;

      let msg = '';

      if (currentMode === 'morning') {
        const pctSpk = Math.round((realSpk / targetSpk) * 100) || 0;
        const pctDo = Math.round((realDo / targetDo) * 100) || 0;

        msg = `🌅 *MORNING HUDDLE & TARGET KICKOFF* 🌅\n*TUNAS TOYOTA KIARA CONDONG*\n📅 ${today}\n\nSemangat Pagi Tim Sales Juara! 🔥\nMari kita mulai hari ini dengan energi positif dan fokus pencapaian target cabang:\n\n📊 *STATUS TARGET TIM BULAN BERJALAN:*
• SPK : *${realSpk} / ${targetSpk} Unit* (${pctSpk}%)
• DO  : *${realDo} / ${targetDo} Unit* (${pctDo}%)
• Sisa Hari Kerja : *${Math.max(1, 30 - new Date().getDate())} Hari*

🎯 *FOKUS STRATEGI HARI INI:*
• Kegiatan : *${fokus}*
• Target Harian : *${targetHarian}*
• Segera follow-up seluruh prospek SPK pending dan janji test drive!

💡 *QUOTE OF THE DAY:*
${motivasi}

_Mari berikan pelayanan terbaik dan closing sebanyak-banyaknya hari ini! Toyota Let's Go Beyond!_ 🚀🚗`;
      } else {
        const spkToday = document.getElementById('inSpkToday').value;
        const topSales = document.getElementById('inTopSales').value;

        msg = `🌆 *EVENING CLOSING & RECAP EVALUATION* 🌆\n*TUNAS TOYOTA KIARA CONDONG*\n📅 ${today}\n\nSelamat malam rekan-rekan wiraniaga hebat! 👏\nBerikut adalah rangkuman pencapaian aktivitas dan penjualan tim hari ini:\n\n🎉 *SPK MASUK HARI INI:*
• Total: *${spkToday}*

🏆 *SALES OF THE DAY:*
• *${topSales}* (Terima kasih atas kerja keras dan dedikasinya!)

📈 *AKUMULASI PENCAPAIAN CABANG:*
• Total SPK : *${realSpk} Unit*
• Total DO  : *${realDo} Unit*

📌 *EVALUASI & TINDAK LANJUT BESOK:*
1. Pastikan seluruh aktivitas lapangan hari ini telah di-submit lengkap dengan foto GPS di Sales App.
2. Segera susun daftar jadwal kunjungan & follow up untuk esok pagi.
3. Tetap jaga semangat & optimisme menuju closing target akhir bulan!

_Terima kasih atas perjuangan hari ini. Selamat beristirahat bersama keluarga tercinta!_ 🌟`;
      }

      document.getElementById('waMessagePreview').innerText = msg;
    }

    function copyBriefingToClipboard() {
      const text = document.getElementById('waMessagePreview').innerText;
      navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'Teks Disalin!',
          text: 'Pesan briefing berhasil disalin dan siap dikirim ke WhatsApp.',
          timer: 1500,
          showConfirmButton: false
        });
      });
    }

    function sendToWaGroup() {
      const text = document.getElementById('waMessagePreview').innerText;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }

    // Auto fetch live SPK & DO stats from database
    fetch('../api/api_spk.php?all=true')
      .then(r => r.json())
      .then(res => {
        if (res.status === 'success' && res.data && res.data.length > 0) {
          const totalSpk = res.data.length;
          const totalDo = res.data.filter(s => s.status === 'DO').length;
          document.getElementById('inRealisasiSpk').value = totalSpk;
          document.getElementById('inRealisasiDo').value = totalDo;

          // Find top sales
          const salesCounts = {};
          res.data.forEach(s => {
            const sName = s.nama_sales || 'Indra Gunawan';
            salesCounts[sName] = (salesCounts[sName] || 0) + 1;
          });
          const sorted = Object.entries(salesCounts).sort((a, b) => b[1] - a[1]);
          if (sorted.length > 0) {
            document.getElementById('inTopSales').value = `${sorted[0][0]} (${sorted[0][1]} Unit)`;
          }
          generateBriefingText();
        }
      })
      .catch(err => console.log('Live briefing fetch error:', err));

    // Initialize
    generateBriefingText();
  </script>
  <script src="../js/spv_global.js"></script>
</body>

</html>
