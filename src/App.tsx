import { useEffect, useMemo, useRef } from "react";
import "./App.css";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  COLUMNS_COUNT,
  ROWS_COUNT,
  TILE_SIZE,
} from "./config/constants";
import generateGrid from "./utils/generate-grid";
import { Coins, Heart, Skull } from "lucide-react";
import { Context, Point } from "./types/global";
import OffscreenCanvas from "./components/offscreen-canvas";
import useCells from "./stores/cells";
import define from "./utils/define-ctx";
import gameLoop from "@/core/gameloop";
import useGame from "./stores/game";
import { MegaTower } from "@/entities/towers";
import { Tower } from "@/types/towers";
import { Enemy } from "./entities/enemies";

const towers: Tower[] = [];
const enemies: Enemy[] = [];

function App() {
  const cells = useCells();

  console.log("Rendered");

  const { game, getGame, setGame, resetGame } = useGame();

  const canvas = useRef<HTMLCanvasElement>(null);

  const hoveredCell = useRef<Point | null>(null);

  const { grid, waypoints } = useMemo(() => {
    const { grid, waypoints } = generateGrid(2);

    cells.reset();

    waypoints.forEach((waypoint) => {
      cells.set(`${waypoint.x},${waypoint.y}`, waypoint);
    });

    return { grid, waypoints };
  }, [game.trial, game.level]);

  const entry = useMemo(() => waypoints[0], [waypoints]);

  function reset(incTrial: boolean = true, incLevel = false) {
    const prev = getGame();

    resetGame({
      trial: incTrial ? prev.trial + 1 : 1, // increase trial or reset it
      level: incLevel ? prev.level + 1 : prev.level, // increase level
    });

    towers.splice(0, towers.length);
    enemies.splice(0, enemies.length);
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
  }, [game.paused]);

  // keyboard controls effect
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        setGame({ paused: !getGame().paused });
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
  };

  const handleMouseClick = () => {
    const { coins } = getGame();

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
      if (coins < towerCoins) return;

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

        const game = getGame();
        setGame({ coins: game.coins - towerCoins });
        hoveredCell.current = newCell;
      }

      return;
    }

    if (coins >= towerCoins) {
      const { x, y } = hoveredCell.current!;
      const game = getGame();

      towers.push(new MegaTower(x, y) as any);

      cells.set(`${x},${y}`, hoveredCell.current!);
      setGame({
        coins: game.coins - towerCoins,
      });
      hoveredCell.current = {
        x,
        y,
        type: "tower",
        level: 1,
      };
    }
  };

  return (
    <main>
      <div className="logo" onClick={() => setGame({ paused: true })}>
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
        <OffscreenCanvas grid={grid} />
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
          <button onClick={() => reset()}>Retry</button>
        </div>
      )}
      {!game.over && game.paused && (
        <div className="overlay">
          <p>Paused</p>
          <button onClick={() => setGame({ paused: false })}>Continue</button>
        </div>
      )}
    </main>
  );
}

export default App;
