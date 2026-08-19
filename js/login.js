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

            if (!username || !password) {
                showMsg('Username dan password wajib diisi!', 'error');
                return;
            }

            try {
                if (btn) {
                    btn.disabled = true;
                    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Memproses...</span>';
                }
                showMsg('Menghubungkan ke server...', 'info');

                const res = await fetch('../api/api_login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, login_type: 'sales' })
                });

                const data = await res.json();

                if (!data.ok) {
                    showMsg(data.message || 'Login gagal, periksa kembali data Anda.', 'error');
                    return;
                }

                if (data.sales && data.sales.peran !== 'Sales Consultant') {
                    if (data.sales.peran === 'Supervisor') {
                        showMsg('Akun Anda adalah akun Supervisor. Silakan login melalui halaman Portal SPV.', 'error');
                    } else if (data.sales.peran === 'Kepala Cabang') {
                        showMsg('Akun Anda adalah akun Kepala Cabang. Silakan login melalui halaman Portal Kacab.', 'error');
                    } else {
                        showMsg('Login gagal, akun Anda bukan akun Sales Consultant.', 'error');
                    }
                    return;
                }

                showMsg('Login berhasil! Mengarahkan...', 'info');
                if (btn) {
                    btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
                    btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Berhasil!</span>';
                }

                localStorage.setItem('loggedIn', 'true');
                localStorage.setItem('salesId', String(data.sales.id));
                localStorage.setItem('namaSales', data.sales.name || '');
                localStorage.setItem('fotoSales', data.sales.foto || '');
                localStorage.setItem('spvSales', data.sales.spv || '');
                localStorage.setItem('peranSales', data.sales.peran || 'Sales Consultant');
                localStorage.setItem('tingkatanSales', data.sales.tingkatan || 'Junior');
                localStorage.setItem('cabangSales', 'Tunas Toyota Kiara Condong');
                localStorage.setItem('idSales', data.sales.id);

                setTimeout(() => {
                    window.location.href = '../';
                }, 800);

            } catch (e) {
                showMsg('Gagal terhubung ke Server. Silakan periksa koneksi Anda dan coba lagi.', 'error');
                console.error("Detail Error:", e);
            } finally {
                if (btn && inlineMsg && inlineMsg.className.includes('msg-error')) {
                    btn.disabled = false;
                    btn.innerHTML = '<span>Masuk Sekarang</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>';
                }
            }
        }

        document.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') doLogin();
        });

        document.addEventListener('DOMContentLoaded', function () {
            if (localStorage.getItem('loggedIn') === 'true') {
                const peran = localStorage.getItem('peranSales');
                if (peran === 'Supervisor') {
                    window.location.href = '../pages_spv/index_spv.html';
                } else if (peran === 'Kepala Cabang') {
                    window.location.href = '../pages_kacab/index_kacab.html';
                } else {
                    window.location.href = '../';
                }
            }
        });
