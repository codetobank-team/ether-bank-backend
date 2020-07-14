const {
  responseObject,
  jwtUtils: { verify },
} = require('./index');
const { getAsync } = require('../redis');

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  try {
    const token = req.get('Authorization').split(' ')[1];
    const { id } = req.body;

    if (!token) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    const cachedToken = await getAsync(`${id}-token`);

    if (!cachedToken || token !== cachedToken) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    const payload = verify(token);

    if (!payload) return responseObject(res, 401, 'You must be logged in to use this endpoint', 'error');

    req.userId = payload.id;
    next();
  } catch (err) {
    return responseObject(res, 500, `Eror: ${err.message}`, 'error');
  }
};
