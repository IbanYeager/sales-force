<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App — Prospek Inspeksi Mobil Customer</title>
  <meta name="description" content="Manajemen Prospek Inspeksi Mobil Bekas Customer & Janji Temu Showroom">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/olx.css">
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">

  <style>
    .insp-stat-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 20px;
    }
    @media (max-width: 600px) {
      .insp-stat-grid {
        grid-template-columns: 1fr;
      }
    }
    .insp-stat-card {
      background: #ffffff;
      border: 1px solid var(--border-color);
      border-radius: 14px;
      padding: 14px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .insp-stat-icon {
      width: 38px;
      height: 38px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #ffffff;
      flex-shrink: 0;
    }
    .insp-stat-val {
      font-size: 1.2rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
    }
    .insp-stat-lbl {
      font-size: 0.72rem;
      font-weight: 600;
      color: #64748b;
      margin-top: 2px;
    }
    .insp-item-card {
      background: #ffffff;
      border: 1.5px solid var(--border-color);
      border-radius: 18px;
      padding: 18px;
      margin-bottom: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.05);
      transition: all 0.25s ease;
    }
    .insp-item-card:hover {
      border-color: #6366f1;
      transform: translateY(-2px);
      box-shadow: 0 8px 22px rgba(99,102,241,0.12);
    }
    .insp-badge-status {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 50px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .insp-badge-status.given { background: rgba(16,185,129,0.12); color: #059669; }
    .insp-badge-status.scheduled { background: rgba(99,102,241,0.12); color: #4f46e5; }
    .insp-badge-status.confirmed { background: rgba(5,150,105,0.15); color: #047857; }
    
    .price-tag-badge {
      background: linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(245,158,11,0.08) 100%);
      border: 1px solid rgba(239,68,68,0.25);
      color: #ef4444;
      font-weight: 800;
      font-size: 0.88rem;
      padding: 6px 12px;
      border-radius: 10px;
      display: inline-block;
      margin-top: 6px;
    }

    .btn-sales-wa {
      background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
      color: #ffffff;
      border: none;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(37,211,102,0.3);
      transition: all 0.2s ease;
    }
    .btn-sales-wa:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(37,211,102,0.4);
    }
    .btn-sales-confirm {
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff;
      border: none;
      padding: 10px 16px;
      border-radius: 12px;
      font-size: 0.82rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 12px rgba(99,102,241,0.3);
      transition: all 0.2s ease;
    }
    .btn-sales-confirm:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(99,102,241,0.4);
    }
  </style>
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Prospek Inspeksi Mobil</h2>
      <button class="btn-icon" onclick="loadInspectionList()" style="margin-left:auto; background:none; border:none; color:#fff; font-size:18px; cursor:pointer;" title="Refresh Data"><i class="fa-solid fa-rotate"></i></button>
    </header>

    <div class="container" style="margin-top: 0; padding: 18px 16px;">
      <!-- Stats Row -->
      <div class="insp-stat-grid">
        <div class="insp-stat-card">
          <div class="insp-stat-icon" style="background:#ef4444;"><i class="fa-solid fa-car-rear"></i></div>
          <div>
            <div class="insp-stat-val" id="countTotal">0</div>
            <div class="insp-stat-lbl">Total Upload</div>
          </div>
        </div>
        <div class="insp-stat-card">
          <div class="insp-stat-icon" style="background:#6366f1;"><i class="fa-solid fa-calendar-clock"></i></div>
          <div>
            <div class="insp-stat-val" id="countScheduled">0</div>
            <div class="insp-stat-lbl">Jadwal Diajukan</div>
          </div>
        </div>
        <div class="insp-stat-card">
          <div class="insp-stat-icon" style="background:#10b981;"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="insp-stat-val" id="countConfirmed">0</div>
            <div class="insp-stat-lbl">Dikonfirmasi</div>
          </div>
        </div>
      </div>

      <!-- Info Banner -->
      <div class="info-strip" style="margin-bottom:16px;">
        <div class="info-strip-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
        <div class="info-strip-text">
          <p>Estimasi harga kisaran telah **dihitung otomatis oleh sistem** berdasarkan merk & tahun. Sales dapat langsung mengirimkan estimasi & link jadwal via WA!</p>
        </div>
      </div>

      <!-- List of Inspection Requests -->
      <div id="inspectionListContainer">
        <div style="text-align:center; padding:30px; color:#94a3b8;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size:24px; margin-bottom:10px;"></i>
          <p style="font-size:0.85rem; margin:0;">Memuat prospek inspeksi customer...</p>
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', loadInspectionList);

    async function loadInspectionList() {
      const container = document.getElementById('inspectionListContainer');
      try {
        const res = await fetch('../api/api_inspeksi.php?t=' + Date.now());
        const json = await res.json();
        
        if (json.ok && Array.isArray(json.data)) {
          updateStats(json.data);

          if (json.data.length === 0) {
            container.innerHTML = `
              <div style="background:#fff; border:1px dashed #cbd5e1; border-radius:16px; padding:30px; text-align:center;">
                <i class="fa-solid fa-folder-open" style="font-size:32px; color:#cbd5e1; margin-bottom:10px;"></i>
                <h4 style="font-size:0.95rem; font-weight:700; color:#334155; margin:0 0 4px 0;">Belum Ada Prospek Inspeksi</h4>
                <p style="font-size:0.8rem; color:#94a3b8; margin:0;">Pengajuan data mobil bekas dari customer akan otomatis masuk ke sini.</p>
              </div>
            `;
            return;
          }

          container.innerHTML = json.data.map(item => {
            let minJuta = item.harga_min_estimasi ? (item.harga_min_estimasi / 1000000) : 0;
            let maxJuta = item.harga_max_estimasi ? (item.harga_max_estimasi / 1000000) : 0;

            let statusBadge = `<span class="insp-badge-status given"><i class="fa-solid fa-tag"></i> Estimasi Otomatis Dikirim</span>`;
            if (item.status === 'Jadwal Diajukan') {
              statusBadge = `<span class="insp-badge-status scheduled"><i class="fa-solid fa-calendar-day"></i> Jadwal Diajukan</span>`;
            } else if (item.status === 'Jadwal Dikonfirmasi') {
              statusBadge = `<span class="insp-badge-status confirmed"><i class="fa-solid fa-circle-check"></i> Jadwal Dikonfirmasi</span>`;
            }

            let scheduleText = '<span style="font-size:0.78rem; color:#94a3b8;"><i class="fa-regular fa-clock"></i> Belum mengisi jadwal</span>';
            if (item.tanggal_inspeksi) {
              scheduleText = `
                <div style="background:rgba(99,102,241,0.06); border:1px solid rgba(99,102,241,0.2); border-radius:10px; padding:8px 12px; margin-top:8px;">
                  <span style="font-size:0.75rem; font-weight:700; color:#4f46e5;"><i class="fa-solid fa-store"></i> ${item.metode_inspeksi}</span><br>
                  <strong style="font-size:0.85rem; color:#1e293b;"><i class="fa-regular fa-calendar"></i> ${item.tanggal_inspeksi} @ ${item.jam_inspeksi}</strong>
                </div>
              `;
            }

            // WhatsApp Message Generator for Salesperson (Points directly to standalone jadwal.html)
            const formLink = `http://localhost/customer_pov/jadwal.html?kode=${item.kode_inspeksi}`;
            const waMsg = `Halo Bpk/Ibu ${item.nama_pemilik},\n\n` +
              `Saya Sales Appraiser resmi *Tunas Toyota Kiaracondong*. Kami telah menerima data mobil *${item.merk_mobil} ${item.tipe_mobil} (${item.tahun_mobil})* Anda (Kode Tiket: *${item.kode_inspeksi}*).\n\n` +
              `🔥 *Estimasi Kisaran Penawaran Dealer:* Rp ${minJuta} Juta — Rp ${maxJuta} Juta\n\n` +
              `Untuk menentukan jadwal janji temu inspeksi ke showroom, silakan isi formulir pada link berikut:\n` +
              `👉 ${formLink}\n\n` +
              `Terima kasih! 🙏\nTunas Toyota Kiaracondong`;

            const waUrl = `https://api.whatsapp.com/send?phone=${encodeURIComponent(item.no_wa)}&text=${encodeURIComponent(waMsg)}`;

            return `
              <div class="insp-item-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px; gap:8px;">
                  <div>
                    <span style="font-size:0.72rem; font-weight:700; color:#64748b;">TIKET: ${item.kode_inspeksi}</span>
                    <h3 style="font-size:1.05rem; font-weight:800; color:#0f172a; margin:2px 0 0 0;">${item.merk_mobil} ${item.tipe_mobil} (${item.tahun_mobil})</h3>
                  </div>
                  <div>${statusBadge}</div>
                </div>

                <div style="display:flex; gap:12px; align-items:center; margin-bottom:12px;">
                  <div style="width:42px; height:42px; border-radius:10px; background:rgba(99,102,241,0.1); color:#6366f1; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0;">
                    <i class="fa-solid fa-car-side"></i>
                  </div>
                  <div>
                    <div style="font-size:0.85rem; font-weight:700; color:#1e293b;"><i class="fa-solid fa-user" style="color:#6366f1;"></i> ${item.nama_pemilik}</div>
                    <div style="font-size:0.78rem; color:#64748b;"><i class="fa-brands fa-whatsapp" style="color:#25d366;"></i> ${item.no_wa}</div>
                  </div>
                </div>

                <div style="margin-bottom:10px;">
                  <div style="font-size:0.72rem; font-weight:700; color:#64748b; text-transform:uppercase;">Estimasi Harga Otomatis Sistem:</div>
                  <div class="price-tag-badge">Rp ${minJuta} Juta — Rp ${maxJuta} Juta</div>
                </div>

                ${scheduleText}

                <div style="display:flex; gap:10px; margin-top:14px; flex-wrap:wrap;">
                  <a href="${waUrl}" target="_blank" class="btn-sales-wa">
                    <i class="fa-brands fa-whatsapp"></i> Chat & Kirim Link Schedule
                  </a>
                  ${item.status === 'Jadwal Diajukan' ? `
                    <button class="btn-sales-confirm" onclick="confirmAppointmentBySales(${item.id})">
                      <i class="fa-solid fa-circle-check"></i> Konfirmasi Jadwal
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('');
        }
      } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color:#ef4444; text-align:center;">Gagal memuat data inspeksi.</p>';
      }
    }

    function updateStats(list) {
      document.getElementById('countTotal').textContent = list.length;
      document.getElementById('countScheduled').textContent = list.filter(i => i.status === 'Jadwal Diajukan').length;
      document.getElementById('countConfirmed').textContent = list.filter(i => i.status === 'Jadwal Dikonfirmasi').length;
    }

    async function confirmAppointmentBySales(id) {
      if (!confirm('Konfirmasi jadwal inspeksi showroom customer ini?')) return;
      try {
        const res = await fetch('../api/api_inspeksi.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'confirm_schedule', id: id })
        });
        const json = await res.json();
        if (json.ok) {
          alert('Jadwal inspeksi berhasil dikonfirmasi!');
          loadInspectionList();
        }
      } catch (err) {
        console.error(err);
      }
    }
  </script>
</body>
</html>
