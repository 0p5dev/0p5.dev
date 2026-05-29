<template>
  <UPageCard title="Current Spend" variant="subtle" class="flex-1">
    <template #description>
      <NuxtTime :datetime="Date.now()" month="long" year="numeric" />
    </template>

    <h1 class="text-3xl">$0.00</h1>
  </UPageCard>
</template>
