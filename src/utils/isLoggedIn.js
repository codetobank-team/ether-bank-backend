const {
  verify,
} = require('./jwt');
const responseObject = require('./responseObject');
const { getAsync, setAsync } = require('../redis');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
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
