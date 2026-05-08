<template>
    <UEmpty
        icon="pajamas:deployments"
        title="No deployments yet"
        variant="naked"
        size="xl"
        :ui="{ avatar: 'size-20 text-4xl' }"
    >
        <template #description>
            <div>
                <p class="mb-4">Create your first deployment to see it here.</p>
                <UCard>
                    <template #header>
                        <div class="flex justify-between items-center">
                            <p class="font-semibold">ops CLI</p>
                            <UButton
                                :icon="
                                    textCopied
                                        ? 'ph:check-square-offset-duotone'
                                        : 'ph:copy-duotone'
                                "
                                variant="ghost"
                                color="neutral"
                                size="xl"
                                @click="copyCommandToClipboard"
                            />
                        </div>
                    </template>
                    <code class="leading-4 sm:leading-8 text-sm sm:text-base">
                        ops deploy create
                    </code>
                </UCard>
            </div>
        </template>
    </UEmpty>
</template>

<script setup lang="ts">
const textCopied = ref<boolean>(false);
function copyCommandToClipboard() {
    const commands = `ops deploy create`;
    navigator.clipboard.writeText(commands);
    textCopied.value = true;
    setTimeout(() => {
        textCopied.value = false;
    }, 2000);
}
</script>
