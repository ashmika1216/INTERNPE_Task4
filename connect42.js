const playerRed = 'R';
const playerYellow = 'Y';
let currPlayer = playerRed;

let gameOver = false;
let board;

const rows = 6;
const columns = 7;
let currColumns = Array(columns).fill(rows - 1);

document.addEventListener('DOMContentLoaded', () => {
    setGame();
});

function setGame() {
    board = Array.from({ length: rows }, () => Array(columns).fill(' '));
    currColumns = Array(columns).fill(rows - 1);

    const boardElement = document.getElementById('board');
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = r;
            tile.dataset.column = c;
            tile.addEventListener('click', setPiece);
            boardElement.appendChild(tile);
        }
    }
}

function setPiece() {
    if (gameOver) return;

    const row = parseInt(this.dataset.row);
    const column = parseInt(this.dataset.column);

    const targetRow = currColumns[column];
    if (targetRow < 0) return;

    board[targetRow][column] = currPlayer;
    const tile = document.querySelector(`[data-row="${targetRow}"][data-column="${column}"]`);

    if (currPlayer === playerRed) {
        tile.classList.add('red-piece');
        currPlayer = playerYellow;
    } else {
        tile.classList.add('yellow-piece');
        currPlayer = playerRed;
    }

    currColumns[column]--;
    checkWinner();
}

function checkWinner() {
    const winConditions = [
        [[0, 1], [0, 2], [0, 3]],
        [[1, 0], [2, 0], [3, 0]],
        [[1, 1], [2, 2], [3, 3]],
        [[-1, 1], [-2, 2], [-3, 3]],
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            const player = board[r][c];
            if (player === ' ') continue;

            for (const condition of winConditions) {
                const isWinning = condition.every(([dr, dc]) => {
                    const newRow = r + dr;
                    const newColumn = c + dc;
                    return (
                        newRow >= 0 &&
                        newRow < rows &&
                        newColumn >= 0 &&
                        newColumn < columns &&
                        board[newRow][newColumn] === player
                    );
                });

                if (isWinning) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    const winnerElement = document.getElementById('winner');
    const winningPlayer = board[r][c] === playerRed ? 'Red' : 'Yellow';
    winnerElement.textContent = `${winningPlayer} Wins!`;
    gameOver = true;
}
