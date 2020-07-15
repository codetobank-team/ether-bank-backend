const { Wallet } = require('../../database/models');

const findUserWallet = async (userId) => Wallet.findOne({ userId }).exec();

module.exports = { findUserWallet };
