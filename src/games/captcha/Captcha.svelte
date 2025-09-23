<script>
  import { onMount } from 'svelte';
  export let imageSrc = 'stop.jpg';
  export let instruction = 'Select all tiles that contain the stop sign';

  const STOP_SIGN_POLY = [
    { x: 590.00000, y:  90.00000 },
    { x: 725.00000, y:  90.00000 },
    { x: 822.00000, y: 175.00000 },
    { x: 825.00000, y: 310.00000 },
    { x: 740.60155, y: 405.00000 },
    { x: 601.00000, y: 412.00000 },
    { x: 500.00000, y: 315.60155 },
    { x: 499.00000, y: 185.39845 }
  ];
  const STOP_BOUNDS = { minX: 512.0, minY: 90.0, maxX: 822.0, maxY: 400.0 };
  const STOP_CENTER_X = 667.0;
  const STOP_CENTER_Y = 245.0;

  let tiles = [];
  const cols = 8;
  const rows = 8;
  const imgWidth = 1024; const imgHeight = 900;
  const gridWidth = 1024; const gridHeight = 768; 
  const maxDepth = 2;
  let clickCount = 0; let subdivisionCount = 0; let completed = false; let showDebug = false;

  function toggleDebug(){ showDebug = !showDebug; }
  function reset(){ initGrid(); clickCount=0; subdivisionCount=0; completed=false; }
  function checkCompletion(){ for (const t of tiles){ if (tileIntersectsStopSign(t) && t.depth < maxDepth) return; } completed = true; }
  function initGrid(){ tiles=[]; const tileW=imgWidth/cols; const tileH=imgHeight/rows; for(let r=0;r<rows;r++){ for(let c=0;c<cols;c++){ tiles.push({ x:c*tileW, y:r*tileH, w:tileW, h:tileH, depth:0 }); } } }
  initGrid();

  function pointInPoly(x,y,poly){ let inside=false; for(let i=0,j=poly.length-1;i<poly.length;j=i++){ const xi=poly[i].x, yi=poly[i].y, xj=poly[j].x, yj=poly[j].y; const inter=((yi>y)!=(yj>y)) && (x < (xj - xi)*(y - yi)/(yj - yi) + xi); if(inter) inside=!inside; } return inside; }
  function ccw(ax,ay,bx,by,cx,cy){ return (cy-ay)*(bx-ax) > (by-ay)*(cx-ax); }
  function segsIntersect(x1,y1,x2,y2,x3,y3,x4,y4){ return (ccw(x1,y1,x3,y3,x4,y4)!==ccw(x2,y2,x3,y3,x4,y4)) && (ccw(x1,y1,x2,y2,x3,y3)!==ccw(x1,y1,x2,y2,x4,y4)); }
  function rectPolyIntersect(rx,ry,rw,rh,poly){ if (rx+rw < STOP_BOUNDS.minX || rx > STOP_BOUNDS.maxX || ry+rh < STOP_BOUNDS.minY || ry > STOP_BOUNDS.maxY) return false; if (pointInPoly(rx,ry,poly)||pointInPoly(rx+rw,ry,poly)||pointInPoly(rx,ry+rh,poly)||pointInPoly(rx+rw,ry+rh,poly)) return true; for (const p of poly){ if (p.x>=rx && p.x<=rx+rw && p.y>=ry && p.y<=ry+rh) return true; } const rectEdges=[[rx,ry,rx+rw,ry],[rx+rw,ry,rx+rw,ry+rh],[rx+rw,ry+rh,rx,ry+rh],[rx,ry+rh,rx,ry]]; for (let i=0;i<poly.length;i++){ const a=poly[i], b=poly[(i+1)%poly.length]; for (const e of rectEdges){ if (segsIntersect(a.x,a.y,b.x,b.y,e[0],e[1],e[2],e[3])) return true; } } return false; }
  function tileIntersectsStopSign(t){ return rectPolyIntersect(t.x,t.y,t.w,t.h,STOP_SIGN_POLY); }
  function onTileClick(tile){ if(!tileIntersectsStopSign(tile)) return; if(tile.depth<maxDepth){ clickCount++; const halfW=tile.w/2, halfH=tile.h/2; const children=[ {x:tile.x,y:tile.y,w:halfW,h:halfH,depth:tile.depth+1}, {x:tile.x+halfW,y:tile.y,w:halfW,h:halfH,depth:tile.depth+1}, {x:tile.x,y:tile.y+halfH,w:halfW,h:halfH,depth:tile.depth+1}, {x:tile.x+halfW,y:tile.y+halfH,w:halfW,h:halfH,depth:tile.depth+1} ]; tiles = tiles.filter(t=>t!==tile).concat(children); subdivisionCount++; checkCompletion(); } }

  let containerEl; let displayWidth = gridWidth; let displayHeight = gridHeight;
  function updateDimensions(){ if(!containerEl) return; const avail = containerEl.clientWidth; const newWidth = Math.min(gridWidth, avail); displayWidth = newWidth; displayHeight = Math.round(newWidth * (imgHeight / imgWidth)); }
  onMount(()=>{ updateDimensions(); const ro=new ResizeObserver(updateDimensions); ro.observe(containerEl); window.addEventListener('resize', updateDimensions); window['toggleDebug']=toggleDebug; return ()=>{ window.removeEventListener('resize', updateDimensions); ro.disconnect(); }; });
