<template>
    <UContainer class="max-w-xl mx-auto pb-8">
        <UPageHeader
            :title="`${hasPaymentMethod ? 'Change' : 'Add'} Payment Method`"
        >
            <template #headline>
                <UButton
                    variant="ghost"
                    color="neutral"
                    size="lg"
                    to="/dashboard/billing"
                    icon="ph:arrow-bend-double-up-left-duotone"
                    label="Back to billing"
                />
            </template>
        </UPageHeader>
        <USkeleton v-if="!stripeLoaded" class="w-full h-64" />
        <div id="payments" class="my-5"></div>
        <div class="flex justify-center">
            <UButton
                v-if="stripeLoaded"
                color="primary"
                @click="handlePayment"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                :label="`${hasPaymentMethod ? 'Change' : 'Add'} Payment Method`"
                size="xl"
            />
        </div>
    </UContainer>
</template>

<script setup lang="ts">
import type {
    Stripe,
    StripeElements,
    StripePaymentElement,
} from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const runtimeConfig = useRuntimeConfig();
const hasPaymentMethod = useHasPaymentMethod();

useHead({
    script: [
        {
            src: "https://js.stripe.com/clover/stripe.js",
            async: true,
        },
    ],
});

let stripe: Stripe | null = null;
let elements: StripeElements | undefined = undefined;
let paymentElement: StripePaymentElement | null = null;
const stripeLoaded = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);

onMounted(async () => {
    let setupIntent: string | undefined = undefined;
    try {
        const { setup_intent } = await $fetch<any>(
            "/api/billing/setup-intent",
            {
                method: "POST",
                credentials: "include",
            },
        );
        setupIntent = setup_intent;
    } catch (error) {
        console.error("Failed to create setup intent:", error);
        return;
    }

    try {
        stripe = await loadStripe(runtimeConfig.public.stripePublishableKey);
    } catch (error) {
        console.error("Failed to load Stripe:", error);
        return;
    }

    if (!stripe) {
        console.error("Stripe failed to initialize.");
        return;
    }

    elements = stripe.elements({
        clientSecret: setupIntent,
        appearance: {
            theme: "night",
        },
    });

    paymentElement = elements.create("payment", { layout: "tabs" });
    paymentElement.mount("#payments");

    stripeLoaded.value = true;
});

const handlePayment = async () => {
    if (!stripe || !elements) {
        console.error("Stripe.js has not loaded yet.");
        return;
    }

    isSubmitting.value = true;
    // console.log("Confirming setup intent with Stripe...");

    try {
        const { error } = await stripe.confirmSetup({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/dashboard/billing",
            },
            redirect: "if_required",
        });

        if (error) {
            isSubmitting.value = false;
            return;
        }
    } catch (error) {
        console.error("Payment failed:", error);
        isSubmitting.value = false;
    }

    setTimeout(async () => {
        await useFetchUserData();
        await navigateTo("/dashboard");
    }, 5000);
};
</script>
