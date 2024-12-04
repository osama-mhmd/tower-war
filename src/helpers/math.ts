import { TILE_SIZE } from "@/config/constants";
import { Enemy } from "@/entities/enemies";

export function calculateAngle(entity: { x: number; y: number }, enemy: Enemy) {
  const dx = enemy.x * TILE_SIZE - entity.x * TILE_SIZE;
  const dy = enemy.y * TILE_SIZE - entity.y * TILE_SIZE;
  return Math.atan2(dy, dx);
}

export function selectNearnestEnemy(
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
