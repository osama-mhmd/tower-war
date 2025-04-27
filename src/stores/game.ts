import Game from "@/types/game";
import { create } from "zustand";

const defaultGame: Game = {
  enemiesCount: 0,
  state: "start",
  hp: 18,
  currentWave: 1,
  coins: 10,
  level: 1,
  trial: 1,
  effects: [],
  settings: {
    effectsVolume: 0.3,
  },
};

export interface GameStore {
  game: Game;
  setGame: (game: Partial<Game>) => void;
  getGame: () => Game;
  resetGame: (game?: Partial<Game>) => void;
}

const useGame = create<GameStore>((set, get) => ({
  game: defaultGame,
  setGame: (game) => set((prev) => ({ game: { ...prev.game, ...game } })),
  getGame: () => get().game,
  resetGame: (game = {}) =>
    set({
      game: { ...defaultGame, ...game },
    }),
}));

export default useGame;
