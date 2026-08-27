const myName = localStorage.getItem('namaCustomer') || 'Pengunjung_' + Math.floor(Math.random() * 1000);
const myNameEl = document.getElementById('myName');
if (myNameEl) myNameEl.textContent = myName;

let gameId = null;
let myColor = 'w';
let board = null;
let game = new Chess();
let pollInterval = null;
let lastFen = '';
let isVsComputer = false;
let currentAiLevel = 1;
let isCountdown = false;
let hasShownGameOver = false;
let waitingForOpponent = false;

// Initialize lobby
$(document).ready(function() {
    loadLobby();
    setInterval(loadLobby, 5000); // refresh lobby every 5s if not in game
});

async function loadLobby() {
    if (gameId !== null) return; // Don't refresh lobby if in game
    
    try {
        const res = await fetch('../api/api_catur.php?action=list');
        const json = await res.json();
        
        const list = document.getElementById('lobbyList');
        if (!list) return;
        list.innerHTML = '';
        
        if (json.status === 'success' && json.data.length > 0) {
            json.data.forEach(g => {
                const isMine = (g.player_white === myName || g.player_black === myName);
                list.innerHTML += `
                    <div class="lobby-card">
                        <div style="display:flex; align-items:center; gap:12px;">
                            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(g.player_white || 'P')}&background=f1f5f9" style="width:36px; height:36px; border-radius:50%;">
                            <div>
                                <span style="font-weight:800; font-size:13px;">${g.player_white || 'Menunggu...'} vs ${g.player_black || 'Menunggu...'}</span><br>
                                <span style="font-size:11px; color:var(--text-muted, #64748b);">Status: ${g.status}</span>
                            </div>
                        </div>
                        <div style="display:flex; gap:6px;">
                            ${isMine ? `<button class="btn-main" style="padding:6px 12px; font-size:11px; margin:0; background:#ef4444;" onclick="deleteGame(${g.id})">Hapus</button>` : ''}
                            <button class="btn-main" style="padding:6px 12px; font-size:11px; margin:0;" onclick="${isMine ? `rejoinGame(${g.id}, '${g.player_white === myName ? 'w' : 'b'}')` : `joinGame(${g.id})`}">${isMine ? 'Kembali' : 'Tantang'}</button>
                        </div>
                    </div>
                `;
            });
        } else {
            list.innerHTML = '<p style="text-align:center; color:var(--text-muted, #64748b); font-size:12px; padding: 20px 0;">Belum ada ruangan yang tersedia. Buat ruangan baru untuk bermain!</p>';
        }
    } catch (e) {
        console.error(e);
    }
}

let pendingGameType = null;

function prepareGame(type) {
    pendingGameType = type;
    document.getElementById('colorModal').style.display = 'flex';
}

function closeColorModal() {
    pendingGameType = null;
    document.getElementById('colorModal').style.display = 'none';
}

function confirmColor(color) {
    document.getElementById('colorModal').style.display = 'none';
    if (pendingGameType === 'multiplayer') {
        createGame(color);
    } else if (pendingGameType === 'computer') {
        startComputerGame(color);
    }
    pendingGameType = null;
}

async function createGame(color) {
    try {
        const res = await fetch('../api/api_catur.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'create', player_name: myName, color: color })
        });
        const json = await res.json();
        if (json.status === 'success') {
            gameId = json.game_id;
            myColor = color;
            startGameView(true);
        } else {
            alert(json.message || 'Gagal membuat ruang catur.');
        }
    } catch (e) {
        console.error(e);
    }
}

async function joinGame(id) {
    try {
        const res = await fetch('../api/api_catur.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ action: 'join', id: id, player_name: myName })
        });
        const json = await res.json();
        if (json.status === 'success') {
            gameId = id;
            myColor = json.color;
            startGameView();
        } else {
            alert(json.message || 'Gagal bergabung.');
        }
    } catch (e) {
        console.error(e);
    }
}

async function rejoinGame(id, color) {
    gameId = id;
    myColor = color || 'w';
    startGameView();
}

