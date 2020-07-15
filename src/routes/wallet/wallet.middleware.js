/* eslint-disable consistent-return */

const { logger, responseObject } = require('../../utils');
const { findUserWallet } = require('./wallet.service');

const walletMiddlewareLogger = logger(module);

class WalletMiddleware {
  static async validateUserWalletExists(req, res, next) {
    const { userId } = req;

    try {
      const wallet = await findUserWallet(userId);

      if (!wallet) return responseObject(res, 400, 'User wallet not found.', 'error');
      next();
    } catch (error) {
      walletMiddlewareLogger.log('error', `Error retrieving user wallet: ${error.message}`);
      return responseObject(res, 500, `Error retrieving user wallet: ${error.message}`);
    }
  }
}

module.exports = WalletMiddleware;
