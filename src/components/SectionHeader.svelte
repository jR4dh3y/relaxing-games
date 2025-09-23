<script lang="ts">
  export let title: string;
  export let subtitle: string | undefined;
  export let align: 'left' | 'center' = 'left';
</script>
<div class={`mb-6 ${align==='center' ? 'text-center':''}`}>
  <h1 class="text-3xl font-bold mb-2 text-slate-100">{title}</h1>
  {#if subtitle}<p class="text-sm text-slate-400 max-w-xl {align==='center' ? 'mx-auto':''}">{subtitle}</p>{/if}
</div>
