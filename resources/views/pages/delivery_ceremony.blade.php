<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sales App - Digital Delivery Ceremony & PDI Handover</title>
    <meta name="description" content="Serah Terima Unit Digital, PDI Checklist & Sertifikat Toyota">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="../css/style.css?v=5.0" />
    <script src="../js/sidebar_desktop.js"></script>
    <link rel="manifest" href="../manifest.json">
    <meta name="theme-color" content="#0d1b3e">
    <style>
        .delivery-hero {
            background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #3b82f6 100%);
            border-radius: var(--radius-lg, 16px);
            padding: 22px;
            color: #ffffff;
            margin-bottom: 20px;
            box-shadow: 0 10px 25px rgba(13, 27, 62, 0.25);
            position: relative;
            overflow: hidden;
        }

        .delivery-hero::after {
            content: '';
            position: absolute;
            top: -40px;
            right: -40px;
            width: 140px;
            height: 140px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
            border-radius: 50%;
        }

        .badge-delivery {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(255, 255, 255, 0.18);
            backdrop-filter: blur(8px);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11.5px;
            font-weight: 800;
            color: #ffffff;
            border: 1px solid rgba(255, 255, 255, 0.3);
            margin-bottom: 8px;
            text-transform: uppercase;
        }

        .card-custom {
            background: #ffffff;
            border-radius: var(--radius-lg, 16px);
            padding: 20px;
            border: 1px solid var(--border-color, #e2e8f0);
            box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
            margin-bottom: 20px;
        }

        .pdi-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 12px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            margin-bottom: 8px;
            font-size: 13px;
            font-weight: 600;
        }

        .pdi-item input[type="checkbox"] {
            width: 18px;
            height: 18px;
            accent-color: #2563eb;
            cursor: pointer;
        }

        .canvas-signature {
            width: 100%;
            height: 160px;
            background: #f8fafc;
            border: 1.5px dashed #cbd5e1;
            border-radius: 12px;
            touch-action: none;
        }
    </style>
</head>

