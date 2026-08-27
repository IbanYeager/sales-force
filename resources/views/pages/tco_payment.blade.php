<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Pembayaran QRIS</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css">
    <script src="../custom_alert.js"></script>
    <script src="../js/sidebar_desktop.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#1e293b">

    <style>
        /* ══════════════════════════════════════════════════════════
           TCO PAYMENT — PREMIUM REDESIGN v2.0
           Circular Timer · Glassmorphism · Premium Receipt
        ══════════════════════════════════════════════════════════ */

        .mobile-app { padding-bottom: 40px; }
        
        /* ── Header ── */
        .header-page {
            background: rgba(255, 255, 255, 0.88) !important;
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-bottom: 1px solid rgba(232, 236, 244, 0.5);
            color: var(--text-dark) !important;
        }

        /* ══════════════════════════════════════════════════
           PROGRESS STEPS (same as order page)
        ══════════════════════════════════════════════════ */
        .progress-steps {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0;
            padding: 16px 10px 0;
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

        .step-label.active { color: var(--primary-red); }
        .step-label.completed { color: #059669; }

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
           STATE 1: QRIS PAYMENT
        ══════════════════════════════════════════════════ */
        #paymentState {
            display: flex; flex-direction: column; align-items: center; padding: 24px 20px;
            animation: paySlideUp 0.5s var(--ease-out) both;
        }
        
        @keyframes paySlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        /* ── Total Amount ── */
        .total-box {
            text-align: center; margin-bottom: 28px;
        }
        .total-box h4 { 
            margin: 0; font-size: 13px; font-weight: 700; color: var(--text-muted); 
            margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;
        }
        .total-box h1 { 
            margin: 0; font-size: 36px; font-weight: 900; letter-spacing: -1.5px;
            background: linear-gradient(135deg, var(--text-dark) 0%, var(--primary-red) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        /* ── QRIS Card — Glassmorphism ── */
        .qris-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: var(--radius-xl);
            padding: 32px 28px; width: 100%; max-width: 360px;
            box-shadow: var(--shadow-lg);
            text-align: center; position: relative;
            margin-bottom: 28px;
            border: 1px solid rgba(232, 236, 244, 0.6);
            overflow: hidden;
        }

        /* Animated gradient top border */
        .qris-card::before {
            content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 4px;
            background: linear-gradient(90deg, var(--primary-red), var(--accent-blue), var(--accent-gold), var(--primary-red));
            background-size: 300% 100%;
            border-radius: var(--radius-xl) var(--radius-xl) 0 0;
            animation: gradientBorder 4s ease infinite;
        }

        @keyframes gradientBorder {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        
        .qris-logo-wrapper { margin-bottom: 22px; }
        .qris-logo-wrapper h3 {
            margin: 0; font-weight: 900; font-size: 17px; color: var(--text-dark); 
            letter-spacing: -0.5px;
        }
        .qris-logo-wrapper h3 span { color: var(--primary-red); }
        
        /* ── QR Image with Scan Indicator ── */
        .qris-image-wrapper {
            position: relative;
            display: inline-block;
            margin-bottom: 24px;
        }

        .qris-image {
            width: 210px; height: 210px; background: #f8fafc; border: 2px solid var(--border-color);
            border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center;
            padding: 12px; position: relative;
            overflow: hidden;
        }
        .qris-image img { width: 100%; height: 100%; object-fit: contain; }

        /* Scanning animation */
        .qris-scan-line {
            position: absolute;
            top: 0;
            left: 10px;
            right: 10px;
            height: 3px;
            background: linear-gradient(90deg, transparent, var(--primary-red), transparent);
            border-radius: 2px;
            animation: scanLine 2.5s ease-in-out infinite;
            box-shadow: 0 0 10px rgba(215, 18, 58, 0.3);
        }

        @keyframes scanLine {
            0% { top: 10px; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: calc(100% - 10px); opacity: 0; }
        }

        /* Corner markers */
        .qris-corners {
            position: absolute;
            inset: -2px;
            pointer-events: none;
        }
        .qris-corners::before, .qris-corners::after,
        .qris-corner-bl::before, .qris-corner-br::before {
            content: '';
            position: absolute;
            width: 20px;
            height: 20px;
            border-color: var(--primary-red);
            border-style: solid;
            border-width: 0;
        }
        .qris-corners::before {
            top: 0; left: 0;
            border-top-width: 3px;
            border-left-width: 3px;
            border-radius: 4px 0 0 0;
        }
        .qris-corners::after {
            top: 0; right: 0;
            border-top-width: 3px;
            border-right-width: 3px;
            border-radius: 0 4px 0 0;
        }
        .qris-corner-bl::before {
            bottom: 0; left: 0;
            border-bottom-width: 3px;
            border-left-width: 3px;
            border-radius: 0 0 0 4px;
        }
        .qris-corner-br::before {
            bottom: 0; right: 0;
            border-bottom-width: 3px;
            border-right-width: 3px;
            border-radius: 0 0 4px 0;
        }

        .qris-instruction {
            font-size: 13px; color: var(--text-muted); font-weight: 500; 
            margin: 0 0 22px 0; line-height: 1.6;
        }

        /* ══════════════════════════════════════════════════
           CIRCULAR TIMER
        ══════════════════════════════════════════════════ */
        .timer-wrapper {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .timer-circle {
            width: 80px;
            height: 80px;
            position: relative;
        }

        .timer-circle svg {
            width: 80px;
            height: 80px;
            transform: rotate(-90deg);
        }

        .timer-bg {
            fill: none;
            stroke: var(--border-color);
            stroke-width: 4;
        }

        .timer-progress {
            fill: none;
            stroke: #10b981;
            stroke-width: 4;
            stroke-linecap: round;
            stroke-dasharray: 226;
            stroke-dashoffset: 0;
            transition: stroke-dashoffset 1s linear, stroke 0.5s ease;
        }

        .timer-text {
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-weight: 900;
            color: var(--text-dark);
            letter-spacing: -0.5px;
        }

        .timer-label {
            font-size: 10px;
            font-weight: 700;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        /* ── Pay Button ── */
        .btn-pay {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white; border: none; padding: 18px; width: 100%; max-width: 360px; 
            border-radius: var(--radius-sm);
            font-size: 15px; font-weight: 800; cursor: pointer; transition: all 0.3s var(--ease);
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
            font-family: 'Inter', sans-serif;
            position: relative;
            overflow: hidden;
        }
        .btn-pay::after {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
            animation: shineSweep 3s ease-in-out infinite;
        }
        @keyframes shineSweep {
            0% { left: -100%; }
            40% { left: 150%; }
            100% { left: 150%; }
        }
        .btn-pay:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(16, 185, 129, 0.35); }
        .btn-pay:active { transform: translateY(0) scale(0.98); }

        /* ══════════════════════════════════════════════════
           STATE 2: LOADING
        ══════════════════════════════════════════════════ */
        #loadingState {
            display: none; flex-direction: column; align-items: center; justify-content: center;
            height: 60vh; text-align: center;
        }
        
        .loading-spinner {
            width: 56px;
            height: 56px;
            position: relative;
            margin-bottom: 24px;
        }
        
        .loading-spinner::before,
        .loading-spinner::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: 3px solid transparent;
        }
        
        .loading-spinner::before {
            border-top-color: var(--primary-red);
            animation: spin 1s linear infinite;
        }
        
        .loading-spinner::after {
            border-right-color: var(--accent-blue);
            animation: spin 0.6s linear infinite reverse;
            inset: 6px;
        }
        
        @keyframes spin { to { transform: rotate(360deg); } }

        .loading-text h3 {
            margin: 0 0 8px; font-weight: 800; color: var(--text-dark); font-size: 18px;
        }
        .loading-text p {
            font-size: 13px; color: var(--text-muted); margin: 0; font-weight: 500;
        }

        /* ══════════════════════════════════════════════════
           STATE 3: RECEIPT — Premium Design
        ══════════════════════════════════════════════════ */
        #receiptState {
            display: none; flex-direction: column; align-items: center; padding: 24px 20px;
            animation: receiptEntrance 0.6s var(--ease-out) both;
        }

        @keyframes receiptEntrance {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
        
        .receipt-card {
            background: white; border-radius: var(--radius-xl); width: 100%; max-width: 380px;
            box-shadow: var(--shadow-lg); padding: 34px 26px; position: relative;
            margin-bottom: 24px;
            border: 1px solid rgba(232, 236, 244, 0.5);
        }

        /* Zig-zag tear effect bottom */
        .receipt-card::after {
            content: ""; position: absolute; bottom: -8px; left: 0; right: 0; height: 16px;
            background-size: 16px 16px;
            background-image: radial-gradient(circle at 8px 0, transparent 8px, white 9px);
        }

        .receipt-header { 
            text-align: center; margin-bottom: 24px; 
            border-bottom: 2px dashed var(--border-color); padding-bottom: 24px; 
            position: relative;
        }
        
        .receipt-icon {
            width: 64px; height: 64px; 
            background: linear-gradient(135deg, #34d399, #10b981); 
            color: white; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; font-size: 28px;
            margin: 0 auto 16px;
            box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
            position: relative;
        }
        
        /* Success pulse ring */
        .receipt-icon::after {
            content: '';
            position: absolute;
            inset: -5px;
            border-radius: 50%;
            border: 2px solid rgba(16, 185, 129, 0.25);
            animation: successRing 2s ease-out infinite;
        }

        @keyframes successRing {
            0% { transform: scale(1); opacity: 1; }
            100% { transform: scale(1.5); opacity: 0; }
        }

        .receipt-header h2 { margin: 0 0 6px 0; font-size: 20px; font-weight: 900; color: var(--text-dark); }
        .receipt-header p { margin: 0; font-size: 12px; color: var(--text-muted); font-weight: 500; }

        /* ── LUNAS Stamp ── */
        .lunas-stamp {
            position: absolute;
            top: 20px;
            right: -8px;
            background: transparent;
            color: var(--green-success);
            border: 3px solid var(--green-success);
            padding: 4px 14px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 900;
            letter-spacing: 2px;
            transform: rotate(12deg);
            opacity: 0.7;
        }

        .receipt-row { 
            display: flex; justify-content: space-between; align-items: flex-start;
            margin-bottom: 14px; font-size: 13px; 
        }
        .receipt-row .label { color: var(--text-muted); font-weight: 500; flex-shrink: 0; }
        .receipt-row .val { color: var(--text-dark); font-weight: 700; text-align: right; max-width: 58%; word-break: break-word; }

        .receipt-section-title {
            font-size: 11px;
            color: var(--text-light);
            text-transform: uppercase;
            margin-bottom: 14px;
            font-weight: 800;
            letter-spacing: 0.8px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .receipt-section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--border-color);
        }

        .receipt-total {
            margin-top: 18px; padding-top: 18px; border-top: 2px dashed var(--border-color);
            display: flex; justify-content: space-between; align-items: center;
        }
        .receipt-total .label { font-size: 14px; font-weight: 800; color: var(--text-dark); }
        .receipt-total .val { font-size: 20px; font-weight: 900; color: var(--green-success); }

        /* ── Action Buttons ── */
        .receipt-actions {
            width: 100%;
            max-width: 380px;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .btn-receipt-secondary {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            color: var(--text-dark);
            border: 1.5px solid var(--border-color);
            padding: 16px;
            width: 100%;
            border-radius: var(--radius-sm);
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.25s var(--ease);
            box-shadow: var(--shadow-xs);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            font-family: 'Inter', sans-serif;
        }

        .btn-receipt-secondary:hover {
            border-color: var(--text-muted);
            transform: translateY(-1px);
            box-shadow: var(--shadow-sm);
        }
        .btn-receipt-secondary:active {
            transform: scale(0.98);
        }

        .btn-receipt-primary {
            background: var(--navy-grad);
            color: white;
            border: none;
            padding: 18px;
            width: 100%;
            border-radius: var(--radius-sm);
            font-size: 15px;
            font-weight: 800;
            cursor: pointer;
            transition: all 0.3s var(--ease);
            box-shadow: var(--shadow-blue);
            font-family: 'Inter', sans-serif;
        }

        .btn-receipt-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 16px 35px rgba(13, 27, 62, 0.3);
        }
        .btn-receipt-primary:active {
            transform: translateY(0) scale(0.98);
        }

        /* ══════════════════════════════════════════════════
           PAYMENT PROGRESS STEPS (Step 3 active)
        ══════════════════════════════════════════════════ */
    </style>
</head>

<body>

    <div class="mobile-app">
        <!-- Header -->
        <header class="header-page" id="mainHeader" style="display: flex; align-items: center; justify-content: space-between; padding: 18px 24px; position: sticky; top: 0; z-index: 999;">
            <div style="display:flex; align-items:center; gap:16px;">
                <button onclick="window.history.back()" style="border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; background: rgba(241,245,249,0.8); color: var(--text-dark); box-shadow: var(--shadow-xs); border: 1px solid rgba(232,236,244,0.5); transition: all 0.25s ease;">
                    <i class="fa-solid fa-arrow-left"></i>
                </button>
                <h2 style="font-size: 16px; font-weight: 800; letter-spacing: -0.5px; margin: 0;">Pembayaran TCO</h2>
            </div>
        </header>

        <!-- ═══ Progress Steps (Step 3 Active) ═══ -->
        <div class="progress-steps" id="progressSteps">
            <div class="step-item">
                <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                <span class="step-label completed">Pilih</span>
            </div>
            <div class="step-connector completed"></div>
            <div class="step-item">
                <div class="step-circle completed"><i class="fa-solid fa-check" style="font-size:11px;"></i></div>
                <span class="step-label completed">Detail</span>
            </div>
            <div class="step-connector completed"></div>
            <div class="step-item">
                <div class="step-circle active">3</div>
                <span class="step-label active">Bayar</span>
            </div>
            <div class="step-connector"></div>
            <div class="step-item">
                <div class="step-circle inactive"><i class="fa-solid fa-flag" style="font-size:10px;"></i></div>
                <span class="step-label">Selesai</span>
            </div>
        </div>

        <!-- ═══ STATE 1: QRIS PAYMENT ═══ -->
        <div id="paymentState">
            <div class="total-box">
                <h4>Total Tagihan</h4>
                <h1 id="payAmount">Rp 0</h1>
            </div>

            <div class="qris-card">
                <div class="qris-logo-wrapper">
                    <h3>QRIS <span>Tunas Toyota Kiara Condong</span></h3>
                </div>
                
                <div class="qris-image-wrapper">
                    <div class="qris-image">
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=SimulasiPembayaranTCO" alt="QRIS Barcode">
                        <div class="qris-scan-line"></div>
                    </div>
                    <div class="qris-corners">
                        <div class="qris-corner-bl"></div>
                        <div class="qris-corner-br"></div>
                    </div>
                </div>
                
                <p class="qris-instruction">
                    Silakan scan QR Code di atas menggunakan aplikasi m-Banking atau E-Wallet Anda.
                </p>

                <!-- Circular Timer -->
                <div class="timer-wrapper">
                    <div class="timer-circle">
                        <svg viewBox="0 0 80 80">
                            <circle class="timer-bg" cx="40" cy="40" r="36"></circle>
                            <circle class="timer-progress" id="timerProgress" cx="40" cy="40" r="36"></circle>
                        </svg>
                        <div class="timer-text" id="countdownTimer">14:59</div>
                    </div>
                    <span class="timer-label">Sisa Waktu</span>
                </div>
            </div>

            <button class="btn-pay" onclick="simulatePayment()">
                Saya Sudah Bayar <i class="fa-solid fa-check-circle" style="margin-left:4px;"></i>
            </button>
        </div>

        <!-- ═══ STATE 2: LOADING ═══ -->
        <div id="loadingState">
            <div class="loading-spinner"></div>
            <div class="loading-text">
                <h3>Memverifikasi...</h3>
                <p>Menunggu konfirmasi pembayaran</p>
            </div>
        </div>

        <!-- ═══ STATE 3: RECEIPT ═══ -->
        <div id="receiptState">
            <div class="receipt-card" id="receiptCardToDownload">
                <!-- Watermark Layer -->
                <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 20px; overflow: hidden; pointer-events: none; z-index: 0;">
                    <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; background-image: url('../image/download-removebg-preview.png'), url('../image/download-removebg-preview.png'); background-position: 0px 0px, 75px 75px; background-repeat: repeat, repeat; background-size: 150px 150px, 150px 150px; opacity: 0.12; transform: rotate(-30deg);"></div>
                </div>

                <!-- Receipt Content -->
                <div style="position: relative; z-index: 1;">
                    <div class="receipt-header">
                        <div class="receipt-icon"><i class="fa-solid fa-check"></i></div>
                        <h2>Pembayaran Berhasil</h2>
                        <p id="receiptDate">16 Jul 2026, 14:30 WIB</p>
                        <div class="lunas-stamp">LUNAS</div>
                    </div>

                    <div style="margin-bottom: 24px;">
                        <div class="receipt-row">
                            <span class="label">ID Transaksi</span>
                            <span class="val" id="receiptId">TCO-8273641</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Metode Bayar</span>
                            <span class="val">QRIS</span>
                        </div>
                        <div class="receipt-row">
                            <span class="label">Status</span>
                            <span class="val" style="color: var(--green-success); display: inline-flex; align-items: center; gap: 4px;">
                                <i class="fa-solid fa-circle-check" style="font-size: 12px;"></i> LUNAS
                            </span>
                        </div>
                    </div>

                    <div class="receipt-section-title">Detail Pesanan & Aksesoris</div>
                    
                    <div class="receipt-row">
                        <span class="label">Nama Pemesan</span>
                        <span class="val" id="receiptName">-</span>
                    </div>
                    <div class="receipt-row">
                        <span class="label">No. WhatsApp</span>
                        <span class="val" id="receiptPhone">-</span>
                    </div>
                    <div class="receipt-row">
                        <span class="label">Kendaraan</span>
                        <span class="val" id="receiptCar">-</span>
                    </div>
                    <div class="receipt-row">
                        <span class="label">Item Aksesoris</span>
                        <span class="val" id="receiptItem">-</span>
                    </div>
                    <div class="receipt-row">
                        <span class="label">Part Number (P/N)</span>
                        <span class="val" id="receiptPn" style="font-family:monospace;">-</span>
                    </div>
                    <div class="receipt-row">
                        <span class="label">Skema Pembelian</span>
                        <span class="val" id="receiptScheme">-</span>
                    </div>

                    <div class="receipt-total">
                        <span class="label">Total Dibayar</span>
                        <span class="val" id="receiptTotal">Rp 0</span>
                    </div>
                </div>
            </div>

            <div class="receipt-actions">
                <button class="btn-receipt-secondary" onclick="downloadReceipt()">
                    <i class="fa-solid fa-download"></i> Simpan Nota ke Galeri
                </button>

                <button class="btn-receipt-primary" onclick="finishOrder()">
                    <i class="fa-solid fa-home" style="margin-right: 4px;"></i> Kembali ke Beranda
                </button>
            </div>
        </div>

    </div>

    <script src="../js/tco_payment.js"></script>

</body>
</html>
