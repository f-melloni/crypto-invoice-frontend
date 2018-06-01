// Store
import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { frontEndUrl } from '@/appSettings.json';

Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    unlogged: false,
    newInvoice: false, // new invoice snackbar on dashboard
    settingsChanged: false, // snackbar on dashboard
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
    invoices: [],
    errorOnSave: false,
    errorMessage: '',
    supportedCurrencies: []
  },
  getters: {
    unlogged: state => state.unlogged,
    newInvoice: state => state.newInvoice,
    settingsChanged: state => state.settingsChanged,
    invoices: state => state.invoices,
    userSettings: state => state.userSettings,
    userId: state => state.userId,
    errorOnSave: state => state.errorOnSave,
    errorMessage: state => state.errorMessage,
    supportedCurrencies: state => state.supportedCurrencies
  },
  mutations: {
    loadSupportedCurrencies: (state, payload) => {
      payload.forEach(currency => {
          state.supportedCurrencies.push(currency);
      });
    },
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
      var toDelete = state.invoices.find(i => i.invoiceGuid === payload);
      if (toDelete) {
        var index = state.invoices.indexOf(toDelete);
        state.invoices.splice(index, 1);
      }
    },
    loadInvoices: (state, payload) => {
      payload.forEach(invoice => {
        state.invoices.push(invoice);
      });
    },
    newInvoice: (state, payload) => {
      state.newInvoice = payload;
    },
    settingsChanged: (state, payload) => {
      state.settingsChanged = payload;
    },
    errorOnSave: (state, payload) => {
      state.errorOnSave = payload;
    },
    errorMessage: (state, payload) => {
      state.errorMessage = payload;
    },
    unlogged: (state, payload) => {
      state.unlogged = payload;
    }
  },
  actions: {
    errorOnSaveAction: ({ commit }, payload) => {
      commit('errorOnSave', payload);
    },
    newInvoiceAction: ({ commit }, payload) => {
      commit('newInvoice', payload);
    },
    settingsChangedAction: ({ commit }, payload) => {
      commit('settingsChanged', payload);
    },
    getInvoiceAction: ({ commit }, payload) => {
      axios.get('http://185.59.209.146:38080' + '/api/invoices/' + payload, {
        withCredentials: true
      }).then(function (response) {
        commit('getInvoice', response.data);
      }).catch(function (error) {
        console.error(error);
        if (error.response.status === 401) {
          window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
        }
      });
    },
    deleteInvoiceAction: ({ commit, state }, payload) => {
      axios.delete('http://185.59.209.146:38080' + '/api/invoice/' + payload, {
        withCredentials: true
      }).then(() => {
        commit('deleteInvoice', payload);
      }).catch(function (error) {
        console.error(error);
      });
    },
    initStore: ({ commit }) => {
      axios.get('http://185.59.209.146:38080' + '/api/invoices/init', {
        withCredentials: true
      }).then(({ status, data }) => {
        commit('loadSupportedCurrencies', data.supportCurrencies);

        if (data.userId !== null) {
          commit('setUserId', data.userId);
          commit('setDisplayName', data.displayName);
          commit('loadInvoices', data.invoiceList);

          axios.get('http://185.59.209.146:38080' + '/api/user-settings/' + data.userId, {
            withCredentials: true
          }).then((response) => {
            commit('setUserSettings', response.data);
          }).catch(function (error) {
            console.log(error);
            if (error.response.status === 401) {
              window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
            }
          });
        } else {
          if (!window.location.pathname.includes('invoice')) {
            window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
          }
          commit('unlogged', true);
        }
      }).catch((error) => {
        commit('unlogged', true);
        if (error.response.status === 401 && !window.location.pathname.includes('invoice')) {
          window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
        }
        commit('errorOnSave', true);
        commit('errorMessage', error.message);
      });
    },
    setUserIdAction: ({ commit }, payload) => {
      commit('setUserId', payload);
    },
    setDisplayNameAction: ({ commit }, payload) => {
      commit('setDisplayName', payload);
    },
    setUserSettingsAction: ({ commit, state }, payload) => {
      axios.put('http://185.59.209.146:38080' + '/api/user-settings/' + state.userId, {
        btcxpub: payload.btcxpub,
        ltcxpub: payload.ltcxpub,
        ethAccount: payload.ethAccount,
        xmrAddress: payload.xmrAddress,
        xmrPrivateViewKey: payload.xmrPrivateViewKey,
        xmrPublicViewKey: payload.xmrPublicViewKey
      }, {
        withCredentials: true
      }).then((response) => {
        if (response.status === 200) {
          commit('setUserSettings', payload);
          commit('settingsChanged', true);
        } else {
          commit('errorOnSave', true);
          commit('errorMessage', response.data);
        }
      }).catch((error) => {
        commit('errorOnSave', true);
        if (error.response) {
          commit('errorMessage', error.response.data);
        } else {
          commit('errorMessage', error.message);
        }
        if (error.response.status === 401) {
          window.location.replace('http://185.59.209.146:38080' + '/Account/Login/');
        }
      });
    }
  }
});
