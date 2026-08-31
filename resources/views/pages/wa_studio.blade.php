<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WhatsApp Sales Studio - Tunas Toyota</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>
  <style>
    .wa-container {
      display: grid;
      grid-template-columns: 300px 1fr;
      gap: 20px;
      align-items: start;
    }
    @media (max-width: 900px) {
      .wa-container { grid-template-columns: 1fr; }
    }
    .template-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px 14px;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      margin-bottom: 10px;
    }
    .template-card:hover, .template-card.active {
      border-color: #25D366;
      background: #f0fdf4;
      box-shadow: 0 6px 18px rgba(37, 211, 102, 0.15);
      transform: translateY(-2px);
    }
    .form-group-label {
      font-size: 11.5px;
      font-weight: 700;
      color: #475569;
      display: block;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
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
      transition: all 0.2s ease;
    }
    .styled-input:focus {
      border-color: #25D366;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.15);
    }
    .wa-preview-box {
      background: #efeae2;
      border-radius: 16px;
      padding: 18px;
      border: 1px solid #cbd5e1;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
    }
    .wa-bubble {
      background: #d9fdd3;
      border-radius: 14px 14px 0 14px;
      padding: 14px 16px;
      font-size: 13px;
      color: #111b21;
      line-height: 1.55;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      font-family: inherit;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>WA Broadcast Studio</h2>
    </header>

    <div class="container" style="margin-top: 18px; max-width: 100%;">
      <!-- HEADER BANNER -->
      <div style="background: linear-gradient(135deg, #0b4d26 0%, #15803d 100%); color: white; border-radius: 20px; padding: 20px 24px; margin-bottom: 20px; box-shadow: 0 10px 25px rgba(21,128,61,0.12);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
          <div>
            <span style="background: rgba(255, 255, 255, 0.2); color: #86efac; font-size: 11px; font-weight: 800; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp Fast-Reply &amp; Broadcast Studio
            </span>
            <h3 style="font-size: 20px; font-weight: 900; margin: 8px 0 4px; color: white;">WhatsApp Sales Broadcast Studio</h3>
            <p style="font-size: 12.5px; color: #bbf7d0; margin: 0;">Pilih skrip follow-up berkonversi tinggi dan kirimkan langsung ke WA konsumen dalam 1-klik.</p>
          </div>
        </div>
      </div>

      <!-- TAB NAVIGATION -->
      <div style="display: flex; gap: 8px; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; flex-wrap: wrap;">
        <button id="tabBtnBroadcast" class="wa-tab-btn active" onclick="switchWaTab('broadcast')" style="padding: 10px 18px; border-radius: 12px; border: none; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #15803d; color: white; transition: all 0.2s;">
          <i class="fa-solid fa-bullhorn"></i> Broadcast &amp; Follow-Up Studio
        </button>
        <button id="tabBtnAiBot" class="wa-tab-btn" onclick="switchWaTab('aibot')" style="padding: 10px 18px; border-radius: 12px; border: none; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #f1f5f9; color: #475569; transition: all 0.2s;">
          <i class="fa-solid fa-robot" style="color: #c8102e;"></i> T-STOCK AI WhatsApp Bot &amp; Webhook
        </button>
        <button id="tabBtnSentinel" class="wa-tab-btn" onclick="switchWaTab('sentinel')" style="padding: 10px 18px; border-radius: 12px; border: none; font-weight: 800; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 8px; background: #f1f5f9; color: #475569; transition: all 0.2s;">
          <i class="fa-solid fa-shield-halved" style="color: #4f46e5;"></i> AI Sentinel: Laporan 5-Harian Kacab
        </button>
      </div>

      <!-- TAB 1: BROADCAST & FOLLOW-UP -->
      <div id="sectionBroadcast" class="wa-container">
        <!-- Left: Category List -->
        <div>
          <div style="font-size:11.5px; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:10px; letter-spacing:0.5px;">Pilih Template Skrip Pesan:</div>

          <div class="template-card active" onclick="selectWaTemplate('followup_testdrive')">
            <div style="font-weight:800; color:#0f172a; font-size:13px;"><i class="fa-solid fa-car" style="color:#0284c7; margin-right:6px;"></i> Follow-Up Test Drive</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Tanyakan impresi konsumen H+1 setelah mencoba unit</div>
          </div>

          <div class="template-card" onclick="selectWaTemplate('promo_dp')">
            <div style="font-weight:800; color:#0f172a; font-size:13px;"><i class="fa-solid fa-tags" style="color:#d97706; margin-right:6px;"></i> Flash Promo DP Ringan</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Kirim info subsidi diskon &amp; bunga 0% cuci gudang</div>
          </div>

          <div class="template-card" onclick="selectWaTemplate('undangan_pameran')">
            <div style="font-weight:800; color:#0f172a; font-size:13px;"><i class="fa-solid fa-calendar-star" style="color:#2563eb; margin-right:6px;"></i> Undangan Weekend Sales</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Ajak konsumen hadir ke event showroom Sabtu/Minggu</div>
          </div>

          <div class="template-card" onclick="selectWaTemplate('ucapan_ultah')">
            <div style="font-weight:800; color:#0f172a; font-size:13px;"><i class="fa-solid fa-cake-candles" style="color:#e11d48; margin-right:6px;"></i> Ucapan Ulang Tahun</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Bina hubungan baik dengan ucapan ultah &amp; gift</div>
          </div>

          <div class="template-card" onclick="selectWaTemplate('servis_rutin')">
            <div style="font-weight:800; color:#0f172a; font-size:13px;"><i class="fa-solid fa-screwdriver-wrench" style="color:#16a34a; margin-right:6px;"></i> Servis Rutin 1 Bulan</div>
            <div style="font-size:11px; color:#64748b; margin-top:2px;">Pengingat servis 1.000 KM / 1 Bulan gratis pertama</div>
          </div>
        </div>

        <!-- Right: Studio Editor -->
        <div style="background:#ffffff; border-radius:20px; padding:24px; border:1px solid #e2e8f0; box-shadow:0 10px 30px rgba(15,23,42,0.04);">
          <div style="display:flex; align-items:center; gap:10px; margin-bottom:18px; border-bottom:1px solid #f1f5f9; padding-bottom:12px;">
            <div style="width:36px; height:36px; border-radius:10px; background:#f0fdf4; color:#25D366; display:flex; align-items:center; justify-content:center; font-size:18px;">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h3 style="font-size:15px; font-weight:800; color:#0f172a; margin:0;">Sesuaikan Pesan Broadcast</h3>
              <p style="font-size:11.5px; color:#64748b; margin:0;">Ganti variabel nama &amp; model mobil sesuai konsumen Anda</p>
            </div>
          </div>

          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:14px;">
            <div>
              <label class="form-group-label">Nama Konsumen</label>
              <input type="text" id="waNamaInput" class="styled-input" value="Bapak Ahmad" oninput="renderWaPreview()">
            </div>
            <div>
              <label class="form-group-label">No. WhatsApp Konsumen</label>
              <input type="text" id="waPhoneInput" class="styled-input" placeholder="Cth: 08123456789">
            </div>
          </div>

          <div style="margin-bottom:14px;">
            <label class="form-group-label">Model Mobil Yg Diminati</label>
            <input type="text" id="waModelInput" class="styled-input" value="Innova Zenix Hybrid" oninput="renderWaPreview()">
          </div>

          <div style="margin-bottom:16px;">
            <label class="form-group-label">Pratinjau Teks Pesan WhatsApp</label>
            <div class="wa-preview-box">
              <div class="wa-bubble" id="waBubblePreview"></div>
            </div>
            <textarea id="waBodyTextarea" style="display:none;"></textarea>
          </div>

          <div style="display:flex; gap:12px; justify-content:flex-end;">
            <button class="btn" style="background:#f1f5f9; color:#334155; font-weight:700; font-size:13px; border:none; padding:12px 18px; border-radius:12px; cursor:pointer;" onclick="copyWaText()">
              <i class="fa-solid fa-copy" style="margin-right:6px;"></i> Salin Teks
            </button>
            <button class="btn" style="background:#25D366; color:white; font-weight:800; font-size:13.5px; border:none; padding:12px 24px; border-radius:12px; cursor:pointer; box-shadow:0 4px 14px rgba(37,211,102,0.3);" onclick="sendWaDirect()">
              <i class="fa-brands fa-whatsapp" style="font-size:17px; margin-right:6px;"></i> Kirim Ke WhatsApp Konsumen
            </button>
          </div>
        </div>
      </div>

      <!-- TAB 2: T-STOCK AI WHATSAPP BOT & WEBHOOK -->
      <div id="sectionAiBot" style="display: none;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;">

          <!-- Left: Webhook URL & Gateway Setup -->
          <div style="background: white; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15,23,42,0.04);">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #c8102e, #99001c); color: white; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                <i class="fa-solid fa-network-wired"></i>
              </div>
              <div>
                <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0;">Webhook Integrasi WhatsApp</h3>
                <p style="font-size: 11.5px; color: #64748b; margin: 0;">Sambungkan T-STOCK ke WhatsApp Gateway (Fonnte, Wablas, dll)</p>
              </div>
            </div>

            <!-- Webhook URL Box -->
            <div style="margin-bottom: 16px;">
              <label class="form-group-label">Endpoint Webhook URL (Auto-Reply)</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="waWebhookUrl" class="styled-input" readonly value="" style="background: #f1f5f9; font-family: monospace; font-size: 12px; color: #0f172a;">
                <button onclick="copyWebhookUrl()" style="background: #0f172a; color: white; border: none; padding: 0 16px; border-radius: 12px; font-weight: 700; font-size: 12.5px; cursor: pointer; white-space: nowrap;">
                  <i class="fa-solid fa-copy"></i> Salin
                </button>
              </div>
            </div>

            <!-- Panduan Integrasi -->
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin-bottom: 16px;">
              <div style="font-weight: 800; font-size: 12.5px; color: #0f172a; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <i class="fa-solid fa-circle-info" style="color: #0284c7;"></i> Cara Menyambungkan ke WhatsApp:
              </div>
              <ol style="font-size: 12px; color: #475569; margin: 0; padding-left: 18px; line-height: 1.6;">
                <li>Gunakan penyedia gateway WhatsApp (misal: <strong>Fonnte.com</strong>, <strong>Wablas.com</strong>, atau <strong>WA Cloud API</strong>).</li>
                <li>Buka menu <strong>Webhook / Auto-Responder</strong> di dashboard WhatsApp Gateway Anda.</li>
                <li>Tempelkan (Paste) <strong>Endpoint Webhook URL</strong> di atas ke kolom URL Webhook.</li>
                <li>Setiap pesan masuk dari konsumen (misal: <em>"stok alphard putih"</em>) akan langsung otomatis dibalas oleh <strong>T-STOCK AI</strong> dengan format WhatsApp rapi!</li>
              </ol>
            </div>

            <!-- Status Gateway -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px;">
              <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; color: #065f46;">
                <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981; display: inline-block;"></span>
                Endpoint Bot Aktif &amp; Siap Menerima Request
              </div>
              <span style="font-size: 11px; font-weight: 800; color: #047857; background: white; padding: 2px 8px; border-radius: 8px; border: 1px solid #a7f3d0;">JSON REST</span>
            </div>
          </div>

          <!-- Right: Live WhatsApp Bot Simulator -->
          <div style="background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15,23,42,0.04);">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 38px; height: 38px; border-radius: 10px; background: #25D366; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                  <i class="fa-brands fa-whatsapp"></i>
                </div>
                <div>
                  <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0;">Simulator Chat WhatsApp Bot</h3>
                  <p style="font-size: 11.5px; color: #64748b; margin: 0;">Uji coba balasan otomatis T-STOCK sebelum dipublikasikan</p>
                </div>
              </div>
            </div>

            <!-- Mock WhatsApp Chat Container -->
            <div style="background: #efeae2; border: 1px solid #cbd5e1; border-radius: 16px; height: 320px; overflow-y: auto; padding: 14px; display: flex; flex-direction: column; gap: 10px;" id="waBotSimulatorHistory">
              <div style="background: white; border-radius: 12px 12px 12px 0; padding: 10px 14px; font-size: 12px; color: #111b21; max-width: 85%; align-self: flex-start; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                👋 Halo! Saya <strong>T-STOCK WhatsApp Auto-Bot</strong>.<br><br>
                Ketik pertanyaan stok (contoh: <em>"stok veloz putih"</em>, <em>"cek stok zenix"</em>, <em>"stok alphard ready"</em>) di bawah untuk menguji balasan otomatis.
              </div>
            </div>

            <!-- Simulator Input -->
            <div style="display: flex; gap: 8px; margin-top: 12px;">
              <input type="text" id="waBotSimInput" class="styled-input" placeholder="Ketik pesan simulasi WhatsApp konsumen..." onkeypress="if(event.key==='Enter') sendSimulatedWaMessage()">
              <button onclick="sendSimulatedWaMessage()" style="background: #25D366; color: white; border: none; width: 44px; height: 44px; border-radius: 12px; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
                <i class="fa-solid fa-paper-plane"></i>
              </button>
            </div>

            <!-- Quick Test Chips -->
            <div style="display: flex; gap: 6px; margin-top: 10px; overflow-x: auto; padding-bottom: 4px;">
              <button onclick="simQuick('stok alphard ready')" style="font-size: 11px; padding: 3px 9px; border-radius: 8px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer; white-space: nowrap;">🚗 Stok Alphard</button>
              <button onclick="simQuick('stok veloz putih')" style="font-size: 11px; padding: 3px 9px; border-radius: 8px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer; white-space: nowrap;">🚗 Veloz Putih</button>
              <button onclick="simQuick('cek stok zenix')" style="font-size: 11px; padding: 3px 9px; border-radius: 8px; background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer; white-space: nowrap;">🚗 Stok Zenix</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: AI SENTINEL LAPORAN 5-HARIAN KACAB -->
      <div id="sectionSentinel" class="wa-container" style="display: none;">
        <!-- Left Column: Sentinel Rules & Settings -->
        <div style="background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15,23,42,0.04);">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 10px; background: #e0e7ff; color: #4338ca; display: flex; align-items: center; justify-content: center; font-size: 18px;">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0;">AI Sentinel: Aturan 5-Harian Kacab</h3>
              <p style="font-size: 11.5px; color: #64748b; margin: 0;">Early Warning System target minimal berjenjang SPK/DO</p>
            </div>
          </div>

          <!-- Rules Summary -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px; margin-bottom: 16px;">
            <div style="font-size: 12px; font-weight: 800; color: #1e293b; margin-bottom: 6px;">
              <i class="fa-solid fa-list-ol" style="color: #4f46e5;"></i> Skema Evaluasi 5-Harian:
            </div>
            <ul style="font-size: 11.5px; color: #475569; margin: 0; padding-left: 18px; line-height: 1.6;">
              <li><strong>Hari 1 - 5:</strong> Minimal aktual <strong>1 SPK/DO</strong> (Jika 0 ➡️ Lapor WA Kacab)</li>
              <li><strong>Hari 6 - 10:</strong> Minimal aktual <strong>2 SPK/DO</strong> (Jika &lt; 2 ➡️ Lapor WA Kacab)</li>
              <li><strong>Hari 11 - 15:</strong> Minimal aktual <strong>3 SPK/DO</strong> (Jika &lt; 3 ➡️ Lapor WA Kacab)</li>
              <li><strong>Hari 16 - 20:</strong> Minimal aktual <strong>4 SPK/DO</strong> (Jika &lt; 4 ➡️ Lapor WA Kacab)</li>
              <li><strong>Hari 21 - 25:</strong> Minimal aktual <strong>5 SPK/DO</strong> (Jika &lt; 5 ➡️ Lapor WA Kacab)</li>
              <li><strong>Hari 26 - 31:</strong> Minimal aktual <strong>6 SPK/DO</strong> (Jika &lt; 6 ➡️ Lapor WA Kacab)</li>
            </ul>
          </div>

          <!-- Simulation Selector -->
          <div style="margin-bottom: 16px;">
            <label class="form-group-label">Pilih Hari / Ritme Evaluasi:</label>
            <select id="sentinelStudioDaySelect" class="styled-input" onchange="fetchSentinelStudioReport(this.value)">
              <option value="">Memuat tanggal hari ini...</option>
            </select>
          </div>

          <!-- Cron / Automation Guide -->
          <div style="background: #eef2ff; border: 1px solid #c7d2fe; border-radius: 12px; padding: 14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <div style="font-size: 12px; font-weight: 800; color: #3730a3;">
                <i class="fa-solid fa-clock"></i> Jadwal Otomatis: 06:00 WIB Setiap Hari
              </div>
              <span style="background:#dcfce7; color:#166534; font-size:10px; font-weight:800; padding:2px 6px; border-radius:4px; border:1px solid #bbf7d0;">
                🟢 Active
              </span>
            </div>
            <code style="font-size: 11px; color: #1e1b4b; word-break: break-all; display: block; background: white; padding: 6px 8px; border-radius: 6px; border: 1px solid #c7d2fe;" id="sentinelCronUrl">
              http://localhost/sft/api/api_cron_kacab_sentinel.php
            </code>
            <p style="font-size: 11px; color: #4338ca; margin: 6px 0 0;">
              Otomasi Windows Scheduler (<code>SFT_AI_Sentinel_Kacab_06AM</code>) telah aktif di server untuk auto-audit pukul 06.00 WIB setiap pagi.
            </p>
          </div>
        </div>

        <!-- Right Column: Live WhatsApp Bubble Preview -->
        <div style="background: #ffffff; border-radius: 20px; padding: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(15,23,42,0.04);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <div style="width: 38px; height: 38px; border-radius: 10px; background: #25D366; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                <i class="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <h3 style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0;">Preview Pesan WhatsApp ke Kacab</h3>
                <p style="font-size: 11.5px; color: #64748b; margin: 0;">Tampilan laporan AI yang akan diterima langsung oleh Kacab</p>
              </div>
            </div>
          </div>

          <div class="wa-preview-box" style="height: 350px; overflow-y: auto;">
            <div class="wa-bubble" id="sentinelWaBubble">
              <i class="fa-solid fa-spinner fa-spin"></i> Memuat laporan AI Sentinel...
            </div>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 16px;">
            <button onclick="copySentinelWaReport()" class="btn btn-ghost" style="flex: 1; padding: 12px; font-size: 13px; font-weight: 700; border-radius: 12px; border: 1.5px solid #cbd5e1; background: white; cursor: pointer;">
              <i class="fa-solid fa-copy"></i> Salin Teks Laporan
            </button>
            <button onclick="sendSentinelWaDirect()" class="btn btn-success" style="flex: 1.5; padding: 12px; font-size: 13px; font-weight: 800; border-radius: 12px; background: #25D366; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 12px rgba(37,211,102,0.3);">
              <i class="fa-brands fa-whatsapp" style="font-size: 16px;"></i> Kirim Langsung ke WA Kacab
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>

  <script src="../js/wa_studio.js?v=20260831_sentinel_realtime"></script>
</body>
</html>
