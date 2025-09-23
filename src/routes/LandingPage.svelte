<script lang="ts">
  import { navigate } from '../router';
  import PageLayout from '../components/PageLayout.svelte';
  import SectionHeader from '../components/SectionHeader.svelte';
  import Card from '../components/Card.svelte';
  import Button from '../components/Button.svelte';

  interface GameCard { title: string; desc: string; path?: string; status: 'play' | 'soon'; }
  const games: GameCard[] = [
    { title: 'Completely Normal CAPTCHA', desc: 'Just a regular verification. Definitely not rage inducing.', path: '/captcha', status: 'play' },
    { title: 'Mosquito Hunt', desc: 'Move your cursor over the erratic mosquito to well, kill it.', path: '/mosquito', status: 'play' },
    { title: 'Perfect Click Precision', desc: 'Hit the exact pixel 5 times in a row to prove your a "Pro Gamer".', status: 'soon' }
  ];
</script>

<PageLayout top="py-10">
  <SectionHeader title="Calm and Relaxing Games" subtitle="Prove you're human (or at least stubborn). More mini‑games coming soon." />
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
    {#each games as g}
      <Card disabled={g.status==='soon'}>
        <h2 class="text-sm font-semibold mb-1">{g.title}</h2>
        <p class="text-[0.65rem] leading-snug text-slate-400 mb-2">{g.desc}</p>
        <Button full variant={g.status==='play' ? 'primary' : 'secondary'} size="sm" disabled={g.status!=='play'} on:click={() => g.path && navigate(g.path)}>
          {g.status === 'play' ? 'Play' : 'Soon'}
        </Button>
      </Card>
    {/each}
  </div>
</PageLayout>
