import { TILE_SIZE, ROWS_COUNT, COLUMNS_COUNT } from "../config/constants";

export default function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: number[][]
) {
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLUMNS_COUNT; col++) {
      ctx.fillStyle = grid[row][col] === 1 ? "#aaa" : "#ccc";
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      // ctx.strokeStyle = "#000";
      // ctx.strokeRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}
