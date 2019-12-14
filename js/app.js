let originalBoard = [];
const player = "O";
const AI = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [0, 4, 8],
  [6, 4, 2],
  [2, 5, 8]
];

const cells = document.querySelectorAll(".cell");

startGame();

function startGame() {
  document.querySelector(".end-game").style.display = "none";
  originalBoard = Array.from(Array(9).keys());
  cells.forEach(function(cell, index) {
    cell.innerHTML = "";
    cell.style.removeProperty("background-color");
    cell.addEventListener("click", turnClick);
  });
}

function turnClick(event) {
  if (typeof originalBoard[this.id] === "number") {
    turn(this.id, player);

    if (!checkTie()) {
      turn(bestSpot(), AI);
    }
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;

  let gameWon = checkWin(originalBoard, player);

  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;

  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index, player };
      break;
    }
  }

  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player === player ? "blue" : "red";
  }

  cells.forEach(function(cell, index) {
    cell.removeEventListener("click", turnClick);
  });

  declareWinner(gameWon.player === player ? "You Win!" : "You Lose");
}

function declareWinner(who) {
  document.querySelector(".end-game").style.display = "block";
  document.querySelector(".end-game .text").innerText = who;
}

function emptySquares() {
  return originalBoard.filter(spot => typeof spot === "number");
}

function bestSpot() {
  return Math.floor(Math.random() * emptySquares());
}

function checkTie() {
  if (emptySquares().length === 0) {
    cells.forEach(function(cell, index) {
      cell.style.backgroundColor = "green";
      cell.removeEventListener("click", turnClick);
    });
    declareWinner("Tie Game");
    return true;
  }

  return false;
}
