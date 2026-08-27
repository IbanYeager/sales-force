/**
 * sidebar_desktop.js
 * Injects the desktop sidebar HTML into any page and populates user info.
 * Works on both root (index.html) and sub-pages (pages/*.html).
 */
(function initDesktopSidebar() {

    // ── Determine path prefix ───────────────────────────────
    const path = window.location.pathname;
    const isRoot = !path.includes('/pages/') && !path.includes('/pages_spv/') && !path.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    // ── Build sidebar HTML based on Role ────────────────────
    function buildSidebar() {
        const role = localStorage.getItem('peranSales');
        if (role === 'Kepala Cabang') {
            return buildSidebarKacab();
        }
        if (role === 'Supervisor') {
            return buildSidebarSPV();
        }
        return buildSidebarSales();
    }

    // ── Kacab Sidebar Builder ───────────────────────────────
    function buildSidebarKacab() {
        const nav = document.createElement('nav');
        nav.className = 'desktop-sidebar desktop-sidebar-kacab';
        nav.id = 'desktopSidebar';

        let curPage = path.split('/').pop().split('?')[0].split('#')[0] || 'index_kacab';
        curPage = curPage.replace('.html', '');

        function navLinkKacab(href, icon, label) {
            const cleanHref = href.replace(/\.html$/, '');
            const fullHref = prefix + cleanHref;
            let hrefPage = cleanHref.split('/').pop();
            const isActive = (curPage === hrefPage) ? ' active' : '';
            return `<a href="${fullHref}" class="sidebar-nav-link${isActive}"><i class="${icon}"></i> ${label}</a>`;
        }

        nav.innerHTML = `
            <div class="sidebar-brand">
                <a href="${prefix}pages_kacab/index_kacab" class="sidebar-brand-logo" title="Tunas Toyota">
                    <img src="${prefix}image/logo_tunas_toyota.png" alt="Tunas Toyota" class="sidebar-brand-img">
                </a>
                <div style="font-size:10px; font-weight:800; color:#d8a437; background:rgba(216,164,55,0.15); padding:2px 8px; border-radius:6px; margin-top:6px; display:inline-block; border:1px solid rgba(216,164,55,0.3);">
                    <i class="fa-solid fa-building-user"></i> KACAB PANEL
                </div>
            </div>

            <a href="${prefix}pages_kacab/index_kacab" class="sidebar-user-card">
                <img src="https://ui-avatars.com/api/?name=KC&background=1e1014&color=d8a437&bold=true"
                    alt="Profile" class="sidebar-user-avatar" id="sidebarAvatar">
                <div class="sidebar-user-info">
                    <span class="sidebar-user-name" id="sidebarNama">Kepala Cabang</span>
                    <span class="sidebar-user-role" id="sidebarRole" style="color:#d8a437;">Kepala Cabang</span>
                </div>
                <div class="sidebar-user-dot" style="background:#d8a437;"></div>
            </a>

            <div class="sidebar-search-wrap">
                <div class="sidebar-search-box">
                    <i class="fa-solid fa-magnifying-glass sidebar-search-icon"></i>
                    <input type="text" class="sidebar-search-input" id="sidebarSearchInput" placeholder="Cari fitur / menu..." autocomplete="off" spellcheck="false">
                    <button type="button" class="sidebar-search-clear" id="sidebarSearchClear" style="display:none;" title="Bersihkan pencarian">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div class="sidebar-nav">
                <p class="sidebar-nav-label">Menu Kepala Cabang</p>
                ${navLinkKacab('pages_kacab/index_kacab.html', 'fa-solid fa-gauge-high', 'Dashboard Cabang')}
                ${navLinkKacab('pages_kacab/followup_database.html', 'fa-solid fa-bullhorn', 'Database Follow-Up (CRM)')}
                ${navLinkKacab('pages_kacab/ao_report_kacab.html', 'fa-solid fa-chalkboard-user', 'Papan AO Report')}
                ${navLinkKacab('pages_kacab/monitoring_spv.html', 'fa-solid fa-sitemap', 'Monitoring Tim SPV')}
                ${navLinkKacab('pages_kacab/wiraniaga.html', 'fa-solid fa-users', 'Data 46 Wiraniaga')}
                ${navLinkKacab('pages_kacab/approval_kacab.html', 'fa-solid fa-clipboard-check', 'Otorisasi & Approval')}
                ${navLinkKacab('pages_kacab/target_kacab.html', 'fa-solid fa-bullseye', 'Target & Produktivitas')}
                ${navLinkKacab('pages_kacab/laporan_kacab.html', 'fa-solid fa-chart-pie', 'Laporan Eksekutif')}
                ${navLinkKacab('pages_kacab/aktivitas.html', 'fa-solid fa-list-check', 'Aktivitas & Riwayat Sales')}
                ${navLinkKacab('pages_kacab/peta_kunjungan.html', 'fa-solid fa-map-location-dot', 'Peta GPS Kunjungan')}
                ${navLinkKacab('pages_kacab/inventory.html', 'fa-solid fa-warehouse', 'Live Stok (1.638 Unit)')}
                ${navLinkKacab('pages_kacab/penjualan_kircon.html', 'fa-solid fa-table-list', 'Penjualan Kircon')}

                <div class="sidebar-search-empty" id="sidebarSearchEmpty" style="display:none;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <div style="font-weight:700; color:#fff; margin-bottom:2px;">Fitur tidak ditemukan</div>
                    <div style="font-size:11px; opacity:0.8;">Coba gunakan kata kunci lain</div>
                </div>
            </div>

            <div class="sidebar-bottom">
                <button onclick="logoutUser()" class="sidebar-notif-btn" style="background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2); width:100%; justify-content:center; cursor:pointer;">
                    <i class="fa-solid fa-right-from-bracket"></i> Keluar
                </button>
            </div>
        `;
        return nav;
    }

    // ── SPV Sidebar Builder ─────────────────────────────────
    function buildSidebarSPV() {
        const nav = document.createElement('nav');
        nav.className = 'desktop-sidebar desktop-sidebar-spv';
        nav.id = 'desktopSidebar';

        let curPage = path.split('/').pop().split('?')[0].split('#')[0] || 'index_spv';
        curPage = curPage.replace('.html', '');

        function navLinkSPV(href, icon, label) {
            const cleanHref = href.replace(/\.html$/, '');
            const fullHref = prefix + cleanHref;
            let hrefPage = cleanHref.split('/').pop();
            const isActive = (curPage === hrefPage || (curPage === 'index' && hrefPage === 'index_spv')) ? ' active' : '';
            return `<a href="${fullHref}" class="sidebar-nav-link${isActive}"><i class="${icon}"></i> ${label}</a>`;
        }

        nav.innerHTML = `
            <div class="sidebar-brand">
                <a href="${prefix}pages_spv/index_spv" class="sidebar-brand-logo" title="Tunas Toyota">
                    <img src="${prefix}image/logo_tunas_toyota.png" alt="Tunas Toyota" class="sidebar-brand-img">
                </a>
                <div style="font-size:10px; font-weight:800; color:#38bdf8; background:rgba(56,189,248,0.15); padding:2px 8px; border-radius:6px; margin-top:6px; display:inline-block; border:1px solid rgba(56,189,248,0.3);">
                    <i class="fa-solid fa-user-tie"></i> SPV PANEL
                </div>
            </div>

            <a href="${prefix}pages_spv/index_spv" class="sidebar-user-card">
                <img src="https://ui-avatars.com/api/?name=SPV&background=1c2740&color=ffffff&bold=true"
                    alt="Profile" class="sidebar-user-avatar" id="sidebarAvatar">
                <div class="sidebar-user-info">
                    <span class="sidebar-user-name" id="sidebarNama">Supervisor</span>
                    <span class="sidebar-user-role" id="sidebarRole">Supervisor</span>
                </div>
                <div class="sidebar-user-dot"></div>
            </a>

            <div class="sidebar-search-wrap">
                <div class="sidebar-search-box">
                    <i class="fa-solid fa-magnifying-glass sidebar-search-icon"></i>
                    <input type="text" class="sidebar-search-input" id="sidebarSearchInput" placeholder="Cari fitur / menu..." autocomplete="off" spellcheck="false">
                    <button type="button" class="sidebar-search-clear" id="sidebarSearchClear" style="display:none;" title="Bersihkan pencarian">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div class="sidebar-nav">
                <p class="sidebar-nav-label">Menu Supervisor</p>
                ${navLinkSPV('pages_spv/index_spv.html', 'fa-solid fa-gauge', 'Dashboard')}
                ${navLinkSPV('pages_spv/followup_database.html', 'fa-solid fa-bullhorn', 'Database Follow-Up (CRM)')}
                ${navLinkSPV('pages_spv/ao_report_spv.html', 'fa-solid fa-chalkboard-user', 'AO Report Cabang')}
                ${navLinkSPV('pages_spv/target.html', 'fa-solid fa-bullseye', 'Target')}
                ${navLinkSPV('pages_spv/wiraniaga.html', 'fa-solid fa-users', 'Wiraniaga')}
                ${navLinkSPV('pages_spv/approval.html', 'fa-solid fa-check-to-slot', 'Approval <span class="sidebar-notif-badge" id="sidebarApprovalBadge" style="display:none; margin-left:auto;">0</span>')}
                ${navLinkSPV('pages_spv/aktivitas.html', 'fa-solid fa-list-check', 'Aktivitas <span class="sidebar-notif-badge" id="sidebarAktivitasBadge" style="display:none; margin-left:auto; background:#2563eb;">0</span>')}
                ${navLinkSPV('pages_spv/briefing_generator.html', 'fa-solid fa-wand-magic-sparkles', 'Briefing Auto-Gen')}
                ${navLinkSPV('pages_spv/peta_canvassing.html', 'fa-solid fa-map-location-dot', 'Canvassing Heatmap')}
                ${navLinkSPV('pages_spv/spv_coaching.html', 'fa-solid fa-chalkboard-user', 'Coaching Radar')}
                ${navLinkSPV('pages_spv/inventory.html', 'fa-solid fa-warehouse', 'Live Stock')}
                ${navLinkSPV('pages_spv/penjualan_kircon.html', 'fa-solid fa-table-list', 'Penjualan Kircon')}
                ${navLinkSPV('pages_spv/kelola_data.html', 'fa-solid fa-database', 'Kelola Data')}

                <div class="sidebar-search-empty" id="sidebarSearchEmpty" style="display:none;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <div style="font-weight:700; color:#fff; margin-bottom:2px;">Fitur tidak ditemukan</div>
                    <div style="font-size:11px; opacity:0.8;">Coba gunakan kata kunci lain</div>
                </div>
            </div>

            <div class="sidebar-bottom">
                <button onclick="logoutUser()" class="sidebar-notif-btn" style="background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2); width:100%; justify-content:center; cursor:pointer;">
                    <i class="fa-solid fa-right-from-bracket"></i> Keluar
                </button>
            </div>
        `;
        return nav;
    }

    // ── Sales Sidebar Builder ───────────────────────────────
    function buildSidebarSales() {
        const nav = document.createElement('nav');
        nav.className = 'desktop-sidebar';
        nav.id = 'desktopSidebar';

        // Active link detection
        let curPage = path.split('/').pop() || 'index';
        curPage = curPage.replace('.html', '');

        function navLink(href, icon, label, tags = '') {
            const cleanHref = href.replace(/\.html$/, '');
            const fullHref = prefix + cleanHref;
            let hrefPage = cleanHref.split('/').pop();
            const isActive = (curPage === hrefPage || (curPage === '' && (hrefPage === 'index' || hrefPage === ''))) ? ' active' : '';
            return `<a href="${fullHref}" class="sidebar-nav-link${isActive}" data-tags="${tags}"><i class="${icon}"></i> ${label}</a>`;
        }

        nav.innerHTML = `
            <div class="sidebar-brand">
                <a href="${prefix}index" class="sidebar-brand-logo" title="Tunas Toyota">
                    <img src="${prefix}image/logo_tunas_toyota.png" alt="Tunas Toyota" class="sidebar-brand-img">
                </a>
            </div>

            <a href="${prefix}pages/profil" class="sidebar-user-card">
                <img src="https://ui-avatars.com/api/?name=S&background=f4f7f6&color=c8102e&bold=true"
                    alt="Profile" class="sidebar-user-avatar" id="sidebarAvatar">
                <div class="sidebar-user-info">
                    <span class="sidebar-user-name" id="sidebarNama">Memuat...</span>
                    <span class="sidebar-user-role" id="sidebarRole">Sales</span>
                </div>
                <div class="sidebar-user-dot"></div>
            </a>

            <div class="sidebar-search-wrap">
                <div class="sidebar-search-box">
                    <i class="fa-solid fa-magnifying-glass sidebar-search-icon"></i>
                    <input type="text" class="sidebar-search-input" id="sidebarSearchInput" placeholder="Cari fitur / menu..." autocomplete="off" spellcheck="false">
                    <button type="button" class="sidebar-search-clear" id="sidebarSearchClear" style="display:none;" title="Bersihkan pencarian">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <div class="sidebar-nav">
                <p class="sidebar-nav-label">Menu Utama</p>
                ${navLink('index.html', 'fa-solid fa-house', 'Dashboard', 'home beranda ringkasan')}
                ${navLink('pages/ao_report.html', 'fa-solid fa-chalkboard-user', 'Papan AO Report', 'ao report leasing finance')}
                ${navLink('pages/input.html', 'fa-solid fa-camera', 'Input Aktivitas', 'input aktivitas laporan suara mic voice spm')}
                ${navLink('pages/riwayat_foto_aktivitas.html', 'fa-solid fa-images', 'Riwayat Foto Aktivitas', 'galeri foto aktivitas canvassing riwayat')}
                ${navLink('pages/target.html', 'fa-solid fa-bullseye', 'Target & Pencapaian', 'target spk do pencapaian kuota')}
                ${navLink('pages/checkin.html', 'fa-solid fa-location-crosshairs', 'Check-In Canvassing GPS', 'gps checkin absen lokasi canvassing')}
                ${navLink('pages/jadwal_input.html', 'fa-solid fa-calendar-days', 'Jadwal Aktivitas', 'kalender jadwal agenda aktivitas')}

                <p class="sidebar-nav-label">Tier 1: Closing, Pricing & Stock</p>
                ${navLink('pages/pricelist.html', 'fa-solid fa-clipboard-list', 'Pricelist OTR', 'harga pricelist otr brosur daftar')}
                ${navLink('pages/kalkulator.html', 'fa-solid fa-calculator', 'Kalkulator Multi-Leasing', 'kalkulator leasing kredit dp cicilan angsuran tenor')}
                ${navLink('pages/inventory.html', 'fa-solid fa-warehouse', 'Live Inventory (Stock)', 'stok stock live inventory unit mobil t-stock')}
                ${navLink('pages/customer.html', 'fa-solid fa-users', 'Customer CRM & Radar', 'customer crm radar prospek data database')}
                ${navLink('pages/battle_card.html', 'fa-solid fa-shield-halved', 'Battle Card &amp; Objection', 'battle card objection komparasi lawan kompetitor diskon keberatan closing kit senjata')}
                ${navLink('pages/spk.html', 'fa-solid fa-file-signature', 'Form SPK', 'spk pesanan form surat tanda jadi')}
                ${navLink('pages/quotation.html', 'fa-solid fa-file-contract', 'Smart Digital Quotation', 'quotation penawaran harga simulasi pdf')}
                ${navLink('pages/promo.html', 'fa-solid fa-percent', 'Promo & Tenor', 'promo diskon paket kredit tenor program')}
                ${navLink('pages/order_tracker.html', 'fa-solid fa-truck-ramp-box', 'Live Delivery Tracker', 'tracking status mobil tracker delivery')}
                ${navLink('pages/tradein.html', 'fa-solid fa-right-left', 'Trade-In & Over-Kredit', 'trade in tukar tambah over kredit mobil bekas')}
                ${navLink('pages/leasing_matrix.html', 'fa-solid fa-scale-balanced', 'Leasing Approval Odds', 'leasing matrix peluang approval acc taf bca bsi')}

                <p class="sidebar-nav-label">Tier 2: AI Tools, Komunikasi & Delivery</p>
                ${navLink('pages/wa_studio.html', 'fa-brands fa-whatsapp', 'WA Broadcast Studio', 'wa whatsapp broadcast blast pesan template')}
                ${navLink('pages/ai_copilot.html', 'fa-solid fa-wand-magic-sparkles', 'AI Sales Copilot', 'ai copilot asisten chatbot tanya script closing')}
                ${navLink('pages/digital_card.html', 'fa-solid fa-address-card', 'Kartu Nama Digital (vCard)', 'kartu nama digital vcard qr kontak profil')}
                ${navLink('pages/retention.html', 'fa-solid fa-heart-pulse', 'After-Sales & Retention Hub', 'after sales servis stnk bpkb retention loyalitas')}
                ${navLink('pages/delivery_ceremony.html', 'fa-solid fa-award', 'Digital Delivery Ceremony', 'handover ceremony serah terima piagam')}
                ${navLink('pages/do.html', 'fa-solid fa-truck', 'Surat Jalan (DO)', 'do delivery order surat jalan kirim')}
                ${navLink('pages/deal.html', 'fa-solid fa-handshake', 'Deal Pipeline', 'deal pipeline closing tahap prospek')}
                ${navLink('pages/testdrive.html', 'fa-solid fa-car-side', 'Test Drive Showroom', 'test drive uji coba mobil showroom')}
                ${navLink('pages/rental_testdrive.html', 'fa-solid fa-handshake-simple', 'Test Drive Rekanan Rental', 'rental rekanan test drive')}
                ${navLink('pages/approval.html', 'fa-solid fa-check-to-slot', 'Approval Diskon <span class="sidebar-notif-badge" id="sidebarApprovalBadge" style="display:none; margin-left:auto;">0</span>', 'approval diskon persetujuan spv')}
                ${navLink('pages/dokumen.html', 'fa-solid fa-receipt', 'Manajemen Dokumen', 'dokumen berkas ktp kk berkas leasing')}

                <p class="sidebar-nav-label">Tier 3: Product Knowledge & Pasar</p>
                ${navLink('pages/eco_calculator.html', 'fa-solid fa-leaf', 'Toyota Eco Calc (Hybrid)', 'eco hybrid bbm hemat emisi')}
                ${navLink('pages/komparasi.html', 'fa-solid fa-scale-balanced', 'Komparasi Competitor 360°', 'komparasi lawan rival competitor banding')}
                ${navLink('pages/brosur.html', 'fa-solid fa-book-open', 'Brosur Digital', 'brosur pdf katalog spesifikasi')}
                ${navLink('pages/elibrary.html', 'fa-solid fa-book-medical', 'E-Library Panduan Sales', 'library panduan tips trik materi pelatihan')}
                ${navLink('pages/market_analysis.html', 'fa-solid fa-chart-pie', 'Analisis Pasar Kecamatan', 'pasar market analisis wilayah pangsa')}
                ${navLink('pages/polreg.html', 'fa-solid fa-map-location-dot', 'Peta Wilayah Polreg', 'polreg plat nomor d z bbn stnk')}
                ${navLink('pages/kecamatan.html', 'fa-solid fa-map-pin', 'Lookup Kecamatan & Kodepos', 'kecamatan kodepos kelurahan bandung')}
                ${navLink('pages/penjualan_kircon.html', 'fa-solid fa-chart-line', 'Penjualan Kiara Condong', 'penjualan kircon kiara condong rekap cabang')}

                <p class="sidebar-nav-label">Tier 4: Trade-In, Aksesoris & Merch</p>
                ${navLink('pages/olx.html', 'fa-solid fa-exchange-alt', 'OLX Appraisal', 'olx appraisal taksir harga pasaran mobil bekas')}
                ${navLink('pages/inspeksi.html', 'fa-solid fa-car-rear', 'Prospek Inspeksi Mobil', 'inspeksi cek kondisi fisik appraisal')}
                ${navLink('pages/jadwal_inspeksi.html', 'fa-solid fa-calendar-check', 'Jadwal Inspeksi Showroom', 'jadwal booking inspeksi')}
                ${navLink('pages/tco.html', 'fa-solid fa-car-tunnel', 'Aksesoris TCO & Builder', 'tco aksesoris custom bodykit kaca film karpet')}
                ${navLink('pages/velg.html', 'fa-solid fa-compact-disc', 'Velg & Ban Customizer', 'velg ban wheel variasi')}
                ${navLink('pages/merchandise.html', 'fa-solid fa-shirt', 'Merchandise Toyota', 'merch baju kaos topi gantungan payung jaket')}

                <p class="sidebar-nav-label">Tier 5: Refreshment & Arcade Games</p>
                ${navLink('pages/game.html', 'fa-solid fa-gamepad', 'Toyota Arcade Center', 'game arcade main santai')}
                ${navLink('pages/drag_race.html', 'fa-solid fa-gauge-high', 'Toyota Drag Strip', 'drag race balap gr')}
                ${navLink('pages/valet_park.html', 'fa-solid fa-square-parking', 'Valet Parking VIP', 'valet parkir park')}
                ${navLink('pages/hybrid_flow.html', 'fa-solid fa-bolt', 'Hybrid Energy Flow', 'hybrid simulator baterai')}
                ${navLink('pages/pitstop.html', 'fa-solid fa-wrench', 'GR Pit Stop Challenge', 'pit stop montir bengkel ban')}
                ${navLink('pages/memory_match.html', 'fa-solid fa-clone', 'Toyota Memory Match', 'memory tebak kartu match')}
                ${navLink('pages/catur.html', 'fa-solid fa-chess-knight', 'Toyota Catur Master', 'catur chess strategi')}
                ${navLink('pages/balap.html', 'fa-solid fa-flag-checkered', 'Toyota GR Racing', 'racing balapan sirkuit')}
                ${navLink('pages/snake.html', 'fa-solid fa-gas-pump', 'Parkir Drift & Fuel Rush', 'snake ular drift pom bensin')}
                ${navLink('pages/tebak.html', 'fa-solid fa-brain', 'Tebak Otomotif', 'tebak kuis trivia')}
                ${navLink('pages/tts.html', 'fa-solid fa-puzzle-piece', 'TTS Otomotif', 'tts teka teki silang')}
                ${navLink('pages/tss-simulator.html', 'fa-solid fa-shield-halved', 'Simulator TSS 3.0', 'tss safety toyota safety sense radar')}

                <div class="sidebar-search-empty" id="sidebarSearchEmpty" style="display:none;">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <div style="font-weight:700; color:#fff; margin-bottom:2px;">Fitur tidak ditemukan</div>
                    <div style="font-size:11px; opacity:0.8;">Coba gunakan kata kunci lain</div>
                </div>
            </div>

            <div class="sidebar-bottom">
                <a href="${prefix}pages/notifikasi.html" class="sidebar-notif-btn">
                    <i class="fa-regular fa-bell"></i>
                    Notifikasi
                    <span class="sidebar-notif-badge" id="sidebarBellBadge" style="display:none;">0</span>
                </a>
                <a href="${prefix}pages/profil.html" class="sidebar-notif-btn" style="margin-top:4px;">
                    <i class="fa-solid fa-user"></i>
                    Profil Saya
                </a>
            </div>
        `;
        return nav;
    }

    // ── Inject sidebar & wrap layout ────────────────────────
    function injectSidebar() {
        // Skip on login pages and public card / tracking pages
        if (path.includes('login') || path.includes('public_card') || path.includes('track_public')) {
            if (document.body) document.body.classList.add('sidebar-loaded');
            return;
        }

        // If this page already has a #desktopSidebar (e.g. index.html), update content to ensure menu is sync'd
        let existingSidebar = document.getElementById('desktopSidebar');
        if (existingSidebar) {
            const newSidebar = buildSidebar();
            existingSidebar.innerHTML = newSidebar.innerHTML;
            populate();
            if (document.body) document.body.classList.add('sidebar-loaded');
            return;
        }

        // Wrap body content in desktop-shell > desktop-content
        const body = document.body;
        const children = Array.from(body.childNodes);

        const shell = document.createElement('div');
        shell.className = 'desktop-shell';

        const sidebar = buildSidebar();
        shell.appendChild(sidebar);

        const contentWrap = document.createElement('div');
        contentWrap.className = 'desktop-content';

        // Move existing children into contentWrap
        children.forEach(child => contentWrap.appendChild(child));

        shell.appendChild(contentWrap);
        body.appendChild(shell);

        populate();
        body.classList.add('sidebar-loaded');
    }

    // ── Populate user data ──────────────────────────────────
    function populate() {
        const roleSales = localStorage.getItem('peranSales') || 'Sales';
        const namaSales = localStorage.getItem('namaSales') || (roleSales === 'Kepala Cabang' ? 'Kepala Cabang' : (roleSales === 'Supervisor' ? 'Supervisor' : 'Sales'));
        const cabangSales = localStorage.getItem('cabangSales') || '';
        const idSales = localStorage.getItem('idSales') || 0;

        const elNama = document.getElementById('sidebarNama');
        if (elNama) elNama.textContent = namaSales;

        const elRole = document.getElementById('sidebarRole');
        if (elRole) elRole.textContent = cabangSales ? `${roleSales} · ${cabangSales}` : roleSales;

        const elAvatar = document.getElementById('sidebarAvatar');
        if (elAvatar) {
            const foto = localStorage.getItem('fotoSales');
            if (foto && foto.trim() !== '') {
                elAvatar.src = foto;
            } else {
                const initials = namaSales.split(' ').slice(0, 2).map(w => w[0]).join('');
                const bg = roleSales === 'Kepala Cabang' ? '1e1014' : (roleSales === 'Supervisor' ? '1c2740' : 'f4f7f6');
                const fg = roleSales === 'Kepala Cabang' ? 'd8a437' : (roleSales === 'Supervisor' ? 'ffffff' : 'c8102e');
                elAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(initials || namaSales)}&background=${bg}&color=${fg}&bold=true`;
            }
        }

        window.logoutUser = function() {
            const role = localStorage.getItem('peranSales');
            const idSales = localStorage.getItem('idSales') || localStorage.getItem('sales_id');
            const username = localStorage.getItem('usernameSales') || localStorage.getItem('userSales') || localStorage.getItem('username');

            if (idSales || username) {
                if (navigator.sendBeacon) {
                    const blob = new Blob([JSON.stringify({ action: 'offline', id_sales: idSales || 0, username: username || '' })], { type: 'application/json' });
                    navigator.sendBeacon(prefix + 'api/api_heartbeat.php', blob);
                }
            }

            localStorage.clear();
            if (role === 'Kepala Cabang') {
                window.location.href = prefix + 'pages/login_kacab.html';
            } else if (role === 'Supervisor') {
                window.location.href = prefix + 'pages/login_spv.html';
            } else {
                window.location.href = prefix + 'pages/login.html';
            }
        };

        // ── Real-Time Online Presence / Heartbeat Signal ────────
        (function initOnlineHeartbeat() {
            const role = localStorage.getItem('peranSales') || 'Sales';
            const idUser = localStorage.getItem('idSales') || localStorage.getItem('sales_id') || localStorage.getItem('id_spv') || localStorage.getItem('id_user') || 0;
            const username = localStorage.getItem('usernameSales') || localStorage.getItem('userSales') || localStorage.getItem('username') || '';
            const nama = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || '';

            // Hanya kirim heartbeat jika user sedang login
            if (!idUser && !username && !nama) return;

            function sendHeartbeat(action = 'ping') {
                const apiHeartbeat = prefix + 'api/api_heartbeat.php';
                const payload = {
                    action: action,
                    role: role,
                    id_sales: idUser,
                    id_user: idUser,
                    username: username,
                    nama: nama
                };

                if (action === 'offline' && navigator.sendBeacon) {
                    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
                    navigator.sendBeacon(apiHeartbeat, blob);
                    return;
                }

                fetch(apiHeartbeat, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => {});
            }

            // Kirim heartbeat saat halaman dimuat
            sendHeartbeat('ping');

            // Kirim heartbeat berkala setiap 35 detik selama tab aktif
            setInterval(() => {
                if (!document.hidden) {
                    sendHeartbeat('ping');
                }
            }, 35000);

            // Kirim heartbeat saat tab kembali aktif
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden) {
                    sendHeartbeat('ping');
                }
            });

            // Kirim sinyal offline saat tab/browser ditutup
            window.addEventListener('beforeunload', () => {
                sendHeartbeat('offline');
            });
        })();

        // ── Visual Notification Toast ──────────────────────────
        window.showToastNotification = function (msg) {
            let toastContainer = document.getElementById('toast-container-global');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container-global';
                toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:999999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
                document.body.appendChild(toastContainer);
            }
            const toast = document.createElement('div');
            toast.style.cssText = 'background:#1e293b;color:#fff;padding:16px 24px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);font-family:Inter,sans-serif;font-size:14px;font-weight:600;display:flex;align-items:center;gap:12px;opacity:0;transform:translateY(-20px);transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);pointer-events:auto;border-left:4px solid #ef4444;';
            toast.innerHTML = `<i class="fa-solid fa-bell" style="color:#ef4444;font-size:18px;"></i> <span>${msg}</span>`;
            toastContainer.appendChild(toast);

            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateY(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateY(-20px)';
                setTimeout(() => toast.remove(), 400);
            }, 5000);
        };

        // ── Audio Notification Function (Ding-Dong) ────────────
        window.sharedAudioCtx = null;
        function initAudio() {
            if (!window.sharedAudioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) window.sharedAudioCtx = new AudioContext();
            }
        }

        // Unlock audio on first interaction
        document.addEventListener('click', () => {
            initAudio();
            if (window.sharedAudioCtx && window.sharedAudioCtx.state === 'suspended') {
                window.sharedAudioCtx.resume();
            }
        }, { once: true });

        window.playNotificationSound = function () {
            try {
                initAudio();
                const ctx = window.sharedAudioCtx;
                if (!ctx) return;
                if (ctx.state === 'suspended') ctx.resume();

                function playTone(freq, type, startTime, duration, vol) {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = type;
                    osc.frequency.setValueAtTime(freq, startTime);

                    gain.gain.setValueAtTime(0, startTime);
                    gain.gain.linearRampToValueAtTime(vol, startTime + 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

                    osc.connect(gain);
                    gain.connect(ctx.destination);

                    osc.start(startTime);
                    osc.stop(startTime + duration);
                }

                const t = ctx.currentTime;
                playTone(1318.51, 'sine', t, 0.4, 0.8);
                playTone(1318.51, 'triangle', t, 0.4, 0.3);
                playTone(1046.50, 'sine', t + 0.3, 0.6, 0.8);
                playTone(1046.50, 'triangle', t + 0.3, 0.6, 0.3);
            } catch (e) {
                console.error("Audio error", e);
            }
        };

        // Restore saved badge count instantly on load
        (function restoreSalesBadges() {
            const savedUnread = localStorage.getItem('salesNotifBadgeCount');
            if (savedUnread !== null && parseInt(savedUnread, 10) > 0) {
                const count = parseInt(savedUnread, 10);
                const displayVal = count > 99 ? '99+' : count;

                setTimeout(() => {
                    const bellBadge = document.getElementById('sidebarBellBadge');
                    const approvalBadge = document.getElementById('sidebarApprovalBadge');
                    const headerBadge = document.getElementById('navNotifBadge') || document.getElementById('mobileNotifBadge');

                    if (bellBadge) { bellBadge.textContent = displayVal; bellBadge.style.display = 'flex'; }
                    if (approvalBadge) { approvalBadge.textContent = displayVal; approvalBadge.style.display = 'inline-flex'; }
                    if (headerBadge) { headerBadge.textContent = displayVal; headerBadge.style.display = 'inline-flex'; }
                }, 50);
            }
        })();

        // Notification polling
        const apiBase = prefix + 'api/';
        let lastUnreadCount = parseInt(localStorage.getItem('salesNotifBadgeCount') || 0, 10);
        let isFirstLoad = true;

        function checkNotifications() {
            const params = new URLSearchParams();
            if (idSales) params.append('sales_account_id', idSales);
            if (namaSales) params.append('nama_sales', namaSales);

            fetch(`${apiBase}api_notifikasi.php?${params.toString()}`)
                .then(r => r.json())
                .then(res => {
                    if (res.status === 'success' && Array.isArray(res.data)) {
                        const unread = res.data.filter(n => n.unread).length;
                        localStorage.setItem('salesNotifBadgeCount', unread);

                        const displayVal = unread > 99 ? '99+' : unread;
                        const bellBadge = document.getElementById('sidebarBellBadge');
                        const approvalBadge = document.getElementById('sidebarApprovalBadge');
                        const headerBadge = document.getElementById('navNotifBadge') || document.getElementById('mobileNotifBadge');

                        if (!isFirstLoad) {
                            if (unread !== lastUnreadCount) {
                                if (unread > lastUnreadCount) {
                                    if (typeof window.playNotificationSound === 'function') window.playNotificationSound();
                                    if (typeof window.showToastNotification === 'function') window.showToastNotification("Notifikasi Baru! Terdapat pembaruan status pengajuan dari Supervisor.");
                                }

                                // Auto-refresh views
                                if (typeof window.fetchApprovalList === 'function') window.fetchApprovalList();
                                if (typeof window.loadTradeInList === 'function') window.loadTradeInList();
                                if (typeof window.loadDashboardTradeIn === 'function') window.loadDashboardTradeIn();
                                if (typeof window.loadSpkList === 'function') window.loadSpkList();
                                if (typeof window.fetchNotifications === 'function') window.fetchNotifications();
                            }
                        }

                        lastUnreadCount = unread;
                        isFirstLoad = false;

                        if (unread > 0) {
                            if (bellBadge) { bellBadge.textContent = displayVal; bellBadge.style.display = 'flex'; }
                            if (approvalBadge) { approvalBadge.textContent = displayVal; approvalBadge.style.display = 'inline-flex'; }
                            if (headerBadge) { headerBadge.textContent = displayVal; headerBadge.style.display = 'inline-flex'; }
                        } else {
                            if (bellBadge) bellBadge.style.display = 'none';
                            if (approvalBadge) approvalBadge.style.display = 'none';
                            if (headerBadge) headerBadge.style.display = 'none';
                        }
                    }
                })
                .catch(() => { });
        }

        checkNotifications();
        setInterval(checkNotifications, 10000); // Poll every 10 seconds

        // ── Sidebar Instant Search Feature Filter ──────────────
        (function initSidebarSearchFilter() {
            const searchInput = document.getElementById('sidebarSearchInput');
            const searchClear = document.getElementById('sidebarSearchClear');
            const sidebarNav = document.querySelector('#desktopSidebar .sidebar-nav');
            const emptyState = document.getElementById('sidebarSearchEmpty');

            if (!searchInput || !sidebarNav) return;

            function filterMenu() {
                const q = searchInput.value.toLowerCase().trim();
                if (searchClear) {
                    searchClear.style.display = q ? 'flex' : 'none';
                }

                const links = sidebarNav.querySelectorAll('.sidebar-nav-link');
                const labels = sidebarNav.querySelectorAll('.sidebar-nav-label');
                let totalVisible = 0;

                links.forEach(link => {
                    const text = (link.textContent || '').toLowerCase();
                    const href = (link.getAttribute('href') || '').toLowerCase();
                    const tags = (link.getAttribute('data-tags') || '').toLowerCase();
                    const isMatch = !q || text.includes(q) || href.includes(q) || tags.includes(q);

                    link.style.display = isMatch ? 'flex' : 'none';
                    if (isMatch) totalVisible++;
                });

                // Hide category labels if no links in that section match
                labels.forEach(label => {
                    if (!q) {
                        label.style.display = '';
                        return;
                    }
                    let nextEl = label.nextElementSibling;
                    let hasVisibleLink = false;
                    while (nextEl && !nextEl.classList.contains('sidebar-nav-label')) {
                        if (nextEl.classList.contains('sidebar-nav-link') && nextEl.style.display !== 'none') {
                            hasVisibleLink = true;
                            break;
                        }
                        nextEl = nextEl.nextElementSibling;
                    }
                    label.style.display = hasVisibleLink ? '' : 'none';
                });

                if (emptyState) {
                    emptyState.style.display = (totalVisible === 0 && q) ? 'block' : 'none';
                }
            }

            searchInput.addEventListener('input', filterMenu);

            if (searchClear) {
                searchClear.addEventListener('click', () => {
                    searchInput.value = '';
                    filterMenu();
                    searchInput.focus();
                });
            }

            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    searchInput.value = '';
                    filterMenu();
                    searchInput.blur();
                }
            });
        })();

        // ── Restore & Save Sidebar Scroll Position ──────────────
        const sidebarNav = document.querySelector('#desktopSidebar .sidebar-nav');
        if (sidebarNav) {
            const savedScroll = parseInt(localStorage.getItem('sidebarScrollTop') || 0, 10);
            if (savedScroll > 0) {
                sidebarNav.scrollTop = savedScroll;
                setTimeout(() => { sidebarNav.scrollTop = savedScroll; }, 10);
            }
            sidebarNav.addEventListener('scroll', () => {
                localStorage.setItem('sidebarScrollTop', sidebarNav.scrollTop);
            });
        }

        // ── Highlight Active Menu Link ──────────────────────────
        const navLinks = document.querySelectorAll('#desktopSidebar .sidebar-nav-link');
        const currentPath = window.location.pathname;
        let currentClean = currentPath.split('/').pop().split('?')[0].split('#')[0];
        if (!currentClean) currentClean = 'index';
        currentClean = currentClean.replace('.html', '');

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref) {
                const linkClean = linkHref.split('/').pop().split('?')[0].split('#')[0].replace('.html', '');
                if (currentClean === linkClean || (currentClean === '' && linkClean === 'index')) {
                    link.classList.add('active');
                }
            }
        });

        // ── Global Executive Header Upgrader ────────────────────
        (function upgradeHeaders() {
            const headers = document.querySelectorAll('.header-page');
            headers.forEach(header => {
                if (header.classList.contains('header-upgraded')) return;
                header.classList.add('header-upgraded');

                // Find title element
                const h2 = header.querySelector('h2, h1, .header-title');
                let titleText = h2 ? h2.textContent.trim() : document.title.replace(/^Sales App\s*-\s*/i, '').trim();
                let titleId = h2 ? h2.id : '';

                // Find back link
                const backBtn = header.querySelector('a');
                let backHref = prefix + 'index.html';
                let backId = backBtn ? backBtn.id : '';
                if (backBtn && backBtn.getAttribute('href')) {
                    const hrefVal = backBtn.getAttribute('href');
                    if (hrefVal && hrefVal !== '#' && !hrefVal.startsWith('javascript:')) {
                        backHref = hrefVal;
                    }
                }

                // Collect non-title & non-backbtn nodes (e.g. right side buttons, badges)
                const otherNodes = Array.from(header.childNodes).filter(node => {
                    if (node === h2 || node === backBtn) return false;
                    if (node.nodeType === 3 && !node.textContent.trim()) return false;
                    return true;
                });

                // Re-build inner HTML cleanly
                header.innerHTML = `
                    <div class="header-nav-group">
                        <a href="${backHref}" ${backId ? `id="${backId}"` : ''} class="header-back-btn" title="Kembali ke Dashboard">
                            <i class="fa-solid fa-arrow-left"></i>
                        </a>
                        <div class="header-breadcrumb">
                            <a href="${prefix}index.html">Dashboard</a>
                            <span class="header-breadcrumb-sep">/</span>
                            <span class="active-crumb" ${titleId ? `id="${titleId}"` : ''}>${titleText}</span>
                        </div>
                    </div>
                    <div class="header-right-group"></div>
                `;

                const rightGroup = header.querySelector('.header-right-group');
                otherNodes.forEach(node => rightGroup.appendChild(node));
            });
        })();

        // Class active untuk bottom-nav sudah diatur langsung dari masing-masing file HTML.
    }

    // ── Run ────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectSidebar);
    } else {
        injectSidebar();
    }

    // Automatically load AI Copilot Assistant Script for Sales pages only
    (function loadAiCopilotScript() {
        const pathLower = path.toLowerCase();
        if (pathLower.includes('login') || pathLower.includes('spv') || pathLower.includes('kacab') || pathLower.includes('pages_spv') || pathLower.includes('pages_kacab') || pathLower.includes('ai_copilot')) {
            return;
        }
        if (window.aiCopilotLoaded || document.querySelector('script[src*="ai_copilot.js"]')) {
            return;
        }
        const script = document.createElement('script');
        script.src = prefix + 'js/ai_copilot.js?v=20260819_tstock_wa_share';
        (document.head || document.documentElement).appendChild(script);
    })();

    // Safety fallback to ensure page is always visible
    setTimeout(() => {
        if (document.body && !document.body.classList.contains('sidebar-loaded')) {
            document.body.classList.add('sidebar-loaded');
        }
    }, 300);

})(); // End of initDesktopSidebar

// =========================================================================
// UNIVERSAL FLOATING SCROLL-TO-TOP BUTTON (ROBUST STANDALONE ENGINE)
// =========================================================================
(function initGlobalScrollToTop() {
    function setupScrollToTop() {
        if (document.getElementById('sftScrollToTopBtn')) return;

        // 1. Inject Styles
        if (!document.getElementById('sftScrollTopStyle')) {
            const style = document.createElement('style');
            style.id = 'sftScrollTopStyle';
            style.innerHTML = `
                .sft-scroll-top-btn {
                    position: fixed;
                    bottom: 85px;
                    right: 24px;
                    width: 45px;
                    height: 45px;
                    border-radius: 14px;
                    background: linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #c8102e 100%);
                    color: #ffffff !important;
                    border: 1.5px solid rgba(255, 255, 255, 0.3);
                    box-shadow: 0 10px 25px -4px rgba(13, 27, 62, 0.45), 0 0 0 1px rgba(200, 16, 46, 0.2);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 17px;
                    z-index: 99999;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(16px) scale(0.85);
                    transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease;
                    outline: none;
                    user-select: none;
                    text-decoration: none;
                }
                .sft-scroll-top-btn.show {
                    opacity: 1 !important;
                    visibility: visible !important;
                    transform: translateY(0) scale(1) !important;
                    pointer-events: auto !important;
                }
                .sft-scroll-top-btn:hover {
                    transform: translateY(-3px) scale(1.06) !important;
                    box-shadow: 0 14px 30px -4px rgba(200, 16, 46, 0.5), 0 0 15px rgba(200, 16, 46, 0.4);
                    background: linear-gradient(135deg, #1e3a8a 0%, #c8102e 100%);
                    color: #ffffff !important;
                }
                .sft-scroll-top-btn:active {
                    transform: translateY(0) scale(0.95) !important;
                }
                .sft-scroll-top-btn i {
                    transition: transform 0.2s ease;
                    color: #ffffff;
                }
                .sft-scroll-top-btn:hover i {
                    transform: translateY(-2px);
                }
                .sft-scroll-top-tooltip {
                    position: absolute;
                    right: 54px;
                    background: #0f172a;
                    color: #ffffff;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 10px;
                    border-radius: 8px;
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    transform: translateX(8px);
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .sft-scroll-top-btn:hover .sft-scroll-top-tooltip {
                    opacity: 1;
                    transform: translateX(0);
                }
                @media (max-width: 768px) {
                    .sft-scroll-top-btn {
                        bottom: 145px;
                        right: 18px;
                        width: 42px;
                        height: 42px;
                        font-size: 15px;
                        border-radius: 12px;
                    }
                    .sft-scroll-top-tooltip {
                        display: none;
                    }
                }
            `;
            (document.head || document.documentElement).appendChild(style);
        }

        // 2. Create Button Element
        const btn = document.createElement('button');
        btn.id = 'sftScrollToTopBtn';
        btn.className = 'sft-scroll-top-btn';
        btn.setAttribute('type', 'button');
        btn.setAttribute('title', 'Scroll ke Atas');
        btn.setAttribute('aria-label', 'Scroll ke Atas');
        btn.innerHTML = `
            <i class="fa-solid fa-chevron-up"></i>
            <span class="sft-scroll-top-tooltip">Ke Atas</span>
        `;

        // 3. Scroll to Top Handler
        function doScrollToTop(e) {
            if (e) {
                e.preventDefault();
                e.stopPropagation();
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
            document.body.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Scroll all possible overflowing containers
            const scrollables = document.querySelectorAll('.desktop-content, .table-responsive, .mobile-app, .container, main, [style*="overflow"]');
            scrollables.forEach(el => {
                if (el && el.scrollTop > 0) {
                    el.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        }

        btn.addEventListener('click', doScrollToTop);
        document.body.appendChild(btn);

        // 4. Robust Visibility Checker (captures any container scrolling)
        function checkScrollPosition() {
            const winScroll = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            let maxScroll = winScroll;

            const scrollables = document.querySelectorAll('.desktop-content, .table-responsive, .mobile-app, .container, main, [style*="overflow"]');
            scrollables.forEach(el => {
                if (el && el.scrollTop > maxScroll) {
                    maxScroll = el.scrollTop;
                }
            });

            if (maxScroll > 100) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        }

        // Listen on all capture scroll events
        window.addEventListener('scroll', checkScrollPosition, { passive: true, capture: true });
        document.addEventListener('scroll', checkScrollPosition, { passive: true, capture: true });
        
        // Also check periodically in case of lazy content load
        setInterval(checkScrollPosition, 400);
    }

    if (document.body) {
        setupScrollToTop();
    } else {
        document.addEventListener('DOMContentLoaded', setupScrollToTop);
    }
})();
