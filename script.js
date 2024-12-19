const boardElement = document.getElementById("board");
const messageElement = document.getElementById("message");
let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";

function renderBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        if (cell) cellElement.classList.add("taken");
        cellElement.textContent = cell;
        cellElement.addEventListener("click", () => makeMove(index));
        boardElement.appendChild(cellElement);
    });
}

function checkWinner(board) {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every((cell) => cell)) {
        return "tie";
    }

    return null;
}

function makeMove(index) {
    if (board[index] === "") {
        board[index] = currentPlayer;
        currentPlayer = "O";
        renderBoard();
        const winner = checkWinner(board);
        if (winner) {
            endGame(winner);
        } else {
            setTimeout(() => aiMove(), 500);
        }
    }
}

function aiMove() {
    const difficulty = document.getElementById("difficulty").value;
    let move;
    if (difficulty === "easy") {
        move = randomMove();
    } else if (difficulty === "medium") {
        move = findBestMove(board, 2); 
    } else {
        move = findBestMove(board);
    }

    if (move !== -1) {
        board[move] = "O";
        currentPlayer = "X";
        renderBoard();
        const winner = checkWinner(board);
        if (winner) {
            endGame(winner);
        }
    }
}

function randomMove() {
    const emptyCells = board
        .map((cell, index) => (cell === "" ? index : null))
        .filter((index) => index !== null);
    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function findBestMove(board, depthLimit = Infinity) {
    let bestScore = -Infinity;
    let move = -1;
    board.forEach((cell, index) => {
        if (cell === "") {
            board[index] = "O";
            const score = minimax(board, 0, false, depthLimit);
            board[index] = "";
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    return move;
}

function minimax(board, depth, isMaximizing, depthLimit) {
    const winner = checkWinner(board);
    if (winner === "O") return 10 - depth;
    if (winner === "X") return depth - 10;
    if (winner === "tie") return 0;
    if (depth >= depthLimit) return 0;

    if (isMaximizing) {
        let bestScore = -Infinity;
        board.forEach((cell, index) => {
            if (cell === "") {
                board[index] = "O";
                const score = minimax(board, depth + 1, false, depthLimit);
                board[index] = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        board.forEach((cell, index) => {
            if (cell === "") {
                board[index] = "X";
                const score = minimax(board, depth + 1, true, depthLimit);
                board[index] = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
}

function endGame(winner) {
    if (winner === "tie") {
        messageElement.textContent = "Match nul !";
    } else {
        messageElement.textContent = `${winner} a gagné !`;
    }
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.classList.add("taken");
    });
}

function restartGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    messageElement.textContent = "";
    renderBoard();
}

function startGame() {
    restartGame();
    const starter = document.getElementById("starter").value;
    if (starter === "ai") {
        aiMove();
    }
}

renderBoard();
