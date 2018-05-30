// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import store from './store/store';
import router from './router';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import 'cryptocoins-icons/webfont/cryptocoins.css';
// import axios from 'axios';
// import { connectionString } from './appSettings.json';
import './filters.js';
import colors from 'vuetify/es5/util/colors';
import VueQrCode from '@xkeshi/vue-qrcode';

Vue.component('qrcode', VueQrCode);

Vue.use(Vuetify, {
  theme: {
    // primary: colors.indigo.base,
    secondary: colors.grey.darken1,
    accent: colors.shades.black,
    error: colors.red.accent3
  }
});
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store: store,
  router,
  components: { App },
  template: '<App/>',
  created () {
    // load the store here
    this.$store.dispatch('initStore');
    /* axios.get(connectionString + '/api/invoices/init', {
      withCredentials: true
    }).then(({ data }) => {
      this.$store.dispatch('setUserIdAction', data.userId);
      this.$store.dispatch('setDisplayNameAction', data.displayName);
      data.invoiceList.forEach(element => {
        this.$store.dispatch('addInvoiceAction', element);
      });
      // load user settings here
      axios.get(connectionString + '/api/user-settings/' + this.$store.getters.userId, {
        withCredentials: true
      }).then((response) => {
        this.$store.dispatch('setUserSettingsAction', response.data);
      }).catch(function (error) {
        console.log(error);
      });
    }); */
  }
});
