import Game from "@/types/game";
import { create } from "zustand";

const defaultGame: Game = {
  enemiesCount: 0,
  over: false,
  hp: 18,
  currentWave: 1,
  paused: false,
  coins: 10,
  level: 1,
  trial: 1,
  effects: [],
  towers: [],
  enemies: [],
  gameTime: 0,
  hoveredCell: null,
};

export interface GameStore {
  game: Game;
  setGame: (game: Partial<Game>) => void;
  getGame: () => Game;
  resetGame: () => void;
}

const useGame = create<GameStore>((set, get) => ({
  game: defaultGame,
  setGame: (game) => set({ game: { ...get().game, ...game } }),
  getGame: () => get().game,
  resetGame: () => set({ game: defaultGame }),
}));

export default useGame;
