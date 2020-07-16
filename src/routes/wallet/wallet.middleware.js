/* eslint-disable consistent-return */
const { body, validationResult } = require('express-validator');
const { findUserWallet } = require('./wallet.service');
const { logger, responseObject } = require('../../utils');

const walletMiddlewareLogger = logger(module);

class WalletMiddleware {
  static validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors
      .array()
      .forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    return responseObject(res, 400, extractedErrors, 'errors');
  }

  static createWalletValidationRules() {
    return [
      body('transactionPin')
        .isLength({ min: 4, max: 4 })
        .withMessage('Transaction pin must be four digits.')
        .isNumeric()
        .withMessage('Transaction pin must be numeric.'),
    ];
  }

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
