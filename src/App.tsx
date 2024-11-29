import { useEffect, useRef } from "react";
import "./App.css";
import drawGrid from "./utils/draw-grid";
import Enemy from "./objects/enemy";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config/constants";
import getWaypoints from "./utils/get-waypoints";

function App() {
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

    const enemy = new Enemy(ctx, 8, 0, 0.05, 100, waypoints);

    function gameLoop(ctx: any) {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawGrid(ctx, grid);

      enemy.update();
      enemy.draw();

      requestAnimationFrame(() => gameLoop(ctx));
    }

    gameLoop(ctx);
  }, []);

  return (
    <canvas ref={canvas} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}></canvas>
  );
}

export default App;
