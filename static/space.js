const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 500;

let spaceship = { x: 280, y: 440, size: 40 };
let bullets = [];
let enemies = [];
let score = 0;
let gameRunning = false;

// حرکت سفینه با موس
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    spaceship.x = e.clientX - rect.left - spaceship.size / 2;
});

// شلیک با Space بدون توقف موس
document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && gameRunning) {
        bullets.push({ x: spaceship.x + spaceship.size / 2 - 2, y: spaceship.y });
    }
});

// دکمه‌ها
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("homeBtn").addEventListener("click", () => {
    window.location.href = "/";
});

function startGame() {
    gameRunning = true;
    score = 0;
    enemies = [];
    bullets = [];
    spawnEnemies();
    gameLoop();
}

function restartGame() {
    startGame();
}

// ساخت دشمن‌ها
function spawnEnemies() {
    enemies = [];
    for (let i = 0; i < 5; i++) {
        enemies.push({
            x: Math.random() * (canvas.width - 40),
            y: Math.random() * 100,
            size: 40,
            speed: 2 + Math.random() * 2,
        });
    }
}

// حلقه بازی
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // زمینه بازی
    ctx.strokeStyle = "cyan";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // کشیدن سفینه
    ctx.fillStyle = "deepskyblue";
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.size, spaceship.size);

    // کشیدن تیرها
    ctx.fillStyle = "yellow";
    bullets.forEach((b, i) => {
        b.y -= 7;
        ctx.fillRect(b.x, b.y, 4, 10);
        if (b.y < 0) bullets.splice(i, 1);
    });

    // حرکت دشمن‌ها
    ctx.fillStyle = "red";
    enemies.forEach((enemy, i) => {
        enemy.y += enemy.speed;
        ctx.fillRect(enemy.x, enemy.y, enemy.size, enemy.size);

        // برخورد با تیر
        bullets.forEach((b, j) => {
            if (
                b.x < enemy.x + enemy.size &&
                b.x + 4 > enemy.x &&
                b.y < enemy.y + enemy.size &&
                b.y + 10 > enemy.y
            ) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score += 10;
                spawnEnemies();
            }
        });

        // برخورد با سفینه = باخت
        if (
            enemy.x < spaceship.x + spaceship.size &&
            enemy.x + enemy.size > spaceship.x &&
            enemy.y + enemy.size > spaceship.y
        ) {
            gameRunning = false;
            alert(💥 باختی! امتیاز نهایی: ${score});
        }
    });

    // امتیاز
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(امتیاز: ${score}, 10, 30);

    requestAnimationFrame(gameLoop);
}