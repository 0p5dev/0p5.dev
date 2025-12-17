<template>
  <UModal
    v-model:open="showModal"
    title="Terminate Deployment"
    :description="deploymentName"
    :ui="{ footer: 'justify-end gap-2' }"
    :dismissible="!props.loading"
    :close="false"
  >
    <template #body>
      <p>
        Are you sure you want to terminate this deployment?
        <br />
        This action cannot be undone.
      </p>
    </template>
    <template #footer>
      <UButton label="Cancel" variant="ghost" color="neutral" @click="cancel" />
      <UButton
        label="Terminate"
        color="error"
        @click="emit('terminate')"
        :loading="props.loading"
      />
    </template>
  </UModal>
</template>

<script setup lang="ts">
const deploymentName = useRoute().params.name as string;
const showModal = defineModel<boolean>();
const props = defineProps<{
  loading: boolean;
}>();
const emit = defineEmits<{
  (e: "terminate"): void;
}>();

const cancel = () => {
  if (!props.loading) {
    showModal.value = false;
  }
};
</script>
