import { Context } from "../types/global";

export interface BulletConfig {
  x: number;
  y: number;
  speed: number;
  texture: string;
  offsetX?: number;
  offsetY?: number;
  distance?: number;
}

export interface FireConfig extends BulletConfig {
  distance: number;
  angle: number;
}

export interface RocketConfig extends BulletConfig {
  target?: Enemy;
  damage: number;
}

export interface Bullet extends BulletConfig {
  angle: number;
  isDestroyed: boolean;

  update(): void;
  draw(ctx: Context): void;
}
