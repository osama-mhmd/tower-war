import { TILE_SIZE } from "@/config/constants";
import { Context } from "@/types/global";
import { Fire } from "../projectiles";
import { Bullet } from "@/types/bullets";
import { selectNearnestEnemy } from "@/helpers";
import { Enemy } from "../enemies";
import { Cannon } from "./sub/cannon";
import { Tower } from "@/types/towers";

export default class MegaTower implements Tower {
  x: number;
  y: number;
  lastShot: number = 0;
  minRange: number = 0;
  maxRange: number = 3;
  angle: number = 0;
  damage: number = 2;
  level: number = 1;
  max: boolean = false;
  bullets: Bullet[] = [];
  attackSpeed = 1;
  cannon: Cannon;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.cannon = new Cannon({
      x: this.x,
      y: this.y,
      offsetX: TILE_SIZE / 6,
      texture: "towerDefense_tile249",
    });
  }

  fire(distance: number, angle: number) {
    const bullet = new Fire({
      x: this.x,
      y: this.y,
      distance,
      speed: 0.1,
      angle,
      texture: "towerDefense_tile295",
    });

    this.bullets.push(bullet);
  }

  update(enemies: Enemy[], gameTime: number) {
    this.bullets.forEach((bullet) => bullet.update());
    this.bullets = this.bullets.filter((bullet) => !bullet.isDestroyed);

    if (gameTime - this.lastShot <= 60 / this.attackSpeed && this.lastShot > 0)
      return;

    const { distance, target } = selectNearnestEnemy(
      enemies,
      this.x,
      this.y,
      this.minRange,
      this.maxRange
    );

    if (target) {
      const angle = this.cannon.update(target);
      this.fire(distance, angle);
      this.lastShot = gameTime;
      target.health -= this.damage;
    }
  }

  draw(ctx: Context) {
    ctx.draw("towerDefense_tile180", this.x, this.y); // base

    this.cannon.draw(ctx); // cannon

    this.bullets.forEach((bullet) => bullet.draw(ctx)); // bullets
  }
}
