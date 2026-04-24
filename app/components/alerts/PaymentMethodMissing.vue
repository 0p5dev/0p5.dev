<template>
  <UAlert
    class="mt-8"
    variant="subtle"
    color="info"
    icon="bi:info-square"
    title="No payment method"
    description="You will not be able to create deployments until you have added a payment method."
    close
    @update:open="emit('update:open')"
    :actions="[
      {
        label: 'Add Payment Method',
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
