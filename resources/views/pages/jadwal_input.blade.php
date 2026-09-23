<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kalender & Reminder Follow-Up - Tunas Toyota Kiara Condong</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v=20260914_fix_mobile" />
  <link rel="stylesheet" href="../css/jadwal_input.css?v=20260914_cal_v4">
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app" style="padding-bottom: 90px; width: 100%; max-width: 1200px; margin: 0 auto; box-sizing: border-box; overflow-x: hidden;">
    <!-- Header Mobile Navigation -->
    <header class="header-page">
      <a href="../index.html" title="Kembali ke Dashboard"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Kalender &amp; Reminder</h2>
    </header>

    <div class="jadwal-container">
    <!-- Top Statistics & Hero Banner -->
    <div class="jadwal-hero">
      <div class="jadwal-hero-header">
        <div class="jadwal-hero-title-box">
          <div class="jadwal-hero-icon">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <div>
            <h1>Kalender &amp; Reminder Follow-Up</h1>
            <p>Jadwal follow-up prospek, reminder STNK &amp; plat, servis berkala, hingga janji temu konsumen cabang Kiara Condong.</p>
          </div>
        </div>

        <a href="#formJadwalCard" class="btn-hero-add">
          <i class="fa-solid fa-calendar-plus"></i> + Buat Reminder Baru
        </a>
      </div>

      <!-- Quick Metrics Bar -->
      <div class="jadwal-stats-grid">
        <div class="stat-pill-card">
          <div class="stat-pill-icon blue">
            <i class="fa-regular fa-calendar"></i>
          </div>
          <div class="stat-pill-text">
            <span class="stat-pill-val" id="statTotalBulan">0</span>
            <span class="stat-pill-lbl">Agenda Bulan Ini</span>
          </div>
        </div>

        <div class="stat-pill-card">
          <div class="stat-pill-icon red">
            <i class="fa-solid fa-bell"></i>
          </div>
          <div class="stat-pill-text">
            <span class="stat-pill-val" id="statHariIni">0</span>
            <span class="stat-pill-lbl">Jadwal Hari Ini</span>
          </div>
        </div>

        <div class="stat-pill-card">
          <div class="stat-pill-icon amber">
            <i class="fa-regular fa-clock"></i>
          </div>
          <div class="stat-pill-text">
            <span class="stat-pill-val" id="statTerjadwal">0</span>
            <span class="stat-pill-lbl">Menunggu Follow-up</span>
          </div>
        </div>

        <div class="stat-pill-card">
          <div class="stat-pill-icon green">
            <i class="fa-regular fa-circle-check"></i>
          </div>
          <div class="stat-pill-text">
            <span class="stat-pill-val" id="statSelesai">0</span>
            <span class="stat-pill-lbl">Selesai / Closing</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Two-Column Layout -->
    <div class="jadwal-main-grid">
      
      <!-- COLUMN KIRI: Kalender Interaktif & Agenda Tanggal Terpilih -->
      <div class="jadwal-col-left">
        
        <!-- 1. Interactive Calendar Card -->
        <div class="calendar-card">
          <div class="calendar-header">
            <div class="calendar-month-title">
              <i class="fa-solid fa-calendar-days" style="color: var(--primary-red); font-size: 18px;"></i>
              <h2 id="calMonthYear">Memuat Kalender...</h2>
            </div>
            <div class="calendar-nav-buttons">
              <button type="button" class="btn-cal-today" id="btnCalToday">Hari Ini</button>
              <button type="button" class="btn-cal-nav" id="btnCalPrev" title="Bulan Sebelumnya">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button type="button" class="btn-cal-nav" id="btnCalNext" title="Bulan Berikutnya">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Days Grid Wrapper -->
          <div class="calendar-grid-wrapper">
            <div class="calendar-weekdays">
              <div>Sen</div>
              <div>Sel</div>
              <div>Rab</div>
              <div>Kam</div>
              <div>Jum</div>
              <div>Sab</div>
              <div>Min</div>
            </div>

            <!-- Calendar Days Generated via JavaScript -->
            <div class="calendar-days" id="calendarDaysGrid"></div>
          </div>

          <!-- Calendar Legend -->
          <div class="calendar-legend">
            <div class="legend-item">
              <span class="cal-dot dot-prospek"></span>
              <span>Follow-Up Prospek</span>
            </div>
            <div class="legend-item">
              <span class="cal-dot dot-stnk"></span>
              <span>Follow-Up STNK</span>
            </div>
            <div class="legend-item">
              <span class="cal-dot dot-servis"></span>
              <span>Servis Pertama</span>
            </div>
            <div class="legend-item">
              <span class="cal-dot dot-janjitemu"></span>
              <span>Janji Temu / DO</span>
            </div>
          </div>
        </div>

        <!-- 2. Agenda Detail Card for Selected Date -->
        <div class="agenda-card" id="agendaCardSection">
          <div class="agenda-card-header">
            <div class="agenda-date-badge">
              <i class="fa-solid fa-clock-rotate-left"></i>
              <h3 id="agendaSelectedDateTitle">Jadwal Tanggal Terpilih</h3>
            </div>
            <span class="agenda-count-pill" id="agendaCountPill">0 Agenda</span>
          </div>

          <!-- List of Reminders on Selected Date -->
          <div class="agenda-item-list" id="agendaItemList">
            <div class="agenda-empty-state">
              <div class="agenda-empty-icon"><i class="fa-regular fa-calendar-xmark"></i></div>
              <p>Memuat agenda jadwal...</p>
            </div>
          </div>
        </div>

      </div>

      <!-- COLUMN KANAN: Form Input Jadwal & Reminder Baru -->
      <div class="jadwal-col-right">
        <div class="form-card" id="formJadwalCard">
          <div class="form-card-header">
            <h3><i class="fa-solid fa-calendar-plus" style="color: var(--primary-red); margin-right: 6px;"></i> Buat Reminder &amp; Jadwal</h3>
            <p>Jadwal tersimpan akan langsung muncul di kalender dan panel <b>Jadwal Hari Ini</b> di Dashboard.</p>
          </div>

          <!-- Quick One-Tap Preset Chips -->
          <div class="preset-chips-box">
            <span class="preset-chips-label"><i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary-red);"></i> Pilih Kategori Reminder Cepat:</span>
            <div class="preset-chips-grid">
              <button type="button" class="preset-chip active" data-preset="prospek">
                <i class="fa-solid fa-car"></i> Follow Up Prospek
              </button>
              <button type="button" class="preset-chip chip-stnk" data-preset="stnk">
                <i class="fa-solid fa-file-lines"></i> Follow Up STNK
              </button>
              <button type="button" class="preset-chip chip-servis" data-preset="servis">
                <i class="fa-solid fa-wrench"></i> Servis Pertama (1.000 KM)
              </button>
              <button type="button" class="preset-chip" data-preset="janjitemu">
                <i class="fa-solid fa-handshake"></i> Janji Temu Showroom
              </button>
              <button type="button" class="preset-chip" data-preset="do">
                <i class="fa-solid fa-gift"></i> Serah Terima (DO)
              </button>
              <button type="button" class="preset-chip" data-preset="other">
                <i class="fa-solid fa-calendar-check"></i> Lainnya
              </button>
            </div>
          </div>

          <!-- Form Details -->
          <form id="formJadwal" onsubmit="event.preventDefault(); simpanJadwal();">
            <div class="form-row-2">
              <div class="form-group">
                <label for="jadwalTanggal">Tanggal Reminder <span style="color: var(--primary-red);">*</span></label>
                <input class="form-control" type="date" id="jadwalTanggal" required />
              </div>

              <div class="form-group">
                <label for="jadwalWaktu">Waktu / Jam <span style="color: var(--primary-red);">*</span></label>
                <input class="form-control" type="time" id="jadwalWaktu" required />
              </div>
            </div>

            <div class="form-group">
              <label for="jadwalJudul">Judul Kegiatan / Reminder <span style="color: var(--primary-red);">*</span></label>
              <input class="form-control" type="text" id="jadwalJudul" placeholder="Misal: Follow Up SPK / Closing Pak Andi" required />
            </div>

            <div class="form-group">
              <label for="jadwalDeskripsi">Nama Customer &amp; Tipe Unit <span style="color: var(--primary-red);">*</span></label>
              <input class="form-control" type="text" id="jadwalDeskripsi" placeholder="Misal: Pak Andi - Veloz Q CVT" required />
            </div>

            <div class="form-group">
              <label for="jadwalWa">No. WhatsApp Customer <span style="color: var(--text-muted); font-size: 11px;">(Opsional - untuk 1-Klik Chat WA)</span></label>
              <input class="form-control" type="tel" id="jadwalWa" placeholder="Misal: 081223344556" />
            </div>

            <div class="form-group">
              <label for="jadwalCatatan">Catatan / Keterangan Follow-up <span style="color: var(--text-muted); font-size: 11px;">(Opsional)</span></label>
              <textarea class="form-control" id="jadwalCatatan" placeholder="Misal: Konsumen minta simulasi DP 20% & info warna hitam ready stock."></textarea>
            </div>

            <div class="form-group">
              <label>Status Reminder <span style="color: var(--primary-red);">*</span></label>
              <div class="status-chip-row">
                <button type="button" class="status-chip-btn active" data-status="Terjadwal">
                  <i class="fa-regular fa-clock"></i> Terjadwal
                </button>
                <button type="button" class="status-chip-btn" data-status="Selesai">
                  <i class="fa-solid fa-check"></i> Selesai
                </button>
              </div>
              <input type="hidden" id="jadwalStatus" value="Terjadwal" required />
            </div>

            <div class="form-buttons-row">
              <button type="button" class="btn-secondary" onclick="window.location.href='../index.html'">
                <i class="fa-solid fa-arrow-left"></i> Kembali
              </button>
              <button type="submit" class="btn-primary-submit">
                <i class="fa-regular fa-paper-plane"></i> Simpan Jadwal &amp; Reminder
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
    </div>
  </div>

  <script src="../js/script.js"></script>
  <script src="../js/jadwal_input.js?v=20260914_cal_v2"></script>
  <script src="../js/pwa-app.js?v=20260908_no_toast"></script>
</body>

</html>
