import { TILE_SIZE } from "@/config/constants";
import { calculateAngle } from "@/helpers";
import { Point } from "@/types/global";

export default class Enemy {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  speed: number;
  health: number;
  currentWaypointIndex: number;
  waypoints: Point[];
  destroied: "none" | "entered" | "dead";
  angle = 0;

  constructor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    speed: number,
    health: number,
    waypoints: Point[]
  ) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.currentWaypointIndex = 0;
    this.waypoints = waypoints;
    this.destroied = "none";
  }

  update() {
    if (this.health <= 0) {
      this.destroied = "dead";
      return;
    }
    if (this.currentWaypointIndex >= this.waypoints.length) {
      this.destroied = "entered";
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
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw() {
    const size = TILE_SIZE;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;
    const offset = TILE_SIZE / 2;

    const img = new Image();
    img.src = "/textures/towerDefense_tile245.png";

    this.ctx.save();
    this.ctx.translate(left + offset, top + offset);
    this.ctx.rotate(this.angle);

    this.ctx.drawImage(img, -offset, -offset, size, size);

    this.ctx.restore();
  }
}
