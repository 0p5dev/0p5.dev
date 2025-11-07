<template>
  <UContainer>
    <div
      class="w-full h-[85vh] overflow-hidden gap-5 grid place-content-center text-center"
      v-if="status === 'pending'"
    >
      <UCard variant="subtle">
        <p>Retrieving deployment information</p>
        <UIcon
          name="svg-spinners:blocks-shuffle-3"
          size="35"
          class="mx-auto mt-5"
        />
      </UCard>
    </div>
    <p v-else-if="status === 'error'">Error loading deployments: {{ error }}</p>
    <div v-else-if="status === 'success'" class="py-5">
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        to="/dashboard"
        icon="ph:arrow-bend-double-up-left-duotone"
        label="Back to dashboard"
      />
      <UPageCard
        variant="subtle"
        :ui="{ body: 'sm:p-4' }"
        orientation="horizontal"
        class="my-5"
      >
        <!-- <div class="flex justify-between items-center"> -->
        <template #header>
          <!-- <div class="flex justify-between items-center"> -->
          <UBadge
            :color="deployment.status === 'Ready' ? 'success' : 'error'"
            :label="deployment.status"
            class="mb-3"
          />
          <h3 class="text-3xl font-semibold">{{ deployment.name }}</h3>
          <!-- </div> -->
        </template>
        <UCard>
          <div class="flex gap-1 items-center mb-4">
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
            <UIcon name="ph:dot-duotone" />
            <UBadge color="neutral" variant="soft">{{
              useTimeAgo(deployment.created_time)
            }}</UBadge>
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
            <UIcon name="ph:dot-duotone" />
            <UBadge color="neutral" variant="soft">{{
              useTimeAgo(deployment.updated_time)
            }}</UBadge>
          </div>
        </UCard>
        <!-- </div> -->
      </UPageCard>
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
import { useTimeAgo } from "@vueuse/core";

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
