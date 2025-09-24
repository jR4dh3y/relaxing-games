import type { IBloodSplash, SplashDrop, Point } from "./types";
export class BloodSplash implements IBloodSplash {
  x: number;
  y: number;
  ttl = 45;
  drops: SplashDrop[] = [];
  constructor(pos: Point, drops = 24, spread = 28) {
    this.x = pos.x;
    this.y = pos.y;
    for (let i = 0; i < drops; i++) {
      const ang = Math.random() * Math.PI * 2;
      const dist = Math.random() * (spread - 4) + 4;
      const dx = Math.cos(ang) * dist;
      const dy = Math.sin(ang) * dist;
      const r = Math.random() * 3 + 2;
      this.drops.push({ dx, dy, r });
    }
  }
  get alive() {
    return this.ttl > 0;
  }
  update() {
    if (this.ttl > 0) this.ttl--;
  }
}
