function escapeHtml(str) {
    if (!str && str !== 0) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ==========================================
        // PHOTO PICKER HELPER
        // ==========================================
        function showPhotoSourcePicker(onSelectGallery, onSelectCamera) {
            let picker = document.getElementById('globalPhotoSourcePicker');
            if (!picker) {
                picker = document.createElement('div');
                picker.id = 'globalPhotoSourcePicker';
                picker.className = 'modal-overlay';
                picker.style.zIndex = '20000';
                
                picker.innerHTML = `
                    <div class="modal-content" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h3>Pilih Sumber Foto</h3>
                            <button type="button" class="btn-close-modal" id="pickerBtnClose"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div style="display: flex; flex-direction: column; gap: 10px;">
                            <button type="button" class="btn-main" id="pickerBtnCamera" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
                                <i class="fa-solid fa-camera"></i> Ambil dari Kamera
                            </button>
                            <button type="button" class="btn-main" id="pickerBtnGallery">
                                <i class="fa-solid fa-image"></i> Pilih Foto dari Galeri
                            </button>
                            <button type="button" class="btn-outline-blue" id="pickerBtnCancel">Batal</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(picker);
                
                picker.addEventListener('click', (e) => {
                    if (e.target === picker) {
                        hidePicker();
                    }
                });
            }

            function showPicker() {
                picker.classList.add('show');
            }

            function hidePicker() {
                picker.classList.remove('show');
            }

            const btnCamera = picker.querySelector('#pickerBtnCamera');
            const btnGallery = picker.querySelector('#pickerBtnGallery');
            const btnCancel = picker.querySelector('#pickerBtnCancel');
            const btnClose = picker.querySelector('#pickerBtnClose');

            const newBtnCamera = btnCamera.cloneNode(true);
            const newBtnGallery = btnGallery.cloneNode(true);
            const newBtnCancel = btnCancel.cloneNode(true);
            const newBtnClose = btnClose.cloneNode(true);

            btnCamera.replaceWith(newBtnCamera);
            btnGallery.replaceWith(newBtnGallery);
            btnCancel.replaceWith(newBtnCancel);
            btnClose.replaceWith(newBtnClose);

            newBtnCamera.addEventListener('click', () => { hidePicker(); setTimeout(onSelectCamera, 100); });
            newBtnGallery.addEventListener('click', () => { hidePicker(); setTimeout(onSelectGallery, 100); });
            newBtnCancel.addEventListener('click', () => { hidePicker(); });
            newBtnClose.addEventListener('click', () => { hidePicker(); });

            showPicker();
        }

        function openPhotoChooser(event, galleryId, cameraId) {
            event.stopPropagation();
            if (event && event.target && event.target.tagName === 'INPUT') return;
            showPhotoSourcePicker(
                () => document.getElementById(galleryId).click(),
                () => document.getElementById(cameraId).click()
            );
        }

        // ==========================================
        // 1. STATE FOTO AKTIVITAS
        // ==========================================
        let fotoAktivitasList = [];
        const maksFoto = 5;

        function triggerFlash() {
            const flash = document.getElementById('cameraFlash');
            if (flash) {
                flash.classList.add('active');
                setTimeout(() => {
                    flash.classList.remove('active');
                }, 50);
            }
        }

        function getWatermarkText() {
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
            const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
            
            let locStr = "Lokasi belum didapat";
            const locEl = document.querySelector('#lokasiValue p');
            if (locEl && locEl.textContent && !locEl.textContent.includes('Menunggu')) {
                locStr = locEl.textContent;
            } else if (posisiTerbaik) {
                locStr = `${posisiTerbaik.coords.latitude.toFixed(5)}, ${posisiTerbaik.coords.longitude.toFixed(5)}`;
            }

            return {
                datetime: `${dateStr} ${timeStr}`,
                location: locStr
            };
        }

        function addWatermarkToImage(file, callback) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.onload = function () {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Set canvas size matching image
                    canvas.width = img.width;
                    canvas.height = img.height;

                    // Draw original image
                    ctx.drawImage(img, 0, 0);

                    // Add watermark overlay at bottom
                    const watermarkHeight = Math.max(img.height * 0.15, 80); 
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                    ctx.fillRect(0, img.height - watermarkHeight, img.width, watermarkHeight);

                    // Add watermark text
                    const wmText = getWatermarkText();
                    const fontSize = Math.max(img.width * 0.03, 16);
                    ctx.font = `bold ${fontSize}px sans-serif`;
                    ctx.fillStyle = 'white';
                    ctx.textBaseline = 'middle';
                    
                    const padding = fontSize;
                    // Draw Date/Time
                    ctx.fillText(wmText.datetime, padding, img.height - watermarkHeight + (watermarkHeight * 0.3));
                    
                    // Draw Location (might need wrapping, but we'll keep it simple single line for now)
                    ctx.font = `${Math.max(fontSize * 0.8, 12)}px sans-serif`;
                    ctx.fillText(wmText.location.substring(0, 60) + (wmText.location.length > 60 ? '...' : ''), padding, img.height - watermarkHeight + (watermarkHeight * 0.7));

                    const watermarkedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    callback(watermarkedDataUrl);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }

        function handleNewFiles(event) {
            triggerFlash();
            
            const files = event.target.files;
            if (fotoAktivitasList.length + files.length > maksFoto) {
                alert(`Maksimal hanya boleh ${maksFoto} foto.`);
                return;
            }
            let loadedCount = 0;
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                addWatermarkToImage(file, (watermarkedDataUrl) => {
                    fotoAktivitasList.push({ file: file, preview: watermarkedDataUrl, watermarked: watermarkedDataUrl });
                    renderPhotoGrid();
                    loadedCount++;
                    if (loadedCount === files.length) {
                        // All finished
                    }
                });
            }
            event.target.value = '';
        }

        function hapusFoto(index) {
            fotoAktivitasList.splice(index, 1);
            renderPhotoGrid();
        }

        function renderPhotoGrid() {
            const grid = document.getElementById('photoGrid');
            const countText = document.getElementById('photoCount');
            countText.textContent = `${fotoAktivitasList.length}/${maksFoto} Foto`;
            grid.innerHTML = '';
            fotoAktivitasList.forEach((fotoObj, index) => {
                const item = document.createElement('div');
                item.className = 'photo-item';
                item.innerHTML = `
                <img src="${fotoObj.preview}" alt="Foto ${index + 1}">
                <button type="button" class="remove-btn" onclick="hapusFoto(${index})"><i class="fa-solid fa-xmark"></i></button>`;
                grid.appendChild(item);
            });
            if (fotoAktivitasList.length < maksFoto) {
                const uploadBox = document.createElement('div');
                uploadBox.className = 'upload-btn-box';
                uploadBox.onclick = () => document.getElementById('inputFoto').click();
                uploadBox.innerHTML = `<i class="fa-solid fa-plus"></i><span>Tambah</span>`;
                grid.appendChild(uploadBox);
            }
        }

        // ==========================================
        // 2. FUNGSI GPS DAN PETA (MAP)
        // ==========================================
        let gpsWatcher;
        let gpsTimeout;
        let posisiTerbaik = null;

        let map; // Variabel penyimpan peta
        let marker; // Penanda lokasi (Pin)
        let circle; // Lingkaran radius akurasi

        const TARGET_AKURASI = 30;
        const TOLERANSI_MAX = 100;
        const WAKTU_TUNGGU = 15000;

        function getLocation() {
            const lokasiText = document.querySelector('#lokasiValue p');
            const lokasiSpan = document.querySelector('#lokasiValue span');

            if (navigator.geolocation) {
                lokasiText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Membaca sinyal...';
                lokasiSpan.innerText = 'Mencari akurasi terbaik...';

                if (gpsWatcher) navigator.geolocation.clearWatch(gpsWatcher);
                clearTimeout(gpsTimeout);
                posisiTerbaik = null;

                gpsTimeout = setTimeout(() => {
                    navigator.geolocation.clearWatch(gpsWatcher);
                    if (posisiTerbaik && posisiTerbaik.coords.accuracy <= TOLERANSI_MAX) {
                        showPosition(posisiTerbaik, true);
                    } else {
                        const akurasiMeleset = posisiTerbaik ? Math.round(posisiTerbaik.coords.accuracy) : 'Unknown';
                        lokasiText.innerText = "Sinyal GPS Lemah";
                        lokasiSpan.innerText = `Akurasi ${akurasiMeleset}m (Max ${TOLERANSI_MAX}m). Buka Google Maps sebentar lalu coba lagi.`;
                    }
                }, WAKTU_TUNGGU);

                gpsWatcher = navigator.geolocation.watchPosition(
                    async (position) => {
                        const akurasi = Math.round(position.coords.accuracy);

                        // Render peta secara live selagi mencari titik terbaik
                        updateMapUI(position.coords.latitude, position.coords.longitude, akurasi);

                        if (!posisiTerbaik || akurasi < posisiTerbaik.coords.accuracy) {
                            posisiTerbaik = position;
                            lokasiSpan.innerText = `Menstabilkan... (Akurasi: ${akurasi}m)`;
                        }

                        if (akurasi <= TARGET_AKURASI) {
                            clearTimeout(gpsTimeout);
                            navigator.geolocation.clearWatch(gpsWatcher);
                            await showPosition(position, false);
                        }
                    },
                    showError,
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                lokasiText.innerText = "GPS tidak didukung";
            }
        }

        // Fungsi Membangun dan Mengupdate Peta
        function updateMapUI(lat, lon, akurasi) {
            const mapContainer = document.getElementById('map-container');
            mapContainer.style.display = 'block'; // Tampilkan kotak peta

            if (!map) {
                // Inisialisasi Peta Pertama Kali
                map = L.map('map-container').setView([lat, lon], 16);

                // Menggunakan peta Google Maps Street Tile Layer (Hybrid)
                L.tileLayer('http://{s}.google.com/vt?lyrs=m&x={x}&y={y}&z={z}', {
                    maxZoom: 20,
                    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
                    attribution: '© Google Maps'
                }).addTo(map);

                marker = L.marker([lat, lon]).addTo(map);
                circle = L.circle([lat, lon], { radius: akurasi, color: '#007bff', fillColor: '#007bff', fillOpacity: 0.2 }).addTo(map);
            } else {
                // Update posisi jika peta sudah ada
                map.setView([lat, lon]);
                marker.setLatLng([lat, lon]);
                circle.setLatLng([lat, lon]);
                circle.setRadius(akurasi);
            }

            // Fix agar peta tidak glitch saat div muncul
            setTimeout(() => { map.invalidateSize(); }, 100);
        }

        async function showPosition(position, isForced) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const akurasi = Math.round(position.coords.accuracy);

            const lokasiText = document.querySelector('#lokasiValue p');
            const lokasiSpan = document.querySelector('#lokasiValue span');

            lokasiText.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menerjemahkan alamat...';

            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
                const data = await response.json();

                if (data && data.address) {
                    let jalan = data.address.road || "";
                    let kelurahan = data.address.village || data.address.suburb || data.address.neighbourhood || "";
                    let kecamatan = data.address.city_district || data.address.county || "";
                    let kota = data.address.city || data.address.town || data.address.municipality || "";
                    let provinsi = data.address.state || "";

                    let bagianAlamat = [jalan, kelurahan, kecamatan, kota, provinsi];
                    let alamatLengkap = bagianAlamat.filter(item => item.trim() !== "").join(", ");

                    lokasiText.innerText = alamatLengkap;
                    lokasiSpan.innerText = `Akurasi GPS: ${akurasi} meter`;
                    lokasiText.dataset.lat = lat; lokasiText.dataset.lon = lon;
                } else {
                    lokasiText.innerText = `${lat}, ${lon}`;
                    lokasiSpan.innerText = `Akurasi GPS: ${akurasi} meter`;
                }
            } catch (error) {
                lokasiText.innerText = `${lat}, ${lon}`;
                lokasiSpan.innerText = `Akurasi: ${akurasi} meter (Offline Mode)`;
            }
        }

        function showError(error) {
            const lokasiText = document.querySelector('#lokasiValue p');
            const lokasiSpan = document.querySelector('#lokasiValue span');
            clearTimeout(gpsTimeout);
            if (error.code == error.PERMISSION_DENIED) {
                lokasiText.innerText = "Izin Lokasi Ditolak";
                lokasiSpan.innerText = "Buka pengaturan browser > Izinkan lokasi";
            } else {
                lokasiText.innerText = "Sinyal GPS Lemah";
                lokasiSpan.innerText = "Pindah ke luar ruangan tanpa atap";
            }
        }

        window.onload = function () {
            getLocation();
            autoSelectSessionTime();
            loadDailySessionActivities();
        };

        function autoSelectSessionTime() {
            const sesiSelect = document.getElementById('sesiWaktuAktivitas');
            const now = new Date();
            const hour = now.getHours();

            if (sesiSelect) {
                if (hour < 12) sesiSelect.value = 'Pagi';
                else if (hour < 15.5) sesiSelect.value = 'Siang';
                else sesiSelect.value = 'Sore';
            }
        }

        function togglePhotoRequirement() {
            const status = document.getElementById('statusAktivitas').value;
            const asterisk = document.getElementById('photoLabelAsterisk');
            if (status === 'Rencana') {
                if (asterisk) asterisk.style.display = 'none';
            } else {
                if (asterisk) asterisk.style.display = 'inline';
            }
        }

        // ==========================================
        // 3. FUNGSI SIMPAN KE DATABASE (VIA API PHP)
        // ==========================================
        async function simpanAktivitasBaru() {
            const form = document.getElementById('formAktivitas');
            const jenis = document.getElementById('jenisAktivitas').value;
            const status = document.getElementById('statusAktivitas').value;
            const sesiWaktu = document.getElementById('sesiWaktuAktivitas')?.value || 'Pagi';
            const durasi = document.getElementById('durasiAktivitas')?.value || '1 Jam';
            const keterangan = document.getElementById('keteranganAktivitas').value.trim();
            const lokasi = document.querySelector('#lokasiValue p').innerText;
            const btnSubmit = document.getElementById('btnSubmit');

            if (!form.checkValidity()) { form.reportValidity(); return; }
            if (status !== 'Rencana' && fotoAktivitasList.length === 0) { 
                alert('Wajib melampirkan minimal 1 foto aktivitas!'); 
                return; 
            }

            const formData = new FormData();
            formData.append('tipe_Aktivitas', jenis);
            formData.append('keterangan', keterangan);
            formData.append('lokasi', lokasi);
            formData.append('status', status);
            formData.append('sesi_waktu', sesiWaktu);
            formData.append('durasi', durasi);
            formData.append('sales_account_id', localStorage.getItem('idSales') || 1);
            formData.append('nama_sales', localStorage.getItem('namaSales') || 'Sales Consultant');
            fotoAktivitasList.forEach((fotoObj) => { formData.append('foto[]', fotoObj.file); });

            btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin" style="margin-right: 10px;"></i> Menyimpan...';
            btnSubmit.disabled = true;

            try {
                const response = await fetch(getApiUrl('api_simpan_aktivitas.php'), { method: 'POST', body: formData });
                const rawText = await response.text();
                let result;
                try {
                    result = JSON.parse(rawText);
                } catch (e) {
                    console.error('Non-JSON response:', rawText);
                    alert("Respon server tidak valid. Silakan muat ulang halaman.");
                    return;
                }

                if (result.status === 'success') {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert("BERHASIL", "Aktivitas berhasil disimpan!", "success");
                    } else {
                        alert("Aktivitas berhasil disimpan ke Database!");
                    }
                    form.reset();
                    fotoAktivitasList = [];
                    renderPhotoGrid();
                    autoSelectSessionTime();
                    loadDailySessionActivities();
                } else {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert("GAGAL", result.message || "Gagal menyimpan data", "danger");
                    } else {
                        alert("Gagal menyimpan: " + (result.message || "Terjadi kesalahan"));
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                alert("Terjadi kesalahan jaringan atau server.");
            } finally {
                btnSubmit.innerHTML = '<i class="fa-regular fa-paper-plane" style="margin-right: 10px;"></i> Simpan Aktivitas';
                btnSubmit.disabled = false;
            }
        }

        let allDailyActivities = [];
        let currentActiveSessionTab = 'All';

        function getApiUrl(endpoint) {
            if (window.location.pathname.includes('/pages/')) {
                return '../api/' + endpoint;
            } else {
                return 'api/' + endpoint;
            }
        }

        async function loadDailySessionActivities() {
            const listEl = document.getElementById('sessionActivityList');
            const summaryBadge = document.getElementById('sessionSummaryBadge');
            if (!listEl) return;

            try {
                let primaryUrl = getApiUrl('api_aktivitas.php?limit=50');
                let res = await fetch(primaryUrl);
                
                if (!res.ok) {
                    // Fallback URL if primary path hits 404
                    let fallbackUrl = primaryUrl.startsWith('../') ? primaryUrl.replace('../', '') : '../' + primaryUrl;
                    res = await fetch(fallbackUrl);
                }

                const json = await res.json();

                if (json.status === 'success') {
                    allDailyActivities = json.data || [];
                    const summary = json.summary || {};
                    if (summaryBadge) {
                        summaryBadge.textContent = `${summary.total_selesai || 0} Selesai | ${summary.total_pending || 0} Pending`;
                    }
                    renderSessionActivityList(allDailyActivities, currentActiveSessionTab);
                } else {
                    listEl.innerHTML = `<p style="text-align:center; color:#94a3b8; padding:20px;">Gagal memuat aktivitas</p>`;
                }
            } catch (err) {
                console.error('API Fetch error:', err);
                listEl.innerHTML = `<p style="text-align:center; color:#64748b; padding:20px; font-size:13px;"><i class="fa-solid fa-circle-exclamation" style="color:#ef4444; margin-right:6px;"></i>Gagal memuat data aktivitas. Silakan muat ulang halaman.</p>`;
            }
        }

        function switchSessionTab(session, btn) {
            currentActiveSessionTab = session;
            document.querySelectorAll('.session-tab-btn').forEach(b => b.classList.remove('active'));
            if (btn) btn.classList.add('active');
            renderSessionActivityList(allDailyActivities, session);
        }

        function renderSessionActivityList(data, sessionFilter) {
            const listEl = document.getElementById('sessionActivityList');
            if (!listEl) return;

            let filtered = data;
            if (sessionFilter && sessionFilter !== 'All') {
                filtered = data.filter(item => (item.sesi_waktu || 'Pagi') === sessionFilter);
            }

            if (filtered.length === 0) {
                listEl.innerHTML = `<p style="text-align:center; color:#64748b; padding:25px; font-size:13px;"><i class="fa-solid fa-calendar-check" style="font-size:20px; display:block; margin-bottom:6px; color:#cbd5e1;"></i>Belum ada aktivitas untuk sesi ${sessionFilter === 'All' ? 'hari ini' : sessionFilter}.</p>`;
                return;
            }

            let html = '';
            filtered.forEach(item => {
                const sesiClass = (item.sesi_waktu || 'Pagi').toLowerCase();
                const statusStr = item.status || 'Selesai';
                const isRencana = (statusStr === 'Rencana');
                const isProses = (statusStr === 'Sedang Dilakukan');
                const isSelesai = (statusStr === 'Selesai');

                let statusBadge = '';
                if (isRencana) {
                    statusBadge = '<span style="background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px; font-weight:700; font-size:10px;"><i class="fa-regular fa-calendar"></i> Rencana</span>';
                } else if (isProses) {
                    statusBadge = '<span style="background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:6px; font-weight:700; font-size:10px;"><i class="fa-solid fa-spinner fa-spin"></i> Sedang Dilakukan</span>';
                } else {
                    statusBadge = '<span style="background:#d1fae5; color:#047857; padding:3px 8px; border-radius:6px; font-weight:700; font-size:10px;"><i class="fa-solid fa-circle-check"></i> Selesai</span>';
                }

                html += `
                <div class="timeline-card">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                        <span class="session-badge ${sesiClass}">
                            <i class="fa-solid fa-clock"></i> Sesi ${escapeHtml(item.sesi_waktu || 'Pagi')}
                        </span>
                        ${statusBadge}
                    </div>

                    <div style="font-weight:800; font-size:14px; color:#0f172a; margin-bottom:4px;">${escapeHtml(item.tipe_aktivitas || '-')}</div>
                    
                    <div style="font-size:11px; color:#475569; display:flex; align-items:center; gap:8px; margin-bottom:6px; flex-wrap:wrap;">
                        <span style="background:#e0f2fe; color:#0369a1; padding:2px 8px; border-radius:6px; font-weight:700;"><i class="fa-solid fa-hourglass-half" style="color:#0284c7;"></i> Durasi: ${escapeHtml(item.durasi || '1 Jam')}</span>
                    </div>

                    <div style="font-size:12px; color:#475569; line-height:1.4; margin-bottom:6px;">${escapeHtml(item.keterangan || '-')}</div>
                    <div style="font-size:11px; color:#64748b; display:flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-location-dot" style="color:#c8102e;"></i> ${escapeHtml(item.lokasi || '-')}
                    </div>

                    ${isSelesai && item.laporan_hasil ? `
                        <div class="outcome-report-box">
                            <div style="font-weight:800; color:#047857; margin-bottom:2px; display:flex; align-items:center; gap:4px;">
                                <i class="fa-solid fa-file-circle-check"></i> Laporan Hasil Aktivitas:
                            </div>
                            <div style="color:#1e293b; font-weight:500;">${escapeHtml(item.laporan_hasil)}</div>
                            <div style="font-size:11px; color:#059669; margin-top:4px; font-weight:700;">
                                Prospek Didapat: ${item.jumlah_prospek || 0} Lead
                            </div>
                        </div>
                    ` : ''}

                    ${isRencana ? `
                        <button class="btn-report-complete" style="background: linear-gradient(135deg, #2563eb, #1d4ed8); box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);" onclick="startAktivitas(${item.id})">
                            <i class="fa-solid fa-play"></i> Mulai Aktivitas (Lakukan Sekarang)
                        </button>
                    ` : ''}

                    ${isProses ? `
                        <button class="btn-report-complete" style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);" onclick="openLaporanModal(${item.id}, '${escapeHtml(item.tipe_aktivitas || 'Aktivitas')}')">
                            <i class="fa-solid fa-circle-check"></i> Sudah Dilakukan (Isi Laporan Aktivitas)
                        </button>
                    ` : ''}
                </div>
                `;
            });

            listEl.innerHTML = html;
        }

        async function startAktivitas(id) {
            const formData = new FormData();
            formData.append('action', 'update_status');
            formData.append('aktivitas_id', id);
            formData.append('status', 'Sedang Dilakukan');

            try {
                const res = await fetch(getApiUrl('api_simpan_aktivitas.php'), {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json();
                if (json.status === 'success') {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert("BERHASIL", "Status aktivitas diubah menjadi Sedang Dilakukan!", "success");
                    } else {
                        alert("Status aktivitas diubah menjadi Sedang Dilakukan!");
                    }
                    loadDailySessionActivities();
                } else {
                    alert('Gagal memperbarui status: ' + json.message);
                }
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan jaringan.');
            }
        }

        function openLaporanModal(id, tipe) {
            document.getElementById('laporanAktivitasId').value = id;
            document.getElementById('laporanTipeAktivitas').value = tipe;
            document.getElementById('laporanModal').classList.add('show');
        }

        function closeLaporanModal() {
            document.getElementById('laporanModal').classList.remove('show');
        }

        async function submitLaporanHasilAktivitas(e) {
            if (e) e.preventDefault();

            const id = document.getElementById('laporanAktivitasId').value;
            const laporan_hasil = document.getElementById('laporanCatatan').value.trim();
            const jumlah_prospek = document.getElementById('laporanJumlahProspek').value || 0;
            const fotoInput = document.getElementById('laporanFoto');

            if (!laporan_hasil) {
                alert('Mohon isi Catatan Hasil Kegiatan!');
                return;
            }

            const formData = new FormData();
            formData.append('action', 'submit_laporan');
            formData.append('aktivitas_id', id);
            formData.append('laporan_hasil', laporan_hasil);
            formData.append('jumlah_prospek', jumlah_prospek);

            if (fotoInput && fotoInput.files.length > 0) {
                formData.append('foto_laporan', fotoInput.files[0]);
            }

            try {
                const res = await fetch(getApiUrl('api_simpan_aktivitas.php'), {
                    method: 'POST',
                    body: formData
                });
                const json = await res.json();

                if (json.status === 'success') {
                    if (typeof showCustomAlert === 'function') {
                        showCustomAlert("SUKSES", "Laporan hasil aktivitas berhasil dikirim!", "success");
                    } else {
                        alert("Laporan hasil aktivitas berhasil disimpan!");
                    }
                    closeLaporanModal();
                    document.getElementById('formLaporanHasil').reset();
                    loadDailySessionActivities();
                } else {
                    alert('Gagal mengirim laporan: ' + json.message);
                }
            } catch (err) {
                console.error(err);
                alert('Terjadi kesalahan jaringan.');
            }
        }
        
        function generateDailyReport() {
            const namaSales = localStorage.getItem('namaSales') || 'Sales';
            const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            
            const jenis = document.getElementById('jenisAktivitas').value || '-';
            const status = document.getElementById('statusAktivitas').value || '-';
            const keterangan = document.getElementById('keteranganAktivitas').value || '-';
            const lokasi = document.getElementById('lokasiValue').innerText.replace(/\n/g, ' ').trim() || '-';
            
            const reportText = `*LAPORAN HARIAN SALES*
Tanggal: ${dateStr}
Nama: ${namaSales}
Cabang: ${cabang}

*Aktivitas Terakhir Hari Ini:*
Jenis: ${jenis}
Status: ${status}
Lokasi: ${lokasi}
Keterangan: 
${keterangan}

*(Laporan dibuat otomatis dari Tunas Hub)*`;

            document.getElementById('reportText').value = reportText;
            document.getElementById('exportModal').classList.add('show');
        }
        
        function closeExportModal() {
            document.getElementById('exportModal').classList.remove('show');
        }
        
        function copyToClipboard() {
            const text = document.getElementById('reportText');
            text.select();
            text.setSelectionRange(0, 99999);
            document.execCommand("copy");
            
            alert("Teks laporan berhasil disalin!");
        }

        // ==========================================
        // KATEGORI & SUB-KATEGORI SPM AGUSTUS (TOYOTA)
        // ==========================================
        const spmSubCategories = {
            'Pameran': [
                'MALL TSM (Trans Studio Mall)',
                'MALL PASKAL 23',
                'CITYLINK (Festival Citylink)',
                'MIKO MALL',
                'BORMA KIARACONDONG',
                'BORMA MARGACINTA',
                'BORMA BOJONGSOANG',
                'Pameran Mall / Display Lainnya'
            ],
            'Residensial & FOA': [
                'Residensial KIARACONDONG',
                'Residensial BOJONGLOA KIDUL',
                'Residensial UJUNG BERUNG',
                'Residensial ANTAPANI',
                'Residensial BUAH BATU',
                'Residensial ANDIR',
                'Residensial ARCAMANIK',
                'Canvasing FOA Lapangan Lainnya'
            ],
            'Fleet / Corporate': [
                'PT NABATI',
                'PT TAKA',
                'PT BORWITA CITRA',
                'PT ELANG',
                'PT JHW INTERNATIONAL',
                'Perusahaan / Instansi Fleet Lainnya'
            ],
            'Digital Marketing': [
                'Website Official',
                'Facebook Ads / Page',
                'Instagram Ads / Feed',
                'Google Ads',
                'TikTok Content'
            ],
            'Database': [
                'Database Bengkel / Service',
                'Database Body & Paint (BP)',
                'Database Trade-In (Tukar Tambah)'
            ]
        };

        function handleJenisAktivitasChange() {
            const jenis = document.getElementById('jenisAktivitas').value;
            const groupSub = document.getElementById('groupSubJenis');
            const selectSub = document.getElementById('subJenisAktivitas');

            if (!spmSubCategories[jenis]) {
                groupSub.style.display = 'none';
                selectSub.innerHTML = '<option value="" selected>Pilih detail lokasi/target...</option>';
                return;
            }

            const items = spmSubCategories[jenis];
            let html = '<option value="" disabled selected>Pilih detail lokasi/pameran/wilayah...</option>';
            items.forEach(item => {
                html += `<option value="${item}">${item}</option>`;
            });
            selectSub.innerHTML = html;
            groupSub.style.display = 'block';
        }

        function updateKeteranganFromSub() {
            const jenis = document.getElementById('jenisAktivitas').value;
            const sub = document.getElementById('subJenisAktivitas').value;
            const ketEl = document.getElementById('keteranganAktivitas');

            if (sub && ketEl && !ketEl.value.includes(sub)) {
                ketEl.value = `[${jenis} - ${sub}] Kegiatan penawaran dan prospek unit Toyota.`;
            }
        }
