<script>
  import { onMount, onDestroy } from "svelte";
  import { generateRandomWalk } from "./lib/randomWalk";
  import { Mosquito } from "./lib/mosquito";
  import { BloodSplash } from "./lib/bloodSplash";
  import {
    drawBackground,
    // drawTrail,
    drawBloodSplash,
    drawRacket,
    drawMosquitoEntity,
  } from "./lib/draw";

  const WIDTH = 800;
  const HEIGHT = 600;
  let canvasEl;
  let ctx;
  let running = true;
  let mosquito;
  let bloodSplashes = [];
  let frameHandle = null;
  let generatedPath = [];
  let frames = 0;
  let killed = false;
  let startTime = 0;
  let killTime = 0;
  let speedMultiplier = 1;
  let nearMissCount = 0;
  let hitboxScale = 1;
  let screenShakeFrames = 0;
  let flickerFrames = 0;
  let currentMessage = "";
  let lastMessageTime = 0;
  
  // Extra difficulty tuning
  const REQUIRED_HIT_FRAMES = 0.5; // must keep cursor on target this many consecutive frames
  let hitStreak = 0;
  const TAUNT_NEAR_MISS = ["So close!","Missed!","Too slow!","Whiff!","You blinked!","Almost.","Try harder.","Haha!",];
  const TAUNT_TIME = ["Getting tired?", "Still alive...", "Give up?"];
  const KILL_MESSAGES = ["Got it!", "Direct hit!", "You win!"];
  function showMessage(msg) {
    currentMessage = msg;
    lastMessageTime = performance.now();
  }
  let cursor = { x: WIDTH / 2, y: HEIGHT / 2 };

  function gameLoop() {
    if (!running) return;
    frames++;
    drawBackground(ctx, WIDTH, HEIGHT);
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    
    // Shrink hitbox faster & further
    if (!killed) hitboxScale = Math.max(0.25, 1 - elapsed / 25);
    
    // Periodic taunts
    if (!killed && elapsed > 5 && Math.floor(elapsed) % 10 === 0 && now - lastMessageTime > 1800)
      showMessage(TAUNT_TIME[Math.floor(Math.random() * TAUNT_TIME.length)]);
    
      // Speed ramp harder
    speedMultiplier = Math.min(14, 1 + Math.floor(elapsed / 4) + Math.min(nearMissCount, 8));
    
    // Flicker more over time
    const flickerProb = elapsed > 8 ? 0.03 : 0.015;
    if (!killed && flickerFrames <= 0 && elapsed > 3 && Math.random() < flickerProb)
      flickerFrames = (elapsed > 8 ? 30 : 15) + Math.floor(Math.random() * (elapsed > 8 ? 20 : 15));
    if (flickerFrames > 0) flickerFrames--;
    
    // Advance along path
    for(let s=0;s<speedMultiplier;s++){ 
      mosquito.advance(); 
    }
    
    // Occasional warp (evasive)
    if (!killed && elapsed > 10 && Math.random() < 0.01) {
      mosquito.idx =
        (mosquito.idx + 80 + Math.floor(Math.random() * 70)) % (mosquito.path.length - 1);
    }
    
    // Hit detection with sustained requirement
    if (!killed) {
      const { x, y } = mosquito.currentPos();
      const a = 10 * hitboxScale;
      const b = 5 * hitboxScale;
      const rHead = 6 * hitboxScale;
      const dx_b = cursor.x - x;
      const dy_b = cursor.y - y;
      const insideBody = (dx_b * dx_b) / (a * a) + (dy_b * dy_b) / (b * b) <= 1;
      const dx_h = cursor.x - (x + 12 * hitboxScale);
      const dy_h = cursor.y - y;
      const insideHead = dx_h * dx_h + dy_h * dy_h <= rHead * rHead;
      const inside = insideBody || insideHead;
      if (inside) {
        hitStreak++;
      } else {
        hitStreak = 0;
      }
      if (hitStreak >= REQUIRED_HIT_FRAMES) {
        if (mosquito.checkHit(cursor, hitboxScale)) {
          /* sets dead */
        }
      }
      const dist = Math.hypot(cursor.x - x, cursor.y - y);
      const nearThreshold = 30 + speedMultiplier * 2;
      if (!mosquito.dead && !inside && dist < nearThreshold) {
        if (now - lastMessageTime > 400) {
          nearMissCount++;
          showMessage(TAUNT_NEAR_MISS[Math.floor(Math.random() * TAUNT_NEAR_MISS.length)]);
          screenShakeFrames = 8;
          // Bigger dodge jump
          mosquito.idx =
            (mosquito.idx + 40 + Math.floor(Math.random() * 40)) % (mosquito.path.length - 1);
        }
      }
    }
    const justDied = !killed && mosquito.dead;
    if (justDied && mosquito.dead_pos) {
      bloodSplashes.push(new BloodSplash(mosquito.dead_pos));
      killed = true;
      killTime = performance.now();
      showMessage(KILL_MESSAGES[Math.floor(Math.random() * KILL_MESSAGES.length)]);
    }
    if (screenShakeFrames > 0) {
      ctx.save();
      ctx.translate(Math.random() * 8 - 4, Math.random() * 8 - 4);
      screenShakeFrames--;
      // drawTrail(ctx, mosquito.trail);
      if (!(flickerFrames > 0 && flickerFrames % 4 < 2)) drawMosquitoEntity(ctx, mosquito);
      ctx.restore();
    } else {
      // drawTrail(ctx, mosquito.trail);
      if (!(flickerFrames > 0 && flickerFrames % 4 < 2)) drawMosquitoEntity(ctx, mosquito);
    }
    for (let i = bloodSplashes.length - 1; i >= 0; i--) {
      const b = bloodSplashes[i];
      drawBloodSplash(ctx, b);
      b.update();
      if (!b.alive) bloodSplashes.splice(i, 1);
    }
    drawRacket(ctx, cursor.x, cursor.y);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.font = "10px monospace";
    ctx.textBaseline = "top";
    const elapsedDisplay = ((now - startTime) / 1000).toFixed(1);
    const killElapsed = killed ? ((killTime - startTime) / 1000).toFixed(2) : "--";
    const lines = [
      `frames: ${frames}`,
      `t: ${elapsedDisplay}s`,
      `spd: x${speedMultiplier}`,
      `miss: ${nearMissCount}`,
      `hitbox: ${(hitboxScale * 100).toFixed(0)}%`,
      `streak: ${hitStreak}/${REQUIRED_HIT_FRAMES}`,
      `killed: ${killed}`,
      `kill@ ${killElapsed}s`,
    ];
    lines.forEach((l, i) => ctx.fillText(l, 6, 6 + i * 12));
    if (currentMessage && (killed || now - lastMessageTime < 1500)) {
      ctx.font = `bold ${killed ? 40 : 26}px sans-serif`;
      ctx.fillStyle = killed ? "rgba(16,185,129,0.92)" : "rgba(220,30,30,0.85)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(currentMessage, WIDTH / 2, 60);
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      ctx.font = "10px monospace";
    }
    frameHandle = requestAnimationFrame(gameLoop);
  }
  function startGame() {
    generatedPath = generateRandomWalk();
    mosquito = new Mosquito(generatedPath, 10, { x: WIDTH / 2, y: HEIGHT / 2 });
    bloodSplashes = [];
    frames = 0;
    killed = false;
    startTime = performance.now();
    killTime = 0;
    running = true;
    speedMultiplier = 1;
    nearMissCount = 0;
    hitboxScale = 1;
    screenShakeFrames = 0;
    flickerFrames = 0;
    currentMessage = "";
    if (frameHandle) cancelAnimationFrame(frameHandle);
    frameHandle = requestAnimationFrame(gameLoop);
  }
  function stopGame() {
    running = false;
    if (frameHandle) cancelAnimationFrame(frameHandle);
  }
  function restart() {
    stopGame();
    startGame();
  }
  function handleMouseMove(e) {
    const rect = canvasEl.getBoundingClientRect();
    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
  }
  onMount(() => {
    ctx = canvasEl.getContext("2d");
    canvasEl.addEventListener("mousemove", handleMouseMove);
    startGame();
  });
  onDestroy(() => {
    stopGame();
    canvasEl && canvasEl.removeEventListener("mousemove", handleMouseMove);
  });
</script>

<div class="space-y-3 text-xs text-slate-200">
  <div class="flex items-center gap-3">
    <button
      class="rounded bg-slate-600 px-3 py-1.5 text-[0.65rem] font-medium hover:bg-slate-500"
      on:click={restart}>Restart</button>
    {#if killed}
      <span class="text-[0.6rem] text-emerald-400">Mosquito Eliminated</span>
    {:else}
      <span class="text-[0.6rem] text-slate-400">Move cursor over mosquito to kill it</span>
    {/if}
  </div>
  <div class="relative mx-auto rounded border border-slate-700 bg-white p-2 shadow-md">
    <canvas bind:this={canvasEl} width={WIDTH} height={HEIGHT} class="block" style="display:block"></canvas>
  </div>
  <p class="mx-auto max-w-sm text-[0.55rem] leading-snug text-slate-500">
    Originally this was a Pygame 
    <a
      href="https://github.com/jR4dh3y/insects"
      target="_blank"
      rel="noopener noreferrer"
      class="text-sky-500 underline hover:text-sky-400">prototype
    </a>, then ported by gpt-5 into this. Why I had made the original was a long story.
  </p>
</div>
