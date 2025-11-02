const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ship = { x: 180, y: 520, w: 40, h: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;

// کنترل سفینه با کلیدها
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && ship.x > 0) ship.x -= 20;
  if (e.key === "ArrowRight" && ship.x < canvas.width - ship.w) ship.x += 20;
  if (e.key === " " && !gameOver) {
    bullets.push({ x: ship.x + 18, y: ship.y });
  }
});

function drawShip() {
  ctx.fillStyle = "#0ff";
  ctx.fillRect(ship.x, ship.y, ship.w, ship.h);
}

function drawBullets() {
  ctx.fillStyle = "#ff0";
  bullets.forEach((b) => {
    ctx.fillRect(b.x, b.y, 4, 10);
    b.y -= 10;
  });
  bullets = bullets.filter((b) => b.y > 0);
}

function drawEnemies() {
  ctx.fillStyle = "#f00";
  enemies.forEach((e) => {
    ctx.fillRect(e.x, e.y, e.w, e.h);
    e.y += 2;
  });
  enemies = enemies.filter((e) => e.y < canvas.height);
}

function checkCollisions() {
  enemies.forEach((e, ei) => {
    bullets.forEach((b, bi) => {
      if (
        b.x < e.x + e.w &&
        b.x + 4 > e.x &&
        b.y < e.y + e.h &&
        b.y + 10 > e.y
      ) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score += 10;
        document.getElementById("score").innerText = امتیاز: ${score};
      }
    });

    // برخورد دشمن با سفینه
    if (
      e.x < ship.x + ship.w &&
      e.x + e.w > ship.x &&
      e.y < ship.y + ship.h &&
      e.y + e.h > ship.y
    ) {
      gameOver = true;
      document.getElementById("score").innerText = 💀 باختی! امتیاز نهایی: ${score};
    }
  });
}

function addEnemy() {
  let x = Math.random() * (canvas.width - 40);
  enemies.push({ x: x, y: 0, w: 40, h: 40 });
}

setInterval(addEnemy, 1000);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!gameOver) {
    drawShip();
    drawBullets();
    drawEnemies();
    checkCollisions();
    requestAnimationFrame(loop);
  } else {
    ctx.fillStyle = "#0ff";
    ctx.font = "28px Arial";
    ctx.fillText("برای شروع مجدد رفرش کن 🔄", 40, 300);
  }
}
loop();