<script setup>
// Import ref dan onMounted
import { ref, onMounted } from "vue";

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from "js-cookie";

// Import helper getImageUrl
import { getImageUrl } from "../../utils/getImageUrl";

//import helper moneyFormat
import { moneyFormat } from "../../utils/moneyFormat";

//import view product create
import ProductCreate from "./create.vue";

// //import view product edit
import ProductEdit from "./edit.vue";

//import button delete
import DeleteButton from "../../components/DeleteButton.vue";

//import component barcode
import Barcode from "./components/Barcode.vue";

// State untuk menyimpan products dan pagination
const products = ref([]);
const pagination = ref({
    currentPage: 1,
    perPage: 5,
    total: 0,
});

// State keywords
const keywords = ref("");

// Method untuk mengambil data dari API
const fetchData = async (pageNumber = 1, search = "") => {
    const token = Cookies.get("token");

    if (token) {
        Api.defaults.headers.common["Authorization"] = token;

        try {
            const response = await Api.get(
                `/api/products?page=${pageNumber}&search=${search}`
            );
            products.value = response.data.data;
            pagination.value = {
                currentPage: response.data.pagination.currentPage,
                perPage: response.data.pagination.perPage,
                total: response.data.pagination.total,
            };
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    } else {
        console.error("Token is not available!");
    }
};

// Ambil data ketika komponen di-mount
onMounted(() => {
    fetchData();
});

// Handler untuk pencarian
const searchHandler = () => {
    fetchData(1, keywords.value);
};

// Handler untuk menangani event keydown
const handleKeyDown = (e) => {
    if (e.key === "Enter") {
        searchHandler();
    }
};

</script>

<template>
    <LayoutAdmin>
        <div class="page-header d-print-none">
            <div class="container-xl">
                <div class="row g-2 align-items-center">
                    <div class="col">
                        <div class="page-pretitle">HALAMAN</div>
                        <h2 class="page-title">PRODUCTS</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="input-group">
                            <ProductCreate :fetchData="fetchData" />
                            <input type="text" class="form-control" v-model="keywords" @keydown="handleKeyDown"
                                placeholder="search by product name" />
                            <button @click="searchHandler" class="btn btn-md btn-primary">
                                SEARCH
                            </button>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="card">
                            <div class="table-responsive">
                                <table class="table table-vcenter table-mobile-md card-table">
                                    <thead>
                                        <tr>
                                            <th style="width: 5%">Barcode</th>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Buy Price</th>
                                            <th>Sell Price</th>
                                            <th>Stock</th>
                                            <th className="w-1">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(product, index) in products" :key="index">
                                            <td data-label="Barcode">
                                                <Barcode :value="product.barcode" :format="'CODE39'" :lineColor="'#000'"
                                                    :width="1" :height="20" :fontSize="10" />
                                            </td>

                                            <td data-label="Product Name">
                                                <div className="d-flex py-1 align-items-center">
                                                    <span className="avatar me-2" :style="{
                                backgroundImage: `url(${getImageUrl(
                                    product.image
                                )})`,
                            }"></span>
                                                    <div className="flex-fill">
                                                        <div className="font-weight-medium">{{ product.title }}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td data-label="Category">
                                                {{ product.category.name }}
                                            </td>
                                            <td data-label="Buy Price">
                                                {{ moneyFormat(product.buy_price) }}
                                            </td>
                                            <td data-label="Sell Price">
                                                {{ moneyFormat(product.sell_price) }}
                                            </td>
                                            <td data-label="Stock">
                                                {{ product.stock }}
                                            </td>
                                            <td>
                                                <div class="btn-list flex-nowrap">
                                                    <ProductEdit :productId="product.id" :fetchData="fetchData" />
                                                    <DeleteButton :id="product.id" endpoint="/api/products"
                                                        :fetchData="fetchData" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="!products.length">
                                            <td colspan="4" class="text-center">
                                                <div class="alert alert-danger mb-0">
                                                    Data Belum Tersedia!
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div class="text-end">
                                    <vue-awesome-paginate :total-items="pagination.total"
                                        :items-per-page="pagination.perPage" :max-pages-shown="2"
                                        v-model="pagination.currentPage" @click="fetchData" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutAdmin>
</template>
