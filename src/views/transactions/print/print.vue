<script setup>
// Import ref dan onMounted
import { ref, onMounted } from 'vue';

// Import services api
import Api from '../../../services/api';

// Import js-cookie
import Cookies from 'js-cookie';

// Import moneyFormat
import {moneyFormat} from '../../../utils/moneyFormat';

//import styles
import './styles.css';

// Ambil parameter query
const queryParams = new URLSearchParams(window.location.search);
const invoice = queryParams.get('invoice');

// State untuk transaksi dan detail transaksi
const transaction = ref({});
const transactionDetails = ref([]);

// Ambil token dari cookie
const token = Cookies.get('token');

// Fungsi untuk mengambil data transaksi
const fetchTransaction = async () => {
  if (token) {
    Api.defaults.headers.common['Authorization'] = token;

    const response = await Api.get(`/api/transactions?invoice=${invoice}`);

    // assign response to state
    transaction.value = response.data.data;
    transactionDetails.value = response.data.data.transaction_details;
  }
};

// Panggil fetchTransaction saat komponen dimuat
onMounted(() => {
  fetchTransaction();
});
</script>

<template>
  <div class="content">
    <div class="title" style="padding-bottom: 13px">
      <div style="text-align: center; text-transform: uppercase; font-size: 15px">
        SantriKoding
      </div>
      <div style="text-align: center">
        Alamat: Perum Kurnia Asri 2 Blok D3, Kec. Diwek, Kab. Jombang
      </div>
      <div style="text-align: center">
        Telp: 0857-9087-9087
      </div>
    </div>

    <div class="separate-line" style="border-top: 1px dashed #000; height: 1px; margin-bottom: 5px"></div>

    <table class="transaction-table" cellspacing="0" cellpadding="0">
      <tbody>
        <tr>
          <td>TANGGAL</td>
          <td>:</td>
          <td>{{ transaction.created_at }}</td>
        </tr>
        <tr>
          <td>FAKTUR</td>
          <td>:</td>
          <td>{{ transaction.invoice }}</td>
        </tr>
        <tr>
          <td>KASIR</td>
          <td>:</td>
          <td>{{ transaction.cashier?.name ?? '' }}</td>
        </tr>
        <tr>
          <td>PEMBELI</td>
          <td>:</td>
          <td>{{ transaction.customer?.name ?? 'Umum' }}</td>
        </tr>
      </tbody>
    </table>

    <div class="transaction">
      <table class="transaction-table" cellspacing="0" cellpadding="0">
        <tbody>
          <tr class="price-tr">
            <td colspan="3">
              <div class="separate-line" style="border-top: 1px dashed #000"></div>
            </td>
          </tr>
          <tr>
            <td style="text-align: left">PRODUK</td>
            <td style="text-align: center">QTY</td>
            <td style="text-align: right" colspan="5">HARGA</td>
          </tr>
          <tr class="price-tr">
            <td colspan="3">
              <div class="separate-line" style="border-top: 1px dashed #000"></div>
            </td>
          </tr>
          <tr v-for="(item, index) in transactionDetails" :key="index">
            <td class="name">{{ item.product.title }}</td>
            <td class="qty" style="text-align: center">{{ item.qty }}</td>
            <td class="final-price" style="text-align: right" colspan="5">{{ moneyFormat(item.price) }}</td>
          </tr>
          <tr class="price-tr">
            <td colspan="3">
              <div class="separate-line"></div>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="final-price">SUB TOTAL</td>
            <td colspan="3" class="final-price">:</td>
            <td class="final-price">{{ moneyFormat(transaction.grand_total) }}</td>
          </tr>
          <tr>
            <td colspan="3" class="final-price">DISKON</td>
            <td colspan="3" class="final-price">:</td>
            <td class="final-price">{{ moneyFormat(transaction.discount) }}</td>
          </tr>
          <tr class="discount-tr">
            <td colspan="3">
              <div class="separate-line"></div>
            </td>
          </tr>
          <tr>
            <td colspan="3" class="final-price">TUNAI</td>
            <td colspan="3" class="final-price">:</td>
            <td class="final-price">{{ moneyFormat(transaction.cash) }}</td>
          </tr>
          <tr>
            <td colspan="3" class="final-price">KEMBALI</td>
            <td colspan="3" class="final-price">:</td>
            <td class="final-price">{{ moneyFormat(transaction.change) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="thanks">=====================================</div>
    <div class="azost" style="margin-top: 5px">
      TERIMA KASIH<br />
      ATAS KUNJUNGAN ANDA
    </div>
  </div>
</template>