import { DestroyableAggressiveEntity } from "./entities";

export interface Tower extends DestroyableAggressiveEntity {
  level: number;
  max: boolean;
  bullets: Bullet[];
  cannon: Cannon;
  health: number;

  fire: (target: Enemy, distance: number, gameTime: number) => void;
  update: (enmeies: Enemy[], gameTime: number) => void;
  draw: (ctx: Context) => void;
}
