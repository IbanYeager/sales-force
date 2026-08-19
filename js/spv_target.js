    function apresiasiPemenang() {
      if (typeof showCustomAlert === 'function') {
        showCustomAlert('Bonus Apresiasi Terkirim!', 'Notifikasi selamat & e-voucher apresiasi berhasil dikirim ke Top 3 Sales Race!', 'success');
      } else {
        alert('Bonus apresiasi berhasil dikirim ke pemenang Sales Race!');
      }
    }

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
        window.location.href = '../pages_kacab/target_kacab.html';
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

    function renderPodiumCards(data) {
      const container = document.getElementById('podiumCardsContainer');
      if (!container) return;

      if (!data || data.length === 0) {
        container.innerHTML = '<div style="grid-column:1/-1; padding:16px; text-align:center; color:#94a3b8; font-size:12px;">Belum ada wiraniaga di bawah SPV ini. Tambahkan wiraniaga untuk mengaktifkan Sales Race.</div>';
        return;
      }

      // Sort wiraniaga by actual SPK realisasi DESC
      const sorted = [...data].sort((a, b) => (b.realisasi_spk_bulan - a.realisasi_spk_bulan));
      const badges = ['🥇 Top Closer of the Month', '🥈 Fast Mover Award', '🥉 Active Sales Award'];
      const trophyEmojis = ['🏆', '🥈', '🥉'];
      const ranks = ['Rank 1', 'Rank 2', 'Rank 3'];
      const ranksBg = ['#d97706', '#64748b', '#b45309'];
      const borders = ['rgba(251,191,36,0.4)', 'rgba(148,163,184,0.3)', 'rgba(180,83,9,0.3)'];
      const textColors = ['#fbbf24', '#cbd5e1', '#fde68a'];

      container.innerHTML = sorted.slice(0, 3).map((l, i) => {
        const targetSpk = Math.max(l.target_spk_bulan || 4, 1);
        const actualSpk = l.realisasi_spk_bulan || 0;
        const pct = Math.round((actualSpk / targetSpk) * 100);

        return `
          <div style="background:rgba(255,255,255,0.06); border:1px solid ${borders[i] || borders[1]}; border-radius:14px; padding:14px; text-align:center; position:relative;">
            <span style="position:absolute; top:-10px; right:10px; background:${ranksBg[i] || ranksBg[1]}; color:white; font-size:10px; font-weight:800; padding:2px 8px; border-radius:10px;">${ranks[i] || `Rank ${i+1}`}</span>
            <div style="font-size:32px; margin-bottom:4px;">${trophyEmojis[i] || '⭐'}</div>
            <h4 style="font-size:16px; font-weight:800; color:white; margin:0 0 2px;">${l.nama_sales}</h4>
            <p style="font-size:11px; color:${textColors[i] || '#cbd5e1'}; font-weight:700; margin:0 0 8px;">${actualSpk} / ${targetSpk} SPK Deal (${pct}% Target)</p>
            <span style="background:rgba(255,255,255,0.1); color:${textColors[i] || '#cbd5e1'}; font-size:10px; font-weight:700; padding:3px 8px; border-radius:6px;">${badges[i] || '⭐ Wiraniaga Active'}</span>
          </div>
        `;
      }).join('');
    }

    async function loadMonitoringBoard() {
      const boardBody = document.getElementById('boardBody');
      const boardPeriode = document.getElementById('boardPeriode');
      const selectBulan = document.getElementById('selectBulanMonitoring');
      const bulanParam = selectBulan ? selectBulan.value : (new Date().getMonth() + 1);

      const filterSpvEl = document.getElementById('selectFilterSpvTarget');
      const spvParam = filterSpvEl ? filterSpvEl.value : (localStorage.getItem('spv_target_filter') || 'Semua');
      localStorage.setItem('spv_target_filter', spvParam);

      try {
        const res = await fetch(`../api/api_target_all.php?spv=${encodeURIComponent(spvParam)}&bulan=${bulanParam}`);
        const result = await res.json();

        if (result.status === 'success') {
          boardPeriode.textContent = `Periode ${result.periode} · DO: ${result.evaluasi_do_label || 'Per Evaluasi (4 Bulan)'}`;
          boardBody.innerHTML = '';
          renderPodiumCards(result.data || []);

          if (result.data.length > 0) {
            let sumTargetSPKBulan = 0, sumTargetDOBulan = 0;
            let sumActualSPKBulan = 0, sumActualDOBulan = 0;
            let sumTargetSPKEval = 0, sumTargetDOEval = 0;
            let sumActualSPKEval = 0, sumActualDOEval = 0;

            result.data.forEach((row, index) => {
              sumTargetSPKBulan += (row.target_spk_bulan || 0);
              sumTargetDOBulan += (row.target_do_bulan || 0);
              sumActualSPKBulan += (row.realisasi_spk_bulan || 0);
              sumActualDOBulan += (row.realisasi_do_bulan || 0);
              sumTargetSPKEval += (row.target_spk_eval || 0);
              sumTargetDOEval += (row.target_do_eval || 0);
              sumActualSPKEval += (row.realisasi_spk_eval || 0);
              sumActualDOEval += (row.realisasi_do_eval || 0);

              // Persentase pencapaian SPK bulan ini
              const pctSpk = (row.target_spk_bulan > 0)
                ? Math.round((row.realisasi_spk_bulan / row.target_spk_bulan) * 100)
                : 0;
              let pctCls = 'zero';
              if (pctSpk >= 100) pctCls = 'good';
              else if (pctSpk >= 60) pctCls = 'mid';
              else if (pctSpk > 0) pctCls = 'low';

              const flagSpk = row.is_manual_target_spk === 1
                ? '<i class="fa-solid fa-pen custom-flag" title="Target Kustom"></i>' : '';
              const flagDo = row.is_manual_target_do === 1
                ? '<i class="fa-solid fa-pen custom-flag" title="Target Kustom"></i>' : '';

              const safeName = (row.nama_sales || '').replace(/'/g, "\\'");

              const tr = document.createElement('tr');
              tr.innerHTML = `
                <td class="num" style="color:var(--muted);">${index + 1}</td>
                <td class="sales-name">${row.nama_sales}</td>
                <td>
                  <select class="tier-select" onchange="updateTingkatan(${row.sales_account_id}, this.value)">
                    <option value="Magang" ${row.tingkatan === 'Magang' || row.tingkatan === 'Magang/Kontrak' ? 'selected' : ''}>Magang · 3/7</option>
                    <option value="Junior" ${row.tingkatan === 'Junior' || row.tingkatan === 'S1' ? 'selected' : ''}>Junior · 5/12</option>
                    <option value="Executive" ${row.tingkatan === 'Executive' || row.tingkatan === 'S2' ? 'selected' : ''}>Executive · 7/20</option>
                    <option value="Senior" ${row.tingkatan === 'Senior' || row.tingkatan === 'S3' ? 'selected' : ''}>Senior · 8/28</option>
                  </select>
                </td>
                <td class="num cell-target">${row.target_spk_bulan}${flagSpk}</td>
                <td class="num cell-target">${row.target_do_bulan}${flagDo}</td>
                <td class="num cell-actual" style="font-weight:800;">${row.realisasi_spk_bulan}</td>
                <td class="num cell-actual" style="font-weight:800;">${row.realisasi_do_bulan}</td>
                <td class="num cell-actual"><span class="pct-chip ${pctCls}">${pctSpk}%</span></td>
                <td class="num cell-eval">${row.target_do_eval ?? 20}</td>
                <td class="num cell-eval" style="font-weight:800;">${row.realisasi_do_eval ?? row.realisasi_do_bulan ?? 0}</td>
                <td>
                  <input type="text" class="plan-input" value="${row.plan_spk || ''}" placeholder="Tulis rencana unit..."
                    onblur="savePlanNote(this, ${row.id_target_bulanan || 0}, ${row.sales_account_id})">
                </td>
                <td class="num">
                  <button class="btn btn-sm btn-primary" onclick="showMonthlyDetail(${row.sales_account_id}, '${safeName}', ${row.id_target_bulanan || 0}, '${(row.plan_spk || '').replace(/'/g, "\\'")}')">
                    <i class="fa-solid fa-pen-to-square"></i> Atur
                  </button>
                </td>
              `;
              boardBody.appendChild(tr);
            });

            document.getElementById('totActualSPKBulan').textContent = sumActualSPKBulan;
            document.getElementById('totActualDOBulan').textContent = sumActualDOBulan;
            document.getElementById('totActualDOEval').textContent = sumActualDOEval;
            document.getElementById('boardFooter').style.display = 'table-footer-group';
          } else {
            boardBody.innerHTML = `<tr><td colspan="12"><div class="empty-state"><div class="es-icon"><i class="fa-solid fa-bullseye"></i></div><div class="es-title">Belum ada data target</div><div class="es-text">Target wiraniaga untuk bulan ini belum diatur.</div></div></td></tr>`;
            document.getElementById('boardFooter').style.display = 'none';
          }
        } else {
          boardBody.innerHTML = `<tr><td colspan="12" class="loading-state" style="color:var(--red);">Gagal memuat: ${result.message}</td></tr>`;
          document.getElementById('boardFooter').style.display = 'none';
        }
      } catch (e) {
        console.error(e);
        boardBody.innerHTML = `<tr><td colspan="12" class="loading-state" style="color:var(--red);">Error koneksi ke API.</td></tr>`;
        document.getElementById('boardFooter').style.display = 'none';
      }
    }

    async function savePlanNote(input, idTargetBulanan, salesAccountId) {
      const val = input.value.trim();
      input.style.borderColor = 'var(--blue)';
      
      const selectBulan = document.getElementById('selectBulanMonitoring');
      const bulanParam = selectBulan ? parseInt(selectBulan.value) : (new Date().getMonth() + 1);

      try {
        const res = await fetch('../api/api_target_all.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_plan',
            id_target_bulanan: idTargetBulanan,
            sales_account_id: salesAccountId,
            periode_bulan: bulanParam,
            plan_spk: val
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          input.style.borderColor = 'var(--green)';
          setTimeout(() => { input.style.borderColor = ''; }, 1000);
          if (data.id_target_bulanan) {
            loadMonitoringBoard();
          }
        } else {
          input.style.borderColor = 'var(--red)';
          alert(data.message);
        }
      } catch (e) {
        console.error(e);
        input.style.borderColor = 'var(--red)';
      }
    }

    async function updateTingkatan(salesAccountId, tingkatan) {
      try {
        const res = await fetch('../api/api_target_all.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_tingkatan',
            sales_account_id: salesAccountId,
            tingkatan
          })
        });
        const data = await res.json();
        if (data.status === 'success') {
          if (typeof showCustomAlert === 'function') {
            showCustomAlert('Tingkatan wiraniaga dan target berhasil diperbarui!', 'success');
          } else {
            alert('Tingkatan wiraniaga dan target berhasil diperbarui!');
          }
          loadMonitoringBoard();
        } else {
          alert('Gagal memperbarui tingkatan: ' + data.message);
          loadMonitoringBoard();
        }
      } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi saat memperbarui tingkatan.');
        loadMonitoringBoard();
      }
    }

    async function showMonthlyDetail(salesAccountId, namaSales, idTargetBulanan, planSpk) {
      const modal = document.getElementById('detailModal');
      const modalTitle = document.getElementById('modalTitle');
      const loadingEl = document.getElementById('loadingDataTarget');
      const containerEl = document.getElementById('formTargetContainer');
      const selectBulan = document.getElementById('selectBulanTarget');

      modalTitle.textContent = `Atur Target & Realisasi - ${namaSales}`;

      document.getElementById('formIdTargetBulanan').value = idTargetBulanan || 0;
      document.getElementById('formSalesAccountId').value = salesAccountId;

      // Set default bulan ke bulan saat ini
      const currentMonth = new Date().getMonth() + 1;
      selectBulan.value = currentMonth;

      loadingEl.style.display = 'block';
      containerEl.style.display = 'none';
      modal.classList.add('show');

      try {
        const res = await fetch(`../api/api_target.php?id_sales=${salesAccountId}`);
        const data = await res.json();

        let monthsData = [];
        for (let i = 1; i <= 12; i++) {
          monthsData.push({ periode_bulan: i, target_spk: 0, realisasi_spk: 0, target_do: 0, realisasi_do: 0, plan_spk: '' });
        }

        if (data.status === 'success' && data.bulanan && data.bulanan.length > 0) {
          monthsData = data.bulanan;
        }

        window.currentSalesMonthsData = monthsData;
        loadingEl.style.display = 'none';
        containerEl.style.display = 'block';
        changeBulanTarget();
      } catch (e) {
        console.error(e);
        loadingEl.innerHTML = '<span style="color:var(--primary-red);">Gagal memuat data dari server.</span>';
      }
    }

    function changeBulanTarget() {
      const selectBulan = document.getElementById('selectBulanTarget');
      const selectedVal = parseInt(selectBulan.value);
      const monthsData = window.currentSalesMonthsData || [];
      const dataBulan = monthsData.find(m => parseInt(m.periode_bulan) === selectedVal) || { target_spk: 0, target_do: 0, realisasi_spk: 0, realisasi_do: 0, plan_spk: '' };

      document.getElementById('modalTargetSPK').value = dataBulan.target_spk || 0;
      document.getElementById('modalTargetDO').value = dataBulan.target_do || 0;
      document.getElementById('modalRealisasiSPK').value = dataBulan.realisasi_spk || 0;
      document.getElementById('modalRealisasiDO').value = dataBulan.realisasi_do || 0;
      document.getElementById('modalPlanSPK').value = dataBulan.plan_spk || '';
    }

    async function saveTargetForm(event) {
      event.preventDefault();

      const saveBtn = document.getElementById('saveBtn');
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

      const idTargetBulanan = parseInt(document.getElementById('formIdTargetBulanan').value) || 0;
      const salesAccountId = parseInt(document.getElementById('formSalesAccountId').value) || 0;
      const periode_bulan = parseInt(document.getElementById('selectBulanTarget').value) || (new Date().getMonth() + 1);
      const target_spk = parseInt(document.getElementById('modalTargetSPK').value) || 0;
      const target_do = parseInt(document.getElementById('modalTargetDO').value) || 0;
      const realisasi_spk = parseInt(document.getElementById('modalRealisasiSPK').value) || 0;
      const realisasi_do = parseInt(document.getElementById('modalRealisasiDO').value) || 0;
      const plan_spk = document.getElementById('modalPlanSPK').value.trim();

      try {
        const res = await fetch('../api/api_target_all.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'save_target_single',
            id_target_bulanan: idTargetBulanan,
            sales_account_id: salesAccountId,
            periode_bulan,
            target_spk,
            target_do,
            realisasi_spk,
            realisasi_do,
            plan_spk
          })
        });

        const textResponse = await res.text();
        console.log("Raw response:", textResponse);
        try {
          const result = JSON.parse(textResponse);
          if (result.status === 'success') {
            closeModal();
            if (typeof showCustomAlert === 'function') {
              showCustomAlert(result.message || 'Target & Realisasi berhasil disimpan!', 'success');
            } else {
              alert(result.message || 'Target & Realisasi berhasil disimpan!');
            }
            loadMonitoringBoard();
          } else {
            alert('Gagal: ' + result.message);
          }
        } catch (parseErr) {
          console.error("Parse error:", parseErr, textResponse);
          alert('Kesalahan dari server:\n' + textResponse);
        }
      } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi saat menghubungi server.');
      } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fa-solid fa-save"></i> Simpan';
      }
    }

    function closeModal() {
      document.getElementById('detailModal').classList.remove('show');
    }

    function filterSalesMonitoring() {
      const input = document.getElementById('searchSalesMonitoring');
      const filter = input.value.toLowerCase();
      const tbody = document.getElementById('boardBody');
      const trs = tbody.getElementsByTagName('tr');

      for (let i = 0; i < trs.length; i++) {
        const tdName = trs[i].getElementsByTagName('td')[1];
        if (tdName) {
          const textValue = tdName.textContent || tdName.innerText;
          if (textValue.toLowerCase().indexOf(filter) > -1) {
            trs[i].style.display = '';
          } else {
            trs[i].style.display = 'none';
          }
        }
      }
    }

    async function loadPendingApprovals() {
      if (typeof window.checkPendingApprovalsGlobal === 'function') {
        window.checkPendingApprovalsGlobal();
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      guardSPV();
      renderUser();
      const selectBulanMon = document.getElementById('selectBulanMonitoring');
      if (selectBulanMon) {
        selectBulanMon.value = new Date().getMonth() + 1;
      }
      loadMonitoringBoard();
      loadPendingApprovals();
    });
