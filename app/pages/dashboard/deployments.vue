<template>
  <UContainer>
    <div
      class="w-screen h-screen overflow-hidden grid place-content-center"
      v-if="status === 'pending'"
    >
      <UIcon name="svg-spinners:3-dots-bounce" />
    </div>
    <UError
      v-else-if="status === 'error'"
      :error="{
        statusCode: error?.status || 500,
        statusMessage: error?.statusMessage || 'An unknown error occurred',
        message: error?.message || 'Wait a few minutes and try again.',
      }"
      :clear="{
        label: 'Refresh Page',
        onClick: () => execute(),
      }"
    />
    <div v-else-if="status === 'success'" class="py-8">
      <UEmpty
        icon="pajamas:deployments"
        title="No deployments yet"
        variant="naked"
        size="xl"
        :ui="{ avatar: 'size-20 text-4xl' }"
        v-if="data.count === 0"
        :actions="[
          {
            label: 'Add Payment Method',
            to: '/dashboard/billing/payment-method',
          },
        ]"
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
          v-for="deployment in data.deployments"
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

const textCopied = ref<boolean>(false);
function copyCommandToClipboard() {
  const commands = `ops deploy create`;
  navigator.clipboard.writeText(commands);
  textCopied.value = true;
  setTimeout(() => {
    textCopied.value = false;
  }, 2000);
}

const { data, status, error, execute } = await useLazyFetch<any>(
  "/api/deployments",
  {
    method: "GET",
    credentials: "include",
  },
);
</script>
