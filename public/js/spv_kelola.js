// User session check
    const loggedIn = localStorage.getItem('loggedIn') === 'true';
    const peranSales = localStorage.getItem('peranSales');
    if (!loggedIn) {
      window.location.href = '../pages/login_spv.html';
    } else if (peranSales === 'Kepala Cabang') {
      window.location.href = '../pages_kacab/index_kacab.html';
    } else if (peranSales === 'Sales Consultant' || peranSales === 'Sales') {
      window.location.href = '../index.html';
    } else if (peranSales !== 'Supervisor') {
      window.location.href = '../pages/login_spv.html';
    } else {
      const nama = localStorage.getItem('namaSales') || 'SPV';
      const peran = localStorage.getItem('peranSales') || 'Supervisor';
      document.getElementById('spvNama').textContent = nama;
      document.getElementById('spvRole').textContent = peran;

      const avatar = localStorage.getItem('fotoSales');
      document.getElementById('spvAvatar').src = (avatar && avatar.trim() !== '')
        ? avatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(nama)}&background=0f172a&color=fff`;
    }

    async function logoutUser() {
      localStorage.clear();
      window.location.href = '../pages/login_spv.html';
    }

    let spvLeafletMap = null;

    function switchTab(tabId, btn) {
      document.querySelectorAll('.data-content').forEach(el => {
        el.classList.remove('active');
        el.style.display = 'none';
      });
      document.querySelectorAll('.data-tab').forEach(el => el.classList.remove('active'));
      
      const targetContent = document.getElementById('tab-' + tabId);
      if (targetContent) {
        targetContent.classList.add('active');
        targetContent.style.display = 'block';
      }
      if (btn) btn.classList.add('active');

      if (tabId === 'heatmap') {
        setTimeout(initSpvGeoMap, 100);
      }
      if (tabId === 'biaya_iklan') {
        loadBiayaIklan();
      }
    }

    function initSpvGeoMap() {
      if (spvLeafletMap) {
        spvLeafletMap.invalidateSize();
        return;
      }

      const mapEl = document.getElementById('spvGeoMap');
      if (!mapEl || typeof L === 'undefined') return;

      // Center map around Jakarta / South Jakarta Hotspots
      spvLeafletMap = L.map('spvGeoMap').setView([-6.2088, 106.8456], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(spvLeafletMap);

      // Sample Prospek Hotspots & Test Drive Markers
      const PROSPEK_LOCATIONS = [
        { lat: -6.1754, lng: 106.8272, name: 'Bpk. Hendra (Hot Prospek - Stargazer)', type: 'hot', sales: 'Budi' },
        { lat: -6.2250, lng: 106.8010, name: 'Ibu Rina (SPK Pending - Creta)', type: 'hot', sales: 'Siti' },
        { lat: -6.2615, lng: 106.8106, name: 'PT Surya Transport (Fleet 5 Unit - Stargazer)', type: 'fleet', sales: 'Ahmad' },
        { lat: -6.1890, lng: 106.8910, name: 'Bpk. Doni (Test Drive Active)', type: 'testdrive', sales: 'Dhani' },
        { lat: -6.2900, lng: 106.7800, name: 'Dr. Maya (Hot Prospek - Ioniq 5)', type: 'hot', sales: 'Budi' }
      ];

      PROSPEK_LOCATIONS.forEach(loc => {
        let color = loc.type === 'hot' ? '#d7123a' : (loc.type === 'fleet' ? '#1e40af' : '#f97316');
        const circle = L.circleMarker([loc.lat, loc.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.7,
          radius: loc.type === 'fleet' ? 14 : 10
        }).addTo(spvLeafletMap);

        circle.bindPopup(`
          <div style="font-family:sans-serif; font-size:12px;">
            <strong style="color:${color};">${loc.name}</strong><br>
            <span>Sales PIC: <strong>${loc.sales}</strong></span><br>
            <span style="font-size:10px; color:#666;">Status: Live Monitoring</span>
          </div>
        `);
      });
    }

    function closeModal(id) {
      const el = document.getElementById(id);
      if (el) {
        el.classList.remove('show', 'active');
        el.style.display = 'none';
      }
    }

    // ==========================================
    // PRICELIST MANAGEMENT
    // ==========================================
    let dataPricelist = [];

    function loadPricelist() {
      fetch('../api/api_spv_manage_pricelist.php')
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            dataPricelist = res.data;
            renderPricelist();
          }
        });
    }

    function renderPricelist() {
      const tbody = document.getElementById('tablePricelist');
      tbody.innerHTML = '';
      if (dataPricelist.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data</td></tr>';
        return;
      }
      
      // Sort items by Kategori first, then Model
      const sortedData = [...dataPricelist].sort((a, b) => {
          const catA = (a.kategori && a.kategori !== 'undefined' && a.kategori !== 'Tanpa Kategori') ? a.kategori : getKategoriModel(a.model);
          const catB = (b.kategori && b.kategori !== 'undefined' && b.kategori !== 'Tanpa Kategori') ? b.kategori : getKategoriModel(b.model);
          if (catA !== catB) return catA.localeCompare(catB);
          return (a.model || '').localeCompare(b.model || '');
      });

      let currentKategori = null;
      sortedData.forEach(item => {
        const modelName = item.model || 'Tanpa Model';
        const kategoriText = (item.kategori && item.kategori !== 'undefined' && item.kategori !== 'Tanpa Kategori') ? item.kategori : getKategoriModel(modelName);
        const safeId = 'cat-' + kategoriText.replace(/[^a-zA-Z0-9]/g, '');
        
        if (kategoriText !== currentKategori) {
          const trGroup = document.createElement('tr');
          trGroup.innerHTML = `<th colspan="6" class="accordion-header" onclick="toggleDataGroup('${safeId}')">
            <i class="fa-solid fa-chevron-right" id="icon-${safeId}" style="margin-right:6px; color:var(--muted);"></i> Kategori: ${kategoriText}
          </th>`;
          tbody.appendChild(trGroup);
          currentKategori = kategoriText;
        }

        const tr = document.createElement('tr');
        tr.className = 'row-' + safeId;
        tr.style.display = 'none';
        tr.innerHTML = `
          <td><strong>${item.model}</strong></td>
          <td>${item.tipe}</td>
          <td><span style="background:#e2e8f0; padding:2px 6px; border-radius:4px; font-size:11px; font-weight:700;">${kategoriText}</span></td>
          <td>Rp ${Number(item.harga_mt).toLocaleString('id-ID')}</td>
          <td>Rp ${Number(item.harga_at).toLocaleString('id-ID')}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editPricelist(${item.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn btn-del" onclick="deletePricelist(${item.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function openModalPricelist() {
      document.getElementById('titleModalPricelist').textContent = 'Tambah Mobil';
      document.getElementById('formPriceId').value = '';
      document.getElementById('formPriceModel').value = '';
      document.getElementById('formPriceTipe').value = '';
      document.getElementById('formPriceMT').value = '';
      document.getElementById('formPriceAT').value = '';
      document.getElementById('formPriceKategori').value = 'MPV';
      document.getElementById('formPriceOrder').value = '99';
      document.getElementById('modalPricelist').classList.add('show');
    }

    function editPricelist(param) {
      const item = typeof param === 'object' ? param : dataPricelist.find(x => x.id == param);
      if (!item) return;
      document.getElementById('titleModalPricelist').textContent = 'Edit Mobil';
      document.getElementById('formPriceId').value = item.id;
      document.getElementById('formPriceModel').value = item.model;
      document.getElementById('formPriceTipe').value = item.tipe;
      document.getElementById('formPriceMT').value = item.harga_mt;
      document.getElementById('formPriceAT').value = item.harga_at;
      document.getElementById('formPriceKategori').value = item.kategori;
      document.getElementById('formPriceOrder').value = item.kategori_order || 99;
      document.getElementById('modalPricelist').classList.add('show');
    }

    function savePricelist() {
      const id = document.getElementById('formPriceId').value;
      const data = {
        kategori: document.getElementById('formPriceKategori').value,
        model: document.getElementById('formPriceModel').value,
        tipe: document.getElementById('formPriceTipe').value,
        harga_mt: document.getElementById('formPriceMT').value,
        harga_at: document.getElementById('formPriceAT').value,
        kategori_order: document.getElementById('formPriceOrder').value
      };

      const method = id ? 'PUT' : 'POST';
      if (id) data.id = id;

      fetch('../api/api_spv_manage_pricelist.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            showCustomAlert('Sukses', res.message, 'success');
            closeModal('modalPricelist');
            loadPricelist();
          } else {
            showCustomAlert('Error', res.message, 'error');
          }
        });
    }

    async function deletePricelist(id) {
      const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus mobil ini?') : confirm('Yakin ingin menghapus mobil ini?'));
    if (isConfirmed) {
        fetch('../api/api_spv_manage_pricelist.php', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: id })
        })
          .then(r => r.json())
          .then(res => {
            if (res.status === 'success') {
              loadPricelist();
            } else {
              showCustomAlert('Error', res.message, 'error');
            }
          });
      }
    }

    // ==========================================
    // POLREG MANAGEMENT
    // ==========================================
    let dataPolreg = [];

    async function loadPolreg() {
      fetch('../api/api_spv_manage_polreg.php')
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            dataPolreg = res.data;
            renderPolreg();
          }
        });
    }

    function renderPolreg() {
      const tbody = document.getElementById('tablePolreg');
      tbody.innerHTML = '';
      if (dataPolreg.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Tidak ada data</td></tr>';
        return;
      }
      
      // Sort data: Tahun (Descending) -> Kecamatan (Ascending)
      const sortedPolreg = [...dataPolreg].sort((a,b) => {
          if (a.tahun !== b.tahun) return parseInt(b.tahun) - parseInt(a.tahun);
          return (a.kecamatan||'').localeCompare(b.kecamatan||'');
      });

      let currentYear = null;
      let currentKec = null;

      sortedPolreg.forEach(item => {
        const thn = item.tahun || '2026';
        const kec = item.kecamatan || 'Tanpa Wilayah';
        
        // Year separator
        if (thn !== currentYear) {
          const trYear = document.createElement('tr');
          trYear.className = 'year-header';
          trYear.innerHTML = `<th colspan="5" style="background:linear-gradient(90deg, var(--primary-red), #c50f1f); color:white; padding:10px 18px; font-size:13px; text-transform:uppercase; letter-spacing:1px; border-radius:4px;">DATA TAHUN ${thn}</th>`;
          tbody.appendChild(trYear);
          currentYear = thn;
          currentKec = null; // reset kecamatan grouping
        }

        const safeId = 'pol-' + thn + '-' + kec.replace(/[^a-zA-Z0-9]/g, '');
        
        // Kecamatan accordion
        if (kec !== currentKec) {
          const trKec = document.createElement('tr');
          trKec.innerHTML = `<th colspan="5" class="accordion-header" onclick="toggleDataGroup('${safeId}')" style="padding-left:24px !important;">
            <i class="fa-solid fa-chevron-right" id="icon-${safeId}" style="margin-right:6px; color:var(--muted);"></i> Kecamatan: ${kec}
          </th>`;
          tbody.appendChild(trKec);
          currentKec = kec;
        }
        
        const tr = document.createElement('tr');
        tr.className = 'row-' + safeId;
        tr.style.display = 'none';
        tr.innerHTML = `
          <td style="padding-left:46px;"><strong>${item.kecamatan}</strong></td>
          <td>${item.tahun}</td>
          <td>${item.merk}</td>
          <td>${item.type}</td>
          <td>
            <button class="action-btn btn-edit" onclick="editPolreg(${item.id})"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn btn-del" onclick="deletePolreg(${item.id})"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    function openModalPolreg() {
      document.getElementById('titleModalPolreg').textContent = 'Tambah Polreg';
      document.getElementById('formPolregId').value = '';
      document.getElementById('formPolregKecamatan').value = '';
      document.getElementById('formPolregTahun').value = '2026';
      document.getElementById('formPolregMerk').value = '';
      document.getElementById('formPolregType').value = '';
      document.getElementById('wrapJumlahPolreg').style.display = 'block';
      document.getElementById('formPolregJumlah').value = '1';
      document.getElementById('modalPolreg').classList.add('show');
    }

    function editPolreg(param) {
      const item = typeof param === 'object' ? param : dataPolreg.find(x => x.id == param);
      if (!item) return;
      document.getElementById('titleModalPolreg').textContent = 'Edit Polreg';
      document.getElementById('formPolregId').value = item.id;
      document.getElementById('formPolregKecamatan').value = item.kecamatan;
      document.getElementById('formPolregTahun').value = item.tahun;
      document.getElementById('formPolregMerk').value = item.merk;
      document.getElementById('formPolregType').value = item.type;
      document.getElementById('wrapJumlahPolreg').style.display = 'none'; // Sembunyikan input jumlah saat edit
      document.getElementById('modalPolreg').classList.add('show');
    }

    function savePolreg() {
      const id = document.getElementById('formPolregId').value;
      const data = {
        kecamatan: document.getElementById('formPolregKecamatan').value,
        tahun: document.getElementById('formPolregTahun').value,
        merk: document.getElementById('formPolregMerk').value,
        type: document.getElementById('formPolregType').value
      };

      const method = id ? 'PUT' : 'POST';
      if (id) {
        data.id = id;
      } else {
        data.jumlah = document.getElementById('formPolregJumlah').value;
      }

      fetch('../api/api_spv_manage_polreg.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            showCustomAlert('Sukses', res.message, 'success');
            closeModal('modalPolreg');
            loadPolreg();
          } else {
            showCustomAlert('Error', res.message, 'error');
          }
        });
    }

    async function deletePolreg(id) {
      const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus data ini?') : confirm('Yakin ingin menghapus data ini?'));
    if (isConfirmed) {
        fetch('../api/api_spv_manage_polreg.php', {
          method: 'DELETE',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: id})
        })
        .then(r => r.json())
        .then(res => {
          if(res.status === 'success') {
            loadPolreg();
          } else {
            showCustomAlert('Error', res.message, 'error');
          }
        });
      }
    }

    // Toggle accordion logic
    async function toggleDataGroup(groupId) {
      const rows = document.querySelectorAll('.row-' + groupId);
      const icon = document.getElementById('icon-' + groupId);
      let isHidden = false;
      rows.forEach(row => {
        if (row.style.display === 'none') {
          row.style.display = 'table-row';
          isHidden = false;
        } else {
          row.style.display = 'none';
          isHidden = true;
        }
      });
      if (icon) {
        icon.className = isHidden ? 'fa-solid fa-chevron-right' : 'fa-solid fa-chevron-down';
      }
    }

    // ==========================================
    // TEST DRIVE UNITS
    // ==========================================
    let dataTestDrive = [];

    function loadTestDriveUnits() {
      fetch('../api/api_spv_manage_testdrive_unit.php')
        .then(r => r.json())
        .then(res => {
          if (res.status === 'success') {
            dataTestDrive = res.data;
            renderTestDriveUnits();
          }
        });
    }

    function renderTestDriveUnits() {
      const tbody = document.getElementById('tableTestDriveUnit');
      tbody.innerHTML = '';
      if (dataTestDrive.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data</td></tr>';
        return;
      }
      dataTestDrive.forEach(item => {
        const tr = document.createElement('tr');
        const isTersedia = item.ketersediaan === 'tersedia';
        const badgeColor = isTersedia ? 'background:rgba(16, 185, 129, 0.1); color:#10b981;' : 'background:rgba(239, 68, 68, 0.1); color:var(--danger);';
        const targetStatus = isTersedia ? 'tidak tersedia' : 'tersedia';
        const targetDisplay = isTersedia ? 'Tidak Tersedia' : 'Tersedia';
        tr.innerHTML = `
          <td><strong>${item.model}</strong></td>
          <td>${item.type}</td>
          <td>${item.warna}</td>
          <td>${item.tahun}</td>
          <td><span style="padding:4px 8px; border-radius:6px; font-size:11px; font-weight:800; text-transform:capitalize; ${badgeColor}">${item.ketersediaan}</span></td>
          <td style="display:flex; gap:4px;">
            <button class="action-btn btn-edit" style="padding:4px 8px;" onclick="editTestDrive('${item.id}')" title="Edit Unit"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn" style="background:#f1f5f9; color:var(--text-dark); border:1px solid var(--border); padding:4px 8px; font-size:11px;" onclick="updateTestDriveStatus('${item.id}', '${targetStatus}')" title="Ubah Status">
              <i class="fa-solid fa-rotate"></i>
            </button>
            <button class="action-btn btn-del" style="padding:4px 8px;" onclick="deleteTestDrive('${item.id}')" title="Hapus Unit"><i class="fa-solid fa-trash"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    async function updateTestDriveStatus(id, targetStatus) {
      const display = targetStatus === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia';
      const isConfirmed = await (window.customConfirm ? window.customConfirm(`Yakin ingin mengubah status mobil ini menjadi ${display}?`) : confirm(`Yakin ingin mengubah status mobil ini menjadi ${display}?`));
    if (isConfirmed) {
        fetch('../api/api_spv_manage_testdrive_unit.php', {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: id, ketersediaan: targetStatus})
        })
        .then(r => r.json())
        .then(res => {
          if(res.status === 'success') {
            loadTestDriveUnits();
          } else {
            showCustomAlert('Error', res.message, 'error');
          }
        });
      }
    }

    async function updateTdTypeDropdown() {
      const modelInput = document.getElementById('formTdModel').value.toLowerCase();
      const typeList = document.getElementById('tdTypeOptions');
      if (!typeList) return;
      typeList.innerHTML = '';
      if (!modelInput) return;

      const matchingModels = dataPricelist.filter(item => item.model.toLowerCase().includes(modelInput));
      const uniqueTypes = [...new Set(matchingModels.map(item => item.tipe))];
      uniqueTypes.forEach(t => {
        const option = document.createElement('option');
        option.value = t;
        typeList.appendChild(option);
      });
    }

    function populateTdModelDropdown() {
      const modelList = document.getElementById('tdModelOptions');
      if (!modelList) return;
      modelList.innerHTML = '';
      const uniqueModels = [...new Set(dataPricelist.map(item => item.model))];
      uniqueModels.forEach(m => {
        const option = document.createElement('option');
        option.value = m;
        modelList.appendChild(option);
      });
    }

    function openModalTestDrive() {
      populateTdModelDropdown();
      document.getElementById('tdTypeOptions').innerHTML = '';
      document.getElementById('titleModalTestDrive').textContent = 'Tambah Unit Test Drive';
      document.getElementById('formTdId').value = '';
      document.getElementById('formTdModel').value = '';
      document.getElementById('formTdType').value = '';
      document.getElementById('formTdWarna').value = '';
      document.getElementById('formTdTahun').value = '2024';
      document.getElementById('formTdKetersediaan').value = 'tersedia';
      document.getElementById('modalTestDrive').classList.add('show');
    }

    function editTestDrive(param) {
      const item = typeof param === 'object' ? param : dataTestDrive.find(x => x.id == param);
      if (!item) return;
      populateTdModelDropdown();
      document.getElementById('titleModalTestDrive').textContent = 'Edit Unit Test Drive';
      document.getElementById('formTdId').value = item.id;
      document.getElementById('formTdModel').value = item.model;
      updateTdTypeDropdown();
      document.getElementById('formTdType').value = item.type;
      document.getElementById('formTdWarna').value = item.warna;
      document.getElementById('formTdTahun').value = item.tahun;
      document.getElementById('formTdKetersediaan').value = item.ketersediaan;
      document.getElementById('modalTestDrive').classList.add('show');
    }

    function saveTestDrive() {
      const id = document.getElementById('formTdId').value;
      const data = {
        model: document.getElementById('formTdModel').value,
        type: document.getElementById('formTdType').value,
        warna: document.getElementById('formTdWarna').value,
        tahun: document.getElementById('formTdTahun').value,
        ketersediaan: document.getElementById('formTdKetersediaan').value
      };

      const method = id ? 'PUT' : 'POST';
      if (id) {
        data.id = id;
        data.action = 'update_full';
      }

      fetch('../api/api_spv_manage_testdrive_unit.php', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      .then(r => r.json())
      .then(res => {
        if(res.status === 'success') {
          closeModal('modalTestDrive');
          if(typeof showCustomAlert === 'function') showCustomAlert('Sukses', res.message, 'success');
          else alert(res.message);
          loadTestDriveUnits();
        } else {
          alert('Error: ' + res.message);
        }
      });
    }

    async function deleteTestDrive(id) {
      const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus unit test drive ini?') : confirm('Yakin ingin menghapus unit test drive ini?'));
    if (!isConfirmed) return;
      fetch('../api/api_spv_manage_testdrive_unit.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: id})
      })
      .then(r => r.json())
      .then(res => {
        if(res.status === 'success') loadTestDriveUnits();
        else alert('Error: ' + res.message);
      });
    }

    // Initialize
    loadPricelist();
    loadPolreg();
    loadTestDriveUnits();

// ==========================================
// LEASING MANAGEMENT
// ==========================================
let currentLeasingData = [];

async function fetchLeasing() {
    fetch('../api/api_spv_manage_kalkulator.php?action=get_leasing')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentLeasingData = data.data;
                renderLeasing();
            }
        })
        .catch(e => console.error(e));
}

