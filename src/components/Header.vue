<script setup>
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  
  const theme = ref('light');
  const user = ref({
    name: 'John Doe',
    email: 'john.doe@example.com',
    id: 1
  });
  
  const changeTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme.value);
  };
  
  const router = useRouter();
  const route = useRoute();
  
  const isActive = (path) => {
    if (Array.isArray(path)) {
      return path.some((p) => route.path.startsWith(p));
    }
    return route.path.startsWith(path);
  };
  
  const logoutHandler = () => {
    // Handle logout
    console.log('Logging out...');
  };
  </script>

<template>
    <div class="sticky-top">
      <header class="navbar navbar-expand-md d-print-none sticky-top">
        <div class="container-xl">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar-menu" aria-controls="navbar-menu" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
            <router-link to="/">
              <img src="/images/logo.png" width="100" height="32" alt="Tabler" class="navbar-brand-image" />
              <label class="ms-2">CASHIER APPS</label>
            </router-link>
          </h1>
          <div class="navbar-nav flex-row order-md-last">
            <div class="d-none d-md-flex me-2">
              <button v-if="theme === 'dark'" @click="changeTheme" class="nav-link px-0" title="Enable light mode" data-bs-toggle="tooltip" data-bs-placement="bottom">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                  <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
                </svg>
              </button>
              <button v-else @click="changeTheme" class="nav-link px-0" title="Enable dark mode" data-bs-toggle="tooltip" data-bs-placement="bottom">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                </svg>
              </button>
            </div>
            <div class="nav-item dropdown">
              <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown" aria-label="Open user menu">
                <span class="avatar avatar-sm" :style="{ backgroundImage: 'url(/images/boy.png)' }"></span>
                <div class="d-none d-xl-block ps-2">
                  <div>{{ user?.name }}</div>
                  <div class="mt-1 small text-muted">{{ user?.email }}</div>
                </div>
              </a>
              <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow rounded mt-2">
                <router-link :to="`/users/${user?.id}`" class="dropdown-item">Profile</router-link>
                <div class="dropdown-divider"></div>
                <a href="#" @click="logoutHandler" class="dropdown-item">Logout</a>
              </div>
            </div>
          </div>
        </div>
      </header>
  
      <header class="navbar-expand-md">
        <div class="collapse navbar-collapse" id="navbar-menu">
          <div class="navbar bg-muted-lt">
            <div class="container-xl">
              <ul class="navbar-nav">
                <li :class="['nav-item', { active: isActive('/dashboard') }]">
                  <router-link class="nav-link" to="/dashboard">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                        <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                      </svg>
                    </span>
                    <span class="nav-link-title">HOME</span>
                  </router-link>
                </li>
                <li :class="['nav-item dropdown', { active: isActive(['/categories', '/products']) }]">
                  <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-auto-close="outside" role="button" aria-expanded="false">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-box" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5" />
                        <path d="M12 12l8 -4.5" />
                        <path d="M12 12l0 9" />
                        <path d="M12 12l-8 -4.5" />
                      </svg>
                    </span>
                    <span class="nav-link-title">MASTER</span>
                  </a>
                  <div class="dropdown-menu">
                    <router-link class="dropdown-item" to="/categories">Categories</router-link>
                    <router-link class="dropdown-item" to="/products">Products</router-link>
                  </div>
                </li>
                <li :class="['nav-item', { active: isActive('/customers') }]">
                  <router-link class="nav-link" to="/customers">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-users" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                      </svg>
                    </span>
                    <span class="nav-link-title">CUSTOMERS</span>
                  </router-link>
                </li>
                <li :class="['nav-item', { active: isActive('/transactions') }]">
                  <router-link class="nav-link" to="/transactions">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M6 6h15l-1.68 8.39a2 2 0 0 1 -1.97 1.61h-9.7a2 2 0 0 1 -1.97 -1.61l-1.68 -8.39" />
                        <path d="M9 21a1 1 0 1 0 1 1" />
                        <path d="M18 21a1 1 0 1 0 1 1" />
                      </svg>
                    </span>
                    <span class="nav-link-title">TRANSACTIONS</span>
                  </router-link>
                </li>
                <li :class="['nav-item', { active: isActive('/reports') }]">
                  <router-link class="nav-link" to="/reports">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-chart-line" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 3v18h18" />
                        <path d="M9 9l3 3l3 -3l3 3" />
                      </svg>
                    </span>
                    <span class="nav-link-title">REPORTS</span>
                  </router-link>
                </li>
                <li :class="['nav-item', { active: isActive('/settings') }]">
                  <router-link class="nav-link" to="/settings">
                    <span class="nav-link-icon d-md-none d-lg-inline-block">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icons-tabler-outline icon-tabler-settings" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 15m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                        <path d="M12 3a9 9 0 0 0 -8.941 8.002a2 2 0 0 0 0 3.996a9 9 0 0 0 17.883 0a2 2 0 0 0 0 -3.996a9 9 0 0 0 -8.942 -8.002z" />
                      </svg>
                    </span>
                    <span class="nav-link-title">SETTINGS</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  </template>
  
  
  