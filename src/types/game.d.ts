import Effect from "@/entities/effects/effect";
import { Point } from "./global";
import { Tower } from "./towers";
import { Enemy } from "@/entities/enemies";

export default interface Game {
  enemiesCount: number;
  over: boolean;
  hp: number;
  currentWave: number;
  paused: boolean;
  coins: number;
  level: number;
  trial: number;
  gameTime: number;
  currentWave: number;
  hoveredCell: Point | null;
  towers: Tower[];
  effects: Effect[];
  enemies: Enemy[];
}
