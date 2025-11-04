const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 500;

let spaceship = { x: 280, y: 440, size: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let gameRunning = false;

function startGame() {
  score = 0;
  bullets = [];
  enemies = [];
  gameRunning = true;
  loop();
}
document.getElementById("startBtn").onclick = startGame;

document.addEventListener("mousemove", e => {
  const rect = canvas.getBoundingClientRect();
  spaceship.x = e.clientX - rect.left - spaceship.size / 2;
});

document.addEventListener("keydown", e => {
  if (e.code === "Space") {
    bullets.push({ x: spaceship.x + spaceship.size / 2 - 2, y: spaceship.y - 10 });
  }
});

function loop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // فضاپیما
  ctx.fillStyle = "#00aaff";
  ctx.fillRect(spaceship.x, spaceship.y, spaceship.size, spaceship.size);

  // گلوله‌ها
  ctx.fillStyle = "yellow";
  bullets.forEach((b, i) => {
    b.y -= 5;
    ctx.fillRect(b.x, b.y, 4, 10);
    if (b.y < 0) bullets.splice(i, 1);
  });

  // دشمن‌ها
  if (Math.random() < 0.03) {
    enemies.push({ x: Math.random() * 560, y: 0, size: 30 });
  }
  ctx.fillStyle = "red";
  enemies.forEach((en, i) => {
    en.y += 2;
    ctx.fillRect(en.x, en.y, en.size, en.size);

    // برخورد گلوله با دشمن
    bullets.forEach((b, j) => {
      if (b.x < en.x + en.size && b.x + 4 > en.x && b.y < en.y + en.size && b.y + 10 > en.y) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        document.getElementById("score").textContent = score;

        fetch("/update_score", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: score=${score}
        });
      }
    });

    // برخورد دشمن با زمین = باخت
    if (en.y > canvas.height) {
      gameRunning = false;
      alert("باختی 😢 امتیازت: " + score);
    }
  });

  requestAnimationFrame(loop);
}