const express = require('express');
const blockchainController = require('../Controller/blockchainController');

const router = express.Router();

router
  .post('/addTransaction', blockchainController.addTransaction)
  .post('/minigTransactions/:pk', blockchainController.minigTransactions);
router.get('/findTransactions/:pk', blockchainController.findingTransactions);

module.exports = router;
