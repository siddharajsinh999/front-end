<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 class="text-base sm:text-lg font-semibold text-gray-700">Empty Bottles</h3>

      <button
        @click="openAddModal"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full whitespace-nowrap"
      >
        + Add Bottle
      </button>
    </div>

    <!-- Mobile Card View -->
    <div class="block lg:hidden space-y-3">
      <div v-for="item in bottles" :key="item._id" 
        class="bg-white shadow rounded-lg p-4 space-y-3">
        
        <!-- Header -->
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.name }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ formatType(item.type) }}</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="openEditModal(item)"
              class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              Edit
            </button>

            <button
              @click="openDeleteModal(item)"
              class="px-2 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100"
            >
              Delete
            </button>
          </div>
        </div>

        <!-- Details -->
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

      <!-- Empty State -->
      <div v-if="!bottles.length" class="bg-white shadow rounded-lg p-8 text-center">
        <p class="text-gray-400 text-sm">No bottles found</p>
      </div>
    </div>

    <!-- Desktop Table View -->
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
          <tr v-for="item in bottles" :key="item._id" class="border-t hover:bg-gray-50 transition">
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ formatType(item.type) }}</td>
            <td class="px-4 py-2">{{ item.quantity }}</td>
            <td class="px-4 py-2">{{ formatDate(item.date) }}</td>

            <td class="px-4 py-2 text-center">
              <button
                @click="openEditModal(item)"
                class="text-blue-600 text-xs mr-3 hover:underline"
              >
                Edit
              </button>

              <button
                @click="openDeleteModal(item)"
                class="text-red-500 text-xs hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!bottles.length">
            <td colspan="5" class="text-center py-6 text-gray-400">
              No bottles found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white w-full max-w-lg rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-center">
          {{ editId ? "Edit Bottle Stock" : "Add Empty Bottle Stock" }}
        </h3>

        <p class="text-xs text-gray-500 text-center mb-4 sm:mb-5">
          Manage empty bottle inventory
        </p>

        <div class="space-y-3 sm:space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">
              Bottle Name
            </label>
            <input
              v-model="form.name"
              type="text"
              class="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Enter bottle name"
            />
          </div>

          <!-- Type & Qty -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">
                Bottle Type
              </label>
              <select
                v-model="form.type"
                class="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="">Select type</option>
                <option value="500_ml">500 ML</option>
                <option value="1_liter">1 Liter</option>
                <option value="5_liter">5 Liter</option>
                <option value="10_liter">10 Liter</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">
                Quantity
              </label>
              <input
                v-model="form.quantity"
                type="number"
                class="w-full px-3 py-2 text-sm bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <!-- Date -->
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">
              Date
            </label>
            <el-date-picker
              v-model="form.date"
              type="date"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
              placeholder="Select date"
              class="w-full"
              size="default"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            @click="saveBottle"
            class="w-full sm:flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg order-1"
          >
            {{ editId ? "Update" : "Save" }}
          </button>

          <button
            @click="closeModal"
            class="w-full sm:flex-1 py-2 border rounded-lg text-sm hover:bg-gray-100 order-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRMATION MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white w-full max-w-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800 text-center">
          Delete Bottle
        </h3>

        <p class="text-xs sm:text-sm text-gray-500 text-center mt-2">
          Are you sure you want to delete this bottle entry?
        </p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
          <button
            @click="confirmDelete"
            class="w-full sm:flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg order-1"
          >
            Delete
          </button>

          <button
            @click="showDeleteModal = false"
            class="w-full sm:flex-1 py-2 border rounded-lg text-sm hover:bg-gray-100 order-2"
          >
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

const API = "http://localhost:5000/api/emptyBottle";

const bottles = ref([]);
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

/* FETCH */
const fetchBottles = async () => {
  const res = await axios.get(API);
  bottles.value = res.data.data || res.data;
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

  editId.value
    ? await axios.put(`${API}/${editId.value}`, form.value)
    : await axios.post(API, form.value);

  closeModal();
  fetchBottles();
};

/* DELETE */
const openDeleteModal = (item) => {
  deleteId.value = item._id;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  await axios.delete(`${API}/${deleteId.value}`);
  showDeleteModal.value = false;
  fetchBottles();
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
    "500_ml": "500 ML",
    "1_liter": "1 Liter",
    "5_liter": "5 Liter",
    "10_liter": "10 Liter"
  }[type]);

onMounted(fetchBottles);
</script>

<style scoped>
.el-date-editor {
  width: 100%;
}
</style>