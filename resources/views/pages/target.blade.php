<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Target & Pencapaian</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/target.css">
  <script src="../js/sidebar_desktop.js"></script>

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Target & Pencapaian</h2>
    </header>

    <div class="container" style="margin-top:18px;">

      <!-- Tombol Input Pencapaian Baru -->
      <button class="btn-input-achievement" onclick="openInputModal()">
        <i class="fa-solid fa-circle-plus"></i> Input Pencapaian (SPK & DO)
      </button>

      <!-- ================= CARD UTAMA SPK ================= -->
      <div class="card target-card"
        style="padding:18px; margin-bottom:18px; border-left: 4px solid var(--accent-blue);">
        <div class="target-header"
          style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; color:var(--accent-blue); font-size:13px;"><i class="fa-solid fa-file-invoice"
              style="margin-right:6px;"></i>Target SPK Bulan Ini</span>
          <span class="target-period" id="detailPeriodeSpk"
            style="font-size:11px; color:var(--text-muted);">Memuat...</span>
        </div>

        <div class="target-body" style="display:flex; align-items:center; gap:16px;">
          <div class="progress-circle" id="circleProgressSpk" style="box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);">
            <span id="detailPersentaseSpk">0%</span>
          </div>
          <div class="target-text">
            <h3 style="margin-bottom:4px; font-size:18px; font-weight:800;"><span id="detailRealisasiSpk">0</span> <span
                class="target-total" style="font-size:13px; font-weight:600; color:var(--text-muted);">/ <span
                  id="detailTargetSpk">0</span> SPK</span></h3>
            <p id="detailSisaPesanSpk" style="font-size:11px; margin:0; color:var(--text-muted);">Memuat data target...
            </p>
          </div>
        </div>

        <div style="margin-top:12px; border-top:1px solid var(--border-color); padding-top:10px;">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">SPK Terkumpul</span>
              <span style="font-size:12px; color:var(--accent-blue); font-weight:800;" id="txtRealisasiSpk">0
                unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Target SPK</span>
              <span style="font-size:12px; color:var(--text-dark); font-weight:800;" id="txtTargetSpk">0 unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Sisa SPK</span>
              <span style="font-size:12px; color:var(--primary-red); font-weight:800;" id="txtSisaSpk">0 unit</span>
            </div>
          </div>
        </div>

        <!-- RENCANA SPK / PLAN UNIT -->
        <div style="margin-top:12px; border-top:1px dashed var(--border-color); padding-top:12px;">
          <label style="font-size:11px; font-weight:700; color:var(--accent-blue); display:block; margin-bottom:6px;"><i
              class="fa-solid fa-note-sticky"></i> PLAN SPK / RENCANA UNIT BULAN INI</label>
          <div style="display:flex; gap:8px;">
            <input type="text" id="inputPlanSpk" class="form-control"
              style="font-size:12px; border:2px solid #bfdbfe; border-radius:8px; padding: 6px 12px; width: 100%;"
              placeholder="Cth: Avanza / Veloz">
            <button class="btn btn-primary" onclick="savePlanSpk()"
              style="padding: 6px 14px; border-radius: 8px; font-size:12px; white-space: nowrap;"><i
                class="fa-solid fa-save"></i> Simpan</button>
          </div>
        </div>
      </div>

      <!-- ================= CARD DO BULAN INI ================= -->
      <div class="card target-card" style="padding:18px; margin-bottom:18px; border-left: 4px solid #059669;">
        <div class="target-header"
          style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; color:#059669; font-size:13px;"><i class="fa-solid fa-boxes-packing"
              style="margin-right:6px;"></i>Target DO Bulan Ini</span>
          <span class="target-period" id="detailPeriodeDoBulan"
            style="font-size:11px; color:var(--text-muted);">Memuat...</span>
        </div>

        <div class="target-body" style="display:flex; align-items:center; gap:16px;">
          <div class="progress-circle" id="circleProgressDoBulan"
            style="box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.15);">
            <span id="detailPersentaseDoBulan">0%</span>
          </div>
          <div class="target-text">
            <h3 style="margin-bottom:4px; font-size:18px; font-weight:800;"><span id="detailRealisasiDoBulan">0</span>
              <span class="target-total" style="font-size:13px; font-weight:600; color:var(--text-muted);">/ <span
                  id="detailTargetDoBulan">0</span> Unit</span>
            </h3>
            <p id="detailSisaPesanDoBulan" style="font-size:11px; margin:0; color:var(--text-muted);">Memuat data
              target...</p>
          </div>
        </div>

        <div style="margin-top:12px; border-top:1px solid var(--border-color); padding-top:10px;">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">DO Terkumpul (Bulan Ini)</span>
              <span style="font-size:12px; color:#059669; font-weight:800;" id="txtRealisasiDoBulan">0 unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Target DO Bulan Ini</span>
              <span style="font-size:12px; color:var(--text-dark); font-weight:800;" id="txtTargetDoBulan">0 unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Sisa DO Bulan Ini</span>
              <span style="font-size:12px; color:var(--primary-red); font-weight:800;" id="txtSisaDoBulan">0 unit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= CARD UTAMA DO EVALUASI ================= -->
      <div class="card target-card"
        style="padding:18px; margin-bottom:18px; border-left: 4px solid var(--green-success);">
        <div class="target-header"
          style="margin-bottom:10px; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-weight:800; color:var(--green-success); font-size:13px;"><i
              class="fa-solid fa-truck-ramp-box" style="margin-right:6px;"></i>Target DO (Per Evaluasi 4 Bulan)</span>
          <span class="target-period" id="detailPeriodeDo"
            style="font-size:11px; color:var(--text-muted);">Memuat...</span>
        </div>

        <div class="target-body" style="display:flex; align-items:center; gap:16px;">
          <div class="progress-circle" id="circleProgressDo" style="box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);">
            <span id="detailPersentaseDo">0%</span>
          </div>
          <div class="target-text">
            <h3 style="margin-bottom:4px; font-size:18px; font-weight:800;"><span id="detailRealisasiDo">0</span> <span
                class="target-total" style="font-size:13px; font-weight:600; color:var(--text-muted);">/ <span
                  id="detailTargetDo">0</span> Unit</span></h3>
            <p id="detailSisaPesanDo" style="font-size:11px; margin:0; color:var(--text-muted);">Memuat data target...
            </p>
          </div>
        </div>

        <div style="margin-top:12px; border-top:1px solid var(--border-color); padding-top:10px;">
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">DO Terkumpul</span>
              <span style="font-size:12px; color:var(--green-success); font-weight:800;" id="txtRealisasiDo">0
                unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Target DO</span>
              <span style="font-size:12px; color:var(--text-dark); font-weight:800;" id="txtTargetDo">0 unit</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; color:var(--text-muted); font-weight:600;">Sisa DO</span>
              <span style="font-size:12px; color:var(--primary-red); font-weight:800;" id="txtSisaDo">0 unit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= CARD PROGRESS BULANAN ================= -->
      <div class="card" style="padding:0;">
        <div style="padding:14px 18px;border-bottom:1px solid var(--border-color);">
          <div class="section-title" style="margin:0;font-size:14px;">Progress 4 Bulan Terakhir</div>
        </div>

        <!-- Wadah untuk menampung elemen bulanan yang digenerate dari JS -->
        <div style="padding:14px 18px;display:flex;flex-direction:column;gap:12px;" id="mingguanContainer">
          <p style="font-size:12px; text-align:center; color:var(--text-muted);">Memuat rincian bulanan dari database...
          </p>
        </div>
      </div>

      <!-- ================= MATRIX TARGET VS ACTUAL SPM BY ACTIVITY ================= -->
      <div class="card" style="padding:18px; margin-bottom:20px; background:#ffffff; border-radius:18px; border:1px solid var(--border-color); box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:14px; margin:0; font-weight:800; color:var(--primary-blue);">
            <i class="fa-solid fa-chart-pie" style="color:var(--primary-red); margin-right:6px;"></i>SPM Target vs Actual (by Activity)
          </h3>
          <span style="font-size:11px; font-weight:800; background:rgba(215,18,58,0.08); color:var(--primary-red); padding:4px 10px; border-radius:12px;">
            Agustus 2026
          </span>
        </div>

        <p style="font-size:12px; color:var(--text-muted); margin-bottom:16px;">
          Pencapaian riil vs target aktivitas berdasarkan matriks SPM Tunas Toyota.
        </p>

        <!-- Summary Cards Funnel -->
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(100px, 1fr)); gap:10px; margin-bottom:16px;">
          <div style="background:#f8fafc; padding:10px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">Leads</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:3px 0;" id="spmLeadsCount">0 / 959</div>
            <div style="font-size:10px; font-weight:700; color:#2563eb;" id="spmLeadsPct">0%</div>
          </div>
          <div style="background:#f8fafc; padding:10px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">Prospect</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:3px 0;" id="spmProsCount">0 / 267</div>
            <div style="font-size:10px; font-weight:700; color:#0284c7;" id="spmProsPct">0%</div>
          </div>
          <div style="background:#f8fafc; padding:10px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">Hot Pros.</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:3px 0;" id="spmHotCount">0 / 188</div>
            <div style="font-size:10px; font-weight:700; color:#d97706;" id="spmHotPct">0%</div>
          </div>
          <div style="background:#f8fafc; padding:10px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">SPK Firm</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:3px 0;" id="spmSpkCount">0 / 125</div>
            <div style="font-size:10px; font-weight:700; color:#dc2626;" id="spmSpkPct">0%</div>
          </div>
          <div style="background:#f8fafc; padding:10px; border-radius:12px; border:1px solid #e2e8f0; text-align:center;">
            <div style="font-size:10px; color:#64748b; font-weight:700; text-transform:uppercase;">RS / DO</div>
            <div style="font-size:14px; font-weight:800; color:#0f172a; margin:3px 0;" id="spmDoCount">0 / 95</div>
            <div style="font-size:10px; font-weight:700; color:#16a34a;" id="spmDoPct">0%</div>
          </div>
        </div>

        <!-- Matrix Table per Kategori -->
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:11.5px;">
            <thead>
              <tr style="background:#f1f5f9; text-align:left; color:#475569;">
                <th style="padding:8px 10px; border-radius:8px 0 0 8px;">Kategori Aktivitas</th>
                <th style="padding:8px 6px; text-align:center;">Leads (Act/Tgt)</th>
                <th style="padding:8px 6px; text-align:center;">Prospect</th>
                <th style="padding:8px 6px; text-align:center;">Hot Pros</th>
                <th style="padding:8px 6px; text-align:center;">SPK</th>
                <th style="padding:8px 6px; text-align:center; border-radius:0 8px 8px 0;">RS (DO)</th>
              </tr>
            </thead>
            <tbody id="spmMatrixTbody">
              <tr><td colspan="6" style="text-align:center; padding:12px; color:var(--text-muted);">Memuat matriks SPM...</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ================= CARD SARAN AKSI ================= -->
      <div class="card" style="padding:18px;">
        <h3 class="section-title" style="margin-bottom:8px;font-size:14px;">Saran Aksi</h3>
        <ul style="padding-left:16px;color:var(--text-muted);font-size:12px;line-height:1.7;">
          <li>Prioritaskan follow up customer yang statusnya mendekati deal.</li>
          <li>Aktifkan reminder dokumen & estimasi jadwal serah terima.</li>
          <li>Susun jadwal test drive & closing di bulan berikutnya.</li>
        </ul>
      </div>

      <!-- ================= SALES GAMIFICATION & QUEST SYSTEM ================= -->
      <div class="card" style="padding:18px; margin-bottom:20px; background:#ffffff; border-radius:18px; border:1px solid var(--border-color); box-shadow:0 4px 14px rgba(0,0,0,0.04);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:14px; margin:0; font-weight:800; color:var(--primary-blue);">
            <i class="fa-solid fa-trophy" style="color:#d97706; margin-right:6px;"></i>Sales Quests & XP Gamification
          </h3>
          <span style="font-size:11px; font-weight:800; background:#fef3c7; color:#b45309; padding:3px 10px; border-radius:12px;">
            Level 4 Sales Master
          </span>
        </div>

        <!-- Level XP Bar -->
        <div style="background:#f1f5f9; border-radius:12px; padding:12px; margin-bottom:14px;">
          <div style="display:flex; justify-content:space-between; font-size:11.5px; font-weight:700; margin-bottom:6px;">
            <span>XP Saat Ini: <strong style="color:var(--primary-red);">1,450 / 2,000 XP</strong></span>
            <span style="color:var(--text-muted);">Next: Top Performer Badge <i class="fa-solid fa-medal"></i></span>
          </div>
          <div style="height:10px; background:#e2e8f0; border-radius:10px; overflow:hidden;">
            <div style="height:100%; width:72.5%; background:linear-gradient(90deg, #d97706, #d7123a); border-radius:10px;"></div>
          </div>
        </div>

        <!-- Daily Quests List -->
        <div style="font-size:12px; font-weight:800; color:var(--text-dark); margin-bottom:8px;">
          <i class="fa-solid fa-list-check" style="color:var(--accent-blue);"></i> Quest Harian Wiraniaga:
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-circle-check" style="color:#10b981; font-size:16px;"></i>
              <div>
                <div style="font-weight:700; font-size:12.5px; color:#1e293b;">Input 3 Prospek Baru</div>
                <div style="font-size:10.5px; color:#64748b;">Selesai (+150 XP)</div>
              </div>
            </div>
            <span style="font-size:11px; font-weight:800; color:#10b981; background:#dcfce7; padding:2px 8px; border-radius:6px;">Done</span>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-car-side" style="color:var(--accent-blue); font-size:16px;"></i>
              <div>
                <div style="font-weight:700; font-size:12.5px; color:#1e293b;">Lakukan 1 Test Drive Hari Ini</div>
                <div style="font-size:10.5px; color:#64748b;">Progress 0/1 (+250 XP)</div>
              </div>
            </div>
            <button onclick="window.location.href='testdrive.html'" style="font-size:11px; font-weight:700; color:#fff; background:var(--primary-blue); border:none; padding:4px 10px; border-radius:6px; cursor:pointer;">Kerjakan</button>
          </div>

          <div style="display:flex; align-items:center; justify-content:space-between; background:#f8fafc; padding:10px 12px; border-radius:10px; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-wand-magic-sparkles" style="color:#7048d6; font-size:16px;"></i>
              <div>
                <div style="font-weight:700; font-size:12.5px; color:#1e293b;">Gunakan AI Copilot Objection Handler</div>
                <div style="font-size:10.5px; color:#64748b;">Progress 1/1 (+100 XP)</div>
              </div>
            </div>
            <span style="font-size:11px; font-weight:800; color:#10b981; background:#dcfce7; padding:2px 8px; border-radius:6px;">Done</span>
          </div>
        </div>

        <!-- Badges Collection -->
        <div style="margin-top:14px; border-top:1px dashed #e2e8f0; padding-top:12px;">
          <div style="font-size:12px; font-weight:800; color:var(--text-dark); margin-bottom:8px;">
            <i class="fa-solid fa-medal" style="color:#f59e0b;"></i> Lencana Prestasi (Badges Unlocked):
          </div>
          <div style="display:flex; gap:10px; overflow-x:auto; padding-bottom:4px;">
            <span style="background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; white-space:nowrap;"><i class="fa-solid fa-bolt"></i> Speedy Follow Up</span>
            <span style="background:#fef3c7; border:1px solid #fde68a; color:#b45309; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; white-space:nowrap;"><i class="fa-solid fa-fire"></i> Master Closer</span>
            <span style="background:#f3effd; border:1px solid #ddd6fe; color:#6d28d9; font-size:11px; font-weight:700; padding:4px 10px; border-radius:20px; white-space:nowrap;"><i class="fa-solid fa-car"></i> Test Drive Champ</span>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- ================= INPUT MODAL SHEET ================= -->
  <div class="modal-overlay" id="inputModal" onclick="closeInputModal()">
    <div class="modal-content spkdo-content" onclick="event.stopPropagation()">

      <div class="spkdo-head">
        <h3>Input Pencapaian<br>Terotomatisasi</h3>
        <button type="button" class="spkdo-x" onclick="closeInputModal()"><i
            class="fa-solid fa-xmark"></i></button>
      </div>

      <div class="spkdo-info">
        <i class="fa-solid fa-database"></i>
        <h4>Integrasi Data Real-Time</h4>
        <p>
          Pencapaian <strong>Actual SPK</strong> dan <strong>Actual DO</strong> kini terhubung
          secara real-time. Anda dapat membuat pengajuan SPK baru atau menginput DO langsung
          melalui form pencapaian.
        </p>
      </div>

      <div class="spkdo-actions">
        <a href="spk.html" class="spkdo-btn">
          <i class="fa-solid fa-file-invoice"></i>
          <span>Buat<br>Pengajuan<br>SPK</span>
        </a>
        <a href="do.html" class="spkdo-btn">
          <i class="fa-solid fa-boxes-packing"></i>
          <span>Input DO<br>Langsung</span>
        </a>
      </div>

      <button class="spkdo-close" onclick="closeInputModal()">Tutup</button>
    </div>
  </div>



  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="../js/target.js?v=20260808_06"></script>
  <script>
    if (typeof loadTargetPageData === 'function') {
      loadTargetPageData();
    }
  </script>
</body>

</html>
