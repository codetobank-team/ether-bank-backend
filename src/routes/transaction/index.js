const router = require('express').Router();
const {
  createTransaction,
  getTransactions,
} = require('./transaction.controller');
const TransactionMiddleware = require('./transaction.middleware');
const { isLoggedIn } = require('../../utils');

router.post(
  '/send',
  isLoggedIn,
  TransactionMiddleware.createTransactionValidationRules(),
  TransactionMiddleware.validate,
  TransactionMiddleware.validateUserWithIdExist,
  createTransaction,
);
router.get(
  '/:id',
  isLoggedIn,
  TransactionMiddleware.getTransactionsValidationRules(),
  TransactionMiddleware.validate,
  getTransactions,
);

module.exports = router;
