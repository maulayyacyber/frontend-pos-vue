import { createApp } from 'vue'

//import config router
import router from './routes'

//import App component
import App from './App.vue'

//import pinia
import { createPinia } from 'pinia'

//initialize pinia
const pinia = createPinia()

//initialize vue
const app = createApp(App)

//use router on vue
app.use(router)

//use pinia on vue
app.use(pinia)

//mount root app element
app.mount('#app')