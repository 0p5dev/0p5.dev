<template>
  <div
    class="w-screen h-screen bg-[url(/images/landing-page-bg.jpg)] bg-center bg-cover overflow-hidden relative grid place-content-center gap-5"
  >
    <h1 class="text-white text-7xl text-center font-[Chakra_Petch]">0p5.dev</h1>
    <p class="text-white text-4xl text-center leading-12">
      The deployment platform
      <br />
      <span class="text-primary">for developers </span>
      <span class="text-secondary">by developers</span>
    </p>
    <div class="flex justify-center gap-5 mt-5 mb-8">
      <UButton color="primary" size="xl" to="/docs">Documentation</UButton>
      <UButton color="secondary" size="xl" to="/login">Login</UButton>
    </div>
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
        curl -LO
        https://github.com/Digizyne/cli/releases/latest/download/lf-amd64.deb
        <br />
        sudo apt install ./lf-amd64.deb &amp;&amp; rm ./lf-amd64.deb
      </code>
    </UCard>
  </div>
</template>

<script setup lang="ts">
const textCopied = ref<boolean>(false);
function copyCommandsToClipboard() {
  const commands = `
        curl -LO https://github.com/Digizyne/cli/releases/latest/download/lf-amd64.deb
        sudo apt install ./lf-amd64.deb && rm ./lf-amd64.deb
        `;
  navigator.clipboard.writeText(commands);
  textCopied.value = true;
  setTimeout(() => {
    textCopied.value = false;
  }, 2000);
}
</script>

<style scoped></style>
