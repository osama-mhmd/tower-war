import { COLUMNS_COUNT, ROWS_COUNT } from "../config/constants";
import { Point } from "../types/global";
import Rand from "../libs/rand";

const directionOffsets: { [key: string]: { dx: number; dy: number } } = {
  top: { dx: -1, dy: 0 },
  bottom: { dx: 1, dy: 0 },
  left: { dx: 0, dy: -1 },
  right: { dx: 0, dy: 1 },
};

/**
 * This function generate a random grid with waypoints but it lacks a lot of things like t-junctions,
 * and cross roads. It's just a simple grid generator.
 *
 * @param complexity the complexity of the grid. The higher the complexity, the more complex the grid will be and more waypoints.
 *
 * @returns a random grid with waypoints
 */

export default function generateGrid(complexity: number = 1): {
  grid: number[][];
  waypoints: Point[];
} {
  const waypoints: Point[] = [];
  const grid = Array(ROWS_COUNT)
    .fill(null)
    .map(() => Array(COLUMNS_COUNT).fill(0));

  let x = 0,
    y = 0;

  const randInt = Rand.randomIntInRange(COLUMNS_COUNT - 2, 1);

  // TODO: Random Entry
  y = randInt;

  waypoints.push({ x: y, y: x, type: "path" });

  grid[x][y] = 1;

  let lastChoice = "";

  for (let i = 0; i < (ROWS_COUNT * COLUMNS_COUNT) / 2; i++) {
    if (x === ROWS_COUNT - 1) break;

    const choices = [];

    if (
      x - 1 > 0 &&
      y >= 3 &&
      y <= COLUMNS_COUNT - 4 &&
      grid[x - 1][y] !== 1 &&
      grid[x - 1][y - 1] !== 1 &&
      grid[x - 1][y + 1] !== 1 &&
      grid[x - 2][y] !== 1
    )
      for (let i = 0; i < complexity * 3; i++) {
        choices.push("top");
      }
    if (
      x < ROWS_COUNT - 1 &&
      grid[x + 1][y] !== 1 &&
      grid[x + 1][y + 1] !== 1 &&
      grid[x + 1][y - 1] !== 1
    )
      choices.push("bottom");
    if (
      grid[x][y - 1] !== 1 &&
      y - 1 > 0 &&
      y > 0 &&
      x > 0 &&
      grid[x - 1][y - 1] !== 1 &&
      grid[x][y - 2] !== 1 &&
      grid[x + 1][y - 1] !== 1
    )
      for (let i = 0; i < complexity; i++) {
        choices.push("left");
      }
    if (
      grid[x][y + 1] !== 1 &&
      y < COLUMNS_COUNT - 2 &&
      x > 0 &&
      grid[x - 1][y + 1] !== 1 &&
      grid[x + 1][y + 1] !== 1 &&
      grid[x][y + 2] !== 1
    )
      for (let i = 0; i < complexity; i++) {
        choices.push("right");
      }

    // self learning
    if (choices.length === 0) {
      grid[x][y] = 0;

      const { dx, dy } = directionOffsets[lastChoice];
      x -= dx;
      y -= dy;

      waypoints.pop();
      continue;
    }

    const choice = Rand.randomChoice(choices);

    lastChoice = choice;

    const { dx, dy } = directionOffsets[choice];
    x += dx;
    y += dy;

    grid[x][y] = 1;
    waypoints.push({ x: y, y: x, type: "path" });
  }

  if (waypoints[waypoints.length - 1].y !== ROWS_COUNT - 1) {
    throw new Error("Waypoints are not generated correctly");
  }

  return { grid, waypoints };
}
