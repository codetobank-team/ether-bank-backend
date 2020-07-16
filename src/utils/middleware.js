/* eslint-disable global-require */
const {
  verify,
} = require('./jwt');
const { getAsync, setAsync } = require('../redis');
const responseObject = require('./responseObject');

const checkTransactionPin = async (req, res, next) => {
  const { body: { transactionPin }, userId } = req;
  const { findUserById } = require('../routes/user/user.service');
  try {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found.');
    const isPinValid = await user.compareTransactionPin(transactionPin);
    if (!isPinValid) throw new Error('Wrong transaction PIN');
    next();
  } catch (error) {
    return responseObject(res, 400, `Error: ${error.message}`, 'error');
  }
};

const checkPassword = async (req, res, next) => {
  const { body: { password }, userId } = req;
  const { findUserById } = require('../routes/user/user.service');
  try {
    const user = await findUserById(userId);
    if (!user) throw new Error('User not found.');
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw new Error('Wrong password');
    return next();
  } catch (error) {
    return responseObject(res, 400, `Error: ${error.message}`);
  }
};

const checkLogin = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) return responseObject(res, 401, 'Please provide an authorization header', 'error');

    const token = authHeader.split(' ')[1];
    if (!token) return responseObject(res, 401, 'Please add token to authorization header', 'error');

    const payload = verify(token);
    if (!payload) return responseObject(res, 401, 'Invalid token', 'error');
    const { id } = payload;

    const cachedToken = await getAsync(`${id}-token`);

    if (!cachedToken || token !== cachedToken) return responseObject(res, 401, 'Session timeout. Please log in.', 'error');

    // overwrite the key with a new TLL of five minutes
    await setAsync(`${id}-token`, token, 'EX', 60 * 5);

    req.userId = id;
    next();
  } catch (err) {
    return responseObject(res, 500, `Error: ${err.message}`, 'error');
  }
};

module.exports = { checkTransactionPin, checkPassword, checkLogin };
