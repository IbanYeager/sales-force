document.addEventListener('DOMContentLoaded', () => {
    initSalesUser();
    setDefaultDateTime();
    fetchRentalData();
});

let globalPartnerData = [];

function initSalesUser() {
    const namaSales = localStorage.getItem('namaSales') || 'Muhammad Iban Fathul Bahri';
    const inputSales = document.getElementById('salesName');
    if (inputSales) inputSales.value = namaSales;
}

function setDefaultDateTime() {
    const dtInput = document.getElementById('tanggalTestdrive');
    if (!dtInput) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const isoStr = tomorrow.toISOString().slice(0, 16);
    dtInput.value = isoStr;
}

function switchRentalTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');

    if (tabName === 'fleet') {
        document.getElementById('tabFleet').classList.add('active');
        document.getElementById('viewFleet').style.display = 'block';
    } else if (tabName === 'form') {
        document.getElementById('tabForm').classList.add('active');
        document.getElementById('viewForm').style.display = 'block';
    } else if (tabName === 'history') {
        document.getElementById('tabHistory').classList.add('active');
        document.getElementById('viewHistory').style.display = 'block';
    }
}

async function fetchRentalData() {
    const salesId = localStorage.getItem('idSales') || 7;
    try {
        const response = await fetch(`../api/api_rental_testdrive.php?sales_id=${salesId}`);
        const res = await response.json();

        if (res.status === 'success') {
            globalPartnerData = res.partners || [];
            renderPartnerFleet(res.partners);
            renderBookingHistory(res.bookings);

            const countEl = document.getElementById('historyCount');
            if (countEl) countEl.innerText = (res.bookings || []).length;
        }
    } catch (err) {
        console.error("Gagal mengambil data rental test drive:", err);
    }
}

