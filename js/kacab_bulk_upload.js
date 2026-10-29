/**
 * js/kacab_bulk_upload.js
 * Modul Multi-Foto Bulk Upload Aktivitas Sales untuk Kepala Cabang (Kacab)
 */

let bulkUploadSelectedFiles = [];
let bulkUploadWiraniaga = [];
let isBulkUploading = false;
let isKeteranganUserModified = false;

function getBulkUploadApiUrl(endpoint) {
  const isNested = window.location.pathname.includes('/pages/') || 
                   window.location.pathname.includes('/pages_kacab/') || 
                   window.location.pathname.includes('/pages_spv/') || 
                   window.location.pathname.includes('/kacab/') || 
                   window.location.pathname.includes('/spv/');
  return (isNested ? '../api/' : 'api/') + endpoint;
}

/**
 * Format bytes ke string yang mudah dibaca (KB / MB)
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Buka Modal Upload Banyak Foto
 */
async function openBulkUploadModal(prefillData = {}) {
  const modal = document.getElementById('modalBulkUploadKacab');
  if (!modal) return;

  // Set default Tanggal & Jam jika belum diisi
  const tglInput = document.getElementById('bulkUploadTanggal');
  if (tglInput && !tglInput.value) {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    tglInput.value = `${yyyy}-${mm}-${dd}`;
  }

  const jamInput = document.getElementById('bulkUploadJam');
  if (jamInput && !jamInput.value) {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const ii = String(now.getMinutes()).padStart(2, '0');
    jamInput.value = `${hh}:${ii}`;
  }

  // Set default Sesi Waktu otomatis sesuai jam sekarang
  const currentHour = new Date().getHours();
  let defaultSesi = 'Pagi';
  if (currentHour >= 12 && currentHour < 15) defaultSesi = 'Siang';
  else if (currentHour >= 15 && currentHour < 18) defaultSesi = 'Sore';
  else if (currentHour >= 18 || currentHour < 5) defaultSesi = 'Malam';

  const radioSesi = document.querySelector(`input[name="bulk_sesi_waktu"][value="${defaultSesi}"]`);
  if (radioSesi) radioSesi.checked = true;

  // Prefill jika ada
  if (prefillData.nama_sales) {
    const salesInput = document.getElementById('bulkUploadSelectSales');
    if (salesInput) salesInput.value = prefillData.nama_sales;
  }
  if (prefillData.tipe_aktivitas) {
    const tipeInput = document.getElementById('bulkUploadTipe');
    if (tipeInput) tipeInput.value = prefillData.tipe_aktivitas;
  }
  if (prefillData.lokasi) {
    const lokasiInput = document.getElementById('bulkUploadLokasi');
    if (lokasiInput) lokasiInput.value = prefillData.lokasi;
  }

  // Load daftar sales cabang jika belum dimuat
  await loadBulkUploadSalesList();

  // Reset progress bar
  hideBulkUploadProgress();

  // Reset status modifikasi keterangan & generate otomatis
  isKeteranganUserModified = false;
  const templateSel = document.getElementById('bulkUploadTemplateKeterangan');
  if (templateSel) templateSel.value = 'AUTO';
  updateAutoKeterangan();

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';

  // Pastikan form scroll posisi di atas saat baru dibuka
  const bodyEl = modal.querySelector('.bulk-upload-body');
  if (bodyEl) bodyEl.scrollTop = 0;
}

/**
 * Tutup Modal Upload Banyak Foto
 */
function closeBulkUploadModal() {
  if (isBulkUploading) {
    if (!confirm('Proses upload sedang berjalan. Apakah Anda yakin ingin membatalkan?')) {
      return;
    }
  }

  const modal = document.getElementById('modalBulkUploadKacab');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }
  isBulkUploading = false;
  hideBulkUploadProgress();
}

/**
 * Muat daftar sales dan wiraniaga dari API
 */
