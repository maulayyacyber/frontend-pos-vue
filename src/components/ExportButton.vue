<script setup>

// ref
import { ref } from 'vue';

// Import defineProps
import { defineProps } from 'vue';

// Props
const props = defineProps({
    startDate: String,
    endDate: String,
    type: String
});

// Import services api
import Api from '../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

// Function to export data to Excel
const exportToExcel = async () => {
    const token = Cookies.get('token');

    if (token) {
        // Set authorization header with token
        Api.defaults.headers.common['Authorization'] = token;

        try {
            // Fetch data from API with Axios
            const response = await Api.get(`/api/${props.type}/export?start_date=${props.startDate}&end_date=${props.endDate}`, {
                responseType: 'blob'
            });

            // Create a URL for the blob data
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');

            link.href = url;
            link.setAttribute('download', `report-${props.type}-${props.startDate}-${props.endDate}.xlsx`);

            document.body.appendChild(link);
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);

        } catch (error) {
            console.error("There was an error fetching the data!", error);
        }
    } else {
        console.error("Token is not available!");
    }
};
</script>

<template>
    <button @click="exportToExcel" class="btn btn-success btn-md border-0 shadow me-3"
        :disabled="!props.startDate || !props.endDate">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-file-excel">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 3v4a1 1 0 0 0 1 1h4" />
            <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2" />
            <path d="M10 12l4 5" />
            <path d="M10 17l4 -5" />
        </svg>
        EXCEL
    </button>
</template>
