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
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const hasPaymentMethod = computed(() => {
  return !!user.value?.user_metadata?.app_user?.stripe_payment_method_id;
});

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

  setTimeout(() => {
    stripeLoaded.value = true;
  }, 750);
});

const handlePayment = async () => {
  if (!stripe || !elements) {
    console.error("Stripe.js has not loaded yet.");
    return;
  }

  isSubmitting.value = true;
  console.log("Confirming setup intent with Stripe...");

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

    const newUser = await waitForUpdatedClaims();
    console.log("User after payment method update:", newUser);
  } catch (error) {
    console.error("Payment failed:", error);
    isSubmitting.value = false;
  }

  try {
    const newUser = await waitForUpdatedClaims();
    console.log("User after payment method update:", newUser);
  } catch (error) {
    console.error(
      "Error refreshing session or waiting for claims update:",
      error,
    );
  }

  // await navigateTo("/dashboard/billing");
};

const refreshFullAuthSession = async () => {
  // 1. Get current session to find the refresh token
  const {
    data: { session: currentSession },
  } = await supabase.auth.getSession();
  if (!currentSession?.refresh_token) throw new Error("No session found");

  // 2. Force a refresh from the server
  // This triggers the Postgres Hook on the backend
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: currentSession.refresh_token,
  });

  if (error) throw error;

  // 3. IMPORTANT: Explicitly use the new access token
  // getUser(token) forces the client to decode the NEW string
  // rather than relying on the internal state which might be lagging
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(data.session!.access_token);

  if (userError) throw userError;
  console.log("Session refreshed, new user data:", user);
  return user;
};

const waitForUpdatedClaims = async (maxAttempts = 8, delayMs = 750) => {
  for (let i = 0; i < maxAttempts; i++) {
    const user = await refreshFullAuthSession();
    const appUser = user?.user_metadata?.app_user;
    if (appUser?.stripe_payment_method_id) return user;
    await new Promise((r) => setTimeout(r, delayMs));
  }
  throw new Error("Session refreshed but app_user claims are still stale");
};
</script>
