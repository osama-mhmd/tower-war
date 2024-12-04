import { calculateAngle } from "@/helpers";
import { TILE_SIZE } from "@/config/constants";
import { Context } from "@/types/global";
import { Enemy } from "@/entities/enemies";

export interface CannonConfig {
  x: number;
  y: number;
  /**
   * @default TILE_SIZE
   */
  size?: number;
  offsetX?: number;
  offsetY?: number;
  texture: string;
}

export class Cannon {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  size: number;
  angle = 0;
  texture: string;

  constructor({ x, y, size, texture, offsetX, offsetY }: CannonConfig) {
    this.x = x;
    this.y = y;
    this.size = size ?? TILE_SIZE;
    this.texture = texture;
    this.offsetX = offsetX ?? 0;
    this.offsetY = offsetY ?? 0;
  }

  update(target: Enemy) {
    this.angle = calculateAngle(this as any, target);

    return this.angle;
  }

  draw(ctx: Context) {
    const size = TILE_SIZE;

    ctx.save();
    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);
    ctx.rotate(this.angle + 1.5708); // 1.5708rad = 90deg

    const t = new Image(64, 64);
    t.src = `/textures/${this.texture}.png`;
    const offsetX = this.offsetX; // size / 6;
    ctx.drawImage(t, -size / 2, -size / 2 - offsetX, size, size);

    ctx.restore();
  }
}
