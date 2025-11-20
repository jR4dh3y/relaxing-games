<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../components/Button.svelte";

  let score = 0;
  let targetX = 50;
  let targetY = 50;
  let gameArea: HTMLDivElement;
  let message = "Click the red pixel.";
  let won = false;

  function moveTarget() {
    if (!gameArea) return;
    const { clientWidth, clientHeight } = gameArea;
    // Keep it within bounds (assuming 4px size)
    targetX = Math.random() * (clientWidth - 10);
    targetY = Math.random() * (clientHeight - 10);
  }

  function handleClick(e: MouseEvent) {
    // Stop propagation to prevent the background click from triggering a miss
    e.stopPropagation();
    
    score++;
    if (score >= 5) {
      won = true;
      message = "You are a Pro Gamer! (Or you have a very good mouse)";
    } else {
      message = `Hit! ${score}/5`;
      moveTarget();
    }
  }

  function handleMiss() {
    if (won) return;
    score = 0;
    message = "Missed! Resetting to 0.";
    moveTarget();
  }

  function reset() {
    score = 0;
    won = false;
    message = "Click the red pixel.";
    moveTarget();
  }

  onMount(() => {
    moveTarget();
  });
</script>

<div class="flex flex-col items-center gap-4">
  <p class="text-sm text-slate-300">{message}</p>
  
  <!-- Game Area -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div 
    bind:this={gameArea}
    class="relative h-64 w-full max-w-md cursor-crosshair rounded border border-slate-700 bg-slate-900 shadow-inner"
    on:click={handleMiss}
  >
    {#if !won}
      <button
        class="absolute h-1 w-1 bg-red-500 p-0 hover:bg-red-400 focus:outline-none"
        style="left: {targetX}px; top: {targetY}px;"
        on:click={handleClick}
        aria-label="Target"
      ></button>
    {:else}
      <div class="flex h-full w-full items-center justify-center">
        <div class="text-center">
          <p class="mb-2 text-emerald-400">Victory!</p>
          <Button size="sm" on:click={reset}>Play Again</Button>
        </div>
      </div>
    {/if}
  </div>
  <p class="text-xs text-slate-500">Precision is key. Don't miss.</p>
</div>
