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

        let olxPhotos = [];
        const MAX_PHOTOS = 6;

        function handleOlxPhoto(event) {
            const files = Array.from(event.target.files);
            if (olxPhotos.length + files.length > MAX_PHOTOS) {
                alert(`Maksimal ${MAX_PHOTOS} foto.`);
                return;
            }

            files.forEach(file => {
                olxPhotos.push(file);
            });
            renderOlxPhotos();
            alert(`Foto berhasil ditambahkan! (${olxPhotos.length}/${MAX_PHOTOS} Foto)`);
            event.target.value = '';
        }

        function renderOlxPhotos() {
            const grid = document.getElementById('photoGridOlx');
            const area = document.getElementById('uploadAreaOlx');
            const count = document.getElementById('photoCountOlx');

            count.textContent = `${olxPhotos.length}/${MAX_PHOTOS} Foto`;
            grid.innerHTML = '';

            olxPhotos.forEach((file, i) => {
                const src = URL.createObjectURL(file);
                const div = document.createElement('div');
                div.className = 'preview-thumb';
                div.innerHTML = `
                <img src="${src}" alt="Foto ${i + 1}">
                <button type="button" class="del-btn" onclick="hapusOlxPhoto(${i})">
                    <i class="fa-solid fa-xmark"></i>
                </button>`;
                grid.appendChild(div);
            });

            if (olxPhotos.length < MAX_PHOTOS) {
                const add = document.createElement('div');
                add.className = 'preview-thumb';
                add.style.cssText = 'border:2px dashed #cbd5e1;background:#f8fafc;display:flex;align-items:center;justify-content:center;cursor:pointer;border-radius:12px;aspect-ratio:1;';
                add.innerHTML = '<i class="fa-solid fa-plus" style="color:var(--text-muted);font-size:20px;"></i>';
                add.onclick = () => document.getElementById('inputFotoOlx').click();
                grid.appendChild(add);
            }

            if (olxPhotos.length > 0) {
                grid.classList.add('show');
                area.style.display = 'none';
            } else {
                grid.classList.remove('show');
                area.style.display = '';
            }
        }

        function hapusOlxPhoto(i) {
            olxPhotos.splice(i, 1);
            renderOlxPhotos();
        }

        function simpanOlx() {
            const form = document.getElementById('formOlx');
            const btn = document.getElementById('btnSimpanOlx');

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Menyimpan...</span>';

            const sales_account_id = localStorage.getItem('idSales') || 1;
            const formData = new FormData();
            formData.append('sales_account_id', sales_account_id);
            formData.append('nama_kendaraan', document.getElementById('olxNama').value);
            formData.append('jenis_type', document.getElementById('olxJenis').value);
            formData.append('tahun', document.getElementById('olxTahun').value);
            formData.append('warna', document.getElementById('olxWarna').value);
            formData.append('harga_estimasi', document.getElementById('olxHarga').value);
            formData.append('lokasi_kecamatan', document.getElementById('olxLokasi').value);
            formData.append('deskripsi_kondisi', document.getElementById('olxDeskripsi').value);

            olxPhotos.forEach((file, index) => {
                formData.append('foto[]', file);
            });

            fetch('../api/api_olx.php', {
                method: 'POST',
                body: formData
            })
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success') {
                        btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                        btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Berhasil!</span>';
                        setTimeout(() => {
                            window.location.href = '../index.html';
                        }, 1200);
                    } else {
                        alert('Gagal menyimpan listing: ' + res.message);
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fa-solid fa-upload"></i> <span>Submit Listing</span>';
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert('Gagal terhubung ke server.');
                    btn.disabled = false;
                    btn.innerHTML = '<i class="fa-solid fa-upload"></i> <span>Submit Listing</span>';
                });
        }

        function switchTab(tab) {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById('contentUpload').style.display = 'none';
            document.getElementById('contentStatus').style.display = 'none';
            document.getElementById('contentEstimator').style.display = 'none';
            
            if (tab === 'upload') {
                document.getElementById('tabUpload').classList.add('active');
                document.getElementById('contentUpload').style.display = 'block';
            } else if (tab === 'estimator') {
                document.getElementById('tabEstimator').classList.add('active');
                document.getElementById('contentEstimator').style.display = 'block';
            } else {
                document.getElementById('tabStatus').classList.add('active');
                document.getElementById('contentStatus').style.display = 'block';
                loadTradeInList();
            }
        }

        let globalOlxData = [];
        
        setInterval(() => {
            if (document.getElementById('contentStatus') && document.getElementById('contentStatus').style.display === 'block') {
                fetch(`../api/api_olx.php?all=1`)
                    .then(r => r.json())
                    .then(res => {
                        if (res.status === 'success' && res.data) {
                            let approvedData = res.data.filter(item => item.status === 'Approved');
                            const oldDataStr = JSON.stringify(globalOlxData);
                            const newDataStr = JSON.stringify(approvedData);
                            if (oldDataStr !== newDataStr) {
                                globalOlxData = approvedData;
                                loadTradeInList(true);
                            }
                        }
                    })
                    .catch(() => {});
            }
        }, 10000);

        function loadTradeInList(skipSpinner = false) {
            const container = document.getElementById('tradeInList');
            if (!skipSpinner) {
                container.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data...</p>';
            }

            fetch(`../api/api_olx.php?all=1`)
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success' && res.data) {
                        let approvedData = res.data.filter(item => item.status === 'Approved');
                        globalOlxData = approvedData;

                        if (approvedData.length === 0) {
                            container.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Belum ada kendaraan yang disetujui.</p>';
                            return;
                        }

                        container.innerHTML = approvedData.map(item => {
                            let badgeStyle = 'background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0;';
                            let statusText = 'Approved';
                            let priceText = 'Rp ' + parseInt(item.harga_estimasi).toLocaleString('id-ID');
                            let priceColor = 'var(--green-success)';

                            let foto_src = 'https://placehold.co/600x400?text=Tidak+Ada+Foto';
                            if (item.foto_paths && item.foto_paths.length > 0) {
                                foto_src = '../' + item.foto_paths[0];
                            }

                            const date = new Date(item.created_at.replace(/-/g, '/'));
                            const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

                            return `
                                <div style="background: white; border-radius: 16px; border: 1px solid var(--border-color); overflow: hidden; box-shadow: var(--shadow-sm); transition: var(--transition); cursor: pointer;" onclick="showOlxDetail(${item.id})">
                                    <div style="position: relative; height: 160px; background: #e2e8f0;">
                                        <img src="${foto_src}" style="width: 100%; height: 100%; object-fit: cover;">
                                        <span style="position: absolute; top: 12px; right: 12px; font-size: 10px; font-weight: 800; padding: 5px 12px; border-radius: 99px; ${badgeStyle}">
                                            ${statusText}
                                        </span>
                                    </div>
                                    <div style="padding: 16px;">
                                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 6px;">
                                            <h4 style="font-size: 15px; font-weight: 800; color: var(--text-dark); margin: 0;">${item.nama_kendaraan}</h4>
                                            <span style="font-size:10px; font-weight:700; background:#f1f5f9; padding:4px 8px; border-radius:6px; color:var(--primary-blue);">
                                                <i class="fa-solid fa-user" style="margin-right:4px;"></i>${item.nama_sales || 'Sales'}
                                            </span>
                                        </div>
                                        <div style="display: flex; flex-wrap: wrap; gap: 8px 14px; margin-bottom: 12px;">
                                            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                                <i class="fa-solid fa-tags"></i> ${item.jenis_type}
                                            </span>
                                            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                                <i class="fa-regular fa-calendar"></i> ${item.tahun}
                                            </span>
                                            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                                <i class="fa-solid fa-palette"></i> ${item.warna}
                                            </span>
                                            <span style="font-size: 11px; color: var(--text-muted); font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                                <i class="fa-solid fa-location-dot"></i> ${item.lokasi_kecamatan}
                                            </span>
                                        </div>
                                        <p style="font-size: 12px; color: var(--text-muted); line-height: 1.5; margin: 0 0 14px 0; border-top: 1px dashed #e2e8f0; padding-top: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                                            ${item.deskripsi_kondisi}
                                        </p>
                                        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 12px;">
                                            <span style="font-size: 10px; color: var(--text-muted); font-weight: 500;">Dibuat: ${timeStr}</span>
                                            <div style="text-align: right;">
                                                <span style="font-size: 9px; color: var(--text-muted); display: block; font-weight: 700; text-transform: uppercase;">Harga Estimasi SPV</span>
                                                <span style="font-size: 14px; font-weight: 900; color: ${priceColor};">${priceText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        container.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Gagal memuat data trade-in.</p>';
                    }
                })
                .catch(err => {
                    console.error(err);
                    container.innerHTML = '<p style="text-align:center; font-size:12px; color:var(--text-muted); padding:20px;">Gagal menghubungkan ke server.</p>';
                });
        }

        function hitungEstimasi() {
            const tahun = parseInt(document.getElementById('estTahun').value);
            const harga = parseInt(document.getElementById('estHargaBaru').value);
            const kondisi = document.getElementById('estKondisi').value;
            
            if (!tahun || !harga) {
                showCustomAlert('Perhatian', 'Harap isi tahun dan harga beli baru', 'warning');
                return;
            }
            
            const currentYear = new Date().getFullYear();
            const age = currentYear - tahun;
            
            // Basic depreciation algorithm
            // Base depreciation 15% first year, 10% each subsequent year
            let depreciation = 0;
            if (age > 0) {
                depreciation = 0.15 + (age - 1) * 0.10;
            }
            
            // Cap depreciation at 75% max
            if (depreciation > 0.75) depreciation = 0.75;
            
            // Condition multiplier
            let multiplier = 1.0;
            if (kondisi === 'baik') multiplier = 0.95;
            if (kondisi === 'cukup') multiplier = 0.85;
            if (kondisi === 'kurang') multiplier = 0.70;
            
            let estValue = harga * (1 - depreciation) * multiplier;
            
            document.getElementById('estResultBox').style.display = 'block';
            document.getElementById('estResultPrice').innerText = 'Rp ' + Math.round(estValue).toLocaleString('id-ID');
        }

        function showOlxDetail(id) {
            const item = globalOlxData.find(d => d.id == id);
            if (!item) return;

            let modal = document.getElementById('olxDetailModal');
            if (!modal) return;

            document.getElementById('detNamaKendaraan').textContent = item.nama_kendaraan;
            document.getElementById('detNamaSales').textContent = item.nama_sales || 'Sales';
            document.getElementById('detJenis').textContent = item.jenis_type;
            document.getElementById('detTahun').textContent = item.tahun;
            document.getElementById('detWarna').textContent = item.warna;
            document.getElementById('detLokasi').textContent = item.lokasi_kecamatan;
            document.getElementById('detDeskripsi').textContent = item.deskripsi_kondisi;
            
            const date = new Date(item.created_at.replace(/-/g, '/'));
            document.getElementById('detTanggal').textContent = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            
            let finalPrice = parseInt(item.harga_estimasi);
            if (finalPrice > 0 && finalPrice < 1000000) finalPrice *= 1000000;
            let priceText = 'Rp ' + finalPrice.toLocaleString('id-ID');
            document.getElementById('detHarga').textContent = priceText;

            const photoContainer = document.getElementById('detPhotoContainer');
            photoContainer.innerHTML = '';
            if (item.foto_paths && item.foto_paths.length > 0) {
                item.foto_paths.forEach(path => {
                    photoContainer.innerHTML += `<img src="../${path}" onclick="if(window.openPhotoViewer) { window.openPhotoViewer(this.src); } else { openPhotoViewerLocal(this.src); }" style="height: 140px; width: auto; border-radius: 8px; flex-shrink: 0; object-fit: cover; aspect-ratio: 4/3; scroll-snap-align: start; cursor: pointer;">`;
                });
            } else {
                photoContainer.innerHTML = `<img src="https://placehold.co/600x400?text=Tidak+Ada+Foto" style="height: 140px; width: auto; border-radius: 8px; flex-shrink: 0; object-fit: cover; aspect-ratio: 4/3; scroll-snap-align: start;">`;
            }
            
            let btnHubungi = document.getElementById('detBtnHubungiSales');
            if (btnHubungi) {
                if (item.hp_sales) {
                    let hp = item.hp_sales.replace(/\D/g, '');
                    if (hp.startsWith('0')) hp = '62' + hp.substring(1);
                    btnHubungi.style.display = 'flex';
                    btnHubungi.onclick = function() {
                        let text = `Halo ${item.nama_sales}, saya ingin menanyakan tentang trade-in OLX kendaraan ${item.nama_kendaraan}.`;
                        window.open(`https://wa.me/${hp}?text=${encodeURIComponent(text)}`, '_blank');
                    };
                } else {
                    btnHubungi.style.display = 'none';
                }
            }

            modal.classList.add('show');
        }

        function closeOlxDetail() {
            let modal = document.getElementById('olxDetailModal');
            if (modal) {
                modal.classList.remove('show');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const tahunSelect = document.getElementById('olxTahun');
            if (tahunSelect) {
                const currentYear = new Date().getFullYear();
                for (let y = currentYear; y >= 1990; y--) {
                    const opt = document.createElement('option');
                    opt.value = y;
                    opt.textContent = y;
                    tahunSelect.appendChild(opt);
                }
            }
        });

