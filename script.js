/* script.js */
const homeScreen = document.getElementById('home-screen');
const nameInputScreen = document.getElementById('name-input-screen');
const gameScreen = document.getElementById('game-screen');
const resultPopup = document.getElementById('result-popup');
const resultMessage = document.getElementById('result-message');

const twoPlayerBtn = document.getElementById('two-player-btn');
const singlePlayerBtn = document.getElementById('single-player-btn');
const startGameBtn = document.getElementById('start-game');
const backToHomeBtn = document.getElementById('back-to-home');
const restartBtn = document.getElementById('restart');

const player1Input = document.getElementById('player1-name');
const player2Input = document.getElementById('player2-name');
const playerNameInput = document.getElementById('player-name');

const statusMessage = document.getElementById('status-message');
const cells = document.querySelectorAll('.cell');

let isTwoPlayer = false;
let board = Array(9).fill('');
let currentPlayer = 'X';
let player1 = '';
let player2 = '';
let currentPlayerName = '';

const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Switch screens
function switchScreen(from, to) {
    from.classList.add('hidden');
    to.classList.remove('hidden');
}

// Event listeners
twoPlayerBtn.addEventListener('click', () => {
    isTwoPlayer = true;
    document.getElementById('single-player-name').classList.add('hidden');
    document.getElementById('two-player-names').classList.remove('hidden');
    switchScreen(homeScreen, nameInputScreen);
});

singlePlayerBtn.addEventListener('click', () => {
    isTwoPlayer = false;
    document.getElementById('two-player-names').classList.add('hidden');
    document.getElementById('single-player-name').classList.remove('hidden');
    switchScreen(homeScreen, nameInputScreen);
});

startGameBtn.addEventListener('click', () => {
    if (isTwoPlayer) {
        player1 = player1Input.value || 'Player 1';
        player2 = player2Input.value || 'Player 2';
        currentPlayerName = player1;
    } else {
        player1 = playerNameInput.value || 'Player';
        player2 = 'System';
        currentPlayerName = player1;
    }

    switchScreen(nameInputScreen, gameScreen);
    statusMessage.textContent = `${currentPlayerName}'s turn`;
});

cells.forEach(cell => cell.addEventListener('click', handleCellClick));

function handleCellClick(event) {
    const index = event.target.getAttribute('data-index');
    if (board[index] !== '') return;

    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    if (checkWinner()) {
        showResult(`${currentPlayerName} wins!`);
    } else if (board.every(cell => cell !== '')) {
        showResult("It's a draw!");
    } else {
        switchPlayer();
    }
}

function switchPlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerName = currentPlayerName === player1 ? player2 : player1;
    statusMessage.textContent = `${currentPlayerName}'s turn`;

    if (!isTwoPlayer && currentPlayer === 'O') {
        setTimeout(systemPlay, 500);
    }
}

function systemPlay() {
    const emptyCells = board.map((val, index) => (val === '' ? index : null)).filter(val => val !== null);
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    document.querySelector(`.cell[data-index="${randomIndex}"]`).click();
}

function checkWinner() {
    return winningCombos.some(combo => combo.every(index => board[index] === currentPlayer));
}

function showResult(message) {
    resultMessage.textContent = message;
    resultPopup.classList.remove('hidden');
}

function resetGame() {
    board.fill('');
    currentPlayer = 'X';
    currentPlayerName = player1;
    cells.forEach(cell => (cell.textContent = ''));
    statusMessage.textContent = `${currentPlayerName}'s turn`;
    resultPopup.classList.add('hidden');
}

restartBtn.addEventListener('click', resetGame);
backToHomeBtn.addEventListener('click', () => {
    resetGame();
    switchScreen(gameScreen, homeScreen);
});
