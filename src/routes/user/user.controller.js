const { findUser } = require('./user.service');
const { logger, responseObject } = require('../../utils');

const userLogger = logger(module);

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await findUser(id);
    userLogger.log('info', `User with ${id} retrieved.`);
    return responseObject(res, 200, user, 'data');
  } catch (error) {
    userLogger.log('error', `Error retrieving user: ${error.message}`);
    return responseObject(res, 500, `Error retrieving user: ${error.message}`, 'error');
  }
};

module.exports = {
  getUser,
};
