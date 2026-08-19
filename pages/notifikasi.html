<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Pusat Notifikasi</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
  <style>
    .notif-summary-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 16px 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      margin-bottom: 20px;
    }
    .stat-pill-group {
      display: flex;
      gap: 16px;
      align-items: center;
    }
    .stat-box {
      display: flex;
      flex-direction: column;
    }
    .stat-val {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.1;
    }
    .stat-val.red { color: #dc2626; }
    .stat-val.dark { color: #1e293b; }
    .stat-lbl {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .notif-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }
    .btn-notif-action {
      padding: 8px 14px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }
    .btn-notif-action.read-all {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
    }
    .btn-notif-action.read-all:hover {
      background: #dbeafe;
    }
    .btn-notif-action.del-read {
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
    }
    .btn-notif-action.del-read:hover {
      background: #fee2e2;
    }

    /* Notif Card Items */
    .notif-card-item {
      position: relative;
      border-radius: 16px;
      padding: 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      cursor: pointer;
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .notif-card-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0,0,0,0.06);
    }
    .notif-card-item.unread {
      background: #ffffff;
      border: 1px solid #fca5a5;
      border-left: 5px solid #dc2626;
      box-shadow: 0 4px 14px rgba(220, 38, 38, 0.08);
    }
    .notif-card-item.read {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-left: 5px solid #94a3b8;
      opacity: 0.88;
    }
    .notif-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      font-size: 18px;
    }
    .icon-spk { background: #dcfce7; color: #16a34a; }
    .icon-do { background: #fef3c7; color: #d97706; }
    .icon-bell { background: #fee2e2; color: #dc2626; }
    .icon-info { background: #e0e7ff; color: #4f46e5; }

    .notif-title {
      font-size: 14px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
    }
    .notif-time {
      font-size: 11px;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 8px;
      white-space: nowrap;
    }
    .notif-body-text {
      font-size: 12.5px;
      color: #475569;
      margin-top: 6px;
      line-height: 1.5;
      font-weight: 500;
    }
    .notif-status-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 10.5px;
      font-weight: 800;
      margin-top: 10px;
    }
    .notif-status-badge.unread {
      background: #dc2626;
      color: #ffffff;
      box-shadow: 0 2px 8px rgba(220,38,38,0.3);
    }
    .notif-status-badge.read {
      background: #f1f5f9;
      color: #64748b;
      border: 1px solid #cbd5e1;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #fff;
      animation: pulseGlow 1.5s infinite;
    }
    @keyframes pulseGlow {
      0% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
      100% { opacity: 1; transform: scale(1); }
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="padding-bottom: 110px;">
    <header class="header-page">
      <a href="../index.html" style="color:white;"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Pusat Notifikasi</h2>
    </header>

    <div class="container" style="margin-top:18px;">
      <!-- Summary Card -->
      <div class="notif-summary-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:14px;">
          <div class="stat-pill-group">
            <div class="stat-box">
              <span id="badgeBelumDibaca" class="stat-val red">0</span>
              <span class="stat-lbl">Belum Dibaca</span>
            </div>
            <div style="width:1px; height:32px; background:#e2e8f0;"></div>
            <div class="stat-box">
              <span id="totalNotifVal" class="stat-val dark">0</span>
              <span class="stat-lbl">Total Notif</span>
            </div>
          </div>

          <div class="notif-actions">
            <button class="btn-notif-action read-all" onclick="markAllRead()">
              <i class="fa-solid fa-check-double"></i> Tandai Dibaca
            </button>
            <button class="btn-notif-action del-read" onclick="deleteReadNotif()">
              <i class="fa-solid fa-trash-can"></i> Hapus Dibaca
            </button>
          </div>
        </div>
      </div>

      <!-- Notification List -->
      <div class="card" style="padding:0; background:transparent; border:none; box-shadow:none;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; padding:0 4px;">
          <div style="font-size:14px; font-weight:800; color:#1e293b;"><i class="fa-solid fa-bell" style="color:var(--primary-red); margin-right:6px;"></i> Daftar Notifikasi</div>
          <div id="notifKosong" style="display:none; font-size:12px; color:#64748b; font-weight:700;">Tidak ada notifikasi</div>
        </div>

        <div id="notifList" style="display:flex; flex-direction:column; gap:12px;">
        </div>
      </div>
    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script src="../js/notifikasi.js"></script>
  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>

