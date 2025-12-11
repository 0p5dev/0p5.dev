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
            v-if="status !== 'error'"
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
      <div v-if="status === 'pending'">
        <USkeleton class="h-5 w-full mb-4" />
        <USkeleton class="h-5 w-full" />
      </div>
      <code v-else-if="status === 'success' && release" class="leading-8">
        curl -LO
        {{ release.assets[0].browser_download_url }}
        <br />
        tar -xzf ops_linux_amd64.tgz && sudo mv ./ops_linux_amd64
        /usr/local/bin/ops
      </code>
      <UAlert
        v-else-if="status === 'error'"
        color="error"
        variant="subtle"
        title="Error fetching latest release"
        :description="error?.message || 'Refresh the page to try again.'"
        icon="ph:link-break-bold"
      />
    </UCard>
  </div>
</template>

<script setup lang="ts">
const {
  data: release,
  status,
  error,
} = await useLazyFetch<any>(
  "https://api.github.com/repos/0p5dev/ops/releases/latest",
  {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      Authorization: `Bearer ${useRuntimeConfig().public.githubApiToken}`,
    },
  }
);

const textCopied = ref<boolean>(false);
function copyCommandsToClipboard() {
  const commands = `curl -LO ${release.value.assets[0].browser_download_url}
tar -xzf ops_linux_amd64.tgz && sudo mv ./ops_linux_amd64 /usr/local/bin/ops`;
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