async function loadBulkUploadSalesList() {
  const selectEl = document.getElementById('bulkUploadSelectSales');
  if (!selectEl) return;

  if (bulkUploadWiraniaga.length > 0) return; // sudah dimuat

  try {
    const res = await fetch(getBulkUploadApiUrl('api_wiraniaga.php'));
    const json = await res.json();
    if (json.status === 'success' && Array.isArray(json.data)) {
      bulkUploadWiraniaga = json.data;
      
      let html = `
        <option value="" disabled selected>-- Pilih Wiraniaga / Tim Pelaksana --</option>
        <option value="ALL_TEAM" data-id="1">👥 Tim Sales Cabang (Gabungan Seluruh Sales)</option>
        <optgroup label="Wiraniaga Cabang Tunas Toyota Kiaracondong">
      `;

      // Sort nama sales
      const sorted = [...bulkUploadWiraniaga].sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''));
      sorted.forEach(s => {
        const id = s.id || s.sales_account_id || 1;
        const spv = s.nama_spv ? ` (SPV: ${s.nama_spv})` : '';
        const level = s.tingkatan ? ` [${s.tingkatan}]` : '';
        html += `<option value="${escapeBulkHtml(s.nama_lengkap)}" data-id="${id}">${escapeBulkHtml(s.nama_lengkap)}${level}${spv}</option>`;
      });

      html += `</optgroup>`;
      selectEl.innerHTML = html;
    }
  } catch (err) {
    console.error('Gagal memuat wiraniaga untuk bulk upload:', err);
  }
}

function escapeBulkHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Handler Drag and Drop
 */
function initBulkUploadDropzone() {
  const dropzone = document.getElementById('bulkUploadDropzone');
  const fileInput = document.getElementById('bulkUploadFileInput');
  if (!dropzone || !fileInput) return;

  ['dragenter', 'dragover'].forEach(evtName => {
    dropzone.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.add('drag-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(evtName => {
    dropzone.addEventListener(evtName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropzone.classList.remove('drag-active');
    }, false);
  });

  dropzone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    if (dt && dt.files && dt.files.length > 0) {
      addBulkUploadFiles(Array.from(dt.files));
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      addBulkUploadFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset agar bisa memilih file yang sama jika perlu
    }
  });

  // Listener untuk sinkronisasi otomatis teks keterangan saat user memilih form
  const selSales = document.getElementById('bulkUploadSelectSales');
  if (selSales) selSales.addEventListener('change', updateAutoKeterangan);

  const tipeSelect = document.getElementById('bulkUploadTipe');
  if (tipeSelect) tipeSelect.addEventListener('change', updateAutoKeterangan);

  const lokasiInput = document.getElementById('bulkUploadLokasi');
  if (lokasiInput) lokasiInput.addEventListener('input', updateAutoKeterangan);

  const sesiRadios = document.querySelectorAll('input[name="bulk_sesi_waktu"]');
  sesiRadios.forEach(r => r.addEventListener('change', updateAutoKeterangan));
}

/**
 * Tambah file baru ke antrian
 */
function addBulkUploadFiles(newFiles) {
  const allowedExts = ['jpg', 'jpeg', 'png', 'webp', 'jfif'];
  let addedCount = 0;

  newFiles.forEach(file => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowedExts.includes(ext) && !file.type.startsWith('image/')) {
      return; // lewati non gambar
    }

    // Hindari duplikat persis nama & ukuran
    const isDup = bulkUploadSelectedFiles.some(f => f.name === file.name && f.size === file.size);
    if (!isDup) {
      bulkUploadSelectedFiles.push(file);
      addedCount++;
    }
  });

  renderBulkUploadPreviews();
}

/**
 * Hapus 1 file dari antrian
 */
function removeBulkUploadFile(idx) {
  if (idx >= 0 && idx < bulkUploadSelectedFiles.length) {
    bulkUploadSelectedFiles.splice(idx, 1);
    renderBulkUploadPreviews();
  }
}

/**
 * Bersihkan seluruh file dari antrian
 */
function clearBulkUploadFiles() {
  bulkUploadSelectedFiles = [];
  renderBulkUploadPreviews();
}

/**
 * Render grid preview thumbnail foto
 */
