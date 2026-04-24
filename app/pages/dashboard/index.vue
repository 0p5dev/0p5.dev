<template>
  <UContainer>
    <div
      class="w-screen h-screen overflow-hidden grid place-content-center"
      v-if="status === 'pending'"
    >
      <UIcon name="svg-spinners:3-dots-bounce" />
    </div>
    <UError
      v-else-if="status === 'error' && error?.status !== 404"
      :error="{
        statusCode: error?.status || 500,
        statusMessage: error?.statusMessage || 'An unknown error occurred',
        message: error?.message || 'Wait a few minutes and try again.',
      }"
      ,
      :clear="{
        label: 'Refresh Page',
        onClick: () => execute(),
      }"
    />
    <div v-else class="pb-8">
      <AlertsPaymentMethodMissing
        v-if="!hasPaymentMethod && showNoPaymentMethodAlert"
        @update:open="showNoPaymentMethodAlert = false"
      />
      <AlertsPaymentMethodExpired
        v-if="paymentMethodIsExpired && showPaymentMethodExpiredAlert"
        @update:open="showPaymentMethodExpiredAlert = false"
      />
      <UPageHeader title="Billing" :ui="{ root: 'border-b-0' }" />
      <div class="flex gap-4">
        <BillingSpendingOverview />
        <BillingPaymentMethodOverview :paymentMethod="data?.paymentMethod" />
      </div>

      <UPageHeader title="Deployments" :ui="{ root: 'border-b-0' }" />

      <DeploymentsPlaceholder v-if="data?.deploymentsOverview?.count === 0" />

      <UPageGrid v-else>
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

const hasPaymentMethod = useHasPaymentMethod();
const showNoPaymentMethodAlert = ref<boolean>(true);

const paymentMethodIsExpired = usePaymentMethodIsExpired();
const showPaymentMethodExpiredAlert = ref<boolean>(true);

const { data, status, error, execute } = await useLazyAsyncData<any>(
  "dashboard",
  async () => {
    const [deploymentsOverview, paymentMethod] = await Promise.allSettled<any>([
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
      deploymentsOverview:
        deploymentsOverview?.status === "fulfilled"
          ? deploymentsOverview.value
          : null,
      paymentMethod:
        paymentMethod?.status === "fulfilled" ? paymentMethod.value : null,
    };
  },
  {
    server: false,
  },
);
</script>
