//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//import store user
import { useUser } from '../stores/auth'

//define a routes
const routes = [
    {
        path: '/',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next('/dashboard') : next()
        },
        name: 'login',
        component: () => import( /* webpackChunkName: "home" */ '../views/auth/login.vue')
    },
    {
        path: '/dashboard',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'dashboard',
        component: () => import( /* webpackChunkName: "home" */ '../views/dashboard/index.vue'),
    },
]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router