<template>
  <UContainer>
    <div
      class="w-screen h-screen overflow-hidden grid place-content-center"
      v-if="status === 'pending'"
    >
      <UIcon name="svg-spinners:3-dots-bounce" />
    </div>
    <p v-else-if="status === 'error'">Error loading deployments: {{ error }}</p>
    <div v-else-if="status === 'success'" class="pb-8">
      <UPageHeader title="Billing" :ui="{ root: 'border-b-0' }" />
      <div class="flex gap-4">
        <UPageCard title="Current Spend" variant="soft" class="flex-1">
          <template #description>
            <NuxtTime :datetime="Date.now()" month="long" year="numeric" />
          </template>

          <h1 class="text-3xl">$0.00</h1>
        </UPageCard>
        <UPageCard title="Payment Method" variant="soft" class="flex-1">
          <template #description>
            <div class="flex items-center gap-2">
              <UIcon
                :name="`brandico:${data?.paymentMethod?.brand?.toLowerCase()}`"
                size="24"
              />
              <p>{{ data?.paymentMethod?.last4 }}</p>
            </div>
            <p>
              expires {{ data?.paymentMethod?.exp_month }}/{{
                data?.paymentMethod?.exp_year
              }}
            </p>
          </template>

          <template #footer>
            <UButton label="Change" to="/dashboard/billing/payment-method" />
          </template>
        </UPageCard>
      </div>

      <UPageHeader title="Deployments" :ui="{ root: 'border-b-0' }" />
      <UPageGrid>
        <UPageCard
          v-for="deployment in data?.deploymentsOverview?.deployments"
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

const { data, status, error } = await useLazyAsyncData<any>(
  "dashboard",
  async () => {
    const [deploymentsOverview, paymentMethod] = await Promise.all([
      $fetch("/api/deployments", {
        method: "GET",
        credentials: "include",
      }),
      $fetch("/api/billing/payment-method", {
        method: "GET",
        credentials: "include",
      }),
    ]);

    return {
      deploymentsOverview,
      paymentMethod,
    };
  },
  {
    server: false,
  },
);
</script>

<style scoped></style>
