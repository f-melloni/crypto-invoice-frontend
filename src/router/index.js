import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
import AccountSettingsPage from '@/components/AccountSettingsPage';
import PaymentRequestPage from '@/components/PaymentRequestPage';
import DashboardPage from '@/components/Dashboard';
import InvoicePage from '@/components/Invoice'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [{
            path: '/',
            name: 'Dashboard',
            component: DashboardPage
        },
        {
            path: '/paymentrequest',
            name: 'PaymentRequestPage',
            component: PaymentRequestPage
        },
        {
            path: '/accountsettings',
            name: 'AccountSettingsPage',
            component: AccountSettingsPage
        },
        {
            path: '/invoice/:invoiceGuid',
            name: 'InvoicePage',
            component: InvoicePage,
            props: true
        }
    ]
});
