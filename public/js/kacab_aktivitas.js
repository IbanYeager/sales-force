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
          <div style="display:flex; gap:6px; align-items:center;">
            <button type="button" onclick="openInputAktivitasForSales('${escapeHtml(s.id)}', '${escapeHtml(name)}')" style="background:#cc1426; color:#ffffff; padding:6px 11px; border:none; border-radius:8px; font-size:11px; font-weight:800; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(204,20,38,0.25);">
              <i class="fa-solid fa-plus"></i> Inputkan
            </button>
            ${phone ? `
              <a href="${waLink}" target="_blank" style="background:#25D366; color:#ffffff; padding:6px 12px; border-radius:8px; font-size:11px; font-weight:800; text-decoration:none; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(37,211,102,0.25);">
                <i class="fa-brands fa-whatsapp"></i> WA
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

// ── Input Aktivitas Sales oleh Kacab ─────────────────────
// ── Input Aktivitas Sales oleh Kacab (Searchable Combobox) ───
let selectedInputPhotos = [];
let salesComboboxActiveIndex = -1;
let currentFilteredSales = [];

function highlightSearchMatch(text, query) {
  if (!text) return '';
  if (!query) return escapeHtml(text);
  const qClean = query.trim();
  if (!qClean) return escapeHtml(text);
  
  const escapedText = escapeHtml(text);
  const escapedQuery = escapeHtml(qClean);
  const regex = new RegExp(`(${escapedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escapedText.replace(regex, '<span class="sales-search-highlight">$1</span>');
}

function openSalesDropdown() {
  const menu = document.getElementById('salesDropdownMenu');
  if (!menu) return;
  filterSalesDropdown();
  menu.style.display = 'flex';
}

function closeSalesDropdown() {
  const menu = document.getElementById('salesDropdownMenu');
  if (menu) menu.style.display = 'none';
  salesComboboxActiveIndex = -1;
}

function filterSalesDropdown() {
  const searchInput = document.getElementById('modalSalesSearchInput');
  const btnClear = document.getElementById('btnClearSalesSearch');
  const listEl = document.getElementById('salesDropdownList');
  const countEl = document.getElementById('salesDropdownCount');
  if (!listEl) return;

  const query = (searchInput?.value || '').trim().toLowerCase();
  if (btnClear) {
    btnClear.style.display = (searchInput && searchInput.value) ? 'flex' : 'none';
  }

  // Filter wiraniaga
  const sorted = [...allWiraniagaList].sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''));
  if (!query) {
    currentFilteredSales = sorted;
  } else {
    currentFilteredSales = sorted.filter(s => {
      const name = (s.nama_lengkap || '').toLowerCase();
      const spv = (s.nama_spv || '').toLowerCase();
      const tingkatan = (s.tingkatan || '').toLowerCase();
      return name.includes(query) || spv.includes(query) || tingkatan.includes(query);
    });
  }

  if (countEl) {
    countEl.textContent = query 
      ? `Ditemukan ${currentFilteredSales.length} wiraniaga` 
      : `Pilih wiraniaga (${sorted.length} sales cabang)`;
  }

  const selectedId = document.getElementById('modalInputSales')?.value;

  if (currentFilteredSales.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:18px 12px; color:#64748b; font-size:12px;">
        <i class="fa-solid fa-user-xmark" style="font-size:22px; color:#cbd5e1; margin-bottom:6px; display:block;"></i>
        <div>Tidak ada wiraniaga dengan kata kunci "<strong>${escapeHtml(query)}</strong>"</div>
        <div style="font-size:11px; color:#94a3b8; margin-top:2px;">Coba ketik nama panggilan atau nama SPV</div>
      </div>`;
    salesComboboxActiveIndex = -1;
    return;
  }

  listEl.innerHTML = currentFilteredSales.map((s, idx) => {
    const isSelected = String(s.id) === String(selectedId);
    const initial = (s.nama_lengkap || 'S').charAt(0).toUpperCase();
    const highName = highlightSearchMatch(s.nama_lengkap || '', query);
    const highSpv = highlightSearchMatch(s.nama_spv || 'Tanpa SPV', query);

    return `
      <div class="sales-dropdown-item ${isSelected ? 'is-selected' : ''}" 
           id="salesDropdownItem_${idx}"
           onmouseenter="setSalesDropdownActive(${idx})"
           onclick="selectSalesItem('${escapeHtml(s.id)}', '${escapeHtml(s.nama_lengkap)}', '${escapeHtml(s.nama_spv || '-')}', '${escapeHtml(s.tingkatan || 'Executive')}')">
        <div class="sales-item-left">
          <div class="sales-item-avatar">${initial}</div>
          <div class="sales-item-info">
            <div class="sales-item-name">${highName}</div>
            <div class="sales-item-spv">SPV: <strong style="color:#334155;">${highSpv}</strong></div>
          </div>
        </div>
        <div class="sales-item-right">
          <span class="badge-tingkatan">${escapeHtml(s.tingkatan || 'Executive')}</span>
          ${isSelected ? '<i class="fa-solid fa-check" style="color:#cc1426; font-size:12px;"></i>' : ''}
        </div>
      </div>
    `;
  }).join('');

  salesComboboxActiveIndex = -1;
}

function setSalesDropdownActive(idx) {
  const prev = document.getElementById(`salesDropdownItem_${salesComboboxActiveIndex}`);
  if (prev) prev.classList.remove('is-focused');
  
  salesComboboxActiveIndex = idx;
  const curr = document.getElementById(`salesDropdownItem_${salesComboboxActiveIndex}`);
  if (curr) curr.classList.add('is-focused');
}

function handleSalesKeyDown(e) {
  const menu = document.getElementById('salesDropdownMenu');
  if (!menu || menu.style.display === 'none') {
    if (e.key === 'ArrowDown' || e.key === 'Enter') {
      openSalesDropdown();
      e.preventDefault();
      return;
    }
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (currentFilteredSales.length === 0) return;
    const nextIdx = (salesComboboxActiveIndex + 1) % currentFilteredSales.length;
    setSalesDropdownActive(nextIdx);
    const curr = document.getElementById(`salesDropdownItem_${nextIdx}`);
    if (curr) curr.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (currentFilteredSales.length === 0) return;
    const prevIdx = (salesComboboxActiveIndex - 1 + currentFilteredSales.length) % currentFilteredSales.length;
    setSalesDropdownActive(prevIdx);
    const curr = document.getElementById(`salesDropdownItem_${prevIdx}`);
    if (curr) curr.scrollIntoView({ block: 'nearest' });
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (salesComboboxActiveIndex >= 0 && salesComboboxActiveIndex < currentFilteredSales.length) {
      const s = currentFilteredSales[salesComboboxActiveIndex];
      selectSalesItem(s.id, s.nama_lengkap, s.nama_spv || '-', s.tingkatan || 'Executive');
    } else if (currentFilteredSales.length === 1) {
      const s = currentFilteredSales[0];
      selectSalesItem(s.id, s.nama_lengkap, s.nama_spv || '-', s.tingkatan || 'Executive');
    }
  } else if (e.key === 'Escape') {
    closeSalesDropdown();
  }
}

function selectSalesItem(id, nama, spv, tingkatan) {
  const hiddenId = document.getElementById('modalInputSales');
  const hiddenNama = document.getElementById('modalInputNamaSales');
  const searchInput = document.getElementById('modalSalesSearchInput');
  const chipCard = document.getElementById('salesSelectedInfoCard');
  const btnClear = document.getElementById('btnClearSalesSearch');

  if (hiddenId) hiddenId.value = id;
  if (hiddenNama) hiddenNama.value = nama;
  if (searchInput) searchInput.value = nama;
  if (btnClear) btnClear.style.display = 'flex';

  if (chipCard) {
    chipCard.style.display = 'flex';
    const avatarEl = document.getElementById('salesCardAvatar');
    if (avatarEl) avatarEl.textContent = (nama.charAt(0) || 'S').toUpperCase();
    const namaEl = document.getElementById('salesCardNama');
    if (namaEl) namaEl.textContent = nama;
    const spvEl = document.getElementById('salesCardSpv');
    if (spvEl) spvEl.textContent = spv || '-';
    const tingkatanEl = document.getElementById('salesCardTingkatan');
    if (tingkatanEl) tingkatanEl.textContent = tingkatan || 'Executive';
  }

  closeSalesDropdown();
}

function clearSalesSearch(refocus = true) {
  const hiddenId = document.getElementById('modalInputSales');
  const hiddenNama = document.getElementById('modalInputNamaSales');
  const searchInput = document.getElementById('modalSalesSearchInput');
  const chipCard = document.getElementById('salesSelectedInfoCard');
  const btnClear = document.getElementById('btnClearSalesSearch');

  if (hiddenId) hiddenId.value = '';
  if (hiddenNama) hiddenNama.value = '';
  if (searchInput) searchInput.value = '';
  if (btnClear) btnClear.style.display = 'none';
  if (chipCard) chipCard.style.display = 'none';

  if (refocus && searchInput) {
    searchInput.focus();
    openSalesDropdown();
  } else {
    closeSalesDropdown();
  }
}

function focusAndChangeSales() {
  const searchInput = document.getElementById('modalSalesSearchInput');
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
    openSalesDropdown();
  }
}

function populateInputSalesDropdown() {
  filterSalesDropdown();
}

function onInputSalesSelected() {
  // Ditangani oleh selectSalesItem
}

function openInputAktivitasModal(preselectedSalesId = null) {
  const modal = document.getElementById('inputAktivitasModal');
  if (!modal) return;
  
  // Reset fields
  const form = document.getElementById('formInputAktivitas');
  if (form) form.reset();
  selectedInputPhotos = [];
  renderFotoPreviews();
  
  // Reset pilihan sales
  clearSalesSearch(false);
  
  // Set default date to today
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const tglEl = document.getElementById('modalInputTanggal');
  if (tglEl) tglEl.value = todayStr;
  
  // Set Indonesian 24-hour time to current time
  setCurrentTimeIndo();
  
  // If preselected sales ID provided
  if (preselectedSalesId) {
    const s = allWiraniagaList.find(item => 
      String(item.id) === String(preselectedSalesId) || 
      (item.nama_lengkap || '').toLowerCase() === String(preselectedSalesId).toLowerCase()
    );
    if (s) {
      selectSalesItem(s.id, s.nama_lengkap, s.nama_spv || '-', s.tingkatan || 'Executive');
    }
  }
  
  modal.style.display = 'flex';
}

function closeInputAktivitasModal() {
  const modal = document.getElementById('inputAktivitasModal');
  if (modal) modal.style.display = 'none';
}

function openInputAktivitasForSales(salesId, salesName) {
  closeBelumLaporModal();
  openInputAktivitasModal(salesId);
}

function setInputDatePreset(preset) {
  const tglEl = document.getElementById('modalInputTanggal');
  if (!tglEl) return;
  const now = new Date();
  if (preset === 'yesterday') {
    now.setDate(now.getDate() - 1);
  }
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  tglEl.value = dateStr;
}

function setCurrentTimeIndo() {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = now.getMinutes();
  const mRounded = String(Math.floor(m / 5) * 5).padStart(2, '0');
  
  const jamSel = document.getElementById('modalSelectJam');
  const menSel = document.getElementById('modalSelectMenit');
  if (jamSel) jamSel.value = h;
  if (menSel) menSel.value = mRounded;
  onTimeIndoChange(true);
}

function onTimeIndoChange(syncSesi = true) {
  const jamSel = document.getElementById('modalSelectJam');
  const menSel = document.getElementById('modalSelectMenit');
  const hiddenJam = document.getElementById('modalInputJam');
  const previewVal = document.getElementById('timePreviewIndoVal');
  if (!jamSel || !menSel) return;
  
  const jam = jamSel.value;
  const menit = menSel.value;
  const timeStr = `${jam}:${menit}`;
  if (hiddenJam) hiddenJam.value = timeStr;
  
  const optText = jamSel.options[jamSel.selectedIndex]?.text || '';
  const match = optText.match(/\(([^)]+)\)/);
  const contextLabel = match ? match[1] : '';
  
  if (previewVal) {
    previewVal.textContent = `${timeStr} WIB (${contextLabel})`;
  }
  
  if (syncSesi) {
    const h = parseInt(jam, 10);
    let autoSesi = 'Pagi';
    if (h >= 12 && h < 15.5) autoSesi = 'Siang';
    else if (h >= 15.5) autoSesi = 'Sore';
    
    const radio = document.querySelector(`input[name="sesi_waktu"][value="${autoSesi}"]`);
    if (radio && !radio.checked) {
      radio.checked = true;
      onSesiRadioChange(autoSesi, false);
    }
  }
}

function onSesiRadioChange(sesi, updateTime = true) {
  ['Pagi', 'Siang', 'Sore'].forEach(s => {
    const card = document.getElementById(`cardSesi${s}`);
    if (card) {
      card.classList.toggle('active', s === sesi);
    }
  });

  if (updateTime) {
    const jamSel = document.getElementById('modalSelectJam');
    const menSel = document.getElementById('modalSelectMenit');
    if (jamSel && menSel) {
      if (sesi === 'Pagi') jamSel.value = '09';
      else if (sesi === 'Siang') jamSel.value = '13';
      else if (sesi === 'Sore') jamSel.value = '16';
      menSel.value = '00';
      onTimeIndoChange(false);
    }
  }
}

function onTipeAktivitasChange() {
  const tipeSel = document.getElementById('modalInputTipe');
  const lokasiInput = document.getElementById('modalInputLokasi');
  if (!tipeSel || !lokasiInput) return;
  const val = tipeSel.value.toLowerCase();
  if (!lokasiInput.value || lokasiInput.value === 'Showroom Kiara Condong' || lokasiInput.value === 'Mall Festival Citylink Bandung') {
    if (val.includes('pameran') || val.includes('mall') || val.includes('booth')) {
      lokasiInput.placeholder = 'Misal: Festival Citylink / Kings Shopping Center / Ciwalk';
    } else if (val.includes('follow up') || val.includes('crm')) {
      lokasiInput.placeholder = 'Misal: Showroom Kiara Condong / Call Center CRM';
    } else if (val.includes('canvassing') || val.includes('door')) {
      lokasiInput.placeholder = 'Misal: Kawasan Perumahan / Pertokoan / Borma Cijerah';
    }
  }
}

function addProspekCount(delta) {
  const pEl = document.getElementById('modalInputProspek');
  if (!pEl) return;
  const cur = parseInt(pEl.value, 10) || 0;
  pEl.value = Math.max(0, cur + delta);
}

function handleFotoUploadChange(inputEl) {
  if (!inputEl || !inputEl.files) return;
  const files = Array.from(inputEl.files);
  files.forEach(f => {
    // Hindari duplikat file
    if (!selectedInputPhotos.some(existing => existing.name === f.name && existing.size === f.size)) {
      selectedInputPhotos.push(f);
    }
  });
  renderFotoPreviews();
  inputEl.value = ''; // Reset input agar bisa memilih file tambahan
}

function renderFotoPreviews() {
  const container = document.getElementById('fotoPreviewContainer');
  const grid = document.getElementById('fotoPreviewGrid');
  const label = document.getElementById('fotoCountLabel');
  if (!container || !grid) return;
  
  if (selectedInputPhotos.length === 0) {
    container.style.display = 'none';
    grid.innerHTML = '';
    return;
  }
  
  container.style.display = 'block';
  if (label) label.textContent = `${selectedInputPhotos.length} Foto Terpilih`;
  
  grid.innerHTML = '';
  selectedInputPhotos.forEach((file, idx) => {
    const item = document.createElement('div');
    item.className = 'foto-thumb-item';
    
    const img = document.createElement('img');
    img.alt = file.name;
    const reader = new FileReader();
    reader.onload = e => { img.src = e.target.result; };
    reader.readAsDataURL(file);
    
    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'foto-remove-btn';
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    removeBtn.title = 'Hapus foto ini';
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      removeSelectedPhoto(idx);
    };
    
    item.appendChild(img);
    item.appendChild(removeBtn);
    grid.appendChild(item);
  });
}

function removeSelectedPhoto(idx) {
  selectedInputPhotos.splice(idx, 1);
  renderFotoPreviews();
}

function clearSelectedPhotos() {
  selectedInputPhotos = [];
  renderFotoPreviews();
}

async function submitInputAktivitas(event) {
  event.preventDefault();
  
  const selSales = document.getElementById('modalInputSales');
  if (!selSales || !selSales.value) {
    if (typeof customAlert === 'function') {
      customAlert('Peringatan', 'Silakan pilih wiraniaga terlebih dahulu.', 'warning');
    } else {
      alert('Silakan pilih wiraniaga terlebih dahulu.');
    }
    return;
  }
  
  const ketVal = document.getElementById('modalInputKeterangan')?.value.trim();
  if (!ketVal) {
    if (typeof customAlert === 'function') {
      customAlert('Peringatan', 'Keterangan atau hasil aktivitas wajib diisi.', 'warning');
    } else {
      alert('Keterangan atau hasil aktivitas wajib diisi.');
    }
    return;
  }
  
  const btnSubmit = document.getElementById('btnSubmitInputAktivitas');
  const originalBtnHtml = btnSubmit ? btnSubmit.innerHTML : '';
  if (btnSubmit) {
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan Aktivitas...';
  }
  
  try {
    const formData = new FormData();
    formData.append('sales_account_id', selSales.value);
    formData.append('nama_sales', document.getElementById('modalInputNamaSales')?.value || '');
    formData.append('tanggal', document.getElementById('modalInputTanggal')?.value || '');
    formData.append('jam', document.getElementById('modalInputJam')?.value || '');
    
    const sesiChecked = document.querySelector('input[name="sesi_waktu"]:checked');
    formData.append('sesi_waktu', sesiChecked ? sesiChecked.value : 'Pagi');
    
    formData.append('tipe_aktivitas', document.getElementById('modalInputTipe')?.value || '');
    formData.append('status', document.getElementById('modalInputStatus')?.value || 'Selesai');
    formData.append('lokasi', document.getElementById('modalInputLokasi')?.value || '');
    formData.append('durasi', document.getElementById('modalInputDurasi')?.value || '1 Jam');
    formData.append('jumlah_prospek', '0');
    formData.append('keterangan', ketVal);
    formData.append('laporan_hasil', '');
    
    // Lampirkan multi-foto
    selectedInputPhotos.forEach(file => {
      formData.append('foto[]', file, file.name);
    });
    
    const res = await fetch('../api/api_simpan_aktivitas.php', {
      method: 'POST',
      body: formData
    });
    
    const json = await res.json();
    
    if (json.status === 'success') {
      closeInputAktivitasModal();
      if (typeof customAlert === 'function') {
        customAlert('Berhasil!', json.message || 'Aktivitas wiraniaga berhasil dicatat ke sistem.', 'success');
      } else {
        alert(json.message || 'Aktivitas wiraniaga berhasil disimpan!');
      }
      
      // Muat ulang data timeline dan KPI cards
      await loadTimeline();
    } else {
      if (typeof customAlert === 'function') {
        customAlert('Gagal Menyimpan', json.message || 'Terjadi kendala saat menyimpan aktivitas.', 'error');
      } else {
        alert('Gagal: ' + (json.message || 'Error'));
      }
    }
  } catch (err) {
    console.error('Error submitting activity:', err);
    if (typeof customAlert === 'function') {
      customAlert('Error Sistem', 'Terjadi kesalahan server atau koneksi: ' + err.message, 'error');
    } else {
      alert('Error: ' + err.message);
    }
  } finally {
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = originalBtnHtml;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadTimeline();
  
  // Tutup dropdown combobox saat klik di luar
  document.addEventListener('click', (e) => {
    const wrapper = document.getElementById('salesComboboxWrapper');
    if (wrapper && !wrapper.contains(e.target)) {
      closeSalesDropdown();
    }
  });
});
