// Store
import Vuex from 'vuex';
import Vue from 'vue';
import axios from 'axios';
import { connectionString } from '@/appSettings.json';

Vue.use(Vuex);
export default new Vuex.Store({
    state: {
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
        supportedCurrencies: [],
        errorOnSave: false,
        errorMessage: ''
    },
    getters: {
        newInvoice: state => state.newInvoice,
        settingsChanged: state => state.settingsChanged,
        invoices: state => state.invoices,
        supportedCurrencies: state => state.supportedCurrencies,
        userSettings: state => state.userSettings,
        userId: state => state.userId,
        errorOnSave: state => state.errorOnSave,
        errorMessage: state => state.errorMessage
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
        loadSupportedCurrencies: (state, payload) => {
            payload.forEach(currency => {
                state.supportedCurrencies.push(currency);
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
                commit('loadSupportedCurrencies', data.supportCurrencies);
                axios.get(connectionString + '/api/user-settings/' + data.userId, {
                    withCredentials: true
                }).then((response) => {
                    commit('setUserSettings', response.data);
                }).catch(function (error) {
                    console.log(error);
                });
            }).catch(({ message }) => {
                commit('errorOnSave', true);
                commit('errorMessage', message);
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
            }).then((response) => {
                if (response.status === 200) {
                    commit('setUserSettings', payload);
                    commit('settingsChanged', true);
                    console.log('settings changed');
                } else {
                    console.log('response not 200');
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
