<template>
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

        <div>
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white grid place-items-center rounded-lg sm:rounded-xl text-sm sm:text-base">📦</span>
                Batch Module
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Manage and monitor manufacturing batches</p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 sm:mt-6 gap-3">
            <div class="flex gap-2 sm:gap-3">
                <button class="px-3 sm:px-4 py-2 rounded-full bg-blue-600 text-white shadow text-sm">
                    All Batches
                </button>
            </div>

            <router-link :to="{ name: 'new-batch' }" class="w-full sm:w-auto">
                <button
                    :disabled="loading"
                    class="w-full sm:w-auto px-4 sm:px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow transition flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="text-lg">+</span>
                    Add Batch
                </button>
            </router-link>
        </div>

        <div class="bg-white shadow rounded-lg sm:rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">

            <div class="flex items-center gap-2 mb-3 sm:mb-4">
                <span class="text-blue-600 text-base sm:text-lg">📋</span>
                <h2 class="text-base sm:text-lg font-semibold text-gray-800">All Batches</h2>
            </div>

            <div class="block lg:hidden space-y-3">
                
                <template v-if="loading">
                    <div v-for="i in 3" :key="'mob-skel-' + i" class="border rounded-lg p-3 animate-pulse space-y-3">
                        <div class="flex justify-between">
                            <div class="space-y-2 w-1/2">
                                <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                                <div class="h-4 bg-gray-300 rounded w-full"></div>
                            </div>
                            <div class="h-6 w-20 bg-gray-200 rounded-full"></div>
                        </div>
                        <div class="space-y-2">
                            <div class="h-3 bg-gray-200 rounded w-1/4"></div>
                            <div class="h-4 bg-gray-100 rounded w-3/4"></div>
                        </div>
                        <div class="grid grid-cols-2 gap-2">
                            <div class="h-10 bg-gray-50 rounded"></div>
                            <div class="h-10 bg-gray-50 rounded"></div>
                        </div>
                        <div class="h-8 bg-gray-100 rounded w-full mt-2"></div>
                    </div>
                </template>

                <template v-else-if="batches.length > 0">
                    <div v-for="(batch, index) in batches" :key="index"
                        class="border rounded-lg p-3 hover:bg-gray-50 transition shadow-sm">
                        
                        <div class="flex justify-between items-start mb-2">
                            <div class="flex-1">
                                <p class="text-xs text-gray-500 uppercase tracking-wider">Batch Code</p>
                                <p class="font-bold text-sm text-blue-700">{{ batch.code }}</p>
                            </div>
                            <span :class="[
                                'px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide',
                                batch.status === 'Completed'
                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                            ]">
                                {{ batch.status }}
                            </span>
                        </div>

                        <div class="space-y-2 mb-2">
                            <div>
                                <p class="text-xs text-gray-500">Batch Name</p>
                                <p class="text-sm font-medium text-gray-800">{{ batch.name }}</p>
                            </div>
                            
                            <div class="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-2 rounded-lg">
                                <div>
                                    <p class="text-[10px] text-gray-500 font-semibold uppercase">Input</p>
                                    <p class="font-bold text-gray-700">{{ batch.input }} <span class="text-[10px] font-normal">kg</span></p>
                                </div>
                                <div>
                                    <p class="text-[10px] text-gray-500 font-semibold uppercase">Output</p>
                                    <p class="font-bold text-gray-700">{{ batch.output ?? '—' }} <span class="text-[10px] font-normal">kg</span></p>
                                </div>
                            </div>

                            <div>
                                <p class="text-xs text-gray-500">Date</p>
                                <p class="text-sm text-gray-700">{{ batch.date }}</p>
                            </div>
                        </div>

                        <button class="w-full mt-2 text-blue-600 hover:bg-blue-50 border border-blue-100 rounded-lg py-2 flex items-center justify-center gap-2 text-sm transition font-medium"
                            @click="openDetails(batch.code)">
                            👁 View Full Details
                        </button>
                    </div>
                </template>

                <div v-else class="py-12 text-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p class="text-gray-400 text-sm">No batches found</p>
                </div>
            </div>

            <div class="hidden lg:block overflow-hidden border border-gray-100 rounded-lg">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 text-xs uppercase tracking-wider">
                            <th class="p-4 font-semibold">Batch Code</th>
                            <th class="p-4 font-semibold">Batch Name</th>
                            <th class="p-4 font-semibold">Input (kg)</th>
                            <th class="p-4 font-semibold">Output (kg)</th>
                            <th class="p-4 font-semibold">Date</th>
                            <th class="p-4 font-semibold">Status</th>
                            <th class="p-4 font-semibold text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody class="text-gray-700">

                        <template v-if="loading">
                            <tr v-for="i in 5" :key="'desk-skel-' + i" class="border-b animate-pulse">
                                <td class="p-4" v-for="j in 7" :key="j">
                                    <div class="h-4 bg-gray-100 rounded-md w-3/4"></div>
                                </td>
                            </tr>
                        </template>

                        <template v-else-if="batches.length > 0">
                            <tr v-for="(batch, index) in batches" :key="index"
                                class="border-b hover:bg-blue-50/30 transition group">
                                <td class="p-4 font-bold text-blue-700">{{ batch.code }}</td>
                                <td class="p-4 font-medium">{{ batch.name }}</td>
                                <td class="p-4 font-semibold text-gray-600">{{ batch.input }}</td>
                                <td class="p-4 font-semibold text-gray-600">{{ batch.output ?? '—' }}</td>
                                <td class="p-4 text-sm">{{ batch.date }}</td>

                                <td class="p-4">
                                    <span :class="[
                                        'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight border',
                                        batch.status === 'Completed'
                                            ? 'bg-green-50 text-green-700 border-green-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                    ]">
                                        {{ batch.status }}
                                    </span>
                                </td>

                                <td class="p-4 text-center">
                                    <button class="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center justify-center gap-1 w-full group-hover:scale-105 transition"
                                        @click="openDetails(batch.code)">
                                        👁 VIEW
                                    </button>
                                </td>
                            </tr>
                        </template>

                        <tr v-else>
                            <td colspan="7" class="p-12 text-center">
                                <div class="flex flex-col items-center">
                                    <span class="text-4xl mb-2 opacity-20">📁</span>
                                    <p class="text-gray-400 text-sm">No manufacturing batches found in the records.</p>
                                </div>
                            </td>
                        </tr>

                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";

