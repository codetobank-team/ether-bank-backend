const { body, param, validationResult } = require('express-validator');
// const { findUserById } = require('../auth/auth.service');
const { responseObject } = require('../../utils');

// const transactionMiddlewareLogger = logger(module);

class TransactionMiddleware {
  static createTransactionValidationRules() {
    return [
      // body('senderId').isMongoId(),
      // body('receiverId').isMongoId(),
      // body('transactionType')
      //   .isIn(['sent', 'received'])
      //   .withMessage('Transaction type can only be sent or received'),
      // body('transactionStatus')
      //   .isIn(['pending', 'completed', 'failed'])
      //   .withMessage(
      //     'Transaction status can only be pending, completed or failed',
      //   ),
      body('address').isEthereumAddress(),
      body('amount')
        .isNumeric()
        .withMessage('Amount must be numeric')
        .isInt({ gt: 0 })
        .withMessage('Amount must be greater than 0'),
      body('transactionPin')
        .isLength({ min: 4, max: 4 })
        .withMessage('Transaction PIN length must be 4.')
        .isNumeric()
        .withMessage('Transaction PIN must be numeric.'),
    ];
  }

  static getTransactionsValidationRules() {
    return [param('id').isMongoId().withMessage('Invalid transaction ID')];
  }

  static validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors
      .array()
      .forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    return responseObject(res, 400, extractedErrors, 'errors');
  }

  // eslint-disable-next-line consistent-return
  /*
  static async validateUserWithIdExist(req, res, next) {
    const { senderId, receiverId } = req.body;

    try {
      const userSender = await findUserById(senderId);
      const userReceiver = await findUserById(receiverId);

      if (!userSender || !userReceiver)
        return responseObject(res, 400, 'User with that ID does not exist', 'error');

      next();
    } catch (err) {
      transactionMiddlewareLogger.log(
        'error',
        `Error retrieving user: ${err.message}`,
      );
      return responseObject(res, 500, `Error retrieving user: ${err.message}`);
    }
  }
  */
}

module.exports = TransactionMiddleware;
