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
  }
});
