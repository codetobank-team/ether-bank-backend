const { Wallet } = require('../../database/models');

const {
  findWalletReceivedTransactions,
  findWalletSentTransactions,
} = require('../transaction/transaction.service');
const {
  logger, blockUtils: { createWallet },
  accountNumber: { generate }, cryptoUtils: { encrypt },
} = require('../../utils');

const WalletServiceLogger = logger(module);

const findWalletByAddressOrAccountNumber = async (data) => Wallet.findOne({
  $or: [{ address: data }, { accountNumber: data }],
}).exec();

const findUserWallet = async (userId) => Wallet.findOne({ userId }).exec();

const createUserWallet = async (userId, userPin) => {
  let wallet = await findUserWallet(userId);
  if (!wallet) {
    const { address, privateKey } = createWallet();
    const accountNumber = (await generate()).toString();
    const safePrivateKey = encrypt(privateKey, userPin);
    try {
      wallet = new Wallet({
        userId, accountNumber, address, privateKey: safePrivateKey,
      }).save();
      WalletServiceLogger.log('info', `Wallet created: ${wallet.address}`);
    } catch (error) {
      WalletServiceLogger.log('error', `Error creating user wallet: ${userId}`);
      wallet = null;
    }
  }
  return wallet;
};

const dbTotalSpend = async (wallet) => {
  const sentTxs = await findWalletSentTransactions(wallet);
  if (!sentTxs.length) return 0;
  const total = await sentTxs.map((tx) => tx.amount).reduce((totalAmt, amt) => totalAmt + amt);
  return total;
};

const dbTotalReceived = async (wallet) => {
  const receivedTxs = await findWalletReceivedTransactions(wallet);
  if (!receivedTxs.length) return 0;
  const total = await receivedTxs.map((tx) => tx.amount).reduce((totalAmt, amt) => totalAmt + amt);
  return total;
};

const getAddressBalance = async (address) => {
  // Blockchain implementation
  // return addressBalance(address);

  // DB value implementation
  const wallet = await findWalletByAddressOrAccountNumber(address);
  const sent = await dbTotalSpend(wallet);
  const received = await dbTotalReceived(wallet);
  return sent > received ? 0 : received - sent;
};

module.exports = {
  findUserWallet, createUserWallet, findWalletByAddressOrAccountNumber, getAddressBalance,
};
