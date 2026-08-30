<template>
  <el-dialog
    v-model="modelValue"
    :width="dialogWidth"
    :append-to-body="false"
    :destroy-on-close="true"
    v-loading="saving"
    class="custom-stock-dialog rounded-2xl"
  >
    <template #title>
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
          <span class="text-lg">📦</span>
        </div>
        <h2 class="text-lg sm:text-xl font-bold text-gray-800">Add New Stock</h2>
      </div>
    </template>

    <div class="space-y-4 sm:space-y-5 max-h-[70vh] overflow-y-auto px-1 custom-scrollbar">
      
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Select Product</label>
          <el-select
            v-model="product"
            placeholder="Select product"
            class="w-full"
            @change="handleProductChange"
            size="large"
          >
            <el-option
              v-for="item in productListWithNew"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              :class="item.value === 'new_product' ? '!text-purple-600 !font-bold border-t' : ''"
            />
          </el-select>
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Measurement Type</label>
          <el-select
            v-model="productType"
            placeholder="Select type"
            class="w-full"
            size="large"
          >
            <el-option
              v-for="item in messurmentTtype"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Empty Bottle Source</label>
        <el-select
          v-model="emptyBottle"
          placeholder="Select empty bottle to use"
          class="w-full"
          filterable
          size="large"
        >
          <el-option
            v-for="item in emptyBottleList"
            :key="item._id"
            :label="formatBottleLabel(item)"
            :value="item._id"
            :disabled="item.quantity <= 0"
          >
            <div class="flex justify-between w-full">
              <span>{{ item.name }} ({{ measurementLabelMap[item.type] }})</span>
              <span :class="item.quantity <= 0 ? 'text-red-400' : 'text-gray-400'">Qty: {{ item.quantity }}</span>
            </div>
          </el-option>
        </el-select>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="flex flex-col gap-1.5">
          <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Quantity (Bottles)</label>
          <el-input
            v-model="qty"
            placeholder="0"
            type="number"
            size="large"
          />
        </div>

        <div class="flex flex-col gap-1.5">
          <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Stock Date</label>
          <el-date-picker
            v-model="date"
            type="date"
            placeholder="Select date"
            class="!w-full"
            size="large"
          />
        </div>
      </div>

      <div class="flex flex-col gap-1.5">
        <label class="text-xs sm:text-sm font-bold text-gray-700 ml-1">Notes / Remarks</label>
        <el-input
          v-model="notes"
          type="textarea"
          placeholder="Optional notes about this batch..."
          :autosize="{ minRows: 2, maxRows: 4 }"
        />
      </div>

      <div class="p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <label class="text-xs sm:text-sm font-bold text-gray-700 mb-2 block">Product Image</label>
        
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="relative w-full sm:w-auto">
            <input
              type="file"
              id="stock-image-upload"
              accept="image/*"
              class="hidden"
              @change="handleImageChange"
            />
            <label 
              for="stock-image-upload"
              class="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 cursor-pointer hover:bg-gray-100 transition-all w-full"
            >
              <span class="text-purple-600">📷</span>
              {{ image ? 'Change Photo' : 'Upload Photo' }}
            </label>
          </div>

          <div v-if="imagePreview" class="relative">
            <img
              :src="imagePreview"
              class="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl border-2 border-white shadow-md"
            />
            <button 
              @click="removeImage" 
              class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-1">
        <button 
          @click="resetAndClose" 
          class="px-6 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 transition-all order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          @click="saveStock"
          :disabled="saving"
          class="px-8 py-2.5 bg-purple-600 text-white rounded-xl font-bold shadow-sm shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
        >
          <span v-if="saving" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          Save Stock
        </button>
      </div>
    </template>
  </el-dialog>

  <el-dialog
    v-model="newProductModal"
    :width="smallDialogWidth"
    class="rounded-2xl"
    title="Create New Product"
  >
    <div class="py-2">
      <label class="text-xs font-bold text-gray-500 mb-1 block">Product Name</label>
      <el-input 
        v-model="newProductName" 
        placeholder="e.g. Mixed Fruit Juice"
        size="large"
      />
    </div>
    
    <template #footer>
      <div class="flex gap-3">
        <button @click="newProductModal = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 font-bold text-sm">Cancel</button>
        <button @click="addNewProduct" class="flex-1 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm">Save</button>
      </div>
    </template>
  </el-dialog>

  <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, reactive } from "vue";
import api from "@/services/api";
import Toast from "@/components/common/toast.vue";

const modelValue = defineModel({ type: Boolean });
const emit = defineEmits(["saved"]);

const qty = ref("");
const date = ref(new Date()); // Default to today
const notes = ref("");
const product = ref("");
const productType = ref("");
const emptyBottle = ref("");
const image = ref(null);
const imagePreview = ref(null);

