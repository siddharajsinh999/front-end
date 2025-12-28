<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <!-- Page Title -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        ℹ️ About SBE Stock System 
      </h1>
      <p class="text-gray-500 mt-1">Learn more about our inventory management platform</p>
    </div>

    <!-- About Section -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-700 mb-3">Our Purpose</h2>
      <p class="text-gray-600">
        SBE Stock System is designed to help businesses manage their inventory, track batches,
        and handle raw materials efficiently. Our goal is to simplify stock management and
        provide real-time insights for better decision-making.
      </p>
    </div>

    <!-- Features Section -->
    <div class="grid md:grid-cols-2 gap-6 mb-6">
      <div class="bg-white shadow rounded-lg p-5 flex flex-col gap-3">
        <h3 class="text-lg font-semibold text-gray-700">Inventory Management</h3>
        <p class="text-gray-600">
          Keep track of all your products and stock levels easily, with detailed summaries
          and alerts for low stock.
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-5 flex flex-col gap-3">
        <h3 class="text-lg font-semibold text-gray-700">Batch Tracking</h3>
        <p class="text-gray-600">
          Monitor production batches from start to finish, ensuring quality control and accurate
          batch data.
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-5 flex flex-col gap-3">
        <h3 class="text-lg font-semibold text-gray-700">Raw Material Management</h3>
        <p class="text-gray-600">
          Track raw materials, their usage, and availability to avoid production delays.
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-5 flex flex-col gap-3">
        <h3 class="text-lg font-semibold text-gray-700">Analytics & Insights</h3>
        <p class="text-gray-600">
          Get historical data and trends to make informed decisions, optimize stock,
          and plan future orders efficiently.
        </p>
      </div>
    </div>

    <!-- Footer / Contact Info -->
    <div class="bg-white shadow rounded-lg p-6 text-center">
      <h2 class="text-lg font-semibold text-gray-700 mb-2">Contact Us</h2>
      <p class="text-gray-600 mb-1">Email: support@sbe-stock.com</p>
      <p class="text-gray-600">Phone: +91 12345 67890</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* Optional small hover effect on feature cards */
.bg-white.shadow.rounded-lg:hover {
  transform: translateY(-3px);
  transition: 0.3s ease;
}
</style>
