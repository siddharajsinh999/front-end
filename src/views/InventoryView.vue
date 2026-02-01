<template>
  <CommonLoader :show="isLoading" text="Loading stock data..." />

  <div v-show="!isLoading" class="p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">

    <div class="mb-6 sm:mb-10">
      <div class="flex flex-col md:flex-row md:justify-between md:items-end gap-6">
        <div class="space-y-1">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Stock Management</h1>
          <p class="text-gray-500 text-sm">Track, update, and dispatch product batches.</p>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 sm:min-w-[240px]">
            <Icon icon="tabler:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input v-model="search" type="text" placeholder="Search product..."
              class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all outline-none" />
          </div>

          <div class="flex items-center gap-2">
            <button
              :disabled="exporting"
              class="flex-1 sm:flex-none px-4 py-2.5 bg-green-50 text-green-700 border border-green-100 hover:bg-green-600 hover:text-white rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              @click="exportToExcel">
              <Icon :icon="exporting ? 'tabler:loader-2' : 'tabler:file-spreadsheet'" :class="['w-5 h-5', { 'animate-spin': exporting }]" />
              <span class="hidden sm:inline">Export</span>
            </button>

            <button
              class="flex-1 sm:flex-none px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-sm shadow-purple-200 font-medium transition-all active:scale-95 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
              @click="addNewStock()">
              <Icon icon="tabler:plus" class="w-5 h-5" />
              Add New Stock
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p class="text-gray-500 text-xs font-medium uppercase tracking-wider">Total Products</p>
        <p class="text-2xl font-bold text-gray-900 mt-1">{{ products.length }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p class="text-gray-500 text-xs font-medium uppercase tracking-wider">Inventory</p>
        <p class="text-2xl font-bold text-purple-600 mt-1">{{ totalInventory }}</p>
      </div>
      <div class="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm col-span-2 lg:col-span-1">
        <p class="text-gray-500 text-xs font-medium uppercase tracking-wider">Low Stock Alerts</p>
        <p class="text-2xl font-bold text-red-500 mt-1">{{ lowStockCount }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4">
      <div v-for="item in filteredProducts" :key="item.id"
        class="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl overflow-hidden group">
        
        <div class="p-4 sm:p-5">
          <div class="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
            
            <div class="flex items-center gap-4 flex-1">
              <div class="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                <img v-if="isValidImage(item.image)" :src="item.image" 
                  class="w-full h-full rounded-2xl object-cover border border-gray-100" />
                <div v-else class="w-full h-full rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
                  <Icon icon="tabler:bottle" class="w-8 h-8" />
                </div>
                <div :class="['absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white lg:hidden', getStatusClass(item.stock, 'bg')]"></div>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <h2 class="text-base sm:text-lg font-bold text-gray-900 truncate">{{ item.name }}</h2>
                  <span :class="['hidden lg:inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wide', getStatusClass(item.stock, 'badge')]">
                    {{ getStatus(item.stock) }}
                  </span>
                </div>
                <div class="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span class="flex items-center gap-1">
                    <Icon icon="tabler:box" class="w-4 h-4 text-purple-500" /> {{ item.size }}
                  </span>
                  <span class="flex items-center gap-1 font-semibold text-gray-700">
                    <Icon icon="tabler:database" class="w-4 h-4 text-gray-400" /> {{ item.stock }} Bottles
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap lg:flex-nowrap items-center gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-gray-50">
              <button @click="openAddStockModel(item.id)"
                class="flex-1 lg:flex-none px-4 py-2.5 bg-purple-50 text-purple-700 hover:bg-purple-600 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Icon icon="tabler:circle-plus" class="w-4 h-4" /> Add
              </button>
              
              <button @click="openDispatchModel(item.id)"
                class="flex-1 lg:flex-none px-4 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-900 hover:text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                <Icon icon="tabler:truck-delivery" class="w-4 h-4" /> Dispatch
              </button>

              <button @click="openViewDetails(item.id)"
                class="w-full lg:w-auto px-4 py-2.5 text-purple-600 hover:text-purple-800 text-sm font-bold transition-all flex items-center justify-center gap-1">
                Details <Icon icon="tabler:chevron-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredProducts.length === 0" class="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
      <Icon icon="tabler:search-off" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900">No products found</h3>
      <p class="text-gray-500">Try adjusting your search query.</p>
    </div>
  </div>

  <el-dialog v-model="addStockModel" :width="dialogWidth" class="custom-modal">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <Icon icon="tabler:circle-plus" class="w-6 h-6" />
        </div>
        <span class="text-xl font-bold">Add Stock</span>
      </div>
    </template>
    <div class="space-y-5">
      <div class="bg-gray-50 p-3 rounded-xl">
        <p class="text-sm font-bold text-gray-900">{{ selectedProduct?.name }}</p>
        <p class="text-xs text-gray-500 mt-1">Current Balance: {{ selectedProduct?.stock }} Bottles</p>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-bold text-gray-700">Quantity (Bottles)</label>
        <el-input v-model="addStockQantity" type="number" placeholder="0" class="modern-input" />
      </div>
      <div class="space-y-1.5 flex flex-col">
        <label class="text-sm font-bold text-gray-700">Date Received</label>
        <el-date-picker v-model="addStockDate" type="date" placeholder="Select date" class="!w-full modern-date" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-bold text-gray-700">Notes</label>
        <el-input v-model="addStokNote" type="textarea" placeholder="Batch details, supplier, etc..." :rows="3" />
      </div>
    </div>
    <template #footer>
      <div class="flex gap-3">
        <button @click="addStockModel = false" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm">Cancel</button>
        <button @click="saveStock" class="flex-1 px-4 py-3 rounded-xl bg-purple-600 text-white font-bold text-sm">Confirm Update</button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="dispatchModel" :width="dialogWidth" class="custom-modal">
    <template #title>
      <div class="flex items-center gap-2">
        <div class="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
          <Icon icon="tabler:truck-delivery" class="w-6 h-6" />
        </div>
        <span class="text-xl font-bold">Dispatch Items</span>
      </div>
    </template>
    <div class="space-y-5">
      <div class="bg-red-50 p-3 rounded-xl">
        <p class="text-sm font-bold text-red-900">{{ selectedProduct?.name }}</p>
        <p class="text-xs text-red-600 mt-1">Available to Dispatch: {{ selectedProduct?.stock }} Bottles</p>
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-bold text-gray-700">Dispatch Quantity</label>
        <el-input v-model="dispatchQuantity" type="number" placeholder="0" />
      </div>
      <div class="space-y-1.5">
        <label class="text-sm font-bold text-gray-700">Customer Details / Reference</label>
        <el-input v-model="dispatchNotes" type="textarea" placeholder="Customer name, order ID..." :rows="2" />
      </div>
      <div class="space-y-1.5 flex flex-col">
        <label class="text-sm font-bold text-gray-700">Dispatch Date</label>
        <el-date-picker v-model="dispatchDate" type="date" placeholder="Select date" class="!w-full" />
      </div>
    </div>
    <template #footer>
      <div class="flex gap-3">
        <button @click="dispatchModel = false" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 font-bold text-sm">Cancel</button>
        <button @click="confirmDispatch" class="flex-1 px-4 py-3 rounded-xl bg-red-600 text-white font-bold text-sm transition-all active:scale-95">Complete Dispatch</button>
      </div>
    </template>
  </el-dialog>

  <el-dialog v-model="viewDetailsModel" :width="detailsDialogWidth" class="custom-modal">
    <template #title><span class="text-xl font-bold">Activity History</span></template>
    <div class="space-y-4">
      <div class="border-b border-gray-100 pb-4">
        <h4 class="font-bold text-gray-900">{{ selectedProduct?.name }}</h4>
        <p class="text-sm text-gray-500">{{ selectedProduct?.size }} • {{ selectedProduct?.stock }} In Stock</p>
      </div>
      <div class="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        <div v-if="productLogs.length" class="space-y-3">
          <div v-for="(log, index) in productLogs" :key="index" class="flex items-start gap-3 p-4 bg-gray-50 rounded-2xl">
            <div :class="['w-10 h-10 rounded-full flex flex-shrink-0 items-center justify-center', log.type === 'add' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600']">
              <Icon :icon="log.type === 'add' ? 'tabler:arrow-down-left' : 'tabler:arrow-up-right'" class="w-5 h-5" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex justify-between items-start">
                <p class="font-bold text-sm text-gray-900">{{ log.type === 'add' ? 'Stock Added' : 'Dispatched' }}</p>
                <p class="text-sm font-bold" :class="log.type === 'add' ? 'text-green-600' : 'text-red-600'">{{ log.type === 'add' ? '+' : '-' }}{{ log.quantity }}</p>
              </div>
              <p class="text-xs text-gray-500 mb-1">{{ log.date }}</p>
              <p class="text-sm text-gray-600 italic">"{{ log.notes }}"</p>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400">
          <Icon icon="tabler:history-off" class="w-10 h-10 mx-auto mb-2" />
          <p>No activity recorded yet.</p>
        </div>
      </div>
    </div>
  </el-dialog>

  <AddNewStockModel v-model="isAddNewStock" @saved="fetchStockList" />
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from '@iconify/vue';
import AddNewStockModel from "@/components/AddNewStockModel.vue";
import api from "@/services/api";
import CommonLoader from "@/components/common/CommonLoader.vue";
import axios from 'axios';

const search = ref("");
const addStockModel = ref(false);
const addStokNote = ref("");
const addStockQantity = ref();
const addStockDate = ref();
const isAddNewStock = ref(false);
const dispatchModel = ref(false);
const dispatchQuantity = ref();
const dispatchNotes = ref("");
const dispatchDate = ref();
const products = ref([]);
const selectedProduct = ref(null);
const isLoading = ref(true);
const exporting = ref(false);
const viewDetailsModel = ref(false);
const productLogs = ref([]);

// Responsive dialog widths
const dialogWidth = computed(() => {
  if (typeof window === 'undefined') return '480px';
  return window.innerWidth < 640 ? '94%' : '480px';
});

const detailsDialogWidth = computed(() => {
  if (typeof window === 'undefined') return '600px';
  return window.innerWidth < 640 ? '94%' : '600px';
});

const isValidImage = (img) => {
  if (!img) return false;
  return !(img.includes('null') || img.endsWith('5000') || img.includes('undefined'));
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
};

// EXPORT FUNCTION
const exportToExcel = async () => {
  try {
    exporting.value = true;
    const response = await api.get('/stock/export/excel', {
      responseType: 'blob' // Important for handling file downloads
    });

    // Create a blob from the response data
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Create a filename with current date
    const date = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `Stock_Inventory_Report_${date}.xlsx`);
    
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Export failed:", error);
    alert("Failed to export Excel report. Please try again.");
  } finally {
    exporting.value = false;
  }
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
    const res = await api.get(`/stock/history/${productId}?type=${type}`);
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
  dispatchDate.value = new Date();
  dispatchModel.value = true;
};

const confirmDispatch = async () => {
  if (!dispatchQuantity.value || !dispatchDate.value) {
    return alert("Please fill all required fields");
  }
  if (Number(dispatchQuantity.value) > selectedProduct.value.stock) {
    return alert("Insufficient stock for this dispatch");
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
      dispatchModel.value = false;
      fetchStockList();
    }
  } catch (error) {
    console.error("Dispatch failed", error);
    alert("Failed to dispatch stock");
  }
};

