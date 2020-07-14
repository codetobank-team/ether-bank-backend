const router = require('express').Router();
const { register, login } = require('./auth.controller');
const AuthMiddleware = require('./auth.middleware');

router.post(
  '/register',
  AuthMiddleware.registerValidationRules(),
  AuthMiddleware.validate,
  AuthMiddleware.checkExistingEmail,
  register,
);
router.post(
  '/login',
  AuthMiddleware.loginValidationRules(),
  AuthMiddleware.validate,
  login,
);

module.exports = router;