function renderLeasing() {
    const tbody = document.getElementById('tableLeasing');
    tbody.innerHTML = '';
    if (currentLeasingData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;">Belum ada data leasing</td></tr>';
        return;
    }
    currentLeasingData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama_leasing}</td>
            <td>
                <span style="padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; background:${item.status === 'Aktif' ? '#dcfce7' : '#fee2e2'}; color:${item.status === 'Aktif' ? '#166534' : '#991b1b'};">
                    ${item.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" style="padding:6px 10px;" onclick="editLeasing(${item.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-danger" style="padding:6px 10px;" onclick="deleteLeasing(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModalLeasing() {
    document.getElementById('titleModalLeasing').textContent = 'Tambah Leasing';
    document.getElementById('formLeasingId').value = '';
    document.getElementById('formLeasingNama').value = '';
    document.getElementById('formLeasingStatus').value = 'Aktif';
    document.getElementById('modalLeasing').classList.add('show');
}

function editLeasing(param) {
    const item = typeof param === 'object' ? param : currentLeasingData.find(x => x.id == param);
    if (!item) return;
    document.getElementById('titleModalLeasing').textContent = 'Edit Leasing';
    document.getElementById('formLeasingId').value = item.id;
    document.getElementById('formLeasingNama').value = item.nama_leasing;
    document.getElementById('formLeasingStatus').value = item.status;
    document.getElementById('modalLeasing').classList.add('show');
}

function saveLeasing() {
    const id = document.getElementById('formLeasingId').value;
    const nama_leasing = document.getElementById('formLeasingNama').value;
    const status = document.getElementById('formLeasingStatus').value;

    fetch('../api/api_spv_manage_kalkulator.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_leasing', id, nama_leasing, status })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            closeModal('modalLeasing');
            if (typeof showCustomAlert === 'function') {
                showCustomAlert(data.message, 'success');
            } else {
                alert(data.message);
            }
            fetchLeasing();
        } else {
            alert('Gagal: ' + data.message);
        }
    })
    .catch(e => {
        console.error(e);
        alert('Terjadi kesalahan jaringan.');
    });
}

