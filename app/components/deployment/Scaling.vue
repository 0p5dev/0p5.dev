<template>
  <UPageCard
    variant="subtle"
    class="flex-1"
    :ui="{
      wrapper: 'items-stretch',
    }"
  >
    <template #title>
      <div class="flex items-center justify-between mb-1">
        <div>
          Scaling<span
            class="font-normal text-muted text-nowrap text-sm sm:text-base"
          >
            (container instances)</span
          >
        </div>
        <UButton
          v-if="!isEditing"
          label="Edit Scaling"
          @click="isEditing = true"
        />
        <div v-else-if="isEditing && windowWidth > 640" class="flex gap-2">
          <UButton label="Cancel" variant="ghost" @click="isEditing = false" />
          <UButton
            label="Save Changes"
            color="primary"
            @click="emit('update:scaling', { min_instances, max_instances })"
            :disabled="disabled"
          />
        </div>
      </div>
    </template>
    <div class="flex gap-4">
      <UPageCard class="flex-1">
        <p class="-mb-2">Min</p>
        <UInputNumber
          v-if="isEditing"
          v-model="min_instances"
          :min="0"
          :max="max_instances"
          :color="invalid || min_instances < 0 ? 'error' : 'primary'"
        />
        <p v-else class="text-3xl font-semibold">{{ min_instances }}</p>
      </UPageCard>
      <UPageCard class="flex-1">
        <p class="text-nowrap -mb-2">Max</p>
        <UInputNumber
          v-if="isEditing"
          v-model="max_instances"
          :min="min_instances || 1"
          :max="10"
          :color="invalid || max_instances < 1 ? 'error' : 'primary'"
        />
        <p v-else class="text-3xl font-semibold">{{ max_instances }}</p>
      </UPageCard>
    </div>
    <div v-if="isEditing && windowWidth <= 640" class="flex justify-end gap-2">
      <UButton label="Cancel" variant="ghost" @click="isEditing = false" />
      <UButton
        label="Save Changes"
        color="primary"
        @click="emit('update:scaling', { min_instances, max_instances })"
        :disabled="disabled"
      />
    </div>
  </UPageCard>
</template>

<script setup lang="ts">
const { width: windowWidth } = useWindowSize();

const props = defineProps<{
  minInstances: number;
  maxInstances: number;
}>();

const originalMinInstances = computed(() => props.minInstances);
const originalMaxInstances = computed(() => props.maxInstances);

const min_instances = ref<number>(props.minInstances);
const max_instances = ref<number>(props.maxInstances);
const isEditing = ref<boolean>(false);

// Reset to original values when editing is cancelled
watch(isEditing, (newValue) => {
  if (!newValue) {
    min_instances.value = originalMinInstances.value;
    max_instances.value = originalMaxInstances.value;
  }
});

// Update local copies when props change
watch(
  () => [props.minInstances, props.maxInstances],
  ([newMin, newMax]) => {
    if (!isEditing.value && newMin !== undefined && newMax !== undefined) {
      min_instances.value = newMin;
      max_instances.value = newMax;
    }
  },
);
const invalid = computed<boolean>(
  () => min_instances.value > max_instances.value,
);
const disabled = computed<boolean>(
  () => invalid.value || min_instances.value < 0 || max_instances.value < 1,
);
const emit = defineEmits(["update:scaling"]);
</script>
