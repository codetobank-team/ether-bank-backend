const { saveUser, findUser, findUserById } = require('./auth.service');
const { createUserWallet } = require('../wallet/wallet.service');
const { setAsync, delAsync } = require('../../redis');
const {
  logger,
  jwtUtils: { sign },
  responseObject,
} = require('../../utils');

const authLogger = logger(module);

const register = async (req, res) => {
  let wallet = {};
  const {
    firstName,
    lastName,
    email,
    password,
    transactionPin,
  } = req.body;

  try {
    const { _id } = await saveUser({
      firstName,
      lastName,
      email,
      password,
      transactionPin,
    });

    if (_id) {
      wallet = await createUserWallet(_id, transactionPin);
    }

    authLogger.log('info', `User ${firstName} ${lastName} - ${email} created.`);
    const token = sign({ id: _id });
    // FIXME: reduce TTL
    await setAsync(`${_id}-token`, token, 'EX', 60 * 60 * 24);

    return responseObject(
      res,
      201,
      {
        id: _id, firstName, lastName, email, wallet,
      },
      'data',
      token,
    );
  } catch (err) {
    authLogger.log('error', `Error registering user: ${err.message}`);
    return responseObject(res, 500, `Error registering user: ${err.message}`, 'error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser(email);

    if (!user) return responseObject(res, 401, 'Incorrect username or password.', 'error');

    const isMatch = await user.comparePassword(password);

    if (!isMatch) return responseObject(res, 401, 'Incorrect username or password.', 'error');

    const { _id, firstName, lastName } = user;

    authLogger.log('info', `User ${firstName} ${lastName} - ${email} logged in.`);
    const token = sign({ id: _id });
    // FIXME: reduce TTL
    await setAsync(`${_id}-token`, token, 'EX', 60 * 60 * 24);

    return responseObject(
      res,
      200,
      { id: _id, firstName, lastName },
      'data',
      token,
    );
  } catch (err) {
    authLogger.log('error', `Error login user in: ${err.message}`);
    return responseObject(res, 500, `Error login user in: ${err.message}`, 'error');
  }
};

const user = async (req, res) => {
  const { userId } = req;

  try {
    const currentUser = await findUserById(userId);
    authLogger.log('info', `User with ${userId} retrieved.`);
    return responseObject(res, 200, currentUser, 'data');
  } catch (error) {
    authLogger.log('error', `Error retrieving user: ${error.message}`);
    return responseObject(res, 500, `Error retrieving user: ${error.message}`, 'error');
  }
};

const logout = async (req, res) => {
  try {
    const { userId } = req;
    await delAsync(`${userId}-token`);
    authLogger.log('info', `User ${userId} logged out.`);

    return responseObject(res, 200, 'You were successfully logged out', 'message');
  } catch (err) {
    authLogger.log('error', `Error login user out: ${err.message}`);
    return responseObject(res, 500, `Error login user out: ${err.message}`, 'error');
  }
};

module.exports = {
  register,
  login,
  user,
  logout,
};
