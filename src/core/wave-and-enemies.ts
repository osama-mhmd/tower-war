import { Solider } from "@/entities/enemies";
import Enemy from "@/types/enemies";
import Rand from "@/libs/rand";
import { GameStore } from "@/stores/game";
import { Point } from "@/types/global";

export default function spawnEnemies(
  get: GameStore["getGame"],
  set: GameStore["setGame"],
  entry: Point,
  waypoints: Point[],
  enemies: Enemy[]
) {
  const { currentWave } = get();

  const randy = (speed: number, health: number) => {
    enemies.push(new Solider(entry.x, entry.y, speed, health, waypoints));

    set({ enemiesCount: get().enemiesCount + 1 });

    // handle waves threshold
    const thresholds = [15, 30, 70, 100, 150];

    if (thresholds.indexOf(get().enemiesCount) > -1)
      set({ currentWave: currentWave + 1 });
  };

  Rand.throwEvent(currentWave * 1, () => {
    randy(currentWave * 0.02, currentWave * 5);
  });

  // random events
  Rand.throwEventInRange(get().enemiesCount, [30, 50], 0.02, () => {
    randy(0.02, 45);
  });
  Rand.throwEventInRange(get().enemiesCount, [100, 200], 0.02, () => {
    randy(0.06, 50);
  });
}
