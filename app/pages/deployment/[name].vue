<template>
  <UContainer>
    <p v-if="status === 'pending'">Loading deployment...</p>
    <p v-else-if="status === 'error'">Error loading deployments: {{ error }}</p>
    <div v-else-if="status === 'success'">
      <UPageHeader :title="deployment.name" :ui="{ root: 'border-b-0' }">
        <template #headline>
          <UBadge
            :color="deployment.status === 'Ready' ? 'success' : 'error'"
            :label="deployment.status"
          />
        </template>
        <template #description>
          <div class="flex gap-1 items-center">
            <p>First deployed</p>
            <UIcon name="ph:dot-duotone" />
            <p>
              {{
                new Date(deployment.created_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            </p>
          </div>
          <div class="flex gap-1 items-center">
            <p>Last deployed</p>
            <UIcon name="ph:dot-duotone" />
            <p>
              {{
                new Date(deployment.updated_time).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              }}
            </p>
          </div>
        </template>
      </UPageHeader>
      <UPageFeature
        title="URL"
        :description="deployment.url"
        icon="ph:share-duotone"
        :to="deployment.url"
        target="_blank"
      />
      <UPageFeature
        title="Container Image"
        :description="deployment.image"
        icon="ph:cube-duotone"
        class="mt-5 mb-10"
      />

      <client-only>
        <div class="flex gap-8">
          <UPageCard variant="subtle" class="flex-1">
            <LineChart
              :data="requestsData"
              :categories="requestsCategories"
              :height="300"
              :xFormatter="requestsXFormatter"
              yLabel="Requests"
            />
          </UPageCard>
          <UPageCard variant="subtle" class="flex-1">
            <LineChart
              :data="cpuData"
              :categories="cpuCategories"
              :height="300"
              :xFormatter="cpuXFormatter"
              yLabel="CPU Usage"
            />
          </UPageCard>
        </div>
      </client-only>
    </div>
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const {
  data: deployment,
  status,
  error,
} = await useLazyFetch<any>(`/api/deployments/${useRoute().params.name}`, {
  method: "GET",
  credentials: "include",
});

import { LineChart } from "vue-chrts";

const requestsCategories = {
  requests: {
    name: "Requests",
    color: "#3b82f6",
  },
};

const cpuCategories = {
  cpu: {
    name: "CPU Usage",
    color: "#f97316",
  },
};

const requestsData = computed(() => {
  if (!deployment.value?.metrics?.requests_per_hour) {
    return [];
  }

  return deployment.value.metrics.requests_per_hour.map(
    (value: number, index: number) => ({
      requests: value,
      x: index,
    })
  );
});

const requestsXFormatter = (i: number) => {
  const totalHours = requestsData.value.length - 1;
  return `${totalHours - requestsData.value[i].x} hours ago`;
};

const cpuData = computed(() => {
  if (!deployment.value?.metrics?.cpu_per_hour) {
    return [];
  }

  return deployment.value.metrics.cpu_per_hour.map(
    (value: number, index: number) => ({
      requests: value,
      x: index,
    })
  );
});

const cpuXFormatter = (i: number) => {
  const totalHours = cpuData.value.length - 1;
  return `${totalHours - cpuData.value[i].x} hours ago`;
};
</script>

<style scoped></style>
