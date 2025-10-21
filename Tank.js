export default class Tank {
  constructor(x, y, size, speed, color, mapWidth, mapHeight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.direction = "right";
    this.shootCooldown = 0;
    this.shootDelay = 30;
    this.isAlive = true;
  }

  draw(ctx) {
    if (!this.isAlive) return;

    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);

    ctx.fillStyle = "black";
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    switch (this.direction) {
      case "up":
        ctx.fillRect(centerX - 2, this.y - 10, 4, 10);
        break;
      case "down":
        ctx.fillRect(centerX - 2, this.y + this.size, 4, 10);
        break;
      case "left":
        ctx.fillRect(this.x - 10, centerY - 2, 10, 4);
        break;
      case "right":
        ctx.fillRect(this.x + this.size, centerY - 2, 10, 4);
        break;
    }
  }

  move(direction, otherTank) {
    if (!this.isAlive) return;

    const oldX = this.x;
    const oldY = this.y;
    this.direction = direction;

    switch (direction) {
      case "up":
        this.y -= this.speed;
        break;
      case "down":
        this.y += this.speed;
        break;
      case "left":
        this.x -= this.speed;
        break;
      case "right":
        this.x += this.speed;
        break;
    }

    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.size > this.mapWidth) this.x = this.mapWidth - this.size;
    if (this.y + this.size > this.mapHeight)
      this.y = this.mapHeight - this.size;

    if (otherTank && otherTank.isAlive && this.isCollidingWith(otherTank)) {
      this.x = oldX;
      this.y = oldY;
    }
  }

  isCollidingWith(otherTank) {
    return !(
      this.x + this.size <= otherTank.x ||
      this.x >= otherTank.x + otherTank.size ||
      this.y + this.size <= otherTank.y ||
      this.y >= otherTank.y + otherTank.size
    );
  }

  shoot(bulletController) {
    if (!this.isAlive || this.shootCooldown > 0) return false;

    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    let bulletX = centerX - 2.5;
    let bulletY = centerY - 2.5;

    switch (this.direction) {
      case "up":
        bulletY = this.y - 5;
        break;
      case "down":
        bulletY = this.y + this.size;
        break;
      case "left":
        bulletX = this.x - 5;
        break;
      case "right":
        bulletX = this.x + this.size;
        break;
    }

    bulletController.shoot(bulletX, bulletY, 7, 10, this.color, this.direction);
    this.shootCooldown = this.shootDelay;
    return true;
  }

  update() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }
  }

  respawn() {
    this.isAlive = true;
    this.x = Math.random() * (this.mapWidth - this.size);
    this.y = Math.random() * (this.mapHeight - this.size);
  }

  takeDamage() {
    this.isAlive = false;
    setTimeout(() => {
      this.respawn();
    }, 1000);
  }
}
