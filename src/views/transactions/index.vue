<script setup>

// Import ref dan onMounted
import { ref, onMounted } from 'vue';

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from 'js-cookie';

//import component ProductList
import ProductList from "./components/ProductList.vue";

//import component CategoryList
import CategoryList from "./components/CategoryList.vue";

//import component OrderItemList
import OrderItemList from "./components/OrderItemList.vue";

//import helper moneyFormat
import { moneyFormat } from "../../utils/moneyFormat";

//import component Payment
import Payment from "./components/Payment.vue";

// state products
const products = ref([]);

// define state "pagination"
const pagination = ref({
  currentPage: 1,
  perPage: 1,
  total: 0,
});

// state barcode
const barcode = ref("");

// ref search input
const searchInputRef = ref(null);

// state categories
const categories = ref([]);

// state currentCategoryId
const currentCategoryId = ref(null);

// state carts
const carts = ref([]);
const totalCarts = ref(0);

// token
const token = Cookies.get("token");

// function "fetchProducts"
const fetchProducts = async (pageNumber) => {
  if (token) {
    const page = pageNumber || pagination.value.currentPage;
    Api.defaults.headers.common['Authorization'] = token;

    await Api.get(`/api/products?page=${page}&limit=9`).then((response) => {
      products.value = response.data.data;
      pagination.value = {
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.total,
      };
    });
  }
};

// function "fetchProductByBarcode"
const fetchProductByBarcode = async (barcode) => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = token;

    await Api.post('/api/products-by-barcode', { barcode }).then((response) => {
      products.value = response.data.data;
    });
  }
};

// function searchHandler
const searchHandler = (e) => {
  barcode.value = e.target.value;
  fetchProductByBarcode(e.target.value);
};

// function "fetchCategories"
const fetchCategories = async () => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = token;

    await Api.get('/api/categories-all').then((response) => {
      categories.value = response.data.data;
    });
  }
};

// function "fetchProductByCategoryID"
const fetchProductByCategoryID = async (categoryId, pageNumber) => {
  if (token) {
    const page = pageNumber || pagination.value.currentPage;
    Api.defaults.headers.common['Authorization'] = token;

    await Api.get(`/api/products-by-category/${categoryId}?page=${page}&limit=9`).then((response) => {
      products.value = response.data.data;
      pagination.value = {
        currentPage: response.data.pagination.currentPage,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.total,
      };
    });
  }
};

// function "fetchCarts"
const fetchCarts = async () => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = token;

    await Api.get('/api/carts').then((response) => {
      carts.value = response.data.data;
      totalCarts.value = response.data.totalPrice;
    });
  }
};

// hook
onMounted(() => {
  fetchProducts();
  if (searchInputRef.value) {
    searchInputRef.value.focus();
  }
  fetchCategories();
  fetchCarts();
});

// Method untuk mengambil data dari API berdasarkan ID kategori dan halaman
const handlePageChange = (pageNumber) => {
  if (currentCategoryId.value) {
    fetchProductByCategoryID(currentCategoryId.value, pageNumber);
  } else {
    fetchProducts(pageNumber);
  }
};
</script>

<template>
  <LayoutAdmin>
    <div class="page-body">
      <div class="container-xl">
        <div class="row">
          <div class="col-md-8 mb-3">
            <!-- Search and Scan Barcode -->
            <form @submit.prevent="searchHandler" autocomplete="off" novalidate>
              <div class="input-icon">
                <span class="input-icon-addon">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                  </svg>
                </span>
                <input type="text" class="form-control" placeholder="Scan Barcode" v-model="barcode" @input="searchHandler" ref="searchInputRef" />
              </div>
            </form>

            <!-- Category List -->
            <CategoryList :categories="categories" :fetchProducts="fetchProducts" :fetchProductByCategoryID="fetchProductByCategoryID" @update:currentCategoryId="(newId) => currentCategoryId = newId" />

            <!-- Product List -->
            <ProductList :products="products" :fetchCarts="fetchCarts" />

            <!-- Pagination -->
            <div class="mt-3 text-center">
                <vue-awesome-paginate 
                    :total-items="pagination.total"
                    :items-per-page="pagination.perPage" 
                    :max-pages-shown="2"
                    v-model="pagination.currentPage" 
                    @click="handlePageChange"
                />
            </div>
          </div>

          <div class="col-md-4">
            <div class="card rounded">
              <div class="card-header p-3">
                <h3 class="mb-0">ORDER ITEMS</h3>
              </div>
              <div class="card-body scrollable-card-body p-0">
                <!-- Order Items -->
                <OrderItemList :carts="carts" :fetchCarts="fetchCarts" />
              </div>
              <div class="card-body">
                <div class="mt-3">
                  <h3 class="float-end">{{ moneyFormat(totalCarts) }}</h3>
                  <h3 class="mb-0">Total ({{ carts.length }} Items)</h3>
                </div>
                <hr />
                <Payment :totalCarts="totalCarts" :fetchCarts="fetchCarts" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutAdmin>
</template>
