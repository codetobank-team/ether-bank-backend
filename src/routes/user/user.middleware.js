/* eslint-disable consistent-return */

const { logger, responseObject } = require('../../utils');
const { findUserById } = require('./user.service');

const userMiddlewareLogger = logger(module);

class UserMiddleware {
  static async validateUserExists(req, res, next) {
    const { id } = req.params;

    try {
      const wallet = await findUserById(id);
      if (!wallet) return responseObject(res, 400, 'User not found.', 'error');
      next();
    } catch (error) {
      userMiddlewareLogger.log('error', `Error retrieving user: ${error.message}`);
      return responseObject(res, 500, `Error retrieving user: ${error.message}`);
    }
  }
}

module.exports = UserMiddleware;
