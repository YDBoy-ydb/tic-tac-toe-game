let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let scores = { X: 0, O: 0 };

const modeSelect = document.getElementById("mode");
const difficultySelect = document.getElementById("difficulty");
const cells = document.querySelectorAll(".cell");
const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

function createBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.addEventListener("click", onCellClick);
        boardDiv.appendChild(cell);
    }
}

function onCellClick(e) {
    const index = e.target.dataset.index;

    if (!gameActive || board[index] !== "") return;

    board[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    if (checkWin(currentPlayer)) {
        alert(`${currentPlayer} wins!`);
        scores[currentPlayer]++;
        updateScore();
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        alert("It's a draw!");
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    // AI Move
    if (modeSelect.value === "1" && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let move;
    const difficulty = difficultySelect.value;

    if (difficulty === "easy") {
        move = easyMove();
    } else if (difficulty === "medium") {
        move = mediumMove();
    } else {
        move = minimax("O").index;
    }

    board[move] = "O";
    document.querySelector(`[data-index='${move}']`).textContent = "O";

    if (checkWin("O")) {
        alert("AI wins!");
        scores["O"]++;
        updateScore();
        gameActive = false;
        return;
    }

    if (!board.includes("")) {
        alert("It's a draw!");
        gameActive = false;
        return;
    }

    currentPlayer = "X";
}

function easyMove() {
    const empty = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function mediumMove() {
    const preferred = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (let i of preferred) {
        if (board[i] === "") return i;
    }
    return easyMove();
}

function minimax(player) {
    const opponent = player === "O" ? "X" : "O";
    const empty = board.map((val, idx) => val === "" ? idx : null).filter(v => v !== null);

    if (checkWin("O")) return { score: 10 };
    if (checkWin("X")) return { score: -10 };
    if (empty.length === 0) return { score: 0 };

    const moves = [];

    for (let i of empty) {
        board[i] = player;
        const score = minimax(opponent).score;
        board[i] = "";
        moves.push({ index: i, score });
    }

    let best;
    if (player === "O") {
        best = moves.reduce((a, b) => a.score > b.score ? a : b);
    } else {
        best = moves.reduce((a, b) => a.score < b.score ? a : b);
    }

    return best;
}

function checkWin(player) {
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winCombos.some(combo =>
        combo.every(i => board[i] === player)
    );
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    document.querySelectorAll(".cell").forEach(cell => cell.textContent = "");
}

function newGame() {
    resetGame();
    scores = { X: 0, O: 0 };
    updateScore();
}

function updateScore() {
    scoreX.textContent = scores.X;
    scoreO.textContent = scores.O;
}

// Initialize
createBoard();
updateScore();