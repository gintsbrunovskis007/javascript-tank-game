import Bullet from "./Bullet.js";

export default class BulletController {
  bullets = [];

  constructor(canvas, enemyTank) {
    this.canvas = canvas;
    this.enemyTank = enemyTank; // The tank this controller should damage
  }

  shoot(x, y, speed, damage, color, direction) {
    this.bullets.push(new Bullet(x, y, speed, damage, color, direction));
  }

  draw(ctx) {
    this.bullets.forEach((bullet) => {
      if (bullet.active) {
        bullet.update();
        bullet.draw(ctx);

        // Check collision with enemy tank
        if (this.enemyTank && bullet.isCollidingWith(this.enemyTank)) {
          this.enemyTank.takeDamage();
          bullet.deactivate();
        }
      }
    });

    // Remove inactive or off-screen bullets
    this.bullets = this.bullets.filter(
      (bullet) =>
        bullet.active &&
        !bullet.isOffScreen(this.canvas.width, this.canvas.height)
    );
  }
}
