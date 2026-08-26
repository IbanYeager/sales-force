/**
 * ai_copilot.js
 * Smart AI Sales Copilot Assistant & Knowledge Engine
 * Powered by Google Gemini AI & Toyota Knowledge Base
 * Tunas Toyota Sales Force Tracking System
 */

// ==========================================
// 1. KNOWLEDGE BASE & OBJECTIONS DATABASE
// ==========================================
if (typeof window.AI_KNOWLEDGE === 'undefined') {
    window.AI_KNOWLEDGE = {
        inventory: [
            { model: "Innova Zenix 2.0 G HV CVT", colors: [{ color: "Platinum White Pearl", qty: 56 }, { color: "Attitude Black Mica", qty: 22 }, { color: "Gray Metallic", qty: 4 }, { color: "Silver Metallic", qty: 3 }], total: 85, promo: "Bunga 0% 1 Thn / Subsidi DP Rp 10 Jt" },
            { model: "Innova Zenix 2.0 Q HV CVT TSS Modelista", colors: [{ color: "Platinum White Pearl", qty: 25 }, { color: "Attitude Black Mica", qty: 29 }, { color: "Silver Metallic", qty: 16 }], total: 70, promo: "Free V-Kool + Bonus TCO Original" },
            { model: "Innova Zenix 2.0 V HV CVT Modelista", colors: [{ color: "Attitude Black Mica", qty: 32 }, { color: "Platinum White Pearl", qty: 13 }, { color: "Gray Metallic", qty: 3 }], total: 48, promo: "Free Service & Sparepart 4 Thn" },
            { model: "Kijang Innova 2.4 G A/T Diesel Reborn", colors: [{ color: "Silver Metallic", qty: 47 }, { color: "Super White II", qty: 42 }, { color: "Gray Metallic", qty: 42 }, { color: "Attitude Black Mica", qty: 32 }], total: 163, promo: "DP Ringan 15% / Diskon Khusus KACAB" },
            { model: "Veloz 1.5 Q Hybrid CVT Modelista", colors: [{ color: "Platinum White Pearl Mica", qty: 37 }, { color: "Attitude Black Mica", qty: 36 }, { color: "Silver Metallic", qty: 14 }], total: 87, promo: "Bunga 0% + Free Kaca Film V-Kool" },
            { model: "All New Avanza 1.3 E & 1.5 G", colors: [{ color: "Black Mica", qty: 50 }, { color: "Silver Metallic", qty: 45 }, { color: "White", qty: 30 }, { color: "Purplish Silver", qty: 25 }], total: 150, promo: "DP Mulai Rp 15 Juta / Angsuran Ringan" },
            { model: "New Calya 1.2 G M/T & A/T", colors: [{ color: "Black", qty: 116 }, { color: "Silver Metallic", qty: 103 }, { color: "Grey Metallic", qty: 36 }, { color: "White", qty: 16 }], total: 271, promo: "DP Ringan Rp 10 Juta" },
            { model: "Fortuner 2.8 VRZ GR Parts Aero TSS", colors: [{ color: "Attitude Black Mica", qty: 64 }, { color: "Platinum White Pearl", qty: 10 }, { color: "Black - White Dual Tone", qty: 5 }], total: 79, promo: "Diskon Prioritas + Free T-Care" },
            { model: "Rush 1.5 S AT GR Sport", colors: [{ color: "Black Mica", qty: 50 }, { color: "White", qty: 35 }, { color: "Silver Mica Metallic", qty: 20 }], total: 105, promo: "Paket Spektakuler TAF/ACC" },
            { model: "All New Agya 1.2 G / Stylix GR", colors: [{ color: "White", qty: 20 }, { color: "Yellow", qty: 14 }, { color: "Black", qty: 10 }], total: 44, promo: "Cicilan Rp 2 Jt-an/bln" },
            { model: "Hilux Rangga Pick-Up & Double Cabin", colors: [{ color: "White", qty: 18 }, { color: "Attitude Black", qty: 10 }], total: 28, promo: "Paket Usaha DP Ringan" }
        ],
        pricelist: [
            { model: "All New Avanza 1.5 G M/T", otr: 259800000 },
            { model: "All New Veloz 1.5 Q CVT", otr: 315300000 },
            { model: "Innova Zenix 2.0 G Gasoline", otr: 430400000 },
            { model: "Innova Zenix 2.0 V HV Hybrid", otr: 473600000 },
            { model: "Fortuner 2.8 VRZ 4x2 A/T", otr: 617700000 },
            { model: "Yaris Cross 1.5 S HV CVT", otr: 440600000 },
            { model: "All New Agya 1.2 G CVT", otr: 191400000 },
            { model: "New Calya 1.2 G M/T", otr: 173200000 }
        ],
        promos: [
            "🔥 **Paket DP Ringan Spektakuler**: Avanza & Calya DP mulai 15% (Rp 10-15 Juta).",
            "💳 **Bunga 0% Tenor 1 Tahun**: Khusus pembiayaan TAF & ACC untuk Veloz & Zenix.",
            "🛠️ **Free Service & Sparepart 4 Tahun / 50.000 KM**: Gratis biaya oli & filter rutin (T-Care).",
            "🎁 **Bonus Aksesoris TCO Original**: Free Kaca Film V-Kool / 3M, Karpet Dasar, & Dashcam Tunas Toyota."
        ]
    };
}

