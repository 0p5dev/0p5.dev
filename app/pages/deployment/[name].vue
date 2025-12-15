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
    <UError
      v-else-if="status === 'error'"
      :error="{
        statusCode: errorMap.statusCode,
        statusMessage: errorMap.statusMessage,
        message: errorMap.message,
      }"
      ,
      :clear="{
        label: 'Back to dashboard',
      }"
      redirect="/dashboard"
    />
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
        class="mt-5 mb-7"
      >
        <template #header>
          <UBadge
            :color="deployment.status === 'Ready' ? 'success' : 'error'"
            :label="deployment.status"
            class="mb-3"
          />
          <h3 class="text-3xl font-semibold">{{ deployment.name }}</h3>
        </template>
        <UCard>
          <div class="flex gap-1 items-center mb-4">
            <p>First deployed</p>
            <UIcon name="ph:dot-duotone" />
            <NuxtTime :datetime="new Date(deployment.created_time)" />
            <UIcon name="ph:dot-duotone" />
            <UBadge color="neutral" variant="soft">
              <NuxtTime
                :datetime="new Date(deployment.created_time)"
                relative
                numeric="auto"
                relative-style="long"
              />
            </UBadge>
          </div>
          <div class="flex gap-1 items-center">
            <p>Last deployed</p>
            <UIcon name="ph:dot-duotone" />
            <NuxtTime :datetime="new Date(deployment.updated_time)" />
            <UIcon name="ph:dot-duotone" />
            <UBadge color="neutral" variant="soft">
              <NuxtTime
                :datetime="new Date(deployment.updated_time)"
                relative
                numeric="auto"
                relative-style="long"
              />
            </UBadge>
          </div>
        </UCard>
      </UPageCard>
      <div class="flex gap-7 mb-5">
        <UPageCard variant="subtle" title="Incurred Charges" class="flex-1">
          <div class="flex gap-4">
            <UPageCard class="flex-1">
              <p class="-mb-2">Lifetime</p>
              <p class="text-3xl font-semibold">$75.49</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="text-nowrap -mb-2">This Month</p>
              <p class="text-3xl font-semibold">$43.01</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="-mb-2">Today</p>
              <p class="text-3xl font-semibold">$10.47</p>
            </UPageCard>
          </div>
        </UPageCard>
        <UPageCard variant="subtle" class="flex-1">
          <template #title>
            Scaling<span class="font-normal text-muted">
              (container instances)</span
            >
          </template>
          <div class="flex gap-4">
            <UPageCard class="flex-1">
              <p class="-mb-2">Min</p>
              <p class="text-3xl font-semibold">0</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="text-nowrap -mb-2">Max</p>
              <p class="text-3xl font-semibold">1</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="-mb-2">Current</p>
              <p class="text-3xl font-semibold">1</p>
            </UPageCard>
          </div>
        </UPageCard>
      </div>
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

const errorMap = computed(() => {
  if (error.value?.statusCode === 404) {
    return {
      statusCode: 404,
      statusMessage: "Deployment Not Found",
      message:
        "The deployment you are looking for does not exist. Please check the name and try again.",
    };
  }
  return {
    statusCode: error.value?.statusCode || 500,
    statusMessage: "An unknown error occurred",
    message:
      "Try again in a few moments, or contact support if the issue persists.",
  };
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
