import { TILE_SIZE } from "../../config/constants";

export default class Effect {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    const img = new Image();
    img.src = "/textures/towerDefense_tile019.png";
    img.onload = () => {
      ctx.globalAlpha = 0.5;
      ctx.drawImage(
        img,
        this.x * TILE_SIZE,
        this.y * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
      );
      ctx.globalAlpha = 1;
    };
  }
}
