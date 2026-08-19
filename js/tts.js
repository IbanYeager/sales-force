/* js/tts.js */

const wordPools = {
    mobil: [
        { answer: 'AGYA', clue: 'LCGC Hatchback Toyota' },
        { answer: 'AYLA', clue: 'Kembaran Agya dari Daihatsu' },
        { answer: 'BRIO', clue: 'Hatchback andalan Honda' },
        { answer: 'JAZZ', clue: 'Hatchback legendaris Honda yang sudah discontinue' },
        { answer: 'HRV', clue: 'Compact SUV populer dari Honda' },
        { answer: 'CRV', clue: 'Medium SUV Honda' },
        { answer: 'INNOVA', clue: 'Mobil keluarga legendaris Toyota' },
        { answer: 'AVANZA', clue: 'Julukan mobil sejuta umat' },
        { answer: 'XPANDER', clue: 'LMPV Mitsubishi dengan desain dinamis' },
        { answer: 'PAJERO', clue: 'SUV tangguh andalan Mitsubishi' },
        { answer: 'FORTUNER', clue: 'SUV ladder frame Toyota' },
        { answer: 'TERIOS', clue: 'Low SUV andalan Daihatsu' },
        { answer: 'RUSH', clue: 'Kembaran Daihatsu Terios' },
        { answer: 'BRV', clue: 'Low SUV dari Honda' },
        { answer: 'ALPHARD', clue: 'MPV Premium Toyota' },
        { answer: 'PALISADE', clue: 'SUV Premium dari Hyundai' },
        { answer: 'STARGAZER', clue: 'LMPV Hyundai pesaing Xpander' },
        { answer: 'RUBICON', clue: 'Tipe Jeep Wrangler yang ikonik' },
        { answer: 'CIVIC', clue: 'Sedan legendaris Honda' },
        { answer: 'COROLLA', clue: 'Sedan terlaris Toyota di dunia' },
        { answer: 'CAMRY', clue: 'Sedan premium menengah Toyota' },
        { answer: 'ACCORD', clue: 'Sedan premium Honda pesaing Camry' },
        { answer: 'CRETA', clue: 'Compact SUV Hyundai buatan Indonesia' },
        { answer: 'VELOZ', clue: 'LMPV Toyota kasta tertinggi' },
        { answer: 'GALLARDO', clue: 'Baby Lambo bermesin V10 yang sangat populer' },
        { answer: 'PAGANI', clue: 'Hypercar eksotis dari Italia buatan Horacio' },
        { answer: 'IGNIS', clue: 'Urban SUV mungil Suzuki bergaya retro' },
        { answer: 'NISSAN', clue: 'Pabrikan asal Jepang pembuat mesin VR38DETT' },
        { answer: 'DATSUN', clue: 'Merek mobil legendaris yang sempat dihidupkan untuk LCGC' },
        { answer: 'CAMARO', clue: 'Muscle car ikonik wujud asli Bumblebee' },
        { answer: 'DEFENDER', clue: 'SUV tangguh dari Land Rover berbentuk kotak' },
        { answer: 'FERRARI', clue: 'Pabrikan Kuda Jingkrak dari Maranello' },
        { answer: 'CARRERA', clue: 'Salah satu tipe Porsche 911' },
        { answer: 'VOLVO', clue: 'Merek asal Swedia pelopor sabuk pengaman 3 titik' },
        { answer: 'ROVER', clue: 'Brand asal Inggris (biasa diakhiri dengan nama model Evoque, dll)' },
        { answer: 'VELAR', clue: 'Varian Range Rover yang sangat elegan' },
        { answer: 'SUPRA', clue: 'Mobil sport ikonik Toyota berwarna khas oranye' },
        { answer: 'SKYLINE', clue: 'Sedan sport Nissan bermesin RB26DETT' },
        { answer: 'MUSTANG', clue: 'Pony car legendaris dari Ford' },
        { answer: 'XENIA', clue: 'Kembaran Avanza buatan Daihatsu' },
        { answer: 'MOBILIO', clue: 'LMPV dari Honda' },
        { answer: 'ERTIGA', clue: 'LMPV dari Suzuki' },
        { answer: 'BALENO', clue: 'Hatchback andalan Suzuki saat ini' },
        { answer: 'SWIFT', clue: 'Hatchback lincah Suzuki yang fun to drive' },
        { answer: 'YARIS', clue: 'Hatchback Toyota pesaing Honda Jazz' }
    ],
    umum: [
        { answer: 'BUMI', clue: 'Planet ketiga dari matahari' },
        { answer: 'BULAN', clue: 'Satelit alami bumi' },
        { answer: 'MATAHARI', clue: 'Pusat tata surya kita' },
        { answer: 'APEL', clue: 'Buah yang jatuh di kepala Newton' },
        { answer: 'PISANG', clue: 'Buah berwarna kuning favorit monyet' },
        { answer: 'ANGGUR', clue: 'Buah ungu kecil bergerombol' },
        { answer: 'JAKARTA', clue: 'Ibu kota negara Indonesia' },
        { answer: 'KALIMANTAN', clue: 'Pulau terbesar di Indonesia' },
        { answer: 'BALI', clue: 'Pulau dewata' },
        { answer: 'LOMBOK', clue: 'Pulau tetangga Bali' },
        { answer: 'KUCING', clue: 'Hewan peliharaan mengeong' },
        { answer: 'CICAK', clue: 'Reptil kecil di dinding' },
        { answer: 'KAMBING', clue: 'Hewan pemakan rumput mengembik' },
        { answer: 'GAJAH', clue: 'Hewan darat berbelalai' },
        { answer: 'OXYGEN', clue: 'Gas yang kita hirup (Inggris)' },
        { answer: 'HIDROGEN', clue: 'Unsur kimia teringan' },
        { answer: 'NITROGEN', clue: 'Gas terbanyak di atmosfer bumi' },
        { answer: 'HELIUM', clue: 'Gas untuk balon terbang' },
        { answer: 'KARBON', clue: 'Unsur utama dalam batu bara' },
        { answer: 'EINSTEIN', clue: 'Ilmuwan penemu teori relativitas' },
        { answer: 'NEWTON', clue: 'Ilmuwan penemu hukum gravitasi' },
        { answer: 'TESLA', clue: 'Penemu arus bolak-balik (AC)' },
        { answer: 'EDISON', clue: 'Penemu lampu pijar komersial' },
        { answer: 'GALILEO', clue: 'Bapak ilmu pengetahuan modern' },
        { answer: 'MITOKONDRIA', clue: 'Organel sel yang berfungsi sebagai pembangkit energi (The powerhouse of the cell)' },
        { answer: 'KARTINI', clue: 'Pahlawan nasional pelopor kebangkitan perempuan pribumi' },
        { answer: 'TSUNAMI', clue: 'Gelombang laut dahsyat akibat gempa bumi di bawah laut' },
        { answer: 'BUNGA', clue: 'Alat perkembangbiakan pada tumbuhan' },
        { answer: 'MESIR', clue: 'Negara yang beribukota Kairo dan terkenal dengan Piramida' },
        { answer: 'CAIRO', clue: 'Ibu kota Mesir (Dalam ejaan internasional)' },
        { answer: 'AFRIKA', clue: 'Benua terbesar kedua di dunia setelah Asia' },
        { answer: 'KLAUSTROFOBIA', clue: 'Fobia atau ketakutan berlebihan terhadap ruang sempit atau tertutup' },
        { answer: 'LITOSFER', clue: 'Lapisan kulit bumi yang paling luar' },
        { answer: 'TROMBOSIT', clue: 'Keping darah yang berperan dalam proses pembekuan darah' },
        { answer: 'BIOKIMIA', clue: 'Cabang ilmu yang mempelajari proses kimia dalam tubuh makhluk hidup' },
        { answer: 'REPTIL', clue: 'Kelompok hewan vertebrata berdarah dingin dan bersisik' },
        { answer: 'GALAXY', clue: 'Kumpulan bintang-bintang di angkasa luar' },
        { answer: 'SATURNUS', clue: 'Planet bercincin indah' },
        { answer: 'ANTARTIKA', clue: 'Benua es di kutub selatan' },
        { answer: 'ANDROMEDA', clue: 'Galaksi tetangga Bima Sakti' },
        { answer: 'PANDEMI', clue: 'Wabah penyakit global' },
        { answer: 'OSTEOPOROSIS', clue: 'Penyakit tulang keropos' },
        { answer: 'SOCRATES', clue: 'Filsuf Yunani kuno yang sangat terkenal' },
        { answer: 'JANTUNG', clue: 'Organ pemompa darah' },
        { answer: 'ALBINO', clue: 'Kelainan genetik tanpa pigmen warna tubuh' },
        { answer: 'ASTRONOT', clue: 'Orang yang pergi ke luar angkasa' },
        { answer: 'ESKIMO', clue: 'Penduduk asli wilayah kutub utara' },
        { answer: 'ASBES', clue: 'Bahan atap rumah yang tahan api' },
        { answer: 'SIMBIOSIS', clue: 'Hubungan timbal balik antar makhluk hidup' },
        { answer: 'MELANIN', clue: 'Zat pemberi warna pada kulit dan rambut' },
        { answer: 'GENETIKA', clue: 'Ilmu tentang pewarisan sifat makhluk hidup' }
    ]
};

