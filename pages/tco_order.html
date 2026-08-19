<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Form Pemesanan Aksesoris</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <script src="../custom_alert.js"></script>
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#CC0000">

    <style>
        /* ══════════════════════════════════════════════════════════
           TCO ORDER — PREMIUM REDESIGN v2.0
           Glassmorphism · Animated Gradients · Progress Steps
        ══════════════════════════════════════════════════════════ */

        .mobile-app { background-color: transparent !important; min-height: 100vh; padding-bottom: 40px; }
        
        /* ── Header ── */
        .header-page {
            background: rgba(255, 255, 255, 0.88) !important;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(232, 236, 244, 0.5);
            color: var(--text-dark) !important;
        }
        .header-page h2 { color: var(--text-dark) !important; }
        .header-page button, .header-page .back-btn {
            background: rgba(241, 245, 249, 0.8) !important;
            color: var(--text-dark) !important;
            box-shadow: var(--shadow-xs);
            border: 1px solid rgba(232, 236, 244, 0.5);
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s var(--ease);
        }
        .header-page button:hover, .header-page .back-btn:hover {
            background: rgba(232, 236, 244, 0.9) !important;
            transform: translateX(-2px);
        }
        .header-page button:active, .header-page .back-btn:active {
            transform: scale(0.95);
        }

        /* ══════════════════════════════════════════════════
           PROGRESS STEPS
        ══════════════════════════════════════════════════ */
        .progress-steps {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            margin-bottom: 24px;
            padding: 0 10px;
        }

        .step-item {
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .step-circle {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            transition: all 0.3s var(--ease);
            flex-shrink: 0;
        }

        .step-circle.active {
            background: var(--red-grad);
            color: white;
            box-shadow: var(--shadow-red);
        }

        .step-circle.completed {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }

        .step-circle.inactive {
            background: var(--border-color);
            color: var(--text-muted);
        }

        .step-label {
            font-size: 11px;
            font-weight: 700;
            color: var(--text-muted);
            white-space: nowrap;
        }

        .step-label.active {
            color: var(--primary-red);
        }

        .step-label.completed {
            color: #059669;
        }

        .step-connector {
            width: 32px;
            height: 2px;
            background: var(--border-color);
            margin: 0 6px;
            border-radius: 2px;
            flex-shrink: 0;
        }

        .step-connector.completed {
            background: linear-gradient(90deg, #10b981, #059669);
        }

        /* ══════════════════════════════════════════════════
           SUMMARY CARD — Animated Gradient
        ══════════════════════════════════════════════════ */
        .summary-card {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%);
            color: white; 
            padding: 28px 26px; 
            border-radius: 20px;
            margin-bottom: 20px;
            box-shadow: 0 12px 32px rgba(13, 27, 62, 0.2);
            position: relative; 
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .summary-card::before {
            content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
            background: radial-gradient(circle at 30% 40%, rgba(215, 18, 58, 0.2) 0%, transparent 50%),
                        radial-gradient(circle at 70% 60%, rgba(53, 101, 224, 0.15) 0%, transparent 50%);
            z-index: 0; pointer-events: none;
            animation: gradientRotate 10s linear infinite;
        }
        @keyframes gradientRotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .summary-card::after {
            content: '\f1b9'; font-family: 'Font Awesome 6 Free'; font-weight: 900;
            position: absolute; right: -15px; bottom: -15px; font-size: 100px;
            color: rgba(255,255,255,0.03); z-index: 0; transform: rotate(-15deg);
        }
        
        .summary-content { position: relative; z-index: 2; }
        .badge-tco {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
            padding: 5px 12px; border-radius: 10px; font-size: 10px; font-weight: 800; letter-spacing: 0.5px;
            margin-bottom: 18px; backdrop-filter: blur(4px);
        }
        .summary-card h4 { margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: rgba(148, 163, 184, 0.9); }
        .summary-card h2 { 
            margin: 0 0 18px 0; font-size: 22px; font-weight: 900; line-height: 1.2; letter-spacing: -0.5px;
            background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .price-box {
            background: rgba(0,0,0,0.25); padding: 14px 18px; border-radius: var(--radius-sm); display: inline-block;
            border: 1px solid rgba(255,255,255,0.06);
            backdrop-filter: blur(8px);
        }
        .price-label { font-size: 10px; color: rgba(148, 163, 184, 0.8); text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; font-weight: 700; }
        .summary-card .price { font-size: 22px; font-weight: 900; color: #34d399; margin: 0; letter-spacing: -0.5px;}

        /* ══════════════════════════════════════════════════
           PREMIUM FORM CARD
        ══════════════════════════════════════════════════ */
        .form-card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            padding: 28px 24px 32px 24px; 
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(15, 23, 42, 0.04);
            margin-bottom: 24px;
            position: relative; 
            z-index: 1;
        }

        .form-section-title {
            margin: 0 0 22px 0;
            font-size: 16px;
            font-weight: 800;
            color: var(--text-dark);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .form-section-title i {
            color: var(--primary-red);
            font-size: 14px;
        }

        .input-group { position: relative; margin-bottom: 22px; }
        .input-group i {
            position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
            color: var(--text-light); font-size: 15px; z-index: 10; transition: all 0.35s var(--ease);
            pointer-events: none;
        }
        .input-group textarea ~ i, .input-group i.textarea-icon { top: 20px; transform: none; }
        
        .form-control {
            width: 100%; padding: 16px 16px 16px 48px; 
            border: 1.5px solid var(--border-color); 
            border-radius: var(--radius-sm);
            font-size: 14px; font-weight: 600; color: var(--text-dark); 
            background: rgba(248, 250, 255, 0.6);
            transition: all 0.35s var(--ease);
            font-family: 'Inter', sans-serif;
        }
        .form-control:focus {
            background: white; border-color: var(--primary-red);
            box-shadow: 0 0 0 4px rgba(215, 18, 58, 0.08), var(--shadow-sm); 
            outline: none;
        }
        .form-control:focus ~ i { 
            color: var(--primary-red); 
            transform: translateY(-50%) scale(1.1);
        }
        .form-control:focus ~ i.textarea-icon {
            transform: none;
        }
        .form-control::placeholder { color: var(--text-light); font-weight: 500; }
        
        .input-label {
            display: block; font-size: 12px; font-weight: 700; color: var(--text-secondary); 
            margin-bottom: 8px; margin-left: 4px;
        }
        .input-label span { color: var(--primary-red); }

        /* ══════════════════════════════════════════════════
           SUBMIT BUTTON — Gradient with Shine Sweep
        ══════════════════════════════════════════════════ */
        .btn-main-premium {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; border: none; padding: 18px; width: 100%; border-radius: var(--radius-sm);
            font-size: 15px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px;
            cursor: pointer; transition: all 0.3s var(--ease); box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
            margin-top: 12px;
            position: relative;
            overflow: hidden;
            font-family: 'Inter', sans-serif;
        }
        
        /* Shine sweep animation */
        .btn-main-premium::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shineSweep 3s ease-in-out infinite;
        }
        
        @keyframes shineSweep {
            0% { left: -100%; }
            40% { left: 150%; }
            100% { left: 150%; }
        }

        .btn-main-premium:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35); 
        }
        .btn-main-premium:active {
            transform: translateY(0) scale(0.98);
        }
        .btn-main-premium i { font-size: 18px; }

        /* ══════════════════════════════════════════════════
           SUCCESS OVERLAY — Animated Checkmark
        ══════════════════════════════════════════════════ */
        .success-overlay {
            display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(7, 13, 34, 0.88); backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            z-index: 9999; align-items: center; justify-content: center;
            opacity: 0; transition: opacity 0.3s ease;
        }
        .success-overlay.show { opacity: 1; }
        .success-card {
            background: white; padding: 44px 34px; border-radius: var(--radius-xl); text-align: center;
            max-width: 340px; width: 90%; transform: scale(0.85); 
            transition: transform 0.4s var(--spring);
            box-shadow: var(--shadow-xl);
            position: relative;
            overflow: hidden;
        }
        .success-overlay.show .success-card { transform: scale(1); }
        
        /* Animated circles background */
        .success-card::before {
            content: '';
            position: absolute;
            top: -50px;
            right: -50px;
            width: 150px;
            height: 150px;
            background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%);
            border-radius: 50%;
        }

        .success-icon-circle {
            background: linear-gradient(135deg, #34d399 0%, #10b981 100%); color: white;
            width: 76px; height: 76px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
            font-size: 32px; margin: 0 auto 24px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
            position: relative;
        }
        
        /* Pulsing ring */
        .success-icon-circle::after {
            content: '';
            position: absolute;
            inset: -6px;
            border-radius: 50%;
            border: 2px solid rgba(16, 185, 129, 0.3);
            animation: successRing 1.5s ease-out infinite;
        }

        @keyframes successRing {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.4); opacity: 0; }
        }

        /* ══════════════════════════════════════════════════
           PAGE ENTRY ANIMATION
        ══════════════════════════════════════════════════ */
        .order-animate-in > * {
            animation: orderSlideUp 0.5s var(--ease-out) both;
        }
        .order-animate-in > *:nth-child(1) { animation-delay: 0.05s; }
        .order-animate-in > *:nth-child(2) { animation-delay: 0.12s; }
        .order-animate-in > *:nth-child(3) { animation-delay: 0.2s; }
        .order-animate-in > *:nth-child(4) { animation-delay: 0.28s; }

        @keyframes orderSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>

