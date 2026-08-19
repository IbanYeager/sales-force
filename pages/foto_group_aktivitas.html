<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Kelola Foto Grup Aktivitas WA</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css" />
  <script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#25d366">

  <style>
    .wa-manager-hero {
      background: linear-gradient(135deg, #075e54 0%, #128c7e 50%, #25d366 100%);
      border-radius: 20px;
      padding: 22px 24px;
      color: #ffffff;
      margin-bottom: 22px;
      box-shadow: 0 10px 30px rgba(7, 94, 84, 0.25);
    }

    .wa-sync-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 18px;
      padding: 18px 20px;
      margin-bottom: 20px;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
    }

    .step-badge {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #128c7e;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 800;
      flex-shrink: 0;
    }

    .dropzone-upload {
      border: 2px dashed #128c7e;
      background: #f0fdf4;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropzone-upload:hover {
      background: #dcfce7;
      border-color: #059669;
    }

    .photo-sync-item {
      display: flex;
      gap: 16px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 12px;
      margin-bottom: 12px;
      align-items: center;
      transition: all 0.2s ease;
    }

    .photo-sync-item:hover {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
      border-color: #cbd5e1;
    }

    .photo-sync-thumb {
      width: 85px;
      height: 85px;
      border-radius: 10px;
      object-fit: cover;
      flex-shrink: 0;
      background: #f1f5f9;
      cursor: pointer;
    }

    .badge-synced {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      background: #dcfce7;
      color: #166534;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .badge-unsynced {
      font-size: 10px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 6px;
      background: #fef3c7;
      color: #92400e;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 640px) {
      .photo-sync-item {
        flex-direction: column;
        align-items: flex-start;
      }
      .photo-sync-thumb {
        width: 100%;
        height: 140px;
      }
    }
  </style>
</head>

