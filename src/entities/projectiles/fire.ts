import { TILE_SIZE } from "../../config/constants";
import { Bullet, FireConfig } from "../../types/bullets";

export default class Fire implements Bullet {
  x: number;
  y: number;
  distance: number;
  speed: number;
  isDestroyed: boolean;
  angle: number;
  now = 0;
  offsetX: number;
  offsetY: number;
  texture: string;

  constructor({
    x,
    y,
    distance,
    speed,
    angle,
    texture,
    offsetX,
    offsetY,
  }: FireConfig) {
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.speed = speed;
    this.isDestroyed = false;
    this.angle = angle;
    this.offsetX = offsetX ?? -TILE_SIZE / 2;
    this.offsetY = offsetY ?? (-8 * TILE_SIZE) / 6;
    this.texture = texture;
  }

  // Update the rocket's position
  update() {
    this.now += this.speed;

    if (this.now >= this.distance) {
      this.isDestroyed = true;
    }
  }

  // Draw the rocket
  draw(ctx: CanvasRenderingContext2D) {
    const size = TILE_SIZE;

    const bullet = new Image();

    bullet.src = `/textures/${this.texture}.png`;

    ctx.save();

    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);

    ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    ctx.drawImage(
      bullet,
      this.offsetX,
      -this.now * TILE_SIZE + this.offsetY,
      size,
      size
    );

    ctx.restore();
  }
}
