<script lang="ts">
  export let interactive = false; // if true, show hover styles
  export let padded = true;
  export let bleed = false; // remove padding
  export let as: string = 'div';
  export let disabled = false;
  export let title: string | undefined = undefined;
  const base = 'flex flex-col rounded-lg border border-slate-700 bg-slate-800/50 text-slate-100';
  const hover = 'transition-colors ' + (interactive ? 'hover:border-emerald-500/60 hover:bg-slate-800/70 cursor-pointer' : '');
  $: padding = bleed ? '' : (padded ? 'p-4' : '');
</script>
<svelte:element this={as} class={`${base} ${hover} ${padding} ${disabled ? 'opacity-60 cursor-not-allowed':''}`} aria-disabled={disabled}>
  {#if title}<h2 class="text-sm font-semibold mb-1">{title}</h2>{/if}
  <slot />
</svelte:element>
