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
      state.invoices.unshift(payload);
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
    },
    deleteInvoice: (state, payload) => {
      var toDelete = state.invoices.find(i => i.id === payload);
      if (toDelete) {
        var index = state.invoices.indexOf(toDelete);
        state.invoices.splice(index, 1);
      }
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
      axios.put('http://localhost:56442/api/user-settings/' + state.userId, {
        btcxpub: payload.btcxpub,
        ltcxpub: payload.ltcxpub,
        ethAccount: payload.ethAccount,
        xmrAddress: payload.xmrAddress,
        xmrPrivateViewKey: payload.xmrPrivateViewKey,
        xmrPublicViewKey: payload.xmrPublicViewKey
      }, {
        withCredentials: true
      }).then(() => {
        commit('setUserSettings', payload);
      }).catch(function (error) {
        console.error(error);
      });
    },
    deleteInvoiceAction: ({ commit, state }, payload) => {
      axios.delete('http://localhost:56442/api/invoice/' + payload, {
        withCredentials: true
      }).then(() => {
        commit('deleteInvoice', payload);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }
});
