// Store
import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { connectionString } from '@/appSettings.json';

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
    getInvoice: (state, payload) => {
      state.invoices.push(payload);
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
    },
    loadInvoices: (state, payload) => {
      payload.forEach(invoice => {
        state.invoices.push(invoice);
      });
    }
  },
  actions: {
    getInvoiceAction: ({ commit }, payload) => {
      axios.get(connectionString + '/api/invoices/' + payload, {
        withCredentials: true
      }).then(function (response) {
        commit('getInvoice', response.data);
      }).catch(function (error) {
        console.error(error);
      });
    },
    initStore: ({ commit }) => {
      axios.get(connectionString + '/api/invoices/init', {
        withCredentials: true
      }).then(({ data }) => {
        commit('setUserId', data.userId);
        commit('setDisplayName', data.displayName);
        commit('loadInvoices', data.invoiceList);
        axios.get(connectionString + '/api/user-settings/' + data.userId, {
          withCredentials: true
        }).then((response) => {
          commit('setUserSettings', response.data);
        }).catch(function (error) {
          console.log(error);
        });
      });
    },
    setUserIdAction: ({ commit }, payload) => {
      commit('setUserId', payload);
    },
    setDisplayNameAction: ({ commit }, payload) => {
      commit('setDisplayName', payload);
    },
    setUserSettingsAction: ({ commit, state }, payload) => {
      axios.put(connectionString + '/api/user-settings/' + state.userId, {
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
      axios.delete(connectionString + '/api/invoice/' + payload, {
        withCredentials: true
      }).then(() => {
        commit('deleteInvoice', payload);
      }).catch(function (error) {
        console.error(error);
      });
    }
  }
});
