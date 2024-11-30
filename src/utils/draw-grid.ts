import { TILE_SIZE, ROWS_COUNT, COLUMNS_COUNT } from "../config/constants";
import { Point } from "../types/global";

export default function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  hoveredCell: Point | null
) {
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLUMNS_COUNT; col++) {
      ctx.fillStyle = grid[row][col] === 1 ? "#aaa" : "#ccc";
      if (hoveredCell && hoveredCell.x === col && hoveredCell.y === row) {
        ctx.fillStyle = "#bbb";
      }
      ctx.fillRect(col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
  }
}
