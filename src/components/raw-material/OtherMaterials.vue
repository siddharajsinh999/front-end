<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 class="text-base sm:text-lg font-semibold text-gray-700 flex items-center gap-2">
        📦 Other Materials
      </h3>

      <button
        @click="openAddModal"
        :disabled="loading"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full whitespace-nowrap disabled:opacity-50 transition"
      >
        + Add Material
      </button>
    </div>

    <div class="block lg:hidden space-y-3">
      <template v-if="loading">
        <div v-for="i in 3" :key="'mob-skel-' + i" class="bg-white shadow rounded-lg p-4 animate-pulse space-y-4">
          <div class="flex justify-between">
            <div class="space-y-2 w-2/3">
              <div class="h-4 bg-gray-200 rounded w-full"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-7 w-12 bg-gray-100 rounded"></div>
              <div class="h-7 w-12 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="h-8 bg-gray-50 rounded"></div>
            <div class="h-8 bg-gray-50 rounded"></div>
          </div>
        </div>
      </template>

      <template v-else>
        <div v-for="(item, index) in items" :key="index" class="bg-white shadow rounded-lg p-4 space-y-3">
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ item.category }}</p>
            </div>
            
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEditModal(item, index)" class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Edit
              </button>
              <button @click="openDeleteModal(index)" class="px-2 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                Delete
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p class="text-xs text-gray-500">Quantity</p>
              <p class="font-medium text-gray-700">{{ item.qty }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date</p>
              <p class="font-medium text-gray-700">{{ item.date }}</p>
            </div>
          </div>

          <div v-if="item.description" class="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            {{ item.description }}
          </div>
        </div>
      </template>

      <div v-if="!loading && !items.length" class="bg-white shadow rounded-lg p-8 text-center">
        <p class="text-gray-400 text-sm">No materials added</p>
      </div>
    </div>

    <div class="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Item Name</th>
            <th class="px-4 py-2 text-left">Category</th>
            <th class="px-4 py-2 text-left">Qty</th>
            <th class="px-4 py-2 text-left">Date</th>
            <th class="px-4 py-2 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <template v-if="loading">
            <tr v-for="i in 5" :key="'desk-skel-' + i" class="border-t animate-pulse">
              <td class="px-4 py-3"><div class="h-4 bg-gray-100 rounded w-3/4"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-gray-100 rounded w-1/2"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-gray-100 rounded w-1/4"></div></td>
              <td class="px-4 py-3"><div class="h-4 bg-gray-100 rounded w-1/2"></div></td>
              <td class="px-4 py-3 text-center"><div class="h-4 bg-gray-100 rounded w-20 mx-auto"></div></td>
            </tr>
          </template>

          <template v-else>
            <tr v-for="(item, index) in items" :key="index" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-2 font-medium">{{ item.name }}</td>
              <td class="px-4 py-2">{{ item.category }}</td>
              <td class="px-4 py-2">{{ item.qty }}</td>
              <td class="px-4 py-2">{{ item.date }}</td>
              <td class="px-4 py-2 text-center">
                <button @click="openEditModal(item, index)" class="text-blue-600 hover:underline text-xs">Edit</button>
                <button @click="openDeleteModal(index)" class="text-red-500 hover:underline text-xs ml-3">Delete</button>
              </td>
            </tr>
          </template>

          <tr v-if="!loading && !items.length">
            <td colspan="5" class="py-10 text-center text-gray-400">No materials added</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base font-semibold text-center text-gray-800">
          {{ editIndex !== null ? 'Edit Material' : 'Add Material' }}
        </h3>
        <p class="text-xs text-gray-500 text-center mb-4">Manage your material inventory</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs font-semibold text-gray-600">Item Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="Name" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">Category</label>
            <input v-model="form.category" type="text" class="input-field" placeholder="Category" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs font-semibold text-gray-600">Quantity</label>
            <input v-model.number="form.qty" type="number" class="input-field" placeholder="0" />
          </div>
          <div>
            <label class="text-xs font-semibold text-gray-600">Date</label>
            <input v-model="form.date" type="date" class="input-field" />
          </div>
        </div>

        <div class="mb-4">
          <label class="text-xs font-semibold text-gray-600">Description</label>
          <textarea v-model="form.description" rows="2" class="input-field" placeholder="Optional description"></textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button @click="saveItem" :disabled="submitting" class="w-full sm:flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md order-1 flex items-center justify-center gap-2">
            <span v-if="submitting" class="spinner"></span>
            {{ editIndex !== null ? "Update" : "Save" }}
          </button>
          <button @click="closeModal" :disabled="submitting" class="w-full sm:flex-1 py-2 border rounded-md text-sm hover:bg-gray-100 order-2">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-sm rounded-xl shadow-2xl p-4 sm:p-6 text-center">
        <h3 class="text-base sm:text-lg font-semibold text-red-600 mb-2">Confirm Delete</h3>
        <p class="text-xs sm:text-sm text-gray-600 mb-5">Are you sure you want to delete this item?</p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button @click="confirmDelete" :disabled="submitting" class="w-full sm:flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm order-1 flex items-center justify-center gap-2">
            <span v-if="submitting" class="spinner"></span>
            Delete
          </button>
          <button @click="showDeleteModal = false" :disabled="submitting" class="w-full sm:flex-1 py-2 border rounded-md text-sm hover:bg-gray-100 order-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const loading = ref(true);
const submitting = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);

const editIndex = ref(null);
const deleteIndex = ref(null);

const items = ref([]);

const form = ref({
  name: "",
  category: "",
  qty: "",
  date: "",
  description: ""
});

// Artifical Load with 10s delay
const fetchItems = async () => {
  loading.value = true;
  try {
    // Artificial 10-second delay for testing
    // await new Promise(resolve => setTimeout(resolve, 10000));
    
    // Simulating API data
    items.value = [
      { name: "Bottle Cap", category: "Packaging", qty: 500, date: "2025-07-07", description: "Blue caps" },
      { name: "Sticker Roll", category: "Label", qty: 100, date: "2025-07-08", description: "Glossy finish" }
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchItems);

const openAddModal = () => {
  editIndex.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (item, index) => {
  editIndex.value = index;
  form.value = { ...item };
  showModal.value = true;
};

const saveItem = async () => {
  if (!form.value.name || !form.value.qty) return;
  submitting.value = true;
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  if (editIndex.value !== null) {
    items.value[editIndex.value] = { ...form.value };
  } else {
    items.value.push({ ...form.value });
  }
  
  submitting.value = false;
  closeModal();
};

const openDeleteModal = (index) => {
  deleteIndex.value = index;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  submitting.value = true;
  await new Promise(resolve => setTimeout(resolve, 800));
  items.value.splice(deleteIndex.value, 1);
  submitting.value = false;
  showDeleteModal.value = false;
};

const closeModal = () => {
  showModal.value = false;
  editIndex.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = { name: "", category: "", qty: "", date: "", description: "" };
};
</script>

<style scoped>
.input-field {
  @apply w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none transition-all;
}

.spinner {
  @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>