if (typeof window.OBJECTIONS_DATA === 'undefined') {
    window.OBJECTIONS_DATA = [
        {
            id: 'diskon',
            icon: 'fa-tags',
            title: '🏷️ Diskon Dealer Sebelah Lebih Besar',
            description: 'Konsumen mengklaim dealer kompetitor memberi potongan harga Rp 5-10 Juta lebih tinggi.',
            responses: {
                soft: "Bapak/Ibu, kami sangat memahami jika nominal awal terlihat menarik. Namun program kami di Tunas Toyota sudah mencakup **Free Service & Sparepart 4 Tahun (Gratis Oli & Jasa Berkala senilai Rp 8 Juta)**, ditambah **Bonus Kaca Film V-Kool + Karpet Dasar Original**, serta jaminan **Unit Ready Stock tanpa inden**. Jika dihitung total benefit riil yang Bapak/Ibu dapatkan justru jauh lebih menguntungkan dan aman!",
                value: "Mari kita hitung nilai efisiensi totalnya, Pak: Potongan harga dealer sebelah Rp 5 Jt, namun paket kami sudah termasuk servis berkala gratis 50.000 KM (senilai Rp 8.5 Jt) dan jaringan bengkel resmi prioritas Tunas Toyota. Total penghematan biaya operasional Bapak/Ibu selama 4 tahun pemakaian jauh lebih tinggi bersama kami.",
                closing: "Jika hari ini Bapak/Ibu tanda tangan SPK dengan tanda jadi Rp 5 Juta, saya akan ajukan khusus ke Kepala Cabang untuk tambahan **Voucher Bensin Rp 1 Juta + Bonus Karpet Original**. Bagaimana kalau kita kunci unitnya sekarang agar tidak terambil antrean lain?"
            }
        },
        {
            id: 'bunga',
            icon: 'fa-credit-card',
            title: '💳 Bunga Kredit Bank Lain Lebih Murah',
            description: 'Konsumen membandingkan tingkat suku bunga leasing dengan pinjaman bank eksternal.',
            responses: {
                soft: "Betul Pak, beberapa bank menawarkan suku bunga yang tampak rendah di muka. Namun pembiayaan resmi rekanan kami (TAF / ACC) sudah dilengkapi **Asuransi All Risk Full Coverage + TJH Pihak Ke-3**, proses *Approval Instant 1 Hari*, dan tanpa biaya admin provisi tersembunyi.",
                value: "Pembiayaan resmi kami sudah mencakup asuransi jiwa pelunasan otomatis bagi debitur jika terjadi risiko darurat, sehingga keluarga tidak dibebani sisa cicilan. Keamanan finansial keluarga jangka panjang jauh lebih terlindungi.",
                closing: "Khusus bulan ini tersedia program **Bunga 0% Tenor 1 Tahun** atau **Paket Angsuran Super Ringan Tenor 5-6 Tahun**. Boleh saya buatkan 2 opsi perbandingan simulasi resminya dalam 2 menit, Pak?"
            }
        },
        {
            id: 'tradein',
            icon: 'fa-right-left',
            title: '🚗 Estimasi Harga Mobil Lama (Trade-In) Terlalu Rendah',
            description: 'Konsumen merasa harga taksiran tukar tambah mobil lamanya di bawah ekspektasi pasar.',
            responses: {
                soft: "Kami sangat mengapresiasi kondisi mobil lama Bapak/Ibu yang terawat. Penawaran dari inspektor resmi kami bersifat *Nett & Instant*, tanpa potongan komisi perantara, dan pembayarannya langsung dipotongkan ke DP unit baru sehingga angsuran otomatis langsung lebih ringan.",
                value: "Jika dijual mandiri tentu butuh waktu 2-4 minggu, biaya pasang iklan, serta repot melayani calon pembeli asing. Melalui program Trade-In resmi Tunas Toyota, Bapak/Ibu juga berhak atas **Tambahan Subsidi Trade-In Spesial Rp 3 - 5 Juta** langsung!",
                closing: "Bagaimana jika saya tambahkan **Subsidi Trade-In Ekstra Rp 3 Juta** ke dalam kalkulasi DP unit baru hari ini? Mobil lama tetap boleh Bapak/Ibu pakai beraktivitas sampai mobil baru tiba di rumah."
            }
        },
        {
            id: 'inden',
            icon: 'fa-hourglass-half',
            title: '⏳ Waktu Inden Unit Terlalu Lama',
            description: 'Konsumen butuh mobil segera namun varian atau warna tertentu harus menunggu antrean pabrik.',
            responses: {
                soft: "Tipe favorit ini memang paling diburu konsumen Pak karena performa dan nilai resale value-nya yang luar biasa tinggi. Namun sebagai dealer prioritas utama Toyota, alokasi pengiriman pabrik ke cabang kami adalah yang tercepat.",
                value: "Membeli tipe impian adalah investasi kenyamanan jangka panjang. Menunggu beberapa hari jauh lebih memuaskan daripada kompromi memilih tipe lain yang kurang sesuai keinginan dan berisiko menyesal di kemudian hari.",
                closing: "Saya ada 1 alokasi *Priority Match* unit warna impian Bapak/Ibu yang baru masuk slot perakitan bulan ini. Jika Bapak/Ibu masukkan SPK hari ini, nomor antrean Bapak/Ibu langsung dikunci di posisi teratas!"
            }
        },
        {
            id: 'hybrid',
            icon: 'fa-bolt',
            title: '🔋 Khawatir Garansi & Nilai Jual Bekas Hybrid (Zenix/Yaris Cross)',
            description: 'Konsumen ragu dengan usia baterai hybrid HEV dan daya tahan komponen listriknya.',
            responses: {
                soft: "Bapak/Ibu tidak perlu khawatir sama sekali, Toyota memberikan **Garansi Resmi Baterai Hybrid 8 Tahun / 160.000 KM**. Sistem Self-Charging bekerja otomatis tanpa perlu colokan listrik, dan biaya perawatannya sama hematnya dengan mobil bensin konvensional.",
                value: "Secara statistik, efisiensi konsumsi BBM Toyota Hybrid mencapai 40-50% (bisa 1:20-23 km/liter). Dalam 5 tahun pemakaian, total penghematan BBM bisa mencapai Rp 35 - 50 Juta! Nilai jual kembalinya pun terbukti sangat kuat di bursa mobil bekas.",
                closing: "Khusus untuk varian Innova Zenix / Yaris Cross Hybrid hari ini ada bonus Paket Kaca Film V-Kool & Aksesoris TCO. Mari kita amankan unitnya sekarang sebelum kuota promo dialihkan ke prospek lain!"
            }
        },
        {
            id: 'tunda',
            icon: 'fa-calendar-xmark',
            title: '⏳ Ingin Menunda Pembelian Bulan Depan / Akhir Tahun',
            description: 'Konsumen ingin menunda SPK dengan alasan menunggu promo akhir tahun.',
            responses: {
                soft: "Kami sangat memahami rencana Bapak/Ibu. Namun perlu kami informasikan bahwa kuota alokasi unit untuk akhir tahun umumnya sangat padat dan diskon resmi awal bulan ini justru sedang berada di puncak terbaiknya.",
                value: "Jika menunggu akhir tahun, ada potensi penyesuaian Bea Balik Nama (BBN-KB) dan harga OTR baru dari APM, serta risiko antrean pengiriman menumpuk. Membeli sekarang membuat Bapak/Ibu menikmati harga lama dan unit sudah siap dipakai saat liburan keluarga.",
                closing: "Cukup dengan tanda jadi SPK Rp 5 Juta hari ini, Bapak/Ibu sudah mengunci harga promo bulan ini dan nomor rangka unit ready. Mari kita proses SPK-nya sekarang, Pak!"
            }
        },
        {
            id: 'angsuran',
            icon: 'fa-money-bill-wave',
            title: '💸 Angsuran Bulanan Terasa Terlalu Berat',
            description: 'Konsumen menyukai unitnya namun nominal cicilan per bulan melampaui alokasi belanja.',
            responses: {
                soft: "Kami paham betul pentingnya menjaga cashflow bulanan keluarga tetap longgar. Kami memiliki opsi paket pembiayaan fleksibel, mulai dari opsi perpanjangan tenor hingga skema Balloon Payment / Step-Up.",
                value: "Dengan memperpanjang tenor ke 5-6 tahun atau skema angsuran berjenjang, cicilan bulanan bisa ditekan hingga 30-40%, sehingga pengeluaran bulanan tetap leluasa untuk keperluan lainnya.",
                closing: "Mari saya sesuaikan simulasinya dengan memperbesar porsi subsidi DP dari kami, sehingga cicilan bulanan bisa pas di angka budget Bapak/Ibu. Boleh sebutkan target nominal angsuran yang paling nyaman per bulan?"
            }
        },
        {
            id: 'servis',
            icon: 'fa-wrench',
            title: '🛠️ Khawatir Biaya Servis & Perawatan Mahal',
            description: 'Konsumen khawatir biaya pemeliharaan rutin berkala di bengkel resmi membebani.',
            responses: {
                soft: "Bapak/Ibu tenang saja, setiap pembelian unit baru Toyota langsung mendapatkan program **T-Care: Gratis Biaya Jasa & Suku Cadang / Oli hingga servis ke-7 (3-4 Tahun / 50.000 KM)** di seluruh bengkel resmi Toyota!",
                value: "Artinya selama 3 sampai 4 tahun pertama, Bapak/Ibu praktis **Rp 0 untuk biaya servis berkala**. Ditambah durabilitas mesin Toyota yang terkenal tangguh serta ketersediaan sparepart yang murah dan melimpah di mana saja.",
                closing: "Dengan servis gratis 4 tahun dan garansi mesin 3 tahun, kepemilikan mobil baru ini benar-benar bebas beban pikiran. Mari kita lengkapi data SPK-nya hari ini, Pak!"
            }
        }
    ];
}

var AI_KNOWLEDGE = window.AI_KNOWLEDGE;
var OBJECTIONS_DATA = window.OBJECTIONS_DATA;

window.aiCopilotLoaded = true;
window.currentSelectedObjectionId = window.currentSelectedObjectionId || 'diskon';
window.currentResponseStyle = window.currentResponseStyle || 'soft';
var currentSelectedObjectionId = window.currentSelectedObjectionId;
var currentResponseStyle = window.currentResponseStyle;

// Chat history in session memory
window.chatConversationHistory = window.chatConversationHistory || [];
var chatConversationHistory = window.chatConversationHistory;

