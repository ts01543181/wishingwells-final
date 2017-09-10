const router = require('express').Router();
let express = require('express')
let path = require('path')
const coinBaseController = require('../controllers/coinBaseController.js');
const stripeController = require('../controllers/stripeController.js');

router.post('/addAWallet', coinBaseController.addAWallet)
router.post('/buyCrypto', coinBaseController.buyCrypto)
router.post('/addACard', stripeController.addACard)
router.post('/makeInvestment', stripeController.makePayment)
router.post('/payFees', stripeController.makePayment)
router.get('/getBitcoinValue', coinBaseController.getBitcoinValue)
router.post('/getWellTotal', coinBaseController.getWellTotal)

module.exports = router;
