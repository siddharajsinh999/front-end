<template>
    <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">

        <!-- Header -->
        <div>
            <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center gap-2">
                <span class="w-8 h-8 sm:w-9 sm:h-9 bg-blue-600 text-white grid place-items-center rounded-lg sm:rounded-xl text-sm sm:text-base">📦</span>
                Batch Module
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">Manage and monitor manufacturing batches</p>
        </div>

        <!-- Tabs + Add Button -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mt-4 sm:mt-6 gap-3">
            <div class="flex gap-2 sm:gap-3">
                <button class="px-3 sm:px-4 py-2 rounded-full bg-blue-600 text-white shadow text-sm">
                    All Batches
                </button>
            </div>

            <router-link :to="{ name: 'new-batch' }" class="w-full sm:w-auto">
                <button
                    class="w-full sm:w-auto px-4 sm:px-5 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow transition flex items-center justify-center gap-2 text-sm sm:text-base">
                    <span class="text-lg">+</span>
                    Add Batch
                </button>
            </router-link>
        </div>

        <!-- Table Card -->
        <div class="bg-white shadow rounded-lg sm:rounded-xl p-4 sm:p-5 mt-4 sm:mt-6">

            <!-- Title -->
            <div class="flex items-center gap-2 mb-3 sm:mb-4">
                <span class="text-blue-600 text-base sm:text-lg">📋</span>
                <h2 class="text-base sm:text-lg font-semibold text-gray-800">All Batches</h2>
            </div>

            <!-- Mobile Card View -->
            <div class="block lg:hidden space-y-3">
                <!-- Loading State -->
                <div v-if="loading" class="p-4 text-center text-gray-500 text-sm">
                    Loading batches...
                </div>

                <!-- Empty State -->
                <div v-else-if="!loading && batches.length === 0" class="p-4 text-center text-gray-500 text-sm">
                    No batches found
                </div>

                <!-- Data Cards -->
                <div v-else v-for="(batch, index) in batches" :key="index"
                    class="border rounded-lg p-3 hover:bg-gray-50 transition">
                    
                    <!-- Header Row -->
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex-1">
                            <p class="text-xs text-gray-500">Batch Code</p>
                            <p class="font-semibold text-sm">{{ batch.code }}</p>
                        </div>
                        <span :class="[
                            'px-2 py-1 rounded-full text-xs whitespace-nowrap',
                            batch.status === 'Completed'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-blue-100 text-blue-600'
                        ]">
                            {{ batch.status }}
                        </span>
                    </div>

                    <!-- Batch Details -->
                    <div class="space-y-1.5 mb-2">
                        <div>
                            <p class="text-xs text-gray-500">Batch Name</p>
                            <p class="text-sm font-medium">{{ batch.name }}</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <p class="text-xs text-gray-500">Input</p>
                                <p class="font-medium">{{ batch.input }} kg</p>
                            </div>
                            <div>
                                <p class="text-xs text-gray-500">Output</p>
                                <p class="font-medium">{{ batch.output ?? '—' }} kg</p>
                            </div>
                        </div>

                        <div>
                            <p class="text-xs text-gray-500">Date</p>
                            <p class="text-sm">{{ batch.date }}</p>
                        </div>
                    </div>

                    <!-- Action Button -->
                    <button class="w-full mt-2 text-blue-600 hover:underline flex items-center justify-center gap-1 text-sm py-1"
                        @click="openDetails(batch.code)">
                        👁 View Details
                    </button>
                </div>
            </div>

            <!-- Desktop Table View -->
            <div class="hidden lg:block overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-100 text-gray-600 text-sm">
                            <th class="p-3">Batch Code</th>
                            <th class="p-3">Batch Name</th>
                            <th class="p-3">Input (kg)</th>
                            <th class="p-3">Output (kg)</th>
                            <th class="p-3">Date</th>
                            <th class="p-3">Status</th>
                            <th class="p-3">Action</th>
                        </tr>
                    </thead>

                    <tbody class="text-gray-700">

                        <!-- Loading State -->
                        <tr v-if="loading">
                            <td colspan="7" class="p-4 text-center text-gray-500">
                                Loading batches...
                            </td>
                        </tr>

                        <!-- Empty State -->
                        <tr v-else-if="!loading && batches.length === 0">
                            <td colspan="7" class="p-4 text-center text-gray-500">
                                No batches found
                            </td>
                        </tr>

                        <!-- Data Rows -->
                        <tr v-else v-for="(batch, index) in batches" :key="index"
                            class="border-b hover:bg-gray-50 transition">
                            <td class="p-3">{{ batch.code }}</td>
                            <td class="p-3">{{ batch.name }}</td>
                            <td class="p-3">{{ batch.input }}</td>
                            <td class="p-3">{{ batch.output ?? '—' }}</td>
                            <td class="p-3">{{ batch.date }}</td>

                            <td class="p-3">
                                <span :class="[
                                    'px-3 py-1 rounded-full text-sm',
                                    batch.status === 'Completed'
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-blue-100 text-blue-600'
                                ]">
                                    {{ batch.status }}
                                </span>
                            </td>

                            <td class="p-3">
                                <button class="text-blue-600 hover:underline flex items-center gap-1"
                                    @click="openDetails(batch.code)">
                                    👁 View
                                </button>
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

/* Fetch batch list */
const fetchBatches = async () => {
    try {
        loading.value = true;
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

/* Date formatter */
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
};

/* Navigate to batch details */
const openDetails = (batchCode) => {
    const safeCode = batchCode.replace("/", "-");
    router.push({
        name: "batch-details",
        params: { id: safeCode }
    });
};

/* Load on mount */
onMounted(fetchBatches);
</script>

<style scoped>
/* Optional future styling */
</style>