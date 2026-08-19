let selectedCar = '';
        let selectedPromo = '';
        let selectedScheme = '';
        let selectedTenor = '';
        let selectedAngsuran = '';
        let selectedTdp = '';

        function formatRupiah(angka) {
            if (!angka || isNaN(angka)) return 'Rp 0';
            return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
        }

        // Read query parameters
        document.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            selectedCar = params.get('mobil') || '-';
            selectedPromo = params.get('paket') || '-';
            selectedScheme = params.get('skema') || '-';
            selectedTenor = params.get('tenor') || '';
            selectedAngsuran = params.get('angsuran') || '';
            selectedTdp = params.get('tdp') || '';

            document.getElementById('dealUnitName').innerText = `${selectedCar} - ${selectedPromo}`;
            
            let schemeText = `Skema: ${selectedScheme}`;
            if (selectedTenor) {
                schemeText += ` • Tenor: ${selectedTenor} Bulan`;
            }
            document.getElementById('dealPromoScheme').innerText = schemeText;

             if (selectedAngsuran && selectedTdp && selectedAngsuran !== '0' && selectedTdp !== '0') {
                const finText = `Angsuran: ${formatRupiah(selectedAngsuran)}/bln • TDP: ${formatRupiah(selectedTdp)}`;
                document.getElementById('dealFinancingDetails').innerText = finText;
                document.getElementById('dealFinancingDetails').style.display = 'block';
            } else {
                document.getElementById('dealFinancingDetails').style.display = 'none';
            }
        });

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

        function triggerFileInput(inputId) {
            document.getElementById(inputId).click();
        }

        // Handle image selection and base64 parsing
        function handleFileSelect(input, previewId, base64Id) {
            const file = input.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(e) {
                const base64Str = e.target.result;
                document.getElementById(base64Id).value = base64Str;
                
                // Show preview
                const previewEl = document.getElementById(previewId);
                previewEl.src = base64Str;
                previewEl.style.display = 'block';

                // Hide original prompt text
                const uploadInfoId = previewId.replace('Preview', 'UploadInfo');
                document.getElementById(uploadInfoId).style.opacity = '0';
            }
            reader.readAsDataURL(file);
        }

        function getImageDimensions(base64) {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({ width: img.width, height: img.height });
                };
                img.onerror = () => resolve({ width: 150, height: 95 });
                img.src = base64;
            });
        }

        // Convert base64 data to fits inside PDF with original proportions
        async function generateDealPdf(event) {
            event.preventDefault();
            
            const ktpBase64 = document.getElementById('ktpBase64').value;
            const kkBase64 = document.getElementById('kkBase64').value;

            if (!ktpBase64) {
                alert("Mohon unggah Foto KTP Pemohon terlebih dahulu!");
                return;
            }
            if (!kkBase64) {
                alert("Mohon unggah Foto Kartu Keluarga (KK) terlebih dahulu!");
                return;
            }

            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Membuat PDF...';

            // Ambil logo Tunas Toyota dan konversi ke base64 agar aman dimasukkan ke jsPDF
            let logoBase64 = null;
            let logoDims = { width: 680, height: 72 };
            try {
                const logoUrl = 'https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png';
                const res = await fetch(logoUrl);
                const blob = await res.blob();
                logoBase64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
                if (logoBase64) {
                    logoDims = await getImageDimensions(logoBase64);
                }
            } catch (e) {
                console.error("Gagal memuat logo Tunas Toyota:", e);
            }

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page
            
            const namaPemohon = document.getElementById('namaPemohon').value.trim();
            const namaStnk = document.getElementById('namaStnk').value.trim();

            // Cover Page / Summary Details
            pdf.setFillColor(232, 25, 44); // Primary Red color header banner
            pdf.rect(0, 0, 210, 38, 'F');
            
            pdf.setTextColor(255, 255, 255);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(20);
            pdf.text('DOKUMEN DEAL KONSUMEN', 20, 16);
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.text('Form Pameran / Canvasing - Sales POV App', 20, 26);

            if (logoBase64) {
                try {
                    const logoW = 55;
                    const logoH = (logoDims.height / logoDims.width) * logoW;
                    pdf.addImage(logoBase64, 'PNG', 210 - logoW - 20, (38 - logoH) / 2, logoW, logoH);
                } catch(e) { console.error(e); }
            }

            // Admin details
            pdf.setTextColor(15, 23, 42); // slate 900
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.text('INFORMASI ADMINISTRASI', 20, 52);
            pdf.setDrawColor(226, 232, 240); // slate 200 border
            pdf.line(20, 56, 190, 56);

            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            pdf.setTextColor(100, 116, 139); // slate 500
            pdf.text('Tipe Mobil & Paket:', 20, 66);
            pdf.text('Skema Pembayaran:', 20, 74);
            
            let nextY = 82;
            if (selectedTenor) {
                pdf.text('Tenor Kredit:', 20, nextY);
                pdf.text('Angsuran Bulanan:', 20, nextY + 8);
                pdf.text('Total Uang Muka (TDP):', 20, nextY + 16);
                nextY += 24;
            }
            
            pdf.text('Nama Pemohon:', 20, nextY);
            pdf.text('Nama STNK:', 20, nextY + 8);
            pdf.text('Tanggal Transaksi:', 20, nextY + 16);

            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(15, 23, 42);
            pdf.text(`${selectedCar} - ${selectedPromo}`, 65, 66);
            pdf.text(selectedScheme, 65, 74);
            
            let valY = 82;
            if (selectedTenor) {
                pdf.text(`${selectedTenor} Bulan`, 65, valY);
                pdf.text(`${formatRupiah(selectedAngsuran)} / bulan`, 65, valY + 8);
                pdf.text(`${formatRupiah(selectedTdp)}`, 65, valY + 16);
                valY += 24;
            }
            
            pdf.text(namaPemohon, 65, valY);
            pdf.text(namaStnk, 65, valY + 8);
            
            const today = new Date();
            const dateString = today.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) + ' • ' + String(today.getHours()).padStart(2,'0') + ':' + String(today.getMinutes()).padStart(2,'0') + ' WIB';
            pdf.text(dateString, 65, valY + 16);

            // Let's add images in separate pages to guarantee high quality and no overlap
            
            // KTP Pemohon (Page 2)
            if (ktpBase64) {
                pdf.addPage();
                
                // Red banner for page title
                pdf.setFillColor(232, 25, 44);
                pdf.rect(0, 0, 210, 15, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text('KTP PEMOHON', 15, 10);
                
                if (logoBase64) {
                    try {
                        const logoW = 45;
                        const logoH = (logoDims.height / logoDims.width) * logoW;
                        pdf.addImage(logoBase64, 'PNG', 210 - logoW - 15, (15 - logoH) / 2, logoW, logoH);
                    } catch(e) { console.error(e); }
                }

                // Add Image with perfect aspect ratio
                try {
                    const dims = await getImageDimensions(ktpBase64);
                    let targetW = 160;
                    let targetH = (dims.height / dims.width) * targetW;
                    if (targetH > 230) {
                        targetH = 230;
                        targetW = (dims.width / dims.height) * targetH;
                    }
                    const posX = (210 - targetW) / 2;
                    pdf.addImage(ktpBase64, 'JPEG', posX, 30, targetW, targetH);
                } catch(e) {
                    console.error("Error adding KTP to PDF:", e);
                }
            }

            // Kartu Keluarga (Page 3)
            if (kkBase64) {
                pdf.addPage();
                
                pdf.setFillColor(232, 25, 44);
                pdf.rect(0, 0, 210, 15, 'F');
                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text('KARTU KELUARGA (KK)', 15, 10);
                
                if (logoBase64) {
                    try {
                        const logoW = 45;
                        const logoH = (logoDims.height / logoDims.width) * logoW;
                        pdf.addImage(logoBase64, 'PNG', 210 - logoW - 15, (15 - logoH) / 2, logoW, logoH);
                    } catch(e) { console.error(e); }
                }

                // Add Image with perfect aspect ratio
                try {
                    const dims = await getImageDimensions(kkBase64);
                    let targetW = 170;
                    let targetH = (dims.height / dims.width) * targetW;
                    if (targetH > 240) {
                        targetH = 240;
                        targetW = (dims.width / dims.height) * targetH;
                    }
                    const posX = (210 - targetW) / 2;
                    pdf.addImage(kkBase64, 'JPEG', posX, 30, targetW, targetH);
                } catch(e) {
                    console.error("Error adding KK to PDF:", e);
                }
            }

            // Filename format: [Nama Pemohon] - [Nama STNK].pdf
            const fileName = `${namaPemohon} - ${namaStnk}.pdf`;
            pdf.save(fileName);

            // Re-enable submit button
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-file-pdf"></i> Submit & Unduh PDF';

            // Show Success Overlay modal
            document.getElementById('successOverlay').classList.add('show');
        }

        function closeSuccessOverlay() {
            document.getElementById('successOverlay').classList.remove('show');
        }

        function goToPromoPage() {
            window.location.href = 'promo.html';
        }
