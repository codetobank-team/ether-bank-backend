const bcrypt = require('bcryptjs');

module.exports = {
  hash: async (str) => {
    const salt = await bcrypt.genSalt(10);
    const hashedStr = await bcrypt.hash(str, salt);

    return hashedStr;
  },
  compare: async (str, hashStr) => {
    const result = await bcrypt.compare(str, hashStr);

    return result;
  },
};
