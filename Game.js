import Tank from "./Tank.js";
import Map from "./Map.js";

const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const map = new Map(canvas.width, canvas.height);
const redTank = new Tank(50, 50, 40, 5, "red", canvas.width, canvas.height);
const blueTank = new Tank(700, 500, 40, 5, "blue", canvas.width, canvas.height);
const keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function gameLoop() {
  if (keys["ArrowUp"]) redTank.move("up", blueTank);
  if (keys["ArrowDown"]) redTank.move("down", blueTank);
  if (keys["ArrowLeft"]) redTank.move("left", blueTank);
  if (keys["ArrowRight"]) redTank.move("right", blueTank);
  if (keys["w"] || keys["W"]) blueTank.move("up", redTank);
  if (keys["s"] || keys["S"]) blueTank.move("down", redTank);
  if (keys["a"] || keys["A"]) blueTank.move("left", redTank);
  if (keys["d"] || keys["D"]) blueTank.move("right", redTank);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  map.draw(ctx);
  redTank.draw(ctx);
  blueTank.draw(ctx);
  requestAnimationFrame(gameLoop);
}

gameLoop();
