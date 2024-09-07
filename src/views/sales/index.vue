<script setup>

// Import ref
import { ref } from 'vue';

// Import LayoutAdmin
import LayoutAdmin from '../../layouts/admin.vue';

// Import services api
import Api from '../../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

// Import moneyFormat
import { moneyFormat } from '../../utils/moneyFormat';

// Import ExportButton
import ExportButton from '../../components/ExportButton.vue';

// State variables
const startDate = ref('');
const endDate = ref('');
const sales = ref([]);
const total = ref(0);

// Token
const token = Cookies.get('token');

// Function to filter sales
const filterSales = async (event) => {
    event.preventDefault();

    if (token) {
        // Set authorization header with token
        Api.defaults.headers.common['Authorization'] = token;

        try {
            // Fetch data from API with Axios
            const response = await Api.get(`/api/sales?start_date=${startDate.value}&end_date=${endDate.value}`);

            // Assign response data to state variables
            sales.value = response.data.data.sales;
            total.value = response.data.data.total;
        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    } else {
        console.error("Token is not available!");
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
                        <h2 class="page-title">REPORT SALES</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row">
                    <div class="col-md-12">
                        <div class="card">
                            <div class="card-body">
                                <form @submit="filterSales">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">START DATE</label>
                                                <input type="date" class="form-control" v-model="startDate" />
                                            </div>
                                        </div>
                                        <div class="col-md-5">
                                            <div class="mb-3">
                                                <label class="form-label fw-bold">END DATE</label>
                                                <input type="date" class="form-control" v-model="endDate" />
                                            </div>
                                        </div>
                                        <div class="col-md-2">
                                            <div class="mb-3">
                                                <label class="form-label fw-bold text-white">*</label>
                                                <button class="btn btn-md btn-primary border-0 shadow w-100 rounded"
                                                    type="submit">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                                        class="icon icon-tabler icons-tabler-outline icon-tabler-filter">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path
                                                            d="M4 4h16v2.172a2 2 0 0 1 -.586 1.414l-4.414 4.414v7l-6 2v-8.5l-4.48 -4.928a2 2 0 0 1 -.52 -1.345v-2.227z" />
                                                    </svg>
                                                    FILTER
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                                <div v-if="sales.length > 0">
                                    <div class="export text-end mb-3 mt-5">
                                        <ExportButton :startDate="startDate" :endDate="endDate" type="sales" />
                                    </div>
                                    <table class="table table-bordered">
                                        <thead>
                                            <tr style="background-clip: #e6e6e7">
                                                <th scope="col">Date</th>
                                                <th scope="col">Invoice</th>
                                                <th scope="col">Cashier</th>
                                                <th scope="col">Customer</th>
                                                <th scope="col">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(sale, index) in sales" :key="index">
                                                <td>{{ sale.created_at }}</td>
                                                <td>{{ sale.invoice }}</td>
                                                <td>{{ sale.cashier.name }}</td>
                                                <td>{{ sale.customer?.name ?? 'Umum' }}</td>
                                                <td class="text-end">{{ moneyFormat(sale.grand_total) }}</td>
                                            </tr>
                                            <tr>
                                                <td colspan="4" class="text-end fw-bold">Total</td>
                                                <td class="text-end fw-bold">{{ moneyFormat(total) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutAdmin>
</template>

<style scoped>
/* Add any scoped styles here if needed */
</style>
