const { body, param, validationResult } = require('express-validator');
const { findUserById } = require('../auth/auth.service');
const { responseObject, logger } = require('../../utils');

const transactionMiddlewareLogger = logger(module);

class TransactionMiddleware {
  static createTransactionValidationRules() {
    return [
      body('senderId').isMongoId(),
      body('receiverId').isMongoId(),
      body('transactionType')
        .isIn(['SENT', 'RECEIVED'])
        .withMessage('Transaction type can only be SENT or RECEIVED'),
      body('transactionStatus')
        .isIn(['PENDING', 'COMPLETED', 'FAILED'])
        .withMessage(
          'Transaction status can only be PENDING, COMPLETED or FAILED',
        ),
      body('email').isEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least six characters long.'),
      body('amount').isLength({ min: 1 }),
    ];
  }

  static getTransactionsValidationRules() {
    return [param('id').isMongoId().withMessage('Invalid user ID')];
  }

  static validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors
      .array()
      .forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    return responseObject(res, 400, extractedErrors, 'error');
  }

  // eslint-disable-next-line consistent-return
  static async validateUserWithIdExist(req, res, next) {
    const { senderId, receiverId } = req.body;

    try {
      const userSender = await findUserById(senderId);
      const userReceiver = await findUserById(receiverId);

      if (!userSender || !userReceiver) return responseObject(res, 400, 'User with that ID does not exist', 'error');

      next();
    } catch (err) {
      transactionMiddlewareLogger.log(
        'error',
        `Error retrieving user: ${err.message}`,
      );
      return responseObject(res, 500, `Error retrieving user: ${err.message}`);
    }
  }
}

module.exports = TransactionMiddleware;
