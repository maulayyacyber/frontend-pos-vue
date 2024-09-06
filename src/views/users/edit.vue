<script setup>
// Import defineProps
import { defineProps } from 'vue';

// Menerima prop 'fetchData' dari komponen induk
const props = defineProps({
    fetchData: Function,
    userId: Number
});

// Import ref
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
const name = ref('');
const email = ref('');
const password = ref('');

//ref error state & modal
const errors = ref({});
const modalRef = ref(null);

//token
const token = Cookies.get('token');

//fetch user
const fetchUser = async () => {
    if (props.userId) {

        try {
            Api.defaults.headers.common['Authorization'] = token;
            const response = await Api.get(`/api/users/${props.userId}`);

            //assign response to state
            const customer = response.data.data;
            name.value = customer.name;
            email.value = customer.email;

        } catch (error) {
            console.error('There was an error fetching the customer data!', error);
        }
    }
};

//onMounted
onMounted(() => {
    fetchUser();
});

//update user
const updateUser = async () => {
    Api.defaults.headers.common['Authorization'] = token;

    await Api.put(`/api/users/${props.userId}`, {
        name: name.value,
        email: email.value,
        password: password.value,
    })
        .then((response) => {

            //show toast
            toast(`${response.data.meta.message}`, {
                type: "success",
                dangerouslyHTMLString: true,
            });

            //call fetchData
            props.fetchData();

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

    <a href="#" class="btn rounded" data-bs-toggle="modal" :data-bs-target="`#modal-edit-user-${props.userId}`">
        Edit
    </a>

    <div class="modal modal-blur fade" :id="`modal-edit-user-${props.userId}`" tabindex="-1" role="dialog"
        aria-hidden="true" ref="modalRef">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
            <form @submit.prevent="updateUser">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Full Name</label>
                                    <input type="text" class="form-control" v-model="name"
                                        placeholder="Enter Customer Name" />
                                    <div v-if="errors.name" class="alert alert-danger mt-2">
                                        {{ errors.name }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Email Address</label>
                                    <input type="email" class="form-control" v-model="email"
                                        placeholder="Enter Email Address" />
                                    <div v-if="errors.email" class="alert alert-danger mt-2">
                                        {{ errors.email }}
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">Password</label>
                                    <input type="password" class="form-control" v-model="password"
                                        placeholder="Enter Password" />
                                    <div v-if="errors.password" class="alert alert-danger mt-2">
                                        {{ errors.password }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <a href="#" class="btn me-auto rounded" data-bs-dismiss="modal">Cancel</a>
                        <button type="submit" class="btn btn-primary ms-auto rounded">
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24"
                                viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M12 5l0 14" />
                                <path d="M5 12l14 0" />
                            </svg>
                            Update
                        </button>
                    </div>
                </div>
            </form>
        </div>
    </div>

</template>