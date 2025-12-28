<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">

    <!-- Mobile Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-black/40 z-40 lg:hidden">
    </div>

    <!-- Sidebar -->
    <aside
      class="fixed lg:static z-50 h-full w-72 bg-gradient-to-b from-purple-700 to-purple-900
             text-white p-6 flex flex-col
             transform transition-transform duration-300
             lg:translate-x-0"
      :class="isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >

      <!-- Brand -->
      <div class="mb-12 flex items-center gap-3">
        <div class="w-10 h-10 bg-white text-purple-700 grid place-items-center rounded-xl font-bold">
          S
        </div>
        <div>
          <h1 class="text-xl font-bold leading-tight">Shree Brahmani</h1>
          <p class="text-xs text-purple-200">Stock System</p>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="space-y-3">
        <RouterLink to="/" class="sidebar-link" @click="isSidebarOpen=false">
          🏠 <span>Home</span>
        </RouterLink>

        <RouterLink to="/stock" class="sidebar-link" @click="isSidebarOpen=false">
          📦 <span>Inventory</span>
        </RouterLink>

        <RouterLink to="/batch" class="sidebar-link" @click="isSidebarOpen=false">
          🧪 <span>Batch</span>
        </RouterLink>

        <RouterLink to="/raw-material" class="sidebar-link" @click="isSidebarOpen=false">
          🏭 <span>Raw Material</span>
        </RouterLink>

        <RouterLink to="/sales-portal" class="sidebar-link" @click="isSidebarOpen=false">
          💰 <span>Sales Portal</span>
        </RouterLink>

        <RouterLink to="/about" class="sidebar-link" @click="isSidebarOpen=false">
          ℹ️ <span>About</span>
        </RouterLink>
      </nav>

      <!-- Footer -->
      <div class="mt-auto text-xs text-purple-300 text-center pt-6 border-t border-purple-500">
        © 2025 SBE System
      </div>
    </aside>

    <!-- Main Section -->
    <div class="flex-1 flex flex-col">

      <!-- Header -->
      <header class="bg-white shadow-sm px-4 lg:px-8 py-4 flex items-center justify-between border-b">

        <!-- Left -->
        <div class="flex items-center gap-3">

          <!-- Hamburger (Mobile) -->
          <button
            @click="toggleSidebar"
            class="lg:hidden w-10 h-10 bg-gray-100 rounded-lg grid place-items-center">
            ☰
          </button>

          <!-- Icon -->
          <span
            class="w-10 h-10 bg-gradient-to-tr from-purple-600 to-indigo-600
                   text-white grid place-items-center rounded-xl shadow font-bold">
            📊
          </span>

          <!-- Title -->
          <div class="hidden sm:flex flex-col">
            <h2 class="text-lg font-bold text-gray-800 leading-tight">
              {{ String($route.name || 'Dashboard').toUpperCase() }}
            </h2>
            <p class="text-xs text-gray-500">
              Manage & monitor your business system
            </p>
          </div>
        </div>

        <!-- Right -->
        <div class="flex items-center gap-4 relative">

          <!-- Notification -->
          <div ref="notificationRef" class="relative">
            <button
              @click="toggleNotifications"
              class="relative w-10 h-10 bg-gray-100 hover:bg-purple-100
                     grid place-items-center rounded-full transition">
              🔔
              <span class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <!-- Dropdown -->
            <transition name="fade">
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-xl overflow-hidden z-50">
                <div class="p-3 border-b font-semibold text-gray-700">
                  Notifications
                </div>
                <ul>
                  <li
                    v-for="(note, index) in notifications"
                    :key="index"
                    class="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm text-gray-600">
                    {{ note }}
                  </li>
                  <li
                    v-if="notifications.length === 0"
                    class="px-4 py-3 text-sm text-gray-400">
                    No new notifications
                  </li>
                </ul>
              </div>
            </transition>
          </div>

          <!-- Profile -->
          <div
            class="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-tr from-purple-600 to-purple-800
                   rounded-full grid place-items-center text-white font-bold shadow-lg cursor-pointer">
            S
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 lg:p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const isSidebarOpen = ref(false)
const showNotifications = ref(false)
const notificationRef = ref(null)

const notifications = ref([
  'Low stock alert: Perfume XYZ',
  'New batch completed: Batch #12',
  'Raw material shortage: Chemical ABC',
  'Order #234 pending approval'
])

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function handleClickOutside(event) {
  if (notificationRef.value && !notificationRef.value.contains(event.target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 14px;
  transition: 0.25s;
  font-size: 14px;
  font-weight: 500;
  position: relative;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.router-link-active {
  background: white;
  color: #6b21a8;
  font-weight: 600;
}

.router-link-active::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 10%;
  height: 80%;
  width: 4px;
  background: #facc15;
  border-radius: 10px;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
