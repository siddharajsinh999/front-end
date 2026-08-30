<template>
  <div>
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 class="text-base sm:text-lg font-semibold text-gray-700">Empty Bottles</h3>

      <button
        @click="openAddModal"
        :disabled="loading"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full whitespace-nowrap disabled:opacity-50 transition"
      >
        + Add Bottle
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
        <div v-for="item in bottles" :key="item._id" 
          class="bg-white shadow rounded-lg p-4 space-y-3">
          
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ formatType(item.type) }}</p>
            </div>
            
            <div class="flex gap-2 flex-shrink-0">
              <button @click="openEditModal(item)" class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Edit
              </button>
              <button @click="openDeleteModal(item)" class="px-2 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                Delete
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p class="text-xs text-gray-500">Quantity</p>
              <p class="font-medium text-gray-700">{{ item.quantity }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Date</p>
              <p class="font-medium text-gray-700">{{ formatDate(item.date) }}</p>
            </div>
          </div>
        </div>
      </template>

      <div v-if="!loading && !bottles.length" class="bg-white shadow rounded-lg p-8 text-center">
        <p class="text-gray-400 text-sm">No bottles found</p>
      </div>
    </div>

    <div class="hidden lg:block bg-white shadow rounded-lg overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Name</th>
            <th class="px-4 py-2 text-left">Type</th>
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
            <tr v-for="item in bottles" :key="item._id" class="border-t hover:bg-gray-50 transition">
              <td class="px-4 py-2 font-medium">{{ item.name }}</td>
              <td class="px-4 py-2">{{ formatType(item.type) }}</td>
              <td class="px-4 py-2">{{ item.quantity }}</td>
              <td class="px-4 py-2">{{ formatDate(item.date) }}</td>

              <td class="px-4 py-2 text-center">
                <button @click="openEditModal(item)" class="text-blue-600 text-xs mr-3 hover:underline">Edit</button>
                <button @click="openDeleteModal(item)" class="text-red-500 text-xs hover:underline">Delete</button>
              </td>
            </tr>
          </template>

          <tr v-if="!loading && !bottles.length">
            <td colspan="5" class="text-center py-10 text-gray-400">No bottles found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-center">
          {{ editId ? "Edit Bottle Stock" : "Add Empty Bottle Stock" }}
        </h3>
        <p class="text-xs text-gray-500 text-center mb-4 sm:mb-5">Manage empty bottle inventory</p>

        <div class="space-y-3 sm:space-y-4">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Bottle Name</label>
            <input v-model="form.name" type="text" class="input-field" placeholder="Enter bottle name" />
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Bottle Type</label>
              <select v-model="form.type" class="input-field">
                <option value="">Select type</option>
                <option value="200_ml">200 ML</option>
                <option value="500_ml">500 ML</option>
                <option value="1_liter">1 Liter</option>
                <option value="5_liter">5 Liter</option>
                <option value="10_liter">10 Liter</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Quantity</label>
              <input v-model.number="form.quantity" type="number" class="input-field" placeholder="Enter quantity" />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Date</label>
            <el-date-picker v-model="form.date" type="date" format="DD/MM/YYYY" value-format="YYYY-MM-DD" placeholder="Select date" class="w-full" size="default" />
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button @click="saveBottle" :disabled="submitting" class="w-full sm:flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg order-1 flex items-center justify-center gap-2">
            <span v-if="submitting" class="spinner"></span>
            {{ editId ? "Update" : "Save" }}
          </button>
          <button @click="closeModal" :disabled="submitting" class="w-full sm:flex-1 py-2 border rounded-lg text-sm hover:bg-gray-100 order-2">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div class="bg-white w-full max-w-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-center">Delete Bottle</h3>
        <p class="text-xs sm:text-sm text-gray-500 text-center mt-2">Are you sure you want to delete this bottle entry?</p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button @click="confirmDelete" :disabled="submitting" class="w-full sm:flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg order-1 flex items-center justify-center gap-2">
            <span v-if="submitting" class="spinner"></span>
            Delete
          </button>
          <button @click="showDeleteModal = false" :disabled="submitting" class="w-full sm:flex-1 py-2 border rounded-lg text-sm hover:bg-gray-100 order-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API = "https://sbev-admin.onrender.com/api/emptyBottle";

const bottles = ref([]);
const loading = ref(true);
const submitting = ref(false);

const showModal = ref(false);
const showDeleteModal = ref(false);
const editId = ref(null);
const deleteId = ref(null);

const form = ref({
  name: "",
  type: "",
  quantity: "",
  date: ""
});

/* FETCH WITH 10 SEC DELAY FOR TESTING */
const fetchBottles = async (isSilent = false) => {
  if (!isSilent) loading.value = true;
  try {
    // Artificial 10-second delay for testing the loader
    // await new Promise(resolve => setTimeout(resolve, 5000));
    
    const res = await axios.get(API);
    bottles.value = res.data.data || res.data;
  } catch (err) {
    console.error("Fetch Error:", err);
  } finally {
    loading.value = false;
  }
};

/* ADD */
const openAddModal = () => {
  editId.value = null;
  resetForm();
  showModal.value = true;
};

/* EDIT */
const openEditModal = (item) => {
  editId.value = item._id;
  form.value = {
    name: item.name,
    type: item.type,
    quantity: item.quantity,
    date: item.date?.split("T")[0]
  };
  showModal.value = true;
};

/* SAVE */
const saveBottle = async () => {
  if (!form.value.name || !form.value.type || !form.value.quantity) return;
  submitting.value = true;
  try {
    editId.value
      ? await axios.put(`${API}/${editId.value}`, form.value)
      : await axios.post(API, form.value);

    closeModal();
    await fetchBottles(true); // Silent refresh
  } catch (err) {
    console.error("Save Error:", err);
  } finally {
    submitting.value = false;
  }
};

/* DELETE */
const openDeleteModal = (item) => {
  deleteId.value = item._id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  submitting.value = true;
  try {
    await axios.delete(`${API}/${deleteId.value}`);
    showDeleteModal.value = false;
    await fetchBottles(true); // Silent refresh
  } catch (err) {
    console.error("Delete Error:", err);
  } finally {
    submitting.value = false;
  }
};

/* HELPERS */
const closeModal = () => {
  showModal.value = false;
  resetForm();
};

const resetForm = () => {
  form.value = { name: "", type: "", quantity: "", date: "" };
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString("en-GB") : "-";

const formatType = (type) =>
  ({
    "200_ml": "200 ML",
    "500_ml": "500 ML",
    "1_liter": "1 Liter",
    "5_liter": "5 Liter",
    "10_liter": "10 Liter"
  }[type]);

onMounted(fetchBottles);
</script>

<style scoped>
.input-field {
  @apply w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all;
}

.spinner {
  @apply w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin;
}

.el-date-editor {
  width: 100% !important;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>