import { useEffect, useRef, useState } from "react";
import "./App.css";
import drawGrid from "./utils/draw-grid";
import Enemy from "./objects/enemy";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config/constants";
import getWaypoints from "./utils/get-waypoints";

function App() {
  const [userHealthPoints, setUserHealthPoints] = useState(10);
  const [gameOver, setGameOver] = useState(false);

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
    ];

    const waypoints = getWaypoints(grid);

    let enemies: Enemy[] = [new Enemy(ctx, 8, 0, 0.2, 5, waypoints)];

    function gameLoop(ctx: any) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawGrid(ctx, grid);

      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.destroied) {
          setUserHealthPoints(userHealthPoints - enemy.health);
          enemies.splice(index, 1);
        }
      });

      requestAnimationFrame(() => gameLoop(ctx));
    }

    gameLoop(ctx);
  }, []);

  useEffect(() => {
    if (userHealthPoints <= 0) setGameOver(true);
  }, [userHealthPoints]);

  return (
    <main>
      {userHealthPoints}
      <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
      {gameOver && <p>Game Over</p>}
    </main>
  );
}

export default App;
