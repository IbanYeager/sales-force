<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>Sales App - Dashboard</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="css/style.css?v=20261022_v1">
    <link rel="stylesheet" href="css/index_dashboard.css?v=20261022_v1">
    <link rel="stylesheet" href="css/sales_tools.css?v=1.0">

    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link rel="shortcut icon" href="favicon.ico">
    <link rel="apple-touch-icon" href="image/icons/icon-192x192.png">
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#0d1b3e">
</head>

<body>

    <!-- ═══════════════ DESKTOP SHELL ═══════════════ -->
    <div class="desktop-shell">

        <!-- ═══ SIDEBAR NAVY (desktop/tablet — tersembunyi di mobile) ═══ -->
        <nav class="desktop-sidebar" id="desktopSidebar">

            <!-- Brand -->
            <div class="sidebar-brand">
                <a href="index.html" class="sidebar-brand-logo" title="Tunas Toyota">
                    <img src="image/logo_tunas_toyota.png" alt="Tunas Toyota" class="sidebar-brand-img">
                </a>
            </div>

            <!-- User Glass Card -->
            <a href="pages/profil.html" class="sidebar-user-card">
                <img src="https://ui-avatars.com/api/?name=Sales&background=eef4fd&color=0d1b3e&bold=true" alt="Profile"
                    class="sidebar-user-avatar" id="sidebarAvatar">
                <div class="sidebar-user-info">
                    <span class="sidebar-user-name" id="sidebarNama">Memuat...</span>
                    <span class="sidebar-user-role" id="sidebarRole">Sales</span>
                </div>
                <div class="sidebar-user-dot"></div>
            </a>

            <!-- Search Bar -->
            <div class="sidebar-search-wrap">
                <div class="sidebar-search-box">
                    <i class="fa-solid fa-magnifying-glass sidebar-search-icon"></i>
                    <input type="text" class="sidebar-search-input" id="sidebarSearchInput" placeholder="Cari fitur / menu..." autocomplete="off" spellcheck="false">
                    <button type="button" class="sidebar-search-clear" id="sidebarSearchClear" style="display:none;" title="Bersihkan pencarian">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- Navigasi -->
            <div class="sidebar-nav">
                <p class="sidebar-nav-label">Menu Utama</p>
                <a href="index.html" class="sidebar-nav-link active" data-tags="home beranda ringkasan">
                    <i class="fa-solid fa-house"></i> Dashboard
                </a>
                <a href="pages/mtoyota_service.html" class="sidebar-nav-link" data-tags="booking service mtoyota m-toyota dec do fs1000 purna jual servis berkala upload foto">
                    <i class="fa-solid fa-mobile-screen-button"></i> Booking Service m-Toyota
                </a>
                <a href="pages/input.html" class="sidebar-nav-link" data-tags="input aktivitas laporan suara mic voice spm checkin gps geotag">
                    <i class="fa-solid fa-camera"></i> Laporan &amp; Check-in Aktivitas
                </a>
                <a href="pages/riwayat_foto_aktivitas.html" class="sidebar-nav-link" data-tags="galeri foto aktivitas canvassing riwayat">
                    <i class="fa-solid fa-images"></i> Riwayat Foto Aktivitas
                </a>
                <a href="pages/target.html" class="sidebar-nav-link" data-tags="target spk do pencapaian kuota">
                    <i class="fa-solid fa-bullseye"></i> Target &amp; Pencapaian
                </a>
                <a href="pages/jadwal_input.html" class="sidebar-nav-link" data-tags="kalender jadwal agenda aktivitas reminder follow up">
                    <i class="fa-solid fa-calendar-days"></i> Kalender &amp; Reminder Jadwal
                    <span id="sidebarJadwalBadge" class="sidebar-notif-badge" style="display:none; margin-left:auto; min-width:18px; height:18px; padding:0 5px; background:#c8102e; color:#fff; border-radius:10px; font-size:10px; font-weight:800; align-items:center; justify-content:center;">0</span>
                </a>
                <a href="pages/polreg.html" class="sidebar-nav-link" data-tags="polreg registrasi wilayah peta daerah kuota mobil kota bandung market share">
                    <i class="fa-solid fa-map-location-dot"></i> Peta Polreg Wilayah
                </a>

                <p class="sidebar-nav-label">Tier 1: Closing, Pricing &amp; Stock</p>
                <a href="pages/pricelist.html" class="sidebar-nav-link" data-tags="harga pricelist otr brosur daftar">
                    <i class="fa-solid fa-clipboard-list"></i> Pricelist OTR
                </a>
                <a href="pages/kalkulator.html" class="sidebar-nav-link" data-tags="kalkulator leasing kredit dp cicilan angsuran tenor quotation pdf penawaran odds matriks bca bsi acc taf">
                    <i class="fa-solid fa-calculator"></i> Kalkulator Finansial
                </a>
                <a href="pages/inventory.html" class="sidebar-nav-link" data-tags="stok stock live inventory unit mobil t-stock">
                    <i class="fa-solid fa-warehouse"></i> Live Inventory (Stock)
                </a>
                <a href="pages/customer.html" class="sidebar-nav-link" data-tags="customer crm radar prospek data database">
                    <i class="fa-solid fa-users"></i> Customer CRM &amp; Radar
                </a>
                <a href="pages/spk.html" class="sidebar-nav-link" data-tags="spk pesanan form surat tanda jadi">
                    <i class="fa-solid fa-file-signature"></i> Form SPK
                </a>
                <a href="pages/promo.html" class="sidebar-nav-link" data-tags="promo diskon paket kredit tenor program">
                    <i class="fa-solid fa-percent"></i> Promo &amp; Tenor
                </a>

                <p class="sidebar-nav-label">Tier 2: Media, Delivery &amp; Dokumen</p>
                <a href="pages/video_viral.html" class="sidebar-nav-link" data-tags="media studio video reels tiktok shorts kircon konten instagram serah terima review promo showcase">
                    <i class="fa-solid fa-photo-film"></i> Kircon Media Studio
                </a>
                <a href="pages/flyer.html" class="sidebar-nav-link" data-tags="flyer poster promo wa whatsapp story feed instagram pamflet studio gambar kustom">
                    <i class="fa-solid fa-wand-magic-sparkles"></i> Studio Flyer Promo WA
                    <span style="background:linear-gradient(135deg,#ff385c,#c8102e); color:#fff; font-size:9px; font-weight:800; padding:1px 6px; border-radius:99px; margin-left:auto;">Baru</span>
                </a>
                <a href="pages/do.html" class="sidebar-nav-link" data-tags="do delivery order surat jalan kirim">
                    <i class="fa-solid fa-truck"></i> Surat Jalan (DO)
                </a>
                <a href="pages/deal.html" class="sidebar-nav-link" data-tags="deal pipeline closing tahap prospek">
                    <i class="fa-solid fa-handshake"></i> Deal Pipeline
                </a>
                <a href="pages/testdrive.html" class="sidebar-nav-link" data-tags="test drive uji coba mobil showroom rental rekanan riwayat booking">
                    <i class="fa-solid fa-car-side"></i> Pusat Test Drive &amp; Booking
                </a>
                <a href="pages/dokumen.html" class="sidebar-nav-link" data-tags="dokumen berkas ktp kk berkas leasing">
                    <i class="fa-solid fa-receipt"></i> Manajemen Dokumen
                </a>

                <p class="sidebar-nav-label">Tier 3: Product Knowledge &amp; Pasar</p>
                <a href="pages/elibrary.html" class="sidebar-nav-link" data-tags="catalog ecatalog e-catalog library brosur pdf spesifikasi mobil">
                    <i class="fa-solid fa-book-open"></i> E-Catalog
                </a>
                <a href="pages/market_analysis.html" class="sidebar-nav-link" data-tags="pasar market analisis wilayah pangsa bbn plat kodepos kecamatan komplek">
                    <i class="fa-solid fa-chart-pie"></i> Analisis Pasar &amp; Kanvasing
                </a>
                <a href="pages/penjualan_kircon.html" class="sidebar-nav-link" data-tags="penjualan kircon kiara condong rekap cabang">
                    <i class="fa-solid fa-chart-line"></i> Penjualan Kiara Condong
                </a>

                <p class="sidebar-nav-label">Tier 4: Trade-In, Aksesoris &amp; Merch</p>
                <a href="pages/tradein.html" class="sidebar-nav-link" data-tags="trade in tukar tambah over kredit mobil bekas inspeksi fisik jadwal appraisal olx riset pasar">
                    <i class="fa-solid fa-right-left"></i> Trade-In &amp; Mobil Bekas Center
                </a>
                <a href="pages/tco.html" class="sidebar-nav-link" data-tags="tco aksesoris custom bodykit kaca film karpet">
                    <i class="fa-solid fa-car-tunnel"></i> Aksesoris TCO &amp; Builder
                </a>
                <a href="pages/velg.html" class="sidebar-nav-link" data-tags="velg ban wheel variasi">
                    <i class="fa-solid fa-compact-disc"></i> Velg &amp; Ban Customizer
                </a>
                <a href="pages/merchandise.html" class="sidebar-nav-link" data-tags="merch baju kaos topi gantungan payung jaket">
                    <i class="fa-solid fa-shirt"></i> Merchandise Toyota
                </a>

                <p class="sidebar-nav-label">Tier 5: Refreshment &amp; Games</p>
                <a href="pages/catur.html" class="sidebar-nav-link" data-tags="catur chess strategi">
                    <i class="fa-solid fa-chess-knight"></i> Toyota Catur Master
                </a>
                <a href="pages/balap.html" class="sidebar-nav-link" data-tags="racing balapan sirkuit">
                    <i class="fa-solid fa-flag-checkered"></i> Toyota GR Racing
                </a>
                <a href="pages/snake.html" class="sidebar-nav-link" data-tags="snake ular drift pom bensin">
                    <i class="fa-solid fa-gas-pump"></i> Parkir Drift &amp; Fuel Rush
                </a>
                <a href="pages/tebak.html" class="sidebar-nav-link" data-tags="tebak kuis trivia">
                    <i class="fa-solid fa-brain"></i> Tebak Otomotif
                </a>
                <a href="pages/tts.html" class="sidebar-nav-link" data-tags="tts teka teki silang">
                    <i class="fa-solid fa-puzzle-piece"></i> TTS Otomotif
                </a>

                <div class="sidebar-search-empty" id="sidebarSearchEmpty" style="display:none;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <div style="font-weight:700; color:#fff; margin-bottom:2px;">Fitur tidak ditemukan</div>
                    <div style="font-size:11px; opacity:0.8;">Coba gunakan kata kunci lain</div>
                </div>
            </div>

            <!-- Bawah: Notifikasi & Profil -->
            <div class="sidebar-bottom">
                <a href="javascript:void(0)" onclick="if(window.triggerPwaInstall) window.triggerPwaInstall();" class="sidebar-notif-btn" id="sidebarPwaInstallBtn" style="margin-bottom:4px; display:none; color: #cc1426; font-weight: 700;">
                    <i class="fa-solid fa-download"></i>
                    Install SFT App
                </a>
                <a href="pages/notifikasi.html" class="sidebar-notif-btn">
                    <i class="fa-regular fa-bell"></i>
                    Notifikasi
                    <span class="sidebar-notif-badge" id="sidebarBellBadge" style="display:none;">0</span>
                </a>
                <a href="pages/profil.html" class="sidebar-notif-btn" style="margin-top:4px;">
                    <i class="fa-solid fa-user"></i>
                    Profil Saya
                </a>
            </div>
        </nav>

        <!-- ═══════════════ KONTEN UTAMA ═══════════════ -->
        <div class="desktop-content">

            <div class="mobile-app">

                <!-- ═══ HERO HEADER ═══ -->
                <header class="header-home">
                    <div class="user-info">
                        <div class="profile-wrap">
                            <div class="avatar-container" onclick="window.location.href='pages/profil.html'">
                                <img src="https://ui-avatars.com/api/?name=Sales&background=eef4fd&color=0d1b3e&bold=true"
                                    alt="Profile" class="avatar" id="dashAvatar">
                                <div class="status-dot"></div>
                            </div>
                            <div class="greeting">
                                <p id="dashGreeting">Selamat Pagi,</p>
                                <h2 id="dashNama">
                                    <div class="skeleton-box skeleton-title" style="margin: 0;"></div>
                                </h2>
                                <span class="role" id="dashRole">
                                    <div class="skeleton-box skeleton-text-short" style="margin: 2px 0;"></div>
                                </span>
                                <div class="greeting-meta">
                                    <span class="spv-label" id="dashSPV">
                                        <div class="skeleton-box skeleton-text-short" style="margin: 2px 0;"></div>
                                    </span>
                                    <span class="location"><i class="fa-solid fa-location-dot"></i> <span
                                            id="dashCabang">
                                            <div class="skeleton-box skeleton-text-short"
                                                style="display:inline-block; margin: 0; vertical-align: middle;"></div>
                                        </span></span>
                                    <span class="location"><i class="fa-regular fa-clock"></i> <span
                                            id="dashClock">00:00:00</span> WIB</span>
                                </div>
                            </div>
                        </div>
                        <div class="bell-icon" onclick="window.location.href='pages/notifikasi.html'">
                            <a href="pages/notifikasi.html" style="color: inherit;">
                                <i class="fa-regular fa-bell"></i>
                            </a>
                            <div class="badge badge-count-red" id="bellBadge" style="display:none;">0</div>
                        </div>
                    </div>
                </header>

                <div class="container">

                    <!-- ═══ WIDGET MORNING BRIEFING AGENDA FOLLOW-UP ═══ -->
                    <div id="dailyFollowupBriefingContainer"></div>
                    <div id="spvAiVoiceBriefingContainer"></div>

                    <!-- ═══ KARTU TARGET SPK & DO ═══ -->
                    <a href="pages/target.html" class="target-link">
                        <div class="card target-card tgt-card">
                            <div class="target-header tgt-head">
                                <span class="tgt-title"><i class="fa-solid fa-bullseye"></i>Target &amp; Pencapaian SPK
                                    &amp; DO</span>
                                <span class="target-period" id="dashPeriode">Memuat...</span>
                            </div>

                            <!-- Grid 3 Metrik -->
                            <div class="tgt-grid">
                                <!-- SPK Bulanan -->
                                <div class="tgt-metric is-blue">
                                    <span class="tgt-metric-label"><i class="fa-solid fa-file-invoice"></i><span
                                            id="dashPeriodeSpk">SPK BLN INI</span></span>
                                    <div class="progress-circle tgt-circle" id="dashCircleSpk">
                                        <span id="dashPersentaseSpk">0%</span>
                                    </div>
                                    <span class="tgt-metric-value"><span id="dashRealisasiSpk">0</span><span
                                            class="tgt-metric-total"> / <span id="dashTargetSpk">0</span></span></span>
                                    <div class="linear-progress-bar">
                                        <div class="linear-progress-fill" id="dashLinearSpk"></div>
                                    </div>
                                    <span class="tgt-metric-note" id="dashSisaPesanSpk">Memuat...</span>
                                </div>

                                <!-- DO Bulanan -->
                                <div class="tgt-metric is-green">
                                    <span class="tgt-metric-label"><i class="fa-solid fa-boxes-packing"></i><span>DO BLN
                                            INI</span></span>
                                    <div class="progress-circle tgt-circle" id="dashCircleDoBulan">
                                        <span id="dashPersentaseDoBulan">0%</span>
                                    </div>
                                    <span class="tgt-metric-value"><span id="dashRealisasiDoBulan">0</span><span
                                            class="tgt-metric-total"> / <span
                                                id="dashTargetDoBulan">0</span></span></span>
                                    <div class="linear-progress-bar">
                                        <div class="linear-progress-fill" id="dashLinearDoBulan"></div>
                                    </div>
                                    <span class="tgt-metric-note" id="dashSisaPesanDoBulan">Memuat...</span>
                                </div>

                                <!-- DO Evaluasi -->
                                <div class="tgt-metric is-teal">
                                    <span class="tgt-metric-label"><i class="fa-solid fa-truck-ramp-box"></i><span>DO (4
                                            BLN)</span></span>
                                    <div class="progress-circle tgt-circle" id="dashCircleDo">
                                        <span id="dashPersentaseDo">0%</span>
                                    </div>
                                    <span class="tgt-metric-value"><span id="dashRealisasiDo">0</span><span
                                            class="tgt-metric-total"> / <span id="dashTargetDo">0</span></span></span>
                                    <div class="linear-progress-bar">
                                        <div class="linear-progress-fill" id="dashLinearDo"></div>
                                    </div>
                                    <span class="tgt-metric-note" id="dashSisaPesanDo">Memuat...</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    <!-- ═══ CTA UTAMA ═══ -->
                    <a href="pages/input.html" class="btn-input-aktivitas">
                        <div class="btn-input-left">
                            <div class="btn-icon-wrapper">
                                <i class="fa-solid fa-camera"></i>
                            </div>
                            <div class="btn-input-text">
                                <h4>Input Aktivitas Hari Ini</h4>
                                <p>Laporkan kegiatan Anda sekarang</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right"></i>
                    </a>

                    <a href="#" onclick="openModal('spkDoModal', event)" class="btn-input-spk">
                        <div class="btn-input-left">
                            <div class="btn-icon-wrapper">
                                <i class="fa-solid fa-file-signature"></i>
                            </div>
                            <div class="btn-input-text">
                                <h4>Input Pencapaian SPK &amp; DO</h4>
                                <p>Laporkan SPK &amp; DO Anda</p>
                            </div>
                        </div>
                        <i class="fa-solid fa-chevron-right"></i>
                    </a>

                    <!-- ═══ FITUR UTAMA (PERMANEN: 4 Fitur Paling Kritis & Penting untuk Sales Consultant) ═══ -->
                    <div class="section-header-row">
                        <h3 class="section-title"><i class="fa-solid fa-grid-2"
                                style="color: var(--primary-red); margin-right: 4px;"></i> Fitur Utama</h3>
                        <a href="#" class="link-lihat-semua" onclick="openFeatureModal(event)">Lihat semua</a>
                    </div>

                    <!-- 
                    ══════════════════════════════════════════════════════════════════════════════════════
                    ⚠️ NOTE PENTING (JANGAN DIUBAH): 
                    Bagian 'Fitur Utama' ini sengaja dikunci & dibatasi HANYA MENAMPILKAN 4 FITUR UTAMA PALING 
                    PENTING & KRITIS UNTUK SALES (Pricelist OTR, Kalkulator Kredit, Live Inventory, Customer CRM) 
                    dengan TEMA ICON MERAH SERAGAM (Toyota Red Gradient) agar efisiensi kerja sales maksimal dan 
                    tampilan dashboard selalu presisi serta rapi. 
                    Semua fitur lainnya dapat diakses melalui tombol 'Lihat semua' (pop-up modal featureModal).
                    ══════════════════════════════════════════════════════════════════════════════════════ 
                    -->
                    <div class="card category-card">
                        <div class="category-grid main-feature-grid">
                            <a href="pages/pricelist.html" class="category-item">
                                <div class="category-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                                <span class="category-text">Pricelist OTR</span>
                            </a>
                            <a href="pages/elibrary.html" class="category-item">
                                <div class="category-icon"><i class="fa-solid fa-book-open"></i></div>
                                <span class="category-text">E-Catalog</span>
                            </a>
                            <a href="pages/inventory.html" class="category-item">
                                <div class="category-icon"><i class="fa-solid fa-warehouse"></i></div>
                                <span class="category-text">Live Inventory</span>
                            </a>
                            <a href="pages/promo.html" class="category-item">
                                <div class="category-icon"><i class="fa-solid fa-percent"></i></div>
                                <span class="category-text">Promo &amp; Tenor</span>
                            </a>
                        </div>
                    </div>

                    <!-- ═══ KIRCON MEDIA STUDIO BANNER ═══ -->
                    <a href="pages/video_viral.html" class="card kircon-studio-banner" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                        <div class="kircon-banner-row">
                            <div class="kircon-banner-left">
                                <div class="kircon-banner-icon">
                                    <i class="fa-solid fa-photo-film"></i>
                                </div>
                                <div class="kircon-banner-text">
                                    <div class="kircon-banner-title-wrap">
                                        <h4 class="kircon-banner-title">Kircon Media Studio</h4>
                                        <span class="kircon-banner-tag">SHOWCASE</span>
                                    </div>
                                    <p class="kircon-banner-sub">Pusat video showcase &amp; inspirasi serah terima, review fitur Toyota, serta materi promosi WhatsApp</p>
                                </div>
                            </div>
                            <div class="kircon-banner-btn">
                                <span>Buka Media Hub</span>
                                <i class="fa-solid fa-arrow-right" style="font-size:11px;"></i>
                            </div>
                        </div>
                    </a>

                    <!-- ═══ STUDIO POSTER & FLYER PROMO WA BANNER ═══ -->
                    <a href="pages/flyer.html" class="card kircon-studio-banner" style="margin-bottom: 16px;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">
                        <div class="kircon-banner-row">
                            <div class="kircon-banner-left">
                                <div class="kircon-banner-icon">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                                </div>
                                <div class="kircon-banner-text">
                                    <div class="kircon-banner-title-wrap">
                                        <h4 class="kircon-banner-title">Studio Poster &amp; Flyer Promo WA</h4>
                                        <span class="kircon-banner-tag">FITUR BARU</span>
                                    </div>
                                    <p class="kircon-banner-sub">Buat poster promosi instan kustom: ganti background, multi-mobil, teks cicilan/DP, dan foto diri Anda</p>
                                </div>
                            </div>
                            <div class="kircon-banner-btn">
                                <span>Buka Studio</span>
                                <i class="fa-solid fa-arrow-right" style="font-size:11px;"></i>
                            </div>
                        </div>
                    </a>

                    <!-- ═══ RINGKASAN ═══ -->
                    <div class="section-header-row">
                        <h3 class="section-title">Ringkasan</h3>
                    </div>
                    <div class="grid-2">
                        <div class="summary-card" style="--accent-color: var(--green-success);">
                            <div class="icon-circle bg-light-green"><i class="fa-solid fa-phone"></i></div>
                            <div class="summary-info">
                                <p class="summary-label">Follow Up</p>
                                <h4 id="summaryFollowUp">0</h4>
                                <span class="summary-sub">Aktivitas</span>
                            </div>
                        </div>
                        <div class="summary-card" style="--accent-color: var(--accent-blue);">
                            <div class="icon-circle bg-light-blue"><i class="fa-solid fa-car-side"></i></div>
                            <div class="summary-info">
                                <p class="summary-label">Test Drive</p>
                                <h4 id="summaryTestDrive">0</h4>
                                <span class="summary-sub">Aktivitas</span>
                            </div>
                        </div>
                        <div class="summary-card" style="--accent-color: var(--yellow-warn);">
                            <div class="icon-circle bg-light-yellow"><i class="fa-solid fa-file-signature"></i></div>
                            <div class="summary-info">
                                <p class="summary-label">SPK</p>
                                <h4 id="summarySPK">0</h4>
                                <span class="summary-sub">Aktivitas</span>
                            </div>
                        </div>
                        <div class="summary-card" style="--accent-color: var(--purple-accent);">
                            <div class="icon-circle bg-light-purple"><i class="fa-solid fa-camera"></i></div>
                            <div class="summary-info">
                                <p class="summary-label">Foto Aktivitas</p>
                                <h4 id="summaryFoto">0</h4>
                                <span class="summary-sub">Aktivitas</span>
                            </div>
                        </div>
                    </div>

                    <!-- ═══ MARKET RESEARCH & CUSTOMER PROFILE (YTD 2025) ═══ -->
                    <div class="section-header-row" style="margin-top: 20px;">
                        <h3 class="section-title"><i class="fa-solid fa-magnifying-glass-chart"
                                style="color: var(--primary-red); margin-right: 4px;"></i> Market Research &amp; Profil Konsumen</h3>
                        <span style="font-size: 11px; font-weight: 700; color: var(--text-muted);">YTD 2025</span>
                    </div>

                    <div class="mr-container" style="margin-bottom: 20px;">
                        <!-- Left: Dealer Network Radius Map -->
                        <div class="mr-card">
                            <div class="mr-header">
                                <div class="mr-title">
                                    <i class="fa-solid fa-compass" style="color: var(--primary-red); font-size: 15px;"></i>
                                    Pemetaan Network Dealer &amp; Radius
                                </div>
                                <span style="font-size: 10.5px; font-weight: 700; color: var(--text-muted);">Bandung Raya</span>
                            </div>

                            <div class="mr-ring-grid">
                                <div class="mr-ring-box mr-ring-1">
                                    <div class="mr-ring-head">
                                        <span><i class="fa-solid fa-circle-dot"></i> RING 1 (&lt; 5 KM)</span>
                                        <span>5 Dealer</span>
                                    </div>
                                    <div class="mr-ring-tags">
                                        <span class="mr-ring-tag">1. Tunas Toyota Gatsu</span>
                                        <span class="mr-ring-tag">2. Plaza Toyota Bandung</span>
                                        <span class="mr-ring-tag">3. Wijaya Toyota A. Yani</span>
                                        <span class="mr-ring-tag">4. A2000 Bandung Suci</span>
                                        <span class="mr-ring-tag">5. A2000 Asia Afrika</span>
                                    </div>
                                </div>

                                <div class="mr-ring-box mr-ring-2">
                                    <div class="mr-ring-head">
                                        <span><i class="fa-solid fa-circle-dot"></i> RING 2 (&lt; 10 KM)</span>
                                        <span>5 Dealer</span>
                                    </div>
                                    <div class="mr-ring-tags">
                                        <span class="mr-ring-tag">6. Wijaya Toyota Dago</span>
                                        <span class="mr-ring-tag">7. A2000 Cibiru</span>
                                        <span class="mr-ring-tag">8. A2000 Soetta</span>
                                        <span class="mr-ring-tag">9. A2000 Setia Budi</span>
                                        <span class="mr-ring-tag">10. A2000 Pasteur</span>
                                    </div>
                                </div>

                                <div class="mr-ring-box mr-ring-3">
                                    <div class="mr-ring-head">
                                        <span><i class="fa-solid fa-circle-dot"></i> RING 3 (&gt; 10 KM)</span>
                                        <span>4 Dealer</span>
                                    </div>
                                    <div class="mr-ring-tags">
                                        <span class="mr-ring-tag">11. Tunas Toyota Cimindi</span>
                                        <span class="mr-ring-tag">12. A2000 Soreang</span>
                                        <span class="mr-ring-tag">13. A2000 Rancaekek</span>
                                        <span class="mr-ring-tag">14. Wijaya Toyota Padalarang</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Customer Profile Grid -->
                        <div class="mr-card">
                            <div class="mr-header">
                                <div class="mr-title">
                                    <i class="fa-solid fa-user-gear" style="color: var(--accent-blue); font-size: 15px;"></i>
                                    Profil Pelanggan (Customer Profile)
                                </div>
                                <span style="font-size: 10.5px; font-weight: 700; color: #059669; background: #d1fae5; padding: 2px 8px; border-radius: 6px;">Demografi</span>
                            </div>

                            <div class="cp-grid">
                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #ffe4e6; color: #d7123a;"><i class="fa-solid fa-car"></i></div>
                                    <div>
                                        <div class="cp-label">Car Segment</div>
                                        <div class="cp-val">55%</div>
                                        <div class="cp-sub">Middle - Low</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #dbeafe; color: #2563eb;"><i class="fa-solid fa-car-side"></i></div>
                                    <div>
                                        <div class="cp-label">Car Type</div>
                                        <div class="cp-val">21%</div>
                                        <div class="cp-sub">Avanza</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #fef3c7; color: #d97706;"><i class="fa-solid fa-share-nodes"></i></div>
                                    <div>
                                        <div class="cp-label">Source of Sales</div>
                                        <div class="cp-val">38%</div>
                                        <div class="cp-sub">Digital Channel</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #d1fae5; color: #059669;"><i class="fa-solid fa-cart-plus"></i></div>
                                    <div>
                                        <div class="cp-label">Demand Structure</div>
                                        <div class="cp-val">46%</div>
                                        <div class="cp-sub">Additional Unit</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #f3e8ff; color: #7c3aed;"><i class="fa-solid fa-user-clock"></i></div>
                                    <div>
                                        <div class="cp-label">Rentang Usia</div>
                                        <div class="cp-val">49%</div>
                                        <div class="cp-sub">30 – 40 Tahun</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #e0f2fe; color: #0284c7;"><i class="fa-solid fa-users"></i></div>
                                    <div>
                                        <div class="cp-label">Customer Type</div>
                                        <div class="cp-val">81%</div>
                                        <div class="cp-sub">Retail Customer</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #ffedd5; color: #ea580c;"><i class="fa-solid fa-briefcase"></i></div>
                                    <div>
                                        <div class="cp-label">Pekerjaan Utama</div>
                                        <div class="cp-val">31%</div>
                                        <div class="cp-sub">Employee / Karyawan</div>
                                    </div>
                                </div>

                                <div class="cp-item">
                                    <div class="cp-icon" style="background: #fce7f3; color: #db2777;"><i class="fa-solid fa-mars"></i></div>
                                    <div>
                                        <div class="cp-label">Jenis Kelamin</div>
                                        <div class="cp-val">72%</div>
                                        <div class="cp-sub">Pria (Male)</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- ═══ LEADERBOARD ═══ -->
                    <div class="card leaderboard-card">
                        <div class="leaderboard-head">
                            <div class="leaderboard-title-wrap">
                                <div class="leaderboard-trophy">
                                    <i class="fa-solid fa-trophy"></i>
                                </div>
                                <div>
                                    <span class="leaderboard-title">Top 3 Sales</span>
                                    <p class="leaderboard-sub">PERINGKAT BULAN INI</p>
                                </div>
                            </div>
                            <select id="leaderboardMode" class="leaderboard-select" onchange="renderLeaderboard()">
                                <option value="all">Semua Tim</option>
                                <option value="team">Tim Saya</option>
                            </select>
                        </div>
                        <div id="leaderboardList" class="leaderboard-list">
                            <p class="mini-loading">Memuat data...</p>
                        </div>
                    </div>

                    <!-- Quick Access: Inspeksi Customer & Jadwal Showroom -->
                    <div class="quick-access-grid">
                        <a href="pages/tradein.html?tab=inspeksi" style="text-decoration: none;">
                            <div class="card quick-access-card qa-card-inspect">
                                <div class="qa-icon-wrap bg-red-icon">
                                    <i class="fa-solid fa-car-rear"></i>
                                </div>
                                <div class="qa-text-wrap">
                                    <h4>Checklist Inspeksi Mobil</h4>
                                    <p>Upload data &amp; taksiran Trade-in</p>
                                </div>
                            </div>
                        </a>

                        <a href="pages/tradein.html?tab=jadwal" style="text-decoration: none;">
                            <div class="card quick-access-card qa-card-sched">
                                <div class="qa-icon-wrap bg-indigo-icon">
                                    <i class="fa-solid fa-calendar-check"></i>
                                </div>
                                <div class="qa-text-wrap">
                                    <h4>Jadwal Janji Temu Showroom</h4>
                                    <p>Monitoring booking appraisal</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    <!-- ═══ PENCAPAIAN TRADE-IN OLX (PER SPV) ═══ -->
                    <div class="olx-achieve-card edge-pad" style="margin-top: 20px;">
                        <div class="olx-achieve-header">
                            <div class="olx-achieve-title-wrap">
                                <div class="olx-achieve-icon">
                                    <i class="fa-solid fa-handshake-simple"></i>
                                </div>
                                <div>
                                    <h3 class="olx-achieve-title">Pencapaian OLX (Per SPV)</h3>
                                    <p class="olx-achieve-subtitle">Rekap Trade-In unit per Supervisor &amp; Hasil Deal</p>
                                </div>
                            </div>
                            <div class="olx-month-wrap">
                                <label for="olxAchievementMonthSelect" class="olx-month-label"><i class="fa-regular fa-calendar"></i> Periode:</label>
                                <select id="olxAchievementMonthSelect" class="olx-month-select" onchange="loadOlxAchievementData()">
                                    <option value="all" selected>Semua Periode (Total 33 Deal)</option>
                                    <option value="Januari 2026">Januari 2026</option>
                                    <option value="Februari 2026">Februari 2026</option>
                                    <option value="Maret 2026">Maret 2026</option>
                                    <option value="April 2026">April 2026</option>
                                    <option value="Mei 2026">Mei 2026</option>
                                    <option value="Juni 2026">Juni 2026</option>
                                    <option value="Juli 2026">Juli 2026</option>
                                    <option value="Agustus 2026">Agustus 2026</option>
                                    <option value="September 2026">September 2026</option>
                                </select>
                            </div>
                        </div>

                        <!-- Ringkasan Statistik OLX Global -->
                        <div class="olx-overview-grid">
                            <div class="olx-ov-card">
                                <div class="olx-ov-icon" style="background: #e0f2fe; color: #0284c7;">
                                    <i class="fa-solid fa-car-tunnel"></i>
                                </div>
                                <div>
                                    <div class="olx-ov-label">Total Unit</div>
                                    <div class="olx-ov-val" id="olxOvTotalUnit">0 Unit</div>
                                    <div class="olx-ov-sub" style="color: #64748b;" id="olxOvSubUnit">Trade-In</div>
                                </div>
                            </div>

                            <div class="olx-ov-card">
                                <div class="olx-ov-icon" style="background: #d1fae5; color: #059669;">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                                <div>
                                    <div class="olx-ov-label">Unit Deal</div>
                                    <div class="olx-ov-val" id="olxOvTotalDeal">0 Deal</div>
                                    <div class="olx-ov-sub" id="olxOvWinRate">Win Rate: 0%</div>
                                </div>
                            </div>
                        </div>

                        <!-- Container Daftar SPV -->
                        <div id="olxSpvContainer" class="olx-spv-list">
                            <p class="mini-loading"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data pencapaian per SPV...</p>
                        </div>
                    </div>
                </div>

                <!-- ═══ AKTIVITAS TERAKHIR ═══ -->
                <div class="edge-pad">
                    <div class="section-header-row">
                        <h3 class="section-title">Aktivitas Terakhir</h3>
                        <a href="#" class="link-lihat-semua" onclick="openModal('aktivitasModal', event)">Lihat
                            Semua</a>
                    </div>
                </div>
                <div id="latestActivityContainer" class="edge-pad latest-activity-wrap">
                    <!-- Dimuat dinamis dari database -->
                    <div class="card activity-card" style="opacity: 0.7;">
                        <div class="activity-details">
                            <p class="activity-desc" style="margin: 0;"><i class="fa-solid fa-spinner fa-spin"
                                    style="margin-right: 6px;"></i> Memuat aktivitas terbaru...</p>
                        </div>
                    </div>
                </div>

                <!-- ═══ UPDATE TRADE-IN ═══ -->
                <div class="edge-pad">
                    <div class="section-header-row">
                        <h3 class="section-title">Update Trade-In OLX</h3>
                        <a href="#" class="link-lihat-semua" onclick="openModal('olxModal', event)">Lihat Semua</a>
                    </div>
                </div>
                <div class="card tradein-card">
                    <div id="dashboardTradeInList" class="tradein-list">
                        <p class="mini-loading">Memuat data...</p>
                    </div>
                </div>

                <!-- ═══ BOTTOM NAV — Floating Glass Dock (mobile) ═══ -->
                <nav class="bottom-nav">
                    <a href="/index.html" class="nav-item active"><i class="fa-solid fa-house"></i><span
                            class="nav-text">Home</span></a>
                    <a href="/pages/pricelist.html" class="nav-item"><i class="fa-solid fa-clipboard-list"></i><span
                            class="nav-text">Harga</span></a>
                    <a href="/pages/input.html" class="nav-item center-btn">
                        <div class="center-btn-inner">
                            <i class="fa-solid fa-camera"></i>
                        </div>
                    </a>
                    <a href="/pages/testdrive.html" class="nav-item"><i class="fa-solid fa-car-side"></i><span
                            class="nav-text">Tes Drive</span></a>
                    <a href="/pages/profil.html" class="nav-item"><i class="fa-solid fa-user"></i><span
                            class="nav-text">Profil</span></a>
                </nav>


                <!-- ═══ MODAL: SEMUA FITUR (Lengkap & Terorganisir) ═══ -->
                <div class="modal-overlay" id="featureModal" onclick="closeFeatureModal()" style="overscroll-behavior: contain; touch-action: none;">
                    <div class="modal-content" onclick="event.stopPropagation()" style="max-height: 88dvh; max-height: 88vh; display: flex; flex-direction: column; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;">
                        <div class="modal-drag-handle"></div>
                        <div class="modal-header" style="flex-shrink: 0; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9;">
                            <div>
                                <h3 style="margin:0; font-size: 17px; font-weight: 800; color: #0f172a; display: flex; align-items: center; gap: 8px;">
                                    <i class="fa-solid fa-grid-2" style="color: var(--primary-red);"></i> Semua Fitur Sales App
                                </h3>
                                <p style="margin: 2px 0 0 0; font-size: 11.5px; color: #64748b;">Katalog lengkap 49+ fitur operasional, closing, AI tools &amp; media hub</p>
                            </div>
                            <button type="button" class="btn-close-modal" onclick="closeFeatureModal()"><i class="fa-solid fa-xmark"></i></button>
                        </div>

                        <!-- In-Modal Quick Search -->
                        <div style="padding: 12px 16px 8px; flex-shrink: 0; background: #ffffff;">
                            <div style="position: relative; display: flex; align-items: center;">
                                <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; color: #94a3b8; font-size: 13px;"></i>
                                <input type="text" id="featureModalSearchInput" placeholder="Cari nama fitur (contoh: STNK, Stok, Kalender, Media, SPK)..." 
                                       style="width: 100%; box-sizing: border-box; padding: 10px 38px 10px 38px; border-radius: 12px; border: 1.5px solid #e2e8f0; background: #f8fafc; font-size: 14px; outline: none; font-family: inherit; transition: all 0.2s;"
                                       oninput="filterModalFeatures(this.value)">
                                <button type="button" id="featureModalSearchClear" onclick="clearFeatureModalSearch()" 
                                        style="display:none; position: absolute; right: 12px; background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 14px;">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                        </div>

                        <div class="category-grid feature-modal-grid" style="overflow-y: auto; flex: 1; padding: 10px 14px 24px !important; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; touch-action: pan-y;">
                            <!-- SECTION: MENU UTAMA & OPERASIONAL HARIAN -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 10px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-compass" style="color: var(--primary-red);"></i> Menu Utama &amp; Operasional Harian
                            </div>

                            <a href="pages/input.html" class="category-item modal-feature-item" data-tags="input aktivitas checkin geotag spm gps suara mic laporan">
                                <div class="category-icon"><i class="fa-solid fa-camera"></i></div>
                                <span class="category-text">Check-in Aktivitas</span>
                            </a>
                            <a href="pages/riwayat_foto_aktivitas.html" class="category-item modal-feature-item" data-tags="galeri foto canvassing aktivitas riwayat lapangan">
                                <div class="category-icon"><i class="fa-solid fa-images"></i></div>
                                <span class="category-text">Riwayat Foto</span>
                            </a>
                            <a href="pages/target.html" class="category-item modal-feature-item" data-tags="target spk do pencapaian kuota bonus komisi">
                                <div class="category-icon"><i class="fa-solid fa-bullseye"></i></div>
                                <span class="category-text">Target &amp; Capaian</span>
                            </a>
                            <a href="pages/jadwal_input.html" class="category-item modal-feature-item" data-tags="kalender jadwal agenda aktivitas reminder follow up stnk servis">
                                <div class="category-icon" style="position: relative;">
                                    <i class="fa-solid fa-calendar-days"></i>
                                    <span id="featureModalJadwalBadge" class="feature-notif-badge" style="display: none; position: absolute; top: -6px; right: -6px; min-width: 18px; height: 18px; padding: 0 4px; background: #c8102e; color: #fff; border-radius: 999px; font-size: 10px; font-weight: 800; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 2px 6px rgba(200,16,46,0.4); line-height: 1;">0</span>
                                </div>
                                <span class="category-text">Kalender &amp; Jadwal</span>
                            </a>
                            <a href="pages/polreg.html" class="category-item modal-feature-item" data-tags="polreg registrasi wilayah peta daerah kuota mobil kota bandung market share">
                                <div class="category-icon"><i class="fa-solid fa-map-location-dot"></i></div>
                                <span class="category-text">Peta Polreg</span>
                            </a>

                            <!-- SECTION: TIER 1 CLOSING, PRICING & STOCK -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-tags" style="color: #2563eb;"></i> Tier 1: Closing, Pricing &amp; Stock
                            </div>

                            <a href="pages/pricelist.html" class="category-item modal-feature-item" data-tags="harga pricelist otr brosur daftar">
                                <div class="category-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                                <span class="category-text">Pricelist OTR</span>
                            </a>
                            <a href="pages/kalkulator.html" class="category-item modal-feature-item" data-tags="kalkulator leasing kredit dp cicilan angsuran tenor quotation pdf penawaran odds matriks bca bsi acc taf">
                                <div class="category-icon"><i class="fa-solid fa-calculator"></i></div>
                                <span class="category-text">Kalkulator Kredit</span>
                            </a>
                            <a href="pages/inventory.html" class="category-item modal-feature-item" data-tags="stok stock live inventory unit mobil t-stock ready">
                                <div class="category-icon"><i class="fa-solid fa-warehouse"></i></div>
                                <span class="category-text">Live Inventory</span>
                            </a>
                            <a href="pages/customer.html" class="category-item modal-feature-item" data-tags="customer crm radar prospek data database lead">
                                <div class="category-icon"><i class="fa-solid fa-users"></i></div>
                                <span class="category-text">Customer CRM</span>
                            </a>
                            <a href="pages/spk.html" class="category-item modal-feature-item" data-tags="spk pesanan form surat tanda jadi">
                                <div class="category-icon"><i class="fa-solid fa-file-signature"></i></div>
                                <span class="category-text">Form SPK</span>
                            </a>
                            <a href="pages/promo.html" class="category-item modal-feature-item" data-tags="promo diskon paket kredit tenor program bunga">
                                <div class="category-icon"><i class="fa-solid fa-percent"></i></div>
                                <span class="category-text">Promo &amp; Tenor</span>
                            </a>
                            <a href="pages/tradein.html" class="category-item modal-feature-item" data-tags="trade in tukar tambah over kredit mobil bekas inspeksi fisik jadwal appraisal olx riset pasar">
                                <div class="category-icon"><i class="fa-solid fa-right-left"></i></div>
                                <span class="category-text">Trade-In Center</span>
                            </a>

                            <!-- SECTION: TIER 2 MEDIA HUB, DELIVERY & DOKUMEN -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-photo-film" style="color: #c8102e;"></i> Tier 2: Media, Delivery &amp; Dokumen
                            </div>

                            <a href="pages/video_viral.html" class="category-item modal-feature-item" data-tags="media studio video reels tiktok shorts kircon konten instagram serah terima review promo showcase viral">
                                <div class="category-icon"><i class="fa-solid fa-photo-film"></i></div>
                                <span class="category-text">Media Studio</span>
                            </a>
                            <a href="pages/flyer.html" class="category-item modal-feature-item" data-tags="flyer poster promo wa studio banner gambar brosur promosi wa story feed template sales kustom">
                                <div class="category-icon"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                                <span class="category-text">Studio Flyer WA</span>
                            </a>
                            <a href="pages/mtoyota_service.html" class="category-item modal-feature-item" data-tags="booking service mtoyota m-toyota dec do fs1000 purna jual servis berkala upload foto">
                                <div class="category-icon" style="background:#ffe4e6; color:#d7123a;"><i class="fa-solid fa-mobile-screen-button"></i></div>
                                <span class="category-text">m-Toyota Service</span>
                            </a>
                            <a href="pages/do.html" class="category-item modal-feature-item" data-tags="do delivery order surat jalan kirim serah terima cetak do">
                                <div class="category-icon"><i class="fa-solid fa-truck"></i></div>
                                <span class="category-text">Surat Jalan (DO)</span>
                            </a>
                            <a href="pages/deal.html" class="category-item modal-feature-item" data-tags="deal pipeline closing tahap prospek negosiasi">
                                <div class="category-icon"><i class="fa-solid fa-handshake"></i></div>
                                <span class="category-text">Deal Pipeline</span>
                            </a>
                            <a href="pages/testdrive.html" class="category-item modal-feature-item" data-tags="test drive uji coba mobil showroom rental rekanan riwayat booking">
                                <div class="category-icon"><i class="fa-solid fa-car-side"></i></div>
                                <span class="category-text">Test Drive Center</span>
                            </a>
                            <a href="pages/dokumen.html" class="category-item modal-feature-item" data-tags="dokumen berkas ktp kk berkas leasing upload storage">
                                <div class="category-icon"><i class="fa-solid fa-receipt"></i></div>
                                <span class="category-text">Dokumen</span>
                            </a>

                            <!-- SECTION: TIER 3 PRODUCT KNOWLEDGE & ANALISIS PASAR -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-chart-line" style="color: #10b981;"></i> Tier 3: Product Knowledge &amp; Analisis Pasar
                            </div>

                            <a href="pages/elibrary.html" class="category-item modal-feature-item" data-tags="catalog ecatalog e-catalog library brosur pdf spesifikasi mobil">
                                <div class="category-icon"><i class="fa-solid fa-book-open"></i></div>
                                <span class="category-text">E-Catalog</span>
                            </a>
                            <a href="pages/market_analysis.html" class="category-item modal-feature-item" data-tags="pasar market analisis wilayah pangsa bbn plat kodepos kecamatan komplek">
                                <div class="category-icon"><i class="fa-solid fa-chart-pie"></i></div>
                                <span class="category-text">Analisis Pasar</span>
                            </a>
                            <a href="pages/penjualan_kircon.html" class="category-item modal-feature-item" data-tags="penjualan kircon kiara condong rekap cabang ranking">
                                <div class="category-icon"><i class="fa-solid fa-chart-line"></i></div>
                                <span class="category-text">Penjualan Kircon</span>
                            </a>

                            <!-- SECTION: TIER 4 AKSESORIS, CUSTOM & MERCHANDISE -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-car-tunnel" style="color: #f59e0b;"></i> Tier 4: Aksesoris, Custom &amp; Merchandise
                            </div>

                            <a href="pages/tco.html" class="category-item modal-feature-item" data-tags="tco aksesoris custom bodykit kaca film karpet">
                                <div class="category-icon"><i class="fa-solid fa-car-tunnel"></i></div>
                                <span class="category-text">Aksesoris TCO</span>
                            </a>
                            <a href="pages/velg.html" class="category-item modal-feature-item" data-tags="velg ban wheel variasi ring velg ban">
                                <div class="category-icon"><i class="fa-solid fa-compact-disc"></i></div>
                                <span class="category-text">Velg &amp; Ban</span>
                            </a>
                            <a href="pages/merchandise.html" class="category-item modal-feature-item" data-tags="merch baju kaos topi gantungan payung jaket souvenir">
                                <div class="category-icon"><i class="fa-solid fa-shirt"></i></div>
                                <span class="category-text">Merchandise</span>
                            </a>

                            <!-- SECTION: TIER 5 REFRESHMENT & ARCADE GAMES -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-gamepad" style="color: #ec4899;"></i> Tier 5: Refreshment &amp; Games (5 Games)
                            </div>

                            <a href="pages/catur.html" class="category-item modal-feature-item" data-tags="catur chess strategi knight pion raja">
                                <div class="category-icon"><i class="fa-solid fa-chess-knight"></i></div>
                                <span class="category-text">Catur Master</span>
                            </a>
                            <a href="pages/balap.html" class="category-item modal-feature-item" data-tags="balap mobil gr racing sirkuit">
                                <div class="category-icon"><i class="fa-solid fa-flag-checkered"></i></div>
                                <span class="category-text">Balap Mobil GR</span>
                            </a>
                            <a href="pages/snake.html" class="category-item modal-feature-item" data-tags="snake ular drift pom bensin rush">
                                <div class="category-icon"><i class="fa-solid fa-gas-pump"></i></div>
                                <span class="category-text">Parkir Drift</span>
                            </a>
                            <a href="pages/tebak.html" class="category-item modal-feature-item" data-tags="tebak kuis trivia otomotif mobil">
                                <div class="category-icon"><i class="fa-solid fa-brain"></i></div>
                                <span class="category-text">Tebak Otomotif</span>
                            </a>
                            <a href="pages/tts.html" class="category-item modal-feature-item" data-tags="tts teka teki silang puzzle kata">
                                <div class="category-icon"><i class="fa-solid fa-puzzle-piece"></i></div>
                                <span class="category-text">TTS Otomotif</span>
                            </a>

                            <!-- SECTION: AKUN & NOTIFIKASI -->
                            <div class="modal-section-header" style="grid-column: 1 / -1; margin-top: 14px; padding: 6px 0 4px; border-bottom: 1px solid #f1f5f9; font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; display: flex; align-items: center; gap: 6px;">
                                <i class="fa-solid fa-user-gear" style="color: #0f172a;"></i> Akun &amp; Pengaturan
                            </div>

                            <a href="pages/notifikasi.html" class="category-item modal-feature-item" data-tags="notifikasi pemberitahuan pesan lonceng peringatan">
                                <div class="category-icon"><i class="fa-regular fa-bell"></i></div>
                                <span class="category-text">Notifikasi</span>
                            </a>
                            <a href="pages/profil.html" class="category-item modal-feature-item" data-tags="profil saya profil akun foto pengaturan logout">
                                <div class="category-icon"><i class="fa-solid fa-user"></i></div>
                                <span class="category-text">Profil Saya</span>
                            </a>

                            <!-- Empty Search Result State -->
                            <div id="modalFeatureEmpty" style="display:none; grid-column: 1 / -1; text-align: center; padding: 36px 16px; color: #94a3b8;">
                                <i class="fa-solid fa-magnifying-glass" style="font-size: 30px; margin-bottom: 8px; opacity: 0.5;"></i>
                                <div style="font-weight: 700; color: #1e293b; font-size: 14px;">Fitur tidak ditemukan</div>
                                <div style="font-size: 12px; margin-top: 2px;">Coba gunakan kata kunci lain (contoh: STNK, Stok, Promo, Do)</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══ MODAL: AKTIVITAS TERAKHIR (Premium Redesign) ═══ -->
                <div class="modal-overlay" id="aktivitasModal">
                    <div class="modal-content jm-content premium-modal-aktivitas">
                        <div class="jm-drag-handle"></div>

                        <!-- Premium Header -->
                        <div class="pm-header pm-header-red">
                            <div class="pm-header-deco"></div>
                            <div class="pm-header-deco-ring"></div>
                            <div class="pm-header-content">
                                <div class="pm-header-icon">
                                    <i class="fa-solid fa-clock-rotate-left"></i>
                                </div>
                                <div class="pm-header-text">
                                    <h3>Aktivitas Terakhir</h3>
                                    <p>Daftar aktivitas sales yang telah terekam</p>
                                </div>
                                <button class="pm-close-btn" onclick="closeModal('aktivitasModal')">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div class="pm-header-stats" id="aktivitasModalStats">
                                <div class="pm-stat">
                                    <span class="pm-stat-num" id="amStatTotal">0</span>
                                    <span class="pm-stat-label">Total</span>
                                </div>
                                <div class="pm-stat-divider"></div>
                                <div class="pm-stat">
                                    <span class="pm-stat-num" id="amStatHariIni">0</span>
                                    <span class="pm-stat-label">Hari Ini</span>
                                </div>
                                <div class="pm-stat-divider"></div>
                                <div class="pm-stat">
                                    <span class="pm-stat-num" id="amStatVerified">0</span>
                                    <span class="pm-stat-label">Terverifikasi</span>
                                </div>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="pm-body">
                            <div class="pm-section-label">
                                <i class="fa-solid fa-list-timeline"></i>
                                <span>Riwayat Aktivitas</span>
                            </div>
                            <div class="activity-list pm-card-list" id="modalActivityList">
                                <div class="pm-loading-state">
                                    <div class="pm-loading-spinner"></div>
                                    <p>Memuat data aktivitas...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══ MODAL: TRADE-IN OLX (Premium Redesign) ═══ -->
                <div class="modal-overlay" id="olxModal">
                    <div class="modal-content jm-content premium-modal-olx">
                        <div class="jm-drag-handle"></div>

                        <!-- Premium Header -->
                        <div class="pm-header pm-header-blue">
                            <div class="pm-header-deco"></div>
                            <div class="pm-header-deco-ring"></div>
                            <div class="pm-header-content">
                                <div class="pm-header-icon">
                                    <i class="fa-solid fa-car-side"></i>
                                </div>
                                <div class="pm-header-text">
                                    <h3>Data Trade-In OLX</h3>
                                    <p>Daftar semua pengajuan Trade-In</p>
                                </div>
                                <button class="pm-close-btn" onclick="closeModal('olxModal')">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            <div class="pm-header-stats" id="olxModalStats">
                                <div class="pm-stat">
                                    <span class="pm-stat-num" id="olxStatTotal">0</span>
                                    <span class="pm-stat-label">Total</span>
                                </div>
                                <div class="pm-stat-divider"></div>
                                <div class="pm-stat">
                                    <span class="pm-stat-num" id="olxStatApproved">0</span>
                                    <span class="pm-stat-label">Disetujui</span>
                                </div>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="pm-body">
                            <div class="pm-section-label">
                                <i class="fa-solid fa-car"></i>
                                <span>Daftar Kendaraan</span>
                            </div>
                            <div id="modalOlxList" class="tradein-list pm-card-list" style="max-height:none;">
                                <div class="pm-loading-state">
                                    <div class="pm-loading-spinner"></div>
                                    <p>Memuat data trade-in...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══ MODAL: VIEWER FOTO ═══ -->
                <div class="modal-overlay photo-viewer" id="photoViewerModal">
                    <div class="modal-content photo-viewer-content">
                        <button class="btn-close-modal-white pv-close" onclick="closeModal('photoViewerModal')"><i
                                class="fa-solid fa-xmark"></i></button>

                        <button id="btnPhotoPrev" class="pv-nav pv-prev" onclick="prevPhotoViewer()"><i
                                class="fa-solid fa-chevron-left"></i></button>

                        <img id="photoViewerImg" src="" alt="Detail Foto" class="pv-img">

                        <button id="btnPhotoNext" class="pv-nav pv-next" onclick="nextPhotoViewer()"><i
                                class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>

                <!-- ═══ MODAL: DETAIL AKTIVITAS ═══ -->
                <div class="modal-overlay" id="activityDetailModal" style="z-index: 9500;">
                    <div id="adm-sheet">
                        <!-- Header Strip -->
                        <div id="adm-header-strip">
                            <div class="adm-drag-row">
                                <div class="adm-drag-pill"></div>
                            </div>

                            <div class="adm-header-content">
                                <div class="adm-header-icon-box">
                                    <i id="adm-header-icon" class="fa-solid fa-clipboard-list"></i>
                                </div>
                                <div class="adm-header-text">
                                    <h3 id="adm-title">Detail Aktivitas</h3>
                                    <p id="adm-subtitle">Informasi lengkap aktivitas</p>
                                </div>
                                <button id="adm-btn-back" class="adm-circle-btn" onclick="closeDetailGoBack()"
                                    style="display:none;"><i class="fa-solid fa-arrow-left"></i></button>
                                <button class="adm-circle-btn" onclick="closeActivityDetail()"><i
                                        class="fa-solid fa-xmark"></i></button>
                            </div>
                        </div>

                        <!-- Scrollable Body -->
                        <div class="adm-body">

                            <!-- Foto Gallery -->
                            <div id="adm-gallery" style="display: none;">
                                <div class="adm-gallery-main">
                                    <img id="adm-main-photo" src="" alt="Foto Aktivitas"
                                        onclick="openPhotoFromDetail()">
                                    <div class="adm-gallery-fade"></div>
                                    <div id="adm-photo-counter">1 / 1</div>
                                    <button id="adm-btn-prev" class="adm-gallery-nav prev" onclick="prevPhoto()">
                                        <i class="fa-solid fa-chevron-left"></i>
                                    </button>
                                    <button id="adm-btn-next" class="adm-gallery-nav next" onclick="nextPhoto()">
                                        <i class="fa-solid fa-chevron-right"></i>
                                    </button>
                                </div>
                                <div id="adm-thumbnails"></div>
                            </div>

                            <!-- Info Section -->
                            <div class="adm-info-section">
                                <!-- Status + Waktu -->
                                <div class="adm-status-row">
                                    <div class="adm-status-left">
                                        <span class="adm-status-label">Status</span>
                                        <span id="adm-status-badge"></span>
                                    </div>
                                    <span id="adm-datetime">
                                        <i class="fa-regular fa-clock"></i>
                                    </span>
                                </div>

                                <!-- Info Cards -->
                                <div class="adm-cards-col">

                                    <div class="adm-info-card" style="border-left-color:#7048d6;">
                                        <div class="adm-info-icon ic-violet">
                                            <i class="fa-solid fa-user-tie"></i>
                                        </div>
                                        <div class="adm-info-content">
                                            <span class="adm-info-label">Nama Sales</span>
                                            <span class="adm-info-value" id="adm-nama-sales">-</span>
                                        </div>
                                    </div>

                                    <div class="adm-info-card" style="border-left-color:#d7123a;">
                                        <div class="adm-info-icon ic-red">
                                            <i class="fa-solid fa-tag"></i>
                                        </div>
                                        <div class="adm-info-content">
                                            <span class="adm-info-label">Tipe Aktivitas</span>
                                            <span class="adm-info-value" id="adm-tipe">-</span>
                                        </div>
                                    </div>

                                    <div class="adm-info-card" style="border-left-color:#3565e0;">
                                        <div class="adm-info-icon ic-blue">
                                            <i class="fa-solid fa-align-left"></i>
                                        </div>
                                        <div class="adm-info-content">
                                            <span class="adm-info-label">Keterangan</span>
                                            <span class="adm-info-value adm-pre" id="adm-keterangan">-</span>
                                        </div>
                                    </div>

                                    <div class="adm-info-card adm-card-lokasi" style="border-left-color:#0d9268;">
                                        <div class="adm-lokasi-top">
                                            <div class="adm-info-icon ic-green">
                                                <i class="fa-solid fa-location-dot"></i>
                                            </div>
                                            <div class="adm-info-content">
                                                <span class="adm-info-label">Lokasi</span>
                                                <span class="adm-info-value" id="adm-lokasi">-</span>
                                            </div>
                                        </div>
                                        <a id="adm-map-btn" href="#" target="_blank" class="adm-map-btn">
                                            <i class="fa-solid fa-map-location-dot"></i> Buka di Google Maps
                                        </a>
                                    </div>

                                    <div class="adm-info-card" id="adm-row-foto"
                                        style="display:none;border-left-color:#7048d6;">
                                        <div class="adm-info-icon ic-violet">
                                            <i class="fa-solid fa-images"></i>
                                        </div>
                                        <div class="adm-info-content">
                                            <span class="adm-info-label">Foto Terupload</span>
                                            <span class="adm-info-value" id="adm-foto-count">-</span>
                                        </div>
                                    </div>

                                    <div class="adm-info-card" style="border-left-color:#b45309;">
                                        <div class="adm-info-icon ic-amber">
                                            <i class="fa-regular fa-calendar-alt"></i>
                                        </div>
                                        <div class="adm-info-content">
                                            <span class="adm-info-label">Waktu Rekam</span>
                                            <span class="adm-info-value" id="adm-created">-</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- ═══ MODAL: SPK & DO ═══ -->
                <div class="modal-overlay" id="spkDoModal" onclick="closeModal('spkDoModal')">
                    <div class="modal-content spkdo-content" onclick="event.stopPropagation()">

                        <div class="spkdo-head">
                            <h3>Input Pencapaian<br>Terotomatisasi</h3>
                            <button type="button" class="spkdo-x" onclick="closeModal('spkDoModal')"><i
                                    class="fa-solid fa-xmark"></i></button>
                        </div>

                        <div class="spkdo-info">
                            <i class="fa-solid fa-database"></i>
                            <h4>Integrasi Data Real-Time</h4>
                            <p>
                                Pencapaian <strong>Actual SPK</strong> dan <strong>Actual DO</strong> kini terhubung
                                secara real-time. Anda dapat membuat pengajuan SPK baru atau menginput DO langsung
                                melalui form pencapaian.
                            </p>
                        </div>

                        <div class="spkdo-actions">
                            <a href="pages/spk.html" class="spkdo-btn">
                                <i class="fa-solid fa-file-invoice"></i>
                                <span>Buat<br>Pengajuan<br>SPK</span>
                            </a>
                            <a href="pages/do.html" class="spkdo-btn">
                                <i class="fa-solid fa-boxes-packing"></i>
                                <span>Input DO<br>Langsung</span>
                            </a>
                        </div>

                        <button class="spkdo-close" onclick="closeModal('spkDoModal')">Tutup</button>
                    </div>
                </div>

                <!-- ═══ MODAL: DETAIL OLX ═══ -->
                <div id="olxDetailModal" class="modal-overlay" style="z-index: 20000;" onclick="closeOlxDetail()">
                    <div class="modal-content olxdet-content" onclick="event.stopPropagation()">
                        <div class="modal-header">
                            <h3>Detail Kendaraan</h3>
                            <button type="button" class="btn-close-modal" onclick="closeOlxDetail()"><i
                                    class="fa-solid fa-xmark"></i></button>
                        </div>

                        <div id="detPhotoContainer" class="olxdet-photos">
                            <!-- Photos will be inserted here -->
                        </div>

                        <div class="olxdet-body">
                            <h4 id="detNamaKendaraan">Nama Kendaraan</h4>
                            <div class="olxdet-meta">
                                <span class="olxdet-sales-chip">
                                    <i class="fa-solid fa-user"></i><span id="detNamaSales">Sales</span>
                                </span>
                                <span class="olxdet-date" id="detTanggal">Tanggal</span>
                            </div>

                            <div class="olxdet-grid">
                                <div>
                                    <span class="olxdet-label">JENIS/TYPE</span>
                                    <span class="olxdet-value" id="detJenis"></span>
                                </div>
                                <div>
                                    <span class="olxdet-label">TAHUN</span>
                                    <span class="olxdet-value" id="detTahun"></span>
                                </div>
                                <div>
                                    <span class="olxdet-label">WARNA</span>
                                    <span class="olxdet-value" id="detWarna"></span>
                                </div>
                                <div>
                                    <span class="olxdet-label">LOKASI</span>
                                    <span class="olxdet-value" id="detLokasi"></span>
                                </div>
                            </div>

                            <div>
                                <span class="olxdet-label">DESKRIPSI KONDISI</span>
                                <p id="detDeskripsi" class="olxdet-desc"></p>
                            </div>
                        </div>

                        <div class="olxdet-price">
                            <span class="olxdet-price-label">Harga Estimasi Disetujui</span>
                            <span id="detHarga">Rp 0</span>
                        </div>

                        <button id="detBtnHubungiSales" class="btn-main olxdet-wa" style="display: none;">
                            <i class="fa-brands fa-whatsapp"></i> Hubungi Sales
                        </button>
                    </div>
                </div>

                <!-- ═══ MODAL: PENGINGAT JADWAL & AGENDA HARI INI ═══ -->
                <div class="modal-overlay" id="todayJadwalReminderModal" style="z-index: 10005;">
                    <div class="modal-content jm-content premium-modal-aktivitas" style="max-width: 520px; width: 100%; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.35);">
                        <div class="jm-drag-handle"></div>

                        <!-- Premium Header Red-Navy Gradient -->
                        <div class="pm-header pm-header-red" style="background: linear-gradient(135deg, #991b1b 0%, #c8102e 55%, #1e1b4b 100%); padding: 18px 20px; position: relative; overflow: hidden;">
                            <div class="pm-header-deco" style="position: absolute; top: -30px; right: -30px; width: 120px; height: 120px; background: radial-gradient(circle, rgba(255,255,255,0.18) 0%, transparent 70%); border-radius: 50%;"></div>
                            <div class="pm-header-content" style="display: flex; align-items: flex-start; justify-content: space-between; position: relative; z-index: 2;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div class="pm-header-icon" style="width: 44px; height: 44px; border-radius: 14px; background: rgba(255,255,255,0.18); border: 1.5px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                                        <i class="fa-solid fa-calendar-check"></i>
                                    </div>
                                    <div class="pm-header-text">
                                        <div style="display: flex; align-items: center; gap: 8px;">
                                            <h3 style="margin: 0; color: #fff; font-size: 16px; font-weight: 800; letter-spacing: -0.2px;">Pengingat Agenda Hari Ini</h3>
                                            <span id="popupJadwalCountBadge" style="background: #fff; color: #c8102e; font-size: 11px; font-weight: 800; padding: 2px 7px; border-radius: 12px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">0</span>
                                        </div>
                                        <p style="margin: 2px 0 0; color: rgba(255,255,255,0.88); font-size: 12px; font-weight: 500;" id="popupJadwalSubtitle">Jangan lewatkan agenda &amp; follow-up Anda hari ini!</p>
                                    </div>
                                </div>
                                <button class="pm-close-btn" onclick="closeTodayJadwalModal()" style="background: rgba(255,255,255,0.15); border: none; width: 32px; height: 32px; border-radius: 50%; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease;">
                                    <i class="fa-solid fa-xmark"></i>
                                </button>
                            </div>
                            
                            <!-- Quick Date Bar -->
                            <div style="margin-top: 14px; padding: 8px 12px; background: rgba(0,0,0,0.22); border-radius: 10px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #fff; backdrop-filter: blur(4px);">
                                <div style="display: flex; align-items: center; gap: 6px;">
                                    <i class="fa-regular fa-clock" style="color: #fca5a5;"></i>
                                    <span id="popupTodayDateFormatted">Hari Ini</span>
                                </div>
                                <span style="font-weight: 700; color: #fecdd3; background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 6px;">Live Reminder</span>
                            </div>
                        </div>

                        <!-- Body -->
                        <div class="pm-body" style="padding: 16px 18px; max-height: 52vh; overflow-y: auto; background: #f8fafc;">
                            <div id="todayJadwalModalBody" style="display: flex; flex-direction: column; gap: 12px;">
                                <div class="pm-loading-state" style="text-align:center; padding: 24px 0; color: #94a3b8;">
                                    <div class="pm-loading-spinner" style="width: 28px; height: 28px; border: 3px solid #e2e8f0; border-top-color: #c8102e; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px;"></div>
                                    <p style="font-size: 12px; font-weight: 600; margin: 0;">Memeriksa agenda hari ini...</p>
                                </div>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="padding: 12px 18px; background: #ffffff; border-top: 1px solid #e2e8f0; display: flex; gap: 10px; align-items: center; justify-content: space-between;">
                            <a href="pages/jadwal_input.html" class="btn-main" style="flex: 1; text-align: center; text-decoration: none; padding: 10px 14px; font-size: 12.5px; font-weight: 700; border-radius: 10px; background: #0f172a; color: #fff; display: inline-flex; align-items: center; justify-content: center; gap: 6px;">
                                <i class="fa-solid fa-calendar-plus"></i> Kelola Kalender &amp; Jadwal
                            </a>
                            <button type="button" onclick="closeTodayJadwalModal()" style="padding: 10px 16px; font-size: 12.5px; font-weight: 700; border-radius: 10px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; cursor: pointer; transition: background 0.2s ease;">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>

            </div><!-- /mobile-app -->

        </div><!-- /desktop-content -->
    </div><!-- /desktop-shell -->

    <script src="js/sidebar_desktop.js?v={{ time() }}"></script>
    <script src="js/script.js?v=20260908_rank_fix_v19"></script>
    <script src="js/sales_superpowers.js?v=1.0"></script>
    <script src="js/index_dashboard.js?v=20260808_07"></script>

    <script src="js/auto_location_tracker.js?v=20261021_v20"></script>
    <script src="./js/pwa-app.js?v=20261021_v20"></script>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if (window.SalesSuperpowers) {
                SalesSuperpowers.checkDailyFollowupReminders();
                SalesSuperpowers.loadTodayBriefingPodcast();
            }
        });
    </script>
</body>

</html>