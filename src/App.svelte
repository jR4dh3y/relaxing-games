<script lang="ts">
  import { routerState, startRouter } from './router';
  import type { RouteDef } from './router';
  import { onMount } from 'svelte';

  let route: RouteDef = routerState.route;
  function handleChange(){
    route = routerState.route;
    document.title = route.title ? `${route.title} • Normal Challenges` : 'Normal Challenges';
  }
  onMount(()=>{
    startRouter(handleChange);
    handleChange();
  });
</script>

<svelte:component this={route.component} />