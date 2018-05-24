import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', date => {
  return moment(String(date)).format('DD.MM.YYYY hh:mm');
});
Vue.filter('formatState', state => {
  var paymentStates = [
    'Unknown', // should not be possible to get; reason: webapi starts this enum from 1
    'Pending',
    'Waiting for Confirmation',
    'Received and Confirmed'
  ];
  return paymentStates[state];
});
