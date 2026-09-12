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
                target: '.input-mode-switcher-card, #btnModeBiasa, #btnModeGame',
                topic: 'Pilihan Mode Input',
                icon: 'fa-sliders',
                title: '1. Pilihan Mode Form SPK',
                desc: 'Pilih antara Form Biasa yang ringkas atau Form Interaktif Mode Game Balap untuk pengalaman pengisian SPK yang menyenangkan.'
            },
            {
                target: '.ocr-scanner-banner, .btn-ocr-action',
                topic: 'Smart AI OCR Scanner',
                icon: 'fa-camera',
                title: '2. Scan KTP / KK Otomatis (AI)',
                desc: 'Gunakan kamera smartphone untuk memindai e-KTP dan Kartu Keluarga konsumen agar nama, NIK, dan alamat otomatis terisi seketika.'
            },
            {
                target: '#spkNik, #spkNoKk, .form-grid-2col:first-of-type',
                topic: 'Identitas NIK & KK',
                icon: 'fa-id-card',
                title: '3. Data Kependudukan Pembeli',
                desc: 'Pastikan 16 digit NIK dan No. KK pembeli terisi akurat untuk keperluan pengajuan faktur STNK, BPKB, dan verifikasi leasing.'
            },
            {
                target: '#namaCustomer, #noHp',
                topic: 'Nama & WhatsApp',
                icon: 'fa-user-check',
                title: '4. Nama Lengkap & Kontak Pembeli',
                desc: 'Nama lengkap konsumen sesuai identitas resmi KTP dan nomor WhatsApp aktif untuk pengiriman berkas dan tracking unit.'
            },
            {
                target: '.spk-docs-grid, #spkDocCardKtp, #spkDocCardKk',
                topic: 'Lampiran Berkas',
                icon: 'fa-paperclip',
                title: '5. Lampiran Berkas KTP & KK',
                desc: 'Periksa status kelengkapan foto dokumen identitas pembeli sebelum mengajukan berkas ke bagian administrasi cabang.'
            },
            {
                target: '#modelSelect, select#modelSelect',
                topic: 'Pilih Model Toyota',
                icon: 'fa-car-side',
                title: '6. Tipe Mobil Toyota yang Dipesan',
                desc: 'Pilih model dan varian Toyota yang dipesan customer. Sistem akan langsung memuat harga OTR resmi secara otomatis.'
            },
            {
                target: '#nominal, #tipePembelian',
                topic: 'Harga & Pembayaran',
                icon: 'fa-money-bill-wave',
                title: '7. OTR & Sistem Pembayaran',
                desc: 'Periksa total harga OTR dan pilih sistem pembayaran: Kredit melalui leasing rekanan (TAF/ACC/Bank) atau Tunai (Cash).'
            },
            {
                target: '#signatureCanvas, canvas#signatureCanvas, button[onclick*="submitSpk"]',
                topic: 'Tanda Tangan & Submit',
                icon: 'fa-signature',
                title: '8. Tanda Tangan & Submit ke SPV',
                desc: 'Minta tanda tangan basah customer langsung di layar, lalu tekan Submit SPK agar berkas masuk ke meja SPV untuk di-ACC!'
            }
        ],

        // ── KALKULATOR MULTI-LEASING & QUOTATION ─────────────────────────────
        'kalkulator': [
            {
                target: '.finance-tab-wrapper, #btnTabKalkulator, #btnTabQuotation',
                topic: 'Tab Finansial Terpadu',
                icon: 'fa-layer-group',
                title: '1. Finansial & Quotation Hub',
                desc: 'Beralih dengan mudah antara Kalkulator Cicilan Cepat, Smart Quotation PDF Resmi, atau Matriks Leasing & Odds.'
            },
            {
                target: '#selectModel, select#selectModel',
                topic: 'Model Toyota & OTR',
                icon: 'fa-car',
                title: '2. Pilih Model Toyota & Harga OTR',
                desc: 'Pilih tipe mobil Toyota yang diinginkan konsumen untuk otomatis memuat harga OTR resmi dan paket angsuran.'
            },
            {
                target: '#rangeTdp, #inputTdp, .dp-chips',
                topic: 'Simulasi DP / TDP',
                icon: 'fa-sliders',
                title: '3. Atur Uang Muka (TDP)',
                desc: 'Geser slider DP atau ketuk tombol persentase instan (20%, 25%, 30%) sesuai kesiapan anggaran belanja customer.'
            },
            {
                target: '.tenor-tabs, #selectTenor, .form-group:has(.tenor-tabs)',
                topic: 'Tenor Cicilan',
                icon: 'fa-calendar-days',
                title: '4. Tentukan Jangka Waktu (Tenor)',
                desc: 'Pilih lama periode cicilan mulai dari 1 tahun (12 bulan) hingga 6 tahun (72 bulan) sesuai kesanggupan konsumen.'
            },
            {
                target: '#resultCard, #resultAmount, .result-breakdown',
                topic: 'Hasil Estimasi Cicilan',
                icon: 'fa-file-invoice-dollar',
                title: '5. Kartu Hasil Simulasi Angsuran',
                desc: 'Lihat estimasi angsuran per bulan, suku bunga efektif, rincian TDP, dan pokok hutang pinjaman secara transparan.'
            },
            {
                target: 'button[onclick*="proceedSimulationToSpk"]',
                topic: 'Ajukan ke SPK',
                icon: 'fa-file-signature',
                title: '6. Transfer Langsung ke Form SPK',
                desc: 'Jika customer setuju dengan simulasi ini, tekan tombol hijau ini untuk membawa angka simulasi langsung ke Form SPK tanpa ketik ulang!'
            },
            {
                target: 'button[onclick*="transferToQuotation"], button[onclick*="shareToWhatsApp"], .btn-wa',
                topic: 'Quotation PDF & Share WA',
                icon: 'fa-share-nodes',
                title: '7. Surat Penawaran Resmi (PDF) & WA',
                desc: 'Terbitkan dokumen surat penawaran resmi (Quotation PDF) berlogo Toyota atau bagikan ringkasan simulasi langsung ke WhatsApp customer.'
            }
        ],

        // ── CUSTOMER CRM PIPELINE ────────────────────────────────────────────
        'customer': [
            {
                target: '#searchCustomer, button[onclick*="openAddCustomerModal"]',
                topic: 'Pencarian & Tambah Prospek',
                icon: 'fa-user-plus',
                title: '1. Cari & Tambah Calon Pembeli',
                desc: 'Gunakan kolom pencarian untuk mencari nama prospek, atau tekan tombol plus (+) untuk mendaftarkan calon customer baru.'
            },
            {
                target: '#followupList, button[onclick*="openFollowupModal"]',
                topic: 'Jadwal Follow-Up',
                icon: 'fa-calendar-check',
                title: '2. Pengingat Follow-Up Hari Ini',
                desc: 'Pantau daftar prospek yang harus dihubungi hari ini dan tambahkan pengingat janji temu follow-up baru.'
            },
            {
                target: 'button[onclick*="filterStagnantLeads"], .card:has(#stagnantSummaryText)',
                topic: 'Peringatan Lead Stagnan',
                icon: 'fa-triangle-exclamation',
                title: '3. Deteksi Lead Stagnan (> 48 Jam)',
                desc: 'Sistem memberi peringatan dini pada prospek yang belum di-follow up lebih dari 2 hari agar tidak terlepas ke kompetitor.'
            },
            {
                target: '#kanbanBoard, .kanban-board',
                topic: 'Pipeline Penjualan',
                icon: 'fa-arrows-left-right',
                title: '4. Papan Kanban Pipeline Penjualan',
                desc: 'Geser kartu customer antar tahapan (Cold ➔ Warm ➔ Hot ➔ SPK ➔ DO) untuk memantau progres closing penjualan Anda.'
            },
            {
                target: 'button[onclick*="closeLostDealModal"], #lostDealModal, .card:last-child',
                topic: 'Evaluasi & Lost Deal',
                icon: 'fa-file-circle-xmark',
                title: '5. Catat Lost Deal & Pembatalan',
                desc: 'Jika customer membatalkan pembelian, catat alasannya (kalah diskon, SLIK ditolak, dll) untuk bahan evaluasi bersama Supervisor.'
            }
        ],

        // ── PRICELIST OTR ───────────────────────────────────────────────────
        'pricelist': [
            {
                target: '#searchInput, .search-wrap',
                topic: 'Pencarian Tipe Mobil',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Varian Mobil Toyota',
                desc: 'Ketik nama tipe mobil (misal: Zenix, Avanza, Veloz, Calya, Hilux) untuk melihat baris harga OTR seketika.'
            },
            {
                target: '#btnToggleMultiSelect, button[onclick*="openFilterModal"]',
                topic: 'Pilih Banyak & Filter',
                icon: 'fa-list-check',
                title: '2. Fitur Pilih Banyak Varian',
                desc: 'Gunakan tombol [Pilih Banyak] untuk memilih beberapa tipe mobil sekaligus guna dibagikan ke WhatsApp customer.'
            },
            {
                target: '#btnExportPricelist',
                topic: 'Download Pricelist',
                icon: 'fa-download',
                title: '3. Unduh Pricelist Lengkap',
                desc: 'Unduh tabel daftar harga OTR resmi Jawa Barat dalam format file PDF atau lembar sebar untuk arsip penjualan Anda.'
            },
            {
                target: '#pricelistContainer, .section-header-row',
                topic: 'Simulasi Kredit & Brosur',
                icon: 'fa-calculator',
                title: '4. Bawa ke Simulasi Kredit / Brosur',
                desc: 'Setiap baris mobil memiliki tombol aksi langsung untuk membawa harga OTR ke kalkulator kredit atau membagikan brosur.'
            }
        ],

        // ── LIVE INVENTORY (STOK GUDANG) ────────────────────────────────────
        'inventory': [
            {
                target: '.btn-refresh-pill, .inv-brand-row',
                topic: 'Pembaruan Stok Real-Time',
                icon: 'fa-rotate-right',
                title: '1. Segarkan Data Stok Gudang',
                desc: 'Tekan tombol Refresh kapan saja untuk menarik update terbaru ketersediaan unit di gudang cabang dan pusat.'
            },
            {
                target: '.inv-stats-grid, .stat-ready',
                topic: '4 Ringkasan KPI Stok',
                icon: 'fa-circle-check',
                title: '2. Pantau Total Unit Ready Stock',
                desc: 'Lihat ringkasan total unit ready stock siap kirim, total unit di gudang, unit yang berstatus hold/matched, dan ragam model.'
            },
            {
                target: '.search-bar, #searchInput',
                topic: 'Pencarian Unit',
                icon: 'fa-magnifying-glass',
                title: '3. Cari Varian, Warna & No. Rangka',
                desc: 'Ketik tipe mobil Toyota (misal: Zenix, Avanza, Veloz, Calya), warna, atau nomor rangka tertentu yang dicari oleh konsumen.'
            },
            {
                target: '.quick-chips-wrapper, .chip-item',
                topic: 'Filter Kategori Cepat',
                icon: 'fa-layer-group',
                title: '4. Filter Kategori Mobil',
                desc: 'Ketuk tombol kategori (Ready Stock Saja, MPV, SUV, Commercial, Sedan, Hatchback) untuk menyaring daftar unit seketika.'
            },
            {
                target: '.btn-filter-square, button[onclick*="openFilterModal"]',
                topic: 'Filter Lanjutan',
                icon: 'fa-sliders',
                title: '5. Filter Spesifik & Transmisi',
                desc: 'Gunakan tombol filter kotak untuk menyaring unit berdasarkan tahun perakitan (VIN), jenis transmisi (A/T atau M/T), dan cabang.'
            },
            {
                target: '.inv-toolbar-card, #inventoryGrid',
                topic: 'Kunci Unit ke SPK',
                icon: 'fa-key',
                title: '6. Kunci Nomor Rangka ke Form SPK',
                desc: 'Unit berstatus hijau siap jual! Salin nomor rangka mobil yang ready stock untuk langsung dipasangkan ke form SPK pembeli.'
            }
        ],

        // ── TEST DRIVE ──────────────────────────────────────────────────────
        'testdrive': [
            {
                target: '.td-tabs-nav, #tabBtnCabang, #tabBtnRental',
                topic: 'Pilihan Armada Test Drive',
                icon: 'fa-building-flag',
                title: '1. Unit Showroom Dealer vs Rental TRAC',
                desc: 'Pilih armada resmi cabang Kiara Condong atau armada rekanan rental (TRAC) jika mobil tertentu sedang dipakai.'
            },
            {
                target: '#selectedBanner, #selectedUnitName',
                topic: 'Banner Unit Terpilih',
                icon: 'fa-car-side',
                title: '2. Mobil yang Sedang Dipilih',
                desc: 'Banner ini menampilkan tipe mobil Toyota yang sedang aktif Anda pilih beserta status ketersediaannya.'
            },
            {
                target: '#viewUnits, #unitList',
                topic: 'Daftar Mobil Siap Coba',
                icon: 'fa-car',
                title: '3. Pilih Mobil Toyota Incaran',
                desc: 'Ketuk salah satu kartu mobil Toyota untuk melihat jadwal ketersediaan jam dan spesifikasi unit test drive.'
            },
            {
                target: '.btn-banner-ajukan, button[onclick*="openModal"]',
                topic: 'Ajukan Jadwal Temu',
                icon: 'fa-calendar-plus',
                title: '4. Buka Form Pengajuan Jadwal',
                desc: 'Tekan tombol Ajukan Jadwal untuk menentukan tanggal dan jam temu bersama calon pembeli.'
            },
            {
                target: '#tabBtnRiwayat, .td-tab-btn:last-child',
                topic: 'Riwayat & Monitoring',
                icon: 'fa-clock-rotate-left',
                title: '5. Pantau Status & Riwayat Jadwal',
                desc: 'Periksa status persetujuan jadwal test drive Anda dan catatan masukan impresi customer setelah mencoba mobil.'
            }
        ],

        // ── TRADE-IN (TUKAR TAMBAH) ─────────────────────────────────────────
        'tradein': [
            {
                target: '.trade-sub-tab-bar, .trade-sub-tab-btn:first-child',
                topic: 'Navigasi Trade-In',
                icon: 'fa-arrows-rotate',
                title: '1. Simulasi Taksiran vs Jadwal Inspeksi',
                desc: 'Pilih antara kalkulator estimasi harga tukar tambah mobil bekas atau menu pengajuan jadwal inspeksi fisik oleh tim appraiser.'
            },
            {
                target: '#trMerk, #trModel, #trTahun, #trKondisi',
                topic: 'Data Mobil Lama',
                icon: 'fa-car',
                title: '2. Spesifikasi Mobil Bekas Konsumen',
                desc: 'Pilih merek, ketik tipe model, tahun perakitan, dan kondisi fisik mobil lama milik konsumen yang ingin ditukar.'
            },
            {
                target: '#boxEarlySettlement, #trSisaBulan, #trAngsuranLama',
                topic: 'Pelunasan Kredit Lama',
                icon: 'fa-receipt',
                title: '3. Data Sisa Angsuran (Early Settlement)',
                desc: 'Jika mobil lama konsumen masih dalam masa kredit leasing, masukkan sisa bulan dan angsuran untuk hitung pelunasan bersih.'
            },
            {
                target: '#trTargetModel, #trDpTargetPct',
                topic: 'Mobil Baru & Subsidi',
                icon: 'fa-cart-shopping',
                title: '4. Mobil Toyota Baru & Subsidi Tukar Tambah',
                desc: 'Pilih mobil Toyota baru yang diminati customer. Sistem otomatis menambahkan subsidi trade-in resmi dari Tunas Toyota.'
            },
            {
                target: '.val-card, button[onclick*="proceedTradeInToSpk"]',
                topic: 'Potong DP SPK Langsung',
                icon: 'fa-circle-dollar-to-slot',
                title: '5. Nilai Bersih Otomatis Potong DP SPK',
                desc: 'Nilai bersih mobil lama otomatis menutup uang muka. Tekan tombol gunakan untuk SPK agar otomatis terpotong di form pemesanan!'
            }
        ],

        // ── DELIVERY ORDER (DO) ─────────────────────────────────────────────
        'do': [
            {
                target: '#spkSelect, select#spkSelect',
                topic: 'Pilih Berkas SPK',
                icon: 'fa-file-circle-check',
                title: '1. Pilih Customer yang Siap DO',
                desc: 'Pilih berkas SPK customer yang statusnya sudah disetujui atau PO dari leasing telah terbit resmi.'
            },
            {
                target: '#namaCustomer, #model, #nominal',
                topic: 'Data Otomatis Terisi',
                icon: 'fa-address-card',
                title: '2. Periksa Detail Pemesanan Customer',
                desc: 'Nama pembeli, nomor handphone, tipe kendaraan Toyota, dan nominal harga akan otomatis terisi rapi oleh sistem.'
            },
            {
                target: '#tipePembelian',
                topic: 'Sistem Pembayaran',
                icon: 'fa-money-check-dollar',
                title: '3. Konfirmasi Sistem Pembayaran',
                desc: 'Pastikan metode pembayaran (Kredit Leasing / Tunai Cash) sudah lunas atau berkas PO leasing sudah diverifikasi.'
            },
            {
                target: 'button[onclick*="submitDo"], .btn-main',
                topic: 'Terbitkan DO',
                icon: 'fa-paper-plane',
                title: '4. Terbitkan Delivery Order (DO)',
                desc: 'Tekan tombol Submit DO agar tim logistik cabang langsung mempersiapkan alokasi dan jadwal pengantaran unit ke rumah pembeli.'
            },
            {
                target: '#spkList, .card:has(#spkList)',
                topic: 'Riwayat Pengiriman',
                icon: 'fa-truck-ramp-box',
                title: '5. Pantau Antrean & Realisasi DO',
                desc: 'Daftar seluruh DO yang telah Anda terbitkan akan tercatat di sini dan otomatis menambah angka pencapaian target bulanan Anda.'
            }
        ],

        // ── DELIVERY CEREMONY ───────────────────────────────────────────────
        'delivery_ceremony': [
            {
                target: '.delivery-hero, .badge-delivery',
                topic: 'Digital Ceremony Hero',
                icon: 'fa-award',
                title: '1. Handover & PDI Digital Ceremony',
                desc: 'Fitur dokumentasi serah terima mobil baru resmi berstandar Toyota, lengkap dengan checklist PDI dan sertifikat digital.'
            },
            {
                target: '#delNamaCustomer, #delModelUnit, #delNoRangka',
                topic: 'Data Serah Terima',
                icon: 'fa-user-check',
                title: '2. Data Konsumen & Identitas Kendaraan',
                desc: 'Ketik nama customer, nomor kontak WhatsApp, tipe mobil, serta nomor rangka dan nomor mesin mobil yang diserahterimakan.'
            },
            {
                target: '#pdiChecklistContainer, .pdi-item:first-child',
                topic: 'Digital PDI Checklist',
                icon: 'fa-list-check',
                title: '3. Periksa Fisik Mobil Bersama Konsumen',
                desc: 'Centang checklist fisik bersama konsumen: STNK, buku garansi T-Care, kunci cadangan, APAR, karpet dasar, dan kelistrikan.'
            },
            {
                target: '#delSigCanvas, canvas.canvas-signature',
                topic: 'Tanda Tangan Digital',
                icon: 'fa-signature',
                title: '4. Tanda Tangan Serah Terima di Layar',
                desc: 'Minta tanda tangan basah digital customer langsung di layar smartphone Anda sebagai bukti fisik penyerahan unit telah selesai.'
            },
            {
                target: 'button[onclick*="submitDeliveryCeremony"], button.btn-main',
                topic: 'Sertifikat Digital & WA',
                icon: 'fa-certificate',
                title: '5. Terbitkan Sertifikat & Kirim ke WA',
                desc: 'Terbitkan Sertifikat Serah Terima berbingkai emas berlogo resmi Toyota dan kirimkan langsung ke WhatsApp customer Anda!'
            }
        ],

        // ── INPUT AKTIVITAS & LAPORAN SESI ──────────────────────────────────
        'input': [
            {
                target: '#sesiWaktuAktivitas, select#sesiWaktuAktivitas',
                topic: 'Sesi Waktu Otomatis',
                icon: 'fa-clock',
                title: '1. Sesi Waktu Real-Time',
                desc: 'Sesi waktu (Pagi 08-12, Siang 12-15, atau Sore 15-18+) terkunci otomatis oleh jam sistem agar pelaporan selalu disiplin & valid.'
            },
            {
                target: '#durasiAktivitas, select#durasiAktivitas',
                topic: 'Durasi Kegiatan',
                icon: 'fa-hourglass-half',
                title: '2. Tentukan Durasi Waktu',
                desc: 'Pilih perkiraan lama waktu kegiatan yang Anda jalankan (mulai dari 30 menit hingga 4+ jam untuk pameran atau event besar).'
            },
            {
                target: '#jenisAktivitas, select#jenisAktivitas',
                topic: 'Kategori SPM Aktivitas',
                icon: 'fa-list-check',
                title: '3. Pilih Kategori Aktivitas (SPM)',
                desc: 'Tentukan jenis kegiatan lapangan: Digital Marketing, LIVE TikTok, Walk-in, Pameran, Canvassing Lapangan, Database, atau Fleet.'
            },
            {
                target: '#btnVoiceAktivitas, .voice-input-header, #keteranganAktivitas',
                topic: 'Dikte Suara & Catatan',
                icon: 'fa-microphone',
                title: '4. Dikte Suara & Keterangan Lapangan',
                desc: 'Tuliskan catatan hasil obrolan dengan prospek, atau tekan tombol [Dikte Suara (Mic)] untuk bicara langsung tanpa perlu mengetik manual!'
            },
            {
                target: '.lokasi-box, #lokasiValue, .btn-lokasi',
                topic: 'GPS Satelit & Lokasi',
                icon: 'fa-location-dot',
                title: '5. Kunci Titik Koordinat GPS',
                desc: 'Sistem mendeteksi dan mengunci koordinat GPS satelit lokasi Anda saat ini secara otomatis untuk validasi kehadiran di lapangan.'
            },
            {
                target: '#uploadButtonBox, #photoGrid, .photo-grid',
                topic: 'Foto Dokumentasi',
                icon: 'fa-camera',
                title: '6. Ambil Foto Bukti Kegiatan',
                desc: 'Ketuk tombol kamera untuk mengambil foto dokumentasi langsung di lokasi (pameran, rumah customer, atau kanvasing).'
            },
            {
                target: '#btnSubmit, button#btnSubmit, button[onclick*="simpanAktivitasBaru"]',
                topic: 'Simpan & Lapor ke SPV',
                icon: 'fa-paper-plane',
                title: '7. Simpan & Laporkan ke Supervisor',
                desc: 'Tekan tombol Simpan Aktivitas agar laporan langsung masuk ke dashboard pemantauan Supervisor secara real-time.'
            },
            {
                target: '.session-tab-bar, #sessionActivityList, .card:has(.session-tab-bar)',
                topic: 'Timeline Sesi Pribadi',
                icon: 'fa-timeline',
                title: '8. Timeline Sesi Pribadi Saya',
                desc: 'Pantau histori aktivitas harian Anda per sesi (Pagi, Siang, Sore) di bagian bawah ini lengkap dengan laporan hasil.'
            }
        ],

        // ── AO REPORT (AREA OPERATION) ──────────────────────────────────────
        'ao_report': [
            {
                target: '.ao-actions-toolbar, #btnAoSendWA, #btnAoExportCSV',
                topic: 'Toolbar & Broadcast WA',
                icon: 'fa-bullhorn',
                title: '1. Broadcast WA & Ekspor Data',
                desc: 'Bagikan ringkasan Area Operation ke grup WhatsApp cabang Kiara Condong atau ekspor tabel lengkap ke format file CSV/Excel.'
            },
            {
                target: '.ao-closing-hero, .ao-closing-grid',
                topic: 'Estimasi Closing Hero',
                icon: 'fa-flag-checkered',
                title: '2. Estimasi Closing Bulan Ini',
                desc: 'Pantau target DO cabang, matching unit OS, proyeksi SPK baru, total estimasi closing, dan rasio efisiensi penyerahan unit.'
            },
            {
                target: '.ao-quad-card:first-child .ao-stock-bars-row',
                topic: 'Stock Matching vs OS',
                icon: 'fa-boxes-stacked',
                title: '3. Full Stock vs Invoiceable Stock',
                desc: 'Periksa perbandingan antara Free Stock (unit bebas siap jual) dengan Matched Stock (unit yang sudah terikat pesanan SPK).'
            },
            {
                target: '.ao-quad-card:first-child .ao-matching-subgrid',
                topic: 'Umur OS & Matching Detail',
                icon: 'fa-clock-rotate-left',
                title: '4. Umur Order OS & Status Matching',
                desc: 'Cek rincian pesanan unit: usia pesanan (<30 hari s/d >60 hari) serta estimasi waktu matching alokasi (1 minggu s/d firmed).'
            },
            {
                target: '.ao-quad-card:first-child .ao-ladder-container',
                topic: 'Ritme Tangga 5-Harian',
                icon: 'fa-stairs',
                title: '5. Ritme Target Pengiriman 5-Harian',
                desc: 'Pantau grafik tangga pencapaian pengiriman DO cabang per rentang 5 hari (1-5, 6-10, 11-15, dst) dibanding realisasi MTD.'
            },
            {
                target: '.ao-quad-card:nth-child(2) .ao-table-wrapper',
                topic: 'Tabel Ritme SPK Plan',
                icon: 'fa-table-list',
                title: '6. Evaluasi SPK Plan & Realisasi',
                desc: 'Tabel evaluasi ritme SPK Gross, cancellation rate, dan SPK Nett Actual per periode 5 hari untuk menjaga ritme closing.'
            },
            {
                target: '.ao-quad-card:nth-child(2) div:has(.fa-ban)',
                topic: 'Metrik Pembatalan & RS',
                icon: 'fa-chart-pie',
                title: '7. Statistik Pembatalan & Rencana RS',
                desc: 'Pantau rata-rata penolakan kredit leasing (Loan Rejection Rate 3M) dan proyeksi alokasi unit yang akan menjadi OS bulan depan.'
            }
        ],

        // ── TARGET & PENCAPAIAN ─────────────────────────────────────────────
        'target': [
            {
                target: '.btn-input-achievement, button[onclick*="openInputModal"]',
                topic: 'Input Pencapaian Baru',
                icon: 'fa-circle-plus',
                title: '1. Laporkan SPK & DO Baru',
                desc: 'Tekan tombol merah ini setiap kali Anda berhasil closing untuk mencatatkan realisasi angka SPK atau penyerahan mobil DO Anda.'
            },
            {
                target: '#circleProgressSpk, .target-card:first-of-type',
                topic: 'Target SPK Bulan Ini',
                icon: 'fa-file-invoice',
                title: '2. Pantau Target SPK & Sisa Gap',
                desc: 'Lihat persentase pencapaian SPK, jumlah unit yang sudah terkumpul, dan sisa unit yang harus Anda kejar sebelum akhir bulan.'
            },
            {
                target: '#inputPlanSpk, button[onclick*="savePlanSpk()"]',
                topic: 'Plan Unit SPK',
                icon: 'fa-note-sticky',
                title: '3. Catat Rencana Unit (Plan SPK)',
                desc: 'Tuliskan tipe mobil Toyota yang Anda targetkan untuk closing dalam minggu ini (misal: Avanza, Zenix Hybrid, Veloz).'
            },
            {
                target: '#circleProgressDoBulan, .target-card:nth-of-type(2)',
                topic: 'Target Penyerahan DO',
                icon: 'fa-boxes-packing',
                title: '4. Pantau Target Penyerahan Mobil (DO)',
                desc: 'Pastikan seluruh SPK yang sudah closing segera terkirim (DO) sebelum akhir bulan untuk memaksimalkan pencairan insentif Anda.'
            },
            {
                target: '.target-card:nth-of-type(2) .target-text',
                topic: 'Evaluasi & Sisa Periode',
                icon: 'fa-chart-line',
                title: '5. Evaluasi Ritme Kerja Harian',
                desc: 'Pantau sisa hari kerja operasional cabang bulan ini agar ritme prospek dan penyerahan mobil Anda tetap di atas rata-rata target.'
            }
        ],

        // ── DIGITAL SMART CARD ──────────────────────────────────────────────
        'digital_card': [
            {
                target: '.card-header-gradient, .brand-pill',
                topic: 'Desain Kartu Nama Resmi',
                icon: 'fa-id-badge',
                title: '1. Desain Kartu Nama Digital Toyota',
                desc: 'Kartu nama digital resmi berlogo Toyota lengkap dengan lencana verifikasi cabang Tunas Toyota Kiara Condong.'
            },
            {
                target: '.profile-section, .avatar-circle, #viewName',
                topic: 'Identitas Sales Consultant',
                icon: 'fa-user-tie',
                title: '2. Profil Lengkap Wiraniaga',
                desc: 'Menampilkan foto profil Anda, nama lengkap, NPK, dan kalimat perkenalan ramah untuk membangun rasa percaya konsumen.'
            },
            {
                target: '.action-btn-grid, #btnPhone, #btnWa',
                topic: 'Tombol Kontak 1-Klik',
                icon: 'fa-bolt',
                title: '3. Tombol Kontak Kilat Konsumen',
                desc: 'Konsumen yang membuka link kartu Anda dapat langsung chat WhatsApp, menelepon, simpan kontak (VCF), atau scan QR Code.'
            },
            {
                target: '#inputCustomWa, .input-control',
                topic: 'Pengaturan WhatsApp',
                icon: 'fa-brands fa-whatsapp',
                title: '4. Atur Nomor WhatsApp Aktif',
                desc: 'Pastikan nomor WhatsApp Anda sudah benar agar seluruh pesan konsultasi mobil baru dari konsumen langsung masuk ke HP Anda.'
            },
            {
                target: '.btn-car-sub, button[onclick*="copyPublicCardUrl"]',
                topic: 'Bagikan ke Media Sosial',
                icon: 'fa-share-nodes',
                title: '5. Salin Link Publik & Pasang di Bio',
                desc: 'Salin link kartu nama digital Anda dan pasang di bio Instagram, profil TikTok, dan status WhatsApp untuk menjaring prospek baru!'
            }
        ],

        // ── E-CATALOG & BROSUR ──────────────────────────────────────────────
        'elibrary': [
            {
                target: '#searchInput, input[type="text"]',
                topic: 'Pencarian Brosur',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Brosur & Tipe Mobil',
                desc: 'Ketik nama mobil Toyota yang ditanyakan oleh calon pembeli (misal: Zenix, Avanza, Yaris Cross, Hilux, Fortuner).'
            },
            {
                target: '.cat-scroll, .cat-btn',
                topic: 'Filter Kategori Kendaraan',
                icon: 'fa-layer-group',
                title: '2. Filter Kategori Mobil',
                desc: 'Pilih segmen MPV, SUV, Hatchback, Sedan, atau Commercial untuk menyaring daftar brosur dengan cepat.'
            },
            {
                target: '#libGrid, .elib-unified-grid',
                topic: 'Koleksi Brosur Digital',
                icon: 'fa-book-open',
                title: '3. Lihat Ringkasan Spesifikasi Unit',
                desc: 'Setiap kartu mobil memuat foto resolusi tinggi, harga mulai dari, dan ringkasan fitur keselamatan andalan Toyota.'
            },
            {
                target: '.btn-card-action, .btn-action-wa',
                topic: 'Kirim PDF ke WhatsApp',
                icon: 'fa-share-nodes',
                title: '4. Kirimkan File PDF Resmi ke Konsumen',
                desc: 'Ketuk tombol bagikan pada kartu mobil untuk langsung mengirimkan dokumen brosur PDF resmi Toyota ke WhatsApp customer.'
            }
        ],

        // ── BATTLE CARD & OBJECTION HANDLING ────────────────────────────────
        'battle_card': [
            {
                target: '.battle-tab-nav, #tabBtnObjection, #tabBtnVs',
                topic: 'Pilihan Topik Strategis',
                icon: 'fa-shield-halved',
                title: '1. Menjawab Keberatan vs Battle Card',
                desc: 'Pilih antara skrip menjawab keraguan customer (diskon, inden, hybrid) atau tabel adu spesifikasi vs mobil kompetitor.'
            },
            {
                target: '#searchBattleInput, .card:has(#searchBattleInput)',
                topic: 'Cari Skrip Kilat',
                icon: 'fa-magnifying-glass',
                title: '2. Cari Contekan Jawaban Konsumen',
                desc: 'Ketik kata kunci keberatan customer (contoh: "diskon sebelah lebih besar", "baterai hybrid", "inden lama", "bunga leasing").'
            },
            {
                target: '.objection-accordion:first-child .objection-trigger',
                topic: 'Pola Pikir & Sudut Pandang',
                icon: 'fa-lightbulb',
                title: '3. Pelajari Pola Pikir Sales Handal',
                desc: 'Pelajari cara mengalihkan fokus customer dari perang diskon ke total nilai kepemilikan dan kepastian alokasi unit dealer resmi.'
            },
            {
                target: '.objection-accordion:first-child .btn-copy-script',
                topic: 'Salin Teks Bicara',
                icon: 'fa-copy',
                title: '4. Salin Skrip Bicara ke WhatsApp',
                desc: 'Tekan tombol [Salin Skrip Bicara] untuk langsung menempelkan kalimat negosiasi yang sopan dan persuasif ke chat customer Anda.'
            }
        ],

        // ── CHECK-IN KUNJUNGAN ──────────────────────────────────────────────
        'checkin': [
            {
                target: '.geo-card:first-child, .geo-header-flex, #liveGpsCoordinates',
                topic: 'Akurasi Koordinat GPS',
                icon: 'fa-location-crosshairs',
                title: '1. Kunci Titik Satelit GPS Real-Time',
                desc: 'Sistem mendeteksi titik koordinat satelit GPS secara akurat untuk memverifikasi keberadaan Anda di lokasi prospek lapangan.'
            },
            {
                target: '#checkinMap, .quick-location-grid',
                topic: 'Peta & Lokasi Cepat',
                icon: 'fa-map-location-dot',
                title: '2. Peta Interaktif & Shortcut Lokasi',
                desc: 'Gunakan peta interaktif dan tombol lokasi cepat: Showroom Event, Pameran Mall, Pertemuan Kafe, atau Rumah Customer.'
            },
            {
                target: '.photo-uploader-box, #lokasiInput',
                topic: 'Foto Bukti Kehadiran',
                icon: 'fa-camera',
                title: '3. Ambil Foto Bukti Pertemuan',
                desc: 'Ambil foto suasana saat bertemu customer, kanvasing, atau pameran sebagai bukti laporan kehadiran yang sah.'
            },
            {
                target: '#keteranganCheckin, textarea',
                topic: 'Catatan Kunjungan',
                icon: 'fa-pen-to-square',
                title: '4. Catatan Ringkas Kunjungan',
                desc: 'Tuliskan hasil singkat obrolan: respon customer, tipe mobil yang diminati, dan rencana follow-up berikutnya.'
            },
            {
                target: '.btn-submit-action, button#btnSubmitCheckin',
                topic: 'Kirim ke Radar SPV',
                icon: 'fa-paper-plane',
                title: '5. Kirim Check-In ke Peta Supervisor',
                desc: 'Tekan tombol Kirim Check-In agar data dan foto Anda langsung tercatat rapi di peta monitoring Supervisor real-time.'
            }
        ],

        // ── RETENTION & AFTER-SALES ─────────────────────────────────────────
        'retention': [
            {
                target: '.kpi-grid, .kpi-card:first-child',
                topic: 'Ringkasan KPI Retensi',
                icon: 'fa-chart-pie',
                title: '1. Pantau Konsumen Jatuh Tempo',
                desc: 'Lihat ringkasan customer yang masuk jadwal servis berkala T-Care, perpanjangan STNK, asuransi, dan peluang trade-in.'
            },
            {
                target: 'button[onclick*="syncDataFromDO"], button[onclick*="loadRetentionData"]',
                topic: 'Sinkronisasi DO Otomatis',
                icon: 'fa-cloud-arrow-down',
                title: '2. Sinkronkan Data dari DO',
                desc: 'Tarik data serah terima mobil baru yang telah DO secara otomatis agar tanggal jatuh tempo servis langsung terjadwal.'
            },
            {
                target: '.filter-tab-bar, .filter-tab-btn:first-child',
                topic: 'Kategori Pengingat',
                icon: 'fa-filter',
                title: '3. Saring Kategori Layanan',
                desc: 'Pilih kategori: Servis 1.000 KM (Garansi), Servis 10.000 KM (T-Care), Pajak STNK, Ulang Tahun, atau Peluang Tukar Tambah.'
            },
            {
                target: '#searchRetentionInput, #statusRetentionFilter',
                topic: 'Pencarian & Status Kontak',
                icon: 'fa-magnifying-glass',
                title: '4. Cari Konsumen & Status Kontak',
                desc: 'Ketik nama konsumen atau plat nomor polisi, dan filter mereka yang belum dihubungi untuk diprioritaskan hari ini.'
            },
            {
                target: '#retentionListContainer, .btn-wa-action',
                topic: 'Sapa WhatsApp Ramah',
                icon: 'fa-brands fa-whatsapp',
                title: '5. Sapa Konsumen Lewat WhatsApp',
                desc: 'Tekan tombol WhatsApp di samping nama customer untuk mengirim pesan ramah pengingat servis yang sudah disiapkan sistem.'
            }
        ],

        // ── POLISI REGIONAL (POLREG) ────────────────────────────────────────
        'polreg': [
            {
                target: '.polreg-tab-bar, .district-hero',
                topic: 'Peta Penugasan Wilayah',
                icon: 'fa-map',
                title: '1. Wilayah Penugasan Polreg',
                desc: 'Pantau pembagian area dan batas wilayah regional operasional penjualan cabang Tunas Toyota Kiara Condong.'
            },
            {
                target: '.stat-grid-3, .stat-card-sm:first-child',
                topic: 'Analisis Potensi Pasar',
                icon: 'fa-chart-simple',
                title: '2. Potensi Pasar per Kecamatan',
                desc: 'Lihat data jumlah populasi kendaraan dan potensi prospek penjualan mobil baru di masing-masing kecamatan wilayah penugasan.'
            },
            {
                target: '#polregMap, .card:has(#polregMap)',
                topic: 'Peta Interaktif Polreg',
                icon: 'fa-location-dot',
                title: '3. Eksplorasi Peta & Rute Penetrasi',
                desc: 'Gunakan peta interaktif ini untuk memetakan rute kanvasing, titik pameran strategis, dan fokus penyerangan pasar kompetitor.'
            },
            {
                target: '#districtList, .district-card:first-child',
                topic: 'Fokus Target Kecamatan',
                icon: 'fa-crosshairs',
                title: '4. Target Kecamatan Prioritas',
                desc: 'Pilih kecamatan dengan tingkat penetrasi tinggi untuk memaksimalkan hasil kanvasing dan pembagian brosur promo.'
            }
        ],

        // ── WA SALES STUDIO ─────────────────────────────────────────────────
        'wa_studio': [
            {
                target: '#tabBtnBroadcast, #tabBtnAiBot, #tabBtnSentinel',
                topic: 'Navigasi Studio & Bot',
                icon: 'fa-layer-group',
                title: '1. Pilihan Studio Broadcast & Bot AI',
                desc: 'Pilih antara Studio Broadcast & Follow-up, Webhook Bot WhatsApp T-Stock, atau Laporan Sentinel 5-Harian.'
            },
            {
                target: '.template-card:first-child, .wa-container > div:first-child',
                topic: 'Pilih Template Skrip',
                icon: 'fa-comments',
                title: '2. Pilih Skrip Sesuai Kebutuhan',
                desc: 'Pilih skrip siap pakai: Follow-up Test Drive H+1, Flash Promo DP Ringan, Undangan Weekend Sales, atau Ucapan Ulang Tahun.'
            },
            {
                target: '.styled-input, #inCustomerName, #inModelName',
                topic: 'Personalisasi Konsumen',
                icon: 'fa-user-pen',
                title: '3. Isi Nama & Mobil Incaran Customer',
                desc: 'Ketik nama customer dan tipe mobil, pesan WhatsApp akan otomatis tersusun rapi dengan bahasa yang sopan dan persuasif.'
            },
            {
                target: '.wa-preview-box, #previewWaText',
                topic: 'Gelembung Pratinjau',
                icon: 'fa-eye',
                title: '4. Pratinjau Tampilan Pesan Chat',
                desc: 'Periksa kalimat penawaran pada gelembung chat hijau agar Anda yakin pesan sudah sesuai sebelum dikirim.'
            },
            {
                target: 'button.btn-send-wa, button[onclick*="sendWhatsApp"]',
                topic: 'Kirim Langsung ke WA',
                icon: 'fa-paper-plane',
                title: '5. Buka Langsung Aplikasi WhatsApp',
                desc: 'Tekan tombol Kirim ke WhatsApp untuk langsung meluncurkan aplikasi WhatsApp di HP Anda dengan teks yang sudah terisi siap kirim!'
            }
        ],

        // ── PUSAT NOTIFIKASI ────────────────────────────────────────────────
        'notifikasi': [
            {
                target: '.notif-summary-card, .stat-pill-group',
                topic: 'Status Pemberitahuan',
                icon: 'fa-bell',
                title: '1. Ringkasan Pemberitahuan Baru',
                desc: 'Pantau jumlah pesan baru yang belum dibaca dari Supervisor, persetujuan berkas SPK, maupun pengingat sistem.'
            },
            {
                target: '.notif-actions, .btn-notif-action.read-all',
                topic: 'Kelola Notifikasi',
                icon: 'fa-envelope-open',
                title: '2. Tandai Dibaca & Bersihkan',
                desc: 'Gunakan tombol aksi cepat untuk menandai semua notifikasi sudah dibaca atau membersihkan riwayat pesan lama.'
            },
            {
                target: '#notifList, .notif-card-item:first-child',
                topic: 'Detail Pesan Masuk',
                icon: 'fa-list',
                title: '3. Buka Detail Notifikasi',
                desc: 'Ketuk salah satu notifikasi untuk langsung diarahkan ke halaman SPK, persetujuan diskon, atau data customer terkait.'
            }
        ],

        // ── PROFIL WIRANIAGA ────────────────────────────────────────────────
        'profil': [
            {
                target: '#namaSalesEl, .card:first-of-type',
                topic: 'Identitas Sales Consultant',
                icon: 'fa-user-tie',
                title: '1. Data Akun Sales Consultant',
                desc: 'Profil nama lengkap, peran/jabatan resmi, cabang Tunas Toyota Kiara Condong, dan status aktif akun Anda.'
            },
            {
                target: '.card:nth-of-type(2), #infoSpv',
                topic: 'Informasi Jabatan & SPV',
                icon: 'fa-sitemap',
                title: '2. Supervisor & Kontak Resmi',
                desc: 'Periksa nama Supervisor (SPV) yang membawahi tim Anda serta nomor telepon yang terdaftar pada sistem database.'
            },
            {
                target: '#socialLinksContainer, .card:has(#socialLinksContainer)',
                topic: 'Integrasi Akun Media Sosial',
                icon: 'fa-share-nodes',
                title: '3. Media Sosial untuk Auto-Share',
                desc: 'Akun Instagram, TikTok, dan Facebook Anda otomatis tercantum saat Anda membagikan promo dan brosur ke konsumen.'
            },
            {
                target: 'button[onclick*="openEditProfilModal"], #btnPwaInstallProfil, button.btn-main',
                topic: 'Edit Profil & Pasang PWA',
                icon: 'fa-user-pen',
                title: '4. Edit Profil & Pasang Aplikasi ke Layar HP',
                desc: 'Perbarui nomor kontak atau link sosmed Anda di sini, serta instal aplikasi Sales App ke homescreen HP Anda.'
            }
        ],

        // ── APPROVAL PENGAJUAN ──────────────────────────────────────────────
        'approval': [
            {
                target: '.approval-stats, .stat-chip:first-child',
                topic: 'Status Berkas Pengajuan',
                icon: 'fa-clipboard-check',
                title: '1. Pantau Status Berkas SPK',
                desc: 'Lihat rekapitulasi jumlah berkas pengajuan SPK Anda yang masih Pending, sudah Disetujui, atau Ditolak oleh SPV.'
            },
            {
                target: '.filter-tabs, .filter-tab:first-child',
                topic: 'Filter Kategori Berkas',
                icon: 'fa-filter',
                title: '2. Saring Berkas Pengajuan',
                desc: 'Pilih tab Menunggu, Disetujui, atau Ditolak untuk memeriksa catatan alasan revisi dari Supervisor.'
            },
            {
                target: '#approvalList, .card:first-child',
                topic: 'Detail Keputusan SPV',
                icon: 'fa-folder-open',
                title: '3. Cek Riwayat & Keputusan SPV',
                desc: 'Buka kartu customer untuk melihat nomor SPK resmi yang telah disetujui atau melengkapi berkas yang diminta SPV.'
            }
        ],

        // ── TOYOTA SAFETY SENSE (TSS SIMULATOR) ─────────────────────────────
        'tss-simulator': [
            {
                target: '.tss-tabs-row, .tss-tab-btn:first-child',
                topic: 'Pilihan Fitur TSS',
                icon: 'fa-shield-halved',
                title: '1. Pilih Fitur Keselamatan TSS',
                desc: 'Pilih teknologi radar canggih: PCS (Pre-Collision System), DRCC (Radar Cruise Control), LDA (Lane Departure), dll.'
            },
            {
                target: '.canvas-container, canvas',
                topic: 'Demonstrasi Radar Mobil',
                icon: 'fa-radar',
                title: '2. Demonstrasi Sensor Radar & Kamera',
                desc: 'Tunjukkan kepada calon pembeli bagaimana sensor monokular kamera & radar gelombang milimeter Toyota bekerja mencegah benturan.'
            },
            {
                target: '.btn-trigger-tss, button.btn-main, .tss-action-btn',
                topic: 'Simulasi Rem Otomatis',
                icon: 'fa-play',
                title: '3. Jalankan Skenario Bahaya di Jalan',
                desc: 'Tekan tombol simulasi untuk memicu animasi pengereman darurat otomatis saat ada rintangan mendadak di jalan raya.'
            }
        ],

        // ── SPV: MONITORING WIRANIAGA ───────────────────────────────────────
        'spv_wiraniaga': [
            {
                target: '.wira-kpi-grid, .wira-kpi-card:first-child',
                topic: '4 KPI Tim Supervisor',
                icon: 'fa-users',
                title: '1. Rekapitulasi Tim Supervisor',
                desc: 'Pantau total wiraniaga binaan, status presensi online/offline real-time, wiraniaga konversi tinggi, dan yang butuh coaching.'
            },
            {
                target: '#selectFilterSpvWiraniaga, #searchWiraniaga',
                topic: 'Filter Tim & Pencarian',
                icon: 'fa-magnifying-glass',
                title: '2. Saring Tim & Cari Wiraniaga',
                desc: 'Pilih tim SPV tertentu (Ryan, Alvin, Riva) atau ketik nama/NPK wiraniaga untuk mengecek status kehadiran.'
            },
            {
                target: 'button[onclick*="openModalCreate"]',
                topic: 'Tambah Akun Sales',
                icon: 'fa-user-plus',
                title: '3. Daftarkan Wiraniaga Baru',
                desc: 'Tekan tombol ini untuk mendaftarkan akun wiraniaga baru ke dalam sistem cabang Tunas Toyota Kiara Condong.'
            },
            {
                target: 'table.table-board, #wiraniagaBody',
                topic: 'Tabel Kinerja & Coaching',
                icon: 'fa-user-check',
                title: '4. Detail Kinerja & AI Coaching',
                desc: 'Ketuk baris wiraniaga untuk memeriksa detail konversi, riwayat presensi, dan memberikan rekomendasi pembinaan (coaching).'
            }
        ],

        // ── SPV: MONITORING AKTIVITAS ───────────────────────────────────────
        'spv_aktivitas': [
            {
                target: '#searchActivity, .toolbar .search-box',
                topic: 'Cari Aktivitas Sales',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Aktivitas & Nama Sales',
                desc: 'Ketik nama wiraniaga atau kata kunci keterangan laporan lapangan untuk menyaring data aktivitas harian.'
            },
            {
                target: '#filterTipe, #filterStatus',
                topic: 'Filter Kategori & Status',
                icon: 'fa-filter',
                title: '2. Saring Jenis Kegiatan & Status',
                desc: 'Saring berdasarkan jenis kegiatan (Canvassing, Pameran, Walk-in) dan status (Sedang Dilakukan atau Selesai).'
            },
            {
                target: '#filterSesi, .select-box:has(#filterSesi)',
                topic: 'Filter Sesi Waktu Kerja',
                icon: 'fa-clock',
                title: '3. Pantau Sesi Pagi, Siang & Sore',
                desc: 'Evaluasi kepatuhan wiraniaga dalam menginput aktivitas kerja pada Sesi Pagi (08-12), Siang (12-15), dan Sore (15-18+).'
            },
            {
                target: '#activityContainer, .activity-list',
                topic: 'Log Laporan & Geotagging',
                icon: 'fa-list-check',
                title: '4. Periksa Foto & Titik GPS Satelit',
                desc: 'Buka kartu aktivitas untuk memeriksa foto kegiatan di lapangan dan koordinat lokasi geotagging setiap sales secara real-time.'
            }
        ],

        // ── KACAB: MONITORING SPV ───────────────────────────────────────────
        'kacab_monitoring_spv': [
            {
                target: '#searchHier, .toolbar .search-box',
                topic: 'Pencarian Hirarki',
                icon: 'fa-magnifying-glass',
                title: '1. Cari Supervisor / Wiraniaga',
                desc: 'Ketik nama SPV atau wiraniaga untuk memantau performa cabang secara berjenjang dan transparan.'
            },
            {
                target: '#filterStatusSales, #btnToggleAll',
                topic: 'Filter Kehadiran & Grup',
                icon: 'fa-signal',
                title: '2. Filter Kehadiran & Buka Grup',
                desc: 'Saring sales yang sedang aktif online/offline di lapangan dan gunakan tombol [Buka Semua] untuk ekspansi daftar tim.'
            },
            {
                target: '#hierContainer, .hier-table',
                topic: 'Tabel Produktivitas Cabang',
                icon: 'fa-table-list',
                title: '3. Evaluasi Perolehan SPK & DO Antar Tim',
                desc: 'Bandingkan perolehan SPK bulan ini, DO terkirim, dan persentase pencapaian target antar grup supervisor.'
            },
            {
                target: '.detail-modal, #salesDrillModal, .hier-cols',
                topic: 'Drill-Down Detail Sales',
                icon: 'fa-user-gear',
                title: '4. Drill-Down Detail Individu Sales',
                desc: 'Ketuk nama salah satu wiraniaga untuk membuka kartu rapor kinerja lengkap, rasio konversi, dan catatan coaching.'
            }
        ],

        // ── KACAB: TARGET CABANG ────────────────────────────────────────────
        'kacab_target_kacab': [
            {
                target: '#monthSelectKacab, #btnSyncSheetsKacab',
                topic: 'Periode & Sinkronisasi',
                icon: 'fa-calendar-days',
                title: '1. Periode Bulan & Sinkron Spreadsheet',
                desc: 'Pilih bulan kerja dan sinkronkan target penjualan unit mobil Toyota cabang Kiara Condong dari TAM dan Tunas Pusat.'
            },
            {
                target: '.tc-stats-row, .target-card:first-child',
                topic: 'Target Keseluruhan Cabang',
                icon: 'fa-bullseye',
                title: '2. Ringkasan Kuota Target Cabang',
                desc: 'Pantau total target SPK dan alokasi DO bulanan cabang serta gap unit yang harus ditutup tim pemasaran.'
            },
            {
                target: '.target-card:first-child .tc-spv-info, .tc-stats-row',
                topic: 'Distribusi Kuota per SPV',
                icon: 'fa-chart-pie',
                title: '3. Rincian Kuota per Grup Supervisor',
                desc: 'Lihat perbandingan alokasi target unit SPK dan DO yang didistribusikan ke masing-masing tim supervisor.'
            },
            {
                target: '.target-card button, .modal-box',
                topic: 'Edit & Alokasi Target',
                icon: 'fa-sliders',
                title: '4. Sesuaikan Kuota Target Tim',
                desc: 'Gunakan tombol aksi untuk menyesuaikan kuota target SPK dan DO secara fleksibel sesuai potensi pasar tim SPV.'
            }
        ]
    };

    // Generic fallback steps for any other pages
    function getFallbackSteps() {
        return [
            {
                target: 'input:not([type="hidden"]), select, .search-box, .filter-bar, .card:first-child',
                topic: 'Filter / Input Data',
                icon: 'fa-magnifying-glass',
                title: '1. Masukkan Parameter / Filter',
                desc: 'Gunakan kolom pencarian, filter, atau input formulir di bagian atas untuk menyaring data yang Anda perlukan.'
            },
            {
                target: 'table, .table-container, .card:nth-child(2), .card, .grid-container',
                topic: 'Tinjau Informasi',
                icon: 'fa-table-list',
                title: '2. Tinjau Ringkasan Informasi',
                desc: 'Periksa baris data, grafik, atau kartu status yang tersaji di layar secara seksama.'
            },
            {
                target: 'button.btn-main, button.btn-primary, button[type="submit"], .btn-action, button:last-of-type',
                topic: 'Tombol Aksi Utama',
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
                border-radius: 18px;
                padding: 14px 18px;
                width: min(380px, 92vw);
                max-height: calc(100vh - 24px);
                box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
                border: 2px solid #e2e8f0;
                z-index: 999998;
                box-sizing: border-box;
                transition: top 0.25s cubic-bezier(0.2, 0.8, 0.2, 1), left 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
                font-family: inherit;
            }
            .sft-page-tooltip-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 8px;
                margin-bottom: 6px;
            }
            .sft-page-tooltip-badge {
                font-size: 10px;
                font-weight: 800;
                background: #fee2e2;
                color: #d71920;
                padding: 3px 9px;
                border-radius: 20px;
                text-transform: uppercase;
                letter-spacing: 0.4px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 82%;
                display: inline-block;
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
                gap: 4px;
                align-items: center;
                flex-wrap: wrap;
                justify-content: center;
                max-width: 110px;
            }
            .sft-step-dot {
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: #cbd5e1;
                transition: all 0.2s;
            }
            .sft-step-dot.active {
                background: #d71920;
                width: 14px;
                border-radius: 8px;
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
        const totalSteps = activeSteps.length;
        const currentStepNum = currentStepIndex + 1;
        const badgeTopic = step.topic || (step.badge ? step.badge.replace(/^Langkah\s+\d+\s+dari\s+\d+:\s*/i, '') : `Fitur ${currentStepNum}`);
        const badgeLabel = `LANGKAH ${currentStepNum} DARI ${totalSteps}: ${badgeTopic.toUpperCase()}`;

        // Dots
        const dotsHtml = activeSteps.map((_, idx) => `
            <div class="sft-step-dot ${idx === currentStepIndex ? 'active' : ''}"></div>
        `).join('');

        activeTooltip.innerHTML = `
            <div class="sft-page-tooltip-header">
                <span class="sft-page-tooltip-badge" title="${badgeLabel}">${badgeLabel}</span>
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
