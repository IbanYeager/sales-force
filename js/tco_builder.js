let currentTcoItems = [];

document.addEventListener('DOMContentLoaded', () => {
    loadTcoModels();
});

function loadTcoModels() {
    fetch('../api/api_tco_builder.php')
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                const select = document.getElementById('tcoModelSelect');
                if (select && res.models) {
                    select.innerHTML = res.models.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
                    if (res.selected_model_id) {
                        select.value = res.selected_model_id;
                        renderTcoItems(res.items);
                    }
                }
            }
        })
        .catch(err => console.error(err));
}

function loadTcoItems(modelId) {
    if (!modelId) return;
    fetch(`../api/api_tco_builder.php?model_id=${modelId}`)
        .then(r => r.json())
        .then(res => {
            if (res.status === 'success') {
                renderTcoItems(res.items);
            }
        })
        .catch(err => console.error(err));
}

function renderTcoItems(items) {
    currentTcoItems = items || [];
    const container = document.getElementById('tcoItemsList');
    if (!container) return;

    if (currentTcoItems.length === 0) {
        container.innerHTML = '<p style="text-align:center; font-size:12px; color:#64748b; padding:20px;">Belum ada aksesoris untuk model ini.</p>';
        calculateTcoSummary();
        return;
    }

    container.innerHTML = currentTcoItems.map(item => `
        <div class="item-row">
            <div style="flex:1; padding-right:10px;">
                <div style="font-size:13px; font-weight:800; color:#0f172a;">${item.name}</div>
                <div style="font-size:10.5px; color:#64748b; margin-top:2px;">
                    Part: ${item.part_number || '-'} | Grade: ${item.applicable_grade || 'All Varian'}
                </div>
                <div style="font-size:12px; font-weight:800; color:#4338ca; margin-top:4px;">
                    Rp ${item.numeric_price.toLocaleString('id-ID')}
                </div>
            </div>
            <input type="checkbox" class="tco-chk" value="${item.numeric_price}" data-name="${escapeQuotes(item.name)}" onchange="calculateTcoSummary()">
        </div>
    `).join('');

    calculateTcoSummary();
}

function escapeQuotes(str) {
    return (str || '').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

function calculateTcoSummary() {
    let totalPrice = 0;
    let selectedCount = 0;

    document.querySelectorAll('.tco-chk:checked').forEach(chk => {
        totalPrice += parseFloat(chk.value) || 0;
        selectedCount++;
    });

    // Monthly installment impact (~60 months tenor)
    const monthlyImpact = Math.round(totalPrice / 48);

    document.getElementById('tcoTotalHarga').textContent = 'Rp ' + totalPrice.toLocaleString('id-ID');
    document.getElementById('tcoCicilanImpact').textContent = selectedCount > 0 ? `Atau +Rp ${monthlyImpact.toLocaleString('id-ID')} / bulan pada cicilan (Tenor 4-5 Thn)` : 'Atau +Rp 0 / bulan pada angsuran kredit';
}

function shareTcoProposalWA() {
    const modelSelect = document.getElementById('tcoModelSelect');
    const modelName = modelSelect ? modelSelect.options[modelSelect.selectedIndex].text : 'Toyota';

    const selectedItems = [];
    document.querySelectorAll('.tco-chk:checked').forEach(chk => {
        selectedItems.push(chk.dataset.name);
    });

    if (selectedItems.length === 0) {
        if (window.showCustomAlert) window.showCustomAlert('Perhatian', 'Pilih minimal 1 aksesoris untuk membuat penawaran!', 'warning');
        else alert('Pilih minimal 1 aksesoris!');
        return;
    }

    const totalPrice = document.getElementById('tcoTotalHarga').textContent;
    const cicilanImpact = document.getElementById('tcoCicilanImpact').textContent;

    const salesNama = localStorage.getItem('namaSales') || 'Sales Consultant';
    const cabang = localStorage.getItem('cabangSales') || 'Tunas Toyota Kiara Condong';

    const text = `🎨 *PENAWARAN AKSESORIS TOYOTA CUSTOMIZATION OPTION (TCO)* 🚗
━━━━━━━━━━━━━━━━━━━━━━━━━━
Bapak/Ibu, berikut adalah estimasi paket aksesoris original untuk unit *${modelName}*:

📦 *ITEM AKSESORIS PILIHAN:*
${selectedItems.map((it, idx) => `${idx + 1}. ${it}`).join('\n')}

💰 *ESTIMASI INVESTASI AKSESORIS:*
- Total Harga Aksesoris: *${totalPrice}*
- (${cicilanImpact})

✨ *KEUNGGULAN TCO ORIGINAL TOYOTA:*
1. Garansi resmi Toyota Astra Motor.
2. Pemasangan rapi oleh teknisi tersertifikasi tanpa merusak garansi kelistrikan mobil.
3. Bisa langsung digabungkan ke dalam skema pembiayaan kredit!

Ingin paket aksesoris ini dimasukkan ke dalam pemesanan SPK unit Anda?

Salam hangat,
👔 *${salesNama}*
🏬 ${cabang}`;

    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}
