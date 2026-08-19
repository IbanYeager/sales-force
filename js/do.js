const sales_account_id = localStorage.getItem('idSales') || 1;

    function formatRupiahInput(value) {
      let number_string = value.replace(/[^,\d]/g, '').toString(),
          split = number_string.split(','),
          sisa = split[0].length % 3,
          rupiah = split[0].substr(0, sisa),
          ribuan = split[0].substr(sisa).match(/\d{3}/gi);
      
      if (ribuan) {
        separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
      }
      
      rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
      return rupiah;
    }

    let spkDataList = [];

    function loadSpkList() {
      fetch(`../api/api_spk.php?sales_account_id=${sales_account_id}`)
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success' && res.data) {
            // Hanya ambil SPK yang sudah disetujui SPV
            spkDataList = res.data.filter(s => s.status === 'Disetujui');
            const select = document.getElementById('spkSelect');
            if (!select) return;

            if (spkDataList.length === 0) {
              select.innerHTML = '<option value="">-- Tidak ada SPK Disetujui --</option>';
              return;
            }

            select.innerHTML = '<option value="">-- Pilih SPK --</option>';
            spkDataList.forEach(spk => {
              let opt = document.createElement('option');
              opt.value = spk.id;
              opt.textContent = `${spk.nama_customer} - ${spk.model}`;
              select.appendChild(opt);
            });
          }
        })
        .catch(err => console.error("Error loading SPK list:", err));
    }

    function autoFillSpkData() {
      const spkId = document.getElementById('spkSelect').value;
      if (!spkId) {
        document.getElementById('namaCustomer').value = '';
        document.getElementById('noHp').value = '';
        document.getElementById('model').value = '';
        document.getElementById('nominal').value = '';
        document.getElementById('tipePembelian').value = '';
        return;
      }

      const spk = spkDataList.find(s => s.id == spkId);
      if (spk) {
        document.getElementById('namaCustomer').value = spk.nama_customer;
        document.getElementById('noHp').value = spk.no_hp;
        document.getElementById('model').value = spk.model;
        document.getElementById('nominal').value = formatRupiahInput(spk.nominal.toString());
        document.getElementById('tipePembelian').value = spk.tipe_pembelian;
      }
    }

    function fetchDo() {
      fetch(`../api/api_spk.php?sales_account_id=${sales_account_id}`)
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success' && res.data) {
            const listEl = document.getElementById('spkList');
            if (!listEl) return;

            const doList = res.data.filter(s => s.status === 'DO');

            if (doList.length === 0) {
              listEl.innerHTML = '<p style="font-size:12px;color:var(--text-muted);line-height:1.6;">Belum ada data DO.</p>';
              return;
            }

            listEl.innerHTML = doList.map(s => {
              let badgeClass = 'chip-green';
              return `
                <div style="border-bottom: 1px solid var(--border-color); padding-bottom:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
                  <div>
                    <h4 style="font-size:13px; margin:0 0 4px 0;">${s.nama_customer}</h4>
                    <p style="font-size:11px; color:var(--text-muted); margin:0;">${s.model} • Rp ${s.nominal_jt} Jt • ${s.tipe_pembelian}</p>
                  </div>
                  <span class="chip ${badgeClass}" style="font-size:10px; font-weight:800; padding:4px 8px;">DO Disetujui</span>
                </div>
              `;
            }).join('');
          }
        })
        .catch(err => console.error("Error loading DOs:", err));
    }

    function submitDo() {
      const spkId = document.getElementById('spkSelect').value;

      if (!spkId) {
        alert('Pilih data SPK terlebih dahulu.');
        return;
      }

      const btn = document.querySelector('.btn-main');
      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';

      fetch('../api/api_spk.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'convert_to_do',
          spk_id: spkId
        })
      })
        .then(r => r.json())
        .then(res => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i> Submit DO';

          if (res.status === 'success') {
            alert('DO berhasil diinput!');
            document.getElementById('spkSelect').value = '';
            autoFillSpkData();
            fetchDo();
            loadSpkList();
          } else {
            alert('Gagal: ' + res.message);
          }
        })
        .catch(err => {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:10px;"></i> Submit DO';
          console.error(err);
          alert('Gagal terhubung ke server.');
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
      loadSpkList();
      fetchDo();
    });
