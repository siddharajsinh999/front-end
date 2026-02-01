<template>
    <div v-if="show" :class="[
        fullscreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10',
        'flex items-center justify-center bg-white/70 backdrop-blur-sm'
    ]">
        <div class="flex flex-col items-center gap-3">
            <!-- Spinner -->
            <div class="rounded-full animate-spin" :class="spinnerClass"></div>

            <!-- Optional Text -->
            <p v-if="text" class="text-sm font-medium text-gray-600">
                {{ text }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    fullscreen: {
        type: Boolean,
        default: true
    },
    size: {
        type: String,
        default: "md" // sm | md | lg
    },
    text: {
        type: String,
        default: ""
    }
});

const spinnerClass = computed(() => {
    switch (props.size) {
        case "sm":
            return "h-6 w-6 border-2 border-gray-200 border-t-purple-600";
        case "lg":
            return "h-12 w-12 border-4 border-gray-200 border-t-purple-600";
        default:
            return "h-10 w-10 border-4 border-gray-200 border-t-purple-600";
    }
});
</script>