// ==========================================
// 2. PAGE LEVEL LOGIC (AI COPILOT FULL PAGE)
// ==========================================
function initCopilotPage() {
    const objectionListEl = document.getElementById('objectionList');
    if (!objectionListEl) return;

    renderObjectionChips();
    selectObjection('diskon');
}

function switchCopilotTab(tab) {
    const tabs = ['objection', 'pitch', 'chat'];
    tabs.forEach(t => {
        const btn = document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1));
        const content = document.getElementById('content' + t.charAt(0).toUpperCase() + t.slice(1));
        if (btn) {
            if (t === tab) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        }
        if (content) {
            content.style.display = (t === tab) ? 'block' : 'none';
        }
    });
}

function renderObjectionChips() {
    const container = document.getElementById('objectionList');
    if (!container) return;

    container.innerHTML = OBJECTIONS_DATA.map(obj => `
        <button 
            type="button" 
            class="objection-chip ${obj.id === currentSelectedObjectionId ? 'active' : ''}" 
            onclick="selectObjection('${obj.id}')"
            style="
                display: flex;
                align-items: center;
                gap: 10px;
                width: 100%;
                text-align: left;
                padding: 12px 14px;
                border-radius: 12px;
                border: 1.5px solid ${obj.id === currentSelectedObjectionId ? '#c8102e' : '#e2e8f0'};
                background: ${obj.id === currentSelectedObjectionId ? '#fff1f2' : '#ffffff'};
                color: ${obj.id === currentSelectedObjectionId ? '#99001c' : '#1e293b'};
                font-weight: 700;
                font-size: 12.5px;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 8px;
            "
        >
            <i class="fa-solid ${obj.icon}" style="font-size: 14px; color: ${obj.id === currentSelectedObjectionId ? '#c8102e' : '#64748b'}; width: 20px; text-align: center;"></i>
            <span style="flex: 1;">${obj.title}</span>
            <i class="fa-solid fa-chevron-right" style="font-size: 11px; opacity: 0.5;"></i>
        </button>
    `).join('');
}

function selectObjection(id) {
    currentSelectedObjectionId = id;
    renderObjectionChips();

    const responseCard = document.getElementById('responseCard');
    if (responseCard) responseCard.style.display = 'block';

    const obj = OBJECTIONS_DATA.find(o => o.id === id);
    if (!obj) return;

    const descEl = document.getElementById('objectionDesc');
    if (descEl) descEl.innerText = obj.description;

    const titleEl = document.getElementById('selectedObjectionTitle');
    if (titleEl) titleEl.innerText = obj.title;

    renderResponse();
}

function setResponseStyle(style, btnElement) {
    currentResponseStyle = style;
    if (btnElement) {
        document.querySelectorAll('.style-pill, .tab-style-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');
    }
    renderResponse();
}

function renderResponse() {
    const obj = OBJECTIONS_DATA.find(o => o.id === currentSelectedObjectionId);
    const box = document.getElementById('aiScriptBox') || document.getElementById('aiResponseBox');
    if (!obj || !box) return;

    const text = obj.responses[currentResponseStyle] || obj.responses.soft;
    const formattedHtml = parseMarkdownToHtml(text);

    box.innerHTML = formattedHtml;
}

function copyCopilotScript() {
    const obj = OBJECTIONS_DATA.find(o => o.id === currentSelectedObjectionId);
    const text = obj ? (obj.responses[currentResponseStyle] || obj.responses.soft) : '';
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
        alert('Skrip respon AI berhasil disalin!');
    }).catch(() => {
        alert('Skrip respon AI berhasil disalin!');
    });
}

function shareToWA() {
    const obj = OBJECTIONS_DATA.find(o => o.id === currentSelectedObjectionId);
    const text = obj ? (obj.responses[currentResponseStyle] || obj.responses.soft) : '';
    if (!text) return;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function generateSmartPitch() {
    const profil = document.getElementById('pitchProfil') ? document.getElementById('pitchProfil').value : 'keluarga';
    const model = document.getElementById('pitchModel') ? document.getElementById('pitchModel').value.trim() : 'Toyota';
    const skema = document.getElementById('pitchSkema') ? document.getElementById('pitchSkema').value : 'dp';

    let pitchText = '';
    if (profil === 'keluarga') {
        pitchText = `Selamat siang Bapak/Ibu, pilihan unit **${model || 'Toyota'}** ini sangat ideal untuk kenyamanan seluruh anggota keluarga tercinta. Kabinnya sangat lega, suspensi empuk, dan standar fitur keselamatan Toyota (TSS) memberikan perlindungan optimal di setiap perjalanan.`;
    } else if (profil === 'muda') {
        pitchText = `Halo Kak! **${model || 'Toyota'}** ini pas banget untuk menunjang mobilitas harian dan lifestyle kamu. Desain eksteriornya modern & sporty, dilengkapi head unit canggih dengan konektivitas smartphone, serta konsumsi bahan bakar yang luar biasa efisien.`;
    } else if (profil === 'bisnis') {
        pitchText = `Selamat pagi Bapak/Ibu. Untuk kebutuhan armada operasional dan bisnis, **${model || 'Toyota'}** terkenal dengan durabilitas mesin yang tangguh, resale value tinggi, serta program T-Care gratis servis berkala yang menekan biaya operasional harian.`;
    } else {
        pitchText = `Selamat siang Bapak/Ibu! Sebagai mobil pertama pilihan keluarga, **${model || 'Toyota'}** memberikan kemudahan berkendara yang praktis, fitur modern, dan jaringan purna jual bengkel resmi Tunas Toyota terlengkap di Jawa Barat.`;
    }

    if (skema === 'dp') {
        pitchText += ` Khusus bulan ini tersedia promo **DP Ringan mulai 15%** dengan proses approval instant dan bonus kaca film + karpet original.`;
    } else if (skema === 'angsuran') {
        pitchText += ` Tersedia paket pembiayaan **Angsuran Super Ringan dengan Tenor Panjang hingga 5-6 Tahun** dari TAF/ACC resmi.`;
    } else {
        pitchText += ` Untuk pembelian Cash, kami berikan diskon prioritas spesial langsung dari Kepala Cabang plus bonus aksesoris original TCO!`;
    }

    pitchText += ` Boleh saya kirimkan detail rincian simulasi lengkapnya ke WhatsApp Bapak/Ibu sekarang?`;

    const card = document.getElementById('pitchResultCard');
    const resultBox = document.getElementById('pitchResultText');
    if (card && resultBox) {
        resultBox.innerHTML = parseMarkdownToHtml(pitchText);
        card.style.display = 'block';
    }
}

function copyPitchResult() {
    const box = document.getElementById('pitchResultText');
    if (!box) return;
    const text = box.innerText || box.textContent;
    navigator.clipboard.writeText(text).then(() => {
        alert('Skrip pitching berhasil disalin!');
    }).catch(() => {
        alert('Skrip pitching berhasil disalin!');
    });
}

function sendQuickChat(text) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

async function sendChatMessage() {
    const input = document.getElementById('chatInput');
    const history = document.getElementById('chatHistory');
    if (!input || !history || !input.value.trim()) return;

    const userText = input.value.trim();

    // User bubble
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-bubble chat-user';
    userMsg.innerText = userText;
    history.appendChild(userMsg);

    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Typing bubble
    const typingMsg = document.createElement('div');
    typingMsg.className = 'chat-bubble chat-ai';
    typingMsg.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #c8102e;"></i> <span style="color:#64748b;">AI sedang memeriksa database & menyusun respon...</span>`;
    history.appendChild(typingMsg);
    history.scrollTop = history.scrollHeight;

    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    try {
        const localKey = localStorage.getItem('sft_gemini_api_key') || '';
        const res = await fetch(prefix + 'api/api_ai_gemini.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userText,
                history: chatConversationHistory,
                apiKey: localKey
            })
        });

        const json = await res.json();
        if (typingMsg.parentNode) typingMsg.parentNode.removeChild(typingMsg);

        let aiReplyText = (json.status === 'success' && json.reply) ? json.reply : generateIntelligentAiResponse(userText);

        chatConversationHistory.push({ role: 'user', text: userText });
        chatConversationHistory.push({ role: 'model', text: aiReplyText });
        if (chatConversationHistory.length > 10) {
            chatConversationHistory = chatConversationHistory.slice(-10);
        }

        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-bubble chat-ai';
        aiMsg.innerHTML = parseMarkdownToHtml(aiReplyText);
        history.appendChild(aiMsg);
    } catch (err) {
        if (typingMsg.parentNode) typingMsg.parentNode.removeChild(typingMsg);
        const fallbackText = generateIntelligentAiResponse(userText);
        const aiMsg = document.createElement('div');
        aiMsg.className = 'chat-bubble chat-ai';
        aiMsg.innerHTML = parseMarkdownToHtml(fallbackText);
        history.appendChild(aiMsg);
    }

    history.scrollTop = history.scrollHeight;
}

