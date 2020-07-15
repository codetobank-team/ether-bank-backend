/* eslint-disable no-underscore-dangle */
const { saveTransaction, findTransaction } = require('./transaction.service');
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

    return responseObject(res, 201, newTransaction, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error confirming transaction: ${err.message}`);
    return responseObject(res, 500, `Error confirming transaction: ${err.message}`, 'error');
  }
};

const getTransactions = async (req, res) => {
  const { id } = req.params;

  try {
    const transactions = await findTransaction(id);

    transactionLogger.log('info', `Transactions for user ${id} retrieved.`);
    return responseObject(res, 200, transactions, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error retrieving transaction: ${err.message}`);
    return responseObject(res, 500, `Error retrieving transaction: ${err.message}`, 'error');
  }
};

module.exports = {
  createTransaction,
  getTransactions,
};
