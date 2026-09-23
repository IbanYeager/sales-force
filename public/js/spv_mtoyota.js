// js/spv_mtoyota.js
// Monitoring m-Toyota & Booking Service untuk Supervisor (SPV)

let mtoyotaDataCache = [];
let currentSpvName = '';

document.addEventListener('DOMContentLoaded', () => {
  // Ambil SPV dari localStorage
  currentSpvName = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Ryan';
  const spvNamaEl = document.getElementById('spvNama');
  if (spvNamaEl) spvNamaEl.textContent = currentSpvName;

  loadSpvFilters();
  loadMtoyotaData();
});

function loadSpvFilters() {
  fetch(`../api/api_mtoyota_service.php?action=filters&spv=${encodeURIComponent(currentSpvName)}`)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success' && Array.isArray(res.sales_list)) {
        const select = document.getElementById('filterSales');
        if (!select) return;
        select.innerHTML = '<option value="0">-- Semua Wiraniaga Tim --</option>' +
          res.sales_list.map(s => `<option value="${s.id}">${s.name}</option>`).join('');
      }
    })
    .catch(err => console.error('Error load filters:', err));
}

function loadMtoyotaData() {
  const salesId = document.getElementById('filterSales')?.value || 0;
  const stage = document.getElementById('filterStage')?.value || '';
  const search = document.getElementById('searchKeyword')?.value || '';

  let url = `../api/api_mtoyota_service.php?action=list&spv=${encodeURIComponent(currentSpvName)}`;
  if (Number(salesId) > 0) url += `&sales_id=${salesId}`;
  if (stage) url += `&stage=${encodeURIComponent(stage)}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;

  // Update Stats
  let statUrl = `../api/api_mtoyota_service.php?action=stats&spv=${encodeURIComponent(currentSpvName)}`;
  if (Number(salesId) > 0) statUrl += `&sales_id=${salesId}`;

  fetch(statUrl)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success' && res.stats) {
        const s = res.stats;
        document.getElementById('kpiTotalUnit').textContent = s.total_unit || 0;
        document.getElementById('kpiDecDone').textContent = s.total_dec_selesai || 0;
        document.getElementById('kpiFsDone').textContent = (s.total_fs1000_selesai || 0) + (s.total_fs1000_booked ? ` (${s.total_fs1000_booked} Booked)` : '');
        document.getElementById('kpiSbDone').textContent = s.total_sb_selesai || 0;
        document.getElementById('kpiAvgProgress').textContent = (s.avg_progress || 0) + '%';
      }
    })
    .catch(err => console.error(err));

  // Update Table
  const tbody = document.getElementById('mtoyotaTableBody');
  tbody.innerHTML = `
    <tr>
      <td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">
        <i class="fa-solid fa-circle-notch fa-spin" style="font-size:20px; margin-bottom:8px; display:block;"></i>
        Memuat data inputan sales...
      </td>
    </tr>
  `;

  fetch(url)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        mtoyotaDataCache = res.data || [];
        renderTable(mtoyotaDataCache);
        const lbl = document.getElementById('totalRecordLabel');
        if (lbl) lbl.textContent = `Menampilkan ${mtoyotaDataCache.length} data`;
      } else {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">Gagal memuat data: ${res.message || 'Terjadi kesalahan'}</td></tr>`;
      }
    })
    .catch(err => {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:#ef4444;">Gagal terhubung ke server database.</td></tr>`;
      console.error(err);
    });
}

