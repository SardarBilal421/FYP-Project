const express = require('express');
const blockchainController = require('../Controller/blockchainController');

const router = express.Router();

router
  .post('/addTransaction/:pk', blockchainController.addTransaction)
  .post('/minigTransactions/:pk', blockchainController.minigTransactions);
router
  .get('/findTransactions/:pk', blockchainController.findingTransactions)
  .get('/downloadStamp/:id', blockchainController.downloadStamp);

module.exports = router;
