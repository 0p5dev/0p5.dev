<template>
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
</template>

<script setup lang="ts">
import { LineChart } from "vue-chrts";

const props = defineProps<{
  metrics: any;
}>();

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
  if (!props.metrics.requests_per_hour) {
    return [];
  }

  return props.metrics.requests_per_hour.map(
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
  if (!props.metrics.cpu_per_hour) {
    return [];
  }

  return props.metrics.cpu_per_hour.map((value: number, index: number) => ({
    requests: value,
    x: index,
  }));
});

const cpuXFormatter = (i: number) => {
  const totalHours = cpuData.value.length - 1;
  return `${totalHours - cpuData.value[i].x} hours ago`;
};
</script>