async function deleteGame(id) {
    const isConfirmed = confirm('Hapus ruang catur ini?');
    if (!isConfirmed) return;
    try {
        const res = await fetch('../api/api_catur.php', {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ id: id })
        });
        const json = await res.json();
        if (json.status === 'success') {
            loadLobby();
        } else {
            alert(json.message || 'Gagal menghapus.');
        }
    } catch (e) {
        console.error(e);
    }
}

function startComputerGame(color) {
    isVsComputer = true;
    gameId = null;
    myColor = color || 'w';
    hasShownGameOver = false;
    
    var aiLevelSelect = document.getElementById('aiLevel');
    currentAiLevel = aiLevelSelect ? parseInt(aiLevelSelect.value) : 1;
    var levelNames = {1: 'Mudah', 2: 'Sedang', 3: 'Sulit'};
    
    document.getElementById('opponentName').textContent = 'Komputer (' + levelNames[currentAiLevel] + ')';
    document.getElementById('opponentAvatar').src = `https://ui-avatars.com/api/?name=Komputer&background=f1f5f9`;
    
    document.getElementById('lobbyView').style.display = 'none';
    document.getElementById('gameView').style.display = 'block';
    
    game = new Chess();
    lastFen = '';
    initBoard();
    updateStatus();
    
    startCountdown();
}

function startGameView(isWaiting = false) {
    isVsComputer = false;
    document.getElementById('lobbyView').style.display = 'none';
    document.getElementById('gameView').style.display = 'block';
    
    document.getElementById('opponentName').textContent = 'Menunggu...';
    document.getElementById('opponentAvatar').src = 'https://ui-avatars.com/api/?name=L&background=f1f5f9';
    document.getElementById('gameStatus').innerHTML = 'Menunggu lawan bergabung...';
    
    hasShownGameOver = false;
    game = new Chess();
    lastFen = '';
    
    initBoard();
    pollInterval = setInterval(pollGameState, 2000);
    pollGameState();
    
    if (!isWaiting) {
        startCountdown();
    } else {
        waitingForOpponent = true;
    }
}

function startCountdown() {
    isCountdown = true;
    const overlay = document.getElementById('countdownOverlay');
    const numberEl = document.getElementById('countdownNumber');
    overlay.style.display = 'flex';
    
    let count = 3;
    numberEl.textContent = count;
    
    const interval = setInterval(() => {
        count--;
        if (count > 0) {
            numberEl.textContent = count;
        } else if (count === 0) {
            numberEl.textContent = 'Mulai!';
        } else {
            clearInterval(interval);
            overlay.style.display = 'none';
            isCountdown = false;
            
            if (isVsComputer && myColor === 'b' && !game.game_over()) {
                window.setTimeout(makeComputerMove, 400);
            }
        }
    }, 1000);
}

function removeHighlights() {
    $('#board1 .square-55d63').css('background-color', '');
    $('#board1 .move-hint, #board1 .move-hint-capture').remove();
}

function showCaptureEffect(square) {
    var $sq = $('#board1 .square-' + square);
    var $effect = $('<div class="capture-effect"></div>');
    $sq.append($effect);
    setTimeout(function() {
        $effect.remove();
    }, 500);
}

function highlightMoves(square) {
    removeHighlights();
    var moves = game.moves({
        square: square,
        verbose: true
    });

    if (moves.length === 0) return;

    for (var i = 0; i < moves.length; i++) {
        var move = moves[i];
        var $sq = $('#board1 .square-' + move.to);
        
        if (move.flags.includes('c') || move.flags.includes('e')) {
            $sq.append('<div class="move-hint-capture"></div>');
        } else {
            $sq.append('<div class="move-hint"></div>');
        }
    }
}

let selectedSquare = null;

