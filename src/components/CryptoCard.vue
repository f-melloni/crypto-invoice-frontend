<template>
  <v-card>
    <v-card-title>
      <v-avatar class="white--text" size="36px" :color="color">
        <h2><i :class="'cc ' + ccUp + '-alt'" :title="ccUp"></i></h2>
      </v-avatar>
      <h2>
        &nbsp;{{ccUp}}
      </h2>
      <v-spacer></v-spacer>
      <v-btn dark v-if="invoice.state !== 1" round :color="stateColor" @click="viewTransaction()"><v-icon>{{stateIcon}}</v-icon>&nbsp;View in Explorer</v-btn>
    </v-card-title>
    <v-card-text>
      <v-text-field readonly label="Address" v-model="invoice[currencyCode.toLowerCase() + 'Address']"></v-text-field>
      <v-layout row wrap>
        <v-flex xs6>
          <v-text-field readonly label="Amount in Cryptocurrency" :value="inCrypto"></v-text-field>
        </v-flex>
        <v-flex xs6>
          <v-text-field readonly label="Exchange Rate" :value="newFixER + ' ' + invoice.fiatCurrencyCode"></v-text-field>
        </v-flex>
      </v-layout>
      <v-text-field v-if="renderTransaction()" readonly label="Transaction ID" :value="invoice.transactionId"></v-text-field>
    </v-card-text>
  </v-card>
</template>

<script>
import utils from '@/utils.js';
export default{
  template: '<crypto-card/>',
  name: 'CryptoCard',
  props: ['currencyCode', 'color', 'invoice'],
  data: function () {
    return {

    }
  },
  computed: {
    inCrypto () {
      return (this.invoice.fiatAmount / this.newFixER).toFixed(this.decimals) + ' ' + this.ccUp;
    },
    decimals () {
      return utils[this.currencyCode.toLowerCase()].decimals;
    },
    ccUp () {
      return this.currencyCode.toUpperCase()
    },
    newFixER () {
      return this.invoice['newFixER_' + this.ccUp];
    },
    stateColor () {
      var stateColor;
      switch (this.invoice.state) {
        case 1:
          stateColor = 'grey';
          break;
        case 2:
          stateColor = 'orange';
          break;
        case 3:
          stateColor = 'success';
          break;
        default:
          stateColor = 'primary'
          break;
      }
      return stateColor;
    },
    stateIcon () {
      var icon;
      switch (this.invoice.state) {
        case 1:
          icon = 'radio_button_unchecked';
          break;
        case 2:
          icon = 'access_time';
          break;
        case 3:
          icon = 'done_all';
          break;
      }
      return icon;
    }
  },
  methods: {
    // redirect to blockchain explorer
    viewTransaction () {
      switch (this.currencyCode.toLowerCase()) {
        case 'btc':
          window.location.replace('https://live.blockcypher.com/btc/tx/' + this.invoice.transactionId);
          break;
        case 'ltc':
          window.location.replace('https://live.blockcypher.com/ltc/tx/' + this.invoice.transactionId);
          break;
      }
    },
    renderTransaction () {
      return this.invoice.transactionCurrencyCode ? this.invoice.transactionCurrencyCode.toLowerCase() === this.currencyCode.toLowerCase() : false;
    }
  }
}
</script>

<style scoped>
</style>
