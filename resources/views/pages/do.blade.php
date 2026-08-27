<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Form DO</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Form DO</h2>

    </header>

    <div class="container" style="margin-top:18px;">
      <div class="card" style="padding:18px;">
        <h3 class="section-title" style="margin-bottom:6px;">Input DO Langsung</h3>
        <p style="font-size:12px;color:var(--text-muted);line-height:1.6;">Input DO ini akan langsung berstatus Disetujui dan menambah target DO Anda.</p>

        <div class="form-group">
          <label>Pilih Data SPK (Menunggu)</label>
          <select class="form-control" id="spkSelect" onchange="autoFillSpkData()">
            <option value="">-- Pilih SPK --</option>
          </select>
        </div>

        <div class="form-group">
          <label>Nama Customer</label>
          <input class="form-control" type="text" id="namaCustomer" placeholder="Pilih SPK di atas" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <div class="form-group">
          <label>No. HP</label>
          <input class="form-control" type="tel" id="noHp" placeholder="-" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <div class="form-group">
          <label>Tipe Mobil</label>
          <input class="form-control" type="text" id="model" placeholder="-" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <div class="form-group">
          <label>Harga Mobil (Rp)</label>
          <input class="form-control" type="text" id="nominal" placeholder="-" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <div class="form-group">
          <label>Tipe Pembelian</label>
          <input class="form-control" type="text" id="tipePembelian" placeholder="-" readonly style="background-color: #f1f5f9; cursor: not-allowed;" />
        </div>

        <button class="btn-main" style="margin-top:8px;" onclick="submitDo()">
          <i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i>
          Submit DO
        </button>
      </div>

      <div class="card">
        <div class="section-title" style="margin:0 0 10px 0; font-size:14px;">Daftar Input DO</div>
        <div id="spkList" style="display:flex; flex-direction:column; gap:10px;">
          <p style="font-size:12px;color:var(--text-muted);line-height:1.6;" id="statusSpk">Belum ada data DO.</p>
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/do.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