<body>
    <div class="mobile-app">
        <!-- Header Page -->
        <header class="header-page">
            <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
            <h2>Digital Delivery Ceremony</h2>
        </header>

        <div class="container" style="margin-top: 0;">

            <!-- Hero Banner -->
            <div class="delivery-hero">
                <div class="badge-delivery">
                    <i class="fa-solid fa-award"></i> Customer First & Best in Town
                </div>
                <h3 style="margin:0 0 6px 0; font-size: 18px; font-weight:800;">Handover & PDI Digital Ceremony</h3>
                <p style="margin:0; font-size:12px; opacity:0.92; line-height:1.5;">
                    Dokumentasi serah terima unit, PDI checklist, tanda tangan digital, & sertifikat selebrasi resmi Toyota!
                </p>
            </div>

            <!-- Form Data Customer -->
            <div class="card-custom">
                <h4 style="margin:0 0 14px 0; font-size:14px; font-weight:800; color:var(--primary-blue, #0d1b3e);">
                    <i class="fa-solid fa-user-check" style="color:#2563eb;"></i> Data Serah Terima Kendaraan
                </h4>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size:12px; font-weight:700;">Nama Customer <span style="color:#e11d48">*</span></label>
                    <input type="text" id="delNamaCustomer" class="form-control" placeholder="Contoh: Ir. Budi Santoso" required>
                </div>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size:12px; font-weight:700;">No. WhatsApp / HP <span style="color:#e11d48">*</span></label>
                    <input type="text" id="delNoHp" class="form-control" placeholder="Contoh: 081223344556" required>
                </div>

                <div class="form-group" style="margin-bottom:12px;">
                    <label style="font-size:12px; font-weight:700;">Model Unit Toyota <span style="color:#e11d48">*</span></label>
                    <input type="text" id="delModelUnit" class="form-control" placeholder="Contoh: Kijang Innova Zenix V Hybrid" required>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:12px;">
                    <div>
                        <label style="font-size:11.5px; font-weight:700;">No. Rangka</label>
                        <input type="text" id="delNoRangka" class="form-control" placeholder="MHFK123...">
                    </div>
                    <div>
                        <label style="font-size:11.5px; font-weight:700;">No. Mesin</label>
                        <input type="text" id="delNoMesin" class="form-control" placeholder="1NZ-FE...">
                    </div>
                </div>
            </div>

            <!-- PDI Checklist Card -->
            <div class="card-custom">
                <h4 style="margin:0 0 12px 0; font-size:14px; font-weight:800; color:var(--primary-blue, #0d1b3e);">
                    <i class="fa-solid fa-list-check" style="color:#059669;"></i> Digital PDI (Pre-Delivery Inspection) Checklist
                </h4>

                <div id="pdiChecklistContainer">
                    <div class="pdi-item">
                        <span><i class="fa-solid fa-file-contract" style="color:#2563eb; margin-right:6px;"></i> STNK, BPKB & Buku Garansi T-Care</span>
                        <input type="checkbox" class="pdi-chk" value="Buku Garansi & Dokumen" checked>
                    </div>
                    <div class="pdi-item">
                        <span><i class="fa-solid fa-key" style="color:#d97706; margin-right:6px;"></i> Kunci Cadangan & Remote Alarm</span>
                        <input type="checkbox" class="pdi-chk" value="Kunci Cadangan" checked>
                    </div>
                    <div class="pdi-item">
                        <span><i class="fa-solid fa-fire-extinguisher" style="color:#e11d48; margin-right:6px;"></i> Alat Pemadam APAR & First Aid Kit</span>
                        <input type="checkbox" class="pdi-chk" value="APAR & First Aid Kit" checked>
                    </div>
                    <div class="pdi-item">
                        <span><i class="fa-solid fa-car-battery" style="color:#059669; margin-right:6px;"></i> Karpet Dasar Original & Kaca Film V-Kool</span>
                        <input type="checkbox" class="pdi-chk" value="Karpet Dasar & Kaca Film" checked>
                    </div>
                    <div class="pdi-item">
                        <span><i class="fa-solid fa-plug" style="color:#7c3aed; margin-right:6px;"></i> Sistem Kelistrikan, Layar Touchscreen & AC</span>
                        <input type="checkbox" class="pdi-chk" value="Layar Touchscreen & AC" checked>
                    </div>
                </div>
            </div>

            <!-- Digital Signature Card -->
            <div class="card-custom">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <h4 style="margin:0; font-size:14px; font-weight:800; color:var(--primary-blue);">
                        <i class="fa-solid fa-signature" style="color:#0d1b3e;"></i> Tanda Tangan Digital Customer
                    </h4>
                    <button type="button" onclick="clearDelSignature()" style="background:#f1f5f9; border:1px solid #cbd5e1; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer;">
                        <i class="fa-solid fa-eraser"></i> Hapus
                    </button>
                </div>
                <canvas id="delSigCanvas" class="canvas-signature"></canvas>
                <p style="font-size:11px; color:#64748b; margin-top:6px; text-align:center;">Usap jari atau mouse Anda di atas kotak untuk menandatangani.</p>

                <div style="margin-top:16px;">
                    <button type="button" class="btn-main" onclick="submitDeliveryCeremony()" style="width:100%; background:linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%); border:none; padding:14px; font-weight:800; border-radius:12px;">
                        <i class="fa-solid fa-certificate"></i> Simpan & Terbitkan Sertifikat Serah Terima (DB)
                    </button>
                </div>
            </div>

            <!-- Certificate Result Modal/Box -->
            <div id="delCertResultCard" class="card-custom" style="display:none; border-top: 4px solid #059669;">
                <h4 style="margin:0 0 10px 0; font-size:15px; font-weight:800; color:#047857; text-align:center;">
                    🎉 SERTIFIKAT SERAH TERIMA DIGITAL TOYOTA
                </h4>
                <div id="delCertContent" style="background:#ecfdf5; padding:16px; border-radius:12px; border:1px solid #a7f3d0; font-size:13px; line-height:1.6; color:#065f46;">
                </div>
                <div style="margin-top:14px;">
                    <button type="button" class="btn-main" onclick="shareDeliveryWA()" style="width:100%; background:#25D366; border:none; padding:12px; font-weight:800; border-radius:12px;">
                        <i class="fa-brands fa-whatsapp"></i> Bagikan Sertifikat & Ucapan ke WA Customer
                    </button>
                </div>
            </div>

        </div><!-- /container -->
    </div><!-- /mobile-app -->

    <script src="../custom_alert.js"></script>
    <script src="../js/delivery_ceremony.js"></script>
</body>

</html>
