// Status chip
    document.querySelectorAll('.chip-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('jadwalStatus').value = btn.getAttribute('data-status');
      });
    });

    function simpanJadwal() {
      const form = document.getElementById('formJadwal');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const waktu = document.getElementById('jadwalWaktu').value;
      const judul = document.getElementById('jadwalJudul').value.trim();
      const deskripsi = document.getElementById('jadwalDeskripsi').value.trim();
      const status = document.getElementById('jadwalStatus').value;
      const sales_account_id = localStorage.getItem('idSales') || 1;

      fetch('../api/api_jadwal.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sales_account_id, waktu, judul, deskripsi, status })
      })
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            alert('Jadwal berhasil disimpan di database!', function() {
              window.location.href = '../index.html';
            });
          } else {
            alert('Gagal menyimpan jadwal: ' + res.message);
          }
        })
        .catch(err => {
          console.error(err);
          alert('Gagal terhubung ke server.');
        });
    }
