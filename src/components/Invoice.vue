<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap><!--Top card-->
      <v-flex xs12 md12 lg8 offset-lg2>
        <v-card>
          <v-card-title >
            <v-avatar size="36px" :color="invoice.state | avatarColor">
              <v-icon :title="invoice.state | formatState" dark>{{ invoice.state | stateIcon }}</v-icon>
            </v-avatar>
            <h1>
              &nbsp;Invoice
            </h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md12 lg6  pr-2>
                <v-text-field @focus.capture="nocaret" readonly label="Invoice Name" v-model="invoice.name"></v-text-field>
                <v-text-field @focus.capture="nocaret" readonly label="Mail of Recipient" v-model="invoice.recipient"></v-text-field>
                <v-text-field @focus.capture="nocaret" class="input-group--focused" :color="invoice.state | avatarColor" readonly label="Payment Status" :value="invoice.state | formatState"></v-text-field>
              </v-flex>
              <v-flex xs12 md12 lg6 pl-2>
                <v-text-field @focus.capture="nocaret" readonly label="Payment Amount in Fiat" v-model="paymentAmount"></v-text-field>
                <v-text-field @focus.capture="nocaret" readonly label="Date Created" :value="invoice.dateCreated | formatDate"></v-text-field>
                <v-text-field @focus.capture="nocaret" readonly label="Date Received" :value="invoice.dateReceived | formatDate"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field @focus.capture="nocaret" xs12 multi-line readonly label="Description" v-model="invoice.description"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap><!--Crypto Cards-->
      <v-flex xs12 md12 offset-lg2 lg8>
        <v-layout row wrap>
          <v-flex xs12 md12 lg6 v-if="invoice.acceptBTC">
            <crypto-card v-if="renderCryptoCard('btc')" currencyCode="btc" color="orange" :invoice="invoice"></crypto-card>
          </v-flex>
          <v-flex xs12 md12 lg6 v-if="invoice.acceptLTC">
            <crypto-card  v-if="renderCryptoCard('ltc')" currencyCode="ltc" color="grey" :invoice="invoice"></crypto-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import utils from '@/utils.js';
import { connectionString } from '@/appSettings.json';
import axios from 'axios';
import CryptoCard from '@/components/CryptoCard';
export default {
  components: {
    CryptoCard
  },
  name: 'Invoice',
  props: ['invoiceGuid'],
  data () {
    return {
      invoice: {}
    }
  },
  mounted () {
    // load from store if the user is logged, else call webapi
    this.invoice = this.$store.getters.invoices.find(i => i.invoiceGuid === this.$route.params.invoiceGuid);
    var self = this;
    if (!this.invoice) {
      axios.get(connectionString + '/api/invoices/' + this.invoiceGuid).then(({ data }) => {
        self.invoice = data;
      });
    }
  },
  computed: {
    btcDecimals () {
      return utils.btc.decimals;
    },
    displayName () {
      return this.$store.state.displayName;
    },
    userSettings () {
      return this.$store.getters.userSettings;
    },
    isFixedOnCreation () {
      return this.invoice.fixedRateOnCreation ? 'Yes' : 'No';
    },
    paymentAmount () {
      if (this.invoice.fiatAmount && this.invoice.fiatCurrencyCode) {
        return this.invoice.fiatAmount + ' ' + this.invoice.fiatCurrencyCode;
      } else {
        return '';
      }
    },
    dateReceived () {
      return this.invoice.dateReceived === null ? ' ' : this.invoice.dateReceived;
    }
  },
  methods: {
    nocaret (e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
      e.preventDefault();
      return false;
    },
    renderCryptoCard (currencyCode) {
      if (!this.invoice.transactionCurrencyCode) {
        return true;
      }
      return this.invoice.transactionCurrencyCode.toLowerCase() === currencyCode.toLowerCase();
    },
    // redirect to blockchain explorer
    viewTransaction (currency) {
      switch (currency.toLowerCase()) {
        case 'btc':
          window.location.replace('https://live.blockcypher.com/btc/tx/' + this.invoice.transactionId);
          break;
        case 'ltc':
          window.location.replace('https://live.blockcypher.com/ltc/tx/' + this.invoice.transactionId);
          break;
      }
    },
    renderTransaction (currency) {
      return this.invoice.transactionCurrencyCode ? this.invoice.transactionCurrencyCode.toLowerCase() === currency.toLowerCase() : false;
    }
  }
}
</script>
<style scoped>
#tester {
  color: red !important;
}
</style>
