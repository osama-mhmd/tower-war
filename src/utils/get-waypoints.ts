export default function getWaypoints(grid: number[][]) {
  const width = grid[0].length;
  const height = grid.length;

  const waypoints = [];
  for (let row = 0; row < height; row++) {
    for (let col = width - 1; col >= 0; col--) {
      if (grid[row][col] === 1) {
        waypoints.push({
          x: col,
          y: row,
        });
      }
    }
  }
  return waypoints;
}
