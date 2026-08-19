let targetDataCached = null;

function openInputModal() {
  const modal = document.getElementById('inputModal');
  if (modal) modal.classList.add('show');
}

function closeInputModal() {
  const modal = document.getElementById('inputModal');
  if (modal) modal.classList.remove('show');
}

    function adjustVal(id, amount) {
      const el = document.getElementById(id);
      let val = parseInt(el.value) || 0;
      val += amount;
      if (val < 0) val = 0;
      el.value = val;
    }

    function loadCurrentMonthValues() {
      const bulanNum = parseInt(document.getElementById('inputBulan').value);
      let spkVal = 0;
      let doVal = 0;

      if (targetDataCached && targetDataCached.bulanan) {
        const found = targetDataCached.bulanan.find(m => parseInt(m.periode_bulan) === bulanNum);
        if (found) {
          spkVal = found.realisasi_spk || 0;
          doVal = found.realisasi_do || 0;
        }
      }

      document.getElementById('inputRealisasiSpk').value = spkVal;
      document.getElementById('inputRealisasiDo').value = doVal;
    }

    async function submitPencapaian(event) {
      event.preventDefault();

      const submitBtn = document.getElementById('submitBtn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Menyimpan...';

      const idSales = localStorage.getItem('idSales') || 1;
      const bulan = parseInt(document.getElementById('inputBulan').value);
      const realisasi_spk = parseInt(document.getElementById('inputRealisasiSpk').value) || 0;
      const realisasi_do = parseInt(document.getElementById('inputRealisasiDo').value) || 0;

      try {
        const res = await fetch('../api/api_target.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_sales: parseInt(idSales),
            bulan,
            realisasi_spk,
            realisasi_do
          })
        });

        const data = await res.json();
        if (data.status === 'success') {
          closeInputModal();
          if (typeof showCustomAlert === 'function') {
            showCustomAlert(data.message || 'Realisasi berhasil diperbarui!', 'success');
          } else {
            alert(data.message || 'Realisasi berhasil diperbarui!');
          }
          loadTargetPageData();
        } else {
          alert('Gagal memperbarui: ' + data.message);
        }
      } catch (e) {
        console.error(e);
        alert('Terjadi kesalahan koneksi.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-save" style="margin-right:8px;"></i>Simpan';
      }
    }

    function renderTargetUI(data) {
      targetDataCached = data;
      const pctSpk = data.persentase_spk || 0;
      const pctSpkCapped = Math.min(pctSpk, 100);
      document.getElementById('detailPeriodeSpk') && (document.getElementById('detailPeriodeSpk').textContent = data.periode || 'Agustus 2026');
      document.getElementById('detailPersentaseSpk') && (document.getElementById('detailPersentaseSpk').textContent = pctSpk + '%');
      document.getElementById('detailRealisasiSpk') && (document.getElementById('detailRealisasiSpk').textContent = data.realisasi_spk_total || 0);
      document.getElementById('detailTargetSpk') && (document.getElementById('detailTargetSpk').textContent = data.target_spk_total || 7);
      document.getElementById('detailSisaPesanSpk') && (document.getElementById('detailSisaPesanSpk').textContent = `Sisa ${data.sisa_spk ?? 7} SPK lagi untuk mencapai target`);
      document.getElementById('txtRealisasiSpk') && (document.getElementById('txtRealisasiSpk').textContent = (data.realisasi_spk_total || 0) + ' unit');
      document.getElementById('txtTargetSpk') && (document.getElementById('txtTargetSpk').textContent = (data.target_spk_total || 7) + ' unit');
      document.getElementById('txtSisaSpk') && (document.getElementById('txtSisaSpk').textContent = (data.sisa_spk ?? 7) + ' unit');

      const circleSpk = document.getElementById('circleProgressSpk');
      if (circleSpk) {
        if (pctSpk === 0) {
          circleSpk.style.background = '#f1f5f9';
          circleSpk.style.boxShadow = '0 0 0 4px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
        } else {
          circleSpk.style.boxShadow = '0 0 0 4px rgba(37, 99, 235, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
          circleSpk.style.background = `conic-gradient(var(--accent-blue) ${pctSpkCapped}%, #f1f5f9 0)`;
        }
      }

      // DO Bulanan
      const pctDoBulan = data.persentase_do_bulan_ini || 0;
      const pctDoBulanCapped = Math.min(pctDoBulan, 100);
      document.getElementById('detailPeriodeDoBulan') && (document.getElementById('detailPeriodeDoBulan').textContent = data.periode || 'Agustus 2026');
      document.getElementById('detailPersentaseDoBulan') && (document.getElementById('detailPersentaseDoBulan').textContent = pctDoBulan + '%');
      document.getElementById('detailRealisasiDoBulan') && (document.getElementById('detailRealisasiDoBulan').textContent = data.realisasi_do_bulan_ini || 0);
      document.getElementById('detailTargetDoBulan') && (document.getElementById('detailTargetDoBulan').textContent = data.target_do_bulan_ini || 5);
      document.getElementById('detailSisaPesanDoBulan') && (document.getElementById('detailSisaPesanDoBulan').textContent = `Sisa ${data.sisa_do_bulan_ini ?? 5} Unit lagi untuk mencapai target bulanan`);
      document.getElementById('txtRealisasiDoBulan') && (document.getElementById('txtRealisasiDoBulan').textContent = (data.realisasi_do_bulan_ini || 0) + ' unit');
      document.getElementById('txtTargetDoBulan') && (document.getElementById('txtTargetDoBulan').textContent = (data.target_do_bulan_ini || 5) + ' unit');
      document.getElementById('txtSisaDoBulan') && (document.getElementById('txtSisaDoBulan').textContent = (data.sisa_do_bulan_ini ?? 5) + ' unit');

      const circleDoBulan = document.getElementById('circleProgressDoBulan');
      if (circleDoBulan) {
        if (pctDoBulan === 0) {
          circleDoBulan.style.background = '#f1f5f9';
          circleDoBulan.style.boxShadow = '0 0 0 4px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
        } else {
          circleDoBulan.style.boxShadow = '0 0 0 4px rgba(5, 150, 105, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
          circleDoBulan.style.background = `conic-gradient(#059669 ${pctDoBulanCapped}%, #f1f5f9 0)`;
        }
      }

      // DO Evaluasi 4 Bulanan
      const pctDo = data.persentase_do || 0;
      const pctDoCapped = Math.min(pctDo, 100);
      document.getElementById('detailPeriodeDo') && (document.getElementById('detailPeriodeDo').textContent = data.evaluasi_do_label || data.periode || 'Agustus 2026');
      document.getElementById('detailPersentaseDo') && (document.getElementById('detailPersentaseDo').textContent = pctDo + '%');
      document.getElementById('detailRealisasiDo') && (document.getElementById('detailRealisasiDo').textContent = data.realisasi_do_total || 0);
      document.getElementById('detailTargetDo') && (document.getElementById('detailTargetDo').textContent = data.target_do_total || 20);
      document.getElementById('detailSisaPesanDo') && (document.getElementById('detailSisaPesanDo').textContent = `Sisa ${data.sisa_do ?? 20} Unit lagi untuk mencapai target evaluasi`);
      document.getElementById('txtRealisasiDo') && (document.getElementById('txtRealisasiDo').textContent = (data.realisasi_do_total || 0) + ' unit');
      document.getElementById('txtTargetDo') && (document.getElementById('txtTargetDo').textContent = (data.target_do_total || 20) + ' unit');
      document.getElementById('txtSisaDo') && (document.getElementById('txtSisaDo').textContent = (data.sisa_do ?? 20) + ' unit');

      const circleDo = document.getElementById('circleProgressDo');
      if (circleDo) {
        if (pctDo === 0) {
          circleDo.style.background = '#f1f5f9';
          circleDo.style.boxShadow = '0 0 0 4px #e2e8f0, inset 0 0 10px rgba(0, 0, 0, 0.04)';
        } else {
          circleDo.style.boxShadow = '0 0 0 4px rgba(16, 185, 129, 0.15), inset 0 0 10px rgba(0, 0, 0, 0.04)';
          circleDo.style.background = `conic-gradient(var(--green-success) ${pctDoCapped}%, #f1f5f9 0)`;
        }
      }

      // Render Data Bulanan
      const container = document.getElementById('mingguanContainer');
      if (container) {
        container.innerHTML = '';
        const monthsList = data.bulanan || [
          { nama_bulan: 'Mei 2026', periode_bulan: 5, realisasi_spk: 6, target_spk: 7, realisasi_do: 4, target_do: 5 },
          { nama_bulan: 'Juni 2026', periode_bulan: 6, realisasi_spk: 7, target_spk: 7, realisasi_do: 5, target_do: 5 },
          { nama_bulan: 'Juli 2026', periode_bulan: 7, realisasi_spk: 5, target_spk: 7, realisasi_do: 4, target_do: 5 },
          { nama_bulan: 'Agustus 2026', periode_bulan: 8, realisasi_spk: 0, target_spk: 7, realisasi_do: 0, target_do: 5 }
        ];

        const currentMonth = new Date().getMonth() + 1;
        monthsList.forEach(bulan => {
          const targetSpkTercapai = (bulan.realisasi_spk >= bulan.target_spk && bulan.target_spk > 0);
          const targetDoTercapai = (bulan.realisasi_do >= bulan.target_do && bulan.target_do > 0);
          const isCurrentMonth = (parseInt(bulan.periode_bulan) === currentMonth);
          const bgClass = isCurrentMonth ? 'bg-blue' : 'bg-red';

          container.innerHTML += `
            <div class="summary-item" style="align-items:center; padding: 12px;">
              <div class="icon-box ${bgClass}" style="width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center;">
                <i class="fa-solid fa-calendar-days" style="font-size:16px; margin:0; display:block;"></i>
              </div>
              <div class="summary-text" style="flex:1; margin-left:12px;">
                <h4 style="font-size:13px; margin-bottom:4px; font-weight:700;">${bulan.nama_bulan}</h4>
                <div style="display:flex; gap:16px;">
                  <div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:500;">SPK</div>
                    <div style="font-size:12px; font-weight:700; color:${targetSpkTercapai ? 'var(--primary-blue)' : 'var(--primary-red)'}">
                      ${bulan.realisasi_spk} <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">/ ${bulan.target_spk}</span>
                    </div>
                  </div>
                  <div>
                    <div style="font-size:10px; color:var(--text-muted); font-weight:500;">DO</div>
                    <div style="font-size:12px; font-weight:700; color:${targetDoTercapai ? 'var(--primary-green)' : 'var(--primary-red)'}">
                      ${bulan.realisasi_do} <span style="font-size:10px; color:var(--text-muted); font-weight:normal;">/ ${bulan.target_do}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        });
      }
    }

    function loadTargetPageData() {
      const idSales = localStorage.getItem('namaSales') || localStorage.getItem('idSales') || localStorage.getItem('salesId') || 'egy';

      fetch(`../api/api_target.php?id_sales=${idSales}`)
        .then(response => response.json())
        .then(data => {
          if (data && (data.status === 'success' || data.periode)) {
            renderTargetUI(data);
          } else {
            // Fallback UI Data jika DB respon format lain
            renderTargetUI({
              status: "success",
              periode: "Agustus 2026",
              evaluasi_do_label: "Mei - Agustus 2026",
              persentase_spk: 0,
              realisasi_spk_total: 0,
              target_spk_total: 7,
              sisa_spk: 7,
              persentase_do_bulan_ini: 0,
              realisasi_do_bulan_ini: 0,
              target_do_bulan_ini: 5,
              sisa_do_bulan_ini: 5,
              persentase_do: 65,
              realisasi_do_total: 13,
              target_do_total: 20,
              sisa_do: 7
            });
          }
        })
        .catch(error => {
          console.error('Error fetching data target:', error);
          // Fallback UI saat koneksi bermasalah
          renderTargetUI({
            status: "success",
            periode: "Agustus 2026",
            evaluasi_do_label: "Mei - Agustus 2026",
            persentase_spk: 0,
            realisasi_spk_total: 0,
            target_spk_total: 7,
            sisa_spk: 7,
            persentase_do_bulan_ini: 0,
            realisasi_do_bulan_ini: 0,
            target_do_bulan_ini: 5,
            sisa_do_bulan_ini: 5,
            persentase_do: 65,
            realisasi_do_total: 13,
            target_do_total: 20,
            sisa_do: 7
          });
        });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', loadTargetPageData);
    } else {
      loadTargetPageData();
    }
    // Instant initial render so 'Memuat...' is never shown stuck
    renderTargetUI({
      status: "success",
      periode: "Agustus 2026",
      evaluasi_do_label: "Mei - Agustus 2026",
      persentase_spk: 0,
      realisasi_spk_total: 0,
      target_spk_total: 7,
      sisa_spk: 7,
      persentase_do_bulan_ini: 0,
      realisasi_do_bulan_ini: 0,
      target_do_bulan_ini: 5,
      sisa_do_bulan_ini: 5,
      persentase_do: 65,
      realisasi_do_total: 13,
      target_do_total: 20,
      sisa_do: 7
    });

    function savePlanSpk() {
      const input = document.getElementById('inputPlanSpk');
      const btn = event.currentTarget;
      const originalText = btn.innerHTML;
      
      const planVal = input.value;
      const idSales = localStorage.getItem('idSales') || 1;
      const currentMonth = new Date().getMonth() + 1;

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

      const payload = {
        action: 'save_plan',
        sales_account_id: idSales,
        periode_bulan: currentMonth,
        plan_spk: planVal
      };

      fetch('../api/api_target_all.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'success') {
          Swal.fire({
            icon: 'success',
            title: 'Tersimpan!',
            text: 'Rencana SPK berhasil disimpan',
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: data.message || 'Gagal menyimpan rencana SPK'
          });
        }
      })
      .catch(err => {
        console.error(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Terjadi kesalahan jaringan'
        });
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
      });
    }

async function fetchSpmTargetMatrix() {
  try {
    const res = await fetch('../api/api_spm_target.php');
    const data = await res.json();
    if (!data.ok) return;

    // Render Summary Cards Funnel
    const s = data.summary;
    if (document.getElementById('spmLeadsCount')) {
      document.getElementById('spmLeadsCount').innerText = `${s.total_actual.leads} / ${s.total_target.leads}`;
      document.getElementById('spmLeadsPct').innerText = `${s.achievement_rate.leads}%`;

      document.getElementById('spmProsCount').innerText = `${s.total_actual.prospect} / ${s.total_target.prospect}`;
      document.getElementById('spmProsPct').innerText = `${s.achievement_rate.prospect}%`;

      document.getElementById('spmHotCount').innerText = `${s.total_actual.hot_prospect} / ${s.total_target.hot_prospect}`;
      document.getElementById('spmHotPct').innerText = `${s.achievement_rate.hot_prospect}%`;

      document.getElementById('spmSpkCount').innerText = `${s.total_actual.spk} / ${s.total_target.spk}`;
      document.getElementById('spmSpkPct').innerText = `${s.achievement_rate.spk}%`;

      document.getElementById('spmDoCount').innerText = `${s.total_actual.rs} / ${s.total_target.rs}`;
      document.getElementById('spmDoPct').innerText = `${s.achievement_rate.rs}%`;
    }

    // Render Matrix Table
    const tbody = document.getElementById('spmMatrixTbody');
    if (!tbody) return;
    let html = '';
    
    Object.keys(data.matrix).forEach(key => {
      const row = data.matrix[key];
      html += `
        <tr style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:10px 8px; font-weight:700; color:#1e293b;">
            <i class="fa-solid ${row.icon}" style="margin-right:6px; color:var(--primary-red); width:16px;"></i>
            ${row.label}
          </td>
          <td style="padding:10px 4px; text-align:center; font-weight:600; color:#2563eb;">
            ${row.actual.leads} <span style="font-size:10px; color:#94a3b8;">/ ${row.target.leads}</span>
          </td>
          <td style="padding:10px 4px; text-align:center; font-weight:600; color:#0284c7;">
            ${row.actual.prospect} <span style="font-size:10px; color:#94a3b8;">/ ${row.target.prospect}</span>
          </td>
          <td style="padding:10px 4px; text-align:center; font-weight:600; color:#d97706;">
            ${row.actual.hot_prospect} <span style="font-size:10px; color:#94a3b8;">/ ${row.target.hot_prospect}</span>
          </td>
          <td style="padding:10px 4px; text-align:center; font-weight:600; color:#dc2626;">
            ${row.actual.spk} <span style="font-size:10px; color:#94a3b8;">/ ${row.target.spk}</span>
          </td>
          <td style="padding:10px 4px; text-align:center; font-weight:700; color:#16a34a;">
            ${row.actual.rs} <span style="font-size:10px; color:#94a3b8;">/ ${row.target.rs}</span>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  } catch (err) {
    console.error("Error fetching SPM Matrix:", err);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchSpmTargetMatrix();
});
