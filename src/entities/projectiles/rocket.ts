import { TILE_SIZE } from "@/config/constants";
// import { calculateAngle } from "@/helpers";
import { Bullet, RocketConfig } from "@/types/bullets";
import Enemy from "@/types/enemies";

export default class Rocket implements Bullet {
  x: number;
  y: number;
  speed: number;
  isDestroyed: boolean;
  target?: Enemy;
  damage: number;
  angle = 0;
  now = 0;
  offsetX: number;
  offsetY: number;
  texture: string;

  constructor({
    x,
    y,
    damage,
    target,
    speed,
    texture,
    offsetX,
    offsetY,
  }: RocketConfig) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.isDestroyed = false;
    this.target = target;
    this.offsetX = offsetX ?? -TILE_SIZE / 2;
    this.offsetY = offsetY ?? -TILE_SIZE / 2;
    this.texture = texture;

    // handling expectedHealth
    if (target) {
      if (this.target!.expecetedHealth)
        this.target!.expecetedHealth -= this.damage;
      else this.target!.expecetedHealth = this.target!.health - this.damage;
    }
  }

  update() {
    if (!this.target) {
      this.isDestroyed = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy);

    if (distance <= this.speed) {
      this.isDestroyed = true;
      this.target.health -= this.damage;
      return;
    }

    this.x += (dx / distance) * this.speed;
    this.y += (dy / distance) * this.speed;

    this.angle = Math.atan2(dy, dx);
  }

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
