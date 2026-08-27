let sigCanvas, sigCtx, isDrawingSig = false;

document.addEventListener('DOMContentLoaded', () => {
    initSignatureCanvas();
});

function initSignatureCanvas() {
    sigCanvas = document.getElementById('delSigCanvas');
    if (!sigCanvas) return;
    
    // Set actual width & height attributes
    sigCanvas.width = sigCanvas.offsetWidth;
    sigCanvas.height = sigCanvas.offsetHeight;

    sigCtx = sigCanvas.getContext('2d');
    sigCtx.lineWidth = 2.5;
    sigCtx.lineCap = 'round';
    sigCtx.strokeStyle = '#0d1b3e';

    // Mouse events
    sigCanvas.addEventListener('mousedown', (e) => {
        isDrawingSig = true;
        sigCtx.beginPath();
        sigCtx.moveTo(e.offsetX, e.offsetY);
    });

    sigCanvas.addEventListener('mousemove', (e) => {
        if (!isDrawingSig) return;
        sigCtx.lineTo(e.offsetX, e.offsetY);
        sigCtx.stroke();
    });

    sigCanvas.addEventListener('mouseup', () => isDrawingSig = false);
    sigCanvas.addEventListener('mouseleave', () => isDrawingSig = false);

    // Touch events for mobile
    sigCanvas.addEventListener('touchstart', (e) => {
        isDrawingSig = true;
        const rect = sigCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        sigCtx.beginPath();
        sigCtx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
        e.preventDefault();
    });

    sigCanvas.addEventListener('touchmove', (e) => {
        if (!isDrawingSig) return;
        const rect = sigCanvas.getBoundingClientRect();
        const touch = e.touches[0];
        sigCtx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
        sigCtx.stroke();
        e.preventDefault();
    });

    sigCanvas.addEventListener('touchend', () => isDrawingSig = false);
}

function clearDelSignature() {
    if (sigCtx && sigCanvas) {
        sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
    }
}

function submitDeliveryCeremony() {
    const nama = document.getElementById('delNamaCustomer')?.value.trim();
    const hp = document.getElementById('delNoHp')?.value.trim();
    const model = document.getElementById('delModelUnit')?.value.trim();
    const noRangka = document.getElementById('delNoRangka')?.value.trim();
    const noMesin = document.getElementById('delNoMesin')?.value.trim();

    if (!nama || !model) {
        if (window.showCustomAlert) window.showCustomAlert('Perhatian!', 'Nama Customer dan Model Unit wajib diisi!', 'error');
        else alert('Nama Customer dan Model Unit wajib diisi!');
        return;
    }

    const pdiChecklist = [];
    document.querySelectorAll('.pdi-chk:checked').forEach(chk => pdiChecklist.push(chk.value));

    const signatureData = sigCanvas ? sigCanvas.toDataURL() : '';

    const payload = {
        sales_account_id: localStorage.getItem('idSales') || 1,
        nama_customer: nama,
        no_hp: hp,
        model_unit: model,
        no_rangka: noRangka,
        no_mesin: noMesin,
        pdi_checklist: pdiChecklist,
        tanda_tangan: signatureData
    };

    fetch('../api/api_delivery.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(res => {
        if (res.status === 'success') {
            if (window.showCustomAlert) {
                window.showCustomAlert('🎉 SERAH TERIMA SUKSES!', res.message, 'success');
            } else {
                alert(res.message);
            }

            // Render certificate box
            const certBox = document.getElementById('delCertResultCard');
            const certContent = document.getElementById('delCertContent');
            if (certBox && certContent) {
                certBox.style.display = 'block';
                const nowStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                certContent.innerHTML = `
                    <div style="text-align:center; font-weight:800; font-size:14px; margin-bottom:8px;">SERTIFIKAT PENYERAHAN KENDARAAN TOYOTA</div>
                    <div style="border-bottom: 1px dashed #059669; margin-bottom:10px;"></div>
                    <strong>Nomor Sertifikat:</strong> TYT-DEL-${res.id}-${Date.now().toString().slice(-4)}<br>
                    <strong>Nama Pelanggan:</strong> ${nama}<br>
                    <strong>Unit Kendaraan:</strong> ${model}<br>
                    <strong>No. Rangka / Mesin:</strong> ${noRangka || '-'} / ${noMesin || '-'}<br>
                    <strong>Tanggal Serah Terima:</strong> ${nowStr}<br>
                    <strong>PDI Status:</strong> 100% Lulus Inspeksi (${pdiChecklist.length} Poin Checked)<br>
                    <strong>Garansi Aktif:</strong> T-Care (Free Service & Sparepart 3 Thn / 60.000 KM)
                `;
            }
        } else {
            alert('Gagal: ' + res.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert('Gagal terhubung ke API database.');
    });
}

function shareDeliveryWA() {
    const nama = document.getElementById('delNamaCustomer')?.value.trim();
    const model = document.getElementById('delModelUnit')?.value.trim();
    const hp = document.getElementById('delNoHp')?.value.trim();

    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant';
    const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

    const text = `🎉 *SELAMAT ATAS MOBIL BARU TOYOTA ANDA!* 🚗✨
━━━━━━━━━━━━━━━━━━━━━━━━━━
Yth. Bapak/Ibu *${nama}*,

Selamat dan terima kasih telah mempercayakan kepemilikan unit *${model}* kepada *${cabang}*!

📋 *INFORMASI SERAH TERIMA & GARANSI:*
- Unit: *${model}*
- Status PDI: *100% Lulus Inspeksi Resmi*
- Program Garansi: *T-Care Active* (Gratis Oli & Sparepart Perawatan Berkala)

Sertifikat Serah Terima Digital Anda telah resmi terdaftar di database kami.

Jika ada pertanyaan seputar perawatan berkala atau fitur mobil, jangan ragu untuk menghubungi saya kapan saja!

Salam hangat & Hormat kami,
👔 *${salesNama}*
🏬 ${cabang}`;

    const waUrl = hp ? `https://api.whatsapp.com/send?phone=${hp.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}` : `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
}