async function deleteLeasing(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus leasing ini?') : confirm('Yakin ingin menghapus leasing ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_kalkulator.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_leasing', id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            fetchLeasing();
        } else {
            alert('Gagal menghapus leasing.');
        }
    });
}

// ==========================================
// PROVINSI MANAGEMENT
// ==========================================
let currentProvinsiData = [];

async function fetchProvinsi() {
    fetch('../api/api_spv_manage_kalkulator.php?action=get_provinsi')
        .then(res => res.json())
        .then(data => {
            if (data.status === 'success') {
                currentProvinsiData = data.data;
                renderProvinsi();
            }
        })
        .catch(e => console.error(e));
}

function renderProvinsi() {
    const tbody = document.getElementById('tableProvinsi');
    tbody.innerHTML = '';
    if (currentProvinsiData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada data provinsi</td></tr>';
        return;
    }
    currentProvinsiData.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id || (idx + 1)}</td>
            <td><strong>${item.nama_provinsi}</strong></td>
            <td>${item.suku_bunga}%</td>
            <td>
                <span style="padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; background:${item.status === 'Aktif' ? '#dcfce7' : '#fee2e2'}; color:${item.status === 'Aktif' ? '#166534' : '#991b1b'};">
                    ${item.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" style="padding:6px 10px;" onclick="editProvinsi(${item.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-danger" style="padding:6px 10px;" onclick="deleteProvinsi(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModalProvinsi() {
    document.getElementById('titleModalProvinsi').textContent = 'Tambah Provinsi';
    document.getElementById('formProvinsiId').value = '';
    document.getElementById('formProvinsiNama').value = '';
    document.getElementById('formProvinsiBunga').value = '';
    document.getElementById('formProvinsiStatus').value = 'Aktif';
    document.getElementById('modalProvinsi').classList.add('show');
}

function editProvinsi(param) {
    const item = typeof param === 'object' ? param : currentProvinsiData.find(x => x.id == param);
    if (!item) return;
    document.getElementById('titleModalProvinsi').textContent = 'Edit Provinsi';
    document.getElementById('formProvinsiId').value = item.id;
    document.getElementById('formProvinsiNama').value = item.nama_provinsi;
    document.getElementById('formProvinsiBunga').value = item.suku_bunga;
    document.getElementById('formProvinsiStatus').value = item.status;
    document.getElementById('modalProvinsi').classList.add('show');
}

function saveProvinsi() {
    const id = document.getElementById('formProvinsiId').value;
    const nama_provinsi = document.getElementById('formProvinsiNama').value;
    const suku_bunga = document.getElementById('formProvinsiBunga').value;
    const status = document.getElementById('formProvinsiStatus').value;

    fetch('../api/api_spv_manage_kalkulator.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_provinsi', id, nama_provinsi, suku_bunga, status })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            closeModal('modalProvinsi');
            if (typeof showCustomAlert === 'function') {
                showCustomAlert(data.message, 'success');
            } else {
                alert(data.message);
            }
            fetchProvinsi();
        } else {
            alert('Gagal: ' + data.message);
        }
    })
    .catch(e => {
        console.error(e);
        alert('Terjadi kesalahan jaringan.');
    });
}

async function deleteProvinsi(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus provinsi ini?') : confirm('Yakin ingin menghapus provinsi ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_kalkulator.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_provinsi', id })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === 'success') {
            fetchProvinsi();
        } else {
            alert('Gagal menghapus provinsi.');
        }
    });
}

// Hook into initial load
document.addEventListener('DOMContentLoaded', () => {
    fetchLeasing();
    fetchProvinsi();
    loadInventory();
    loadMerchandise();
    loadBrosur();
    loadTcoItems();
});

// ==========================================
// INVENTORY MANAGEMENT
// ==========================================
let currentInventoryData = [];

async function loadInventory() {
    fetch('../api/api_spv_manage_inventory.php')
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            currentInventoryData = res.data || [];
            const tbody = document.getElementById('tableInventory');
            tbody.innerHTML = '';
            if(currentInventoryData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data inventory</td></tr>';
                return;
            }
            currentInventoryData.forEach(item => {
                let statusBadge = item.status === 'Tersedia' 
                    ? '<span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700;">Tersedia</span>'
                    : `<span style="background:#fef3c7; color:#d97706; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700;">${item.status}</span>`;
                
                if(item.stok === 0 || item.status === 'Kosong') {
                    statusBadge = '<span style="background:#fee2e2; color:#b91c1c; padding:2px 8px; border-radius:99px; font-size:11px; font-weight:700;">Kosong</span>';
                }

                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.model}</strong></td>
                    <td>${item.varian}</td>
                    <td>${item.warna}</td>
                    <td><strong>${item.stok}</strong></td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editInventory(${item.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn btn-del" onclick="deleteInventory(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
}

function openModalInventory() {
    document.getElementById('modalInventoryTitle').textContent = 'Tambah Inventory';
    document.getElementById('formInventory').reset();
    document.getElementById('inv_id').value = '';
    document.getElementById('modalInventory').classList.add('show');
}

function editInventory(param) {
    const item = typeof param === 'object' ? param : currentInventoryData.find(x => x.id == param);
    if (!item) return;
    document.getElementById('modalInventoryTitle').textContent = 'Edit Inventory';
    document.getElementById('inv_id').value = item.id;
    document.getElementById('inv_model').value = item.model;
    document.getElementById('inv_varian').value = item.varian;
    document.getElementById('inv_warna').value = item.warna;
    document.getElementById('inv_stok').value = item.stok;
    document.getElementById('inv_status').value = item.status;
    document.getElementById('modalInventory').classList.add('show');
}

function saveInventory(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    fetch('../api/api_spv_manage_inventory.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            closeModal('modalInventory');
            if (typeof showCustomAlert === 'function') showCustomAlert(res.message, 'success');
            else alert(res.message);
            loadInventory();
        } else {
            alert(res.message);
        }
    });
}

async function deleteInventory(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin hapus data inventory ini?') : confirm('Yakin hapus data inventory ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_inventory.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') loadInventory();
        else alert(res.message);
    });
}

