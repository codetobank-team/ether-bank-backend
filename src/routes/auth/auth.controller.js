const { saveUser, findUser } = require('./auth.service');
const { logger } = require('../../utils');

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
    await saveUser({
      firstName,
      lastName,
      email,
      password,
      transactionPin,
    });

    authLogger.log('info', `User ${firstName} ${lastName} - ${email} created.`);

    return res.status(201).json({
      status: 201,
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
      message: `Error registering user: ${err.message}`,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUser(email);
    const isMatch = user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({
        status: 400,
        error: 'No incorrect username or password.',
      });
    }

    authLogger.log('info', `${email} logged in.`);

    return res.status(200).json({
      status: 200,
      data: {},
    });
  } catch (err) {
    authLogger.log('error', `Error login user in: ${err.message}`);

    return res.status(500).json({
      status: 500,
      message: `Error login user in: ${err.message}`,
    });
  }
};

module.exports = {
  register,
  login,
};
