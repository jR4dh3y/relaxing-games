<script lang="ts">
  import Captcha from '../games/captcha/Captcha.svelte';
  import { navigate } from '../router';
  import PageLayout from '../components/PageLayout.svelte';
  import Button from '../components/Button.svelte';
</script>

<PageLayout>
  <header class="flex items-center gap-4 mb-4">
    <Button variant="secondary" size="sm" on:click={() => navigate('/')}>Back</Button>
    <h2 class="text-xs font-semibold tracking-wide text-slate-400 uppercase">Completely Normal CAPTCHA</h2>
  </header>
  <div class="rounded-lg border border-slate-700 bg-slate-800/50 p-3">
    <Captcha />
  </div>
</PageLayout>
