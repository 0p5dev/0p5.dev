<template>
  <UContainer>
    <div
      class="w-full h-[85vh] overflow-hidden gap-5 grid place-content-center text-center"
      v-if="status === 'pending'"
    >
      <UCard variant="subtle">
        <p>Retrieving deployment information</p>
        <UIcon
          name="svg-spinners:blocks-shuffle-3"
          size="35"
          class="mx-auto mt-5"
        />
      </UCard>
    </div>
    <UError
      v-else-if="status === 'error'"
      :error="{
        statusCode: errorMap.statusCode,
        statusMessage: errorMap.statusMessage,
        message: errorMap.message,
      }"
      ,
      :clear="{
        label: 'Back to dashboard',
      }"
      redirect="/dashboard"
    />
    <div v-else-if="status === 'success' && deployment" class="py-5">
      <UButton
        variant="ghost"
        color="neutral"
        size="lg"
        to="/dashboard"
        icon="ph:arrow-bend-double-up-left-duotone"
        label="Back to dashboard"
      />
      <UPageCard
        variant="subtle"
        :ui="{
          body: 'sm:p-4',
        }"
        orientation="horizontal"
        class="mt-5 mb-7"
      >
        <template #header>
          <UBadge
            :color="deployment.status === 'Ready' ? 'success' : 'error'"
            :label="deployment.status"
            class="mb-3"
          />
          <h3 class="text-3xl font-semibold">{{ deployment.name }}</h3>
        </template>
        <UCard>
          <div class="flex flex-col sm:flex-row gap-1 items-center mb-4">
            <p class="font-bold sm:font-normal">First deployed</p>
            <UIcon name="ph:dot-duotone" class="hidden sm:block" />
            <NuxtTime :datetime="new Date(deployment.created_time)" />
            <UIcon name="ph:dot-duotone" class="hidden sm:block" />
            <UBadge color="neutral" variant="soft">
              <NuxtTime
                :datetime="new Date(deployment.created_time)"
                relative
                numeric="auto"
                relative-style="long"
              />
            </UBadge>
          </div>
          <USeparator class="block sm:hidden mb-2" />
          <div class="flex flex-col sm:flex-row gap-1 items-center">
            <p class="font-bold sm:font-normal">Last deployed</p>
            <UIcon name="ph:dot-duotone" class="hidden sm:block" />
            <NuxtTime :datetime="new Date(deployment.updated_time)" />
            <UIcon name="ph:dot-duotone" class="hidden sm:block" />
            <UBadge color="neutral" variant="soft">
              <NuxtTime
                :datetime="new Date(deployment.updated_time)"
                relative
                numeric="auto"
                relative-style="long"
              />
            </UBadge>
          </div>
        </UCard>
      </UPageCard>
      <div class="flex flex-col sm:flex-row flex-wrap gap-7 mb-5">
        <UPageCard
          variant="subtle"
          class="flex-1"
          :ui="{
            wrapper: 'items-stretch',
          }"
        >
          <template #title>
            <div class="flex items-center justify-between mb-1">
              <div>Incurred Charges</div>
              <UButton label="Billing Info" />
            </div>
          </template>
          <div class="flex flex-col sm:flex-row gap-4">
            <UPageCard class="flex-1">
              <p class="-mb-2">Lifetime</p>
              <p class="text-3xl font-semibold">$75.49</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="text-nowrap -mb-2">This Month</p>
              <p class="text-3xl font-semibold">$43.01</p>
            </UPageCard>
            <UPageCard class="flex-1">
              <p class="-mb-2">Today</p>
              <p class="text-3xl font-semibold">$10.47</p>
            </UPageCard>
          </div>
        </UPageCard>
        <DeploymentScaling
          v-if="deployment"
          :min-instances="deployment.scaling.min_instances"
          :max-instances="deployment.scaling.max_instances"
          @update:scaling="updateDeployment"
        />
      </div>
      <UPageFeature
        title="URL"
        :description="deployment.url"
        icon="ph:share-duotone"
        :to="deployment.url"
        target="_blank"
        class="max-w-max"
      />
      <UPageFeature
        title="Container Image"
        :description="deployment.image"
        icon="ph:cube-duotone"
        class="mt-5 mb-7"
      />

      <!-- <DeploymentMetrics :metrics="deployment.metrics" /> -->

      <div
        class="flex flex-col sm:flex-row gap-3 sm:gap-7 my-7 items-start sm:items-center border border-neutral-800 p-5 rounded-lg"
      >
        <UButton
          color="error"
          label="Terminate Deployment"
          @click="showTerminateModal = true"
        />
        <USeparator orientation="vertical" class="h-12 hidden sm:block" />
        <p>
          Permanently decommission this deployment and immediately stop
          accepting incoming traffic.
        </p>
      </div>
    </div>
    <DeploymentTerminateModal
      v-model="showTerminateModal"
      :loading="terminationLoading"
      @terminate="terminateDeployment"
    />
    <DeploymentUpdateLoadingModal v-model="updateLoading" />
  </UContainer>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
});

const toast = useToast();

interface CloudRunServiceDetails {
  name: string;
  url: string;
  image: string;
  status: string;
  location: string;
  created_time: string;
  updated_time: string;
  scaling: {
    min_instances: number;
    max_instances: number;
  };
  metrics: any;
}

interface UpdateDeploymentPayload {
  name: string;
  container_image: string;
  min_instances: number;
  max_instances: number;
}

const {
  data: deployment,
  status,
  error,
  refresh,
} = await useLazyFetch<CloudRunServiceDetails>(
  `/api/deployments/${useRoute().params.name}`,
  {
    method: "GET",
    credentials: "include",
  },
);

const errorMap = computed(() => {
  if (error.value?.statusCode === 404) {
    return {
      statusCode: 404,
      statusMessage: "Deployment Not Found",
      message:
        "The deployment you are looking for does not exist. Please check the name and try again.",
    };
  }
  return {
    statusCode: error.value?.statusCode || 500,
    statusMessage: "An unknown error occurred",
    message:
      "Try again in a few moments, or contact support if the issue persists.",
  };
});

const updateLoading = ref<boolean>(false);
const updateDeployment = async (payload: Partial<UpdateDeploymentPayload>) => {
  updateLoading.value = true;
  let body: UpdateDeploymentPayload = {
    name: deployment.value!.name,
    container_image: deployment.value!.image,
    min_instances: deployment.value!.scaling.min_instances,
    max_instances: deployment.value!.scaling.max_instances,
  };
  body = { ...body, ...payload };
  try {
    await $fetch<any>(`/api/deployments`, {
      method: "PUT",
      credentials: "include",
      body,
    });
    await refresh();
  } catch (err: any) {
    console.error(err);
    toast.add({ title: "Error", description: err.message, color: "error" });
  }
  updateLoading.value = false;
};

const showTerminateModal = ref<boolean>(false);
const terminationLoading = ref<boolean>(false);
const terminateDeployment = async () => {
  terminationLoading.value = true;
  try {
    await $fetch<any>(`/api/deployments/${deployment.value!.name}`, {
      method: "DELETE",
      credentials: "include",
    });
    showTerminateModal.value = false;
    toast.add({
      title: "Deployment Terminated",
      description: `The deployment ${
        deployment.value!.name
      } has been terminated.`,
      color: "success",
    });
    navigateTo("/dashboard");
  } catch (err: any) {
    console.error(err);
    toast.add({ title: "Error", description: err.message, color: "error" });
  }
  terminationLoading.value = false;
};
</script>
