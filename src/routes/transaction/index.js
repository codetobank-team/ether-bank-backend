const router = require('express').Router();
const {
  createTransaction,
  getTransactions,
} = require('./transaction.controller');
const TransactionMiddleware = require('./transaction.middleware');

router.post(
  '/send',
  TransactionMiddleware.createTransactionValidationRules(),
  TransactionMiddleware.validate,
  TransactionMiddleware.validateUserWithIdExist,
  createTransaction,
);
router.get(
  '/:id',
  TransactionMiddleware.getTransactionsValidationRules(),
  TransactionMiddleware.validate,
  getTransactions,
);

module.exports = router;
