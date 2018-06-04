import Vue from 'vue';
import moment from 'moment';

Vue.filter('formatDate', date => {
  return date ? moment(String(date)).format('DD.MM.YYYY hh:mm') : null;
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

Vue.filter('stateIcon', state => {
  var stateIcons = [
    'Unknown', // should not be possible to get; reason: webapi starts this enum from 1
    'radio_button_unchecked',
    'access_time',
    'done_all'
  ];
  return stateIcons[state];
});

Vue.filter('avatarColor', state => {
  var avatarColors = [ // indeces related to invoice state
    'primary',
    'grey',
    'orange',
    'success'
  ]
  return avatarColors[state];
});

Vue.filter('cryptoCheckColor', cc => {
  var cryptoColors = {
    BTC: 'orange',
    LTC: 'grey',
    ETH: 'blue',
    XMR: 'purple'
  };
  if (cryptoColors[cc.toUpperCase()]) {
    return cryptoColors[cc.toUpperCase()];
  } else {
    return 'primary';
  }
});