function renderTable(data) {
  const tbody = document.getElementById('mtoyotaTableBody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center; padding:30px; color:#94a3b8;">
          <i class="fa-solid fa-folder-open" style="font-size:26px; margin-bottom:8px; display:block; opacity:0.6;"></i>
          Belum ada data serah terima &amp; m-Toyota yang sesuai kriteria.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map((item, idx) => {
    // Badges progress
    const bDo = `<span class="badge-stage ${item.status_do === 'completed' ? 'badge-stage-done' : 'badge-stage-pending'}"><i class="fa-solid fa-truck"></i> DO</span>`;
    const bDec = `<span class="badge-stage ${item.status_dec === 'completed' ? 'badge-stage-done' : 'badge-stage-pending'}"><i class="fa-solid fa-mobile-screen-button"></i> DEC</span>`;
    
    let bFs = `<span class="badge-stage badge-stage-pending"><i class="fa-solid fa-calendar"></i> FS 1K</span>`;
    if (item.status_fs1000 === 'completed') bFs = `<span class="badge-stage badge-stage-done"><i class="fa-solid fa-check-circle"></i> FS 1K</span>`;
    else if (item.status_fs1000 === 'booked') bFs = `<span class="badge-stage badge-stage-booked"><i class="fa-solid fa-calendar-check"></i> FS 1K (${item.tanggal_booking_fs1000 || 'Booked'})</span>`;

    let bSb = `<span class="badge-stage badge-stage-pending"><i class="fa-solid fa-wrench"></i> Servis</span>`;
    if (item.status_sb10k === 'completed' || item.status_sb20k === 'completed') {
      bSb = `<span class="badge-stage badge-stage-done"><i class="fa-solid fa-wrench"></i> Servis Berkala</span>`;
    }

    const progress = Number(item.overall_progress) || 20;
    let barColor = '#ef4444';
    if (progress >= 100) barColor = '#10b981';
    else if (progress >= 60) barColor = '#0284c7';
    else if (progress >= 40) barColor = '#f59e0b';

    const tglDo = item.tanggal_do ? new Date(item.tanggal_do).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

    return `
      <tr>
        <td style="font-weight:700; color:#64748b;">${idx + 1}</td>
        <td>
          <div style="font-weight:800; color:#0f172a; font-size:13px;">${item.customer_name}</div>
          <div style="font-size:11px; color:#475569; margin-top:2px;">
            <i class="fa-solid fa-car" style="color:#0284c7; margin-right:4px;"></i>${item.model_kendaraan}
            ${item.no_polisi ? `<span style="font-weight:700; background:#f1f5f9; padding:1px 5px; border-radius:4px; margin-left:4px;">${item.no_polisi}</span>` : ''}
          </div>
          ${item.no_rangka ? `<div style="font-size:10px; color:#94a3b8; font-family:monospace;">VIN: ${item.no_rangka}</div>` : ''}
          ${item.one_account_id ? `<div style="font-size:10px; color:#0369a1; font-weight:700; margin-top:2px;"><i class="fa-solid fa-id-badge" style="color:#0284c7;"></i> OA: ${item.one_account_id}</div>` : '<div style="font-size:10px; color:#94a3b8; font-style:italic;">Belum Ada One Account</div>'}
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${item.sales_name || 'Wiraniaga'}</div>
          <div style="font-size:10.5px; color:#64748b;">SPV: ${item.sales_spv || currentSpvName}</div>
        </td>
        <td style="font-weight:600; font-size:11.5px; color:#334155;">
          ${tglDo}
        </td>
        <td>
          <div style="display:flex; gap:4px; flex-wrap:wrap;">
            ${bDo}
            ${bDec}
            ${bFs}
            ${bSb}
          </div>
        </td>
        <td>
          <div style="display:flex; justify-content:space-between; font-size:10.5px; font-weight:800; color:${barColor};">
            <span>Progress</span>
            <span>${progress}%</span>
          </div>
          <div class="progress-bar-wrap">
            <div class="progress-bar-fill" style="width:${progress}%; background:${barColor};"></div>
          </div>
        </td>
        <td style="text-align:center;">
          <div style="display:inline-flex; gap:6px;">
            <button type="button" class="btn btn-outline" onclick="openPhotoModal(${item.id})" style="padding:5px 9px; font-size:11px; border-radius:6px; font-weight:700;" title="Lihat Foto Bukti Input">
              <i class="fa-solid fa-images"></i> Foto
            </button>
            <button type="button" class="btn btn-outline" onclick="contactCustomerWa('${item.customer_phone}', '${item.customer_name}', '${item.model_kendaraan}')" style="padding:5px 9px; font-size:11px; border-radius:6px; color:#25D366; border-color:#25D366;" title="Hubungi Customer via WhatsApp">
              <i class="fa-brands fa-whatsapp"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function applyFilters() {
  loadMtoyotaData();
}

function handleSearchKey(e) {
  if (e.key === 'Enter') {
    applyFilters();
  }
}

function openPhotoModal(id) {
  const item = mtoyotaDataCache.find(x => Number(x.id) === Number(id));
  if (!item) return;

  document.getElementById('modalCustTitle').textContent = `Bukti Serah Terima & m-Toyota: ${item.customer_name}`;
  document.getElementById('modalUnitSub').textContent = `${item.model_kendaraan} • Tgl DO: ${item.tanggal_do || '-'}`;
  document.getElementById('modalSalesName').textContent = `${item.sales_name || '-'} (SPV: ${item.sales_spv || currentSpvName})`;
  document.getElementById('modalPlateVin').textContent = `${item.no_polisi || '-'} / ${item.no_rangka || '-'}`;
  document.getElementById('modalPhone').textContent = item.customer_phone || '-';
  document.getElementById('modalProgressVal').textContent = `${item.overall_progress || 20}% Selesai`;

  const container = document.getElementById('modalPhotosContainer');
  let photosHtml = '';

  const photosList = [
    { title: 'Foto Serah Terima (DO)', src: item.foto_do, note: item.catatan_do || 'Bukti serah terima unit kendaraan' },
    { title: 'Foto Aktivasi m-Toyota (DEC)', src: item.foto_dec, note: item.catatan_dec || 'Bukti aktivasi aplikasi m-Toyota' },
    { title: 'Foto Booking / Servis 1.000 KM', src: item.foto_fs1000, note: item.catatan_fs1000 || 'Kwitansi / Form booking servis 1.000 KM' },
    { title: 'Foto Servis Berkala (SB)', src: item.foto_sb10k || item.foto_sb20k, note: item.catatan_sb10k || item.catatan_sb20k || 'Bukti servis berkala 10K / 20K' }
  ];

  photosList.forEach(p => {
    if (p.src && p.src.trim() !== '') {
      photosHtml += `
        <div class="photo-preview-item">
          <div style="font-weight:800; font-size:11px; margin-bottom:4px; color:#0f172a;">${p.title}</div>
          <a href="${p.src}" target="_blank" title="Klik untuk perbesar">
            <img src="${p.src}" alt="${p.title}" onerror="this.src='https://placehold.co/400x300?text=Foto+Tidak+Ditemukan'">
          </a>
          <p style="font-size:10px; color:#64748b; margin:4px 0 0; line-height:1.3;">${p.note}</p>
        </div>
      `;
    }
  });

  if (!photosHtml) {
    photosHtml = `
      <div style="grid-column:1/-1; text-align:center; padding:24px; color:#94a3b8; font-size:12px;">
        <i class="fa-solid fa-image" style="font-size:24px; margin-bottom:6px; display:block;"></i>
        Sales belum mengunggah foto lampiran untuk unit ini.
      </div>
    `;
  }

  container.innerHTML = photosHtml;
  const modal = document.getElementById('photoLightbox');
  if (modal) modal.style.display = 'flex';
}

function closePhotoModal() {
  const modal = document.getElementById('photoLightbox');
  if (modal) modal.style.display = 'none';
}

function contactCustomerWa(phone, name, model) {
  if (!phone) {
    alert('Nomor HP customer tidak tersedia.');
    return;
  }
  let cleanPhone = phone.replace(/[^\d]/g, '');
  if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);

  const text = `Halo Bapak/Ibu *${name}*,\n\nSalam hangat dari Tim Supervisi *Tunas Toyota Kiara Condong Bandung*.\n\nKami ingin menanyakan kabar dan kenyamanan kendaraan Toyota *${model}* Anda setelah serah terima unit kemarin. Apakah aplikasi *m-Toyota* Anda sudah dapat digunakan dengan baik?\n\nKami juga ingin mengingatkan jadwal *Free Service (FS 1.000 KM)* pertama Anda agar garansi kendaraan tetap aktif sepenuhnya. Jika ada pertanyaan atau ingin kami bantu booking servis, silakan beri tahu kami ya Pak/Bu.\n\nTerima kasih dan sehat selalu! 🚗✨`;

  window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
}
