<template>
  <UContainer>
    <UTabs
      color="neutral"
      :content="false"
      :items="items"
      default-value=""
      @update:model-value="handleTabChange"
    />

    <NuxtPage />
  </UContainer>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

definePageMeta({
  layout: "dashboard",
});

const items = ref<TabsItem[]>([
  {
    label: "Overview",
    icon: "carbon:dashboard",
    value: "",
  },
  {
    label: "Deployments",
    icon: "pajamas:deployments",
    value: "deployments",
  },
  {
    label: "Billing",
    icon: "bi:credit-card-2-front",
    value: "billing",
  },
]);

const handleTabChange = async (tab: string | number) => {
  await navigateTo(`/dashboard/${tab}`);
};
</script>