let currentCategory = 'mobil';
let currentDifficulty = 'mudah';
let gridMap = {};

document.addEventListener('DOMContentLoaded', () => {
    initTTS(currentCategory, currentDifficulty);
});

function switchCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.tts-cat-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('cat-' + cat);
    if (btn) btn.classList.add('active');
    initTTS(currentCategory, currentDifficulty);
}

function switchDifficulty(diff) {
    currentDifficulty = diff;
    document.querySelectorAll('.tts-diff-btn').forEach(btn => btn.classList.remove('active'));
    const btn = document.getElementById('diff-' + diff);
    if (btn) btn.classList.add('active');
    initTTS(currentCategory, currentDifficulty);
}

function generateCrossword(pool, targetCount) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    
    let board = [];
    let placedWords = [];
    let minRow = 0, maxRow = 0, minCol = 0, maxCol = 0;

    function tryPlaceWord(wordObj, id) {
        const word = wordObj.answer;
        if (placedWords.length === 0) {
            placedWords.push({id, answer: word, row: 0, col: 0, dir: 'h', clue: wordObj.clue});
            for(let i=0; i<word.length; i++) {
                board.push({r: 0, c: i, char: word[i], h: true, v: false});
            }
            maxCol = word.length - 1;
            return true;
        }

        let bestScore = -1;
        let bestPlacement = null;

        for (let i = 0; i < word.length; i++) {
            const char = word[i];
            
            for (const cell of board) {
                if (cell.char === char) {
                    if (cell.h && !cell.v) {
                        const rStart = cell.r - i;
                        const cStart = cell.c;
                        if (canPlace(word, rStart, cStart, 'v')) {
                            const score = calculateScore(word, rStart, cStart, 'v');
                            if (score > bestScore) {
                                bestScore = score;
                                bestPlacement = {r: rStart, c: cStart, dir: 'v'};
                            }
                        }
                    }
                    if (cell.v && !cell.h) {
                        const rStart = cell.r;
                        const cStart = cell.c - i;
                        if (canPlace(word, rStart, cStart, 'h')) {
                            const score = calculateScore(word, rStart, cStart, 'h');
                            if (score > bestScore) {
                                bestScore = score;
                                bestPlacement = {r: rStart, c: cStart, dir: 'h'};
                            }
                        }
                    }
                }
            }
        }

        if (bestPlacement) {
            placedWords.push({id, answer: word, row: bestPlacement.r, col: bestPlacement.c, dir: bestPlacement.dir, clue: wordObj.clue});
            for(let i=0; i<word.length; i++) {
                const rr = bestPlacement.r + (bestPlacement.dir === 'v' ? i : 0);
                const cc = bestPlacement.c + (bestPlacement.dir === 'h' ? i : 0);
                
                minRow = Math.min(minRow, rr);
                maxRow = Math.max(maxRow, rr);
                minCol = Math.min(minCol, cc);
                maxCol = Math.max(maxCol, cc);

                let existing = board.find(b => b.r === rr && b.c === cc);
                if (existing) {
                    if (bestPlacement.dir === 'h') existing.h = true;
                    if (bestPlacement.dir === 'v') existing.v = true;
                } else {
                    board.push({
                        r: rr, c: cc, char: word[i],
                        h: bestPlacement.dir === 'h',
                        v: bestPlacement.dir === 'v'
                    });
                }
            }
            return true;
        }
        return false;
    }

    function canPlace(word, r, c, dir) {
        for (let i = 0; i < word.length; i++) {
            const rr = r + (dir === 'v' ? i : 0);
            const cc = c + (dir === 'h' ? i : 0);

            let existing = board.find(b => b.r === rr && b.c === cc);
            if (existing) {
                if (existing.char !== word[i]) return false; 
                if (dir === 'h' && existing.h) return false; 
                if (dir === 'v' && existing.v) return false; 
            } else {
                if (dir === 'h') {
                    if (board.find(b => b.r === rr - 1 && b.c === cc)) return false;
                    if (board.find(b => b.r === rr + 1 && b.c === cc)) return false;
                } else {
                    if (board.find(b => b.r === rr && b.c === cc - 1)) return false;
                    if (board.find(b => b.r === rr && b.c === cc + 1)) return false;
                }
            }
        }
        
        if (dir === 'h') {
            if (board.find(b => b.r === r && b.c === c - 1)) return false;
            if (board.find(b => b.r === r && b.c === c + word.length)) return false;
        } else {
            if (board.find(b => b.r === r - 1 && b.c === c)) return false;
            if (board.find(b => b.r === r + word.length && b.c === c)) return false;
        }
        return true;
    }

    function calculateScore(word, r, c, dir) {
        let score = 0;
        for (let i = 0; i < word.length; i++) {
            const rr = r + (dir === 'v' ? i : 0);
            const cc = c + (dir === 'h' ? i : 0);
            if (board.find(b => b.r === rr && b.c === cc)) {
                score++;
            }
        }
        return score; 
    }

    let wordId = 1;
    for (let wordObj of shuffled) {
        if (placedWords.length >= targetCount) break;
        if (tryPlaceWord(wordObj, wordId)) {
            wordId++;
        }
    }

    const cols = maxCol - minCol + 1;
    const rows = maxRow - minRow + 1;

    let finalWords = placedWords.map(w => ({
        id: w.id,
        answer: w.answer,
        row: w.row - minRow,
        col: w.col - minCol,
        dir: w.dir,
        clue: w.clue
    }));
    
    finalWords.sort((a,b) => (a.row * 1000 + a.col) - (b.row * 1000 + b.col));
    finalWords.forEach((w, i) => w.id = i+1);

    return { cols, rows, words: finalWords };
}

