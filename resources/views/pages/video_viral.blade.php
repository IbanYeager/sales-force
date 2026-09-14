<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales App - Kircon Media Studio (Tunas Toyota Kiara Condong)</title>
  <meta name="description" content="Pusat Konten Digital, Video Showcase & Customer Stories Tunas Toyota Kiara Condong untuk Materi Promosi & Inspirasi Sales">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v=5.0">
  <script src="../js/sidebar_desktop.js?v=20260914_viral_v5"></script>
  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#090d16">

  <style>
    :root {
      --primary-red: #c8102e;
      --primary-red-hover: #b31217;
      --red-gradient: linear-gradient(135deg, #e52d27 0%, #b31217 100%);
      --gold-gradient: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      --silver-gradient: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
      --bronze-gradient: linear-gradient(135deg, #fdba74 0%, #ea580c 100%);
      --tiktok-color: #fe2c55;
      --ig-gradient: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
      --yt-red: #ff0000;
      --wa-green: #25D366;
      --wa-green-hover: #1da851;
      --dark-slate: #090d16;
    }

    body {
      background: #f8fafc;
      color: #0f172a;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
    }

    /* Top Breadcrumb & Quick Action Bar */
    .studio-top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 18px;
    }

    .studio-breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
      color: #64748b;
      font-weight: 600;
    }

    .studio-breadcrumb a {
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
    }

    .studio-breadcrumb a:hover {
      color: var(--primary-red);
    }

    .studio-breadcrumb .active-crumb {
      color: #0f172a;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .studio-live-pill {
      background: rgba(200, 16, 46, 0.1);
      color: var(--primary-red);
      border: 1px solid rgba(200, 16, 46, 0.25);
      padding: 3px 8px;
      border-radius: 20px;
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .studio-live-pill .dot-pulse {
      width: 6px;
      height: 6px;
      background: #ef4444;
      border-radius: 50%;
      box-shadow: 0 0 8px #ef4444;
      animation: pulseDot 1.5s infinite;
    }

    @keyframes pulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.75); }
    }

    .btn-add-media-header {
      background: var(--red-gradient);
      color: white;
      border: none;
      padding: 9px 18px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12.5px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 14px rgba(200, 16, 46, 0.35);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .btn-add-media-header:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(200, 16, 46, 0.45);
    }

    /* Executive Hero Banner */
    .viral-hero-banner {
      background: linear-gradient(135deg, #090d16 0%, #151d2f 50%, #290812 100%);
      border-radius: 22px;
      padding: 26px 30px;
      color: white;
      margin-bottom: 24px;
      position: relative;
      overflow: hidden;
      box-shadow: 0 16px 36px rgba(15, 23, 42, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .viral-hero-banner::before {
      content: '';
      position: absolute;
      top: -80px;
      right: -40px;
      width: 260px;
      height: 260px;
      background: radial-gradient(circle, rgba(200, 16, 46, 0.35) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .viral-hero-banner::after {
      content: '';
      position: absolute;
      bottom: -60px;
      left: 15%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
    }

    .viral-badge-header {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(254, 44, 85, 0.16);
      border: 1px solid rgba(254, 44, 85, 0.45);
      color: #ff859d;
      padding: 5px 14px;
      border-radius: 30px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 12px;
    }

    .hero-title {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin: 0 0 8px 0;
      line-height: 1.25;
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;
    }

    .hero-desc {
      font-size: 13.5px;
      color: #cbd5e1;
      margin: 0;
      line-height: 1.6;
      max-width: 860px;
    }

    /* Hero Stats Deck (Clean, No Views / Likes) */
    .viral-stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 12px;
      margin-top: 22px;
    }

    .stat-box {
      background: rgba(255, 255, 255, 0.06);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 14px 16px;
      transition: transform 0.2s, background 0.2s;
    }

    .stat-box:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    .stat-box .num {
      font-size: 19px;
      font-weight: 900;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .stat-box .lbl {
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      margin-top: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Toolbar: Search, Sort & Categories */
    .viral-toolbar {
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 22px;
    }

    .toolbar-top-row {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      min-width: 260px;
    }

    .search-input-wrapper i {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
      font-size: 14px;
    }

    .search-input-wrapper input {
      width: 100%;
      box-sizing: border-box;
      padding: 13px 16px 13px 44px;
      border-radius: 14px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      font-size: 13.5px;
      color: #0f172a;
      outline: none;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }

    .search-input-wrapper input:focus {
      border-color: var(--primary-red);
      box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.12);
    }

    .sort-select-wrapper {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sort-select {
      padding: 12px 16px;
      border-radius: 14px;
      border: 1px solid #cbd5e1;
      background: white;
      font-size: 13px;
      font-weight: 700;
      color: #0f172a;
      outline: none;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      transition: border-color 0.2s;
    }

    .sort-select:focus {
      border-color: var(--primary-red);
    }

    /* Category Filter Pills */
    .category-pills-wrap {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: thin;
    }

    .category-pills-wrap::-webkit-scrollbar {
      height: 4px;
    }

    .category-pill {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 9px 18px;
      border-radius: 30px;
      font-size: 12.5px;
      font-weight: 700;
      cursor: pointer;
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
    }

    .category-pill:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
      color: #0f172a;
    }

    .category-pill.active {
      background: var(--red-gradient);
      color: #ffffff;
      border-color: transparent;
      box-shadow: 0 4px 14px rgba(200, 16, 46, 0.3);
    }

    .category-pill .pill-count {
      background: rgba(0, 0, 0, 0.08);
      padding: 2px 7px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 800;
    }

    .category-pill.active .pill-count {
      background: rgba(255, 255, 255, 0.25);
      color: white;
    }

    /* Video Grid System */
    .video-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px;
    }

    /* Automotive Video Card */
    .video-card {
      background: #ffffff;
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.05);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s, border-color 0.3s;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .video-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 18px 36px rgba(15, 23, 42, 0.1), 0 6px 14px rgba(200, 16, 46, 0.06);
      border-color: rgba(200, 16, 46, 0.3);
    }

    .video-card.card-playing {
      border-color: var(--primary-red);
      box-shadow: 0 20px 40px rgba(200, 16, 46, 0.2);
    }

    /* =========================================================
       INLINE SHOWROOM STAGE & DIRECT IN-PLACE VIDEO PLAYER
       ========================================================= */
    .video-thumb-container {
      position: relative;
      width: 100%;
      height: 200px;
      background: #090d16;
      overflow: hidden;
      cursor: pointer;
      transition: height 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* When playing directly inside the card: expand height smoothly! */
    .video-thumb-container.is-playing {
      height: 380px;
      background: #000000;
      cursor: default;
    }

    .inline-player-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: inlinePlayerFadeIn 0.3s ease;
    }

    @keyframes inlinePlayerFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .inline-player-wrapper iframe {
      width: 100%;
      height: 100%;
      border: none;
      display: block;
    }

    /* In-place close video floating button */
    .btn-close-inline {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 30;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      padding: 5px 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 4px 14px rgba(0,0,0,0.6);
    }

    .btn-close-inline:hover {
      background: #ef4444;
      border-color: #ef4444;
      transform: scale(1.05);
    }

    /* Stage Interior Backgrounds (Bespoke per Vehicle) */
    .stage-bg {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle at 50% 30%, #1e293b 0%, #090d16 80%);
      transition: background 0.3s;
    }

    .stage-bg.stage-zenix {
      background: radial-gradient(circle at 50% 25%, #2a1b24 0%, #151928 50%, #07090f 100%);
    }
    .stage-bg.stage-alphard {
      background: radial-gradient(circle at 50% 20%, #342817 0%, #121829 55%, #05070d 100%);
    }
    .stage-bg.stage-calya {
      background: radial-gradient(circle at 50% 25%, #2c221a 0%, #171b26 50%, #090c13 100%);
    }
    .stage-bg.stage-veloz {
      background: radial-gradient(circle at 50% 25%, #18283f 0%, #0f172a 55%, #060911 100%);
    }
    .stage-bg.stage-fortuner {
      background: radial-gradient(circle at 50% 25%, #291216 0%, #12141c 55%, #06070a 100%);
    }
    .stage-bg.stage-yaris {
      background: radial-gradient(circle at 50% 25%, #102a28 0%, #0e1724 55%, #05090f 100%);
    }
    .stage-bg.stage-avanza {
      background: radial-gradient(circle at 50% 25%, #241d2d 0%, #131725 55%, #080a11 100%);
    }
    .stage-bg.stage-rangga {
      background: radial-gradient(circle at 50% 25%, #26272b 0%, #141720 55%, #08090d 100%);
    }
    .stage-bg.stage-agya {
      background: radial-gradient(circle at 50% 25%, #311c1c 0%, #171722 55%, #09090e 100%);
    }

    /* Ambient Spotlight & Grid Floor */
    .stage-spotlight {
      position: absolute;
      top: -30px;
      left: 50%;
      transform: translateX(-50%);
      width: 220px;
      height: 120px;
      background: radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, transparent 70%);
      pointer-events: none;
    }

    .stage-model-watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 34px;
      font-weight: 900;
      color: rgba(255, 255, 255, 0.04);
      text-transform: uppercase;
      letter-spacing: 4px;
      white-space: nowrap;
      pointer-events: none;
      user-select: none;
    }

    /* High-Resolution Toyota Car Render */
    .stage-car-img {
      position: relative;
      height: 115px;
      max-width: 86%;
      object-fit: contain;
      filter: drop-shadow(0 14px 14px rgba(0, 0, 0, 0.65));
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), filter 0.45s;
      z-index: 2;
    }

    .video-card:hover .stage-car-img {
      transform: scale(1.08) translateY(-4px);
      filter: drop-shadow(0 20px 22px rgba(0, 0, 0, 0.85));
    }

    /* Ground Shadow */
    .stage-car-shadow {
      position: absolute;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      width: 65%;
      height: 14px;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, transparent 80%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
    }

    /* Thumbnail Overlay */
    .video-thumb-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(9, 13, 22, 0.4) 0%, transparent 35%, rgba(9, 13, 22, 0.85) 100%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 12px 14px;
      z-index: 3;
    }

    .thumb-top-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }

    /* Platform Badge */
    .platform-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10.5px;
      font-weight: 800;
      color: white;
      backdrop-filter: blur(8px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }

    .platform-badge.tiktok {
      background: rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(254, 44, 85, 0.6);
      color: #ffffff;
    }
    .platform-badge.tiktok i {
      color: #fe2c55;
    }

    .platform-badge.instagram {
      background: var(--ig-gradient);
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .platform-badge.youtube {
      background: #ff0000;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }

    /* Verified Author Badge */
    .author-badge {
      font-size: 11px;
      font-weight: 700;
      color: #f1f5f9;
      background: rgba(9, 13, 22, 0.7);
      backdrop-filter: blur(6px);
      padding: 3px 8px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Rank Badges (Curated Recommendations) */
    .rank-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 4px 10px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.5px;
      z-index: 5;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .rank-badge.rank-1 {
      background: var(--gold-gradient);
      color: #451a03;
      border: 1px solid #fde68a;
    }
    .rank-badge.rank-2 {
      background: var(--silver-gradient);
      color: #0f172a;
      border: 1px solid #f8fafc;
    }
    .rank-badge.rank-3 {
      background: var(--bronze-gradient);
      color: #431407;
      border: 1px solid #fed7aa;
    }

    /* Frosted Glassmorphic Play Button */
    .play-button-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1.5px solid rgba(255, 255, 255, 0.65);
      color: #ff334b;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      padding-left: 3px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 4;
    }

    .video-card:hover .play-button-center {
      transform: translate(-50%, -50%) scale(1.18);
      background: var(--red-gradient);
      color: #ffffff;
      border-color: #ff6b81;
      box-shadow: 0 0 35px rgba(200, 16, 46, 0.75);
    }

    /* Thumbnail Bottom Bar (Clean Vehicle Tag, No Views/Likes) */
    .thumb-bottom-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      gap: 6px;
    }

    .model-tag-pill {
      font-size: 10.5px;
      font-weight: 800;
      color: #93c5fd;
      background: rgba(30, 58, 138, 0.65);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 8px;
      border: 1px solid rgba(147, 197, 253, 0.3);
      white-space: nowrap;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    /* Card Details */
    .video-details {
      padding: 16px 18px;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: space-between;
      background: #ffffff;
    }

    .video-category-tag {
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .video-category-tag.cat-delivery { color: #c8102e; }
    .video-category-tag.cat-feature { color: #2563eb; }
    .video-category-tag.cat-tips { color: #059669; }
    .video-category-tag.cat-parodi { color: #d97706; }
    .video-category-tag.cat-promo { color: #7c3aed; }

    .video-title {
      font-size: 14.5px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.4;
      margin: 0 0 6px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .video-desc {
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    /* Sales Pitch Highlight Pill */
    .sales-pitch-box {
      background: #f8fafc;
      border-left: 3px solid #cbd5e1;
      border-radius: 6px;
      padding: 6px 10px;
      margin-bottom: 14px;
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 11px;
      color: #475569;
      line-height: 1.4;
    }

    .sales-pitch-box i {
      color: #f59e0b;
      margin-top: 2px;
      font-size: 11px;
    }

    /* Action Buttons for Sales */
    .video-actions {
      display: flex;
      gap: 8px;
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid #f1f5f9;
    }

    .btn-watch {
      flex: 1.2;
      background: #0f172a;
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-watch:hover {
      background: #1e293b;
      transform: translateY(-1px);
    }

    .btn-wa-share {
      flex: 1.4;
      background: var(--wa-green);
      color: white;
      border: none;
      border-radius: 10px;
      padding: 10px 10px;
      font-size: 12px;
      font-weight: 800;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: all 0.2s;
      text-decoration: none;
      box-shadow: 0 3px 8px rgba(37, 211, 102, 0.25);
    }

    .btn-wa-share:hover {
      background: var(--wa-green-hover);
      transform: translateY(-1px);
      box-shadow: 0 5px 12px rgba(37, 211, 102, 0.35);
    }

    .btn-copy {
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      width: 38px;
      height: 38px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 13px;
      transition: all 0.2s;
      flex-shrink: 0;
    }

    .btn-copy:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    /* Modal Form for Add Video */
    .video-modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(9, 13, 22, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999;
      padding: 20px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .video-modal-overlay.active {
      opacity: 1;
      pointer-events: auto;
    }

    .video-modal-box {
      background: #ffffff;
      color: #0f172a;
      border-radius: 20px;
      width: 100%;
      max-width: 480px;
      padding: 24px;
      border: 1px solid #cbd5e1;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .modal-form-input {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 14px;
      border-radius: 12px;
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      color: #0f172a;
      font-size: 13px;
      margin-bottom: 12px;
      outline: none;
      transition: border-color 0.2s;
    }

    .modal-form-input:focus {
      border-color: var(--primary-red);
      background: #ffffff;
    }

    @media (max-width: 767px) {
      .video-thumb-container.is-playing {
        height: 320px;
      }
    }
  </style>
</head>

<body>
  <div class="mobile-app">
    <!-- Header Page (Upgraded by sidebar_desktop.js) -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Kircon Media Studio</h2>
      <button onclick="openAddVideoModal()" style="margin-left: auto; background: var(--red-gradient); color: white; border: none; padding: 7px 16px; border-radius: 12px; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba(200,16,46,0.3);">
        <i class="fa-solid fa-plus"></i> Tambah Media Sales
      </button>
    </header>

    <div class="content-body" style="padding: 18px 20px;">

      <!-- TOP BREADCRUMB & CONTROLS -->
      <div class="studio-top-bar">
        <div class="studio-breadcrumb">
          <a href="../index.html"><i class="fa-solid fa-house"></i> Beranda</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 10px; color: #94a3b8;"></i>
          <span class="active-crumb">
            Kircon Media Studio
            <span class="studio-live-pill"><span class="dot-pulse"></span> LIVE SHOWROOM</span>
          </span>
        </div>

        <button onclick="openAddVideoModal()" class="btn-add-media-header">
          <i class="fa-solid fa-circle-plus"></i> Tambah Konten Video Sales
        </button>
      </div>

      <!-- HERO BANNER -->
      <div class="viral-hero-banner">
        <div class="viral-badge-header">
          <i class="fa-solid fa-film"></i> Official Showroom Media &amp; Showcase Center
        </div>
        <h1 class="hero-title">
          Kircon Media Studio &amp; Showcase
        </h1>
        <p class="hero-desc">
          Hub media resmi <strong>Tunas Toyota Kiara Condong</strong>. Putar video langsung di setiap kartu tanpa pop-up: momen serah terima unit, bedah fitur canggih kendaraan, serta materi promosi siap bagikan ke WhatsApp calon konsumen.
        </p>

        <!-- Stats Grid (Clean, No Views / Likes) -->
        <div class="viral-stats-grid">
          <div class="stat-box">
            <div class="num" id="statTotalVideos" style="color: #ffffff;"><i class="fa-solid fa-clapperboard" style="color: #ff334b;"></i> 12 Video</div>
            <div class="lbl">Koleksi Media Resmi</div>
          </div>
          <div class="stat-box">
            <div class="num" style="color: #38bdf8;"><i class="fa-solid fa-car"></i> 10+ Model</div>
            <div class="lbl">Katalog Unit Toyota</div>
          </div>
          <div class="stat-box">
            <div class="num" style="color: #d8a437;"><i class="fa-solid fa-circle-check"></i> Terverifikasi</div>
            <div class="lbl">Cabang Kiara Condong</div>
          </div>
          <div class="stat-box">
            <div class="num" style="color: #34d399;"><i class="fa-brands fa-whatsapp"></i> 1-Klik Share</div>
            <div class="lbl">Materi Closing Konsumen</div>
          </div>
        </div>
      </div>

      <!-- SEARCH & FILTER TOOLBAR -->
      <div class="viral-toolbar">
        <div class="toolbar-top-row">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="viralSearchInput" placeholder="Cari konten media (contoh: Zenix, Delivery, Alphard, Veloz, Tips, TSS)..." oninput="filterVideos()">
          </div>

          <div class="sort-select-wrapper">
            <label style="font-size: 12px; font-weight: 700; color: #64748b; white-space: nowrap;">
              <i class="fa-solid fa-arrow-down-wide-short"></i> Urutkan:
            </label>
            <select id="viralSortSelect" class="sort-select" onchange="filterVideos()">
              <option value="featured">⭐ Rekomendasi Utama</option>
              <option value="latest">🕒 Terbaru Ditambahkan</option>
              <option value="model">🚗 Model Mobil (A - Z)</option>
            </select>
          </div>
        </div>

        <!-- Category Filter Pills -->
        <div class="category-pills-wrap" id="categoryPillsContainer">
          <button class="category-pill active" onclick="selectCategory('all', this)">
            <i class="fa-solid fa-layer-group"></i> Semua Konten <span class="pill-count" id="count-all">12</span>
          </button>
          <button class="category-pill" onclick="selectCategory('delivery', this)">
            <i class="fa-solid fa-champagne-glasses"></i> Serah Terima Unit <span class="pill-count" id="count-delivery">3</span>
          </button>
          <button class="category-pill" onclick="selectCategory('feature', this)">
            <i class="fa-solid fa-car-side"></i> Review &amp; Rahasia Fitur <span class="pill-count" id="count-feature">4</span>
          </button>
          <button class="category-pill" onclick="selectCategory('tips', this)">
            <i class="fa-solid fa-lightbulb"></i> Tips &amp; Edukasi <span class="pill-count" id="count-tips">2</span>
          </button>
          <button class="category-pill" onclick="selectCategory('parodi', this)">
            <i class="fa-solid fa-users"></i> Aktivitas &amp; Tren Sales <span class="pill-count" id="count-parodi">2</span>
          </button>
          <button class="category-pill" onclick="selectCategory('promo', this)">
            <i class="fa-solid fa-tags"></i> Promo &amp; Event <span class="pill-count" id="count-promo">1</span>
          </button>
        </div>
      </div>

      <!-- VIDEO GRID CONTAINER -->
      <div class="video-grid" id="viralVideoGrid">
        <!-- Injected via JavaScript -->
      </div>

      <!-- EMPTY STATE -->
      <div id="viralEmptyState" style="display: none; text-align: center; padding: 48px 24px; background: white; border-radius: 20px; border: 1px dashed #cbd5e1; margin-top: 10px;">
        <i class="fa-solid fa-film" style="font-size: 42px; color: #cbd5e1; margin-bottom: 14px;"></i>
        <h3 style="font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 6px 0;">Konten Tidak Ditemukan</h3>
        <p style="font-size: 13px; color: #64748b; margin: 0;">Coba gunakan kata kunci pencarian lain atau pilih tab Semua Konten.</p>
      </div>

    </div>
  </div>

  <!-- MODAL: TAMBAH VIDEO MEDIA BARU -->
  <div class="video-modal-overlay" id="addVideoModal">
    <div class="video-modal-box">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 800; margin: 0; color: #0f172a; display: flex; align-items: center; gap: 8px;">
          <i class="fa-solid fa-photo-film" style="color: var(--primary-red);"></i> Tambah Konten Video Sales
        </h3>
        <button onclick="closeAddVideoModal()" style="background: none; border: none; font-size: 18px; color: #64748b; cursor: pointer;">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Link URL Video (YouTube Shorts / TikTok / IG Reels):</label>
          <input type="url" id="newVideoUrl" class="modal-form-input" placeholder="Paste link video (contoh: https://www.youtube.com/shorts/...)" oninput="checkVideoUrlInput(this.value)">
          <div id="videoDetectBadge" style="display:none; font-size: 11.5px; font-weight: 700; color: #16a34a; margin-top: -6px; margin-bottom: 8px;">
            <i class="fa-solid fa-circle-check"></i> <span id="videoDetectText">ID Video Terdeteksi</span>
          </div>
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Model Mobil Toyota Terkait:</label>
          <select id="newVideoModelSelect" class="modal-form-input">
            <option value="zenix.webp|Innova Zenix HEV|stage-zenix">Innova Zenix Hybrid (HEV)</option>
            <option value="alphard.webp|New Alphard VIP|stage-alphard">New Alphard Hybrid VIP</option>
            <option value="calya.webp|New Calya 1.2 G|stage-calya">New Calya 1.2</option>
            <option value="veloz.webp|All New Veloz TSS|stage-veloz">All New Veloz TSS</option>
            <option value="fortuner.webp|Fortuner 2.8 GR Sport|stage-fortuner">New Fortuner 2.8 GR Sport</option>
            <option value="yaris-cross.webp|Yaris Cross HEV|stage-yaris">Yaris Cross Hybrid (HEV)</option>
            <option value="avanza.webp|All New Avanza|stage-avanza">All New Avanza 1.5 G</option>
            <option value="rangga.webp|Hilux Rangga Utility|stage-rangga">Hilux Rangga Commercial</option>
            <option value="agya.webp|New Agya GR Sport|stage-agya">New Agya GR Sport</option>
            <option value="rush.webp|New Rush GR Sport|stage-fortuner">New Rush GR Sport</option>
            <option value="raize.webp|Raize Turbo GR Sport|stage-veloz">New Raize Turbo GR Sport</option>
            <option value="voxy.webp|All New Voxy VIP|stage-alphard">All New Voxy VIP</option>
          </select>
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Judul Konten Video:</label>
          <input type="text" id="newVideoTitle" class="modal-form-input" placeholder="Contoh: Serah Terima Zenix Q Hybrid Kado Ultah Istri">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Platform:</label>
            <select id="newVideoPlatform" class="modal-form-input">
              <option value="youtube">YouTube Shorts</option>
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram Reels</option>
            </select>
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Kategori:</label>
            <select id="newVideoCategory" class="modal-form-input">
              <option value="delivery">Serah Terima Unit</option>
              <option value="feature">Review &amp; Rahasia Fitur</option>
              <option value="tips">Tips &amp; Edukasi</option>
              <option value="parodi">Aktivitas &amp; Tren Sales</option>
              <option value="promo">Promo &amp; Event</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #475569; display: block; margin-bottom: 4px;">Rekomendasi Pesan Promosi WhatsApp Konsumen:</label>
          <textarea id="newVideoDesc" class="modal-form-input" rows="3" style="resize: vertical;" placeholder="Tuliskan catatan kenapa video ini cocok dibagikan ke calon konsumen..."></textarea>
        </div>

        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <button onclick="saveNewVideo()" style="flex: 1; background: var(--red-gradient); color: white; border: none; padding: 12px; border-radius: 12px; font-weight: 800; font-size: 13px; cursor: pointer; box-shadow: 0 4px 12px rgba(200,16,46,0.3);">
            <i class="fa-solid fa-save"></i> Simpan &amp; Tampilkan di Web
          </button>
          <button onclick="resetVideosToDefault()" style="background: #f1f5f9; color: #64748b; border: 1px solid #cbd5e1; padding: 12px; border-radius: 12px; font-weight: 700; font-size: 12px; cursor: pointer;">
            Reset Default
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- SCRIPT DATA & INLINE DIRECT PLAYBACK LOGIC -->
  <script>
    // Authentic Verified Tunas Toyota Kiara Condong Video Showcase with 100% Direct In-Place Playback
    const DEFAULT_VIRAL_VIDEOS = [
      {
        id: 'v1',
        title: 'Tour Showroom & Fasilitas Dealer Tunas Toyota Kiara Condong Bandung (Jl. Ibrahim Adjie No. 47) 🏢🚗',
        category: 'delivery',
        categoryName: 'Serah Terima Unit',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Momen serah terima unit dan kemegahan fasilitas showroom dealer Tunas Toyota Kiara Condong. Customer lounge ber-AC dingin, area serah terima karpet merah VIP, dan pelayanan ramah konsultan resmi.',
        modelName: 'Innova Zenix HEV',
        carImg: '../assets/img/mobil/zenix.webp',
        stageTheme: 'stage-zenix',
        salesPitch: 'Paling ampuh untuk menunjukkan kredibilitas dealer resmi, fasilitas bengkel modern, dan kenyamanan bertransaksi di Kiara Condong.',
        videoUrl: 'https://www.youtube.com/shorts/gdwtyyYBjZ8'
      },
      {
        id: 'v2',
        title: 'Spill Promo Flash Weekend Sale Tunas Toyota Kiara Condong: DP Ringan & Free Service T-Care! 🏷️🎉',
        category: 'promo',
        categoryName: 'Promo & Event',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Rangkuman kemeriahan event showroom weekend sales di Tunas Kiara Condong. Banyak promo menarik: DP super ringan Calya & Avanza, bunga 0% Zenix, lucky dip voucher belanja, dan merchandise spesial.',
        modelName: 'New Calya 1.2 G',
        carImg: '../assets/img/mobil/calya.webp',
        stageTheme: 'stage-calya',
        salesPitch: 'Gunakan untuk memicu urgensi calon konsumen yang masih menunda SPK agar segera mengambil promo sebelum akhir bulan.',
        videoUrl: 'https://www.youtube.com/shorts/6IFuy3mhmcY'
      },
      {
        id: 'v3',
        title: 'Nyesel Baru Tahu Mobil Sekeren Ini! Review Detail Interior Mewah Toyota New Alphard VIP ✨🥂',
        category: 'delivery',
        categoryName: 'Serah Terima Unit',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Spill kabin first-class New Alphard Hybrid warna Platinum White Pearl. Dilengkapi kursi Captain Seat elektrik dengan Ottoman, ambient lighting 14 warna, serta meja lipat multifungsi.',
        modelName: 'New Alphard VIP',
        carImg: '../assets/img/mobil/alphard.webp',
        stageTheme: 'stage-alphard',
        salesPitch: 'Materi eksklusif wajib untuk membidik calon konsumen eksekutif, pejabat daerah, dan pengusaha VIP Bandung.',
        videoUrl: 'https://www.youtube.com/shorts/E31vHNKYswo'
      },
      {
        id: 'v4',
        title: 'Stok Unit Ready Lengkap di Kircon! Percayakan Pembelian Mobil Toyota Impian ke Sales Resmi 🚗✨',
        category: 'delivery',
        categoryName: 'Serah Terima Unit',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Katalog stok ready unit di pool cabang Tunas Toyota Kiara Condong: dari Veloz, Avanza, Raize, hingga Zenix Hybrid siap kirim cepat tanpa inden berlama-lama.',
        modelName: 'All New Veloz TSS',
        carImg: '../assets/img/mobil/veloz.webp',
        stageTheme: 'stage-veloz',
        salesPitch: 'Sangat tepat dikirimkan kepada konsumen yang butuh unit cepat untuk keperluan dinas atau mudik keluarga.',
        videoUrl: 'https://www.youtube.com/shorts/z_A3Pobu77U'
      },
      {
        id: 'v5',
        title: 'Keseruan Serah Terima Unit & Sambutan Hangat Tim Sales Tunas Toyota Kiara Condong! 🤝🎊',
        category: 'parodi',
        categoryName: 'Aktivitas & Tren Sales',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Keseruan tim sales consultant Kircon merayakan momen penyerahan unit baru kepada konsumen dengan penuh senyuman, foto bersama, dan pemberian souvenir eksklusif Toyota.',
        modelName: 'New Agya GR Sport',
        carImg: '../assets/img/mobil/agya.webp',
        stageTheme: 'stage-agya',
        salesPitch: 'Membangun citra dealer yang ramah, santun, dan memperlakukan setiap konsumen seperti keluarga sendiri.',
        videoUrl: 'https://www.youtube.com/shorts/cs9_-2Gkj7E'
      },
      {
        id: 'v6',
        title: 'Bedah Fitur Canggih Toyota Raize Turbo: Suspensi Nyaman & Fitur Keselamatan TSS Terlengkap! ⚡🛡️',
        category: 'feature',
        categoryName: 'Review & Rahasia Fitur',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Ulasan performa mesin 1.000cc Turbocharged Toyota Raize yang bertenaga namun irit bensin, dipadukan transmisi D-CVT halus serta 6 airbags dan fitur blind spot monitor.',
        modelName: 'Raize Turbo GR',
        carImg: '../assets/img/mobil/raize.webp',
        stageTheme: 'stage-veloz',
        salesPitch: 'Senjata closing untuk konsumen milenial dan keluarga muda yang mencari compact SUV lincah di kemacetan Bandung.',
        videoUrl: 'https://www.youtube.com/shorts/3wHUfv4JS3k'
      },
      {
        id: 'v7',
        title: 'Pengalaman Test Drive Rute Tanjakan & Jalan Kota Bandung Bersama Sales Tunas Kircon ⛰️🚗',
        category: 'feature',
        categoryName: 'Review & Rahasia Fitur',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Simulasi test drive rute Kiara Condong menuju tanjakan Dago & Punclut. Membuktikan ketangguhan torsi mesin dan kestabilan sasis Toyota generasi terbaru.',
        modelName: 'Fortuner GR Sport',
        carImg: '../assets/img/mobil/fortuner.webp',
        stageTheme: 'stage-fortuner',
        salesPitch: 'Mendorong calon konsumen untuk booking jadwal test drive gratis langsung ke rumah atau showroom.',
        videoUrl: 'https://www.youtube.com/shorts/lEIRbGDG-H4'
      },
      {
        id: 'v8',
        title: 'Momen Haru Serah Terima Calya & Avanza Baru: Bukti Pelayanan Sepenuh Hati Dealer Kircon 🥹🙏',
        category: 'delivery',
        categoryName: 'Serah Terima Unit',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Kisah nyata kebahagiaan customer saat mobil impian diantar langsung ke garasi rumah dengan plat nomor rapi dan tangki bahan bakar siap jalan.',
        modelName: 'All New Avanza',
        carImg: '../assets/img/mobil/avanza.webp',
        stageTheme: 'stage-avanza',
        salesPitch: 'Bukti transparansi dan ketepatan janji waktu delivery unit oleh Sales Consultant Kiara Condong.',
        videoUrl: 'https://www.youtube.com/shorts/8lCSW9ArMUs'
      },
      {
        id: 'v9',
        title: 'Tips Cerdas Konsultasi Simulasi Kredit DP Ringan & Bunga Spesial di Tunas Kiara Condong 💡📱',
        category: 'tips',
        categoryName: 'Tips & Edukasi',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Panduan cara menghitung kemampuan angsuran bulanan yang aman, tips lolos approval leasing 1 hari kerja, serta memilih tenor terbaik sesuai anggaran keluarga.',
        modelName: 'Yaris Cross HEV',
        carImg: '../assets/img/mobil/yaris-cross.webp',
        stageTheme: 'stage-yaris',
        salesPitch: 'Menghilangkan keraguan konsumen soal berkas leasing dan membuka obrolan konsultasi hitungan kredit.',
        videoUrl: 'https://www.youtube.com/shorts/xU_mxKr3z1c'
      },
      {
        id: 'v10',
        title: 'Kenapa Harus Beli Toyota di Cabang Kiara Condong? Jaminan Ready Stock & Layanan Terbaik! 🏆🛠️',
        category: 'tips',
        categoryName: 'Tips & Edukasi',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Keunggulan bengkel resmi Tunas Toyota Kiara Condong: teknisi bersertifikasi internasional, garansi mesin & suku cadang asli Toyota Genuine Parts, serta layanan darurat 24 jam.',
        modelName: 'Hilux Rangga',
        carImg: '../assets/img/mobil/rangga.webp',
        stageTheme: 'stage-rangga',
        salesPitch: 'Paling tepat digunakan untuk mengalahkan penawaran dealer rival atau sales liar tanpa cabang resmi.',
        videoUrl: 'https://www.youtube.com/shorts/ye6dRaAydKA'
      },
      {
        id: 'v11',
        title: 'Spill Detail Fitur Kursi Ottoman Elektrik & Suasana Sultan di Dalam All New Voxy VIP 🥂🛋️',
        category: 'feature',
        categoryName: 'Review & Rahasia Fitur',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Eksplorasi pintu geser otomatis dengan kick sensor, panoramic sun-roof ganda, dan kabin lapang Toyota New Voxy yang sering disebut Mini Alphard.',
        modelName: 'All New Voxy VIP',
        carImg: '../assets/img/mobil/voxy.webp',
        stageTheme: 'stage-alphard',
        salesPitch: 'Pilihan favorit untuk keluarga mapan yang mendambakan kenyamanan Alphard dengan dimensi yang lebih lincah.',
        videoUrl: 'https://www.youtube.com/shorts/INfN0KSTBMQ'
      },
      {
        id: 'v12',
        title: 'Tips Perawatan Rutin Baterai Hybrid Toyota Biar Awet Belasan Tahun & Bebas Khawatir! 🔋✅',
        category: 'tips',
        categoryName: 'Tips & Edukasi',
        platform: 'youtube',
        author: '@tunastoyotakircon',
        desc: 'Edukasi cara kerja sistem regenerative braking dan tips menjaga kebersihan saringan pendingin baterai lithium-ion garansi resmi 8 tahun Tunas Toyota.',
        modelName: 'Innova Zenix HEV',
        carImg: '../assets/img/mobil/zenix.webp',
        stageTheme: 'stage-zenix',
        salesPitch: 'Materi pamungkas untuk menepis kekhawatiran konsumen awam soal biaya penggantian baterai mobil hybrid.',
        videoUrl: 'https://www.youtube.com/shorts/A0TwFAnd8Sg'
      }
    ];

    let currentCategory = 'all';
    let currentVideos = [];
    let currentlyPlayingId = null;

    // Extract TikTok Video ID
    function extractTikTokVideoId(url) {
      if (!url) return null;
      const match = url.match(/\/video\/(\d+)/i);
      if (match && match[1]) return match[1];
      const matchDirect = url.match(/(\d{15,22})/);
      if (matchDirect && matchDirect[1]) return matchDirect[1];
      return null;
    }

    // Extract Instagram Reel Code
    function extractInstagramReelCode(url) {
      if (!url) return null;
      const match = url.match(/\/reel\/([a-zA-Z0-9_-]+)/i);
      if (match && match[1]) return match[1];
      return null;
    }

    // Extract YouTube Shorts / Video ID
    function extractYouTubeId(url) {
      if (!url) return null;
      const matchShorts = url.match(/\/shorts\/([a-zA-Z0-9_-]+)/i);
      if (matchShorts && matchShorts[1]) return matchShorts[1];
      const matchWatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/i);
      if (matchWatch && matchWatch[1]) return matchWatch[1];
      const matchYoutu = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/i);
      if (matchYoutu && matchYoutu[1]) return matchYoutu[1];
      return null;
    }

    // Live URL Detection in Add Video Modal
    function checkVideoUrlInput(url) {
      const badge = document.getElementById('videoDetectBadge');
      const badgeText = document.getElementById('videoDetectText');
      const platformSelect = document.getElementById('newVideoPlatform');

      if (!url || !url.trim()) {
        if (badge) badge.style.display = 'none';
        return;
      }

      const ytId = extractYouTubeId(url);
      const tiktokId = extractTikTokVideoId(url);
      const igCode = extractInstagramReelCode(url);

      if (ytId) {
        if (platformSelect) platformSelect.value = 'youtube';
        if (badge) {
          badge.style.display = 'block';
          badge.style.color = '#dc2626';
          badgeText.textContent = `✅ ID YouTube Terdeteksi (${ytId}) - Siap di-play langsung tanpa hambatan!`;
        }
      } else if (tiktokId) {
        if (platformSelect) platformSelect.value = 'tiktok';
        if (badge) {
          badge.style.display = 'block';
          badge.style.color = '#16a34a';
          badgeText.textContent = `✅ ID TikTok Terdeteksi (${tiktokId}) - Siap di-play langsung!`;
        }
      } else if (igCode) {
        if (platformSelect) platformSelect.value = 'instagram';
        if (badge) {
          badge.style.display = 'block';
          badge.style.color = '#e1306c';
          badgeText.textContent = `✅ ID Instagram Reels Terdeteksi (${igCode}) - Siap di-play langsung!`;
        }
      } else {
        if (badge) {
          badge.style.display = 'block';
          badge.style.color = '#ca8a04';
          badgeText.textContent = `ℹ️ Tautan tersimpan (akan diarahkan ke aplikasi profil)`;
        }
      }
    }

    function initViralVideos() {
      // Use v7: Direct in-place video playback without pop-up modal
      const stored = localStorage.getItem('sft_viral_videos_v7');
      if (stored) {
        try {
          currentVideos = JSON.parse(stored);
        } catch(e) {
          currentVideos = DEFAULT_VIRAL_VIDEOS;
        }
      } else {
        currentVideos = DEFAULT_VIRAL_VIDEOS;
        localStorage.setItem('sft_viral_videos_v7', JSON.stringify(currentVideos));
      }
      renderVideos();
      updateStats();
    }

    function updateStats() {
      const totalCount = currentVideos.length;
      const el = document.getElementById('statTotalVideos');
      if (el) el.innerHTML = `<i class="fa-solid fa-clapperboard" style="color: #ff334b;"></i> ${totalCount} Video`;

      const categories = ['all', 'delivery', 'feature', 'tips', 'parodi', 'promo'];
      categories.forEach(cat => {
        const countEl = document.getElementById(`count-${cat}`);
        if (countEl) {
          if (cat === 'all') {
            countEl.textContent = currentVideos.length;
          } else {
            const count = currentVideos.filter(v => v.category === cat).length;
            countEl.textContent = count;
          }
        }
      });
    }

    function selectCategory(cat, btn) {
      if (currentlyPlayingId) {
        stopVideoInline(currentlyPlayingId);
      }
      currentCategory = cat;
      document.querySelectorAll('.category-pill').forEach(b => b.classList.remove('active'));
      if (btn) {
        btn.classList.add('active');
      }
      renderVideos();
    }

    function filterVideos() {
      if (currentlyPlayingId) {
        stopVideoInline(currentlyPlayingId);
      }
      renderVideos();
    }

    // Helper: Build Showroom Stage Thumbnail Inner HTML
    function getThumbnailInnerHtml(video, idx) {
      const platformIcon = video.platform === 'tiktok' 
        ? '<i class="fa-brands fa-tiktok"></i> TikTok' 
        : (video.platform === 'instagram' 
          ? '<i class="fa-brands fa-instagram"></i> Reels' 
          : '<i class="fa-brands fa-youtube"></i> Shorts');

      const platformClass = video.platform === 'tiktok' ? 'tiktok' : (video.platform === 'instagram' ? 'instagram' : 'youtube');
      
      let rankBadge = '';
      if (idx === 0) {
        rankBadge = `<div class="rank-badge rank-1"><i class="fa-solid fa-star"></i> REKOMENDASI UTAMA</div>`;
      } else if (idx === 1) {
        rankBadge = `<div class="rank-badge rank-2"><i class="fa-solid fa-thumbs-up"></i> PILIHAN SALES</div>`;
      } else if (idx === 2) {
        rankBadge = `<div class="rank-badge rank-3"><i class="fa-solid fa-award"></i> BEST CHOICE</div>`;
      }

      const stageTheme = video.stageTheme || 'stage-zenix';
      const carImg = video.carImg || '../assets/img/mobil/zenix.webp';
      const modelName = video.modelName || 'TOYOTA HYBRID';

      return `
        ${rankBadge}
        
        <div class="stage-bg ${stageTheme}">
          <div class="stage-spotlight"></div>
          <div class="stage-model-watermark">${modelName}</div>
          <img src="${carImg}" alt="${video.title}" class="stage-car-img" loading="lazy">
          <div class="stage-car-shadow"></div>
        </div>

        <!-- Overlay Badges (Clean, No Views / Likes) -->
        <div class="video-thumb-overlay">
          <div class="thumb-top-row">
            <span class="platform-badge ${platformClass}">${platformIcon}</span>
            <span class="author-badge">
              <i class="fa-solid fa-circle-check" style="color: #38bdf8;"></i> ${video.author}
            </span>
          </div>

          <!-- Frosted Glass Play Button -->
          <div class="play-button-center" title="Klik untuk Putar Langsung di Sini">
            <i class="fa-solid fa-play"></i>
          </div>

          <div class="thumb-bottom-row">
            <span class="model-tag-pill"><i class="fa-solid fa-car-side"></i> ${modelName}</span>
            <span style="font-size: 10.5px; background: rgba(9,13,22,0.75); color: #cbd5e1; padding: 3px 8px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; gap: 5px;">
              <i class="fa-solid fa-play" style="font-size: 9px; color: #ff334b;"></i> Putar Langsung
            </span>
          </div>
        </div>
      `;
    }

    function renderVideos() {
      const query = (document.getElementById('viralSearchInput')?.value || '').toLowerCase().trim();
      const sortVal = document.getElementById('viralSortSelect')?.value || 'featured';
      const grid = document.getElementById('viralVideoGrid');
      const emptyState = document.getElementById('viralEmptyState');

      let filtered = currentVideos.filter(v => {
        const matchCategory = (currentCategory === 'all') || (v.category === currentCategory);
        const matchQuery = !query || 
          v.title.toLowerCase().includes(query) || 
          v.desc.toLowerCase().includes(query) || 
          (v.modelName && v.modelName.toLowerCase().includes(query)) ||
          v.categoryName.toLowerCase().includes(query);
        return matchCategory && matchQuery;
      });

      // SORTING LOGIC
      if (sortVal === 'latest') {
        filtered = [...filtered].reverse();
      } else if (sortVal === 'model') {
        filtered.sort((a, b) => (a.modelName || '').localeCompare(b.modelName || ''));
      }

      if (filtered.length === 0) {
        if (grid) grid.innerHTML = '';
        if (emptyState) emptyState.style.display = 'block';
        return;
      }

      if (emptyState) emptyState.style.display = 'none';

      if (grid) {
        grid.innerHTML = filtered.map((video, idx) => {
          const salesPitch = video.salesPitch || 'Materi promosi resmi untuk follow-up dan meningkatkan kepercayaan calon pembeli.';
          const catClass = `cat-${video.category || 'delivery'}`;

          return `
            <div class="video-card" id="card-${video.id}">
              <!-- Direct In-Place Stage / Player -->
              <div class="video-thumb-container" id="thumb-${video.id}" onclick="toggleInlineVideo('${video.id}')">
                ${getThumbnailInnerHtml(video, idx)}
              </div>

              <!-- Card Details -->
              <div class="video-details">
                <div>
                  <div class="video-category-tag ${catClass}">
                    <i class="fa-solid fa-tag"></i> ${video.categoryName}
                  </div>
                  <h3 class="video-title" title="${video.title}">${video.title}</h3>
                  <p class="video-desc">${video.desc}</p>
                  
                  <!-- Sales Pitch Tip -->
                  <div class="sales-pitch-box">
                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                    <span><strong>Tips Sales:</strong> ${salesPitch}</span>
                  </div>
                </div>

                <!-- Actions for Sales (In-Place Play, WhatsApp Share, Copy Link) -->
                <div class="video-actions">
                  <button onclick="toggleInlineVideo('${video.id}')" class="btn-watch" id="play-btn-${video.id}">
                    <i class="fa-solid fa-play"></i> Putar Video
                  </button>
                  <button onclick="shareVideoToWa('${video.id}')" class="btn-wa-share">
                    <i class="fa-brands fa-whatsapp"></i> Share WA
                  </button>
                  <button onclick="copyVideoInfo('${video.id}')" class="btn-copy" title="Salin Link & Teks Promosi">
                    <i class="fa-solid fa-copy"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    // =========================================================
    // INLINE DIRECT VIDEO PLAYBACK CONTROLS (NO POPUP!)
    // =========================================================
    function toggleInlineVideo(id) {
      if (currentlyPlayingId === id) {
        stopVideoInline(id);
        return;
      }

      // Stop previous video if another one is playing
      if (currentlyPlayingId) {
        stopVideoInline(currentlyPlayingId);
      }

      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const card = document.getElementById(`card-${id}`);
      const thumbContainer = document.getElementById(`thumb-${id}`);
      const actionBtn = document.getElementById(`play-btn-${id}`);

      if (!thumbContainer) return;

      currentlyPlayingId = id;
      thumbContainer.classList.add('is-playing');
      if (card) card.classList.add('card-playing');

      const ytId = extractYouTubeId(v.videoUrl);
      const tiktokId = extractTikTokVideoId(v.videoUrl);
      const igCode = extractInstagramReelCode(v.videoUrl);

      let embedHtml = '';

      // 1. YouTube Shorts / Video Embed (Plays inline instantly!)
      if (v.platform === 'youtube' || ytId) {
        const idToUse = ytId || 'gdwtyyYBjZ8';
        embedHtml = `
          <div class="inline-player-wrapper">
            <button class="btn-close-inline" onclick="event.stopPropagation(); stopVideoInline('${id}')" title="Tutup Video (Esc)">
              <i class="fa-solid fa-xmark"></i> Tutup
            </button>
            <iframe 
              src="https://www.youtube.com/embed/${idToUse}?autoplay=1&rel=0&modestbranding=1&playsinline=1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>
        `;
      } 
      // 2. TikTok Direct Player
      else if (v.platform === 'tiktok' && tiktokId) {
        embedHtml = `
          <div class="inline-player-wrapper">
            <button class="btn-close-inline" onclick="event.stopPropagation(); stopVideoInline('${id}')" title="Tutup Video (Esc)">
              <i class="fa-solid fa-xmark"></i> Tutup
            </button>
            <iframe 
              src="https://www.tiktok.com/player/v1/${tiktokId}?music_info=1&description=1" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" 
              allowfullscreen>
            </iframe>
          </div>
        `;
      } 
      // 3. Instagram Reels
      else if (v.platform === 'instagram' && igCode) {
        embedHtml = `
          <div class="inline-player-wrapper">
            <button class="btn-close-inline" onclick="event.stopPropagation(); stopVideoInline('${id}')" title="Tutup Video (Esc)">
              <i class="fa-solid fa-xmark"></i> Tutup
            </button>
            <iframe 
              src="https://www.instagram.com/reel/${igCode}/embed" 
              allowfullscreen>
            </iframe>
          </div>
        `;
      } 
      // 4. Fallback: External link
      else {
        window.open(v.videoUrl, '_blank');
        currentlyPlayingId = null;
        return;
      }

      thumbContainer.innerHTML = embedHtml;

      if (actionBtn) {
        actionBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Tutup Video';
        actionBtn.style.background = '#c8102e';
      }
    }

    function stopVideoInline(id) {
      if (currentlyPlayingId === id) {
        currentlyPlayingId = null;
      }
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const idx = currentVideos.indexOf(v);
      const card = document.getElementById(`card-${id}`);
      const thumbContainer = document.getElementById(`thumb-${id}`);
      const actionBtn = document.getElementById(`play-btn-${id}`);

      if (card) card.classList.remove('card-playing');
      if (thumbContainer) {
        thumbContainer.classList.remove('is-playing');
        thumbContainer.innerHTML = getThumbnailInnerHtml(v, idx);
      }

      if (actionBtn) {
        actionBtn.innerHTML = '<i class="fa-solid fa-play"></i> Putar Video';
        actionBtn.style.background = '#0f172a';
      }
    }

    // Share Video to Consumer WhatsApp
    function shareVideoToWa(id) {
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const salesName = localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
      const text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨\n\nIzin berbagi video review & momen serah terima resmi dari cabang showroom kami:\n\n🎬 *${v.title}*\n\n"${v.desc}"\n\nTonton video lengkapnya di sini ya Pak/Bu:\n👉 ${v.videoUrl}\n\nJika Bapak/Ibu ingin konsultasi ketersediaan unit ready stock, simulasi hitungan kredit DP ringan atau booking jadwal test drive, saya siap bantu kapan saja. Terima kasih banyak! 🙏\n\n*Tunas Toyota Kiara Condong*\nJl. Ibrahim Adjie No. 47, Bandung`;

      const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    // Copy Video Info to Clipboard
    function copyVideoInfo(id) {
      const v = currentVideos.find(item => item.id === id);
      if (!v) return;

      const salesName = localStorage.getItem('namaSales') || 'Sales Consultant Tunas Toyota';
      const text = `Halo Bapak/Ibu, salam hangat dari *${salesName}* (Tunas Toyota Kiara Condong) 🚗✨\n\n🎬 *${v.title}*\n\n"${v.desc}"\n\nTonton Video: ${v.videoUrl}\n\n#TunasToyotaKircon #ToyotaBandung #SalesToyotaKircon`;
      navigator.clipboard.writeText(text);
      alert('✅ Link video & caption promosi berhasil disalin ke clipboard! Siap dipaste ke WhatsApp calon konsumen.');
    }

    // Modal Add Video
    function openAddVideoModal() {
      document.getElementById('addVideoModal').classList.add('active');
    }

    function closeAddVideoModal() {
      document.getElementById('addVideoModal').classList.remove('active');
      const badge = document.getElementById('videoDetectBadge');
      if (badge) badge.style.display = 'none';
    }

    function saveNewVideo() {
      const url = document.getElementById('newVideoUrl').value.trim();
      const title = document.getElementById('newVideoTitle').value.trim();
      const platform = document.getElementById('newVideoPlatform').value;
      const category = document.getElementById('newVideoCategory').value;
      const modelVal = document.getElementById('newVideoModelSelect').value.split('|');
      const carImg = `../assets/img/mobil/${modelVal[0]}`;
      const modelName = modelVal[1] || 'Toyota';
      const stageTheme = modelVal[2] || 'stage-zenix';
      const desc = document.getElementById('newVideoDesc').value.trim() || 'Konten video showcase resmi dari Tunas Toyota Kiara Condong.';

      if (!url) {
        alert('Mohon masukkan link video YouTube Shorts/TikTok/Instagram!');
        return;
      }
      if (!title) {
        alert('Mohon isi judul konten video!');
        return;
      }

      const catNames = {
        delivery: 'Serah Terima Unit',
        feature: 'Review & Rahasia Fitur',
        tips: 'Tips & Edukasi',
        parodi: 'Aktivitas & Tren Sales',
        promo: 'Promo & Event'
      };

      const newVideo = {
        id: 'v_' + Date.now(),
        title: title,
        category: category,
        categoryName: catNames[category] || 'Media Showcase',
        platform: platform,
        author: '@tunastoyotakircon',
        desc: desc,
        modelName: modelName,
        carImg: carImg,
        stageTheme: stageTheme,
        salesPitch: 'Materi promosi video sales resmi untuk calon konsumen.',
        videoUrl: url
      };

      currentVideos.unshift(newVideo);
      localStorage.setItem('sft_viral_videos_v7', JSON.stringify(currentVideos));
      
      closeAddVideoModal();
      renderVideos();
      updateStats();
      alert('🎉 Video berhasil disimpan! Konten langsung tampil dan siap diputar langsung di dalam kartu.');

      // Reset form
      document.getElementById('newVideoUrl').value = '';
      document.getElementById('newVideoTitle').value = '';
      document.getElementById('newVideoDesc').value = '';
    }

    function resetVideosToDefault() {
      if (confirm('Kembalikan koleksi video ke daftar default resmi Tunas Toyota Kiara Condong?')) {
        currentVideos = DEFAULT_VIRAL_VIDEOS;
        localStorage.setItem('sft_viral_videos_v7', JSON.stringify(currentVideos));
        renderVideos();
        updateStats();
        closeAddVideoModal();
      }
    }

    // Keyboard support: Escape closes video or modal
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (currentlyPlayingId) {
          stopVideoInline(currentlyPlayingId);
        }
        closeAddVideoModal();
      }
    });

    // Close modal on background click
    window.addEventListener('click', (e) => {
      const modalAdd = document.getElementById('addVideoModal');
      if (e.target === modalAdd) closeAddVideoModal();
    });

    document.addEventListener('DOMContentLoaded', () => {
      initViralVideos();
    });
  </script>
</body>
</html>