function renderBulkUploadPreviews() {
  const container = document.getElementById('bulkUploadPreviewContainer');
  const grid = document.getElementById('bulkUploadPreviewGrid');
  const countLabel = document.getElementById('bulkUploadCountLabel');
  const submitBtn = document.getElementById('btnSubmitBulkUpload');
  const submitBtnLabel = document.getElementById('btnSubmitBulkLabel');

  if (!container || !grid) return;

  const total = bulkUploadSelectedFiles.length;
  if (total === 0) {
    container.style.display = 'none';
    grid.innerHTML = '';
    if (countLabel) countLabel.textContent = '0 Foto Terpilih';
    if (submitBtnLabel) submitBtnLabel.textContent = 'Mulai Upload Foto';
    return;
  }

  container.style.display = 'block';

  // Hitung total size
  const totalBytes = bulkUploadSelectedFiles.reduce((acc, f) => acc + f.size, 0);
  if (countLabel) {
    countLabel.innerHTML = `<strong>${total} Foto Terpilih</strong> <span style="color:#64748b; font-weight:normal;">(Total: ${formatFileSize(totalBytes)})</span>`;
  }

  if (submitBtnLabel) {
    submitBtnLabel.textContent = `Upload ${total} Foto Sekarang`;
  }

  grid.innerHTML = '';
  bulkUploadSelectedFiles.forEach((file, idx) => {
    const card = document.createElement('div');
    card.className = 'bulk-thumb-card';

    const img = document.createElement('img');
    img.alt = file.name;
    img.src = URL.createObjectURL(file);
    img.onload = () => URL.revokeObjectURL(img.src);

    const badge = document.createElement('span');
    badge.className = 'bulk-thumb-size';
    badge.textContent = formatFileSize(file.size);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'bulk-thumb-remove';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.title = 'Hapus foto ini';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeBulkUploadFile(idx);
    };

    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(removeBtn);
    grid.appendChild(card);
  });
}

/**
 * Set preset tanggal cepat (Hari Ini / Kemarin)
 */
function setBulkUploadDatePreset(preset) {
  const tglInput = document.getElementById('bulkUploadTanggal');
  if (!tglInput) return;

  const d = new Date();
  if (preset === 'yesterday') {
    d.setDate(d.getDate() - 1);
  }
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  tglInput.value = `${yyyy}-${mm}-${dd}`;
}

/**
 * Pilih chip rekomendasi lokasi cepat
 */
function setBulkUploadLocationChip(locText) {
  const lokasiInput = document.getElementById('bulkUploadLokasi');
  if (lokasiInput) {
    lokasiInput.value = locText;
    lokasiInput.focus();
    updateAutoKeterangan();
  }
}

/**
 * Buat narasi keterangan aktivitas secara cerdas & otomatis dari sistem
 */
function generateSystemKeterangan() {
  const selSales = document.getElementById('bulkUploadSelectSales');
  let namaSales = '';
  if (selSales && selSales.value) {
    namaSales = selSales.value === 'ALL_TEAM' ? 'Tim Sales Cabang' : selSales.value;
  } else {
    namaSales = 'Tim Sales Cabang';
  }

  const tipe = document.getElementById('bulkUploadTipe')?.value || 'Pameran (Exhibition / Booth)';
  const lokasi = document.getElementById('bulkUploadLokasi')?.value.trim() || 'Bandung & Sekitarnya';
  const sesiRadio = document.querySelector('input[name="bulk_sesi_waktu"]:checked');
  const sesi = sesiRadio ? sesiRadio.value : 'Pagi';

  let ket = '';
  if (tipe.includes('Pameran') || tipe.includes('Exhibition') || tipe.includes('Booth')) {
    ket = `Dokumentasi kegiatan penjagaan booth pameran unit display Toyota di ${lokasi} sesi ${sesi} oleh ${namaSales}.`;
  } else if (tipe.includes('Canvassing') || tipe.includes('Door to Door')) {
    ket = `Dokumentasi aktivitas canvassing lapangan dan prospek calon konsumen di wilayah ${lokasi} sesi ${sesi} oleh ${namaSales}.`;
  } else if (tipe.includes('Customer Gathering') || tipe.includes('Event')) {
    ket = `Dokumentasi customer gathering & event semarak promo cabang bersama konsumen di ${lokasi} oleh ${namaSales}.`;
  } else if (tipe.includes('Test Drive')) {
    ket = `Dokumentasi pendampingan test drive unit mobil Toyota bersama customer di ${lokasi} oleh ${namaSales}.`;
  } else if (tipe.includes('Delivery') || tipe.includes('Handover')) {
    ket = `Dokumentasi proses delivery ceremony dan serah terima unit kendaraan baru Toyota kepada customer di ${lokasi} oleh ${namaSales}.`;
  } else if (tipe.includes('Pertemuan Prospek') || tipe.includes('Kantor Customer')) {
    ket = `Dokumentasi pertemuan prospek dan konsultasi produk Toyota bersama calon customer di ${lokasi} oleh ${namaSales}.`;
  } else if (tipe.includes('Flyering') || tipe.includes('Prospecting')) {
    ket = `Dokumentasi penyebaran flyer brosur dan prospecting interaktif di area ${lokasi} sesi ${sesi} oleh ${namaSales}.`;
  } else if (tipe.includes('Showroom')) {
    ket = `Dokumentasi duty showroom dan pelayanan konsumen walk-in di ${lokasi} sesi ${sesi} oleh ${namaSales}.`;
  } else {
    ket = `Dokumentasi kegiatan ${tipe} di ${lokasi} sesi ${sesi} oleh ${namaSales}.`;
  }
  return ket;
}

