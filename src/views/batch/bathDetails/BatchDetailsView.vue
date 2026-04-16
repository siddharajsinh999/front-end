<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-5xl mx-auto space-y-4 sm:space-y-6">

      <!-- ================= LOADING ================= -->
      <div v-if="loading" class="text-center py-12 sm:py-20 text-gray-500 text-sm sm:text-base">
        Loading batch details...
      </div>

      <!-- ================= BATCH OVERVIEW ================= -->
      <div
        v-else-if="batch"
        class="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 border border-gray-100"
      >
        <!-- Header -->
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div class="flex items-center gap-2">
            <div class="bg-blue-100 text-blue-600 p-2 rounded-lg text-sm sm:text-base">📦</div>
            <h2 class="text-base sm:text-lg font-semibold text-gray-800">Batch Overview</h2>
          </div>

          <span
            class="px-3 py-1 text-xs sm:text-sm rounded-full whitespace-nowrap"
            :class="
              batch.status === 'Completed'
                ? 'bg-green-100 text-green-600'
                : 'bg-yellow-100 text-yellow-600'
            "
          >
            {{ batch.status }}
          </span>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">

          <!-- Batch Code -->
          <div class="flex items-center gap-3 sm:gap-4 bg-blue-50 p-4 sm:p-5 rounded-lg sm:rounded-xl">
            <div class="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-lg text-base sm:text-lg flex-shrink-0">#</div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm text-gray-500">Batch Code</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {{ batch.batchCode }}
              </p>
            </div>
          </div>

          <!-- Batch Name -->
          <div class="flex items-center gap-3 sm:gap-4 bg-purple-50 p-4 sm:p-5 rounded-lg sm:rounded-xl">
            <div class="bg-purple-100 text-purple-600 p-2 sm:p-3 rounded-lg text-base sm:text-lg flex-shrink-0">🧪</div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm text-gray-500">Batch Name</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {{ batch.batchName }}
              </p>
            </div>
          </div>

          <!-- Input Quantity -->
          <div class="flex items-center gap-3 sm:gap-4 bg-yellow-50 p-4 sm:p-5 rounded-lg sm:rounded-xl">
            <div class="bg-yellow-100 text-yellow-600 p-2 sm:p-3 rounded-lg text-base sm:text-lg flex-shrink-0">📥</div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm text-gray-500">Input Quantity</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ batch.inputKg }} kg
              </p>
            </div>
          </div>

          <!-- Output Quantity -->
          <div class="flex items-center gap-3 sm:gap-4 bg-green-50 p-4 sm:p-5 rounded-lg sm:rounded-xl">
            <div class="bg-green-100 text-green-600 p-2 sm:p-3 rounded-lg text-base sm:text-lg flex-shrink-0">📤</div>
            <div class="min-w-0">
              <p class="text-xs sm:text-sm text-gray-500">Output Quantity</p>
              <p class="font-semibold text-gray-800 text-sm sm:text-base">
                {{ batch.outputKg }} kg
              </p>
            </div>
          </div>
        </div>

        <!-- Footer Date -->
        <div class="mt-4 sm:mt-6 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
          <span>📅</span>
          <span>
            Created on
            {{
              new Date(batch.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric"
              })
            }}
          </span>
        </div>
      </div>

      <!-- ================= MATERIAL BREAKDOWN ================= -->
      <div
        v-if="batch"
        class="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-md p-4 sm:p-6"
      >
        <!-- Header -->
        <div class="flex items-center gap-2 mb-4 sm:mb-5 text-gray-900">
          <div class="bg-blue-100 p-2 rounded-lg text-blue-600 text-sm sm:text-base">🧪</div>
          <h2 class="text-base sm:text-lg font-semibold">Material Breakdown</h2>
        </div>

        <!-- Mobile Card View -->
        <div class="block lg:hidden space-y-3">
          <!-- Material Cards -->
          <div
            v-for="item in batch.usedMaterials"
            :key="item.material._id"
            class="border border-gray-200 rounded-lg p-3 space-y-2"
          >
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-2 min-w-0 flex-1">
                <span class="text-sm flex-shrink-0">🧪</span>
                <p class="font-semibold text-sm text-gray-800 truncate">
                  {{ item.material.name }}
                </p>
              </div>
              <span class="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 whitespace-nowrap flex-shrink-0">
                {{ item.unit.toUpperCase() }}
              </span>
            </div>
            
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-500">Quantity:</span>
              <span class="font-medium text-gray-800">{{ item.quantity }}</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="!batch.usedMaterials.length" class="text-center py-8 text-gray-400 text-sm">
            No materials added
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden lg:block overflow-hidden rounded-xl border border-gray-200">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="text-left px-5 py-3">Material Name</th>
                <th class="text-left px-5 py-3">Quantity</th>
                <th class="text-left px-5 py-3">Unit</th>
                <th class="text-left px-5 py-3">Remarks</th>
              </tr>
            </thead>

            <tbody class="divide-y">
              <tr
                v-for="item in batch.usedMaterials"
                :key="item.material._id"
              >
                <td class="px-5 py-4 flex items-center gap-2">
                  🧪 {{ item.material.name }}
                </td>

                <td class="px-5 py-4">
                  {{ item.quantity }}
                </td>

                <td class="px-5 py-4">
                  <span class="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600">
                    {{ item.unit.toUpperCase() }}
                  </span>
                </td>

                <td class="px-5 py-4 text-gray-400">—</td>
              </tr>

              <!-- Empty State -->
              <tr v-if="!batch.usedMaterials.length">
                <td colspan="4" class="px-5 py-6 text-center text-gray-400">
                  No materials added
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import api from "@/services/api";

const route = useRoute();

const loading = ref(false);
const batch = ref(null);

const getBatchDetails = async () => {
  try {
    loading.value = true;

    let batchCode = route.params.id;

    // Convert format: 2026-0002 → 2026/0002
    if (batchCode && batchCode.includes("-")) {
      batchCode = batchCode.replace("-", "/");
    }

    const res = await api.get("/batch/batches", {
      params: { batchCode }
    });

    if (res.data.success) {
      batch.value = res.data.batch;
    }
  } catch (error) {
    console.error("Error fetching batch:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getBatchDetails();
});
</script>