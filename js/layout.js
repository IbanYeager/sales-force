// ── LAYOUT KORPORAT — navbar desktop & footer ──
// Disuntikkan otomatis di semua halaman agar konsisten (satu sumber).
// Mobile (<1024px): header app + bottom nav tetap dipakai (CSS yang mengatur).

(function () {
  const NAV_LINKS = [
    { href: 'index.html', label: 'Beranda' },
    { href: 'mobil.html', label: 'Katalog Mobil' },
    { href: 'service.html', label: '⚡ FastPass' },
    { href: 'academy.html', label: '🎓 Academy' },
    { href: 'gems.html', label: '📍 G.E.M.S' },
    { href: 'eco-calculator.html', label: '🌿 Eco & CO₂' },
    { href: 'tss-simulator.html', label: '🛡️ TSS Safety' },
    { href: 'matchmaker.html', label: '🪄 AI Matchmaker' },
    { href: 'pricelist.html', label: 'Price List' },
    { href: 'kalkulator.html', label: 'Simulasi Kredit' },
    { href: 'tradein.html', label: 'Tukar Tambah' },
  ];

  // Halaman turunan menyorot menu induknya di navbar
  const PAGE_PARENT = {
    'kalkulator.html': 'kalkulator.html',
    'gems.html': 'gems.html',
    'academy.html': 'academy.html',
    'eco-calculator.html': 'eco-calculator.html',
    'tss-simulator.html': 'tss-simulator.html',
    'matchmaker.html': 'matchmaker.html',
    'compare.html': 'mobil.html',
    'configurator.html': 'mobil.html',
    'olx.html': 'olx.html',
    'garasi.html': 'garasi.html',
    'tradein.html': 'tradein.html',
    'tracking.html': 'tracking.html',
    'service.html': 'service.html',
  };

  function currentPage() {
    let p = location.pathname.split('/').pop().split('?')[0].split('#')[0];
    if (!p || p === 'customer_pov') return 'index.html';
    if (!p.includes('.')) p += '.html';
    if (p.endsWith('.php')) p = p.replace('.php', '.html');
    return p;
  }

  function buildFooter() {
    const year = new Date().getFullYear();
    const footer = document.createElement('footer');
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="site-footer-inner">
        <div class="footer-col footer-brand">
          <img src="image/download.png" alt="Tunas Toyota">
          <p>Dealer resmi Toyota di Bandung. Melayani penjualan unit baru, mobil bekas OLX, tukar tambah,
             simulasi kredit, dan layanan purna jual dengan standar Toyota Indonesia.</p>
        </div>
        <div class="footer-col">
          <h4>Fitur Unggulan KIARA</h4>
          <ul>
            <li><a href="service.html">⚡ m-KIARA FastPass (Express 60m)</a></li>
            <li><a href="academy.html">🎓 KIARA Academy (Video & Darurat)</a></li>
            <li><a href="gems.html">📍 KIARA G.E.M.S (Mitra & Promo)</a></li>
            <li><a href="eco-calculator.html">🌿 Toyota Eco & CO₂ Calculator</a></li>
            <li><a href="tss-simulator.html">🛡️ TSS (Toyota Safety Sense) Simulator</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Layanan Dealer</h4>
          <ul>
            <li><a href="mobil.html">Katalog Mobil Baru</a></li>
            <li><a href="olx.html">Mobil Bekas (OLX)</a></li>
            <li><a href="pricelist.html">Price List OTR</a></li>
            <li><a href="kalkulator.html">Simulasi Kredit</a></li>
            <li><a href="tradein.html">Tukar Tambah</a></li>
            <li><a href="compare.html">Komparasi Mobil</a></li>
            <li><a href="configurator.html">3D Configurator</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Informasi & Pelanggan</h4>
          <ul>
            <li><a href="promo.html">Promo Berjalan</a></li>
            <li><a href="service.html">Booking Service</a></li>
            <li><a href="tracking.html">Lacak Komplain & Service</a></li>
            <li><a href="garasi.html">Garasi Saya</a></li>
            <li><a href="merchandise.html">Merchandise Toyota</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Kontak</h4>
          <ul>
            <li class="footer-contact-item"><i class="fa-solid fa-location-dot"></i>
              <span>Jl. Terusan Kiaracondong No.47, Kb. Kangkung, Kec. Kiaracondong, Kota Bandung, Jawa Barat 40275</span></li>
            <li class="footer-contact-item"><i class="fa-solid fa-clock"></i>
              <span>Senin &ndash; Jumat: 08.30 &ndash; 16.30 WIB<br>Sabtu: 08.30 &ndash; 14.30 WIB</span></li>
            <li class="footer-contact-item"><i class="fa-brands fa-whatsapp"></i>
              <span><a href="#" onclick="hubungiAI(''); return false;" style="color:inherit">+62 82119004796</a></span></li>
          </ul>
        </div>
      </div>
      <div class="site-footer-bottom">
        <div class="site-footer-bottom-inner">
          <span>&copy; ${year} Tunas Toyota Kiaracondong. Seluruh hak cipta dilindungi.</span>
          <div class="footer-social">
            <a href="https://www.instagram.com/tunas.toyotakiaracondong?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://www.tiktok.com/@kakitoyota?_t=8Qe5r7k585O&_r=1" target="_blank" rel="noopener" aria-label="Tiktok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="[EMAIL_ADDRESS]" target="_blank" rel="noopener" aria-label="Email"><i class="fa-solid fa-envelope"></i></a>
          </div>
        </div>
      </div>`;
    return footer;
  }

  // ── Bottom-nav: pastikan selalu ada item aktif ──
  function initBottomNav() {
    const nav = document.querySelector('.bottom-nav');
    if (!nav) return;

    if (!nav.querySelector('.nav-item.active')) {
      const page = currentPage();
      const target = PAGE_PARENT[page] || page;
      const link = nav.querySelector(`.nav-item[href="${target}"]`);
      if (link) link.classList.add('active');
    }

    nav.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        nav.querySelectorAll('.nav-item').forEach(i => i.classList.toggle('active', i === item));
      });
    });
  }

  window.toggleNavDrawer = function () {
    const drawer = document.getElementById('navDrawerOverlay');
    if (drawer) {
      const isActive = drawer.classList.contains('active');
      if (isActive) {
        window.closeNavDrawer();
      } else {
        drawer.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    }
  };

  window.closeNavDrawer = function (e) {
    if (e && e.target && e.target.id !== 'navDrawerOverlay' && (typeof e.target.classList?.contains !== 'function' || !e.target.classList.contains('nav-drawer-close')) && (typeof e.target.closest !== 'function' || !e.target.closest('.nav-drawer-close'))) {
      return;
    }
    const drawer = document.getElementById('navDrawerOverlay');
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  function buildDrawer() {
    const drawer = document.createElement('div');
    drawer.className = 'nav-drawer-overlay';
    drawer.id = 'navDrawerOverlay';
    drawer.onclick = window.closeNavDrawer;
    drawer.innerHTML = `
      <div class="nav-drawer-panel" onclick="event.stopPropagation()">
        <div class="nav-drawer-header">
          <div class="nav-drawer-brand">
            <div class="brand-logo-group">
              <img src="image/download.png" alt="Tunas Toyota">
              <div class="brand-subtext-pill">
                <span class="location-dot"></span>
                <span class="location-text">Kiaracondong</span>
              </div>
            </div>
          </div>
          <button class="nav-drawer-close" onclick="window.closeNavDrawer(event)" aria-label="Tutup Menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="nav-drawer-body">
          <!-- CATEGORY 1 -->
          <div class="nav-drawer-section-title">Penjualan & Produk</div>
          <a href="mobil.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(239,68,68,0.14); color:#ef4444;"><i class="fa-solid fa-car"></i></div>
            <div class="nav-drawer-info"><b>Katalog Mobil Baru</b><span>Temukan line-up Toyota resmi</span></div>
          </a>
          <a href="olx.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(249,115,22,0.14); color:#ea580c;"><i class="fa-solid fa-car-side"></i></div>
            <div class="nav-drawer-info"><b>Mobil Bekas (OLX)</b><span>Tersertifikasi, mulus & garansi</span></div>
          </a>
          <a href="pricelist.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(168,85,247,0.14); color:#9333ea;"><i class="fa-solid fa-clipboard-list"></i></div>
            <div class="nav-drawer-info"><b>Price List OTR</b><span>Daftar harga mobil Bandung</span></div>
          </a>
          <a href="promo.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(34,197,94,0.14); color:#16a34a;"><i class="fa-solid fa-percent"></i></div>
            <div class="nav-drawer-info"><b>Promo & Diskon</b><span>Penawaran terbatas bulan ini</span></div>
          </a>
          <a href="kalkulator.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(245,158,11,0.14); color:#d97706;"><i class="fa-solid fa-calculator"></i></div>
            <div class="nav-drawer-info"><b>Simulasi Kredit</b><span>Hitung angsuran & DP instan</span></div>
          </a>
          <a href="tradein.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(6,182,212,0.14); color:#0891b2;"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>
            <div class="nav-drawer-info"><b>Tukar Tambah (S.A.C)</b><span>Estimasi harga & janji temu appraisal</span></div>
          </a>
          <a href="compare.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(236,72,153,0.14); color:#db2777;"><i class="fa-solid fa-code-compare"></i></div>
            <div class="nav-drawer-info"><b>Komparasi Mobil</b><span>Bandingkan fitur & spesifikasi</span></div>
          </a>
          <a href="configurator.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(16,185,129,0.14); color:#10b981;"><i class="fa-solid fa-paint-roller"></i></div>
            <div class="nav-drawer-info"><b>3D Configurator</b><span>Kustomisasi tipe & warna</span></div>
          </a>

          <!-- CATEGORY 2 -->
          <div class="nav-drawer-section-title" style="margin-top:18px;">6 Inovasi Unggulan KIARA</div>
          <a href="service.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(16,185,129,0.14); color:#10b981;"><i class="fa-solid fa-bolt"></i></div>
            <div class="nav-drawer-info"><b>m-KIARA FastPass</b><span>Booking service prioritas 60m Express</span></div>
          </a>
          <a href="academy.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(99,102,241,0.14); color:#6366f1;"><i class="fa-solid fa-graduation-cap"></i></div>
            <div class="nav-drawer-info"><b>KIARA Academy</b><span>Video tutorial & panduan darurat</span></div>
          </a>
          <a href="gems.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(236,72,153,0.14); color:#ec4899;"><i class="fa-solid fa-location-dot"></i></div>
            <div class="nav-drawer-info"><b>KIARA G.E.M.S</b><span>Destinasi & voucher mitra lokal</span></div>
          </a>
          <a href="eco-calculator.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(34,197,94,0.14); color:#22c55e;"><i class="fa-solid fa-leaf"></i></div>
            <div class="nav-drawer-info"><b>Eco & CO₂ Calculator</b><span>Kalkulator emisi & penghematan EV</span></div>
          </a>
          <a href="tss-simulator.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(2,132,199,0.14); color:#0284c7;"><i class="fa-solid fa-shield-halved"></i></div>
            <div class="nav-drawer-info"><b>TSS Safety Simulator</b><span>Simulasi fitur keselamatan Toyota</span></div>
          </a>
          <a href="matchmaker.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(168,85,247,0.14); color:#a855f7;"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
            <div class="nav-drawer-info"><b>AI Car Matchmaker</b><span>Rekomendasi mobil ideal AI</span></div>
          </a>

          <!-- CATEGORY 3 -->
          <div class="nav-drawer-section-title" style="margin-top:18px;">Purna Jual & Lifestyle</div>
          <a href="care.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(239,68,68,0.14); color:#ef4444;"><i class="fa-solid fa-headset"></i></div>
            <div class="nav-drawer-info"><b>KIARA Care</b><span>Pusat pengaduan & layanan komplain</span></div>
          </a>
          <a href="tracking.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(59,130,246,0.14); color:#3b82f6;"><i class="fa-solid fa-route"></i></div>
            <div class="nav-drawer-info"><b>KIARA S.B.I Express</b><span>Tracking STNK, BPKB & Invoice</span></div>
          </a>
          <a href="minuman.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(217,119,6,0.14); color:#d97706;"><i class="fa-solid fa-wine-glass"></i></div>
            <div class="nav-drawer-info"><b>Tunas Lounge Cafe</b><span>Pesan minuman 100% Real Fruit</span></div>
          </a>
          <a href="merchandise.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(244,63,94,0.14); color:#f43f5e;"><i class="fa-solid fa-bag-shopping"></i></div>
            <div class="nav-drawer-info"><b>GR Merchandise Store</b><span>Souvenir & clothing resmi Gazoo</span></div>
          </a>
          <a href="garasi.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(99,102,241,0.14); color:#4f46e5;"><i class="fa-solid fa-warehouse"></i></div>
            <div class="nav-drawer-info"><b>Garasi Saya</b><span>Simpan unit impian Anda</span></div>
          </a>
          <a href="game.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(239,68,68,0.14); color:#ef4444;"><i class="fa-solid fa-gamepad"></i></div>
            <div class="nav-drawer-info"><b>Toyota Arcade Center</b><span>Mini game catur, balap, tebak & TTS</span></div>
          </a>

          <!-- CATEGORY 4 -->
          <div class="nav-drawer-section-title" style="margin-top:18px;">Informasi & Ulasan Dealer</div>
          <a href="berita.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(2,132,199,0.14); color:#0284c7;"><i class="fa-solid fa-newspaper"></i></div>
            <div class="nav-drawer-info"><b>Berita & Tips Toyota</b><span>Launching, event & artikel otomotif</span></div>
          </a>
          <a href="review.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(16,185,129,0.14); color:#10b981;"><i class="fa-solid fa-star"></i></div>
            <div class="nav-drawer-info"><b>Ulasan Pelanggan</b><span>Testimoni Bintang 5 pembeli & servis</span></div>
          </a>
          <a href="lokasi.html" class="nav-drawer-link">
            <div class="nav-drawer-icon" style="background:rgba(239,68,68,0.14); color:#ef4444;"><i class="fa-solid fa-location-dot"></i></div>
            <div class="nav-drawer-info"><b>Lokasi & Rute Dealer</b><span>Alamat, jam buka & Google Maps</span></div>
          </a>
        </div>

        <div class="nav-drawer-footer">
          <button class="btn-red" style="width:100%; justify-content:center; padding:12px; font-size:13px;" onclick="hubungiAI('Halo Sales Tunas Toyota'); window.closeNavDrawer(event);">
            <i class="fa-brands fa-whatsapp"></i> Chat Sales Toyota
          </button>
        </div>
      </div>`;
    return drawer;
  }

  function buildNavbar() {
    const page = currentPage();
    const activeTarget = PAGE_PARENT[page] || page;
    const nav = document.createElement('div');
    nav.className = 'site-nav';
    nav.innerHTML = `
      <div class="site-nav-main">
        <div class="site-nav-inner">
          <a href="index.html" class="site-nav-brand">
            <div class="brand-logo-group">
              <img src="image/download.png" alt="Tunas Toyota">
              <div class="brand-subtext-pill">
                <span class="location-dot"></span>
                <span class="location-text">Kiaracondong</span>
              </div>
            </div>
          </a>
          <div class="site-nav-actions">
            <button class="nav-theme-toggle" aria-label="Ganti tema terang/gelap" onclick="toggleTheme()">
              <i class="fa-solid ${document.documentElement.getAttribute('data-theme') === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
            </button>
            <button class="nav-hamburger-btn" onclick="window.toggleNavDrawer()" aria-label="Buka Menu">
              <i class="fa-solid fa-bars"></i>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>`;

    // Navbar mengecil + topbar menutup saat halaman di-scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 24);
        ticking = false;
      });
    }, { passive: true });

    return nav;
  }

  document.addEventListener('DOMContentLoaded', () => {
    initBottomNav();
    const app = document.querySelector('.mobile-app');
    if (!app) return;
    app.insertBefore(buildNavbar(), app.firstChild);
    document.body.appendChild(buildDrawer());
    const bottomNav = app.querySelector('.bottom-nav');
    const footer = buildFooter();
    if (bottomNav) app.insertBefore(footer, bottomNav);
    else app.appendChild(footer);
  });
})();
