export default class Map {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = "lightgrey";
    ctx.fillRect(0, 0, this.width, this.height);
  }
}
