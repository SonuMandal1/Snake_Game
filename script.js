const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const messageElement = document.querySelector(".message");

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameInterval;
let score = 0;
let isPaused = false;
let isStarted = false;

// Sound effects
const foodSound = new Audio("https://freesound.org/data/previews/466/466282_7037-lq.mp3");
const gameOverSound = new Audio("https://freesound.org/data/previews/456/456119_7192344-lq.mp3");

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

const handleGameOver = () => {
  clearInterval(gameInterval);
  gameOverSound.play();
  messageElement.innerText = "Game Over! Press Start to play again.";
  isStarted = false;
};

const changeDirection = (e) => {
  if (!isStarted) return;

  const key = e.key;
  if (key === " " || e.code === "Space") {
    togglePause();
    return;
  }

  if (key === "ArrowUp") {
    velocityX = 0;
    velocityY = -1;
  } else if (key === "ArrowDown") {
    velocityX = 0;
    velocityY = 1;
  } else if (key === "ArrowLeft") {
    velocityX = -1;
    velocityY = 0;
  } else if (key === "ArrowRight") {
    velocityX = 1;
    velocityY = 0;
  }
};

const initGame = () => {
  if (isPaused || !isStarted) return;

  snakeX += velocityX;
  snakeY += velocityY;

  if (
    snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 ||
    snakeBody.slice(1).some(seg => seg[0] === snakeX && seg[1] === snakeY)
  ) {
    handleGameOver();
    return;
  }

  let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

  if (snakeX === foodX && snakeY === foodY) {
    foodSound.play();
    changeFoodPosition();
    snakeBody.push([foodX, foodY]);
    score++;
    highScore = Math.max(score, highScore);
    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Score: ${score}`;
    highScoreElement.innerText = `High Score: ${highScore}`;
  }

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = [...snakeBody[i - 1]];
  }

  snakeBody[0] = [snakeX, snakeY];

  snakeBody.forEach((seg, i) => {
    htmlMarkup += `<div class="${i === 0 ? 'head' : 'body'}" style="grid-area: ${seg[1]} / ${seg[0]}"></div>`;
  });

  playBoard.innerHTML = htmlMarkup;
};

function startGame() {
  clearInterval(gameInterval);
  snakeX = 5;
  snakeY = 10;
  velocityX = 0;
  velocityY = 0;
  snakeBody = [[snakeX, snakeY]];
  score = 0;
  isPaused = false;
  isStarted = true;
  messageElement.innerText = "Game Started. Use arrows or buttons!";
  scoreElement.innerText = `Score: ${score}`;
  changeFoodPosition();
  gameInterval = setInterval(initGame, 200);
}

function togglePause() {
  if (!isStarted) return;
  isPaused = !isPaused;
  messageElement.innerText = isPaused ? "Game Paused" : "Game Resumed";
}

document.addEventListener("keydown", changeDirection);
