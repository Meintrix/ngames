document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  let spaceship = { x: 180, y: 440, w: 40, h: 40 };
  let bullets = [];
  let enemies = [];
  let score = 0;
  let highScore = localStorage.getItem('highScore') || 0;
  let running = false;
  let enemyInterval;

  document.getElementById("highscore").innerText = highScore;

  // 🎮 کنترل دکمه‌ها
  const startBtn = document.getElementById("startBtn");
  const stopBtn = document.getElementById("stopBtn");

  startBtn.addEventListener("click", startGame);
  stopBtn.addEventListener("click", stopGame);

  // 🎯 کنترل با کلیک چپ/راست برای حرکت
  canvas.addEventListener("mousedown", (e) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    const mid = rect.left + rect.width / 2;

    if (e.clientX < mid) {
      spaceship.x -= 60; // چپ
    } else {
      spaceship.x += 60; // راست
    }

    spaceship.x = Math.max(0, Math.min(spaceship.x, canvas.width - spaceship.w));
  });

  // 🔫 شلیک با کلیک دوبار
  canvas.addEventListener("dblclick", () => {
    if (running)
      bullets.push({ x: spaceship.x + spaceship.w / 2 - 2, y: spaceship.y - 10 });
  });

  // 👾 ساخت دشمن
  function spawnEnemy() {
    enemies.push({
      x: Math.random() * (canvas.width - 40),
      y: -30,
      size: 35 + Math.random() * 10,
      speed: 2 + Math.random() * 2
    });
  }

  // ✨ رسم سفینه
  function drawSpaceship() {
    ctx.save();
    ctx.translate(spaceship.x + spaceship.w / 2, spaceship.y + spaceship.h / 2);

    const grad = ctx.createRadialGradient(0, 20, 5, 0, 20, 25);
    grad.addColorStop(0, "rgba(0,255,255,0.6)");
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 20, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#00FFFF";
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(15, 20);
    ctx.lineTo(-15, 20);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // 💥 رسم دشمن‌ها
  function drawEnemies() {
    enemies.forEach((en, i) => {
      en.y += en.speed;

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

      if (en.y > canvas.height - 40) {
        gameOver();
      }
    });
  }

  // 🔥 گلوله‌ها
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

  // 💥 پایان بازی
  function gameOver() {
    running = false;
    clearInterval(enemyInterval);

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }

    alert(💥 باختی! امتیاز: ${score}\n🏆 رکورد: ${highScore});
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }

  // 🎮 شروع بازی
  function startGame() {
    score = 0;
    enemies = [];
    bullets = [];
    running = true;
    spaceship.x = 180;

    document.getElementById("score").innerText = score;
    startBtn.disabled = true;
    stopBtn.disabled = false;

    enemyInterval = setInterval(spawnEnemy, 1000);
    gameLoop();
  }

  // ⛔ توقف بازی
  function stopGame() {
    running = false;
    clearInterval(enemyInterval);
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
  // 🔁 حلقه اصلی
  function gameLoop() {
    if (!running) return;
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
});