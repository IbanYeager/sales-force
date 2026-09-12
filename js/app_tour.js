/**
 * app_tour.js - Interactive Guided Onboarding Tour for Sales App
 * Alur Kerja Penjualan Lengkap: Dari Mencari Customer sampai Pengiriman Mobil (DO).
 * Dirancang ramah untuk seluruh sales (termasuk sales senior/tua):
 * Tulisan besar, spotlight sorotan jelas, dan tombol navigasi praktis.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'sft_app_tour_completed_v2';

  // 5 Tahapan Alur Penjualan: Dari Prospek hingga DO
  const TOUR_STEPS = [
    {
      target: '.btn-input-aktivitas',
      title: '1. Cari & Catat Calon Pembeli',
      desc: 'Alur dimulai dari sini! Saat Anda bertemu orang yang tertarik mobil Toyota di showroom, pameran, atau canvassing lapangan, catat nama dan nomor WhatsApp-nya agar tersimpan rapi di database CRM.',
      icon: 'fa-user-plus',
      badge: 'Tahap 1: Prospek Customer'
    },
    {
      target: '.main-feature-grid a[href*="pricelist.html"], .category-item[href*="pricelist.html"]',
      title: '2. Cek Harga & Hitung Cicilan',
      desc: 'Customer tertarik mobil tertentu? Klik menu Pricelist OTR untuk cek harga resmi, lalu gunakan Kalkulator Kredit untuk menentukan DP serta angsuran bulanan yang pas di kantong pembeli.',
      icon: 'fa-calculator',
      badge: 'Tahap 2: Harga & Simulasi Kredit'
    },
    {
      target: '.main-feature-grid a[href*="inventory.html"], .category-item[href*="inventory.html"]',
      title: '3. Cek Ketersediaan Mobil di Gudang',
      desc: 'Sebelum customer bayar tanda jadi, klik Live Inventory untuk memastikan tipe dan warna mobil yang diinginkan ready stock di gudang cabang kita.',
      icon: 'fa-warehouse',
      badge: 'Tahap 3: Cek Stok Gudang'
    },
    {
      target: '.btn-input-spk',
      title: '4. Customer Deal: Bikin SPK Resmi!',
      desc: 'Customer sudah setuju harga dan unit? Klik tombol ini lalu pilih "Buat Pengajuan SPK". Cukup foto KTP customer, upload bukti transfer tanda jadi (booking fee), dan minta customer tanda tangan di layar HP.',
      icon: 'fa-file-signature',
      badge: 'Tahap 4: Pemesanan Resmi (SPK)'
    },
    {
      target: '.tgt-metric.is-green, .btn-input-spk',
      title: '5. Mobil Siap Kirim (Penerbitan DO)',
      desc: 'Tahap terakhir: Begitu leasing acc atau pembayaran tunai lunas, klik tombol ini lalu pilih "Input DO Langsung". Masukkan alamat kirim, lalu foto serah terima mobil bersama customer. Target DO Anda langsung tercapai!',
      icon: 'fa-truck-ramp-box',
      badge: 'Tahap 5: Kirim Mobil (DO)'
    }
  ];

  let currentStepIndex = 0;
  let activeSpotlight = null;
  let activeTooltip = null;

  // Inject required CSS styles
  function injectTourStyles() {
    if (document.getElementById('sftTourStyles')) return;
    const style = document.createElement('style');
    style.id = 'sftTourStyles';
    style.innerHTML = `
      /* Welcome Modal */
      .tour-welcome-overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.84);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        z-index: 999990;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease, visibility 0.3s ease;
      }
      .tour-welcome-overlay.show {
        opacity: 1;
        visibility: visible;
      }
      .tour-welcome-card {
        background: #ffffff;
        border-radius: 24px;
        max-width: 460px;
        width: 100%;
        padding: 30px 24px;
        text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.45);
        border: 2px solid #e2e8f0;
        transform: scale(0.92);
        transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .tour-welcome-overlay.show .tour-welcome-card {
        transform: scale(1);
      }
      .tour-welcome-badge {
        width: 64px;
        height: 64px;
        border-radius: 20px;
        background: linear-gradient(135deg, #d71920, #a81016);
        color: white;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        margin-bottom: 16px;
        box-shadow: 0 10px 20px rgba(215, 25, 32, 0.3);
      }
      .tour-welcome-title {
        font-family: 'Outfit', sans-serif;
        font-size: 22px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 8px;
        line-height: 1.3;
      }
      .tour-welcome-desc {
        font-size: 15px;
        color: #475569;
        line-height: 1.55;
        margin-bottom: 22px;
      }
      .tour-welcome-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .btn-tour-start {
        background: linear-gradient(135deg, #d71920, #b91c1c);
        color: white;
        border: none;
        padding: 14px 20px;
        border-radius: 14px;
        font-size: 15px;
        font-weight: 800;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        box-shadow: 0 6px 16px rgba(215, 25, 32, 0.35);
        transition: all 0.2s;
      }
      .btn-tour-start:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 22px rgba(215, 25, 32, 0.45);
      }
      .btn-tour-skip {
        background: #f1f5f9;
        color: #64748b;
        border: 1px solid #cbd5e1;
        padding: 12px 20px;
        border-radius: 14px;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
      }
      .btn-tour-skip:hover {
        background: #e2e8f0;
        color: #1e293b;
      }

      /* Spotlight & Tooltip */
      .tour-spotlight {
        position: fixed;
        border-radius: 18px;
        box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.78);
        border: 3px solid #d71920;
        z-index: 999995;
        pointer-events: none;
        transition: all 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .tour-spotlight::after {
        content: '';
        position: absolute;
        inset: -8px;
        border-radius: 24px;
        border: 2px dashed rgba(255, 255, 255, 0.6);
        animation: tourPulse 2s infinite;
      }
      @keyframes tourPulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.9; transform: scale(1.02); }
      }

      .tour-tooltip-box {
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
      .tour-tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;
      }
      .tour-tooltip-badge {
        font-size: 10.5px;
        font-weight: 800;
        background: #fee2e2;
        color: #d71920;
        padding: 3px 9px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .tour-tooltip-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 20px;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
      }
      .tour-tooltip-close:hover {
        color: #ef4444;
      }
      .tour-tooltip-title {
        font-family: 'Outfit', sans-serif;
        font-size: 15.5px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 5px;
        display: flex;
        align-items: center;
        gap: 7px;
        line-height: 1.25;
      }
      .tour-tooltip-title i {
        color: #d71920;
      }
      .tour-tooltip-desc {
        font-size: 13px;
        color: #334155;
        line-height: 1.45;
        margin-bottom: 10px;
      }
      .tour-tooltip-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding-top: 8px;
        border-top: 1px solid #f1f5f9;
      }
      .tour-btn-group {
        display: flex;
        gap: 8px;
      }
      .btn-tour-nav {
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
      .btn-tour-prev {
        background: #f1f5f9;
        color: #475569;
      }
      .btn-tour-prev:hover {
        background: #e2e8f0;
      }
      .btn-tour-next {
        background: #d71920;
        color: white;
      }
      .btn-tour-next:hover {
        background: #b91c1c;
      }
      .btn-tour-exit-link {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 12px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
        padding: 4px 6px;
      }
      .btn-tour-exit-link:hover {
        color: #ef4444;
      }

      /* Lock Scrolling during Tour */
      html.tour-scroll-locked,
      body.tour-scroll-locked,
      .tour-scroll-locked {
        overflow: hidden !important;
        overscroll-behavior: none !important;
        touch-action: none !important;
      }
    `;
    document.head.appendChild(style);
  }

  // ── Robust Scroll Locking Engine ──
  let isScrollLocked = false;
  let currentTargetEl = null;

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

  function syncSpotlightPosition() {
    if (activeSpotlight && currentTargetEl) {
      const rect = currentTargetEl.getBoundingClientRect();
      const pad = 6;
      activeSpotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
      activeSpotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
      activeSpotlight.style.width = `${rect.width + pad * 2}px`;
      activeSpotlight.style.height = `${rect.height + pad * 2}px`;
      if (activeTooltip) {
        positionTooltipSmart(rect);
      }
    }
  }

  window.addEventListener('scroll', syncSpotlightPosition, { passive: true, capture: true });
  window.addEventListener('resize', syncSpotlightPosition, { passive: true });

  // Show Welcome Dialog
  function showWelcomeModal() {
    injectTourStyles();

    let overlay = document.getElementById('tourWelcomeOverlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'tourWelcomeOverlay';
      overlay.className = 'tour-welcome-overlay';
      overlay.innerHTML = `
        <div class="tour-welcome-card">
          <div class="tour-welcome-badge">
            <i class="fa-solid fa-car-side"></i>
          </div>
          <h2 class="tour-welcome-title">Alur Penjualan: Dari Prospek ke DO</h2>
          <p class="tour-welcome-desc">
            Mau kami perlihatkan panduan singkat (1 menit): Bagaimana alur kerja dari <strong>pertama kali mencari customer</strong> sampai <strong>mobil dikirim (DO)</strong> ke rumah pembeli?
          </p>
          <div class="tour-welcome-actions">
            <button type="button" class="btn-tour-start" id="btnStartTourAction">
              <i class="fa-solid fa-play"></i> Mulai Tutorial (Dari Prospek ke DO)
            </button>
            <button type="button" class="btn-tour-skip" id="btnSkipTourAction">
              ✕ Lewati (Jangan Tampilkan Lagi)
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('btnStartTourAction').addEventListener('click', () => {
        closeWelcomeModal();
        startTourSteps();
      });

      document.getElementById('btnSkipTourAction').addEventListener('click', () => {
        markTourCompleted();
        closeWelcomeModal();
      });
    }

    setTimeout(() => {
      overlay.classList.add('show');
    }, 100);
  }

  function closeWelcomeModal() {
    const overlay = document.getElementById('tourWelcomeOverlay');
    if (overlay) {
      overlay.classList.remove('show');
      setTimeout(() => overlay.remove(), 300);
    }
  }

  function markTourCompleted() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}
  }

  // Start the Step-by-Step Tour
  function startTourSteps() {
    injectTourStyles();
    currentStepIndex = 0;
    renderCurrentStep();
  }

  function getScrollParent(node) {
    if (!node) return null;
    let parent = node.parentElement;
    while (parent && parent !== document.body && parent !== document.documentElement) {
      const style = window.getComputedStyle(parent);
      if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  }

  function scrollTargetIntoComfortView(el) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const winH = window.innerHeight;
    // Posisikan target di 10% - 15% bagian atas layar agar ruang di bawahnya sangat lega untuk tooltip
    const desiredTop = Math.max(65, Math.min(110, Math.round(winH * 0.13)));
    const diff = rect.top - desiredTop;

    if (Math.abs(diff) > 10) {
      const scrollParent = getScrollParent(el);
      if (scrollParent) {
        scrollParent.scrollBy({
          top: diff,
          behavior: 'smooth'
        });
      } else {
        window.scrollBy({
          top: diff,
          behavior: 'smooth'
        });
        if (document.scrollingElement) {
          document.scrollingElement.scrollBy({
            top: diff,
            behavior: 'smooth'
          });
        }
      }
    }
  }

  function renderCurrentStep() {
    let step = TOUR_STEPS[currentStepIndex];
    let el = null;

    // Search for element
    while (currentStepIndex < TOUR_STEPS.length) {
      step = TOUR_STEPS[currentStepIndex];
      el = document.querySelector(step.target);
      if (el && el.offsetParent !== null) break; // element is visible
      currentStepIndex++;
    }

    if (!el || currentStepIndex >= TOUR_STEPS.length) {
      finishTourCelebration();
      return;
    }

    currentTargetEl = el;

    // Temporarily allow scrolling so browser can smoothly position target comfortably
    unlockPageScroll();
    scrollTargetIntoComfortView(el);

    // Render spotlight and tooltip immediately
    updateSpotlightAndTooltip(el, step);

    // After smooth scroll finishes, lock scroll and do final sync
    setTimeout(() => {
      syncSpotlightPosition();
      lockPageScroll();
    }, 450);
  }

  function updateSpotlightAndTooltip(el, step) {
    const rect = el.getBoundingClientRect();
    const pad = 6;

    // Create or update spotlight
    if (!activeSpotlight) {
      activeSpotlight = document.createElement('div');
      activeSpotlight.className = 'tour-spotlight';
      document.body.appendChild(activeSpotlight);
    }

    activeSpotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
    activeSpotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
    activeSpotlight.style.width = `${rect.width + pad * 2}px`;
    activeSpotlight.style.height = `${rect.height + pad * 2}px`;

    // Create or update tooltip
    if (!activeTooltip) {
      activeTooltip = document.createElement('div');
      activeTooltip.className = 'tour-tooltip-box';
      document.body.appendChild(activeTooltip);
    }

    const isLast = currentStepIndex === TOUR_STEPS.length - 1;
    const isFirst = currentStepIndex === 0;

    activeTooltip.innerHTML = `
      <div class="tour-tooltip-header">
        <span class="tour-tooltip-badge">${step.badge}</span>
        <button type="button" class="tour-tooltip-close" title="Tutup Tutorial" onclick="window.exitAppTour()">&times;</button>
      </div>
      <h3 class="tour-tooltip-title"><i class="fa-solid ${step.icon}"></i> ${step.title}</h3>
      <p class="tour-tooltip-desc">${step.desc}</p>
      <div class="tour-tooltip-footer">
        <button type="button" class="btn-tour-exit-link" onclick="window.exitAppTour()">Lewati</button>
        <div class="tour-btn-group">
          ${!isFirst ? `<button type="button" class="btn-tour-nav btn-tour-prev" onclick="window.prevAppTourStep()"><i class="fa-solid fa-arrow-left"></i> Mundur</button>` : ''}
          <button type="button" class="btn-tour-nav btn-tour-next" onclick="window.nextAppTourStep()">
            ${isLast ? 'Selesai & Paham <i class="fa-solid fa-check"></i>' : 'Lanjut <i class="fa-solid fa-arrow-right"></i>'}
          </button>
        </div>
      </div>
    `;

    // Position tooltip smart (below if space, above otherwise)
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

  function cleanTourElements() {
    unlockPageScroll();
    currentTargetEl = null;
    if (activeSpotlight) {
      activeSpotlight.remove();
      activeSpotlight = null;
    }
    if (activeTooltip) {
      activeTooltip.remove();
      activeTooltip = null;
    }
  }

  function finishTourCelebration() {
    cleanTourElements();
    markTourCompleted();

    // Show quick celebration modal
    const celOverlay = document.createElement('div');
    celOverlay.className = 'tour-welcome-overlay show';
    celOverlay.innerHTML = `
      <div class="tour-welcome-card" style="max-width:480px;">
        <div class="tour-welcome-badge" style="background:linear-gradient(135deg, #10b981, #059669); box-shadow:0 10px 20px rgba(16,185,129,0.3);">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="tour-welcome-title">Alur Penjualan Selesai! 🎉</h2>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:14px 16px; margin:14px 0; text-align:left; font-size:13.5px; line-height:1.75; color:#334155;">
          <div>📍 <strong>1. Prospek:</strong> Catat calon pembeli di Aktivitas / CRM</div>
          <div>🧮 <strong>2. Simulasi:</strong> Cek harga di Pricelist & Kalkulator Kredit</div>
          <div>🏢 <strong>3. Cek Stok:</strong> Pastikan mobil ready di Live Inventory</div>
          <div>📝 <strong>4. Closing SPK:</strong> Foto KTP & minta tanda tangan di layar HP</div>
          <div>🚚 <strong>5. Pengiriman DO:</strong> Input surat jalan & foto serah terima mobil</div>
        </div>
        <p class="tour-welcome-desc" style="font-size:13.5px; margin-bottom:16px;">
          Keren! Anda sekarang sudah paham urutan cara jualan mobil dari awal mencari pembeli sampai mobil dikirim ke rumah customer.
        </p>
        <button type="button" class="btn-tour-start" style="background:#10b981; width:100%;" onclick="this.closest('.tour-welcome-overlay').remove()">
          <i class="fa-solid fa-thumbs-up"></i> Siap Berjualan Sekarang!
        </button>
      </div>
    `;
    document.body.appendChild(celOverlay);
  }

  // Global methods for button click handlers
  window.nextAppTourStep = function () {
    currentStepIndex++;
    if (currentStepIndex >= TOUR_STEPS.length) {
      finishTourCelebration();
    } else {
      renderCurrentStep();
    }
  };

  window.prevAppTourStep = function () {
    if (currentStepIndex > 0) {
      currentStepIndex--;
      renderCurrentStep();
    }
  };

  window.exitAppTour = function () {
    cleanTourElements();
    markTourCompleted();
  };

  window.startAppTour = function (force = true) {
    if (force) {
      cleanTourElements();
      startTourSteps();
    } else {
      showWelcomeModal();
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && activeSpotlight) {
      window.exitAppTour();
    }
  });

  // Auto-trigger on dashboard if not completed yet
  document.addEventListener('DOMContentLoaded', () => {
    // Only auto-trigger on the main dashboard
    const isDashboard = window.location.pathname.endsWith('index.html') ||
                        window.location.pathname === '/' ||
                        window.location.pathname.endsWith('dashboard') ||
                        window.location.pathname.endsWith('sft%20-%20Copy/') ||
                        document.querySelector('.mobile-app');

    if (isDashboard) {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('tour') === '1' || window.location.hash.includes('tour')) {
        setTimeout(() => {
          startTourSteps();
        }, 500);
        return;
      }

      const isCompleted = localStorage.getItem(STORAGE_KEY) === 'true';
      if (!isCompleted) {
        // Delay slightly for smooth transition
        setTimeout(() => {
          showWelcomeModal();
        }, 800);
      }
    }
  });

})();
