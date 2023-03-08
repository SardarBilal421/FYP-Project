const EC = require("elliptic").ec;

const ec = new EC("secp256k1");

// Generate a new key pair and convert them to hex-strings
const key = ec.genKeyPair();
const publicKey = key.getPublic("hex");
const privateKey = key.getPrivate("hex");

const key1 = ec.genKeyPair();
const publicKey1 = key1.getPublic("hex");
const privateKey1 = key1.getPrivate("hex");

// Print the keys to the console
console.log();
console.log(
  "Your public key (also your wallet address, freely shareable)\n",
  publicKey
);

console.log();

console.log(
  "Your private key (keep this secret! To sign transactions)\n",
  privateKey
);

// Print the keys to the console
console.log();
console.log(
  "Your public key (also your wallet address, freely shareable)\n",
  publicKey1
);

console.log();

console.log(
  "Your private key (keep this secret! To sign transactions)\n",
  privateKey1
);
