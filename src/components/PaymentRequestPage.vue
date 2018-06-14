<template>
  <v-container fluid grid-list-sm>
    <v-form ref="form" v-model="valid">
    <!--Main Options-->
    <v-layout row wrap justify-center>
      <v-flex xs12 md12 lg6>
        <v-card>
          <v-card-title>
            <h1>New Invoice</h1>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 md6 lg6>
                <v-text-field required label="Invoice Name" v-model="newInvoice.name" :rules="[rules.notEmpty]"></v-text-field>
                <v-text-field required label="Mail of Recipient" v-model="newInvoice.recipient" :rules="[rules.notEmpty, rules.email]"></v-text-field>
              </v-flex>
              <v-flex xs12 md6 lg6>
                <v-text-field required label="Payment Amount in Fiat" v-model="newInvoice.fiatAmount" :rules="[rules.notEmpty, rules.amount]"></v-text-field>
                <v-select required label="Select Fiat Currency" :items="fiatCurrencies" v-model="newInvoice.fiatCurrencyCode" :rules="[rules.notEmpty]"></v-select>
              </v-flex>
              <v-flex>
                <v-text-field xs12 multi-line label="Description" v-model="newInvoice.description"></v-text-field>
              </v-flex>
            </v-layout>
            <v-flex class="text-sm-left">
              <small>*indicates required field</small>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout row wrap justify-center>
    <!--Crypto Options-->
      <v-flex xs12 md12 lg6>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-card class="subCard">
              <v-card-title><h2>Cryptocurrencies</h2></v-card-title>
              <v-card-text>
                <v-layout row wrap>
                  <v-checkbox v-for="item in supportedCurrencies" v-if="isCurrencySetUp(item.currencyCode)" :key="item.currencyCode" v-model="acceptCryptos" :value="item.currencyCode" :color="item.color" :label="item.currencyCode"></v-checkbox>
                </v-layout>
                <v-layout row wrap>
                  <!--<v-checkbox :disabled="true" color="blue darken-3" label="ETH"></v-checkbox>
                  <v-checkbox :disabled="true" color="orange darken-3" label="XMR"></v-checkbox>-->
                </v-layout>
                <v-flex class="text-xs-left"><small>Select at least one</small></v-flex>
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
    <!-- action buttons -->
    <v-layout row wrap justify-center>
      <v-flex xs12 md12 lg6>
        <v-layout>
          <v-flex xs12 md4 lg6 align-content-center>
            <v-card>
              <v-card-text>
                <v-layout row>
                  <v-flex>
                    <v-btn @click="submit" :loading="loading" :disabled="!valid" color="primary">Create</v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn @click="reset" color="primary">Clear</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex lg8>
            <v-card v-if="atLeastOneCheckboxAlert">
              <v-alert type="error" :value="atLeastOneCheckboxAlert">At least one cryptocurrency must be selected.</v-alert>
            </v-card>
            <v-card v-if="noSettings">
              <v-alert type="error" :value="noSettings">No address set in account settings.</v-alert>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    </v-form>
    <v-snackbar top color="error" v-model="showError">
      Something went wrong: {{ errorMessage }}
      <v-btn flat @click="showError = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios';
import { frontEndUrl } from '@/appSettings.json';
export default {
  name: 'PaymentRequestPage',
  data () {
    return {
      loading: false,
      showError: false,
      errorMessage: '',
      atLeastOneCheckboxAlert: false,
      acceptCryptos: [],
      valid: false,
      newInvoice: {},
      uploadedFile: null,
      uploadedFileName: '',
      supportedCurrencies: this.$store.getters.supportedCurrencies,
      rules: {
        email: (value) => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Invalid e-mail.'
        },
        amount: (value) => {
          return !isNaN(value) || 'Must be a valid number.';
        },
        notEmpty: (value) => {
          return (value || '').length > 0 || 'This field is required';
        }
      }
    };
  },
  watch: {
    acceptCryptos () {
      if (this.atLeastOneCheckboxAlert && this.acceptCryptos.length > 0) {
        this.atLeastOneCheckboxAlert = false;
        this.valid = this.$refs.form.validate();
      }
    }
  },
  computed: {
    fiatCurrencies () {
      return ['USD', 'EUR', 'CZK'];
    },
    noSettings () {
      return !this.isCurrencySetUp('btc') && !this.isCurrencySetUp('ltc');
    }
  },
  methods: {
    isCurrencySetUp (currency) {
      var currencySetting = {
        btc: 'btcxpub',
        ltc: 'ltcxpub'
      };
      return this.$store.getters.userSettings[currencySetting[currency.toLowerCase()]].length > 0;
    },
    openFileUpload () {
      document.getElementById('inputFile').click();
    },
    fileChanged (file) {
      this.uploadedFile = file;
      this.uploadedFileName = file.name;
    },
    reset () {
      this.$refs.form.reset();
    },
    submit () {
      this.loading = true;
      if (this.acceptCryptos.length === 0) {
        this.atLeastOneCheckboxAlert = true;
        this.valid = false;
        return;
      }

      this.atLeastOneCheckboxAlert = false;
      if (this.$refs.form.validate()) {
        var self = this;
        var send = function (payload) {
          self.$store.dispatch('newInvoiceAction', false);
          axios.post(frontEndUrl[process.env.NODE_ENV] + '/api/invoices', payload, {
            withCredentials: true
          }).then(function (response) {
            if (response.status === 201) {
              self.$store.dispatch('getInvoiceAction', response.data);
              self.$store.dispatch('newInvoiceAction', true);
              self.$router.push({name: 'Dashboard'});
            }
          }).catch(function (error) {
            if (error.response.status === 401) {
              window.location.replace(frontEndUrl[process.env.NODE_ENV] + '/Account/Login/');
            } else {
              // show snackbar
              self.showError = true;
              self.errorMessage = 'Please try again later...';
            }
          });
        };

        var payload = {
          Name: this.newInvoice.name,
          Description: this.newInvoice.description,
          FiatAmount: this.newInvoice.fiatAmount,
          FiatCurrencyCode: this.newInvoice.fiatCurrencyCode,
          Accept: this.acceptCryptos,
          Recipient: this.newInvoice.recipient
        };

        // Send with file
        if (this.uploadedFile) {
          payload.FileName = this.uploadedFile.name;
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
        this.loading = false;
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
  height: 170px !important;
}
label {
  color: black !important;;
}
</style>