window.currentPhotoViewerList = [];
window.currentPhotoViewerIndex = 0;

function openPhotoViewerLocal(imgSrc, allSrcs = [], index = 0) {
    const modal = document.getElementById('photoViewerModal');
    const img = document.getElementById('photoViewerImg');
    const btnPrev = document.getElementById('btnPhotoPrev');
    const btnNext = document.getElementById('btnPhotoNext');
    
    if (modal && img) {
        img.src = imgSrc;
        
        if (allSrcs.length > 1) {
            window.currentPhotoViewerList = allSrcs;
            window.currentPhotoViewerIndex = index;
            if (btnPrev) btnPrev.style.display = 'flex';
            if (btnNext) btnNext.style.display = 'flex';
        } else {
            window.currentPhotoViewerList = [];
            window.currentPhotoViewerIndex = 0;
            if (btnPrev) btnPrev.style.display = 'none';
            if (btnNext) btnNext.style.display = 'none';
        }
        
        modal.classList.add('show');
    }
}

window.nextPhotoViewer = function() {
    if (window.currentPhotoViewerList.length > 1) {
        window.currentPhotoViewerIndex = (window.currentPhotoViewerIndex + 1) % window.currentPhotoViewerList.length;
        const img = document.getElementById('photoViewerImg');
        if (img) img.src = window.currentPhotoViewerList[window.currentPhotoViewerIndex];
    }
};

