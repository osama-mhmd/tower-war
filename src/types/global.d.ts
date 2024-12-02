export interface Point {
  x: number;
  y: number;
  type?: "tower" | "enemy" | "path" | "ground" | "something"; // something means "rock" | "flower"
  level?: number;
  max?: boolean;
  pathType?:
    | "vertical"
    | "horizontal"
    | "corner-top-right"
    | "corner-top-left"
    | "corner-bottom-right"
    | "corner-bottom-left";
}
