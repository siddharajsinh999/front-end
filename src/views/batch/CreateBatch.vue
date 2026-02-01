<template>
    <div class="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center">
        <div class="w-full max-w-5xl space-y-4 sm:space-y-6">

            <div class="flex justify-between items-center">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
                    Add New Batch
                </h2>
            </div>

            <template v-if="loading">
                <div class="space-y-6 animate-pulse">
                    <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
                        <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div v-for="i in 6" :key="i" class="space-y-2">
                                <div class="h-3 bg-gray-100 rounded w-1/4"></div>
                                <div class="h-10 bg-gray-50 rounded w-full"></div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-2xl shadow-md space-y-6">
                        <div class="flex justify-between">
                            <div class="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div class="h-10 bg-gray-100 rounded-full w-32"></div>
                        </div>
                        <div class="h-20 bg-gray-50 rounded-xl"></div>
                    </div>
                </div>
            </template>

            <template v-else>
                <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md">
                    <h3 class="text-base sm:text-lg font-semibold mb-4 sm:mb-6 text-gray-700">
                        Batch Details
                    </h3>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label class="label">Batch Code</label>
                            <el-input v-model="form.batchCode" disabled size="default" />
                        </div>

                        <div>
                            <label class="label">Batch Name</label>
                            <el-input v-model="form.batchName" placeholder="Enter batch name" size="default" />
                        </div>

                        <div>
                            <label class="label">Input (KG)</label>
                            <el-input v-model="form.inputKg" type="number" size="default" />
                        </div>

                        <div>
                            <label class="label">Output (KG)</label>
                            <el-input v-model="form.outputKg" type="number" size="default" />
                        </div>

                        <div>
                            <label class="label">Date</label>
                            <el-date-picker v-model="form.date" type="date" class="w-full" size="default" />
                        </div>

                        <div>
                            <label class="label">Batch Status</label>
                            <el-select v-model="form.status" class="w-full" size="default">
                                <el-option label="Pending" value="Pending" />
                                <el-option label="In Progress" value="In Progress" />
                                <el-option label="Completed" value="Completed" />
                                <el-option label="Rejected" value="Rejected" />
                            </el-select>
                        </div>
                    </div>
                </div>

                <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md">
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                        <h3 class="text-base sm:text-lg font-semibold text-gray-700">
                            Used Materials
                        </h3>

                        <button @click="addMaterial" class="w-full sm:w-auto px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition">
                            + Add Material
                        </button>
                    </div>

                    <div class="space-y-4 md:hidden">
                        <div v-for="(material, index) in materials" :key="index"
                            class="border border-gray-200 rounded-lg p-3 space-y-3 shadow-sm">
                            
                            <div>
                                <label class="label">Material</label>
                                <el-select v-model="material.material" class="w-full" placeholder="Select material"
                                    @change="onMaterialChange(index)" size="default">
                                    <el-option v-for="item in materialList" :key="item._id" :label="item.name"
                                        :value="item._id" />
                                </el-select>
                            </div>

                            <div class="grid grid-cols-2 gap-3">
                                <div>
                                    <label class="label">Unit</label>
                                    <el-select v-model="material.unit" class="w-full" disabled size="default">
                                        <el-option label="Liter" value="Liter" />
                                        <el-option label="ml" value="ml" />
                                        <el-option label="KG" value="KG" />
                                        <el-option label="Gram" value="Gram" />
                                    </el-select>
                                </div>
                                <div>
                                    <label class="label">Quantity</label>
                                    <el-input v-model="material.quantity" type="number" size="default" />
                                </div>
                            </div>

                            <button v-if="materials.length > 1" @click="removeMaterial(index)" 
                                class="w-full text-red-500 text-sm py-2 border border-red-200 rounded-lg hover:bg-red-50 transition">
                                Remove Material
                            </button>
                        </div>
                    </div>

                    <div class="hidden md:block">
                        <div v-for="(material, index) in materials" :key="index"
                            class="grid grid-cols-4 gap-4 mb-4 items-end border-b pb-4 last:border-0 last:pb-0">
                            <div>
                                <label class="label">Material</label>
                                <el-select v-model="material.material" class="w-full" placeholder="Select material"
                                    @change="onMaterialChange(index)" size="default">
                                    <el-option v-for="item in materialList" :key="item._id" :label="item.name"
                                        :value="item._id" />
                                </el-select>
                            </div>
                            <div>
                                <label class="label">Unit</label>
                                <el-input v-model="material.unit" disabled placeholder="Unit" size="default" />
                            </div>
                            <div>
                                <label class="label">Quantity</label>
                                <el-input v-model="material.quantity" type="number" size="default" />
                            </div>
                            <div class="flex justify-start">
                                <button v-if="materials.length > 1" @click="removeMaterial(index)" 
                                    class="text-red-500 hover:text-red-700 transition font-medium text-sm mb-2">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pb-10">
                    <button @click="$router.back()" :disabled="submitting"
                        class="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition text-sm sm:text-base disabled:opacity-50">
                        Cancel
                    </button>

                    <button @click="submitForm" :disabled="submitting"
                        class="w-full sm:w-auto px-8 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-sm sm:text-base flex items-center justify-center gap-2">
                        <span v-if="submitting" class="spinner"></span>
                        {{ submitting ? 'Saving...' : 'Save Batch' }}
                    </button>
                </div>
            </template>
        </div>
        
        <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "@/services/api";
