<template>
    <div class="min-h-screen bg-gray-100 p-4 sm:p-6 flex justify-center">
        <div class="w-full max-w-5xl space-y-4 sm:space-y-6">

            <!-- HEADER -->
            <div class="flex justify-between items-center">
                <h2 class="text-xl sm:text-2xl font-bold text-gray-800">
                    Add New Batch
                </h2>
            </div>

            <!-- ================= CARD 1 : BATCH DETAILS ================= -->
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

            <!-- ================= CARD 2 : USED MATERIALS ================= -->
            <div class="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-md">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                    <h3 class="text-base sm:text-lg font-semibold text-gray-700">
                        Used Materials
                    </h3>

                    <button @click="addMaterial" class="w-full sm:w-auto px-4 py-1.5 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700 transition">
                        + Add Material
                    </button>
                </div>

                <!-- Mobile: Card Layout -->
                <div class="space-y-4 md:hidden">
                    <div v-for="(material, index) in materials" :key="index"
                        class="border border-gray-200 rounded-lg p-3 space-y-3">
                        
                        <!-- Material -->
                        <div>
                            <label class="label">Material</label>
                            <el-select v-model="material.material" class="w-full" placeholder="Select material"
                                @change="onMaterialChange(index)" size="default">
                                <el-option v-for="item in materialList" :key="item._id" :label="item.name"
                                    :value="item._id" />
                            </el-select>
                        </div>

                        <!-- Unit & Quantity -->
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="label">Unit</label>
                                <el-select v-model="material.unit" class="w-full" disabled size="default">
                                    <el-option label="Liter" value="Liter" />
                                    <el-option label="ML" value="ML" />
                                    <el-option label="KG" value="KG" />
                                    <el-option label="Gram" value="Gram" />
                                </el-select>
                            </div>

                            <div>
                                <label class="label">Quantity</label>
                                <el-input v-model="material.quantity" type="number" size="default" />
                            </div>
                        </div>

                        <!-- Remove Button -->
                        <button v-if="materials.length > 1" @click="removeMaterial(index)" 
                            class="w-full text-red-500 text-sm py-2 border border-red-200 rounded-lg hover:bg-red-50 transition">
                            Remove Material
                        </button>
                    </div>
                </div>

                <!-- Desktop: Grid Layout -->
                <div class="hidden md:block">
                    <div v-for="(material, index) in materials" :key="index"
                        class="grid grid-cols-4 gap-4 mb-4 items-end">
                        <!-- Material -->
                        <div>
                            <label class="label">Material</label>
                            <el-select v-model="material.material" class="w-full" placeholder="Select material"
                                @change="onMaterialChange(index)" size="default">
                                <el-option v-for="item in materialList" :key="item._id" :label="item.name"
                                    :value="item._id" />
                            </el-select>
                        </div>

                        <!-- Unit -->
                        <div>
                            <label class="label">Unit</label>
                            <el-select v-model="material.unit" class="w-full" disabled size="default">
                                <el-option label="Liter" value="Liter" />
                                <el-option label="ML" value="ML" />
                                <el-option label="KG" value="KG" />
                                <el-option label="Gram" value="Gram" />
                            </el-select>
                        </div>

                        <!-- Quantity -->
                        <div>
                            <label class="label">Quantity</label>
                            <el-input v-model="material.quantity" type="number" size="default" />
                        </div>

                        <!-- Remove -->
                        <div class="flex justify-center">
                            <button v-if="materials.length > 1" @click="removeMaterial(index)" 
                                class="text-red-500 hover:text-red-700 transition">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ACTIONS -->
            <div class="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                <button class="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition text-sm sm:text-base">
                    Cancel
                </button>

                <button @click="submitForm" 
                    class="w-full sm:w-auto px-8 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-sm sm:text-base">
                    Save Batch
                </button>
            </div>
        </div>
        
        <!-- Toast message -->
        <Toast v-if="toast.show" :message="toast.message" :type="toast.type" @close="toast.show = false" />
    </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue"
import api from "@/services/api";
import Toast from "@/components/common/toast.vue";

/* ---------------- STATE ---------------- */
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
    const num = parseInt(lastCode.split("-")[1])
    return `BATCH-${num + 1}`
}

/* ---------------- API CALLS ---------------- */
const fetchMaterials = async () => {
    try {
        const res = await api.get("/batch/materials")
        materialList.value = res.data.materials
    } catch (error) {
        showToast("Failed to fetch materials", "error")
    }
}

const fetchLastBatch = async () => {
    try {
        const res = await api.get("/batch/batches")
        if (res.data.batches?.length) {
            form.batchCode = getNextBatchCode(res.data.batches[0].batchCode)
        } else {
            form.batchCode = "BATCH-1001"
        }
    } catch (error) {
        showToast("Failed to fetch batch code", "error")
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
    } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to save batch"
        showToast(errorMessage, "error")
    }
}

/* ---------------- INIT ---------------- */
onMounted(async () => {
    await fetchMaterials()
    await fetchLastBatch()
})
</script>

<style scoped>
.label {
    display: block;
    font-size: 0.75rem;
    /* text-xs on mobile */
    margin-bottom: 0.25rem;
    font-weight: 500;
    color: #4b5563;
}

@media (min-width: 640px) {
    .label {
        font-size: 0.875rem;
        /* text-sm on larger screens */
    }
}
</style>