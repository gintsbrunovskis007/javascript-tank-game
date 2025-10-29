import Bullet from "./Bullet.js";

export default class BulletController {
  bullets = [];
  constructor(canvas, enemyTank) {
    this.canvas = canvas;
    this.enemyTank = enemyTank;
  }
  shoot(x, y, speed, damage, color, angle) {
    this.bullets.push(new Bullet(x, y, speed, damage, color, angle));
  }
  draw(ctx) {
    this.bullets.forEach((bullet) => {
      if (bullet.active) {
        bullet.update();
        bullet.draw(ctx);
        if (this.enemyTank && bullet.isCollidingWith(this.enemyTank)) {
          this.enemyTank.takeDamage();
          bullet.deactivate();
        }
      }
    });
    this.bullets = this.bullets.filter(
      (bullet) =>
        bullet.active &&
        !bullet.isOffScreen(this.canvas.width, this.canvas.height)
    );
  }
}
