import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import VueApexCharts from "vue3-apexcharts"



// createApp(App).use(router).mount('#app')
const app = createApp(App)

app.use(ElementPlus)
app.use(VueApexCharts)
app.use(router)

app.mount('#app')
