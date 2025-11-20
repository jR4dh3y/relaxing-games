<script lang="ts">
  import TyperGame from "../games/typer/TyperGame.svelte";
  import { navigate } from "../router";
  import PageLayout from "../components/PageLayout.svelte";
  import Button from "../components/Button.svelte";
</script>

<PageLayout>
  <header class="mb-4 flex items-center gap-4">
    <Button variant="secondary" size="sm" on:click={() => navigate("/")}>Back</Button>
    <h2 class="text-xs font-semibold uppercase tracking-wide text-slate-400">
      Chaos Typer
    </h2>
  </header>
  <div class="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
    <TyperGame />
  </div>
</PageLayout>
