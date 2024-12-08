import { Tank, Solider } from "@/entities/enemies";
import Enemy from "@/types/enemies";
import Rand from "@/libs/rand";
import { GameStore } from "@/stores/game";
import { Point } from "@/types/global";

/*
  Brain mapping:
  Until now there are tow types of enemies: Tanks, and Soliders. 
  So...
  Solider PROPS:
  - Health [min: 5, max: 15]
  - Speed [min: 0.02, max: 0.1]
  Tank PROPS:
  - Health [min: 10, max: 20]
  - Speed [min: 0.01, max: 0.05]
*/

type Spawn = { [key: number]: [number, number] };

const spawnPercentage: Spawn = {
  1: [1, 0],
  2: [1, 1],
  3: [2, 1],
  4: [2, 2],
  5: [3, 3],
  6: [4, 3],
};
const spawnHealth: Spawn = {
  1: [5, 10],
  2: [6, 11],
  3: [7, 12],
  4: [11, 16],
  5: [12, 17],
  6: [15, 20],
};
const spawnSpeed: Spawn = {
  1: [0.02, 0.01],
  2: [0.04, 0.02],
  3: [0.05, 0.03],
  4: [0.06, 0.04],
  5: [0.08, 0.05],
  6: [0.1, 0.05],
};

export default function spawnEnemies(
  get: GameStore["getGame"],
  set: GameStore["setGame"],
  entry: Point,
  waypoints: Point[],
  enemies: Enemy[]
) {
  const { currentWave } = get();

  const randy = (
    speed: number,
    health: number,
    type: "solider" | "tank" = "solider"
  ) => {
    if (type == "solider")
      enemies.push(new Solider(entry.x, entry.y, speed, health, waypoints));
    else
      enemies.push(
        new Tank(entry.x, entry.y, speed, health, waypoints, currentWave + 1)
      );

    set({ enemiesCount: get().enemiesCount + 1 });

    // handle waves threshold
    const thresholds = [15, 30, 70, 100, 150];

    if (thresholds.indexOf(get().enemiesCount) > -1)
      set({ currentWave: currentWave + 1 });
  };

  Rand.throwEvent(spawnPercentage[currentWave][0], () => {
    randy(spawnSpeed[currentWave][0], spawnHealth[currentWave][0]);
  });
  Rand.throwEvent(spawnPercentage[currentWave][1], () => {
    randy(spawnSpeed[currentWave][1], spawnHealth[currentWave][1], "tank");
  });

  // random events
  Rand.throwEventInRange(get().enemiesCount, [30, 50], 1, () => {
    randy(0.02, 45);
  });
  Rand.throwEventInRange(get().enemiesCount, [100, 200], 1, () => {
    randy(0.06, 50, Rand.randomChoice(["tank", "solider"]));
  });
}
