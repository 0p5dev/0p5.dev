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
      <UAlert
        v-if="!hasPaymentMethod && showNoPaymentMethodAlert"
        class="mt-8"
        variant="subtle"
        color="info"
        icon="bi:info-square"
        title="No payment method"
        description="You will not be able to create deployments until you have added a payment method."
        close
        @update:open="showNoPaymentMethodAlert = false"
        :actions="[
          {
            label: 'Add Payment Method',
            to: '/dashboard/billing/payment-method',
            color: 'info',
          },
        ]"
        :ui="{ title: 'font-bold' }"
      />
      <UAlert
        v-if="paymentMethodIsExpired && showPaymentMethodExpiredAlert"
        class="mt-8"
        variant="subtle"
        color="info"
        icon="bi:info-square"
        title="Payment method expired"
        description="Your current deployments will be paused, and you will not be able to create new deployments until you update your payment method."
        close
        @update:open="showPaymentMethodExpiredAlert = false"
        :actions="[
          {
            label: 'Update Payment Method',
            to: '/dashboard/billing/payment-method',
            color: 'info',
          },
        ]"
        :ui="{ title: 'font-bold' }"
      />
      <UPageHeader title="Billing" :ui="{ root: 'border-b-0' }" />
      <div class="flex gap-4">
        <UPageCard title="Current Spend" variant="subtle" class="flex-1">
          <template #description>
            <NuxtTime :datetime="Date.now()" month="long" year="numeric" />
          </template>

          <h1 class="text-3xl">$0.00</h1>
        </UPageCard>
        <UPageCard title="Payment Method" variant="subtle" class="flex-1">
          <template #description>
            <div v-if="hasPaymentMethod">
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
            </div>
            <p class="italic" v-else>No payment method added</p>
          </template>

          <template #footer>
            <UButton
              :label="`${hasPaymentMethod ? 'Change' : 'Add'} Payment Method`"
              to="/dashboard/billing/payment-method"
            />
          </template>
        </UPageCard>
      </div>

      <UPageHeader title="Deployments" :ui="{ root: 'border-b-0' }" />
      <UEmpty
        icon="pajamas:deployments"
        title="No deployments yet"
        variant="naked"
        size="xl"
        :ui="{ avatar: 'size-20 text-4xl' }"
        v-if="data?.deploymentsOverview?.count === 0"
      >
        <template #description>
          <div v-if="hasPaymentMethod">
            <p class="mb-4">Create your first deployment to see it here.</p>
            <UCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <p class="font-semibold">ops CLI</p>
                  <UButton
                    :icon="
                      textCopied
                        ? 'ph:check-square-offset-duotone'
                        : 'ph:copy-duotone'
                    "
                    variant="ghost"
                    color="neutral"
                    size="xl"
                    @click="copyCommandToClipboard"
                  />
                </div>
              </template>
              <code class="leading-4 sm:leading-8 text-sm sm:text-base">
                ops deploy create
              </code>
            </UCard>
          </div>
          <p v-else>Add a payment method to create your first deployment.</p>
        </template>
      </UEmpty>
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

const user = useSupabaseUser();

const hasPaymentMethod = computed(() => {
  return !!user.value?.user_metadata?.app_user?.stripe_payment_method_id;
});
const showNoPaymentMethodAlert = ref<boolean>(true);

const paymentMethodIsExpired = computed<boolean>(() => {
  if (!data.value?.paymentMethod) return false;

  const { exp_month, exp_year } = data.value.paymentMethod;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-indexed

  return (
    exp_year < currentYear ||
    (exp_year === currentYear && exp_month < currentMonth)
  );
});
const showPaymentMethodExpiredAlert = ref<boolean>(true);

const textCopied = ref<boolean>(false);
function copyCommandToClipboard() {
  const commands = `ops deploy create`;
  navigator.clipboard.writeText(commands);
  textCopied.value = true;
  setTimeout(() => {
    textCopied.value = false;
  }, 2000);
}

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

<style scoped></style>
