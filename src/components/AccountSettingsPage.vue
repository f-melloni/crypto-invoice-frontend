<template>
  <v-container>
    <div class="loading" v-if="!loaded">
      <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1>Account Settings</h1>
      </v-flex>
    </v-layout>
    <v-form ref="form" v-model="valid">
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="btcxpub"
            label="BTC XPUB"
            id="btcxpub"
            :rules="xpubRules"
            v-model="btcxpub"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="ltcxpub"
            label="LTC XPUB"
            id="ltcxpub"
            :rules="xpubRules"
            v-model="ltcxpub"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="ethaccount"
            label="ETH Account"
            id="ethaccount"
            :rules="ethRules"
            v-model="ethAccount"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="xmraddress"
            label="XMR Address"
            id="xmraddress"
            :rules="xmrAddRules"
            v-model="xmrAddress"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="xmrprivateviewkey"
            label="XMR Private View Key"
            id="xmrprivateviewkey"
            v-model="xmrPrivateViewKey"
            :rules="xmrViewKeyRules"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
          <v-text-field
            name="xmrpublicviewkey"
            label="XMR Public View Key"
            id="xmrpublicviewkey"
            v-model="xmrPublicViewKey"
            :rules="xmrViewKeyRules"
            :disabled="!loaded">
          </v-text-field>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-flex xs12 sm6 offset-sm3>
          <v-btn
            class="primary"
            :disabled="!valid || !loaded"
            @click="submit">Save Changes</v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>
<script>
import axios from 'axios';
export default {
  name: 'AccountSettingsPage',
  data () {
    return {
      valid: true,
      loaded: false,
      btcxpub: '',
      ltcxpub: '',
      ethAccount: '',
      xmrAddress: '',
      xmrPrivateViewKey: '',
      xmrPublicViewKey: '',
      xpubRules: [
        v => (v === '' || (v.length === 111 && v.startsWith('xpub'))) || 'Invalid XPUB format'
      ],
      ethRules: [
        v => (v === '' || v.length === 42) || 'Invalid address length',
        v => (v === '' || v.startsWith('0x')) || 'Address must begin with 0x'
      ],
      xmrAddRules: [
        v => (v === '' || ((v.length === 95 || v.length === 106) && v.startsWith('4'))) || 'Invalid address format'
      ],
      xmrViewKeyRules: [
        v => (v === '' || v.length === 64) || 'Invalid view key Format'
      ]
    };
  },
  created () {
    // static user id for testing in MVP
    // get session id
    axios.get('http://localhost:56442/api/user-settings/ef2d3969-cbc8-4480-86bf-949b930a0f5c', {
      withCredentials: true,
      headers: {
        // Cookie: 'ASP.NET_SessionId=knjzggix3t1z03o3zg4okzhb'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Accept': 'application/json'
      }
    }).then((response) => {
      this.loaded = true;
      var data = response.data;
      this.btcxpub = data.btcxpub;
      this.ltcxpub = data.ltcxpub;
      this.ethAccount = data.ethAccount;
      this.xmrAddress = data.xmrAddress;
      this.xmrPrivateViewKey = data.xmrPrivateViewKey;
      this.xmrPublicViewKey = data.xmrPublicViewKey;
    }).catch(function (error) {
      console.log(error);
    });
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        // send if the form is valid
        axios.put('http://localhost:56442/api/user-settings/ef2d3969-cbc8-4480-86bf-949b930a0f5c', {
          btcxpub: this.btcxpub,
          ltcxpub: this.ltcxpub,
          ethAccount: this.ethAccount,
          xmrAddress: this.xmrAddress,
          xmrPrivateViewKey: this.xmrPrivateViewKey,
          xmrPublicViewKey: this.xmrPublicViewKey
        }, {
          withCredentials: true
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .loading {
    position: fixed;
    z-index: 999;
    height: 2em;
    width: 2em;
    overflow: show;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
