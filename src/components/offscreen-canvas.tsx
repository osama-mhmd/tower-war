import { useEffect, useRef } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config/constants";
import drawGrid from "../utils/draw-grid";
import Effect from "../objects/effect";
import useCells from "../stores/cells";
import throwRandomObjs from "../utils/throw-random-objs";

export default function OffscreenCanvas({
  grid,
  effects,
}: {
  grid: number[][];
  effects: Effect[];
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const currentEffectIndex = useRef<number>(0);
  const store = useCells();

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    drawGrid(ctx, grid);

    // spawn random rocks
    throwRandomObjs(ctx, store, "towerDefense_tile135", [1, 0]);
    // another variant
    throwRandomObjs(ctx, store, "towerDefense_tile136", [1, 0]);
    // another variant
    throwRandomObjs(ctx, store, "towerDefense_tile137", [1, 0]);

    // spawn random flowers
    throwRandomObjs(ctx, store, "towerDefense_tile132");

    // spawn random damage
    throwRandomObjs(ctx, store, "towerDefense_tile020", [5, 4], {
      shouldDoSet: false,
    });

    // spawn random pushes
    throwRandomObjs(ctx, store, "towerDefense_tile131", [3, 2], {
      size: 0.75,
      offsetX: 0.4,
      offsetY: 0.4,
      onPath: true,
    });
  }, []);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    for (let i = currentEffectIndex.current; i < effects.length; i++) {
      effects[i].draw(ctx);
      currentEffectIndex.current++;
    }
  }, [effects]);

  return (
    <canvas
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      ref={canvas}
      className="offscreen-canvas"
    ></canvas>
  );
}
