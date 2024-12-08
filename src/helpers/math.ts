import { Entity } from "@/types/entities";

interface Point {
  x: number;
  y: number;
} // minimal Point Interface

export function calculateAngle(entity1: Point, entity2: Point) {
  const dx = entity2.x - entity1.x;
  const dy = entity2.y - entity1.y;
  return Math.atan2(dy, dx);
}

export function selectInRangeEntity(
  targets: Entity[],
  x: number,
  y: number,
  minRange = 0,
  maxRange: number,
  ignoreExpectedHealth = false
) {
  let distance = 0;

  const target = targets.find((target) => {
    distance = Math.hypot(target.x - x, target.y - y);

    if (distance <= maxRange && distance >= minRange) {
      if (!ignoreExpectedHealth && target.expecetedHealth) {
        return target.expecetedHealth > 0 ? true : false;
      } else return true;
    }
  });

  return { distance, target };
}

export function selectNearnestEntity(
  targets: Entity[],
  x: number,
  y: number,
  minRange = 0,
  maxRange: number,
  ignoreExpectedHealth = false
): {
  target: Entity | undefined;
  distance: number;
} {
  let distance = Infinity, // very large number
    target: undefined | Entity;

  targets.forEach((t) => {
    const d = Math.hypot(t.x - x, t.y - y);

    if (d <= maxRange && d >= minRange) {
      if (!ignoreExpectedHealth && t.expecetedHealth) {
        if (t.expecetedHealth <= 0) {
          if (d < distance) target = t;
          distance = Math.min(distance, d);
        }
      } else {
        if (d < distance) target = t;
        distance = Math.min(distance, d);
      }
    }
  });

  return { distance, target };
}
