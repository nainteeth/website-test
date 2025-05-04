const SIZE = 4;
let board, score, lastBoard, lastMerged, lastNewTile;

function initBoard() {
    board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    score = 0;
    lastBoard = null;
    lastMerged = null;
    lastNewTile = null;
    addRandomTile();
    addRandomTile();
    updateBoard();
    updateScore();
}

function addRandomTile() {
    let empty = [];
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) empty.push([r, c]);
        }
    }
    if (empty.length === 0) return;
    let [r, c] = empty[Math.floor(Math.random() * empty.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
    lastNewTile = [r, c];
}

function updateBoard() {
    const container = document.getElementById('game-container');
    container.innerHTML = '';
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile' + (board[r][c] ? ' tile-' + board[r][c] : '');
            tile.textContent = board[r][c] ? board[r][c] : '';
            if (lastNewTile && lastNewTile[0] === r && lastNewTile[1] === c) {
                tile.classList.add('tile-appear');
            }
            if (lastMerged && lastMerged.some(([mr, mc]) => mr === r && mc === c)) {
                tile.classList.add('tile-merge');
            }
            container.appendChild(tile);
        }
    }
    lastNewTile = null;
    lastMerged = null;
}

function updateScore() {
    document.getElementById('score-value').textContent = score;
}

function move(direction) {
    let moved = false;
    let merged = Array.from({ length: SIZE }, () => Array(SIZE).fill(false));
    let addScore = 0;
    let mergedTiles = [];

    function traverse(callback) {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                let r = i, c = j;
                if (direction === 'right') c = SIZE - 1 - j;
                if (direction === 'down') r = SIZE - 1 - i;
                callback(r, c);
            }
        }
    }

    function getNext(r, c) {
        if (direction === 'up') return [r - 1, c];
        if (direction === 'down') return [r + 1, c];
        if (direction === 'left') return [r, c - 1];
        if (direction === 'right') return [r, c + 1];
    }

    traverse((r, c) => {
        if (board[r][c] === 0) return;
        let [nr, nc] = getNext(r, c);
        while (
            nr >= 0 && nr < SIZE &&
            nc >= 0 && nc < SIZE &&
            board[nr][nc] === 0
        ) {
            board[nr][nc] = board[r][c];
            board[r][c] = 0;
            r = nr; c = nc;
            [nr, nc] = getNext(r, c);
            moved = true;
        }
        [nr, nc] = getNext(r, c);
        if (
            nr >= 0 && nr < SIZE &&
            nc >= 0 && nc < SIZE &&
            board[nr][nc] === board[r][c] &&
            !merged[nr][nc] && !merged[r][c]
        ) {
            board[nr][nc] *= 2;
            board[r][c] = 0;
            merged[nr][nc] = true;
            mergedTiles.push([nr, nc]);
            addScore += board[nr][nc];
            moved = true;
        }
    });

    if (moved) {
        score += addScore;
        lastMerged = mergedTiles;
        addRandomTile();
        updateBoard();
        updateScore();
        if (isGameOver()) {
            setTimeout(() => alert('Game Over!'), 100);
        }
    }
}

function isGameOver() {
    for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
            if (board[r][c] === 0) return false;
            for (let [dr, dc] of [[0,1],[1,0],[-1,0],[0,-1]]) {
                let nr = r + dr, nc = c + dc;
                if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && board[nr][nc] === board[r][c]) {
                    return false;
                }
            }
        }
    }
    return true;
}

// --- Mouse and Touch Controls ---
let dragStartX = null;
let dragStartY = null;
let dragging = false;

const gameContainer = document.getElementById('game-container');

function getDirection(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
        return dx > 0 ? 'right' : 'left';
    } else {
        return dy > 0 ? 'down' : 'up';
    }
}

gameContainer.addEventListener('mousedown', (e) => {
    e.preventDefault();
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragging = true;
});

window.addEventListener('mousemove', (e) => {
    if (!dragging || dragStartX === null || dragStartY === null) return;
    e.preventDefault();
});

window.addEventListener('mouseup', (e) => {
    if (!dragging || dragStartX === null || dragStartY === null) return;
    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        move(getDirection(dx, dy));
    }
    dragStartX = null;
    dragStartY = null;
    dragging = false;
});

// Touch support for mobile devices
gameContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        dragging = true;
    }
}, { passive: false });

gameContainer.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    e.preventDefault();
}, { passive: false });

gameContainer.addEventListener('touchend', (e) => {
    if (!dragging || dragStartX === null || dragStartY === null) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - dragStartX;
    const dy = touch.clientY - dragStartY;
    if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
        move(getDirection(dx, dy));
    }
    dragStartX = null;
    dragStartY = null;
    dragging = false;
});

// --- Keyboard Controls ---
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
});

document.getElementById('restart-2048').addEventListener('click', initBoard);

window.addEventListener('DOMContentLoaded', initBoard); 