/**
 * Update otomatis keterangan ke textarea jika belum dimodifikasi manual
 */
function updateAutoKeterangan() {
  if (isKeteranganUserModified) return;
  const ketTextarea = document.getElementById('bulkUploadKeterangan');
  const templateSel = document.getElementById('bulkUploadTemplateKeterangan');
  if (!ketTextarea) return;

  if (!templateSel || templateSel.value === 'AUTO') {
    ketTextarea.value = generateSystemKeterangan();
    updateKeteranganBadge(true);
  }
}

/**
 * Regenerasi paksa keterangan otomatis
 */
function forceGenerateAutoKeterangan() {
  isKeteranganUserModified = false;
  const templateSel = document.getElementById('bulkUploadTemplateKeterangan');
  if (templateSel) templateSel.value = 'AUTO';
  const ketTextarea = document.getElementById('bulkUploadKeterangan');
  if (ketTextarea) {
    ketTextarea.value = generateSystemKeterangan();
  }
  updateKeteranganBadge(true);
}

/**
 * Deteksi saat user mengetik manual di textarea
 */
function onKeteranganManualInput() {
  const ketTextarea = document.getElementById('bulkUploadKeterangan');
  isKeteranganUserModified = !!(ketTextarea && ketTextarea.value.trim());
  updateKeteranganBadge(!isKeteranganUserModified);
}

/**
 * Update status visual badge
 */
function updateKeteranganBadge(isAuto) {
  const badge = document.getElementById('bulkAutoKeteranganBadge');
  if (!badge) return;
  if (isAuto) {
    badge.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Terisi Otomatis oleh Sistem';
    badge.style.background = '#dcfce7';
    badge.style.color = '#166534';
    badge.style.borderColor = '#bbf7d0';
  } else {
    badge.innerHTML = '<i class="fa-solid fa-pen"></i> Kustom Sendiri';
    badge.style.background = '#fef3c7';
    badge.style.color = '#92400e';
    badge.style.borderColor = '#fde68a';
  }
}

/**
 * Handler saat dropdown template dipilih
 */
