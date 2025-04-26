import Effect from "@/entities/effects/effect";

export default interface Game {
  enemiesCount: number;
  hp: number;
  currentWave: number;
  state: "over" | "paused" | "running" | "start" | "settings";
  coins: number;
  level: number;
  trial: number;
  currentWave: number;
  effects: Effect[];
  settings?: {
    effectsVolume: number;
  };
}
