const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

module.exports = {
  sign: (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: 60 * 60 * 24  }),
  verify: (token) => jwt.verify(token, JWT_SECRET),
};