import Toast from "@/components/common/toast.vue";

const router = useRouter()

/* ---------------- STATE ---------------- */
const loading = ref(true)
const submitting = ref(false)

const form = reactive({
    batchCode: "",
    batchName: "",
    inputKg: "",
    outputKg: "",
    date: "",
    status: "Pending"
})

const materials = ref([
    { material: "", unit: "", quantity: "" }
])

const materialList = ref([])

const toast = reactive({
    show: false,
    message: "",
    type: "success"
})

/* ---------------- TOAST HELPER ---------------- */
const showToast = (message, type = "success") => {
    toast.message = message
    toast.type = type
    toast.show = true
}

/* ---------------- HELPERS ---------------- */
const getNextBatchCode = (lastCode) => {
    if (!lastCode) return "BATCH-1001"
    const parts = lastCode.split("-")
    const num = parseInt(parts[1])
    return isNaN(num) ? "BATCH-1001" : `BATCH-${num + 1}`
}

/* ---------------- API CALLS ---------------- */
const fetchInitialData = async () => {
    loading.value = true
    try {
        // --- TEST DELAY: 10 Seconds ---
        // await new Promise(resolve => setTimeout(resolve, 10000));
        // ------------------------------

        // Fetch Materials and Batches in Parallel
        const [matRes, batchRes] = await Promise.all([
            api.get("/batch/materials"),
            api.get("/batch/batches")
        ])

        materialList.value = matRes.data.materials

        if (batchRes.data.batches?.length) {
            form.batchCode = getNextBatchCode(batchRes.data.batches[0].batchCode)
        } else {
            form.batchCode = "BATCH-1001"
        }
    } catch (error) {
        console.error(error)
        showToast("Failed to load initial data", "error")
    } finally {
        loading.value = false
    }
}

/* ---------------- MATERIAL LOGIC ---------------- */
const addMaterial = () => {
    materials.value.push({ material: "", unit: "", quantity: "" })
}

const removeMaterial = (index) => {
    materials.value.splice(index, 1)
}

const onMaterialChange = (index) => {
    const selected = materialList.value.find(
        m => m._id === materials.value[index].material
    )
    if (selected) {
        materials.value[index].unit = selected.defaultUnit
    }
}

/* ---------------- SUBMIT ---------------- */
const submitForm = async () => {
    if (!form.batchName || !form.date) {
        showToast("Please fill in required fields", "error")
        return
    }

    submitting.value = true
    const payload = {
        batchCode: form.batchCode,
        batchName: form.batchName,
        inputKg: Number(form.inputKg),
        outputKg: Number(form.outputKg),
        date: form.date,
        status: form.status,
        usedMaterials: materials.value.map(m => ({
            material: m.material,
            unit: m.unit,
            quantity: Number(m.quantity)
        }))
    }

    try {
        await api.post("/batch/batches", payload)
        showToast("Batch created successfully!", "success")
        setTimeout(() => {
            router.push({ name: 'batches' }) // Navigate back to list
        }, 1500)
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to save batch"
        showToast(errorMessage, "error")
    } finally {
        submitting.value = false
    }
}

/* ---------------- INIT ---------------- */
onMounted(fetchInitialData)
</script>

<style scoped>
.label {
    display: block;
    font-size: 0.75rem;
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: #4b5563;
}

.spinner {
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@media (min-width: 640px) {
    .label {
        font-size: 0.875rem;
    }
}
</style>