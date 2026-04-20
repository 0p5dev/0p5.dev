<template>
  <UContainer>
    <UTabs
      color="neutral"
      :content="false"
      :items="items"
      variant="link"
      size="xl"
      v-model="activeTab"
      :ui="{ trigger: 'grow' }"
    />

    <NuxtPage />
  </UContainer>
</template>

<script setup lang="ts">
import type { TabsItem } from "@nuxt/ui";

const route = useRoute();

definePageMeta({
  layout: "dashboard",
});

const items = ref<TabsItem[]>([
  {
    label: "Dashboard",
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

const activeTab = computed<string>({
  get() {
    return ((route.path.split("/")[2] || "") as string) || "";
  },
  set(value: string) {
    navigateTo(`/dashboard/${value}`);
  },
});
</script>
