// ═══════════════════════════════════════════════
//  TEBAK OTOMOTIF TOYOTA — Trivia Game Controller
// ═══════════════════════════════════════════════

const questions = [
  {
    level: 1,
    category: "MOBIL",
    question: "Apa nama MPV Toyota bergaya pintu geser (sliding door) yang sangat populer di Indonesia?",
    options: ["Toyota Avanza", "Toyota Sienta", "Toyota Calya", "Toyota Kijang Innova"],
    answerIndex: 1
  },
  {
    level: 2,
    category: "MOBIL",
    question: "Model SUV Toyota berbadan bongsor yang menggunakan sasis tangga (ladder-frame) adalah...",
    options: ["Toyota Fortuner", "Toyota Corolla Cross", "Toyota Raize", "Toyota C-HR"],
    answerIndex: 0
  },
  {
    level: 3,
    category: "TEKNIS MESIN",
    question: "Teknologi mesin Toyota yang secara dinamis mengatur waktu buka-tutup katup hisap/buang disebut...",
    options: ["i-VTEC", "VVT-i", "MIVEC", "Dual Over Head Camshaft"],
    answerIndex: 1
  },
  {
    level: 4,
    category: "SERVIS TOYOTA",
    question: "Layanan purnajual resmi Toyota yang menyediakan bantuan darurat jalan raya selama 24 jam penuh disebut...",
    options: ["Toyota Service Advisor", "Toyota Mobile Service", "ERA (Emergency Roadside Assistance)", "Toyota Express Maintenance"],
    answerIndex: 2
  },
  {
    level: 5,
    category: "MOBIL SPORT",
    question: "Apa nama mobil sport legendaris Toyota hasil kolaborasi pengembangan bersama Subaru?",
    options: ["Toyota Supra GR", "Toyota Celica", "Toyota 86 / GR86", "Toyota MR2"],
    answerIndex: 2
  },
  {
    level: 6,
    category: "TEKNOLOGI",
    question: "Sistem keselamatan aktif terpadu milik Toyota yang meliputi fitur Pre-Collision System dan Lane Departure Alert disebut...",
    options: ["Toyota Smart System", "TSS (Toyota Safety Sense)", "Toyota Drive Assist", "Toyota Intelligent Safety"],
    answerIndex: 1
  },
  {
    level: 7,
    category: "PENJUALAN",
    question: "Dalam proses administrasi penjualan mobil baru, apa kepanjangan resmi dari singkatan SPK?",
    options: ["Surat Persetujuan Kredit", "Surat Pemesanan Kendaraan", "Surat Perjanjian Kontrak", "Sistem Pembelian Kendaraan"],
    answerIndex: 1
  },
  {
    level: 8,
    category: "BENGKEL",
    question: "Dokumen perintah kerja resmi dari Service Advisor kepada mekanik untuk melakukan perbaikan kendaraan di bengkel berkode...",
    options: ["PKB (Perintah Kerja Bengkel)", "SPK (Surat Perintah Kerja)", "WO (Work Order)", "Faktur Servis"],
    answerIndex: 0
  },
  {
    level: 9,
    category: "MOBIL",
    question: "Varian sporty resmi dari pabrikan Toyota yang menggantikan nama varian 'TRD Sportivo' sejak tahun 2021 adalah...",
    options: ["G Sport", "GR Sport", "Toyota Racing", "TRD Pro"],
    answerIndex: 1
  },
  {
    level: 10,
    category: "TEKNIS TRANSMISI",
    question: "Transmisi otomatis modern Toyota yang menyalurkan tenaga melalui sabuk baja (steel belt) secara halus tanpa hentakan gigi adalah...",
    options: ["Dual Clutch Transmission", "Manual Transmission", "Torque Converter AT", "CVT (Continuously Variable Transmission)"],
    answerIndex: 3
  },
  {
    level: 11,
    category: "MOBIL",
    question: "Sistem penggerak roda yang legendaris terpasang pada jajaran Toyota Land Cruiser untuk medan offroad berat berkode...",
    options: ["FWD (Front Wheel Drive)", "RWD (Rear Wheel Drive)", "AWD (All Wheel Drive)", "4WD (4-Wheel Drive)"],
    answerIndex: 3
  },
  {
    level: 12,
    category: "SERVIS TOYOTA",
    question: "Layanan servis berkala cepat yang dikerjakan langsung oleh 2 mekanik profesional secara bersamaan sehingga selesai dalam 1 jam disebut...",
    options: ["Quick Service", "Express Maintenance", "Super Service", "Priority Service"],
    answerIndex: 1
  },
  {
    level: 13,
    category: "SEJARAH TOYOTA",
    question: "Siapakah nama tokoh pendiri resmi dari Toyota Motor Corporation yang memisahkan divisi mobil dari pabrik tenun ayahnya?",
    options: ["Sakichi Toyoda", "Kiichiro Toyoda", "Akio Toyoda", "Eiji Toyoda"],
    answerIndex: 1
  },
  {
    level: 14,
    category: "TEKNIS MESIN",
    question: "Komponen sistem pengereman cakram yang berfungsi menjepit kampas rem pada piringan rotor saat pedal rem ditekan adalah...",
    options: ["Master Silinder", "Brake Booster", "Kaliper Rem (Caliper)", "Piston Rem"],
    answerIndex: 2
  },
  {
    level: 15,
    category: "PENJUALAN",
    question: "Istilah dalam penjualan mobil saat calon pembeli menyerahkan mobil bekasnya sebagai alat pembayaran uang muka mobil Toyota baru disebut...",
    options: ["Buyback", "Trade In (Tukar Tambah)", "Down Payment", "Leasing"],
    answerIndex: 1
  },
  {
    level: 16,
    category: "BENGKEL",
    question: "Fasilitas resmi dealer Toyota yang khusus melayani perbaikan bodi penyok serta pengecatan ulang berstandar pabrikan disebut...",
    options: ["Body & Paint", "Detailing & Coating", "Oven Painting", "Restoration Center"],
    answerIndex: 0
  },
  {
    level: 17,
    category: "TEKNIS MESIN",
    question: "Mesin legendaris 6 silinder inline twin-turbo berkode '2JZ-GTE' sangat populer di dunia modifikasi dan disematkan pada mobil sport...",
    options: ["Toyota Celica GT-Four", "Toyota Supra (A80)", "Toyota MR2 Spyder", "Toyota AE86 Trueno"],
    answerIndex: 1
  },
  {
    level: 18,
    category: "TEKNOLOGI",
    question: "Sistem penggerak ramah lingkungan Toyota yang memadukan mesin bensin konvensional dan motor listrik bertenaga baterai secara mandiri disebut...",
    options: ["BEV (Battery Electric Vehicle)", "FCEV (Fuel Cell Electric Vehicle)", "HEV (Hybrid Electric Vehicle)", "PHEV (Plug-in Hybrid Electric Vehicle)"],
    answerIndex: 2
  },
  {
    level: 19,
    category: "SPESIFIKASI",
    question: "Berapakah rata-rata tekanan angin ban standar (dalam PSI) yang direkomendasikan pabrikan untuk Toyota Avanza dalam kondisi muatan normal?",
    options: ["20 - 25 PSI", "28 - 30 PSI", "33 - 36 PSI", "40 - 45 PSI"],
    answerIndex: 2
  },
  {
    level: 20,
    category: "KELISTRIKAN",
    question: "Komponen kelistrikan mesin mobil yang berfungsi menghasilkan arus listrik untuk mengisi daya baterai (aki) selama mesin hidup adalah...",
    options: ["Koil Pengapian", "Alternator / Dinamo Ampere", "Dinamo Starter", "Sekring (Fuse)"],
    answerIndex: 1
  }
];