function onBulkTemplateChange(val) {
  const ketTextarea = document.getElementById('bulkUploadKeterangan');
  if (!ketTextarea) return;

  if (val === 'AUTO') {
    forceGenerateAutoKeterangan();
    return;
  }

  isKeteranganUserModified = true;
  updateKeteranganBadge(false);

  const selSales = document.getElementById('bulkUploadSelectSales');
  const namaSales = (selSales && selSales.value && selSales.value !== 'ALL_TEAM') ? selSales.value : 'Tim Sales Cabang';
  const lokasi = document.getElementById('bulkUploadLokasi')?.value.trim() || 'Bandung & Sekitarnya';

  const templates = {
    STAND_PAMERAN: `Penjagaan booth pameran & interaksi pengunjung pameran mobil Toyota di ${lokasi} oleh ${namaSales}.`,
    SIMULASI_PROSPEK: `Pelayanan informasi unit display, simulasi hitungan kredit, & pengumpulan database prospek di ${lokasi} oleh ${namaSales}.`,
    CANVASSING_FLYER: `Aktivitas canvassing lapangan, door to door, dan pembagian flyer promo Toyota di wilayah ${lokasi} oleh ${namaSales}.`,
    TEST_DRIVE: `Pendampingan sesi test drive unit kendaraan Toyota bersama calon konsumen di ${lokasi} oleh ${namaSales}.`,
    DELIVERY: `Proses delivery ceremony & serah terima unit kendaraan baru Toyota kepada customer di ${lokasi} oleh ${namaSales}.`,
    GATHERING: `Kegiatan customer gathering cabang & presentasi promo unit Toyota bersama konsumen di ${lokasi} oleh ${namaSales}.`,
    NEGOSIASI: `Pertemuan konsultasi pembelian mobil Toyota dan tindak lanjut negosiasi SPK konsumen di ${lokasi} oleh ${namaSales}.`,
    SHOWROOM: `Penjagaan showroom duty cabang dan pelayanan konsumen walk-in Toyota di ${lokasi} oleh ${namaSales}.`
  };

  if (templates[val]) {
    ketTextarea.value = templates[val];
  }
}

/**
 * Terapkan quick template dari chip
 */
function applyQuickKeteranganTemplate(key) {
  const sel = document.getElementById('bulkUploadTemplateKeterangan');
  if (sel) {
    sel.value = key;
    onBulkTemplateChange(key);
  }
}

/**
 * Progress Bar Controls
 */
function showBulkUploadProgress(percent, text) {
  const pBox = document.getElementById('bulkUploadProgressBox');
  const pBar = document.getElementById('bulkUploadProgressBar');
  const pText = document.getElementById('bulkUploadProgressText');
  const pPercent = document.getElementById('bulkUploadProgressPercent');

  if (pBox) pBox.style.display = 'block';
  if (pBar) pBar.style.width = `${Math.min(100, Math.max(0, percent))}%`;
  if (pText) pText.textContent = text || 'Mengunggah foto...';
  if (pPercent) pPercent.textContent = `${Math.round(percent)}%`;
}

function hideBulkUploadProgress() {
  const pBox = document.getElementById('bulkUploadProgressBox');
  if (pBox) pBox.style.display = 'none';
}

/**
 * SUBMIT BULK UPLOAD (Mendukung Batch Chunking untuk puluhan foto sekaligus)
 */
