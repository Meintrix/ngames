const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let spaceship = { x: 180, y: 440, w: 40, h: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

document.getElementById("highscore").innerText = highScore;

// 🎯 حرکت با موس
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  spaceship.x = e.clientX - rect.left - spaceship.w / 2;
  spaceship.x = Math.max(0, Math.min(spaceship.x, canvas.width - spaceship.w));
});

// 🔫 شلیک با کلیک
canvas.addEventListener('click', () => {
  bullets.push({ x: spaceship.x + spaceship.w / 2 - 2, y: spaceship.y - 10 });
});

// 👾 ساخت دشمن تصادفی
function spawnEnemy() {
  enemies.push({
    x: Math.random() * (canvas.width - 40),
    y: -30,
    size: 35 + Math.random() * 10,
    speed: 2 + Math.random() * 2
  });
}

// ✨ رسم سفینه (بدون مربع)
function drawSpaceship() {
  ctx.save();
  ctx.translate(spaceship.x + spaceship.w / 2, spaceship.y + spaceship.h / 2);

  // نور نئون پشت سفینه
  const grad = ctx.createRadialGradient(0, 20, 5, 0, 20, 25);
  grad.addColorStop(0, "rgba(0,255,255,0.6)");
  grad.addColorStop(1, "transparent");
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(0, 20, 20, 0, Math.PI * 2);
  ctx.fill();

  // بدنه سفینه
  ctx.fillStyle = "#00FFFF";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(15, 20);
  ctx.lineTo(-15, 20);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

// 💥 رسم دشمن‌ها با رنگ و شکل متنوع
function drawEnemies() {
  enemies.forEach((en, i) => {
    en.y += en.speed;

    // شکل بیگانه (دایره با چشم)
    const gradient = ctx.createRadialGradient(en.x + en.size / 2, en.y + en.size / 2, 5, en.x + en.size / 2, en.y + en.size / 2, en.size);
    gradient.addColorStop(0, "#ff4d4d");
    gradient.addColorStop(1, "#990000");
    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(en.x + en.size / 2, en.y + en.size / 2, en.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // چشم دشمن
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(en.x + en.size / 2, en.y + en.size / 2 - 5, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(en.x + en.size / 2, en.y + en.size / 2 - 5, 2, 0, Math.PI * 2);
    ctx.fill();

    // حذف در صورت باخت
    if (en.y > canvas.height - 40) {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
      }
      alert(💥 باختی! امتیاز: ${score}\n🏆 رکورد: ${highScore});
      document.location.reload();
    }
  });
}

// 🔥 رسم گلوله‌ها
function drawBullets() {
  ctx.fillStyle = "yellow";
  bullets.forEach((b, i) => {
    b.y -= 7;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
    ctx.fill();
    if (b.y < 0) bullets.splice(i, 1);
  });
}

// 🎮 حلقه اصلی بازی
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSpaceship();
  drawBullets();
  drawEnemies();

  // برخورد گلوله با دشمن
  enemies.forEach((en, i) => {
    bullets.forEach((b, j) => {
      if (
        b.x > en.x &&
        b.x < en.x + en.size &&
        b.y > en.y &&
        b.y < en.y + en.size
      ) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 10;
        document.getElementById("score").innerText = score;
      }
    });
  });

  requestAnimationFrame(gameLoop);
}

setInterval(spawnEnemy, 1000);
gameLoop();