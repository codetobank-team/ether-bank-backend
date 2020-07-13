const { saveUser, findUser } = require('./auth.service');
const { setAsync } = require('../../redis');
const {
  logger,
  jwtUtils: { sign },
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
    await setAsync(`${_id}-token`, token);

    return res.status(201).json({
      status: 201,
      token,
      data: {
        firstName,
        lastName,
        email,
      },
    });
  } catch (err) {
    authLogger.log('error', `Error registering user: ${err.message}`);

    return res.status(500).json({
      status: 500,
      error: `Error registering user: ${err.message}`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser(email);

    if (!user) {
      return res.status(400).json({
        status: 400,
        error: 'Incorrect username or password.',
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        error: 'No incorrect username or password.',
      });
    }

    const { _id, firstName, lastName } = user;

    authLogger.log('info', `User ${firstName} ${lastName} - ${email} logged in.`);
    const token = sign({ id: _id });
    await setAsync(`${_id}-token`, token);

    return res.status(200).json({
      status: 200,
      token,
      data: {
        firstName,
        lastName,
      },
    });
  } catch (err) {
    authLogger.log('error', `Error login user in: ${err.message}`);

    return res.status(500).json({
      status: 500,
      error: `Error login user in: ${err.message}`,
    });
  }
};

module.exports = {
  register,
  login,
};
