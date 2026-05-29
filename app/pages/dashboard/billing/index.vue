<template>
    <UContainer>
        <ClientOnly
            ><div
                class="w-screen h-screen overflow-hidden grid place-content-center"
                v-if="status === 'pending'"
            >
                <UIcon name="svg-spinners:3-dots-bounce" />
            </div>
            <UError
                v-else-if="status === 'error' && error?.status !== 404"
                :error="{
                    statusCode: error?.status || 500,
                    statusMessage:
                        error?.statusMessage || 'An unknown error occurred',
                    message:
                        error?.message || 'Wait a few minutes and try again.',
                }"
                ,
                :clear="{
                    label: 'Refresh Page',
                    onClick: () => execute(),
                }" />
            <div v-else class="pb-8">
                <AlertsPaymentMethodMissing
                    v-if="!hasPaymentMethod && showNoPaymentMethodAlert"
                    @update:open="showNoPaymentMethodAlert = false"
                />
                <AlertsPaymentMethodExpired
                    v-if="
                        paymentMethodIsExpired && showPaymentMethodExpiredAlert
                    "
                    @update:open="showPaymentMethodExpiredAlert = false"
                />
                <div class="flex gap-4 py-8">
                    <BillingSpendingOverview />
                    <BillingPaymentMethodOverview
                        :paymentMethod="paymentMethod"
                    />
                </div></div
        ></ClientOnly>
    </UContainer>
</template>

<script setup lang="ts">
const {
    data: paymentMethod,
    status,
    error,
    execute,
} = await useLazyFetch<any>("/api/billing/payment-method", {
    method: "GET",
    credentials: "include",
    server: false,
});

const hasPaymentMethod = useHasPaymentMethod();
const showNoPaymentMethodAlert = ref<boolean>(true);

const paymentMethodIsExpired = usePaymentMethodIsExpired(paymentMethod.value);
const showPaymentMethodExpiredAlert = ref<boolean>(true);
</script>
