<script lang="ts">
  export let variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';
  export let size: 'xs' | 'sm' | 'md' = 'sm';
  export let disabled = false;
  export let type: 'button' | 'submit' | 'reset' = 'button';
  export let full = false;
  export let ariaLabel: string | undefined = undefined;
  const base = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/70 disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = { xs: 'text-[0.55rem] px-2 py-1', sm: 'text-[0.65rem] px-3 py-1.5', md: 'text-sm px-4 py-2' };
  const variants = {
    primary: 'bg-slate-600 hover:bg-slate-500 text-slate-100',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100',
    danger: 'bg-red-600 hover:bg-red-500 text-white',
    ghost: 'bg-transparent hover:bg-slate-800/40 text-slate-300'
  };
  $: classes = [base, sizes[size], variants[variant], full ? 'w-full' : ''].join(' ');
</script>
<button {type} class={classes} {disabled} aria-label={ariaLabel} on:click>
  <slot />
</button>
