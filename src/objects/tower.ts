import { TILE_SIZE } from "../config/constants";
import Enemy from "./enemy";

function calculateAngle(tower: Tower, enemy: Enemy) {
  const dx = enemy.x * TILE_SIZE - tower.x * TILE_SIZE;
  const dy = enemy.y * TILE_SIZE - tower.y * TILE_SIZE;
  return Math.atan2(dy, dx);
}

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
  angle: number;

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
    this.angle = 0;
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
        this.angle = calculateAngle(this, target);
      }
    }
  }

  draw() {
    const size = TILE_SIZE;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;

    const g = new Image(64, 64);
    g.src = "/textures/towerDefense_tile180.png";
    this.ctx.drawImage(g, left, top, size, size);

    this.ctx.save();
    this.ctx.translate(left + size / 2, top + size / 2);
    this.ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    const t = new Image(64, 64);
    t.src = "/textures/towerDefense_tile249.png";
    const offsetX = size / 6;
    this.ctx.drawImage(t, -size / 2, -size / 2 - offsetX, size, size);

    this.ctx.restore();
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
