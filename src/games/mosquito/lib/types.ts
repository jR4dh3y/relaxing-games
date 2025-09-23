export interface Point { x: number; y: number }
export interface SplashDrop { dx: number; dy: number; r: number }
export interface IBloodSplash { x: number; y: number; ttl: number; drops: SplashDrop[]; readonly alive: boolean; update(): void }
export interface IMosquito { idx: number; dead: boolean; dead_pos: Point | null; trail: Point[]; advance(): void; currentPos(): Point; nextPos(): Point; checkHit(cursor: Point, hitboxScale: number): boolean }