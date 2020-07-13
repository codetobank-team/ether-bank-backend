const { saveUser } = require('./auth.service');
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

    return res.status(201).json({
      status: 201,
      data: {
        firstName,
        lastName,
        email,
      },
    });
  } catch (err) {
    authLogger('error', `Error registering user: ${err.message}`);

    return res.status(500).json({
      status: 500,
      message: `Error registering user: ${err.message}`,
    });
  }
};

module.exports = {
  register,
};
