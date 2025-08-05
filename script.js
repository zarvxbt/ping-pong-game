const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let paddleWidth = 10, paddleHeight = 100;
let playerY = canvas.height / 2 - paddleHeight / 2;
let aiY = playerY;
let ballX = canvas.width / 2, ballY = canvas.height / 2;
let ballSpeedX = 4, ballSpeedY = 4;

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

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, '#fff');
  drawRect(0, playerY, paddleWidth, paddleHeight, '#000');
  drawRect(canvas.width - paddleWidth, aiY, paddleWidth, paddleHeight, '#000');
  drawCircle(ballX, ballY, 10, '#000');
}

function update() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY <= 0 || ballY >= canvas.height) ballSpeedY *= -1;

  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ballY - 35) aiY += 5;
  else if (aiCenter > ballY + 35) aiY -= 5;

  if (ballX <= paddleWidth && ballY > playerY && ballY < playerY + paddleHeight) {
    ballSpeedX *= -1;
  }

  if (ballX >= canvas.width - paddleWidth && ballY > aiY && ballY < aiY + paddleHeight) {
    ballSpeedX *= -1;
  }

  if (ballX < 0 || ballX > canvas.width) {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX *= -1;
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', (e) => {
  playerY = e.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
});

gameLoop();
