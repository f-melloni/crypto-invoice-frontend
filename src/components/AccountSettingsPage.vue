<template>
  <v-container>
    <div class="loading" v-if="!loaded">
      <v-progress-circular :size="50" indeterminate color="primary"></v-progress-circular>
    </div>
    <v-layout justify-center>
      <v-flex xs12 sm10 md8 lg6>
      <v-card>
        <v-form ref="form" v-model="valid">
        <v-card-title>
          <v-flex justify-center>
            <h2>Account Settings</h2>
          </v-flex>
        </v-card-title>
        <v-card-text>
          <v-text-field
            name="btcxpub"
            label="BTC XPUB"
            id="btcxpub"
            :rules="xpubRules"
            v-model="userSettings.btcxpub"
            :disabled="!loaded">
          </v-text-field>
          <v-text-field
            name="ltcxpub"
            label="LTC XPUB"
            id="ltcxpub"
            :rules="xpubRules"
            v-model="userSettings.ltcxpub"
            :disabled="!loaded">
          </v-text-field>
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
        </v-card-text>
        <!--<v-divider></v-divider>-->
        <v-card-actions>
          <v-flex justify-center>
            <v-btn
              class="primary"
              ref="saveBtn"
              :disabled="!valid || !loaded"
              @click="submit">Save Changes</v-btn>
          </v-flex>
        </v-card-actions>
        </v-form>
      </v-card>
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
      if (this.$refs.form.validate()) {
        this.$store.dispatch('setUserSettingsAction', this.userSettings);
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
