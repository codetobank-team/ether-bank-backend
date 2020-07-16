const router = require('express').Router();
const { createTransaction, getTransaction, getTransactions } = require('./transaction.controller');
const TransactionMiddleware = require('./transaction.middleware');
const { middleware: { checkLogin, checkTransactionPin } } = require('../../utils');

router.get('/', checkLogin, getTransactions);

router.post(
  '/send',
  checkLogin,
  TransactionMiddleware.createTransactionValidationRules(),
  TransactionMiddleware.validate,
  checkTransactionPin,
  createTransaction,
);
router.get(
  '/:id',
  checkLogin,
  getTransaction,
);

module.exports = router;
