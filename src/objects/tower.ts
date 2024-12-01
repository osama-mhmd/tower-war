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
  level: number;
  max: boolean;

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
    this.level = 1;
    this.max = false;
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

    const g = new Image(64, 64);
    g.src = "/textures/towerDefense_tile182.png";
    this.ctx.drawImage(g, left, top, size, size);

    const t = new Image(64, 64);
    t.src = "/textures/towerDefense_tile204.png";
    this.ctx.drawImage(t, left, top, size, size);
  }

  upgrade() {
    if (this.level == 5) {
      this.max = true;
      return;
    }
    this.level++;
    this.range += 1;
    this.attackSpeed += 0.1;
  }
}
