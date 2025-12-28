<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 bg-white p-3 sm:p-4 rounded-lg shadow">
      <h3 class="text-base sm:text-lg font-semibold text-gray-700">
        Other Materials
      </h3>

      <button
        @click="openAddModal"
        class="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full whitespace-nowrap">
        + Add Material
      </button>
    </div>

    <!-- Mobile Card View -->
    <div class="block lg:hidden space-y-3">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="bg-white shadow rounded-lg p-4 space-y-3"
      >
        <!-- Header -->
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-sm text-gray-800 truncate">{{ item.name }}</h4>
            <p class="text-xs text-gray-500 mt-0.5">{{ item.category }}</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 flex-shrink-0">
            <button
              @click="openEditModal(item, index)"
              class="px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
              Edit
            </button>

            <button
              @click="openDeleteModal(index)"
              class="px-2 py-1 text-xs bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
              Delete
            </button>
          </div>
        </div>

        <!-- Details -->
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

        <!-- Description (if exists) -->
        <div v-if="item.description" class="text-xs text-gray-600 bg-gray-50 p-2 rounded">
          {{ item.description }}
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!items.length" class="bg-white shadow rounded-lg p-8 text-center">
        <p class="text-gray-400 text-sm">No materials added</p>
      </div>
    </div>

    <!-- Desktop Table View -->
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
          <tr
            v-for="(item, index) in items"
            :key="index"
            class="border-t hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ item.name }}</td>
            <td class="px-4 py-2">{{ item.category }}</td>
            <td class="px-4 py-2">{{ item.qty }}</td>
            <td class="px-4 py-2">{{ item.date }}</td>

            <td class="px-4 py-2 text-center">
              <button
                @click="openEditModal(item, index)"
                class="text-blue-600 hover:underline text-xs">
                Edit
              </button>

              <button
                @click="openDeleteModal(index)"
                class="text-red-500 hover:underline text-xs ml-3">
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="!items.length">
            <td colspan="5" class="py-6 text-center text-gray-400">
              No materials added
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
      <div class="bg-white w-full max-w-md rounded-xl shadow-2xl p-4 sm:p-5 max-h-[90vh] overflow-y-auto">

        <h3 class="text-base font-semibold text-center text-gray-800">
          {{ editIndex !== null ? 'Edit Material' : 'Add Material' }}
        </h3>

        <p class="text-xs text-gray-500 text-center mb-3 sm:mb-4">
          Manage your material inventory
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs font-semibold text-gray-600">Item Name</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="Enter item name"
              class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-600">Category</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="Enter category"
              class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="text-xs font-semibold text-gray-600">Quantity</label>
            <input
              v-model="form.qty"
              type="number"
              placeholder="0"
              class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label class="text-xs font-semibold text-gray-600">Date</label>
            <input
              v-model="form.date"
              type="date"
              class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div class="mb-3 sm:mb-4">
          <label class="text-xs font-semibold text-gray-600">Description</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Add description (optional)"
            class="w-full mt-1 px-3 py-2 text-sm bg-gray-50 border rounded-md focus:ring-2 focus:ring-purple-400 focus:outline-none">
          </textarea>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="saveItem"
            class="w-full sm:flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md order-1"
          >
            {{ editIndex !== null ? "Update" : "Save" }}
          </button>

          <button
            @click="closeModal"
            class="w-full sm:flex-1 py-2 border rounded-md text-sm hover:bg-gray-100 order-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM MODAL -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white w-full max-w-sm rounded-xl shadow-2xl p-4 sm:p-6">

        <h3 class="text-base sm:text-lg font-semibold text-red-600 mb-2 text-center">
          Confirm Delete
        </h3>

        <p class="text-xs sm:text-sm text-center text-gray-600 mb-4 sm:mb-5">
          Are you sure you want to delete this item?
        </p>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            @click="showDeleteModal = false"
            class="w-full sm:flex-1 py-2 border rounded-md hover:bg-gray-100 text-sm order-2 sm:order-1"
          >
            Cancel
          </button>

          <button
            @click="confirmDelete"
            class="w-full sm:flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm order-1 sm:order-2"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from "vue";

const showModal = ref(false);
const showDeleteModal = ref(false);

const editIndex = ref(null);
const deleteIndex = ref(null);

const items = ref([
  { name: "Bottle Cap", category: "Packaging", qty: 500, date: "2025-07-07", description: "" },
  { name: "Sticker Roll", category: "Label", qty: 100, date: "2025-07-08", description: "" }
]);

const form = ref({
  name: "",
  category: "",
  qty: "",
  date: "",
  description: ""
});

// Open Add
const openAddModal = () => {
  editIndex.value = null;
  resetForm();
  showModal.value = true;
};

// Open Edit
const openEditModal = (item, index) => {
  editIndex.value = index;
  form.value = { ...item };
  showModal.value = true;
};

// Save or Update
const saveItem = () => {
  if (!form.value.name || !form.value.qty) return;

  if (editIndex.value !== null) {
    items.value[editIndex.value] = { ...form.value };
  } else {
    items.value.push({ ...form.value });
  }

  closeModal();
};

// Open Delete
const openDeleteModal = (index) => {
  deleteIndex.value = index;
  showDeleteModal.value = true;
};

// Confirm Delete
const confirmDelete = () => {
  items.value.splice(deleteIndex.value, 1);
  showDeleteModal.value = false;
};

// Close modal
const closeModal = () => {
  showModal.value = false;
  editIndex.value = null;
  resetForm();
};

const resetForm = () => {
  form.value = {
    name: "",
    category: "",
    qty: "",
    date: "",
    description: ""
  };
};
</script>