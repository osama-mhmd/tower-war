import { Point } from "../types/global";
import { Enemy } from "@/entities/enemies";

export default function spawnEnemies(
  ctx: CanvasRenderingContext2D,
  waypoints: Point[]
) {
  const enemies = [];

  for (let i = 0; i < 10; i++) {
    const x = Math.random() * ctx.canvas.width;
    const y = Math.random() * ctx.canvas.height;
    const speed = Math.random() * 10 + 5;
    const health = Math.random() * 10 + 5;

    enemies.push(new Enemy(ctx, x, y, speed, health, waypoints));
  }

  return enemies;
}
