/**
 * feature_tutorial.js
 * Universal Contextual Feature Tutorial Engine for Tunas Toyota Sales Force System
 * 
 * Memberikan panduan praktis "Cara Pakai Fitur" di SEMUA halaman aplikasi.
 * Dirancang khusus ramah untuk seluruh wiraniaga, termasuk wiraniaga senior:
 * - Huruf besar, kontras tinggi, navigasi sentuhan mudah.
 * - 3 Langkah praktis (1. Apa yang diisi, 2. Apa yang dicek, 3. Tombol mana yang ditekan).
 * - Replika visual tombol asli di layar (mockup button).
 * - Fitur "Tunjukkan di Layar" (Spotlight penyorot tombol).
 * - Fitur "Dengarkan Suara" (Voice Narration Bahasa Indonesia).
 * - Otomatis muncul 1x saat pertama buka halaman, dengan opsi "Jangan tampilkan lagi".
 * - Tombol pemicu permanen di header dan floating button di sudut layar.
 */

(function initFeatureTutorialModule() {
    'use strict';

    if (window.sftFeatureTutorialLoaded) return;
    window.sftFeatureTutorialLoaded = true;

    // =========================================================================
    // 1. BASIS DATA PANDUAN PRAKTIS SELURUH FITUR (COMPREHENSIVE KNOWLEDGE BASE)
    // =========================================================================
    const FEATURE_TUTORIAL_DATA = {
        // ── SPK (Surat Pesanan Kendaraan) ────────────────────────────────────
        'spk': {
            title: 'Form Pengajuan SPK Resmi Toyota',
            category: 'Tahap 4: Deal & Pemesanan Mobil',
            categoryColor: '#c8102e',
            icon: 'fa-file-signature',
            summary: 'Gunakan halaman ini ketika calon pembeli sudah deal harga dan telah membayar uang tanda jadi (booking fee) mobil Toyota.',
            steps: [
                {
                    number: '1',
                    title: 'Foto KTP Customer (Scan Otomatis)',
                    desc: 'Tekan tombol Scan KTP di formulir. Cukup arahkan kamera HP ke KTP pembeli, sistem otomatis membaca NIK, Nama, dan Alamat tanpa perlu mengetik manual satu per satu.',
                    buttonMockup: { text: '📸 Scan KTP Otomatis', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '#btnScanKtp, #inputBiasaContainer input[name="nama"], .mode-toggle-btn'
                },
                {
                    number: '2',
                    title: 'Pilih Unit Mobil & Upload Bukti Transfer',
                    desc: 'Pilih model mobil, tipe, dan warna sesuai pesanan pembeli. Masukkan nominal uang tanda jadi (minimal Rp 5 Juta) dan lampirkan foto slip transfer m-banking atau kuitansi kasir.',
                    buttonMockup: { text: '📎 Upload Bukti Transfer', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '#modelMobil, #tandaJadiInput, select[name="tipe_mobil"]'
                },
                {
                    number: '3',
                    title: 'Minta Tanda Tangan & Kirim Pengajuan',
                    desc: 'Minta pembeli menandatangani layar HP Anda pada kotak tanda tangan digital. Setelah rapi, tekan tombol kirim agar berkas SPK langsung masuk ke meja Supervisor (SPV) untuk di-ACC.',
                    buttonMockup: { text: '📝 Kirim Pengajuan SPK', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: '#signaturePad, button[type="submit"], .btn-submit-spk'
                }
            ],
            tip: 'Pastikan foto KTP tidak blur/terpotong dan nomor HP customer aktif WhatsApp agar persetujuan Supervisor (SPV) selesai dalam hitungan menit!',
            flowStage: 4,
            relatedLink: { text: 'Hitung Simulasi Kredit Dulu?', url: 'kalkulator.html' }
        },

        // ── KALKULATOR MULTI-LEASING ─────────────────────────────────────────
        'kalkulator': {
            title: 'Kalkulator Finansial & Multi-Leasing',
            category: 'Tahap 2: Simulasi Kredit & Harga',
            categoryColor: '#0284c7',
            icon: 'fa-calculator',
            summary: 'Hitung rincian DP, angsuran bulanan, dan bandingkan suku bunga leasing resmi Toyota (TAF, ACC, MTF, BCA Finance, Mandiri) di depan customer.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Model Mobil & Harga OTR',
                    desc: 'Pilih tipe mobil yang diinginkan pembeli (misal: Innova Zenix Hybrid atau Avanza). Harga OTR Bandung terbaru akan otomatis terisi lengkap dengan diskon aktif.',
                    buttonMockup: { text: '🚗 Pilih Model Mobil', bg: '#f1f5f9', color: '#0f172a', border: '#cbd5e1' },
                    target: '#modelSelect, select[name="model"], .model-picker'
                },
                {
                    number: '2',
                    title: 'Atur Persentase DP & Tenor Cicilan',
                    desc: 'Geser slider DP (misal 20% atau 30%) dan tentukan lama angsuran (1 s/d 5 tahun). Rincian cicilan dan TDP langsung terhitung seketika.',
                    buttonMockup: { text: '⚙️ Atur DP & Tenor', bg: '#ecfeff', color: '#0369a1', border: '#bae6fd' },
                    target: '#dpRange, #tenorSelect, .dp-slider'
                },
                {
                    number: '3',
                    title: 'Kirim Simulasi ke WA atau Lanjut Buat SPK',
                    desc: 'Tekan tombol [Kirim Penawaran ke WhatsApp] untuk membagikan PDF ke HP pembeli, atau tekan [Ajukan SPK dengan Simulasi Ini] untuk langsung memesan unit tanpa isi ulang.',
                    buttonMockup: { text: '📄 Ajukan SPK dengan Simulasi Ini', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '#btnAjukanSpk, #btnShareWa, .btn-export-pdf'
                }
            ],
            tip: 'Tunjukkan perbandingan paket TAF dan ACC ke customer. Paket Bunga 0% tenor 1 tahun sangat ampuh meyakinkan pembeli tunai untuk beralih ke kredit cerdas!',
            flowStage: 2,
            relatedLink: { text: 'Cek Daftar Harga Lengkap OTR', url: 'pricelist.html' }
        },

        // ── CUSTOMER CRM PIPELINE ────────────────────────────────────────────
        'customer': {
            title: 'Database Customer CRM & Pipeline',
            category: 'Tahap 1: Prospek & Follow-Up',
            categoryColor: '#16a34a',
            icon: 'fa-users',
            summary: 'Pusat mengelola calon pembeli dari pertama kenal (Cold), tertarik (Warm), hingga siap deal (Hot) agar tidak ada pelanggan yang terlupakan.',
            steps: [
                {
                    number: '1',
                    title: 'Tambah Calon Pembeli Baru',
                    desc: 'Setiap kali berkenalan dengan orang yang berminat mobil di showroom, pameran, atau sosmed, tekan tombol [+ Tambah Customer] lalu simpan nama dan nomor WhatsApp-nya.',
                    buttonMockup: { text: '➕ Tambah Customer', bg: '#2563eb', color: '#ffffff', border: '#1d4ed8' },
                    target: '#searchCustomer, button[onclick*="openAddCustomerModal"], .btn-main'
                },
                {
                    number: '2',
                    title: 'Geser Status (Cold ➔ Warm ➔ Hot)',
                    desc: 'Setelah Anda selesai menelepon atau chat customer, geser kartu namanya ke kolom yang sesuai. Sistem akan mengingatkan jadwal follow-up berkala.',
                    buttonMockup: { text: '📑 Geser Kartu Status', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
                    target: '.kanban-col, #followupList, .customer-card'
                },
                {
                    number: '3',
                    title: 'Gunakan Tombol Aksi Cepat',
                    desc: 'Pada kartu customer, tersedia tombol cepat untuk langsung membuatkan simulasi cicilan, menjadwalkan test drive, atau menerbitkan SPK secara otomatis.',
                    buttonMockup: { text: '🚗 Test Drive | 🧮 Simulasi | 📝 SPK', bg: '#f1f5f9', color: '#1e293b', border: '#e2e8f0' },
                    target: '.customer-action-btn, .btn-action-group'
                }
            ],
            tip: 'Hubungi calon pembeli dalam kurun waktu maksimal 24 jam setelah pertemuan pertama agar minat beli mereka tetap tinggi!',
            flowStage: 1,
            relatedLink: { text: 'Mulai Jadwalkan Test Drive', url: 'testdrive.html' }
        },

        // ── PRICELIST OTR ───────────────────────────────────────────────────
        'pricelist': {
            title: 'Daftar Harga Resmi OTR & Promo Diskon',
            category: 'Tahap 2: Cek Harga & Penawaran',
            categoryColor: '#0284c7',
            icon: 'fa-tags',
            summary: 'Katalog harga resmi on-the-road (OTR) Jawa Barat terlengkap untuk seluruh model Toyota, rincian diskon maksimal cabang, dan simulasi paket kredit.',
            steps: [
                {
                    number: '1',
                    title: 'Cari Model Mobil yang Diminati',
                    desc: 'Ketik nama mobil pada kotak pencarian (contoh: Zenix, Avanza, Calya, Hilux) atau pilih tab kategori SUV, MPV, Hybrid, atau Komersil.',
                    buttonMockup: { text: '🔍 Cari tipe mobil...', bg: '#ffffff', color: '#64748b', border: '#cbd5e1' },
                    target: '#searchPricelist, input[type="search"], .search-box'
                },
                {
                    number: '2',
                    title: 'Periksa Harga OTR & Plafon Diskon',
                    desc: 'Lihat harga OTR tunai resmi dan plafon diskon wiraniaga. Jika customer menawar lebih tinggi, Anda dapat mengajukan otorisasi diskon ke Supervisor (SPV).',
                    buttonMockup: { text: '🏷️ Cek Harga & Diskon', bg: '#f8fafc', color: '#0f172a', border: '#e2e8f0' },
                    target: '.pricelist-row, .table-pricelist, .price-badge'
                },
                {
                    number: '3',
                    title: 'Ketuk Tombol [Simulasi Kredit]',
                    desc: 'Tekan tombol Simulasi Kredit di baris tipe mobil tersebut untuk langsung menghitung tabel angsuran tanpa perlu mengetik ulang nominal harganya.',
                    buttonMockup: { text: '🧮 Simulasi Kredit', bg: '#0284c7', color: '#ffffff', border: '#0369a1' },
                    target: '.btn-simulasi, a[href*="kalkulator"]'
                }
            ],
            tip: 'Harga di halaman ini selalu tersinkronisasi otomatis dengan pricelist resmi TAM & Tunas Group per bulan berjalan.',
            flowStage: 2,
            relatedLink: { text: 'Cek Ketersediaan Stok Unit', url: 'inventory.html' }
        },

        // ── LIVE INVENTORY (STOK GUDANG) ────────────────────────────────────
        'inventory': {
            title: 'Live Stok Unit Gudang Toyota',
            category: 'Tahap 3: Cek Ketersediaan Unit',
            categoryColor: '#d97706',
            icon: 'fa-warehouse',
            summary: 'Pantau stok unit siap jual (ready stock) di gudang cabang dan depo pusat secara real-time sebelum menjanjikan pengiriman ke customer.',
            steps: [
                {
                    number: '1',
                    title: 'Filter Tipe & Pilihan Warna',
                    desc: 'Pilih model dan warna yang dicari pembeli (contoh: Veloz Putih atau Zenix Q Hitam). Sistem langsung menyaring unit yang tersedia.',
                    buttonMockup: { text: '🎨 Filter Model & Warna', bg: '#ffffff', color: '#334155', border: '#cbd5e1' },
                    target: '#searchStock, select[name="filter_model"], .stock-search'
                },
                {
                    number: '2',
                    title: 'Perhatikan Status Unit',
                    desc: 'Warna HIJAU (Free Stock) artinya mobil bebas dijual siapa saja. Warna KUNING (Hold/Booking) artinya sudah terkunci oleh wiraniaga lain.',
                    buttonMockup: { text: '🟢 FREE STOCK (Siap Jual)', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                    target: '.badge-stock, .badge-free, .stock-status'
                },
                {
                    number: '3',
                    title: 'Kunci Unit dengan Nomor Rangka (VIN)',
                    desc: 'Salin nomor rangka unit yang berstatus Free, lalu masukkan ke dalam form SPK agar mobil tersebut resmi terkunci untuk customer Anda.',
                    buttonMockup: { text: '🔒 Kunci ke Form SPK', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: '.btn-lock-unit, a[href*="spk"]'
                }
            ],
            tip: 'Jika unit idaman customer berstatus kosong di cabang, Anda bisa menanyakan ke SPV untuk permohonan tarik unit antar-cabang Tunas Group!',
            flowStage: 3,
            relatedLink: { text: 'Customer Cocok? Langsung Bikin SPK', url: 'spk.html' }
        },

        // ── TEST DRIVE ──────────────────────────────────────────────────────
        'testdrive': {
            title: 'Booking & Manajemen Uji Coba Unit',
            category: 'Tahap 1: Pengalaman Berkendara',
            categoryColor: '#0284c7',
            icon: 'fa-car-side',
            summary: 'Bantu calon pembeli merasakan kenyamanan dan keunggulan mobil Toyota secara langsung melalui sesi test drive di dealer atau di rumah pembeli.',
            steps: [
                {
                    number: '1',
                    title: 'Ketuk [+ Jadwalkan Test Drive]',
                    desc: 'Tekan tombol pendaftaran jadwal, pilih nama customer dari database Anda, dan tentukan unit mobil uji coba yang ingin dikendarai.',
                    buttonMockup: { text: '➕ Jadwalkan Test Drive', bg: '#0284c7', color: '#ffffff', border: '#0369a1' },
                    target: '#btnTambahTestDrive, .btn-booking-testdrive, .btn-add-schedule'
                },
                {
                    number: '2',
                    title: 'Pilih Waktu & Lokasi Penjemputan',
                    desc: 'Tentukan tanggal, jam, dan lokasi (bisa di Dealer Tunas Toyota Kiara Condong atau layanan antar unit ke rumah/kantor calon pembeli).',
                    buttonMockup: { text: '📍 Lokasi: Dealer / Rumah Customer', bg: '#f8fafc', color: '#1e293b', border: '#cbd5e1' },
                    target: '#lokasiSelect, input[name="jadwal"]'
                },
                {
                    number: '3',
                    title: 'Lanjut ke SPK Setelah Customer Puas',
                    desc: 'Setelah sesi uji coba selesai dan customer merasa nyaman, segera tekan tombol [Lanjut Buat SPK Unit Ini] selagi antusiasme pembeli masih tinggi.',
                    buttonMockup: { text: '📝 Lanjut Buat SPK Unit Ini', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '.btn-spk-testdrive, .btn-closing-action'
                }
            ],
            tip: 'Saat mendampingi test drive, perkenalkan fitur keselamatan Toyota Safety Sense (TSS) dan keheningan kabin mesin Hybrid untuk mempercepat closing!',
            flowStage: 1,
            relatedLink: { text: 'Cetak Lembar Perjanjian Test Drive', url: 'cetak_testdrive.html' }
        },

        // ── TRADE-IN (TUKAR TAMBAH) ─────────────────────────────────────────
        'tradein': {
            title: 'Taksiran Tukar Tambah Mobil Bekas',
            category: 'Tahap 2: Solusi Dana & DP',
            categoryColor: '#d97706',
            icon: 'fa-right-left',
            summary: 'Bantu customer menjual mobil lama mereka dari segala merk untuk dijadikan uang muka (DP) pembelian mobil Toyota baru.',
            steps: [
                {
                    number: '1',
                    title: 'Isi Data Spesifikasi Mobil Lama',
                    desc: 'Masukkan merk (Toyota, Honda, Daihatsu, dll), tipe, transmisi, tahun pembuatan, dan jarak kilometer yang tertera di speedometer.',
                    buttonMockup: { text: '📋 Isi Data Kendaraan', bg: '#ffffff', color: '#1e293b', border: '#cbd5e1' },
                    target: '#formTradeIn, input[name="merk_mobil"], select[name="tahun"]'
                },
                {
                    number: '2',
                    title: 'Upload Foto Kondisi Fisik Mobil',
                    desc: 'Unggah 4 foto penting: tampak depan, belakang, interior dashboard/jok, dan odometer speedometer agar penaksir (appraiser) memberikan harga tertinggi.',
                    buttonMockup: { text: '📸 Upload Foto Mobil Lama', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '#uploadFotoMobil, .upload-area, input[type="file"]'
                },
                {
                    number: '3',
                    title: 'Terapkan Hasil Taksiran ke DP Mobil Baru',
                    desc: 'Setelah nilai taksiran disetujui, tekan tombol [Gunakan untuk Potongan DP di SPK]. Nilai mobil lama akan langsung mengurangi beban DP customer.',
                    buttonMockup: { text: '🚗 Gunakan untuk SPK (Potong DP)', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '#btnApplyTradeIn, .btn-apply-spk'
                }
            ],
            tip: 'Program subsidi trade-in Toyota seringkali memberikan cashback ekstra Rp 3 s/d 5 Juta yang bisa langsung dipotongkan ke DP!',
            flowStage: 2,
            relatedLink: { text: 'Cek Jadwal Inspeksi Fisik', url: 'jadwal_inspeksi.html' }
        },

        // ── DELIVERY ORDER (DO) ─────────────────────────────────────────────
        'do': {
            title: 'Pengajuan Pengiriman Mobil (DO)',
            category: 'Tahap 5: Pengiriman Mobil ke Pembeli',
            categoryColor: '#16a34a',
            icon: 'fa-truck-fast',
            summary: 'Langkah akhir realisasi target penjualan: Ajukan penerbitan Surat Pengiriman Mobil (DO) setelah berkas SPK lunas atau ACC leasing terbit.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih SPK yang Sudah Disetujui',
                    desc: 'Pilih nomor SPK customer yang statusnya sudah dinyatakan LUNAS (tunai) atau PO LEASING ACC (kredit) oleh pihak administrasi cabang.',
                    buttonMockup: { text: '📄 Pilih SPK Disetujui', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#selectSpk, select[name="spk_id"], .spk-dropdown'
                },
                {
                    number: '2',
                    title: 'Tentukan Tanggal & Alamat Kirim',
                    desc: 'Masukkan tanggal janji kirim yang disepakati dengan pembeli, alamat lengkap tujuan, serta nama penerima mobil di lokasi.',
                    buttonMockup: { text: '📅 Atur Tanggal Kirim', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '#tanggalKirim, textarea[name="alamat_kirim"]'
                },
                {
                    number: '3',
                    title: 'Kirim Permohonan DO ke Logistik',
                    desc: 'Tekan tombol [Ajukan DO]. Bagian PDI dan supir pengiriman cabang akan segera menyiapkan pembersihan unit dan pengantaran mobil.',
                    buttonMockup: { text: '🚚 Ajukan Delivery Order (DO)', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '#btnSubmitDo, button[type="submit"], .btn-submit-do'
                }
            ],
            tip: 'Setelah DO disetujui, segera buka menu Digital Delivery Ceremony untuk mendampingi serah terima mobil bersama customer!',
            flowStage: 5,
            relatedLink: { text: 'Buka Digital Delivery Ceremony', url: 'delivery_ceremony.html' }
        },

        // ── DELIVERY CEREMONY ───────────────────────────────────────────────
        'delivery_ceremony': {
            title: 'Serah Terima Mobil Baru & Piagam Digital',
            category: 'Tahap 5: Momen Bahagia Pelanggan',
            categoryColor: '#d97706',
            icon: 'fa-award',
            summary: 'Abadikan momen bahagia penyerahan mobil baru bersama customer, checklist fisik mobil, dan buatkan Piagam Penyerahan Digital berbingkai emas.',
            steps: [
                {
                    number: '1',
                    title: 'Checklist Kelengkapan Unit (PDI)',
                    desc: 'Centang daftar serah terima bersama pembeli: buku servis resmi, kunci serep, dongkrak/toolkit, karpet bludru, dan kartu garansi kaca film.',
                    buttonMockup: { text: '☑️ Checklist Fisik Lengkap', bg: '#f8fafc', color: '#1e293b', border: '#cbd5e1' },
                    target: '#pdiChecklist, .checklist-container, .pdi-item'
                },
                {
                    number: '2',
                    title: 'Ambil Foto Serah Terima Kunci',
                    desc: 'Ambil foto wiraniaga menyerahkan mock-up kunci kepada customer di depan mobil barunya. Foto ini akan otomatis ditempel di Piagam Digital.',
                    buttonMockup: { text: '📸 Foto Penyerahan Mobil', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '#btnAmbilFoto, .camera-trigger, input[type="file"]'
                },
                {
                    number: '3',
                    title: 'Terbitkan & Kirim Piagam ke WhatsApp',
                    desc: 'Minta pembeli tanda tangan di layar, lalu ketuk [Kirim Piagam ke WA Customer]. Pembeli akan sangat bangga dan membagikannya ke media sosial!',
                    buttonMockup: { text: '🏆 Cetak Piagam & Kirim WA', bg: '#d97706', color: '#ffffff', border: '#b45309' },
                    target: '#btnGenerateCertificate, #btnShareCertificate'
                }
            ],
            tip: 'Momen serah terima adalah waktu emas untuk meminta referensi kontak teman atau keluarga customer yang sedang berencana membeli mobil baru!',
            flowStage: 5,
            relatedLink: { text: 'Cek Jadwal Servis Berkala (T-Care)', url: 'retention.html' }
        },

        // ── INPUT AKTIVITAS ─────────────────────────────────────────────────
        'input': {
            title: 'Catat Aktivitas & Kunjungan Sales Harian',
            category: 'Aktivitas Harian & Disiplin Kerja',
            categoryColor: '#0284c7',
            icon: 'fa-clipboard-check',
            summary: 'Laporkan bukti kerja harian (Canvassing, Pameran Mall, Kunjungan Rumah/Kantor, Telemarketing) lengkap dengan koordinat GPS dan foto selfie.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Jenis Kegiatan Harian',
                    desc: 'Pilih kategori aktivitas yang baru Anda laksanakan: Canvassing Lapangan, Jaga Pameran Mall, Kunjungan Prospek, atau Follow-up Telepon.',
                    buttonMockup: { text: '📌 Pilih Jenis Aktivitas', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#jenisAktivitas, select[name="jenis_aktivitas"]'
                },
                {
                    number: '2',
                    title: 'Ambil Foto di Lokasi (GPS Otomatis)',
                    desc: 'Tekan tombol kamera dan ambil foto di lokasi kegiatan. Sistem otomatis mengunci titik koordinat GPS dan jam kehadiran Anda.',
                    buttonMockup: { text: '📷 Ambil Foto Selfie / Lokasi', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '#btnKamera, .camera-box, input[type="file"]'
                },
                {
                    number: '3',
                    title: 'Tulis Catatan Hasil & Simpan',
                    desc: 'Ketik ringkasan obrolan dengan calon prospek, lalu tekan [Simpan Laporan]. Supervisor (SPV) dapat langsung melihat performa aktif Anda.',
                    buttonMockup: { text: '💾 Simpan Laporan Aktivitas', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '#btnSimpan, button[type="submit"], .btn-save-activity'
                }
            ],
            tip: 'Sales yang konsisten mencatat minimal 5 aktivitas harian terbukti memiliki peluang closing 3 kali lebih besar setiap bulannya!',
            flowStage: 1,
            relatedLink: { text: 'Lihat Database Prospek CRM', url: 'customer.html' }
        },

        // ── AO REPORT (STATUS LEASING) ───────────────────────────────────────
        'ao_report': {
            title: 'Papan Status Aplikasi Kredit Leasing (AO Report)',
            category: 'Tahap 4: Pantau Persetujuan Kredit',
            categoryColor: '#0284c7',
            icon: 'fa-chalkboard-user',
            summary: 'Kawal proses pengajuan kredit customer di leasing rekanan (TAF, ACC, MTF, BCA dsb) agar Purchase Order (PO) leasing cepat terbit.',
            steps: [
                {
                    number: '1',
                    title: 'Cari Nama Customer atau Leasing',
                    desc: 'Ketik nama customer atau filter berdasarkan nama leasing untuk memeriksa berkas siapa yang sedang diproses oleh tim surveyor/analis.',
                    buttonMockup: { text: '🔍 Cari Customer / Leasing...', bg: '#ffffff', color: '#64748b', border: '#cbd5e1' },
                    target: '#searchAo, .filter-leasing, .search-bar'
                },
                {
                    number: '2',
                    title: 'Periksa Arti Warna Status',
                    desc: 'Kuning (Sedang Survey), Biru (Analisa Kredit), Merah (Perlu Berkas Tambahan), dan Hijau (PO Approved / Siap Kirim Mobil).',
                    buttonMockup: { text: '🟢 PO LEASING ACC (Siap DO)', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                    target: '.badge-ao-status, .ao-card, .table-ao'
                },
                {
                    number: '3',
                    title: 'Tindak Lanjuti Berkas Pending Segera',
                    desc: 'Jika ada status kuning/merah, segera hubungi customer atau kontak AO terkait untuk melengkapi berkas susulan sebelum 24 jam.',
                    buttonMockup: { text: '📞 Hubungi AO / Customer', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.btn-contact-ao, .btn-action-followup'
                }
            ],
            tip: 'Begitu status berubah menjadi HIJAU (PO Terbit), Anda bisa langsung membuka menu Pengajuan DO untuk menjadwalkan pengiriman unit!',
            flowStage: 4,
            relatedLink: { text: 'PO Sudah ACC? Langsung Ajukan DO', url: 'do.html' }
        },

        // ── TARGET & PRODUKTIVITAS ──────────────────────────────────────────
        'target': {
            title: 'Monitoring Target Bulanan & Estimasi Komisi',
            category: 'Pencapaian & Insentif Sales',
            categoryColor: '#c8102e',
            icon: 'fa-bullseye',
            summary: 'Pantau posisi pencapaian target penjualan Anda (Unit SPK, Unit DO, Aksesoris TCO) serta perkiraan bonus insentif rupiah yang akan Anda terima.',
            steps: [
                {
                    number: '1',
                    title: 'Cek Progress Bar Target Penjualan',
                    desc: 'Lihat berapa unit SPK dan unit DO yang sudah berhasil Anda bukukan bulan ini dibandingkan target bulanan yang ditentukan cabang.',
                    buttonMockup: { text: '🎯 Target: 4 / 6 Unit (67%)', bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
                    target: '.target-progress, .metric-card, .progress-bar'
                },
                {
                    number: '2',
                    title: 'Hitung Estimasi Bonus & Komisi Masuk',
                    desc: 'Periksa kalkulator komisi otomatis berdasarkan unit yang telah dikirim (DO) dan insentif tambahan dari pembiayaan kredit resmi.',
                    buttonMockup: { text: '💰 Cek Rincian Insentif', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
                    target: '.commission-card, .incentive-breakdown'
                },
                {
                    number: '3',
                    title: 'Ikuti Rekomendasi Aksi Cepat',
                    desc: 'Sistem memberikan petunjuk customer mana yang paling berpotensi closing dalam 3 hari ke depan untuk mengejar sisa target Anda.',
                    buttonMockup: { text: '⚡ Kejar Prospek Potensial', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: '.recommended-action, .btn-boost-sales'
                }
            ],
            tip: 'Fokuslah pada pencapaian DO sebelum tanggal cut-off akhir bulan agar bonus insentif langsung cair pada slip gaji berikutnya!',
            flowStage: 5,
            relatedLink: { text: 'Buka Database Prospek Hot', url: 'customer.html' }
        },

        // ── RETENTION (PURNA JUAL) ──────────────────────────────────────────
        'retention': {
            title: 'Manajemen Retensi Pelanggan & Servis T-Care',
            category: 'Hubungan Pelanggan & Repeat Order',
            categoryColor: '#16a34a',
            icon: 'fa-handshake-angle',
            summary: 'Jaga hubungan hangat dengan customer yang sudah menerima mobil lewat pengingat servis berkala gratis, ulang tahun, dan perpanjangan asuransi.',
            steps: [
                {
                    number: '1',
                    title: 'Lihat Daftar Pengingat Servis Rutin',
                    desc: 'Sistem otomatis mendata customer yang mobilnya sudah mendekati masa servis 1.000 KM (1 bulan) atau 10.000 KM (6 bulan).',
                    buttonMockup: { text: '🔧 Servis Rutin 1.000 KM', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.retention-card, .table-retention, #retentionList'
                },
                {
                    number: '2',
                    title: 'Kirim Ucapan & Pengingat via WhatsApp',
                    desc: 'Tekan tombol WhatsApp untuk mengirim ucapan sopan otomatis yang menginfokan jadwal booking service gratis oli T-Care di bengkel resmi.',
                    buttonMockup: { text: '💬 Kirim Pengingat WhatsApp', bg: '#25d366', color: '#ffffff', border: '#128c7e' },
                    target: '.btn-whatsapp-retention, a[href*="whatsapp"]'
                },
                {
                    number: '3',
                    title: 'Tanyakan Referensi Calon Pembeli Baru',
                    desc: 'Customer yang puas adalah sumber penjualan terbaik! Tanyakan apakah ada sanak keluarga yang berminat membeli mobil Toyota baru.',
                    buttonMockup: { text: '🤝 Minta Referensi Keluarga', bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
                    target: '.btn-referral, .referral-box'
                }
            ],
            tip: 'Sales teladan mendapatkan 40% penjualannya berasal dari referensi pelanggan lama yang puas dengan pelayanan purna jual!',
            flowStage: 5,
            relatedLink: { text: 'Bagikan Kartu Nama Digital', url: 'digital_card.html' }
        },

        // ── DEAL (ARSIP PENJUALAN) ──────────────────────────────────────────
        'deal': {
            title: 'Arsip Kesepakatan & Dokumen Deal Penjualan',
            category: 'Riwayat Transaksi Sukses',
            categoryColor: '#0284c7',
            icon: 'fa-handshake',
            summary: 'Daftar rekam jejak kesepakatan harga dan pemesanan kendaraan yang telah sukses Anda buat, lengkap dengan salinan PDF penawaran.',
            steps: [
                {
                    number: '1',
                    title: 'Gunakan Filter Periode Bulan',
                    desc: 'Pilih bulan dan tahun transaksi untuk meninjau kembali rekapitulasi data penjualan Anda pada periode tertentu.',
                    buttonMockup: { text: '📅 Filter Bulan Ini', bg: '#ffffff', color: '#334155', border: '#cbd5e1' },
                    target: '#filterBulan, .period-selector'
                },
                {
                    number: '2',
                    title: 'Buka Dokumen PDF Penawaran',
                    desc: 'Ketuk pada nama transaksi untuk melihat rincian harga OTR, besaran diskon resmi, rincian aksesoris, dan tanda tangan kesepakatan.',
                    buttonMockup: { text: '👁️ Lihat Lembar Deal PDF', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.deal-item, .btn-view-pdf, .table-deal'
                },
                {
                    number: '3',
                    title: 'Lanjut Cetak Form SPK Resmi',
                    desc: 'Jika pembeli siap melanjutkan, Anda dapat langsung meneruskan data deal tersebut menjadi SPK digital tanpa perlu mengetik ulang.',
                    buttonMockup: { text: '📝 Lanjut ke Form SPK', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: '.btn-to-spk, a[href*="spk"]'
                }
            ],
            tip: 'Simpan nomor transaksi deal untuk mempermudah pengecekan bersama kasir saat penerbitan kuitansi booking fee!',
            flowStage: 4,
            relatedLink: { text: 'Buka Form Pengajuan SPK', url: 'spk.html' }
        },

        // ── E-LIBRARY & BROCHURE ────────────────────────────────────────────
        'elibrary': {
            title: 'Katalog Digital & E-Brosur Spek Mobil',
            category: 'Materi Produk & Brosur Resmi',
            categoryColor: '#0284c7',
            icon: 'fa-book-open',
            summary: 'Perpustakaan digital brosur resmi Toyota resolusi tinggi, lembar spesifikasi teknis, dan video produk untuk langsung dikirim ke WhatsApp pembeli.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Model Kendaraan Toyota',
                    desc: 'Pilih mobil yang ditanyakan calon pembeli dari galeri katalog lengkap (All New Avanza, Zenix, Yaris Cross, Fortuner, dsb).',
                    buttonMockup: { text: '🚗 Pilih Model Mobil', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '.catalog-grid, .model-card, #searchCatalog'
                },
                {
                    number: '2',
                    title: 'Tinjau Lembar Spek & Keunggulan',
                    desc: 'Periksa spesifikasi mesin, konsumsi bensin, fitur keselamatan TSS, serta pilihan warna resmi sebelum menjelaskan ke pembeli.',
                    buttonMockup: { text: '📑 Tinjau Lembar Spesifikasi', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '.spec-sheet, .brochure-preview'
                },
                {
                    number: '3',
                    title: 'Bagikan PDF Brosur Langsung ke WA',
                    desc: 'Ketuk tombol WhatsApp untuk mengirim file PDF brosur resmi berlogo Tunas Toyota langsung ke chat obrolan pembeli dalam 1 detik.',
                    buttonMockup: { text: '📲 Bagikan Brosur ke WhatsApp', bg: '#25d366', color: '#ffffff', border: '#128c7e' },
                    target: '.btn-share-brochure, a[href*="whatsapp"]'
                }
            ],
            tip: 'Kirimkan brosur digital segera setelah selesai mengobrol dengan prospek agar pembeli dapat mempelajari fitur mobil bersama keluarganya di rumah!',
            flowStage: 2,
            relatedLink: { text: 'Kalkulator Simulasi Kredit', url: 'kalkulator.html' }
        },

        // ── PROMO BULANAN ───────────────────────────────────────────────────
        'promo': {
            title: 'Program Promo & Paket Penjualan Terkini',
            category: 'Senjata Closing Penjualan',
            categoryColor: '#c8102e',
            icon: 'fa-fire',
            summary: 'Kumpulan program diskon nasional TAM dan promo spesial cabang Tunas Toyota: paket bunga 0%, DP minim, gratis servis T-Care, dan hadiah langsung.',
            steps: [
                {
                    number: '1',
                    title: 'Buka Promo Berlaku Bulan Ini',
                    desc: 'Periksa daftar promo aktif untuk model mobil yang sedang banyak dicari (contoh: Pesta Bunga Ringan TAF/ACC atau Subsidi Tukar Tambah).',
                    buttonMockup: { text: '🔥 Promo Aktif Bulan Berjalan', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
                    target: '.promo-card, .promo-list, #promoBanner'
                },
                {
                    number: '2',
                    title: 'Pelajari Syarat & Ketentuan Paket',
                    desc: 'Pahami tenor pembiayaan, minimal DP, dan leasing yang berpartisipasi agar Anda dapat menjelaskan dengan meyakinkan kepada calon pembeli.',
                    buttonMockup: { text: '📋 Syarat & Ketentuan Promo', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '.promo-terms, .promo-badge'
                },
                {
                    number: '3',
                    title: 'Gunakan Sebagai Penawar Batas Waktu',
                    desc: 'Gunakan promo terbatas ini sebagai alasan customer untuk segera mengunci SPK hari ini sebelum kuota promo cabang habis.',
                    buttonMockup: { text: '📝 Kunci Promo via SPK Sekarang', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: 'a[href*="spk"], .btn-claim-promo'
                }
            ],
            tip: 'Beri tahu pembeli bahwa unit promo terbatas kuota dealer, ini adalah cara paling sopan dan efektif untuk mendorong closing lebih cepat!',
            flowStage: 2,
            relatedLink: { text: 'Hitung Angsuran Promo di Kalkulator', url: 'kalkulator.html' }
        },

        // ── ORDER TRACKER ───────────────────────────────────────────────────
        'order_tracker': {
            title: 'Pelacakan Status Unit & Pengiriman (Tracking SPK)',
            category: 'Tahap 5: Informasi Status Mobil',
            categoryColor: '#0284c7',
            icon: 'fa-route',
            summary: 'Lacak tahapan mobil pemesan: dari proses alokasi pabrik (TAM), perjalanan kapal/truk ekspedisi, inspeksi PDI bengkel, hingga unit tiba di cabang.',
            steps: [
                {
                    number: '1',
                    title: 'Masukkan Nomor SPK atau Nama Pemesan',
                    desc: 'Ketik nama customer pada kolom pencarian untuk menampilkan linimasa progres mobil yang sedang dipesan.',
                    buttonMockup: { text: '🔍 Ketik No SPK / Nama...', bg: '#ffffff', color: '#64748b', border: '#cbd5e1' },
                    target: '#searchTracking, input[name="tracking_id"]'
                },
                {
                    number: '2',
                    title: 'Cek Posisi Mobil Terkini',
                    desc: 'Lihat status timeline: Alokasi Pabrik ➔ Dalam Pengiriman ➔ Tiba di Pool Cabang ➔ Siap Salon PDI ➔ Siap Kirim (DO).',
                    buttonMockup: { text: '📍 Posisi: Tiba di Gudang Cabang', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                    target: '.tracking-timeline, .tracking-step'
                },
                {
                    number: '3',
                    title: 'Kirim Kabar Gembira ke Customer',
                    desc: 'Bagikan tangkapan layar status ini ke WhatsApp customer agar mereka tenang, puas, dan antusias menyambut hari pengiriman mobil.',
                    buttonMockup: { text: '📲 Bagikan Info ke WhatsApp Customer', bg: '#25d366', color: '#ffffff', border: '#128c7e' },
                    target: '.btn-share-tracking, a[href*="whatsapp"]'
                }
            ],
            tip: 'Memberikan update posisi mobil secara proaktif kepada customer akan membangun kepercayaan tinggi dan melipatgandakan rating kepuasan Anda!',
            flowStage: 5,
            relatedLink: { text: 'Mobil Sudah Tiba? Bikin Form DO', url: 'do.html' }
        },

        // ── BATTLE CARD (KOMPARASI MOBIL) ───────────────────────────────────
        'battle_card': {
            title: 'Adu Spek Mobil Toyota vs Kompetitor (Battle Card)',
            category: 'Senjata Debat & Edukasi Pembeli',
            categoryColor: '#c8102e',
            icon: 'fa-shield-halved',
            summary: 'Panduan argumen penjualan saat calon pembeli membandingkan mobil Toyota dengan merk lain (Honda, Mitsubishi, Hyundai, Suzuki, dll).',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Mobil Toyota & Mobil Lawan',
                    desc: 'Pilih varian Toyota yang sedang Anda tawarkan dan mobil pesaing yang sedang dipertimbangkan oleh calon pembeli.',
                    buttonMockup: { text: '⚔️ Pilih Lawan Komparasi', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#competitorSelect, .battle-picker, select[name="rival"]'
                },
                {
                    number: '2',
                    title: 'Baca 4 Keunggulan Mutlak Toyota',
                    desc: 'Sistem merangkum keunggulan Toyota: Fitur keselamatan aktif (TSS), efisiensi BBM mesin Dual VVT-i/Hybrid, jaringan 300+ bengkel, dan harga jual kembali tertinggi.',
                    buttonMockup: { text: '⭐ Keunggulan Mutlak Toyota', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
                    target: '.battle-card-wins, .advantage-box'
                },
                {
                    number: '3',
                    title: 'Sampaikan Jawaban Keberatan Santun',
                    desc: 'Gunakan panduan kalimat santun untuk menjawab keraguan pembeli tanpa menjelek-jelekkan merk kompetitor secara langsung.',
                    buttonMockup: { text: '💬 Tips Jawaban Santun & Meyakinkan', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.objection-guide, .battle-tips'
                }
            ],
            tip: 'Jangan pernah menjelek-jelekkan mobil kompetitor. Cukup fokus pada kenyamanan jangka panjang, garansi baterai 8 tahun, dan gratis servis T-Care Toyota!',
            flowStage: 2,
            relatedLink: { text: 'Tunjukkan Simulasi Hemat BBM Hybrid', url: 'hybrid_flow.html' }
        },

        // ── WA STUDIO ───────────────────────────────────────────────────────
        'wa_studio': {
            title: 'Template Pesan WhatsApp Cepat & Sopan',
            category: 'Komunikasi Cerdas Wiraniaga',
            categoryColor: '#16a34a',
            icon: 'fa-comment-dots',
            summary: 'Ratusan kata-kata template pesan WhatsApp profesional yang siap pakai untuk berbagai situasi obrolan dengan prospek tanpa perlu mengetik ulang.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Kategori Pesan yang Tepat',
                    desc: 'Pilih topik yang sesuai: Sapaan Pertama Pasca Kenalan, Follow-up Hasil Simulasi, Pengingat Promo Berakhir, atau Undangan Test Drive.',
                    buttonMockup: { text: '📑 Pilih Kategori Template', bg: '#ffffff', color: '#334155', border: '#cbd5e1' },
                    target: '.template-category, #categorySelect, .wa-tabs'
                },
                {
                    number: '2',
                    title: 'Pilih Nama Customer Terdaftar',
                    desc: 'Pilih nama calon pembeli. Nama dan model mobil incaran pembeli akan otomatis tersisip rapi di dalam teks pesan.',
                    buttonMockup: { text: '👤 Pilih Nama Customer', bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
                    target: '#customerSelectWa, select[name="customer"]'
                },
                {
                    number: '3',
                    title: 'Ketuk [Buka di WhatsApp]',
                    desc: 'Tekan tombol WhatsApp untuk langsung membuka aplikasi WhatsApp di HP Anda dengan pesan yang sudah tertata rapi tinggal tekan Kirim.',
                    buttonMockup: { text: '📲 Buka & Kirim di WhatsApp', bg: '#25d366', color: '#ffffff', border: '#128c7e' },
                    target: '.btn-send-wa, #btnOpenWa'
                }
            ],
            tip: 'Waktu terbaik mengirim WhatsApp follow-up adalah pukul 09.30 - 11.30 pagi atau 15.30 - 17.00 sore saat prospek sedang rileks!',
            flowStage: 1,
            relatedLink: { text: 'Buka Database Follow-up CRM', url: 'customer.html' }
        },

        // ── AI COPILOT & T-STOCK ────────────────────────────────────────────
        'ai_copilot': {
            title: 'Asisten Cerdas Penjualan T-Stock AI',
            category: 'Asisten AI & Knowledge Base',
            categoryColor: '#c8102e',
            icon: 'fa-robot',
            summary: 'Teman diskusi pintar wiraniaga yang siap menjawab pertanyaan seputar ketersediaan stok unit, spesifikasi teknis mobil, dan rekomendasi paket kredit.',
            steps: [
                {
                    number: '1',
                    title: 'Ketik Pertanyaan Seputar Mobil atau Stok',
                    desc: 'Ketik di kotak obrolan (contoh: "Stok Zenix putih yang ready apa saja?", "Apa beda Avanza E dan G?", atau "Berapa cicilan Yaris Cross DP 20%?").',
                    buttonMockup: { text: '💬 Tanyakan apa saja ke AI...', bg: '#ffffff', color: '#64748b', border: '#cbd5e1' },
                    target: '#aiChatInput, .chat-input, input[type="text"]'
                },
                {
                    number: '2',
                    title: 'Gunakan Tombol Cepat Cek Stok',
                    desc: 'Tekan tombol cepat di atas obrolan (seperti 🚗 Stok Alphard, 🚗 Stok Zenix, 🚗 Veloz Putih) untuk informasi stok instan dalam 1 detik.',
                    buttonMockup: { text: '🚗 Stok Zenix Ready', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: 'button[onclick*="askCopilotQuick"], .quick-chip'
                },
                {
                    number: '3',
                    title: 'Salin Jawaban & Bagikan ke Pembeli',
                    desc: 'Jawaban akurat dari asisten AI dapat langsung Anda salin atau bagikan ke chat WhatsApp pembeli untuk menjawab pertanyaan mereka dengan cepat.',
                    buttonMockup: { text: '📋 Salin Jawaban AI', bg: '#f8fafc', color: '#1e293b', border: '#cbd5e1' },
                    target: '.btn-copy-ai, .chat-bubble'
                }
            ],
            tip: 'Jika customer menanyakan perbandingan teknis rumit yang Anda lupa, biarkan T-Stock AI yang merangkumkannya untuk Anda seketika!',
            flowStage: 2,
            relatedLink: { text: 'Cek Live Stok Lengkap', url: 'inventory.html' }
        },

        // ── DIGITAL CARD ────────────────────────────────────────────────────
        'digital_card': {
            title: 'Kartu Nama Digital Wiraniaga Toyota',
            category: 'Branding & Identitas Profesional',
            categoryColor: '#0284c7',
            icon: 'fa-id-card',
            summary: 'Kartu nama modern berteknologi web dengan foto profil Anda, tautan langsung telepon/WhatsApp, peta showroom cabang, dan katalog mobil.',
            steps: [
                {
                    number: '1',
                    title: 'Pastikan Profil Anda Lengkap',
                    desc: 'Lengkapi foto terbaik berseragam Toyota, nama lengkap, nomor HP, dan link sosial media Anda pada menu Profil Wiraniaga.',
                    buttonMockup: { text: '👤 Perbarui Biodata Profil', bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
                    target: '#btnEditProfile, a[href*="profil"]'
                },
                {
                    number: '2',
                    title: 'Tunjukkan QR Code ke Kamera HP Pembeli',
                    desc: 'Minta calon pembeli membuka kamera HP mereka dan arahkan ke QR Code di layar Anda. Profil lengkap Anda langsung terbuka di HP mereka.',
                    buttonMockup: { text: '📱 Tampilkan QR Code Digital', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#qrCodeContainer, .qr-card'
                },
                {
                    number: '3',
                    title: 'Kirim Tautan Kartu via WhatsApp',
                    desc: 'Tekan tombol [Bagi Link Kartu Nama] untuk mengirimkan tautan pribadi Anda agar calon pembeli dapat menyimpannya di kontak smartphone mereka.',
                    buttonMockup: { text: '📲 Bagikan Link Kartu ke WA', bg: '#25d366', color: '#ffffff', border: '#128c7e' },
                    target: '#btnShareCard, .btn-share-link'
                }
            ],
            tip: 'Kartu nama digital tidak akan pernah habis atau hilang, dan selalu membuat Anda terlihat modern dan profesional di mata pelanggan!',
            flowStage: 1,
            relatedLink: { text: 'Kelola Biodata di Menu Profil', url: 'profil.html' }
        },

        // ── HYBRID FLOW & ECO CALCULATOR ────────────────────────────────────
        'hybrid_flow': {
            title: 'Kalkulator Hemat BBM Toyota Hybrid (HEV)',
            category: 'Edukasi Teknologi Hybrid',
            categoryColor: '#16a34a',
            icon: 'fa-leaf',
            summary: 'Tunjukkan bukti nyata penghematan biaya bensin mobil Hybrid Toyota (Zenix, Yaris Cross, Corolla Cross) dibandingkan mobil bensin konvensional.',
            steps: [
                {
                    number: '1',
                    title: 'Tentukan Rata-Rata Jarak Tempuh Customer',
                    desc: 'Tanyakan berapa kilometer pemakaian mobil harian pembeli (contoh: 40 KM/hari untuk pemakaian kantor di Bandung).',
                    buttonMockup: { text: '🛣️ Atur Jarak Pemakaian Harian', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#kmHarianInput, .slider-km'
                },
                {
                    number: '2',
                    title: 'Bandingkan Penghematan Biaya Bensin',
                    desc: 'Sistem langsung menghitung penghematan uang bensin jutaan rupiah per tahun serta pengurangan emisi gas buang karbon.',
                    buttonMockup: { text: '💰 Hemat Rp 12 Juta / Tahun', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                    target: '.saving-result, .calc-summary'
                },
                {
                    number: '3',
                    title: 'Jelaskan Garansi Baterai 8 Tahun',
                    desc: 'Tekankan keunggulan bebas perawatan: Baterai Hybrid Toyota tidak perlu dicas colokan listrik dan bergaransi resmi TAM hingga 8 tahun / 160.000 KM.',
                    buttonMockup: { text: '🛡️ Garansi Baterai 8 Thn / 160.000 KM', bg: '#ecfeff', color: '#0369a1', border: '#bae6fd' },
                    target: '.warranty-badge, .hybrid-info'
                }
            ],
            tip: 'Kalkulator ini adalah alat pembuktian paling ampuh untuk meyakinkan customer yang masih ragu beralih ke era mobil ramah lingkungan!',
            flowStage: 2,
            relatedLink: { text: 'Hitung Simulasi Cicilan Zenix Hybrid', url: 'kalkulator.html' }
        },

        // ── POLREG & MARKET SHARE ───────────────────────────────────────────
        'polreg': {
            title: 'Peta Polreg & Penguasaan Pasar Wilayah',
            category: 'Analisis Pasar & Wilayah Penjualan',
            categoryColor: '#0284c7',
            icon: 'fa-chart-pie',
            summary: 'Peta persebaran data registrasi plat nomor polisi (Polreg) untuk melihat dominasi pangsa pasar (market share) Toyota di setiap kecamatan/kota.',
            steps: [
                {
                    number: '1',
                    title: 'Pilih Wilayah Kabupaten / Kota',
                    desc: 'Pilih area kerja penjualan Anda (contoh: Kota Bandung, Kab. Bandung, Cimahi, Sumedang) untuk memantau sebaran penjualan mobil baru.',
                    buttonMockup: { text: '🗺️ Pilih Wilayah Pasar', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '#selectWilayah, .filter-region'
                },
                {
                    number: '2',
                    title: 'Periksa Dominasi Toyota vs Pesaing',
                    desc: 'Lihat persentase Market Share Toyota di segmen MPV, SUV, dan Komersial untuk melihat wilayah mana yang pasarnya masih sangat luas.',
                    buttonMockup: { text: '📊 Market Share Toyota: 38.5%', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.market-share-chart, .stat-box'
                },
                {
                    number: '3',
                    title: 'Tentukan Titik Canvassing Potensial',
                    desc: 'Gunakan data kecamatan dengan penjualan terpadat untuk menentukan lokasi canvassing lapangan dan penempatan tenda pameran akhir pekan.',
                    buttonMockup: { text: '📍 Titik Canvassing Potensial', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '.hotspot-list, .btn-plan-route'
                }
            ],
            tip: 'Gunakan data dominasi pasar Toyota ini untuk meyakinkan calon pembeli bahwa Toyota adalah merk mobil paling diminati dan paling terpercaya di Jawa Barat!',
            flowStage: 1,
            relatedLink: { text: 'Catat Kunjungan Canvassing', url: 'input.html' }
        },

        // ── SPV FOLLOWUP DATABASE ───────────────────────────────────────────
        'spv_followup': {
            title: 'Monitoring Database Prospek Tim Sales (SPV)',
            category: 'Supervisi Tim & Pipeline',
            categoryColor: '#d97706',
            icon: 'fa-bullhorn',
            summary: 'Pusat pengawasan database seluruh wiraniaga di bawah regu Anda: pantau customer stagnant > 48 jam dan lakukan reassignment agar tidak ada prospek hangus.',
            steps: [
                {
                    number: '1',
                    title: 'Cek Peringatan Prospek Stagnant',
                    desc: 'Periksa daftar calon pembeli yang belum dihubungi wiraniaga dalam 48 jam terakhir untuk segera diberikan arahan tindak lanjut.',
                    buttonMockup: { text: '⚠️ Lead Stagnant (> 48 Jam)', bg: '#fef2f2', color: '#991b1b', border: '#fecaca' },
                    target: '.stagnant-alert, #stagnantContainer'
                },
                {
                    number: '2',
                    title: 'Pindahkan Database ke Sales yang Aktif',
                    desc: 'Jika ada wiraniaga yang berhalangan atau lambat menindaklanjuti, alihkan (reassign) prospek tersebut ke wiraniaga lain yang lebih siap.',
                    buttonMockup: { text: '🔄 Alihkan Prospek (Reassign)', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                    target: '.btn-reassign, select[name="sales_target"]'
                },
                {
                    number: '3',
                    title: 'Pantau Konversi Tim Menuju SPK',
                    desc: 'Evaluasi berapa banyak prospek Cold yang berhasil diubah menjadi Hot dan berujung pada penandatanganan SPK resmi minggu ini.',
                    buttonMockup: { text: '📈 Konversi SPK Mingguan', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                    target: '.conversion-stats, .pipeline-summary'
                }
            ],
            tip: 'Database prospek yang langsung di-follow up dalam hitungan jam memiliki rasio closing 5 kali lipat lebih tinggi!',
            flowStage: 1,
            relatedLink: { text: 'Buka Menu Otorisasi & Approval', url: '../pages_spv/approval.html' }
        },

        // ── SPV APPROVAL ────────────────────────────────────────────────────
        'spv_approval': {
            title: 'Otorisasi & Approval SPV (Diskon, SPK, & DO)',
            category: 'Wewenang & Persetujuan SPV',
            categoryColor: '#d97706',
            icon: 'fa-clipboard-check',
            summary: 'Pusat validasi dan persetujuan pengajuan wiraniaga: Permohonan diskon harga khusus, verifikasi berkas SPK masuk, jadwal test drive, dan persetujuan DO.',
            steps: [
                {
                    number: '1',
                    title: 'Periksa Pengajuan yang Menunggu Validasi',
                    desc: 'Tinjau daftar antrean approval: diskon harga, berkas SPK baru, atau permohonan pengiriman unit DO dari anggota regu Anda.',
                    buttonMockup: { text: '⏳ Menunggu Persetujuan', bg: '#fef3c7', color: '#92400e', border: '#fde68a' },
                    target: '#pendingApprovalList, .approval-card, .table-approval'
                },
                {
                    number: '2',
                    title: 'Validasi Berkas & Plafon Diskon',
                    desc: 'Periksa foto KTP pembeli, bukti transfer tanda jadi, dan pastikan pengajuan diskon masih berada dalam batas wewenang plafon SPV.',
                    buttonMockup: { text: '👁️ Cek Detail Dokumen SPK', bg: '#f8fafc', color: '#0f172a', border: '#cbd5e1' },
                    target: '.btn-view-doc, .doc-preview'
                },
                {
                    number: '3',
                    title: 'Ketuk [Setujui / Approve]',
                    desc: 'Tekan tombol hijau untuk menyetujui pengajuan. Notifikasi otomatis akan langsung terkirim ke smartphone wiraniaga yang bersangkutan.',
                    buttonMockup: { text: '✅ Setujui (Approve)', bg: '#16a34a', color: '#ffffff', border: '#15803d' },
                    target: '.btn-approve-spv, button[onclick*="approve"]'
                }
            ],
            tip: 'Jika pengajuan diskon melampaui batas plafon SPV, teruskan pengajuan tersebut secara sistem ke Kepala Cabang (KACAB).',
            flowStage: 4,
            relatedLink: { text: 'Pantau Target Regu Penjualan', url: '../pages_spv/target.html' }
        },

        // ── KACAB DASHBOARD ─────────────────────────────────────────────────
        'kacab_dashboard': {
            title: 'Dashboard Eksekutif Kepala Cabang',
            category: 'Manajemen Eksekutif Cabang',
            categoryColor: '#c8102e',
            icon: 'fa-gauge-high',
            summary: 'Ringkasan performa cabang Tunas Toyota Kiara Condong: Total SPK, Total DO, realisasi omzet, live stok gudang, dan produktivitas 50 wiraniaga.',
            steps: [
                {
                    number: '1',
                    title: 'Pantau Realisasi Target Cabang',
                    desc: 'Tinjau pencapaian total unit SPK dan DO bulan berjalan terhadap target yang ditetapkan oleh direksi Tunas Group.',
                    buttonMockup: { text: '📊 Target Cabang: 120 Unit', bg: '#ffffff', color: '#0f172a', border: '#cbd5e1' },
                    target: '.kacab-metric, .target-card'
                },
                {
                    number: '2',
                    title: 'Periksa Peringkat Performa Grup SPV',
                    desc: 'Bandingkan perolehan angka penjualan antar grup supervisor untuk mengidentifikasi regu yang melampaui target maupun yang memerlukan akselerasi.',
                    buttonMockup: { text: '🏆 Peringkat Tim SPV', bg: '#f8fafc', color: '#334155', border: '#cbd5e1' },
                    target: '.spv-rankings, .team-leaderboard'
                },
                {
                    number: '3',
                    title: 'Tinjau Otorisasi Diskon Level Kacab',
                    desc: 'Berikan keputusan untuk permohonan diskon khusus di luar wewenang SPV demi mengunci penjualan unit berprofit tinggi.',
                    buttonMockup: { text: '📋 Otorisasi Diskon Kacab', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: 'a[href*="approval_kacab"], .btn-kacab-approval'
                }
            ],
            tip: 'Pastikan rasio konversi SPK ke DO di atas 85% untuk menjaga perputaran persediaan unit di gudang tetap sehat dan efisien.',
            flowStage: 5,
            relatedLink: { text: 'Buka Laporan Eksekutif Cabang', url: '../pages_kacab/laporan_kacab.html' }
        },

        // ── DASHBOARD UTAMA SALES ───────────────────────────────────────────
        'dashboard': {
            title: 'Pusat Kerja Wiraniaga (Sales Dashboard)',
            category: 'Alur Kerja Utama Penjualan',
            categoryColor: '#c8102e',
            icon: 'fa-house',
            summary: 'Selamat datang di Aplikasi Sales Force! Dari halaman beranda ini Anda dapat memulai 5 siklus penjualan dari mencari calon pembeli hingga pengiriman mobil.',
            steps: [
                {
                    number: '1',
                    title: 'Tahap 1: Temukan Calon Pembeli',
                    desc: 'Mulai dengan mencatat data orang yang berminat mobil di menu [Input Aktivitas] atau simpan ke [Database Customer CRM].',
                    buttonMockup: { text: '➕ Catat Prospek Customer', bg: '#2563eb', color: '#ffffff', border: '#1d4ed8' },
                    target: '.btn-input-aktivitas, .action-btn-primary'
                },
                {
                    number: '2',
                    title: 'Tahap 2 & 3: Cek Harga & Ketersediaan Stok',
                    desc: 'Buka menu [Pricelist OTR] untuk cek harga, hitung simulasi kredit di [Kalkulator], lalu pastikan unit siap jual di [Live Inventory].',
                    buttonMockup: { text: '🧮 Hitung Simulasi & Cek Stok', bg: '#0284c7', color: '#ffffff', border: '#0369a1' },
                    target: 'a[href*="pricelist"], a[href*="kalkulator"], a[href*="inventory"]'
                },
                {
                    number: '3',
                    title: 'Tahap 4 & 5: Terbitkan SPK & Kirim Mobil (DO)',
                    desc: 'Ketika pembeli deal, klik [+ Buat Pengajuan SPK]. Setelah leasing ACC dan unit lunas, ajukan [Delivery Order (DO)] untuk pengantaran unit!',
                    buttonMockup: { text: '📝 Ajukan SPK & Cetak DO', bg: '#c8102e', color: '#ffffff', border: '#990e24' },
                    target: '.btn-input-spk, a[href*="spk"], a[href*="do"]'
                }
            ],
            tip: 'Kapan pun Anda bingung langkah selanjutnya, cukup ketuk tombol lampu kuning di atas untuk melihat panduan fitur tersebut!',
            flowStage: 1,
            relatedLink: { text: 'Lihat Bagan Alur Kerja Lengkap (Prospek s/d DO)', url: 'panduan_alur_kerja_sales_app.html' }
        }
    };

    // =========================================================================
    // 2. HELPER: DETEKSI HALAMAN AKTIF SECARA OTOMATIS
    // =========================================================================
    function getCleanPageSlug() {
        let pathname = window.location.pathname.toLowerCase();
        pathname = pathname.replace(/\/$/, '');
        let file = pathname.split('/').pop().split('?')[0].split('#')[0] || '';
        file = file.replace(/\.html$/, '').replace(/\.blade\.php$/, '');

        if (!file || file === 'index' || file === 'home' || file === 'dashboard') {
            if (pathname.includes('pages_spv') || pathname.includes('/spv')) return 'spv_dashboard';
            if (pathname.includes('pages_kacab') || pathname.includes('/kacab')) return 'kacab_dashboard';
            return 'dashboard';
        }

        // Special prefix mappings
        if (pathname.includes('pages_spv') || pathname.includes('/spv/')) {
            if (FEATURE_TUTORIAL_DATA['spv_' + file]) return 'spv_' + file;
        }
        if (pathname.includes('pages_kacab') || pathname.includes('/kacab/')) {
            if (FEATURE_TUTORIAL_DATA['kacab_' + file]) return 'kacab_' + file;
        }

        // Aliases & Synonyms
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

    // Fallback generator for unlisted pages
    function getTutorialDataForPage(slug) {
        if (FEATURE_TUTORIAL_DATA[slug]) {
            return FEATURE_TUTORIAL_DATA[slug];
        }

        // Generate intelligent fallback from page title
        let rawTitle = document.title || 'Fitur Aplikasi';
        rawTitle = rawTitle.replace('Sales App -', '').replace('Tunas Toyota -', '').trim();
        let headingText = document.querySelector('h1, h2, .header-page h2, .active-crumb');
        if (headingText && headingText.textContent.trim()) {
            rawTitle = headingText.textContent.trim();
        }

        return {
            title: rawTitle,
            category: 'Panduan Praktis Fitur',
            categoryColor: '#0284c7',
            icon: 'fa-circle-info',
            summary: `Halaman ini digunakan untuk mengelola data dan proses ${rawTitle} pada sistem Sales Force Tunas Toyota.`,
            steps: [
                {
                    number: '1',
                    title: 'Gunakan Filter / Kolom Pencarian',
                    desc: 'Cari data yang Anda perlukan menggunakan kolom filter atau ketik kata kunci pada kotak pencarian di bagian atas.',
                    buttonMockup: { text: '🔍 Kotak Pencarian / Filter', bg: '#ffffff', color: '#64748b', border: '#cbd5e1' },
                    target: 'input[type="text"], input[type="search"], select'
                },
                {
                    number: '2',
                    title: 'Periksa & Tinjau Informasi',
                    desc: 'Baca rincian informasi pada kartu atau tabel dengan teliti sebelum melakukan perubahan data.',
                    buttonMockup: { text: '📋 Periksa Baris Data', bg: '#f8fafc', color: '#1e293b', border: '#cbd5e1' },
                    target: 'table, .card, .container'
                },
                {
                    number: '3',
                    title: 'Tekan Tombol Simpan / Aksi Utama',
                    desc: 'Gunakan tombol berwarna (Simpan, Tambah, atau Proses) untuk mengonfirmasi tindakan Anda di halaman ini.',
                    buttonMockup: { text: '💾 Simpan / Proses Data', bg: '#0284c7', color: '#ffffff', border: '#0369a1' },
                    target: 'button[type="submit"], .btn-main, .btn-primary'
                }
            ],
            tip: 'Pastikan koneksi internet Anda stabil saat menyimpan data penting agar informasi langsung tersinkronisasi ke server pusat.',
            flowStage: 1,
            relatedLink: { text: 'Kembali ke Beranda Utama', url: '../index.html' }
        };
    }

    // =========================================================================
    // 3. INJECT STYLES FOR TUTORIAL MODAL & FLOATING BUTTON
    // =========================================================================
    function injectTutorialStyles() {
        if (document.getElementById('sftFeatureTutorialStyles')) return;
        const style = document.createElement('style');
        style.id = 'sftFeatureTutorialStyles';
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
                background: linear-gradient(135deg, #fef9c3, #fde047) !important;
            }
            .btn-feature-guide-header i {
                font-size: 13.5px !important;
                color: #b45309 !important;
                animation: sftBulbGlow 2.5s infinite ease-in-out !important;
            }

            @keyframes sftBulbGlow {
                0%, 100% { transform: scale(1); opacity: 0.9; }
                50% { transform: scale(1.2); opacity: 1; filter: drop-shadow(0 0 4px #eab308); }
            }

            /* ── FLOATING CORNER BUTTON ── */
            .sft-floating-feature-btn {
                position: fixed;
                bottom: 84px;
                left: 18px;
                z-index: 99990;
                display: flex;
                align-items: center;
                gap: 8px;
                background: linear-gradient(135deg, #0d1b3e, #1e293b);
                color: #ffffff;
                border: 2px solid #facc15;
                padding: 9px 15px;
                border-radius: 30px;
                font-size: 12.5px;
                font-weight: 800;
                box-shadow: 0 8px 24px rgba(13, 27, 62, 0.45);
                cursor: pointer;
                transition: all 0.25s ease;
                backdrop-filter: blur(10px);
                user-select: none;
            }
            .sft-floating-feature-btn:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 12px 30px rgba(13, 27, 62, 0.6);
                border-color: #ffffff;
            }
            .sft-floating-feature-btn .btn-badge-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: #facc15;
                color: #854d0e;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 900;
            }

            @media (max-width: 640px) {
                .sft-floating-feature-btn {
                    bottom: 80px;
                    left: 14px;
                    padding: 8px 12px;
                    font-size: 11.5px;
                }
                .btn-feature-guide-header span {
                    display: inline;
                }
            }

            /* ── TUTORIAL MODAL OVERLAY ── */
            .sft-tut-overlay {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.82);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 999995;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 16px;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s;
            }
            .sft-tut-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            .sft-tut-card {
                background: #ffffff;
                width: 100%;
                max-width: 580px;
                max-height: 90vh;
                border-radius: 28px;
                box-shadow: 0 25px 65px rgba(0, 0, 0, 0.45);
                border: 2px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: scale(0.92) translateY(20px);
                transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            .sft-tut-overlay.active .sft-tut-card {
                transform: scale(1) translateY(0);
            }

            /* Modal Header */
            .sft-tut-header {
                padding: 22px 24px 18px;
                background: linear-gradient(135deg, #0d1b3e 0%, #1e293b 100%);
                color: #ffffff;
                position: relative;
                flex-shrink: 0;
            }
            .sft-tut-top-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                margin-bottom: 12px;
            }
            .sft-tut-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 4px 12px;
                border-radius: 20px;
                font-size: 11.5px;
                font-weight: 800;
                letter-spacing: 0.3px;
                text-transform: uppercase;
            }
            .sft-tut-close-btn {
                background: rgba(255, 255, 255, 0.15);
                border: none;
                color: #ffffff;
                width: 34px;
                height: 34px;
                border-radius: 12px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                transition: all 0.2s;
            }
            .sft-tut-close-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.08);
            }
            .sft-tut-title-wrap {
                display: flex;
                align-items: center;
                gap: 14px;
            }
            .sft-tut-icon-box {
                width: 50px;
                height: 50px;
                border-radius: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 22px;
                color: #ffffff;
                flex-shrink: 0;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }
            .sft-tut-title-wrap h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 900;
                line-height: 1.3;
                color: #ffffff;
            }
            .sft-tut-title-wrap p {
                margin: 4px 0 0;
                font-size: 12.5px;
                color: #cbd5e1;
                line-height: 1.45;
            }

            /* Modal Body */
            .sft-tut-body {
                padding: 22px 24px;
                overflow-y: auto;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 16px;
                background: #f8fafc;
            }

            /* Purpose Banner */
            .sft-tut-purpose-box {
                background: #ffffff;
                border: 1.5px solid #e2e8f0;
                border-radius: 16px;
                padding: 14px 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
            }
            .sft-tut-purpose-box i {
                color: #0284c7;
                font-size: 18px;
                margin-top: 2px;
            }
            .sft-tut-purpose-box p {
                margin: 0;
                font-size: 13.5px;
                color: #334155;
                line-height: 1.55;
                font-weight: 600;
            }

            /* 3 Steps List */
            .sft-tut-steps-title {
                font-size: 14px;
                font-weight: 800;
                color: #0f172a;
                margin: 6px 0 2px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
            .sft-tut-step-card {
                background: #ffffff;
                border: 1.5px solid #e2e8f0;
                border-radius: 18px;
                padding: 16px;
                display: flex;
                gap: 14px;
                align-items: flex-start;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
                transition: all 0.2s;
            }
            .sft-tut-step-card:hover {
                border-color: #cbd5e1;
                box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
            }
            .sft-tut-step-num {
                width: 36px;
                height: 36px;
                border-radius: 12px;
                background: #0d1b3e;
                color: #ffffff;
                font-weight: 900;
                font-size: 16px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }
            .sft-tut-step-content {
                flex: 1;
                min-width: 0;
            }
            .sft-tut-step-content h4 {
                margin: 0 0 5px;
                font-size: 14.5px;
                font-weight: 800;
                color: #0f172a;
            }
            .sft-tut-step-content p {
                margin: 0 0 10px;
                font-size: 13px;
                color: #475569;
                line-height: 1.55;
            }
            .sft-tut-mockup-wrap {
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            }
            .sft-tut-mockup-label {
                font-size: 11px;
                font-weight: 700;
                color: #64748b;
            }
            .sft-tut-mockup-btn {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 5px 12px;
                border-radius: 10px;
                font-size: 12px;
                font-weight: 800;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.06);
                cursor: default;
                user-select: none;
            }
            .sft-tut-spotlight-btn {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                padding: 4px 10px;
                border-radius: 8px;
                background: #eff6ff;
                color: #1d4ed8;
                border: 1px solid #bfdbfe;
                font-size: 11px;
                font-weight: 700;
                cursor: pointer;
                transition: all 0.2s;
            }
            .sft-tut-spotlight-btn:hover {
                background: #dbeafe;
                transform: scale(1.04);
            }

            /* Pro Tip Box */
            .sft-tut-tip-box {
                background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
                border: 1.5px solid #fef08a;
                border-radius: 16px;
                padding: 14px 16px;
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            .sft-tut-tip-box i {
                color: #ca8a04;
                font-size: 18px;
                margin-top: 2px;
            }
            .sft-tut-tip-box p {
                margin: 0;
                font-size: 12.5px;
                color: #854d0e;
                line-height: 1.55;
                font-weight: 600;
            }

            /* Voice Narration Bar */
            .sft-tut-audio-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #ffffff;
                border: 1.5px solid #e2e8f0;
                border-radius: 14px;
                padding: 10px 16px;
            }
            .sft-tut-audio-info {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12.5px;
                font-weight: 700;
                color: #334155;
            }
            .sft-tut-audio-btn {
                background: #f1f5f9;
                border: 1px solid #cbd5e1;
                color: #0f172a;
                padding: 5px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-weight: 800;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 6px;
                transition: all 0.2s;
            }
            .sft-tut-audio-btn:hover {
                background: #e2e8f0;
            }
            .sft-tut-audio-btn.speaking {
                background: #fee2e2;
                color: #991b1b;
                border-color: #fca5a5;
                animation: sftPulseSpeak 1.5s infinite;
            }
            @keyframes sftPulseSpeak {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }

            /* Modal Footer */
            .sft-tut-footer {
                padding: 16px 24px 20px;
                background: #ffffff;
                border-top: 1.5px solid #e2e8f0;
                display: flex;
                flex-direction: column;
                gap: 12px;
                flex-shrink: 0;
            }
            .sft-tut-footer-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                flex-wrap: wrap;
            }
            .sft-tut-dont-show {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12.5px;
                color: #64748b;
                cursor: pointer;
                user-select: none;
            }
            .sft-tut-dont-show input[type="checkbox"] {
                width: 17px;
                height: 17px;
                cursor: pointer;
                accent-color: #0d1b3e;
            }
            .sft-tut-btn-primary {
                background: linear-gradient(135deg, #c8102e, #b91c1c);
                color: #ffffff;
                border: none;
                padding: 12px 24px;
                border-radius: 14px;
                font-size: 14.5px;
                font-weight: 800;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                box-shadow: 0 4px 14px rgba(200, 16, 46, 0.35);
                transition: all 0.2s;
            }
            .sft-tut-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(200, 16, 46, 0.5);
            }
            .sft-tut-flow-link-btn {
                background: #f8fafc;
                border: 1.5px solid #cbd5e1;
                color: #0f172a;
                padding: 9px 14px;
                border-radius: 12px;
                font-size: 12.5px;
                font-weight: 800;
                cursor: pointer;
                text-decoration: none;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                transition: all 0.2s;
            }
            .sft-tut-flow-link-btn:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
            }

            /* ── INTERACTIVE SPOTLIGHT OVERLAY ── */
            .sft-spotlight-active {
                position: relative !important;
                z-index: 999999 !important;
                box-shadow: 0 0 0 6px #facc15, 0 0 35px rgba(250, 204, 21, 0.8) !important;
                border-radius: 12px !important;
                animation: sftSpotlightPulse 1.5s infinite alternate ease-in-out !important;
                transition: all 0.3s !important;
            }
            @keyframes sftSpotlightPulse {
                0% { box-shadow: 0 0 0 4px #facc15, 0 0 20px rgba(250, 204, 21, 0.6); }
                100% { box-shadow: 0 0 0 8px #eab308, 0 0 45px rgba(234, 179, 8, 0.95); }
            }
            .sft-spotlight-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.75);
                z-index: 999998;
                pointer-events: auto;
            }
            .sft-spotlight-tooltip {
                position: fixed;
                bottom: 24px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 9999999;
                background: #ffffff;
                color: #0f172a;
                padding: 14px 20px;
                border-radius: 18px;
                box-shadow: 0 15px 40px rgba(0,0,0,0.5);
                border: 2px solid #facc15;
                display: flex;
                align-items: center;
                gap: 16px;
                max-width: 90vw;
            }
            .sft-spotlight-tooltip span {
                font-size: 13.5px;
                font-weight: 700;
                color: #1e293b;
            }
            .sft-spotlight-tooltip button {
                background: #0d1b3e;
                color: #ffffff;
                border: none;
                padding: 8px 16px;
                border-radius: 10px;
                font-weight: 800;
                font-size: 12.5px;
                cursor: pointer;
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    // =========================================================================
    // 4. SPEECH SYNTHESIS (AUDIO NARRATOR)
    // =========================================================================
    let isSpeaking = false;
    function toggleSpeechNarration(tutData) {
        const synth = window.speechSynthesis;
        if (!synth) {
            alert('Perangkat Anda tidak mendukung fitur suara text-to-speech.');
            return;
        }

        const btn = document.getElementById('sftTutAudioBtn');

        if (isSpeaking) {
            synth.cancel();
            isSpeaking = false;
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Dengarkan';
            }
            return;
        }

        // Build narration text
        let script = `Panduan cara pakai fitur ${tutData.title}. `;
        script += tutData.summary + '. ';
        tutData.steps.forEach((step, idx) => {
            script += `Langkah ${idx + 1}: ${step.title}. ${step.desc}. `;
        });
        script += `Tips sukses: ${tutData.tip}`;

        const utter = new SpeechSynthesisUtterance(script);
        utter.lang = 'id-ID';
        utter.rate = 0.95; // Sedikit lebih santai agar ramah sales senior
        utter.pitch = 1.0;

        // Try to pick Indonesian voice
        const voices = synth.getVoices();
        const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia'));
        if (idVoice) utter.voice = idVoice;

        utter.onstart = () => {
            isSpeaking = true;
            if (btn) {
                btn.classList.add('speaking');
                btn.innerHTML = '<i class="fa-solid fa-stop"></i> Berhenti';
            }
        };

        utter.onend = () => {
            isSpeaking = false;
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Dengarkan';
            }
        };

        utter.onerror = () => {
            isSpeaking = false;
            if (btn) {
                btn.classList.remove('speaking');
                btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Dengarkan';
            }
        };

        synth.cancel();
        synth.speak(utter);
    }

    // =========================================================================
    // 5. SPOTLIGHT HIGHLIGHTER (MENUNJUKKAN TOMBOL DI LAYAR)
    // =========================================================================
    function spotlightElement(selector, stepTitle) {
        // Find target element
        let targetEl = null;
        if (selector) {
            const selectors = selector.split(',').map(s => s.trim());
            for (let sel of selectors) {
                let el = document.querySelector(sel);
                if (el && el.offsetParent !== null) { // Visible
                    targetEl = el;
                    break;
                }
            }
            if (!targetEl) {
                targetEl = document.querySelector(selectors[0]);
            }
        }

        // Close modal temporarily
        closeTutorialModal(false);

        if (!targetEl) {
            alert(`Elemen untuk langkah "${stepTitle}" sedang tersembunyi atau form belum dibuka.`);
            openTutorialModal();
            return;
        }

        // Scroll to element smoothly
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add backdrop and halo
        const backdrop = document.createElement('div');
        backdrop.className = 'sft-spotlight-backdrop';
        backdrop.id = 'sftSpotlightBackdrop';

        const tooltip = document.createElement('div');
        tooltip.className = 'sft-spotlight-tooltip';
        tooltip.id = 'sftSpotlightTooltip';
        tooltip.innerHTML = `
            <span>👉 <strong>Langkah:</strong> ${stepTitle}</span>
            <button type="button" id="sftSpotlightBackBtn">Kembali ke Panduan</button>
        `;

        document.body.appendChild(backdrop);
        document.body.appendChild(tooltip);
        targetEl.classList.add('sft-spotlight-active');

        function cleanSpotlight() {
            if (targetEl) targetEl.classList.remove('sft-spotlight-active');
            const b = document.getElementById('sftSpotlightBackdrop');
            if (b) b.remove();
            const t = document.getElementById('sftSpotlightTooltip');
            if (t) t.remove();
            openTutorialModal();
        }

        document.getElementById('sftSpotlightBackBtn').addEventListener('click', cleanSpotlight);
        backdrop.addEventListener('click', cleanSpotlight);
    }

    // =========================================================================
    // 6. BUILD & RENDER TUTORIAL MODAL
    // =========================================================================
    function buildTutorialModal(tutData, slug) {
        let existing = document.getElementById('sftFeatureTutorialModal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'sft-tut-overlay';
        overlay.id = 'sftFeatureTutorialModal';

        // Steps HTML
        const stepsHtml = tutData.steps.map(step => {
            const mockup = step.buttonMockup;
            const targetAttr = step.target ? `data-target="${step.target.replace(/"/g, '&quot;')}"` : '';
            return `
                <div class="sft-tut-step-card">
                    <div class="sft-tut-step-num">${step.number}</div>
                    <div class="sft-tut-step-content">
                        <h4>${step.title}</h4>
                        <p>${step.desc}</p>
                        <div class="sft-tut-mockup-wrap">
                            <span class="sft-tut-mockup-label">Tombol di Layar:</span>
                            <span class="sft-tut-mockup-btn" style="background:${mockup.bg}; color:${mockup.color}; border:1.5px solid ${mockup.border};">
                                ${mockup.text}
                            </span>
                            ${step.target ? `
                                <button type="button" class="sft-tut-spotlight-btn" ${targetAttr} onclick="window.sftSpotlightStep('${escapeJs(step.target)}', '${escapeJs(step.title)}')">
                                    <i class="fa-solid fa-eye"></i> Tunjukkan di Layar
                                </button>
                            ` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Global Sales Cycle Link
        const pathPrefix = window.location.pathname.includes('/pages/') || window.location.pathname.includes('/pages_spv/') || window.location.pathname.includes('/pages_kacab/') ? '../' : '';
        const panduanUrl = pathPrefix + 'panduan_alur_kerja_sales_app.html';

        overlay.innerHTML = `
            <div class="sft-tut-card" role="dialog" aria-modal="true">
                <!-- Header -->
                <div class="sft-tut-header">
                    <div class="sft-tut-top-row">
                        <span class="sft-tut-badge" style="background:${tutData.categoryColor}; color:#ffffff;">
                            <i class="fa-solid fa-compass"></i> ${tutData.category}
                        </span>
                        <button type="button" class="sft-tut-close-btn" id="sftTutCloseBtn" title="Tutup Panduan (Esc)">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <div class="sft-tut-title-wrap">
                        <div class="sft-tut-icon-box" style="background:${tutData.categoryColor};">
                            <i class="fa-solid ${tutData.icon}"></i>
                        </div>
                        <div>
                            <h2>${tutData.title}</h2>
                            <p>Panduan Praktis Cara Pakai &amp; Tips Closing Cepat</p>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="sft-tut-body">
                    <!-- Purpose -->
                    <div class="sft-tut-purpose-box">
                        <i class="fa-solid fa-circle-question"></i>
                        <p>${tutData.summary}</p>
                    </div>

                    <!-- Voice Narration Bar -->
                    <div class="sft-tut-audio-bar">
                        <div class="sft-tut-audio-info">
                            <i class="fa-solid fa-headphones-simple" style="color:#0284c7;"></i>
                            <span>Malas baca teks? Dengarkan suara panduan:</span>
                        </div>
                        <button type="button" class="sft-tut-audio-btn" id="sftTutAudioBtn">
                            <i class="fa-solid fa-volume-high"></i> Dengarkan
                        </button>
                    </div>

                    <!-- 3 Steps -->
                    <div class="sft-tut-steps-title">
                        <span><i class="fa-solid fa-list-check" style="color:#c8102e; margin-right:6px;"></i> 3 Langkah Mudah Menggunakan:</span>
                        <span style="font-size:11.5px; font-weight:700; color:#64748b;">Ikuti urutan 1 ➔ 2 ➔ 3</span>
                    </div>
                    ${stepsHtml}

                    <!-- Pro Tip -->
                    <div class="sft-tut-tip-box">
                        <i class="fa-solid fa-lightbulb"></i>
                        <div>
                            <div style="font-weight:800; font-size:12.5px; margin-bottom:2px; color:#a16207;">TIPS EMAS DARI TRAINER DEALER:</div>
                            <p>${tutData.tip}</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="sft-tut-footer">
                    <div class="sft-tut-footer-row">
                        <label class="sft-tut-dont-show">
                            <input type="checkbox" id="sftTutDontShowCheck">
                            <span>Jangan munculkan otomatis lagi di halaman ini</span>
                        </label>
                        <button type="button" class="sft-tut-btn-primary" id="sftTutConfirmBtn">
                            <i class="fa-solid fa-circle-check"></i> Mengerti, Mulai Coba
                        </button>
                    </div>
                    <a href="${panduanUrl}" class="sft-tut-flow-link-btn" title="Buka bagan alur kerja 5 tahap dari Prospek s/d DO">
                        <i class="fa-solid fa-route" style="color:#c8102e;"></i>
                        <span>Lihat Alur Kerja Lengkap (Prospek ➔ Simulasi ➔ Cek Stok ➔ SPK ➔ DO)</span>
                    </a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event Listeners
        const closeBtn = document.getElementById('sftTutCloseBtn');
        const confirmBtn = document.getElementById('sftTutConfirmBtn');
        const dontShowCheck = document.getElementById('sftTutDontShowCheck');
        const audioBtn = document.getElementById('sftTutAudioBtn');

        function doClose() {
            if (dontShowCheck && dontShowCheck.checked) {
                try {
                    localStorage.setItem('sft_page_tut_dismissed_' + slug, '1');
                } catch (e) {}
            }
            closeTutorialModal(true);
        }

        if (closeBtn) closeBtn.addEventListener('click', doClose);
        if (confirmBtn) confirmBtn.addEventListener('click', doClose);
        if (audioBtn) audioBtn.addEventListener('click', () => toggleSpeechNarration(tutData));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) doClose();
        });

        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                doClose();
            }
        });
    }

    function escapeJs(str) {
        return (str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    }

    // =========================================================================
    // 7. OPEN / CLOSE HANDLERS
    // =========================================================================
    function openTutorialModal(forceSlug) {
        const slug = forceSlug || getCleanPageSlug();
        const tutData = getTutorialDataForPage(slug);
        buildTutorialModal(tutData, slug);

        const overlay = document.getElementById('sftFeatureTutorialModal');
        if (overlay) {
            setTimeout(() => {
                overlay.classList.add('active');
            }, 20);
        }
    }

    function closeTutorialModal(stopAudio) {
        const overlay = document.getElementById('sftFeatureTutorialModal');
        if (overlay) {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.remove();
            }, 300);
        }
        if (stopAudio && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            isSpeaking = false;
        }
    }

    // =========================================================================
    // 8. INJECT BUTTONS (HEADER + FLOATING BUTTON)
    // =========================================================================
    function injectTriggerButtons() {
        const slug = getCleanPageSlug();

        // Don't show on login pages
        if (slug.includes('login')) return;

        // 1. Injeksi tombol header jika header ada
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
                headerBtn.setAttribute('title', 'Buka panduan cara menggunakan fitur di halaman ini');
                headerBtn.innerHTML = `
                    <i class="fa-solid fa-lightbulb"></i>
                    <span>Cara Pakai</span>
                `;
                headerBtn.addEventListener('click', () => openTutorialModal(slug));
                rightGroup.prepend(headerBtn);
            }
        }

        // 2. Injeksi Floating Button di sudut kiri bawah layar (always accessible)
        if (!document.getElementById('sftFloatingFeatureBtn')) {
            const floatBtn = document.createElement('div');
            floatBtn.id = 'sftFloatingFeatureBtn';
            floatBtn.className = 'sft-floating-feature-btn';
            floatBtn.setAttribute('role', 'button');
            floatBtn.setAttribute('title', 'Ketuk untuk membuka panduan praktis fitur ini');
            floatBtn.innerHTML = `
                <span class="btn-badge-icon"><i class="fa-solid fa-lightbulb"></i></span>
                <span>Cara Pakai Fitur</span>
            `;
            floatBtn.addEventListener('click', () => openTutorialModal(slug));
            document.body.appendChild(floatBtn);
        }
    }

    // =========================================================================
    // 9. AUTO-POPUP ON FIRST VISIT
    // =========================================================================
    function checkAutoPopup() {
        const slug = getCleanPageSlug();

        // Jangan popup di halaman login
        if (slug.includes('login')) return;

        try {
            const isDismissed = localStorage.getItem('sft_page_tut_dismissed_' + slug);
            if (!isDismissed) {
                // Munculkan otomatis setelah halaman tenang (750ms)
                setTimeout(() => {
                    openTutorialModal(slug);
                }, 750);
            }
        } catch (e) {
            console.warn('LocalStorage error in feature tutorial:', e);
        }
    }

    // =========================================================================
    // 10. GLOBAL EXPORTS & INITIALIZATION
    // =========================================================================
    window.sftOpenFeatureTutorial = openTutorialModal;
    window.sftCloseFeatureTutorial = closeTutorialModal;
    window.sftSpotlightStep = spotlightElement;

    function init() {
        injectTutorialStyles();
        injectTriggerButtons();
        checkAutoPopup();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Re-check buttons after dynamic layout updates (e.g. sidebar_desktop.js)
    setTimeout(injectTriggerButtons, 500);
    setTimeout(injectTriggerButtons, 1200);

})();
