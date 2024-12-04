import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import Enemy from "./objects/enemy";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMNS_COUNT,
  ROWS_COUNT,
  TILE_SIZE,
} from "./config/constants";
import generateGrid from "./utils/generate-grid";
import { Coins, Heart, Skull } from "lucide-react";
// import Tower from "./objects/tower";
import { Context, Point } from "./types/global";
import { useToast } from "./components/toaster";
import OffscreenCanvas from "./components/offscreen-canvas";
import Effect from "./objects/effect";
import hover from "./utils/hover";
import useCells from "./stores/cells";
// import { RocketTower } from "./objects/towers";
// import DefenseEntity from "./objects/entities/defense-entity";
import define from "./utils/define-ctx";
import { Defense, RocketTower as MegaTower } from "./objects/defense";

let frameId: number;

const enemies: Enemy[] = [];
const towers: Defense[] = [];

interface Game {
  enemiesCount: number;
  over: boolean;
  hp: number;
  currentWave: number;
  paused: boolean;
  coins: number;
  level: number;
  trial: number;
}

const defaultGame: Game = {
  enemiesCount: 0,
  over: false,
  hp: 18,
  currentWave: 1,
  paused: false,
  coins: 10,
  level: 1,
  trial: 1,
};

function App() {
  const toast = useToast();
  const cells = useCells();
  const [game, setGame] = useState<Game>(defaultGame);
  const [objects, setObjects] = useState({
    effects: [] as Effect[],
  });
  const hoveredCell = useRef<Point | null>(null);

  const canvas = useRef<HTMLCanvasElement>(null);

  const gameTime = useRef<number>(0);
  const currentWave = useRef<number>(1);

  const { grid, waypoints } = useMemo(() => {
    const { grid, waypoints } = generateGrid(2);

    cells.reset();

    waypoints.forEach((waypoint) => {
      cells.set(`${waypoint.x},${waypoint.y}`, waypoint);
    });

    return { grid, waypoints };
  }, [game.trial, game.level]);
  const entry = useMemo(() => waypoints[0], [waypoints]);

  function resetGame(incTrial: boolean = true, incLevel = false) {
    setGame((prev) => {
      console.log(prev.trial + 1);
      return {
        ...defaultGame,
        trial: incTrial ? prev.trial + 1 : 1, // increase trial or reset it
        level: incLevel ? prev.level + 1 : prev.level, // increase level
      };
    });

    currentWave.current = 1;
    gameTime.current = 0;

    enemies.splice(0, enemies.length);
    towers.splice(0, towers.length);
  }

  // do once effect
  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d") as Context;
    if (!ctx) return;

    define(ctx);
  }, []);

  useEffect(() => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d") as Context;
    if (!ctx) return;

    function gameLoop(ctx: Context) {
      if (game.paused) return;

      // update time
      gameTime.current++;

      // spawn enemies
      const randomX = Math.floor(Math.random() * 100);
      switch (currentWave.current) {
        case 1:
          if (randomX < 1) {
            enemies.push(new Enemy(ctx, entry.x, entry.y, 0.02, 1, waypoints));
            setGame((prev) => {
              const newCount = prev.enemiesCount + 1;

              if (newCount == 15) {
                currentWave.current++;
              }

              return {
                ...prev,
                currentWave: currentWave.current,
                enemiesCount: newCount,
              };
            });
          }
          break;
        case 2:
          if (randomX < 3) {
            enemies.push(new Enemy(ctx, entry.x, entry.y, 0.04, 8, waypoints));
            setGame((prev) => {
              const newCount = prev.enemiesCount + 1;

              if (newCount == 30) {
                currentWave.current++;
              }

              return {
                ...prev,
                currentWave: currentWave.current,
                enemiesCount: newCount,
              };
            });
          }
          break;
        case 3:
          if (randomX < 3) {
            enemies.push(new Enemy(ctx, entry.x, entry.y, 0.1, 15, waypoints));
            setGame((prev) => {
              const newCount = prev.enemiesCount + 1;

              if (newCount == 70) {
                currentWave.current++;
                toast("You choose the wrong path 💀. WAVE 4 🔥");
              }

              return {
                ...prev,
                currentWave: currentWave.current,
                enemiesCount: newCount,
              };
            });
          }
          break;
        case 4:
          if (randomX < 3) {
            // enemies.push(new Enemy(ctx, entry.x, entry.y, 0.1, 30, waypoints));
            setGame((prev) => {
              const newCount = prev.enemiesCount + 1;

              if (newCount == 100) {
                currentWave.current++;
                toast("YOU WILL REGET KILLING 100 ENEMIES. WAVE 5 🔥");
              }

              return {
                ...prev,
                currentWave: currentWave.current,
                enemiesCount: newCount,
              };
            });
          }
          break;
        case 5:
          if (randomX < 5) {
            // enemies.push(new Enemy(ctx, entry.x, entry.y, 0.15, 35, waypoints));
            setGame((prev) => {
              const newCount = prev.enemiesCount + 1;

              if (newCount == 102) {
                toast("CATCH ME IF YOU CAN 🤞");
                enemies
                  .push
                  // new Enemy(ctx, entry.x, entry.y, 0.4, 35, waypoints)
                  ();
              }

              return {
                ...prev,
                currentWave: currentWave.current,
                enemiesCount: newCount,
              };
            });
          }
          break;
      }

      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      hover(ctx, hoveredCell.current);

      towers.forEach((tower) => tower.update(enemies, gameTime.current));
      towers.forEach((tower) => tower.draw(ctx));

      enemies.forEach((enemy, index) => {
        enemy.update();
        enemy.draw();

        if (enemy.destroied !== "none") {
          if (enemy.destroied == "entered") {
            setGame((prev) => {
              if (prev.hp - enemy.health <= 0) {
                return { ...prev, over: true, paused: true, hp: 0 };
              }
              return { ...prev, hp: prev.hp - enemy.health };
            });
          } else if (enemy.destroied == "dead") {
            setObjects((prev) => ({
              ...prev,
              effects: [...prev.effects, new Effect(enemy.x, enemy.y)],
            }));
            setGame((prev) => ({ ...prev, coins: prev.coins + 5 }));
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
      const cell = cells.get(`${x},${y}`);

      if (cell) hoveredCell.current = cell;
      else hoveredCell.current = { x, y };
    } else {
      hoveredCell.current = null;
    }

    console.log(hoveredCell.current);
  };

  const handleMouseClick = () => {
    const towerCoins = 5;

    if (
      hoveredCell.current!.type == "path" ||
      hoveredCell.current!.type == "something"
    ) {
      return;
    }

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    if (hoveredCell.current!.type == "tower") {
      if (game.coins < towerCoins) return;

      const t = towers.find(
        (t) => t.x === hoveredCell.current!.x && t.y === hoveredCell.current!.y
      );

      if (!t) return;

      // const result = t.upgrade();
      const result = true;

      if (result) {
        const newCell: Point = {
          x: t.x,
          y: t.y,
          type: "tower",
          level: t.level,
          max: t.max,
        };

        cells.set(`${t.x},${t.y}`, newCell);

        hoveredCell.current = newCell;

        setGame((prev) => ({ ...prev, coins: prev.coins - towerCoins }));
      }

      return;
    }

    if (game.coins >= towerCoins) {
      const { x, y } = hoveredCell.current!;
      // towers.push(new Tower(ctx, x, y));
      towers.push(new MegaTower(x, y) as any);
      hoveredCell.current = {
        x,
        y,
        type: "tower",
        level: 1,
      };
      cells.set(`${x},${y}`, hoveredCell.current);
      setGame((prev) => ({ ...prev, coins: prev.coins - towerCoins }));
    }
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
      <p className="coins-count">
        {game.coins} <Coins fill="#000" stroke="#45FF00" />
      </p>
      <p className="wave-number">
        <span>WAVE</span> {game.currentWave}
      </p>
      <section>
        <OffscreenCanvas grid={grid} effects={objects.effects} />
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
          <button onClick={() => resetGame()}>Retry</button>
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
