import './assets/main.css'
import "@fortawesome/fontawesome-free/css/all.min.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { Quasar } from 'quasar'
import 'quasar/dist/quasar.css'                            // Quasar core CSS
import '@quasar/extras/material-icons/material-icons.css'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, { plugins: {} }) // you can add Quasar plugins here later


app.mount('#app')
