<template>
  <UModal
    v-model:open="showModal"
    title="Updating Deployment"
    description="Loading indicator for deployment updates"
  >
    <template #content>
      <UCard variant="subtle" class="text-center">
        <p>Updating deployment</p>
        <UIcon
          name="svg-spinners:blocks-shuffle-3"
          size="35"
          class="mx-auto mt-5"
        />
      </UCard>
    </template>
  </UModal>
</template>

<script setup lang="ts">
const showModal = defineModel<boolean>();
</script>
