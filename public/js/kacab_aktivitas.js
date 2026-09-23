// kacab_aktivitas.js — Timeline aktivitas harian seluruh sales cabang,
// dikelompokkan per hari, dengan filter Tanggal / SPV / Sales / tipe / status, Executive KPI, dan modal sales belum lapor.

let activitiesList = [];
let allWiraniagaList = [];
let salesSpvMap = {}; // nama_sales → nama_spv
let currentPhotoList = [];
let currentPhotoIndex = 0;

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getImageUrl(photoStr) {
  if (!photoStr) return '';
  const first = String(photoStr).split(',')[0].trim();
  if (!first) return '';
  if (first.startsWith('http://') || first.startsWith('https://') || first.startsWith('/')) {
    return first;
  }
  if (first.startsWith('uploads/') || first.startsWith('aktivitas/')) {
    return '../' + first;
  }
  if (first.startsWith('../uploads/') || first.startsWith('../aktivitas/')) {
    return first;
  }
  if (first.includes('_lap_')) {
    return '../uploads/laporan/' + first;
  }
  return '../uploads/lokasi/' + first;
}

function activityIcon(tipe) {
  const t = (tipe || '').toLowerCase();
  if (t.includes('tiktok')) return 'fa-video';
  if (t.includes('digital marketing')) return 'fa-share-nodes';
  if (t.includes('database') || t.includes('crm') || t.includes('telepon')) return 'fa-phone';
  if (t.includes('pameran') || t.includes('booth') || t.includes('mall') || t.includes('borma')) return 'fa-store';
  if (t.includes('event') || t.includes('gathering')) return 'fa-champagne-glasses';
  if (t.includes('check-in') || t.includes('kunjungan')) return 'fa-location-dot';
  return 'fa-list-check';
}

function statusClass(status) {
  if (status === 'Rencana') return 'st-rencana';
  if (status === 'Sedang Dilakukan') return 'st-proses';
  return 'st-selesai';
}

