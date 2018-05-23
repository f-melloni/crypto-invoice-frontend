
// cryptocurrency related utils
export default {
  btc: {
    decimals: 8
  },
  ltc: {
    decimals: 8
  },
  paymentStates: [
    'Unknown', // should not be possible to get; reason: webapi starts this enum from 1
    'Pending',
    'Waiting for Confirmation',
    'Received and Confirmed'
  ]
}