const filteredProducts = computed(() =>
  products.value.filter((p) =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const getStatus = (stock) => {
  if (stock > 80) return "In Stock";
  if (stock > 20) return "Low Stock";
  return "Critical";
};

const getStatusClass = (stock, mode) => {
  const isGood = stock > 80;
  const isWarning = stock > 20;
  if (mode === 'badge') {
    if (isGood) return 'bg-green-50 text-green-700 border border-green-100';
    if (isWarning) return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
    return 'bg-red-50 text-red-700 border border-red-100';
  }
  if (mode === 'bg') {
    if (isGood) return 'bg-green-500';
    if (isWarning) return 'bg-yellow-500';
    return 'bg-red-500';
  }
};

const totalInventory = computed(() =>
  products.value.reduce((sum, item) => sum + item.stock, 0)
);

const lowStockCount = computed(() =>
  products.value.filter((item) => item.stock <= 20).length
);

const reverseFormatType = (size) => {
  return size.toLowerCase().replace(" ", "_");
};

const openAddStockModel = (id) => {
  selectedProduct.value = products.value.find(p => p.id === id);
  addStockQantity.value = "";
  addStockDate.value = new Date();
  addStokNote.value = "";
  addStockModel.value = true;
};

const saveStock = async () => {
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
      addStockModel.value = false;
      fetchStockList();
    }
  } catch (error) {
    console.error("Add stock failed", error);
    alert("Failed to add stock");
  }
};

