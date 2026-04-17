<template>
  <div class="flex gap-4 py-8">
    <UPageCard title="Current Spend" variant="soft" class="flex-1">
      <template #description>
        <NuxtTime :datetime="Date.now()" month="long" year="numeric" />
      </template>

      <h1 class="text-3xl">$50.89</h1>
    </UPageCard>
    <UPageCard title="Payment Method" variant="soft" class="flex-1">
      <template #description>
        <div class="flex items-center gap-2">
          <UIcon
            :name="`brandico:${paymentMethod?.brand?.toLowerCase()}`"
            size="24"
          />
          <p>{{ paymentMethod?.last4 }}</p>
        </div>
        <p>
          expires {{ paymentMethod?.exp_month }}/{{ paymentMethod?.exp_year }}
        </p>
      </template>

      <template #footer>
        <UButton label="Change" to="/dashboard/billing/payment-method" />
      </template>
    </UPageCard>
  </div>
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
</script>
