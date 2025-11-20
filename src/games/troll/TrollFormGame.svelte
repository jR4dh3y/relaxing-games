<script lang="ts">
  import Button from "../../components/Button.svelte";
  import Card from "../../components/Card.svelte";

  let phone = 0;
  let agreed = false;
  let name = "";
  let btnX = 0;
  let btnY = 0;
  let formRef: HTMLDivElement;

  function handlePhoneInput(e: Event) {
    const input = e.target as HTMLInputElement;
    phone = parseInt(input.value);
  }

  function handleAgreeHover() {
    // Checkbox runs away or unchecks itself
    if (Math.random() > 0.5) {
      agreed = !agreed;
    }
  }

  function handleBtnHover() {
    // Button runs away
    if (!formRef) return;
    const rect = formRef.getBoundingClientRect();
    const maxX = rect.width - 100;
    const maxY = rect.height - 40;

    btnX = Math.random() * maxX;
    btnY = Math.random() * maxY;
  }

  function handleSubmit() {
    alert(
      "Error: Please verify you are not a robot by solving the captcha on the home page again."
    );
  }
</script>

<div class="flex w-full flex-col items-center gap-6">
  <div class="relative flex min-h-[240px] w-80 flex-col gap-4" bind:this={formRef}>
    <!-- Name Input -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-400">Full Name</label>
      <input
        type="text"
        bind:value={name}
        placeholder="John Doe"
        class="w-full rounded border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
    </div>

    <!-- Phone Slider -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-semibold uppercase tracking-wide text-slate-400"
        >Phone Number</label
      >
      <div class="flex items-center gap-2">
        <input
          type="range"
          min="1000000000"
          max="9999999999"
          value={phone}
          on:input={handlePhoneInput}
          class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-emerald-500"
        />
      </div>
      <div class="text-right font-mono text-xs text-emerald-400">{phone}</div>
      <p class="text-[0.6rem] text-slate-500">Please use the slider to select your phone number.</p>
    </div>

    <!-- Agree Checkbox -->
    <div class="flex items-center gap-2" on:mouseenter={handleAgreeHover}>
      <input
        type="checkbox"
        bind:checked={agreed}
        class="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500 focus:ring-emerald-500/50"
      />
      <label class="select-none text-xs text-slate-300">I agree to the Terms of Service</label>
    </div>

    <!-- Submit Button -->
    <div
      class="absolute transition-all duration-100 ease-out"
      style="transform: translate({btnX}px, {btnY}px); top: 280px;"
      on:mouseenter={handleBtnHover}
    >
      <Button on:click={handleSubmit} disabled={!agreed || name.length < 3} variant="primary"
        >Submit</Button
      >
    </div>
  </div>
</div>