// ==========================================
// 3. FLOATING AI COPILOT CHAT WIDGET
// ==========================================
function injectFloatingAiWidget() {
    // Jangan tampilkan AI Stock di Portal Kacab dan Portal SPV
    const pathLower = window.location.pathname.toLowerCase();
    const role = localStorage.getItem('peranSales') || '';
    if (pathLower.includes('kacab') || pathLower.includes('pages_kacab') || 
        pathLower.includes('spv') || pathLower.includes('pages_spv') ||
        role === 'Kepala Cabang' || role === 'Supervisor') {
        const existing = document.getElementById('aiCopilotWidget');
        if (existing) existing.remove();
        return;
    }

    if (document.getElementById('aiCopilotWidget')) return;

    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    const widgetHtml = `
    <style>
        #btnToggleAiCopilot {
            position: fixed;
            bottom: 24px;
            right: 24px;
            z-index: 999999;
            background: linear-gradient(135deg, #c8102e 0%, #99001c 100%);
            color: white;
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50px;
            padding: 10px 18px;
            box-shadow: 0 10px 25px rgba(200, 16, 46, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-family: inherit;
            font-weight: 800;
            font-size: 13px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
            #btnToggleAiCopilot {
                bottom: 110px !important;
                right: 16px !important;
                padding: 0 !important;
                width: 50px !important;
                height: 50px !important;
                border-radius: 50% !important;
                justify-content: center !important;
                box-shadow: 0 8px 22px rgba(200, 16, 46, 0.5) !important;
            }
            #btnToggleAiCopilot .ai-label,
            #btnToggleAiCopilot .ai-badge {
                display: none !important;
            }
            #btnToggleAiCopilot .ai-icon {
                font-size: 24px !important;
                background: none !important;
                width: auto !important;
                height: auto !important;
            }
            #aiCopilotWindow {
                bottom: 170px !important;
                right: 4vw !important;
                width: 92vw !important;
                height: 70vh !important;
            }
        }
    </style>

    <!-- FLOATING AI COPILOT BUTTON -->
    <div id="aiCopilotWidget">
        <button id="btnToggleAiCopilot" onclick="toggleAiCopilotWindow()" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
            <span class="ai-icon" style="background:rgba(255,255,255,0.2); width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px;">
                <i class="fa-solid fa-car-side"></i>
            </span>
            <span class="ai-label">T-STOCK AI</span>
            <span class="ai-badge" id="aiStatusBadge" style="background:#16a34a; color:white; font-size:9.5px; padding:2px 7px; border-radius:10px; font-weight:800; letter-spacing:0.3px;">LIVE STOK</span>
        </button>

        <!-- CHAT WINDOW -->
        <div id="aiCopilotWindow" style="
            display: none;
            position: fixed;
            bottom: 80px;
            right: 24px;
            z-index: 999999;
            width: 425px;
            max-width: 94vw;
            height: 580px;
            max-height: 82vh;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 45px rgba(0,0,0,0.3);
            border: 1px solid #e2e8f0;
            flex-direction: column;
            overflow: hidden;
            font-family: inherit;
        ">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #0d1b3e 0%, #1e293b 100%); color: white; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg, #c8102e, #e11d48); display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 3px 8px rgba(200,16,46,0.4);">
                        <i class="fa-solid fa-car-side" style="color: white;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 900; font-size: 14px; color: white; display: flex; align-items: center; gap: 6px;">
                            T-STOCK
                            <span style="font-size: 9.5px; background: rgba(255,255,255,0.2); color: #fff; padding: 1px 6px; border-radius: 6px;">Live Stock AI</span>
                        </div>
                        <div style="font-size: 10px; color: #94a3b8;">Tunas Live Stock &amp; Unit Assistant</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button onclick="clearAiChatSession()" style="background: rgba(255,255,255,0.15); border: none; color: #cbd5e1; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: all 0.2s;" title="Bersihkan Percakapan / Reset Chat" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                        <i class="fa-solid fa-rotate-left"></i>
                    </button>
                    <button onclick="toggleAiCopilotWindow(false)" style="background: rgba(255,255,255,0.15); border: none; color: #cbd5e1; width: 28px; height: 28px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.2s;" title="Tutup" onmouseover="this.style.background='rgba(255,255,255,0.25)'" onmouseout="this.style.background='rgba(255,255,255,0.15)'">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                </div>
            </div>

            <!-- Quick Stock Chips -->
            <div style="padding: 7px 10px; background: #f8fafc; border-bottom: 1px solid #e2e8f0; display: flex; gap: 5px; overflow-x: auto; white-space: nowrap;">
                <button onclick="askCopilotQuick('stok alphard')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; font-weight: 700; cursor: pointer;">🚗 Stok Alphard</button>
                <button onclick="askCopilotQuick('stok zenix')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-weight: 700; cursor: pointer;">🚗 Stok Zenix</button>
                <button onclick="askCopilotQuick('stok veloz putih')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #fef3c7; color: #b45309; border: 1px solid #fde68a; font-weight: 700; cursor: pointer;">🚗 Veloz Putih</button>
                <button onclick="askCopilotQuick('stok fortuner')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #f8fafc; color: #334155; border: 1px solid #cbd5e1; font-weight: 700; cursor: pointer;">🚗 Fortuner</button>
                <button onclick="askCopilotQuick('stok innova reborn')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; font-weight: 700; cursor: pointer;">🚗 Innova Reborn</button>
                <button onclick="askCopilotQuick('stok calya')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #fff1f2; color: #be123c; border: 1px solid #fecdd3; font-weight: 700; cursor: pointer;">🚗 Calya</button>
                <button onclick="askCopilotQuick('stok yaris cross')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #ecfeff; color: #0e7490; border: 1px solid #a5f3fc; font-weight: 700; cursor: pointer;">🚗 Yaris Cross</button>
                <button onclick="askCopilotQuick('stok agya')" style="font-size: 10.5px; padding: 3px 9px; border-radius: 12px; background: #fdf4ff; color: #a21caf; border: 1px solid #f5d0fe; font-weight: 700; cursor: pointer;">🚗 Agya Ready</button>
            </div>

            <!-- Chat History -->
            <div id="aiChatHistory" style="flex: 1; padding: 12px 14px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: #f8fafc;">
                <div class="chat-bubble chat-ai" style="background: white; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 14px 14px 14px 2px; font-size: 12.5px; color: #1e293b; max-width: 90%; box-shadow: 0 2px 6px rgba(0,0,0,0.03); line-height: 1.55;">
                    👋 Halo! Saya <strong>T-STOCK</strong>, asisten khusus <strong>Live Stok Unit Toyota</strong>.<br><br>
                    Tanyakan ketersediaan <strong>stok mobil ready</strong>, <strong>pilihan warna</strong>, atau <strong>lokasi cabang dealer</strong> kapan saja!
                </div>
            </div>

            <!-- Input Bar -->
            <div style="padding: 8px 10px; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; align-items: center;">
                <input type="text" id="aiChatInput" placeholder="Tanyakan stok mobil (cth: stok alphard, veloz putih, zenix hitam)..." style="flex: 1; padding: 9px 14px; border-radius: 20px; border: 1.5px solid #cbd5e1; font-size: 12px; outline: none; background: #f8fafc;" onkeypress="if(event.key==='Enter') sendAiChatMessage()">
                <button onclick="sendAiChatMessage()" style="background: linear-gradient(135deg, #c8102e, #e11d48); color: white; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 3px 8px rgba(200,16,46,0.3);">
                    <i class="fa-solid fa-paper-plane" style="font-size: 13px;"></i>
                </button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', widgetHtml);

    // ── Restore Persistent Chat History from Session Storage ──
    try {
        const savedHistoryHtml = sessionStorage.getItem('sft_tstock_history_html');
        const historyEl = document.getElementById('aiChatHistory');
        if (savedHistoryHtml && historyEl) {
            historyEl.innerHTML = savedHistoryHtml;
            setTimeout(() => { historyEl.scrollTop = historyEl.scrollHeight; }, 100);
        }

        const savedHistoryJson = sessionStorage.getItem('sft_tstock_history_json');
        if (savedHistoryJson) {
            chatConversationHistory = JSON.parse(savedHistoryJson) || [];
        }

        // Restore Persistent Open / Closed State
        const savedOpen = sessionStorage.getItem('sft_tstock_open');
        if (savedOpen === '1') {
            toggleAiCopilotWindow(true);
        }
    } catch(e) {
        console.warn('T-STOCK state restoration error:', e);
    }
}

var isAiCopilotOpen = false;
function toggleAiCopilotWindow(forceState) {
    const win = document.getElementById('aiCopilotWindow');
    if (!win) return;
    if (typeof forceState === 'boolean') {
        isAiCopilotOpen = forceState;
    } else {
        isAiCopilotOpen = !isAiCopilotOpen;
    }
    win.style.display = isAiCopilotOpen ? 'flex' : 'none';
    sessionStorage.setItem('sft_tstock_open', isAiCopilotOpen ? '1' : '0');
    if (isAiCopilotOpen) {
        const history = document.getElementById('aiChatHistory');
        if (history) history.scrollTop = history.scrollHeight;
        const input = document.getElementById('aiChatInput');
        if (input) setTimeout(() => input.focus(), 150);
    }
}

function saveAiChatSession() {
    try {
        const history = document.getElementById('aiChatHistory');
        if (history) {
            sessionStorage.setItem('sft_tstock_history_html', history.innerHTML);
            sessionStorage.setItem('sft_tstock_history_json', JSON.stringify(chatConversationHistory));
        }
    } catch(e) {}
}

function clearAiChatSession() {
    try {
        sessionStorage.removeItem('sft_tstock_history_html');
        sessionStorage.removeItem('sft_tstock_history_json');
        chatConversationHistory = [];
        const history = document.getElementById('aiChatHistory');
        if (history) {
            history.innerHTML = `
                <div class="chat-bubble chat-ai" style="background: white; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 14px 14px 14px 2px; font-size: 12.5px; color: #1e293b; max-width: 90%; box-shadow: 0 2px 6px rgba(0,0,0,0.03); line-height: 1.55;">
                    👋 Halo! Saya <strong>T-STOCK</strong>, asisten khusus <strong>Live Stok Unit Toyota</strong>.<br><br>
                    Tanyakan ketersediaan <strong>stok mobil ready</strong>, <strong>pilihan warna</strong>, atau <strong>lokasi cabang dealer</strong> kapan saja!
                </div>
            `;
        }
    } catch(e) {}
}

function askCopilotQuick(text) {
    const input = document.getElementById('aiChatInput');
    if (input) {
        input.value = text;
        sendAiChatMessage();
    }
}

function getContextActionButtons(userText, aiReplyText) {
    const combined = ((userText || '') + ' ' + (aiReplyText || '')).toLowerCase();

    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const isInPages = window.location.pathname.includes('/pages/');
    const prefix = isRoot ? 'pages/' : (isInPages ? '' : '../pages/');

    const buttons = [];

    // 1. Stok / Live Inventory
    buttons.push({
        label: 'Buka Live Inventory (Katalog Stok)',
        icon: 'fa-warehouse',
        url: prefix + 'inventory.html',
        color: '#0284c7',
        bg: '#f0f9ff'
    });

    // 2. SPK / Pengajuan Unit
    if (combined.includes('stok') || combined.includes('ready') || combined.includes('unit') || combined.includes('spk') || combined.includes('pesan') || combined.includes('ambil')) {
        buttons.push({
            label: 'Ajukan Form SPK Unit Ini',
            icon: 'fa-clipboard-check',
            url: prefix + 'spk.html',
            color: '#16a34a',
            bg: '#f0fdf4'
        });
    }

    // 3. Pricelist OTR
    if (combined.includes('harga') || combined.includes('price') || combined.includes('pricelist') || combined.includes('otr')) {
        buttons.push({
            label: 'Lihat Pricelist OTR Terkait',
            icon: 'fa-file-invoice-dollar',
            url: prefix + 'pricelist.html',
            color: '#9333ea',
            bg: '#faf5ff'
        });
    }

    // 4. Kalkulator Multi-Leasing
    if (combined.includes('kredit') || combined.includes('angsuran') || combined.includes('simulasi') || combined.includes('cicilan') || combined.includes('leasing') || combined.includes('dp')) {
        buttons.push({
            label: 'Simulasi Angsuran (Kalkulator)',
            icon: 'fa-calculator',
            url: prefix + 'kalkulator.html',
            color: '#2563eb',
            bg: '#eff6ff'
        });
    }

    // Take max 2 relevant buttons
    const displayButtons = buttons.slice(0, 2);
    let html = '<div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #e2e8f0; display: flex; flex-direction: column; gap: 6px;">';
    displayButtons.forEach(btn => {
        html += `
            <a href="${btn.url}" style="display: flex; align-items: center; justify-content: space-between; padding: 7px 11px; border-radius: 8px; background: ${btn.bg}; border: 1px solid ${btn.color}33; color: ${btn.color}; font-size: 11.5px; font-weight: 800; text-decoration: none; transition: transform 0.15s ease;" onmouseover="this.style.transform='translateX(3px)'" onmouseout="this.style.transform='translateX(0)'">
                <span style="display: flex; align-items: center; gap: 7px;">
                    <i class="fa-solid ${btn.icon}"></i> ${btn.label}
                </span>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px;"></i>
            </a>
        `;
    });
    html += '</div>';
    return html;
}

async function sendAiChatMessage() {
    const input = document.getElementById('aiChatInput');
    const history = document.getElementById('aiChatHistory');
    if (!input || !history || !input.value.trim()) return;

    const userText = input.value.trim();

    // User Bubble
    const userMsg = document.createElement('div');
    userMsg.style.cssText = "background: #c8102e; color: white; padding: 10px 14px; border-radius: 14px 14px 2px 14px; font-size: 12.5px; font-weight: 600; align-self: flex-end; max-width: 85%; word-break: break-word;";
    userMsg.innerText = userText;
    history.appendChild(userMsg);
    saveAiChatSession();

    input.value = '';
    history.scrollTop = history.scrollHeight;

    // AI Bubble Typing State
    const typingMsg = document.createElement('div');
    typingMsg.style.cssText = "background: white; border: 1px solid #e2e8f0; padding: 10px 14px; border-radius: 14px 14px 14px 2px; font-size: 12px; color: #64748b; align-self: flex-start; display: flex; align-items: center; gap: 8px;";
    typingMsg.innerHTML = `<i class="fa-solid fa-circle-notch fa-spin" style="color: #c8102e;"></i> <span>T-STOCK sedang memeriksa live stok gudang...</span>`;
    history.appendChild(typingMsg);
    history.scrollTop = history.scrollHeight;

    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    try {
        const localKey = localStorage.getItem('sft_gemini_api_key') || '';
        const res = await fetch(prefix + 'api/api_ai_gemini.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                prompt: userText,
                history: chatConversationHistory,
                apiKey: localKey
            })
        });

        const json = await res.json();
        if (typingMsg.parentNode) typingMsg.parentNode.removeChild(typingMsg);

        let aiReplyText = '';

        if (json.status === 'success' && json.reply) {
            aiReplyText = json.reply;

            // Keep conversation in session history
            chatConversationHistory.push({ role: 'user', text: userText });
            chatConversationHistory.push({ role: 'model', text: aiReplyText });
            if (chatConversationHistory.length > 10) {
                chatConversationHistory = chatConversationHistory.slice(-10);
            }

            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = "background: white; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 14px 14px 14px 2px; font-size: 12.5px; color: #1e293b; align-self: flex-start; max-width: 90%; box-shadow: 0 2px 6px rgba(0,0,0,0.04); line-height: 1.55;";
            aiMsg.innerHTML = `
                <div>${parseMarkdownToHtml(aiReplyText)}</div>
                ${getContextActionButtons(userText, aiReplyText)}
            `;
            history.appendChild(aiMsg);
        } else {
            const fallbackText = generateIntelligentAiResponse(userText);
            const aiMsg = document.createElement('div');
            aiMsg.style.cssText = "background: white; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 14px 14px 14px 2px; font-size: 12.5px; color: #1e293b; align-self: flex-start; max-width: 90%; box-shadow: 0 2px 6px rgba(0,0,0,0.04); line-height: 1.55;";
            aiMsg.innerHTML = `
                <div>${fallbackText}</div>
                ${getContextActionButtons(userText, fallbackText)}
            `;
            history.appendChild(aiMsg);
        }
    } catch (err) {
        if (typingMsg.parentNode) typingMsg.parentNode.removeChild(typingMsg);
        const fallbackText = generateIntelligentAiResponse(userText);
        const aiMsg = document.createElement('div');
        aiMsg.style.cssText = "background: white; border: 1px solid #e2e8f0; padding: 12px 14px; border-radius: 14px 14px 14px 2px; font-size: 12.5px; color: #1e293b; align-self: flex-start; max-width: 90%; box-shadow: 0 2px 6px rgba(0,0,0,0.04); line-height: 1.55;";
        aiMsg.innerHTML = `
            <div>${fallbackText}</div>
            ${getContextActionButtons(userText, fallbackText)}
        `;
        history.appendChild(aiMsg);
    }

    saveAiChatSession();
    history.scrollTop = history.scrollHeight;
}

function generateIntelligentAiResponse(text) {
    const lower = text.toLowerCase();
    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    // 1. STOK / INVENTORY QUERY
    if (lower.includes('stok') || lower.includes('stock') || lower.includes('ready') || lower.includes('gudang') || lower.includes('warna') || lower.includes('innova') || lower.includes('zenix') || lower.includes('veloz') || lower.includes('avanza') || lower.includes('fortuner') || lower.includes('calya') || lower.includes('rush') || lower.includes('raize') || lower.includes('agya') || lower.includes('hilux') || lower.includes('rangga')) {

        let filteredInventory = AI_KNOWLEDGE.inventory;
        if (lower.includes('zenix')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('zenix'));
        } else if (lower.includes('innova') || lower.includes('reborn') || lower.includes('kijang')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('innova') && !i.model.toLowerCase().includes('zenix'));
        } else if (lower.includes('veloz')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('veloz'));
        } else if (lower.includes('avanza')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('avanza'));
        } else if (lower.includes('calya')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('calya'));
        } else if (lower.includes('fortuner')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('fortuner'));
        } else if (lower.includes('rush')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('rush'));
        } else if (lower.includes('raize')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('raize'));
        } else if (lower.includes('agya')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('agya'));
        } else if (lower.includes('hilux') || lower.includes('rangga')) {
            filteredInventory = AI_KNOWLEDGE.inventory.filter(i => i.model.toLowerCase().includes('hilux') || i.model.toLowerCase().includes('rangga'));
        }

        let itemsHtml = filteredInventory.map(item => {
            let colorRows = item.colors.map(c => `
                <div style="font-size:11.5px; color:#334155; margin-top:2px;">
                    • Warna <strong>${c.color}</strong>: <span style="color:#059669; font-weight:800;">${c.qty} Unit</span>
                </div>
            `).join('');

            return `
                <div style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:10px; padding:8px 12px; margin-top:6px;">
                    <div style="font-weight:800; color:#0f172a; font-size:12.5px;">${item.model}</div>
                    <div style="font-size:11px; color:#059669; font-weight:700; margin-bottom:4px;">🟢 Total Ready: ${item.total} Unit</div>
                    <div style="border-top:1px dashed #e2e8f0; padding-top:4px;">
                        ${colorRows}
                    </div>
                    ${item.promo ? `<div style="font-size:10.5px; color:#b45309; margin-top:4px;">🎁 <em>${item.promo}</em></div>` : ''}
                </div>
            `;
        }).join('');

        return `🚗 <strong>Informasi Stok Ready & Pilihan Warna Toyota</strong>:
        ${itemsHtml}
        
        <div style="margin-top:10px;">
            <a href="${prefix}pages/inventory.html" style="display:inline-flex; align-items:center; gap:6px; background:#0284c7; color:white; font-size:11.5px; font-weight:700; padding:6px 12px; border-radius:8px; text-decoration:none;">
                <i class="fa-solid fa-boxes-stacked"></i> Buka Katalog Live Inventory
            </a>
        </div>`;
    }

    // 2. PRICELIST / OTR QUERY
    if (lower.includes('harga') || lower.includes('pricelist') || lower.includes('price') || lower.includes('otr') || lower.includes('biaya') || lower.includes('murah')) {
        let priceHtml = AI_KNOWLEDGE.pricelist.map(p => `
            <div style="display:flex; justify-content:space-between; border-bottom:1px dashed #e2e8f0; padding:4px 0; font-size:12px;">
                <span style="font-weight:600; color:#334155;">${p.model}</span>
                <span style="font-weight:800; color:#c8102e;">Rp ${(p.otr / 1000000).toFixed(1)} Jt</span>
            </div>
        `).join('');

        return `🏷️ <strong>Daftar Harga OTR Bandung Terbaru</strong>:
        <div style="margin-top:6px;">${priceHtml}</div>
        
        <div style="margin-top:10px;">
            <a href="${prefix}pages/pricelist.html" style="display:inline-flex; align-items:center; gap:6px; background:#16a34a; color:white; font-size:11.5px; font-weight:700; padding:6px 12px; border-radius:8px; text-decoration:none;">
                <i class="fa-solid fa-file-invoice-dollar"></i> Buka Pricelist OTR Lengkap
            </a>
        </div>`;
    }

    // 3. PROMO / DISKON QUERY
    if (lower.includes('promo') || lower.includes('diskon') || lower.includes('dp') || lower.includes('bunga') || lower.includes('cashback') || lower.includes('bonus')) {
        let promoList = AI_KNOWLEDGE.promos.map(p => `<li style="margin-bottom:4px;">${p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`).join('');

        return `🎁 <strong>Program Promo Sales Bulan Ini</strong>:
        <ul style="padding-left:16px; margin:6px 0;">${promoList}</ul>
        
        <div style="margin-top:10px;">
            <a href="${prefix}pages/promo.html" style="display:inline-flex; align-items:center; gap:6px; background:#d97706; color:white; font-size:11.5px; font-weight:700; padding:6px 12px; border-radius:8px; text-decoration:none;">
                <i class="fa-solid fa-tags"></i> Lihat Banner Promo Terbaru
            </a>
        </div>`;
    }

    // DEFAULT NAVIGATIONAL ASSISTANT
    return `🤖 Saya dapat membantu Anda memberikan informasi &amp; mengarahkan langsung ke halaman:<br>
    <div style="margin-top:8px; display:flex; flex-direction:column; gap:6px;">
        <a href="${prefix}pages/inventory.html" style="color:#0284c7; font-weight:700; text-decoration:none;"><i class="fa-solid fa-boxes-stacked"></i> 1. Cek Stok Ready (Inventory)</a>
        <a href="${prefix}pages/pricelist.html" style="color:#16a34a; font-weight:700; text-decoration:none;"><i class="fa-solid fa-file-invoice-dollar"></i> 2. Pricelist OTR Bandung</a>
        <a href="${prefix}pages/promo.html" style="color:#d97706; font-weight:700; text-decoration:none;"><i class="fa-solid fa-tags"></i> 3. Program Promo Sales</a>
        <a href="${prefix}pages/kalkulator.html" style="color:#2563eb; font-weight:700; text-decoration:none;"><i class="fa-solid fa-calculator"></i> 4. Kalkulator Multi-Leasing</a>
    </div>`;
}

function getColorDotHex(colorName) {
    const c = (colorName || '').toLowerCase();
    if (c.includes('black') || c.includes('hitam')) return '#1e293b';
    if (c.includes('white') || c.includes('putih') || c.includes('pearl')) return '#f8fafc';
    if (c.includes('silver')) return '#cbd5e1';
    if (c.includes('gray') || c.includes('grey') || c.includes('abu')) return '#64748b';
    if (c.includes('red') || c.includes('merah')) return '#dc2626';
    if (c.includes('yellow') || c.includes('kuning')) return '#eab308';
    if (c.includes('bronze') || c.includes('coklat')) return '#b45309';
    if (c.includes('blue') || c.includes('biru')) return '#2563eb';
    return '#94a3b8';
}

function getCarImageFilename(modelName) {
    const m = (modelName || '').toLowerCase();
    if (m.includes('supra')) return 'supra.webp';
    if (m.includes('gr 86') || m.includes('gr86') || m.includes('86')) return 'gr-86.webp';
    if (m.includes('gr corolla')) return 'gr-corolla.webp';
    if (m.includes('gr yaris')) return 'gr-yaris.webp';
    if (m.includes('bz4x')) return 'bz4x.webp';
    if (m.includes('prius')) return 'prius.webp';
    if (m.includes('dyna')) return 'dyna.webp';
    if (m.includes('zenix')) return 'zenix.webp';
    if (m.includes('reborn') || m.includes('kijang') || m.includes('innova')) return 'innova-reborn.webp';
    if (m.includes('veloz')) return (m.includes('hybrid') || m.includes('hv')) ? 'veloz-hybrid.webp' : 'veloz.webp';
    if (m.includes('avanza')) return 'avanza.webp';
    if (m.includes('calya')) return 'calya.webp';
    if (m.includes('fortuner')) return (m.includes('gr') || m.includes('improvement')) ? 'fortuner-improvement.webp' : 'fortuner.webp';
    if (m.includes('rush')) return 'rush.webp';
    if (m.includes('raize')) return (m.includes('gr') || m.includes('improvement')) ? 'raize-improvement.webp' : 'raize.webp';
    if (m.includes('agya')) return (m.includes('gr') || m.includes('stylix')) ? 'agya-gr-s.webp' : 'agya.webp';
    if (m.includes('yaris cross')) return 'yaris-cross.webp';
    if (m.includes('yaris')) return 'yaris.webp';
    if (m.includes('alphard')) return 'alphard.webp';
    if (m.includes('vellfire')) return 'vellfire.webp';
    if (m.includes('voxy')) return (m.includes('improvement')) ? 'voxy-improvement.webp' : 'voxy.webp';
    if (m.includes('hiace') || m.includes('hi ace')) return m.includes('premio') ? 'hi-ace-premio.webp' : 'hi-ace-comm.webp';
    if (m.includes('rangga')) return 'rangga.webp';
    if (m.includes('single cabin') || m.includes('single cab')) return 'single-cabin.webp';
    if (m.includes('hilux') || m.includes('cabin') || m.includes('double')) return 'double-cabin.webp';
    if (m.includes('land cruiser') || m.includes('lc300')) return 'land-cruiser.webp';
    if (m.includes('urban cruiser')) return 'urban-cruiser.webp';
    if (m.includes('corolla cross') || m.includes('cross')) return 'corolla-cross.webp';
    if (m.includes('camry')) return 'camry.webp';
    if (m.includes('vios')) return (m.includes('hybrid') || m.includes('hv')) ? 'vios-hybrid.webp' : 'vios.webp';
    if (m.includes('altis') || m.includes('corolla')) return 'altis.webp';
    return 'avanza.webp';
}

function buildVariantCardHtml(title, totalQty, linesBlock, prefix = '../') {
    const carImg = getCarImageFilename(title);
    const lines = linesBlock.split('\n');
    let colorSections = [];
    let currentColor = null;

    lines.forEach(l => {
        let line = l.trim();
        if (!line || line.startsWith('📌') || line.startsWith('###')) return;

        let colMatch = line.match(/^[•-]\s*(?:\*\*)?(.*?)(?:\*\*)?:\s*(\d+\s*unit)/i);
        if (colMatch) {
            currentColor = {
                name: colMatch[1].replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim(),
                qty: colMatch[2].trim(),
                branches: ''
            };
            colorSections.push(currentColor);
        } else if (line.startsWith('📍') && currentColor) {
            let rawBranch = line.replace(/^📍\s*/, '').replace(/\*/g, '').replace(/<[^>]+>/g, '').trim();
            rawBranch = rawBranch.replace(/^Cabang:\s*/i, '').replace(/^Lokasi:\s*/i, '').trim();
            currentColor.branches = rawBranch;
        }
    });

    if (colorSections.length === 0) {
        return '';
    }

    let colorsHtml = colorSections.map(c => {
        const dotColor = getColorDotHex(c.name);
        
        let branchChipsHtml = '';
        if (c.branches) {
            let parts = c.branches.split(/,\s*/);
            branchChipsHtml = `
                <div style="margin-top: 6px; padding-top: 5px; border-top: 1px dashed #e2e8f0; display: flex; flex-direction: column; gap: 4px;">
                    <div style="font-size: 10px; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 4px;">
                        <i class="fa-solid fa-location-dot" style="color: #c8102e; font-size: 9px;"></i> Lokasi Cabang &amp; Gudang:
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
            `;
            parts.forEach(p => {
                let cleanPart = p.trim();
                if (!cleanPart) return;
                branchChipsHtml += `
                    <span style="background: #ffffff; border: 1px solid #cbd5e1; border-radius: 6px; padding: 2px 7px; font-size: 10.5px; color: #334155; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.03);">
                        <i class="fa-solid fa-warehouse" style="color: #0284c7; font-size: 9px;"></i> ${cleanPart}
                    </span>
                `;
            });
            branchChipsHtml += `</div></div>`;
        }

        return `
            <div style="background: #f8fafc; border-radius: 10px; padding: 8px 11px; border: 1px solid #e2e8f0; margin-top: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
                    <div style="display: flex; align-items: center; gap: 7px; font-weight: 800; font-size: 12px; color: #0f172a; min-width: 0;">
                        <span style="width: 11px; height: 11px; border-radius: 50%; background: ${dotColor}; border: 1.5px solid ${dotColor === '#f8fafc' ? '#cbd5e1' : dotColor}; flex-shrink: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.15);"></span>
                        <span style="white-space: normal; word-break: break-word;">${c.name}</span>
                    </div>
                    <span style="background: #dcfce7; color: #15803d; font-weight: 800; font-size: 11px; padding: 2px 9px; border-radius: 12px; border: 1px solid #86efac; white-space: nowrap; flex-shrink: 0;">${c.qty}</span>
                </div>
                ${branchChipsHtml}
            </div>
        `;
    }).join('');

    const searchKeyword = encodeURIComponent(title.split(' ')[0] || '');
    const colorsSummaryText = colorSections.map(c => `${c.name} (${c.qty})`).join(', ');

    return `
        <div style="background: #ffffff; border: 1.5px solid #e2e8f0; border-radius: 14px; padding: 12px 14px; margin-bottom: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding-bottom: 9px; border-bottom: 1px solid #f1f5f9; margin-bottom: 8px;">
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 900; font-size: 13px; color: #0f172a; line-height: 1.35; margin-bottom: 4px; word-break: break-word;">${title}</div>
                    ${totalQty ? `
                        <span style="background: #fee2e2; color: #99001c; font-size: 10.5px; font-weight: 800; padding: 2px 9px; border-radius: 12px; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap; border: 1px solid #fecdd3;">
                            <i class="fa-solid fa-circle-check" style="color: #16a34a;"></i> ${totalQty} Ready
                        </span>
                    ` : ''}
                </div>
                <img src="${prefix}assets/img/mobil/${carImg}" style="width: 80px; height: 50px; object-fit: contain; flex-shrink: 0; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.12));" alt="${title}" onerror="this.style.display='none'">
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 4px;">
                ${colorsHtml}
            </div>

            <div style="margin-top: 9px; padding-top: 8px; border-top: 1px dashed #e2e8f0; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 5px;">
                <button onclick="shareAiStockToWhatsApp('${title.replace(/'/g, "\\'")}', '${totalQty}', '${colorsSummaryText.replace(/'/g, "\\'")}')" style="font-size: 10.5px; font-weight: 800; color: #15803d; text-decoration: none; padding: 4px 9px; border-radius: 7px; background: #f0fdf4; border: 1px solid #86efac; display: inline-flex; align-items: center; gap: 5px; cursor: pointer; transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'" title="Kirim penawaran stok ini ke WhatsApp Konsumen">
                    <i class="fa-brands fa-whatsapp" style="color: #16a34a; font-size: 12px;"></i> Kirim WA
                </button>
                <a href="${prefix}pages/inventory.html" style="font-size: 10.5px; font-weight: 800; color: #0284c7; text-decoration: none; padding: 4px 9px; border-radius: 7px; background: #f0f9ff; border: 1px solid #bae6fd; display: inline-flex; align-items: center; gap: 5px; transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fa-solid fa-boxes-stacked"></i> Katalog
                </a>
                <a href="${prefix}pages/spk.html" style="font-size: 10.5px; font-weight: 800; color: #99001c; text-decoration: none; padding: 4px 9px; border-radius: 7px; background: #fff1f2; border: 1px solid #fecdd3; display: inline-flex; align-items: center; gap: 5px; transition: transform 0.15s;" onmouseover="this.style.transform='translateY(-1px)'" onmouseout="this.style.transform='translateY(0)'">
                    <i class="fa-solid fa-clipboard-check"></i> SPK
                </a>
            </div>
        </div>
    `;
}

function shareAiStockToWhatsApp(title, qty, details) {
    let msg = `*INFO LIVE STOK TOYOTA - TUNAS TOYOTA*\n\n`;
    msg += `Halo Bapak/Ibu,\nBerikut informasi update ketersediaan unit *${title}*:\n`;
    msg += `• Ketersediaan: *${qty} Ready Stock*\n`;
    if (details) {
        msg += `• Warna Ready: ${details}\n`;
    }
    msg += `\nUnit ready siap proses SPK & pengiriman. Jika berminat, bisa segera saya amankan unitnya ya Pak/Bu 🙏\n\n`;
    msg += `_Sales Consultant Tunas Toyota_`;
    
    const waUrl = 'https://wa.me/?text=' + encodeURIComponent(msg);
    window.open(waUrl, '_blank');
}

function parseMarkdownToHtml(md) {
    if (!md) return '';

    const isRoot = !window.location.pathname.includes('/pages/') && !window.location.pathname.includes('/pages_spv/') && !window.location.pathname.includes('/pages_kacab/');
    const prefix = isRoot ? '' : '../';

    let text = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // If text contains 📌 or ###VAR_START, parse into cards!
    if (text.includes('📌') || text.includes('###VAR_START')) {
        let parts = text.split(/(?=###VAR_START|📌)/g);
        let resultHtml = '';

        parts.forEach(part => {
            part = part.trim();
            if (!part) return;

            if (part.includes('📌') || part.includes('###VAR_START')) {
                let title = '';
                let totalQty = '';

                let partLines = part.split('\n');
                for (let pLine of partLines) {
                    pLine = pLine.trim();
                    if (pLine.includes('📌')) {
                        let cleanPin = pLine.replace(/^.*?📌\s*/, '').replace(/###VAR_START:[^#]+###/g, '').trim();
                        let pinParts = cleanPin.split('•');
                        if (pinParts.length > 0) {
                            title = pinParts[0].replace(/\*\*/g, '').replace(/\*/g, '').trim();
                        }
                        if (pinParts.length > 1) {
                            totalQty = pinParts[1].replace(/\*\*/g, '').replace(/\*/g, '').trim();
                        }
                        break;
                    }
                }
                if (!title) {
                    let varStartMatch = part.match(/###VAR_START:([^:]+):/);
                    if (varStartMatch) {
                        title = varStartMatch[1].trim();
                    }
                }
                if (!title) title = 'Toyota';

                resultHtml += buildVariantCardHtml(title, totalQty, part, prefix);
            } else {
                // Header block
                let cleanHead = part.replace(/\*\*/g, '').replace(/─+/g, '').trim();
                let headMatch = cleanHead.match(/🚗\s*(.*?)(?:\s*\(Total:\s*(\d+\s*Unit)\s*\))?$/im);

                if (headMatch) {
                    let titleStr = headMatch[1] ? headMatch[1].trim() : 'Stok Ready Toyota';
                    let countStr = headMatch[2] ? headMatch[2].trim() : '';

                    resultHtml += `
                        <div style="background: linear-gradient(135deg, #1e293b, #0f172a); color: white; border-radius: 10px; padding: 10px 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; gap: 8px;">
                            <div style="display: flex; align-items: center; gap: 6px; font-weight: 800; font-size: 12.5px; min-width: 0;">
                                <span style="font-size: 16px;">🚗</span>
                                <span style="word-break: break-word;">${titleStr}</span>
                            </div>
                            ${countStr ? `
                                <span style="background: rgba(255,255,255,0.18); border: 1px solid rgba(255,255,255,0.25); color: #ffffff; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 15px; white-space: nowrap; flex-shrink: 0;">
                                    ${countStr}
                                </span>
                            ` : ''}
                        </div>
                    `;
                } else {
                    let headerHtml = part
                        .replace(/&/g, "&amp;")
                        .replace(/</g, "&lt;")
                        .replace(/>/g, "&gt;")
                        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                        .replace(/\*(.*?)\*/g, "<em>$1</em>")
                        .replace(/─+/g, "")
                        .replace(/\n+/g, "<br>");
                    resultHtml += headerHtml;
                }
            }
        });

        return resultHtml;
    }

    // Default markdown parser
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/`([^`]+)`/g, "<code style='background:#f1f5f9; padding:2px 5px; border-radius:4px; font-size:11px;'>$1</code>")
        .replace(/\n\n/g, "<br><br>")
        .replace(/\n/g, "<br>");
}

function escapeQuotes(str) {
    return (str || '')
        .replace(/\\/g, '\\\\')
        .replace(/`/g, '\\`')
        .replace(/\$/g, '\\$')
        .replace(/"/g, '&quot;');
}

function copyAiScriptText(text) {
    navigator.clipboard.writeText(text);
    if (typeof window.alert === 'function') {
        window.alert('Teks berhasil disalin!');
    } else {
        alert('Teks berhasil disalin!');
    }
}

function shareAiScriptWA(text) {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

// Auto Inject Widget On Page Load
document.addEventListener('DOMContentLoaded', () => {
    injectFloatingAiWidget();
    initCopilotPage();
});

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    injectFloatingAiWidget();
    initCopilotPage();
}
