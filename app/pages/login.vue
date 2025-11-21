<template>
  <div class="w-screen h-screen grid place-content-center">
    <UPageCard class="w-xs">
      <UAuthForm
        :schema="schema"
        :providers="providers"
        @submit="onSubmit"
        :submit="{ label: 'Login', loading, size: 'xl', class: 'mt-3' }"
        :ui="{ providers: 'space-y-5' }"
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
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const { loggedIn, user } = useAuth();
const toast = useToast();
const supabase = useSupabaseClient();

async function loginWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "http://localhost:3000/dashboard",
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
  console.log("Logging in with GitHub");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://localhost:3000/",
    },
  });
  if (error) {
    console.log("GitHub login error:", error);
    toast.add({ title: "Error", description: error.message, color: "error" });
  } else {
    toast.add({
      title: "Redirecting",
      description: "You will be redirected to GitHub for authentication.",
    });
  }
  console.log("GitHub login data:", data);
}

const providers = [
  {
    label: "Google",
    icon: "i-simple-icons-google",
    onClick: loginWithGoogle,
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    onClick: loginWithGitHub,
  },
];

const fields: AuthFormField[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
    size: "xl",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
    size: "xl",
  },
];

const schema = z.object({
  username: z
    .string("Invalid username")
    .min(10, "Must be at least 10 characters"),
  password: z
    .string("Password is required")
    .min(16, "Must be at least 16 characters"),
});

type Schema = z.output<typeof schema>;

const loading = ref<boolean>(false);
async function onSubmit(payload: FormSubmitEvent<Schema>): Promise<void> {
  loading.value = true;
  try {
    const res = await $fetch<any>("/api/auth/login", {
      method: "POST",
      body: {
        username: payload.data.username,
        password: payload.data.password,
      },
      credentials: "include",
    });
    loggedIn.value = res.loggedIn;
    user.value = res.user;
    await navigateTo("/dashboard");
  } catch (err: any) {
    console.log("Error during login", err);
  } finally {
    loading.value = false;
  }
}
</script>
