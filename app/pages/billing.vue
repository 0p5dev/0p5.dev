<template>
  <UContainer class="max-w-md mx-auto">
    <h1>Billing</h1>
    <div id="payments" class="my-5"></div>
    <UButton color="primary" @click="handlePayment" label="Confirm" />
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

onMounted(async () => {
  let setupIntent: string | undefined = undefined;
  try {
    const { setup_intent } = await $fetch<any>("/api/billing/setup-intent", {
      method: "POST",
      credentials: "include",
    });
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
});

const handlePayment = async () => {
  if (!stripe || !elements) {
    console.error("Stripe.js has not loaded yet.");
    return;
  }

  try {
    await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/dashboard",
      },
    });
  } catch (error) {
    console.error("Payment failed:", error);
  }
};
</script>
