// Store
import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    userId: '',
    displayName: '', // user's display name
    userSettings: {
      btcxpub: '',
      ltcxpub: '',
      ethAccount: '',
      xmrAddress: '',
      xmrPrivateViewKey: '',
      xmrPublicViewKey: ''
    },
    invoices: []
  },
  getters: {
    invoices: state => state.invoices,
    userSettings: state => state.userSettings,
    userId: state => state.userId
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
    },
    setUserSettings: (state, payload) => {
      state.userSettings.btcxpub = payload.btcxpub;
      state.userSettings.ltcxpub = payload.ltcxpub;
      state.userSettings.ethAccount = payload.ethAccount;
      state.userSettings.xmrAddress = payload.xmrAddress;
      state.userSettings.xmrPrivateViewKey = payload.xmrPrivateViewKey;
      state.userSettings.xmrPublicViewKey = payload.xmrPublicViewKey;
    }
  },
  actions: {
    addInvoiceAction: ({ commit }, payload) => {
      commit('addInvoice', payload);
    },
    setUserIdAction: ({ commit }, payload) => {
      commit('setUserId', payload);
    },
    setDisplayNameAction: ({ commit }, payload) => {
      commit('setDisplayName', payload);
    },
    setUserSettingsAction: ({ commit, state }, payload) => {
      commit('setUserSettings', payload);
      axios.put('http://localhost:56442/api/user-settings/' + state.userId, {
        btcxpub: payload.btcxpub,
        ltcxpub: payload.ltcxpub,
        ethAccount: payload.ethAccount,
        xmrAddress: payload.xmrAddress,
        xmrPrivateViewKey: payload.xmrPrivateViewKey,
        xmrPublicViewKey: payload.xmrPublicViewKey
      }, {
        withCredentials: true
      }).catch(function (error) {
        console.log(error);
      });
    }
  }
});
