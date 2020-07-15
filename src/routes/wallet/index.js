const router = require('express').Router();
const { getUserWallet } = require('./wallet.controller');
const WalletMiddleware = require('./wallet.middleware');
const { isLoggedIn } = require('../../utils');

router.get('/', isLoggedIn, WalletMiddleware.validateUserWalletExists, getUserWallet);

module.exports = router;
