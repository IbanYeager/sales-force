/**
 * SALES SUPERPOWERS 7.0 - CLIENT LOGIC & ENGINE
 * Tunas Toyota Kiara Condong (SFT)
 * Features:
 * 1. Radar Prospek Terdekat (GPS Leads)
 * 2. Instant Quotation to PDF & WA
 * 3. Smart Follow-Up Reminder & Morning Briefing
 * 4. Scan KTP & STNK Otomatis (OCR)
 * 5. Voice Note Activity Log (Speech-to-Text)
 * 6. Battle Card & Objection Handling
 * 7. Live Stock Quick Checker
 */

const SalesSuperpowers = {
  recognition: null,
  isRecording: false,
  salesCoords: null,

  getApiPrefix() {
    const path = window.location.pathname;
    const isRoot = !path.includes('/pages/') && !path.includes('/pages_spv/') && !path.includes('/pages_kacab/');
    return isRoot ? 'api/' : '../api/';
  },

  getApiEndpoints(apiFile = 'api_ocr_scanner.php') {
    const prefix = this.getApiPrefix();
    const pathname = window.location.pathname || '';
    const parts = pathname.split('/').filter(Boolean);
    let subfolder = '';
    if (parts.length > 0) {
      const first = parts[0].toLowerCase();
      const standardRoutes = ['pages', 'pages_spv', 'pages_kacab', 'spv', 'kacab', 'spk', 'customer', 'input', 'dashboard', 'index', 'index.html', 'home', 'api'];
      if (!standardRoutes.includes(first)) {
        subfolder = '/' + parts[0];
      }
    }

    const list = [
      `${prefix}${apiFile}`,
      `${subfolder}/api/${apiFile}`,
      `${subfolder}/public/api/${apiFile}`,
      `api/${apiFile}`,
      `../api/${apiFile}`,
      `/api/${apiFile}`,
      `/public/api/${apiFile}`,
      `public/api/${apiFile}`
    ];
    return Array.from(new Set(list.filter(Boolean)));
  },

  // =========================================================================
  // 1. RADAR PROSPEK TERDEKAT (EXECUTIVE RADAR COCKPIT)
  // =========================================================================
  radarData: [],
  currentRadius: 1,
  radarRadiusCircle: null,
  currentDistrict: 'all',
  radarCarFilter: 'all',
  leafletMap: null,
  leafletMarkers: [],
  radarStatusFilter: 'all',
  radarQuery: '',
  radarMarkersLayer: null,
  radarRenderLimit: 48,
  selectedPhotoFile: null,

  ensureRadarStyles() {
    if (document.getElementById('radarExecutiveStyles')) return;
    const style = document.createElement('style');
    style.id = 'radarExecutiveStyles';
    style.textContent = `
      .radar-status-filter-strip { display: flex; align-items: center; gap: 6px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding: 4px 0 10px 0; margin-bottom: 12px; width: 100%; }
      .radar-status-filter-strip::-webkit-scrollbar { display: none; }
      .radar-status-pill { flex-shrink: 0; display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 20px; border: 1.5px solid #cbd5e1; background: #ffffff; color: #334155; font-size: 11.5px; font-weight: 700; cursor: pointer; transition: all 0.18s ease; white-space: nowrap; font-family: inherit; }
      .radar-status-pill:hover { background: #f8fafc; border-color: #94a3b8; color: #0f172a; }
      .radar-status-pill.active { background: #0f172a !important; color: #ffffff !important; border-color: #0f172a !important; box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25); }
      .radar-status-pill .status-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
      .radar-status-pill .dot-red { background: #ef4444; }
      .radar-status-pill .dot-yellow { background: #f59e0b; }
      .radar-status-pill .dot-purple { background: #8b5cf6; }
      .radar-status-pill .dot-green { background: #10b981; }
      .radar-status-pill.active .status-dot { box-shadow: 0 0 6px rgba(255,255,255,0.8); }
      .radar-cockpit-wrapper { background: #ffffff; border: 1px solid #e2e8f0; border-top: 3px solid #d7123a; border-radius: 20px; padding: 22px; margin-bottom: 22px; box-shadow: 0 10px 30px -5px rgba(15,23,42,0.05); }
      .radar-cockpit-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
      .radar-header-left { display: flex; align-items: center; gap: 14px; }
      .radar-sonar-icon-wrapper { position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
      .radar-sonar-wave { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(215, 18, 58, 0.2); animation: radar-sonar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      .radar-sonar-wave.wave-2 { animation-delay: 1s; }
      @keyframes radar-sonar-ping { 0% { transform: scale(0.6); opacity: 0.9; } 100% { transform: scale(1.9); opacity: 0; } }
      .radar-sonar-center { position: relative; z-index: 2; width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #d7123a 0%, #b91c1c 100%); color: #ffffff; display: flex; align-items: center; justify-content: center; font-size: 17px; box-shadow: 0 4px 12px rgba(215, 18, 58, 0.35); }
      .radar-micro-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 10.5px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; color: #d7123a; background: #fff1f2; padding: 3px 9px; border-radius: 6px; margin-bottom: 4px; }
      .radar-header-title { font-size: 17.5px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.3px; }
      .radar-header-sub { font-size: 12px; color: #64748b; margin: 3px 0 0 0; }
      .radar-header-right { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
      .radar-gps-live-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; padding: 7px 14px; border-radius: 20px; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; box-shadow: 0 1px 3px rgba(0,0,0,0.03); }
      .live-dot-pulse { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); animation: live-pulse-dot 1.8s infinite; }
      @keyframes live-pulse-dot { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); } }
      .btn-radar-dealer { padding: 7px 13px; font-size: 11.5px; font-weight: 800; background: #d7123a; color: #ffffff; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(215, 18, 58, 0.25); white-space: nowrap; }
      .btn-radar-dealer:hover { background: #b91c1c; transform: translateY(-1px); }
      .btn-radar-detect { padding: 7px 13px; font-size: 11.5px; font-weight: 800; background: #0f172a; color: #ffffff; border-radius: 10px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15); white-space: nowrap; }
      .btn-radar-detect:hover { background: #1e293b; transform: translateY(-1px); }
      .radar-accuracy-alert-box { background: #fffbeb; border: 1.5px solid #fde68a; border-radius: 12px; padding: 10px 14px; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
      .radar-accuracy-alert-text { font-size: 12px; color: #92400e; font-weight: 700; display: flex; align-items: center; gap: 8px; }
      .radar-controls-strip { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; margin-bottom: 12px; }
      .radar-radius-section { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
      .radar-radius-label { font-size: 11.5px; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.3px; display: flex; align-items: center; gap: 5px; }
      .radar-radius-pill-group { display: inline-flex; background: #f1f5f9; padding: 4px; border-radius: 12px; gap: 4px; border: 1px solid #e2e8f0; }
      .radar-radius-pill { padding: 6px 14px; border-radius: 9px; font-size: 12px; font-weight: 700; border: none; background: transparent; color: #475569; cursor: pointer; transition: all 0.18s ease; white-space: nowrap; }
      .radar-radius-pill:hover { color: #0f172a; background: #ffffff; }
      .radar-radius-pill.active { background: #0f172a !important; color: #ffffff !important; font-weight: 800; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2); }
      .radar-search-wrap { display: flex; align-items: center; gap: 8px; flex: 1; max-width: 360px; min-width: 240px; }
      .radar-search-input-box { position: relative; width: 100%; }
      .radar-search-input-box i { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); font-size: 12px; color: #94a3b8; }
      .radar-search-input { width: 100%; padding: 8px 12px 8px 34px; border-radius: 10px; border: 1.5px solid #cbd5e1; font-size: 12px; outline: none; background: #f8fafc; transition: all 0.2s ease; }
      .radar-search-input:focus { background: #ffffff; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
      .btn-radar-search { padding: 8px 16px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; border: none; border-radius: 10px; font-size: 12px; font-weight: 800; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25); transition: all 0.15s ease; }
      .btn-radar-search:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35); }
      .radar-quick-landmarks { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
      .radar-landmark-chip { font-size: 11px; font-weight: 700; color: #475569; background: #f8fafc; border: 1px solid #e2e8f0; padding: 4px 10px; border-radius: 8px; cursor: pointer; transition: all 0.15s ease; display: inline-flex; align-items: center; gap: 4px; }
      .radar-landmark-chip:hover { background: #eff6ff; color: #2563eb; border-color: #bfdbfe; }
      .radar-landmark-chip.dealer-chip { background: #fff1f2; color: #d7123a; border-color: #fecaca; }
      .radar-landmark-chip.dealer-chip:hover { background: #fee2e2; }
      .radar-zone-container { transition: all 0.2s ease; }
      .radar-district-select { padding: 6px 12px; border-radius: 9px; border: 1.5px solid #cbd5e1; background: #ffffff; font-size: 12px; font-weight: 700; color: #0f172a; outline: none; cursor: pointer; transition: all 0.18s ease; }
      .radar-district-select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
      .radar-zone-chips-scroll { display: flex; align-items: center; gap: 6px; overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; padding: 2px 0; }
      .radar-zone-chips-scroll::-webkit-scrollbar { display: none; }
      .radar-zone-chip { flex-shrink: 0; display: inline-flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #ffffff; color: #334155; font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.15s ease; white-space: nowrap; font-family: inherit; }
      .radar-zone-chip:hover { background: #eff6ff; color: #2563eb; border-color: #93c5fd; }
      .radar-zone-chip.active { background: #d7123a !important; color: #ffffff !important; border-color: #d7123a !important; box-shadow: 0 2px 6px rgba(215, 18, 58, 0.25); }
      .radar-filter-panel { background: #f8fafc; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; margin-bottom: 14px; box-shadow: 0 2px 8px rgba(15,23,42,0.03); }
      .radar-select-dropdown { padding: 8px 12px; border-radius: 9px; border: 1.5px solid #cbd5e1; font-size: 12px; font-weight: 700; color: #0f172a; outline: none; background: #ffffff; cursor: pointer; transition: all 0.18s ease; }
      .radar-select-dropdown:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12); }
      .btn-reset-filters { display: inline-flex; align-items: center; gap: 6px; padding: 8px 14px; border-radius: 10px; background: #fff1f2; color: #d7123a; border: 1.5px solid #fecaca; font-size: 11.5px; font-weight: 800; cursor: pointer; transition: all 0.18s ease; white-space: nowrap; font-family: inherit; }
      .btn-reset-filters:hover { background: #fee2e2; border-color: #f87171; transform: translateY(-1px); }
      .radar-map-outer { border-radius: 16px; overflow: hidden; border: 1px solid #cbd5e1; position: relative; height: 490px; box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05); }
      #radarLeafletMapContainer { cursor: default; }
      .radar-sales-beacon-icon { background: transparent !important; border: none !important; }
      .radar-sales-beacon-wrap { position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

      @media (max-width: 640px) {
        .radar-cockpit-wrapper { padding: 14px 12px !important; border-radius: 16px !important; }
        .radar-cockpit-header { flex-direction: column !important; align-items: stretch !important; gap: 12px !important; }
        .radar-header-left { gap: 10px !important; }
        .radar-header-title { font-size: 15px !important; }
        .radar-header-right { display: flex !important; flex-direction: column !important; width: 100% !important; gap: 8px !important; }
        .radar-gps-live-badge { width: 100% !important; justify-content: center !important; text-align: center !important; box-sizing: border-box !important; }
        .radar-header-btn-row { display: grid !important; grid-template-columns: 1fr 1fr !important; width: 100% !important; gap: 8px !important; }
        .btn-radar-dealer, .btn-radar-detect { width: 100% !important; justify-content: center !important; padding: 8px 10px !important; font-size: 11px !important; }
        .radar-zone-container { padding: 10px 10px !important; }
        .radar-district-select { width: 100% !important; margin-top: 4px; }
        .radar-controls-strip { flex-direction: column !important; align-items: stretch !important; gap: 10px !important; }
        .radar-radius-section { width: 100% !important; }
        .radar-radius-pill-group { display: flex !important; width: 100% !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none !important; }
        .radar-radius-pill-group::-webkit-scrollbar { display: none !important; }
        .radar-radius-pill { flex: 1 0 auto !important; padding: 6px 10px !important; text-align: center !important; font-size: 11px !important; }
        .radar-search-wrap { width: 100% !important; max-width: 100% !important; min-width: 0 !important; }
        .radar-quick-landmarks { display: flex !important; flex-wrap: nowrap !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; padding-bottom: 6px !important; margin-bottom: 10px !important; scrollbar-width: none !important; }
        .radar-quick-landmarks::-webkit-scrollbar { display: none !important; }
        .radar-landmark-chip { flex-shrink: 0 !important; white-space: nowrap !important; font-size: 10.5px !important; padding: 4px 8px !important; }
        .radar-map-outer { height: 380px !important; border-radius: 14px !important; }
        .radar-leads-grid { grid-template-columns: 1fr !important; }
      }
      .radar-beacon-aura { position: absolute; width: 100%; height: 100%; border-radius: 50%; background: rgba(215, 18, 58, 0.35); animation: beacon-expand 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
      @keyframes beacon-expand { 0% { transform: scale(0.6); opacity: 1; } 100% { transform: scale(2.6); opacity: 0; } }
      .radar-beacon-core { position: relative; z-index: 2; width: 26px; height: 26px; border-radius: 50%; background: #d7123a; border: 3px solid #ffffff; box-shadow: 0 0 14px rgba(215, 18, 58, 0.9); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 11px; }
      .radar-leaflet-pin-wrap { background: transparent !important; border: none !important; }
      .radar-map-marker-pin { width: 24px; height: 24px; border-radius: 50%; border: 2.5px solid #ffffff; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35); display: flex; align-items: center; justify-content: center; color: #ffffff; font-size: 10px; transition: transform 0.15s ease; cursor: pointer; position: relative; }
      .radar-map-marker-pin:hover { transform: scale(1.3); z-index: 9999 !important; }
      .radar-map-legend-overlay { position: absolute; bottom: 14px; left: 14px; z-index: 999; background: rgba(255, 255, 255, 0.92); backdrop-filter: blur(8px); border: 1px solid rgba(226, 232, 240, 0.9); padding: 6px 12px; border-radius: 10px; display: flex; align-items: center; gap: 12px; font-size: 11px; font-weight: 700; color: #334155; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
      .radar-legend-item { display: flex; align-items: center; gap: 5px; }
      .radar-legend-dot { width: 8px; height: 8px; border-radius: 50%; }
      .radar-popup-card { font-family: 'Plus Jakarta Sans', sans-serif; padding: 4px; min-width: 210px; }
      .radar-popup-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
      .radar-popup-avatar { width: 32px; height: 32px; border-radius: 50%; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 11.5px; flex-shrink: 0; }
      .radar-popup-name { font-size: 13.5px; font-weight: 800; color: #0f172a; margin: 0; line-height: 1.2; }
      .radar-popup-dist { font-size: 11px; color: #64748b; margin-top: 2px; }
      .radar-popup-dist-pill { font-weight: 800; color: #2563eb; background: #eff6ff; padding: 1px 6px; border-radius: 4px; margin-left: 4px; }
      .radar-popup-car-box { background: #f8fafc; border-radius: 8px; padding: 8px 10px; margin-bottom: 10px; border: 1px solid #e2e8f0; }
      .radar-popup-actions { display: flex; gap: 6px; }
      .btn-popup-wa { flex: 1; background: #10b981; color: #ffffff !important; text-decoration: none; padding: 6px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 4px; }
      .btn-popup-maps { flex: 1.2; background: #2563eb; color: #ffffff !important; text-decoration: none; padding: 6px 8px; border-radius: 6px; font-weight: 700; font-size: 11px; text-align: center; display: inline-flex; align-items: center; justify-content: center; gap: 4px; }
      .btn-popup-fu { background: #0f172a; color: #ffffff; border: none; padding: 6px 10px; border-radius: 6px; font-weight: 700; font-size: 11px; cursor: pointer; }
      .radar-leads-header-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; flex-wrap: wrap; gap: 12px; }
      .radar-count-badge { font-size: 11px; font-weight: 800; background: #fee2e2; color: #b91c1c; padding: 2px 8px; border-radius: 12px; }
      .radar-card-filter-input { width: 100%; padding: 7px 10px 7px 28px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 12px; outline: none; background: #ffffff; }
      .radar-leads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 14px; }
      .radar-lead-card-deluxe { background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 16px; transition: all 0.2s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: space-between; }
      .radar-lead-card-deluxe:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08); border-color: #cbd5e1; }
      .radar-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
      .radar-customer-profile { display: flex; align-items: center; gap: 10px; }
      .radar-avatar-circle { width: 40px; height: 40px; border-radius: 50%; color: #fff; font-weight: 800; display: flex; align-items: center; justify-content: center; font-size: 13.5px; flex-shrink: 0; }
      .radar-customer-name { font-size: 14.5px; font-weight: 800; margin: 0; color: #0f172a; }
      .radar-district-tag { font-size: 11.5px; color: #64748b; margin-top: 2px; }
      .radar-dist-chip { background: #eff6ff; color: #2563eb; font-weight: 800; font-size: 11px; padding: 4px 9px; border-radius: 6px; white-space: nowrap; }
      .radar-vehicle-box { background: #f8fafc; padding: 10px 12px; border-radius: 10px; font-size: 12px; margin-bottom: 12px; border: 1px solid #f1f5f9; }
      .radar-vehicle-row { display: flex; align-items: center; gap: 6px; }
      .radar-tags-row { margin-top: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 4px; }
      .radar-tag { font-size: 11px; font-weight: 700; padding: 2px 7px; border-radius: 6px; }
      .radar-tag.status-tag { border: 1px solid transparent; }
      .radar-action-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 8px; }
      .btn-radar-map { background: #2563eb; color: #fff !important; text-align: center; padding: 8px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 11.5px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; }
      .btn-radar-map:hover { background: #1d4ed8; }
      .btn-radar-wa-direct { background: #10b981; color: #fff !important; text-align: center; padding: 8px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 11.5px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; transition: all 0.15s ease; }
      .btn-radar-wa-direct:hover { background: #059669; }
      .btn-radar-fu { background: #0f172a; color: #fff; border: none; padding: 8px; border-radius: 8px; font-weight: 700; font-size: 11.5px; display: inline-flex; align-items: center; justify-content: center; gap: 5px; cursor: pointer; transition: all 0.15s ease; }
      .btn-radar-fu:hover { background: #1e293b; }
      .radar-empty-state { text-align: center; padding: 40px 20px; background: #ffffff; border-radius: 18px; border: 1.5px dashed #cbd5e1; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
      .radar-empty-icon { width: 58px; height: 58px; border-radius: 50%; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 24px; }
      .radar-empty-title { font-size: 15px; font-weight: 800; color: #0f172a; margin: 0 0 6px; }
      .radar-empty-desc { font-size: 12.5px; color: #64748b; margin: 0; }
    `;
    document.head.appendChild(style);
  },

  // Comprehensive Coordinates Dictionary for Canvasing Zones & Districts across Bandung Raya
  ZONE_PRESETS: {
    'all': { label: 'Semua Wilayah (Bandung Raya)', coords: null, zoom: 12, aliases: ['all'] },
    'bojongsoang': { label: 'Bojongsoang', coords: [-6.9833, 107.6333], zoom: 14, aliases: ['bojongsoang', 'ciganitri', 'cipagalo', 'buah batu square'] },
    'buahbatu': { label: 'Buahbatu', coords: [-6.9554, 107.6468], zoom: 14, aliases: ['buahbatu', 'buah batu', 'margacinta', 'ciwastra', 'cijerah'] },
    'kircon': { label: 'Kiaracondong', coords: [-6.9448, 107.6452], zoom: 14, aliases: ['kiaracondong', 'kircon', 'ibrahim adjie', 'babakan surabaya', 'kebon kangkung'] },
    'sukajadi': { label: 'Sukajadi', coords: [-6.8856, 107.5925], zoom: 14, aliases: ['sukajadi', 'sukawarna', 'sukagalih', 'sarijadi', 'gegerkalong'] },
    'pasteur': { label: 'Pasteur', coords: [-6.8944, 107.5889], zoom: 14, aliases: ['pasteur', 'dr djunjunan', 'djunjunan'] },
    'dago': { label: 'Dago / Coblong', coords: [-6.8653, 107.6183], zoom: 14, aliases: ['dago', 'coblong', 'dipatiukur', 'lebakgede', 'sadang serang', 'sekeloa'] },
    'baleendah': { label: 'Baleendah', coords: [-7.0069, 107.6319], zoom: 14, aliases: ['baleendah', 'rencong', 'andir baleendah', 'manggahang'] },
    'cileunyi': { label: 'Cileunyi', coords: [-6.9442, 107.7478], zoom: 14, aliases: ['cileunyi', 'cinunuk', 'jatinangor', 'cibiru'] },
    'antapani': { label: 'Antapani', coords: [-6.9147, 107.6625], zoom: 14, aliases: ['antapani', 'antapani tengah', 'antapani kidul', 'antapani kulon', 'antapani wetan'] },
    'arcamanik': { label: 'Arcamanik', coords: [-6.9189, 107.6811], zoom: 14, aliases: ['arcamanik', 'cisaranten', 'sukamiskin'] },
    'gedebage': { label: 'Gedebage', coords: [-6.9589, 107.6953], zoom: 14, aliases: ['gedebage', 'summarecon', 'rancabolang'] },
    'rancasari': { label: 'Rancasari', coords: [-6.9625, 107.6722], zoom: 14, aliases: ['rancasari', 'derwati', 'cipamokolan'] },
    'lengkong': { label: 'Lengkong', coords: [-6.9312, 107.6189], zoom: 14, aliases: ['lengkong', 'turangga', 'malabar', 'burangrang'] },
    'batununggal': { label: 'Batununggal', coords: [-6.9531, 107.6256], zoom: 14, aliases: ['batununggal', 'mengger', 'kujangsari'] },
    'kopo': { label: 'Kopo', coords: [-6.9550, 107.5920], zoom: 14, aliases: ['kopo', 'babakan ciparay', 'cirangrang', 'margahayu selatan'] },
    'cibaduyut': { label: 'Cibaduyut', coords: [-6.9620, 107.5900], zoom: 14, aliases: ['cibaduyut', 'bojongloa kidul'] },
    'cimahi': { label: 'Cimahi', coords: [-6.8722, 107.5422], zoom: 14, aliases: ['cimahi', 'cibeber', 'leuwigajah', 'baros', 'melong'] },
    'soreang': { label: 'Soreang', coords: [-7.0319, 107.5186], zoom: 14, aliases: ['soreang', 'katapang', 'kutawaringin', 'pameungpeuk'] },
    'dayeuhkolot': { label: 'Dayeuhkolot', coords: [-6.9889, 107.6222], zoom: 14, aliases: ['dayeuhkolot', 'citeureup', 'palasari'] },
    'ujungberung': { label: 'Ujungberung', coords: [-6.9140, 107.6980], zoom: 14, aliases: ['ujungberung', 'pasirwangi', 'cigending'] }
  },

  getZoneLabel(zoneKey) {
    if (!zoneKey || zoneKey === 'all') return 'Semua Wilayah';
    const cleanKey = zoneKey.toLowerCase().trim();
    if (this.ZONE_PRESETS[cleanKey]) {
      return this.ZONE_PRESETS[cleanKey].label;
    }
    return zoneKey.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  },

  handleZoneChange(zoneKey, containerId) {
    this.currentDistrict = zoneKey || 'all';
    this.radarRenderLimit = 48;

    // 1. Update active chips
    document.querySelectorAll('.radar-zone-chip').forEach(chip => {
      const z = chip.getAttribute('data-zone') || '';
      if (z === this.currentDistrict) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // 2. Synchronize dropdowns
    const sel1 = document.getElementById('radarDistrictSelect');
    if (sel1 && sel1.value !== this.currentDistrict) {
      sel1.value = this.currentDistrict;
    }
    const sel2 = document.getElementById('radarFilterDistrictSelect');
    if (sel2 && sel2.value !== this.currentDistrict) {
      sel2.value = this.currentDistrict;
    }

    // 3. Determine target center coordinates and zoom
    const cleanKey = (this.currentDistrict || 'all').toLowerCase().trim();
    let targetCoords = null;
    let targetZoom = 14;

    if (cleanKey === 'all') {
      targetCoords = [
        this.salesCoords ? this.salesCoords.lat : -6.9448,
        this.salesCoords ? this.salesCoords.lng : 107.6452
      ];
      targetZoom = 13;
    } else if (this.ZONE_PRESETS[cleanKey] && this.ZONE_PRESETS[cleanKey].coords) {
      targetCoords = this.ZONE_PRESETS[cleanKey].coords;
      targetZoom = this.ZONE_PRESETS[cleanKey].zoom || 14;
    } else {
      // Find matching coordinates from active data
      const matching = (this.radarData || []).find(c => {
        const d = (c.district || '').toLowerCase();
        return (d.includes(cleanKey) || (c.address || '').toLowerCase().includes(cleanKey)) && c.lat && c.lng;
      });
      if (matching) {
        targetCoords = [matching.lat, matching.lng];
      }
    }

    // 4. Smooth auto-zoom map if initialized
    if (this.leafletMap && targetCoords) {
      this.leafletMap.flyTo(targetCoords, targetZoom, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }

    // 5. Fetch radar data for the targeted district
    const fetchLat = targetCoords ? targetCoords[0] : (this.salesCoords ? this.salesCoords.lat : -6.9448);
    const fetchLng = targetCoords ? targetCoords[1] : (this.salesCoords ? this.salesCoords.lng : 107.6452);
    const fetchRadius = cleanKey === 'all' ? (this.currentRadius || 1) : 999;

    this.fetchRadarData(fetchLat, fetchLng, fetchRadius, this.currentDistrict);
  },

  populateDistrictSelect(districts, selectedDistrict) {
    const optgroup1 = document.getElementById('radarOptgroupAllDistricts');
    const optgroup2 = document.getElementById('radarCardsOptgroupAllDistricts');

    const popularKeys = Object.keys(this.ZONE_PRESETS).filter(k => k !== 'all');

    [optgroup1, optgroup2].forEach(optgroup => {
      if (!optgroup || optgroup.children.length > 0) return;
      districts.forEach(d => {
        const clean = d.toLowerCase().trim();
        if (popularKeys.includes(clean)) return;

        const opt = document.createElement('option');
        opt.value = clean;
        opt.textContent = d;
        optgroup.appendChild(opt);
      });
    });

    const sel1 = document.getElementById('radarDistrictSelect');
    if (sel1 && selectedDistrict) sel1.value = selectedDistrict;

    const sel2 = document.getElementById('radarFilterDistrictSelect');
    if (sel2 && selectedDistrict) sel2.value = selectedDistrict;
  },

  handleCarFilter(carVal) {
    this.radarCarFilter = (carVal || 'all').toLowerCase().trim();
    this.radarRenderLimit = 48;

    const sel = document.getElementById('radarFilterCarSelect');
    if (sel && sel.value !== this.radarCarFilter) {
      sel.value = this.radarCarFilter;
    }

    this.applyRadarFilter();
  },

  clearRadarQuery() {
    this.radarQuery = '';
    const inp = document.getElementById('radarCardFilterInput');
    if (inp) inp.value = '';
    this.radarRenderLimit = 48;
    this.applyRadarFilter();
  },

  resetAllRadarFilters() {
    this.currentDistrict = 'all';
    this.radarCarFilter = 'all';
    this.radarStatusFilter = 'all';
    this.radarQuery = '';
    this.radarRenderLimit = 48;

    const inp = document.getElementById('radarCardFilterInput');
    if (inp) inp.value = '';

    const distSel1 = document.getElementById('radarDistrictSelect');
    if (distSel1) distSel1.value = 'all';

    const distSel2 = document.getElementById('radarFilterDistrictSelect');
    if (distSel2) distSel2.value = 'all';

    const carSel = document.getElementById('radarFilterCarSelect');
    if (carSel) carSel.value = 'all';

    document.querySelectorAll('.radar-zone-chip').forEach(c => {
      if (c.getAttribute('data-zone') === 'all') c.classList.add('active');
      else c.classList.remove('active');
    });

    if (this.leafletMap && this.salesCoords) {
      this.leafletMap.flyTo([this.salesCoords.lat, this.salesCoords.lng], 13, { duration: 1.0 });
    }

    this.fetchRadarData(
      this.salesCoords ? this.salesCoords.lat : -6.9448,
      this.salesCoords ? this.salesCoords.lng : 107.6452,
      this.currentRadius || 1,
      'all'
    );
  },

  matchCarModel(carModelStr, filterValue) {
    if (!filterValue || filterValue === 'all') return true;
    const str = (carModelStr || '').toLowerCase();
    const filter = filterValue.toLowerCase().trim();

    if (filter === 'avanza') return str.includes('avanza');
    if (filter === 'innova') return str.includes('innova') || str.includes('zenix');
    if (filter === 'alphard') return str.includes('alphard') || str.includes('vellfire');
    if (filter === 'altis') return str.includes('altis') || str.includes('corolla');
    if (filter === 'yaris') return str.includes('yaris');

    return str.includes(filter);
  },

  quickSetLocation(key) {
    const preset = this.ZONE_PRESETS[key];
    if (preset && preset.coords) {
      const [lat, lng] = preset.coords;
      const label = preset.label;
      const searchInput = document.getElementById('salesLocationSearchInput');
      if (searchInput) searchInput.value = label;
      this.setManualSalesCoords(lat, lng, label, 10, true);
    }
  },

  async renderRadarCockpit(containerId = 'followupDataContainer', district = 'all', radiusKm = 1) {
    this.currentRadius = parseFloat(radiusKm) || 1;
    this.currentDistrict = district;

    // Ensure CSS styles are injected
    this.ensureRadarStyles();

    // Check saved coordinates
    const savedLat = localStorage.getItem('savedSalesLat');
    const savedLng = localStorage.getItem('savedSalesLng');
    const isManual = localStorage.getItem('savedSalesIsManual') === 'true';

    // If coordinates were saved as a manual pinpoint, restore them.
    if (savedLat && savedLng && isManual) {
      this.salesCoords = { lat: parseFloat(savedLat), lng: parseFloat(savedLng) };
      this.gpsAccuracy = 10;
    } else {
      // Default to Tunas Toyota Kiara Condong Dealer (Jl. Soekarno-Hatta / Terusan Kircon)
      this.salesCoords = { lat: -6.9448, lng: 107.6452 };
      this.gpsAccuracy = 15;
    }

    const container = document.getElementById(containerId);
    if (!container) return;

    const currentLocLabel = localStorage.getItem('savedSalesLocLabel') || 'Tunas Toyota Kircon (Dealer)';

    // Render Cockpit Shell with Executive Tactical Radar Interface & Canvasing Zone Bar
    container.innerHTML = `
      <div class="radar-cockpit-wrapper">
        <!-- Top Row: Title, Radar Sonar Ping & GPS Status -->
        <div class="radar-cockpit-header">
          <div class="radar-header-left">
            <div class="radar-sonar-icon-wrapper">
              <div class="radar-sonar-wave"></div>
              <div class="radar-sonar-wave wave-2"></div>
              <div class="radar-sonar-center">
                <i class="fa-solid fa-satellite-dish"></i>
              </div>
            </div>
            <div>
              <div class="radar-micro-badge">
                <i class="fa-solid fa-bolt"></i> Live Radar Pelanggan
              </div>
              <h3 class="radar-header-title">Peta Radar Seluruh Pelanggan</h3>
              <p class="radar-header-sub">Memetakan seluruh database pelanggan langsung di peta secara interaktif.</p>
            </div>
          </div>
          
          <div class="radar-header-right">
            <div class="radar-gps-live-badge" id="radarGpsStatus">
              <span class="live-dot-pulse"></span>
              <span id="radarGpsStatusText">📍 ${escapeHtml(currentLocLabel)}</span>
            </div>
            <div class="radar-header-btn-row" style="display:flex; gap:8px;">
              <button type="button" class="btn-radar-dealer" onclick="SalesSuperpowers.quickSetLocation('kircon')" title="Set posisi tepat ke Dealer Tunas Toyota Kiara Condong">
                <i class="fa-solid fa-building-flag"></i> Dealer Kircon
              </button>
              <button type="button" class="btn-radar-detect" onclick="SalesSuperpowers.requestHighAccuracyGPS()" title="Deteksi koordinat GPS satelit perangkat HP">
                <i class="fa-solid fa-location-crosshairs"></i> Deteksi Ulang GPS
              </button>
            </div>
          </div>
        </div>

        <!-- Controls Row: Radius Filter Pills -->
        <div class="radar-controls-strip" style="margin-bottom: 14px;">
          <!-- Radius Options -->
          <div class="radar-radius-section" style="width: 100%;">
            <span class="radar-radius-label">
              <i class="fa-solid fa-bullseye" style="color:#d7123a;"></i> Jangkauan Radius:
            </span>
            <div class="radar-radius-pill-group">
              <button type="button" class="radar-radius-pill ${this.currentRadius == 1 ? 'active' : ''}" onclick="SalesSuperpowers.handleRadiusChange(1, '${containerId}')">1 km</button>
              <button type="button" class="radar-radius-pill ${this.currentRadius == 3 ? 'active' : ''}" onclick="SalesSuperpowers.handleRadiusChange(3, '${containerId}')">3 km</button>
              <button type="button" class="radar-radius-pill ${this.currentRadius == 5 ? 'active' : ''}" onclick="SalesSuperpowers.handleRadiusChange(5, '${containerId}')">5 km</button>
              <button type="button" class="radar-radius-pill ${this.currentRadius == 10 ? 'active' : ''}" onclick="SalesSuperpowers.handleRadiusChange(10, '${containerId}')">10 km</button>
              <button type="button" class="radar-radius-pill ${this.currentRadius >= 999 ? 'active' : ''}" onclick="SalesSuperpowers.handleRadiusChange(999, '${containerId}')">Semua Wilayah</button>
            </div>
          </div>
        </div>

        <!-- Interactive Map Container -->
        <div class="radar-map-outer">
          <div id="radarLeafletMapContainer" style="width:100%; height:100%;"></div>
        </div>
      </div>

      <!-- Radar Lead Cards Container -->
      <div id="radarLeadsContainer">
        <div class="radar-empty-state">
          <div class="radar-empty-icon" style="color:#2563eb;">
            <i class="fa-solid fa-satellite fa-spin" style="animation-duration:3s;"></i>
          </div>
          <h4 class="radar-empty-title">Memuat Peta Radar &amp; Database Pelanggan...</h4>
          <p class="radar-empty-desc">Mengalkulasi jarak titik koordinat posisi Anda ke seluruh pelanggan.</p>
        </div>
      </div>
    `;

    // Ensure Leaflet JS is loaded
    await this.ensureLeafletLoaded();

    // Fetch radar data for the initial sales coordinates
    this.fetchRadarData(this.salesCoords.lat, this.salesCoords.lng, this.currentRadius, district);
  },

  setManualSalesCoords(lat, lng, label = null, accuracy = null, isExplicitManual = true) {
    this.salesCoords = { lat: parseFloat(lat), lng: parseFloat(lng) };
    if (accuracy !== null) this.gpsAccuracy = accuracy;
    localStorage.setItem('savedSalesLat', lat);
    localStorage.setItem('savedSalesLng', lng);
    if (label) localStorage.setItem('savedSalesLocLabel', label);
    if (isExplicitManual) localStorage.setItem('savedSalesIsManual', 'true');

    const badge = document.getElementById('radarGpsStatus');
    let badgeHtml = '';
    
    if (isExplicitManual || (accuracy !== null && accuracy <= 150)) {
      const accText = accuracy && accuracy <= 150 ? ` • Akurasi ±${Math.round(accuracy)}m` : ' • Presisi Manual';
      badgeHtml = `<span class="live-dot-pulse"></span> <span>${escapeHtml(label || 'Lokasi Terpilih')} (${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)})${accText}</span>`;
    } else if (accuracy && accuracy > 1000) {
      badgeHtml = `<span class="live-dot-pulse" style="background:#f59e0b; box-shadow:0 0 0 0 rgba(245,158,11,0.7);"></span> <span style="color:#b45309;">Perkiraan IP (±${Math.round(accuracy/1000)}km) • Klik peta untuk lokasi presisi</span>`;
    } else {
      const accText = accuracy ? ` • Akurasi ±${Math.round(accuracy)}m` : '';
      badgeHtml = `<span class="live-dot-pulse"></span> <span>Terkunci (${parseFloat(lat).toFixed(3)}, ${parseFloat(lng).toFixed(3)})${accText}</span>`;
    }

    if (badge) badge.innerHTML = badgeHtml;

    if (this.leafletMap) {
      this.updateRadarRadiusCircle(lat, lng, this.currentRadius);
    }
    this.fetchRadarData(lat, lng, this.currentRadius, this.currentDistrict);

    if (typeof showCustomAlert === 'function' && isExplicitManual) {
      const locText = label ? label : ('(' + parseFloat(lat).toFixed(4) + ', ' + parseFloat(lng).toFixed(4) + ')');
      showCustomAlert('Lokasi Diperbarui', 'Pusat Radar diset ke ' + locText + detail + '. Data customer terdekat telah diperbarui.', 'success');
    }
  },

  requestHighAccuracyGPS() {
    if (!navigator.geolocation) {
      alert('Browser tidak mendukung Geolocation.');
      return;
    }
    const badge = document.getElementById('radarGpsStatus');
    if (badge) badge.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Melacak GPS Satelit HP...`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const acc = Math.round(pos.coords.accuracy || 0);
        this.gpsAccuracy = acc;
        
        // If on PC/laptop with IP geolocation (> 1000m accuracy)
        if (acc > 1000) {
          if (typeof showCustomAlert === 'function') {
            showCustomAlert(
              'Akurasi GPS Browser Rendah (±' + Math.round(acc/1000) + ' km)',
              'Browser PC/Laptop Anda tidak memiliki chip GPS dan menggunakan perkiraan jaringan IP. Silakan klik langsung titik Anda di peta atau gunakan tombol area/dealer untuk akurasi tepat 100%.',
              'warning'
            );
          }
          this.setManualSalesCoords(pos.coords.latitude, pos.coords.longitude, `Perkiraan IP (±${Math.round(acc/1000)}km)`, acc, false);
        } else {
          // Real GNSS / Satelit Mobile GPS
          this.setManualSalesCoords(pos.coords.latitude, pos.coords.longitude, `GPS Satelit HP (±${acc}m)`, acc, true);
        }
      },
      (err) => {
        alert('Gagal membaca GPS: ' + err.message + '. Silakan klik langsung di peta untuk menetapkan posisi Anda.');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#f59e0b;"></i> Klik Peta untuk Set Posisi`;
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  },

  toggleLiveTracking() {
    if (this.isLiveTracking) {
      if (this.watchId) {
        navigator.geolocation.clearWatch(this.watchId);
        this.watchId = null;
      }
      this.isLiveTracking = false;
      const btn = document.getElementById('btnToggleLiveGps');
      if (btn) {
        btn.style.background = '#334155';
        btn.innerHTML = `<i class="fa-solid fa-satellite"></i> Live Ikuti GPS`;
      }
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Live Tracking Dimatikan', 'Pelacakan real-time otomatis telah dinonaktifkan.', 'info');
      }
    } else {
      if (!navigator.geolocation) {
        alert('Browser tidak mendukung Geolocation.');
        return;
      }
      this.isLiveTracking = true;
      const btn = document.getElementById('btnToggleLiveGps');
      if (btn) {
        btn.style.background = '#ef4444';
        btn.innerHTML = `<i class="fa-solid fa-circle-dot fa-fade" style="color:#fff;"></i> Live Aktif`;
      }
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Live Tracking Aktif', 'Titik radar kini akan otomatis mengikuti pergerakan posisi Anda saat berpindah tempat!', 'success');
      }

      let lastLat = this.salesCoords ? this.salesCoords.lat : 0;
      let lastLng = this.salesCoords ? this.salesCoords.lng : 0;

      const calcDist = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      };

      this.watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const acc = Math.round(pos.coords.accuracy || 0);
          this.gpsAccuracy = acc;
          const newLat = pos.coords.latitude;
          const newLng = pos.coords.longitude;

          // Only refresh if moved more than 20 meters or first update
          const distKm = lastLat ? calcDist(lastLat, lastLng, newLat, newLng) : 1;
          if (distKm > 0.02 || !lastLat) {
            lastLat = newLat;
            lastLng = newLng;
            this.setManualSalesCoords(newLat, newLng, `Live GPS (±${acc}m)`, acc, true);
          }
        },
        (err) => {
          console.warn('Watch GPS error', err);
        },
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 15000 }
      );
    }
  },

  async searchAndSetLocation(query) {
    if (!query || query.trim() === '') return;
    const cleanQ = query.trim().toLowerCase();
    
    // Comprehensive Local Dictionary for Bandung & Greater Area
    const localDict = {
      'kircon': [-6.9448, 107.6452, 'Tunas Toyota Kiara Condong (Dealer)'],
      'kiaracondong': [-6.9448, 107.6452, 'Kiara Condong (Dealer)'],
      'tunas toyota': [-6.9448, 107.6452, 'Tunas Toyota Kiara Condong (Dealer)'],
      'dealer': [-6.9448, 107.6452, 'Tunas Toyota Kiara Condong (Dealer)'],
      'pindad': [-6.9295, 107.6465, 'Pindad'],
      'psm': [-6.9295, 107.6465, 'PSM Kircon'],
      'buahbatu': [-6.9554, 107.6468, 'Buah Batu'],
      'buah batu': [-6.9554, 107.6468, 'Buah Batu'],
      'terusan buahbatu': [-6.9635, 107.6398, 'Terusan Buah Batu'],
      'terusan buah batu': [-6.9635, 107.6398, 'Terusan Buah Batu'],
      'batununggal': [-6.9531, 107.6256, 'Batununggal'],
      'lengkong': [-6.9312, 107.6189, 'Lengkong'],
      'antapani': [-6.9147, 107.6625, 'Antapani'],
      'arcamanik': [-6.9189, 107.6811, 'Arcamanik'],
      'rancasari': [-6.9625, 107.6722, 'Rancasari'],
      'gedebage': [-6.9589, 107.6953, 'Gedebage'],
      'soekarno hatta': [-6.9450, 107.6500, 'Soekarno Hatta'],
      'soetta': [-6.9450, 107.6500, 'Soekarno Hatta'],
      'margacinta': [-6.9580, 107.6520, 'Margacinta'],
      'ciwastra': [-6.9620, 107.6650, 'Ciwastra'],
      'derwati': [-6.9650, 107.6820, 'Derwati'],
      'riung bandung': [-6.9520, 107.6710, 'Riung Bandung'],
      'ciganitri': [-6.9733, 107.6455, 'Ciganitri'],
      'dayeuhkolot': [-6.9889, 107.6222, 'Dayeuhkolot'],
      'bojongsoang': [-6.9833, 107.6333, 'Bojongsoang'],
      'dago': [-6.8653, 107.6183, 'Dago'],
      'dipatiukur': [-6.8900, 107.6160, 'Dipatiukur'],
      'cikutra': [-6.8986, 107.6358, 'Cikutra'],
      'pasteur': [-6.8944, 107.5889, 'Pasteur'],
      'sukajadi': [-6.8856, 107.5925, 'Sukajadi'],
      'setiabudhi': [-6.8600, 107.5950, 'Setiabudhi'],
      'kopo': [-6.9550, 107.5920, 'Kopo'],
      'cibaduyut': [-6.9620, 107.5900, 'Cibaduyut'],
      'moch toha': [-6.9530, 107.6080, 'Moch Toha'],
      'mohammad toha': [-6.9530, 107.6080, 'Moch Toha'],
      'pasirluyu': [-6.9485, 107.6195, 'Pasirluyu'],
      'cijagra': [-6.9515, 107.6288, 'Cijagra'],
      'turangga': [-6.9388, 107.6294, 'Turangga'],
      'gatot subroto': [-6.9275, 107.6325, 'Gatot Subroto'],
      'gatsu': [-6.9275, 107.6325, 'Gatot Subroto'],
      'ibrahim adjie': [-6.9290, 107.6440, 'Ibrahim Adjie'],
      'asia afrika': [-6.9210, 107.6100, 'Asia Afrika'],
      'braga': [-6.9175, 107.6090, 'Braga'],
      'riau': [-6.9080, 107.6180, 'Jl. Riau'],
      'supratman': [-6.9070, 107.6300, 'Supratman'],
      'ujungberung': [-6.9140, 107.6980, 'Ujungberung'],
      'cibiru': [-6.9260, 107.7120, 'Cibiru'],
      'summarecon': [-6.9680, 107.6980, 'Summarecon Bandung'],
      'metro indah': [-6.9470, 107.6590, 'Metro Indah Mall (MIM)']
    };

    for (let key in localDict) {
      if (cleanQ.includes(key)) {
        this.setManualSalesCoords(localDict[key][0], localDict[key][1], localDict[key][2] || query, 10, true);
        return;
      }
    }

    // Try Photon / Komoot OpenStreetMap Geocoder (Fast and unthrottled)
    try {
      const photonRes = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query + ' Bandung')}&limit=1`);
      const photonData = await photonRes.json();
      if (photonData && photonData.features && photonData.features.length > 0) {
        const feat = photonData.features[0];
        const lng = feat.geometry.coordinates[0];
        const lat = feat.geometry.coordinates[1];
        const label = feat.properties.name || feat.properties.street || query;
        this.setManualSalesCoords(lat, lng, label, 10, true);
        return;
      }
    } catch (err) {
      console.warn("Photon lookup fallback to Nominatim", err);
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query + ' Bandung')}`);
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        this.setManualSalesCoords(lat, lng, data[0].display_name, 10, true);
      } else {
        alert('Lokasi "' + query + '" tidak ditemukan. Silakan klik langsung titik yang Anda tuju di peta.');
      }
    } catch (e) {
      console.error(e);
      alert('Gagal mencari lokasi online. Silakan klik langsung titik Anda di peta.');
    }
  },

  handleRadiusChange(radiusVal, containerId) {
    this.currentRadius = parseFloat(radiusVal) || 1;
    this.radarRenderLimit = 48;
    
    // Update active class on pills immediately for snappy responsiveness
    const pills = document.querySelectorAll('.radar-radius-pill');
    pills.forEach(p => {
      const val = p.getAttribute('onclick') || '';
      if (val.includes(`(${radiusVal},`)) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    const sLat = this.salesCoords ? this.salesCoords.lat : -6.9448;
    const sLng = this.salesCoords ? this.salesCoords.lng : 107.6452;

    // Update GPS visual radius circle on the map immediately
    this.updateRadarRadiusCircle(sLat, sLng, this.currentRadius);

    this.fetchRadarData(
      sLat,
      sLng,
      this.currentRadius,
      this.currentDistrict
    );
  },

  handleDistrictChange(districtVal, containerId) {
    this.handleZoneChange(districtVal, containerId);
  },

  async ensureLeafletLoaded() {
    if (!document.querySelector('link[href*="leaflet.css"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }
    if (!document.querySelector('link[href*="MarkerCluster.css"]')) {
      const link1 = document.createElement('link');
      link1.rel = 'stylesheet';
      link1.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
      document.head.appendChild(link1);

      const link2 = document.createElement('link');
      link2.rel = 'stylesheet';
      link2.href = 'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
      document.head.appendChild(link2);
    }

    // Modern glassmorphism cluster bubble styles
    if (!document.getElementById('leafletClusterCustomStyles')) {
      const style = document.createElement('style');
      style.id = 'leafletClusterCustomStyles';
      style.textContent = `
        .marker-cluster {
          background-clip: padding-box;
          border-radius: 50%;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .marker-cluster:hover {
          transform: scale(1.12);
        }
        .marker-cluster div {
          width: 34px;
          height: 34px;
          margin-left: 4px;
          margin-top: 4px;
          text-align: center;
          border-radius: 50%;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 800;
          font-size: 12px;
          line-height: 34px;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(0,0,0,0.25);
        }
        .marker-cluster-small {
          background-color: rgba(16, 185, 129, 0.35);
        }
        .marker-cluster-small div {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .marker-cluster-medium {
          background-color: rgba(37, 99, 235, 0.35);
        }
        .marker-cluster-medium div {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
        }
        .marker-cluster-large {
          background-color: rgba(215, 18, 58, 0.4);
        }
        .marker-cluster-large div {
          background: linear-gradient(135deg, #d7123a, #991b1b);
        }
      `;
      document.head.appendChild(style);
    }

    if (!window.L) {
      await this.loadScript('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js');
    }
    if (!window.L.markerClusterGroup) {
      await this.loadScript('https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js');
    }
  },

  async fetchRadarData(lat, lng, radiusKm, district = 'all') {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    try {
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
      const res = await fetch(`${this.getApiPrefix()}api_customer_radar.php?lat=${lat}&lng=${lng}&radius=${radiusKm}&district=${encodeURIComponent(district)}&db_source=radar&sales_id=${salesId}&limit=0`);
      const result = await res.json();

      if (result.districts_list && Array.isArray(result.districts_list)) {
        this.populateDistrictSelect(result.districts_list, district);
      }

      if (result.status !== 'success' || !result.data || result.data.length === 0) {
        const isZoneSelected = district && district !== 'all';
        const emptyTitle = isZoneSelected
          ? `Tidak Ada Customer di Zona ${this.getZoneLabel(district)}`
          : `Tidak Ada Customer di Ring Radius ${radiusKm < 999 ? radiusKm + ' km' : ''}`;
        const emptyDesc = isZoneSelected
          ? 'Belum ada data customer terdaftar di wilayah ini. Silakan pilih zona kanvasing lain.'
          : 'Coba perluas Ring Radius (misal 5 km atau 10 km) atau pilih zona kanvasing lain di atas.';
        listContainer.innerHTML = `
          <div class="radar-empty-state">
            <div class="radar-empty-icon">
              <i class="fa-solid fa-satellite-dish"></i>
            </div>
            <h4 class="radar-empty-title">${escapeHtml(emptyTitle)}</h4>
            <p class="radar-empty-desc">${escapeHtml(emptyDesc)}</p>
          </div>
        `;
        this.radarData = [];
        this.renderRadarLeafletMap([], lat, lng);
        return;
      }

      this.radarData = result.data;
      this.renderRadarLeafletMap(this.radarData, lat, lng);
      this.renderRadarLeadCards(this.radarData);

    } catch (e) {
      console.error(e);
      listContainer.innerHTML = `<div class="alert-box-error">Gagal memuat data radar: ${e.message}</div>`;
    }
  },

  updateRadarRadiusCircle(lat, lng, radiusKm) {
    if (!this.leafletMap) return;

    if (this.radarRadiusCircle) {
      if (this.leafletMap.hasLayer(this.radarRadiusCircle)) {
        this.leafletMap.removeLayer(this.radarRadiusCircle);
      }
      this.radarRadiusCircle = null;
    }

    const r = parseFloat(radiusKm) || 1;
    if (r >= 500) {
      // "Semua Wilayah" - no bounded circle
      if (this.salesCoords) {
        this.leafletMap.flyTo([this.salesCoords.lat, this.salesCoords.lng], 12, { duration: 1.0 });
      }
      return;
    }

    const radiusMeters = r * 1000;
    this.radarRadiusCircle = L.circle([lat, lng], {
      color: '#2563eb',
      fillColor: '#3b82f6',
      fillOpacity: 0.08,
      weight: 2.2,
      dashArray: '6, 6',
      radius: radiusMeters
    }).addTo(this.leafletMap);

    this.radarRadiusCircle.bindTooltip(
      `<b>📍 Jangkauan Radar: ${r} km</b><br><span style="font-size:10.5px; color:#475569;">Pusat Jangkauan GPS Anda</span>`,
      { sticky: true, direction: 'top' }
    );

    // Fit map bounds smoothly to the circle so it is centered and fully visible
    try {
      this.leafletMap.fitBounds(this.radarRadiusCircle.getBounds(), { padding: [35, 35], maxZoom: 16 });
    } catch (e) {
      this.leafletMap.setView([lat, lng], r <= 1 ? 15 : (r <= 3 ? 14 : 13));
    }
  },

  renderRadarLeafletMap(leads, centerLat, centerLng) {
    const mapEl = document.getElementById('radarLeafletMapContainer');
    if (!mapEl || !window.L) return;

    if (this.leafletMap) {
      this.leafletMap.remove();
      this.leafletMap = null;
    }

    const salesLat = this.salesCoords ? this.salesCoords.lat : centerLat;
    const salesLng = this.salesCoords ? this.salesCoords.lng : centerLng;

    const map = L.map('radarLeafletMapContainer', {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: true
    }).setView([salesLat, salesLng], 14);
    this.leafletMap = map;

    // Google Maps Tile Layers
    const gmapsRoadmap = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps &amp; Tunas Toyota Kircon'
    });

    const gmapsHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: '&copy; Google Maps &amp; Tunas Toyota Kircon'
    });

    // Default layer: Roadmap
    gmapsRoadmap.addTo(map);

    // Layer Switcher for Google Maps View
    L.control.layers({
      "🗺️ Google Roadmap": gmapsRoadmap,
      "🛰️ Google Satelit": gmapsHybrid
    }, null, { position: 'topright' }).addTo(map);

    // Sales Location Pin (Center of Radar, Draggable Beacon)
    const salesIcon = L.divIcon({
      className: 'radar-sales-beacon-icon',
      html: `
        <div class="radar-sales-beacon-wrap">
          <div class="radar-beacon-aura"></div>
          <div class="radar-beacon-core">
            <i class="fa-solid fa-crosshairs"></i>
          </div>
        </div>
      `,
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19]
    });

    const currentLocLabel = localStorage.getItem('savedSalesLocLabel') || 'Pusat Radar Sales';

    const salesMarker = L.marker([salesLat, salesLng], {
      icon: salesIcon,
      title: '📍 Posisi Saya (Terkunci)',
      draggable: false
    }).addTo(map);

    // Draw precision accuracy radius aura if accuracy available (< 500m)
    if (this.gpsAccuracy && this.gpsAccuracy > 0 && this.gpsAccuracy < 500) {
      L.circle([salesLat, salesLng], {
        color: '#0284c7',
        fillColor: '#38bdf8',
        fillOpacity: 0.12,
        weight: 1.5,
        radius: this.gpsAccuracy
      }).addTo(map);
    }

    const accPopupLabel = this.gpsAccuracy && this.gpsAccuracy <= 150 
      ? `Akurasi Satelit: ±${Math.round(this.gpsAccuracy)} meter`
      : 'Titik Presisi Terdeteksi';

    salesMarker.bindPopup(`
      <div style="font-family:'Plus Jakarta Sans', sans-serif; font-size:12px; text-align:center; padding:6px; min-width:190px;">
        <div style="font-size:10px; font-weight:800; color:#d7123a; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:2px;">
          <i class="fa-solid fa-crosshairs"></i> Pusat Jangkauan Radar
        </div>
        <b style="color:#0f172a; font-size:13.5px;">📍 Posisi Anda: ${escapeHtml(currentLocLabel)}</b><br>
        <span style="color:#0369a1; font-weight:700; font-size:11px;"><i class="fa-solid fa-satellite-dish"></i> ${accPopupLabel}</span>
      </div>
    `);

    // Draw visual GPS radius circle on the map
    this.updateRadarRadiusCircle(salesLat, salesLng, this.currentRadius);

    // Initialize or Clear Marker Layer Group (Direct display without clustering)
    if (this.radarMarkersLayer) {
      this.radarMarkersLayer.clearLayers();
      if (this.leafletMap.hasLayer(this.radarMarkersLayer)) {
        this.leafletMap.removeLayer(this.radarMarkersLayer);
      }
    }

    this.radarMarkersLayer = L.layerGroup();
    this.radarMarkersLayer.addTo(map);
    this.updateRadarMapPins();

    // Add Map Legend Overlay
    const legendEl = document.createElement('div');
    legendEl.className = 'radar-map-legend-overlay';
    legendEl.innerHTML = `
      <span class="radar-legend-item" style="font-weight:800; color:#0f172a; margin-right:4px;">
        <i class="fa-solid fa-layer-group" style="color:#d7123a;"></i> <span id="radarMapPinCount">Memuat Pin...</span>
      </span>
      <span class="radar-legend-item"><span class="radar-legend-dot" style="background:#ef4444;"></span> Belum FU</span>
      <span class="radar-legend-item"><span class="radar-legend-dot" style="background:#f59e0b;"></span> Menunggu</span>
      <span class="radar-legend-item"><span class="radar-legend-dot" style="background:#8b5cf6;"></span> Tertarik</span>
      <span class="radar-legend-item"><span class="radar-legend-dot" style="background:#10b981;"></span> Selesai</span>
    `;
    mapEl.appendChild(legendEl);
  },

  getFilteredRadarLeads() {
    const currentRadiusKm = this.currentRadius || 1;
    const status = this.radarStatusFilter || 'all';
    const query = (this.radarQuery || '').toLowerCase().trim();
    const currentDist = (this.currentDistrict || 'all').toLowerCase().trim();
    const carFilter = (this.radarCarFilter || 'all').toLowerCase().trim();

    return (this.radarData || []).filter(c => {
      // 1. Canvasing Zone filter (if a specific zone is active)
      if (currentDist !== 'all' && currentDist !== '') {
        const itemDist = (c.district || '').toLowerCase();
        const itemAddr = (c.address || '').toLowerCase();
        const aliases = (this.ZONE_PRESETS[currentDist] && this.ZONE_PRESETS[currentDist].aliases) 
          ? this.ZONE_PRESETS[currentDist].aliases 
          : [currentDist];
        const matchDist = aliases.some(a => itemDist.includes(a) || itemAddr.includes(a));
        if (!matchDist) return false;
      }

      // 2. Car Model / Unit filter
      if (carFilter !== 'all' && carFilter !== '') {
        if (!this.matchCarModel((c.car_model || '') + ' ' + (c.last_car_model || ''), carFilter)) {
          return false;
        }
      }

      // 3. Radius filter (only applies when "Semua Wilayah" is active)
      if (currentDist === 'all' && currentRadiusKm < 999 && c.distance_km !== undefined && c.distance_km !== null) {
        if (c.distance_km > currentRadiusKm) return false;
      }

      // 4. Status filter
      if (status !== 'all') {
        const itemStatus = (c.status || 'Belum Dihubungi').trim();
        if (status === 'Belum Dihubungi') {
          if (itemStatus !== 'Belum Dihubungi' && itemStatus !== 'belum_fu' && itemStatus !== '') return false;
        } else if (status === 'Menunggu Respon') {
          if (!itemStatus.toLowerCase().includes('menunggu')) return false;
        } else if (status === 'Tertarik / Jadwal Servis') {
          if (!itemStatus.toLowerCase().includes('tertarik') && !itemStatus.toLowerCase().includes('servis')) return false;
        } else if (status === 'Deal / Selesai') {
          if (!itemStatus.toLowerCase().includes('deal') && !itemStatus.toLowerCase().includes('selesai') && !itemStatus.toLowerCase().includes('spk')) return false;
        } else if (status === 'Tidak Tertarik') {
          if (!itemStatus.toLowerCase().includes('tidak') && !itemStatus.toLowerCase().includes('batal') && !itemStatus.toLowerCase().includes('menolak')) return false;
        } else {
          if (itemStatus !== status) return false;
        }
      }

      // 5. Comprehensive search filter (Nama, Alamat, Kendaraan, Plat, Telp)
      if (query) {
        const tokens = query.split(/\s+/).filter(Boolean);
        const combinedText = [
          c.name || '',
          c.address || '',
          c.district || '',
          c.car_model || '',
          c.last_car_model || '',
          c.plate_number || '',
          c.phone || ''
        ].join(' ').toLowerCase();

        const allMatch = tokens.every(tok => combinedText.includes(tok));
        if (!allMatch) return false;
      }
      return true;
    });
  },

  updateRadarMapPins() {
    if (!this.leafletMap || !this.radarMarkersLayer) return;
    this.radarMarkersLayer.clearLayers();

    const filteredLeads = this.getFilteredRadarLeads();

    // RENDER ALL CUSTOMERS DIRECTLY ON MAP (NO CLUSTERING GROUP)
    const mapPins = filteredLeads;

    const pinBadge = document.getElementById('radarMapPinCount');
    if (pinBadge) {
      const carLabel = (this.radarCarFilter && this.radarCarFilter !== 'all') ? ` • ${this.radarCarFilter.toUpperCase()}` : '';
      const distLabel = (this.currentDistrict && this.currentDistrict !== 'all') ? ` • ${this.getZoneLabel(this.currentDistrict)}` : '';
      pinBadge.textContent = filteredLeads.length > 0
        ? `Menampilkan ${filteredLeads.length.toLocaleString('id-ID')} Customer Langsung${distLabel}${carLabel}`
        : '0 Customer';
    }

    const markersToBatch = [];

    mapPins.forEach(c => {
      let pinBg = '#ef4444'; // Belum Dihubungi
      let pinIcon = 'fa-car';
      if (c.status === 'Deal / Selesai') {
        pinBg = '#10b981';
        pinIcon = 'fa-check';
      } else if (c.status === 'Tertarik / Jadwal Servis') {
        pinBg = '#8b5cf6';
        pinIcon = 'fa-calendar';
      } else if (c.status === 'Menunggu Respon') {
        pinBg = '#f59e0b';
        pinIcon = 'fa-clock';
      }

      const customIcon = L.divIcon({
        className: 'radar-leaflet-pin-wrap',
        html: `
          <div class="radar-map-marker-pin" style="background:${pinBg};">
            <i class="fa-solid ${pinIcon}"></i>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -14]
      });

      const navUrl = `https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lng}`;
      const initials = (c.name || 'C').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const distLabel = c.formatted_distance || (c.distance_km + ' km');

      const waHref = c.phone && c.phone !== '-'
        ? `https://wa.me/${c.phone}?text=${encodeURIComponent('Halo Bapak/Ibu ' + c.name + ', perkenalkan saya dari Tunas Toyota Kiara Condong. Kebetulan saya sedang ada agenda kanvasing di sekitar ' + (c.district || 'area Bapak/Ibu') + '. Apakah ada waktu luang sebentar jika saya mampir untuk update info promo atau konsultasi unit Toyota?')}`
        : '';

      const popupHtml = `
        <div class="radar-popup-card">
          <div class="radar-popup-header">
            <div class="radar-popup-avatar" style="background:${pinBg};">${escapeHtml(initials)}</div>
            <div>
              <h4 class="radar-popup-name">${escapeHtml(c.name)}</h4>
              <div class="radar-popup-dist">
                <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(c.district)} 
                <span class="radar-popup-dist-pill">${distLabel}</span>
              </div>
              ${c.address ? `
                <div style="font-size:10.5px; color:#475569; margin-top:3px; line-height:1.3; max-width:240px;">
                  <i class="fa-solid fa-house-chimney" style="color:#0284c7; font-size:10px;"></i> ${escapeHtml(c.address)}
                </div>
              ` : ''}
            </div>
          </div>
          
          <div class="radar-popup-car-box">
            <div style="font-weight:800; color:#0f172a; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-car-side" style="color:#2563eb;"></i> ${escapeHtml(c.car_model || 'Toyota')}
              ${c.plate_number ? `<span style="font-size:10px; background:#f1f5f9; color:#475569; padding:1px 5px; border-radius:4px; font-weight:700;">${escapeHtml(c.plate_number)}</span>` : ''}
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px; font-size:11px;">
              <span style="color:#64748b;">Status: <b style="color:${pinBg};">${escapeHtml(c.status || 'Belum Dihubungi')}</b></span>
              <span style="color:#d7123a; font-weight:800;">${escapeHtml(c.priority || 'Warm')}</span>
            </div>
          </div>

          <div class="radar-popup-actions">
            ${waHref ? `
              <a href="${waHref}" target="_blank" class="btn-popup-wa">
                <i class="fa-brands fa-whatsapp"></i> WA
              </a>
            ` : ''}
            <a href="${navUrl}" target="_blank" class="btn-popup-maps">
              <i class="fa-solid fa-diamond-turn-right"></i> Maps
            </a>
            <button onclick="SalesSuperpowers.openRadarFollowupModal(${c.id})" class="btn-popup-fu">
              <i class="fa-solid fa-clipboard-check"></i> FU
            </button>
          </div>
        </div>
      `;

      const marker = L.marker([c.lat, c.lng], { icon: customIcon }).bindPopup(popupHtml);
      marker.bindTooltip(`<b>${escapeHtml(c.name)}</b> • ${escapeHtml(c.district)} (${distLabel})`, { direction: 'top', offset: [0, -12] });
      markersToBatch.push(marker);
    });

    markersToBatch.forEach(m => this.radarMarkersLayer.addLayer(m));

    // Auto-fit bounds if a specific territory or car filter is selected so all territory markers are nicely framed
    if ((this.currentDistrict !== 'all' || this.radarCarFilter !== 'all') && markersToBatch.length > 0 && this.leafletMap) {
      try {
        const groupBounds = L.featureGroup(markersToBatch).getBounds();
        if (groupBounds.isValid()) {
          this.leafletMap.fitBounds(groupBounds.pad(0.12), { maxZoom: 15 });
        }
      } catch (e) {
        console.warn('fitBounds error', e);
      }
    }
  },

  handleRadarStatusFilter(statusVal) {
    this.radarStatusFilter = statusVal || 'all';
    this.radarRenderLimit = 48;
    this.applyRadarFilter();
  },

  filterRadarLeads(query) {
    this.radarQuery = (query || '').toLowerCase().trim();
    this.radarRenderLimit = 48;
    this.applyRadarFilter();
  },

  loadMoreRadarCards() {
    this.radarRenderLimit = (this.radarRenderLimit || 48) + 48;
    this.renderRadarCardsGrid(this.getFilteredRadarLeads());
  },

  applyRadarFilter() {
    // 1. Update active class on status pills
    document.querySelectorAll('.radar-status-pill').forEach(pill => {
      const val = pill.getAttribute('data-status') || '';
      if (val === this.radarStatusFilter) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    const filtered = this.getFilteredRadarLeads();

    // 2. Update count badge & subtitle
    const badge = document.getElementById('radarCountBadge');
    if (badge) badge.textContent = `${filtered.length.toLocaleString('id-ID')} Customer`;

    const sub = document.getElementById('radarRadiusSubtitle');
    if (sub) {
      const currentRadiusKm = this.currentRadius || 1;
      const isZoneSelected = this.currentDistrict && this.currentDistrict !== 'all';
      const isCarSelected = this.radarCarFilter && this.radarCarFilter !== 'all';
      const zoneLabel = this.getZoneLabel(this.currentDistrict);
      const carLabel = isCarSelected ? (this.radarCarFilter.toUpperCase()) : '';

      let filterDesc = [];
      if (isZoneSelected) filterDesc.push(`Wilayah: <b>${escapeHtml(zoneLabel)}</b>`);
      if (isCarSelected) filterDesc.push(`Unit: <b>${escapeHtml(carLabel)}</b>`);
      if (this.radarStatusFilter !== 'all') filterDesc.push(`Status: <b>${escapeHtml(this.radarStatusFilter)}</b>`);
      if (this.radarQuery) filterDesc.push(`Cari: "<b>${escapeHtml(this.radarQuery)}</b>"`);

      sub.innerHTML = filterDesc.length > 0
        ? `Filter Aktif: ${filterDesc.join(' • ')} (${filtered.length.toLocaleString('id-ID')} Customer).`
        : `Diurutkan dari jarak terdekat ke posisi GPS Anda (${currentRadiusKm < 999 ? 'Radius: ' + currentRadiusKm + ' km' : 'Semua Wilayah'}).`;
    }

    // 3. Update status pills counts based on active District + Car + Query segment
    const currentRadiusKm = this.currentRadius || 1;
    const currentDist = (this.currentDistrict || 'all').toLowerCase().trim();
    const carFilter = (this.radarCarFilter || 'all').toLowerCase().trim();
    const query = (this.radarQuery || '').toLowerCase().trim();

    const segmentLeads = (this.radarData || []).filter(c => {
      if (currentDist !== 'all' && currentDist !== '') {
        const itemDist = (c.district || '').toLowerCase();
        const itemAddr = (c.address || '').toLowerCase();
        const aliases = (this.ZONE_PRESETS[currentDist] && this.ZONE_PRESETS[currentDist].aliases) ? this.ZONE_PRESETS[currentDist].aliases : [currentDist];
        if (!aliases.some(a => itemDist.includes(a) || itemAddr.includes(a))) return false;
      }
      if (carFilter !== 'all' && carFilter !== '') {
        if (!this.matchCarModel((c.car_model || '') + ' ' + (c.last_car_model || ''), carFilter)) return false;
      }
      if (currentDist === 'all' && currentRadiusKm < 999 && c.distance_km !== undefined && c.distance_km !== null) {
        if (c.distance_km > currentRadiusKm) return false;
      }
      if (query) {
        const tokens = query.split(/\s+/).filter(Boolean);
        const combinedText = [c.name||'', c.address||'', c.district||'', c.car_model||'', c.last_car_model||'', c.plate_number||'', c.phone||''].join(' ').toLowerCase();
        if (!tokens.every(tok => combinedText.includes(tok))) return false;
      }
      return true;
    });

    const countAll = segmentLeads.length;
    const countBelum = segmentLeads.filter(c => !c.status || c.status === 'Belum Dihubungi' || c.status === 'belum_fu').length;
    const countMenunggu = segmentLeads.filter(c => c.status === 'Menunggu Respon' || (c.status && c.status.toLowerCase().includes('menunggu'))).length;
    const countTertarik = segmentLeads.filter(c => c.status === 'Tertarik / Jadwal Servis' || (c.status && c.status.toLowerCase().includes('tertarik'))).length;
    const countDeal = segmentLeads.filter(c => c.status === 'Deal / Selesai' || (c.status && c.status.toLowerCase().includes('deal'))).length;

    const pillAll = document.querySelector('.radar-status-pill[data-status="all"]');
    if (pillAll) pillAll.innerHTML = `Semua (${countAll.toLocaleString('id-ID')})`;

    const pillBelum = document.querySelector('.radar-status-pill[data-status="Belum Dihubungi"]');
    if (pillBelum) pillBelum.innerHTML = `<span class="status-dot dot-red"></span> Belum Dihubungi (${countBelum.toLocaleString('id-ID')})`;

    const pillMenunggu = document.querySelector('.radar-status-pill[data-status="Menunggu Respon"]');
    if (pillMenunggu) pillMenunggu.innerHTML = `<span class="status-dot dot-yellow"></span> Menunggu Respon (${countMenunggu.toLocaleString('id-ID')})`;

    const pillTertarik = document.querySelector('.radar-status-pill[data-status="Tertarik / Jadwal Servis"]');
    if (pillTertarik) pillTertarik.innerHTML = `<span class="status-dot dot-purple"></span> Tertarik / Servis (${countTertarik.toLocaleString('id-ID')})`;

    const pillDeal = document.querySelector('.radar-status-pill[data-status="Deal / Selesai"]');
    if (pillDeal) pillDeal.innerHTML = `<span class="status-dot dot-green"></span> Deal / Selesai (${countDeal.toLocaleString('id-ID')})`;

    // 4. Update cards grid only
    this.renderRadarCardsGrid(filtered);

    // 5. Update map pins
    this.updateRadarMapPins();
  },

  renderRadarLeadCards(leads) {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    this.radarRenderLimit = 48;
    const currentRadiusKm = this.currentRadius || 5;
    const currentDist = (this.currentDistrict || 'all').toLowerCase().trim();
    const carFilter = (this.radarCarFilter || 'all').toLowerCase().trim();
    const query = (this.radarQuery || '').toLowerCase().trim();

    const segmentLeads = (this.radarData || []).filter(c => {
      if (currentDist !== 'all' && currentDist !== '') {
        const itemDist = (c.district || '').toLowerCase();
        const itemAddr = (c.address || '').toLowerCase();
        const aliases = (this.ZONE_PRESETS[currentDist] && this.ZONE_PRESETS[currentDist].aliases) ? this.ZONE_PRESETS[currentDist].aliases : [currentDist];
        if (!aliases.some(a => itemDist.includes(a) || itemAddr.includes(a))) return false;
      }
      if (carFilter !== 'all' && carFilter !== '') {
        if (!this.matchCarModel((c.car_model || '') + ' ' + (c.last_car_model || ''), carFilter)) return false;
      }
      if (currentDist === 'all' && currentRadiusKm < 999 && c.distance_km !== undefined && c.distance_km !== null) {
        if (c.distance_km > currentRadiusKm) return false;
      }
      if (query) {
        const tokens = query.split(/\s+/).filter(Boolean);
        const combinedText = [c.name||'', c.address||'', c.district||'', c.car_model||'', c.last_car_model||'', c.plate_number||'', c.phone||''].join(' ').toLowerCase();
        if (!tokens.every(tok => combinedText.includes(tok))) return false;
      }
      return true;
    });

    const countAll = segmentLeads.length;
    const countBelum = segmentLeads.filter(c => !c.status || c.status === 'Belum Dihubungi' || c.status === 'belum_fu').length;
    const countMenunggu = segmentLeads.filter(c => c.status === 'Menunggu Respon' || (c.status && c.status.toLowerCase().includes('menunggu'))).length;
    const countTertarik = segmentLeads.filter(c => c.status === 'Tertarik / Jadwal Servis' || (c.status && c.status.toLowerCase().includes('tertarik'))).length;
    const countDeal = segmentLeads.filter(c => c.status === 'Deal / Selesai' || (c.status && c.status.toLowerCase().includes('deal'))).length;

    const filtered = this.getFilteredRadarLeads();

    const isZoneSelected = this.currentDistrict && this.currentDistrict !== 'all';
    const isCarSelected = this.radarCarFilter && this.radarCarFilter !== 'all';
    const zoneLabel = this.getZoneLabel(this.currentDistrict);
    const carLabel = isCarSelected ? (this.radarCarFilter.toUpperCase()) : '';

    let filterDesc = [];
    if (isZoneSelected) filterDesc.push(`Wilayah: <b>${escapeHtml(zoneLabel)}</b>`);
    if (isCarSelected) filterDesc.push(`Unit: <b>${escapeHtml(carLabel)}</b>`);
    if (this.radarStatusFilter !== 'all') filterDesc.push(`Status: <b>${escapeHtml(this.radarStatusFilter)}</b>`);
    if (this.radarQuery) filterDesc.push(`Cari: "<b>${escapeHtml(this.radarQuery)}</b>"`);

    const hasAnyActiveFilter = isZoneSelected || isCarSelected || this.radarStatusFilter !== 'all' || !!this.radarQuery;

    let html = `
      <div class="radar-leads-header-bar" style="margin-bottom:12px;">
        <div>
          <h4 style="font-size:15px; font-weight:800; color:#0f172a; margin:0; display:flex; align-items:center; gap:8px;">
            <i class="fa-solid fa-bullseye" style="color:#d7123a;"></i> 
            Daftar Pelanggan Terdekat 
            <span class="radar-count-badge" id="radarCountBadge">${filtered.length.toLocaleString('id-ID')} Customer</span>
          </h4>
          <p style="font-size:12px; color:#64748b; margin:3px 0 0 0;" id="radarRadiusSubtitle">
            ${filterDesc.length > 0 
              ? `Filter Aktif: ${filterDesc.join(' • ')} (${filtered.length.toLocaleString('id-ID')} Customer).`
              : `Diurutkan dari jarak terdekat ke posisi GPS Anda (${currentRadiusKm < 999 ? 'Radius: ' + currentRadiusKm + ' km' : 'Semua Wilayah'}).`}
          </p>
        </div>
      </div>

      <!-- Comprehensive Multi-Filter Bar: Search + Wilayah + Unit Mobil -->
      <div class="radar-filter-panel">
        <div style="display:flex; flex-direction:column; gap:10px;">
          <!-- Search Input & Reset Button -->
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <div style="position:relative; flex:1; min-width:240px;">
              <i class="fa-solid fa-magnifying-glass" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:12px; color:#64748b;"></i>
              <input type="text" id="radarCardFilterInput" placeholder="Cari nama customer, alamat, jalan, unit mobil (misal: Avanza), plat..." class="radar-card-filter-input" style="padding-left:34px; padding-right:32px; height:38px; border-radius:10px; border:1.5px solid #cbd5e1; font-size:12.5px; width:100%; box-sizing:border-box;" value="${escapeHtml(this.radarQuery || '')}" oninput="SalesSuperpowers.filterRadarLeads(this.value)">
              ${this.radarQuery ? `
                <button type="button" onclick="SalesSuperpowers.clearRadarQuery()" style="position:absolute; right:10px; top:50%; transform:translateY(-50%); border:none; background:transparent; color:#94a3b8; cursor:pointer; font-size:14px; padding:2px;" title="Hapus pencarian">
                  <i class="fa-solid fa-circle-xmark"></i>
                </button>
              ` : ''}
            </div>

            <!-- Reset Filter Button -->
            ${hasAnyActiveFilter ? `
              <button type="button" class="btn-reset-filters" onclick="SalesSuperpowers.resetAllRadarFilters()" title="Reset semua filter ke default">
                <i class="fa-solid fa-rotate-left"></i> Reset Filter
              </button>
            ` : ''}
          </div>

          <!-- Dropdowns for Wilayah & Model Kendaraan -->
          <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
            <!-- Filter Wilayah Dropdown -->
            <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:180px;">
              <span style="font-size:11.5px; font-weight:800; color:#334155; display:inline-flex; align-items:center; gap:5px; white-space:nowrap;">
                <i class="fa-solid fa-map-location-dot" style="color:#d7123a;"></i> Wilayah:
              </span>
              <select id="radarFilterDistrictSelect" class="radar-select-dropdown" onchange="SalesSuperpowers.handleZoneChange(this.value)" style="width:100%;">
                <option value="all" ${this.currentDistrict === 'all' ? 'selected' : ''}>🌍 Semua Wilayah (Bandung Raya)</option>
                <optgroup label="Wilayah Populer Kanvasing">
                  <option value="bojongsoang" ${this.currentDistrict === 'bojongsoang' ? 'selected' : ''}>Bojongsoang (100+ Customer)</option>
                  <option value="buahbatu" ${this.currentDistrict === 'buahbatu' ? 'selected' : ''}>Buahbatu</option>
                  <option value="kircon" ${this.currentDistrict === 'kircon' ? 'selected' : ''}>Kiaracondong</option>
                  <option value="sukajadi" ${this.currentDistrict === 'sukajadi' ? 'selected' : ''}>Sukajadi</option>
                  <option value="pasteur" ${this.currentDistrict === 'pasteur' ? 'selected' : ''}>Pasteur</option>
                  <option value="dago" ${this.currentDistrict === 'dago' ? 'selected' : ''}>Dago / Coblong</option>
                  <option value="baleendah" ${this.currentDistrict === 'baleendah' ? 'selected' : ''}>Baleendah</option>
                  <option value="cileunyi" ${this.currentDistrict === 'cileunyi' ? 'selected' : ''}>Cileunyi</option>
                  <option value="antapani" ${this.currentDistrict === 'antapani' ? 'selected' : ''}>Antapani</option>
                  <option value="gedebage" ${this.currentDistrict === 'gedebage' ? 'selected' : ''}>Gedebage</option>
                  <option value="kopo" ${this.currentDistrict === 'kopo' ? 'selected' : ''}>Kopo</option>
                  <option value="cimahi" ${this.currentDistrict === 'cimahi' ? 'selected' : ''}>Cimahi</option>
                  <option value="soreang" ${this.currentDistrict === 'soreang' ? 'selected' : ''}>Soreang</option>
                </optgroup>
                <optgroup id="radarCardsOptgroupAllDistricts" label="Kecamatan Lainnya">
                  <!-- Populated dynamically from API -->
                </optgroup>
              </select>
            </div>

            <!-- Filter Unit / Mobil Dropdown -->
            <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:180px;">
              <span style="font-size:11.5px; font-weight:800; color:#334155; display:inline-flex; align-items:center; gap:5px; white-space:nowrap;">
                <i class="fa-solid fa-car-side" style="color:#2563eb;"></i> Unit Mobil:
              </span>
              <select id="radarFilterCarSelect" class="radar-select-dropdown" onchange="SalesSuperpowers.handleCarFilter(this.value)" style="width:100%;">
                <option value="all" ${this.radarCarFilter === 'all' ? 'selected' : ''}>🚗 Semua Unit Kendaraan</option>
                <option value="avanza" ${this.radarCarFilter === 'avanza' ? 'selected' : ''}>Toyota Avanza (Semua Tipe)</option>
                <option value="innova" ${this.radarCarFilter === 'innova' ? 'selected' : ''}>Toyota Innova / Zenix</option>
                <option value="rush" ${this.radarCarFilter === 'rush' ? 'selected' : ''}>Toyota Rush</option>
                <option value="calya" ${this.radarCarFilter === 'calya' ? 'selected' : ''}>Toyota Calya</option>
                <option value="fortuner" ${this.radarCarFilter === 'fortuner' ? 'selected' : ''}>Toyota Fortuner</option>
                <option value="veloz" ${this.radarCarFilter === 'veloz' ? 'selected' : ''}>Toyota Veloz</option>
                <option value="agya" ${this.radarCarFilter === 'agya' ? 'selected' : ''}>Toyota Agya</option>
                <option value="raize" ${this.radarCarFilter === 'raize' ? 'selected' : ''}>Toyota Raize</option>
                <option value="yaris" ${this.radarCarFilter === 'yaris' ? 'selected' : ''}>Toyota Yaris / Cross</option>
                <option value="hilux" ${this.radarCarFilter === 'hilux' ? 'selected' : ''}>Toyota Hilux</option>
                <option value="alphard" ${this.radarCarFilter === 'alphard' ? 'selected' : ''}>Toyota Alphard / Vellfire</option>
                <option value="sienta" ${this.radarCarFilter === 'sienta' ? 'selected' : ''}>Toyota Sienta</option>
                <option value="hiace" ${this.radarCarFilter === 'hiace' ? 'selected' : ''}>Toyota Hiace</option>
                <option value="vios" ${this.radarCarFilter === 'vios' ? 'selected' : ''}>Toyota Vios</option>
                <option value="camry" ${this.radarCarFilter === 'camry' ? 'selected' : ''}>Toyota Camry</option>
                <option value="altis" ${this.radarCarFilter === 'altis' ? 'selected' : ''}>Toyota Corolla Altis</option>
                <option value="voxy" ${this.radarCarFilter === 'voxy' ? 'selected' : ''}>Toyota Voxy</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Status Filter Pills -->
      <div class="radar-status-filter-strip">
        <button type="button" class="radar-status-pill ${this.radarStatusFilter === 'all' ? 'active' : ''}" data-status="all" onclick="SalesSuperpowers.handleRadarStatusFilter('all')">
          Semua (${countAll.toLocaleString('id-ID')})
        </button>
        <button type="button" class="radar-status-pill ${this.radarStatusFilter === 'Belum Dihubungi' ? 'active' : ''}" data-status="Belum Dihubungi" onclick="SalesSuperpowers.handleRadarStatusFilter('Belum Dihubungi')">
          <span class="status-dot dot-red"></span> Belum Dihubungi (${countBelum.toLocaleString('id-ID')})
        </button>
        <button type="button" class="radar-status-pill ${this.radarStatusFilter === 'Menunggu Respon' ? 'active' : ''}" data-status="Menunggu Respon" onclick="SalesSuperpowers.handleRadarStatusFilter('Menunggu Respon')">
          <span class="status-dot dot-yellow"></span> Menunggu Respon (${countMenunggu.toLocaleString('id-ID')})
        </button>
        <button type="button" class="radar-status-pill ${this.radarStatusFilter === 'Tertarik / Jadwal Servis' ? 'active' : ''}" data-status="Tertarik / Jadwal Servis" onclick="SalesSuperpowers.handleRadarStatusFilter('Tertarik / Jadwal Servis')">
          <span class="status-dot dot-purple"></span> Tertarik / Servis (${countTertarik.toLocaleString('id-ID')})
        </button>
        <button type="button" class="radar-status-pill ${this.radarStatusFilter === 'Deal / Selesai' ? 'active' : ''}" data-status="Deal / Selesai" onclick="SalesSuperpowers.handleRadarStatusFilter('Deal / Selesai')">
          <span class="status-dot dot-green"></span> Deal / Selesai (${countDeal.toLocaleString('id-ID')})
        </button>
      </div>

      <div id="radarCardsGridContainer"></div>
    `;

    listContainer.innerHTML = html;
    this.renderRadarCardsGrid(filtered);
  },

  renderRadarCardsGrid(leads) {
    const gridContainer = document.getElementById('radarCardsGridContainer');
    if (!gridContainer) return;

    if (!leads || leads.length === 0) {
      gridContainer.innerHTML = `
        <div class="radar-empty-state" style="padding:30px 16px;">
          <div class="radar-empty-icon" style="width:46px; height:46px; font-size:20px;">
            <i class="fa-solid fa-filter-circle-xmark"></i>
          </div>
          <h4 class="radar-empty-title" style="font-size:14px;">Tidak Ada Customer dengan Status Terpilih</h4>
          <p class="radar-empty-desc" style="font-size:11.5px;">Coba pilih status lain (misal "Semua" atau "Belum Dihubungi") atau sesuaikan radius jangkauan.</p>
        </div>
      `;
      return;
    }

    const currentLimit = this.radarRenderLimit || 48;
    const visibleLeads = leads.slice(0, currentLimit);
    const hasMore = leads.length > currentLimit;

    let cardsHtml = `<div class="radar-leads-grid">`;

    visibleLeads.forEach((item) => {
      const initials = (item.name || 'C').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      let statusColor = '#ef4444';
      if (item.status === 'Deal / Selesai') statusColor = '#10b981';
      else if (item.status === 'Tertarik / Jadwal Servis') statusColor = '#8b5cf6';
      else if (item.status === 'Menunggu Respon') statusColor = '#f59e0b';

      const waHref = item.phone && item.phone !== '-'
        ? `https://wa.me/${item.phone}?text=${encodeURIComponent('Halo Bapak/Ibu ' + item.name + ', perkenalkan saya dari Tunas Toyota Kiara Condong. Kebetulan saya sedang ada agenda kanvasing di sekitar ' + (item.district || 'area Bapak/Ibu') + '. Apakah ada waktu luang sebentar jika saya mampir untuk update info promo atau konsultasi unit Toyota?')}`
        : '';

      cardsHtml += `
        <div class="radar-lead-card-deluxe" style="border-left: 4px solid ${statusColor};">
          <div>
            <div class="radar-card-header">
              <div class="radar-customer-profile">
                <div class="radar-avatar-circle" style="background:#0f172a;">${initials}</div>
                <div>
                  <h4 class="radar-customer-name">${escapeHtml(item.name)}</h4>
                  <div class="radar-district-tag">
                    <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)}
                  </div>
                  ${item.address ? `
                    <div style="font-size:11px; color:#64748b; margin-top:3px; max-width:220px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(item.address)}">
                      <i class="fa-solid fa-house-chimney" style="color:#94a3b8; font-size:10px;"></i> ${escapeHtml(item.address)}
                    </div>
                  ` : ''}
                </div>
              </div>
              <div class="radar-dist-chip">
                <i class="fa-solid fa-route"></i> ${item.formatted_distance || (item.distance_km + ' km')}
              </div>
            </div>

            <div class="radar-vehicle-box">
              <div class="radar-vehicle-row">
                <i class="fa-solid fa-car-side" style="color:#d7123a;"></i>
                <span><b>Unit:</b> <span style="font-weight:800; color:#0f172a;">${escapeHtml(item.car_model || 'Toyota')}</span> ${item.plate_number ? `<span style="font-size:10.5px; background:#f1f5f9; color:#334155; padding:2px 6px; border-radius:4px; font-weight:800; margin-left:4px;">${escapeHtml(item.plate_number)}</span>` : ''}</span>
              </div>
              <div class="radar-tags-row">
                <span class="radar-tag priority-${(item.priority||'').toLowerCase()}">Prioritas: <b>${escapeHtml(item.priority || 'Warm')}</b></span>
                <span class="radar-tag status-tag" style="color:${statusColor}; background:${statusColor}15; border-color:${statusColor}30;">${escapeHtml(item.status || 'Belum Dihubungi')}</span>
              </div>
              ${item.visit_photo ? `
                <div style="margin-top:8px;">
                  <span style="font-size:11px; font-weight:800; color:#059669; display:block; margin-bottom:3px;"><i class="fa-solid fa-camera"></i> Bukti Kunjungan:</span>
                  <img src="${item.visit_photo}" style="width:100%; max-height:120px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0;">
                </div>
              ` : ''}
            </div>
          </div>

          <div class="radar-action-grid">
            <a href="${item.maps_url || ('https://www.google.com/maps/dir/?api=1&destination=' + item.lat + ',' + item.lng)}" target="_blank" class="btn-radar-map" title="Buka rute navigasi Google Maps">
              <i class="fa-solid fa-diamond-turn-right"></i> Rute Maps
            </a>
            ${waHref ? `
              <a href="${waHref}" target="_blank" class="btn-radar-wa-direct" title="Chat WhatsApp Customer">
                <i class="fa-brands fa-whatsapp"></i> WhatsApp
              </a>
            ` : ''}
            <button type="button" class="btn-radar-fu" onclick="SalesSuperpowers.openRadarFollowupModal(${item.id})" title="Catat hasil follow-up & foto">
              <i class="fa-solid fa-clipboard-check"></i> Catat FU
            </button>
          </div>
        </div>
      `;
    });

    cardsHtml += `</div>`;

    if (hasMore) {
      cardsHtml += `
        <div style="text-align:center; margin:22px 0 10px 0;">
          <button type="button" class="btn-radar-detect" style="padding:10px 24px; font-size:12.5px; border-radius:12px; margin:0 auto; cursor:pointer; background:#0f172a; box-shadow:0 4px 14px rgba(15,23,42,0.2);" onclick="SalesSuperpowers.loadMoreRadarCards()">
            <i class="fa-solid fa-chevron-down"></i> Tampilkan Lebih Banyak (Menampilkan ${visibleLeads.length} dari ${leads.length.toLocaleString('id-ID')} Customer)
          </button>
        </div>
      `;
    }

    gridContainer.innerHTML = cardsHtml;
  },

  openRadarFollowupModal(customerId) {
    const item = (this.radarData || []).find(x => x.id == customerId) || { id: customerId, name: 'Customer', district: '' };
    this.selectedPhotoFile = null;

    let modal = document.getElementById('radarFollowupModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'radarFollowupModal';
      modal.className = 'modal-overlay';
      modal.style.cssText = 'position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(15,23,42,0.75); backdrop-filter:blur(6px); z-index:99999; display:flex; align-items:center; justify-content:center; padding:16px;';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="background:#ffffff; border-radius:20px; max-width:480px; width:100%; max-height:90vh; overflow-y:auto; padding:20px; box-shadow:0 20px 50px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1.5px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
          <div>
            <h3 style="font-size:16px; font-weight:900; color:#0f172a; margin:0;">Follow Up &amp; Progress Kunjungan</h3>
            <p style="font-size:11.5px; color:#64748b; margin:2px 0 0 0;">${escapeHtml(item.name)} • <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)}</p>
          </div>
          <button onclick="SalesSuperpowers.closeRadarFollowupModal()" style="background:none; border:none; font-size:20px; color:#64748b; cursor:pointer;"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <form id="formRadarFollowup" onsubmit="event.preventDefault(); SalesSuperpowers.submitRadarFollowup(${item.id});">
          <div style="margin-bottom:14px;">
            <label style="font-weight:800; font-size:12px; color:#334155; margin-bottom:4px; display:block;">Status Follow Up Baru <span style="color:red;">*</span></label>
            <select id="radarFuStatusSelect" class="form-control" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:700;">
              <option value="Belum Dihubungi" ${item.status === 'Belum Dihubungi' ? 'selected' : ''}>Belum Dihubungi</option>
              <option value="Menunggu Respon" ${item.status === 'Menunggu Respon' ? 'selected' : ''}>Menunggu Respon / Janjian</option>
              <option value="Tertarik / Jadwal Servis" ${item.status === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>Tertarik / Servis</option>
              <option value="Deal / Selesai" ${item.status === 'Deal / Selesai' ? 'selected' : ''}>Deal / SPK</option>
              <option value="Tidak Tertarik" ${item.status === 'Tidak Tertarik' ? 'selected' : ''}>Tidak Tertarik / Batal</option>
            </select>
          </div>

          <!-- TAM Checklist Checkboxes -->
          <div style="background:#f8fafc; padding:12px; border-radius:12px; border:1px solid #e2e8f0; margin-bottom:14px;">
            <div style="font-size:11.5px; font-weight:800; color:#475569; margin-bottom:8px;"><i class="fa-solid fa-list-check" style="color:#2563eb;"></i> Verifikasi Respon Customer:</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:12px; font-weight:700; color:#334155;">
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuConn" checked> 1. No. Aktif</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuCont" checked> 2. Ada Respon</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuProsp"> 3. Minat Beli</label>
              <label style="display:flex; align-items:center; gap:6px; cursor:pointer;"><input type="checkbox" id="radarFuSpk"> 4. Closing SPK</label>
            </div>
          </div>

          <!-- Notes Textarea with Voice Dictation -->
          <div style="margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <label style="font-weight:800; font-size:12px; color:#334155; margin:0;">Catatan / Alasan Progress</label>
              <button type="button" class="btn-voice-pill" id="btnRadarVoiceMic" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; padding:4px 8px; border-radius:8px; font-size:11px; font-weight:800; cursor:pointer;">
                <i class="fa-solid fa-microphone"></i> Dikte Suara
              </button>
            </div>
            <textarea id="radarFuNotesText" rows="3" class="form-control" placeholder="Tuliskan hasil pembicaraan/kunjungan dengan customer..." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">${escapeHtml(item.reason_followup || '')}</textarea>
            <div id="radarVoiceStatusPill" style="display:none; font-size:11px; color:#2563eb; margin-top:4px;"></div>
          </div>

          <!-- Photo Proof Input & Preview -->
          <div style="margin-bottom:18px;">
            <label style="font-weight:800; font-size:12px; color:#334155; margin-bottom:6px; display:block;">📷 Foto Bukti Kunjungan / Lokasi Customer</label>
            <input type="file" id="radarVisitPhotoInput" accept="image/*" capture="environment" style="display:none;" onchange="SalesSuperpowers.handleRadarPhotoSelect(this)">
            
            <div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap;">
              <button type="button" onclick="document.getElementById('radarVisitPhotoInput').click()" style="background:#f1f5f9; color:#334155; border:1.5px dashed #cbd5e1; padding:10px 16px; border-radius:10px; font-size:12px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-camera" style="color:#d7123a; font-size:16px;"></i> Ambil / Upload Foto Lokasi
              </button>
            </div>

            <div id="radarPhotoPreviewWrap" style="margin-top:10px; ${item.visit_photo ? '' : 'display:none;'}">
              <div style="position:relative; display:inline-block; width:100%;">
                <img id="radarPhotoPreviewImg" src="${item.visit_photo || ''}" style="width:100%; max-height:160px; object-fit:cover; border-radius:12px; border:2px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                <button type="button" onclick="SalesSuperpowers.removeRadarPhoto()" style="position:absolute; top:6px; right:6px; background:#ef4444; color:#fff; border:none; width:26px; height:26px; border-radius:50%; cursor:pointer; font-size:12px; display:flex; align-items:center; justify-content:center;"><i class="fa-solid fa-xmark"></i></button>
              </div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:8px; border-top:1px solid #f1f5f9; padding-top:14px;">
            <button type="button" onclick="SalesSuperpowers.closeRadarFollowupModal()" class="btn-fu btn-fu-secondary" style="padding:8px 16px; font-size:12px;">Batal</button>
            <button type="submit" id="btnSubmitRadarFu" class="btn-fu btn-fu-crimson" style="padding:8px 18px; font-size:12px; font-weight:800;"><i class="fa-solid fa-floppy-disk"></i> Simpan Progress &amp; Foto</button>
          </div>
        </form>
      </div>
    `;

    modal.style.display = 'flex';
    this.initVoiceRecorder('radarFuNotesText', 'btnRadarVoiceMic', 'radarVoiceStatusPill');
  },

  closeRadarFollowupModal() {
    const modal = document.getElementById('radarFollowupModal');
    if (modal) modal.style.display = 'none';
  },

  handleRadarPhotoSelect(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    this.selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const wrap = document.getElementById('radarPhotoPreviewWrap');
      const img = document.getElementById('radarPhotoPreviewImg');
      if (img) img.src = e.target.result;
      if (wrap) wrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
  },

  removeRadarPhoto() {
    this.selectedPhotoFile = null;
    const input = document.getElementById('radarVisitPhotoInput');
    if (input) input.value = '';
    const wrap = document.getElementById('radarPhotoPreviewWrap');
    if (wrap) wrap.style.display = 'none';
  },

  async submitRadarFollowup(customerId) {
    const btn = document.getElementById('btnSubmitRadarFu');
    const origHtml = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';
    }

    try {
      const statusVal = document.getElementById('radarFuStatusSelect').value;
      const connVal = document.getElementById('radarFuConn').checked ? 'TRUE' : 'FALSE';
      const contVal = document.getElementById('radarFuCont').checked ? 'TRUE' : 'FALSE';
      const prospVal = document.getElementById('radarFuProsp').checked ? 'TRUE' : 'FALSE';
      const spkVal = document.getElementById('radarFuSpk').checked ? 'TRUE' : 'FALSE';
      const notesVal = document.getElementById('radarFuNotesText').value.trim();
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;

      const formData = new FormData();
      formData.append('id', customerId);
      formData.append('sales_id', salesId);
      formData.append('status', statusVal);
      formData.append('connected', connVal);
      formData.append('contacted', contVal);
      formData.append('prospect', prospVal);
      formData.append('spk', spkVal);
      formData.append('reason_followup', notesVal);

      if (this.selectedPhotoFile) {
        formData.append('visit_photo', this.selectedPhotoFile);
      }

      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=update_status`, {
        method: 'POST',
        body: formData
      });
      const json = await res.json();

      if (json.success) {
        this.closeRadarFollowupModal();
        if (window.showCustomAlert) {
          window.showCustomAlert('Progress Berhasil Disimpan', 'Status follow-up dan foto bukti kunjungan berhasil disimpan.', 'success');
        } else {
          alert('Progress follow-up berhasil disimpan!');
        }
        this.fetchRadarData(
          this.salesCoords ? this.salesCoords.lat : -6.9248,
          this.salesCoords ? this.salesCoords.lng : 107.6472,
          this.currentRadius,
          this.currentDistrict
        );
      } else {
        alert(json.message || 'Gagal menyimpan progress');
      }

    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origHtml;
      }
    }
  },

  filterRadarLeads(query) {
    if (!this.radarData || this.radarData.length === 0) return;
    const cleanQ = (query || '').toLowerCase().trim();
    if (!cleanQ) {
      this.renderRadarLeadCards(this.radarData);
      return;
    }

    const filtered = this.radarData.filter(item => {
      const name = (item.name || '').toLowerCase();
      const car = (item.car_model || '').toLowerCase();
      const district = (item.district || '').toLowerCase();
      return name.includes(cleanQ) || car.includes(cleanQ) || district.includes(cleanQ);
    });

    this.renderRadarLeadCards(filtered);
  },

  scanNearbyLeads(radiusKm = 5, containerId = 'followupDataContainer') {
    this.renderRadarCockpit(containerId, radiusKm);
  },

  // =========================================================================
  // 2. INSTANT QUOTATION TO PDF & WA SHARE
  // =========================================================================
  generateInstantQuoteText(data) {
    const namaSales = localStorage.getItem('namaSales') || 'Sales Consultant';
    const noHpSales = localStorage.getItem('noHpSales') || '0812-XXXX-XXXX';
    
    return `*PENAWARAN RESMI TUNAS TOYOTA KIARA CONDONG*
----------------------------------------
Kepada Yth. *Bpk/Ibu ${data.customerName || 'Calon Pelanggan'}*

Berikut adalah rincian penawaran harga & simulasi kredit terbaik untuk unit:
🚗 *Model:* ${data.carModel || 'Toyota All New'}
🏷️ *Tipe / Transmisi:* ${data.carType || 'OTR Jawa Barat'}
💰 *Harga OTR:* Rp ${Number(data.otr || 0).toLocaleString('id-ID')}
🎉 *Promo / Diskon Khusus:* Rp ${Number(data.discount || 0).toLocaleString('id-ID')}

*SIMULASI PAKET KREDIT:*
• *Total DP Dibayar:* Rp ${Number(data.totalDp || 0).toLocaleString('id-ID')}
• *Tenor:* ${data.tenor || 5} Tahun (${(data.tenor || 5) * 12}x Cicilan)
• *Angsuran Bulanan:* Rp ${Number(data.monthly || 0).toLocaleString('id-ID')} / bulan
• *Asuransi:* ${data.insurance || 'All Risk Full Tenor'}

*BONUS & BENEFIT PEMBELIAN:*
✅ Kaca Film Resmi Garansi 5 Th
✅ Karpet Set Original Toyota
✅ Kotak P3K, Segitiga Pengaman & APAR
✅ Gratis Jasa Servis & Oli Berkala (T-Care)
✅ Garansi Mesin 3 Th / 100.000 KM
✅ Layanan Derek Darurat 24 Jam

Untuk info test drive & pemesanan unit, silakan hubungi:
👤 *${namaSales}*
📞 *WA / Telp:* ${noHpSales}
🏢 *Tunas Toyota Kiara Condong Bandung*
_Alamat: Jl. Soekarno-Hatta No. 514, Bandung_`;
  },

  shareQuoteToWhatsApp(data) {
    const text = this.generateInstantQuoteText(data);
    const phone = data.customerPhone ? data.customerPhone.replace(/[^0-9]/g, '') : '';
    const cleanPhone = phone.startsWith('0') ? '62' + phone.slice(1) : (phone.startsWith('8') ? '62' + phone : phone);
    const waUrl = cleanPhone ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  },

  // =========================================================================
  // 3. SMART FOLLOW-UP MORNING BRIEFING & REMINDER
  // =========================================================================
  async checkDailyFollowupReminders() {
    try {
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=customers&sales_id=${salesId}`);
      const json = await res.json();
      
      if (json.status !== 'success' || !json.data) return;

      const todayStr = new Date().toISOString().split('T')[0];
      const dueList = json.data.filter(c => {
        if (!c.followup_date) return false;
        return c.followup_date.startsWith(todayStr) || (new Date(c.followup_date) < new Date() && c.followup_status !== 'Deal / SPK' && c.followup_status !== 'Selesai');
      });

      const container = document.getElementById('dailyFollowupBriefingContainer');
      if (container && dueList.length > 0) {
        container.innerHTML = `
          <div class="morning-briefing-banner">
            <div style="display:flex; align-items:center; gap:12px;">
              <div style="width:42px; height:42px; border-radius:12px; background:rgba(215,18,58,0.2); border:1.5px solid #d7123a; display:flex; align-items:center; justify-content:center; font-size:18px; color:#f43f5e;">
                <i class="fa-solid fa-bell"></i>
              </div>
              <div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <h4 style="font-size:14.5px; font-weight:800; margin:0; color:#ffffff;">Pengingat Agenda Hari Ini</h4>
                  <span class="briefing-badge">${dueList.length} Prospek Jatuh Tempo</span>
                </div>
                <p style="font-size:12px; color:rgba(255,255,255,0.8); margin:2px 0 0 0;">
                  Segera hubungi customer prioritas Anda hari ini untuk menjaga rasio konversi deal.
                </p>
              </div>
            </div>
            <a href="pages/customer.html" class="btn-fu btn-fu-crimson" style="padding:8px 16px; font-size:12px;">
              <i class="fa-solid fa-list-check"></i> Buka Agenda Follow-up
            </a>
          </div>
        `;
      }
    } catch (e) {
      console.warn('Follow-up reminder error', e);
    }
  },

  // =========================================================================
  // 3B. PODCAST VOICE MORNING BRIEFING SPV
  // =========================================================================
  briefingSpeech: null,
  briefingSpeaking: false,
  briefingPaused: false,
  briefingSpeed: 1.0,
  activeBriefingData: null,

  async loadTodayBriefingPodcast() {
    const container = document.getElementById('spvAiVoiceBriefingContainer');
    if (!container) return;

    try {
      const res = await fetch('api/api_briefing.php?action=get_today_briefing');
      const json = await res.json();
      if (json.status !== 'success' || !json.data) {
        return;
      }

      const b = json.data;
      this.activeBriefingData = b;

      const title = b.title || (b.briefing_type === 'morning' ? 'Morning Huddle & Kickoff' : 'Evening Closing Recap');
      const dateStr = b.briefing_date ? new Date(b.briefing_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) : 'Hari Ini';
      const isMorning = b.briefing_type === 'morning';
      const iconType = isMorning ? 'fa-sun' : 'fa-moon';
      const gradientBg = isMorning 
        ? 'linear-gradient(135deg, #0d1b3e 0%, #1e3a8a 60%, #c8102e 100%)' 
        : 'linear-gradient(135deg, #090d16 0%, #1e293b 60%, #334155 100%)';

      container.innerHTML = `
        <div style="background:${gradientBg}; border-radius:20px; padding:18px 20px; color:white; margin-bottom:18px; box-shadow:0 10px 28px rgba(13,27,62,0.25); position:relative; overflow:hidden; border:1px solid rgba(255,255,255,0.12);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
                <span style="background:rgba(239,68,68,0.25); color:#fca5a5; font-size:10.5px; font-weight:900; padding:3px 10px; border-radius:20px; text-transform:uppercase; border:1px solid rgba(239,68,68,0.4); display:inline-flex; align-items:center; gap:5px;">
                  <i class="fa-solid fa-microphone-lines"></i> PODCAST BRIEFING SPV
                </span>
                <span style="font-size:11px; color:#cbd5e1;"><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
              </div>
              <h3 style="font-size:15.5px; font-weight:800; margin:0 0 4px; color:#ffffff; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid ${iconType}" style="color:#fbbf24;"></i> ${title}
              </h3>
              <p style="font-size:11.5px; color:#e2e8f0; margin:0; line-height:1.5;">
                Arahan resmi dari <strong>${b.spv_name || 'Supervisor'}</strong> untuk seluruh wiraniaga.
              </p>
            </div>
            <div style="display:flex; gap:6px; align-items:center;">
              <span style="font-size:10.5px; color:#94a3b8; font-weight:700;">Speed:</span>
              <button type="button" class="btn-briefing-speed" onclick="SalesSuperpowers.setBriefingSpeed(1.0, this)" style="background:#38bdf8; border:1px solid #38bdf8; color:#0f172a; font-size:10px; font-weight:800; padding:2px 7px; border-radius:6px; cursor:pointer;">1.0x</button>
              <button type="button" class="btn-briefing-speed" onclick="SalesSuperpowers.setBriefingSpeed(1.2, this)" style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:white; font-size:10px; font-weight:700; padding:2px 7px; border-radius:6px; cursor:pointer;">1.2x</button>
              <button type="button" class="btn-briefing-speed" onclick="SalesSuperpowers.setBriefingSpeed(1.4, this)" style="background:rgba(255,255,255,0.15); border:1px solid rgba(255,255,255,0.3); color:white; font-size:10px; font-weight:700; padding:2px 7px; border-radius:6px; cursor:pointer;">1.4x</button>
            </div>
          </div>

          <!-- Controls Bar -->
          <div style="display:flex; gap:10px; align-items:center; margin-top:14px; flex-wrap:wrap;">
            <button type="button" id="btnDashPlayBriefing" onclick="SalesSuperpowers.toggleBriefingVoice()" style="background:linear-gradient(135deg, #22c55e 0%, #16a34a 100%); color:white; border:none; padding:9px 18px; border-radius:12px; font-size:12px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:8px; box-shadow:0 4px 12px rgba(34,197,94,0.35);">
              <i class="fa-solid fa-play" id="dashPlayIcon"></i> <span id="dashPlayText">Putar Audio Podcast</span>
            </button>
            <button type="button" onclick="SalesSuperpowers.stopBriefingVoice()" style="background:rgba(255,255,255,0.12); color:#cbd5e1; border:1px solid rgba(255,255,255,0.25); padding:9px 14px; border-radius:12px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-stop"></i> Stop
            </button>
            <button type="button" onclick="SalesSuperpowers.openBriefingTextModal()" style="background:rgba(255,255,255,0.15); color:white; border:1px solid rgba(255,255,255,0.25); padding:9px 14px; border-radius:12px; font-size:12px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:6px; margin-left:auto;">
              <i class="fa-solid fa-book-open"></i> Baca Teks
            </button>
          </div>
        </div>
      `;
    } catch (err) {
      console.warn('Load today briefing error:', err);
    }
  },

  setBriefingSpeed(speed, btn) {
    this.briefingSpeed = speed;
    document.querySelectorAll('.btn-briefing-speed').forEach(b => {
      b.style.background = 'rgba(255,255,255,0.15)';
      b.style.color = 'white';
      b.style.borderColor = 'rgba(255,255,255,0.3)';
    });
    if (btn) {
      btn.style.background = '#38bdf8';
      btn.style.color = '#0f172a';
      btn.style.borderColor = '#38bdf8';
    }
    if (this.briefingSpeaking && !this.briefingPaused) {
      this.stopBriefingVoice();
      this.playBriefingVoice();
    }
  },

  toggleBriefingVoice() {
    if (!this.activeBriefingData) return;

    if (this.briefingPaused) {
      window.speechSynthesis.resume();
      this.briefingPaused = false;
      this.briefingSpeaking = true;
      this.updateBriefingUi('playing');
      return;
    }

    if (this.briefingSpeaking) {
      window.speechSynthesis.pause();
      this.briefingPaused = true;
      this.updateBriefingUi('paused');
      return;
    }

    this.playBriefingVoice();
  },

  playBriefingVoice() {
    if (!this.activeBriefingData || !window.speechSynthesis) return;

    const rawText = this.activeBriefingData.content_text || '';
    const cleanText = rawText
      .replace(/[\*\_~`]/g, '')
      .replace(/[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu, '')
      .replace(/•/g, 'Poin: ')
      .replace(/\n\n+/g, '. ')
      .replace(/\n/g, ', ');

    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(cleanText);
    utt.lang = 'id-ID';
    utt.rate = this.briefingSpeed;
    utt.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => v.lang === 'id-ID' || v.lang.includes('id') || v.name.toLowerCase().includes('indonesia'));
    if (idVoice) utt.voice = idVoice;

    utt.onstart = () => {
      this.briefingSpeaking = true;
      this.briefingPaused = false;
      this.updateBriefingUi('playing');
    };

    utt.onend = () => {
      this.briefingSpeaking = false;
      this.briefingPaused = false;
      this.updateBriefingUi('idle');
    };

    utt.onerror = () => {
      this.briefingSpeaking = false;
      this.briefingPaused = false;
      this.updateBriefingUi('idle');
    };

    this.briefingSpeech = utt;
    window.speechSynthesis.speak(utt);
  },

  stopBriefingVoice() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.briefingSpeaking = false;
    this.briefingPaused = false;
    this.updateBriefingUi('idle');
  },

  updateBriefingUi(state) {
    const icon = document.getElementById('dashPlayIcon');
    const text = document.getElementById('dashPlayText');
    const btn = document.getElementById('btnDashPlayBriefing');
    if (!icon || !text || !btn) return;

    if (state === 'playing') {
      icon.className = 'fa-solid fa-pause';
      text.textContent = 'Jeda Podcast';
      btn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
    } else if (state === 'paused') {
      icon.className = 'fa-solid fa-play';
      text.textContent = 'Lanjut Putar';
      btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    } else {
      icon.className = 'fa-solid fa-play';
      text.textContent = 'Putar Audio Podcast';
      btn.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
    }
  },

  openBriefingTextModal() {
    if (!this.activeBriefingData) return;
    const b = this.activeBriefingData;
    const dateStr = b.briefing_date ? new Date(b.briefing_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : 'Hari Ini';

    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: `<div style="font-size:16px; font-weight:800; color:#0f172a;">${b.title}</div><div style="font-size:12px; color:#64748b; font-weight:500;">Oleh: ${b.spv_name} • ${dateStr}</div>`,
        html: `<div style="text-align:left; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:16px; font-size:12px; line-height:1.7; color:#1e293b; max-height:350px; overflow-y:auto; white-space:pre-wrap;">${b.content_text}</div>`,
        confirmButtonText: 'Tutup',
        confirmButtonColor: '#0d1b3e'
      });
    } else {
      alert(b.content_text);
    }
  },

  // =========================================================================
  // 4. SCAN KTP & STNK OTOMATIS (OCR)
  // =========================================================================
  // 4. SMART AI OCR SCANNER (KAMERA LIVE & DOKUMEN KTP / KK)
  // =========================================================================
  ocrDocType: 'ktp', // 'ktp' atau 'kk'
  ocrSource: 'camera', // 'camera' atau 'upload'
  cameraStream: null,
  currentFacingMode: 'environment', // 'environment' (belakang) atau 'user' (depan)
  capturedImageBase64: null,
  extractedOcrData: null,
  ocrAutoScanEnabled: true,
  autoScanTimer: null,
  stabilityCount: 0,
  prevSampleData: null,
  isProcessingOcr: false,

  currentTargetFields: null,

  openOcrModal(docType = 'ktp') {
    this.ocrDocType = docType;
    const modal = document.getElementById('smartOcrModal');
    if (!modal) return;

    modal.style.display = 'flex';
    this.setOcrDocType(docType);
    this.setOcrSource('camera');
    this.updateEngineBadge();
  },

  closeOcrModal(e) {
    if (e && e.target && e.target.id !== 'smartOcrModal') return;
    this.stopAutoScanLoop();
    this.stopCameraStream();
    const modal = document.getElementById('smartOcrModal');
    if (modal) modal.style.display = 'none';
  },

  promptApiKey() {
    const current = localStorage.getItem('sft_gemini_api_key') || '';
    const key = prompt('Kunci Google Gemini AI Vision:\nBiarkan kosong untuk menggunakan Kunci Sistem Bawaan.', current);
    if (key !== null) {
      if (key.trim()) {
        localStorage.setItem('sft_gemini_api_key', key.trim());
        if (window.showCustomAlert) {
          window.showCustomAlert('Gemini AI Aktif', 'Kunci khusus Gemini AI berhasil disimpan.', 'success');
        } else {
          alert('Kunci khusus Gemini AI berhasil disimpan.');
        }
      } else {
        localStorage.removeItem('sft_gemini_api_key');
        if (window.showCustomAlert) {
          window.showCustomAlert('Kunci Bawaan Aktif', 'Menggunakan kunci Gemini AI bawaan sistem.', 'info');
        }
      }
      this.updateEngineBadge();
    }
  },

  updateEngineBadge() {
    const badgeText = document.getElementById('ocrHeaderEngineText');
    const badgeEl = document.getElementById('ocrHeaderEngineBadge');
    if (badgeText) {
      badgeText.textContent = 'Gemini AI Vision';
    }
    if (badgeEl) {
      badgeEl.style.borderColor = '#10b981';
      badgeEl.style.color = '#34d399';
      badgeEl.title = 'Gemini AI Vision 2.5 Aktif (Klik untuk atur kunci kustom)';
    }
  },

  toggleAutoScan() {
    this.ocrAutoScanEnabled = !this.ocrAutoScanEnabled;
    const btn = document.getElementById('btnOcrAutoScanToggle');
    const badge = document.getElementById('ocrAutoScanBadge');
    if (btn) {
      btn.classList.toggle('active', this.ocrAutoScanEnabled);
      btn.title = this.ocrAutoScanEnabled ? 'Auto-Scan: AKTIF' : 'Auto-Scan: MANUAL';
    }
    if (badge) {
      badge.style.display = this.ocrAutoScanEnabled ? 'inline-flex' : 'none';
    }
    if (!this.ocrAutoScanEnabled) {
      this.stopAutoScanLoop();
      this.resetHudFeedback();
    } else if (this.cameraStream) {
      this.startAutoScanLoop();
    }
  },

  setOcrDocType(type) {
    this.ocrDocType = type;
    const btnKtp = document.getElementById('btnOcrTypeKtp');
    const btnKk = document.getElementById('btnOcrTypeKk');
    const tip = document.getElementById('ocrHudTip');

    if (type === 'kk') {
      if (btnKtp) btnKtp.classList.remove('active');
      if (btnKk) btnKk.classList.add('active');
      if (tip) tip.textContent = 'Posisikan Kartu Keluarga di dalam kotak panduan';
    } else {
      if (btnKk) btnKk.classList.remove('active');
      if (btnKtp) btnKtp.classList.add('active');
      if (tip) tip.textContent = 'Posisikan e-KTP di dalam kotak panduan';
    }
  },

  setOcrSource(source) {
    this.ocrSource = source;
    const btnCam = document.getElementById('btnOcrSourceCam');
    const btnUpload = document.getElementById('btnOcrSourceUpload');
    const secCam = document.getElementById('ocrCameraSection');
    const secUpload = document.getElementById('ocrUploadSection');
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');

    if (secPreview) secPreview.style.display = 'none';
    if (secReview) secReview.style.display = 'none';

    if (source === 'upload') {
      if (btnCam) btnCam.classList.remove('active');
      if (btnUpload) btnUpload.classList.add('active');
      if (secCam) secCam.style.display = 'none';
      if (secUpload) secUpload.style.display = 'block';
      this.stopAutoScanLoop();
      this.stopCameraStream();
    } else {
      if (btnUpload) btnUpload.classList.remove('active');
      if (btnCam) btnCam.classList.add('active');
      if (secUpload) secUpload.style.display = 'none';
      if (secCam) secCam.style.display = 'block';
      this.startCameraStream();
    }
  },

  async startCameraStream() {
    this.stopCameraStream();
    this.stopAutoScanLoop();

    const videoEl = document.getElementById('ocrCameraVideo');
    if (!videoEl) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Browser ini tidak mendukung akses kamera langsung. Silakan gunakan opsi Upload File.');
      this.setOcrSource('upload');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: this.currentFacingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      this.cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      videoEl.srcObject = this.cameraStream;
      await videoEl.play();
      
      // Mulai Auto-Scan loop jika aktif
      if (this.ocrAutoScanEnabled) {
        this.startAutoScanLoop();
      }
    } catch (err) {
      console.warn('Gagal mengakses kamera:', err);
      try {
        this.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        videoEl.srcObject = this.cameraStream;
        await videoEl.play();
        if (this.ocrAutoScanEnabled) {
          this.startAutoScanLoop();
        }
      } catch (err2) {
        console.error('Kamera tidak diizinkan atau tidak tersedia:', err2);
        alert('Kamera tidak dapat diakses (izin ditolak atau kamera sedang digunakan). Silakan pilih foto dari galeri/file.');
        this.setOcrSource('upload');
      }
    }
  },

  stopCameraStream() {
    this.stopAutoScanLoop();
    if (this.cameraStream) {
      this.cameraStream.getTracks().forEach(track => {
        try { track.stop(); } catch (e) {}
      });
      this.cameraStream = null;
    }
    const videoEl = document.getElementById('ocrCameraVideo');
    if (videoEl) {
      videoEl.srcObject = null;
    }
  },

  startAutoScanLoop() {
    this.stopAutoScanLoop();
    this.stabilityCount = 0;
    this.prevSampleData = null;
    this.autoScanTimer = setInterval(() => {
      this.checkCameraFrameForAutoScan();
    }, 900);
  },

  stopAutoScanLoop() {
    if (this.autoScanTimer) {
      clearInterval(this.autoScanTimer);
      this.autoScanTimer = null;
    }
    this.resetHudFeedback();
  },

  resetHudFeedback() {
    this.stabilityCount = 0;
    this.prevSampleData = null;
    const hudFrame = document.getElementById('ocrHudFrame');
    const tip = document.getElementById('ocrHudTip');
    const countdown = document.getElementById('ocrAutoScanCountdown');
    if (hudFrame) hudFrame.classList.remove('detecting', 'locked');
    if (countdown) countdown.style.display = 'none';
    if (tip) {
      tip.textContent = this.ocrDocType === 'kk'
        ? 'Posisikan Kartu Keluarga di dalam kotak panduan'
        : 'Posisikan e-KTP di dalam kotak panduan';
    }
  },

  checkCameraFrameForAutoScan() {
    if (!this.ocrAutoScanEnabled || !this.cameraStream || this.isProcessingOcr) return;
    const videoEl = document.getElementById('ocrCameraVideo');
    if (!videoEl || !videoEl.videoWidth || videoEl.paused || videoEl.ended) return;

    // Grab thumbnail sample to measure frame stability & presence
    const sampleW = 160;
    const sampleH = 100;
    if (!this._sampleCanvas) {
      this._sampleCanvas = document.createElement('canvas');
      this._sampleCanvas.width = sampleW;
      this._sampleCanvas.height = sampleH;
    }
    const sCtx = this._sampleCanvas.getContext('2d', { willReadFrequently: true });
    sCtx.drawImage(videoEl, 0, 0, sampleW, sampleH);

    const imgData = sCtx.getImageData(0, 0, sampleW, sampleH).data;
    let totalLum = 0;
    let totalDiff = 0;
    const pixelCount = sampleW * sampleH;

    for (let i = 0; i < imgData.length; i += 4) {
      const lum = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
      totalLum += lum;
      if (this.prevSampleData) {
        totalDiff += Math.abs(lum - this.prevSampleData[i / 4]);
      }
    }

    const avgLum = totalLum / pixelCount;
    const avgDiff = this.prevSampleData ? (totalDiff / pixelCount) : 999;

    // Cache current sample
    if (!this.prevSampleData) {
      this.prevSampleData = new Float32Array(pixelCount);
    }
    for (let i = 0; i < imgData.length; i += 4) {
      this.prevSampleData[i / 4] = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
    }

    const hudFrame = document.getElementById('ocrHudFrame');
    const tip = document.getElementById('ocrHudTip');
    const countdown = document.getElementById('ocrAutoScanCountdown');
    const countdownText = document.getElementById('ocrCountdownText');

    // Kondisi steady: Perubahan antar frame rendah (< 8.5) dan pencahayaan memadai (35 - 235)
    const isSteady = avgDiff < 8.5 && avgLum > 35 && avgLum < 235;

    if (isSteady) {
      this.stabilityCount = (this.stabilityCount || 0) + 1;
      if (this.stabilityCount === 1) {
        if (hudFrame) hudFrame.classList.add('detecting');
        if (tip) tip.textContent = '⚡ Mendeteksi dokumen... Tahan posisi kamera...';
      } else if (this.stabilityCount >= 2) {
        if (hudFrame) {
          hudFrame.classList.remove('detecting');
          hudFrame.classList.add('locked');
        }
        if (countdown) countdown.style.display = 'flex';
        if (countdownText) countdownText.textContent = '🎯 Memindai Otomatis...';
        if (tip) tip.textContent = '✨ Dokumen Pas! Mengambil foto...';

        // Auto snapshot & scan
        setTimeout(() => {
          this.captureSnapshot(false);
        }, 350);
      }
    } else {
      if (this.stabilityCount > 0) {
        this.stabilityCount = 0;
        if (hudFrame) hudFrame.classList.remove('detecting', 'locked');
        if (countdown) countdown.style.display = 'none';
        if (tip) {
          tip.textContent = this.ocrDocType === 'kk'
            ? 'Posisikan Kartu Keluarga di dalam kotak panduan'
            : 'Posisikan e-KTP di dalam kotak panduan';
        }
      }
    }
  },

  switchCamera() {
    this.currentFacingMode = (this.currentFacingMode === 'environment') ? 'user' : 'environment';
    this.startCameraStream();
  },

  captureSnapshot(manual = true) {
    if (manual) {
      this.isProcessingOcr = false;
    } else if (this.isProcessingOcr) {
      return;
    }

    const videoEl = document.getElementById('ocrCameraVideo');
    const canvas = document.getElementById('ocrHiddenCanvas') || document.createElement('canvas');

    if (!videoEl || !videoEl.videoWidth) {
      if (manual) alert('Kamera belum siap atau belum aktif. Pastikan izin kamera telah diberikan.');
      return;
    }

    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);

    this.capturedImageBase64 = canvas.toDataURL('image/jpeg', 0.92);
    this.stopAutoScanLoop();
    this.stopCameraStream();

    // Tampilkan Viewport Preview dan LANGSUNG proses OCR otomatis!
    this.showCapturedPreview(this.capturedImageBase64);
    this.processOcr();
  },

  handleFileSelect(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      this.capturedImageBase64 = e.target.result;
      this.showCapturedPreview(this.capturedImageBase64);
      // LANGSUNG proses OCR otomatis!
      this.processOcr();
    };
    reader.readAsDataURL(file);
  },

  showCapturedPreview(dataUrl) {
    const secCam = document.getElementById('ocrCameraSection');
    const secUpload = document.getElementById('ocrUploadSection');
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');
    const imgEl = document.getElementById('ocrCapturedPreview');

    if (secCam) secCam.style.display = 'none';
    if (secUpload) secUpload.style.display = 'none';
    if (secReview) secReview.style.display = 'none';
    if (secPreview) secPreview.style.display = 'block';

    if (imgEl) imgEl.src = dataUrl;
  },

  retakePhoto() {
    this.isProcessingOcr = false;
    this.capturedImageBase64 = null;
    this.extractedOcrData = null;
    this.resetHudFeedback();
    this.setOcrSource(this.ocrSource || 'camera');
  },

  // Pre-process canvas to increase OCR accuracy
  preprocessImageForOcr(sourceDataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxW = 1200;
        let w = img.naturalWidth || img.width;
        let h = img.naturalHeight || img.height;

        if (w > maxW) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);

        const imgData = ctx.getImageData(0, 0, w, h);
        const d = imgData.data;

        // Grayscale + Adaptive Contrast Enhancement for sharp text
        for (let i = 0; i < d.length; i += 4) {
          let gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
          // Contrast stretch
          gray = (gray - 128) * 1.45 + 128;
          if (gray < 0) gray = 0;
          if (gray > 255) gray = 255;
          // Slight thresholding for crisp characters
          const finalVal = gray < 138 ? Math.max(0, gray - 30) : Math.min(255, gray + 30);
          d[i] = finalVal;
          d[i + 1] = finalVal;
          d[i + 2] = finalVal;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = () => resolve(sourceDataUrl);
      img.src = sourceDataUrl;
    });
  },

  hasExtractedFields(data) {
    if (!data || typeof data !== 'object') return false;
    const meaningful = ['nik', 'nama', 'no_kk', 'alamat', 'tempat_lahir', 'tanggal_lahir'];
    return meaningful.some(k => data[k] && String(data[k]).trim().length > 0 && String(data[k]).trim() !== '-');
  },

  normalizeExtractedData(d, docType = 'ktp') {
    if (!d || typeof d !== 'object') return {};

    // Check nested wrappers like 'data', 'ktp', 'kk', 'result', 'hasil', 'identitas'
    for (const wrap of ['data', 'ktp', 'kk', 'result', 'hasil', 'identitas']) {
      if (d[wrap] && typeof d[wrap] === 'object' && !Array.isArray(d[wrap])) {
        d = Object.assign({}, d, d[wrap]);
      }
    }

    // Support Kartu Keluarga nested member list (ambil kepala keluarga / anggota pertama)
    for (const arrKey of ['anggota', 'anggota_keluarga', 'keluarga', 'daftar_keluarga', 'members', 'daftar_anggota']) {
      if (Array.isArray(d[arrKey]) && d[arrKey].length > 0 && typeof d[arrKey][0] === 'object') {
        d = Object.assign({}, d[arrKey][0], d);
      }
    }

    const norm = {};
    for (const [k, v] of Object.entries(d)) {
      const cleanK = k.toLowerCase().replace(/[^a-z0-9_]/g, '_');
      norm[cleanK] = (typeof v === 'string') ? v.trim() : v;
    }

    const getVal = (...keys) => {
      for (const k of keys) {
        if (norm[k] && typeof norm[k] === 'string' && norm[k].trim()) return norm[k].trim();
      }
      return '';
    };

    return {
      nik: getVal('nik', 'nomor_nik', 'nik_ktp', 'no_ktp', 'no_identitas').replace(/[^0-9]/g, ''),
      no_kk: getVal('no_kk', 'nomor_kk', 'nomor_kartu_keluarga', 'kartu_keluarga').replace(/[^0-9]/g, ''),
      nama: getVal('nama', 'nama_lengkap', 'nama_customer', 'nama_kepala_keluarga').replace(/[^a-zA-Z\s\.,\']/g, '').toUpperCase(),
      tempat_lahir: getVal('tempat_lahir', 'tempat').toUpperCase(),
      tanggal_lahir: getVal('tanggal_lahir', 'tgl_lahir'),
      jenis_kelamin: getVal('jenis_kelamin', 'kelamin', 'gender').toUpperCase(),
      alamat: getVal('alamat', 'alamat_lengkap', 'jalan'),
      rt_rw: getVal('rt_rw', 'rt_dan_rw', 'rtrw'),
      kelurahan: getVal('kelurahan', 'desa', 'kelurahan_desa', 'kel_desa').toUpperCase(),
      kecamatan: getVal('kecamatan', 'kec').toUpperCase(),
      kota: getVal('kota', 'kabupaten', 'kota_kabupaten', 'kab').toUpperCase(),
      provinsi: getVal('provinsi', 'prov').toUpperCase(),
      agama: getVal('agama').toUpperCase(),
      status_perkawinan: getVal('status_perkawinan', 'status').toUpperCase(),
      pekerjaan: getVal('pekerjaan', 'pekerjaan_profesi').toUpperCase()
    };
  },

  async directGeminiVision(base64Image, docType) {
    const key = localStorage.getItem('sft_gemini_api_key') || '';
    if (!key) throw new Error('No client Gemini key configured');
    let cleanBase64 = base64Image;
    let mimeType = 'image/jpeg';
    const m = base64Image.match(/^data:(image\/[a-zA-Z0-9\+\-\.]+);base64,(.+)$/);
    if (m) {
      mimeType = m[1];
      cleanBase64 = m[2];
    }

    const promptInstruction = (docType === 'kk')
      ? "Ekstrak data dari foto Kartu Keluarga (KK) Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari: no_kk (Nomor KK 16 digit angka), nama (Nama Kepala Keluarga atau Anggota), nik (NIK 16 digit angka), alamat, rt_rw, kelurahan, kecamatan, kota, provinsi. Kosongkan string (\"\") jika tidak terbaca. Output HANYA JSON valid."
      : "Ekstrak data dari foto e-KTP Indonesia ini menjadi JSON murni tanpa markdown/backticks. Field yang wajib dicari: nik (16 digit angka tanpa spasi), nama (Nama lengkap sesuai KTP), tempat_lahir, tanggal_lahir (DD-MM-YYYY), jenis_kelamin (LAKI-LAKI atau PEREMPUAN), alamat, rt_rw, kelurahan, kecamatan, kota, provinsi, agama, status_perkawinan, pekerjaan. Kosongkan string (\"\") jika tidak terbaca. Output HANYA JSON valid.";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: promptInstruction },
            { inlineData: { mimeType: mimeType, data: cleanBase64 } }
          ]
        }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) throw new Error(`Gemini direct status ${response.status}`);
    const resJson = await response.json();
    let rawJsonText = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    rawJsonText = rawJsonText.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
    return JSON.parse(rawJsonText);
  },

  attachPhotoToHiddenAndThumb() {
    if (!this.capturedImageBase64) return;
    if (this.ocrDocType === 'kk') {
      const hidKk = document.getElementById('spkFotoKk');
      if (hidKk) hidKk.value = this.capturedImageBase64;
      const cardKk = document.getElementById('spkDocCardKk');
      const thumbKk = document.getElementById('spkThumbKk');
      const statusKk = document.getElementById('spkStatusKk');
      const btnTextKk = document.getElementById('spkBtnTextKk');
      if (cardKk) cardKk.classList.add('has-file');
      if (thumbKk) thumbKk.innerHTML = `<img src="${this.capturedImageBase64}" alt="KK" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
      if (statusKk) statusKk.textContent = '✅ Kartu Keluarga Terlampir';
      if (btnTextKk) btnTextKk.textContent = 'Ganti Foto';
    } else {
      const hidKtp = document.getElementById('spkFotoKtp');
      if (hidKtp) hidKtp.value = this.capturedImageBase64;
      const cardKtp = document.getElementById('spkDocCardKtp');
      const thumbKtp = document.getElementById('spkThumbKtp');
      const statusKtp = document.getElementById('spkStatusKtp');
      const btnTextKtp = document.getElementById('spkBtnTextKtp');
      if (cardKtp) cardKtp.classList.add('has-file');
      if (thumbKtp) thumbKtp.innerHTML = `<img src="${this.capturedImageBase64}" alt="KTP" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" />`;
      if (statusKtp) statusKtp.textContent = '✅ e-KTP Terlampir';
      if (btnTextKtp) btnTextKtp.textContent = 'Ganti Foto';
    }
  },

  highlightField(el) {
    if (!el) return;
    el.style.transition = 'background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    el.style.backgroundColor = '#ecfdf5';
    el.style.borderColor = '#10b981';
    el.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.2)';
    setTimeout(() => {
      el.style.backgroundColor = '';
      el.style.borderColor = '';
      el.style.boxShadow = '';
    }, 4000);
  },

  async processOcr() {
    if (!this.capturedImageBase64) {
      if (window.showCustomAlert) {
        window.showCustomAlert('Peringatan', 'Silakan ambil atau pilih foto dokumen terlebih dahulu.', 'warning');
      } else {
        alert('Silakan ambil atau pilih foto dokumen terlebih dahulu.');
      }
      return;
    }

    this.isProcessingOcr = true;
    const overlay = document.getElementById('ocrScanningOverlay');
    const statusText = document.getElementById('ocrScanningStatusText');
    const preScanActions = document.getElementById('ocrPreScanActions');

    if (overlay) overlay.style.display = 'flex';
    if (preScanActions) preScanActions.style.display = 'none';
    if (statusText) statusText.textContent = 'Mempersiapkan gambar & menghubungkan AI Vision...';

    const apiKey = localStorage.getItem('sft_gemini_api_key') || '';
    let extracted = null;
    let engineUsed = 'Gemini AI Vision';

    try {
      // 1. Coba backend endpoints dengan timeout 16s per candidate
      const candidateEndpoints = this.getApiEndpoints();

      for (const endpoint of candidateEndpoints) {
        try {
          if (statusText) statusText.textContent = 'Menganalisis dokumen dengan AI Gemini Vision...';
          const controller = new AbortController();
          const tId = setTimeout(() => controller.abort(), 16000);

          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              image: this.capturedImageBase64,
              doc_type: this.ocrDocType,
              api_key: apiKey
            }),
            signal: controller.signal
          });
          clearTimeout(tId);

          if (res.ok) {
            const txt = await res.text();
            let parsed = null;
            try {
              parsed = JSON.parse(txt);
            } catch (je) {}

            if (parsed && parsed.status === 'success' && this.hasExtractedFields(parsed.data)) {
              extracted = parsed.data;
              engineUsed = parsed.engine || 'Gemini AI Vision';
              break;
            } else if (parsed && parsed.status === 'unreadable') {
              console.warn('Backend Gemini returned unreadable:', parsed.message);
              break;
            }
          }
        } catch (e) {
          // Lanjut ke endpoint berikutnya
        }
      }

      // 2. Jika backend belum menghasilkan data, coba Direct Gemini Vision dari browser
      if (!this.hasExtractedFields(extracted)) {
        try {
          if (statusText) statusText.textContent = 'Menghubungkan AI Gemini Vision langsung...';
          const directData = await this.directGeminiVision(this.capturedImageBase64, this.ocrDocType);
          const normalized = this.normalizeExtractedData(directData, this.ocrDocType);
          if (this.hasExtractedFields(normalized)) {
            extracted = normalized;
            engineUsed = 'Direct Gemini AI Vision';
          }
        } catch (directErr) {
          console.warn('Direct Gemini Vision fallback failed:', directErr);
        }
      }

      // 3. Jika AI Vision belum mendapatkan data, fallback ke Tesseract.js client OCR
      if (!this.hasExtractedFields(extracted)) {
        if (statusText) statusText.textContent = '🔍 Membaca teks dokumen via Smart OCR lokal...';
        try {
          if (typeof Tesseract === 'undefined') {
            await this.loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
          }
          if (statusText) statusText.textContent = '⚡ Mengoptimalkan kontras karakter & NIK...';
          const preprocessedImg = await this.preprocessImageForOcr(this.capturedImageBase64);

          if (statusText) statusText.textContent = '🤖 Menganalisis karakter dokumen identitas...';
          const ret = await Tesseract.recognize(preprocessedImg, 'eng');
          const text = ret.data?.text || '';

          if (text) {
            const localParsed = this.parseKtpText(text);
            if (this.hasExtractedFields(localParsed)) {
              extracted = localParsed;
              engineUsed = 'Smart Local OCR Engine';
            }
          }
        } catch (tessErr) {
          console.warn('Tesseract fallback failed:', tessErr);
        }
      }

      // 4. Periksa hasil ekstraksi akhir
      if (this.hasExtractedFields(extracted)) {
        this.extractedOcrData = extracted;
        this.renderOcrReview(this.extractedOcrData, engineUsed);
        // LANGSUNG AUTO-FILL DATA KE FORMULIR OTOMATIS!
        this.applyExtractedDataToForm(true);
        return;
      } else {
        // Dokumen tidak terbaca jelas: JANGAN tutup modal diam-diam!
        this.attachPhotoToHiddenAndThumb();
        
        const docName = this.ocrDocType === 'kk' ? 'Kartu Keluarga' : 'e-KTP';
        const msg = `Teks pada foto ${docName} belum terdeteksi dengan jelas. Pastikan foto tegak, memiliki cahaya terang, fokus, dan tidak terpotong silau. Silakan coba ambil foto ulang atau isi data secara manual.`;
        
        if (window.showCustomAlert) {
          window.showCustomAlert('Dokumen Belum Terbaca Jelas', msg, 'warning');
        } else {
          alert(msg);
        }
      }

    } catch (err) {
      console.error('OCR Processing error:', err);
      this.attachPhotoToHiddenAndThumb();
      if (window.showCustomAlert) {
        window.showCustomAlert('Perhatian', 'Gagal memproses OCR. Silakan periksa koneksi internet atau foto ulang dokumen.', 'info');
      } else {
        alert('Gagal memproses OCR. Silakan coba lagi.');
      }
    } finally {
      this.isProcessingOcr = false;
      if (overlay) overlay.style.display = 'none';
      if (preScanActions) preScanActions.style.display = 'flex';
    }
  },

  renderOcrReview(data, engineName) {
    const secPreview = document.getElementById('ocrPreviewSection');
    const secReview = document.getElementById('ocrReviewSection');
    const reviewList = document.getElementById('ocrReviewList');
    const engineBadge = document.getElementById('ocrEngineBadge');

    if (secPreview) secPreview.style.display = 'none';
    if (secReview) secReview.style.display = 'block';

    if (engineBadge) {
      engineBadge.textContent = engineName || 'Smart AI Engine';
    }

    const items = [
      { label: 'Nomor NIK', val: data.nik || '-' },
      { label: 'No. Kartu Keluarga', val: data.no_kk || '-' },
      { label: 'Nama Lengkap', val: data.nama || '-' },
      { label: 'Tempat / Tgl Lahir', val: (data.tempat_lahir ? data.tempat_lahir + ', ' : '') + (data.tanggal_lahir || '-') },
      { label: 'Jenis Kelamin', val: data.jenis_kelamin || '-' },
      { label: 'Alamat', val: data.alamat || '-' },
      { label: 'RT / RW', val: data.rt_rw || '-' },
      { label: 'Kelurahan / Desa', val: data.kelurahan || '-' },
      { label: 'Kecamatan', val: data.kecamatan || '-' },
      { label: 'Kota / Kabupaten', val: data.kota || '-' },
      { label: 'Status Perkawinan', val: data.status_perkawinan || '-' },
      { label: 'Pekerjaan', val: data.pekerjaan || '-' }
    ];

    if (reviewList) {
      reviewList.innerHTML = items.map(item => `
        <div class="ocr-result-item">
          <span class="ocr-result-lbl">${item.label}:</span>
          <span class="ocr-result-val">${escapeHtml(item.val)}</span>
        </div>
      `).join('');
    }
  },

  applyExtractedDataToForm(isAuto = false) {
    const d = this.extractedOcrData || {};

    let filledCount = 0;

    // 1. Auto-fill custom targetFields if specified (e.g. from customer.blade.php)
    if (this.currentTargetFields && typeof this.currentTargetFields === 'object') {
      for (const [key, targetId] of Object.entries(this.currentTargetFields)) {
        const val = d[key];
        const el = document.getElementById(targetId);
        if (el && val) {
          const cleanVal = String(val).trim();
          if (cleanVal && cleanVal !== '-') {
            el.value = cleanVal;
            try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
            try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
            this.highlightField(el);
            filledCount++;
          }
        }
      }
    }

    // 2. Auto-fill kolom identitas SPK
    const fieldMap = {
      spkNik: d.nik,
      spkNoKk: d.no_kk,
      namaCustomer: d.nama,
      spkTempatLahir: d.tempat_lahir,
      spkTanggalLahir: d.tanggal_lahir,
      spkJenisKelamin: d.jenis_kelamin,
      spkStatusPerkawinan: d.status_perkawinan,
      spkAlamat: d.alamat,
      spkRtRw: d.rt_rw,
      spkKelurahan: d.kelurahan,
      spkKecamatan: d.kecamatan,
      spkKota: d.kota,
      spkProvinsi: d.provinsi,
      spkAgama: d.agama,
      spkPekerjaan: d.pekerjaan
    };

    for (let [id, val] of Object.entries(fieldMap)) {
      const el = document.getElementById(id);
      if (el && val) {
        val = String(val).trim();
        if (!val || val === '-') continue;

        // Normalisasi untuk dropdown/select
        if (id === 'spkJenisKelamin') {
          const u = val.toUpperCase();
          if (u.includes('LAK') || u === 'L' || u.includes('PRIA')) {
            el.value = 'LAKI-LAKI';
          } else if (u.includes('PER') || u === 'P' || u.includes('WAN')) {
            el.value = 'PEREMPUAN';
          } else {
            el.value = val;
          }
        } else if (id === 'spkStatusPerkawinan') {
          const u = val.toUpperCase();
          if (u.includes('BELUM')) {
            el.value = 'BELUM KAWIN';
          } else if (u.includes('CERAI HIDUP')) {
            el.value = 'CERAI HIDUP';
          } else if (u.includes('CERAI MATI')) {
            el.value = 'CERAI MATI';
          } else if (u.includes('KAWIN') || u.includes('NIKAH')) {
            el.value = 'KAWIN';
          } else {
            el.value = val;
          }
        } else if (id === 'spkAgama') {
          const u = val.toUpperCase();
          for (let opt of el.options) {
            if (opt.value && u.includes(opt.value.toUpperCase())) {
              el.value = opt.value;
              break;
            }
          }
        } else {
          el.value = val;
        }

        // Trigger event input dan change agar listener bereaksi
        try { el.dispatchEvent(new Event('input', { bubbles: true })); } catch (e) {}
        try { el.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}

        this.highlightField(el);
        filledCount++;
      }
    }

    // 3. Simpan lampiran foto ke hidden input & update card preview
    this.attachPhotoToHiddenAndThumb();

    // 4. Jika ada field yang terisi, tutup modal dan beri feedback
    if (filledCount > 0) {
      this.closeOcrModal();

      // Scroll ke bagian identitas agar user langsung melihat data yang terisi
      setTimeout(() => {
        const firstField = document.getElementById('namaCustomer') || document.getElementById('spkNik') || document.getElementById('newCustomerName');
        if (firstField) {
          firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstField.focus();
        }
      }, 300);

      const docLabel = (this.ocrDocType === 'kk' ? 'Kartu Keluarga' : 'e-KTP');
      if (window.showCustomAlert) {
        window.showCustomAlert(
          '✨ Auto-Fill Berhasil!',
          `Data identitas ${docLabel} berhasil diekstrak dan otomatis dimasukkan ke ${filledCount} kolom formulir.`,
          'success'
        );
      } else {
        alert(`Data identitas ${docLabel} berhasil diisi otomatis ke formulir (${filledCount} kolom)!`);
      }
    } else {
      if (!isAuto) {
        if (window.showCustomAlert) {
          window.showCustomAlert('Belum Ada Data', 'Tidak ada data identitas yang dapat diterapkan ke formulir. Silakan coba foto ulang dokumen.', 'warning');
        } else {
          alert('Tidak ada data identitas yang dapat diterapkan. Silakan foto ulang dokumen.');
        }
      }
    }
  },

  // Backward compatibility method
  async scanKtpFile(fileInput, targetFields = { nik: 'spkNik', nama: 'namaCustomer', alamat: 'spkAlamat' }) {
    if (!fileInput.files || !fileInput.files[0]) return;
    this.currentTargetFields = targetFields;
    const file = fileInput.files[0];
    const modal = document.getElementById('smartOcrModal');
    if (modal) {
      this.handleFileSelect(fileInput);
      this.openOcrModal('ktp');
      return;
    }

    // Modal tidak ada di halaman ini (misal customer.blade.php): lakukan Quick OCR langsung
    const reader = new FileReader();
    reader.onload = async (e) => {
      this.capturedImageBase64 = e.target.result;
      this.ocrDocType = 'ktp';
      if (window.showCustomAlert) {
        window.showCustomAlert('Memindai Dokumen...', 'Sedang membaca teks KTP dengan AI Vision...', 'info');
      }
      await this.processOcr();
    };
    reader.readAsDataURL(file);
  },

  parseKtpText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let nik = '', no_kk = '', nama = '', alamat = '', tempat_lahir = '', tanggal_lahir = '', jenis_kelamin = '', rt_rw = '', kelurahan = '', kecamatan = '', kota = '', provinsi = '', agama = '', status_perkawinan = '', pekerjaan = '';

    // Normalize OCR digit confusions
    const numClean = text.replace(/[oOD]/g, '0').replace(/[Il|]/g, '1').replace(/[Zz]/g, '2').replace(/[Ss]/g, '5').replace(/B/g, '8');
    const numCondensed = numClean.replace(/(\d)\s+(\d)/g, '$1$2').replace(/(\d)\s+(\d)/g, '$1$2');

    // Extract NIK (16 digits)
    const nikMatch = numCondensed.match(/\b([1-9][0-9]{15})\b/) || numClean.match(/N[I1l|][Kk]\D*([0-9\s]{16,24})/i);
    if (nikMatch) {
      const d = (nikMatch[1] || '').replace(/\D/g, '');
      if (d.length >= 16) nik = d.slice(0, 16);
    }
    if (!nik) {
      const any16 = numCondensed.match(/\b([0-9]{16})\b/);
      if (any16) nik = any16[1];
    }

    // Extract No KK
    if (this.ocrDocType === 'kk') {
      const kkMatch = numClean.match(/(?:NO|NOMOR)\D*K(?:ARTU)?\D*K(?:ELUARGA)?\D*([0-9\s]{16,24})/i) || numCondensed.match(/\b([1-9][0-9]{15})\b/);
      if (kkMatch) {
        const d = (kkMatch[1] || '').replace(/\D/g, '');
        if (d.length >= 16) no_kk = d.slice(0, 16);
      }
    }

    // Extract Nama
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/nama\b/i.test(line)) {
        nama = line.replace(/.*nama\s*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        if (!nama && lines[i + 1] && !/nik|tempat|tgl|lahir|alamat|jenis|kelamin|agama|status/i.test(lines[i + 1])) {
          nama = lines[i + 1].replace(/.*(?:lengkap|kepala\s*keluarga)?\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        }
        break;
      }
    }

    // Fallback Nama jika baris berlabel Nama tidak terbaca
    if (!nama && nik) {
      let foundNik = false;
      for (let i = 0; i < lines.length; i++) {
        if (foundNik) {
          const clean = lines[i].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
          if (clean.length >= 3 && !/PROVINSI|REPUBLIK|INDONESIA|NIK|TEMPAT|LAHIR|BANDUNG|JAKARTA/i.test(clean)) {
            nama = clean;
            break;
          }
        }
        if (/nik\b/i.test(lines[i]) || lines[i].includes(nik)) {
          foundNik = true;
        }
      }
    }

    // Extract TTL
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/tempat|tgl|lahir/i.test(line)) {
        const val = line.replace(/.*(?:tempat|tgl|lahir)\s*[:=\-]?\s*/i, '').trim();
        const m = val.match(/([a-zA-Z\s]+)[,\s]+([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/);
        if (m) {
          tempat_lahir = m[1].trim().toUpperCase();
          tanggal_lahir = m[2].trim();
        } else {
          const dateOnly = val.match(/([0-9]{1,2}[\/\-\.][0-9]{1,2}[\/\-\.][0-9]{2,4})/);
          if (dateOnly) tanggal_lahir = dateOnly[1].trim();
          const placeOnly = val.replace(/[0-9\/\-\.,:]/g, '').trim().toUpperCase();
          if (placeOnly) tempat_lahir = placeOnly;
        }
        break;
      }
    }

    // Extract Jenis Kelamin
    if (/LAKI[\-\s]*LAKI|PRIA/i.test(text)) jenis_kelamin = 'LAKI-LAKI';
    else if (/PEREMPUAN|WANITA/i.test(text)) jenis_kelamin = 'PEREMPUAN';

    // Extract RT/RW
    const rtrwMatch = text.match(/RT[\/\.]?RW\D*([0-9]{1,3})\s*[\/\-]\s*([0-9]{1,3})/i);
    if (rtrwMatch) {
      rt_rw = `${rtrwMatch[1].padStart(3, '0')}/${rtrwMatch[2].padStart(3, '0')}`;
    }

    // Extract Alamat
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/alamat/i.test(line)) {
        alamat = line.replace(/.*alamat\s*[:=\-]?\s*/i, '').trim();
        if (lines[i + 1] && !/rt|rw|kel|kec|agama|status/i.test(lines[i + 1])) {
          alamat += ' ' + lines[i + 1].trim();
        }
        break;
      }
    }

    // Extract Kelurahan / Desa
    for (let i = 0; i < lines.length; i++) {
      if (/kelurahan|desa/i.test(lines[i])) {
        kelurahan = lines[i].replace(/.*(?:kelurahan|kel|desa)\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    // Extract Kecamatan
    for (let i = 0; i < lines.length; i++) {
      if (/kecamatan/i.test(lines[i])) {
        kecamatan = lines[i].replace(/.*kecamatan\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    // Extract Kota / Kabupaten
    const kotaMatch = text.match(/(?:KOTA|KABUPATEN|KAB\.?)\s+([A-Z\s]+)/i);
    if (kotaMatch) {
      const firstPart = kotaMatch[1].split('\n')[0].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
      if (firstPart) {
        const prefix = /KAB/i.test(kotaMatch[0]) ? 'KABUPATEN ' : 'KOTA ';
        kota = prefix + firstPart;
      }
    }

    // Extract Provinsi
    const provMatch = text.match(/PROVINSI\s+([A-Z\s]+)/i);
    if (provMatch) {
      provinsi = provMatch[1].split('\n')[0].replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
    }

    // Extract Agama
    if (/ISLAM/i.test(text)) agama = 'ISLAM';
    else if (/KRISTEN|PROTESTAN/i.test(text)) agama = 'KRISTEN';
    else if (/KATOLIK/i.test(text)) agama = 'KATOLIK';
    else if (/HINDU/i.test(text)) agama = 'HINDU';
    else if (/BUDDHA|BUDHA/i.test(text)) agama = 'BUDDHA';
    else if (/KONGHUCU/i.test(text)) agama = 'KONGHUCU';

    // Extract Status Perkawinan
    if (/BELUM\s*KAWIN/i.test(text)) status_perkawinan = 'BELUM KAWIN';
    else if (/CERAI\s*HIDUP/i.test(text)) status_perkawinan = 'CERAI HIDUP';
    else if (/CERAI\s*MATI/i.test(text)) status_perkawinan = 'CERAI MATI';
    else if (/KAWIN/i.test(text)) status_perkawinan = 'KAWIN';

    // Extract Pekerjaan
    for (let i = 0; i < lines.length; i++) {
      if (/pekerjaan/i.test(lines[i])) {
        pekerjaan = lines[i].replace(/.*pekerjaan\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim().toUpperCase();
        break;
      }
    }

    return { nik, no_kk, nama, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, rt_rw, kelurahan, kecamatan, kota, provinsi, agama, status_perkawinan, pekerjaan };
  },

  // =========================================================================
  // 5. VOICE NOTE ACTIVITY LOG (SPEECH-TO-TEXT)
  // =========================================================================
  initVoiceRecorder(targetInputId, triggerBtnId, statusPillId) {
    const targetInput = document.getElementById(targetInputId);
    const triggerBtn = document.getElementById(triggerBtnId);
    const statusPill = statusPillId ? document.getElementById(statusPillId) : null;

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      if (triggerBtn) {
        triggerBtn.title = 'Browser tidak mendukung Speech Recognition (Gunakan Chrome/Edge)';
      }
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      this.isRecording = true;
      if (triggerBtn) {
        triggerBtn.classList.add('recording');
        triggerBtn.innerHTML = `
          <div class="voice-wave-bars">
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
            <span class="voice-wave-bar"></span>
          </div>
          <span style="color:#dc2626; font-weight:800;">Merekam... (Klik Selesai)</span>
        `;
      }
      if (statusPill) {
        statusPill.style.display = 'flex';
        statusPill.innerHTML = `<i class="fa-solid fa-microphone-lines fa-fade" style="color:#ef4444;"></i> Bicaralah sekarang dalam bahasa Indonesia...`;
      }
    };

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        transcript += event.results[i][0].transcript;
      }
      if (targetInput && transcript) {
        const existing = targetInput.value.trim();
        targetInput.value = existing ? existing + ' ' + transcript : transcript;
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error', event.error);
      this.isRecording = false;
      if (triggerBtn) {
        triggerBtn.classList.remove('recording');
        triggerBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> <span>Dikte Suara (Mic)</span>`;
      }
      if (statusPill) {
        statusPill.innerHTML = `<i class="fa-solid fa-circle-exclamation" style="color:#f59e0b;"></i> Selesai mendikte.`;
        setTimeout(() => { statusPill.style.display = 'none'; }, 2000);
      }
    };

    recognition.onend = () => {
      this.isRecording = false;
      if (triggerBtn) {
        triggerBtn.classList.remove('recording');
        triggerBtn.innerHTML = `<i class="fa-solid fa-microphone"></i> <span>Dikte Suara (Mic)</span>`;
      }
      if (statusPill) {
        statusPill.innerHTML = `<i class="fa-solid fa-check" style="color:#10b981;"></i> Catatan suara berhasil diubah ke teks!`;
        setTimeout(() => { statusPill.style.display = 'none'; }, 2500);
      }
    };

    if (triggerBtn) {
      triggerBtn.onclick = () => {
        if (this.isRecording) {
          recognition.stop();
        } else {
          recognition.start();
        }
      };
    }
  },

  // Helper to load dynamic scripts
  loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) return resolve();
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  },

  // =========================================================================
  // RADAR FOLLOW-UP MODAL & FOTO BUKTI KUNJUNGAN ENGINE
  // =========================================================================
  openRadarFollowupModal(customerId) {
    const cust = (this.radarData || []).find(c => String(c.id) === String(customerId));
    const custName = cust ? cust.name : 'Customer';
    const custCar = cust ? cust.car_model : '';
    const currentStatus = cust ? (cust.status || 'Belum Dihubungi') : 'Belum Dihubungi';

    // Remove existing modal if any
    const existingModal = document.getElementById('radarFollowupModalOverlay');
    if (existingModal) existingModal.remove();

    this.selectedPhotoFile = null;

    const modalHtml = `
      <div id="radarFollowupModalOverlay" style="position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15,23,42,0.75); backdrop-filter:blur(5px); z-index:999999; display:flex; align-items:center; justify-content:center; padding:16px; box-sizing:border-box;">
        <div style="background:#ffffff; width:100%; max-width:540px; max-height:90vh; border-radius:20px; box-shadow:0 20px 50px rgba(0,0,0,0.3); overflow-y:auto; font-family:'Plus Jakarta Sans', sans-serif;">
          <!-- Modal Header -->
          <div style="background:linear-gradient(135deg, #0d1b3e 0%, #162a52 100%); color:#ffffff; padding:18px 20px; border-radius:20px 20px 0 0; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <h3 style="font-size:16px; font-weight:900; margin:0; display:flex; align-items:center; gap:8px;">
                <i class="fa-solid fa-clipboard-check" style="color:#4ade80;"></i> Update Progres &amp; Foto Kunjungan
              </h3>
              <p style="font-size:12px; color:rgba(255,255,255,0.75); margin:3px 0 0 0;">
                ${escapeHtml(custName)} &middot; <span style="color:#f43f5e; font-weight:700;">${escapeHtml(custCar)}</span>
              </p>
            </div>
            <button onclick="document.getElementById('radarFollowupModalOverlay').remove()" style="background:rgba(255,255,255,0.15); border:none; color:#ffffff; width:32px; height:32px; border-radius:50%; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <!-- Modal Body Form -->
          <form id="radarFollowupForm" onsubmit="SalesSuperpowers.submitRadarFollowup(event, ${customerId})" style="padding:20px;">
            <input type="hidden" name="customer_id" value="${customerId}">
            
            <!-- 1. Status Progres -->
            <div style="margin-bottom:16px;">
              <label style="display:block; font-size:12px; font-weight:800; color:#334155; margin-bottom:6px;">
                <i class="fa-solid fa-flag" style="color:#3b82f6;"></i> Status Progres Follow-Up:
              </label>
              <select name="status" class="fu-select" style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #cbd5e1; font-weight:700; font-size:13px; color:#0f172a;">
                <option value="Belum Dihubungi" ${currentStatus === 'Belum Dihubungi' ? 'selected' : ''}>⚪ Belum Dihubungi</option>
                <option value="Menunggu Respon" ${currentStatus === 'Menunggu Respon' ? 'selected' : ''}>🟡 Menunggu Respon</option>
                <option value="Tertarik / Jadwal Servis" ${currentStatus === 'Tertarik / Jadwal Servis' ? 'selected' : ''}>🟣 Tertarik / Jadwal Servis</option>
                <option value="Deal / Selesai" ${currentStatus === 'Deal / Selesai' ? 'selected' : ''}>🟢 Deal / Selesai</option>
                <option value="Tidak Tertarik" ${currentStatus === 'Tidak Tertarik' ? 'selected' : ''}>🔴 Tidak Tertarik</option>
              </select>
            </div>

            <!-- 2. Catatan & Respon Follow-Up (Speech Dictation) -->
            <div style="margin-bottom:16px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                <label style="font-size:12px; font-weight:800; color:#334155;">
                  <i class="fa-solid fa-comment-dots" style="color:#8b5cf6;"></i> Catatan Hasil Kunjungan / Follow-Up:
                </label>
                <button type="button" onclick="SalesSuperpowers.toggleVoiceDictation('radarNotesInput')" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; padding:3px 8px; border-radius:6px; font-size:11px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
                  <i class="fa-solid fa-microphone"></i> Dikte Suara
                </button>
              </div>
              <textarea id="radarNotesInput" name="reason_followup" rows="3" placeholder="Tuliskan hasil pembicaraan/kunjungan dengan customer..." style="width:100%; padding:10px; border-radius:10px; border:1.5px solid #cbd5e1; font-size:12.5px; font-family:inherit; box-sizing:border-box; outline:none;">${cust && cust.reason_followup ? escapeHtml(cust.reason_followup) : ''}</textarea>
            </div>

            <!-- 3. Upload Foto Bukti Kunjungan / Lokasi -->
            <div style="margin-bottom:20px;">
              <label style="display:block; font-size:12px; font-weight:800; color:#334155; margin-bottom:6px;">
                <i class="fa-solid fa-camera" style="color:#e11d48;"></i> Upload Foto Bukti Kunjungan / Lokasi:
              </label>
              <div style="border:2px dashed #cbd5e1; border-radius:12px; padding:16px; text-align:center; background:#f8fafc; cursor:pointer;" onclick="document.getElementById('radarVisitPhotoInput').click()">
                <input type="file" id="radarVisitPhotoInput" name="visit_photo" accept="image/*" capture="environment" style="display:none;" onchange="SalesSuperpowers.handleRadarPhotoSelect(event)">
                <div id="radarPhotoPreviewContainer">
                  ${cust && cust.visit_photo ? `
                    <img src="${cust.visit_photo}" style="max-height:140px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15); margin-bottom:8px;">
                    <div style="font-size:11px; color:#059669; font-weight:800;"><i class="fa-solid fa-check-circle"></i> Foto Terpasang (Klik untuk Ganti)</div>
                  ` : `
                    <i class="fa-solid fa-cloud-arrow-up" style="font-size:28px; color:#94a3b8; margin-bottom:6px;"></i>
                    <div style="font-size:12.5px; font-weight:800; color:#334155;">Ambil Foto Kamera / Unggah Berkas</div>
                    <div style="font-size:11px; color:#64748b; margin-top:2px;">Bukti bahwa Anda sudah berada di lokasi customer</div>
                  `}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display:flex; justify-content:flex-end; gap:10px; border-top:1px solid #e2e8f0; padding-top:16px;">
              <button type="button" onclick="document.getElementById('radarFollowupModalOverlay').remove()" style="padding:9px 18px; border-radius:10px; border:1px solid #cbd5e1; background:#ffffff; color:#475569; font-weight:800; font-size:12.5px; cursor:pointer;">
                Batal
              </button>
              <button type="submit" id="btnSubmitRadarFu" style="padding:9px 22px; border-radius:10px; border:none; background:linear-gradient(135deg, #10b981 0%, #059669 100%); color:#ffffff; font-weight:800; font-size:12.5px; cursor:pointer; box-shadow:0 4px 14px rgba(16,185,129,0.35); display:inline-flex; align-items:center; gap:6px;">
                <i class="fa-solid fa-floppy-disk"></i> Simpan Progres
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  },

  handleRadarPhotoSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    this.selectedPhotoFile = file;

    const reader = new FileReader();
    reader.onload = (e) => {
      const container = document.getElementById('radarPhotoPreviewContainer');
      if (container) {
        container.innerHTML = `
          <div style="position:relative; display:inline-block;">
            <img src="${e.target.result}" style="max-height:140px; border-radius:10px; box-shadow:0 4px 12px rgba(0,0,0,0.15);">
            <button type="button" onclick="event.stopPropagation(); SalesSuperpowers.removeRadarPhoto();" style="position:absolute; top:-8px; right:-8px; background:#ef4444; color:#fff; border:none; width:24px; height:24px; border-radius:50%; cursor:pointer; font-size:12px;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div style="font-size:11px; color:#059669; font-weight:800; margin-top:6px;"><i class="fa-solid fa-circle-check"></i> Foto Siap Diunggah</div>
        `;
      }
    };
    reader.readAsDataURL(file);
  },

  removeRadarPhoto() {
    this.selectedPhotoFile = null;
    const input = document.getElementById('radarVisitPhotoInput');
    if (input) input.value = '';
    const container = document.getElementById('radarPhotoPreviewContainer');
    if (container) {
      container.innerHTML = `
        <i class="fa-solid fa-cloud-arrow-up" style="font-size:28px; color:#94a3b8; margin-bottom:6px;"></i>
        <div style="font-size:12.5px; font-weight:800; color:#334155;">Ambil Foto Kamera / Unggah Berkas</div>
        <div style="font-size:11px; color:#64748b; margin-top:2px;">Bukti bahwa Anda sudah berada di lokasi customer</div>
      `;
    }
  },

  async submitRadarFollowup(event, customerId) {
    event.preventDefault();
    const btn = document.getElementById('btnSubmitRadarFu');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...`;
    }

    try {
      const form = document.getElementById('radarFollowupForm');
      const formData = new FormData(form);

      const res = await fetch(`${this.getApiPrefix()}api_followup.php?action=update_status`, {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        const modal = document.getElementById('radarFollowupModalOverlay');
        if (modal) modal.remove();

        if (typeof showCustomAlert === 'function') {
          showCustomAlert('Berhasil!', 'Progres & Foto Bukti Kunjungan berhasil disimpan.', 'success');
        } else {
          alert('Progres follow up berhasil disimpan.');
        }

        // Refresh Radar Data
        this.fetchRadarData(
          this.salesCoords ? this.salesCoords.lat : -6.9248,
          this.salesCoords ? this.salesCoords.lng : 107.6472,
          this.currentRadius,
          this.currentDistrict
        );
      } else {
        alert(data.message || 'Gagal menyimpan progres.');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Progres`;
        }
      }
    } catch (e) {
      console.error(e);
      alert('Terjadi kesalahan koneksi.');
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<i class="fa-solid fa-floppy-disk"></i> Simpan Progres`;
      }
    }
  }
};

// Global shorthands
window.SalesSuperpowers = SalesSuperpowers;
window.openRadarFollowupModal = (id) => SalesSuperpowers.openRadarFollowupModal(id);
window.submitRadarFollowup = (e, id) => SalesSuperpowers.submitRadarFollowup(e, id);
window.handleRadarPhotoSelect = (e) => SalesSuperpowers.handleRadarPhotoSelect(e);
window.removeRadarPhoto = () => SalesSuperpowers.removeRadarPhoto();
