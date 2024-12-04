export interface Tower {
  x: number;
  y: number;
  attackSpeed: number;
  lastShot: number;
  minRange?: number;
  maxRange: number;
  angle: number;
  damage: number;
  level: number;
  max: boolean;
  bullets: Bullet[];
  cannon: Cannon;

  fire: (target: Enemy, distance: number, gameTime: number) => void;
  update: (enmeies: Enemy[], gameTime: number) => void;
  draw: (ctx: Context) => void;
}
