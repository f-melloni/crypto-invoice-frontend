<template>
  <v-container fluid grid-list-md>
    <v-layout>
      <v-flex xs12 lg8 offset-lg2>
      <v-card>
        <v-form ref="form" v-model="valid">
        <v-card-title>
          <h1>Account Settings</h1>
        </v-card-title>
        <v-card-text>
          <v-text-field
            name="btcxpub"
            label="BTC XPUB"
            id="btcxpub"
            :rules="xpubRules"
            v-model="userSettings.btcxpub">
          </v-text-field>
          <v-text-field
            name="ltcxpub"
            label="LTC XPUB"
            id="ltcxpub"
            :rules="xpubRules"
            v-model="userSettings.ltcxpub">
          </v-text-field>
          <!--
            <v-text-field
            name="ethaccount"
            label="ETH Account"
            id="ethaccount"
            :rules="ethRules"
            v-model="userSettings.ethAccount"
            :disabled="!loaded">
          </v-text-field>
          <v-text-field
            name="xmraddress"
            label="XMR Address"
            id="xmraddress"
            :rules="xmrAddRules"
            v-model="userSettings.xmrAddress"
            :disabled="!loaded">
          </v-text-field>
          <v-text-field
            name="xmrprivateviewkey"
            label="XMR Private View Key"
            id="xmrprivateviewkey"
            v-model="userSettings.xmrPrivateViewKey"
            :rules="xmrViewKeyRules"
            :disabled="!loaded">
          </v-text-field>
          <v-text-field
            name="xmrpublicviewkey"
            label="XMR Public View Key"
            id="xmrpublicviewkey"
            v-model="userSettings.xmrPublicViewKey"
            :rules="xmrViewKeyRules"
            :disabled="!loaded">
          </v-text-field>
          -->
        </v-card-text>
        </v-form>
      </v-card>
    </v-flex>
    </v-layout>

    <!-- action buttons -->
    <v-layout row wrap>
      <v-flex xs12 md12 lg8 offset-lg2>
        <v-layout>
          <v-flex xs3 align-content-center>
            <v-card>
              <v-card-text>
                <v-layout row>
                  <v-flex>
                    <v-btn @click="submit" :disabled="!valid" color="primary">Submit</v-btn>
                  </v-flex>
                  <v-flex>
                    <v-btn @click="reset" color="primary">Reset</v-btn>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-flex>
          <v-flex lg9>
            <v-card>
              <v-alert type="warning" class="black--text" :value="noSettings">Warning: You will not be able to create new invoices without setting at least one address</v-alert>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: 'AccountSettingsPage',
  data () {
    return {
      valid: true,
      noSettings: false,
      loaded: false,
      savedDialog: false,
      userSettings: {},
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
    this.userSettings = this.$store.getters.userSettings;
    this.loaded = true;
  },
  computed: {},
  methods: {
    submit () {
      if (!this.userSettings.btcxpub && !this.userSettings.ltcxpub) {
        this.noSettings = true;
        return;
      }
      if (this.$refs.form.validate()) {
        this.noSettings = false;
        this.$store.dispatch('setUserSettingsAction', this.userSettings);
      }
    },
    reset () {
      this.$refs.form.reset();
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