function renderPartnerFleet(partners) {
    const container = document.getElementById('partnerFleetContainer');
    if (!container) return;

    if (!partners || partners.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#64748b;">Belum ada mitra rental terdaftar.</p>';
        return;
    }

    container.innerHTML = partners.map(p => `
        <div class="partner-card">
            <div class="partner-header">
                <div>
                    <div class="partner-title"><i class="fa-solid fa-building" style="color:var(--primary-red);"></i> ${p.name}</div>
                </div>
                <span class="partner-badge"><i class="fa-solid fa-shield-check"></i> ${p.badge}</span>
            </div>

            <div class="fleet-grid">
                ${p.fleet_available.map(f => `
                    <div class="fleet-item">
                        <div>
                            <div style="display:flex; justify-content:space-between; align-items:center;">
                                <div class="fleet-model">${f.model}</div>
                                <span style="font-size:11px; font-weight:800; color:white; background:var(--primary-red); padding:3px 8px; border-radius:6px; box-shadow:0 2px 6px rgba(215, 18, 58, 0.3);">${f.rate || 'Pricelist 24 Jam'}</span>
                            </div>
                            <div class="fleet-meta" style="margin-top:4px;">
                                <span><i class="fa-solid fa-car"></i> ${f.type}</span>
                                <span><i class="fa-solid fa-gears"></i> ${f.transmission}</span>
                            </div>
                            <div class="fleet-meta" style="margin-top:6px;">
                                <span class="fleet-plat">${f.plat}</span>
                                <span style="color:#059669; font-weight:800;"><i class="fa-solid fa-circle-check"></i> ${f.status}</span>
                            </div>
                        </div>
                        <button type="button" onclick="selectFleetForBooking('${escapeQuotes(p.name)}', '${escapeQuotes(f.model)}')" style="width:100%; padding:8px; background:rgba(215, 18, 58, 0.08); color:var(--primary-red); border:1px solid rgba(215, 18, 58, 0.2); border-radius:8px; font-size:12px; font-weight:800; cursor:pointer; transition:all 0.25s ease;">
                            <i class="fa-solid fa-calendar-plus"></i> Pesan Unit Ini
                        </button>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectFleetForBooking(partnerName, modelName) {
    const selectMitra = document.getElementById('selectMitraRental');
    const selectModel = document.getElementById('selectModelUnit');

    if (selectMitra) {
        for (let i = 0; i < selectMitra.options.length; i++) {
            if (selectMitra.options[i].value === partnerName) {
                selectMitra.selectedIndex = i;
                break;
            }
        }
    }

    if (selectModel) {
        for (let i = 0; i < selectModel.options.length; i++) {
            if (selectModel.options[i].value === modelName) {
                selectModel.selectedIndex = i;
                break;
            }
        }
    }

    switchRentalTab('form');
    showCustomAlert('Unit Dipilih!', `Anda memilih ${modelName} dari ${partnerName}. Silakan lengkapi data pengajuan konsumen.`, 'info');
}

function updateModelOptionsByPartner() {
    // Dynamic updates if needed
}

function renderBookingHistory(bookings) {
    const container = document.getElementById('historyBookingContainer');
    if (!container) return;

    if (!bookings || bookings.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:30px; color:#64748b; font-size:13px; background:white; border-radius:16px; border:1px dashed #cbd5e1;">Belum ada riwayat pengajuan unit test drive rekanan.</p>';
        return;
    }

    container.innerHTML = bookings.map(b => {
        let badgeClass = 'menunggu';
        let iconClass = 'fa-clock';
        if (b.status === 'Disetujui Rekanan') {
            badgeClass = 'disetujui'; iconClass = 'fa-circle-check';
        } else if (b.status === 'Dalam Penggunaan') {
            badgeClass = 'penggunaan'; iconClass = 'fa-car';
        }

        const waMsg = `🚗 *KONFIRMASI TEST DRIVE REKANAN RENTAL* 📋\n`
                    .concat(`Hallo Tim ${b.mitra_rental},\n`)
                    .concat(`Mohon follow up pengajuan Test Drive unit *${b.model_unit}* (${b.plat_nomor}) untuk konsumen *${b.nama_customer}* pada tanggal *${b.tanggal_testdrive}*.\n`)
                    .concat(`Lokasi: ${b.lokasi_penjemputan}.\nTerima kasih!`);

        return `
            <div class="history-card">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:10px;">
                    <div>
                        <div style="font-size:15px; font-weight:800; color:#0f172a;">${b.model_unit}</div>
                        <div style="font-size:11.5px; color:#64748b; font-weight:700; margin-top:2px;">
                            <i class="fa-solid fa-building"></i> ${b.mitra_rental} &bull; <span style="font-family:monospace; background:#e2e8f0; padding:1px 5px; border-radius:4px;">${b.plat_nomor || '-'}</span>
                        </div>
                    </div>
                    <span class="status-badge ${badgeClass}"><i class="fa-solid ${iconClass}"></i> ${b.status}</span>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; background:#f8fafc; padding:10px 14px; border-radius:10px; border:1px solid #e2e8f0; font-size:12px; margin-bottom:12px;">
                    <div>
                        <span style="color:#64748b; font-size:10.5px; font-weight:700; display:block;">KONSUMEN</span>
                        <strong style="color:#0f172a;">${b.nama_customer}</strong> (${b.no_hp_customer})
                    </div>
                    <div>
                        <span style="color:#64748b; font-size:10.5px; font-weight:700; display:block;">DURASI & JADWAL</span>
                        <strong style="color:#2563eb;">${b.durasi}</strong> &bull; ${formatDateTime(b.tanggal_testdrive)}
                    </div>
                </div>

                <div style="font-size:11.5px; color:#475569; margin-bottom:12px;">
                    <i class="fa-solid fa-location-dot" style="color:var(--primary-red);"></i> <strong>Lokasi:</strong> ${b.lokasi_penjemputan}<br>
                    <i class="fa-solid fa-comment-dots" style="color:#3b82f6;"></i> <strong>Catatan Mitra:</strong> ${b.catatan_mitra || '-'}
                </div>

                <div style="text-align:right;">
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(waMsg)}" target="_blank" style="display:inline-flex; align-items:center; gap:6px; padding:8px 14px; background:#2563eb; color:white; border-radius:8px; font-size:12px; font-weight:700; text-decoration:none;">
                        <i class="fa-brands fa-whatsapp"></i> Dispatch Konfirmasi WA
                    </a>
                </div>
            </div>
        `;
    }).join('');
}

async function submitRentalBooking(event) {
    event.preventDefault();

    const salesAccountId = localStorage.getItem('idSales') || 7;
    const namaSales = document.getElementById('salesName').value;
    const namaCustomer = document.getElementById('customerName').value.trim();
    const noHpCustomer = document.getElementById('customerPhone').value.trim();
    const mitraRental = document.getElementById('selectMitraRental').value;
    const modelUnit = document.getElementById('selectModelUnit').value;
    const durasi = document.getElementById('selectDurasi').value;
    const tanggalTestdrive = document.getElementById('tanggalTestdrive').value;
    const alasanPengajuan = document.getElementById('selectAlasan').value;
    const lokasiPenjemputan = document.getElementById('lokasiPenjemputan').value.trim();

    const payload = {
        sales_account_id: salesAccountId,
        nama_sales: namaSales,
        nama_customer: namaCustomer,
        no_hp_customer: noHpCustomer,
        mitra_rental: mitraRental,
        model_unit: modelUnit,
        durasi: durasi,
        tanggal_testdrive: tanggalTestdrive,
        alasan_pengajuan: alasanPengajuan,
        lokasi_penjemputan: lokasiPenjemputan
    };

    try {
        const response = await fetch('../api/api_rental_testdrive.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const res = await response.json();

        if (res.status === 'success') {
            showCustomAlert('Pengajuan Berhasil!', res.message, 'success');
            
            if (res.wa_link) {
                setTimeout(() => {
                    window.open(res.wa_link, '_blank');
                }, 1000);
            }

            document.getElementById('rentalTestDriveForm').reset();
            initSalesUser();
            setDefaultDateTime();
            
            fetchRentalData();
            switchRentalTab('history');
        } else {
            showCustomAlert('Gagal', res.message || 'Terjadi kesalahan sistem.', 'danger');
        }
    } catch (err) {
        console.error("Gagal mengirim pengajuan:", err);
        showCustomAlert('Error', 'Gagal terhubung ke server.', 'danger');
    }
}

function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function formatDateTime(dtStr) {
    if (!dtStr) return '-';
    const d = new Date(dtStr);
    if (isNaN(d.getTime())) return dtStr;
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
