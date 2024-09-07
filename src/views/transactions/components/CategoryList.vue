<script setup>

// Import defineProps and defineEmits
import { defineProps, defineEmits } from 'vue';

// Props
const props = defineProps({
    categories: Array,
    fetchProducts: Function,
    fetchProductByCategoryID: Function,
    currentCategoryId: Number
});

// Emits
const emit = defineEmits(['update:currentCategoryId']);

//import helper getImageUrl
import { getImageUrl } from '../../../utils/getImageUrl';

// Import useHorizontalScroll
import { useHorizontalScroll } from '../../../utils/useHorizontalScroll';

// Destructure useHorizontalScroll
const { scrollRef, onMouseDown, onMouseLeave, onMouseUp, onMouseMove } = useHorizontalScroll();
</script>

<template>
    <div class="row">
        <div class="col-md-2">
            <a href="#" class="text-decoration-none" @click.prevent="props.fetchProducts">
                <div class="card card-link card-link-pop mt-3 rounded">
                    <div class="card-body d-flex align-items-center justify-content-center p-2">
                        <img src="/images/categories.png" alt="" width="50" height="50" class="me-2 p-2" />
                        <h4 class="mb-0 mt-2">All</h4>
                    </div>
                </div>
            </a>
        </div>

        <div class="col-md-10">
            <div class="horizontal-scroll" ref="scrollRef" @mousedown="onMouseDown" @mouseleave="onMouseLeave"
                @mouseup="onMouseUp" @mousemove="onMouseMove">
                <div class="row mt-3">
                    <div v-for="category in props.categories" :key="category.id" class="col-4">
                        <a href="#" class="text-decoration-none" @click.prevent="() => {
                            props.fetchProductByCategoryID(category.id);
                            emit('update:currentCategoryId', category.id);
                        }">
                            <div class="card card-link card-link-pop rounded">
                                <div class="card-body d-flex align-items-center justify-content-center p-2">
                                    <img :src="`${getImageUrl(category.image)}`" :alt="category.name" width="50"
                                        height="50" class="me-2" />
                                    <h4 class="mb-0 mt-2">{{ category.name }}</h4>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
