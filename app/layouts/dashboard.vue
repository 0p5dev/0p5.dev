<template>
  <div>
    <UHeader :toggle="false">
      <template #left>
        <h1 class="text-xl font-semibold font-[Chakra_Petch]">0p5.dev</h1>
      </template>
      <template #right>
        <div class="flex items-center gap-4">
          <UUser
            :name="user?.email ?? 'unknown'"
            :size="windowWidth > 640 ? 'xl' : 'md'"
          />
          <UButton
            color="neutral"
            @click="logout"
            :loading="loading"
            :label="windowWidth > 640 ? 'Logout' : undefined"
            leading-icon="ph:sign-out"
          />
        </div>
      </template>
    </UHeader>

    <slot />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const { width: windowWidth } = useWindowSize();

const loading = ref<boolean>(false);
async function logout() {
  loading.value = true;
  try {
    await supabase.auth.signOut();
    await navigateTo("/login");
  } catch (err) {
    console.log("Error during logout", err);
  } finally {
    loading.value = false;
  }
}
</script>
