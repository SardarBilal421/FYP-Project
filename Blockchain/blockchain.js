const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transactions {
  constructor(fromAddress, toAddress, stampDetail, stampName) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.stampDetail = stampDetail;
    this.stampName = stampName;
    this.signature;
  }

  calculateHash() {
    return SHA256(
      this.fromAddress + this.toAddress + this.stampDetail + this.timestamp
    ).toString();

    //     return crypto
    //       .createHash('sha256')
    //       .update(this.fromAddress + this.toAddress + this.stampDetail + this.timestamp)
    //       .digest('hex');
  }
  signToTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.toAddress) {
      throw new Error('You Cannot Sign Transactions for other Wallets !!!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signatureTo = sig.toDER('hex');
    // this.signature.push(sig.toDER("hex"));
  }

  signFromTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.fromAddress) {
      throw new Error('You Cannot Sign Transactions for other Wallets !!!');
    }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signatureFrom = sig.toDER('hex');
  }
  signV1Transaction(signingKey) {
    // if (signingKey.getPublic("hex") !== this.v1Address) {
    //   throw new Error("You Cannot Sign Transactions for other Wallets !!!");
    // }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.v1publicKey = signingKey.getPublic('hex');
    this.signatureV1 = sig.toDER('hex');
  }
  signV2Transaction(signingKey) {
    // if (signingKey.getPublic("hex") !== this.V2Address) {
    //   throw new Error("You Cannot Sign Transactions for other Wallets !!!");
    // }

    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');
    this.v2publicKey = signingKey.getPublic('hex');

    this.signatureV2 = sig.toDER('hex');
  }
  signLawyerTransaction(signingKey) {
    // if (signingKey.getPublic("hex") !== this.LawyerAddress) {
    //   throw new Error("You Cannot Sign Transactions for other Wallets !!!");
    // }
    this.LawyerPublic = signingKey.getPublic('hex');
    const hashTx = this.calculateHash();
    const sig = signingKey.sign(hashTx, 'base64');

    this.signatureLawyer = sig.toDER('hex');
  }

  isFromValid() {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress === null) return true;

    if (!this.signatureFrom || this.signatureFrom.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signatureFrom);
  }
  isToValid() {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress === null) return true;

    if (!this.signatureTo || this.signatureTo.length === 0) {
      throw new Error('No signature in this transaction');
    }

    const publicKey = ec.keyFromPublic(this.toAddress, 'hex');
    return publicKey.verify(this.calculateHash(), this.signatureTo);
  }
  // isV1Valid() {
  //   // If the transaction doesn't have a from address we assume it's a
  //   // mining reward and that it's valid. You could verify this in a
  //   // different way (special field for instance)
  //   if (this.fromAddress === null) return true;

  //   if (!this.signatureV1 || this.signatureV1.length === 0) {
  //     throw new Error("No signature in this transaction");
  //   }

  //   const publicKey = ec.keyFromPublic(signingKey., "hex");
  //   return publicKey.verify(this.calculateHash(), this.signatureV1);
  // }
  // isV2Valid() {
  //   // If the transaction doesn't have a from address we assume it's a
  //   // mining reward and that it's valid. You could verify this in a
  //   // different way (special field for instance)
  //   if (this.fromAddress === null) return true;

  //   if (!this.signatureTo || this.signatureTo.length === 0) {
  //     throw new Error("No signature in this transaction");
  //   }

  //   const publicKey = ec.keyFromPublic(this.toAddress, "hex");
  //   return publicKey.verify(this.calculateHash(), this.signatureTo);
  // }
  isLawyerValid() {
    // If the transaction doesn't have a from address we assume it's a
    // mining reward and that it's valid. You could verify this in a
    // different way (special field for instance)
    if (this.fromAddress === null) return true;

    if (!this.signatureLawyer || this.signatureLawyer.length === 0) {
      throw new Error('No signature in this transaction From Lawyer');
    }

    const publicKey = ec.keyFromPublic(this.LawyerPublic, 'hex');
    return publicKey.verify(this.calculateHash(), this.signatureLawyer);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }
  calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.transactions) +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join(' ')
    ) {
      this.nonce++;
      // this.hash = this.calculateHash();
    }
    this.hash = this.calculateHash();
    console.log(' Block mined : ' + this.hash);
  }

  hasValidTransactions() {
    for (const tx of this.transactions) {
      if (!(tx.isToValid() && tx.isFromValid() && tx.isLawyerValid())) {
        return false;
      }
    }

    return true;
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 0;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }
  createGenesisBlock() {
    return new Block(' 01/01/2017 ', ' Genesis block ', '0');
  }
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
  // addBlock(newBlock) {
  //   newBlock.previousHash = this.getLatestBlock().hash;
  //   newBlock.mineBlock(this.difficulty);
  //   this.chain.push(newBlock);
  // }

  minePendingTrasactions(miningRewardAddress) {
    let block = new Block(
      Date(),
      this.pendingTransactions,
      this.chain[this.chain.length - 1].hash
    );
    block.mineBlock(this.difficulty);

    console.log('Block Successfully Mined');

    this.chain.push(block);
    // this.pendingTransactions.pop();
    this.pendingTransactions = [
      new Transactions(null, miningRewardAddress, this.miningReward),
    ];
  }

  addTransaction(transactions) {
    if (!transactions.fromAddress || !transactions.toAddress) {
      throw new Error('Transaction must include from and to address');
    }

    // Verify the transactiion
    if (
      !(
        transactions.isFromValid() &&
        transactions.isToValid() &&
        transactions.isLawyerValid()
      )
    ) {
      throw new Error('Cannot add invalid transaction to chain');
    }

    this.pendingTransactions.push(transactions);
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (trans.fromAddress === address) {
          balance -= trans.stampDetail;
        }
        if (trans.toAddress === address) {
          balance += trans.stampDetail;
        }
      }
    }
    return balance;
  }
  getStampsOfAddress(address) {
    let stamp = [];
    for (const block of this.chain) {
      for (const trans of block.transactions) {
        if (typeof trans !== 'string') {
          // if (trans.fromAddress === address) {
          stamp.push(trans);
          // }
        }
        // console.log(typeof trans);
        // if (trans.toAddress === address) {
        //   balance += trans.stampDetail;
        // }
      }
    }
    return stamp;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (!currentBlock.hasValidTransactions()) {
        console.log('1');
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log(i, '2');
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.calculateHash()) {
        if (i != 1) {
          return false;
        }
      }
    }
    return true;
  }
}

const sardarCoin = new Blockchain();
// const transaction = new Transactions();

module.exports.sardarCoin = sardarCoin;
module.exports.Transactions = Transactions;