<body>
  <div class="mobile-app" style="padding-bottom: 80px;">
    
    <!-- Top Header -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Kelola Foto Grup Aktivitas</h2>
      <a href="riwayat_foto_aktivitas.html" style="font-size: 12px; font-weight: 700; color: #128c7e; text-decoration: none;">
        <i class="fa-solid fa-images"></i> Galeri
      </a>
    </header>

    <div class="container" style="margin-top: 15px;">
      
      <!-- Hero Banner -->
      <div class="wa-manager-hero">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 14px;">
          <div>
            <span style="background: rgba(255,255,255,0.25); color: #ffffff; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">
              <i class="fa-brands fa-whatsapp"></i> WhatsApp Activity Hub
            </span>
            <h2 style="font-size: 18px; font-weight: 900; margin: 8px 0 4px; color: #ffffff;">
              Pusat Sinkronisasi Foto Grup Aktivitas WA
            </h2>
            <p style="font-size: 12px; color: #e6fffa; margin: 0; line-height: 1.4;">
              Otomatisasi foto kegiatan lapangan dari grup WhatsApp menjadi laporan aktivitas resmi &amp; arsip galeri.
            </p>
          </div>

          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <button type="button" class="btn-main" style="background: #ffffff; color: #075e54; padding: 9px 16px; font-size: 12px; font-weight: 900;" onclick="bulkSyncAllPhotos()">
              <i class="fa-solid fa-bolt"></i> Sinkronkan Semua ke DB
            </button>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 10px; margin-top: 16px;">
          <div style="background: rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 12px; backdrop-filter: blur(4px);">
            <div style="font-size: 18px; font-weight: 900;" id="statTotalPhotos">0</div>
            <div style="font-size: 10.5px; opacity: 0.9;">Total Foto di Folder</div>
          </div>
          <div style="background: rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 12px; backdrop-filter: blur(4px);">
            <div style="font-size: 18px; font-weight: 900;" id="statTotalSynced">0</div>
            <div style="font-size: 10.5px; opacity: 0.9;">Tersinkron ke Database</div>
          </div>
        </div>
      </div>

      <!-- CARA CEPAT MENGAMBIL FOTO & MENGETAHUI NAMA SALES -->
      <div class="wa-sync-card" style="border-left: 4px solid #128c7e;">
        <h4 style="margin: 0 0 10px 0; font-size: 14px; color: #075e54; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-bolt-lightning"></i>
          3 Cara Tercepat Mengambil Foto &amp; Tahu Nama Sales di Grup WA
        </h4>
        
        <div style="display: flex; flex-direction: column; gap: 12px; margin-top: 12px;">
          
          <!-- Cara 1 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: flex-start;">
            <span class="step-badge">1</span>
            <div style="font-size: 12px; color: #334155; line-height: 1.5;">
              <strong style="color: #0f172a; font-size: 12.5px;">Fitur "Export Chat + Media" di HP (Paling Praktis Sekali Unduh)</strong>
              <div style="color: #64748b; margin-top: 3px;">
                Buka Grup WA di HP &rarr; Titik Tiga (<i class="fa-solid fa-ellipsis-vertical"></i>) &rarr; <b>Lainnya</b> &rarr; <b>Ekspor Chat</b> &rarr; Pilih <b>Sertakan Media (Include Media)</b>.
                Anda akan mendapatkan 1 file ZIP berisi <i>seluruh foto</i> dan 1 file <code>_chat.txt</code> yang mencantumkan nama sales dan jam pengiriman persis di tiap foto.
              </div>
            </div>
          </div>

          <!-- Cara 2 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: flex-start;">
            <span class="step-badge">2</span>
            <div style="font-size: 12px; color: #334155; line-height: 1.5;">
              <strong style="color: #0f172a; font-size: 12.5px;">Buka WhatsApp Web &rarr; Tab "Media, Tautan &amp; Dokumen" di Laptop</strong>
              <div style="color: #64748b; margin-top: 3px;">
                Klik nama grup di WA Web &rarr; buka tab <b>Media</b>. Saat foto diklik, di pojok atas akan tertulis <b>"Dikirim oleh [Nama Sales]"</b> beserta jamnya. Anda juga bisa menyeleksi banyak foto sekaligus dan klik <b>Download</b>.
              </div>
            </div>
          </div>

          <!-- Cara 3 -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; display: flex; gap: 12px; align-items: flex-start;">
            <span class="step-badge">3</span>
            <div style="font-size: 12px; color: #334155; line-height: 1.5;">
              <strong style="color: #0f172a; font-size: 12.5px;">Gunakan Kotak "Smart Chat Parser" di Bawah</strong>
              <div style="color: #64748b; margin-top: 3px;">
                Salin (copy-paste) riwayat chat grup WhatsApp ke kotak parser di bawah. Sistem akan otomatis membedah nama sales, waktu kirim, dan mencocokkannya ke database.
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- KOTAK SMART CHAT PARSER (AUTO MATCH NAMA SALES & WAKTU) -->
      <div class="wa-sync-card">
        <h4 style="margin: 0 0 8px 0; font-size: 13.5px; color: #0f172a; display: flex; align-items: center; gap: 6px;">
          <i class="fa-solid fa-wand-magic-sparkles" style="color: #128c7e;"></i>
          Smart WhatsApp Chat Parser (Deteksi Nama Sales Otomatis)
        </h4>
        <p style="font-size: 12px; color: #64748b; margin: 0 0 10px 0;">
          Paste teks chat grup WhatsApp atau isi file <code>_chat.txt</code> di sini untuk otomatis membaca nama sales dan waktu kirim:
        </p>

        <textarea id="chatInputArea" placeholder="Contoh format teks WA:
[17/08/26 16.32.33] Egy: Canvassing Kiara Condong
[17/08/26 08.01.24] Rian: Showroom Duty Pagi
16/08/2026, 09:25 - Budi Sales: Follow Up Customer" style="width: 100%; height: 95px; border-radius: 12px; border: 1.5px solid #cbd5e1; padding: 10px 12px; font-size: 12px; font-family: monospace; outline: none; box-sizing: border-box; background: #f8fafc; resize: vertical;"></textarea>

        <div style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
          <button type="button" class="btn-secondary" style="padding: 7px 14px; font-size: 11.5px;" onclick="document.getElementById('chatInputArea').value = ''">
            Bersihkan
          </button>
          <button type="button" class="btn-main" style="background: #128c7e; padding: 7px 16px; font-size: 11.5px; font-weight: 800;" onclick="parseChatText()">
            <i class="fa-solid fa-magnifying-glass"></i> Parse &amp; Cocokkan Nama Sales
          </button>
        </div>

        <div id="parseResultContainer" style="margin-top: 12px; display: none;"></div>
      </div>

      <!-- Upload New Photo Box -->
      <div class="wa-sync-card">
        <h4 style="margin: 0 0 10px 0; font-size: 13.5px; color: #0f172a;">
          <i class="fa-solid fa-cloud-arrow-up" style="color: #25d366;"></i> Tambah Foto Kegiatan Baru dari WA
        </h4>
        <div class="dropzone-upload" onclick="document.getElementById('fileUploadInput').click()">
          <input type="file" id="fileUploadInput" accept="image/*" style="display: none;" onchange="handleDirectUpload(this)">
          <i class="fa-solid fa-images" style="font-size: 32px; color: #128c7e; margin-bottom: 8px;"></i>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Klik atau Drag &amp; Drop Foto di Sini</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 4px;">File akan langsung tersimpan ke folder <code>aktivitas/</code></div>
        </div>
      </div>

      <!-- Daftar Foto Grup WA -->
      <div class="section-header-row" style="margin-top: 10px;">
        <h3 class="section-title" style="margin-bottom: 0;">
          <i class="fa-solid fa-list-check" style="color: #128c7e; margin-right: 6px;"></i>
          Daftar Foto di Folder Aktivitas
        </h3>
        <span style="font-size: 12px; font-weight: 700; color: #64748b;" id="listCounterLabel">Memuat data...</span>
      </div>

      <div id="photosListContainer" style="margin-top: 12px;">
        <div style="text-align: center; padding: 40px; color: #64748b; font-size: 13px;">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 24px; color: #128c7e; margin-bottom: 8px;"></i><br>
          Memuat daftar foto aktivitas...
        </div>
      </div>

    </div>
  </div>

  <script src="../custom_alert.js"></script>
  <script>
    let photoData = [];

    async function loadWaPhotos() {
      const container = document.getElementById('photosListContainer');
      try {
        const res = await fetch('../api/api_sync_wa_aktivitas.php?action=list');
        const json = await res.json();

        if (json.status === 'success') {
          photoData = json.photos || [];
          document.getElementById('statTotalPhotos').textContent = json.total_photos || 0;
          document.getElementById('statTotalSynced').textContent = json.total_synced || 0;
          document.getElementById('listCounterLabel').textContent = `${photoData.length} File Foto`;

          renderPhotoList();
        } else {
          container.innerHTML = '<div style="color:red; text-align:center; padding:30px;">Gagal memuat data foto.</div>';
        }
      } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="color:red; text-align:center; padding:30px;">Kesalahan jaringan saat memuat data.</div>';
      }
    }

    function renderPhotoList() {
      const container = document.getElementById('photosListContainer');
      if (!container) return;

      if (photoData.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:30px; background:#fff; border-radius:14px; border:1px dashed #cbd5e1;">Folder aktivitas kosong.</div>';
        return;
      }

      let html = '';
      photoData.forEach((item, idx) => {
        const encodedUrl = '../' + item.file_url;
        const badge = item.is_synced 
          ? `<span class="badge-synced"><i class="fa-solid fa-circle-check"></i> Sudah Masuk Database</span>` 
          : `<span class="badge-unsynced"><i class="fa-solid fa-clock"></i> Belum Disinkronkan</span>`;

        const currentSales = (item.synced_data && item.synced_data.nama_sales) ? item.synced_data.nama_sales : (localStorage.getItem('namaSales') || 'Egy');

        html += `
          <div class="photo-sync-item">
            <img class="photo-sync-thumb" src="${encodedUrl}" alt="${item.file_name}" loading="lazy" onclick="window.open('${encodedUrl}','_blank')">
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                ${badge}
                <span style="font-size: 11px; font-weight: 800; color: #075e54;">🌅 Sesi ${item.session}</span>
                <span style="font-size: 11px; color: #64748b;">📅 ${item.date} (${item.time} WIB)</span>
              </div>
              <div style="font-size: 12px; font-weight: 700; color: #0f172a; margin-top: 4px; word-break: break-all;">
                ${item.file_name}
              </div>
              <div style="display: flex; gap: 10px; margin-top: 4px; align-items: center; font-size: 11.5px;">
                <span style="color: #475569;">Sales: <strong style="color: #0f172a;">${currentSales}</strong></span>
                <span style="color: #94a3b8;">&bull;</span>
                <span style="color: #64748b;">Ukuran: ${item.size_kb} KB</span>
              </div>
            </div>
            <div style="flex-shrink: 0;">
              <button type="button" class="btn-main" style="background: ${item.is_synced ? '#075e54' : '#128c7e'}; font-size: 11.5px; padding: 7px 14px;" onclick="syncSinglePhoto('${item.file_name.replace(/'/g, "\\'")}', '${currentSales}')">
                <i class="fa-solid ${item.is_synced ? 'fa-rotate' : 'fa-plus'}"></i> ${item.is_synced ? 'Update DB' : 'Sinkronkan'}
              </button>
            </div>
          </div>
        `;
      });

      container.innerHTML = html;
    }

    async function syncSinglePhoto(fileName, salesName) {
      const defaultSales = salesName || localStorage.getItem('namaSales') || 'Egy';
      const salesId = localStorage.getItem('salesAccountId') || 10;

      const fd = new FormData();
      fd.append('action', 'sync_single');
      fd.append('file_name', fileName);
      fd.append('nama_sales', defaultSales);
      fd.append('sales_account_id', salesId);
      fd.append('tipe_aktivitas', 'Canvassing Lapangan');
      fd.append('keterangan', 'Dokumentasi kegiatan WhatsApp Sales');
      fd.append('lokasi', 'Wilayah Kiara Condong & Sekitarnya');

      try {
        const res = await fetch('../api/api_sync_wa_aktivitas.php', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.status === 'success') {
          if (window.showCustomAlert) window.showCustomAlert(json.message, 'success');
          else alert(json.message);
          loadWaPhotos();
        } else {
          alert("Gagal: " + json.message);
        }
      } catch (e) {
        alert("Terjadi kesalahan koneksi");
      }
    }

    async function bulkSyncAllPhotos() {
      if (!confirm("Sinkronkan seluruh foto di folder aktivitas ke tabel database aktivitas?")) return;

      const namaSales = localStorage.getItem('namaSales') || 'Egy';
      const salesId = localStorage.getItem('salesAccountId') || 10;

      const fd = new FormData();
      fd.append('action', 'sync_all_bulk');
      fd.append('nama_sales', namaSales);
      fd.append('sales_account_id', salesId);

      try {
        const res = await fetch('../api/api_sync_wa_aktivitas.php', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.status === 'success') {
          if (window.showCustomAlert) window.showCustomAlert(json.message, 'success');
          else alert(json.message);
          loadWaPhotos();
        } else {
          alert("Gagal: " + json.message);
        }
      } catch (e) {
        alert("Terjadi kesalahan koneksi");
      }
    }

    async function parseChatText() {
      const text = document.getElementById('chatInputArea').value;
      const resContainer = document.getElementById('parseResultContainer');

      if (!text.trim()) {
        alert("Silakan tempel (paste) teks chat grup WhatsApp terlebih dahulu.");
        return;
      }

      const fd = new FormData();
      fd.append('action', 'parse_chat_log');
      fd.append('chat_text', text);

      try {
        const res = await fetch('../api/api_sync_wa_aktivitas.php', { method: 'POST', body: fd });
        const json = await res.json();

        if (json.status === 'success' && json.parsed_messages.length > 0) {
          resContainer.style.display = 'block';
          let tblHtml = `
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px; margin-top: 10px;">
              <div style="font-weight: 800; color: #166534; font-size: 12.5px; margin-bottom: 8px;">
                <i class="fa-solid fa-circle-check"></i> Berhasil mendeteksi ${json.parsed_messages.length} pesan aktivitas dari chat:
              </div>
              <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
                <thead>
                  <tr style="background: #dcfce7; text-align: left;">
                    <th style="padding: 6px 8px;">Waktu</th>
                    <th style="padding: 6px 8px;">Nama Sales</th>
                    <th style="padding: 6px 8px;">Pesan / Kegiatan</th>
                  </tr>
                </thead>
                <tbody>
          `;

          json.parsed_messages.forEach(m => {
            tblHtml += `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 6px 8px; color: #64748b;">${m.date} ${m.time}</td>
                <td style="padding: 6px 8px; font-weight: 700; color: #0f172a;">${m.sender}</td>
                <td style="padding: 6px 8px; color: #334155;">${m.message}</td>
              </tr>
            `;
          });

          tblHtml += `</tbody></table></div>`;
          resContainer.innerHTML = tblHtml;
        } else {
          resContainer.style.display = 'block';
          resContainer.innerHTML = '<div style="color: #b91c1c; font-size: 12px; padding: 10px; background: #fef2f2; border-radius: 8px; margin-top: 8px;">Tidak ada format chat pesan yang cocok. Pastikan format teks seperti <code>[17/08/26 16.32.33] NamaSales: Pesan</code></div>';
        }
      } catch (e) {
        alert("Gagal mem-parsing teks chat.");
      }
    }

    async function handleDirectUpload(input) {
      if (!input.files || input.files.length === 0) return;
      const file = input.files[0];

      const fd = new FormData();
      fd.append('action', 'upload_new_photo');
      fd.append('photo_file', file);

      try {
        const res = await fetch('../api/api_sync_wa_aktivitas.php', { method: 'POST', body: fd });
        const json = await res.json();
        if (json.status === 'success') {
          if (window.showCustomAlert) window.showCustomAlert("Foto berhasil diunggah ke folder aktivitas!", 'success');
          else alert("Foto berhasil diunggah!");
          input.value = '';
          loadWaPhotos();
        } else {
          alert("Upload gagal: " + json.message);
        }
      } catch (e) {
        alert("Terjadi kesalahan saat mengunggah foto");
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      loadWaPhotos();
    });
  </script>
</body>

</html>
