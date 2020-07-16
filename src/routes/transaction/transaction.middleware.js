const { body, validationResult } = require('express-validator');
const { responseObject } = require('../../utils');

class TransactionMiddleware {
  static createTransactionValidationRules() {
    return [
      body('recipient')
        .isLength({ min: 1 })
        .withMessage('Recipeint is required.'),
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

  static validate(req, res, next) {
    const errors = validationResult(req);

    if (errors.isEmpty()) return next();

    const extractedErrors = [];

    errors
      .array()
      .forEach((err) => extractedErrors.push({ [err.param]: err.msg }));

    return responseObject(res, 400, extractedErrors, 'errors');
  }
}

module.exports = TransactionMiddleware;
