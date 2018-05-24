<template>
  <v-container fluid grid-list-md>
    <v-layout row wrap><!--Top card-->
      <v-flex xs12 md12 lg8 offset-lg2>
        <v-card>
          <v-card-title >
            <v-avatar size="36px" :color="invoice.state | avatarColor">
              <v-icon :title="paymentStatus" dark>{{ invoice.state | stateIcon }}</v-icon>
            </v-avatar>
            <h1>
              &nbsp;Invoice
            </h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md12 lg6  pr-2>
                <v-text-field readonly label="Name" v-model="invoice.name"></v-text-field>
                <v-text-field readonly label="Mail of Recipient" v-model="invoice.recipient"></v-text-field>
                <v-text-field class="input-group--focused" :color="invoice.state | avatarColor" readonly label="Payment Status" :value="invoice.state | formatState"></v-text-field>
              </v-flex>
              <v-flex xs12 md12 lg6 pl-2>
                <v-text-field readonly label="Payment Amount in Fiat" v-model="paymentAmount"></v-text-field>
                <v-text-field readonly label="Date Created" :value="invoice.dateCreated | formatDate"></v-text-field>
                <v-text-field readonly label="Date Received" :value="invoice.dateReceived | formatDate"></v-text-field>
              </v-flex>
              <v-flex>
                <v-text-field xs12 multi-line readonly label="Description" v-model="invoice.description"></v-text-field>
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
import CryptoCard from '@/components/CryptoCard';
export default {
  components: {
    CryptoCard
  },
  name: 'Invoice',
  props: ['id'],
  data () {
    return {
    }
  },
  computed: {
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
    },
    btcDecimals () {
      return utils.btc.decimals;
    },
    invoice () {
      return this.$store.getters.invoices.find(i => i.id === this.$route.params.id);
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
      return this.invoice.fiatAmount + ' ' + this.invoice.fiatCurrencyCode;
    },
    paymentStatus () {
      var status;
      switch (this.invoice.state) {
        case 1:
          status = 'Pending';
          break;
        case 2:
          status = 'Waiting for Confirmation';
          break;
        case 3:
          status = 'Received and Confirmed';
          break;
        default:
          status = 'UNKNOWN';
          break;
      }
      return status;
    },
    dateReceived () {
      return this.invoice.dateReceived === null ? ' ' : this.invoice.dateReceived;
    }
  },
  methods: {
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
</style>
