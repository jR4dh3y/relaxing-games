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

<div class="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4">
  <SectionHeader title="Calm and Relaxing Games" subtitle="Prove you're human (or at least stubborn). More mini‑games coming soon." align="center" />
  <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 justify-center">
    {#each games as g}
      <div class="w-60">
        <Card disabled={g.status==='soon'}>
          <h2 class="text-sm font-semibold mb-1">{g.title}</h2>
          <p class="text-[0.65rem] leading-snug text-slate-400 mb-2">{g.desc}</p>
          <Button full variant={g.status==='play' ? 'primary' : 'secondary'} size="sm" disabled={g.status!=='play'} on:click={() => g.path && navigate(g.path)}>
            {g.status === 'play' ? 'Play' : 'Soon'}
          </Button>
        </Card>
      </div>
    {/each}
  </div>
</div>
