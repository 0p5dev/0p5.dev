<template>
  <div
    class="w-screen h-screen bg-[url(/images/landing-page-bg.jpg)] bg-center bg-cover overflow-hidden relative flex flex-col gap-10 justify-center items-center"
  >
    <h1 class="text-white text-7xl text-center font-[Chakra_Petch] -mb-3">
      0p5.dev
    </h1>
    <p class="text-white text-4xl text-center leading-12">
      The deployment platform
      <br />
      <span class="text-primary">for developers </span>
      <span class="text-secondary">by developers</span>
    </p>

    <div class="flex justify-center gap-5">
      <UButton color="primary" size="xl" to="/docs">Documentation</UButton>
      <UButton color="secondary" size="xl" to="/login">Login</UButton>
    </div>
    <UCarousel
      v-slot="{ item, index }"
      :items="features"
      class="w-full mx-auto max-w-sm"
      :autoplay="{ delay: 3500 }"
      arrows
    >
      <UCard class="w-sm">
        <UAvatar
          :icon="item.icon"
          size="3xl"
          :ui="{ icon: index % 2 === 0 ? 'text-primary' : 'text-secondary' }"
        />
        <h3 class="text-xl font-semibold mt-4">{{ item.title }}</h3>
      </UCard>
    </UCarousel>
    <UCard>
      <template #header>
        <div class="flex justify-between items-center">
          <p class="font-semibold">CLI Quick Start</p>
          <UButton
            :icon="
              textCopied ? 'ph:check-square-offset-duotone' : 'ph:copy-duotone'
            "
            variant="ghost"
            color="neutral"
            size="xl"
            @click="copyCommandsToClipboard"
          />
        </div>
      </template>
      <code class="leading-8">
        curl -LO https://github.com/0p5dev/ops/releases/download/v0.1.1/ops
        <br />
        chmod +x ./ops &amp;&amp; sudo mv ./ops /usr/local/bin/ops
      </code>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const textCopied = ref<boolean>(false);
function copyCommandsToClipboard() {
  const commands = `
        curl -LO https://github.com/0p5dev/ops/releases/download/v0.1.1/ops
        chmod +x ./ops && sudo mv ./ops /usr/local/bin/ops
        `;
  navigator.clipboard.writeText(commands);
  textCopied.value = true;
  setTimeout(() => {
    textCopied.value = false;
  }, 2000);
}

const features = [
  {
    title: "Scale to zero automatically",
    icon: "ph:arrows-out-duotone",
  },
  {
    title: "Deploy with 1 command",
    icon: "ph:rocket-launch-duotone",
  },
  {
    title: "No additional configuration",
    icon: "ph:book-open-text-duotone",
  },
  {
    title: "High availability by default",
    icon: "ph:shield-check-duotone",
  },
];
</script>
