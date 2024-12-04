import { TILE_SIZE } from "../config/constants";
import Enemy from "./enemy";
import { calculateAngle } from "./defense";

export default class Bullet {
  x: number;
  y: number;
  distance: number;
  speed: number;
  isDestroyed: boolean;
  angle: number;
  now = 0;

  constructor(
    x: number,
    y: number,
    distance: number,
    speed: number,
    angle: number
  ) {
    this.x = x;
    this.y = y;
    this.distance = distance;
    this.speed = speed;
    this.isDestroyed = false;
    this.angle = angle;
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
    const offsetX = -TILE_SIZE / 2;
    const offsetY = (-8 * TILE_SIZE) / 6;

    const bullet = new Image();

    bullet.src = "/textures/towerDefense_tile295.png";

    ctx.save();

    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);

    ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    ctx.drawImage(bullet, offsetX, -this.now * TILE_SIZE + offsetY, size, size);

    ctx.restore();
  }
}
export class Rocket {
  x: number;
  y: number;
  speed: number;
  isDestroyed: boolean;
  target: Enemy;
  damage: number;
  angle = 0;
  now = 0;

  constructor(
    x: number,
    y: number,
    damage: number,
    target: Enemy,
    speed: number
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.isDestroyed = false;
    this.target = target;
  }

  // Update the rocket's position
  update() {
    if (!this.target) {
      this.isDestroyed = true;
      return;
    }

    this.now += this.speed;

    const distance = Math.hypot(this.target.x - this.x, this.target.y - this.y);

    if (this.now >= distance) {
      this.isDestroyed = true;
      this.target.health -= this.damage;
      return;
    }
    this.angle = calculateAngle(this, this.target);
  }

  // Draw the rocket
  draw(ctx: CanvasRenderingContext2D) {
    const size = TILE_SIZE;
    const offset = -TILE_SIZE / 2;

    const bullet = new Image();

    bullet.src = "/textures/towerDefense_tile252.png";

    ctx.save();

    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);

    ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    ctx.drawImage(bullet, offset, -this.now * TILE_SIZE + offset, size, size);

    ctx.restore();
  }
}
