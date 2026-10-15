<!DOCTYPE html>
<html lang="id">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sales App - Customer</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <link rel="stylesheet" href="../css/style.css?v={{ time() }}" />
  <script src="../js/sidebar_desktop.js?v={{ time() }}"></script>
  <link rel="stylesheet" href="../css/customer.css?v={{ time() }}">
  <link rel="stylesheet" href="../css/followup.css?v={{ time() }}">
  <link rel="stylesheet" href="../css/sales_tools.css?v={{ time() }}">

  <link rel="manifest" href="../manifest.json">
  <meta name="theme-color" content="#CC0000">
<style id="radarStyles">

/* ==========================================================================
   EXECUTIVE RADAR GPS COCKPIT & LIVE MAP STYLES
   ========================================================================== */

.radar-cockpit-wrapper {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-top: 3px solid #d7123a;
  border-radius: 20px;
  padding: 22px;
  margin-bottom: 22px;
  box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.05), 0 0 0 1px rgba(15, 23, 42, 0.02);
}

/* Header & Radar Sonar Icon */
.radar-cockpit-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.radar-header-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.radar-sonar-icon-wrapper {
  position: relative;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.radar-sonar-wave {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(215, 18, 58, 0.2);
  animation: radar-sonar-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

.radar-sonar-wave.wave-2 {
  animation-delay: 1s;
}

@keyframes radar-sonar-ping {
  0% { transform: scale(0.6); opacity: 0.9; }
  100% { transform: scale(1.9); opacity: 0; }
}

.radar-sonar-center {
  position: relative;
  z-index: 2;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d7123a 0%, #b91c1c 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  box-shadow: 0 4px 12px rgba(215, 18, 58, 0.35);
}

.radar-micro-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #d7123a;
  background: #fff1f2;
  padding: 3px 9px;
  border-radius: 6px;
  margin-bottom: 4px;
}

.radar-header-title {
  font-size: 17.5px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.3px;
}

.radar-header-sub {
  font-size: 12px;
  color: #64748b;
  margin: 3px 0 0 0;
}

/* Header Right - GPS Status */
.radar-header-right {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.radar-gps-live-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11.5px;
  font-weight: 700;
  padding: 7px 14px;
  border-radius: 20px;
  background: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.live-dot-pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
  animation: live-pulse-dot 1.8s infinite;
}

@keyframes live-pulse-dot {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(34, 197, 94, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

.btn-radar-detect {
  padding: 7px 14px;
  font-size: 11.5px;
  font-weight: 800;
  background: #0f172a;
  color: #ffffff;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.15);
}

.btn-radar-detect:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

/* Controls Bar */
.radar-controls-strip {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 14px;
  margin-bottom: 12px;
}

.radar-radius-section {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.radar-radius-label {
  font-size: 11.5px;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.radar-radius-pill-group {
  display: inline-flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  gap: 4px;
  border: 1px solid #e2e8f0;
}

.radar-radius-pill {
  padding: 6px 14px;
  border-radius: 9px;
  font-size: 12px;
  font-weight: 700;
  border: none;
  background: transparent;
  color: #475569;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}

.radar-radius-pill:hover {
  color: #0f172a;
  background: #ffffff;
}

.radar-radius-pill.active {
  background: #0f172a !important;
  color: #ffffff !important;
  font-weight: 800;
  box-shadow: 0 2px 6px rgba(15, 23, 42, 0.2);
}

/* Search bar */
.radar-search-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  max-width: 360px;
  min-width: 240px;
}

.radar-search-input-box {
  position: relative;
  width: 100%;
}

.radar-search-input-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 12px;
  color: #94a3b8;
}

.radar-search-input {
  width: 100%;
  padding: 8px 12px 8px 34px;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  font-size: 12px;
  font-family: inherit;
  outline: none;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.radar-search-input:focus {
  background: #ffffff;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn-radar-search {
  padding: 8px 16px;
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(37, 99, 235, 0.25);
  transition: all 0.15s ease;
}

.btn-radar-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
}

/* Quick Landmark Chips */
.radar-quick-landmarks {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 14px;
}

.radar-landmark-chip {
  font-size: 11px;
  font-weight: 700;
  color: #475569;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.radar-landmark-chip:hover {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

/* Map Container */
.radar-map-outer {
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
  position: relative;
  height: 480px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
}

/* Sales Beacon Marker */
.radar-sales-beacon-icon {
  background: transparent !important;
  border: none !important;
}

.radar-sales-beacon-wrap {
  position: relative;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.radar-beacon-aura {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: rgba(215, 18, 58, 0.35);
  animation: beacon-expand 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes beacon-expand {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(2.6); opacity: 0; }
}

.radar-beacon-core {
  position: relative;
  z-index: 2;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #d7123a;
  border: 3px solid #ffffff;
  box-shadow: 0 0 12px rgba(215, 18, 58, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 11px;
}

/* Customer Pins */
.radar-leaflet-pin-wrap {
  background: transparent !important;
  border: none !important;
}

.radar-map-marker-pin {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2.5px solid #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 10px;
  transition: transform 0.15s ease;
  cursor: pointer;
  position: relative;
}

.radar-map-marker-pin:hover {
  transform: scale(1.3);
  z-index: 9999 !important;
}

/* Map Legend Overlay */
.radar-map-legend-overlay {
  position: absolute;
  bottom: 14px;
  left: 14px;
  z-index: 999;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(226, 232, 240, 0.9);
  padding: 6px 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  font-weight: 700;
  color: #334155;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.radar-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
}

.radar-legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

/* Luxury Leaflet Popup */
.radar-popup-card {
  font-family: 'Plus Jakarta Sans', sans-serif;
  padding: 4px;
  min-width: 210px;
}

.radar-popup-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.radar-popup-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11.5px;
  flex-shrink: 0;
}

.radar-popup-name {
  font-size: 13.5px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  line-height: 1.2;
}

.radar-popup-dist {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.radar-popup-dist-pill {
  font-weight: 800;
  color: #2563eb;
  background: #eff6ff;
  padding: 1px 6px;
  border-radius: 4px;
  margin-left: 4px;
}

.radar-popup-car-box {
  background: #f8fafc;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 10px;
  border: 1px solid #e2e8f0;
}

.radar-popup-actions {
  display: flex;
  gap: 6px;
}

.btn-popup-wa {
  flex: 1;
  background: #10b981;
  color: #ffffff !important;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 11px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-popup-maps {
  flex: 1.2;
  background: #2563eb;
  color: #ffffff !important;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 11px;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-popup-fu {
  background: #0f172a;
  color: #ffffff;
  border: none;
  padding: 6px 10px;
  border-radius: 6px;
  font-weight: 700;
  font-size: 11px;
  cursor: pointer;
}

/* Leads Grid & Cards */
.radar-leads-header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
  flex-wrap: wrap;
  gap: 12px;
}

.radar-count-badge {
  font-size: 11px;
  font-weight: 800;
  background: #fee2e2;
  color: #b91c1c;
  padding: 2px 8px;
  border-radius: 12px;
}

.radar-card-filter-input {
  width: 100%;
  padding: 7px 10px 7px 28px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 12px;
  outline: none;
  background: #ffffff;
}

.radar-leads-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 14px;
}

.radar-lead-card-deluxe {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 16px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.radar-lead-card-deluxe:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border-color: #cbd5e1;
}

.radar-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.radar-customer-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.radar-avatar-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13.5px;
  flex-shrink: 0;
}

.radar-customer-name {
  font-size: 14.5px;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
}

.radar-district-tag {
  font-size: 11.5px;
  color: #64748b;
  margin-top: 2px;
}

.radar-dist-chip {
  background: #eff6ff;
  color: #2563eb;
  font-weight: 800;
  font-size: 11px;
  padding: 4px 9px;
  border-radius: 6px;
  white-space: nowrap;
}

.radar-vehicle-box {
  background: #f8fafc;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 12px;
  margin-bottom: 12px;
  border: 1px solid #f1f5f9;
}

.radar-vehicle-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.radar-tags-row {
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.radar-tag {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 6px;
}

.radar-tag.status-tag {
  border: 1px solid transparent;
}

.radar-action-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
  gap: 8px;
}

.btn-radar-map {
  background: #2563eb;
  color: #fff !important;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 11.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.btn-radar-map:hover {
  background: #1d4ed8;
}

.btn-radar-wa-direct {
  background: #10b981;
  color: #fff !important;
  text-align: center;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 11.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: all 0.15s ease;
}

.btn-radar-wa-direct:hover {
  background: #059669;
}

.btn-radar-fu {
  background: #0f172a;
  color: #fff;
  border: none;
  padding: 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 11.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.btn-radar-fu:hover {
  background: #1e293b;
}

.radar-empty-state {
  text-align: center;
  padding: 40px 20px;
  background: #ffffff;
  border-radius: 18px;
  border: 1.5px dashed #cbd5e1;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.radar-empty-icon {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  font-size: 24px;
}

.radar-empty-title {
  font-size: 15px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px;
}

.radar-empty-desc {
  font-size: 12.5px;
  color: #64748b;
  margin: 0;
}

/* Quick Status Filter Pills for Radar */
.radar-status-filter-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 4px 2px 12px 2px;
  margin-bottom: 8px;
  -webkit-overflow-scrolling: touch;
}

.radar-status-filter-strip::-webkit-scrollbar {
  height: 4px;
}

.radar-status-filter-strip::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.radar-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 13px;
  border-radius: 20px;
  font-size: 11.5px;
  font-weight: 700;
  color: #475569;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.18s ease;
  user-select: none;
}

.radar-status-pill:hover {
  background: #e2e8f0;
  color: #0f172a;
}

.radar-status-pill.active {
  background: #0f172a !important;
  color: #ffffff !important;
  border-color: #0f172a !important;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.25);
}

.radar-status-pill.active .status-dot {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.6);
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.dot-red {
  background: #ef4444;
}

.status-dot.dot-yellow {
  background: #f59e0b;
}

.status-dot.dot-purple {
  background: #8b5cf6;
}

.status-dot.dot-green {
  background: #10b981;
}

/* --- MOBILE & IPHONE XR (≤ 640px) RESPONSIVE OPTIMIZATIONS --- */
@media (max-width: 640px) {
  .radar-status-filter-strip {
    gap: 6px !important;
    padding-bottom: 8px !important;
  }
  .radar-status-pill {
    padding: 5px 10px !important;
    font-size: 11px !important;
  }
  .radar-cockpit-wrapper {
    padding: 14px 12px !important;
    border-radius: 16px !important;
    margin-bottom: 16px !important;
  }
  .radar-cockpit-header {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 12px !important;
    margin-bottom: 12px !important;
    padding-bottom: 12px !important;
  }
  .radar-header-left {
    gap: 10px !important;
  }
  .radar-header-title {
    font-size: 15px !important;
  }
  .radar-header-sub {
    font-size: 11px !important;
  }
  .radar-header-right {
    width: 100% !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 8px !important;
  }
  .radar-gps-live-badge {
    width: 100% !important;
    justify-content: center !important;
    font-size: 11px !important;
    padding: 6px 12px !important;
  }
  .radar-header-btn-row {
    display: grid !important;
    grid-template-columns: 1fr 1fr !important;
    gap: 8px !important;
    width: 100% !important;
  }
  .radar-header-btn-row .btn-radar-detect {
    width: 100% !important;
    justify-content: center !important;
    padding: 8px 10px !important;
    font-size: 11px !important;
  }
  .radar-controls-strip {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 10px !important;
  }
  .radar-radius-section {
    width: 100% !important;
    flex-direction: column !important;
    align-items: flex-start !important;
    gap: 6px !important;
  }
  .radar-radius-pill-group {
    display: flex !important;
    width: 100% !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch !important;
    padding: 3px !important;
  }
  .radar-radius-pill-group::-webkit-scrollbar {
    display: none !important;
  }
  .radar-radius-pill {
    flex: 1 0 auto !important;
    padding: 6px 10px !important;
    font-size: 11px !important;
    text-align: center !important;
  }
  .radar-search-wrap {
    max-width: 100% !important;
    width: 100% !important;
    min-width: 0 !important;
  }
  .radar-quick-landmarks {
    display: flex !important;
    flex-wrap: nowrap !important;
    overflow-x: auto !important;
    scrollbar-width: none !important;
    -webkit-overflow-scrolling: touch !important;
    padding-bottom: 4px !important;
    margin-bottom: 10px !important;
    gap: 6px !important;
  }
  .radar-quick-landmarks::-webkit-scrollbar {
    display: none !important;
  }
  .radar-landmark-chip {
    flex-shrink: 0 !important;
    white-space: nowrap !important;
    font-size: 10.5px !important;
    padding: 5px 9px !important;
  }
  .radar-map-outer {
    height: 380px !important;
    min-height: 380px !important;
    max-height: 380px !important;
    border-radius: 14px !important;
  }
  #radarMapCanvas {
    height: 380px !important;
    min-height: 380px !important;
  }
  .radar-map-legend-overlay {
    bottom: 8px !important;
    left: 8px !important;
    padding: 4px 8px !important;
    gap: 8px !important;
    font-size: 9.5px !important;
    max-width: calc(100% - 16px) !important;
    overflow-x: auto !important;
  }
  .radar-leads-grid {
    grid-template-columns: 1fr !important;
    gap: 10px !important;
  }
  .radar-lead-card-deluxe {
    padding: 13px !important;
    border-radius: 14px !important;
  }
}

</style>
</head>

<body>
  <div class="mobile-app" style="max-width: 1200px;"> <!-- Expanded for kanban -->
    <header class="header-page">
      <a href="../index.html"><i class="fa-solid fa-arrow-left"></i></a>
      <h2>Customer CRM Pipeline</h2>
    </header>

    <div class="container" style="margin-top:18px;">
      <div class="card" style="padding:18px; margin-bottom:16px;">
        <h3 class="section-title" style="margin-bottom:6px;">Manajemen Pipeline</h3>
        <p style="font-size:12px;color:var(--text-muted);line-height:1.6;">Pindahkan (drag & drop) kartu customer antar kolom untuk memperbarui status. Klik kartu untuk mengelola dokumen.</p>

        <div class="form-group" style="margin-top:14px; display:flex; gap:8px;">
          <input class="form-control" type="text" id="searchCustomer" placeholder="Cari nama customer..." style="flex:1;" />
          <button class="btn-main" style="width:auto; padding:10px 16px; font-size:12px; background:var(--primary-blue); border-radius:8px;" onclick="openAddCustomerModal()"><i class="fa-solid fa-plus"></i></button>
        </div>
      </div>

      <!-- ================= JADWAL FOLLOW-UP ================= -->
      <div class="card" style="padding:18px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 class="section-title" style="margin-bottom:0;"><i class="fa-solid fa-calendar-check" style="color:var(--primary-blue); margin-right:6px;"></i>Follow-up Hari Ini</h3>
          <button class="btn-main" style="width:auto; padding:6px 12px; font-size:11px; background:var(--primary-blue);" onclick="openFollowupModal()">+ Tambah</button>
        </div>
        <div id="followupList" style="display:flex; flex-direction:column; gap:10px;">
          <!-- Follow-up items will be generated here -->
          <p style="font-size:12px; color:var(--text-muted); text-align:center;">Memuat data...</p>
        </div>
      </div>

      <!-- ================= LEAD STAGNANT & LOST DEAL ================= -->
      <div class="card" style="padding:16px; margin-bottom:16px; background:linear-gradient(135deg, #fff1f2 0%, #fee2e2 100%); border:1px solid #fecaca;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:#ef4444; color:white; display:flex; align-items:center; justify-content:center; font-size:16px;">
              <i class="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h4 style="font-size:14px; font-weight:800; color:#991b1b; margin:0;">Lead Stagnant (Early Warning)</h4>
              <p style="font-size:11.5px; color:#b91c1c; margin:0;" id="stagnantSummaryText">Memeriksa prospek yang tidak di-follow up > 48 jam...</p>
            </div>
          </div>
          <button class="btn-main" style="width:auto; padding:6px 14px; font-size:11px; background:#b91c1c; border-radius:8px;" onclick="filterStagnantLeads()">
            <i class="fa-solid fa-filter"></i> Tampilkan Lead Stagnan
          </button>
        </div>
      </div>

      <!-- ================= KANBAN BOARD ================= -->
      <div class="kanban-board" id="kanbanBoard">
        <!-- Columns will be rendered here -->
      </div>
    </div>
  </div>

  <!-- Modal Lost Deal Logger -->
  <div class="modal-overlay" id="lostDealModal" onclick="closeLostDealModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3 style="display:flex; align-items:center; gap:6px; color:#c8102e;"><i class="fa-solid fa-file-circle-xmark"></i> Catat Lost Deal / Batal</h3>
        <button class="btn-close-modal" onclick="closeLostDealModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <input type="hidden" id="lostCustomerId">
      <div class="form-group" style="margin-top:14px;">
        <label>Nama Customer</label>
        <input type="text" class="form-control" id="lostCustomerName" readonly style="background:#f1f5f9; font-weight:700;">
      </div>
      <div class="form-group">
        <label>Alasan Utama Lost Deal <span style="color:red;">*</span></label>
        <select class="form-control" id="lostReason">
          <option value="Kalah Diskon / Ambil di Dealer Toyota Lain">Kalah Diskon / Ambil di Dealer Toyota Lain</option>
          <option value="Beli Mobil Brand Lain (Honda/Mitsubishi/Hyundai)">Beli Mobil Brand Lain (Honda/Mitsubishi/Hyundai/Wuling)</option>
          <option value="Aplikasi Leasing Ditolak / Masalah SLIK BI Checking">Aplikasi Leasing Ditolak / Masalah SLIK BI Checking</option>
          <option value="Menunda Pembelian / Belum Ada Dana">Menunda Pembelian / Belum Ada Dana</option>
          <option value="Tidak Ada Respon / No. HP Tidak Aktif">Tidak Ada Respon / No. HP Tidak Aktif</option>
        </select>
      </div>
      <div class="form-group">
        <label>Catatan Tambahan</label>
        <textarea class="form-control" id="lostNote" rows="2" placeholder="Tuliskan catatan detail untuk evaluasi SPV..."></textarea>
      </div>
      <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px; background:#b91c1c;" onclick="saveLostDeal()">Simpan Status Lost Deal</button>
    </div>
  </div>

  <style>
    @keyframes radar-pulse {
      0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
      70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }
  </style>

  <!-- Modal Follow-up -->
  <div class="modal-overlay" id="followupModal" onclick="closeFollowupModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>Tambah Pengingat Follow-up</h3>
        <button class="btn-close-modal" onclick="closeFollowupModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="form-group" style="margin-top:14px;">
        <label>Nama Customer</label>
        <select class="form-control" id="followupName">
          <option value="">-- Pilih Customer --</option>
        </select>
      </div>
      <div class="form-group">
        <label>Waktu Follow-up</label>
        <input type="datetime-local" class="form-control" id="followupTime">
      </div>
      <div class="form-group">
        <div class="voice-input-header">
          <label style="margin-bottom:0; font-weight:700;">Catatan / Ringkasan</label>
          <button type="button" class="btn-voice-pill" id="btnVoiceFollowup" title="Rekam Suara (Speech-to-Text)">
            <i class="fa-solid fa-microphone"></i>
            <span>Dikte Suara</span>
          </button>
        </div>
        <textarea class="form-control" id="followupNote" rows="3" placeholder="Contoh: Tanya jadi ambil warna merah/putih (Bisa diketik atau gunakan tombol Dikte Suara)"></textarea>
        <div id="voiceStatusPillFollowup" class="voice-live-status-box" style="display:none;"></div>
      </div>
      <button class="btn-main" style="width:100%; justify-content:center; margin-top:14px;" onclick="saveFollowup()">Simpan Pengingat</button>
    </div>
  </div>

  <!-- Modal Tambah Customer -->
  <div class="modal-overlay" id="addCustomerModal" onclick="closeAddCustomerModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <div class="modal-header">
        <h3>Tambah Customer Baru</h3>
        <button class="btn-close-modal" onclick="closeAddCustomerModal()"><i class="fa-solid fa-xmark"></i></button>
      </div>

      <!-- Quick OCR KTP Trigger -->
      <div style="margin-top:14px; margin-bottom:14px;">
        <input type="file" id="ocrKtpInputCustomer" accept="image/*" style="display:none;" onchange="SalesSuperpowers.scanKtpFile(this, {nama:'newCustomerName', alamat:'newCustomerAddress'})">
        <div class="ocr-scanner-banner" style="padding:14px 16px; margin-bottom:0;" onclick="document.getElementById('ocrKtpInputCustomer').click()">
          <div class="ocr-banner-left">
            <div class="ocr-icon-glow" style="width:40px; height:40px; font-size:16px;">
              <i class="fa-solid fa-camera"></i>
            </div>
            <div>
              <div class="ocr-badge-chip"><i class="fa-solid fa-bolt"></i> AI OCR</div>
              <h4 class="ocr-banner-title" style="font-size:13.5px;">Scan KTP Otomatis</h4>
            </div>
          </div>
          <button type="button" class="btn-ocr-action" style="padding:8px 14px; font-size:11.5px;" onclick="event.stopPropagation(); document.getElementById('ocrKtpInputCustomer').click()">
            <i class="fa-solid fa-camera"></i> Foto KTP
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Nama Customer <span style="color:red;">*</span></label>
        <input type="text" class="form-control" id="newCustomerName" placeholder="Contoh: Budi Santoso">
      </div>
      <div class="form-group">
        <label>No. Telepon <span style="color:red;">*</span></label>
        <input type="text" class="form-control" id="newCustomerPhone" placeholder="Contoh: 08123456789">
      </div>
      <div class="form-group">
        <label>Alamat <span style="color:red;">*</span></label>
        <textarea class="form-control" id="newCustomerAddress" rows="2" placeholder="Contoh: Jl. Merdeka No. 10"></textarea>
      </div>
      <button class="btn-main" id="btnSaveNewCustomer" style="width:100%; justify-content:center; margin-top:14px;" onclick="saveNewCustomer()">Simpan Customer</button>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <script src="../custom_alert.js?v=25"></script>
  <script src="../js/customer.js?v={{ time() }}"></script>
  <script src="../js/sales_superpowers.js?v={{ time() }}"></script>
  <script src="../js/followup_sales.js?v={{ time() }}"></script>
  <script src="../js/pwa-app.js?v={{ time() }}"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize Voice Note for Follow-up modal
      SalesSuperpowers.initVoiceRecorder('followupNote', 'btnVoiceFollowup', 'voiceStatusPillFollowup');
    });
  </script>
</body>
</html>
