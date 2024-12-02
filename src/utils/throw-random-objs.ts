import { COLUMNS_COUNT, ROWS_COUNT, TILE_SIZE } from "../config/constants";
import Rand from "../libs/rand";
import { Store } from "../stores/cells";

export default function throwRandomObjs(
  ctx: CanvasRenderingContext2D,
  { get, set }: Store,
  imgSrc: string,
  range: [number, number] = [2, 1],
  config?: {
    shouldDoSet?: boolean;
    offsetX?: number;
    offsetY?: number;
    size?: number;
    onPath?: boolean;
  }
) {
  const img = new Image();
  img.src = `/textures/${imgSrc}.png`;
  let count = Rand.randomIntInRange(...range);
  img.onload = () => {
    while (count > 0) {
      const [x, y] = [
        Rand.randomIntInRange(ROWS_COUNT - 1),
        Rand.randomIntInRange(COLUMNS_COUNT - 1),
      ];
      if (config?.onPath !== true) if (get(`${x},${y}`)) continue;
      if (config?.onPath === true)
        if (get(`${x},${y}`)?.type !== "path") continue;
      const offset_X = config?.offsetX ?? 0;
      const offset_Y = config?.offsetY ?? 0;
      const size = (config?.size ?? 1) * TILE_SIZE;
      ctx.drawImage(
        img,
        (x + offset_X) * TILE_SIZE,
        (y + offset_Y) * TILE_SIZE,
        size,
        size
      );
      if (config?.shouldDoSet !== false) {
        set(`${x},${y}`, {
          x,
          y,
          type: "something",
        });
      }
      count--;
    }
  };
}
