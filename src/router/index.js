import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import InventoryView from '../views/InventoryView.vue'
import BatchView from '@/views/batch/BatchView.vue'
import BatchDetailsView from '@/views/batch/bathDetails/BatchDetailsView.vue'
import RawMaterial from '@/views/raw-material/RawMaterial.vue'
import NewBatch from '@/views/batch/CreateBatch.vue'
import SalesPortal from '@/views/sales-portal/SalesPortal.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView
  },
  {
    path: '/stock',
    name: 'stock',
    component: InventoryView
  },
  {
    path: '/batch',
    name: 'batch',
    component: BatchView
  },
  {
    path: "/batch/:id",
    name: "batch-details",
    component: BatchDetailsView,
    props: true
  },
  {
    path: '/raw-material',
    name: 'raw-material',
    component: RawMaterial
  },
  {
    path: '/new-batch',
    name: 'new-batch',
    component: NewBatch
  },
  {
    path: '/sales-portal',
    name: 'sales-portal',
    component: SalesPortal
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
