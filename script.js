// Recursos disponibles ✨
// Personajes
const player1 = "images/Character-1.png";
const player2 = "images/Character-2.png";
const player3 = "images/Character-3.png";
const player4 = "images/Character-4.png";
// Enemigos
const enemy1 = "images/Enemy-1.png";
const enemy2 = "images/Enemy-2.png";
const enemy3 = "images/Enemy-3.png";
// Minions
const minion1 = "images/Minion-1.png";
const minion2 = "images/Minion-2.png";
const minion3 = "images/Minion-3.png";
// Armas
const weapon1 = "images/w-1.png";
const weapon2 = "images/w-2.png";
const weapon3 = "images/w-3.png";
const weapon4 = "images/w-4.png";
const weapon5 = "images/w-5.png";
// Fondo
const bg = "images/bg.jpg";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

let interval;
const minions = [];
const shoots = [];
let frames = 0;

class Board {
  constructor() {
    this.img = new Image();
    this.img.src = bg;
    this.img.onload = () => {
      ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
    };
  }
  draw() {
    ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
  }
}

class Player {
  constructor() {
    this.width = 60;
    this.height = 76;
    this.x = 0;
    this.y = 400 - this.height;
    this.img = new Image();
    this.img.src = player3;
    this.img.onload = () => {
      ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    };
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  moveUp() {
    this.y -= 10;
  }
  moveDown() {
    this.y += 10;
  }
  moveLeft() {
    this.x -= 10;
  }
  moveRight() {
    this.x += 10;
  }
  touchEnemy(enemy) {
    return (
      this.x < enemy.x + enemy.width &&
      this.x + this.width > enemy.x &&
      this.y < enemy.y + enemy.height &&
      this.y + this.height > enemy.y
    );
  }
  shoot() {
    const w = new Weapon(this.x + this.width, this.y + this.height / 2 - 12);
    shoots.push(w);
  }
}

class Weapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 15;
    this.img = new Image();
    this.img.src = weapon3;
  }
  draw() {
    this.x++;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

class Enemy {
  constructor() {
    this.width = 80;
    this.height = 110;
    this.hp = 50;
    this.x = canvas.width - this.width;
    this.y = canvas.height - this.height - 40;
    this.img = new Image();
    this.img.src = enemy3;
    this.img.onload = () => {
      this.draw();
    };
  }
  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
  damage() {
    this.hp--;
  }
  touchEnemy(weapon) {
    return (
      this.x < weapon.x + weapon.width &&
      this.x + this.width > weapon.x &&
      this.y < weapon.y + weapon.height &&
      this.y + this.height > weapon.y
    );
  }
}
class Minion {
  constructor(x, y) {
    this.width = 20;
    this.height = 40;
    this.x = x;
    this.y = y;
    this.img = new Image();
    this.img.src = minion3;
    this.img.onload = () => {
      this.draw();
    };
  }
  draw() {
    this.x--;
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }
}

// declaraciones
const board = new Board();
const player = new Player();
const enemy = new Enemy();
const minion = new Minion(0, 0);

//juego
function update() {
  frames++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board.draw();
  player.draw();
  enemy.draw();
  generateMinions();
  drawMinions();
  checkCollition();
  drawShoots();
  drawLife();
}
// inicio
function start() {
  interval = setInterval(update, 1000 / 60);
}

function gameOver() {
  clearInterval(interval);
}

function win() {
  clearInterval(interval);
  console.log("win");
}
// Crear minions
function generateMinions() {
  if (frames % 100 === 0) {
    const max = canvas.height;
    const min = canvas.height / 2;
    const randomHeight = Math.floor(Math.random() * max - 40) + min + 40;
    const minion = new Minion(enemy.x, randomHeight);
    minions.push(minion);
  }
}
function drawMinions() {
  minions.forEach(minion => minion.draw());
}

function drawShoots() {
  shoots.forEach(shoot => shoot.draw());
}

function checkCollition() {
  minions.forEach(minion => {
    if (player.touchEnemy(minion)) {
      gameOver();
    }
  });
  shoots.forEach((shoot, index) => {
    if (enemy.touchEnemy(shoot)) {
      shoots.splice(index, 1);
      enemy.damage();
    }
  });
  if (enemy.hp === 0) {
    win();
  }
}

function drawLife() {
  ctx.fillRect(0, 0, (canvas.width * enemy.hp) / 50, 20);
}

start();

addEventListener("keypress", function(e) {
  if (e.keyCode === 119) {
    player.moveUp();
  } else if (e.keyCode === 115) {
    player.moveDown();
  } else if (e.keyCode === 97) {
    player.moveLeft();
  } else if (e.keyCode === 100) {
    player.moveRight();
  } else if (e.keyCode === 32) {
    player.shoot();
  }
});
