import { calculateAngle } from "@/helpers";
import { TILE_SIZE } from "@/config/constants";
import { Context } from "@/types/global";

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
  angleOffset?: number;
}

export class Cannon {
  x: number;
  y: number;
  offsetX: number;
  offsetY: number;
  size: number;
  angle = 0;
  texture: string;
  angleOffset: number;

  constructor({
    x,
    y,
    size,
    texture,
    offsetX,
    offsetY,
    angleOffset,
  }: CannonConfig) {
    this.x = x;
    this.y = y;
    this.size = size ?? TILE_SIZE;
    this.texture = texture;
    this.offsetX = offsetX ?? 0;
    this.offsetY = offsetY ?? 0;
    this.angleOffset = angleOffset ?? 1.5708; // 1.5708rad = 90deg
  }

  update(target: { x: number; y: number }) {
    this.angle = calculateAngle(this, target);

    return this.angle;
  }

  draw(ctx: Context) {
    const size = TILE_SIZE;

    ctx.save();
    ctx.translate((this.x + 1 / 2) * TILE_SIZE, (this.y + 1 / 2) * TILE_SIZE);
    ctx.rotate(this.angle + this.angleOffset);

    const t = new Image(64, 64);
    t.src = `/textures/${this.texture}.png`;
    ctx.drawImage(
      t,
      -size / 2 - this.offsetX,
      -size / 2 - this.offsetY,
      size,
      size
    );

    ctx.restore();
  }
}
