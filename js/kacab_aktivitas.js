// kacab_aktivitas.js — Timeline aktivitas harian seluruh sales cabang,
// dikelompokkan per hari, dengan filter SPV / tipe / status dan detail modal.

let activitiesList = [];
let salesSpvMap = {}; // nama_sales → nama_spv
let currentPhotoList = [];
let currentPhotoIndex = 0;

function activityIcon(tipe) {
  if (tipe === 'Live Tiktok') return 'fa-video';
  if (tipe === 'Digital Marketing') return 'fa-share-nodes';
  if (tipe === 'Follow Up Database') return 'fa-phone';
  if (tipe === 'Pameran Display') return 'fa-store';
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
    const [aktRes, wirRes] = await Promise.all([
      fetch('../api/api_aktivitas.php?limit=200'),
      fetch('../api/api_wiraniaga.php')
    ]);
    const aktJson = await aktRes.json();
    const wirJson = await wirRes.json();

    if (wirJson.status === 'success' && Array.isArray(wirJson.data)) {
      wirJson.data.forEach(s => {
        salesSpvMap[(s.nama_lengkap || '').trim()] = (s.nama_spv || '').trim() || 'Tanpa SPV';
      });
    }

    if (aktJson.status === 'success' && Array.isArray(aktJson.data)) {
      activitiesList = aktJson.data;
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

function buildFilters() {
  // Dropdown tipe dari data yang ada
  const tipeSelect = document.getElementById('filterTipe');
  const currentTipe = tipeSelect.value;
  const tipes = [...new Set(activitiesList.map(a => a.tipe_aktivitas).filter(Boolean))].sort();
  tipeSelect.innerHTML = '<option value="">Semua Tipe</option>' +
    tipes.map(t => `<option value="${escapeHtml(t)}">${escapeHtml(t)}</option>`).join('');
  if (tipes.includes(currentTipe)) tipeSelect.value = currentTipe;

  // Dropdown SPV dari mapping sales → spv
  const spvSelect = document.getElementById('filterSpv');
  const currentSpv = spvSelect.value;
  const spvs = [...new Set(Object.values(salesSpvMap))].sort();
  spvSelect.innerHTML = '<option value="">Semua SPV</option>' +
    spvs.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
  if (spvs.includes(currentSpv)) spvSelect.value = currentSpv;
}

function spvOfSales(namaSales) {
  return salesSpvMap[(namaSales || '').trim()] || '';
}

function applyTimelineFilters() {
  const container = document.getElementById('timelineContainer');
  const countEl = document.getElementById('activityCount');
  const q = (document.getElementById('searchActivity')?.value || '').toLowerCase().trim();
  const spv = document.getElementById('filterSpv')?.value || '';
  const tipe = document.getElementById('filterTipe')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';

  const filtered = activitiesList.filter(act => {
    if (spv && spvOfSales(act.nama_sales) !== spv) return false;
    if (tipe && act.tipe_aktivitas !== tipe) return false;
    if (status && act.status !== status) return false;
    if (q) {
      const hay = `${act.nama_sales || ''} ${act.keterangan || ''} ${act.lokasi || ''}`.toLowerCase();
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
        <div class="es-text">Aktivitas harian sales cabang akan muncul di sini.</div>
      </div>`;
    return;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="es-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
        <div class="es-title">Tidak ada hasil yang cocok</div>
        <div class="es-text">Coba ubah kata kunci atau filter Anda.</div>
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
    // Urutkan aktivitas dalam hari: terbaru di atas
    items.sort((a, b) => new Date(String(b.created_at).replace(/-/g, '/')) - new Date(String(a.created_at).replace(/-/g, '/')));

    const itemsHtml = items.map((act, i) => {
      const index = activitiesList.indexOf(act);
      const actDate = new Date(String(act.created_at).replace(/-/g, '/'));
      const timeStr = actDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const spvName = spvOfSales(act.nama_sales);

      let photoHtml = '';
      if (act.foto) {
        const files = String(act.foto).split(',');
        if (files[0].trim() !== '') {
          photoHtml = `<img src="../uploads/lokasi/${files[0].trim()}" class="tl-photo" alt="Foto aktivitas"
            loading="lazy" onclick="zoomImage(event, '../uploads/lokasi/${files[0].trim()}')">`;
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
              <span class="tl-status ${statusClass(act.status)}">${escapeHtml(act.status)}</span>
            </div>
            <div class="tl-desc">${escapeHtml(act.keterangan || '')}</div>
            <div class="tl-meta">
              <span><i class="fa-solid fa-location-dot"></i>${escapeHtml(act.lokasi || 'Lokasi tidak terekam')}</span>
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
  const thumbs = document.getElementById('detThumbs');

  currentPhotoList = [];
  currentPhotoIndex = 0;

  if (act.foto && String(act.foto).trim() !== '') {
    currentPhotoList = String(act.foto).split(',').map(f => `../uploads/lokasi/${f.trim()}`);
    document.getElementById('detMainPhoto').src = currentPhotoList[0];
    photoArea.style.display = 'flex';

    if (currentPhotoList.length > 1) {
      thumbs.style.display = 'flex';
      thumbs.innerHTML = currentPhotoList.map((src, i) => `
        <div class="detail-thumb ${i === 0 ? 'selected' : ''}" onclick="selectDetailPhoto(event, ${i})">
          <img src="${src}" alt="Thumbnail ${i + 1}">
        </div>
      `).join('');
    } else {
      thumbs.style.display = 'none';
    }
  } else {
    photoArea.style.display = 'none';
  }

  document.getElementById('activityDetailModal').style.display = 'flex';
}

function selectDetailPhoto(event, index) {
  if (event) event.stopPropagation();
  currentPhotoIndex = index;
  document.getElementById('detMainPhoto').src = currentPhotoList[index];

  const thumbs = document.getElementById('detThumbs').children;
  for (let i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.toggle('selected', i === index);
  }
}

function zoomMainPhoto() {
  if (currentPhotoList[currentPhotoIndex]) {
    zoomImage(null, currentPhotoList[currentPhotoIndex]);
  }
}

function closeActivityDetail() {
  document.getElementById('activityDetailModal').style.display = 'none';
}

function zoomImage(event, src) {
  if (event) event.stopPropagation();
  document.getElementById('zoomedImg').src = src;
  document.getElementById('imageZoomModal').style.display = 'flex';
}

function closeImageZoom() {
  document.getElementById('imageZoomModal').style.display = 'none';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeImageZoom();
    closeActivityDetail();
  }
});

document.getElementById('activityDetailModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'activityDetailModal') closeActivityDetail();
});

document.getElementById('imageZoomModal')?.addEventListener('click', (e) => {
  if (e.target.id === 'imageZoomModal') closeImageZoom();
});

document.addEventListener('DOMContentLoaded', () => {
  guardKacab();
  renderKacabUser();
  loadTimeline();
});
