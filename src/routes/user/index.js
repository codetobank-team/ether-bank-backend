const router = require('express').Router();
const { getUser } = require('./user.controller');
const UserMiddleware = require('./user.middleware');
const { isLoggedIn } = require('../../utils');

router.get('/:id', isLoggedIn, UserMiddleware.validateUserExists, getUser);

module.exports = router;
