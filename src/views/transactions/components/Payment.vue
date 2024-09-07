<script setup>
import { ref, watch, onMounted } from 'vue';

// Import moneyFormat utility
import { moneyFormat } from '../../../utils/moneyFormat';

// Import Api service
import Api from '../../../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

// Import vue-select
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

//import toastify
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Props
const props = defineProps({
    totalCarts: Number,
    fetchCarts: Function,
});

// State
const grandTotal = ref(props.totalCarts);
const cash = ref('');
const change = ref(0);
const discount = ref('');
const customers = ref([]);
const selectedCustomer = ref('');

// Function to calculate discount
function calculateDiscount(e) {
    discount.value = e.target.value;
    grandTotal.value = props.totalCarts - e.target.value;
    cash.value = 0;
    change.value = 0;
}

// Function to calculate change
function calculateChange(e) {
    cash.value = e.target.value;
    change.value = e.target.value - grandTotal.value;
}

// Function to set grand total
function calculateGrandTotal() {
    grandTotal.value = props.totalCarts;
}

// Fetch customers
const fetchCustomers = async () => {
    const token = Cookies.get('token');
    if (token) {
        Api.defaults.headers.common['Authorization'] = token;
        const response = await Api.get('/api/customers-all');
        customers.value = response.data.data;
    }
};

// Store transaction
const storeTransaction = async () => {
    const token = Cookies.get('token');
    if (token) {
        Api.defaults.headers.common['Authorization'] = token;
        await Api.post('/api/transactions', {
            customer_id: selectedCustomer.value ? selectedCustomer.value.value : null,
            discount: parseInt(discount.value) || 0,
            cash: parseInt(cash.value),
            change: parseInt(change.value),
            grand_total: parseInt(grandTotal.value),
        })
            .then((response) => {

                // show toast
                toast(`${response.data.meta.message}`, {
                    type: "success",
                    dangerouslyHTMLString: true,
                });

                // call fetchCarts
                props.fetchCarts();

                // Print receipt
                const receiptWindow = window.open(`/transactions/print?invoice=${response.data.data.invoice}`, '_blank');

                if (receiptWindow) {
                setTimeout(() => {
                    try {
                    receiptWindow.focus(); // Fokuskan jendela jika perlu
                    receiptWindow.print();
                    receiptWindow.onafterprint = function () {
                        receiptWindow.close();
                    };
                    } catch (error) {
                    console.error("Error during printing:", error);
                    }
                }, 2000); // Delay 2000 milliseconds (2 detik), sesuaikan jika perlu
                } else {
                console.error("Failed to open the print window.");
                }


            })

    }
};

// Watch for changes in totalCarts
watch(() => props.totalCarts, () => {
    calculateGrandTotal();
});

// Fetch customers on mount
onMounted(() => {
    fetchCustomers();
});
</script>

<template>
    <button class="btn btn-warning w-100 rounded" data-bs-toggle="modal" data-bs-target="#modal-pay"
        :disabled="props.totalCarts === 0">
        Pay
    </button>

    <div class="modal modal-blur fade" id="modal-pay" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Payment Cash</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="card rounded bg-muted-lt">
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 col-4">
                                    <h4 class="fw-bold">GRAND TOTAL</h4>
                                </div>
                                <div class="col-md-8 col-8 text-end">
                                    <h2 class="fw-bold">{{ moneyFormat(grandTotal) }}</h2>
                                    <div>
                                        <hr />
                                        <h3 class="text-success">Change : <strong>{{ moneyFormat(change) }}</strong>
                                        </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-2 mt-3">
                        <div class="col-md-6">
                            <label class="mb-1">Customer</label>
                            <vSelect :options="customers" v-model="selectedCustomer"></vSelect>
                        </div>
                        <div class="col-md-6">
                            <label class="mb-1">Discount (Rp.)</label>
                            <input type="number" class="form-control" placeholder="Discount (Rp.)" v-model="discount"
                                @input="calculateDiscount" />
                        </div>
                    </div>
                    <div class="row mb-2 mt-3">
                        <div class="col-md-12">
                            <label class="mb-1">Cash (Rp.)</label>
                            <input type="number" class="form-control form-control-lg" placeholder="Cash (Rp.)"
                                v-model="cash" @input="calculateChange" />
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn me-auto rounded" data-bs-dismiss="modal">Close</button>
                    <button @click="storeTransaction" :disabled="cash < grandTotal || grandTotal === 0"
                        class="btn btn-primary rounded" data-bs-dismiss="modal">
                        Pay Order + Print
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
