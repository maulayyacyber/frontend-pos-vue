<script setup>

// Import ref and onMounted
import { ref, onMounted, watchEffect } from 'vue';

// Import LayoutAdmin
import LayoutAdmin from "../../layouts/admin.vue";

// Import services api
import Api from "../../services/api";

// Import js-cookie
import Cookies from 'js-cookie';

//import helper moneyFormat
import { moneyFormat } from "../../utils/moneyFormat";

//import apexcharts
import VueApexCharts from "vue3-apexcharts";

//import helper generateRandomColors
import generateRandomColors from "../../utils/generateRandomColors";

//import helper getImageUrl
import { getImageUrl } from "../../utils/getImageUrl";

// State sales
const countSalestoday = ref(0);
const sumSalestoday = ref(0);
const sumSalesWeek = ref(0);
const salesDate = ref([]);
const salesTotal = ref([]);
const salesChartOptions = ref({});
const salesChartSeries = ref([]);


// State profits
const sumProfitsToday = ref(0);
const sumProfitsWeek = ref(0);
const profitsDate = ref([]);
const profitsTotal = ref([]);
const profitsChartOptions = ref({});
const profitsChartSeries = ref([]);

// State products best selling
const productsBestSelling = ref([]);
const bestProductSellingchartOptions = ref({});
const bestProductSellingchartSeries = ref([]);

// State products limit stock
const productsLimitStock = ref([]);

// Function to fetch data
const fetchData = async () => {
    const token = Cookies.get("token");

    if (token) {

        try {
            Api.defaults.headers.common["Authorization"] = token;
            const response = await Api.get("/api/dashboard");

            // assign response to state sales
            countSalestoday.value = response.data.data.count_sales_today;
            sumSalestoday.value = response.data.data.sum_sales_today;
            sumSalesWeek.value = response.data.data.sum_sales_week;
            salesDate.value = response.data.data.sales.sales_date;
            salesTotal.value = response.data.data.sales.sales_total;

            // assign response to state profits
            sumProfitsToday.value = response.data.data.sum_profits_today;
            sumProfitsWeek.value = response.data.data.sum_profits_week;
            profitsDate.value = response.data.data.profits.profits_date;
            profitsTotal.value = response.data.data.profits.profits_total;

            // assign response to state products best selling
            productsBestSelling.value = response.data.data.best_selling_products;

            // assign response to state products limit stock
            productsLimitStock.value = response.data.data.products_limit_stock;

        } catch (error) {
            console.error("Error fetching dashboard data", error);
        }
    } else {
        console.error("Token is not available!");
    }
};

// Common chart options
const commonChartOptions = {
    fontFamily: 'inherit',
    animations: { enabled: false },
    dataLabels: { enabled: false },
    grid: { strokeDashArray: 4 },
    tooltip: { theme: 'dark' },
    xaxis: {
        labels: { padding: 0 },
        tooltip: { enabled: false },
        axisBorder: { show: false },
        type: 'datetime',
    },
    yaxis: { labels: { padding: 4 } },
    colors: ['#206bc4'], // Set the color according to your theme
    legend: { show: false },
};


// Transform data and update chart
watchEffect(() => {

    //sales chart
    if (salesTotal.value.length > 0) {
        salesChartSeries.value = [{
            name: "Sales",
            data: salesTotal.value,
        }];

        salesChartOptions.value = {
            ...commonChartOptions,
            chart: {
                type: "area",
                height: 40.0,
                sparkline: { enabled: true }
            },
            fill: { opacity: 0.16, type: 'solid' },
            stroke: { width: 2, lineCap: "round", curve: "smooth" },
            labels: salesDate.value,
            colors: ['#206bc4'],
        };
    }

    //profits chart
    if (profitsTotal.value.length > 0) {
        profitsChartSeries.value = [{
            name: "Profits",
            data: profitsTotal.value,
        }];

        profitsChartOptions.value = {
            ...commonChartOptions,
            chart: {
                type: "bar",
                height: 40.0,
                sparkline: { enabled: true }
            },
            fill: { opacity: 1, type: 'solid' },
            plotOptions: { 
                bar: { 
                    columnWidth: '50%' 
                } 
            },
            labels: profitsDate.value,
        };
    }

    //products best selling chart
    if (productsBestSelling.value.length > 0) {
        bestProductSellingchartSeries.value = productsBestSelling.value.map(product => product.total);
        bestProductSellingchartOptions.value = {
            chart: {
                type: 'pie',
                height: 350 // Adjust height as needed
            },
            labels: productsBestSelling.value.map(product => product.title),
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }],
            colors: generateRandomColors(productsBestSelling.value.length), // Customize colors as needed
            legend: {
                position: 'bottom'
            },
            tooltip: {
                y: {
                    formatter: (val) => `${val}`
                }
            }
        };
    }
});


