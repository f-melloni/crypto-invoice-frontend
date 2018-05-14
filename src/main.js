// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import Vuetify from 'vuetify';
import Vuex from 'vuex';
import 'vuetify/dist/vuetify.min.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import axios from 'axios';

Vue.use(Vuetify);
Vue.use(Vuex);
Vue.config.productionTip = false;

// Store
const store = new Vuex.Store({
  state: {
    userId: '',
    displayName: '', // user's display name
    invoices: []
  },
  getters: {
    invoices: state => state.invoices
  },
  mutations: {
    addInvoice: (state, payload) => {
      // get user's invoices from the WebAPI
      var invoice = {
        id: payload.id,
        name: payload.name,
        dateCreated: payload.dateCreated,
        status: payload.status
      }
      state.invoices.unshift(invoice);
    },
    setUserId: (state, payload) => {
      state.userId = payload
    },
    setDisplayName: (state, payload) => {
      state.displayName = payload
    }
  },
  actions: {
    addInvoiceAction ({ commit, state }, payload) {
      commit('addInvoice', payload);
    },
    setUserIdAction: ({ commit, state }, payload) => {
      commit('setUserId', payload);
    },
    setDisplayNameAction: ({ commit, state }, payload) => {
      commit('setDisplayName', payload);
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store: store,
  created () {
    // load the store here
    axios.get('http://localhost:56442/api/invoices/init', {
      withCredentials: true
    }).then(({data}) => {
      console.log(data);
      this.$store.dispatch('setUserIdAction', data.userId);
      this.$store.dispatch('setDisplayNameAction', data.displayName);
      data.invoiceList.forEach(element => {
        this.$store.dispatch('addInvoiceAction', element);
      });
    });
  }
});
