const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let bullets = [];
let enemies = [];
let score = 0;
let gameActive = true;

const ship = {
  x: canvas.width / 2,
  y: canvas.height - 100,
  width: 40,
  height: 40,
  color: '#00ffcc'
};

window.addEventListener('mousemove', e => {
  ship.x = e.clientX - ship.width / 2;
  ship.y = e.clientY - ship.height / 2;
});

window.addEventListener('click', () => {
  if (!gameActive) return;
  bullets.push({ x: ship.x + 18, y: ship.y, width: 4, height: 10 });
});

function spawnEnemy() {
  if (!gameActive) return;
  const x = Math.random() * (canvas.width - 40);
  enemies.push({ x, y: -40, width: 40, height: 40, color: 'red' });
}

setInterval(spawnEnemy, 700);

function update() {
  if (!gameActive) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw ship
  ctx.fillStyle = ship.color;
  ctx.fillRect(ship.x, ship.y, ship.width, ship.height);

  // Draw bullets
  ctx.fillStyle = '#fff';
  bullets.forEach((b, i) => {
    b.y -= 10;
    ctx.fillRect(b.x, b.y, b.width, b.height);
    if (b.y < 0) bullets.splice(i, 1);
  });

  // Draw enemies
  enemies.forEach((e, ei) => {
    e.y += 4;
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x, e.y, e.width, e.height);

    // Collision
    bullets.forEach((b, bi) => {
      if (b.x < e.x + e.width && b.x + b.width > e.x &&
          b.y < e.y + e.height && b.y + b.height > e.y) {
        bullets.splice(bi, 1);
        enemies.splice(ei, 1);
        score++;
        localStorage.setItem('playerScore', Number(localStorage.getItem('playerScore') || 0) + 1);
      }
    });

    // Game over
    if (e.y + e.height >= ship.y &&
        e.x < ship.x + ship.width && e.x + e.width > ship.x) {
      gameActive = false;
      alert('💥 باختی! امتیازت: ' + score);
      window.location.href = '/';
    }
  });

  requestAnimationFrame(update);
}
update();