<!-- ============================================================== -->
<!-- MODAL BULK UPLOAD FOTO AKTIVITAS SALES (KHUSUS KACAB)          -->
<!-- ============================================================== -->
<style>
  .bulk-upload-overlay {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.75);
    backdrop-filter: blur(5px);
    z-index: 99999;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 16px;
    opacity: 0;
    transition: opacity 0.25s ease;
    overscroll-behavior: contain;
  }
  .bulk-upload-overlay.open {
    display: flex !important;
    opacity: 1 !important;
  }
  .bulk-upload-card {
    background: #ffffff;
    width: 100%;
    max-width: 760px;
    height: 90vh;
    max-height: 90vh;
    border-radius: 20px;
    box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
    border: 1px solid #cbd5e1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: bulkModalPop 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  @keyframes bulkModalPop {
    from { opacity: 0; transform: scale(0.95) translateY(12px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  #formBulkUploadKacab {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
    overflow: hidden;
  }
  .bulk-upload-header {
    background: #0f172a;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid rgba(216, 164, 55, 0.4);
    color: #ffffff;
    flex-shrink: 0;
  }
  .bulk-upload-header-left {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .bulk-upload-icon {
    width: 44px;
    height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg, #eb0a1e, #b30816);
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    box-shadow: 0 4px 12px rgba(235, 10, 30, 0.4);
    flex-shrink: 0;
  }
  .bulk-upload-header h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.2px;
  }
  .bulk-upload-header-sub {
    font-size: 12px;
    color: #cbd5e1;
    margin-top: 2px;
    display: block;
  }
  .bulk-upload-close {
    background: rgba(255, 255, 255, 0.12);
    border: none;
    color: #ffffff;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.2s;
  }
  .bulk-upload-close:hover {
    background: #eb0a1e;
    transform: rotate(90deg);
  }
  .bulk-upload-body {
    padding: 20px 24px;
    overflow-y: auto !important;
    -webkit-overflow-scrolling: touch;
    overscroll-behavior: contain;
    flex: 1;
    min-height: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
    background: #ffffff;
  }
  .bulk-upload-body::-webkit-scrollbar {
    width: 8px;
  }
  .bulk-upload-body::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 8px;
  }
  .bulk-upload-body::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 8px;
  }
  .bulk-upload-body::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  .bulk-banner-info {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: #1e40af;
    line-height: 1.5;
  }
  .bulk-section-title {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding-bottom: 4px;
    border-bottom: 1.5px solid #f1f5f9;
  }
  .bulk-dropzone {
    border: 2px dashed #cbd5e1;
    border-radius: 16px;
    background: #f8fafc;
    padding: 26px 20px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }
  .bulk-dropzone:hover, .bulk-dropzone.drag-active {
    border-color: #eb0a1e;
    background: #fff5f5;
  }
  .bulk-dropzone-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: #fee2e2;
    color: #eb0a1e;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    margin-bottom: 10px;
    transition: transform 0.2s;
  }
  .bulk-dropzone:hover .bulk-dropzone-icon {
    transform: scale(1.1);
  }
  .bulk-dropzone h4 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 800;
    color: #0f172a;
  }
  .bulk-dropzone p {
    margin: 4px 0 12px;
    font-size: 12px;
    color: #64748b;
  }
  .btn-bulk-browse {
    background: #0f172a;
    color: #ffffff;
    border: 1px solid #334155;
    padding: 8px 18px;
    border-radius: 9px;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: background 0.15s;
  }
  .btn-bulk-browse:hover {
    background: #eb0a1e;
    border-color: #eb0a1e;
  }
  .bulk-preview-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
    gap: 10px;
    max-height: 220px;
    overflow-y: auto;
    padding: 6px 2px;
  }
  .bulk-thumb-card {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    height: 90px;
    background: #0f172a;
    border: 1.5px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  }
  .bulk-thumb-card img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .bulk-thumb-size {
    position: absolute;
    bottom: 3px;
    left: 3px;
    background: rgba(15, 23, 42, 0.75);
    color: #ffffff;
    font-size: 9px;
    font-weight: 700;
    padding: 1px 5px;
    border-radius: 4px;
    backdrop-filter: blur(2px);
  }
  .bulk-thumb-remove {
    position: absolute;
    top: 3px;
    right: 3px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.9);
    color: #ffffff;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    transition: transform 0.15s, background 0.15s;
  }
  .bulk-thumb-remove:hover {
    background: #dc2626;
    transform: scale(1.15);
  }
  .bulk-grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
  @media (max-width: 600px) {
    .bulk-grid-2 {
      grid-template-columns: 1fr;
    }
  }
  .bulk-form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .bulk-form-label {
    font-size: 12px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bulk-form-control {
    width: 100%;
    padding: 9px 12px;
    font-size: 12.5px;
    border-radius: 9px;
    border: 1.5px solid #cbd5e1;
    background: #ffffff;
    color: #0f172a;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .bulk-form-control:focus {
    border-color: #eb0a1e;
    box-shadow: 0 0 0 2px rgba(235, 10, 30, 0.12);
  }
  .bulk-quick-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .bulk-chip {
    background: #f1f5f9;
    color: #334155;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 8px;
    cursor: pointer;
    transition: all 0.15s;
  }
  .bulk-chip:hover {
    background: #e2e8f0;
    border-color: #94a3b8;
    color: #0f172a;
  }
  .bulk-sesi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  @media (max-width: 600px) {
    .bulk-sesi-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  .bulk-sesi-card {
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    padding: 8px;
    text-align: center;
    cursor: pointer;
    transition: all 0.15s;
    background: #ffffff;
    display: block;
  }
  .bulk-sesi-card input {
    display: none;
  }
  .bulk-sesi-card:has(input:checked) {
    border-color: #eb0a1e;
    background: #fff5f5;
    box-shadow: 0 2px 8px rgba(235, 10, 30, 0.15);
  }
  .bulk-sesi-title {
    font-size: 12px;
    font-weight: 800;
    color: #0f172a;
    display: block;
  }
  .bulk-sesi-sub {
    font-size: 10px;
    color: #64748b;
    display: block;
    margin-top: 2px;
  }
  .bulk-mode-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  @media (max-width: 600px) {
    .bulk-mode-container {
      grid-template-columns: 1fr;
    }
  }
  .bulk-mode-card {
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    padding: 10px 14px;
    cursor: pointer;
    background: #ffffff;
    transition: all 0.15s;
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }
  .bulk-mode-card input {
    margin-top: 3px;
    accent-color: #eb0a1e;
  }
  .bulk-mode-card:has(input:checked) {
    border-color: #eb0a1e;
    background: #fff5f5;
  }
  .bulk-progress-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 12px 16px;
    display: none;
  }
  .bulk-progress-bar-bg {
    width: 100%;
    height: 10px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-top: 6px;
  }
  .bulk-progress-bar-fill {
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #eb0a1e, #10b981);
    border-radius: 10px;
    transition: width 0.25s ease;
  }
  .bulk-upload-footer {
    padding: 14px 24px;
    background: #f8fafc;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    flex-shrink: 0;
  }
  .btn-bulk-cancel {
    background: #ffffff;
    border: 1.5px solid #cbd5e1;
    color: #475569;
    padding: 9px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .btn-bulk-cancel:hover {
    background: #f1f5f9;
    color: #0f172a;
  }
  .btn-bulk-submit {
    background: linear-gradient(135deg, #eb0a1e, #b30816);
    border: none;
    color: #ffffff;
    padding: 9px 24px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(235, 10, 30, 0.3);
    transition: all 0.2s;
  }
  .btn-bulk-submit:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(235, 10, 30, 0.45);
    background: linear-gradient(135deg, #f8182d, #cc0919);
  }
  .btn-bulk-submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
</style>

<div id="modalBulkUploadKacab" class="bulk-upload-overlay" onclick="if(event.target===this)closeBulkUploadModal()">
  <div class="bulk-upload-card">
    
    <!-- Modal Header -->
    <div class="bulk-upload-header">
      <div class="bulk-upload-header-left">
        <div class="bulk-upload-icon">
          <i class="fa-solid fa-cloud-arrow-up"></i>
        </div>
        <div>
          <h3>Upload Banyak Foto Aktivitas Sales</h3>
          <span class="bulk-upload-header-sub">Otorisasi Kepala Cabang: Simpan banyak dokumentasi foto sekaligus ke galeri &amp; timeline</span>
        </div>
      </div>
      <button type="button" class="bulk-upload-close" onclick="closeBulkUploadModal()" title="Tutup">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Modal Form -->
    <form id="formBulkUploadKacab" onsubmit="submitBulkUpload(event)" enctype="multipart/form-data">
      <div class="bulk-upload-body">

        <!-- Banner Info -->
        <div class="bulk-banner-info">
          <i class="fa-solid fa-shield-halved" style="font-size: 16px; margin-top: 1px; color: #2563eb;"></i>
          <div>
            <strong>Mode Multi-Foto Kepala Cabang:</strong> Anda dapat memilih atau menyeret puluhan foto sekaligus. Foto otomatis tersinkronisasi ke <b>Galeri Foto Cabang</b>, <b>Timeline Monitoring Sales</b>, dan <b>Database Aktivitas</b>.
          </div>
        </div>

        <!-- Bagian 1: Dropzone & File Picker -->
        <div>
          <div class="bulk-section-title">
            <i class="fa-solid fa-images" style="color: #eb0a1e;"></i> 1. Pilih / Seret Foto Dokumentasi
          </div>

          <div class="bulk-dropzone" id="bulkUploadDropzone" onclick="document.getElementById('bulkUploadFileInput').click()">
            <input type="file" id="bulkUploadFileInput" multiple accept="image/*" style="display:none;">
            <div class="bulk-dropzone-icon">
              <i class="fa-solid fa-cloud-arrow-up"></i>
            </div>
            <h4>Tarik &amp; Lepas Banyak Foto di Sini</h4>
            <p>Atau klik tombol di bawah untuk memilih banyak file dari komputer / HP (JPG, PNG, WEBP)</p>
            <button type="button" class="btn-bulk-browse">
              <i class="fa-solid fa-folder-open"></i> Pilih File Foto Sekaligus
            </button>
          </div>

          <!-- Preview Grid -->
          <div id="bulkUploadPreviewContainer" style="display: none; margin-top: 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
              <span id="bulkUploadCountLabel" style="font-size: 12px; font-weight: 700; color: #0f172a;">0 Foto Terpilih</span>
              <div style="display: flex; gap: 8px;">
                <button type="button" class="bulk-chip" style="color: #2563eb; background: #eff6ff; border-color: #bfdbfe;" onclick="document.getElementById('bulkUploadFileInput').click()">
                  <i class="fa-solid fa-plus"></i> Tambah Foto Lagi
                </button>
                <button type="button" class="bulk-chip" style="color: #dc2626; background: #fef2f2; border-color: #fecaca;" onclick="clearBulkUploadFiles()">
                  <i class="fa-solid fa-trash-can"></i> Hapus Semua
                </button>
              </div>
            </div>
            <div id="bulkUploadPreviewGrid" class="bulk-preview-grid"></div>
          </div>
        </div>

        <!-- Bagian 2: Wiraniaga Pelaksana -->
        <div>
          <div class="bulk-section-title">
            <i class="fa-solid fa-user-tie" style="color: #d97706;"></i> 2. Wiraniaga / Sales Pelaksana
          </div>
          <div class="bulk-form-group">
            <label class="bulk-form-label">
              <span>Nama Wiraniaga / Tim <span style="color:#ef4444;">*</span></span>
              <span style="font-size:11px; color:#64748b; font-weight:normal;">Pilih sales pemilik dokumentasi atau Tim Gabungan</span>
            </label>
            <select id="bulkUploadSelectSales" class="bulk-form-control" required style="font-weight: 600;">
              <option value="" disabled selected>Memuat daftar 50 wiraniaga cabang...</option>
            </select>
          </div>
        </div>

        <!-- Bagian 3: Waktu & Tanggal -->
        <div>
          <div class="bulk-section-title">
            <i class="fa-solid fa-calendar-day" style="color: #059669;"></i> 3. Tanggal, Jam &amp; Sesi Waktu
          </div>
          <div class="bulk-grid-2">
            <div class="bulk-form-group">
              <div class="bulk-form-label">
                <span>Tanggal Kegiatan <span style="color:#ef4444;">*</span></span>
                <div style="display: flex; gap: 4px;">
                  <button type="button" class="bulk-chip" onclick="setBulkUploadDatePreset('today')">Hari Ini</button>
                  <button type="button" class="bulk-chip" onclick="setBulkUploadDatePreset('yesterday')">Kemarin</button>
                </div>
              </div>
              <input type="date" id="bulkUploadTanggal" class="bulk-form-control" required>
            </div>

            <div class="bulk-form-group">
              <label class="bulk-form-label">
                <span>Jam Pelaksanaan (WIB)</span>
              </label>
              <input type="time" id="bulkUploadJam" class="bulk-form-control" required>
            </div>
          </div>

          <!-- Sesi Radio Grid -->
          <div class="bulk-form-group" style="margin-top: 10px;">
            <label class="bulk-form-label">Sesi Pelaksanaan <span style="color:#ef4444;">*</span></label>
            <div class="bulk-sesi-grid">
              <label class="bulk-sesi-card">
                <input type="radio" name="bulk_sesi_waktu" value="Pagi" checked>
                <span class="bulk-sesi-title">🌅 Pagi</span>
                <span class="bulk-sesi-sub">08:00 - 12:00</span>
              </label>
              <label class="bulk-sesi-card">
                <input type="radio" name="bulk_sesi_waktu" value="Siang">
                <span class="bulk-sesi-title">☀️ Siang</span>
                <span class="bulk-sesi-sub">12:00 - 15:30</span>
              </label>
              <label class="bulk-sesi-card">
                <input type="radio" name="bulk_sesi_waktu" value="Sore">
                <span class="bulk-sesi-title">🌆 Sore</span>
                <span class="bulk-sesi-sub">15:30 - 18:30</span>
              </label>
              <label class="bulk-sesi-card">
                <input type="radio" name="bulk_sesi_waktu" value="Malam">
                <span class="bulk-sesi-title">🌙 Malam</span>
                <span class="bulk-sesi-sub">18:30 - Selesai</span>
              </label>
            </div>
          </div>
        </div>

        <!-- Bagian 4: Detail Kegiatan & Lokasi -->
        <div>
          <div class="bulk-section-title">
            <i class="fa-solid fa-list-check" style="color: #2563eb;"></i> 4. Detail Kegiatan &amp; Lokasi
          </div>
          <div class="bulk-grid-2">
            <div class="bulk-form-group">
              <label class="bulk-form-label">Tipe Aktivitas <span style="color:#ef4444;">*</span></label>
              <select id="bulkUploadTipe" class="bulk-form-control" required>
                <option value="Pameran (Exhibition / Booth)">🎪 Pameran (Exhibition / Booth Mall)</option>
                <option value="Canvassing Lapangan / Door to Door">🚶 Canvassing Lapangan / Door to Door</option>
                <option value="Customer Gathering & Event Cabang">🎉 Customer Gathering &amp; Event Cabang</option>
                <option value="Test Drive Bersama Customer">🚗 Test Drive Bersama Customer</option>
                <option value="Delivery Ceremony / Handover Unit">🔑 Delivery Ceremony / Handover Unit</option>
                <option value="Pertemuan Prospek / Kantor Customer">🏢 Pertemuan Prospek / Kantor Customer</option>
                <option value="Flyering & Prospecting">📄 Flyering &amp; Prospecting</option>
                <option value="Showroom Event / Duty">🏛️ Showroom Event / Duty</option>
                <option value="Aktivitas Lainnya">📝 Aktivitas Lainnya</option>
              </select>
            </div>

            <div class="bulk-form-group">
              <label class="bulk-form-label">Durasi Kegiatan</label>
              <select id="bulkUploadDurasi" class="bulk-form-control">
                <option value="30 Menit">30 Menit</option>
                <option value="1 Jam" selected>1 Jam</option>
                <option value="2 Jam">2 Jam</option>
                <option value="3 Jam">3 Jam</option>
                <option value="Full Day (4+ Jam)">Full Day (4+ Jam)</option>
              </select>
            </div>
          </div>

          <div class="bulk-form-group" style="margin-top: 10px;">
            <label class="bulk-form-label">
              <span>Tempat / Lokasi Pelaksanaan <span style="color:#ef4444;">*</span></span>
              <span style="font-size:11px; color:#64748b; font-weight:normal;">Klik rekomendasi cepat di bawah</span>
            </label>
            <input type="text" id="bulkUploadLokasi" class="bulk-form-control" placeholder="Contoh: Trans Studio Mall Bandung / Festival Citylink" required>
            <div class="bulk-quick-chips">
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Trans Studio Mall (TSM) Bandung')">📍 Mall TSM</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Festival Citylink Bandung')">📍 Festival Citylink</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('23 Paskal Shopping Center')">📍 23 Paskal</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Borma Margacinta')">📍 Borma Margacinta</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Borma Kiara Condong')">📍 Borma Kircon</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('The Kings Shopping Centre')">📍 The Kings</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Miko Mall Kopo')">📍 Miko Mall</span>
              <span class="bulk-chip" onclick="setBulkUploadLocationChip('Showroom Tunas Toyota Kiaracondong')">📍 Showroom Kircon</span>
            </div>
          </div>
        </div>

        <!-- Bagian 5: Opsi Mode Upload & Keterangan -->
        <div>
          <div class="bulk-section-title">
            <i class="fa-solid fa-sliders" style="color: #7c3aed;"></i> 5. Mode Upload &amp; Catatan
          </div>
          
          <div class="bulk-mode-container">
            <label class="bulk-mode-card">
              <input type="radio" name="bulk_mode_upload" value="gabung" checked>
              <div>
                <strong style="font-size: 12.5px; color: #0f172a;">Gabungkan ke 1 Aktivitas</strong>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">(Rekomendasi) Seluruh foto dikelompokkan ke dalam satu kartu kegiatan resmi dengan galeri multi-foto.</p>
              </div>
            </label>

            <label class="bulk-mode-card">
              <input type="radio" name="bulk_mode_upload" value="pisah">
              <div>
                <strong style="font-size: 12.5px; color: #0f172a;">1 Foto = 1 Aktivitas</strong>
                <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Setiap foto dicatat sebagai kartu kegiatan terpisah di timeline dan galeri.</p>
              </div>
            </label>
          </div>

          <div class="bulk-form-group" style="margin-top: 10px;">
            <label class="bulk-form-label">Catatan / Keterangan Kegiatan</label>
            <textarea id="bulkUploadKeterangan" rows="2" class="bulk-form-control" placeholder="Tuliskan catatan aktivitas, interaksi prospek, atau hasil kegiatan..."></textarea>
          </div>
        </div>

        <!-- Progress Box -->
        <div id="bulkUploadProgressBox" class="bulk-progress-box">
          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #0f172a;">
            <span id="bulkUploadProgressText"><i class="fa-solid fa-circle-notch fa-spin"></i> Mengunggah foto...</span>
            <span id="bulkUploadProgressPercent" style="color: #eb0a1e;">0%</span>
          </div>
          <div class="bulk-progress-bar-bg">
            <div id="bulkUploadProgressBar" class="bulk-progress-bar-fill"></div>
          </div>
        </div>

      </div>

      <!-- Modal Footer -->
      <div class="bulk-upload-footer">
        <button type="button" class="btn-bulk-cancel" onclick="closeBulkUploadModal()">Batal</button>
        <button type="submit" id="btnSubmitBulkUpload" class="btn-bulk-submit">
          <i class="fa-solid fa-cloud-arrow-up"></i>
          <span id="btnSubmitBulkLabel">Mulai Upload Foto</span>
        </button>
      </div>
    </form>

  </div>
</div>