let currentLevel = 1;

function safeParseJSON(key, defaultValue) {
  try {
    const val = localStorage.getItem(key);
    if (!val || val === "undefined" || val === "null") return defaultValue;
    const parsed = JSON.parse(val);
    return parsed !== null ? parsed : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

let completedLevels = safeParseJSON('tebakToyotaCompleted', []);
if (!Array.isArray(completedLevels)) completedLevels = [];

let lives = safeParseJSON('tebakToyotaLives', 3);
if (typeof lives !== 'number' || isNaN(lives)) lives = 3;

let questionOrder = safeParseJSON('tebakToyotaOrder', null);
if (!Array.isArray(questionOrder) || questionOrder.length !== 20) {
  questionOrder = generateQuestionOrder();
}

function generateQuestionOrder() {
  let order = Array.from({ length: 20 }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  localStorage.setItem('tebakToyotaOrder', JSON.stringify(order));
  return order;
}

function shuffleArray(array) {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const lobbyView = document.getElementById('lobbyView');
const gameBoard = document.getElementById('gameBoard');
const levelGrid = document.getElementById('levelGrid');
const successOverlay = document.getElementById('successOverlay');
const boardTitle = document.getElementById('boardTitle');
const categoryBadge = document.getElementById('categoryBadge');
const questionCategory = document.getElementById('questionCategory');
const questionText = document.getElementById('questionText');
const optionsGrid = document.getElementById('optionsGrid');
const successTitle = document.getElementById('successTitle');
const successMessage = document.getElementById('successMessage');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const successIcon = document.getElementById('successIcon');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const statCompleted = document.getElementById('statCompleted');
const statRemaining = document.getElementById('statRemaining');
const statPercent = document.getElementById('statPercent');
const livesContainer = document.getElementById('livesContainer');

function updateLivesUI() {
  if(!livesContainer) return;
  livesContainer.innerHTML = '';
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement('i');
    heart.className = i < lives ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
    livesContainer.appendChild(heart);
  }
}

function updateLobbyStats() {
  const done = completedLevels.length;
  const pct = Math.round((done / 20) * 100);
  
  if (progressFill) progressFill.style.width = pct + '%';
  if (progressText) progressText.innerText = done + '/20';
  if (statCompleted) statCompleted.innerText = done;
  if (statRemaining) statRemaining.innerText = 20 - done;
  if (statPercent) statPercent.innerText = pct + '%';
}

function renderLobby() {
  updateLivesUI();
  if (!levelGrid) return;
  levelGrid.innerHTML = '';

  for (let i = 1; i <= 20; i++) {
    const card = document.createElement('div');
    card.className = 'level-card';
    
    const isCompleted = completedLevels.includes(i);
    const isUnlocked = i === 1 || completedLevels.includes(i - 1) || isCompleted;

    if (isCompleted) {
      card.classList.add('completed');
      card.innerHTML = `
        <span class="level-num">${i}</span>
        <i class="fa-solid fa-circle-check level-status-icon"></i>
      `;
      card.onclick = () => loadLevel(i);
    } else if (isUnlocked) {
      card.classList.add('unlocked');
      card.innerHTML = `
        <span class="level-num">${i}</span>
        <i class="fa-solid fa-play level-status-icon"></i>
      `;
      card.onclick = () => loadLevel(i);
    } else {
      card.classList.add('locked');
      card.innerHTML = `
        <span class="level-num">${i}</span>
        <i class="fa-solid fa-lock level-status-icon"></i>
      `;
    }

    levelGrid.appendChild(card);
  }

  updateLobbyStats();
}

function loadLevel(levelNum) {
  currentLevel = levelNum;
  const questionIndex = questionOrder[levelNum - 1];
  const qData = questions[questionIndex];
  if (!qData) return;

  if (boardTitle) boardTitle.innerText = `Level ${levelNum}`;
  if (categoryBadge) categoryBadge.innerText = qData.category;
  if (questionCategory) questionCategory.innerText = qData.category;
  if (questionText) questionText.innerText = qData.question;

  let optionsObj = qData.options.map((opt, idx) => ({
    text: opt,
    isCorrect: idx === qData.answerIndex
  }));
  let shuffledOptions = shuffleArray(optionsObj);

  if (optionsGrid) {
    optionsGrid.innerHTML = '';
    shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      
      const markerLetter = String.fromCharCode(65 + idx);
      btn.innerHTML = `
        <span class="option-marker">${markerLetter}</span>
        <span class="option-label">${opt.text}</span>
      `;
      
      if(opt.isCorrect) btn.dataset.correct = "true";
      btn.onclick = () => checkAnswer(opt.isCorrect, btn);
      optionsGrid.appendChild(btn);
    });
  }

  if (lobbyView) lobbyView.style.display = 'none';
  if (gameBoard) gameBoard.style.display = 'block';
}

function checkAnswer(isCorrect, clickedBtn) {
  const buttons = optionsGrid.querySelectorAll('.option-btn');
  buttons.forEach(b => b.classList.add('disabled'));

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    clickedBtn.classList.remove('disabled');
    setTimeout(() => {
      showSuccessModal();
    }, 700);
  } else {
    clickedBtn.classList.add('incorrect');
    clickedBtn.classList.remove('disabled');
    
    const correctBtn = Array.from(buttons).find(b => b.dataset.correct === "true");
    if(correctBtn) {
      setTimeout(() => {
        correctBtn.classList.add('correct');
        correctBtn.classList.remove('disabled');
      }, 400);
    }

    lives--;
    localStorage.setItem('tebakToyotaLives', lives);
    updateLivesUI();

    setTimeout(() => {
      if (lives <= 0) {
        if (window.Swal) {
          Swal.fire({
            title: 'Game Over!',
            text: 'Nyawa Anda telah habis. Permainan akan diulang dari awal.',
            icon: 'error',
            confirmButtonText: 'Mulai Ulang',
            confirmButtonColor: '#cc0000',
            allowOutsideClick: false
          }).then(() => {
            resetGameLogic();
          });
        } else {
          alert('Game Over! Nyawa Anda telah habis. Permainan diulang dari awal.');
          resetGameLogic();
        }
      } else {
        if (window.Swal) {
          Swal.fire({
            title: 'Kurang Tepat!',
            text: `Jawaban salah. Soal akan diganti! Sisa nyawa Anda: ${lives}`,
            icon: 'error',
            confirmButtonText: 'Coba Lagi',
            confirmButtonColor: '#cc0000',
            allowOutsideClick: false
          }).then(() => {
            reshuffleAndReload();
          });
        } else {
          alert(`Jawaban salah! Sisa nyawa Anda: ${lives}`);
          reshuffleAndReload();
        }
      }
    }, 1200);
  }
}

