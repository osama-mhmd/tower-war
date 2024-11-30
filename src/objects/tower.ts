import { TILE_SIZE } from "../config/constants";
import Enemy from "./enemy";

export default class Tower {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  range: number;
  attackSpeed: number;
  lastShot: number;
  damage: number;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    range: number = 3,
    attackSpeed: number = 1,
    damage: number = 2
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.range = range;
    this.attackSpeed = attackSpeed;
    this.damage = damage;
    this.lastShot = 0;
  }

  shoot(enemies: Enemy[], gameTime: number) {
    if (gameTime - this.lastShot > 60 / this.attackSpeed) {
      const target = enemies.find((e) => {
        const dx = e.x - this.x;
        const dy = e.y - this.y;
        return Math.sqrt(dx * dx + dy * dy) <= this.range;
      });

      if (target) {
        target.health -= this.damage;
        this.lastShot = gameTime;
      }
    }
  }

  draw() {
    const size = TILE_SIZE;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;

    this.ctx.fillStyle = "blue";
    const image = new Image(64, 64);
    image.src = "/castle-tower.png";
    this.ctx.drawImage(image, left, top, size, size);

    this.ctx.beginPath();
    this.ctx.arc(
      left + TILE_SIZE / 2,
      top + TILE_SIZE / 2,
      this.range * TILE_SIZE,
      0,
      Math.PI * 2
    );
    this.ctx.stroke();
  }
}
