<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Input Aktivitas & Laporan Sesi</title>

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/input.css">
    <link rel="stylesheet" href="../css/sales_tools.css?v=1.0">
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="camera-flash" id="cameraFlash"></div>

    <div class="mobile-app" style="padding-bottom: 45px;">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Input & Laporan Aktivitas</h2>
        </header>

        <div class="container" style="margin-top: 20px;">
            <!-- VOICE-TO-ACTIVITY AI LOGGER BANNER -->
            <div style="background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #c8102e 100%); color: white; border-radius: 18px; padding: 18px 20px; margin-bottom: 16px; box-shadow: 0 8px 25px rgba(13,27,62,0.18); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
                <div>
                    <span style="background: rgba(255,255,255,0.2); color: #86efac; font-size: 10.5px; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase;">
                        <i class="fa-solid fa-microphone-lines"></i> AI Smart Voice Logger
                    </span>
                    <h3 style="font-size: 16px; font-weight: 800; margin: 6px 0 2px; color: white;">Dikte Laporan Lapangan via Suara</h3>
                    <p style="font-size: 12px; color: #cbd5e1; margin: 0;">Tekan tombol mic &amp; bicara bebas. AI akan mengisi form &amp; kategori otomatis.</p>
                </div>
                <button type="button" onclick="startVoiceToActivity()" style="background: linear-gradient(135deg, #22c55e, #16a34a); color: white; border: none; padding: 10px 18px; border-radius: 12px; font-size: 12.5px; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(34,197,94,0.35); transition: all 0.2s;">
                    <i class="fa-solid fa-microphone"></i> Mulai Bicara
                </button>
            </div>

            <!-- Quick Link to Gallery -->
            <a href="riwayat_foto_aktivitas.html" style="display: flex; justify-content: space-between; align-items: center; background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 16px; margin-bottom: 20px; text-decoration: none; box-shadow: 0 2px 8px rgba(0,0,0,0.03); transition: all 0.2s ease;">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 38px; height: 38px; border-radius: 10px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 16px;">
                        <i class="fa-solid fa-images"></i>
                    </div>
                    <div>
                        <div style="font-size: 13px; font-weight: 800; color: #0f172a;">Lihat Riwayat Galeri Foto Aktivitas</div>
                        <div style="font-size: 11px; color: #64748b;">Arsip 51 foto kegiatan sales &amp; canvassing yang telah terlewat</div>
                    </div>
                </div>
                <i class="fa-solid fa-chevron-right" style="color: #94a3b8; font-size: 12px;"></i>
            </a>

            <h3 class="section-title" style="margin-bottom: 5px;">Isi Aktivitas Anda</h3>
            <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 25px;">Lengkapi informasi aktivitas dan foto kegiatan Anda saat ini.</p>

            <form id="formAktivitas">
                <div class="form-group">
                    <label>Sesi Waktu Aktivitas <span style="color: var(--primary-red);">*</span></label>
                    <select id="sesiWaktuAktivitas" class="form-control" disabled style="background: #f1f5f9; color: #0f172a; font-weight: 700; cursor: not-allowed; opacity: 0.9;">
                        <option value="Pagi">Sesi Pagi (08:00 - 12:00)</option>
                        <option value="Siang">Sesi Siang (12:00 - 15:00)</option>
                        <option value="Sore">Sesi Sore / Malam (15:00 - 18:00+)</option>
                    </select>
                    <span style="font-size: 11px; color: #475569; font-weight: 600; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-lock" style="color: #0284c7;"></i> Dikunci otomatis oleh sistem berdasarkan jam real-time saat ini
                    </span>
                </div>

                <div class="form-group">
                    <label>Durasi Kegiatan</label>
                    <select id="durasiAktivitas" class="form-control">
                        <option value="30 Menit">30 Menit</option>
                        <option value="1 Jam" selected>1 Jam</option>
                        <option value="1.5 Jam">1.5 Jam</option>
                        <option value="2 Jam">2 Jam (misal: Live 2 Jam)</option>
                        <option value="3 Jam">3 Jam</option>
                        <option value="4+ Jam">4+ Jam</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Jenis Aktivitas (Kategori SPM) <span style="color: var(--primary-red);">*</span></label>
                    <select id="jenisAktivitas" class="form-control" onchange="handleJenisAktivitasChange()" required>
                        <option value="" disabled selected>Pilih kategori aktivitas...</option>
                        <option value="Digital Marketing">Digital Marketing (Website, FB, IG)</option>
                        <option value="LIVE Tiktok">LIVE Tiktok</option>
                        <option value="Walk in / Call in">Walk in / Call in</option>
                        <option value="Customer Gathering & Event">Customer Gathering & Showroom Event</option>
                        <option value="Pameran">Pameran (Exhibition)</option>
                        <option value="Residensial & FOA">Residensial & FOA (Field Operation)</option>
                        <option value="Database">Database (Bengkel/BP, Trade-in)</option>
                        <option value="Referensi & RO">Referensi & RO (Repeat Order)</option>
                        <option value="Fleet / Corporate">Fleet / Corporate</option>
                    </select>
                </div>

                <div class="form-group" id="groupSubJenis" style="display: none;">
                    <label>Detail / Lokasi Aktivitas <span style="color: var(--primary-red);">*</span></label>
                    <select id="subJenisAktivitas" class="form-control" onchange="updateKeteranganFromSub()">
                        <option value="" selected>Pilih detail lokasi/target...</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Status Aktivitas <span style="color: var(--primary-red);">*</span></label>
                    <select id="statusAktivitas" class="form-control" onchange="togglePhotoRequirement()" required>
                        <option value="Sedang Dilakukan" selected>Sedang Dilakukan</option>
                        <option value="Rencana">Rencana (Plan)</option>
                    </select>
                </div>

                <div class="form-group">
                    <div class="voice-input-header">
                        <label style="margin-bottom: 0; font-weight: 800; font-size: 13.5px; color: #1e293b;">
                            <i class="fa-solid fa-pen-to-square" style="color: var(--primary-red); margin-right: 4px;"></i> Keterangan Aktivitas <span style="color: var(--primary-red);">*</span>
                        </label>
                        <button type="button" class="btn-voice-pill" id="btnVoiceAktivitas" title="Bicara untuk membuat laporan suara">
                            <i class="fa-solid fa-microphone"></i>
                            <span>Dikte Suara (Mic)</span>
                        </button>
                    </div>
                    <textarea id="keteranganAktivitas" class="form-control" placeholder="Tuliskan detail aktivitas di lapangan atau klik tombol 'Dikte Suara' untuk bicara langsung..." required rows="3" style="font-size: 13.5px; line-height: 1.6;"></textarea>
                    <div id="voiceStatusPillAktivitas" class="voice-live-status-box" style="display:none;"></div>
                </div>

                <div class="form-group">
                    <label>Lokasi <span style="color: var(--primary-red);">*</span></label>
                    <div class="lokasi-box">
                        <div style="display: flex; align-items: flex-start; gap: 12px; width: 100%;">
                            <div style="background: #fef2f2; color: var(--primary-red); width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fa-solid fa-location-dot"></i>
                            </div>
                            <div class="lokasi-text" id="lokasiValue">
                                <p>Menunggu akses lokasi...</p>
                                <span>Mengambil GPS...</span>
                            </div>
                        </div>
                        <button type="button" class="btn-lokasi" onclick="getLocation()">Perbarui</button>
                    </div>
                    <div id="map-container"></div>
                </div>

                <div class="form-group">
                    <label style="display: flex; justify-content: space-between; align-items: center;">
                        <span>Foto Aktivitas <span id="photoLabelAsterisk" style="color: var(--primary-red);">*</span></span>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: 500;" id="photoCount">0/5 Foto</span>
                    </label>

                    <div class="photo-grid" id="photoGrid">
                        <div class="upload-btn-box" id="uploadButtonBox" onclick="document.getElementById('inputFoto_camera').click()">
                            <i class="fa-solid fa-camera"></i>
                            <span>Tambah</span>
                        </div>
                    </div>
                    <input type="file" id="inputFoto" accept="image/*" multiple hidden onchange="handleNewFiles(event)">
                    <input type="file" id="inputFoto_camera" accept="image/*" capture="environment" hidden onchange="handleNewFiles(event)">
                </div>

                <div class="form-group" style="margin-top: 32px; margin-bottom: 10px;">
                    <button type="button" class="btn-main" id="btnSubmit" onclick="simpanAktivitasBaru()" style="justify-content: center; background: linear-gradient(135deg, var(--primary-blue), var(--accent-blue)); box-shadow: var(--shadow-blue); width: 100%; margin-bottom: 10px;">
                        <i class="fa-regular fa-paper-plane"></i>
                        <span>Simpan Aktivitas</span>
                    </button>
                    
                    <button type="button" class="btn-outline-blue" onclick="generateDailyReport()" style="width: 100%; justify-content: center;">
                        <i class="fa-brands fa-whatsapp" style="color: #25D366;"></i>
                        <span>Buat Laporan Harian (WA)</span>
                    </button>

                    <p style="text-align: center; font-size: 11px; color: var(--text-muted); margin-top: 12px; font-weight: 500; margin-bottom: 0;">
                        <i class="fa-solid fa-shield-halved" style="color: var(--green-success); margin-right: 4px;"></i>
                        Aktivitas direkam otomatis ke sistem database
                    </p>
                </div>
            </form>

            <!-- Daily Activity Session Timeline -->
            <div class="card" style="margin-top: 24px; padding: 20px; border-radius: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <h3 class="section-title" style="margin: 0; font-size: 15px;">Timeline Sesi Aktivitas Saya</h3>
                        <p style="font-size: 11px; color: var(--text-muted); margin: 2px 0 0 0;">Monitoring aktivitas pribadi &amp; laporan hasil per Sesi Pagi, Siang &amp; Sore.</p>
                    </div>
                    <span id="sessionSummaryBadge" style="font-size: 11px; font-weight: 700; background: #e2e8f0; color: #334155; padding: 4px 10px; border-radius: 20px;">0 Aktivitas</span>
                </div>

                <!-- Session Filter Tabs -->
                <div class="session-tab-bar">
                    <button class="session-tab-btn active" onclick="switchSessionTab('All', this)">Semua Sesi</button>
                    <button class="session-tab-btn" onclick="switchSessionTab('Pagi', this)">🌅 Pagi</button>
                    <button class="session-tab-btn" onclick="switchSessionTab('Siang', this)">☀️ Siang</button>
                    <button class="session-tab-btn" onclick="switchSessionTab('Sore', this)">🌆 Sore</button>
                </div>

                <!-- Session Activity List Container -->
                <div id="sessionActivityList">
                    <p style="text-align: center; color: var(--text-muted); padding: 20px; font-size: 13px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat aktivitas...</p>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Modal Export WA -->
    <div class="modal-overlay" id="exportModal" onclick="closeExportModal()">
      <div class="modal-content" onclick="event.stopPropagation()">
        <div class="modal-header">
          <h3>Laporan Harian</h3>
          <button class="btn-close-modal" onclick="closeExportModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <p style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">Salin teks di bawah ini dan kirimkan ke grup WhatsApp atau SPV Anda.</p>
        <textarea id="reportText" class="form-control" rows="10" style="font-size:12px; line-height:1.5; font-family:monospace; background:#f8fafc;" readonly></textarea>
        <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px; background:#25D366;" onclick="copyToClipboard()">
          <i class="fa-regular fa-copy"></i> Copy Teks Laporan
        </button>
      </div>
    </div>

    <!-- Modal Submit Laporan Hasil Aktivitas -->
    <div class="modal-overlay" id="laporanModal" onclick="closeLaporanModal()">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 480px;">
        <div class="modal-header">
          <h3 style="font-size: 16px; display: flex; align-items: center; gap: 8px;"><i class="fa-solid fa-file-circle-check" style="color: #10b981;"></i> Submit Laporan Hasil Aktivitas</h3>
          <button class="btn-close-modal" onclick="closeLaporanModal()"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <form id="formLaporanHasil" onsubmit="submitLaporanHasilAktivitas(event)">
          <input type="hidden" id="laporanAktivitasId">
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size:12px; font-weight:700; color:#475569; margin-bottom: 4px; display: block;">Jenis Kegiatan</label>
            <input type="text" id="laporanTipeAktivitas" class="form-control" readonly style="background:#f1f5f9; font-weight:700; color:#0f172a; border-radius: 10px;">
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size:12px; font-weight:700; color:#475569; margin-bottom: 4px; display: block;">Catatan Hasil & Laporan Kegiatan <span style="color:red;">*</span></label>
            <textarea id="laporanCatatan" class="form-control" rows="3" placeholder="Tuliskan ringkasan hasil kegiatan (misal: Follow up 10 customer, 2 janji test drive Veloz besok jam 10)..." required style="border-radius: 10px;"></textarea>
          </div>
          <div class="form-group" style="margin-bottom: 12px;">
            <label style="font-size:12px; font-weight:700; color:#475569; margin-bottom: 4px; display: block;">Jumlah Prospek / Leads Didapat</label>
            <input type="number" id="laporanJumlahProspek" class="form-control" value="0" min="0" placeholder="0" style="border-radius: 10px;">
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label style="font-size:12px; font-weight:700; color:#475569; margin-bottom: 4px; display: block;">Bukti Hasil / Screenshot / Dokumen (Opsional)</label>
            <input type="file" id="laporanFoto" accept="image/*" class="form-control" style="font-size:12px; border-radius: 10px;">
          </div>
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:16px;">
            <button type="button" class="btn-main" style="background:#64748b; width:auto; border-radius:10px; padding: 8px 16px;" onclick="closeLaporanModal()">Batal</button>
            <button type="submit" class="btn-main" style="width:auto; border-radius:10px; padding: 8px 20px; background:linear-gradient(135deg, #10b981, #059669); font-weight: 700;"><i class="fa-solid fa-paper-plane" style="margin-right:6px;"></i> Submit Laporan Selesai</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal Voice-to-Activity AI Logger -->
    <div class="modal-overlay" id="voiceModal" onclick="stopVoiceToActivity(false)">
      <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 460px; text-align: center;">
        <div class="modal-header">
          <h3 style="font-size: 16px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-microphone-lines" style="color: #c8102e;"></i> AI Voice-to-Activity Logger
          </h3>
          <button class="btn-close-modal" onclick="stopVoiceToActivity(false)"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div style="padding: 20px 10px;">
          <!-- Pulsing Audio Wave Animation -->
          <div id="voiceWaveContainer" style="width: 80px; height: 80px; margin: 0 auto 16px; border-radius: 50%; background: #fee2e2; display: flex; align-items: center; justify-content: center; position: relative;">
            <div id="voicePulseCircle" style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(200, 16, 46, 0.2); animation: voice-pulse 1.5s infinite;"></div>
            <i class="fa-solid fa-microphone" style="font-size: 32px; color: #c8102e; position: relative; z-index: 2;"></i>
          </div>

          <h4 id="voiceStatusTitle" style="font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 6px;">Mendengarkan Suara Anda...</h4>
          <p style="font-size: 12px; color: #64748b; margin: 0 0 14px;">Silakan bicara (contoh: <em>"Follow up Pak Budi di Buahbatu, minat Innova Zenix Hybrid DP 20%, rencana SPK hari Sabtu"</em>)</p>

          <div style="background: #f8fafc; border: 1.5px dashed #cbd5e1; border-radius: 12px; padding: 12px; min-height: 85px; text-align: left; font-size: 13px; color: #0f172a; line-height: 1.5;" id="voiceLiveTranscript">
            <span style="color: #94a3b8; font-style: italic;">Ucapkan laporan kegiatan Anda sekarang...</span>
          </div>

          <div style="display: flex; gap: 10px; margin-top: 18px;">
            <button type="button" class="btn-main" style="background: #64748b; flex: 1; justify-content: center;" onclick="stopVoiceToActivity(false)">Batal</button>
            <button type="button" class="btn-main" style="background: linear-gradient(135deg, #10b981, #059669); flex: 2; justify-content: center;" onclick="processVoiceResult()">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Proses &amp; Isi Form
            </button>
          </div>
        </div>
      </div>
    </div>

    <style>
      @keyframes voice-pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.4); opacity: 0.3; }
        100% { transform: scale(1.6); opacity: 0; }
      }
    </style>

    <script src="../custom_alert.js"></script>
    <script src="../js/input.js"></script>
    <script src="../js/pwa-app.js?v=3"></script>

    <script>
      // ==========================================
      // VOICE-TO-ACTIVITY AI LOGGER CONTROLLER
      // ==========================================
      let speechRecognitionInstance = null;
      let finalTranscriptText = '';

      function startVoiceToActivity() {
        const modal = document.getElementById('voiceModal');
        const transcriptBox = document.getElementById('voiceLiveTranscript');
        const statusTitle = document.getElementById('voiceStatusTitle');
        finalTranscriptText = '';
        transcriptBox.innerHTML = '<span style="color: #94a3b8; font-style: italic;">Mendengarkan... Silakan bicara.</span>';
        statusTitle.innerText = 'Mendengarkan Suara Anda...';
        modal.classList.add('show');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
          transcriptBox.innerHTML = '<textarea id="manualVoiceInput" class="form-control" rows="3" placeholder="Browser ini belum mendukung Web Speech otomatis. Silakan ketik ringkasan suara Anda di sini..."></textarea>';
          statusTitle.innerText = 'Input Teks Ringkas';
          return;
        }

        try {
          speechRecognitionInstance = new SpeechRecognition();
          speechRecognitionInstance.lang = 'id-ID';
          speechRecognitionInstance.continuous = true;
          speechRecognitionInstance.interimResults = true;

          speechRecognitionInstance.onresult = (event) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              if (event.results[i].isFinal) {
                finalTranscriptText += event.results[i][0].transcript + ' ';
              } else {
                interim += event.results[i][0].transcript;
              }
            }
            transcriptBox.innerText = finalTranscriptText + interim;
          };

          speechRecognitionInstance.onerror = (err) => {
            console.warn('Speech Error:', err);
            statusTitle.innerText = 'Kendala Mikrofon';
          };

          speechRecognitionInstance.start();
        } catch (e) {
          console.error(e);
        }
      }

      function stopVoiceToActivity(process = false) {
        if (speechRecognitionInstance) {
          try { speechRecognitionInstance.stop(); } catch(e) {}
          speechRecognitionInstance = null;
        }
        document.getElementById('voiceModal').classList.remove('show');
        if (process) {
          processVoiceResult();
        }
      }

      function processVoiceResult() {
        const manualInput = document.getElementById('manualVoiceInput');
        let text = manualInput ? manualInput.value : finalTranscriptText;
        if (!text || text.trim() === '') {
          text = document.getElementById('voiceLiveTranscript').innerText;
          if (text.includes('Mendengarkan...') || text.includes('Ucapkan')) text = '';
        }

        if (speechRecognitionInstance) {
          try { speechRecognitionInstance.stop(); } catch(e) {}
        }
        document.getElementById('voiceModal').classList.remove('show');

        if (!text || text.trim() === '') {
          Swal.fire({
            icon: 'warning',
            title: 'Suara Tidak Terdeteksi',
            text: 'Silakan ulangi dan pastikan mikrofon Anda aktif.',
            confirmButtonColor: '#c8102e'
          });
          return;
        }

        const lower = text.toLowerCase();

        // 1. Deteksi Jenis Aktivitas
        const jenisSelect = document.getElementById('jenisAktivitas');
        if (lower.includes('pameran') || lower.includes('mall') || lower.includes('stand') || lower.includes('tsm') || lower.includes('ciwalk')) {
          jenisSelect.value = 'Pameran';
        } else if (lower.includes('live') || lower.includes('tiktok') || lower.includes('siaran')) {
          jenisSelect.value = 'LIVE Tiktok';
        } else if (lower.includes('walk in') || lower.includes('showroom') || lower.includes('kantor cabang') || lower.includes('tamu')) {
          jenisSelect.value = 'Walk in / Call in';
        } else if (lower.includes('event') || lower.includes('gathering')) {
          jenisSelect.value = 'Customer Gathering & Event';
        } else if (lower.includes('foa') || lower.includes('canvassing') || lower.includes('door to door') || lower.includes('perumahan') || lower.includes('komplek')) {
          jenisSelect.value = 'Residensial & FOA';
        } else if (lower.includes('bengkel') || lower.includes('database') || lower.includes('servis')) {
          jenisSelect.value = 'Database';
        } else if (lower.includes('repeat order') || lower.includes('ro') || lower.includes('referensi') || lower.includes('konsumen lama')) {
          jenisSelect.value = 'Referensi & RO';
        } else if (lower.includes('fleet') || lower.includes('pt') || lower.includes('cv') || lower.includes('perusahaan') || lower.includes('kantor dinas')) {
          jenisSelect.value = 'Fleet / Corporate';
        } else if (lower.includes('digital') || lower.includes('fb') || lower.includes('ig') || lower.includes('iklan') || lower.includes('posting')) {
          jenisSelect.value = 'Digital Marketing';
        }

        if (typeof handleJenisAktivitasChange === 'function') {
          handleJenisAktivitasChange();
        }

        // 2. Deteksi Durasi
        const durasiSelect = document.getElementById('durasiAktivitas');
        if (lower.includes('30 menit') || lower.includes('setengah jam')) {
          durasiSelect.value = '30 Menit';
        } else if (lower.includes('2 jam')) {
          durasiSelect.value = '2 Jam';
        } else if (lower.includes('3 jam')) {
          durasiSelect.value = '3 Jam';
        } else if (lower.includes('4 jam') || lower.includes('seharian')) {
          durasiSelect.value = '4+ Jam';
        } else {
          durasiSelect.value = '1 Jam';
        }

        // 3. Deteksi Status
        const statusSelect = document.getElementById('statusAktivitas');
        if (lower.includes('rencana') || lower.includes('akan') || lower.includes('besok')) {
          statusSelect.value = 'Rencana';
        } else {
          statusSelect.value = 'Sedang Dilakukan';
        }

        // 4. Set Keterangan Aktivitas
        const ketElem = document.getElementById('keteranganAktivitas');
        ketElem.value = text.trim();

        // 5. Alert Success Feedback
        Swal.fire({
          icon: 'success',
          title: 'Laporan Suara Diterapkan!',
          html: `<p style="font-size:13px; color:#475569;">Kategori: <strong>${jenisSelect.value || 'Umum'}</strong><br>Durasi: <strong>${durasiSelect.value}</strong><br>Catatan berhasil diisi otomatis.</p>`,
          confirmButtonColor: '#10b981'
        });
      }

      document.addEventListener('DOMContentLoaded', () => {
        if (window.SalesSuperpowers) {
          SalesSuperpowers.initVoiceRecorder('keteranganAktivitas', 'btnVoiceAktivitas', 'voiceStatusPillAktivitas');
        }
      });
    </script>
    <script src="../js/sales_superpowers.js?v=1.0"></script>
</body>

</html>