function reshuffleAndReload() {
  if (currentLevel < 20) {
    let currentIndex = currentLevel - 1;
    let currentQ = questionOrder[currentIndex];
    let remaining = questionOrder.slice(currentIndex);
    
    remaining = shuffleArray(remaining);
    if (remaining[0] === currentQ && remaining.length > 1) {
      let temp = remaining[0];
      remaining[0] = remaining[remaining.length - 1];
      remaining[remaining.length - 1] = temp;
    }
    
    questionOrder = [...questionOrder.slice(0, currentIndex), ...remaining];
    localStorage.setItem('tebakToyotaOrder', JSON.stringify(questionOrder));
  }
  loadLevel(currentLevel);
}

function spawnConfetti() {
  const colors = ['#cc0000', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7', '#f97316'];
  for (let i = 0; i < 50; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
    piece.style.animationDelay = Math.random() * 0.8 + 's';
    piece.style.width = (5 + Math.random() * 6) + 'px';
    piece.style.height = (5 + Math.random() * 6) + 'px';
    piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4000);
  }
}

function showSuccessModal() {
  const isFinalLevel = currentLevel === 20;

  if (!completedLevels.includes(currentLevel)) {
    completedLevels.push(currentLevel);
    localStorage.setItem('tebakToyotaCompleted', JSON.stringify(completedLevels));
  }

  if (isFinalLevel) {
    if (successIcon) {
      successIcon.innerHTML = '<i class="fa-solid fa-trophy"></i>';
      successIcon.style.background = 'linear-gradient(135deg, #fbbf24, #d97706)';
      successIcon.style.boxShadow = '0 6px 24px rgba(251,191,36,0.45)';
    }
    
    if (successTitle) successTitle.innerText = '🎉 Selamat!';
    if (successMessage) successMessage.innerText = 'Luar biasa! Anda telah menyelesaikan seluruh 20 tingkat kesulitan dengan sempurna. Anda adalah pakar otomotif Toyota sejati!';
    if (nextLevelBtn) nextLevelBtn.innerHTML = '<i class="fa-solid fa-flag-checkered" style="margin-right:6px;"></i>Selesai & Keluar';
    
    spawnConfetti();
  } else {
    if (successIcon) {
      successIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
      successIcon.style.background = 'linear-gradient(135deg, #22c55e, #15803d)';
      successIcon.style.boxShadow = '0 6px 20px rgba(34,197,94,0.35)';
    }
    
    if (successTitle) successTitle.innerText = 'Jawaban Benar!';
    if (successMessage) successMessage.innerText = `Kerja bagus! Level ${currentLevel} berhasil diselesaikan. Siap untuk tantangan berikutnya?`;
    if (nextLevelBtn) nextLevelBtn.innerHTML = 'Lanjut ke Level ' + (currentLevel + 1) + ' <i class="fa-solid fa-arrow-right" style="margin-left:6px;"></i>';
  }

  if (successOverlay) successOverlay.style.display = 'flex';
}

function nextLevel() {
  if (successOverlay) successOverlay.style.display = 'none';
  if (currentLevel === 20) {
    exitToLobby();
  } else {
    loadLevel(currentLevel + 1);
  }
}

function exitToLobby() {
  if (gameBoard) gameBoard.style.display = 'none';
  if (lobbyView) lobbyView.style.display = 'block';
  renderLobby();
}

function resetGameLogic() {
  completedLevels = [];
  lives = 3;
  questionOrder = generateQuestionOrder();
  
  localStorage.removeItem('tebakToyotaCompleted');
  localStorage.setItem('tebakToyotaLives', lives);
  
  exitToLobby();
}

function confirmResetProgress() {
  if (window.Swal) {
    Swal.fire({
      title: 'Ulang Kuis?',
      text: 'Semua rekor penyelesaian level Anda akan dihapus dan diulang dari level 1.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#cc0000',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Ya, Ulangi',
      cancelButtonText: 'Batal'
    }).then((result) => {
      if (result.isConfirmed) {
        resetGameLogic();
      }
    });
  } else {
    if (confirm('Ulang Kuis? Semua rekor penyelesaian level Anda akan dihapus.')) {
      resetGameLogic();
    }
  }
}

renderLobby();
