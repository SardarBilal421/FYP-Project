const express = require('express');
const blockchainController = require('../Controller/blockchainController');

const router = express.Router();

router.get('/getHalfTrans', blockchainController.halfTrans);

router.post('/:pk', blockchainController.toFromSignature);
router.get('/v1/:pk/:id', blockchainController.V1Signature);
router.get('/v2/:pk/:id', blockchainController.V2Signature);
router.post('/lawyer/:pk/:id', blockchainController.lawyerSignature);

module.exports = router;
