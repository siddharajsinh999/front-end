<template>
  <div class="p-4 sm:p-6 bg-slate-50 min-h-screen">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-4 sm:mb-6 bg-white p-3 sm:p-4 rounded-lg sm:rounded-xl shadow">
      <h3 class="text-base sm:text-lg font-semibold text-slate-700 flex items-center gap-2">
        🧴 Material Stock
      </h3>

      <button @click="openAddModal"
        class="px-4 sm:px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-full shadow-md transition whitespace-nowrap">
        + Add Material
      </button>
    </div>

    <!-- Mobile Card View -->
    <div class="block lg:hidden space-y-3">
      <div v-for="(item, index) in materials" :key="item._id" 
        class="bg-white shadow rounded-lg p-4 space-y-3">
        
        <!-- Header -->
        <div class="flex justify-between items-start gap-2">
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-sm text-slate-800 truncate">{{ item.name }}</h4>
            <p class="text-xs text-slate-500 capitalize mt-0.5">{{ item.materialType }}</p>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex gap-2 flex-shrink-0">
            <button @click="openEditModal(item, index)"
              class="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-sm" 
              title="Edit">
              ✏️
            </button>

            <button @click="openDeleteModal(index)"
              class="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition text-sm" 
              title="Delete">
              🗑️
            </button>
          </div>
        </div>

        <!-- Details -->
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p class="text-xs text-slate-500">Quantity</p>
            <p class="font-medium text-slate-700">
              {{ item.stockQuantity }} {{ item.defaultUnit }}
            </p>
          </div>
          
          <div>
            <p class="text-xs text-slate-500">Created</p>
            <p class="font-medium text-slate-700">{{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="materials.length === 0" class="bg-white shadow rounded-lg p-8 text-center">
        <p class="text-gray-400 text-sm">No materials found</p>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div class="hidden lg:block bg-white shadow rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-slate-100 text-slate-700">
          <tr>
            <th class="px-4 py-3 text-left">Material Name</th>
            <th class="px-4 py-3 text-left">Type</th>
            <th class="px-4 py-3 text-left">Quantity</th>
            <th class="px-4 py-3 text-left">Created At</th>
            <th class="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, index) in materials" :key="item._id" class="border-t hover:bg-slate-50 transition">
            <td class="px-4 py-3">{{ item.name }}</td>
            <td class="px-4 py-3 capitalize">{{ item.materialType }}</td>
            <td class="px-4 py-3">
              {{ item.stockQuantity }} {{ item.defaultUnit }}
            </td>
            <td class="px-4 py-3">
              {{ formatDate(item.createdAt) }}
            </td>

            <td class="px-4 py-3 text-center">
              <div class="flex justify-center gap-2">

                <!-- Edit -->
                <button @click="openEditModal(item, index)"
                  class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition" title="Edit">
                  ✏️
                </button>

                <!-- Delete -->
                <button @click="openDeleteModal(index)"
                  class="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition" title="Delete">
                  🗑️
                </button>

              </div>
            </td>

          </tr>

          <tr v-if="materials.length === 0">
            <td colspan="5" class="text-center py-5 text-gray-400">
              No materials found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ADD / EDIT MODAL -->
    <div v-if="showFormModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-md rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">

        <h3 class="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-700">
          {{ editIndex === null ? "Add Material" : "Edit Material" }}
        </h3>

        <div class="space-y-3">

          <div>
            <label class="text-xs text-gray-500">Material Name</label>
            <input v-model="form.name" type="text" class="input text-sm" placeholder="Enter material name" />
          </div>

          <div>
            <label class="text-xs text-gray-500">Material Type</label>
            <select v-model="form.materialType" class="input text-sm">
              <option value="">Select type</option>
              <option value="chemical">Chemical</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500">Unit</label>
            <select v-model="form.defaultUnit" class="input text-sm">
              <option value="">Select unit</option>
              <option>Liter</option>
              <option>ml</option>
              <option>Gram</option>
              <option>KG</option>
            </select>
          </div>

          <div>
            <label class="text-xs text-gray-500">Quantity</label>
            <input v-model.number="form.stockQuantity" type="number" min="0" class="input text-sm"
              placeholder="Enter quantity" />
          </div>

        </div>

        <!-- Buttons -->
        <div class="flex flex-col sm:flex-row justify-end mt-4 sm:mt-6 gap-2 sm:gap-3">
          <button @click="closeModal" 
            class="w-full sm:w-auto px-4 py-2 border rounded-full text-gray-600 hover:bg-gray-100 text-sm order-2 sm:order-1">
            Cancel
          </button>

          <button @click="saveMaterial"
            class="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow text-sm order-1 sm:order-2">
            {{ editIndex === null ? "Add" : "Update" }}
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE CONFIRM MODAL -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div class="bg-white w-full max-w-sm rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6">

        <h3 class="text-base sm:text-lg font-semibold text-red-600 mb-2 sm:mb-3">
          Confirm Delete
        </h3>

        <p class="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
          Are you sure you want to delete this material?
        </p>

        <div class="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <button @click="showDeleteModal = false"
            class="w-full sm:w-auto px-4 py-2 border rounded-full text-gray-600 hover:bg-gray-100 text-sm order-2 sm:order-1">
            Cancel
          </button>

          <button @click="deleteMaterial" 
            class="w-full sm:w-auto px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow text-sm order-1 sm:order-2">
            Delete
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "@/services/api";

const materials = ref([]);

const showFormModal = ref(false);
const showDeleteModal = ref(false);
const editIndex = ref(null);
const deleteIndex = ref(null);

const form = ref({
  name: "",
  materialType: "",
  defaultUnit: "",
  stockQuantity: 0,
});

/* ---------------- API ---------------- */

const fetchMaterials = async () => {
  const res = await api.get("/batch/materials");
  if (!res) return
  materials.value = res.data.materials
};

onMounted(fetchMaterials);

const saveMaterial = async () => {
  if (!form.value.name || !form.value.defaultUnit) return;

  if (editIndex.value === null) {
    await api.post("/batch/materials", form.value);
  } else {
    const id = materials.value[editIndex.value]._id;
    await api.put(`/batch/materials/${id}`, {
      name: form.value.name,
      defaultUnit: form.value.defaultUnit,
      stockQuantity: form.value.stockQuantity,
    });
  }

  await fetchMaterials();
  closeModal();
};

const deleteMaterial = async () => {
  const id = materials.value[deleteIndex.value]._id;
  await api.delete(`/batch/materials/${id}`);
  await fetchMaterials();
  showDeleteModal.value = false;
};

/* ---------------- UI ---------------- */

const openAddModal = () => {
  editIndex.value = null;
  form.value = {
    name: "",
    materialType: "",
    defaultUnit: "",
    stockQuantity: 0,
  };
  showFormModal.value = true;
};

const openEditModal = (item, index) => {
  editIndex.value = index;
  form.value = { ...item };
  showFormModal.value = true;
};

const closeModal = () => {
  showFormModal.value = false;
  editIndex.value = null;
};

const openDeleteModal = (index) => {
  deleteIndex.value = index;
  showDeleteModal.value = true;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString();
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  outline: none;
}

.input:focus {
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.3);
}
</style>