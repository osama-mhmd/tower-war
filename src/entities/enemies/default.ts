import { TILE_SIZE } from "@/config/constants";
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

    if (distance < this.speed) {
      this.currentWaypointIndex++;
    } else {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw() {
    this.ctx.fillStyle = "red";

    const size = TILE_SIZE / 2;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;
    const offset = TILE_SIZE / 4;

    this.ctx.fillRect(left + offset, top + offset, size, size);
  }
}
