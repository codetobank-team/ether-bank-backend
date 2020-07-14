const router = require('express').Router();
const { createTransaction, getTransactions } = require('./transaction.controller');

router.post('/send', createTransaction);
router.get('/:id', getTransactions);

module.exports = router;
