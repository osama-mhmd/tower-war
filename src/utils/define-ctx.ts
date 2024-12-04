import { TILE_SIZE } from "../config/constants";

export default function define(ctx: CanvasRenderingContext2D) {
  Object.defineProperties(ctx, {
    draw: {
      writable: false,
      value: function (url: string, x: number, y: number, size = TILE_SIZE) {
        const img = new Image(size, size);
        img.src = url[0] == "/" ? url : `/textures/${url}.png`;

        this.drawImage(img, x * TILE_SIZE, y * TILE_SIZE, size, size);
      },
    },
  });
}
