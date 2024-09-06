import { createApp } from 'vue'

//import config router
import router from './routes'

//import App component
import App from './App.vue'

//import pinia
import { createPinia } from 'pinia'

//initialize pinia
const pinia = createPinia()

// import vue-awesome-paginate
import VueAwesomePaginate from "vue-awesome-paginate";
import "vue-awesome-paginate/dist/style.css";

//initialize vue
const app = createApp(App)

//use router on vue
app.use(router)

//use pinia on vue
app.use(pinia)

//use vue-awesome-paginate
app.use(VueAwesomePaginate);

//mount root app element
app.mount('#app')