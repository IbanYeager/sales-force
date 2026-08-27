<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Input Jadwal</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <link rel="stylesheet" href="../css/jadwal_input.css">
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Input Jadwal</h2>

    </header>

    <div class="container jadwal-form" style="margin-top:18px;">
      <h3 class="section-title" style="margin-bottom:6px;">Buat Jadwal Hari Ini</h3>
      <div class="form-help">Setelah tersimpan, panel <b>Jadwal Hari Ini</b> di halaman <b>Dashboard</b> akan ter-update
        otomatis.</div>

      <form id="formJadwal">
        <div class="form-group">
          <label>Waktu <span style="color: var(--primary-red);">*</span></label>
          <input class="form-control" type="time" id="jadwalWaktu" required />
        </div>

        <div class="form-group">
          <label>Judul Kegiatan <span style="color: var(--primary-red);">*</span></label>
          <input class="form-control" type="text" id="jadwalJudul" placeholder="Misal: Follow Up Andi" required />
        </div>

        <div class="form-group">
          <label>Nama Customer/Unit <span style="color: var(--primary-red);">*</span></label>
          <input class="form-control" type="text" id="jadwalDeskripsi" placeholder="Misal: Bapak Andi - Innova"
            required />
        </div>

        <div class="form-group">
          <label>Status <span style="color: var(--primary-red);">*</span></label>
          <div class="status-chip">
            <button type="button" class="chip-btn active" data-status="Selesai">Selesai</button>
            <button type="button" class="chip-btn" data-status="Terjadwal">Terjadwal</button>
          </div>
          <input type="hidden" id="jadwalStatus" value="Selesai" required />
        </div>

        <div class="btn-row">
          <button type="button" class="btn-secondary" onclick="window.location.href='../index.html'">
            <i class="fa-solid fa-xmark"></i> Batal
          </button>
          <button type="button" class="btn-main"
            style="background: var(--primary-blue); box-shadow: 0 4px 15px rgba(15,48,87,0.25)"
            onclick="simpanJadwal()">
            <i class="fa-regular fa-paper-plane"></i> Simpan
          </button>
        </div>
      </form>
    </div>
  </div>

  <script src="../js/script.js"></script>
  <script src="../js/jadwal_input.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

