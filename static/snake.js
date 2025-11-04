const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");
const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box
};
let d;
let score = 0;

document.addEventListener("keydown", direction);

function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

function draw() {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, 400, 400);

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i == 0 ? "#00ffcc" : "white";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    localStorage.setItem('playerScore', Number(localStorage.getItem('playerScore') || 0) + 1);
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
    alert("🐍 باختی! امتیاز: " + score);
    window.location.href = "/";
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) return true;
  }
  return false;
}

let game = setInterval(draw, 100);