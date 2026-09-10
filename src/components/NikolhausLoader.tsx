import { useEffect, useRef } from "react";

type Point = [number, number];

const points: Record<number, Point> = {
  1: [-50, -50],
  2: [50, -50],
  3: [50, 50],
  4: [-50, 50],
  5: [0, 100],
};

// The 44 valid Euler paths for "Das Haus vom Nikolaus".
// Each number refers to one of the five points above.
const solutions: number[][] = [
 [2, 3, 1, 4, 3, 5, 4, 2],
 [1, 2, 3, 1, 4, 5, 3, 4, 2],
 [1, 2, 3, 4, 1, 3, 5, 4, 2],
 [1, 2, 3, 4, 5, 3, 1, 4, 2],
 [1, 2, 3, 5, 4, 1, 3, 4, 2],
 [1, 2, 3, 5, 4, 3, 1, 4, 2],
 [1, 2, 4, 1, 3, 4, 5, 3, 2],
 [1, 2, 4, 1, 3, 5, 4, 3, 2],
 [1, 2, 4, 3, 1, 4, 5, 3, 2],
 [2, 4, 3, 5, 4, 1, 3, 2],
 [1, 2, 4, 5, 3, 1, 4, 3, 2],
 [1, 2, 4, 5, 3, 4, 1, 3, 2],
 [1, 3, 2, 1, 4, 3, 5, 4, 2],
 [1, 3, 2, 1, 4, 5, 3, 4, 2],
 [1, 3, 2, 4, 3, 5, 4, 1, 2],
 [1, 3, 2, 4, 5, 3, 4, 1, 2],
 [1, 3, 4, 1, 2, 3, 5, 4, 2],
 [1, 3, 4, 1, 2, 4, 5, 3, 2],
 [3, 4, 2, 1, 4, 5, 3, 2],
 [1, 3, 4, 2, 3, 5, 4, 1, 2],
 [1, 3, 4, 5, 3, 2, 1, 4, 2],
 [1, 3, 4, 5, 3, 2, 4, 1, 2],
 [1, 3, 5, 4, 1, 2, 3, 4, 2],
 [1, 3, 5, 4, 1, 2, 4, 3, 2],
 [1, 3, 5, 4, 2, 1, 4, 3, 2],
 [1, 3, 5, 4, 2, 3, 4, 1, 2],
 [1, 3, 5, 4, 3, 2, 1, 4, 2],
 [3, 5, 4, 3, 2, 4, 1, 2],
 [1, 4, 2, 1, 3, 4, 5, 3, 2],
 [1, 4, 2, 1, 3, 5, 4, 3, 2],
 [1, 4, 2, 3, 4, 5, 3, 1, 2],
 [1, 4, 2, 3, 5, 4, 3, 1, 2],
 [1, 4, 3, 1, 2, 3, 5, 4, 2],
 [1, 4, 3, 1, 2, 4, 5, 3, 2],
 [1, 4, 3, 2, 1, 3, 5, 4, 2],
 [1, 4, 3, 2, 4, 5, 3, 1, 2]
];

export interface NikolhausLoaderProps {
  size?: number;
  lineWidth?: number;
  color?: string;
  /** Pen speed in pixels per second. */
  speed?: number;
  /** Hold, in ms, once a house is complete before the next begins. */
  pause?: number;
  className?: string;
}

export default function NikolhausLoader({
  size = 200,
  lineWidth = 3,
  color = "currentColor",
  speed = 180,
  pause = 1000,
  className,
}: NikolhausLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    let cancelled = false;
    let raf = 0;
    let solutionIndex = 0;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    ctx.scale(dpr, dpr);
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = color;

    const scale = Math.min(size / 240, 1.5);
    const getPoint = (id: number): Point => {
      const [x, y] = points[id];
      return [x * scale, -y * scale];
    };

    // Draw one house: the pen advances along the path at a constant speed, so
    // the line grows smoothly across each edge instead of snapping vertex to
    // vertex. `speed` is pixels per second.
    const drawHouse = () => {
      const verts = solutions[solutionIndex].map(getPoint);
      const segLen = verts.slice(1).map(([x, y], i) => {
        const [px, py] = verts[i];
        return Math.hypot(x - px, y - py);
      });
      const total = segLen.reduce((a, b) => a + b, 0);

      let start: number | null = null;

      const frame = (now: number) => {
        if (cancelled) return;
        if (start === null) start = now;

        const drawn = Math.min(((now - start) / 1000) * speed, total);

        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.translate(size / 2, size / 2 + 10);
        ctx.beginPath();
        ctx.moveTo(verts[0][0], verts[0][1]);

        let left = drawn;
        for (let i = 0; i < segLen.length; i++) {
          const [ax, ay] = verts[i];
          const [bx, by] = verts[i + 1];
          if (left >= segLen[i]) {
            ctx.lineTo(bx, by);
            left -= segLen[i];
          } else {
            const f = segLen[i] === 0 ? 0 : left / segLen[i];
            ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
            break;
          }
        }

        ctx.stroke();
        ctx.restore();

        if (drawn >= total) {
          raf = window.setTimeout(() => {
            solutionIndex = (solutionIndex + 1) % solutions.length;
            raf = requestAnimationFrame(drawHouse);
          }, pause);
          return;
        }

        raf = requestAnimationFrame(frame);
      };

      raf = requestAnimationFrame(frame);
    };

    drawHouse();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(raf);
    };
  }, [size, lineWidth, color, speed, pause]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-label="Loading"
      role="status"
    />
  );
}
