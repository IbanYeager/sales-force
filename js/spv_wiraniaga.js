let listDataWiraniaga = [];

    function logoutUser() {
      const isKacab = localStorage.getItem('peranSales') === 'Kepala Cabang';
      localStorage.clear();
      window.location.href = isKacab ? '../pages/login_kacab.html' : '../pages/login_spv.html';
    }

    function guardSPV() {
      const loggedIn = localStorage.getItem('loggedIn') === 'true';
      const peran = localStorage.getItem('peranSales');
      const isInKacabDir = window.location.pathname.includes('/pages_kacab/');
      const isInSpvDir = window.location.pathname.includes('/pages_spv/');

      if (!loggedIn) {
        window.location.href = (peran === 'Kepala Cabang' || isInKacabDir) ? '../pages/login_kacab.html' : '../pages/login_spv.html';
        return;
      }
      if (peran === 'Sales Consultant' || peran === 'Sales') {
        window.location.href = '../index.html';
        return;
      }
      if (isInSpvDir && peran === 'Kepala Cabang') {
        window.location.href = '../pages_kacab/wiraniaga.html';
        return;
      }
      if (isInKacabDir && peran === 'Supervisor') {
        window.location.href = '../pages_spv/wiraniaga.html';
        return;
      }
      if (peran !== 'Supervisor' && peran !== 'Kepala Cabang') {
        window.location.href = isInKacabDir ? '../pages/login_kacab.html' : '../pages/login_spv.html';
        return;
      }
    }

    function renderUser() {
      const nama = localStorage.getItem('namaSales') || 'SPV';
      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      const elNama = document.getElementById('spvNama') || document.getElementById('kcbNama');
      const elRole = document.getElementById('spvRole') || document.getElementById('kcbRole');
      if (elNama) elNama.textContent = nama;
      if (elRole) elRole.textContent = peran;

      let avatar = localStorage.getItem('fotoSales');
      if (avatar && avatar.startsWith('http://') && !avatar.includes('localhost')) {
        avatar = 'https://' + avatar.substring(7);
        localStorage.setItem('fotoSales', avatar);
      }
      const avatarEl = document.getElementById('spvAvatar') || document.getElementById('kcbAvatar');
      if (avatarEl) {
        avatarEl.onerror = function() {
          this.onerror = null;
          this.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${peran === 'Kepala Cabang' ? '1e1014' : 'f4f7f6'}&color=${peran === 'Kepala Cabang' ? 'd8a437' : 'c8102e'}`;
        };
        avatarEl.src = (avatar && avatar.trim() !== '')
          ? avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${peran === 'Kepala Cabang' ? '1e1014' : 'f4f7f6'}&color=${peran === 'Kepala Cabang' ? 'd8a437' : 'c8102e'}`;
      }
    }

    function setupWiraniagaSpvLock() {
      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      const namaSpv = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Pak Ryan';
      const filterSpvEl = document.getElementById('selectFilterSpvWiraniaga');

      if (filterSpvEl) {
        if (peran === 'Supervisor' || peran === 'SPV') {
          filterSpvEl.innerHTML = `<option value="${namaSpv}" selected>Tim ${namaSpv}</option>`;
          filterSpvEl.disabled = true;
          filterSpvEl.style.background = '#f8fafc';
          filterSpvEl.style.cursor = 'default';
          filterSpvEl.style.fontWeight = '800';
          filterSpvEl.style.color = '#0f172a';
          window.currentWiraniagaSpvFilter = namaSpv;
        } else {
          // Kepala Cabang / Branch Manager can see all teams
          filterSpvEl.innerHTML = `
            <option value="Semua">Semua Tim (Master - 46 Sales)</option>
            <option value="Pak Ryan">Tim Pak Ryan</option>
            <option value="Pak Alvin">Tim Pak Alvin</option>
            <option value="Pak Riva">Tim Pak Riva</option>
          `;
        }
      }
    }

    function changeWiraniagaSpvFilter(val) {
      window.currentWiraniagaSpvFilter = val;
      localStorage.setItem('spv_wiraniaga_filter', val);
      loadWiraniaga();
    }

    async function loadWiraniaga() {
      const wiraniagaBody = document.getElementById('wiraniagaBody');
      const subTitleCount = document.getElementById('subTitleCount');
      const month = new Date().getMonth() + 1;

      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      const namaSpv = localStorage.getItem('namaSales') || localStorage.getItem('spvSales') || 'Pak Ryan';

      try {
        let spv = window.currentWiraniagaSpvFilter || 'Semua';
        if (peran === 'Supervisor' || peran === 'SPV') {
          spv = namaSpv;
        }
        const res = await fetch(`../api/api_wiraniaga.php?spv=${encodeURIComponent(spv)}`);
        const result = await res.json();

        // Fetch real targets for rate calculations
        try {
          const targetRes = await fetch(`../api/api_target_all.php?spv=${encodeURIComponent(spv)}&bulan=${month}`);
          const targetJson = await targetRes.json();
          if (targetJson.status === 'success' && Array.isArray(targetJson.data)) {
            window.realTargetMap = {};
            targetJson.data.forEach(t => {
              window.realTargetMap[t.sales_account_id] = t;
              if (t.nama_sales) {
                window.realTargetMap[t.nama_sales] = t;
              }
            });
          }
        } catch (errTarget) {
          console.warn('Target API fallback:', errTarget);
        }

        if (result.status === 'success') {
          listDataWiraniaga = result.data || [];
          renderWiraniagaRows();
        } else {
          subTitleCount.textContent = 'Gagal memuat data.';
          wiraniagaBody.innerHTML = `<tr><td colspan="8" class="loading-state" style="color:var(--red);">Gagal memuat: ${result.message}</td></tr>`;
        }
      } catch (e) {
        console.error(e);
        subTitleCount.textContent = 'Gagal terhubung ke server.';
        wiraniagaBody.innerHTML = `<tr><td colspan="8" class="loading-state" style="color:var(--red);">Error koneksi ke API.</td></tr>`;
      }
    }

    function escapeHtml(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      })[m]);
    }

    function renderWiraniagaRows() {
      const wiraniagaBody = document.getElementById('wiraniagaBody');
      const subTitleCount = document.getElementById('subTitleCount');
      const q = (document.getElementById('searchWiraniaga')?.value || '').toLowerCase().trim();

      const totalOnline = listDataWiraniaga.filter(r => r.is_online).length;
      const totalOffline = listDataWiraniaga.length - totalOnline;
      if (subTitleCount) {
        subTitleCount.innerHTML = `<strong>${listDataWiraniaga.length}</strong> wiraniaga &middot; <span style="color:#10b981; font-weight:800;"><i class="fa-solid fa-circle" style="font-size:8px;"></i> ${totalOnline} Online</span> &middot; <span style="color:#94a3b8;">${totalOffline} Offline</span>`;
      }

      // Calculate KPI Stats
      let countHigh = 0;
      let countNeedCoaching = 0;

      listDataWiraniaga.forEach(row => {
        let rVal = 45;
        const targetData = (window.realTargetMap && (window.realTargetMap[row.id] || window.realTargetMap[row.nama_lengkap]));
        if (targetData) {
          const targetSpk = Math.max(targetData.target_spk_bulan || 0, 1);
          const actualSpk = targetData.realisasi_spk_bulan || 0;
          rVal = Math.min(Math.round((actualSpk / targetSpk) * 100), 100);
          if (rVal === 0 && actualSpk > 0) rVal = 25;
        }
        if (rVal >= 50) countHigh++;
        if (rVal < 40) countNeedCoaching++;
      });

      const kpiTotalEl = document.getElementById('kpiTotalSales');
      if (kpiTotalEl) kpiTotalEl.textContent = `${listDataWiraniaga.length} Sales`;

      const kpiOnlineEl = document.getElementById('kpiOnlineCount');
      if (kpiOnlineEl) kpiOnlineEl.textContent = `${totalOnline} Online`;

      const kpiOfflineEl = document.getElementById('kpiOfflineCount');
      if (kpiOfflineEl) kpiOfflineEl.innerHTML = `<i class="fa-solid fa-moon" style="color:#94a3b8;"></i> ${totalOffline} Wiraniaga Offline`;

      const kpiHighEl = document.getElementById('kpiHighCount');
      if (kpiHighEl) kpiHighEl.textContent = `${countHigh} Sales`;

      const kpiCoachingEl = document.getElementById('kpiCoachingCount');
      if (kpiCoachingEl) kpiCoachingEl.textContent = `${countNeedCoaching} Sales`;

      const rows = q
        ? listDataWiraniaga.filter(r =>
            (r.nama_lengkap || '').toLowerCase().includes(q) ||
            (r.username || '').toLowerCase().includes(q) ||
            (r.nama_spv || '').toLowerCase().includes(q) ||
            (q === 'online' && r.is_online) ||
            (q === 'offline' && !r.is_online))
        : listDataWiraniaga;

      if (listDataWiraniaga.length === 0) {
        wiraniagaBody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="es-icon"><i class="fa-solid fa-users"></i></div><div class="es-title">Belum ada wiraniaga</div><div class="es-text">Tambahkan akun wiraniaga pertama Anda.</div></div></td></tr>`;
        return;
      }

      if (rows.length === 0) {
        wiraniagaBody.innerHTML = `<tr><td colspan="8"><div class="empty-state"><div class="es-icon"><i class="fa-solid fa-magnifying-glass"></i></div><div class="es-title">Tidak ada hasil</div><div class="es-text">Tidak ada wiraniaga yang cocok dengan pencarian.</div></div></td></tr>`;
        return;
      }

      wiraniagaBody.innerHTML = '';
      rows.forEach((row) => {
        const globalIndex = listDataWiraniaga.indexOf(row);
        const isOff = row.status === 'Tidak Aktif';
        const isOn = row.is_online === true || row.is_online === 1;
        const avatar = (row.foto && row.foto.trim() !== '')
          ? row.foto
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.nama_lengkap)}&background=eef4fd&color=2458c5`;
        const safeName = (row.nama_lengkap || '').replace(/'/g, "\\'");

        // Calculate REAL conversion rate from real DB target map
        let rateVal = 45;
        const targetData = (window.realTargetMap && (window.realTargetMap[row.id] || window.realTargetMap[row.nama_lengkap]));
        if (targetData) {
          const targetSpk = Math.max(targetData.target_spk_bulan || 0, 1);
          const actualSpk = targetData.realisasi_spk_bulan || 0;
          rateVal = Math.min(Math.round((actualSpk / targetSpk) * 100), 100);
          if (rateVal === 0 && actualSpk > 0) rateVal = 25;
        }

        const conversionRate = `${rateVal}%`;

        let rateClass = 'rate-normal';
        if (rateVal >= 75) rateClass = 'rate-high';
        else if (rateVal >= 50) rateClass = 'rate-medium';
        else if (rateVal < 40) rateClass = 'rate-low';

        let badgeClass = 'consistent';
        let badgeIcon = 'fa-rocket';
        let badgeText = 'Konsisten';
        if (rateVal >= 75) {
          badgeClass = 'high'; badgeIcon = 'fa-bullseye'; badgeText = 'High Conversion';
        } else if (rateVal >= 50) {
          badgeClass = 'fast'; badgeIcon = 'fa-bolt'; badgeText = 'Fast Closer';
        } else if (rateVal < 40) {
          badgeClass = 'need'; badgeIcon = 'fa-lightbulb'; badgeText = 'Need Coaching';
        }

        const spvName = row.nama_spv || 'Tim SPV';
        let spvClass = 'tag-spv-default';
        if (spvName.includes('Ryan')) spvClass = 'tag-spv-ryan';
        else if (spvName.includes('Alvin')) spvClass = 'tag-spv-alvin';
        else if (spvName.includes('Riva')) spvClass = 'tag-spv-riva';

        const tingkatan = row.tingkatan || 'Junior';
        let gradeClass = 'grade-junior';
        if (tingkatan === 'Executive') gradeClass = 'grade-executive';
        else if (tingkatan === 'Senior') gradeClass = 'grade-senior';
        else if (tingkatan === 'Magang') gradeClass = 'grade-magang';

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="num" style="font-weight:800; color:#94a3b8; font-size:12px;">${globalIndex + 1}</td>
          <td>
            <div class="wira-name">
              <div class="wira-avatar">
                <img src="${avatar}" alt="Foto ${escapeHtml(row.nama_lengkap)}" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(row.nama_lengkap)}&background=eef4fd&color=2458c5';">
                <span class="dot ${isOn ? '' : 'off'}" title="${isOn ? 'Online Sekarang' : 'Offline'}"></span>
              </div>
              <div>
                <div class="wira-meta-name">${escapeHtml(row.nama_lengkap)}</div>
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="wira-spv-tag ${spvClass}">
                    <i class="fa-solid fa-user-tie" style="font-size:10px;"></i> ${escapeHtml(spvName)}
                  </span>
                </div>
              </div>
            </div>
          </td>
          <td>
            <span class="wira-username-pill">@${escapeHtml(row.username)}</span>
          </td>
          <td>
            <div class="wira-rate-box">
              <div class="wira-rate-num">${conversionRate}</div>
              <div class="wira-rate-track">
                <div class="wira-rate-fill ${rateClass}" style="width:${conversionRate};"></div>
              </div>
            </div>
          </td>
          <td class="num">
            <div style="display:flex; flex-direction:column; align-items:center; gap:3px;">
              ${isOn ? `
                <span class="wira-status-pill online">
                  <i class="fa-solid fa-circle" style="font-size:7px;"></i> Online
                </span>
                <span style="font-size:10.5px; color:#15803d; font-weight:700;">Aktif di Web</span>
              ` : `
                <span class="wira-status-pill offline">
                  <i class="fa-solid fa-circle" style="font-size:7px; opacity:0.6;"></i> Offline
                </span>
                <span style="font-size:10.5px; color:#94a3b8; font-weight:600;">${escapeHtml(row.last_active_formatted || 'Belum aktif')}</span>
              `}
            </div>
          </td>
          <td class="num">
            <span class="badge-tingkatan ${gradeClass}">${escapeHtml(tingkatan)}</span>
          </td>
          <td>
            <span class="badge-coaching ${badgeClass}">
              <i class="fa-solid ${badgeIcon}"></i> ${badgeText}
            </span>
          </td>
          <td style="text-align:right;">
            <div class="row-actions">
              <button class="btn-wira-action btn-wira-coaching" onclick="openCoachingAdvice('${safeName}', '${conversionRate}')" title="AI Coaching Advice">
                <i class="fa-solid fa-lightbulb"></i> Coaching
              </button>
              <button class="btn-wira-action btn-wira-edit" onclick="openModalEdit(${row.id})" title="Edit Akun">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn-wira-action btn-wira-delete" onclick="deleteWiraniaga(${row.id}, '${safeName}')" title="Hapus Akun">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </td>
        `;
        wiraniagaBody.appendChild(tr);
      });
    }

    // Auto-refresh presence every 20 seconds
    setInterval(loadWiraniaga, 20000);

    function filterWiraniaga() {
      renderWiraniagaRows();
    }

    window.previewWiraniagaModalPhoto = function(event) {
      const file = event.target.files && event.target.files[0];
      const preview = document.getElementById('previewModalFoto');
      if (file && preview) {
        preview.src = URL.createObjectURL(file);
      }
    };

    function openModalCreate() {
      document.getElementById('modalTitle').textContent = 'Tambah Akun Wiraniaga';
      document.getElementById('formAction').value = 'create';
      document.getElementById('formAccountId').value = '0';
      document.getElementById('inputNamaLengkap').value = '';
      document.getElementById('inputUsername').value = '';
      document.getElementById('inputPassword').value = '';
      document.getElementById('inputPassword').required = true;
      document.getElementById('passwordHelp').textContent = '(Wajib diisi)';
      document.getElementById('selectTingkatan').value = 'Junior';
      document.getElementById('inputTanggalBergabung').value = new Date().toISOString().split('T')[0];

      const inputFoto = document.getElementById('inputFotoWiraniaga');
      if (inputFoto) inputFoto.value = '';
      const previewFoto = document.getElementById('previewModalFoto');
      if (previewFoto) {
        previewFoto.src = 'https://ui-avatars.com/api/?name=Sales&background=eef4fd&color=2458c5';
      }

      const currentSpv = localStorage.getItem('namaSales') || 'Pak Riva';
      const selectSpv = document.getElementById('selectSpv');
      if (Array.from(selectSpv.options).some(o => o.value === currentSpv)) {
        selectSpv.value = currentSpv;
      }

      const el = document.getElementById('modalWiraniaga');
      if (el) {
        el.classList.add('show', 'active');
        el.style.display = 'flex';
      }
    }

    function openModalEdit(id) {
      const row = listDataWiraniaga.find(item => item.id == id);
      if (!row) return;

      document.getElementById('modalTitle').textContent = 'Edit Data Wiraniaga';
      document.getElementById('formAction').value = 'update';
      document.getElementById('formAccountId').value = row.id;
      document.getElementById('inputNamaLengkap').value = row.nama_lengkap;
      document.getElementById('inputUsername').value = row.username;
      document.getElementById('inputPassword').value = '';
      document.getElementById('inputPassword').required = false;
      document.getElementById('passwordHelp').textContent = '(Kosongkan jika tidak ingin mengubah password)';
      document.getElementById('selectTingkatan').value = row.tingkatan || 'Junior';
      document.getElementById('inputTanggalBergabung').value = row.created_at_raw || '';

      const inputFoto = document.getElementById('inputFotoWiraniaga');
      if (inputFoto) inputFoto.value = '';
      const previewFoto = document.getElementById('previewModalFoto');
      if (previewFoto) {
        const rowFoto = (row.foto && row.foto.trim() !== '') ? row.foto : `https://ui-avatars.com/api/?name=${encodeURIComponent(row.nama_lengkap)}&background=eef4fd&color=2458c5`;
        previewFoto.src = rowFoto;
      }

      const selectSpv = document.getElementById('selectSpv');
      if (Array.from(selectSpv.options).some(o => o.value === row.nama_spv)) {
        selectSpv.value = row.nama_spv;
      }

      const el = document.getElementById('modalWiraniaga');
      if (el) {
        el.classList.add('show', 'active');
        el.style.display = 'flex';
      }
    }

    function closeModal() {
      const el = document.getElementById('modalWiraniaga');
      if (el) {
        el.classList.remove('show', 'active');
        el.style.display = 'none';
      }
    }

    async function saveWiraniaga(event) {
      event.preventDefault();

      const saveBtn = document.getElementById('saveBtn');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

      const action = document.getElementById('formAction').value;
      const id = parseInt(document.getElementById('formAccountId').value) || 0;
      const nama_lengkap = document.getElementById('inputNamaLengkap').value.trim();
      const username = document.getElementById('inputUsername').value.trim();
      const password = document.getElementById('inputPassword').value.trim();
      const tingkatan = document.getElementById('selectTingkatan').value;
      const nama_spv = document.getElementById('selectSpv').value;
      const created_at = document.getElementById('inputTanggalBergabung').value;
      const inputFoto = document.getElementById('inputFotoWiraniaga');

      try {
        const formData = new FormData();
        formData.append('action', action);
        formData.append('id', String(id));
        formData.append('nama_lengkap', nama_lengkap);
        formData.append('username', username);
        if (password) formData.append('password', password);
        formData.append('tingkatan', tingkatan);
        formData.append('nama_spv', nama_spv);
        formData.append('created_at', created_at);

        if (inputFoto && inputFoto.files && inputFoto.files[0]) {
          formData.append('foto', inputFoto.files[0]);
        }

        const res = await fetch('/api/api_wiraniaga.php', {
          method: 'POST',
          body: formData
        });

        const result = await res.json();
        if (result.status === 'success') {
          closeModal();
          if (typeof showCustomAlert === 'function') {
            showCustomAlert(result.message || 'Data berhasil disimpan!', 'success');
          } else {
            alert(result.message || 'Data berhasil disimpan!');
          }
          // Invalidate cache and reload
          try { sessionStorage.removeItem('kacab_hierarchy_cache'); } catch(e) {}
          loadWiraniaga();
        } else {
          alert('Gagal: ' + result.message);
        }
      } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi saat menghubungi server.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Simpan Akun';
      }
    }

    async function deleteWiraniaga(id, nama) {
      if (!confirm(`Apakah Anda yakin ingin menghapus akun wiraniaga '${nama}'?`)) {
        return;
      }

      try {
        const res = await fetch('../api/api_wiraniaga.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'delete', id })
        });
        const result = await res.json();
        if (result.status === 'success') {
          if (typeof showCustomAlert === 'function') {
            showCustomAlert('Akun wiraniaga berhasil dihapus!', 'success');
          } else {
            alert('Akun wiraniaga berhasil dihapus!');
          }
          loadWiraniaga();
        } else {
          alert('Gagal menghapus: ' + result.message);
        }
      } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi saat menghapus akun.');
      }
    }

    async function loadPendingApprovals() {
      if (typeof window.checkPendingApprovalsGlobal === 'function') {
        window.checkPendingApprovalsGlobal();
      }
    }

    window.openCoachingAdvice = function(nama, rate) {
      document.getElementById('coachingModalTitle').innerHTML = `<i class="fa-solid fa-lightbulb" style="color:#f59e0b;"></i> AI Coaching Advice: ${nama}`;
      document.getElementById('coachingRateText').textContent = `Conversion Rate: ${rate}`;

      let advice = `Rekomendasi Coaching SPV untuk <strong>${nama}</strong>:<br><br>`;
      if (rate === '80%') {
        advice += `<strong>Top Performer!</strong> Pertahankan performa luar biasa ini. Disarankan libatkan ${nama} sebagai mentor simulasi objection handling bagi wiraniaga junior.`;
      } else if (rate === '60%') {
        advice += `<strong>Performa Sangat Baik.</strong> Penjualan di segmen MPV & SUV sangat kuat. SPV disarankan memberikan prioritas alokasi leads segmen Innova Zenix / Veloz.`;
      } else if (rate === '20%') {
        advice += `<strong>Perlu Pendampingan Closing (Co-Closing).</strong> Prospeksi & aktivitas harian sudah baik, namun tahap penutupan kesepakatan perlu dibantu. Jadwalkan dampingan kunjungan bersama SPV minggu ini.`;
      } else {
        advice += `<strong>Prospek Stabil.</strong> Pertahankan konsistensi follow-up dan ingatkan pencatatan aktivitas secara harian di Sales App.`;
      }

      document.getElementById('coachingAdviceBody').innerHTML = advice;
      document.getElementById('modalCoaching').style.display = 'flex';
    };

    window.closeCoachingModal = function() {
      document.getElementById('modalCoaching').style.display = 'none';
    };

    document.addEventListener('DOMContentLoaded', () => {
      guardSPV();
      renderUser();
      setupWiraniagaSpvLock();
      loadWiraniaga();
      loadPendingApprovals();

      if (new URLSearchParams(window.location.search).get('action') === 'add') {
        setTimeout(() => openModalCreate(), 100);
      }
    });
