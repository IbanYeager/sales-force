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

      const avatar = localStorage.getItem('fotoSales');
      const avatarEl = document.getElementById('spvAvatar') || document.getElementById('kcbAvatar');
      if (avatarEl) {
        avatarEl.src = (avatar && avatar.trim() !== '')
          ? avatar
          : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=${peran === 'Kepala Cabang' ? '1e1014' : 'f4f7f6'}&color=${peran === 'Kepala Cabang' ? 'd8a437' : 'c8102e'}`;
      }
    }

    window.currentWiraniagaSpvFilter = localStorage.getItem('spv_wiraniaga_filter') || 'Semua';

    function changeWiraniagaSpvFilter(val) {
      window.currentWiraniagaSpvFilter = val;
      localStorage.setItem('spv_wiraniaga_filter', val);
      loadWiraniaga();
    }

    async function loadWiraniaga() {
      const wiraniagaBody = document.getElementById('wiraniagaBody');
      const subTitleCount = document.getElementById('subTitleCount');
      const month = new Date().getMonth() + 1;

      try {
        const spv = window.currentWiraniagaSpvFilter || 'Semua';
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

    function renderWiraniagaRows() {
      const wiraniagaBody = document.getElementById('wiraniagaBody');
      const subTitleCount = document.getElementById('subTitleCount');
      const q = (document.getElementById('searchWiraniaga')?.value || '').toLowerCase().trim();

      const aktif = listDataWiraniaga.filter(r => r.status !== 'Tidak Aktif').length;
      const inaktif = listDataWiraniaga.length - aktif;
      subTitleCount.textContent = `${listDataWiraniaga.length} wiraniaga · ${aktif} aktif · ${inaktif} tidak aktif`;

      const rows = q
        ? listDataWiraniaga.filter(r =>
            (r.nama_lengkap || '').toLowerCase().includes(q) ||
            (r.username || '').toLowerCase().includes(q))
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

        let badgeHtml = '<span style="font-size:11px; font-weight:800; background:#e0f2fe; color:#0369a1; padding:3px 8px; border-radius:6px;">🚀 Konsisten</span>';
        if (rateVal >= 75) {
          badgeHtml = '<span style="font-size:11px; font-weight:800; background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:6px;">🎯 High Conversion</span>';
        } else if (rateVal >= 50) {
          badgeHtml = '<span style="font-size:11px; font-weight:800; background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:6px;">⚡ Fast Closer</span>';
        } else if (rateVal < 40) {
          badgeHtml = '<span style="font-size:11px; font-weight:800; background:#ffe4e6; color:#be123c; padding:3px 8px; border-radius:6px;">💡 Need Coaching</span>';
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="num" style="color:var(--muted);">${globalIndex + 1}</td>
          <td>
            <div class="wira-name">
              <div class="wira-avatar">
                <img src="${avatar}" alt="Foto ${row.nama_lengkap}">
                <span class="dot ${isOff ? 'off' : ''}"></span>
              </div>
              <span class="n">${row.nama_lengkap}</span>
            </div>
          </td>
          <td class="wira-username">${row.username}</td>
          <td>
            <div style="font-weight:800; color:#0f172a;">${conversionRate}</div>
            <div style="height:4px; background:#e2e8f0; border-radius:4px; margin-top:3px; overflow:hidden;">
              <div style="height:100%; width:${conversionRate}; background:#2563eb;"></div>
            </div>
          </td>
          <td class="num"><span class="status-pill ${isOff ? 'off' : 'on'}">${isOff ? 'Tidak Aktif' : 'Aktif'}</span></td>
          <td class="num"><span class="badge-tingkatan">${row.tingkatan || 'Junior'}</span></td>
          <td>${badgeHtml}</td>
          <td class="num">
            <div class="row-actions">
              <button class="btn btn-sm" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe; font-weight:700;" onclick="openCoachingAdvice('${safeName}', '${conversionRate}')">
                <i class="fa-solid fa-lightbulb"></i> Coaching
              </button>
              <button class="btn btn-sm btn-primary" onclick="openModalEdit(${row.id})">
                <i class="fa-solid fa-pen-to-square"></i>
              </button>
              <button class="btn btn-sm btn-danger" onclick="deleteWiraniaga(${row.id}, '${safeName}')">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </td>
        `;
        wiraniagaBody.appendChild(tr);
      });
    }

    function filterWiraniaga() {
      renderWiraniagaRows();
    }

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
      document.getElementById('selectStatus').value = 'Aktif';
      document.getElementById('inputTanggalBergabung').value = new Date().toISOString().split('T')[0];

      const currentSpv = localStorage.getItem('namaSales') || 'Pak Riva';
      const selectSpv = document.getElementById('selectSpv');
      if (Array.from(selectSpv.options).some(o => o.value === currentSpv)) {
        selectSpv.value = currentSpv;
      }

      document.getElementById('modalWiraniaga').classList.add('show');
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
      document.getElementById('selectStatus').value = row.status || 'Aktif';
      document.getElementById('inputTanggalBergabung').value = row.created_at_raw || '';

      const selectSpv = document.getElementById('selectSpv');
      if (Array.from(selectSpv.options).some(o => o.value === row.nama_spv)) {
        selectSpv.value = row.nama_spv;
      }

      document.getElementById('modalWiraniaga').classList.add('show');
    }

    function closeModal() {
      document.getElementById('modalWiraniaga').classList.remove('show');
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
      const status = document.getElementById('selectStatus').value;
      const nama_spv = document.getElementById('selectSpv').value;
      const created_at = document.getElementById('inputTanggalBergabung').value;

      try {
        const res = await fetch('../api/api_wiraniaga.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action,
            id,
            nama_lengkap,
            username,
            password,
            tingkatan,
            status,
            nama_spv,
            created_at
          })
        });

        const result = await res.json();
        if (result.status === 'success') {
          closeModal();
          if (typeof showCustomAlert === 'function') {
            showCustomAlert(result.message || 'Data berhasil disimpan!', 'success');
          } else {
            alert(result.message || 'Data berhasil disimpan!');
          }
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
        advice += `🌟 <strong>Top Performer!</strong> Pertahankan performa luar biasa ini. Disarankan libatkan ${nama} sebagai mentor simulasi objection handling bagi wiraniaga junior.`;
      } else if (rate === '60%') {
        advice += `🚀 <strong>Performa Sangat Baik.</strong> Penjualan di segmen MPV & SUV sangat kuat. SPV disarankan memberikan prioritas alokasi leads segmen Innova Zenix / Veloz.`;
      } else if (rate === '20%') {
        advice += `⚡ <strong>Perlu Pendampingan Closing (Co-Closing).</strong> Prospeksi & aktivitas harian sudah baik, namun tahap penutupan kesepakatan perlu dibantu. Jadwalkan dampingan kunjungan bersama SPV minggu ini.`;
      } else {
        advice += `📈 <strong>Prospek Stabil.</strong> Pertahankan konsistensi follow-up dan ingatkan pencatatan aktivitas secara harian di Sales App.`;
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
      loadWiraniaga();
      loadPendingApprovals();

      if (new URLSearchParams(window.location.search).get('action') === 'add') {
        setTimeout(() => openModalCreate(), 100);
      }
    });
