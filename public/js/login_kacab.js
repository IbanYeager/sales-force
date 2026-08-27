// login_kacab.js — Handler Login Portal Kepala Cabang (Kacab Panel)

function togglePass() {
    const passInput = document.getElementById('loginPassword');
    const eyeIcon = document.getElementById('togglePassword');
    if (!passInput || !eyeIcon) return;

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
        showMsg('Username dan password Kacab wajib diisi!', 'error');
        return;
    }

    try {
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Memproses Autentikasi...</span>';
        }
        showMsg('Menghubungkan ke Portal Eksekutif...', 'info');

        const res = await fetch('../api/api_login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, login_type: 'kacab' })
        });

        const data = await res.json();

        if (!data.ok) {
            showMsg(data.message || 'Login Kacab gagal. Periksa kembali kredensial Anda.', 'error');
            return;
        }

        if (data.sales && data.sales.peran !== 'Kepala Cabang') {
            if (data.sales.peran === 'Supervisor') {
                showMsg('Akun Anda adalah akun Supervisor. Silakan login melalui halaman Portal SPV.', 'error');
            } else {
                showMsg('Akun Anda adalah akun Sales Consultant. Silakan login melalui halaman Login Sales.', 'error');
            }
            return;
        }

        showMsg('Login Kepala Cabang Berhasil! Membuka Portal...', 'info');
        if (btn) {
            btn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
            btn.style.borderColor = '#10b981';
            btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Berhasil!</span>';
        }

        // Simpan sesi autentikasi ke LocalStorage
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('salesId', String(data.sales.id || '1'));
        localStorage.setItem('namaSales', data.sales.name || 'Kepala Cabang');
        localStorage.setItem('fotoSales', data.sales.foto || '');
        localStorage.setItem('spvSales', 'Kepala Cabang');
        localStorage.setItem('peranSales', data.sales.peran || 'Kepala Cabang');
        localStorage.setItem('tingkatanSales', 'Branch Manager');
        localStorage.setItem('cabangSales', data.sales.cabang || 'Tunas Toyota Kiara Condong');
        localStorage.setItem('idSales', String(data.sales.id || '1'));

        setTimeout(() => {
            const isSubDir = location.pathname.includes('/pages/') || location.pathname.includes('/pages_spv/') || location.pathname.includes('/pages_kacab/');
            const targetPage = isSubDir ? '../pages_kacab/index_kacab.html' : 'pages_kacab/index_kacab.html';
            window.location.href = targetPage;
        }, 800);

    } catch (e) {
        showMsg('Gagal terhubung ke Server. Silakan periksa koneksi Anda dan coba lagi.', 'error');
        console.error("Detail Error Login Kacab:", e);
    } finally {
        if (btn && inlineMsg && inlineMsg.className.includes('msg-error')) {
            btn.disabled = false;
            btn.innerHTML = '<span>Masuk Portal Kacab</span> <i class="fa-solid fa-arrow-right-to-bracket"></i>';
        }
    }
}

document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') doLogin();
});

document.addEventListener('DOMContentLoaded', function () {
    if (localStorage.getItem('loggedIn') === 'true') {
        const peran = localStorage.getItem('peranSales');
        const isSubDir = location.pathname.includes('/pages/') || location.pathname.includes('/pages_spv/') || location.pathname.includes('/pages_kacab/');
        const targetKacab = isSubDir ? '../pages_kacab/index_kacab.html' : 'pages_kacab/index_kacab.html';
        const targetSpv = isSubDir ? '../pages_spv/index_spv.html' : 'pages_spv/index_spv.html';
        if (peran === 'Supervisor') {
            window.location.href = targetSpv;
        } else if (peran === 'Sales Consultant' || peran === 'Sales') {
            window.location.href = isSubDir ? '../' : './';
        } else {
            window.location.href = targetKacab;
        }
    }
});