function dayLabel(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const sameDay = (a, b) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  if (sameDay(date, today)) return 'Hari Ini';
  if (sameDay(date, yesterday)) return 'Kemarin';
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

async function loadTimeline() {
  const container = document.getElementById('timelineContainer');
  try {
    const [aktRes, wirRes, galRes] = await Promise.all([
      fetch('../api/api_aktivitas.php?limit=500'),
      fetch('../api/api_wiraniaga.php'),
      fetch('../api/api_riwayat_aktivitas_foto.php').catch(() => null)
    ]);
    const aktJson = await aktRes.json();
    const wirJson = await wirRes.json();

    if (wirJson.status === 'success' && Array.isArray(wirJson.data)) {
      allWiraniagaList = wirJson.data;
      wirJson.data.forEach(s => {
        const salesName = (s.nama_lengkap || '').trim();
        salesSpvMap[salesName] = (s.nama_spv || '').trim() || 'Tanpa SPV';
      });
    }

    // Update photo counter
    if (galRes) {
      try {
        const galJson = await galRes.json();
        const photoEl = document.getElementById('kpiFotoPameran');
        if (photoEl && galJson.status === 'success' && galJson.total_all) {
          photoEl.innerHTML = `${galJson.total_all} <small style="font-size:13px; color:#2563eb;">Foto</small>`;
        }
      } catch (ge) {}
    }

    if (aktJson.status === 'success' && Array.isArray(aktJson.data)) {
      activitiesList = aktJson.data;
      updateKpiCards();
      buildFilters();
      applyTimelineFilters();
    } else {
      container.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal memuat aktivitas cabang.</p>';
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal menghubungkan ke server.</p>';
  }
}

function updateKpiCards() {
  const total = activitiesList.length;
  let selesai = 0, proses = 0, rencana = 0;
  activitiesList.forEach(a => {
    if (a.status === 'Selesai') selesai++;
    else if (a.status === 'Sedang Dilakukan') proses++;
    else if (a.status === 'Rencana') rencana++;
  });

  const kpiTotalEl = document.getElementById('kpiTotalAkt');
  if (kpiTotalEl) kpiTotalEl.textContent = total;

  const kpiSelesai = document.getElementById('kpiAktSelesai');
  const kpiProses = document.getElementById('kpiAktProses');
  const kpiRencana = document.getElementById('kpiAktRencana');
  if (kpiSelesai) kpiSelesai.textContent = `${selesai} Selesai`;
  if (kpiProses) kpiProses.textContent = `${proses} Proses`;
  if (kpiRencana) kpiRencana.textContent = `${rencana} Rencana`;

  // Hitung keaktifan sales HARI INI
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeSalesToday = new Set();

  activitiesList.forEach(a => {
    const actDate = String(a.created_at || '').slice(0, 10);
    if (actDate === todayStr && a.nama_sales) {
      activeSalesToday.add(a.nama_sales.trim().toLowerCase());
    }
  });

  const totalWiraniaga = allWiraniagaList.length || 50;
  const aktifCount = activeSalesToday.size;
  const belumCount = Math.max(totalWiraniaga - aktifCount, 0);

  const kpiAktifEl = document.getElementById('kpiSalesAktifHariIni');
  if (kpiAktifEl) kpiAktifEl.innerHTML = `${aktifCount} <small style="font-size:13px; color:#64748b;">/ ${totalWiraniaga} Sales</small>`;

  const kpiAktifPct = document.getElementById('kpiSalesAktifPct');
  if (kpiAktifPct) {
    const pct = totalWiraniaga > 0 ? Math.round((aktifCount / totalWiraniaga) * 100) : 0;
    kpiAktifPct.textContent = `${pct}%`;
  }

  const kpiBelumEl = document.getElementById('kpiSalesBelumLapor');
  if (kpiBelumEl) kpiBelumEl.innerHTML = `${belumCount} <small style="font-size:13px; color:#ef4444;">Sales</small>`;
}

function buildFilters() {
  // Dropdown SPV dari mapping sales → spv
  const spvSelect = document.getElementById('filterSpv');
  if (spvSelect) {
    const currentSpv = spvSelect.value;
    const spvs = [...new Set(Object.values(salesSpvMap))].filter(Boolean).sort();
    spvSelect.innerHTML = '<option value="">Semua SPV</option>' +
      spvs.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    if (spvs.includes(currentSpv)) spvSelect.value = currentSpv;
  }

  // Dropdown Sales Wiraniaga
  populateSalesDropdown();

  // Dropdown tipe dari data aktivitas
  const tipeSelect = document.getElementById('filterTipe');
  if (tipeSelect) {
    const currentTipe = tipeSelect.value;
    const tipes = [...new Set(activitiesList.map(a => a.tipe_aktivitas).filter(Boolean))].sort();
    tipeSelect.innerHTML = '<option value="">Semua Tipe</option>' +
      tipes.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
    if (tipes.includes(currentTipe)) tipeSelect.value = currentTipe;
  }
}

function populateSalesDropdown(selectedSpv = '') {
  const salesSelect = document.getElementById('filterSales');
  if (!salesSelect) return;
  const currentSales = salesSelect.value;

  let salesList = allWiraniagaList;
  if (selectedSpv) {
    salesList = salesList.filter(s => (s.nama_spv || '').trim() === selectedSpv);
  }

  // Urutkan nama abjad
  salesList.sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''));

  let html = '<option value="">Semua Wiraniaga</option>';
  salesList.forEach(s => {
    const name = s.nama_lengkap || '';
    const spv = s.nama_spv ? ` (${s.nama_spv})` : '';
    html += `<option value="${escapeHtml(name)}">${escapeHtml(name + spv)}</option>`;
  });

  salesSelect.innerHTML = html;
  if (currentSales) salesSelect.value = currentSales;
}

