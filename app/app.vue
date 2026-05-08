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
watch(user, (newUser, oldUser) => {
    if (oldUser === null && newUser !== null) {
        return navigateTo("/dashboard");
    }
});
</script>