async function submitBulkUpload(event) {
  if (event) event.preventDefault();

  if (isBulkUploading) return;

  if (bulkUploadSelectedFiles.length === 0) {
    if (typeof customAlert === 'function') {
      customAlert('Pilih Foto Terlebih Dahulu', 'Silakan pilih atau seret minimal 1 foto kegiatan untuk diunggah.', 'warning');
    } else {
      alert('Silakan pilih atau seret minimal 1 foto kegiatan untuk diunggah.');
    }
    return;
  }

  const selectSales = document.getElementById('bulkUploadSelectSales');
  if (!selectSales || !selectSales.value) {
    if (typeof customAlert === 'function') {
      customAlert('Wiraniaga Belum Dipilih', 'Silakan pilih nama wiraniaga atau Tim Sales pelaksana.', 'warning');
    } else {
      alert('Silakan pilih nama wiraniaga atau Tim Sales pelaksana.');
    }
    selectSales?.focus();
    return;
  }

  const selOption = selectSales.options[selectSales.selectedIndex];
  const salesAccountId = selOption ? (selOption.getAttribute('data-id') || '1') : '1';
  const namaSales = selectSales.value === 'ALL_TEAM' ? 'Tim Sales Cabang' : selectSales.value;

  const tanggal = document.getElementById('bulkUploadTanggal')?.value || '';
  const jam = document.getElementById('bulkUploadJam')?.value || '09:00';
  const sesiRadio = document.querySelector('input[name="bulk_sesi_waktu"]:checked');
  const sesiWaktu = sesiRadio ? sesiRadio.value : 'Pagi';

  const tipeAktivitas = document.getElementById('bulkUploadTipe')?.value || 'Pameran (Exhibition / Booth)';
  const lokasi = document.getElementById('bulkUploadLokasi')?.value.trim() || 'Bandung & Sekitarnya';
  const durasi = document.getElementById('bulkUploadDurasi')?.value || '1 Jam';
  const keterangan = document.getElementById('bulkUploadKeterangan')?.value.trim() || generateSystemKeterangan();

  const modeRadio = document.querySelector('input[name="bulk_mode_upload"]:checked');
  const modeUpload = modeRadio ? modeRadio.value : 'gabung';

  const btnSubmit = document.getElementById('btnSubmitBulkUpload');
  const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memproses Upload...';
  }

  isBulkUploading = true;

  // Upload dalam batch berukuran 10 file agar tidak terkena limit server (max_file_uploads: 20)
  const BATCH_SIZE = 10;
  const totalFiles = bulkUploadSelectedFiles.length;
  const totalBatches = Math.ceil(totalFiles / BATCH_SIZE);
  let uploadedSuccessCount = 0;
  let currentActivityId = 0;

  try {
    for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
      const start = batchIdx * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, totalFiles);
      const batchFiles = bulkUploadSelectedFiles.slice(start, end);

      const percent = Math.round(((start) / totalFiles) * 100);
      showBulkUploadProgress(percent, `Mengunggah batch ${batchIdx + 1} dari ${totalBatches} (${start + 1}-${end} dari ${totalFiles} foto)...`);

      const formData = new FormData();
      formData.append('sales_account_id', salesAccountId);
      formData.append('nama_sales', namaSales);
      formData.append('tanggal', tanggal);
      formData.append('jam', jam);
      formData.append('sesi_waktu', sesiWaktu);
      formData.append('tipe_aktivitas', tipeAktivitas);
      formData.append('lokasi', lokasi);
      formData.append('durasi', durasi);
      formData.append('keterangan', keterangan);
      formData.append('mode_upload', modeUpload);

      if (currentActivityId > 0 && modeUpload === 'gabung') {
        formData.append('existing_activity_id', currentActivityId);
      }

      batchFiles.forEach(file => {
        formData.append('foto[]', file, file.name);
      });

      const res = await fetch(getBulkUploadApiUrl('api_kacab_upload_foto.php'), {
        method: 'POST',
        body: formData
      });

      const json = await res.json();
      if (json.status !== 'success') {
        throw new Error(json.message || `Gagal mengunggah batch ke-${batchIdx + 1}`);
      }

      if (json.activity_id && !currentActivityId) {
        currentActivityId = json.activity_id;
      }

      uploadedSuccessCount += (json.files_count || batchFiles.length);
    }

    // Selesai 100%
    showBulkUploadProgress(100, `Selesai! Berhasil mengunggah ${uploadedSuccessCount} foto.`);

    setTimeout(() => {
      closeBulkUploadModal();
      clearBulkUploadFiles();

      const successMsg = `Berhasil mengunggah ${uploadedSuccessCount} foto aktivitas ${namaSales}! Foto otomatis tersimpan di galeri cabang dan timeline aktivitas.`;
      if (typeof customAlert === 'function') {
        customAlert('Upload Berhasil!', successMsg, 'success');
      } else {
        alert(successMsg);
      }

      // Refresh halaman jika ada fungsi galeri atau timeline
      if (typeof fetchGalleryData === 'function') {
        fetchGalleryData();
      }
      if (typeof loadTimeline === 'function') {
        loadTimeline();
      }
    }, 600);

  } catch (err) {
    console.error('Error saat bulk upload:', err);
    hideBulkUploadProgress();
    const errMsg = 'Terjadi kesalahan saat mengunggah foto: ' + (err.message || 'Error server');
    if (typeof customAlert === 'function') {
      customAlert('Gagal Upload', errMsg, 'error');
    } else {
      alert(errMsg);
    }
  } finally {
    isBulkUploading = false;
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnHtml;
    }
  }
}

// Inisialisasi saat DOM siap
document.addEventListener('DOMContentLoaded', () => {
  initBulkUploadDropzone();
});

