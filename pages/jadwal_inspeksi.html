<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App — Jadwal Inspeksi Showroom</title>
  <meta name="description" content="Monitoring & Konfirmasi Jadwal Janji Temu Inspeksi Mobil Bekas Showroom">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/olx.css">
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">

  <style>
    .sched-tabs-bar {
      display: flex;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid var(--border-color);
    }
    .sched-tab-btn {
      flex: 1;
      padding: 10px;
      border-radius: 9px;
      border: none;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      background: transparent;
      color: #64748b;
      transition: all 0.2s;
    }
    .sched-tab-btn.active {
      background: #ffffff;
      color: #4f46e5;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .sched-card-item {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.04);
      transition: all 0.25s ease;
    }
    .sched-card-item:hover {
      border-color: #6366f1;
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(99,102,241,0.12);
    }

    .time-slot-box {
      background: linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(16,185,129,0.06) 100%);
      border: 1.5px solid rgba(99,102,241,0.25);
      border-radius: 14px;
      padding: 12px 16px;
      margin: 12px 0;
    }
    .time-slot-val {
      font-size: 1.05rem;
      font-weight: 800;
      color: #1e293b;
      margin-top: 2px;
    }

    .status-pill-sub {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 50px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .status-pill-sub.pending { background: rgba(245,158,11,0.12); color: #d97706; }
    .status-pill-sub.confirmed { background: rgba(16,185,129,0.15); color: #059669; }

    .btn-act-wa {
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
      color: #ffffff;
      border: none;
      padding: 9px 15px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(37,211,102,0.3);
    }

    .btn-act-confirm {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border: none;
      padding: 9px 15px;
      border-radius: 10px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3);
    }
  </style>
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Jadwal Inspeksi Showroom</h2>
      <button class="btn-icon" onclick="loadSchedules()" style="margin-left:auto; background:none; border:none; color:#fff; font-size:18px; cursor:pointer;" title="Refresh Data"><i class="fa-solid fa-rotate"></i></button>
    </header>

    <div class="container" style="margin-top: 0; padding: 18px 16px;">
      <!-- Segment Control Tabs -->
      <div class="sched-tabs-bar">
        <button type="button" class="sched-tab-btn active" id="tabAll" onclick="switchFilter('all', this)">Semua (<span id="cntAll">0</span>)</button>
        <button type="button" class="sched-tab-btn" id="tabPending" onclick="switchFilter('pending', this)">Menunggu (<span id="cntPending">0</span>)</button>
        <button type="button" class="sched-tab-btn" id="tabConfirmed" onclick="switchFilter('confirmed', this)">Dikonfirmasi (<span id="cntConfirmed">0</span>)</button>
      </div>

      <!-- Info strip -->
      <div class="info-strip" style="margin-bottom:16px;">
        <div class="info-strip-icon"><i class="fa-solid fa-store"></i></div>
        <div class="info-strip-text">
          <p>Jadwal janji temu inspeksi langsung di showroom Tunas Toyota Kiaracondong yang diajukan oleh customer.</p>
        </div>
      </div>

      <!-- Schedule List Container -->
      <div id="scheduleContainer">
        <div style="text-align:center; padding:30px; color:#94a3b8;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; margin-bottom:10px;"></i>
          <p style="font-size:0.85rem; margin:0;">Memuat jadwal inspeksi showroom...</p>
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script>
    let allSchedulesData = [];
    let currentFilter = 'all';

    document.addEventListener('DOMContentLoaded', loadSchedules);

    async function loadSchedules() {
      const container = document.getElementById('scheduleContainer');
      try {
        const res = await fetch('../api/api_inspeksi.php?t=' + Date.now());
        const json = await res.json();
        if (json.ok && Array.isArray(json.data)) {
          // Filter items that have submitted inspection date
          allSchedulesData = json.data.filter(item => item.tanggal_inspeksi != null && item.tanggal_inspeksi !== '');

          updateCounts();
          renderScheduleList();
        }
      } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color:#ef4444; text-align:center;">Gagal memuat jadwal.</p>';
      }
    }

    function switchFilter(filterType, btn) {
      currentFilter = filterType;
      document.querySelectorAll('.sched-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderScheduleList();
    }

    function updateCounts() {
      document.getElementById('cntAll').textContent = allSchedulesData.length;
      document.getElementById('cntPending').textContent = allSchedulesData.filter(i => i.status === 'Jadwal Diajukan').length;
      document.getElementById('cntConfirmed').textContent = allSchedulesData.filter(i => i.status === 'Jadwal Dikonfirmasi').length;
    }

    function renderScheduleList() {
      const container = document.getElementById('scheduleContainer');
      let filtered = allSchedulesData;
      if (currentFilter === 'pending') {
        filtered = allSchedulesData.filter(i => i.status === 'Jadwal Diajukan');
      } else if (currentFilter === 'confirmed') {
        filtered = allSchedulesData.filter(i => i.status === 'Jadwal Dikonfirmasi');
      }

      if (filtered.length === 0) {
        container.innerHTML = `
          <div style="background:#fff; border:1px dashed #cbd5e1; border-radius:16px; padding:30px; text-align:center;">
            <i class="fa-solid fa-calendar-xmark" style="font-size:32px; color:#cbd5e1; margin-bottom:10px;"></i>
            <h4 style="font-size:0.95rem; font-weight:700; color:#334155; margin:0 0 4px 0;">Belum Ada Jadwal Inspeksi</h4>
            <p style="font-size:0.8rem; color:#94a3b8; margin:0;">Belum ada customer yang mengajukan tanggal & jam janji temu showroom pada kategori ini.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = filtered.map(item => {
        let statusBadge = `<span class="status-pill-sub pending"><i class="fa-solid fa-clock"></i> Menunggu Konfirmasi</span>`;
        if (item.status === 'Jadwal Dikonfirmasi') {
          statusBadge = `<span class="status-pill-sub confirmed"><i class="fa-solid fa-circle-check"></i> Jadwal Dikonfirmasi</span>`;
        }

        const waMsg = `Halo Bpk/Ibu ${item.nama_pemilik},\n\n` +
          `Mengenai jadwal janji temu inspeksi *${item.merk_mobil} ${item.tipe_mobil}* Anda (Kode: *${item.kode_inspeksi}*) pada *${item.tanggal_inspeksi} @ ${item.jam_inspeksi}*:\n\n` +
          `Tim Sales Appraiser Tunas Toyota Kiaracondong siap menyambut kedatangan Anda di showroom!\n\n` +
          `Sampai jumpa di lokasi: Tunas Toyota Jl. Terusan Kiaracondong No.47, Bandung. Terima kasih! 🙏`;

        const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(item.no_wa)}&text=${encodeURIComponent(waMsg)}`;

        return `
          <div class="sched-card-item">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;">
              <div>
                <span style="font-size:0.72rem; font-weight:700; color:#64748b;">TIKET: ${item.kode_inspeksi}</span>
                <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:2px 0 0 0;">${item.merk_mobil} ${item.tipe_mobil} (${item.tahun_mobil})</h3>
              </div>
              <div>${statusBadge}</div>
            </div>

            <div style="font-size:0.85rem; color:#334155; margin-bottom:10px;">
              <i class="fa-solid fa-user" style="color:#6366f1; margin-right:6px;"></i> <strong>${item.nama_pemilik}</strong> (${item.no_wa})
            </div>

            <div class="time-slot-box">
              <div style="font-size:0.72rem; font-weight:700; color:#4f46e5; text-transform:uppercase;"><i class="fa-solid fa-store"></i> ${item.metode_inspeksi || 'Inspeksi di Showroom'}</div>
              <div class="time-slot-val"><i class="fa-regular fa-calendar-check" style="color:#10b981;"></i> ${item.tanggal_inspeksi} @ ${item.jam_inspeksi}</div>
            </div>

            ${item.catatan_jadwal ? `
              <div style="font-size:0.78rem; color:#64748b; background:#f8fafc; padding:8px 12px; border-radius:8px; margin-bottom:12px;">
                <strong>Catatan Customer:</strong> "${item.catatan_jadwal}"
              </div>
            ` : ''}

            <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:12px;">
              <a href="${waUrl}" target="_blank" class="btn-act-wa">
                <i class="fa-brands fa-whatsapp"></i> Chat & Remind WA
              </a>
              ${item.status === 'Jadwal Diajukan' ? `
                <button class="btn-act-confirm" onclick="confirmAppointment(${item.id})">
                  <i class="fa-solid fa-circle-check"></i> Konfirmasi Jadwal
                </button>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }

    async function confirmAppointment(id) {
      if (!confirm('Konfirmasi jadwal janji temu inspeksi showroom ini?')) return;
      try {
        const res = await fetch('../api/api_inspeksi.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'confirm_schedule', id: id })
        });
        const json = await res.json();
        if (json.ok) {
          alert('Jadwal inspeksi showroom berhasil dikonfirmasi oleh Sales!');
          loadSchedules();
        }
      } catch (err) {
        console.error(err);
      }
    }
  </script>
</body>
</html>
