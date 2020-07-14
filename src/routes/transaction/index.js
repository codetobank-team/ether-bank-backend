const router = require('express').Router();
const { createTransaction } = require('./transaction.controller');

router.post('/send', createTransaction);

module.exports = router;
