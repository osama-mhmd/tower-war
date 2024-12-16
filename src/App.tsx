import { useEffect, useMemo, useRef, useState } from "react";
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
import { MegaTower, RocketTower } from "@/entities/towers";
import { Tower } from "@/types/towers";
import Enemy from "@/types/enemies";
import Start from "./components/start";
import useSound from "use-sound";
import { cn } from "./utils";
import SettingsTrigger from "./components/settings-trigger";

const towers: Tower[] = [];
const enemies: Enemy[] = [];

function App() {
  const cells = useCells();

  const { game, getGame, setGame, resetGame } = useGame();

  const [start, setStart] = useState(false);
  // const [play] = useSound("/sounds/metal-hit-woosh.wav", {
  //   volume: 0.5,
  //   onload: () => {
  //     setStart(true);
  //   },
  // });
  const [mouseClick] = useSound("/sounds/mouse-click-2.wav", { volume: 0.4 });
  const [mouseClick2] = useSound("/sounds/mouse-click.wav", { volume: 0.4 });

  const canvas = useRef<HTMLCanvasElement>(null);
  const [tower, setTower] = useState("mega");

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

    setStart(true);
    setTimeout(() => setStart(false), 1400);
  }, []);

  useEffect(() => {
    if (game.over) {
      const warDrum = new Audio();
      warDrum.src = "/sounds/drums-of-war.wav";
      warDrum.play();
    }
  }, [game.over]);

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
        setCells: cells.set,
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

  const [success] = useSound("/sounds/success-notification.wav");

  // TODO: Handle pausing the game while the timeout to trigger sound is still perparing
  useEffect(() => {
    setTimeout(() => success(), 1500);
  }, [game.currentWave]);

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

    const cost = avaliableTowers.find((el) => el.name == tower)?.cost ?? 0;

    if (
      hoveredCell.current!.type == "path" ||
      hoveredCell.current!.type == "something"
    ) {
      return;
    }

    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    if (hoveredCell.current!.type == "tower") {
      return;

      // if (coins < cost) return;

      // const t = towers.find(
      //   (t) => t.x === hoveredCell.current!.x && t.y === hoveredCell.current!.y
      // );

      // if (!t) return;

      // // const result = t.upgrade();
      // const result = true;

      // if (result) {
      //   const newCell: Point = {
      //     x: t.x,
      //     y: t.y,
      //     type: "tower",
      //     level: t.level,
      //     max: t.max,
      //   };

      //   cells.set(`${t.x},${t.y}`, newCell);

      //   const game = getGame();
      //   setGame({ coins: game.coins - cost });
      //   hoveredCell.current = newCell;
      // }

      // return;
    }

    if (coins >= cost) {
      const { x, y } = hoveredCell.current!;
      const game = getGame();

      if (tower == "mega") towers.push(new MegaTower(x, y));
      if (tower == "rocket") towers.push(new RocketTower(x, y));

      setGame({ coins: game.coins - cost });

      hoveredCell.current = {
        x,
        y,
        type: "tower",
        level: 1,
      };

      cells.set(`${x},${y}`, hoveredCell.current!);
    }
  };

  return (
    <main>
      <div
        className="logo"
        onClick={() => {
          mouseClick();
          setGame({ paused: true });
        }}
      >
        <img src="/tower-defense-logo.png" width={80} alt="Tower Defense" />
      </div>
      <SettingsTrigger
        onClick={() => {
          mouseClick();
          setGame({ paused: true });
        }}
      />
      <div className="status">
        <p>
          {game.hp} <Heart fill="red" stroke="#d30" />
        </p>
        <p>
          {game.enemiesCount} <Skull fill="#000" stroke="#FF4500" />
        </p>
        <p>
          {game.coins} <Coins fill="#000" stroke="#45FF00" />
        </p>
      </div>
      <p
        key={game.currentWave}
        style={{
          animationPlayState: game.paused ? "paused" : "running",
        }}
        className="wave-number"
      >
        <span>WAVE</span> {game.currentWave}
      </p>
      <section>
        <OffscreenCanvas grid={grid} />
        <canvas
          ref={canvas}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="main-canvas"
          onMouseMove={handleMouseMove}
          onClick={handleMouseClick}
        ></canvas>
      </section>
      <div className="towers">
        {avaliableTowers.map((t) => {
          return (
            <div
              key={t.name}
              onClick={() => {
                if (game.coins >= t.cost && tower !== t.name) {
                  setTower(t.name);
                  mouseClick2();
                }
              }}
              className={cn(
                t.name == tower ? "active" : "",
                game.coins >= t.cost ? "" : "cannot-purchase"
              )}
            >
              <img
                alt={t.name}
                draggable={false}
                src={`/textures/${t.tileSrc}.png`}
              />
              <span>{t.cost}</span>
            </div>
          );
        })}
      </div>
      {game.over && (
        <div className="overlay text-2xl">
          <p>Game over</p>
          <button
            onClick={() => {
              mouseClick();
              reset();
            }}
            className="text-lg"
          >
            Retry
          </button>
        </div>
      )}
      {!game.over && game.paused && (
        <div className="overlay text-2xl">
          <p>Paused</p>
          <button
            onClick={() => {
              mouseClick();
              setGame({ paused: false });
            }}
            className="text-lg"
          >
            Continue
          </button>
        </div>
      )}

      {start && <Start />}
    </main>
  );
}

const avaliableTowers = [
  { name: "mega", tileSrc: "towerDefense_tile249", cost: 5 },
  { name: "rocket", tileSrc: "towerDefense_tile206", cost: 15 },
];

export default App;
