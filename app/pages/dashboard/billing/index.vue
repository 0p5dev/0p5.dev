<template>
  <UContainer>
    <AlertsPaymentMethodMissing
      v-if="!hasPaymentMethod && showNoPaymentMethodAlert"
      @update:open="showNoPaymentMethodAlert = false"
    />
    <AlertsPaymentMethodExpired
      v-if="paymentMethodIsExpired && showPaymentMethodExpiredAlert"
      @update:open="showPaymentMethodExpiredAlert = false"
    />
    <div class="flex gap-4 py-8">
      <BillingSpendingOverview />
      <BillingPaymentMethodOverview :paymentMethod="paymentMethod" />
    </div>
  </UContainer>
</template>

<script setup lang="ts">
const {
  data: paymentMethod,
  status,
  error,
} = await useLazyFetch<any>("/api/billing/payment-method", {
  method: "GET",
  credentials: "include",
});

const user = useSupabaseUser();

const hasPaymentMethod = computed(() => {
  return !!user.value?.user_metaapp_user?.stripe_payment_method_id;
});
const showNoPaymentMethodAlert = ref<boolean>(true);

const paymentMethodIsExpired = computed<boolean>(() => {
  if (!paymentMethod.value) return false;

  const { exp_month, exp_year } = paymentMethod.value;
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // getMonth is zero-indexed

  return (
    exp_year < currentYear ||
    (exp_year === currentYear && exp_month < currentMonth)
  );
});
const showPaymentMethodExpiredAlert = ref<boolean>(true);
</script>
