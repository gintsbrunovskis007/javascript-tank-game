export default class Tank {
  // This is the constructor function for your tank. It runs when you create a new tank object, e.g., new Tank(50, 50, 30, 2, "green", 800, 600).
  constructor(x, y, size, speed, color, mapWidth, mapHeight) {
    this.x = x; // x and y: the tank’s starting coordinates on the map.
    this.y = y; // x and y: the tank’s starting coordinates on the map.
    this.size = size; // size: how big the tank is (likely the width/height for drawing a square or circle).
    this.speed = speed; // speed: how fast the tank moves per frame.
    this.color = color; // color: the color used when drawing the tank.
    this.mapWidth = mapWidth; // mapWidth and mapHeight: the dimensions of the game map, used for boundaries.
    this.mapHeight = mapHeight; // mapWidth and mapHeight: the dimensions of the game map, used for boundaries.
    this.angle = 0; // angle: the direction the tank is facing, in radians (0 usually means pointing right).
    this.rotationSpeed = 0.05; // rotationSpeed: how fast the tank rotates when turning. For example, each frame it might rotate by x radians.
    this.shootCooldown = 0; // shootCooldown: tracks how many frames until the tank can shoot again. Starts at 0, meaning it can shoot immediately.
    this.shootDelay = 30; // shootDelay: the number of frames to wait between shots. Here, 30 frames means roughly half a second if the game runs at 60 FPS.
    this.isAlive = true; // Tracks whether the tank is still active in the game. If false, it won’t be drawn or move.
    this.prevX = x; // Add this line
    this.prevY = y; // Add this line
  }

  draw(ctx) {
    // Check if the tank is alive. If isAlive is false, the function exits early and the tank isn’t drawn.
    if (!this.isAlive) return;

    // Save the current canvas state. This preserves transformations (like translation and rotation) so that they don’t affect other drawings.
    ctx.save();

    // Calculates the center of the tank based on its top-left corner (x, y).
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    // Moves the canvas origin to the tank’s center. This makes rotation around the center easier.
    ctx.translate(centerX, centerY);

    // Rotates the canvas by this.angle radians. After this, anything drawn is rotated around the new origin (the tank center).
    //This is why the tank’s barrel will point in the direction of angle.
    ctx.rotate(this.angle);

    // fillStyle sets the color for the body.
    ctx.fillStyle = this.color;

    // Draws the tank body as a square centered at (0,0) (the translated center).
    // Coordinates are offset by -size/2 so the square is centered correctly.
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);

    // fillStyle sets the color for the barrel.
    ctx.fillStyle = "black";

    // Draws the tank barrel as a small rectangle sticking out from the right side of the body.
    // Positioned relative to the center, rotated along with the tank.
    ctx.fillRect(this.size / 2, -2, 10, 4);

    // Draws the tank barrel as a small rectangle sticking out from the right side of the body.
    // Positioned relative to the center, rotated along with the tank.
    ctx.restore();

    // Summary, this method:
    // 1. Checks if the tank is alive.
    // 2. Moves the canvas origin to the tank’s center.
    // 3. Rotates it according to the tank’s angle.
    // 4. Draws the tank body and barrel.
    // 5. Restores the canvas so other elements aren’t rotated.
  }

  move(forward, rotate) {
    // Exits early if the tank is dead; dead tanks don’t move.
    if (!this.isAlive) return;

    // Rotate the tank:
    // rotate could be -1, 0, or 1 depending on player input (left, none, right).
    // Multiply by rotationSpeed to control how fast the tank turns per frame.
    // Adds to this.angle because rotation is cumulative.
    this.angle += rotate * this.rotationSpeed;

    // Calculate how much the tank moves based on its angle:
    // forward is 1 for moving forward, -1 for backward, or 0 for stationary.
    // dx and dy are the changes in x and y coordinates.
    // Math.cos(angle) gives horizontal movement, Math.sin(angle) gives vertical movement.
    const dx = Math.cos(this.angle) * this.speed * forward;
    const dy = Math.sin(this.angle) * this.speed * forward;

    // Stores old position (useful if you want to undo movement on collision later).
    const oldX = this.x;
    const oldY = this.y;

    // Updates position by adding dx and dy.
    this.x += dx;
    this.y += dy;

    // Boundary checking: prevents the tank from leaving the map.
    // If it hits an edge, its position is clamped so it stays inside the map.
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
    if (this.x + this.size > this.mapWidth) this.x = this.mapWidth - this.size;
    if (this.y + this.size > this.mapHeight) {
      this.y = this.mapHeight - this.size;
    }

    // Summary: rotates and moves the tank, respecting map boundaries.
  }

  // Axis-Aligned Bounding Box (AABB) collision detection.
  // Checks if this tank overlaps with otherTank:
  // If one tank is completely to the left, right, above, or below the other, they don’t collide.
  // The !() negates that logic to detect overlap, returning true if there is a collision.
  isCollidingWith(otherTank) {
    return !(
      this.x + this.size <= otherTank.x ||
      this.x >= otherTank.x + otherTank.size ||
      this.y + this.size <= otherTank.y ||
      this.y >= otherTank.y + otherTank.size
    );

    // Summary: detects collisions with another tank using simple rectangle math.
    // Together, these let tanks navigate a bounded map and respond to collisions, which is essential for gameplay like Tank Trouble.
  }

  shoot(bulletController) {
    // Early exit conditions:
    // If the tank is dead (!this.isAlive) → it can’t shoot.
    // If shootCooldown > 0 → it’s still waiting between shots.
    // Returns false if shooting isn’t possible.
    if (!this.isAlive || this.shootCooldown > 0) return false;

    // Calculates the center of the tank, which is the base point for the barrel.
    const centerX = this.x + this.size / 2;
    const centerY = this.y + this.size / 2;

    // The barrel extends 10 pixels from the tank body.
    // This is used to place the bullet at the tip of the barrel instead of inside the tank.
    const barrelLength = 10;

    // Computes bullet spawn position:
    // Math.cos(this.angle) and Math.sin(this.angle) give the direction the tank is facing.
    // this.size / 2 + barrelLength moves the bullet to the tip of the barrel.
    // -2.5 offsets the bullet’s position so that the bullet (assumed size 5x5) is centered on its tip.
    const bulletX =
      centerX + Math.cos(this.angle) * (this.size / 2 + barrelLength) - 2.5;
    const bulletY =
      centerY + Math.sin(this.angle) * (this.size / 2 + barrelLength) - 2.5;

    // bulletController.shoot(bulletX, bulletY, 7, 10, this.color, this.angle);
    bulletController.shoot(bulletX, bulletY, 7, 10, this.color, this.angle);

    // Resets the tank’s cooldown so it can’t shoot again until shootDelay frames pass.
    // Implements a rate of fire limit.    this.shootCooldown = this.shootDelay;
    this.shootCooldown = this.shootDelay;

    // Returns true to indicate a bullet was successfully fired.
    return true;
  }

  // Called every frame to update the tank’s state.
  // Reduces the shooting cooldown:
  // If the tank recently fired, shootCooldown is positive.
  // Each frame, it decreases by 1 until it reaches 0, allowing the tank to shoot again.
  // Keeps firing rate consistent without blocking other updates.
  update() {
    if (this.shootCooldown > 0) {
      this.shootCooldown--;
    }

    // Summary: manages shoot cooldown per frame.
  }

  // Brings a dead tank back to life.
  // Randomizes spawn position within the map boundaries:
  // Math.random() * (mapWidth - size) ensures the tank fully fits on the map.
  // Sets isAlive = true so it can move, shoot, and be drawn again.
  respawn() {
    this.isAlive = true;
    this.x = Math.random() * (this.mapWidth - this.size);
    this.y = Math.random() * (this.mapHeight - this.size);

    // Summary: randomly places a tank back on the map.
  }

  // Called when the tank is hit by a bullet.
  // Marks the tank as dead (isAlive = false) so it disappears and can’t move or shoot.
  // Uses setTimeout to respawn the tank after 1 second (1000 ms).
  // The arrow function () => this.respawn() ensures this still refers to the tank object inside the timeout.
  takeDamage() {
    this.isAlive = false;
    setTimeout(() => {
      this.respawn();
    }, 1000);

    //Summary: handles death, disables the tank, and schedules respawn.
  }
}
