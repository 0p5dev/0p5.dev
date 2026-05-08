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
                statusMessage:
                    error?.statusMessage || 'An unknown error occurred',
                message: error?.message || 'Wait a few minutes and try again.',
            }"
            :clear="{
                label: 'Refresh Page',
                onClick: () => execute(),
            }"
        />
        <div v-else-if="status === 'success'" class="py-8">
            <DeploymentsPlaceholder v-if="data?.count === 0" />
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

const { data, status, error, execute } = await useLazyFetch<any>(
    "/api/deployments",
    {
        method: "GET",
        credentials: "include",
    },
);
</script>
