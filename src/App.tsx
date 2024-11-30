import { useEffect, useRef, useState } from "react";
import "./App.css";
import drawGrid from "./utils/draw-grid";
import Enemy from "./objects/enemy";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./config/constants";
import getWaypoints from "./utils/get-waypoints";
import { Heart, Skull } from "lucide-react";
import Tower from "./objects/tower";

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
    const tower = new Tower(ctx, 2, 3);

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

      tower.shoot(enemies);
      tower.draw();

      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.destroied) {
          if (enemy.health >= 0)
            setGame((prev) => ({ ...prev, hp: prev.hp - enemy.health }));
          enemies.splice(index, 1);
        }
      });

      requestAnimationFrame(() => gameLoop(ctx));
    }

    const frameId = requestAnimationFrame(() => gameLoop(ctx));

    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    if (game.hp <= 0) setGame({ ...game, over: true });
  }, [game.hp]);

  return (
    <main>
      <div className="logo">
        <img src="/public/tower-defense-logo.png" width={80} />
      </div>
      <p className="user-hp">
        {game.hp} <Heart fill="red" stroke="#d30" />
      </p>
      <p className="enemies-count">
        {game.enemiesCount} <Skull fill="#000" stroke="#FF4500" />
      </p>
      <section>
        <canvas
          ref={canvas}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
        ></canvas>
      </section>
      {game.over && (
        <div className="overlay">
          <p>Game over</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
    </main>
  );
}

export default App;