const saving = ref(false);

const toast = reactive({
    show: false,
    message: "",
    type: "success"
})

const showToast = (message, type = "success") => {
    toast.message = message
    toast.type = type
    toast.show = true
}

const productList = ref([]);
const emptyBottleList = ref([]);

const messurmentTtype = [
  { value: "200_ml", name: "200 ml"},
  { value: "500_ml", name: "500 ml" },
  { value: "1_liter", name: "1 Liter" },
  { value: "5_liter", name: "5 Liter" },
  { value: "10_liter", name: "10 Liter" }
];

const measurementLabelMap = {
  "200_ml": "200 ml",
  "500_ml": "500 ml",
  "1_liter": "1 Liter",
  "5_liter": "5 Liter",
  "10_liter": "10 Liter"
};

const newProductModal = ref(false);
const newProductName = ref("");

// Enhanced Responsive dialog widths
const dialogWidth = computed(() => {
  if (typeof window === 'undefined') return '520px';
  return window.innerWidth < 640 ? '94%' : '520px';
});

const smallDialogWidth = computed(() => {
  if (typeof window === 'undefined') return '400px';
  return window.innerWidth < 640 ? '90%' : '400px';
});

// ---------------- API CALLS ----------------

async function fetchProducts() {
  try {
    const res = await api.get("/product/allProduct");
    if (res.data.success) {
      productList.value = res.data.data.map(item => ({
        value: item._id,
        name: item.name
      }));
    }
  } catch (err) { console.error("Fetch Products Error", err); }
}

async function fetchEmptyBottles() {
  try {
    const res = await api.get("/emptyBottle");
    if (res.data.success) {
      emptyBottleList.value = res.data.data;
    }
  } catch (err) { console.error("Fetch Bottles Error", err); }
}

onMounted(() => {
  fetchProducts();
  fetchEmptyBottles();
});

// ---------------- PRODUCT + NEW ----------------

const productListWithNew = computed(() => [
  ...productList.value,
  { value: "new_product", name: "+ New Product" }
]);

function handleProductChange(val) {
  if (val === "new_product") {
    newProductName.value = "";
    newProductModal.value = true;
    product.value = "";
  }
}

async function addNewProduct() {
  if (!newProductName.value.trim()) return;

  try {
    const res = await api.post("/product/addProduct", {
      name: newProductName.value
    });

    if (res.data.success) {
      const p = res.data.data;
      productList.value.push({ value: p._id, name: p.name });
      product.value = p._id;
      newProductModal.value = false;
      showToast("New product added successfully!", "success");
    }
  } catch (err) { showToast("Error adding product", "error"); }
}

// ---------------- HELPERS ----------------

function formatBottleLabel(item) {
  const typeLabel = measurementLabelMap[item.type] || item.type;
  return `${item.name} (${typeLabel})`;
}

// ---------------- SAVE ----------------

async function saveStock() {
  if (!product.value || !productType.value || !emptyBottle.value || !qty.value || !date.value) {
    showToast("Please fill all required fields", "warning");
    return;
  }

  try {
    saving.value = true;

    const formData = new FormData();
    formData.append("productId", product.value);
    formData.append("type", productType.value);
    formData.append("bottleId", emptyBottle.value);
    formData.append("quantity", Number(qty.value));
    formData.append("notes", notes.value || "");
    formData.append("date", date.value);

    if (image.value) {
      formData.append("image", image.value);
    }

    await api.post("/stock/add", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    showToast("Stock added successfully!", "success");
    resetAndClose();
    emit("saved");
  } catch (error) {
    console.error("Save Stock Error", error);
    showToast("Error updating stock", "error");
  } finally {
    saving.value = false;
  }
}

// ---------------- IMAGE ----------------

function handleImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  image.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

function removeImage() {
  image.value = null;
  if (imagePreview.value) URL.revokeObjectURL(imagePreview.value);
  imagePreview.value = null;
}

function resetAndClose() {
  qty.value = "";
  date.value = new Date();
  notes.value = "";
  product.value = "";
  productType.value = "";
  emptyBottle.value = "";
  removeImage();
  modelValue.value = false;
}

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
});
</script>

<style scoped>
/* Custom Dialog Styling */
:deep(.custom-stock-dialog) {
  padding: 0;
  overflow: hidden;
}
:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px 10px;
}
:deep(.el-dialog__body) {
  padding: 10px 24px 20px;
}
:deep(.el-dialog__footer) {
  padding: 0 24px 20px;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f9fafb;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 10px;
}

/* Mobile Adjustments */
@media (max-width: 640px) {
  :deep(.el-dialog__header) { padding: 16px 16px 8px; }
  :deep(.el-dialog__body) { padding: 8px 16px 16px; }
  :deep(.el-dialog__footer) { padding: 0 16px 16px; }
}
</style>