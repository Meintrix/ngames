// static/space.js
(() => {
  const canvas = document.getElementById("spaceCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width = 600;
  const H = canvas.height = 500;

  let ship = { x: 280, y: 440, w: 40, h: 30 };
  let bullets = [];
  let enemies = [];
  let score = 0;
  let running = false;
  let enemyTimer = 0;
  let best = Number(localStorage.getItem('bestScore') || 0);

  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const scoreDisplay = document.getElementById("scoreDisplay");

  function startGame(){
    running = true;
    bullets = [];
    enemies = [];
    score = 0;
    enemyTimer = 0;
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    scoreDisplay.innerText = score;
    loop();
  }
  startBtn.addEventListener("click", startGame);
  restartBtn.addEventListener("click", startGame);

  // حرکت با موس
  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    ship.x = Math.min(Math.max(e.clientX - rect.left - ship.w/2, 0), W - ship.w);
  });

  // شلیک با Space (prevent default برای جلوگیری اسکرول)
  window.addEventListener("keydown", (e) => {
    if (e.code === "Space" && running) {
      e.preventDefault();
      bullets.push({ x: ship.x + ship.w/2 - 3, y: ship.y - 10, w:6, h:10 });
    }
  });

  function spawnEnemy(){
    enemies.push({ x: Math.random()*(W-40), y: -40, w: 36, h: 28, speed: 1.8 + Math.random()*1.6 });
  }

  function update(dt){
    if (!running) return;

    // update bullets
    for (let i = bullets.length-1; i>=0; i--){
      bullets[i].y -= 8;
      if (bullets[i].y < -20) bullets.splice(i,1);
    }

    // spawn enemies slowly
    enemyTimer += dt;
    if (enemyTimer > 800) { spawnEnemy(); enemyTimer = 0; }

    // update enemies
    for (let ei = enemies.length-1; ei>=0; ei--){
      enemies[ei].y += enemies[ei].speed;
      // check off screen (lose)
      if (enemies[ei].y > H){
        running = false;
        restartBtn.style.display = "inline-block";
        // push final score to server session
        postScore(score);
      }

      // bullets collide
      for (let bi = bullets.length-1; bi>=0; bi--){
        const b = bullets[bi];
        const e = enemies[ei];
        if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y){
          // hit
          bullets.splice(bi,1);
          enemies.splice(ei,1);
          score += 1;
          scoreDisplay.innerText = score;
          // local best
          if (score > best) { best = score; localStorage.setItem('bestScore', best); }
          // update server-side session score
          postScore(score);
          break;
        }
      }
    }
  }

  function draw(){
    // clear
    ctx.fillStyle = "#000015";
    ctx.fillRect(0,0,W,H);

    // blue halo border
    ctx.strokeStyle = "rgba(0,180,255,0.5)";
    ctx.lineWidth = 8;
    ctx.strokeRect(2,2,W-4,H-4);

    // draw ship
    ctx.fillStyle = "#00d7ff";
    ctx.fillRect(ship.x, ship.y, ship.w, ship.h);

    // bullets
    ctx.fillStyle = "#ffd27a";
    bullets.forEach(b => ctx.fillRect(b.x, b.y, b.w, b.h));

    // enemies
    ctx.fillStyle = "#ff6b6b";
    enemies.forEach(e => ctx.fillRect(e.x, e.y, e.w, e.h));

    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "18px Vazirmatn, Arial";
    ctx.fillText("امتیاز: " + score, 12, 26);
    ctx.fillText("رکورد محلی: " + best, W-170, 26);

    if (!running){
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(0,0,W,H);
      ctx.fillStyle = "#fff";
      ctx.font = "28px Vazirmatn, Arial";
      ctx.fillText("برای شروع روی دکمه کلیک کن", W/2 - 150, H/2 - 10);
    }
  }

  let last = performance.now();
  function loop(now){
    const dt = now - last;
    last = now;
    update(dt);
    draw();
    if (running) requestAnimationFrame(loop);
  }
  // POST به /update_score برای ذخیره در session
  function postScore(s){
    fetch('/update_score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: score=${encodeURIComponent(s)}
    }).catch(()=>{ /* ignore network errors */ });
  }

  // initial draw
  draw();
})();