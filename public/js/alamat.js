function togglePass() {
            const passInput = document.getElementById('loginPassword');
            const eyeIcon = document.getElementById('togglePassword');
            if (passInput.type === 'password') {
                passInput.type = 'text';
                eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
            } else {
                passInput.type = 'password';
                eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
            }
        }

        async function doLogin() {
            const username = document.getElementById('loginUsername')?.value?.trim();
            const password = document.getElementById('loginPassword')?.value;
            const btn = document.getElementById('loginBtn');
            const inlineMsg = document.getElementById('loginInlineMsg');

            const showMsg = (text, type = 'error') => {
                if (!inlineMsg) return;
                inlineMsg.style.display = 'block';
                inlineMsg.textContent = text;
                inlineMsg.className = type === 'error' ? 'msg-box msg-error' : 'msg-box msg-info';
            };

            if (!username || !password) return showMsg('Username dan password wajib diisi!', 'error');

            try {
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Memproses...</span>';
                }
                showMsg('Menghubungkan ke server...', 'info');

                const res = await fetch('../api/api_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await res.json();

                if (!data.ok) {
                    showMsg(data.message || 'Login gagal, periksa kembali data Anda.', 'error');
                    return;
                }

                showMsg('Login berhasil! Mengarahkan...', 'info');
                if (btn) {
                    btn.style.background = '#27ae60';
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Berhasil</span>';
                }

                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('salesId', String(data.sales.id));
                localStorage.setItem('namaSales', data.sales.name || '');
                localStorage.setItem('fotoSales', data.sales.foto || '');
                localStorage.setItem('peranSales', 'Sales Consultant');
                localStorage.setItem('cabangSales', 'Tunas Toyota Kiara Condong');

                setTimeout(() => { window.location.href = '../index.html'; }, 800);

            } catch (e) {
                showMsg('Gagal koneksi ke database. Pastikan XAMPP menyala.', 'error');
                console.error(e);
            } finally {
                if (btn && inlineMsg.className.includes('msg-error')) {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Masuk Sekarang</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>';
                }
            }
        }

        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') doLogin();
        });