const addNewStock = () => {
  isAddNewStock.value = true;
};

onMounted(() => {
  fetchStockList();
});

const formatType = (type) => {
  return type.replace("_", " ").replace("ml", "ML").replace("liter", "Liter");
};

const prepareImageLink = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `https://sbev-admin.onrender.com${image}`;
};

const fetchStockList = async () => {
  isLoading.value = true;
  try {
    const res = await api.get("/stock");
    products.value = res.data.map((item) => ({
      id: item._id,
      productId: item.product._id,
      name: item.product.name,
      size: formatType(item.type),
      stock: item.quantity,
      minLevel: item.minLevel,
      image: prepareImageLink(item?.product?.image),
      date: item.date,
      bottleId: item.bottle,
    }));
  } catch (error) {
    console.error("Failed to fetch stock list", error);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.custom-modal :deep(.el-dialog) {
  border-radius: 24px;
  overflow: hidden;
  padding: 0;
}
.custom-modal :deep(.el-dialog__header) {
  padding: 24px 24px 10px;
}
.custom-modal :deep(.el-dialog__body) {
  padding: 10px 24px 20px;
}
.custom-modal :deep(.el-dialog__footer) {
  padding: 0 24px 24px;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
@media (max-width: 640px) {
  button {
    min-height: 44px;
  }
}
</style>