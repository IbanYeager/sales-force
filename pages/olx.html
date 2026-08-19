<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - OLX Trade In</title>
    <meta name="description" content="Upload kendaraan trade-in ke platform OLX">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css" />
    <link rel="stylesheet" href="../css/olx.css">
<script src="../js/sidebar_desktop.js"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
</head>

<body>
    <div class="mobile-app">
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Trade-In OLX</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Segment Control Tabs -->
            <div style="display: flex; background: #f1f5f9; padding: 4px; border-radius: 12px; margin-bottom: 22px; border: 1px solid var(--border-color);">
                <button type="button" id="tabUpload" class="tab-btn active" style="flex: 1; padding: 10px; border-radius: 9px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;" onclick="switchTab('upload')">Upload</button>
                <button type="button" id="tabEstimator" class="tab-btn" style="flex: 1; padding: 10px; border-radius: 9px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;" onclick="switchTab('estimator')">Estimator</button>
                <button type="button" id="tabStatus" class="tab-btn" style="flex: 1; padding: 10px; border-radius: 9px; border: none; font-size: 13px; font-weight: 700; cursor: pointer; transition: all 0.2s;" onclick="switchTab('status')">Daftar</button>
            </div>

            <div id="contentUpload">
                <!-- Info strip -->
                <div class="info-strip">
                    <div class="info-strip-icon"><i class="fa-solid fa-circle-info"></i></div>
                    <div class="info-strip-text">
                        <p>Data kendaraan akan digunakan untuk proses trade-in dan estimasi harga pasar.</p>
                    </div>
                </div>

                <!-- Steps -->
                <div class="steps-row">
                    <div class="step-dot active"></div>
                    <div class="step-dot"></div>
                    <div class="step-dot"></div>
                </div>

                <form id="formOlx">

                <div class="form-group">
                    <label>Nama Model & Type Kendaraan <span style="color:var(--primary-red)">*</span></label>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <input class="form-control" type="text" id="olxNama"
                            placeholder="Nama Model (Cth: Avanza)" required />
                        <input class="form-control" type="text" id="olxJenis"
                            placeholder="Type (Cth: 1.5 G)" required />
                    </div>
                </div>

                <div class="form-group">
                    <label>Tahun & Warna</label>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <select class="form-control" id="olxTahun" required>
                            <option value="" disabled selected>Pilih Tahun</option>
                        </select>
                        <input class="form-control" type="text" id="olxWarna" placeholder="Warna" required />
                    </div>
                </div>

                <!-- Harga Estimasi determined by SPV, so hidden from input -->
                <input type="hidden" id="olxHarga" value="0" />

                <div class="form-group">
                    <label>Alamat Lengkap <span style="color:var(--primary-red)">*</span></label>
                    <textarea class="form-control" id="olxLokasi" rows="2" placeholder="Tulis alamat lengkap..." required></textarea>
                </div>

                <div class="form-group">
                    <label>Deskripsi Kondisi <span style="color:var(--primary-red)">*</span></label>
                    <textarea class="form-control" id="olxDeskripsi" rows="3"
                        placeholder="Tulis kondisi kendaraan: tahun pakai, kilometer, kelengkapan dokumen..."
                        required></textarea>
                </div>

                <div class="form-group">
                    <label style="display:flex;justify-content:space-between;align-items:center;">
                        <span>Foto Kendaraan</span>
                        <span style="font-size:10px;color:var(--text-muted);font-weight:600;" id="photoCountOlx">0/6
                            Foto</span>
                    </label>

                    <div class="photo-upload-area" onclick="openPhotoChooser(event, 'inputFotoOlx', 'inputFotoOlx_camera')"
                        id="uploadAreaOlx">
                        <div class="photo-upload-icon"><i class="fa-solid fa-camera"></i></div>
                        <h4>Tambah Foto Kendaraan</h4>
                        <p>Foto tampak depan, belakang, samping & interior</p>
                    </div>

                    <div class="photo-grid-preview" id="photoGridOlx"></div>

                    <input type="file" id="inputFotoOlx" accept="image/*" multiple hidden
                        onchange="handleOlxPhoto(event)">
                    <input type="file" id="inputFotoOlx_camera" accept="image/*" capture="environment" hidden
                        onchange="handleOlxPhoto(event)">
                </div>

                <div class="submit-area">
                    <button type="button" class="btn-main" onclick="simpanOlx()" id="btnSimpanOlx">
                        <i class="fa-solid fa-upload"></i>
                        <span>Submit Listing</span>
                    </button>
                    <p
                        style="text-align:center;font-size:11px;color:var(--text-muted);margin-top:12px;font-weight:500;">
                        <i class="fa-solid fa-lock" style="color:var(--green-success);margin-right:4px;"></i>
                        Data disimpan secara lokal (demo mode)
                    </p>
                </div>
            </form>
            </div>

            <div id="contentEstimator" style="display:none;">
                <div class="card" style="padding:18px;">
                    <h3 class="section-title">Kalkulator Trade-In</h3>
                    <p style="font-size:12px; color:var(--text-muted); margin-bottom:14px;">Masukkan detail kendaraan untuk mendapatkan estimasi harga pasar (algoritma penyusutan).</p>
                    
                    <div class="form-group">
                        <label>Tahun Pembelian</label>
                        <input type="number" class="form-control" id="estTahun" placeholder="Contoh: 2020">
                    </div>
                    <div class="form-group">
                        <label>Harga Beli Baru (Rp)</label>
                        <input type="number" class="form-control" id="estHargaBaru" placeholder="Contoh: 250000000">
                    </div>
                    <div class="form-group">
                        <label>Kondisi Fisik & Mesin</label>
                        <select class="form-control" id="estKondisi">
                            <option value="sangat_baik">Sangat Baik (Terawat, Mulus)</option>
                            <option value="baik">Baik (Lecet wajar, Mesin Normal)</option>
                            <option value="cukup">Cukup (Perlu perbaikan minor)</option>
                            <option value="kurang">Kurang (Perlu perbaikan major)</option>
                        </select>
                    </div>
                    <button class="btn-main" style="width:100%; justify-content:center; background:var(--primary-blue);" onclick="hitungEstimasi()">Hitung Estimasi Harga</button>
                    
                    <div id="estResultBox" style="display:none; margin-top:20px; padding:16px; background:#eef2ff; border-radius:12px; border:1px solid #c7d2fe; text-align:center;">
                        <p style="font-size:11px; color:var(--primary-blue); font-weight:700; text-transform:uppercase; margin-bottom:6px;">Estimasi Harga Jual</p>
                        <h2 id="estResultPrice" style="color:var(--text-dark); margin:0;">Rp 0</h2>
                        <p style="font-size:10px; color:var(--text-muted); margin-top:6px;">*Harga ini hanya perkiraan kasar. Harga pasti setelah inspeksi tim penilai.</p>
                    </div>
                </div>
            </div>

            <div id="contentStatus" style="display:none;">
                <div id="tradeInList" style="display: flex; flex-direction: column; gap: 14px;">
                    <p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Memuat data trade-in...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal Detail OLX -->
    <div id="olxDetailModal" class="modal-overlay" style="z-index: 20000;" onclick="closeOlxDetail()">
        <div class="modal-content" style="max-height: 90vh; overflow-y: auto; padding: 20px;" onclick="event.stopPropagation()">
            <div class="modal-header" style="margin-bottom: 16px;">
                <h3 style="font-size:16px; font-weight:800; color:var(--text-dark);">Detail Kendaraan</h3>
                <button type="button" class="btn-close-modal" onclick="closeOlxDetail()"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div id="detPhotoContainer" style="display: flex; overflow-x: auto; gap: 10px; margin-bottom: 16px; padding-bottom: 8px; -webkit-overflow-scrolling: touch; scroll-snap-type: x mandatory;">
                <!-- Photos will be inserted here -->
            </div>

            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid var(--border-color); margin-bottom: 16px;">
                <h4 id="detNamaKendaraan" style="font-size: 16px; font-weight: 800; color: var(--text-dark); margin: 0 0 8px 0;">Nama Kendaraan</h4>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                    <span style="font-size:11px; font-weight:700; background:#e0f2fe; padding:4px 8px; border-radius:6px; color:var(--primary-blue);">
                        <i class="fa-solid fa-user" style="margin-right:4px;"></i><span id="detNamaSales">Sales</span>
                    </span>
                    <span style="font-size:11px; font-weight:600; color:var(--text-muted);" id="detTanggal">Tanggal</span>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 4px;">JENIS/TYPE</span>
                        <span id="detJenis" style="font-size: 13px; font-weight: 600; color: var(--text-dark);"></span>
                    </div>
                    <div>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 4px;">TAHUN</span>
                        <span id="detTahun" style="font-size: 13px; font-weight: 600; color: var(--text-dark);"></span>
                    </div>
                    <div>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 4px;">WARNA</span>
                        <span id="detWarna" style="font-size: 13px; font-weight: 600; color: var(--text-dark);"></span>
                    </div>
                    <div>
                        <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 4px;">LOKASI</span>
                        <span id="detLokasi" style="font-size: 13px; font-weight: 600; color: var(--text-dark);"></span>
                    </div>
                </div>

                <div>
                    <span style="font-size: 10px; color: var(--text-muted); font-weight: 700; display: block; margin-bottom: 4px;">DESKRIPSI KONDISI</span>
                    <p id="detDeskripsi" style="font-size: 12px; color: var(--text-dark); line-height: 1.6; margin: 0; background: white; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0;"></p>
                </div>
            </div>

            <div style="background: #ecfdf5; padding: 16px; border-radius: 12px; border: 1px solid #a7f3d0; text-align: center;">
                <span style="font-size: 11px; color: #065f46; font-weight: 700; display: block; margin-bottom: 4px; text-transform: uppercase;">Harga Estimasi Disetujui</span>
                <span id="detHarga" style="font-size: 20px; font-weight: 900; color: #047857;">Rp 0</span>
            </div>
            
            <button id="detBtnHubungiSales" class="btn-main" style="width: 100%; justify-content: center; background: #25D366; margin-top: 16px; display: none;">
                <i class="fa-brands fa-whatsapp"></i> Hubungi Sales
            </button>
        </div>
    </div>

    <!-- Modal Viewer Foto -->
    <div class="modal-overlay" id="photoViewerModal" style="z-index: 25000; background: rgba(0,0,0,0.95);">
        <div class="modal-content"
            style="background: transparent; border: none; box-shadow: none; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; max-height: 100vh; padding: 0;">
            <button class="btn-close-modal-white" onclick="document.getElementById('photoViewerModal').classList.remove('show')"
                style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.25); border-radius: 50%; border: 1px solid rgba(255,255,255,0.2); width: 40px; height: 40px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2;"><i
                    class="fa-solid fa-xmark"></i></button>
                    
            <button id="btnPhotoPrev" onclick="prevPhotoViewer()" style="position: absolute; left: 10px; background: rgba(255,255,255,0.25); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; display: none; align-items: center; justify-content: center; z-index: 2;"><i class="fa-solid fa-chevron-left"></i></button>

            <img id="photoViewerImg" src="" alt="Detail Foto"
                style="max-width: 90%; max-height: 75vh; border-radius: 16px; object-fit: contain; box-shadow: 0 10px 30px rgba(0,0,0,0.5); z-index: 1;">
                
            <button id="btnPhotoNext" onclick="nextPhotoViewer()" style="position: absolute; right: 10px; background: rgba(255,255,255,0.25); border: none; width: 40px; height: 40px; border-radius: 50%; color: white; font-size: 18px; cursor: pointer; display: none; align-items: center; justify-content: center; z-index: 2;"><i class="fa-solid fa-chevron-right"></i></button>
        </div>
    </div>
    <script src="../custom_alert.js"></script>
    <script src="../js/olx.js"></script>

  <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
