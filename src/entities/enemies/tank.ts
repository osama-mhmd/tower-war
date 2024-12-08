import { TILE_SIZE } from "@/config/constants";
import { calculateAngle, selectNearnestEntity } from "@/helpers";
import { Context, Point } from "@/types/global";
import { AggressiveEnemy } from "@/types/enemies";
import { Cannon } from "../towers/sub/cannon";
import { Tower } from "@/types/towers";
import { State } from "@/types/entities";
import Rand from "@/libs/rand";

const textures: { [key: string]: { base: string; cannon: string } } = {
  green: {
    base: "towerDefense_tile268",
    cannon: "towerDefense_tile291",
  },
  white: {
    base: "towerDefense_tile269",
    cannon: "towerDefense_tile292",
  },
};

export default class Tank implements AggressiveEnemy {
  x: number;
  y: number;
  speed: number;
  health: number;
  currentWaypointIndex: number;
  waypoints: Point[];
  state: State;
  damage: number;
  cannon: Cannon;
  texture: string;

  // constants
  aggressive: true = true;
  angle = 0;
  lastShot = 0;
  attackSpeed = 1;
  minRange = 0;
  maxRange = 2;
  prize = 8;

  constructor(
    x: number,
    y: number,
    speed: number,
    health: number,
    waypoints: Point[],
    damage = 4
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.currentWaypointIndex = 0;
    this.waypoints = waypoints;
    this.damage = damage;

    this.state = "alive";
    const style = Rand.randomChoice(["white", "green"]);
    this.texture = textures[style].base;
    this.cannon = new Cannon({
      x: this.x,
      y: this.y,
      texture: textures[style].cannon,
      angleOffset: 0,
      offsetX: (-1 * TILE_SIZE) / 10,
    });
  }

  update(towers: Tower[], gameTime: number) {
    if (this.health <= 0) {
      this.state = "lost";
      return;
    }
    if (this.currentWaypointIndex >= this.waypoints.length) {
      this.state = "won";
      return;
    } // Reached the end

    const waypoint = this.waypoints[this.currentWaypointIndex];
    const dx = waypoint.x - this.x;
    const dy = waypoint.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    this.angle = calculateAngle({ x: this.x, y: this.y }, {
      x: waypoint.x,
      y: waypoint.y,
    } as any);

    if (distance < this.speed) {
      this.currentWaypointIndex++;
    } else {
      // update enemy position
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
      // update cannon position
      this.cannon.x = this.x;
      this.cannon.y = this.y;
    }

    if (gameTime - this.lastShot <= 60 / this.attackSpeed && this.lastShot > 0)
      return;

    const { target } = selectNearnestEntity(
      towers,
      this.x,
      this.y,
      this.minRange,
      this.maxRange
    );

    if (target) {
      this.cannon.update(target);
      this.lastShot = gameTime;
      target.health -= this.damage;
    }
  }

  draw(ctx: Context) {
    const size = TILE_SIZE;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;
    const offset = TILE_SIZE / 2;

    const img = new Image();
    img.src = `/textures/${this.texture}.png`;

    ctx.save();
    ctx.translate(left, top);
    ctx.translate(offset, offset);
    ctx.rotate(this.angle);

    ctx.drawImage(img, -offset, -offset, size, size);
    ctx.restore();

    this.cannon.draw(ctx);
  }
}
