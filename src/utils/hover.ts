import { TILE_SIZE } from "../config/constants";
import { Point } from "../types/global";

export default function hover(
  ctx: CanvasRenderingContext2D,
  hoveredCell: Point | null
) {
  if (!hoveredCell) return;
  ctx.fillStyle = "#22002211";
  if (hoveredCell.type == "tower") {
    ctx.fillStyle = "#7aff7575";
    if (hoveredCell.max) {
      ctx.fillStyle = "#fff";
    }
  }
  ctx.fillRect(
    hoveredCell.x * TILE_SIZE,
    hoveredCell.y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}
