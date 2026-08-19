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
                <button class="btn btn-sm btn-primary" style="padding:6px 10px;" onclick='editLeasing(${JSON.stringify(item)})'><i class="fa-solid fa-pen"></i></button>
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

function editLeasing(item) {
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
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data provinsi</td></tr>';
        return;
    }
    currentProvinsiData.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.nama_provinsi}</td>
            <td>${item.suku_bunga}%</td>
            <td>
                <span style="padding:4px 8px; border-radius:4px; font-size:12px; font-weight:bold; background:${item.status === 'Aktif' ? '#dcfce7' : '#fee2e2'}; color:${item.status === 'Aktif' ? '#166534' : '#991b1b'};">
                    ${item.status}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary" style="padding:6px 10px;" onclick='editProvinsi(${JSON.stringify(item)})'><i class="fa-solid fa-pen"></i></button>
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

function editProvinsi(item) {
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
});
