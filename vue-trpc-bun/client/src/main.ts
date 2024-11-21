import './assets/main.css'
import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import 'primevue/resources/themes/lara-light-blue/theme.css' // theme
import 'primevue/resources/primevue.min.css' // core CSS
import 'primeicons/primeicons.css' // icons
import '/node_modules/primeflex/primeflex.css' // utility CSS
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(PrimeVue)
app.use(VueQueryPlugin)
app.use(router)
app.component('Card', Card)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('InputText', InputText)
app.component('InputNumber', InputNumber)
app.mount('#app')
