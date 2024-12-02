import { useEffect, useRef } from "react";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../config/constants";
import drawGrid from "../utils/draw-grid";
import Effect from "../objects/effect";

export default function OffscreenCanvas({
  grid,
  effects,
}: {
  grid: number[][];
  effects: Effect[];
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const currentEffectIndex = useRef<number>(0);

  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;

    drawGrid(ctx, grid);
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
