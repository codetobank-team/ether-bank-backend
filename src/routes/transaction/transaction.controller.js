/* eslint-disable no-underscore-dangle */
const { saveTransaction } = require('./transaction.service');
const { setAsync } = require('../../redis');
const { logger, responseObject } = require('../../utils');

const transactionLogger = logger(module);

const createTransaction = async (req, res) => {
  const {
    senderId,
    receiverId,
    // transactionPin,
    transactionType,
    amount,
    transactionStatus,
  } = req.body;

  try {
    // TODO: perform checks and transactions here

    const newTransaction = await saveTransaction({
      senderId,
      receiverId,
      hash: 'testHash',
      transactionType,
      amount,
      transactionStatus,
    });

    transactionLogger.log('info', `Transaction ${newTransaction._id} successful`);
    await setAsync(`${newTransaction._id}-transaction`, JSON.stringify(newTransaction));

    return responseObject(res, 201, { id: newTransaction._id }, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error confirming transaction: ${err.message}`);
    return responseObject(res, 500, `Error confirming transaction: ${err.message}`, 'error');
  }
};

module.exports = {
  createTransaction,
};