// ==========================================
// MERCHANDISE MANAGEMENT
// ==========================================
let currentMerchandiseData = [];

async function loadMerchandise() {
    fetch('../api/api_spv_manage_merchandise.php')
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            currentMerchandiseData = res.data || [];
            const tbody = document.getElementById('tableMerchandise');
            tbody.innerHTML = '';
            if(currentMerchandiseData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Tidak ada data merchandise</td></tr>';
                return;
            }
            currentMerchandiseData.forEach(item => {
                const imgUrl = (item.image && item.image.trim() !== '') ? '../' + item.image : 'https://placehold.co/100x100?text=No+Image';
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><img src="${imgUrl}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; border:1px solid #e2e8f0;"></td>
                    <td><strong>${item.name}</strong><br><small style="color:var(--text-muted);">${item.size || '-'}</small></td>
                    <td>${item.part_number}</td>
                    <td>Rp ${Number(item.retail_price).toLocaleString('id-ID')}</td>
                    <td><strong>${item.stock_cabang}</strong></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editMerchandise(${item.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn btn-del" onclick="deleteMerchandise(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
}

function openModalMerchandise() {
    document.getElementById('modalMerchandiseTitle').textContent = 'Tambah Merchandise';
    document.getElementById('formMerchandise').reset();
    document.getElementById('merc_id').value = '';
    document.getElementById('merc_image_existing').value = '';
    document.getElementById('merc_image_help').textContent = '';
    document.getElementById('modalMerchandise').classList.add('show');
}

function editMerchandise(param) {
    const item = typeof param === 'object' ? param : currentMerchandiseData.find(x => x.id == param);
    if (!item) return;
    document.getElementById('modalMerchandiseTitle').textContent = 'Edit Merchandise';
    document.getElementById('merc_id').value = item.id;
    document.getElementById('merc_name').value = item.name;
    document.getElementById('merc_part_number').value = item.part_number;
    document.getElementById('merc_size').value = item.size || '';
    document.getElementById('merc_retail_price').value = item.retail_price;
    document.getElementById('merc_stock_cabang').value = item.stock_cabang;
    document.getElementById('merc_stock_tam').value = item.stock_tam;
    document.getElementById('merc_image_existing').value = item.image || '';
    if(item.image) {
        document.getElementById('merc_image_help').textContent = 'Gambar saat ini: ' + item.image;
    } else {
        document.getElementById('merc_image_help').textContent = '';
    }
    document.getElementById('modalMerchandise').classList.add('show');
}

function saveMerchandise(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    fetch('../api/api_spv_manage_merchandise.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            closeModal('modalMerchandise');
            if (typeof showCustomAlert === 'function') showCustomAlert(res.message, 'success');
            else alert(res.message);
            loadMerchandise();
        } else {
            alert(res.message);
        }
    });
}

async function deleteMerchandise(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus data ini?') : confirm('Yakin ingin menghapus data ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_merchandise.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') loadMerchandise();
        else alert(res.message);
    });
}

// ==========================================
// BROSUR MANAGEMENT
// ==========================================
let currentBrosurData = [];

async function loadBrosur() {
    fetch('../api/api_spv_manage_brosur.php')
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            currentBrosurData = res.data || [];
            const tbody = document.getElementById('tableBrosur');
            tbody.innerHTML = '';
            if(currentBrosurData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Tidak ada data brosur</td></tr>';
                return;
            }
            currentBrosurData.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${item.nama}</strong></td>
                    <td>${item.deskripsi}</td>
                    <td><a href="${item.pdf_url}" target="_blank" style="color:var(--primary-blue); font-size:12px; font-weight:700;"><i class="fa-solid fa-file-pdf"></i> Lihat PDF</a></td>
                    <td>
                        <button class="action-btn btn-edit" onclick="editBrosur(${item.id})"><i class="fa-solid fa-pen"></i></button>
                        <button class="action-btn btn-del" onclick="deleteBrosur(${item.id})"><i class="fa-solid fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    });
}

function openModalBrosur() {
    document.getElementById('modalBrosurTitle').textContent = 'Tambah Brosur';
    document.getElementById('formBrosur').reset();
    document.getElementById('brosur_id').value = '';
    document.getElementById('brosur_pdf_existing').value = '';
    document.getElementById('brosur_pdf_help').textContent = '';
    document.getElementById('modalBrosur').classList.add('show');
}

function editBrosur(param) {
    const item = typeof param === 'object' ? param : currentBrosurData.find(x => x.id == param);
    if (!item) return;
    document.getElementById('modalBrosurTitle').textContent = 'Edit Brosur';
    document.getElementById('brosur_id').value = item.id;
    document.getElementById('brosur_nama').value = item.nama;
    document.getElementById('brosur_deskripsi').value = item.deskripsi;
    document.getElementById('brosur_pdf_existing').value = item.pdf_url || '';
    if(item.pdf_url) {
        document.getElementById('brosur_pdf_help').textContent = 'PDF saat ini: ' + item.pdf_url;
    } else {
        document.getElementById('brosur_pdf_help').textContent = '';
    }
    document.getElementById('modalBrosur').classList.add('show');
}

function saveBrosur(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    fetch('../api/api_spv_manage_brosur.php', {
        method: 'POST',
        body: formData
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            closeModal('modalBrosur');
            if (typeof showCustomAlert === 'function') showCustomAlert(res.message, 'success');
            else alert(res.message);
            loadBrosur();
        } else {
            alert(res.message);
        }
    });
}

async function deleteBrosur(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin ingin menghapus data brosur ini?') : confirm('Yakin ingin menghapus data brosur ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_brosur.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: id })
    })
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') loadBrosur();
        else alert(res.message);
    });
}

// ==========================================
// TCO MANAGEMENT
// ==========================================
let currentTcoModels = [];
let currentTcoItems = [];

async function loadTcoModels() {
    return fetch('../api/api_spv_manage_tco.php?action=get_models')
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            currentTcoModels = res.data;
            const select = document.getElementById('tco_item_model_id');
            select.innerHTML = '<option value="">-- Pilih Model --</option>';
            const tbody = document.getElementById('tableTcoModelsList');
            tbody.innerHTML = '';
            
            if(res.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada model</td></tr>';
            } else {
                res.data.forEach(m => {
                    select.innerHTML += `<option value="${m.id}">${m.name}</option>`;
                    tbody.innerHTML += `
                        <tr>
                            <td>${m.id}</td>
                            <td>${m.name}</td>
                            <td>${m.pdfPage}</td>
                            <td>
                                <button type="button" class="action-btn btn-edit" onclick="editTcoModel(${m.id})"><i class="fa-solid fa-pen"></i></button>
                                <button type="button" class="action-btn btn-del" onclick="deleteTcoModel(${m.id})"><i class="fa-solid fa-trash"></i></button>
                            </td>
                        </tr>
                    `;
                });
            }
        }
    });
}

