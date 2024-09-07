<script setup>
// Import moneyFormat
import { moneyFormat } from '../../../utils/moneyFormat';

// Import getImageUrl
import { getImageUrl } from '../../../utils/getImageUrl';

// Import Api service
import Api from '../../../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

//import toastify
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Define props
import { defineProps } from 'vue';
const props = defineProps({
    carts: Array,
    fetchCarts: Function
});

// Token from cookies
const token = Cookies.get("token");

// Function to delete cart
const deleteCart = (cartID) => {
    if (token) {
        Api.defaults.headers.common['Authorization'] = token;

        Api.delete(`/api/carts/${cartID}`)
            .then(response => {
                
                // Show toast
                toast(`${response.data.meta.message}`, {
                    type: "success",
                    dangerouslyHTMLString: true,
                });

                // Fetch the updated cart data
                props.fetchCarts();
            });
    }
};
</script>

<template>
    <div class="card-body scrollable-card-body">
        <div class="row">
            <div v-for="cart in props.carts" :key="cart.id" class="col-12 mb-2">
                <div class="card rounded">
                    <div class="card-body d-flex align-items-center">
                        <img :src="`${getImageUrl(cart.product.image)}`" :alt="cart.product.title" width="50"
                            height="50" class="me-3 rounded" />
                        <div class="flex-fill">
                            <h4 class="mb-0">{{ cart.product.title }}</h4>
                            <p class="text-success mb-0 mt-1">{{ moneyFormat(cart.price) }}</p>
                            <hr class="mb-1 mt-1" />
                            <p class="text-muted mb-0">Qty: {{ cart.qty }}</p>
                        </div>
                        <button class="btn btn-danger ms-3 rounded p-2 pt-1 pb-1" @click="deleteCart(cart.id)">
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
