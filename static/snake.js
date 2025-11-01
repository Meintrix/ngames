let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");
let box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let score = 0;
let direction;
let game;

document.addEventListener("keydown", directionHandler);

function directionHandler(e) {
  if (e.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
  else if (e.keyCode == 38 && direction != "DOWN") direction = "UP";
  else if (e.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
  else if (e.keyCode == 40 && direction != "UP") direction = "DOWN";
}

function collision(newHead, snake) {
  for (let i = 0; i < snake.length; i++) {
    if (newHead.x == snake[i].x && newHead.y == snake[i].y) return true;
  }
  return false;
}

function draw() {
  ctx.fillStyle = "lightgreen";
  ctx.fillRect(0, 0, 400, 400);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "darkgreen" : "green";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction == "LEFT") snakeX -= box;
  if (direction == "UP") snakeY -= box;
  if (direction == "RIGHT") snakeX += box;
  if (direction == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    document.getElementById("score").innerText = "امتیاز: " + score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= 400 ||
    snakeY >= 400 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    alert("باختی 😢 امتیازت: " + score);
    return;
  }

  snake.unshift(newHead);
}

function startGame() {
  snake = [{ x: 10 * box, y: 10 * box }];
  direction = undefined;
  score = 0;
  document.getElementById("score").innerText = "امتیاز: 0";
  clearInterval(game);
  game = setInterval(draw, 100);
}

startGame();