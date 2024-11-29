import { useEffect, useRef, useState } from "react";
import "./App.css";
import drawGrid from "./utils/draw-grid";
import Enemy from "./objects/enemy";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config/constants";
import getWaypoints from "./utils/get-waypoints";

function App() {
  const [game, setGame] = useState({
    enemiesCount: 0,
    over: false,
    hp: 18,
    currentWave: 1,
  });

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;

    const grid = [
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    ];

    const entry = {
      x: 8,
      y: -1,
    };

    const waypoints = getWaypoints(grid);

    let enemies: Enemy[] = [];

    function gameLoop(ctx: any) {
      // spawn enemies
      const randomX = Math.floor(Math.random() * 100);
      switch (game.currentWave) {
        case 1:
          if (randomX < 1) {
            enemies.push(new Enemy(ctx, entry.x, entry.y, 0.02, 5, waypoints));
            setGame((prev) => ({
              ...prev,
              enemiesCount: prev.enemiesCount + 1,
            }));
          }
          break;
        case 2:
          if (randomX < 3) {
            enemies.push(new Enemy(ctx, entry.x, entry.y, 0.04, 5, waypoints));
            setGame((prev) => ({
              ...prev,
              enemiesCount: prev.enemiesCount + 1,
            }));
          }
          break;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawGrid(ctx, grid);

      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.destroied) {
          setGame((prev) => ({ ...prev, hp: prev.hp - enemy.health }));
          enemies.splice(index, 1);
        }
      });

      requestAnimationFrame(() => gameLoop(ctx));
    }

    gameLoop(ctx);
  }, []);

  useEffect(() => {
    if (game.hp <= 0) setGame({ ...game, over: true });
  }, [game.hp]);

  return (
    <main>
      {game.hp}
      <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
      {game.over && <p>Game Over</p>}
    </main>
  );
}

export default App;
