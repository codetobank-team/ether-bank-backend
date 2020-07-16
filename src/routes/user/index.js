const router = require('express').Router();
const { getUser } = require('./user.controller');
const UserMiddleware = require('./user.middleware');
const { middleware: { checkLogin } } = require('../../utils');

router.get('/:id', checkLogin, UserMiddleware.validateUserExists, getUser);

module.exports = router;
