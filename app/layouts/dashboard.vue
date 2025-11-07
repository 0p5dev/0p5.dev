<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <h1 class="text-xl font-semibold">0p5.dev</h1>
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <UUser :name="user as string" size="xl" />
          <UButton size="xl" color="neutral" @click="logout" :loading="loading"
            >Logout</UButton
          >
        </div>
      </template>
    </UHeader>

    <slot />
  </div>
</template>

<script setup lang="ts">
const { user, loggedIn } = useAuth();

const loading = ref<boolean>(false);
async function logout() {
  loading.value = true;
  try {
    await $fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    loggedIn.value = false;
    user.value = null;
    await navigateTo("/login");
  } catch (err) {
    console.log("Error during logout", err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
