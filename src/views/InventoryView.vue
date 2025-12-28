<template>
  <div class="p-4 sm:p-6 lg:p-8 w-full">

    <!-- Header -->
    <div class="mb-6 sm:mb-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-semibold">Stock Management</h1>
          <p class="text-gray-500 text-xs sm:text-sm">Track and update product batches easily</p>
        </div>

        <!-- Search + Add New Stock -->
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
          <input v-model="search" type="text" placeholder="Search product..."
            class="w-full sm:w-64 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-purple-500 text-sm" />

          <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full whitespace-nowrap text-sm sm:text-base" 
            @click="addNewStock()">
            + Add New Stock
          </button>
        </div>
      </div>
    </div>

    <!-- Product List -->
    <div class="space-y-4 sm:space-y-6">
      <div v-for="item in filteredProducts" :key="item.id"
        class="bg-white shadow rounded-xl sm:rounded-2xl overflow-hidden">
        
        <!-- Mobile Layout -->
        <div class="block lg:hidden p-4 space-y-3">
          <!-- Product Info -->
          <div class="flex items-start gap-3">
            <img :src="item.image" class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover flex-shrink-0" />
            
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-medium truncate">{{ item.name }}</h2>
              <p class="text-gray-500 text-xs sm:text-sm flex items-center gap-1 flex-wrap">
                <Icon icon="tabler:box" class="w-3 h-3 sm:w-4 sm:h-4" />
                {{ item.size }}
              </p>
              <p class="text-xs sm:text-sm text-gray-600 mt-1">
                Stock: <span class="font-bold">{{ item.stock }} Bottles</span>
              </p>
            </div>

            <!-- Status Badge -->
            <span :class="[
              'px-2 py-1 rounded-full text-xs whitespace-nowrap',
              item.stock > 80
                ? 'bg-green-100 text-green-700'
                : item.stock > 20
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            ]">
              {{ getStatus(item.stock) }}
            </span>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2">
            <button class="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full text-sm"
              @click="openAddStockModel(item.id)">
              Add Stock
            </button>

            <button class="flex-1 px-3 py-2 bg-transparent border border-gray-300 text-black rounded-full hover:bg-gray-100 text-sm"
              @click="openDispatchModel(item.id)">
              Dispatch Items
            </button>
          </div>

          <button class="w-full text-purple-600 hover:underline underline-offset-1 text-sm" 
            @click="openViewDetails(item.id)">
            View Details
          </button>
        </div>

        <!-- Desktop Layout -->
        <div class="hidden lg:flex items-center justify-between p-4">
          <!-- Left -->
          <div class="flex items-center gap-4">
            <img :src="item.image" class="w-20 h-20 rounded-xl object-cover" />

            <div>
              <h2 class="text-lg font-medium">{{ item.name }}</h2>
              <p class="text-gray-500 text-sm flex items-center gap-1">
                <Icon icon="tabler:box" class="w-4 h-4" />
                {{ item.size }}
                <span class="ml-2">Stock:</span>
                <span class="text-[14px] font-bold">{{ item.stock }} Bottles</span>
              </p>
            </div>
          </div>

          <!-- Right -->
          <div class="flex items-center gap-4">
            <span :class="[
              'px-3 py-1 rounded-full text-sm',
              item.stock > 80
                ? 'bg-green-100 text-green-700'
                : item.stock > 20
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
            ]">
              {{ getStatus(item.stock) }}
            </span>

            <button class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full"
              @click="openAddStockModel(item.id)">
              Add Stock
            </button>

            <button class="px-4 py-2 bg-transparent border text-black rounded-full hover:bg-[#d5dbd6]"
              @click="openDispatchModel(item.id)">
              Dispatch Items
            </button>

            <span class="text-purple-600 hover:underline underline-offset-1 cursor-pointer" 
              @click="openViewDetails(item.id)">
              view details
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 sm:mt-12 text-center bg-white p-4 sm:p-6 shadow rounded-xl text-gray-700">
      <div class="py-2">
        <p class="font-semibold text-base sm:text-lg">Total Products</p>
        <p class="text-purple-600 font-bold text-xl sm:text-2xl">{{ products.length }}</p>
      </div>
      <div class="py-2 border-t sm:border-t-0 sm:border-l border-gray-200">
        <p class="font-semibold text-base sm:text-lg">Total Bottles in Inventory</p>
        <p class="text-purple-600 font-bold text-xl sm:text-2xl">{{ totalInventory }}</p>
      </div>
      <div class="py-2 border-t sm:border-t-0 sm:border-l border-gray-200">
        <p class="font-semibold text-base sm:text-lg">Low Stock</p>
        <p class="text-red-500 font-bold text-xl sm:text-2xl">{{ lowStockCount }}</p>
      </div>
    </div>
  </div>

  <!-- Add stock model -->
  <el-dialog v-model="addStockModel" :width="dialogWidth" :show-close="true" class="!rounded-2xl">
    <!-- Title -->
    <template #title>
      <span class="text-lg sm:text-[20px] font-semibold">Add Stock</span>
    </template>

    <!-- Product Title -->
    <div class="mb-4">
      <p class="text-sm sm:text-[16px] font-medium">
        {{ selectedProduct?.name }}
        <span class="text-gray-400 text-xs sm:text-[14px] block sm:inline mt-1 sm:mt-0">
          • Current Stock: {{ selectedProduct?.stock }} Bottles
        </span>
      </p>
    </div>

    <!-- Quantity -->
    <div class="mb-4">
      <label class="text-xs sm:text-[14px] font-semibold">Quantity (Bottles)</label>
      <el-input v-model="addStockQantity" placeholder="Enter quantity" class="mt-1 custom-input" />
    </div>

    <!-- Date -->
    <div class="mb-4 flex flex-col add-stock-date">
      <label class="text-xs sm:text-[14px] font-semibold mb-1">Date</label>
      <el-date-picker v-model="addStockDate" type="date" placeholder="Select date" class="w-full custom-date-picker" />
    </div>

    <!-- Notes -->
    <div class="mb-4">
      <label class="text-xs sm:text-[14px] font-semibold">Notes</label>
      <el-input v-model="addStokNote" type="textarea" placeholder="Add any notes or remarks…" autosize
        class="mt-1 custom-input" />
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-2 sm:gap-3">
        <el-button @click="addStockModel = false" class="!px-4 sm:!px-6 !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base">
          Cancel
        </el-button>
        <el-button type="primary" class="!bg-purple-600 hover:!bg-purple-700 !px-6 sm:!px-8 !text-white !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base"
          @click="saveStock">
          Confirm
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Dispatch Items Modal -->
  <el-dialog v-model="dispatchModel" :width="dialogWidth" :show-close="true" class="!rounded-2xl">
    <!-- Title -->
    <template #title>
      <span class="text-lg sm:text-[20px] font-semibold">Dispatch Items</span>
    </template>

    <!-- Product Title -->
    <div class="mb-4">
      <p class="text-sm sm:text-[16px] font-medium">
        {{ selectedProduct?.name }}
        <span class="text-gray-400 text-xs sm:text-[14px] block sm:inline mt-1 sm:mt-0">
          • Current Stock: {{ selectedProduct?.stock }} Bottles
        </span>
      </p>
    </div>

    <!-- Quantity -->
    <div class="mb-4">
      <label class="text-xs sm:text-[14px] font-semibold">Quantity to Dispatch (Bottles)</label>
      <el-input v-model="dispatchQuantity" placeholder="Enter quantity to dispatch" class="mt-1 custom-input" />
    </div>

    <!-- Customer / Notes -->
    <div class="mb-4">
      <label class="text-xs sm:text-[14px] font-semibold">Customer / Notes</label>
      <el-input v-model="dispatchNotes" type="textarea" placeholder="Enter customer name or notes…" autosize
        class="mt-1 custom-input" />
    </div>

    <!-- Date -->
    <div class="mb-4 flex flex-col">
      <label class="text-xs sm:text-[14px] font-semibold mb-1">Dispatch Date</label>
      <el-date-picker v-model="dispatchDate" type="date" placeholder="Select date" class="w-full custom-date-picker" />
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end gap-2 sm:gap-3">
        <el-button @click="dispatchModel = false" class="!px-4 sm:!px-6 !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base">
          Cancel
        </el-button>
        <el-button type="primary" class="!bg-red-600 hover:!bg-red-700 !px-6 sm:!px-8 !text-white !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base"
          @click="confirmDispatch">
          Dispatch
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- View Details Modal -->
  <el-dialog v-model="viewDetailsModel" :width="detailsDialogWidth" :show-close="true" class="!rounded-2xl">
    <!-- Title -->
    <template #title>
      <span class="text-lg sm:text-[20px] font-semibold">Product Details</span>
    </template>

    <!-- Product Info -->
    <div class="mb-4 sm:mb-6">
      <p class="text-sm sm:text-[16px] font-medium">
        {{ selectedProduct?.name }}
        <span class="text-gray-400 text-xs sm:text-[14px] block sm:inline mt-1 sm:mt-0">
          • Current Stock: {{ selectedProduct?.stock }} Bottles
        </span>
      </p>
    </div>

    <!-- Activity Logs -->
    <div class="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
      <ul class="space-y-2 sm:space-y-3">
        <li v-for="(log, index) in productLogs" :key="index"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-gray-50 rounded-lg sm:rounded-xl shadow-sm gap-2">
          <div class="flex-1">
            <p class="text-xs sm:text-sm font-medium">
              {{ log.type === 'add' ? 'Stock Added' : 'Dispatched' }}
              <span class="text-gray-400 font-normal text-xs">on {{ log.date }}</span>
            </p>
            <p class="text-gray-500 text-xs sm:text-sm mt-1">{{ log.notes }}</p>
          </div>
          <div class="text-left sm:text-right">
            <span :class="[
              'px-2 py-1 rounded-full text-xs font-semibold inline-block',
              log.type === 'add' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            ]">
              {{ log.quantity }} Bottles
            </span>
          </div>
        </li>
      </ul>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex justify-end">
        <el-button @click="viewDetailsModel = false" class="!px-4 sm:!px-6 !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base">
          Close
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Addnew stock model -->
  <AddNewStockModel v-model="isAddNewStock" @saved="fetchStockList" />
