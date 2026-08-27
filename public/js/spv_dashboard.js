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
    window.location.href = '../pages_kacab/index_kacab.html';
    return;
  }
  if (peran !== 'Supervisor') {
    window.location.href = '../index.html';
    return;
  }
}

function renderUser(){
      const nama = localStorage.getItem('namaSales') || 'SPV';
      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      const cabang = localStorage.getItem('cabangSales') || '-';
      document.getElementById('spvNama').textContent = nama;
      document.getElementById('spvRole').textContent = peran;
      document.getElementById('dashCabang').textContent = cabang;

      const avatar = localStorage.getItem('fotoSales');
      const avatarEl = document.getElementById('spvAvatar');
      avatarEl.src = (avatar && avatar.trim() !== '')
        ? avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=f4f7f6&color=c8102e`;
    }

    async function loadTarget(){
      const idSales = localStorage.getItem('salesId') || localStorage.getItem('idSales') || 0;
      // endpoint target saat ini butuh id_sales. Untuk SPV nanti bisa dipakai id sales aggregator atau dibuat endpoint spv.
      // sementara: bila SPV login butuh idSales, gunakan nilai ini.
      if(!idSales || Number(idSales) === 0){
        document.getElementById('dashPeriode').textContent = 'Target: butuh salesId dari login.';
        return;
      }

      try{
        const res = await fetch(`../api/api_target.php?id_sales=${idSales}`);
        const data = await res.json();
        if(data.status === 'success'){
          document.getElementById('dashTarget').textContent = data.target_total;
          document.getElementById('dashRealisasi').textContent = data.realisasi_total;
          document.getElementById('dashSisa').textContent = data.sisa;
          document.getElementById('dashPersen').textContent = data.persentase + '%';
          document.getElementById('dashPeriode').textContent = data.periode;
          document.getElementById('dashSisaPesan').textContent = data.sisa > 0 ? `Sisa ${data.sisa} unit lagi` : '🎉 Target tercapai!';
          // animate progress bar
          const pct = Math.min(data.persentase || 0, 100);
          setTimeout(() => {
            const bar = document.getElementById('targetProgress');
            if (bar) bar.style.width = pct + '%';
          }, 300);
        }else if(data.status === 'empty'){
          document.getElementById('dashPeriode').textContent = data.message || 'Belum ada target.';
        }
      }catch(e){
        document.getElementById('dashPeriode').textContent = 'Gagal memuat target.';
        console.error(e);
      }
    }

    async function loadAnalytics() {
      const spvNama = localStorage.getItem('namaSales') || '';
      try {
        const res = await fetch(`../api/api_analytics.php?spv=${encodeURIComponent(spvNama)}`);
        const data = await res.json();
        if(data.status === 'success') {
          // Update Ringkasan Panel
          document.getElementById('dashPending').textContent = data.data.spk_summary['Menunggu'] || 0;
          document.getElementById('dashAktif').textContent = (data.data.spk_summary['Disetujui'] || 0) + (data.data.spk_summary['Menunggu'] || 0);

          // Build Chart
          const topModels = data.data.top_models;
          const labels = Object.keys(topModels);
          const chartData = Object.values(topModels);

          const ctx = document.getElementById('spvChart').getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labels.length > 0 ? labels : ['Belum Ada Data'],
              datasets: [{
                label: 'Total Unit Terjual (Disetujui)',
                data: chartData.length > 0 ? chartData : [0],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { stepSize: 1 }
                }
              }
            }
          });
        }
      } catch(err) {
        console.error("Failed to load analytics", err);
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      guardSPV();
      renderUser();
      loadTarget();
      loadAnalytics();
    });