function loadTcoItems() {
    fetch('../api/api_spv_manage_tco.php?action=get_items')
    .then(r => r.json())
    .then(res => {
        if(res.status === 'success') {
            currentTcoItems = res.data;
            renderTcoItems();
        }
    });
}

    // ==========================================
    // TOYOTA CATEGORY MAPPING
    // ==========================================
    function getKategoriModel(modelName) {
      const name = (modelName || '').toUpperCase();
      if (name.includes('ALPHARD') || name.includes('VELLFIRE') || name.includes('VOXY') || name.includes('INNOVA') || name.includes('SIENTA') || name.includes('AVANZA') || name.includes('VELOZ') || name.includes('CALYA')) return 'MPV';
      if (name.includes('LAND CRUISER') || name.includes('FORTUNER') || name.includes('CROSS') || name.includes('RUSH') || name.includes('RAIZE') || name.includes('BZ4X') || name.includes('RAV4')) return 'SUV';
      if (name.includes('YARIS') && !name.includes('CROSS') && !name.includes('GR')) return 'HATCHBACK';
      if (name.includes('AGYA')) return 'HATCHBACK';
      if (name.includes('CAMRY') || name.includes('ALTIS') || name.includes('VIOS')) return 'SEDAN';
      if (name.includes('HILUX') || name.includes('HIACE') || name.includes('DYNA')) return 'COMMERCIAL';
      if (name.includes('GR86') || name.includes('SUPRA') || name.includes('GR YARIS')) return 'SPORTS';
      return 'LAINNYA';
    }

    function renderTcoItems() {
        const tbody = document.getElementById('tableTco');
        tbody.innerHTML = '';
        if(currentTcoItems.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;">Belum ada item TCO</td></tr>';
            return;
        }
        
        // Sort items by Kategori first, then Model Name
        const sortedItems = [...currentTcoItems].sort((a, b) => {
            const catA = getKategoriModel(a.model_name);
            const catB = getKategoriModel(b.model_name);
            if (catA !== catB) return catA.localeCompare(catB);
            return (a.model_name || '').localeCompare(b.model_name || '');
        });

        let currentCategoryGroup = null;
        sortedItems.forEach(item => {
            const modelName = item.model_name || 'Tanpa Model';
            const kategori = getKategoriModel(modelName);
            const safeId = 'tco-cat-' + kategori.replace(/[^a-zA-Z0-9]/g, '');
            
            if (kategori !== currentCategoryGroup) {
              const trGroup = document.createElement('tr');
              trGroup.innerHTML = `<th colspan="9" class="accordion-header" onclick="toggleDataGroup('${safeId}')">
                <i class="fa-solid fa-chevron-right" id="icon-${safeId}" style="margin-right:6px; color:var(--muted);"></i> Kategori: ${kategori}
              </th>`;
              tbody.appendChild(trGroup);
              currentCategoryGroup = kategori;
            }
        
        const tr = document.createElement('tr');
        tr.className = 'row-' + safeId;
        tr.style.display = 'none';
        
        const isPkg = (item.type && item.type.toLowerCase() === 'package') || 
                      (item.name && (item.name.toLowerCase().includes('package') || item.name.toLowerCase().includes('paket'))) ||
                      (item.part_number && /^[A-Z]{2}(\s*,\s*[A-Z]{2})*$/i.test(item.part_number.trim()));
        const partNo = (item.part_number && !isPkg) ? `<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:11px;">${item.part_number}</code>` : '-';
        const dealerPriceStr = [];
        if (item.price_tpos) dealerPriceStr.push(`<span style="font-size:11px; color:#475569;">TPOS: <strong>${item.price_tpos}</strong></span>`);
        if (item.price_tls) dealerPriceStr.push(`<span style="font-size:11px; color:#475569;">TLS: <strong>${item.price_tls}</strong></span>`);
        const dealerPriceHtml = dealerPriceStr.length > 0 ? dealerPriceStr.join('<br>') : '-';
        const gradeHtml = item.applicable_grade ? `<span style="font-size:11px; color:#334155;">${item.applicable_grade}</span>` : '-';
        const priceDisplay = item.price ? (item.price.startsWith('Rp') || item.price.startsWith('Mulai') || item.price.startsWith('Hubungi') ? item.price : `Rp ${Number(item.price).toLocaleString('id-ID')}`) : '-';

        tr.innerHTML = `
            <td><strong>${modelName}</strong></td>
            <td>${partNo}</td>
            <td><i class="${item.icon}" style="color:#94a3b8; margin-right:8px;"></i> ${item.name}</td>
            <td><span class="badge" style="background:#f1f5f9; color:#475569;">${item.type}</span></td>
            <td><strong style="color:#0f172a;">${priceDisplay}</strong></td>
            <td>${dealerPriceHtml}</td>
            <td>${gradeHtml}</td>
            <td>${item.stock}</td>
            <td>
                <button class="action-btn btn-edit" onclick="editTcoItem(${item.id})"><i class="fa-solid fa-pen"></i></button>
                <button class="action-btn btn-del" onclick="deleteTcoItem(${item.id})"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function openModalTcoModel() {
    document.getElementById('formTcoModel').reset();
    document.getElementById('tco_model_id').value = '';
    document.getElementById('modalTcoModelTitle').textContent = 'Kelola Model TCO';
    loadTcoModels();
    document.getElementById('modalTcoModel').classList.add('show');
}

function editTcoModel(param) {
    const item = typeof param === 'object' ? param : currentTcoModels.find(x => x.id == param);
    if (!item) return;
    document.getElementById('tco_model_id').value = item.id;
    document.getElementById('tco_model_name').value = item.name;
    document.getElementById('tco_model_pdfPage').value = item.pdfPage;
}

function saveTcoModel(e) {
    e.preventDefault();
    const id = document.getElementById('tco_model_id').value;
    const name = document.getElementById('tco_model_name').value;
    const pdfPage = document.getElementById('tco_model_pdfPage').value;
    
    fetch('../api/api_spv_manage_tco.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_model', id, name, pdfPage })
    }).then(r => r.json()).then(res => {
        if(res.status === 'success') {
            document.getElementById('formTcoModel').reset();
            document.getElementById('tco_model_id').value = '';
            loadTcoModels();
        } else {
            alert(res.message);
        }
    });
}

async function deleteTcoModel(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin hapus model ini?') : confirm('Yakin hapus model ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_tco.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_model', id })
    }).then(r => r.json()).then(res => {
        if(res.status === 'success') loadTcoModels();
        else alert(res.message);
    });
}

async function openModalTcoItem() {
    document.getElementById('formTcoItem').reset();
    document.getElementById('tco_item_id').value = '';
    document.getElementById('modalTcoItemTitle').textContent = 'Tambah Item TCO';
    loadTcoModels().then(() => {
        document.getElementById('modalTcoItem').classList.add('show');
    });
}

function editTcoItem(param) {
    const item = typeof param === 'object' ? param : currentTcoItems.find(x => x.id == param);
    if (!item) return;
    document.getElementById('tco_item_id').value = item.id;
    document.getElementById('tco_item_name').value = item.name || '';
    if(document.getElementById('tco_item_part_number')) document.getElementById('tco_item_part_number').value = item.part_number || '';
    document.getElementById('tco_item_type').value = item.type || '';
    document.getElementById('tco_item_price').value = item.price || '';
    if(document.getElementById('tco_item_price_tpos')) document.getElementById('tco_item_price_tpos').value = item.price_tpos || '';
    if(document.getElementById('tco_item_price_tls')) document.getElementById('tco_item_price_tls').value = item.price_tls || '';
    if(document.getElementById('tco_item_applicable_grade')) document.getElementById('tco_item_applicable_grade').value = item.applicable_grade || '';
    document.getElementById('tco_item_stock').value = item.stock || 0;
    document.getElementById('tco_item_icon').value = item.icon || 'fa-solid fa-gem';
    document.getElementById('modalTcoItemTitle').textContent = 'Edit Item TCO';
    
    loadTcoModels().then(() => {
        document.getElementById('tco_item_model_id').value = item.model_id;
        document.getElementById('modalTcoItem').classList.add('show');
    });
}

function saveTcoItem(e) {
    e.preventDefault();
    const id = document.getElementById('tco_item_id').value;
    const model_id = document.getElementById('tco_item_model_id').value;
    const name = document.getElementById('tco_item_name').value;
    const part_number = document.getElementById('tco_item_part_number') ? document.getElementById('tco_item_part_number').value : '';
    const type = document.getElementById('tco_item_type').value;
    const price = document.getElementById('tco_item_price').value;
    const price_tpos = document.getElementById('tco_item_price_tpos') ? document.getElementById('tco_item_price_tpos').value : '';
    const price_tls = document.getElementById('tco_item_price_tls') ? document.getElementById('tco_item_price_tls').value : '';
    const applicable_grade = document.getElementById('tco_item_applicable_grade') ? document.getElementById('tco_item_applicable_grade').value : '';
    const stock = document.getElementById('tco_item_stock').value;
    const icon = document.getElementById('tco_item_icon').value;
    
    fetch('../api/api_spv_manage_tco.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'save_item', id, model_id, name, part_number, type, price, price_tpos, price_tls, applicable_grade, stock, icon })
    }).then(r => r.json()).then(res => {
        if(res.status === 'success') {
            closeModal('modalTcoItem');
            loadTcoItems();
        } else {
            alert(res.message);
        }
    });
}

async function deleteTcoItem(id) {
    const isConfirmed = await (window.customConfirm ? window.customConfirm('Yakin hapus item ini?') : confirm('Yakin hapus item ini?'));
    if (!isConfirmed) return;
    fetch('../api/api_spv_manage_tco.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_item', id })
    }).then(r => r.json()).then(res => {
        if(res.status === 'success') loadTcoItems();
        else alert(res.message);
    });
}

// ==========================================
// SEARCH / FILTER TABLE LOGIC
// ==========================================
window.filterTable = async function(input) {
    const filter = input.value.toLowerCase();
    const targetId = input.getAttribute('data-target');
    const tbody = document.getElementById(targetId);
    if(!tbody) return;
    
    const rows = tbody.getElementsByTagName('tr');
    let currentHeader = null;
    let matchCount = 0;
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip empty state row
        if(row.cells.length === 1 && row.cells[0].colSpan > 3) continue;
        
        // If it's an accordion header
        if (row.querySelector('th.accordion-header')) {
            if(currentHeader && filter !== '') {
                currentHeader.style.display = (matchCount > 0) ? 'table-row' : 'none';
                const icon = currentHeader.querySelector('i.fa-chevron-right');
                if(icon) icon.style.transform = (matchCount > 0) ? 'rotate(90deg)' : 'rotate(0deg)';
            }
            currentHeader = row;
            matchCount = 0;
            if(filter === '') {
                row.style.display = 'table-row';
                // Reset icon rotation
                const icon = row.querySelector('i.fa-chevron-right');
                if(icon) icon.style.transform = 'rotate(0deg)';
            }
            continue;
        }
        
        // Data row
        const isAccordionRow = row.className.includes('row-');
        
        if (filter === '') {
            row.style.display = isAccordionRow ? 'none' : 'table-row';
        } else {
            const text = row.textContent.toLowerCase();
            if (text.includes(filter)) {
                row.style.display = 'table-row';
                matchCount++;
            } else {
                row.style.display = 'none';
            }
        }
    }
    
    if (currentHeader && filter !== '') {
        currentHeader.style.display = (matchCount > 0) ? 'table-row' : 'none';
        const icon = currentHeader.querySelector('i.fa-chevron-right');
        if(icon && matchCount > 0) icon.style.transform = 'rotate(90deg)';
    }
};

// ==========================================
// BULK IMPORT EXCEL
// ==========================================
window.openModalImport = function(type) {
    document.getElementById('importType').value = type;
    document.getElementById('importData').value = '';
    document.getElementById('importOverwrite').checked = false;
    
    let guide = '';
    if (type === 'pricelist') {
        guide = 'Format Kolom: Model | Tipe | Harga MT | Harga AT | (Opsional: Kategori)';
    } else if (type === 'polreg') {
        guide = 'Format Kolom: Kecamatan | Tahun | Merk | Tipe';
    }
    document.getElementById('importFormatGuide').textContent = guide;
    
    document.getElementById('modalImport').classList.add('show');
}

window.processImportExcel = async function() {
    const type = document.getElementById('importType').value;
    const rawData = document.getElementById('importData').value.trim();
    const overwrite = document.getElementById('importOverwrite').checked;
    
    if (!rawData) {
        alert('Silakan paste data Excel terlebih dahulu!');
        return;
    }
    
    const rows = rawData.split('\n');
    let parsedData = [];
    
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i].trim();
        if (!row) continue;
        
        const cols = row.split('\t');
        
        if (type === 'pricelist') {
            if (cols.length < 4) continue;
            parsedData.push({
                model: cols[0].trim(),
                tipe: cols[1].trim(),
                harga_mt: parseInt((cols[2] || '0').replace(/[^0-9]/g, '')),
                harga_at: parseInt((cols[3] || '0').replace(/[^0-9]/g, '')),
                kategori: (cols[4] || '').trim()
            });
        } else if (type === 'polreg') {
            if (cols.length < 4) continue;
            parsedData.push({
                kecamatan: cols[0].trim(),
                tahun: cols[1].trim(),
                merk: cols[2].trim(),
                type: cols[3].trim()
            });
        }
    }
    
    if (parsedData.length === 0) {
        alert('Gagal membaca data. Pastikan format kolom sesuai dengan panduan.');
        return;
    }
    
    const isConfirmed = await (window.customConfirm ? window.customConfirm(`Berhasil membaca ${parsedData.length} baris data. Lanjutkan proses import?`) : confirm(`Berhasil membaca ${parsedData.length} baris data. Lanjutkan proses import?`));
    if (!isConfirmed) return;
    
    const btn = document.getElementById('btnProcessImport');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses...';
    btn.disabled = true;
    
    fetch('../api/api_spv_bulk_import.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            type: type,
            overwrite: overwrite,
            data: parsedData
        })
    }).then(r => r.json()).then(res => {
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Mulai Import';
        btn.disabled = false;
        
        if (res.status === 'success') {
            closeModal('modalImport');
            alert(`Import berhasil! ${res.count} data tersimpan.`);
            if (type === 'pricelist') loadPricelist();
            else if (type === 'polreg') loadPolreg();
        } else {
            alert('Error: ' + res.message);
        }
    }).catch(err => {
        btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Mulai Import';
        btn.disabled = false;
        alert('Terjadi kesalahan koneksi server.');
    });
}

// ==========================================
// BIAYA IKLAN & MARKETING CAMPAIGN ROI
// ==========================================
let biayaIklanData = [];
let currentSelectedSpv = 'ALL';
let allSpvList = [];
let spvBreakdownData = [];

let isBiayaIklanSpreadsheetMode = false;
let biayaIklanSyncInterval = null;

async function loadBiayaIklan(silent = false) {
    const tableBody = document.getElementById('tableBiayaIklan');
    if (tableBody && !silent && (!biayaIklanData || biayaIklanData.length === 0)) {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:20px; color:#64748b;"><i class="fa-solid fa-spinner fa-spin"></i> Memuat data biaya iklan...</td></tr>`;
    }

    try {
        const url = `../api/api_spv_biaya_iklan.php?spv=${encodeURIComponent(currentSelectedSpv)}`;
        const res = await fetch(url);
        const json = await res.json();

        if (json.status === 'success') {
            biayaIklanData = json.data || [];
            allSpvList = json.spv_list || [];
            spvBreakdownData = json.spv_breakdown || [];

            renderSpvFilterPills(allSpvList, currentSelectedSpv);
            renderSpvBreakdownCards(spvBreakdownData);
            renderBiayaIklanMetrics(json.metrics || {});
            renderBiayaIklanTable(biayaIklanData);
        } else {
            if (tableBody && !silent) tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#c8102e;">Gagal memuat data</td></tr>`;
        }
    } catch (err) {
        console.error(err);
        if (tableBody && !silent) tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; color:#c8102e;">Gagal memuat data biaya iklan</td></tr>`;
    }
}

function filterBiayaIklanBySpv(spvName, btnElem) {
    currentSelectedSpv = spvName;
    document.querySelectorAll('.btn-spv-pill').forEach(b => {
        b.classList.remove('active');
        b.style.background = '#f1f5f9';
        b.style.color = '#475569';
    });

    if (btnElem) {
        btnElem.classList.add('active');
        btnElem.style.background = '#0d1b3e';
        btnElem.style.color = '#ffffff';
    }

    loadBiayaIklan(false);
}

function renderSpvFilterPills(spvList, activeSpv) {
    const container = document.getElementById('spvFilterButtonGroup');
    if (!container) return;

    let html = `
        <button class="btn-spv-pill ${activeSpv === 'ALL' ? 'active' : ''}" onclick="filterBiayaIklanBySpv('ALL', this)" style="font-size:11.5px; font-weight:800; border-radius:20px; padding:6px 14px; background:${activeSpv === 'ALL' ? '#0d1b3e' : '#f1f5f9'}; color:${activeSpv === 'ALL' ? '#ffffff' : '#475569'}; border:1px solid #cbd5e1; cursor:pointer; transition:all 0.2s;">
            <i class="fa-solid fa-layer-group"></i> Semua Tim (Total)
        </button>
    `;

    spvList.forEach(spv => {
        const isActive = activeSpv === spv;
        html += `
            <button class="btn-spv-pill ${isActive ? 'active' : ''}" onclick="filterBiayaIklanBySpv('${escapeHtmlSpv(spv)}', this)" style="font-size:11.5px; font-weight:800; border-radius:20px; padding:6px 14px; background:${isActive ? '#0d1b3e' : '#f1f5f9'}; color:${isActive ? '#ffffff' : '#475569'}; border:1px solid #cbd5e1; cursor:pointer; transition:all 0.2s;">
                <i class="fa-solid fa-user-tie"></i> Tim ${escapeHtmlSpv(spv)}
            </button>
        `;
    });

    container.innerHTML = html;
}

function renderSpvBreakdownCards(breakdown) {
    const container = document.getElementById('containerSpvBreakdown');
    if (!container) return;

    if (!breakdown || breakdown.length === 0) {
        container.innerHTML = '';
        return;
    }

    let html = '';
    breakdown.forEach((b, idx) => {
        const isSelected = currentSelectedSpv === b.nama_spv;
        html += `
            <div onclick="selectSpvCard('${escapeHtmlSpv(b.nama_spv)}')" style="background:${isSelected ? '#eff6ff' : '#ffffff'}; border:${isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0'}; border-radius:14px; padding:14px 16px; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="background:${idx === 0 ? '#fee2e2' : '#dbeafe'}; color:${idx === 0 ? '#b91c1c' : '#1d4ed8'}; font-size:10.5px; font-weight:800; padding:2px 8px; border-radius:6px; text-transform:uppercase;">
                            Tim ${escapeHtmlSpv(b.nama_spv)}
                        </span>
                        ${isSelected ? '<span style="font-size:10px; color:#2563eb; font-weight:800;">(Aktif)</span>' : ''}
                    </div>
                    <span style="font-size:11px; font-weight:700; color:#64748b;">${b.campaign_count} Iklan</span>
                </div>

                <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                    <div>
                        <div style="font-size:10.5px; color:#64748b; font-weight:700; text-transform:uppercase;">Total Biaya Tim</div>
                        <div style="font-size:17px; font-weight:900; color:#0f172a;">${formatRupiahSpv(b.total_biaya)}</div>
                    </div>
                    <div style="text-align:right;">
                        <div style="font-size:12px; font-weight:800; color:#2563eb;">${b.total_lead} Leads &bull; ${b.total_spk} SPK</div>
                        <div style="font-size:10.5px; color:#059669; font-weight:700;">CPL: ${formatRupiahSpv(b.cpl)}</div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectSpvCard(spvName) {
    if (currentSelectedSpv === spvName) {
        currentSelectedSpv = 'ALL';
    } else {
        currentSelectedSpv = spvName;
    }
    loadBiayaIklan(false);
}

function filterBiayaIklanSearch(query) {
    query = query.toLowerCase().trim();
    if (!query) {
        renderBiayaIklanTable(biayaIklanData);
        return;
    }

    const filtered = biayaIklanData.filter(item => {
        return (item.nama_sales && item.nama_sales.toLowerCase().includes(query)) ||
               (item.nama_spv && item.nama_spv.toLowerCase().includes(query)) ||
               (item.iklan_di && item.iklan_di.toLowerCase().includes(query)) ||
               (item.keterangan && item.keterangan.toLowerCase().includes(query));
    });

    renderBiayaIklanTable(filtered);
}

function toggleBiayaIklanViewMode() {
    isBiayaIklanSpreadsheetMode = !isBiayaIklanSpreadsheetMode;
    const btn = document.getElementById('btnToggleSpreadsheet');
    if (btn) {
        if (isBiayaIklanSpreadsheetMode) {
            btn.innerHTML = `<i class="fa-solid fa-table-list"></i> Mode Tabel Standard`;
            btn.style.background = '#0284c7';
        } else {
            btn.innerHTML = `<i class="fa-solid fa-table-cells"></i> Mode Spreadsheet (Live Edit)`;
            btn.style.background = '#16a34a';
        }
    }
    renderBiayaIklanTable(biayaIklanData);
}

function toggleEmbeddedGoogleSheetView() {
    const container = document.getElementById('containerEmbeddedSheet');
    const btn = document.getElementById('btnToggleIframeSheet');
    if (container) {
        const isHidden = container.style.display === 'none';
        container.style.display = isHidden ? 'block' : 'none';
        if (btn) {
            btn.innerHTML = isHidden ? `<i class="fa-solid fa-eye-slash"></i> Sembunyikan Sheet` : `<i class="fa-solid fa-file-contract"></i> Tampilkan Sheet Interaktif`;
            btn.style.background = isHidden ? '#e11d48' : '#0284c7';
        }
    }
}

function refreshEmbeddedSheetIframe() {
    const iframe = document.getElementById('iframeGoogleSheet');
    if (iframe) {
        const currentSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => { iframe.src = currentSrc; }, 100);
    }
}

function autoCalcTotal1Bulan() {
    const budgetInput = document.getElementById('biaya_budget_perhari');
    const totalInput = document.getElementById('biaya_total_1bulan');
    if (budgetInput && totalInput) {
        const val = parseFloat(budgetInput.value) || 0;
        if (val > 0) {
            totalInput.value = val * 30;
        }
    }
}

function calculateBiayaIklanMetricsLive() {
    let totalBiaya = 0;
    let totalLeads = 0;
    let totalSpk = 0;

    biayaIklanData.forEach(item => {
        totalBiaya += parseFloat(item.total_biaya_1bulan || item.biaya || 0);
        totalLeads += parseInt(item.jumlah_lead || 0);
        totalSpk += parseInt(item.jumlah_spk || 0);
    });

    const cpl = totalLeads > 0 ? Math.round(totalBiaya / totalLeads) : 0;
    const cps = totalSpk > 0 ? Math.round(totalBiaya / totalSpk) : 0;

    renderBiayaIklanMetrics({
        total_biaya: totalBiaya,
        total_lead: totalLeads,
        total_spk: totalSpk,
        cpl,
        cps
    });
}

function renderBiayaIklanMetrics(metrics) {
    const totalBiayaEl = document.getElementById('kpiBiayaTotal');
    const totalLeadsEl = document.getElementById('kpiBiayaLeads');
    const cplEl = document.getElementById('kpiBiayaCPL');
    const cpsEl = document.getElementById('kpiBiayaCPS');

    if (totalBiayaEl) totalBiayaEl.textContent = formatRupiahSpv(metrics.total_biaya || 0);
    if (totalLeadsEl) totalLeadsEl.textContent = (metrics.total_lead || 0) + ' Lead';
    if (cplEl) cplEl.textContent = formatRupiahSpv(metrics.cpl || 0);
    if (cpsEl) cpsEl.textContent = formatRupiahSpv(metrics.cps || 0);
}

function renderBiayaIklanTable(data) {
    const tableBody = document.getElementById('tableBiayaIklan');
    if (!tableBody) return;

    if (data.length === 0 && !isBiayaIklanSpreadsheetMode) {
        tableBody.innerHTML = `<tr><td colspan="10" style="text-align:center; padding:30px; color:#64748b;">Belum ada data biaya iklan. Klik "Input Biaya Iklan" atau "Mode Spreadsheet" untuk menambah data.</td></tr>`;
        return;
    }

    let html = '';

    if (isBiayaIklanSpreadsheetMode) {
        // Render Interactive Spreadsheet Grid View
        data.forEach(item => {
            html += `
            <tr style="background:#f8fafc;">
                <td style="padding:4px;"><input type="text" class="form-input" style="font-size:12px; font-weight:700; padding:4px 6px; border:1px solid #cbd5e1;" value="${escapeHtmlSpv(item.nama_sales || 'Semua Tim')}" onblur="updateBiayaIklanCell(${item.id}, 'nama_sales', this.value)"></td>
                <td style="padding:4px;"><input type="text" class="form-input" style="font-size:12px; font-weight:600; padding:4px 6px; border:1px solid #cbd5e1;" value="${escapeHtmlSpv(item.nama_spv || 'Pak Ryan')}" onblur="updateBiayaIklanCell(${item.id}, 'nama_spv', this.value)"></td>
                <td style="padding:4px;">
                    <select class="form-input" style="font-size:12px; font-weight:700; padding:4px 6px; border:1px solid #cbd5e1;" onchange="updateBiayaIklanCell(${item.id}, 'iklan_di', this.value)">
                        <option value="Google Ads" ${item.iklan_di === 'Google Ads' ? 'selected' : ''}>Google Ads</option>
                        <option value="Meta Ads (FB/IG)" ${item.iklan_di === 'Meta Ads (FB/IG)' ? 'selected' : ''}>Meta Ads (FB/IG)</option>
                        <option value="TikTok Ads" ${item.iklan_di === 'TikTok Ads' ? 'selected' : ''}>TikTok Ads</option>
                        <option value="OLX / Marketplace" ${item.iklan_di === 'OLX / Marketplace' ? 'selected' : ''}>OLX / Marketplace</option>
                        <option value="Event / Pameran" ${item.iklan_di === 'Event / Pameran' ? 'selected' : ''}>Event / Pameran</option>
                        <option value="Flyering & Kanvasing" ${item.iklan_di === 'Flyering & Kanvasing' ? 'selected' : ''}>Flyering & Kanvasing</option>
                        <option value="Brosur & Spanduk" ${item.iklan_di === 'Brosur & Spanduk' ? 'selected' : ''}>Brosur & Spanduk</option>
                    </select>
                </td>
                <td style="padding:4px;"><input type="number" class="form-input" style="font-size:12px; font-weight:700; color:#0284c7; padding:4px 6px; border:1px solid #cbd5e1;" value="${item.budget_perhari || 0}" onblur="updateBiayaIklanCell(${item.id}, 'budget_perhari', this.value)"></td>
                <td style="padding:4px;"><input type="date" class="form-input" style="font-size:12px; padding:4px 6px; border:1px solid #cbd5e1;" value="${item.tanggal_iklan || ''}" onchange="updateBiayaIklanCell(${item.id}, 'tanggal_iklan', this.value)"></td>
                <td style="padding:4px;"><input type="date" class="form-input" style="font-size:12px; padding:4px 6px; border:1px solid #cbd5e1;" value="${item.berakhir_iklan || ''}" onchange="updateBiayaIklanCell(${item.id}, 'berakhir_iklan', this.value)"></td>
                <td style="padding:4px;"><input type="number" class="form-input" style="font-size:12px; font-weight:800; color:#c8102e; padding:4px 6px; border:1px solid #cbd5e1;" value="${item.total_biaya_1bulan || item.biaya || 0}" onblur="updateBiayaIklanCell(${item.id}, 'total_biaya_1bulan', this.value)"></td>
                <td style="padding:4px; white-space:nowrap;">
                    <input type="number" class="form-input" style="font-size:12px; font-weight:700; width:50px; display:inline-block; padding:4px 6px; border:1px solid #10b981;" value="${item.jumlah_lead || 0}" title="Leads" onblur="updateBiayaIklanCell(${item.id}, 'jumlah_lead', this.value)">
                    <input type="number" class="form-input" style="font-size:12px; font-weight:700; width:50px; display:inline-block; padding:4px 6px; border:1px solid #f59e0b; margin-left:2px;" value="${item.jumlah_spk || 0}" title="SPK" onblur="updateBiayaIklanCell(${item.id}, 'jumlah_spk', this.value)">
                </td>
                <td style="padding:4px;"><input type="text" class="form-input" style="font-size:12px; padding:4px 6px; border:1px solid #cbd5e1;" value="${escapeHtmlSpv(item.keterangan || '')}" onblur="updateBiayaIklanCell(${item.id}, 'keterangan', this.value)"></td>
                <td style="text-align:center; padding:4px;">
                    <button class="btn btn-sm" style="background:#ffe4e6; color:#e11d48; border:none; border-radius:6px; padding:4px 8px; cursor:pointer;" onclick="deleteBiayaIklan(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
            `;
        });

        html += `
        <tr>
            <td colspan="10" style="padding:10px; text-align:center; background:#f1f5f9;">
                <button class="btn" style="background:#16a34a; color:white; font-weight:700; font-size:12px; padding:6px 16px;" onclick="addBlankBiayaIklanRow()">
                    <i class="fa-solid fa-plus"></i> Tambah Baris Spreadsheet Baru
                </button>
            </td>
        </tr>
        `;
    } else {
        // Standard Table View
        data.forEach(item => {
            const budgetHariRp = formatRupiahSpv(item.budget_perhari || 0);
            const totalBiayaRp = formatRupiahSpv(item.total_biaya_1bulan || item.biaya || 0);
            html += `
            <tr>
                <td style="font-weight:700; color:#0f172a;"><i class="fa-solid fa-user-tie" style="color:#94a3b8; margin-right:4px;"></i>${escapeHtmlSpv(item.nama_sales || 'Semua Tim')}</td>
                <td style="font-weight:600; color:#475569;">${escapeHtmlSpv(item.nama_spv || 'Pak Ryan')}</td>
                <td><span class="chip-tag" style="background:#eff6ff; color:#1d4ed8; font-weight:700; border:1px solid #bfdbfe;">${escapeHtmlSpv(item.iklan_di || '-')}</span></td>
                <td style="font-weight:700; color:#0284c7;">${budgetHariRp} /hr</td>
                <td style="font-size:12px; color:#334155; white-space:nowrap;">${escapeHtmlSpv(item.tanggal_iklan || '-')}</td>
                <td style="font-size:12px; color:#334155; white-space:nowrap;">${escapeHtmlSpv(item.berakhir_iklan || '-')}</td>
                <td style="font-weight:800; color:#c8102e;">${totalBiayaRp}</td>
                <td>
                    <span style="background:#d1fae5; color:#047857; padding:2px 8px; border-radius:6px; font-weight:700; font-size:11px;">${item.jumlah_lead || 0} Lead</span>
                    <span style="background:#fef3c7; color:#b45309; padding:2px 8px; border-radius:6px; font-weight:700; font-size:11px; margin-left:4px;">${item.jumlah_spk || 0} SPK</span>
                </td>
                <td style="font-size:12px; color:#64748b;">${escapeHtmlSpv(item.keterangan || '-')}</td>
                <td style="text-align:center;">
                    <button class="btn btn-sm" style="background:#ffe4e6; color:#e11d48; border:none; border-radius:6px; padding:4px 8px; cursor:pointer;" onclick="deleteBiayaIklan(${item.id})">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </td>
            </tr>
            `;
        });
    }

    tableBody.innerHTML = html;
}

async function updateBiayaIklanCell(id, field, value) {
    const item = biayaIklanData.find(x => x.id == id);
    if (item) {
        item[field] = value;
        if (field === 'budget_perhari' && (!item.total_biaya_1bulan || item.total_biaya_1bulan <= 0)) {
            item.total_biaya_1bulan = parseFloat(value) * 30;
        }
        calculateBiayaIklanMetricsLive();
    }

    try {
        const res = await fetch('../api/api_spv_biaya_iklan.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'update_single',
                id,
                field,
                value
            })
        });
        const json = await res.json();
        if (json.status !== 'success') {
            console.error('Cell update failed:', json.message);
        }
    } catch (err) {
        console.error('Network error during cell update:', err);
    }
}

async function addBlankBiayaIklanRow() {
    const payload = {
        nama_sales: 'Semua Tim',
        nama_spv: 'Pak Ryan',
        iklan_di: 'Google Ads',
        budget_perhari: 50000,
        tanggal_iklan: new Date().toISOString().split('T')[0],
        berakhir_iklan: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
        total_biaya_1bulan: 1500000,
        jumlah_lead: 0,
        jumlah_spk: 0,
        keterangan: 'Baris Spreadsheet Baru'
    };

    try {
        const res = await fetch('../api/api_spv_biaya_iklan.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (json.status === 'success') {
            loadBiayaIklan();
        } else {
            alert('Gagal menambah baris: ' + json.message);
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi.');
    }
}

function openModalGoogleSheetsSync() {
    const modal = document.getElementById('modalGoogleSheetsSync');
    if (modal) modal.style.display = 'flex';
}

async function processSpreadsheetSync() {
    const pasteData = document.getElementById('pasteSpreadsheetData').value.trim();
    const csvUrl = document.getElementById('urlGoogleSheetsCsv').value.trim();

    let rowsToSync = [];

    if (csvUrl) {
        try {
            const res = await fetch(csvUrl);
            const text = await res.text();
            const lines = text.split('\n');
            lines.forEach((line, idx) => {
                if (idx === 0 && line.toLowerCase().includes('nama sales')) return;
                const cols = line.split(',');
                if (cols.length >= 4) {
                    rowsToSync.push({
                        nama_sales: cols[0] ? cols[0].replace(/"/g, '').trim() : 'Semua Tim',
                        nama_spv: cols[1] ? cols[1].replace(/"/g, '').trim() : 'Pak Ryan',
                        iklan_di: cols[2] ? cols[2].replace(/"/g, '').trim() : 'Google Ads',
                        budget_perhari: cols[3] ? parseFloat(cols[3].replace(/[^0-9.]/g, '')) || 0 : 0,
                        tanggal_iklan: cols[4] ? cols[4].replace(/"/g, '').trim() : new Date().toISOString().split('T')[0],
                        berakhir_iklan: cols[5] ? cols[5].replace(/"/g, '').trim() : new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                        total_biaya_1bulan: cols[6] ? parseFloat(cols[6].replace(/[^0-9.]/g, '')) || 0 : 0,
                        jumlah_lead: cols[7] ? parseInt(cols[7]) || 0 : 0,
                        jumlah_spk: cols[8] ? parseInt(cols[8]) || 0 : 0,
                        keterangan: cols[9] ? cols[9].replace(/"/g, '').trim() : ''
                    });
                }
            });
        } catch (e) {
            alert('Gagal mengambil data CSV Google Sheets. Pastikan URL dipublikasikan untuk umum!');
            return;
        }
    } else if (pasteData) {
        const lines = pasteData.split('\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            const cols = line.split('\t').length > 1 ? line.split('\t') : line.split(',');
            if (cols.length >= 3) {
                rowsToSync.push({
                    nama_sales: cols[0] ? cols[0].trim() : 'Semua Tim',
                    nama_spv: cols[1] ? cols[1].trim() : 'Pak Ryan',
                    iklan_di: cols[2] ? cols[2].trim() : 'Google Ads',
                    budget_perhari: cols[3] ? parseFloat(cols[3].replace(/[^0-9.]/g, '')) || 0 : 0,
                    tanggal_iklan: cols[4] ? cols[4].trim() : new Date().toISOString().split('T')[0],
                    berakhir_iklan: cols[5] ? cols[5].trim() : new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0],
                    total_biaya_1bulan: cols[6] ? parseFloat(cols[6].replace(/[^0-9.]/g, '')) || 0 : 0,
                    jumlah_lead: cols[7] ? parseInt(cols[7]) || 0 : 0,
                    jumlah_spk: cols[8] ? parseInt(cols[8]) || 0 : 0,
                    keterangan: cols[9] ? cols[9].trim() : ''
                });
            }
        });
    } else {
        alert('Mohon masukkan data tempel dari Spreadsheet atau URL CSV Google Sheets!');
        return;
    }

    if (rowsToSync.length === 0) {
        alert('Tidak ada baris data valid yang terdeteksi.');
        return;
    }

    try {
        const res = await fetch('../api/api_spv_biaya_iklan.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'bulk_sync',
                rows: rowsToSync
            })
        });
        const json = await res.json();
        if (json.status === 'success') {
            alert(json.message);
            closeModal('modalGoogleSheetsSync');
            document.getElementById('pasteSpreadsheetData').value = '';
            document.getElementById('urlGoogleSheetsCsv').value = '';
            loadBiayaIklan();
        } else {
            alert('Gagal menyinkronkan data: ' + json.message);
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi.');
    }
}

function openModalBiayaIklan() {
    const modal = document.getElementById('modalBiayaIklan');
    const startInput = document.getElementById('biaya_tanggal_mulai');
    const endInput = document.getElementById('biaya_tanggal_akhir');
    if (startInput && !startInput.value) {
        startInput.value = new Date().toISOString().split('T')[0];
    }
    if (endInput && !endInput.value) {
        endInput.value = new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0];
    }
    if (modal) modal.style.display = 'flex';
}

async function saveBiayaIklan(e) {
    if (e) e.preventDefault();

    const nama_sales = document.getElementById('biaya_sales').value.trim() || 'Semua Tim';
    const nama_spv = document.getElementById('biaya_spv').value.trim() || 'Pak Ryan';
    const iklan_di = document.getElementById('biaya_iklan_di').value;
    const budget_perhari = document.getElementById('biaya_budget_perhari').value || 0;
    const tanggal_iklan = document.getElementById('biaya_tanggal_mulai').value;
    const berakhir_iklan = document.getElementById('biaya_tanggal_akhir').value;
    const total_biaya_1bulan = document.getElementById('biaya_total_1bulan').value || (budget_perhari * 30);
    const jumlah_lead = document.getElementById('biaya_leads').value || 0;
    const jumlah_spk = document.getElementById('biaya_spk').value || 0;
    const keterangan = document.getElementById('biaya_keterangan').value.trim();

    if (!nama_sales || !iklan_di) {
        alert('Mohon lengkapi Nama Sales dan Platform Iklan!');
        return;
    }

    const payload = {
        nama_sales,
        nama_spv,
        iklan_di,
        budget_perhari,
        tanggal_iklan,
        berakhir_iklan,
        total_biaya_1bulan,
        jumlah_lead,
        jumlah_spk,
        keterangan
    };

    try {
        const res = await fetch('../api/api_spv_biaya_iklan.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const json = await res.json();

        if (json.status === 'success') {
            alert('Catatan biaya iklan berhasil disimpan!');
            closeModal('modalBiayaIklan');
            document.getElementById('formBiayaIklan').reset();
            loadBiayaIklan();
        } else {
            alert('Gagal menyimpan: ' + json.message);
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan jaringan.');
    }
}

async function deleteBiayaIklan(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan biaya iklan ini?')) return;

    try {
        const res = await fetch(`../api/api_spv_biaya_iklan.php?id=${id}`, { method: 'DELETE' });
        const json = await res.json();
        if (json.status === 'success') {
            loadBiayaIklan();
        } else {
            alert('Gagal menghapus: ' + json.message);
        }
    } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan jaringan.');
    }
}

function formatRupiahSpv(num) {
    return 'Rp ' + Number(num).toLocaleString('id-ID');
}

function escapeHtmlSpv(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
