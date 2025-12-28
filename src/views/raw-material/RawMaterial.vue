<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md px-4 sm:px-6 py-3 sm:py-4">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <h2 class="text-lg sm:text-xl font-semibold text-gray-800">
          Stock Management
        </h2>

        <!-- Navigation Tabs -->
        <nav class="flex gap-2 flex-wrap w-full sm:w-auto">
          <button
            v-for="tab in tabs"
            :key="tab"
            @click="activeTab = tab"
            :class="[
              'px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap',
              activeTab === tab
                ? 'bg-purple-600 text-white shadow'
                : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
            ]">
            {{ tab }}
          </button>
        </nav>
      </div>

      <!-- Mobile: Secondary Navigation (Alternative Design) -->
      <!-- Uncomment if you prefer dropdown on very small screens -->
      <!--
      <div class="block sm:hidden mt-3">
        <select 
          v-model="activeTab"
          class="w-full px-4 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option v-for="tab in tabs" :key="tab" :value="tab">
            {{ tab }}
          </option>
        </select>
      </div>
      -->
    </header>

    <!-- Content -->
    <main class="p-4 sm:p-6">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import Material from "@/components/raw-material/Material.vue"
import EmptyBottles from "@/components/raw-material/EmptyBottles.vue"
import OtherMaterials from "@/components/raw-material/OtherMaterials.vue"

const tabs = [
  "Material",
  "Empty Bottles",
  "Other Materials",
];

const activeTab = ref("Material");

const currentComponent = computed(() => {
  switch (activeTab.value) {
    case "Material":
      return Material;
    case "Empty Bottles":
      return EmptyBottles;
    case "Other Materials":
      return OtherMaterials;
    default:
      return Material;
  }
});
</script>