<script lang="ts">
  export let variant: 'play' | 'soon' | 'info' = 'info';
  const variants = {
    play: 'bg-emerald-500/20 text-emerald-300 border-emerald-600/50',
    soon: 'bg-slate-700 text-slate-400 border-slate-600',
    info: 'bg-slate-600/40 text-slate-300 border-slate-500/60'
  };
</script>
<span class={`inline-block px-2 py-0.5 rounded text-[0.55rem] font-medium tracking-wide border ${variants[variant]}`}> <slot /> </span>
