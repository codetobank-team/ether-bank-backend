/* eslint-disable no-underscore-dangle */
const { saveTransaction, findTransaction } = require('./transaction.service');
const { setAsync, getAsync } = require('../../redis');
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

    return responseObject(res, 201, newTransaction, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error confirming transaction: ${err.message}`);
    return responseObject(res, 500, `Error confirming transaction: ${err.message}`, 'error');
  }
};

const getTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    let transaction = JSON.parse(await getAsync(`${id}-transaction`));

    if (!transaction) {
      transaction = await findTransaction(id);

      if (!transaction) return responseObject(res, 400, 'No transaction matches that ID', 'error');
    }

    transactionLogger.log('info', `Transaction ${id} retrieved.`);
    return responseObject(res, 200, transaction, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error retrieving transaction: ${err.message}`);
    return responseObject(res, 500, `Error retrieving transaction: ${err.message}`, 'error');
  }
};

module.exports = {
  createTransaction,
  getTransaction,
};
