<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Check-in Kunjungan Lapangan | Tunas Toyota</title>
    <meta name="description" content="Check-in lokasi kunjungan lapangan & geotagging Sales Consultant Tunas Toyota">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="../css/style.css">
    <script src="../js/sidebar_desktop.js"></script>

    <style>
        .checkin-hero-banner {
            background: linear-gradient(135deg, #0d1b3e 0%, #16305f 55%, #c8102e 100%);
            color: #ffffff;
            border-radius: 20px;
            padding: 22px 24px;
            margin-bottom: 22px;
            box-shadow: 0 12px 30px rgba(13, 27, 62, 0.2);
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }

        .checkin-hero-banner::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 160px;
            height: 160px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
        }

        .geo-card {
            background: #ffffff;
            border-radius: 20px;
            padding: 22px;
            border: 1px solid var(--border-color);
            box-shadow: var(--shadow-sm);
            margin-bottom: 22px;
        }

        .geo-header-flex {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 14px;
        }

        .geo-badge {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 6px 14px;
            border-radius: 30px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: -0.2px;
        }

        .geo-loading {
            background: #eff6ff;
            color: #1d4ed8;
            border: 1px solid #bfdbfe;
        }

        .geo-success {
            background: #f0fdf4;
            color: #15803d;
            border: 1px solid #bbf7d0;
        }

        .geo-warn {
            background: #fffbeb;
            color: #b45309;
            border: 1px solid #fef08a;
        }

        .geo-error {
            background: #fef2f2;
            color: #b91c1c;
            border: 1px solid #fecaca;
        }

        #checkinMap {
            height: 220px;
            width: 100%;
            border-radius: 14px;
            margin-top: 14px;
            border: 1px solid #e2e8f0;
            z-index: 1;
        }

        .quick-location-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-top: 10px;
        }

        .btn-quick-loc {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: var(--text-dark);
            font-size: 11.5px;
            font-weight: 600;
            padding: 6px 12px;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }

        .btn-quick-loc:hover {
            background: #e2e8f0;
            border-color: #cbd5e1;
            color: var(--primary-blue);
        }

        .btn-quick-loc.active {
            background: #eff6ff;
            border-color: #3b82f6;
            color: #1d4ed8;
            font-weight: 700;
        }

        .photo-uploader-box {
            border: 2px dashed #cbd5e1;
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            background: #fafbfd;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .photo-uploader-box:hover {
            border-color: var(--primary-red);
            background: #fff5f5;
        }

        .photo-preview-wrap {
            position: relative;
            width: 100%;
            height: 180px;
            border-radius: 14px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            margin-top: 10px;
            display: none;
        }

        .photo-preview-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .btn-remove-photo {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(220, 38, 38, 0.9);
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s;
        }

        .btn-remove-photo:hover {
            transform: scale(1.1);
        }

        .btn-submit-action {
            width: 100%;
            padding: 16px 22px;
            background: linear-gradient(135deg, #d7123a 0%, #a50b2b 100%);
            color: white;
            border: none;
            border-radius: 16px;
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(215, 18, 58, 0.35);
            transition: all 0.25s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            margin-top: 14px;
        }

        .btn-submit-action:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 14px 30px rgba(215, 18, 58, 0.45);
        }

        .btn-submit-action:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            box-shadow: none;
        }

        .history-feed {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 14px;
        }

        .history-item {
            background: #ffffff;
            border-radius: 16px;
            padding: 16px;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: flex-start;
            gap: 14px;
            transition: all 0.2s ease;
        }

        .history-item:hover {
            box-shadow: var(--shadow-sm);
            border-color: #cbd5e1;
        }

        .history-icon {
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: linear-gradient(135deg, #eff6ff, #dbeafe);
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            flex-shrink: 0;
        }

        .history-icon.exhibition {
            background: linear-gradient(135deg, #fef3c7, #fde68a);
            color: #d97706;
        }

        .history-icon.canvassing {
            background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
            color: #7e22ce;
        }

        .history-icon.testdrive {
            background: linear-gradient(135deg, #fee2e2, #fecaca);
            color: #dc2626;
        }

        .history-icon.delivery {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            color: #16a34a;
        }

        /* Pulse Radar Animation */
        @keyframes pulse-ring {
            0% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(215, 18, 58, 0.7);
            }
            70% {
                transform: scale(1);
                box-shadow: 0 0 0 10px rgba(215, 18, 58, 0);
            }
            100% {
                transform: scale(0.95);
                box-shadow: 0 0 0 0 rgba(215, 18, 58, 0);
            }
        }

        .radar-dot {
            width: 12px;
            height: 12px;
            background: #d7123a;
            border-radius: 50%;
            animation: pulse-ring 2s infinite;
        }
    </style>

    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="mobile-app">
        <!-- Header Page Standard -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Check-in Kunjungan Lapangan</h2>
        </header>

        <div class="container" style="margin-top: 18px;">
            <!-- Hero Top Banner -->
            <div class="checkin-hero-banner">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px;">
                    <div>
                        <span style="background: rgba(255,255,255,0.18); color: #ffffff; font-size: 10.5px; font-weight: 800; padding: 4px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-location-crosshairs"></i> GPS Geotagging System
                        </span>
                        <h2 style="font-size: 18px; font-weight: 800; margin: 8px 0 3px; color: #ffffff;">
                            Perekaman Titik Kunjungan Sales
                        </h2>
                        <p style="font-size: 12px; color: #e2e8f0; margin: 0; line-height: 1.5;">
                            Rekam kehadiran dan lokasi dinas lapangan secara akurat untuk validasi aktivitas harian &amp; pemantauan rute.
                        </p>
                    </div>
                    <div style="text-align: right; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0;">
                        <div style="font-size: 10px; color: #cbd5e1; font-weight: 600;">WAKTU REAL-TIME</div>
                        <div id="liveClock" style="font-size: 13px; font-weight: 800; color: #ffffff; font-family: monospace;">--:--:--</div>
                    </div>
                </div>
            </div>

            <!-- GPS Radar & Mini Map Card -->
            <div class="geo-card">
                <div class="geo-header-flex">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div class="radar-dot"></div>
                        <h3 style="font-size: 15px; font-weight: 800; color: var(--text-dark); margin: 0;">Sensor Sinyal GPS</h3>
                    </div>
                    <div id="geoStatus" class="geo-badge geo-loading">
                        <i class="fa-solid fa-spinner fa-spin"></i> Mendeteksi Lokasi GPS...
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 12px 14px; border-radius: 12px; border: 1px solid #e2e8f0; flex-wrap: wrap; gap: 8px;">
                    <div>
                        <div style="font-size: 10.5px; color: var(--text-muted); font-weight: 700; text-transform: uppercase;">Koordinat Terdeteksi</div>
                        <div id="geoCoords" style="font-size: 12.5px; font-weight: 700; color: var(--primary-blue); font-family: monospace; margin-top: 2px;">
                            Mencari sinyal satelit GPS...
                        </div>
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button type="button" class="btn-quick-loc" onclick="detectLocation()" title="Perbarui titik GPS">
                            <i class="fa-solid fa-rotate-right"></i> Refresh GPS
                        </button>
                        <a id="btnGmapsLink" href="#" target="_blank" class="btn-quick-loc" style="display: none; color: #2563eb;">
                            <i class="fa-solid fa-map-location-dot"></i> Buka G-Maps
                        </a>
                    </div>
                </div>

                <!-- Leaflet Interactive Mini Map -->
                <div id="checkinMap"></div>
            </div>

            <!-- Form Checkin Card -->
            <div class="geo-card">
                <h3 style="font-size: 16px; font-weight: 800; color: var(--text-dark); margin-bottom: 4px;">
                    <i class="fa-solid fa-file-pen" style="color: var(--primary-red); margin-right: 6px;"></i> Form Check-in Lapangan
                </h3>
                <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 18px;">
                    Pilih tipe kegiatan dan pastikan lokasi terisi dengan benar.
                </p>

                <!-- Jenis Kunjungan -->
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="font-size: 12.5px; font-weight: 700; color: var(--text-dark); display: block; margin-bottom: 6px;">
                        Jenis Kunjungan Lapangan <span style="color: var(--primary-red);">*</span>
                    </label>
                    <select id="selectJenis" class="form-control" style="font-weight: 600;" onchange="handleJenisChange()">
                        <option value="Canvassing Wilayah">🏃 Canvassing &amp; Sebar Brosur Lapangan</option>
                        <option value="Kunjungan Prospek">🤝 Kunjungan Prospek Customer (Rumah / Kantor)</option>
                        <option value="Pameran Display">🏬 Pameran Display / Booth Mall</option>
                        <option value="Test Drive Customer">🚗 Test Drive di Lokasi Konsumen</option>
                        <option value="Delivery Unit">🎁 Pengiriman / Handover Unit (DO)</option>
                        <option value="After Sales Service">🛠️ Follow Up After-Sales &amp; Servis Berkala</option>
                    </select>
                </div>

                <!-- Nama Tempat / Lokasi -->
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="font-size: 12.5px; font-weight: 700; color: var(--text-dark); display: block; margin-bottom: 6px;">
                        Nama Tempat / Lokasi Kunjungan <span style="color: var(--primary-red);">*</span>
                    </label>
                    <input type="text" id="inputAddress" class="form-control" placeholder="Contoh: Trans Studio Mall Bandung / Rumah Bpk. Hendra" required />
                    
                    <!-- Quick Location Shortcuts -->
                    <div style="margin-top: 8px;">
                        <span style="font-size: 11px; color: var(--text-muted); font-weight: 600;">Shortcut Titik Populer:</span>
                        <div class="quick-location-grid">
                            <button type="button" class="btn-quick-loc" onclick="setQuickLocation('Tunas Toyota Kiara Condong', -6.9387, 107.6433)">
                                📍 Kiara Condong (Cabang)
                            </button>
                            <button type="button" class="btn-quick-loc" onclick="setQuickLocation('Trans Studio Mall Bandung', -6.9255, 107.6366)">
                                🏬 TSM Bandung
                            </button>
                            <button type="button" class="btn-quick-loc" onclick="setQuickLocation('Festival Citylink Mall', -6.9329, 107.5855)">
                                🏬 Festival Citylink
                            </button>
                            <button type="button" class="btn-quick-loc" onclick="setQuickLocation('Paris Van Java Mall', -6.8893, 107.5960)">
                                🏬 PVJ Bandung
                            </button>
                            <button type="button" class="btn-quick-loc" onclick="setQuickLocation('Summarecon Mall Bandung', -6.9667, 107.6972)">
                                🏬 Summarecon Mall
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Keterangan Kegiatan -->
                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="font-size: 12.5px; font-weight: 700; color: var(--text-dark); display: block; margin-bottom: 6px;">
                        Keterangan Kegiatan (Opsional)
                    </label>
                    <textarea id="inputKeterangan" class="form-control" rows="2" placeholder="Tuliskan catatan singkat kegiatan, misal: Presentasi simulasi kredit Veloz ke Bpk. Hendra"></textarea>
                </div>

                <!-- Upload Foto Bukti -->
                <div class="form-group" style="margin-bottom: 18px;">
                    <label style="font-size: 12.5px; font-weight: 700; color: var(--text-dark); display: block; margin-bottom: 6px;">
                        Foto Bukti Kunjungan Lapangan
                    </label>
                    
                    <div class="photo-uploader-box" id="uploadBoxTrigger" onclick="openPhotoPicker()">
                        <i class="fa-solid fa-camera" style="font-size: 26px; color: var(--primary-red); margin-bottom: 6px; display: block;"></i>
                        <span style="font-size: 13px; font-weight: 700; color: var(--text-dark); display: block;">Ambil Foto Kamera / Unggah Galeri</span>
                        <span style="font-size: 11px; color: var(--text-muted);">Foto bukti kehadiran langsung di lokasi kunjungan</span>
                    </div>

                    <input type="file" id="inputFotoFile" accept="image/*" style="display: none;" onchange="handleFileSelected(event)" />
                    <input type="file" id="inputFotoCamera" accept="image/*" capture="environment" style="display: none;" onchange="handleFileSelected(event)" />

                    <!-- Preview Foto -->
                    <div class="photo-preview-wrap" id="photoPreviewWrap">
                        <img src="" id="photoPreviewImg" class="photo-preview-img" alt="Bukti Foto" />
                        <button type="button" class="btn-remove-photo" onclick="removeSelectedPhoto()" title="Hapus Foto">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- Tombol Submit -->
                <button id="btnSubmitCheckin" class="btn-submit-action" onclick="submitCheckin()" disabled>
                    <i class="fa-solid fa-location-dot"></i>
                    <span>Simpan Check-In Lokasi</span>
                </button>

                <div id="checkinMsg" style="margin-top: 14px; display: none; padding: 12px 16px; border-radius: 12px; font-size: 13px; font-weight: 600;"></div>
            </div>

            <!-- Riwayat Check-In Hari Ini -->
            <div class="geo-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div>
                        <h3 style="font-size: 15px; font-weight: 800; color: var(--text-dark); margin: 0;">
                            <i class="fa-solid fa-clock-rotate-left" style="color: var(--accent-blue); margin-right: 6px;"></i> Riwayat Check-In Hari Ini
                        </h3>
                        <p style="font-size: 11px; color: var(--text-muted); margin: 2px 0 0;">Daftar lokasi yang telah Anda kunjungi hari ini</p>
                    </div>
                    <button type="button" class="btn-quick-loc" onclick="loadCheckinHistory()">
                        <i class="fa-solid fa-arrows-rotate"></i> Refresh
                    </button>
                </div>

                <div id="historyFeedContainer" class="history-feed">
                    <p style="text-align: center; color: var(--text-muted); font-size: 12px; padding: 20px 0;">
                        <i class="fa-solid fa-spinner fa-spin"></i> Memuat riwayat check-in...
                    </p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Photo Source Chooser -->
    <div class="modal-overlay" id="photoSourceModal" onclick="closePhotoSourceModal()">
        <div class="modal-content" onclick="event.stopPropagation()" style="max-width: 360px;">
            <div class="modal-header">
                <h3 style="font-size: 16px; font-weight: 800;">Pilih Sumber Foto</h3>
                <button type="button" class="btn-close-modal" onclick="closePhotoSourceModal()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
                <button type="button" class="btn-main" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); justify-content: center;" onclick="triggerCameraInput()">
                    <i class="fa-solid fa-camera"></i> Ambil dari Kamera
                </button>
                <button type="button" class="btn-main" style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); justify-content: center;" onclick="triggerGalleryInput()">
                    <i class="fa-solid fa-image"></i> Pilih dari Galeri Foto
                </button>
                <button type="button" class="btn-outline-blue" style="justify-content: center;" onclick="closePhotoSourceModal()">
                    Batal
                </button>
            </div>
        </div>
    </div>

    <script src="../js/script.js"></script>
    <script src="../js/checkin.js"></script>
    <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
