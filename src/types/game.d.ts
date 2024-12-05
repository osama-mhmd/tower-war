import Effect from "@/entities/effects/effect";
import { Point } from "./global";
import { Tower } from "./towers";
import { Enemy } from "@/entities/enemies";

export default interface Game {
  enemiesCount: number; // Y
  over: boolean; // Y
  hp: number; // Y
  currentWave: number; // Y
  paused: boolean; // Y
  coins: number; // Y
  level: number; // Y
  trial: number; // Y
  currentWave: number; // Y
}
// effects: Effect[]; // Y
