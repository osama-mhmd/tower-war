import { selectInRangeEntity } from "@/helpers";
import Enemy from "@/types/enemies";
import { Cannon } from "./sub/cannon";
import { Rocket } from "../projectiles";
import { Context } from "@/types/global";
import { Tower } from "@/types/towers";
import { Bullet } from "@/types/bullets";
import { Entity, State } from "@/types/entities";

export default class RocketTower implements Tower {
  x: number;
  y: number;
  lastShot: number = 0;
  minRange: number = 3;
  maxRange: number = 8;
  angle: number = 0;
  damage: number = 10;
  level: number = 1;
  max: boolean = false;
  bullets: Bullet[] = [];
  attackSpeed = 0.3;
  cannon: Cannon;
  canFire = true;
  health = 20;
  state: State = "alive";

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.cannon = new Cannon({
      x: this.x,
      y: this.y,
      texture: "towerDefense_tile229",
    });
  }

  fire(target: Entity) {
    const sound = new Audio();
    sound.src = "/sounds/rocket-launch.wav";
    sound.play();
    const rocket = new Rocket({
      x: this.x,
      y: this.y,
      damage: this.damage,
      target,
      speed: 0.1,
      texture: "towerDefense_tile252",
    });
    this.bullets.push(rocket);
  }

  update(enemies: Enemy[], gameTime: number) {
    this.bullets.forEach((rocket) => rocket.update());
    this.bullets = this.bullets.filter((rocket) => !rocket.isDestroyed);

    if (this.health <= 0) {
      this.state = "lost";
      return;
    }

    if (
      gameTime - this.lastShot <= 60 / this.attackSpeed &&
      this.lastShot > 0
    ) {
      this.canFire = false;
      return;
    } else {
      this.canFire = true;
    }

    const { target } = selectInRangeEntity(
      enemies,
      this.x,
      this.y,
      this.minRange,
      this.maxRange
    );

    if (target) {
      this.cannon.update(target);
      this.fire(target);
      this.lastShot = gameTime;
    }
  }

  draw(ctx: Context) {
    ctx.draw("towerDefense_tile183", this.x, this.y); // base

    if (this.canFire) this.cannon.texture = "towerDefense_tile206";
    this.cannon.draw(ctx); // cannon
    if (this.canFire) this.cannon.texture = "towerDefense_tile229";

    this.bullets.forEach((rocket) => rocket.draw(ctx)); // rockets
  }
}
