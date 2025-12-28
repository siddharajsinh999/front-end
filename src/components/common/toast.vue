<template>
    <Transition name="toast">
        <div v-if="visible" :class="toastClasses"
            class="fixed top-6 right-6 z-50 min-w-80 max-w-md shadow-lg rounded-lg overflow-hidden">
            <div class="flex items-start p-4 gap-3">
                <!-- Icon -->
                <div :class="iconBgClass" class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center">
                    <!-- Success Icon -->
                    <svg v-if="type === 'success'" class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>

                    <!-- Error Icon -->
                    <svg v-if="type === 'error'" class="w-6 h-6 text-white" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <!-- Content -->
                <div class="flex-1">
                    <h4 :class="titleClass" class="font-semibold text-sm mb-1">
                        {{ title }}
                    </h4>
                    <p class="text-sm text-gray-600">
                        {{ message }}
                    </p>
                </div>

                <!-- Close Button -->
                <button @click="close" class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Progress Bar -->
            <div v-if="showProgress" class="h-1 bg-gray-200">
                <div :class="progressBarClass" class="h-full transition-all ease-linear"
                    :style="{ width: progress + '%' }"></div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'

const props = defineProps({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        default: 'success',
        validator: (value) => ['success', 'error'].includes(value)
    },
    duration: {
        type: Number,
        default: 3000
    },
    showProgress: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['close'])

const visible = ref(false)
const progress = ref(100)
let timer = null
let progressTimer = null

// Computed Classes
const toastClasses = computed(() => ({
    'bg-white border-l-4': true,
    'border-green-500': props.type === 'success',
    'border-red-500': props.type === 'error'
}))

const iconBgClass = computed(() => ({
    'bg-green-500': props.type === 'success',
    'bg-red-500': props.type === 'error'
}))

const titleClass = computed(() => ({
    'text-green-800': props.type === 'success',
    'text-red-800': props.type === 'error'
}))

const progressBarClass = computed(() => ({
    'bg-green-500': props.type === 'success',
    'bg-red-500': props.type === 'error'
}))

const title = computed(() => {
    return props.type === 'success' ? 'Success!' : 'Error!'
})

// Methods
const show = () => {
    visible.value = true

    if (props.duration > 0) {
        // Progress animation
        if (props.showProgress) {
            const interval = 10
            const steps = props.duration / interval
            const decrement = 100 / steps

            progressTimer = setInterval(() => {
                progress.value -= decrement
                if (progress.value <= 0) {
                    clearInterval(progressTimer)
                }
            }, interval)
        }

        // Auto close
        timer = setTimeout(() => {
            close()
        }, props.duration)
    }
}

const close = () => {
    visible.value = false
    if (timer) clearTimeout(timer)
    if (progressTimer) clearInterval(progressTimer)
    emit('close')
}

// Watch for message changes to show toast
watch(() => props.message, (newVal) => {
    if (newVal) {
        show()
    }
}, { immediate: true })

// Cleanup
onUnmounted(() => {
    if (timer) clearTimeout(timer)
    if (progressTimer) clearInterval(progressTimer)
})
</script>

<style scoped>
.toast-enter-active {
    animation: slideIn 0.3s ease-out;
}

.toast-leave-active {
    animation: slideOut 0.3s ease-in;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }

    to {
        transform: translateX(100%);
        opacity: 0;
    }
}
</style>