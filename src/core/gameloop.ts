import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/config/constants";
import Effect from "@/entities/effects/effect";
import { GameStore } from "@/stores/game";
import { Context, Point } from "@/types/global";
import hover from "@/utils/hover";
import spawnEnemies from "./wave-and-enemies";
import { Enemy } from "@/entities/enemies";
import { Tower } from "@/types/towers";
import { MutableRefObject } from "react";

interface GameLoop {
  ctx: Context;
  getGame: GameStore["getGame"];
  setGame: GameStore["setGame"];
  entry: Point;
  waypoints: Point[];
  towers: Tower[];
  enemies: Enemy[];
  hoveredCell: MutableRefObject<Point | null>;
}

let gameTime = 0;
// let currentEffectIndex = 0;

const effects: Effect[] = [];

export default function gameLoop({
  ctx,
  getGame,
  setGame,
  entry,
  waypoints,
  towers,
  enemies,
  hoveredCell,
}: GameLoop) {
  const { paused } = getGame();

  if (paused) return;

  // update time
  gameTime++;

  // spawn enemies
  spawnEnemies(ctx, getGame, setGame, entry, waypoints, enemies);

  // reset canvas
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // draw hovered cell
  hover(ctx, hoveredCell.current);

  // handle towers
  towers.forEach((tower) => tower.update(enemies, gameTime));
  towers.forEach((tower) => tower.draw(ctx));

  // handle enemies
  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();

    if (enemy.destroied !== "none") {
      const { hp, coins } = getGame();

      if (enemy.destroied == "entered") {
        const isDead = hp - enemy.health <= 0;

        setGame({
          over: isDead,
          paused: isDead,
          hp: isDead ? 0 : hp - enemy.health,
        });
      } else if (enemy.destroied == "dead") {
        setGame({
          coins: coins + 5,
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
    })
  );
}
