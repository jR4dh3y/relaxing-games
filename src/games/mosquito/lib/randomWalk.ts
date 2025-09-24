import type { Point } from "./types";
export function generateRandomWalk(steps = 10000, stepMean = 1, stepStd = 0.2): Point[] {
  const pos: Point[] = new Array(steps);
  pos[0] = { x: 0, y: 0 };
  for (let i = 1; i < steps; i++) {
    const angle = Math.random() * Math.PI * 2;
    const u1 = Math.random() || 1e-6;
    const u2 = Math.random() || 1e-6; // Box-Muller
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2);
    const step = stepMean + stepStd * z;
    const dx = step * Math.cos(angle);
    const dy = step * Math.sin(angle);
    const prev = pos[i - 1];
    pos[i] = { x: prev.x + dx, y: prev.y + dy };
  }
  return pos;
}
