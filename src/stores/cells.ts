import { create } from "zustand";
import { Point } from "../types/global";

export interface Store {
  cells: Map<string, Point>;
  set: (key: string, value: Point) => void;
  get: (key: string) => Point | undefined;
}

const useCells = create<Store>((set, get) => ({
  cells: new Map<string, Point>(),
  set: (key: string, value: Point) => {
    const cells = new Map(get().cells);
    cells.set(key, value);

    set({ cells });
  },
  get: (key: string) => {
    return get().cells.get(key);
  },
}));

export default useCells;