window.prevPhotoViewer = function() {
    if (window.currentPhotoViewerList.length > 1) {
        window.currentPhotoViewerIndex = (window.currentPhotoViewerIndex - 1 + window.currentPhotoViewerList.length) % window.currentPhotoViewerList.length;
        const img = document.getElementById('photoViewerImg');
        if (img) img.src = window.currentPhotoViewerList[window.currentPhotoViewerIndex];
    }
};

function hitungEstimasi() {
    const tahun = parseInt(document.getElementById('estTahun')?.value) || new Date().getFullYear();
    const hargaBaru = parseFloat(document.getElementById('estHargaBaru')?.value) || 250000000;
    const kondisi = document.getElementById('estKondisi')?.value || 'baik';

    const currentYear = new Date().getFullYear();
    const umur = Math.max(0, currentYear - tahun);

    // Penyusutan tahunan (~10% thn ke-1, ~6% thn berikutnya)
    let faktorDepresiasi = 1 - (0.10 + (umur * 0.06));
    if (faktorDepresiasi < 0.25) faktorDepresiasi = 0.25;

    let faktorKondisi = 1.0;
    if (kondisi === 'sangat_baik') faktorKondisi = 1.05;
    else if (kondisi === 'baik') faktorKondisi = 1.0;
    else if (kondisi === 'cukup') faktorKondisi = 0.90;
    else if (kondisi === 'kurang') faktorKondisi = 0.78;

    const hargaEstimasiNilai = Math.round(hargaBaru * faktorDepresiasi * faktorKondisi);
    const subsidiTradeIn = 3000000; // Subsidi resmi Tunas Toyota
    const totalHargaTukar = hargaEstimasiNilai + subsidiTradeIn;

    const resBox = document.getElementById('estResultBox');
    const resPrice = document.getElementById('estResultPrice');

    if (resBox && resPrice) {
        resBox.style.display = 'block';
        resPrice.innerHTML = `
            <div style="font-size: 24px; font-weight: 900; color: #047857;">Rp ${hargaEstimasiNilai.toLocaleString('id-ID')}</div>
            <div style="font-size: 11px; color: #065f46; margin-top: 4px; font-weight: 700;">
                + Subsidi Trade-In Tunas Toyota: Rp 3.000.000 <br>
                <span style="color:#2563eb;">Total Benefit Tukar Tambah: Rp ${totalHargaTukar.toLocaleString('id-ID')}</span>
            </div>
            <div style="margin-top: 14px;">
                <button type="button" class="btn-main" onclick="shareTradeInWA('${hargaEstimasiNilai.toLocaleString('id-ID')}', '${totalHargaTukar.toLocaleString('id-ID')}')" style="background:#25D366; border:none; width:100%;">
                    <i class="fa-brands fa-whatsapp"></i> Bagikan Penawaran Trade-In ke WA
                </button>
            </div>
        `;
    }
}

function shareTradeInWA(estHarga, totalBenefit) {
    const thn = document.getElementById('estTahun')?.value || '-';
    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant';
    const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

    const text = `🚗 *ESTIMASI SMART TRADE-IN TOYOTA* 🚗
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bapak/Ibu, berikut adalah hasil penaksiran estimasi tukar tambah mobil lama Anda:

📋 *DETAIL KENDARAAN LAMA:*
- Tahun Pembelian: ${thn}
- Estimasi Harga Pasar: *Rp ${estHarga}*

🎁 *BONUS SUBSIDI TUNAS TOYOTA:*
- Subsidi Trade-In Resmi: *+Rp 3.000.000*
- Total Potongan DP Mobil Baru: *Rp ${totalBenefit}*

💡 *KEUNTUNGAN TUKAR TAMBAH KAMI:*
1. Mobil lama bisa tetap Bapak/Ibu pakai sampai unit Toyota baru tiba.
2. Tanpa potong komisi perantara / calo.
3. Langsung memotong sisa DP / angsuran unit baru (Zenix / Yaris Cross / Avanza).

Ingin tim inspeksi resmi kami datang mengecek kendaraan ke rumah hari ini?

Salam hangat,
👔 *${salesNama}*
🏬 ${cabang}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}
