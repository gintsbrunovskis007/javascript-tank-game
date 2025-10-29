export default class Bullet {
  constructor(x, y, speed, damage, color, angle) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.color = color;
    this.angle = angle;
    this.width = 5;
    this.height = 5;
    this.active = true;
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    if (!this.active) return;
    this.x += Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
  }
  isOffScreen(canvasWidth, canvasHeight) {
    return (
      this.x < 0 || this.x > canvasWidth || this.y < 0 || this.y > canvasHeight
    );
  }
  isCollidingWith(tank) {
    if (!tank.isAlive || !this.active) return false;
    return !(
      this.x + this.width <= tank.x ||
      this.x >= tank.x + tank.size ||
      this.y + this.height <= tank.y ||
      this.y >= tank.y + tank.size
    );
  }
  deactivate() {
    this.active = false;
  }
}
