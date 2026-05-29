<template>
  <UAlert
    class="mt-8"
    variant="subtle"
    color="info"
    icon="bi:info-square"
    title="Payment method expired"
    description="Your current deployments will be paused, and you will not be able to create new deployments until you update your payment method."
    close
    @update:open="emit('update:open')"
    :actions="[
      {
        label: 'Update Payment Method',
        to: '/dashboard/billing/payment-method',
        color: 'info',
      },
    ]"
    :ui="{ title: 'font-bold' }"
  />
</template>

<script setup lang="ts">
const emit = defineEmits(["update:open"]);
</script>