function initBoard() {
    var config = {
        draggable: false,
        showNotation: false,
        position: 'start',
        orientation: myColor === 'w' ? 'white' : 'black',
        pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
    };
    board = Chessboard('board1', config);

    $('#board1').off('click', '.square-55d63').on('click', '.square-55d63', function() {
        if (isCountdown) return;
        
        var square = $(this).attr('data-square');
        removeHighlights();
        
        if (selectedSquare === null) {
            var piece = game.get(square);
            if (piece && piece.color === game.turn() && game.turn() === myColor && !game.game_over()) {
                selectedSquare = square;
                $(this).css('background-color', 'rgba(105, 130, 255, 0.5)');
                highlightMoves(square);
            }
        } else {
            if (square === selectedSquare) {
                selectedSquare = null;
                return;
            }
            
            var move = game.move({ from: selectedSquare, to: square, promotion: 'q' });
            
            if (move === null) {
                var piece = game.get(square);
                if (piece && piece.color === game.turn()) {
                    selectedSquare = square;
                    $(this).css('background-color', 'rgba(105, 130, 255, 0.5)');
                    highlightMoves(square);
                } else {
                    selectedSquare = null;
                }
            } else {
                board.position(game.fen(), false);
                selectedSquare = null;
                
                if (move.flags.includes('c') || move.flags.includes('e')) {
                    showCaptureEffect(move.to);
                }

                updateStatus();
                saveGameState();
                if (isVsComputer && !game.game_over()) {
                    window.setTimeout(makeComputerMove, 400);
                }
            }
        }
    });
}

async function leaveGame() {
    if (!isVsComputer && gameId && !game.game_over() && !waitingForOpponent) {
        const opponentName = document.getElementById('opponentName').textContent;
        if (opponentName !== 'Menunggu...') {
            const isSure = confirm('Apakah Anda yakin ingin keluar dari pertandingan? Anda akan dinyatakan MENYERAH.');
            if (!isSure) return;

            try {
                await fetch('../api/api_catur.php', {
                    method: 'PUT',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ 
                        id: gameId, 
                        fen: game.fen(), 
                        status: 'finished',
                        winner: opponentName
                    })
                });
            } catch(e) {
                console.error(e);
            }
        }
    }

    gameId = null;
    isVsComputer = false;
    if (pollInterval) clearInterval(pollInterval);
    document.getElementById('gameView').style.display = 'none';
    document.getElementById('lobbyView').style.display = 'block';
    loadLobby();
}

function updateStatus () {
    var status = '';
    var moveColor = 'Putih';
    if (game.turn() === 'b') {
        moveColor = 'Hitam';
    }

    if (game.in_checkmate()) {
        status = 'Skakmat! ' + moveColor + ' kalah.';
        if (!hasShownGameOver) {
            hasShownGameOver = true;
            let title = (game.turn() === myColor) ? 'Anda Kalah!' : 'Anda Menang!';
            setTimeout(() => alert(title + ': ' + status), 500);
        }
    }
    else if (game.in_draw()) {
        status = 'Seri!';
        if (!hasShownGameOver) {
            hasShownGameOver = true;
            setTimeout(() => alert('Permainan Seri!'), 500);
        }
    }
    else {
        status = 'Giliran ' + moveColor;
        if (game.in_check()) {
            status += ', ' + moveColor + ' sedang Skak!';
        }
    }
    
    document.getElementById('myBox').classList.remove('turn-active');
    document.getElementById('opponentBox').classList.remove('turn-active');
    if (game.turn() === myColor) {
        document.getElementById('myBox').classList.add('turn-active');
    } else {
        document.getElementById('opponentBox').classList.add('turn-active');
    }

    document.getElementById('gameStatus').innerHTML = status;
}

