import { map, mapWidth, mapHeight } from './map.js'
import './main.css'
const app = document.querySelector('#app');
const degree = Math.PI / 180;

const player = {
  // map[x][y]
  x: 12,
  y: 12,
  dir: 0, // up 
  moveSpeed: 0.3,
  rotationSpeed: 10 * degree,
  pov: 60 * degree,
  getRay: () => {
    return {
      dx: Math.cos(player.dir),
      dy: Math.sin(player.dir),
    }
  },
  handleMove: (e) => {
    if (e.key == 'w') {
      player.x -= Math.cos(player.dir) * player.moveSpeed;
      player.y -= Math.sin(player.dir) * player.moveSpeed;
    }
    if (e.key == 's') {
      player.x += Math.cos(player.dir) * player.moveSpeed;
      player.y += Math.sin(player.dir) * player.moveSpeed;
    }
    if (e.key == 'a') {
      player.x += Math.sin(player.dir) * player.moveSpeed;
      player.y -= Math.cos(player.dir) * player.moveSpeed;
    }
    if (e.key == 'd') {
      player.x -= Math.sin(player.dir) * player.moveSpeed;
      player.y += Math.cos(player.dir) * player.moveSpeed;
    }
    if (e.key == '[') {
      player.dir += player.rotationSpeed;
    }
    if (e.key == ']') {
      player.dir -= player.rotationSpeed;
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

  for (let i = 0; i < window.innerWidth ; i++) {
    const wall = document.createElement('div');
    wall.className = 'wall';
    wall.style.left = `${i}px`;
    
    // const height = window.innerHeight * (i + 1) / app.clientWidth; 
    const height = 400;
    wall.style.height = `${height}px`;

    wall.style.top = `${window.innerHeight /2 - height / 2}px`;
    worldFloor.append(wall);
  }


  const minimap = document.createElement('div');
  minimap.className = 'minimap';

  app.append(worldCeil, worldFloor, minimap);

  const {minimapLeft, minimapTop} = minimap.getClientRects()
  for (let i = 0 ; i < mapHeight; i++) {
    for (let j = 0 ; j < mapWidth; j++) {

      console.log(map.length)
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
  minimapPlayer.style.left = `${player.y}px`;
  minimapPlayer.style.top = `${player.x}px`;

  const minimapPlayerRay = document.createElement('div');
  minimapPlayerRay.className = 'minimap-ray';
  minimapPlayerRay.style.top = `${player.x - 10 * Math.cos(player.dir)}px`;
  minimapPlayerRay.style.left = `${player.y - 10 * Math.sin(player.dir)}px`;


  minimap.append(minimapPlayer, minimapPlayerRay)


}, 16)