const FingerprintJS = require('@fingerprintjs/fingerprintjs-pro');

// Initialize an agent at application startup.
const fpPromise = FingerprintJS.load({
  apiKey: 'BOCYNJiOr6lMu2CfNSGO',
  region: 'ap',
});

// Get the visitor identifier when you need it.
const f = async () => {
  const a = await fpPromise();
  console.log('tata');
};
