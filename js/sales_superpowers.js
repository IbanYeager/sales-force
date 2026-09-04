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

  // =========================================================================
  // 1. RADAR PROSPEK TERDEKAT (EXECUTIVE RADAR COCKPIT)
  // =========================================================================
  radarData: [],
  currentRadius: 5,

  async renderRadarCockpit(containerId = 'followupDataContainer', radiusKm = 5) {
    this.currentRadius = radiusKm;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Render Cockpit Shell
    container.innerHTML = `
      <div class="radar-cockpit-hero">
        <div class="radar-top-row">
          <div class="radar-title-wrap">
            <div class="radar-sonar-mini">
              <div class="center-blip"></div>
            </div>
            <div>
              <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                <h3 style="font-size:16px; font-weight:900; margin:0; color:#ffffff;">Radar Prospek Terdekat (Live GPS)</h3>
                <span class="radar-gps-badge" id="radarGpsStatus"><i class="fa-solid fa-satellite-dish"></i> Mendeteksi GPS...</span>
              </div>
              <p style="font-size:12px; color:rgba(255,255,255,0.75); margin:3px 0 0 0;" id="radarSubtitleText">
                Mencari database prospek di sekitar lokasi Anda saat ini untuk rute kunjungan lapangan.
              </p>
            </div>
          </div>

          <!-- Radius Selector Pills -->
          <div class="radar-radius-pills">
            <span style="font-size:11px; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-right:2px;">Radius:</span>
            <button type="button" class="radar-radius-btn ${radiusKm === 1 ? 'active' : ''}" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', 1)">1 KM</button>
            <button type="button" class="radar-radius-btn ${radiusKm === 3 ? 'active' : ''}" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', 3)">3 KM</button>
            <button type="button" class="radar-radius-btn ${radiusKm === 5 ? 'active' : ''}" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', 5)">5 KM</button>
            <button type="button" class="radar-radius-btn ${radiusKm === 10 ? 'active' : ''}" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', 10)">10 KM</button>
            <button type="button" class="radar-radius-btn ${radiusKm === 25 ? 'active' : ''}" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', 25)">25 KM (Bandung)</button>
          </div>
        </div>

        <!-- Radar Quick Search Bar -->
        <div class="radar-search-box-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="radarSearchInput" placeholder="Cari nama prospek, unit mobil, atau kecamatan di radar..." oninput="SalesSuperpowers.filterRadarLeads(this.value)">
          <button type="button" class="btn-fu" style="background:rgba(255,255,255,0.15); color:#fff; border:none; padding:4px 10px; font-size:11px; border-radius:8px; white-space:nowrap;" onclick="SalesSuperpowers.renderRadarCockpit('${containerId}', ${radiusKm})">
            <i class="fa-solid fa-rotate-right"></i> Refresh GPS
          </button>
        </div>
      </div>

      <!-- Radar Lead Cards Container -->
      <div id="radarLeadsContainer">
        <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:18px; border:1px solid #e2e8f0;">
          <div style="width:50px; height:50px; border-radius:50%; border:3px solid #d7123a; border-top-color:transparent; animation:radar-spin 1s linear infinite; margin:0 auto 12px;"></div>
          <p style="font-size:13px; font-weight:700; color:#334155; margin:0;">Memindai titik koordinat &amp; database terdekat...</p>
        </div>
      </div>
    `;

    // Fetch GPS coordinates & data
    if (!navigator.geolocation) {
      this.fetchRadarData(-6.9248, 107.6472, radiusKm);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.salesCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        const badge = document.getElementById('radarGpsStatus');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-location-dot" style="color:#4ade80;"></i> GPS Terkunci (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`;
        this.fetchRadarData(pos.coords.latitude, pos.coords.longitude, radiusKm);
      },
      (err) => {
        console.warn('GPS error, using fallback', err);
        const badge = document.getElementById('radarGpsStatus');
        if (badge) badge.innerHTML = `<i class="fa-solid fa-building"></i> Posisi: Kiara Condong`;
        this.fetchRadarData(-6.9248, 107.6472, radiusKm);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  },

  async fetchRadarData(lat, lng, radiusKm) {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    try {
      const salesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || 0;
      const res = await fetch(`${this.getApiPrefix()}api_customer_radar.php?lat=${lat}&lng=${lng}&radius=${radiusKm}&sales_id=${salesId}`);
      const result = await res.json();

      if (result.status !== 'success' || !result.data || result.data.length === 0) {
        listContainer.innerHTML = `
          <div style="text-align:center; padding:40px 20px; background:#fff; border-radius:18px; border:1.5px dashed #cbd5e1; box-shadow:0 4px 15px rgba(0,0,0,0.03);">
            <div style="width:60px; height:60px; border-radius:50%; background:#f1f5f9; color:#64748b; display:flex; align-items:center; justify-content:center; margin:0 auto 14px; font-size:24px;">
              <i class="fa-solid fa-location-crosshairs"></i>
            </div>
            <h4 style="font-size:15px; font-weight:900; color:#0f172a; margin:0 0 6px;">Tidak Ada Prospek dalam Radius ${radiusKm} KM</h4>
            <p style="font-size:12.5px; color:#64748b; margin:0 0 16px; max-width:400px; margin-inline:auto;">Coba perbesar radius radar untuk mendeteksi database di kecamatan sekitar.</p>
            <div style="display:flex; justify-content:center; gap:8px; flex-wrap:wrap;">
              <button class="btn-fu btn-fu-navy" onclick="SalesSuperpowers.renderRadarCockpit('followupDataContainer', 10)">Perluas Radius 10 KM</button>
              <button class="btn-fu btn-fu-crimson" onclick="SalesSuperpowers.renderRadarCockpit('followupDataContainer', 25)">Perluas Radius 25 KM</button>
            </div>
          </div>
        `;
        this.radarData = [];
        return;
      }

      this.radarData = result.data;
      this.renderRadarLeadCards(this.radarData);

    } catch (e) {
      console.error(e);
      listContainer.innerHTML = `<div class="alert-box-error">Gagal memuat data radar: ${e.message}</div>`;
    }
  },

  renderRadarLeadCards(leads) {
    const listContainer = document.getElementById('radarLeadsContainer');
    if (!listContainer) return;

    if (!leads || leads.length === 0) {
      listContainer.innerHTML = `
        <div style="text-align:center; padding:30px; background:#fff; border-radius:16px; color:#64748b;">
          <i class="fa-solid fa-magnifying-glass" style="font-size:24px; margin-bottom:8px; opacity:0.5;"></i>
          <p style="margin:0; font-weight:700;">Tidak ada prospek yang cocok dengan pencarian.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; flex-wrap:wrap; gap:8px;">
        <span style="font-size:13px; font-weight:800; color:#334155;">
          🎯 Ditemukan <b style="color:#d7123a;">${leads.length} Prospek</b> dalam radius ${this.currentRadius} KM
        </span>
        <span style="font-size:11.5px; color:#64748b;">Urutan: Terdekat dari posisi Anda</span>
      </div>
      <div class="radar-leads-grid">
    `;

    leads.forEach((item, idx) => {
      const initials = (item.name || 'C').split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const isNear = item.distance_km < 1;
      const etaMins = Math.max(2, Math.round(item.distance_km * 2.5));

      html += `
        <div class="radar-lead-card-deluxe">
          <div>
            <div class="radar-card-header">
              <div class="radar-customer-profile">
                <div class="radar-avatar-circle">${initials}</div>
                <div>
                  <h4 class="radar-customer-name">${escapeHtml(item.name)}</h4>
                  <div class="radar-district-tag">
                    <i class="fa-solid fa-location-dot" style="color:#d7123a;"></i> ${escapeHtml(item.district)}
                  </div>
                </div>
              </div>
              <div style="text-align:right;">
                <span class="radar-dist-chip">
                  <i class="fa-solid fa-route"></i> ${item.formatted_distance}
                </span>
                <div style="font-size:10.5px; font-weight:700; color:#64748b; margin-top:3px;">
                  🚗 ~${etaMins} mnt
                </div>
              </div>
            </div>

            <div class="radar-vehicle-box">
              <div class="radar-vehicle-row">
                <i class="fa-solid fa-car-side" style="color:#d7123a;"></i>
                <span><b>Unit Minat:</b> <span style="font-weight:800; color:#0f172a;">${escapeHtml(item.car_model)}</span></span>
              </div>
              <div style="margin-top:4px; font-size:11.5px; color:#64748b; display:flex; justify-content:space-between; align-items:center;">
                <span>Prioritas: <b>${escapeHtml(item.priority || 'Warm')}</b></span>
                <span>Status: <b style="color:#2563eb;">${escapeHtml(item.status || 'Follow Up')}</b></span>
              </div>
            </div>
          </div>

          <div class="radar-action-grid">
            <a href="${item.maps_url}" target="_blank" class="btn-radar-map" title="Buka Navigasi Rute Google Maps">
              <i class="fa-solid fa-map-location-dot"></i> Rute Maps
            </a>
            <a href="${item.wa_url}" target="_blank" class="btn-radar-wa" title="Chat WhatsApp & Rencana Kunjungan">
              <i class="fa-brands fa-whatsapp"></i> Chat &amp; Kunjungi
            </a>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    listContainer.innerHTML = html;
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
    const key = prompt('Kunci Google Gemini AI (Opsional untuk AI Vision 99.9%):\nBiarkan kosong untuk menggunakan Smart Local OCR (Gratis & Cepat).', current);
    if (key !== null) {
      if (key.trim()) {
        localStorage.setItem('sft_gemini_api_key', key.trim());
        if (window.showCustomAlert) {
          window.showCustomAlert('Gemini AI Aktif', 'Kunci Gemini AI berhasil disimpan.', 'success');
        } else {
          alert('Kunci Gemini AI berhasil disimpan.');
        }
      } else {
        localStorage.removeItem('sft_gemini_api_key');
        if (window.showCustomAlert) {
          window.showCustomAlert('Smart Local OCR', 'Kunci AI dihapus, kembali ke OCR Lokal.', 'info');
        }
      }
      this.updateEngineBadge();
    }
  },

  updateEngineBadge() {
    const badgeText = document.getElementById('ocrHeaderEngineText');
    const badgeEl = document.getElementById('ocrHeaderEngineBadge');
    const hasKey = !!localStorage.getItem('sft_gemini_api_key');
    if (badgeText) {
      badgeText.textContent = hasKey ? 'Gemini AI Vision' : 'Smart Local OCR';
    }
    if (badgeEl) {
      badgeEl.style.borderColor = hasKey ? '#10b981' : 'rgba(239,68,68,0.4)';
      badgeEl.style.color = hasKey ? '#34d399' : '#fca5a5';
      badgeEl.title = hasKey ? 'Gemini AI Vision Aktif (Klik untuk ganti kunci)' : 'Klik untuk atur Kunci Gemini AI';
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
    if (this.isProcessingOcr) return;
    const videoEl = document.getElementById('ocrCameraVideo');
    const canvas = document.getElementById('ocrHiddenCanvas') || document.createElement('canvas');

    if (!videoEl || !videoEl.videoWidth) {
      if (manual) alert('Kamera belum siap atau belum aktif.');
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

  async processOcr() {
    if (!this.capturedImageBase64) {
      alert('Silakan ambil atau pilih foto dokumen terlebih dahulu.');
      return;
    }

    this.isProcessingOcr = true;
    const overlay = document.getElementById('ocrScanningOverlay');
    const statusText = document.getElementById('ocrScanningStatusText');
    const preScanActions = document.getElementById('ocrPreScanActions');

    if (overlay) overlay.style.display = 'flex';
    if (preScanActions) preScanActions.style.display = 'none';
    if (statusText) statusText.textContent = 'Mempersiapkan gambar & menghubungkan AI...';

    const apiKey = localStorage.getItem('sft_gemini_api_key') || '';

    try {
      // 1. Panggil API AI OCR Backend
      let res;
      try {
        res = await fetch(`${this.getApiPrefix()}api_ocr_scanner.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: this.capturedImageBase64,
            doc_type: this.ocrDocType,
            api_key: apiKey
          })
        });
      } catch (networkErr) {
        // Coba fallback URL alternatif (misal dari /pages/spk vs /spk)
        const altPrefix = this.getApiPrefix() === 'api/' ? '../api/' : 'api/';
        res = await fetch(`${altPrefix}api_ocr_scanner.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: this.capturedImageBase64,
            doc_type: this.ocrDocType,
            api_key: apiKey
          })
        });
      }

      const result = await res.json();
      console.log('OCR API Response:', result);

      // Jika backend berhasil dengan Gemini Vision
      if (result && result.status === 'success' && result.data && (result.data.nik || result.data.nama || result.data.no_kk)) {
        this.extractedOcrData = result.data;
        this.renderOcrReview(this.extractedOcrData, result.engine || 'Gemini AI Vision');
        return;
      }

      // Jika backend meminta client-side OCR atau data tidak lengkap -> jalankan Tesseract.js
      throw new Error(result.message || 'need_client_ocr');

    } catch (err) {
      console.log('Menjalankan Client OCR Fallback (Tesseract.js):', err);
      if (statusText) statusText.textContent = '🔍 Membaca teks dokumen via Smart OCR lokal...';

      try {
        if (typeof Tesseract === 'undefined') {
          await this.loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
        }

        // Preprocess image agar teks hitam dan kontras tajam
        if (statusText) statusText.textContent = '⚡ Mengoptimalkan kontras karakter & NIK...';
        const preprocessedImg = await this.preprocessImageForOcr(this.capturedImageBase64);

        if (statusText) statusText.textContent = '🤖 Menganalisis karakter dokumen identitas...';
        const ret = await Tesseract.recognize(preprocessedImg, 'eng');
        const text = ret.data.text || '';
        console.log('Tesseract Extracted Text:\n', text);

        // Kirim raw_text ke backend untuk parsing regex mendalam
        let parsed = null;
        try {
          const parseRes = await fetch(`${this.getApiPrefix()}api_ocr_scanner.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              raw_text: text,
              doc_type: this.ocrDocType
            })
          });
          const parseJson = await parseRes.json();
          if (parseJson && parseJson.data) {
            parsed = parseJson.data;
          }
        } catch (backendParseErr) {
          console.warn('Backend parse failed, using client parser:', backendParseErr);
        }

        // Fallback ke parser lokal jika backend tidak merespons
        if (!parsed) {
          parsed = this.parseKtpText(text);
        }

        this.extractedOcrData = parsed;
        this.renderOcrReview(this.extractedOcrData, 'Smart Local OCR Engine');

      } catch (clientErr) {
        console.error('Semua engine OCR gagal:', clientErr);
        if (window.showCustomAlert) {
          window.showCustomAlert('Perhatian', 'Dokumen belum terbaca optimal. Anda dapat memasukkan data secara manual dan foto akan tetap tersimpan sebagai lampiran SPK.', 'info');
        } else {
          alert('Dokumen belum terbaca optimal. Anda tetap dapat memasukkan data manual dan foto tetap terlampir.');
        }

        this.extractedOcrData = {
          nik: '',
          no_kk: '',
          nama: '',
          alamat: ''
        };
        this.renderOcrReview(this.extractedOcrData, 'Manual Review');
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

  applyExtractedDataToForm() {
    const d = this.extractedOcrData || {};

    // 1. Auto-fill kolom identitas
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

    for (const [id, val] of Object.entries(fieldMap)) {
      const el = document.getElementById(id);
      if (el && val) {
        el.value = val;
        // Efek visual highlighting
        el.style.transition = 'background-color 0.3s';
        el.style.backgroundColor = '#ecfdf5';
        setTimeout(() => { el.style.backgroundColor = ''; }, 1500);
      }
    }

    // Scroll ke bagian identitas agar user melihat hasilnya
    const firstField = document.getElementById('spkNik') || document.getElementById('namaCustomer');
    if (firstField) {
      firstField.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 2. Simpan lampiran foto ke hidden input & update card preview
    if (this.capturedImageBase64) {
      if (this.ocrDocType === 'kk') {
        const hidKk = document.getElementById('spkFotoKk');
        if (hidKk) hidKk.value = this.capturedImageBase64;

        const cardKk = document.getElementById('spkDocCardKk');
        const thumbKk = document.getElementById('spkThumbKk');
        const statusKk = document.getElementById('spkStatusKk');
        const btnTextKk = document.getElementById('spkBtnTextKk');

        if (cardKk) cardKk.classList.add('has-file');
        if (thumbKk) thumbKk.innerHTML = `<img src="${this.capturedImageBase64}" alt="KK" />`;
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
        if (thumbKtp) thumbKtp.innerHTML = `<img src="${this.capturedImageBase64}" alt="KTP" />`;
        if (statusKtp) statusKtp.textContent = '✅ e-KTP Terlampir';
        if (btnTextKtp) btnTextKtp.textContent = 'Ganti Foto';
      }
    }

    // Tutup modal
    this.closeOcrModal();

    if (window.showCustomAlert) {
      window.showCustomAlert('✨ Auto-Fill Berhasil!', 'Data identitas ' + (this.ocrDocType === 'kk' ? 'Kartu Keluarga' : 'e-KTP') + ' berhasil dimasukkan ke formulir SPK.', 'success');
    } else {
      alert('Data identitas berhasil dimasukkan ke form SPK!');
    }
  },

  // Backward compatibility method
  async scanKtpFile(fileInput, targetFields = { nik: 'spkNik', nama: 'namaCustomer', alamat: 'spkAlamat' }) {
    if (!fileInput.files || !fileInput.files[0]) return;
    this.handleFileSelect(fileInput);
    this.openOcrModal('ktp');
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
  }
};

// Global shorthand
window.SalesSuperpowers = SalesSuperpowers;
