const { saveUser, findUser } = require('./auth.service');
const { setAsync, delAsync } = require('../../redis');
const {
  logger,
  jwtUtils: { sign },
  responseObject,
} = require('../../utils');

const authLogger = logger(module);

const register = async (req, res) => {
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

    authLogger.log('info', `User ${firstName} ${lastName} - ${email} created.`);
    const token = sign({ id: _id });
    await setAsync(`${_id}-token`, token, 'EX', 60 * 30);

    return responseObject(
      res,
      201,
      {
        id: _id, firstName, lastName, email,
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
    await setAsync(`${_id}-token`, token, 'EX', 60 * 30);

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
  logout,
};