</script>

<div class="space-y-3 text-slate-200 text-xs" bind:this={containerEl}>
  <p class="text-sm font-semibold">{instruction}</p>
  <div class="text-[0.65rem] text-slate-400 flex flex-wrap gap-4 items-center">
    <span>Clicks: {clickCount}</span>
    <span>Subdivisions: {subdivisionCount}</span>
    <span>Max Depth: {maxDepth}</span>
  </div>
  <div class="relative border border-slate-700 bg-slate-800/40 overflow-hidden mx-auto"
    style="background-image: url('{imageSrc}'); background-size: cover; background-position: center; width: {displayWidth}px; height: {displayHeight}px;">
    {#if showDebug}
      <svg class="absolute inset-0 pointer-events-none" width={displayWidth} height={displayHeight} viewBox={`0 0 ${imgWidth} ${imgHeight}`}>
        <polygon points={STOP_SIGN_POLY.map(p=>`${p.x},${p.y}`).join(' ')} stroke-dasharray="6 4" stroke-width="4" class="fill-amber-500/10 stroke-amber-400/80" />
        <text x={STOP_CENTER_X} y={STOP_CENTER_Y} text-anchor="middle" dominant-baseline="middle" font-size="32" class="fill-amber-300 font-semibold">TARGET</text>
      </svg>
    {/if}
    {#each tiles as t (t.x + '-' + t.y + '-' + t.depth)}
      <div class="absolute box-border cursor-pointer border {showDebug ? (tileIntersectsStopSign(t) ? 'border-emerald-400/70' : 'border-slate-500/60') : 'border-slate-600/40'} hover:border-emerald-400/70 focus-visible:border-emerald-400/70"
        role="button" tabindex="0" aria-label="captcha tile"
        on:click={() => onTileClick(t)}
        on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && onTileClick(t)}
        style="left: {t.x * (displayWidth/imgWidth)}px; top: {t.y * (displayHeight/imgHeight)}px; width: {t.w * (displayWidth/imgWidth)}px; height: {t.h * (displayHeight/imgHeight)}px;">
        {#if showDebug}
          <span class="pointer-events-none absolute top-0 left-0 m-[1px] px-0.5 rounded bg-black/60 text-[8px] font-mono leading-tight text-emerald-200">{Math.round(t.x)},{Math.round(t.y)} d{t.depth}</span>
        {/if}
      </div>
    {/each}
    {#if completed}
      <div class="absolute inset-0 bg-slate-900/80 flex flex-col items-center justify-center gap-3 text-center px-4" role="alert" aria-live="assertive">
        <div class="text-sm font-semibold">Complete</div>
        <div class="text-[0.65rem] text-slate-400">All intersecting tiles reached depth {maxDepth}.</div>
        <div class="text-[0.6rem] text-slate-500">Clicks: {clickCount} | Sub: {subdivisionCount}</div>
        <button class="mt-2 inline-flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-[0.6rem] font-medium px-3 py-1.5" type="button" on:click={reset}>Restart</button>
      </div>
    {/if}
  </div>
  <button class="inline-flex items-center justify-center rounded bg-slate-600 hover:bg-slate-500 text-[0.65rem] font-medium px-3 py-1.5" type="button" on:click={reset}>Reset</button>
</div>
