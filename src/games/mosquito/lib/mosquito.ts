import type { Point, IMosquito } from "./types";
export class Mosquito implements IMosquito {
  path: Point[];
  scale: number;
  origin: Point;
  idx = 0;
  dead = false;
  trail: Point[] = [];
  dead_pos: Point | null = null;
  constructor(path: Point[], scale = 10, origin: Point) {
    this.path = path;
    this.scale = scale;
    this.origin = origin;
  }
  private posAt(idx: number): Point {
    const p = this.path[idx];
    return { x: this.origin.x + p.x * this.scale, y: this.origin.y + p.y * this.scale };
  }
  currentPos(): Point {
    return this.posAt(this.idx);
  }
  nextPos(): Point {
    return this.posAt((this.idx + 1) % (this.path.length - 1));
  }
  advance() {
    if (this.dead) return;
    this.idx = (this.idx + 1) % (this.path.length - 1);
    this.trail.push(this.currentPos());
    if (this.trail.length > this.path.length) this.trail.shift();
  }
  checkHit(cursor: Point, hitboxScale: number): boolean {
    if (this.dead) return false;
    const { x, y } = this.currentPos();
    const a = 10 * hitboxScale;
    const b = 5 * hitboxScale;
    const rHead = 6 * hitboxScale;
    const dx_b = cursor.x - x;
    const dy_b = cursor.y - y;
    const insideBody = (dx_b * dx_b) / (a * a) + (dy_b * dy_b) / (b * b) <= 1;
    const dx_h = cursor.x - (x + 12 * hitboxScale);
    const dy_h = cursor.y - y;
    const insideHead = dx_h * dx_h + dy_h * dy_h <= rHead * rHead;
    if (insideBody || insideHead) {
      this.dead = true;
      this.dead_pos = { x, y };
      return true;
    }
    return false;
  }
}
