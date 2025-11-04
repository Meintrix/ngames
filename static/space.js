const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 600;

let player = { x: 280, y: 520, w: 40, h: 40, color: "#00ffff" };
let bullets = [];
let enemies = [];
let score = 0;
let gameOver = false;
let gameRunning = false;
let bestScore = localStorage.getItem("bestScore") || 0;

// 🎮 دکمه شروع و دوباره
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const scoreDisplay = document.getElementById("score");
const bestDisplay = document.getElementById("best");

startBtn.onclick = () => {
    gameRunning = true;
    startBtn.style.display = "none";
    restartBtn.style.display = "none";
    gameOver = false;
    score = 0;
    enemies = [];
    bullets = [];
    loop();
};

restartBtn.onclick = () => {
    startBtn.onclick();
};

// 🌀 کنترل موس برای حرکت سریع
canvas.addEventListener("mousemove", (e) => {
    if (!gameRunning) return;
    const rect = canvas.getBoundingClientRect();
    player.x = e.clientX - rect.left - player.w / 2;
});

// شلیک با کلیک
canvas.addEventListener("click", () => {
    if (gameRunning)
        bullets.push({ x: player.x + player.w / 2 - 3, y: player.y, w: 6, h: 10, color: "#0ff" });
});

function spawnEnemy() {
    let x = Math.random() * (canvas.width - 40);
    enemies.push({ x, y: -40, w: 40, h: 40, color: "#ff4040" });
}

function update() {
    if (!gameRunning) return;

    // حرکت گلوله‌ها
    bullets.forEach((b, i) => {
        b.y -= 6;
        if (b.y < -10) bullets.splice(i, 1);
    });

    // حرکت دشمن‌ها
    enemies.forEach((e, i) => {
        e.y += 3;
        if (e.y > canvas.height) enemies.splice(i, 1);
    });

    // برخورد گلوله و دشمن
    bullets.forEach((b, bi) => {
        enemies.forEach((e, ei) => {
            if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
                enemies.splice(ei, 1);
                bullets.splice(bi, 1);
                score++;
            }
        });
    });

    // برخورد بازیکن با دشمن
    enemies.forEach((e) => {
        if (
            player.x < e.x + e.w &&
            player.x + player.w > e.x &&
            player.y < e.y + e.h &&
            player.y + player.h > e.y
        ) {
            gameOver = true;
            gameRunning = false;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem("bestScore", bestScore);
            }
            restartBtn.style.display = "block";
        }
    });

    // ایجاد دشمن جدید
    if (Math.random() < 0.02) spawnEnemy();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // افکت دور زمین بازی
    ctx.strokeStyle = "rgba(0, 255, 255, 0.6)";
    ctx.lineWidth = 10;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // بازیکن
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.w, player.h);

    // گلوله‌ها
    bullets.forEach((b) => {
        ctx.fillStyle = b.color;
        ctx.fillRect(b.x, b.y, b.w, b.h);
    });

    // دشمن‌ها
    enemies.forEach((e) => {
        ctx.fillStyle = e.color;
        ctx.fillRect(e.x, e.y, e.w, e.h);
    });

    // امتیاز
    ctx.fillStyle = "#fff";
    ctx.font = "20px Arial";
    ctx.fillText("امتیاز: " + score, 20, 30);
    ctx.fillText("رکورد: " + bestScore, 480, 30);

    if (gameOver) {
        ctx.fillStyle = "#fff";
        ctx.font = "30px Arial";
        ctx.fillText("باختی 😢", 250, 300);
    }
}

function loop() {
    update();
    draw();
    if (gameRunning) requestAnimationFrame(loop);
}