export interface Point {
  x: number;
  y: number;
  type?: "tower" | "enemy" | "path" | "ground";
}