function onSpvFilterChange() {
  const spv = document.getElementById('filterSpv')?.value || '';
  populateSalesDropdown(spv);
  applyTimelineFilters();
}

function handleDatePresetChange() {
  const preset = document.getElementById('filterDatePreset')?.value || 'all';
  const customBox = document.getElementById('customDateRangeBox');
  if (customBox) {
    customBox.style.display = (preset === 'custom') ? 'inline-flex' : 'none';
  }
  applyTimelineFilters();
}

function spvOfSales(namaSales) {
  return salesSpvMap[(namaSales || '').trim()] || '';
}

function applyTimelineFilters() {
  const container = document.getElementById('timelineContainer');
  const countEl = document.getElementById('activityCount');
  const q = (document.getElementById('searchActivity')?.value || '').toLowerCase().trim();
  const datePreset = document.getElementById('filterDatePreset')?.value || 'all';
  const spv = document.getElementById('filterSpv')?.value || '';
  const sales = document.getElementById('filterSales')?.value || '';
  const tipe = document.getElementById('filterTipe')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  const dateStart = document.getElementById('dateStart')?.value || '';
  const dateEnd = document.getElementById('dateEnd')?.value || '';

  // Tanggal Hari ini & Kemarin untuk preset
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const yest = new Date();
  yest.setDate(now.getDate() - 1);
  const yestStr = `${yest.getFullYear()}-${String(yest.getMonth() + 1).padStart(2, '0')}-${String(yest.getDate()).padStart(2, '0')}`;

  const d7 = new Date();
  d7.setDate(now.getDate() - 7);
  const d7Str = `${d7.getFullYear()}-${String(d7.getMonth() + 1).padStart(2, '0')}-${String(d7.getDate()).padStart(2, '0')}`;

  const thisMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const filtered = activitiesList.filter(act => {
    const actDateStr = String(act.created_at || '').slice(0, 10);

    // Filter Tanggal
    if (datePreset === 'today' && actDateStr !== todayStr) return false;
    if (datePreset === 'yesterday' && actDateStr !== yestStr) return false;
    if (datePreset === 'last7' && actDateStr < d7Str) return false;
    if (datePreset === 'thisMonth' && !actDateStr.startsWith(thisMonthStr)) return false;
    if (datePreset === 'custom') {
      if (dateStart && actDateStr < dateStart) return false;
      if (dateEnd && actDateStr > dateEnd) return false;
    }

    if (spv && spvOfSales(act.nama_sales) !== spv) return false;
    if (sales && (act.nama_sales || '').trim() !== sales.trim()) return false;
    if (tipe && act.tipe_aktivitas !== tipe) return false;
    if (status && act.status !== status) return false;
    if (q) {
      const hay = `${act.nama_sales || ''} ${act.keterangan || ''} ${act.lokasi || ''} ${act.tipe_aktivitas || ''}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (countEl) {
    countEl.textContent = activitiesList.length
      ? `Menampilkan ${filtered.length} dari ${activitiesList.length} aktivitas`
      : '';
  }

  if (activitiesList.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon"><i class="fa-solid fa-timeline"></i></div>
        <div class="es-title">Belum ada aktivitas terekam</div>
        <div class="es-text">Aktivitas harian sales cabang akan muncul di sini secara real-time.</div>
      </div>`;
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div class="es-title">Tidak ada hasil yang cocok</div>
        <div class="es-text">Coba ubah kata kunci pencarian atau sesuaikan filter rentang tanggal.</div>
      </div>`;
    return;
  }

  // ── Kelompokkan per hari (terbaru dulu) ──
  const byDay = {};
  filtered.forEach(act => {
    const date = new Date(String(act.created_at).replace(/-/g, '/'));
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    if (!byDay[key]) byDay[key] = { date, items: [] };
    byDay[key].items.push(act);
  });

  const dayKeys = Object.keys(byDay).sort().reverse();

  container.innerHTML = dayKeys.map((key, dayIdx) => {
    const { date, items } = byDay[key];
    items.sort((a, b) => new Date(String(b.created_at).replace(/-/g, '/')) - new Date(String(a.created_at).replace(/-/g, '/')));

    const itemsHtml = items.map((act, i) => {
      const index = activitiesList.indexOf(act);
      const actDate = new Date(String(act.created_at).replace(/-/g, '/'));
      const timeStr = actDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const spvName = spvOfSales(act.nama_sales);

      const isPameran = String(act.tipe_aktivitas || '').toLowerCase().includes('pameran') || 
                        String(act.tipe_aktivitas || '').toLowerCase().includes('event') ||
                        String(act.keterangan || '').toLowerCase().includes('pameran');

      let photoHtml = '';
      if (act.foto && String(act.foto).trim() !== '') {
        const imgUrl = getImageUrl(act.foto);
        if (imgUrl) {
          photoHtml = `<img src="${imgUrl}" class="tl-photo" alt="Foto aktivitas"
            loading="lazy" onerror="this.style.display='none'" onclick="zoomImage(event, '${imgUrl}')">`;
        }
      }

      return `
        <div class="tl-item ${statusClass(act.status)}" style="animation-delay:${Math.min(i * 0.04, 0.4)}s;"
          onclick="showActivityDetails(${index})" role="button" tabindex="0"
          onkeydown="if(event.key==='Enter')showActivityDetails(${index})">
          <div class="tl-time">${timeStr}</div>
          <div class="tl-icon"><i class="fa-solid ${activityIcon(act.tipe_aktivitas)}"></i></div>
          <div class="tl-body">
            <div class="tl-top">
              <span class="tl-type">${escapeHtml(act.tipe_aktivitas)}</span>
              <span class="tl-chip"><i class="fa-solid fa-user"></i> ${escapeHtml(act.nama_sales || 'Sales')}</span>
              ${spvName ? `<span class="tl-chip spv"><i class="fa-solid fa-user-tie"></i> ${escapeHtml(spvName)}</span>` : ''}
              ${isPameran ? `<span class="tl-chip gallery-link" onclick="event.stopPropagation(); location.href='riwayat_foto_aktivitas.html';" title="Buka Galeri Foto"><i class="fa-solid fa-images"></i> Galeri Foto</span>` : ''}
              <span class="tl-status ${statusClass(act.status)}">${escapeHtml(act.status)}</span>
            </div>
            <div class="tl-desc">${escapeHtml(act.keterangan || '')}</div>
            
            ${act.laporan_hasil ? `
              <div style="margin-top:6px; background:#f0fdf4; border-left:3px solid #10b981; padding:4px 8px; border-radius:4px; font-size:11.5px; color:#166534;">
                <strong>Hasil:</strong> ${escapeHtml(act.laporan_hasil)}
                ${act.jumlah_prospek ? ` &bull; <strong>${act.jumlah_prospek} Prospek</strong>` : ''}
              </div>
            ` : ''}

            <div class="tl-meta">
              <span><i class="fa-solid fa-location-dot"></i>${escapeHtml(act.lokasi || 'Lokasi tidak terekam')}</span>
              ${act.durasi ? `<span><i class="fa-solid fa-hourglass-half"></i>${escapeHtml(act.durasi)}</span>` : ''}
            </div>
          </div>
          ${photoHtml}
        </div>`;
    }).join('');

    return `
      <div class="tl-day" style="animation-delay:${dayIdx * 0.06}s;">
        <div class="tl-day-head">
          <span class="tl-day-chip"><i class="fa-solid fa-calendar-day"></i> ${dayLabel(date)}</span>
          <span class="tl-day-count">${items.length} aktivitas</span>
        </div>
        <div class="tl-items">${itemsHtml}</div>
      </div>`;
  }).join('');
}

// ── Detail modal ───────────────────────────────────────
function showActivityDetails(index) {
  const act = activitiesList[index];
  if (!act) return;

  document.getElementById('detIcon').className = `fa-solid ${activityIcon(act.tipe_aktivitas)}`;
  document.getElementById('detNamaSalesVal').textContent = act.nama_sales || 'Sales Consultant';
  document.getElementById('detSpvVal').textContent = spvOfSales(act.nama_sales) || '-';
  document.getElementById('detTipeVal').textContent = act.tipe_aktivitas;
  document.getElementById('detKeteranganVal').textContent = act.keterangan;
  document.getElementById('detLokasiVal').textContent = act.lokasi || 'Lokasi tidak terekam';

  const statusBadge = document.getElementById('detStatusBadge');
  statusBadge.textContent = act.status;
  if (act.status === 'Rencana') {
    statusBadge.className = 'badge badge-pending';
  } else if (act.status === 'Sedang Dilakukan') {
    statusBadge.className = 'badge badge-waiting';
  } else {
    statusBadge.className = 'badge badge-approved';
  }

  const date = new Date(String(act.created_at).replace(/-/g, '/'));
  const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  document.getElementById('detTime').innerHTML = `<i class="fa-regular fa-clock"></i> ${timeStr}`;

  const mapBtn = document.getElementById('detMapBtn');
  if (act.lokasi && act.lokasi.trim() !== '') {
    mapBtn.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(act.lokasi)}`;
    mapBtn.style.display = 'flex';
  } else {
    mapBtn.style.display = 'none';
  }

  const photoArea = document.getElementById('detPhotoArea');
  const noPhotoBanner = document.getElementById('detNoPhotoBanner');
  const thumbs = document.getElementById('detThumbs');

  currentPhotoList = [];
  if (act.foto && String(act.foto).trim() !== '') {
    const list = String(act.foto).split(',').map(s => s.trim()).filter(Boolean);
    currentPhotoList = list.map(f => getImageUrl(f));
  }
  if (act.foto_laporan && String(act.foto_laporan).trim() !== '') {
    const lapList = String(act.foto_laporan).split(',').map(s => s.trim()).filter(Boolean);
    currentPhotoList = currentPhotoList.concat(lapList.map(f => getImageUrl(f)));
  }

  if (currentPhotoList.length > 0) {
    photoArea.style.display = 'block';
    if (noPhotoBanner) noPhotoBanner.style.display = 'none';
    currentPhotoIndex = 0;
    document.getElementById('detMainPhoto').src = currentPhotoList[0];

    if (currentPhotoList.length > 1) {
      thumbs.innerHTML = currentPhotoList.map((url, i) => `
        <img src="${url}" class="detail-thumb ${i === 0 ? 'active' : ''}"
          onclick="switchDetailPhoto(${i})" alt="Thumb ${i + 1}">
      `).join('');
      thumbs.style.display = 'flex';
    } else {
      thumbs.style.display = 'none';
    }
  } else {
    photoArea.style.display = 'none';
    if (noPhotoBanner) noPhotoBanner.style.display = 'flex';
  }

  document.getElementById('activityDetailModal').classList.add('open');
}

function switchDetailPhoto(index) {
  currentPhotoIndex = index;
  document.getElementById('detMainPhoto').src = currentPhotoList[index];
  document.querySelectorAll('.detail-thumb').forEach((th, i) => {
    th.classList.toggle('active', i === index);
  });
}

function closeActivityDetail() {
  document.getElementById('activityDetailModal').classList.remove('open');
}

function zoomMainPhoto() {
  if (currentPhotoList[currentPhotoIndex]) {
    zoomImage(null, currentPhotoList[currentPhotoIndex]);
  }
}

function zoomImage(event, url) {
  if (event) event.stopPropagation();
  document.getElementById('zoomedImg').src = url;
  document.getElementById('imageZoomModal').classList.add('open');
}

function closeImageZoom() {
  document.getElementById('imageZoomModal').classList.remove('open');
}

// ── Modal Sales Belum Lapor Hari Ini ─────────────────────
function openBelumLaporModal() {
  const modal = document.getElementById('belumLaporModal');
  const listEl = document.getElementById('belumLaporList');
  const countBadge = document.getElementById('belumLaporCountBadge');
  if (!modal || !listEl) return;

  const todayStr = new Date().toISOString().slice(0, 10);
  const activeSales = new Set();

  activitiesList.forEach(a => {
    const actDate = String(a.created_at || '').slice(0, 10);
    if (actDate === todayStr && a.nama_sales) {
      activeSales.add(a.nama_sales.trim().toLowerCase());
    }
  });

  const missingSales = allWiraniagaList.filter(s => {
    const sName = (s.nama_lengkap || '').trim().toLowerCase();
    return sName && !activeSales.has(sName);
  });

  missingSales.sort((a, b) => (a.nama_spv || '').localeCompare(b.nama_spv || '') || (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''));

  if (countBadge) {
    countBadge.textContent = `${missingSales.length} Wiraniaga Belum Lapor Hari Ini`;
  }

  if (missingSales.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:35px 20px;">
        <i class="fa-solid fa-circle-check" style="font-size:36px; color:#10b981; margin-bottom:10px;"></i>
        <div style="font-weight:800; font-size:15px; color:#0f172a;">Luar Biasa! Seluruh Sales Sudah Lapor</div>
        <p style="font-size:12px; color:#64748b; margin:4px 0 0 0;">Semua 50 wiraniaga cabang telah mencatat aktivitas hari ini.</p>
      </div>`;
  } else {
    listEl.innerHTML = missingSales.map(s => {
      const name = s.nama_lengkap || 'Sales';
      const spv = s.nama_spv || 'Supervisor';
      const phone = (s.no_hp || '').replace(/[^0-9]/g, '');
      const waMsg = encodeURIComponent(`Halo ${name}, mohon segera input laporan aktivitas harian Anda hari ini di aplikasi Tunas Hub. Terima kasih - Kepala Cabang.`);
      const waLink = phone ? `https://wa.me/${phone.startsWith('0') ? '62' + phone.slice(1) : phone}?text=${waMsg}` : '#';

      return `
        <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:10px 14px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:50%; background:#fee2e2; color:#ef4444; display:flex; align-items:center; justify-content:center; font-weight:800; font-size:14px;">
              ${name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style="font-weight:800; font-size:13px; color:#0f172a;">${escapeHtml(name)}</div>
              <div style="font-size:11px; color:#64748b;">SPV: <strong style="color:#1e293b;">${escapeHtml(spv)}</strong></div>
            </div>
          </div>
          <div>
            ${phone ? `
              <a href="${waLink}" target="_blank" style="background:#25D366; color:#ffffff; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(37,211,102,0.25);">
                <i class="fa-brands fa-whatsapp"></i> Ingatkan WA
              </a>
            ` : `<span style="font-size:11px; color:#94a3b8; font-weight:600;">No HP -</span>`}
          </div>
        </div>`;
    }).join('');
  }

  modal.style.display = 'flex';
}

function closeBelumLaporModal() {
  const modal = document.getElementById('belumLaporModal');
  if (modal) modal.style.display = 'none';
}

function broadcastTeguranSPV() {
  const text = encodeURIComponent(`*PEMBERITAHUAN KEPALA CABANG*\n\nBapak/Ibu SPV, mohon ingatkan anggota tim wiraniaga masing-masing yang belum mengisi aktivitas dan check-in harian hari ini agar segera melengkapi laporan di aplikasi Tunas Hub sebelum pukul 17:00 WIB.\n\nTerima kasih atas kerja samanya.\n*Kepala Cabang Tunas Toyota Kiara Condong*`);
  window.open(`https://web.whatsapp.com/send?text=${text}`, '_blank');
}

document.addEventListener('DOMContentLoaded', () => {
  loadTimeline();
});
