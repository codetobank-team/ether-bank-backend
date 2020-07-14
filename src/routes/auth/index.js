const router = require('express').Router();
const { register, login, logout } = require('./auth.controller');
const AuthMiddleware = require('./auth.middleware');
const { isLoggedIn } = require('../../utils');

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
router.post(
  '/logout',
  AuthMiddleware.logoutValidationRules(),
  AuthMiddleware.validate,
  isLoggedIn,
  logout,
);

module.exports = router;
