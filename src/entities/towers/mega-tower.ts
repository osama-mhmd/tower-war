import { TILE_SIZE } from "@/config/constants";
import { Context } from "@/types/global";
import { Fire } from "../projectiles";
import { Bullet } from "@/types/bullets";
import { selectInRangeEntity } from "@/helpers";
import Enemy from "@/types/enemies";
import { Cannon } from "./sub/cannon";
import { Tower } from "@/types/towers";
import { State } from "@/types/entities";

export default class MegaTower implements Tower {
  x: number;
  y: number;
  lastShot: number = 0;
  minRange: number = 0;
  maxRange: number = 3;
  angle: number = 0;
  damage: number = 3;
  level: number = 1;
  max: boolean = false;
  bullets: Bullet[] = [];
  attackSpeed = 1;
  cannon: Cannon;
  health = 30;
  state: State = "alive";

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.cannon = new Cannon({
      x: this.x,
      y: this.y,
      offsetY: TILE_SIZE / 6,
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

    if (this.health <= 0) {
      this.state = "lost";
      return;
    }

    if (gameTime - this.lastShot <= 60 / this.attackSpeed && this.lastShot > 0)
      return;

    const { distance, target } = selectInRangeEntity(
      enemies,
      this.x,
      this.y,
      this.minRange,
      this.maxRange,
      true
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
