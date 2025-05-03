// Tic Tac Toe Game
const board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
];

let currentPlayer = "X";

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    board.forEach((row, rowIndex) => {
        const rowDiv = document.createElement("div");
        rowDiv.classList.add("row");
        row.forEach((cell, colIndex) => {
            const cellDiv = document.createElement("div");
            cellDiv.classList.add("cell");
            cellDiv.textContent = cell;
            cellDiv.addEventListener("click", () => makeMove(rowIndex, colIndex));
            rowDiv.appendChild(cellDiv);
        });
        boardDiv.appendChild(rowDiv);
    });
}

function updateStatus(message) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = message;
}

function makeMove(row, col) {
    if (board[row][col] === "") {
        board[row][col] = currentPlayer;
        if (checkWin()) {
            renderBoard();
            updateStatus(`Spieler ${currentPlayer} gewinnt!`);
            resetGame();
        } else if (checkDraw()) {
            renderBoard();
            updateStatus("Unentschieden!");
            resetGame();
        } else {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            updateStatus(`Spieler ${currentPlayer} ist am Zug`);
            renderBoard();
        }
    }
}

function checkWin() {
    for (let i = 0; i < 3; i++) {
        if (
            board[i][0] === currentPlayer &&
            board[i][1] === currentPlayer &&
            board[i][2] === currentPlayer
        ) {
            return true;
        }
        if (
            board[0][i] === currentPlayer &&
            board[1][i] === currentPlayer &&
            board[2][i] === currentPlayer
        ) {
            return true;
        }
    }
    if (
        board[0][0] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][2] === currentPlayer
    ) {
        return true;
    }
    if (
        board[0][2] === currentPlayer &&
        board[1][1] === currentPlayer &&
        board[2][0] === currentPlayer
    ) {
        return true;
    }
    return false;
}

function checkDraw() {
    return board.flat().every(cell => cell !== "");
}

function resetGame() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
        }
    }
    currentPlayer = "X";
    setTimeout(() => {
        updateStatus("Spieler X ist am Zug");
        renderBoard();
    }, 2000);
}

// Initialize the game
document.addEventListener("DOMContentLoaded", () => {
    renderBoard();
    updateStatus("Spieler X ist am Zug");
});