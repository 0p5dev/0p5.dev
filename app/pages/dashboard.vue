<template>
  <UContainer>
    <div
      class="w-screen h-screen overflow-hidden grid place-content-center"
      v-if="status === 'pending'"
    >
      <UIcon name="svg-spinners:3-dots-bounce" />
    </div>
    <p v-else-if="status === 'error'">Error loading deployments: {{ error }}</p>
    <div v-else-if="status === 'success'">
      <UPageHeader title="Your Deployments" :ui="{ root: 'border-b-0' }" />
      <UPageGrid>
        <UPageCard
          v-for="deployment in data.deployments"
          :key="deployment.id"
          :title="deployment.name"
          :to="`/deployment/${deployment.name}`"
        >
          <template #description>
            <a
              :href="deployment.url"
              target="_blank"
              class="relative z-10 hover:underline"
              >{{ deployment.url }}</a
            >
          </template>
        </UPageCard>
      </UPageGrid>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const { data, status, error } = await useLazyFetch<any>("/api/deployments", {
  method: "GET",
  credentials: "include",
});
</script>

<style scoped></style>
