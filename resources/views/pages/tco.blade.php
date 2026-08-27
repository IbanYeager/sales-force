<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toyota Customization Option (TCO) Explorer</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
    rel="stylesheet">

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css">
  <script src="../js/sidebar_desktop.js"></script>

  <style>
    /* ══════════════════════════════════════════════════════════
       TCO EXPLORER — PREMIUM REDESIGN v2.0
       Glassmorphism · Animated Gradients · Staggered Motion
    ══════════════════════════════════════════════════════════ */

    .tco-wrapper {
      padding-bottom: 80px;
      position: relative;
      overflow: hidden;
    }

    /* ── Page Entry Animation ── */
    .tco-wrapper > * {
      animation: tcoSlideUp 0.6s var(--ease-out) both;
    }
    .tco-wrapper > *:nth-child(1) { animation-delay: 0.05s; }
    .tco-wrapper > *:nth-child(2) { animation-delay: 0.12s; }
    .tco-wrapper > *:nth-child(3) { animation-delay: 0.2s; }

    @keyframes tcoSlideUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ══════════════════════════════════════════════════
       HERO HEADER — Animated Glow Orbs
    ══════════════════════════════════════════════════ */
    .tco-header {
      background: var(--navy-grad);
      color: white;
      padding: 32px 28px 36px;
      border-radius: var(--radius-xl);
      margin-bottom: 28px;
      box-shadow: var(--shadow-blue);
      position: relative;
      overflow: hidden;
    }

    /* Animated glow orbs */
    .tco-header::before {
      content: '';
      position: absolute;
      top: -60px;
      right: -40px;
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(215, 18, 58, 0.35) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(30px);
      animation: orbFloat1 6s ease-in-out infinite alternate;
    }

    .tco-header::after {
      content: '';
      position: absolute;
      bottom: -40px;
      left: -30px;
      width: 140px;
      height: 140px;
      background: radial-gradient(circle, rgba(53, 101, 224, 0.3) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(25px);
      animation: orbFloat2 8s ease-in-out infinite alternate;
    }

    @keyframes orbFloat1 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(-15px, 20px) scale(1.15); }
    }
    @keyframes orbFloat2 {
      0% { transform: translate(0, 0) scale(1); }
      100% { transform: translate(20px, -15px) scale(1.1); }
    }

    .tco-header-content {
      position: relative;
      z-index: 2;
    }

    .tco-header h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      line-height: 1.2;
      background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #ffffff 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmerText 4s ease-in-out infinite;
    }

    @keyframes shimmerText {
      0% { background-position: 0% center; }
      100% { background-position: 200% center; }
    }

    .tco-header p {
      margin: 0;
      font-size: 13px;
      opacity: 0.8;
      line-height: 1.7;
      font-weight: 400;
      max-width: 85%;
    }

    .badge-new {
      background: rgba(215, 18, 58, 0.15);
      color: #f87171;
      padding: 5px 12px;
      border-radius: 8px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      border: 1px solid rgba(215, 18, 58, 0.25);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 14px;
      backdrop-filter: blur(4px);
      animation: badgePulse 3s ease-in-out infinite;
    }

    @keyframes badgePulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(215, 18, 58, 0.2); }
      50% { box-shadow: 0 0 0 8px rgba(215, 18, 58, 0); }
    }

    /* ── Shimmer Accent Line ── */
    .hero-shimmer-line {
      height: 3px;
      background: linear-gradient(90deg, transparent, rgba(215, 18, 58, 0.6), rgba(53, 101, 224, 0.5), transparent);
      background-size: 200% 100%;
      border-radius: 4px;
      margin-top: 20px;
      animation: shimmerLine 3s ease-in-out infinite;
    }

    @keyframes shimmerLine {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    /* ══════════════════════════════════════════════════
       MODEL PILLS — Premium Visual Cards
    ══════════════════════════════════════════════════ */
    .model-selector-wrapper {
      position: relative;
      z-index: 1;
    }

    .scroll-pills-container {
      display: flex;
      gap: 10px;
      overflow-x: auto;
      padding: 4px 4px 16px 4px;
      -ms-overflow-style: none;
      scrollbar-width: none;
      scroll-behavior: smooth;
    }

    .scroll-pills-container::-webkit-scrollbar {
      display: none;
    }

    /* ── Model Pill Card ── */
    .pill-btn {
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(232, 236, 244, 0.9);
      color: var(--text-secondary);
      padding: 14px 18px;
      border-radius: var(--radius-md);
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.35s var(--ease);
      box-shadow: var(--shadow-xs);
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      min-width: 82px;
      text-align: center;
    }

    .pill-btn .pill-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-xs);
      background: linear-gradient(135deg, #f1f5f9 0%, #e8ecf4 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      color: var(--text-muted);
      transition: all 0.35s var(--ease);
    }

    .pill-btn .pill-name {
      font-weight: 800;
      font-size: 11px;
      line-height: 1.3;
      letter-spacing: -0.2px;
      max-width: 72px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .pill-btn .pill-count {
      font-size: 9px;
      font-weight: 700;
      color: var(--text-light);
      background: rgba(232, 236, 244, 0.6);
      padding: 2px 8px;
      border-radius: var(--radius-full);
      transition: all 0.3s var(--ease);
    }

    .pill-btn::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--primary-red);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .pill-btn:hover {
      border-color: rgba(215, 18, 58, 0.18);
      transform: translateY(-3px);
      box-shadow: var(--shadow-sm);
      color: var(--text-dark);
    }

    .pill-btn:hover .pill-icon {
      background: linear-gradient(135deg, #fdedf1 0%, #fce7f3 100%);
      color: var(--primary-red);
      transform: scale(1.05);
    }

    .pill-btn:hover::before {
      opacity: 0.5;
    }

    .pill-btn:active {
      transform: translateY(0) scale(0.97);
    }

    .pill-btn.active {
      background: var(--navy-grad);
      color: white;
      border-color: transparent;
      box-shadow: var(--shadow-blue);
      transform: translateY(-3px);
    }

    .pill-btn.active .pill-icon {
      background: rgba(255, 255, 255, 0.12);
      color: white;
    }

    .pill-btn.active .pill-name {
      color: white;
    }

    .pill-btn.active .pill-count {
      background: rgba(215, 18, 58, 0.5);
      color: white;
    }

    .pill-btn.active::before {
      opacity: 1;
      background: var(--red-grad);
      animation: activePillGlow 2s ease-in-out infinite;
    }

    @keyframes activePillGlow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }

    /* ══════════════════════════════════════════════════
       CATEGORY FILTER — Modern Chips with Dots
    ══════════════════════════════════════════════════ */
    .cat-pill {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 12px;
      font-weight: 600;
      padding: 8px 16px;
      border-radius: var(--radius-full);
      cursor: pointer;
      transition: all 0.25s var(--ease);
      white-space: nowrap;
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .cat-pill::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
      opacity: 0;
      transform: scale(0);
      transition: all 0.3s var(--spring);
    }

    .cat-pill::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 3px;
      background: var(--primary-red);
      border-radius: 3px 3px 0 0;
      transition: width 0.3s var(--ease);
    }

    .cat-pill:hover {
      color: var(--text-dark);
      background: rgba(215, 18, 58, 0.04);
    }

    .cat-pill.active {
      color: var(--primary-red);
      font-weight: 800;
      background: rgba(215, 18, 58, 0.06);
    }

    .cat-pill.active::before {
      opacity: 1;
      transform: scale(1);
    }

    .cat-pill.active::after {
      width: 70%;
    }

    /* ══════════════════════════════════════════════════
       PDF / CATALOG CARD — Glassmorphism Frame
    ══════════════════════════════════════════════════ */
    .pdf-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(232, 236, 244, 0.7);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      margin-bottom: 36px;
      transition: transform 0.35s var(--ease), box-shadow 0.35s var(--ease);
      position: relative;
    }

    .pdf-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, var(--primary-red), var(--accent-blue), var(--accent-gold));
      background-size: 200% 100%;
      animation: gradientSlide 4s ease infinite;
      z-index: 2;
    }

    @keyframes gradientSlide {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .pdf-header {
      padding: 18px 22px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(248, 250, 255, 0.6);
    }

    .pdf-title {
      margin: 0;
      font-size: 16px;
      font-weight: 800;
      color: var(--text-dark);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .pdf-title i {
      color: var(--primary-red);
      font-size: 18px;
    }

    .btn-download-sm {
      background: rgba(215, 18, 58, 0.06);
      color: var(--primary-red);
      padding: 9px 16px;
      border-radius: var(--radius-xs);
      font-size: 12px;
      font-weight: 700;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.25s var(--ease);
      border: 1px solid rgba(215, 18, 58, 0.12);
    }

    .btn-download-sm:hover {
      background: var(--primary-red);
      color: white;
      transform: translateY(-1px);
      box-shadow: var(--shadow-glow-red);
    }

    .btn-download-sm:active {
      transform: translateY(0) scale(0.97);
    }

    /* ══════════════════════════════════════════════════
       ITEM CARDS — Premium Redesigned Grid
    ══════════════════════════════════════════════════ */
    .item-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 16px;
    }

    /* ── Extra Detail Elements ── */
    .item-pn-badge {
      font-size: 10px;
      font-weight: 700;
      color: #64748b;
      background: #f1f5f9;
      padding: 2px 6px;
      border-radius: 4px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      margin-top: 4px;
      border: 1px solid #e2e8f0;
      font-family: monospace;
    }

    .dealer-price-table {
      margin-top: 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 6px 8px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 10px;
    }

    .dealer-price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .dealer-price-label {
      color: #64748b;
      font-weight: 600;
    }

    .dealer-price-val {
      color: #0f172a;
      font-weight: 800;
    }

    .item-grade-info {
      font-size: 10px;
      font-weight: 600;
      color: #334155;
      background: #edf2f7;
      padding: 4px 8px;
      border-radius: 6px;
      margin-top: 6px;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      line-height: 1.3;
    }

    .item-grade-info i {
      color: var(--primary-red);
      font-size: 10px;
      margin-top: 2px;
    }

    .item-card {
      display: flex;
      flex-direction: column;
      background: white;
      border: 1px solid rgba(232, 236, 244, 0.7);
      border-radius: var(--radius-lg);
      box-shadow: var(--ring), var(--shadow-xs);
      transition: all 0.4s var(--ease);
      position: relative;
      overflow: hidden;
      /* Staggered animation — set by JS */
      opacity: 0;
      transform: translateY(20px);
      animation: cardEntrance 0.5s var(--ease-out) forwards;
    }

    /* ── Category colored top accent ── */
    .item-card .card-accent {
      height: 4px;
      width: 100%;
      flex-shrink: 0;
    }

    .item-card .card-body {
      padding: 18px 16px 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    /* ── Icon + Type Row ── */
    .item-card .card-top-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .item-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-md);
      border-color: rgba(232, 236, 244, 0.4);
    }

    @keyframes cardEntrance {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .item-icon {
      width: 46px;
      height: 46px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      flex-shrink: 0;
      transition: transform 0.3s var(--spring);
    }

    .item-card:hover .item-icon {
      transform: scale(1.1) rotate(-4deg);
    }

    .card-top-info {
      flex: 1;
      min-width: 0;
    }

    .item-details {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .item-type {
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 800;
      margin-bottom: 1px;
    }

    /* Color the type label to match category */
    .item-type.type-label-utility { color: #0284c7; }
    .item-type.type-label-safety { color: #16a34a; }
    .item-type.type-label-protection { color: #9333ea; }
    .item-type.type-label-comfort { color: #d97706; }
    .item-type.type-label-styling { color: #db2777; }
    .item-type.type-label-exterior { color: #db2777; }
    .item-type.type-label-fragrance { color: #0284c7; }
    .item-type.type-label-default { color: var(--text-muted); }

    .item-name {
      margin: 0;
      font-size: 13.5px;
      font-weight: 800;
      color: var(--text-dark);
      line-height: 1.35;
      letter-spacing: -0.2px;
    }

    /* ── Price Section ── */
    .item-price-section {
      margin-top: auto;
      padding-top: 10px;
    }

    .price-amount {
      font-size: 15px;
      font-weight: 900;
      color: var(--text-dark);
      letter-spacing: -0.3px;
      line-height: 1;
    }

    .price-amount .price-prefix {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      margin-right: 1px;
    }

    /* ── Stock + Action Row ── */
    .item-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 16px 14px;
      background: linear-gradient(180deg, rgba(248,250,255,0) 0%, rgba(241,245,249,0.5) 100%);
    }

    /* ── Icon Category Colors ── */
    .type-utility {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      color: #0284c7;
      box-shadow: 0 3px 10px rgba(2, 132, 199, 0.12);
    }

    .type-safety {
      background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
      color: #16a34a;
      box-shadow: 0 3px 10px rgba(22, 163, 74, 0.12);
    }

    .type-protection {
      background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
      color: #9333ea;
      box-shadow: 0 3px 10px rgba(147, 51, 234, 0.12);
    }

    .type-comfort {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      color: #d97706;
      box-shadow: 0 3px 10px rgba(217, 119, 6, 0.12);
    }

    .type-styling {
      background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
      color: #db2777;
      box-shadow: 0 3px 10px rgba(219, 39, 119, 0.12);
    }

    .type-fragrance {
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      color: #0284c7;
      box-shadow: 0 3px 10px rgba(2, 132, 199, 0.12);
    }

    .type-default {
      background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
      color: #475569;
      box-shadow: 0 3px 10px rgba(71, 85, 105, 0.08);
    }

    /* ── Accent color per type ── */
    .accent-utility { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .accent-safety { background: linear-gradient(90deg, #16a34a, #4ade80); }
    .accent-protection { background: linear-gradient(90deg, #9333ea, #c084fc); }
    .accent-comfort { background: linear-gradient(90deg, #d97706, #fbbf24); }
    .accent-styling { background: linear-gradient(90deg, #db2777, #f472b6); }
    .accent-fragrance { background: linear-gradient(90deg, #0284c7, #38bdf8); }
    .accent-default { background: linear-gradient(90deg, #64748b, #94a3b8); }

    /* ── Stock Badges ── */
    .stock-badge {
      font-size: 9px;
      font-weight: 800;
      padding: 4px 8px;
      border-radius: 6px;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      letter-spacing: 0.2px;
      border: 1px solid transparent;
      white-space: nowrap;
    }

    .stock-ready {
      background: var(--green-light);
      color: var(--green-success);
      border-color: rgba(13, 146, 104, 0.15);
    }

    .stock-ready i {
      font-size: 8px;
      animation: stockPulse 2s ease-in-out infinite;
    }

    @keyframes stockPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .stock-empty {
      background: rgba(248, 250, 255, 0.8);
      color: var(--text-light);
      border-color: var(--border-color);
    }

    .stock-empty i {
      font-size: 8px;
    }

    /* ── Order Button ── */
    .btn-order-tco {
      background: var(--red-grad);
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.25s var(--ease);
      display: inline-flex;
      align-items: center;
      gap: 5px;
      position: relative;
      overflow: hidden;
      letter-spacing: 0.2px;
    }

    .btn-order-tco::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.4s ease;
    }

    .btn-order-tco:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-glow-red);
    }

    .btn-order-tco:hover::after {
      left: 100%;
    }

    .btn-order-tco:active {
      transform: translateY(0) scale(0.95);
    }

    /* ── Disabled / Sold Out Button ── */
    .btn-order-disabled {
      background: none;
      color: var(--text-light);
      border: 1.5px dashed var(--border-color);
      padding: 7px 12px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 700;
      cursor: not-allowed;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      letter-spacing: 0.2px;
      opacity: 0.7;
    }

    /* ══════════════════════════════════════════════════
       SECTION TITLES
    ══════════════════════════════════════════════════ */
    .tco-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 14px;
      margin-top: 36px;
    }

    .tco-section-title {
      font-size: 15px;
      font-weight: 800;
      color: var(--text-dark);
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tco-section-title .title-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--red-grad);
      display: inline-block;
      animation: dotBounce 2s ease-in-out infinite;
    }

    @keyframes dotBounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .tco-item-count {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted);
      background: rgba(215, 18, 58, 0.06);
      padding: 4px 10px;
      border-radius: var(--radius-full);
    }

    /* ══════════════════════════════════════════════════
       FADE IN ANIMATION
    ══════════════════════════════════════════════════ */
    .fade-in {
      animation: fadeIn 0.4s ease forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── Empty state ── */
    .empty-state {
      text-align: center;
      padding: 50px 20px;
      color: var(--text-muted);
    }

    .empty-state i {
      font-size: 44px;
      margin-bottom: 14px;
      color: var(--border-color);
    }

    .empty-state p {
      font-size: 13px;
      font-weight: 600;
      margin: 0;
    }

    /* ══════════════════════════════════════════════════
       IMAGE ZOOM MODAL
    ══════════════════════════════════════════════════ */
    .zoom-modal {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(7, 13, 34, 0.92);
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      backdrop-filter: blur(12px);
    }

    .zoom-modal.show {
      display: flex;
      opacity: 1;
    }

    .zoom-modal-content {
      position: relative;
      max-width: 95%;
      max-height: 90vh;
      transform: scale(0.9);
      transition: transform 0.35s var(--spring);
    }

    .zoom-modal.show .zoom-modal-content {
      transform: scale(1);
    }

    .zoom-modal img {
      max-width: 100%;
      max-height: 90vh;
      border-radius: var(--radius-md);
      object-fit: contain;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5);
    }

    .zoom-modal-close {
      position: absolute;
      top: -44px;
      right: 0;
      background: rgba(255, 255, 255, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      border-radius: 50%;
      width: 38px;
      height: 38px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      font-size: 16px;
      backdrop-filter: blur(8px);
      transition: all 0.25s var(--ease);
    }

    .zoom-modal-close:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.1) rotate(90deg);
    }

    /* ══════════════════════════════════════════════════
       SCROLLBAR STYLING
    ══════════════════════════════════════════════════ */
    .tco-wrapper ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    .tco-wrapper ::-webkit-scrollbar-track {
      background: transparent;
    }
    .tco-wrapper ::-webkit-scrollbar-thumb {
      background: rgba(13, 27, 62, 0.12);
      border-radius: 4px;
    }
  </style>
</head>

<body>

  <div class="mobile-app">
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>TCO Explorer</h2>
      <div style="width: 24px;"></div>
    </header>

    <div class="container tco-wrapper" style="margin-top: 0;">

      <!-- ═══ Hero Banner Premium ═══ -->
      <div class="tco-header">
        <div class="tco-header-content">
          <span class="badge-new"><i class="fa-solid fa-star"></i> OFFICIAL ACCESSORIES</span>
          <h1>TCO CATALOG 2025</h1>
          <p>Eksplorasi e-Katalog interaktif dan temukan aksesoris resmi yang dirancang khusus untuk mobil Toyota Anda.
          </p>
          <div class="hero-shimmer-line"></div>
        </div>
      </div>

      <!-- ═══ Pilih Model Mobil ═══ -->
      <div class="model-selector-wrapper">
        <h3 class="tco-section-title" style="margin-bottom: 12px;">
          <span class="title-dot"></span> Pilih Model Kendaraan
        </h3>
        <div class="scroll-pills-container" id="modelPills"></div>
      </div>

      <div id="dynamicContent" class="fade-in">

        <!-- ═══ PDF / Catalog Section ═══ -->
        <div class="pdf-card">
          <div class="pdf-header">
            <h3 class="pdf-title" id="pdfModelTitle"><i class="fa-solid fa-book-open"></i> Innova Zenix</h3>
            <a href="../assets/tco/innova-zenix.png" id="btnDownloadTco" download class="btn-download-sm"><i
                class="fa-solid fa-download"></i> Unduh</a>
          </div>
          <div style="width: 100%; background: #fff;" id="pdfContainer">
            <!-- Iframe di-inject via JS -->
          </div>
        </div>

        <!-- ═══ Filter Kategori & Daftar Aksesoris ═══ -->
        <div class="tco-section-header">
          <h3 class="tco-section-title">
            <span class="title-dot"></span> Daftar Aksesoris
          </h3>
          <span class="tco-item-count" id="itemCountBadge">0 item</span>
        </div>

        <div class="scroll-pills-container" id="categoryFilter"
          style="padding-bottom: 12px; margin-bottom: 16px; border-bottom: 1px solid var(--border-color);">
          <!-- Filter Kategori di-inject via JS -->
        </div>

        <div class="item-list fade-in" id="itemGrid">
          <!-- JS -->
        </div>

      </div>

      <!-- Sticky TCO Selection Summary Bar -->
      <div id="tcoFloatingCartBar" style="display:none; position:fixed; bottom:20px; left:50%; transform:translateX(-50%); width:92%; max-width:500px; background:linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 100%); color:#fff; border-radius:18px; padding:16px; box-shadow:0 12px 35px rgba(13, 27, 62, 0.45); z-index:9999; border:1px solid rgba(255,255,255,0.25); backdrop-filter:blur(12px);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div>
            <span style="font-size:10.5px; font-weight:800; text-transform:uppercase; color:#93c5fd; letter-spacing:0.5px;" id="tcoCartCount">0 Item Dipilih</span>
            <div style="font-size:20px; font-weight:900; color:#fff;" id="tcoCartTotal">Rp 0</div>
          </div>
          <span style="font-size:11.5px; font-weight:800; color:#bfdbfe; text-align:right; background:rgba(255,255,255,0.12); padding:4px 10px; border-radius:8px;" id="tcoCartCicilan">+Rp 0 / bln</span>
        </div>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <button type="button" onclick="shareTcoCartWA()" style="background:linear-gradient(135deg, #25D366 0%, #128C7E 100%); color:#fff; border:none; padding:12px; border-radius:12px; font-weight:800; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; box-shadow:0 4px 12px rgba(37,211,102,0.3); transition:transform 0.15s ease;">
            <i class="fa-brands fa-whatsapp" style="font-size:16px;"></i> Bagikan WA
          </button>
          <button type="button" onclick="orderTcoCartNow()" style="background:linear-gradient(135deg, #d7123a 0%, #b91c1c 100%); color:#fff; border:none; padding:12px; border-radius:12px; font-weight:800; font-size:12px; display:flex; align-items:center; justify-content:center; gap:6px; cursor:pointer; box-shadow:0 4px 12px rgba(215,18,58,0.3); transition:transform 0.15s ease;">
            <i class="fa-solid fa-cart-shopping" style="font-size:14px;"></i> Pesan Langsung
          </button>
        </div>
      </div>

      <!-- Navigation Placeholder -->
      <div style="height: 60px;"></div>
    </div>

    <!-- Zoom Modal -->
    <div class="zoom-modal" id="imageZoomModal" onclick="closeZoom(event)">
      <div class="zoom-modal-content" id="zoomModalContent">
        <button class="zoom-modal-close" onclick="closeZoom(event)"><i class="fa-solid fa-xmark"></i></button>
        <img src="" id="zoomImage" alt="Zoomed TCO Image">
      </div>
    </div>

    <!-- Stock Warning Modal -->
    <div id="tcoStockModal" class="modal-overlay" style="z-index: 20000; display:none;" onclick="closeTcoStockModal()">
      <div class="modal-content" style="max-width: 440px; padding: 22px; border-radius: 20px; text-align: left;" onclick="event.stopPropagation()">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px; color:#d97706;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size:24px;"></i>
          <h3 style="margin:0; font-size:16px; font-weight:800; color:var(--text-dark, #0f172a);">Pemberitahuan Stok Aksesoris</h3>
        </div>
        <p style="font-size:12.5px; color:#475569; line-height:1.5; margin-bottom:12px;">
          Beberapa aksesoris yang Anda pilih saat ini berstatus <strong>Stok Kosong / Pre-order</strong>:
        </p>
        <div id="tcoOutOfStockList" style="background:#fff7ed; border:1px solid #fed7aa; padding:10px 14px; border-radius:10px; font-size:12px; color:#9a3412; margin-bottom:14px;">
          <!-- List item kosong -->
        </div>
        <p style="font-size:12px; color:#334155; font-weight:600; margin-bottom:16px;">
          Apakah Anda ingin melanjutkan pemesanan untuk aksesoris yang <strong>Ready Stock</strong> saja, atau kembali memilih produk lain?
        </p>
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <button type="button" class="btn-outline" onclick="closeTcoStockModal()" style="padding:12px; font-size:12px; font-weight:700; border-radius:10px; cursor:pointer;">
            <i class="fa-solid fa-arrow-left"></i> Pilih Produk Lain
          </button>
          <button type="button" class="btn-main" onclick="proceedReadyTcoOrder()" style="padding:12px; font-size:12px; font-weight:800; background:linear-gradient(135deg, #d7123a 0%, #b91c1c 100%); border:none; border-radius:10px; color:#fff; cursor:pointer;">
            Lanjut Pesan Ready <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Script Panzoom & Custom Alert -->
    <script src="../custom_alert.js"></script>
    <script src="https://unpkg.com/panzoom@9.4.0/dist/panzoom.min.js"></script>
    <script src="../js/tco.js"></script>
</body>

</html>
