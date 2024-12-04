import { TILE_SIZE } from "../config/constants";
import { Context } from "../types/global";
import Bullet, { Rocket } from "./bullet";
import Enemy from "./enemy";

export function calculateAngle(entity: { x: number; y: number }, enemy: Enemy) {
  const dx = enemy.x * TILE_SIZE - entity.x * TILE_SIZE;
  const dy = enemy.y * TILE_SIZE - entity.y * TILE_SIZE;
  return Math.atan2(dy, dx);
}

function selectNearnestEnemy(
  enemies: Enemy[],
  x: number,
  y: number,
  minRange: number,
  maxRange: number
) {
  let distance = 0;

  const target = enemies.find((enemy) => {
    distance = Math.hypot(enemy.x - x, enemy.y - y);

    if (distance <= maxRange && distance >= minRange) return true;
  });

  return { distance, target };
}

export class RotatingPart {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  size: number;
  angle = 0;
  texture: string;

  constructor(
    x: number,
    y: number,
    size: number,
    offsetX: number,
    offsetY: number,
    texture: string
  ) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.texture = texture;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  update(target: Enemy) {
    this.angle = calculateAngle(this as any, target);

    return this.angle;
  }

  draw(ctx: Context) {
    const size = TILE_SIZE;

    ctx.save();
    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);
    ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    const t = new Image(64, 64);
    t.src = `/textures/${this.texture}.png`;
    const offsetX = this.offsetX; // size / 6;
    ctx.drawImage(t, -size / 2, -size / 2 - offsetX, size, size);

    ctx.restore();
  }
}

export interface Defense {
  x: number;
  y: number;
  shootRate: number;
  lastShot: number;
  minRange?: number;
  maxRange: number;
  angle: number;
  damage: number;
  level: number;
  max: boolean;
  bullets: Bullet[];
  top: RotatingPart;

  fire: (target: Enemy, distance: number, gameTime: number) => void;
  update: (enmeies: Enemy[], gameTime: number) => void;
  draw: (ctx: Context) => void;
}

export class MegaTower {
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
  top: RotatingPart;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.top = new RotatingPart(
      this.x,
      this.y,
      TILE_SIZE,
      TILE_SIZE / 6,
      0,
      "towerDefense_tile249"
    );
  }

  fire(distance: number, angle: number) {
    const bullet = new Bullet(this.x, this.y, distance, 0.4, angle);

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
      const angle = this.top.update(target);
      this.fire(distance, angle);
      this.lastShot = gameTime;
      target.health -= this.damage;
    }
  }

  draw(ctx: Context) {
    ctx.draw("towerDefense_tile180", this.x, this.y); // base

    this.top.draw(ctx); // top

    this.bullets.forEach((bullet) => bullet.draw(ctx)); // bullets
  }
}

export class RocketTower {
  x: number;
  y: number;
  lastShot: number = 0;
  minRange: number = 3;
  maxRange: number = 8;
  angle: number = 0;
  damage: number = 10;
  level: number = 1;
  max: boolean = false;
  rockets: Rocket[] = [];
  attackSpeed = 0.3;
  top: RotatingPart;
  canFire = true;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.top = new RotatingPart(
      this.x,
      this.y,
      TILE_SIZE,
      0,
      0,
      "towerDefense_tile229"
    );
  }

  fire(target: Enemy) {
    const rocket = new Rocket(this.x, this.y, this.damage, target, 0.1);
    this.rockets.push(rocket);
  }

  update(enemies: Enemy[], gameTime: number) {
    this.rockets.forEach((rocket) => rocket.update());
    this.rockets = this.rockets.filter((rocket) => !rocket.isDestroyed);

    if (
      gameTime - this.lastShot <= 60 / this.attackSpeed &&
      this.lastShot > 0
    ) {
      this.canFire = false;
      return;
    } else {
      this.canFire = true;
    }

    const { target } = selectNearnestEnemy(
      enemies,
      this.x,
      this.y,
      this.minRange,
      this.maxRange
    );

    if (target) {
      this.top.update(target);
      this.fire(target);
      this.lastShot = gameTime;
    }
  }

  draw(ctx: Context) {
    ctx.draw("towerDefense_tile183", this.x, this.y); // base

    if (this.canFire) this.top.texture = "towerDefense_tile206";
    else this.top.texture = "towerDefense_tile229";
    this.top.draw(ctx); // top

    this.rockets.forEach((rocket) => rocket.draw(ctx)); // rockets
  }
}
