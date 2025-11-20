<script lang="ts">
  import { navigate } from "../router";
  import PageLayout from "../components/PageLayout.svelte";
  import SectionHeader from "../components/SectionHeader.svelte";
  import Card from "../components/Card.svelte";
  import Button from "../components/Button.svelte";

  interface GameCard {
    title: string;
    desc: string;
    path?: string;
    status: "play" | "soon";
  }
  const games: GameCard[] = [
    {
      title: "Completely Normal CAPTCHA",
      desc: "Just a regular verification. Definitely not rage inducing.",
      path: "/captcha",
      status: "play",
    },
    {
      title: "Mosquito Hunt",
      desc: "Move your cursor over the erratic mosquito to well, kill it.",
      path: "/mosquito",
      status: "play",
    },
    {
      title: "Perfect Click Precision",
      desc: 'Hit the exact pixel 5 times in a row to prove your a "Pro Gamer".',
      path: "/precision",
      status: "play",
    },
    {
      title: "Chaos Typer",
      desc: "Type a simple sentence. Should be easy, right?",
      path: "/typer",
      status: "play",
    },
  ];
</script>

<div class="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
  <SectionHeader
    title="Calm and Relaxing Games"
    subtitle="Prove you're human (or at least stubborn). More mini‑games coming soon."
    align="center"
  />
  <div class="grid justify-center gap-4 sm:grid-cols-2 md:grid-cols-3">
    {#each games as g}
      <div class="w-60">
        <Card disabled={g.status === "soon"}>
          <h2 class="mb-1 text-sm font-semibold">{g.title}</h2>
          <p class="mb-2 text-[0.65rem] leading-snug text-slate-400">{g.desc}</p>
          <Button
            full
            variant={g.status === "play" ? "primary" : "secondary"}
            size="sm"
            disabled={g.status !== "play"}
            on:click={() => g.path && navigate(g.path)}
          >
            {g.status === "play" ? "Play" : "Soon"}
          </Button>
        </Card>
      </div>
    {/each}
  </div>
</div>

<!-- Author signature -->
<a
  href="https://radhey.dev"
  target="_blank"
  rel="noopener noreferrer"
  class="fixed bottom-3 right-3 select-none rounded px-1 font-[Poppins] text-xs font-semibold tracking-wide text-emerald-300 transition-colors [text-shadow:0_0_6px_rgba(16,185,129,0.7),0_0_10px_rgba(16,185,129,0.4)] hover:text-emerald-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/70 md:text-sm"
  aria-label="Visit radhey.dev"
>
  radhey.dev
</a>
