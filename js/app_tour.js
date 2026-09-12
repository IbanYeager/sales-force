/**
 * app_tour.js - Interactive Guided Onboarding Tour for Sales App
 * Designed for maximum accessibility (senior sales-friendly):
 * Large fonts, high-contrast spotlight overlay, clear buttons,
 * and persistent storage (appears once on install, skippable, replayable anytime).
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'sft_app_tour_completed_v1';

  // Tour steps definition targeting main dashboard elements
  const TOUR_STEPS = [
    {
      target: '.btn-input-aktivitas',
      title: '1. Absen & Laporan Harian',
      desc: 'Setiap pagi atau setelah bertemu customer di lapangan, pencet tombol ini untuk absen lokasi GPS dan unggah foto kegiatan Anda.',
      icon: 'fa-camera',
      badge: 'Langkah 1 dari 5'
    },
    {
      target: '.target-link, .target-card',
      title: '2. Pantau Target SPK & DO',
      desc: 'Di kartu ini, Anda bisa melihat berapa sisa target SPK dan unit DO yang harus Anda capai bulan ini secara otomatis tanpa perlu hitung manual.',
      icon: 'fa-bullseye',
      badge: 'Langkah 2 dari 5'
    },
    {
      target: '.category-card, .main-feature-grid',
      title: '3. Senjata Jualan (Fitur Utama)',
      desc: 'Gunakan Pricelist untuk cek harga OTR, E-Catalog untuk brosur mobil, dan Live Inventory untuk cek stok unit yang ready di gudang.',
      icon: 'fa-clipboard-list',
      badge: 'Langkah 3 dari 5'
    },
    {
      target: '.btn-input-spk',
      title: '4. Bikin SPK & Input DO',
      desc: 'Kalau customer sudah deal, langsung pencet tombol ini untuk membuat surat pesanan resmi (SPK) atau mengajukan jadwal pengiriman mobil (DO).',
      icon: 'fa-file-signature',
      badge: 'Langkah 4 dari 5'
    },
    {
      target: '.btn-sop-guide',
      title: '5. Panduan Bergambar (SOP)',
      desc: 'Kapan saja Anda lupa urutan pemesanan mobil, cukup pencet tombol ini untuk membaca panduan bergambar yang sangat mudah dipahami.',
      icon: 'fa-book-bookmark',
      badge: 'Langkah 5 dari 5'
    }
  ];

  let currentStepIndex = 0;
  let activeOverlay = null;
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
        background: rgba(15, 23, 42, 0.82);
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
        max-width: 440px;
        width: 100%;
        padding: 30px 24px;
        text-align: center;
        box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
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
        line-height: 1.5;
        margin-bottom: 24px;
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
        border-radius: 20px;
        padding: 22px 20px;
        width: min(360px, 92vw);
        box-shadow: 0 20px 45px rgba(0, 0, 0, 0.4);
        border: 2px solid #e2e8f0;
        z-index: 999998;
        transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      .tour-tooltip-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
      }
      .tour-tooltip-badge {
        font-size: 11px;
        font-weight: 800;
        background: #fee2e2;
        color: #d71920;
        padding: 3px 10px;
        border-radius: 20px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .tour-tooltip-close {
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
      }
      .tour-tooltip-close:hover {
        color: #ef4444;
      }
      .tour-tooltip-title {
        font-family: 'Outfit', sans-serif;
        font-size: 18px;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .tour-tooltip-title i {
        color: #d71920;
      }
      .tour-tooltip-desc {
        font-size: 14.5px;
        color: #334155;
        line-height: 1.55;
        margin-bottom: 18px;
      }
      .tour-tooltip-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
        padding-top: 14px;
        border-top: 1px solid #f1f5f9;
      }
      .tour-btn-group {
        display: flex;
        gap: 8px;
      }
      .btn-tour-nav {
        border: none;
        padding: 9px 15px;
        border-radius: 10px;
        font-size: 13px;
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
        font-size: 12.5px;
        font-weight: 700;
        cursor: pointer;
        text-decoration: underline;
      }
      .btn-tour-exit-link:hover {
        color: #ef4444;
      }
    `;
    document.head.appendChild(style);
  }

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
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h2 class="tour-welcome-title">Selamat Datang di Sales App!</h2>
          <p class="tour-welcome-desc">
            Mau kami perlihatkan panduan singkat cara pakai aplikasi ini? Anda cukup ikuti petunjuk panah di layar (hanya 1 menit).
          </p>
          <div class="tour-welcome-actions">
            <button type="button" class="btn-tour-start" id="btnStartTourAction">
              <i class="fa-solid fa-play"></i> Mulai Tutorial Singkat
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

  function renderCurrentStep() {
    // Find matching step element that exists in current DOM
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

    // Scroll element into view centered
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
      updateSpotlightAndTooltip(el, step);
    }, 350);
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
  }

  function positionTooltipSmart(rect) {
    if (!activeTooltip) return;
    const ttRect = activeTooltip.getBoundingClientRect();
    const margin = 14;
    const winH = window.innerHeight;
    const winW = window.innerWidth;

    // Check if place below
    let top = rect.bottom + margin;
    if (top + 220 > winH) {
      // Place above
      top = Math.max(16, rect.top - 240);
    }

    // Horizontal centering
    let left = rect.left + (rect.width / 2) - (ttRect.width / 2);
    if (left < 16) left = 16;
    if (left + ttRect.width > winW - 16) left = winW - ttRect.width - 16;

    activeTooltip.style.top = `${top}px`;
    activeTooltip.style.left = `${left}px`;
  }

  function cleanTourElements() {
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
      <div class="tour-welcome-card">
        <div class="tour-welcome-badge" style="background:linear-gradient(135deg, #10b981, #059669); box-shadow:0 10px 20px rgba(16,185,129,0.3);">
          <i class="fa-solid fa-circle-check"></i>
        </div>
        <h2 class="tour-welcome-title">Tutorial Selesai! 🎉</h2>
        <p class="tour-welcome-desc">
          Keren, sekarang Anda sudah tahu tombol-tombol utamanya. Anda bisa membuka kembali tutorial ini kapan saja lewat menu Panduan.
        </p>
        <button type="button" class="btn-tour-start" style="background:#10b981; width:100%;" onclick="this.closest('.tour-welcome-overlay').remove()">
          <i class="fa-solid fa-thumbs-up"></i> Mulai Gunakan Aplikasi Sekarang
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
