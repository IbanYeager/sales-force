// js/kacab_mtoyota.js
// Monitoring m-Toyota & Booking Service untuk Kepala Cabang (Kacab)

let mtoyotaBranchCache = [];
let allSalesList = [];

document.addEventListener('DOMContentLoaded', () => {
  loadKacabFilters();
  loadMtoyotaData();
});

function loadKacabFilters() {
  fetch('../api/api_mtoyota_service.php?action=filters')
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        // 1. Populate SPV Filter
        const spvSelect = document.getElementById('filterSpv');
        if (spvSelect && Array.isArray(res.spv_list)) {
          spvSelect.innerHTML = '<option value="Semua">-- Semua Tim SPV --</option>' +
            res.spv_list.map(spv => `<option value="${spv}">Tim SPV ${spv}</option>`).join('');
        }

        // 2. Cache Sales List
        allSalesList = res.sales_list || [];
        updateSalesDropdown('Semua');
      }
    })
    .catch(err => console.error('Error load filters:', err));
}

function updateSalesDropdown(selectedSpv) {
  const salesSelect = document.getElementById('filterSales');
  if (!salesSelect) return;

  let filtered = allSalesList;
  if (selectedSpv && selectedSpv !== 'Semua' && selectedSpv !== 'all') {
    filtered = allSalesList.filter(s => s.spv === selectedSpv || (s.spv && s.spv.includes(selectedSpv)));
  }

  salesSelect.innerHTML = '<option value="0">-- Semua Wiraniaga --</option>' +
    filtered.map(s => `<option value="${s.id}">${s.name} (${s.spv || 'Sales'})</option>`).join('');
}

function onSpvFilterChange() {
  const spvVal = document.getElementById('filterSpv')?.value || 'Semua';
  updateSalesDropdown(spvVal);
  applyFilters();
}

function loadMtoyotaData() {
  const spv = document.getElementById('filterSpv')?.value || 'Semua';
  const salesId = document.getElementById('filterSales')?.value || 0;
  const stage = document.getElementById('filterStage')?.value || '';
  const search = document.getElementById('searchKeyword')?.value || '';

  let url = '../api/api_mtoyota_service.php?action=list';
  if (spv && spv !== 'Semua') url += `&spv=${encodeURIComponent(spv)}`;
  if (Number(salesId) > 0) url += `&sales_id=${salesId}`;
  if (stage) url += `&stage=${encodeURIComponent(stage)}`;
  if (search) url += `&q=${encodeURIComponent(search)}`;

  // Update Stats
  let statUrl = '../api/api_mtoyota_service.php?action=stats';
  if (spv && spv !== 'Semua') statUrl += `&spv=${encodeURIComponent(spv)}`;
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
        Memuat data inputan serah terima sales seluruh cabang...
      </td>
    </tr>
  `;

  fetch(url)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        mtoyotaBranchCache = res.data || [];
        renderTable(mtoyotaBranchCache);
        const lbl = document.getElementById('totalRecordLabel');
        if (lbl) lbl.textContent = `Menampilkan ${mtoyotaBranchCache.length} data`;
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
            <i class="fa-solid fa-car" style="color:#d8a437; margin-right:4px;"></i>${item.model_kendaraan}
            ${item.no_polisi ? `<span style="font-weight:700; background:#f1f5f9; padding:1px 5px; border-radius:4px; margin-left:4px;">${item.no_polisi}</span>` : ''}
          </div>
          ${item.no_rangka ? `<div style="font-size:10px; color:#94a3b8; font-family:monospace;">VIN: ${item.no_rangka}</div>` : ''}
          ${item.one_account_id ? `<div style="font-size:10px; color:#b45309; font-weight:700; margin-top:2px;"><i class="fa-solid fa-id-badge" style="color:#d8a437;"></i> OA: ${item.one_account_id}</div>` : '<div style="font-size:10px; color:#94a3b8; font-style:italic;">Belum Ada One Account</div>'}
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a;">${item.sales_name || 'Wiraniaga'}</div>
          <div style="font-size:10.5px; color:#b45309; font-weight:700;">Tim: ${item.sales_spv || '-'}</div>
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
          <button type="button" class="btn btn-outline" onclick="openPhotoModal(${item.id})" style="padding:5px 12px; font-size:11px; border-radius:6px; font-weight:700;" title="Lihat Foto Bukti Input">
            <i class="fa-solid fa-images"></i> Lihat Foto
          </button>
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
  const item = mtoyotaBranchCache.find(x => Number(x.id) === Number(id));
  if (!item) return;

  document.getElementById('modalCustTitle').textContent = `Bukti Serah Terima & m-Toyota: ${item.customer_name}`;
  document.getElementById('modalUnitSub').textContent = `${item.model_kendaraan} • Tgl DO: ${item.tanggal_do || '-'}`;
  document.getElementById('modalSalesName').textContent = `${item.sales_name || '-'} (Tim SPV: ${item.sales_spv || '-'})`;
  document.getElementById('modalPlateVin').textContent = `${item.no_polisi || '-'} / ${item.no_rangka || '-'}`;
  document.getElementById('modalPhone').textContent = item.customer_phone || '-';
  document.getElementById('modalProgressVal').textContent = `${item.overall_progress || 20}% Selesai`;

  const container = document.getElementById('modalPhotosContainer');
  let photosHtml = '';

  const photosList = [
    { title: 'Foto Serah Terima Unit (DO)', src: item.foto_do, note: item.catatan_do || 'Bukti serah terima unit kendaraan' },
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

function exportDataCsv() {
  if (mtoyotaBranchCache.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  let csv = 'No,Nama Customer,No HP,Model Kendaraan,No Polisi,No Rangka,Nama Sales,Tim SPV,Tanggal DO,Status DO,Status DEC,Status FS 1000 KM,Tgl Booking FS,Status Servis Berkala,Progress (%)\n';

  mtoyotaBranchCache.forEach((row, idx) => {
    csv += [
      idx + 1,
      `"${(row.customer_name || '').replace(/"/g, '""')}"`,
      `"${row.customer_phone || ''}"`,
      `"${(row.model_kendaraan || '').replace(/"/g, '""')}"`,
      `"${row.no_polisi || ''}"`,
      `"${row.no_rangka || ''}"`,
      `"${(row.sales_name || '').replace(/"/g, '""')}"`,
      `"${(row.sales_spv || '').replace(/"/g, '""')}"`,
      `"${row.tanggal_do || ''}"`,
      `"${row.status_do || ''}"`,
      `"${row.status_dec || ''}"`,
      `"${row.status_fs1000 || ''}"`,
      `"${row.tanggal_booking_fs1000 || ''}"`,
      `"${row.status_sb10k === 'completed' ? 'SB 10K Selesai' : (row.status_sb20k === 'completed' ? 'SB 20K Selesai' : 'Pending')}"`,
      `"${row.overall_progress || 20}%"`
    ].join(',') + '\n';
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `rekap_mtoyota_cabang_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
