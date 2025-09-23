<script lang="ts">
  export let width = 'max-w-4xl';
  export let padding = 'px-4';
  export let top = 'py-6';
  export let center = false;
</script>
<div class={`${width} mx-auto ${padding} ${top} ${center ? 'text-center':''}`}>
  <slot />
</div>