</template>

<script setup>
import { ref, computed } from "vue";
import { Icon } from '@iconify/vue';
import AddNewStockModel from "@/components/AddNewStockModel.vue";

import api from "@/services/api";
import { onMounted } from "vue";

const search = ref("");
const addStockModel = ref(false)
const addStokNote = ref("")
const addStockQantity = ref()
const addStockDate = ref()
const isAddNewStock = ref(false)
const dispatchModel = ref(false)
const dispatchQuantity = ref()
const dispatchNotes = ref("")
const dispatchDate = ref()
const products = ref([]);
const selectedProduct = ref(null);

const viewDetailsModel = ref(false)
const productLogs = ref([
  { type: 'add', quantity: 10, date: '2025-12-01', notes: 'New stock received' },
  { type: 'dispatch', quantity: 5, date: '2025-12-02', notes: 'Dispatched to customer ABC' },
  { type: 'add', quantity: 15, date: '2025-12-03', notes: 'Restocked' },
  { type: 'dispatch', quantity: 7, date: '2025-12-04', notes: 'Dispatched to customer XYZ' },
])

// Responsive dialog widths
const dialogWidth = computed(() => {
  if (typeof window === 'undefined') return '480px';
  return window.innerWidth < 640 ? '90%' : '480px';
});

const detailsDialogWidth = computed(() => {
  if (typeof window === 'undefined') return '600px';
  return window.innerWidth < 640 ? '90%' : '600px';
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

const openViewDetails = async (id) => {
  selectedProduct.value = products.value.find(p => p.id === id);
  viewDetailsModel.value = true;
  await fetchProductHistory();
};

const fetchProductHistory = async () => {
  if (!selectedProduct.value) return;

  try {
    const productId = selectedProduct.value.productId;
    const type = reverseFormatType(selectedProduct.value.size);

    const res = await api.get(
      `/stock/history/${productId}?type=${type}`
    );

    productLogs.value = res.data.map(item => ({
      type: item.action === "ADD" ? "add" : "dispatch",
      quantity: item.quantity,
      date: formatDate(item.date),
      notes: item.notes || item.customer || "-"
    }));
  } catch (error) {
    console.error("Failed to fetch stock history", error);
  }
};

const openDispatchModel = (id) => {
  selectedProduct.value = products.value.find(p => p.id === id);
  dispatchQuantity.value = "";
  dispatchNotes.value = "";
  dispatchDate.value = "";
  dispatchModel.value = true;
};

const confirmDispatch = async () => {
  if (!dispatchQuantity.value || !dispatchDate.value) {
    return alert("Please fill all required fields");
  }

  try {
    const payload = {
      productId: selectedProduct.value.productId,
      type: reverseFormatType(selectedProduct.value.size),
      quantity: Number(dispatchQuantity.value),
      customer: dispatchNotes.value || "Walk-in",
      notes: dispatchNotes.value || "",
      date: dispatchDate.value,
    };

    const res = await api.post("/stock/dispatch", payload);

    if (res.status === 200) {
      console.log("Stock dispatched successfully");
      dispatchModel.value = false;
      fetchStockList();
    }
  } catch (error) {
    console.error("Dispatch failed", error);
    alert("Failed to dispatch stock");
  }
};

// Filtered search list
const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

// Status text logic
const getStatus = (stock) => {
  if (stock > 80) return "In Stock";
  if (stock > 20) return "Low Stock";
  return "Very Low";
};

// Footer stats
const totalInventory = computed(() =>
  products.value.reduce((sum, item) => sum + item.stock, 0)
);

const lowStockCount = computed(() =>
  products.value.filter((item) => item.stock < 20).length
);

const reverseFormatType = (size) => {
  return size
    .toLowerCase()
    .replace(" ", "_")
    .replace("ml", "ml")
    .replace("liter", "liter");
};

// Add stock model
const openAddStockModel = (id) => {
  selectedProduct.value = products.value.find(p => p.id === id);

  addStockQantity.value = "";
  addStockDate.value = "";
  addStokNote.value = "";

  addStockModel.value = true;
};

// save stock
const saveStock = async () => {
  console.log("selectd product",selectedProduct.value)
  if (!addStockQantity.value || !addStockDate.value) {
    return alert("Please fill all required fields");
  }

  try {
    const payload = {
      productId: selectedProduct.value.productId,
      type: reverseFormatType(selectedProduct.value.size),
      quantity: Number(addStockQantity.value),
      notes: addStokNote.value || "",
      date: addStockDate.value,
      bottleId: selectedProduct.value.bottleId
    };

    const res = await api.post("/stock/add", payload);

    if (res.status === 200 || res.data?.success) {
      console.log("Stock added successfully");
      addStockModel.value = false;
      fetchStockList();
    }
  } catch (error) {
    console.error("Add stock failed", error);
    alert("Failed to add stock");
  }
};

// AddNewStock
const addNewStock = () => {
  isAddNewStock.value = true
}

onMounted(() => {
  fetchStockList();
});

const formatType = (type) => {
  return type
    .replace("_", " ")
    .replace("ml", "ML")
    .replace("liter", "Liter");
};

const prepareImageLink = (image) => {
  return `http://localhost:5000${image}`
}

const fetchStockList = async () => {
  try {
    const res = await api.get("/stock");
    console.log("RES DATA:-",res.data)
    products.value = res.data.map((item) => ({
      id: item._id,
      productId: item.product._id,
      name: item.product.name,
      size: formatType(item.type),
      stock: item.quantity,
      minLevel: item.minLevel,
      image: prepareImageLink(item?.image),
      date: item.date,
      bottleId: item.bottle,
    }));
  } catch (error) {
    console.error("Failed to fetch stock list", error);
  }
};
</script>

<style scoped></style>