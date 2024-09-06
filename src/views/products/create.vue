<script setup>

// Import defineProps
import { defineProps } from 'vue';

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function
});

// Import ref and onMounted
import { ref, onMounted } from 'vue';

// Import services api
import Api from '../../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

//import toastify
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

//import handleErrors
import { handleErrors } from '../../utils/handleErrors';

// Reactive state
const barcode = ref('');
const title = ref('');
const image = ref('');
const description = ref('');
const buyPrice = ref('');
const sellPrice = ref('');
const stock = ref('');
const categoryId = ref('');
const errors = ref({});

// state categories
const categories = ref([]);

// ref
const fileInputRef = ref(null);
const modalRef = ref(null);

//token
const token = Cookies.get('token');

// Fetch categories
const fetchCategories = async () => {
    try {
        Api.defaults.headers.common['Authorization'] = token;
        const response = await Api.get('/api/categories-all');

        // assign response to state
        categories.value = response.data.data;
    } catch (error) {
        console.error("There was an error fetching categories!", error);
    }
};

// onMounted
onMounted(() => {
    fetchCategories();
});

// Handle file change
const handleFileChange = (e) => {
    const imageData = e.target.files[0];

    if (!imageData.type.match("image.*")) {
        fileInputRef.value.value = "";
        image.value = "";
        toast("Format File not Supported!", {
            type: "error",
            dangerouslyHTMLString: true,
        });
        return;
    }

    image.value = imageData;
};

// Store product
const storeProduct = async () => {

    //initialize formData
    const formData = new FormData();

    //append data
    formData.append('barcode', barcode.value);
    formData.append('image', image.value);
    formData.append('title', title.value);
    formData.append('description', description.value);
    formData.append('buy_price', buyPrice.value);
    formData.append('sell_price', sellPrice.value);
    formData.append('stock', stock.value);
    formData.append('category_id', categoryId.value);

    Api.defaults.headers.common['Authorization'] = token;
    await Api.post('/api/products', formData)
        .then((response) => {

            //show toast
            toast(`${response.data.meta.message}`, {
                type: "success",
                dangerouslyHTMLString: true,
            });

            //call fetchData
            props.fetchData();

            //clear form
            barcode.value = '';
            title.value = '';
            image.value = '';
            description.value = '';
            buyPrice.value = '';
            sellPrice.value = '';
            stock.value = '';
            categoryId.value = '';

            //close modal
            const modalElement = modalRef.value;
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance.hide();
        })
        .catch((error) => {
            handleErrors(error.response.data, errors);
        });
};

</script>

<template>

    <a href="#" class="btn btn-primary d-sm-inline-block" data-bs-toggle="modal" data-bs-target="#modal-create-product">
        <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2"
            stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
        </svg>
        Add New
    </a>
    
    <div class="modal modal-blur fade" id="modal-create-product" tabindex="-1" role="dialog" aria-hidden="true"
        ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="storeProduct">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">New Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Image</label>
                                    <input type="file" class="form-control" @change="handleFileChange"
                                        ref="fileInputRef" />
                                    <div v-if="errors.image" class="alert alert-danger mt-2">
                                        {{ errors.image }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Barcode</label>
                                    <input type="text" class="form-control" v-model="barcode"
                                        placeholder="Enter Barcode" />
                                    <div v-if="errors.barcode" class="alert alert-danger mt-2">
                                        {{ errors.barcode }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Product Name</label>
                                    <input type="text" class="form-control" v-model="title"
                                        placeholder="Enter Product Name" />
                                    <div v-if="errors.title" class="alert alert-danger mt-2">
                                        {{ errors.title }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Category</label>
                                    <select class="form-select" v-model="categoryId">
                                        <option value="">-- Select Category --</option>
                                        <option v-for="category in categories" :key="category.id" :value="category.id">
                                            {{ category.name }}
                                        </option>
                                    </select>
                                    <div v-if="errors.category_id" class="alert alert-danger mt-2">
                                        {{ errors.category_id }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Stock</label>
                                    <input type="number" class="form-control" v-model="stock"
                                        placeholder="Enter Stock Product" />
                                    <div v-if="errors.stock" class="alert alert-danger mt-2">
                                        {{ errors.stock }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Description</label>
                                    <textarea class="form-control" rows="3" v-model="description"
                                        placeholder="Enter Description"></textarea>
                                    <div v-if="errors.description" class="alert alert-danger mt-2">
                                        {{ errors.description }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Buy Price</label>
                                    <input type="number" class="form-control" v-model="buyPrice"
                                        placeholder="Enter Buy Price" />
                                    <div v-if="errors.buy_price" class="alert alert-danger mt-2">
                                        {{ errors.buy_price }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Sell Price</label>
                                    <input type="number" class="form-control" v-model="sellPrice"
                                        placeholder="Enter Sell Price" />
                                    <div v-if="errors.sell_price" class="alert alert-danger mt-2">
                                        {{ errors.sell_price }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a href="#" class="btn me-auto rounded" data-bs-dismiss="modal">
                            Cancel
                        </a>
                        <button type="submit" class="btn btn-primary ms-auto rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Save
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>