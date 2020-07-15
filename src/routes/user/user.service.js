const { User } = require('../../database/models');

const findUserById = (id) => User.findById(id).exec();

module.exports = { findUserById };
