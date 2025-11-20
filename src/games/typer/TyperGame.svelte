<script lang="ts">
  import { onMount } from "svelte";
  import Button from "../../components/Button.svelte";

  const targetText = "The quick brown fox jumps over the lazy dog";
  let inputText = "";
  let keyMap: Record<string, string> = {};
  let won = false;
  let startTime: number | null = null;
  let timeTaken = 0;

  function generateKeyMap() {
    const chars = "abcdefghijklmnopqrstuvwxyz".split("");
    const shuffled = [...chars].sort(() => Math.random() - 0.5);
    const map: Record<string, string> = {};
    chars.forEach((c, i) => {
      map[c] = shuffled[i];
      map[c.toUpperCase()] = shuffled[i].toUpperCase();
    });
    return map;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (won) return;
    
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (!startTime) startTime = Date.now();

      const char = e.key;
      const mapped = keyMap[char] || char; // Map letters, keep others (spaces, punctuation)
      
      inputText += mapped;
      
      checkWin();
    } else if (e.key === "Backspace") {
      e.preventDefault();
      inputText = inputText.slice(0, -1);
    }
  }

  function checkWin() {
    if (inputText === targetText) {
      won = true;
      if (startTime) {
        timeTaken = (Date.now() - startTime) / 1000;
      }
    }
  }

  function reset() {
    inputText = "";
    won = false;
    startTime = null;
    keyMap = generateKeyMap();
  }

  onMount(() => {
    keyMap = generateKeyMap();
  });
</script>

<div class="flex flex-col items-center gap-6">
  <div class="text-center">
    <p class="mb-2 text-sm text-slate-400">Type the following sentence exactly:</p>
    <p class="select-none rounded bg-slate-800 p-3 font-mono text-lg font-bold text-emerald-400 tracking-wide">
      {targetText}
    </p>
  </div>

  <div class="w-full max-w-xl">
    <div 
      class="min-h-[3rem] w-full rounded border border-slate-600 bg-slate-900 p-3 font-mono text-lg text-white focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500"
      tabindex="0"
      on:keydown={handleKeydown}
      role="textbox"
      aria-label="Typing area"
    >
      {inputText}<span class="animate-pulse border-l-2 border-emerald-500 ml-0.5 h-5 inline-block align-middle"></span>
    </div>
    <p class="mt-2 text-xs text-slate-500">
      Note: Your keyboard might feel a bit... broken.
    </p>
  </div>

  {#if won}
    <div class="text-center animate-bounce">
      <p class="mb-2 text-xl font-bold text-emerald-400">Completed in {timeTaken.toFixed(2)}s!</p>
      <Button on:click={reset}>Try Again (New Layout)</Button>
    </div>
  {:else}
    <Button variant="secondary" size="sm" on:click={reset}>Reset Layout</Button>
  {/if}
</div>
