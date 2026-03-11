//your code here
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Snake Game</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #1a1a2e;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-family: 'Courier New', monospace;
  }
  .scoreBoard {
    color: #00ff88;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 16px;
    letter-spacing: 2px;
  }
  #gameContainer {
    width: 400px;
    height: 400px;
    display: grid;
    grid-template-columns: repeat(40, 10px);
    grid-template-rows: repeat(40, 10px);
    border: 2px solid #00ff88;
    background: #0f0f23;
    position: relative;
  }
  .pixel {
    width: 10px;
    height: 10px;
  }
  .snakeBodyPixel {
    background: #00ff88;
    border-radius: 2px;
  }
  .food {
    background: #ff4757;
    border-radius: 50%;
  }
  .gameOver {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #ff4757;
    font-size: 28px;
    font-weight: bold;
  }
  .gameOver button {
    margin-top: 16px;
    padding: 8px 24px;
    background: #00ff88;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    font-family: inherit;
  }
</style>
</head>
<body>

<div class="scoreBoard">Score: <span id="scoreValue">0</span></div>
<div id="gameContainer"></div>

<script>
  const COLS = 40, ROWS = 40;
  const container = document.getElementById('gameContainer');

  // Build grid
  const pixels = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c + 1;
      const div = document.createElement('div');
      div.className = 'pixel';
      div.id = `pixel${id}`;
      container.appendChild(div);
      pixels.push(div);
    }
  }

  function getPixel(row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return null;
    return pixels[row * COLS + col];
  }

  function pixelId(row, col) {
    return row * COLS + col + 1;
  }

  let snake, dir, nextDir, food, score, gameInterval, running;

  function init() {
    // Clear all
    pixels.forEach(p => { p.className = 'pixel'; });
    score = 0;
    document.getElementById('scoreValue').textContent = 0;

    // Remove game over screen if present
    const go = container.querySelector('.gameOver');
    if (go) container.removeChild(go);

    // Snake starts at row 19 (0-indexed), col 0, moving right
    snake = [];
    for (let c = 2; c >= 0; c--) {
      snake.push({ row: 19, col: c });
    }
    dir = { row: 0, col: 1 };
    nextDir = { row: 0, col: 1 };

    renderSnake();
    placeFood();

    running = true;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
  }

  function renderSnake() {
    snake.forEach(seg => {
      const p = getPixel(seg.row, seg.col);
      if (p) {
        p.className = 'pixel snakeBodyPixel';
        p.id = `pixel${pixelId(seg.row, seg.col)}`;
      }
    });
  }

  function placeFood() {
    let pos;
    do {
      const r = Math.floor(Math.random() * ROWS);
      const c = Math.floor(Math.random() * COLS);
      pos = { row: r, col: c };
    } while (snake.some(s => s.row === pos.row && s.col === pos.col));

    food = pos;
    const p = getPixel(food.row, food.col);
    if (p) {
      p.className = 'pixel food';
      p.id = `pixel${pixelId(food.row, food.col)}`;
    }
  }

  function gameLoop() {
    dir = nextDir;
    const head = snake[0];
    const newHead = { row: head.row + dir.row, col: head.col + dir.col };

    // Wall collision
    if (newHead.row < 0 || newHead.row >= ROWS || newHead.col < 0 || newHead.col >= COLS) {
      endGame(); return;
    }

    // Self collision
    if (snake.some(s => s.row === newHead.row && s.col === newHead.col)) {
      endGame(); return;
    }

    const ateFood = newHead.row === food.row && newHead.col === food.col;

    // Clear tail before moving (unless eating)
    if (!ateFood) {
      const tail = snake.pop();
      const tp = getPixel(tail.row, tail.col);
      if (tp) tp.className = 'pixel';
    }

    snake.unshift(newHead);

    // Render new head
    const hp = getPixel(newHead.row, newHead.col);
    if (hp) {
      hp.className = 'pixel snakeBodyPixel';
      hp.id = `pixel${pixelId(newHead.row, newHead.col)}`;
    }

    if (ateFood) {
      score++;
      document.getElementById('scoreValue').textContent = score;
      placeFood();
    }
  }

  function endGame() {
    clearInterval(gameInterval);
    running = false;
    const go = document.createElement('div');
    go.className = 'gameOver';
    go.innerHTML = `GAME OVER<br>Score: ${score}<button onclick="init()">Restart</button>`;
    container.appendChild(go);
  }

  document.addEventListener('keydown', e => {
    if (!running) return;
    switch(e.key) {
      case 'ArrowUp':    if (dir.row !== 1)  nextDir = { row: -1, col: 0 }; break;
      case 'ArrowDown':  if (dir.row !== -1) nextDir = { row: 1,  col: 0 }; break;
      case 'ArrowLeft':  if (dir.col !== 1)  nextDir = { row: 0,  col: -1}; break;
      case 'ArrowRight': if (dir.col !== -1) nextDir = { row: 0,  col: 1 }; break;
    }
  });

  init();
</script>
</body>
</html>