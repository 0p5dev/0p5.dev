<template>
  <div class="w-screen h-screen grid place-content-center">
    <UPageCard class="w-xs">
      <UAuthForm
        :providers="providers"
        :ui="{ providers: 'space-y-6', header: 'mb-8' }"
      >
        <template #title>
          <p class="text-xl text-pretty font-semibold text-highlighted">
            Login to
            <span class="text-primary font-[Chakra_Petch]">0p5.dev</span>
          </p>
        </template>
      </UAuthForm>
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import type { ButtonProps } from "@nuxt/ui";

const toast = useToast();
const supabase = useSupabaseClient();

async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "/dashboard",
    },
  });
  if (error) {
    toast.add({ title: "Error", description: error.message, color: "error" });
  } else {
    toast.add({
      title: "Redirecting",
      description: "You will be redirected to Google for authentication.",
    });
  }
}

async function loginWithGitHub() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "/dashboard",
    },
  });
  if (error) {
    // console.log("GitHub login error:", error);
    toast.add({ title: "Error", description: error.message, color: "error" });
  } else {
    toast.add({
      title: "Redirecting",
      description: "You will be redirected to GitHub for authentication.",
    });
  }
}

const providers: ButtonProps[] = [
  {
    label: "GitHub",
    icon: "ph:github-logo-bold",
    size: "xl",
    onClick: loginWithGitHub,
  },
  {
    label: "Google",
    icon: "ph:google-logo-bold",
    size: "xl",

    onClick: loginWithGoogle,
  },
];
</script>
