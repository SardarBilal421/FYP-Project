const Stripe = require('stripe');
const stripe = Stripe(
  'sk_test_51MhyqhLy1T7vv3BcjtSKpiTpfnswKm7ktHLMN4qK2gCW94u9h1ZtAqXpEae5s1cz7wZuHjgjFy6eUd5YcZ5CRDpq002zqpUSpE'
);

var charge = stripe.charges
  .retrieve('ch_3MhzGQLy1T7vv3Bc1JA0krp2', {
    apiKey:
      'sk_test_51MhyqhLy1T7vv3BcjtSKpiTpfnswKm7ktHLMN4qK2gCW94u9h1ZtAqXpEae5s1cz7wZuHjgjFy6eUd5YcZ5CRDpq002zqpUSpE',
  })
  .then((result) => {
    console.log(result.status);
  })
  .catch((err) => {});

stripe.charges.retrieve('ch_3MhzGQLy1T7vv3Bc1JA0krp2', {
  stripeAccount: 'acct_1MhyqhLy1T7vv3Bc',
});
