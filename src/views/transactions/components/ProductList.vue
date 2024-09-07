<script setup>

// Import defineProps
import { defineProps } from "vue";

// Props
const props = defineProps({
    products: Array,
    fetchCarts: Function,
});

// Import moneyFormat
import { moneyFormat } from "../../../utils/moneyFormat";

//import helper getImageUrl
import { getImageUrl } from "../../../utils/getImageUrl";

// Import services api
import Api from "../../../services/api";

// Import js-cookie
import Cookies from 'js-cookie';

//import toastify
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// Token
const token = Cookies.get("token");

// Function addToCart
const addToCart = (product) => {
    if (token) {
        Api.defaults.headers.common['Authorization'] = token;

        Api.post('/api/carts', {
            product_id: product.id,
            qty: 1,
            price: product.sell_price
        })
            .then(response => {
                // Show toast
                //show toast
                toast(`${response.data.meta.message}`, {
                    type: "success",
                    dangerouslyHTMLString: true,
                });

                // Call fetchCarts
                props.fetchCarts();
            });
    }
};
</script>

<template>
    <div v-if="products.length > 0">
        <div class="row mt-3">
            <div v-for="product in products" :key="product.id" class="col-4">
                <div class="card card-link card-link-pop mt-3 rounded">
                    <div class="ribbon bg-success mt-3">
                        <h4 class="mb-0">{{ moneyFormat(product.sell_price) }}</h4>
                    </div>
                    <div class="card-body text-center">
                        <img :src="`${getImageUrl(product.image)}`" :alt="product.title" class="me-2 rounded" />
                        <h4 class="mb-0 mt-2">{{ product.title }}</h4>
                        <button class="btn btn-primary mt-3 w-100 rounded" @click="addToCart(product)">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else class="alert alert-danger mb-0 mt-5">Product not available</div>
</template>