function makeComputerMove() {
    var possibleMoves = game.moves({ verbose: true });
    if (possibleMoves.length === 0) return;

    var move;
    if (currentAiLevel === 1) {
        var randomIdx = Math.floor(Math.random() * possibleMoves.length);
        move = game.move(possibleMoves[randomIdx].san);
    } 
    else if (currentAiLevel === 2) {
        var captureMoves = possibleMoves.filter(m => m.flags.includes('c') || m.flags.includes('e'));
        if (captureMoves.length > 0) {
            var randomIdx = Math.floor(Math.random() * captureMoves.length);
            move = game.move(captureMoves[randomIdx].san);
        } else {
            var randomIdx = Math.floor(Math.random() * possibleMoves.length);
            move = game.move(possibleMoves[randomIdx].san);
        }
    }
    else if (currentAiLevel === 3) {
        var bestMove = null;
        var bestValue = 9999;
        
        for (var i = 0; i < possibleMoves.length; i++) {
            var m = possibleMoves[i];
            game.move(m.san);
            var boardValue = evaluateBoard(game.board());
            game.undo();
            if (boardValue < bestValue) {
                bestValue = boardValue;
                bestMove = m;
            }
        }
        
        if (bestMove) {
            move = game.move(bestMove.san);
        } else {
            var randomIdx = Math.floor(Math.random() * possibleMoves.length);
            move = game.move(possibleMoves[randomIdx].san);
        }
    }

    board.position(game.fen(), false);
    if (move && (move.flags.includes('c') || move.flags.includes('e'))) {
        showCaptureEffect(move.to);
    }
    
    updateStatus();
    saveGameState();
}

function evaluateBoard(board) {
    var totalEvaluation = 0;
    for (var i = 0; i < 8; i++) {
        for (var j = 0; j < 8; j++) {
            totalEvaluation += getPieceValue(board[i][j]);
        }
    }
    return totalEvaluation;
}

function getPieceValue(piece) {
    if (piece === null) return 0;
    var getAbsoluteValue = function (piece) {
        if (piece.type === 'p') return 10;
        if (piece.type === 'r') return 50;
        if (piece.type === 'n') return 30;
        if (piece.type === 'b') return 30;
        if (piece.type === 'q') return 90;
        if (piece.type === 'k') return 900;
        return 0;
    };
    return piece.color === 'w' ? getAbsoluteValue(piece) : -getAbsoluteValue(piece);
}

async function pollGameState() {
    if (isVsComputer || !gameId) return;
    
    try {
        const res = await fetch(`api/api_catur.php?action=state&id=${gameId}`);
        const json = await res.json();
        
        if (json.status === 'success') {
            const data = json.data;
            const oppName = (myColor === 'w') ? data.player_black : data.player_white;
            if (oppName) {
                if (data.status === 'playing' && waitingForOpponent) {
                    waitingForOpponent = false;
                    startCountdown();
                }
                document.getElementById('opponentName').textContent = oppName;
                document.getElementById('opponentAvatar').src = `https://ui-avatars.com/api/?name=${encodeURIComponent(oppName)}&background=f1f5f9`;
            }
            
            if (data.status === 'finished') {
                if (data.winner) {
                    document.getElementById('gameStatus').innerHTML = `Permainan Selesai. Pemenang: <b>${data.winner}</b>`;
                }
                clearInterval(pollInterval);
                return;
            }
            
            if (data.status === 'playing' && !oppName) {
                 document.getElementById('gameStatus').innerHTML = 'Menunggu langkah pertama...';
            }
            
            if (data.fen && data.fen !== lastFen) {
                lastFen = data.fen;
                if (game.fen() !== data.fen) {
                    game.load(data.fen);
                    board.position(data.fen, false);
                    updateStatus();
                }
            }
        }
    } catch(e) {
        console.error(e);
    }
}

async function saveGameState() {
    if (isVsComputer || !gameId) return;
    const currentFen = game.fen();
    lastFen = currentFen;
    
    let gameStatus = 'playing';
    let winner = null;
    
    if (game.game_over()) {
        gameStatus = 'finished';
        if (game.in_checkmate()) {
            winner = myName;
        } else {
            winner = 'Seri';
        }
    }
    
    try {
        await fetch('../api/api_catur.php', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                id: gameId, 
                fen: currentFen, 
                status: gameStatus,
                winner: winner
            })
        });
    } catch(e) {
        console.error(e);
    }
}
