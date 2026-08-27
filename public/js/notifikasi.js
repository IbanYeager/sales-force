// notifikasi.js — Handler Halaman Pusat Notifikasi Sales Consultant

let notifData = [];
const rawSalesId = localStorage.getItem('idSales') || localStorage.getItem('salesId') || '';
const namaSales = localStorage.getItem('namaSales') || 'Egy';

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function fetchNotifications() {
  const params = new URLSearchParams();
  if (rawSalesId) params.append('sales_account_id', rawSalesId);
  if (namaSales) params.append('nama_sales', namaSales);

  fetch(`../api/api_notifikasi.php?${params.toString()}`)
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success' && Array.isArray(res.data)) {
        notifData = res.data;
        render();
        updateGlobalBadge();
      }
    })
    .catch(err => console.error("Error fetching notifications:", err));
}

function updateGlobalBadge() {
  const unreadCount = notifData.filter(n => n.unread).length;
  localStorage.setItem('salesNotifBadgeCount', unreadCount);

  const displayVal = unreadCount > 99 ? '99+' : unreadCount;
  const bellBadge = document.getElementById('sidebarBellBadge');
  const headerBadge = document.getElementById('navNotifBadge') || document.getElementById('mobileNotifBadge');

  if (unreadCount > 0) {
    if (bellBadge) { bellBadge.textContent = displayVal; bellBadge.style.display = 'flex'; }
    if (headerBadge) { headerBadge.textContent = displayVal; headerBadge.style.display = 'inline-flex'; }
  } else {
    if (bellBadge) bellBadge.style.display = 'none';
    if (headerBadge) headerBadge.style.display = 'none';
  }
}

function render() {
  const listEl = document.getElementById('notifList');
  const kosongEl = document.getElementById('notifKosong');
  const belumEl = document.getElementById('badgeBelumDibaca');
  const totalEl = document.getElementById('totalNotifVal');

  if (!listEl || !kosongEl || !belumEl) return;

  const belum = notifData.filter(n => n.unread).length;
  belumEl.textContent = belum;
  if (totalEl) totalEl.textContent = notifData.length;

  if (notifData.length === 0) {
    kosongEl.style.display = 'block';
    listEl.innerHTML = `
      <div style="text-align: center; padding: 48px 20px; background: #ffffff; border-radius: 18px; border: 1px dashed #cbd5e1;">
        <div style="width: 56px; height: 56px; border-radius: 50%; background: #f1f5f9; color: #94a3b8; display: inline-flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px;">
          <i class="fa-solid fa-bell-slash"></i>
        </div>
        <div style="font-size: 15px; font-weight: 800; color: #1e293b;">Belum Ada Notifikasi</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Pemberitahuan pengajuan SPK, DO, dan aktivitas akan tampil di sini.</div>
      </div>
    `;
    return;
  }

  kosongEl.style.display = 'none';

  listEl.innerHTML = '';
  notifData.forEach(n => {
    const row = document.createElement('div');
    const isUnread = !!n.unread;
    row.className = `notif-card-item ${isUnread ? 'unread' : 'read'}`;

    let iconClass = 'icon-bell';
    const iconName = (n.status_icon || '').toLowerCase();
    if (iconName.includes('check') || iconName.includes('slot') || iconName.includes('spk')) {
      iconClass = 'icon-spk';
    } else if (iconName.includes('truck') || iconName.includes('do') || iconName.includes('box')) {
      iconClass = 'icon-do';
    } else if (iconName.includes('info') || iconName.includes('circle')) {
      iconClass = 'icon-info';
    }

    const badgeHtml = isUnread
      ? `<span class="notif-status-badge unread"><span class="pulse-dot"></span> BELUM DIBACA</span>`
      : `<span class="notif-status-badge read"><i class="fa-solid fa-check"></i> Sudah dibaca</span>`;

    let actionBtnHtml = '';
    if (n.body) {
      const phoneMatch = n.body.match(/08\d{8,12}/);
      const phone = phoneMatch ? phoneMatch[0] : '';
      if (phone) {
        const waUrl = `https://wa.me/62${phone.substring(1)}?text=Halo%20Pak%2FBu%2C%20saya%20Sales%20Consultant%20Tunas%20Toyota.%20Terima%20kasih%20sudah%20menghubungi%20kami%20terkait%20${encodeURIComponent(n.title)}.`;
        actionBtnHtml = `<a href="${waUrl}" target="_blank" onclick="event.stopPropagation();" style="display:inline-flex; align-items:center; gap:6px; margin-top:6px; padding:6px 14px; background:linear-gradient(135deg, #059669, #10b981); color:white; border-radius:12px; font-weight:700; font-size:11.5px; text-decoration:none; box-shadow:0 3px 8px rgba(16,185,129,0.3);"><i class="fa-brands fa-whatsapp"></i> Respon via WA Direct</a>`;
      }
    }

    row.innerHTML = `
      <div class="notif-icon-wrapper ${iconClass}">
        <i class="fa-solid fa-${escapeHtml(n.status_icon || 'bell')}"></i>
      </div>
      <div style="flex:1;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
          <div class="notif-title">${escapeHtml(n.title)}</div>
          <div class="notif-time">${escapeHtml(n.time_label || 'Baru saja')}</div>
        </div>
        <div class="notif-body-text">${escapeHtml(n.body)}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
          ${badgeHtml}
          ${actionBtnHtml}
        </div>
      </div>
    `;

    row.onclick = () => {
      if (n.unread) {
        markSingleRead(n.id);
      }
    };

    listEl.appendChild(row);
  });
}

function markAllRead() {
  fetch('../api/api_notifikasi.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'read_all',
      sales_account_id: rawSalesId,
      nama_sales: namaSales
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        fetchNotifications();
        if (window.showCustomAlert) {
          window.showCustomAlert('Semua notifikasi sudah ditandai sebagai sudah dibaca.', 'success');
        } else {
          alert('Semua notifikasi sudah ditandai sebagai sudah dibaca.');
        }
      }
    })
    .catch(err => console.error("Error marking all read:", err));
}

function markSingleRead(id) {
  fetch('../api/api_notifikasi.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'read_single',
      id: id,
      sales_account_id: rawSalesId,
      nama_sales: namaSales
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        fetchNotifications();
      }
    })
    .catch(err => console.error("Error marking single read:", err));
}

async function deleteReadNotif() {
  const isConfirmed = await (window.customConfirm ? window.customConfirm('Apakah Anda yakin ingin menghapus semua notifikasi yang sudah dibaca?') : window.confirm('Apakah Anda yakin ingin menghapus semua notifikasi yang sudah dibaca?'));
  if (!isConfirmed) return;

  fetch('../api/api_notifikasi.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'delete_read',
      sales_account_id: rawSalesId,
      nama_sales: namaSales
    })
  })
    .then(r => r.json())
    .then(res => {
      if (res.status === 'success') {
        fetchNotifications();
        if (window.showCustomAlert) {
          window.showCustomAlert('Semua notifikasi yang sudah dibaca berhasil dihapus.', 'success');
        } else {
          alert('Semua notifikasi yang sudah dibaca berhasil dihapus.');
        }
      } else {
        alert('Gagal menghapus: ' + res.message);
      }
    })
    .catch(err => console.error("Error deleting read notif:", err));
}

document.addEventListener('DOMContentLoaded', fetchNotifications);
