<template>
  <v-container fluid grid-list-sm>
    <v-layout row>
      <v-flex xs12 sm12 md12>
        <h1>Invoice Details</h1>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex x3 sm3 offset-sm3 text-sm-left>
        <div><b>Name: </b>{{invoice.name}}</div>
        <div><b>Description: </b>{{invoice.description}}</div>
      </v-flex>
      <v-flex x1 sm1 text-sm-right offset-xs2>
        <v-card color="blue lighten-2" dark>
        <v-card-text color="white">
          <h2>{{invoice.fiatAmount}} {{invoice.fiatCurrencyCode}}</h2>
        </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex x6 sm6 offset-sm3>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Payment Status: </b>{{invoice.state}}
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Fixed Echange Rate on Creation: </b>{{isFixedOnCreation}}
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Created By: </b>{{invoice.createdBy}}
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Date Created: </b>{{invoice.dateCreated}}
      </v-flex>
    </v-layout>
    <div v-if="invoice.dateReceived">
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Date Received: </b>{{invoice.dateReceived}}
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs6 sm6 offset-sm3 text-sm-left>
        <b>Transaction in Blockchain: </b><a href="https://www.etherchain.org/tx/placeholder">https://www.etherchain.org/tx/placeholder</a>
      </v-flex>
    </v-layout>
    </div>
    <v-layout row>
      <v-flex x6 sm6 offset-sm3>
        <v-divider></v-divider>
      </v-flex>
    </v-layout>
    <!--ETH -->
    <div v-if="userSettings.ethAccount">
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>ETH Address: </b>{{userSettings.ethAccount}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>ETH Variable Symbol: </b>{{invoice.ethvs}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>Fixed ETH Exchange Rate: </b>{{invoice.newFixER_ETH}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex x6 sm6 offset-sm3>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </div>

    <!--BTC -->
    <div v-if="userSettings.btcxpub">
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>BTC Address: </b>{{invoice.btcAddress}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex x6 sm6 offset-sm3>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </div>

    <!--LTC -->
    <div v-if="userSettings.ltcxpub">
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>LTC Address: </b>{{invoice.ltcAddress}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex x6 sm6 offset-sm3>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </div>

    <!--XMR -->
    <div v-if="userSettings.xmrAddress">
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>XMR Address: </b>{{userSettings.xmrAddress}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs6 sm6 offset-sm3 text-sm-left>
          <b>XMR VS: </b>{{invoice.xmrvs}}
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex x6 sm6 offset-sm3>
          <v-divider></v-divider>
        </v-flex>
      </v-layout>
    </div>

    <!--
    {{invoice.newFixER_BTC}}
    {{invoice.newFixER_ETH}}
    {{invoice.newFixER_LTC}}
    {{invoice.newFixER_XMR}}
    {{invoice.oldFixER_BTC}}
    {{invoice.oldFixER_ETH}}
    {{invoice.oldFixER_LTC}}
    {{invoice.oldFixER_XMR}}
    -->
  </v-container>
</template>

<script>
export default {
  name: 'Invoice',
  props: ['id'],
  data () {
    return {
      // invoice: this.$store.getters.invoices.find(i => i.id === this.$route.params.id)
    }
  },
  computed: {
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
    }
  }
}
</script>

<style scoped>
</style>
