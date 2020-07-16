const { findUserWallet, createUserWallet, getAddressBalance } = require('./wallet.service');
const { logger, responseObject } = require('../../utils');

const walletLogger = logger(module);

const getWallet = async (req, res) => {
  const { userId } = req;
  try {
    const wallet = await findUserWallet(userId);
    const balance = await getAddressBalance(wallet.address);
    walletLogger.log('info', `User wallet retrieved: ${userId}`);
    return responseObject(res, 200, { balance, ...wallet.toJSON() }, 'data');
  } catch (error) {
    walletLogger.log('error', `Error fetching user wallet: ${error.message}`);
    return responseObject(res, 500, `Error fetching user wallet: ${error.message}`, 'error');
  }
};

const createWallet = async (req, res) => {
  const { body: { transactionPin }, userId } = req;
  try {
    const wallet = await createUserWallet(userId, transactionPin);
    const balance = await getAddressBalance(wallet.address);
    return responseObject(res, 201, { balance, ...wallet.toJSON() }, 'data');
  } catch (error) {
    return responseObject(res, 500, `Error creating user wallet: ${error.message}`, 'error');
  }
};

module.exports = { getWallet, createWallet };
