<template>
  <UApp :toaster="{}">
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script lang="ts" setup>
const user = useSupabaseUser();
watchEffect(() => {
  console.log("Supabase user changed:", user.value);
});
onMounted(async () => {
  const res = await $fetch("/api/health");
  console.log("Health check response:", res);
});
</script>
