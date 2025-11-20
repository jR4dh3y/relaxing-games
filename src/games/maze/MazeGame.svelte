<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Button from "../../components/Button.svelte";
  import Card from "../../components/Card.svelte";

  let container: HTMLDivElement;
  let cursorX = 50;
  let cursorY = 50;
  let mouseX = 50;
  let mouseY = 50;
  let gameOver = false;
  let won = false;
  let started = false;
  let animationFrame: number;

  // Maze definition (simple SVG path for now)
  // Start at top left, end at bottom right
  const mazePath = "M 50 50 L 250 50 L 250 150 L 100 150 L 100 250 L 300 250";

  function handleMouseMove(e: MouseEvent) {
    if (!container || gameOver || won) return;
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    if (!started && mouseX < 80 && mouseY < 80) {
      started = true;
      loop();
    }
  }

  function loop() {
    if (gameOver || won) return;

    // Lag logic: cursor follows mouse with delay
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    cursorX += dx * 0.1; // Very laggy
    cursorY += dy * 0.1;

    // Collision detection
    // Simple check: is cursor outside the "safe" path?
    // For this demo, let's just use simple rects for the maze walls instead of complex path collision
    // Safe zones:
    // 1. Top horiz: x: 40-260, y: 40-60
    // 2. Right vert: x: 240-260, y: 40-160
    // 3. Mid horiz: x: 90-260, y: 140-160
    // 4. Left vert: x: 90-110, y: 140-260
    // 5. Bot horiz: x: 90-310, y: 240-260

    const safe =
      (cursorX > 40 && cursorX < 260 && cursorY > 40 && cursorY < 60) ||
      (cursorX > 240 && cursorX < 260 && cursorY > 40 && cursorY < 160) ||
      (cursorX > 90 && cursorX < 260 && cursorY > 140 && cursorY < 160) ||
      (cursorX > 90 && cursorX < 110 && cursorY > 140 && cursorY < 260) ||
      (cursorX > 90 && cursorX < 310 && cursorY > 240 && cursorY < 260);

    if (started && !safe) {
      // Check if at start (grace period)
      if (!(cursorX < 60 && cursorY < 60)) {
        fail();
      }
    }

    // Win condition
    if (cursorX > 290 && cursorY > 240 && cursorY < 260) {
      won = true;
    }

    animationFrame = requestAnimationFrame(loop);
  }

  function fail() {
    gameOver = true;
    cancelAnimationFrame(animationFrame);
  }

  function reset() {
    gameOver = false;
    won = false;
    started = false;
    cursorX = 50;
    cursorY = 50;
    mouseX = 50;
    mouseY = 50;
  }

  onDestroy(() => {
    cancelAnimationFrame(animationFrame);
  });
</script>

<div class="flex w-full flex-col items-center gap-6">
  <div class="flex flex-col items-center gap-4">
    <p class="mb-2 text-center text-sm text-slate-400">
      Guide the <span class="font-bold text-emerald-400">dot</span> to the end.
      <br />Beware of <span class="text-red-400">lag</span>.
    </p>

    <div
      class="relative h-[300px] w-[350px] cursor-none overflow-hidden rounded-lg border border-slate-700 bg-slate-950 shadow-inner"
      bind:this={container}
      on:mousemove={handleMouseMove}
      on:mouseleave={fail}
    >
      <!-- Maze Walls (Visual) -->
      <!-- We draw the SAFE path in lighter color, background is "lava" -->
      <div class="pattern-grid-lg absolute inset-0 bg-red-900/10"></div>

      <!-- Safe Zones -->
      <div
        class="absolute border border-slate-700/50 bg-slate-800/80"
        style="left: 40px; top: 40px; width: 220px; height: 20px;"
      ></div>
      <div
        class="absolute border border-slate-700/50 bg-slate-800/80"
        style="left: 240px; top: 40px; width: 20px; height: 120px;"
      ></div>
      <div
        class="absolute border border-slate-700/50 bg-slate-800/80"
        style="left: 90px; top: 140px; width: 170px; height: 20px;"
      ></div>
      <div
        class="absolute border border-slate-700/50 bg-slate-800/80"
        style="left: 90px; top: 140px; width: 20px; height: 120px;"
      ></div>
      <div
        class="absolute border border-slate-700/50 bg-slate-800/80"
        style="left: 90px; top: 240px; width: 220px; height: 20px;"
      ></div>

      <!-- Start & End -->
      <div
        class="absolute flex items-center justify-center rounded bg-emerald-500/10 text-[10px] font-bold tracking-wider text-emerald-500"
        style="left: 40px; top: 40px; width: 40px; height: 20px;"
      >
        START
      </div>
      <div
        class="absolute flex items-center justify-center rounded bg-emerald-500/10 text-[10px] font-bold tracking-wider text-emerald-500"
        style="left: 270px; top: 240px; width: 40px; height: 20px;"
      >
        END
      </div>

      <!-- Cursor -->
      <div
        class="pointer-events-none absolute z-10 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
        style="transform: translate({cursorX - 6}px, {cursorY - 6}px);"
      ></div>

      {#if gameOver}
        <div
          class="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
        >
          <div class="text-center">
            <h3 class="mb-2 text-xl font-bold tracking-wide text-red-500">FAILED</h3>
            <Button on:click={reset} variant="danger">Try Again</Button>
          </div>
        </div>
      {/if}

      {#if won}
        <div
          class="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm"
        >
          <div class="text-center">
            <h3 class="mb-2 text-xl font-bold tracking-wide text-emerald-500">VICTORY</h3>
            <p class="mb-4 text-xs text-slate-400">You have steady hands.</p>
            <Button on:click={reset} variant="primary">Replay</Button>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
