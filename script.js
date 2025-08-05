const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreboard = document.getElementById('scoreboard');

let paddleWidth = 10, paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = playerY;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 5, ballSpeedY = 4;

let playerScore = 0;
let aiScore = 0;

// Sound effects
const paddleHitSound = new Audio('https://freesound.org/data/previews/26/26558_512123-lq.mp3');
const scoreSound = new Audio('https://freesound.org/data/previews/331/331912_3248244-lq.mp3');

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
}

function drawNet() {
  const netWidth = 4;
  const netHeight = 20;
  ctx.fillStyle = '#555';
  for (let i = 0; i < canvas.height; i += netHeight * 2) {
    ctx.fillRect(canvas.width / 2 - netWidth / 2, i, netWidth, netHeight);
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, '#fff');
  drawNet();
  drawRect(0, playerY, paddleWidth, paddleHeight, '#2575fc');
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, '#6a11cb');
  drawCircle(ballX, ballY, 10, '#fc575e');
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Ball bounces off top and bottom
  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  // AI paddle movement (simple AI)
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 30) aiY += 6;
  else if (aiCenter > ballY + 30) aiY -= 6;

  // Keep AI paddle inside canvas
  if (aiY < 0) aiY = 0;
  if (aiY + paddleHeight > canvas.height) aiY = canvas.height - paddleHeight;

  // Player paddle collision
  if (ballX <= paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
    ballSpeedX *= -1.1;  // speed up a bit
    playSound(paddleHitSound);
  }

  // AI paddle collision
  if (ballX >= canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
    ballSpeedX *= -1.1;  // speed up a bit
    playSound(paddleHitSound);
  }

  // Score points
  if (ballX < 0) {
    aiScore++;
    resetBall();
    playSound(scoreSound);
  }
  if (ballX > canvas.width) {
    playerScore++;
    resetBall();
    playSound(scoreSound);
  }

  updateScoreboard();
}

function updateScoreboard() {
  scoreboard.textContent = `Player: ${playerScore} | AI: ${aiScore}`;
}

function resetBall() {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX / Math.abs(ballSpeedX) * 5; // reset speed and direction
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Player paddle follows mouse or touch
function movePlayer(y) {
  playerY = y - paddleHeight / 2;
  if (playerY < 0) playerY = 0;
  if (playerY + paddleHeight > canvas.height) playerY = canvas.height - paddleHeight;
}

canvas.addEventListener('mousemove', e => {
  movePlayer(e.clientY - canvas.getBoundingClientRect().top);
});

// Mobile touch support
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  const touch = e.touches[0];
  movePlayer(touch.clientY - canvas.getBoundingClientRect().top);
}, { passive: false });

gameLoop();
