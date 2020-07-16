/* eslint-disable no-underscore-dangle */
const { saveTransaction, findTransaction, findWalletTransactions } = require('./transaction.service');
const { findUserWallet, getAddressBalance, findWalletByAddressOrAccountNumber } = require('../wallet/wallet.service');
const {
  logger, responseObject, validatorUtils: { isEthereumAddress }, blockUtils: { sendToken },
} = require('../../utils');

const transactionLogger = logger(module);

const createTransaction = async (req, res) => {
  const {
    body: {
      recipient,
      transactionPin,
      amount,
    }, userId,
  } = req;

  try {
    const senderWallet = await findUserWallet(userId);
    const recipientWallet = await findWalletByAddressOrAccountNumber(recipient);

    if (!recipientWallet && !isEthereumAddress(recipient)) { return responseObject(res, 400, 'Invalid recipient address or account number.', 'error'); }

    const senderBalance = await getAddressBalance(senderWallet.address);

    if (parseFloat(senderBalance) < parseFloat(amount)) { return responseObject(res, 400, 'Insufficient wallet balance.', 'error'); }

    const senderPrivateKey = senderWallet.decryptPrivateKey(transactionPin);
    const recipientAddress = recipientWallet ? recipientWallet.address : recipient;

    if (senderWallet.address === recipientAddress) { return responseObject(res, 400, 'Same wallet transfer not supported.', 'error'); }

    const { hash, timestamp } = await sendToken(
      senderWallet.address,
      recipientAddress,
      amount,
      senderPrivateKey,
    );

    const newTransaction = await saveTransaction({
      sender: senderWallet.address,
      recipient,
      hash,
      amount,
      blockchainTimestamp: timestamp,
    });
    transactionLogger.log('info', `Transaction ${newTransaction._id} successful`);
    return responseObject(res, 201, newTransaction, 'data');
  } catch (err) {
    transactionLogger.log('error', `Transaction error: ${err.message}`);
    return responseObject(res, 500, `Transaction error: ${err.message}`, 'error');
  }
};

const getTransactions = async (req, res) => {
  const { userId } = req;
  const wallet = await findUserWallet(userId);
  try {
    let transactions = await findWalletTransactions(wallet);
    transactions = transactions.map((transaction) => {
      const tx = transaction.toJSON();
      if (tx.sender === wallet.address) tx.type = 'sent';
      else tx.type = 'received';
      return tx;
    });
    transactionLogger.log('info', `Transactions for user ${userId} retrieved.`);
    return responseObject(res, 200, transactions, 'data');
  } catch (err) {
    transactionLogger.log('error', `Error retrieving transactions: ${err.message}`);
    return responseObject(res, 500, `Error retrieving transactions: ${err.message}`, 'error');
  }
};

const getTransaction = async (req, res) => {
  const { params: { id }, userId } = req;
  const userWallet = await findUserWallet(userId);
  try {
    const transaction = await findTransaction(id);
    if (!transaction) return responseObject(res, 400, 'Transaction not found.', 'error');
    const txJson = transaction.toJSON();
    txJson.type = txJson.sender === userWallet.address ? 'sent' : 'received';
    transactionLogger.log('info', `Transactions for user ${id} retrieved.`);
    return responseObject(res, 200, txJson || [], 'data');
  } catch (err) {
    transactionLogger.log('error', `Error retrieving transaction: ${err.message}`);
    return responseObject(res, 500, `Error retrieving transaction: ${err.message}`, 'error');
  }
};

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
};
