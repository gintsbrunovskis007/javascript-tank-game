export default class Tank {
  constructor(x, y, size, speed, color, mapWidth, mapHeight) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move(direction, otherTank) {
    const oldX = this.x;
    const oldY = this.y;

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

    if (this.x < 0) {
      this.x = 0;
    }
    if (this.y < 0) {
      this.y = 0;
    }
    if (this.x + this.size > this.mapWidth) {
      this.x = this.mapWidth - this.size;
    }
    if (this.y + this.size > this.mapHeight) {
      this.y = this.mapHeight - this.size;
    }
    if (otherTank && this.isCollidingWith(otherTank)) {
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
}
