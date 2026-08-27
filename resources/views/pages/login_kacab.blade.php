<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kacab Portal - Login | Tunas Toyota</title>
    <meta name="description" content="Login Portal Executive Kepala Cabang Tunas Toyota">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="../css/login_kacab.css">
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#1e1014">
</head>

<body class="login-page">
    <div class="mobile-app">
        <!-- Hero section with logo & Kacab branding -->
        <div class="login-hero">
            <div class="login-logo-wrap">
                <img src="https://static.wixstatic.com/media/bce131_784db0a25e784dd7a840402d11e94630~mv2.png/v1/fill/w_680,h_72,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Logo%20Tunas%20Toyota.png"
                    alt="Tunas Toyota Logo">
            </div>
            <div class="login-hero-badge">
                <i class="fa-solid fa-crown"></i> Executive Branch Manager
            </div>
            <h1 class="login-hero-title">Kacab Portal</h1>
            <p class="login-hero-sub">Portal Monitoring & Kendali Cabang Tunas Toyota</p>

            <!-- Desktop-only feature highlights -->
            <div class="login-hero-features">
                <div class="login-hero-feature">
                    <i class="fa-solid fa-chart-line"></i>
                    <span>Executive Dashboard & Realisasi SPK/DO</span>
                </div>
                <div class="login-hero-feature">
                    <i class="fa-solid fa-sitemap"></i>
                    <span>Monitoring Kinerja Hierarki SPV & Sales</span>
                </div>
                <div class="login-hero-feature">
                    <i class="fa-solid fa-shield-check"></i>
                    <span>Otorisasi & Pengawasan Aktivitas Cabang</span>
                </div>
            </div>
        </div>

        <!-- Form Card -->
        <div class="login-form-card">
            <!-- Desktop-only form header -->
            <div class="login-form-card-header">
                <h2>Login Kepala Cabang</h2>
                <p>Silakan masukkan kredensial akun Kacab Anda</p>
            </div>

            <div class="login-divider"></div>

            <!-- PORTAL ROLE SWITCHER -->
            <div class="portal-nav-wrapper">
                <div class="portal-nav-title"><i class="fa-solid fa-layer-group"></i> Pilih Portal Akses Login</div>
                <div class="portal-nav-grid">
                    <a href="login.html" class="portal-nav-btn portal-sales">
                        <i class="fa-solid fa-user-tag"></i>
                        <span>Sales</span>
                    </a>
                    <a href="login_spv.html" class="portal-nav-btn portal-spv">
                        <i class="fa-solid fa-user-tie"></i>
                        <span>SPV</span>
                    </a>
                    <a href="login_kacab.html" class="portal-nav-btn portal-kacab active">
                        <i class="fa-solid fa-crown"></i>
                        <span>Kacab</span>
                    </a>
                </div>
            </div>

            <div class="input-group" style="margin-bottom: 20px;">
                <label
                    style="font-size:13px;font-weight:700;color:var(--text-dark);display:block;margin-bottom:8px;">Username
                    Kepala Cabang</label>
                <div class="input-wrap">
                    <input type="text" class="input-modern" id="loginUsername" placeholder="Masukkan username Kacab"
                        autocomplete="off" />
                    <i class="fa-solid fa-user-tie input-icon" style="color: #3b141d;"></i>
                </div>
            </div>

            <div class="input-group" style="margin-bottom: 10px;">
                <div class="form-label-row">
                    <label>Password</label>
                    <a href="https://wa.me/6285860295020?text=Halo%20Admin%2C%20saya%20lupa%20password%20akun%20Kepala%20Cabang%20saya.%20Mohon%20bantuannya%20untuk%20reset%20password."
                        target="_blank"
                        style="font-size:11px;font-weight:700;color:#3b141d;display:flex;align-items:center;gap:4px;">
                        <i class="fa-brands fa-whatsapp" style="font-size:14px;color:#25D366;"></i> Lupa Password?
                    </a>
                </div>
                <div class="input-wrap">
                    <input type="password" class="input-modern" id="loginPassword" placeholder="Masukkan password" />
                    <i class="fa-solid fa-lock input-icon" style="color: #3b141d;"></i>
                    <i class="fa-regular fa-eye-slash toggle-password" id="togglePassword" onclick="togglePass()"></i>
                </div>
            </div>

            <button id="loginBtn" class="btn-kacab-login" onclick="doLogin()">
                <span>Masuk Portal Kacab</span>
                <i class="fa-solid fa-arrow-right-to-bracket"></i>
            </button>

            <div id="loginInlineMsg" class="msg-box"></div>



            <div class="security-card">
                <div class="security-icon">
                    <i class="fa-solid fa-shield-halved"></i>
                </div>
                <div class="security-text">
                    <h5>Akses Eksekutif Tertinggi Cabang</h5>
                    <p>Sistem enkripsi 256-bit khusus pengawasan & manajemen eksekutif Tunas Toyota.</p>
                </div>
            </div>
        </div>
    </div>

    <script src="../js/script.js"></script>
    <script src="../js/login_kacab.js"></script>

    <script src="../js/pwa-app.js?v=3"></script>
</body>

</html>
