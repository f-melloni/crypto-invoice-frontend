<template>
  <v-container fluid grid-list-md>
    <!--Main Options-->
    <v-layout row wrap>
      <v-flex xs12 md12 lg8 offset-lg2>
        <v-card>
          <v-card-title>
            <h1>New Invoice</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 lg6 pr-2>
                <v-text-field label="Name" v-model="newInvoice.name"></v-text-field>
                <v-text-field label="Mail of Recipient" v-model="newInvoice.recipient"></v-text-field>
              </v-flex>
              <v-flex xs12 lg6 pl-2>
                <v-text-field label="Payment Amount in Fiat" v-model="newInvoice.fiatAmount"></v-text-field>
                <v-select label="Select Fiat Currency" :items="fiatCurrencies" v-model="newInvoice.fiatCurrencyCode"></v-select>
              </v-flex>
              <v-flex>
                <v-text-field xs12 multi-line label="Description" v-model="newInvoice.description"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
    <!--Crypto Options-->
      <v-flex xs12 md12 lg8 offset-lg2>
        <v-layout xs12>
          <v-flex xs12 sm6>
            <v-card class="subCard">
              <v-card-title><h2>Select Cryptocurrencies</h2></v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12 lg6>
                    <v-checkbox color="orange" label="BTC" v-model="newInvoice.acceptBTC"></v-checkbox>
                    <v-checkbox color="grey" label="LTC" v-model="newInvoice.acceptLTC"></v-checkbox>
                  </v-flex>
                  <v-flex xs12 lg6>
                    <v-checkbox color="blue darken-3" label="ETH"></v-checkbox>
                    <v-checkbox color="orange darken-3" label="XMR"></v-checkbox>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <!--Include file-->
          <v-flex xs12 sm6>
            <v-card class="subCard">
              <v-card-title><h2>Include File</h2></v-card-title>
              <v-card-text>
                <input id="inputFile" type="file" @change="fileChanged($event.target.files[0])"/>
                <v-text-field label="Select a file to upload" @click="openFileUpload" v-model="uploadedFileName"></v-text-field>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12 md12 lg8 offset-lg2 justify-center>
        <v-card>
          <v-card-text>
            <v-btn @click="submit" color="primary">Submit</v-btn>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import axios from 'axios';
import { connectionString } from '@/appSettings.json';
export default {
  name: 'PaymentRequestPage',
  data () {
    return {
      newInvoice: {},
      uploadedFile: null,
      uploadedFileName: ''
    };
  },
  computed: {
    fiatCurrencies () {
      return ['USD', 'EUR', 'CZK'];
    }
  },
  methods: {
    openFileUpload () {
      document.getElementById('inputFile').click();
    },
    fileChanged (file) {
      this.uploadedFile = file;
      this.uploadedFileName = file.name;
    },
    submit () {
      var self = this;
      function send (payload) {
        axios.post(connectionString + '/api/invoices', payload, {
          withCredentials: true
        }).then(function (response) {
          if (response.status === 200) {
            self.$store.dispatch('getInvoiceAction', response.data);
          }
        }).catch(function (error) {
          console.error('Post Error: ', error);
        });
      };

      var payload = {
        Name: this.newInvoice.name,
        Description: this.newInvoice.description,
        FiatAmount: this.newInvoice.fiatAmount,
        FiatCurrencyCode: this.newInvoice.fiatCurrencyCode,
        AcceptBTC: this.newInvoice.acceptBTC,
        AcceptLTC: this.newInvoice.acceptLTC,
        Recipient: this.newInvoice.recipient
      };
      // Send with file
      if (this.uploadedFile) {
        // Get Base64
        var reader = new FileReader();
        reader.onload = function () {
          payload.File = this.result;
          send(payload);
        };
        reader.readAsDataURL(this.uploadedFile);
        reader.onerror = function (error) {
          console.error('File Error: ', error);
        };
      } else { // Send without file
        send(payload);
      }
    }
  }
};
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#inputFile {
  display: none;
}
.subCard {
  height: 200px !important;
}
</style>
