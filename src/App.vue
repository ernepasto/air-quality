<template>
    <n-scrollbar style="max-height: 100vh;">
        <n-loading-bar-provider>
            <n-message-provider>
                <RouterView />
            </n-message-provider>
        </n-loading-bar-provider>
    </n-scrollbar>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted, ref, Ref } from 'vue';
import { NLoadingBarProvider, NMessageProvider, NScrollbar } from 'naive-ui';



</script>