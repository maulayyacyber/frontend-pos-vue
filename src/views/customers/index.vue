<script setup>
// Import ref dan onMounted
import { ref, onMounted } from "vue";

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from "js-cookie";

//import view customer create
import CustomerCreate from "./create.vue";

//import view customer edit
import CustomerEdit from "./edit.vue";

//import button delete
import DeleteButton from "../../components/DeleteButton.vue";

// State untuk menyimpan customers dan pagination
const customers = ref([]);
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
                `/api/customers?page=${pageNumber}&search=${search}`
            );
            customers.value = response.data.data;
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
                        <h2 class="page-title">CUSTOMERS</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row">
                    <div class="col-12 mb-3">
                        <div class="input-group">
                            <CustomerCreate :fetchData="fetchData" />
                            <input type="text" class="form-control" v-model="keywords" @keydown="handleKeyDown"
                                placeholder="search by customer name" />
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
                                            <th>Customer Name</th>
                                            <th>No. Telp</th>
                                            <th>Address</th>
                                            <th class="w-1">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(customer, index) in customers" :key="index">
                                            <td data-label="Customer Name">
                                                {{ customer.name }}
                                            </td>

                                            <td data-label="No. Telp">
                                                {{ customer.phone }}
                                            </td>

                                            <td data-label="Address">
                                                {{ customer.address }}
                                            </td>

                                            <td>
                                                <div class="btn-list flex-nowrap">
                                                    <CustomerEdit :customerId="customer.id" :fetchData="fetchData" />
                                                    <DeleteButton :id="customer.id" endpoint="/api/customers" :fetchData="fetchData" />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr v-if="!customers.length">
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
