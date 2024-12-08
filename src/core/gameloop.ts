import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/config/constants";
import Effect from "@/entities/effects/effect";
import { GameStore } from "@/stores/game";
import { Context, Point } from "@/types/global";
import hover from "@/utils/hover";
import spawnEnemies from "./wave-and-enemies";
import Enemy from "@/types/enemies";
import { Tower } from "@/types/towers";
import { MutableRefObject } from "react";
import { Store } from "@/stores/cells";

interface GameLoop {
  ctx: Context;
  getGame: GameStore["getGame"];
  setGame: GameStore["setGame"];
  entry: Point;
  waypoints: Point[];
  towers: Tower[];
  enemies: Enemy[];
  hoveredCell: MutableRefObject<Point | null>;
  setCells: Store["set"];
}

let gameTime = 0;

export default function gameLoop({
  ctx,
  getGame,
  setGame,
  entry,
  waypoints,
  towers,
  enemies,
  hoveredCell,
  setCells,
}: GameLoop) {
  const { paused } = getGame();

  if (paused) return;

  // update time
  gameTime++;

  // spawn enemies
  spawnEnemies(getGame, setGame, entry, waypoints, enemies);

  // reset canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // draw hovered cell
  hover(ctx, hoveredCell.current);

  // handle towers
  towers.forEach((tower, index) => {
    tower.update(enemies, gameTime);
    tower.draw(ctx);

    if (tower.state == "lost") {
      setCells(`${tower.x},${tower.y}`, { x: tower.x, y: tower.y });
      towers.splice(index, 1);
    }
  });

  // handle enemies
  enemies.forEach((enemy, index) => {
    enemy.update(towers, gameTime);
    enemy.draw(ctx);

    if (enemy.state !== "alive") {
      const { hp, coins } = getGame();

      if (enemy.state == "won") {
        const isDead = hp - enemy.health <= 0;

        setGame({
          over: isDead,
          paused: isDead,
          hp: isDead ? 0 : hp - enemy.health,
        });
      } else if (enemy.state == "lost") {
        setGame({
          coins: coins + (enemy.prize ?? 5),
          effects: [...getGame().effects, new Effect(enemy.x, enemy.y)],
        });
      }
      enemies.splice(index, 1);
    }
  });

  // loop
  requestAnimationFrame(() =>
    gameLoop({
      ctx,
      getGame,
      setGame,
      entry,
      waypoints,
      towers,
      enemies,
      hoveredCell,
      setCells,
    })
  );
}
