const router = require('express').Router();
const { getWallet, createWallet } = require('./wallet.controller');
const WalletMiddleware = require('./wallet.middleware');
const { middleware: { checkTransactionPin, checkLogin } } = require('../../utils');

router.get('/', checkLogin, WalletMiddleware.validateUserWalletExists, getWallet);
router.post('/', checkLogin, WalletMiddleware.createWalletValidationRules(), WalletMiddleware.validate, checkTransactionPin, createWallet);

module.exports = router;
