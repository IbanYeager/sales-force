const avatarEl = document.querySelector('.avatar');
        avatarEl.style.cursor = 'pointer';
        avatarEl.onclick = () => openPhotoModal();

        function openPhotoModal() { document.getElementById('photoModal').classList.add('show'); }
        function closePhotoModal() { document.getElementById('photoModal').classList.remove('show'); }
        function triggerFileSelect() { document.getElementById('fileInput').click(); closePhotoModal(); }
        function triggerCameraSelect() { document.getElementById('cameraInput').click(); closePhotoModal(); }

        async function handleFileUpload(event) {
            const file = event.target.files[0];
            const salesId = localStorage.getItem('salesId');

            if (file && salesId) {
                const formData = new FormData();
                formData.append('foto', file);
                formData.append('sales_id', salesId);

                try {
                    const avatar = document.querySelector('.avatar');
                    avatar.style.opacity = '0.5';

                    // URL FETCH MENGGUNAKAN ROOT ABSOLUTE PATH
                    const res = await fetch('/api/api_upload_foto.php', {
                        method: 'POST',
                        body: formData
                    });

                    // Menerima response JSON dari server
                    const data = await res.json();

                    if (data.ok || data.status === 'success') {
                        const newPath = data.path || data.foto;
                        avatar.src = newPath;
                        avatar.onerror = function() {
                            const n = localStorage.getItem('namaSales') || 'Sales';
                            this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(n)}&background=f4f7f6&color=c8102e`;
                        };
                        localStorage.setItem('fotoSales', newPath);
                        if (typeof showCustomAlert === 'function') {
                            showCustomAlert('Foto profil berhasil diperbarui!', 'success');
                        } else {
                            alert('Foto profil berhasil diperbarui!');
                        }
                    } else {
                        alert('Error dari server: ' + data.message);
                        console.error("Server Message:", data.message);
                    }
                } catch (e) {
                    // Tangkap jika file PHP mengembalikan error HTML atau koneksi putus
                    console.error("Terjadi kesalahan:", e);
                    alert('Gagal mengunggah foto ke server. Cek console browser Anda (F12).');
                } finally {
                    document.querySelector('.avatar').style.opacity = '1';
                }
            }
        }

        (function () {
            const loggedIn = localStorage.getItem('loggedIn') === 'true';
            const inEl = document.getElementById('profilContentLoggedIn');
            const outEl = document.getElementById('profilContentLoggedOut');

            if (!inEl || !outEl) return;

            if (loggedIn) {
                inEl.style.display = 'block';
                outEl.style.display = 'none';

                const namaEl = document.getElementById('namaSalesEl');
                const peranEl = document.getElementById('peranSalesEl');
                const cabangEl = document.getElementById('cabangSalesText');
                const avatarImg = document.querySelector('.avatar');

                const infoNama = document.getElementById('infoNama');
                const infoJabatan = document.getElementById('infoJabatan');
                const infoSpv = document.getElementById('infoSpv');
                const infoCabang = document.getElementById('infoCabang');

                const namaFallback = localStorage.getItem('namaSales') || 'Nama Sales';
                const peranFallback = localStorage.getItem('peranSales') || 'Sales Consultant';
                const tingkatanFallback = localStorage.getItem('tingkatanSales') || 'Magang';
                const spvFallback = localStorage.getItem('spvSales') || '-';
                let fotoFallback = localStorage.getItem('fotoSales');
                if (fotoFallback && fotoFallback.startsWith('http://') && !fotoFallback.includes('localhost')) {
                    fotoFallback = 'https://' + fotoFallback.substring(7);
                    localStorage.setItem('fotoSales', fotoFallback);
                }
                const cabangLocked = 'Tunas Toyota Kiara Condong';

                const peranTingkatan = peranFallback === 'Sales Consultant' && tingkatanFallback ? `${peranFallback} - ${tingkatanFallback}` : peranFallback;

                if (namaEl) namaEl.textContent = namaFallback;
                if (peranEl) peranEl.textContent = peranTingkatan;
                if (cabangEl) cabangEl.textContent = cabangLocked;

                if (infoNama) infoNama.textContent = namaFallback;
                if (infoJabatan) infoJabatan.textContent = peranTingkatan;
                if (infoSpv) infoSpv.textContent = spvFallback;
                if (infoCabang) infoCabang.textContent = cabangLocked;

                if (avatarImg) {
                    avatarImg.onerror = function() {
                        this.onerror = null;
                        this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(namaFallback)}&background=f4f7f6&color=c8102e`;
                    };
                    if (fotoFallback && fotoFallback.trim() !== '') {
                        avatarImg.src = fotoFallback;
                    } else {
                        avatarImg.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(namaFallback)}&background=f4f7f6&color=c8102e`;
                    }
                }

            } else {
                inEl.style.display = 'none';
                outEl.style.display = 'block';
            }
        })();

        window.logoutUser = function () {
            localStorage.clear();
            window.location.href = 'login.html';
        };
