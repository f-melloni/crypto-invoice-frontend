import Vue from 'vue';
import Router from 'vue-router';
// import HelloWorld from '@/components/HelloWorld'
import AccountSettingsPage from '@/components/AccountSettingsPage';
import PaymentRequestPage from '@/components/PaymentRequestPage';
import PaymentStatusPage from '@/components/PaymentStatusPage';
import DashboardPage from '@/components/Dashboard';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PaymentStatusPage',
      component: PaymentStatusPage,
      alias: '/PaymentStatus'
    },
    {
      path: '/PaymentRequest',
      name: 'PaymentRequestPage',
      component: PaymentRequestPage
    },
    {
      path: '/AccountSettings',
      name: 'AccountSettingsPage',
      component: AccountSettingsPage
    },
    {
      path: '/Dashboard',
      name: 'Dashboard',
      component: DashboardPage
    }
  ]
});
