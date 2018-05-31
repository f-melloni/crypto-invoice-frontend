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
      <v-btn dark v-if="invoice.state !== 1" round :color="invoice.state | avatarColor" @click="viewTransaction()"><v-icon>{{invoice.state | stateIcon}}</v-icon>&nbsp;View in Explorer</v-btn>
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
      <qrcode :value="qrCode" :options="{size: 200}"></qrcode>
    </v-card-text>
  </v-card>
</template>

<script>
import utils from '@/utils.js';
export default{
  template: '<crypto-card/>',
  name: 'CryptoCard',
  props: ['currencyCode', 'color', 'invoice'],
  data () {
    return {
      supportedCurrencies: this.$store.getters.supportedCurrencies
    }
  },
  computed: {
    inCrypto () {
      return this.cryptoValue + ' ' + this.ccUp;
    },
    cryptoValue () {
      return (this.invoice.fiatAmount / this.newFixER).toFixed(this.decimals);
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
    qrCode () {
      var uri;
      switch (this.currencyCode.toLowerCase()) {
        case 'btc':
          uri = 'bitcoin:' + this.invoice.btcAddress + '?amount=' + this.cryptoValue;
          break;
        case 'ltc':
          uri = 'litecoin:' + this.invoice.ltcAddress + '?amount=' + this.cryptoValue;
          break;
      }
      return uri;
    },
    explorerUrl () {
      var list = {};
      this.supportedCurrencies.forEach(element => {
        list[element.currencyCode] = element.blockExplorerUrl
      });
      return list;
    }
  },
  methods: {
    // redirect to blockchain explorer
    viewTransaction () {
      window.location.replace(this.explorerUrl[this.currencyCode.toUpperCase()] + this.invoice.transactionId);
    },
    renderTransaction () {
      return this.invoice.transactionCurrencyCode ? this.invoice.transactionCurrencyCode.toLowerCase() === this.currencyCode.toLowerCase() : false;
    }
  }
}
</script>

<style scoped>
</style>
