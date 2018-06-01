<template>
  <v-container fluid grid-list-sm v-if="invoice">
    <v-layout row wrap justify-center><!--Top card-->
      <v-flex xs12 md12 lg6>
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
              <v-flex xs12 md12 lg6>
                <v-text-field @focus.capture="nocaret" readonly label="Invoice Name" v-model="invoice.name"></v-text-field>
                <v-text-field @focus.capture="nocaret" readonly label="Mail of Recipient" v-model="invoice.recipient"></v-text-field>
                <v-text-field @focus.capture="nocaret" class="input-group--focused" :color="invoice.state | avatarColor" readonly label="Payment Status" :value="invoice.state | formatState"></v-text-field>
              </v-flex>
              <v-flex xs12 md12 lg6>
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
    <v-layout row wrap justify-center><!--Crypto Cards-->
      <v-flex xs12 md12 lg6>
        <v-layout row wrap>
          <v-flex xs12 md12 lg6 v-for="item in supportedCurrencies" :key="item.currencyCode" v-if="invoice['accept' + item.currencyCode]">
            <crypto-card v-if="renderCryptoCard(item.currencyCode)" :currencyCode="item.currencyCode" color="orange" :invoice="invoice"></crypto-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import utils from '@/utils.js';
import { frontEndUrl } from '@/appSettings.json';
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
      supportedCurrencies: this.$store.getters.supportedCurrencies,
      invoice: {}
    }
  },
  mounted () {
    // load from store if the user is logged, else call webapi
    this.invoice = this.$store.getters.invoices.find(i => i.invoiceGuid === this.$route.params.invoiceGuid);
    var self = this;
    if (!this.invoice) {
      axios.get('http://185.59.209.146:38080' + '/api/invoices/' + this.invoiceGuid).then(({ data }) => {
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
      window.location.replace(this.explorerUrl[currency] + this.invoice.transactionId);
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