<body>

    <div class="mobile-app">
        <!-- Header -->
        <header class="header-page" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; position: sticky; top: 0; z-index: 999;">
            <div style="display:flex; align-items:center; gap:16px;">
                <button onclick="window.history.back()">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style="font-size: 16px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">Checkout Aksesoris</h2>
            </div>
        </header>

        <div class="container order-animate-in" style="margin-top: 24px;">
            
            <!-- ═══ Progress Steps ═══ -->
            <div class="progress-steps">
                <div class="step-item">
                    <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                    <span class="step-label completed">Pilih</span>
                </div>
                <div class="step-connector completed"></div>
                <div class="step-item">
                    <div class="step-circle active">2</div>
                    <span class="step-label active">Detail</span>
                </div>
                <div class="step-connector"></div>
                <div class="step-item">
                    <div class="step-circle inactive">3</div>
                    <span class="step-label">Bayar</span>
                </div>
                <div class="step-connector"></div>
                <div class="step-item">
                    <div class="step-circle inactive"><i class="fa-solid fa-flag" style="font-size:10px;"></i></div>
                    <span class="step-label">Selesai</span>
                </div>
            </div>

            <!-- ═══ Summary Card ═══ -->
            <div class="summary-card">
                <div class="summary-content">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:12px;">
                        <div class="badge-tco" style="margin-bottom:0;"><i class="fa-solid fa-gem" style="color: #60a5fa;"></i> Toyota Customization Option</div>
                        <div id="orderPnBadge" style="background:rgba(255,255,255,0.15); padding:4px 10px; border-radius:6px; font-size:11px; font-family:monospace; font-weight:700;"><i class="fa-solid fa-barcode"></i> P/N: -</div>
                    </div>

                    <h4 id="orderModel"><i class="fa-solid fa-car" style="margin-right: 6px;"></i> Memuat...</h4>
                    <h2 id="orderItem">Memuat Nama Aksesoris...</h2>
                    <div id="orderPackageParts" style="display:none; margin: 10px 0 14px; padding: 10px 12px; background: rgba(255,255,255,0.08); border-radius: 8px; border: 1px dashed rgba(255,255,255,0.25);"></div>

                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
                        <span id="orderGradeBadge" style="background:rgba(16,185,129,0.2); color:#6ee7b7; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; border:1px solid rgba(16,185,129,0.3);"><i class="fa-solid fa-check-double"></i> Grade: -</span>
                        <span id="orderSchemeBadge" style="background:rgba(59,130,246,0.2); color:#93c5fd; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; border:1px solid rgba(59,130,246,0.3);"><i class="fa-solid fa-tag"></i> Skema: Customer (RTCO)</span>
                    </div>
                    
                    <div class="price-box">
                        <span class="price-label" id="orderPriceLabel">Estimasi Harga OTR</span>
                        <p id="orderPrice" class="price">-</p>
                    </div>
                </div>
            </div>

            <!-- ═══ Form ═══ -->
            <form id="orderForm" class="form-card" onsubmit="submitOrder(event)">
                
                <h3 class="form-section-title">
                    <i class="fa-solid fa-sliders"></i> Opsi Pembelian & Varian
                </h3>

                <!-- Dynamic Per-Product Pricing Scheme Container -->
                <div id="perItemPriceSchemesContainer" style="display:flex; flex-direction:column; gap:16px; margin-bottom:18px;">
                    <!-- JS will inject per-product price scheme selectors here -->
                </div>

                <!-- Pilih Varian / Grade Kendaraan -->
                <div id="gradeGroupContainer">
                    <label class="input-label" for="selectGrade">Varian / Grade Kendaraan <span>*</span></label>
                    <div class="input-group">
                        <select id="selectGrade" class="form-control" onchange="onGradeChange()" required>
                            <option value="">-- Pilih Grade Kendaraan --</option>
                        </select>
                        <i class="fa-solid fa-car-side"></i>
                    </div>
                </div>

                <h3 class="form-section-title" style="margin-top: 28px;">
                    <i class="fa-solid fa-user-pen"></i> Detail Pemesan
                </h3>
                
                <!-- Nama Pelanggan -->
                <div>
                    <label class="input-label" for="customerName">Nama Lengkap <span>*</span></label>
                    <div class="input-group">
                        <input type="text" id="customerName" class="form-control" placeholder="Ketik nama pelanggan..." required>
                        <i class="fa-solid fa-user"></i>
                    </div>
                </div>

                <!-- No Telepon / WA -->
                <div>
                    <label class="input-label" for="customerPhone">No. WhatsApp <span>*</span></label>
                    <div class="input-group">
                        <input type="tel" id="customerPhone" class="form-control" placeholder="Contoh: 081234567890" required>
                        <i class="fa-brands fa-whatsapp"></i>
                    </div>
                </div>
                
                <!-- Plat Nomor / Tipe Kendaraan -->
                <div>
                    <label class="input-label" for="carDetails">Detail Plat Nomor / Warna Kendaraan</label>
                    <div class="input-group">
                        <input type="text" id="carDetails" class="form-control" placeholder="Cth: B 1234 XYZ / Hitam">
                        <i class="fa-solid fa-id-card"></i>
                    </div>
                </div>

                <!-- Catatan -->
                <div>
                    <label class="input-label" for="orderNotes">Catatan Tambahan (Opsional)</label>
                    <div class="input-group" style="position: relative;">
                        <!-- Watermark Container -->
                        <div style="position: absolute; inset: 0; overflow: hidden; border-radius: 12px; pointer-events: none; z-index: 1;">
                            <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background: url('../image/download-removebg-preview.png') repeat; background-size: 100px; opacity: 0.08; transform: rotate(-30deg);"></div>
                        </div>
                        
                        <textarea id="orderNotes" class="form-control" style="min-height: 100px; resize: vertical; position: relative; z-index: 2; background-color: transparent !important;" placeholder="Tulis catatan pemasangan atau pesan khusus..."></textarea>
                        <i class="fa-solid fa-comment-dots textarea-icon" style="position: absolute; left: 18px; top: 20px; z-index: 3; pointer-events: none;"></i>
                    </div>
                </div>

                <!-- Submit Button -->
                <button type="submit" id="submitBtn" class="btn-main-premium">
                    Lanjutkan ke Pembayaran <i class="fa-solid fa-qrcode"></i>
                </button>

            </form>
        </div>
    </div>

    <!-- ═══ Success Screen Overlay ═══ -->
    <div id="successOverlay" class="success-overlay" onclick="closeSuccessOverlay()">
        <div class="success-card" onclick="event.stopPropagation()">
            <div class="success-icon-circle">
                <i class="fa-solid fa-spinner fa-spin"></i>
            </div>
            <h3 style="margin: 0 0 12px; font-size: 20px; font-weight: 900; color: var(--text-dark);">Memproses...</h3>
            <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 24px; line-height: 1.6; font-weight: 500;">Menyiapkan halaman pembayaran QRIS untuk Anda.</p>
            <button onclick="closeSuccessOverlay()" class="btn-main-premium" style="background: var(--border-color); color: var(--text-dark); box-shadow: none; padding: 14px;">
                Tutup
            </button>
        </div>
    </div>

    <script src="../js/tco_order.js"></script>

    <script>
        // Animasi untuk success overlay
        function showSuccessUI() {
            const overlay = document.getElementById('successOverlay');
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }
        
        // Memodifikasi fungsi global submitOrder agar menggunakan animasi ini
        const originalSubmitOrder = window.submitOrder;
        if(originalSubmitOrder) {
            window.submitOrder = function(e) {
                e.preventDefault();
                showSuccessUI();
                originalSubmitOrder(e);
            };
        }
    </script>
</body>
</html>
