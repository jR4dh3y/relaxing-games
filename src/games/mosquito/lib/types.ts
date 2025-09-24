export interface Point {
  x: number;
  y: number;
}
export interface SplashDrop {
  dx: number;
  dy: number;
  r: number;
}
export interface IBloodSplash {
  x: number;
  y: number;
  ttl: number;
  drops: SplashDrop[];
  readonly alive: boolean;
  update(): void;
}
export interface IMosquito {
  idx: number;
  dead: boolean;
  dead_pos: Point | null;
  trail: Point[];
  advance(): void;
  currentPos(): Point;
  nextPos(): Point;
  checkHit(cursor: Point, hitboxScale: number): boolean;
}

// Shared helper describing hitbox geometry (ellipse + head circle)
export interface HitTestResult {
  inside: boolean;
  insideBody: boolean;
  insideHead: boolean;
}

export function hitTestMosquito(cursor: Point, center: Point, hitboxScale: number): HitTestResult {
  const a = 10 * hitboxScale; // body radii
  const b = 5 * hitboxScale;
  const rHead = 6 * hitboxScale; // head radius
  const dx_b = cursor.x - center.x;
  const dy_b = cursor.y - center.y;
  const insideBody = (dx_b * dx_b) / (a * a) + (dy_b * dy_b) / (b * b) <= 1;
  const dx_h = cursor.x - (center.x + 12 * hitboxScale);
  const dy_h = cursor.y - center.y;
  const insideHead = dx_h * dx_h + dy_h * dy_h <= rHead * rHead;
  return { inside: insideBody || insideHead, insideBody, insideHead };
}
