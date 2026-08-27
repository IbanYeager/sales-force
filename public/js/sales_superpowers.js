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
  async scanKtpFile(fileInput, targetFields = { nik: 'spkNik', nama: 'namaCustomer', alamat: 'newCustomerAddress' }) {
    if (!fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    
    // Show SweetAlert Loading if available
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        title: '📷 Memindai KTP via AI OCR...',
        html: `
          <div style="text-align:center; padding:15px 0;">
            <div style="width:50px; height:50px; border-radius:50%; border:3px solid #d7123a; border-top-color:transparent; animation:radar-spin 1s linear infinite; margin:0 auto 12px;"></div>
            <p style="font-size:13px; color:#475569; margin:0;">Mengekstrak NIK, Nama Lengkap &amp; Alamat dari foto KTP...</p>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false
      });
    }

    try {
      if (typeof Tesseract === 'undefined') {
        await this.loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
      }

      const worker = await Tesseract.createWorker('ind');
      const ret = await worker.recognize(file);
      await worker.terminate();

      const text = ret.data.text;
      console.log('OCR Raw Text:', text);

      // Parse NIK, Name, Address
      const parsed = this.parseKtpText(text);

      if (targetFields.nik && document.getElementById(targetFields.nik) && parsed.nik) {
        document.getElementById(targetFields.nik).value = parsed.nik;
      }
      if (targetFields.nama && document.getElementById(targetFields.nama) && parsed.nama) {
        document.getElementById(targetFields.nama).value = parsed.nama;
      }
      if (targetFields.alamat && document.getElementById(targetFields.alamat) && parsed.alamat) {
        document.getElementById(targetFields.alamat).value = parsed.alamat;
      }

      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'success',
          title: '✨ Scan KTP Berhasil!',
          html: `
            <div style="text-align:left; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; font-size:12.5px; color:#1e293b; margin-top:8px;">
              <div>👤 <b>Nama:</b> ${parsed.nama || '<span style="color:#dc2626;">(Perlu cek manual)</span>'}</div>
              <div style="margin-top:4px;">🆔 <b>NIK:</b> ${parsed.nik || '-'}</div>
              <div style="margin-top:4px;">📍 <b>Alamat:</b> ${parsed.alamat || '-'}</div>
            </div>
            <p style="font-size:12px; color:#16a34a; font-weight:700; margin:10px 0 0 0;">Data berhasil dimasukkan otomatis ke form!</p>
          `,
          confirmButtonColor: '#0d1b3e'
        });
      } else {
        alert(`Scan KTP Berhasil!\nNama: ${parsed.nama}\nNIK: ${parsed.nik}\nAlamat: ${parsed.alamat}`);
      }

    } catch (err) {
      console.error('OCR Error:', err);
      if (typeof Swal !== 'undefined') {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Membaca KTP',
          text: 'Pastikan foto KTP cukup terang, tidak buram, dan teks NIK terbaca jelas.',
          confirmButtonColor: '#0d1b3e'
        });
      } else {
        alert('Gagal memindai KTP. Pastikan foto KTP terlihat jelas.');
      }
    }
  },

  parseKtpText(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    let nik = '', nama = '', alamat = '';

    // 1. Extract NIK (16 digits pattern)
    const nikMatch = text.match(/\b([1-9][0-9]{15})\b/) || text.match(/NIK\D*([0-9\s]{16,20})/i);
    if (nikMatch) {
      nik = nikMatch[1].replace(/\D/g, '').slice(0, 16);
    }

    // 2. Extract Nama
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/nama/i.test(line)) {
        nama = line.replace(/.*nama\s*[:=\-]?\s*/i, '').replace(/[^a-zA-Z\s]/g, '').trim();
        if (!nama && lines[i + 1]) {
          nama = lines[i + 1].replace(/[^a-zA-Z\s]/g, '').trim();
        }
        break;
      }
    }

    // 3. Extract Alamat
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (/alamat/i.test(line)) {
        alamat = line.replace(/.*alamat\s*[:=\-]?\s*/i, '').trim();
        if (lines[i + 1] && !/rt|rw|kel|kec/i.test(lines[i + 1])) {
          alamat += ' ' + lines[i + 1].trim();
        }
        break;
      }
    }

    return { nik, nama, alamat };
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
