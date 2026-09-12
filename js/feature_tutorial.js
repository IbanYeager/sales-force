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
                target: '.ocr-scanner-banner, #btnScanKtp, #btnModeBiasa, #spkNik, #namaCustomer',
                badge: 'Langkah 1 dari 3: Identitas Pembeli',
                icon: 'fa-camera',
                title: '1. Scan KTP / Input Data Pembeli',
                desc: 'Gunakan fitur Smart AI OCR Scanner untuk foto KTP customer agar nama, NIK, dan alamat otomatis terisi seketika.'
            },
            {
                target: '#modelSelect, select#modelSelect, #nominal, #tipePembelian',
                badge: 'Langkah 2 dari 3: Unit & Pembelian',
                icon: 'fa-car-side',
                title: '2. Pilih Tipe Mobil Toyota',
                desc: 'Pilih model kendaraan yang dipesan customer, sistem otomatis menampilkan harga OTR resmi dan opsi Cash / Kredit.'
            },
            {
                target: '#signatureCanvas, canvas#signatureCanvas, button[onclick*="submitSpk"], button.btn-main',
                badge: 'Langkah 3 dari 3: Tanda Tangan & Submit',
                icon: 'fa-signature',
                title: '3. Tanda Tangan & Kirim ke SPV',
                desc: 'Minta tanda tangan customer langsung di layar, lalu tekan tombol Submit SPK Lengkap agar berkas masuk ke meja SPV untuk di-ACC.'
            }
        ],

        // ── KALKULATOR MULTI-LEASING ─────────────────────────────────────────
        'kalkulator': [
            {
                target: '#selectModel, select#selectModel, .finance-tab-wrapper',
                badge: 'Langkah 1 dari 3: Pilih Model Mobil',
                icon: 'fa-car',
                title: '1. Pilih Model Toyota & Harga OTR',
                desc: 'Pilih tipe mobil Toyota yang diinginkan pembeli untuk memuat harga OTR resmi dan paket angsuran.'
            },
            {
                target: '#rangeTdp, .dp-chips, .tenor-tabs, #inputTdp',
                badge: 'Langkah 2 dari 3: Atur DP & Tenor',
                icon: 'fa-sliders',
                title: '2. Sesuaikan DP & Tenor Cicilan',
                desc: 'Geser slider DP atau pilih tombol persentase (20%, 25%, 30%) dan pilih tenor 1 s/d 6 tahun sesuai kesanggupan customer.'
            },
            {
                target: '#resultCard, button[onclick*="proceedSimulationToSpk"], .result-amount',
                badge: 'Langkah 3 dari 3: Hasil & Aksi Cepat',
                icon: 'fa-file-invoice-dollar',
                title: '3. Hasil Simulasi & Teruskan ke SPK',
                desc: 'Lihat nominal cicilan bulanan. Jika pembeli setuju, langsung tekan [Ajukan SPK dengan Simulasi Ini] tanpa perlu hitung ulang!'
            }
        ],

        // ── CUSTOMER CRM PIPELINE ────────────────────────────────────────────
        'customer': [
            {
                target: 'button[onclick*="openAddCustomerModal"], #searchCustomer, .card:first-child .form-group',
                badge: 'Langkah 1 dari 3: Tambah Prospek',
                icon: 'fa-user-plus',
                title: '1. Tambah Calon Pembeli Baru',
                desc: 'Tekan tombol plus (+) untuk mencatat data prospek baru (nama, no. WhatsApp, dan tipe mobil incaran) ke database CRM.'
            },
            {
                target: '#followupList, button[onclick*="openFollowupModal"], .card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Jadwal Follow-Up',
                icon: 'fa-calendar-check',
                title: '2. Pengingat Follow-Up & Dikte Suara',
                desc: 'Lihat daftar prospek yang harus dihubungi hari ini dan tambahkan pengingat follow-up dengan fitur rekam suara.'
            },
            {
                target: '#kanbanBoard, .kanban-board',
                badge: 'Langkah 3 dari 3: Pipeline Penjualan',
                icon: 'fa-arrows-left-right',
                title: '3. Geser Status di Papan Pipeline',
                desc: 'Geser kartu customer antar tahapan (Cold ➔ Warm ➔ Hot ➔ SPK ➔ DO) untuk memantau progres closing penjualan Anda.'
            }
        ],

        // ── PRICELIST OTR ───────────────────────────────────────────────────
        'pricelist': [
            {
                target: '#searchInput, .search-wrap',
                badge: 'Langkah 1 dari 3: Cari Tipe Mobil',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Varian Mobil',
                desc: 'Ketik nama tipe mobil (misal: Zenix, Avanza, Veloz, Calya, Hilux) untuk melihat baris harga OTR seketika.'
            },
            {
                target: '#btnToggleMultiSelect, button[onclick*="openFilterModal"], #btnExportPricelist',
                badge: 'Langkah 2 dari 3: Filter & Multi-Share',
                icon: 'fa-list-check',
                title: '2. Fitur Pilih Banyak & Download',
                desc: 'Gunakan tombol [Pilih Banyak] untuk membagikan beberapa varian sekaligus ke WhatsApp pembeli, atau unduh daftar harga.'
            },
            {
                target: '#pricelistContainer, .section-header-row',
                badge: 'Langkah 3 dari 3: Simulasi Cepat',
                icon: 'fa-calculator',
                title: '3. Bawa Langsung ke Simulasi Kredit',
                desc: 'Setiap baris mobil memiliki tombol aksi untuk langsung membawa harga OTR ke kalkulator kredit atau kirim brosur.'
            }
        ],

        // ── LIVE INVENTORY (STOK GUDANG) ────────────────────────────────────
        'inventory': [
            {
                target: '.quick-chips-wrapper, #searchInput',
                badge: 'Langkah 1 dari 3: Kategori & Filter Unit',
                icon: 'fa-filter',
                title: '1. Filter Model & Kategori',
                desc: 'Pilih kategori mobil (Ready Stock, MPV, SUV, Commercial) atau ketik warna dan tipe mobil yang dicari customer.'
            },
            {
                target: '.inv-stats-grid, .stat-ready',
                badge: 'Langkah 2 dari 3: Pantau Unit Siap Jual',
                icon: 'fa-circle-check',
                title: '2. Cek Total Unit Ready Stock',
                desc: 'Pantau jumlah unit siap jual (Free Stock). Unit berstatus hijau siap langsung diproses untuk pengiriman kilat.'
            },
            {
                target: '.btn-filter-square, .btn-refresh-pill, .inv-toolbar-card',
                badge: 'Langkah 3 dari 3: Refresh & Kunci Unit',
                icon: 'fa-rotate-right',
                title: '3. Segarkan Data & Kunci Rangka',
                desc: 'Segarkan data stok gudang kapan saja dan salin Nomor Rangka unit yang ready untuk langsung dipasangkan ke form SPK.'
            }
        ],

        // ── TEST DRIVE ──────────────────────────────────────────────────────
        'testdrive': [
            {
                target: '.td-tabs-nav, #tabBtnCabang',
                badge: 'Langkah 1 dari 3: Pilihan Armada',
                icon: 'fa-building-flag',
                title: '1. Unit Dealer atau Mitra Rental',
                desc: 'Pilih antara armada resmi showroom cabang atau armada kemitraan rental (TRAC) jika mobil tertentu sedang dipakai.'
            },
            {
                target: '#selectedBanner, #unitList, #viewUnits',
                badge: 'Langkah 2 dari 3: Pilih Mobil',
                icon: 'fa-car',
                title: '2. Pilih Mobil yang Ingin Dicoba',
                desc: 'Ketuk mobil Toyota yang diminati pembeli untuk melihat ketersediaan jam dan status unit.'
            },
            {
                target: '.btn-banner-ajukan, button[onclick*="openModal"]',
                badge: 'Langkah 3 dari 3: Jadwalkan Test Drive',
                icon: 'fa-calendar-plus',
                title: '3. Ajukan Jadwal Uji Coba',
                desc: 'Tekan Ajukan Jadwal untuk menentukan jam temu bersama calon pembeli (di showroom dealer atau diantar ke rumah).'
            }
        ],

        // ── TRADE-IN (TUKAR TAMBAH) ─────────────────────────────────────────
        'tradein': [
            {
                target: '#trMerk, #trModel, .trade-container .card:first-child',
                badge: 'Langkah 1 dari 3: Data Mobil Lama',
                icon: 'fa-car-side',
                title: '1. Masukkan Spesifikasi Mobil Lama',
                desc: 'Pilih merek, ketik tipe model, tahun pembuatan, dan kondisi mobil bekas milik konsumen yang ingin ditukar tambah.'
            },
            {
                target: '#trTargetModel, #trDpTargetPct, #trSubsidiTradeIn',
                badge: 'Langkah 2 dari 3: Mobil Toyota Baru',
                icon: 'fa-cart-shopping',
                title: '2. Tentukan Mobil Toyota Baru & Subsidi',
                desc: 'Pilih mobil Toyota baru incaran pembeli. Sistem otomatis menambahkan subsidi trade-in resmi dari Tunas Toyota.'
            },
            {
                target: '.val-card, button[onclick*="proceedTradeInToSpk"], button[onclick*="shareTradeInWA"]',
                badge: 'Langkah 3 dari 3: Appraisal & Potong DP',
                icon: 'fa-circle-dollar-to-slot',
                title: '3. Terapkan Nilai Mobil Lama ke DP SPK',
                desc: 'Nilai bersih mobil lama otomatis menutup uang muka (DP). Tekan tombol gunakan untuk SPK agar otomatis terpotong!'
            }
        ],

        // ── DELIVERY ORDER (DO) ─────────────────────────────────────────────
        'do': [
            {
                target: '#spkSelect, select#spkSelect',
                badge: 'Langkah 1 dari 3: Pilih Berkas SPK',
                icon: 'fa-file-circle-check',
                title: '1. Pilih Customer yang Siap DO',
                desc: 'Pilih berkas SPK customer yang sudah lunas atau sudah terbit PO leasing dari menu pilihan ini.'
            },
            {
                target: '#namaCustomer, #model, #nominal',
                badge: 'Langkah 2 dari 3: Data Otomatis Terisi',
                icon: 'fa-address-card',
                title: '2. Periksa Detail Pemesanan',
                desc: 'Nama pembeli, no handphone, tipe kendaraan Toyota, dan nominal harga akan otomatis terisi rapi oleh sistem.'
            },
            {
                target: 'button[onclick*="submitDo"], .btn-main, #spkList',
                badge: 'Langkah 3 dari 3: Penerbitan DO',
                icon: 'fa-paper-plane',
                title: '3. Terbitkan Delivery Order (DO)',
                desc: 'Tekan tombol Submit DO agar tim logistik cabang langsung mempersiapkan pengantaran unit ke rumah customer.'
            }
        ],

        // ── DELIVERY CEREMONY ───────────────────────────────────────────────
        'delivery_ceremony': [
            {
                target: '#delNamaCustomer, #delModelUnit, .card-custom:first-of-type',
                badge: 'Langkah 1 dari 3: Identitas Customer',
                icon: 'fa-user-check',
                title: '1. Isi Data Serah Terima',
                desc: 'Ketik nama customer, nomor telepon, tipe mobil, serta nomor rangka dan nomor mesin mobil yang diserahkan.'
            },
            {
                target: '#pdiChecklistContainer, .card-custom:nth-of-type(2)',
                badge: 'Langkah 2 dari 3: PDI Checklist',
                icon: 'fa-list-check',
                title: '2. Periksa Kelengkapan Mobil Bersama Customer',
                desc: 'Centang checklist fisik bersama customer: STNK, buku garansi T-Care, kunci cadangan, APAR, karpet, dan kelistrikan.'
            },
            {
                target: '#delSigCanvas, button[onclick*="submitDeliveryCeremony"]',
                badge: 'Langkah 3 dari 3: Sertifikat Digital',
                icon: 'fa-certificate',
                title: '3. Tanda Tangan & Terbitkan Sertifikat',
                desc: 'Minta tanda tangan customer di layar, lalu terbitkan Sertifikat Digital resmi bertanda tangan dan bagikan ke WA pembeli!'
            }
        ],

        // ── INPUT AKTIVITAS ─────────────────────────────────────────────────
        'input': [
            {
                target: '#jenisAktivitas, select#jenisAktivitas, #durasiAktivitas',
                badge: 'Langkah 1 dari 3: Jenis Kegiatan',
                icon: 'fa-list-check',
                title: '1. Pilih Kategori Aktivitas',
                desc: 'Pilih jenis kegiatan yang baru saja Anda lakukan (Digital Marketing, Walk-in, Pameran, Canvassing, Follow-up Database, dll).'
            },
            {
                target: '#uploadButtonBox, #photoGrid, .photo-grid, .lokasi-box',
                badge: 'Langkah 2 dari 3: Foto & GPS',
                icon: 'fa-camera',
                title: '2. Ambil Foto di Lokasi (GPS Otomatis)',
                desc: 'Ketuk tombol kamera untuk mengambil foto dokumentasi di lapangan. Titik GPS dan jam kehadiran otomatis terkunci.'
            },
            {
                target: '#btnSubmit, button#btnSubmit, button[onclick*="simpanAktivitasBaru"]',
                badge: 'Langkah 3 dari 3: Lapor ke SPV',
                icon: 'fa-paper-plane',
                title: '3. Simpan & Laporkan ke Supervisor',
                desc: 'Tuliskan catatan hasil obrolan atau gunakan tombol Dikte Suara, lalu tekan Simpan Aktivitas agar langsung terlaporkan ke SPV!'
            }
        ],

        // ── AO REPORT ───────────────────────────────────────────────────────
        'ao_report': [
            {
                target: '.ao-closing-hero, .ao-closing-grid, #aoBoardMainContainer .ao-closing-hero',
                badge: 'Langkah 1 dari 3: Estimasi Closing',
                icon: 'fa-flag-checkered',
                title: '1. Pantau Estimasi Closing Cabang',
                desc: 'Lihat target DO cabang bulan ini, alokasi matching OS, proyeksi SPK baru, dan rasio efisiensi penyerahan unit.'
            },
            {
                target: '.ao-quad-card:first-child, .ao-stock-bars-row, #aoBoardMainContainer .ao-quad-card',
                badge: 'Langkah 2 dari 3: Stock Matching & Ritme',
                icon: 'fa-boxes-stacked',
                title: '2. Periksa Free Stock & Ritme 5-Harian',
                desc: 'Cek perbandingan Free Stock vs Matched Stock serta grafik tangga ritme target pengiriman 5-harian MTD.'
            },
            {
                target: '.ao-quad-card:nth-child(2), #btnAoSendWA, .ao-actions-toolbar',
                badge: 'Langkah 3 dari 3: SPK Plan & Broadcast',
                icon: 'fa-file-signature',
                title: '3. Evaluasi SPK Plan & Broadcast WA',
                desc: 'Pantau pencapaian SPK per periode dan gunakan tombol Broadcast WA di atas untuk membagikan ringkasan AO Report ini.'
            }
        ],

        // ── TARGET & PENCAPAIAN ─────────────────────────────────────────────
        'target': [
            {
                target: '.btn-input-achievement, button[onclick*="openInputModal"]',
                badge: 'Langkah 1 dari 3: Input Pencapaian',
                icon: 'fa-circle-plus',
                title: '1. Laporkan SPK & DO Baru',
                desc: 'Tekan tombol ini setiap kali Anda berhasil closing untuk menambahkan realisasi angka SPK atau mobil DO Anda.'
            },
            {
                target: '#circleProgressSpk, .target-card:first-of-type',
                badge: 'Langkah 2 dari 3: Pantau Target SPK',
                icon: 'fa-file-invoice',
                title: '2. Pantau Target SPK Bulan Ini',
                desc: 'Lihat persentase pencapaian, sisa unit yang harus dikejar, serta input rencana unit (plan SPK) bulan ini.'
            },
            {
                target: '#circleProgressDoBulan, .target-card:nth-of-type(2)',
                badge: 'Langkah 3 dari 3: Target Penyerahan DO',
                icon: 'fa-boxes-packing',
                title: '3. Pantau Target DO & Evaluasi',
                desc: 'Pastikan seluruh SPK yang sudah closing segera terkirim (DO) sebelum akhir bulan untuk memaksimalkan insentif.'
            }
        ],

        // ── DIGITAL SMART CARD ──────────────────────────────────────────────
        'digital_card': [
            {
                target: '.card-preview-box, .profile-section',
                badge: 'Langkah 1 dari 3: Kartu Nama Pintar',
                icon: 'fa-id-badge',
                title: '1. Desain Kartu Nama Digital Resmi',
                desc: 'Kartu nama digital resmi berlogo Toyota lengkap dengan foto profil, nomor kontak, dan badge verifikasi cabang.'
            },
            {
                target: '.action-btn-grid, .action-card-btn.btn-green',
                badge: 'Langkah 2 dari 3: Kontak 1-Klik',
                icon: 'fa-bolt',
                title: '2. Tombol Hubungi Cepat',
                desc: 'Konsumen yang membuka link kartu nama Anda dapat langsung chat WhatsApp, telepon, atau simpan kontak dalam 1-klik.'
            },
            {
                target: '.studio-right-card, .studio-tabs',
                badge: 'Langkah 3 dari 3: Pengaturan & Bagikan',
                icon: 'fa-share-nodes',
                title: '3. Sesuaikan Konten & Bagikan',
                desc: 'Atur tautan brosur, katalog mobil, dan bagikan link kartu nama Anda ke status WhatsApp atau media sosial.'
            }
        ],

        // ── E-CATALOG & BROSUR ──────────────────────────────────────────────
        'elibrary': [
            {
                target: '#searchInput, .form-group',
                badge: 'Langkah 1 dari 3: Cari Mobil',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Brosur & Spesifikasi',
                desc: 'Ketik nama mobil Toyota yang ingin dilihat spesifikasinya atau yang ditanyakan oleh calon pembeli.'
            },
            {
                target: '#categoryFilters, .cat-btn',
                badge: 'Langkah 2 dari 3: Kategori Mobil',
                icon: 'fa-layer-group',
                title: '2. Filter Tipe Kendaraan',
                desc: 'Pilih kategori MPV, SUV, Hatchback, Sedan, atau Commercial untuk menyaring daftar brosur dengan cepat.'
            },
            {
                target: '#libGrid, .elib-unified-grid',
                badge: 'Langkah 3 dari 3: Bagikan ke Customer',
                icon: 'fa-share-nodes',
                title: '3. Kirim Brosur PDF Resmi ke Konsumen',
                desc: 'Ketuk tombol bagikan pada kartu mobil untuk langsung mengirimkan file PDF brosur resmi Toyota ke WhatsApp customer.'
            }
        ],

        // ── BATTLE CARD & OBJECTION HANDLING ────────────────────────────────
        'battle_card': [
            {
                target: '.battle-tab-nav, #tabBtnObjection',
                badge: 'Langkah 1 dari 3: Pilihan Topik',
                icon: 'fa-shield-halved',
                title: '1. Menjawab Keberatan vs Battle Card',
                desc: 'Pilih antara skrip menjawab keberatan customer (diskon, inden, hybrid) atau tabel adu spek vs mobil kompetitor.'
            },
            {
                target: '#searchBattleInput, .card:has(#searchBattleInput)',
                badge: 'Langkah 2 dari 3: Cari Skrip Kilat',
                icon: 'fa-magnifying-glass',
                title: '2. Cari Contekan Jawaban',
                desc: 'Ketik kata kunci keberatan customer (contoh: "diskon sebelah lebih besar", "baterai hybrid", "inden lama").'
            },
            {
                target: '.objection-accordion:first-child, .btn-copy-script',
                badge: 'Langkah 3 dari 3: Salin Teks Bicara',
                icon: 'fa-copy',
                title: '3. Pola Pikir & Salin Skrip Bicara',
                desc: 'Pelajari cara membalikkan keberatan pembeli dan tekan [Salin Skrip Bicara] untuk dikirim ke chat customer.'
            }
        ],

        // ── CHECK-IN KUNJUNGAN ──────────────────────────────────────────────
        'checkin': [
            {
                target: '.geo-card:first-child, .geo-header-flex, #liveGpsCoordinates',
                badge: 'Langkah 1 dari 3: Akurasi GPS',
                icon: 'fa-location-dot',
                title: '1. Kunci Koordinat Lokasi',
                desc: 'Sistem mendeteksi titik koordinat satelit GPS secara akurat untuk memverifikasi kehadiran Anda di lokasi prospek.'
            },
            {
                target: '.photo-uploader-box, #lokasiInput, .geo-card:nth-child(2)',
                badge: 'Langkah 2 dari 3: Foto Kunjungan',
                icon: 'fa-camera',
                title: '2. Ambil Foto di Lapangan',
                desc: 'Ambil foto suasana saat bertemu customer, kanvasing, atau pameran sebagai bukti laporan resmi.'
            },
            {
                target: '.btn-submit-action, button#btnSubmitCheckin',
                badge: 'Langkah 3 dari 3: Kirim Check-In',
                icon: 'fa-paper-plane',
                title: '3. Kirim Check-In ke Dashboard SPV',
                desc: 'Tekan tombol Kirim Check-In agar data kunjungan Anda langsung tercatat rapi di peta monitoring Supervisor.'
            }
        ],

        // ── RETENTION & AFTER-SALES ─────────────────────────────────────────
        'retention': [
            {
                target: '.kpi-grid, .kpi-card:first-child',
                badge: 'Langkah 1 dari 3: KPI Retensi',
                icon: 'fa-chart-pie',
                title: '1. Pantau Konsumen Jatuh Tempo',
                desc: 'Lihat ringkasan customer yang masuk jadwal servis berkala T-Care, perpanjangan STNK, asuransi, dan potensi trade-in.'
            },
            {
                target: '.retention-tabs, #tabTcare, .card:first-child',
                badge: 'Langkah 2 dari 3: Filter Kategori',
                icon: 'fa-filter',
                title: '2. Pilih Kategori Pengingat',
                desc: 'Pilih jenis layanan purna jual yang ingin Anda tindak lanjuti untuk menjaga hubungan baik dengan customer lama.'
            },
            {
                target: '#retentionListContainer, .btn-action-wa, .retention-card',
                badge: 'Langkah 3 dari 3: Sapa Konsumen',
                icon: 'fa-brands fa-whatsapp',
                title: '3. Sapa Konsumen Lewat WhatsApp',
                desc: 'Gunakan tombol WhatsApp di samping nama customer untuk mengirim pesan ramah pengingat servis yang sudah disiapkan sistem.'
            }
        ],

        // ── POLISI REGIONAL (POLREG) ────────────────────────────────────────
        'polreg': [
            {
                target: '.polreg-tab-bar, .district-hero',
                badge: 'Langkah 1 dari 3: Wilayah Polreg',
                icon: 'fa-map',
                title: '1. Peta Penugasan Wilayah',
                desc: 'Pantau pembagian area dan batas wilayah regional operasional penjualan cabang Tunas Toyota Kiara Condong.'
            },
            {
                target: '.stat-grid-3, .stat-card-sm:first-child',
                badge: 'Langkah 2 dari 3: Potensi Pasar',
                icon: 'fa-chart-simple',
                title: '2. Analisis Potensi Pasar per Kecamatan',
                desc: 'Lihat data jumlah populasi kendaraan dan potensi prospek penjualan mobil baru di masing-masing kecamatan.'
            },
            {
                target: '#polregMap, #districtList, .card:has(#polregMap)',
                badge: 'Langkah 3 dari 3: Peta Wilayah',
                icon: 'fa-location-dot',
                title: '3. Eksplorasi Peta & Target Penetrasi',
                desc: 'Gunakan peta interaktif ini untuk memetakan rute kanvasing dan fokus penyerangan pasar kompetitor.'
            }
        ],

        // ── WA SALES STUDIO ─────────────────────────────────────────────────
        'wa_studio': [
            {
                target: '.template-card:first-child, .wa-container > div:first-child',
                badge: 'Langkah 1 dari 3: Pilih Template Skrip',
                icon: 'fa-comments',
                title: '1. Pilih Skrip Sesuai Kebutuhan',
                desc: 'Pilih template siap pakai: Ucapan Perkenalan, Follow-up Promo Baru, Undangan Test Drive, atau Reminder SPK.'
            },
            {
                target: '.styled-input, #inCustomerName, #inModelName',
                badge: 'Langkah 2 dari 3: Personalisasi Data',
                icon: 'fa-user-pen',
                title: '2. Isi Nama & Mobil Incaran Customer',
                desc: 'Ketik nama customer dan tipe mobil, pesan WhatsApp akan otomatis tersusun rapi dengan bahasa yang sopan dan persuasif.'
            },
            {
                target: '.wa-preview-box, button.btn-send-wa, button[onclick*="sendWhatsApp"]',
                badge: 'Langkah 3 dari 3: Preview & Kirim',
                icon: 'fa-paper-plane',
                title: '3. Pratinjau & Kirim Langsung ke WA',
                desc: 'Periksa pratinjau pesan di gelembung hijau, lalu tekan Kirim ke WhatsApp untuk langsung membuka aplikasi WA!'
            }
        ],

        // ── PUSAT NOTIFIKASI ────────────────────────────────────────────────
        'notifikasi': [
            {
                target: '.notif-summary-card, .stat-pill-group',
                badge: 'Langkah 1 dari 3: Status Notifikasi',
                icon: 'fa-bell',
                title: '1. Ringkasan Pemberitahuan Baru',
                desc: 'Pantau jumlah pesan baru yang belum dibaca dari Supervisor, persetujuan SPK, maupun pengingat sistem.'
            },
            {
                target: '.notif-actions, .btn-notif-action.read-all',
                badge: 'Langkah 2 dari 3: Kelola Notifikasi',
                icon: 'fa-envelope-open',
                title: '2. Tandai Dibaca & Bersihkan',
                desc: 'Gunakan tombol aksi cepat untuk menandai semua notifikasi sudah dibaca atau membersihkan riwayat pesan.'
            },
            {
                target: '#notifList, .notif-card-item:first-child',
                badge: 'Langkah 3 dari 3: Detail Pesan',
                icon: 'fa-list',
                title: '3. Ketuk Pesan untuk Membuka Detail',
                desc: 'Ketuk salah satu notifikasi untuk langsung diarahkan ke halaman SPK, Approval, atau data customer terkait.'
            }
        ],

        // ── PROFIL WIRANIAGA ────────────────────────────────────────────────
        'profil': [
            {
                target: '.card:first-of-type, #namaSalesEl',
                badge: 'Langkah 1 dari 3: Identitas Wiraniaga',
                icon: 'fa-user',
                title: '1. Data Akun Sales Consultant',
                desc: 'Profil nama lengkap, peran/jabatan, cabang resmi, dan supervisor yang membawahi Anda di Tunas Toyota.'
            },
            {
                target: '#socialLinksContainer, .card:has(#socialLinksContainer)',
                badge: 'Langkah 2 dari 3: Akun Media Sosial',
                icon: 'fa-share-nodes',
                title: '2. Integrasi Akun Sosmed Sales',
                desc: 'Akun Instagram, TikTok, dan Facebook Anda otomatis tercantum saat Anda membagikan promo dan simulasi kredit ke konsumen.'
            },
            {
                target: 'button[onclick*="openEditProfilModal"], #btnPwaInstallProfil',
                badge: 'Langkah 3 dari 3: Edit Profil & PWA',
                icon: 'fa-user-pen',
                title: '3. Edit Profil & Pasang Aplikasi',
                desc: 'Perbarui nomor kontak dan link sosmed Anda di sini, serta instal aplikasi SFT ke layar utama HP Anda.'
            }
        ],

        // ── APPROVAL PENGAJUAN ──────────────────────────────────────────────
        'approval': [
            {
                target: '.approval-stats, .stat-chip:first-child',
                badge: 'Langkah 1 dari 3: Status Pengajuan',
                icon: 'fa-clipboard-check',
                title: '1. Pantau Status Berkas SPK',
                desc: 'Lihat rekapitulasi jumlah berkas pengajuan SPK Anda yang masih Pending, sudah Disetujui, atau Ditolak oleh SPV.'
            },
            {
                target: '.filter-tabs, .filter-tab:first-child',
                badge: 'Langkah 2 dari 3: Filter Berkas',
                icon: 'fa-filter',
                title: '2. Saring Berkas Pengajuan',
                desc: 'Pilih tab Menunggu, Disetujui, atau Ditolak untuk memeriksa catatan alasan revisi dari Supervisor.'
            },
            {
                target: '#approvalList, .card:first-child',
                badge: 'Langkah 3 dari 3: Riwayat Berkas',
                icon: 'fa-folder-open',
                title: '3. Cek Riwayat & Keputusan SPV',
                desc: 'Buka kartu customer untuk melihat nomor SPK resmi yang telah disetujui atau melengkapi berkas yang diminta SPV.'
            }
        ],

        // ── TOYOTA SAFETY SENSE (TSS SIMULATOR) ─────────────────────────────
        'tss-simulator': [
            {
                target: '.tss-tabs-row, .tss-tab-btn:first-child',
                badge: 'Langkah 1 dari 3: Fitur Keselamatan',
                icon: 'fa-shield-halved',
                title: '1. Pilih Fitur TSS (Toyota Safety Sense)',
                desc: 'Pilih teknologi radar canggih: PCS (Pre-Collision System), DRCC (Radar Cruise Control), LDA (Lane Departure), dll.'
            },
            {
                target: '.tss-hero-section, #tssRadarCanvas, .tss-display-box',
                badge: 'Langkah 2 dari 3: Visual Radar Interaktif',
                icon: 'fa-radar',
                title: '2. Demonstrasi Radar Mobil ke Customer',
                desc: 'Tunjukkan kepada calon pembeli bagaimana sensor monokular kamera & radar gelombang milimeter Toyota bekerja mencegah benturan.'
            },
            {
                target: '.btn-trigger-tss, .tss-action-btn, button.btn-main',
                badge: 'Langkah 3 dari 3: Simulasi Nyata',
                icon: 'fa-play',
                title: '3. Jalankan Skenario Bahaya',
                desc: 'Tekan tombol simulasi untuk memicu animasi pengereman otomatis saat ada rintangan mendadak di jalan raya.'
            }
        ],

        // ── SPV: MONITORING WIRANIAGA ───────────────────────────────────────
        'spv_wiraniaga': [
            {
                target: '#searchSales, input[type="text"]',
                badge: 'Langkah 1 dari 3: Cari Sales',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Wiraniaga Binaan',
                desc: 'Ketik nama wiraniaga untuk memeriksa status kehadiran, aktivitas harian, dan pencapaian target SPK/DO.'
            },
            {
                target: '.stat-container, .card:first-child',
                badge: 'Langkah 2 dari 3: Rekap Performa',
                icon: 'fa-chart-line',
                title: '2. Rekapitulasi Tim Supervisor',
                desc: 'Pantau total realisasi SPK tim, rasio konversi prospek, dan tingkat keaktifan wiraniaga di lapangan.'
            },
            {
                target: '.table-wiraniaga, table, .table-container',
                badge: 'Langkah 3 dari 3: Evaluasi & Coaching',
                icon: 'fa-user-check',
                title: '3. Detail & Tindakan Pembinaan',
                desc: 'Ketuk baris wiraniaga untuk memberikan catatan evaluasi coaching, peringatan aktivitas, atau reward closing.'
            }
        ],

        // ── SPV: MONITORING AKTIVITAS ───────────────────────────────────────
        'spv_aktivitas': [
            {
                target: '#filterTanggal, .filter-bar, input[type="date"]',
                badge: 'Langkah 1 dari 3: Filter Waktu',
                icon: 'fa-calendar-day',
                title: '1. Saring Tanggal Aktivitas',
                desc: 'Pilih tanggal untuk melihat rekap riwayat kunjungan lapangan, canvassing, dan pameran seluruh sales.'
            },
            {
                target: '.activity-table, table, .table-container',
                badge: 'Langkah 2 dari 3: Log Laporan Sales',
                icon: 'fa-list-check',
                title: '2. Periksa Foto & Titik GPS',
                desc: 'Lihat foto kegiatan lapangan dan verifikasi koordinat lokasi geotagging setiap wiraniaga secara real-time.'
            },
            {
                target: '.stat-box, .card:first-child',
                badge: 'Langkah 3 dari 3: Rekap Kepatuhan',
                icon: 'fa-circle-check',
                title: '3. Evaluasi Kepatuhan Laporan',
                desc: 'Pastikan seluruh wiraniaga memenuhi batas minimal input aktivitas harian sebelum jam kerja berakhir.'
            }
        ],

        // ── KACAB: MONITORING SPV ───────────────────────────────────────────
        'kacab_monitoring_spv': [
            {
                target: '#filterBulan, select',
                badge: 'Langkah 1 dari 3: Filter Periode',
                icon: 'fa-calendar-days',
                title: '1. Pilih Periode Kerja Cabang',
                desc: 'Saring evaluasi performa bulanan antar tim Supervisor (SPV) di cabang Tunas Toyota Kiara Condong.'
            },
            {
                target: '.spv-card, .card:first-child',
                badge: 'Langkah 2 dari 3: Kartu Performa SPV',
                icon: 'fa-users-gear',
                title: '2. Perbandingan Realisasi Antar Tim',
                desc: 'Lihat perbandingan kontribusi SPK, rasio pengiriman DO, dan kecepatan approval berkas per grup supervisor.'
            },
            {
                target: '.table-spv, table, .table-container',
                badge: 'Langkah 3 dari 3: Tabel Evaluasi Eksekutif',
                icon: 'fa-table-list',
                title: '3. Analisis Produktivitas Cabang',
                desc: 'Evaluasi produktivitas rata-rata per wiraniaga dalam tim untuk bahan rapat koordinasi mingguan.'
            }
        ],

        // ── KACAB: TARGET CABANG ────────────────────────────────────────────
        'kacab_target_kacab': [
            {
                target: '.kacab-hero, .card:first-child',
                badge: 'Langkah 1 dari 3: Target Bulanan Cabang',
                icon: 'fa-bullseye',
                title: '1. Pantau Target Penjualan Cabang',
                desc: 'Lihat target penjualan unit mobil Toyota cabang Kiara Condong dari TAM (Toyota Astra Motor) dan Tunas Pusat.'
            },
            {
                target: '.target-grid, .stat-grid',
                badge: 'Langkah 2 dari 3: Breakdown SPK & DO',
                icon: 'fa-chart-pie',
                title: '2. Rincian SPK vs DO Terkirim',
                desc: 'Pantau sisa target unit yang harus ditutup dan gap antara SPK masuk dengan ketersediaan alokasi DO.'
            },
            {
                target: '#btnSetTarget, .btn-main, button',
                badge: 'Langkah 3 dari 3: Distribusi Target',
                icon: 'fa-sliders',
                title: '3. Distribusi Target ke Tim SPV',
                desc: 'Gunakan panel ini untuk mendistribusikan kuota target SPK dan DO secara adil ke masing-masing Supervisor.'
            }
        ]
    };

    // Generic fallback steps for any other pages
    function getFallbackSteps() {
        return [
            {
                target: 'input:not([type="hidden"]), select, .search-box, .filter-bar, .card:first-child',
                badge: 'Langkah 1 dari 3: Filter / Input',
                icon: 'fa-magnifying-glass',
                title: '1. Masukkan Parameter / Filter',
                desc: 'Gunakan kolom pencarian, filter, atau input formulir di bagian atas untuk menyaring data yang Anda perlukan.'
            },
            {
                target: 'table, .table-container, .card:nth-child(2), .card, .grid-container',
                badge: 'Langkah 2 dari 3: Tinjau Informasi',
                icon: 'fa-table-list',
                title: '2. Tinjau Ringkasan Informasi',
                desc: 'Periksa baris data, grafik, atau kartu status yang tersaji di layar secara seksama.'
            },
            {
                target: 'button.btn-main, button.btn-primary, button[type="submit"], .btn-action, button:last-of-type',
                badge: 'Langkah 3 dari 3: Tombol Aksi Utama',
                icon: 'fa-circle-check',
                title: '3. Tekan Tombol Aksi',
                desc: 'Tekan tombol aksi untuk memproses data, menyimpan perubahan formulir, atau membagikan laporan.'
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
            .sft-page-tooltip-box {
                position: fixed;
                background: #ffffff;
                border-radius: 18px;
                padding: 14px 18px;
                width: min(380px, 92vw);
                max-height: calc(100vh - 24px);
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
                border: 2px solid #e2e8f0;
                z-index: 999998;
                box-sizing: border-box;
                transition: top 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
            }
            .sft-page-tooltip-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 6px;
            }
            .sft-page-tooltip-badge {
                font-size: 10.5px;
                font-weight: 800;
                background: #fee2e2;
                color: #d71920;
                padding: 3px 9px;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
            }
            .sft-page-tooltip-close {
                background: transparent;
                border: none;
                color: #94a3b8;
                font-size: 20px;
                cursor: pointer;
                padding: 0 4px;
                line-height: 1;
                border-radius: 8px;
                transition: all 0.15s;
            }
            .sft-page-tooltip-close:hover {
                color: #ef4444;
                background: #f1f5f9;
            }
            .sft-page-tooltip-title {
                font-size: 15.5px;
                font-weight: 800;
                color: #0f172a;
                margin: 0 0 5px;
                display: flex;
                align-items: center;
                gap: 7px;
                line-height: 1.25;
            }
            .sft-page-tooltip-title i {
                color: #d71920;
                font-size: 16px;
            }
            .sft-page-tooltip-desc {
                font-size: 13px;
                color: #334155;
                line-height: 1.45;
                margin: 0 0 10px;
            }
            .sft-page-tooltip-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                padding-top: 8px;
                border-top: 1px solid #f1f5f9;
            }
            .sft-btn-tour-exit-link {
                background: transparent;
                border: none;
                color: #94a3b8;
                font-size: 12px;
                font-weight: 700;
                cursor: pointer;
                text-decoration: underline;
                padding: 4px 6px;
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
                padding: 8px 15px;
                border-radius: 9px;
                font-size: 12.5px;
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

    function isExcludedTourElement(el) {
        if (!el) return true;
        return !!el.closest('.desktop-sidebar, .sidebar, .sidebar-bottom, .sidebar-nav-link, .spv-sidebar, .kcb-sidebar, .bottom-nav, .sft-page-tooltip-box, .sft-page-spotlight, #sftScrollToTopBtn');
    }

    function findVisibleTarget(selectorString) {
        if (!selectorString) return null;
        const selectors = selectorString.split(',').map(s => s.trim());

        const contentRoots = [
            document.querySelector('.desktop-content'),
            document.querySelector('.spv-main'),
            document.querySelector('.kcb-main'),
            document.querySelector('.mobile-app'),
            document.querySelector('main'),
            document.body
        ].filter(Boolean);

        for (let sel of selectors) {
            for (let root of contentRoots) {
                try {
                    const els = root.querySelectorAll(sel);
                    for (let el of els) {
                        if (el && !isExcludedTourElement(el)) {
                            const style = window.getComputedStyle(el);
                            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                                const rect = el.getBoundingClientRect();
                                if (rect.width > 12 && rect.height > 12) {
                                    return el;
                                }
                            }
                        }
                    }
                } catch (e) {}
            }
        }

        return null;
    }

    function getActiveScrollContainer(el) {
        if (!el) return null;
        let parent = el.parentElement;
        while (parent && parent !== document.body && parent !== document.documentElement) {
            const style = window.getComputedStyle(parent);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
                return parent;
            }
            parent = parent.parentElement;
        }
        const desktopContent = document.querySelector('.desktop-content');
        if (desktopContent && desktopContent.scrollHeight > desktopContent.clientHeight) {
            return desktopContent;
        }
        return window;
    }

    function scrollTargetIntoComfortView(el) {
        if (!el) return;
        const scrollContainer = getActiveScrollContainer(el);
        const winH = window.innerHeight;
        const desiredTop = Math.max(70, Math.min(130, Math.round(winH * 0.14)));
        const elRect = el.getBoundingClientRect();
        const diff = elRect.top - desiredTop;

        if (Math.abs(diff) > 20) {
            if (scrollContainer && scrollContainer !== window) {
                scrollContainer.scrollTo({
                    top: Math.max(0, scrollContainer.scrollTop + diff),
                    behavior: 'smooth'
                });
            } else {
                const currentY = window.pageYOffset || document.documentElement.scrollTop || 0;
                window.scrollTo({
                    top: Math.max(0, currentY + diff),
                    behavior: 'smooth'
                });
            }
        }
    }

    let tourAnimationFrameId = null;
    function animateReposition(duration = 550) {
        if (tourAnimationFrameId) cancelAnimationFrame(tourAnimationFrameId);
        const start = performance.now();
        function tick(now) {
            handleReposition();
            if (now - start < duration) {
                tourAnimationFrameId = requestAnimationFrame(tick);
            } else {
                handleReposition();
                lockPageScroll();
            }
        }
        tourAnimationFrameId = requestAnimationFrame(tick);
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

        // Temporarily allow scroll so browser smoothly centers target comfortably
        unlockPageScroll();
        scrollTargetIntoComfortView(el);

        // Immediate initial rendering
        updateSpotlightAndTooltip(el, step);

        // Continuous silky-smooth repositioning during smooth scroll transition
        animateReposition(550);
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

        // Atur posisi kartu secara pintar
        positionTooltipSmart(rect);

        // Re-verify after layout paint to ensure accurate height clamping
        requestAnimationFrame(() => {
            if (currentTargetEl && activeTooltip) {
                positionTooltipSmart(currentTargetEl.getBoundingClientRect());
            }
        });
    }

    function positionTooltipSmart(rect) {
        if (!activeTooltip) return;
        const ttHeight = activeTooltip.offsetHeight || activeTooltip.getBoundingClientRect().height || 190;
        const ttWidth = activeTooltip.offsetWidth || Math.min(380, window.innerWidth * 0.92);
        const margin = 10;
        const winH = window.innerHeight;
        const winW = window.innerWidth;

        const spaceBelow = winH - rect.bottom - margin;
        const spaceAbove = rect.top - margin;

        let top;
        // Cek apakah ada ruang cukup di bawah elemen (+16px buffer)
        if (spaceBelow >= ttHeight + 16) {
            top = rect.bottom + margin;
        } else if (spaceAbove >= ttHeight + 16) {
            top = rect.top - ttHeight - margin;
        } else {
            if (spaceBelow >= spaceAbove) {
                top = rect.bottom + margin;
            } else {
                top = rect.top - ttHeight - margin;
            }
        }

        // STRICT VIEWPORT CLAMPING:
        // Pastikan tombol di bagian footer tooltip TIDAK PERNAH terpotong di bawah layar!
        if (top + ttHeight > winH - 14) {
            top = winH - ttHeight - 14;
        }
        if (top < 14) {
            top = 14;
        }

        // Posisikan horizontal di tengah target
        let left = rect.left + (rect.width / 2) - (ttWidth / 2);
        if (left < 14) left = 14;
        if (left + ttWidth > winW - 14) left = winW - ttWidth - 14;

        activeTooltip.style.top = `${Math.round(top)}px`;
        activeTooltip.style.left = `${Math.round(left)}px`;
        activeTooltip.style.width = `${Math.round(ttWidth)}px`;
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
    window.addEventListener('scroll', handleReposition, { passive: true, capture: true });
    document.addEventListener('scroll', handleReposition, { passive: true, capture: true });

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
        if (tourAnimationFrameId) cancelAnimationFrame(tourAnimationFrameId);
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