// Fetch data on mounted
onMounted(() => {
    fetchData();
});


</script>

<template>
    <LayoutAdmin>
        <div class="page-header d-print-none">
            <div class="container-xl">
                <div class="row g-2 align-items-center">
                    <div class="col">
                        <div class="page-pretitle">HALAMAN</div>
                        <h2 class="page-title">DASHBOARD</h2>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-body">
            <div class="container-xl">
                <div class="row row-deck row-cards">
                    <div class="col-sm-6 col-lg-3">
                        <div class="card rounded card-link card-link-pop">
                            <div class="card-body">
                                <div class="subheader">Sales Today</div>
                                <div class="h1 mb-2">{{ countSalestoday }}</div>
                                <hr class="mb-2 mt-1" />
                                <div class="h1 mb-0 me-2">{{ moneyFormat(sumSalestoday) }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="card rounded card-link card-link-pop">
                            <div class="card-body">
                                <div class="subheader">Profits Today</div>
                                <div class="h1 mb-0 me-2 mt-4">{{ moneyFormat(sumProfitsToday) }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="card rounded card-link card-link-pop">
                            <div class="card-body">
                                <div class="subheader">SALES</div>
                                <div class="ms-auto lh-1">
                                    <span class="text-end active">Last 7 days</span>
                                </div>
                                <div class="h1 mb-0 me-2">{{ moneyFormat(sumSalesWeek) }}</div>
                            </div>
                            <div id="chart-sales" class="chart-sm">
                                <VueApexCharts type="area" height="40" :options="salesChartOptions" :series="salesChartSeries" />
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-lg-3">
                        <div class="card rounded card-link card-link-pop">
                            <div class="card-body">
                                <div class="subheader">PROFITS</div>
                                <div class="ms-auto lh-1">
                                    <span class="text-end active">Last 7 days</span>
                                </div>
                                <div class="h1 mb-3 me-2">{{ moneyFormat(sumProfitsWeek) }}</div>
                            </div>
                            <div id="chart-profits" class="chart-sm">
                                <VueApexCharts type="bar" height="40" :options="profitsChartOptions" :series="profitsChartSeries" />
                            </div>
                        </div>
                    </div>
                </div>

                <div class="row mt-5">
                    <div class="col-md-8">
                        <div class="card rounded">
                            <div class="card-header p-3">
                                <h3 class="mb-0">PRODUCTS BEST SELLING</h3>
                            </div>
                            <div class="card-body d-flex justify-content-center items-center">
                                <VueApexCharts width="380" type="pie" :options="bestProductSellingchartOptions" :series="bestProductSellingchartSeries" />
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card rounded">
                            <div class="card-header p-3">
                                <h3 class="mb-0">PRODUCTS LIMIT STOCK</h3>
                            </div>
                            <div class="card-body scrollable-card-body">
                                <div class="row">
                                    <div v-for="product in productsLimitStock" :key="product.id" class="col-12 mb-2">
                                        <div class="card rounded">
                                            <div class="card-body d-flex align-items-center">
                                                <img :src="`${getImageUrl(product.image)}`" :alt="product.title"
                                                    width="50" height="50" class="me-3" />
                                                <div class="flex-fill">
                                                    <h4 class="mb-0">{{ product.title }}</h4>
                                                    <hr class="mb-1 mt-1" />
                                                    <p class="text-danger mb-0">Stock: {{ product.stock }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </LayoutAdmin>
</template>

<style>
/* Add necessary styles if needed */
</style>
