import { map, mapWidth, mapHeight } from './map.js'
import './main.css'
import { cos, sin, abs, round, dist, floor } from './math.js'

const app = document.querySelector('#app');
const degree = Math.PI / 180;

const player = {
  // map[x][y]
  x: 12,
  y: 12,
  dx: -1, // up 
  dy: 0,
  dir: Math.PI,
  moveSpeed: 0.3,
  rotationSpeed: 10 * degree,
  pov: 60 * degree,
  handleMove: (e) => {
    let ny, nx;
    if (e.key == 'w') {
      nx = player.x + player.dx * player.moveSpeed;
      ny = player.y + player.dy * player.moveSpeed;
    }
    if (e.key == 's') {
      nx = player.x - player.dx * player.moveSpeed;
      ny = player.y - player.dy * player.moveSpeed;
    }
    if (e.key == 'a') {
      nx = player.x - player.dy * player.moveSpeed;
      ny = player.y + player.dx * player.moveSpeed;
    }
    if (e.key == 'd') {
      nx = player.x + player.dy * player.moveSpeed;
      ny = player.y - player.dx * player.moveSpeed;
    }
    if (e.key == '[') {
      player.dir += player.rotationSpeed;
      if (player.dir > 2 * Math.PI) player.dir -= 2 * Math.PI;
      player.dx = Math.cos(player.dir);
      player.dy = Math.sin(player.dir);
    }
    if (e.key == ']') {
      player.dir -= player.rotationSpeed;
      if (player.dir < 0) player.dir += 2 * Math.PI;
      player.dx = Math.cos(player.dir);
      player.dy = Math.sin(player.dir);
    }

    if (nx !== undefined && ny !== undefined && map[round(nx)][round(ny)] != 1) {
      player.x = nx;
      player.y = ny;
    }
  }
}

window.addEventListener('keypress', (e) => {
  player.handleMove(e);
});


window.setInterval(() => {
  app.innerHTML = "";
  const worldCeil = document.createElement('div');
  worldCeil.className = 'ceil';

  const worldFloor = document.createElement('div');
  worldFloor.className = 'floor';

  // for (let i = 0; i < window.innerWidth; i++) {
  //   const wall = document.createElement('div');
  //   wall.className = 'wall';
  //   wall.style.left = `${i}px`;

  //   // const height = window.innerHeight * (i + 1) / app.clientWidth; 
  //   const height = 400;
  //   wall.style.height = `${height}px`;

  //   wall.style.top = `${window.innerHeight / 2 - height / 2}px`;
  //   app.append(wall);
  // }


  const minimap = document.createElement('div');
  minimap.className = 'minimap';

  app.append(worldCeil, worldFloor, minimap);

  for (let i = 0; i < mapHeight; i++) {
    for (let j = 0; j < mapWidth; j++) {
      if (map[i][j] == 1) {
        const minimapWall = document.createElement('div');
        minimapWall.className = 'minimap-wall';
        minimapWall.style.left = `${4 * j}px`
        minimapWall.style.top = `${4 * i}px`
        minimap.appendChild(minimapWall);
      }
    }
  }
  const minimapPlayer = document.createElement('div');
  minimapPlayer.className = 'minimap-player';
  minimapPlayer.style.left = `${4 * player.y}px`;
  minimapPlayer.style.top = `${4 * player.x}px`;

  minimap.append(minimapPlayer)


  function drawRayHit(x, y) {
    const ray = document.createElement('div');
    ray.className = 'minimap-ray-hit';
    ray.style.left = `${4 * y}px`
    ray.style.top = `${4 * x}px`
    minimap.appendChild(ray);
  }


  function checkCollider(dx, dy) {
    let step = (abs(dx) >= abs(dy)) ? abs(dx) : abs(dy);

    const ddx = dx / step;
    const ddy = dy / step;
    let rx = player.x;
    let ry = player.y;
    let ix, iy; 
    let collide = false; 
    let steps = 0; 
    while (true) {
      ix = round(rx);
      iy = round(ry);
      steps++;
      if (ix < 0 || ix >= mapHeight || iy < 0 || iy >= mapWidth) break;
      if (map[ix][iy] == 1) {
        collide = true; 
        break;
      }

      rx += ddx;
      ry += ddy;
    }
    drawRayHit(round(rx), round(ry));
    return {
      ix, 
      iy, 
      collide,
      steps,
    }
  }

  // screen to world
  const centerWidth = window.innerWidth / 2
  for (let x = 0; x < window.innerWidth; x++) {
    const dx = cos(player.dir + (centerWidth - x) / centerWidth * player.pov / 2);
    const dy = sin(player.dir + (centerWidth - x) / centerWidth * player.pov / 2);
    const {ix, iy, collide, steps} = checkCollider(dx, dy);


    if (collide) {
      const rx = player.x + steps * dx;
      const ry = player.y + steps * dy;
      const fixFish = cos((centerWidth - x)  /  centerWidth * player.pov / 2); 
      const z = dist(rx, ry, player.x, player.y);

      const wallHeight = 400.00 / z * fixFish;  
      const wall = document.createElement('div');
      wall.className = 'wall';
      wall.style.left = `${x}px`;
  
      wall.style.height = `${wallHeight}px`;
      wall.style.top = `${window.innerHeight / 2 - wallHeight / 2}px`;
      app.append(wall);
    }

    


  }

}, 100)