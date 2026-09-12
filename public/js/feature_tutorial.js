/**
 * feature_tutorial.js
 * Universal Contextual Feature Tutorial Engine for Tunas Toyota Sales Force System
 * 
 * Mengarahkan langsung ke tombol/elemen asli di layar dengan sorotan (Spotlight Tour)
 * persis seperti tutorial alur di Dashboard (Foto 2):
 * - Latar belakang redup (Dimmed Backdrop)
 * - Tombol target disorot dengan bingkai merah bercahaya (Pulsing Spotlight)
 * - Kartu petunjuk melayang (Floating Tooltip Box) mengarah langsung ke tombol tersebut
 * - Langkah bertahap (1 ➔ 2 ➔ 3) dengan tombol "Mundur", "Lanjut", "Lewati", & "Selesai"
 * - Otomatis berjalan 1x saat pertama kali membuka halaman fitur
 * - Dapat diulang kapan saja melalui tombol header [ 💡 Cara Pakai ] atau floating button
 */

(function initFeatureSpotlightModule() {
    'use strict';

    if (window.sftFeatureTutorialLoaded) return;
    window.sftFeatureTutorialLoaded = true;

    // =========================================================================
    // 1. CEK HALAMAN AKTIF
    // =========================================================================
    function getCleanPageSlug() {
        let pathname = window.location.pathname.toLowerCase();
        pathname = pathname.replace(/\/$/, '');
        let file = pathname.split('/').pop().split('?')[0].split('#')[0] || '';
        file = file.replace(/\.html$/, '').replace(/\.blade\.php$/, '');

        // JANGAN jalankan feature_tutorial di dashboard/index utama,
        // karena dashboard sudah memiliki app_tour.js tersendiri agar tidak bertabrakan!
        if (!file || file === 'index' || file === 'home' || file === 'dashboard') {
            if (pathname.includes('pages_spv') || pathname.includes('/spv')) return 'spv_dashboard';
            if (pathname.includes('pages_kacab') || pathname.includes('/kacab')) return 'kacab_dashboard';
            return 'dashboard_root'; // Tandai dashboard root
        }

        if (pathname.includes('pages_spv') || pathname.includes('/spv/')) {
            return 'spv_' + file;
        }
        if (pathname.includes('pages_kacab') || pathname.includes('/kacab/')) {
            return 'kacab_' + file;
        }

        // Aliases
        if (file === 'catalog' || file === 'brosur') return 'elibrary';
        if (file === 'komparasi') return 'battle_card';
        if (file === 'eco_calculator') return 'hybrid_flow';
        if (file === 'tco_builder' || file === 'tco_order' || file === 'tco_payment') return 'kalkulator';
        if (file === 'jadwal_input' || file === 'foto_group_aktivitas' || file === 'riwayat_foto_aktivitas') return 'input';
        if (file === 'jadwal_inspeksi' || file === 'inspeksi') return 'tradein';
        if (file === 'rental_testdrive' || file === 'cetak_testdrive') return 'testdrive';
        if (file === 'public_card') return 'digital_card';
        if (file === 'polreg_detail') return 'polreg';

        return file;
    }

    const currentSlug = getCleanPageSlug();

    // Jika sedang di dashboard root, berhenti agar app_tour.js berjalan bebas tanpa tabrakan!
    if (currentSlug === 'dashboard_root') {
        return;
    }

    // =========================================================================
    // 2. BASIS DATA LANGKAH SPOTLIGHT PER FITUR (ELEMENT-TARGETED TOUR STEPS)
    // =========================================================================
    const FEATURE_SPOTLIGHT_STEPS = {
        // ── SPK (Surat Pesanan Kendaraan) ────────────────────────────────────
        'spk': [
            {
                target: '#btnScanKtp, #btnModeBiasa, .input-mode-switcher-card, #inputBiasaContainer',
                badge: 'Langkah 1 dari 3: Identitas Pembeli',
                icon: 'fa-camera',
                title: '1. Foto KTP Customer (Scan Otomatis)',
                desc: 'Arahkan kamera HP ke KTP calon pembeli. Sistem otomatis mengisi NIK, Nama, dan Alamat tanpa perlu Anda ketik satu per satu.'
            },
            {
                target: '#modelMobil, select[name="model"], #tandaJadiInput, #formPengajuanSpk .form-group:nth-child(2), input[name="nama"]',
                badge: 'Langkah 2 dari 3: Unit & Booking Fee',
                icon: 'fa-car-side',
                title: '2. Pilih Tipe Mobil & Uang Tanda Jadi',
                desc: 'Pilih tipe mobil Toyota yang dipesan customer, tentukan warna idaman, dan masukkan nominal booking fee (minimal Rp 5 Juta) beserta foto bukti transfer.'
            },
            {
                target: '#signaturePad, .signature-wrapper, button[type="submit"], .btn-submit-spk, button.btn-main, .container',
                badge: 'Langkah 3 dari 3: Otorisasi SPV',
                icon: 'fa-file-signature',
                title: '3. Tanda Tangan & Kirim ke SPV',
                desc: 'Minta tanda tangan customer langsung di layar HP Anda, lalu tekan tombol Kirim Pengajuan SPK agar berkas langsung masuk ke meja SPV untuk di-ACC!'
            }
        ],

        // ── KALKULATOR MULTI-LEASING ─────────────────────────────────────────
        'kalkulator': [
            {
                target: '.finance-tab-wrapper, #modelSelect, select[name="model"], .model-picker, .card:first-child',
                badge: 'Langkah 1 dari 3: Pilih Mobil & OTR',
                icon: 'fa-car',
                title: '1. Pilih Model Mobil & Harga OTR',
                desc: 'Pilih tipe mobil Toyota yang diinginkan pembeli. Harga resmi OTR Jawa Barat terbaru beserta program diskon cabang akan otomatis terisi.'
            },
            {
                target: '#dpRange, #dpPercent, #tenorSelect, .dp-slider-wrap, .finance-calc-body, .calc-body',
                badge: 'Langkah 2 dari 3: Atur Angsuran',
                icon: 'fa-sliders',
                title: '2. Geser DP & Pilih Tenor Cicilan',
                desc: 'Geser persentase DP (misal 20% atau 30%) dan tentukan lama cicilan (1 s/d 5 tahun) untuk melihat besaran angsuran yang pas di kantong pembeli.'
            },
            {
                target: '#btnAjukanSpk, #btnShareWa, .btn-export-pdf, .calc-action-group, .btn-main',
                badge: 'Langkah 3 dari 3: Deal & Tindak Lanjut',
                icon: 'fa-file-invoice-dollar',
                title: '3. Ajukan SPK atau Kirim ke WhatsApp',
                desc: 'Customer setuju hitungan angsuran? Tekan [Ajukan SPK dengan Simulasi Ini] untuk langsung memesan mobil, atau kirim PDF penawaran ke WhatsApp pembeli.'
            }
        ],

        // ── CUSTOMER CRM PIPELINE ────────────────────────────────────────────
        'customer': [
            {
                target: 'button[onclick*="openAddCustomerModal"], #searchCustomer, .btn-main',
                badge: 'Langkah 1 dari 3: Tambah Prospek',
                icon: 'fa-user-plus',
                title: '1. Catat Calon Pembeli Baru',
                desc: 'Ketuk tombol tambah ini setiap kali berkenalan dengan orang yang tertarik mobil Toyota untuk menyimpan nama, nomor WhatsApp, dan mobil incarannya.'
            },
            {
                target: '#followupList, .kanban-col, .card-customer, #kanbanBoard, .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Update Status',
                icon: 'fa-arrows-left-right',
                title: '2. Geser Status (Cold ➔ Warm ➔ Hot)',
                desc: 'Tarik dan geser kartu customer antar kolom setelah Anda selesai follow-up telepon/chat agar proses pendekatan selalu terpantau rapi.'
            },
            {
                target: '.customer-action-btn, .btn-action-group, .card:first-child',
                badge: 'Langkah 3 dari 3: Aksi Cepat',
                icon: 'fa-bolt',
                title: '3. Tombol Aksi Pintas',
                desc: 'Gunakan tombol aksi di kartu customer untuk langsung menjadwalkan Test Drive, membuat Simulasi Kredit, atau langsung menerbitkan Form SPK.'
            }
        ],

        // ── PRICELIST OTR ───────────────────────────────────────────────────
        'pricelist': [
            {
                target: '#searchPricelist, input[type="search"], .search-box, .filter-category, input[type="text"]',
                badge: 'Langkah 1 dari 3: Cari Mobil',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Model Kendaraan',
                desc: 'Ketik tipe mobil yang ditanyakan calon pembeli (contoh: Zenix, Avanza, Veloz, Calya) untuk menemukan baris harga OTR seketika.'
            },
            {
                target: '.table-pricelist tbody tr:first-child, .pricelist-row, .price-col, table',
                badge: 'Langkah 2 dari 3: Cek Harga & Diskon',
                icon: 'fa-tags',
                title: '2. Periksa OTR & Plafon Diskon',
                desc: 'Lihat harga on-the-road tunai dan diskon resmi wiraniaga. Jika customer menawar lebih, ajukan otorisasi diskon khusus ke Supervisor.'
            },
            {
                target: '.btn-simulasi, a[href*="kalkulator"], .btn-action-pricelist, a.btn-main',
                badge: 'Langkah 3 dari 3: Hitung Angsuran',
                icon: 'fa-calculator',
                title: '3. Ketuk [Simulasi Kredit]',
                desc: 'Tekan tombol ini di samping mobil yang dipilih untuk langsung membawa nominal harga OTR ke kalkulator kredit tanpa perlu catat manual.'
            }
        ],

        // ── LIVE INVENTORY (STOK GUDANG) ────────────────────────────────────
        'inventory': [
            {
                target: '#searchStock, select[name="filter_model"], #filterWarna, .stock-filters, input[type="text"]',
                badge: 'Langkah 1 dari 3: Filter Unit',
                icon: 'fa-filter',
                title: '1. Filter Model & Warna',
                desc: 'Pilih tipe mobil dan warna yang dicari customer untuk memeriksa ketersediaan unit di gudang cabang dan depo pusat.'
            },
            {
                target: '.badge-stock, .badge-free, .table-inventory tbody tr:first-child, .stock-row, table',
                badge: 'Langkah 2 dari 3: Status Siap Jual',
                icon: 'fa-circle-check',
                title: '2. Cek Status Hijau (Free Stock)',
                desc: 'Pastikan status unit berwarna HIJAU (Free Stock) yang berarti siap dijual dan langsung bisa diproses untuk pengiriman cepat.'
            },
            {
                target: '.btn-lock-unit, a[href*="spk"], .btn-copy-vin, .inventory-action, table',
                badge: 'Langkah 3 dari 3: Kunci Unit',
                icon: 'fa-lock',
                title: '3. Kunci Nomor Rangka ke SPK',
                desc: 'Salin Nomor Rangka mobil yang ready stock, lalu pasangkan pada form SPK customer Anda agar unit tersebut resmi terkunci atas nama Anda!'
            }
        ],

        // ── TEST DRIVE ──────────────────────────────────────────────────────
        'testdrive': [
            {
                target: '#btnTambahTestDrive, .btn-booking-testdrive, .btn-add-schedule, .btn-primary, .btn-main',
                badge: 'Langkah 1 dari 3: Daftar Jadwal',
                icon: 'fa-calendar-plus',
                title: '1. Jadwalkan Uji Coba Mobil',
                desc: 'Tekan tombol ini untuk memilih calon pembeli dan tipe mobil test drive yang siap dikendarai bersama customer.'
            },
            {
                target: '#lokasiSelect, input[name="jadwal"], .schedule-card, .testdrive-form, .card:first-child',
                badge: 'Langkah 2 dari 3: Waktu & Lokasi',
                icon: 'fa-location-dot',
                title: '2. Tentukan Tanggal & Tempat',
                desc: 'Pilih apakah customer ingin mencoba di showroom dealer atau Anda mengantarkan unit uji coba langsung ke rumah/kantor pembeli.'
            },
            {
                target: '.btn-spk-testdrive, .btn-closing-action, .testdrive-card:first-child, .card:last-child',
                badge: 'Langkah 3 dari 3: Deal Penjualan',
                icon: 'fa-file-signature',
                title: '3. Lanjut Buat SPK Setelah Puas',
                desc: 'Setelah pembeli merasakan kenyamanan dan tarikan mesin Toyota, segera tekan [Lanjut Buat SPK Unit Ini] selagi antusiasme pembeli memuncak!'
            }
        ],

        // ── TRADE-IN (TUKAR TAMBAH) ─────────────────────────────────────────
        'tradein': [
            {
                target: '#formTradeIn, input[name="merk_mobil"], select[name="tahun"], .tradein-input-grid, .card:first-child',
                badge: 'Langkah 1 dari 3: Data Mobil Lama',
                icon: 'fa-car-burst',
                title: '1. Masukkan Data Mobil Lama',
                desc: 'Ketik merk mobil bekas pembeli (apapun merknya), tahun pembuatan, tipe transmisi, dan jarak kilometer yang tertera di speedometer.'
            },
            {
                target: '#uploadFotoMobil, .upload-area, input[type="file"], .photo-guide, .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Foto Kendaraan',
                icon: 'fa-images',
                title: '2. Upload Foto Kondisi Fisik Mobil',
                desc: 'Lampirkan 4 foto (tampak depan, belakang, interior dashboard, dan speedometer) agar tim penilai memberikan harga taksiran terbaik.'
            },
            {
                target: '#btnApplyTradeIn, .btn-apply-spk, button[type="submit"], .btn-submit-tradein, .btn-main',
                badge: 'Langkah 3 dari 3: Potong DP SPK',
                icon: 'fa-circle-dollar-to-slot',
                title: '3. Gunakan Taksiran untuk Potong DP',
                desc: 'Tekan tombol terapkan taksiran agar uang mobil lama langsung otomatis menjadi pengurang DP mobil Toyota baru di form SPK!'
            }
        ],

        // ── DELIVERY ORDER (DO) ─────────────────────────────────────────────
        'do': [
            {
                target: '#selectSpk, select[name="spk_id"], .spk-dropdown, .form-do, .card:first-child',
                badge: 'Langkah 1 dari 3: Pilih SPK',
                icon: 'fa-file-check',
                title: '1. Pilih SPK Lunas / ACC Leasing',
                desc: 'Pilih customer yang SPK-nya sudah lunas uang mukanya atau sudah terbit PO dari pihak leasing rekanan.'
            },
            {
                target: '#tanggalKirim, textarea[name="alamat_kirim"], input[name="alamat"], .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Jadwal Pengiriman',
                icon: 'fa-calendar-days',
                title: '2. Atur Tanggal Janji Kirim',
                desc: 'Tentukan tanggal dan alamat pengantaran mobil ke rumah pembeli sesuai kesepakatan bersama keluarga customer.'
            },
            {
                target: '#btnSubmitDo, button[type="submit"], .btn-submit-do, .btn-main',
                badge: 'Langkah 3 dari 3: Penerbitan DO',
                icon: 'fa-truck-ramp-box',
                title: '3. Ajukan DO ke Tim Logistik',
                desc: 'Tekan [Ajukan Delivery Order] agar tim salon PDI dan supir pengiriman cabang segera menyiapkan mobil baru untuk diantarkan!'
            }
        ],

        // ── DELIVERY CEREMONY ───────────────────────────────────────────────
        'delivery_ceremony': [
            {
                target: '#pdiChecklist, .checklist-container, .pdi-item:first-child, .card:first-child',
                badge: 'Langkah 1 dari 3: Cek Kelengkapan',
                icon: 'fa-clipboard-check',
                title: '1. Checklist Fisik & Dokumen',
                desc: 'Periksa bersama customer: buku servis resmi, kunci serep, dongkrak, karpet bludru, dan kartu garansi kaca film.'
            },
            {
                target: '#btnAmbilFoto, .camera-trigger, input[type="file"], .photo-ceremony, .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Foto Selebrasi',
                icon: 'fa-camera',
                title: '2. Foto Penyerahan Kunci Mobil',
                desc: 'Abadikan momen bahagia penyerahan replika kunci bersama customer di depan mobil barunya. Foto ini akan otomatis masuk ke Piagam Digital!'
            },
            {
                target: '#btnGenerateCertificate, #btnShareCertificate, .btn-publish-ceremony, .btn-main',
                badge: 'Langkah 3 dari 3: Piagam Digital',
                icon: 'fa-award',
                title: '3. Cetak & Kirim Piagam ke WhatsApp',
                desc: 'Minta customer tanda tangan di layar HP Anda, lalu kirimkan Piagam Penyerahan Berbingkai Emas langsung ke WhatsApp customer!'
            }
        ],

        // ── INPUT AKTIVITAS ─────────────────────────────────────────────────
        'input': [
            {
                target: '#jenisAktivitas, select[name="jenis_aktivitas"], .activity-type-picker, .card:first-child',
                badge: 'Langkah 1 dari 3: Jenis Kegiatan',
                icon: 'fa-list-check',
                title: '1. Pilih Jenis Aktivitas Sales',
                desc: 'Pilih kegiatan yang baru saja Anda laksanakan: Canvassing Lapangan, Jaga Pameran Mall, Kunjungan Prospek, atau Follow-up Telepon.'
            },
            {
                target: '#btnKamera, .camera-box, input[type="file"], .gps-box, .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Foto & GPS',
                icon: 'fa-location-crosshairs',
                title: '2. Ambil Foto di Lokasi (GPS Otomatis)',
                desc: 'Tekan tombol kamera dan ambil foto di lokasi kegiatan. Titik koordinat GPS dan jam kehadiran akan terkunci secara otomatis.'
            },
            {
                target: '#btnSimpan, button[type="submit"], .btn-save-activity, .btn-main',
                badge: 'Langkah 3 dari 3: Lapor ke SPV',
                icon: 'fa-floppy-disk',
                title: '3. Simpan & Laporkan ke Supervisor',
                desc: 'Tulis catatan singkat hasil obrolan dengan prospek, lalu tekan Simpan. Supervisor (SPV) Anda akan langsung melihat laporan aktif Anda!'
            }
        ],

        // ── AO REPORT ───────────────────────────────────────────────────────
        'ao_report': [
            {
                target: '#searchAo, .filter-leasing, .search-bar, input[type="text"]',
                badge: 'Langkah 1 dari 3: Cari Customer',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Berkas Pengajuan Kredit',
                desc: 'Ketik nama customer atau pilih leasing (TAF, ACC, MTF, BCA) untuk memantau berkas siapa yang sedang diproses analis leasing.'
            },
            {
                target: '.badge-ao-status, .ao-card:first-child, .table-ao tbody tr:first-child, table',
                badge: 'Langkah 2 dari 3: Pantau Warna Status',
                icon: 'fa-traffic-light',
                title: '2. Perhatikan Warna Status',
                desc: 'Kuning (Sedang Survey), Merah (Kurang Dokumen), dan Hijau (PO Approved / Kredit Disetujui Siap Kirim Mobil).'
            },
            {
                target: '.btn-contact-ao, .btn-action-followup, a[href*="do"], .btn-main',
                badge: 'Langkah 3 dari 3: Tindak Lanjut',
                icon: 'fa-phone-volume',
                title: '3. Tindak Lanjuti Segera',
                desc: 'Jika status hijau (PO Terbit), segera buka menu Pengajuan DO untuk menjadwalkan pengantaran mobil baru!'
            }
        ]
    };

    // Generic fallback steps for any other pages
    function getFallbackSteps() {
        return [
            {
                target: 'input[type="text"], input[type="search"], select, .search-box, .form-control',
                badge: 'Langkah 1 dari 3: Filter / Cari',
                icon: 'fa-magnifying-glass',
                title: '1. Gunakan Kolom Filter / Pencarian',
                desc: 'Ketik kata kunci atau pilih kategori filter di bagian atas untuk menyaring data yang Anda perlukan di halaman ini.'
            },
            {
                target: 'table tbody tr:first-child, .card:first-child, .container, .card',
                badge: 'Langkah 2 dari 3: Tinjau Data',
                icon: 'fa-table-list',
                title: '2. Tinjau Informasi Lengkap',
                desc: 'Periksa informasi dan angka yang tercantum pada kartu atau baris tabel secara seksama.'
            },
            {
                target: 'button[type="submit"], .btn-main, .btn-primary, .btn-success, button',
                badge: 'Langkah 3 dari 3: Proses Data',
                icon: 'fa-circle-check',
                title: '3. Tekan Tombol Aksi Utama',
                desc: 'Tekan tombol aksi berwarna (Simpan / Proses / Tambah) untuk menyelesaikan tindakan Anda di halaman ini.'
            }
        ];
    }

    // =========================================================================
    // 3. INJECT STYLES FOR SPOTLIGHT TOUR & TOOLTIP CARD (PERSIS FOTO 2)
    // =========================================================================
    function injectSpotlightStyles() {
        if (document.getElementById('sftFeatureSpotlightStyles')) return;
        const style = document.createElement('style');
        style.id = 'sftFeatureSpotlightStyles';
        style.innerHTML = `
            /* ── HEADER TRIGGER BUTTON ── */
            .btn-feature-guide-header {
                display: inline-flex !important;
                align-items: center !important;
                gap: 7px !important;
                background: linear-gradient(135deg, #fef08a, #fde047) !important;
                color: #854d0e !important;
                border: 1.5px solid #facc15 !important;
                padding: 6px 13px !important;
                border-radius: 20px !important;
                font-size: 12.5px !important;
                font-weight: 800 !important;
                cursor: pointer !important;
                box-shadow: 0 3px 10px rgba(234, 179, 8, 0.25) !important;
                transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
                white-space: nowrap !important;
                text-decoration: none !important;
                line-height: 1 !important;
                user-select: none !important;
            }
            .btn-feature-guide-header:hover {
                transform: translateY(-2px) scale(1.04) !important;
                box-shadow: 0 6px 16px rgba(234, 179, 8, 0.4) !important;
            }
            .btn-feature-guide-header i {
                font-size: 13.5px !important;
                color: #b45309 !important;
                animation: sftBulbGlow 2s infinite ease-in-out !important;
            }

            @keyframes sftBulbGlow {
                0%, 100% { transform: scale(1); opacity: 0.9; }
                50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 4px #eab308); }
            }

            /* Lock Scrolling during Tour */
            html.tour-scroll-locked,
            body.tour-scroll-locked,
            .tour-scroll-locked {
                overflow: hidden !important;
                overscroll-behavior: none !important;
                touch-action: none !important;
            }

            /* ── INTERACTIVE SPOTLIGHT (PERSIS FOTO 2) ── */
            .sft-page-spotlight {
                position: fixed;
                border-radius: 18px;
                box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.78);
                border: 3px solid #d71920;
                z-index: 999995;
                pointer-events: none;
                transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .sft-page-spotlight::after {
                content: '';
                position: absolute;
                inset: -8px;
                border-radius: 24px;
                border: 2px dashed rgba(255, 255, 255, 0.65);
                animation: sftTourPulse 2s infinite;
            }
            @keyframes sftTourPulse {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.9; transform: scale(1.02); }
            }

            /* ── TOOLTIP CARD (PERSIS FOTO 2) ── */
            .sft-page-tooltip-box {
                position: fixed;
                background: #ffffff;
                border-radius: 22px;
                padding: 22px 20px;
                width: min(390px, 92vw);
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.45);
                border: 2px solid #e2e8f0;
                z-index: 999998;
                transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
                font-family: inherit;
            }
            .sft-page-tooltip-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }
            .sft-page-tooltip-badge {
                font-size: 11px;
                font-weight: 800;
                background: #fee2e2;
                color: #d71920;
                padding: 4px 12px;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .sft-page-tooltip-close {
                background: transparent;
                border: none;
                color: #94a3b8;
                font-size: 22px;
                cursor: pointer;
                padding: 2px 6px;
                line-height: 1;
                border-radius: 8px;
                transition: all 0.15s;
            }
            .sft-page-tooltip-close:hover {
                color: #ef4444;
                background: #f1f5f9;
            }
            .sft-page-tooltip-title {
                font-size: 17.5px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 8px;
                display: flex;
                align-items: center;
                gap: 8px;
                line-height: 1.35;
            }
            .sft-page-tooltip-title i {
                color: #d71920;
                font-size: 17px;
            }
            .sft-page-tooltip-desc {
                font-size: 14px;
                color: #334155;
                line-height: 1.6;
                margin: 0 0 18px;
            }
            .sft-page-tooltip-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                padding-top: 14px;
                border-top: 1px solid #f1f5f9;
            }
            .sft-btn-tour-exit-link {
                background: transparent;
                border: none;
                color: #94a3b8;
                font-size: 13px;
                font-weight: 700;
                cursor: pointer;
                text-decoration: underline;
                padding: 6px 2px;
            }
            .sft-btn-tour-exit-link:hover {
                color: #ef4444;
            }
            .sft-page-tour-btn-group {
                display: flex;
                gap: 8px;
            }
            .sft-btn-tour-nav {
                border: none;
                padding: 9px 16px;
                border-radius: 11px;
                font-size: 13px;
                font-weight: 800;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 6px;
                transition: all 0.15s ease;
            }
            .sft-btn-tour-prev {
                background: #f1f5f9;
                color: #475569;
            }
            .sft-btn-tour-prev:hover {
                background: #e2e8f0;
            }
            .sft-btn-tour-next {
                background: #d71920;
                color: white;
                box-shadow: 0 3px 8px rgba(215, 25, 32, 0.3);
            }
            .sft-btn-tour-next:hover {
                background: #b91c1c;
                transform: translateY(-1px);
            }
            .sft-step-dots {
                display: flex;
                gap: 5px;
                align-items: center;
            }
            .sft-step-dot {
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #cbd5e1;
                transition: all 0.2s;
            }
            .sft-step-dot.active {
                background: #d71920;
                width: 16px;
                border-radius: 10px;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    // =========================================================================
    // 4. SPOTLIGHT TOUR CONTROLLER (STEP BY STEP)
    // =========================================================================
    let currentStepIndex = 0;
    let activeSpotlight = null;
    let activeTooltip = null;
    let activeSteps = [];
    let currentTargetEl = null;
    let isScrollLocked = false;

    function lockPageScroll() {
        if (isScrollLocked) return;
        isScrollLocked = true;
        document.documentElement.classList.add('tour-scroll-locked');
        document.body.classList.add('tour-scroll-locked');
        document.querySelectorAll('.desktop-content, .mobile-app, .container').forEach(el => {
            el.classList.add('tour-scroll-locked');
        });

        window.addEventListener('wheel', preventWheelScroll, { passive: false, capture: true });
        window.addEventListener('touchmove', preventTouchScroll, { passive: false, capture: true });
        window.addEventListener('keydown', preventKeyScroll, { passive: false, capture: true });
    }

    function unlockPageScroll() {
        if (!isScrollLocked) return;
        isScrollLocked = false;
        document.documentElement.classList.remove('tour-scroll-locked');
        document.body.classList.remove('tour-scroll-locked');
        document.querySelectorAll('.desktop-content, .mobile-app, .container').forEach(el => {
            el.classList.remove('tour-scroll-locked');
        });

        window.removeEventListener('wheel', preventWheelScroll, { capture: true });
        window.removeEventListener('touchmove', preventTouchScroll, { capture: true });
        window.removeEventListener('keydown', preventKeyScroll, { capture: true });
    }

    function preventWheelScroll(e) {
        if (activeTooltip && activeTooltip.contains(e.target)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function preventTouchScroll(e) {
        if (activeTooltip && activeTooltip.contains(e.target)) {
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        return false;
    }

    function preventKeyScroll(e) {
        const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '];
        if (keys.includes(e.key)) {
            if (activeTooltip && activeTooltip.contains(document.activeElement)) {
                return;
            }
            e.preventDefault();
            return false;
        }
    }

    function findVisibleTarget(selectorString) {
        if (!selectorString) return null;
        const selectors = selectorString.split(',').map(s => s.trim());
        for (let sel of selectors) {
            try {
                const els = document.querySelectorAll(sel);
                for (let el of els) {
                    if (el && el.offsetParent !== null) {
                        const rect = el.getBoundingClientRect();
                        if (rect.width > 10 && rect.height > 10) {
                            return el;
                        }
                    }
                }
            } catch (e) {}
        }
        // Fallback to first matching even if hidden
        try {
            return document.querySelector(selectors[0]) || document.querySelector('.container, .card, main');
        } catch (e) {
            return document.body;
        }
    }

    function startSpotlightTour(slug) {
        injectSpotlightStyles();

        const steps = FEATURE_SPOTLIGHT_STEPS[slug] || getFallbackSteps();
        activeSteps = steps;
        currentStepIndex = 0;

        renderCurrentStep();
    }

    function renderCurrentStep() {
        if (currentStepIndex >= activeSteps.length) {
            finishTour();
            return;
        }

        const step = activeSteps[currentStepIndex];
        const el = findVisibleTarget(step.target);

        if (!el) {
            // Coba langkah berikutnya jika elemen tidak ditemukan
            currentStepIndex++;
            if (currentStepIndex < activeSteps.length) {
                renderCurrentStep();
            } else {
                finishTour();
            }
            return;
        }

        currentTargetEl = el;

        // Temporarily allow scroll so browser smoothly centers target
        unlockPageScroll();
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });

        setTimeout(() => {
            updateSpotlightAndTooltip(el, step);
            lockPageScroll();
        }, 380);
    }

    function updateSpotlightAndTooltip(el, step) {
        const rect = el.getBoundingClientRect();
        const pad = 8;

        // Buat atau perbarui spotlight kotak sorotan
        if (!activeSpotlight) {
            activeSpotlight = document.createElement('div');
            activeSpotlight.className = 'sft-page-spotlight';
            document.body.appendChild(activeSpotlight);
        }

        activeSpotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
        activeSpotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
        activeSpotlight.style.width = `${rect.width + pad * 2}px`;
        activeSpotlight.style.height = `${rect.height + pad * 2}px`;

        // Buat atau perbarui kartu tooltip petunjuk
        if (!activeTooltip) {
            activeTooltip = document.createElement('div');
            activeTooltip.className = 'sft-page-tooltip-box';
            document.body.appendChild(activeTooltip);
        }

        const isLast = currentStepIndex === activeSteps.length - 1;
        const isFirst = currentStepIndex === 0;

        // Dots
        const dotsHtml = activeSteps.map((_, idx) => `
            <div class="sft-step-dot ${idx === currentStepIndex ? 'active' : ''}"></div>
        `).join('');

        activeTooltip.innerHTML = `
            <div class="sft-page-tooltip-header">
                <span class="sft-page-tooltip-badge">${step.badge}</span>
                <button type="button" class="sft-page-tooltip-close" title="Tutup Tutorial" onclick="window.sftExitSpotlightTour()">&times;</button>
            </div>
            <h3 class="sft-page-tooltip-title"><i class="fa-solid ${step.icon}"></i> ${step.title}</h3>
            <p class="sft-page-tooltip-desc">${step.desc}</p>
            <div class="sft-page-tooltip-footer">
                <button type="button" class="sft-btn-tour-exit-link" onclick="window.sftExitSpotlightTour()">Lewati</button>
                <div class="sft-step-dots">${dotsHtml}</div>
                <div class="sft-page-tour-btn-group">
                    ${!isFirst ? `<button type="button" class="sft-btn-tour-nav sft-btn-tour-prev" onclick="window.sftPrevSpotlightStep()"><i class="fa-solid fa-arrow-left"></i> Mundur</button>` : ''}
                    <button type="button" class="sft-btn-tour-nav sft-btn-tour-next" onclick="window.sftNextSpotlightStep()">
                        ${isLast ? 'Selesai & Paham <i class="fa-solid fa-check"></i>' : 'Lanjut <i class="fa-solid fa-arrow-right"></i>'}
                    </button>
                </div>
            </div>
        `;

        // Atur posisi kartu secara pintar (di bawah elemen jika muat, atau di atas elemen jika terlalu mepet bawah)
        positionTooltipSmart(rect);
    }

    function positionTooltipSmart(rect) {
        if (!activeTooltip) return;
        const pad = 12;
        const winH = window.innerHeight;
        const winW = window.innerWidth;
        const ttWidth = Math.min(390, winW * 0.92);

        // Hitung posisi horizontal (tengah terhadap target, atau tengah layar)
        let left = rect.left + (rect.width / 2) - (ttWidth / 2);
        if (left < 14) left = 14;
        if (left + ttWidth > winW - 14) left = winW - ttWidth - 14;

        // Cek posisi vertikal: apakah muat di bawah elemen?
        let top = rect.bottom + pad + 6;
        if (top + 240 > winH) {
            // Taruh di atas elemen
            top = Math.max(14, rect.top - 240 - pad);
        }

        activeTooltip.style.top = `${top}px`;
        activeTooltip.style.left = `${left}px`;
        activeTooltip.style.width = `${ttWidth}px`;
    }

    function handleReposition() {
        if (activeSpotlight && activeTooltip && currentTargetEl) {
            const rect = currentTargetEl.getBoundingClientRect();
            const pad = 8;
            activeSpotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
            activeSpotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
            activeSpotlight.style.width = `${rect.width + pad * 2}px`;
            activeSpotlight.style.height = `${rect.height + pad * 2}px`;
            positionTooltipSmart(rect);
        }
    }

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, { passive: true });

    function nextStep() {
        currentStepIndex++;
        renderCurrentStep();
    }

    function prevStep() {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    }

    function finishTour() {
        exitTour();
        try {
            localStorage.setItem('sft_page_spotlight_done_' + currentSlug, '1');
        } catch (e) {}
    }

    function exitTour() {
        unlockPageScroll();
        if (activeSpotlight) {
            activeSpotlight.remove();
            activeSpotlight = null;
        }
        if (activeTooltip) {
            activeTooltip.remove();
            activeTooltip = null;
        }
        currentTargetEl = null;
        try {
            localStorage.setItem('sft_page_spotlight_done_' + currentSlug, '1');
        } catch (e) {}
    }

    // =========================================================================
    // 5. INJEKSI TOMBOL HEADER & FLOATING BUTTON
    // =========================================================================
    function injectTriggerButtons() {
        if (currentSlug.includes('login') || currentSlug === 'dashboard_root') return;

        // 1. Tombol di header bilah atas
        const header = document.querySelector('.header-page, header');
        if (header) {
            let rightGroup = header.querySelector('.header-right-group');
            if (!rightGroup) {
                rightGroup = document.createElement('div');
                rightGroup.className = 'header-right-group';
                header.appendChild(rightGroup);
            }

            if (!header.querySelector('#btnHeaderCaraPakai')) {
                const headerBtn = document.createElement('button');
                headerBtn.id = 'btnHeaderCaraPakai';
                headerBtn.className = 'btn-feature-guide-header';
                headerBtn.type = 'button';
                headerBtn.setAttribute('title', 'Mulai tutorial sorotan tombol cara pakai fitur ini');
                headerBtn.innerHTML = `
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>Cara Pakai</span>
                `;
                headerBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    startSpotlightTour(currentSlug);
                });
                rightGroup.prepend(headerBtn);
            }
        }

        // 2. Pastikan tombol floating di area sidebar tidak muncul
        const floatBtn = document.getElementById('sftFloatingFeatureBtn');
        if (floatBtn) {
            floatBtn.remove();
        }
    }

    // =========================================================================
    // 6. AUTO-START ON FIRST VISIT
    // =========================================================================
    function checkAutoStart() {
        if (currentSlug.includes('login') || currentSlug === 'dashboard_root') return;

        try {
            const isDone = localStorage.getItem('sft_page_spotlight_done_' + currentSlug);
            if (!isDone) {
                setTimeout(() => {
                    startSpotlightTour(currentSlug);
                }, 650);
            }
        } catch (e) {}
    }

    // =========================================================================
    // 7. GLOBAL EXPORTS & INITIALIZATION
    // =========================================================================
    window.sftStartSpotlightTour = () => startSpotlightTour(currentSlug);
    window.sftOpenFeatureTutorial = () => startSpotlightTour(currentSlug);
    window.sftNextSpotlightStep = nextStep;
    window.sftPrevSpotlightStep = prevStep;
    window.sftExitSpotlightTour = exitTour;

    function init() {
        injectSpotlightStyles();
        injectTriggerButtons();
        checkAutoStart();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    setTimeout(injectTriggerButtons, 400);
    setTimeout(injectTriggerButtons, 1000);

})();
