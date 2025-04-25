import Effect from "@/entities/effects/effect";
import { Point } from "./global";
import { Tower } from "./towers";
import { Enemy } from "@/entities/enemies";

export default interface Game {
  enemiesCount: number;
  hp: number;
  currentWave: number;
  state: "over" | "paused" | "running" | "start";
  coins: number;
  level: number;
  trial: number;
  currentWave: number;
  effects: Effect[];
  settings?: {
    effectsVolume: number;
  };
}
