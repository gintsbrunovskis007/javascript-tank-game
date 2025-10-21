import Tank from "./Tank.js";
import Map from "./Map.js";
import BulletController from "./BulletController.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const map = new Map(canvas.width, canvas.height);

// Create tanks first
const redTank = new Tank(50, 50, 40, 5, "red", canvas.width, canvas.height);
const blueTank = new Tank(700, 500, 40, 5, "blue", canvas.width, canvas.height);

// Create bullet controllers with enemy targets
const redBulletController = new BulletController(canvas, blueTank); // Red shoots blue
const blueBulletController = new BulletController(canvas, redTank); // Blue shoots red

const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  // Update tanks (for cooldowns)
  redTank.update();
  blueTank.update();

  // Red tank movement
  if (keys["ArrowUp"]) redTank.move("up", blueTank);
  if (keys["ArrowDown"]) redTank.move("down", blueTank);
  if (keys["ArrowLeft"]) redTank.move("left", blueTank);
  if (keys["ArrowRight"]) redTank.move("right", blueTank);

  // Blue tank movement
  if (keys["w"] || keys["W"]) blueTank.move("up", redTank);
  if (keys["s"] || keys["S"]) blueTank.move("down", redTank);
  if (keys["a"] || keys["A"]) blueTank.move("left", redTank);
  if (keys["d"] || keys["D"]) blueTank.move("right", redTank);

  // Shooting - Space for red, Shift for blue
  if (keys[" "]) redTank.shoot(redBulletController);
  if (keys["q"]) blueTank.shoot(blueBulletController);

  // Clear and draw everything
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.draw(ctx);
  redTank.draw(ctx);
  blueTank.draw(ctx);
  redBulletController.draw(ctx);
  blueBulletController.draw(ctx);

  requestAnimationFrame(gameLoop);
}

gameLoop();
