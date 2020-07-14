const router = require('express').Router();
const { createTransaction, getTransaction } = require('./transaction.controller');

router.post('/send', createTransaction);
router.get('/:id', getTransaction);

module.exports = router;