function initTTS(cat, diff) {
    const pool = wordPools[cat] || wordPools.mobil;
    let targetCount = 5;
    if (diff === 'sedang') targetCount = 10;
    if (diff === 'sulit') targetCount = 20;

    let bestData = null;
    for(let attempt = 0; attempt < 5; attempt++) {
        let testData = generateCrossword(pool, targetCount);
        if (!bestData || testData.words.length > bestData.words.length) {
            bestData = testData;
        }
        if (bestData.words.length >= targetCount) break;
    }

    const data = bestData;
    const gridEl = document.getElementById('ttsGrid');
    if (!gridEl) return;
    gridEl.innerHTML = '';
    
    if (!data || data.words.length === 0) {
        gridEl.innerHTML = '<div style="color:#64748b; padding:20px;">Gagal memuat teka-teki. Silakan coba lagi.</div>';
        return;
    }

    gridEl.style.gridTemplateColumns = `repeat(${data.cols}, var(--cell-size))`;
    gridEl.style.gridTemplateRows = `repeat(${data.rows}, var(--cell-size))`;

    gridMap = {};
    for (let r = 0; r < data.rows; r++) {
        gridMap[r] = {};
        for (let c = 0; c < data.cols; c++) {
            gridMap[r][c] = { isActive: false, char: '', numbers: [] };
        }
    }

    data.words.forEach(word => {
        let r = word.row;
        let c = word.col;
        
        gridMap[r][c].numbers.push(word.id);

        for (let i = 0; i < word.answer.length; i++) {
            if (word.dir === 'h') {
                gridMap[r][c + i].isActive = true;
                gridMap[r][c + i].char = word.answer[i];
            } else {
                gridMap[r + i][c].isActive = true;
                gridMap[r + i][c].char = word.answer[i];
            }
        }
    });

    for (let r = 0; r < data.rows; r++) {
        for (let c = 0; c < data.cols; c++) {
            const cellData = gridMap[r][c];
            const cellDiv = document.createElement('div');
            cellDiv.className = 'tts-cell' + (cellData.isActive ? ' active' : ' empty');
            
            if (cellData.isActive) {
                if (cellData.numbers.length > 0) {
                    const numDiv = document.createElement('div');
                    numDiv.className = 'tts-number';
                    numDiv.textContent = cellData.numbers[0]; 
                    cellDiv.appendChild(numDiv);
                }

                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.className = 'tts-input';
                input.dataset.row = r;
                input.dataset.col = c;
                input.dataset.answer = cellData.char;
                
                input.addEventListener('input', handleInput);
                input.addEventListener('keydown', handleKeydown);
                input.addEventListener('focus', function() { this.select(); });

                cellDiv.appendChild(input);
            }
            gridEl.appendChild(cellDiv);
        }
    }

    renderClues(data.words);
}

