const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const recordDisplay = document.getElementById("record");
const restartBtn = document.getElementById("restartBtn");

const box = 20;
let snake, direction, food, score, record, game;

// رکورد از مرورگر (localStorage)
record = localStorage.getItem("snakeRecord") || 0;
recordDisplay.textContent = "رکورد: " + record;

function initGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = null;
    food = {
        x: Math.floor(Math.random() * 20) * box,
        y: Math.floor(Math.random() * 20) * box,
    };
    score = 0;
    scoreDisplay.textContent = "امتیاز: ۰";
    restartBtn.style.display = "none";

    if (game) clearInterval(game);
    game = setInterval(draw, 100);
}

document.addEventListener("keydown", directionControl);

function directionControl(event) {
    if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    else if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // غذا
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // مار
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "#0f0" : "limegreen";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    if (headX === food.x && headY === food.y) {
        score++;
        scoreDisplay.textContent = "امتیاز: " + score;

        // رکورد جدید؟
        if (score > record) {
            record = score;
            localStorage.setItem("snakeRecord", record);
            recordDisplay.textContent = "رکورد: " + record;
        }

        food = {
            x: Math.floor(Math.random() * 20) * box,
            y: Math.floor(Math.random() * 20) * box,
        };
    } else {
        snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // باخت
    if (
        headX < 0 ||
        headY < 0 ||
        headX >= canvas.width ||
        headY >= canvas.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        restartBtn.style.display = "block";
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

function restartGame() {
    initGame();
}

initGame();