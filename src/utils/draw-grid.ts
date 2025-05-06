import textures from "@/config/boimes-textures";
import { TILE_SIZE, ROWS_COUNT, COLUMNS_COUNT } from "../config/constants";
// import { Point } from "../types/global";

function getPathTexture(grid: number[][], row: number, col: number) {
  const top = grid[row - 1]?.[col] === 1; // Check if top is a path
  const bottom = grid[row + 1]?.[col] === 1;
  const left = grid[row]?.[col - 1] === 1;
  const right = grid[row]?.[col + 1] === 1;

  // if (top && right && left) return "t-top-rl";
  // if (bottom && right && left) return "t-bottom-rl";
  // if (top && bottom && right) return "t-top-br";
  // if (top && bottom && left) return "t-top-bl";
  if (top && bottom) return "vertical";
  if (left && right) return "horizontal";
  if (top && right) return "corner-top-right";
  if (top && left) return "corner-top-left";
  if (bottom && right) return "corner-bottom-right";
  if (bottom && left) return "corner-bottom-left";
  return "vertical";
}

export default function drawGrid(
  ctx: CanvasRenderingContext2D,
  grid: number[][],
  boime: 0 | 1 | 2 = 0
  // hoveredCell: Point | null // TODO: hoveredCell
) {
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLUMNS_COUNT; col++) {
      const isPath = grid[row][col] === 1;

      if (isPath) {
        const textureKey = getPathTexture(grid, row, col);

        for (let i = 0; i < 4; i++) {
          const image = new Image();
          image.src = `/textures/${textures[boime][textureKey][i]}.png`;

          let offsetX = 0;
          let offsetY = 0;

          if (i === 1) {
            offsetX = TILE_SIZE / 2;
          } else if (i === 2) {
            offsetY = TILE_SIZE / 2;
          } else if (i === 3) {
            offsetX = TILE_SIZE / 2;
            offsetY = TILE_SIZE / 2;
          }

          image.onload = () => {
            ctx.drawImage(
              image,
              col * TILE_SIZE + offsetX,
              row * TILE_SIZE + offsetY,
              TILE_SIZE / 2,
              TILE_SIZE / 2
            );
          };
        }
      } else {
        const grassTexture = new Image();
        grassTexture.src = `/textures/${textures[boime].grass}.png`;

        grassTexture.onload = () => {
          ctx.drawImage(
            grassTexture,
            col * TILE_SIZE,
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE
          );
        };

        // TODO: Drawing slots for avaliable places for towrs
        // const slot = new Image();
        // slot.src = "/textures/towerDefense_tile018.png";

        // slot.onload = () => {
        //   ctx.drawImage(
        //     slot,
        //     col * TILE_SIZE,
        //     row * TILE_SIZE,
        //     TILE_SIZE,
        //     TILE_SIZE
        //   );
        // };
      }
    }
  }
}
