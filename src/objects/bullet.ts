import { TILE_SIZE } from "../config/constants";

export default class Bullet {
  x: number;
  y: number;
  distance: number;
  speed: number;
  isDestroyed: boolean;

  constructor(x: number, y: number, distance: number, speed: number) {
    this.x = x; // Current position
    this.y = y;
    this.distance = distance;
    this.speed = speed;
    this.isDestroyed = false;
  }

  // Update the rocket's position
  update() {
    this.y += 1;

    if (this.y >= this.distance) {
      this.isDestroyed = true;
    }
  }

  // Draw the rocket
  draw(ctx: CanvasRenderingContext2D) {
    const size = TILE_SIZE;
    const offsetX = -TILE_SIZE / 2;
    const offsetY = (-8 * TILE_SIZE) / 6;

    const bullet = new Image();

    bullet.src = "/textures/towerDefense_tile295.png";

    ctx.drawImage(bullet, offsetX, -this.y * TILE_SIZE + offsetY, size, size);
  }
}
