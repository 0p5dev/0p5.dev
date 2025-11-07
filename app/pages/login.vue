<template>
  <div class="w-screen h-screen grid place-content-center">
    <UPageCard class="w-xs">
      <UAuthForm
        :schema="schema"
        title="Login to 0p5.dev"
        :fields="fields"
        @submit="onSubmit"
        :submit="{ label: 'Login', loading }"
      />
    </UPageCard>
  </div>
</template>

<script setup lang="ts">
import * as z from "zod";
import type { FormSubmitEvent, AuthFormField } from "@nuxt/ui";

const { loggedIn, user } = useAuth();

const fields: AuthFormField[] = [
  {
    name: "username",
    type: "text",
    label: "Username",
    placeholder: "Enter your username",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
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
