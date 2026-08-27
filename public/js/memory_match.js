// ══════════════════════════════════════════════════════
//  TOYOTA MEMORY MATCH ENGINE
//  Features: 3D Card Flip, Model-Feature Pairs Matching,
//  Streak Combo Multipliers, Educational Details on Match
// ══════════════════════════════════════════════════════

const cardsGrid = document.getElementById('cardsGrid');
const dispPairs = document.getElementById('dispPairs');
const dispMoves = document.getElementById('dispMoves');
const dispTimer = document.getElementById('dispTimer');
const dispStreak = document.getElementById('dispStreak');
const matchModal = document.getElementById('matchModal');
const modalSummary = document.getElementById('modalSummary');

// Pair Definitions (Car Model <-> Key Feature)
const CARD_PAIRS = [
  {
    id: 1,
    model: { title: 'Innova Zenix HEV', icon: '🚗', type: 'model' },
    feature: { title: 'Panoramic Roof & EV Mode', icon: '☀️', type: 'feature' }
  },
  {
    id: 2,
    model: { title: 'Toyota GR Supra', icon: '🏎️', type: 'model' },
    feature: { title: '382 HP & 8-Speed Paddle', icon: '⚡', type: 'feature' }
  },
  {
    id: 3,
    model: { title: 'All New Alphard', icon: '🚐', type: 'model' },
    feature: { title: 'Executive Lounge Ottoman', icon: '👑', type: 'feature' }
  },
  {
    id: 4,
    model: { title: 'Hilux GR Sport', icon: '🛻', type: 'model' },
    feature: { title: 'Heavy Duty 4x4 & Diff Lock', icon: '⛰️', type: 'feature' }
  },
  {
    id: 5,
    model: { title: 'Yaris Cross HEV', icon: '🚙', type: 'model' },
    feature: { title: 'Toyota Safety Sense 3.0', icon: '🛡️', type: 'feature' }
  },
  {
    id: 6,
    model: { title: 'Fortuner 2.8 GR', icon: '🚘', type: 'model' },
    feature: { title: '1GD-FTV 500 Nm Torsi', icon: '💪', type: 'feature' }
  },
  {
    id: 7,
    model: { title: 'Toyota bZ4X BEV', icon: '🔋', type: 'model' },
    feature: { title: 'Pure Electric Range 500km', icon: '🔌', type: 'feature' }
  },
  {
    id: 8,
    model: { title: 'Corolla Cross HEV', icon: '✨', type: 'model' },
    feature: { title: 'TNGA & T-Intouch Radar', icon: '🛰️', type: 'feature' }
  }
];

let cardsDeck = [];
let flippedCards = [];
let matchedPairs = 0;
let movesCount = 0;
let streakCount = 0;
let gameStartTime = 0;
let timerInterval = null;
let isLocked = false;

function initMemoryGame() {
  cardsDeck = [];
  flippedCards = [];
  matchedPairs = 0;
  movesCount = 0;
  streakCount = 0;
  isLocked = false;
  matchModal.classList.remove('show');

  // Build deck with pair items
  CARD_PAIRS.forEach(pair => {
    cardsDeck.push({ pairId: pair.id, ...pair.model });
    cardsDeck.push({ pairId: pair.id, ...pair.feature });
  });

  // Shuffle Deck (Fisher-Yates)
  for (let i = cardsDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cardsDeck[i], cardsDeck[j]] = [cardsDeck[j], cardsDeck[i]];
  }

  // Render Grid HTML
  renderCardsGrid();

  // Reset HUD
  dispPairs.innerText = `0 / ${CARD_PAIRS.length}`;
  dispMoves.innerText = '0';
  dispStreak.innerText = '0x';
  dispTimer.innerText = '00:00';

  // Start Timer
  gameStartTime = performance.now();
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsedSec = Math.floor((performance.now() - gameStartTime) / 1000);
    const m = String(Math.floor(elapsedSec / 60)).padStart(2, '0');
    const s = String(elapsedSec % 60).padStart(2, '0');
    dispTimer.innerText = `${m}:${s}`;
  }, 1000);
}

function renderCardsGrid() {
  cardsGrid.innerHTML = '';
  cardsDeck.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card-item';
    cardEl.dataset.index = index;
    cardEl.dataset.pairId = card.pairId;

    cardEl.innerHTML = `
      <div class="card-back"></div>
      <div class="card-front">
        <div class="icon">${card.icon}</div>
        <div class="title">${card.title}</div>
        <span class="badge-type ${card.type}">${card.type === 'model' ? 'Mobil' : 'Fitur'}</span>
      </div>
    `;

    cardEl.onclick = () => onCardClick(cardEl, index);
    cardsGrid.appendChild(cardEl);
  });
}

function onCardClick(cardEl, index) {
  if (isLocked) return;
  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) return;

  cardEl.classList.add('flipped');
  flippedCards.push({ el: cardEl, data: cardsDeck[index] });

  if (flippedCards.length === 2) {
    movesCount++;
    dispMoves.innerText = movesCount;
    checkCardPairMatch();
  }
}

function checkCardPairMatch() {
  isLocked = true;
  const [c1, c2] = flippedCards;

  if (c1.data.pairId === c2.data.pairId) {
    // Matched!
    setTimeout(() => {
      c1.el.classList.add('matched');
      c2.el.classList.add('matched');
      matchedPairs++;
      streakCount++;
      dispPairs.innerText = `${matchedPairs} / ${CARD_PAIRS.length}`;
      dispStreak.innerText = `${streakCount}x 🔥`;
      flippedCards = [];
      isLocked = false;

      if (matchedPairs === CARD_PAIRS.length) {
        completeMemoryGame();
      }
    }, 300);
  } else {
    // Mismatch!
    streakCount = 0;
    dispStreak.innerText = '0x';
    setTimeout(() => {
      c1.el.classList.remove('flipped');
      c2.el.classList.remove('flipped');
      flippedCards = [];
      isLocked = false;
    }, 900);
  }
}

function completeMemoryGame() {
  if (timerInterval) clearInterval(timerInterval);
  modalSummary.innerText = `Selesai dalam ${dispTimer.innerText} dengan ${movesCount} langkah!`;
  matchModal.classList.add('show');
}

// Start Game
initMemoryGame();
