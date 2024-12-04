import Enemy from "./src/objects/enemy";

type Ctx = CanvasRenderingContext2D;

interface Defense {
  x: number;
  y: number;
  shootRate: number;
  lastShot: number;
  minRange?: number;
  maxRange: number;
  angle: number;
  damage: number;
  level: number;
  max: boolean;
  bullets: string[]; // Bullet[]
  fire: (target: string, distance: number, gameTime: number) => void; // target: Enemy
  update: (ctx: Ctx, enmeies: Enemy[], gameTime: number) => void;
  draw: (ctx: Ctx) => void;
}

class MegaTower implements Defense {
  x: number;
  y: number;
  shootRate: number = 1;
  lastShot: number = 0;
  minRange: number = 0;
  maxRange: number = 3;
  angle: number = 0;
  damage: number = 2;
  level: number = 1;
  max: boolean = false;
  bullets: string[] = []; // Bullet[]

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  fire() {}

  update() {}

  draw() {}
}
