//import vue router
import { createRouter, createWebHistory } from 'vue-router'

//import store user
import { useUser } from '../stores/user'

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
    {
        path: '/categories',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'categories',
        component: () => import( /* webpackChunkName: "home" */ '../views/categories/index.vue'),
    },
    {
        path: '/products',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'products',
        component: () => import( /* webpackChunkName: "home" */ '../views/products/index.vue'),
    },
    {
        path: '/customers',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'customers',
        component: () => import( /* webpackChunkName: "home" */ '../views/customers/index.vue'),
    },
    {
        path: '/users',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'users',
        component: () => import( /* webpackChunkName: "home" */ '../views/users/index.vue'),
    },
    {
        path: '/transactions',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'transactions',
        component: () => import( /* webpackChunkName: "home" */ '../views/transactions/index.vue'),
    },
    {
        path: '/transactions/print',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'transactions.print',
        component: () => import( /* webpackChunkName: "home" */ '../views/transactions/print/print.vue'),
    },
    {
        path: '/sales',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'sales',
        component: () => import( /* webpackChunkName: "home" */ '../views/sales/index.vue'),
    },
    {
        path: '/profits',
        beforeEnter: (to, from, next) => {
            useUser().getToken ? next() : next('/')
        },
        name: 'profits',
        component: () => import( /* webpackChunkName: "home" */ '../views/profits/index.vue'),
    }

]

//create router
const router = createRouter({
    history: createWebHistory(),
    routes // <-- routes,
})

export default router