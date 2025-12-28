<template>
  <el-dialog
    v-model="modelValue"
    :width="dialogWidth"
    :append-to-body="false"
    :destroy-on-close="true"
    class="rounded-xl sm:rounded-2xl"
  >
    <!-- Title -->
    <template #title>
      <h2 class="text-lg sm:text-[22px] font-semibold text-gray-800 flex items-center gap-2">
        📦 Add New Stock
      </h2>
    </template>

    <div class="space-y-4 sm:space-y-5 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto px-1">

      <!-- Product + Type -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <!-- Product -->
        <div>
          <label class="text-xs sm:text-[14px] font-semibold">Product</label>
          <el-select
            v-model="product"
            placeholder="Select product"
            class="w-full mt-1"
            @change="handleProductChange"
            size="default"
          >
            <el-option
              v-for="item in productListWithNew"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </div>

        <!-- Type -->
        <div>
          <label class="text-xs sm:text-[14px] font-semibold">Type</label>
          <el-select
            v-model="productType"
            placeholder="Select type"
            class="w-full mt-1"
            size="default"
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

      <!-- ✅ Empty Bottle Dropdown -->
      <div>
        <label class="text-xs sm:text-[14px] font-semibold">Select Empty Bottle</label>
        <el-select
          v-model="emptyBottle"
          placeholder="Select bottle"
          class="w-full mt-1"
          filterable
          size="default"
        >
          <el-option
            v-for="item in emptyBottleList"
            :key="item._id"
            :label="formatBottleLabel(item)"
            :value="item._id"
            :disabled="item.quantity <= 0"
          />
        </el-select>
      </div>

      <!-- Quantity -->
      <div>
        <label class="text-xs sm:text-[14px] font-semibold">Quantity (Bottles)</label>
        <el-input
          v-model="qty"
          placeholder="Enter quantity"
          class="mt-1"
          type="number"
          size="default"
        />
      </div>

      <!-- Date -->
      <div>
        <label class="text-xs sm:text-[14px] font-semibold">Date</label>
        <el-date-picker
          v-model="date"
          type="date"
          placeholder="Select date"
          class="w-full mt-1"
          size="default"
        />
      </div>

      <!-- Notes -->
      <div>
        <label class="text-xs sm:text-[14px] font-semibold">Notes</label>
        <el-input
          v-model="notes"
          type="textarea"
          placeholder="Add any notes…"
          :autosize="{ minRows: 2, maxRows: 4 }"
          class="mt-1"
        />
      </div>

      <!-- Product Image -->
      <div>
        <label class="text-xs sm:text-[14px] font-semibold">Product Image</label>

        <input
          type="file"
          accept="image/*"
          class="mt-2 block w-full text-xs sm:text-sm text-gray-600
          file:mr-3 file:py-1.5 file:px-3 sm:file:mr-4 sm:file:py-2 sm:file:px-4
          file:rounded-full file:border-0
          file:text-xs sm:file:text-sm file:font-semibold
          file:bg-purple-50 file:text-purple-700
          hover:file:bg-purple-100"
          @change="handleImageChange"
        />

        <div v-if="imagePreview" class="mt-3 sm:mt-4 flex justify-center">
          <img
            :src="imagePreview"
            alt="Preview"
            class="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg sm:rounded-xl border shadow"
          />
        </div>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 py-2">
        <el-button 
          @click="resetAndClose" 
          class="!h-[36px] sm:!h-[40px] !rounded-full !text-sm sm:!text-base w-full sm:w-auto"
        >
          Cancel
        </el-button>
        <el-button
          @click="saveStock"
          type="primary"
          class="!bg-purple-600 hover:!bg-purple-700 !px-6 sm:!px-10 !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base w-full sm:w-auto"
        >
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>

  <!-- Add New Product Modal -->
  <el-dialog
    v-model="newProductModal"
    title="Add New Product"
    :width="smallDialogWidth"
    class="rounded-xl sm:rounded-2xl"
  >
    <div class="px-1">
      <el-input 
        v-model="newProductName" 
        placeholder="Enter product name"
        size="default"
      />
    </div>
    
    <template #footer>
      <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 py-2">
        <el-button 
          @click="newProductModal = false" 
          class="!h-[36px] sm:!h-[40px] !rounded-full !text-sm sm:!text-base w-full sm:w-auto"
        >
          Cancel
        </el-button>
        <el-button
          @click="addNewProduct"
          type="primary"
          class="!bg-purple-600 hover:!bg-purple-700 !px-6 sm:!px-10 !rounded-full !h-[36px] sm:!h-[40px] !text-sm sm:!text-base w-full sm:w-auto"
        >
          Save
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import api from "@/services/api";

const modelValue = defineModel({ type: Boolean });
const emit = defineEmits(["saved"]);

const qty = ref("");
const date = ref("");
const notes = ref("");
const product = ref("");
const productType = ref("");
const emptyBottle = ref("");
const image = ref(null);
const imagePreview = ref(null);

// Product list
const productList = ref([]);

// Empty bottle list
const emptyBottleList = ref([]);

// Measurement types
const messurmentTtype = [
  { value: "500_ml", name: "500 ml" },
  { value: "1_liter", name: "1 Liter" },
  { value: "5_liter", name: "5 Liter" },
  { value: "10_liter", name: "10 Liter" }
];

// Friendly labels
const measurementLabelMap = {
  "500_ml": "500 ml",
  "1_liter": "1 Liter",
  "5_liter": "5 Liter",
  "10_liter": "10 Liter"
};

// New product modal
const newProductModal = ref(false);
const newProductName = ref("");

// Responsive dialog widths
const dialogWidth = computed(() => {
  if (typeof window === 'undefined') return '520px';
  return window.innerWidth < 640 ? '95%' : '520px';
});

const smallDialogWidth = computed(() => {
  if (typeof window === 'undefined') return '400px';
  return window.innerWidth < 640 ? '90%' : '400px';
});

// ---------------- API CALLS ----------------

async function fetchProducts() {
  const res = await api.get("/product/allProduct");
  if (res.data.success) {
    productList.value = res.data.data.map(item => ({
      value: item._id,
      name: item.name
    }));
  }
}

async function fetchEmptyBottles() {
  const res = await api.get("/emptyBottle");
  if (res.data.success) {
    emptyBottleList.value = res.data.data;
  }
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

  const res = await api.post("/product/addProduct", {
    name: newProductName.value
  });

  if (res.data.success) {
    const p = res.data.data;
    productList.value.push({ value: p._id, name: p.name });
    product.value = p._id;
    newProductModal.value = false;
  }
}

// ---------------- HELPERS ----------------

function formatBottleLabel(item) {
  const typeLabel = measurementLabelMap[item.type] || item.type;
  return `${item.name} - ${typeLabel} | Available: ${item.quantity}`;
}

// ---------------- SAVE ----------------

async function saveStock() {
  if (!product.value || !productType.value || !emptyBottle.value || !qty.value || !date.value) {
    return alert("Please fill all required fields");
  }

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

  resetAndClose();
  emit("saved");
}

// ---------------- IMAGE ----------------

function handleImageChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  image.value = file;
  imagePreview.value = URL.createObjectURL(file);
}

function resetAndClose() {
  qty.value = "";
  date.value = "";
  notes.value = "";
  product.value = "";
  productType.value = "";
  emptyBottle.value = "";
  image.value = null;
  imagePreview.value = null;
  modelValue.value = false;
}

onBeforeUnmount(() => {
  if (imagePreview.value) {
    URL.revokeObjectURL(imagePreview.value);
  }
});
</script>