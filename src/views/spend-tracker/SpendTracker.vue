<template>
  <div class="p-6 bg-[#F8F9FC] min-h-screen font-sans text-slate-700">
    <header class="mb-8">
      <h1 class="text-2xl font-bold text-[#1e293b]">Spend Overview</h1>
      <p class="text-slate-500 text-sm">Overview of recent expenditures and new transaction entry</p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <p class="text-slate-500 text-xs font-medium mb-1 uppercase tracking-wider">{{ stat.label }}</p>
          <p class="text-2xl font-bold text-slate-800 tracking-tight">{{ stat.prefix }}{{ stat.value }}</p>
        </div>
        <div :class="stat.iconBg" class="p-3 rounded-xl flex items-center justify-center">
          <svg v-if="stat.id === 'total'" class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
          <svg v-if="stat.id === 'month'" class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          <svg v-if="stat.id === 'pending'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <svg v-if="stat.id === 'highest'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div class="lg:col-span-4">
        <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div class="flex items-center gap-3 mb-8 text-[#7C3AED]">
            <div class="w-6 h-6 rounded-full border-2 border-[#7C3AED] flex items-center justify-center">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" /></svg>
            </div>
            <h2 class="font-bold text-lg">Add New Transaction</h2>
          </div>

          <el-form :model="form" label-position="top" class="custom-form">
            <el-form-item label="Transaction Date">
              <el-date-picker
                v-model="form.date"
                type="date"
                placeholder="mm/dd/yyyy"
                class="!w-full !h-11"
              />
            </el-form-item>

            <el-form-item label="Paid By">
              <el-select v-model="form.paidBy" placeholder="Select Person" class="!w-full !h-11">
                <el-option v-for="p in people" :key="p" :label="p" :value="p" />
              </el-select>
            </el-form-item>

            <el-form-item label="Subject">
              <el-input v-model="form.subject" placeholder="e.g. Raw material purchase" class="!h-11" />
            </el-form-item>

            <el-form-item label="Notes">
              <el-input
                v-model="form.notes"
                type="textarea"
                placeholder="Additional details..."
                :rows="4"
              />
            </el-form-item>

            <button 
              type="button"
              class="w-full bg-[#7C3AED] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#6D28D9] transition-colors mt-4 shadow-md shadow-purple-100"
              @click="handleSave"
            >
              Save Transaction
            </button>
          </el-form>
        </div>
      </div>

      <div class="lg:col-span-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-6 flex justify-between items-center border-b border-slate-50">
            <div class="flex items-center gap-3 text-[#7C3AED] font-bold">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h2 class="text-lg">Recent Transactions</h2>
            </div>
            <button class="text-[#7C3AED] text-sm font-bold hover:text-purple-800 transition-colors">View All</button>
          </div>

          <div class="p-2">
            <el-table :data="transactions" style="width: 100%" class="transaction-table">
              <el-table-column prop="date" label="DATE" width="130" />
              <el-table-column prop="subject" label="SUBJECT">
                <template #default="{ row }">
                  <span class="font-bold text-slate-700 uppercase text-xs">{{ row.subject }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="paidBy" label="PAID BY" width="120" />
              <el-table-column prop="amount" label="AMOUNT" width="120">
                <template #default="{ row }">
                  <span class="font-bold text-[#7C3AED]">₹ {{ row.amount.toLocaleString() }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="STATUS" width="130">
                <template #default="{ row }">
                  <span 
                    :class="[
                      'px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest',
                      row.status === 'Complete' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    ]"
                  >
                    {{ row.status }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="px-6 py-5 flex justify-between items-center text-xs text-slate-400 border-t border-slate-50">
            <p>Showing 1 to 5 of 42 entries</p>
            <div class="flex gap-2">
              <button class="px-4 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-semibold">Prev</button>
              <button class="px-4 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 font-semibold">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

/**
 * SAMPLE DATA
 * Replace these values with API calls later (e.g., using onMounted)
 */
const stats = ref([
  { id: 'total', label: 'Total Spends', value: '42,500', prefix: '₹ ', iconBg: 'bg-purple-50' },
  { id: 'month', label: 'This Month', value: '12,320', prefix: '₹ ', iconBg: 'bg-blue-50' },
  { id: 'pending', label: 'Pending Approvals', value: '05', prefix: '', iconBg: 'bg-amber-50' },
  { id: 'highest', label: 'Highest Spend', value: '8,400', prefix: '₹ ', iconBg: 'bg-red-50' },
])

const people = ['Person 1', 'Person 2', 'Person 3', 'Person 4']

const transactions = ref([
  { date: 'Oct 12, 2024', subject: 'Office Stationery', paidBy: 'Person 1', amount: 1200, status: 'Complete' },
  { date: 'Oct 10, 2024', subject: 'Logistics Fee', paidBy: 'Person 3', amount: 4500, status: 'Pending' },
  { date: 'Oct 08, 2024', subject: 'Repair & Maintenance', paidBy: 'Person 2', amount: 3400, status: 'Complete' },
  { date: 'Oct 05, 2024', subject: 'Electricity Bill', paidBy: 'Person 4', amount: 8400, status: 'Complete' },
  { date: 'Oct 01, 2024', subject: 'Packaging Material', paidBy: 'Person 1', amount: 15200, status: 'Complete' },
])

/**
 * FORM DATA
 */
const form = reactive({
  date: '',
  paidBy: 'Person 1',
  subject: '',
  notes: ''
})

const handleSave = () => {
  console.log('API payload prepared:', JSON.stringify(form))
  // Ready for axios.post('/transactions', form)
}
</script>

<style scoped>
/* Scoped overrides to match design pixel-perfectly */

:deep(.el-input__wrapper), 
:deep(.el-textarea__inner) {
  @apply shadow-none border-slate-200 rounded-lg bg-white !important;
}

:deep(.el-form-item__label) {
  @apply text-slate-500 font-semibold mb-1 !important;
}

/* Table styling */
:deep(.transaction-table .el-table__header th) {
  @apply bg-[#F8F9FC] text-slate-400 font-bold text-[11px] py-4 tracking-wider !important;
}

:deep(.transaction-table .el-table__row td) {
  @apply py-4 text-[13px] border-slate-50 !important;
}

/* Remove default focus outline on El components */
:deep(.el-input__wrapper.is-focus) {
  @apply ring-2 ring-purple-100 !important;
}
</style>