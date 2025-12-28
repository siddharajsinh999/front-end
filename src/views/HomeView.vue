<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
    <div class="max-w-7xl mx-auto space-y-4 sm:space-y-6">

      <!-- ================= HEADER ================= -->
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-500">Overview of stocks, bottles and batches</p>
      </div>

      <!-- ================= TOP SUMMARY CARDS ================= -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">

        <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="flex-1">
            <p class="text-xs sm:text-sm text-gray-500">Total Products</p>
            <p class="text-lg sm:text-2xl font-bold">{{ totalProduct }}</p>
          </div>
          <div class="bg-blue-100 text-blue-600 p-2 sm:p-3 rounded-full text-sm sm:text-base">📦</div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="flex-1">
            <p class="text-xs sm:text-sm text-gray-500">Empty Bottles</p>
            <p class="text-lg sm:text-2xl font-bold">{{ totalEmptyBottle }}</p>
          </div>
          <div class="bg-green-100 text-green-600 p-2 sm:p-3 rounded-full text-sm sm:text-base">🧴</div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="flex-1">
            <p class="text-xs sm:text-sm text-gray-500">Total Output</p>
            <p class="text-lg sm:text-2xl font-bold">{{ totalOutput }} KG</p>
          </div>
          <div class="bg-purple-100 text-purple-600 p-2 sm:p-3 rounded-full text-sm sm:text-base">⚗️</div>
        </div>

        <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div class="flex-1">
            <p class="text-xs sm:text-sm text-gray-500">Finished Stock</p>
            <p class="text-lg sm:text-2xl font-bold">{{ totalStockQuantity }}</p>
          </div>
          <div class="bg-orange-100 text-orange-600 p-2 sm:p-3 rounded-full text-sm sm:text-base">✅</div>
        </div>

      </div>

      <!-- ================= CHART + BOTTLE STOCK ================= -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

        <!-- Chart -->
        <div class="lg:col-span-2 bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border">
          <h2 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Stock Usage Overview</h2>

          <apexchart height="300" type="area" :options="chartOptions" :series="series" />
        </div>

        <!-- Bottle Stock -->
        <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border">
          <h2 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Empty Bottle Stock</h2>

          <div v-for="bottle in bottleStock" :key="bottle.name"
            class="flex justify-between items-center py-2 sm:py-3 border-b last:border-0">
            <p class="text-sm sm:text-base">{{ bottle.name }}</p>
            <span class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm bg-blue-100 text-blue-600">
              {{ bottle.qty }}
            </span>
          </div>
        </div>

      </div>


      <!-- ================= ALL BATCH OVERVIEW ================= -->
      <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow border overflow-hidden">
        <h2 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4">All Batches Overview</h2>

        <!-- Mobile: Card View -->
        <div class="block lg:hidden space-y-3">
          <div v-for="batch in batches" :key="batch.code" 
            class="border rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-start">
              <div>
                <p class="text-xs text-gray-500">Batch Code</p>
                <p class="font-semibold">{{ batch.code }}</p>
              </div>
              <el-tag :type="batch.status === 'Completed' ? 'success' : 'warning'" size="small">
                {{ batch.status }}
              </el-tag>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p class="text-xs text-gray-500">Product</p>
                <p class="font-medium">{{ batch.name }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Input</p>
                <p class="font-medium">{{ batch.input }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Output</p>
                <p class="font-medium">{{ batch.output }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Desktop: Table View -->
        <div class="hidden lg:block overflow-x-auto">
          <el-table :data="batches" style="width: 100%">
            <el-table-column prop="code" label="Batch Code" />
            <el-table-column prop="name" label="Product" />
            <el-table-column prop="input" label="Input (KG)" />
            <el-table-column prop="output" label="Output (KG)" />
            <el-table-column label="Status">
              <template #default="scope">
                <el-tag :type="scope.row.status === 'Completed' ? 'success' : 'warning'">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import api from "@/services/api";
import { onMounted } from "vue";

const totalProduct = ref()
const totalEmptyBottle = ref()
const totalOutput = ref()
const totalStockQuantity = ref()

const bottleStock = ref([
  { name: "5 Litre Jar", qty: 80 },
  { name: "1 Litre Bottle", qty: 120 },
  { name: "Handwash 500ml", qty: 110 },
  { name: "Glass Cleaner", qty: 80 },
])

const batches = ref([
  { code: "01/2025", name: "Black Phenyl", input: "15kg", output: "15kg", status: "Completed" },
  { code: "02/2025", name: "Floor Cleaner", input: "20kg", output: "18kg", status: "Processing" },
  { code: "03/2025", name: "Toilet Cleaner", input: "25kg", output: "25kg", status: "Completed" },
])

const series = ref([
  {
    name: "Stock",
    data: [10, 25, 18, 35, 50, 38, 60],
  },
])

const chartOptions = ref({
  chart: {
    toolbar: { show: false },
  },
  stroke: {
    curve: "smooth",
    width: 3,
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
})

const fetchDashbord = async () => {
  const res = await api.get("/home/dashbord");
  console.log("RES;-",res)
  if (res.status === 200) {
    const data = res.data.data
    totalProduct.value = data.totalProducts
    totalEmptyBottle.value = data.totalEmptyBottles
    totalOutput.value = data.totalOutputKg
    totalStockQuantity.value = data.totalStockQuantity
  }
}

onMounted(() => {
  fetchDashbord();
});
</script>