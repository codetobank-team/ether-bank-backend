const { User } = require('../../database/models');

const findUser = async (userId) => User.findById(userId).exec();

module.exports = { findUser };
