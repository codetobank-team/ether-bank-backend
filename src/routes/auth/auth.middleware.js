const { body, validationResult } = require('express-validator');
const { responseObject } = require('../../utils');

class AuthMiddleware {
  static registerValidationRules() {
    return [
      body('firstName').isLength({ min: 2 }),
      body('lastName').isLength({ min: 2 }),
      body('email').isEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least six characters long.'),
      body('transactionPin')
        .isLength({ min: 4, max: 4 })
        .withMessage('Transaction pin must be four digits.')
        .isNumeric()
        .withMessage('Transaction pin must be digits.'),
    ];
  }

  static loginValidationRules() {
    return [
      body('email').isEmail(),
      body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least six characters long.'),
    ];
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
}

module.exports = AuthMiddleware;
