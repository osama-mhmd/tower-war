import { TILE_SIZE } from "@/config/constants";
import { calculateAngle } from "@/helpers";
import { Context, Point } from "@/types/global";
import Enemy from "@/types/enemies";

export default class Solider implements Enemy {
  x: number;
  y: number;
  speed: number;
  health: number;
  currentWaypointIndex: number;
  waypoints: Point[];
  state: Enemy["state"];
  angle = 0;

  constructor(
    x: number,
    y: number,
    speed: number,
    health: number,
    waypoints: Point[]
  ) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.currentWaypointIndex = 0;
    this.waypoints = waypoints;
    this.state = "alive";
  }

  update() {
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
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }
  }

  draw(ctx: Context) {
    const size = TILE_SIZE;
    const left = this.x * TILE_SIZE;
    const top = this.y * TILE_SIZE;
    const offset = TILE_SIZE / 2;

    const img = new Image();
    img.src = "/textures/towerDefense_tile245.png";

    ctx.save();
    ctx.translate(left + offset, top + offset);
    ctx.rotate(this.angle);

    ctx.drawImage(img, -offset, -offset, size, size);

    ctx.restore();
  }
}
