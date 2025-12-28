<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-10">
    <div class="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-start gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-semibold text-gray-900 mb-1 sm:mb-2">Sales Portal Dashboard</h1>
        <p class="text-sm sm:text-base text-gray-600">Monitor and manage your wholesale and retail sales</p>
      </div>
      <button 
        @click="dialogVisible = true"
        class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Sale
      </button>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      <div class="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm flex items-start gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Buyers</p>
          <p class="text-2xl sm:text-3xl font-semibold text-gray-900">8</p>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm flex items-start gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
            <polyline points="16 7 22 7 22 13"></polyline>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Sales</p>
          <p class="text-2xl sm:text-3xl font-semibold text-gray-900">40,600 <span class="text-xs sm:text-sm text-gray-600 font-normal">units</span></p>
        </div>
      </div>

      <div class="bg-white p-4 sm:p-6 rounded-lg sm:rounded-xl shadow-sm flex items-start gap-3 sm:gap-4">
        <div class="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-gray-600 text-xs sm:text-sm mb-1 sm:mb-2">Total Revenue</p>
          <p class="text-2xl sm:text-3xl font-semibold text-gray-900">$1,015,000</p>
        </div>
      </div>
    </div>

    <!-- Tabs and Table -->
    <div class="bg-white rounded-lg sm:rounded-xl shadow-sm overflow-hidden">
      <div class="border-b border-gray-200 overflow-x-auto">
        <div class="flex">
          <button 
            :class="[
              'px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium relative whitespace-nowrap',
              activeTab === 'wholesale' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
            @click="activeTab = 'wholesale'"
          >
            Wholesale
          </button>
          <button 
            :class="[
              'px-6 sm:px-8 py-3 sm:py-4 text-sm font-medium relative whitespace-nowrap',
              activeTab === 'retail' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-gray-800'
            ]"
            @click="activeTab = 'retail'"
          >
            Retail
          </button>
        </div>
      </div>

      <div class="p-4 sm:p-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div class="flex-1 relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input 
            type="text" 
            placeholder="Search by buyer name..." 
            v-model="searchQuery"
            class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select 
          v-model="statusFilter" 
          class="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      <!-- Mobile Card View -->
      <div class="block lg:hidden px-4 pb-4 space-y-3">
        <div v-if="filteredSales.length === 0" class="py-12 text-center">
          <div class="flex flex-col items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p class="text-gray-500 text-base font-medium">No Data Found</p>
            <p class="text-gray-400 text-xs mt-1">Try adjusting your search or filter</p>
          </div>
        </div>
        
        <div v-for="sale in filteredSales" :key="sale.id" class="bg-gray-50 rounded-lg p-4 space-y-3">
          <div class="flex justify-between items-start gap-2">
            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-sm text-gray-900 truncate">{{ sale.buyerName }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ sale.date }}</p>
            </div>
            <span :class="[
              'inline-block px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0',
              sale.status.toLowerCase() === 'paid' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            ]">
              {{ sale.status }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p class="text-xs text-gray-500">Quantity</p>
              <p class="font-medium text-gray-900">{{ sale.quantity.toLocaleString() }}</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Amount</p>
              <p class="font-medium text-gray-900">${{ sale.amount.toLocaleString() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Buyer Name <span class="text-gray-400">↕</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Date <span class="text-gray-400">↕</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Quantity <span class="text-gray-400">↕</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Total Amount <span class="text-gray-400">↕</span>
              </th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Payment Status <span class="text-gray-400">↕</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="filteredSales.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-16 h-16 text-gray-300 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <p class="text-gray-500 text-lg font-medium">No Data Found</p>
                  <p class="text-gray-400 text-sm mt-1">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
            <tr v-for="sale in filteredSales" :key="sale.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ sale.buyerName }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ sale.date }}</td>
              <td class="px-6 py-4 text-sm text-gray-700">{{ sale.quantity.toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm font-medium text-gray-900">${{ sale.amount.toLocaleString() }}</td>
              <td class="px-6 py-4 text-sm">
                <span :class="[
                  'inline-block px-3 py-1.5 rounded-full text-xs font-medium',
                  sale.status.toLowerCase() === 'paid' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                ]">
                  {{ sale.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Element Plus Dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="Add New Sale"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <template #header>
        <div>
          <h2 class="text-lg sm:text-xl font-semibold text-gray-900">Add New Sale</h2>
          <p class="text-xs sm:text-sm text-gray-500 mt-1">Add a new wholesale sale record</p>
        </div>
      </template>

      <el-form :model="formData" label-position="top" class="space-y-3 sm:space-y-4">
        <el-form-item label="Buyer Name" required>
          <el-input 
            v-model="formData.buyerName" 
            placeholder="Enter buyer name"
            size="default"
          />
        </el-form-item>

        <el-form-item label="Total Quantity" required>
          <el-input 
            v-model.number="formData.quantity" 
            type="number"
            placeholder="Enter quantity"
            size="default"
          />
        </el-form-item>

        <el-form-item label="Total Amount ($)" required>
          <el-input 
            v-model.number="formData.amount" 
            type="number"
            placeholder="Enter amount"
            size="default"
          />
        </el-form-item>

        <el-form-item label="Payment Status" required>
          <el-select 
            v-model="formData.status" 
            placeholder="Select status"
            size="default"
            class="w-full"
          >
            <el-option label="Pending" value="Pending" />
            <el-option label="Paid" value="Paid" />
            <el-option label="Overdue" value="Overdue" />
          </el-select>
        </el-form-item>

        <el-form-item label="Date" required>
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="Select date"
            size="default"
            class="w-full"
            format="MM/DD/YYYY"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <el-button @click="closeDialog" size="default" class="w-full sm:flex-1 order-2 sm:order-1">
            Cancel
          </el-button>
          <el-button type="primary" @click="handleAddSale" size="default" class="w-full sm:flex-1 order-1 sm:order-2">
            Add Sale
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: 'SalesPortalDashboard',
  setup() {
    const activeTab = ref('wholesale');
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const dialogVisible = ref(false);

    const dialogWidth = computed(() => {
      if (typeof window === 'undefined') return '500px';
      return window.innerWidth < 640 ? '95%' : '500px';
    });

    const formData = ref({
      buyerName: '',
      quantity: null,
      amount: null,
      status: 'Pending',
      date: new Date()
    });

    const salesData = ref([
      {
        id: 1,
        buyerName: 'ABC Supermarket Chain',
        date: 'Dec 18, 2025',
        quantity: 5000,
        amount: 125000,
        status: 'Paid'
      },
      {
        id: 2,
        buyerName: 'Metro Distribution Co.',
        date: 'Dec 17, 2025',
        quantity: 3500,
        amount: 87500,
        status: 'Pending'
      },
      {
        id: 3,
        buyerName: 'Global Retailers Inc.',
        date: 'Dec 16, 2025',
        quantity: 8000,
        amount: 200000,
        status: 'Paid'
      }
    ]);

    const filteredSales = computed(() => {
      return salesData.value.filter(sale => {
        const matchesSearch = sale.buyerName.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesStatus = statusFilter.value === 'all' || sale.status.toLowerCase() === statusFilter.value;
        return matchesSearch && matchesStatus;
      });
    });

    const formatDate = (date) => {
      const d = new Date(date);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    const handleAddSale = () => {
      if (!formData.value.buyerName || !formData.value.quantity || !formData.value.amount || !formData.value.date) {
        return;
      }

      const newSale = {
        id: salesData.value.length + 1,
        buyerName: formData.value.buyerName,
        date: formatDate(formData.value.date),
        quantity: formData.value.quantity,
        amount: formData.value.amount,
        status: formData.value.status
      };

      salesData.value.unshift(newSale);
      closeDialog();
    };

    const closeDialog = () => {
      dialogVisible.value = false;
      // Reset form
      formData.value = {
        buyerName: '',
        quantity: null,
        amount: null,
        status: 'Pending',
        date: new Date()
      };
    };

    return {
      activeTab,
      searchQuery,
      statusFilter,
      salesData,
      filteredSales,
      dialogVisible,
      dialogWidth,
      formData,
      handleAddSale,
      closeDialog
    };
  }
};
</script>

<style scoped></style>