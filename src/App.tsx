import { useEffect, useRef, useState } from "react";
import "./App.css";
import drawGrid from "./utils/draw-grid";
import Enemy from "./objects/enemy";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMNS_COUNT,
  ROWS_COUNT,
  TILE_SIZE,
} from "./config/constants";
import getWaypoints from "./utils/get-waypoints";
import { Heart, Skull } from "lucide-react";
import Tower from "./objects/tower";
import { Point } from "./types/global";

let frameId: number;

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
let towers: Tower[] = [];

function App() {
  const [game, setGame] = useState({
    enemiesCount: 0,
    over: false,
    hp: 18,
    currentWave: 1,
    paused: false,
  });
  const hoveredCell = useRef<Point | null>(null);

  const canvas = useRef<HTMLCanvasElement>(null);
  const gameTime = useRef<number>(0);

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) return;

    function gameLoop(ctx: any) {
      if (game.paused) return;

      // update time
      gameTime.current++;

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

      drawGrid(ctx, grid, hoveredCell.current);

      towers.forEach((tower) => tower.shoot(enemies, gameTime.current));
      towers.forEach((tower) => tower.draw());

      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.destroied) {
          if (enemy.health >= 0) {
            setGame((prev) => {
              if (prev.hp - enemy.health <= 0) {
                return { ...prev, over: true, paused: true, hp: 0 };
              }
              return { ...prev, hp: prev.hp - enemy.health };
            });
          }
          enemies.splice(index, 1);
        }
      });

      frameId = requestAnimationFrame(() => gameLoop(ctx));
    }

    frameId = requestAnimationFrame(() => gameLoop(ctx));

    return () => cancelAnimationFrame(frameId);
  }, [game.paused]);

  // keyboard controls effect
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        setGame((prev) => ({ ...prev, paused: !prev.paused }));
      }
    });
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const cv = canvas.current;
    if (!cv) return;

    const rect = cv.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const x = Math.floor(mouseX / TILE_SIZE);
    const y = Math.floor(mouseY / TILE_SIZE);

    if (x >= 0 && x < ROWS_COUNT && y >= 0 && y < COLUMNS_COUNT) {
      hoveredCell.current = { x, y };
    } else {
      hoveredCell.current = null;
    }
  };

  const handleMouseClick = () => {
    if (
      waypoints.find(
        (w) => w.x === hoveredCell.current?.x && w.y === hoveredCell.current?.y
      )
    ) {
      return;
    }

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    towers.push(new Tower(ctx, hoveredCell.current!.x, hoveredCell.current!.y));
  };

  return (
    <main>
      <div className="logo" onClick={() => setGame({ ...game, paused: true })}>
        <img src="/tower-defense-logo.png" width={80} alt="Tower Defense" />
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
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
        ></canvas>
      </section>
      {game.over && (
        <div className="overlay">
          <p>Game over</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}
      {!game.over && game.paused && (
        <div className="overlay">
          <p>Paused</p>
          <button onClick={() => setGame({ ...game, paused: false })}>
            Continue
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
