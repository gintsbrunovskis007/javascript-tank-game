import Tank from "./Tank.js";
import Map from "./Map.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const map = new Map(canvas.width, canvas.height);

const redTank = new Tank(50, 50, 40, 5, "red", canvas.width, canvas.height);
const blueTank = new Tank(700, 500, 40, 5, "blue", canvas.width, canvas.height);

const redBulletController = new BulletController(canvas, blueTank);
const blueBulletController = new BulletController(canvas, redTank);

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  redTank.update();
  blueTank.update();

  let forward = 0;
  let rotate = 0;

  if (keys["ArrowUp"]) forward = 1;
  if (keys["ArrowDown"]) forward = -1;
  if (keys["ArrowLeft"]) rotate = -1;
  if (keys["ArrowRight"]) rotate = 1;

  redTank.move(forward, rotate);

  let forwardB = 0;
  let rotateB = 0;

  if (keys["w"] || keys["W"]) forwardB = 1;
  if (keys["s"] || keys["S"]) forwardB = -1;
  if (keys["a"] || keys["A"]) rotateB = -1;
  if (keys["d"] || keys["D"]) rotateB = 1;

  blueTank.move(forwardB, rotateB);

  // Check for tank-to-tank collision and respond
  if (blueTank.isCollidingWith(redTank)) {
    // If tanks are colliding, revert to their previous positions
    blueTank.x = blueTank.prevX || blueTank.x;
    blueTank.y = blueTank.prevY || blueTank.y;
    redTank.x = redTank.prevX || redTank.x;
    redTank.y = redTank.prevY || redTank.y;
  }

  // Store current positions as previous positions for next frame
  blueTank.prevX = blueTank.x;
  blueTank.prevY = blueTank.y;
  redTank.prevX = redTank.x;
  redTank.prevY = redTank.y;

  if (keys[" "]) redTank.shoot(redBulletController);
  if (keys["q"]) blueTank.shoot(blueBulletController);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.draw(ctx);
  redTank.draw(ctx);
  blueTank.draw(ctx);
  redBulletController.draw(ctx);
  blueBulletController.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