function renderClues(words) {
    const listH = document.getElementById('cluesMendatar');
    const listV = document.getElementById('cluesMenurun');
    if (!listH || !listV) return;
    
    listH.innerHTML = '';
    listV.innerHTML = '';

    words.forEach(word => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${word.id}.</strong> <span>${word.clue}</span>`;
        if (word.dir === 'h') {
            listH.appendChild(li);
        } else {
            listV.appendChild(li);
        }
    });
}

function handleInput(e) {
    const input = e.target;
    input.value = input.value.toUpperCase();
    input.classList.remove('correct', 'incorrect');
    
    if (input.value !== '') {
        const r = parseInt(input.dataset.row);
        const c = parseInt(input.dataset.col);
        
        let nextInput = document.querySelector(`.tts-input[data-row="${r}"][data-col="${c+1}"]`);
        if (!nextInput) {
            nextInput = document.querySelector(`.tts-input[data-row="${r+1}"][data-col="${c}"]`);
        }
        
        if (nextInput) nextInput.focus();
    }
}

function handleKeydown(e) {
    const input = e.target;
    const r = parseInt(input.dataset.row);
    const c = parseInt(input.dataset.col);

    if (e.key === 'Backspace' && input.value === '') {
        let prevInput = document.querySelector(`.tts-input[data-row="${r}"][data-col="${c-1}"]`);
        if (!prevInput) {
            prevInput = document.querySelector(`.tts-input[data-row="${r-1}"][data-col="${c}"]`);
        }
        if (prevInput) {
            prevInput.focus();
            prevInput.value = '';
            prevInput.classList.remove('correct', 'incorrect');
        }
    } else if (e.key === 'ArrowRight') {
        let next = document.querySelector(`.tts-input[data-row="${r}"][data-col="${c+1}"]`);
        if (next) next.focus();
    } else if (e.key === 'ArrowLeft') {
        let prev = document.querySelector(`.tts-input[data-row="${r}"][data-col="${c-1}"]`);
        if (prev) prev.focus();
    } else if (e.key === 'ArrowDown') {
        let next = document.querySelector(`.tts-input[data-row="${r+1}"][data-col="${c}"]`);
        if (next) next.focus();
    } else if (e.key === 'ArrowUp') {
        let prev = document.querySelector(`.tts-input[data-row="${r-1}"][data-col="${c}"]`);
        if (prev) prev.focus();
    }
}

function checkAnswers() {
    const inputs = document.querySelectorAll('.tts-input');
    let allCorrect = true;
    let anyFilled = false;

    inputs.forEach(input => {
        if (input.value) {
            anyFilled = true;
            if (input.value === input.dataset.answer) {
                input.classList.add('correct');
                input.classList.remove('incorrect');
            } else {
                input.classList.add('incorrect');
                input.classList.remove('correct');
                allCorrect = false;
            }
        } else {
            allCorrect = false;
        }
    });

    if (allCorrect && anyFilled) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Luar Biasa!',
                text: 'Semua jawaban Anda benar.',
                icon: 'success',
                confirmButtonText: 'Tutup'
            });
        } else {
            alert('Luar Biasa! Semua jawaban benar.');
        }
    } else if (anyFilled) {
        // partial check
    } else {
        if (typeof Swal !== 'undefined') {
            Swal.fire('Oops', 'Silakan isi jawaban terlebih dahulu', 'warning');
        } else {
            alert('Silakan isi jawaban terlebih dahulu');
        }
    }
}
