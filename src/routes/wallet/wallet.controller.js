const { findUserWallet } = require('./wallet.service');
const { logger, responseObject } = require('../../utils');

const walletLogger = logger(module);

const getUserWallet = async (req, res) => {
  const { userId } = req;
  try {
    const wallet = await findUserWallet(userId);
    walletLogger.log('info', `User wallet retrieved: ${userId}`);
    return responseObject(res, 200, wallet, 'data');
  } catch (error) {
    walletLogger.log('error', `Error fetching user wallet: ${error.message}`);
    return responseObject(res, 500, `Error fetching user wallet: ${error.message}`, 'error');
  }
};

module.exports = { getUserWallet };
