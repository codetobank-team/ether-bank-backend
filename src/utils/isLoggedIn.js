const {
  verify,
} = require('./jwt');
const responseObject = require('./responseObject');
const { getAsync } = require('../redis');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');
    if (!authHeader) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    const token = authHeader.split(' ')[1];
    if (!token) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    const payload = verify(token);
    if (!payload) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');
    const { id } = payload;

    const cachedToken = await getAsync(`${id}-token`);

    if (!cachedToken || token !== cachedToken) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    req.userId = id;
    next();
  } catch (err) {
    return responseObject(res, 500, `Error: ${err.message}`, 'error');
  }
};
