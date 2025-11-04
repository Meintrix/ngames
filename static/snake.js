(() => {
  const canvas = document.getElementById('snakeCanvas');
  const ctx = canvas.getContext('2d');
  const box = 20;
  let snake = [{ x: 9*box, y: 9*box }];
  let dir = null;
  let food = { x: Math.floor(Math.random()*20)*box, y: Math.floor(Math.random()*20)*box };
  let score = 0;

  document.addEventListener('keydown', e => {
    if (e.keyCode == 37 && dir != 'RIGHT') dir = 'LEFT';
    else if (e.keyCode == 38 && dir != 'DOWN') dir = 'UP';
    else if (e.keyCode == 39 && dir != 'LEFT') dir = 'RIGHT';
    else if (e.keyCode == 40 && dir != 'UP') dir = 'DOWN';
  });

  function draw(){
    ctx.fillStyle = '#000';
    ctx.fillRect(0,0,400,400);

    for (let i=0;i<snake.length;i++){
      ctx.fillStyle = i==0 ? '#00e0ff' : '#fff';
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = '#ff6666';
    ctx.fillRect(food.x, food.y, box, box);

    let headX = snake[0].x;
    let headY = snake[0].y;
    if (dir == 'LEFT') headX -= box;
    if (dir == 'UP') headY -= box;
    if (dir == 'RIGHT') headX += box;
    if (dir == 'DOWN') headY += box;

    if (headX == food.x && headY == food.y){
      score++;
      food = { x: Math.floor(Math.random()*20)*box, y: Math.floor(Math.random()*20)*box };
    } else {
      snake.pop();
    }

    let newHead = { x: headX, y: headY };

    // collision with self
    for (let i=0;i<snake.length;i++){
      if (snake[i].x == newHead.x && snake[i].y == newHead.y){
        clearInterval(game);
        alert('باختی! امتیاز: ' + score);
        window.location.href = '/';
        return;
      }
    }

    if (headX < 0 || headY < 0 || headX >= 400 || headY >= 400){
      clearInterval(game);
      alert('باختی! امتیاز: ' + score);
      window.location.href = '/';
      return;
    }

    snake.unshift(newHead);
  }

  let game = setInterval(draw, 120);
})();