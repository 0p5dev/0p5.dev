<template>
    <UPageCard title="Payment Method" variant="subtle" class="flex-1">
        <template #description>
            <div v-if="hasPaymentMethod">
                <div class="flex items-center gap-2">
                    <UIcon
                        :name="`brandico:${paymentMethod?.brand?.toLowerCase()}`"
                        size="24"
                    />
                    <p>{{ paymentMethod?.last4 }}</p>
                </div>
                <p :class="{ 'text-red-400': paymentMethodIsExpired }">
                    expire{{ paymentMethodIsExpired ? "d" : "s" }}
                    {{ paymentMethod?.exp_month }}/{{ paymentMethod?.exp_year }}
                </p>
            </div>
            <p class="italic" v-else>No payment method added</p>
        </template>

        <template #footer>
            <UButton
                :label="`${hasPaymentMethod ? 'Change' : 'Add'} Payment Method`"
                to="/dashboard/billing/payment-method"
            />
        </template>
    </UPageCard>
</template>

<script setup lang="ts">
const props = defineProps<{
    paymentMethod: any;
}>();

const hasPaymentMethod = useHasPaymentMethod();
const paymentMethodIsExpired = usePaymentMethodIsExpired(props.paymentMethod);
</script>