const router = useRouter();
const batches = ref([]);
const loading = ref(false);

/**
 * Fetch batch list with artificial delay for testing loaders
 */
const fetchBatches = async () => {
    try {
        loading.value = true;
        
        // --- TEST DELAY: 10 Seconds ---
        // await new Promise(resolve => setTimeout(resolve, 10000));
        // ------------------------------

        const res = await api.get("/batch/batches");

        if (res.data.success) {
            batches.value = res.data.batches.map(batch => ({
                id: batch._id,
                code: batch.batchCode,
                name: batch.batchName,
                input: batch.inputKg,
                output: batch.outputKg,
                date: formatDate(batch.date),
                status: batch.status
            }));
        }
    } catch (error) {
        console.error("Error fetching batches:", error);
    } finally {
        loading.value = false;
    }
};

/**
 * Formats date into Indian standard format (DD MMM YYYY)
 */
const formatDate = (dateStr) => {
    if(!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/**
 * Navigates to Batch Details
 * Replaces slashes with dashes to prevent routing issues
 */
const openDetails = (batchCode) => {
    if (!batchCode) return;
    const safeCode = batchCode.replace(/\//g, "-");
    router.push({
        name: "batch-details",
        params: { id: safeCode }
    });
};

/* Component Initialization */
onMounted(fetchBatches);
</script>

<style scoped>
/* Smooth transition for skeleton loaders */
.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: .5; }
}

/* Custom scrollbar for desktop table */
::-webkit-scrollbar {
    height: 6px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
    background: #cbd5e1;
}
</style>