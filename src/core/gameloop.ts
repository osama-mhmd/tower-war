import { CANVAS_HEIGHT, CANVAS_WIDTH } from "@/config/constants";
import { Enemy } from "@/entities/enemies";
import { GameStore } from "@/stores/game";
import { Context, Point } from "@/types/global";
import hover from "@/utils/hover";

interface GameLoop {
  ctx: Context;
  getGame: GameStore["getGame"];
  setGame: GameStore["setGame"];
  entry: Point;
  waypoints: Point[];
}

export default function gameLoop({
  ctx,
  getGame,
  setGame,
  entry,
  waypoints,
}: GameLoop) {
  const { paused, gameTime, enemies, currentWave, towers, hoveredCell } =
    getGame();

  if (paused) return;

  // update time
  setGame({ gameTime: gameTime + 1 });

  // spawn enemies
  const randomX = Math.floor(Math.random() * 100);
  switch (currentWave) {
    case 1:
      if (randomX < 1) {
        enemies.push(new Enemy(ctx, entry.x, entry.y, 0.02, 5, waypoints));
        // setGame((prev) => {
        //   const newCount = prev.enemiesCount + 1;

        //   if (newCount == 15) {
        //     currentWave++;
        //   }

        //   return {
        //     ...prev,
        //     currentWave: currentWave,
        //     enemiesCount: newCount,
        //   };
        // });
      }
      break;
    case 2:
      if (randomX < 3) {
        enemies.push(new Enemy(ctx, entry.x, entry.y, 0.04, 8, waypoints));
        // setGame((prev) => {
        //   const newCount = prev.enemiesCount + 1;

        //   if (newCount == 30) {
        //     currentWave++;
        //   }

        //   return {
        //     ...prev,
        //     currentWave: currentWave,
        //     enemiesCount: newCount,
        //   };
        // });
      }
      break;
    case 3:
      if (randomX < 3) {
        enemies.push(new Enemy(ctx, entry.x, entry.y, 0.1, 15, waypoints));
        // setGame((prev) => {
        //   const newCount = prev.enemiesCount + 1;

        //   if (newCount == 70) {
        //     currentWave++;
        //   }

        //   return {
        //     ...prev,
        //     currentWave: currentWave,
        //     enemiesCount: newCount,
        //   };
        // });
      }
      break;
    case 4:
      if (randomX < 3) {
        enemies.push(new Enemy(ctx, entry.x, entry.y, 0.1, 30, waypoints));
        // setGame((prev) => {
        //   const newCount = prev.enemiesCount + 1;

        //   if (newCount == 100) {
        //     currentWave++;
        //   }

        //   return {
        //     ...prev,
        //     currentWave: currentWave,
        //     enemiesCount: newCount,
        //   };
        // });
      }
      break;
    case 5:
      if (randomX < 5) {
        enemies.push(new Enemy(ctx, entry.x, entry.y, 0.15, 35, waypoints));
        // setGame((prev) => {
        //   const newCount = prev.enemiesCount + 1;

        //   if (newCount == 102) {
        //     enemies.push(new Enemy(ctx, entry.x, entry.y, 0.4, 35, waypoints));
        //   }

        //   return {
        //     ...prev,
        //     currentWave: currentWave,
        //     enemiesCount: newCount,
        //   };
        // });
      }
      break;
  }

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  hover(ctx, hoveredCell);

  towers.forEach((tower) => tower.update(enemies, gameTime));
  towers.forEach((tower) => tower.draw(ctx));

  enemies.forEach((enemy, index) => {
    enemy.update();
    enemy.draw();

    if (enemy.destroied !== "none") {
      if (enemy.destroied == "entered") {
        // setGame((prev) => {
        //   if (prev.hp - enemy.health <= 0) {
        //     return { ...prev, over: true, paused: true, hp: 0 };
        //   }
        //   return { ...prev, hp: prev.hp - enemy.health };
        // });
      } else if (enemy.destroied == "dead") {
        // setObjects((prev) => ({
        //   ...prev,
        //   effects: [...prev.effects, new Effect(enemy.x, enemy.y)],
        // }));
        // setGame((prev) => ({ ...prev, coins: prev.coins + 5 }));
      }
      enemies.splice(index, 1);
    }
  });

  requestAnimationFrame(() =>
    gameLoop({ ctx, getGame, setGame, entry, waypoints })
  );
}
