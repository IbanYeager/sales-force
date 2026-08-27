function logoutUser() {
  localStorage.clear();
  window.location.href = '../pages/login_spv.html';
}

function guardSPV() {
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  const peran = localStorage.getItem('peranSales');
  if (!loggedIn) {
    window.location.href = '../pages/login_spv.html';
    return;
  }
  if (peran === 'Kepala Cabang') {
    window.location.href = '../pages_kacab/aktivitas.html';
    return;
  }
  if (peran !== 'Supervisor') {
    window.location.href = '../index.html';
    return;
  }
}

function renderUser() {
  const nama = localStorage.getItem('namaSales') || 'SPV';
  const peran = localStorage.getItem('peranSales') || 'Supervisor';
  document.getElementById('spvNama').textContent = nama;
  document.getElementById('spvRole').textContent = peran;

  const avatar = localStorage.getItem('fotoSales');
  const avatarEl = document.getElementById('spvAvatar');
  avatarEl.src = (avatar && avatar.trim() !== '')
    ? avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=f4f7f6&color=c8102e`;
}

let activitiesList = [];
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

async function loadActivities() {
  const container = document.getElementById('activityContainer');
  try {
    const res = await fetch(`../api/api_aktivitas.php?limit=100`);
    const json = await res.json();
    if (json.status === 'success' && json.data) {
      activitiesList = json.data || [];
      buildTipeFilter();
      applyActivityFilters();
    } else {
      container.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal memuat aktivitas tim.</p>';
    }
  } catch (e) {
    console.error(e);
    container.innerHTML = '<p class="loading-state" style="color:var(--red);">Gagal menghubungkan ke server.</p>';
  }
}

// Isi dropdown "Tipe" dari data yang ada, tanpa duplikat
function buildTipeFilter() {
  const select = document.getElementById('filterTipe');
  if (!select) return;
  const currentVal = select.value;
  const tipes = [...new Set(activitiesList.map(a => a.tipe_aktivitas).filter(Boolean))].sort();
  select.innerHTML = '<option value="">Semua Tipe</option>' +
    tipes.map(t => `<option value="${t}">${t}</option>`).join('');
  if (tipes.includes(currentVal)) select.value = currentVal;
}

function applyActivityFilters() {
  const container = document.getElementById('activityContainer');
  const countEl = document.getElementById('activityCount');
  const q = (document.getElementById('searchActivity')?.value || '').toLowerCase().trim();
  const tipe = document.getElementById('filterTipe')?.value || '';
  const status = document.getElementById('filterStatus')?.value || '';
  const sesi = document.getElementById('filterSesi')?.value || '';

  const filtered = activitiesList.filter(act => {
    if (tipe && act.tipe_aktivitas !== tipe) return false;
    if (status && act.status !== status) return false;
    if (sesi && (act.sesi_waktu || 'Pagi') !== sesi) return false;
    if (q) {
      const hay = `${act.nama_sales || ''} ${act.keterangan || ''} ${act.lokasi || ''} ${act.laporan_hasil || ''}`.toLowerCase();
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
        <div class="es-icon"><i class="fa-solid fa-list-check"></i></div>
        <div class="es-title">Belum ada aktivitas terekam</div>
        <div class="es-text">Aktivitas dari wiraniaga Anda akan muncul di sini.</div>
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

  container.innerHTML = filtered.map(act => {
    const index = activitiesList.indexOf(act);
    const icon = activityIcon(act.tipe_aktivitas);

    let photoHtml = '';
    if (act.foto) {
      const files = act.foto.split(',');
      if (files[0].trim() !== '') {
        photoHtml = `<img src="../uploads/lokasi/${files[0]}" class="activity-photo" alt="Foto aktivitas" onclick="zoomImage(event, '../uploads/lokasi/${files[0]}')">`;
      }
    }

    const date = new Date(act.created_at.replace(/-/g, '/'));
    const timeStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    const sesiName = act.sesi_waktu || 'Pagi';
    const sesiIcon = sesiName === 'Pagi' ? '🌅' : (sesiName === 'Siang' ? '☀️' : '🌆');

    return `
      <div class="activity-card" onclick="showActivityDetails(${index})">
        <div class="activity-icon-box">
          <i class="fa-solid ${icon}"></i>
        </div>
        <div class="activity-details">
          <div class="activity-top">
            <div class="activity-type">${act.tipe_aktivitas}</div>
            <span class="activity-sales-chip">
              <i class="fa-solid fa-user-tie"></i> ${act.nama_sales || 'Sales Consultant'}
            </span>
          </div>
          <div class="activity-meta">
            <span>${sesiIcon} Sesi ${sesiName}</span>
            <span><i class="fa-solid fa-hourglass-half"></i> ${act.durasi || '1 Jam'}</span>
            <span><i class="fa-solid fa-location-dot"></i> ${act.lokasi || 'Lokasi tidak terekam'}</span>
            <span class="activity-status ${statusClass(act.status)}">${act.status}</span>
          </div>
          <div class="activity-desc">${act.keterangan}</div>
          ${act.laporan_hasil ? `
            <div style="background:#f0fdf4; border:1px solid #bbf7d0; border-radius:8px; padding:8px 12px; margin-top:8px; font-size:12px; color:#166534;">
              <strong><i class="fa-solid fa-file-circle-check"></i> Laporan Hasil Aktivitas:</strong> ${act.laporan_hasil}
              ${act.jumlah_prospek > 0 ? `<div style="font-weight:700; margin-top:2px;">Prospek/Leads Didapat: ${act.jumlah_prospek} Person</div>` : ''}
            </div>
          ` : ''}
        </div>
        ${photoHtml}
      </div>
    `;
  }).join('');
}

function showActivityDetails(index) {
  const act = activitiesList[index];
  if (!act) return;

  document.getElementById('detIcon').className = `fa-solid ${activityIcon(act.tipe_aktivitas)}`;
  document.getElementById('detNamaSalesVal').textContent = act.nama_sales || 'Sales Consultant';
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

  const date = new Date(act.created_at.replace(/-/g, '/'));
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

  if (act.foto && act.foto.trim() !== '') {
    currentPhotoList = act.foto.split(',').map(f => `../uploads/lokasi/${f.trim()}`);
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

document.addEventListener('DOMContentLoaded', () => {
  guardSPV();
  renderUser();
  loadActivities();
});
