<script lang="ts">
  export let interactive = false; // if true, show hover styles
  export let padded = true;
  export let bleed = false; // remove padding
  export let as: string = "div";
  export let disabled = false;
  export let title: string | undefined = undefined;
  const base =
    "flex flex-col rounded-lg border border-slate-700 bg-slate-800/50 text-slate-100 h-full";
  const hover =
    "transition-colors " +
    (interactive ? "hover:border-emerald-500/60 hover:bg-slate-800/70 cursor-pointer" : "");
  $: padding = bleed ? "" : padded ? "p-4" : "";
</script>

<svelte:element
  this={as}
  class={`${base} ${hover} ${padding} ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
  aria-disabled={disabled}
>
  {#if title}<h2 class="mb-1 text-sm font-semibold">{title}</h2>{/if}
  <slot />
</svelte:element>
